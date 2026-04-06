import { Metadata } from 'next';
import { FileText, DollarSign, Globe, Package } from 'lucide-react';
import CommercialInvoiceGenerator from '@/components/documents/CommercialInvoiceGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Commercial Invoice - Free Generator & Template | Shiportrade',
  description: 'Create professional commercial invoices for international trade. Free template with Incoterms, HS codes, multi-currency support, and instant PDF export.',
  keywords: [
    'commercial invoice',
    'trade document',
    'export invoice',
    'international trade',
    'customs invoice',
    'proforma invoice',
    'shipping document',
    'HS code',
    'Incoterms',
    'export documentation',
    'import documentation',
    'trade finance',
  ],
  openGraph: {
    title: 'Commercial Invoice - Free Generator & Template | Shiportrade',
    description: 'Create professional commercial invoices for international trade. Free template with Incoterms, HS codes, and multi-currency support.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commercial Invoice - Free Generator & Template | Shiportrade',
    description: 'Create professional commercial invoices for international trade. Free template with Incoterms, HS codes, and multi-currency support.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const commercialInvoiceData: DocumentData = {
  title: 'Commercial Invoice',
  description: 'Generate professional commercial invoices for international trade transactions. Our free template includes all required fields for customs clearance, supports multiple currencies, Incoterms, and provides instant PDF export.',
  icon: <FileText className="h-3 w-3 mr-2" />,
  category: 'International Trade Document',
  categoryColor: '#0F4C81',

  whatIs: `A Commercial Invoice is a fundamental document in international trade that serves as a legal record of the transaction between an exporter (seller) and an importer (buyer). It is essentially a bill for the goods shipped and provides detailed information about the merchandise, its value, and the terms of sale. Unlike a pro-forma invoice, which is a preliminary document, a commercial invoice represents a completed transaction and is used by customs authorities worldwide to assess duties and taxes, verify the goods being imported, and ensure compliance with import regulations. The commercial invoice must accurately reflect the actual transaction value and terms agreed upon between the trading parties.`,

  whenToUse: `A Commercial Invoice is required for virtually every international shipment. It should be prepared when goods are being exported across international borders, whether by sea, air, or land. This document is essential for customs clearance at both the exporting and importing countries, letter of credit transactions where banks require detailed documentation, shipments requiring duty and tax assessment, and any transaction where proof of value and goods description is needed. The invoice should accompany the shipment throughout its journey and be presented to customs authorities, banks, and other parties involved in the trade transaction.`,

  keyComponents: [
    {
      name: 'Invoice Number & Date',
      description: 'Unique identifier and date of issuance for tracking and reference',
      required: true,
    },
    {
      name: 'Seller Information',
      description: 'Complete details of the exporter including company name, address, contact information, and tax/VAT ID',
      required: true,
    },
    {
      name: 'Buyer Information',
      description: 'Complete details of the importer including company name, address, contact information, and tax/VAT ID',
      required: true,
    },
    {
      name: 'Consignee Details',
      description: 'Information of the party receiving goods if different from the buyer',
      required: false,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of each item including quantity, unit price, and total value',
      required: true,
    },
    {
      name: 'HS Codes',
      description: 'Harmonized System codes for customs classification and duty calculation',
      required: true,
    },
    {
      name: 'Incoterms',
      description: 'International trade terms defining responsibilities and risk transfer',
      required: true,
    },
    {
      name: 'Payment Terms',
      description: 'Agreed payment method and terms such as T/T, L/C, or D/P',
      required: true,
    },
    {
      name: 'Shipping Details',
      description: 'Vessel name, voyage number, ports of loading and discharge',
      required: false,
    },
    {
      name: 'Weights & Measurements',
      description: 'Net weight, gross weight, and dimensions of the shipment',
      required: true,
    },
    {
      name: 'Country of Origin',
      description: 'Country where the goods were manufactured or produced',
      required: true,
    },
    {
      name: 'Currency & Total Value',
      description: 'Invoice currency and total declared value of goods',
      required: true,
    },
  ],

  commonMistakes: [
    'Inconsistent values between commercial invoice and other shipping documents',
    'Missing or incorrect HS codes leading to customs delays',
    'Using trade names instead of proper goods descriptions',
    'Failing to declare the correct country of origin',
    'Omitting required Incoterms or using outdated versions',
    'Not matching invoice details with the letter of credit requirements',
    'Incorrect currency conversion or missing exchange rate information',
    'Undervaluing goods to reduce duties - this is illegal and can result in penalties',
  ],

  tips: [
    'Ensure all values match exactly across all shipping documents (B/L, packing list, certificate of origin)',
    'Include both English and the importing country\'s language for smoother customs clearance',
    'Always use the latest Incoterms version (currently Incoterms 2020)',
    'Verify HS codes with official customs databases to ensure accurate classification',
    'Add a declaration statement if required by the importing country',
    'Keep digital copies of all signed documents for your records',
    'Include freight and insurance costs separately when required by Incoterms',
    'Double-check mathematical calculations to avoid discrepancies',
  ],

  legalRequirements: [
    {
      region: 'United States',
      requirements: [
        'Must include seller and buyer complete addresses',
        'Country of origin required for each item',
        'HTS codes (10-digit) for US imports',
        'Declared value in USD or with exchange rate',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'VAT numbers for both parties if applicable',
        'EORI number may be required',
        'CN code (8-digit) for EU customs',
        'Declaration of origin statement',
      ],
    },
    {
      region: 'China',
      requirements: [
        'Chinese customs registration code (CR code)',
        'HS codes (10-digit) for China',
        'Declaring agent information if applicable',
        'Detailed specifications for certain products',
      ],
    },
    {
      region: 'United Kingdom',
      requirements: [
        'GB EORI number for UK traders',
        'Commodity codes (10-digit)',
        'Declaration of origin for preferential rates',
        'VAT registration if applicable',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between a commercial invoice and a pro-forma invoice?',
      answer: 'A commercial invoice is a final, legal document that records an actual sale transaction and is used for customs clearance and payment collection. A pro-forma invoice, on the other hand, is a preliminary document sent before the sale is finalized, serving as a price quote or commitment to sell at certain terms. Pro-forma invoices are used for budgeting, letter of credit applications, and import license applications, while commercial invoices represent completed transactions.',
    },
    {
      question: 'Do I need to include HS codes on my commercial invoice?',
      answer: 'Yes, including HS (Harmonized System) codes on your commercial invoice is essential for international trade. HS codes are used by customs authorities worldwide to classify goods, determine applicable duties and taxes, and ensure compliance with import/export regulations. Without proper HS codes, your shipment may face delays, additional inspections, or even rejection at customs. Use the official HS code database of the importing country for accurate classification.',
    },
    {
      question: 'Which Incoterms should I use on my commercial invoice?',
      answer: 'The choice of Incoterms depends on your agreement with the buyer and the shipping arrangement. Common choices include: FOB (Free On Board) - popular for sea freight where buyer arranges main carriage; CIF (Cost, Insurance, Freight) - seller covers shipping and insurance to destination port; EXW (Ex Works) - buyer takes responsibility at seller\'s premises; DDP (Delivered Duty Paid) - seller handles everything including import duties. Always use Incoterms 2020 with the named place (e.g., "FOB Shanghai, Incoterms 2020").',
    },
    {
      question: 'What currency should I use for the commercial invoice?',
      answer: 'You can use any mutually agreed currency between buyer and seller. However, it\'s important to consider: the currency specified in the sales contract or letter of credit, the buyer\'s preferred currency for easier payment processing, whether your bank can easily accept the chosen currency, and customs requirements in the destination country (some require value conversion to local currency). Always clearly state the currency and include the exchange rate if conversion is needed.',
    },
    {
      question: 'How many copies of the commercial invoice do I need?',
      answer: 'The number of copies required varies by destination and shipping method. Generally, you need: at least 3-5 original signed copies for different parties (customs, bank, buyer, carrier, your records), additional copies may be required for letters of credit (often specified in L/C terms), some countries require certified copies or legalization, and digital copies are increasingly accepted but verify requirements first. Always check the specific requirements of the destination country and any bank or regulatory requirements.',
    },
    {
      question: 'Can I amend a commercial invoice after it has been issued?',
      answer: 'While commercial invoices can technically be amended, it\'s best to avoid amendments as they can raise red flags with customs authorities and banks. If amendments are absolutely necessary: issue a formal amendment document clearly marked as such, reference the original invoice number and date, explain the reason for the amendment, have the amendment signed and dated by the same authorized signatory, and ensure all parties receive copies of both the original and amendment. For letters of credit, amendments may require bank approval.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for ocean shipments',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Detailed list of package contents',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
    {
      name: 'Pro-forma Invoice',
      href: '/documents/pro-forma-invoice',
      description: 'Preliminary invoice for quotations',
    },
    {
      name: 'Letter of Credit',
      href: '/documents/letter-of-credit',
      description: 'Payment guarantee from bank',
    },
    {
      name: 'Insurance Certificate',
      href: '/documents/insurance-certificate',
      description: 'Proof of cargo insurance',
    },
  ],
};

export default function CommercialInvoicePage() {
  return (
    <DocumentLayout data={commercialInvoiceData}>
      <CommercialInvoiceGenerator />
    </DocumentLayout>
  );
}
