import { Metadata } from 'next';
import { Package, Weight, Container, Tags } from 'lucide-react';
import { PackingListGenerator } from '@/components/documents/PackingListGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Packing List - Free Generator & Template | Shiportrade',
  description: 'Create professional packing lists for international shipments. Free template with detailed carton contents, weights, dimensions, marks & numbers, and container details.',
  keywords: [
    'packing list',
    'packing list template',
    'shipping document',
    'export packing list',
    'carton details',
    'marks and numbers',
    'container packing',
    'weight declaration',
    'cargo manifest',
    'export documentation',
    'import documentation',
    'logistics document',
  ],
  openGraph: {
    title: 'Packing List - Free Generator & Template | Shiportrade',
    description: 'Create professional packing lists for international shipments. Free template with detailed carton contents, weights, dimensions, and marks & numbers.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Packing List - Free Generator & Template | Shiportrade',
    description: 'Create professional packing lists for international shipments. Free template with detailed carton contents and weights.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const packingListData: DocumentData = {
  title: 'Packing List',
  description: 'Generate detailed packing lists for your international shipments. Our comprehensive template includes carton contents, weights, dimensions, marks & numbers, and container details for seamless customs clearance.',
  icon: <Package className="h-3 w-3 mr-2" />,
  category: 'Trade Document',
  categoryColor: '#2E8B57',

  whatIs: `A Packing List is an essential shipping document that provides a detailed inventory of the contents within a shipment. It accompanies international cargo and serves as a comprehensive record of what is being shipped, including the quantity, weight, dimensions, and packaging details of each item. Unlike the commercial invoice which focuses on monetary value, the packing list concentrates on the physical aspects of the shipment. This document is critical for customs authorities to verify cargo contents, for warehouse personnel to check incoming goods, and for buyers to confirm they received everything ordered. The packing list must be accurate and consistent with other shipping documents like the commercial invoice and bill of lading.`,

  whenToUse: `A Packing List is required for virtually all international shipments and should be prepared whenever goods are being exported across borders. It is essential for customs clearance at both origin and destination, letter of credit transactions where banks may require it, shipments with multiple packages or containers that need detailed breakdown, situations where the buyer needs advance notice of shipment contents for inventory planning, and when specific handling instructions need to be communicated. The packing list should travel with the shipment and copies should be sent to relevant parties including customs brokers, freight forwarders, and the consignee.`,

  keyComponents: [
    {
      name: 'Document Reference',
      description: 'Packing list number, date, and reference to related invoice',
      required: true,
    },
    {
      name: 'Shipper Information',
      description: 'Complete details of the exporter/seller',
      required: true,
    },
    {
      name: 'Consignee Information',
      description: 'Complete details of the importer/buyer',
      required: true,
    },
    {
      name: 'Shipping Details',
      description: 'Vessel/flight name, ports of loading and discharge',
      required: true,
    },
    {
      name: 'Container Information',
      description: 'Container numbers, types, and seal numbers for FCL shipments',
      required: false,
    },
    {
      name: 'Marks & Numbers',
      description: 'Shipping marks and package numbering for identification',
      required: true,
    },
    {
      name: 'Package Details',
      description: 'Number of packages, type (cartons, pallets, etc.)',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of each item in the shipment',
      required: true,
    },
    {
      name: 'Quantity',
      description: 'Quantity of each item with unit of measure',
      required: true,
    },
    {
      name: 'Net Weight',
      description: 'Weight of goods without packaging',
      required: true,
    },
    {
      name: 'Gross Weight',
      description: 'Total weight including packaging',
      required: true,
    },
    {
      name: 'Dimensions',
      description: 'Length, width, height, and volume of packages',
      required: false,
    },
  ],

  commonMistakes: [
    'Weights not matching those declared on the commercial invoice',
    'Missing or inconsistent marks and numbers with other documents',
    'Inaccurate carton counts causing confusion during inventory check',
    'Omitting container and seal numbers for FCL shipments',
    'Net weight exceeding gross weight - a logical error',
    'Dimensions not totaling correctly to overall shipment volume',
    'Description of goods too vague for customs classification',
    'Not accounting for pallet weight in gross weight calculations',
    'Failing to update packing list when shipment contents change',
    'Different quantities listed on packing list versus invoice',
  ],

  tips: [
    'Always cross-check totals with commercial invoice and bill of lading for consistency',
    'Use consistent package numbering that matches shipping marks (1/50, 2/50, etc.)',
    'Include both net and gross weights - customs may verify either',
    'Dimensions should be in centimeters for international shipments',
    'For palletized cargo, note the number of cartons per pallet',
    'Add handling instructions (FRAGILE, THIS SIDE UP) for sensitive cargo',
    'Keep the packing list format consistent with your invoice for easy reference',
    'For LCL shipments, include dimensions for accurate freight calculation',
    'Send advance copy to consignee for customs pre-clearance preparation',
    'Include item-level HS codes if required by destination customs',
  ],

  legalRequirements: [
    {
      region: 'United States',
      requirements: [
        'Required for customs entry',
        'Must match ISF filing details',
        'Detailed description for HTS classification',
        'Weights must match carrier\'s VGM declaration',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'Entry Summary Declaration (ENS) reference',
        'Detailed goods description for CN codes',
        'Net and gross weights required',
        'Package count verification at customs',
      ],
    },
    {
      region: 'Australia',
      requirements: [
        'Detailed packing declaration required',
        'FCL packing declaration for container inspection',
        'Treatment certificates if required',
        'Consistent with import declaration',
      ],
    },
    {
      region: 'Middle East',
      requirements: [
        'Arabic translation may be required',
        'Legalization by chamber of commerce',
        'Detailed item-by-item listing',
        'Matching with certificate of origin',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between a packing list and a commercial invoice?',
      answer: 'A commercial invoice focuses on the financial aspects of a trade transaction - the value of goods, payment terms, and commercial details needed for duty calculation. A packing list, on the other hand, focuses on the physical aspects - what exactly is in each package, the weights, dimensions, and packaging details. While the commercial invoice answers "how much money", the packing list answers "what exactly". Both documents must be consistent in their descriptions, quantities, and references, but they serve different purposes in international trade.',
    },
    {
      question: 'How detailed should the description of goods be on a packing list?',
      answer: 'The goods description on a packing list should be detailed enough to identify each item without ambiguity. Include the product name, model/part numbers if applicable, color or size variations, and any relevant specifications. For customs purposes, the description should be sufficient for classification. For example, instead of just "clothing", specify "100% cotton men\'s t-shirts, size M, blue, 500 pieces". The level of detail helps customs verify the shipment and the consignee confirm receipt.',
    },
    {
      question: 'Why are marks and numbers important on a packing list?',
      answer: 'Marks and numbers are crucial identification codes that allow each package in a shipment to be uniquely identified and tracked. They typically include the buyer\'s name/logo, destination, order number, and sequential package numbers (e.g., 1/50, 2/50). These marks must match exactly across all shipping documents. At destination, warehouse staff use marks and numbers to verify that all packages arrived and to match packages to the correct shipment. Missing or incorrect marks can cause significant delays and confusion.',
    },
    {
      question: 'How do I calculate net weight versus gross weight?',
      answer: 'Net weight is the weight of the goods themselves without any packaging. Gross weight includes everything - the goods plus all packaging materials (boxes, pallets, wrapping, etc.). For example, if you\'re shipping 100 cartons of electronics: net weight = weight of all electronics, gross weight = electronics + cartons + protective materials + pallets. The difference between gross and net weight should equal the packaging weight. Always verify that gross weight is higher than net weight - this seems obvious but is a common error.',
    },
    {
      question: 'Is a packing list required for air freight shipments?',
      answer: 'Yes, packing lists are required for air freight shipments just as they are for ocean freight. In fact, air freight packing lists may need even more detail since air cargo has stricter security screening requirements. The packing list helps airlines verify cargo contents for safety compliance. For air shipments, also include the air waybill (AWB) number reference. Dimensions are particularly important for air freight as charges are based on either actual weight or volumetric weight, whichever is greater.',
    },
    {
      question: 'Can a packing list be used as a delivery note?',
      answer: 'Yes, a packing list can double as a delivery note or receiving document. When the shipment arrives, the consignee can use the packing list to check that all items were received in good condition. They can mark received quantities and note any discrepancies directly on the packing list. Many companies add a "received in good order" signature section at the bottom. This practice streamlines the receiving process and creates a record of delivery acceptance for both parties.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration for customs clearance',
    },
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for ocean shipments',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
    {
      name: 'Shipping Instructions',
      href: '/documents/shipping-instructions',
      description: 'Instructions to carrier for shipment',
    },
    {
      name: 'Export Declaration',
      href: '/documents/export-declaration',
      description: 'Customs export filing document',
    },
    {
      name: 'Dangerous Goods Declaration',
      href: '/documents/dangerous-goods-declaration',
      description: 'Declaration for hazardous cargo',
    },
  ],
};

export default function PackingListPage() {
  return (
    <DocumentLayout data={packingListData}>
      <PackingListGenerator />
    </DocumentLayout>
  );
}
