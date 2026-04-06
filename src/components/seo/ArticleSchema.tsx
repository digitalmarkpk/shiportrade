'use client';

/**
 * Article Schema Component
 * Adds JSON-LD structured data for articles and educational content
 * Useful for tool documentation and guides
 */

export interface ArticleSchemaProps {
  headline: string;
  description: string;
  author?: string;
  datePublished?: string;
  dateModified?: string;
  image?: string;
  articleBody?: string;
  wordCount?: number;
}

export function ArticleSchema({
  headline,
  description,
  author = "Shiportrade Team",
  datePublished,
  dateModified,
  image,
  articleBody,
  wordCount
}: ArticleSchemaProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    author: {
      "@type": "Organization",
      name: author
    },
    publisher: {
      "@type": "Organization",
      name: "Shiportrade",
      logo: {
        "@type": "ImageObject",
        url: "https://shiportrade.com/logo.png"
      }
    }
  };

  if (datePublished) {
    schema.datePublished = datePublished;
  }

  if (dateModified) {
    schema.dateModified = dateModified;
  }

  if (image) {
    schema.image = image;
  }

  if (articleBody) {
    schema.articleBody = articleBody;
  }

  if (wordCount) {
    schema.wordCount = wordCount;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
