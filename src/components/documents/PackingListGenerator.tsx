"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Building2,
  FileText,
  Download,
  Printer,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Weight,
  Ruler,
  Box,
  Container,
  Ship,
  Tags,
  Loader2,
  CheckCircle2,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface PackingItem {
  id: string;
  cartonNumber: string;
  description: string;
  quantity: number;
  unit: string;
  netWeight: number;
  grossWeight: number;
  length: number;
  width: number;
  height: number;
  cbm: number;
  marksAndNumbers: string;
}

interface ContainerDetails {
  containerNumber: string;
  containerType: string;
  sealNumber: string;
}

interface PackingListData {
  // Document Info
  plNumber: string;
  plDate: string;
  invoiceNumber: string;
  invoiceDate: string;
  // Shipper
  shipperName: string;
  shipperAddress: string;
  shipperContact: string;
  // Consignee
  consigneeName: string;
  consigneeAddress: string;
  consigneeContact: string;
  // Notify Party
  notifyPartyName: string;
  notifyPartyAddress: string;
  // Shipment Details
  countryOfOrigin: string;
  destinationCountry: string;
  portOfLoading: string;
  portOfDischarge: string;
  // Items
  packingItems: PackingItem[];
  // Totals
  totalPackages: number;
  totalNetWeight: number;
  totalGrossWeight: number;
  totalCbm: number;
  // Container Info
  containerDetails: ContainerDetails[];
  // Global Marks
  globalMarks: string;
  // Remarks
  remarks: string;
}

const defaultPackingItem = (): PackingItem => ({
  id: crypto.randomUUID(),
  cartonNumber: "",
  description: "",
  quantity: 1,
  unit: "PCS",
  netWeight: 0,
  grossWeight: 0,
  length: 0,
  width: 0,
  height: 0,
  cbm: 0,
  marksAndNumbers: "",
});

const defaultContainerDetails = (): ContainerDetails => ({
  containerNumber: "",
  containerType: "20GP",
  sealNumber: "",
});

const units = ["PCS", "SET", "KG", "MT", "LBS", "M", "FT", "M2", "M3", "CTN", "ROL", "BOX", "PAIR", "UNIT", "PKGS"];

const containerTypes = [
  { code: "20GP", description: "20' General Purpose" },
  { code: "40GP", description: "40' General Purpose" },
  { code: "40HC", description: "40' High Cube" },
  { code: "20RF", description: "20' Refrigerated" },
  { code: "40RF", description: "40' Refrigerated" },
  { code: "20OT", description: "20' Open Top" },
  { code: "40OT", description: "40' Open Top" },
  { code: "20FR", description: "20' Flat Rack" },
  { code: "40FR", description: "40' Flat Rack" },
  { code: "20TK", description: "20' Tank" },
  { code: "LCL", description: "LCL Shipment" },
];

export function PackingListGenerator() {
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");

  const [plData, setPlData] = useState<PackingListData>({
    plNumber: `PL-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    plDate: new Date().toISOString().split('T')[0],
    invoiceNumber: "",
    invoiceDate: "",
    shipperName: "",
    shipperAddress: "",
    shipperContact: "",
    consigneeName: "",
    consigneeAddress: "",
    consigneeContact: "",
    notifyPartyName: "",
    notifyPartyAddress: "",
    countryOfOrigin: "",
    destinationCountry: "",
    portOfLoading: "",
    portOfDischarge: "",
    packingItems: [defaultPackingItem()],
    totalPackages: 0,
    totalNetWeight: 0,
    totalGrossWeight: 0,
    totalCbm: 0,
    containerDetails: [defaultContainerDetails()],
    globalMarks: "",
    remarks: "",
  });

  const updateField = <K extends keyof PackingListData>(field: K, value: PackingListData[K]) => {
    setPlData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePackingItem = (id: string, field: keyof PackingItem, value: string | number) => {
    setPlData((prev) => {
      const updatedItems = prev.packingItems.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          // Calculate CBM from dimensions
          if (field === "length" || field === "width" || field === "height") {
            const l = field === "length" ? Number(value) : item.length;
            const w = field === "width" ? Number(value) : item.width;
            const h = field === "height" ? Number(value) : item.height;
            updated.cbm = (l * w * h) / 1000000; // Convert cm³ to m³
          }
          return updated;
        }
        return item;
      });

      // Calculate totals
      const totals = updatedItems.reduce(
        (acc, item) => ({
          packages: acc.packages + 1,
          netWeight: acc.netWeight + item.netWeight,
          grossWeight: acc.grossWeight + item.grossWeight,
          cbm: acc.cbm + item.cbm,
        }),
        { packages: 0, netWeight: 0, grossWeight: 0, cbm: 0 }
      );

      return {
        ...prev,
        packingItems: updatedItems,
        totalPackages: totals.packages,
        totalNetWeight: totals.netWeight,
        totalGrossWeight: totals.grossWeight,
        totalCbm: totals.cbm,
      };
    });
  };

  const addPackingItem = () => {
    setPlData((prev) => ({
      ...prev,
      packingItems: [...prev.packingItems, defaultPackingItem()],
    }));
  };

  const removePackingItem = (id: string) => {
    if (plData.packingItems.length <= 1) return;
    setPlData((prev) => {
      const updatedItems = prev.packingItems.filter((item) => item.id !== id);
      const totals = updatedItems.reduce(
        (acc, item) => ({
          packages: acc.packages + 1,
          netWeight: acc.netWeight + item.netWeight,
          grossWeight: acc.grossWeight + item.grossWeight,
          cbm: acc.cbm + item.cbm,
        }),
        { packages: 0, netWeight: 0, grossWeight: 0, cbm: 0 }
      );
      return {
        ...prev,
        packingItems: updatedItems,
        totalPackages: totals.packages,
        totalNetWeight: totals.netWeight,
        totalGrossWeight: totals.grossWeight,
        totalCbm: totals.cbm,
      };
    });
  };

  const updateContainerDetails = (index: number, field: keyof ContainerDetails, value: string) => {
    setPlData((prev) => {
      const updatedContainers = prev.containerDetails.map((container, i) =>
        i === index ? { ...container, [field]: value.toUpperCase() } : container
      );
      return { ...prev, containerDetails: updatedContainers };
    });
  };

  const addContainer = () => {
    setPlData((prev) => ({
      ...prev,
      containerDetails: [...prev.containerDetails, defaultContainerDetails()],
    }));
  };

  const removeContainer = (index: number) => {
    if (plData.containerDetails.length <= 1) return;
    setPlData((prev) => ({
      ...prev,
      containerDetails: prev.containerDetails.filter((_, i) => i !== index),
    }));
  };

  const totalQuantity = plData.packingItems.reduce((sum, item) => sum + item.quantity, 0);

  const handlePrint = useCallback(() => {
    // Create a dedicated print container for clean output
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      background: white;
      z-index: 99999;
      padding: 10mm;
    `;
    
    // Clone the document content
    if (printRef.current) {
      const clone = printRef.current.cloneNode(true) as HTMLElement;
      
      // Remove buttons and non-print elements from clone
      clone.querySelectorAll('button').forEach(btn => btn.remove());
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      
      // Style the clone for print
      clone.style.cssText = `
        background: white;
        width: 100%;
        box-shadow: none;
        border: none;
        border-radius: 0;
      `;
      
      // Remove any max-height restrictions
      clone.querySelectorAll('[style*="max-height"]').forEach(el => {
        (el as HTMLElement).style.maxHeight = 'none';
      });
      clone.querySelectorAll('[class*="ScrollArea"]').forEach(el => {
        (el as HTMLElement).style.maxHeight = 'none';
        (el as HTMLElement).style.overflow = 'visible';
      });
      
      printContainer.appendChild(clone);
    }
    
    // Hide all page content
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
      (allElements[i] as HTMLElement).style.display = 'none';
    }
    
    // Add print container to body
    document.body.appendChild(printContainer);
    
    // Set document title
    const originalTitle = document.title;
    document.title = `Packing_List_${plData.plNumber || 'Document'}`;
    
    // Print
    window.print();
    
    // Restore after print
    setTimeout(() => {
      printContainer.remove();
      for (let i = 0; i < allElements.length; i++) {
        (allElements[i] as HTMLElement).style.display = '';
      }
      document.title = originalTitle;
    }, 500);
  }, [plData.plNumber]);

  const handleExportPDF = useCallback(async () => {
    if (!printRef.current) return;

    setIsExporting(true);
    try {
      const canvas = await html2canvas(printRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PackingList_${plData.plNumber}.pdf`);

      toast({
        title: "PDF Exported Successfully",
        description: `Packing List ${plData.plNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error exporting the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  }, [plData.plNumber, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="grid lg:grid-cols-2 gap-8 p-4 lg:p-8">
        {/* Input Panel */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                Packing List Generator
              </h1>
              <p className="text-sm text-muted-foreground mt-1">International Trade Document</p>
            </div>
            <Badge variant="outline" className="bg-[#0F4C81]/10 text-[#0F4C81] border-[#0F4C81]/20">
              <FileText className="h-3 w-3 mr-1" />
              {plData.plNumber}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 h-auto">
              <TabsTrigger value="basic" className="text-xs sm:text-sm py-2">
                <FileText className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Basic</span> Info
              </TabsTrigger>
              <TabsTrigger value="parties" className="text-xs sm:text-sm py-2">
                <Building2 className="h-4 w-4 mr-1 sm:mr-2" />
                Parties
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs sm:text-sm py-2">
                <Box className="h-4 w-4 mr-1 sm:mr-2" />
                Items
              </TabsTrigger>
              <TabsTrigger value="container" className="text-xs sm:text-sm py-2">
                <Container className="h-4 w-4 mr-1 sm:mr-2" />
                Container
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4 mt-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-4 w-4 text-[#0F4C81]" />
                    Document Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Packing List Number</Label>
                      <Input
                        value={plData.plNumber}
                        onChange={(e) => updateField("plNumber", e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={plData.plDate}
                        onChange={(e) => updateField("plDate", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Number</Label>
                      <Input
                        value={plData.invoiceNumber}
                        onChange={(e) => updateField("invoiceNumber", e.target.value)}
                        placeholder="Related invoice #"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Input
                        type="date"
                        value={plData.invoiceDate}
                        onChange={(e) => updateField("invoiceDate", e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ship className="h-4 w-4 text-[#2E8B57]" />
                    Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country of Origin</Label>
                      <Input
                        value={plData.countryOfOrigin}
                        onChange={(e) => updateField("countryOfOrigin", e.target.value)}
                        placeholder="e.g., China"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Country</Label>
                      <Input
                        value={plData.destinationCountry}
                        onChange={(e) => updateField("destinationCountry", e.target.value)}
                        placeholder="e.g., United States"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Port of Loading</Label>
                      <Input
                        value={plData.portOfLoading}
                        onChange={(e) => updateField("portOfLoading", e.target.value)}
                        placeholder="e.g., Shanghai"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port of Discharge</Label>
                      <Input
                        value={plData.portOfDischarge}
                        onChange={(e) => updateField("portOfDischarge", e.target.value)}
                        placeholder="e.g., Los Angeles"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parties" className="space-y-4 mt-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#0F4C81]" />
                    Shipper (Exporter)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={plData.shipperName}
                      onChange={(e) => updateField("shipperName", e.target.value)}
                      placeholder="Shipper company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={plData.shipperAddress}
                      onChange={(e) => updateField("shipperAddress", e.target.value)}
                      rows={2}
                      placeholder="Full address including country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Info</Label>
                    <Input
                      value={plData.shipperContact}
                      onChange={(e) => updateField("shipperContact", e.target.value)}
                      placeholder="Phone / Email"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-[#2E8B57]" />
                    Consignee (Importer)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={plData.consigneeName}
                      onChange={(e) => updateField("consigneeName", e.target.value)}
                      placeholder="Consignee company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={plData.consigneeAddress}
                      onChange={(e) => updateField("consigneeAddress", e.target.value)}
                      rows={2}
                      placeholder="Full address including country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Info</Label>
                    <Input
                      value={plData.consigneeContact}
                      onChange={(e) => updateField("consigneeContact", e.target.value)}
                      placeholder="Phone / Email"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Notify Party (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name</Label>
                    <Input
                      value={plData.notifyPartyName}
                      onChange={(e) => updateField("notifyPartyName", e.target.value)}
                      placeholder="Notify party name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Textarea
                      value={plData.notifyPartyAddress}
                      onChange={(e) => updateField("notifyPartyAddress", e.target.value)}
                      rows={2}
                      placeholder="Full address"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="items" className="space-y-4 mt-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Tags className="h-4 w-4 text-[#0F4C81]" />
                    Global Marks & Numbers
                  </CardTitle>
                  <CardDescription>
                    Shipping marks that apply to all packages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={plData.globalMarks}
                    onChange={(e) => updateField("globalMarks", e.target.value)}
                    rows={3}
                    placeholder="Enter shipping marks, handling instructions, etc."
                  />
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Box className="h-4 w-4 text-[#2E8B57]" />
                    Packing Details
                  </CardTitle>
                  <CardDescription>
                    Add each carton/package with dimensions and weights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[500px] pr-4">
                    <div className="space-y-4">
                      <AnimatePresence>
                        {plData.packingItems.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 bg-slate-50/50 dark:bg-slate-800/50"
                          >
                            <div className="flex justify-between items-center">
                              <Badge variant="secondary" className="bg-[#0F4C81]/10 text-[#0F4C81]">
                                Package {index + 1}
                              </Badge>
                              {plData.packingItems.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePackingItem(item.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">Carton #</Label>
                                <Input
                                  value={item.cartonNumber}
                                  onChange={(e) => updatePackingItem(item.id, "cartonNumber", e.target.value)}
                                  placeholder={`CTN-${index + 1}`}
                                  className="h-8"
                                />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <Label className="text-xs">Description</Label>
                                <Input
                                  value={item.description}
                                  onChange={(e) => updatePackingItem(item.id, "description", e.target.value)}
                                  placeholder="Product description"
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Qty</Label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updatePackingItem(item.id, "quantity", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Unit</Label>
                                <Select value={item.unit} onValueChange={(v) => updatePackingItem(item.id, "unit", v)}>
                                  <SelectTrigger className="h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {units.map((u) => (
                                      <SelectItem key={u} value={u}>{u}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Net Wt (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={item.netWeight || ""}
                                  onChange={(e) => updatePackingItem(item.id, "netWeight", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Gross Wt (kg)</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={item.grossWeight || ""}
                                  onChange={(e) => updatePackingItem(item.id, "grossWeight", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-5 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">L (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.length || ""}
                                  onChange={(e) => updatePackingItem(item.id, "length", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">W (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.width || ""}
                                  onChange={(e) => updatePackingItem(item.id, "width", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">H (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.height || ""}
                                  onChange={(e) => updatePackingItem(item.id, "height", Number(e.target.value))}
                                  className="h-8"
                                />
                              </div>
                              <div className="col-span-2 space-y-1">
                                <Label className="text-xs">CBM</Label>
                                <Input
                                  value={item.cbm.toFixed(4)}
                                  readOnly
                                  className="h-8 bg-muted"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Marks & Numbers</Label>
                              <Input
                                value={item.marksAndNumbers}
                                onChange={(e) => updatePackingItem(item.id, "marksAndNumbers", e.target.value)}
                                placeholder="Specific marks for this package"
                                className="h-8"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </ScrollArea>

                  <Button variant="outline" onClick={addPackingItem} className="w-full mt-4 border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Package
                  </Button>

                  {/* Remarks */}
                  <div className="space-y-2 pt-4 mt-4 border-t">
                    <Label>Remarks</Label>
                    <Textarea
                      value={plData.remarks}
                      onChange={(e) => updateField("remarks", e.target.value)}
                      rows={2}
                      placeholder="Additional notes or special handling instructions"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="container" className="space-y-4 mt-4">
              <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Container className="h-4 w-4 text-[#0F4C81]" />
                    Container Details
                  </CardTitle>
                  <CardDescription>
                    Add container information for FCL shipments
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plData.containerDetails.map((container, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 bg-slate-50/50 dark:bg-slate-800/50"
                    >
                      <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-[#2E8B57]/10 text-[#2E8B57]">
                          Container {index + 1}
                        </Badge>
                        {plData.containerDetails.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeContainer(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs">Container Number</Label>
                          <Input
                            value={container.containerNumber}
                            onChange={(e) => updateContainerDetails(index, "containerNumber", e.target.value)}
                            placeholder="MSCU1234567"
                            className="font-mono h-9"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Type</Label>
                          <Select
                            value={container.containerType}
                            onValueChange={(v) => updateContainerDetails(index, "containerType", v)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {containerTypes.map((ct) => (
                                <SelectItem key={ct.code} value={ct.code}>
                                  {ct.code} - {ct.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Seal Number</Label>
                          <Input
                            value={container.sealNumber}
                            onChange={(e) => updateContainerDetails(index, "sealNumber", e.target.value)}
                            placeholder="SEAL123456"
                            className="font-mono h-9"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  <Button variant="outline" onClick={addContainer} className="w-full border-dashed">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Container
                  </Button>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0F4C81]/5 to-[#2E8B57]/5">
                <CardHeader>
                  <CardTitle className="text-lg">Shipment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-[#0F4C81]">{plData.totalPackages}</div>
                      <div className="text-sm text-muted-foreground">Total Packages</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-[#2E8B57]">{plData.totalNetWeight.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Net Weight (kg)</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold">{plData.totalGrossWeight.toFixed(1)}</div>
                      <div className="text-sm text-muted-foreground">Gross Weight (kg)</div>
                    </div>
                    <div className="text-center p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm">
                      <div className="text-3xl font-bold text-amber-600">{plData.totalCbm.toFixed(3)}</div>
                      <div className="text-sm text-muted-foreground">Total CBM</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-4 sticky top-4 h-fit">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#0F4C81]" />
              Live Preview
            </h2>
            <div className="flex gap-2 no-print">
              <Button variant="outline" size="sm" onClick={handlePrint} className="border-[#0F4C81] text-[#0F4C81]">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button
                size="sm"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Document Preview */}
          <Card className="bg-white dark:bg-slate-900 overflow-hidden shadow-xl border-0 document-content-only">
            <div ref={printRef} className="p-6 bg-white" id="packing-list-preview">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 border-b-2 border-[#2E8B57] pb-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#2E8B57]">PACKING LIST</h1>
                  <div className="text-sm text-muted-foreground mt-1">{plData.plNumber}</div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-muted-foreground mt-2">
                    <span className="text-muted-foreground">Date: </span>
                    <span className="font-medium">{plData.plDate}</span>
                  </div>
                  {plData.invoiceNumber && (
                    <div className="text-muted-foreground">
                      <span className="text-muted-foreground">Invoice: </span>
                      <span className="font-medium">{plData.invoiceNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 bg-[#0F4C81]/5 rounded-lg border-l-4 border-[#0F4C81]">
                  <div className="text-xs text-[#0F4C81] mb-1 font-semibold uppercase">Shipper</div>
                  <div className="font-medium">{plData.shipperName || "Shipper Name"}</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{plData.shipperAddress}</div>
                  {plData.shipperContact && (
                    <div className="text-xs text-muted-foreground mt-1">{plData.shipperContact}</div>
                  )}
                </div>
                <div className="p-3 bg-[#2E8B57]/5 rounded-lg border-l-4 border-[#2E8B57]">
                  <div className="text-xs text-[#2E8B57] mb-1 font-semibold uppercase">Consignee</div>
                  <div className="font-medium">{plData.consigneeName || "Consignee Name"}</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{plData.consigneeAddress}</div>
                  {plData.consigneeContact && (
                    <div className="text-xs text-muted-foreground mt-1">{plData.consigneeContact}</div>
                  )}
                </div>
              </div>

              {/* Notify Party if exists */}
              {plData.notifyPartyName && (
                <div className="p-3 bg-muted/30 rounded-lg mb-6">
                  <div className="text-xs text-muted-foreground mb-1 font-semibold uppercase">Notify Party</div>
                  <div className="font-medium">{plData.notifyPartyName}</div>
                  <div className="text-sm text-muted-foreground whitespace-pre-line">{plData.notifyPartyAddress}</div>
                </div>
              )}

              {/* Shipment Info */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 text-sm">
                <div className="p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground text-xs block">Origin</span>
                  <span className="font-medium">{plData.countryOfOrigin || "—"}</span>
                </div>
                <div className="p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground text-xs block">Destination</span>
                  <span className="font-medium">{plData.destinationCountry || "—"}</span>
                </div>
                <div className="p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground text-xs block">POL</span>
                  <span className="font-medium">{plData.portOfLoading || "—"}</span>
                </div>
                <div className="p-2 bg-muted/20 rounded">
                  <span className="text-muted-foreground text-xs block">POD</span>
                  <span className="font-medium">{plData.portOfDischarge || "—"}</span>
                </div>
              </div>

              {/* Container Details */}
              {plData.containerDetails[0].containerNumber && (
                <div className="mb-6">
                  <div className="text-xs font-semibold text-muted-foreground mb-2 uppercase">Container Information</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    {plData.containerDetails.map((container, idx) => (
                      <div key={idx} className="p-2 bg-[#0F4C81]/5 rounded border border-[#0F4C81]/10">
                        <span className="font-mono font-medium">{container.containerNumber}</span>
                        <span className="text-muted-foreground mx-2">|</span>
                        <span>{container.containerType}</span>
                        {container.sealNumber && (
                          <>
                            <span className="text-muted-foreground mx-2">|</span>
                            <span className="text-muted-foreground">Seal: </span>
                            <span className="font-mono">{container.sealNumber}</span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Marks & Numbers */}
              {plData.globalMarks && (
                <div className="mb-6 p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs font-semibold text-muted-foreground mb-1 uppercase">Marks & Numbers</div>
                  <div className="text-sm whitespace-pre-line">{plData.globalMarks}</div>
                </div>
              )}

              {/* Packing Table */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b-2 border-[#0F4C81] bg-[#0F4C81]/5">
                      <th className="text-left py-2 px-2 font-semibold">Carton #</th>
                      <th className="text-left py-2 px-2 font-semibold">Description</th>
                      <th className="text-center py-2 px-2 font-semibold w-12">Qty</th>
                      <th className="text-center py-2 px-2 font-semibold w-12">Unit</th>
                      <th className="text-right py-2 px-2 font-semibold w-16">Net (kg)</th>
                      <th className="text-right py-2 px-2 font-semibold w-16">Gross (kg)</th>
                      <th className="text-center py-2 px-2 font-semibold w-20">Dims (cm)</th>
                      <th className="text-right py-2 px-2 font-semibold w-16">CBM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plData.packingItems.map((item, idx) => (
                      <tr key={item.id} className="border-b border-slate-200">
                        <td className="py-2 px-2 font-mono">{item.cartonNumber || `CTN-${idx + 1}`}</td>
                        <td className="py-2 px-2">
                          {item.description || `Product ${idx + 1}`}
                          {item.marksAndNumbers && (
                            <div className="text-[10px] text-muted-foreground">Marks: {item.marksAndNumbers}</div>
                          )}
                        </td>
                        <td className="text-center py-2 px-2">{item.quantity}</td>
                        <td className="text-center py-2 px-2">{item.unit}</td>
                        <td className="text-right py-2 px-2">{item.netWeight || "—"}</td>
                        <td className="text-right py-2 px-2">{item.grossWeight || "—"}</td>
                        <td className="text-center py-2 px-2 text-[10px]">
                          {item.length && item.width && item.height
                            ? `${item.length}×${item.width}×${item.height}`
                            : "—"}
                        </td>
                        <td className="text-right py-2 px-2">{item.cbm.toFixed(4)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-[#2E8B57] font-medium bg-[#2E8B57]/5">
                      <td className="py-2 px-2 text-[#2E8B57]">TOTAL</td>
                      <td className="py-2 px-2"></td>
                      <td className="text-center py-2 px-2">{totalQuantity}</td>
                      <td></td>
                      <td className="text-right py-2 px-2">{plData.totalNetWeight.toFixed(2)}</td>
                      <td className="text-right py-2 px-2">{plData.totalGrossWeight.toFixed(2)}</td>
                      <td></td>
                      <td className="text-right py-2 px-2">{plData.totalCbm.toFixed(4)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <div className="text-center p-3 bg-[#2E8B57]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#2E8B57]">{plData.totalPackages}</div>
                  <div className="text-xs text-muted-foreground">Total Packages</div>
                </div>
                <div className="text-center p-3 bg-[#0F4C81]/10 rounded-lg">
                  <div className="text-2xl font-bold text-[#0F4C81]">{plData.totalNetWeight.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Net Weight (kg)</div>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{plData.totalGrossWeight.toFixed(1)}</div>
                  <div className="text-xs text-muted-foreground">Gross Weight (kg)</div>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-lg">
                  <div className="text-2xl font-bold text-amber-600">{plData.totalCbm.toFixed(3)}</div>
                  <div className="text-xs text-muted-foreground">Total CBM</div>
                </div>
              </div>

              {/* Remarks */}
              {plData.remarks && (
                <div className="mb-6 p-3 bg-muted/30 rounded-lg text-sm">
                  <div className="font-semibold mb-1">Remarks:</div>
                  <div className="text-muted-foreground whitespace-pre-line">{plData.remarks}</div>
                </div>
              )}

              {/* Signature Area */}
              <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t">
                <div className="text-center">
                  <div className="border-b border-slate-300 dark:border-slate-600 mb-2 h-12"></div>
                  <div className="text-xs text-muted-foreground">Authorized Signature (Shipper)</div>
                </div>
                <div className="text-center">
                  <div className="border-b border-slate-300 dark:border-slate-600 mb-2 h-12"></div>
                  <div className="text-xs text-muted-foreground">Authorized Signature (Consignee)</div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-center text-xs text-muted-foreground">
                <p className="mt-1">This document is computer generated and does not require signature for authenticity.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
