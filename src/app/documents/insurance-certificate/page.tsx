import { Metadata } from 'next';
import { Shield, Ship, Anchor } from 'lucide-react';
import InsuranceCertificateGenerator from '@/components/documents/InsuranceCertificateGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Insurance Certificate - Free Generator & Template | Shiportrade',
  description: 'Create professional marine insurance certificates for cargo shipments. Free template with ICC clauses, coverage types, and policy details.',
  keywords: [
    'insurance certificate',
    'marine insurance',
    'cargo insurance',
    'ICC',
    'Institute Cargo Clauses',
    'ocean freight insurance',
    'shipping insurance',
    'export insurance',
    'import insurance',
    'CIF insurance',
    'trade document',
    'insurance policy',
  ],
  openGraph: {
    title: 'Insurance Certificate - Free Generator & Template | Shiportrade',
    description: 'Create professional marine insurance certificates for cargo shipments. Free template with ICC clauses and coverage types.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insurance Certificate - Free Generator & Template | Shiportrade',
    description: 'Create professional marine insurance certificates for cargo shipments.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const insuranceCertificateData: DocumentData = {
  title: 'Insurance Certificate',
  description: 'Generate professional marine insurance certificates for your cargo shipments. Our template includes ICC clauses (A, B, C), coverage details, and policy information for international trade.',
  icon: <Shield className="h-3 w-3 mr-2" />,
  category: 'Trade Finance Document',
  categoryColor: '#2E8B57',

  whatIs: `An Insurance Certificate is a document that provides evidence of marine cargo insurance coverage for a specific shipment. It certifies that the goods described are insured under a specified policy and details the terms, conditions, and extent of coverage. The certificate is typically issued by an insurance company or their authorized agent and is required under CIF and CIP Incoterms, where the seller must provide insurance. It serves as proof of insurance for banks (in L/C transactions), customs authorities, and the buyer. The certificate can be transferred to subsequent owners of the goods, making it a valuable document in trade transactions.`,

  whenToUse: `An Insurance Certificate is required when shipping goods under CIF (Cost, Insurance, Freight) or CIP (Carriage and Insurance Paid To) Incoterms, where the seller is obligated to provide insurance. It is also essential when a letter of credit requires proof of insurance, when the buyer requests evidence of coverage before accepting goods, when banks require documentation for trade finance, and when claiming against the policy for loss or damage. The certificate should be issued at the time of shipment and accompany other shipping documents.`,

  keyComponents: [
    {
      name: 'Certificate Number',
      description: 'Unique identifier for the insurance certificate',
      required: true,
    },
    {
      name: 'Policy Number',
      description: 'Reference to the underlying open policy or specific policy',
      required: true,
    },
    {
      name: 'Assured/Insured',
      description: 'Name and address of the party insured',
      required: true,
    },
    {
      name: 'Vessel/Conveyance',
      description: 'Name of vessel or means of transport',
      required: true,
    },
    {
      name: 'Voyage Details',
      description: 'Port of loading, discharge, and sailing date',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Description of insured goods with marks and numbers',
      required: true,
    },
    {
      name: 'Sum Insured',
      description: 'Insurance amount, typically 110% of CIF value',
      required: true,
    },
    {
      name: 'Coverage Clauses',
      description: 'Institute Cargo Clauses (A, B, or C) and additional terms',
      required: true,
    },
    {
      name: 'Claims Agent',
      description: 'Contact details for claims at destination',
      required: true,
    },
    {
      name: 'Survey Agent',
      description: 'Agent to be contacted for damage survey',
      required: false,
    },
    {
      name: 'Special Conditions',
      description: 'Additional warranties or conditions',
      required: false,
    },
    {
      name: 'Date of Issue',
      description: 'Date the certificate was issued',
      required: true,
    },
  ],

  commonMistakes: [
    'Insuring for less than actual value, triggering the average clause',
    'Using wrong ICC coverage type for the goods being shipped',
    'Forgetting to add War Risk and Strikes clauses for high-risk routes',
    'Certificate issued after shipment date - must be before or on shipment date',
    'Missing claims agent information at destination',
    'Not ensuring the certificate is assignable or transferable',
    'Omitting warehouse-to-warehouse coverage extension',
    'Incorrect percentage of coverage (should be minimum 110% for CIF/CIP)',
    'Not reviewing policy exclusions carefully',
    'Delayed notification of claims - most policies require immediate reporting',
  ],

  tips: [
    'Always insure for at least 110% of CIF/CIP value to meet Incoterms requirements',
    'Choose ICC (A) for high-value, fragile, or sensitive goods',
    'ICC (C) may be sufficient for durable bulk commodities',
    'Add War Risk and Strikes clauses when shipping through high-risk areas',
    'Ensure warehouse-to-warehouse coverage for full transit protection',
    'Verify the claims agent at destination is accessible and reputable',
    'Keep copies of all shipping documents for claims processing',
    'Report damage immediately and request a survey for significant losses',
    'Check if policy covers general average contributions',
    'Consider continuation coverage for long transit times',
  ],

  legalRequirements: [
    {
      region: 'International (UCP 600)',
      requirements: [
        'Insurance must be for minimum 110% of CIF/CIP value',
        'Must be issued by insurance company or their agent',
        'Cover same currency as the credit',
        'Coverage from warehouse to warehouse',
      ],
    },
    {
      region: 'Incoterms 2020',
      requirements: [
        'CIF requires seller to purchase insurance',
        'CIP requires seller to purchase insurance',
        'Minimum coverage: ICC (C) for CIF, ICC (A) for CIP',
        'Policy must be assignable to buyer',
      ],
    },
    {
      region: 'United States',
      requirements: [
        'Federal Insurance Office regulations',
        'State insurance regulations apply',
        'Marine Insurance Act principles',
        'Claims handling requirements',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'Insurance distribution regulations',
        'Consumer protection requirements',
        'Cross-border insurance provisions',
        'Policy documentation standards',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between ICC (A), (B), and (C) coverage?',
      answer: 'ICC (A) provides "all-risks" coverage - it covers everything except specifically excluded perils, making it the most comprehensive. ICC (B) covers named perils including fire, explosion, stranding, collision, and additional risks like water damage, earthquake, and washing overboard. ICC (C) covers only major casualties - fire, explosion, stranding, collision, and general average - the most basic coverage. Choose ICC (A) for valuable or fragile goods, ICC (B) for moderate-risk cargo, and ICC (C) for durable bulk commodities.',
    },
    {
      question: 'Why is insurance typically 110% of the invoice value?',
      answer: 'The 110% figure represents the actual value of the goods plus an additional 10% to cover expected profit on the transaction. Under CIF and CIP Incoterms, this is the minimum requirement. The buyer may request higher coverage (e.g., 130%) to protect higher margins. Banks typically require at least 110% for L/C transactions. The additional percentage also provides a buffer for costs that may not be fully documented in the commercial invoice.',
    },
    {
      question: 'What is the difference between an insurance policy and an insurance certificate?',
      answer: 'An Insurance Policy is the full contract between the insurer and insured, containing all terms, conditions, exclusions, and fine print. An Insurance Certificate is a shorter document that certifies coverage exists under a specific policy and describes a particular shipment. Certificates are typically issued under open policies that cover multiple shipments. For L/C purposes, a certificate is usually sufficient, though the full policy provides more comprehensive information for claims.',
    },
    {
      question: 'What is warehouse-to-warehouse coverage?',
      answer: 'Warehouse-to-warehouse (W/W) coverage extends insurance protection from the moment goods leave the seller\'s warehouse until they arrive at the buyer\'s warehouse at destination. This includes all intermediate transportation, loading, unloading, and temporary storage. Without this clause, coverage might be limited to the ocean voyage only, leaving gaps during pre- and post-carriage. Most modern policies include W/W as standard, but always verify it\'s included.',
    },
    {
      question: 'When do I need War Risk and Strikes clauses?',
      answer: 'Standard marine insurance policies exclude losses caused by war, strikes, riots, civil commotion, and related perils. You need these additional clauses when shipping through or near conflict zones, politically unstable regions, areas listed by the Joint War Committee as high-risk, or routes with history of labor disputes. Common areas requiring war risk coverage include the Gulf of Aden, Red Sea, and certain ports in the Middle East and Africa. Your insurance broker can advise on current high-risk areas.',
    },
    {
      question: 'How quickly must I report a claim for damaged cargo?',
      answer: 'Most marine insurance policies require immediate notification of any loss or damage - typically within 24-48 hours of discovery. For visible damage noted at delivery, mark it on the delivery receipt and notify the insurer immediately. For concealed damage discovered later, report it as soon as found. Request a survey for significant damage - the survey report is crucial evidence for claims. Delayed notification can result in claim denial. Always preserve damaged goods for inspection until the claim is settled.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration for insurance basis',
    },
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for shipment proof',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Package contents document',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
    {
      name: 'Letter of Credit',
      href: '/documents/letter-of-credit',
      description: 'Payment guarantee requiring insurance',
    },
    {
      name: 'Inspection Certificate',
      href: '/documents/inspection-certificate',
      description: 'Quality verification document',
    },
  ],
};

export default function InsuranceCertificatePage() {
  return (
    <DocumentLayout data={insuranceCertificateData}>
      <InsuranceCertificateGenerator />
    </DocumentLayout>
  );
}
