// Document Field Configurations for all 120+ documents
// Each document has specific fields organized by sections

export interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'currency';
  placeholder?: string;
  required?: boolean;
  section?: string;
  options?: { value: string; label: string }[];
}

export interface DocumentFieldConfig {
  fields: DocumentField[];
  description: string;
}

// =====================================================
// TRADE DOCUMENTS
// =====================================================

export const documentFieldConfigs: Record<string, DocumentFieldConfig> = {
  // ==================== TRADE DOCUMENTS ====================
  "commercial-invoice": {
    description: "Generate professional commercial invoices for international trade transactions.",
    fields: [
      { id: "invoiceNumber", label: "Invoice Number", type: "text", placeholder: "INV-2024-001", required: true, section: "Invoice Details" },
      { id: "invoiceDate", label: "Invoice Date", type: "date", required: true, section: "Invoice Details" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "Net 30, L/C at sight", section: "Invoice Details" },
      { id: "incoterms", label: "Incoterms", type: "text", placeholder: "FOB, CIF, DDP", section: "Invoice Details" },
      { id: "sellerName", label: "Seller Company Name", type: "text", required: true, section: "Seller Information" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller Information" },
      { id: "sellerPhone", label: "Seller Phone", type: "text", section: "Seller Information" },
      { id: "sellerEmail", label: "Seller Email", type: "text", section: "Seller Information" },
      { id: "buyerName", label: "Buyer Company Name", type: "text", required: true, section: "Buyer Information" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer Information" },
      { id: "buyerPhone", label: "Buyer Phone", type: "text", section: "Buyer Information" },
      { id: "buyerEmail", label: "Buyer Email", type: "text", section: "Buyer Information" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product Details" },
      { id: "hsCode", label: "HS Code", type: "text", placeholder: "8-digit HS code", section: "Product Details" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Product Details" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Product Details" },
      { id: "totalAmount", label: "Total Amount", type: "currency", required: true, section: "Product Details" },
      { id: "currency", label: "Currency", type: "text", placeholder: "USD, EUR, GBP", required: true, section: "Product Details" },
      { id: "countryOfOrigin", label: "Country of Origin", type: "text", section: "Product Details" },
      { id: "notes", label: "Additional Notes", type: "textarea", section: "Additional Information" },
    ]
  },

  "pro-forma-invoice": {
    description: "Create pro forma invoices for quotations and preliminary billing in international trade.",
    fields: [
      { id: "proformaNumber", label: "Pro Forma Number", type: "text", placeholder: "PI-2024-001", required: true, section: "Document Details" },
      { id: "proformaDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "importerAddress", label: "Importer Address", type: "textarea", required: true, section: "Importer" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Products" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Products" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Products" },
      { id: "totalValue", label: "Total Value", type: "currency", required: true, section: "Products" },
      { id: "currency", label: "Currency", type: "text", placeholder: "USD", required: true, section: "Products" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", section: "Terms" },
      { id: "deliveryTime", label: "Delivery Time", type: "text", placeholder: "30-45 days", section: "Terms" },
      { id: "incoterms", label: "Incoterms 2020", type: "text", section: "Terms" },
    ]
  },

  "packing-list": {
    description: "Generate detailed packing lists for shipping cargo internationally.",
    fields: [
      { id: "packingListNumber", label: "Packing List Number", type: "text", required: true, section: "Document Details" },
      { id: "packingListDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "invoiceRef", label: "Invoice Reference", type: "text", section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "marksAndNumbers", label: "Marks & Numbers", type: "textarea", section: "Cargo Details" },
      { id: "numberOfPackages", label: "Number of Packages", type: "number", required: true, section: "Cargo Details" },
      { id: "packageType", label: "Package Type", type: "text", placeholder: "Cartons, Pallets, Crates", section: "Cargo Details" },
      { id: "description", label: "Goods Description", type: "textarea", required: true, section: "Cargo Details" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo Details" },
      { id: "netWeight", label: "Net Weight (kg)", type: "number", section: "Cargo Details" },
      { id: "measurement", label: "Measurement (CBM)", type: "number", section: "Cargo Details" },
    ]
  },

  "purchase-order": {
    description: "Generate professional purchase orders for international trade transactions.",
    fields: [
      { id: "poNumber", label: "PO Number", type: "text", placeholder: "PO-2024-001", required: true, section: "Order Details" },
      { id: "poDate", label: "Order Date", type: "date", required: true, section: "Order Details" },
      { id: "buyerName", label: "Buyer Company", type: "text", placeholder: "Your company name", required: true, section: "Buyer Information" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer Information" },
      { id: "sellerName", label: "Seller/Supplier Company", type: "text", required: true, section: "Seller Information" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller Information" },
      { id: "itemDescription", label: "Item Description", type: "textarea", required: true, section: "Product Details" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Product Details" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Product Details" },
      { id: "totalAmount", label: "Total Amount", type: "currency", required: true, section: "Product Details" },
      { id: "deliveryDate", label: "Expected Delivery Date", type: "date", section: "Delivery" },
      { id: "deliveryAddress", label: "Delivery Address", type: "textarea", section: "Delivery" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "Net 30, L/C", section: "Terms" },
      { id: "incoterms", label: "Incoterms", type: "text", placeholder: "FOB, CIF", section: "Terms" },
    ]
  },

  "sales-contract": {
    description: "Generate comprehensive international sales contracts.",
    fields: [
      { id: "contractNumber", label: "Contract Number", type: "text", required: true, section: "Contract Details" },
      { id: "contractDate", label: "Contract Date", type: "date", required: true, section: "Contract Details" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Seller" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Goods" },
      { id: "totalValue", label: "Total Contract Value", type: "currency", required: true, section: "Goods" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Goods" },
      { id: "incoterms", label: "Incoterms", type: "text", section: "Delivery Terms" },
      { id: "deliveryPort", label: "Port of Delivery", type: "text", section: "Delivery Terms" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", required: true, section: "Payment" },
      { id: "inspectionClause", label: "Inspection Clause", type: "textarea", section: "Additional Clauses" },
      { id: "forceMajeure", label: "Force Majeure Clause", type: "textarea", section: "Additional Clauses" },
    ]
  },

  "quotation": {
    description: "Create professional price quotations for international trade.",
    fields: [
      { id: "quotationNumber", label: "Quotation Number", type: "text", required: true, section: "Document Details" },
      { id: "quotationDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Document Details" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Seller" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Products" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Products" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Products" },
      { id: "totalValue", label: "Total Value", type: "currency", required: true, section: "Products" },
      { id: "deliveryTime", label: "Delivery Time", type: "text", section: "Terms" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", section: "Terms" },
      { id: "incoterms", label: "Incoterms", type: "text", section: "Terms" },
    ]
  },

  "indent": {
    description: "Generate purchase indent documents for international orders.",
    fields: [
      { id: "indentNumber", label: "Indent Number", type: "text", required: true, section: "Document Details" },
      { id: "indentDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "buyerName", label: "Buyer/Importer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "supplierName", label: "Supplier Name", type: "text", required: true, section: "Supplier" },
      { id: "supplierAddress", label: "Supplier Address", type: "textarea", required: true, section: "Supplier" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Product" },
      { id: "specifications", label: "Specifications", type: "textarea", section: "Product" },
      { id: "deliveryDate", label: "Required Delivery Date", type: "date", section: "Delivery" },
      { id: "deliveryPort", label: "Delivery Port", type: "text", section: "Delivery" },
    ]
  },

  "purchase-agreement": {
    description: "Generate formal purchase agreements for international trade.",
    fields: [
      { id: "agreementNumber", label: "Agreement Number", type: "text", required: true, section: "Document Details" },
      { id: "agreementDate", label: "Agreement Date", type: "date", required: true, section: "Document Details" },
      { id: "effectiveDate", label: "Effective Date", type: "date", required: true, section: "Document Details" },
      { id: "expiryDate", label: "Expiry Date", type: "date", section: "Document Details" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Parties" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Parties" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Parties" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Parties" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Subject Matter" },
      { id: "totalValue", label: "Agreement Value", type: "currency", required: true, section: "Subject Matter" },
      { id: "paymentTerms", label: "Payment Terms", type: "textarea", required: true, section: "Terms & Conditions" },
      { id: "deliveryTerms", label: "Delivery Terms", type: "textarea", section: "Terms & Conditions" },
    ]
  },

  // ==================== SHIPPING DOCUMENTS ====================
  "bill-of-lading": {
    description: "Generate ocean bill of lading documents for sea freight shipments.",
    fields: [
      { id: "blNumber", label: "B/L Number", type: "text", required: true, section: "Document Details" },
      { id: "blDate", label: "B/L Date", type: "date", required: true, section: "Document Details" },
      { id: "bookingNumber", label: "Booking Number", type: "text", section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", section: "Consignee" },
      { id: "notifyParty", label: "Notify Party", type: "text", section: "Notify Party" },
      { id: "notifyAddress", label: "Notify Party Address", type: "textarea", section: "Notify Party" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Vessel & Voyage" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, section: "Vessel & Voyage" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Ports" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Ports" },
      { id: "placeOfReceipt", label: "Place of Receipt", type: "text", section: "Ports" },
      { id: "placeOfDelivery", label: "Place of Delivery", type: "text", section: "Ports" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Cargo Details" },
      { id: "sealNumber", label: "Seal Number", type: "text", section: "Cargo Details" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo Details" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo Details" },
      { id: "measurement", label: "Measurement (CBM)", type: "number", section: "Cargo Details" },
      { id: "numberOfPackages", label: "Number of Packages", type: "number", section: "Cargo Details" },
      { id: "freightTerms", label: "Freight Terms", type: "text", placeholder: "Prepaid / Collect", section: "Freight" },
    ]
  },

  "air-waybill": {
    description: "Generate air waybill documents for air freight shipments.",
    fields: [
      { id: "awbNumber", label: "AWB Number", type: "text", required: true, section: "Document Details" },
      { id: "awbDate", label: "AWB Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "shipperAccount", label: "Shipper Account Number", type: "text", section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "consigneeAccount", label: "Consignee Account Number", type: "text", section: "Consignee" },
      { id: "carrier", label: "Issuing Carrier", type: "text", required: true, section: "Carrier" },
      { id: "flightNumber", label: "Flight Number", type: "text", required: true, section: "Carrier" },
      { id: "departureAirport", label: "Airport of Departure", type: "text", required: true, section: "Routing" },
      { id: "arrivalAirport", label: "Airport of Destination", type: "text", required: true, section: "Routing" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo Details" },
      { id: "numberOfPieces", label: "Number of Pieces", type: "number", required: true, section: "Cargo Details" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo Details" },
      { id: "chargeableWeight", label: "Chargeable Weight", type: "number", section: "Cargo Details" },
      { id: "rateClass", label: "Rate Class", type: "text", section: "Cargo Details" },
      { id: "rate", label: "Rate", type: "currency", section: "Cargo Details" },
    ]
  },

  "sea-waybill": {
    description: "Generate non-negotiable sea waybill documents.",
    fields: [
      { id: "swbNumber", label: "Sea Waybill Number", type: "text", required: true, section: "Document Details" },
      { id: "swbDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Voyage" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, section: "Voyage" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Ports" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Ports" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "measurement", label: "Measurement (CBM)", type: "number", section: "Cargo" },
    ]
  },

  "multimodal-transport": {
    description: "Generate combined transport documents for multimodal shipments.",
    fields: [
      { id: "mtdNumber", label: "MTD Number", type: "text", required: true, section: "Document Details" },
      { id: "mtdDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "placeOfReceipt", label: "Place of Receipt", type: "text", required: true, section: "Routing" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", section: "Routing" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", section: "Routing" },
      { id: "placeOfDelivery", label: "Place of Delivery", type: "text", required: true, section: "Routing" },
      { id: "vesselName", label: "Vessel/Flight Name", type: "text", required: true, section: "Transport" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Cargo" },
    ]
  },

  "truck-waybill": {
    description: "Generate road transport waybill documents.",
    fields: [
      { id: "waybillNumber", label: "Waybill Number", type: "text", required: true, section: "Document Details" },
      { id: "waybillDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "senderName", label: "Sender Name", type: "text", required: true, section: "Sender" },
      { id: "senderAddress", label: "Sender Address", type: "textarea", required: true, section: "Sender" },
      { id: "receiverName", label: "Receiver Name", type: "text", required: true, section: "Receiver" },
      { id: "receiverAddress", label: "Receiver Address", type: "textarea", required: true, section: "Receiver" },
      { id: "carrierName", label: "Carrier Name", type: "text", required: true, section: "Carrier" },
      { id: "vehicleNumber", label: "Vehicle Number", type: "text", section: "Carrier" },
      { id: "driverName", label: "Driver Name", type: "text", section: "Carrier" },
      { id: "origin", label: "Place of Origin", type: "text", required: true, section: "Route" },
      { id: "destination", label: "Place of Destination", type: "text", required: true, section: "Route" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "weight", label: "Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "numberOfPackages", label: "Number of Packages", type: "number", section: "Cargo" },
    ]
  },

  "rail-waybill": {
    description: "Generate rail transport waybill documents.",
    fields: [
      { id: "waybillNumber", label: "Rail Waybill Number", type: "text", required: true, section: "Document Details" },
      { id: "waybillDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "senderName", label: "Sender Name", type: "text", required: true, section: "Sender" },
      { id: "senderAddress", label: "Sender Station", type: "text", required: true, section: "Sender" },
      { id: "receiverName", label: "Receiver Name", type: "text", required: true, section: "Receiver" },
      { id: "receiverAddress", label: "Destination Station", type: "text", required: true, section: "Receiver" },
      { id: "railwayCompany", label: "Railway Company", type: "text", required: true, section: "Carrier" },
      { id: "wagonNumber", label: "Wagon Number", type: "text", section: "Carrier" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "weight", label: "Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "numberOfPackages", label: "Number of Packages", type: "number", section: "Cargo" },
    ]
  },

  "delivery-order": {
    description: "Generate delivery order documents for cargo release.",
    fields: [
      { id: "doNumber", label: "Delivery Order Number", type: "text", required: true, section: "Document Details" },
      { id: "doDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "blRef", label: "B/L Reference", type: "text", required: true, section: "Document Details" },
      { id: "shippingLine", label: "Shipping Line", type: "text", required: true, section: "Issuing Authority" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "containerNumber", label: "Container Number", type: "text", required: true, section: "Cargo Details" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", section: "Cargo Details" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", section: "Cargo Details" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Validity" },
    ]
  },

  "shipping-instructions": {
    description: "Generate shipping instructions for carriers and forwarders.",
    fields: [
      { id: "siNumber", label: "SI Reference Number", type: "text", required: true, section: "Document Details" },
      { id: "siDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "bookingNumber", label: "Booking Number", type: "text", section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "shipperContact", label: "Shipper Contact", type: "text", section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "notifyParty", label: "Notify Party", type: "text", section: "Notify Party" },
      { id: "vesselName", label: "Vessel Name", type: "text", section: "Voyage Details" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", section: "Voyage Details" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Ports" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Ports" },
      { id: "containerType", label: "Container Type", type: "text", placeholder: "40' HC, 20' GP", section: "Container Details" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Container Details" },
      { id: "sealNumber", label: "Seal Number", type: "text", section: "Container Details" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo Details" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo Details" },
      { id: "measurement", label: "Measurement (CBM)", type: "number", section: "Cargo Details" },
      { id: "specialInstructions", label: "Special Instructions", type: "textarea", section: "Special Requirements" },
    ]
  },

  "shippers-letter-of-instruction": {
    description: "Generate shipper's letter of instruction for freight forwarders.",
    fields: [
      { id: "sliNumber", label: "SLI Number", type: "text", required: true, section: "Document Details" },
      { id: "sliDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "exporterEIN", label: "Exporter EIN/Tax ID", type: "text", section: "Exporter" },
      { id: "forwarderName", label: "Forwarder Name", type: "text", required: true, section: "Forwarder" },
      { id: "forwarderAddress", label: "Forwarder Address", type: "textarea", required: true, section: "Forwarder" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "deliveryInstructions", label: "Delivery Instructions", type: "textarea", section: "Instructions" },
      { id: "shippingTerms", label: "Shipping Terms", type: "text", placeholder: "FOB, CIF", section: "Terms" },
      { id: "insuranceRequired", label: "Insurance Required", type: "text", placeholder: "Yes/No", section: "Insurance" },
      { id: "insuranceAmount", label: "Insurance Amount", type: "currency", section: "Insurance" },
      { id: "descriptionOfGoods", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "numberOfPackages", label: "Number of Packages", type: "number", section: "Cargo" },
    ]
  },

  "booking-confirmation": {
    description: "Generate carrier booking confirmation documents.",
    fields: [
      { id: "confirmationNumber", label: "Confirmation Number", type: "text", required: true, section: "Document Details" },
      { id: "confirmationDate", label: "Confirmation Date", type: "date", required: true, section: "Document Details" },
      { id: "bookingNumber", label: "Booking Number", type: "text", required: true, section: "Document Details" },
      { id: "carrierName", label: "Carrier Name", type: "text", required: true, section: "Carrier" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Voyage" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, section: "Voyage" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Ports" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Ports" },
      { id: "etd", label: "ETD", type: "date", required: true, section: "Schedule" },
      { id: "eta", label: "ETA", type: "date", required: true, section: "Schedule" },
      { id: "containerType", label: "Container Type", type: "text", section: "Equipment" },
      { id: "numberOfContainers", label: "Number of Containers", type: "number", section: "Equipment" },
      { id: "cyCutOff", label: "CY Cut-off", type: "date", section: "Cut-offs" },
      { id: "vgmCutOff", label: "VGM Cut-off", type: "date", section: "Cut-offs" },
    ]
  },

  "booking-request": {
    description: "Generate space booking request documents for carriers.",
    fields: [
      { id: "requestNumber", label: "Request Number", type: "text", required: true, section: "Document Details" },
      { id: "requestDate", label: "Request Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "forwarderName", label: "Forwarder Name", type: "text", section: "Forwarder" },
      { id: "carrierName", label: "Carrier Name", type: "text", required: true, section: "Carrier" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Routing" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Routing" },
      { id: "containerType", label: "Container Type Required", type: "text", required: true, section: "Equipment" },
      { id: "numberOfContainers", label: "Number of Containers", type: "number", required: true, section: "Equipment" },
      { id: "commodity", label: "Commodity", type: "text", required: true, section: "Cargo" },
      { id: "grossWeight", label: "Estimated Weight (kg)", type: "number", required: true, section: "Cargo" },
      { id: "preferredETD", label: "Preferred ETD", type: "date", required: true, section: "Schedule" },
      { id: "specialRequirements", label: "Special Requirements", type: "textarea", section: "Requirements" },
    ]
  },

  "cargo-manifest": {
    description: "Generate cargo manifest documents for shipments.",
    fields: [
      { id: "manifestNumber", label: "Manifest Number", type: "text", required: true, section: "Document Details" },
      { id: "manifestDate", label: "Manifest Date", type: "date", required: true, section: "Document Details" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Vessel" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, section: "Vessel" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Ports" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Ports" },
      { id: "totalPackages", label: "Total Packages", type: "number", required: true, section: "Summary" },
      { id: "totalWeight", label: "Total Weight (kg)", type: "number", required: true, section: "Summary" },
      { id: "totalContainers", label: "Total Containers", type: "number", section: "Summary" },
      { id: "cargoDetails", label: "Cargo Details", type: "textarea", required: true, section: "Cargo List" },
    ]
  },

  // ==================== CUSTOMS DOCUMENTS ====================
  "certificate-of-origin": {
    description: "Generate certificates of origin for international trade.",
    fields: [
      { id: "coNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "coDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "producerName", label: "Producer Name", type: "text", section: "Producer" },
      { id: "producerAddress", label: "Producer Address", type: "textarea", section: "Producer" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "importerAddress", label: "Importer Address", type: "textarea", required: true, section: "Importer" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "originCriterion", label: "Origin Criterion", type: "text", section: "Goods" },
      { id: "countryOfOrigin", label: "Country of Origin", type: "text", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "invoiceNumber", label: "Invoice Number", type: "text", section: "Reference" },
      { id: "billOfLading", label: "Bill of Lading Number", type: "text", section: "Reference" },
    ]
  },

  "export-declaration": {
    description: "Generate export customs declaration documents.",
    fields: [
      { id: "declarationNumber", label: "Declaration Number", type: "text", required: true, section: "Document Details" },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true, section: "Document Details" },
      { id: "declarationType", label: "Declaration Type", type: "text", placeholder: "Normal, Simplified", section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "exporterTaxId", label: "Exporter Tax ID", type: "text", required: true, section: "Exporter" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeCountry", label: "Consignee Country", type: "text", required: true, section: "Consignee" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "value", label: "Value", type: "currency", required: true, section: "Goods" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Goods" },
      { id: "countryOfOrigin", label: "Country of Origin", type: "text", section: "Goods" },
      { id: "portOfExit", label: "Port of Exit", type: "text", required: true, section: "Transport" },
      { id: "destinationCountry", label: "Destination Country", type: "text", required: true, section: "Transport" },
    ]
  },

  "import-declaration": {
    description: "Generate import customs declaration documents.",
    fields: [
      { id: "declarationNumber", label: "Declaration Number", type: "text", required: true, section: "Document Details" },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true, section: "Document Details" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "importerAddress", label: "Importer Address", type: "textarea", required: true, section: "Importer" },
      { id: "importerTaxId", label: "Importer Tax ID", type: "text", required: true, section: "Importer" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterCountry", label: "Exporter Country", type: "text", required: true, section: "Exporter" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "value", label: "CIF Value", type: "currency", required: true, section: "Goods" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Goods" },
      { id: "countryOfOrigin", label: "Country of Origin", type: "text", required: true, section: "Goods" },
      { id: "portOfEntry", label: "Port of Entry", type: "text", required: true, section: "Transport" },
      { id: "dutyAmount", label: "Duty Amount", type: "currency", section: "Duties & Taxes" },
      { id: "vatAmount", label: "VAT Amount", type: "currency", section: "Duties & Taxes" },
    ]
  },

  "customs-invoice": {
    description: "Generate customs invoices for import clearance.",
    fields: [
      { id: "invoiceNumber", label: "Invoice Number", type: "text", required: true, section: "Document Details" },
      { id: "invoiceDate", label: "Invoice Date", type: "date", required: true, section: "Document Details" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Seller" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "unitPrice", label: "Unit Price", type: "currency", required: true, section: "Goods" },
      { id: "totalValue", label: "Total Value", type: "currency", required: true, section: "Goods" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Goods" },
      { id: "countryOfOrigin", label: "Country of Origin", type: "text", required: true, section: "Goods" },
      { id: "termsOfSale", label: "Terms of Sale", type: "text", placeholder: "FOB, CIF", section: "Terms" },
    ]
  },

  "customs-bond": {
    description: "Generate customs bond documents.",
    fields: [
      { id: "bondNumber", label: "Bond Number", type: "text", required: true, section: "Document Details" },
      { id: "bondDate", label: "Bond Date", type: "date", required: true, section: "Document Details" },
      { id: "bondType", label: "Bond Type", type: "text", placeholder: "Single, Continuous", required: true, section: "Document Details" },
      { id: "principalName", label: "Principal Name", type: "text", required: true, section: "Principal" },
      { id: "principalAddress", label: "Principal Address", type: "textarea", required: true, section: "Principal" },
      { id: "principalTaxId", label: "Principal Tax ID", type: "text", required: true, section: "Principal" },
      { id: "suretyName", label: "Surety Company", type: "text", required: true, section: "Surety" },
      { id: "suretyAddress", label: "Surety Address", type: "textarea", required: true, section: "Surety" },
      { id: "bondAmount", label: "Bond Amount", type: "currency", required: true, section: "Bond Details" },
      { id: "effectiveDate", label: "Effective Date", type: "date", required: true, section: "Bond Details" },
      { id: "expiryDate", label: "Expiry Date", type: "date", required: true, section: "Bond Details" },
      { id: "customsPort", label: "Customs Port", type: "text", required: true, section: "Jurisdiction" },
    ]
  },

  "duty-exemption": {
    description: "Generate duty exemption certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "applicantName", label: "Applicant Name", type: "text", required: true, section: "Applicant" },
      { id: "applicantAddress", label: "Applicant Address", type: "textarea", required: true, section: "Applicant" },
      { id: "exemptionType", label: "Exemption Type", type: "text", required: true, section: "Exemption" },
      { id: "legalBasis", label: "Legal Basis", type: "text", section: "Exemption" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "value", label: "Value", type: "currency", required: true, section: "Goods" },
      { id: "exemptionAmount", label: "Exemption Amount", type: "currency", section: "Exemption" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Validity" },
    ]
  },

  "re-export-certificate": {
    description: "Generate re-export certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "originalImportRef", label: "Original Import Reference", type: "text", required: true, section: "Reference" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "hsCode", label: "HS Code", type: "text", required: true, section: "Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Goods" },
      { id: "value", label: "Value", type: "currency", required: true, section: "Goods" },
      { id: "destinationCountry", label: "Destination Country", type: "text", required: true, section: "Destination" },
      { id: "reasonForReexport", label: "Reason for Re-export", type: "textarea", required: true, section: "Details" },
    ]
  },

  "transit-document": {
    description: "Generate transit documents for cargo moving through customs territory.",
    fields: [
      { id: "transitNumber", label: "Transit Document Number", type: "text", required: true, section: "Document Details" },
      { id: "transitDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "principalName", label: "Principal Name", type: "text", required: true, section: "Principal" },
      { id: "principalAddress", label: "Principal Address", type: "textarea", required: true, section: "Principal" },
      { id: "carrierName", label: "Carrier Name", type: "text", required: true, section: "Carrier" },
      { id: "placeOfDeparture", label: "Place of Departure", type: "text", required: true, section: "Routing" },
      { id: "placeOfDestination", label: "Place of Destination", type: "text", required: true, section: "Routing" },
      { id: "customsOfficeOfDeparture", label: "Customs Office of Departure", type: "text", required: true, section: "Customs" },
      { id: "customsOfficeOfDestination", label: "Customs Office of Destination", type: "text", required: true, section: "Customs" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Goods" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Goods" },
      { id: "guaranteeAmount", label: "Guarantee Amount", type: "currency", section: "Guarantee" },
    ]
  },

  "ata-carnet": {
    description: "Generate ATA Carnet documents for temporary import/export.",
    fields: [
      { id: "carnetNumber", label: "Carnet Number", type: "text", required: true, section: "Document Details" },
      { id: "carnetDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Document Details" },
      { id: "holderName", label: "Holder Name", type: "text", required: true, section: "Holder" },
      { id: "holderAddress", label: "Holder Address", type: "textarea", required: true, section: "Holder" },
      { id: "issuingChamber", label: "Issuing Chamber", type: "text", required: true, section: "Issuing Authority" },
      { id: "purpose", label: "Purpose", type: "text", placeholder: "Exhibition, Professional Equipment", required: true, section: "Purpose" },
      { id: "destinationCountry", label: "Destination Country", type: "text", required: true, section: "Destination" },
      { id: "goodsDescription", label: "Goods Description", type: "textarea", required: true, section: "Goods" },
      { id: "numberOfItems", label: "Number of Items", type: "number", required: true, section: "Goods" },
      { id: "totalValue", label: "Total Value", type: "currency", required: true, section: "Goods" },
    ]
  },

  "t1-document": {
    description: "Generate T1 transit documents for EU customs transit.",
    fields: [
      { id: "t1Number", label: "T1 Document Number", type: "text", required: true, section: "Document Details" },
      { id: "t1Date", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "declarantName", label: "Declarant Name", type: "text", required: true, section: "Declarant" },
      { id: "declarantAddress", label: "Declarant Address", type: "textarea", required: true, section: "Declarant" },
      { id: "principalName", label: "Principal Name", type: "text", required: true, section: "Principal" },
      { id: "officeOfDeparture", label: "Customs Office of Departure", type: "text", required: true, section: "Customs" },
      { id: "officeOfDestination", label: "Customs Office of Destination", type: "text", required: true, section: "Customs" },
      { id: "placeOfLoading", label: "Place of Loading", type: "text", required: true, section: "Routing" },
      { id: "placeOfUnloading", label: "Place of Unloading", type: "text", required: true, section: "Routing" },
      { id: "goodsDescription", label: "Goods Description", type: "textarea", required: true, section: "Goods" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Goods" },
      { id: "guaranteeNumber", label: "Guarantee Number", type: "text", required: true, section: "Guarantee" },
    ]
  },

  // ==================== FINANCE DOCUMENTS ====================
  "letter-of-credit": {
    description: "Generate letter of credit documents for international trade payments.",
    fields: [
      { id: "lcNumber", label: "LC Number", type: "text", required: true, section: "LC Details" },
      { id: "lcDate", label: "Issue Date", type: "date", required: true, section: "LC Details" },
      { id: "lcType", label: "LC Type", type: "text", placeholder: "Irrevocable, Confirmed", required: true, section: "LC Details" },
      { id: "expiryDate", label: "Expiry Date", type: "date", required: true, section: "LC Details" },
      { id: "expiryPlace", label: "Place of Expiry", type: "text", required: true, section: "LC Details" },
      { id: "applicantName", label: "Applicant Name", type: "text", required: true, section: "Applicant" },
      { id: "applicantAddress", label: "Applicant Address", type: "textarea", required: true, section: "Applicant" },
      { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAddress", label: "Beneficiary Address", type: "textarea", required: true, section: "Beneficiary" },
      { id: "issuingBank", label: "Issuing Bank", type: "text", required: true, section: "Banks" },
      { id: "advisingBank", label: "Advising Bank", type: "text", section: "Banks" },
      { id: "lcAmount", label: "LC Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "tolerance", label: "Tolerance", type: "text", placeholder: "+/- 5%", section: "Amount" },
      { id: "availableWith", label: "Available With", type: "text", required: true, section: "Availability" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "At sight, 30 days", required: true, section: "Availability" },
      { id: "partialShipments", label: "Partial Shipments", type: "text", placeholder: "Allowed/Prohibited", section: "Shipment Terms" },
      { id: "transshipment", label: "Transshipment", type: "text", placeholder: "Allowed/Prohibited", section: "Shipment Terms" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", section: "Shipment Terms" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", section: "Shipment Terms" },
      { id: "latestShipment", label: "Latest Shipment Date", type: "date", section: "Shipment Terms" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "documentsRequired", label: "Documents Required", type: "textarea", required: true, section: "Documents" },
      { id: "additionalConditions", label: "Additional Conditions", type: "textarea", section: "Conditions" },
    ]
  },

  "lc-application": {
    description: "Generate letter of credit application documents.",
    fields: [
      { id: "applicationNumber", label: "Application Number", type: "text", required: true, section: "Document Details" },
      { id: "applicationDate", label: "Application Date", type: "date", required: true, section: "Document Details" },
      { id: "applicantName", label: "Applicant Name", type: "text", required: true, section: "Applicant" },
      { id: "applicantAddress", label: "Applicant Address", type: "textarea", required: true, section: "Applicant" },
      { id: "applicantAccount", label: "Applicant Account Number", type: "text", required: true, section: "Applicant" },
      { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAddress", label: "Beneficiary Address", type: "textarea", required: true, section: "Beneficiary" },
      { id: "beneficiaryBank", label: "Beneficiary Bank", type: "text", section: "Beneficiary" },
      { id: "lcAmount", label: "LC Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "lcType", label: "LC Type Requested", type: "text", required: true, section: "LC Details" },
      { id: "expiryDate", label: "Requested Expiry Date", type: "date", required: true, section: "LC Details" },
      { id: "paymentTerms", label: "Payment Terms", type: "text", required: true, section: "Terms" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "proformaInvoiceRef", label: "Proforma Invoice Reference", type: "text", section: "Reference" },
    ]
  },

  "bank-guarantee": {
    description: "Generate bank guarantee documents.",
    fields: [
      { id: "guaranteeNumber", label: "Guarantee Number", type: "text", required: true, section: "Document Details" },
      { id: "guaranteeDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "guaranteeType", label: "Guarantee Type", type: "text", placeholder: "Performance, Bid, Advance", required: true, section: "Document Details" },
      { id: "applicantName", label: "Applicant Name", type: "text", required: true, section: "Applicant" },
      { id: "applicantAddress", label: "Applicant Address", type: "textarea", required: true, section: "Applicant" },
      { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAddress", label: "Beneficiary Address", type: "textarea", required: true, section: "Beneficiary" },
      { id: "guarantorBank", label: "Guarantor Bank", type: "text", required: true, section: "Guarantor" },
      { id: "guaranteeAmount", label: "Guarantee Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Validity" },
      { id: "underlyingContract", label: "Underlying Contract Reference", type: "text", section: "Reference" },
      { id: "guaranteeTerms", label: "Guarantee Terms", type: "textarea", required: true, section: "Terms" },
    ]
  },

  "standby-lc": {
    description: "Generate standby letter of credit documents.",
    fields: [
      { id: "sblcNumber", label: "SBLC Number", type: "text", required: true, section: "Document Details" },
      { id: "sbLCDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "sbLCType", label: "SBLC Type", type: "text", placeholder: "Performance, Financial", required: true, section: "Document Details" },
      { id: "applicantName", label: "Applicant Name", type: "text", required: true, section: "Applicant" },
      { id: "applicantAddress", label: "Applicant Address", type: "textarea", required: true, section: "Applicant" },
      { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAddress", label: "Beneficiary Address", type: "textarea", required: true, section: "Beneficiary" },
      { id: "issuingBank", label: "Issuing Bank", type: "text", required: true, section: "Bank" },
      { id: "sbLCsAmount", label: "SBLC Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "expiryDate", label: "Expiry Date", type: "date", required: true, section: "Validity" },
      { id: "demandConditions", label: "Demand Conditions", type: "textarea", required: true, section: "Conditions" },
    ]
  },

  "documentary-collection": {
    description: "Generate documentary collection instructions.",
    fields: [
      { id: "collectionNumber", label: "Collection Number", type: "text", required: true, section: "Document Details" },
      { id: "collectionDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "collectionType", label: "Collection Type", type: "text", placeholder: "D/P, D/A", required: true, section: "Document Details" },
      { id: "drawerName", label: "Drawer Name", type: "text", required: true, section: "Drawer" },
      { id: "drawerAddress", label: "Drawer Address", type: "textarea", required: true, section: "Drawer" },
      { id: "draweeName", label: "Drawee Name", type: "text", required: true, section: "Drawee" },
      { id: "draweeAddress", label: "Drawee Address", type: "textarea", required: true, section: "Drawee" },
      { id: "remittingBank", label: "Remitting Bank", type: "text", required: true, section: "Banks" },
      { id: "collectingBank", label: "Collecting Bank", type: "text", section: "Banks" },
      { id: "billAmount", label: "Bill Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "tenor", label: "Tenor", type: "text", placeholder: "At sight, 30 days", section: "Payment" },
      { id: "documentsEnclosed", label: "Documents Enclosed", type: "textarea", required: true, section: "Documents" },
      { id: "specialInstructions", label: "Special Instructions", type: "textarea", section: "Instructions" },
    ]
  },

  "bill-of-exchange": {
    description: "Generate bill of exchange documents.",
    fields: [
      { id: "billNumber", label: "Bill Number", type: "text", required: true, section: "Document Details" },
      { id: "billDate", label: "Date of Issue", type: "date", required: true, section: "Document Details" },
      { id: "placeOfIssue", label: "Place of Issue", type: "text", required: true, section: "Document Details" },
      { id: "drawerName", label: "Drawer Name", type: "text", required: true, section: "Drawer" },
      { id: "drawerAddress", label: "Drawer Address", type: "textarea", required: true, section: "Drawer" },
      { id: "draweeName", label: "Drawee Name", type: "text", required: true, section: "Drawee" },
      { id: "draweeAddress", label: "Drawee Address", type: "textarea", required: true, section: "Drawee" },
      { id: "payeeName", label: "Payee Name", type: "text", required: true, section: "Payee" },
      { id: "billAmount", label: "Bill Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "tenor", label: "Tenor", type: "text", placeholder: "At sight, 30 days after sight", required: true, section: "Payment" },
      { id: "maturityDate", label: "Maturity Date", type: "date", section: "Payment" },
      { id: "placeOfPayment", label: "Place of Payment", type: "text", section: "Payment" },
    ]
  },

  "promissory-note": {
    description: "Generate promissory note documents.",
    fields: [
      { id: "noteNumber", label: "Note Number", type: "text", required: true, section: "Document Details" },
      { id: "noteDate", label: "Date of Issue", type: "date", required: true, section: "Document Details" },
      { id: "placeOfIssue", label: "Place of Issue", type: "text", required: true, section: "Document Details" },
      { id: "makerName", label: "Maker Name", type: "text", required: true, section: "Maker" },
      { id: "makerAddress", label: "Maker Address", type: "textarea", required: true, section: "Maker" },
      { id: "payeeName", label: "Payee Name", type: "text", required: true, section: "Payee" },
      { id: "payeeAddress", label: "Payee Address", type: "textarea", required: true, section: "Payee" },
      { id: "principalAmount", label: "Principal Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "interestRate", label: "Interest Rate (%)", type: "number", section: "Terms" },
      { id: "maturityDate", label: "Maturity Date", type: "date", required: true, section: "Terms" },
      { id: "placeOfPayment", label: "Place of Payment", type: "text", section: "Terms" },
    ]
  },

  "bank-draft": {
    description: "Generate bank draft documents.",
    fields: [
      { id: "draftNumber", label: "Draft Number", type: "text", required: true, section: "Document Details" },
      { id: "draftDate", label: "Date of Issue", type: "date", required: true, section: "Document Details" },
      { id: "issuingBank", label: "Issuing Bank", type: "text", required: true, section: "Bank" },
      { id: "issuingBranch", label: "Issuing Branch", type: "text", section: "Bank" },
      { id: "purchaserName", label: "Purchaser Name", type: "text", required: true, section: "Purchaser" },
      { id: "payeeName", label: "Payee Name", type: "text", required: true, section: "Payee" },
      { id: "payeeAddress", label: "Payee Address", type: "textarea", required: true, section: "Payee" },
      { id: "draftAmount", label: "Draft Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "validUntil", label: "Valid Until", type: "date", section: "Validity" },
    ]
  },

  "wire-transfer-slip": {
    description: "Generate wire transfer confirmation documents.",
    fields: [
      { id: "transferRef", label: "Transfer Reference", type: "text", required: true, section: "Transfer Details" },
      { id: "transferDate", label: "Transfer Date", type: "date", required: true, section: "Transfer Details" },
      { id: "transferType", label: "Transfer Type", type: "text", placeholder: "SWIFT, RTGS, ACH", required: true, section: "Transfer Details" },
      { id: "senderName", label: "Sender Name", type: "text", required: true, section: "Sender" },
      { id: "senderAccount", label: "Sender Account Number", type: "text", required: true, section: "Sender" },
      { id: "senderBank", label: "Sender Bank", type: "text", required: true, section: "Sender" },
      { id: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAccount", label: "Beneficiary Account Number", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryBank", label: "Beneficiary Bank", type: "text", required: true, section: "Beneficiary" },
      { id: "beneficiaryAddress", label: "Beneficiary Bank Address", type: "textarea", section: "Beneficiary" },
      { id: "transferAmount", label: "Transfer Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "exchangeRate", label: "Exchange Rate", type: "number", section: "Amount" },
      { id: "charges", label: "Bank Charges", type: "currency", section: "Charges" },
      { id: "purpose", label: "Purpose of Transfer", type: "textarea", section: "Purpose" },
    ]
  },

  "credit-note": {
    description: "Generate credit note documents for adjustments.",
    fields: [
      { id: "creditNoteNumber", label: "Credit Note Number", type: "text", required: true, section: "Document Details" },
      { id: "creditNoteDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "originalInvoice", label: "Original Invoice Reference", type: "text", required: true, section: "Reference" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Seller" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "reason", label: "Reason for Credit", type: "textarea", required: true, section: "Details" },
      { id: "creditAmount", label: "Credit Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "taxAmount", label: "Tax Amount", type: "currency", section: "Amount" },
    ]
  },

  "debit-note": {
    description: "Generate debit note documents for adjustments.",
    fields: [
      { id: "debitNoteNumber", label: "Debit Note Number", type: "text", required: true, section: "Document Details" },
      { id: "debitNoteDate", label: "Date", type: "date", required: true, section: "Document Details" },
      { id: "originalInvoice", label: "Original Invoice Reference", type: "text", section: "Reference" },
      { id: "sellerName", label: "Seller Name", type: "text", required: true, section: "Seller" },
      { id: "sellerAddress", label: "Seller Address", type: "textarea", required: true, section: "Seller" },
      { id: "buyerName", label: "Buyer Name", type: "text", required: true, section: "Buyer" },
      { id: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, section: "Buyer" },
      { id: "reason", label: "Reason for Debit", type: "textarea", required: true, section: "Details" },
      { id: "debitAmount", label: "Debit Amount", type: "currency", required: true, section: "Amount" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Amount" },
      { id: "taxAmount", label: "Tax Amount", type: "currency", section: "Amount" },
    ]
  },

  // ==================== INSURANCE DOCUMENTS ====================
  "insurance-certificate": {
    description: "Generate marine insurance certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "policyNumber", label: "Open Policy Number", type: "text", section: "Document Details" },
      { id: "insuredName", label: "Insured Name", type: "text", required: true, section: "Insured" },
      { id: "insuredAddress", label: "Insured Address", type: "textarea", required: true, section: "Insured" },
      { id: "insurerName", label: "Insurance Company", type: "text", required: true, section: "Insurer" },
      { id: "sumInsured", label: "Sum Insured", type: "currency", required: true, section: "Coverage" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Coverage" },
      { id: "coverageType", label: "Coverage Type", type: "text", placeholder: "All Risks, FPA, WA", required: true, section: "Coverage" },
      { id: "voyageFrom", label: "Voyage From", type: "text", required: true, section: "Voyage" },
      { id: "voyageTo", label: "Voyage To", type: "text", required: true, section: "Voyage" },
      { id: "vesselName", label: "Vessel Name", type: "text", section: "Voyage" },
      { id: "blDate", label: "B/L Date", type: "date", section: "Voyage" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "marksAndNumbers", label: "Marks & Numbers", type: "text", section: "Goods" },
      { id: "conditions", label: "Conditions", type: "textarea", section: "Terms" },
    ]
  },

  "insurance-policy": {
    description: "Generate full marine insurance policy documents.",
    fields: [
      { id: "policyNumber", label: "Policy Number", type: "text", required: true, section: "Policy Details" },
      { id: "policyDate", label: "Policy Date", type: "date", required: true, section: "Policy Details" },
      { id: "policyType", label: "Policy Type", type: "text", placeholder: "Single Voyage, Open Cover", required: true, section: "Policy Details" },
      { id: "insuredName", label: "Insured Name", type: "text", required: true, section: "Insured" },
      { id: "insuredAddress", label: "Insured Address", type: "textarea", required: true, section: "Insured" },
      { id: "insurerName", label: "Insurance Company", type: "text", required: true, section: "Insurer" },
      { id: "insurerAddress", label: "Insurer Address", type: "textarea", required: true, section: "Insurer" },
      { id: "sumInsured", label: "Sum Insured", type: "currency", required: true, section: "Coverage" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Coverage" },
      { id: "premium", label: "Premium", type: "currency", required: true, section: "Coverage" },
      { id: "coverageClauses", label: "Coverage Clauses", type: "textarea", required: true, section: "Coverage" },
      { id: "voyageDetails", label: "Voyage Details", type: "textarea", required: true, section: "Voyage" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "warranties", label: "Warranties", type: "textarea", section: "Terms" },
      { id: "exclusions", label: "Exclusions", type: "textarea", section: "Terms" },
      { id: "validFrom", label: "Valid From", type: "date", required: true, section: "Validity" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Validity" },
    ]
  },

  "insurance-declaration": {
    description: "Generate open policy declaration documents.",
    fields: [
      { id: "declarationNumber", label: "Declaration Number", type: "text", required: true, section: "Document Details" },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true, section: "Document Details" },
      { id: "policyNumber", label: "Open Policy Number", type: "text", required: true, section: "Document Details" },
      { id: "insuredName", label: "Insured Name", type: "text", required: true, section: "Insured" },
      { id: "insurerName", label: "Insurance Company", type: "text", required: true, section: "Insurer" },
      { id: "sumInsured", label: "Declared Value", type: "currency", required: true, section: "Coverage" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Coverage" },
      { id: "voyageFrom", label: "From", type: "text", required: true, section: "Voyage" },
      { id: "voyageTo", label: "To", type: "text", required: true, section: "Voyage" },
      { id: "vesselName", label: "Vessel Name", type: "text", section: "Voyage" },
      { id: "etd", label: "ETD", type: "date", section: "Voyage" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", section: "Goods" },
    ]
  },

  "claim-form": {
    description: "Generate cargo insurance claim form documents.",
    fields: [
      { id: "claimNumber", label: "Claim Number", type: "text", required: true, section: "Claim Details" },
      { id: "claimDate", label: "Date of Claim", type: "date", required: true, section: "Claim Details" },
      { id: "policyNumber", label: "Policy Number", type: "text", required: true, section: "Reference" },
      { id: "certificateNumber", label: "Certificate Number", type: "text", section: "Reference" },
      { id: "claimantName", label: "Claimant Name", type: "text", required: true, section: "Claimant" },
      { id: "claimantAddress", label: "Claimant Address", type: "textarea", required: true, section: "Claimant" },
      { id: "claimantPhone", label: "Phone Number", type: "text", required: true, section: "Claimant" },
      { id: "insurerName", label: "Insurance Company", type: "text", required: true, section: "Insurer" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Shipment" },
      { id: "blNumber", label: "B/L Number", type: "text", required: true, section: "Shipment" },
      { id: "voyageDate", label: "Voyage Date", type: "date", required: true, section: "Shipment" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", section: "Shipment" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", section: "Shipment" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Goods" },
      { id: "damageDescription", label: "Description of Damage/Loss", type: "textarea", required: true, section: "Loss Details" },
      { id: "discoveryDate", label: "Date Damage Discovered", type: "date", required: true, section: "Loss Details" },
      { id: "discoveryPlace", label: "Place of Discovery", type: "text", required: true, section: "Loss Details" },
      { id: "claimedAmount", label: "Amount Claimed", type: "currency", required: true, section: "Claim" },
      { id: "currency", label: "Currency", type: "text", required: true, section: "Claim" },
    ]
  },

  "survey-report": {
    description: "Generate cargo survey report documents.",
    fields: [
      { id: "surveyNumber", label: "Survey Report Number", type: "text", required: true, section: "Document Details" },
      { id: "surveyDate", label: "Survey Date", type: "date", required: true, section: "Document Details" },
      { id: "surveyorName", label: "Surveyor Name", type: "text", required: true, section: "Surveyor" },
      { id: "surveyorCompany", label: "Surveyor Company", type: "text", required: true, section: "Surveyor" },
      { id: "surveyorAddress", label: "Surveyor Address", type: "textarea", required: true, section: "Surveyor" },
      { id: "principalName", label: "Principal Name", type: "text", required: true, section: "Principal" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Vessel" },
      { id: "blNumber", label: "B/L Number", type: "text", required: true, section: "Shipment" },
      { id: "surveyPlace", label: "Place of Survey", type: "text", required: true, section: "Location" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Cargo" },
      { id: "goodsDescription", label: "Description of Goods", type: "textarea", required: true, section: "Cargo" },
      { id: "findings", label: "Survey Findings", type: "textarea", required: true, section: "Findings" },
      { id: "damageAssessment", label: "Damage Assessment", type: "textarea", required: true, section: "Findings" },
      { id: "recommendations", label: "Recommendations", type: "textarea", section: "Recommendations" },
    ]
  },

  "loss-adjuster-report": {
    description: "Generate professional loss adjuster report documents.",
    fields: [
      { id: "reportNumber", label: "Report Number", type: "text", required: true, section: "Document Details" },
      { id: "reportDate", label: "Report Date", type: "date", required: true, section: "Document Details" },
      { id: "adjusterName", label: "Loss Adjuster Name", type: "text", required: true, section: "Adjuster" },
      { id: "adjusterCompany", label: "Adjuster Company", type: "text", required: true, section: "Adjuster" },
      { id: "adjusterLicense", label: "License Number", type: "text", required: true, section: "Adjuster" },
      { id: "insurerName", label: "Insurance Company", type: "text", required: true, section: "Parties" },
      { id: "insuredName", label: "Insured Name", type: "text", required: true, section: "Parties" },
      { id: "policyNumber", label: "Policy Number", type: "text", required: true, section: "Reference" },
      { id: "claimNumber", label: "Claim Number", type: "text", required: true, section: "Reference" },
      { id: "lossDate", label: "Date of Loss", type: "date", required: true, section: "Loss" },
      { id: "lossLocation", label: "Location of Loss", type: "text", required: true, section: "Loss" },
      { id: "causeOfLoss", label: "Cause of Loss", type: "textarea", required: true, section: "Loss" },
      { id: "investigation", label: "Investigation Details", type: "textarea", required: true, section: "Investigation" },
      { id: "lossAmount", label: "Total Loss Amount", type: "currency", required: true, section: "Assessment" },
      { id: "recommendedSettlement", label: "Recommended Settlement", type: "currency", required: true, section: "Assessment" },
      { id: "conclusions", label: "Conclusions", type: "textarea", required: true, section: "Conclusion" },
    ]
  },

  // ==================== INSPECTION DOCUMENTS ====================
  "inspection-certificate": {
    description: "Generate quality inspection certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Inspection Date", type: "date", required: true, section: "Document Details" },
      { id: "inspectionType", label: "Inspection Type", type: "text", placeholder: "Pre-shipment, Final", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "importerAddress", label: "Importer Address", type: "textarea", required: true, section: "Importer" },
      { id: "inspectionCompany", label: "Inspection Company", type: "text", required: true, section: "Inspector" },
      { id: "inspectionPlace", label: "Place of Inspection", type: "text", required: true, section: "Inspection" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "quantity", label: "Quantity Inspected", type: "number", required: true, section: "Product" },
      { id: "lotNumber", label: "Lot/Batch Number", type: "text", section: "Product" },
      { id: "inspectionResults", label: "Inspection Results", type: "textarea", required: true, section: "Results" },
      { id: "conclusion", label: "Conclusion", type: "text", placeholder: "Passed, Failed", required: true, section: "Results" },
      { id: "comments", label: "Comments", type: "textarea", section: "Additional" },
    ]
  },

  "pre-shipment-inspection": {
    description: "Generate pre-shipment inspection certificate documents.",
    fields: [
      { id: "psiNumber", label: "PSI Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "psiDate", label: "Inspection Date", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "exporterAddress", label: "Exporter Address", type: "textarea", required: true, section: "Exporter" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "importerCountry", label: "Importer Country", type: "text", required: true, section: "Importer" },
      { id: "inspectionAgency", label: "Inspection Agency", type: "text", required: true, section: "Agency" },
      { id: "invoiceNumber", label: "Invoice Number", type: "text", required: true, section: "Reference" },
      { id: "invoiceValue", label: "Invoice Value", type: "currency", required: true, section: "Reference" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Product" },
      { id: "hsCode", label: "HS Code", type: "text", section: "Product" },
      { id: "inspectionPlace", label: "Place of Inspection", type: "text", required: true, section: "Inspection" },
      { id: "inspectionResults", label: "Inspection Results", type: "textarea", required: true, section: "Results" },
      { id: "priceVerification", label: "Price Verification", type: "text", section: "Results" },
    ]
  },

  "quality-certificate": {
    description: "Generate product quality certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "validUntil", label: "Valid Until", type: "date", section: "Document Details" },
      { id: "manufacturerName", label: "Manufacturer Name", type: "text", required: true, section: "Manufacturer" },
      { id: "manufacturerAddress", label: "Manufacturer Address", type: "textarea", required: true, section: "Manufacturer" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "productModel", label: "Product Model/Type", type: "text", section: "Product" },
      { id: "batchNumber", label: "Batch Number", type: "text", section: "Product" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Product" },
      { id: "qualityStandards", label: "Quality Standards", type: "text", placeholder: "ISO 9001, ASTM", required: true, section: "Standards" },
      { id: "testResults", label: "Test Results", type: "textarea", required: true, section: "Testing" },
      { id: "certifyingBody", label: "Certifying Body", type: "text", required: true, section: "Certification" },
      { id: "conclusion", label: "Conclusion", type: "textarea", required: true, section: "Certification" },
    ]
  },

  "quantity-certificate": {
    description: "Generate quantity verification certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Inspection Date", type: "date", required: true, section: "Document Details" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "importerName", label: "Importer Name", type: "text", required: true, section: "Importer" },
      { id: "surveyorName", label: "Surveyor Name", type: "text", required: true, section: "Surveyor" },
      { id: "surveyorCompany", label: "Surveyor Company", type: "text", required: true, section: "Surveyor" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Quantity" },
      { id: "unitOfMeasure", label: "Unit of Measure", type: "text", required: true, section: "Quantity" },
      { id: "verificationMethod", label: "Verification Method", type: "text", required: true, section: "Verification" },
      { id: "inspectionPlace", label: "Place of Inspection", type: "text", required: true, section: "Inspection" },
      { id: "remarks", label: "Remarks", type: "textarea", section: "Additional" },
    ]
  },

  "weight-certificate": {
    description: "Generate official weight certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Weighing Date", type: "date", required: true, section: "Document Details" },
      { id: "weighbridgeName", label: "Weighbridge/Scale Name", type: "text", required: true, section: "Weighing" },
      { id: "weighbridgeLocation", label: "Location", type: "text", required: true, section: "Weighing" },
      { id: "scaleCalibrationDate", label: "Scale Calibration Date", type: "date", section: "Weighing" },
      { id: "exporterName", label: "Exporter Name", type: "text", required: true, section: "Exporter" },
      { id: "importerName", label: "Importer Name", type: "text", section: "Importer" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "grossWeight", label: "Gross Weight", type: "number", required: true, section: "Weight" },
      { id: "tareWeight", label: "Tare Weight", type: "number", section: "Weight" },
      { id: "netWeight", label: "Net Weight", type: "number", required: true, section: "Weight" },
      { id: "unitOfMeasure", label: "Unit of Measure", type: "text", placeholder: "kg, MT", required: true, section: "Weight" },
      { id: "vehicleNumber", label: "Vehicle Number", type: "text", section: "Transport" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Transport" },
    ]
  },

  "analysis-certificate": {
    description: "Generate laboratory analysis certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Analysis Date", type: "date", required: true, section: "Document Details" },
      { id: "laboratoryName", label: "Laboratory Name", type: "text", required: true, section: "Laboratory" },
      { id: "laboratoryAddress", label: "Laboratory Address", type: "textarea", required: true, section: "Laboratory" },
      { id: "laboratoryAccreditation", label: "Accreditation", type: "text", section: "Laboratory" },
      { id: "sampleReference", label: "Sample Reference", type: "text", required: true, section: "Sample" },
      { id: "sampleDate", label: "Sample Date", type: "date", required: true, section: "Sample" },
      { id: "productDescription", label: "Product Description", type: "textarea", required: true, section: "Product" },
      { id: "batchNumber", label: "Batch Number", type: "text", section: "Product" },
      { id: "analysisMethod", label: "Analysis Method", type: "text", required: true, section: "Analysis" },
      { id: "analysisResults", label: "Analysis Results", type: "textarea", required: true, section: "Results" },
      { id: "specifications", label: "Specifications/Standards", type: "textarea", section: "Results" },
      { id: "conclusion", label: "Conclusion", type: "textarea", required: true, section: "Conclusion" },
    ]
  },

  "testing-report": {
    description: "Generate product testing report documents.",
    fields: [
      { id: "reportNumber", label: "Report Number", type: "text", required: true, section: "Document Details" },
      { id: "reportDate", label: "Report Date", type: "date", required: true, section: "Document Details" },
      { id: "testingLab", label: "Testing Laboratory", type: "text", required: true, section: "Laboratory" },
      { id: "labAccreditation", label: "Laboratory Accreditation", type: "text", section: "Laboratory" },
      { id: "clientName", label: "Client Name", type: "text", required: true, section: "Client" },
      { id: "clientAddress", label: "Client Address", type: "textarea", required: true, section: "Client" },
      { id: "sampleDescription", label: "Sample Description", type: "textarea", required: true, section: "Sample" },
      { id: "sampleReceiptDate", label: "Sample Receipt Date", type: "date", required: true, section: "Sample" },
      { id: "testMethod", label: "Test Method", type: "text", required: true, section: "Testing" },
      { id: "testStandards", label: "Test Standards", type: "text", section: "Testing" },
      { id: "testResults", label: "Test Results", type: "textarea", required: true, section: "Results" },
      { id: "passFailCriteria", label: "Pass/Fail Criteria", type: "textarea", section: "Results" },
      { id: "conclusion", label: "Conclusion", type: "textarea", required: true, section: "Conclusion" },
    ]
  },

  // ==================== DANGEROUS GOODS DOCUMENTS ====================
  "dangerous-goods-declaration": {
    description: "Generate IMO dangerous goods declaration documents.",
    fields: [
      { id: "declarationNumber", label: "Declaration Number", type: "text", required: true, section: "Document Details" },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true, section: "Consignee" },
      { id: "vesselName", label: "Vessel Name", type: "text", required: true, section: "Transport" },
      { id: "voyageNumber", label: "Voyage Number", type: "text", required: true, section: "Transport" },
      { id: "portOfLoading", label: "Port of Loading", type: "text", required: true, section: "Transport" },
      { id: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, section: "Transport" },
      { id: "unNumber", label: "UN Number", type: "text", required: true, section: "Dangerous Goods" },
      { id: "properShippingName", label: "Proper Shipping Name", type: "text", required: true, section: "Dangerous Goods" },
      { id: " hazardClass", label: "Hazard Class", type: "text", required: true, section: "Dangerous Goods" },
      { id: "packingGroup", label: "Packing Group", type: "text", section: "Dangerous Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Dangerous Goods" },
      { id: "packagingType", label: "Packaging Type", type: "text", required: true, section: "Dangerous Goods" },
      { id: "containerNumber", label: "Container Number", type: "text", section: "Container" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Container" },
      { id: "emergencyContact", label: "Emergency Contact", type: "text", required: true, section: "Emergency" },
      { id: "emergencyPhone", label: "Emergency Phone", type: "text", required: true, section: "Emergency" },
    ]
  },

  "msds": {
    description: "Generate material safety data sheet documents.",
    fields: [
      { id: "msdsNumber", label: "MSDS Reference", type: "text", required: true, section: "Document Details" },
      { id: "msdsDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "productName", label: "Product Name", type: "text", required: true, section: "Product" },
      { id: "manufacturer", label: "Manufacturer", type: "text", required: true, section: "Product" },
      { id: "manufacturerAddress", label: "Manufacturer Address", type: "textarea", required: true, section: "Product" },
      { id: "emergencyPhone", label: "Emergency Phone", type: "text", required: true, section: "Emergency" },
      { id: "chemicalName", label: "Chemical Name", type: "text", section: "Composition" },
      { id: "casNumber", label: "CAS Number", type: "text", section: "Composition" },
      { id: "hazardIdentification", label: "Hazard Identification", type: "textarea", required: true, section: "Hazards" },
      { id: "firstAidMeasures", label: "First Aid Measures", type: "textarea", required: true, section: "Safety" },
      { id: "fireFightingMeasures", label: "Fire Fighting Measures", type: "textarea", required: true, section: "Safety" },
      { id: "handlingStorage", label: "Handling & Storage", type: "textarea", required: true, section: "Handling" },
      { id: "exposureControls", label: "Exposure Controls", type: "textarea", section: "Safety" },
      { id: "physicalProperties", label: "Physical Properties", type: "textarea", section: "Properties" },
    ]
  },

  "un-certificate": {
    description: "Generate UN packaging certificate documents.",
    fields: [
      { id: "certificateNumber", label: "Certificate Number", type: "text", required: true, section: "Document Details" },
      { id: "certificateDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "validUntil", label: "Valid Until", type: "date", required: true, section: "Document Details" },
      { id: "manufacturerName", label: "Manufacturer Name", type: "text", required: true, section: "Manufacturer" },
      { id: "manufacturerAddress", label: "Manufacturer Address", type: "textarea", required: true, section: "Manufacturer" },
      { id: "packagingType", label: "Packaging Type", type: "text", required: true, section: "Packaging" },
      { id: "unMarking", label: "UN Marking", type: "text", required: true, section: "Packaging" },
      { id: "designType", label: "Design Type", type: "text", required: true, section: "Packaging" },
      { id: "authorizedContents", label: "Authorized Contents", type: "textarea", required: true, section: "Authorization" },
      { id: "testStandards", label: "Test Standards", type: "text", required: true, section: "Testing" },
      { id: "testingAgency", label: "Testing Agency", type: "text", required: true, section: "Testing" },
      { id: "issuingAuthority", label: "Issuing Authority", type: "text", required: true, section: "Authority" },
    ]
  },

  "hazard-classification": {
    description: "Generate hazard classification report documents.",
    fields: [
      { id: "reportNumber", label: "Report Number", type: "text", required: true, section: "Document Details" },
      { id: "reportDate", label: "Report Date", type: "date", required: true, section: "Document Details" },
      { id: "productName", label: "Product Name", type: "text", required: true, section: "Product" },
      { id: "manufacturer", label: "Manufacturer", type: "text", required: true, section: "Product" },
      { id: "classificationAgency", label: "Classification Agency", type: "text", required: true, section: "Agency" },
      { id: "unNumber", label: "UN Number", type: "text", required: true, section: "Classification" },
      { id: "properShippingName", label: "Proper Shipping Name", type: "text", required: true, section: "Classification" },
      { id: "hazardClass", label: "Hazard Class", type: "text", required: true, section: "Classification" },
      { id: "packingGroup", label: "Packing Group", type: "text", section: "Classification" },
      { id: "subsidiaryRisk", label: "Subsidiary Risk", type: "text", section: "Classification" },
      { id: "classificationBasis", label: "Classification Basis", type: "textarea", required: true, section: "Basis" },
      { id: "specialProvisions", label: "Special Provisions", type: "textarea", section: "Provisions" },
    ]
  },

  "emergency-response": {
    description: "Generate emergency response guide documents.",
    fields: [
      { id: "guideNumber", label: "Guide Number", type: "text", required: true, section: "Document Details" },
      { id: "guideDate", label: "Issue Date", type: "date", required: true, section: "Document Details" },
      { id: "productName", label: "Product Name", type: "text", required: true, section: "Product" },
      { id: "unNumber", label: "UN Number", type: "text", required: true, section: "Product" },
      { id: "hazardClass", label: "Hazard Class", type: "text", required: true, section: "Product" },
      { id: "immediateActions", label: "Immediate Actions", type: "textarea", required: true, section: "Emergency" },
      { id: "evacuationProcedures", label: "Evacuation Procedures", type: "textarea", required: true, section: "Emergency" },
      { id: "firstAid", label: "First Aid", type: "textarea", required: true, section: "First Aid" },
      { id: "fireResponse", label: "Fire Response", type: "textarea", required: true, section: "Fire" },
      { id: "spillResponse", label: "Spill Response", type: "textarea", required: true, section: "Spill" },
      { id: "ppeRequired", label: "PPE Required", type: "textarea", required: true, section: "Protection" },
      { id: "emergencyContacts", label: "Emergency Contacts", type: "textarea", required: true, section: "Contacts" },
    ]
  },

  "multimodal-dg-declaration": {
    description: "Generate multimodal dangerous goods declaration documents.",
    fields: [
      { id: "declarationNumber", label: "Declaration Number", type: "text", required: true, section: "Document Details" },
      { id: "declarationDate", label: "Declaration Date", type: "date", required: true, section: "Document Details" },
      { id: "shipperName", label: "Shipper Name", type: "text", required: true, section: "Shipper" },
      { id: "shipperAddress", label: "Shipper Address", type: "textarea", required: true, section: "Shipper" },
      { id: "consigneeName", label: "Consignee Name", type: "text", required: true, section: "Consignee" },
      { id: "transportMode", label: "Transport Mode", type: "text", placeholder: "Sea, Air, Road, Rail", required: true, section: "Transport" },
      { id: "origin", label: "Place of Origin", type: "text", required: true, section: "Transport" },
      { id: "destination", label: "Place of Destination", type: "text", required: true, section: "Transport" },
      { id: "unNumber", label: "UN Number", type: "text", required: true, section: "Dangerous Goods" },
      { id: "properShippingName", label: "Proper Shipping Name", type: "text", required: true, section: "Dangerous Goods" },
      { id: "hazardClass", label: "Hazard Class", type: "text", required: true, section: "Dangerous Goods" },
      { id: "packingGroup", label: "Packing Group", type: "text", section: "Dangerous Goods" },
      { id: "quantity", label: "Quantity", type: "number", required: true, section: "Dangerous Goods" },
      { id: "packagingType", label: "Packaging Type", type: "text", required: true, section: "Dangerous Goods" },
      { id: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true, section: "Dangerous Goods" },
      { id: "emergencyContact", label: "Emergency Contact", type: "text", required: true, section: "Emergency" },
    ]
  },
};

// Default fields for unknown documents
export const defaultFields: DocumentField[] = [
  { id: "documentNumber", label: "Document Number", type: "text", required: true, section: "Document Details" },
  { id: "documentDate", label: "Document Date", type: "date", required: true, section: "Document Details" },
  { id: "party1Name", label: "First Party Name", type: "text", required: true, section: "Parties" },
  { id: "party1Address", label: "First Party Address", type: "textarea", required: true, section: "Parties" },
  { id: "party2Name", label: "Second Party Name", type: "text", required: true, section: "Parties" },
  { id: "party2Address", label: "Second Party Address", type: "textarea", required: true, section: "Parties" },
  { id: "subject", label: "Subject", type: "text", required: true, section: "Content" },
  { id: "description", label: "Description", type: "textarea", required: true, section: "Content" },
  { id: "amount", label: "Amount", type: "currency", section: "Financial" },
  { id: "currency", label: "Currency", type: "text", placeholder: "USD", section: "Financial" },
  { id: "notes", label: "Additional Notes", type: "textarea", section: "Additional" },
];

// Helper function to get document fields
export function getDocumentFields(documentSlug: string): DocumentFieldConfig {
  return documentFieldConfigs[documentSlug] || { 
    fields: defaultFields, 
    description: "Generate professional trade documents with our easy-to-use template." 
  };
}
