// Air Cargo Carriers Directory Data

export interface AirCargoCarrier {
  id: string;
  name: string;
  iataCode: string;
  icaoCode: string;
  logo?: string;
  headquarters: string;
  country: string;
  region: string;
  founded: number;
  website: string;
  phone?: string;
  hubAirports: string[];
  fleet: {
    total: number;
    freighters: number;
    passengerWithCargo: number;
  };
  capacity: {
    annualFreightTonnage: number;
    availableTonnageKm: number;
  };
  services: string[];
  cargoTypes: string[];
  specializations: string[];
  destinations: number;
  countriesServed: number;
  description: string;
  rating: number;
  verified: boolean;
  alliance?: string;
}

export const airCargoCarriers: AirCargoCarrier[] = [
  {
    id: 'fedex-express',
    name: 'FedEx Express',
    iataCode: 'FX',
    icaoCode: 'FDX',
    headquarters: 'Memphis',
    country: 'United States',
    region: 'North America',
    founded: 1971,
    website: 'https://www.fedex.com',
    phone: '+1-800-463-3339',
    hubAirports: ['Memphis (MEM)', 'Indianapolis (IND)', 'Anchorage (ANC)', 'Oakland (OAK)', 'Paris CDG', 'Guangzhou'],
    fleet: { total: 697, freighters: 697, passengerWithCargo: 0 },
    capacity: { annualFreightTonnage: 16800000, availableTonnageKm: 25000000 },
    services: ['Express', 'Freight', 'E-commerce', 'Cold Chain', 'Dangerous Goods'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'Electronics', 'Dangerous Goods', 'Live Animals'],
    specializations: ['Time-Critical', 'E-commerce Fulfillment', 'Cold Chain', 'Aerospace Parts'],
    destinations: 375,
    countriesServed: 220,
    description: 'FedEx Express is the world\'s largest express transportation company, providing fast and reliable delivery to more than 220 countries and territories.',
    rating: 4.7,
    verified: true,
    alliance: 'SkyTeam Cargo'
  },
  {
    id: 'ups-airlines',
    name: 'UPS Airlines',
    iataCode: '5X',
    icaoCode: 'UPS',
    headquarters: 'Louisville',
    country: 'United States',
    region: 'North America',
    founded: 1988,
    website: 'https://www.ups.com',
    phone: '+1-800-742-5877',
    hubAirports: ['Louisville (SDF)', 'Philadelphia (PHL)', 'Ontario (ONT)', 'Cologne', 'Dubai'],
    fleet: { total: 290, freighters: 290, passengerWithCargo: 0 },
    capacity: { annualFreightTonnage: 8900000, availableTonnageKm: 15000000 },
    services: ['Express', 'Freight', 'E-commerce', 'Temperature Controlled'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'High-Value', 'Dangerous Goods'],
    specializations: ['Healthcare Logistics', 'High-Tech', 'Retail E-commerce'],
    destinations: 380,
    countriesServed: 220,
    description: 'UPS Airlines is a major American cargo airline serving more than 220 countries worldwide with express package and freight services.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'dhl-express',
    name: 'DHL Express',
    iataCode: 'DHL',
    icaoCode: 'DHL',
    headquarters: 'Leipzig',
    country: 'Germany',
    region: 'Europe',
    founded: 1969,
    website: 'https://www.dhl.com',
    phone: '+49-228-767-676',
    hubAirports: ['Leipzig (LEJ)', 'Cincinnati (CVG)', 'Hong Kong (HKG)', 'Bahrain', 'Singapore'],
    fleet: { total: 280, freighters: 280, passengerWithCargo: 0 },
    capacity: { annualFreightTonnage: 15000000, availableTonnageKm: 22000000 },
    services: ['Express', 'Freight', 'E-commerce', 'Life Sciences', 'Automotive'],
    cargoTypes: ['General Cargo', 'Pharmaceuticals', 'Perishables', 'Dangerous Goods', 'Live Animals'],
    specializations: ['Time-Definite Delivery', 'Temperature-Controlled', 'Life Sciences'],
    destinations: 320,
    countriesServed: 220,
    description: 'DHL Express is the global market leader in the international express delivery business and provides courier services to over 220 countries.',
    rating: 4.7,
    verified: true
  },
  {
    id: 'cathay-pacific-cargo',
    name: 'Cathay Pacific Cargo',
    iataCode: 'CX',
    icaoCode: 'CPA',
    headquarters: 'Hong Kong',
    country: 'Hong Kong',
    region: 'Asia',
    founded: 1946,
    website: 'https://www.cathaypacific.com/cargo',
    hubAirports: ['Hong Kong (HKG)'],
    fleet: { total: 145, freighters: 20, passengerWithCargo: 125 },
    capacity: { annualFreightTonnage: 2100000, availableTonnageKm: 8500000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Live Animals'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Dangerous Goods', 'Valuable Cargo'],
    specializations: ['Fresh Produce', 'Pharma', 'Equine Transport', 'Fine Art'],
    destinations: 115,
    countriesServed: 35,
    description: 'Cathay Pacific Cargo offers comprehensive air cargo services from its Hong Kong hub, connecting Asia to the world.',
    rating: 4.6,
    verified: true,
    alliance: 'Oneworld'
  },
  {
    id: 'emirates-sky-cargo',
    name: 'Emirates SkyCargo',
    iataCode: 'EK',
    icaoCode: 'UAE',
    headquarters: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    founded: 1985,
    website: 'https://www.skycargo.com',
    hubAirports: ['Dubai (DXB)', 'Dubai World Central (DWC)'],
    fleet: { total: 270, freighters: 11, passengerWithCargo: 259 },
    capacity: { annualFreightTonnage: 2700000, availableTonnageKm: 12000000 },
    services: ['Freight', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Valuables'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Dangerous Goods', 'High-Value'],
    specializations: ['Pharma', 'Fresh Produce', 'Automotive', 'Oil & Gas Equipment'],
    destinations: 150,
    countriesServed: 80,
    description: 'Emirates SkyCargo is the freight division of Emirates, connecting the world through its Dubai hub with an extensive fleet.',
    rating: 4.7,
    verified: true
  },
  {
    id: 'lufthansa-cargo',
    name: 'Lufthansa Cargo',
    iataCode: 'LH',
    icaoCode: 'GEC',
    headquarters: 'Frankfurt',
    country: 'Germany',
    region: 'Europe',
    founded: 1994,
    website: 'https://www.lufthansacargo.com',
    hubAirports: ['Frankfurt (FRA)', 'Munich (MUC)'],
    fleet: { total: 18, freighters: 18, passengerWithCargo: 300 },
    capacity: { annualFreightTonnage: 1400000, availableTonnageKm: 6000000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Dangerous Goods'],
    cargoTypes: ['General Cargo', 'Pharmaceuticals', 'Perishables', 'Dangerous Goods', 'Live Animals', 'Aerospace'],
    specializations: ['Aerospace Logistics', 'Pharma', 'Automotive', 'Fashion'],
    destinations: 300,
    countriesServed: 100,
    description: 'Lufthansa Cargo is one of the world\'s leading air freight carriers, offering comprehensive logistics solutions from its Frankfurt hub.',
    rating: 4.6,
    verified: true,
    alliance: 'Star Alliance'
  },
  {
    id: 'singapore-airlines-cargo',
    name: 'Singapore Airlines Cargo',
    iataCode: 'SQ',
    icaoCode: 'SIA',
    headquarters: 'Singapore',
    country: 'Singapore',
    region: 'Asia',
    founded: 1947,
    website: 'https://www.siacargo.com',
    hubAirports: ['Singapore (SIN)'],
    fleet: { total: 130, freighters: 7, passengerWithCargo: 123 },
    capacity: { annualFreightTonnage: 1100000, availableTonnageKm: 5500000 },
    services: ['Freight', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Valuables'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Electronics'],
    specializations: ['Temperature-Sensitive', 'Pharma', 'Electronics', 'Fresh Seafood'],
    destinations: 130,
    countriesServed: 35,
    description: 'Singapore Airlines Cargo provides premium air freight services connecting Asia to major global destinations.',
    rating: 4.7,
    verified: true,
    alliance: 'Star Alliance'
  },
  {
    id: 'korean-air-cargo',
    name: 'Korean Air Cargo',
    iataCode: 'KE',
    icaoCode: 'KAL',
    headquarters: 'Seoul',
    country: 'South Korea',
    region: 'Asia',
    founded: 1962,
    website: 'https://cargo.koreanair.com',
    hubAirports: ['Incheon (ICN)'],
    fleet: { total: 23, freighters: 23, passengerWithCargo: 100 },
    capacity: { annualFreightTonnage: 1600000, availableTonnageKm: 7000000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Dangerous Goods'],
    cargoTypes: ['General Cargo', 'Electronics', 'Semiconductors', 'Pharmaceuticals', 'Dangerous Goods'],
    specializations: ['Semiconductors', 'Electronics', 'Cold Chain', 'Aerospace'],
    destinations: 125,
    countriesServed: 40,
    description: 'Korean Air Cargo is a leading trans-Pacific freight carrier, specializing in electronics and semiconductor logistics.',
    rating: 4.6,
    verified: true,
    alliance: 'SkyTeam'
  },
  {
    id: 'air-france-klm-cargo',
    name: 'Air France KLM Cargo',
    iataCode: 'AF',
    icaoCode: 'AFR',
    headquarters: 'Paris',
    country: 'France',
    region: 'Europe',
    founded: 2004,
    website: 'https://www.afklcargo.com',
    hubAirports: ['Paris CDG', 'Amsterdam (AMS)'],
    fleet: { total: 10, freighters: 10, passengerWithCargo: 220 },
    capacity: { annualFreightTonnage: 1200000, availableTonnageKm: 5500000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Live Animals'],
    cargoTypes: ['General Cargo', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Fashion', 'Aerospace'],
    specializations: ['Fashion & Luxury', 'Pharma', 'Aerospace', 'Perishables'],
    destinations: 250,
    countriesServed: 100,
    description: 'Air France KLM Cargo combines two European legacy carriers to offer comprehensive air cargo services.',
    rating: 4.5,
    verified: true,
    alliance: 'SkyTeam'
  },
  {
    id: 'qatar-airways-cargo',
    name: 'Qatar Airways Cargo',
    iataCode: 'QR',
    icaoCode: 'QTR',
    headquarters: 'Doha',
    country: 'Qatar',
    region: 'Middle East',
    founded: 1993,
    website: 'https://www.qrcargo.com',
    hubAirports: ['Doha (DOH)'],
    fleet: { total: 28, freighters: 28, passengerWithCargo: 200 },
    capacity: { annualFreightTonnage: 3000000, availableTonnageKm: 13000000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Live Animals', 'Charter'],
    cargoTypes: ['General Cargo', 'Pharmaceuticals', 'Perishables', 'Live Animals', 'Dangerous Goods', 'Oversized'],
    specializations: ['Pharma', 'Equine', 'Automotive', 'Oil & Gas'],
    destinations: 160,
    countriesServed: 85,
    description: 'Qatar Airways Cargo is one of the world\'s largest international cargo carriers, operating from its Doha hub.',
    rating: 4.7,
    verified: true,
    alliance: 'Oneworld'
  },
  {
    id: 'china-southern-cargo',
    name: 'China Southern Cargo',
    iataCode: 'CZ',
    icaoCode: 'CSN',
    headquarters: 'Guangzhou',
    country: 'China',
    region: 'Asia',
    founded: 1988,
    website: 'https://www.csair.com',
    hubAirports: ['Guangzhou (CAN)', 'Beijing (PEK)', 'Shanghai PVG'],
    fleet: { total: 14, freighters: 14, passengerWithCargo: 400 },
    capacity: { annualFreightTonnage: 1100000, availableTonnageKm: 4500000 },
    services: ['Freight', 'Express', 'E-commerce', 'Perishables'],
    cargoTypes: ['General Cargo', 'Electronics', 'E-commerce', 'Perishables'],
    specializations: ['E-commerce', 'Electronics', 'Cross-border Trade'],
    destinations: 220,
    countriesServed: 40,
    description: 'China Southern Cargo is a major Chinese carrier with extensive domestic and international cargo operations.',
    rating: 4.4,
    verified: true,
    alliance: 'SkyTeam'
  },
  {
    id: 'ana-cargo',
    name: 'ANA Cargo',
    iataCode: 'NH',
    icaoCode: 'ANA',
    headquarters: 'Tokyo',
    country: 'Japan',
    region: 'Asia',
    founded: 1952,
    website: 'https://www.ana.co.jp/eng/cargo',
    hubAirports: ['Tokyo Narita (NRT)', 'Tokyo Haneda (HND)'],
    fleet: { total: 10, freighters: 10, passengerWithCargo: 150 },
    capacity: { annualFreightTonnage: 900000, availableTonnageKm: 4000000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Dangerous Goods'],
    cargoTypes: ['General Cargo', 'Electronics', 'Automotive Parts', 'Pharmaceuticals', 'Perishables'],
    specializations: ['Automotive', 'Electronics', 'Pharma', 'Temperature-Sensitive'],
    destinations: 95,
    countriesServed: 40,
    description: 'ANA Cargo offers premium air freight services from Japan with expertise in automotive and electronics logistics.',
    rating: 4.6,
    verified: true,
    alliance: 'Star Alliance'
  },
  {
    id: 'cargolux',
    name: 'Cargolux',
    iataCode: 'CV',
    icaoCode: 'CLX',
    headquarters: 'Luxembourg',
    country: 'Luxembourg',
    region: 'Europe',
    founded: 1970,
    website: 'https://www.cargolux.com',
    hubAirports: ['Luxembourg (LUX)', 'Zhengzhou (CGO)'],
    fleet: { total: 30, freighters: 30, passengerWithCargo: 0 },
    capacity: { annualFreightTonnage: 1000000, availableTonnageKm: 4500000 },
    services: ['Freight', 'Charter', 'Dangerous Goods', 'Live Animals', 'Oversized Cargo'],
    cargoTypes: ['General Cargo', 'Dangerous Goods', 'Live Animals', 'Oversized', 'Heavy Lift', 'Aerospace'],
    specializations: ['Heavy Lift', 'Outsized Cargo', 'Aerospace', 'Live Animals'],
    destinations: 75,
    countriesServed: 50,
    description: 'Cargolux is Europe\'s largest all-cargo airline, specializing in complex and oversized cargo transportation.',
    rating: 4.6,
    verified: true
  },
  {
    id: 'etihad-cargo',
    name: 'Etihad Cargo',
    iataCode: 'EY',
    icaoCode: 'ETD',
    headquarters: 'Abu Dhabi',
    country: 'UAE',
    region: 'Middle East',
    founded: 2003,
    website: 'https://www.etihadcargo.com',
    hubAirports: ['Abu Dhabi (AUH)'],
    fleet: { total: 5, freighters: 5, passengerWithCargo: 100 },
    capacity: { annualFreightTonnage: 700000, availableTonnageKm: 3500000 },
    services: ['Freight', 'Express', 'Perishables', 'Pharmaceuticals', 'Live Animals'],
    cargoTypes: ['General Cargo', 'Pharmaceuticals', 'Perishables', 'Live Animals', 'Dangerous Goods'],
    specializations: ['Pharma', 'Fresh Produce', 'Equine', 'Automotive'],
    destinations: 100,
    countriesServed: 60,
    description: 'Etihad Cargo provides comprehensive air cargo services from its Abu Dhabi hub connecting East and West.',
    rating: 4.5,
    verified: true
  },
  {
    id: 'atlantic-airlines',
    name: 'Atlas Air',
    iataCode: '5Y',
    icaoCode: 'GTI',
    headquarters: 'Purchase',
    country: 'United States',
    region: 'North America',
    founded: 1992,
    website: 'https://www.atlasair.com',
    hubAirports: ['Miami (MIA)', 'New York JFK', 'Chicago (ORD)', 'Los Angeles (LAX)'],
    fleet: { total: 88, freighters: 88, passengerWithCargo: 0 },
    capacity: { annualFreightTonnage: 4000000, availableTonnageKm: 8000000 },
    services: ['ACMI', 'CMI', 'Charter', 'Freight'],
    cargoTypes: ['General Cargo', 'Military', 'Oversized', 'Dangerous Goods', 'E-commerce'],
    specializations: ['ACMI Services', 'Military Logistics', 'Charter Operations', 'E-commerce Peak'],
    destinations: 200,
    countriesServed: 80,
    description: 'Atlas Air is a leading provider of outsourced aircraft and aviation operating services worldwide.',
    rating: 4.5,
    verified: true
  }
];

export const serviceCategories = [
  'Express', 'Freight', 'E-commerce', 'Charter',
  'Perishables', 'Pharmaceuticals', 'Dangerous Goods',
  'Live Animals', 'Temperature Controlled', 'Oversized Cargo'
];

export const cargoTypes = [
  'General Cargo', 'Electronics', 'E-commerce',
  'Pharmaceuticals', 'Perishables', 'Live Animals',
  'Dangerous Goods', 'High-Value', 'Aerospace',
  'Automotive', 'Fashion', 'Oversized'
];

export const regionOptions = [
  'North America', 'South America', 'Europe', 'Asia',
  'Middle East', 'Africa', 'Oceania'
];
