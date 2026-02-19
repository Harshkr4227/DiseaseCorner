import { NextResponse } from 'next/server';

const CLIENT_ID = process.env.WHO_ICD_CLIENT_ID;
const CLIENT_SECRET = process.env.WHO_ICD_CLIENT_SECRET;
const TOKEN_ENDPOINT = 'https://icdaccessmanagement.who.int/connect/token';
const API_BASE_URL = 'https://id.who.int/icd/entity';
const SEARCH_ENDPOINT = 'https://id.who.int/icd/entity/search';

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
        return data.destinationEntities.map((entity: any) => ({
            id: entity.theCode || entity.id, // Use code if available, else generic ID
            title: entity.title,
            definition: entity.title, // API search result might not have full definition, use title as fallback
            uri: entity.id, // The full URI
            score: entity.score
        }));
    }

    return [];

  } catch (error) {
    console.error('Search API error:', error);
    return [];
  }
}

export async function getEntityDetails(idOrUri: string) {
    const token = await getAccessToken();
    // If it's a full URI, use it. If it's just a code/id, construct URL.
    // For simplicity, let's assume we pass the full URI or we might need to look it up.
    // However, the search result returns the URI.
    
    let url = idOrUri;
    if (!url.startsWith('http')) {
        // It's likely a code or id, but the API endpoint structure is complex. 
        // Best to use the URI returned from search.
        // Fallback or specific logic might be needed if we only have a code.
        url = `${API_BASE_URL}/${idOrUri}`; 
    }

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
                'API-Version': 'v2',
                'Accept-Language': 'en'
            }
        });

        if (!response.ok) {
             console.error('Get Details failed', response.status);
             return null;
        }

        return await response.json();

    } catch (error) {
        console.error('Get Details error:', error);
        return null;
    }
}
