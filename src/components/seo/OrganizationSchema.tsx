/**
 * Organization Schema Component (Server Component)
 * Adds JSON-LD structured data for Organization to improve SEO
 * Includes company info, logo, social media profiles, and contact points
 */

export interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    contactType: string;
    telephone?: string;
    email?: string;
    availableLanguage?: string[];
  };
}

const defaultOrganizationData = {
  name: "Shiportrade",
  url: "https://shiportrade.com",
  logo: "https://shiportrade.com/logo.png",
  description: "Global trade and logistics intelligence platform providing calculators, document generators, and comprehensive trade intelligence for supply chain professionals.",
  sameAs: [
    "https://linkedin.com/company/shiportrade",
    "https://twitter.com/shiportrade"
  ],
  contactPoint: {
    contactType: "customer service",
    availableLanguage: ["English", "Chinese", "Spanish"]
  }
};

export function OrganizationSchema({
  name = defaultOrganizationData.name,
  url = defaultOrganizationData.url,
  logo = defaultOrganizationData.logo,
  description = defaultOrganizationData.description,
  sameAs = defaultOrganizationData.sameAs,
  contactPoint = defaultOrganizationData.contactPoint
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    sameAs,
    contactPoint: {
      "@type": "ContactPoint",
      ...contactPoint
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
