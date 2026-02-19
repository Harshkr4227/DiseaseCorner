import { searchICD } from "@/lib/icd-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json([])
  }

  const results = await searchICD(query)
  return NextResponse.json(results.slice(0, 5)) // Limit to top 5 for autocomplete
}
