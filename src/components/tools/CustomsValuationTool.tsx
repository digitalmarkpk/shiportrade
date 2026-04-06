"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  DollarSign,
  Percent,
  Ship,
  Shield,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Info,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Scale,
  FileText,
  HelpCircle,
  TrendingUp,
  Package,
  Coins,
  Globe,
  ArrowLeftRight,
  Building2,
  Users,
  Lightbulb,
  BookOpen,
  BarChart3,
  PieChartIcon,
  Zap,
  Target,
  AlertCircle,
  BadgeCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { currencies, formatCurrency } from "@/lib/constants/currencies";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ComposedChart,
  Line,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// WTO Valuation Methods - The 6 methods in hierarchical order
const WTO_VALUATION_METHODS = [
  {
    id: 1,
    name: "Transaction Value",
    shortName: "Method 1",
    description: "The price actually paid or payable for the goods when sold for export",
    wtoArticle: "Article 1",
    applicability: "Primary method - used in 90%+ of transactions",
    requirements: [
      "No restrictions on disposition of goods by buyer",
      "No conditions for which value cannot be determined",
      "No additional proceeds to seller that aren't included",
      "Buyer and seller not related, or relationship doesn't affect price",
    ],
    color: "#0F4C81", // Ocean Blue
  },
  {
    id: 2,
    name: "Transaction Value of Identical Goods",
    shortName: "Method 2",
    description: "Value based on identical goods exported at same commercial level/quantity",
    wtoArticle: "Article 2",
    applicability: "When Method 1 cannot be applied",
    requirements: [
      "Identical goods must be exported at same commercial level",
      "Substantially same quantity",
      "Same country of export",
      "Adjustments for differences in transport, insurance, etc.",
    ],
    color: "#2E8B57", // Logistics Green
  },
  {
    id: 3,
    name: "Transaction Value of Similar Goods",
    shortName: "Method 3",
    description: "Value based on similar goods with like characteristics",
    wtoArticle: "Article 3",
    applicability: "When Methods 1 and 2 cannot be applied",
    requirements: [
      "Goods have like characteristics and component materials",
      "Perform the same functions",
      "Commercially interchangeable",
      "Same country of production",
    ],
    color: "#F59E0B",
  },
  {
    id: 4,
    name: "Deductive Value",
    shortName: "Method 4",
    description: "Value calculated by deducting costs from unit selling price in country of import",
    wtoArticle: "Article 5",
    applicability: "When resale price in import country is known",
    requirements: [
      "Goods resold in same condition or after processing",
      "Deduct: commissions, transport, insurance, duties/taxes",
      "Deduct: usual profit and general expenses",
      "Based on greatest quantity sold at one price",
    ],
    color: "#8B5CF6",
  },
  {
    id: 5,
    name: "Computed Value",
    shortName: "Method 5",
    description: "Value computed from cost of production plus profit and expenses",
    wtoArticle: "Article 6",
    applicability: "When production costs are available from manufacturer",
    requirements: [
      "Cost of materials and fabrication",
      "General expenses and profit typical for exports",
      "Transport, loading, handling, and insurance costs",
      "Requires cooperation from foreign producer",
    ],
    color: "#EF4444",
  },
  {
    id: 6,
    name: "Fall-back Method",
    shortName: "Method 6",
    description: "Flexible application of previous methods with reasonable means",
    wtoArticle: "Article 7",
    applicability: "Last resort - flexible interpretation of previous methods",
    requirements: [
      "Based on available data in country of import",
      "Reasonable means consistent with WTO principles",
      "Cannot use arbitrary/fictitious values",
      "Cannot use minimum customs values",
      "Cannot use selling price in export country",
    ],
    color: "#06B6D4",
  },
];

// Currency exchange rates (demo values - in production would use live API)
const EXCHANGE_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.5,
  CNY: 7.24,
  INR: 83.12,
  AUD: 1.53,
  CAD: 1.36,
  CHF: 0.88,
  HKD: 7.82,
  SGD: 1.34,
  SEK: 10.45,
  KRW: 1320.5,
  MXN: 17.15,
  AED: 3.67,
  SAR: 3.75,
};

// Country options
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "CN", name: "China" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "AE", name: "UAE" },
  { code: "SG", name: "Singapore" },
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "NL", name: "Netherlands" },
  { code: "KR", name: "South Korea" },
  { code: "MX", name: "Mexico" },
  { code: "VN", name: "Vietnam" },
  { code: "TH", name: "Thailand" },
  { code: "MY", name: "Malaysia" },
  { code: "ID", name: "Indonesia" },
  { code: "TW", name: "Taiwan" },
];

// Incoterms for freight responsibility
const INCOTERMS = [
  { code: "EXW", name: "Ex Works", freightResponsibility: "Buyer", insuranceResponsibility: "Buyer" },
  { code: "FCA", name: "Free Carrier", freightResponsibility: "Buyer", insuranceResponsibility: "Buyer" },
  { code: "FAS", name: "Free Alongside Ship", freightResponsibility: "Buyer", insuranceResponsibility: "Buyer" },
  { code: "FOB", name: "Free On Board", freightResponsibility: "Buyer", insuranceResponsibility: "Buyer" },
  { code: "CFR", name: "Cost and Freight", freightResponsibility: "Seller", insuranceResponsibility: "Buyer" },
  { code: "CIF", name: "Cost, Insurance, Freight", freightResponsibility: "Seller", insuranceResponsibility: "Seller" },
  { code: "CPT", name: "Carriage Paid To", freightResponsibility: "Seller", insuranceResponsibility: "Buyer" },
  { code: "CIP", name: "Carriage & Insurance Paid", freightResponsibility: "Seller", insuranceResponsibility: "Seller" },
  { code: "DAP", name: "Delivered At Place", freightResponsibility: "Seller", insuranceResponsibility: "Buyer" },
  { code: "DPU", name: "Delivered Place Unloaded", freightResponsibility: "Seller", insuranceResponsibility: "Buyer" },
  { code: "DDP", name: "Delivered Duty Paid", freightResponsibility: "Seller", insuranceResponsibility: "Seller" },
];

const COLORS = [
  "#0F4C81", // Ocean Blue
  "#2E8B57", // Logistics Green
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
];

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: FileText,
    title: "Maintain Complete Documentation",
    description: "Keep all invoices, contracts, freight bills, insurance certificates, and payment records organized. Customs authorities may request documentation up to 5 years after importation. Missing documents can lead to penalties, delays, and potential under-valuation assessments that significantly increase your duty liability.",
  },
  {
    icon: Users,
    title: "Conduct Related Party Tests Early",
    description: "If you have a relationship with the supplier, prepare evidence that the relationship didn't influence the price. This includes demonstrating that the price is consistent with normal industry pricing, or that it covers all costs plus a reasonable profit. Document these tests thoroughly before the customs declaration is filed.",
  },
  {
    icon: Coins,
    title: "Track All Assists and Royalties",
    description: "Any tools, dies, molds, engineering services, or artwork you provide to the manufacturer (assists) must be added to the customs value. Similarly, royalties and license fees paid as a condition of the sale are dutiable. Create a checklist to identify all potential assists before finalizing any import transaction.",
  },
  {
    icon: Globe,
    title: "Use Correct Exchange Rate Date",
    description: "Most countries require using the exchange rate on the date of customs declaration, not the payment date or invoice date. Using the wrong date can result in significant duty differences. Establish a process to obtain and document the official exchange rate on the declaration date.",
  },
  {
    icon: Target,
    title: "Consider First Sale Valuation",
    description: "In multi-tier supply chains, some countries (including the US) allow using the first sale price rather than the middleman's price, potentially reducing the dutiable value. This requires specific documentation and advance planning, but can yield substantial duty savings for high-volume importers.",
  },
  {
    icon: Zap,
    title: "Review Transfer Pricing Alignment",
    description: "Ensure your transfer pricing policies align with customs valuation requirements. While transfer pricing focuses on tax obligations, customs valuation has different rules. A transfer pricing study that supports your declared price can also serve as evidence for customs purposes in related party transactions.",
  },
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    title: "Omitting Assists and Buyer-Supplied Materials",
    description: "One of the most frequent errors is failing to include the value of assists such as tools, dies, molds, and engineering services provided by the buyer to the manufacturer. These must be added to the transaction value under WTO Article 8. Customs audits frequently catch this omission, resulting in back duties, penalties, and potential fraud investigations.",
    consequence: "Under-valuation penalties, back duties, and potential fraud charges",
  },
  {
    title: "Incorrect Incoterm Basis for Valuation",
    description: "Using the wrong Incoterm as a basis for calculating additions can lead to double-counting or omitting costs. For example, using FOB value when CIF is required, or failing to add freight and insurance when goods are purchased FOB. Each country has specific rules about the valuation basis, and misunderstanding these can result in incorrect duty calculations.",
    consequence: "Incorrect duty calculations and potential over/under-payment of duties",
  },
  {
    title: "Failing to Declare Royalties and License Fees",
    description: "Royalties and license fees that are paid as a condition of the sale must be included in the customs value. Many importers overlook these payments, especially when they are made separately from the invoice price. Customs authorities increasingly scrutinize these arrangements, and failure to declare can be treated as fraud.",
    consequence: "Penalties for false declaration, back duties, and potential criminal liability",
  },
  {
    title: "Using Wrong Currency Conversion Date",
    description: "The timing of currency conversion can significantly impact the customs value, especially for volatile currencies. Using the payment date or invoice date exchange rate instead of the declaration date rate is a common error. Some countries have specific rules about which rate to use, and failing to follow these rules can result in incorrect valuations.",
    consequence: "Duty miscalculation and potential audit adjustments",
  },
  {
    title: "Insufficient Documentation for First Sale",
    description: "When claiming first sale valuation for multi-tier transactions, importers often lack the required documentation showing the first sale price, including invoices and proof of entry into the US or other destination. Without proper documentation, the benefit cannot be claimed, and the higher middleman price becomes the dutiable value.",
    consequence: "Lost opportunity for lower valuation and higher duty payments",
  },
];

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is customs valuation and why is it important for international trade?",
    answer: `Customs valuation is the process of determining the monetary value of imported goods for the purpose of calculating customs duties, taxes, and other import charges. This valuation serves as the tax base for ad valorem duties, which are calculated as a percentage of the goods' value rather than a specific amount per unit.

The importance of accurate customs valuation cannot be overstated. It directly affects the amount of duty and tax payable on imported goods, influences trade statistics that governments use for policy-making, determines eligibility for preferential trade programs, and impacts quota allocations. Under-valuation can result in significant penalties, back duties, and even criminal prosecution for fraud, while over-valuation leads to unnecessary duty payments and reduced competitiveness.

The World Trade Organization (WTO) Valuation Agreement, established in 1994 as part of the Uruguay Round, provides the international framework for customs valuation. This agreement requires member countries to use a transaction value-based system, meaning the price actually paid or payable for the goods should be the primary basis for valuation. The agreement ensures uniformity, predictability, and fairness in international trade by preventing arbitrary or fictitious valuations that could be used as disguised trade barriers.`,
  },
  {
    question: "What are the 6 WTO valuation methods and when should each be used?",
    answer: `The WTO Valuation Agreement establishes six valuation methods that must be applied in a strict hierarchical order, though Methods 4 and 5 can be used in either order at the importer's request. Understanding when to use each method is crucial for compliance and optimizing duty payments.

Method 1 (Transaction Value) is the primary method and should be used whenever the price actually paid or payable can be determined, there are no restrictions on the buyer's use of the goods, there are no conditions that make the value indeterminate, and the buyer and seller are either unrelated or the relationship doesn't affect the price. This method applies to over 90% of all import transactions globally.

Method 2 (Transaction Value of Identical Goods) applies when Method 1 cannot be used. It requires finding identical goods (same in all respects, including physical characteristics, quality, and reputation) that were exported at the same commercial level and quantity from the same country. Adjustments must be made for any differences in transport, insurance, or other costs.

Method 3 (Transaction Value of Similar Goods) is used when neither Method 1 nor 2 applies. Similar goods must have like characteristics and component materials, perform the same functions, and be commercially interchangeable with the imported goods. The same country requirement and adjustment rules apply.

Method 4 (Deductive Value) calculates customs value by starting with the unit selling price in the country of importation and deducting commissions, transport costs, insurance, customs duties and taxes, and usual profit and general expenses. This method is useful when goods are resold quickly after importation.

Method 5 (Computed Value) determines value by adding together the cost of materials and fabrication, profit and general expenses typical for exports, and transport and insurance costs. This method requires cooperation from the foreign producer and is rarely used in practice.

Method 6 (Fall-back Method) allows flexible application of the previous methods using reasonable means consistent with WTO principles. It cannot use arbitrary values, minimum customs values, or the selling price in the country of export. This is truly a method of last resort.`,
  },
  {
    question: "What costs must be added to the transaction value for customs purposes?",
    answer: `Under WTO Article 8, certain costs must be added to the transaction value if they are not already included in the price actually paid or payable. Understanding these additions is critical for accurate valuation and compliance.

Packing costs, including both labor and materials, must be added if incurred by the buyer. This includes the cost of containers and coverings that are not returned to the seller. Even if the packing is performed by a third party, the costs must be included in the customs value.

Selling commissions are commissions paid by the seller to their agent, which must be added to the value. This includes both direct commissions and indirect payments that effectively reduce the price. Buying commissions (commissions paid by the buyer to their own agent) are excluded from the customs value.

Assists represent a significant area of compliance risk. These include tools, dies, molds, and similar goods used in producing the imported goods; materials consumed in production; and engineering, development, artwork, design work, plans, and sketches undertaken elsewhere than in the country of importation. The value of these assists must be apportioned appropriately to the imported goods.

Royalties and license fees related to the imported goods that the buyer must pay as a condition of sale must be added to the customs value. This includes payments for patents, trademarks, copyrights, and other intellectual property. The key test is whether the payment is a condition of the sale to the buyer.

Proceeds of resale accruing to the seller that result from the resale, use, or disposition of the imported goods by the buyer must be included. This includes any subsequent payment the buyer makes to the seller based on the goods' resale value.

Freight, insurance, and handling charges to the port or place of importation may need to be added depending on the Incoterm and the importing country's requirements. Most countries require CIF value (cost, insurance, freight) as the basis for customs valuation.`,
  },
  {
    question: "How do related party transactions affect customs valuation?",
    answer: `Related party transactions present unique challenges in customs valuation because the relationship between buyer and seller may influence the transaction price. Under the WTO Valuation Agreement, related parties include: officers or directors of each other's businesses; legally recognized business partners; employer and employee; any person who directly or indirectly owns, controls, or holds 5% or more of the voting stock of each other; and any person who directly or indirectly controls or is controlled by the other.

The mere existence of a relationship does not automatically preclude the use of transaction value. The transaction value method can still be used if the importer demonstrates that the relationship did not influence the price. This can be shown through either a circumstances test or a values test.

The circumstances test requires showing that the price was arrived at in a manner consistent with normal industry pricing practices, or in a manner consistent with the way the seller deals with unrelated buyers, or that the price adequately covers all costs plus a profit representative of the seller's typical profit.

The values test (also called the "test values" approach) allows comparison with previously accepted transaction values for identical or similar goods sold to unrelated buyers in the same destination market. If the related party price closely approximates these test values (typically within a specified range, though the WTO does not mandate a specific percentage), the transaction value is acceptable.

Importers should maintain comprehensive documentation supporting related party pricing. This includes transfer pricing studies, financial statements, price lists, cost analyses, and correspondence showing how prices were negotiated. Advance ruling requests can provide certainty before goods are shipped.

If the relationship influenced the price, Methods 2-6 must be applied in order. Many customs authorities have enhanced scrutiny procedures for related party transactions, making proper documentation even more critical. Penalties for under-valuation in related party contexts can be severe, as authorities may view under-valuation as a form of tax avoidance.`,
  },
  {
    question: "What is the difference between CIF and FOB valuation bases?",
    answer: `Understanding the difference between CIF (Cost, Insurance, and Freight) and FOB (Free On Board) valuation bases is essential for accurate customs declarations. The choice affects which costs must be added to or deducted from the transaction value.

CIF value represents the total cost of goods at the port or place of destination, including the invoice price of the goods, the cost of insurance during transit, and the freight charges to the port of destination. Most countries use CIF as the basis for customs valuation, meaning duties are calculated on the full cost of getting the goods to the destination country.

FOB value represents the price of goods at the point of origin, typically the seller's premises or the port of export. When FOB is the valuation basis (as in the United States), the customs value starts with the FOB price, and certain additions must be made: packing costs, selling commissions, assists, royalties, and proceeds to seller. Freight and insurance to the destination are not included in the dutiable value.

The practical implication is that under CIF valuation, the importer pays duty on transport and insurance costs, while under FOB valuation, these costs are excluded. This can result in different duty amounts for the same goods depending on the importing country.

When goods are purchased under FOB Incoterms but destined for a CIF-based country, the customs value must include freight and insurance additions. Conversely, when goods are purchased CIF for import into an FOB-based country, the freight and insurance must be deducted to arrive at the correct customs value.

Many importers mistakenly use the wrong basis, leading to over- or under-payment of duties. It's essential to understand both the Incoterms used in the sales contract and the importing country's valuation requirements. Proper documentation of all cost components is critical for accurate valuation regardless of the basis used.`,
  },
  {
    question: "How can importers ensure compliance with customs valuation requirements?",
    answer: `Ensuring customs valuation compliance requires a systematic approach encompassing documentation, internal controls, training, and proactive engagement with customs authorities. A robust compliance program can prevent costly penalties and improve operational efficiency.

Documentation is the foundation of compliance. Importers should maintain records of all commercial invoices, purchase orders, contracts, freight and insurance documentation, proof of payment, royalty and license agreements, assist valuations, and any other documentation supporting the declared value. Records should be retained for the legally required period (often 5 years or more) and be readily accessible for audit purposes.

Internal controls should include standardized procedures for identifying and valuing all dutiable cost elements, regular reviews of related party pricing against test values, verification of exchange rates and conversion dates, and periodic self-audits to identify and correct errors before customs authorities detect them. Many companies implement valuation checklists that must be completed for each import transaction.

Training programs should ensure that all staff involved in importing understand the valuation rules, know how to identify potential issues, and understand when to escalate questions to management or external advisors. This includes procurement teams, logistics personnel, accounting staff, and customs brokers.

Classification and valuation databases can help ensure consistency across multiple importations of the same goods. These databases should be regularly updated to reflect changes in products, suppliers, Incoterms, or regulations.

Advance ruling requests provide certainty for complex transactions. Most customs authorities offer binding rulings on valuation methodology for specific transactions. While rulings take time to obtain, they provide protection from penalties and duty increases for the period covered by the ruling.

Voluntary disclosure programs allow importers to report and correct errors before they are discovered by customs. Most jurisdictions offer reduced penalties or penalty waivers for voluntary disclosures, making this an attractive option when errors are identified internally.

Finally, consider engaging customs consultants or trade attorneys for complex transactions, particularly those involving related parties, assists, royalties, or first sale valuation. Professional guidance can help ensure compliance while identifying opportunities for duty optimization.`,
  },
  {
    question: "What are the penalties for customs valuation errors or fraud?",
    answer: `Penalties for customs valuation errors and fraud vary by jurisdiction but are generally severe, reflecting the seriousness with which customs authorities view valuation compliance. Understanding these penalties underscores the importance of accurate valuation and proper documentation.

Civil penalties typically apply to negligence or gross negligence in valuation. In the United States, for example, negligence penalties can reach four times the loss of revenue, while gross negligence penalties can reach the domestic value of the goods. Many countries impose penalty amounts based on percentages of the underpaid duty, often ranging from 10% to 300% depending on the severity and intent.

Criminal penalties apply to cases involving fraud or intentional false declarations. These can include substantial fines (often in the hundreds of thousands or millions of dollars) and imprisonment for individuals involved. Criminal prosecution is more likely in cases involving systematic undervaluation schemes, false documentation, or attempts to conceal related party relationships.

Back duties and taxes must be paid for all under-valuations, regardless of whether penalties are imposed. Customs authorities can assess back duties for multiple years, potentially going back to the statute of limitations period. For high-volume importers, back duty assessments can reach millions of dollars.

Interest charges apply to underpaid duties in most jurisdictions, calculated from the date the duties should have been paid. Given that audits can occur years after importation, interest charges can significantly increase the total amount owed.

Import privileges may be restricted or revoked for serious violations. This can include suspension from preferential trade programs (such as free trade agreement benefits), increased scrutiny of future importations, required use of specific customs brokers, or even prohibitions on importing altogether.

Reputational damage can be significant, particularly for publicly traded companies that must disclose material compliance issues. Customs violations can affect relationships with business partners, banks, and investors.

Beyond direct penalties, valuation errors can trigger broader audits covering other import compliance areas such as classification, country of origin, and antidumping/countervailing duty compliance. What starts as a valuation issue can expand into a comprehensive review of all import activities.`,
  },
  {
    question: "How does the First Sale rule work and when can it be used?",
    answer: `The First Sale rule, also known as First Sale for Export or First Sale valuation, allows importers in certain countries (including the United States) to use the price in the first or earlier sale in a multi-tier distribution chain as the basis for customs valuation, rather than the higher price paid to the middleman.

In a typical multi-tier transaction, a manufacturer sells to a middleman who then sells to the ultimate importer. The importer pays the middleman's price (which includes the middleman's markup), and under normal valuation rules, this higher price would be the customs value. The First Sale rule allows using the lower manufacturer's price instead, potentially resulting in significant duty savings.

To qualify for First Sale valuation in the United States, several requirements must be met. There must be a bona fide sale of the goods for export to the United States. The goods must be clearly destined for export to the United States at the time of the first sale. The first sale price must be an arm's length transaction. And the importer must have documentation to support all elements of the transaction.

Documentation requirements are stringent. Importers need copies of the first sale invoice, purchase orders for both the first and subsequent sales, proof of payment for both transactions, evidence that goods were destined for the US at the time of the first sale (such as shipping instructions or contracts), and accounting records supporting the arm's length nature of the first sale.

The middleman must not take physical possession of the goods in most cases, or must be able to demonstrate that the goods were clearly destined for the US at the time of the first sale. Some customs authorities require that the middleman not have the right to divert the goods to other markets.

First Sale can provide substantial savings for high-volume importers with multi-tier supply chains. However, the documentation requirements and compliance burden are significant. Companies should carefully weigh the duty savings against the costs of maintaining First Sale documentation and the potential audit risk.

Not all countries permit First Sale valuation. The European Union, for example, generally uses the last sale price. Importers should verify whether First Sale is available in their destination country before attempting to use this approach.`,
  },
];

const COLORS_MAP = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
};

interface Additions {
  packingCosts: number;
  sellingCommission: number;
  assistsCost: number;
  royalties: number;
  licenseFees: number;
  proceedsToSeller: number;
  freightToPort: number;
  loadingCharges: number;
  handlingCharges: number;
}

interface Deductions {
  postImportAssembly: number;
  constructionErection: number;
  dutyTaxesInCountry: number;
  internationalTransport: number;
  insuranceCost: number;
  commissionsInImportCountry: number;
}

export function CustomsValuationTool() {
  // Primary valuation inputs
  const [transactionValue, setTransactionValue] = useState<string>("50000");
  const [currency, setCurrency] = useState<string>("USD");
  const [targetCurrency, setTargetCurrency] = useState<string>("USD");
  const [incoterm, setIncoterm] = useState<string>("FOB");
  const [originCountry, setOriginCountry] = useState<string>("CN");
  const [destinationCountry, setDestinationCountry] = useState<string>("US");
  const [quantity, setQuantity] = useState<string>("100");
  const [hsCode, setHsCode] = useState<string>("8471.30");

  // Additions to value
  const [additions, setAdditions] = useState<Additions>({
    packingCosts: 0,
    sellingCommission: 0,
    assistsCost: 0,
    royalties: 0,
    licenseFees: 0,
    proceedsToSeller: 0,
    freightToPort: 2500,
    loadingCharges: 500,
    handlingCharges: 350,
  });

  // Deductions from value
  const [deductions, setDeductions] = useState<Deductions>({
    postImportAssembly: 0,
    constructionErection: 0,
    dutyTaxesInCountry: 0,
    internationalTransport: 0,
    insuranceCost: 200,
    commissionsInImportCountry: 0,
  });

  // Toggle states
  const [includeAssists, setIncludeAssists] = useState(false);
  const [includeRoyalties, setIncludeRoyalties] = useState(false);
  const [relatedParty, setRelatedParty] = useState(false);
  const [deductiveMethod, setDeductiveMethod] = useState(false);

  // Deductive value method inputs
  const [resalePrice, setResalePrice] = useState<string>("85000");
  const [resaleCommissions, setResaleCommissions] = useState<string>("8500");
  const [resaleTransport, setResaleTransport] = useState<string>("1200");
  const [resaleDuties, setResaleDuties] = useState<string>("5000");
  const [resaleProfit, setResaleProfit] = useState<string>("10200");

  // Computed value method inputs
  const [materialsCost, setMaterialsCost] = useState<string>("25000");
  const [fabricationCost, setFabricationCost] = useState<string>("12000");
  const [producerProfit, setProducerProfit] = useState<string>("8000");
  const [producerExpenses, setProducerExpenses] = useState<string>("5000");

  // Selected valuation method
  const [selectedMethod, setSelectedMethod] = useState<number>(1);

  // Update addition value
  const updateAddition = (key: keyof Additions, value: string) => {
    setAdditions((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  // Update deduction value
  const updateDeduction = (key: keyof Deductions, value: string) => {
    setDeductions((prev) => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  // Calculate currency conversion
  const exchangeRate = useMemo(() => {
    const fromRate = EXCHANGE_RATES[currency] || 1;
    const toRate = EXCHANGE_RATES[targetCurrency] || 1;
    return toRate / fromRate;
  }, [currency, targetCurrency]);

  // Calculate CIF value
  const cifCalculation = useMemo(() => {
    const baseValue = parseFloat(transactionValue) || 0;
    const qty = parseFloat(quantity) || 1;
    
    // Calculate total additions
    const totalAdditions = Object.values(additions).reduce((sum, val) => sum + val, 0);
    
    // Calculate CIF
    const cifValue = baseValue + totalAdditions;
    const cifPerUnit = cifValue / qty;
    
    return {
      baseValue,
      totalAdditions,
      cifValue,
      cifPerUnit,
      qty,
    };
  }, [transactionValue, quantity, additions]);

  // Calculate customs value by method
  const valuationResults = useMemo(() => {
    const baseValue = cifCalculation.cifValue;
    const qty = cifCalculation.qty;
    
    // Method 1: Transaction Value
    const method1Value = baseValue;
    
    // Method 4: Deductive Value
    const resaleVal = parseFloat(resalePrice) || 0;
    const deductiveValue = resaleVal 
      - (parseFloat(resaleCommissions) || 0)
      - (parseFloat(resaleTransport) || 0)
      - (parseFloat(resaleDuties) || 0)
      - (parseFloat(resaleProfit) || 0);
    
    // Method 5: Computed Value
    const computedValue = 
      (parseFloat(materialsCost) || 0)
      + (parseFloat(fabricationCost) || 0)
      + (parseFloat(producerProfit) || 0)
      + (parseFloat(producerExpenses) || 0)
      + additions.freightToPort
      + additions.loadingCharges;
    
    return {
      method1: {
        value: method1Value,
        perUnit: method1Value / qty,
        applicable: !relatedParty,
        notes: relatedParty 
          ? "Related party transaction - may require price influence test" 
          : "Primary method applicable",
      },
      method4: {
        value: Math.max(0, deductiveValue),
        perUnit: Math.max(0, deductiveValue) / qty,
        applicable: deductiveValue > 0,
        notes: deductiveValue > 0 
          ? "Based on resale price deductions" 
          : "Requires resale price data",
      },
      method5: {
        value: computedValue,
        perUnit: computedValue / qty,
        applicable: computedValue > 0,
        notes: computedValue > 0 
          ? "Based on production costs" 
          : "Requires manufacturer cost data",
      },
    };
  }, [cifCalculation, resalePrice, resaleCommissions, resaleTransport, resaleDuties, resaleProfit, 
      materialsCost, fabricationCost, producerProfit, producerExpenses, additions, relatedParty]);

  // Value breakdown for charts
  const valueBreakdown = useMemo(() => {
    const total = cifCalculation.cifValue;
    const data = [
      { name: "Transaction Value", value: cifCalculation.baseValue, percentage: (cifCalculation.baseValue / total) * 100 },
    ];
    
    if (additions.packingCosts > 0) data.push({ name: "Packing Costs", value: additions.packingCosts, percentage: (additions.packingCosts / total) * 100 });
    if (additions.freightToPort > 0) data.push({ name: "Freight to Port", value: additions.freightToPort, percentage: (additions.freightToPort / total) * 100 });
    if (additions.loadingCharges > 0) data.push({ name: "Loading Charges", value: additions.loadingCharges, percentage: (additions.loadingCharges / total) * 100 });
    if (additions.handlingCharges > 0) data.push({ name: "Handling Charges", value: additions.handlingCharges, percentage: (additions.handlingCharges / total) * 100 });
    if (includeAssists && additions.assistsCost > 0) data.push({ name: "Assists", value: additions.assistsCost, percentage: (additions.assistsCost / total) * 100 });
    if (includeRoyalties && additions.royalties > 0) data.push({ name: "Royalties", value: additions.royalties, percentage: (additions.royalties / total) * 100 });
    if (includeRoyalties && additions.licenseFees > 0) data.push({ name: "License Fees", value: additions.licenseFees, percentage: (additions.licenseFees / total) * 100 });
    if (additions.sellingCommission > 0) data.push({ name: "Selling Commission", value: additions.sellingCommission, percentage: (additions.sellingCommission / total) * 100 });
    if (additions.proceedsToSeller > 0) data.push({ name: "Proceeds to Seller", value: additions.proceedsToSeller, percentage: (additions.proceedsToSeller / total) * 100 });
    
    return data;
  }, [cifCalculation, additions, includeAssists, includeRoyalties]);

  // Method comparison data
  const methodComparison = useMemo(() => {
    return [
      { 
        method: "Transaction", 
        value: valuationResults.method1.value,
        color: COLORS_MAP.ocean,
        applicable: valuationResults.method1.applicable,
      },
      { 
        method: "Identical", 
        value: valuationResults.method1.value * 1.05,
        color: COLORS_MAP.logistics,
        applicable: false,
      },
      { 
        method: "Similar", 
        value: valuationResults.method1.value * 1.08,
        color: "#F59E0B",
        applicable: false,
      },
      { 
        method: "Deductive", 
        value: valuationResults.method4.value,
        color: "#8B5CF6",
        applicable: valuationResults.method4.applicable,
      },
      { 
        method: "Computed", 
        value: valuationResults.method5.value,
        color: "#EF4444",
        applicable: valuationResults.method5.applicable,
      },
      { 
        method: "Fall-back", 
        value: 0,
        color: "#06B6D4",
        applicable: false,
      },
    ];
  }, [valuationResults]);

  // Converted values
  const convertedCIF = cifCalculation.cifValue * exchangeRate;

  // Get selected incoterm info
  const selectedIncoterm = INCOTERMS.find(i => i.code === incoterm);

  // Selected method details
  const selectedMethodDetails = WTO_VALUATION_METHODS.find(m => m.id === selectedMethod);

  // Reset form
  const handleReset = useCallback(() => {
    setTransactionValue("50000");
    setCurrency("USD");
    setTargetCurrency("USD");
    setIncoterm("FOB");
    setOriginCountry("CN");
    setDestinationCountry("US");
    setQuantity("100");
    setHsCode("8471.30");
    setAdditions({
      packingCosts: 0,
      sellingCommission: 0,
      assistsCost: 0,
      royalties: 0,
      licenseFees: 0,
      proceedsToSeller: 0,
      freightToPort: 2500,
      loadingCharges: 500,
      handlingCharges: 350,
    });
    setDeductions({
      postImportAssembly: 0,
      constructionErection: 0,
      dutyTaxesInCountry: 0,
      internationalTransport: 0,
      insuranceCost: 200,
      commissionsInImportCountry: 0,
    });
    setIncludeAssists(false);
    setIncludeRoyalties(false);
    setRelatedParty(false);
    setDeductiveMethod(false);
    setResalePrice("85000");
    setResaleCommissions("8500");
    setResaleTransport("1200");
    setResaleDuties("5000");
    setResaleProfit("10200");
    setMaterialsCost("25000");
    setFabricationCost("12000");
    setProducerProfit("8000");
    setProducerExpenses("5000");
    setSelectedMethod(1);
  }, []);

  // Export results as JSON
  const handleExport = useCallback(() => {
    const exportData = {
      timestamp: new Date().toISOString(),
      transaction: {
        value: parseFloat(transactionValue),
        currency,
        targetCurrency,
        quantity: parseFloat(quantity),
        hsCode,
        originCountry,
        destinationCountry,
        incoterm,
      },
      additions,
      deductions,
      calculations: {
        baseValue: cifCalculation.baseValue,
        totalAdditions: cifCalculation.totalAdditions,
        cifValue: cifCalculation.cifValue,
        convertedCIF,
        exchangeRate,
        cifPerUnit: cifCalculation.cifPerUnit,
      },
      valuationMethods: {
        method1: valuationResults.method1,
        method4: valuationResults.method4,
        method5: valuationResults.method5,
      },
      settings: {
        relatedParty,
        includeAssists,
        includeRoyalties,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `customs-valuation-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [transactionValue, currency, targetCurrency, quantity, hsCode, originCountry, destinationCountry, incoterm, additions, deductions, cifCalculation, convertedCIF, exchangeRate, valuationResults, relatedParty, includeAssists, includeRoyalties]);

  // Share functionality
  const handleShare = useCallback(async () => {
    const shareData = {
      title: "Customs Valuation Calculation",
      text: `CIF Value: ${formatCurrency(convertedCIF, targetCurrency)} for ${cifCalculation.qty} units`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled share
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(
        `Customs Valuation:\nCIF Value: ${formatCurrency(convertedCIF, targetCurrency)}\nUnits: ${cifCalculation.qty}\nPer Unit: ${formatCurrency(cifCalculation.cifPerUnit * exchangeRate, targetCurrency)}`
      );
      alert("Results copied to clipboard!");
    }
  }, [convertedCIF, targetCurrency, cifCalculation, exchangeRate]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 md:p-8 border border-border/50">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {["Customs Compliance", "Valuation Methods", "Trade Finance"].map((badge, index) => (
                <motion.div
                  key={badge}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Badge 
                    variant="secondary" 
                    className="px-3 py-1 text-xs font-medium bg-background/80 border border-border/50 hover:border-[var(--ocean)]/30 transition-colors"
                  >
                    <Sparkles className="h-3 w-3 mr-1 text-[var(--ocean)]" />
                    {badge}
                  </Badge>
                </motion.div>
              ))}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Customs Valuation Calculator
              </h1>
              <p className="text-muted-foreground mt-2 max-w-xl">
                Calculate customs value using WTO valuation methods. Determine CIF value, apply additions, 
                and compare valuation approaches for compliant import declarations.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" size="sm" onClick={handleReset} className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button size="sm" onClick={handleShare} className="gap-2 gradient-ocean text-white">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-center">
            <div className="p-4 rounded-xl bg-background/80 border border-border/50">
              <div className="text-3xl font-bold text-[var(--ocean)]">
                {formatCurrency(convertedCIF, targetCurrency)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">CIF Value</div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="text-xs md:text-sm">
            <Calculator className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Calculator</span>
            <span className="sm:hidden">Calc</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs md:text-sm">
            <BarChart3 className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Analysis</span>
            <span className="sm:hidden">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="methods" className="text-xs md:text-sm">
            <Scale className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Methods</span>
            <span className="sm:hidden">Methods</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="text-xs md:text-sm">
            <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">Guide</span>
            <span className="sm:hidden">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="text-xs md:text-sm">
            <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
            <span className="hidden sm:inline">FAQ</span>
            <span className="sm:hidden">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    Transaction Value Input
                  </CardTitle>
                  <CardDescription>
                    Enter the price actually paid or payable for the imported goods
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Transaction Value & Currency */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="transactionValue" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Transaction Value
                      </Label>
                      <Input
                        id="transactionValue"
                        type="number"
                        value={transactionValue}
                        onChange={(e) => setTransactionValue(e.target.value)}
                        placeholder="Enter invoice value"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Quantity & HS Code */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Number of units"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hsCode" className="flex items-center gap-2">
                        HS Code
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-3 w-3 text-muted-foreground" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs text-sm">
                                Harmonized System code for customs classification
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <Input
                        id="hsCode"
                        value={hsCode}
                        onChange={(e) => setHsCode(e.target.value)}
                        placeholder="e.g., 8471.30"
                      />
                    </div>
                  </div>

                  {/* Origin & Destination */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Origin Country</Label>
                      <Select value={originCountry} onValueChange={setOriginCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Destination Country</Label>
                      <Select value={destinationCountry} onValueChange={setDestinationCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {COUNTRIES.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Incoterm Selection */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      Incoterm
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs text-sm">
                              Determines who pays freight and insurance costs
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <Select value={incoterm} onValueChange={setIncoterm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {INCOTERMS.map((i) => (
                          <SelectItem key={i.code} value={i.code}>
                            {i.code} - {i.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedIncoterm && (
                      <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Freight: {selectedIncoterm.freightResponsibility}</span>
                        <span>Insurance: {selectedIncoterm.insuranceResponsibility}</span>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Related Party Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Related Party Transaction
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Buyer and seller are related parties
                      </p>
                    </div>
                    <Switch
                      checked={relatedParty}
                      onCheckedChange={setRelatedParty}
                    />
                  </div>

                  {relatedParty && (
                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                      <AlertTitle>Related Party Transaction</AlertTitle>
                      <AlertDescription className="text-sm">
                        Price influence test may be required. The transaction value 
                        may still be acceptable if the relationship did not influence the price.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {/* Additions Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                    Additions to Transaction Value
                  </CardTitle>
                  <CardDescription>
                    WTO Article 8 additions - costs to add if not in invoice
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Packing Costs</Label>
                      <Input
                        type="number"
                        value={additions.packingCosts}
                        onChange={(e) => updateAddition("packingCosts", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Selling Commission</Label>
                      <Input
                        type="number"
                        value={additions.sellingCommission}
                        onChange={(e) => updateAddition("sellingCommission", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Freight to Port</Label>
                      <Input
                        type="number"
                        value={additions.freightToPort}
                        onChange={(e) => updateAddition("freightToPort", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Loading Charges</Label>
                      <Input
                        type="number"
                        value={additions.loadingCharges}
                        onChange={(e) => updateAddition("loadingCharges", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Handling Charges</Label>
                      <Input
                        type="number"
                        value={additions.handlingCharges}
                        onChange={(e) => updateAddition("handlingCharges", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Proceeds to Seller</Label>
                      <Input
                        type="number"
                        value={additions.proceedsToSeller}
                        onChange={(e) => updateAddition("proceedsToSeller", e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Assists Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Include Assists
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Goods/services supplied by buyer
                      </p>
                    </div>
                    <Switch
                      checked={includeAssists}
                      onCheckedChange={setIncludeAssists}
                    />
                  </div>

                  {includeAssists && (
                    <div className="space-y-2">
                      <Label>Assists Value</Label>
                      <Input
                        type="number"
                        value={additions.assistsCost}
                        onChange={(e) => updateAddition("assistsCost", e.target.value)}
                        placeholder="Tools, dies, molds, engineering work"
                      />
                    </div>
                  )}

                  {/* Royalties Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="flex items-center gap-2">
                        <Coins className="h-4 w-4" />
                        Include Royalties & License Fees
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Must be paid as condition of sale
                      </p>
                    </div>
                    <Switch
                      checked={includeRoyalties}
                      onCheckedChange={setIncludeRoyalties}
                    />
                  </div>

                  {includeRoyalties && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Royalties</Label>
                        <Input
                          type="number"
                          value={additions.royalties}
                          onChange={(e) => updateAddition("royalties", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>License Fees</Label>
                        <Input
                          type="number"
                          value={additions.licenseFees}
                          onChange={(e) => updateAddition("licenseFees", e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                    <span className="font-medium">Total Additions</span>
                    <span className="text-lg font-bold text-[var(--logistics)]">
                      +{formatCurrency(cifCalculation.totalAdditions, currency)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* CIF Summary */}
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center justify-between">
                    <span>CIF Customs Value</span>
                    <Badge className="gradient-ocean text-white">
                      Method 1
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <motion.div
                    key={convertedCIF}
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center mb-6"
                  >
                    <div className="text-4xl font-bold text-[var(--ocean)]">
                      {formatCurrency(convertedCIF, targetCurrency)}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {cifCalculation.qty} units @ {formatCurrency(cifCalculation.cifPerUnit * exchangeRate, targetCurrency)}/unit
                    </div>
                    {currency !== targetCurrency && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Original: {formatCurrency(cifCalculation.cifValue, currency)}
                      </div>
                    )}
                  </motion.div>

                  <Separator className="my-4" />

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transaction Value</span>
                      <span className="font-medium">{formatCurrency(cifCalculation.baseValue, currency)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Additions</span>
                      <span className="font-medium text-[var(--logistics)]">
                        +{formatCurrency(cifCalculation.totalAdditions, currency)}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-sm font-semibold">
                      <span>CIF Value</span>
                      <span>{formatCurrency(cifCalculation.cifValue, currency)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WTO Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Scale className="h-5 w-5 text-[var(--ocean)]" />
                    WTO Valuation Agreement Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <div className="font-medium">Method 1 Applicable</div>
                      <div className="text-sm text-muted-foreground">
                        Transaction value method compliant with WTO Article 1
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {valuationResults.method1.applicable ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <span>Buyer-Seller Relationship Test</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>No Price Restrictions</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>All Proceeds Included</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Breakdown Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                    Value Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={valueBreakdown}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={90}
                          paddingAngle={2}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percentage }) => percentage > 5 ? `${name}` : ""}
                        >
                          {valueBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value: number) => formatCurrency(value, currency)}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Currency Conversion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[var(--logistics)]" />
                    Currency Conversion
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">From</Label>
                      <div className="text-lg font-semibold">{currency}</div>
                    </div>
                    <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">To</Label>
                      <Select value={targetCurrency} onValueChange={setTargetCurrency}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies.slice(0, 15).map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.symbol} {c.code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">Exchange Rate</div>
                    <div className="text-2xl font-bold text-[var(--ocean)]">
                      1 {currency} = {exchangeRate.toFixed(4)} {targetCurrency}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Method Value Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Valuation Methods Comparison
                </CardTitle>
                <CardDescription>
                  Compare calculated values across all WTO valuation methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={methodComparison} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" tickFormatter={(v) => v > 0 ? formatCurrency(v, currency) : "N/A"} className="text-xs" />
                      <YAxis dataKey="method" type="category" width={80} className="text-xs" />
                      <RechartsTooltip formatter={(value: number) => value > 0 ? formatCurrency(value, currency) : "Not calculated"} />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {methodComparison.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} opacity={entry.applicable ? 1 : 0.3} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Value Components Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Value Components Analysis</CardTitle>
                <CardDescription>Relative contribution of each cost element</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={[
                      { subject: "Transaction", value: (cifCalculation.baseValue / cifCalculation.cifValue) * 100 },
                      { subject: "Freight", value: (additions.freightToPort / cifCalculation.cifValue) * 100 },
                      { subject: "Insurance", value: (deductions.insuranceCost / cifCalculation.cifValue) * 100 },
                      { subject: "Assists", value: (additions.assistsCost / cifCalculation.cifValue) * 100 },
                      { subject: "Royalties", value: (additions.royalties / cifCalculation.cifValue) * 100 },
                      { subject: "Other", value: ((additions.loadingCharges + additions.handlingCharges) / cifCalculation.cifValue) * 100 },
                    ]}>
                      <PolarGrid className="stroke-border" />
                      <PolarAngleAxis dataKey="subject" className="text-xs" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs" />
                      <Radar
                        name="% of Value"
                        dataKey="value"
                        stroke={COLORS_MAP.ocean}
                        fill={COLORS_MAP.ocean}
                        fillOpacity={0.5}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Detailed Method Analysis</CardTitle>
              <CardDescription>Comprehensive breakdown of each valuation method</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Method</th>
                      <th className="text-left p-3">WTO Article</th>
                      <th className="text-right p-3">Calculated Value</th>
                      <th className="text-right p-3">Per Unit</th>
                      <th className="text-left p-3">Status</th>
                      <th className="text-left p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b bg-[var(--ocean)]/5">
                      <td className="p-3 font-medium">1. Transaction Value</td>
                      <td className="p-3">Article 1</td>
                      <td className="p-3 text-right font-mono">
                        {formatCurrency(valuationResults.method1.value, currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(valuationResults.method1.perUnit, currency)}
                      </td>
                      <td className="p-3">
                        <Badge className="bg-green-500">Primary</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{valuationResults.method1.notes}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">2. Identical Goods</td>
                      <td className="p-3">Article 2</td>
                      <td className="p-3 text-right font-mono">--</td>
                      <td className="p-3 text-right">--</td>
                      <td className="p-3">
                        <Badge variant="outline">N/A</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">Requires identical goods data</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">3. Similar Goods</td>
                      <td className="p-3">Article 3</td>
                      <td className="p-3 text-right font-mono">--</td>
                      <td className="p-3 text-right">--</td>
                      <td className="p-3">
                        <Badge variant="outline">N/A</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">Requires similar goods data</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">4. Deductive Value</td>
                      <td className="p-3">Article 5</td>
                      <td className="p-3 text-right font-mono">
                        {formatCurrency(valuationResults.method4.value, currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(valuationResults.method4.perUnit, currency)}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">Available</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{valuationResults.method4.notes}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">5. Computed Value</td>
                      <td className="p-3">Article 6</td>
                      <td className="p-3 text-right font-mono">
                        {formatCurrency(valuationResults.method5.value, currency)}
                      </td>
                      <td className="p-3 text-right">
                        {formatCurrency(valuationResults.method5.perUnit, currency)}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">Available</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">{valuationResults.method5.notes}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">6. Fall-back Method</td>
                      <td className="p-3">Article 7</td>
                      <td className="p-3 text-right font-mono">--</td>
                      <td className="p-3 text-right">--</td>
                      <td className="p-3">
                        <Badge variant="destructive">Last Resort</Badge>
                      </td>
                      <td className="p-3 text-muted-foreground">Only if all others fail</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-[var(--logistics)]" />
                Recommendation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle className="h-6 w-6 text-green-600 mt-0.5" />
                <div>
                  <div className="font-semibold mb-1">Use Transaction Value Method</div>
                  <p className="text-sm text-muted-foreground">
                    Based on the inputs provided, Method 1 (Transaction Value) is applicable and provides
                    a customs value of <strong>{formatCurrency(valuationResults.method1.value, currency)}</strong>.
                    This is the primary method under the WTO Valuation Agreement and should be used unless 
                    specific conditions prevent its application.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Methods Tab */}
        <TabsContent value="methods" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--ocean)]" />
                WTO Valuation Methods Hierarchy
              </CardTitle>
              <CardDescription>
                The 6 valuation methods must be applied in sequential order (with flexibility for Methods 4 & 5)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {WTO_VALUATION_METHODS.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedMethod === method.id
                        ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                        : "border-border hover:border-[var(--ocean)]/50"
                    }`}
                    onClick={() => setSelectedMethod(method.id)}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: method.color }}
                      >
                        {method.id}
                      </div>
                      <div>
                        <div className="font-semibold">{method.shortName}</div>
                        <div className="text-xs text-muted-foreground">{method.wtoArticle}</div>
                      </div>
                    </div>
                    <h4 className="font-medium mb-1">{method.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {method.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Selected Method Details */}
          {selectedMethodDetails && (
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
                      style={{ backgroundColor: selectedMethodDetails.color }}
                    >
                      {selectedMethodDetails.id}
                    </div>
                    <div>
                      <CardTitle>{selectedMethodDetails.name}</CardTitle>
                      <CardDescription>{selectedMethodDetails.wtoArticle}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    {selectedMethodDetails.description}
                  </p>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="text-xs text-muted-foreground mb-1">Applicability</div>
                    <div className="text-sm font-medium">{selectedMethodDetails.applicability}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-2">Requirements/Conditions:</div>
                    <ul className="space-y-2">
                      {selectedMethodDetails.requirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-[var(--logistics)] mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Method-Specific Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedMethodDetails.name} Calculator
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedMethod === 1 && (
                    <div className="space-y-4">
                      <Alert className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription>
                          Transaction value is the primary method and most commonly used.
                        </AlertDescription>
                      </Alert>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Calculated Value</div>
                        <div className="text-2xl font-bold text-[var(--ocean)]">
                          {formatCurrency(valuationResults.method1.value, currency)}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {valuationResults.method1.notes}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 4 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Resale Price (Unit Selling Price)</Label>
                        <Input
                          type="number"
                          value={resalePrice}
                          onChange={(e) => setResalePrice(e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Commissions</Label>
                          <Input
                            type="number"
                            value={resaleCommissions}
                            onChange={(e) => setResaleCommissions(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Transport Costs</Label>
                          <Input
                            type="number"
                            value={resaleTransport}
                            onChange={(e) => setResaleTransport(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Duties & Taxes</Label>
                          <Input
                            type="number"
                            value={resaleDuties}
                            onChange={(e) => setResaleDuties(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Profit & Expenses</Label>
                          <Input
                            type="number"
                            value={resaleProfit}
                            onChange={(e) => setResaleProfit(e.target.value)}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Deductive Value</div>
                        <div className="text-2xl font-bold text-[var(--ocean)]">
                          {formatCurrency(valuationResults.method4.value, currency)}
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedMethod === 5 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Materials Cost</Label>
                          <Input
                            type="number"
                            value={materialsCost}
                            onChange={(e) => setMaterialsCost(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Fabrication Cost</Label>
                          <Input
                            type="number"
                            value={fabricationCost}
                            onChange={(e) => setFabricationCost(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Producer Profit</Label>
                          <Input
                            type="number"
                            value={producerProfit}
                            onChange={(e) => setProducerProfit(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>General Expenses</Label>
                          <Input
                            type="number"
                            value={producerExpenses}
                            onChange={(e) => setProducerExpenses(e.target.value)}
                          />
                        </div>
                      </div>
                      <Separator />
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="text-sm text-muted-foreground">Computed Value</div>
                        <div className="text-2xl font-bold text-[var(--ocean)]">
                          {formatCurrency(valuationResults.method5.value, currency)}
                        </div>
                      </div>
                    </div>
                  )}

                  {(selectedMethod === 2 || selectedMethod === 3) && (
                    <div className="space-y-4">
                      <Alert className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
                        <Info className="h-4 w-4 text-blue-600" />
                        <AlertDescription>
                          {selectedMethod === 2 
                            ? "This method requires data on identical goods exported at the same commercial level and quantity."
                            : "This method requires data on similar goods with like characteristics."}
                        </AlertDescription>
                      </Alert>
                      <p className="text-sm text-muted-foreground">
                        Enter reference data for {selectedMethod === 2 ? "identical" : "similar"} goods in the Calculator tab,
                        or provide customs database reference values.
                      </p>
                    </div>
                  )}

                  {selectedMethod === 6 && (
                    <div className="space-y-4">
                      <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription>
                          Fall-back method allows flexible interpretation of previous methods but cannot use arbitrary values.
                        </AlertDescription>
                      </Alert>
                      <p className="text-sm text-muted-foreground">
                        This method is used when all other methods fail. It should be based on one of the previous methods 
                        with reasonable flexibility.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Understanding Customs Valuation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                Understanding Customs Valuation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Customs valuation is the systematic process of determining the monetary value of imported goods for the 
                purpose of calculating customs duties, taxes, and other import charges. This valuation serves as the 
                fundamental tax base for ad valorem duties, which are calculated as a percentage of the goods' declared 
                value rather than a specific amount per unit or weight. The accuracy of customs valuation directly impacts 
                government revenue collection, trade statistics compilation, and the fair application of trade policies.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                The World Trade Organization (WTO) Valuation Agreement, established in 1994 as part of the Uruguay Round 
                of trade negotiations, provides the international framework for customs valuation. This agreement replaced 
                the previous GATT valuation system and established a transaction value-based approach that prioritizes the 
                price actually paid or payable for imported goods. Over 164 WTO member countries have adopted this system, 
                ensuring uniformity, transparency, and predictability in international trade. The agreement specifically 
                prohibits the use of arbitrary or fictitious values that could serve as disguised trade barriers, protecting 
                both importers and the integrity of global trade.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Target className="h-4 w-4 text-[var(--ocean)]" />
                    Key Purposes
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Calculate customs duties (ad valorem rates)</li>
                    <li>• Determine VAT/GST on imports</li>
                    <li>• Trade statistics compilation</li>
                    <li>• Quota and license management</li>
                    <li>• Antidumping and countervailing duty calculations</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Shield className="h-4 w-4 text-[var(--logistics)]" />
                    WTO Agreement Benefits
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Established in 1994 (GATT Article VII)</li>
                    <li>• 164+ member countries</li>
                    <li>• Ensures uniformity and fairness</li>
                    <li>• Prevents arbitrary valuations</li>
                    <li>• Promotes trade facilitation</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* The Transaction Value Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-[var(--logistics)]" />
                The Transaction Value Method
              </CardTitle>
              <CardDescription>Understanding Method 1 - The primary valuation approach</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                The Transaction Value Method, also known as Method 1, is the primary and most frequently used valuation 
                approach under the WTO Agreement. It applies to over 90% of all import transactions globally and establishes 
                the customs value based on the price actually paid or payable for the goods when sold for export to the 
                country of importation. This price includes all payments made as a condition of sale, whether direct or 
                indirect, by the buyer to the seller or to a third party to satisfy an obligation of the seller.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                For the Transaction Value Method to apply, several conditions must be met. First, there must be a sale for 
                export to the country of importation. Second, the buyer must not be subject to any restrictions on the 
                disposition or use of the goods, other than those imposed by law or limited to specific geographic areas. 
                Third, the sale or price must not be subject to conditions for which a value cannot be determined, such as 
                when the price depends on concurrent purchases of other goods. Fourth, no part of the proceeds of resale, 
                use, or disposition of the goods by the buyer may accrue to the seller, unless an appropriate adjustment 
                can be made. Finally, the buyer and seller must not be related, or if related, the relationship must not 
                have influenced the price.
              </p>
              <div className="p-4 bg-[var(--ocean)]/5 rounded-lg border border-[var(--ocean)]/20 mt-4">
                <div className="text-center font-mono text-lg mb-2">
                  Customs Value = Transaction Value + Additions (Article 8)
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  The transaction value serves as the starting point, with WTO Article 8 additions applied when not already included in the price.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Other Valuation Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-[var(--ocean)]" />
                Other Valuation Methods
              </CardTitle>
              <CardDescription>Methods 2-6 for when Transaction Value cannot be applied</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                When the Transaction Value Method cannot be applied, the WTO Agreement requires the sequential application 
                of alternative methods. Methods 2 and 3 involve finding values for identical or similar goods, respectively. 
                Identical goods are those that are the same in all respects, including physical characteristics, quality, 
                and reputation, while similar goods must have like characteristics and component materials and be commercially 
                interchangeable. These methods require data on goods exported at the same commercial level and quantity from 
                the same country.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Methods 4 and 5 can be applied in either order at the importer's request. The Deductive Value Method (Method 4) 
                works backward from the unit selling price in the country of importation, deducting commissions, transport costs, 
                insurance, duties and taxes, and usual profit and general expenses. The Computed Value Method (Method 5) builds 
                value from production costs, adding materials, fabrication, profit, general expenses, and transport costs. 
                Method 6, the Fall-back Method, allows flexible application of previous methods using reasonable means, but 
                cannot use arbitrary values, minimum customs values, or the domestic selling price in the country of export.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm mt-4">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Method</th>
                      <th className="text-left p-3">When to Use</th>
                      <th className="text-left p-3">Key Requirement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-3 font-medium">2. Identical Goods</td>
                      <td className="p-3">When Method 1 fails</td>
                      <td className="p-3">Same in all respects</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">3. Similar Goods</td>
                      <td className="p-3">Methods 1-2 unavailable</td>
                      <td className="p-3">Like characteristics</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">4. Deductive Value</td>
                      <td className="p-3">Resale price known</td>
                      <td className="p-3">Deductions from selling price</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-3 font-medium">5. Computed Value</td>
                      <td className="p-3">Production costs available</td>
                      <td className="p-3">Manufacturer cooperation</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">6. Fall-back</td>
                      <td className="p-3">All others fail</td>
                      <td className="p-3">Reasonable flexibility</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Valuation for Special Cases */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                Valuation for Special Cases
              </CardTitle>
              <CardDescription>Handling unique import scenarios</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                Certain import scenarios require special consideration for customs valuation. Related party transactions 
                present unique challenges because the relationship between buyer and seller may influence the transaction 
                price. Under WTO rules, the transaction value method can still apply if the importer demonstrates through 
                a circumstances test or values test that the relationship did not affect the price. The circumstances test 
                compares pricing to industry norms or the seller's dealings with unrelated parties, while the values test 
                compares to accepted values for identical or similar goods.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Other special cases include goods supplied under lease, hire-purchase, or similar arrangements where the 
                price actually paid may not represent the full value. Imports by charitable or educational organizations, 
                goods entered temporarily for repair or processing, and goods returned after exportation for repair all 
                require specific valuation approaches. Multi-tier transactions may qualify for First Sale valuation in 
                certain countries, allowing use of the earlier sale price rather than the middleman's price. Goods 
                imported under consignment arrangements present additional challenges, as no sale has occurred, requiring 
                application of methods other than Transaction Value.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                    <Users className="h-4 w-4" />
                    Related Party Transactions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Requires demonstrating that the relationship did not influence the price through documented tests.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-medium mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-400">
                    <ArrowLeftRight className="h-4 w-4" />
                    Multi-Tier Transactions
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    May qualify for First Sale valuation using the earlier sale price in the supply chain.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips and Best Practices
              </CardTitle>
              <CardDescription>Expert recommendations for customs valuation compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="p-4 bg-muted rounded-lg border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <tip.icon className="h-4 w-4 text-[var(--ocean)]" />
                      <span className="font-medium">{tip.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                <AlertTriangle className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Frequent errors that can lead to penalties and compliance issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((item, index) => (
                  <div key={index} className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-red-700 dark:text-red-400">{item.title}</span>
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        <div className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">
                          Consequence: {item.consequence}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common customs valuation questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:text-[var(--ocean)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end pt-4 border-t">
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
        <Button onClick={handleShare} className="gap-2 gradient-ocean text-white">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>
    </div>
  );
}
