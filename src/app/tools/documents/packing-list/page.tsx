"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Packing List",
  description: "A packing list is a shipping document that accompanies delivery packages, usually inside an attached pouch or inside the package itself. It lists the contents of the package.",
  fields: [
    { name: "documentNumber", label: "Document Number", type: "text", required: true, placeholder: "PL-2024-001" },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "shipperName", label: "Shipper Name", type: "text", required: true },
    { name: "shipperAddress", label: "Shipper Address", type: "textarea", required: true },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true },
    { name: "invoiceNumber", label: "Invoice Number", type: "text", placeholder: "Reference invoice" },
    { name: "purchaseOrder", label: "Purchase Order", type: "text" },
    { name: "shipmentNumber", label: "Shipment Number", type: "text" },
    { name: "destination", label: "Destination", type: "text", required: true },
    { name: "shippingTerms", label: "Shipping Terms", type: "select", options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "totalPackages", label: "Total Packages", type: "number", required: true },
    { name: "totalGrossWeight", label: "Total Gross Weight (kg)", type: "number", required: true },
    { name: "totalNetWeight", label: "Total Net Weight (kg)", type: "number", required: true },
    { name: "totalVolume", label: "Total Volume (CBM)", type: "number" },
    { name: "itemDetails", label: "Item Details", type: "textarea", required: true, placeholder: "Package #, Description, Qty, Net Wt, Gross Wt, Dimensions (one line per package)" },
    { name: "marksAndNumbers", label: "Marks and Numbers", type: "textarea" },
    { name: "specialInstructions", label: "Special Instructions", type: "textarea", placeholder: "Handling instructions, storage requirements" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">PACKING LIST</h1>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Shipper</h3>
          <p className="font-medium">{data.shipperName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.shipperAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Consignee</h3>
          <p className="font-medium">{data.consigneeName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.consigneeAddress || "_________________"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Document No:</span> {data.documentNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.date || "___"}</div>
        <div><span className="font-semibold">Invoice:</span> {data.invoiceNumber || "___"}</div>
        <div><span className="font-semibold">Destination:</span> {data.destination || "___"}</div>
        <div><span className="font-semibold">Terms:</span> {data.shippingTerms || "___"}</div>
        <div><span className="font-semibold">PO:</span> {data.purchaseOrder || "___"}</div>
      </div>
      <div className="mb-4 text-sm whitespace-pre-line border p-4 rounded bg-gray-50">{data.itemDetails || "Item details here..."}</div>
      <div className="grid grid-cols-4 gap-4 text-sm mt-6 pt-4 border-t">
        <div><span className="font-semibold">Total Packages:</span> {data.totalPackages || "___"}</div>
        <div><span className="font-semibold">Net Weight:</span> {data.totalNetWeight || "___"} kg</div>
        <div><span className="font-semibold">Gross Weight:</span> {data.totalGrossWeight || "___"} kg</div>
        <div><span className="font-semibold">Volume:</span> {data.totalVolume || "___"} CBM</div>
      </div>
    </div>
  ),
};

export default function PackingListPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
