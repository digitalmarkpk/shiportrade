// Types for Shiportrade.com

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimalDigits: number;
}

export interface Unit {
  name: string;
  symbol: string;
  toBase: number;
}

export interface ContainerSpec {
  name: string;
  type: string;
  internalLength: number;
  internalWidth: number;
  internalHeight: number;
  doorWidth?: number;
  doorHeight?: number;
  capacity: number;
  maxPayload: number;
  tareWeight: number;
  teu: number;
}

export interface CalculationResult {
  label: string;
  value: number;
  unit: string;
  highlight?: boolean;
}

export interface SavedCalculation {
  id: string;
  toolId: string;
  toolName: string;
  inputs: Record<string, unknown>;
  results: CalculationResult[];
  createdAt: Date;
}

export interface Document {
  id: string;
  name: string;
  description: string;
  category: string;
  slug: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company?: string;
  defaultCurrency: string;
  defaultUnits: 'metric' | 'imperial';
  createdAt: Date;
}

// Calculator Input Types
export interface LandedCostInput {
  productValue: number;
  currency: string;
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  freightCost: number;
  insuranceCost: number;
  incoterm: string;
  freightTerm: 'cif' | 'fob' | 'exw';
}

export interface LandedCostResult {
  productValue: number;
  freightCost: number;
  insuranceCost: number;
  customsDuty: number;
  vat: number;
  otherCharges: number;
  totalLandedCost: number;
  dutyRate: number;
  vatRate: number;
}

export interface CBMInput {
  length: number;
  width: number;
  height: number;
  quantity: number;
  unit: 'cm' | 'm' | 'in' | 'ft';
}

export interface CBMResult {
  totalCBM: number;
  singleCBM: number;
  containerFits: {
    type: string;
    fits: number;
    remainingSpace: number;
  }[];
}

export interface VolumetricWeightInput {
  length: number;
  width: number;
  height: number;
  actualWeight: number;
  unit: 'cm' | 'in';
  divisor: number;
}

export interface VolumetricWeightResult {
  volumetricWeight: number;
  chargeableWeight: number;
  actualWeight: number;
  recommendedCarrier: string;
}

// Navigation Types
export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  children?: NavItem[];
}

// Form Types
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'textarea' | 'currency';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  min?: number;
  max?: number;
  step?: number;
}
