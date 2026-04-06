"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";

const template = {
  title: "Bill of Lading",
  description: "A Bill of Lading is a legal document issued by a carrier to acknowledge receipt of cargo for shipment. It serves as a receipt, contract of carriage, and document of title.",
  fields: [
    { name: "blNumber", label: "B/L Number", type: "text", required: true, placeholder: "B/L Reference Number" },
    { name: "bookingNumber", label: "Booking Number", type: "text", placeholder: "Carrier booking reference" },
    { name: "exportReferences", label: "Export References", type: "text", placeholder: "Export reference numbers" },
    { name: "shipperName", label: "Shipper/Exporter Name", type: "text", required: true },
    { name: "shipperAddress", label: "Shipper Address", type: "textarea", required: true },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true },
    { name: "notifyParty", label: "Notify Party", type: "text", placeholder: "Party to be notified" },
    { name: "notifyAddress", label: "Notify Party Address", type: "textarea" },
    { name: "vesselName", label: "Vessel Name", type: "text", required: true, placeholder: "Name of vessel" },
    { name: "voyageNumber", label: "Voyage Number", type: "text", required: true },
    { name: "portOfLoading", label: "Port of Loading", type: "text", required: true, placeholder: "Port name and country" },
    { name: "portOfDischarge", label: "Port of Discharge", type: "text", required: true, placeholder: "Port name and country" },
    { name: "placeOfReceipt", label: "Place of Receipt", type: "text", placeholder: "If different from POL" },
    { name: "placeOfDelivery", label: "Place of Delivery", type: "text", placeholder: "If different from POD" },
    { name: "containerNumber", label: "Container Number(s)", type: "textarea", required: true, placeholder: "Container numbers, one per line" },
    { name: "sealNumber", label: "Seal Number(s)", type: "text", placeholder: "Seal numbers" },
    { name: "numberOfPackages", label: "Number of Packages", type: "number", required: true },
    { name: "packageType", label: "Package Type", type: "select", required: true, options: ["Pallets", "Cartons", "Crates", "Drums", "Bags", "Bales", "Cases", "Pieces"] },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true },
    { name: "netWeight", label: "Net Weight (kg)", type: "number" },
    { name: "measurement", label: "Measurement (CBM)", type: "number", placeholder: "Cubic meters" },
    { name: "marksAndNumbers", label: "Marks and Numbers", type: "textarea" },
    { name: "freightPrepaid", label: "Freight", type: "select", required: true, options: ["Prepaid", "Collect", "Elsewhere"] },
    { name: "numberOfOriginals", label: "Number of Original B/Ls", type: "select", required: true, options: ["1", "2", "3"] },
    { name: "placeOfIssue", label: "Place of Issue", type: "text", required: true },
    { name: "dateOfIssue", label: "Date of Issue", type: "date", required: true },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold">BILL OF LADING</h1>
        <p className="text-gray-500">For Ocean Shipment</p>
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
        <div><span className="font-semibold">B/L No:</span> {data.blNumber || "___"}</div>
        <div><span className="font-semibold">Vessel:</span> {data.vesselName || "___"}</div>
        <div><span className="font-semibold">Voyage:</span> {data.voyageNumber || "___"}</div>
        <div><span className="font-semibold">POL:</span> {data.portOfLoading || "___"}</div>
        <div><span className="font-semibold">POD:</span> {data.portOfDischarge || "___"}</div>
        <div><span className="font-semibold">Freight:</span> {data.freightPrepaid || "___"}</div>
      </div>
      <table className="w-full border-collapse border mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left">Container/Seal</th>
            <th className="border p-2 text-left">Description</th>
            <th className="border p-2">Pkgs</th>
            <th className="border p-2">Weight</th>
            <th className="border p-2">CBM</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 whitespace-pre-line">{data.containerNumber || "___"}<br/>Seal: {data.sealNumber || "___"}</td>
            <td className="border p-2 whitespace-pre-line">{data.goodsDescription || "___"}</td>
            <td className="border p-2 text-center">{data.numberOfPackages || "___"} {data.packageType || ""}</td>
            <td className="border p-2 text-center">{data.grossWeight || "___"} kg</td>
            <td className="border p-2 text-center">{data.measurement || "___"}</td>
          </tr>
        </tbody>
      </table>
      <div className="grid grid-cols-2 gap-8 text-sm mt-6">
        <div>
          <p><span className="font-semibold">Place of Issue:</span> {data.placeOfIssue || "___"}</p>
          <p><span className="font-semibold">Date of Issue:</span> {data.dateOfIssue || "___"}</p>
        </div>
        <div>
          <p><span className="font-semibold">Original B/Ls:</span> {data.numberOfOriginals || "3"}</p>
          <p><span className="font-semibold">Marks:</span> {data.marksAndNumbers || "___"}</p>
        </div>
      </div>
    </div>
  ),
};

export default function BillOfLadingPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
