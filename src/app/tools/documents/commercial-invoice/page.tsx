"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Commercial Invoice",
  description: "A commercial invoice is a legal document between a supplier and a customer that clearly describes the sold goods and the amount due. It is required for customs clearance and is used to calculate duties and taxes.",
  fields: [
    { name: "invoiceNumber", label: "Invoice Number", type: "text", required: true, placeholder: "INV-2024-001" },
    { name: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { name: "sellerName", label: "Seller/Exporter Name", type: "text", required: true, placeholder: "Company Name" },
    { name: "sellerAddress", label: "Seller Address", type: "textarea", required: true, placeholder: "Full address including country" },
    { name: "buyerName", label: "Buyer/Importer Name", type: "text", required: true, placeholder: "Company Name" },
    { name: "buyerAddress", label: "Buyer Address", type: "textarea", required: true, placeholder: "Full address including country" },
    { name: "shipToName", label: "Ship To Name", type: "text", placeholder: "If different from buyer" },
    { name: "shipToAddress", label: "Ship To Address", type: "textarea", placeholder: "Delivery address" },
    { name: "poNumber", label: "PO Number", type: "text", placeholder: "Purchase Order Reference" },
    { name: "termsOfSale", label: "Terms of Sale (Incoterms)", type: "select", required: true, options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "e.g., Net 30, LC at sight" },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY", "Other"] },
    { name: "itemDescription", label: "Goods Description", type: "textarea", required: true, placeholder: "Detailed description of goods" },
    { name: "hsCode", label: "HS Code", type: "text", placeholder: "Harmonized System Code" },
    { name: "quantity", label: "Quantity", type: "number", required: true, placeholder: "Number of units" },
    { name: "unitPrice", label: "Unit Price", type: "number", required: true, placeholder: "Price per unit" },
    { name: "totalAmount", label: "Total Amount", type: "number", required: true, placeholder: "Total invoice value" },
    { name: "countryOfOrigin", label: "Country of Origin", type: "text", required: true, placeholder: "Country where goods were manufactured" },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number", placeholder: "Total weight including packaging" },
    { name: "netWeight", label: "Net Weight (kg)", type: "number", placeholder: "Weight of goods only" },
    { name: "numberOfPackages", label: "Number of Packages", type: "number", placeholder: "Total packages/cartons" },
    { name: "marksAndNumbers", label: "Marks and Numbers", type: "textarea", placeholder: "Shipping marks" },
    { name: "containerNumber", label: "Container Number", type: "text", placeholder: "If applicable" },
    { name: "bankDetails", label: "Bank Details", type: "textarea", placeholder: "Bank information for payment" },
    { name: "notes", label: "Additional Notes", type: "textarea", placeholder: "Any additional information" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">COMMERCIAL INVOICE</h1>
        <p className="text-gray-500">International Trade Document</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Seller / Exporter</h3>
          <p className="font-medium">{data.sellerName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.sellerAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Buyer / Importer</h3>
          <p className="font-medium">{data.buyerName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.buyerAddress || "_________________"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Invoice No:</span> {data.invoiceNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.invoiceDate || "___"}</div>
        <div><span className="font-semibold">P.O. No:</span> {data.poNumber || "___"}</div>
        <div><span className="font-semibold">Terms:</span> {data.termsOfSale || "___"}</div>
        <div><span className="font-semibold">Payment:</span> {data.paymentTerms || "___"}</div>
        <div><span className="font-semibold">Currency:</span> {data.currency || "___"}</div>
      </div>
      <table className="w-full border-collapse border mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Description of Goods</th>
            <th className="border p-2">HS Code</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 whitespace-pre-line">{data.itemDescription || "___"}</td>
            <td className="border p-2 text-center">{data.hsCode || "___"}</td>
            <td className="border p-2 text-center">{data.quantity || "___"}</td>
            <td className="border p-2 text-right">{data.unitPrice || "___"}</td>
            <td className="border p-2 text-right">{data.totalAmount || "___"}</td>
          </tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <p><span className="font-semibold">Country of Origin:</span> {data.countryOfOrigin || "___"}</p>
          <p><span className="font-semibold">Gross Weight:</span> {data.grossWeight || "___"} kg</p>
          <p><span className="font-semibold">Net Weight:</span> {data.netWeight || "___"} kg</p>
        </div>
        <div>
          <p><span className="font-semibold">No. of Packages:</span> {data.numberOfPackages || "___"}</p>
          <p><span className="font-semibold">Container:</span> {data.containerNumber || "___"}</p>
          <p><span className="font-semibold">Marks:</span> {data.marksAndNumbers || "___"}</p>
        </div>
      </div>
      <div className="mt-8 text-sm">
        <h3 className="font-semibold border-b pb-1 mb-2">Bank Details</h3>
        <p className="whitespace-pre-line">{data.bankDetails || "_________________"}</p>
      </div>
    </div>
  ),
};

export default function CommercialInvoicePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
