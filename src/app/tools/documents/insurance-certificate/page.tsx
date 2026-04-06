"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Insurance Certificate",
  description: "An insurance certificate is a document that provides evidence of insurance coverage for a specific shipment. It is often required by banks and buyers.",
  fields: [
    { name: "certificateNumber", label: "Certificate Number", type: "text", required: true },
    { name: "policyNumber", label: "Policy Number", type: "text", required: true },
    { name: "issueDate", label: "Issue Date", type: "date", required: true },
    { name: "insuredName", label: "Insured Name", type: "text", required: true },
    { name: "insuredAddress", label: "Insured Address", type: "textarea", required: true },
    { name: "assuredName", label: "Assured/Consignee", type: "text" },
    { name: "vesselName", label: "Vessel/Flight Name", type: "text", required: true },
    { name: "voyageNumber", label: "Voyage/Flight No.", type: "text" },
    { name: "portOfLoading", label: "Port of Loading", type: "text", required: true },
    { name: "portOfDischarge", label: "Port of Discharge", type: "text", required: true },
    { name: "sailingDate", label: "Sailing/Departure Date", type: "date", required: true },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "sumInsured", label: "Sum Insured", type: "number", required: true },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
    { name: "marksAndNumbers", label: "Marks and Numbers", type: "textarea" },
    { name: "coverage", label: "Coverage Terms", type: "select", required: true, options: ["ICC (A) - All Risks", "ICC (B)", "ICC (C)", "Institute Cargo Clauses"] },
    { name: "deductible", label: "Deductible", type: "text", placeholder: "e.g., USD 500 or 0.5%" },
    { name: "claimsAgent", label: "Claims Agent", type: "text", placeholder: "Claims settling agent at destination" },
    { name: "specialConditions", label: "Special Conditions", type: "textarea" },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">INSURANCE CERTIFICATE</h1>
        <p className="text-gray-500">Marine Cargo Insurance</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Insured</h3>
          <p className="font-medium">{data.insuredName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.insuredAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Shipment Details</h3>
          <p className="text-sm"><span className="font-medium">Vessel:</span> {data.vesselName || "___"}</p>
          <p className="text-sm"><span className="font-medium">From:</span> {data.portOfLoading || "___"}</p>
          <p className="text-sm"><span className="font-medium">To:</span> {data.portOfDischarge || "___"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Cert No:</span> {data.certificateNumber || "___"}</div>
        <div><span className="font-semibold">Policy No:</span> {data.policyNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.issueDate || "___"}</div>
      </div>
      <div className="mb-4">
        <p className="font-semibold">Description: </p>
        <p className="text-sm">{data.goodsDescription || "___"}</p>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div><span className="font-semibold">Sum Insured:</span> {data.currency || ""} {data.sumInsured || "___"}</div>
        <div><span className="font-semibold">Coverage:</span> {data.coverage || "___"}</div>
      </div>
    </div>
  ),
};

export default function InsuranceCertificatePage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
