'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Eye, Building, Globe, Calendar, Package, CheckCircle, AlertTriangle, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';

interface InspectionData {
  // Certificate Details
  certificateNo: string;
  inspectionDate: string;
  inspectionPlace: string;
  inspectionType: 'pre-shipment' | 'during-production' | 'container-loading' | 'final-random';
  
  // Applicant
  applicantName: string;
  applicantAddress: string;
  applicantContact: string;
  applicantPhone: string;
  applicantEmail: string;
  
  // Supplier/Manufacturer
  supplierName: string;
  supplierAddress: string;
  supplierCountry: string;
  supplierContact: string;
  supplierPhone: string;
  supplierEmail: string;
  
  // Inspector
  inspectionCompany: string;
  inspectorName: string;
  inspectorId: string;
  
  // Product Details
  productName: string;
  hsCode: string;
  quantity: number;
  quantityUnit: string;
  batchLotNo: string;
  manufacturingDate: string;
  expiryDate: string;
  
  // Order Details
  purchaseOrderNo: string;
  contractNo: string;
  invoiceNo: string;
  blNo: string;
  
  // Inspection Results
  inspectionStandard: string;
  samplingMethod: string;
  sampleSize: number;
  sampleUnit: string;
  overallResult: 'passed' | 'failed' | 'conditional';
  
  // Quality Checks
  visualInspection: boolean;
  quantityVerification: boolean;
  packagingCheck: boolean;
  labelingCheck: boolean;
  dimensionsCheck: boolean;
  weightCheck: boolean;
  functionalityTest: boolean;
  safetyTest: boolean;
  
  // Findings
  defects: string;
  defectsPercentage: number;
  observations: string;
  recommendations: string;
  
  // Additional
  attachments: string;
  remarks: string;
}

const inspectionTypes = [
  { value: 'pre-shipment', label: 'Pre-Shipment Inspection (PSI)' },
  { value: 'during-production', label: 'During Production Inspection (DPI)' },
  { value: 'container-loading', label: 'Container Loading Supervision (CLS)' },
  { value: 'final-random', label: 'Final Random Inspection (FRI)' },
];

const quantityUnits = [
  { value: 'PCS', label: 'Pieces' },
  { value: 'SETS', label: 'Sets' },
  { value: 'CTN', label: 'Cartons' },
  { value: 'KGS', label: 'Kilograms' },
  { value: 'MT', label: 'Metric Tons' },
  { value: 'UNITS', label: 'Units' },
];

const inspectionStandards = [
  { value: 'iso-2859', label: 'ISO 2859-1 (AQL Sampling)' },
  { value: 'ansi-asq', label: 'ANSI/ASQ Z1.4' },
  { value: 'bs-6001', label: 'BS 6001' },
  { value: 'din-40080', label: 'DIN 40080' },
  { value: 'custom', label: 'Custom Standard' },
];

export default function InspectionCertificateGenerator() {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('form');
  const [inspectionData, setInspectionData] = useState<InspectionData>({
    certificateNo: `INS-${Date.now().toString().slice(-8)}`,
    inspectionDate: new Date().toISOString().split('T')[0],
    inspectionPlace: '',
    inspectionType: 'pre-shipment',
    
    applicantName: '',
    applicantAddress: '',
    applicantContact: '',
    applicantPhone: '',
    applicantEmail: '',
    
    supplierName: '',
    supplierAddress: '',
    supplierCountry: '',
    supplierContact: '',
    supplierPhone: '',
    supplierEmail: '',
    
    inspectionCompany: '',
    inspectorName: '',
    inspectorId: '',
    
    productName: '',
    hsCode: '',
    quantity: 0,
    quantityUnit: 'PCS',
    batchLotNo: '',
    manufacturingDate: '',
    expiryDate: '',
    
    purchaseOrderNo: '',
    contractNo: '',
    invoiceNo: '',
    blNo: '',
    
    inspectionStandard: 'iso-2859',
    samplingMethod: 'Random Sampling per AQL 2.5',
    sampleSize: 0,
    sampleUnit: 'PCS',
    overallResult: 'passed',
    
    visualInspection: true,
    quantityVerification: true,
    packagingCheck: true,
    labelingCheck: true,
    dimensionsCheck: false,
    weightCheck: true,
    functionalityTest: false,
    safetyTest: false,
    
    defects: '',
    defectsPercentage: 0,
    observations: '',
    recommendations: '',
    
    attachments: '',
    remarks: '',
  });

  const updateField = (field: keyof InspectionData, value: any) => {
    setInspectionData(prev => ({ ...prev, [field]: value }));
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

  const selectedInspectionType = inspectionTypes.find(t => t.value === inspectionData.inspectionType);
  const selectedStandard = inspectionStandards.find(s => s.value === inspectionData.inspectionStandard);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <ClipboardCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              Inspection Certificate Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Professional quality inspection certificate for international trade compliance
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="form">
              <FileText className="h-4 w-4 mr-2" />
              Fill Form
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-4 w-4 mr-2" />
              Preview Certificate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Certificate Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <ClipboardCheck className="h-5 w-5 text-[#0F4C81]" />
                      Inspection Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Certificate No.</Label>
                        <Input
                          value={inspectionData.certificateNo}
                          onChange={(e) => updateField('certificateNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Inspection Date</Label>
                        <Input
                          type="date"
                          value={inspectionData.inspectionDate}
                          onChange={(e) => updateField('inspectionDate', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Inspection Type</Label>
                        <Select value={inspectionData.inspectionType} onValueChange={(v: any) => updateField('inspectionType', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {inspectionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Inspection Place</Label>
                        <Input
                          value={inspectionData.inspectionPlace}
                          onChange={(e) => updateField('inspectionPlace', e.target.value)}
                          placeholder="Factory/Warehouse"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Applicant */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Building className="h-5 w-5 text-[#2E8B57]" />
                      Applicant (Buyer/Importer)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={inspectionData.applicantName}
                        onChange={(e) => updateField('applicantName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={inspectionData.applicantAddress}
                        onChange={(e) => updateField('applicantAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Contact Person</Label>
                      <Input
                        value={inspectionData.applicantContact}
                        onChange={(e) => updateField('applicantContact', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Supplier */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Globe className="h-5 w-5 text-[#0F4C81]" />
                      Supplier/Manufacturer
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Company Name *</Label>
                      <Input
                        value={inspectionData.supplierName}
                        onChange={(e) => updateField('supplierName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Textarea
                        value={inspectionData.supplierAddress}
                        onChange={(e) => updateField('supplierAddress', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Country</Label>
                      <Input
                        value={inspectionData.supplierCountry}
                        onChange={(e) => updateField('supplierCountry', e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Inspector */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <CheckCircle className="h-5 w-5 text-[#2E8B57]" />
                      Inspection Company
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Inspection Company *</Label>
                      <Input
                        value={inspectionData.inspectionCompany}
                        onChange={(e) => updateField('inspectionCompany', e.target.value)}
                        placeholder="SGS, BV, Intertek, etc."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Inspector Name</Label>
                        <Input
                          value={inspectionData.inspectorName}
                          onChange={(e) => updateField('inspectorName', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Inspector ID</Label>
                        <Input
                          value={inspectionData.inspectorId}
                          onChange={(e) => updateField('inspectorId', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Product Details */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Package className="h-5 w-5 text-[#0F4C81]" />
                      Product Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Product Name/Description *</Label>
                      <Textarea
                        value={inspectionData.productName}
                        onChange={(e) => updateField('productName', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>HS Code</Label>
                        <Input
                          value={inspectionData.hsCode}
                          onChange={(e) => updateField('hsCode', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Batch/Lot No.</Label>
                        <Input
                          value={inspectionData.batchLotNo}
                          onChange={(e) => updateField('batchLotNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          value={inspectionData.quantity}
                          onChange={(e) => updateField('quantity', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Unit</Label>
                        <Select value={inspectionData.quantityUnit} onValueChange={(v) => updateField('quantityUnit', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {quantityUnits.map((unit) => (
                              <SelectItem key={unit.value} value={unit.value}>
                                {unit.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Manufacturing Date</Label>
                        <Input
                          type="date"
                          value={inspectionData.manufacturingDate}
                          onChange={(e) => updateField('manufacturingDate', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Expiry Date</Label>
                        <Input
                          type="date"
                          value={inspectionData.expiryDate}
                          onChange={(e) => updateField('expiryDate', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Reference */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Order Reference</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Purchase Order No.</Label>
                        <Input
                          value={inspectionData.purchaseOrderNo}
                          onChange={(e) => updateField('purchaseOrderNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contract No.</Label>
                        <Input
                          value={inspectionData.contractNo}
                          onChange={(e) => updateField('contractNo', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Invoice No.</Label>
                        <Input
                          value={inspectionData.invoiceNo}
                          onChange={(e) => updateField('invoiceNo', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>B/L No.</Label>
                        <Input
                          value={inspectionData.blNo}
                          onChange={(e) => updateField('blNo', e.target.value)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Inspection Results */}
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Inspection Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Inspection Standard</Label>
                        <Select value={inspectionData.inspectionStandard} onValueChange={(v) => updateField('inspectionStandard', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {inspectionStandards.map((std) => (
                              <SelectItem key={std.value} value={std.value}>
                                {std.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Overall Result</Label>
                        <Select value={inspectionData.overallResult} onValueChange={(v: any) => updateField('overallResult', v)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="passed">PASSED</SelectItem>
                            <SelectItem value="failed">FAILED</SelectItem>
                            <SelectItem value="conditional">CONDITIONAL PASS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Sample Size</Label>
                        <Input
                          type="number"
                          value={inspectionData.sampleSize}
                          onChange={(e) => updateField('sampleSize', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Defects %</Label>
                        <Input
                          type="number"
                          value={inspectionData.defectsPercentage}
                          onChange={(e) => updateField('defectsPercentage', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Quality Checks */}
                    <div className="space-y-2">
                      <Label>Inspection Items</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="visualInspection"
                            checked={inspectionData.visualInspection}
                            onCheckedChange={(checked) => updateField('visualInspection', !!checked)}
                          />
                          <Label htmlFor="visualInspection" className="text-sm">Visual Inspection</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="quantityVerification"
                            checked={inspectionData.quantityVerification}
                            onCheckedChange={(checked) => updateField('quantityVerification', !!checked)}
                          />
                          <Label htmlFor="quantityVerification" className="text-sm">Quantity Check</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="packagingCheck"
                            checked={inspectionData.packagingCheck}
                            onCheckedChange={(checked) => updateField('packagingCheck', !!checked)}
                          />
                          <Label htmlFor="packagingCheck" className="text-sm">Packaging Check</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="labelingCheck"
                            checked={inspectionData.labelingCheck}
                            onCheckedChange={(checked) => updateField('labelingCheck', !!checked)}
                          />
                          <Label htmlFor="labelingCheck" className="text-sm">Labeling Check</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="dimensionsCheck"
                            checked={inspectionData.dimensionsCheck}
                            onCheckedChange={(checked) => updateField('dimensionsCheck', !!checked)}
                          />
                          <Label htmlFor="dimensionsCheck" className="text-sm">Dimensions</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="weightCheck"
                            checked={inspectionData.weightCheck}
                            onCheckedChange={(checked) => updateField('weightCheck', !!checked)}
                          />
                          <Label htmlFor="weightCheck" className="text-sm">Weight Check</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="functionalityTest"
                            checked={inspectionData.functionalityTest}
                            onCheckedChange={(checked) => updateField('functionalityTest', !!checked)}
                          />
                          <Label htmlFor="functionalityTest" className="text-sm">Functionality Test</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="safetyTest"
                            checked={inspectionData.safetyTest}
                            onCheckedChange={(checked) => updateField('safetyTest', !!checked)}
                          />
                          <Label htmlFor="safetyTest" className="text-sm">Safety Test</Label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Defects Found</Label>
                      <Textarea
                        value={inspectionData.defects}
                        onChange={(e) => updateField('defects', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Observations</Label>
                      <Textarea
                        value={inspectionData.observations}
                        onChange={(e) => updateField('observations', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Recommendations</Label>
                      <Textarea
                        value={inspectionData.recommendations}
                        onChange={(e) => updateField('recommendations', e.target.value)}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Remarks</Label>
                      <Textarea
                        value={inspectionData.remarks}
                        onChange={(e) => updateField('remarks', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <div className="flex justify-end gap-3 mb-4 print:hidden">
              <Button onClick={() => setActiveTab('form')} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Edit Form
              </Button>
              <Button onClick={handlePrint} className="bg-[#0F4C81] hover:bg-[#0F4C81]/90">
                <Printer className="h-4 w-4 mr-2" />
                Print Certificate
              </Button>
            </div>

            {/* Certificate Preview */}
            <div ref={printRef} className="document-content-only bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 print:shadow-none print:p-0">
              {/* Header */}
              <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                <h1 className="text-2xl font-bold text-[#0F4C81]">INSPECTION CERTIFICATE</h1>
                <p className="text-lg font-semibold text-slate-600 dark:text-slate-400 mt-1">检验证书</p>
              </div>

              {/* Certificate Info */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div>
                  <p className="text-slate-500">Certificate No.</p>
                  <p className="font-semibold">{inspectionData.certificateNo}</p>
                </div>
                <div>
                  <p className="text-slate-500">Inspection Date</p>
                  <p className="font-semibold">{inspectionData.inspectionDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Inspection Type</p>
                  <p className="font-semibold">{selectedInspectionType?.label}</p>
                </div>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#2E8B57] mb-2">APPLICANT</h3>
                  <p className="font-bold">{inspectionData.applicantName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{inspectionData.applicantAddress}</p>
                  {inspectionData.applicantContact && <p className="text-sm">Contact: {inspectionData.applicantContact}</p>}
                  {inspectionData.applicantPhone && <p className="text-sm">Tel: {inspectionData.applicantPhone}</p>}
                  {inspectionData.applicantEmail && <p className="text-sm">Email: {inspectionData.applicantEmail}</p>}
                </div>
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                  <h3 className="font-semibold text-[#0F4C81] mb-2">SUPPLIER/MANUFACTURER</h3>
                  <p className="font-bold">{inspectionData.supplierName || 'Company Name'}</p>
                  <p className="text-sm whitespace-pre-line">{inspectionData.supplierAddress}</p>
                  <p className="text-sm">{inspectionData.supplierCountry}</p>
                  {inspectionData.supplierContact && <p className="text-sm">Contact: {inspectionData.supplierContact}</p>}
                  {inspectionData.supplierPhone && <p className="text-sm">Tel: {inspectionData.supplierPhone}</p>}
                  {inspectionData.supplierEmail && <p className="text-sm">Email: {inspectionData.supplierEmail}</p>}
                </div>
              </div>

              {/* Product Details */}
              <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">PRODUCT DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Product:</span>
                    <span className="ml-2 font-medium">{inspectionData.productName || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">HS Code:</span>
                    <span className="ml-2 font-medium">{inspectionData.hsCode || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Quantity:</span>
                    <span className="ml-2 font-medium">{inspectionData.quantity.toLocaleString()} {inspectionData.quantityUnit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Batch/Lot:</span>
                    <span className="ml-2 font-medium">{inspectionData.batchLotNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Order Reference */}
              <div className="mb-6 text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500">PO No.:</span>
                    <span className="ml-2">{inspectionData.purchaseOrderNo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Invoice No.:</span>
                    <span className="ml-2">{inspectionData.invoiceNo || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Contract No.:</span>
                    <span className="ml-2">{inspectionData.contractNo || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Inspection Details */}
              <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-semibold text-[#0F4C81] mb-3">INSPECTION DETAILS</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="text-slate-500">Standard:</span>
                    <span className="ml-2">{selectedStandard?.label}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Sample Size:</span>
                    <span className="ml-2">{inspectionData.sampleSize} {inspectionData.sampleUnit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Place:</span>
                    <span className="ml-2">{inspectionData.inspectionPlace || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Defect Rate:</span>
                    <span className="ml-2">{inspectionData.defectsPercentage}%</span>
                  </div>
                </div>
                
                <h4 className="font-medium mb-2">Inspection Items:</h4>
                <div className="flex flex-wrap gap-2">
                  {inspectionData.visualInspection && <Badge variant="outline">Visual</Badge>}
                  {inspectionData.quantityVerification && <Badge variant="outline">Quantity</Badge>}
                  {inspectionData.packagingCheck && <Badge variant="outline">Packaging</Badge>}
                  {inspectionData.labelingCheck && <Badge variant="outline">Labeling</Badge>}
                  {inspectionData.dimensionsCheck && <Badge variant="outline">Dimensions</Badge>}
                  {inspectionData.weightCheck && <Badge variant="outline">Weight</Badge>}
                  {inspectionData.functionalityTest && <Badge variant="outline">Functionality</Badge>}
                  {inspectionData.safetyTest && <Badge variant="outline">Safety</Badge>}
                </div>
              </div>

              {/* Results */}
              <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <h3 className="font-semibold text-[#2E8B57] mb-3">INSPECTION RESULT</h3>
                <div className="text-center py-4">
                  <Badge className={`text-2xl px-6 py-2 ${
                    inspectionData.overallResult === 'passed' ? 'bg-emerald-500' :
                    inspectionData.overallResult === 'failed' ? 'bg-red-500' : 'bg-amber-500'
                  }`}>
                    {inspectionData.overallResult.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Findings */}
              {inspectionData.defects && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Defects Found</h4>
                  <p className="text-sm whitespace-pre-line">{inspectionData.defects}</p>
                </div>
              )}

              {inspectionData.observations && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Observations</h4>
                  <p className="text-sm whitespace-pre-line">{inspectionData.observations}</p>
                </div>
              )}

              {inspectionData.recommendations && (
                <div className="mb-6 p-4 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Recommendations</h4>
                  <p className="text-sm whitespace-pre-line">{inspectionData.recommendations}</p>
                </div>
              )}

              {/* Inspector */}
              <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-sm">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <span className="text-slate-500">Inspection Company:</span>
                    <p className="font-medium">{inspectionData.inspectionCompany || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Inspector:</span>
                    <p className="font-medium">{inspectionData.inspectorName || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Inspector ID:</span>
                    <p className="font-medium">{inspectionData.inspectorId || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 mt-12">
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Inspector's Signature</p>
                  <p className="text-sm text-slate-400 mt-8">Signature & Company Stamp</p>
                </div>
                <div className="border-t border-slate-300 dark:border-slate-600 pt-2">
                  <p className="text-sm text-slate-500">Date</p>
                  <p className="text-sm text-slate-400 mt-8">________________</p>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="mt-8 text-xs text-slate-500 text-center">
                <p>This certificate is issued based on the inspection conducted at the time and place stated above.</p>
                <p className="mt-1">The results apply only to the specific batch/lot inspected.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
