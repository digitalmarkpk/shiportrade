"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Container,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  RefreshCw,
  Copy,
  CheckCheck,
  History,
  Ship,
  BadgeCheck,
  Database,
  BookOpen,
  HelpCircle,
  BarChart3,
  Download,
  Share2,
  Zap,
  Globe,
  Building,
  Calendar,
  Layers,
  Settings,
  Target,
  FileText,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ValidationResult {
  containerNumber: string;
  ownerCode: string;
  categoryIdentifier: string;
  serialNumber: string;
  checkDigit: number;
  calculatedCheckDigit: number;
  isValid: boolean;
  errorType?: string;
  owner?: OwnerInfo;
  specifications?: ContainerSpecs;
}

interface OwnerInfo {
  code: string;
  name: string;
  country: string;
  website: string;
}

interface ContainerSpecs {
  type: string;
  description: string;
  length: string;
  height: string;
  capacity: string;
  maxGrossWeight: string;
  tareWeight: string;
}

interface HistoryItem {
  number: string;
  isValid: boolean;
  timestamp: string;
}

// ISO 6346 owner codes mapping
const ownerCodes: Record<string, OwnerInfo> = {
  "MAEU": { code: "MAEU", name: "Maersk Line", country: "Denmark", website: "www.maersk.com" },
  "MSCU": { code: "MSCU", name: "Mediterranean Shipping Company", country: "Switzerland", website: "www.msc.com" },
  "CMAU": { code: "CMAU", name: "CMA CGM", country: "France", website: "www.cma-cgm.com" },
  "COSU": { code: "COSU", name: "COSCO Shipping", country: "China", website: "www.coscoshipping.com" },
  "HLCU": { code: "HLCU", name: "Hapag-Lloyd", country: "Germany", website: "www.hapag-lloyd.com" },
  "EGLV": { code: "EGLV", name: "Evergreen Line", country: "Taiwan", website: "www.evergreen-line.com" },
  "OOLU": { code: "OOLU", name: "OOCL", country: "Hong Kong", website: "www.oocl.com" },
  "YMLU": { code: "YMLU", name: "Yang Ming Marine", country: "Taiwan", website: "www.yangming.com" },
  "ZIMU": { code: "ZIMU", name: "Zim Integrated Shipping", country: "Israel", website: "www.zim.com" },
  "HMMU": { code: "HMMU", name: "HMM Co. Ltd", country: "South Korea", website: "www.hmm21.com" },
  "ONEU": { code: "ONEU", name: "Ocean Network Express", country: "Singapore", website: "www.one-line.com" },
  "TGHU": { code: "TGHU", name: "Textainer", country: "Bermuda", website: "www.textainer.com" },
  "SEAU": { code: "SEAU", name: "Seaco", country: "Bermuda", website: "www.seaco.com" },
  "TRIU": { code: "TRIU", name: "Triton Container", country: "Bermuda", website: "www.triton.com" },
  "CAIU": { code: "CAIU", name: "Capital Lease", country: "Bermuda", website: "www.capitallease.com" },
};

// Container type codes
const containerTypes: Record<string, ContainerSpecs> = {
  "20G0": { type: "20G0", description: "20' Standard Container", length: "20 ft", height: "8'6\"", capacity: "33.2 m³", maxGrossWeight: "24,000 kg", tareWeight: "2,230 kg" },
  "22G0": { type: "22G0", description: "20' Standard Container", length: "20 ft", height: "8'6\"", capacity: "33.2 m³", maxGrossWeight: "24,000 kg", tareWeight: "2,200 kg" },
  "42G0": { type: "42G0", description: "40' Standard Container", length: "40 ft", height: "8'6\"", capacity: "67.7 m³", maxGrossWeight: "30,480 kg", tareWeight: "3,740 kg" },
  "45G0": { type: "45G0", description: "40' High Cube Container", length: "40 ft", height: "9'6\"", capacity: "76.3 m³", maxGrossWeight: "30,480 kg", tareWeight: "3,900 kg" },
  "22R0": { type: "22R0", description: "20' Refrigerated Container", length: "20 ft", height: "8'6\"", capacity: "28.4 m³", maxGrossWeight: "24,000 kg", tareWeight: "3,080 kg" },
  "45R0": { type: "45R0", description: "40' High Cube Refrigerated", length: "40 ft", height: "9'6\"", capacity: "67.6 m³", maxGrossWeight: "30,480 kg", tareWeight: "4,500 kg" },
  "22U0": { type: "22U0", description: "20' Open Top Container", length: "20 ft", height: "8'6\"", capacity: "32.6 m³", maxGrossWeight: "24,000 kg", tareWeight: "2,350 kg" },
  "42U0": { type: "42U0", description: "40' Open Top Container", length: "40 ft", height: "8'6\"", capacity: "66.1 m³", maxGrossWeight: "30,480 kg", tareWeight: "3,850 kg" },
  "22P0": { type: "22P0", description: "20' Flat Rack", length: "20 ft", height: "8'6\"", capacity: "Platform", maxGrossWeight: "34,000 kg", tareWeight: "2,900 kg" },
  "42P0": { type: "42P0", description: "40' Flat Rack", length: "40 ft", height: "8'6\"", capacity: "Platform", maxGrossWeight: "45,000 kg", tareWeight: "5,500 kg" },
  "22T0": { type: "22T0", description: "20' Tank Container", length: "20 ft", height: "8'6\"", capacity: "24,000 L", maxGrossWeight: "30,480 kg", tareWeight: "3,850 kg" },
};

// ISO 6346 letter-to-number mapping
const letterValues: Record<string, number> = {
  A: 10, B: 12, C: 13, D: 14, E: 15, F: 16, G: 17, H: 18, I: 19,
  J: 20, K: 21, L: 23, M: 24, N: 25, O: 26, P: 27, Q: 28, R: 29,
  S: 30, T: 31, U: 32, V: 34, W: 35, X: 36, Y: 37, Z: 38,
};

// FAQ Data
const FAQS = [
  {
    question: "What is ISO 6346 and why is it important for container numbering?",
    answer: "ISO 6346 is the international standard for container identification and marking, established by the International Organization for Standardization. This standard ensures that every shipping container worldwide has a unique identification number, enabling efficient tracking, documentation, and management across global supply chains. The standard defines the structure, format, and check digit algorithm used to validate container numbers. Compliance with ISO 6346 is mandatory for all containers engaged in international trade, and it forms the backbone of container tracking systems, port operations, and customs procedures globally.",
  },
  {
    question: "How is the check digit calculated in a container number?",
    answer: "The ISO 6346 check digit is calculated using a specific algorithm designed to detect transcription errors. First, each letter in the owner code and category identifier is converted to a numerical value using a standardized mapping (A=10, B=12, C=13, etc., skipping 11 and multiples of 11). Each digit in the serial number keeps its face value. These values are then multiplied by ascending powers of 2 (2⁰, 2¹, 2², ..., 2⁹), and the products are summed. The check digit is the remainder when this sum is divided by 11. If the remainder is 10, the check digit becomes 0. This algorithm can detect all single-digit errors and most transposition errors.",
  },
  {
    question: "What do the different category identifiers (U, J, Z) mean?",
    answer: "The category identifier is the fourth character in an ISO 6346 container number and indicates the type of equipment: 'U' designates a freight container, which is the most common type used for transporting general cargo; 'J' indicates detachable container equipment, such as refrigeration units or generator sets that can be attached to containers; 'Z' identifies chassis or trailers used for transporting containers over road. Understanding these identifiers helps logistics professionals quickly identify equipment types and ensure proper handling and documentation during shipping operations.",
  },
  {
    question: "How can I identify the owner of a container from its number?",
    answer: "The first three letters of a container number represent the owner code, registered with the Bureau International des Containers (BIC) in Paris. This code uniquely identifies the container owner or operator. For example, 'MAE' indicates Maersk Line, 'MSC' indicates Mediterranean Shipping Company, and 'CMA' indicates CMA CGM. You can look up owner information through BIC's online database or use container tracking services. The owner code combined with the category identifier (forming the 4-character prefix) provides complete ownership identification for documentation and tracking purposes.",
  },
  {
    question: "What are the most common container types and their specifications?",
    answer: "The most common container types include: 20' General Purpose (GP) containers with approximately 33.2 CBM capacity and 24,000 kg max gross weight; 40' GP containers with 67.7 CBM and 30,480 kg max gross weight; and 40' High Cube (HC) containers with 76.3 CBM capacity. Specialized containers include refrigerated (reefer) containers for temperature-sensitive cargo, open-top containers for oversized cargo, flat racks for heavy machinery, and tank containers for liquids. Each type has a specific size code in ISO 6346, typically embedded in the serial number prefix, indicating dimensions and features.",
  },
  {
    question: "What should I do if a container number fails validation?",
    answer: "If a container number fails validation, first verify the number was entered correctly, checking for common errors like transposed digits or misread letters (O vs 0, I vs 1). If the number appears correct but still fails, the check digit may have been incorrectly documented or the container may not be ISO-compliant. In such cases, contact the shipping line or container owner to verify the correct number. Never proceed with a container that has an invalid number, as this can cause significant problems with customs clearance, port handling, and cargo tracking. Document the discrepancy and seek clarification before proceeding.",
  },
  {
    question: "How accurate is the check digit algorithm at detecting errors?",
    answer: "The ISO 6346 check digit algorithm is highly effective at detecting errors. It catches 100% of single-digit substitution errors (where one character is replaced with another) and 100% of single transposition errors (where two adjacent characters are swapped). It also detects most multi-error cases, though it cannot catch all possible error combinations. The algorithm's design, using powers of 2 and modulo 11 arithmetic, provides robust error detection while keeping the check digit to a single character. This makes it particularly valuable for catching manual data entry errors common in logistics documentation.",
  },
];

// Pro Tips
const PRO_TIPS = [
  {
    title: "Double-Check Transcription",
    description: "Always verify container numbers character by character. Common errors include confusing O with 0, I with 1, and transposing digits.",
    icon: BadgeCheck,
  },
  {
    title: "Use Check Digit Verification",
    description: "Always validate the check digit before accepting a container number. This catches 100% of single-digit errors and prevents costly documentation mistakes.",
    icon: CheckCircle,
  },
  {
    title: "Document Verification",
    description: "Cross-reference container numbers across multiple documents (BOL, packing list, customs declarations) to ensure consistency throughout the supply chain.",
    icon: FileText,
  },
  {
    title: "Track Owner Information",
    description: "Knowing the container owner helps with tracking, damage claims, and coordination. Keep owner codes handy for quick reference.",
    icon: Building,
  },
  {
    title: "Understand Type Codes",
    description: "Container type codes in the serial number reveal important specs. Learn common codes to quickly identify container capabilities.",
    icon: Layers,
  },
];

// Statistics for visualization
const containerOwnershipData = [
  { name: "Maersk", count: 4200, fill: "#0F4C81" },
  { name: "MSC", count: 3800, fill: "#1a5c91" },
  { name: "CMA CGM", count: 2900, fill: "#2E8B57" },
  { name: "COSCO", count: 2500, fill: "#3d9b67" },
  { name: "Hapag-Lloyd", count: 2100, fill: "#4cab77" },
  { name: "Others", count: 6500, fill: "#5bbb87" },
];

const containerTypeData = [
  { type: "20' GP", count: 45, fullLabel: "20ft General Purpose" },
  { type: "40' GP", count: 30, fullLabel: "40ft General Purpose" },
  { type: "40' HC", count: 18, fullLabel: "40ft High Cube" },
  { type: "Reefer", count: 5, fullLabel: "Refrigerated" },
  { type: "Special", count: 2, fullLabel: "Special Equipment" },
];

export default function ContainerValidator() {
  const [containerNumber, setContainerNumber] = useState("");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("validator");

  const validateContainerNumber = (number: string): ValidationResult => {
    const cleanNumber = number.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Check length
    if (cleanNumber.length !== 11) {
      return {
        containerNumber: number,
        ownerCode: "",
        categoryIdentifier: "",
        serialNumber: "",
        checkDigit: 0,
        calculatedCheckDigit: 0,
        isValid: false,
        errorType: "Invalid length. Container number must be exactly 11 characters.",
      };
    }

    // Extract components
    const ownerCode = cleanNumber.substring(0, 3);
    const categoryIdentifier = cleanNumber.substring(3, 4);
    const serialNumber = cleanNumber.substring(4, 10);
    const checkDigit = parseInt(cleanNumber.substring(10, 11), 10);

    // Validate owner code (must be letters)
    if (!/^[A-Z]{3}$/.test(ownerCode)) {
      return {
        containerNumber: number,
        ownerCode,
        categoryIdentifier,
        serialNumber,
        checkDigit,
        calculatedCheckDigit: 0,
        isValid: false,
        errorType: "Owner code must be 3 letters (A-Z).",
      };
    }

    // Validate category identifier
    if (!["U", "J", "Z"].includes(categoryIdentifier)) {
      return {
        containerNumber: number,
        ownerCode,
        categoryIdentifier,
        serialNumber,
        checkDigit,
        calculatedCheckDigit: 0,
        isValid: false,
        errorType: "Category identifier must be U, J, or Z.",
      };
    }

    // Validate serial number (must be 6 digits)
    if (!/^\d{6}$/.test(serialNumber)) {
      return {
        containerNumber: number,
        ownerCode,
        categoryIdentifier,
        serialNumber,
        checkDigit,
        calculatedCheckDigit: 0,
        isValid: false,
        errorType: "Serial number must be 6 digits.",
      };
    }

    // Calculate check digit using ISO 6346 algorithm
    const fullCode = ownerCode + categoryIdentifier + serialNumber;
    let sum = 0;

    for (let i = 0; i < 10; i++) {
      const char = fullCode[i];
      let value: number;

      if (i < 4) {
        // Letter
        value = letterValues[char] || 0;
      } else {
        // Number
        value = parseInt(char, 10);
      }

      // Multiply by 2^i and add to sum
      sum += value * Math.pow(2, i);
    }

    // Check digit is the remainder when divided by 11, or 0 if remainder is 10
    let calculatedCheckDigit = sum % 11;
    if (calculatedCheckDigit === 10) {
      calculatedCheckDigit = 0;
    }

    const isValid = calculatedCheckDigit === checkDigit;

    // Look up owner information
    const fullOwnerCode = ownerCode + categoryIdentifier;
    const owner = ownerCodes[fullOwnerCode];

    // Try to determine container type from serial number prefix
    const typeCode = serialNumber.substring(0, 3);
    const specs = containerTypes[typeCode];

    return {
      containerNumber: cleanNumber,
      ownerCode,
      categoryIdentifier,
      serialNumber,
      checkDigit,
      calculatedCheckDigit,
      isValid,
      owner,
      specifications: specs,
    };
  };

  const handleValidate = () => {
    const validationResult = validateContainerNumber(containerNumber);
    setResult(validationResult);

    // Add to history
    setHistory((prev) => [
      { number: containerNumber, isValid: validationResult.isValid, timestamp: new Date().toISOString() },
      ...prev.slice(0, 19),
    ]);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generateRandomContainer = () => {
    const owners = Object.keys(ownerCodes);
    const randomOwner = owners[Math.floor(Math.random() * owners.length)];
    const serial = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");

    // Calculate check digit
    const fullCode = randomOwner + serial;
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const char = fullCode[i];
      let value = i < 4 ? letterValues[char] || 0 : parseInt(char, 10);
      sum += value * Math.pow(2, i);
    }
    let checkDigit = sum % 11;
    if (checkDigit === 10) checkDigit = 0;

    setContainerNumber(fullCode + checkDigit);
  };

  const resetForm = () => {
    setContainerNumber("");
    setResult(null);
  };

  // Statistics calculations
  const stats = useMemo(() => {
    const validCount = history.filter((h) => h.isValid).length;
    const invalidCount = history.length - validCount;
    return {
      total: history.length,
      valid: validCount,
      invalid: invalidCount,
      validRate: history.length > 0 ? ((validCount / history.length) * 100).toFixed(1) : "0",
    };
  }, [history]);

  // Chart data for history
  const historyChartData = [
    { name: "Valid", value: stats.valid, fill: "#2E8B57" },
    { name: "Invalid", value: stats.invalid, fill: "#EF4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Ship className="h-3 w-3 mr-1" />
                  Ocean Freight
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <BadgeCheck className="h-3 w-3 mr-1" />
                  Quality Control
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Badge variant="outline" className="border-amber-500 text-amber-600">
                  <Zap className="h-3 w-3 mr-1" />
                  ISO 6346
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Container Number Validator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Validate shipping container numbers using the ISO 6346 standard. Calculate check digits, 
              identify container owners, and verify the integrity of container identification codes for 
              global logistics operations.
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="validator" className="flex items-center gap-2">
            <BadgeCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Validator</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Details</span>
          </TabsTrigger>
          <TabsTrigger value="reference" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reference</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Validator Tab */}
        <TabsContent value="validator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Container className="h-5 w-5 text-[var(--ocean)]" />
                    Container Number Input
                  </CardTitle>
                  <CardDescription>
                    Enter an 11-character container number to validate
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="containerNumber">Container Number</Label>
                    <Input
                      id="containerNumber"
                      value={containerNumber}
                      onChange={(e) => setContainerNumber(e.target.value.toUpperCase())}
                      placeholder="e.g., MAEU1234567"
                      className="h-12 text-lg font-mono"
                      maxLength={11}
                    />
                    <p className="text-xs text-muted-foreground">
                      Format: 3 letters (owner) + 1 letter (category) + 6 digits (serial) + 1 digit (check)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={handleValidate}
                      className="flex-1 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Validate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={generateRandomContainer}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Random
                    </Button>
                  </div>

                  {/* Quick Examples */}
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Examples:</span>
                    {["MAEU1234567", "MSCU7654321", "CMAU9876543"].map((example) => (
                      <button
                        key={example}
                        onClick={() => setContainerNumber(example)}
                        className="text-sm text-[var(--ocean)] hover:underline font-mono"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Validation History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <History className="h-5 w-5 text-[var(--logistics)]" />
                    Validation History
                    <Badge variant="secondary" className="ml-auto">{history.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {history.length > 0 ? (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      <AnimatePresence>
                        {history.slice(0, 10).map((item, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {item.isValid ? (
                                <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                              ) : (
                                <XCircle className="h-5 w-5 text-red-500" />
                              )}
                              <span className="font-mono font-medium">{item.number}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <History className="h-12 w-12 mx-auto mb-4 opacity-30" />
                      <p>No validation history yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Result Panel */}
            <div className="space-y-6">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className={`overflow-hidden border-2 ${result.isValid ? "border-[var(--logistics)]" : "border-red-500"}`}>
                    <div className={`h-2 ${result.isValid ? "bg-[var(--logistics)]" : "bg-red-500"}`} />
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {result.isValid ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-16 h-16 rounded-full bg-[var(--logistics)]/10 flex items-center justify-center"
                            >
                              <CheckCircle2 className="h-10 w-10 text-[var(--logistics)]" />
                            </motion.div>
                          ) : (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                            >
                              <XCircle className="h-10 w-10 text-red-600" />
                            </motion.div>
                          )}
                          <div>
                            <p className="text-3xl font-mono font-bold">{result.containerNumber}</p>
                            <p className={`text-lg font-medium ${result.isValid ? "text-[var(--logistics)]" : "text-red-600"}`}>
                              {result.isValid ? "Valid Container Number" : "Invalid Container Number"}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleCopy(result.containerNumber)}>
                          {copied ? <CheckCheck className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                          Copy
                        </Button>
                      </div>

                      {result.errorType && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-6">
                          <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                            <AlertCircle className="h-5 w-5" />
                            <p className="font-medium">{result.errorType}</p>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20"
                        >
                          <p className="text-sm text-muted-foreground">Owner Code</p>
                          <p className="text-xl font-mono font-bold text-[var(--ocean)]">{result.ownerCode}</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20"
                        >
                          <p className="text-sm text-muted-foreground">Category</p>
                          <p className="text-xl font-mono font-bold text-[var(--logistics)]">{result.categoryIdentifier}</p>
                          <p className="text-xs text-muted-foreground">
                            {result.categoryIdentifier === "U" ? "Freight Container" :
                             result.categoryIdentifier === "J" ? "Detachable Equipment" : "Chassis/Trailer"}
                          </p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800"
                        >
                          <p className="text-sm text-muted-foreground">Serial Number</p>
                          <p className="text-xl font-mono font-bold text-amber-600">{result.serialNumber}</p>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                        >
                          <p className="text-sm text-muted-foreground">Check Digit</p>
                          <div className="flex items-center gap-2">
                            <p className="text-xl font-mono font-bold text-purple-600">{result.checkDigit}</p>
                            {!result.isValid && result.calculatedCheckDigit !== result.checkDigit && (
                              <span className="text-sm text-red-500">(Should be {result.calculatedCheckDigit})</span>
                            )}
                          </div>
                        </motion.div>
                      </div>

                      {/* Owner Info */}
                      {result.owner && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20"
                        >
                          <h4 className="font-semibold text-[var(--ocean)] mb-3 flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            Owner Information
                          </h4>
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Company</p>
                              <p className="font-medium">{result.owner.name}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Country</p>
                              <p className="font-medium">{result.owner.country}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Code</p>
                              <p className="font-mono font-medium">{result.owner.code}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Website</p>
                              <a href={`https://${result.owner.website}`} target="_blank" rel="noopener noreferrer" className="text-[var(--ocean)] hover:underline">
                                {result.owner.website}
                              </a>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* Container Specs */}
                      {result.specifications && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-6 p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20"
                        >
                          <h4 className="font-semibold text-[var(--logistics)] mb-3 flex items-center gap-2">
                            <Layers className="h-4 w-4" />
                            Container Specifications
                          </h4>
                          <div className="grid grid-cols-3 lg:grid-cols-6 gap-4 text-sm">
                            <div>
                              <p className="text-muted-foreground">Type</p>
                              <p className="font-medium">{result.specifications.type}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Description</p>
                              <p className="font-medium">{result.specifications.description}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Length</p>
                              <p className="font-medium">{result.specifications.length}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Height</p>
                              <p className="font-medium">{result.specifications.height}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Max Gross</p>
                              <p className="font-medium">{result.specifications.maxGrossWeight}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Capacity</p>
                              <p className="font-medium">{result.specifications.capacity}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="text-center py-12 text-muted-foreground">
                      <Container className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-medium">No container validated yet</p>
                      <p className="text-sm">Enter a container number to see validation results</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Stats */}
              {history.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                      Validation Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--ocean)]">{stats.total}</div>
                        <div className="text-xs text-muted-foreground">Total Checks</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-[var(--logistics)]">{stats.valid}</div>
                        <div className="text-xs text-muted-foreground">Valid</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-red-500">{stats.invalid}</div>
                        <div className="text-xs text-muted-foreground">Invalid</div>
                      </div>
                      <div className="text-center p-3 bg-muted/30 rounded-lg">
                        <div className="text-2xl font-bold text-amber-500">{stats.validRate}%</div>
                        <div className="text-xs text-muted-foreground">Valid Rate</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Container Owner Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5 text-[var(--ocean)]" />
                  Major Container Owners
                </CardTitle>
                <CardDescription>
                  Leading shipping lines and container leasing companies worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={containerOwnershipData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip formatter={(value: number) => `${value.toLocaleString()} containers`} />
                      <Bar dataKey="count" name="Fleet Size" radius={[0, 4, 4, 0]}>
                        {containerOwnershipData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(ownerCodes).slice(0, 8).map(([code, owner]) => (
                    <div key={code} className="p-2 bg-muted/30 rounded-lg text-sm">
                      <div className="font-mono font-bold text-[var(--ocean)]">{code}</div>
                      <div className="text-muted-foreground truncate">{owner.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Container Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-[var(--logistics)]" />
                  Container Type Distribution
                </CardTitle>
                <CardDescription>
                  Global distribution of container types in service
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={containerTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="count"
                        label={({ type, count }) => `${type}: ${count}%`}
                      >
                        <Cell fill="#0F4C81" />
                        <Cell fill="#2E8B57" />
                        <Cell fill="#3d9b67" />
                        <Cell fill="#4cab77" />
                        <Cell fill="#5bbb87" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {containerTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded" style={{ backgroundColor: ["#0F4C81", "#2E8B57", "#3d9b67", "#4cab77", "#5bbb87"][index] }} />
                        <span className="text-sm">{item.fullLabel}</span>
                      </div>
                      <span className="font-bold">{item.count}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Container Specifications Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5 text-[var(--ocean)]" />
                  Standard Container Specifications
                </CardTitle>
                <CardDescription>
                  Technical specifications for common ISO container types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Type Code</th>
                        <th className="text-left p-2">Description</th>
                        <th className="text-left p-2">Length</th>
                        <th className="text-left p-2">Height</th>
                        <th className="text-left p-2">Capacity</th>
                        <th className="text-left p-2">Max Gross</th>
                        <th className="text-left p-2">Tare</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(containerTypes).map(([code, spec]) => (
                        <tr key={code} className="border-b border-muted hover:bg-muted/30">
                          <td className="p-2 font-mono font-bold text-[var(--ocean)]">{code}</td>
                          <td className="p-2">{spec.description}</td>
                          <td className="p-2">{spec.length}</td>
                          <td className="p-2">{spec.height}</td>
                          <td className="p-2">{spec.capacity}</td>
                          <td className="p-2">{spec.maxGrossWeight}</td>
                          <td className="p-2">{spec.tareWeight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reference Tab */}
        <TabsContent value="reference" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* ISO 6346 Format */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  ISO 6346 Container Number Format
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-[var(--ocean)]/5 rounded-lg text-center border border-[var(--ocean)]/20"
                  >
                    <p className="text-2xl font-mono font-bold text-[var(--ocean)]">ABC</p>
                    <p className="text-sm text-muted-foreground mt-1">Owner Code</p>
                    <p className="text-xs text-muted-foreground">3 Letters</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-[var(--logistics)]/5 rounded-lg text-center border border-[var(--logistics)]/20"
                  >
                    <p className="text-2xl font-mono font-bold text-[var(--logistics)]">U</p>
                    <p className="text-sm text-muted-foreground mt-1">Category</p>
                    <p className="text-xs text-muted-foreground">U, J, or Z</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center border border-amber-200 dark:border-amber-800"
                  >
                    <p className="text-2xl font-mono font-bold text-amber-600">123456</p>
                    <p className="text-sm text-muted-foreground mt-1">Serial Number</p>
                    <p className="text-xs text-muted-foreground">6 Digits</p>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center border border-purple-200 dark:border-purple-800"
                  >
                    <p className="text-2xl font-mono font-bold text-purple-600">7</p>
                    <p className="text-sm text-muted-foreground mt-1">Check Digit</p>
                    <p className="text-xs text-muted-foreground">0-9</p>
                  </motion.div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-semibold mb-3">Category Identifiers</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="font-mono font-bold bg-[var(--ocean)] text-white px-2 py-0.5 rounded">U</span>
                      <span>Freight Container</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="font-mono font-bold bg-[var(--logistics)] text-white px-2 py-0.5 rounded">J</span>
                      <span>Detachable Equipment</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-lg">
                      <span className="font-mono font-bold bg-purple-500 text-white px-2 py-0.5 rounded">Z</span>
                      <span>Chassis/Trailer</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Check Digit Algorithm */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[var(--logistics)]" />
                  Check Digit Algorithm
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg text-sm space-y-3">
                  <p className="font-semibold">ISO 6346 Check Digit Calculation:</p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Convert each letter to its numerical equivalent (A=10, B=12, C=13...)</li>
                    <li>Multiply each character value by 2^n (where n is position 0-9)</li>
                    <li>Sum all the products</li>
                    <li>Divide by 11 and take the remainder</li>
                    <li>If remainder is 10, check digit becomes 0</li>
                  </ol>
                </div>

                <div className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20">
                  <p className="text-sm">
                    <strong className="text-[var(--logistics)]">Formula:</strong> Check Digit = (Σ value × 2^position) mod 11
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        <th className="p-1 text-left">Position</th>
                        <th className="p-1 text-center">0</th>
                        <th className="p-1 text-center">1</th>
                        <th className="p-1 text-center">2</th>
                        <th className="p-1 text-center">3</th>
                        <th className="p-1 text-center">4</th>
                        <th className="p-1 text-center">5</th>
                        <th className="p-1 text-center">6</th>
                        <th className="p-1 text-center">7</th>
                        <th className="p-1 text-center">8</th>
                        <th className="p-1 text-center">9</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-1 text-muted-foreground">Multiplier</td>
                        <td className="p-1 text-center font-mono">2⁰</td>
                        <td className="p-1 text-center font-mono">2¹</td>
                        <td className="p-1 text-center font-mono">2²</td>
                        <td className="p-1 text-center font-mono">2³</td>
                        <td className="p-1 text-center font-mono">2⁴</td>
                        <td className="p-1 text-center font-mono">2⁵</td>
                        <td className="p-1 text-center font-mono">2⁶</td>
                        <td className="p-1 text-center font-mono">2⁷</td>
                        <td className="p-1 text-center font-mono">2⁸</td>
                        <td className="p-1 text-center font-mono">2⁹</td>
                      </tr>
                      <tr>
                        <td className="p-1 text-muted-foreground">Value</td>
                        <td className="p-1 text-center font-mono">1</td>
                        <td className="p-1 text-center font-mono">2</td>
                        <td className="p-1 text-center font-mono">4</td>
                        <td className="p-1 text-center font-mono">8</td>
                        <td className="p-1 text-center font-mono">16</td>
                        <td className="p-1 text-center font-mono">32</td>
                        <td className="p-1 text-center font-mono">64</td>
                        <td className="p-1 text-center font-mono">128</td>
                        <td className="p-1 text-center font-mono">256</td>
                        <td className="p-1 text-center font-mono">512</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Letter Value Reference */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-[var(--ocean)]" />
                  ISO 6346 Letter-to-Number Mapping
                </CardTitle>
                <CardDescription>
                  Conversion table for letters in owner code and category identifier
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-13 gap-2 text-center">
                  {Object.entries(letterValues).map(([letter, value]) => (
                    <div key={letter} className="p-2 bg-muted/30 rounded-lg">
                      <div className="font-mono font-bold text-[var(--ocean)]">{letter}</div>
                      <div className="text-sm text-muted-foreground">{value}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-4">
                  Note: Values skip 11 and multiples of 11 (22, 33, 44...) to ensure the check digit algorithm works correctly.
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Pro Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-amber-500" />
                  Pro Tips for Container Validation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Understanding Container Numbers */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Container Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  The ISO 6346 standard establishes a globally unique identification system for freight containers. 
                  Each container number consists of 11 characters: a 4-character prefix (owner code + category identifier), 
                  a 6-digit serial number, and a single check digit. This standardized format enables seamless tracking 
                  and documentation across international borders, shipping lines, and logistics providers.
                </p>
                <p>
                  The owner code is assigned by the Bureau International des Containers (BIC) in Paris, ensuring that 
                  no two container operators share the same prefix. The category identifier immediately follows the 
                  owner code and distinguishes between freight containers (U), detachable equipment (J), and chassis 
                  or trailers (Z). This classification system helps logistics professionals quickly identify the type 
                  of equipment they are handling.
                </p>
                <p>
                  The check digit is perhaps the most crucial component for data integrity. Calculated using a 
                  sophisticated algorithm involving powers of 2 and modulo 11 arithmetic, it detects 100% of 
                  single-digit substitution errors and all single transposition errors. This mathematical safeguard 
                  prevents countless documentation errors that could otherwise disrupt global supply chains, cause 
                  customs delays, or result in cargo misrouting.
                </p>
                <Separator />
                <div className="p-3 bg-[var(--ocean)]/5 rounded-lg">
                  <h4 className="font-semibold text-foreground mb-2">Key Takeaway</h4>
                  <p className="text-xs">
                    Always validate container numbers before processing shipments. The check digit catches transcription 
                    errors that could lead to significant delays, additional costs, and compliance issues.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* The Importance of Validation */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[var(--logistics)]" />
                  The Importance of Container Number Validation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Container number validation is a critical quality control measure in international logistics. Every year, 
                  millions of containers move across oceans and continents, and each one must be accurately identified at 
                  every touchpoint—from origin warehouse to port terminal, from vessel to destination, and through customs 
                  clearance. A single digit error can cascade into serious problems: cargo could be loaded onto the wrong 
                  vessel, customs declarations might be rejected, and valuable time could be lost tracking down discrepancies.
                </p>
                <p>
                  The ISO 6346 check digit algorithm serves as a first line of defense against these errors. When a container 
                  number is entered into any system—whether it's a shipping line's booking platform, a port's terminal 
                  operating system, or a customs declaration portal—the check digit should be validated immediately. If the 
                  calculated check digit doesn't match the provided one, the system can flag the error before it propagates 
                  further downstream.
                </p>
                <p>
                  Beyond error prevention, container number validation also supports security and compliance objectives. 
                  Accurate container identification is essential for supply chain security programs like C-TPAT and AEO 
                  certification. Customs authorities rely on valid container numbers to track cargo movements and ensure 
                  compliance with import/export regulations. By validating container numbers as part of your standard 
                  operating procedures, you contribute to a more secure and efficient global supply chain while protecting 
                  your business from costly errors and compliance violations.
                </p>
                <div className="grid md:grid-cols-3 gap-4 mt-4">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-5 w-5 text-red-500 mb-2" />
                    <h4 className="font-semibold text-red-700 dark:text-red-300">Without Validation</h4>
                    <p className="text-xs mt-1">Documentation errors, shipment delays, customs rejections, cargo misrouting</p>
                  </div>
                  <div className="p-4 bg-[var(--logistics)]/5 rounded-lg border border-[var(--logistics)]/20">
                    <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] mb-2" />
                    <h4 className="font-semibold text-[var(--logistics)]">With Validation</h4>
                    <p className="text-xs mt-1">Error detection, streamlined processing, compliance assurance, accurate tracking</p>
                  </div>
                  <div className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20">
                    <Globe className="h-5 w-5 text-[var(--ocean)] mb-2" />
                    <h4 className="font-semibold text-[var(--ocean)]">Global Impact</h4>
                    <p className="text-xs mt-1">Industry standard compliance, supply chain security, international trade facilitation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Common questions about container number validation and ISO 6346 standard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border rounded-lg px-4"
                  >
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <Badge variant="outline" className="shrink-0">Q{index + 1}</Badge>
                        <span>{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--logistics)]" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Globe className="h-5 w-5 text-[var(--ocean)] mb-2" />
                  <h4 className="font-semibold">BIC Register</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Official registry of container owner codes maintained by Bureau International des Containers
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <FileText className="h-5 w-5 text-[var(--logistics)] mb-2" />
                  <h4 className="font-semibold">ISO 6346 Standard</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    International standard for freight container identification and marking
                  </p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <Ship className="h-5 w-5 text-amber-500 mb-2" />
                  <h4 className="font-semibold">Container Tracking</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    Real-time container tracking services offered by major shipping lines
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
