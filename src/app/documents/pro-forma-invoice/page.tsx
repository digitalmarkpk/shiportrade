import { Metadata } from 'next';
import { FileText, Calculator, Clock, FileCheck } from 'lucide-react';
import ProFormaInvoiceGenerator from '@/components/documents/ProformaInvoiceGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Pro-forma Invoice - Free Generator & Template | Shiportrade',
  description: 'Create professional pro-forma invoices for international trade quotations. Free template with Incoterms, pricing, specifications, and delivery terms.',
  keywords: [
    'proforma invoice',
    'pro-forma invoice',
    'price quote',
    'export quotation',
    'trade quotation',
    'preliminary invoice',
    'sales quotation',
    'L/C application',
    'import license',
    'trade document',
    'international trade',
    'export documentation',
  ],
  openGraph: {
    title: 'Pro-forma Invoice - Free Generator & Template | Shiportrade',
    description: 'Create professional pro-forma invoices for international trade quotations. Free template with Incoterms and delivery terms.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pro-forma Invoice - Free Generator & Template | Shiportrade',
    description: 'Create professional pro-forma invoices for international trade quotations.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const proformaInvoiceData: DocumentData = {
  title: 'Pro-forma Invoice',
  description: 'Generate professional pro-forma invoices for your international trade quotations. Our template includes product specifications, pricing, Incoterms, delivery terms, and payment conditions.',
  icon: <FileText className="h-3 w-3 mr-2" />,
  category: 'Trade Quotation Document',
  categoryColor: '#0F4C81',

  whatIs: `A Pro-forma Invoice is a preliminary bill of sale sent by a seller to a buyer in advance of a shipment or delivery of goods. It serves as a formal price quotation and commitment to sell at stated terms, but it is not a demand for payment like a commercial invoice. The pro-forma invoice describes the purchased items, their value, and other important information such as shipping weight and transport charges. It is commonly used to declare the value of goods for customs purposes, to obtain import licenses or foreign exchange approvals, to apply for letters of credit, and as a formal quotation for the buyer's consideration before finalizing the order.`,

  whenToUse: `A Pro-forma Invoice should be used when providing price quotations to potential buyers, especially in international trade. It is essential when the buyer needs to apply for an import license, when the buyer must obtain foreign exchange approval from their government, when applying for a letter of credit at the buyer's bank, when declaring value for customs in certain countries before shipment, and when providing detailed product specifications and terms for the buyer's review. Unlike a commercial invoice, the pro-forma invoice represents a proposed transaction that can be modified before the final sale is confirmed.`,

  keyComponents: [
    {
      name: 'Pro-forma Invoice Number',
      description: 'Unique identifier for tracking and reference',
      required: true,
    },
    {
      name: 'Date & Validity',
      description: 'Issue date and validity period of the quotation',
      required: true,
    },
    {
      name: 'Seller Information',
      description: 'Complete details of the exporter/quoter',
      required: true,
    },
    {
      name: 'Buyer Information',
      description: 'Complete details of the potential buyer/importer',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description including specifications and quantities',
      required: true,
    },
    {
      name: 'Unit Prices',
      description: 'Price per unit with currency specification',
      required: true,
    },
    {
      name: 'Total Value',
      description: 'Total value of the proposed shipment',
      required: true,
    },
    {
      name: 'Incoterms',
      description: 'Delivery terms specifying responsibilities',
      required: true,
    },
    {
      name: 'Payment Terms',
      description: 'Proposed payment method and conditions',
      required: true,
    },
    {
      name: 'Lead Time',
      description: 'Expected production and delivery time',
      required: true,
    },
    {
      name: 'Packing Details',
      description: 'Packing method and packaging specifications',
      required: false,
    },
    {
      name: 'Country of Origin',
      description: 'Origin of the goods being quoted',
      required: false,
    },
  ],

  commonMistakes: [
    'Not specifying a validity period for the quotation',
    'Using vague product descriptions instead of detailed specifications',
    'Omitting Incoterms or using outdated versions',
    'Not clearly stating the currency and whether prices include taxes',
    'Forgetting to mention minimum order quantities or volume discounts',
    'Not including lead times for production and delivery',
    'Using pro-forma invoice as a final invoice - it must be replaced with commercial invoice',
    'Not updating exchange rates if validity period is long',
    'Omitting bank details for payment reference',
    'Not clarifying whether samples are available',
  ],

  tips: [
    'Always include a clear validity period (30-90 days typical)',
    'Be specific about what is included in the price (packaging, labeling, etc.)',
    'Use the current Incoterms version (Incoterms 2020)',
    'Include your bank details for letter of credit applications',
    'Mention any certifications or standards the products meet',
    'Clarify whether prices are firm or subject to change',
    'Include HS codes to help buyers estimate import duties',
    'Specify packaging details to avoid misunderstandings',
    'Keep records of all pro-forma invoices sent and their status',
    'Convert the pro-forma to commercial invoice once order is confirmed',
  ],

  legalRequirements: [
    {
      region: 'United States',
      requirements: [
        'Required for import license applications',
        'Used for CBP value declarations',
        'Must include country of origin',
        'Helpful for BIS export classifications',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'Needed for import licensing procedures',
        'Used for VAT estimation purposes',
        'Required for certain dual-use goods',
        'Helps with customs pre-clearance',
      ],
    },
    {
      region: 'China',
      requirements: [
        'Essential for import license application',
        'Required for foreign exchange approval',
        'Must match L/C terms exactly',
        'Chinese translation may be needed',
      ],
    },
    {
      region: 'Middle East',
      requirements: [
        'Required for import permit applications',
        'May need legalization for certain countries',
        'Arabic translation often required',
        'Bank reference for payment terms',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between a pro-forma invoice and a commercial invoice?',
      answer: 'A pro-forma invoice is a preliminary document that serves as a price quotation and commitment to sell at stated terms. It is not a demand for payment and can be modified before the transaction is finalized. A commercial invoice, on the other hand, is the final billing document that records an actual sale transaction and is used for customs clearance and payment collection. The pro-forma invoice becomes obsolete once the commercial invoice is issued. Never use a pro-forma invoice for final payment demands or as the sole document for customs clearance of actual shipments.',
    },
    {
      question: 'How long should a pro-forma invoice be valid?',
      answer: 'The validity period of a pro-forma invoice depends on market conditions and business practices. Typical validity periods range from 30 to 90 days. For commodities with volatile prices, shorter validity periods (7-30 days) are appropriate. For manufactured goods with stable pricing, longer periods (60-90 days) are common. Always clearly state the validity period on the document. If the buyer accepts the quotation after expiry, you should issue a new pro-forma invoice with updated terms and current prices.',
    },
    {
      question: 'Can I use a pro-forma invoice to apply for a letter of credit?',
      answer: 'Yes, pro-forma invoices are commonly used to apply for letters of credit. The buyer presents the pro-forma invoice to their bank when applying for an L/C. The L/C terms will be based on the pro-forma invoice details, so it\'s crucial that the pro-forma is accurate and complete. Include all specifications, pricing, delivery terms, and required documents. Once the L/C is issued, the commercial invoice must match the L/C terms exactly, so ensure your pro-forma accurately reflects what you can deliver.',
    },
    {
      question: 'Do I need to include HS codes on a pro-forma invoice?',
      answer: 'While not legally required, including HS (Harmonized System) codes on a pro-forma invoice is highly recommended for international trade. HS codes help the buyer estimate import duties and taxes, determine import license requirements, and prepare for customs clearance. They also demonstrate professionalism and help avoid misunderstandings about product classification. For the buyer, knowing the HS code allows them to calculate their total landed cost accurately before placing an order.',
    },
    {
      question: 'Is a pro-forma invoice legally binding?',
      answer: 'A pro-forma invoice is not a legally binding contract in itself, but it does represent a formal offer to sell at stated terms. It becomes binding only when the buyer accepts the offer and a formal contract or purchase order is established. The pro-forma serves as a commitment from the seller to sell at the quoted prices if the order is placed within the validity period. However, prices and terms can be modified before final acceptance. Always convert the pro-forma to a commercial invoice or formal contract once the order is confirmed.',
    },
    {
      question: 'What happens after the buyer accepts a pro-forma invoice?',
      answer: 'Once the buyer accepts the pro-forma invoice, several steps typically follow: The buyer issues a purchase order (PO) confirming the order details; if using L/C, the buyer applies for the letter of credit based on the pro-forma; the seller may issue a sales contract for signature; production begins according to the agreed lead time; upon shipment, the seller issues a commercial invoice replacing the pro-forma; all shipping documents are prepared based on the accepted terms. The pro-forma invoice should be kept on file as reference for the transaction.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Final billing document for shipment',
    },
    {
      name: 'Letter of Credit',
      href: '/documents/letter-of-credit',
      description: 'Payment guarantee from bank',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Detailed list of package contents',
    },
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for ocean freight',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
    {
      name: 'Export Declaration',
      href: '/documents/export-declaration',
      description: 'Customs export filing document',
    },
  ],
};

export default function ProFormaInvoicePage() {
  return (
    <DocumentLayout data={proformaInvoiceData}>
      <ProFormaInvoiceGenerator />
    </DocumentLayout>
  );
}
