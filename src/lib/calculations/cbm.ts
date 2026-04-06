// CBM Calculator Logic

import { containerSpecs, palletTypes, calculateCBM as calcCBM, lengthUnits } from "@/lib/constants/units";

export interface CBMInput {
  length: number;
  width: number;
  height: number;
  quantity: number;
  unit: keyof typeof lengthUnits;
  stackable: boolean;
}

export interface CBMResult {
  singleCBM: number;
  totalCBM: number;
  totalWeight?: number;
  containerFits: ContainerFit[];
  palletFits: PalletFit[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
}

export interface ContainerFit {
  type: string;
  name: string;
  capacity: number;
  fits: number;
  usedSpace: number;
  remainingSpace: number;
  efficiency: number;
}

export interface PalletFit {
  type: string;
  name: string;
  perLayer: number;
  layersPossible: number;
  totalUnits: number;
  usedCBM: number;
}

/**
 * Calculate CBM and container loadability
 */
export function calculateCBMResult(input: CBMInput): CBMResult {
  const { length, width, height, quantity, unit, stackable } = input;

  // Calculate CBM
  const singleCBM = calcCBM(length, width, height, unit, 1);
  const totalCBM = calcCBM(length, width, height, unit, quantity);

  // Calculate container fits
  const containerFits: ContainerFit[] = [];
  
  for (const [type, spec] of Object.entries(containerSpecs)) {
    // Calculate how many items fit by volume
    const volumeFit = Math.floor(spec.capacity / singleCBM);
    
    // Calculate practical fits based on dimensions
    const itemLengthM = length * lengthUnits[unit].toBase;
    const itemWidthM = width * lengthUnits[unit].toBase;
    const itemHeightM = height * lengthUnits[unit].toBase;
    
    // Calculate how many can fit along each dimension
    const alongLength = Math.floor(spec.internalLength / itemLengthM);
    const alongWidth = Math.floor(spec.internalWidth / itemWidthM);
    const alongHeight = Math.floor(spec.internalHeight / itemHeightM);
    
    // Total that can fit by dimensions
    const dimensionFit = alongLength * alongWidth * alongHeight;
    
    // Use the smaller of volume fit and dimension fit
    const actualFit = Math.min(volumeFit, dimensionFit);
    
    const usedSpace = actualFit * singleCBM;
    const remainingSpace = spec.capacity - usedSpace;
    const efficiency = (usedSpace / spec.capacity) * 100;

    containerFits.push({
      type,
      name: spec.name,
      capacity: spec.capacity,
      fits: actualFit,
      usedSpace: Math.round(usedSpace * 100) / 100,
      remainingSpace: Math.round(remainingSpace * 100) / 100,
      efficiency: Math.round(efficiency * 10) / 10,
    });
  }

  // Calculate pallet fits
  const palletFits: PalletFit[] = [];
  
  const itemLengthM = length * lengthUnits[unit].toBase;
  const itemWidthM = width * lengthUnits[unit].toBase;
  const itemHeightM = height * lengthUnits[unit].toBase;

  for (const [type, spec] of Object.entries(palletTypes)) {
    // How many items per layer
    const perLength = Math.floor(spec.length / itemLengthM);
    const perWidth = Math.floor(spec.width / itemWidthM);
    const perLayer = perLength * perWidth;
    
    // How many layers (assuming standard pallet height + cargo)
    const usableHeight = 1.8; // Typical max height for palletized cargo
    const layersPossible = Math.floor(usableHeight / itemHeightM);
    
    const totalUnits = perLayer * layersPossible;
    const usedCBM = totalUnits * singleCBM;

    palletFits.push({
      type,
      name: spec.name,
      perLayer,
      layersPossible,
      totalUnits,
      usedCBM: Math.round(usedCBM * 100) / 100,
    });
  }

  return {
    singleCBM: Math.round(singleCBM * 10000) / 10000,
    totalCBM: Math.round(totalCBM * 10000) / 10000,
    containerFits,
    palletFits,
    dimensions: {
      length,
      width,
      height,
      unit,
    },
  };
}

/**
 * Convert dimensions between units
 */
export function convertDimensions(
  value: number,
  from: keyof typeof lengthUnits,
  to: keyof typeof lengthUnits
): number {
  const inMeters = value * lengthUnits[from].toBase;
  return inMeters / lengthUnits[to].toBase;
}

/**
 * Get container fill visualization data
 */
export function getContainerVisualization(
  containerType: keyof typeof containerSpecs,
  itemLength: number,
  itemWidth: number,
  itemHeight: number,
  unit: keyof typeof lengthUnits
): { items: { x: number; y: number; z: number }[]; container: { l: number; w: number; h: number } } {
  const spec = containerSpecs[containerType];
  
  const itemLengthM = itemLength * lengthUnits[unit].toBase;
  const itemWidthM = itemWidth * lengthUnits[unit].toBase;
  const itemHeightM = itemHeight * lengthUnits[unit].toBase;
  
  const items: { x: number; y: number; z: number }[] = [];
  
  const alongLength = Math.floor(spec.internalLength / itemLengthM);
  const alongWidth = Math.floor(spec.internalWidth / itemWidthM);
  const alongHeight = Math.floor(spec.internalHeight / itemHeightM);
  
  // Create positions for visualization (limit to reasonable number)
  const maxItems = Math.min(alongLength * alongWidth * alongHeight, 100);
  
  for (let l = 0; l < alongLength && items.length < maxItems; l++) {
    for (let w = 0; w < alongWidth && items.length < maxItems; w++) {
      for (let h = 0; h < alongHeight && items.length < maxItems; h++) {
        items.push({
          x: l * itemLengthM,
          y: w * itemWidthM,
          z: h * itemHeightM,
        });
      }
    }
  }

  return {
    items,
    container: {
      l: spec.internalLength,
      w: spec.internalWidth,
      h: spec.internalHeight,
    },
  };
}
