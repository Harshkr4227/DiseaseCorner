import { getEntityDetails } from "@/lib/icd-api"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Share2, Bookmark, FileText, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = (await params)
  const decodedSlug = decodeURIComponent(slug);
  const disease = await getEntityDetails(decodedSlug)
  
  if (!disease) return { title: "Disease Not Found" }
  
  // Clean up title (API might return HTML or plain text)
  const title = disease.title?.replace(/<[^>]*>/g, '') || "Disease Detail";

  return {
    title: `${title} - Morbi`,
    description: "Definition and details from WHO ICD.",
  }
}

export default async function DiseasePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = (await params)
  const decodedSlug = decodeURIComponent(slug);
  const disease = await getEntityDetails(decodedSlug)

  if (!disease) {
    notFound()
  }

  // Helper to safely get definition
  const definition = disease.definition ? disease.definition['@value'] || disease.definition : "No definition provided by WHO ICD.";
  const title = disease.title ? disease.title.replace(/<[^>]*>/g, '') : "Unknown Condition";
  const synonyms = disease.synonym || [];
  const inclusions = disease.inclusion || [];
  const exclusions = disease.exclusion || [];

  return (
    <div className="min-h-screen bg-[#F9F7F1]/30 pb-20">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-[#111111]/10">
        <div className="container px-4 md:px-6 py-4">
          <Link href="/search" className="inline-flex items-center text-sm text-[#333333] hover:text-[#111111] transition-colors font-serif italic text-base">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Search
          </Link>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-[#111111]/10 pb-12 pt-8">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-sm border border-[#111111]/20 bg-[#F9F7F1] text-[#111111] text-sm font-medium mb-4 font-serif">
                 ICD-11
              </span>
              <h1 className="text-3xl md:text-5xl font-bold font-serif text-[#111111] mb-4" dangerouslySetInnerHTML={{ __html: disease.title }}>
              </h1>
              <div className="text-lg md:text-xl text-[#333333] max-w-3xl leading-relaxed font-serif" dangerouslySetInnerHTML={{ __html: definition }}>
              </div>
            </div>
            <div className="flex space-x-3 mt-4 md:mt-0">
              <Button variant="secondary" size="sm" className="gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-sm shadow-none">
                <Bookmark className="h-4 w-4" /> Save
              </Button>
              <Button variant="secondary" size="sm" className="gap-2 border-2 border-[#111111] hover:bg-[#111111] hover:text-white transition-all rounded-sm shadow-none">
                <Share2 className="h-4 w-4" /> Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="container px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Synonyms */}
          {synonyms.length > 0 && (
          <Card className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] rounded-sm">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2 border-b border-[#111111]/10">
              <div className="h-10 w-10 rounded-full bg-[#111111]/5 flex items-center justify-center text-[#111111]">
                <Info className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif font-bold">Synonyms</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="grid grid-cols-1 gap-2">
                {synonyms.map((syn: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 mt-2 h-1.5 w-1.5 rounded-full bg-[#111111] shrink-0" />
                    <span dangerouslySetInnerHTML={{__html: syn.label ? syn.label['@value'] || syn.label : syn}}></span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          )}

          {/* Inclusions */}
          {inclusions.length > 0 && (
          <Card className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] rounded-sm">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2 border-b border-[#111111]/10">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-800 border border-green-200">
                <FileText className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif font-bold">Inclusions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {inclusions.map((inc: any, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="mr-2 mt-2 h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                    <span dangerouslySetInnerHTML={{__html: inc.label ? inc.label['@value'] || inc.label : inc}}></span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          )}

           {/* Exclusions */}
           {exclusions.length > 0 && (
          <Card className="border-2 border-[#111111] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] rounded-sm">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2 border-b border-[#111111]/10">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 border border-red-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <CardTitle className="font-serif font-bold">Exclusions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2">
                {exclusions.map((exc: any, idx: number) => (
                  <li key={idx} className="flex items-start text-[#333333]"> 
                    <span className="mr-2 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                    <span dangerouslySetInnerHTML={{__html: exc.label ? exc.label['@value'] || exc.label : exc}}></span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          )}
          
          {/* Note if no content */}
          {synonyms.length === 0 && inclusions.length === 0 && exclusions.length === 0 && (
             <div className="col-span-1 lg:col-span-2 text-center text-[#333333] italic font-serif py-12">
                Additional clinical details are available in the full WHO ICD-11 classification.
             </div>
          )}

        </div>
      </div>
    </div>
  )
}
