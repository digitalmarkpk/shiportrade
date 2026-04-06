import { NextResponse } from 'next/server';

// RSS Feed sources
const RSS_SOURCES = [
  { name: 'FreightWaves', url: 'https://www.freightwaves.com/feed', category: 'Logistics' },
  { name: 'Hellenic Shipping News', url: 'https://www.hellenicshippingnews.com/feed', category: 'Ocean Freight' },
  { name: 'Splash 247', url: 'https://splash247.com/feed/', category: 'Ocean Freight' },
  { name: 'gCaptain', url: 'https://gcaptain.com/feed/', category: 'Ocean Freight' },
  { name: 'Marine Insight', url: 'https://www.marineinsight.com/feed/', category: 'Ocean Freight' },
  { name: 'Port Technology', url: 'https://www.porttechnology.org/feed/', category: 'Technology' },
  { name: 'Seatrade Maritime', url: 'https://www.seatrade-maritime.com/rss.xml', category: 'Ocean Freight' },
  { name: 'Ship & Bunker', url: 'https://feeds.feedburner.com/shipandbunker', category: 'Trade Finance' },
  { name: 'Oil Price', url: 'https://oilprice.com/rss.xml', category: 'Trade Finance' },
  { name: 'Reuters World', url: 'https://www.reuters.com/world/rss', category: 'Geopolitical' },
  { name: 'BBC World Business', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Trade Finance' },
];

interface NewsItem {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  source: string;
  category: string;
}

// Clean HTML
function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[|\]\]>/g, '')
    .trim();
}

// Fetch and parse RSS
async function fetchAndParseRSS(url: string, sourceName: string, sourceCategory: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ShiportradeBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml',
      },
      signal: AbortSignal.timeout(10000),
    });
    
    if (!response.ok) return [];
    
    const xml = await response.text();
    const items: NewsItem[] = [];
    const itemMatches = xml.match(/<item[\s\S]*?<\/item>/gi) || [];
    
    for (const itemXml of itemMatches.slice(0, 10)) {
      const titleMatch = itemXml.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/i);
      const title = titleMatch ? cleanHtml(titleMatch[1] || titleMatch[2]) : '';
      
      if (!title) continue;
      
      const linkMatch = itemXml.match(/<link>(.*?)<\/link>/i);
      const link = linkMatch ? linkMatch[1] : '';
      
      const descMatch = itemXml.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>|<description>(.*?)<\/description>/is);
      const description = descMatch ? cleanHtml(descMatch[1] || descMatch[2] || '') : '';
      
      const pubDateMatch = itemXml.match(/<pubDate>(.*?)<\/pubDate>/i);
      const pubDate = pubDateMatch ? pubDateMatch[1] : new Date().toUTCString();
      
      items.push({
        title,
        link,
        description: description.substring(0, 300),
        pubDate,
        source: sourceName,
        category: sourceCategory,
      });
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return [];
  }
}

// Generate RSS XML
function generateRSSXML(items: NewsItem[]): string {
  const now = new Date().toUTCString();
  
  const itemsXML = items.map(item => `
    <item>
      <title><![CDATA[${item.title}]]></title>
      <link>${item.link}</link>
      <description><![CDATA[${item.description}]]></description>
      <pubDate>${item.pubDate}</pubDate>
      <source url="https://shiportrade.com">${item.source}</source>
      <category>${item.category}</category>
      <guid isPermaLink="true">${item.link}</guid>
    </item>
  `).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Shiportrade - Global Trade News</title>
    <link>https://shiportrade.com/news</link>
    <description>Real-time trade news from 40+ trusted sources. Maritime, logistics, trade finance, geopolitical developments, and supply chain updates.</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} Shiportrade. All rights reserved.</copyright>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="https://shiportrade.com/news/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://shiportrade.com/logo.svg</url>
      <title>Shiportrade</title>
      <link>https://shiportrade.com</link>
    </image>
    <ttl>30</ttl>
    ${itemsXML}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const allNews: NewsItem[] = [];
    
    // Fetch all RSS feeds in parallel
    const fetchPromises = RSS_SOURCES.map(source => 
      fetchAndParseRSS(source.url, source.name, source.category)
    );
    
    const results = await Promise.all(fetchPromises);
    results.forEach(items => allNews.push(...items));
    
    // Sort by date (descending)
    allNews.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    
    // Limit to 100 items
    const limitedNews = allNews.slice(0, 100);
    
    // Generate RSS XML
    const rssXML = generateRSSXML(limitedNews);
    
    return new NextResponse(rssXML, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800', // 30 minutes cache
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    
    // Return empty RSS feed on error
    const emptyRSS = generateRSSXML([]);
    return new NextResponse(emptyRSS, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
