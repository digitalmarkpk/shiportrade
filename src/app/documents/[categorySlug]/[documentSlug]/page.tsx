import DocumentGeneratorPageClient from "./document-generator-page-client";

type PageProps = {
  params: Promise<{ categorySlug: string; documentSlug: string }>;
};

export default async function DocumentGeneratorPage({ params }: PageProps) {
  const { categorySlug, documentSlug } = await params;
  return (
    <DocumentGeneratorPageClient
      categorySlug={categorySlug}
      documentSlug={documentSlug}
    />
  );
}
