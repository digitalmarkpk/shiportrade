'use client';

/**
 * BreadcrumbList Schema Component
 * Adds JSON-LD structured data for breadcrumb navigation
 * Improves search result display with breadcrumb trails
 */

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Helper function to create breadcrumb items from path segments
 */
export function createBreadcrumbs(
  basePath: string,
  segments: { name: string; path: string }[]
): BreadcrumbItem[] {
  const baseUrl = "https://shiportrade.com";
  
  return [
    { name: "Home", url: baseUrl },
    ...segments.map((segment) => ({
      name: segment.name,
      url: `${baseUrl}${basePath}${segment.path}`
    }))
  ];
}

/**
 * Common breadcrumb patterns for the site
 */
export const BREADCRUMB_TEMPLATES = {
  tools: (toolName: string, category?: string) => {
    const items: BreadcrumbItem[] = [
      { name: "Home", url: "https://shiportrade.com" },
      { name: "Tools", url: "https://shiportrade.com/tools" }
    ];
    
    if (category) {
      items.push({
        name: category,
        url: `https://shiportrade.com/tools/${category.toLowerCase().replace(/\s+/g, '-')}`
      });
    }
    
    items.push({
      name: toolName,
      url: `https://shiportrade.com/tools/${category ? `${category.toLowerCase().replace(/\s+/g, '-')}/` : ''}${toolName.toLowerCase().replace(/\s+/g, '-')}`
    });
    
    return items;
  },
  
  documents: (documentName: string, category?: string) => {
    const items: BreadcrumbItem[] = [
      { name: "Home", url: "https://shiportrade.com" },
      { name: "Documents", url: "https://shiportrade.com/documents" }
    ];
    
    if (category) {
      items.push({
        name: category,
        url: `https://shiportrade.com/documents/${category.toLowerCase().replace(/\s+/g, '-')}`
      });
    }
    
    items.push({
      name: documentName,
      url: `https://shiportrade.com/documents/${category ? `${category.toLowerCase().replace(/\s+/g, '-')}/` : ''}${documentName.toLowerCase().replace(/\s+/g, '-')}`
    });
    
    return items;
  }
};
