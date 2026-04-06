/**
 * WebSite Schema Component (Server Component)
 * Adds JSON-LD structured data for WebSite with SearchAction
 * Enables sitelinks searchbox in Google search results
 */

export interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  description?: string;
  searchUrl?: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

const defaultWebSiteData = {
  name: "Shiportrade",
  url: "https://shiportrade.com",
  description: "Global trade and logistics intelligence platform",
  searchUrl: "https://shiportrade.com/ai-search"
};

export function WebSiteSchema({
  name = defaultWebSiteData.name,
  url = defaultWebSiteData.url,
  description = defaultWebSiteData.description,
  searchUrl = defaultWebSiteData.searchUrl
}: WebSiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${searchUrl}?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
