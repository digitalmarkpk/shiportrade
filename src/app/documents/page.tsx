import DocumentsPageClient from "./documents-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DocumentsPage({ searchParams }: PageProps) {
  await searchParams;
  return <DocumentsPageClient />;
}
