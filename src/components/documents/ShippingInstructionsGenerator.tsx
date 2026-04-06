"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Ship,
  Building2,
  MapPin,
  Container,
  Package,
  Download,
  Printer,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Phone,
  Mail,
  AlertTriangle,
  Thermometer,
  User,
  Globe,
  Anchor,
  Box,
  Weight,
  Hash,
  ClipboardList,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Snowflake,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CargoItem {
  id: string;
  description: string;
  hsCode: string;
  numberOfPackages: number;
  packageType: string;
  grossWeight: number;
  netWeight: number;
  volume: number;
  marksNumbers: string;
}

interface ContainerItem {
  id: string;
  containerNumber: string;
  containerType: string;
  sealNumber: string;
  grossWeight: number;
  tareWeight: number;
  netWeight: number;
  volume: number;
  cargoItems: CargoItem[];
}

interface HazardousMaterialInfo {
  isHazardous: boolean;
  unNumber: string;
  properShippingName: string;
  imoClass: string;
  packingGroup: string;
  flashPoint: string;
  emergencyContact: string;
  additionalInfo: string;
}

interface TemperatureRequirements {
  isTemperatureControlled: boolean;
  temperatureMin: string;
  temperatureMax: string;
  humidityMin: string;
  humidityMax: string;
  ventilationRequirement: string;
  temperatureUnit: "C" | "F";
}

interface ShippingInstructionsData {
  // Document Info
  siNumber: string;
  siDate: string;
  bookingNumber: string;
  
  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCountry: string;
  shipperPostalCode: string;
  shipperPhone: string;
  shipperEmail: string;
  shipperVat: string;
  shipperEori: string;
  
  // Forwarder
  forwarderName: string;
  forwarderAddress: string;
  forwarderReference: string;
  forwarderPhone: string;
  forwarderEmail: string;
  
  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeCountry: string;
  consigneePostalCode: string;
  consigneeContact: string;
  consigneePhone: string;
  consigneeEmail: string;
  
  // Notify Party
  notifyName: string;
  notifyAddress: string;
  notifyPhone: string;
  notifyEmail: string;
  
  // Vessel & Voyage
  vesselName: string;
  voyageNumber: string;
  carrierName: string;
  carrierCode: string;
  
  // Ports
  portOfLoading: string;
  portOfLoadingCode: string;
  portOfDischarge: string;
  portOfDischargeCode: string;
  placeOfReceipt: string;
  placeOfDelivery: string;
  
  // Containers
  containers: ContainerItem[];
  
  // Terms
  incoterm: string;
  incotermPlace: string;
  paymentTerms: string;
  freightTerms: string;
  
  // Hazardous Materials
  hazardousMaterial: HazardousMaterialInfo;
  
  // Temperature Requirements
  temperatureRequirements: TemperatureRequirements;
  
  // Special Instructions
  specialHandlingInstructions: string;
  stackingInstructions: string;
  weightDistributionNotes: string;
  
  // Release
  releaseType: string;
  
  // Additional
  totalGrossWeight: number;
  totalNetWeight: number;
  totalVolume: number;
  totalPackages: number;
}

const defaultCargoItem = (): CargoItem => ({
  id: crypto.randomUUID(),
  description: "",
  hsCode: "",
  numberOfPackages: 0,
  packageType: "Cartons",
  grossWeight: 0,
  netWeight: 0,
  volume: 0,
  marksNumbers: "",
});

const defaultContainerItem = (): ContainerItem => ({
  id: crypto.randomUUID(),
  containerNumber: "",
  containerType: "40HC",
  sealNumber: "",
  grossWeight: 0,
  tareWeight: 0,
  netWeight: 0,
  volume: 0,
  cargoItems: [defaultCargoItem()],
});

const containerTypes = [
  { value: "20GP", label: "20' General Purpose", tareWeight: 2300 },
  { value: "40GP", label: "40' General Purpose", tareWeight: 3800 },
  { value: "40HC", label: "40' High Cube", tareWeight: 3900 },
  { value: "45HC", label: "45' High Cube", tareWeight: 4800 },
  { value: "20RF", label: "20' Refrigerated", tareWeight: 3000 },
  { value: "40RF", label: "40' Refrigerated", tareWeight: 4400 },
  { value: "20OT", label: "20' Open Top", tareWeight: 2400 },
  { value: "40OT", label: "40' Open Top", tareWeight: 3900 },
  { value: "20FR", label: "20' Flat Rack", tareWeight: 2500 },
  { value: "40FR", label: "40' Flat Rack", tareWeight: 5200 },
  { value: "20TK", label: "20' Tank", tareWeight: 3500 },
  { value: "20OG", label: "20' Open Side", tareWeight: 2400 },
];

const packageTypes = [
  "Cartons",
  "Pallets",
  "Boxes",
  "Bags",
  "Bales",
  "Drums",
  "Crates",
  "Pieces",
  "Units",
  "Rolls",
  "Coils",
  "Cases",
  "Bundles",
  "Cans",
  "Bottles",
];

const imoClasses = [
  { value: "1", label: "Class 1 - Explosives" },
  { value: "2.1", label: "Class 2.1 - Flammable Gas" },
  { value: "2.2", label: "Class 2.2 - Non-Flammable Gas" },
  { value: "2.3", label: "Class 2.3 - Toxic Gas" },
  { value: "3", label: "Class 3 - Flammable Liquids" },
  { value: "4.1", label: "Class 4.1 - Flammable Solids" },
  { value: "4.2", label: "Class 4.2 - Spontaneously Combustible" },
  { value: "4.3", label: "Class 4.3 - Dangerous When Wet" },
  { value: "5.1", label: "Class 5.1 - Oxidizing Substances" },
  { value: "5.2", label: "Class 5.2 - Organic Peroxides" },
  { value: "6.1", label: "Class 6.1 - Toxic Substances" },
  { value: "6.2", label: "Class 6.2 - Infectious Substances" },
  { value: "7", label: "Class 7 - Radioactive Material" },
  { value: "8", label: "Class 8 - Corrosive Substances" },
  { value: "9", label: "Class 9 - Miscellaneous Dangerous Goods" },
];

const packingGroups = [
  { value: "I", label: "I - Great Danger" },
  { value: "II", label: "II - Medium Danger" },
  { value: "III", label: "III - Minor Danger" },
];

const incoterms = [
  { value: "EXW", label: "EXW - Ex Works" },
  { value: "FCA", label: "FCA - Free Carrier" },
  { value: "FAS", label: "FAS - Free Alongside Ship" },
  { value: "FOB", label: "FOB - Free On Board" },
  { value: "CFR", label: "CFR - Cost and Freight" },
  { value: "CIF", label: "CIF - Cost, Insurance and Freight" },
  { value: "CPT", label: "CPT - Carriage Paid To" },
  { value: "CIP", label: "CIP - Carriage and Insurance Paid To" },
  { value: "DAP", label: "DAP - Delivered At Place" },
  { value: "DPU", label: "DPU - Delivered at Place Unloaded" },
  { value: "DDP", label: "DDP - Delivered Duty Paid" },
];

const releaseTypes = [
  { value: "original", label: "Original B/L" },
  { value: "seaway", label: "Seaway Bill" },
  { value: "telex", label: "Telex Release" },
  { value: "express", label: "Express B/L" },
  { value: "electronic", label: "Electronic B/L" },
];

export function ShippingInstructionsGenerator() {
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [siData, setSiData] = useState<ShippingInstructionsData>({
    siNumber: `SI-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`,
    siDate: new Date().toISOString().split('T')[0],
    bookingNumber: "",
    shipperName: "",
    shipperAddress: "",
    shipperCity: "",
    shipperCountry: "",
    shipperPostalCode: "",
    shipperPhone: "",
    shipperEmail: "",
    shipperVat: "",
    shipperEori: "",
    forwarderName: "",
    forwarderAddress: "",
    forwarderReference: "",
    forwarderPhone: "",
    forwarderEmail: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeCity: "",
    consigneeCountry: "",
    consigneePostalCode: "",
    consigneeContact: "",
    consigneePhone: "",
    consigneeEmail: "",
    notifyName: "",
    notifyAddress: "",
    notifyPhone: "",
    notifyEmail: "",
    vesselName: "",
    voyageNumber: "",
    carrierName: "",
    carrierCode: "",
    portOfLoading: "",
    portOfLoadingCode: "",
    portOfDischarge: "",
    portOfDischargeCode: "",
    placeOfReceipt: "",
    placeOfDelivery: "",
    containers: [defaultContainerItem()],
    incoterm: "FOB",
    incotermPlace: "",
    paymentTerms: "",
    freightTerms: "Prepaid",
    hazardousMaterial: {
      isHazardous: false,
      unNumber: "",
      properShippingName: "",
      imoClass: "",
      packingGroup: "",
      flashPoint: "",
      emergencyContact: "",
      additionalInfo: "",
    },
    temperatureRequirements: {
      isTemperatureControlled: false,
      temperatureMin: "",
      temperatureMax: "",
      humidityMin: "",
      humidityMax: "",
      ventilationRequirement: "",
      temperatureUnit: "C",
    },
    specialHandlingInstructions: "",
    stackingInstructions: "",
    weightDistributionNotes: "",
    releaseType: "original",
    totalGrossWeight: 0,
    totalNetWeight: 0,
    totalVolume: 0,
    totalPackages: 0,
  });

  const updateField = <K extends keyof ShippingInstructionsData>(field: K, value: ShippingInstructionsData[K]) => {
    setSiData((prev) => ({ ...prev, [field]: value }));
  };

  const updateHazardousMaterial = (field: keyof HazardousMaterialInfo, value: string | boolean) => {
    setSiData((prev) => ({
      ...prev,
      hazardousMaterial: { ...prev.hazardousMaterial, [field]: value },
    }));
  };

  const updateTemperatureRequirements = (field: keyof TemperatureRequirements, value: string | boolean) => {
    setSiData((prev) => ({
      ...prev,
      temperatureRequirements: { ...prev.temperatureRequirements, [field]: value },
    }));
  };

  const updateContainer = (containerId: string, field: keyof ContainerItem, value: string | number) => {
    setSiData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.id === containerId ? { ...container, [field]: value } : container
      ),
    }));
  };

  const addContainer = () => {
    setSiData((prev) => ({
      ...prev,
      containers: [...prev.containers, defaultContainerItem()],
    }));
  };

  const removeContainer = (containerId: string) => {
    if (siData.containers.length > 1) {
      setSiData((prev) => ({
        ...prev,
        containers: prev.containers.filter((container) => container.id !== containerId),
      }));
    }
  };

  const updateCargoItem = (containerId: string, cargoId: string, field: keyof CargoItem, value: string | number) => {
    setSiData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.id === containerId
          ? {
              ...container,
              cargoItems: container.cargoItems.map((cargo) =>
                cargo.id === cargoId ? { ...cargo, [field]: value } : cargo
              ),
            }
          : container
      ),
    }));
  };

  const addCargoItem = (containerId: string) => {
    setSiData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.id === containerId
          ? { ...container, cargoItems: [...container.cargoItems, defaultCargoItem()] }
          : container
      ),
    }));
  };

  const removeCargoItem = (containerId: string, cargoId: string) => {
    setSiData((prev) => ({
      ...prev,
      containers: prev.containers.map((container) =>
        container.id === containerId && container.cargoItems.length > 1
          ? { ...container, cargoItems: container.cargoItems.filter((cargo) => cargo.id !== cargoId) }
          : container
      ),
    }));
  };

  // Calculate totals
  const totals = {
    containers: siData.containers.length,
    grossWeight: siData.containers.reduce(
      (sum, c) => sum + c.grossWeight + c.cargoItems.reduce((s, ci) => s + ci.grossWeight, 0),
      0
    ),
    netWeight: siData.containers.reduce(
      (sum, c) => sum + c.netWeight + c.cargoItems.reduce((s, ci) => s + ci.netWeight, 0),
      0
    ),
    volume: siData.containers.reduce(
      (sum, c) => sum + c.volume + c.cargoItems.reduce((s, ci) => s + ci.volume, 0),
      0
    ),
    packages: siData.containers.reduce(
      (sum, c) => sum + c.cargoItems.reduce((s, ci) => s + ci.numberOfPackages, 0),
      0
    ),
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

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Input Panel */}
      <div className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="basic" className="text-xs md:text-sm">Basic</TabsTrigger>
            <TabsTrigger value="parties" className="text-xs md:text-sm">Parties</TabsTrigger>
            <TabsTrigger value="containers" className="text-xs md:text-sm">Containers</TabsTrigger>
            <TabsTrigger value="hazardous" className="text-xs md:text-sm">DG/Temp</TabsTrigger>
            <TabsTrigger value="special" className="text-xs md:text-sm">Special</TabsTrigger>
          </TabsList>

          {/* Basic Tab */}
          <TabsContent value="basic" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 text-[var(--ocean)]" />
                  Document Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">SI Number</Label>
                    <Input
                      value={siData.siNumber}
                      onChange={(e) => updateField("siNumber", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Date</Label>
                    <Input
                      type="date"
                      value={siData.siDate}
                      onChange={(e) => updateField("siDate", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Booking Reference</Label>
                  <Input
                    value={siData.bookingNumber}
                    onChange={(e) => updateField("bookingNumber", e.target.value)}
                    placeholder="Enter carrier booking reference number"
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Ship className="h-4 w-4 text-[var(--ocean)]" />
                  Vessel & Voyage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Vessel Name</Label>
                    <Input
                      value={siData.vesselName}
                      onChange={(e) => updateField("vesselName", e.target.value)}
                      placeholder="e.g., MSC GÜLSÜN"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Voyage Number</Label>
                    <Input
                      value={siData.voyageNumber}
                      onChange={(e) => updateField("voyageNumber", e.target.value)}
                      placeholder="e.g., 245E"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Carrier Name</Label>
                    <Input
                      value={siData.carrierName}
                      onChange={(e) => updateField("carrierName", e.target.value)}
                      placeholder="e.g., Maersk Line"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Carrier SCAC Code</Label>
                    <Input
                      value={siData.carrierCode}
                      onChange={(e) => updateField("carrierCode", e.target.value.toUpperCase())}
                      placeholder="e.g., MAEU"
                      className="font-mono text-sm"
                      maxLength={4}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Anchor className="h-4 w-4 text-[var(--logistics)]" />
                  Ports & Places
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Port of Loading (POL)</Label>
                    <Input
                      value={siData.portOfLoading}
                      onChange={(e) => updateField("portOfLoading", e.target.value)}
                      placeholder="e.g., Shanghai"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">POL Code</Label>
                    <Input
                      value={siData.portOfLoadingCode}
                      onChange={(e) => updateField("portOfLoadingCode", e.target.value.toUpperCase())}
                      placeholder="e.g., CNSHA"
                      className="font-mono text-sm"
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Port of Discharge (POD)</Label>
                    <Input
                      value={siData.portOfDischarge}
                      onChange={(e) => updateField("portOfDischarge", e.target.value)}
                      placeholder="e.g., Rotterdam"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">POD Code</Label>
                    <Input
                      value={siData.portOfDischargeCode}
                      onChange={(e) => updateField("portOfDischargeCode", e.target.value.toUpperCase())}
                      placeholder="e.g., NLRTM"
                      className="font-mono text-sm"
                      maxLength={5}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Place of Receipt</Label>
                    <Input
                      value={siData.placeOfReceipt}
                      onChange={(e) => updateField("placeOfReceipt", e.target.value)}
                      placeholder="Pre-carriage location"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Place of Delivery</Label>
                    <Input
                      value={siData.placeOfDelivery}
                      onChange={(e) => updateField("placeOfDelivery", e.target.value)}
                      placeholder="On-carriage location"
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Parties Tab */}
          <TabsContent value="parties" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-[var(--ocean)]" />
                  Shipper (Exporter)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Company Name</Label>
                  <Input
                    value={siData.shipperName}
                    onChange={(e) => updateField("shipperName", e.target.value)}
                    placeholder="Shipper company name"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Address</Label>
                  <Textarea
                    value={siData.shipperAddress}
                    onChange={(e) => updateField("shipperAddress", e.target.value)}
                    rows={2}
                    placeholder="Street address"
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">City</Label>
                    <Input
                      value={siData.shipperCity}
                      onChange={(e) => updateField("shipperCity", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Country</Label>
                    <Input
                      value={siData.shipperCountry}
                      onChange={(e) => updateField("shipperCountry", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Postal Code</Label>
                    <Input
                      value={siData.shipperPostalCode}
                      onChange={(e) => updateField("shipperPostalCode", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1">
                      <Phone className="h-3 w-3" /> Phone
                    </Label>
                    <Input
                      value={siData.shipperPhone}
                      onChange={(e) => updateField("shipperPhone", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm flex items-center gap-1">
                      <Mail className="h-3 w-3" /> Email
                    </Label>
                    <Input
                      type="email"
                      value={siData.shipperEmail}
                      onChange={(e) => updateField("shipperEmail", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">VAT/Tax ID</Label>
                    <Input
                      value={siData.shipperVat}
                      onChange={(e) => updateField("shipperVat", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">EORI Number</Label>
                    <Input
                      value={siData.shipperEori}
                      onChange={(e) => updateField("shipperEori", e.target.value)}
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-4 w-4 text-[var(--logistics)]" />
                  Freight Forwarder
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Company Name</Label>
                    <Input
                      value={siData.forwarderName}
                      onChange={(e) => updateField("forwarderName", e.target.value)}
                      placeholder="Forwarding agent"
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Reference</Label>
                    <Input
                      value={siData.forwarderReference}
                      onChange={(e) => updateField("forwarderReference", e.target.value)}
                      placeholder="Forwarder's ref"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Address</Label>
                  <Input
                    value={siData.forwarderAddress}
                    onChange={(e) => updateField("forwarderAddress", e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={siData.forwarderPhone}
                      onChange={(e) => updateField("forwarderPhone", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={siData.forwarderEmail}
                      onChange={(e) => updateField("forwarderEmail", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-4 w-4 text-[var(--ocean)]" />
                  Consignee (Importer)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Company Name</Label>
                  <Input
                    value={siData.consigneeName}
                    onChange={(e) => updateField("consigneeName", e.target.value)}
                    placeholder="Consignee company name"
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Address</Label>
                  <Textarea
                    value={siData.consigneeAddress}
                    onChange={(e) => updateField("consigneeAddress", e.target.value)}
                    rows={2}
                    className="text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">City</Label>
                    <Input
                      value={siData.consigneeCity}
                      onChange={(e) => updateField("consigneeCity", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Country</Label>
                    <Input
                      value={siData.consigneeCountry}
                      onChange={(e) => updateField("consigneeCountry", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Postal Code</Label>
                    <Input
                      value={siData.consigneePostalCode}
                      onChange={(e) => updateField("consigneePostalCode", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Contact Person</Label>
                    <Input
                      value={siData.consigneeContact}
                      onChange={(e) => updateField("consigneeContact", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={siData.consigneePhone}
                      onChange={(e) => updateField("consigneePhone", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={siData.consigneeEmail}
                      onChange={(e) => updateField("consigneeEmail", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Notify Party</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Company Name</Label>
                    <Input
                      value={siData.notifyName}
                      onChange={(e) => updateField("notifyName", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Address</Label>
                    <Input
                      value={siData.notifyAddress}
                      onChange={(e) => updateField("notifyAddress", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Phone</Label>
                    <Input
                      value={siData.notifyPhone}
                      onChange={(e) => updateField("notifyPhone", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Email</Label>
                    <Input
                      value={siData.notifyEmail}
                      onChange={(e) => updateField("notifyEmail", e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Containers Tab */}
          <TabsContent value="containers" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Container className="h-4 w-4 text-[var(--logistics)]" />
                  Container Specifications
                </CardTitle>
                <CardDescription className="text-sm">
                  Add container details and cargo items for each container
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="max-h-[600px] pr-4">
                  {siData.containers.map((container, containerIndex) => (
                    <motion.div
                      key={container.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 border rounded-lg bg-muted/20"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Box className="h-4 w-4 text-[var(--ocean)]" />
                          Container {containerIndex + 1}
                        </h4>
                        {siData.containers.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContainer(container.id)}
                            className="h-8 w-8 p-0 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-4 gap-3 mb-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Container Number</Label>
                          <Input
                            value={container.containerNumber}
                            onChange={(e) =>
                              updateContainer(container.id, "containerNumber", e.target.value.toUpperCase())
                            }
                            placeholder="MSCU1234567"
                            className="font-mono text-sm h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={container.containerType}
                            onValueChange={(v) => {
                              updateContainer(container.id, "containerType", v);
                              const tare = containerTypes.find((t) => t.value === v)?.tareWeight || 0;
                              updateContainer(container.id, "tareWeight", tare);
                            }}
                          >
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {containerTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value} className="text-sm">
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Seal Number</Label>
                          <Input
                            value={container.sealNumber}
                            onChange={(e) =>
                              updateContainer(container.id, "sealNumber", e.target.value.toUpperCase())
                            }
                            placeholder="Seal #"
                            className="font-mono text-sm h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Tare (kg)</Label>
                          <Input
                            type="number"
                            value={container.tareWeight || ""}
                            onChange={(e) =>
                              updateContainer(container.id, "tareWeight", Number(e.target.value))
                            }
                            className="text-sm h-8"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="space-y-1">
                          <Label className="text-xs">Gross Weight (kg)</Label>
                          <Input
                            type="number"
                            value={container.grossWeight || ""}
                            onChange={(e) =>
                              updateContainer(container.id, "grossWeight", Number(e.target.value))
                            }
                            className="text-sm h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Net Weight (kg)</Label>
                          <Input
                            type="number"
                            value={container.netWeight || ""}
                            onChange={(e) =>
                              updateContainer(container.id, "netWeight", Number(e.target.value))
                            }
                            className="text-sm h-8"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Volume (CBM)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={container.volume || ""}
                            onChange={(e) =>
                              updateContainer(container.id, "volume", Number(e.target.value))
                            }
                            className="text-sm h-8"
                          />
                        </div>
                      </div>

                      {/* Cargo Items */}
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value={`cargo-${container.id}`}>
                          <AccordionTrigger className="text-sm py-2">
                            <span className="flex items-center gap-2">
                              <Package className="h-3 w-3" />
                              Cargo Items ({container.cargoItems.length})
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-2">
                              {container.cargoItems.map((cargo, cargoIndex) => (
                                <div
                                  key={cargo.id}
                                  className="p-3 border rounded bg-background space-y-2"
                                >
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Item {cargoIndex + 1}
                                    </span>
                                    {container.cargoItems.length > 1 && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeCargoItem(container.id, cargo.id)}
                                        className="h-6 w-6 p-0"
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 gap-2">
                                    <div className="col-span-2 space-y-1">
                                      <Label className="text-xs">Description</Label>
                                      <Input
                                        value={cargo.description}
                                        onChange={(e) =>
                                          updateCargoItem(container.id, cargo.id, "description", e.target.value)
                                        }
                                        placeholder="Cargo description"
                                        className="text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs flex items-center gap-1">
                                        <Hash className="h-2 w-2" /> HS Code
                                      </Label>
                                      <Input
                                        value={cargo.hsCode}
                                        onChange={(e) =>
                                          updateCargoItem(container.id, cargo.id, "hsCode", e.target.value)
                                        }
                                        placeholder="9403.70"
                                        className="font-mono text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Marks & Numbers</Label>
                                      <Input
                                        value={cargo.marksNumbers}
                                        onChange={(e) =>
                                          updateCargoItem(container.id, cargo.id, "marksNumbers", e.target.value)
                                        }
                                        className="text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Packages</Label>
                                      <Input
                                        type="number"
                                        value={cargo.numberOfPackages || ""}
                                        onChange={(e) =>
                                          updateCargoItem(
                                            container.id,
                                            cargo.id,
                                            "numberOfPackages",
                                            Number(e.target.value)
                                          )
                                        }
                                        className="text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Pkg Type</Label>
                                      <Select
                                        value={cargo.packageType}
                                        onValueChange={(v) =>
                                          updateCargoItem(container.id, cargo.id, "packageType", v)
                                        }
                                      >
                                        <SelectTrigger className="h-7 text-sm">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {packageTypes.map((type) => (
                                            <SelectItem key={type} value={type} className="text-sm">
                                              {type}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Gross Wt (kg)</Label>
                                      <Input
                                        type="number"
                                        value={cargo.grossWeight || ""}
                                        onChange={(e) =>
                                          updateCargoItem(
                                            container.id,
                                            cargo.id,
                                            "grossWeight",
                                            Number(e.target.value)
                                          )
                                        }
                                        className="text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Net Wt (kg)</Label>
                                      <Input
                                        type="number"
                                        value={cargo.netWeight || ""}
                                        onChange={(e) =>
                                          updateCargoItem(
                                            container.id,
                                            cargo.id,
                                            "netWeight",
                                            Number(e.target.value)
                                          )
                                        }
                                        className="text-sm h-7"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <Label className="text-xs">Volume (CBM)</Label>
                                      <Input
                                        type="number"
                                        step="0.01"
                                        value={cargo.volume || ""}
                                        onChange={(e) =>
                                          updateCargoItem(
                                            container.id,
                                            cargo.id,
                                            "volume",
                                            Number(e.target.value)
                                          )
                                        }
                                        className="text-sm h-7"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addCargoItem(container.id)}
                                className="w-full h-7 text-xs"
                              >
                                <Plus className="h-3 w-3 mr-1" /> Add Cargo Item
                              </Button>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </motion.div>
                  ))}
                </ScrollArea>

                <Button variant="outline" onClick={addContainer} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Container
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hazardous Materials & Temperature Tab */}
          <TabsContent value="hazardous" className="space-y-4 mt-4">
            {/* Hazardous Materials */}
            <Card className={siData.hazardousMaterial.isHazardous ? "border-red-500/50" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ShieldAlert className={`h-4 w-4 ${siData.hazardousMaterial.isHazardous ? "text-red-500" : "text-muted-foreground"}`} />
                  Hazardous Material Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Dangerous Goods (IMO/IMDG)</Label>
                    <p className="text-xs text-muted-foreground">
                      Check if cargo contains hazardous materials requiring IMO declaration
                    </p>
                  </div>
                  <Switch
                    checked={siData.hazardousMaterial.isHazardous}
                    onCheckedChange={(checked) => updateHazardousMaterial("isHazardous", checked)}
                  />
                </div>

                <AnimatePresence>
                  {siData.hazardousMaterial.isHazardous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-red-600 dark:text-red-400">
                          A separate IMO Dangerous Goods Declaration must accompany this SI. Ensure all information is accurate per IMDG Code.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">UN Number</Label>
                          <Input
                            value={siData.hazardousMaterial.unNumber}
                            onChange={(e) => updateHazardousMaterial("unNumber", e.target.value.toUpperCase())}
                            placeholder="e.g., UN1234"
                            className="font-mono text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">IMO Class</Label>
                          <Select
                            value={siData.hazardousMaterial.imoClass}
                            onValueChange={(v) => updateHazardousMaterial("imoClass", v)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              {imoClasses.map((cls) => (
                                <SelectItem key={cls.value} value={cls.value} className="text-sm">
                                  {cls.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Proper Shipping Name</Label>
                        <Input
                          value={siData.hazardousMaterial.properShippingName}
                          onChange={(e) => updateHazardousMaterial("properShippingName", e.target.value)}
                          placeholder="Technical name per IMDG Code"
                          className="text-sm"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Packing Group</Label>
                          <Select
                            value={siData.hazardousMaterial.packingGroup}
                            onValueChange={(v) => updateHazardousMaterial("packingGroup", v)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Select group" />
                            </SelectTrigger>
                            <SelectContent>
                              {packingGroups.map((pg) => (
                                <SelectItem key={pg.value} value={pg.value} className="text-sm">
                                  {pg.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Flash Point (°C)</Label>
                          <Input
                            value={siData.hazardousMaterial.flashPoint}
                            onChange={(e) => updateHazardousMaterial("flashPoint", e.target.value)}
                            placeholder="For Class 3 liquids"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">24-Hour Emergency Contact</Label>
                        <Input
                          value={siData.hazardousMaterial.emergencyContact}
                          onChange={(e) => updateHazardousMaterial("emergencyContact", e.target.value)}
                          placeholder="Phone number and contact details"
                          className="text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Additional DG Information</Label>
                        <Textarea
                          value={siData.hazardousMaterial.additionalInfo}
                          onChange={(e) => updateHazardousMaterial("additionalInfo", e.target.value)}
                          rows={3}
                          placeholder="Marine pollutant, limited quantity, EMS number, etc."
                          className="text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            {/* Temperature Requirements */}
            <Card className={siData.temperatureRequirements.isTemperatureControlled ? "border-blue-500/50" : ""}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Snowflake className={`h-4 w-4 ${siData.temperatureRequirements.isTemperatureControlled ? "text-blue-500" : "text-muted-foreground"}`} />
                  Temperature Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm">Temperature Controlled Cargo (Reefer)</Label>
                    <p className="text-xs text-muted-foreground">
                      Check for refrigerated or frozen cargo requiring temperature control
                    </p>
                  </div>
                  <Switch
                    checked={siData.temperatureRequirements.isTemperatureControlled}
                    onCheckedChange={(checked) => updateTemperatureRequirements("isTemperatureControlled", checked)}
                  />
                </div>

                <AnimatePresence>
                  {siData.temperatureRequirements.isTemperatureControlled && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2"
                    >
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-2">
                        <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          Provide precise temperature settings. Ensure reefer container is pre-cooled before loading. Pre-trip inspection (PTI) certificate may be required.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Unit</Label>
                          <Select
                            value={siData.temperatureRequirements.temperatureUnit}
                            onValueChange={(v: "C" | "F") => updateTemperatureRequirements("temperatureUnit", v)}
                          >
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="C" className="text-sm">Celsius (°C)</SelectItem>
                              <SelectItem value="F" className="text-sm">Fahrenheit (°F)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Min Temperature</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={siData.temperatureRequirements.temperatureMin}
                            onChange={(e) => updateTemperatureRequirements("temperatureMin", e.target.value)}
                            placeholder="-18"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Max Temperature</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={siData.temperatureRequirements.temperatureMax}
                            onChange={(e) => updateTemperatureRequirements("temperatureMax", e.target.value)}
                            placeholder="-16"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm">Min Humidity (%)</Label>
                          <Input
                            type="number"
                            value={siData.temperatureRequirements.humidityMin}
                            onChange={(e) => updateTemperatureRequirements("humidityMin", e.target.value)}
                            placeholder="Optional"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm">Max Humidity (%)</Label>
                          <Input
                            type="number"
                            value={siData.temperatureRequirements.humidityMax}
                            onChange={(e) => updateTemperatureRequirements("humidityMax", e.target.value)}
                            placeholder="Optional"
                            className="text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm">Ventilation Requirement (CBM/hr)</Label>
                        <Input
                          value={siData.temperatureRequirements.ventilationRequirement}
                          onChange={(e) => updateTemperatureRequirements("ventilationRequirement", e.target.value)}
                          placeholder="For fresh produce - ventilation rate"
                          className="text-sm"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Special Instructions Tab */}
          <TabsContent value="special" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-[var(--logistics)]" />
                  Terms & Release
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Incoterm</Label>
                    <Select
                      value={siData.incoterm}
                      onValueChange={(v) => updateField("incoterm", v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {incoterms.map((term) => (
                          <SelectItem key={term.value} value={term.value} className="text-sm">
                            {term.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">Incoterm Place</Label>
                    <Input
                      value={siData.incotermPlace}
                      onChange={(e) => updateField("incotermPlace", e.target.value)}
                      placeholder="Named place"
                      className="text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm">Freight Terms</Label>
                    <Select
                      value={siData.freightTerms}
                      onValueChange={(v) => updateField("freightTerms", v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Prepaid" className="text-sm">Prepaid</SelectItem>
                        <SelectItem value="Collect" className="text-sm">Collect</SelectItem>
                        <SelectItem value="Prepaid/Collect" className="text-sm">Prepaid/Collect</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">B/L Release Type</Label>
                    <Select
                      value={siData.releaseType}
                      onValueChange={(v) => updateField("releaseType", v)}
                    >
                      <SelectTrigger className="text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {releaseTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="text-sm">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Special Handling Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">General Special Instructions</Label>
                  <Textarea
                    value={siData.specialHandlingInstructions}
                    onChange={(e) => updateField("specialHandlingInstructions", e.target.value)}
                    rows={4}
                    placeholder="Any special handling requirements, delivery instructions, or carrier notes..."
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Stacking Instructions</Label>
                  <Textarea
                    value={siData.stackingInstructions}
                    onChange={(e) => updateField("stackingInstructions", e.target.value)}
                    rows={2}
                    placeholder="Stowage position, stacking limitations, etc."
                    className="text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Weight Distribution Notes</Label>
                  <Textarea
                    value={siData.weightDistributionNotes}
                    onChange={(e) => updateField("weightDistributionNotes", e.target.value)}
                    rows={2}
                    placeholder="Weight distribution, center of gravity, etc."
                    className="text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between no-print">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Eye className="h-4 w-4 text-[var(--ocean)]" />
            Live Preview
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Document Preview */}
        <Card className="bg-white dark:bg-card overflow-hidden shadow-lg">
          <div className="p-6 text-xs" id="si-preview" ref={previewRef}>
            {/* Header */}
            <div className="flex justify-between items-start mb-6 border-b-2 pb-4" style={{ borderColor: "#0F4C81" }}>
              <div>
                <h1 className="text-xl font-bold" style={{ color: "#0F4C81" }}>SHIPPING INSTRUCTIONS</h1>
                <div className="text-[10px] text-muted-foreground mt-1">{siData.siNumber}</div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">SI Form</Badge>
                <div className="text-sm font-medium">{siData.siDate}</div>
                <div className="text-[10px] text-muted-foreground">
                  Booking: {siData.bookingNumber || "—"}
                </div>
              </div>
            </div>

            {/* Parties Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="p-3 bg-muted/30 rounded">
                <div className="text-[10px] font-semibold text-muted-foreground mb-1">SHIPPER</div>
                <div className="font-medium text-sm">{siData.shipperName || "Shipper Name"}</div>
                <div className="text-[10px] text-muted-foreground whitespace-pre-line">{siData.shipperAddress}</div>
                {siData.shipperCity && (
                  <div className="text-[10px] text-muted-foreground">{siData.shipperCity}, {siData.shipperCountry} {siData.shipperPostalCode}</div>
                )}
                {siData.shipperPhone && (
                  <div className="text-[10px] text-muted-foreground">Tel: {siData.shipperPhone}</div>
                )}
                {siData.shipperEmail && (
                  <div className="text-[10px] text-muted-foreground">Email: {siData.shipperEmail}</div>
                )}
                {siData.shipperVat && (
                  <div className="text-[10px] text-muted-foreground mt-1">VAT: {siData.shipperVat}</div>
                )}
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <div className="text-[10px] font-semibold text-muted-foreground mb-1">FORWARDER</div>
                <div className="font-medium text-sm">{siData.forwarderName || "—"}</div>
                <div className="text-[10px] text-muted-foreground">{siData.forwarderAddress}</div>
                {siData.forwarderPhone && (
                  <div className="text-[10px] text-muted-foreground">Tel: {siData.forwarderPhone}</div>
                )}
                {siData.forwarderEmail && (
                  <div className="text-[10px] text-muted-foreground">Email: {siData.forwarderEmail}</div>
                )}
                {siData.forwarderReference && (
                  <div className="text-[10px] text-muted-foreground mt-1">Ref: {siData.forwarderReference}</div>
                )}
              </div>
              <div className="p-3 bg-muted/30 rounded">
                <div className="text-[10px] font-semibold text-muted-foreground mb-1">CONSIGNEE</div>
                <div className="font-medium text-sm">{siData.consigneeName || "Consignee Name"}</div>
                <div className="text-[10px] text-muted-foreground whitespace-pre-line">{siData.consigneeAddress}</div>
                {siData.consigneeCountry && (
                  <div className="text-[10px] text-muted-foreground">{siData.consigneeCountry}</div>
                )}
                {siData.consigneePhone && (
                  <div className="text-[10px] text-muted-foreground">Tel: {siData.consigneePhone}</div>
                )}
                {siData.consigneeEmail && (
                  <div className="text-[10px] text-muted-foreground">Email: {siData.consigneeEmail}</div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mb-6">
              <div className="p-3 bg-muted/30 rounded">
                <div className="text-[10px] font-semibold text-muted-foreground mb-1">NOTIFY PARTY</div>
                <div className="font-medium text-sm">{siData.notifyName || "—"}</div>
                <div className="text-[10px] text-muted-foreground">{siData.notifyAddress}</div>
                {(siData.notifyPhone || siData.notifyEmail) && (
                  <div className="text-[10px] text-muted-foreground">
                    {siData.notifyPhone && `Tel: ${siData.notifyPhone}`}
                    {siData.notifyPhone && siData.notifyEmail && ' | '}
                    {siData.notifyEmail && `Email: ${siData.notifyEmail}`}
                  </div>
                )}
              </div>
            </div>

            {/* Vessel & Ports */}
            <div className="grid grid-cols-4 gap-2 mb-6 text-[10px]">
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Vessel: </span>
                <span className="font-medium">{siData.vesselName || "—"}</span>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Voyage: </span>
                <span className="font-medium">{siData.voyageNumber || "—"}</span>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">POL: </span>
                <span className="font-medium">{siData.portOfLoading || "—"}</span>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">POD: </span>
                <span className="font-medium">{siData.portOfDischarge || "—"}</span>
              </div>
            </div>

            {/* Container Summary */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              <div className="text-center p-3 rounded" style={{ backgroundColor: "rgba(15, 76, 129, 0.1)" }}>
                <div className="text-lg font-bold" style={{ color: "#0F4C81" }}>{totals.containers}</div>
                <div className="text-[10px] text-muted-foreground">Containers</div>
              </div>
              <div className="text-center p-3 rounded" style={{ backgroundColor: "rgba(46, 139, 87, 0.1)" }}>
                <div className="text-lg font-bold" style={{ color: "#2E8B57" }}>{totals.packages}</div>
                <div className="text-[10px] text-muted-foreground">Packages</div>
              </div>
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded">
                <div className="text-lg font-bold text-amber-600">{totals.grossWeight.toLocaleString()} kg</div>
                <div className="text-[10px] text-muted-foreground">Gross Weight</div>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded">
                <div className="text-lg font-bold text-purple-600">{totals.volume.toFixed(2)} CBM</div>
                <div className="text-[10px] text-muted-foreground">Volume</div>
              </div>
            </div>

            {/* Container Details */}
            <table className="w-full mb-6 text-[10px]">
              <thead>
                <tr className="border-b border-t bg-muted/20">
                  <th className="text-left py-2 px-2 font-semibold">Container #</th>
                  <th className="text-center py-2 px-2 font-semibold">Type</th>
                  <th className="text-center py-2 px-2 font-semibold">Seal</th>
                  <th className="text-right py-2 px-2 font-semibold">Gross (kg)</th>
                  <th className="text-right py-2 px-2 font-semibold">Vol (CBM)</th>
                </tr>
              </thead>
              <tbody>
                {siData.containers.map((container, idx) => (
                  <tr key={container.id} className="border-b">
                    <td className="py-2 px-2 font-mono">{container.containerNumber || `Container ${idx + 1}`}</td>
                    <td className="text-center py-2 px-2">{container.containerType}</td>
                    <td className="text-center py-2 px-2 font-mono">{container.sealNumber || "—"}</td>
                    <td className="text-right py-2 px-2">{container.grossWeight || "—"}</td>
                    <td className="text-right py-2 px-2">{container.volume || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Cargo Details */}
            {siData.containers.some(c => c.cargoItems.some(ci => ci.description || ci.hsCode)) && (
              <div className="mb-6">
                <div className="text-[10px] font-semibold text-muted-foreground mb-2">CARGO DETAILS</div>
                <table className="w-full text-[10px]">
                  <thead>
                    <tr className="border-b bg-muted/10">
                      <th className="text-left py-1 px-2 font-semibold">Description</th>
                      <th className="text-center py-1 px-2 font-semibold">HS Code</th>
                      <th className="text-center py-1 px-2 font-semibold">Pkgs</th>
                      <th className="text-right py-1 px-2 font-semibold">Gross</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siData.containers.flatMap(c => c.cargoItems).map((cargo, idx) => (
                      cargo.description || cargo.hsCode ? (
                        <tr key={cargo.id || idx} className="border-b">
                          <td className="py-1 px-2">{cargo.description || "—"}</td>
                          <td className="text-center py-1 px-2 font-mono">{cargo.hsCode || "—"}</td>
                          <td className="text-center py-1 px-2">{cargo.numberOfPackages || "—"}</td>
                          <td className="text-right py-1 px-2">{cargo.grossWeight || "—"} kg</td>
                        </tr>
                      ) : null
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Terms & Special */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-[10px]">
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Incoterm: </span>
                <span className="font-medium">{siData.incoterm} {siData.incotermPlace}</span>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Freight: </span>
                <span className="font-medium">{siData.freightTerms}</span>
              </div>
              <div className="p-2 bg-muted/20 rounded">
                <span className="text-muted-foreground">Release: </span>
                <span className="font-medium">{releaseTypes.find(r => r.value === siData.releaseType)?.label}</span>
              </div>
            </div>

            {/* DG Warning */}
            {siData.hazardousMaterial.isHazardous && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded mb-4 text-[10px] flex items-center gap-2 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
                <div>
                  <span className="text-red-600 dark:text-red-400 font-semibold">DANGEROUS GOODS</span>
                  <div className="text-red-500 dark:text-red-300">
                    UN{siData.hazardousMaterial.unNumber} - Class {siData.hazardousMaterial.imoClass} - {siData.hazardousMaterial.properShippingName}
                  </div>
                </div>
              </div>
            )}

            {/* Temperature Info */}
            {siData.temperatureRequirements.isTemperatureControlled && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded mb-4 text-[10px] flex items-center gap-2 border border-blue-200 dark:border-blue-800">
                <Thermometer className="h-4 w-4 text-blue-500 shrink-0" />
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">TEMPERATURE CONTROLLED</span>
                  <div className="text-blue-500 dark:text-blue-300">
                    {siData.temperatureRequirements.temperatureMin}°{siData.temperatureRequirements.temperatureUnit} to {siData.temperatureRequirements.temperatureMax}°{siData.temperatureRequirements.temperatureUnit}
                  </div>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {siData.specialHandlingInstructions && (
              <div className="p-3 bg-muted/30 rounded mb-4 text-[10px]">
                <div className="font-semibold mb-1">Special Instructions:</div>
                <div className="text-muted-foreground whitespace-pre-line">{siData.specialHandlingInstructions}</div>
              </div>
            )}

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-4 border-t">
              <div>
                <div className="text-[10px] text-muted-foreground mb-8">Shipper&apos;s Signature & Stamp</div>
                <div className="border-t pt-1 text-center text-[10px]">
                  Authorized Signatory
                </div>
              </div>
              <div>
                <div className="text-[10px] text-muted-foreground mb-8">Date</div>
                <div className="border-t pt-1 text-center text-[10px]">
                  {siData.siDate}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-6 pt-4 border-t text-center text-[10px] text-muted-foreground">
              <p>This document is for reference only.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
