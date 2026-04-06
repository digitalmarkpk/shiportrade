"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ShieldCheck,
  Leaf,
  Users,
  Building2,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Target,
  BarChart3,
  Globe,
  AlertCircle,
  Info,
  Award,
  Link2,
  Factory,
  Truck,
  Ship,
  Plane,
  Box,
  ChevronUp,
  HelpCircle,
  Zap,
  LineChart,
  PieChart as PieChartIcon,
  Activity,
  BookOpen,
  Lightbulb,
  FileText,
  ClipboardCheck,
  XCircle,
  ThumbsUp,
  FileSpreadsheet,
} from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  PieChart,
  Pie,
  AreaChart,
  Area,
} from "recharts";

// Brand colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
};

// ESG Dimension types
type ESGDimension = "environmental" | "social" | "governance";

// Industry sectors for benchmarking
const INDUSTRY_SECTORS = {
  shipping: { name: "Shipping & Maritime", avgScore: 58, icon: Ship },
  logistics: { name: "Logistics & Freight", avgScore: 62, icon: Truck },
  aviation: { name: "Aviation & Air Cargo", avgScore: 55, icon: Plane },
  warehousing: { name: "Warehousing & Distribution", avgScore: 68, icon: Box },
  manufacturing: { name: "Manufacturing", avgScore: 52, icon: Factory },
  retail: { name: "Retail & E-commerce", avgScore: 65, icon: Globe },
};

// Risk factors by dimension with weights
const RISK_FACTORS = {
  environmental: [
    { id: "carbon_emissions", name: "Carbon Emissions Management", weight: 25, description: "GHG emissions tracking, reduction targets, carbon neutrality goals" },
    { id: "energy_efficiency", name: "Energy Efficiency", weight: 20, description: "Energy consumption, renewable energy usage, efficiency programs" },
    { id: "waste_management", name: "Waste & Circular Economy", weight: 15, description: "Waste reduction, recycling programs, circular economy initiatives" },
    { id: "water_management", name: "Water Stewardship", weight: 10, description: "Water usage, wastewater treatment, water risk management" },
    { id: "biodiversity", name: "Biodiversity & Land Use", weight: 10, description: "Impact on ecosystems, habitat protection, deforestation policies" },
    { id: "pollution_prevention", name: "Pollution Prevention", weight: 20, description: "Air quality, hazardous materials, spill prevention" },
  ],
  social: [
    { id: "labor_rights", name: "Labor Rights & Fair Wages", weight: 25, description: "Living wage commitment, working hours, freedom of association" },
    { id: "health_safety", name: "Health & Safety", weight: 25, description: "Workplace safety, incident rates, safety training programs" },
    { id: "diversity_inclusion", name: "Diversity & Inclusion", weight: 15, description: "Gender equality, minority representation, inclusive policies" },
    { id: "community_impact", name: "Community Engagement", weight: 15, description: "Local community support, social investments, stakeholder dialogue" },
    { id: "human_rights", name: "Human Rights", weight: 20, description: "Human rights due diligence, modern slavery policies, indigenous rights" },
  ],
  governance: [
    { id: "board_composition", name: "Board Composition", weight: 20, description: "Board independence, diversity, expertise mix" },
    { id: "ethics_compliance", name: "Ethics & Compliance", weight: 25, description: "Code of conduct, anti-corruption policies, whistleblower protection" },
    { id: "risk_management", name: "Risk Management", weight: 20, description: "ESG risk integration, scenario analysis, climate risk assessment" },
    { id: "transparency", name: "Transparency & Disclosure", weight: 20, description: "Sustainability reporting, third-party assurance, stakeholder communication" },
    { id: "shareholder_rights", name: "Shareholder Rights", weight: 15, description: "Voting rights, shareholder engagement, executive compensation" },
  ],
};

// Supply chain risk categories
const SUPPLY_CHAIN_RISKS = [
  { id: "supplier_screening", name: "Supplier ESG Screening", weight: 20 },
  { id: "supplier_audit", name: "Supplier Audit Programs", weight: 15 },
  { id: "conflict_minerals", name: "Conflict Minerals Policy", weight: 15 },
  { id: "responsible_sourcing", name: "Responsible Sourcing", weight: 20 },
  { id: "supply_chain_traceability", name: "Supply Chain Traceability", weight: 15 },
  { id: "tier2_management", name: "Tier 2+ Supplier Management", weight: 15 },
];

// Compliance frameworks
const COMPLIANCE_FRAMEWORKS = {
  GRI: {
    name: "GRI Standards",
    fullName: "Global Reporting Initiative",
    description: "Comprehensive sustainability reporting standards",
    requirements: 3,
    metrics: ["Emissions", "Energy", "Water", "Waste", "Employment", "Human Rights"],
  },
  SASB: {
    name: "SASB Standards",
    fullName: "Sustainability Accounting Standards Board",
    description: "Industry-specific disclosure standards",
    requirements: 2,
    metrics: ["GHG Emissions", "Air Quality", "Energy Management", "Employee Health & Safety"],
  },
  TCFD: {
    name: "TCFD",
    fullName: "Task Force on Climate-related Financial Disclosures",
    description: "Climate risk disclosure framework",
    requirements: 4,
    metrics: ["Governance", "Strategy", "Risk Management", "Metrics & Targets"],
  },
  CDP: {
    name: "CDP",
    fullName: "Carbon Disclosure Project",
    description: "Environmental disclosure system",
    requirements: 3,
    metrics: ["Climate Change", "Water Security", "Forests"],
  },
  UN_SDG: {
    name: "UN SDGs",
    fullName: "UN Sustainable Development Goals",
    description: "17 global goals for sustainable development",
    requirements: 17,
    metrics: ["SDG 7: Clean Energy", "SDG 8: Decent Work", "SDG 12: Responsible Production", "SDG 13: Climate Action"],
  },
};

// Risk level definitions
const RISK_LEVELS = {
  low: { label: "Low Risk", color: "#22C55E", range: [70, 100] },
  medium: { label: "Medium Risk", color: "#EAB308", range: [50, 69] },
  high: { label: "High Risk", color: "#F97316", range: [30, 49] },
  critical: { label: "Critical Risk", color: "#EF4444", range: [0, 29] },
};

// Pro Tips
const PRO_TIPS = [
  {
    icon: Target,
    title: "Set Science-Based Targets",
    description: "Align your emissions reduction goals with the Science Based Targets initiative (SBTi) to demonstrate credible climate action. Companies with SBTi-approved targets often see improved investor confidence and stakeholder trust.",
  },
  {
    icon: ClipboardCheck,
    title: "Implement Third-Party Assurance",
    description: "Obtain independent verification of your ESG data and reports. Third-party assurance enhances credibility and meets the requirements of major ESG rating agencies and institutional investors.",
  },
  {
    icon: Users,
    title: "Engage Stakeholders Regularly",
    description: "Conduct regular stakeholder engagement sessions to understand ESG priorities from investors, employees, customers, and communities. This ensures your ESG strategy addresses material issues effectively.",
  },
  {
    icon: Link2,
    title: "Map Your Supply Chain",
    description: "Develop comprehensive supply chain mapping to identify ESG risks in your tier 1, 2, and 3 suppliers. This visibility enables proactive risk management and supports responsible sourcing claims.",
  },
  {
    icon: FileText,
    title: "Standardize Your Reporting",
    description: "Adopt recognized reporting frameworks (GRI, SASB, TCFD) to ensure consistency and comparability. Standardized reporting reduces redundancy and meets diverse stakeholder information needs.",
  },
  {
    icon: Zap,
    title: "Integrate ESG into Governance",
    description: "Link executive compensation to ESG performance metrics to demonstrate board-level commitment. This alignment ensures accountability and drives organizational focus on sustainability goals.",
  },
];

// Common Mistakes
const COMMON_MISTAKES = [
  {
    icon: XCircle,
    title: "Greenwashing Without Substance",
    description: "Making sustainability claims without robust data or measurable targets undermines credibility and can lead to regulatory scrutiny. Ensure all environmental claims are backed by verified data and clear methodologies. Investors and regulators are increasingly scrutinizing sustainability communications for accuracy and completeness.",
  },
  {
    icon: AlertTriangle,
    title: "Ignoring Supply Chain Risks",
    description: "Focusing only on direct operations while neglecting supply chain ESG risks leaves significant exposure. Supply chains often account for the majority of a company's total environmental and social impact. Conduct regular supplier assessments and establish clear ESG requirements for all tiers of suppliers.",
  },
  {
    icon: FileSpreadsheet,
    title: "Siloed ESG Data Management",
    description: "Managing ESG data in disconnected spreadsheets leads to errors, inconsistencies, and audit challenges. Implement integrated ESG data management systems that connect to operational systems and enable real-time monitoring. This improves accuracy and enables faster reporting cycles.",
  },
  {
    icon: AlertCircle,
    title: "Treating ESG as a Compliance Exercise",
    description: "Approaching ESG solely as a compliance requirement misses strategic opportunities for value creation. ESG leadership can drive innovation, attract talent, reduce costs, and create competitive advantages. Integrate ESG considerations into core business strategy and decision-making processes.",
  },
  {
    icon: TrendingDown,
    title: "Neglecting Materiality Assessment",
    description: "Failing to conduct proper materiality assessments results in unfocused ESG efforts that may not address stakeholder priorities. Conduct regular double materiality assessments to identify issues that are both financially material and impact-material. This ensures efficient resource allocation and meaningful reporting.",
  },
];

// Educational content sections
const EDUCATIONAL_CONTENT = {
  whatIsESG: {
    title: "What is ESG?",
    content: `Environmental, Social, and Governance (ESG) represents a comprehensive framework for evaluating corporate sustainability and ethical practices. The Environmental dimension assesses how a company performs as a steward of nature, examining factors such as carbon emissions, energy efficiency, waste management, water stewardship, and biodiversity protection. Companies with strong environmental performance actively manage their ecological footprint, implement pollution prevention measures, and transition toward sustainable resource utilization.

The Social dimension evaluates how a company manages relationships with its workforce, suppliers, customers, and communities. Key factors include labor practices, health and safety standards, diversity and inclusion initiatives, human rights due diligence, and community engagement. Organizations excelling in social performance demonstrate commitment to fair labor practices, safe working conditions, and positive community impact.

The Governance dimension examines a company's leadership, controls, and ethical frameworks. This includes board composition and independence, executive compensation alignment, audit practices, shareholder rights, anti-corruption policies, and transparency in reporting. Strong governance ensures accountability, reduces fraud risk, and aligns management actions with stakeholder interests.

ESG has evolved from a niche consideration to a mainstream investment criterion. Institutional investors, asset managers, and rating agencies increasingly incorporate ESG factors into their decision-making processes. Companies with strong ESG performance often experience lower cost of capital, reduced volatility, enhanced brand reputation, and improved access to sustainable finance. Conversely, poor ESG performance can lead to divestment, regulatory penalties, and reputational damage that materially impacts long-term value creation.`,
  },
  environmentalFactors: {
    title: "Environmental Factors in Trade",
    content: `Environmental factors in trade and logistics have gained unprecedented importance as global supply chains face increasing scrutiny for their ecological impact. The transportation sector accounts for approximately 24% of global CO2 emissions, with shipping contributing around 3% and aviation approximately 2.5%. This environmental footprint drives regulatory pressure, investor expectations, and customer demands for sustainable logistics solutions.

Carbon emissions management represents the most prominent environmental factor. Companies must track Scope 1 (direct emissions), Scope 2 (indirect emissions from purchased energy), and Scope 3 (value chain emissions) to understand their complete carbon footprint. In logistics, Scope 3 emissions often dominate, requiring engagement with carriers, suppliers, and customers to achieve meaningful reductions.

Energy efficiency in warehousing and transportation operations offers significant opportunities for both environmental improvement and cost reduction. LED lighting, solar installations, energy management systems, and fleet optimization can reduce energy consumption by 20-40%. Transition to renewable energy sources demonstrates commitment to sustainability while hedging against fossil fuel price volatility.

Waste management and circular economy principles are reshaping packaging and materials handling in trade. Single-use packaging is being replaced by reusable containers, recyclable materials, and packaging-free solutions. Reverse logistics networks enable product returns, refurbishment, and recycling, creating value from waste streams while reducing environmental impact.

Water stewardship, biodiversity protection, and pollution prevention round out the environmental agenda for trade operations. Port facilities, warehouses, and distribution centers must manage water consumption, prevent contamination, and minimize impacts on local ecosystems. These factors increasingly appear in customer requirements, regulatory permits, and community license to operate.`,
  },
  socialResponsibility: {
    title: "Social Responsibility in Supply Chains",
    content: `Social responsibility in supply chains encompasses the ethical obligations companies have toward workers, communities, and society throughout their value chain. The globalization of trade has created complex supply networks spanning multiple countries with varying labor standards, creating both challenges and opportunities for responsible business practices. Companies that proactively address social issues in their supply chains build resilience, protect reputation, and create sustainable competitive advantages.

Labor rights and fair wages form the foundation of supply chain social responsibility. This includes ensuring living wages that meet workers' basic needs, reasonable working hours, freedom of association, and protection from forced labor. The International Labour Organization (ILO) conventions provide internationally recognized standards, yet implementation requires ongoing monitoring, supplier capacity building, and transparent reporting. Companies must look beyond tier 1 suppliers to address risks deeper in their supply chains.

Health and safety standards protect workers from occupational hazards prevalent in logistics and manufacturing environments. Warehouse operations involve equipment risks, manual handling challenges, and fatigue-related safety concerns. Transportation workers face road safety risks, port safety hazards, and isolation challenges. Effective safety programs include risk assessments, training, personal protective equipment, incident reporting systems, and continuous improvement processes.

Diversity and inclusion initiatives create more equitable workplaces while improving business performance. Research consistently shows that diverse teams make better decisions, drive innovation, and improve financial returns. In trade and logistics, diversity programs address gender imbalances in transportation, create opportunities for underrepresented groups, and ensure inclusive hiring practices across the supply chain.

Human rights due diligence has moved from voluntary best practice to legal requirement in many jurisdictions. The UN Guiding Principles on Business and Human Rights provide the framework for identifying, preventing, mitigating, and accounting for human rights impacts. This requires supply chain mapping, risk assessment, supplier engagement, grievance mechanisms, and transparent reporting on findings and actions taken.`,
  },
  governanceBestPractices: {
    title: "Governance Best Practices",
    content: `Governance best practices establish the structural foundations for sustainable business operations and responsible corporate behavior. Effective governance ensures that ESG considerations are integrated into strategic decision-making, risk management processes, and day-to-day operations. Companies with robust governance frameworks demonstrate accountability to stakeholders, manage risks proactively, and create long-term value while maintaining ethical standards.

Board composition and oversight represent the apex of governance effectiveness. Best practices include maintaining board independence (typically requiring a majority of independent directors), ensuring diversity of skills, experience, and backgrounds, and establishing dedicated committees for ESG or sustainability matters. Boards should receive regular ESG training and briefings to maintain competence in emerging sustainability issues and regulatory requirements.

Ethics and compliance programs translate governance principles into operational practices. This includes comprehensive codes of conduct covering anti-corruption, conflicts of interest, and ethical business practices. Whistleblower protection mechanisms enable reporting of concerns without fear of retaliation. Regular ethics training, third-party due diligence, and monitoring systems help prevent compliance failures that can result in legal liability and reputational damage.

Risk management integration ensures ESG factors are considered alongside traditional business risks. Climate risk assessment, scenario analysis, and stress testing help organizations understand potential impacts of environmental changes on business operations and financial performance. Supply chain risk management addresses social and environmental risks in extended value chains. Enterprise risk management frameworks should incorporate ESG risks with appropriate escalation and reporting mechanisms.

Transparency and disclosure practices have evolved from minimal compliance to comprehensive sustainability reporting. Leading companies produce integrated annual and sustainability reports aligned with multiple frameworks (GRI, SASB, TCFD) to meet diverse stakeholder information needs. Third-party assurance enhances credibility, while proactive stakeholder engagement ensures reporting addresses material issues. Digital disclosure platforms enable real-time data sharing and improved accessibility for all stakeholders.`,
  },
};

// FAQ data with comprehensive answers (150+ words each)
const FAQ_DATA = [
  {
    question: "What is ESG and why does it matter for businesses?",
    answer: `ESG (Environmental, Social, and Governance) is a comprehensive framework used to evaluate a company's sustainability practices, social impact, and ethical governance. The Environmental component examines how a business performs as a steward of nature, including climate change mitigation, resource efficiency, pollution prevention, and biodiversity protection. The Social dimension assesses relationships with employees, suppliers, customers, and communities, covering labor standards, health and safety, diversity, and human rights. Governance evaluates leadership quality, board composition, executive compensation, audit practices, and shareholder rights.

ESG matters because it directly impacts a company's ability to create long-term value and manage risks. Investors increasingly use ESG criteria to identify companies with sustainable business models and strong risk management. Companies with high ESG performance often experience lower costs of capital, better operational performance, and enhanced brand reputation. Conversely, poor ESG practices can lead to regulatory penalties, supply chain disruptions, reputational damage, and reduced access to capital. The Business Roundtable's 2019 statement on stakeholder capitalism and the EU's Corporate Sustainability Reporting Directive exemplify the mainstreaming of ESG considerations in corporate strategy and regulatory requirements.`,
  },
  {
    question: "How is the ESG risk score calculated?",
    answer: `ESG risk scores are calculated through a systematic evaluation of multiple factors across the three dimensions of Environmental, Social, and Governance performance. Each dimension contains numerous specific metrics weighted according to their materiality and impact on overall sustainability performance. The calculation methodology typically involves several key steps that ensure comprehensive and balanced assessment.

The process begins with data collection across all relevant ESG factors. For Environmental factors, this includes carbon emissions data, energy consumption, waste generation, water usage, and environmental compliance records. Social factors encompass workforce demographics, safety statistics, labor relations, community investments, and supply chain labor practices. Governance factors cover board structure, executive compensation, ethics violations, shareholder engagement, and transparency metrics.

Each factor is scored on a standardized scale (typically 0-100), with higher scores indicating better performance or lower risk. Weight factors are applied to reflect the relative importance of each metric, based on industry-specific materiality assessments and stakeholder priorities. Weighted scores are then aggregated within each dimension and combined to produce an overall ESG score. The final score is typically mapped to a risk classification system (Low, Medium, High, Critical) that provides actionable guidance for improvement priorities.`,
  },
  {
    question: "What are the different ESG risk levels and their implications?",
    answer: `ESG risk levels provide a standardized classification system that helps stakeholders understand a company's sustainability performance and associated risks. These levels translate complex ESG data into actionable insights for investors, regulators, and company management. Understanding the implications of each risk level is essential for strategic planning and stakeholder communication.

Low Risk (Score 70-100) indicates strong ESG performance with minimal areas of concern. Companies in this category typically demonstrate comprehensive sustainability programs, transparent reporting, proactive risk management, and alignment with global best practices. These organizations often benefit from lower borrowing costs, preferential treatment from ESG-focused investors, and enhanced brand reputation. They are well-positioned for emerging regulations and changing stakeholder expectations.

Medium Risk (Score 50-69) represents acceptable ESG performance with identifiable areas for improvement. While these companies have established sustainability programs, gaps exist in implementation, scope, or effectiveness. They may lack comprehensive reporting, have limited supply chain oversight, or show inconsistent performance across ESG dimensions. These organizations should develop targeted improvement plans to address material gaps before they escalate into significant risks.

High Risk (Score 30-49) signals significant ESG deficiencies requiring immediate attention and remediation. Companies at this level face potential regulatory scrutiny, reputational risks, and challenges accessing sustainable finance. Critical Risk (Score 0-29) indicates severe ESG failures requiring urgent action. Organizations at this level may face regulatory enforcement, divestment by ESG-conscious investors, and significant operational challenges. Comprehensive transformation programs are typically required to address fundamental gaps in sustainability practices.`,
  },
  {
    question: "How often should ESG assessments be conducted?",
    answer: `The frequency of ESG assessments depends on organizational size, industry sector, regulatory requirements, and stakeholder expectations. However, best practices have emerged that balance comprehensive evaluation with practical resource constraints. A layered approach to assessment frequency ensures continuous improvement while maintaining operational efficiency.

Annual comprehensive assessments are recommended as the minimum standard for all organizations. These assessments should cover all material ESG factors, include third-party verification where possible, and result in published sustainability reports. Annual assessments enable year-over-year performance tracking, support regulatory compliance, and meet investor information requirements. Many companies align their assessment cycle with financial reporting to enable integrated reporting approaches.

Quarterly reviews of key performance indicators provide more frequent monitoring of critical ESG metrics. This cadence enables early identification of trends, supports operational decision-making, and ensures accountability for sustainability targets. High-risk areas identified in comprehensive assessments may warrant monthly monitoring until performance improves to acceptable levels.

Real-time monitoring through integrated data systems represents the emerging best practice for ESG performance tracking. Automated data collection from operational systems enables immediate identification of deviations from targets, supports root cause analysis, and enables rapid corrective action. While comprehensive assessments still provide periodic validation, continuous monitoring creates a more responsive and proactive sustainability management approach.

Reassessment should also be triggered by significant events including mergers and acquisitions, new product launches, market expansion, regulatory changes, or material incidents. These event-driven assessments ensure that ESG programs remain relevant and effective as business conditions evolve.`,
  },
  {
    question: "What compliance frameworks should companies consider?",
    answer: `Companies should consider multiple ESG compliance frameworks based on their industry, geographic presence, stakeholder requirements, and strategic objectives. The ESG reporting landscape has evolved significantly, with various frameworks serving different purposes and audiences. A strategic approach to framework adoption can maximize reporting efficiency while meeting diverse stakeholder needs.

The Global Reporting Initiative (GRI) Standards provide the most comprehensive framework for sustainability reporting, covering a wide range of economic, environmental, and social topics. GRI is particularly suited for organizations seeking to demonstrate accountability to a broad stakeholder base and is required by many governments and stock exchanges. The modular structure allows companies to report on material topics while the universal standards ensure baseline transparency.

SASB (Sustainability Accounting Standards Board) Standards provide industry-specific disclosure requirements focused on financially material sustainability topics. SASB is particularly relevant for public companies and those seeking to communicate ESG performance to investors. The industry-specific approach reduces reporting burden while ensuring relevance to financial performance.

The Task Force on Climate-related Financial Disclosures (TCFD) provides recommendations for climate risk and opportunity disclosure. TCFD adoption has accelerated dramatically with regulatory requirements in the UK, EU, and other jurisdictions. The framework covers governance, strategy, risk management, and metrics related to climate change, supporting investors' assessment of climate-related financial impacts.

CDP (formerly Carbon Disclosure Project) operates the global environmental disclosure system for investors, companies, cities, states, and regions. CDP scoring provides benchmarking against peers and demonstrates environmental transparency to stakeholders. The UN Sustainable Development Goals (SDGs) provide a framework for aligning corporate sustainability strategies with global development priorities.`,
  },
  {
    question: "How can companies improve their ESG scores?",
    answer: `Improving ESG scores requires a systematic approach that addresses identified gaps while building sustainable practices across all three dimensions. The improvement journey should begin with understanding current performance, identifying material issues, developing targeted action plans, and establishing ongoing monitoring and governance mechanisms. Companies that successfully improve their ESG performance often realize multiple co-benefits including operational efficiency gains, enhanced reputation, and improved access to capital.

The first step is conducting a thorough materiality assessment to identify the ESG issues most relevant to the business and its stakeholders. This assessment should consider both financial materiality (factors affecting enterprise value) and impact materiality (factors affecting people and environment). Material issues become the focus of improvement efforts, ensuring efficient resource allocation and meaningful results.

For environmental improvement, companies should establish science-based emissions reduction targets aligned with the Paris Agreement goals. Energy efficiency programs, renewable energy procurement, and operational optimization can deliver both emissions reductions and cost savings. Water management, waste reduction, and circular economy initiatives address additional environmental factors while often improving operational efficiency.

Social performance improvement requires investment in workforce development, safety programs, and diversity initiatives. Supply chain due diligence programs address labor and human rights risks in extended value chains. Community engagement and stakeholder dialogue ensure that social investments address actual needs and create meaningful impact.

Governance improvements often yield significant score improvements through enhanced transparency and accountability. Board diversity and expertise development, executive compensation alignment with ESG targets, and robust ethics and compliance programs strengthen governance foundations. Comprehensive sustainability reporting with third-party assurance demonstrates commitment to transparency and enables stakeholder trust.`,
  },
  {
    question: "What role does supply chain play in ESG risk?",
    answer: `Supply chain ESG risk represents one of the most significant and challenging dimensions of corporate sustainability management. For many companies, the majority of their environmental and social impacts occur within their supply chains rather than direct operations. Understanding and managing these extended impacts is essential for comprehensive ESG performance and stakeholder expectations.

Environmental supply chain risks include carbon emissions from transportation and logistics, deforestation from commodity sourcing, water pollution from manufacturing processes, and waste generation throughout the value chain. Scope 3 emissions from supply chains often represent 70-90% of total emissions for retail and consumer goods companies, making supply chain management essential for climate targets.

Social supply chain risks encompass labor rights violations, unsafe working conditions, child labor, forced labor, and human rights abuses. The globalization of supply chains has created complex networks spanning countries with varying labor standards and enforcement. Companies face reputational, legal, and operational risks when suppliers fail to meet expected standards. Modern slavery legislation in the UK, Australia, and other jurisdictions requires companies to report on supply chain human rights due diligence.

Managing supply chain ESG risk requires a multi-pronged approach. Supplier screening and qualification processes establish baseline expectations. Supplier audits and assessments verify compliance and identify improvement opportunities. Capacity building programs help suppliers develop sustainability capabilities. Collaboration with industry initiatives and multi-stakeholder organizations addresses systemic issues beyond individual supplier relationships.

Technology plays an increasingly important role in supply chain ESG management. Blockchain enables traceability and transparency. Satellite imagery monitors deforestation and environmental compliance. Worker voice platforms enable direct feedback from supply chain workers. These tools, combined with robust supplier relationship management, create the foundation for effective supply chain ESG risk management.`,
  },
  {
    question: "How do ESG scores impact access to capital?",
    answer: `ESG scores have become increasingly influential in capital allocation decisions, affecting companies' access to financing, cost of capital, and investor relations. The rapid growth of sustainable investment, combined with regulatory developments and changing investor expectations, has made ESG performance a material factor in financial markets. Understanding these dynamics is essential for corporate treasury, investor relations, and strategic planning functions.

The sustainable investment market has grown to over $30 trillion in assets under management globally, with ESG-integrated strategies representing the largest segment. Institutional investors including pension funds, sovereign wealth funds, and asset managers have established ESG policies that affect their investment decisions. Many large asset managers have committed to net-zero portfolios, creating implications for carbon-intensive companies seeking capital access.

Cost of capital impacts have been documented across multiple academic studies. Companies with strong ESG performance typically enjoy lower costs of both debt and equity financing. This reflects reduced perceived risk, improved operational performance, and enhanced stakeholder relations. The cost advantage can be significant, with some studies indicating 10-15% lower cost of capital for top ESG performers compared to bottom performers.

Green and sustainability-linked financing instruments have created new capital access opportunities. Green bonds fund eligible environmental projects, while sustainability-linked loans provide pricing incentives linked to ESG performance targets. These instruments often offer favorable terms compared to conventional financing, creating direct financial benefits from improved ESG performance.

Regulatory developments are accelerating the integration of ESG into financial decision-making. The EU Sustainable Finance Disclosure Regulation requires financial institutions to disclose ESG integration practices. The EU Taxonomy establishes classification criteria for sustainable activities. Central banks and regulators are incorporating climate risk into prudential frameworks. These developments ensure that ESG considerations will continue to grow in importance for capital access.`,
  },
];

// Disclosure requirements
const DISCLOSURE_REQUIREMENTS = [
  {
    framework: "GRI Standards",
    requirements: [
      "GRI 301: Materials - Material topics disclosure",
      "GRI 302: Energy - Energy consumption within organization",
      "GRI 303: Water - Water withdrawal by source",
      "GRI 305: Emissions - Direct (Scope 1) GHG emissions",
      "GRI 306: Waste - Waste generated by type",
      "GRI 307: Environmental Compliance",
      "GRI 401: Employment - Employee numbers and turnover",
      "GRI 403: Occupational Health and Safety",
      "GRI 404: Training and Education",
      "GRI 405: Diversity and Equal Opportunity",
    ],
  },
  {
    framework: "SASB Standards",
    requirements: [
      "Energy Management - Total energy consumed",
      "Greenhouse Gas Emissions - Scope 1 and Scope 2",
      "Air Quality - Air emissions by type",
      "Water Management - Water withdrawal and consumption",
      "Waste Management - Waste generated and recycled",
      "Employee Health & Safety - Incident rates",
      "Workforce Development - Training hours",
      "Supply Chain Management - Supplier screening",
      "Business Ethics - Fines and settlements",
      "Product Safety - Product recalls",
    ],
  },
  {
    framework: "TCFD",
    requirements: [
      "Governance - Board oversight of climate risks",
      "Governance - Management's role in climate risk",
      "Strategy - Climate-related risks and opportunities",
      "Strategy - Impact on business and financial planning",
      "Strategy - Resilience under different scenarios",
      "Risk Management - Climate risk identification process",
      "Risk Management - Climate risk management process",
      "Risk Management - Integration with overall risk management",
      "Metrics - Scope 1, 2, and 3 GHG emissions",
      "Metrics - Climate-related targets and progress",
    ],
  },
  {
    framework: "CDP",
    requirements: [
      "Governance - Board-level oversight of climate issues",
      "Targets - Emission reduction targets and progress",
      "Risks - Climate-related risks and opportunities",
      "Strategy - Climate strategy and scenario analysis",
      "Emissions - Scope 1, 2, and 3 emissions inventory",
      "Energy - Energy consumption and mix",
      "Water - Water risks and management",
      "Forests - Deforestation risks and commitments",
      "Verification - Third-party verification of data",
      "Engagement - Value chain engagement activities",
    ],
  },
];

interface ESGScores {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
  riskLevel: keyof typeof RISK_LEVELS;
  riskLabel: string;
  riskColor: string;
}

interface FactorScore {
  id: string;
  name: string;
  score: number;
  weight: number;
  weightedScore: number;
}

interface SupplyChainRisk {
  id: string;
  name: string;
  score: number;
  weight: number;
  status: "compliant" | "partial" | "non_compliant" | "not_assessed";
}

// Reset defaults
const DEFAULT_ENV_SCORES = {
  carbon_emissions: 60,
  energy_efficiency: 55,
  waste_management: 50,
  water_management: 65,
  biodiversity: 45,
  pollution_prevention: 70,
};

const DEFAULT_SOC_SCORES = {
  labor_rights: 65,
  health_safety: 70,
  diversity_inclusion: 55,
  community_impact: 60,
  human_rights: 68,
};

const DEFAULT_GOV_SCORES = {
  board_composition: 60,
  ethics_compliance: 72,
  risk_management: 58,
  transparency: 65,
  shareholder_rights: 55,
};

export function ESGRiskRatingTool() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Company inputs
  const [companyName, setCompanyName] = useState("");
  const [industrySector, setIndustrySector] = useState<keyof typeof INDUSTRY_SECTORS>("shipping");
  const [companySize, setCompanySize] = useState<"small" | "medium" | "large">("medium");
  const [reportingYear, setReportingYear] = useState("2024");

  // Environmental factor scores (0-100)
  const [envScores, setEnvScores] = useState<Record<string, number>>({ ...DEFAULT_ENV_SCORES });

  // Social factor scores
  const [socScores, setSocScores] = useState<Record<string, number>>({ ...DEFAULT_SOC_SCORES });

  // Governance factor scores
  const [govScores, setGovScores] = useState<Record<string, number>>({ ...DEFAULT_GOV_SCORES });

  // Supply chain scores
  const [supplyChainScores, setSupplyChainScores] = useState<Record<string, number>>({
    supplier_screening: 55,
    supplier_audit: 50,
    conflict_minerals: 60,
    responsible_sourcing: 52,
    supply_chain_traceability: 45,
    tier2_management: 40,
  });

  // Compliance framework toggles
  const [frameworks, setFrameworks] = useState<Record<string, boolean>>({
    GRI: true,
    SASB: false,
    TCFD: true,
    CDP: false,
    UN_SDG: true,
  });

  // Calculate ESG scores
  const esgScores = useMemo((): ESGScores => {
    // Calculate weighted average for each dimension
    const calcDimensionScore = (
      factors: typeof RISK_FACTORS.environmental,
      scores: Record<string, number>
    ): number => {
      const totalWeight = factors.reduce((sum, f) => sum + f.weight, 0);
      const weightedSum = factors.reduce((sum, f) => {
        const score = scores[f.id] || 0;
        return sum + (score * f.weight / 100);
      }, 0);
      return Math.round((weightedSum / totalWeight) * 100);
    };

    const environmental = calcDimensionScore(RISK_FACTORS.environmental, envScores);
    const social = calcDimensionScore(RISK_FACTORS.social, socScores);
    const governance = calcDimensionScore(RISK_FACTORS.governance, govScores);

    // Overall score (equal weight for each dimension)
    const overall = Math.round((environmental + social + governance) / 3);

    // Determine risk level
    let riskLevel: keyof typeof RISK_LEVELS = "critical";
    for (const [level, config] of Object.entries(RISK_LEVELS)) {
      if (overall >= config.range[0] && overall <= config.range[1]) {
        riskLevel = level as keyof typeof RISK_LEVELS;
        break;
      }
    }

    return {
      environmental,
      social,
      governance,
      overall,
      riskLevel,
      riskLabel: RISK_LEVELS[riskLevel].label,
      riskColor: RISK_LEVELS[riskLevel].color,
    };
  }, [envScores, socScores, govScores]);

  // Calculate detailed factor scores
  const factorScores = useMemo(() => {
    const processFactors = (
      _dimension: ESGDimension,
      factors: typeof RISK_FACTORS.environmental,
      scores: Record<string, number>
    ): FactorScore[] => {
      return factors.map((f) => ({
        id: f.id,
        name: f.name,
        score: scores[f.id] || 0,
        weight: f.weight,
        weightedScore: ((scores[f.id] || 0) * f.weight / 100),
      }));
    };

    return {
      environmental: processFactors("environmental", RISK_FACTORS.environmental, envScores),
      social: processFactors("social", RISK_FACTORS.social, socScores),
      governance: processFactors("governance", RISK_FACTORS.governance, govScores),
    };
  }, [envScores, socScores, govScores]);

  // Calculate supply chain risks
  const supplyChainRisks = useMemo((): SupplyChainRisk[] => {
    return SUPPLY_CHAIN_RISKS.map((risk) => {
      const score = supplyChainScores[risk.id] || 0;
      let status: SupplyChainRisk["status"] = "not_assessed";
      if (score >= 70) status = "compliant";
      else if (score >= 50) status = "partial";
      else if (score > 0) status = "non_compliant";
      return { ...risk, score, status };
    });
  }, [supplyChainScores]);

  // Industry comparison data
  const industryComparison = useMemo(() => {
    const sector = INDUSTRY_SECTORS[industrySector];
    return [
      { name: "Your Score", score: esgScores.overall, fill: BRAND_COLORS.ocean },
      { name: "Industry Avg", score: sector.avgScore, fill: BRAND_COLORS.logistics },
      { name: "Best-in-Class", score: 85, fill: "#22C55E" },
      { name: "Regulatory Min", score: 40, fill: "#EF4444" },
    ];
  }, [esgScores.overall, industrySector]);

  // Radar chart data
  const radarData = useMemo(() => {
    return [
      { subject: "Environmental", value: esgScores.environmental, fullMark: 100 },
      { subject: "Social", value: esgScores.social, fullMark: 100 },
      { subject: "Governance", value: esgScores.governance, fullMark: 100 },
      { subject: "Supply Chain", value: Math.round(supplyChainRisks.reduce((s, r) => s + r.score, 0) / supplyChainRisks.length), fullMark: 100 },
      { subject: "Compliance", value: Math.round(Object.entries(frameworks).filter(([_, v]) => v).length / Object.keys(frameworks).length * 100), fullMark: 100 },
    ];
  }, [esgScores, supplyChainRisks, frameworks]);

  // Improvement recommendations
  const recommendations = useMemo(() => {
    const recs: { priority: "high" | "medium" | "low"; dimension: string; area: string; suggestion: string; impact: string }[] = [];

    // Environmental recommendations
    if (envScores.carbon_emissions < 60) {
      recs.push({
        priority: "high",
        dimension: "Environmental",
        area: "Carbon Emissions",
        suggestion: "Implement science-based targets (SBTi) and develop a carbon reduction roadmap",
        impact: "+15-20 points",
      });
    }
    if (envScores.energy_efficiency < 60) {
      recs.push({
        priority: "high",
        dimension: "Environmental",
        area: "Energy Efficiency",
        suggestion: "Conduct energy audits and invest in renewable energy sources",
        impact: "+10-15 points",
      });
    }

    // Social recommendations
    if (socScores.diversity_inclusion < 60) {
      recs.push({
        priority: "medium",
        dimension: "Social",
        area: "Diversity & Inclusion",
        suggestion: "Establish diversity targets and inclusive hiring practices",
        impact: "+8-12 points",
      });
    }
    if (socScores.health_safety < 70) {
      recs.push({
        priority: "high",
        dimension: "Social",
        area: "Health & Safety",
        suggestion: "Enhance safety training programs and implement leading indicators",
        impact: "+12-18 points",
      });
    }

    // Governance recommendations
    if (govScores.transparency < 65) {
      recs.push({
        priority: "medium",
        dimension: "Governance",
        area: "Transparency",
        suggestion: "Publish annual sustainability report with third-party assurance",
        impact: "+10-15 points",
      });
    }
    if (govScores.ethics_compliance < 70) {
      recs.push({
        priority: "medium",
        dimension: "Governance",
        area: "Ethics & Compliance",
        suggestion: "Strengthen anti-corruption policies and whistleblower mechanisms",
        impact: "+8-12 points",
      });
    }

    // Supply chain recommendations
    if (supplyChainScores.supply_chain_traceability < 50) {
      recs.push({
        priority: "low",
        dimension: "Supply Chain",
        area: "Traceability",
        suggestion: "Implement supply chain mapping and traceability technology",
        impact: "+15-20 points",
      });
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }, [envScores, socScores, govScores, supplyChainScores]);

  // Framework compliance status
  const frameworkCompliance = useMemo(() => {
    const activeFrameworks = Object.entries(frameworks)
      .filter(([_, active]) => active)
      .map(([key]) => key as keyof typeof COMPLIANCE_FRAMEWORKS);

    return activeFrameworks.map((key) => {
      const framework = COMPLIANCE_FRAMEWORKS[key];
      // Calculate compliance score based on overall ESG performance
      const complianceScore = Math.min(100, Math.round(esgScores.overall * 0.9 + Math.random() * 10));
      return {
        ...framework,
        key,
        complianceScore,
        status: complianceScore >= 70 ? "Compliant" : complianceScore >= 50 ? "Partial" : "Gaps Identified",
      };
    });
  }, [frameworks, esgScores.overall]);

  // ESG dimension pie chart data
  const esgPieData = useMemo(() => [
    { name: "Environmental", value: esgScores.environmental, color: BRAND_COLORS.logistics },
    { name: "Social", value: esgScores.social, color: BRAND_COLORS.ocean },
    { name: "Governance", value: esgScores.governance, color: "#8B5CF6" },
  ], [esgScores]);

  // Historical trend data (simulated)
  const trendData = useMemo(() => [
    { year: "2020", environmental: 45, social: 52, governance: 48, overall: 48 },
    { year: "2021", environmental: 50, social: 55, governance: 52, overall: 52 },
    { year: "2022", environmental: 54, social: 58, governance: 55, overall: 56 },
    { year: "2023", environmental: 58, social: 62, governance: 58, overall: 59 },
    { year: "2024", environmental: esgScores.environmental, social: esgScores.social, governance: esgScores.governance, overall: esgScores.overall },
  ], [esgScores]);

  const chartColors = {
    ocean: BRAND_COLORS.ocean,
    logistics: BRAND_COLORS.logistics,
    warning: "#F59E0B",
    danger: "#EF4444",
    success: "#22C55E",
  };

  // Reset function
  const handleReset = () => {
    setCompanyName("");
    setIndustrySector("shipping");
    setCompanySize("medium");
    setReportingYear("2024");
    setEnvScores({ ...DEFAULT_ENV_SCORES });
    setSocScores({ ...DEFAULT_SOC_SCORES });
    setGovScores({ ...DEFAULT_GOV_SCORES });
    setSupplyChainScores({
      supplier_screening: 55,
      supplier_audit: 50,
      conflict_minerals: 60,
      responsible_sourcing: 52,
      supply_chain_traceability: 45,
      tier2_management: 40,
    });
    setFrameworks({
      GRI: true,
      SASB: false,
      TCFD: true,
      CDP: false,
      UN_SDG: true,
    });
  };

  // Export function
  const handleExport = () => {
    const exportData = {
      companyName: companyName || "Unnamed Company",
      industrySector: INDUSTRY_SECTORS[industrySector].name,
      companySize,
      reportingYear,
      assessmentDate: new Date().toISOString(),
      scores: {
        overall: esgScores.overall,
        environmental: esgScores.environmental,
        social: esgScores.social,
        governance: esgScores.governance,
        riskLevel: esgScores.riskLabel,
      },
      factorScores: {
        environmental: factorScores.environmental.map(f => ({
          name: f.name,
          score: f.score,
          weight: f.weight,
        })),
        social: factorScores.social.map(f => ({
          name: f.name,
          score: f.score,
          weight: f.weight,
        })),
        governance: factorScores.governance.map(f => ({
          name: f.name,
          score: f.score,
          weight: f.weight,
        })),
      },
      supplyChainRisks: supplyChainRisks.map(r => ({
        name: r.name,
        score: r.score,
        status: r.status,
      })),
      frameworks: Object.entries(frameworks)
        .filter(([_, active]) => active)
        .map(([key]) => COMPLIANCE_FRAMEWORKS[key as keyof typeof COMPLIANCE_FRAMEWORKS].name),
      recommendations: recommendations,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `esg-assessment-${companyName || "company"}-${reportingYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share function
  const handleShare = async () => {
    const shareData = {
      title: "ESG Risk Assessment Results",
      text: `ESG Score: ${esgScores.overall} (${esgScores.riskLabel}) - Environmental: ${esgScores.environmental}, Social: ${esgScores.social}, Governance: ${esgScores.governance}`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or share failed - copy to clipboard as fallback
        navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
      }
    } else {
      navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Animated Badges */}
      <div className="relative overflow-hidden rounded-2xl p-8 md:p-12 bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border/50">
        <div className="absolute inset-0 bg-grid-black/[0.02] dark:bg-grid-white/[0.02] bg-[size:20px_20px]" />
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="space-y-4">
              {/* Animated Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge 
                  className="animate-pulse bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 hover:bg-[var(--logistics)]/20 transition-all"
                >
                  <Leaf className="h-3 w-3 mr-1" />
                  ESG Compliance
                </Badge>
                <Badge 
                  className="animate-pulse delay-100 bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 hover:bg-[var(--ocean)]/20 transition-all"
                  style={{ animationDelay: "100ms" }}
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Sustainability
                </Badge>
                <Badge 
                  className="animate-pulse delay-200 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all"
                  style={{ animationDelay: "200ms" }}
                >
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  Risk Assessment
                </Badge>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-[var(--ocean)]/10 border border-[var(--ocean)]/20">
                  <ShieldCheck className="h-8 w-8 text-[var(--ocean)]" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                    ESG Risk Rating Tool
                  </h1>
                  <p className="text-muted-foreground text-sm md:text-base mt-1">
                    Comprehensive Environmental, Social & Governance Assessment
                  </p>
                </div>
              </div>
              
              <p className="text-muted-foreground max-w-2xl text-sm md:text-base">
                Evaluate your organization&apos;s ESG performance across multiple dimensions. 
                Get actionable insights, compare against industry benchmarks, and identify improvement opportunities.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-[var(--ocean)]/5 backdrop-blur-sm rounded-xl p-6 text-center border border-[var(--ocean)]/10">
                <p className="text-muted-foreground text-sm mb-1">Overall ESG Score</p>
                <div className="text-5xl md:text-6xl font-bold text-foreground">
                  {esgScores.overall}
                </div>
                <Badge 
                  className="mt-2"
                  style={{ backgroundColor: esgScores.riskColor, color: 'white' }}
                >
                  {esgScores.riskLabel}
                </Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-[var(--logistics)]/5 rounded-lg p-3 text-center border border-[var(--logistics)]/10">
                  <Leaf className="h-5 w-5 text-[var(--logistics)] mx-auto mb-1" />
                  <p className="text-xl font-bold text-[var(--logistics)]">{esgScores.environmental}</p>
                  <p className="text-xs text-muted-foreground">Env</p>
                </div>
                <div className="bg-[var(--ocean)]/5 rounded-lg p-3 text-center border border-[var(--ocean)]/10">
                  <Users className="h-5 w-5 text-[var(--ocean)] mx-auto mb-1" />
                  <p className="text-xl font-bold text-[var(--ocean)]">{esgScores.social}</p>
                  <p className="text-xs text-muted-foreground">Soc</p>
                </div>
                <div className="bg-purple-500/5 rounded-lg p-3 text-center border border-purple-500/10">
                  <Building2 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-purple-500">{esgScores.governance}</p>
                  <p className="text-xs text-muted-foreground">Gov</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-l-4 bg-card" style={{ borderLeftColor: BRAND_COLORS.logistics }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Environmental</p>
                <p className="text-2xl font-bold text-[var(--logistics)]">{esgScores.environmental}</p>
              </div>
              <Leaf className="h-8 w-8 text-[var(--logistics)]/20" />
            </div>
            <Progress value={esgScores.environmental} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 bg-card" style={{ borderLeftColor: BRAND_COLORS.ocean }}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Social</p>
                <p className="text-2xl font-bold text-[var(--ocean)]">{esgScores.social}</p>
              </div>
              <Users className="h-8 w-8 text-[var(--ocean)]/20" />
            </div>
            <Progress value={esgScores.social} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-purple-500 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Governance</p>
                <p className="text-2xl font-bold text-purple-500">{esgScores.governance}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500/20" />
            </div>
            <Progress value={esgScores.governance} className="h-1.5 mt-2" />
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-amber-500 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">vs Industry</p>
                <p className={`text-2xl font-bold ${esgScores.overall >= INDUSTRY_SECTORS[industrySector].avgScore ? "text-green-500" : "text-red-500"}`}>
                  {esgScores.overall >= INDUSTRY_SECTORS[industrySector].avgScore ? "+" : ""}{esgScores.overall - INDUSTRY_SECTORS[industrySector].avgScore}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-amber-500/20" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {INDUSTRY_SECTORS[industrySector].name}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator" className="flex items-center gap-1.5">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="disclosure" className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Disclosure</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Calculator */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <ShieldCheck className="h-5 w-5 text-[var(--logistics)]" />
                  ESG Risk Assessment
                </CardTitle>
                <CardDescription>Comprehensive ESG scoring across Environmental, Social, and Governance dimensions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Industry Sector</Label>
                    <Select value={industrySector} onValueChange={(v) => setIndustrySector(v as keyof typeof INDUSTRY_SECTORS)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(INDUSTRY_SECTORS).map(([key, data]) => {
                          const Icon = data.icon;
                          return (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                {data.name}
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Company Size</Label>
                    <Select value={companySize} onValueChange={(v) => setCompanySize(v as typeof companySize)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small (&lt;250 employees)</SelectItem>
                        <SelectItem value="medium">Medium (250-1000)</SelectItem>
                        <SelectItem value="large">Large (&gt;1000)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Reporting Year</Label>
                  <Select value={reportingYear} onValueChange={setReportingYear}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* E, S, G Factor Inputs */}
                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Environmental Factors</h4>
                  {RISK_FACTORS.environmental.map((factor) => (
                    <div key={factor.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">{factor.name}</Label>
                        <Badge variant="outline" className="text-xs">{factor.weight}%</Badge>
                      </div>
                      <Slider
                        value={[envScores[factor.id] || 0]}
                        onValueChange={(v) => setEnvScores(prev => ({ ...prev, [factor.id]: v[0] }))}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate pr-2">{factor.description}</span>
                        <span className="font-medium text-[var(--logistics)] shrink-0">{envScores[factor.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Social Factors</h4>
                  {RISK_FACTORS.social.map((factor) => (
                    <div key={factor.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">{factor.name}</Label>
                        <Badge variant="outline" className="text-xs">{factor.weight}%</Badge>
                      </div>
                      <Slider
                        value={[socScores[factor.id] || 0]}
                        onValueChange={(v) => setSocScores(prev => ({ ...prev, [factor.id]: v[0] }))}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate pr-2">{factor.description}</span>
                        <span className="font-medium text-[var(--ocean)] shrink-0">{socScores[factor.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-sm">Governance Factors</h4>
                  {RISK_FACTORS.governance.map((factor) => (
                    <div key={factor.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-sm">{factor.name}</Label>
                        <Badge variant="outline" className="text-xs">{factor.weight}%</Badge>
                      </div>
                      <Slider
                        value={[govScores[factor.id] || 0]}
                        onValueChange={(v) => setGovScores(prev => ({ ...prev, [factor.id]: v[0] }))}
                        max={100}
                        step={1}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span className="truncate pr-2">{factor.description}</span>
                        <span className="font-medium text-purple-500 shrink-0">{govScores[factor.id] || 0}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card className="border-t-4 bg-card" style={{ borderTopColor: BRAND_COLORS.logistics }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <Calculator className="h-5 w-5 text-[var(--logistics)]" />
                  ESG Score Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center p-6 rounded-lg" style={{ backgroundColor: `${esgScores.riskColor}15` }}>
                    <p className="text-sm text-muted-foreground mb-2">Overall ESG Score</p>
                    <div className="text-6xl font-bold" style={{ color: esgScores.riskColor }}>
                      {esgScores.overall}
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Badge style={{ backgroundColor: esgScores.riskColor }} className="text-white">
                        {esgScores.riskLabel}
                      </Badge>
                    </div>
                  </div>

                  {/* Dimension Scores */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-4 rounded-lg text-center bg-[var(--logistics)]/5 border border-[var(--logistics)]/10">
                      <Leaf className="h-5 w-5 text-[var(--logistics)] mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Environmental</p>
                      <p className="text-2xl font-bold text-[var(--logistics)]">{esgScores.environmental}</p>
                    </div>
                    <div className="p-4 rounded-lg text-center bg-[var(--ocean)]/5 border border-[var(--ocean)]/10">
                      <Users className="h-5 w-5 text-[var(--ocean)] mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Social</p>
                      <p className="text-2xl font-bold text-[var(--ocean)]">{esgScores.social}</p>
                    </div>
                    <div className="p-4 bg-purple-500/5 rounded-lg text-center border border-purple-500/10">
                      <Building2 className="h-5 w-5 text-purple-500 mx-auto mb-1" />
                      <p className="text-xs text-muted-foreground">Governance</p>
                      <p className="text-2xl font-bold text-purple-500">{esgScores.governance}</p>
                    </div>
                  </div>

                  {/* Industry Comparison */}
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">vs. Industry Average</span>
                      <span className={`text-sm font-bold ${esgScores.overall >= INDUSTRY_SECTORS[industrySector].avgScore ? "text-green-500" : "text-destructive"}`}>
                        {esgScores.overall >= INDUSTRY_SECTORS[industrySector].avgScore ? "+" : ""}
                        {esgScores.overall - INDUSTRY_SECTORS[industrySector].avgScore} points
                      </span>
                    </div>
                    <Progress value={(esgScores.overall / 100) * 100} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Industry: {INDUSTRY_SECTORS[industrySector].name} (Avg: {INDUSTRY_SECTORS[industrySector].avgScore})
                    </p>
                  </div>

                  {/* Compliance Status */}
                  <div className={`p-4 rounded-lg ${
                    esgScores.riskLevel === "low" ? "bg-green-500/10 border border-green-500/20" :
                    esgScores.riskLevel === "medium" ? "bg-yellow-500/10 border border-yellow-500/20" :
                    esgScores.riskLevel === "high" ? "bg-orange-500/10 border border-orange-500/20" : "bg-destructive/10 border border-destructive/20"
                  }`}>
                    <div className="flex items-center gap-2">
                      {esgScores.riskLevel === "low" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : esgScores.riskLevel === "medium" ? (
                        <Info className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                      )}
                      <p className="font-medium text-card-foreground">
                        {esgScores.riskLevel === "low" ? "Strong ESG Performance" :
                         esgScores.riskLevel === "medium" ? "Moderate ESG Performance - Improvements Recommended" :
                         esgScores.riskLevel === "high" ? "Elevated ESG Risk - Action Required" :
                         "Critical ESG Risk - Immediate Action Required"}
                      </p>
                    </div>
                  </div>

                  {/* Export/Share Buttons */}
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Results
                    </Button>
                    <Button variant="outline" className="flex-1" onClick={handleShare}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Results
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Radar and Pie Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Radar Chart */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">ESG Risk Radar</CardTitle>
                <CardDescription>Multi-dimensional view of ESG performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                      <PolarAngleAxis dataKey="subject" className="text-xs fill-muted-foreground" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} className="text-xs fill-muted-foreground" />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke={chartColors.ocean}
                        fill={chartColors.ocean}
                        fillOpacity={0.5}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-card-foreground">
                  <PieChartIcon className="h-5 w-5 text-[var(--ocean)]" />
                  ESG Dimension Distribution
                </CardTitle>
                <CardDescription>Score distribution across ESG pillars</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={esgPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {esgPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [value, "Score"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Industry Comparison Bar Chart */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                Industry Benchmarking
              </CardTitle>
              <CardDescription>Compare your ESG score against industry benchmarks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={industryComparison}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs fill-muted-foreground" />
                    <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
                    <Tooltip formatter={(value: number) => [value, "Score"]} />
                    <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                      {industryComparison.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Activity className="h-5 w-5 text-[var(--ocean)]" />
                ESG Performance Trends
              </CardTitle>
              <CardDescription>Historical performance and projected improvements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} className="stroke-border" />
                    <XAxis dataKey="year" className="text-xs fill-muted-foreground" />
                    <YAxis domain={[0, 100]} className="text-xs fill-muted-foreground" />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="environmental" stackId="1" stroke={BRAND_COLORS.logistics} fill={BRAND_COLORS.logistics} fillOpacity={0.6} name="Environmental" />
                    <Area type="monotone" dataKey="social" stackId="1" stroke={BRAND_COLORS.ocean} fill={BRAND_COLORS.ocean} fillOpacity={0.6} name="Social" />
                    <Area type="monotone" dataKey="governance" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="Governance" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Lightbulb className="h-5 w-5 text-[var(--logistics)]" />
                Improvement Recommendations
              </CardTitle>
              <CardDescription>Prioritized actions to improve your ESG score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-3 border rounded-lg ${
                      rec.priority === "high" ? "border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-950/20" :
                      rec.priority === "medium" ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-950/20" :
                      "border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-950/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <div className={`mt-0.5 ${
                          rec.priority === "high" ? "text-red-500" :
                          rec.priority === "medium" ? "text-yellow-500" :
                          "text-green-500"
                        }`}>
                          {rec.priority === "high" ? (
                            <AlertTriangle className="h-4 w-4" />
                          ) : rec.priority === "medium" ? (
                            <Info className="h-4 w-4" />
                          ) : (
                            <Target className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge
                              variant="outline"
                              className={
                                rec.priority === "high" ? "border-red-500 text-red-500" :
                                rec.priority === "medium" ? "border-yellow-500 text-yellow-500" :
                                "border-green-500 text-green-500"
                              }
                            >
                              {rec.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">{rec.dimension}</Badge>
                          </div>
                          <p className="text-sm font-medium text-card-foreground">{rec.area}</p>
                          <p className="text-xs text-muted-foreground">{rec.suggestion}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0">{rec.impact}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Disclosure */}
        <TabsContent value="disclosure" className="space-y-6 mt-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <FileText className="h-5 w-5 text-[var(--ocean)]" />
                ESG Reporting Requirements
              </CardTitle>
              <CardDescription>Key disclosure frameworks and their requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Framework Toggles */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {Object.entries(COMPLIANCE_FRAMEWORKS).map(([key, framework]) => (
                    <div
                      key={key}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        frameworks[key] 
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5" 
                          : "border-border bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => setFrameworks(prev => ({ ...prev, [key]: !prev[key] }))}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm text-card-foreground">{framework.name}</span>
                        <Switch checked={frameworks[key]} />
                      </div>
                      <p className="text-xs text-muted-foreground">{framework.description}</p>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Framework Compliance Status */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {frameworkCompliance.map((fw) => (
                    <Card key={fw.key} className="bg-card border">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-card-foreground">{fw.name}</h4>
                            <p className="text-xs text-muted-foreground">{fw.fullName}</p>
                          </div>
                          <Badge
                            className={
                              fw.status === "Compliant" ? "bg-green-500" :
                              fw.status === "Partial" ? "bg-yellow-500" : "bg-red-500"
                            }
                          >
                            {fw.status}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Compliance Score</span>
                            <span className="font-medium text-card-foreground">{fw.complianceScore}%</span>
                          </div>
                          <Progress value={fw.complianceScore} className="h-2" />
                          <div className="flex flex-wrap gap-1 mt-2">
                            {fw.metrics.slice(0, 3).map((metric, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {metric}
                              </Badge>
                            ))}
                            {fw.metrics.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{fw.metrics.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Disclosure Requirements by Framework */}
          <div className="grid md:grid-cols-2 gap-6">
            {DISCLOSURE_REQUIREMENTS.map((framework) => (
              <Card key={framework.framework} className="bg-card">
                <CardHeader>
                  <CardTitle className="text-lg text-card-foreground">{framework.framework}</CardTitle>
                  <CardDescription>Key disclosure requirements</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 max-h-64 overflow-y-auto">
                    {framework.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Guide */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* Educational Content */}
          <div className="grid gap-6">
            {Object.values(EDUCATIONAL_CONTENT).map((section) => (
              <Card key={section.title} className="bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-card-foreground">
                    <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pro Tips */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <ThumbsUp className="h-5 w-5 text-[var(--logistics)]" />
                Pro Tips for ESG Excellence
              </CardTitle>
              <CardDescription>Actionable strategies to improve your ESG performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => {
                  const Icon = tip.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border border-border bg-muted/30">
                      <Icon className="h-6 w-6 text-[var(--ocean)] mb-2" />
                      <h4 className="font-medium text-card-foreground mb-1">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card className="bg-card border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <XCircle className="h-5 w-5 text-destructive" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Pitfalls that can undermine your ESG efforts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => {
                  const Icon = mistake.icon;
                  return (
                    <div key={index} className="p-4 rounded-lg border border-destructive/20 bg-destructive/5">
                      <div className="flex items-start gap-3">
                        <Icon className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
                        <div>
                          <h4 className="font-medium text-card-foreground mb-1">{mistake.title}</h4>
                          <p className="text-sm text-muted-foreground">{mistake.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Comprehensive answers to common ESG questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-card-foreground hover:text-[var(--ocean)]">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pb-2">
                        {faq.answer}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
