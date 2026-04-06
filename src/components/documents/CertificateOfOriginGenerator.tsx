'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Building2,
  MapPin,
  Package,
  Download,
  Printer,
  Eye,
  Plus,
  Trash2,
  Calendar,
  Globe,
  Stamp,
  CheckCircle2,
  AlertCircle,
  Info,
  Shield,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Copy,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

// Brand colors
const OCEAN_BLUE = '#0F4C81';
const LOGISTICS_GREEN = '#2E8B57';

// FTA (Free Trade Agreement) Options
const ftaOptions = [
  { value: 'non-preferential', label: 'Non-Preferential (Standard)', description: 'General Certificate of Origin for trade documentation' },
  { value: 'usmca', label: 'USMCA (CUSMA/T-MEC)', description: 'US-Mexico-Canada Agreement' },
  { value: 'ceta', label: 'CETA', description: 'Canada-European Union Trade Agreement' },
  { value: 'cptpp', label: 'CPTPP', description: 'Comprehensive and Progressive Agreement for Trans-Pacific Partnership' },
  { value: 'rcep', label: 'RCEP', description: 'Regional Comprehensive Economic Partnership' },
  { value: 'eu-japan', label: 'EU-Japan EPA', description: 'European Union-Japan Economic Partnership Agreement' },
  { value: 'eu-korea', label: 'EU-Korea FTA', description: 'European Union-Korea Free Trade Agreement' },
  { value: 'form-a', label: 'Form A (GSP)', description: 'Generalized System of Preferences' },
  { value: 'form-d', label: 'Form D (ASEAN)', description: 'ASEAN Free Trade Area' },
  { value: 'form-e', label: 'Form E (ASEAN-China)', description: 'ASEAN-China Free Trade Area' },
  { value: 'form-ak', label: 'Form AK (ASEAN-Korea)', description: 'ASEAN-Korea Free Trade Agreement' },
  { value: 'form-aj', label: 'Form AJ (ASEAN-Japan)', description: 'ASEAN-Japan Economic Partnership' },
  { value: 'form-aifta', label: 'Form AIFTA (ASEAN-India)', description: 'ASEAN-India Free Trade Area' },
  { value: 'form-australia', label: 'Form AANZ (ASEAN-AU-NZ)', description: 'ASEAN-Australia-New Zealand Free Trade Agreement' },
];

// Origin Criteria based on FTA
const originCriteriaMap: Record<string, Array<{ value: string; label: string; description: string }>> = {
  'non-preferential': [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained' },
    { value: 'WP', label: 'WP', description: 'Wholly Produced' },
  ],
  usmca: [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained or Produced Entirely' },
    { value: 'CTC', label: 'CTC', description: 'Tariff Shift - Change in Tariff Classification' },
    { value: 'RVC', label: 'RVC', description: 'Regional Value Content' },
    { value: 'DS', label: 'DS', description: 'De Minimis' },
  ],
  ceta: [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained' },
    { value: 'PE', label: 'PE', description: 'Produced Entirely' },
    { value: 'CTC', label: 'CTC', description: 'Change in Tariff Classification' },
    { value: 'RVC', label: 'RVC', description: 'Regional Value Content' },
  ],
  cptpp: [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained' },
    { value: 'PE', label: 'PE', description: 'Produced Entirely' },
    { value: 'CTC', label: 'CTC', description: 'Change in Tariff Classification' },
    { value: 'RVC', label: 'RVC', description: 'Regional Value Content' },
  ],
  rcep: [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained' },
    { value: 'PE', label: 'PE', description: 'Produced Entirely' },
    { value: 'CTC', label: 'CTC', description: 'Change in Tariff Classification' },
    { value: 'RVC', label: 'RVC', description: 'Regional Value Content' },
    { value: 'CUM', label: 'CUM', description: 'Cumulation' },
  ],
  'form-a': [
    { value: 'P', label: 'P', description: 'Wholly Obtained' },
    { value: 'W', label: 'W', description: 'Sufficient Working or Processing' },
    { value: 'S', label: 'S', description: 'Specific Manufacturing Process' },
  ],
  'form-d': [
    { value: 'WO', label: 'WO', description: 'Wholly Obtained' },
    { value: 'CTC', label: 'CTC', description: 'Change in Tariff Classification' },
    { value: 'RVC', label: 'RVC', description: 'Regional Value Content (40%)' },
  ],
};

// Transport Modes
const transportModes = [
  { value: 'sea', label: 'Sea Freight', icon: '🚢' },
  { value: 'air', label: 'Air Freight', icon: '✈️' },
  { value: 'road', label: 'Road Transport', icon: '🚛' },
  { value: 'rail', label: 'Rail Transport', icon: '🚂' },
  { value: 'multimodal', label: 'Multimodal', icon: '🚢🚛' },
];

// Chamber of Commerce List
const chamberOfCommerce = [
  { value: 'custom', label: 'Custom Entry' },
  { value: 'us-cc', label: 'U.S. Chamber of Commerce' },
  { value: 'uk-cc', label: 'British Chambers of Commerce' },
  { value: 'eu-cc', label: 'Eurochambres' },
  { value: 'hk-cc', label: 'Hong Kong General Chamber of Commerce' },
  { value: 'sg-cc', label: 'Singapore Chamber of Commerce' },
  { value: 'jp-cc', label: 'Japan Chamber of Commerce' },
  { value: 'au-cc', label: 'Australian Chamber of Commerce' },
  { value: 'cn-cc', label: 'China Council for Promotion of International Trade (CCPIT)' },
];

// Countries List
const countries = [
  'United States', 'Canada', 'Mexico', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
  'Netherlands', 'Belgium', 'Poland', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland',
  'China', 'Japan', 'South Korea', 'Taiwan', 'Hong Kong', 'Singapore', 'Malaysia', 'Thailand',
  'Vietnam', 'Indonesia', 'Philippines', 'India', 'Pakistan', 'Bangladesh', 'Australia', 'New Zealand',
  'Brazil', 'Argentina', 'Chile', 'Colombia', 'South Africa', 'UAE', 'Saudi Arabia', 'Turkey',
];

// Product Units
const productUnits = [
  { value: 'PCS', label: 'Pieces' },
  { value: 'KG', label: 'Kilograms' },
  { value: 'MT', label: 'Metric Tons' },
  { value: 'SETS', label: 'Sets' },
  { value: 'CTN', label: 'Cartons' },
  { value: 'ROLL', label: 'Rolls' },
  { value: 'M', label: 'Meters' },
  { value: 'M2', label: 'Square Meters' },
  { value: 'M3', label: 'Cubic Meters' },
];

interface GoodsItem {
  id: string;
  itemNumber: number;
  marksAndNumbers: string;
  numberOfPackages: string;
  descriptionOfGoods: string;
  hsCode: string;
  originCriterion: string;
  grossWeight: number;
  netWeight: number;
  quantity: number;
  unit: string;
  value: number;
  currency: string;
  countryCodeOfOrigin: string;
  rvcPercentage?: number;
}

interface CertificateData {
  // Document Reference
  certificateNumber: string;
  certificateDate: string;
  
  // FTA Selection
  ftaType: string;
  
  // Exporter Details
  exporterName: string;
  exporterAddress: string;
  exporterCountry: string;
  exporterTaxId: string;
  exporterContact: string;
  exporterPhone: string;
  exporterEmail: string;
  
  // Importer Details
  importerName: string;
  importerAddress: string;
  importerCountry: string;
  importerTaxId: string;
  
  // Consignee (if different)
  consigneeName: string;
  consigneeAddress: string;
  consigneeCountry: string;
  
  // Producer (if different)
  producerName: string;
  producerAddress: string;
  producerCountry: string;
  
  // Transport Details
  transportMode: string;
  vesselName: string;
  voyageNumber: string;
  portOfLoading: string;
  portOfDischarge: string;
  billOfLadingNumber: string;
  containerNumber: string;
  dateOfShipment: string;
  
  // Goods
  goods: GoodsItem[];
  
  // Declaration
  declarationAccepted: boolean;
  declarationPlace: string;
  declarationDate: string;
  declarantName: string;
  declarantTitle: string;
  declarantPhone: string;
  declarantEmail: string;
  
  // Chamber of Commerce Section
  chamberRequired: boolean;
  chamberName: string;
  chamberCustomName: string;
  chamberAddress: string;
  chamberCity: string;
  chamberCountry: string;
  certificationNumber: string;
  certificationDate: string;
  certifyingOfficer: string;
  
  // Additional Info
  remarks: string;
  additionalDeclarations: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
}

const defaultGoodsItem = (): GoodsItem => ({
  id: crypto.randomUUID(),
  itemNumber: 1,
  marksAndNumbers: '',
  numberOfPackages: '',
  descriptionOfGoods: '',
  hsCode: '',
  originCriterion: 'WO',
  grossWeight: 0,
  netWeight: 0,
  quantity: 1,
  unit: 'PCS',
  value: 0,
  currency: 'USD',
  countryCodeOfOrigin: '',
  rvcPercentage: undefined,
});

const generateCertificateNumber = () => {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `CO-${year}-${random}`;
};

export function CertificateOfOriginGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  
  const [data, setData] = useState<CertificateData>({
    certificateNumber: generateCertificateNumber(),
    certificateDate: new Date().toISOString().split('T')[0],
    
    ftaType: 'non-preferential',
    
    exporterName: '',
    exporterAddress: '',
    exporterCountry: '',
    exporterTaxId: '',
    exporterContact: '',
    exporterPhone: '',
    exporterEmail: '',
    
    importerName: '',
    importerAddress: '',
    importerCountry: '',
    importerTaxId: '',
    
    consigneeName: '',
    consigneeAddress: '',
    consigneeCountry: '',
    
    producerName: '',
    producerAddress: '',
    producerCountry: '',
    
    transportMode: 'sea',
    vesselName: '',
    voyageNumber: '',
    portOfLoading: '',
    portOfDischarge: '',
    billOfLadingNumber: '',
    containerNumber: '',
    dateOfShipment: '',
    
    goods: [defaultGoodsItem()],
    
    declarationAccepted: false,
    declarationPlace: '',
    declarationDate: new Date().toISOString().split('T')[0],
    declarantName: '',
    declarantTitle: '',
    declarantPhone: '',
    declarantEmail: '',
    
    chamberRequired: true,
    chamberName: 'us-cc',
    chamberCustomName: '',
    chamberAddress: '',
    chamberCity: '',
    chamberCountry: '',
    certificationNumber: '',
    certificationDate: '',
    certifyingOfficer: '',
    
    remarks: '',
    additionalDeclarations: '',
    invoiceNumber: '',
    invoiceDate: '',
    currency: 'USD',
  });

  const updateField = <K extends keyof CertificateData>(field: K, value: CertificateData[K]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateGoodsItem = (id: string, field: keyof GoodsItem, value: string | number | boolean) => {
    setData(prev => ({
      ...prev,
      goods: prev.goods.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const addGoodsItem = () => {
    const newItem = defaultGoodsItem();
    newItem.itemNumber = data.goods.length + 1;
    setData(prev => ({
      ...prev,
      goods: [...prev.goods, newItem],
    }));
  };

  const removeGoodsItem = (id: string) => {
    if (data.goods.length > 1) {
      setData(prev => ({
        ...prev,
        goods: prev.goods
          .filter(item => item.id !== id)
          .map((item, index) => ({ ...item, itemNumber: index + 1 })),
      }));
    }
  };

  const duplicateGoodsItem = (id: string) => {
    const item = data.goods.find(g => g.id === id);
    if (item) {
      const newItem = { ...item, id: crypto.randomUUID(), itemNumber: data.goods.length + 1 };
      setData(prev => ({
        ...prev,
        goods: [...prev.goods, newItem],
      }));
    }
  };

  const getOriginCriteria = () => {
    return originCriteriaMap[data.ftaType] || originCriteriaMap['non-preferential'] || [];
  };

  const getFTALabel = () => {
    return ftaOptions.find(f => f.value === data.ftaType)?.label || 'Certificate of Origin';
  };

  const handlePrint = () => {
    document.body.classList.add('printing-document');
    const originalTitle = document.title;
    document.title = `Certificate_of_Origin_${data.certificateNumber || 'Document'}`;
    window.print();
    setTimeout(() => {
      document.body.classList.remove('printing-document');
      document.title = originalTitle;
    }, 1000);
  };

  const handleExportPDF = () => {
    toast.info('PDF export would be generated in production. Use Print to PDF for now.');
  };

  const copyCertificateNumber = () => {
    navigator.clipboard.writeText(data.certificateNumber);
    toast.success('Certificate number copied to clipboard');
  };

  const selectedFTA = ftaOptions.find(f => f.value === data.ftaType);
  const selectedTransport = transportModes.find(t => t.value === data.transportMode);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-sm px-3 py-1 border-[#0F4C81] text-[#0F4C81]">
            {selectedFTA?.label}
          </Badge>
          <Badge variant="secondary" className="font-mono">
            {data.certificateNumber}
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0 ml-1" onClick={copyCertificateNumber}>
              <Copy className="h-3 w-3" />
            </Button>
          </Badge>
        </div>
        <div className="flex gap-2 no-print">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button size="sm" onClick={handleExportPDF} style={{ backgroundColor: OCEAN_BLUE }}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Form */}
        <div className="space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="details" className="text-xs sm:text-sm">Details</TabsTrigger>
              <TabsTrigger value="parties" className="text-xs sm:text-sm">Parties</TabsTrigger>
              <TabsTrigger value="transport" className="text-xs sm:text-sm">Transport</TabsTrigger>
              <TabsTrigger value="goods" className="text-xs sm:text-sm">Goods</TabsTrigger>
              <TabsTrigger value="certify" className="text-xs sm:text-sm">Certify</TabsTrigger>
            </TabsList>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Document Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Certificate Number</Label>
                      <div className="flex gap-2">
                        <Input
                          value={data.certificateNumber}
                          onChange={(e) => updateField('certificateNumber', e.target.value)}
                          className="font-mono"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Issue Date</Label>
                      <Input
                        type="date"
                        value={data.certificateDate}
                        onChange={(e) => updateField('certificateDate', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Free Trade Agreement / Certificate Type</Label>
                    <Select value={data.ftaType} onValueChange={(v) => updateField('ftaType', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ftaOptions.map((fta) => (
                          <SelectItem key={fta.value} value={fta.value}>
                            <div className="flex flex-col">
                              <span>{fta.label}</span>
                              <span className="text-xs text-muted-foreground">{fta.description}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedFTA && (
                    <div className="p-3 rounded-lg bg-muted/50 border">
                      <p className="text-sm text-muted-foreground">{selectedFTA.description}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Invoice Number</Label>
                      <Input
                        value={data.invoiceNumber}
                        onChange={(e) => updateField('invoiceNumber', e.target.value)}
                        placeholder="Invoice reference"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Invoice Date</Label>
                      <Input
                        type="date"
                        value={data.invoiceDate}
                        onChange={(e) => updateField('invoiceDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={data.currency} onValueChange={(v) => updateField('currency', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - US Dollar</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="GBP">GBP - British Pound</SelectItem>
                        <SelectItem value="CNY">CNY - Chinese Yuan</SelectItem>
                        <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                        <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Parties Tab */}
            <TabsContent value="parties" className="space-y-4 mt-4">
              {/* Exporter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Exporter Details
                  </CardTitle>
                  <CardDescription>The exporter of record for this shipment</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={data.exporterName}
                      onChange={(e) => updateField('exporterName', e.target.value)}
                      placeholder="Exporter company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Textarea
                      value={data.exporterAddress}
                      onChange={(e) => updateField('exporterAddress', e.target.value)}
                      placeholder="Full street address"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <Select value={data.exporterCountry} onValueChange={(v) => updateField('exporterCountry', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID / VAT Number</Label>
                      <Input
                        value={data.exporterTaxId}
                        onChange={(e) => updateField('exporterTaxId', e.target.value)}
                        placeholder="EIN, VAT, etc."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input
                      value={data.exporterContact}
                      onChange={(e) => updateField('exporterContact', e.target.value)}
                      placeholder="Contact name"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={data.exporterPhone}
                        onChange={(e) => updateField('exporterPhone', e.target.value)}
                        placeholder="+1 234 567 8900"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={data.exporterEmail}
                        onChange={(e) => updateField('exporterEmail', e.target.value)}
                        placeholder="email@company.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Importer */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Globe className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Importer Details
                  </CardTitle>
                  <CardDescription>The importer receiving the goods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company Name *</Label>
                    <Input
                      value={data.importerName}
                      onChange={(e) => updateField('importerName', e.target.value)}
                      placeholder="Importer company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address *</Label>
                    <Textarea
                      value={data.importerAddress}
                      onChange={(e) => updateField('importerAddress', e.target.value)}
                      placeholder="Full street address"
                      rows={2}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Country *</Label>
                      <Select value={data.importerCountry} onValueChange={(v) => updateField('importerCountry', v)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Tax ID / VAT Number</Label>
                      <Input
                        value={data.importerTaxId}
                        onChange={(e) => updateField('importerTaxId', e.target.value)}
                        placeholder="Import license, VAT, etc."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consignee (Optional) */}
              <Accordion type="single" collapsible>
                <AccordionItem value="consignee">
                  <AccordionTrigger className="text-sm font-medium">
                    Consignee (if different from importer)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Consignee Name</Label>
                        <Input
                          value={data.consigneeName}
                          onChange={(e) => updateField('consigneeName', e.target.value)}
                          placeholder="Consignee company name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          value={data.consigneeAddress}
                          onChange={(e) => updateField('consigneeAddress', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select value={data.consigneeCountry} onValueChange={(v) => updateField('consigneeCountry', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              {/* Producer (Optional) */}
              <Accordion type="single" collapsible>
                <AccordionItem value="producer">
                  <AccordionTrigger className="text-sm font-medium">
                    Producer (if different from exporter)
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div className="space-y-2">
                        <Label>Producer Name</Label>
                        <Input
                          value={data.producerName}
                          onChange={(e) => updateField('producerName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Address</Label>
                        <Textarea
                          value={data.producerAddress}
                          onChange={(e) => updateField('producerAddress', e.target.value)}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select value={data.producerCountry} onValueChange={(v) => updateField('producerCountry', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>{country}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Transport Tab */}
            <TabsContent value="transport" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Transport & Shipment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Transport Mode</Label>
                    <Select value={data.transportMode} onValueChange={(v) => updateField('transportMode', v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {transportModes.map((mode) => (
                          <SelectItem key={mode.value} value={mode.value}>
                            <span className="flex items-center gap-2">
                              <span>{mode.icon}</span>
                              <span>{mode.label}</span>
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Vessel / Flight Name</Label>
                      <Input
                        value={data.vesselName}
                        onChange={(e) => updateField('vesselName', e.target.value)}
                        placeholder="Vessel or flight number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Voyage / Flight Number</Label>
                      <Input
                        value={data.voyageNumber}
                        onChange={(e) => updateField('voyageNumber', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Port of Loading *</Label>
                      <Input
                        value={data.portOfLoading}
                        onChange={(e) => updateField('portOfLoading', e.target.value)}
                        placeholder="Shanghai, China"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Port of Discharge *</Label>
                      <Input
                        value={data.portOfDischarge}
                        onChange={(e) => updateField('portOfDischarge', e.target.value)}
                        placeholder="Los Angeles, USA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Bill of Lading Number</Label>
                      <Input
                        value={data.billOfLadingNumber}
                        onChange={(e) => updateField('billOfLadingNumber', e.target.value)}
                        className="font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Container Number(s)</Label>
                      <Input
                        value={data.containerNumber}
                        onChange={(e) => updateField('containerNumber', e.target.value)}
                        placeholder="CSQU3054383"
                        className="font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Date of Shipment</Label>
                    <Input
                      type="date"
                      value={data.dateOfShipment}
                      onChange={(e) => updateField('dateOfShipment', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Goods Tab */}
            <TabsContent value="goods" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Package className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Goods Description
                  </CardTitle>
                  <CardDescription>
                    Add all items with HS codes and origin criteria
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ScrollArea className="max-h-[500px] pr-4">
                    <AnimatePresence>
                      {data.goods.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mb-4 p-4 border rounded-lg bg-muted/20"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline">Item {item.itemNumber}</Badge>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => duplicateGoodsItem(item.id)}
                                title="Duplicate item"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                              {data.goods.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeGoodsItem(item.id)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Marks & Numbers</Label>
                              <Input
                                value={item.marksAndNumbers}
                                onChange={(e) => updateGoodsItem(item.id, 'marksAndNumbers', e.target.value)}
                                placeholder="Shipping marks"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">No. of Packages</Label>
                              <Input
                                value={item.numberOfPackages}
                                onChange={(e) => updateGoodsItem(item.id, 'numberOfPackages', e.target.value)}
                                placeholder="e.g., 100 CTNS"
                              />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label className="text-xs">Description of Goods *</Label>
                              <Textarea
                                value={item.descriptionOfGoods}
                                onChange={(e) => updateGoodsItem(item.id, 'descriptionOfGoods', e.target.value)}
                                placeholder="Detailed product description"
                                rows={2}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">HS Code *</Label>
                              <Input
                                value={item.hsCode}
                                onChange={(e) => updateGoodsItem(item.id, 'hsCode', e.target.value)}
                                placeholder="e.g., 9403.70.80"
                                className="font-mono"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Origin Criterion *</Label>
                              <Select
                                value={item.originCriterion}
                                onValueChange={(v) => updateGoodsItem(item.id, 'originCriterion', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {getOriginCriteria().map((c) => (
                                    <SelectItem key={c.value} value={c.value}>
                                      {c.label} - {c.description}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Gross Weight (kg)</Label>
                              <Input
                                type="number"
                                value={item.grossWeight || ''}
                                onChange={(e) => updateGoodsItem(item.id, 'grossWeight', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Net Weight (kg)</Label>
                              <Input
                                type="number"
                                value={item.netWeight || ''}
                                onChange={(e) => updateGoodsItem(item.id, 'netWeight', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Quantity</Label>
                              <Input
                                type="number"
                                value={item.quantity || ''}
                                onChange={(e) => updateGoodsItem(item.id, 'quantity', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Unit</Label>
                              <Select
                                value={item.unit}
                                onValueChange={(v) => updateGoodsItem(item.id, 'unit', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {productUnits.map((u) => (
                                    <SelectItem key={u.value} value={u.value}>
                                      {u.value} - {u.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Value ({data.currency})</Label>
                              <Input
                                type="number"
                                value={item.value || ''}
                                onChange={(e) => updateGoodsItem(item.id, 'value', Number(e.target.value))}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Country of Origin</Label>
                              <Select
                                value={item.countryCodeOfOrigin}
                                onValueChange={(v) => updateGoodsItem(item.id, 'countryCodeOfOrigin', v)}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent>
                                  {countries.map((c) => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            {item.originCriterion === 'RVC' && (
                              <div className="col-span-2 space-y-2">
                                <Label className="text-xs">RVC Percentage (%)</Label>
                                <Input
                                  type="number"
                                  value={item.rvcPercentage || ''}
                                  onChange={(e) => updateGoodsItem(item.id, 'rvcPercentage', Number(e.target.value))}
                                  placeholder="e.g., 45"
                                />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </ScrollArea>

                  <Button variant="outline" onClick={addGoodsItem} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Item
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Certification Tab */}
            <TabsContent value="certify" className="space-y-4 mt-4">
              {/* Exporter Declaration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Exporter&apos;s Declaration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg border bg-muted/30 text-sm">
                    <p className="font-medium mb-2">Declaration Statement:</p>
                    <p className="text-muted-foreground">
                      I, the undersigned, hereby declare that the goods described above originate in the country shown
                      and comply with the origin requirements specified for the above-mentioned preferential trade
                      agreement. The information contained in this document is true and correct.
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="declaration"
                      checked={data.declarationAccepted}
                      onCheckedChange={(checked) => updateField('declarationAccepted', checked as boolean)}
                    />
                    <Label htmlFor="declaration" className="text-sm font-medium">
                      I accept this declaration and confirm all information is accurate
                    </Label>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Place of Issue</Label>
                      <Input
                        value={data.declarationPlace}
                        onChange={(e) => updateField('declarationPlace', e.target.value)}
                        placeholder="City, Country"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={data.declarationDate}
                        onChange={(e) => updateField('declarationDate', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Authorized Signatory Name</Label>
                      <Input
                        value={data.declarantName}
                        onChange={(e) => updateField('declarantName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Title / Position</Label>
                      <Input
                        value={data.declarantTitle}
                        onChange={(e) => updateField('declarantTitle', e.target.value)}
                        placeholder="e.g., Export Manager"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        value={data.declarantPhone}
                        onChange={(e) => updateField('declarantPhone', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={data.declarantEmail}
                        onChange={(e) => updateField('declarantEmail', e.target.value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Chamber of Commerce */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Stamp className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Chamber of Commerce Certification
                  </CardTitle>
                  <CardDescription>
                    Required for most certificates to be legally valid
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="chamberRequired"
                      checked={data.chamberRequired}
                      onCheckedChange={(checked) => updateField('chamberRequired', checked as boolean)}
                    />
                    <Label htmlFor="chamberRequired" className="text-sm">
                      Chamber of Commerce certification required
                    </Label>
                  </div>

                  {data.chamberRequired && (
                    <>
                      <div className="space-y-2">
                        <Label>Certifying Authority</Label>
                        <Select value={data.chamberName} onValueChange={(v) => updateField('chamberName', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {chamberOfCommerce.map((chamber) => (
                              <SelectItem key={chamber.value} value={chamber.value}>
                                {chamber.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {data.chamberName === 'custom' && (
                        <div className="space-y-2">
                          <Label>Authority Name</Label>
                          <Input
                            value={data.chamberCustomName}
                            onChange={(e) => updateField('chamberCustomName', e.target.value)}
                            placeholder="Enter certifying authority name"
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Certification Number</Label>
                          <Input
                            value={data.certificationNumber}
                            onChange={(e) => updateField('certificationNumber', e.target.value)}
                            placeholder="Issued by chamber"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Certification Date</Label>
                          <Input
                            type="date"
                            value={data.certificationDate}
                            onChange={(e) => updateField('certificationDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Certifying Officer</Label>
                        <Input
                          value={data.certifyingOfficer}
                          onChange={(e) => updateField('certifyingOfficer', e.target.value)}
                          placeholder="Name of certifying officer"
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5 text-muted-foreground" />
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Remarks</Label>
                    <Textarea
                      value={data.remarks}
                      onChange={(e) => updateField('remarks', e.target.value)}
                      placeholder="Additional remarks or references"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Declarations</Label>
                    <Textarea
                      value={data.additionalDeclarations}
                      onChange={(e) => updateField('additionalDeclarations', e.target.value)}
                      placeholder="Any additional declarations required by the FTA"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between no-print">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Eye className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
              Live Preview
            </h2>
          </div>

          <div ref={printRef} className="bg-white dark:bg-card rounded-lg shadow-xl overflow-hidden document-content-only">
            {/* Document Preview */}
            <div className="p-6 text-xs" id="co-preview">
              {/* Header */}
              <div className="text-center mb-6 border-b-2 pb-4" style={{ borderColor: OCEAN_BLUE }}>
                <h1 className="text-xl font-bold" style={{ color: OCEAN_BLUE }}>
                  CERTIFICATE OF ORIGIN
                </h1>
                <p className="text-sm font-medium mt-1">{getFTALabel()}</p>
                <div className="font-mono font-bold mt-2 text-sm">{data.certificateNumber}</div>
                <p className="text-xs text-muted-foreground mt-1">Date: {data.certificateDate}</p>
              </div>

              {/* Exporter & Importer */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-muted/30 rounded border">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">
                    1. EXPORTER (Name, Address, Country)
                  </div>
                  <div className="font-medium text-sm">{data.exporterName || 'Exporter Name'}</div>
                  <div className="text-[10px] text-muted-foreground whitespace-pre-line">{data.exporterAddress}</div>
                  <div className="text-[10px] font-medium">{data.exporterCountry}</div>
                  {data.exporterTaxId && (
                    <div className="text-[10px] text-muted-foreground">Tax ID: {data.exporterTaxId}</div>
                  )}
                  {data.exporterPhone && (
                    <div className="text-[10px] text-muted-foreground">Tel: {data.exporterPhone}</div>
                  )}
                  {data.exporterEmail && (
                    <div className="text-[10px] text-muted-foreground">Email: {data.exporterEmail}</div>
                  )}
                </div>
                <div className="p-3 bg-muted/30 rounded border">
                  <div className="text-[10px] font-semibold text-muted-foreground mb-1">
                    2. IMPORTER (Name, Address, Country)
                  </div>
                  <div className="font-medium text-sm">{data.importerName || 'Importer Name'}</div>
                  <div className="text-[10px] text-muted-foreground whitespace-pre-line">{data.importerAddress}</div>
                  <div className="text-[10px] font-medium">{data.importerCountry}</div>
                  {data.importerTaxId && (
                    <div className="text-[10px] text-muted-foreground">Tax ID: {data.importerTaxId}</div>
                  )}
                </div>
              </div>

              {/* Transport Details */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="p-2 bg-muted/20 rounded border">
                  <span className="text-[10px] text-muted-foreground">Transport: </span>
                  <span className="font-medium">{selectedTransport?.label}</span>
                </div>
                <div className="p-2 bg-muted/20 rounded border">
                  <span className="text-[10px] text-muted-foreground">Vessel: </span>
                  <span className="font-medium">{data.vesselName || '—'}</span>
                </div>
                <div className="p-2 bg-muted/20 rounded border">
                  <span className="text-[10px] text-muted-foreground">POL: </span>
                  <span className="font-medium">{data.portOfLoading || '—'}</span>
                </div>
              </div>

              {/* Goods Table */}
              <table className="w-full mb-4 text-[9px] border-collapse">
                <thead>
                  <tr className="border bg-muted/30">
                    <th className="text-left py-2 px-2 font-semibold border w-8">#</th>
                    <th className="text-left py-2 px-2 font-semibold border">Marks & Numbers</th>
                    <th className="text-left py-2 px-2 font-semibold border">Description</th>
                    <th className="text-center py-2 px-2 font-semibold border w-16">HS Code</th>
                    <th className="text-center py-2 px-2 font-semibold border w-10">Origin</th>
                    <th className="text-center py-2 px-2 font-semibold border w-12">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {data.goods.map((item, idx) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-1.5 px-2 border">{idx + 1}</td>
                      <td className="py-1.5 px-2 border">{item.marksAndNumbers || '—'}</td>
                      <td className="py-1.5 px-2 border">{item.descriptionOfGoods || `Product ${idx + 1}`}</td>
                      <td className="py-1.5 px-2 border text-center font-mono">{item.hsCode || '—'}</td>
                      <td className="py-1.5 px-2 border text-center font-medium">{item.originCriterion}</td>
                      <td className="py-1.5 px-2 border text-center">{item.quantity} {item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Weights Summary */}
              <div className="flex gap-4 mb-4 text-[10px]">
                <div>
                  <span className="text-muted-foreground">Total Gross Weight: </span>
                  <span className="font-medium">
                    {data.goods.reduce((sum, g) => sum + (g.grossWeight || 0), 0).toLocaleString()} kg
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Net Weight: </span>
                  <span className="font-medium">
                    {data.goods.reduce((sum, g) => sum + (g.netWeight || 0), 0).toLocaleString()} kg
                  </span>
                </div>
              </div>

              {/* Certification Signatures */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="border rounded p-4">
                  <div className="text-[10px] font-semibold mb-8">EXPORTER&apos;S DECLARATION</div>
                  <div className="text-[10px] text-muted-foreground mb-2">
                    I certify that the goods described in this document qualify as originating
                    and the information is true and accurate.
                  </div>
                  <div className="border-t mt-8 pt-2 text-center text-[9px]">
                    Authorized Signature & Date
                  </div>
                  {data.declarantName && (
                    <div className="text-center mt-1">
                      <div className="font-medium text-[10px]">{data.declarantName}</div>
                      <div className="text-[9px] text-muted-foreground">{data.declarantTitle}</div>
                      {(data.declarantPhone || data.declarantEmail) && (
                        <div className="text-[9px] text-muted-foreground">
                          {data.declarantPhone && `Tel: ${data.declarantPhone}`}
                          {data.declarantPhone && data.declarantEmail && ' | '}
                          {data.declarantEmail && `Email: ${data.declarantEmail}`}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="text-[9px] text-center mt-1 text-muted-foreground">
                    Place: {data.declarationPlace || '________'} | Date: {data.declarationDate}
                  </div>
                </div>
                <div className="border rounded p-4 bg-muted/10">
                  <div className="text-[10px] font-semibold mb-2">CERTIFYING AUTHORITY</div>
                  <div className="text-[10px] text-muted-foreground mb-4">
                    {data.chamberName === 'custom'
                      ? data.chamberCustomName || 'Custom Authority'
                      : chamberOfCommerce.find(c => c.value === data.chamberName)?.label || 'Chamber of Commerce'}
                  </div>
                  {data.certificationNumber && (
                    <div className="text-[10px] mb-2">
                      <span className="text-muted-foreground">Cert No: </span>
                      <span className="font-mono">{data.certificationNumber}</span>
                    </div>
                  )}
                  <div className="border-t mt-6 pt-2 text-center text-[9px]">
                    Official Stamp, Signature & Date
                  </div>
                  {data.certifyingOfficer && (
                    <div className="text-center mt-1">
                      <div className="font-medium text-[10px]">{data.certifyingOfficer}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Remarks */}
              {data.remarks && (
                <div className="mt-4 p-2 bg-muted/30 rounded text-[10px] border">
                  <span className="font-semibold">Remarks: </span>
                  {data.remarks}
                </div>
              )}

              {/* Footer */}
              <div className="mt-6 pt-4 border-t text-center text-[10px] text-muted-foreground">
                <p>
                  This document is for reference only. Official certification must be obtained
                  from authorized bodies.
                </p>
              </div>
            </div>
          </div>

          {/* Validation Warnings */}
          {!data.declarationAccepted && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <AlertCircle className="h-4 w-4" />
              <span>Please accept the declaration in the Certification tab</span>
            </div>
          )}

          {!data.exporterName && !data.importerName && (
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
              <Info className="h-4 w-4" />
              <span>Complete exporter and importer details</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
