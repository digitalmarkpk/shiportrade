/**
 * Document Print Utilities
 * Universal A4 print system for all trade documents
 * Compliant with ISO 216 A4 paper size (210mm × 297mm)
 */

// A4 dimensions in mm and pixels (at 96 DPI)
export const A4_DIMENSIONS = {
  widthMm: 210,
  heightMm: 297,
  widthPx: 794, // 210mm at 96 DPI
  heightPx: 1123, // 297mm at 96 DPI
  marginTopMm: 15,
  marginBottomMm: 15,
  marginLeftMm: 15,
  marginRightMm: 15,
  dpi: 96,
};

// Print CSS for A4 documents
export const printStyles = `
@media print {
  /* Reset all print styles */
  @page {
    size: A4 portrait;
    margin: 15mm;
  }

  /* Hide non-print elements */
  body * {
    visibility: hidden;
  }

  /* Show only print area */
  .print-area,
  .print-area * {
    visibility: visible;
  }

  /* Position print area */
  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    padding: 0;
    margin: 0;
    background: white !important;
    color: black !important;
  }

  /* Document styling for print */
  .print-document {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.4;
    color: #000;
    background: #fff;
    max-width: 180mm;
    margin: 0 auto;
  }

  .print-document h1 {
    font-size: 18pt;
    margin-bottom: 8pt;
    color: #000;
  }

  .print-document h2 {
    font-size: 14pt;
    margin-bottom: 6pt;
    color: #000;
  }

  .print-document h3 {
    font-size: 12pt;
    margin-bottom: 4pt;
    color: #000;
  }

  .print-document table {
    width: 100%;
    border-collapse: collapse;
    font-size: 10pt;
  }

  .print-document th,
  .print-document td {
    border: 1px solid #333;
    padding: 6pt 8pt;
    text-align: left;
  }

  .print-document th {
    background: #f0f0f0 !important;
    font-weight: 600;
  }

  .print-document .text-right {
    text-align: right;
  }

  .print-document .text-center {
    text-align: center;
  }

  /* Avoid page breaks inside */
  .print-document .no-break {
    page-break-inside: avoid;
  }

  /* Page break helpers */
  .print-document .page-break {
    page-break-before: always;
  }

  /* Header styling */
  .print-document .doc-header {
    border-bottom: 2px solid #000;
    padding-bottom: 12pt;
    margin-bottom: 16pt;
    text-align: center;
  }

  /* Footer styling */
  .print-document .doc-footer {
    margin-top: 24pt;
    padding-top: 12pt;
    border-top: 1px solid #ccc;
    font-size: 9pt;
    text-align: center;
    color: #666;
  }

  /* Signature area */
  .print-document .signature-area {
    margin-top: 30pt;
    display: flex;
    justify-content: space-between;
  }

  .print-document .signature-box {
    width: 45%;
    text-align: center;
  }

  .print-document .signature-line {
    border-top: 1px solid #000;
    margin-top: 40pt;
    padding-top: 6pt;
  }

  /* Force colors for print */
  .print-document * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Remove shadows and gradients */
  .print-document .shadow,
  .print-document [class*="shadow-"] {
    box-shadow: none !important;
  }

  .print-document [class*="gradient"] {
    background: none !important;
  }
}

/* Preview mode styling (on screen) */
.document-preview {
  background: white;
  color: #1f2937;
  max-width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  padding: 15mm;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  font-family: 'Segoe UI', Arial, sans-serif;
}

.document-preview h1 {
  font-size: 18pt;
  margin-bottom: 8pt;
}

.document-preview table {
  width: 100%;
  border-collapse: collapse;
}

.document-preview th,
.document-preview td {
  border: 1px solid #333;
  padding: 6pt 8pt;
}
`;

// Generate unique document ID
export function generateDocumentId(prefix: string = 'DOC'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
}

// Format date for documents (ISO format preferred for international trade)
export function formatDocumentDate(date: Date | string, format: 'iso' | 'long' | 'short' = 'iso'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  switch (format) {
    case 'iso':
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    case 'long':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'short':
      return d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    default:
      return d.toISOString().split('T')[0];
  }
}

// Format currency for documents
export function formatDocumentCurrency(
  amount: number, 
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Format number with thousand separators
export function formatDocumentNumber(
  value: number,
  decimals: number = 2,
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

// Convert number to words (for amounts in legal documents)
export function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (num === 0) return 'Zero';
  if (num < 0) return 'Minus ' + numberToWords(Math.abs(num));
  
  const formatHundreds = (n: number): string => {
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + ones[n % 10] : '');
    return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + formatHundreds(n % 100) : '');
  };
  
  const formatGroup = (n: number, scale: string): string => {
    if (n === 0) return '';
    return formatHundreds(n) + (scale ? ' ' + scale : '');
  };
  
  let result = '';
  const scales = ['', 'Thousand', 'Million', 'Billion', 'Trillion'];
  
  for (let i = scales.length - 1; i >= 0; i--) {
    const divisor = Math.pow(1000, i);
    const group = Math.floor(num / divisor);
    if (group > 0) {
      result += formatGroup(group, scales[i]) + ' ';
      num %= divisor;
    }
  }
  
  return result.trim();
}

// Currency amount to words
export function currencyToWords(amount: number, currency: string = 'USD'): string {
  const dollars = Math.floor(amount);
  const cents = Math.round((amount - dollars) * 100);
  
  const currencyNames: Record<string, { main: string; sub: string }> = {
    USD: { main: 'US Dollars', sub: 'Cents' },
    EUR: { main: 'Euros', sub: 'Cents' },
    GBP: { main: 'British Pounds', sub: 'Pence' },
    CNY: { main: 'Chinese Yuan', sub: 'Fen' },
    JPY: { main: 'Japanese Yen', sub: 'Sen' },
    HKD: { main: 'Hong Kong Dollars', sub: 'Cents' },
    SGD: { main: 'Singapore Dollars', sub: 'Cents' },
    AUD: { main: 'Australian Dollars', sub: 'Cents' },
    AED: { main: 'UAE Dirhams', sub: 'Fils' },
    INR: { main: 'Indian Rupees', sub: 'Paise' },
  };
  
  const names = currencyNames[currency] || { main: currency, sub: 'Cents' };
  
  let result = numberToWords(dollars) + ' ' + names.main;
  if (cents > 0) {
    result += ' and ' + numberToWords(cents) + ' ' + names.sub;
  }
  result += ' Only';
  
  return result;
}

// Print document to PDF (triggers browser print dialog)
export function printDocument(title?: string): void {
  // Set document title for PDF filename
  const originalTitle = document.title;
  if (title) {
    document.title = title;
  }
  
  // Trigger print
  window.print();
  
  // Restore original title
  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}

// Download document as HTML (for later conversion)
export function downloadAsHtml(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Incoterms 2020 definitions (ICC Official)
export const INCOTERMS_2020: Record<string, { name: string; description: string; group: 'E' | 'F' | 'C' | 'D' }> = {
  EXW: { name: 'Ex Works', description: 'Seller delivers at their premises', group: 'E' },
  FCA: { name: 'Free Carrier', description: 'Seller delivers to carrier at named place', group: 'F' },
  FAS: { name: 'Free Alongside Ship', description: 'Seller delivers alongside vessel', group: 'F' },
  FOB: { name: 'Free On Board', description: 'Seller delivers on board vessel', group: 'F' },
  CFR: { name: 'Cost and Freight', description: 'Seller pays freight to destination port', group: 'C' },
  CIF: { name: 'Cost, Insurance and Freight', description: 'Seller pays freight and insurance', group: 'C' },
  CPT: { name: 'Carriage Paid To', description: 'Seller pays carriage to destination', group: 'C' },
  CIP: { name: 'Carriage and Insurance Paid To', description: 'Seller pays carriage and insurance', group: 'C' },
  DAP: { name: 'Delivered at Place', description: 'Seller delivers at named destination', group: 'D' },
  DPU: { name: 'Delivered at Place Unloaded', description: 'Seller delivers unloaded at destination', group: 'D' },
  DDP: { name: 'Delivered Duty Paid', description: 'Seller delivers with duties paid', group: 'D' },
};

// Payment terms definitions
export const PAYMENT_TERMS: Record<string, { name: string; description: string }> = {
  'T/T': { name: 'Telegraphic Transfer', description: 'Wire transfer payment' },
  'L/C': { name: 'Letter of Credit', description: 'Bank guarantee payment' },
  'D/P': { name: 'Documents against Payment', description: 'Documents released on payment' },
  'D/A': { name: 'Documents against Acceptance', description: 'Documents released on acceptance' },
  'O/A': { name: 'Open Account', description: 'Payment after delivery' },
  'CAD': { name: 'Cash Against Documents', description: 'Payment against documents' },
  'M/T': { name: 'Mail Transfer', description: 'Payment by mail' },
  'D/D': { name: 'Demand Draft', description: 'Bank draft payment' },
};

// Container types (ISO 668)
export const CONTAINER_TYPES: Record<string, { name: string; internalLength: number; internalWidth: number; internalHeight: number; capacity: number }> = {
  '20GP': { name: "20' General Purpose", internalLength: 5.9, internalWidth: 2.35, internalHeight: 2.39, capacity: 33.2 },
  '40GP': { name: "40' General Purpose", internalLength: 12.03, internalWidth: 2.35, internalHeight: 2.39, capacity: 67.7 },
  '40HC': { name: "40' High Cube", internalLength: 12.03, internalWidth: 2.35, internalHeight: 2.69, capacity: 76.3 },
  '45HC': { name: "45' High Cube", internalLength: 13.56, internalWidth: 2.35, internalHeight: 2.69, capacity: 86.0 },
  '20RF': { name: "20' Refrigerated", internalLength: 5.42, internalWidth: 2.26, internalHeight: 2.24, capacity: 27.5 },
  '40RF': { name: "40' Refrigerated", internalLength: 11.58, internalWidth: 2.26, internalHeight: 2.25, capacity: 58.9 },
  '20OT': { name: "20' Open Top", internalLength: 5.9, internalWidth: 2.35, internalHeight: 2.38, capacity: 33.0 },
  '40OT': { name: "40' Open Top", internalLength: 12.03, internalWidth: 2.35, internalHeight: 2.38, capacity: 67.3 },
  '20FR': { name: "20' Flat Rack", internalLength: 5.66, internalWidth: 2.43, internalHeight: 2.33, capacity: 32.0 },
  '40FR': { name: "40' Flat Rack", internalLength: 11.76, internalWidth: 2.43, internalHeight: 1.95, capacity: 55.8 },
  '20TK': { name: "20' Tank", internalLength: 5.9, internalWidth: 2.35, internalHeight: 2.39, capacity: 21.0 },
};

// Package types
export const PACKAGE_TYPES: Record<string, string> = {
  'PCS': 'Pieces',
  'CTN': 'Cartons',
  'SETS': 'Sets',
  'KG': 'Kilograms',
  'MT': 'Metric Tons',
  'CBM': 'Cubic Meters',
  'M': 'Meters',
  'ROLL': 'Rolls',
  'PAL': 'Pallets',
  'DRM': 'Drums',
  'BAL': 'Bales',
  'CAS': 'Cases',
  'CRT': 'Crates',
  'BAG': 'Bags',
  'BX': 'Boxes',
};

// UOM (Unit of Measure) codes (UN/ECE Recommendation 20)
export const UOM_CODES: Record<string, { name: string; symbol: string }> = {
  'KGM': { name: 'Kilogram', symbol: 'kg' },
  'TNE': { name: 'Tonne (metric ton)', symbol: 't' },
  'LBR': { name: 'Pound', symbol: 'lb' },
  'MTR': { name: 'Meter', symbol: 'm' },
  'FOT': { name: 'Foot', symbol: 'ft' },
  'MTQ': { name: 'Cubic meter', symbol: 'm³' },
  'FTQ': { name: 'Cubic foot', symbol: 'ft³' },
  'LTR': { name: 'Liter', symbol: 'L' },
  'GAL': { name: 'Gallon (US)', symbol: 'gal' },
  'PCE': { name: 'Piece', symbol: 'pc' },
  'SET': { name: 'Set', symbol: 'set' },
  'CT': { name: 'Carton', symbol: 'ctn' },
  'PK': { name: 'Package', symbol: 'pkg' },
  'PAL': { name: 'Pallet', symbol: 'pal' },
  'ROL': { name: 'Roll', symbol: 'rol' },
  'DZN': { name: 'Dozen', symbol: 'dz' },
};

// Country codes (ISO 3166-1 alpha-2)
export const COUNTRY_CODES: Record<string, string> = {
  'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AD': 'Andorra', 'AO': 'Angola',
  'AG': 'Antigua and Barbuda', 'AR': 'Argentina', 'AM': 'Armenia', 'AU': 'Australia',
  'AT': 'Austria', 'AZ': 'Azerbaijan', 'BS': 'Bahamas', 'BH': 'Bahrain', 'BD': 'Bangladesh',
  'BB': 'Barbados', 'BY': 'Belarus', 'BE': 'Belgium', 'BZ': 'Belize', 'BJ': 'Benin',
  'BT': 'Bhutan', 'BO': 'Bolivia', 'BA': 'Bosnia and Herzegovina', 'BW': 'Botswana',
  'BR': 'Brazil', 'BN': 'Brunei', 'BG': 'Bulgaria', 'BF': 'Burkina Faso', 'BI': 'Burundi',
  'KH': 'Cambodia', 'CM': 'Cameroon', 'CA': 'Canada', 'CV': 'Cape Verde', 'CF': 'Central African Republic',
  'TD': 'Chad', 'CL': 'Chile', 'CN': 'China', 'CO': 'Colombia', 'KM': 'Comoros',
  'CG': 'Congo', 'CD': 'Congo (Democratic Republic)', 'CR': 'Costa Rica', 'CI': 'Côte d\'Ivoire',
  'HR': 'Croatia', 'CU': 'Cuba', 'CY': 'Cyprus', 'CZ': 'Czech Republic', 'DK': 'Denmark',
  'DJ': 'Djibouti', 'DM': 'Dominica', 'DO': 'Dominican Republic', 'EC': 'Ecuador', 'EG': 'Egypt',
  'SV': 'El Salvador', 'GQ': 'Equatorial Guinea', 'ER': 'Eritrea', 'EE': 'Estonia', 'ET': 'Ethiopia',
  'FJ': 'Fiji', 'FI': 'Finland', 'FR': 'France', 'GA': 'Gabon', 'GM': 'Gambia',
  'GE': 'Georgia', 'DE': 'Germany', 'GH': 'Ghana', 'GR': 'Greece', 'GD': 'Grenada',
  'GT': 'Guatemala', 'GN': 'Guinea', 'GW': 'Guinea-Bissau', 'GY': 'Guyana', 'HT': 'Haiti',
  'HN': 'Honduras', 'HU': 'Hungary', 'IS': 'Iceland', 'IN': 'India', 'ID': 'Indonesia',
  'IR': 'Iran', 'IQ': 'Iraq', 'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy',
  'JM': 'Jamaica', 'JP': 'Japan', 'JO': 'Jordan', 'KZ': 'Kazakhstan', 'KE': 'Kenya',
  'KI': 'Kiribati', 'KP': 'Korea (North)', 'KR': 'Korea (South)', 'KW': 'Kuwait', 'KG': 'Kyrgyzstan',
  'LA': 'Laos', 'LV': 'Latvia', 'LB': 'Lebanon', 'LS': 'Lesotho', 'LR': 'Liberia',
  'LY': 'Libya', 'LI': 'Liechtenstein', 'LT': 'Lithuania', 'LU': 'Luxembourg', 'MK': 'Macedonia',
  'MG': 'Madagascar', 'MW': 'Malawi', 'MY': 'Malaysia', 'MV': 'Maldives', 'ML': 'Mali',
  'MT': 'Malta', 'MH': 'Marshall Islands', 'MR': 'Mauritania', 'MU': 'Mauritius', 'MX': 'Mexico',
  'FM': 'Micronesia', 'MD': 'Moldova', 'MC': 'Monaco', 'MN': 'Mongolia', 'ME': 'Montenegro',
  'MA': 'Morocco', 'MZ': 'Mozambique', 'MM': 'Myanmar', 'NA': 'Namibia', 'NR': 'Nauru',
  'NP': 'Nepal', 'NL': 'Netherlands', 'NZ': 'New Zealand', 'NI': 'Nicaragua', 'NE': 'Niger',
  'NG': 'Nigeria', 'NO': 'Norway', 'OM': 'Oman', 'PK': 'Pakistan', 'PW': 'Palau',
  'PA': 'Panama', 'PG': 'Papua New Guinea', 'PY': 'Paraguay', 'PE': 'Peru', 'PH': 'Philippines',
  'PL': 'Poland', 'PT': 'Portugal', 'QA': 'Qatar', 'RO': 'Romania', 'RU': 'Russia',
  'RW': 'Rwanda', 'KN': 'Saint Kitts and Nevis', 'LC': 'Saint Lucia', 'VC': 'Saint Vincent and the Grenadines',
  'WS': 'Samoa', 'SM': 'San Marino', 'ST': 'Sao Tome and Principe', 'SA': 'Saudi Arabia', 'SN': 'Senegal',
  'RS': 'Serbia', 'SC': 'Seychelles', 'SL': 'Sierra Leone', 'SG': 'Singapore', 'SK': 'Slovakia',
  'SI': 'Slovenia', 'SB': 'Solomon Islands', 'SO': 'Somalia', 'ZA': 'South Africa', 'SS': 'South Sudan',
  'ES': 'Spain', 'LK': 'Sri Lanka', 'SD': 'Sudan', 'SR': 'Suriname', 'SZ': 'Swaziland',
  'SE': 'Sweden', 'CH': 'Switzerland', 'SY': 'Syria', 'TW': 'Taiwan', 'TJ': 'Tajikistan',
  'TZ': 'Tanzania', 'TH': 'Thailand', 'TL': 'Timor-Leste', 'TG': 'Togo', 'TO': 'Tonga',
  'TT': 'Trinidad and Tobago', 'TN': 'Tunisia', 'TR': 'Turkey', 'TM': 'Turkmenistan', 'TV': 'Tuvalu',
  'UG': 'Uganda', 'UA': 'Ukraine', 'AE': 'United Arab Emirates', 'GB': 'United Kingdom', 'US': 'United States',
  'UY': 'Uruguay', 'UZ': 'Uzbekistan', 'VU': 'Vanuatu', 'VA': 'Vatican City', 'VE': 'Venezuela',
  'VN': 'Vietnam', 'YE': 'Yemen', 'ZM': 'Zambia', 'ZW': 'Zimbabwe',
};
