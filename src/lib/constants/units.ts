// Unit Conversion Constants

// Length Units
export const lengthUnits = {
  m: { name: "Meters", symbol: "m", toBase: 1 },
  cm: { name: "Centimeters", symbol: "cm", toBase: 0.01 },
  mm: { name: "Millimeters", symbol: "mm", toBase: 0.001 },
  ft: { name: "Feet", symbol: "ft", toBase: 0.3048 },
  in: { name: "Inches", symbol: "in", toBase: 0.0254 },
  yd: { name: "Yards", symbol: "yd", toBase: 0.9144 },
} as const;

// Weight Units
export const weightUnits = {
  kg: { name: "Kilograms", symbol: "kg", toBase: 1 },
  g: { name: "Grams", symbol: "g", toBase: 0.001 },
  t: { name: "Metric Tons", symbol: "t", toBase: 1000 },
  lb: { name: "Pounds", symbol: "lb", toBase: 0.453592 },
  oz: { name: "Ounces", symbol: "oz", toBase: 0.0283495 },
  st: { name: "Short Tons (US)", symbol: "st", toBase: 907.185 },
  lt: { name: "Long Tons (UK)", symbol: "lt", toBase: 1016.05 },
} as const;

// Volume Units
export const volumeUnits = {
  cbm: { name: "Cubic Meters", symbol: "m³", toBase: 1 },
  cft: { name: "Cubic Feet", symbol: "ft³", toBase: 0.0283168 },
  l: { name: "Liters", symbol: "L", toBase: 0.001 },
  gal_us: { name: "US Gallons", symbol: "gal (US)", toBase: 0.00378541 },
  gal_uk: { name: "UK Gallons", symbol: "gal (UK)", toBase: 0.00454609 },
} as const;

// Container Specifications (ISO)
export const containerSpecs = {
  "20std": {
    name: "20' Standard",
    type: "Dry Van",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.393,
    doorWidth: 2.343,
    doorHeight: 2.280,
    capacity: 33.2, // CBM
    maxPayload: 28180, // kg
    tareWeight: 2220, // kg
    teu: 1,
  },
  "40std": {
    name: "40' Standard",
    type: "Dry Van",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.393,
    doorWidth: 2.343,
    doorHeight: 2.280,
    capacity: 67.7, // CBM
    maxPayload: 28750, // kg
    tareWeight: 3740, // kg
    teu: 2,
  },
  "40hc": {
    name: "40' High Cube",
    type: "High Cube",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.698,
    doorWidth: 2.343,
    doorHeight: 2.585,
    capacity: 76.3, // CBM
    maxPayload: 28600, // kg
    tareWeight: 3900, // kg
    teu: 2,
  },
  "45hc": {
    name: "45' High Cube",
    type: "High Cube",
    internalLength: 13.556,
    internalWidth: 2.352,
    internalHeight: 2.698,
    doorWidth: 2.343,
    doorHeight: 2.585,
    capacity: 86.1, // CBM
    maxPayload: 27600, // kg
    tareWeight: 4800, // kg
    teu: 2.25,
  },
  "20rf": {
    name: "20' Refrigerated",
    type: "Reefer",
    internalLength: 5.424,
    internalWidth: 2.286,
    internalHeight: 2.245,
    doorWidth: 2.286,
    doorHeight: 2.185,
    capacity: 27.9, // CBM
    maxPayload: 27550, // kg
    tareWeight: 2940, // kg
    teu: 1,
  },
  "40rf": {
    name: "40' Refrigerated",
    type: "Reefer",
    internalLength: 11.576,
    internalWidth: 2.286,
    internalHeight: 2.234,
    doorWidth: 2.286,
    doorHeight: 2.174,
    capacity: 59.1, // CBM
    maxPayload: 27350, // kg
    tareWeight: 4640, // kg
    teu: 2,
  },
  "20ot": {
    name: "20' Open Top",
    type: "Open Top",
    internalLength: 5.898,
    internalWidth: 2.352,
    internalHeight: 2.344,
    doorWidth: 2.343,
    doorHeight: 2.280,
    capacity: 32.5, // CBM
    maxPayload: 28160, // kg
    tareWeight: 2240, // kg
    teu: 1,
  },
  "40ot": {
    name: "40' Open Top",
    type: "Open Top",
    internalLength: 12.032,
    internalWidth: 2.352,
    internalHeight: 2.347,
    doorWidth: 2.343,
    doorHeight: 2.280,
    capacity: 66.4, // CBM
    maxPayload: 28430, // kg
    tareWeight: 3850, // kg
    teu: 2,
  },
  "20fr": {
    name: "20' Flat Rack",
    type: "Flat Rack",
    internalLength: 5.638,
    internalWidth: 2.228,
    internalHeight: 2.233,
    capacity: 28.0, // CBM (approximate)
    maxPayload: 31190, // kg
    tareWeight: 2950, // kg
    teu: 1,
  },
  "40fr": {
    name: "40' Flat Rack",
    type: "Flat Rack",
    internalLength: 11.748,
    internalWidth: 2.228,
    internalHeight: 1.988,
    capacity: 52.0, // CBM (approximate)
    maxPayload: 39790, // kg
    tareWeight: 5520, // kg
    teu: 2,
  },
  "20tk": {
    name: "20' Tank",
    type: "Tank",
    capacity: 24.0, // CBM (typical)
    maxPayload: 21700, // kg (typical)
    tareWeight: 3500, // kg (typical)
    teu: 1,
  },
} as const;

// Pallet Dimensions
export const palletTypes = {
  euro: { name: "Euro Pallet", length: 1.2, width: 0.8, height: 0.144 },
  standard: { name: "Standard Pallet", length: 1.2, width: 1.0, height: 0.144 },
  us: { name: "US Pallet (48x40)", length: 1.219, width: 1.016, height: 0.144 },
  asia: { name: "Asian Pallet", length: 1.1, width: 1.1, height: 0.144 },
} as const;

// Incoterms 2020
export interface Incoterm {
  code: string;
  name: string;
  category: "E" | "F" | "C" | "D";
  description: string;
  modes: ("sea" | "air" | "any")[];
  riskTransfer: string;
  sellerResponsibilities: string[];
  buyerResponsibilities: string[];
  costSplit: { seller: number; buyer: number };
  tips: string[];
}

export const incoterms: Incoterm[] = [
  {
    code: "EXW",
    name: "Ex Works",
    category: "E",
    description: "Seller makes goods available at their premises. Buyer bears all costs and risks from that point.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are placed at seller's premises. Buyer is responsible for loading.",
    sellerResponsibilities: [
      "Make goods available at seller's premises",
      "Provide commercial invoice",
      "Package goods suitably for transport",
      "Notify buyer when goods are ready",
    ],
    buyerResponsibilities: [
      "Load goods onto collecting vehicle",
      "Arrange all export clearances",
      "Arrange and pay for all transport",
      "Bear all risks from seller's premises",
      "Import clearance and duties",
    ],
    costSplit: { seller: 5, buyer: 95 },
    tips: [
      "Not recommended for international trade beginners",
      "Buyer should have export clearance capabilities in seller's country",
      "Often results in hidden costs for inexperienced buyers",
    ],
  },
  {
    code: "FCA",
    name: "Free Carrier",
    category: "F",
    description: "Seller delivers goods to carrier nominated by buyer at named place. Risk transfers at that point.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are delivered to the carrier at the named place.",
    sellerResponsibilities: [
      "Deliver goods to carrier at named place",
      "Clear goods for export",
      "Provide commercial invoice",
      "Notify buyer of delivery to carrier",
      "Provide proof of delivery",
    ],
    buyerResponsibilities: [
      "Nominate carrier and notify seller",
      "Arrange and pay for main carriage",
      "Bear risks from delivery to carrier",
      "Import clearance and duties",
      "Insurance (optional but recommended)",
    ],
    costSplit: { seller: 25, buyer: 75 },
    tips: [
      "Most versatile Incoterm for containerized cargo",
      "Suitable for any mode of transport",
      "Clearly specify the exact delivery place",
      "Can be used for delivery at seller's premises or other location",
    ],
  },
  {
    code: "FAS",
    name: "Free Alongside Ship",
    category: "F",
    description: "Seller delivers goods alongside the vessel at the named port of shipment.",
    modes: ["sea"],
    riskTransfer: "Risk transfers when goods are placed alongside the vessel at the named port of shipment.",
    sellerResponsibilities: [
      "Deliver goods alongside vessel",
      "Clear goods for export",
      "Provide commercial invoice",
      "Notify buyer of delivery alongside",
      "Bear all costs until alongside vessel",
    ],
    buyerResponsibilities: [
      "Nominate vessel and notify seller",
      "Load goods onto vessel",
      "Arrange and pay for main carriage",
      "Bear risks from alongside vessel",
      "Import clearance and duties",
    ],
    costSplit: { seller: 30, buyer: 70 },
    tips: [
      "Only for sea and inland waterway transport",
      "Commonly used for bulk cargo",
      "Not suitable for containerized goods",
      "Buyer responsible for loading costs",
    ],
  },
  {
    code: "FOB",
    name: "Free On Board",
    category: "F",
    description: "Seller delivers goods on board the vessel at the named port of shipment.",
    modes: ["sea"],
    riskTransfer: "Risk transfers when goods are on board the vessel at the named port of shipment.",
    sellerResponsibilities: [
      "Deliver goods on board vessel",
      "Clear goods for export",
      "Provide commercial invoice",
      "Load goods onto vessel",
      "Notify buyer of loading",
    ],
    buyerResponsibilities: [
      "Nominate vessel and notify seller",
      "Arrange and pay for main carriage",
      "Bear risks from on board vessel",
      "Import clearance and duties",
      "Insurance (optional but recommended)",
    ],
    costSplit: { seller: 35, buyer: 65 },
    tips: [
      "Classic Incoterm for sea freight",
      "Not suitable for containerized goods (use FCA instead)",
      "Clear definition of 'on board' is important",
      "Popular for bulk shipments",
    ],
  },
  {
    code: "CPT",
    name: "Carriage Paid To",
    category: "C",
    description: "Seller delivers goods to carrier and pays for carriage to named destination.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are handed over to the first carrier.",
    sellerResponsibilities: [
      "Deliver goods to first carrier",
      "Clear goods for export",
      "Pay for carriage to destination",
      "Provide commercial invoice",
      "Notify buyer of shipment",
    ],
    buyerResponsibilities: [
      "Bear risks from first carrier",
      "Import clearance and duties",
      "Insurance (recommended)",
      "Unload at destination",
      "Pay for any delay costs",
    ],
    costSplit: { seller: 50, buyer: 50 },
    tips: [
      "Risk transfers before destination",
      "Suitable for multimodal transport",
      "Buyer should consider insurance",
      "Seller's obligation ends at first carrier",
    ],
  },
  {
    code: "CIP",
    name: "Carriage and Insurance Paid To",
    category: "C",
    description: "Same as CPT, but seller also contracts for insurance coverage during carriage.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are handed over to the first carrier.",
    sellerResponsibilities: [
      "Deliver goods to first carrier",
      "Clear goods for export",
      "Pay for carriage to destination",
      "Obtain insurance coverage (ICC A or C)",
      "Provide commercial invoice and insurance policy",
    ],
    buyerResponsibilities: [
      "Bear risks from first carrier",
      "Import clearance and duties",
      "Unload at destination",
      "Pay for any delay costs",
      "File insurance claims if needed",
    ],
    costSplit: { seller: 55, buyer: 45 },
    tips: [
      "Insurance requirement: ICC (A) for multimodal, ICC (C) for sea",
      "Minimum coverage is 110% of contract price",
      "Risk transfers early but seller pays transport",
      "Good option for buyers wanting insurance included",
    ],
  },
  {
    code: "CFR",
    name: "Cost and Freight",
    category: "C",
    description: "Seller delivers goods on board vessel and pays for freight to named port of destination.",
    modes: ["sea"],
    riskTransfer: "Risk transfers when goods are on board the vessel at port of shipment.",
    sellerResponsibilities: [
      "Deliver goods on board vessel",
      "Clear goods for export",
      "Pay for freight to destination port",
      "Provide commercial invoice",
      "Notify buyer of shipment",
    ],
    buyerResponsibilities: [
      "Bear risks from on board vessel",
      "Import clearance and duties",
      "Insurance (recommended)",
      "Unload at destination port",
      "Pay for discharge costs if not included",
    ],
    costSplit: { seller: 55, buyer: 45 },
    tips: [
      "Only for sea and inland waterway transport",
      "Not suitable for containers (use CPT instead)",
      "Risk transfers at loading port",
      "Popular for bulk cargo shipments",
    ],
  },
  {
    code: "CIF",
    name: "Cost, Insurance and Freight",
    category: "C",
    description: "Same as CFR, but seller also contracts for insurance coverage during sea carriage.",
    modes: ["sea"],
    riskTransfer: "Risk transfers when goods are on board the vessel at port of shipment.",
    sellerResponsibilities: [
      "Deliver goods on board vessel",
      "Clear goods for export",
      "Pay for freight to destination port",
      "Obtain insurance (ICC C minimum)",
      "Provide commercial invoice and insurance policy",
    ],
    buyerResponsibilities: [
      "Bear risks from on board vessel",
      "Import clearance and duties",
      "Unload at destination port",
      "Pay for discharge costs if not included",
      "File insurance claims if needed",
    ],
    costSplit: { seller: 60, buyer: 40 },
    tips: [
      "Traditional Incoterm for sea freight with insurance",
      "Insurance minimum: ICC (C) at 110% of CIF value",
      "Not suitable for containers (use CIP instead)",
      "Popular for commodities and bulk cargo",
    ],
  },
  {
    code: "DAP",
    name: "Delivered at Place",
    category: "D",
    description: "Seller delivers goods at named destination, ready for unloading.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are available for unloading at the named destination.",
    sellerResponsibilities: [
      "Deliver goods to named destination",
      "Clear goods for export",
      "Pay for all transport to destination",
      "Bear all risks until destination",
      "Notify buyer of arrival",
    ],
    buyerResponsibilities: [
      "Unload goods at destination",
      "Import clearance and duties",
      "Bear risks from unloading",
      "Insurance (if desired)",
    ],
    costSplit: { seller: 80, buyer: 20 },
    tips: [
      "Very convenient for buyers",
      "Seller bears most risks and costs",
      "Specify exact destination address",
      "Buyer handles import clearance",
    ],
  },
  {
    code: "DPU",
    name: "Delivered at Place Unloaded",
    category: "D",
    description: "Seller delivers goods at named destination, after unloading.",
    modes: ["any"],
    riskTransfer: "Risk transfers after goods have been unloaded at the named destination.",
    sellerResponsibilities: [
      "Deliver goods to named destination",
      "Unload goods at destination",
      "Clear goods for export",
      "Pay for all transport and unloading",
      "Bear all risks until after unloading",
    ],
    buyerResponsibilities: [
      "Import clearance and duties",
      "Bear risks after unloading",
      "Insurance (if desired)",
    ],
    costSplit: { seller: 85, buyer: 15 },
    tips: [
      "Only Incoterm requiring seller to unload",
      "Maximum seller obligation",
      "Specify exact unloading point",
      "Consider terminal handling arrangements",
    ],
  },
  {
    code: "DDP",
    name: "Delivered Duty Paid",
    category: "D",
    description: "Seller delivers goods at named destination, cleared for import and ready for unloading.",
    modes: ["any"],
    riskTransfer: "Risk transfers when goods are delivered at the named destination, cleared for import.",
    sellerResponsibilities: [
      "Deliver goods to named destination",
      "Clear goods for export AND import",
      "Pay all duties and taxes",
      "Pay for all transport to destination",
      "Bear all risks until delivery",
    ],
    buyerResponsibilities: [
      "Receive goods at destination",
      "Bear risks from delivery",
      "Assist with import clearance if needed",
    ],
    costSplit: { seller: 95, buyer: 5 },
    tips: [
      "Maximum seller obligation",
      "Seller must be able to handle import clearance in buyer's country",
      "Most convenient for buyers",
      "Consider tax and regulatory implications",
    ],
  },
];

// Volumetric Weight Divisors by Carrier
export const volumetricDivisors = {
  iata: { name: "IATA Standard", divisor: 6000 },
  dhl: { name: "DHL Express", divisor: 5000 },
  fedex: { name: "FedEx International", divisor: 6000 },
  ups: { name: "UPS International", divisor: 6000 },
  tnt: { name: "TNT Express", divisor: 6000 },
  ems: { name: "EMS/Postal", divisor: 6000 },
} as const;

// Conversion Functions
export function convertLength(value: number, from: keyof typeof lengthUnits, to: keyof typeof lengthUnits): number {
  const inMeters = value * lengthUnits[from].toBase;
  return inMeters / lengthUnits[to].toBase;
}

export function convertWeight(value: number, from: keyof typeof weightUnits, to: keyof typeof weightUnits): number {
  const inKg = value * weightUnits[from].toBase;
  return inKg / weightUnits[to].toBase;
}

export function convertVolume(value: number, from: keyof typeof volumeUnits, to: keyof typeof volumeUnits): number {
  const inCbm = value * volumeUnits[from].toBase;
  return inCbm / volumeUnits[to].toBase;
}

// Calculate CBM from dimensions
export function calculateCBM(
  length: number,
  width: number,
  height: number,
  unit: keyof typeof lengthUnits = "m",
  quantity: number = 1
): number {
  const lengthM = length * lengthUnits[unit].toBase;
  const widthM = width * lengthUnits[unit].toBase;
  const heightM = height * lengthUnits[unit].toBase;
  return lengthM * widthM * heightM * quantity;
}

// Calculate volumetric weight
export function calculateVolumetricWeight(
  length: number,
  width: number,
  height: number,
  unit: keyof typeof lengthUnits = "cm",
  divisor: number = 6000
): number {
  const lengthCm = unit === "m" ? length * 100 : unit === "in" ? length * 2.54 : length;
  const widthCm = unit === "m" ? width * 100 : unit === "in" ? width * 2.54 : width;
  const heightCm = unit === "m" ? height * 100 : unit === "in" ? height * 2.54 : height;
  return (lengthCm * widthCm * heightCm) / divisor;
}

// Calculate chargeable weight
export function calculateChargeableWeight(
  actualWeight: number,
  volumetricWeight: number
): number {
  return Math.max(actualWeight, volumetricWeight);
}

// Calculate container fill percentage
export function calculateContainerFill(
  cargoCBM: number,
  containerType: keyof typeof containerSpecs
): number {
  const container = containerSpecs[containerType];
  return Math.min((cargoCBM / container.capacity) * 100, 100);
}
