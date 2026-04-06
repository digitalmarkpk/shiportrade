"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Pro Forma Invoice",
  description: "A pro forma invoice is a preliminary bill of sale sent to buyers in advance of a shipment or delivery of goods. It describes the purchased items and other important information.",
  fields: [
    { name: "invoiceNumber", label: "Invoice Number", type: "text", required: true, placeholder: "PI-2024-001" },
    { name: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { name: "validUntil", label: "Valid Until", type: "date", required: true },
    { name: "sellerName", label: "Seller Name", type: "text", required: true },
    { name: "sellerAddress", label: "Seller Address", type: "textarea", required: true },
    { name: "buyerName", label: "Buyer Name", type: "text", required: true },
    { name: "buyerAddress", label: "Buyer Address", type: "textarea", required: true },
    { name: "shipToName", label: "Ship To Name", type: "text" },
    { name: "shipToAddress", label: "Ship To Address", type: "textarea" },
    { name: "termsOfSale", label: "Terms of Sale", type: "select", required: true, options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "paymentTerms", label: "Payment Terms", type: "text", placeholder: "e.g., T/T 30% in advance" },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
    { name: "itemDescription", label: "Item Description", type: "textarea", required: true },
    { name: "hsCode", label: "HS Code", type: "text" },
    { name: "quantity", label: "Quantity", type: "number", required: true },
    { name: "unitPrice", label: "Unit Price", type: "number", required: true },
    { name: "totalAmount", label: "Total Amount", type: "number", required: true },
    { name: "estimatedShippingDate", label: "Estimated Shipping Date", type: "date" },
    { name: "portOfLoading", label: "Port of Loading", type: "text" },
    { name: "portOfDischarge", label: "Port of Discharge", type: "text" },
    { name: "leadTime", label: "Lead Time", type: "text", placeholder: "e.g., 30 days after receipt of payment" },
    { name: "bankDetails", label: "Bank Details", type: "textarea" },
    { name: "notes", label: "Notes", type: "textarea", placeholder: "This is a pro forma invoice and not a demand for payment" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">PRO FORMA INVOICE</h1>
        <p className="text-gray-500 text-sm">Preliminary Invoice for Quotation</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Seller</h3>
          <p className="font-medium">{data.sellerName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.sellerAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Buyer</h3>
          <p className="font-medium">{data.buyerName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.buyerAddress || "_________________"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">PI No:</span> {data.invoiceNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.invoiceDate || "___"}</div>
        <div><span className="font-semibold">Valid Until:</span> {data.validUntil || "___"}</div>
        <div><span className="font-semibold">Terms:</span> {data.termsOfSale || "___"}</div>
        <div><span className="font-semibold">Payment:</span> {data.paymentTerms || "___"}</div>
        <div><span className="font-semibold">Currency:</span> {data.currency || "___"}</div>
      </div>
      <table className="w-full border-collapse border mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2">Qty</th>
            <th className="border p-2">Unit Price</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{data.itemDescription || "___"}</td>
            <td className="border p-2 text-center">{data.quantity || "___"}</td>
            <td className="border p-2 text-right">{data.unitPrice || "___"}</td>
            <td className="border p-2 text-right">{data.totalAmount || "___"}</td>
          </tr>
        </tbody>
      </table>
      <div className="text-sm mt-4 p-3 bg-gray-50 rounded">
        <p className="italic text-gray-600">Note: This is a pro forma invoice and is not a demand for payment. Prices and availability are subject to change.</p>
      </div>
    </div>
  ),
};

export default function ProFormaInvoicePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
