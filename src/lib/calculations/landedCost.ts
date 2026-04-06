// Landed Cost Calculator Logic

export interface LandedCostInput {
  productValue: number;
  currency: string;
  hsCode: string;
  originCountry: string;
  destinationCountry: string;
  freightCost: number;
  insuranceCost: number;
  incoterm: string;
  dutyRate: number; // Percentage
  vatRate: number; // Percentage
  otherCharges: number;
}

export interface LandedCostResult {
  productValue: number;
  freightCost: number;
  insuranceCost: number;
  cifValue: number;
  customsDuty: number;
  vatAmount: number;
  otherCharges: number;
  totalLandedCost: number;
  dutyRate: number;
  vatRate: number;
  costBreakdown: {
    label: string;
    value: number;
    percentage: number;
  }[];
}

/**
 * Calculate landed cost for imported goods
 * 
 * Formula:
 * 1. CIF Value = Product Value + Freight + Insurance
 * 2. Customs Duty = CIF Value × Duty Rate
 * 3. VAT = (CIF Value + Customs Duty) × VAT Rate
 * 4. Total Landed Cost = CIF + Customs Duty + VAT + Other Charges
 */
export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  const {
    productValue,
    freightCost,
    insuranceCost,
    dutyRate,
    vatRate,
    otherCharges,
  } = input;

  // Calculate CIF (Cost, Insurance, Freight) value
  const cifValue = productValue + freightCost + insuranceCost;

  // Calculate customs duty
  const customsDuty = cifValue * (dutyRate / 100);

  // Calculate VAT (applied on CIF + Duty in most countries)
  const vatAmount = (cifValue + customsDuty) * (vatRate / 100);

  // Calculate total landed cost
  const totalLandedCost = cifValue + customsDuty + vatAmount + otherCharges;

  // Generate cost breakdown
  const costBreakdown = [
    {
      label: "Product Value",
      value: productValue,
      percentage: (productValue / totalLandedCost) * 100,
    },
    {
      label: "Freight",
      value: freightCost,
      percentage: (freightCost / totalLandedCost) * 100,
    },
    {
      label: "Insurance",
      value: insuranceCost,
      percentage: (insuranceCost / totalLandedCost) * 100,
    },
    {
      label: "Customs Duty",
      value: customsDuty,
      percentage: (customsDuty / totalLandedCost) * 100,
    },
    {
      label: "VAT/GST",
      value: vatAmount,
      percentage: (vatAmount / totalLandedCost) * 100,
    },
  ];

  if (otherCharges > 0) {
    costBreakdown.push({
      label: "Other Charges",
      value: otherCharges,
      percentage: (otherCharges / totalLandedCost) * 100,
    });
  }

  return {
    productValue,
    freightCost,
    insuranceCost,
    cifValue,
    customsDuty,
    vatAmount,
    otherCharges,
    totalLandedCost,
    dutyRate,
    vatRate,
    costBreakdown,
  };
}

/**
 * Get duty rate estimate based on HS Code
 * This is a simplified version - real implementation would query a tariff database
 */
export function getEstimatedDutyRate(hsCode: string, originCountry: string, destinationCountry: string): number {
  // Simplified duty rate estimation based on HS code prefix
  // Real implementation would use WCO tariff database
  
  const prefix = hsCode.substring(0, 2);
  
  const dutyRates: Record<string, number> = {
    "01": 5,   // Live animals
    "02": 10,  // Meat
    "03": 8,   // Fish
    "04": 12,  // Dairy
    "07": 6,   // Vegetables
    "08": 8,   // Fruit
    "09": 5,   // Coffee, tea
    "10": 3,   // Cereals
    "27": 5,   // Mineral fuels
    "28": 3,   // Inorganic chemicals
    "29": 4,   // Organic chemicals
    "30": 0,   // Pharmaceuticals
    "39": 6,   // Plastics
    "40": 7,   // Rubber
    "44": 5,   // Wood
    "48": 6,   // Paper
    "49": 0,   // Books
    "52": 8,   // Cotton
    "61": 12,  // Knitted clothing
    "62": 12,  // Woven clothing
    "64": 12,  // Footwear
    "71": 5,   // Precious stones
    "72": 4,   // Iron and steel
    "73": 5,   // Articles of iron/steel
    "84": 3,   // Machinery
    "85": 3,   // Electrical equipment
    "87": 8,   // Vehicles
    "90": 4,   // Instruments
    "94": 8,   // Furniture
  };

  return dutyRates[prefix] ?? 5; // Default 5%
}

/**
 * Get VAT rate by country
 */
export function getVatRateByCountry(country: string): number {
  const vatRates: Record<string, number> = {
    "US": 0,    // No federal VAT
    "GB": 20,   // UK VAT
    "DE": 19,   // Germany
    "FR": 20,   // France
    "IT": 22,   // Italy
    "ES": 21,   // Spain
    "NL": 21,   // Netherlands
    "BE": 21,   // Belgium
    "PL": 23,   // Poland
    "IN": 18,   // India GST
    "CN": 13,   // China VAT
    "JP": 10,   // Japan
    "KR": 10,   // South Korea
    "AU": 10,   // Australia GST
    "NZ": 15,   // New Zealand GST
    "SG": 8,    // Singapore GST
    "MY": 10,   // Malaysia SST
    "TH": 7,    // Thailand VAT
    "VN": 10,   // Vietnam VAT
    "ID": 11,   // Indonesia VAT
    "PH": 12,   // Philippines VAT
    "AE": 5,    // UAE VAT
    "SA": 15,   // Saudi Arabia
    "EG": 14,   // Egypt
    "ZA": 15,   // South Africa
    "NG": 7.5,  // Nigeria VAT
    "BR": 18,   // Brazil
    "MX": 16,   // Mexico
    "CA": 5,    // Canada GST (varies by province)
  };

  return vatRates[country.toUpperCase()] ?? 20; // Default 20%
}
