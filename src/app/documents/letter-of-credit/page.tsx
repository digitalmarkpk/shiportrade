import { Metadata } from 'next';
import { FileCheck, Banknote, Shield, Clock } from 'lucide-react';
import LetterOfCreditGenerator from '@/components/documents/LetterOfCreditGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Letter of Credit - Free Generator & Template | Shiportrade',
  description: 'Create professional Letters of Credit for international trade transactions. Free template with bank requirements, shipping terms, document requirements, and payment conditions.',
  keywords: [
    'letter of credit',
    'L/C',
    'documentary credit',
    'trade finance',
    'bank guarantee',
    'payment security',
    'international payment',
    'export payment',
    'import payment',
    'trade document',
    'UCP 600',
    'irrevocable credit',
  ],
  openGraph: {
    title: 'Letter of Credit - Free Generator & Template | Shiportrade',
    description: 'Create professional Letters of Credit for international trade transactions. Free template with bank requirements and payment conditions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Letter of Credit - Free Generator & Template | Shiportrade',
    description: 'Create professional Letters of Credit for international trade transactions.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const letterOfCreditData: DocumentData = {
  title: 'Letter of Credit',
  description: 'Generate professional Letters of Credit for your international trade transactions. Our comprehensive template includes bank requirements, shipping terms, document specifications, and payment conditions.',
  icon: <FileCheck className="h-3 w-3 mr-2" />,
  category: 'Trade Finance Document',
  categoryColor: '#2E8B57',

  whatIs: `A Letter of Credit (L/C) is a financial document issued by a bank that guarantees payment to a seller (beneficiary) provided that specific terms and conditions are met. It serves as a bank's promise to pay the seller upon presentation of compliant documents, effectively replacing the buyer's credit risk with the bank's credit risk. The L/C is one of the most secure payment methods in international trade, protecting both the buyer (who only pays when documents prove the goods were shipped as agreed) and the seller (who receives a bank's guarantee of payment). Letters of Credit are governed by the Uniform Customs and Practice for Documentary Credits (UCP 600), published by the International Chamber of Commerce.`,

  whenToUse: `A Letter of Credit is recommended when trading with new or unknown partners, when dealing with countries with unstable economic or political conditions, when the transaction value is significant and the risk of non-payment is high, when local regulations or currency controls require bank-mediated payments, when the seller requires payment security before producing or shipping goods, and when the buyer wants assurance that documents will be presented before payment is made. L/Cs are particularly useful in high-value transactions and when trading with countries with less developed banking systems or legal frameworks.`,

  keyComponents: [
    {
      name: 'L/C Number',
      description: 'Unique identifier assigned by the issuing bank',
      required: true,
    },
    {
      name: 'Applicant (Buyer)',
      description: 'Complete details of the buyer/importer requesting the L/C',
      required: true,
    },
    {
      name: 'Beneficiary (Seller)',
      description: 'Complete details of the seller/exporter receiving payment',
      required: true,
    },
    {
      name: 'Issuing Bank',
      description: 'Bank issuing the L/C on behalf of the applicant',
      required: true,
    },
    {
      name: 'Advising Bank',
      description: 'Bank in beneficiary\'s country that authenticates the L/C',
      required: false,
    },
    {
      name: 'L/C Amount',
      description: 'Maximum amount payable under the credit',
      required: true,
    },
    {
      name: 'Expiry Date & Place',
      description: 'Date and location where the L/C expires',
      required: true,
    },
    {
      name: 'Latest Shipment Date',
      description: 'Deadline for shipment of goods',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of goods being traded',
      required: true,
    },
    {
      name: 'Required Documents',
      description: 'List of documents beneficiary must present',
      required: true,
    },
    {
      name: 'Terms & Conditions',
      description: 'Specific conditions for payment or negotiation',
      required: true,
    },
    {
      name: 'Presentation Period',
      description: 'Time allowed for document presentation after shipment',
      required: true,
    },
  ],

  commonMistakes: [
    'Documents not matching L/C terms exactly - banks are strict about discrepancies',
    'Missing the presentation deadline for documents after shipment',
    'Shipment date after the latest shipment date specified in L/C',
    'Partial shipments or transshipments when not allowed',
    'Documents inconsistent with each other (dates, quantities, descriptions)',
    'Not understanding the difference between irrevocable and revocable credits',
    'Failing to request amendments when terms cannot be met',
    'Submitting documents to wrong bank or location',
    'Not allowing enough time for document preparation and presentation',
    'Overlooking bank fees and confirmation charges',
  ],

  tips: [
    'Always request an irrevocable L/C for maximum security',
    'Keep L/C terms simple and avoid excessive documentation requirements',
    'Allow reasonable time between shipment date and expiry date for document preparation',
    'Request transferable L/C if you need to transfer rights to another supplier',
    'Review all documents against L/C terms before presentation to avoid discrepancies',
    'Consider adding a confirming bank for additional security in risky markets',
    'Understand the difference between sight and usance (deferred payment) credits',
    'Work with banks experienced in international trade finance',
    'Keep copies of all presented documents and bank communications',
    'Factor in L/C costs when negotiating prices with trading partners',
  ],

  legalRequirements: [
    {
      region: 'UCP 600 (International)',
      requirements: [
        'Governs all documentary credits worldwide',
        'Banks deal in documents, not goods',
        'Strict compliance required',
        'Standard examination period: 5 banking days',
      ],
    },
    {
      region: 'United States',
      requirements: [
        'UCC Article 5 for domestic transactions',
        'UCP 600 for international transactions',
        'Bank liability limited to document examination',
        'Fraud exception applies in extreme cases',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'UCP 600 as primary governing rules',
        'EU banking regulations apply',
        'Currency regulations for non-EU payments',
        'Anti-money laundering compliance',
      ],
    },
    {
      region: 'Asia-Pacific',
      requirements: [
        'UCP 600 widely adopted',
        'Local banking regulations may apply',
        'Currency controls in some countries',
        'Central bank approval may be needed',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between a revocable and irrevocable Letter of Credit?',
      answer: 'An Irrevocable Letter of Credit cannot be cancelled or amended without the consent of all parties (issuing bank, confirming bank if any, and beneficiary). This provides the beneficiary with security that payment will be made if compliant documents are presented. A Revocable Letter of Credit can be cancelled or amended by the issuing bank at any time without notice to the beneficiary. Revocable L/Cs provide no security to the seller and are rarely used in modern trade. Under UCP 600, all credits are deemed irrevocable unless otherwise stated.',
    },
    {
      question: 'What is a confirmed Letter of Credit and when should I use one?',
      answer: 'A Confirmed Letter of Credit adds a second bank\'s guarantee (usually in the beneficiary\'s country) to the original issuing bank\'s commitment. The confirming bank independently guarantees payment regardless of whether the issuing bank pays. This is recommended when dealing with banks in countries with political or economic instability, when the issuing bank is unknown or has limited international standing, or when the transaction value is very large. Confirmation provides an additional layer of security for the beneficiary.',
    },
    {
      question: 'What happens if there are discrepancies in the documents?',
      answer: 'When documents contain discrepancies (errors or inconsistencies with L/C terms), the bank will reject the documents and give notice to the presenter. Common options include: correcting the documents and re-presenting them (if time permits), requesting a waiver from the applicant (buyer), or asking the bank to seek approval from the issuing bank. If discrepancies are not resolved, the bank is not obligated to pay. Always check documents carefully before presentation to avoid these issues.',
    },
    {
      question: 'What is the difference between sight and usance Letters of Credit?',
      answer: 'A Sight Letter of Credit requires payment to be made immediately upon presentation of compliant documents. The beneficiary receives payment as soon as the bank determines documents are in order. A Usance (or Deferred Payment) Letter of Credit allows payment at a future date, typically 30, 60, 90, or 180 days after presentation or shipment. This provides the buyer with credit terms while still giving the seller the security of a bank guarantee. The beneficiary can often discount a usance L/C to receive immediate payment at a discount.',
    },
    {
      question: 'How long do I have to present documents after shipment?',
      answer: 'Under UCP 600, if no specific presentation period is stated, documents must be presented within 21 calendar days after the date of shipment, but in any case not later than the expiry date of the credit. Many L/Cs specify a shorter period (e.g., 15 days). It\'s important to allow sufficient time between the shipment date and expiry date to prepare and present documents. Always check the specific terms in your L/C, as banks are strict about presentation deadlines.',
    },
    {
      question: 'What documents are typically required under a Letter of Credit?',
      answer: 'Common documents required under an L/C include: Commercial Invoice (signed, in required number of copies), Bill of Lading or transport document (clean, shipped on board), Packing List, Certificate of Origin, Insurance Certificate or Policy (if CIF terms), Inspection Certificate (if required), Weight/Quality Certificate, and Beneficiary\'s Certificate. The specific documents and their requirements should match the trade terms and buyer\'s needs. Always review document requirements carefully and ensure you can obtain all documents before accepting L/C terms.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration for L/C presentation',
    },
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for L/C',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Package contents document',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of origin for L/C',
    },
    {
      name: 'Insurance Certificate',
      href: '/documents/insurance-certificate',
      description: 'Cargo insurance proof',
    },
    {
      name: 'Pro-forma Invoice',
      href: '/documents/pro-forma-invoice',
      description: 'Preliminary invoice for L/C application',
    },
  ],
};

export default function LetterOfCreditPage() {
  return (
    <DocumentLayout data={letterOfCreditData}>
      <LetterOfCreditGenerator />
    </DocumentLayout>
  );
}
