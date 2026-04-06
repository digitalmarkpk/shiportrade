'use client';

/**
 * LocalBusiness Schema Component
 * Adds JSON-LD structured data for local business presence
 * Useful for office locations or service centers
 */

export interface LocalBusinessSchemaProps {
  name?: string;
  description?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone?: string;
  email?: string;
  openingHours?: string[];
  geo?: {
    latitude: number;
    longitude: number;
  };
}

export function LocalBusinessSchema({
  name = "Shiportrade",
  description = "Global trade and logistics intelligence platform",
  address,
  telephone,
  email,
  openingHours,
  geo
}: LocalBusinessSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    url: "https://shiportrade.com",
    logo: "https://shiportrade.com/logo.png"
  };

  if (address) {
    schema.address = {
      "@type": "PostalAddress",
      ...address
    };
  }

  if (telephone) {
    schema.telephone = telephone;
  }

  if (email) {
    schema.email = email;
  }

  if (openingHours) {
    schema.openingHours = openingHours;
  }

  if (geo) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: geo.latitude,
      longitude: geo.longitude
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
