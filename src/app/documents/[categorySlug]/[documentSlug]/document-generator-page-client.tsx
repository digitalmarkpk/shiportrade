"use client";

import { notFound } from 'next/navigation';
import { useMemo } from "react";
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

export default function DocumentGeneratorPage({
  categorySlug,
  documentSlug,
}: {
  categorySlug: string;
  documentSlug: string;
}) {

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
    notFound();
    return null;
  }

  return <Generator />;
}
