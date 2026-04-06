// Customs Brokers Directory Data

export interface CustomsBroker {
  id: string;
  name: string;
  logo?: string;
  headquarters: string;
  country: string;
  region: string;
  established: number;
  website: string;
  phone?: string;
  email?: string;
  services: string[];
  certifications: string[];
  specialties: string[];
  portsCovered: string[];
  languages: string[];
  staffCount?: string;
  clearanceVolume?: number;
  description: string;
  rating: number;
  verified: boolean;
  licenseNumber?: string;
}

export const customsBrokers: CustomsBroker[] = [
  {
    id: 'expeditors-customs',
    name: 'Expeditors Customs Brokerage',
    headquarters: 'Seattle',
    country: 'United States',
    region: 'North America',
    established: 1979,
    website: 'https://www.expeditors.com',
    phone: '+1-206-937-3800',
    services: ['Customs Clearance', 'Duty Drawback', 'Tariff Classification', 'Compliance Consulting', 'Audit Support'],
    certifications: ['C-TPAT', 'AEO', 'Licensed Customs Broker', 'NCBFAA'],
    specialties: ['Import Clearance', 'Export Documentation', 'FTA Utilization', 'HS Classification'],
    portsCovered: ['Los Angeles', 'Long Beach', 'New York', 'Seattle', 'Miami', 'Chicago'],
    languages: ['English', 'Spanish', 'Chinese', 'Japanese'],
    staffCount: '500+ licensed brokers',
    clearanceVolume: 500000,
    description: 'Expeditors provides comprehensive customs brokerage services with licensed professionals across all major US ports.',
    rating: 4.8,
    verified: true,
    licenseNumber: 'CBP-001-EXP'
  },
  {
    id: 'livingston-international',
    name: 'Livingston International',
    headquarters: 'Toronto',
    country: 'Canada',
    region: 'North America',
    established: 1945,
    website: 'https://www.livingstonintl.com',
    phone: '+1-800-465-4418',
    services: ['Customs Brokerage', 'Trade Compliance', 'Consulting', 'Duty Recovery', 'CARM Support'],
    certifications: ['CBSA Partners', 'C-TPAT', 'PIP', 'CSA'],
    specialties: ['US-Canada Cross-border', 'CARM Compliance', 'NAFTA/USMCA', 'GST/HST'],
    portsCovered: ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Windsor', 'Buffalo'],
    languages: ['English', 'French'],
    staffCount: '1000+',
    clearanceVolume: 350000,
    description: 'Livingston International is Canada\'s leading customs broker, specializing in US-Canada cross-border trade.',
    rating: 4.7,
    verified: true
  },
  {
    id: 'c.h.-powell',
    name: 'C.H. Powell',
    headquarters: 'Boston',
    country: 'United States',
    region: 'North America',
    established: 1919,
    website: 'https://www.chpowell.com',
    services: ['Customs Brokerage', 'Freight Forwarding', 'Warehousing', 'Consulting'],
    certifications: ['Licensed Customs Broker', 'C-TPAT', 'AEO'],
    specialties: ['Food & Agriculture', 'Textiles', 'Consumer Goods', 'Machinery'],
    portsCovered: ['Boston', 'New York', 'Baltimore', 'Philadelphia'],
    languages: ['English', 'Spanish', 'Portuguese'],
    clearanceVolume: 120000,
    description: 'C.H. Powell Company provides customs brokerage and logistics services with a century of experience in the Northeast.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'detroit-brokerage',
    name: 'Detroit Customs Brokerage',
    headquarters: 'Detroit',
    country: 'United States',
    region: 'North America',
    established: 1965,
    website: 'https://www.detroitcustoms.com',
    services: ['Customs Clearance', 'Border Crossing', 'FTA Consulting', 'Compliance'],
    certifications: ['Licensed Customs Broker', 'C-TPAT', 'ACE Certified'],
    specialties: ['Automotive Parts', 'Steel & Metals', 'Manufacturing', 'USMCA'],
    portsCovered: ['Detroit', 'Port Huron', 'Buffalo', 'Sarnia'],
    languages: ['English'],
    clearanceVolume: 180000,
    description: 'Specializes in automotive and manufacturing goods crossing the US-Canada border via Detroit.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'global-brokerage-asia',
    name: 'Global Brokerage Asia Pacific',
    headquarters: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    established: 1985,
    website: 'https://www.globalbrokerageasia.com',
    services: ['Customs Clearance', 'Trade Consulting', 'Permits & Licenses', 'AEO Advisory'],
    certifications: ['AEO', 'ISO 9001', 'Singapore Customs Partner'],
    specialties: ['ASEAN Trade', 'Electronics', 'Chemicals', 'Pharmaceuticals'],
    portsCovered: ['Singapore', 'Port Klang', 'Bangkok', 'Jakarta', 'Manila'],
    languages: ['English', 'Chinese', 'Malay', 'Thai'],
    clearanceVolume: 200000,
    description: 'Leading customs broker in ASEAN with expertise in regional trade agreements and electronic clearance.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'euro-customs-partners',
    name: 'Euro Customs Partners',
    headquarters: 'Rotterdam',
    country: 'Netherlands',
    region: 'Europe',
    established: 1992,
    website: 'https://www.eurocustomspartners.eu',
    services: ['EU Customs Clearance', 'Import/Export Declarations', 'VAT Recovery', 'Brexit Advisory'],
    certifications: ['AEO', 'ISO 9001', 'ISO 14001'],
    specialties: ['EU Trade', 'Post-Brexit UK Trade', 'Food Products', 'Automotive'],
    portsCovered: ['Rotterdam', 'Antwerp', 'Amsterdam', 'Hamburg', 'Felixstowe'],
    languages: ['English', 'Dutch', 'German', 'French', 'Spanish'],
    clearanceVolume: 280000,
    description: 'Expert in EU customs procedures, providing seamless clearance across European ports.',
    rating: 4.7,
    verified: true
  },
  {
    id: 'brazil-customs-solutions',
    name: 'Brazil Customs Solutions',
    headquarters: 'São Paulo',
    country: 'Brazil',
    region: 'South America',
    established: 2001,
    website: 'https://www.brazilcustoms.com.br',
    services: ['Import Clearance', 'Export Documentation', 'Tax Advisory', 'LI/LI Consultation'],
    certifications: ['AEO Brazil', 'ISO 9001'],
    specialties: ['Brazilian Import Procedures', 'SISCOMEX', 'Mercosur', 'Industrial Equipment'],
    portsCovered: ['Santos', 'Paranaguá', 'Rio Grande', 'Itajaí', 'Manaus'],
    languages: ['Portuguese', 'English', 'Spanish'],
    clearanceVolume: 85000,
    description: 'Brazil\'s complex customs environment made simple with expert local knowledge.',
    rating: 4.4,
    verified: true
  },
  {
    id: 'china-customs-services',
    name: 'China Customs Services International',
    headquarters: 'Shanghai',
    country: 'China',
    region: 'Asia',
    established: 1998,
    website: 'https://www.chinacustoms.com.cn',
    services: ['Import Clearance', 'Export Clearance', 'HS Classification', 'Inspection Coordination'],
    certifications: ['AEO China', 'ISO 9001'],
    specialties: ['China Import/Export', 'CIQ Procedures', 'Cross-border E-commerce', 'FTZ Operations'],
    portsCovered: ['Shanghai', 'Shenzhen', 'Ningbo', 'Qingdao', 'Tianjin', 'Xiamen'],
    languages: ['Chinese', 'English'],
    clearanceVolume: 400000,
    description: 'Comprehensive customs services for China trade with expertise in e-commerce and FTZ operations.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'uk-customs-solutions',
    name: 'UK Customs Solutions',
    headquarters: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    established: 1988,
    website: 'https://www.ukcustomssolutions.co.uk',
    services: ['Customs Clearance', 'CDS Support', 'EORI Registration', 'Post-Brexit Trade'],
    certifications: ['AEO UK', 'BIFA Member'],
    specialties: ['Post-Brexit Trade', 'EU Trade', 'Food & Drink', 'Fashion & Retail'],
    portsCovered: ['Felixstowe', 'Southampton', 'London Gateway', 'Liverpool', 'Immingham'],
    languages: ['English'],
    clearanceVolume: 150000,
    description: 'Leading UK customs broker with extensive post-Brexit trade expertise.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'india-customs-brokers',
    name: 'India Customs Brokers Association',
    headquarters: 'Mumbai',
    country: 'India',
    region: 'Asia',
    established: 1962,
    website: 'https://www.indiacustomsbrokers.com',
    services: ['Customs Clearance', 'GST Advisory', 'DGFT Compliance', 'Import Licensing'],
    certifications: ['FIEO Member', 'Customs Broker License'],
    specialties: ['Indian Customs', 'GST Compliance', 'Pharmaceuticals', 'Textiles', 'Gems & Jewelry'],
    portsCovered: ['Mumbai', 'Delhi', 'Chennai', 'Kolkata', 'Bangalore', 'Hyderabad'],
    languages: ['English', 'Hindi', 'Tamil', 'Bengali'],
    clearanceVolume: 220000,
    description: 'Established network of licensed Indian customs brokers covering all major ports.',
    rating: 4.4,
    verified: true
  },
  {
    id: 'australia-customs-agents',
    name: 'Australia Customs & Trade Agents',
    headquarters: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    established: 1975,
    website: 'https://www.auscustoms.com.au',
    services: ['Customs Clearance', 'Biosecurity Advisory', 'FTAs Advisory', 'GST/Duty Calculation'],
    certifications: ['Licensed Customs Broker', 'AEO Australia'],
    specialties: ['Australian Biosecurity', 'FTA Utilization', 'Agricultural Products', 'Mining Equipment'],
    portsCovered: ['Sydney', 'Melbourne', 'Brisbane', 'Fremantle', 'Adelaide'],
    languages: ['English'],
    clearanceVolume: 95000,
    description: 'Australian licensed customs brokers with expertise in biosecurity and FTA optimization.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'mexico-customs-experts',
    name: 'Mexico Customs Experts',
    headquarters: 'Mexico City',
    country: 'Mexico',
    region: 'North America',
    established: 1995,
    website: 'https://www.mexicocustoms.com.mx',
    services: ['Customs Clearance', 'USMCA Advisory', 'VAT Recovery', 'Import Permits'],
    certifications: ['AEO Mexico', 'Licensed Agente Aduanal'],
    specialties: ['USMCA Trade', 'Maquiladora Operations', 'Automotive', 'Electronics'],
    portsCovered: ['Manila', 'Laredo', 'Tijuana', 'Ciudad Juárez', 'Veracruz', 'Manzanillo'],
    languages: ['Spanish', 'English'],
    clearanceVolume: 180000,
    description: 'Licensed Mexican customs brokers specializing in USMCA and cross-border operations.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'dubai-customs-services',
    name: 'Dubai Customs Services',
    headquarters: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    established: 2005,
    website: 'https://www.dubaicustomsservices.ae',
    services: ['Customs Clearance', 'Free Zone Operations', 'Transit Documentation', 'VAT Advisory'],
    certifications: ['AEO UAE', 'ISO 9001'],
    specialties: ['GCC Trade', 'Free Zone Operations', 'Re-export', 'Gold & Precious Metals'],
    portsCovered: ['Dubai', 'Jebel Ali', 'Abu Dhabi', 'Sharjah'],
    languages: ['Arabic', 'English', 'Hindi', 'Urdu'],
    clearanceVolume: 140000,
    description: 'Expert customs services for UAE and GCC trade with free zone specialization.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'japan-customs-services',
    name: 'Japan Customs Services',
    headquarters: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    established: 1988,
    website: 'https://www.japancustoms.jp',
    services: ['Import Clearance', 'Export Documentation', 'HS Classification', 'FTA Consultation'],
    certifications: ['AEO Japan', 'Licensed Customs Specialist'],
    specialties: ['Japanese Import Regulations', 'Food Safety', 'Electronics', 'Automotive'],
    portsCovered: ['Tokyo', 'Yokohama', 'Kobe', 'Osaka', 'Nagoya'],
    languages: ['Japanese', 'English'],
    clearanceVolume: 110000,
    description: 'Licensed Japanese customs specialists with deep knowledge of local regulations.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'south-africa-customs',
    name: 'Southern Africa Customs Services',
    headquarters: 'Johannesburg',
    country: 'South Africa',
    region: 'Africa',
    established: 1998,
    website: 'https://www.sacustoms.co.za',
    services: ['Customs Clearance', 'SADC Trade', 'Mining Equipment Import', 'Export Documentation'],
    certifications: ['AEO South Africa', 'SARS Registered'],
    specialties: ['Mining Equipment', 'Agricultural Products', 'Automotive', 'SACU Trade'],
    portsCovered: ['Durban', 'Cape Town', 'Johannesburg', 'Port Elizabeth'],
    languages: ['English', 'Afrikaans', 'Zulu'],
    clearanceVolume: 75000,
    description: 'Leading customs broker in Southern Africa with mining and agricultural expertise.',
    rating: 4.4,
    verified: true
  }
];

export const brokerServices = [
  'Customs Clearance', 'Import Clearance', 'Export Documentation',
  'Duty Drawback', 'Tariff Classification', 'FTA Consulting',
  'Trade Compliance', 'Audit Support', 'Permits & Licenses',
  'VAT Recovery', 'AEO Advisory', 'Biosecurity Advisory'
];

export const brokerSpecialties = [
  'Automotive', 'Electronics', 'Pharmaceuticals', 'Food & Agriculture',
  'Textiles', 'Chemicals', 'Machinery', 'Mining Equipment',
  'Consumer Goods', 'E-commerce', 'Cross-border Trade'
];
