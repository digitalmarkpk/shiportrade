// Freight Forwarders Directory Data

export interface FreightForwarder {
  id: string;
  name: string;
  shortName?: string;
  logo?: string;
  headquarters: string;
  country: string;
  region: string;
  regions?: string[];
  founded: number;
  employees?: string;
  website: string;
  phone?: string;
  email?: string;
  services: string[];
  certifications: string[];
  specializations: string[];
  specialties?: string[];
  tradeLanes: string[];
  annualTEU?: number;
  offices: number;
  countries: number;
  countriesServed?: number;
  description: string;
  rating: number;
  ratings?: {
    overall: number;
    reliability: number;
    communication: number;
    pricing: number;
  };
  contact?: {
    email?: string;
    phone?: string;
  };
  stats?: {
    shipmentsPerYear?: string;
    teuHandled?: string;
    airTonnage?: string;
  };
  annualRevenue?: string;
  verified: boolean;
}

export const freightForwarders: FreightForwarder[] = [
  {
    id: 'kuehne-nagel',
    name: 'Kuehne + Nagel',
    shortName: 'K+N',
    headquarters: 'Schindellegi',
    country: 'Switzerland',
    region: 'Europe',
    regions: ['Europe', 'Asia', 'Americas', 'Africa'],
    founded: 1890,
    employees: '80,000+',
    website: 'https://www.kuehne-nagel.com',
    services: ['Sea Freight', 'Air Freight', 'Road Freight', 'Contract Logistics', 'Integrated Logistics'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'C-TPAT'],
    specializations: ['Pharma', 'Perishables', 'Automotive', 'High-Tech', 'Oil & Gas'],
    specialties: ['Sea Freight', 'Pharma Logistics', 'Perishables'],
    tradeLanes: ['Asia-Europe', 'Trans-Pacific', 'Trans-Atlantic', 'Intra-Asia', 'Asia-South America'],
    annualTEU: 4500000,
    offices: 1400,
    countries: 100,
    countriesServed: 100,
    description: 'Kuehne + Nagel is one of the world\'s leading logistics companies, providing sea freight, air freight, road transport, and contract logistics solutions with a global network spanning over 100 countries.',
    rating: 4.8,
    ratings: { overall: 4.8, reliability: 4.9, communication: 4.7, pricing: 4.6 },
    contact: { email: 'info@kuehne-nagel.com', phone: '+41 44 856 21 11' },
    stats: { shipmentsPerYear: '2M+', teuHandled: '4.5M', airTonnage: '1.2M tons' },
    annualRevenue: 'CHF 38B+',
    verified: true
  },
  {
    id: 'dhl-global-forwarding',
    name: 'DHL Global Forwarding',
    shortName: 'DGF',
    headquarters: 'Bonn',
    country: 'Germany',
    region: 'Europe',
    regions: ['Europe', 'Asia', 'Americas', 'Africa', 'Oceania'],
    founded: 1969,
    employees: '380,000+',
    website: 'https://www.dhl.com',
    services: ['Air Freight', 'Ocean Freight', 'Road Transport', 'Warehousing', 'Supply Chain'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'TAPA', 'GDP'],
    specializations: ['Life Sciences', 'Automotive', 'Technology', 'Retail', 'Engineering'],
    specialties: ['Air Freight', 'Ocean Freight', 'Life Sciences'],
    tradeLanes: ['Global Coverage', 'Asia-Europe', 'Trans-Pacific', 'Europe-Africa'],
    annualTEU: 3200000,
    offices: 2200,
    countries: 220,
    countriesServed: 220,
    description: 'DHL Global Forwarding is the air and ocean freight specialist within Deutsche Post DHL Group, offering comprehensive logistics solutions worldwide.',
    rating: 4.7,
    ratings: { overall: 4.7, reliability: 4.8, communication: 4.6, pricing: 4.5 },
    contact: { email: 'contact@dhl.com', phone: '+49 228 767 0' },
    stats: { shipmentsPerYear: '3M+', teuHandled: '3.2M', airTonnage: '2M tons' },
    annualRevenue: 'EUR 85B+',
    verified: true
  },
  {
    id: 'db-schenker',
    name: 'DB Schenker',
    shortName: 'Schenker',
    headquarters: 'Essen',
    country: 'Germany',
    region: 'Europe',
    regions: ['Europe', 'Asia', 'Americas'],
    founded: 1872,
    employees: '76,000+',
    website: 'https://www.dbschenker.com',
    services: ['Land Transport', 'Air Freight', 'Ocean Freight', 'Contract Logistics', 'Supply Chain Management'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'TAPA'],
    specializations: ['Automotive', 'Electronics', 'Consumer Goods', 'Healthcare'],
    specialties: ['Land Transport', 'Automotive', 'Contract Logistics'],
    tradeLanes: ['Europe-Asia', 'Trans-Atlantic', 'Intra-Europe', 'Europe-Americas'],
    annualTEU: 2100000,
    offices: 2100,
    countries: 130,
    countriesServed: 130,
    description: 'DB Schenker is one of the world\'s largest integrated logistics providers, offering land, air, and ocean transportation along with contract logistics services.',
    rating: 4.6,
    ratings: { overall: 4.6, reliability: 4.7, communication: 4.5, pricing: 4.4 },
    contact: { email: 'info@dbschenker.com', phone: '+49 201 867 0' },
    stats: { shipmentsPerYear: '2.5M+', teuHandled: '2.1M', airTonnage: '800K tons' },
    annualRevenue: 'EUR 20B+',
    verified: true
  },
  {
    id: 'expeditors',
    name: 'Expeditors International',
    shortName: 'Expeditors',
    headquarters: 'Seattle',
    country: 'United States',
    region: 'North America',
    regions: ['North America', 'Asia', 'Europe'],
    founded: 1979,
    employees: '18,000+',
    website: 'https://www.expeditors.com',
    services: ['Air Freight', 'Ocean Freight', 'Customs Brokerage', 'Warehousing', 'Supply Chain Solutions'],
    certifications: ['ISO 9001', 'C-TPAT', 'AEO', 'TAPA'],
    specializations: ['Retail', 'Technology', 'Healthcare', 'Automotive'],
    specialties: ['Air Freight', 'Customs Brokerage', 'Technology'],
    tradeLanes: ['Trans-Pacific', 'Asia-Europe', 'Intra-Asia', 'Trans-Atlantic'],
    annualTEU: 1200000,
    offices: 350,
    countries: 60,
    countriesServed: 60,
    description: 'Expeditors is a Fortune 500 logistics company specializing in air and ocean freight forwarding, customs brokerage, and supply chain solutions.',
    rating: 4.7,
    ratings: { overall: 4.7, reliability: 4.8, communication: 4.6, pricing: 4.5 },
    contact: { email: 'info@expeditors.com', phone: '+1 206 674 4000' },
    stats: { shipmentsPerYear: '1M+', teuHandled: '1.2M', airTonnage: '500K tons' },
    annualRevenue: 'USD 10B+',
    verified: true
  },
  {
    id: 'dsv',
    name: 'DSV A/S',
    shortName: 'DSV',
    headquarters: 'Hedehusene',
    country: 'Denmark',
    region: 'Europe',
    regions: ['Europe', 'Asia', 'Americas', 'Africa'],
    founded: 1976,
    employees: '60,000+',
    website: 'https://www.dsv.com',
    services: ['Air Freight', 'Sea Freight', 'Road Freight', 'Warehousing', 'Project Cargo'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Project Cargo', 'Pharma', 'Automotive', 'Retail'],
    specialties: ['Project Cargo', 'Road Freight', 'Pharma'],
    tradeLanes: ['Europe-Asia', 'Trans-Atlantic', 'Europe-Africa', 'Intra-Europe'],
    annualTEU: 1800000,
    offices: 1500,
    countries: 90,
    countriesServed: 90,
    description: 'DSV is a global logistics company offering air, sea, and road freight services along with warehousing and project cargo solutions.',
    rating: 4.5,
    ratings: { overall: 4.5, reliability: 4.6, communication: 4.4, pricing: 4.3 },
    contact: { email: 'info@dsv.com', phone: '+45 43 25 25 25' },
    stats: { shipmentsPerYear: '1.8M+', teuHandled: '1.8M', airTonnage: '600K tons' },
    annualRevenue: 'DKK 170B+',
    verified: true
  },
  {
    id: 'sinotrans',
    name: 'Sinotrans',
    headquarters: 'Beijing',
    country: 'China',
    region: 'Asia',
    founded: 1955,
    employees: '50,000+',
    website: 'https://www.sinotrans.com',
    services: ['Ocean Freight', 'Air Freight', 'Road Transport', 'Warehousing', 'Supply Chain'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Cross-border E-commerce', 'Cold Chain', 'Hazardous Materials', 'Project Cargo'],
    tradeLanes: ['China-Europe', 'Intra-Asia', 'China-Americas', 'China-Africa'],
    annualTEU: 2500000,
    offices: 800,
    countries: 50,
    description: 'Sinotrans is China\'s largest integrated logistics provider, offering comprehensive freight forwarding and supply chain services.',
    rating: 4.4,
    verified: true
  },
  {
    id: 'nippon-express',
    name: 'Nippon Express',
    headquarters: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    founded: 1872,
    employees: '70,000+',
    website: 'https://www.nipponexpress.com',
    services: ['Air Freight', 'Ocean Freight', 'Land Transport', 'Warehousing', 'Moving Services'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'GDP'],
    specializations: ['Automotive', 'Electronics', 'Pharma', 'Fine Art'],
    tradeLanes: ['Asia-Europe', 'Trans-Pacific', 'Intra-Asia', 'Japan-Americas'],
    annualTEU: 1100000,
    offices: 900,
    countries: 48,
    description: 'Nippon Express is one of Japan\'s largest logistics companies, providing global freight forwarding and supply chain solutions.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'geodis',
    name: 'GEODIS',
    headquarters: 'Levallois-Perret',
    country: 'France',
    region: 'Europe',
    founded: 1904,
    employees: '44,000+',
    website: 'https://www.geodis.com',
    services: ['Supply Chain Optimization', 'Freight Forwarding', 'Contract Logistics', 'Distribution'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Retail', 'Consumer Goods', 'Automotive', 'Healthcare'],
    tradeLanes: ['Europe-Asia', 'Trans-Atlantic', 'Europe-Africa', 'Intra-Europe'],
    annualTEU: 800000,
    offices: 700,
    countries: 67,
    description: 'GEODIS is a leading global logistics provider offering supply chain optimization, freight forwarding, and contract logistics services.',
    rating: 4.4,
    verified: true
  },
  {
    id: 'ceva-logistics',
    name: 'CEVA Logistics',
    headquarters: 'Marseille',
    country: 'France',
    region: 'Europe',
    founded: 2006,
    employees: '78,000+',
    website: 'https://www.cevalogistics.com',
    services: ['Contract Logistics', 'Freight Management', 'Ground Transport', 'Air & Ocean'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'TAPA'],
    specializations: ['Automotive', 'Consumer & Retail', 'Technology', 'Healthcare'],
    tradeLanes: ['Europe-Asia', 'Trans-Pacific', 'Trans-Atlantic', 'Intra-Asia'],
    annualTEU: 750000,
    offices: 1000,
    countries: 160,
    description: 'CEVA Logistics provides comprehensive supply chain solutions including contract logistics and freight management services globally.',
    rating: 4.3,
    verified: true
  },
  {
    id: 'damco',
    name: 'Damco',
    headquarters: 'The Hague',
    country: 'Netherlands',
    region: 'Europe',
    founded: 1904,
    employees: '10,000+',
    website: 'https://www.damco.com',
    services: ['Ocean Freight', 'Air Freight', 'Supply Chain Management', 'Customs Brokerage'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Retail', 'Lifestyle', 'FMCG', 'Technology'],
    tradeLanes: ['Asia-Europe', 'Trans-Pacific', 'Intra-Asia', 'Africa'],
    annualTEU: 2800000,
    offices: 300,
    countries: 90,
    description: 'Damco is the logistics arm of A.P. Moller - Maersk, providing freight forwarding and supply chain management services.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'bolloré-logistics',
    name: 'Bolloré Logistics',
    headquarters: 'Puteaux',
    country: 'France',
    region: 'Europe',
    founded: 1822,
    employees: '20,000+',
    website: 'https://www.bollore-logistics.com',
    services: ['Air Freight', 'Ocean Freight', 'Road Transport', 'Warehousing', 'Project Cargo'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO', 'TAPA'],
    specializations: ['Oil & Gas', 'Mining', 'Telecom', 'Defense'],
    tradeLanes: ['Europe-Africa', 'Asia-Europe', 'Trans-Pacific', 'South America'],
    annualTEU: 500000,
    offices: 600,
    countries: 105,
    description: 'Bolloré Logistics specializes in complex supply chain solutions including project cargo and speciality logistics for demanding industries.',
    rating: 4.4,
    verified: true
  },
  {
    id: 'hellmann',
    name: 'Hellmann Worldwide Logistics',
    headquarters: 'Osnabrück',
    country: 'Germany',
    region: 'Europe',
    founded: 1871,
    employees: '11,000+',
    website: 'https://www.hellmann.com',
    services: ['Air Freight', 'Sea Freight', 'Road & Rail', 'Contract Logistics'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Pharma', 'Perishables', 'Automotive', 'Fashion'],
    tradeLanes: ['Europe-Asia', 'Trans-Atlantic', 'Europe-South America', 'Intra-Europe'],
    annualTEU: 600000,
    offices: 500,
    countries: 56,
    description: 'Hellmann Worldwide Logistics is a family-owned logistics company providing air, sea, and road freight services globally.',
    rating: 4.4,
    verified: true
  },
  {
    id: ' Toll Group',
    name: 'Toll Group',
    headquarters: 'Melbourne',
    country: 'Australia',
    region: 'Oceania',
    founded: 1888,
    employees: '40,000+',
    website: 'https://www.tollgroup.com',
    services: ['Road Transport', 'Maritime Logistics', 'Aviation', 'Warehousing'],
    certifications: ['ISO 9001', 'ISO 14001', 'AEO'],
    specializations: ['Mining', 'Oil & Gas', 'Defense', 'Government'],
    tradeLanes: ['Intra-Asia', 'Asia-Australia', 'Trans-Tasman', 'Australia-Europe'],
    annualTEU: 400000,
    offices: 1200,
    countries: 50,
    description: 'Toll Group is Asia Pacific\'s leading logistics provider, offering integrated transport and logistics solutions across the region.',
    rating: 4.3,
    verified: true
  },
  {
    id: 'ups-scs',
    name: 'UPS Supply Chain Solutions',
    headquarters: 'Atlanta',
    country: 'United States',
    region: 'North America',
    founded: 1907,
    employees: '500,000+',
    website: 'https://www.ups.com',
    services: ['Air Freight', 'Ocean Freight', 'Customs Brokerage', 'Warehousing', 'Distribution'],
    certifications: ['ISO 9001', 'C-TPAT', 'AEO', 'TAPA'],
    specializations: ['Healthcare', 'High-Tech', 'Retail', 'Automotive'],
    tradeLanes: ['Trans-Pacific', 'Trans-Atlantic', 'Intra-Americas', 'Global'],
    annualTEU: 900000,
    offices: 2500,
    countries: 200,
    description: 'UPS Supply Chain Solutions offers comprehensive logistics services including air and ocean freight, customs brokerage, and distribution.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'flexport',
    name: 'Flexport',
    headquarters: 'San Francisco',
    country: 'United States',
    region: 'North America',
    founded: 2013,
    employees: '3,000+',
    website: 'https://www.flexport.com',
    services: ['Ocean Freight', 'Air Freight', 'Trucking', 'Customs', 'Warehousing'],
    certifications: ['C-TPAT', 'AEO'],
    specializations: ['E-commerce', 'Retail', 'Consumer Electronics', 'SMB'],
    tradeLanes: ['Trans-Pacific', 'Asia-Europe', 'Intra-Asia', 'Trans-Atlantic'],
    annualTEU: 700000,
    offices: 25,
    countries: 12,
    description: 'Flexport is a technology-focused freight forwarding company that provides a modern platform for managing global logistics.',
    rating: 4.5,
    verified: true
  }
];

export const serviceTypes = [
  'Sea Freight', 'Air Freight', 'Road Freight', 'Rail Freight',
  'Contract Logistics', 'Warehousing', 'Customs Brokerage',
  'Supply Chain Management', 'Project Cargo', 'Cross-border E-commerce',
  'Cold Chain', 'Last Mile Delivery'
];

export const certificationTypes = [
  'ISO 9001', 'ISO 14001', 'ISO 45001', 'AEO', 'C-TPAT',
  'TAPA', 'GDP', 'GMP', 'HACCP', 'BRC', 'FSC'
];

export const regionOptions = [
  'North America', 'South America', 'Europe', 'Asia',
  'Middle East', 'Africa', 'Oceania'
];

// Helper function to get a freight forwarder by ID
export function getFreightForwarderById(id: string): FreightForwarder | undefined {
  return freightForwarders.find(ff => ff.id === id);
}
