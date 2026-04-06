import { Metadata } from 'next';
import { ClipboardCheck, Search, Shield, CheckCircle } from 'lucide-react';
import InspectionCertificateGenerator from '@/components/documents/InspectionCertificateGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Inspection Certificate - Free Generator & Template | Shiportrade',
  description: 'Create professional inspection certificates for international trade. Free template with quality verification, testing results, and inspector certification.',
  keywords: [
    'inspection certificate',
    'quality certificate',
    'pre-shipment inspection',
    'PSI',
    'quality inspection',
    'third party inspection',
    'export inspection',
    'import inspection',
    'trade document',
    'verification certificate',
    'commodity inspection',
    'L/C requirement',
  ],
  openGraph: {
    title: 'Inspection Certificate - Free Generator & Template | Shiportrade',
    description: 'Create professional inspection certificates for international trade. Free template with quality verification and testing results.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Inspection Certificate - Free Generator & Template | Shiportrade',
    description: 'Create professional inspection certificates for international trade.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const inspectionCertificateData: DocumentData = {
  title: 'Inspection Certificate',
  description: 'Generate professional inspection certificates for your international trade transactions. Our template includes quality verification details, testing results, and inspector certification for L/C compliance.',
  icon: <ClipboardCheck className="h-3 w-3 mr-2" />,
  category: 'Quality Verification Document',
  categoryColor: '#0F4C81',

  whatIs: `An Inspection Certificate is an official document that certifies that goods have been inspected and meet specified quality standards, specifications, or regulatory requirements. It is typically issued by an independent inspection company, government agency, or accredited laboratory after conducting a physical examination of the goods. The certificate provides assurance to the buyer that the shipped goods conform to the contract specifications and are suitable for import. It is commonly required in letters of credit, government import programs, and quality-sensitive transactions. The inspection can cover various aspects including quantity, quality, packaging, labeling, and compliance with specific standards.`,

  whenToUse: `An Inspection Certificate is required when the letter of credit specifies inspection as a required document, when the buyer requires independent verification of quality before accepting goods, when government regulations mandate pre-shipment inspection (PSI) for imports, when trading regulated products like food, pharmaceuticals, or hazardous materials, when dealing with new suppliers or unfamiliar markets, and when quality disputes need independent third-party verification. The inspection should be conducted before or during shipment, and the certificate must be issued by the agreed inspection authority before document presentation.`,

  keyComponents: [
    {
      name: 'Certificate Number',
      description: 'Unique identifier for the inspection certificate',
      required: true,
    },
    {
      name: 'Date of Inspection',
      description: 'Date when the inspection was conducted',
      required: true,
    },
    {
      name: 'Exporter Information',
      description: 'Name and address of the exporter/seller',
      required: true,
    },
    {
      name: 'Importer Information',
      description: 'Name and address of the importer/buyer',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of goods inspected',
      required: true,
    },
    {
      name: 'Quantity Inspected',
      description: 'Quantity of goods examined',
      required: true,
    },
    {
      name: 'Reference Documents',
      description: 'Invoice number, L/C number, contract reference',
      required: true,
    },
    {
      name: 'Inspection Scope',
      description: 'What was inspected (quality, quantity, packaging)',
      required: true,
    },
    {
      name: 'Test Results',
      description: 'Results of any tests performed',
      required: false,
    },
    {
      name: 'Inspection Findings',
      description: 'Summary of inspection results',
      required: true,
    },
    {
      name: 'Conclusion',
      description: 'Pass/fail determination and compliance statement',
      required: true,
    },
    {
      name: 'Inspector Details',
      description: 'Name, signature, and credentials of inspector',
      required: true,
    },
  ],

  commonMistakes: [
    'Inspection date after shipment date - must be before or on shipment',
    'Certificate not issued by the inspection agency named in L/C',
    'Goods description not matching other shipping documents',
    'Quantity discrepancy between inspection certificate and invoice',
    'Missing inspector signature or company stamp',
    'Inspection scope not covering all required elements',
    'Test results not meeting specified standards or tolerances',
    'Certificate not in required language for destination country',
    'Using in-house inspection when third-party is required',
    'Not allowing enough time for inspection before shipment',
  ],

  tips: [
    'Book inspection well in advance of shipment date',
    'Ensure goods are ready and accessible for inspection',
    'Provide inspector with all relevant specifications and standards',
    'Have product samples, test reports, and certificates available',
    'Specify inspection requirements clearly in the sales contract',
    'Use internationally recognized inspection companies for credibility',
    'Ensure the certificate matches L/C requirements exactly',
    'Keep copies of all test reports and inspection records',
    'Address any deficiencies before final inspection',
    'Consider witness testing for critical specifications',
  ],

  legalRequirements: [
    {
      region: 'International (L/C)',
      requirements: [
        'Must be issued by entity specified in L/C',
        'Inspection date before or on shipment date',
        'Must conform to L/C terms exactly',
        'Original signature and stamp required',
      ],
    },
    {
      region: 'Pre-Shipment Inspection (PSI)',
      requirements: [
        'Government-mandated inspection programs',
        'Price verification for customs valuation',
        'Quality and quantity verification',
        'May require specific PSI company',
      ],
    },
    {
      region: 'Food & Pharmaceuticals',
      requirements: [
        'Health certificates required',
        'Lab testing for contaminants',
        'Shelf life verification',
        'Good Manufacturing Practice compliance',
      ],
    },
    {
      region: 'Hazardous Materials',
      requirements: [
        'Dangerous goods classification',
        'Packaging compliance inspection',
        'Labeling verification',
        'Transport safety certification',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between pre-shipment inspection and quality inspection?',
      answer: 'Pre-shipment Inspection (PSI) is a government-mandated program primarily for customs valuation, import verification, and preventing fraud. It\'s typically required by developing countries for imports above certain values. Quality inspection, on the other hand, is a commercial requirement focused on verifying that goods meet contract specifications. PSI is broader and may include price verification, while quality inspection focuses on product attributes. Both result in inspection certificates, but they serve different purposes and are issued by different authorities.',
    },
    {
      question: 'Who can issue an inspection certificate?',
      answer: 'Inspection certificates can be issued by various entities depending on requirements: Independent inspection companies (SGS, Intertek, Bureau Veritas, Cotecna), government inspection agencies, accredited testing laboratories, manufacturer\'s quality control (when permitted), and specialized commodity inspectors. For letters of credit, the issuing entity must match exactly what\'s specified in the L/C. Some countries mandate specific inspection companies for certain products or PSI programs.',
    },
    {
      question: 'What happens if the inspection fails?',
      answer: 'If goods fail inspection, the certificate will reflect the non-conformities. Options include: correcting the deficiencies and requesting re-inspection, negotiating with the buyer for acceptance with price adjustment, rejecting the goods if they fundamentally don\'t meet specifications, or appealing the findings if you disagree. Under an L/C, a failed inspection means documents won\'t be compliant. Always conduct your own quality control before the official inspection to identify and address issues proactively.',
    },
    {
      question: 'How long does an inspection certificate remain valid?',
      answer: 'Inspection certificate validity depends on the product type and destination requirements. For most goods, certificates remain valid for the duration of the shipment process. Perishable goods may have shorter validity based on shelf life. Some countries specify validity periods for import purposes. For L/C transactions, the certificate must be presented within the L/C validity period. It\'s best to use the certificate promptly and not delay shipment after inspection.',
    },
    {
      question: 'What is a clean report of findings (CRF)?',
      answer: 'A Clean Report of Findings (CRF) is a specific type of inspection certificate issued under Pre-Shipment Inspection programs. It indicates that the goods have been inspected and found to conform to the purchase order or contract specifications. A CRF is typically required for customs clearance in countries with mandatory PSI programs. If discrepancies are found, a Non-Negotiable Report of Findings (NNRF) is issued instead, which may cause customs delays or require resolution before import.',
    },
    {
      question: 'Can I use the manufacturer\'s quality certificate instead of third-party inspection?',
      answer: 'This depends on the contract and L/C terms. If the sales contract or L/C requires an independent third-party inspection, a manufacturer\'s certificate won\'t suffice. However, for many commercial transactions without specific third-party requirements, a manufacturer\'s quality certificate (often called a Quality Certificate or Certificate of Analysis) may be acceptable. Always check the specific requirements. For high-value or critical goods, third-party inspection provides greater assurance to buyers.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration matching inspection',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Package contents for inspection',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
    {
      name: 'Letter of Credit',
      href: '/documents/letter-of-credit',
      description: 'Payment guarantee requiring inspection',
    },
    {
      name: 'Insurance Certificate',
      href: '/documents/insurance-certificate',
      description: 'Proof of cargo insurance',
    },
    {
      name: 'Dangerous Goods Declaration',
      href: '/documents/dangerous-goods-declaration',
      description: 'Declaration for hazardous cargo',
    },
  ],
};

export default function InspectionCertificatePage() {
  return (
    <DocumentLayout data={inspectionCertificateData}>
      <InspectionCertificateGenerator />
    </DocumentLayout>
  );
}
