"use client";

import { useState, useMemo } from "react";
import {
  Ship,
  Plane,
  Truck,
  Warehouse,
  Building2,
  User,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Globe,
  Scale,
  Calculator,
  BookOpen,
  HelpCircle,
  Package,
  MapPin,
  Lightbulb,
  Target,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Route,
  Layers,
  RefreshCw,
  Clock,
  Users,
  Rocket,
  Play,
  Award,
  GraduationCap,
  FileText,
  DollarSign,
  Shield,
  ArrowLeftRight,
  Zap,
  AlertCircle,
  CheckCheck,
  TrendingUp,
  FileQuestion,
  Boxes,
  Container,
  Anchor,
  Briefcase,
  Table2,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { incoterms, type Incoterm } from "@/lib/constants/units";

// Brand Colors
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// ==================== COMPREHENSIVE DATA ====================

// Category configuration with full details
const categoryConfig = {
  E: {
    color: "#6366F1",
    name: "Departure",
    fullName: "Departure Terms",
    emoji: "🏭",
    description: "Seller makes goods available at their premises",
    riskLevel: "Lowest seller responsibility",
    buyerControl: "Maximum",
    bestFor: "Experienced buyers with export capabilities"
  },
  F: {
    color: "#0EA5E9",
    name: "Main Carriage Unpaid",
    fullName: "Main Carriage Unpaid by Seller",
    emoji: "🚚",
    description: "Seller delivers to carrier nominated by buyer",
    riskLevel: "Medium seller responsibility",
    buyerControl: "High",
    bestFor: "Buyers who want control over main carriage"
  },
  C: {
    color: "#10B981",
    name: "Main Carriage Paid",
    fullName: "Main Carriage Paid by Seller",
    emoji: "🚢",
    description: "Seller pays for carriage but risk transfers early",
    riskLevel: "Split responsibility",
    buyerControl: "Medium",
    bestFor: "Balanced cost/risk distribution"
  },
  D: {
    color: "#F59E0B",
    name: "Arrival",
    fullName: "Arrival Terms",
    emoji: "📍",
    description: "Seller bears all costs and risks to destination",
    riskLevel: "Highest seller responsibility",
    buyerControl: "Minimum",
    bestFor: "Beginner importers, hassle-free delivery"
  },
};

// Comprehensive Incoterms data
const incotermsData: Record<string, {
  shortDesc: string;
  longDesc: string;
  whoPays: { seller: string[]; buyer: string[] };
  riskPoint: string;
  insurance: string;
  transportMode: string[];
  criticalRisk: string;
  commonMistake: string;
  proTip: string;
  whenToUse: string[];
  whenNotToUse: string[];
  realExample: string;
  documents: string[];
}> = {
  EXW: {
    shortDesc: "Buyer collects from seller's premises",
    longDesc: "Ex Works means the seller delivers when they place the goods at the disposal of the buyer at the seller's premises or at another named place (i.e., works, factory, warehouse, etc.). The seller does not need to load the goods on any collecting vehicle, does not need to clear the goods for export, where such clearance is applicable, or perform any other formalities for export.",
    whoPays: {
      seller: ["Production/packaging only"],
      buyer: ["All transport costs", "Export customs", "Import customs", "Insurance", "All risks from pickup"]
    },
    riskPoint: "Risk transfers when goods are placed at buyer's disposal at the named place",
    insurance: "No obligation for seller. Buyer should arrange comprehensive coverage.",
    transportMode: ["Any mode", "Road", "Rail", "Air", "Sea"],
    criticalRisk: "Buyer bears ALL risk from the moment goods are made available",
    commonMistake: "Buyers assume seller will help with export clearance - seller has NO obligation to assist",
    proTip: "Only use EXW if you have reliable export clearance agents in the seller's country",
    whenToUse: ["When buyer has export clearance capabilities", "For domestic sales", "When buyer wants maximum control"],
    whenNotToUse: ["If buyer cannot handle export formalities", "For first-time importers", "When seller's country has complex export rules"],
    realExample: "A German manufacturer sells machinery to a US buyer. The US buyer sends their own truck to pick up from the German factory and handles all export/import paperwork.",
    documents: ["Commercial Invoice", "Packing List"]
  },
  FCA: {
    shortDesc: "Seller delivers to buyer's carrier at named place",
    longDesc: "Free Carrier means the seller delivers the goods to the carrier or another person nominated by the buyer at the seller's premises or another named place. The parties are well advised to specify as clearly as possible the point within the named place of delivery, as the risk passes to the buyer at that point.",
    whoPays: {
      seller: ["Export packaging", "Loading at seller's premises", "Export customs clearance", "Delivery to named place"],
      buyer: ["Main carriage", "Insurance", "Import customs", "Destination charges"]
    },
    riskPoint: "Risk transfers when goods are delivered to the carrier at the named place",
    insurance: "No obligation for seller. Buyer should arrange coverage from pickup point.",
    transportMode: ["Any mode", "Multimodal", "Container shipping"],
    criticalRisk: "Risk transfers BEFORE main transport begins",
    commonMistake: "Confusing FCA delivery point - must specify exact location in contract",
    proTip: "Use FCA instead of FOB for containerized cargo - it's more appropriate for modern logistics",
    whenToUse: ["Container shipments", "Multimodal transport", "When buyer wants to control main carriage", "Air freight"],
    whenNotToUse: ["If you want seller to handle main carriage", "For bulk cargo on charter vessels"],
    realExample: "A Chinese supplier delivers goods to the buyer's freight forwarder's warehouse in Shanghai. Risk transfers there; buyer's forwarder handles the rest.",
    documents: ["Commercial Invoice", "Packing List", "Export Declaration", "Bill of Lading (from carrier)"]
  },
  FAS: {
    shortDesc: "Seller delivers alongside vessel at port",
    longDesc: "Free Alongside Ship means the seller delivers when the goods are placed alongside the vessel (e.g., on a quay or a barge) nominated by the buyer at the named port of shipment. The risk of loss of or damage to the goods transfers when the goods are alongside the ship.",
    whoPays: {
      seller: ["Export packaging", "Transport to port", "Export customs", "Delivery alongside ship"],
      buyer: ["Loading on vessel", "Main sea freight", "Insurance", "Import customs", "Destination charges"]
    },
    riskPoint: "Risk transfers when goods are placed alongside the vessel at the named port of shipment",
    insurance: "No seller obligation. Buyer must arrange insurance from alongside ship.",
    transportMode: ["Sea and inland waterway only"],
    criticalRisk: "Buyer is responsible for loading - if goods fall during loading, buyer bears the loss",
    commonMistake: "Not specifying which side of the vessel or exact loading point",
    proTip: "Best for bulk cargo, heavy machinery, or goods delivered by barge alongside ships",
    whenToUse: ["Bulk cargo shipments", "Heavy lift cargo", "Barge deliveries", "Non-containerized goods"],
    whenNotToUse: ["Container shipments", "Air freight", "Multimodal transport"],
    realExample: "A Brazilian exporter delivers soybeans alongside the vessel at Santos port. The buyer's stevedores load the cargo onto the ship.",
    documents: ["Commercial Invoice", "Packing List", "Export Declaration", "Dock Receipt"]
  },
  FOB: {
    shortDesc: "Seller delivers on board the vessel",
    longDesc: "Free On Board means the seller delivers the goods on board the vessel nominated by the buyer at the named port of shipment or procures the goods already so delivered. The risk of loss of or damage to the goods transfers when the goods are on board the vessel.",
    whoPays: {
      seller: ["Export packaging", "Transport to port", "Export customs", "Terminal charges", "Loading on vessel"],
      buyer: ["Main sea freight", "Insurance", "Import customs", "Destination charges"]
    },
    riskPoint: "Risk transfers when goods are loaded on board the vessel at the named port of shipment",
    insurance: "No seller obligation. Buyer arranges insurance from onboard point.",
    transportMode: ["Sea and inland waterway only"],
    criticalRisk: "Risk transfers once goods pass the ship's rail - buyer is responsible during voyage",
    commonMistake: "Using FOB for containers - use FCA instead as containers are sealed before reaching ship",
    proTip: "FOB is still the most commonly used term for sea freight - understand it thoroughly",
    whenToUse: ["Bulk cargo", "Breakbulk shipments", "Traditional sea freight", "When buyer controls shipping"],
    whenNotToUse: ["Containerized cargo (use FCA)", "Air freight", "Multimodal transport"],
    realExample: "An Australian miner sells iron ore FOB Port Hedland. The buyer charters a vessel; seller loads ore on board. Risk transfers once loaded.",
    documents: ["Commercial Invoice", "Packing List", "Bill of Lading", "Export Declaration"]
  },
  CFR: {
    shortDesc: "Seller pays freight to destination port",
    longDesc: "Cost and Freight means the seller delivers the goods on board the vessel or procures the goods already so delivered. The seller contracts for and pays the costs and freight necessary to bring the goods to the named port of destination. However, risk transfers when goods are loaded on board at the port of SHIPMENT.",
    whoPays: {
      seller: ["Export packaging", "Transport to port", "Export customs", "Loading", "Main sea freight to destination port"],
      buyer: ["Insurance", "Import customs", "Destination terminal charges", "Inland transport at destination"]
    },
    riskPoint: "Risk transfers when goods are loaded on board at origin - NOT at destination",
    insurance: "No seller obligation. Buyer MUST arrange insurance for the voyage.",
    transportMode: ["Sea and inland waterway only"],
    criticalRisk: "CRITICAL: Seller pays freight but buyer bears ALL risk during voyage",
    commonMistake: "Thinking CFR means seller is responsible until destination port - RISK TRANSFERS AT ORIGIN",
    proTip: "Always arrange your own insurance when buying CFR - seller has no insurance obligation",
    whenToUse: ["When seller can get better freight rates", "Bulk commodities", "When buyer can arrange insurance"],
    whenNotToUse: ["If buyer needs insurance included", "Air freight", "When risk allocation is unclear to buyer"],
    realExample: "A Vietnamese factory ships furniture CFR Los Angeles. Seller pays freight to LA, but if the container falls overboard mid-Pacific, buyer bears the loss.",
    documents: ["Commercial Invoice", "Bill of Lading", "Export Declaration", "Freight Invoice"]
  },
  CIF: {
    shortDesc: "Seller pays freight + minimum insurance",
    longDesc: "Cost, Insurance and Freight means the seller delivers the goods on board the vessel or procures the goods already so delivered. The seller contracts for and pays the costs and freight necessary to bring the goods to the named port of destination. The seller also contracts for insurance cover against the buyer's risk of loss of or damage to the goods during carriage.",
    whoPays: {
      seller: ["Export packaging", "Transport to port", "Export customs", "Loading", "Main sea freight", "Minimum insurance (ICC C)"],
      buyer: ["Import customs", "Destination terminal charges", "Inland transport at destination", "Additional insurance if needed"]
    },
    riskPoint: "Risk transfers when goods are loaded on board at origin - NOT at destination",
    insurance: "Seller must provide Institute Cargo Clauses (C) - minimum coverage only. Coverage is 110% of contract value.",
    transportMode: ["Sea and inland waterway only"],
    criticalRisk: "Insurance is MINIMUM only (ICC C) - covers major perils but NOT all risks",
    commonMistake: "Assuming CIF insurance covers all risks - it only covers Institute Cargo Clauses (C) minimum",
    proTip: "Negotiate for ICC (A) All Risks coverage or buy your own comprehensive insurance",
    whenToUse: ["Commodities trading", "When buyer wants simplified logistics", "Standard trading terms"],
    whenNotToUse: ["If buyer needs comprehensive insurance", "Air freight", "High-value or fragile goods"],
    realExample: "A Thai rice exporter sells CIF Rotterdam. Seller pays freight and provides minimum insurance. Buyer pays duties and unloading in Rotterdam.",
    documents: ["Commercial Invoice", "Bill of Lading", "Insurance Certificate", "Export Declaration"]
  },
  CPT: {
    shortDesc: "Seller pays carriage to destination",
    longDesc: "Carriage Paid To means the seller delivers the goods to the carrier or another person nominated by the seller at an agreed place (if any such place is agreed between parties) and the seller must contract for and pay the costs of carriage necessary to bring the goods to the named place of destination.",
    whoPays: {
      seller: ["Export packaging", "Export customs", "Main carriage to destination", "Delivery to first carrier"],
      buyer: ["Insurance", "Import customs", "Destination charges", "Unloading at destination"]
    },
    riskPoint: "Risk transfers when goods are handed to the FIRST carrier - not at destination",
    insurance: "No seller obligation. Buyer should insure from the moment goods are handed to carrier.",
    transportMode: ["Any mode", "Multimodal", "Air freight", "Road", "Rail"],
    criticalRisk: "Risk transfers to FIRST carrier - if transshipment occurs, seller has paid freight but buyer bears all risk",
    commonMistake: "Assuming risk transfers at destination because seller paid freight",
    proTip: "CPT is ideal for multimodal transport - use for air freight and road/rail combinations",
    whenToUse: ["Multimodal shipments", "Air freight", "When seller controls main carriage", "Door-to-door logistics"],
    whenNotToUse: ["When buyer wants insurance included (use CIP)", "Pure sea freight (use CFR/CIF)"],
    realExample: "An Indian textile manufacturer ships CPT Chicago via air and road. Seller pays air freight to Chicago airport; buyer clears customs and takes delivery.",
    documents: ["Commercial Invoice", "Air Waybill or CMR", "Export Declaration"]
  },
  CIP: {
    shortDesc: "Seller pays carriage + All Risks insurance",
    longDesc: "Carriage and Insurance Paid To means the seller delivers the goods to the carrier or another person nominated by the seller at an agreed place (if any such place is agreed between parties) and the seller must contract for and pay the costs of carriage necessary to bring the goods to the named place of destination. The seller also contracts for insurance cover against the buyer's risk of loss of or damage to the goods during carriage.",
    whoPays: {
      seller: ["Export packaging", "Export customs", "Main carriage to destination", "All Risks insurance (ICC A)"],
      buyer: ["Import customs", "Destination charges", "Unloading at destination"]
    },
    riskPoint: "Risk transfers when goods are handed to the FIRST carrier",
    insurance: "Seller MUST provide Institute Cargo Clauses (A) - All Risks coverage. Coverage is 110% of contract value.",
    transportMode: ["Any mode", "Multimodal", "Air freight", "Road", "Rail"],
    criticalRisk: "Better than CIP - insurance is comprehensive (ICC A) not just minimum",
    commonMistake: "Confusing CIP with CIF - CIP uses ICC (A) All Risks; CIF uses ICC (C) minimum",
    proTip: "CIP is superior to CIF for insurance coverage - requires All Risks, not just minimum",
    whenToUse: ["Multimodal shipments", "High-value goods", "When comprehensive insurance is needed", "Air freight"],
    whenNotToUse: ["Pure sea freight where CIF is standard", "When buyer prefers their own insurance"],
    realExample: "A Japanese electronics maker ships CIP Berlin via air freight. Seller pays air freight and provides All Risks insurance to final destination.",
    documents: ["Commercial Invoice", "Air Waybill", "Insurance Certificate (ICC A)", "Export Declaration"]
  },
  DAP: {
    shortDesc: "Seller delivers to destination, buyer imports",
    longDesc: "Delivered at Place means the seller delivers when the goods, once unloaded from the arriving means of transport, are placed at the disposal of the buyer at the named place of destination. The seller bears all risks involved in bringing the goods to the named place.",
    whoPays: {
      seller: ["All costs to destination", "Export customs", "Main carriage", "Destination delivery", "Unloading"],
      buyer: ["Import customs clearance", "Import duties and taxes"]
    },
    riskPoint: "Risk transfers when goods are placed at buyer's disposal at the named destination",
    insurance: "No obligation for seller, but recommended to cover transit risks.",
    transportMode: ["Any mode", "Multimodal", "Door delivery"],
    criticalRisk: "Seller bears all transit risk but must be careful with import clearance timing",
    commonMistake: "Confusing DAP with DDP - DAP does NOT include import duties",
    proTip: "Good balance for intermediate buyers - seller handles transport, buyer handles customs",
    whenToUse: ["When buyer can handle import clearance", "Door-to-door delivery", "Intermediate buyers"],
    whenNotToUse: ["If buyer cannot clear customs", "First-time importers (use DDP)"],
    realExample: "A Chinese supplier ships DAP Miami warehouse. Goods arrive; buyer clears US customs and pays duties. Seller handles everything else.",
    documents: ["Commercial Invoice", "Bill of Lading/AWB", "Packing List", "Export Declaration", "Delivery Receipt"]
  },
  DPU: {
    shortDesc: "Seller delivers AND unloads at destination",
    longDesc: "Delivered at Place Unloaded means the seller delivers when the goods, once unloaded from the arriving means of transport, are placed at the disposal of the buyer at the named place of destination. The seller bears all risks and costs involved in bringing the goods to the named place of destination and unloading them there.",
    whoPays: {
      seller: ["All costs to destination", "Export customs", "Main carriage", "Destination delivery", "UNLOADING at destination"],
      buyer: ["Import customs clearance", "Import duties and taxes"]
    },
    riskPoint: "Risk transfers when goods are UNLOADED at the named destination",
    insurance: "No obligation for seller, but recommended to cover transit and unloading risks.",
    transportMode: ["Any mode", "Multimodal", "Construction sites", "Terminals"],
    criticalRisk: "Only Incoterm where seller must UNLOAD - if unloading causes damage, seller is responsible",
    commonMistake: "Using DPU when buyer has better unloading facilities - use DAP instead",
    proTip: "Perfect for construction sites, heavy machinery, or when seller controls unloading equipment",
    whenToUse: ["Construction site deliveries", "Heavy machinery", "When seller has unloading equipment", "Terminal deliveries"],
    whenNotToUse: ["If buyer has unloading capabilities", "Standard warehouse deliveries"],
    realExample: "A German machinery maker ships DPU to a construction site in Dubai. Seller's team unloads the heavy equipment using their own cranes.",
    documents: ["Commercial Invoice", "Bill of Lading", "Packing List", "Export Declaration", "Unloading Receipt"]
  },
  DDP: {
    shortDesc: "Seller handles everything including duties",
    longDesc: "Delivered Duty Paid means the seller delivers the goods when the goods are placed at the disposal of the buyer, cleared for import on the arriving means of transport ready for unloading at the named place of destination. The seller bears all costs and risks involved in bringing the goods to the place of destination and has an obligation to clear the goods not only for export but also for import.",
    whoPays: {
      seller: ["All costs to destination", "Export customs", "Main carriage", "Destination delivery", "Import customs", "Import duties and taxes", "Unloading"],
      buyer: ["Nothing - just receive goods"]
    },
    riskPoint: "Risk transfers when goods are placed at buyer's disposal at destination, fully cleared",
    insurance: "No obligation for seller, but essential to protect against transit risks.",
    transportMode: ["Any mode", "Multimodal", "Door delivery"],
    criticalRisk: "Maximum seller obligation - seller must have import clearance capability in buyer's country",
    commonMistake: "Seller not having proper import clearance capability in destination country",
    proTip: "Best for first-time importers or one-time purchases - maximum convenience",
    whenToUse: ["First-time importers", "When buyer cannot handle customs", "Turnkey delivery", "E-commerce cross-border"],
    whenNotToUse: ["If seller lacks import clearance capability", "Complex regulatory environments", "Countries with restricted imports"],
    realExample: "A US retailer orders goods DDP New York. The Chinese supplier handles everything including US customs clearance and duties. Retailer just receives goods.",
    documents: ["Commercial Invoice", "Bill of Lading/AWB", "Packing List", "Import Declaration", "Duty Payment Receipt", "Delivery Receipt"]
  },
};

// FAQ Data - Comprehensive
const faqData = [
  { q: "What are Incoterms and why do they matter?", a: "Incoterms (International Commercial Terms) are standardized three-letter trade terms published by the International Chamber of Commerce (ICC). They define who pays for transport, insurance, customs clearance, and most importantly, where risk transfers from seller to buyer. Using Incoterms correctly prevents costly disputes and ensures both parties understand their obligations." },
  { q: "Which Incoterm is best for beginners?", a: "For beginner importers: DDP (Delivered Duty Paid) - seller handles everything including customs and duties. For beginner exporters: EXW (Ex Works) - minimal seller obligation. However, FCA is often a better middle ground that provides clarity without extreme obligations on either party." },
  { q: "What is the biggest mistake people make with Incoterms?", a: "The #1 mistake is misunderstanding risk transfer in C-terms (CFR, CIF, CPT, CIP). Many believe that because seller pays freight to destination, seller also bears the risk during transit. This is WRONG. Risk transfers at origin (on board or to first carrier) even though seller pays for transport. Always arrange appropriate insurance." },
  { q: "Why is FCA recommended over FOB for containers?", a: "FOB was designed for bulk cargo loaded directly onto ships. Containerized cargo is sealed at seller's premises and delivered to a terminal before loading. The 'on board' risk transfer point in FOB doesn't match container logistics. FCA allows delivery at the container terminal, which aligns with actual shipping practices." },
  { q: "What's the difference between CIF and CIP insurance?", a: "Critical difference: CIF requires only minimum insurance (Institute Cargo Clauses C - covers major perils like fire, stranding, collision). CIP requires All Risks insurance (Institute Cargo Clauses A - comprehensive coverage). For valuable goods, CIP offers much better protection." },
  { q: "Can I use Incoterms for domestic trade?", a: "Yes! Incoterms 2020 explicitly states they can be used for both international and domestic trade. For domestic sales, common terms include EXW (pickup at seller's location), FCA (delivery to buyer's carrier), or DAP/DDP (delivery to buyer's premises)." },
  { q: "How do I write Incoterms correctly in a contract?", a: "Always use format: [Term] + [Named Place] + 'Incoterms 2020'. Examples: 'FOB Shanghai Incoterms 2020' or 'DDP 123 Main St, New York, USA Incoterms 2020'. The named place is critical - it determines exactly where risk transfers." },
  { q: "Who pays import duties under each Incoterm?", a: "Simple rule: In DDP only, seller pays import duties. In ALL other Incoterms, buyer pays import duties. This is one of the clearest distinctions - DDP is the only term where seller clears imports." },
  { q: "What happens if goods are damaged during transit?", a: "It depends on the Incoterm and where damage occurred. Risk transfers at a specific point for each term. If damage happens after risk transfer, buyer bears the loss (and should have insurance). Before risk transfer, seller is responsible. This is why understanding risk transfer points is critical." },
  { q: "Can Incoterms be modified?", a: "Yes, parties can agree to variations, but this is risky. ICC warns that modifications may create confusion and disputes. If you modify terms, document changes clearly. Example: 'CIF Hamburg Incoterms 2020, with seller providing ICC (A) insurance instead of ICC (C).'" },
  { q: "Which Incoterms work for air freight?", a: "For air freight, use multimodal terms: FCA (most common), CPT, CIP, DAP, DPU, or DDP. Do NOT use FOB, FAS, CFR, or CIF - these are specifically for sea and inland waterway transport only." },
  { q: "What documents are needed for each Incoterm?", a: "All terms require Commercial Invoice and Packing List. E-terms need minimal documents. F/C-terms need transport documents (Bill of Lading, Air Waybill). D-terms need both export and import documentation. CIF/CIP require insurance certificates. Always check with your freight forwarder for country-specific requirements." },
];

// WH Questions
const whData = [
  { type: "WHO", icon: Users, color: "from-violet-500 to-purple-600",
    items: [
      { q: "Who created Incoterms?", a: "International Chamber of Commerce (ICC), founded 1919, Paris. First published 1936." },
      { q: "Who uses Incoterms?", a: "Importers, exporters, freight forwarders, banks (for LCs), insurers, customs brokers worldwide." },
      { q: "Who benefits?", a: "Both parties - clear rules prevent disputes, define costs, allocate risks fairly." },
      { q: "Who enforces Incoterms?", a: "No enforcement body - they're contract terms. Courts and arbitration use them to settle disputes." },
    ]
  },
  { type: "WHAT", icon: Package, color: "from-sky-500 to-blue-600",
    items: [
      { q: "What are Incoterms?", a: "11 standardized trade terms defining delivery, cost, and risk allocation in international contracts." },
      { q: "What do they cover?", a: "Delivery point, cost allocation, risk transfer, insurance obligations, customs responsibilities." },
      { q: "What DON'T they cover?", a: "Transfer of ownership/title, payment terms, breach consequences, product liability, transfer of property." },
      { q: "What is Incoterms 2020?", a: "Current version effective Jan 1, 2020. Key changes: DPU replaced DAT, CIP now requires ICC(A) insurance." },
    ]
  },
  { type: "WHERE", icon: MapPin, color: "from-emerald-500 to-teal-600",
    items: [
      { q: "Where do they apply?", a: "Worldwide - recognized in 100+ countries, standard for international contracts." },
      { q: "Where does risk transfer?", a: "Each term has specific point: EXW=at seller's premises, FOB=on board vessel, DDP=at buyer's door." },
      { q: "Where to buy official rules?", a: "ICC website (iccwbo.org), authorized distributors, or ICC publications." },
      { q: "Where to specify in documents?", a: "Sales contract, proforma invoice, commercial invoice, purchase order, LC application." },
    ]
  },
  { type: "WHEN", icon: Clock, color: "from-amber-500 to-orange-600",
    items: [
      { q: "When were Incoterms created?", a: "1936 (first version). Major revisions: 1953, 1980, 1990, 2000, 2010, 2020." },
      { q: "When to use which term?", a: "Based on: your role, experience, transport mode, risk tolerance, and control needs." },
      { q: "When does risk transfer?", a: "Critical to understand: risk point is fixed regardless of who pays freight. Study each term carefully." },
      { q: "When will next revision be?", a: "Expected around 2030. ICC typically updates every 10 years." },
    ]
  },
  { type: "WHY", icon: Lightbulb, color: "from-rose-500 to-pink-600",
    items: [
      { q: "Why use Incoterms?", a: "Eliminates ambiguity, prevents costly disputes, standardizes global trade language." },
      { q: "Why different terms?", a: "Different trade scenarios need different risk/cost allocations - from factory pickup to door delivery." },
      { q: "Why are they updated?", a: "To reflect changing trade practices, security requirements, and logistics technology." },
      { q: "Why learn all 11?", a: "To negotiate better deals, understand total costs, protect your business from hidden risks." },
    ]
  },
  { type: "HOW", icon: Rocket, color: "from-indigo-500 to-violet-600",
    items: [
      { q: "How to choose right term?", a: "Consider role, experience, transport mode, risk tolerance. Use our interactive helper." },
      { q: "How to write correctly?", a: "Format: [Term] + [Named Place] + 'Incoterms 2020'. Example: FOB Shanghai Incoterms 2020" },
      { q: "How do they affect price?", a: "Each term allocates costs differently. FOB price ≠ CIF price. Factor in insurance, freight, duties." },
      { q: "How to avoid disputes?", a: "Specify exact named place, understand risk points, arrange proper insurance, document everything." },
    ]
  },
];

// Quiz questions
const quizQuestions = [
  { q: "In CIF, when does risk transfer from seller to buyer?", opts: ["At destination port", "When loaded on board at origin", "After customs clearance", "When buyer receives goods"], ans: 1, exp: "CIF risk transfers on board at origin - NOT at destination. This is the most common misconception!" },
  { q: "Which term is recommended for containerized cargo?", opts: ["FOB", "FCA", "FAS", "CFR"], ans: 1, exp: "FCA is recommended for containers because FOB's 'on board' rule doesn't match container logistics." },
  { q: "In which term does seller pay import duties?", opts: ["DAP", "DPU", "DDP", "All D-terms"], ans: 2, exp: "Only DDP requires seller to pay import duties. All other terms place this obligation on buyer." },
  { q: "What insurance does CIF require seller to provide?", opts: ["All Risks (ICC A)", "Minimum coverage (ICC C)", "Full replacement value", "No insurance required"], ans: 1, exp: "CIF only requires ICC (C) minimum coverage. For full protection, negotiate ICC (A) or buy separate insurance." },
  { q: "Which term requires seller to UNLOAD at destination?", opts: ["DAP", "DDP", "DPU", "None"], ans: 2, exp: "DPU is the only Incoterm where seller must unload. In DAP and DDP, buyer handles unloading." },
  { q: "In EXW, who handles export clearance?", opts: ["Seller", "Buyer", "Carrier", "Forwarder"], ans: 1, exp: "In EXW, buyer is responsible for everything including export clearance - often problematic if buyer lacks local capability." },
  { q: "CIP requires what insurance level?", opts: ["ICC (C) minimum", "ICC (A) All Risks", "No specific requirement", "Seller's choice"], ans: 1, exp: "Unlike CIF, CIP requires ICC (A) All Risks coverage - a significant improvement in Incoterms 2020." },
  { q: "Which terms are for sea/inland waterway only?", opts: ["All 11 terms", "FOB, FAS, CFR, CIF", "E and F terms only", "D terms only"], ans: 1, exp: "FOB, FAS, CFR, and CIF are for sea only. Use FCA, CPT, CIP, DAP, DPU, DDP for multimodal/air." },
  { q: "Risk in C-terms transfers when?", opts: ["At destination", "When freight is paid", "When goods reach carrier or ship", "After import clearance"], ans: 2, exp: "In C-terms, seller pays freight BUT risk transfers early - to first carrier (CPT/CIP) or on board (CFR/CIF)." },
  { q: "Best Incoterm for first-time importer?", opts: ["EXW", "FOB", "CIF", "DDP"], ans: 3, exp: "DDP is ideal for beginners - seller handles everything including customs and duties. Buyer just receives goods." },
];

// Real-world scenarios
const scenarios = [
  {
    title: "Importing Electronics from China",
    situation: "Small US retailer wants to import consumer electronics from Shenzhen",
    challenge: "No import experience, limited budget, wants full control",
    recommended: "CIP New York",
    reason: "Seller handles freight + All Risks insurance to destination. Buyer only clears imports.",
    avoid: "FOB or EXW - buyer would need to arrange freight and insurance internationally",
  },
  {
    title: "Exporting Machinery to Middle East",
    situation: "German manufacturer selling heavy equipment to UAE construction site",
    challenge: "Heavy lift, specialized unloading needed, construction site delivery",
    recommended: "DPU Construction Site, Dubai",
    reason: "Seller unloads at site using their own cranes. Buyer clears customs.",
    avoid: "DDP - seller would need UAE import clearance capability",
  },
  {
    title: "Bulk Commodity Trading",
    situation: "Trader buying wheat from Argentina for delivery to Egypt",
    challenge: "Bulk cargo, charter vessel, trading margins",
    recommended: "FOB or CIF Alexandria",
    reason: "Standard commodity terms. FOB if buyer controls vessel; CIF if seller has better freight rates.",
    avoid: "DDP - impractical for commodities trading",
  },
  {
    title: "E-commerce Cross-border",
    situation: "Online seller shipping to consumers worldwide",
    challenge: "Many small parcels, customs complexities, customer expectations",
    recommended: "DDP",
    reason: "End customers receive goods with all duties paid. No surprise charges at delivery.",
    avoid: "DDU (deprecated) or DAP - customers may refuse packages with duty demands",
  },
  {
    title: "Air Freight High-Value Goods",
    situation: "Shipping semiconductor equipment from Taiwan to Germany",
    challenge: "High value, air freight, time-sensitive",
    recommended: "CIP Frankfurt Airport",
    reason: "All Risks insurance required (ICC A), seller handles freight, comprehensive coverage.",
    avoid: "CIF - only for sea freight. Use CIP for air/multimodal.",
  },
];

export function IncotermsGuide() {
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("guide");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [expandedWh, setExpandedWh] = useState<number | null>(null);
  const [quizQ, setQuizQ] = useState(0);
  const [quizAns, setQuizAns] = useState<number[]>([]);
  const [quizDone, setQuizDone] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [wizard, setWizard] = useState({ role: "", exp: "", mode: "" });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Smart filtering state
  const [filterMode, setFilterMode] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterComplexity, setFilterComplexity] = useState<string>("all");
  const [compareTerms, setCompareTerms] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("default");
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  // Calculate seller responsibility percentage
  const getSellerResponsibility = (code: string): number => {
    const responsibilities: Record<string, number> = {
      EXW: 10, FCA: 25, FAS: 35, FOB: 40,
      CFR: 50, CIF: 55, CPT: 50, CIP: 55,
      DAP: 75, DPU: 80, DDP: 100
    };
    return responsibilities[code] || 50;
  };

  // Get complexity level
  const getComplexity = (code: string): string => {
    const simple = ["EXW", "DDP"];
    const moderate = ["FCA", "FAS", "FOB", "DAP", "DPU"];
    const complex = ["CFR", "CIF", "CPT", "CIP"];
    if (simple.includes(code)) return "Simple";
    if (moderate.includes(code)) return "Moderate";
    return "Complex";
  };

  // Smart filtered and sorted incoterms
  const smartFilteredIncoterms = useMemo(() => {
    let result = [...incoterms];
    
    // Mode filter
    if (filterMode !== "all") {
      result = result.filter(t => {
        const data = incotermsData[t.code];
        if (filterMode === "sea") return data.transportMode.includes("Sea");
        if (filterMode === "multimodal") return data.transportMode.includes("Any mode");
        return true;
      });
    }
    
    // Category filter
    if (filterCategory !== "all") {
      result = result.filter(t => t.category === filterCategory);
    }
    
    // Complexity filter
    if (filterComplexity !== "all") {
      result = result.filter(t => getComplexity(t.code) === filterComplexity);
    }
    
    // Search filter
    if (searchQuery) {
      result = result.filter(t => 
        t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sorting
    if (sortBy === "responsibility") {
      result.sort((a, b) => getSellerResponsibility(a.code) - getSellerResponsibility(b.code));
    } else if (sortBy === "alpha") {
      result.sort((a, b) => a.code.localeCompare(b.code));
    } else if (sortBy === "category") {
      result.sort((a, b) => a.category.localeCompare(b.category));
    }
    
    return result;
  }, [filterMode, filterCategory, filterComplexity, searchQuery, sortBy]);

  const filteredIncoterms = useMemo(() => {
    if (!searchQuery) return incoterms;
    return incoterms.filter(t => 
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Toggle compare terms
  const toggleCompare = (code: string) => {
    if (compareTerms.includes(code)) {
      setCompareTerms(compareTerms.filter(t => t !== code));
    } else if (compareTerms.length < 3) {
      setCompareTerms([...compareTerms, code]);
    }
  };

  const currentTerm = selectedTerm ? incoterms.find(t => t.code === selectedTerm) : null;
  const currentData = selectedTerm ? incotermsData[selectedTerm] : null;

  const getDiffStyle = (d: string) => {
    switch (d) {
      case "Beginner": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Intermediate": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Advanced": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700";
    }
  };

  return (
    <div className="container mx-auto px-4 space-y-6 py-6">
      {/* Header */}
      <div className="text-center pb-4 border-b">
        <h1 className="text-2xl md:text-3xl font-bold text-[#0F4C81]">Incoterms 2020 Complete Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">The most comprehensive, user-friendly Incoterms reference</p>
        <div className="flex justify-center gap-2 mt-3">
          <Badge variant="outline" className="text-xs"><Globe className="w-3 h-3 mr-1" />11 Terms</Badge>
          <Badge variant="outline" className="text-xs"><Scale className="w-3 h-3 mr-1" />ICC Official</Badge>
          <Badge variant="outline" className="text-xs"><BookOpen className="w-3 h-3 mr-1" />Updated 2020</Badge>
        </div>
      </div>

      {/* Quick Term Selector */}
      <div className="flex flex-wrap justify-center gap-1.5">
        {incoterms.map((t) => {
          const config = categoryConfig[t.category];
          return (
            <button
              key={t.code}
              onClick={() => setSelectedTerm(selectedTerm === t.code ? null : t.code)}
              className={cn(
                "px-3 py-1.5 rounded text-xs font-semibold transition-all",
                selectedTerm === t.code
                  ? "text-white"
                  : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
              style={{
                backgroundColor: selectedTerm === t.code ? config.color : undefined,
                color: selectedTerm === t.code ? "white" : config.color
              }}
            >
              {t.code}
            </button>
          );
        })}
      </div>

      {/* Selected Term Detail */}
      {selectedTerm && currentTerm && currentData && (
        <Card className="border-l-4" style={{ borderLeftColor: categoryConfig[currentTerm.category].color }}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-2xl font-bold px-3 py-1 rounded text-white"
                  style={{ backgroundColor: categoryConfig[currentTerm.category].color }}>
                  {selectedTerm}
                </div>
                <div>
                  <CardTitle className="text-lg">{currentTerm.name}</CardTitle>
                  <CardDescription className="text-sm">{currentData.shortDesc}</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedTerm(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">{currentData.longDesc}</p>

            {/* Quick Facts Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-muted-foreground">Risk Transfer</div>
                <div className="text-sm font-medium">{currentData.riskPoint}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-muted-foreground">Transport Mode</div>
                <div className="text-sm font-medium">{currentData.transportMode.slice(0, 2).join(", ")}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-muted-foreground">Insurance</div>
                <div className="text-sm font-medium">{currentData.insurance.split(".")[0]}</div>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="text-xs text-muted-foreground">Category</div>
                <div className="text-sm font-medium">{categoryConfig[currentTerm.category].name}</div>
              </div>
            </div>

            {/* Critical Risk Warning */}
            <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-sm text-red-700 dark:text-red-400">Critical Risk</div>
                  <div className="text-xs text-red-600 dark:text-red-300">{currentData.criticalRisk}</div>
                </div>
              </div>
            </div>

            {/* Who Pays What */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">Seller Pays</span>
                </div>
                <ul className="space-y-1.5">
                  {currentData.whoPays.seller.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-950/20">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-blue-700 dark:text-blue-400">Buyer Pays</span>
                </div>
                <ul className="space-y-1.5">
                  {currentData.whoPays.buyer.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* When to Use / Not Use */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 text-emerald-600">
                  <CheckCheck className="w-4 h-4" />
                  <span className="font-medium text-sm">When to Use</span>
                </div>
                <ul className="space-y-1">
                  {currentData.whenToUse.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2 text-red-500">
                  <XCircle className="w-4 h-4" />
                  <span className="font-medium text-sm">When NOT to Use</span>
                </div>
                <ul className="space-y-1">
                  {currentData.whenNotToUse.map((item, i) => (
                    <li key={i} className="text-xs text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Common Mistake */}
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-sm text-amber-700 dark:text-amber-400">Common Mistake</div>
                  <div className="text-xs text-amber-600 dark:text-amber-300">{currentData.commonMistake}</div>
                </div>
              </div>
            </div>

            {/* Pro Tip */}
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-sm text-blue-700 dark:text-blue-400">Pro Tip</div>
                  <div className="text-xs text-blue-600 dark:text-blue-300">{currentData.proTip}</div>
                </div>
              </div>
            </div>

            {/* Real Example */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-sm">Real-World Example</div>
                  <div className="text-xs text-muted-foreground">{currentData.realExample}</div>
                </div>
              </div>
            </div>

            {/* Required Documents */}
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-2">Required Documents</div>
              <div className="flex flex-wrap gap-2">
                {currentData.documents.map((doc, i) => (
                  <Badge key={i} variant="outline" className="text-xs">{doc}</Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 h-auto">
          <TabsTrigger value="guide" className="text-xs py-2">Quick Guide</TabsTrigger>
          <TabsTrigger value="scenarios" className="text-xs py-2">Scenarios</TabsTrigger>
          <TabsTrigger value="wh" className="text-xs py-2">WH Guide</TabsTrigger>
          <TabsTrigger value="quiz" className="text-xs py-2">Quiz</TabsTrigger>
          <TabsTrigger value="helper" className="text-xs py-2">Helper</TabsTrigger>
        </TabsList>

        {/* Quick Guide Tab */}
        <TabsContent value="guide" className="mt-4 space-y-6">
          {/* Smart Filter Bar */}
          <Card className="border-2 border-[#0F4C81]/10">
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search Incoterms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-9"
                  />
                </div>
                
                {/* Mode Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Mode:</span>
                  {["all", "sea", "multimodal"].map((mode) => (
                    <Button
                      key={mode}
                      variant={filterMode === mode ? "default" : "outline"}
                      size="sm"
                      className={cn("h-8 px-2 text-xs", filterMode === mode && "bg-[#0F4C81]")}
                      onClick={() => setFilterMode(mode)}
                    >
                      {mode === "all" ? <Globe className="w-3.5 h-3.5" /> : mode === "sea" ? <Ship className="w-3.5 h-3.5" /> : <Plane className="w-3.5 h-3.5" />}
                    </Button>
                  ))}
                </div>
                
                {/* Category Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Category:</span>
                  {["all", "E", "F", "C", "D"].map((cat) => (
                    <Button
                      key={cat}
                      variant={filterCategory === cat ? "default" : "outline"}
                      size="sm"
                      className={cn("h-8 px-2 text-xs", filterCategory === cat && "bg-[#0F4C81]")}
                      onClick={() => setFilterCategory(cat)}
                    >
                      {cat === "all" ? "All" : cat}
                    </Button>
                  ))}
                </div>
                
                {/* Complexity Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-xs text-muted-foreground mr-1">Level:</span>
                  {["all", "Simple", "Moderate", "Complex"].map((c) => (
                    <Button
                      key={c}
                      variant={filterComplexity === c ? "default" : "outline"}
                      size="sm"
                      className={cn("h-8 px-2 text-xs", filterComplexity === c && "bg-[#0F4C81]")}
                      onClick={() => setFilterComplexity(c)}
                    >
                      {c === "all" ? "All" : c}
                    </Button>
                  ))}
                </div>
                
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="h-8 px-2 text-xs border rounded-md bg-background"
                >
                  <option value="default">Default Order</option>
                  <option value="responsibility">By Responsibility</option>
                  <option value="alpha">Alphabetical</option>
                  <option value="category">By Category</option>
                </select>
              </div>
              
              {/* Active filters & results count */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Showing:</span>
                  <Badge variant="secondary" className="font-normal">
                    {smartFilteredIncoterms.length} of 11 terms
                  </Badge>
                  {(filterMode !== "all" || filterCategory !== "all" || filterComplexity !== "all" || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-red-500 hover:text-red-600"
                      onClick={() => {
                        setFilterMode("all");
                        setFilterCategory("all");
                        setFilterComplexity("all");
                        setSearchQuery("");
                      }}
                    >
                      <X className="w-3 h-3 mr-1" /> Clear filters
                    </Button>
                  )}
                </div>
                {compareTerms.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Compare:</span>
                    {compareTerms.map((code) => (
                      <Badge key={code} className="bg-[#0F4C81]">{code}</Badge>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                      onClick={() => setCompareTerms([])}
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Comparison View (when 2+ terms selected) */}
          {compareTerms.length >= 2 && (
            <Card className="border-2 border-[#2E8B57]/30 bg-gradient-to-r from-emerald-50/50 to-blue-50/50 dark:from-emerald-950/20 dark:to-blue-950/20">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <ArrowLeftRight className="w-5 h-5 text-[#2E8B57]" />
                  Side-by-Side Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {compareTerms.map((code) => {
                    const term = incoterms.find(t => t.code === code);
                    const data = incotermsData[code];
                    const config = term ? categoryConfig[term.category] : null;
                    if (!term || !data || !config) return null;
                    return (
                      <div key={code} className="p-3 rounded-lg bg-white dark:bg-slate-900 border">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="px-2 py-1 rounded text-white text-sm font-bold" style={{ backgroundColor: config.color }}>{code}</span>
                          <span className="text-xs text-muted-foreground">{term.name}</span>
                        </div>
                        {/* Responsibility Slider */}
                        <div className="mb-3">
                          <div className="flex justify-between text-[10px] mb-1">
                            <span className="text-emerald-600">Seller</span>
                            <span className="font-medium">{getSellerResponsibility(code)}%</span>
                            <span className="text-blue-600">Buyer</span>
                          </div>
                          <div className="h-2 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full relative">
                            <div 
                              className="absolute w-3 h-3 bg-white border-2 rounded-full top-1/2 -translate-y-1/2 shadow"
                              style={{ left: `${getSellerResponsibility(code)}%`, transform: `translateX(-50%) translateY(-50%)` }}
                            />
                          </div>
                        </div>
                        {/* Quick facts */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Mode:</span>
                            <span>{data.transportMode[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Risk Point:</span>
                            <span className="truncate max-w-[100px]">{data.riskPoint.split(",")[0]}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Insurance:</span>
                            <span>{code === "CIF" ? "ICC (C)" : code === "CIP" ? "ICC (A)" : "None"}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Smart VIP Comparison Table */}
          <Card className="overflow-hidden border-2 border-[#0F4C81]/10">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white py-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Table2 className="w-5 h-5" />
                    Smart Incoterms Comparison Table
                  </CardTitle>
                  <CardDescription className="text-white/80 text-xs">
                    Interactive • Click to select • Shift+Click to compare
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/80">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> Seller</span>
                  <span className="flex items-center gap-1"><User className="w-3 h-3" /> Buyer</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">
                        <input type="checkbox" className="w-3 h-3" readOnly />
                      </th>
                      <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">Term</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">Full Name</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Mode</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Seller %</th>
                      <th className="px-3 py-2.5 text-left font-semibold text-xs uppercase tracking-wide">Risk Transfer</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Export</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Freight</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Import</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Insurance</th>
                      <th className="px-3 py-2.5 text-center font-semibold text-xs uppercase tracking-wide">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {smartFilteredIncoterms.map((term, idx) => {
                      const data = incotermsData[term.code];
                      const config = categoryConfig[term.category];
                      const isEven = idx % 2 === 0;
                      const isSelected = selectedTerm === term.code;
                      const isComparing = compareTerms.includes(term.code);
                      const sellerPct = getSellerResponsibility(term.code);
                      const complexity = getComplexity(term.code);
                      const isHovered = hoveredRow === term.code;
                      
                      return (
                        <tr 
                          key={term.code}
                          className={cn(
                            "cursor-pointer transition-all border-b",
                            isEven ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/50",
                            isSelected && "bg-[#0F4C81]/10 border-l-4 border-l-[#0F4C81]",
                            isComparing && "bg-[#2E8B57]/10 border-l-4 border-l-[#2E8B57]",
                            isHovered && !isSelected && !isComparing && "bg-slate-100 dark:bg-slate-800"
                          )}
                          onMouseEnter={() => setHoveredRow(term.code)}
                          onMouseLeave={() => setHoveredRow(null)}
                          onClick={(e) => {
                            if (e.shiftKey) {
                              toggleCompare(term.code);
                            } else {
                              setSelectedTerm(isSelected ? null : term.code);
                            }
                          }}
                        >
                          <td className="px-3 py-2.5">
                            <input
                              type="checkbox"
                              checked={isComparing}
                              onChange={() => toggleCompare(term.code)}
                              className="w-3 h-3 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                              disabled={!isComparing && compareTerms.length >= 3}
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-2">
                              <span 
                                className="px-2.5 py-1 rounded-md text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
                                style={{ backgroundColor: config.color }}
                              >
                                {term.code}
                              </span>
                              <span className="text-[10px] text-muted-foreground">{term.category}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-medium text-xs">{term.name}</td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="flex justify-center gap-0.5">
                              {data.transportMode.includes("Any mode") ? (
                                <div className="group relative">
                                  <Globe className="w-4 h-4 text-sky-500" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Any transport mode
                                  </div>
                                </div>
                              ) : data.transportMode.includes("Sea") ? (
                                <div className="group relative">
                                  <Ship className="w-4 h-4 text-blue-500" />
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    Sea & inland waterway only
                                  </div>
                                </div>
                              ) : (
                                <Plane className="w-4 h-4 text-violet-500" />
                              )}
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="w-16 mx-auto">
                              <div className="text-[10px] text-center mb-0.5 font-medium">{sellerPct}%</div>
                              <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all"
                                  style={{ width: `${sellerPct}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-xs text-muted-foreground max-w-[150px]">
                            <div className="flex items-center gap-1.5">
                              <div 
                                className="w-2 h-2 rounded-full shrink-0" 
                                style={{ backgroundColor: config.color }}
                              />
                              <span className="truncate" title={data.riskPoint}>{data.riskPoint.split(",")[0]}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="group relative inline-flex">
                              {term.code === "EXW" ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                                  <User className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                                  <Building2 className="w-3 h-3" />
                                </span>
                              )}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {term.code === "EXW" ? "Buyer pays" : "Seller pays"} export customs
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="group relative inline-flex">
                              {["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(term.code) ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                                  <Building2 className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                                  <User className="w-3 h-3" />
                                </span>
                              )}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(term.code) ? "Seller pays" : "Buyer pays"} freight
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="group relative inline-flex">
                              {term.code === "DDP" ? (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600">
                                  <Building2 className="w-3 h-3" />
                                </span>
                              ) : (
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600">
                                  <User className="w-3 h-3" />
                                </span>
                              )}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {term.code === "DDP" ? "Seller pays" : "Buyer pays"} import duties
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <div className="group relative">
                              {term.code === "CIF" ? (
                                <Badge className="bg-amber-500 text-[10px] px-1.5 py-0">C</Badge>
                              ) : term.code === "CIP" ? (
                                <Badge className="bg-emerald-500 text-[10px] px-1.5 py-0">A</Badge>
                              ) : (
                                <span className="text-muted-foreground text-xs">-</span>
                              )}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                {term.code === "CIF" ? "Minimum coverage (ICC C)" : term.code === "CIP" ? "All Risks (ICC A)" : "No insurance required"}
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            <Badge 
                              className={cn(
                                "text-[10px]",
                                complexity === "Simple" && "bg-emerald-100 text-emerald-700",
                                complexity === "Moderate" && "bg-blue-100 text-blue-700",
                                complexity === "Complex" && "bg-amber-100 text-amber-700"
                              )}
                            >
                              {complexity}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              {/* Legend */}
              <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-t flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-600">
                    <Building2 className="w-2.5 h-2.5" />
                  </span>
                  <span className="text-muted-foreground">Seller pays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-blue-100 text-blue-600">
                    <User className="w-2.5 h-2.5" />
                  </span>
                  <span className="text-muted-foreground">Buyer pays</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <span className="text-muted-foreground">Any mode</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Ship className="w-4 h-4 text-blue-500" />
                  <span className="text-muted-foreground">Sea only</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-amber-500 text-[10px] px-1.5 py-0">C</Badge>
                  <span className="text-muted-foreground">Min. insurance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-emerald-500 text-[10px] px-1.5 py-0">A</Badge>
                  <span className="text-muted-foreground">All Risks</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cost Responsibility Matrix */}
          <Card className="overflow-hidden">
            <CardHeader className="py-3 bg-slate-50 dark:bg-slate-800">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#2E8B57]" />
                Cost Responsibility Matrix
              </CardTitle>
              <CardDescription>Who pays for each cost component</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800">
                      <th className="px-2 py-2 text-left font-semibold">Cost Item</th>
                      {incoterms.map(t => {
                        const config = categoryConfig[t.category];
                        return (
                          <th key={t.code} className="px-1 py-2 text-center">
                            <span 
                              className="px-1.5 py-0.5 rounded text-[10px] font-bold text-white"
                              style={{ backgroundColor: config.color }}
                            >
                              {t.code}
                            </span>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Export Packaging", seller: incoterms.map(t => t.code !== "EXW") },
                      { name: "Loading at Origin", seller: incoterms.map(t => ["FAS", "FOB", "CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(t.code)) },
                      { name: "Export Customs", seller: incoterms.map(t => t.code !== "EXW") },
                      { name: "Main Carriage/Freight", seller: incoterms.map(t => ["CFR", "CIF", "CPT", "CIP", "DAP", "DPU", "DDP"].includes(t.code)) },
                      { name: "Insurance", seller: incoterms.map(t => ["CIF", "CIP"].includes(t.code)) },
                      { name: "Import Customs", seller: incoterms.map(t => t.code === "DDP") },
                      { name: "Import Duties", seller: incoterms.map(t => t.code === "DDP") },
                      { name: "Unloading at Dest.", seller: incoterms.map(t => t.code === "DPU") },
                    ].map((row, idx) => (
                      <tr key={row.name} className={idx % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-slate-50/50 dark:bg-slate-800/50"}>
                        <td className="px-2 py-2 font-medium border-r">{row.name}</td>
                        {row.seller.map((isSeller, i) => (
                          <td key={i} className="px-1 py-2 text-center">
                            {isSeller ? (
                              <CheckCircle2 className="w-3.5 h-3.5 mx-auto text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 mx-auto text-blue-500" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-muted-foreground">Seller pays</span>
                </div>
                <div className="flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5 text-blue-500" />
                  <span className="text-muted-foreground">Buyer pays</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Risk Transfer Journey Visualization */}
          <Card className="overflow-hidden border-2 border-[#0F4C81]/10">
            <CardHeader className="bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Route className="w-5 h-5 text-[#0F4C81]" />
                Risk Transfer Journey
              </CardTitle>
              <CardDescription>Visual map of where risk transfers from seller to buyer</CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              {/* Journey Timeline */}
              <div className="relative">
                {/* Timeline Bar */}
                <div className="h-3 bg-gradient-to-r from-emerald-500 via-amber-500 to-blue-500 rounded-full mb-6 relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow" />
                  <div className="absolute left-1/2 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-500 rounded-full border-2 border-white shadow" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
                </div>
                
                {/* Labels */}
                <div className="flex justify-between text-xs mb-4">
                  <span className="text-emerald-600 font-medium">🏭 Seller's Premises</span>
                  <span className="text-amber-600 font-medium">🚚 In Transit</span>
                  <span className="text-blue-600 font-medium">📍 Destination</span>
                </div>
                
                {/* Terms positioned on journey */}
                <div className="grid grid-cols-11 gap-1 text-center">
                  {incoterms.map((term) => {
                    const config = categoryConfig[term.category];
                    const positions: Record<string, number> = {
                      EXW: 0, FCA: 15, FAS: 25, FOB: 30,
                      CFR: 35, CIF: 35, CPT: 35, CIP: 35,
                      DAP: 85, DPU: 90, DDP: 100
                    };
                    const pos = positions[term.code] || 50;
                    const sellerPct = getSellerResponsibility(term.code);
                    
                    return (
                      <div 
                        key={term.code} 
                        className="group cursor-pointer"
                        onClick={() => setSelectedTerm(term.code)}
                      >
                        <div 
                          className="h-12 rounded-md relative transition-all hover:scale-105"
                          style={{ 
                            background: `linear-gradient(to right, ${config.color} ${sellerPct}%, #3B82F6 ${sellerPct}%)`,
                          }}
                        >
                          {/* Marker */}
                          <div 
                            className="absolute top-1/2 w-2 h-2 bg-white rounded-full border-2 shadow-sm -translate-y-1/2"
                            style={{ left: `${pos}%`, transform: `translateX(-50%) translateY(-50%)` }}
                          />
                        </div>
                        <span 
                          className="text-[10px] font-bold mt-1 block"
                          style={{ color: config.color }}
                        >
                          {term.code}
                        </span>
                        <span className="text-[8px] text-muted-foreground block">{sellerPct}%S</span>
                      </div>
                    );
                  })}
                </div>
                
                {/* Legend */}
                <div className="flex justify-center gap-4 mt-4 pt-4 border-t text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-3 rounded bg-gradient-to-r from-emerald-500 to-emerald-500" />
                    <span className="text-muted-foreground">Seller Risk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-4 h-3 rounded bg-gradient-to-r from-blue-500 to-blue-500" />
                    <span className="text-muted-foreground">Buyer Risk</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full border-2" />
                    <span className="text-muted-foreground">Risk Transfer Point</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(categoryConfig).map(([key, config]) => {
              const terms = incoterms.filter(t => t.category === key);
              return (
                <Card key={key} className="overflow-hidden">
                  <div className="h-1" style={{ backgroundColor: config.color }} />
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{config.emoji}</span>
                      <span className="font-semibold text-sm">{key}-Terms</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{config.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {terms.map(t => (
                        <button
                          key={t.code}
                          onClick={() => setSelectedTerm(t.code)}
                          className="px-2 py-0.5 text-xs rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200"
                        >
                          {t.code}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* FAQ */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#0F4C81]" />
                Frequently Asked Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {faqData.map((faq, i) => (
                <div key={i} className="border-b last:border-0">
                  <button
                    className="w-full py-3 flex items-start gap-2 text-left"
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  >
                    {expandedFaq === i ? <ChevronUp className="w-4 h-4 mt-0.5 shrink-0" /> : <ChevronDown className="w-4 h-4 mt-0.5 shrink-0" />}
                    <span className="font-medium text-sm">{faq.q}</span>
                  </button>
                  {expandedFaq === i && (
                    <p className="text-sm text-muted-foreground pb-3 pl-6">{faq.a}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="mt-4 space-y-4">
          {scenarios.map((s, i) => (
            <Card key={i}>
              <CardHeader className="py-3">
                <CardTitle className="text-base">{s.title}</CardTitle>
                <CardDescription>{s.situation}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Challenge</span>
                    <p className="text-sm">{s.challenge}</p>
                  </div>
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">Recommended</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-[#0F4C81]">{s.recommended}</Badge>
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Why?</span>
                  <p className="text-sm">{s.reason}</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg">
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">Avoid</span>
                  <p className="text-sm">{s.avoid}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* WH Guide Tab */}
        <TabsContent value="wh" className="mt-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whData.map((wh, i) => (
              <Card key={i} className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setExpandedWh(expandedWh === i ? null : i)}>
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <wh.icon className="w-5 h-5" style={{ color: `#${wh.color.split(' ')[0].replace('from-', '').replace('-500', '')}` }} />
                      <CardTitle className="text-base">{wh.type}</CardTitle>
                    </div>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", expandedWh === i && "rotate-180")} />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {wh.items.map((item, j) => (
                    <div key={j} className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                      <p className="font-medium text-xs">{item.q}</p>
                      <p className="text-xs text-muted-foreground">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Quiz Tab */}
        <TabsContent value="quiz" className="mt-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-[#0F4C81]" />
                Test Your Incoterms Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!quizStarted ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">{quizQuestions.length} questions • ~3 min</p>
                  <Button onClick={() => setQuizStarted(true)} className="bg-[#0F4C81]">
                    <Play className="w-4 h-4 mr-2" /> Start Quiz
                  </Button>
                </div>
              ) : quizDone ? (
                <div className="text-center py-8">
                  {(() => {
                    const correct = quizAns.filter((a, i) => a === quizQuestions[i].ans).length;
                    const pct = Math.round((correct / quizQuestions.length) * 100);
                    return (
                      <>
                        <div className={cn("w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center",
                          pct >= 70 ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600")}>
                          {pct >= 70 ? <Award className="w-8 h-8" /> : <GraduationCap className="w-8 h-8" />}
                        </div>
                        <p className="font-semibold text-lg">{pct >= 70 ? "Great job!" : "Keep learning!"}</p>
                        <p className="text-muted-foreground mb-4">{correct}/{quizQuestions.length} correct ({pct}%)</p>
                        <Button variant="outline" onClick={() => { setQuizStarted(false); setQuizAns([]); setQuizQ(0); setQuizDone(false); }}>
                          <RefreshCw className="w-4 h-4 mr-2" /> Retake
                        </Button>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Q{quizQ + 1}/{quizQuestions.length}</span>
                    <Progress value={((quizQ + 1) / quizQuestions.length) * 100} className="w-24 h-1.5" />
                  </div>
                  <p className="font-medium">{quizQuestions[quizQ].q}</p>
                  <div className="space-y-2">
                    {quizQuestions[quizQ].opts.map((opt, i) => (
                      <button
                        key={i}
                        className={cn(
                          "w-full p-3 text-left text-sm rounded-lg border transition-colors",
                          quizAns[quizQ] === i ? "border-[#0F4C81] bg-[#0F4C81]/10" : "hover:bg-slate-50"
                        )}
                        onClick={() => {
                          const newAns = [...quizAns];
                          newAns[quizQ] = i;
                          setQuizAns(newAns);
                        }}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" disabled={quizQ === 0} onClick={() => setQuizQ(q => q - 1)}>Prev</Button>
                    <Button size="sm" className="bg-[#0F4C81]" disabled={quizAns[quizQ] === undefined}
                      onClick={() => quizQ < quizQuestions.length - 1 ? setQuizQ(q => q + 1) : setQuizDone(true)}>
                      {quizQ === quizQuestions.length - 1 ? "Finish" : "Next"}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Helper Tab */}
        <TabsContent value="helper" className="mt-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-[#0F4C81]" />
                Find Your Incoterm
              </CardTitle>
              <CardDescription>Answer a few questions to get a personalized recommendation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="font-medium text-sm mb-2">1. Your role?</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant={wizard.role === "buyer" ? "default" : "outline"}
                    className={cn("h-auto py-3", wizard.role === "buyer" && "bg-[#0F4C81]")}
                    onClick={() => setWizard(w => ({ ...w, role: "buyer" }))}>
                    <User className="w-4 h-4 mr-2" /> Buyer / Importer
                  </Button>
                  <Button variant={wizard.role === "seller" ? "default" : "outline"}
                    className={cn("h-auto py-3", wizard.role === "seller" && "bg-[#2E8B57]")}
                    onClick={() => setWizard(w => ({ ...w, role: "seller" }))}>
                    <Building2 className="w-4 h-4 mr-2" /> Seller / Exporter
                  </Button>
                </div>
              </div>
              <div>
                <p className="font-medium text-sm mb-2">2. Your experience level?</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "beginner", label: "🌱 Beginner", desc: "New to trade" },
                    { id: "intermediate", label: "📈 Intermediate", desc: "Some experience" },
                    { id: "expert", label: "🚀 Expert", desc: "Regular trader" },
                  ].map((l) => (
                    <Button key={l.id} variant={wizard.exp === l.id ? "default" : "outline"}
                      className={cn("h-auto py-2", wizard.exp === l.id && "bg-[#0F4C81]")}
                      onClick={() => setWizard(w => ({ ...w, exp: l.id }))}>
                      <div className="text-center">
                        <div className="text-sm">{l.label}</div>
                        <div className="text-[10px] opacity-70">{l.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-sm mb-2">3. Primary transport mode?</p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: "sea", icon: Ship, label: "Sea" },
                    { id: "air", icon: Plane, label: "Air" },
                    { id: "road", icon: Truck, label: "Road" },
                    { id: "multi", icon: Boxes, label: "Multi" },
                  ].map((m) => (
                    <Button key={m.id} variant={wizard.mode === m.id ? "default" : "outline"}
                      className={cn("h-auto py-2", wizard.mode === m.id && "bg-[#0F4C81]")}
                      onClick={() => setWizard(w => ({ ...w, mode: m.id }))}>
                      <m.icon className="w-4 h-4 mr-1" /> {m.label}
                    </Button>
                  ))}
                </div>
              </div>

              {wizard.role && wizard.exp && wizard.mode && (
                <div className="p-4 rounded-lg bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
                  {(() => {
                    let rec = "FCA";
                    let reason = "";
                    
                    if (wizard.role === "buyer") {
                      if (wizard.exp === "beginner") {
                        rec = wizard.mode === "air" ? "CIP" : "DDP";
                        reason = "Maximum convenience - seller handles everything";
                      } else if (wizard.exp === "intermediate") {
                        rec = wizard.mode === "sea" ? "CIF" : "DAP";
                        reason = "Good balance of convenience and control";
                      } else {
                        rec = "FCA";
                        reason = "Maximum control over shipping and costs";
                      }
                    } else {
                      if (wizard.exp === "beginner") {
                        rec = "EXW";
                        reason = "Minimum obligation - buyer handles everything";
                      } else if (wizard.exp === "intermediate") {
                        rec = "FCA";
                        reason = "Clear responsibility with export clearance handled";
                      } else {
                        rec = wizard.mode === "sea" ? "CIF" : "CIP";
                        reason = "Value-added service with freight profit potential";
                      }
                    }

                    return (
                      <div className="flex items-center gap-4">
                        <span className="text-2xl font-bold px-4 py-2 bg-white/20 rounded">{rec}</span>
                        <div>
                          <p className="font-medium">{incoterms.find(t => t.code === rec)?.name}</p>
                          <p className="text-sm text-white/80">{reason}</p>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center pt-4 border-t text-xs text-muted-foreground">
        <p>Incoterms® is a registered trademark of the International Chamber of Commerce (ICC).</p>
        <p>This guide is for educational purposes. Consult ICC official publications for definitive rules.</p>
      </div>
    </div>
  );
}
