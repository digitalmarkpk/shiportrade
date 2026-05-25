import DocumentsSlugPageClient from "./documents-slug-page-client";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function DocumentsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <DocumentsSlugPageClient slug={slug} />;
}
