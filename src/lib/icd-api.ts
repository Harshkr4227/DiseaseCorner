import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.WHO_ICD_CLIENT_ID;
const CLIENT_SECRET = process.env.WHO_ICD_CLIENT_SECRET;
const TOKEN_ENDPOINT = 'https://icdaccessmanagement.who.int/connect/token';
const API_BASE_URL = 'https://id.who.int/icd/release/11/2024-01/mms';
const SEARCH_ENDPOINT = 'https://id.who.int/icd/release/11/2024-01/mms/search';

let accessToken: string | null = null;
let tokenExpiry: number | null = null;

async function getAccessToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error("WHO ICD API Credentials missing");
      throw new Error("API configuration error");
  }

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'icdapi_access');

  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      },
      body: params,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch token:', response.status, errorText);
      throw new Error(`Failed to fetch access token: ${response.status}`);
    }

    const data = await response.json();
    accessToken = data.access_token;
    // Set expiry to slightly less than actual duration to be safe (e.g., - 5 minutes)
    tokenExpiry = Date.now() + (data.expires_in * 1000) - 300000; 
    return accessToken;

  } catch (error) {
    console.error('Error getting access token:', error);
    throw error;
  }
}

export interface ICDSearchResult {
    title: string;
    id: string; // The UI might expect 'id' but API returns generic structure. careful with mapping.
    definition: string;
    score: number;
    theCode?: string;
    chapter?: string;
    uri: string;
}

export async function searchICD(query: string): Promise<ICDSearchResult[]> {
  const token = await getAccessToken();
  
  // Construct URL with query parameters
  // Use flexible search and looking for properties like Title, Synonym
  const searchUrl = `${SEARCH_ENDPOINT}?q=${encodeURIComponent(query)}&useFlexisearch=true&flatResults=false`;

  try {
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
        'API-Version': 'v2',
        'Accept-Language': 'en'
      }
    });

    if (!response.ok) {
        console.error('ICD Search failed', response.status, await response.text());
        return [];
    }

    const data = await response.json();
    
    // Transform API response to match our app's expected Interface or similar
    // The API returns a structure like { destinationEntities: [...] }
    if (data.destinationEntities) {
        return data.destinationEntities.map((entity: any) => {
            const fullUri = entity.uri || entity.id;
            // Extract the ID part after the version/linearization (e.g., everything after /mms/)
            let entityId = entity.theCode;
            if (!entityId && fullUri) {
                const mmsKey = '/mms/';
                const mmsIndex = fullUri.indexOf(mmsKey);
                if (mmsIndex !== -1) {
                    entityId = fullUri.substring(mmsIndex + mmsKey.length);
                } else {
                    entityId = fullUri.replace(/\/$/, '').split('/').pop();
                }
            }
            
            return {
                id: entityId || "unknown", 
                title: entity.title,
                definition: entity.title, 
                uri: fullUri, 
                score: entity.score
            };
        });
    }

    return [];

  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}

export async function getEntityDetails(idOrUri: string) {
    const token = await getAccessToken();
    
    let url = idOrUri;
    if (!url.startsWith('http')) {
        url = `${API_BASE_URL}/${idOrUri}`; 
    }

    // Force HTTPS for WHO ICD endpoints to avoid mixed content or redirect issues
    if (url.includes('id.who.int')) {
        url = url.replace('http://', 'https://');
    }

    try {
        console.log(`[ICD API] Fetching details for: ${url}`);
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'API-Version': 'v2',
                'Accept-Language': 'en'
            }
        });

        if (!response.ok) {
             console.error(`[ICD API] Get Details failed. Status: ${response.status}, URL: ${url}`);
             return null;
        }

        const data = await response.json();
        console.log(`[ICD API] Successfully fetched details for: ${url}`);
        return data;

    } catch (error) {
        console.error(`[ICD API] Get Details error:`, error);
        return null;
    }
}
