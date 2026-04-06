// Comprehensive Trade Data - A-Z Coverage
// This file contains all market data for the trade section

// ============== COMMODITIES ==============
export const commoditiesData = {
  energy: [
    { name: 'Crude Oil WTI', symbol: 'CL', basePrice: 78.45, unit: 'USD/bbl', exchange: 'NYMEX', description: 'West Texas Intermediate crude oil futures' },
    { name: 'Brent Crude Oil', symbol: 'BRN', basePrice: 82.67, unit: 'USD/bbl', exchange: 'ICE', description: 'Brent crude oil futures' },
    { name: 'Urals Oil', symbol: 'URALS', basePrice: 72.50, unit: 'USD/bbl', exchange: 'OTC', description: 'Russian Urals crude oil' },
    { name: 'Dubai Crude', symbol: 'DUBAI', basePrice: 79.85, unit: 'USD/bbl', exchange: 'DME', description: 'Dubai crude oil benchmark' },
    { name: 'Mars Crude', symbol: 'MARS', basePrice: 76.25, unit: 'USD/bbl', exchange: 'NYMEX', description: 'Mars blend crude oil' },
    { name: 'Bonny Light', symbol: 'BONNY', basePrice: 84.50, unit: 'USD/bbl', exchange: 'OTC', description: 'Nigerian Bonny Light crude' },
    { name: 'Natural Gas', symbol: 'NG', basePrice: 2.89, unit: 'USD/MMBtu', exchange: 'NYMEX', description: 'Natural gas futures' },
    { name: 'Gasoline RBOB', symbol: 'RB', basePrice: 2.45, unit: 'USD/gal', exchange: 'NYMEX', description: 'Reformulated Blendstock for Oxygenate Blending' },
    { name: 'Heating Oil', symbol: 'HO', basePrice: 2.58, unit: 'USD/gal', exchange: 'NYMEX', description: 'Heating oil futures' },
    { name: 'Crude Oil WTI Mini', symbol: 'QM', basePrice: 78.45, unit: 'USD/bbl', exchange: 'NYMEX', description: 'Mini WTI crude oil futures' },
    { name: 'Natural Gas Mini', symbol: 'QG', basePrice: 2.89, unit: 'USD/MMBtu', exchange: 'NYMEX', description: 'Mini natural gas futures' },
    { name: 'UK Natural Gas', symbol: 'NBP', basePrice: 72.50, unit: 'GBP/thm', exchange: 'ICE', description: 'UK natural gas NBP' },
    { name: 'Dutch TTF Gas', symbol: 'TTF', basePrice: 28.50, unit: 'EUR/MWh', exchange: 'TTF', description: 'Dutch Title Transfer Facility gas' },
    { name: 'Coal API2', symbol: 'API2', basePrice: 115.00, unit: 'USD/MT', exchange: 'ICE', description: 'API2 coal futures Rotterdam' },
    { name: 'Coal RB', symbol: 'RBCT', basePrice: 98.50, unit: 'USD/MT', exchange: 'ICE', description: 'Richards Bay coal' },
    { name: 'Uranium', symbol: 'UX', basePrice: 82.50, unit: 'USD/lb', exchange: 'CME', description: 'Uranium U3O8' },
    { name: 'Propane', symbol: 'PN', basePrice: 0.85, unit: 'USD/gal', exchange: 'NYMEX', description: 'Propane futures' },
    { name: 'Ethanol', symbol: 'EH', basePrice: 2.45, unit: 'USD/gal', exchange: 'CBOT', description: 'Ethanol futures' },
    { name: 'Methanol', symbol: 'MEH', basePrice: 385, unit: 'USD/MT', exchange: 'OTC', description: 'Methanol price' },
  ],
  metals: [
    { name: 'Gold', symbol: 'GC', basePrice: 2342.50, unit: 'USD/oz', exchange: 'COMEX', description: 'Gold futures' },
    { name: 'Silver', symbol: 'SI', basePrice: 27.85, unit: 'USD/oz', exchange: 'COMEX', description: 'Silver futures' },
    { name: 'Copper', symbol: 'HG', basePrice: 4.52, unit: 'USD/lb', exchange: 'COMEX', description: 'High grade copper futures' },
    { name: 'Platinum', symbol: 'PL', basePrice: 998.50, unit: 'USD/oz', exchange: 'NYMEX', description: 'Platinum futures' },
    { name: 'Palladium', symbol: 'PA', basePrice: 1025.30, unit: 'USD/oz', exchange: 'NYMEX', description: 'Palladium futures' },
    { name: 'Aluminum', symbol: 'ALI', basePrice: 2580, unit: 'USD/MT', exchange: 'LME', description: 'Aluminum LME' },
    { name: 'Aluminum Alloy', symbol: 'AA', basePrice: 2320, unit: 'USD/MT', exchange: 'LME', description: 'Aluminum alloy LME' },
    { name: 'Cobalt', symbol: 'CO', basePrice: 27500, unit: 'USD/MT', exchange: 'LME', description: 'Cobalt LME' },
    { name: 'Lead', symbol: 'PB', basePrice: 2080, unit: 'USD/MT', exchange: 'LME', description: 'Lead LME' },
    { name: 'Nickel', symbol: 'NI', basePrice: 17850, unit: 'USD/MT', exchange: 'LME', description: 'Nickel LME' },
    { name: 'Tin', symbol: 'SN', basePrice: 32450, unit: 'USD/MT', exchange: 'LME', description: 'Tin LME' },
    { name: 'Zinc', symbol: 'ZINC', basePrice: 2890, unit: 'USD/MT', exchange: 'LME', description: 'Zinc LME' },
    { name: 'Steel Rebar', symbol: 'SRB', basePrice: 585, unit: 'CNY/MT', exchange: 'SHFE', description: 'Steel rebar Shanghai' },
    { name: 'Iron Ore', symbol: 'IRO', basePrice: 118.50, unit: 'USD/MT', exchange: 'DCE', description: 'Iron ore 62% Fe' },
    { name: 'Gold Mini', symbol: 'MGC', basePrice: 2342.50, unit: 'USD/oz', exchange: 'COMEX', description: 'Mini gold futures' },
    { name: 'Silver Mini', symbol: 'SIL', basePrice: 27.85, unit: 'USD/oz', exchange: 'COMEX', description: 'Mini silver futures' },
    { name: 'Copper Mini', symbol: 'QC', basePrice: 4.52, unit: 'USD/lb', exchange: 'COMEX', description: 'Mini copper futures' },
    { name: 'Lithium', symbol: 'LIT', basePrice: 13500, unit: 'USD/MT', exchange: 'OTC', description: 'Lithium carbonate' },
    { name: 'Manganese', symbol: 'MN', basePrice: 4850, unit: 'USD/MT', exchange: 'OTC', description: 'Manganese ore 44%' },
    { name: 'Molybdenum', symbol: 'MO', basePrice: 28.50, unit: 'USD/kg', exchange: 'OTC', description: 'Molybdenum oxide' },
    { name: 'Titanium', symbol: 'TI', basePrice: 8.50, unit: 'USD/kg', exchange: 'OTC', description: 'Titanium sponge' },
    { name: 'Chromium', symbol: 'CR', basePrice: 12.80, unit: 'USD/kg', exchange: 'OTC', description: 'Chromium metal' },
    { name: 'Magnesium', symbol: 'MG', basePrice: 3250, unit: 'USD/MT', exchange: 'OTC', description: 'Magnesium metal' },
    { name: 'Antimony', symbol: 'SB', basePrice: 15.50, unit: 'USD/kg', exchange: 'OTC', description: 'Antimony metal' },
  ],
  agriculture: [
    { name: 'Soybeans', symbol: 'ZS', basePrice: 11.85, unit: 'USD/bu', exchange: 'CBOT', description: 'Soybean futures' },
    { name: 'Corn', symbol: 'ZC', basePrice: 4.52, unit: 'USD/bu', exchange: 'CBOT', description: 'Corn futures' },
    { name: 'Wheat SRW', symbol: 'ZW', basePrice: 6.12, unit: 'USD/bu', exchange: 'CBOT', description: 'Soft red winter wheat' },
    { name: 'Wheat HRW', symbol: 'KW', basePrice: 6.45, unit: 'USD/bu', exchange: 'KCBT', description: 'Hard red winter wheat' },
    { name: 'Wheat Spring', symbol: 'MWE', basePrice: 7.25, unit: 'USD/bu', exchange: 'MGE', description: 'Spring wheat' },
    { name: 'Soybean Oil', symbol: 'ZL', basePrice: 48.25, unit: 'USC/lb', exchange: 'CBOT', description: 'Soybean oil futures' },
    { name: 'Soybean Meal', symbol: 'ZM', basePrice: 335.50, unit: 'USD/st', exchange: 'CBOT', description: 'Soybean meal futures' },
    { name: 'Oats', symbol: 'ZO', basePrice: 3.85, unit: 'USD/bu', exchange: 'CBOT', description: 'Oats futures' },
    { name: 'Rough Rice', symbol: 'ZR', basePrice: 15.25, unit: 'USD/cwt', exchange: 'CBOT', description: 'Rough rice futures' },
    { name: 'Coffee C', symbol: 'KC', basePrice: 185.20, unit: 'USC/lb', exchange: 'ICE', description: 'Coffee C Arabica futures' },
    { name: 'Coffee Robusta', symbol: 'RC', basePrice: 3250, unit: 'USD/MT', exchange: 'ICE', description: 'Robusta coffee futures' },
    { name: 'Sugar #11', symbol: 'SB', basePrice: 24.85, unit: 'USC/lb', exchange: 'ICE', description: 'Sugar #11 world futures' },
    { name: 'Sugar #16', symbol: 'SU', basePrice: 28.50, unit: 'USC/lb', exchange: 'ICE', description: 'Sugar #16 domestic' },
    { name: 'Cotton #2', symbol: 'CT', basePrice: 82.45, unit: 'USC/lb', exchange: 'ICE', description: 'Cotton no. 2 futures' },
    { name: 'Cocoa', symbol: 'CC', basePrice: 9850, unit: 'USD/MT', exchange: 'ICE', description: 'Cocoa futures' },
    { name: 'Orange Juice', symbol: 'OJ', basePrice: 285.50, unit: 'USC/lb', exchange: 'ICE', description: 'FCOJ-A futures' },
    { name: 'Canola', symbol: 'RS', basePrice: 625.50, unit: 'CAD/MT', exchange: 'ICE', description: 'Canola futures' },
    { name: 'Palm Oil', symbol: 'CPO', basePrice: 3850, unit: 'MYR/MT', exchange: 'BMD', description: 'Crude palm oil futures' },
    { name: 'Rubber', symbol: 'RUB', basePrice: 185.50, unit: 'JPY/kg', exchange: 'TOCOM', description: 'Rubber futures' },
    { name: 'Tea', symbol: 'TEA', basePrice: 2.45, unit: 'USD/kg', exchange: 'OTC', description: 'Tea average price' },
    { name: 'Barley', symbol: 'BAR', basePrice: 195.50, unit: 'USD/MT', exchange: 'OTC', description: 'Feed barley' },
    { name: 'Sorghum', symbol: 'SORG', basePrice: 185.25, unit: 'USD/MT', exchange: 'OTC', description: 'Sorghum grain' },
    { name: 'Rapeseed', symbol: 'RAP', basePrice: 425.60, unit: 'EUR/MT', exchange: 'Euronext', description: 'Rapeseed futures' },
    { name: 'Sunflower Oil', symbol: 'SFO', basePrice: 1250, unit: 'USD/MT', exchange: 'OTC', description: 'Sunflower oil price' },
  ],
  industrial: [
    { name: 'Bitumen', symbol: 'BIT', basePrice: 385, unit: 'USD/MT', exchange: 'OTC', description: 'Bitumen price' },
    { name: 'Kraft Pulp', symbol: 'PULP', basePrice: 785, unit: 'USD/MT', exchange: 'OTC', description: 'NBSK pulp' },
    { name: 'Lumber', symbol: 'LBS', basePrice: 548.30, unit: 'USD/MBF', exchange: 'CME', description: 'Random length lumber futures' },
    { name: 'Cement', symbol: 'CEM', basePrice: 85, unit: 'USD/MT', exchange: 'OTC', description: 'Portland cement price' },
    { name: 'Steel HRC', symbol: 'HRC', basePrice: 685, unit: 'USD/MT', exchange: 'LME', description: 'Hot rolled coil steel' },
    { name: 'Steel CRC', symbol: 'CRC', basePrice: 825, unit: 'USD/MT', exchange: 'LME', description: 'Cold rolled coil steel' },
    { name: 'Steel HDG', symbol: 'HDG', basePrice: 895, unit: 'USD/MT', exchange: 'OTC', description: 'Hot dipped galvanized steel' },
    { name: 'Steel Scrap', symbol: 'SCRAP', basePrice: 385, unit: 'USD/MT', exchange: 'OTC', description: 'Steel scrap heavy melting' },
    { name: 'Copper Cathode', symbol: 'CU-CAT', basePrice: 8950, unit: 'USD/MT', exchange: 'LME', description: 'Copper cathode Grade A' },
    { name: 'Aluminum Billet', symbol: 'AL-BIL', basePrice: 2650, unit: 'USD/MT', exchange: 'OTC', description: 'Aluminum billet' },
    { name: 'Zinc SHG', symbol: 'ZN-SHG', basePrice: 2890, unit: 'USD/MT', exchange: 'LME', description: 'Special high grade zinc' },
    { name: 'Nickel Cathode', symbol: 'NI-CAT', basePrice: 17850, unit: 'USD/MT', exchange: 'LME', description: 'Nickel cathode' },
    { name: 'Tin Ingots', symbol: 'SN-ING', basePrice: 32450, unit: 'USD/MT', exchange: 'LME', description: 'Tin ingots Grade A' },
    { name: 'Lead Ingot', symbol: 'PB-ING', basePrice: 2080, unit: 'USD/MT', exchange: 'LME', description: 'Lead ingots' },
    { name: 'Silicon Metal', symbol: 'SI-MET', basePrice: 2450, unit: 'USD/MT', exchange: 'OTC', description: 'Silicon metal 553' },
    { name: 'Ferro Silicon', symbol: 'FE-SI', basePrice: 1250, unit: 'USD/MT', exchange: 'OTC', description: 'Ferro silicon 75%' },
    { name: 'Ferro Chrome', symbol: 'FE-CR', basePrice: 1450, unit: 'USD/MT', exchange: 'OTC', description: 'High carbon ferrochrome' },
    { name: 'Ferro Manganese', symbol: 'FE-MN', basePrice: 985, unit: 'USD/MT', exchange: 'OTC', description: 'High carbon ferromanganese' },
  ],
  livestock: [
    { name: 'Feeder Cattle', symbol: 'GF', basePrice: 245.80, unit: 'USC/lb', exchange: 'CME', description: 'Feeder cattle futures' },
    { name: 'Live Cattle', symbol: 'LE', basePrice: 178.25, unit: 'USC/lb', exchange: 'CME', description: 'Live cattle futures' },
    { name: 'Lean Hogs', symbol: 'HE', basePrice: 78.50, unit: 'USC/lb', exchange: 'CME', description: 'Lean hog futures' },
    { name: 'Pork Bellies', symbol: 'PB', basePrice: 125.50, unit: 'USC/lb', exchange: 'CME', description: 'Frozen pork bellies' },
    { name: 'Salmon', symbol: 'SALM', basePrice: 6.85, unit: 'USD/kg', exchange: 'Nasdaq', description: 'Salmon benchmark price' },
    { name: 'Milk Class III', symbol: 'DC', basePrice: 18.25, unit: 'USD/cwt', exchange: 'CME', description: 'Class III milk futures' },
    { name: 'Milk Class IV', symbol: 'DK', basePrice: 17.85, unit: 'USD/cwt', exchange: 'CME', description: 'Class IV milk futures' },
    { name: 'Butter', symbol: 'CB', basePrice: 2.85, unit: 'USD/lb', exchange: 'CME', description: 'Cash-settled butter' },
    { name: 'Cheddar Cheese', symbol: 'CSC', basePrice: 1.85, unit: 'USD/lb', exchange: 'CME', description: 'Cheddar cheese blocks' },
    { name: 'Dry Whey', symbol: 'DYW', basePrice: 0.58, unit: 'USD/lb', exchange: 'CME', description: 'Dry whey futures' },
    { name: 'Nonfat Dry Milk', symbol: 'NFM', basePrice: 1.25, unit: 'USD/lb', exchange: 'CME', description: 'Nonfat dry milk' },
    { name: 'Eggs', symbol: 'EGG', basePrice: 1.85, unit: 'USD/doz', exchange: 'CME', description: 'Egg futures' },
  ],
  index: [
    { name: 'CRB Index', symbol: 'CRB', basePrice: 312.50, unit: 'USD', exchange: 'NYMEX', description: 'Commodity Research Bureau Index' },
    { name: 'S&P GSCI', symbol: 'SPGSCI', basePrice: 3850.60, unit: 'USD', exchange: 'CME', description: 'S&P Goldman Sachs Commodity Index' },
    { name: 'Bloomberg Commodity', symbol: 'BCOM', basePrice: 98.45, unit: 'USD', exchange: 'Bloomberg', description: 'Bloomberg Commodity Index' },
    { name: 'Rogers International', symbol: 'RICI', basePrice: 3450.25, unit: 'USD', exchange: 'OTC', description: 'Rogers International Commodity Index' },
    { name: 'DBC ETF', symbol: 'DBC', basePrice: 25.85, unit: 'USD', exchange: 'NYSE', description: 'Invesco DB Commodity Index ETF' },
    { name: 'DJP ETF', symbol: 'DJP', basePrice: 42.50, unit: 'USD', exchange: 'NYSE', description: 'iPath Bloomberg Commodity Index' },
    { name: 'Solar Energy Index', symbol: 'SOLAR', basePrice: 85.60, unit: 'USD', exchange: 'OTC', description: 'Solar Energy Index' },
    { name: 'Clean Energy Index', symbol: 'CLEAN', basePrice: 125.80, unit: 'USD', exchange: 'NYSE', description: 'S&P Global Clean Energy Index' },
    { name: 'Uranium Index', symbol: 'URAX', basePrice: 185.25, unit: 'USD', exchange: 'OTC', description: 'Uranium Mining Index' },
    { name: 'Lithium Index', symbol: 'LITX', basePrice: 78.50, unit: 'USD', exchange: 'NYSE', description: 'Global X Lithium Index' },
    { name: 'Copper Miners Index', symbol: 'COPX', basePrice: 45.85, unit: 'USD', exchange: 'NYSE', description: 'S&P Copper Miners Index' },
    { name: 'Gold Miners Index', symbol: 'GDX', basePrice: 38.50, unit: 'USD', exchange: 'NYSE', description: 'VanEck Gold Miners ETF' },
  ],
  electricity: [
    { name: 'UK Electricity', symbol: 'UK-ELEC', basePrice: 85.50, unit: 'GBP/MWh', exchange: 'N2EX', description: 'UK electricity day-ahead' },
    { name: 'Germany Electricity', symbol: 'DE-ELEC', basePrice: 65.25, unit: 'EUR/MWh', exchange: 'EEX', description: 'German electricity baseload' },
    { name: 'France Electricity', symbol: 'FR-ELEC', basePrice: 72.80, unit: 'EUR/MWh', exchange: 'EPEX', description: 'French electricity spot' },
    { name: 'Italy Electricity', symbol: 'IT-ELEC', basePrice: 95.60, unit: 'EUR/MWh', exchange: 'GME', description: 'Italian electricity PUN' },
    { name: 'Spain Electricity', symbol: 'ES-ELEC', basePrice: 68.45, unit: 'EUR/MWh', exchange: 'OMIE', description: 'Spanish electricity pool' },
    { name: 'Netherlands Electricity', symbol: 'NL-ELEC', basePrice: 62.50, unit: 'EUR/MWh', exchange: 'APX', description: 'Dutch electricity spot' },
    { name: 'Belgium Electricity', symbol: 'BE-ELEC', basePrice: 65.80, unit: 'EUR/MWh', exchange: 'BEP', description: 'Belgian electricity spot' },
    { name: 'Nordic Electricity', symbol: 'NORD-EL', basePrice: 45.25, unit: 'EUR/MWh', exchange: 'NordPool', description: 'Nordic system price' },
    { name: 'US PJM Electricity', symbol: 'PJM', basePrice: 42.85, unit: 'USD/MWh', exchange: 'PJM', description: 'PJM Western Hub' },
    { name: 'US CAISO Electricity', symbol: 'CAISO', basePrice: 55.60, unit: 'USD/MWh', exchange: 'CAISO', description: 'California ISO SP15' },
    { name: 'US ERCOT Electricity', symbol: 'ERCOT', basePrice: 38.50, unit: 'USD/MWh', exchange: 'ERCOT', description: 'ERCOT North Hub' },
    { name: 'Japan Electricity', symbol: 'JP-ELEC', basePrice: 12.50, unit: 'JPY/kWh', exchange: 'JEPX', description: 'Japan electricity spot' },
    { name: 'Australia Electricity', symbol: 'AU-ELEC', basePrice: 125.80, unit: 'AUD/MWh', exchange: 'AEMO', description: 'Australian NEM average' },
  ],
};

// ============== STOCK INDEXES ==============
export const indexesData = {
  americas: [
    { name: 'S&P 500', symbol: 'SPX', basePrice: 5325.45, exchange: 'NYSE', country: 'USA', description: 'Standard & Poor\'s 500 Index' },
    { name: 'Dow Jones Industrial', symbol: 'DJI', basePrice: 39150.33, exchange: 'NYSE', country: 'USA', description: 'Dow Jones Industrial Average' },
    { name: 'NASDAQ Composite', symbol: 'IXIC', basePrice: 16825.78, exchange: 'NASDAQ', country: 'USA', description: 'NASDAQ Composite Index' },
    { name: 'NASDAQ 100', symbol: 'NDX', basePrice: 18650.25, exchange: 'NASDAQ', country: 'USA', description: 'NASDAQ 100 Index' },
    { name: 'Russell 2000', symbol: 'RUT', basePrice: 2075.50, exchange: 'NYSE', country: 'USA', description: 'Russell 2000 Small Cap Index' },
    { name: 'Russell 1000', symbol: 'RUI', basePrice: 2950.80, exchange: 'NYSE', country: 'USA', description: 'Russell 1000 Large Cap Index' },
    { name: 'Russell 3000', symbol: 'RUA', basePrice: 2845.60, exchange: 'NYSE', country: 'USA', description: 'Russell 3000 Broad Market Index' },
    { name: 'Wilshire 5000', symbol: 'W5000', basePrice: 48250.50, exchange: 'NYSE', country: 'USA', description: 'Wilshire 5000 Total Market' },
    { name: 'VIX Index', symbol: 'VIX', basePrice: 13.85, exchange: 'CBOE', country: 'USA', description: 'CBOE Volatility Index' },
    { name: 'S&P MidCap 400', symbol: 'MID', basePrice: 2850.75, exchange: 'NYSE', country: 'USA', description: 'S&P MidCap 400 Index' },
    { name: 'S&P SmallCap 600', symbol: 'SML', basePrice: 1250.25, exchange: 'NYSE', country: 'USA', description: 'S&P SmallCap 600 Index' },
    { name: 'PHLX Semiconductor', symbol: 'SOX', basePrice: 5250.80, exchange: 'PHLX', country: 'USA', description: 'PHLX Semiconductor Sector Index' },
    { name: 'NYSE Composite', symbol: 'NYA', basePrice: 16850.50, exchange: 'NYSE', country: 'USA', description: 'NYSE Composite Index' },
    { name: 'Dow Jones Transport', symbol: 'DJT', basePrice: 15850.25, exchange: 'NYSE', country: 'USA', description: 'Dow Jones Transportation Average' },
    { name: 'Dow Jones Utility', symbol: 'DJU', basePrice: 925.50, exchange: 'NYSE', country: 'USA', description: 'Dow Jones Utility Average' },
    { name: 'S&P/TSX Composite', symbol: 'GSPTSE', basePrice: 22250.80, exchange: 'TSX', country: 'Canada', description: 'S&P/TSX Composite Index' },
    { name: 'S&P/TSX 60', symbol: 'TX60', basePrice: 1425.60, exchange: 'TSX', country: 'Canada', description: 'S&P/TSX 60 Index' },
    { name: 'IPC Mexico', symbol: 'MXX', basePrice: 54850.50, exchange: 'BMV', country: 'Mexico', description: 'S&P/BMV IPC Index' },
    { name: 'Bovespa Brazil', symbol: 'BVSP', basePrice: 128450.50, exchange: 'B3', country: 'Brazil', description: 'Ibovespa Brasil Sao Paulo' },
    { name: 'MERVAL Argentina', symbol: 'MERV', basePrice: 1258500, exchange: 'BYMA', country: 'Argentina', description: 'S&P Merval Index' },
    { name: 'IPSA Chile', symbol: 'IPSA', basePrice: 6850.25, exchange: 'SSE', country: 'Chile', description: 'IPSA Selective Stock Index' },
    { name: 'COLCAP Colombia', symbol: 'COLCAP', basePrice: 1425.80, exchange: 'BVC', country: 'Colombia', description: 'COLCAP Index' },
    { name: 'IBC Venezuela', symbol: 'IBVC', basePrice: 485250, exchange: 'BVCC', country: 'Venezuela', description: 'Caracas Stock Exchange Index' },
    { name: 'S&P BVL Peru', symbol: 'SPBLPGPT', basePrice: 525.60, exchange: 'BVL', country: 'Peru', description: 'S&P/BVL Peru General Index' },
  ],
  europe: [
    { name: 'FTSE 100', symbol: 'UKX', basePrice: 8165.25, exchange: 'LSE', country: 'UK', description: 'Financial Times Stock Exchange 100' },
    { name: 'FTSE 250', symbol: 'MCX', basePrice: 20450.80, exchange: 'LSE', country: 'UK', description: 'FTSE 250 Mid Cap Index' },
    { name: 'FTSE 350', symbol: 'NMX', basePrice: 4250.60, exchange: 'LSE', country: 'UK', description: 'FTSE 350 Index' },
    { name: 'DAX 40', symbol: 'DAX', basePrice: 18425.60, exchange: 'XETRA', country: 'Germany', description: 'Deutscher Aktienindex 40' },
    { name: 'MDAX', symbol: 'MDAX', basePrice: 26850.50, exchange: 'XETRA', country: 'Germany', description: 'Mid-Cap DAX Index' },
    { name: 'TecDAX', symbol: 'TECDAX', basePrice: 3450.25, exchange: 'XETRA', country: 'Germany', description: 'Technology DAX Index' },
    { name: 'SDAX', symbol: 'SDAX', basePrice: 14250.80, exchange: 'XETRA', country: 'Germany', description: 'Small-Cap DAX Index' },
    { name: 'CAC 40', symbol: 'CAC', basePrice: 8025.45, exchange: 'Euronext', country: 'France', description: 'Cotation Assistee en Continu 40' },
    { name: 'CAC Mid 60', symbol: 'MIDCAC', basePrice: 4850.60, exchange: 'Euronext', country: 'France', description: 'CAC Mid 60 Index' },
    { name: 'SBF 120', symbol: 'SBF120', basePrice: 5250.80, exchange: 'Euronext', country: 'France', description: 'SBF 120 Index' },
    { name: 'SBF 250', symbol: 'SBF250', basePrice: 3850.25, exchange: 'Euronext', country: 'France', description: 'SBF 250 Index' },
    { name: 'AEX Netherlands', symbol: 'AEX', basePrice: 825.60, exchange: 'Euronext', country: 'Netherlands', description: 'Amsterdam Exchange Index' },
    { name: 'BEL 20 Belgium', symbol: 'BEL20', basePrice: 3850.25, exchange: 'Euronext', country: 'Belgium', description: 'Bloomberg European 20 Index' },
    { name: 'PSI 20 Portugal', symbol: 'PSI20', basePrice: 4250.80, exchange: 'Euronext', country: 'Portugal', description: 'Portuguese Stock Index 20' },
    { name: 'IBEX 35 Spain', symbol: 'IBEX', basePrice: 11250.60, exchange: 'BME', country: 'Spain', description: 'Iberia Index 35' },
    { name: 'FTSE MIB Italy', symbol: 'FTSEMIB', basePrice: 34850.50, exchange: 'Borsa', country: 'Italy', description: 'FTSE Milano Indice di Borsa' },
    { name: 'FTSE Italia Mid Cap', symbol: 'MIDCAP', basePrice: 42580.25, exchange: 'Borsa', country: 'Italy', description: 'FTSE Italia Mid Cap Index' },
    { name: 'SMI Switzerland', symbol: 'SMI', basePrice: 11850.60, exchange: 'SIX', country: 'Switzerland', description: 'Swiss Market Index' },
    { name: 'SPI Switzerland', symbol: 'SPI', basePrice: 14250.80, exchange: 'SIX', country: 'Switzerland', description: 'Swiss Performance Index' },
    { name: 'ATX Austria', symbol: 'ATX', basePrice: 3850.25, exchange: 'WBAG', country: 'Austria', description: 'Austrian Traded Index' },
    { name: 'OBX Norway', symbol: 'OBX', basePrice: 885.60, exchange: 'OSE', country: 'Norway', description: 'Oslo Bors Index' },
    { name: 'OMX Stockholm 30', symbol: 'OMX', basePrice: 2485.50, exchange: 'NASDAQ', country: 'Sweden', description: 'OMX Stockholm 30 Index' },
    { name: 'OMX Helsinki 25', symbol: 'OMXH25', basePrice: 4850.80, exchange: 'NASDAQ', country: 'Finland', description: 'OMX Helsinki 25 Index' },
    { name: 'OMX Copenhagen 20', symbol: 'OMXC20', basePrice: 1850.25, exchange: 'NASDAQ', country: 'Denmark', description: 'OMX Copenhagen 20 Index' },
    { name: 'WIG Poland', symbol: 'WIG', basePrice: 78500.50, exchange: 'WSE', country: 'Poland', description: 'Warsaw Stock Exchange Index' },
    { name: 'BUX Hungary', symbol: 'BUX', basePrice: 62850.25, exchange: 'BET', country: 'Hungary', description: 'Budapest Stock Exchange Index' },
    { name: 'PX Prague', symbol: 'PX', basePrice: 1285.60, exchange: 'PSE', country: 'Czech', description: 'Prague Stock Exchange Index' },
    { name: 'ATHENS Greece', symbol: 'ATHEX', basePrice: 1425.80, exchange: 'ATHEX', country: 'Greece', description: 'Athens Stock Exchange Index' },
    { name: 'ISE Turkey', symbol: 'XU100', basePrice: 9850.50, exchange: 'BIST', country: 'Turkey', description: 'Borsa Istanbul 100 Index' },
    { name: 'MOEX Russia', symbol: 'IMOEX', basePrice: 3250.80, exchange: 'MOEX', country: 'Russia', description: 'Moscow Exchange Index' },
    { name: 'IRL Ireland', symbol: 'ISEQ', basePrice: 8250.60, exchange: 'Euronext', country: 'Ireland', description: 'ISEQ Overall Index' },
    { name: 'LUX Luxembourg', symbol: 'LUXXX', basePrice: 1585.25, exchange: 'LuxSE', country: 'Luxembourg', description: 'LuxX Index' },
  ],
  asia: [
    { name: 'Nikkei 225', symbol: 'NKY', basePrice: 38450.25, exchange: 'TSE', country: 'Japan', description: 'Nikkei Stock Average 225' },
    { name: 'TOPIX', symbol: 'TPX', basePrice: 2685.60, exchange: 'TSE', country: 'Japan', description: 'Tokyo Stock Price Index' },
    { name: 'JASDAQ', symbol: 'JSDAQ', basePrice: 185.50, exchange: 'JASDAQ', country: 'Japan', description: 'JASDAQ Stock Index' },
    { name: 'Mothers Index', symbol: 'MTHR', basePrice: 985.25, exchange: 'TSE', country: 'Japan', description: 'TSE Mothers Index' },
    { name: 'Hang Seng', symbol: 'HSI', basePrice: 18425.80, exchange: 'HKEX', country: 'Hong Kong', description: 'Hang Seng Index' },
    { name: 'Hang Seng Tech', symbol: 'HSTECH', basePrice: 3850.60, exchange: 'HKEX', country: 'Hong Kong', description: 'Hang Seng Tech Index' },
    { name: 'Hang Seng China', symbol: 'HSCEI', basePrice: 6850.50, exchange: 'HKEX', country: 'Hong Kong', description: 'Hang Seng China Enterprises' },
    { name: 'Shanghai Composite', symbol: 'SSEC', basePrice: 3125.45, exchange: 'SSE', country: 'China', description: 'Shanghai Stock Exchange Composite' },
    { name: 'Shanghai 50', symbol: 'SSE50', basePrice: 2485.60, exchange: 'SSE', country: 'China', description: 'SSE 50 Index' },
    { name: 'Shanghai 180', symbol: 'SSE180', basePrice: 8850.25, exchange: 'SSE', country: 'China', description: 'SSE 180 Index' },
    { name: 'Shenzhen Component', symbol: 'SZSE', basePrice: 9850.80, exchange: 'SZSE', country: 'China', description: 'Shenzhen Component Index' },
    { name: 'CSI 300', symbol: 'CSI300', basePrice: 3685.50, exchange: 'CSI', country: 'China', description: 'China Securities Index 300' },
    { name: 'ChiNext', symbol: 'CHINEXT', basePrice: 1850.25, exchange: 'SZSE', country: 'China', description: 'ChiNext Index' },
    { name: 'KOSPI South Korea', symbol: 'KS11', basePrice: 2725.60, exchange: 'KRX', country: 'South Korea', description: 'Korea Composite Stock Price Index' },
    { name: 'KOSDAQ', symbol: 'KQ11', basePrice: 885.80, exchange: 'KRX', country: 'South Korea', description: 'KOSDAQ Index' },
    { name: 'Taiex Taiwan', symbol: 'TWII', basePrice: 20450.50, exchange: 'TWSE', country: 'Taiwan', description: 'Taiwan Weighted Index' },
    { name: 'Taiwan OTC', symbol: 'TWO', basePrice: 185.25, exchange: 'TPEX', country: 'Taiwan', description: 'GreTai Securities Market Index' },
    { name: 'Nifty 50 India', symbol: 'NIFTY50', basePrice: 22450.75, exchange: 'NSE', country: 'India', description: 'Nifty 50 Index' },
    { name: 'Sensex India', symbol: 'BSESN', basePrice: 73850.50, exchange: 'BSE', country: 'India', description: 'BSE SENSEX' },
    { name: 'Nifty Bank', symbol: 'NIFTYBANK', basePrice: 48520.25, exchange: 'NSE', country: 'India', description: 'Nifty Bank Index' },
    { name: 'Nifty IT', symbol: 'NIFTYIT', basePrice: 35850.60, exchange: 'NSE', country: 'India', description: 'Nifty IT Index' },
    { name: 'Straits Times Singapore', symbol: 'STI', basePrice: 3285.80, exchange: 'SGX', country: 'Singapore', description: 'Straits Times Index' },
    { name: 'FTSE Bursa Malaysia', symbol: 'KLSE', basePrice: 1585.50, exchange: 'BURSA', country: 'Malaysia', description: 'FTSE Bursa Malaysia KLCI' },
    { name: 'Jakarta Composite', symbol: 'JKSE', basePrice: 7250.25, exchange: 'IDX', country: 'Indonesia', description: 'Jakarta Composite Index' },
    { name: 'SET Thailand', symbol: 'SET', basePrice: 1385.60, exchange: 'SET', country: 'Thailand', description: 'Stock Exchange of Thailand Index' },
    { name: 'PSEi Philippines', symbol: 'PSEI', basePrice: 6850.80, exchange: 'PSE', country: 'Philippines', description: 'PSE Composite Index' },
    { name: 'VN Index Vietnam', symbol: 'VNINDEX', basePrice: 1285.50, exchange: 'HOSE', country: 'Vietnam', description: 'Vietnam Ho Chi Minh Index' },
    { name: 'KSE 100 Pakistan', symbol: 'KSE100', basePrice: 68500.25, exchange: 'PSX', country: 'Pakistan', description: 'KSE-100 Index' },
    { name: 'Colombo All Share', symbol: 'CSEALL', basePrice: 12850.60, exchange: 'CSE', country: 'Sri Lanka', description: 'Colombo All Share Index' },
    { name: 'DSE Bangladesh', symbol: 'DSEGEN', basePrice: 5850.25, exchange: 'DSE', country: 'Bangladesh', description: 'DSE Broad Index' },
  ],
  oceania: [
    { name: 'S&P/ASX 200', symbol: 'AS51', basePrice: 7825.30, exchange: 'ASX', country: 'Australia', description: 'S&P/ASX 200 Index' },
    { name: 'S&P/ASX 50', symbol: 'AS50', basePrice: 5850.60, exchange: 'ASX', country: 'Australia', description: 'S&P/ASX 50 Index' },
    { name: 'All Ordinaries', symbol: 'XAO', basePrice: 8085.25, exchange: 'ASX', country: 'Australia', description: 'All Ordinaries Index' },
    { name: 'NZX 50 New Zealand', symbol: 'NZSE50', basePrice: 11850.50, exchange: 'NZX', country: 'New Zealand', description: 'S&P/NZX 50 Index' },
    { name: 'NZX All', symbol: 'NZALL', basePrice: 12850.80, exchange: 'NZX', country: 'New Zealand', description: 'S&P/NZX All Index' },
  ],
  africa: [
    { name: 'JSE All Share South Africa', symbol: 'JALSH', basePrice: 75850.50, exchange: 'JSE', country: 'South Africa', description: 'JSE All Share Index' },
    { name: 'JSE Top 40', symbol: 'JTOPI', basePrice: 68520.25, exchange: 'JSE', country: 'South Africa', description: 'JSE Top 40 Index' },
    { name: 'EGX 30 Egypt', symbol: 'EGX30', basePrice: 19850.60, exchange: 'EGX', country: 'Egypt', description: 'EGX 30 Index' },
    { name: 'NSE 20 Kenya', symbol: 'NSE20', basePrice: 1850.25, exchange: 'NSE', country: 'Kenya', description: 'NSE 20 Share Index' },
    { name: 'NGX Nigeria', symbol: 'NGSE', basePrice: 52850.50, exchange: 'NGX', country: 'Nigeria', description: 'NGX All Share Index' },
    { name: 'Casablanca Morocco', symbol: 'MASI', basePrice: 12850.80, exchange: 'CSE', country: 'Morocco', description: 'Moroccan All Shares Index' },
  ],
  middleEast: [
    { name: 'Tadawul Saudi Arabia', symbol: 'TASI', basePrice: 12850.50, exchange: 'TADAWUL', country: 'Saudi Arabia', description: 'Tadawul All Share Index' },
    { name: 'DFM UAE', symbol: 'DFMGI', basePrice: 4850.25, exchange: 'DFM', country: 'UAE', description: 'Dubai Financial Market Index' },
    { name: 'ADX UAE', symbol: 'ADI', basePrice: 9850.60, exchange: 'ADX', country: 'UAE', description: 'Abu Dhabi Securities Index' },
    { name: 'Qatar Exchange', symbol: 'DSM', basePrice: 10250.80, exchange: 'QE', country: 'Qatar', description: 'Qatar Stock Exchange Index' },
    { name: 'Bourse Kuwait', symbol: 'KWSE', basePrice: 7850.25, exchange: 'KSE', country: 'Kuwait', description: 'Kuwait Stock Exchange Index' },
    { name: 'Bahrain Bourse', symbol: 'BHSE', basePrice: 1985.50, exchange: 'BHB', country: 'Bahrain', description: 'Bahrain All Share Index' },
    { name: 'Muscat Oman', symbol: 'MSM30', basePrice: 4850.60, exchange: 'MSM', country: 'Oman', description: 'MSM 30 Index' },
    { name: 'Tel Aviv Israel', symbol: 'TA125', basePrice: 1850.25, exchange: 'TASE', country: 'Israel', description: 'TA-125 Index' },
  ],
};

// ============== STOCKS/SHARES ==============
export const stocksData = {
  technology: [
    { name: 'Apple Inc.', symbol: 'AAPL', basePrice: 189.45, sector: 'Technology', marketCap: '2.95T', exchange: 'NASDAQ' },
    { name: 'Microsoft Corp.', symbol: 'MSFT', basePrice: 425.60, sector: 'Technology', marketCap: '3.15T', exchange: 'NASDAQ' },
    { name: 'Alphabet Inc. Class A', symbol: 'GOOGL', basePrice: 172.80, sector: 'Technology', marketCap: '2.15T', exchange: 'NASDAQ' },
    { name: 'Alphabet Inc. Class C', symbol: 'GOOG', basePrice: 175.25, sector: 'Technology', marketCap: '2.18T', exchange: 'NASDAQ' },
    { name: 'Amazon.com Inc.', symbol: 'AMZN', basePrice: 182.35, sector: 'Consumer Cyclical', marketCap: '1.92T', exchange: 'NASDAQ' },
    { name: 'NVIDIA Corp.', symbol: 'NVDA', basePrice: 1225.80, sector: 'Technology', marketCap: '3.02T', exchange: 'NASDAQ' },
    { name: 'Meta Platforms Inc.', symbol: 'META', basePrice: 498.25, sector: 'Technology', marketCap: '1.28T', exchange: 'NASDAQ' },
    { name: 'Tesla Inc.', symbol: 'TSLA', basePrice: 248.50, sector: 'Consumer Cyclical', marketCap: '785B', exchange: 'NASDAQ' },
    { name: 'Broadcom Inc.', symbol: 'AVGO', basePrice: 1425.60, sector: 'Technology', marketCap: '658B', exchange: 'NASDAQ' },
    { name: 'Oracle Corp.', symbol: 'ORCL', basePrice: 125.85, sector: 'Technology', marketCap: '345B', exchange: 'NYSE' },
    { name: 'Adobe Inc.', symbol: 'ADBE', basePrice: 575.25, sector: 'Technology', marketCap: '252B', exchange: 'NASDAQ' },
    { name: 'Salesforce Inc.', symbol: 'CRM', basePrice: 278.90, sector: 'Technology', marketCap: '268B', exchange: 'NYSE' },
    { name: 'Cisco Systems', symbol: 'CSCO', basePrice: 48.65, sector: 'Technology', marketCap: '198B', exchange: 'NASDAQ' },
    { name: 'Intel Corp.', symbol: 'INTC', basePrice: 32.45, sector: 'Technology', marketCap: '138B', exchange: 'NASDAQ' },
    { name: 'Advanced Micro Devices', symbol: 'AMD', basePrice: 158.75, sector: 'Technology', marketCap: '256B', exchange: 'NASDAQ' },
    { name: 'Qualcomm Inc.', symbol: 'QCOM', basePrice: 168.50, sector: 'Technology', marketCap: '188B', exchange: 'NASDAQ' },
    { name: 'Texas Instruments', symbol: 'TXN', basePrice: 172.35, sector: 'Technology', marketCap: '158B', exchange: 'NASDAQ' },
    { name: 'IBM Corp.', symbol: 'IBM', basePrice: 175.80, sector: 'Technology', marketCap: '162B', exchange: 'NYSE' },
    { name: 'Netflix Inc.', symbol: 'NFLX', basePrice: 628.45, sector: 'Communication', marketCap: '272B', exchange: 'NASDAQ' },
    { name: 'PayPal Holdings', symbol: 'PYPL', basePrice: 62.85, sector: 'Technology', marketCap: '65B', exchange: 'NASDAQ' },
    { name: 'ServiceNow Inc.', symbol: 'NOW', basePrice: 725.50, sector: 'Technology', marketCap: '152B', exchange: 'NYSE' },
    { name: 'Intuit Inc.', symbol: 'INTU', basePrice: 625.80, sector: 'Technology', marketCap: '175B', exchange: 'NASDAQ' },
    { name: 'Snowflake Inc.', symbol: 'SNOW', basePrice: 158.25, sector: 'Technology', marketCap: '52B', exchange: 'NYSE' },
    { name: 'Palantir Technologies', symbol: 'PLTR', basePrice: 22.85, sector: 'Technology', marketCap: '52B', exchange: 'NYSE' },
    { name: 'CrowdStrike Holdings', symbol: 'CRWD', basePrice: 318.50, sector: 'Technology', marketCap: '75B', exchange: 'NASDAQ' },
    { name: 'Atlassian Corp.', symbol: 'TEAM', basePrice: 185.60, sector: 'Technology', marketCap: '48B', exchange: 'NASDAQ' },
    { name: 'Uber Technologies', symbol: 'UBER', basePrice: 72.45, sector: 'Technology', marketCap: '152B', exchange: 'NYSE' },
    { name: 'Airbnb Inc.', symbol: 'ABNB', basePrice: 158.75, sector: 'Technology', marketCap: '68B', exchange: 'NASDAQ' },
    { name: 'DoorDash Inc.', symbol: 'DASH', basePrice: 125.80, sector: 'Technology', marketCap: '52B', exchange: 'NYSE' },
    { name: 'Zoom Video', symbol: 'ZM', basePrice: 68.25, sector: 'Technology', marketCap: '21B', exchange: 'NASDAQ' },
  ],
  healthcare: [
    { name: 'Johnson & Johnson', symbol: 'JNJ', basePrice: 158.25, sector: 'Healthcare', marketCap: '382B', exchange: 'NYSE' },
    { name: 'UnitedHealth Group', symbol: 'UNH', basePrice: 485.60, sector: 'Healthcare', marketCap: '448B', exchange: 'NYSE' },
    { name: 'Eli Lilly & Co.', symbol: 'LLY', basePrice: 785.25, sector: 'Healthcare', marketCap: '742B', exchange: 'NYSE' },
    { name: 'Pfizer Inc.', symbol: 'PFE', basePrice: 28.45, sector: 'Healthcare', marketCap: '158B', exchange: 'NYSE' },
    { name: 'Merck & Co.', symbol: 'MRK', basePrice: 125.80, sector: 'Healthcare', marketCap: '318B', exchange: 'NYSE' },
    { name: 'AbbVie Inc.', symbol: 'ABBV', basePrice: 158.75, sector: 'Healthcare', marketCap: '282B', exchange: 'NYSE' },
    { name: 'Novo Nordisk ADR', symbol: 'NVO', basePrice: 135.50, sector: 'Healthcare', marketCap: '598B', exchange: 'NYSE' },
    { name: 'Thermo Fisher Scientific', symbol: 'TMO', basePrice: 548.60, sector: 'Healthcare', marketCap: '212B', exchange: 'NYSE' },
    { name: 'Abbott Laboratories', symbol: 'ABT', basePrice: 108.25, sector: 'Healthcare', marketCap: '188B', exchange: 'NYSE' },
    { name: 'Medtronic PLC', symbol: 'MDT', basePrice: 88.45, sector: 'Healthcare', marketCap: '118B', exchange: 'NYSE' },
    { name: 'AstraZeneca ADR', symbol: 'AZN', basePrice: 78.65, sector: 'Healthcare', marketCap: '248B', exchange: 'NASDAQ' },
    { name: 'Amgen Inc.', symbol: 'AMGN', basePrice: 312.50, sector: 'Healthcare', marketCap: '168B', exchange: 'NASDAQ' },
    { name: 'Moderna Inc.', symbol: 'MRNA', basePrice: 98.75, sector: 'Healthcare', marketCap: '38B', exchange: 'NASDAQ' },
    { name: 'Gilead Sciences', symbol: 'GILD', basePrice: 72.85, sector: 'Healthcare', marketCap: '92B', exchange: 'NASDAQ' },
    { name: 'Regeneron Pharma', symbol: 'REGN', basePrice: 985.60, sector: 'Healthcare', marketCap: '108B', exchange: 'NASDAQ' },
    { name: 'Vertex Pharmaceuticals', symbol: 'VRTX', basePrice: 425.80, sector: 'Healthcare', marketCap: '108B', exchange: 'NASDAQ' },
    { name: 'Bristol-Myers Squibb', symbol: 'BMY', basePrice: 52.45, sector: 'Healthcare', marketCap: '108B', exchange: 'NYSE' },
    { name: 'Danaher Corp.', symbol: 'DHR', basePrice: 248.60, sector: 'Healthcare', marketCap: '182B', exchange: 'NYSE' },
    { name: 'CVS Health Corp.', symbol: 'CVS', basePrice: 58.25, sector: 'Healthcare', marketCap: '75B', exchange: 'NYSE' },
    { name: 'HUMANA Inc.', symbol: 'HUM', basePrice: 358.75, sector: 'Healthcare', marketCap: '45B', exchange: 'NYSE' },
  ],
  financial: [
    { name: 'Berkshire Hathaway B', symbol: 'BRK.B', basePrice: 425.60, sector: 'Financial', marketCap: '882B', exchange: 'NYSE' },
    { name: 'JPMorgan Chase & Co.', symbol: 'JPM', basePrice: 198.45, sector: 'Financial', marketCap: '568B', exchange: 'NYSE' },
    { name: 'Visa Inc.', symbol: 'V', basePrice: 278.90, sector: 'Financial', marketCap: '568B', exchange: 'NYSE' },
    { name: 'Mastercard Inc.', symbol: 'MA', basePrice: 458.75, sector: 'Financial', marketCap: '428B', exchange: 'NYSE' },
    { name: 'Bank of America', symbol: 'BAC', basePrice: 38.65, sector: 'Financial', marketCap: '305B', exchange: 'NYSE' },
    { name: 'Wells Fargo & Co.', symbol: 'WFC', basePrice: 58.25, sector: 'Financial', marketCap: '218B', exchange: 'NYSE' },
    { name: 'Goldman Sachs', symbol: 'GS', basePrice: 385.60, sector: 'Financial', marketCap: '125B', exchange: 'NYSE' },
    { name: 'Morgan Stanley', symbol: 'MS', basePrice: 92.85, sector: 'Financial', marketCap: '152B', exchange: 'NYSE' },
    { name: 'American Express', symbol: 'AXP', basePrice: 218.50, sector: 'Financial', marketCap: '158B', exchange: 'NYSE' },
    { name: 'BlackRock Inc.', symbol: 'BLK', basePrice: 812.25, sector: 'Financial', marketCap: '122B', exchange: 'NYSE' },
    { name: 'Charles Schwab', symbol: 'SCHW', basePrice: 72.45, sector: 'Financial', marketCap: '128B', exchange: 'NYSE' },
    { name: 'Citigroup Inc.', symbol: 'C', basePrice: 58.75, sector: 'Financial', marketCap: '112B', exchange: 'NYSE' },
    { name: 'US Bancorp', symbol: 'USB', basePrice: 42.85, sector: 'Financial', marketCap: '65B', exchange: 'NYSE' },
    { name: 'PNC Financial', symbol: 'PNC', basePrice: 158.60, sector: 'Financial', marketCap: '62B', exchange: 'NYSE' },
    { name: 'Capital One', symbol: 'COF', basePrice: 142.25, sector: 'Financial', marketCap: '55B', exchange: 'NYSE' },
    { name: 'S&P Global Inc.', symbol: 'SPGI', basePrice: 485.80, sector: 'Financial', marketCap: '142B', exchange: 'NYSE' },
    { name: 'Moody\'s Corp.', symbol: 'MCO', basePrice: 425.50, sector: 'Financial', marketCap: '78B', exchange: 'NYSE' },
    { name: 'Intercontinental Exchange', symbol: 'ICE', basePrice: 128.75, sector: 'Financial', marketCap: '72B', exchange: 'NYSE' },
    { name: 'CME Group', symbol: 'CME', basePrice: 198.60, sector: 'Financial', marketCap: '72B', exchange: 'NASDAQ' },
    { name: 'Nasdaq Inc.', symbol: 'NDAQ', basePrice: 58.25, sector: 'Financial', marketCap: '35B', exchange: 'NASDAQ' },
  ],
  energy: [
    { name: 'Exxon Mobil Corp.', symbol: 'XOM', basePrice: 112.85, sector: 'Energy', marketCap: '448B', exchange: 'NYSE' },
    { name: 'Chevron Corp.', symbol: 'CVX', basePrice: 155.40, sector: 'Energy', marketCap: '285B', exchange: 'NYSE' },
    { name: 'ConocoPhillips', symbol: 'COP', basePrice: 118.50, sector: 'Energy', marketCap: '138B', exchange: 'NYSE' },
    { name: 'EOG Resources', symbol: 'EOG', basePrice: 125.80, sector: 'Energy', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Schlumberger Ltd.', symbol: 'SLB', basePrice: 52.45, sector: 'Energy', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Shell plc ADR', symbol: 'SHEL', basePrice: 68.75, sector: 'Energy', marketCap: '218B', exchange: 'NYSE' },
    { name: 'BP plc ADR', symbol: 'BP', basePrice: 38.25, sector: 'Energy', marketCap: '98B', exchange: 'NYSE' },
    { name: 'TotalEnergies ADR', symbol: 'TTE', basePrice: 68.50, sector: 'Energy', marketCap: '158B', exchange: 'NYSE' },
    { name: 'Pioneer Natural', symbol: 'PXD', basePrice: 258.60, sector: 'Energy', marketCap: '58B', exchange: 'NYSE' },
    { name: 'Occidental Petroleum', symbol: 'OXY', basePrice: 62.85, sector: 'Energy', marketCap: '55B', exchange: 'NYSE' },
    { name: 'Diamondback Energy', symbol: 'FANG', basePrice: 178.25, sector: 'Energy', marketCap: '32B', exchange: 'NASDAQ' },
    { name: 'Valero Energy', symbol: 'VLO', basePrice: 148.60, sector: 'Energy', marketCap: '48B', exchange: 'NYSE' },
    { name: 'Marathon Petroleum', symbol: 'MPC', basePrice: 168.75, sector: 'Energy', marketCap: '58B', exchange: 'NYSE' },
    { name: 'Enterprise Products', symbol: 'EPD', basePrice: 28.45, sector: 'Energy', marketCap: '62B', exchange: 'NYSE' },
    { name: 'Kinder Morgan', symbol: 'KMI', basePrice: 18.25, sector: 'Energy', marketCap: '42B', exchange: 'NYSE' },
    { name: 'Williams Companies', symbol: 'WMB', basePrice: 42.85, sector: 'Energy', marketCap: '52B', exchange: 'NYSE' },
    { name: 'Halliburton Co.', symbol: 'HAL', basePrice: 38.60, sector: 'Energy', marketCap: '35B', exchange: 'NYSE' },
    { name: 'Baker Hughes Co.', symbol: 'BKR', basePrice: 35.25, sector: 'Energy', marketCap: '35B', exchange: 'NASDAQ' },
    { name: 'NextEra Energy', symbol: 'NEE', basePrice: 72.50, sector: 'Utilities', marketCap: '148B', exchange: 'NYSE' },
    { name: 'Duke Energy Corp.', symbol: 'DUK', basePrice: 98.75, sector: 'Utilities', marketCap: '78B', exchange: 'NYSE' },
  ],
  consumer: [
    { name: 'Walmart Inc.', symbol: 'WMT', basePrice: 165.80, sector: 'Consumer Defensive', marketCap: '448B', exchange: 'NYSE' },
    { name: 'Procter & Gamble', symbol: 'PG', basePrice: 165.80, sector: 'Consumer Defensive', marketCap: '388B', exchange: 'NYSE' },
    { name: 'Coca-Cola Co.', symbol: 'KO', basePrice: 62.80, sector: 'Consumer Defensive', marketCap: '272B', exchange: 'NYSE' },
    { name: 'PepsiCo Inc.', symbol: 'PEP', basePrice: 172.35, sector: 'Consumer Defensive', marketCap: '238B', exchange: 'NASDAQ' },
    { name: 'Costco Wholesale', symbol: 'COST', basePrice: 785.60, sector: 'Consumer Defensive', marketCap: '348B', exchange: 'NASDAQ' },
    { name: 'Home Depot Inc.', symbol: 'HD', basePrice: 345.25, sector: 'Consumer Cyclical', marketCap: '345B', exchange: 'NYSE' },
    { name: 'McDonald\'s Corp.', symbol: 'MCD', basePrice: 278.50, sector: 'Consumer Cyclical', marketCap: '198B', exchange: 'NYSE' },
    { name: 'Nike Inc.', symbol: 'NKE', basePrice: 98.75, sector: 'Consumer Cyclical', marketCap: '148B', exchange: 'NYSE' },
    { name: 'Starbucks Corp.', symbol: 'SBUX', basePrice: 78.85, sector: 'Consumer Cyclical', marketCap: '88B', exchange: 'NASDAQ' },
    { name: 'Target Corp.', symbol: 'TGT', basePrice: 158.60, sector: 'Consumer Defensive', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Lowe\'s Companies', symbol: 'LOW', basePrice: 238.50, sector: 'Consumer Cyclical', marketCap: '135B', exchange: 'NYSE' },
    { name: 'TJX Companies', symbol: 'TJX', basePrice: 98.25, sector: 'Consumer Cyclical', marketCap: '118B', exchange: 'NYSE' },
    { name: 'Colgate-Palmolive', symbol: 'CL', basePrice: 88.75, sector: 'Consumer Defensive', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Mondelez International', symbol: 'MDLZ', basePrice: 72.50, sector: 'Consumer Defensive', marketCap: '98B', exchange: 'NASDAQ' },
    { name: 'Philip Morris', symbol: 'PM', basePrice: 98.60, sector: 'Consumer Defensive', marketCap: '152B', exchange: 'NYSE' },
    { name: 'Altria Group', symbol: 'MO', basePrice: 42.85, sector: 'Consumer Defensive', marketCap: '78B', exchange: 'NYSE' },
    { name: 'Ford Motor Co.', symbol: 'F', basePrice: 12.45, sector: 'Consumer Cyclical', marketCap: '48B', exchange: 'NYSE' },
    { name: 'General Motors', symbol: 'GM', basePrice: 45.80, sector: 'Consumer Cyclical', marketCap: '52B', exchange: 'NYSE' },
    { name: 'Marriott International', symbol: 'MAR', basePrice: 248.25, sector: 'Consumer Cyclical', marketCap: '72B', exchange: 'NASDAQ' },
    { name: 'Hilton Worldwide', symbol: 'HLT', basePrice: 212.60, sector: 'Consumer Cyclical', marketCap: '58B', exchange: 'NYSE' },
  ],
  industrial: [
    { name: 'Honeywell International', symbol: 'HON', basePrice: 198.50, sector: 'Industrial', marketCap: '128B', exchange: 'NASDAQ' },
    { name: 'United Parcel Service', symbol: 'UPS', basePrice: 142.25, sector: 'Industrial', marketCap: '118B', exchange: 'NYSE' },
    { name: 'Caterpillar Inc.', symbol: 'CAT', basePrice: 338.60, sector: 'Industrial', marketCap: '168B', exchange: 'NYSE' },
    { name: 'Deere & Company', symbol: 'DE', basePrice: 385.75, sector: 'Industrial', marketCap: '108B', exchange: 'NYSE' },
    { name: '3M Company', symbol: 'MMM', basePrice: 98.45, sector: 'Industrial', marketCap: '55B', exchange: 'NYSE' },
    { name: 'Boeing Co.', symbol: 'BA', basePrice: 178.60, sector: 'Industrial', marketCap: '108B', exchange: 'NYSE' },
    { name: 'General Electric', symbol: 'GE', basePrice: 162.85, sector: 'Industrial', marketCap: '178B', exchange: 'NYSE' },
    { name: 'RTX Corp.', symbol: 'RTX', basePrice: 98.25, sector: 'Industrial', marketCap: '132B', exchange: 'NYSE' },
    { name: 'Lockheed Martin', symbol: 'LMT', basePrice: 458.50, sector: 'Industrial', marketCap: '108B', exchange: 'NYSE' },
    { name: 'Union Pacific', symbol: 'UNP', basePrice: 238.60, sector: 'Industrial', marketCap: '142B', exchange: 'NYSE' },
    { name: 'CSX Corp.', symbol: 'CSX', basePrice: 35.85, sector: 'Industrial', marketCap: '72B', exchange: 'NASDAQ' },
    { name: 'Norfolk Southern', symbol: 'NSC', basePrice: 248.25, sector: 'Industrial', marketCap: '58B', exchange: 'NYSE' },
    { name: 'FedEx Corp.', symbol: 'FDX', basePrice: 285.60, sector: 'Industrial', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Delta Air Lines', symbol: 'DAL', basePrice: 48.75, sector: 'Industrial', marketCap: '32B', exchange: 'NYSE' },
    { name: 'United Airlines', symbol: 'UAL', basePrice: 52.45, sector: 'Industrial', marketCap: '18B', exchange: 'NASDAQ' },
    { name: 'American Airlines', symbol: 'AAL', basePrice: 14.85, sector: 'Industrial', marketCap: '9.8B', exchange: 'NASDAQ' },
    { name: 'Parker-Hannifin', symbol: 'PH', basePrice: 518.25, sector: 'Industrial', marketCap: '72B', exchange: 'NYSE' },
    { name: 'Eaton Corp.', symbol: 'ETN', basePrice: 318.60, sector: 'Industrial', marketCap: '128B', exchange: 'NYSE' },
    { name: 'Illinois Tool Works', symbol: 'ITW', basePrice: 258.75, sector: 'Industrial', marketCap: '78B', exchange: 'NYSE' },
    { name: 'Linde plc', symbol: 'LIN', basePrice: 458.50, sector: 'Basic Materials', marketCap: '218B', exchange: 'NYSE' },
  ],
};

// ============== CURRENCIES ==============
export const currenciesData = {
  major: [
    { name: 'EUR/USD', symbol: 'EURUSD', basePrice: 1.0845, baseCurrency: 'EUR', quoteCurrency: 'USD', description: 'Euro to US Dollar' },
    { name: 'GBP/USD', symbol: 'GBPUSD', basePrice: 1.2658, baseCurrency: 'GBP', quoteCurrency: 'USD', description: 'British Pound to US Dollar' },
    { name: 'USD/JPY', symbol: 'USDJPY', basePrice: 154.85, baseCurrency: 'USD', quoteCurrency: 'JPY', description: 'US Dollar to Japanese Yen' },
    { name: 'USD/CHF', symbol: 'USDCHF', basePrice: 0.8975, baseCurrency: 'USD', quoteCurrency: 'CHF', description: 'US Dollar to Swiss Franc' },
    { name: 'AUD/USD', symbol: 'AUDUSD', basePrice: 0.6542, baseCurrency: 'AUD', quoteCurrency: 'USD', description: 'Australian Dollar to US Dollar' },
    { name: 'USD/CAD', symbol: 'USDCAD', basePrice: 1.3685, baseCurrency: 'USD', quoteCurrency: 'CAD', description: 'US Dollar to Canadian Dollar' },
    { name: 'NZD/USD', symbol: 'NZDUSD', basePrice: 0.5978, baseCurrency: 'NZD', quoteCurrency: 'USD', description: 'New Zealand Dollar to US Dollar' },
  ],
  cross: [
    { name: 'EUR/GBP', symbol: 'EURGBP', basePrice: 0.8572, baseCurrency: 'EUR', quoteCurrency: 'GBP', description: 'Euro to British Pound' },
    { name: 'EUR/JPY', symbol: 'EURJPY', basePrice: 167.85, baseCurrency: 'EUR', quoteCurrency: 'JPY', description: 'Euro to Japanese Yen' },
    { name: 'GBP/JPY', symbol: 'GBPJPY', basePrice: 195.78, baseCurrency: 'GBP', quoteCurrency: 'JPY', description: 'British Pound to Japanese Yen' },
    { name: 'AUD/JPY', symbol: 'AUDJPY', basePrice: 101.35, baseCurrency: 'AUD', quoteCurrency: 'JPY', description: 'Australian Dollar to Japanese Yen' },
    { name: 'EUR/AUD', symbol: 'EURAUD', basePrice: 1.6578, baseCurrency: 'EUR', quoteCurrency: 'AUD', description: 'Euro to Australian Dollar' },
    { name: 'EUR/CAD', symbol: 'EURCAD', basePrice: 1.4835, baseCurrency: 'EUR', quoteCurrency: 'CAD', description: 'Euro to Canadian Dollar' },
    { name: 'EUR/CHF', symbol: 'EURCHF', basePrice: 0.9735, baseCurrency: 'EUR', quoteCurrency: 'CHF', description: 'Euro to Swiss Franc' },
    { name: 'GBP/CHF', symbol: 'GBPCHF', basePrice: 1.1358, baseCurrency: 'GBP', quoteCurrency: 'CHF', description: 'British Pound to Swiss Franc' },
    { name: 'AUD/CAD', symbol: 'AUDCAD', basePrice: 0.8952, baseCurrency: 'AUD', quoteCurrency: 'CAD', description: 'Australian Dollar to Canadian Dollar' },
    { name: 'AUD/NZD', symbol: 'AUDNZD', basePrice: 1.0945, baseCurrency: 'AUD', quoteCurrency: 'NZD', description: 'Australian Dollar to NZ Dollar' },
    { name: 'CAD/JPY', symbol: 'CADJPY', basePrice: 113.15, baseCurrency: 'CAD', quoteCurrency: 'JPY', description: 'Canadian Dollar to Japanese Yen' },
    { name: 'CHF/JPY', symbol: 'CHFJPY', basePrice: 172.45, baseCurrency: 'CHF', quoteCurrency: 'JPY', description: 'Swiss Franc to Japanese Yen' },
    { name: 'NZD/JPY', symbol: 'NZDJPY', basePrice: 92.58, baseCurrency: 'NZD', quoteCurrency: 'JPY', description: 'NZ Dollar to Japanese Yen' },
  ],
  emerging: [
    { name: 'USD/CNY', symbol: 'USDCNY', basePrice: 7.2456, baseCurrency: 'USD', quoteCurrency: 'CNY', description: 'US Dollar to Chinese Yuan' },
    { name: 'USD/INR', symbol: 'USDINR', basePrice: 83.45, baseCurrency: 'USD', quoteCurrency: 'INR', description: 'US Dollar to Indian Rupee' },
    { name: 'USD/SGD', symbol: 'USDSGD', basePrice: 1.3485, baseCurrency: 'USD', quoteCurrency: 'SGD', description: 'US Dollar to Singapore Dollar' },
    { name: 'USD/HKD', symbol: 'USDHKD', basePrice: 7.8245, baseCurrency: 'USD', quoteCurrency: 'HKD', description: 'US Dollar to Hong Kong Dollar' },
    { name: 'USD/KRW', symbol: 'USDKRW', basePrice: 1378.50, baseCurrency: 'USD', quoteCurrency: 'KRW', description: 'US Dollar to South Korean Won' },
    { name: 'USD/MXN', symbol: 'USDMXN', basePrice: 17.25, baseCurrency: 'USD', quoteCurrency: 'MXN', description: 'US Dollar to Mexican Peso' },
    { name: 'USD/BRL', symbol: 'USDBRL', basePrice: 4.9856, baseCurrency: 'USD', quoteCurrency: 'BRL', description: 'US Dollar to Brazilian Real' },
    { name: 'USD/ZAR', symbol: 'USDZAR', basePrice: 18.85, baseCurrency: 'USD', quoteCurrency: 'ZAR', description: 'US Dollar to South African Rand' },
    { name: 'USD/TRY', symbol: 'USDTRY', basePrice: 32.45, baseCurrency: 'USD', quoteCurrency: 'TRY', description: 'US Dollar to Turkish Lira' },
    { name: 'USD/RUB', symbol: 'USDRUB', basePrice: 92.50, baseCurrency: 'USD', quoteCurrency: 'RUB', description: 'US Dollar to Russian Ruble' },
    { name: 'USD/PLN', symbol: 'USDPLN', basePrice: 4.05, baseCurrency: 'USD', quoteCurrency: 'PLN', description: 'US Dollar to Polish Zloty' },
    { name: 'USD/THB', symbol: 'USDTHB', basePrice: 36.15, baseCurrency: 'USD', quoteCurrency: 'THB', description: 'US Dollar to Thai Baht' },
    { name: 'USD/IDR', symbol: 'USDIDR', basePrice: 15850, baseCurrency: 'USD', quoteCurrency: 'IDR', description: 'US Dollar to Indonesian Rupiah' },
    { name: 'USD/MYR', symbol: 'USDMYR', basePrice: 4.72, baseCurrency: 'USD', quoteCurrency: 'MYR', description: 'US Dollar to Malaysian Ringgit' },
    { name: 'USD/PHP', symbol: 'USDPHP', basePrice: 56.25, baseCurrency: 'USD', quoteCurrency: 'PHP', description: 'US Dollar to Philippine Peso' },
    { name: 'USD/TWD', symbol: 'USDTWD', basePrice: 32.15, baseCurrency: 'USD', quoteCurrency: 'TWD', description: 'US Dollar to Taiwan Dollar' },
    { name: 'USD/CLP', symbol: 'USDCLP', basePrice: 925.50, baseCurrency: 'USD', quoteCurrency: 'CLP', description: 'US Dollar to Chilean Peso' },
    { name: 'USD/COP', symbol: 'USDCOP', basePrice: 3985, baseCurrency: 'USD', quoteCurrency: 'COP', description: 'US Dollar to Colombian Peso' },
    { name: 'USD/PEN', symbol: 'USDPEN', basePrice: 3.72, baseCurrency: 'USD', quoteCurrency: 'PEN', description: 'US Dollar to Peruvian Sol' },
    { name: 'USD/EGP', symbol: 'USDEGP', basePrice: 30.85, baseCurrency: 'USD', quoteCurrency: 'EGP', description: 'US Dollar to Egyptian Pound' },
    { name: 'USD/SAR', symbol: 'USDSAR', basePrice: 3.75, baseCurrency: 'USD', quoteCurrency: 'SAR', description: 'US Dollar to Saudi Riyal' },
    { name: 'USD/AED', symbol: 'USDAED', basePrice: 3.6725, baseCurrency: 'USD', quoteCurrency: 'AED', description: 'US Dollar to UAE Dirham' },
    { name: 'USD/ILS', symbol: 'USDILS', basePrice: 3.68, baseCurrency: 'USD', quoteCurrency: 'ILS', description: 'US Dollar to Israeli Shekel' },
    { name: 'USD/NGN', symbol: 'USDNGN', basePrice: 1450, baseCurrency: 'USD', quoteCurrency: 'NGN', description: 'US Dollar to Nigerian Naira' },
    { name: 'USD/BDT', symbol: 'USDBDT', basePrice: 118.50, baseCurrency: 'USD', quoteCurrency: 'BDT', description: 'US Dollar to Bangladeshi Taka' },
    { name: 'USD/PKR', symbol: 'USDPKR', basePrice: 278.50, baseCurrency: 'USD', quoteCurrency: 'PKR', description: 'US Dollar to Pakistani Rupee' },
    { name: 'USD/VND', symbol: 'USDVND', basePrice: 25450, baseCurrency: 'USD', quoteCurrency: 'VND', description: 'US Dollar to Vietnamese Dong' },
    { name: 'USD/CZK', symbol: 'USDCZK', basePrice: 23.15, baseCurrency: 'USD', quoteCurrency: 'CZK', description: 'US Dollar to Czech Koruna' },
    { name: 'USD/HUF', symbol: 'USDHUF', basePrice: 358.50, baseCurrency: 'USD', quoteCurrency: 'HUF', description: 'US Dollar to Hungarian Forint' },
    { name: 'USD/SEK', symbol: 'USDSEK', basePrice: 10.85, baseCurrency: 'USD', quoteCurrency: 'SEK', description: 'US Dollar to Swedish Krona' },
    { name: 'USD/NOK', symbol: 'USDNOK', basePrice: 10.72, baseCurrency: 'USD', quoteCurrency: 'NOK', description: 'US Dollar to Norwegian Krone' },
    { name: 'USD/DKK', symbol: 'USDDKK', basePrice: 6.95, baseCurrency: 'USD', quoteCurrency: 'DKK', description: 'US Dollar to Danish Krone' },
  ],
};

// ============== CRYPTOCURRENCIES ==============
export const cryptoData = [
  { name: 'Bitcoin', symbol: 'BTC', basePrice: 67850.45, marketCap: '1.32T', change24h: 2.45, volume: '28.5B', description: 'Bitcoin - The first cryptocurrency' },
  { name: 'Ethereum', symbol: 'ETH', basePrice: 3485.60, marketCap: '418B', change24h: 1.82, volume: '15.2B', description: 'Ethereum - Smart contract platform' },
  { name: 'BNB', symbol: 'BNB', basePrice: 598.25, marketCap: '88B', change24h: 1.25, volume: '1.2B', description: 'BNB - Binance ecosystem token' },
  { name: 'Solana', symbol: 'SOL', basePrice: 145.80, marketCap: '68B', change24h: 3.85, volume: '2.8B', description: 'Solana - High-speed blockchain' },
  { name: 'XRP', symbol: 'XRP', basePrice: 0.5245, marketCap: '28B', change24h: 0.85, volume: '1.5B', description: 'XRP - Cross-border payments' },
  { name: 'Cardano', symbol: 'ADA', basePrice: 0.4585, marketCap: '16B', change24h: 1.15, volume: '385M', description: 'Cardano - Proof-of-stake blockchain' },
  { name: 'Dogecoin', symbol: 'DOGE', basePrice: 0.1542, marketCap: '22B', change24h: 2.25, volume: '825M', description: 'Dogecoin - Meme cryptocurrency' },
  { name: 'Avalanche', symbol: 'AVAX', basePrice: 35.85, marketCap: '14B', change24h: 2.45, volume: '425M', description: 'Avalanche - High-performance L1' },
  { name: 'Polkadot', symbol: 'DOT', basePrice: 7.25, marketCap: '10B', change24h: 1.65, volume: '285M', description: 'Polkadot - Multi-chain protocol' },
  { name: 'Chainlink', symbol: 'LINK', basePrice: 14.58, marketCap: '8.5B', change24h: 2.15, volume: '385M', description: 'Chainlink - Oracle network' },
  { name: 'Toncoin', symbol: 'TON', basePrice: 7.45, marketCap: '18B', change24h: 1.85, volume: '125M', description: 'Toncoin - Telegram ecosystem' },
  { name: 'Shiba Inu', symbol: 'SHIB', basePrice: 0.00002485, marketCap: '14B', change24h: 3.25, volume: '425M', description: 'Shiba Inu - Meme cryptocurrency' },
  { name: 'Polygon', symbol: 'MATIC', basePrice: 0.5845, marketCap: '5.2B', change24h: 1.45, volume: '185M', description: 'Polygon - Ethereum L2 scaling' },
  { name: 'Litecoin', symbol: 'LTC', basePrice: 84.25, marketCap: '6.2B', change24h: 1.15, volume: '285M', description: 'Litecoin - Silver to Bitcoin gold' },
  { name: 'Bitcoin Cash', symbol: 'BCH', basePrice: 485.60, marketCap: '9.5B', change24h: 1.85, volume: '185M', description: 'Bitcoin Cash - Bitcoin fork' },
  { name: 'Uniswap', symbol: 'UNI', basePrice: 7.85, marketCap: '5.8B', change24h: 2.15, volume: '125M', description: 'Uniswap - DEX governance token' },
  { name: 'Stellar', symbol: 'XLM', basePrice: 0.1125, marketCap: '3.2B', change24h: 1.25, volume: '85M', description: 'Stellar - Payment network' },
  { name: 'Cosmos', symbol: 'ATOM', basePrice: 8.45, marketCap: '3.2B', change24h: 2.35, volume: '125M', description: 'Cosmos - Internet of blockchains' },
  { name: 'Monero', symbol: 'XMR', basePrice: 125.80, marketCap: '2.3B', change24h: 1.45, volume: '45M', description: 'Monero - Privacy cryptocurrency' },
  { name: 'Ethereum Classic', symbol: 'ETC', basePrice: 28.45, marketCap: '4.2B', change24h: 1.85, volume: '125M', description: 'Ethereum Classic - Original Ethereum' },
  { name: 'Filecoin', symbol: 'FIL', basePrice: 5.85, marketCap: '3.2B', change24h: 2.45, volume: '85M', description: 'Filecoin - Decentralized storage' },
  { name: 'Aptos', symbol: 'APT', basePrice: 9.85, marketCap: '4.5B', change24h: 3.15, volume: '185M', description: 'Aptos - Layer 1 blockchain' },
  { name: 'Arbitrum', symbol: 'ARB', basePrice: 1.15, marketCap: '4.5B', change24h: 2.85, volume: '285M', description: 'Arbitrum - Ethereum L2' },
  { name: 'Optimism', symbol: 'OP', basePrice: 2.45, marketCap: '2.8B', change24h: 2.15, volume: '125M', description: 'Optimism - Ethereum L2' },
  { name: 'Near Protocol', symbol: 'NEAR', basePrice: 7.15, marketCap: '7.8B', change24h: 2.65, volume: '285M', description: 'Near Protocol - Sharded blockchain' },
  { name: 'Aave', symbol: 'AAVE', basePrice: 95.85, marketCap: '1.4B', change24h: 1.85, volume: '85M', description: 'Aave - DeFi lending protocol' },
  { name: 'Maker', symbol: 'MKR', basePrice: 2850.50, marketCap: '2.5B', change24h: 0.85, volume: '45M', description: 'Maker - DAI stablecoin protocol' },
  { name: 'Render', symbol: 'RNDR', basePrice: 10.85, marketCap: '4.2B', change24h: 4.25, volume: '185M', description: 'Render - GPU rendering network' },
  { name: 'Injective', symbol: 'INJ', basePrice: 25.85, marketCap: '2.4B', change24h: 3.45, volume: '125M', description: 'Injective - DeFi blockchain' },
  { name: 'The Graph', symbol: 'GRT', basePrice: 0.285, marketCap: '2.6B', change24h: 1.95, volume: '85M', description: 'The Graph - Indexing protocol' },
];

// ============== BONDS ==============
export const bondsData = [
  { name: 'US 10-Year Treasury', symbol: 'US10Y', basePrice: 4.285, country: 'USA', maturity: '10Y', description: 'United States 10-Year Treasury Note Yield' },
  { name: 'US 2-Year Treasury', symbol: 'US2Y', basePrice: 4.645, country: 'USA', maturity: '2Y', description: 'United States 2-Year Treasury Note Yield' },
  { name: 'US 5-Year Treasury', symbol: 'US5Y', basePrice: 4.385, country: 'USA', maturity: '5Y', description: 'United States 5-Year Treasury Note Yield' },
  { name: 'US 30-Year Treasury', symbol: 'US30Y', basePrice: 4.425, country: 'USA', maturity: '30Y', description: 'United States 30-Year Treasury Bond Yield' },
  { name: 'US 3-Month Treasury', symbol: 'US3M', basePrice: 5.25, country: 'USA', maturity: '3M', description: 'United States 3-Month Treasury Bill' },
  { name: 'US 6-Month Treasury', symbol: 'US6M', basePrice: 5.15, country: 'USA', maturity: '6M', description: 'United States 6-Month Treasury Bill' },
  { name: 'US 1-Year Treasury', symbol: 'US1Y', basePrice: 4.95, country: 'USA', maturity: '1Y', description: 'United States 1-Year Treasury Bill' },
  { name: 'US 3-Year Treasury', symbol: 'US3Y', basePrice: 4.45, country: 'USA', maturity: '3Y', description: 'United States 3-Year Treasury Note Yield' },
  { name: 'US 7-Year Treasury', symbol: 'US7Y', basePrice: 4.35, country: 'USA', maturity: '7Y', description: 'United States 7-Year Treasury Note Yield' },
  { name: 'US 20-Year Treasury', symbol: 'US20Y', basePrice: 4.55, country: 'USA', maturity: '20Y', description: 'United States 20-Year Treasury Bond Yield' },
  { name: 'Germany 10-Year Bund', symbol: 'DE10Y', basePrice: 2.485, country: 'Germany', maturity: '10Y', description: 'German 10-Year Government Bond Yield' },
  { name: 'Germany 2-Year Bund', symbol: 'DE2Y', basePrice: 2.85, country: 'Germany', maturity: '2Y', description: 'German 2-Year Government Bond Yield' },
  { name: 'Germany 5-Year Bund', symbol: 'DE5Y', basePrice: 2.55, country: 'Germany', maturity: '5Y', description: 'German 5-Year Government Bond Yield' },
  { name: 'Germany 30-Year Bund', symbol: 'DE30Y', basePrice: 2.65, country: 'Germany', maturity: '30Y', description: 'German 30-Year Government Bond Yield' },
  { name: 'UK 10-Year Gilt', symbol: 'UK10Y', basePrice: 4.125, country: 'UK', maturity: '10Y', description: 'United Kingdom 10-Year Gilt Yield' },
  { name: 'UK 2-Year Gilt', symbol: 'UK2Y', basePrice: 4.55, country: 'UK', maturity: '2Y', description: 'United Kingdom 2-Year Gilt Yield' },
  { name: 'UK 5-Year Gilt', symbol: 'UK5Y', basePrice: 4.25, country: 'UK', maturity: '5Y', description: 'United Kingdom 5-Year Gilt Yield' },
  { name: 'UK 30-Year Gilt', symbol: 'UK30Y', basePrice: 4.45, country: 'UK', maturity: '30Y', description: 'United Kingdom 30-Year Gilt Yield' },
  { name: 'Japan 10-Year JGB', symbol: 'JP10Y', basePrice: 1.025, country: 'Japan', maturity: '10Y', description: 'Japanese 10-Year Government Bond Yield' },
  { name: 'Japan 2-Year JGB', symbol: 'JP2Y', basePrice: 0.45, country: 'Japan', maturity: '2Y', description: 'Japanese 2-Year Government Bond Yield' },
  { name: 'Japan 5-Year JGB', symbol: 'JP5Y', basePrice: 0.65, country: 'Japan', maturity: '5Y', description: 'Japanese 5-Year Government Bond Yield' },
  { name: 'Japan 30-Year JGB', symbol: 'JP30Y', basePrice: 2.15, country: 'Japan', maturity: '30Y', description: 'Japanese 30-Year Government Bond Yield' },
  { name: 'France 10-Year OAT', symbol: 'FR10Y', basePrice: 2.985, country: 'France', maturity: '10Y', description: 'French 10-Year Government Bond Yield' },
  { name: 'France 2-Year OAT', symbol: 'FR2Y', basePrice: 3.25, country: 'France', maturity: '2Y', description: 'French 2-Year Government Bond Yield' },
  { name: 'Italy 10-Year BTP', symbol: 'IT10Y', basePrice: 3.785, country: 'Italy', maturity: '10Y', description: 'Italian 10-Year Government Bond Yield' },
  { name: 'Italy 2-Year BTP', symbol: 'IT2Y', basePrice: 3.45, country: 'Italy', maturity: '2Y', description: 'Italian 2-Year Government Bond Yield' },
  { name: 'Spain 10-Year Bond', symbol: 'ES10Y', basePrice: 3.285, country: 'Spain', maturity: '10Y', description: 'Spanish 10-Year Government Bond Yield' },
  { name: 'Spain 2-Year Bond', symbol: 'ES2Y', basePrice: 3.15, country: 'Spain', maturity: '2Y', description: 'Spanish 2-Year Government Bond Yield' },
  { name: 'Canada 10-Year Bond', symbol: 'CA10Y', basePrice: 3.585, country: 'Canada', maturity: '10Y', description: 'Canadian 10-Year Government Bond Yield' },
  { name: 'Canada 2-Year Bond', symbol: 'CA2Y', basePrice: 4.05, country: 'Canada', maturity: '2Y', description: 'Canadian 2-Year Government Bond Yield' },
  { name: 'Australia 10-Year Bond', symbol: 'AU10Y', basePrice: 4.185, country: 'Australia', maturity: '10Y', description: 'Australian 10-Year Government Bond Yield' },
  { name: 'Australia 2-Year Bond', symbol: 'AU2Y', basePrice: 4.25, country: 'Australia', maturity: '2Y', description: 'Australian 2-Year Government Bond Yield' },
  { name: 'China 10-Year Bond', symbol: 'CN10Y', basePrice: 2.325, country: 'China', maturity: '10Y', description: 'Chinese 10-Year Government Bond Yield' },
  { name: 'China 2-Year Bond', symbol: 'CN2Y', basePrice: 1.95, country: 'China', maturity: '2Y', description: 'Chinese 2-Year Government Bond Yield' },
  { name: 'India 10-Year Bond', symbol: 'IN10Y', basePrice: 7.085, country: 'India', maturity: '10Y', description: 'Indian 10-Year Government Bond Yield' },
  { name: 'India 2-Year Bond', symbol: 'IN2Y', basePrice: 6.95, country: 'India', maturity: '2Y', description: 'Indian 2-Year Government Bond Yield' },
  { name: 'Brazil 10-Year Bond', symbol: 'BR10Y', basePrice: 12.485, country: 'Brazil', maturity: '10Y', description: 'Brazilian 10-Year Government Bond Yield' },
  { name: 'Mexico 10-Year Bond', symbol: 'MX10Y', basePrice: 10.25, country: 'Mexico', maturity: '10Y', description: 'Mexican 10-Year Government Bond Yield' },
  { name: 'South Africa 10-Year', symbol: 'ZA10Y', basePrice: 12.15, country: 'South Africa', maturity: '10Y', description: 'South African 10-Year Government Bond Yield' },
  { name: 'Russia 10-Year OFZ', symbol: 'RU10Y', basePrice: 14.85, country: 'Russia', maturity: '10Y', description: 'Russian 10-Year OFZ Bond Yield' },
  { name: 'South Korea 10-Year', symbol: 'KR10Y', basePrice: 3.45, country: 'South Korea', maturity: '10Y', description: 'South Korean 10-Year Government Bond Yield' },
  { name: 'Turkey 10-Year Bond', symbol: 'TR10Y', basePrice: 28.50, country: 'Turkey', maturity: '10Y', description: 'Turkish 10-Year Government Bond Yield' },
];

// ============== FREIGHT INDICES ==============
export const freightData = [
  { name: 'Baltic Dry Index (BDI)', symbol: 'BDI', basePrice: 1847, category: 'Dry Bulk', description: 'Baltic Dry Index - Dry bulk shipping rates' },
  { name: 'Baltic Capesize Index', symbol: 'BCI', basePrice: 2540, category: 'Dry Bulk', description: 'Capesize vessel rates (180,000+ DWT)' },
  { name: 'Baltic Panamax Index', symbol: 'BPI', basePrice: 1685, category: 'Dry Bulk', description: 'Panamax vessel rates (60,000-80,000 DWT)' },
  { name: 'Baltic Supramax Index', symbol: 'BSI', basePrice: 1425, category: 'Dry Bulk', description: 'Supramax vessel rates (50,000-60,000 DWT)' },
  { name: 'Baltic Handysize Index', symbol: 'BHSI', basePrice: 985, category: 'Dry Bulk', description: 'Handysize vessel rates (15,000-35,000 DWT)' },
  { name: 'FBX Global Container Index', symbol: 'FBX', basePrice: 3920, category: 'Container', description: 'FBX Global Container Freight Index' },
  { name: 'FBX01 Asia-US WC', symbol: 'FBX01', basePrice: 4850, category: 'Container', description: 'Asia to US West Coast' },
  { name: 'FBX02 Asia-US EC', symbol: 'FBX02', basePrice: 6850, category: 'Container', description: 'Asia to US East Coast' },
  { name: 'FBX03 Asia-Europe', symbol: 'FBX03', basePrice: 5250, category: 'Container', description: 'Asia to North Europe' },
  { name: 'FBX04 Asia-Med', symbol: 'FBX04', basePrice: 5850, category: 'Container', description: 'Asia to Mediterranean' },
  { name: 'Shanghai Container Index', symbol: 'SCFI', basePrice: 2156, category: 'Container', description: 'Shanghai Containerized Freight Index' },
  { name: 'World Container Index', symbol: 'WCI', basePrice: 2890, category: 'Container', description: 'Drewry World Container Index' },
  { name: 'Container Trade Statistics', symbol: 'CTS', basePrice: 3250, category: 'Container', description: 'Container Trade Statistics Index' },
  { name: 'Baltic Clean Tanker Index', symbol: 'BCTI', basePrice: 1285, category: 'Tanker', description: 'Clean tanker rates (refined products)' },
  { name: 'Baltic Dirty Tanker Index', symbol: 'BDTI', basePrice: 1425, category: 'Tanker', description: 'Dirty tanker rates (crude oil)' },
  { name: 'VLCC Rates', symbol: 'VLCC', basePrice: 45, category: 'Tanker', description: 'Very Large Crude Carrier rates ($/day 000s)' },
  { name: 'Suezmax Rates', symbol: 'SUEZ', basePrice: 38, category: 'Tanker', description: 'Suezmax tanker rates ($/day 000s)' },
  { name: 'Aframax Rates', symbol: 'AFRA', basePrice: 28, category: 'Tanker', description: 'Aframax tanker rates ($/day 000s)' },
  { name: 'MR Tanker Rates', symbol: 'MR', basePrice: 22, category: 'Tanker', description: 'Medium Range product tanker ($/day 000s)' },
  { name: 'LNG Shipping Rates', symbol: 'LNG', basePrice: 125, category: 'Gas', description: 'LNG carrier spot rates ($/day 000s)' },
  { name: 'LPG Shipping Rates', symbol: 'LPG', basePrice: 45, category: 'Gas', description: 'LPG carrier rates ($/day 000s)' },
  { name: 'Clarksea Index', symbol: 'CLARK', basePrice: 24580, category: 'Earnings', description: 'Clarkson average earnings index' },
  { name: 'Newcastlemax Rates', symbol: 'NCM', basePrice: 18500, category: 'Dry Bulk', description: 'Newcastlemax daily earnings ($)' },
  { name: 'Kamsarmax Rates', symbol: 'KMX', basePrice: 14500, category: 'Dry Bulk', description: 'Kamsarmax daily earnings ($)' },
  { name: 'Ultramax Rates', symbol: 'UMX', basePrice: 12500, category: 'Dry Bulk', description: 'Ultramax daily earnings ($)' },
];

// Helper function to generate historical data
export function generateHistoricalData(basePrice: number, days: number): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const today = new Date();
  let currentPrice = basePrice * 0.95;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    const dailyChange = (Math.random() - 0.48) * 0.02;
    currentPrice = currentPrice * (1 + dailyChange);
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentPrice * 100) / 100,
    });
  }
  
  return data;
}

// Helper function to generate market item with full data
export function generateMarketItem(
  baseData: { name: string; symbol: string; basePrice: number; [key: string]: any },
  category: string,
  index: number
): any {
  const randomChange = (Math.random() - 0.5) * 4;
  const price = baseData.basePrice * (1 + randomChange / 100);
  const change = baseData.basePrice * (randomChange / 100);
  
  return {
    id: `${category}-${index}`,
    name: baseData.name,
    symbol: baseData.symbol,
    price: baseData.basePrice < 0.01 ? Math.round(price * 1000000) / 1000000 : Math.round(price * 100) / 100,
    change: baseData.basePrice < 0.01 ? Math.round(change * 1000000) / 1000000 : Math.round(change * 100) / 100,
    changePercent: Math.round(randomChange * 100) / 100,
    lastUpdated: new Date().toISOString(),
    category,
    description: baseData.description || `${baseData.name} market data`,
    historicalData: generateHistoricalData(baseData.basePrice, 90),
    dayHigh: Math.round(price * 1.01 * 100) / 100,
    dayLow: Math.round(price * 0.99 * 100) / 100,
    week52High: Math.round(baseData.basePrice * 1.25 * 100) / 100,
    week52Low: Math.round(baseData.basePrice * 0.75 * 100) / 100,
    previousClose: Math.round(baseData.basePrice * 100) / 100,
    open: Math.round(baseData.basePrice * (1 + (Math.random() - 0.5) * 0.01) * 100) / 100,
    volume: Math.floor(Math.random() * 1000000) + 100000,
    marketCap: baseData.marketCap,
    ...baseData,
  };
}

// Get all commodities with subcategory
export function getAllCommodities(): any[] {
  const result: any[] = [];
  let globalIndex = 0;
  
  // Process each category and add subcategory info
  Object.entries(commoditiesData).forEach(([subCategory, items]) => {
    items.forEach((item: any) => {
      const marketItem = generateMarketItem(item, subCategory, globalIndex);
      marketItem.mainCategory = 'commodities';
      marketItem.subCategory = subCategory;
      result.push(marketItem);
      globalIndex++;
    });
  });
  
  return result;
}

// Get all indexes with subcategory
export function getAllIndexes(): any[] {
  const result: any[] = [];
  let globalIndex = 0;
  
  Object.entries(indexesData).forEach(([region, items]) => {
    items.forEach((item: any) => {
      const marketItem = generateMarketItem(item, region, globalIndex);
      marketItem.mainCategory = 'indexes';
      marketItem.region = region;
      result.push(marketItem);
      globalIndex++;
    });
  });
  
  return result;
}

// Get all stocks with sector
export function getAllStocks(): any[] {
  const result: any[] = [];
  let globalIndex = 0;
  
  Object.entries(stocksData).forEach(([sector, items]) => {
    items.forEach((item: any) => {
      const marketItem = generateMarketItem(item, sector, globalIndex);
      marketItem.mainCategory = 'shares';
      marketItem.sector = sector;
      result.push(marketItem);
      globalIndex++;
    });
  });
  
  return result;
}

// Get all currencies with type
export function getAllCurrencies(): any[] {
  const result: any[] = [];
  let globalIndex = 0;
  
  Object.entries(currenciesData).forEach(([type, items]) => {
    items.forEach((item: any) => {
      const marketItem = generateMarketItem(item, type, globalIndex);
      marketItem.mainCategory = 'currencies';
      marketItem.type = type;
      result.push(marketItem);
      globalIndex++;
    });
  });
  
  return result;
}

// Get all crypto
export function getAllCrypto(): any[] {
  return cryptoData.map((item, index) => {
    const marketItem = generateMarketItem(item, 'crypto', index);
    marketItem.mainCategory = 'crypto';
    return marketItem;
  });
}

// Get all bonds
export function getAllBonds(): any[] {
  return bondsData.map((item, index) => {
    const marketItem = generateMarketItem(item, 'bonds', index);
    marketItem.mainCategory = 'bonds';
    return marketItem;
  });
}

// Get all freight indices
export function getAllFreight(): any[] {
  return freightData.map((item, index) => {
    const marketItem = generateMarketItem(item, item.category || 'freight', index);
    marketItem.mainCategory = 'freight';
    return marketItem;
  });
}

// Get commodities by category
export function getCommoditiesByCategory(category: string): any[] {
  const categoryData = commoditiesData[category as keyof typeof commoditiesData];
  if (!categoryData) return [];
  return categoryData.map((item, index) => generateMarketItem(item, 'commodities', index));
}

// Get indexes by region
export function getIndexesByRegion(region: string): any[] {
  const regionData = indexesData[region as keyof typeof indexesData];
  if (!regionData) return [];
  return regionData.map((item, index) => generateMarketItem(item, 'indexes', index));
}

// Get stocks by sector
export function getStocksBySector(sector: string): any[] {
  const sectorData = stocksData[sector as keyof typeof stocksData];
  if (!sectorData) return [];
  return sectorData.map((item, index) => generateMarketItem(item, 'shares', index));
}

// Get currencies by type
export function getCurrenciesByType(type: string): any[] {
  const typeData = currenciesData[type as keyof typeof currenciesData];
  if (!typeData) return [];
  return typeData.map((item, index) => generateMarketItem(item, 'currencies', index));
}
