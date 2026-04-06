// News RSS Feed Sources Configuration
// All sources organized by region and category

export interface NewsSource {
  id: string;
  name: string;
  url: string;
  rssUrl?: string;
  region: NewsRegion;
  categories: string[];
  priority: 'high' | 'medium' | 'low';
  enabled: boolean;
}

export type NewsRegion = 
  | 'global'
  | 'asia-pacific'
  | 'europe'
  | 'americas'
  | 'middle-east'
  | 'africa';

export const regions: { id: NewsRegion; name: string; icon: string }[] = [
  { id: 'global', name: 'Global', icon: '🌐' },
  { id: 'asia-pacific', name: 'Asia Pacific', icon: '🌏' },
  { id: 'europe', name: 'Europe', icon: '🇪🇺' },
  { id: 'americas', name: 'Americas', icon: '🌎' },
  { id: 'middle-east', name: 'Middle East', icon: '🕌' },
  { id: 'africa', name: 'Africa', icon: '🌍' },
];

export const newsSources: NewsSource[] = [
  // GLOBAL SOURCES
  {
    id: 'shipandbunker',
    name: 'Ship & Bunker',
    url: 'https://shipandbunker.com',
    rssUrl: 'https://feeds.feedburner.com/shipandbunker',
    region: 'global',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'marinelink',
    name: 'Marine Link',
    url: 'https://www.marinelink.com',
    rssUrl: 'https://www.marinelink.com/news/rss',
    region: 'global',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'tradewinds',
    name: 'TradeWinds',
    url: 'https://www.tradewindsnews.com',
    region: 'global',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'hellenic-shipping',
    name: 'Hellenic Shipping News',
    url: 'https://www.hellenicshippingnews.com',
    rssUrl: 'https://www.hellenicshippingnews.com/feed',
    region: 'global',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'seatrade-maritime',
    name: 'Seatrade Maritime',
    url: 'https://www.seatrade-maritime.com',
    rssUrl: 'https://www.seatrade-maritime.com/rss.xml',
    region: 'global',
    categories: ['Ocean Freight', 'Sustainability'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'shippingwatch',
    name: 'ShippingWatch',
    url: 'https://shippingwatch.com',
    region: 'global',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'lloyds-list',
    name: "Lloyd's List",
    url: 'https://www.lloydslist.com',
    region: 'global',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'maritime-executive',
    name: 'The Maritime Executive',
    url: 'https://maritime-executive.com',
    region: 'global',
    categories: ['Ocean Freight', 'Sustainability'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'splash247',
    name: 'Splash 247',
    url: 'https://splash247.com',
    rssUrl: 'https://splash247.com/feed/',
    region: 'global',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'gcaptain',
    name: 'gCaptain',
    url: 'https://gcaptain.com',
    rssUrl: 'https://gcaptain.com/feed/',
    region: 'global',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'freightwaves',
    name: 'FreightWaves',
    url: 'https://www.freightwaves.com',
    rssUrl: 'https://www.freightwaves.com/feed',
    region: 'global',
    categories: ['Logistics', 'Technology', 'Ocean Freight'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'marineinsight',
    name: 'Marine Insight',
    url: 'https://www.marineinsight.com',
    rssUrl: 'https://www.marineinsight.com/feed/',
    region: 'global',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'porttechnology',
    name: 'Port Technology',
    url: 'https://www.porttechnology.org',
    rssUrl: 'https://www.porttechnology.org/feed/',
    region: 'global',
    categories: ['Logistics', 'Technology'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'oilprice',
    name: 'Oil Price',
    url: 'https://oilprice.com',
    rssUrl: 'https://oilprice.com/rss.xml',
    region: 'global',
    categories: ['Trade Finance', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'maritimeprofessional',
    name: 'Maritime Professional',
    url: 'https://www.maritimeprofessional.com',
    rssUrl: 'https://www.maritimeprofessional.com/news/latest?format=feed',
    region: 'global',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'marinelog',
    name: 'Marine Log',
    url: 'https://www.marinelog.com',
    rssUrl: 'https://www.marinelog.com/feed/',
    region: 'global',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'spglobal',
    name: 'S&P Global',
    url: 'https://www.spglobal.com',
    region: 'global',
    categories: ['Trade Finance', 'Ocean Freight'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'globaltrademag',
    name: 'Global Trade Magazine',
    url: 'https://www.globaltrademag.com',
    region: 'global',
    categories: ['Trade Finance', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'ajot',
    name: 'American Journal of Transportation',
    url: 'https://www.ajot.com',
    region: 'global',
    categories: ['Logistics', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'container-news',
    name: 'Container News',
    url: 'https://container-news.com',
    region: 'global',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },

  // EUROPE SOURCES
  {
    id: 'maritimemagazines',
    name: 'Maritime Magazines',
    url: 'https://www.maritimemagazines.com',
    region: 'europe',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'ferry-shipping-news',
    name: 'Ferry Shipping News',
    url: 'https://ferryshippingnews.com',
    rssUrl: 'https://ferryshippingnews.com/feed/',
    region: 'europe',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'seanews',
    name: 'Sea News',
    url: 'https://seanews.co.uk',
    rssUrl: 'https://seanews.co.uk/feed/',
    region: 'europe',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'fullavantenews',
    name: 'Full Avante News',
    url: 'https://fullavantenews.com',
    rssUrl: 'https://fullavantenews.com/feed/',
    region: 'europe',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'rivieramm',
    name: 'Riviera Maritime Media',
    url: 'https://www.rivieramm.com',
    region: 'europe',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'hansa-online',
    name: 'Hansa',
    url: 'https://hansa-online.de',
    region: 'europe',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'nt',
    name: 'Nieuwsblad Transport',
    url: 'https://www.nt.nl',
    rssUrl: 'https://www.nt.nl/feed',
    region: 'europe',
    categories: ['Logistics', 'Trade Finance'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'flows',
    name: 'Flows',
    url: 'https://www.flows.be',
    region: 'europe',
    categories: ['Logistics', 'Ocean Freight'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'corriere-marittimo',
    name: 'Corriere Marittimo',
    url: 'https://www.corrieremarittimo.it',
    region: 'europe',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'cleanshipping',
    name: 'Clean Shipping International',
    url: 'https://www.cleanshippinginternational.com',
    rssUrl: 'https://www.cleanshippinginternational.com/feed/',
    region: 'europe',
    categories: ['Sustainability', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'waterways-journal',
    name: 'Waterways Journal',
    url: 'https://www.waterwaysjournal.net',
    rssUrl: 'https://www.waterwaysjournal.net/feed/',
    region: 'europe',
    categories: ['Logistics', 'Ocean Freight'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'professional-mariner',
    name: 'Professional Mariner',
    url: 'https://professionalmariner.com',
    rssUrl: 'https://professionalmariner.com/feed/',
    region: 'europe',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'liberty-press',
    name: 'Liberty Press',
    url: 'https://libertypress.gr',
    region: 'europe',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'cyprus-shipping-news',
    name: 'Cyprus Shipping News',
    url: 'https://cyprusshippingnews.com',
    rssUrl: 'https://cyprusshippingnews.com/feed/',
    region: 'europe',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'afloat',
    name: 'Afloat',
    url: 'https://afloat.ie',
    region: 'europe',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'low',
    enabled: true,
  },

  // ASIA PACIFIC SOURCES
  {
    id: 'maritime-gateway',
    name: 'Maritime Gateway',
    url: 'https://www.maritimegateway.com',
    rssUrl: 'https://www.maritimegateway.com/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'maritimemag',
    name: 'Maritime Magazine',
    url: 'https://maritimemag.com/en',
    rssUrl: 'https://maritimemag.com/en/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Technology'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'hongkong-maritime',
    name: 'Hong Kong Maritime Hub',
    url: 'https://www.hongkongmaritimehub.com',
    rssUrl: 'https://www.hongkongmaritimehub.com/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'dst-news',
    name: 'DST News',
    url: 'https://dst.news',
    rssUrl: 'https://dst.news/feed/',
    region: 'asia-pacific',
    categories: ['Logistics', 'Trade Finance'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'portnews-ru',
    name: 'PortNews',
    url: 'https://en.portnews.ru',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'itln',
    name: 'Indian Transport & Logistics News',
    url: 'https://www.itln.in',
    region: 'asia-pacific',
    categories: ['Logistics', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'shipping-telegraph',
    name: 'Shipping Telegraph',
    url: 'https://shippingtelegraph.com',
    rssUrl: 'https://shippingtelegraph.com/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'datamar-news',
    name: 'Datamar News',
    url: 'https://www.datamarnews.com',
    rssUrl: 'https://www.datamarnews.com/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'shipping-freight-resource',
    name: 'Shipping and Freight Resource',
    url: 'https://www.shippingandfreightresource.com',
    rssUrl: 'https://www.shippingandfreightresource.com/feed/',
    region: 'asia-pacific',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'trans-info',
    name: 'Trans.info',
    url: 'https://trans.info/en',
    region: 'asia-pacific',
    categories: ['Logistics', 'Technology'],
    priority: 'medium',
    enabled: true,
  },

  // MIDDLE EAST SOURCES
  {
    id: 'logistics-middle-east',
    name: 'Logistics Middle East',
    url: 'https://www.logisticsmiddleeast.com',
    rssUrl: 'https://www.logisticsmiddleeast.com/feed',
    region: 'middle-east',
    categories: ['Logistics', 'Technology'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'maritime-standard',
    name: 'The Maritime Standard',
    url: 'https://www.themaritimestandard.com',
    rssUrl: 'https://www.themaritimestandard.com/feed/',
    region: 'middle-east',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'high',
    enabled: true,
  },
  {
    id: 'shipping-herald',
    name: 'Shipping Herald',
    url: 'https://www.shippingherald.com',
    rssUrl: 'https://www.shippingherald.com/feed/',
    region: 'middle-east',
    categories: ['Ocean Freight', 'Trade Finance'],
    priority: 'medium',
    enabled: true,
  },

  // AMERICAS SOURCES
  {
    id: 'shipshipship',
    name: 'Ship Ship Ship',
    url: 'https://www.shipshipship.uk',
    region: 'americas',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'low',
    enabled: true,
  },
  {
    id: 'capital-link-shipping',
    name: 'Capital Link Shipping',
    url: 'https://capitallinkshipping.com',
    rssUrl: 'https://capitallinkshipping.com/feed/',
    region: 'americas',
    categories: ['Trade Finance', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
  {
    id: 'global-maritime-hub',
    name: 'Global Maritime Hub',
    url: 'https://globalmaritimehub.com',
    rssUrl: 'https://globalmaritimehub.com/feed',
    region: 'americas',
    categories: ['Ocean Freight', 'Logistics'],
    priority: 'medium',
    enabled: true,
  },

  // AFRICA SOURCES
  {
    id: 'log-update-africa',
    name: 'Log Update Africa',
    url: 'https://www.logupdateafrica.com',
    rssUrl: 'https://www.logupdateafrica.com/feed',
    region: 'africa',
    categories: ['Logistics', 'Ocean Freight'],
    priority: 'medium',
    enabled: true,
  },
];

// Get sources by region
export function getSourcesByRegion(region: NewsRegion): NewsSource[] {
  return newsSources.filter(source => 
    source.enabled && (region === 'global' || source.region === region || source.region === 'global')
  );
}

// Get sources with RSS feeds
export function getSourcesWithRSS(): NewsSource[] {
  return newsSources.filter(source => source.enabled && source.rssUrl);
}

// Get sources by category
export function getSourcesByCategory(category: string): NewsSource[] {
  return newsSources.filter(source => 
    source.enabled && source.categories.includes(category)
  );
}

// Priority sources (most reliable/important)
export function getPrioritySources(): NewsSource[] {
  return newsSources.filter(source => source.enabled && source.priority === 'high');
}
