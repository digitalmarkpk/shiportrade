// Marketplace Types for Shiportrade.com

export enum ListingCategory {
  // Containers
  CONTAINERS_BUY = 'containers/buy',
  CONTAINERS_SELL = 'containers/sell',
  CONTAINERS_LEASE = 'containers/lease',
  CONTAINERS_REEFER = 'containers/reefer',
  CONTAINERS_SPECIAL = 'containers/special',
  
  // Freight & Shipping
  FREIGHT_QUOTE = 'freight/quote',
  FREIGHT_POST = 'freight/post',
  FREIGHT_FORWARDERS = 'freight/forwarders',
  FREIGHT_BOOK = 'freight/book',
  
  // Transport & Trucking
  TRANSPORT_TRUCKS = 'transport/trucks',
  TRANSPORT_POST_LOAD = 'transport/post-load',
  TRANSPORT_AVAILABLE = 'transport/available',
  
  // Warehousing
  WAREHOUSING_FIND = 'warehousing/find',
  WAREHOUSING_LIST = 'warehousing/list',
  WAREHOUSING_COLD_STORAGE = 'warehousing/cold-storage',
  WAREHOUSING_FULFILLMENT = 'warehousing/fulfillment',
  
  // Vessel & Chartering
  VESSELS_CHARTER = 'vessels/charter',
  VESSELS_LIST = 'vessels/list',
  VESSELS_CARGO = 'vessels/cargo',
  
  // Logistics Services
  SERVICES_CUSTOMS = 'services/customs',
  SERVICES_FORWARDERS = 'services/forwarders',
  SERVICES_INSPECTION = 'services/inspection',
  SERVICES_INSURANCE = 'services/insurance',
  
  // Equipment & Machinery
  EQUIPMENT_PORT = 'equipment/port',
  EQUIPMENT_CRANES = 'equipment/cranes',
  EQUIPMENT_HANDLING = 'equipment/handling',
  
  // Marine Spare Parts
  PARTS_ENGINE = 'parts/engine',
  PARTS_EQUIPMENT = 'parts/equipment',
  PARTS_NAVIGATION = 'parts/navigation',
  
  // B2B Trade
  B2B_BUYERS = 'b2b/buyers',
  B2B_SUPPLIERS = 'b2b/suppliers',
  B2B_COMMODITIES = 'b2b/commodities',
  B2B_RFQS = 'b2b/rfqs',
}

export enum ListingStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  SOLD = 'sold',
  SUSPENDED = 'suspended',
}

export enum ListingType {
  BUY = 'buy',
  SELL = 'sell',
  LEASE = 'lease',
  RENT = 'rent',
  SERVICE = 'service',
  RFQ = 'rfq',
  AUCTION = 'auction',
}

export enum ContainerType {
  DRY_20 = '20ft_dry',
  DRY_40 = '40ft_dry',
  DRY_40HC = '40ft_hc',
  REEFER_20 = '20ft_reefer',
  REEFER_40 = '40ft_reefer',
  REEFER_40HC = '40ft_reefer_hc',
  OPEN_TOP_20 = '20ft_open_top',
  OPEN_TOP_40 = '40ft_open_top',
  FLAT_RACK_20 = '20ft_flat_rack',
  FLAT_RACK_40 = '40ft_flat_rack',
  TANK = 'tank',
  TANK_20 = '20ft_tank',
  TANK_40 = '40ft_tank',
}

export enum CargoType {
  GENERAL = 'general',
  HAZARDOUS = 'hazardous',
  PERISHABLE = 'perishable',
  OVERSIZED = 'oversized',
  TEMPERATURE_CONTROLLED = 'temperature_controlled',
  LIVE_ANIMALS = 'live_animals',
  VEHICLES = 'vehicles',
  BULK = 'bulk',
  BREAKBULK = 'breakbulk',
  PROJECT_CARGO = 'project_cargo',
}

export interface Location {
  address?: string;
  city: string;
  state?: string;
  country: string;
  countryCode: string;
  postalCode?: string;
  port?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface ContactInfo {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  website?: string;
  verified?: boolean;
}

export interface ListingImage {
  id: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
}

export interface ListingPrice {
  amount: number;
  currency: string;
  unit?: string; // e.g., 'per container', 'per day', 'per ton'
  negotiable?: boolean;
  minOrder?: number;
}

export interface ContainerSpecs {
  type: ContainerType;
  condition: 'new' | 'used' | 'refurbished';
  age?: number; // in years
  cscValid?: boolean;
  capacity?: number; // in CBM
  maxPayload?: number; // in kg
  tareWeight?: number; // in kg
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
}

export interface FreightSpecs {
  origin: Location;
  destination: Location;
  cargoType: CargoType;
  weight?: number;
  volume?: number;
  containerType?: ContainerType;
  containerCount?: number;
  readyDate?: string;
  deliveryDate?: string;
  incoterms?: string;
}

export interface WarehouseSpecs {
  totalArea: number; // in sqm
  availableArea?: number;
  ceilingHeight?: number; // in meters
  floorLoadCapacity?: number; // in kg/sqm
  temperatureControlled?: boolean;
  temperatureRange?: {
    min: number;
    max: number;
  };
  hazmatCertified?: boolean;
  services?: string[];
  certifications?: string[];
}

export interface VesselSpecs {
  vesselType: string;
  dwt?: number; // Deadweight tonnage
  grossTonnage?: number;
  length?: number;
  beam?: number;
  draft?: number;
  buildYear?: number;
  flag?: string;
  classificationSociety?: string;
}

export interface Listing {
  id: string;
  title: string;
  description: string;
  category: ListingCategory;
  listingType: ListingType;
  status: ListingStatus;
  
  // Pricing
  price?: ListingPrice;
  
  // Location
  location: Location;
  
  // Contact
  contact: ContactInfo;
  
  // Media
  images?: ListingImage[];
  
  // Category-specific specs
  containerSpecs?: ContainerSpecs;
  freightSpecs?: FreightSpecs;
  warehouseSpecs?: WarehouseSpecs;
  vesselSpecs?: VesselSpecs;
  
  // Metadata
  createdAt: string;
  updatedAt: string;
  expiresAt?: string;
  views: number;
  inquiries: number;
  featured?: boolean;
  verified?: boolean;
  tags?: string[];
  
  // SEO
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface ListingInquiry {
  id: string;
  listingId: string;
  contact: ContactInfo;
  message: string;
  createdAt: string;
  status: 'pending' | 'responded' | 'closed';
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  listingCount?: number;
}

export interface MarketplaceStats {
  totalListings: number;
  activeListings: number;
  totalUsers: number;
  countriesServed: number;
  categories: number;
  inquiriesLastMonth: number;
}

// Marketplace category metadata
export const marketplaceCategories: CategoryInfo[] = [
  {
    id: 'containers',
    name: 'Containers',
    slug: 'containers',
    description: 'Buy, sell, or lease shipping containers worldwide',
    icon: 'Container',
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'freight',
    name: 'Freight & Shipping',
    slug: 'freight',
    description: 'Get freight quotes, post shipments, find forwarders',
    icon: 'Ship',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'transport',
    name: 'Transport & Trucking',
    slug: 'transport',
    description: 'Find trucks, post loads, connect with carriers',
    icon: 'Truck',
    color: 'from-orange-500 to-amber-600',
  },
  {
    id: 'warehousing',
    name: 'Warehousing',
    slug: 'warehousing',
    description: 'Find warehouses, cold storage, fulfillment centers',
    icon: 'Warehouse',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 'vessels',
    name: 'Vessel & Chartering',
    slug: 'vessels',
    description: 'Charter vessels, list vessels, find cargo',
    icon: 'Anchor',
    color: 'from-blue-500 to-indigo-600',
  },
  {
    id: 'services',
    name: 'Logistics Services',
    slug: 'services',
    description: 'Customs clearance, inspections, insurance providers',
    icon: 'Handshake',
    color: 'from-rose-500 to-pink-600',
  },
  {
    id: 'equipment',
    name: 'Equipment & Machinery',
    slug: 'equipment',
    description: 'Port equipment, cranes, material handling',
    icon: 'Wrench',
    color: 'from-slate-500 to-gray-600',
  },
  {
    id: 'parts',
    name: 'Marine Spare Parts',
    slug: 'parts',
    description: 'Engine parts, ship equipment, navigation systems',
    icon: 'Settings',
    color: 'from-sky-500 to-cyan-600',
  },
  {
    id: 'b2b',
    name: 'B2B Trade',
    slug: 'b2b',
    description: 'Find buyers, suppliers, commodities, RFQs',
    icon: 'Users',
    color: 'from-indigo-500 to-blue-600',
  },
];
