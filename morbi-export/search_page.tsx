import Link from "next/link"
import { searchICD } from "@/lib/icd-api"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Search Results - Morbi",
  description: "Find information about diseases, symptoms, and treatments.",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const params = await searchParams; // Await the promise in newer Next.js versions
  const query = params.q || ""
  // If no query, we might want to show nothing or trending. For now, empty list if no query.
  const results = query ? await searchICD(query) : []

  return (
    <div className="container px-4 md:px-6 py-12">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold font-serif text-[#111111]">
          {query ? `Results for "${query}"` : "Browse Diseases"}
        </h1>
        <p className="text-[#333333] font-serif italic">
          Found {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20 bg-[#F9F7F1] border-2 border-[#111111]/10 rounded-md">
          <h2 className="text-xl font-semibold mb-2 font-serif text-[#111111]">No results found</h2>
          <p className="text-[#333333] max-w-md mx-auto mb-6">
            We couldn't find any diseases matching your terms. Try checking your spelling or use more general keywords.
            <br/><span className="text-xs text-[#333333]/60">(Powered by WHO ICD API)</span>
          </p>
          <Button variant="secondary" asChild className="border-2 border-[#111111] hover:bg-[#111111] hover:text-white">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {results.map((disease) => {
             // Encode the URI/ID to be safe in URL
             const slug = encodeURIComponent(disease.uri);
             return (
            <Link href={`/disease/${slug}`} key={disease.id} className="block h-full group">
              <Card className="h-full border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all bg-white rounded-md">
                <CardHeader className="border-b border-[#111111]/5 pb-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl text-[#111111] font-serif font-bold group-hover:underline decoration-1 underline-offset-4 line-clamp-2">{disease.title}</CardTitle>
                    {disease.theCode && (
                        <span className="text-xs font-medium px-2 py-1 bg-[#111111]/5 text-[#111111] rounded-sm border border-[#111111]/10 whitespace-nowrap ml-2">
                        {disease.theCode}
                        </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <CardDescription className="line-clamp-3 text-[#333333] leading-relaxed">
                    {/* Definition might be HTML or simple text. In search result it's title often. */}
                    {disease.definition || "No definition available."}
                  </CardDescription>
                </CardContent>
                <CardFooter className="pt-0">
                  <span className="text-sm font-medium text-[#111111] flex items-center font-serif italic group-hover:underline decoration-1 underline-offset-4">
                    Read more <span className="ml-1">→</span>
                  </span>
                </CardFooter>
              </Card>
            </Link>
          )})}
        </div>
      )}
    </div>
  )
}
