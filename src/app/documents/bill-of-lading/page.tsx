import { Metadata } from 'next';
import { Anchor, Ship, FileCheck, AlertTriangle } from 'lucide-react';
import BillOfLadingGenerator from '@/components/documents/BillOfLadingGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Bill of Lading - Free Generator & Template | Shiportrade',
  description: 'Create professional Bills of Lading for ocean freight shipments. Free template with vessel details, container information, cargo descriptions, and freight terms.',
  keywords: [
    'bill of lading',
    'B/L generator',
    'ocean bill of lading',
    'shipping document',
    'transport document',
    'marine transport',
    'ocean freight',
    'container shipping',
    'export documentation',
    'import documentation',
    'letter of credit',
    'seaway bill',
    'telex release',
  ],
  openGraph: {
    title: 'Bill of Lading - Free Generator & Template | Shiportrade',
    description: 'Create professional Bills of Lading for ocean freight shipments. Free template with vessel details, container information, and freight terms.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bill of Lading - Free Generator & Template | Shiportrade',
    description: 'Create professional Bills of Lading for ocean freight shipments. Free template with vessel details, container information, and freight terms.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const billOfLadingData: DocumentData = {
  title: 'Bill of Lading',
  description: 'Generate professional Bills of Lading for your ocean freight shipments. Our comprehensive template includes shipper/consignee details, vessel information, container specifications, and complete cargo descriptions for international trade.',
  icon: <Anchor className="h-3 w-3 mr-2" />,
  category: 'Ocean Freight Document',
  categoryColor: '#0F4C81',

  whatIs: `A Bill of Lading (B/L) is a critical legal document issued by a carrier or their agent that serves multiple essential functions in international ocean freight shipping. It acts as a receipt for cargo received by the carrier, a contract of carriage between the shipper and the carrier, and most importantly, a document of title that represents ownership of the goods. The Bill of Lading details the type, quantity, and destination of the goods being shipped, and it must accompany the shipment throughout its journey. When goods are delivered, the Bill of Lading must be surrendered by the consignee to take possession of the cargo. This document is fundamental to international trade finance, as it enables the transfer of ownership and is often required for letter of credit transactions.`,

  whenToUse: `A Bill of Lading is required for every ocean freight shipment and serves as the primary transport document in sea-based international trade. It should be used when shipping goods via ocean carriers, whether as Full Container Load (FCL) or Less than Container Load (LCL), when letter of credit transactions require a transport document, when the buyer needs proof of shipment for insurance or regulatory purposes, and when goods need to be transferred or sold while in transit. The B/L is also essential for customs clearance at the destination port and must be presented to release the cargo. Different types of Bills of Lading are used depending on the specific requirements of the transaction.`,

  keyComponents: [
    {
      name: 'B/L Number',
      description: 'Unique identifier assigned by the carrier for tracking',
      required: true,
    },
    {
      name: 'Shipper Information',
      description: 'Complete details of the exporter including name, address, and contact',
      required: true,
    },
    {
      name: 'Consignee Information',
      description: 'Name and address of the receiver or "TO ORDER" for negotiable B/Ls',
      required: true,
    },
    {
      name: 'Notify Party',
      description: 'Party to be notified upon vessel arrival at destination',
      required: false,
    },
    {
      name: 'Vessel & Voyage Details',
      description: 'Name of the carrying vessel and voyage number',
      required: true,
    },
    {
      name: 'Port of Loading',
      description: 'Port where goods are loaded onto the vessel',
      required: true,
    },
    {
      name: 'Port of Discharge',
      description: 'Port where goods are unloaded from the vessel',
      required: true,
    },
    {
      name: 'Container Details',
      description: 'Container number, type, and seal number',
      required: true,
    },
    {
      name: 'Cargo Description',
      description: 'Detailed description of goods including marks, numbers, and quantities',
      required: true,
    },
    {
      name: 'Weight & Measurement',
      description: 'Gross weight and volume/cubic measurement of cargo',
      required: true,
    },
    {
      name: 'Freight Terms',
      description: 'Whether freight is prepaid or collect',
      required: true,
    },
    {
      name: 'Number of Originals',
      description: 'Number of original B/Ls issued (typically 3)',
      required: true,
    },
  ],

  commonMistakes: [
    'Incorrect or misspelled shipper/consignee names causing delivery issues',
    'Failing to match container and seal numbers with actual container',
    'Not declaring the correct B/L type (Original, Seaway, Telex Release)',
    'Omitting "TO ORDER" when B/L needs to be negotiable',
    'Discrepancies between B/L details and other shipping documents',
    'Incorrect freight terms (prepaid vs collect) based on Incoterms',
    'Missing notify party causing delays in cargo release',
    'Not verifying VGM (Verified Gross Mass) matches B/L weight',
    'Using outdated carrier booking terms and conditions',
  ],

  tips: [
    'Always verify container and seal numbers against the physical container before signing',
    'Ensure the B/L type matches your trade requirements - Original B/L for L/C, Seaway for faster release',
    'Request "Clean B/L" - without adverse remarks about cargo condition',
    'Keep all original B/Ls in secure, separate locations during transit',
    'For "TO ORDER" B/Ls, ensure proper endorsement chain for title transfer',
    'Verify VGM submission matches the weight declared on the B/L',
    'Check carrier\'s standard trading conditions for liability limitations',
    'Request claused B/L amendments immediately if discrepancies are found',
    'Use telex release for faster cargo release when original B/Ls can\'t reach destination in time',
  ],

  legalRequirements: [
    {
      region: 'International Convention',
      requirements: [
        'Hague-Visby Rules or Hamburg Rules apply',
        'Carrier liability limitations defined',
        'Package limitation for cargo claims',
        'One-year time limit for cargo claims',
      ],
    },
    {
      region: 'United States',
      requirements: [
        'Federal Maritime Commission (FMC) regulations',
        'Carriage of Goods by Sea Act (COGSA)',
        'AMS filing for US imports required',
        'ISF 10+2 filing before loading',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'EU Customs Security Programme (ICS2)',
        'Entry Summary Declaration (ENS)',
        'EU Maritime Safety Regulations',
        'Carrier liability under EU law',
      ],
    },
    {
      region: 'China',
      requirements: [
        'Maritime Code of PRC applies',
        'China Customs advance filing',
        'NVOCC registration required',
        'Carrier liability limitations',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the difference between an Original B/L, Seaway Bill, and Telex Release?',
      answer: 'An Original Bill of Lading is a negotiable document of title that must be surrendered at destination to release cargo. It\'s required for letter of credit transactions and allows the sale of goods while in transit. A Seaway Bill is non-negotiable and allows cargo release without presenting original documents - faster but offers less control. A Telex Release is an electronic message sent by the origin carrier to the destination agent, allowing cargo release without original B/L presentation - useful when originals can\'t reach destination in time.',
    },
    {
      question: 'What does "TO ORDER" mean on a Bill of Lading?',
      answer: '"TO ORDER" on a Bill of Lading makes it a negotiable document of title, meaning ownership can be transferred through endorsement. "TO ORDER OF SHIPPER" means the shipper must endorse the B/L to transfer title. "TO ORDER OF [BANK]" means the named bank must endorse to transfer title. "TO ORDER OF CONSIGNEE" means the consignee can transfer title. Without "TO ORDER", the B/L is non-negotiable and cargo can only be released to the named consignee.',
    },
    {
      question: 'What is a Clean B/L versus a Claused B/L?',
      answer: 'A Clean Bill of Lading indicates that the cargo was received in apparent good order and condition without any adverse remarks or qualifications. This is preferred for letter of credit transactions and cargo insurance. A Claused Bill of Lading (also called "Dirty" or "Foul" B/L) contains notations about damaged packaging, shortages, or other discrepancies. Banks typically reject claused B/Ls under letters of credit unless specifically authorized. Always inspect cargo before accepting and note any issues on the B/L.',
    },
    {
      question: 'Who issues the Bill of Lading - the carrier or the freight forwarder?',
      answer: 'Both can issue Bills of Lading. A Master Bill of Lading (MBL) is issued by the ocean carrier directly to the shipper or freight forwarder. A House Bill of Lading (HBL) is issued by a freight forwarder or NVOCC to the actual shipper. In consolidated shipments, the HBL covers cargo from shipper to forwarder\'s destination agent, while the MBL covers the container from origin to destination port. Both have legal standing, but MBLs are typically required for bank presentations under L/Cs.',
    },
    {
      question: 'How do I correct an error on a Bill of Lading?',
      answer: 'Minor errors can be corrected by requesting a B/L amendment from the carrier. The carrier will issue an amendment letter or revised B/L. Major changes may require surrendering the original B/L and issuing a new one. Never alter a B/L yourself - this is fraud. For L/C transactions, amendments must comply with L/C terms. Report errors immediately as amendments become more difficult after the vessel departs. Some carriers charge amendment fees.',
    },
    {
      question: 'What happens if the original Bill of Lading is lost?',
      answer: 'If an original B/L is lost, you must notify the carrier immediately. The carrier typically requires: a letter of indemnity (LOI) with bank countersignature, an insurance guarantee covering the carrier for potential claims, publication of a B/L loss notice in newspapers, and sometimes a cash deposit or bank guarantee. The carrier may then issue a replacement B/L or release cargo against the LOI. Prevention is key - keep originals in secure, separate locations.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration for customs clearance',
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
      name: 'Shipping Instructions',
      href: '/documents/shipping-instructions',
      description: 'Instructions to carrier for shipment',
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

export default function BillOfLadingPage() {
  return (
    <DocumentLayout data={billOfLadingData}>
      <BillOfLadingGenerator />
    </DocumentLayout>
  );
}
