/**
 * SEO Schema Components
 * JSON-LD structured data components for improved SEO
 * 
 * Usage:
 * - OrganizationSchema: Add to root layout for company information
 * - WebSiteSchema: Add to root layout for sitelinks searchbox
 * - FAQSchema: Add to tool pages with FAQ sections
 * - SoftwareApplicationSchema: Add to calculator/tool pages
 * - BreadcrumbSchema: Add to all pages for navigation
 * - CombinedSchemas: Convenience component for multiple schemas
 */

export { OrganizationSchema, type OrganizationSchemaProps } from './OrganizationSchema';
export { WebSiteSchema, type WebSiteSchemaProps } from './WebSiteSchema';
export { FAQSchema, createFAQSchema, type FAQItem, type FAQSchemaProps } from './FAQSchema';
export { 
  SoftwareApplicationSchema, 
  createToolSchema, 
  TOOL_CATEGORIES, 
  type SoftwareApplicationSchemaProps 
} from './SoftwareApplicationSchema';
export { 
  BreadcrumbSchema, 
  createBreadcrumbs, 
  BREADCRUMB_TEMPLATES,
  type BreadcrumbItem, 
  type BreadcrumbSchemaProps 
} from './BreadcrumbSchema';
export { ProductSchema, type ProductSchemaProps } from './ProductSchema';
export { ArticleSchema, type ArticleSchemaProps } from './ArticleSchema';
export { LocalBusinessSchema, type LocalBusinessSchemaProps } from './LocalBusinessSchema';
export { CombinedSchemas, type CombinedSchemasProps } from './CombinedSchemas';
