"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { documentCategories } from "@/lib/constants/tools";
import { getDocumentFields } from "@/lib/constants/documentFields";
import GenericDocumentGenerator from "@/components/documents/GenericDocumentGenerator";

// Import specialized generators with advanced features
import CommercialInvoiceGenerator from "@/components/documents/CommercialInvoiceGenerator";
import BillOfLadingGenerator from "@/components/documents/BillOfLadingGenerator";
import AirWaybillGenerator from "@/components/documents/AirWaybillGenerator";
import LetterOfCreditGenerator from "@/components/documents/LetterOfCreditGenerator";
import InsuranceCertificateGenerator from "@/components/documents/InsuranceCertificateGenerator";
import ExportDeclarationGenerator from "@/components/documents/ExportDeclarationGenerator";

// Named exports
import { PackingListGenerator } from "@/components/documents/PackingListGenerator";
import { ShippingInstructionsGenerator } from "@/components/documents/ShippingInstructionsGenerator";
import { CertificateOfOriginGenerator } from "@/components/documents/CertificateOfOriginGenerator";

// Map document slugs to specialized generators
const specializedGenerators: Record<string, React.ComponentType<any>> = {
  "commercial-invoice": CommercialInvoiceGenerator,
  "bill-of-lading": BillOfLadingGenerator,
  "air-waybill": AirWaybillGenerator,
  "letter-of-credit": LetterOfCreditGenerator,
  "insurance-certificate": InsuranceCertificateGenerator,
  "packing-list": PackingListGenerator,
  "shipping-instructions": ShippingInstructionsGenerator,
  "certificate-of-origin": CertificateOfOriginGenerator,
  "export-declaration": ExportDeclarationGenerator,
};

export default function DocumentGeneratorPage() {
  const params = useParams();
  const categorySlug = params.categorySlug as string;
  const documentSlug = params.documentSlug as string;

  const { category, document, Generator } = useMemo(() => {
    const cat = documentCategories.find(c => c.slug === categorySlug);
    const doc = cat?.documents.find(d => d.slug === documentSlug);
    const fieldConfig = getDocumentFields(documentSlug);
    
    // Check for specialized generator exists
    const SpecializedGenerator = specializedGenerators[documentSlug];
    
    // If specialized generator exists, use it
    if (SpecializedGenerator) {
      return { 
        category: cat, 
        document: doc,
        Generator: SpecializedGenerator 
      };
    }
    
    // Otherwise, create a generic generator with field config
    const GenericWrapper = () => (
      <GenericDocumentGenerator
        documentTitle={doc?.name || "Trade Document"}
        documentDescription={fieldConfig.description}
        fields={fieldConfig.fields}
        categorySlug={categorySlug}
      />
    );
    
    return { 
      category: cat, 
      document: doc,
      Generator: GenericWrapper 
    };
  }, [categorySlug, documentSlug]);

  if (!category || !document) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <FileText className="h-10 w-10 text-slate-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Document Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The document you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href={`/documents/${categorySlug || ''}`}>
                View Category
              </Link>
            </Button>
            <Button asChild>
              <Link href="/documents">All Documents</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <Generator />;
}
