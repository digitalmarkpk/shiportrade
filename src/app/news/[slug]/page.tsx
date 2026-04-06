import { Metadata } from "next";
import NewsDetailClient from "./NewsDetailClient";

// Generate dynamic metadata for SEO
export async function generateMetadata({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { id } = await searchParams;
  
  // Default metadata
  const defaultMetadata: Metadata = {
    title: "News Article | Shiportrade",
    description: "Read the latest trade news and industry insights on Shiportrade.",
  };
  
  if (!id) {
    return defaultMetadata;
  }
  
  try {
    // Fetch news data for SEO
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://shiportrade.com'}/api/news?limit=100`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      return defaultMetadata;
    }
    
    const data = await response.json();
    const news = data.data?.find((item: { id: string }) => item.id === id);
    
    if (!news) {
      return defaultMetadata;
    }
    
    const url = `https://shiportrade.com/news/${slug}?id=${id}`;
    
    return {
      title: `${news.title} | Shiportrade News`,
      description: news.excerpt,
      keywords: [news.category, "trade news", "shipping news", "logistics", news.source],
      authors: [{ name: news.source }],
      openGraph: {
        title: news.title,
        description: news.excerpt,
        url,
        siteName: "Shiportrade",
        type: "article",
        publishedTime: news.publishedAt,
        authors: [news.source],
        images: news.imageUrl ? [
          {
            url: news.imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: news.title,
        description: news.excerpt,
        images: news.imageUrl ? [news.imageUrl] : [],
      },
      alternates: {
        canonical: url,
      },
      other: {
        "article:published_time": news.publishedAt,
        "article:author": news.source,
        "article:section": news.category,
      },
    };
  } catch {
    return defaultMetadata;
  }
}

// JSON-LD Structured Data for NewsArticle
async function generateJsonLd({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const { id } = await searchParams;
  
  if (!id) return null;
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://shiportrade.com'}/api/news?limit=100`, {
      cache: 'no-store',
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const news = data.data?.find((item: { id: string }) => item.id === id);
    
    if (!news) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": news.title,
      "description": news.excerpt,
      "image": news.imageUrl || "https://shiportrade.com/og-news.png",
      "datePublished": news.publishedAt,
      "dateModified": news.publishedAt,
      "author": {
        "@type": "Organization",
        "name": news.source,
        "url": news.sourceUrl,
      },
      "publisher": {
        "@type": "Organization",
        "name": "Shiportrade",
        "logo": {
          "@type": "ImageObject",
          "url": "https://shiportrade.com/logo.svg",
        },
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://shiportrade.com/news/${news.slug}?id=${news.id}`,
      },
      "articleSection": news.category,
      "keywords": [news.category, "trade", "shipping", "logistics", "supply chain"],
    };
  } catch {
    return null;
  }
}

export default async function NewsDetailPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const jsonLd = await generateJsonLd({ searchParams: Promise.resolve(resolvedSearchParams) });
  
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <NewsDetailClient slug={slug} />
    </>
  );
}
