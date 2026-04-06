// Comprehensive Air Cargo Carriers Data for Shiportrade.com
// Over 15+ Air Cargo Carriers Worldwide

export interface AirCargoCarrier {
  id: string;
  name: string;
  shortName: string;
  iataCode: string;
  icaoCode: string;
  logo?: string;
  country: string;
  headquarters: string;
  founded: string;
  website: string;
  description: string;
  services: string[];
  fleet: {
    total: number;
    freighters: number;
    types: string[];
  };
  hubs: string[];
  destinations: number;
  regions: string[];
  certifications: string[];
  specialties: string[];
  cargoCapacity: {
    annualTonnage: string;
    availableTonnage: string;
  };
  contact: {
    email?: string;
    phone?: string;
    cargoCenter?: string;
  };
  stats: {
    employees?: string;
    annualRevenue?: string;
    fleetAge?: string;
  };
  ratings: {
    overall: number;
    reliability: number;
    network: number;
    pricing: number;
  };
}

export const airCargoCarriers: AirCargoCarrier[] = [
  // ==================== TOP GLOBAL CARGO AIRLINES ====================
  {
    id: "fedex-express",
    name: "FedEx Express",
    shortName: "FedEx",
    iataCode: "FX",
    icaoCode: "FDX",
    country: "United States",
    headquarters: "Memphis, TN, USA",
    founded: "1971",
    website: "https://www.fedex.com",
    description: "FedEx Express is the world's largest express transportation company, providing fast and reliable delivery to more than 220 countries and territories. The company operates the world's largest cargo airline fleet.",
    services: ["Express Freight", "Economy Freight", "Same Day Delivery", "International Priority", "Temperature Controlled", "Dangerous Goods", "E-commerce Solutions"],
    fleet: {
      total: 697,
      freighters: 697,
      types: ["Boeing 777F", "Boeing 767F", "Boeing 757F", "Boeing 747-400F", "Airbus A300F", "Airbus A310F", "McDonnell Douglas MD-11F", "ATR 42/72", "Cessna 208"]
    },
    hubs: ["Memphis", "Indianapolis", "Oakland", "Anchorage", "Paris CDG", "Dubai", "Hong Kong", "Guangzhou", "Shanghai", "Tokyo Narita"],
    destinations: 375,
    regions: ["Global", "North America", "Europe", "Asia Pacific", "Middle East", "Latin America", "Africa"],
    certifications: ["IATA", "IOSA", "TAPA", "GDP", "AEO"],
    specialties: ["Express Delivery", "E-commerce", "Pharmaceuticals", "Perishables", "Dangerous Goods", "Aerospace Parts"],
    cargoCapacity: {
      annualTonnage: "8.5M tons",
      availableTonnage: "35,000+ tons daily"
    },
    contact: {
      email: "cargo@fedex.com",
      phone: "+1 800 463 3339",
      cargoCenter: "Memphis World Hub, Memphis, TN 38118, USA"
    },
    stats: {
      employees: "85,000+",
      annualRevenue: "$45.8 billion",
      fleetAge: "12 years"
    },
    ratings: { overall: 4.7, reliability: 4.8, network: 4.9, pricing: 4.2 }
  },
  {
    id: "ups-airlines",
    name: "UPS Airlines",
    shortName: "UPS",
    iataCode: "5X",
    icaoCode: "UPS",
    country: "United States",
    headquarters: "Louisville, KY, USA",
    founded: "1988",
    website: "https://www.ups.com/aircargo",
    description: "UPS Airlines is the cargo airline subsidiary of UPS, operating one of the largest cargo airline fleets in the world from its primary hub at Louisville International Airport.",
    services: ["Air Freight", "Next Day Air", "2nd Day Air", "International Air Freight", "Temperature Controlled", "Heavy Cargo", "Charter Services"],
    fleet: {
      total: 290,
      freighters: 290,
      types: ["Boeing 747-8F", "Boeing 747-400F", "Boeing 767F", "Boeing 757F", "Airbus A300F", "MD-11F"]
    },
    hubs: ["Louisville", "Anchorage", "Ontario", "Dallas", "Philadelphia", "Cologne", "Dubai", "Hong Kong", "Shenzhen"],
    destinations: 815,
    regions: ["Global", "North America", "Europe", "Asia Pacific", "Middle East", "Latin America"],
    certifications: ["IATA", "IOSA", "TAPA", "GDP", "C-TPAT", "AEO"],
    specialties: ["Time-Definite Delivery", "Healthcare", "High-Value Goods", "Automotive", "Technology", "Retail"],
    cargoCapacity: {
      annualTonnage: "5.8M tons",
      availableTonnage: "25,000+ tons daily"
    },
    contact: {
      email: "aircargo@ups.com",
      phone: "+1 800 782 7892",
      cargoCenter: "Worldport, Louisville, KY 40213, USA"
    },
    stats: {
      employees: "42,000+",
      annualRevenue: "$28.5 billion",
      fleetAge: "14 years"
    },
    ratings: { overall: 4.6, reliability: 4.7, network: 4.8, pricing: 4.3 }
  },
  {
    id: "cathay-pacific-cargo",
    name: "Cathay Pacific Cargo",
    shortName: "Cathay Cargo",
    iataCode: "CX",
    icaoCode: "CPA",
    country: "Hong Kong",
    headquarters: "Hong Kong",
    founded: "1946",
    website: "https://www.cathaypacificcargo.com",
    description: "Cathay Pacific Cargo is the cargo division of Cathay Pacific, operating from one of the world's busiest air cargo hubs in Hong Kong, serving major global trade lanes.",
    services: ["Air Cargo", "Temperature Controlled", "Pharmaceuticals", "Live Animals", "Dangerous Goods", "Oversized Cargo", "Premium Cargo"],
    fleet: {
      total: 20,
      freighters: 20,
      types: ["Boeing 747-8F", "Boeing 747-400ERF", "Boeing 747-400F", "Boeing 777F (belly cargo)"]
    },
    hubs: ["Hong Kong"],
    destinations: 120,
    regions: ["Global", "Asia Pacific", "Europe", "North America", "Middle East", "Oceania"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "CEIV Live Animals", "TAPA"],
    specialties: ["Pharmaceuticals", "Perishables", "Live Animals", "Fashion", "Electronics", "Luxury Goods"],
    cargoCapacity: {
      annualTonnage: "2.2M tons",
      availableTonnage: "12,000+ tons daily"
    },
    contact: {
      email: "cargo@cathaypacific.com",
      phone: "+852 2747 8888",
      cargoCenter: "Cathay Pacific Cargo Terminal, Hong Kong International Airport"
    },
    stats: {
      employees: "5,000+",
      annualRevenue: "HKD 42 billion",
      fleetAge: "10 years"
    },
    ratings: { overall: 4.8, reliability: 4.8, network: 4.7, pricing: 4.4 }
  },
  {
    id: "korean-air-cargo",
    name: "Korean Air Cargo",
    shortName: "KAL Cargo",
    iataCode: "KE",
    icaoCode: "KAL",
    country: "South Korea",
    headquarters: "Seoul, South Korea",
    founded: "1962",
    website: "https://www.koreanair.com/cargo",
    description: "Korean Air Cargo is one of the world's largest transpacific air cargo carriers, operating from its hub at Incheon International Airport with extensive global network.",
    services: ["Air Freight", "Express Cargo", "Temperature Controlled", "Dangerous Goods", "Live Animals", "Perishables", "Charter"],
    fleet: {
      total: 23,
      freighters: 23,
      types: ["Boeing 747-8F", "Boeing 777F", "Boeing 747-400F"]
    },
    hubs: ["Incheon", "Los Angeles", "Anchorage"],
    destinations: 130,
    regions: ["Global", "Asia Pacific", "North America", "Europe", "Oceania"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "TAPA", "GDP"],
    specialties: ["Semiconductors", "Electronics", "Automotive", "Pharmaceuticals", "Perishables", "Fashion"],
    cargoCapacity: {
      annualTonnage: "1.8M tons",
      availableTonnage: "8,500+ tons daily"
    },
    contact: {
      email: "cargo@koreanair.com",
      phone: "+82 2 2656 7114",
      cargoCenter: "Incheon International Airport Cargo Terminal, Seoul, South Korea"
    },
    stats: {
      employees: "3,500+",
      annualRevenue: "KRW 5.2 trillion",
      fleetAge: "8 years"
    },
    ratings: { overall: 4.7, reliability: 4.7, network: 4.7, pricing: 4.4 }
  },
  {
    id: "emirates-skycargo",
    name: "Emirates SkyCargo",
    shortName: "EK Cargo",
    iataCode: "EK",
    icaoCode: "UAE",
    country: "United Arab Emirates",
    headquarters: "Dubai, UAE",
    founded: "1985",
    website: "https://www.emirates.com/skycargo",
    description: "Emirates SkyCargo is the freight division of Emirates Airline, connecting global markets through its dual hub operations in Dubai, serving six continents.",
    services: ["Air Cargo", "Temperature Controlled", "Pharma Handling", "Live Animals", "Perishables", "Dangerous Goods", "Charter", "Uplift Guarantee"],
    fleet: {
      total: 11,
      freighters: 11,
      types: ["Boeing 777F", "Boeing 747-400F"]
    },
    hubs: ["Dubai International", "Dubai World Central"],
    destinations: 150,
    regions: ["Global", "Middle East", "Asia Pacific", "Europe", "Africa", "Americas", "Oceania"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "CEIV Live Animals", "TAPA", "GDP"],
    specialties: ["Pharmaceuticals", "Perishables", "Live Animals", "Gold & Valuables", "Automotive", "Oil & Gas Equipment"],
    cargoCapacity: {
      annualTonnage: "2.5M tons",
      availableTonnage: "10,000+ tons daily"
    },
    contact: {
      email: "cargo@emirates.com",
      phone: "+971 4 708 1111",
      cargoCenter: "Emirates SkyCentral, Dubai World Central, UAE"
    },
    stats: {
      employees: "4,200+",
      annualRevenue: "AED 12.4 billion",
      fleetAge: "6 years"
    },
    ratings: { overall: 4.7, reliability: 4.7, network: 4.9, pricing: 4.3 }
  },
  {
    id: "lufthansa-cargo",
    name: "Lufthansa Cargo",
    shortName: "LHC Cargo",
    iataCode: "LH",
    icaoCode: "GEC",
    country: "Germany",
    headquarters: "Frankfurt, Germany",
    founded: "1994",
    website: "https://www.lufthansa-cargo.com",
    description: "Lufthansa Cargo is one of the world's leading air freight carriers, operating from its main hub at Frankfurt Airport with an extensive global network.",
    services: ["Air Freight", "Express Products", "Temperature Controlled", "Pharmaceuticals", "Live Animals", "Dangerous Goods", "Airmail", "Charter"],
    fleet: {
      total: 17,
      freighters: 17,
      types: ["Boeing 777F", "McDonnell Douglas MD-11F"]
    },
    hubs: ["Frankfurt", "Munich"],
    destinations: 300,
    regions: ["Global", "Europe", "Asia Pacific", "North America", "South America", "Africa", "Middle East"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "CEIV Live Animals", "TAPA FSR", "GDP"],
    specialties: ["Pharmaceuticals", "Automotive", "Technology", "Fashion", "Live Animals", "Perishables"],
    cargoCapacity: {
      annualTonnage: "1.5M tons",
      availableTonnage: "7,500+ tons daily"
    },
    contact: {
      email: "customer.service@lhcargo.com",
      phone: "+49 69 696 0",
      cargoCenter: "Lufthansa Cargo Center, Frankfurt Airport, Germany"
    },
    stats: {
      employees: "4,500+",
      annualRevenue: "EUR 3.8 billion",
      fleetAge: "12 years"
    },
    ratings: { overall: 4.6, reliability: 4.6, network: 4.7, pricing: 4.3 }
  },
  {
    id: "singapore-airlines-cargo",
    name: "Singapore Airlines Cargo",
    shortName: "SIA Cargo",
    iataCode: "SQ",
    icaoCode: "SIA",
    country: "Singapore",
    headquarters: "Singapore",
    founded: "1972",
    website: "https://www.siacargo.com",
    description: "Singapore Airlines Cargo is the air freight division of Singapore Airlines, operating from Changi Airport, one of Asia's largest cargo hubs.",
    services: ["Air Freight", "Temperature Controlled", "Pharmaceuticals", "Live Animals", "Perishables", "Dangerous Goods", "E-commerce", "Project Cargo"],
    fleet: {
      total: 7,
      freighters: 7,
      types: ["Boeing 747-400F"]
    },
    hubs: ["Singapore Changi"],
    destinations: 130,
    regions: ["Global", "Asia Pacific", "Europe", "North America", "Oceania", "Middle East", "Africa"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "TAPA", "GDP"],
    specialties: ["Pharmaceuticals", "Electronics", "Perishables", "Fashion", "Live Animals", "Aerospace Components"],
    cargoCapacity: {
      annualTonnage: "1.2M tons",
      availableTonnage: "6,000+ tons daily"
    },
    contact: {
      email: "cargo_queries@singaporeair.com.sg",
      phone: "+65 6223 8888",
      cargoCenter: "SIA Cargo Terminal, Changi Airfreight Centre, Singapore"
    },
    stats: {
      employees: "2,800+",
      annualRevenue: "SGD 2.1 billion",
      fleetAge: "15 years"
    },
    ratings: { overall: 4.7, reliability: 4.7, network: 4.6, pricing: 4.4 }
  },
  {
    id: "qatar-cargo",
    name: "Qatar Airways Cargo",
    shortName: "QR Cargo",
    iataCode: "QR",
    icaoCode: "QTR",
    country: "Qatar",
    headquarters: "Doha, Qatar",
    founded: "1993",
    website: "https://www.qrcargo.com",
    description: "Qatar Airways Cargo is the cargo arm of Qatar Airways, operating a modern fleet from its hub in Doha, serving destinations across six continents.",
    services: ["Air Freight", "Temperature Controlled", "Pharmaceuticals", "Live Animals", "Perishables", "Dangerous Goods", "Charter", "Valuables"],
    fleet: {
      total: 26,
      freighters: 26,
      types: ["Boeing 777F", "Boeing 747-8F", "Boeing 747-400F", "Airbus A330F"]
    },
    hubs: ["Doha Hamad International"],
    destinations: 170,
    regions: ["Global", "Middle East", "Europe", "Asia Pacific", "Africa", "Americas", "Oceania"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "CEIV Fresh", "CEIV Live Animals", "TAPA"],
    specialties: ["Pharmaceuticals", "Perishables", "Live Animals", "Oil & Gas Equipment", "Automotive", "Fashion"],
    cargoCapacity: {
      annualTonnage: "2.8M tons",
      availableTonnage: "12,000+ tons daily"
    },
    contact: {
      email: "cargo@qatarairways.com.qa",
      phone: "+974 4449 6666",
      cargoCenter: "Qatar Airways Cargo Terminal, Hamad International Airport, Doha, Qatar"
    },
    stats: {
      employees: "5,200+",
      annualRevenue: "QAR 9.5 billion",
      fleetAge: "7 years"
    },
    ratings: { overall: 4.6, reliability: 4.6, network: 4.8, pricing: 4.3 }
  },
  {
    id: "cargojet",
    name: "CargoJet Airways",
    shortName: "CargoJet",
    iataCode: "W8",
    icaoCode: "CJT",
    country: "Canada",
    headquarters: "Mississauga, ON, Canada",
    founded: "2002",
    website: "https://www.cargojet.com",
    description: "CargoJet is Canada's leading air cargo carrier, providing dedicated overnight cargo services across Canada and selected international destinations.",
    services: ["Overnight Cargo", "ACMI Charter", "Ad-Hoc Charter", "Aircraft Maintenance", "Ground Handling", "Heavy Lift"],
    fleet: {
      total: 29,
      freighters: 29,
      types: ["Boeing 767F", "Boeing 757F", "Boeing 777F"]
    },
    hubs: ["Hamilton", "Vancouver", "Montreal", "Calgary"],
    destinations: 15,
    regions: ["North America", "Canada", "United States", "Europe"],
    certifications: ["IATA", "IOSA", "TAPA", "AEO"],
    specialties: ["Overnight Delivery", "E-commerce", "Time-Critical", "Automotive", "Perishables"],
    cargoCapacity: {
      annualTonnage: "750K tons",
      availableTonnage: "3,500+ tons daily"
    },
    contact: {
      email: "info@cargojet.com",
      phone: "+1 905 672 2500",
      cargoCenter: "Cargojet Centre, John C. Munro Hamilton International Airport, Hamilton, ON, Canada"
    },
    stats: {
      employees: "1,200+",
      annualRevenue: "CAD 980 million",
      fleetAge: "18 years"
    },
    ratings: { overall: 4.5, reliability: 4.6, network: 4.3, pricing: 4.5 }
  },
  // ==================== SPECIALIZED CARGO CARRIERS ====================
  {
    id: "atlas-air",
    name: "Atlas Air",
    shortName: "Atlas",
    iataCode: "5Y",
    icaoCode: "GTI",
    country: "United States",
    headquarters: "Purchase, NY, USA",
    founded: "1992",
    website: "https://www.atlasair.com",
    description: "Atlas Air is a leading global provider of outsourced aircraft and aviation operating services, operating one of the world's largest fleets of Boeing 747 freighters.",
    services: ["ACMI", "CMI", "Charter", "Dry Leasing", "Wet Leasing", "Cargo Operations", "Passenger Charter"],
    fleet: {
      total: 54,
      freighters: 54,
      types: ["Boeing 747-8F", "Boeing 747-400F", "Boeing 777F", "Boeing 767F"]
    },
    hubs: ["Miami", "Cincinnati", "Hong Kong", "Anchorage"],
    destinations: 300,
    regions: ["Global", "North America", "Asia Pacific", "Europe", "Middle East"],
    certifications: ["IATA", "IOSA", "TAPA", "C-TPAT"],
    specialties: ["Heavy Lift", "Project Cargo", "Military", "Humanitarian", "Oversized Cargo", "Automotive"],
    cargoCapacity: {
      annualTonnage: "4.5M tons",
      availableTonnage: "18,000+ tons daily"
    },
    contact: {
      email: "charter@atlasair.com",
      phone: "+1 914 701 8000",
      cargoCenter: "2000 Westchester Avenue, Purchase, NY 10577, USA"
    },
    stats: {
      employees: "4,500+",
      annualRevenue: "$4.2 billion",
      fleetAge: "16 years"
    },
    ratings: { overall: 4.5, reliability: 4.5, network: 4.6, pricing: 4.4 }
  },
  {
    id: "kalitta-air",
    name: "Kalitta Air",
    shortName: "Kalitta",
    iataCode: "K4",
    icaoCode: "CKS",
    country: "United States",
    headquarters: "Ypsilanti, MI, USA",
    founded: "2000",
    website: "https://www.kalittaair.com",
    description: "Kalitta Air is a major US cargo airline operating scheduled and charter cargo services, specializing in heavy lift and oversized cargo transport.",
    services: ["Scheduled Cargo", "Charter Services", "Military Cargo", "Humanitarian Aid", "Heavy Lift", "Oversized Cargo", "ACMI"],
    fleet: {
      total: 35,
      freighters: 35,
      types: ["Boeing 777F", "Boeing 747-400F", "Boeing 767F"]
    },
    hubs: ["Detroit", "Cincinnati", "Los Angeles"],
    destinations: 50,
    regions: ["Global", "North America", "Asia Pacific", "Europe", "Middle East"],
    certifications: ["IATA", "IOSA", "TAPA", "C-TPAT"],
    specialties: ["Military Transport", "Oversized Cargo", "Heavy Machinery", "Automotive", "Oil & Gas Equipment", "Humanitarian"],
    cargoCapacity: {
      annualTonnage: "1.8M tons",
      availableTonnage: "8,000+ tons daily"
    },
    contact: {
      email: "ops@kalittaair.com",
      phone: "+1 734 547 1800",
      cargoCenter: "Willow Run Airport, Ypsilanti, MI 48198, USA"
    },
    stats: {
      employees: "2,500+",
      annualRevenue: "$1.2 billion",
      fleetAge: "20 years"
    },
    ratings: { overall: 4.4, reliability: 4.4, network: 4.3, pricing: 4.5 }
  },
  {
    id: "martinair",
    name: "Martinair",
    shortName: "Martinair",
    iataCode: "MP",
    icaoCode: "MPH",
    country: "Netherlands",
    headquarters: "Haarlemmermeer, Netherlands",
    founded: "1958",
    website: "https://www.martinair.com",
    description: "Martinair is a Dutch cargo airline and subsidiary of KLM, operating dedicated freighter services from Amsterdam Schiphol Airport.",
    services: ["Air Cargo", "Charter", "ACMI", "Heavy Cargo", "Live Animals", "Temperature Controlled", "Dangerous Goods"],
    fleet: {
      total: 4,
      freighters: 4,
      types: ["Boeing 747-400F", "Boeing 747-400ERF"]
    },
    hubs: ["Amsterdam Schiphol"],
    destinations: 30,
    regions: ["Global", "Europe", "North America", "Asia Pacific", "Middle East", "Africa"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "TAPA", "GDP"],
    specialties: ["Pharmaceuticals", "Live Animals", "Perishables", "Flowers", "Electronics", "Machinery"],
    cargoCapacity: {
      annualTonnage: "350K tons",
      availableTonnage: "1,500+ tons daily"
    },
    contact: {
      email: "cargo.info@martinair.com",
      phone: "+31 20 649 9111",
      cargoCenter: "Martinair Cargo, Schiphol Airport, Amsterdam, Netherlands"
    },
    stats: {
      employees: "800+",
      annualRevenue: "EUR 420 million",
      fleetAge: "18 years"
    },
    ratings: { overall: 4.5, reliability: 4.5, network: 4.2, pricing: 4.5 }
  },
  {
    id: "polar-air",
    name: "Polar Air Cargo",
    shortName: "Polar",
    iataCode: "PO",
    icaoCode: "PAC",
    country: "United States",
    headquarters: "Purchase, NY, USA",
    founded: "1993",
    website: "https://www.polaraircargo.com",
    description: "Polar Air Cargo is a subsidiary of Atlas Air Worldwide, providing time-definite airport-to-airport air cargo services globally.",
    services: ["Scheduled Cargo", "Time-Definite", "Express", "Heavy Cargo", "Dangerous Goods", "Temperature Controlled", "Charter"],
    fleet: {
      total: 8,
      freighters: 8,
      types: ["Boeing 747-8F", "Boeing 747-400F"]
    },
    hubs: ["Cincinnati", "Hong Kong", "Anchorage", "Los Angeles"],
    destinations: 25,
    regions: ["Global", "North America", "Asia Pacific", "Europe"],
    certifications: ["IATA", "IOSA", "TAPA", "C-TPAT"],
    specialties: ["Trans-Pacific", "Heavy Cargo", "Electronics", "Automotive", "Fashion", "Perishables"],
    cargoCapacity: {
      annualTonnage: "750K tons",
      availableTonnage: "3,000+ tons daily"
    },
    contact: {
      email: "cargo@polaraircargo.com",
      phone: "+1 914 701 8200",
      cargoCenter: "2000 Westchester Avenue, Purchase, NY 10577, USA"
    },
    stats: {
      employees: "650+",
      annualRevenue: "$580 million",
      fleetAge: "14 years"
    },
    ratings: { overall: 4.4, reliability: 4.4, network: 4.4, pricing: 4.5 }
  },
  {
    id: "airbridge-cargo",
    name: "AirBridgeCargo Airlines",
    shortName: "ABC",
    iataCode: "RU",
    icaoCode: "ABW",
    country: "Russia",
    headquarters: "Moscow, Russia",
    founded: "2004",
    website: "https://www.airbridgecargo.com",
    description: "AirBridgeCargo is one of Russia's largest cargo airlines, operating scheduled all-cargo services connecting Europe, Asia, and North America.",
    services: ["Scheduled Cargo", "Charter", "Heavy Cargo", "Dangerous Goods", "Temperature Controlled", "Live Animals", "Oversized Cargo"],
    fleet: {
      total: 18,
      freighters: 18,
      types: ["Boeing 747-8F", "Boeing 747-400ERF", "Boeing 747-400F"]
    },
    hubs: ["Moscow Sheremetyevo"],
    destinations: 35,
    regions: ["Global", "Europe", "Asia Pacific", "North America"],
    certifications: ["IATA", "IOSA", "TAPA", "CEIV Pharma"],
    specialties: ["Trans-Siberian Route", "Heavy Cargo", "Automotive", "Oil & Gas Equipment", "Electronics", "Machinery"],
    cargoCapacity: {
      annualTonnage: "700K tons",
      availableTonnage: "3,200+ tons daily"
    },
    contact: {
      email: "cargo@airbridgecargo.com",
      phone: "+7 495 578 5555",
      cargoCenter: "Sheremetyevo International Airport, Moscow, Russia"
    },
    stats: {
      employees: "2,000+",
      annualRevenue: "RUB 65 billion",
      fleetAge: "9 years"
    },
    ratings: { overall: 4.3, reliability: 4.3, network: 4.2, pricing: 4.6 }
  },
  {
    id: "china-cargo",
    name: "China Cargo Airlines",
    shortName: "CK Cargo",
    iataCode: "CK",
    icaoCode: "CKK",
    country: "China",
    headquarters: "Shanghai, China",
    founded: "1998",
    website: "https://www.ceair.com/cargo",
    description: "China Cargo Airlines is China's first all-cargo airline, operating from Shanghai as a major hub for air cargo transportation.",
    services: ["Air Cargo", "Express", "Temperature Controlled", "Dangerous Goods", "Live Animals", "Perishables", "E-commerce"],
    fleet: {
      total: 12,
      freighters: 12,
      types: ["Boeing 777F", "Boeing 747-400F"]
    },
    hubs: ["Shanghai Pudong"],
    destinations: 45,
    regions: ["Global", "Asia Pacific", "Europe", "North America"],
    certifications: ["IATA", "IOSA", "CEIV Pharma", "TAPA"],
    specialties: ["Electronics", "E-commerce", "Fashion", "Pharmaceuticals", "Perishables", "Automotive"],
    cargoCapacity: {
      annualTonnage: "900K tons",
      availableTonnage: "4,000+ tons daily"
    },
    contact: {
      email: "cargo@ceair.com",
      phone: "+86 21 6268 6268",
      cargoCenter: "Shanghai Pudong International Airport, Shanghai, China"
    },
    stats: {
      employees: "2,500+",
      annualRevenue: "CNY 8.5 billion",
      fleetAge: "11 years"
    },
    ratings: { overall: 4.4, reliability: 4.4, network: 4.3, pricing: 4.5 }
  },
  {
    id: "silk-way-west",
    name: "Silk Way West Airlines",
    shortName: "SW West",
    iataCode: "7L",
    icaoCode: "AZQ",
    country: "Azerbaijan",
    headquarters: "Baku, Azerbaijan",
    founded: "2012",
    website: "https://www.silkwaywest.com",
    description: "Silk Way West Airlines is the largest cargo airline in the Caspian region, operating from its hub in Baku connecting East and West.",
    services: ["Scheduled Cargo", "Charter", "Heavy Cargo", "Dangerous Goods", "Live Animals", "Humanitarian", "Military"],
    fleet: {
      total: 12,
      freighters: 12,
      types: ["Boeing 747-8F", "Boeing 747-400F"]
    },
    hubs: ["Baku Heydar Aliyev"],
    destinations: 40,
    regions: ["Global", "Europe", "Asia", "Middle East", "Africa"],
    certifications: ["IATA", "IOSA", "TAPA"],
    specialties: ["Silk Road Routes", "Heavy Cargo", "Military", "Humanitarian", "Oil & Gas Equipment", "Automotive"],
    cargoCapacity: {
      annualTonnage: "450K tons",
      availableTonnage: "2,200+ tons daily"
    },
    contact: {
      email: "cargo@silkwaywest.com",
      phone: "+994 12 497 1010",
      cargoCenter: "Heydar Aliyev International Airport, Baku, Azerbaijan"
    },
    stats: {
      employees: "1,200+",
      annualRevenue: "USD 520 million",
      fleetAge: "10 years"
    },
    ratings: { overall: 4.3, reliability: 4.4, network: 4.2, pricing: 4.5 }
  }
];

// Helper functions
export function getAirCargoCarrierById(id: string): AirCargoCarrier | undefined {
  return airCargoCarriers.find(carrier => carrier.id === id);
}

export function getAirCargoCarriersByRegion(region: string): AirCargoCarrier[] {
  return airCargoCarriers.filter(carrier => carrier.regions.includes(region));
}

export function getAirCargoCarriersByCountry(country: string): AirCargoCarrier[] {
  return airCargoCarriers.filter(carrier => carrier.country === country);
}

export function getAirCargoCarriersByHub(hub: string): AirCargoCarrier[] {
  return airCargoCarriers.filter(carrier => carrier.hubs.includes(hub));
}

export function getAirCargoCarriersBySpecialty(specialty: string): AirCargoCarrier[] {
  return airCargoCarriers.filter(carrier => carrier.specialties.includes(specialty));
}

export function searchAirCargoCarriers(query: string): AirCargoCarrier[] {
  const lowerQuery = query.toLowerCase();
  return airCargoCarriers.filter(carrier => 
    carrier.name.toLowerCase().includes(lowerQuery) ||
    carrier.shortName.toLowerCase().includes(lowerQuery) ||
    carrier.iataCode.toLowerCase().includes(lowerQuery) ||
    carrier.icaoCode.toLowerCase().includes(lowerQuery) ||
    carrier.country.toLowerCase().includes(lowerQuery) ||
    carrier.hubs.some(h => h.toLowerCase().includes(lowerQuery))
  );
}

// Statistics
export const airCargoCarriersStats = {
  total: airCargoCarriers.length,
  totalAircraft: airCargoCarriers.reduce((sum, carrier) => sum + carrier.fleet.total, 0),
  totalFreighters: airCargoCarriers.reduce((sum, carrier) => sum + carrier.fleet.freighters, 0),
  totalDestinations: Math.max(...airCargoCarriers.map(c => c.destinations)),
  totalEmployees: "180,000+",
  topCountries: ["United States", "Hong Kong", "Germany", "Singapore", "United Arab Emirates"],
  topAircraft: ["Boeing 747-8F", "Boeing 777F", "Boeing 767F", "Boeing 747-400F"],
  topSpecialties: ["Pharmaceuticals", "Electronics", "Perishables", "Automotive", "E-commerce"]
};

export function getTopAirCargoCarriers(limit: number): AirCargoCarrier[] {
  return [...airCargoCarriers]
    .sort((a, b) => b.ratings.overall - a.ratings.overall)
    .slice(0, limit);
}
