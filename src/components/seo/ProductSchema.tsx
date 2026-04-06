'use client';

/**
 * Product Schema Component
 * Adds JSON-LD structured data for products/services
 * Useful for premium plans or paid features
 */

export interface ProductSchemaProps {
  name: string;
  description: string;
  brand?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    priceValidUntil?: string;
    availability?: string;
  };
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
  };
  category?: string;
  image?: string;
}

export function ProductSchema({
  name,
  description,
  brand = "Shiportrade",
  offers,
  aggregateRating,
  category,
  image
}: ProductSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    brand: {
      "@type": "Brand",
      name: brand
    }
  };

  if (category) {
    schema.category = category;
  }

  if (image) {
    schema.image = image;
  }

  if (offers) {
    schema.offers = {
      "@type": "Offer",
      price: offers.price,
      priceCurrency: offers.priceCurrency,
      ...(offers.priceValidUntil && { priceValidUntil: offers.priceValidUntil }),
      ...(offers.availability && { availability: `https://schema.org/${offers.availability}` })
    };
  }

  if (aggregateRating) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
