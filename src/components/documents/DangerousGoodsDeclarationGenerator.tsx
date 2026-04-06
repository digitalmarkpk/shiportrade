"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileWarning,
  AlertTriangle,
  Building2,
  Ship,
  Package,
  Phone,
  Mail,
  MapPin,
  Printer,
  RefreshCw,
  Plus,
  Trash2,
  Info,
  CheckCircle,
  AlertCircle,
  Flame,
  Biohazard,
  Radiation,
  Skull
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

interface DGItem {
  id: string;
  properShippingName: string;
  unNumber: string;
  hazardClass: string;
  subsidiaryRisk: string;
  packingGroup: string;
  quantity: number;
  unit: string;
  netExplosiveMass: number;
  packingInstructions: string;
  specialProvisions: string;
  flashpoint: string;
  marinePollutant: boolean;
  limitedQuantity: boolean;
  packagingType: string;
  numberOfPackages: number;
}

interface DGDeclaration {
  // Reference
  declarationNumber: string;
  declarationDate: string;
  bookingNumber: string;
  blNumber: string;

  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperCity: string;
  shipperCountry: string;
  shipperContact: string;
  shipperPhone: string;
  shipperEmail: string;

  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeCity: string;
  consigneeCountry: string;
  consigneeContact: string;
  consigneePhone: string;
  consigneeEmail: string;

  // Carrier
  carrierName: string;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;

  // Emergency
  emergencyContact: string;
  emergencyPhone: string;
  emergencyRef: string;

  // Container
  containerNumber: string;
  containerType: string;
  sealNumber: string;
  grossWeight: number;
  netWeight: number;

  // Additional
  additionalInfo: string;
  certificationText: string;
  signatoryName: string;
  signatoryTitle: string;
  signatoryDate: string;

  // Items
  items: DGItem[];
}

const hazardClasses = [
  { code: "1", name: "Explosives", icon: "💥" },
  { code: "1.1", name: "Mass explosion hazard", icon: "💥" },
  { code: "1.2", name: "Projection hazard", icon: "💥" },
  { code: "1.3", name: "Fire hazard", icon: "💥" },
  { code: "1.4", name: "Minor explosion hazard", icon: "💥" },
  { code: "1.5", name: "Very insensitive", icon: "💥" },
  { code: "1.6", name: "Extremely insensitive", icon: "💥" },
  { code: "2.1", name: "Flammable gas", icon: "🔥" },
  { code: "2.2", name: "Non-flammable, non-toxic gas", icon: "💨" },
  { code: "2.3", name: "Toxic gas", icon: "☠️" },
  { code: "3", name: "Flammable liquids", icon: "🔥" },
  { code: "4.1", name: "Flammable solids", icon: "🔥" },
  { code: "4.2", name: "Spontaneously combustible", icon: "🔥" },
  { code: "4.3", name: "Dangerous when wet", icon: "💧" },
  { code: "5.1", name: "Oxidizing substances", icon: "⭕" },
  { code: "5.2", name: "Organic peroxides", icon: "⭕" },
  { code: "6.1", name: "Toxic substances", icon: "☠️" },
  { code: "6.2", name: "Infectious substances", icon: "🦠" },
  { code: "7", name: "Radioactive material", icon: "☢️" },
  { code: "8", name: "Corrosives", icon: "🧪" },
  { code: "9", name: "Miscellaneous", icon: "⚠️" },
];

const packingGroups = [
  { code: "I", name: "Great danger", description: "High danger" },
  { code: "II", name: "Medium danger", description: "Medium danger" },
  { code: "III", name: "Minor danger", description: "Low danger" },
];

const containerTypes = [
  "20' Standard (20' GP)",
  "40' Standard (40' GP)",
  "40' High Cube (40' HC)",
  "20' Refrigerated (20' RF)",
  "40' Refrigerated (40' RF)",
  "20' Tank Container",
  "30' Tank Container",
  "20' Open Top (20' OT)",
  "40' Open Top (40' OT)",
];

const commonDGItems = [
  { name: "Acetone", un: "UN1090", class: "3", pg: "II" },
  { name: "Benzene", un: "UN1114", class: "3", pg: "II" },
  { name: "Calcium Carbide", un: "UN1402", class: "4.3", pg: "I" },
  { name: "Carbon Dioxide, refrigerated liquid", un: "UN2187", class: "2.2", pg: "" },
  { name: "Chlorine", un: "UN1017", class: "2.3", pg: "" },
  { name: "Diesel Fuel", un: "UN1202", class: "3", pg: "III" },
  { name: "Ethanol (Ethyl Alcohol)", un: "UN1170", class: "3", pg: "II" },
  { name: "Gasoline", un: "UN1203", class: "3", pg: "II" },
  { name: "Hydrochloric Acid", un: "UN1789", class: "8", pg: "II" },
  { name: "Hydrogen Peroxide", un: "UN2015", class: "5.1", pg: "I" },
  { name: "Lithium-ion batteries", un: "UN3480", class: "9", pg: "" },
  { name: "Methanol", un: "UN1230", class: "3", pg: "II" },
  { name: "Nitric Acid", un: "UN2031", class: "8", pg: "I" },
  { name: "Paint", un: "UN1263", class: "3", pg: "II" },
  { name: "Propane", un: "UN1978", class: "2.1", pg: "" },
  { name: "Sodium Hydroxide, solid", un: "UN1823", class: "8", pg: "II" },
  { name: "Sulfuric Acid", un: "UN1830", class: "8", pg: "II" },
  { name: "Toluene", un: "UN1294", class: "3", pg: "II" },
];

const initialItem: DGItem = {
  id: "1",
  properShippingName: "",
  unNumber: "",
  hazardClass: "",
  subsidiaryRisk: "",
  packingGroup: "",
  quantity: 0,
  unit: "kg",
  netExplosiveMass: 0,
  packingInstructions: "",
  specialProvisions: "",
  flashpoint: "",
  marinePollutant: false,
  limitedQuantity: false,
  packagingType: "",
  numberOfPackages: 1,
};

const initialFormData: DGDeclaration = {
  declarationNumber: "DG-2024-001",
  declarationDate: new Date().toISOString().split("T")[0],
  bookingNumber: "",
  blNumber: "",
  shipperName: "",
  shipperAddress: "",
  shipperCity: "",
  shipperCountry: "",
  shipperContact: "",
  shipperPhone: "",
  shipperEmail: "",
  consigneeName: "",
  consigneeAddress: "",
  consigneeCity: "",
  consigneeCountry: "",
  consigneeContact: "",
  consigneePhone: "",
  consigneeEmail: "",
  carrierName: "",
  vesselName: "",
  voyageNumber: "",
  portOfLoading: "",
  portOfDischarge: "",
  emergencyContact: "",
  emergencyPhone: "",
  emergencyRef: "",
  containerNumber: "",
  containerType: "20' Standard (20' GP)",
  sealNumber: "",
  grossWeight: 0,
  netWeight: 0,
  additionalInfo: "",
  certificationText: "I hereby declare that the contents of this consignment are fully and accurately described above by the proper shipping name, and are classified, packaged, marked and labeled/placarded, and are in all respects in proper condition for transport according to applicable international and national governmental regulations.",
  signatoryName: "",
  signatoryTitle: "",
  signatoryDate: new Date().toISOString().split("T")[0],
  items: [initialItem],
};

export default function DangerousGoodsDeclarationGenerator() {
  const [formData, setFormData] = useState<DGDeclaration>(initialFormData);
  const [activeTab, setActiveTab] = useState("form");

  const updateField = (field: keyof DGDeclaration, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateItem = (id: string, field: keyof DGItem, value: any) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addItem = () => {
    const newItem: DGItem = {
      ...initialItem,
      id: Date.now().toString(),
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

  const applyTemplate = (template: typeof commonDGItems[0]) => {
    if (formData.items.length === 1 && !formData.items[0].properShippingName) {
      updateItem(formData.items[0].id, "properShippingName", template.name);
      updateItem(formData.items[0].id, "unNumber", template.un);
      updateItem(formData.items[0].id, "hazardClass", template.class);
      updateItem(formData.items[0].id, "packingGroup", template.pg);
    } else {
      const newItem: DGItem = {
        ...initialItem,
        id: Date.now().toString(),
        properShippingName: template.name,
        unNumber: template.un,
        hazardClass: template.class,
        packingGroup: template.pg,
      };
      setFormData((prev) => ({ ...prev, items: [...prev.items, newItem] }));
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

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <TabsList className="grid grid-cols-2 w-[300px]">
            <TabsTrigger value="form">Edit Form</TabsTrigger>
            <TabsTrigger value="preview">Preview Declaration</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Reset
            </Button>
            <Button onClick={handlePrint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 gap-2">
              <Printer className="h-4 w-4" />
              Print Declaration
            </Button>
          </div>
        </div>

        <TabsContent value="form" className="space-y-6">
          {/* Reference Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <FileWarning className="h-5 w-5" />
                Declaration Reference
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Declaration Number</Label>
                  <Input
                    value={formData.declarationNumber}
                    onChange={(e) => updateField("declarationNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Declaration Date</Label>
                  <Input
                    type="date"
                    value={formData.declarationDate}
                    onChange={(e) => updateField("declarationDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Booking Number</Label>
                  <Input
                    value={formData.bookingNumber}
                    onChange={(e) => updateField("bookingNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>B/L Number</Label>
                  <Input
                    value={formData.blNumber}
                    onChange={(e) => updateField("blNumber", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipper & Consignee */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Shipper / Consignor
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
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                  <Building2 className="h-5 w-5" />
                  Consignee
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
              </CardContent>
            </Card>
          </div>

          {/* Transport Details */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Ship className="h-5 w-5" />
                Transport Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Carrier Name</Label>
                  <Input
                    value={formData.carrierName}
                    onChange={(e) => updateField("carrierName", e.target.value)}
                    placeholder="Shipping line name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Vessel Name</Label>
                  <Input
                    value={formData.vesselName}
                    onChange={(e) => updateField("vesselName", e.target.value)}
                    placeholder="Vessel/Flight name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Voyage Number</Label>
                  <Input
                    value={formData.voyageNumber}
                    onChange={(e) => updateField("voyageNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port of Loading</Label>
                  <Input
                    value={formData.portOfLoading}
                    onChange={(e) => updateField("portOfLoading", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Port of Discharge</Label>
                  <Input
                    value={formData.portOfDischarge}
                    onChange={(e) => updateField("portOfDischarge", e.target.value)}
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
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Container Number</Label>
                  <Input
                    value={formData.containerNumber}
                    onChange={(e) => updateField("containerNumber", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Seal Number</Label>
                  <Input
                    value={formData.sealNumber}
                    onChange={(e) => updateField("sealNumber", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Gross Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.grossWeight}
                      onChange={(e) => updateField("grossWeight", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Net Weight (kg)</Label>
                    <Input
                      type="number"
                      value={formData.netWeight}
                      onChange={(e) => updateField("netWeight", parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card className="border-0 shadow-lg border-l-4 border-l-red-500">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Emergency Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Emergency Contact Name *</Label>
                  <Input
                    value={formData.emergencyContact}
                    onChange={(e) => updateField("emergencyContact", e.target.value)}
                    placeholder="24-hour contact"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Emergency Phone *</Label>
                  <Input
                    value={formData.emergencyPhone}
                    onChange={(e) => updateField("emergencyPhone", e.target.value)}
                    placeholder="+1-XXX-XXX-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Reference Number</Label>
                  <Input
                    value={formData.emergencyRef}
                    onChange={(e) => updateField("emergencyRef", e.target.value)}
                    placeholder="Contract reference"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common DG Templates */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Info className="h-5 w-5" />
                Common Dangerous Goods Templates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {commonDGItems.map((item) => (
                  <motion.button
                    key={item.un}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => applyTemplate(item)}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 text-left transition-colors"
                  >
                    <p className="text-xs font-medium text-[#0F4C81]">{item.un}</p>
                    <p className="text-sm truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Class {item.class}</p>
                  </motion.button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dangerous Goods Items */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <AlertTriangle className="h-5 w-5" />
                Dangerous Goods Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {formData.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-semibold">Item {index + 1}</h4>
                      {formData.items.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2 md:col-span-2">
                        <Label>Proper Shipping Name *</Label>
                        <Input
                          value={item.properShippingName}
                          onChange={(e) => updateItem(item.id, "properShippingName", e.target.value)}
                          placeholder="Technical name as per IMDG Code"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>UN Number *</Label>
                        <Input
                          value={item.unNumber}
                          onChange={(e) => updateItem(item.id, "unNumber", e.target.value)}
                          placeholder="UNXXXX"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hazard Class *</Label>
                        <Select value={item.hazardClass} onValueChange={(v) => updateItem(item.id, "hazardClass", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select class" />
                          </SelectTrigger>
                          <SelectContent>
                            {hazardClasses.map((cls) => (
                              <SelectItem key={cls.code} value={cls.code}>
                                {cls.code} - {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Subsidiary Risk</Label>
                        <Select value={item.subsidiaryRisk} onValueChange={(v) => updateItem(item.id, "subsidiaryRisk", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="If applicable" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">None</SelectItem>
                            {hazardClasses.map((cls) => (
                              <SelectItem key={cls.code} value={cls.code}>
                                {cls.code} - {cls.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Packing Group</Label>
                        <Select value={item.packingGroup} onValueChange={(v) => updateItem(item.id, "packingGroup", v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">N/A</SelectItem>
                            {packingGroups.map((pg) => (
                              <SelectItem key={pg.code} value={pg.code}>
                                {pg.code} - {pg.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, "quantity", parseFloat(e.target.value) || 0)}
                            className="flex-1"
                          />
                          <Select value={item.unit} onValueChange={(v) => updateItem(item.id, "unit", v)}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="L">L</SelectItem>
                              <SelectItem value="tons">tons</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>No. of Packages</Label>
                        <Input
                          type="number"
                          value={item.numberOfPackages}
                          onChange={(e) => updateItem(item.id, "numberOfPackages", parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Packaging Type</Label>
                        <Input
                          value={item.packagingType}
                          onChange={(e) => updateItem(item.id, "packagingType", e.target.value)}
                          placeholder="e.g., Drums, IBC"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Flash Point (°C)</Label>
                        <Input
                          value={item.flashpoint}
                          onChange={(e) => updateItem(item.id, "flashpoint", e.target.value)}
                          placeholder="For Class 3"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Net Explosive Mass (kg)</Label>
                        <Input
                          type="number"
                          value={item.netExplosiveMass}
                          onChange={(e) => updateItem(item.id, "netExplosiveMass", parseFloat(e.target.value) || 0)}
                          placeholder="For Class 1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Packing Instructions</Label>
                        <Input
                          value={item.packingInstructions}
                          onChange={(e) => updateItem(item.id, "packingInstructions", e.target.value)}
                          placeholder="e.g., P001"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Special Provisions</Label>
                        <Input
                          value={item.specialProvisions}
                          onChange={(e) => updateItem(item.id, "specialProvisions", e.target.value)}
                          placeholder="e.g., 123, 456"
                        />
                      </div>
                      <div className="flex items-center gap-6 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.marinePollutant}
                            onChange={(e) => updateItem(item.id, "marinePollutant", e.target.checked)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm">Marine Pollutant</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={item.limitedQuantity}
                            onChange={(e) => updateItem(item.id, "limitedQuantity", e.target.checked)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm">Limited Quantity</span>
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ))}

                <Button onClick={addItem} variant="outline" className="w-full gap-2">
                  <Plus className="h-4 w-4" />
                  Add Another Dangerous Good
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100 dark:border-slate-700">
              <CardTitle className="flex items-center gap-2 text-[#0F4C81]">
                <Info className="h-5 w-5" />
                Additional Information & Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label>Additional Handling Information</Label>
                <Textarea
                  value={formData.additionalInfo}
                  onChange={(e) => updateField("additionalInfo", e.target.value)}
                  placeholder="Special handling requirements, stowage position, etc."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Declaration & Certification</Label>
                <Textarea
                  value={formData.certificationText}
                  onChange={(e) => updateField("certificationText", e.target.value)}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Signatory Name *</Label>
                  <Input
                    value={formData.signatoryName}
                    onChange={(e) => updateField("signatoryName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Title/Position</Label>
                  <Input
                    value={formData.signatoryTitle}
                    onChange={(e) => updateField("signatoryTitle", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Signatory Date</Label>
                  <Input
                    type="date"
                    value={formData.signatoryDate}
                    onChange={(e) => updateField("signatoryDate", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview">
          <Card className="border-0 shadow-lg print:shadow-none" id="dg-declaration">
            <CardContent className="p-8">
              {/* Header */}
              <div className="border-2 border-red-600 mb-6">
                <div className="bg-red-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-8 w-8" />
                    <div>
                      <h1 className="text-xl font-bold">DANGEROUS GOODS DECLARATION</h1>
                      <p className="text-sm opacity-90">IMDG Code Declaration Form</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formData.declarationNumber}</p>
                    <p className="text-sm">{formData.declarationDate}</p>
                  </div>
                </div>
              </div>

              {/* Shipper & Consignee */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="border border-slate-300 p-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-2">Shipper / Consignor</h3>
                  <p className="font-semibold">{formData.shipperName || "[Shipper Name]"}</p>
                  <p className="text-sm whitespace-pre-line">{formData.shipperAddress}</p>
                  <p className="text-sm">{formData.shipperCity} {formData.shipperCountry}</p>
                  {formData.shipperContact && <p className="text-sm">Contact: {formData.shipperContact}</p>}
                  {formData.shipperPhone && <p className="text-sm">Tel: {formData.shipperPhone}</p>}
                  {formData.shipperEmail && <p className="text-sm">Email: {formData.shipperEmail}</p>}
                </div>

                <div className="border border-slate-300 p-4">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-2">Consignee</h3>
                  <p className="font-semibold">{formData.consigneeName || "[Consignee Name]"}</p>
                  <p className="text-sm whitespace-pre-line">{formData.consigneeAddress}</p>
                  <p className="text-sm">{formData.consigneeCity} {formData.consigneeCountry}</p>
                  {formData.consigneeContact && <p className="text-sm">Contact: {formData.consigneeContact}</p>}
                  {formData.consigneePhone && <p className="text-sm">Tel: {formData.consigneePhone}</p>}
                  {formData.consigneeEmail && <p className="text-sm">Email: {formData.consigneeEmail}</p>}
                </div>
              </div>

              {/* Transport Details */}
              <div className="border border-slate-300 p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-3">Transport Details</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Carrier</p>
                    <p className="font-medium">{formData.carrierName || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Vessel/Flight</p>
                    <p className="font-medium">{formData.vesselName || "-"} {formData.voyageNumber && `/ ${formData.voyageNumber}`}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Port of Loading</p>
                    <p className="font-medium">{formData.portOfLoading || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Port of Discharge</p>
                    <p className="font-medium">{formData.portOfDischarge || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Container</p>
                    <p className="font-medium">{formData.containerNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Container Type</p>
                    <p className="font-medium">{formData.containerType}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Seal Number</p>
                    <p className="font-medium">{formData.sealNumber || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Gross Weight</p>
                    <p className="font-medium">{formData.grossWeight} kg</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="border-2 border-red-300 bg-red-50 p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wide text-red-700 mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  24-Hour Emergency Contact
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">Contact</p>
                    <p className="font-semibold">{formData.emergencyContact || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Phone</p>
                    <p className="font-semibold">{formData.emergencyPhone || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Reference</p>
                    <p className="font-semibold">{formData.emergencyRef || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Dangerous Goods Table */}
              <div className="mb-6 overflow-x-auto">
                <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-3">Dangerous Goods Details</h3>
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100">
                      <th className="border border-slate-300 p-2 text-left">Proper Shipping Name</th>
                      <th className="border border-slate-300 p-2 text-left">UN No.</th>
                      <th className="border border-slate-300 p-2 text-center">Class</th>
                      <th className="border border-slate-300 p-2 text-center">Sub Risk</th>
                      <th className="border border-slate-300 p-2 text-center">PG</th>
                      <th className="border border-slate-300 p-2 text-right">Qty</th>
                      <th className="border border-slate-300 p-2 text-center">Pkgs</th>
                      <th className="border border-slate-300 p-2 text-left">Packing</th>
                      <th className="border border-slate-300 p-2 text-center">MP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.filter(item => item.properShippingName).map((item) => (
                      <tr key={item.id}>
                        <td className="border border-slate-300 p-2">{item.properShippingName}</td>
                        <td className="border border-slate-300 p-2">{item.unNumber}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.hazardClass}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.subsidiaryRisk || "-"}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.packingGroup || "-"}</td>
                        <td className="border border-slate-300 p-2 text-right">{item.quantity} {item.unit}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.numberOfPackages}</td>
                        <td className="border border-slate-300 p-2">{item.packagingType}</td>
                        <td className="border border-slate-300 p-2 text-center">{item.marinePollutant ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Additional Info */}
              {formData.additionalInfo && (
                <div className="border border-slate-300 p-4 mb-6">
                  <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-2">Additional Handling Information</h3>
                  <p className="text-sm whitespace-pre-line">{formData.additionalInfo}</p>
                </div>
              )}

              {/* Certification */}
              <div className="border-2 border-slate-400 p-4 mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wide text-slate-600 mb-3">Declaration</h3>
                <p className="text-sm italic">{formData.certificationText}</p>
              </div>

              {/* Signature */}
              <div className="grid grid-cols-2 gap-12 mt-12">
                <div>
                  <p className="text-sm text-slate-500 mb-12">Signature of Shipper/Authorized Person</p>
                  <div className="border-t border-slate-400 pt-2">
                    <p className="text-sm">{formData.signatoryName || "________________________"}</p>
                    <p className="text-xs text-slate-500">{formData.signatoryTitle}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-12">Date and Place</p>
                  <div className="border-t border-slate-400 pt-2">
                    <p className="text-sm">{formData.signatoryDate}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 text-center">
                <p>This declaration is made in accordance with the IMDG Code and applicable regulations.</p>
                <p className="mt-1">Failure to comply with these requirements may result in prosecution.</p>
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
          #dg-declaration, #dg-declaration * {
            visibility: visible;
          }
          #dg-declaration {
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
