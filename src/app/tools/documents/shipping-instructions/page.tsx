"use client";

import DocumentGenerator from "@/components/tools/DocumentGenerator";


const template = {
  title: "Shipping Instructions",
  description: "Shipping instructions provide detailed information to the carrier about how to handle and transport cargo, including special requirements and documentation.",
  fields: [
    { name: "siNumber", label: "SI Number", type: "text", required: true },
    { name: "date", label: "Date", type: "date", required: true },
    { name: "shipperName", label: "Shipper Name", type: "text", required: true },
    { name: "shipperAddress", label: "Shipper Address", type: "textarea", required: true },
    { name: "shipperContact", label: "Shipper Contact", type: "text" },
    { name: "consigneeName", label: "Consignee Name", type: "text", required: true },
    { name: "consigneeAddress", label: "Consignee Address", type: "textarea", required: true },
    { name: "notifyParty", label: "Notify Party", type: "text" },
    { name: "bookingNumber", label: "Booking Number", type: "text", required: true },
    { name: "vesselName", label: "Vessel Name", type: "text" },
    { name: "voyageNumber", label: "Voyage Number", type: "text" },
    { name: "portOfLoading", label: "Port of Loading", type: "text", required: true },
    { name: "portOfDischarge", label: "Port of Discharge", type: "text", required: true },
    { name: "containerType", label: "Container Type", type: "select", required: true, options: ["20' GP", "40' GP", "40' HC", "20' RF", "40' RF", "20' OT", "40' OT", "20' FR", "40' FR", "20' TK", "LCL"] },
    { name: "numberOfContainers", label: "Number of Containers", type: "number", required: true },
    { name: "goodsDescription", label: "Description of Goods", type: "textarea", required: true },
    { name: "grossWeight", label: "Gross Weight (kg)", type: "number", required: true },
    { name: "volume", label: "Volume (CBM)", type: "number" },
    { name: "temperature", label: "Temperature Setting (°C)", type: "text", placeholder: "For reefer containers" },
    { name: "ventilation", label: "Ventilation Setting", type: "text" },
    { name: "specialInstructions", label: "Special Handling Instructions", type: "textarea" },
    { name: "hazardousInfo", label: "Hazardous Cargo Info", type: "textarea", placeholder: "IMO Class, UN Number, etc." },
  ],
  previewComponent: (data: Record<string, string>) => (
    <div className="border rounded-lg p-8 bg-white text-black">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">SHIPPING INSTRUCTIONS</h1>
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
        <div><span className="font-semibold">SI No:</span> {data.siNumber || "___"}</div>
        <div><span className="font-semibold">Booking:</span> {data.bookingNumber || "___"}</div>
        <div><span className="font-semibold">Date:</span> {data.date || "___"}</div>
        <div><span className="font-semibold">POL:</span> {data.portOfLoading || "___"}</div>
        <div><span className="font-semibold">POD:</span> {data.portOfDischarge || "___"}</div>
        <div><span className="font-semibold">Container:</span> {data.containerType || "___"}</div>
      </div>
    </div>
  ),
};

export default function ShippingInstructionsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <DocumentGenerator template={template} />
    </div>
  );
}
