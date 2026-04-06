'use client';

/**
 * FAQ Schema Component
 * Adds JSON-LD structured data for FAQ pages
 * Enables FAQ rich snippets in Google search results
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQSchemaProps {
  faqs: FAQItem[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
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
 * Helper function to create FAQ schema from simple Q&A pairs
 */
export function createFAQSchema(items: [string, string][]): FAQItem[] {
  return items.map(([question, answer]) => ({ question, answer }));
}
