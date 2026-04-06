"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Building2,
  MapPin,
  Ship,
  Plane,
  Truck,
  Package,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Printer,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface ShipmentItem {
  id: string;
  description: string;
  hsCode: string;
  quantity: number;
  unit: string;
  netWeight: number;
  grossWeight: number;
  value: number;
  originCountry: string;
}

interface SLIData {
  // Reference Information
  sliNumber: string;
  sliDate: string;
  bookingNumber: string;
  referenceNumber: string;

  // Shipper Information
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCountry: string;
  shipperContact: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperTaxId: string;
  shipperEIN: string;

  // Consignee Information
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeCountry: string;
  consigneeContact: string;
  consigneePhone: string;
  consigneeEmail: string;

  // Notify Party
  notifyName: string;
  notifyAddress: string;
  notifyCity: string;
  notifyCountry: string;
  notifyContact: string;

  // Forwarder/Agent Information
  forwarderName: string;
  forwarderAddress: string;
  forwarderContact: string;
  forwarderPhone: string;
  forwarderAccount: string;

  // Shipment Details
  transportMode: string;
  incoterm: string;
  incotermPlace: string;
  portOfLoading: string;
  portOfDischarge: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  vesselName: string;
  voyageNumber: string;
  etd: string;
  eta: string;

  // Cargo Details
  cargoDescription: string;
  packagingType: string;
  totalPackages: number;
  totalGrossWeight: number;
  totalNetWeight: number;
  totalVolume: number;
  totalValue: number;
  currency: string;

  // Container Information
  containerNumber: string;
  containerType: string;
  sealNumber: string;

  // Special Instructions
  specialInstructions: string;
  hazardousGoods: boolean;
  hazardousClass: string;
  unNumber: string;
  temperatureRequired: string;
  insuranceRequired: boolean;
  insuranceAmount: number;

  // Document Requirements
  documentsRequired: string[];
  originalBills: number;
  copiesBills: number;

  // Bank Details
  bankName: string;
  bankAccount: string;
  bankSwift: string;

  // Items
  items: ShipmentItem[];
}

const incoterms = [
  { code: "EXW", name: "Ex Works", description: "Seller's premises" },
  { code: "FCA", name: "Free Carrier", description: "Named place" },
  { code: "FAS", name: "Free Alongside Ship", description: "Named port of shipment" },
  { code: "FOB", name: "Free On Board", description: "Named port of shipment" },
  { code: "CFR", name: "Cost and Freight", description: "Named port of destination" },
  { code: "CIF", name: "Cost, Insurance and Freight", description: "Named port of destination" },
  { code: "CPT", name: "Carriage Paid To", description: "Named place of destination" },
  { code: "CIP", name: "Carriage and Insurance Paid To", description: "Named place of destination" },
  { code: "DAP", name: "Delivered at Place", description: "Named place of destination" },
  { code: "DPU", name: "Delivered at Place Unloaded", description: "Named place of destination" },
  { code: "DDP", name: "Delivered Duty Paid", description: "Named place of destination" },
];

const transportModes = [
  { code: "ocean", name: "Ocean Freight", icon: Ship },
  { code: "air", name: "Air Freight", icon: Plane },
  { code: "road", name: "Road Transport", icon: Truck },
  { code: "rail", name: "Rail Transport", icon: Truck },
  { code: "multimodal", name: "Multimodal", icon: Package },
];

const containerTypes = [
  "20' Standard (20' GP)",
  "40' Standard (40' GP)",
  "40' High Cube (40' HC)",
  "20' Refrigerated (20' RF)",
  "40' Refrigerated (40' RF)",
  "20' Open Top (20' OT)",
  "40' Open Top (40' OT)",
  "20' Flat Rack (20' FR)",
  "40' Flat Rack (40' FR)",
  "20' Tank Container",
  "LCL (Less than Container Load)",
];

const packagingTypes = [
  "Pallets",
  "Cartons",
  "Wooden Cases",
  "Crates",
  "Drums",
  "Bags",
  "Bales",
  "Boxes",
  "Bulk",
  "Rolls",
];

const documentOptions = [
  "Bill of Lading",
  "Commercial Invoice",
  "Packing List",
  "Certificate of Origin",
  "Insurance Certificate",
  "Phytosanitary Certificate",
  "Fumigation Certificate",
  "Quality Certificate",
  "HS Code Declaration",
  "Dangerous Goods Declaration",
  "Export License",
];

const initialFormData: SLIData = {
  sliNumber: "SLI-2024-001",
  sliDate: new Date().toISOString().split("T")[0],
  bookingNumber: "",
  referenceNumber: "",
  shipperName: "",
  shipperAddress: "",
  shipperCity: "",
  shipperCountry: "",
  shipperContact: "",
  shipperPhone: "",
  shipperEmail: "",
  shipperTaxId: "",
  shipperEIN: "",
  consigneeName: "",
  consigneeAddress: "",
  consigneeCity: "",
  consigneeCountry: "",
  consigneeContact: "",
  consigneePhone: "",
  consigneeEmail: "",
  notifyName: "",
  notifyAddress: "",
  notifyCity: "",
  notifyCountry: "",
  notifyContact: "",
  forwarderName: "",
  forwarderAddress: "",
  forwarderContact: "",
  forwarderPhone: "",
  forwarderAccount: "",
  transportMode: "ocean",
  incoterm: "FOB",
  incotermPlace: "",
  portOfLoading: "",
  portOfDischarge: "",
  placeOfReceipt: "",
  placeOfDelivery: "",
  vesselName: "",
  voyageNumber: "",
  etd: "",
  eta: "",
  cargoDescription: "",
  packagingType: "Pallets",
  totalPackages: 0,
  totalGrossWeight: 0,
  totalNetWeight: 0,
  totalVolume: 0,
  totalValue: 0,
  currency: "USD",
  containerNumber: "",
  containerType: "40' Standard (40' GP)",
  sealNumber: "",
  specialInstructions: "",
  hazardousGoods: false,
  hazardousClass: "",
  unNumber: "",
  temperatureRequired: "",
  insuranceRequired: false,
  insuranceAmount: 0,
  documentsRequired: [],
  originalBills: 3,
  copiesBills: 5,
  bankName: "",
  bankAccount: "",
  bankSwift: "",
  items: [
    { id: "1", description: "", hsCode: "", quantity: 0, unit: "PCS", netWeight: 0, grossWeight: 0, value: 0, originCountry: "" }
  ],
};

export default function ShippersLetterOfInstructionGenerator() {
  const [formData, setFormData] = useState<SLIData>(initialFormData);
  const [activeTab, setActiveTab] = useState("form");

  const updateField = (field: keyof SLIData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof ShipmentItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: ShipmentItem = {
      id: Date.now().toString(),
      description: "",
      hsCode: "",
      quantity: 0,
      unit: "PCS",
      netWeight: 0,
      grossWeight: 0,
      value: 0,
      originCountry: "",
    };
    setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const removeItem = (id: string) => {
    if (formData.items.length > 1) {
      setFormData((prev) => ({
        ...prev,
        items: prev.items.filter((item) => item.id !== id),
      }));
    }
  };

  const handlePrint = () => {
    document.body.classList.add('printing-document');
    const originalTitle = document.title;
    document.title = 'Document';
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-document');
      document.title = originalTitle;
    }, 1000);
  };

  const handleReset = () => {
    setFormData(initialFormData);
  };

  const TransportIcon = transportModes.find(m => m.code === formData.transportMode)?.icon || Ship;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="form">Edit Form</TabsTrigger>
            <TabsTrigger value="preview">Preview SLI</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button
              onClick={handlePrint}
              className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 gap-2"
            >
              <Printer className="h-4 w-4" />
              Print SLI
            </Button>
          </div>
        </div>

        <TabsContent value="form" className="space-y-6">
          {/* Reference Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <FileText className="h-5 w-5" />
                Reference Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>SLI Number</Label>
                  <Input
                    value={formData.sliNumber}
                    onChange={(e) => updateField("sliNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SLI Date</Label>
                  <Input
                    type="date"
                    value={formData.sliDate}
                    onChange={(e) => updateField("sliDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Booking Number</Label>
                  <Input
                    value={formData.bookingNumber}
                    onChange={(e) => updateField("bookingNumber", e.target.value)}
                    placeholder="Carrier booking reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={formData.referenceNumber}
                    onChange={(e) => updateField("referenceNumber", e.target.value)}
                    placeholder="Your internal reference"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shipper Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Shipper / Exporter
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.shipperName}
                    onChange={(e) => updateField("shipperName", e.target.value)}
                    placeholder="Full company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Textarea
                    value={formData.shipperAddress}
                    onChange={(e) => updateField("shipperAddress", e.target.value)}
                    placeholder="Street address, city, postal code"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.shipperCity}
                      onChange={(e) => updateField("shipperCity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.shipperCountry}
                      onChange={(e) => updateField("shipperCountry", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={formData.shipperContact}
                    onChange={(e) => updateField("shipperContact", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.shipperPhone}
                      onChange={(e) => updateField("shipperPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.shipperEmail}
                      onChange={(e) => updateField("shipperEmail", e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tax ID</Label>
                    <Input
                      value={formData.shipperTaxId}
                      onChange={(e) => updateField("shipperTaxId", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>EIN / VAT Number</Label>
                    <Input
                      value={formData.shipperEIN}
                      onChange={(e) => updateField("shipperEIN", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Consignee Information */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Consignee / Receiver
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Company Name *</Label>
                  <Input
                    value={formData.consigneeName}
                    onChange={(e) => updateField("consigneeName", e.target.value)}
                    placeholder="Full company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address *</Label>
                  <Textarea
                    value={formData.consigneeAddress}
                    onChange={(e) => updateField("consigneeAddress", e.target.value)}
                    placeholder="Street address, city, postal code"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.consigneeCity}
                      onChange={(e) => updateField("consigneeCity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.consigneeCountry}
                      onChange={(e) => updateField("consigneeCountry", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={formData.consigneeContact}
                    onChange={(e) => updateField("consigneeContact", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.consigneePhone}
                      onChange={(e) => updateField("consigneePhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={formData.consigneeEmail}
                      onChange={(e) => updateField("consigneeEmail", e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notify Party & Forwarder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Notify Party */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <MapPin className="h-5 w-5" />
                  Notify Party
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={formData.notifyName}
                    onChange={(e) => updateField("notifyName", e.target.value)}
                    placeholder="Party to be notified"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={formData.notifyAddress}
                    onChange={(e) => updateField("notifyAddress", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      value={formData.notifyCity}
                      onChange={(e) => updateField("notifyCity", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input
                      value={formData.notifyCountry}
                      onChange={(e) => updateField("notifyCountry", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Contact</Label>
                  <Input
                    value={formData.notifyContact}
                    onChange={(e) => updateField("notifyContact", e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Freight Forwarder */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Freight Forwarder / Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={formData.forwarderName}
                    onChange={(e) => updateField("forwarderName", e.target.value)}
                    placeholder="Forwarding agent name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea
                    value={formData.forwarderAddress}
                    onChange={(e) => updateField("forwarderAddress", e.target.value)}
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Contact</Label>
                    <Input
                      value={formData.forwarderContact}
                      onChange={(e) => updateField("forwarderContact", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input
                      value={formData.forwarderPhone}
                      onChange={(e) => updateField("forwarderPhone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={formData.forwarderAccount}
                    onChange={(e) => updateField("forwarderAccount", e.target.value)}
                    placeholder="Agent account reference"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Shipment Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <TransportIcon className="h-5 w-5" />
                Shipment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Transport Mode and Incoterm */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Transport Mode</Label>
                  <Select value={formData.transportMode} onValueChange={(v) => updateField("transportMode", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transportModes.map((mode) => (
                        <SelectItem key={mode.code} value={mode.code}>
                          {mode.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Incoterm 2020</Label>
                  <Select value={formData.incoterm} onValueChange={(v) => updateField("incoterm", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {incoterms.map((term) => (
                        <SelectItem key={term.code} value={term.code}>
                          {term.code} - {term.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Named Place</Label>
                  <Input
                    value={formData.incotermPlace}
                    onChange={(e) => updateField("incotermPlace", e.target.value)}
                    placeholder="Incoterm place"
                  />
                </div>
              </div>

              {/* Ports and Places */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Place of Receipt</Label>
                  <Input
                    value={formData.placeOfReceipt}
                    onChange={(e) => updateField("placeOfReceipt", e.target.value)}
                    placeholder="Origin facility"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port of Loading</Label>
                  <Input
                    value={formData.portOfLoading}
                    onChange={(e) => updateField("portOfLoading", e.target.value)}
                    placeholder="POL"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port of Discharge</Label>
                  <Input
                    value={formData.portOfDischarge}
                    onChange={(e) => updateField("portOfDischarge", e.target.value)}
                    placeholder="POD"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Place of Delivery</Label>
                  <Input
                    value={formData.placeOfDelivery}
                    onChange={(e) => updateField("placeOfDelivery", e.target.value)}
                    placeholder="Final destination"
                  />
                </div>
              </div>

              {/* Vessel and Dates */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Vessel / Flight Name</Label>
                  <Input
                    value={formData.vesselName}
                    onChange={(e) => updateField("vesselName", e.target.value)}
                    placeholder="Carrier name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voyage / Flight No.</Label>
                  <Input
                    value={formData.voyageNumber}
                    onChange={(e) => updateField("voyageNumber", e.target.value)}
                    placeholder="Voyage reference"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ETD (Estimated Departure)</Label>
                  <Input
                    type="date"
                    value={formData.etd}
                    onChange={(e) => updateField("etd", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>ETA (Estimated Arrival)</Label>
                  <Input
                    type="date"
                    value={formData.eta}
                    onChange={(e) => updateField("eta", e.target.value)}
                  />
                </div>
              </div>

              {/* Container Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Container Number</Label>
                  <Input
                    value={formData.containerNumber}
                    onChange={(e) => updateField("containerNumber", e.target.value)}
                    placeholder="Container ID"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Container Type</Label>
                  <Select value={formData.containerType} onValueChange={(v) => updateField("containerType", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {containerTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Seal Number</Label>
                  <Input
                    value={formData.sealNumber}
                    onChange={(e) => updateField("sealNumber", e.target.value)}
                    placeholder="Seal reference"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cargo Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Package className="h-5 w-5" />
                Cargo Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                <div className="space-y-2">
                  <Label>Packaging Type</Label>
                  <Select value={formData.packagingType} onValueChange={(v) => updateField("packagingType", v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {packagingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Total Packages</Label>
                  <Input
                    type="number"
                    value={formData.totalPackages}
                    onChange={(e) => updateField("totalPackages", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gross Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.totalGrossWeight}
                    onChange={(e) => updateField("totalGrossWeight", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Net Weight (kg)</Label>
                  <Input
                    type="number"
                    value={formData.totalNetWeight}
                    onChange={(e) => updateField("totalNetWeight", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Volume (CBM)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.totalVolume}
                    onChange={(e) => updateField("totalVolume", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Total Value</Label>
                  <div className="flex gap-2">
                    <Select value={formData.currency} onValueChange={(v) => updateField("currency", v)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CNY">CNY</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={formData.totalValue}
                      onChange={(e) => updateField("totalValue", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>

              {/* Cargo Description */}
              <div className="space-y-2">
                <Label>General Cargo Description</Label>
                <Textarea
                  value={formData.cargoDescription}
                  onChange={(e) => updateField("cargoDescription", e.target.value)}
                  placeholder="General description of goods being shipped"
                  rows={2}
                />
              </div>

              {/* Items Table */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-semibold">Item Details</h4>
                  <Button onClick={addItem} size="sm" className="gap-1">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">HS Code</th>
                        <th className="text-right p-2 w-20">Qty</th>
                        <th className="text-left p-2 w-20">Unit</th>
                        <th className="text-right p-2 w-24">Net Wt</th>
                        <th className="text-right p-2 w-24">Gross Wt</th>
                        <th className="text-right p-2 w-28">Value</th>
                        <th className="text-left p-2">Origin</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100 dark:border-slate-800">
                          <td className="p-2">
                            <Input
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                              placeholder="Item description"
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={item.hsCode}
                              onChange={(e) => updateItem(item.id, "hsCode", e.target.value)}
                              placeholder="HS Code"
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, "unit", e.target.value)}
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={item.netWeight}
                              onChange={(e) => updateItem(item.id, "netWeight", parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={item.grossWeight}
                              onChange={(e) => updateItem(item.id, "grossWeight", parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              type="number"
                              value={item.value}
                              onChange={(e) => updateItem(item.id, "value", parseFloat(e.target.value) || 0)}
                              className="h-8 text-right"
                            />
                          </td>
                          <td className="p-2">
                            <Input
                              value={item.originCountry}
                              onChange={(e) => updateItem(item.id, "originCountry", e.target.value)}
                              placeholder="Country"
                              className="h-8"
                            />
                          </td>
                          <td className="p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Instructions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <AlertCircle className="h-5 w-5" />
                Special Instructions & Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-2">
                <Label>Special Handling Instructions</Label>
                <Textarea
                  value={formData.specialInstructions}
                  onChange={(e) => updateField("specialInstructions", e.target.value)}
                  placeholder="Any special handling or shipping instructions"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hazardous Goods */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="hazardous"
                      checked={formData.hazardousGoods}
                      onChange={(e) => updateField("hazardousGoods", e.target.checked)}
                      className="rounded border-slate-300"
                    />
                    <Label htmlFor="hazardous" className="font-medium">Hazardous Goods (Dangerous Goods)</Label>
                  </div>
                  {formData.hazardousGoods && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label>IMDG Class</Label>
                        <Input
                          value={formData.hazardousClass}
                          onChange={(e) => updateField("hazardousClass", e.target.value)}
                          placeholder="e.g., 3, 4.1, 6.1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>UN Number</Label>
                        <Input
                          value={formData.unNumber}
                          onChange={(e) => updateField("unNumber", e.target.value)}
                          placeholder="e.g., UN1230"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Temperature Controlled */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="tempControl"
                      checked={!!formData.temperatureRequired}
                      onChange={(e) => updateField("temperatureRequired", e.target.checked ? "" : undefined)}
                      className="rounded border-slate-300"
                    />
                    <Label htmlFor="tempControl" className="font-medium">Temperature Controlled Cargo</Label>
                  </div>
                  {formData.temperatureRequired !== undefined && formData.temperatureRequired !== "" && (
                    <div className="pl-6">
                      <div className="space-y-2">
                        <Label>Required Temperature</Label>
                        <Input
                          value={formData.temperatureRequired}
                          onChange={(e) => updateField("temperatureRequired", e.target.value)}
                          placeholder="e.g., -18°C to -20°C"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Insurance */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={formData.insuranceRequired}
                    onChange={(e) => updateField("insuranceRequired", e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <Label htmlFor="insurance" className="font-medium">Marine Insurance Required</Label>
                </div>
                {formData.insuranceRequired && (
                  <div className="pl-6">
                    <div className="space-y-2">
                      <Label>Insurance Amount ({formData.currency})</Label>
                      <Input
                        type="number"
                        value={formData.insuranceAmount}
                        onChange={(e) => updateField("insuranceAmount", parseFloat(e.target.value) || 0)}
                        placeholder="Amount to insure"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bank Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => updateField("bankName", e.target.value)}
                    placeholder="For LC documentation"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bank Account</Label>
                  <Input
                    value={formData.bankAccount}
                    onChange={(e) => updateField("bankAccount", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>SWIFT Code</Label>
                  <Input
                    value={formData.bankSwift}
                    onChange={(e) => updateField("bankSwift", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card className="border-0 shadow-lg print:shadow-none" id="sli-document">
            <CardContent className="p-8">
              {/* Header */}
              <div className="flex justify-between items-start mb-8 border-b-2 border-[#0F4C81] pb-6">
                <div>
                  <h1 className="text-2xl font-bold text-[#0F4C81]">SHIPPER'S LETTER OF INSTRUCTION</h1>
                  <p className="text-muted-foreground mt-1">Export Shipping Instructions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formData.sliNumber}</p>
                  <p className="text-sm text-muted-foreground">Date: {formData.sliDate}</p>
                  {formData.bookingNumber && (
                    <p className="text-sm text-muted-foreground">Booking: {formData.bookingNumber}</p>
                  )}
                </div>
              </div>

              {/* Shipper & Consignee Grid */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="border border-slate-200 p-4 rounded">
                  <h3 className="font-semibold text-[#0F4C81] mb-2 text-sm uppercase tracking-wide">Shipper / Exporter</h3>
                  <p className="font-medium">{formData.shipperName || "[Shipper Name]"}</p>
                  <p className="text-sm whitespace-pre-line">{formData.shipperAddress || "[Address]"}</p>
                  <p className="text-sm">{formData.shipperCity && formData.shipperCountry && `${formData.shipperCity}, ${formData.shipperCountry}`}</p>
                  {formData.shipperContact && <p className="text-sm text-muted-foreground">Contact: {formData.shipperContact}</p>}
                  {formData.shipperPhone && <p className="text-sm text-muted-foreground">Tel: {formData.shipperPhone}</p>}
                  {formData.shipperEmail && <p className="text-sm text-muted-foreground">Email: {formData.shipperEmail}</p>}
                  {formData.shipperTaxId && <p className="text-sm text-muted-foreground">Tax ID: {formData.shipperTaxId}</p>}
                </div>

                <div className="border border-slate-200 p-4 rounded">
                  <h3 className="font-semibold text-[#0F4C81] mb-2 text-sm uppercase tracking-wide">Consignee / Receiver</h3>
                  <p className="font-medium">{formData.consigneeName || "[Consignee Name]"}</p>
                  <p className="text-sm whitespace-pre-line">{formData.consigneeAddress || "[Address]"}</p>
                  <p className="text-sm">{formData.consigneeCity && formData.consigneeCountry && `${formData.consigneeCity}, ${formData.consigneeCountry}`}</p>
                  {formData.consigneeContact && <p className="text-sm text-muted-foreground">Contact: {formData.consigneeContact}</p>}
                  {formData.consigneePhone && <p className="text-sm text-muted-foreground">Tel: {formData.consigneePhone}</p>}
                  {formData.consigneeEmail && <p className="text-sm text-muted-foreground">Email: {formData.consigneeEmail}</p>}
                </div>
              </div>

              {/* Notify Party */}
              {formData.notifyName && (
                <div className="border border-slate-200 p-4 rounded mb-6">
                  <h3 className="font-semibold text-[#0F4C81] mb-2 text-sm uppercase tracking-wide">Notify Party</h3>
                  <p className="font-medium">{formData.notifyName}</p>
                  {formData.notifyAddress && <p className="text-sm whitespace-pre-line">{formData.notifyAddress}</p>}
                  {formData.notifyContact && <p className="text-sm text-muted-foreground">Contact: {formData.notifyContact}</p>}
                </div>
              )}

              {/* Forwarder */}
              {formData.forwarderName && (
                <div className="border border-slate-200 p-4 rounded mb-6">
                  <h3 className="font-semibold text-[#0F4C81] mb-2 text-sm uppercase tracking-wide">Freight Forwarder / Agent</h3>
                  <p className="font-medium">{formData.forwarderName}</p>
                  {formData.forwarderAddress && <p className="text-sm whitespace-pre-line">{formData.forwarderAddress}</p>}
                  {formData.forwarderAccount && <p className="text-sm text-muted-foreground">Account: {formData.forwarderAccount}</p>}
                </div>
              )}

              {/* Shipment Details */}
              <div className="border border-slate-200 p-4 rounded mb-6">
                <h3 className="font-semibold text-[#0F4C81] mb-4 text-sm uppercase tracking-wide">Shipment Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Transport Mode</p>
                    <p className="font-medium">{transportModes.find(m => m.code === formData.transportMode)?.name || formData.transportMode}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Incoterm</p>
                    <p className="font-medium">{formData.incoterm} {formData.incotermPlace && `- ${formData.incotermPlace}`}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Place of Receipt</p>
                    <p className="font-medium">{formData.placeOfReceipt || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Place of Delivery</p>
                    <p className="font-medium">{formData.placeOfDelivery || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Port of Loading</p>
                    <p className="font-medium">{formData.portOfLoading || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Port of Discharge</p>
                    <p className="font-medium">{formData.portOfDischarge || "-"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Vessel / Flight</p>
                    <p className="font-medium">{formData.vesselName || "-"} {formData.voyageNumber && `/ ${formData.voyageNumber}`}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">ETD / ETA</p>
                    <p className="font-medium">{formData.etd || "-"} / {formData.eta || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Container Details */}
              {(formData.containerNumber || formData.containerType) && (
                <div className="border border-slate-200 p-4 rounded mb-6">
                  <h3 className="font-semibold text-[#0F4C81] mb-4 text-sm uppercase tracking-wide">Container Details</h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Container Number</p>
                      <p className="font-medium">{formData.containerNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Type</p>
                      <p className="font-medium">{formData.containerType || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Seal Number</p>
                      <p className="font-medium">{formData.sealNumber || "-"}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Cargo Summary */}
              <div className="border border-slate-200 p-4 rounded mb-6">
                <h3 className="font-semibold text-[#0F4C81] mb-4 text-sm uppercase tracking-wide">Cargo Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                  <div>
                    <p className="text-muted-foreground">Packaging</p>
                    <p className="font-medium">{formData.packagingType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Packages</p>
                    <p className="font-medium">{formData.totalPackages}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Gross Weight</p>
                    <p className="font-medium">{formData.totalGrossWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Net Weight</p>
                    <p className="font-medium">{formData.totalNetWeight} kg</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Volume</p>
                    <p className="font-medium">{formData.totalVolume} CBM</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Value</p>
                    <p className="font-medium">{formData.currency} {formData.totalValue.toLocaleString()}</p>
                  </div>
                </div>
                {formData.cargoDescription && (
                  <div className="text-sm">
                    <p className="text-muted-foreground">Description</p>
                    <p>{formData.cargoDescription}</p>
                  </div>
                )}
              </div>

              {/* Items Table */}
              {formData.items.some(item => item.description) && (
                <div className="mb-6 overflow-x-auto">
                  <h3 className="font-semibold text-[#0F4C81] mb-4 text-sm uppercase tracking-wide">Item Details</h3>
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800">
                        <th className="border p-2 text-left">Description</th>
                        <th className="border p-2 text-left">HS Code</th>
                        <th className="border p-2 text-right">Qty</th>
                        <th className="border p-2 text-left">Unit</th>
                        <th className="border p-2 text-right">Net Wt</th>
                        <th className="border p-2 text-right">Gross Wt</th>
                        <th className="border p-2 text-right">Value</th>
                        <th className="border p-2 text-left">Origin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.filter(item => item.description).map((item) => (
                        <tr key={item.id}>
                          <td className="border p-2">{item.description}</td>
                          <td className="border p-2">{item.hsCode}</td>
                          <td className="border p-2 text-right">{item.quantity}</td>
                          <td className="border p-2">{item.unit}</td>
                          <td className="border p-2 text-right">{item.netWeight} kg</td>
                          <td className="border p-2 text-right">{item.grossWeight} kg</td>
                          <td className="border p-2 text-right">{formData.currency} {item.value.toLocaleString()}</td>
                          <td className="border p-2">{item.originCountry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Special Requirements */}
              {(formData.hazardousGoods || formData.temperatureRequired || formData.specialInstructions) && (
                <div className="border border-slate-200 p-4 rounded mb-6">
                  <h3 className="font-semibold text-[#0F4C81] mb-4 text-sm uppercase tracking-wide">Special Requirements</h3>
                  {formData.hazardousGoods && (
                    <div className="text-sm mb-2 p-2 bg-red-50 rounded">
                      <span className="font-medium text-red-700">⚠ HAZARDOUS GOODS - </span>
                      Class: {formData.hazardousClass || "TBD"}, UN: {formData.unNumber || "TBD"}
                    </div>
                  )}
                  {formData.temperatureRequired && (
                    <div className="text-sm mb-2 p-2 bg-blue-50 rounded">
                      <span className="font-medium text-blue-700">❄ TEMPERATURE CONTROLLED - </span>
                      Required: {formData.temperatureRequired}
                    </div>
                  )}
                  {formData.specialInstructions && (
                    <div className="text-sm mt-2">
                      <p className="text-muted-foreground">Special Instructions:</p>
                      <p className="whitespace-pre-line">{formData.specialInstructions}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Insurance */}
              {formData.insuranceRequired && (
                <div className="border border-slate-200 p-4 rounded mb-6">
                  <h3 className="font-semibold text-[#0F4C81] mb-2 text-sm uppercase tracking-wide">Insurance Request</h3>
                  <p className="text-sm">Marine insurance requested for {formData.currency} {formData.insuranceAmount.toLocaleString()}</p>
                </div>
              )}

              {/* Authorization */}
              <div className="mt-12 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-2 gap-12">
                  <div>
                    <p className="text-sm text-muted-foreground mb-8">Shipper's Signature & Authorization</p>
                    <div className="border-t border-slate-400 pt-2">
                      <p className="text-sm">Authorized Signature</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-8">Date & Company Stamp</p>
                    <div className="border-t border-slate-400 pt-2">
                      <p className="text-sm">Date: __________________</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-muted-foreground text-center">
                <p>This Shipper's Letter of Instruction is provided for the purposes of arranging transportation and export documentation.</p>
                <p className="mt-1">The shipper certifies that the information provided is accurate and complete.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #sli-document, #sli-document * {
            visibility: visible;
          }
          #sli-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
