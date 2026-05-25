import ToolsPageClient from "./tools-page-client";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ToolsPage({ searchParams }: PageProps) {
  await searchParams;
  return <ToolsPageClient />;
}
