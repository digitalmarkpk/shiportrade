import { Metadata } from 'next';
import { Globe, Shield, Stamp } from 'lucide-react';
import { CertificateOfOriginGenerator } from '@/components/documents/CertificateOfOriginGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Certificate of Origin - Free Generator & Template | Shiportrade',
  description: 'Create professional Certificates of Origin for international trade. Free template for non-preferential, USMCA, RCEP, CPTPP, EU FTAs, and all major preferential origin certificates.',
  keywords: [
    'certificate of origin',
    'CO',
    'origin certificate',
    'FTA certificate',
    'USMCA certificate',
    'RCEP certificate',
    'Form A',
    'preferential origin',
    'chamber of commerce',
    'rules of origin',
    'export documentation',
    'customs document',
    'free trade agreement',
    'duty reduction',
  ],
  openGraph: {
    title: 'Certificate of Origin - Free Generator & Template | Shiportrade',
    description: 'Create professional Certificates of Origin for international trade. Free template for non-preferential and preferential origin certificates.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Certificate of Origin - Free Generator & Template | Shiportrade',
    description: 'Create professional Certificates of Origin for international trade. Support for USMCA, RCEP, CPTPP, and more.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const certificateOfOriginData: DocumentData = {
  title: 'Certificate of Origin',
  description: 'Generate professional Certificates of Origin for your international shipments. Support for all major Free Trade Agreements including USMCA, RCEP, CPTPP, and EU trade agreements.',
  icon: <Globe className="h-3 w-3 mr-2" />,
  category: 'Customs Document',
  categoryColor: '#0F4C81',

  whatIs: `A Certificate of Origin (CO) is an international trade document that certifies the country where goods were manufactured or produced. It serves as a declaration by the exporter, attesting that the goods in a shipment are wholly obtained, produced, or manufactured in a particular country. There are two main types: Non-Preferential Certificates of Origin, which are used for trade statistics and general origin verification, and Preferential Certificates of Origin, which are used to claim duty reductions or exemptions under Free Trade Agreements (FTAs). The certificate is a critical document for customs clearance and must be accurate to avoid penalties.`,

  whenToUse: `A Certificate of Origin is required whenever goods are being exported to countries that require proof of origin for customs clearance. This includes shipments to countries with Free Trade Agreements where preferential duty rates apply, imports into countries with quotas or restrictions on goods from certain origins, letter of credit transactions that specifically require a CO, situations where the buyer needs to claim preferential duty treatment, and when required by importing country regulations. The CO must be issued before or at the time of export and should accompany other shipping documents.`,

  keyComponents: [
    {
      name: 'Exporter Information',
      description: 'Complete details of the exporter including name, address, and contact',
      required: true,
    },
    {
      name: 'Producer Information',
      description: 'Details of the actual producer if different from exporter',
      required: false,
    },
    {
      name: 'Importer Information',
      description: 'Complete details of the importer/buyer in destination country',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of goods including marks, numbers, and quantity',
      required: true,
    },
    {
      name: 'HS Code',
      description: 'Harmonized System classification code for each item',
      required: true,
    },
    {
      name: 'Origin Criteria',
      description: 'Code indicating how goods qualify for origin status (WO, CTC, RVC)',
      required: true,
    },
    {
      name: 'Country of Origin',
      description: 'Country where goods were manufactured or produced',
      required: true,
    },
    {
      name: 'Invoice Details',
      description: 'Reference to commercial invoice number and date',
      required: true,
    },
    {
      name: 'Transport Details',
      description: 'Mode of transport and route information',
      required: false,
    },
    {
      name: 'Certification',
      description: 'Authorized signature and official stamp/certification',
      required: true,
    },
  ],

  commonMistakes: [
    'Using incorrect HS codes that don\'t match the commercial invoice',
    'Failing to verify goods meet Rules of Origin before claiming preferential status',
    'Not obtaining proper certification from authorized bodies (Chamber of Commerce)',
    'Missing or incorrect origin criteria codes for preferential COs',
    'Certificate expiration before goods clear customs at destination',
    'Inconsistent information between CO and other shipping documents',
    'Not maintaining required supporting documentation for origin claims',
    'Incorrect country of origin declaration for goods with multiple processing stages',
    'Using wrong FTA form for the specific trade agreement',
    'Forgetting to have documents legalized when required by destination country',
  ],

  tips: [
    'Verify Rules of Origin requirements before claiming preferential status under any FTA',
    'Ensure HS codes are consistent across all shipping documents',
    'Apply for Chamber of Commerce certification 2-3 days before shipment',
    'Keep supplier declarations and production records for audit purposes',
    'Check destination country requirements for legalization or apostille',
    'For USMCA, exporters can self-certify - no Chamber certification required',
    'RCEP allows back-to-back certificates for goods transiting through multiple countries',
    'Form A (GSP) is being phased out - verify current GSP beneficiary status',
    'Maintain origin documentation for at least 5 years for potential customs audits',
    'Consider origin qualification at product design stage to maximize FTA benefits',
  ],

  legalRequirements: [
    {
      region: 'USMCA (US/Mexico/Canada)',
      requirements: [
        'Self-certification by exporter/producer/importer',
        'No specific form required but minimum data elements needed',
        'Certification valid for 4 years from date of import',
        'De minimis threshold: 7-10% depending on product',
      ],
    },
    {
      region: 'RCEP (Asia-Pacific)',
      requirements: [
        'Authorized body certification or approved exporter self-cert',
        'Certificate of Origin Form (CoO)',
        'Back-to-back certification for transshipment allowed',
        'Valid for 12 months from date of issue',
      ],
    },
    {
      region: 'European Union FTAs',
      requirements: [
        'EUR.1 Movement Certificate or origin declaration',
        'Registered Exporter (REX) system for self-certification',
        'Proof of origin valid for 10-12 months',
        'Specific origin rules per product category',
      ],
    },
    {
      region: 'Form A (GSP)',
      requirements: [
        'Certificate of Origin Form A',
        'Issued by designated authority in beneficiary country',
        'Direct transport rule applies',
        'Check current GSP beneficiary status',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between preferential and non-preferential Certificates of Origin?',
      answer: 'A Non-Preferential Certificate of Origin simply declares the country where goods were produced, used for trade statistics, import quota determination, and general origin verification. It does not provide any duty benefits. A Preferential Certificate of Origin, on the other hand, is used to claim reduced or zero duties under a Free Trade Agreement. It requires that goods meet specific Rules of Origin criteria set by the FTA and must be in the prescribed format for that particular agreement. The preferential CO can result in significant duty savings.',
    },
    {
      question: 'How do I determine if my goods qualify for preferential origin?',
      answer: 'Goods qualify for preferential origin through various criteria set by each FTA: Wholly Obtained (WO) - goods entirely produced in the FTA territory using domestic materials; Tariff Shift (CTC) - non-originating materials undergo processing that changes their HS classification; Regional Value Content (RVC) - a percentage of the goods\' value must originate from FTA members; or De Minimis - small amounts of non-originating materials are allowed. Check the specific FTA\'s Rules of Origin for your product\'s HS code to determine the applicable criteria.',
    },
    {
      question: 'Who can issue a Certificate of Origin?',
      answer: 'The issuing authority depends on the type of certificate and destination. For Non-Preferential COs, Chambers of Commerce and designated government authorities typically issue them. For Preferential COs, the requirements vary by FTA: USMCA allows self-certification by exporters, producers, or importers; RCEP requires certification by designated authorities or approved exporters; EU FTAs use the REX system for self-certification above certain thresholds. Always verify the specific requirements of the destination country and applicable FTA.',
    },
    {
      question: 'How long is a Certificate of Origin valid?',
      answer: 'Certificate validity varies by type and agreement. Most Preferential Certificates of Origin are valid for 12 months from the date of issue. USMCA certifications are valid for 4 years from the date of import. EU EUR.1 certificates are typically valid for 10-12 months. Non-preferential COs generally don\'t have expiration dates but should be used within a reasonable timeframe. Import must typically occur before the certificate expires, though some agreements allow retrospective claims within a certain period.',
    },
    {
      question: 'Do I need to legalize my Certificate of Origin?',
      answer: 'Legalization requirements depend on the destination country and type of certificate. Some countries (particularly in the Middle East and parts of Africa) require COs to be legalized by their embassy or consulate. Other countries accept Chamber of Commerce certification directly. For FTA certificates, legalization is typically not required as they follow standardized formats. Always check the specific requirements of the importing country and allow extra time for the legalization process if required.',
    },
    {
      question: 'What is back-to-back certification under RCEP?',
      answer: 'Back-to-back certification under RCEP allows an intermediate country to issue a new Certificate of Origin based on the original CO from the first exporting country. This is useful when goods pass through multiple RCEP member countries before reaching the final destination. For example, goods from China passing through Singapore to Indonesia can have a new CO issued in Singapore based on the original Chinese CO. This maintains the preferential origin status throughout the supply chain.',
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
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Detailed list of package contents',
    },
    {
      name: 'Export Declaration',
      href: '/documents/export-declaration',
      description: 'Customs export filing document',
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

export default function CertificateOfOriginPage() {
  return (
    <DocumentLayout data={certificateOfOriginData}>
      <CertificateOfOriginGenerator />
    </DocumentLayout>
  );
}
