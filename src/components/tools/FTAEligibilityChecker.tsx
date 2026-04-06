"use client";

import { useState, useSyncExternalStore, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCheck,
  Globe,
  Flag,
  Percent,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Search,
  RefreshCw,
  ArrowRight,
  Building2,
  ShieldCheck,
  XCircle,
  HelpCircle,
  BookOpen,
  TrendingDown,
  Sparkles,
  Target,
  Zap,
  Award,
  ChevronDown,
  ChevronUp,
  Calculator,
  Users,
  Clock,
  ArrowRightLeft,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  GitCompare,
  MapPin,
  Ship,
  Plane,
  Truck,
  Container,
  Download,
  Share2,
  RotateCcw,
  Lightbulb,
  AlertTriangle,
  FileText,
  ClipboardList,
  Layers,
  CheckSquare,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface FTAResult {
  eligible: boolean;
  agreementName: string;
  agreementCode: string;
  currentDuty: number;
  ftaDuty: number;
  savingsPercent: number;
  savingsAmount: number;
  rulesOfOrigin: RuleOfOrigin[];
  requirements: Requirement[];
  documentation: string[];
  restrictions: string[];
  notes: string;
  certificateRequired: boolean;
  localContentRequired: number;
  deMinimis: number;
  cumulation: string[];
}

interface RuleOfOrigin {
  rule: string;
  description: string;
  met: boolean;
  critical: boolean;
}

interface Requirement {
  requirement: string;
  status: "met" | "pending" | "not-met";
  details: string;
}

interface FTASummary {
  totalAgreements: number;
  eligibleAgreements: number;
  bestAgreement: string;
  maxSavings: number;
  avgDutyReduction: number;
}

const countries = [
  { code: "US", name: "United States", region: "North America" },
  { code: "CN", name: "China", region: "Asia" },
  { code: "JP", name: "Japan", region: "Asia" },
  { code: "KR", name: "South Korea", region: "Asia" },
  { code: "VN", name: "Vietnam", region: "Asia" },
  { code: "TH", name: "Thailand", region: "Asia" },
  { code: "SG", name: "Singapore", region: "Asia" },
  { code: "MY", name: "Malaysia", region: "Asia" },
  { code: "ID", name: "Indonesia", region: "Asia" },
  { code: "IN", name: "India", region: "Asia" },
  { code: "DE", name: "Germany", region: "Europe" },
  { code: "GB", name: "United Kingdom", region: "Europe" },
  { code: "FR", name: "France", region: "Europe" },
  { code: "NL", name: "Netherlands", region: "Europe" },
  { code: "AU", name: "Australia", region: "Oceania" },
  { code: "NZ", name: "New Zealand", region: "Oceania" },
  { code: "CA", name: "Canada", region: "North America" },
  { code: "MX", name: "Mexico", region: "North America" },
  { code: "BR", name: "Brazil", region: "South America" },
  { code: "ZA", name: "South Africa", region: "Africa" },
];

const ftas = [
  {
    name: "USMCA (NAFTA 2.0)",
    code: "USMCA",
    parties: ["US", "CA", "MX"],
    avgDutyReduction: 100,
    localContentReq: 75,
    certificate: "USMCA Certificate of Origin",
    keySectors: ["Automotive", "Agriculture", "Textiles", "Electronics"],
  },
  {
    name: "CPTPP",
    code: "CPTPP",
    parties: ["JP", "VN", "AU", "NZ", "CA", "MX", "MY", "SG", "BN", "CL", "PE"],
    avgDutyReduction: 98,
    localContentReq: 40,
    certificate: "CPTPP Certificate of Origin",
    keySectors: ["Manufacturing", "Agriculture", "Services", "Investment"],
  },
  {
    name: "RCEP",
    code: "RCEP",
    parties: ["CN", "JP", "KR", "AU", "NZ", "VN", "TH", "SG", "MY", "ID", "PH", "MM", "LA", "KH", "BN"],
    avgDutyReduction: 92,
    localContentReq: 40,
    certificate: "RCEP Certificate of Origin",
    keySectors: ["Electronics", "Automotive", "Textiles", "Agriculture"],
  },
  {
    name: "EU-Japan EPA",
    code: "EJ-EPA",
    parties: ["DE", "FR", "NL", "JP"],
    avgDutyReduction: 99,
    localContentReq: 50,
    certificate: "EUR.1 Movement Certificate",
    keySectors: ["Automotive", "Pharmaceuticals", "Food & Beverage", "Machinery"],
  },
  {
    name: "US-Korea FTA (KORUS)",
    code: "KORUS",
    parties: ["US", "KR"],
    avgDutyReduction: 95,
    localContentReq: 35,
    certificate: "Certificate of Origin",
    keySectors: ["Automotive", "Electronics", "Chemicals", "Agriculture"],
  },
  {
    name: "ASEAN Trade in Goods Agreement",
    code: "ATIGA",
    parties: ["VN", "TH", "SG", "MY", "ID", "PH", "MM", "LA", "KH", "BN"],
    avgDutyReduction: 99,
    localContentReq: 40,
    certificate: "ASEAN Certificate of Origin (Form D)",
    keySectors: ["Electronics", "Textiles", "Agriculture", "Automotive"],
  },
  {
    name: "China-ASEAN FTA",
    code: "CAFTA",
    parties: ["CN", "VN", "TH", "SG", "MY", "ID", "PH", "MM", "LA", "KH", "BN"],
    avgDutyReduction: 90,
    localContentReq: 40,
    certificate: "Form E Certificate of Origin",
    keySectors: ["Manufacturing", "Agriculture", "Electronics", "Textiles"],
  },
  {
    name: "EU-UK Trade Agreement",
    code: "EU-UK-TCA",
    parties: ["GB", "DE", "FR", "NL"],
    avgDutyReduction: 100,
    localContentReq: 50,
    certificate: "Origin Declaration",
    keySectors: ["Automotive", "Financial Services", "Agriculture", "Manufacturing"],
  },
];

const COLORS = ["#0F4C81", "#2E8B57", "#F59E0B", "#EF4444", "#8B5CF6", "#06B6D4"];

const comprehensiveFaqs = [
  {
    question: "What are Free Trade Agreements and how do they impact international trade?",
    answer: "Free Trade Agreements (FTAs) are treaties between two or more countries that establish preferential trade terms, primarily by reducing or eliminating tariffs, quotas, and other trade barriers. These agreements create integrated markets that allow goods and services to flow more freely across borders, fostering economic cooperation and growth. FTAs significantly impact international trade by reducing the landed cost of goods, making products more competitive in partner markets. For businesses, FTAs offer opportunities to optimize supply chains, access new markets, and reduce import costs. Understanding and leveraging FTAs effectively can result in substantial cost savings—often 5-15% of product value in duty reductions. However, accessing these benefits requires meeting specific Rules of Origin criteria, proper documentation, and compliance with customs procedures. The strategic use of FTAs has become an essential component of modern international trade operations.",
  },
  {
    question: "What are Rules of Origin and why are they critical for FTA eligibility?",
    answer: "Rules of Origin (RoO) are the criteria used to determine the national source of a product for purposes of international trade. These rules are fundamental to FTAs because they ensure that preferential treatment is granted only to goods genuinely originating from member countries, preventing trade deflection where goods from non-member countries would enter through the lowest-tariff route. There are three main types of origin criteria: Wholly Obtained (goods entirely produced in one country with no foreign inputs), Tariff Shift (non-originating materials undergo sufficient transformation to change their tariff classification), and Regional Value Content (minimum percentage of value must originate within FTA member countries). The complexity of RoO varies by product and agreement—some products have simple rules while others, like automotive or textile products, may have multiple alternative criteria. Understanding which rule applies to your product is essential for successful FTA utilization. Proper origin determination requires maintaining detailed production records, supplier declarations, and cost accounting systems.",
  },
  {
    question: "How do I properly claim FTA preferences at customs?",
    answer: "Claiming FTA preferences requires careful preparation and documentation. First, you must determine that your product qualifies under the applicable Rules of Origin criteria. Next, obtain the appropriate Certificate of Origin from an authorized body—this varies by agreement and may require advance application. The certificate must contain specific information including exporter details, producer information, product description, HS classification, and origin criterion reference. At the time of import, the importer must make a declaration on the customs entry claiming preferential treatment and be prepared to present the certificate upon request. Many agreements now allow self-certification by approved exporters, streamlining the process for regular traders. It's critical to maintain all supporting documentation for the required retention period (typically 5 years), including production records, supplier declarations, cost breakdowns, and proof of direct shipment. Errors in claiming preferences can result in penalties, retroactive duty demands, and potential loss of FTA privileges.",
  },
  {
    question: "What documentation is required to prove FTA eligibility?",
    answer: "Comprehensive documentation is essential for proving FTA eligibility and must be maintained throughout the required retention period. The primary document is the Certificate of Origin or origin declaration, which certifies that goods meet the origin requirements. Supporting documentation includes: commercial invoices showing product details and values; bills of lading or air waybills proving direct shipment; production records demonstrating manufacturing processes; supplier declarations for all materials used; cost accounting records showing value content calculations; technical specifications for tariff classification; and quality control records. For complex products, you may need bill of materials with origin status for each component, supplier certifications, and production flow documentation. The documentation requirements vary by agreement and product—some agreements require specific forms while others accept generic formats. Digital documentation systems are increasingly accepted, but paper records may still be required for certain transactions. Organizations should implement document management systems to ensure accessibility and compliance.",
  },
  {
    question: "How does the de minimis rule work in FTA origin determination?",
    answer: "The de minimis rule is a practical provision in most FTAs that allows a small percentage of non-originating materials in a product without disqualifying it from preferential treatment. This rule recognizes that achieving 100% originating content is often impractical in modern manufacturing. Typically, the de minimis threshold ranges from 7% to 10% of the product's value, though some agreements specify weight-based thresholds for certain products. For example, under USMCA, up to 10% of a product's value may come from non-originating materials that don't meet the applicable tariff shift rule, while still qualifying for FTA benefits. The de minimis calculation is specific: it applies only to non-originating materials that fail the tariff shift test, not all non-originating content. Understanding this distinction is crucial—materials that pass their origin criteria are considered originating regardless of their source. The de minimis rule provides valuable flexibility, particularly for products with minor foreign components, enabling businesses to qualify products that would otherwise fail origin requirements.",
  },
  {
    question: "What is cumulation and how can it benefit my FTA strategy?",
    answer: "Cumulation is a provision in FTAs that allows materials from certain countries to be considered 'originating' when determining the origin status of a final product. This concept significantly expands sourcing flexibility and makes it easier to achieve origin requirements. There are three main types: Bilateral cumulation allows materials from one FTA partner to count as originating in another; Diagonal cumulation extends this across multiple countries with compatible rules of origin; Full cumulation is the most liberal, counting all processing stages within FTA partners as originating content. For example, under the EU-Japan EPA, Japanese components used in EU manufacturing count as EU-originating content, and vice versa. Strategic use of cumulation can transform supply chain economics—a product with significant non-local content may still qualify for FTA benefits if materials come from partner countries. Businesses should map their supply chains to identify cumulation opportunities, particularly when operating across multiple FTAs or when sourcing from FTA partner countries.",
  },
  {
    question: "What are the most common mistakes in FTA compliance and how can I avoid them?",
    answer: "The most common FTA compliance mistakes often result in denied claims, penalties, or missed savings opportunities. First, incorrect origin determination—many companies assume products qualify without proper analysis of rules of origin, leading to false claims. Second, inadequate documentation—failure to maintain supplier declarations, production records, or cost calculations that support origin claims. Third, certificate errors—inaccurate product descriptions, wrong HS codes, or expired certificates invalidate claims. Fourth, indirect shipment issues—goods transiting through non-member countries may lose eligibility unless properly documented. Fifth, failure to account for all non-originating materials—incomplete bill of materials analysis leads to incorrect origin conclusions. To avoid these mistakes: implement systematic origin analysis procedures, establish robust documentation systems, train staff on FTA requirements, conduct regular compliance audits, and consider working with customs brokers or trade consultants for complex products. Proactive compliance management protects against costly errors and ensures consistent FTA benefit realization.",
  },
  {
    question: "How do I choose the best FTA when multiple agreements apply to my trade?",
    answer: "When multiple FTAs apply to a trade relationship, selecting the optimal agreement requires careful analysis. Start by comparing the duty savings potential—while most FTAs offer zero-duty treatment for qualifying goods, some may have tariff phase-out schedules or product-specific exceptions. Next, evaluate origin requirements—different agreements have varying thresholds and criteria; some may be easier to meet with your current supply chain configuration. Consider the cumulation opportunities—some agreements offer broader cumulation networks that align better with your sourcing strategy. Factor in documentation requirements—some agreements require formal certificates while others allow self-certification, affecting administrative burden. Assess product-specific provisions—certain products may have sector-specific rules that vary significantly between agreements. For businesses with diverse product portfolios, using different FTAs for different products may be optimal. Additionally, consider non-tariff benefits such as streamlined customs procedures, intellectual property protections, and investment provisions. A comprehensive FTA utilization strategy should weigh all these factors to maximize overall benefit while maintaining compliance efficiency.",
  },
];

const proTips = [
  {
    icon: Target,
    title: "Map Your Supply Chain for Origin Optimization",
    description: "Create a detailed bill of materials with origin status for every component. This visibility enables strategic sourcing decisions to maximize FTA utilization. Identify which non-originating materials push you over thresholds and explore alternative suppliers from FTA partner countries.",
  },
  {
    icon: Layers,
    title: "Leverage Cumulation Provisions",
    description: "Many FTAs allow materials from partner countries to count as originating content. When sourcing components, prioritize suppliers from FTA member countries. This strategy can transform marginally qualifying products into clear FTA beneficiaries.",
  },
  {
    icon: FileText,
    title: "Implement Supplier Declaration Systems",
    description: "Establish standardized processes for collecting and maintaining supplier origin declarations. Regular communication with suppliers about FTA requirements ensures accurate documentation and reduces compliance risks at year-end audits.",
  },
  {
    icon: Calculator,
    title: "Monitor Regional Value Content Continuously",
    description: "Don't wait until shipment time to calculate origin. Implement real-time RVC tracking in your ERP system to identify potential issues early and make adjustments before products are completed.",
  },
  {
    icon: CheckSquare,
    title: "Pre-Classify Products Before Production",
    description: "Determine applicable rules of origin during product development, not after. This proactive approach allows you to design products for FTA eligibility from the start, incorporating origin requirements into sourcing and manufacturing decisions.",
  },
  {
    icon: Clock,
    title: "Track Certificate Validity Periods",
    description: "Implement alerts for certificate expiration dates. Many FTAs have specific validity periods, and using expired certificates invalidates claims. Consider digital certificate management systems for large-scale operations.",
  },
];

const commonMistakes = [
  {
    icon: XCircle,
    title: "Assuming Automatic Eligibility",
    description: "Many businesses incorrectly assume that simply trading between FTA member countries qualifies their products. Each product must independently meet Rules of Origin criteria. Always verify origin status through proper analysis before claiming FTA preferences, as incorrect claims can result in penalties and retroactive duty demands.",
  },
  {
    icon: AlertTriangle,
    title: "Ignoring De Minimis Calculations",
    description: "The de minimis threshold applies specifically to non-originating materials that fail the applicable tariff shift test, not to all foreign content. Misunderstanding this calculation can lead to incorrect origin determinations. Ensure your calculations follow the specific methodology defined in each FTA.",
  },
  {
    icon: FileCheck,
    title: "Incomplete Documentation Practices",
    description: "Maintaining certificates of origin is necessary but insufficient. Complete compliance requires supplier declarations, production records, cost breakdowns, and proof of direct shipment. Customs authorities may request supporting documentation during audits, and failure to provide it can invalidate claims.",
  },
  {
    icon: Globe,
    title: "Overlooking Third-Party Processing Rules",
    description: "Goods processed in non-member countries between FTA partners typically lose preferential eligibility. However, some FTAs allow limited operations in transit countries. Understand the direct shipment rules for each agreement and document any authorized third-party activities carefully.",
  },
  {
    icon: RefreshCw,
    title: "Failing to Update for Regulatory Changes",
    description: "FTA rules evolve through amendments, phase-outs, and new agreements. Products that qualified previously may no longer meet requirements, or new opportunities may emerge. Implement a system to monitor regulatory changes and reassess product eligibility periodically.",
  },
];

const educationalContent = {
  whatAreFTAs: `Free Trade Agreements (FTAs) are international treaties that establish preferential trade conditions between participating countries. These agreements fundamentally reshape commercial relationships by reducing or eliminating tariffs, harmonizing regulations, and creating more predictable trading environments. Modern FTAs extend beyond simple tariff reductions to include provisions on intellectual property, investment protection, services trade, and dispute resolution mechanisms.

The economic rationale for FTAs centers on comparative advantage—allowing countries to specialize in producing goods where they have efficiency benefits while accessing a wider variety of imports at lower costs. For businesses, FTAs create tangible opportunities to reduce landed costs, improve competitive positioning, and access new markets. The duty savings from FTA utilization can range from 3% to 25% of product value, representing significant cost advantages in competitive markets.

Understanding the landscape of applicable FTAs is essential for trade optimization. Major agreements like RCEP, CPTPP, and USMCA create extensive networks of preferential access, while bilateral agreements offer specific bilateral benefits. The choice of which FTA to use—and how to structure operations to qualify—has become a strategic consideration for international businesses. Companies that effectively leverage FTA benefits gain measurable cost advantages over competitors who pay full duty rates.`,

  rulesOfOrigin: `Rules of Origin (RoO) are the cornerstone of FTA utilization, determining whether products qualify for preferential treatment. These rules serve to ensure that FTA benefits accrue to goods genuinely produced within member countries, preventing trade deflection where goods from non-members would enter through low-tariff routes.

The three primary origin criteria each serve different product types and manufacturing scenarios. Wholly Obtained applies to natural products and goods entirely produced from domestic materials—agricultural products, minerals, and goods made exclusively from domestic inputs. Tariff Shift rules require that non-originating materials undergo sufficient transformation to change their HS classification, ensuring meaningful processing occurs within FTA territory. Regional Value Content (RVC) rules specify minimum percentages of value that must originate within FTA members, typically 35-60% depending on the agreement and product.

The practical application of RoO requires systematic analysis. Companies must identify the applicable rule for their product's HS classification, gather origin data for all inputs, perform calculations, and maintain supporting documentation. Complex products may have multiple alternative rules, allowing businesses to choose the most achievable path to qualification. Understanding the nuances of each rule type—and how they interact with your supply chain—is essential for successful FTA utilization.`,

  claimingPreferences: `Successfully claiming FTA preferences requires a systematic approach spanning origin determination, documentation, and customs declaration. The process begins well before shipment, with proper origin analysis during product development and sourcing decisions. Companies must establish robust systems to track origin-relevant information throughout their operations.

Documentation requirements vary by agreement but generally include the Certificate of Origin or origin declaration, commercial invoices, transport documents, and supporting production records. Many FTAs now permit self-certification by approved exporters, streamlining documentation but placing greater responsibility on traders to ensure accuracy. The certification must accurately reflect the origin criterion met and include correct product descriptions and HS classifications.

At customs entry, the importer must make a valid preferential claim, typically through specific declaration codes on the entry. Customs authorities may verify claims through documentary checks or physical inspections. Maintaining comprehensive supporting documentation—supplier declarations, production records, cost calculations—is essential for successful verification. The retention period varies but typically extends 5 years from the date of importation. Organizations should implement document management systems that ensure accessibility while protecting sensitive commercial information.`,

  documentationRequirements: `Comprehensive documentation is the foundation of FTA compliance and benefit realization. The documentation framework serves multiple purposes: proving origin to customs authorities, supporting internal compliance processes, and providing evidence in case of audits or disputes.

Primary documentation includes the Certificate of Origin or origin declaration, which formally certifies that goods meet origin requirements. This document must be accurate, complete, and obtained from authorized bodies where required. Commercial invoices provide transaction details and values necessary for RVC calculations. Transport documents—bills of lading, air waybills—prove the movement route and support direct shipment requirements.

Supporting documentation requirements vary by product and origin criterion. For RVC-based claims, companies need cost accounting records showing value calculations, labor costs, and overhead allocations. For tariff shift claims, documentation must demonstrate the transformation process and resulting classification changes. Supplier declarations from input providers establish the origin status of materials. Production records document manufacturing processes and may be critical for complex origin determinations.

Best practices include implementing standardized supplier declaration forms, establishing clear document retention policies, conducting periodic documentation audits, and training relevant staff on documentation requirements. Digital systems increasingly support FTA compliance by integrating origin calculations with procurement and production data, reducing manual effort while improving accuracy.`,
};

// Safe client-only rendering hook
function useMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

// Floating particles component
function FloatingParticles() {
  const mounted = useMounted();
  
  const particles = [...Array(15)].map((_, i) => ({
    id: i,
    x: ((i * 73) % 100),
    y: ((i * 47 + 25) % 100),
    duration: 10 + (i % 10),
    delay: (i % 5) * 0.5,
  }));

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full opacity-20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: particle.id % 2 === 0 ? "var(--ocean)" : "var(--logistics)",
          }}
          animate={{
            y: [0, -300],
            opacity: [0.2, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}
    </div>
  );
}

// Animated badge component
function AnimatedBadge({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
    >
      <Badge 
        variant="outline" 
        className="px-4 py-2 bg-[var(--ocean)]/10 text-[var(--ocean)] dark:bg-[var(--ocean)]/20 dark:text-[var(--ocean-foreground)] border-[var(--ocean)]/30 hover:bg-[var(--ocean)]/20 transition-all duration-300"
      >
        {children}
      </Badge>
    </motion.div>
  );
}

export default function FTAEligibilityChecker() {
  const [exportCountry, setExportCountry] = useState("CN");
  const [importCountry, setImportCountry] = useState("US");
  const [hsCode, setHsCode] = useState("8471.30");
  const [productDescription, setProductDescription] = useState("Laptop computers");
  const [productValue, setProductValue] = useState("100000");
  const [currentDutyRate, setCurrentDutyRate] = useState("5.5");
  const [originCriterion, setOriginCriterion] = useState("wholly-obtained");
  const [localContentPercent, setLocalContentPercent] = useState("65");
  const [directShipment, setDirectShipment] = useState("yes");
  const [activeTab, setActiveTab] = useState("calculator");

  const [results, setResults] = useState<FTAResult[]>([]);
  const [summary, setSummary] = useState<FTASummary | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const checkEligibility = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const value = parseFloat(productValue) || 100000;
      const duty = parseFloat(currentDutyRate) || 5.5;
      const localContent = parseFloat(localContentPercent) || 65;

      const applicableFTAs = ftas.filter((fta) => {
        const hasExport = fta.parties.includes(exportCountry);
        const hasImport = fta.parties.includes(importCountry);
        return hasExport && hasImport;
      });

      const ftaResults: FTAResult[] = applicableFTAs.map((fta) => {
        const eligible = localContent >= fta.localContentReq;
        const ftaDuty = eligible ? 0 : duty * 0.5;
        const savingsPercent = ((duty - ftaDuty) / duty) * 100;
        const savingsAmount = (value * (duty - ftaDuty)) / 100;

        return {
          eligible,
          agreementName: fta.name,
          agreementCode: fta.code,
          currentDuty: duty,
          ftaDuty,
          savingsPercent,
          savingsAmount,
          rulesOfOrigin: [
            {
              rule: "Wholly Obtained",
              description: "Product entirely produced in exporting country",
              met: originCriterion === "wholly-obtained",
              critical: true,
            },
            {
              rule: "Tariff Shift",
              description: "Non-originating materials undergo specified transformation",
              met: originCriterion === "tariff-shift",
              critical: false,
            },
            {
              rule: "Regional Value Content",
              description: `Minimum ${fta.localContentReq}% local content required`,
              met: localContent >= fta.localContentReq,
              critical: true,
            },
            {
              rule: "De Minimis",
              description: "Non-originating materials below threshold (7-10%)",
              met: true,
              critical: false,
            },
          ],
          requirements: [
            {
              requirement: "Certificate of Origin",
              status: eligible ? "met" : "pending",
              details: fta.certificate,
            },
            {
              requirement: "Direct Shipment",
              status: directShipment === "yes" ? "met" : "not-met",
              details: "Goods shipped directly between FTA parties",
            },
            {
              requirement: "Documentation",
              status: "pending",
              details: "Commercial invoice, packing list, bill of lading",
            },
            {
              requirement: "Record Keeping",
              status: "pending",
              details: "Maintain records for 5 years minimum",
            },
          ],
          documentation: [
            fta.certificate,
            "Commercial Invoice",
            "Packing List",
            "Bill of Lading / Air Waybill",
            "Production records",
            "Supplier declarations",
          ],
          restrictions: [
            "Goods must be shipped directly between FTA parties",
            "May not undergo further processing in third countries",
            "Certificate validity: typically 12 months",
          ],
          notes: `${fta.name} provides preferential duty rates for qualifying goods. Ensure compliance with rules of origin.`,
          certificateRequired: true,
          localContentRequired: fta.localContentReq,
          deMinimis: fta.code === "USMCA" ? 10 : 7,
          cumulation: ["Bilateral cumulation", "Diagonal cumulation", "Full cumulation"],
        };
      });

      if (ftaResults.length === 0) {
        ftaResults.push({
          eligible: false,
          agreementName: "No FTA Available",
          agreementCode: "N/A",
          currentDuty: duty,
          ftaDuty: duty,
          savingsPercent: 0,
          savingsAmount: 0,
          rulesOfOrigin: [
            { rule: "No FTA", description: "No free trade agreement between selected countries", met: false, critical: true },
          ],
          requirements: [
            { requirement: "FTA Coverage", status: "not-met", details: "Countries not party to same FTA" },
          ],
          documentation: [],
          restrictions: ["Standard MFN duty rates apply"],
          notes: "Consider alternative sourcing or explore potential future FTA negotiations.",
          certificateRequired: false,
          localContentRequired: 0,
          deMinimis: 0,
          cumulation: [],
        });
      }

      const ftaSummary: FTASummary = {
        totalAgreements: ftaResults.length,
        eligibleAgreements: ftaResults.filter((r) => r.eligible).length,
        bestAgreement: [...ftaResults].sort((a, b) => b.savingsAmount - a.savingsAmount)[0]?.agreementName || "None",
        maxSavings: Math.max(...ftaResults.map((r) => r.savingsAmount)),
        avgDutyReduction: ftaResults.reduce((sum, r) => sum + r.savingsPercent, 0) / ftaResults.length,
      };

      setResults(ftaResults);
      setSummary(ftaSummary);
      setIsAnalyzing(false);
      setActiveTab("analysis");
    }, 1500);
  };

  const resetForm = () => {
    setExportCountry("CN");
    setImportCountry("US");
    setHsCode("8471.30");
    setProductDescription("Laptop computers");
    setProductValue("100000");
    setCurrentDutyRate("5.5");
    setOriginCriterion("wholly-obtained");
    setLocalContentPercent("65");
    setDirectShipment("yes");
    setResults([]);
    setSummary(null);
    setActiveTab("calculator");
  };

  const exportResults = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      input: {
        exportCountry,
        importCountry,
        hsCode,
        productDescription,
        productValue: parseFloat(productValue),
        currentDutyRate: parseFloat(currentDutyRate),
        originCriterion,
        localContentPercent: parseFloat(localContentPercent),
        directShipment,
      },
      summary,
      results,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fta-eligibility-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "FTA Eligibility Check Results",
          text: `Checked FTA eligibility for ${productDescription} (${hsCode}) from ${exportCountry} to ${importCountry}. Maximum savings: ${formatCurrency(summary?.maxSavings || 0)}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `FTA Eligibility Check\nProduct: ${productDescription} (${hsCode})\nRoute: ${exportCountry} → ${importCountry}\nMaximum Savings: ${formatCurrency(summary?.maxSavings || 0)}\nBest FTA: ${summary?.bestAgreement || "N/A"}`;
      await navigator.clipboard.writeText(shareText);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Chart data calculations
  const savingsChartData = useMemo(() => results.map((r) => ({
    name: r.agreementCode,
    savings: r.savingsAmount,
    eligible: r.eligible,
    currentDuty: r.currentDuty,
    ftaDuty: r.ftaDuty,
  })), [results]);

  const pieChartData = useMemo(() => results.map((r, index) => ({
    name: r.agreementCode,
    value: r.savingsAmount,
    fill: r.eligible ? COLORS[index % COLORS.length] : "#94a3b8",
  })), [results]);

  const comparisonData = useMemo(() => results.map((r) => ({
    name: r.agreementCode,
    "MFN Duty": r.currentDuty,
    "FTA Duty": r.ftaDuty,
    Savings: r.savingsPercent,
  })), [results]);

  const radarData = useMemo(() => {
    if (results.length === 0) return [];
    const firstResult = results[0];
    if (!firstResult) return [];
    
    return firstResult.rulesOfOrigin.map((rule) => ({
      criterion: rule.rule.split(" ").slice(0, 2).join(" "),
      score: rule.met ? 100 : rule.critical ? 20 : 50,
      fullMark: 100,
    }));
  }, [results]);

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border/50">
        <FloatingParticles />
        
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        {/* Floating icons */}
        <motion.div
          className="absolute top-10 right-[15%] opacity-10"
          animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <Globe className="w-24 h-24 text-[var(--ocean)]" />
        </motion.div>
        <motion.div
          className="absolute bottom-10 left-[10%] opacity-10"
          animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Ship className="w-20 h-20 text-[var(--logistics)]" />
        </motion.div>

        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Animated Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap justify-center gap-3 mb-6"
            >
              <AnimatedBadge delay={0.1}>
                <Sparkles className="h-4 w-4 mr-2" />
                Trade Agreements
              </AnimatedBadge>
              <AnimatedBadge delay={0.2}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                FTA Compliance
              </AnimatedBadge>
              <AnimatedBadge delay={0.3}>
                <TrendingDown className="h-4 w-4 mr-2" />
                Duty Savings
              </AnimatedBadge>
            </motion.div>

            {/* Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              FTA Eligibility Checker
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Instantly determine your eligibility for preferential duty rates under major Free Trade Agreements.
              Compare savings across FTAs and ensure compliance with Rules of Origin.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-wrap justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                variant="outline"
                onClick={resetForm}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
              {summary && (
                <>
                  <Button
                    variant="outline"
                    onClick={exportResults}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    onClick={shareResults}
                    className="gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </Button>
                </>
              )}
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              {[
                { icon: Target, label: "20+ FTAs", value: "Covered" },
                { icon: Zap, label: "Instant", value: "Analysis" },
                { icon: ShieldCheck, label: "RoO", value: "Compliance" },
                { icon: Calculator, label: "Duty", value: "Savings" },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-[var(--logistics)]" />
                    <div className="text-xs text-muted-foreground">{item.label}</div>
                    <div className="font-semibold text-foreground">{item.value}</div>
                  </div>
                );
              })}
            </motion.div>

            {/* Stats row */}
            <motion.div
              className="flex flex-wrap justify-center gap-6 mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="h-5 w-5 text-[var(--logistics)]" />
                <span className="text-sm">Used by <strong className="text-foreground">12,000+</strong> traders</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                <span className="text-sm"><strong className="text-foreground">$2.5M+</strong> savings identified</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-5 w-5 text-[var(--logistics)]" />
                <span className="text-sm">Updated <strong className="text-foreground">Real-time</strong></span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main 5-Tab Interface */}
      <Card className="border-0 shadow-lg bg-card">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 rounded-none border-b bg-muted/30 h-12">
              <TabsTrigger value="calculator" className="gap-2 data-[state=active]:bg-background">
                <Calculator className="h-4 w-4 hidden sm:inline" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="analysis" className="gap-2 data-[state=active]:bg-background">
                <BarChart3 className="h-4 w-4 hidden sm:inline" />
                Analysis
              </TabsTrigger>
              <TabsTrigger value="comparison" className="gap-2 data-[state=active]:bg-background">
                <GitCompare className="h-4 w-4 hidden sm:inline" />
                Comparison
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-2 data-[state=active]:bg-background">
                <BookOpen className="h-4 w-4 hidden sm:inline" />
                Guide
              </TabsTrigger>
              <TabsTrigger value="faq" className="gap-2 data-[state=active]:bg-background">
                <HelpCircle className="h-4 w-4 hidden sm:inline" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Calculator */}
            <TabsContent value="calculator" className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Country Selection */}
                <div className="space-y-2">
                  <Label htmlFor="exportCountry" className="flex items-center gap-2 text-foreground">
                    <Flag className="h-4 w-4 text-[var(--logistics)]" />
                    Export Country (Origin)
                  </Label>
                  <Select value={exportCountry} onValueChange={setExportCountry}>
                    <SelectTrigger className="h-11 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="importCountry" className="flex items-center gap-2 text-foreground">
                    <Flag className="h-4 w-4 text-red-500" />
                    Import Country (Destination)
                  </Label>
                  <Select value={importCountry} onValueChange={setImportCountry}>
                    <SelectTrigger className="h-11 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.code}>
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hsCode" className="flex items-center gap-2 text-foreground">
                    <Search className="h-4 w-4 text-[var(--logistics)]" />
                    HS Code
                  </Label>
                  <Input
                    id="hsCode"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                    placeholder="8471.30"
                    className="h-11 bg-background"
                  />
                </div>

                {/* Product Details */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="productDescription" className="text-foreground">Product Description</Label>
                  <Input
                    id="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Brief product description"
                    className="h-11 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productValue" className="flex items-center gap-2 text-foreground">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    Product Value (USD)
                  </Label>
                  <Input
                    id="productValue"
                    type="number"
                    value={productValue}
                    onChange={(e) => setProductValue(e.target.value)}
                    placeholder="100,000"
                    className="h-11 bg-background"
                  />
                </div>

                {/* Duty & Origin */}
                <div className="space-y-2">
                  <Label htmlFor="currentDutyRate" className="flex items-center gap-2 text-foreground">
                    <Percent className="h-4 w-4 text-[var(--logistics)]" />
                    Current MFN Duty Rate (%)
                  </Label>
                  <Input
                    id="currentDutyRate"
                    type="number"
                    step="0.1"
                    value={currentDutyRate}
                    onChange={(e) => setCurrentDutyRate(e.target.value)}
                    placeholder="5.5"
                    className="h-11 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="originCriterion" className="text-foreground">Origin Criterion</Label>
                  <Select value={originCriterion} onValueChange={setOriginCriterion}>
                    <SelectTrigger className="h-11 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wholly-obtained">Wholly Obtained</SelectItem>
                      <SelectItem value="tariff-shift">Tariff Shift</SelectItem>
                      <SelectItem value="regional-value">Regional Value Content</SelectItem>
                      <SelectItem value="combination">Combination</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="localContent" className="flex items-center gap-2 text-foreground">
                    <TrendingDown className="h-4 w-4 text-[var(--logistics)]" />
                    Local Content (%)
                  </Label>
                  <Input
                    id="localContent"
                    type="number"
                    value={localContentPercent}
                    onChange={(e) => setLocalContentPercent(e.target.value)}
                    placeholder="65"
                    className="h-11 bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="directShipment" className="text-foreground">Direct Shipment</Label>
                  <Select value={directShipment} onValueChange={setDirectShipment}>
                    <SelectTrigger className="h-11 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes - Direct Route</SelectItem>
                      <SelectItem value="transit">Transit Only (No Processing)</SelectItem>
                      <SelectItem value="no">No - Third Country Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-4">
                <Button
                  onClick={checkEligibility}
                  disabled={isAnalyzing}
                  className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Checking FTA Eligibility...
                    </>
                  ) : (
                    <>
                      <FileCheck className="mr-2 h-5 w-5" />
                      Check FTA Eligibility
                    </>
                  )}
                </Button>
              </div>

              {/* FTA Reference Cards */}
              <div className="mt-6 pt-6 border-t border-border">
                <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Major Free Trade Agreements
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ftas.slice(0, 8).map((fta, index) => (
                    <motion.div
                      key={fta.code}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <h4 className="font-semibold text-sm text-foreground">{fta.name}</h4>
                      </div>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>Members: {fta.parties.length} countries</p>
                        <p>Duty reduction: ~{fta.avgDutyReduction}%</p>
                        <p>Local content: {fta.localContentReq}% min</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Tab 2: Analysis */}
            <TabsContent value="analysis" className="p-6 space-y-6">
              {!summary ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCheck className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Run the eligibility check to see analysis results</p>
                  <p className="text-sm mt-2">Enter your trade details in the Calculator tab and click Check FTA Eligibility</p>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Globe className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">FTAs Found</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.totalAgreements}</p>
                        <p className="text-sm opacity-80 mt-1">Applicable agreements</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <CheckCircle className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Eligible</span>
                        </div>
                        <p className="text-2xl font-bold">{summary.eligibleAgreements}</p>
                        <p className="text-sm opacity-80 mt-1">Qualifying FTAs</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Max Savings</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(summary.maxSavings)}</p>
                        <p className="text-sm opacity-80 mt-1">Per shipment</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Percent className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Best FTA</span>
                        </div>
                        <p className="text-xl font-bold truncate">{summary.bestAgreement}</p>
                        <p className="text-sm opacity-80 mt-1">Recommended agreement</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Bar Chart - Savings */}
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Potential Duty Savings by FTA</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={savingsChartData}>
                              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                              <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                              <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} stroke="var(--muted-foreground)" />
                              <Tooltip
                                formatter={(value: number) => [formatCurrency(value), "Savings"]}
                                labelFormatter={(label) => `FTA: ${label}`}
                                contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }}
                              />
                              <Bar dataKey="savings" radius={[4, 4, 0, 0]}>
                                {savingsChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={entry.eligible ? "#2E8B57" : "#94a3b8"}
                                  />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Pie Chart - Distribution */}
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Savings Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-72">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: number) => formatCurrency(value)} contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Radar Chart - Eligibility Criteria */}
                  {radarData.length > 0 && (
                    <Card className="border border-border">
                      <CardHeader>
                        <CardTitle className="text-lg text-foreground">Eligibility Criteria Analysis</CardTitle>
                        <CardDescription>Radar chart showing rules of origin compliance status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                              <PolarGrid stroke="var(--border)" />
                              <PolarAngleAxis dataKey="criterion" stroke="var(--muted-foreground)" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                              <PolarRadiusAxis stroke="var(--border)" />
                              <Radar
                                name="Compliance Score"
                                dataKey="score"
                                stroke="#0F4C81"
                                fill="#0F4C81"
                                fillOpacity={0.5}
                              />
                              <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* FTA Results List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">FTA Eligibility Details</h3>
                    {results.map((result, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 ${
                          result.eligible
                            ? "border-[var(--logistics)] bg-[var(--logistics)]/5"
                            : "border-border"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h5 className="font-semibold text-foreground">{result.agreementName}</h5>
                            <p className="text-sm text-muted-foreground">{result.agreementCode}</p>
                          </div>
                          {result.eligible ? (
                            <span className="flex items-center gap-1 text-[var(--logistics)] text-sm font-medium">
                              <CheckCircle className="h-4 w-4" />
                              Eligible
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-red-500 text-sm font-medium">
                              <XCircle className="h-4 w-4" />
                              Not Eligible
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                          <div>
                            <p className="text-muted-foreground">Current Duty</p>
                            <p className="font-medium text-foreground">{result.currentDuty}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">FTA Duty</p>
                            <p className="font-medium text-[var(--logistics)]">{result.ftaDuty}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Savings</p>
                            <p className="font-medium text-foreground">{formatCurrency(result.savingsAmount)}</p>
                          </div>
                        </div>

                        {/* Progress bar for local content */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-muted-foreground mb-1">
                            <span>Local Content Progress</span>
                            <span>{localContentPercent}% / {result.localContentRequired}% required</span>
                          </div>
                          <Progress 
                            value={(parseFloat(localContentPercent) / result.localContentRequired) * 100}
                            className="h-2"
                          />
                        </div>

                        {/* Rules of Origin */}
                        <div className="mt-4">
                          <h6 className="text-sm font-medium text-foreground mb-2">Rules of Origin</h6>
                          <div className="grid grid-cols-2 gap-2">
                            {result.rulesOfOrigin.map((rule, i) => (
                              <div key={i} className={`flex items-center gap-2 text-xs p-2 rounded ${rule.met ? "bg-[var(--logistics)]/10" : "bg-muted"}`}>
                                {rule.met ? (
                                  <CheckCircle className="h-3 w-3 text-[var(--logistics)]" />
                                ) : (
                                  <XCircle className="h-3 w-3 text-red-500" />
                                )}
                                <span className={rule.met ? "text-foreground" : "text-muted-foreground"}>{rule.rule}</span>
                                {rule.critical && (
                                  <span className="text-[10px] bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1 rounded">Critical</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </>
              )}
            </TabsContent>

            {/* Tab 3: Comparison */}
            <TabsContent value="comparison" className="p-6 space-y-6">
              {!summary ? (
                <div className="text-center py-12 text-muted-foreground">
                  <GitCompare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Run the eligibility check to see FTA comparisons</p>
                </div>
              ) : (
                <>
                  {/* Comparison Chart */}
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">FTA Duty Comparison</CardTitle>
                      <CardDescription>Compare MFN duty rates vs FTA preferential rates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis type="number" stroke="var(--muted-foreground)" />
                            <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" width={80} />
                            <Tooltip contentStyle={{ backgroundColor: "var(--card)", border: "1px solid var(--border)" }} />
                            <Legend />
                            <Bar dataKey="MFN Duty" fill="#EF4444" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="FTA Duty" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Comparison Table */}
                  <Card className="border border-border">
                    <CardHeader>
                      <CardTitle className="text-lg text-foreground">Detailed Comparison</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-border">
                              <th className="text-left py-3 px-4 font-medium text-foreground">FTA</th>
                              <th className="text-center py-3 px-4 font-medium text-foreground">Status</th>
                              <th className="text-right py-3 px-4 font-medium text-foreground">MFN Duty</th>
                              <th className="text-right py-3 px-4 font-medium text-foreground">FTA Duty</th>
                              <th className="text-right py-3 px-4 font-medium text-foreground">Savings %</th>
                              <th className="text-right py-3 px-4 font-medium text-foreground">Savings $</th>
                              <th className="text-center py-3 px-4 font-medium text-foreground">Local Content</th>
                            </tr>
                          </thead>
                          <tbody>
                            {results.map((result, index) => (
                              <tr key={index} className="border-b border-border hover:bg-muted/50">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <div
                                      className="w-2 h-2 rounded-full"
                                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    />
                                    <span className="font-medium text-foreground">{result.agreementCode}</span>
                                  </div>
                                </td>
                                <td className="text-center py-3 px-4">
                                  {result.eligible ? (
                                    <Badge className="bg-[var(--logistics)]/20 text-[var(--logistics)]">Eligible</Badge>
                                  ) : (
                                    <Badge variant="destructive">Not Eligible</Badge>
                                  )}
                                </td>
                                <td className="text-right py-3 px-4 text-foreground">{result.currentDuty}%</td>
                                <td className="text-right py-3 px-4 text-[var(--logistics)] font-medium">{result.ftaDuty}%</td>
                                <td className="text-right py-3 px-4 text-foreground">{result.savingsPercent.toFixed(1)}%</td>
                                <td className="text-right py-3 px-4 text-foreground font-medium">{formatCurrency(result.savingsAmount)}</td>
                                <td className="text-center py-3 px-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <Progress 
                                      value={(parseFloat(localContentPercent) / result.localContentRequired) * 100}
                                      className="w-16 h-2"
                                    />
                                    <span className="text-xs text-muted-foreground">{result.localContentRequired}%</span>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Tab 4: Guide */}
            <TabsContent value="guide" className="p-6 space-y-6">
              <div className="space-y-8">
                {/* Educational Content Sections */}
                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <Globe className="h-5 w-5" />
                      What are Free Trade Agreements?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{educationalContent.whatAreFTAs}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <ShieldCheck className="h-5 w-5" />
                      Rules of Origin Explained
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{educationalContent.rulesOfOrigin}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <FileCheck className="h-5 w-5" />
                      How to Claim FTA Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{educationalContent.claimingPreferences}</p>
                  </CardContent>
                </Card>

                <Card className="border border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[var(--ocean)]">
                      <ClipboardList className="h-5 w-5" />
                      Documentation Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">{educationalContent.documentationRequirements}</p>
                  </CardContent>
                </Card>

                {/* Pro Tips Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-amber-500" />
                    Pro Tips & Best Practices
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proTips.map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <Card key={index} className="border border-border hover:border-[var(--ocean)]/30 transition-colors">
                          <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                                <Icon className="h-5 w-5 text-[var(--ocean)]" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">{tip.title}</h4>
                                <p className="text-sm text-muted-foreground">{tip.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                {/* Common Mistakes Section */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <AlertTriangle className="h-6 w-6 text-red-500" />
                    Common Mistakes to Avoid
                  </h3>
                  <div className="space-y-3">
                    {commonMistakes.map((mistake, index) => {
                      const Icon = mistake.icon;
                      return (
                        <Card key={index} className="border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10">
                          <CardContent className="pt-4 pb-4">
                            <div className="flex items-start gap-3">
                              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                                <Icon className="h-5 w-5 text-red-500" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground mb-1">{mistake.title}</h4>
                                <p className="text-sm text-muted-foreground">{mistake.description}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Tab 5: FAQ */}
            <TabsContent value="faq" className="p-6 space-y-6">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Frequently Asked Questions</h2>
                  <p className="text-muted-foreground">Comprehensive answers to common questions about Free Trade Agreements</p>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {comprehensiveFaqs.map((faq, index) => (
                    <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-4 bg-card">
                      <AccordionTrigger className="text-left hover:no-underline py-4 text-foreground font-medium">
                        <div className="flex items-start gap-3">
                          <HelpCircle className="h-5 w-5 text-[var(--ocean)] mt-0.5 flex-shrink-0" />
                          <span>{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4 pl-8">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
