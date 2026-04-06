"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Inspection Certificate",
  description: "An inspection certificate is a document certifying that goods have been inspected and meet specified standards. It is often required by importers and regulatory authorities.",
  fields: [
    { name: "certificateNumber", label: "Certificate Number", type: "text", required: true },
    { name: "issueDate", label: "Issue Date", type: "date", required: true },
    { name: "inspectionDate", label: "Inspection Date", type: "date", required: true },
    { name: "inspectionPlace", label: "Place of Inspection", type: "text", required: true },
    { name: "inspectorName", label: "Inspector Name", type: "text", required: true },
    { name: "inspectorCompany", label: "Inspection Company", type: "text", required: true },
    { name: "exporterName", label: "Exporter Name", type: "text", required: true },
    { name: "exporterAddress", label: "Exporter Address", type: "textarea", required: true },
    { name: "importerName", label: "Importer Name", type: "text", required: true },
    { name: "importerCountry", label: "Importer Country", type: "text", required: true },
    { name: "invoiceNumber", label: "Invoice Number", type: "text", required: true },
    { name: "invoiceDate", label: "Invoice Date", type: "date", required: true },
    { name: "lcNumber", label: "L/C Number", type: "text" },
    { name: "contractNumber", label: "Contract Number", type: "text" },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "hsCode", label: "HS Code", type: "text" },
    { name: "quantity", label: "Quantity", type: "number", required: true },
    { name: "unit", label: "Unit", type: "select", required: true, options: ["Pieces", "Kgs", "Meters", "Liters", "Cartons", "Pallets"] },
    { name: "inspectionType", label: "Inspection Type", type: "select", required: true, options: ["Pre-Shipment", "During Production", "Final Random", "Container Loading", "Destination"] },
    { name: "samplingMethod", label: "Sampling Method", type: "text", placeholder: "e.g., Random sampling per ISO 2859-1" },
    { name: "result", label: "Inspection Result", type: "select", required: true, options: ["PASS", "FAIL", "PASS WITH MINOR DEFECTS"] },
    { name: "findings", label: "Detailed Findings", type: "textarea", required: true },
    { name: "defects", label: "Defects Found", type: "textarea", placeholder: "List any defects identified" },
    { name: "recommendations", label: "Recommendations", type: "textarea" },
    { name: "standardsApplied", label: "Standards Applied", type: "text", placeholder: "e.g., ISO, ASTM, Buyer specifications" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">INSPECTION CERTIFICATE</h1>
        <p className="text-gray-500">Quality Inspection Document</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Exporter</h3>
          <p className="font-medium">{data.exporterName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.exporterAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Inspection Details</h3>
          <p className="text-sm"><span className="font-medium">Date:</span> {data.inspectionDate || "___"}</p>
          <p className="text-sm"><span className="font-medium">Place:</span> {data.inspectionPlace || "___"}</p>
          <p className="text-sm"><span className="font-medium">Type:</span> {data.inspectionType || "___"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Cert No:</span> {data.certificateNumber || "___"}</div>
        <div><span className="font-semibold">Invoice:</span> {data.invoiceNumber || "___"}</div>
        <div><span className="font-semibold">Result:</span> <span className={data.result === 'PASS' ? 'text-green-600 font-bold' : 'text-red-600'}>{data.result || "___"}</span></div>
      </div>
      <div className="text-sm mb-4">
        <p><span className="font-semibold">Goods:</span> {data.goodsDescription || "___"}</p>
        <p><span className="font-semibold">Quantity:</span> {data.quantity || "___"} {data.unit || ""}</p>
      </div>
      <div className="text-sm mt-4 p-3 bg-gray-50 rounded">
        <p className="font-semibold">Findings:</p>
        <p className="whitespace-pre-line">{data.findings || "___"}</p>
      </div>
    </div>
  ),
};

export default function InspectionCertificatePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
