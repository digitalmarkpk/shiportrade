'use client';

/**
 * CombinedSchemas Component
 * A convenience component to render multiple JSON-LD schemas at once
 * Useful for pages that need multiple structured data types
 */

import { OrganizationSchema } from './OrganizationSchema';
import { WebSiteSchema } from './WebSiteSchema';
import { FAQSchema, type FAQItem } from './FAQSchema';
import { SoftwareApplicationSchema, type SoftwareApplicationSchemaProps } from './SoftwareApplicationSchema';
import { BreadcrumbSchema, type BreadcrumbItem } from './BreadcrumbSchema';
import { ArticleSchema, type ArticleSchemaProps } from './ArticleSchema';

export interface CombinedSchemasProps {
  organization?: boolean;
  website?: boolean;
  faq?: FAQItem[];
  softwareApplication?: SoftwareApplicationSchemaProps;
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleSchemaProps;
}

export function CombinedSchemas({
  organization = false,
  website = false,
  faq,
  softwareApplication,
  breadcrumbs,
  article
}: CombinedSchemasProps) {
  return (
    <>
      {organization && <OrganizationSchema />}
      {website && <WebSiteSchema />}
      {faq && faq.length > 0 && <FAQSchema faqs={faq} />}
      {softwareApplication && <SoftwareApplicationSchema {...softwareApplication} />}
      {breadcrumbs && breadcrumbs.length > 0 && <BreadcrumbSchema items={breadcrumbs} />}
      {article && <ArticleSchema {...article} />}
    </>
  );
}
