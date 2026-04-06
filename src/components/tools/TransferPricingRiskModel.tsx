"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  RefreshCw,
  Shield,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Globe,
  FileText,
  BarChart,
  BookOpen,
  Building2,
  PieChart,
  Target,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  Download,
  Share2,
  RotateCcw,
  Lightbulb,
  X,
  Zap,
  FileCheck,
  Calculator,
  LineChart,
  Users,
  Clock,
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart as RechartsBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  Legend,
  ReferenceLine,
  ComposedChart,
} from "recharts";

// Types
interface TransferPricingInput {
  transactionType: "goods" | "services" | "ip" | "loans" | "leases";
  transactionValue: number;
  originCountry: string;
  destinationCountry: string;
  productCategory: string;
  pricingMethod: "cup" | "resale" | "costplus" | "tnmm" | "profitSplit";
  industryMargin: number;
  reportedMargin: number;
  functionsPerformed: string[];
  assetsUsed: string[];
  risksAssumed: string[];
  hasDocumentation: boolean;
  documentationQuality: "comprehensive" | "adequate" | "minimal" | "none";
  hasComparableData: boolean;
  fiscalYear: number;
}

interface RiskFactor {
  category: string;
  score: number;
  weight: number;
  status: "low" | "medium" | "high" | "critical";
  details: string;
  recommendation: string;
}

interface TransferPricingResult {
  overallRiskScore: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  oecdCompliance: number;
  armsLengthRange: {
    min: number;
    max: number;
    median: number;
    interquartileRange: [number, number];
  };
  adjustmentRequired: number;
  taxExposure: {
    origin: number;
    destination: number;
    total: number;
  };
  penaltyEstimate: {
    origin: number;
    destination: number;
    total: number;
  };
  documentationScore: number;
  auditRiskProbability: number;
  riskFactors: RiskFactor[];
  recommendations: string[];
  safeHarborEligible: boolean;
  safeHarborReason: string;
}

// Reference Data
const countries = [
  { code: "US", name: "United States", corporateTax: 21, penaltyRate: 0.2, hasSafeHarbor: true },
  { code: "GB", name: "United Kingdom", corporateTax: 25, penaltyRate: 0.3, hasSafeHarbor: true },
  { code: "DE", name: "Germany", corporateTax: 30, penaltyRate: 0.25, hasSafeHarbor: true },
  { code: "FR", name: "France", corporateTax: 25, penaltyRate: 0.25, hasSafeHarbor: false },
  { code: "CN", name: "China", corporateTax: 25, penaltyRate: 0.5, hasSafeHarbor: true },
  { code: "JP", name: "Japan", corporateTax: 30, penaltyRate: 0.15, hasSafeHarbor: true },
  { code: "IN", name: "India", corporateTax: 25, penaltyRate: 0.3, hasSafeHarbor: true },
  { code: "AU", name: "Australia", corporateTax: 30, penaltyRate: 0.25, hasSafeHarbor: true },
  { code: "CA", name: "Canada", corporateTax: 27, penaltyRate: 0.2, hasSafeHarbor: true },
  { code: "SG", name: "Singapore", corporateTax: 17, penaltyRate: 0.2, hasSafeHarbor: true },
  { code: "NL", name: "Netherlands", corporateTax: 25, penaltyRate: 0.25, hasSafeHarbor: true },
  { code: "IE", name: "Ireland", corporateTax: 15, penaltyRate: 0.2, hasSafeHarbor: false },
  { code: "LU", name: "Luxembourg", corporateTax: 24, penaltyRate: 0.2, hasSafeHarbor: true },
  { code: "CH", name: "Switzerland", corporateTax: 14, penaltyRate: 0.15, hasSafeHarbor: false },
  { code: "HK", name: "Hong Kong", corporateTax: 16.5, penaltyRate: 0.2, hasSafeHarbor: false },
  { code: "KR", name: "South Korea", corporateTax: 27, penaltyRate: 0.25, hasSafeHarbor: true },
  { code: "BR", name: "Brazil", corporateTax: 34, penaltyRate: 0.75, hasSafeHarbor: false },
  { code: "MX", name: "Mexico", corporateTax: 30, penaltyRate: 0.35, hasSafeHarbor: true },
  { code: "AE", name: "UAE", corporateTax: 9, penaltyRate: 0.15, hasSafeHarbor: false },
  { code: "SA", name: "Saudi Arabia", corporateTax: 20, penaltyRate: 0.25, hasSafeHarbor: false },
];

const transactionTypes = [
  { value: "goods", label: "Tangible Goods", icon: "📦" },
  { value: "services", label: "Services", icon: "🔧" },
  { value: "ip", label: "Intellectual Property", icon: "💡" },
  { value: "loans", label: "Intercompany Loans", icon: "💰" },
  { value: "leases", label: "Leases", icon: "🏠" },
];

const pricingMethods = [
  { 
    value: "cup", 
    label: "CUP - Comparable Uncontrolled Price",
    description: "Compares price in controlled transaction to comparable uncontrolled transaction",
    bestFor: "Commodities, standardized goods",
    reliability: 95
  },
  { 
    value: "resale", 
    label: "Resale Price Method",
    description: "Starts with resale price to third party, subtracts gross margin",
    bestFor: "Distribution activities",
    reliability: 80
  },
  { 
    value: "costplus", 
    label: "Cost-Plus Method",
    description: "Marks up costs of supplier in controlled transaction",
    bestFor: "Manufacturing, simple services",
    reliability: 75
  },
  { 
    value: "tnmm", 
    label: "TNMM - Transactional Net Margin Method",
    description: "Examines net profit margin relative to appropriate base",
    bestFor: "Routine distributors, manufacturers",
    reliability: 85
  },
  { 
    value: "profitSplit", 
    label: "Profit Split Method",
    description: "Divides combined profits based on relative contributions",
    bestFor: "Integrated operations, valuable IP",
    reliability: 90
  },
];

const productCategories = [
  { value: "electronics", label: "Electronics & Technology", benchmarkMargin: 12 },
  { value: "pharmaceuticals", label: "Pharmaceuticals & Healthcare", benchmarkMargin: 18 },
  { value: "automotive", label: "Automotive & Parts", benchmarkMargin: 8 },
  { value: "chemicals", label: "Chemicals & Materials", benchmarkMargin: 10 },
  { value: "machinery", label: "Machinery & Equipment", benchmarkMargin: 9 },
  { value: "consumer", label: "Consumer Goods", benchmarkMargin: 15 },
  { value: "food", label: "Food & Beverages", benchmarkMargin: 6 },
  { value: "textiles", label: "Textiles & Apparel", benchmarkMargin: 7 },
  { value: "logistics", label: "Logistics & Transportation", benchmarkMargin: 5 },
  { value: "consulting", label: "Consulting & Professional Services", benchmarkMargin: 20 },
  { value: "software", label: "Software & IT Services", benchmarkMargin: 25 },
  { value: "financial", label: "Financial Services", benchmarkMargin: 22 },
];

const functionalOptions = {
  functions: [
    "Research & Development",
    "Manufacturing",
    "Quality Control",
    "Marketing & Sales",
    "Distribution",
    "Customer Service",
    "Procurement",
    "Supply Chain Management",
    "Treasury",
    "Human Resources",
  ],
  assets: [
    "Manufacturing Equipment",
    "Intellectual Property",
    "Distribution Network",
    "Customer Relationships",
    "Brand/Trademark",
    "Technology Systems",
    "Real Estate",
    "Inventory",
  ],
  risks: [
    "Market Risk",
    "R&D Risk",
    "Inventory Risk",
    "Credit Risk",
    "Foreign Exchange Risk",
    "Regulatory Risk",
    "Product Liability Risk",
    "Operational Risk",
  ],
};

const penaltyRegimes = [
  { country: "United States", penalty: "20-40% of adjustment", documentation: "Required contemporaneously", safeHarbor: "Yes (interest charge, small taxpayer)" },
  { country: "United Kingdom", penalty: "Up to 100% of tax lost", documentation: "Required within 30 days of request", safeHarbor: "Yes (small transactions)" },
  { country: "Germany", penalty: "5-15% of adjustment", documentation: "Required contemporaneously", safeHarbor: "Yes (low value-adding services)" },
  { country: "France", penalty: "25-100% of tax due", documentation: "Required on file", safeHarbor: "Limited" },
  { country: "China", penalty: "0.5x daily interest, 50-500% penalty", documentation: "Required contemporaneously", safeHarbor: "Yes (specific industries)" },
  { country: "India", penalty: "100-300% of tax", documentation: "Required with tax return", safeHarbor: "Yes (specified sectors)" },
  { country: "Japan", penalty: "15-25% of penalty tax", documentation: "Required contemporaneously", safeHarbor: "Yes (deemed profit method)" },
  { country: "Australia", penalty: "25-50% of shortfall", documentation: "Required before filing", safeHarbor: "Yes (simplified methods)" },
  { country: "Brazil", penalty: "75% of adjustment + interest", documentation: "Required contemporaneously", safeHarbor: "Limited (fixed margins)" },
  { country: "Mexico", penalty: "15-150% of omitted tax", documentation: "Required contemporaneously", safeHarbor: "Yes (maquiladora regime)" },
];

const auditTriggers = [
  { trigger: "Large intercompany transactions", risk: "High", description: "Transactions above $10M often flagged for review" },
  { trigger: "Loss-making entities in low-tax jurisdictions", risk: "Critical", description: "Common indicator of profit shifting" },
  { trigger: "Significant intangible transfers", risk: "High", description: "IP transfers heavily scrutinized" },
  { trigger: "Mismatch between functions and profits", risk: "High", description: "Returns should align with value creation" },
  { trigger: "Inconsistent transfer pricing methods", risk: "Medium", description: "Method changes require justification" },
  { trigger: "Thin capitalization", risk: "Medium", description: "High debt-to-equity ratios raise concerns" },
  { trigger: "Related party debt at unusual rates", risk: "High", description: "Interest rates should be arm's length" },
  { trigger: "Cost contribution arrangements", risk: "Medium", description: "Must follow OECD guidelines" },
];

const COLORS = {
  low: "#2E8B57",
  medium: "#F59E0B",
  high: "#EF4444",
  critical: "#7F1D1D",
};

// Pro Tips Data
const proTips = [
  {
    icon: FileCheck,
    title: "Document Early and Thoroughly",
    description: "Prepare contemporaneous transfer pricing documentation before filing tax returns. Many jurisdictions impose significant penalties for inadequate or late documentation. Good documentation should include a detailed functional analysis, benchmarking study, and economic analysis supporting your pricing positions."
  },
  {
    icon: LineChart,
    title: "Benchmark Regularly",
    description: "Update your benchmarking studies every 3-5 years or when business circumstances change significantly. Tax authorities expect current, reliable comparable data. Consider using multiple databases and ensure your comparables are truly comparable in terms of functions, assets, and risks."
  },
  {
    icon: Calculator,
    title: "Choose the Right Method",
    description: "Select transfer pricing methods based on transaction characteristics, not convenience. CUP is preferred when quality comparables exist. TNMM is most common but may not be appropriate for complex transactions involving valuable intangibles. Document your method selection rationale thoroughly."
  },
  {
    icon: Users,
    title: "Consider Advance Pricing Agreements",
    description: "For high-value or complex transactions, consider entering into an Advance Pricing Agreement (APA) with tax authorities. APAs provide certainty on transfer pricing for a specified period, typically 3-5 years, and can significantly reduce audit risk and compliance costs."
  },
  {
    icon: Clock,
    title: "Monitor Legislative Changes",
    description: "Transfer pricing rules are evolving rapidly, particularly with OECD Pillar Two implementation. Stay informed about changes in key jurisdictions where you operate. The introduction of global minimum tax (15%) may affect your transfer pricing strategies and documentation requirements."
  },
  {
    icon: Target,
    title: "Align Profits with Value Creation",
    description: "Ensure profits are allocated to entities that perform important functions, contribute valuable assets, and assume significant risks. The DEMPE framework (Development, Enhancement, Maintenance, Protection, Exploitation) should guide intangible allocation decisions."
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    title: "Using Outdated Benchmarking Studies",
    description: "Relying on benchmarking studies that are more than 3-5 years old can expose your company to significant risk. Tax authorities expect current data reflecting market conditions. Old studies may not capture industry changes, new competitors, or economic shifts. Schedule regular updates and document your benchmarking methodology thoroughly."
  },
  {
    title: "Ignoring Functional Analysis",
    description: "Many companies select transfer pricing methods without conducting proper functional analysis. This can lead to inappropriate method selection and misallocation of profits. A thorough functional analysis identifies what each entity does (functions), what they own (assets), and what they bear (risks). This forms the foundation for all transfer pricing decisions."
  },
  {
    title: "Inadequate Documentation",
    description: "Preparing minimal documentation to 'check the box' is a risky strategy. Tax authorities increasingly scrutinize transfer pricing documentation for substance. Inadequate documentation can result in penalties even if your pricing is ultimately found to be arm's length. Invest in comprehensive documentation that tells your company's story."
  },
  {
    title: "Failing to Adjust for Differences",
    description: "When using comparables, failing to adjust for material differences between your transaction and the comparable transactions can undermine your entire analysis. Consider differences in contract terms, economic circumstances, business strategies, and risk profiles. Document all adjustments with clear rationale."
  },
  {
    title: "Neglecting Local Filing Requirements",
    description: "Different jurisdictions have different documentation and filing requirements. Some require Master File and Local File submissions, others require Country-by-Country reports. Missing local deadlines or failing to meet local content requirements can trigger penalties regardless of the substance of your transfer pricing positions."
  },
];

// Educational Content
const educationalContent = {
  whatIsTransferPricing: `Transfer pricing refers to the rules and methods for pricing transactions between related parties, typically subsidiaries of the same multinational enterprise group. These transactions can include the sale of goods, provision of services, transfer of intangible property, or financial arrangements such as loans. The fundamental principle underlying all transfer pricing rules is the arm's length principle, which requires that related parties transact on terms that would have been agreed between independent enterprises under similar circumstances.

The importance of proper transfer pricing cannot be overstated. With global trade accounting for trillions of dollars in related-party transactions annually, tax authorities worldwide have intensified their focus on transfer pricing compliance. Improper pricing can result in double taxation, significant penalties, lengthy audits, and reputational damage. Moreover, transfer pricing disputes can tie up management resources for years and result in unexpected tax liabilities that materially affect a company's financial statements.

Companies must navigate an increasingly complex web of transfer pricing regulations across multiple jurisdictions. Each country may have its own specific documentation requirements, penalty regimes, and interpretation of transfer pricing principles. The OECD Transfer Pricing Guidelines provide a common framework adopted by most countries, but local variations and interpretations can create significant compliance challenges for multinational enterprises.`,

  armsLengthPrinciple: `The arm's length principle is the international standard for transfer pricing, enshrined in Article 9 of the OECD Model Tax Convention and adopted by virtually all major economies. It requires that the conditions made in a transaction between related parties be equivalent to those that would have been made between independent enterprises in comparable circumstances. In essence, related parties should price their transactions as if they were strangers dealing at arm's length.

Applying the arm's length principle requires identifying comparable transactions or companies and making appropriate adjustments for differences. This comparability analysis considers five key factors: the characteristics of the property or services transferred, the functions performed by each party, the contractual terms, the economic circumstances, and the business strategies pursued. Finding truly comparable transactions can be challenging, particularly for unique intangibles or specialized services.

The arm's length principle is applied through various transfer pricing methods, each designed to test whether related-party pricing meets the standard. The most reliable methods are those that directly compare prices (CUP method) or profits, but these require quality comparable data. When direct comparisons are not possible, indirect methods such as the Transactional Net Margin Method (TNMM) or Profit Split Method may be appropriate. The selection of method should be based on the specific facts and circumstances of each transaction, guided by the principle of producing the most reliable arm's length result.`,

  transferPricingMethods: `Transfer pricing methods are analytical tools used to determine whether related-party transactions are at arm's length. The OECD Guidelines recognize five primary methods, divided into traditional transaction methods (CUP, Resale Price, Cost-Plus) and transactional profit methods (TNMM, Profit Split). Each method has specific applications, advantages, and limitations that must be considered in context.

The Comparable Uncontrolled Price (CUP) method compares the price in a controlled transaction to the price in a comparable uncontrolled transaction. This is the most direct and reliable method when quality comparables exist, making it ideal for commodity transactions or standardized goods where market prices are observable. The Resale Price Method starts with the resale price to an independent party and subtracts an appropriate gross margin. It's typically used for distribution activities where the reseller doesn't add significant value. The Cost-Plus Method adds an appropriate markup to the costs incurred by the supplier and is often used for manufacturing or simple service arrangements.

The Transactional Net Margin Method (TNMM) examines the net profit margin that a taxpayer realizes from a controlled transaction relative to an appropriate base such as sales, assets, or costs. It's the most commonly used method globally because it's relatively straightforward to apply and requires less detailed transaction-level data. The Profit Split Method divides the combined profits from controlled transactions based on each party's relative contributions. This method is particularly useful for highly integrated operations or transactions involving valuable intangibles where both parties contribute significant value.`,

  documentationRequirements: `Transfer pricing documentation serves multiple purposes: it helps companies ensure their pricing is defensible, provides tax authorities with information to assess compliance, and can protect against penalties in many jurisdictions. The OECD's three-tier documentation approach has become the global standard, comprising the Master File, Local File, and Country-by-Country Report.

The Master File provides a high-level overview of the multinational group's global business, including organizational structure, business descriptions, intangibles ownership, intercompany financial flows, and consolidated financial information. It gives tax authorities context for understanding the group's transfer pricing policies and how individual transactions fit within the broader strategy. The Master File is typically required for groups with consolidated revenue above certain thresholds.

The Local File focuses on specific controlled transactions in each jurisdiction, including detailed functional analysis, identification of all related-party transactions, financial data, benchmarking studies, and the selection of transfer pricing methods. This document should provide a complete picture of the local entity's transfer pricing positions and the business reasons supporting them. Documentation quality varies widely, and inadequate local files are a common trigger for deeper audit scrutiny.

The Country-by-Country Report provides standardized information about the global allocation of income, taxes paid, and certain indicators of economic activity. It's required only for the largest multinational groups (typically consolidated revenue exceeding €750 million) but has significantly increased tax authorities' ability to assess transfer pricing risk across the supply chain.`,
};

// FAQ Data
const faqData = [
  {
    question: "What is the arm's length principle and why is it important?",
    answer: `The arm's length principle is the cornerstone of international transfer pricing rules. It requires that transactions between related parties be priced as if the parties were independent enterprises dealing under similar circumstances. This principle is important because it provides a consistent standard for allocating profits among jurisdictions, which helps prevent double taxation and ensures that each country receives its fair share of tax revenue.

Without the arm's length principle, multinational enterprises could arbitrarily shift profits to low-tax jurisdictions, undermining the tax base of higher-tax countries where economic activity actually occurs. The principle attempts to approximate market conditions in related-party transactions, ensuring that each entity within a group earns a return appropriate to its functions, assets, and risks.

The arm's length principle is applied through various transfer pricing methods that compare related-party transactions to independent transactions or analyze the profits earned by comparable independent companies. When properly applied, it should result in profits being allocated to the entities that create value, not simply to entities located in favorable tax jurisdictions. However, applying the principle in practice can be challenging, particularly for unique intangibles or integrated global operations where independent comparables may not exist.`
  },
  {
    question: "How do I select the most appropriate transfer pricing method?",
    answer: `Selecting the right transfer pricing method is crucial for compliance and should be based on the specific characteristics of your transaction, the availability of comparable data, and the reliability of each method in your circumstances. The OECD Guidelines establish a hierarchy of methods, but importantly, there is no strict order of preference; the most appropriate method is the one that produces the most reliable arm's length result given the facts and circumstances.

Start by considering the nature of the transaction. For commodity transactions or standardized goods with observable market prices, the CUP method is often most reliable. For distribution activities where the reseller doesn't add significant value, the Resale Price method may be appropriate. Manufacturing arrangements or simple service provision may suit the Cost-Plus method. The TNMM is versatile and commonly used for routine operations where reliable comparable companies can be identified. For complex, integrated operations or transactions involving valuable intangibles, the Profit Split method may best capture each party's contributions.

Consider also the availability and quality of comparable data. A theoretically superior method with poor comparables may produce less reliable results than an alternative method with robust data. Document your method selection rationale thoroughly, explaining why the chosen method is most appropriate and why alternatives were rejected. Tax authorities will scrutinize method selection, so be prepared to defend your choice with objective analysis.`
  },
  {
    question: "What documentation do I need to maintain for transfer pricing compliance?",
    answer: `Transfer pricing documentation requirements vary by jurisdiction, but most countries now require something approximating the OECD's three-tier approach: Master File, Local File, and Country-by-Country Report. Understanding these requirements and maintaining contemporaneous documentation is essential for compliance and penalty protection.

The Master File provides a global overview of your multinational group, including organizational structure, business descriptions, intangibles ownership and policies, intercompany financial flows, and consolidated financial information. This document helps tax authorities understand your transfer pricing policies in context. Most jurisdictions require this for groups above certain size thresholds.

The Local File is transaction-specific documentation covering each material controlled transaction. It should include detailed functional analysis identifying what each party does, owns, and risks; identification of all related-party transactions; financial data; benchmarking studies; and the rationale for your selected transfer pricing method. Quality matters—the Local File should tell a coherent story about why your pricing is arm's length.

The Country-by-Country Report, required only for the largest multinationals (typically above €750 million consolidated revenue), provides standardized data on income, taxes, and economic activity by jurisdiction. Beyond these core documents, maintain all supporting analyses, including benchmarking studies, economic analyses, and intercompany agreements. Documentation should be contemporaneous—prepared before or with tax returns—to qualify for penalty protection in most jurisdictions.`
  },
  {
    question: "What triggers a transfer pricing audit and how can I prepare?",
    answer: `Transfer pricing audits can be triggered by various factors, some within your control and others not. Understanding these triggers helps you assess risk and prepare accordingly. Common triggers include large intercompany transactions, significant year-over-year changes in transfer pricing positions, loss-making entities in low-tax jurisdictions, high-value intangible transfers, and mismatches between functions performed and profits earned.

Tax authorities increasingly use data analytics to identify transfer pricing risk. The Country-by-Country Report provides a roadmap for comparing profits to economic activity across jurisdictions. Disparities between where functions are performed and where profits are reported will attract attention. Similarly, entities in low-tax jurisdictions showing high profits with limited substance may trigger scrutiny.

Preparation starts with robust contemporaneous documentation that tells a coherent story about your transfer pricing policies and their business rationale. Ensure your functional analysis is thorough and accurately reflects each entity's contributions. Benchmarking studies should be current (updated every 3-5 years) and use appropriate comparable companies. Consider the consistency of your positions across jurisdictions—inconsistent arguments can trigger disputes in multiple countries simultaneously.

Beyond documentation, prepare your team. Key personnel should understand the transfer pricing policies and be able to explain the business reasons supporting them. Consider conducting internal transfer pricing health checks or mock audits to identify and address weaknesses before authorities find them. For high-risk transactions, Advance Pricing Agreements provide certainty but require significant investment of time and resources.`
  },
  {
    question: "How do penalties work for transfer pricing adjustments?",
    answer: `Transfer pricing penalties can be substantial and vary significantly across jurisdictions. Understanding penalty regimes helps you assess risk and prioritize compliance efforts. Penalties typically apply when tax authorities adjust transfer prices and may be based on the adjustment amount, the taxpayer's behavior, or both.

In the United States, penalties range from 20% to 40% of the adjustment amount, depending on the severity. The 20% penalty applies to 'substantial valuation misstatements' where the reported price is 200% or less of the arm's length price. The 40% penalty applies to 'gross valuation misstatements' where the reported price exceeds 200% of the arm's length price. Penalties can be avoided or reduced if you maintain adequate contemporaneous documentation.

Other jurisdictions have different approaches. The UK can impose penalties up to 100% of the tax lost through transfer pricing adjustments. Germany applies penalties of 5-15% of the adjustment. India has particularly severe penalties ranging from 100% to 300% of the additional tax. China imposes daily interest charges plus penalties ranging from 50% to 500% of the underpaid tax.

Beyond monetary penalties, transfer pricing adjustments can trigger collateral consequences including double taxation (if the corresponding jurisdiction doesn't adjust), interest charges on late-paid tax, reputational damage from public disclosures, and increased scrutiny of other tax positions. The best defense is robust contemporaneous documentation—many jurisdictions waive or reduce penalties if adequate documentation exists, even if the pricing itself is found to be non-arm's length.`
  },
  {
    question: "What is DEMPE and how does it affect intangible transfers?",
    answer: `DEMPE stands for Development, Enhancement, Maintenance, Protection, and Exploitation—the key activities that drive value creation for intangibles. This framework, introduced in the 2015 OECD Guidelines revisions, fundamentally changed how multinationals should approach intangible transfers and profit allocation for IP-related transactions.

Before DEMPE, many multinationals could achieve significant tax savings by simply transferring legal ownership of valuable intangibles to entities in low-tax jurisdictions. These entities might have minimal employees and perform limited functions but would receive substantial royalties or profits from the intangibles. Tax authorities challenged these arrangements, and the OECD responded with the DEMPE framework.

Under DEMPE, profits from intangibles should be allocated to the entities that perform the important DEMPE functions, not just those that hold legal title. This means that if your R&D team in a high-tax jurisdiction develops technology, enhances it over time, maintains the IP portfolio, protects it through legal actions, and exploits it through commercialization activities, that jurisdiction should receive appropriate profit allocation regardless of where legal ownership sits.

For compliance, document which entities perform each DEMPE function and how they are compensated. Entities performing important functions should earn arm's length returns for those contributions. Legal ownership alone is no longer sufficient to claim substantial intangible-related profits. This may require restructuring existing arrangements or revising transfer pricing policies to properly reward value-creating activities.`
  },
  {
    question: "How does OECD Pillar Two affect transfer pricing?",
    answer: `OECD Pillar Two introduces a global minimum tax of 15% on the profits of large multinational enterprises, fundamentally changing the transfer pricing landscape. While transfer pricing principles remain based on the arm's length standard, Pillar Two affects the economics of cross-border arrangements and creates new compliance considerations.

The primary impact is that profit shifting to low-tax jurisdictions becomes less economically attractive. If an entity in a low-tax jurisdiction pays effective tax below 15%, other jurisdictions in the group can collect 'top-up tax' to bring the total to 15%. This reduces the tax savings from aggressive transfer pricing positions that shift profits to tax havens, though legitimate tax planning still has value.

Pillar Two also introduces new calculations that may differ from transfer pricing results. The 'GloBE' rules use financial accounting as the starting point, with certain adjustments. Differences between accounting and tax treatment can create complexity. Transfer pricing adjustments that affect financial statements may have Pillar Two implications.

For transfer pricing compliance, consider how your existing policies will perform under Pillar Two. Arrangements that made economic sense when the tax differential was 20+ percentage points may need re-evaluation when the maximum benefit is capped by the minimum tax. Document your analysis of Pillar Two impacts on transfer pricing positions, and ensure coordination between transfer pricing and Pillar Two compliance teams. Some companies may find that simplified arrangements become more attractive as the tax arbitrage opportunity diminishes.`
  },
  {
    question: "When should I consider an Advance Pricing Agreement (APA)?",
    answer: `Advance Pricing Agreements (APAs) are binding agreements between taxpayers and tax authorities that establish transfer pricing methodology for a specified period, typically 3-5 years. APAs provide certainty but require significant investment of time and resources. Understanding when APAs make sense is crucial for effective transfer pricing risk management.

Consider an APA for high-risk transactions where audit exposure is significant. Examples include large-value intercompany transactions, complex integrated operations involving multiple entities, unique intangibles where comparable data is limited, or new business models without established transfer pricing precedents. APAs are also valuable when you need certainty for financial reporting or business planning purposes, or when bilateral or multilateral agreements can prevent double taxation across jurisdictions.

The APA process typically takes 1-3 years and requires substantial documentation and negotiation. You'll need to prepare a detailed proposal including your proposed transfer pricing method, benchmarking analysis, and critical assumptions. The tax authority will review, may request additional information, and negotiate terms. Costs include professional fees, internal resources, and sometimes user fees charged by tax authorities.

Not all transactions warrant APAs. For routine transactions with established methods and reliable comparables, the compliance cost may exceed the benefit. Consider also whether your business is stable enough to benefit from multi-year certainty—APAs require critical assumptions that may not accommodate significant business changes. Finally, evaluate whether the jurisdiction has a mature APA program. Some tax authorities have more efficient processes than others, and the quality of outcomes can vary significantly.`
  },
];

export default function TransferPricingRiskModel() {
  const [input, setInput] = useState<TransferPricingInput>({
    transactionType: "goods",
    transactionValue: 10000000,
    originCountry: "US",
    destinationCountry: "CN",
    productCategory: "electronics",
    pricingMethod: "tnmm",
    industryMargin: 12,
    reportedMargin: 8,
    functionsPerformed: [],
    assetsUsed: [],
    risksAssumed: [],
    hasDocumentation: true,
    documentationQuality: "adequate",
    hasComparableData: true,
    fiscalYear: 2024,
  });

  const [result, setResult] = useState<TransferPricingResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("calculator");

  const resetForm = () => {
    setInput({
      transactionType: "goods",
      transactionValue: 10000000,
      originCountry: "US",
      destinationCountry: "CN",
      productCategory: "electronics",
      pricingMethod: "tnmm",
      industryMargin: 12,
      reportedMargin: 8,
      functionsPerformed: [],
      assetsUsed: [],
      risksAssumed: [],
      hasDocumentation: true,
      documentationQuality: "adequate",
      hasComparableData: true,
      fiscalYear: 2024,
    });
    setResult(null);
  };

  const exportResults = () => {
    if (!result) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      input: input,
      results: result,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transfer-pricing-assessment-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareResults = async () => {
    if (!result) return;
    
    const shareText = `Transfer Pricing Risk Assessment
Risk Level: ${result.riskLevel}
Risk Score: ${result.overallRiskScore}/100
OECD Compliance: ${result.oecdCompliance}%
Audit Risk: ${result.auditRiskProbability}%
Tax Exposure: $${(result.taxExposure.total / 1000000).toFixed(2)}M

Generated by Shiportrade.com Transfer Pricing Risk Model`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Transfer Pricing Risk Assessment',
          text: shareText,
        });
      } catch {
        // User cancelled or error
      }
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  const calculateRisk = () => {
    setIsAnalyzing(true);

    setTimeout(() => {
      const originData = countries.find((c) => c.code === input.originCountry) || countries[0];
      const destData = countries.find((c) => c.code === input.destinationCountry) || countries[1];
      const categoryData = productCategories.find((c) => c.value === input.productCategory);
      const methodData = pricingMethods.find((m) => m.value === input.pricingMethod);

      // Calculate risk factors
      const riskFactors: RiskFactor[] = [];

      // Margin deviation factor
      const marginDeviation = Math.abs(input.reportedMargin - input.industryMargin);
      const marginDeviationPct = (marginDeviation / input.industryMargin) * 100;
      let marginRiskScore = 100;
      let marginStatus: "low" | "medium" | "high" | "critical" = "low";
      
      if (marginDeviationPct > 50) {
        marginRiskScore = 20;
        marginStatus = "critical";
      } else if (marginDeviationPct > 30) {
        marginRiskScore = 40;
        marginStatus = "high";
      } else if (marginDeviationPct > 15) {
        marginRiskScore = 60;
        marginStatus = "medium";
      } else if (marginDeviationPct > 5) {
        marginRiskScore = 80;
        marginStatus = "low";
      }

      riskFactors.push({
        category: "Margin Deviation",
        score: marginRiskScore,
        weight: 20,
        status: marginStatus,
        details: `Reported margin ${input.reportedMargin}% vs industry benchmark ${input.industryMargin}% (${marginDeviationPct.toFixed(1)}% deviation)`,
        recommendation: marginDeviationPct > 15 
          ? "Consider adjusting transfer prices to align with industry benchmarks or document business reasons for deviation"
          : "Margin within acceptable range",
      });

      // Documentation adequacy factor
      let docScore = 100;
      let docStatus: "low" | "medium" | "high" | "critical" = "low";
      
      if (!input.hasDocumentation) {
        docScore = 10;
        docStatus = "critical";
      } else if (input.documentationQuality === "minimal") {
        docScore = 40;
        docStatus = "high";
      } else if (input.documentationQuality === "adequate") {
        docScore = 70;
        docStatus = "medium";
      }

      riskFactors.push({
        category: "Documentation Quality",
        score: docScore,
        weight: 15,
        status: docStatus,
        details: input.hasDocumentation 
          ? `Documentation quality: ${input.documentationQuality}`
          : "No transfer pricing documentation prepared",
        recommendation: input.hasDocumentation && input.documentationQuality !== "comprehensive"
          ? "Enhance documentation with detailed functional analysis, benchmarking, and economic analysis"
          : input.hasDocumentation 
            ? "Documentation is comprehensive"
            : "Prepare contemporaneous transfer pricing documentation immediately",
      });

      // Pricing method appropriateness factor
      let methodScore = 85;
      let methodStatus: "low" | "medium" | "high" | "critical" = "low";
      
      const methodType = methodData?.reliability || 85;
      if (input.transactionType === "ip" && input.pricingMethod === "costplus") {
        methodScore = 40;
        methodStatus = "high";
      } else if (input.transactionType === "services" && input.pricingMethod === "cup") {
        methodScore = 60;
        methodStatus = "medium";
      } else {
        methodScore = methodType;
      }

      riskFactors.push({
        category: "Method Appropriateness",
        score: methodScore,
        weight: 15,
        status: methodStatus,
        details: `Using ${methodData?.label.split(" - ")[0]} method for ${transactionTypes.find(t => t.value === input.transactionType)?.label}`,
        recommendation: methodStatus === "high" 
          ? "Consider using Profit Split or TNMM method for IP-related transactions"
          : "Method is appropriate for transaction type",
      });

      // Comparable data availability factor
      let compScore = input.hasComparableData ? 85 : 35;
      let compStatus: "low" | "medium" | "high" | "critical" = input.hasComparableData ? "low" : "high";

      riskFactors.push({
        category: "Comparable Data",
        score: compScore,
        weight: 15,
        status: compStatus,
        details: input.hasComparableData 
          ? "Comparable data available for benchmarking"
          : "Limited or no comparable data available",
        recommendation: input.hasComparableData 
          ? "Ensure comparables are periodically updated and screened for reliability"
          : "Consider commissioning a benchmarking study or using alternative methods",
      });

      // Jurisdiction risk factor
      const originPenalty = originData.penaltyRate;
      const destPenalty = destData.penaltyRate;
      const avgPenalty = (originPenalty + destPenalty) / 2;
      let jurisScore = 100 - avgPenalty * 100;
      let jurisStatus: "low" | "medium" | "high" | "critical" = "low";
      
      if (avgPenalty > 0.4) {
        jurisScore = 30;
        jurisStatus = "critical";
      } else if (avgPenalty > 0.3) {
        jurisScore = 50;
        jurisStatus = "high";
      } else if (avgPenalty > 0.2) {
        jurisScore = 70;
        jurisStatus = "medium";
      }

      riskFactors.push({
        category: "Jurisdiction Risk",
        score: jurisScore,
        weight: 15,
        status: jurisStatus,
        details: `Average penalty rate: ${(avgPenalty * 100).toFixed(0)}% (${originData.name}: ${(originPenalty * 100).toFixed(0)}%, ${destData.name}: ${(destPenalty * 100).toFixed(0)}%)`,
        recommendation: avgPenalty > 0.25 
          ? "High penalty jurisdictions require robust documentation and conservative pricing"
          : "Jurisdictions have moderate penalty regimes",
      });

      // Functional complexity factor
      const funcComplexity = input.functionsPerformed.length + input.assetsUsed.length + input.risksAssumed.length;
      let funcScore = Math.max(30, 100 - funcComplexity * 5);
      let funcStatus: "low" | "medium" | "high" | "critical" = "low";
      
      if (funcComplexity > 12) {
        funcStatus = "high";
      } else if (funcComplexity > 8) {
        funcStatus = "medium";
      }

      riskFactors.push({
        category: "Functional Complexity",
        score: funcScore,
        weight: 10,
        status: funcStatus,
        details: `${funcComplexity} functional elements identified (${input.functionsPerformed.length} functions, ${input.assetsUsed.length} assets, ${input.risksAssumed.length} risks)`,
        recommendation: funcComplexity > 8 
          ? "Complex arrangements require detailed DEMPE analysis and profit allocation methodology"
          : "Functional profile is manageable",
      });

      // Transaction value factor
      let valueScore = 100;
      let valueStatus: "low" | "medium" | "high" | "critical" = "low";
      
      if (input.transactionValue > 50000000) {
        valueScore = 30;
        valueStatus = "critical";
      } else if (input.transactionValue > 20000000) {
        valueScore = 50;
        valueStatus = "high";
      } else if (input.transactionValue > 10000000) {
        valueScore = 70;
        valueStatus = "medium";
      }

      riskFactors.push({
        category: "Transaction Materiality",
        score: valueScore,
        weight: 10,
        status: valueStatus,
        details: `Transaction value: $${(input.transactionValue / 1000000).toFixed(1)}M`,
        recommendation: input.transactionValue > 20000000 
          ? "High-value transactions attract increased scrutiny; consider advance pricing agreement (APA)"
          : "Transaction value is moderate",
      });

      // Calculate overall risk score
      const overallRiskScore = Math.round(
        riskFactors.reduce((sum, f) => sum + f.score * (f.weight / 100), 0)
      );

      // Determine risk level
      let riskLevel: "Low" | "Medium" | "High" | "Critical" = "Low";
      if (overallRiskScore < 40) riskLevel = "Critical";
      else if (overallRiskScore < 60) riskLevel = "High";
      else if (overallRiskScore < 80) riskLevel = "Medium";

      // Calculate arm's length range
      const baseMargin = input.industryMargin / 100;
      const rangeSpread = baseMargin * 0.4; // 40% spread for interquartile range
      
      const minPrice = input.transactionValue * (1 - baseMargin - rangeSpread);
      const maxPrice = input.transactionValue * (1 - baseMargin + rangeSpread);
      const medianPrice = input.transactionValue * (1 - baseMargin);
      const iqrLower = input.transactionValue * (1 - baseMargin - rangeSpread / 2);
      const iqrUpper = input.transactionValue * (1 - baseMargin + rangeSpread / 2);

      // Calculate adjustment required
      const reportedPrice = input.transactionValue * (1 - input.reportedMargin / 100);
      const medianPriceValue = medianPrice;
      const adjustmentRequired = reportedPrice - medianPriceValue;

      // Calculate tax exposure
      const originTaxRate = originData.corporateTax / 100;
      const destTaxRate = destData.corporateTax / 100;
      
      const originTaxExposure = Math.abs(adjustmentRequired) * originTaxRate;
      const destTaxExposure = Math.abs(adjustmentRequired) * destTaxRate;

      // Calculate penalty estimates
      const originPenaltyEstimate = originTaxExposure * originPenalty;
      const destPenaltyEstimate = destTaxExposure * destPenalty;

      // OECD Compliance score
      const oecdCompliance = Math.round(
        (docScore * 0.3 + methodScore * 0.25 + compScore * 0.25 + (input.hasDocumentation ? 100 : 0) * 0.2)
      );

      // Documentation score
      const documentationScore = docScore;

      // Audit risk probability
      const auditRiskProbability = Math.min(95, Math.max(5, 100 - overallRiskScore));

      // Safe harbor eligibility
      const safeHarborEligible = 
        (originData.hasSafeHarbor || destData.hasSafeHarbor) && 
        input.transactionValue < 10000000;

      const safeHarborReason = safeHarborEligible
        ? `Transaction may qualify for safe harbor in ${originData.hasSafeHarbor ? originData.name : destData.name}`
        : "Transaction does not meet safe harbor criteria";

      // Generate recommendations
      const recommendations: string[] = [];
      
      if (overallRiskScore < 60) {
        recommendations.push("High-risk transaction - consider engaging transfer pricing specialist");
      }
      if (!input.hasDocumentation) {
        recommendations.push("Prepare contemporaneous documentation immediately to reduce penalty exposure");
      }
      if (marginDeviationPct > 20) {
        recommendations.push("Significant margin deviation - document business reasons or consider price adjustment");
      }
      if (input.transactionValue > 50000000) {
        recommendations.push("Consider Advance Pricing Agreement (APA) for certainty on high-value transaction");
      }
      if (input.transactionType === "ip") {
        recommendations.push("IP transactions require detailed DEMPE analysis and valuation support");
      }
      if (funcComplexity > 10) {
        recommendations.push("Complex functional profile - ensure comprehensive functional analysis documentation");
      }
      if (safeHarborEligible) {
        recommendations.push("Safe harbor eligibility available - consider simplifying compliance");
      }
      if (!input.hasComparableData) {
        recommendations.push("Commission benchmarking study to support transfer pricing positions");
      }
      if (methodStatus === "high") {
        recommendations.push("Reconsider pricing method selection for better OECD compliance");
      }

      const transferPricingResult: TransferPricingResult = {
        overallRiskScore,
        riskLevel,
        oecdCompliance,
        armsLengthRange: {
          min: minPrice,
          max: maxPrice,
          median: medianPrice,
          interquartileRange: [iqrLower, iqrUpper],
        },
        adjustmentRequired,
        taxExposure: {
          origin: originTaxExposure,
          destination: destTaxExposure,
          total: originTaxExposure + destTaxExposure,
        },
        penaltyEstimate: {
          origin: originPenaltyEstimate,
          destination: destPenaltyEstimate,
          total: originPenaltyEstimate + destPenaltyEstimate,
        },
        documentationScore,
        auditRiskProbability,
        riskFactors,
        recommendations,
        safeHarborEligible,
        safeHarborReason,
      };

      setResult(transferPricingResult);
      setIsAnalyzing(false);
    }, 1500);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const radarData = useMemo(() => {
    if (!result) return [];
    return result.riskFactors.map((f) => ({
      factor: f.category.split(" ")[0],
      score: f.score,
      fullMark: 100,
    }));
  }, [result]);

  const armLengthChartData = useMemo(() => {
    if (!result || !input) return [];
    const reported = input.transactionValue * (1 - input.reportedMargin / 100);
    return [
      { name: "Min", value: result.armsLengthRange.min, type: "range" },
      { name: "IQR Lower", value: result.armsLengthRange.interquartileRange[0], type: "iqr" },
      { name: "Median", value: result.armsLengthRange.median, type: "median" },
      { name: "IQR Upper", value: result.armsLengthRange.interquartileRange[1], type: "iqr" },
      { name: "Max", value: result.armsLengthRange.max, type: "range" },
      { name: "Reported", value: reported, type: "reported" },
    ];
  }, [result, input]);

  const taxExposureData = useMemo(() => {
    if (!result) return [];
    return [
      { name: countries.find(c => c.code === input.originCountry)?.name || "Origin", value: result.taxExposure.origin, color: "#0F4C81" },
      { name: countries.find(c => c.code === input.destinationCountry)?.name || "Destination", value: result.taxExposure.destination, color: "#2E8B57" },
    ];
  }, [result, input]);

  const pieChartData = useMemo(() => {
    if (!result) return [];
    return result.riskFactors.map((f) => ({
      name: f.category,
      value: f.weight,
      score: f.score,
      status: f.status,
    }));
  }, [result]);

  const methodComparisonData = useMemo(() => {
    return pricingMethods.map((m) => ({
      name: m.label.split(" - ")[0],
      reliability: m.reliability,
      selected: m.value === input.pricingMethod,
    }));
  }, [input.pricingMethod]);

  const complianceRadarData = useMemo(() => {
    if (!result) return [];
    return [
      { factor: "Documentation", score: result.documentationScore, fullMark: 100 },
      { factor: "Method", score: result.riskFactors.find(f => f.category === "Method Appropriateness")?.score || 85, fullMark: 100 },
      { factor: "Comparables", score: result.riskFactors.find(f => f.category === "Comparable Data")?.score || 85, fullMark: 100 },
      { factor: "Jurisdiction", score: result.riskFactors.find(f => f.category === "Jurisdiction Risk")?.score || 85, fullMark: 100 },
      { factor: "Margin", score: result.riskFactors.find(f => f.category === "Margin Deviation")?.score || 85, fullMark: 100 },
    ];
  }, [result]);

  const toggleFunction = (type: "functions" | "assets" | "risks", value: string) => {
    setInput((prev) => ({
      ...prev,
      [type]: prev[type].includes(value)
        ? prev[type].filter((v) => v !== value)
        : [...prev[type], value],
    }));
  };

  const getRiskColor = (status: string) => {
    switch (status) {
      case "low": return COLORS.low;
      case "medium": return COLORS.medium;
      case "high": return COLORS.high;
      case "critical": return COLORS.critical;
      default: return COLORS.medium;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Tax Compliance", "Transfer Pricing", "Risk Assessment"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="outline" 
                    className="bg-[var(--ocean)]/10 text-[var(--ocean)] dark:text-ocean border-[var(--ocean)]/20 px-3 py-1"
                  >
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <Scale className="h-8 w-8 text-[var(--ocean)]" />
              Transfer Pricing Risk Model
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Comprehensive transfer pricing risk assessment tool for evaluating related party transactions, 
              calculating arm&apos;s length ranges, and identifying potential tax exposure across jurisdictions.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetForm} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={exportResults} 
              disabled={!result}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button 
              variant="default" 
              onClick={shareResults} 
              disabled={!result}
              className="flex items-center gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Calculator */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="calculator" className="flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Calculator
              </TabsTrigger>
              <TabsTrigger value="risk" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Risk Analysis
              </TabsTrigger>
              <TabsTrigger value="methods" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Methods
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Guide
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                FAQ
              </TabsTrigger>
            </TabsList>

            {/* Calculator Tab */}
            <TabsContent value="calculator" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BarChart className="h-4 w-4 text-[var(--logistics)]" />
                    Transaction Type
                  </Label>
                  <Select
                    value={input.transactionType}
                    onValueChange={(value: "goods" | "services" | "ip" | "loans" | "leases") => setInput((p) => ({ ...p, transactionType: value }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {transactionTypes.map((t) => (
                        <SelectItem key={t.value} value={t.value}>
                          {t.icon} {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Value */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--logistics)]" />
                    Transaction Value (USD)
                  </Label>
                  <Input
                    type="number"
                    value={input.transactionValue}
                    onChange={(e) => setInput((p) => ({ ...p, transactionValue: parseFloat(e.target.value) || 0 }))}
                    className="h-11"
                  />
                </div>

                {/* Product Category */}
                <div className="space-y-2">
                  <Label>Product/Service Category</Label>
                  <Select
                    value={input.productCategory}
                    onValueChange={(value) => {
                      const cat = productCategories.find((c) => c.value === value);
                      setInput((p) => ({ 
                        ...p, 
                        productCategory: value,
                        industryMargin: cat?.benchmarkMargin || p.industryMargin,
                      }));
                    }}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {productCategories.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label} (Benchmark: {c.benchmarkMargin}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Origin Country */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[var(--logistics)]" />
                    Seller/Origin Country
                  </Label>
                  <Select
                    value={input.originCountry}
                    onValueChange={(value) => setInput((p) => ({ ...p, originCountry: value }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.corporateTax}% tax)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destination Country */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-[var(--logistics)]" />
                    Buyer/Destination Country
                  </Label>
                  <Select
                    value={input.destinationCountry}
                    onValueChange={(value) => setInput((p) => ({ ...p, destinationCountry: value }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.name} ({c.corporateTax}% tax)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing Method */}
                <div className="space-y-2">
                  <Label>Pricing Method</Label>
                  <Select
                    value={input.pricingMethod}
                    onValueChange={(value: "cup" | "resale" | "costplus" | "tnmm" | "profitSplit") => setInput((p) => ({ ...p, pricingMethod: value }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {pricingMethods.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label.split(" - ")[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Industry Benchmark Margin */}
                <div className="space-y-2">
                  <Label>Industry Benchmark Margin (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[input.industryMargin]}
                      onValueChange={([value]) => setInput((p) => ({ ...p, industryMargin: value }))}
                      min={1}
                      max={50}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-16 text-right font-medium">{input.industryMargin}%</span>
                  </div>
                </div>

                {/* Reported Margin */}
                <div className="space-y-2">
                  <Label>Reported Margin (%)</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[input.reportedMargin]}
                      onValueChange={([value]) => setInput((p) => ({ ...p, reportedMargin: value }))}
                      min={0}
                      max={50}
                      step={0.5}
                      className="flex-1"
                    />
                    <span className="w-16 text-right font-medium">{input.reportedMargin}%</span>
                  </div>
                </div>

                {/* Fiscal Year */}
                <div className="space-y-2">
                  <Label>Fiscal Year</Label>
                  <Select
                    value={input.fiscalYear.toString()}
                    onValueChange={(value) => setInput((p) => ({ ...p, fiscalYear: parseInt(value) }))}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[2024, 2023, 2022, 2021, 2020].map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          FY {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Functional Analysis Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Functions Performed */}
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-[var(--ocean)]" />
                      Functions Performed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {functionalOptions.functions.map((func) => (
                        <label
                          key={func}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={input.functionsPerformed.includes(func)}
                            onChange={() => toggleFunction("functions", func)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm">{func}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Assets Used */}
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-[var(--logistics)]" />
                      Assets Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {functionalOptions.assets.map((asset) => (
                        <label
                          key={asset}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={input.assetsUsed.includes(asset)}
                            onChange={() => toggleFunction("assets", asset)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm">{asset}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Risks Assumed */}
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Risks Assumed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {functionalOptions.risks.map((risk) => (
                        <label
                          key={risk}
                          className="flex items-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded"
                        >
                          <input
                            type="checkbox"
                            checked={input.risksAssumed.includes(risk)}
                            onChange={() => toggleFunction("risks", risk)}
                            className="rounded border-slate-300"
                          />
                          <span className="text-sm">{risk}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Documentation Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--ocean)]" />
                      Documentation Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Has Transfer Pricing Documentation</Label>
                        <p className="text-sm text-muted-foreground">Contemporaneous documentation on file</p>
                      </div>
                      <Switch
                        checked={input.hasDocumentation}
                        onCheckedChange={(checked) => setInput((p) => ({ ...p, hasDocumentation: checked }))}
                      />
                    </div>

                    {input.hasDocumentation && (
                      <div className="space-y-2">
                        <Label>Documentation Quality</Label>
                        <Select
                          value={input.documentationQuality}
                          onValueChange={(value: "comprehensive" | "adequate" | "minimal" | "none") => setInput((p) => ({ ...p, documentationQuality: value }))}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="comprehensive">Comprehensive - Full analysis with benchmarks</SelectItem>
                            <SelectItem value="adequate">Adequate - Meets minimum requirements</SelectItem>
                            <SelectItem value="minimal">Minimal - Basic documentation only</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border border-slate-200 dark:border-slate-700">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Target className="h-4 w-4 text-[var(--logistics)]" />
                      Comparable Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Comparable Data Available</Label>
                        <p className="text-sm text-muted-foreground">Reliable benchmarking data exists</p>
                      </div>
                      <Switch
                        checked={input.hasComparableData}
                        onCheckedChange={(checked) => setInput((p) => ({ ...p, hasComparableData: checked }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Margin Deviation Warning */}
              {Math.abs(input.reportedMargin - input.industryMargin) / input.industryMargin > 0.2 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800 dark:text-amber-200">Margin Deviation Alert</p>
                      <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                        The reported margin ({input.reportedMargin}%) deviates significantly from the industry benchmark ({input.industryMargin}%). 
                        This may increase audit risk and require additional documentation.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={calculateRisk}
                  disabled={isAnalyzing}
                  className="bg-[var(--ocean)] hover:bg-[var(--ocean)]/90 text-white px-8 py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Transfer Pricing Risk...
                    </>
                  ) : (
                    <>
                      <Shield className="mr-2 h-5 w-5" />
                      Assess Transfer Pricing Risk
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>

            {/* Risk Analysis Tab */}
            <TabsContent value="risk" className="space-y-6">
              {!result ? (
                <div className="text-center py-12">
                  <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
                  <p className="text-muted-foreground mb-4">Complete the calculator and run an assessment to view risk analysis.</p>
                  <Button onClick={() => setActiveTab("calculator")}>Go to Calculator</Button>
                </div>
              ) : (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <Card
                      className="text-white"
                      style={{
                        background: `linear-gradient(135deg, ${
                          result.riskLevel === "Low" ? "#2E8B57" :
                          result.riskLevel === "Medium" ? "#F59E0B" :
                          result.riskLevel === "High" ? "#EF4444" : "#7F1D1D"
                        }, ${
                          result.riskLevel === "Low" ? "#228B22" :
                          result.riskLevel === "Medium" ? "#D97706" :
                          result.riskLevel === "High" ? "#DC2626" : "#991B1B"
                        })`,
                      }}
                    >
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Shield className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Risk Level</span>
                        </div>
                        <p className="text-3xl font-bold">{result.riskLevel}</p>
                        <p className="text-sm opacity-80">Overall Assessment</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <BarChart className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Risk Score</span>
                        </div>
                        <p className="text-3xl font-bold">{result.overallRiskScore}</p>
                        <p className="text-sm opacity-80">out of 100</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <Scale className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">OECD Compliance</span>
                        </div>
                        <p className="text-3xl font-bold">{result.oecdCompliance}%</p>
                        <p className="text-sm opacity-80">Guidelines alignment</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <TrendingDown className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Audit Risk</span>
                        </div>
                        <p className="text-3xl font-bold">{result.auditRiskProbability}%</p>
                        <p className="text-sm opacity-80">Probability</p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="h-6 w-6 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-1 rounded">Tax Exposure</span>
                        </div>
                        <p className="text-xl font-bold">{formatCurrency(result.taxExposure.total)}</p>
                        <p className="text-sm opacity-80">Potential liability</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart - Risk Factor Breakdown */}
                    <Card className="border border-slate-200 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-base">Risk Factor Weight Distribution</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={pieChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name.split(' ')[0]}: ${value}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {pieChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={getRiskColor(entry.status)} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Radar Chart - Compliance Analysis */}
                    <Card className="border border-slate-200 dark:border-slate-700">
                      <CardHeader>
                        <CardTitle className="text-base">Compliance Analysis Radar</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart data={complianceRadarData}>
                              <PolarGrid />
                              <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11 }} />
                              <PolarRadiusAxis angle={30} domain={[0, 100]} />
                              <Radar
                                name="Score"
                                dataKey="score"
                                stroke="#0F4C81"
                                fill="#0F4C81"
                                fillOpacity={0.5}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Risk Factors Detail */}
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base">Risk Factor Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.riskFactors.map((factor, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 ${
                              factor.status === "low"
                                ? "border-l-green-500 bg-green-50 dark:bg-green-900/20"
                                : factor.status === "medium"
                                ? "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                                : factor.status === "high"
                                ? "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                : "border-l-red-500 bg-red-50 dark:bg-red-900/20"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-2">
                                {factor.status === "low" ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : factor.status === "critical" ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                                )}
                                <span className="font-medium">{factor.category}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">Weight: {factor.weight}%</span>
                                <span className="font-bold text-lg">{factor.score}</span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground ml-6">{factor.details}</p>
                            <p className="text-xs text-[var(--ocean)] ml-6 mt-1">
                              <ChevronRight className="h-3 w-3 inline" /> {factor.recommendation}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Arm's Length Analysis */}
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base">Arm&apos;s Length Range Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={armLengthChartData} layout="vertical">
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis type="number" tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                              <YAxis dataKey="name" type="category" width={80} />
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                                {armLengthChartData.map((entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={
                                      entry.type === "median"
                                        ? "#0F4C81"
                                        : entry.type === "reported"
                                        ? "#EF4444"
                                        : entry.type === "iqr"
                                        ? "#2E8B57"
                                        : "#94a3b8"
                                    }
                                  />
                                ))}
                              </Bar>
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-semibold mb-3">Range Summary</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Full Range</span>
                                <span className="font-medium">
                                  {formatCurrency(result.armsLengthRange.min)} - {formatCurrency(result.armsLengthRange.max)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Interquartile Range (IQR)</span>
                                <span className="font-medium text-[var(--logistics)]">
                                  {formatCurrency(result.armsLengthRange.interquartileRange[0])} - {formatCurrency(result.armsLengthRange.interquartileRange[1])}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Median</span>
                                <span className="font-medium text-[var(--ocean)]">
                                  {formatCurrency(result.armsLengthRange.median)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`p-4 rounded-lg border ${
                            result.adjustmentRequired === 0 
                              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                              : "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800"
                          }`}>
                            <h5 className="font-semibold mb-2">Potential Adjustment</h5>
                            <p className={`text-2xl font-bold ${result.adjustmentRequired === 0 ? "text-green-600" : "text-amber-600"}`}>
                              {formatCurrency(Math.abs(result.adjustmentRequired))}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tax Exposure */}
                  <Card className="border border-slate-200 dark:border-slate-700">
                    <CardHeader>
                      <CardTitle className="text-base">Tax Exposure & Penalties</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsBar data={taxExposureData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`} />
                              <Tooltip formatter={(value: number) => formatCurrency(value)} />
                              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                <Cell fill="#0F4C81" />
                                <Cell fill="#2E8B57" />
                              </Bar>
                            </RechartsBar>
                          </ResponsiveContainer>
                        </div>
                        <div className="space-y-4">
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                            <h5 className="font-semibold text-red-800 dark:text-red-200 mb-2">Potential Penalties</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-red-700 dark:text-red-300">Origin Jurisdiction</span>
                                <span className="font-medium text-red-800 dark:text-red-200">{formatCurrency(result.penaltyEstimate.origin)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-red-700 dark:text-red-300">Destination Jurisdiction</span>
                                <span className="font-medium text-red-800 dark:text-red-200">{formatCurrency(result.penaltyEstimate.destination)}</span>
                              </div>
                              <div className="flex justify-between border-t border-red-200 dark:border-red-800 pt-2">
                                <span className="font-semibold text-red-800 dark:text-red-200">Total Penalty Exposure</span>
                                <span className="font-bold text-lg text-red-800 dark:text-red-200">{formatCurrency(result.penaltyEstimate.total)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                            <h5 className="font-semibold mb-2">Total Financial Exposure</h5>
                            <p className="text-2xl font-bold text-[var(--ocean)]">
                              {formatCurrency(result.taxExposure.total + result.penaltyEstimate.total)}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">Combined tax and penalty exposure</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Methods Tab */}
            <TabsContent value="methods" className="space-y-6">
              {/* Method Comparison Bar Chart */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base">Transfer Pricing Methods Comparison</CardTitle>
                  <CardDescription>Reliability and applicability of different pricing methods</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBar data={methodComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="reliability" radius={[4, 4, 0, 0]}>
                          {methodComparisonData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.selected ? "#0F4C81" : "#94a3b8"}
                            />
                          ))}
                        </Bar>
                      </RechartsBar>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Method Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {pricingMethods.map((method) => (
                  <Card
                    key={method.value}
                    className={`cursor-pointer transition-all ${
                      input.pricingMethod === method.value
                        ? "border-[var(--ocean)] dark:border-ocean border-2"
                        : "border border-slate-200 dark:border-slate-700"
                    }`}
                    onClick={() => setInput((p) => ({ ...p, pricingMethod: method.value as "cup" | "resale" | "costplus" | "tnmm" | "profitSplit" }))}
                  >
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">{method.label}</h4>
                        <Badge
                          variant="outline"
                          className={
                            input.pricingMethod === method.value
                              ? "bg-[var(--ocean)] text-white"
                              : ""
                          }
                        >
                          {method.reliability}% Reliable
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{method.description}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Target className="h-3 w-3" />
                        Best for: {method.bestFor}
                      </div>
                      {input.pricingMethod === method.value && (
                        <div className="mt-3 flex items-center gap-1 text-sm text-[var(--logistics)]">
                          <CheckCircle className="h-4 w-4" />
                          Selected Method
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Method Selection Guide */}
              <Card className="border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="pt-6">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Method Selection Hierarchy
                  </h4>
                  <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">1.</span>
                      <span><strong>CUP Method:</strong> Most reliable when quality comparables exist</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">2.</span>
                      <span><strong>Profit Split:</strong> Best for integrated operations with valuable IP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">3.</span>
                      <span><strong>TNMM:</strong> Most commonly used, good for routine operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">4.</span>
                      <span><strong>Cost-Plus / Resale:</strong> Traditional methods for simpler transactions</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              {/* Penalty Regimes Table */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base">Penalty Regimes by Jurisdiction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-700">
                          <th className="text-left py-3 px-4">Country</th>
                          <th className="text-left py-3 px-4">Penalty</th>
                          <th className="text-left py-3 px-4">Documentation</th>
                          <th className="text-left py-3 px-4">Safe Harbor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {penaltyRegimes.map((regime, index) => (
                          <tr key={index} className="border-b border-slate-100 dark:border-slate-800">
                            <td className="py-3 px-4 font-medium">{regime.country}</td>
                            <td className="py-3 px-4 text-red-600 dark:text-red-400">{regime.penalty}</td>
                            <td className="py-3 px-4">{regime.documentation}</td>
                            <td className="py-3 px-4">
                              <Badge variant={regime.safeHarbor === "Yes" || regime.safeHarbor.startsWith("Yes") ? "default" : "secondary"}>
                                {regime.safeHarbor}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Guide Tab */}
            <TabsContent value="guide" className="space-y-6">
              {/* What is Transfer Pricing */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[var(--ocean)]" />
                    What is Transfer Pricing?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {educationalContent.whatIsTransferPricing}
                  </p>
                </CardContent>
              </Card>

              {/* Arm's Length Principle */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Balance className="h-5 w-5 text-[var(--logistics)]" />
                    The Arm&apos;s Length Principle
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {educationalContent.armsLengthPrinciple}
                  </p>
                </CardContent>
              </Card>

              {/* Transfer Pricing Methods */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Transfer Pricing Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {educationalContent.transferPricingMethods}
                  </p>
                </CardContent>
              </Card>

              {/* Documentation Requirements */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[var(--logistics)]" />
                    Documentation Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {educationalContent.documentationRequirements}
                  </p>
                </CardContent>
              </Card>

              {/* Pro Tips Section */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    Pro Tips & Best Practices
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {proTips.map((tip, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg border-l-4 border-[var(--ocean)]"
                      >
                        <div className="flex items-start gap-3">
                          <tip.icon className="h-5 w-5 text-[var(--ocean)] mt-0.5 shrink-0" />
                          <div>
                            <h5 className="font-semibold text-sm mb-1">{tip.title}</h5>
                            <p className="text-xs text-muted-foreground">{tip.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Common Mistakes Section */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    Common Mistakes to Avoid
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commonMistakes.map((mistake, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                          <div>
                            <h5 className="font-semibold text-red-800 dark:text-red-200 mb-1">{mistake.title}</h5>
                            <p className="text-sm text-red-700 dark:text-red-300">{mistake.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Audit Triggers */}
              <Card className="border border-slate-200 dark:border-slate-700">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-500" />
                    Common Audit Triggers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {auditTriggers.map((trigger, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border-l-4 ${
                          trigger.risk === "Critical"
                            ? "border-l-red-600 bg-red-50 dark:bg-red-900/20"
                            : trigger.risk === "High"
                            ? "border-l-orange-500 bg-orange-50 dark:bg-orange-900/20"
                            : "border-l-amber-500 bg-amber-50 dark:bg-amber-900/20"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-medium">{trigger.trigger}</span>
                          <Badge
                            variant="outline"
                            className={
                              trigger.risk === "Critical"
                                ? "border-red-500 text-red-600"
                                : trigger.risk === "High"
                                ? "border-orange-500 text-orange-600"
                                : "border-amber-500 text-amber-600"
                            }
                          >
                            {trigger.risk}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{trigger.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-4">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {faqData.map((faq, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-slate-200 dark:border-slate-700 rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:text-[var(--ocean)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Results Section */}
      {result && activeTab === "calculator" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-[var(--logistics)] to-[var(--logistics)]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <Scale className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Overall Score</span>
                </div>
                <p className="text-3xl font-bold">{result.overallRiskScore}/100</p>
                <p className="text-sm opacity-80">Risk Assessment Score</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-[var(--ocean)] to-[var(--ocean)]/80 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <FileCheck className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Documentation</span>
                </div>
                <p className="text-3xl font-bold">{result.documentationScore}/100</p>
                <p className="text-sm opacity-80">Documentation Quality</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <AlertTriangle className="h-6 w-6 opacity-80" />
                  <span className="text-xs bg-white/20 px-2 py-1 rounded">Exposure</span>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(result.taxExposure.total + result.penaltyEstimate.total)}</p>
                <p className="text-sm opacity-80">Total Financial Exposure</p>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          <Card className="border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[var(--ocean)]" />
                Key Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <div className="w-6 h-6 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center text-sm shrink-0">
                      {index + 1}
                    </div>
                    <span className="text-sm">{rec}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

// Balance icon component for arm's length principle section
function Balance({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}
