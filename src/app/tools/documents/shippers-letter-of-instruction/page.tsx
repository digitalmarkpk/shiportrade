"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Shipper's Letter of Instruction",
  description: "An SLI is a document from the shipper to the freight forwarder with detailed instructions on how to handle an export shipment, including documentation requirements.",
  fields: [
    { name: "sliNumber", label: "SLI Number", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "shipperName", label: "Shipper/Exporter Name", type: "text", required: true },
    { name: "shipperAddress", label: "Shipper Address", type: "textarea", required: true },
    { name: "shipperEIN", label: "Tax ID / EIN", type: "text" },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true },
    { name: "ultimateConsignee", label: "Ultimate Consignee", type: "text" },
    { name: "intermediateConsignee", label: "Intermediate Consignee", type: "text" },
    { name: "forwardingAgent", label: "Forwarding Agent", type: "text", required: true },
    { name: "destinationCountry", label: "Destination Country", type: "text", required: true },
    { name: "portOfExport", label: "Port of Export", type: "text", required: true },
    { name: "portOfUnloading", label: "Port of Unloading", type: "text", required: true },
    { name: "carrierName", label: "Carrier Name", type: "text" },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "hsCode", label: "HS Code / Schedule B", type: "text", required: true },
    { name: "quantity", label: "Quantity", type: "number", required: true },
    { name: "value", label: "Value", type: "number", required: true },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true },
    { name: "licenseNumber", label: "Export License Number", type: "text" },
    { name: "licenseType", label: "License Type", type: "select", options: ["NLR", "GBS", "CIV", "TSR", "Other"] },
    { name: "eccn", label: "ECCN Number", type: "text" },
    { name: "incoterms", label: "Incoterms", type: "select", required: true, options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "specialInstructions", label: "Special Instructions", type: "textarea" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">SHIPPER&apos;S LETTER OF INSTRUCTION</h1>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Shipper/Exporter</h3>
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
        <div><span className="font-semibold">SLI No:</span> {data.sliNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.date || "___"}</div>
        <div><span className="font-semibold">Forwarding Agent:</span> {data.forwardingAgent || "___"}</div>
        <div><span className="font-semibold">POL:</span> {data.portOfExport || "___"}</div>
        <div><span className="font-semibold">POD:</span> {data.portOfUnloading || "___"}</div>
        <div><span className="font-semibold">Destination:</span> {data.destinationCountry || "___"}</div>
      </div>
      <div className="text-sm">
        <p><span className="font-semibold">Description:</span> {data.goodsDescription || "___"}</p>
        <p><span className="font-semibold">HS Code:</span> {data.hsCode || "___"}</p>
        <p><span className="font-semibold">Value:</span> {data.currency || ""} {data.value || "___"}</p>
      </div>
    </div>
  ),
};

export default function ShippersLetterOfInstructionPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
