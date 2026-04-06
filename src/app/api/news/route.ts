import { NextRequest, NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  region: string;
  isAlert: boolean;
  trending: boolean;
  imageUrl?: string;
  imageCredit?: string;
  imageSource?: string;
}

// RSS Feed sources with their configurations - Expanded list
const RSS_SOURCES = [
  // Maritime & Shipping
  { name: 'FreightWaves', url: 'https://www.freightwaves.com/feed', region: 'global', category: 'Logistics' },
  { name: 'Hellenic Shipping News', url: 'https://www.hellenicshippingnews.com/feed', region: 'global', category: 'Ocean Freight' },
  { name: 'Splash 247', url: 'https://splash247.com/feed/', region: 'global', category: 'Ocean Freight' },
  { name: 'gCaptain', url: 'https://gcaptain.com/feed/', region: 'global', category: 'Ocean Freight' },
  { name: 'Marine Insight', url: 'https://www.marineinsight.com/feed/', region: 'global', category: 'Ocean Freight' },
  { name: 'Port Technology', url: 'https://www.porttechnology.org/feed/', region: 'global', category: 'Technology' },
  { name: 'Seatrade Maritime', url: 'https://www.seatrade-maritime.com/rss.xml', region: 'global', category: 'Ocean Freight' },
  { name: 'Marine Log', url: 'https://www.marinelog.com/feed/', region: 'global', category: 'Ocean Freight' },
  { name: 'Maritime Executive', url: 'https://maritime-executive.com/rss', region: 'global', category: 'Ocean Freight' },
  { name: 'Lloyd\'s List', url: 'https://lloydslist.maritimeintelligence.informa.com/rss', region: 'global', category: 'Ocean Freight' },
  
  // Trade Finance & Commodities
  { name: 'Ship & Bunker', url: 'https://feeds.feedburner.com/shipandbunker', region: 'global', category: 'Trade Finance' },
  { name: 'Oil Price', url: 'https://oilprice.com/rss.xml', region: 'global', category: 'Trade Finance' },
  { name: 'Reuters Commodities', url: 'https://www.reuters.com/markets/commodities/rss', region: 'global', category: 'Trade Finance' },
  
  // Regional - Asia Pacific
  { name: 'Logistics Middle East', url: 'https://www.logisticsmiddleeast.com/feed', region: 'middle-east', category: 'Logistics' },
  { name: 'Maritime Gateway', url: 'https://www.maritimegateway.com/feed/', region: 'asia-pacific', category: 'Ocean Freight' },
  { name: 'Hong Kong Maritime Hub', url: 'https://www.hongkongmaritimehub.com/feed/', region: 'asia-pacific', category: 'Ocean Freight' },
  { name: 'Seatrade Maritime Asia', url: 'https://www.seatrade-maritime.com/asia/rss.xml', region: 'asia-pacific', category: 'Ocean Freight' },
  
  // Geopolitical Sources
  { name: 'Reuters World', url: 'https://www.reuters.com/world/rss', region: 'global', category: 'Geopolitical' },
  { name: 'BBC World Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', region: 'global', category: 'Trade Finance' },
  { name: 'Al Jazeera Economy', url: 'https://www.aljazeera.com/xml/rss/economy.xml', region: 'global', category: 'Geopolitical' },
  { name: 'Financial Times', url: 'https://www.ft.com/rss/home', region: 'global', category: 'Trade Finance' },
  { name: 'DW Economy', url: 'https://rss.dw.com/sitemap-compass-en-economy.xml', region: 'global', category: 'Trade Finance' },
];

// Category-specific default images (Unsplash - Copyright free) with proper attribution
const CATEGORY_IMAGES: Record<string, { url: string; credit: string; author: string; link: string }> = {
  'Ocean Freight': { 
    url: 'https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Ant Rozetsky',
    author: 'Ant Rozetsky',
    link: 'https://unsplash.com/@antonrozetsky'
  },
  'Air Freight': { 
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by 张 鑫',
    author: '张 鑫',
    link: 'https://unsplash.com/@zhang_xinn'
  },
  'Trade Finance': { 
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Michael Longmire',
    author: 'Michael Longmire',
    link: 'https://unsplash.com/@mlongmire'
  },
  'Customs': { 
    url: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Mick Haupt',
    author: 'Mick Haupt',
    link: 'https://unsplash.com/@rojekilian'
  },
  'Technology': { 
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Louis Reed',
    author: 'Louis Reed',
    link: 'https://unsplash.com/@_louisreed'
  },
  'Sustainability': { 
    url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Matt Howard',
    author: 'Matt Howard',
    link: 'https://unsplash.com/@thematthoward'
  },
  'Logistics': { 
    url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Kyle Deang',
    author: 'Kyle Deang',
    link: 'https://unsplash.com/@kyledeang'
  },
  'E-Commerce': { 
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by CardMapr',
    author: 'CardMapr',
    link: 'https://unsplash.com/@cardmapr'
  },
  'Geopolitical': { 
    url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop&q=80',
    credit: 'Photo by Colin Watts',
    author: 'Colin Watts',
    link: 'https://unsplash.com/@colin_watts'
  },
};

// Create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
}

// Normalize title for deduplication
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .trim()
    .substring(0, 100); // Limit length for comparison
}

// Calculate similarity between two strings (Levenshtein-based)
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  if (s1.length === 0 || s2.length === 0) return 0;
  
  // Use first 50 characters for quick comparison
  const prefix1 = s1.substring(0, 50);
  const prefix2 = s2.substring(0, 50);
  
  if (prefix1 === prefix2) return 0.95;
  
  // Simple Jaccard similarity on words
  const words1 = new Set(s1.split(/\s+/).filter(w => w.length > 3));
  const words2 = new Set(s2.split(/\s+/).filter(w => w.length > 3));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

// Deduplicate news items
function deduplicateNews(items: NewsItem[]): NewsItem[] {
  const seen = new Map<string, NewsItem>();
  
  for (const item of items) {
    const normalizedTitle = normalizeTitle(item.title);
    const key = `${item.source}-${normalizedTitle}`;
    
    // Check if we already have this exact title from this source
    if (seen.has(key)) {
      continue;
    }
    
    // Check for similar titles from the same source
    let isDuplicate = false;
    for (const [existingKey, existingItem] of seen.entries()) {
      if (existingItem.source === item.source) {
        const similarity = calculateSimilarity(item.title, existingItem.title);
        if (similarity > 0.8) {
          isDuplicate = true;
          break;
        }
      }
    }
    
    if (!isDuplicate) {
      seen.set(key, item);
    }
  }
  
  return Array.from(seen.values());
}

// Decode all HTML entities (named and numeric)
function decodeHtmlEntities(text: string): string {
  // First pass: decode numeric entities (decimal and hex)
  let decoded = text
    // Decimal entities like &#160; &#8211;
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(parseInt(dec, 10)))
    // Hex entities like &#x20; &#xA0;
    .replace(/&#x([0-9a-fA-F]+);/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));

  // Second pass: decode common named entities
  const namedEntities: Record<string, string> = {
    '&nbsp;': ' ',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': "'",
    '&#39;': "'",
    '&ndash;': '–',
    '&mdash;': '—',
    '&lsquo;': "'",
    '&rsquo;': "'",
    '&ldquo;': '"',
    '&rdquo;': '"',
    '&hellip;': '...',
    '&bull;': '•',
    '&copy;': '©',
    '&reg;': '®',
    '&trade;': '™',
    '&euro;': '€',
    '&pound;': '£',
    '&yen;': '¥',
    '&cent;': '¢',
    '&deg;': '°',
    '&plusmn;': '±',
    '&times;': '×',
    '&divide;': '÷',
    '&frac12;': '½',
    '&frac14;': '¼',
    '&frac34;': '¾',
    '&para;': '¶',
    '&sect;': '§',
    '&dagger;': '†',
    '&Dagger;': '‡',
    '&permil;': '‰',
    '&laquo;': '«',
    '&raquo;': '»',
    '&iexcl;': '¡',
    '&iquest;': '¿',
  };

  for (const [entity, char] of Object.entries(namedEntities)) {
    decoded = decoded.split(entity).join(char);
  }

  return decoded;
}

// Clean HTML from text
function cleanHtml(html: string): string {
  // First remove CDATA markers
  let cleaned = html.replace(/<!\[CDATA\[|\]\]>/g, '');

  // Remove all HTML tags
  cleaned = cleaned.replace(/<[^>]*>/g, '');

  // Decode all HTML entities (both numeric and named)
  cleaned = decodeHtmlEntities(cleaned);

  // Clean up multiple spaces and trim
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  return cleaned;
}

// Truncate text
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Extract image from RSS item with proper attribution
function extractImage(itemXml: string, sourceName: string): { url: string; credit: string; source: string } | null {
  try {
    // 1. Try media:content (most common in news feeds)
    const mediaContentMatch = itemXml.match(/<media:content[^>]*url=["']([^"']+)["'][^>]*>/i);
    if (mediaContentMatch && mediaContentMatch[1]) {
      return {
        url: mediaContentMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 2. Try media:thumbnail
    const mediaThumbnailMatch = itemXml.match(/<media:thumbnail[^>]*url=["']([^"']+)["'][^>]*>/i);
    if (mediaThumbnailMatch && mediaThumbnailMatch[1]) {
      return {
        url: mediaThumbnailMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 3. Try enclosure (podcast-style image attachments)
    const enclosureMatch = itemXml.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*>/i);
    if (enclosureMatch && enclosureMatch[1] && enclosureMatch[1].match(/\.(jpg|jpeg|png|gif|webp)/i)) {
      return {
        url: enclosureMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 4. Try content:encoded for embedded images
    const contentEncodedMatch = itemXml.match(/<content:encoded[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/i);
    if (contentEncodedMatch) {
      const imgMatch = contentEncodedMatch[1].match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgMatch && imgMatch[1]) {
        return {
          url: imgMatch[1],
          credit: `Image via ${sourceName}`,
          source: sourceName
        };
      }
    }

    // 5. Try description for embedded images
    const descMatch = itemXml.match(/<description[^>]*><!\[CDATA\[([\s\S]*?)\]\]><\/description>/i);
    if (descMatch) {
      const imgMatch = descMatch[1].match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgMatch && imgMatch[1] && !imgMatch[1].includes('emoji') && !imgMatch[1].includes('icon') && !imgMatch[1].includes('avatar') && !imgMatch[1].includes('pixel') && !imgMatch[1].includes('tracking')) {
        return {
          url: imgMatch[1],
          credit: `Image via ${sourceName}`,
          source: sourceName
        };
      }
    }

    // 6. Try dc:creator with image
    const creatorImgMatch = itemXml.match(/<dc:creator[^>]*image=["']([^"']+)["']/i);
    if (creatorImgMatch && creatorImgMatch[1]) {
      return {
        url: creatorImgMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 7. Try image tag directly (some feeds use this)
    const imageTagMatch = itemXml.match(/<image[^>]*><url>([^<]+)<\/url>/i) || itemXml.match(/<image>([^<]+)<\/image>/i);
    if (imageTagMatch && imageTagMatch[1] && imageTagMatch[1].includes('http')) {
      return {
        url: imageTagMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 8. Try featured-image or thumbnail meta
    const featuredMatch = itemXml.match(/<(?:featured-image|thumbnail|featuredimage)[^>]*>([^<]+)<\//i);
    if (featuredMatch && featuredMatch[1] && featuredMatch[1].includes('http')) {
      return {
        url: featuredMatch[1],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    // 9. Try CDATA sections for any image URL
    const cdataMatches = itemXml.match(/<!\[CDATA\[([\s\S]*?)\]\]>/gi) || [];
    for (const cdata of cdataMatches) {
      const imgUrlMatch = cdata.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"']*)?/i);
      if (imgUrlMatch && !imgUrlMatch[0].includes('favicon') && !imgUrlMatch[0].includes('logo') && !imgUrlMatch[0].includes('icon')) {
        return {
          url: imgUrlMatch[0],
          credit: `Image via ${sourceName}`,
          source: sourceName
        };
      }
    }

    // 10. Look for any direct image URL in the item
    const directImgMatch = itemXml.match(/https?:\/\/[^\s"']+\.(?:jpg|jpeg|png|gif|webp)(?:\?[^\s"']*)?/i);
    if (directImgMatch && directImgMatch[0] && !directImgMatch[0].includes('pixel') && !directImgMatch[0].includes('tracking') && !directImgMatch[0].includes('1x1') && !directImgMatch[0].includes('favicon') && !directImgMatch[0].includes('logo')) {
      return {
        url: directImgMatch[0],
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}

// Fetch image from article page (for sources that don't include images in RSS)
async function fetchImageFromArticle(articleUrl: string, sourceName: string): Promise<{ url: string; credit: string; source: string } | null> {
  try {
    const response = await fetch(articleUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // 1. Try Open Graph image (most common)
    const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']+)["']/i) ||
                        html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*property=["']og:image["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
      return {
        url: ogImageMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    // 2. Try Twitter card image
    const twitterImageMatch = html.match(/<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']+)["']/i) || 
                              html.match(/<meta[^>]*content=["']([^"']+)["'][^>]*name=["']twitter:image["']/i);
    if (twitterImageMatch && twitterImageMatch[1]) {
      return {
        url: twitterImageMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    // 3. Try schema.org image (JSON-LD format)
    const schemaMatch = html.match(/"image"\s*:\s*\[?\s*"([^"]+)"/i) ||
                       html.match(/"image"\s*:\s*\{[^}]*"url"\s*:\s*"([^"]+)"/i);
    if (schemaMatch && schemaMatch[1]) {
      return {
        url: schemaMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    // 4. Try article featured image with various class patterns
    const articleImgPatterns = [
      /<img[^>]*(?:class=["'][^"']*(?:featured|main|article|hero|post|single|content|entry|thumbnail|attachment|wp-post)[^"']*["'])[^>]*src=["']([^"']+)["']/i,
      /<img[^>]*src=["']([^"']+)["'][^>]*(?:class=["'][^"']*(?:featured|main|article|hero|post|single|content|entry|thumbnail|attachment|wp-post)[^"']*["'])/i,
      /<figure[^>]*class=["'][^"']*(?:featured|hero|main)[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i,
      /<div[^>]*class=["'][^"']*(?:featured-image|post-thumbnail|article-image|hero-image)[^"']*["'][^>]*>[\s\S]*?<img[^>]*src=["']([^"']+)["']/i,
    ];
    
    for (const pattern of articleImgPatterns) {
      const match = html.match(pattern);
      if (match && match[1] && !match[1].includes('emoji') && !match[1].includes('icon') && !match[1].includes('avatar')) {
        return {
          url: match[1].replace(/&amp;/g, '&'),
          credit: `Image via ${sourceName}`,
          source: sourceName
        };
      }
    }
    
    // 5. Try picture tag with source
    const pictureMatch = html.match(/<picture[^>]*>[\s\S]*?<source[^>]*srcset=["']([^"'\s]+)["']/i);
    if (pictureMatch && pictureMatch[1]) {
      return {
        url: pictureMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    // 6. Try data-src or data-lazy-src for lazy loaded images
    const lazyImgMatch = html.match(/<img[^>]*(?:data-src|data-lazy-src|data-original)=["']([^"']+)["'][^>]*>/i);
    if (lazyImgMatch && lazyImgMatch[1] && !lazyImgMatch[1].includes('placeholder') && !lazyImgMatch[1].includes('spinner')) {
      return {
        url: lazyImgMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    // 7. Try JSON-LD structured data for images
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi);
    if (jsonLdMatch) {
      for (const jsonStr of jsonLdMatch) {
        const imageMatch = jsonStr.match(/"image"\s*:\s*"([^"]+)"/i) || jsonStr.match(/"image"\s*:\s*\[\s*"([^"]+)"/i);
        if (imageMatch && imageMatch[1]) {
          return {
            url: imageMatch[1].replace(/&amp;/g, '&'),
            credit: `Image via ${sourceName}`,
            source: sourceName
          };
        }
      }
    }
    
    // 8. Try to find first meaningful image in article content area
    const contentImgMatch = html.match(/<(?:article|main|div[^>]*class=["'][^"']*(?:content|article|post|entry)[^"']*["'])[^>]*>[\s\S]{0,5000}?<img[^>]*src=["']([^"']+)["']/i);
    if (contentImgMatch && contentImgMatch[1] && 
        !contentImgMatch[1].includes('logo') && 
        !contentImgMatch[1].includes('avatar') && 
        !contentImgMatch[1].includes('icon') &&
        !contentImgMatch[1].includes('tracking') &&
        !contentImgMatch[1].includes('pixel') &&
        !contentImgMatch[1].includes('1x1')) {
      return {
        url: contentImgMatch[1].replace(/&amp;/g, '&'),
        credit: `Image via ${sourceName}`,
        source: sourceName
      };
    }
    
    return null;
  } catch (error) {
    return null;
  }
}

// Detect category from content
function detectCategory(title: string, description: string, sourceCategory: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  // Geopolitical keywords
  if (/(?:sanction|tariff|trade.?war|embargo|conflict|war|crisis|political|diplomacy|treaty|sanctions|geopolitical)/i.test(text)) {
    return 'Geopolitical';
  }
  if (/(?:red.?sea|suez|panama.?canal|strait|hormuz|malacca|choke.?point)/i.test(text)) {
    return 'Geopolitical';
  }
  
  // Other categories
  if (/(?:air.?freight|air.?cargo|airline|aircraft|air.?transport)/i.test(text)) {
    return 'Air Freight';
  }
  if (/(?:customs|tariff|duty|import.?tax|export.?control|clearance)/i.test(text)) {
    return 'Customs';
  }
  if (/(?:sustainable|carbon|emission|green|environmental|imo|decarbonization)/i.test(text)) {
    return 'Sustainability';
  }
  if (/(?:technology|digital|blockchain|ai|automation|smart|iot)/i.test(text)) {
    return 'Technology';
  }
  if (/(?:finance|payment|bank|credit|lc|letter.?of.?credit|currency|forex)/i.test(text)) {
    return 'Trade Finance';
  }
  if (/(?:ecommerce|e-commerce|amazon|fba|alibaba|shopify|online.?retail)/i.test(text)) {
    return 'E-Commerce';
  }
  if (/(?:warehouse|trucking|last.?mile|delivery|fulfillment|distribution)/i.test(text)) {
    return 'Logistics';
  }
  if (/(?:ship|vessel|container|port|terminal|ocean|sea|maritime|freight)/i.test(text)) {
    return 'Ocean Freight';
  }
  
  return sourceCategory;
}

// Detect region from content
function detectRegion(title: string, description: string, sourceRegion: string): string {
  const text = (title + ' ' + description).toLowerCase();
  
  if (/(?:china|japan|korea|singapore|hong.?kong|taiwan|vietnam|thailand|india|indonesia|malaysia|philippines)/i.test(text)) {
    return 'asia-pacific';
  }
  if (/(?:germany|france|uk|britain|italy|spain|netherlands|belgium|europe|eu)/i.test(text)) {
    return 'europe';
  }
  if (/(?:usa|united.?states|america|canada|mexico|brazil|argentina|chile)/i.test(text)) {
    return 'americas';
  }
  if (/(?:dubai|uae|saudi|qatar|kuwait|iran|iraq|israel|middle.?east|gulf)/i.test(text)) {
    return 'middle-east';
  }
  if (/(?:africa|nigeria|egypt|south.?africa|kenya|morocco)/i.test(text)) {
    return 'africa';
  }
  
  return sourceRegion;
}

// Parse RSS XML
async function parseRSS(xml: string, sourceName: string, sourceRegion: string, sourceCategory: string): Promise<NewsItem[]> {
  const items: NewsItem[] = [];
  
  // All sources that need image fetching from article page (most RSS feeds don't include images)
  const needsArticleImageFetch = [
    'Splash 247', 
    'Oil Price', 
    'gCaptain', 
    'Maritime Executive',
    'Hellenic Shipping News',
    'FreightWaves',
    'Marine Insight',
    'Port Technology',
    'Seatrade Maritime',
    'Marine Log',
    "Lloyd's List",
    'Ship & Bunker',
    'Reuters Commodities',
    'Logistics Middle East',
    'Maritime Gateway',
    'Hong Kong Maritime Hub',
    'Seatrade Maritime Asia',
    'Reuters World',
    'BBC World Business',
    'Al Jazeera Economy',
    'Financial Times',
    'DW Economy'
  ];
  
  try {
    // Simple regex-based parsing (works for most RSS feeds)
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches) {
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
      const title = titleMatch ? cleanHtml(titleMatch[1] || titleMatch[2]) : '';
      
      if (!title || title.trim() === '') continue;
      
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1] : '';
      
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/is);
      const description = descMatch ? cleanHtml(descMatch[1] || descMatch[2] || '') : '';
      
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]) : new Date();
      
      // Check if within last 48 hours
      const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
      if (hoursAgo > 48) continue;
      
      // Detect category
      const category = detectCategory(title, description, sourceCategory);
      
      // Detect region
      const region = detectRegion(title, description, sourceRegion);
      
      // Extract image with credit from RSS
      let imageData = extractImage(itemXml, sourceName);
      
      // If no image in RSS, we'll fetch from article page later (store link for now)
      const articleLink = link;
      
      let imageUrl = imageData?.url || '';
      let imageCredit = imageData?.credit || '';
      let imageSource = imageData?.source || sourceName;
      
      // Detect if alert
      const isAlert = /breaking|alert|urgent|crisis|surge|collapse|shortage|disruption|strike|halt/i.test(title);
      
      // Create unique ID using hash of source + title + timestamp to avoid collisions
      const uniqueId = Buffer.from(`${sourceName}-${title}-${pubDate.getTime()}`).toString('base64');
      const idHash = uniqueId.split('').reduce((acc, char) => ((acc << 5) - acc + char.charCodeAt(0)) | 0, 0);

      items.push({
        id: `${sourceName.replace(/\s+/g, '').substring(0, 10)}-${Math.abs(idHash).toString(36)}-${pubDate.getTime().toString(36)}`,
        title: cleanHtml(title),
        excerpt: truncate(description, 200),
        content: description,
        slug: createSlug(title),
        category,
        publishedAt: pubDate.toISOString(),
        source: sourceName,
        sourceUrl: link,
        originalUrl: link,
        region,
        isAlert,
        trending: hoursAgo < 12,
        imageUrl,
        imageCredit,
        imageSource,
      });
    }
  } catch (error) {
    console.error(`Error parsing RSS from ${sourceName}:`, error);
  }
  
  return items;
}

// Fetch RSS feed
async function fetchRSS(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShiportradeBot/1.0; +https://shiportrade.com)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(5000), // 5 second timeout for faster response
    });
    
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    // Silently fail for faster response
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const region = searchParams.get('region') || 'global';
  const category = searchParams.get('category') || 'all';
  const limit = parseInt(searchParams.get('limit') || '50');
  
  try {
    const allNews: NewsItem[] = [];
    
    // Fetch all RSS feeds in parallel
    const fetchPromises = RSS_SOURCES.map(async (source) => {
      // Filter by region
      if (region !== 'global' && source.region !== 'global' && source.region !== region) {
        return [];
      }
      
      const xml = await fetchRSS(source.url);
      if (!xml) return [];
      
      return await parseRSS(xml, source.name, source.region, source.category);
    });
    
    const results = await Promise.all(fetchPromises);
    results.forEach(items => allNews.push(...items));
    
    // Sort by date (descending)
    allNews.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    // Deduplicate news items
    const deduplicatedNews = deduplicateNews(allNews);
    
    // Filter by category if specified
    let filteredNews = deduplicatedNews;
    if (category !== 'all') {
      filteredNews = deduplicatedNews.filter(item => item.category === category);
    }
    
    // Apply limit early for image fetching
    const limitedNews = filteredNews.slice(0, limit);
    
    // Fetch images from article pages for items without images (parallel with concurrency limit)
    const itemsNeedingImages = limitedNews.filter(item => !item.imageUrl);
    
    // Fetch images in batches of 3 to avoid overwhelming servers
    const BATCH_SIZE = 3;
    for (let i = 0; i < itemsNeedingImages.length; i += BATCH_SIZE) {
      const batch = itemsNeedingImages.slice(i, i + BATCH_SIZE);
      
      const imagePromises = batch.map(async (item) => {
        try {
          const imageData = await fetchImageFromArticle(item.sourceUrl, item.source);
          if (imageData) {
            item.imageUrl = imageData.url;
            item.imageCredit = imageData.credit;
            item.imageSource = imageData.source;
          }
        } catch (e) {
          // Silently fail, will use fallback
        }
      });
      
      await Promise.all(imagePromises);
    }
    
    // Apply fallback images for items still without images
    for (const item of limitedNews) {
      if (!item.imageUrl) {
        const categoryImage = CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES['Ocean Freight'];
        item.imageUrl = categoryImage?.url || '';
        item.imageCredit = categoryImage?.credit || '';
      }
    }
    
    return NextResponse.json({
      success: true,
      data: limitedNews,
      meta: {
        total: allNews.length,
        deduplicated: deduplicatedNews.length,
        returned: limitedNews.length,
        withOriginalImages: limitedNews.filter(n => n.imageSource && !n.imageUrl?.includes('unsplash')).length,
        region,
        category,
        lastUpdated: new Date().toISOString(),
        sources: RSS_SOURCES.length,
      }
    });
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        data: [],
      },
      { status: 500 }
    );
  }
}
