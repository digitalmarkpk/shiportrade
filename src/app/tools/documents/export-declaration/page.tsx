"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Export Declaration",
  description: "An export declaration is a formal document submitted to customs authorities declaring goods being exported, including their value, classification, and destination.",
  fields: [
    { name: "declarationNumber", label: "Declaration Number", type: "text", required: true },
    { name: "declarationDate", label: "Declaration Date", type: "date", required: true },
    { name: "exporterName", label: "Exporter Name", type: "text", required: true },
    { name: "exporterAddress", label: "Exporter Address", type: "textarea", required: true },
    { name: "exporterTaxId", label: "Exporter Tax ID", type: "text", required: true },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeCountry", label: "Consignee Country", type: "text", required: true },
    { name: "destinationCountry", label: "Destination Country", type: "text", required: true },
    { name: "countryOfOrigin", label: "Country of Origin", type: "text", required: true },
    { name: "transportMode", label: "Transport Mode", type: "select", required: true, options: ["Sea", "Air", "Road", "Rail", "Mail"] },
    { name: "exitOffice", label: "Exit Customs Office", type: "text", required: true },
    { name: "portOfLoading", label: "Port of Loading", type: "text", required: true },
    { name: "termsOfDelivery", label: "Terms of Delivery", type: "select", required: true, options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
    { name: "itemDescription", label: "Goods Description", type: "textarea", required: true },
    { name: "hsCode", label: "HS Code", type: "text", required: true },
    { name: "quantity", label: "Quantity", type: "number", required: true },
    { name: "unit", label: "Unit", type: "select", required: true, options: ["PCE", "KG", "MTR", "LTR", "BOX", "PAL", "CTN"] },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true },
    { name: "netWeight", label: "Net Weight (kg)", type: "number", required: true },
    { name: "value", label: "Invoice Value", type: "number", required: true },
    { name: "statisticalValue", label: "Statistical Value", type: "number" },
    { name: "containerNumber", label: "Container Number", type: "text" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">EXPORT DECLARATION</h1>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Exporter</h3>
          <p className="font-medium">{data.exporterName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.exporterAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Shipment Details</h3>
          <p className="text-sm"><span className="font-medium">Destination:</span> {data.destinationCountry || "___"}</p>
          <p className="text-sm"><span className="font-medium">Transport:</span> {data.transportMode || "___"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Declaration No:</span> {data.declarationNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.declarationDate || "___"}</div>
        <div><span className="font-semibold">Exit Office:</span> {data.exitOffice || "___"}</div>
      </div>
      <div className="text-sm">
        <p><span className="font-semibold">Goods:</span> {data.itemDescription || "___"}</p>
        <p><span className="font-semibold">HS Code:</span> {data.hsCode || "___"} | <span className="font-semibold">Qty:</span> {data.quantity || "___"} {data.unit || ""}</p>
        <p><span className="font-semibold">Value:</span> {data.currency || ""} {data.value || "___"}</p>
      </div>
    </div>
  ),
};

export default function ExportDeclarationPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
