"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Letter of Credit Application",
  description: "A Letter of Credit application is submitted to a bank to open an LC for international trade transactions, providing payment security for both buyer and seller.",
  fields: [
    { name: "applicationDate", label: "Application Date", type: "date", required: true },
    { name: "applicantName", label: "Applicant Name", type: "text", required: true },
    { name: "applicantAddress", label: "Applicant Address", type: "textarea", required: true },
    { name: "beneficiaryName", label: "Beneficiary Name", type: "text", required: true },
    { name: "beneficiaryAddress", label: "Beneficiary Address", type: "textarea", required: true },
    { name: "lcAmount", label: "LC Amount", type: "number", required: true },
    { name: "currency", label: "Currency", type: "select", required: true, options: ["USD", "EUR", "GBP", "JPY", "CNY"] },
    { name: "lcType", label: "LC Type", type: "select", required: true, options: ["Irrevocable", "Revocable", "Confirmed", "Unconfirmed", "Transferable", "Back-to-Back"] },
    { name: "expiryDate", label: "Expiry Date", type: "date", required: true },
    { name: "expiryPlace", label: "Place of Expiry", type: "text", required: true },
    { name: "partialShipments", label: "Partial Shipments", type: "select", required: true, options: ["Allowed", "Not Allowed"] },
    { name: "transshipment", label: "Transshipment", type: "select", required: true, options: ["Allowed", "Not Allowed"] },
    { name: "portOfLoading", label: "Port of Loading/Airport", type: "text", required: true },
    { name: "portOfDischarge", label: "Port of Discharge/Airport", type: "text", required: true },
    { name: "latestShipment", label: "Latest Shipment Date", type: "date", required: true },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "incoterms", label: "Incoterms", type: "select", required: true, options: ["EXW", "FCA", "FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"] },
    { name: "requiredDocuments", label: "Required Documents", type: "textarea", required: true, placeholder: "List all documents required (B/L, Invoice, etc.)" },
    { name: "periodForPresentation", label: "Period for Presentation", type: "text", placeholder: "e.g., 21 days after B/L date" },
    { name: "confirmationInstructions", label: "Confirmation Instructions", type: "select", required: true, options: ["Confirm", "May Add", "Without"] },
    { name: "bankCharges", label: "Bank Charges", type: "select", required: true, options: ["Applicant", "Beneficiary", "Shared"] },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">LETTER OF CREDIT APPLICATION</h1>
      </div>
      <div className="grid grid-cols-2 gap-8 mb-6">
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Applicant</h3>
          <p className="font-medium">{data.applicantName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.applicantAddress || "_________________"}</p>
        </div>
        <div>
          <h3 className="font-semibold border-b pb-1 mb-2">Beneficiary</h3>
          <p className="font-medium">{data.beneficiaryName || "_________________"}</p>
          <p className="text-sm whitespace-pre-line">{data.beneficiaryAddress || "_________________"}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div><span className="font-semibold">Amount:</span> {data.currency || ""} {data.lcAmount || "___"}</div>
        <div><span className="font-semibold">Type:</span> {data.lcType || "___"}</div>
        <div><span className="font-semibold">Expiry:</span> {data.expiryDate || "___"}</div>
        <div><span className="font-semibold">Partial:</span> {data.partialShipments || "___"}</div>
        <div><span className="font-semibold">Transship:</span> {data.transshipment || "___"}</div>
        <div><span className="font-semibold">Terms:</span> {data.incoterms || "___"}</div>
      </div>
    </div>
  ),
};

export default function LCApplicationPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
