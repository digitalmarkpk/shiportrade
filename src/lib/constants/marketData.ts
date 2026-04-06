// Comprehensive Market Data Constants for Trading Platform
// A-Z coverage of commodities, stocks, currencies, crypto, bonds, and freight indices

export interface MarketItemBase {
  name: string;
  symbol: string;
  category: string;
  basePrice: number;
  unit?: string;
  exchange?: string;
  country?: string;
  sector?: string;
  description?: string;
  marketCap?: number;
  volume?: number;
  dayHigh?: number;
  dayLow?: number;
  week52High?: number;
  week52Low?: number;
  previousClose?: number;
  open?: number;
  bid?: number;
  ask?: number;
}

// ==================== COMMODITIES (A-Z) ====================
export const COMMODITIES_DATA: MarketItemBase[] = [
  // Energy
  { name: 'Crude Oil WTI', symbol: 'CL', category: 'commodities', basePrice: 78.45, unit: 'USD/bbl', exchange: 'NYMEX', sector: 'Energy', description: 'West Texas Intermediate crude oil futures' },
  { name: 'Brent Crude', symbol: 'BRN', category: 'commodities', basePrice: 82.67, unit: 'USD/bbl', exchange: 'ICE', sector: 'Energy', description: 'Brent crude oil futures' },
  { name: 'Natural Gas', symbol: 'NG', category: 'commodities', basePrice: 2.89, unit: 'USD/MMBtu', exchange: 'NYMEX', sector: 'Energy', description: 'Natural gas futures' },
  { name: 'Gasoline RBOB', symbol: 'RB', category: 'commodities', basePrice: 2.45, unit: 'USD/gal', exchange: 'NYMEX', sector: 'Energy', description: 'Reformulated gasoline blendstock' },
  { name: 'Heating Oil', symbol: 'HO', category: 'commodities', basePrice: 2.52, unit: 'USD/gal', exchange: 'NYMEX', sector: 'Energy', description: 'Heating oil futures' },
  { name: 'Coal', symbol: 'COAL', category: 'commodities', basePrice: 125.50, unit: 'USD/MT', exchange: 'ICE', sector: 'Energy', description: 'Thermal coal prices' },
  { name: 'Uranium', symbol: 'UX', category: 'commodities', basePrice: 85.20, unit: 'USD/lb', exchange: 'OTC', sector: 'Energy', description: 'Uranium oxide (U3O8)' },
  
  // Precious Metals
  { name: 'Gold', symbol: 'GC', category: 'commodities', basePrice: 2342.50, unit: 'USD/oz', exchange: 'COMEX', sector: 'Precious Metals', description: 'Gold futures' },
  { name: 'Silver', symbol: 'SI', category: 'commodities', basePrice: 27.85, unit: 'USD/oz', exchange: 'COMEX', sector: 'Precious Metals', description: 'Silver futures' },
  { name: 'Platinum', symbol: 'PL', category: 'commodities', basePrice: 998.50, unit: 'USD/oz', exchange: 'NYMEX', sector: 'Precious Metals', description: 'Platinum futures' },
  { name: 'Palladium', symbol: 'PA', category: 'commodities', basePrice: 1025.30, unit: 'USD/oz', exchange: 'NYMEX', sector: 'Precious Metals', description: 'Palladium futures' },
  { name: 'Rhodium', symbol: 'RH', category: 'commodities', basePrice: 4750.00, unit: 'USD/oz', exchange: 'OTC', sector: 'Precious Metals', description: 'Rhodium spot price' },
  
  // Base Metals
  { name: 'Copper', symbol: 'HG', category: 'commodities', basePrice: 4.52, unit: 'USD/lb', exchange: 'COMEX', sector: 'Base Metals', description: 'Copper futures' },
  { name: 'Aluminum', symbol: 'ALI', category: 'commodities', basePrice: 2580, unit: 'USD/MT', exchange: 'LME', sector: 'Base Metals', description: 'Aluminum futures' },
  { name: 'Zinc', symbol: 'ZINC', category: 'commodities', basePrice: 2890, unit: 'USD/MT', exchange: 'LME', sector: 'Base Metals', description: 'Zinc futures' },
  { name: 'Nickel', symbol: 'NI', category: 'commodities', basePrice: 17850, unit: 'USD/MT', exchange: 'LME', sector: 'Base Metals', description: 'Nickel futures' },
  { name: 'Tin', symbol: 'SN', category: 'commodities', basePrice: 32450, unit: 'USD/MT', exchange: 'LME', sector: 'Base Metals', description: 'Tin futures' },
  { name: 'Lead', symbol: 'PB', category: 'commodities', basePrice: 2080, unit: 'USD/MT', exchange: 'LME', sector: 'Base Metals', description: 'Lead futures' },
  { name: 'Iron Ore', symbol: 'IRON', category: 'commodities', basePrice: 118.50, unit: 'USD/MT', exchange: 'SGX', sector: 'Base Metals', description: 'Iron ore 62% Fe' },
  { name: 'Steel', symbol: 'STEEL', category: 'commodities', basePrice: 425.00, unit: 'USD/MT', exchange: 'SHFE', sector: 'Base Metals', description: 'Steel rebar' },
  { name: 'Cobalt', symbol: 'COB', category: 'commodities', basePrice: 27.50, unit: 'USD/lb', exchange: 'LME', sector: 'Base Metals', description: 'Cobalt metal' },
  { name: 'Lithium', symbol: 'LITH', category: 'commodities', basePrice: 14500, unit: 'USD/MT', exchange: 'OTC', sector: 'Base Metals', description: 'Lithium carbonate' },
  
  // Agricultural - Grains
  { name: 'Corn', symbol: 'ZC', category: 'commodities', basePrice: 4.52, unit: 'USD/bu', exchange: 'CBOT', sector: 'Agriculture', description: 'Corn futures' },
  { name: 'Soybeans', symbol: 'ZS', category: 'commodities', basePrice: 11.85, unit: 'USD/bu', exchange: 'CBOT', sector: 'Agriculture', description: 'Soybean futures' },
  { name: 'Wheat', symbol: 'ZW', category: 'commodities', basePrice: 6.12, unit: 'USD/bu', exchange: 'CBOT', sector: 'Agriculture', description: 'Wheat futures' },
  { name: 'Rice', symbol: 'ZR', category: 'commodities', basePrice: 17.25, unit: 'USD/cwt', exchange: 'CBOT', sector: 'Agriculture', description: 'Rough rice futures' },
  { name: 'Oats', symbol: 'ZO', category: 'commodities', basePrice: 4.15, unit: 'USD/bu', exchange: 'CBOT', sector: 'Agriculture', description: 'Oats futures' },
  { name: 'Barley', symbol: 'BARL', category: 'commodities', basePrice: 185.00, unit: 'USD/MT', exchange: 'ASX', sector: 'Agriculture', description: 'Barley futures' },
  { name: 'Canola', symbol: 'RS', category: 'commodities', basePrice: 485.50, unit: 'USD/MT', exchange: 'ICE', sector: 'Agriculture', description: 'Canola futures' },
  
  // Agricultural - Softs
  { name: 'Coffee', symbol: 'KC', category: 'commodities', basePrice: 185.20, unit: 'USC/lb', exchange: 'ICE', sector: 'Agriculture', description: 'Coffee C futures' },
  { name: 'Sugar', symbol: 'SB', category: 'commodities', basePrice: 24.85, unit: 'USC/lb', exchange: 'ICE', sector: 'Agriculture', description: 'Sugar #11 futures' },
  { name: 'Cotton', symbol: 'CT', category: 'commodities', basePrice: 82.45, unit: 'USC/lb', exchange: 'ICE', sector: 'Agriculture', description: 'Cotton #2 futures' },
  { name: 'Cocoa', symbol: 'CC', category: 'commodities', basePrice: 4250.00, unit: 'USD/MT', exchange: 'ICE', sector: 'Agriculture', description: 'Cocoa futures' },
  { name: 'Orange Juice', symbol: 'OJ', category: 'commodities', basePrice: 285.50, unit: 'USC/lb', exchange: 'ICE', sector: 'Agriculture', description: 'Frozen orange juice' },
  { name: 'Lumber', symbol: 'LBS', category: 'commodities', basePrice: 548.30, unit: 'USD/MBF', exchange: 'CME', sector: 'Agriculture', description: 'Random length lumber' },
  { name: 'Rubber', symbol: 'RUB', category: 'commodities', basePrice: 1.82, unit: 'JPY/kg', exchange: 'TOCOM', sector: 'Agriculture', description: 'Rubber futures' },
  
  // Livestock
  { name: 'Live Cattle', symbol: 'LE', category: 'commodities', basePrice: 178.50, unit: 'USC/lb', exchange: 'CME', sector: 'Livestock', description: 'Live cattle futures' },
  { name: 'Feeder Cattle', symbol: 'GF', category: 'commodities', basePrice: 245.80, unit: 'USC/lb', exchange: 'CME', sector: 'Livestock', description: 'Feeder cattle futures' },
  { name: 'Lean Hogs', symbol: 'HE', category: 'commodities', basePrice: 78.25, unit: 'USC/lb', exchange: 'CME', sector: 'Livestock', description: 'Lean hog futures' },
  { name: 'Pork Bellies', symbol: 'PB', category: 'commodities', basePrice: 145.50, unit: 'USC/lb', exchange: 'CME', sector: 'Livestock', description: 'Frozen pork bellies' },
  
  // Dairy
  { name: 'Milk', symbol: 'DC', category: 'commodities', basePrice: 18.25, unit: 'USC/lb', exchange: 'CME', sector: 'Dairy', description: 'Class III milk futures' },
  { name: 'Butter', symbol: 'BUT', category: 'commodities', basePrice: 2.45, unit: 'USD/lb', exchange: 'CME', sector: 'Dairy', description: 'Butter futures' },
  { name: 'Cheese', symbol: 'CHS', category: 'commodities', basePrice: 1.85, unit: 'USD/lb', exchange: 'CME', sector: 'Dairy', description: 'Cheese futures' },
];

// ==================== STOCKS (A-Z) ====================
export const STOCKS_DATA: MarketItemBase[] = [
  // Technology
  { name: 'Apple Inc.', symbol: 'AAPL', category: 'shares', basePrice: 189.45, exchange: 'NASDAQ', sector: 'Technology', marketCap: 2950000000000, description: 'Consumer electronics, software, and services' },
  { name: 'Microsoft Corp.', symbol: 'MSFT', category: 'shares', basePrice: 425.60, exchange: 'NASDAQ', sector: 'Technology', marketCap: 3150000000000, description: 'Software, cloud computing, and hardware' },
  { name: 'Amazon.com Inc.', symbol: 'AMZN', category: 'shares', basePrice: 182.35, exchange: 'NASDAQ', sector: 'Consumer Cyclical', marketCap: 1890000000000, description: 'E-commerce and cloud services' },
  { name: 'Alphabet Inc. Class A', symbol: 'GOOGL', category: 'shares', basePrice: 172.80, exchange: 'NASDAQ', sector: 'Technology', marketCap: 2140000000000, description: 'Internet services and AI' },
  { name: 'Alphabet Inc. Class C', symbol: 'GOOG', category: 'shares', basePrice: 175.25, exchange: 'NASDAQ', sector: 'Technology', marketCap: 2140000000000, description: 'Internet services and AI' },
  { name: 'Tesla Inc.', symbol: 'TSLA', category: 'shares', basePrice: 248.50, exchange: 'NASDAQ', sector: 'Consumer Cyclical', marketCap: 790000000000, description: 'Electric vehicles and clean energy' },
  { name: 'Meta Platforms Inc.', symbol: 'META', category: 'shares', basePrice: 498.25, exchange: 'NASDAQ', sector: 'Technology', marketCap: 1270000000000, description: 'Social media and virtual reality' },
  { name: 'NVIDIA Corp.', symbol: 'NVDA', category: 'shares', basePrice: 1225.80, exchange: 'NASDAQ', sector: 'Technology', marketCap: 3020000000000, description: 'Graphics processors and AI chips' },
  { name: 'Adobe Inc.', symbol: 'ADBE', category: 'shares', basePrice: 575.40, exchange: 'NASDAQ', sector: 'Technology', marketCap: 255000000000, description: 'Creative and document cloud software' },
  { name: 'Salesforce Inc.', symbol: 'CRM', category: 'shares', basePrice: 278.50, exchange: 'NYSE', sector: 'Technology', marketCap: 268000000000, description: 'Customer relationship management software' },
  { name: 'Oracle Corp.', symbol: 'ORCL', category: 'shares', basePrice: 125.85, exchange: 'NYSE', sector: 'Technology', marketCap: 345000000000, description: 'Database software and cloud services' },
  { name: 'Intel Corp.', symbol: 'INTC', category: 'shares', basePrice: 31.25, exchange: 'NASDAQ', sector: 'Technology', marketCap: 135000000000, description: 'Semiconductor chips and processors' },
  { name: 'AMD Inc.', symbol: 'AMD', category: 'shares', basePrice: 158.45, exchange: 'NASDAQ', sector: 'Technology', marketCap: 255000000000, description: 'Semiconductors and graphics processors' },
  { name: 'Broadcom Inc.', symbol: 'AVGO', category: 'shares', basePrice: 1425.60, exchange: 'NASDAQ', sector: 'Technology', marketCap: 662000000000, description: 'Semiconductor and infrastructure software' },
  { name: 'Cisco Systems', symbol: 'CSCO', category: 'shares', basePrice: 48.75, exchange: 'NASDAQ', sector: 'Technology', marketCap: 198000000000, description: 'Networking hardware and software' },
  
  // Financial Services
  { name: 'Berkshire Hathaway B', symbol: 'BRK.B', category: 'shares', basePrice: 425.60, exchange: 'NYSE', sector: 'Financial', marketCap: 885000000000, description: 'Conglomerate holding company' },
  { name: 'JPMorgan Chase & Co.', symbol: 'JPM', category: 'shares', basePrice: 198.45, exchange: 'NYSE', sector: 'Financial', marketCap: 568000000000, description: 'Investment banking and financial services' },
  { name: 'Visa Inc.', symbol: 'V', category: 'shares', basePrice: 278.90, exchange: 'NYSE', sector: 'Financial', marketCap: 565000000000, description: 'Payment processing network' },
  { name: 'Mastercard Inc.', symbol: 'MA', category: 'shares', basePrice: 458.75, exchange: 'NYSE', sector: 'Financial', marketCap: 428000000000, description: 'Payment processing network' },
  { name: 'Bank of America', symbol: 'BAC', category: 'shares', basePrice: 38.25, exchange: 'NYSE', sector: 'Financial', marketCap: 302000000000, description: 'Banking and financial services' },
  { name: 'Wells Fargo & Co.', symbol: 'WFC', category: 'shares', basePrice: 58.75, exchange: 'NYSE', sector: 'Financial', marketCap: 225000000000, description: 'Banking and financial services' },
  { name: 'Goldman Sachs', symbol: 'GS', category: 'shares', basePrice: 385.60, exchange: 'NYSE', sector: 'Financial', marketCap: 125000000000, description: 'Investment banking and securities' },
  { name: 'Morgan Stanley', symbol: 'MS', category: 'shares', basePrice: 98.45, exchange: 'NYSE', sector: 'Financial', marketCap: 158000000000, description: 'Investment banking and wealth management' },
  { name: 'American Express', symbol: 'AXP', category: 'shares', basePrice: 215.80, exchange: 'NYSE', sector: 'Financial', marketCap: 152000000000, description: 'Payment cards and travel services' },
  { name: 'BlackRock Inc.', symbol: 'BLK', category: 'shares', basePrice: 812.50, exchange: 'NYSE', sector: 'Financial', marketCap: 121000000000, description: 'Investment management' },
  
  // Healthcare
  { name: 'Johnson & Johnson', symbol: 'JNJ', category: 'shares', basePrice: 158.25, exchange: 'NYSE', sector: 'Healthcare', marketCap: 382000000000, description: 'Pharmaceuticals and medical devices' },
  { name: 'UnitedHealth Group', symbol: 'UNH', category: 'shares', basePrice: 485.60, exchange: 'NYSE', sector: 'Healthcare', marketCap: 448000000000, description: 'Health insurance and services' },
  { name: 'Pfizer Inc.', symbol: 'PFE', category: 'shares', basePrice: 28.45, exchange: 'NYSE', sector: 'Healthcare', marketCap: 160000000000, description: 'Pharmaceuticals and vaccines' },
  { name: 'AbbVie Inc.', symbol: 'ABBV', category: 'shares', basePrice: 158.75, exchange: 'NYSE', sector: 'Healthcare', marketCap: 280000000000, description: 'Biopharmaceuticals' },
  { name: 'Eli Lilly & Co.', symbol: 'LLY', category: 'shares', basePrice: 758.90, exchange: 'NYSE', sector: 'Healthcare', marketCap: 718000000000, description: 'Pharmaceuticals' },
  { name: 'Merck & Co.', symbol: 'MRK', category: 'shares', basePrice: 125.45, exchange: 'NYSE', sector: 'Healthcare', marketCap: 318000000000, description: 'Pharmaceuticals and vaccines' },
  { name: 'Thermo Fisher', symbol: 'TMO', category: 'shares', basePrice: 548.25, exchange: 'NYSE', sector: 'Healthcare', marketCap: 212000000000, description: 'Laboratory equipment and services' },
  { name: 'Abbott Labs', symbol: 'ABT', category: 'shares', basePrice: 108.50, exchange: 'NYSE', sector: 'Healthcare', marketCap: 188000000000, description: 'Medical devices and diagnostics' },
  { name: 'Medtronic PLC', symbol: 'MDT', category: 'shares', basePrice: 85.75, exchange: 'NYSE', sector: 'Healthcare', marketCap: 115000000000, description: 'Medical devices' },
  { name: 'Moderna Inc.', symbol: 'MRNA', category: 'shares', basePrice: 115.80, exchange: 'NASDAQ', sector: 'Healthcare', marketCap: 45000000000, description: 'mRNA therapeutics and vaccines' },
  
  // Consumer Defensive
  { name: "Procter & Gamble", symbol: 'PG', category: 'shares', basePrice: 165.80, exchange: 'NYSE', sector: 'Consumer Defensive', marketCap: 388000000000, description: 'Consumer goods and household products' },
  { name: 'Coca-Cola Co.', symbol: 'KO', category: 'shares', basePrice: 62.80, exchange: 'NYSE', sector: 'Consumer Defensive', marketCap: 271000000000, description: 'Beverages' },
  { name: 'PepsiCo Inc.', symbol: 'PEP', category: 'shares', basePrice: 172.35, exchange: 'NASDAQ', sector: 'Consumer Defensive', marketCap: 238000000000, description: 'Beverages and snacks' },
  { name: 'Walmart Inc.', symbol: 'WMT', category: 'shares', basePrice: 165.50, exchange: 'NYSE', sector: 'Consumer Defensive', marketCap: 445000000000, description: 'Retail and grocery' },
  { name: 'Costco Wholesale', symbol: 'COST', category: 'shares', basePrice: 785.25, exchange: 'NASDAQ', sector: 'Consumer Defensive', marketCap: 348000000000, description: 'Membership warehouse retail' },
  { name: 'Colgate-Palmolive', symbol: 'CL', category: 'shares', basePrice: 85.45, exchange: 'NYSE', sector: 'Consumer Defensive', marketCap: 70500000000, description: 'Consumer products' },
  { name: 'Unilever PLC', symbol: 'UL', category: 'shares', basePrice: 52.75, exchange: 'NYSE', sector: 'Consumer Defensive', marketCap: 145000000000, description: 'Consumer goods' },
  
  // Consumer Cyclical
  { name: 'Home Depot Inc.', symbol: 'HD', category: 'shares', basePrice: 345.25, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 342000000000, description: 'Home improvement retail' },
  { name: 'Nike Inc.', symbol: 'NKE', category: 'shares', basePrice: 98.50, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 149000000000, description: 'Athletic footwear and apparel' },
  { name: 'McDonald\'s Corp.', symbol: 'MCD', category: 'shares', basePrice: 275.80, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 198000000000, description: 'Fast food restaurants' },
  { name: 'Starbucks Corp.', symbol: 'SBUX', category: 'shares', basePrice: 78.25, exchange: 'NASDAQ', sector: 'Consumer Cyclical', marketCap: 88500000000, description: 'Coffee shops and beverages' },
  { name: 'Target Corp.', symbol: 'TGT', category: 'shares', basePrice: 158.75, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 73500000000, description: 'Retail stores' },
  { name: 'Lowe\'s Companies', symbol: 'LOW', category: 'shares', basePrice: 225.45, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 128000000000, description: 'Home improvement retail' },
  { name: 'TJX Companies', symbol: 'TJX', category: 'shares', basePrice: 98.75, exchange: 'NYSE', sector: 'Consumer Cyclical', marketCap: 115000000000, description: 'Off-price retail' },
  
  // Energy
  { name: 'Chevron Corp.', symbol: 'CVX', category: 'shares', basePrice: 155.40, exchange: 'NYSE', sector: 'Energy', marketCap: 285000000000, description: 'Oil and gas' },
  { name: 'Exxon Mobil Corp.', symbol: 'XOM', category: 'shares', basePrice: 112.85, exchange: 'NYSE', sector: 'Energy', marketCap: 448000000000, description: 'Oil and gas' },
  { name: 'ConocoPhillips', symbol: 'COP', category: 'shares', basePrice: 118.25, exchange: 'NYSE', sector: 'Energy', marketCap: 138000000000, description: 'Oil and gas exploration' },
  { name: 'Schlumberger NV', symbol: 'SLB', category: 'shares', basePrice: 52.85, exchange: 'NYSE', sector: 'Energy', marketCap: 75000000000, description: 'Oilfield services' },
  { name: 'EOG Resources', symbol: 'EOG', category: 'shares', basePrice: 125.60, exchange: 'NYSE', sector: 'Energy', marketCap: 72500000000, description: 'Oil and gas exploration' },
  
  // Industrials
  { name: 'Caterpillar Inc.', symbol: 'CAT', category: 'shares', basePrice: 338.75, exchange: 'NYSE', sector: 'Industrials', marketCap: 165000000000, description: 'Construction and mining equipment' },
  { name: '3M Company', symbol: 'MMM', category: 'shares', basePrice: 98.50, exchange: 'NYSE', sector: 'Industrials', marketCap: 54500000000, description: 'Industrial conglomerate' },
  { name: 'Honeywell Intl', symbol: 'HON', category: 'shares', basePrice: 195.80, exchange: 'NYSE', sector: 'Industrials', marketCap: 128000000000, description: 'Industrial conglomerate' },
  { name: 'Union Pacific Corp.', symbol: 'UNP', category: 'shares', basePrice: 225.60, exchange: 'NYSE', sector: 'Industrials', marketCap: 138000000000, description: 'Railroad transportation' },
  { name: 'UPS Inc.', symbol: 'UPS', category: 'shares', basePrice: 142.85, exchange: 'NYSE', sector: 'Industrials', marketCap: 122000000000, description: 'Package delivery' },
  { name: 'Boeing Co.', symbol: 'BA', category: 'shares', basePrice: 185.25, exchange: 'NYSE', sector: 'Industrials', marketCap: 112000000000, description: 'Aerospace and defense' },
  { name: 'Deere & Company', symbol: 'DE', category: 'shares', basePrice: 385.60, exchange: 'NYSE', sector: 'Industrials', marketCap: 108000000000, description: 'Agricultural machinery' },
  
  // Utilities
  { name: 'NextEra Energy', symbol: 'NEE', category: 'shares', basePrice: 72.45, exchange: 'NYSE', sector: 'Utilities', marketCap: 148000000000, description: 'Electric utility and renewables' },
  { name: 'Duke Energy Corp.', symbol: 'DUK', category: 'shares', basePrice: 98.75, exchange: 'NYSE', sector: 'Utilities', marketCap: 76000000000, description: 'Electric utility' },
  { name: 'Southern Company', symbol: 'SO', category: 'shares', basePrice: 72.85, exchange: 'NYSE', sector: 'Utilities', marketCap: 78500000000, description: 'Electric utility' },
  
  // Real Estate
  { name: 'American Tower', symbol: 'AMT', category: 'shares', basePrice: 195.60, exchange: 'NYSE', sector: 'Real Estate', marketCap: 92000000000, description: 'Communications infrastructure REIT' },
  { name: 'Prologis Inc.', symbol: 'PLD', category: 'shares', basePrice: 118.25, exchange: 'NYSE', sector: 'Real Estate', marketCap: 108000000000, description: 'Industrial logistics REIT' },
  { name: 'Simon Property', symbol: 'SPG', category: 'shares', basePrice: 158.45, exchange: 'NYSE', sector: 'Real Estate', marketCap: 51500000000, description: 'Shopping mall REIT' },
];

// ==================== INDICES (A-Z) ====================
export const INDICES_DATA: MarketItemBase[] = [
  // Americas
  { name: 'S&P 500', symbol: 'SPX', category: 'indexes', basePrice: 5325.45, exchange: 'NYSE', country: 'USA', description: '500 large-cap US stocks' },
  { name: 'Dow Jones Industrial', symbol: 'DJI', category: 'indexes', basePrice: 39150.33, exchange: 'NYSE', country: 'USA', description: '30 blue-chip US stocks' },
  { name: 'NASDAQ Composite', symbol: 'IXIC', category: 'indexes', basePrice: 16825.78, exchange: 'NASDAQ', country: 'USA', description: 'All NASDAQ-listed stocks' },
  { name: 'NASDAQ 100', symbol: 'NDX', category: 'indexes', basePrice: 18650.50, exchange: 'NASDAQ', country: 'USA', description: '100 largest NASDAQ stocks' },
  { name: 'Russell 2000', symbol: 'RUT', category: 'indexes', basePrice: 2075.50, exchange: 'NYSE', country: 'USA', description: 'Small-cap US stocks' },
  { name: 'Russell 1000', symbol: 'RUI', category: 'indexes', basePrice: 3100.80, exchange: 'NYSE', country: 'USA', description: 'Large-cap US stocks' },
  { name: 'Wilshire 5000', symbol: 'W5000', category: 'indexes', basePrice: 51250.45, exchange: 'NYSE', country: 'USA', description: 'Total US stock market' },
  { name: 'TSX Composite', symbol: 'SPTSX', category: 'indexes', basePrice: 22250.80, exchange: 'TSX', country: 'Canada', description: 'Canadian stock market' },
  { name: 'Bovespa', symbol: 'IBOV', category: 'indexes', basePrice: 128450.50, exchange: 'B3', country: 'Brazil', description: 'Brazilian stock market' },
  { name: 'IPC Mexico', symbol: 'MEXBOL', category: 'indexes', basePrice: 52850.45, exchange: 'BMV', country: 'Mexico', description: 'Mexican stock market' },
  
  // Europe
  { name: 'FTSE 100', symbol: 'UKX', category: 'indexes', basePrice: 8165.25, exchange: 'LSE', country: 'UK', description: '100 largest UK companies' },
  { name: 'FTSE 250', symbol: 'MCX', category: 'indexes', basePrice: 20150.80, exchange: 'LSE', country: 'UK', description: 'Mid-cap UK companies' },
  { name: 'DAX', symbol: 'DAX', category: 'indexes', basePrice: 18425.60, exchange: 'XETRA', country: 'Germany', description: '40 major German companies' },
  { name: 'CAC 40', symbol: 'CAC', category: 'indexes', basePrice: 8025.45, exchange: 'Euronext', country: 'France', description: '40 largest French stocks' },
  { name: 'Euro Stoxx 50', symbol: 'SX5E', category: 'indexes', basePrice: 4985.60, exchange: 'Euronext', country: 'Europe', description: '50 eurozone blue chips' },
  { name: 'IBEX 35', symbol: 'IBEX', category: 'indexes', basePrice: 11250.80, exchange: 'BME', country: 'Spain', description: '35 Spanish companies' },
  { name: 'FTSE MIB', symbol: 'FTSEMIB', category: 'indexes', basePrice: 34250.75, exchange: 'Borsa', country: 'Italy', description: 'Italian blue chips' },
  { name: 'AEX', symbol: 'AEX', category: 'indexes', basePrice: 825.45, exchange: 'Euronext', country: 'Netherlands', description: 'Dutch blue chips' },
  { name: 'SMI', symbol: 'SMI', category: 'indexes', basePrice: 11850.60, exchange: 'SIX', country: 'Switzerland', description: 'Swiss blue chips' },
  { name: 'OMX Stockholm', symbol: 'OMX', category: 'indexes', basePrice: 2485.75, exchange: 'Nasdaq', country: 'Sweden', description: 'Swedish stock market' },
  
  // Asia-Pacific
  { name: 'Nikkei 225', symbol: 'NKY', category: 'indexes', basePrice: 38450.25, exchange: 'TSE', country: 'Japan', description: '225 Japanese blue chips' },
  { name: 'TOPIX', symbol: 'TPX', category: 'indexes', basePrice: 2685.80, exchange: 'TSE', country: 'Japan', description: 'All TSE first section' },
  { name: 'Hang Seng', symbol: 'HSI', category: 'indexes', basePrice: 18425.80, exchange: 'HKEX', country: 'Hong Kong', description: 'Hong Kong blue chips' },
  { name: 'Shanghai Composite', symbol: 'SHCOMP', category: 'indexes', basePrice: 3125.45, exchange: 'SSE', country: 'China', description: 'Shanghai stock market' },
  { name: 'Shenzhen Component', symbol: 'SZCOMP', category: 'indexes', basePrice: 9250.60, exchange: 'SZSE', country: 'China', description: 'Shenzhen stock market' },
  { name: 'KOSPI', symbol: 'KOSPI', category: 'indexes', basePrice: 2725.60, exchange: 'KRX', country: 'South Korea', description: 'Korean stock market' },
  { name: 'KOSDAQ', symbol: 'KOSDAQ', category: 'indexes', basePrice: 865.25, exchange: 'KRX', country: 'South Korea', description: 'Korean tech stocks' },
  { name: 'Taiwan Weighted', symbol: 'TWSE', category: 'indexes', basePrice: 20850.45, exchange: 'TWSE', country: 'Taiwan', description: 'Taiwan stock market' },
  { name: 'Nifty 50', symbol: 'NIFTY', category: 'indexes', basePrice: 22450.75, exchange: 'NSE', country: 'India', description: '50 Indian blue chips' },
  { name: 'Sensex', symbol: 'SENSEX', category: 'indexes', basePrice: 73850.50, exchange: 'BSE', country: 'India', description: '30 Indian blue chips' },
  { name: 'ASX 200', symbol: 'AS51', category: 'indexes', basePrice: 7825.30, exchange: 'ASX', country: 'Australia', description: '200 Australian stocks' },
  { name: 'NZX 50', symbol: 'NZSE', category: 'indexes', basePrice: 11950.45, exchange: 'NZX', country: 'New Zealand', description: 'New Zealand stock market' },
  { name: 'Straits Times', symbol: 'STI', category: 'indexes', basePrice: 3325.80, exchange: 'SGX', country: 'Singapore', description: 'Singapore stock market' },
  { name: 'Jakarta Composite', symbol: 'JCI', category: 'indexes', basePrice: 7185.60, exchange: 'IDX', country: 'Indonesia', description: 'Indonesian stock market' },
  { name: 'SET Index', symbol: 'SET', category: 'indexes', basePrice: 1385.25, exchange: 'SET', country: 'Thailand', description: 'Thai stock market' },
];

// ==================== CURRENCIES (A-Z) ====================
export const CURRENCIES_DATA: MarketItemBase[] = [
  // Major Pairs
  { name: 'EUR/USD', symbol: 'EURUSD', category: 'currencies', basePrice: 1.0845, exchange: 'FOREX', description: 'Euro vs US Dollar' },
  { name: 'GBP/USD', symbol: 'GBPUSD', category: 'currencies', basePrice: 1.2658, exchange: 'FOREX', description: 'British Pound vs US Dollar' },
  { name: 'USD/JPY', symbol: 'USDJPY', category: 'currencies', basePrice: 154.85, exchange: 'FOREX', description: 'US Dollar vs Japanese Yen' },
  { name: 'USD/CHF', symbol: 'USDCHF', category: 'currencies', basePrice: 0.8975, exchange: 'FOREX', description: 'US Dollar vs Swiss Franc' },
  { name: 'AUD/USD', symbol: 'AUDUSD', category: 'currencies', basePrice: 0.6542, exchange: 'FOREX', description: 'Australian Dollar vs US Dollar' },
  { name: 'USD/CAD', symbol: 'USDCAD', category: 'currencies', basePrice: 1.3685, exchange: 'FOREX', description: 'US Dollar vs Canadian Dollar' },
  { name: 'NZD/USD', symbol: 'NZDUSD', category: 'currencies', basePrice: 0.5978, exchange: 'FOREX', description: 'New Zealand Dollar vs US Dollar' },
  
  // Cross Pairs
  { name: 'EUR/GBP', symbol: 'EURGBP', category: 'currencies', basePrice: 0.8572, exchange: 'FOREX', description: 'Euro vs British Pound' },
  { name: 'EUR/JPY', symbol: 'EURJPY', category: 'currencies', basePrice: 167.85, exchange: 'FOREX', description: 'Euro vs Japanese Yen' },
  { name: 'GBP/JPY', symbol: 'GBPJPY', category: 'currencies', basePrice: 195.78, exchange: 'FOREX', description: 'British Pound vs Japanese Yen' },
  { name: 'AUD/JPY', symbol: 'AUDJPY', category: 'currencies', basePrice: 101.35, exchange: 'FOREX', description: 'Australian Dollar vs Japanese Yen' },
  { name: 'EUR/AUD', symbol: 'EURAUD', category: 'currencies', basePrice: 1.6578, exchange: 'FOREX', description: 'Euro vs Australian Dollar' },
  { name: 'EUR/CAD', symbol: 'EURCAD', category: 'currencies', basePrice: 1.4845, exchange: 'FOREX', description: 'Euro vs Canadian Dollar' },
  { name: 'GBP/AUD', symbol: 'GBPAUD', category: 'currencies', basePrice: 1.9358, exchange: 'FOREX', description: 'British Pound vs Australian Dollar' },
  { name: 'GBP/CAD', symbol: 'GBPCAD', category: 'currencies', basePrice: 1.7325, exchange: 'FOREX', description: 'British Pound vs Canadian Dollar' },
  
  // USD Pairs - Asia
  { name: 'USD/CNY', symbol: 'USDCNY', category: 'currencies', basePrice: 7.2456, exchange: 'FOREX', description: 'US Dollar vs Chinese Yuan' },
  { name: 'USD/INR', symbol: 'USDINR', category: 'currencies', basePrice: 83.45, exchange: 'FOREX', description: 'US Dollar vs Indian Rupee' },
  { name: 'USD/SGD', symbol: 'USDSGD', category: 'currencies', basePrice: 1.3485, exchange: 'FOREX', description: 'US Dollar vs Singapore Dollar' },
  { name: 'USD/HKD', symbol: 'USDHKD', category: 'currencies', basePrice: 7.8245, exchange: 'FOREX', description: 'US Dollar vs Hong Kong Dollar' },
  { name: 'USD/KRW', symbol: 'USDKRW', category: 'currencies', basePrice: 1378.50, exchange: 'FOREX', description: 'US Dollar vs Korean Won' },
  { name: 'USD/TWD', symbol: 'USDTWD', category: 'currencies', basePrice: 32.45, exchange: 'FOREX', description: 'US Dollar vs Taiwan Dollar' },
  { name: 'USD/THB', symbol: 'USDTHB', category: 'currencies', basePrice: 35.85, exchange: 'FOREX', description: 'US Dollar vs Thai Baht' },
  { name: 'USD/PHP', symbol: 'USDPHP', category: 'currencies', basePrice: 58.25, exchange: 'FOREX', description: 'US Dollar vs Philippine Peso' },
  { name: 'USD/IDR', symbol: 'USDIDR', category: 'currencies', basePrice: 16250.00, exchange: 'FOREX', description: 'US Dollar vs Indonesian Rupiah' },
  { name: 'USD/MYR', symbol: 'USDMYR', category: 'currencies', basePrice: 4.725, exchange: 'FOREX', description: 'US Dollar vs Malaysian Ringgit' },
  { name: 'USD/VND', symbol: 'USDVND', category: 'currencies', basePrice: 25450.00, exchange: 'FOREX', description: 'US Dollar vs Vietnamese Dong' },
  
  // USD Pairs - Europe & Others
  { name: 'USD/SEK', symbol: 'USDSEK', category: 'currencies', basePrice: 10.8545, exchange: 'FOREX', description: 'US Dollar vs Swedish Krona' },
  { name: 'USD/NOK', symbol: 'USDNOK', category: 'currencies', basePrice: 10.7856, exchange: 'FOREX', description: 'US Dollar vs Norwegian Krone' },
  { name: 'USD/DKK', symbol: 'USDDKK', category: 'currencies', basePrice: 6.9245, exchange: 'FOREX', description: 'US Dollar vs Danish Krone' },
  { name: 'USD/PLN', symbol: 'USDPLN', category: 'currencies', basePrice: 4.0856, exchange: 'FOREX', description: 'US Dollar vs Polish Zloty' },
  { name: 'USD/TRY', symbol: 'USDTRY', category: 'currencies', basePrice: 32.45, exchange: 'FOREX', description: 'US Dollar vs Turkish Lira' },
  { name: 'USD/ZAR', symbol: 'USDZAR', category: 'currencies', basePrice: 18.85, exchange: 'FOREX', description: 'US Dollar vs South African Rand' },
  
  // Americas
  { name: 'USD/MXN', symbol: 'USDMXN', category: 'currencies', basePrice: 17.25, exchange: 'FOREX', description: 'US Dollar vs Mexican Peso' },
  { name: 'USD/BRL', symbol: 'USDBRL', category: 'currencies', basePrice: 4.9856, exchange: 'FOREX', description: 'US Dollar vs Brazilian Real' },
  { name: 'USD/ARS', symbol: 'USDARS', category: 'currencies', basePrice: 875.50, exchange: 'FOREX', description: 'US Dollar vs Argentine Peso' },
  { name: 'USD/CLP', symbol: 'USDCLP', category: 'currencies', basePrice: 925.75, exchange: 'FOREX', description: 'US Dollar vs Chilean Peso' },
  
  // Middle East
  { name: 'USD/SAR', symbol: 'USDSAR', category: 'currencies', basePrice: 3.75, exchange: 'FOREX', description: 'US Dollar vs Saudi Riyal' },
  { name: 'USD/AED', symbol: 'USDAED', category: 'currencies', basePrice: 3.6725, exchange: 'FOREX', description: 'US Dollar vs UAE Dirham' },
  { name: 'USD/ILS', symbol: 'USDILS', category: 'currencies', basePrice: 3.685, exchange: 'FOREX', description: 'US Dollar vs Israeli Shekel' },
];

// ==================== CRYPTO (A-Z) ====================
export const CRYPTO_DATA: MarketItemBase[] = [
  // Major Cryptocurrencies
  { name: 'Bitcoin', symbol: 'BTC', category: 'crypto', basePrice: 67850.45, exchange: 'Multiple', description: 'First and largest cryptocurrency', marketCap: 1335000000000 },
  { name: 'Ethereum', symbol: 'ETH', category: 'crypto', basePrice: 3485.60, exchange: 'Multiple', description: 'Smart contract platform', marketCap: 418000000000 },
  { name: 'BNB', symbol: 'BNB', category: 'crypto', basePrice: 598.25, exchange: 'Binance', description: 'Binance exchange token', marketCap: 88000000000 },
  { name: 'Solana', symbol: 'SOL', category: 'crypto', basePrice: 145.80, exchange: 'Multiple', description: 'High-speed blockchain', marketCap: 65000000000 },
  { name: 'XRP', symbol: 'XRP', category: 'crypto', basePrice: 0.5245, exchange: 'Multiple', description: 'Cross-border payments', marketCap: 28500000000 },
  { name: 'Cardano', symbol: 'ADA', category: 'crypto', basePrice: 0.4585, exchange: 'Multiple', description: 'Proof-of-stake blockchain', marketCap: 16200000000 },
  { name: 'Dogecoin', symbol: 'DOGE', category: 'crypto', basePrice: 0.1542, exchange: 'Multiple', description: 'Meme cryptocurrency', marketCap: 22000000000 },
  { name: 'Avalanche', symbol: 'AVAX', category: 'crypto', basePrice: 35.85, exchange: 'Multiple', description: 'Layer-1 blockchain', marketCap: 13500000000 },
  { name: 'Polkadot', symbol: 'DOT', category: 'crypto', basePrice: 7.25, exchange: 'Multiple', description: 'Multi-chain protocol', marketCap: 9800000000 },
  { name: 'Chainlink', symbol: 'LINK', category: 'crypto', basePrice: 14.58, exchange: 'Multiple', description: 'Oracle network', marketCap: 8500000000 },
  
  // DeFi Tokens
  { name: 'Uniswap', symbol: 'UNI', category: 'crypto', basePrice: 9.85, exchange: 'Multiple', description: 'Decentralized exchange token', marketCap: 5900000000 },
  { name: 'Aave', symbol: 'AAVE', category: 'crypto', basePrice: 95.25, exchange: 'Multiple', description: 'DeFi lending protocol', marketCap: 1400000000 },
  { name: 'Maker', symbol: 'MKR', category: 'crypto', basePrice: 2850.50, exchange: 'Multiple', description: 'DAI stablecoin protocol', marketCap: 2600000000 },
  { name: 'Compound', symbol: 'COMP', category: 'crypto', basePrice: 58.75, exchange: 'Multiple', description: 'DeFi lending platform', marketCap: 480000000 },
  { name: 'Curve', symbol: 'CRV', category: 'crypto', basePrice: 0.3585, exchange: 'Multiple', description: 'Stablecoin DEX', marketCap: 450000000 },
  { name: 'Lido DAO', symbol: 'LDO', category: 'crypto', basePrice: 2.45, exchange: 'Multiple', description: 'Liquid staking protocol', marketCap: 2200000000 },
  { name: 'Rocket Pool', symbol: 'RPL', category: 'crypto', basePrice: 18.85, exchange: 'Multiple', description: 'Decentralized staking', marketCap: 380000000 },
  
  // Layer 2 & Scaling
  { name: 'Toncoin', symbol: 'TON', category: 'crypto', basePrice: 7.45, exchange: 'Multiple', description: 'Telegram blockchain', marketCap: 17500000000 },
  { name: 'Polygon', symbol: 'MATIC', category: 'crypto', basePrice: 0.5845, exchange: 'Multiple', description: 'Ethereum scaling', marketCap: 5400000000 },
  { name: 'Arbitrum', symbol: 'ARB', category: 'crypto', basePrice: 1.15, exchange: 'Multiple', description: 'Layer 2 rollup', marketCap: 4200000000 },
  { name: 'Optimism', symbol: 'OP', category: 'crypto', basePrice: 2.45, exchange: 'Multiple', description: 'Optimistic rollup', marketCap: 2800000000 },
  { name: 'Immutable X', symbol: 'IMX', category: 'crypto', basePrice: 2.25, exchange: 'Multiple', description: 'NFT scaling solution', marketCap: 3200000000 },
  
  // Meme & Community
  { name: 'Shiba Inu', symbol: 'SHIB', category: 'crypto', basePrice: 0.00002485, exchange: 'Multiple', description: 'Meme cryptocurrency', marketCap: 14500000000 },
  { name: 'Pepe', symbol: 'PEPE', category: 'crypto', basePrice: 0.0000115, exchange: 'Multiple', description: 'Meme token', marketCap: 4800000000 },
  { name: 'Floki', symbol: 'FLOKI', category: 'crypto', basePrice: 0.0001825, exchange: 'Multiple', description: 'Meme cryptocurrency', marketCap: 1700000000 },
  
  // Other Major
  { name: 'Litecoin', symbol: 'LTC', category: 'crypto', basePrice: 84.25, exchange: 'Multiple', description: 'Bitcoin fork', marketCap: 6200000000 },
  { name: 'Bitcoin Cash', symbol: 'BCH', category: 'crypto', basePrice: 485.60, exchange: 'Multiple', description: 'Bitcoin fork', marketCap: 9500000000 },
  { name: 'Stellar', symbol: 'XLM', category: 'crypto', basePrice: 0.1125, exchange: 'Multiple', description: 'Payment network', marketCap: 3200000000 },
  { name: 'Algorand', symbol: 'ALGO', category: 'crypto', basePrice: 0.1825, exchange: 'Multiple', description: 'Pure proof-of-stake', marketCap: 1400000000 },
  { name: 'VeChain', symbol: 'VET', category: 'crypto', basePrice: 0.0325, exchange: 'Multiple', description: 'Supply chain blockchain', marketCap: 2400000000 },
  { name: 'Hedera', symbol: 'HBAR', category: 'crypto', basePrice: 0.0885, exchange: 'Multiple', description: 'Hashgraph DLT', marketCap: 3200000000 },
  { name: 'Internet Computer', symbol: 'ICP', category: 'crypto', basePrice: 12.85, exchange: 'Multiple', description: 'Decentralized compute', marketCap: 5800000000 },
  { name: 'Near Protocol', symbol: 'NEAR', category: 'crypto', basePrice: 7.25, exchange: 'Multiple', description: 'Sharded blockchain', marketCap: 7800000000 },
  { name: 'Aptos', symbol: 'APT', category: 'crypto', basePrice: 9.45, exchange: 'Multiple', description: 'Layer-1 blockchain', marketCap: 4200000000 },
  { name: 'Sui', symbol: 'SUI', category: 'crypto', basePrice: 1.25, exchange: 'Multiple', description: 'Layer-1 blockchain', marketCap: 1500000000 },
];

// ==================== BONDS (A-Z) ====================
export const BONDS_DATA: MarketItemBase[] = [
  // US Treasuries
  { name: 'US 2-Year Treasury', symbol: 'US2Y', category: 'bonds', basePrice: 4.645, exchange: 'Government', country: 'USA', description: 'US 2-year Treasury yield' },
  { name: 'US 3-Year Treasury', symbol: 'US3Y', category: 'bonds', basePrice: 4.425, exchange: 'Government', country: 'USA', description: 'US 3-year Treasury yield' },
  { name: 'US 5-Year Treasury', symbol: 'US5Y', category: 'bonds', basePrice: 4.385, exchange: 'Government', country: 'USA', description: 'US 5-year Treasury yield' },
  { name: 'US 7-Year Treasury', symbol: 'US7Y', category: 'bonds', basePrice: 4.345, exchange: 'Government', country: 'USA', description: 'US 7-year Treasury yield' },
  { name: 'US 10-Year Treasury', symbol: 'US10Y', category: 'bonds', basePrice: 4.285, exchange: 'Government', country: 'USA', description: 'US 10-year Treasury yield' },
  { name: 'US 20-Year Treasury', symbol: 'US20Y', category: 'bonds', basePrice: 4.485, exchange: 'Government', country: 'USA', description: 'US 20-year Treasury yield' },
  { name: 'US 30-Year Treasury', symbol: 'US30Y', category: 'bonds', basePrice: 4.425, exchange: 'Government', country: 'USA', description: 'US 30-year Treasury yield' },
  { name: 'TIPS 10-Year', symbol: 'TIPS10', category: 'bonds', basePrice: 2.125, exchange: 'Government', country: 'USA', description: 'US 10-year TIPS real yield' },
  
  // European Government Bonds
  { name: 'Germany 2-Year Bund', symbol: 'DE2Y', category: 'bonds', basePrice: 2.985, exchange: 'Government', country: 'Germany', description: 'German 2-year bond yield' },
  { name: 'Germany 5-Year Bund', symbol: 'DE5Y', category: 'bonds', basePrice: 2.385, exchange: 'Government', country: 'Germany', description: 'German 5-year bond yield' },
  { name: 'Germany 10-Year Bund', symbol: 'DE10Y', category: 'bonds', basePrice: 2.485, exchange: 'Government', country: 'Germany', description: 'German 10-year bond yield' },
  { name: 'Germany 30-Year Bund', symbol: 'DE30Y', category: 'bonds', basePrice: 2.585, exchange: 'Government', country: 'Germany', description: 'German 30-year bond yield' },
  { name: 'UK 2-Year Gilt', symbol: 'UK2Y', category: 'bonds', basePrice: 4.685, exchange: 'Government', country: 'UK', description: 'UK 2-year gilt yield' },
  { name: 'UK 10-Year Gilt', symbol: 'UK10Y', category: 'bonds', basePrice: 4.125, exchange: 'Government', country: 'UK', description: 'UK 10-year gilt yield' },
  { name: 'UK 30-Year Gilt', symbol: 'UK30Y', category: 'bonds', basePrice: 4.285, exchange: 'Government', country: 'UK', description: 'UK 30-year gilt yield' },
  { name: 'France 10-Year OAT', symbol: 'FR10Y', category: 'bonds', basePrice: 2.985, exchange: 'Government', country: 'France', description: 'French 10-year bond yield' },
  { name: 'Italy 10-Year BTP', symbol: 'IT10Y', category: 'bonds', basePrice: 3.785, exchange: 'Government', country: 'Italy', description: 'Italian 10-year bond yield' },
  { name: 'Spain 10-Year Bond', symbol: 'ES10Y', category: 'bonds', basePrice: 3.285, exchange: 'Government', country: 'Spain', description: 'Spanish 10-year bond yield' },
  { name: 'Portugal 10-Year', symbol: 'PT10Y', category: 'bonds', basePrice: 3.185, exchange: 'Government', country: 'Portugal', description: 'Portuguese 10-year bond yield' },
  { name: 'Greece 10-Year', symbol: 'GR10Y', category: 'bonds', basePrice: 3.685, exchange: 'Government', country: 'Greece', description: 'Greek 10-year bond yield' },
  { name: 'Netherlands 10-Year', symbol: 'NL10Y', category: 'bonds', basePrice: 2.585, exchange: 'Government', country: 'Netherlands', description: 'Dutch 10-year bond yield' },
  { name: 'Belgium 10-Year', symbol: 'BE10Y', category: 'bonds', basePrice: 2.885, exchange: 'Government', country: 'Belgium', description: 'Belgian 10-year bond yield' },
  { name: 'Austria 10-Year', symbol: 'AT10Y', category: 'bonds', basePrice: 2.785, exchange: 'Government', country: 'Austria', description: 'Austrian 10-year bond yield' },
  { name: 'Switzerland 10-Year', symbol: 'CH10Y', category: 'bonds', basePrice: 0.985, exchange: 'Government', country: 'Switzerland', description: 'Swiss 10-year bond yield' },
  
  // Asia-Pacific Government Bonds
  { name: 'Japan 2-Year JGB', symbol: 'JP2Y', category: 'bonds', basePrice: 0.125, exchange: 'Government', country: 'Japan', description: 'Japanese 2-year JGB yield' },
  { name: 'Japan 10-Year JGB', symbol: 'JP10Y', category: 'bonds', basePrice: 1.025, exchange: 'Government', country: 'Japan', description: 'Japanese 10-year JGB yield' },
  { name: 'China 10-Year Bond', symbol: 'CN10Y', category: 'bonds', basePrice: 2.325, exchange: 'Government', country: 'China', description: 'Chinese 10-year bond yield' },
  { name: 'India 10-Year Bond', symbol: 'IN10Y', category: 'bonds', basePrice: 7.085, exchange: 'Government', country: 'India', description: 'Indian 10-year bond yield' },
  { name: 'Australia 2-Year', symbol: 'AU2Y', category: 'bonds', basePrice: 4.285, exchange: 'Government', country: 'Australia', description: 'Australian 2-year bond yield' },
  { name: 'Australia 10-Year', symbol: 'AU10Y', category: 'bonds', basePrice: 4.185, exchange: 'Government', country: 'Australia', description: 'Australian 10-year bond yield' },
  { name: 'South Korea 10-Year', symbol: 'KR10Y', category: 'bonds', basePrice: 3.385, exchange: 'Government', country: 'South Korea', description: 'Korean 10-year bond yield' },
  { name: 'Singapore 10-Year', symbol: 'SG10Y', category: 'bonds', basePrice: 2.985, exchange: 'Government', country: 'Singapore', description: 'Singapore 10-year bond yield' },
  
  // Americas
  { name: 'Canada 2-Year', symbol: 'CA2Y', category: 'bonds', basePrice: 4.285, exchange: 'Government', country: 'Canada', description: 'Canadian 2-year bond yield' },
  { name: 'Canada 10-Year', symbol: 'CA10Y', category: 'bonds', basePrice: 3.585, exchange: 'Government', country: 'Canada', description: 'Canadian 10-year bond yield' },
  { name: 'Mexico 10-Year', symbol: 'MX10Y', category: 'bonds', basePrice: 10.285, exchange: 'Government', country: 'Mexico', description: 'Mexican 10-year bond yield' },
  { name: 'Brazil 10-Year', symbol: 'BR10Y', category: 'bonds', basePrice: 12.485, exchange: 'Government', country: 'Brazil', description: 'Brazilian 10-year bond yield' },
  
  // Emerging Markets
  { name: 'Turkey 10-Year', symbol: 'TR10Y', category: 'bonds', basePrice: 25.85, exchange: 'Government', country: 'Turkey', description: 'Turkish 10-year bond yield' },
  { name: 'South Africa 10-Year', symbol: 'ZA10Y', category: 'bonds', basePrice: 11.85, exchange: 'Government', country: 'South Africa', description: 'South African 10-year bond yield' },
  { name: 'Indonesia 10-Year', symbol: 'ID10Y', category: 'bonds', basePrice: 6.985, exchange: 'Government', country: 'Indonesia', description: 'Indonesian 10-year bond yield' },
  { name: 'Russia 10-Year', symbol: 'RU10Y', category: 'bonds', basePrice: 14.85, exchange: 'Government', country: 'Russia', description: 'Russian 10-year bond yield' },
];

// ==================== FREIGHT INDICES ====================
export const FREIGHT_DATA: MarketItemBase[] = [
  // Baltic Indices
  { name: 'Baltic Dry Index', symbol: 'BDI', category: 'freight', basePrice: 1847, exchange: 'Baltic Exchange', description: 'Global dry bulk shipping rates' },
  { name: 'Baltic Capesize Index', symbol: 'BCI', category: 'freight', basePrice: 2540, exchange: 'Baltic Exchange', description: 'Capesize vessel rates (180,000+ DWT)' },
  { name: 'Baltic Panamax Index', symbol: 'BPI', category: 'freight', basePrice: 1685, exchange: 'Baltic Exchange', description: 'Panamax vessel rates (60,000-80,000 DWT)' },
  { name: 'Baltic Supramax Index', symbol: 'BSI', category: 'freight', basePrice: 1425, exchange: 'Baltic Exchange', description: 'Supramax vessel rates (50,000-60,000 DWT)' },
  { name: 'Baltic Handysize Index', symbol: 'BHSI', category: 'freight', basePrice: 985, exchange: 'Baltic Exchange', description: 'Handysize vessel rates (15,000-35,000 DWT)' },
  
  // Container Indices
  { name: 'FBX Container Index', symbol: 'FBX', category: 'freight', basePrice: 3920, exchange: 'Freightos', description: 'Global container freight index' },
  { name: 'Shanghai Containerized Freight Index', symbol: 'SCFI', category: 'freight', basePrice: 2156, exchange: 'SSE', description: 'Container rates from Shanghai' },
  { name: 'World Container Index', symbol: 'WCI', category: 'freight', basePrice: 2890, exchange: 'Drewry', description: 'Drewry World Container Index' },
  { name: 'Container Trade Statistics', symbol: 'CTS', category: 'freight', basePrice: 125.50, exchange: 'CTS', description: 'Container trade statistics' },
  
  // Route-Specific Container Rates
  { name: 'FBX01 Asia-US West Coast', symbol: 'FBX01', category: 'freight', basePrice: 4520, exchange: 'Freightos', description: 'Asia to US West Coast container rates' },
  { name: 'FBX02 Asia-US East Coast', symbol: 'FBX02', category: 'freight', basePrice: 6280, exchange: 'Freightos', description: 'Asia to US East Coast container rates' },
  { name: 'FBX03 Asia-Europe North', symbol: 'FBX03', category: 'freight', basePrice: 3850, exchange: 'Freightos', description: 'Asia to North Europe container rates' },
  { name: 'FBX04 Asia-Mediterranean', symbol: 'FBX04', category: 'freight', basePrice: 4125, exchange: 'Freightos', description: 'Asia to Mediterranean container rates' },
  { name: 'FBX11 Europe-US East Coast', symbol: 'FBX11', category: 'freight', basePrice: 2850, exchange: 'Freightos', description: 'Europe to US East Coast container rates' },
  
  // Tanker Indices
  { name: 'Baltic Clean Tanker Index', symbol: 'BCTI', category: 'freight', basePrice: 1285, exchange: 'Baltic Exchange', description: 'Clean tanker rates (products)' },
  { name: 'Baltic Dirty Tanker Index', symbol: 'BDTI', category: 'freight', basePrice: 1425, exchange: 'Baltic Exchange', description: 'Dirty tanker rates (crude)' },
  { name: 'LNG Shipping Index', symbol: 'LNGSI', category: 'freight', basePrice: 125000, exchange: 'Spark', description: 'LNG carrier spot rates $/day' },
  { name: 'LPG Shipping Index', symbol: 'LPGSI', category: 'freight', basePrice: 45000, exchange: 'Baltic Exchange', description: 'LPG carrier rates $/day' },
  
  // Time Charter Rates
  { name: 'Capesize TC Rate', symbol: 'CAPE5TC', category: 'freight', basePrice: 18500, exchange: 'Baltic Exchange', description: 'Capesize 5TC time charter $/day' },
  { name: 'Panamax TC Rate', symbol: 'PANAMAXTC', category: 'freight', basePrice: 14200, exchange: 'Baltic Exchange', description: 'Panamax time charter $/day' },
  { name: 'Supramax TC Rate', symbol: 'SUPRAMAXTC', category: 'freight', basePrice: 12500, exchange: 'Baltic Exchange', description: 'Supramax time charter $/day' },
  { name: 'Handysize TC Rate', symbol: 'HANDYSIZETC', category: 'freight', basePrice: 11500, exchange: 'Baltic Exchange', description: 'Handysize time charter $/day' },
  
  // Other Shipping Indices
  { name: 'Clarksea Index', symbol: 'CLARK', category: 'freight', basePrice: 24580, exchange: 'Clarksons', description: 'Clarksea earnings index $/day' },
  { name: 'Drewry Multiplex', symbol: 'DREW', category: 'freight', basePrice: 1850, exchange: 'Drewry', description: 'Multipurpose vessel rates' },
  { name: 'Harper Petersen Index', symbol: 'HARP', category: 'freight', basePrice: 1580, exchange: 'Harper Petersen', description: 'Container charter rates' },
  { name: 'New ConTex', symbol: 'NCONTEX', category: 'freight', basePrice: 850, exchange: 'Howe Robinson', description: 'Container time charter index' },
  
  // Regional Port Indices
  { name: 'Hong Kong Container Index', symbol: 'HKCI', category: 'freight', basePrice: 2850, exchange: 'HKSA', description: 'Hong Kong container handling' },
  { name: 'Singapore Container Index', symbol: 'SGCI', category: 'freight', basePrice: 2650, exchange: 'MPA', description: 'Singapore container handling' },
  { name: 'Shanghai Container Index', symbol: 'SHCI', category: 'freight', basePrice: 2450, exchange: 'SIPG', description: 'Shanghai container handling' },
];

// Helper functions
export function getCommoditiesBySector(sector: string): MarketItemBase[] {
  return COMMODITIES_DATA.filter(item => item.sector?.toLowerCase().includes(sector.toLowerCase()));
}

export function getStocksBySector(sector: string): MarketItemBase[] {
  return STOCKS_DATA.filter(item => item.sector?.toLowerCase().includes(sector.toLowerCase()));
}

export function getBondsByCountry(country: string): MarketItemBase[] {
  return BONDS_DATA.filter(item => item.country?.toLowerCase().includes(country.toLowerCase()));
}

export function getIndicesByCountry(country: string): MarketItemBase[] {
  return INDICES_DATA.filter(item => item.country?.toLowerCase().includes(country.toLowerCase()));
}

// Market cap calculation helper
export function formatMarketCap(marketCap?: number): string {
  if (!marketCap) return 'N/A';
  if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`;
  if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`;
  if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`;
  return `$${marketCap.toLocaleString()}`;
}

// Get all market data
export function getAllMarketData(): MarketItemBase[] {
  return [
    ...COMMODITIES_DATA,
    ...STOCKS_DATA,
    ...INDICES_DATA,
    ...CURRENCIES_DATA,
    ...CRYPTO_DATA,
    ...BONDS_DATA,
    ...FREIGHT_DATA,
  ];
}
