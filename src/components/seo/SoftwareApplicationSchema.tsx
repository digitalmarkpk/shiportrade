'use client';

/**
 * SoftwareApplication Schema Component
 * Adds JSON-LD structured data for web applications/tools/calculators
 * Helps search engines understand tool functionality and pricing
 */

export interface SoftwareApplicationSchemaProps {
  name: string;
  description?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
  author?: {
    name: string;
    url?: string;
  };
}

const defaultApplicationData = {
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  offers: {
    price: "0",
    priceCurrency: "USD"
  }
};

export function SoftwareApplicationSchema({
  name,
  description,
  applicationCategory = defaultApplicationData.applicationCategory,
  operatingSystem = defaultApplicationData.operatingSystem,
  offers = defaultApplicationData.offers,
  aggregateRating,
  author
}: SoftwareApplicationSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    applicationCategory,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency
    }
  };

  if (description) {
    schema.description = description;
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      ratingCount: aggregateRating.ratingCount
    };
  }

  if (author) {
    schema.author = {
      "@type": "Organization",
      name: author.name,
      ...(author.url && { url: author.url })
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * Predefined tool schema generator for common tools
 */
export function createToolSchema(
  toolName: string,
  toolDescription: string,
  category: string = "BusinessApplication"
): SoftwareApplicationSchemaProps {
  return {
    name: toolName,
    description: toolDescription,
    applicationCategory: category,
    operatingSystem: "Web",
    offers: {
      price: "0",
      priceCurrency: "USD"
    },
    author: {
      name: "Shiportrade",
      url: "https://shiportrade.com"
    }
  };
}

/**
 * Common tool categories for reference
 */
export const TOOL_CATEGORIES = {
  CALCULATOR: "BusinessApplication",
  CONVERTER: "UtilityApplication",
  GENERATOR: "BusinessApplication",
  ANALYZER: "BusinessApplication",
  TRACKER: "BusinessApplication",
  PLANNER: "BusinessApplication",
  OPTIMIZER: "BusinessApplication"
} as const;
