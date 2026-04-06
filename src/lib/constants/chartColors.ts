// Chart Colors for Recharts
// Recharts does not support CSS variables, so we use hex colors directly

export const CHART_COLORS = {
  // Primary brand colors
  ocean: "#0F4C81",           // Ocean Blue (primary)
  oceanLight: "#4A90D9",      // Lighter blue variant
  oceanDark: "#0A3A63",       // Darker blue variant
  
  logistics: "#2E8B57",       // Logistics Green (secondary)
  logisticsLight: "#4CAF7E",  // Lighter green variant
  logisticsDark: "#1E6B3F",   // Darker green variant
  
  // Accent colors
  amber: "#F59E0B",           // Warning/Highlight
  amberLight: "#FCD34D",
  
  purple: "#8B5CF6",          // Special features
  purpleLight: "#A78BFA",
  
  red: "#EF4444",             // Danger/Error
  redLight: "#F87171",
  
  cyan: "#06B6D4",            // Info
  cyanLight: "#22D3EE",
  
  rose: "#F43F5E",            // Alert
  roseLight: "#FB7185",
  
  teal: "#14B8A6",            // Success
  tealLight: "#2DD4BF",
  
  // Neutral colors
  muted: "#94A3B8",           // Muted text
  mutedLight: "#CBD5E1",
  
  border: "#E2E8F0",          // Borders
  background: "#F8FAFC",      // Background
};

// Chart color palettes for different use cases
export const CHART_PALETTES = {
  // Primary palette for general use
  primary: [
    CHART_COLORS.ocean,
    CHART_COLORS.logistics,
    CHART_COLORS.amber,
    CHART_COLORS.purple,
    CHART_COLORS.cyan,
    CHART_COLORS.rose,
  ],
  
  // Sequential blue palette
  blueSequential: [
    CHART_COLORS.oceanDark,
    CHART_COLORS.ocean,
    CHART_COLORS.oceanLight,
  ],
  
  // Sequential green palette
  greenSequential: [
    CHART_COLORS.logisticsDark,
    CHART_COLORS.logistics,
    CHART_COLORS.logisticsLight,
  ],
  
  // Diverging palette (red to green)
  diverging: [
    CHART_COLORS.red,
    CHART_COLORS.amber,
    CHART_COLORS.logistics,
  ],
  
  // Categorical palette for multiple data series
  categorical: [
    CHART_COLORS.ocean,
    CHART_COLORS.logistics,
    CHART_COLORS.amber,
    CHART_COLORS.purple,
    CHART_COLORS.cyan,
    CHART_COLORS.rose,
    CHART_COLORS.teal,
    CHART_COLORS.redLight,
  ],
};

// Helper function to get color with opacity
export function getColorWithOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Export commonly used arrays for direct use in Recharts
export const COLORS = CHART_PALETTES.primary;
export const CATEGORICAL_COLORS = CHART_PALETTES.categorical;
