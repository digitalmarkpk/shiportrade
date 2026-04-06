import { Metadata } from 'next';
import { Ship, Container, Anchor, Send } from 'lucide-react';
import { ShippingInstructionsGenerator } from '@/components/documents/ShippingInstructionsGenerator';
import DocumentLayout, { DocumentData } from '@/components/documents/DocumentLayout';

export const metadata: Metadata = {
  title: 'Shipping Instructions - Free Generator & Template | Shiportrade',
  description: 'Create professional Shipping Instructions (SI) for ocean freight bookings. Free template with shipper, consignee, container details, hazardous materials, and temperature requirements.',
  keywords: [
    'shipping instructions',
    'SI form',
    'ocean freight booking',
    'export documentation',
    'container booking',
    'bill of lading',
    'hazardous materials',
    'reefer cargo',
    'IMO declaration',
    'shipping document',
    'carrier instructions',
    'freight forwarding',
  ],
  openGraph: {
    title: 'Shipping Instructions - Free Generator & Template | Shiportrade',
    description: 'Create professional Shipping Instructions (SI) for ocean freight bookings. Free template with container details and cargo requirements.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Shiportrade',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shipping Instructions - Free Generator & Template | Shiportrade',
    description: 'Create professional Shipping Instructions (SI) for ocean freight bookings.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

const shippingInstructionsData: DocumentData = {
  title: 'Shipping Instructions',
  description: 'Generate comprehensive Shipping Instructions (SI) for your ocean freight bookings. Our template includes shipper and consignee details, container specifications, hazardous material declarations, and temperature requirements.',
  icon: <Ship className="h-3 w-3 mr-2" />,
  category: 'Ocean Freight Document',
  categoryColor: '#0F4C81',

  whatIs: `Shipping Instructions (SI) are formal instructions provided by the shipper to the carrier or freight forwarder detailing how cargo should be handled and documented. The SI is the primary document used to prepare the Bill of Lading and contains all essential information about the shipment including parties involved, cargo details, routing, and any special handling requirements. Accurate and timely submission of shipping instructions is critical for smooth cargo operations, as errors or delays can result in B/L amendments, shipment rollovers, additional charges, or cargo misrouting. The SI essentially tells the carrier "this is exactly what we're shipping and how we want it documented."`,

  whenToUse: `Shipping Instructions must be submitted for every ocean freight export shipment. They should be provided after booking confirmation but before the carrier's SI cutoff deadline. Typical cutoff times are 48-72 hours before vessel arrival at the port of loading, though this varies by carrier and port. For hazardous materials, earlier submission (24-48 hours before normal cutoff) is required to allow for dangerous goods review. For reefer cargo, temperature settings must be specified early to ensure proper container preparation. Always check the specific SI deadline in your booking confirmation to avoid late submission penalties.`,

  keyComponents: [
    {
      name: 'Booking Reference',
      description: 'Carrier or forwarder booking number',
      required: true,
    },
    {
      name: 'Shipper Details',
      description: 'Complete name, address, and contact information',
      required: true,
    },
    {
      name: 'Consignee Details',
      description: 'Receiver name and address or "TO ORDER"',
      required: true,
    },
    {
      name: 'Notify Party',
      description: 'Party to be notified upon arrival',
      required: false,
    },
    {
      name: 'Vessel & Voyage',
      description: 'Name of vessel and voyage number',
      required: true,
    },
    {
      name: 'Port Details',
      description: 'Port of loading, discharge, and final destination',
      required: true,
    },
    {
      name: 'Container Details',
      description: 'Container number, type, and seal number',
      required: true,
    },
    {
      name: 'Cargo Description',
      description: 'Detailed description of goods being shipped',
      required: true,
    },
    {
      name: 'Weights & Measurements',
      description: 'Gross weight and package dimensions',
      required: true,
    },
    {
      name: 'HS Codes',
      description: 'Harmonized System codes for cargo classification',
      required: true,
    },
    {
      name: 'DG Declaration',
      description: 'Dangerous goods classification if applicable',
      required: false,
    },
    {
      name: 'Temperature Settings',
      description: 'Required temperature and ventilation for reefers',
      required: false,
    },
  ],

  commonMistakes: [
    'Missing SI cutoff deadline resulting in shipment rollover',
    'Container number typos or mismatched with physical container',
    'Incorrect weights not matching VGM declaration',
    'Wrong HS codes causing customs classification issues',
    'Inadequate cargo description for B/L preparation',
    'Forgetting to specify freight payment terms (prepaid/collect)',
    'Not declaring hazardous materials properly',
    'Missing temperature requirements for reefer cargo',
    'Consignee details not matching letter of credit requirements',
    'Late submission of DG documentation causing delays',
  ],

  tips: [
    'Submit SI well before the cutoff deadline to allow time for corrections',
    'Double-check container numbers against the physical container',
    'Ensure weights match VGM submission exactly',
    'Use consistent cargo descriptions across all shipping documents',
    'Include HS codes to facilitate customs processing',
    'For DG cargo, submit IMO declaration with shipping instructions',
    'Specify reefer temperature requirements in Celsius with tolerance',
    'Match consignee details exactly with L/C requirements if applicable',
    'Request SI amendment immediately if errors are discovered',
    'Keep copies of submitted SI and any amendments',
  ],

  legalRequirements: [
    {
      region: 'United States',
      requirements: [
        '24-hour rule: SI before cargo loading',
        'VGM requirement before vessel loading',
        'AMS filing for security clearance',
        'ISF 10+2 filing requirement',
      ],
    },
    {
      region: 'European Union',
      requirements: [
        'ENS filing 24 hours before loading',
        'ICS2 security filing requirements',
        'Container weight verification',
        'DG documentation compliance',
      ],
    },
    {
      region: 'China',
      requirements: [
        'Pre-booking required for exports',
        'Chinese customs filing requirements',
        'DG approval before booking',
        'VGM requirement at port',
      ],
    },
    {
      region: 'International',
      requirements: [
        'SOLAS VGM requirement worldwide',
        'IMDG code for dangerous goods',
        'Carrier-specific SI formats',
        'Port authority requirements',
      ],
    },
  ],

  faqs: [
    {
      question: 'What is the SI cutoff and why is it important?',
      answer: 'The SI (Shipping Instructions) cutoff is the deadline by which shipping instructions must be submitted to the carrier. It is typically 48-72 hours before vessel arrival at the port of loading. Missing this deadline can result in: shipment rollover to the next vessel, additional documentation fees, B/L amendment charges, or cargo being shut out entirely. Carriers need time to process SI, prepare stowage plans, submit customs filings (AMS, ENS), and prepare B/L drafts. Always check your booking confirmation for the exact SI cutoff.',
    },
    {
      question: 'What happens if I need to change my shipping instructions after submission?',
      answer: 'Changes to shipping instructions after submission typically require an SI amendment. If the B/L has already been drafted or issued, you may need a B/L amendment as well. Minor changes (typos, minor description adjustments) are usually straightforward. Major changes (consignee, container number, weight) may require verification and carrier approval. Amendment fees typically apply, ranging from $50-200 or more depending on the carrier. Changes requested after vessel departure are more complex and expensive. Always review SI confirmation promptly and report errors immediately.',
    },
    {
      question: 'What information is required for hazardous materials in shipping instructions?',
      answer: 'For hazardous/dangerous goods shipments, the SI must include: UN Number (UNXXXX), Proper Shipping Name as per IMDG Code, Hazard Class (1-9), Packing Group if applicable, Flashpoint for flammable liquids, Marine Pollutant status, Limited Quantity or Excepted Quantity information if applicable, Emergency contact details, and Container type compliance (e.g., suitable for DG). A separate IMO Dangerous Goods Declaration form is typically required. DG SI should be submitted 24-48 hours before normal cutoff to allow carrier safety review. Incorrect or missing DG information can result in cargo rejection or substantial fines.',
    },
    {
      question: 'What temperature information is needed for reefer cargo?',
      answer: 'For reefer containers, specify: Set temperature in Celsius (e.g., -18°C for frozen, +2°C for chilled), Temperature tolerance/limits, Ventilation setting in CBM/hour if required, Humidity requirements if applicable, Atmosphere requirements (CA containers), Pre-cooling requirements, and Any special instructions (e.g., "do not freeze", "defrost cycle settings"). Request container pre-trip inspection (PTI) and ensure the container is pre-cooled before loading. Incorrect temperature settings can damage cargo beyond recovery, so always verify with the product specifications.',
    },
    {
      question: 'How do shipping instructions relate to the Bill of Lading?',
      answer: 'Shipping Instructions are the shipper\'s input document that the carrier uses to prepare the Bill of Lading. The information in the SI forms the basis of the B/L: shipper, consignee, notify party, vessel details, ports, cargo description, weights, and special instructions. The carrier will typically send a B/L draft for the shipper to review before issuing the final B/L. Any errors in the SI will appear in the B/L unless caught during draft review. Always review B/L drafts carefully against your original SI to catch discrepancies before final issuance.',
    },
    {
      question: 'What is VGM and how does it relate to shipping instructions?',
      answer: 'VGM (Verified Gross Mass) is the certified total weight of a packed container required under SOLAS regulations. The VGM must be submitted to the terminal/carrier before container loading. The weight in your SI should match the VGM declaration. Discrepancies can cause delays, additional weighing charges, or loading refusal. VGM can be obtained by: Method 1 - weighing the packed container, or Method 2 - weighing all cargo/packing and adding container tare weight. The shipper is responsible for VGM accuracy. Include the VGM method and certified weight in your shipping documentation.',
    },
  ],

  relatedDocuments: [
    {
      name: 'Bill of Lading',
      href: '/documents/bill-of-lading',
      description: 'Transport document issued based on SI',
    },
    {
      name: 'Dangerous Goods Declaration',
      href: '/documents/dangerous-goods-declaration',
      description: 'Required for hazardous cargo',
    },
    {
      name: 'Commercial Invoice',
      href: '/documents/commercial-invoice',
      description: 'Value declaration for customs',
    },
    {
      name: 'Packing List',
      href: '/documents/packing-list',
      description: 'Package contents document',
    },
    {
      name: 'Export Declaration',
      href: '/documents/export-declaration',
      description: 'Customs export filing',
    },
    {
      name: 'Certificate of Origin',
      href: '/documents/certificate-of-origin',
      description: 'Proof of goods origin country',
    },
  ],
};

export default function ShippingInstructionsPage() {
  return (
    <DocumentLayout data={shippingInstructionsData}>
      <ShippingInstructionsGenerator />
    </DocumentLayout>
  );
}
