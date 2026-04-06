"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calculator, FileText, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getRelatedTools, getCrossCategoryRelatedTools, toolCategories, type Tool } from "@/lib/constants/tools";

interface RelatedContentSuggestionsProps {
  currentToolId: string;
  categorySlug: string;
  showCrossCategory?: boolean;
}

export function RelatedContentSuggestions({
  currentToolId,
  categorySlug,
  showCrossCategory = true,
}: RelatedContentSuggestionsProps) {
  const relatedInCategory = getRelatedTools(currentToolId, categorySlug, 4);
  const crossCategoryTools = showCrossCategory ? getCrossCategoryRelatedTools(categorySlug, 3) : [];
  
  if (relatedInCategory.length === 0 && crossCategoryTools.length === 0) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      {/* Related Tools in Same Category */}
      {relatedInCategory.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calculator className="h-5 w-5 text-[var(--ocean)]" />
            Related Tools
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedInCategory.map((tool, index) => (
              <RelatedToolCard key={tool.id} tool={tool} categorySlug={categorySlug} index={index} />
            ))}
          </div>
        </div>
      )}
      
      {/* Cross-Category Related Tools */}
      {crossCategoryTools.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-[var(--logistics)]" />
            You May Also Like
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {crossCategoryTools.map((tool, index) => {
              // Find the category slug for this tool
              const toolCategory = getCategorySlugForTool(tool.id);
              return (
                <RelatedToolCard 
                  key={tool.id} 
                  tool={tool} 
                  categorySlug={toolCategory} 
                  index={index}
                  variant="featured"
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface RelatedToolCardProps {
  tool: Tool;
  categorySlug: string;
  index: number;
  variant?: "default" | "featured";
}

function RelatedToolCard({ tool, categorySlug, index, variant = "default" }: RelatedToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/tools/${categorySlug}/${tool.slug}`}>
        <Card className={`h-full cursor-pointer transition-all hover:shadow-lg group ${
          variant === "featured" 
            ? "border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5" 
            : "border hover:border-[var(--ocean)]/50"
        }`}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center">
                <Calculator className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div className="flex gap-1">
                {tool.featured && (
                  <Badge variant="secondary" className="text-xs">
                    <Star className="h-3 w-3 mr-1 fill-amber-500 text-amber-500" />
                    Popular
                  </Badge>
                )}
                {tool.isNew && (
                  <Badge className="text-xs bg-green-500/10 text-green-600 border-green-500/20">
                    New
                  </Badge>
                )}
              </div>
            </div>
            <h4 className="font-semibold text-sm group-hover:text-[var(--ocean)] transition-colors line-clamp-1">
              {tool.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
              {tool.description}
            </p>
            <div className="flex items-center text-xs text-[var(--ocean)] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Open Tool</span>
              <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

// Helper function to get category slug for a tool
function getCategorySlugForTool(toolId: string): string {
  // Import at top level to avoid require
  const categories = toolCategories;
  for (const category of categories) {
    if (category.tools.some((t: Tool) => t.id === toolId)) {
      return category.slug;
    }
  }
  return "tools";
}

// Related Documents Component
interface RelatedDocumentsProps {
  documentType: string;
  currentDocumentId: string;
}

export function RelatedDocuments({ documentType, currentDocumentId }: RelatedDocumentsProps) {
  // Simulated related documents based on document type
  const relatedDocs = getRelatedDocumentsByType(documentType, currentDocumentId);
  
  if (relatedDocs.length === 0) {
    return null;
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="h-5 w-5 text-[var(--logistics)]" />
        Related Documents
      </h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {relatedDocs.map((doc, index) => (
          <motion.div
            key={doc.slug}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/documents/${doc.category}/${doc.slug}`}>
              <Card className="h-full cursor-pointer border hover:border-[var(--logistics)]/50 transition-all hover:shadow-lg group">
                <CardContent className="p-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center mb-3">
                    <FileText className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <h4 className="font-semibold text-sm group-hover:text-[var(--logistics)] transition-colors">
                    {doc.name}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {doc.description}
                  </p>
                  <div className="flex items-center text-xs text-[var(--logistics)] font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Open Template</span>
                    <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Helper function to get related documents by type
function getRelatedDocumentsByType(documentType: string, currentId: string) {
  const documentRelations: Record<string, Array<{ name: string; slug: string; description: string; category: string }>> = {
    "commercial-invoice": [
      { name: "Pro Forma Invoice", slug: "pro-forma-invoice", description: "Preliminary invoice for quotations", category: "international-trade" },
      { name: "Packing List", slug: "packing-list", description: "Detailed cargo contents list", category: "international-trade" },
      { name: "Certificate of Origin", slug: "certificate-of-origin", description: "Country of origin certification", category: "customs" },
    ],
    "bill-of-lading": [
      { name: "Shipping Instructions", slug: "shipping-instructions", description: "Carrier handling instructions", category: "ocean-freight" },
      { name: "Container Release Order", slug: "container-release-order", description: "Container pickup authorization", category: "ocean-freight" },
      { name: "VGM Declaration", slug: "vgm-declaration", description: "Verified Gross Mass declaration", category: "ocean-freight" },
    ],
    "packing-list": [
      { name: "Commercial Invoice", slug: "commercial-invoice", description: "Final bill for customs", category: "international-trade" },
      { name: "Bill of Lading", slug: "bill-of-lading", description: "Contract of carriage", category: "ocean-freight" },
    ],
    "certificate-of-origin": [
      { name: "Commercial Invoice", slug: "commercial-invoice", description: "Final bill for customs", category: "international-trade" },
      { name: "FTA Eligibility Document", slug: "fta-eligibility", description: "Trade agreement verification", category: "customs" },
    ],
  };
  
  const docs = documentRelations[documentType] || [];
  return docs.filter(d => d.slug !== currentId);
}
