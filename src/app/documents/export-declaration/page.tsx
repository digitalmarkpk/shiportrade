import { Metadata } from 'next';
import { FileOutput, Building, Globe, CheckCircle } from 'lucide-react';
import ExportDeclarationGenerator from '@/components/documents/ExportDeclarationGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Export Declaration - Free Generator & Template | Shiportrade',
  description: 'Create professional export declarations for international trade. Free template with customs filing details, export license information, and statistical reporting.',
  keywords: [
    'export declaration',
    'customs declaration',
    'export filing',
    'export license',
    'export documentation',
    'customs clearance',
    'shipper\'s export declaration',
    'SED',
    'AES filing',
    'export control',
    'trade statistics',
    'export permit',
  ],
  openGraph: {
    title: 'Export Declaration - Free Generator & Template | Shiportrade',
    description: 'Create professional export declarations for international trade. Free template with customs filing and export license information.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Export Declaration - Free Generator & Template | Shiportrade',
    description: 'Create professional export declarations for international trade.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const exportDeclarationData: DocumentData = {
  title: 'Export Declaration',
  description: 'Generate professional export declarations for your international trade transactions. Our template includes customs filing details, export license information, and statistical reporting requirements.',
  icon: <FileOutput className="h-3 w-3 mr-2" />,
  category: 'Customs Document',
  categoryColor: '#0F4C81',

  whatIs: `An Export Declaration is an official document submitted to customs authorities when goods are exported from a country. It provides detailed information about the goods being shipped, their value, destination, and the parties involved in the transaction. The declaration serves multiple purposes: enabling customs to verify compliance with export regulations, collecting trade statistics for government analysis, ensuring adherence to export control laws and sanctions, and validating that all necessary export licenses are in place. In many countries, electronic filing systems have replaced paper declarations, such as the Automated Export System (AES) in the United States or similar systems in other countries.`,

  whenToUse: `An Export Declaration is required for virtually all commercial exports above certain value thresholds. It must be filed when shipping goods internationally for sale, when sending goods for processing or repair abroad, when exporting samples or gifts above de minimis values, when temporarily exporting goods for exhibitions or demonstrations, and when re-exporting goods previously imported. The declaration should be filed before the goods leave the country, typically at the port of export. Specific timing requirements vary by country - some require filing before goods arrive at the port, others allow filing at the time of export.`,

  keyComponents: [
    {
      name: 'Declaration Number',
      description: 'Unique reference number assigned by customs',
      required: true,
    },
    {
      name: 'Exporter Information',
      description: 'Name, address, and tax ID of the exporter',
      required: true,
    },
    {
      name: 'Consignee Information',
      description: 'Name and address of the foreign buyer/receiver',
      required: true,
    },
    {
      name: 'Goods Description',
      description: 'Detailed description of goods being exported',
      required: true,
    },
    {
      name: 'HS Code',
      description: 'Harmonized System classification code',
      required: true,
    },
    {
      name: 'Quantity & Value',
      description: 'Quantity and customs/value of goods',
      required: true,
    },
    {
      name: 'Country of Destination',
      description: 'Final destination country for the goods',
      required: true,
    },
    {
      name: 'Export License',
      description: 'License number if goods require export authorization',
      required: false,
    },
    {
      name: 'Transport Details',
      description: 'Mode of transport, vessel/flight details',
      required: true,
    },
    {
      name: 'Port of Export',
      description: 'Port through which goods leave the country',
      required: true,
    },
    {
      name: 'Incoterms',
      description: 'Delivery terms for the transaction',
      required: true,
    },
    {
      name: 'Statistical Code',
      description: 'Additional codes for trade statistics',
      required: false,
    },
  ],

  commonMistakes: [
    'Incorrect HS code classification leading to delays or penalties',
    'Undervaluing goods to avoid export duties or taxes',
    'Failing to obtain required export licenses before shipping',
    'Not declaring controlled or dual-use goods properly',
    'Incorrect country of destination or consignee information',
    'Missing filing deadlines before goods arrive at port',
    'Inconsistencies between declaration and shipping documents',
    'Not updating declaration when shipment details change',
    'Using incorrect export codes or statistical classifications',
    'Failing to maintain required export documentation',
  ],

  tips: [
    'File export declarations well before shipment to allow time for corrections',
    'Verify HS codes with official tariff databases before filing',
    'Check if your goods require export licenses or permits',
    'Maintain records of all export declarations for required retention periods',
    'Use customs brokers for complex or high-value shipments',
    'Ensure all shipping documents match the declaration exactly',
    'Screen all parties against denied party/sanctions lists',
    'Understand Incoterms responsibilities for export documentation',
    'Keep up with changes in export control regulations',
    'Consider using export management software for high-volume exports',
  ],

  legalRequirements: [
    {
      region: 'United States',
      requirements: [
        'AES filing required for exports over $2,500',
        'Export Control Classification Number (ECCN) for controlled goods',
        'Denied party screening required',
        'BIS, OFAC compliance for controlled destinations',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'Export Declaration (EX) for non-EU destinations',
        'EORI number required for exporters',
        'Dual-use goods licensing (if applicable)',
        'Exit summary declaration for security',
      ],
    },
    {
      region: 'China',
      requirements: [
        'China Customs declaration required',
        'Export license for controlled goods',
        'Verification with contract/invoice',
        'Foreign exchange verification',
      ],
    },
    {
      region: 'United Kingdom',
      requirements: [
        'GB EORI number required',
        'C88 export declaration',
        'Export licenses for controlled goods',
        'CHIEF or CDS system filing',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the minimum value that requires an export declaration?',
      answer: 'Minimum value thresholds vary by country. In the United States, an export declaration (AES filing) is required for shipments valued over $2,500 per Schedule B number. In the EU, exports to non-EU countries require a declaration regardless of value for statistical purposes, though simplified procedures may apply to low-value shipments. Canada requires export declarations for goods valued over CAD 2,000. Always check your country\'s specific requirements as thresholds can change.',
    },
    {
      question: 'Do I need an export license for my goods?',
      answer: 'Export license requirements depend on the type of goods, their destination, and the end use. Controlled goods (military items, dual-use goods, certain technologies) always require licenses. Some countries have embargoes or sanctions that prohibit exports entirely. High-technology products may require licenses due to potential military applications. Check with your country\'s export control authority: Bureau of Industry and Security (BIS) in the US, Export Control Joint Unit (ECJU) in the UK, or equivalent agencies elsewhere. Classification against control lists determines licensing requirements.',
    },
    {
      question: 'What happens if I make a mistake on my export declaration?',
      answer: 'Errors in export declarations can result in customs delays, fines, penalties, or even criminal prosecution in serious cases. If you discover an error, most customs systems allow you to file an amendment or correction. Prompt voluntary disclosure of errors is generally viewed more favorably than errors discovered during audits. For the US AES system, you can file corrections within specific timeframes. In serious cases involving export control violations, voluntary disclosure programs exist that may mitigate penalties. Always correct errors promptly and maintain good documentation.',
    },
    {
      question: 'How long do I need to keep export declaration records?',
      answer: 'Record retention requirements vary by country and the type of goods. In the United States, exporters must retain export documentation for 5 years from the date of export. The EU requires 3 years minimum retention for customs declarations. For controlled goods, retention may be longer - up to 5 years or more. Best practice is to maintain export records for at least 5 years including the declaration, commercial documents, licenses, and correspondence. Electronic records are acceptable if they meet customs requirements for accessibility and format.',
    },
    {
      question: 'What is the difference between an export declaration and a shipper\'s export declaration?',
      answer: 'Historically, the Shipper\'s Export Declaration (SED) was the paper form used in the United States to declare exports. Today, this has been replaced by electronic filing through the Automated Export System (AES). The term "export declaration" is now more commonly used internationally to refer to the customs document filed when exporting goods. While the terminology differs, both serve the same purpose: providing customs with information about goods being exported for regulatory compliance and statistical purposes.',
    },
    {
      question: 'Can I file an export declaration myself or do I need a customs broker?',
      answer: 'You can file export declarations yourself using your country\'s customs system (AES in the US, CDS in the UK, etc.). However, using a licensed customs broker or freight forwarder offers advantages: they have expertise in classification and compliance, they stay current with regulatory changes, they can handle complex shipments, and they have established relationships with customs. For routine exports of straightforward goods, self-filing is manageable. For controlled goods, high-value shipments, or unfamiliar destinations, professional assistance is advisable.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration matching export declaration',
    },
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document for shipment',
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
      name: 'Dangerous Goods Declaration',
      href: '/documents/dangerous-goods-declaration',
      description: 'Declaration for hazardous cargo',
    },
    {
      name: 'Shipping Instructions',
      href: '/documents/shipping-instructions',
      description: 'Carrier instructions for shipment',
    },
  ],
};

export default function ExportDeclarationPage() {
  return (
    <DocumentLayout data={exportDeclarationData}>
      <ExportDeclarationGenerator />
    </DocumentLayout>
  );
}
