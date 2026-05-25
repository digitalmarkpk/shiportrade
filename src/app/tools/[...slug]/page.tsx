import ToolsSlugPageClient from "./tools-slug-page-client";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function ToolsSlugPage({ params }: PageProps) {
  const { slug } = await params;
  return <ToolsSlugPageClient slug={slug} />;
}
