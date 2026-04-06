"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Certificate of Origin",
  description: "A Certificate of Origin is a document certifying that the goods in a particular shipment are of a certain origin. It is often required by customs authorities.",
  fields: [
    { name: "referenceNumber", label: "Reference Number", type: "text", required: true },
    { name: "certificateDate", label: "Certificate Date", type: "date", required: true },
    { name: "exporterName", label: "Exporter Name", type: "text", required: true },
    { name: "exporterAddress", label: "Exporter Address", type: "textarea", required: true },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true },
    { name: "producerName", label: "Producer Name", type: "text", placeholder: "If different from exporter" },
    { name: "producerAddress", label: "Producer Address", type: "textarea" },
    { name: "meansOfTransport", label: "Means of Transport", type: "text", placeholder: "Vessel/Flight name" },
    { name: "departureDate", label: "Departure Date", type: "date" },
    { name: "portOfLoading", label: "Port of Loading", type: "text" },
    { name: "portOfDischarge", label: "Port of Discharge", type: "text" },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "hsCode", label: "HS Code", type: "text", required: true },
    { name: "originCriterion", label: "Origin Criterion", type: "select", required: true, options: ["WO", "WP", "PSR"] },
    { name: "countryOfOrigin", label: "Country of Origin", type: "text", required: true },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number" },
    { name: "numberOfPackages", label: "Number of Packages", type: "number" },
    { name: "invoiceNumber", label: "Invoice Number", type: "text" },
    { name: "invoiceDate", label: "Invoice Date", type: "date" },
    { name: "certifyingBody", label: "Certifying Body", type: "text", placeholder: "Chamber of Commerce, etc." },
    { name: "placeOfIssue", label: "Place of Issue", type: "text", required: true },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">CERTIFICATE OF ORIGIN</h1>
        <p className="text-gray-500">International Trade Document</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Exporter</h3>
          <p className="font-medium">{data.exporterName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.exporterAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Consignee</h3>
          <p className="font-medium">{data.consigneeName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.consigneeAddress || "_________________"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Reference:</span> {data.referenceNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.certificateDate || "___"}</div>
        <div><span className="font-semibold">Origin:</span> {data.countryOfOrigin || "___"}</div>
      </div>
      <div className="mb-6">
        <h3 className="font-semibold border-b pb-1 mb-2">Goods Description</h3>
        <p className="text-sm whitespace-pre-line">{data.goodsDescription || "___"}</p>
        <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
          <div><span className="font-semibold">HS Code:</span> {data.hsCode || "___"}</div>
          <div><span className="font-semibold">Packages:</span> {data.numberOfPackages || "___"}</div>
          <div><span className="font-semibold">Weight:</span> {data.grossWeight || "___"} kg</div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-8 text-sm mt-6 pt-4 border-t">
        <div>
          <p><span className="font-semibold">Place of Issue:</span> {data.placeOfIssue || "___"}</p>
          <p><span className="font-semibold">Certifying Body:</span> {data.certifyingBody || "___"}</p>
        </div>
        <div className="text-center">
          <div className="border-b border-gray-400 w-48 mx-auto mt-8"></div>
          <p className="text-xs mt-1">Authorized Signature & Stamp</p>
        </div>
      </div>
    </div>
  ),
};

export default function CertificateOfOriginPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
