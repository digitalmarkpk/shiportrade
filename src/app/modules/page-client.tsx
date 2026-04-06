"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  Shield,
  Warehouse,
  ShoppingBag,
  Leaf,
  Calculator,
  FileText,
  Globe,
  ArrowRight,
  Search,
  BookOpen,
  Users,
  Award,
  Clock,
  Star,
  BarChart3,
  Container,
  MapPin,
  DollarSign,
  Layers,
  Target,
  PieChart,
  CheckCircle,
  AlertTriangle,
  Thermometer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { modulesMetadata } from "@/lib/constants/tools";

// Module icon mapping
const moduleIconMap: Record<string, React.ElementType> = {
  "Globe": Globe,
  "Ship": Ship,
  "Plane": Plane,
  "Truck": Truck,
  "ShieldCheck": Shield,
  "Shield": Shield,
  "Warehouse": Warehouse,
  "ShoppingBag": ShoppingBag,
  "FileCheck": FileText,
  "Leaf": Leaf,
  "Container": Container,
  "Layers": Layers,
  "DollarSign": DollarSign,
  "Landmark": DollarSign,
  "Target": Target,
  "Boxes": PieChart,
  "BarChart": BarChart3,
  "BarChart3": BarChart3,
  "CheckSquare": CheckCircle,
  "Package": Container,
  "Route": Target,
  "AlertTriangle": AlertTriangle,
  "Thermometer": Thermometer,
  "Building2": ShoppingBag,
  "TrendingUp": BarChart3,
  "ClipboardList": CheckCircle,
  "Anchor": MapPin,
  "MapPin": MapPin,
  "FileText": FileText,
  "Link": Layers,
  "Wrench": Calculator,
  "Calculator": Calculator,
};

// Educational content for modules
const moduleEducationalContent: Record<string, {
  lessons: number;
  duration: string;
  level: string;
  students: string;
  rating: number;
  topics: string[];
  featuredTools: string[];
  featuredDocs: string[];
}> = {
  "international-trade": {
    lessons: 12, duration: "8 hours", level: "Beginner to Advanced", students: "45K+", rating: 4.9,
    topics: ["Landed Cost Calculation", "Incoterms 2020", "Currency Exchange", "Trade Finance", "Export Documentation", "Import Compliance"],
    featuredTools: ["Landed Cost Calculator", "Currency Converter", "ROI Calculator"],
    featuredDocs: ["Commercial Invoice", "Proforma Invoice", "Letter of Credit"],
  },
  "ocean-freight": {
    lessons: 15, duration: "12 hours", level: "Beginner to Expert", students: "52K+", rating: 4.9,
    topics: ["Container Operations", "Vessel Scheduling", "Port Management", "CBM Calculations", "FCL/LCL Shipping", "Marine Insurance"],
    featuredTools: ["CBM Calculator", "Container Tracking", "FCL Loadability"],
    featuredDocs: ["Bill of Lading", "Shipping Instructions", "Cargo Manifest"],
  },
  "air-freight": {
    lessons: 8, duration: "6 hours", level: "Intermediate", students: "28K+", rating: 4.8,
    topics: ["IATA Regulations", "ULD Operations", "Volumetric Weight", "Air Waybills", "Perishable Cargo", "Airport Handling"],
    featuredTools: ["Volumetric Weight Calculator", "Air Freight Rate Estimator", "ULD Loadability"],
    featuredDocs: ["Air Waybill", "Cargo Manifest", "Dangerous Goods Declaration"],
  },
  "road-rail": {
    lessons: 10, duration: "7 hours", level: "Intermediate", students: "22K+", rating: 4.7,
    topics: ["Fleet Management", "Route Optimization", "LDM Calculations", "Axle Load Limits", "Intermodal Transport", "Cross-border Operations"],
    featuredTools: ["LDM Calculator", "Axle Load Calculator", "Route Planner"],
    featuredDocs: ["CMR Note", "Consignment Note", "Delivery Receipt"],
  },
  "customs-compliance": {
    lessons: 14, duration: "10 hours", level: "Advanced", students: "38K+", rating: 4.9,
    topics: ["HS Code Classification", "Tariff Calculations", "Rules of Origin", "Free Trade Agreements", "Customs Valuation", "Audit Preparation"],
    featuredTools: ["HS Code Search", "Duty Calculator", "FTA Finder"],
    featuredDocs: ["Certificate of Origin", "Customs Declaration", "Import License"],
  },
  "warehousing": {
    lessons: 11, duration: "8 hours", level: "Intermediate", students: "35K+", rating: 4.8,
    topics: ["Inventory Management", "WMS Systems", "Storage Optimization", "Picking Strategies", "Safety Stock", "Warehouse Layout"],
    featuredTools: ["EOQ Calculator", "Safety Stock Calculator", "Reorder Point Calculator"],
    featuredDocs: ["Warehouse Receipt", "Inventory Report", "Picking List"],
  },
  "ecommerce": {
    lessons: 9, duration: "7 hours", level: "Intermediate", students: "42K+", rating: 4.8,
    topics: ["Amazon FBA", "Shopify Fulfillment", "Last-Mile Delivery", "Returns Management", "Inventory Planning", "Marketplace Integration"],
    featuredTools: ["FBA Calculator", "ROAS Calculator", "Profit Margin Calculator"],
    featuredDocs: ["FNSKU Labels", "Packing Slip", "Return Authorization"],
  },
  "insurance": {
    lessons: 8, duration: "6 hours", level: "Advanced", students: "18K+", rating: 4.7,
    topics: ["Cargo Insurance", "Institute Clauses", "Risk Assessment", "Claims Processing", "Trade Credit", "Liability Coverage"],
    featuredTools: ["Insurance Premium Calculator", "Risk Assessment Tool", "Claims Tracker"],
    featuredDocs: ["Insurance Certificate", "Claims Form", "Survey Report"],
  },
  "sustainability": {
    lessons: 7, duration: "5 hours", level: "Intermediate", students: "15K+", rating: 4.6,
    topics: ["Carbon Footprint", "Green Logistics", "ESG Reporting", "Sustainable Packaging", "Emission Tracking", "Environmental Compliance"],
    featuredTools: ["Carbon Footprint Calculator", "Emission Tracker", "Sustainability Scorecard"],
    featuredDocs: ["ESG Report Template", "Environmental Policy", "Sustainability Checklist"],
  },
  "project-cargo": {
    lessons: 6, duration: "5 hours", level: "Expert", students: "8K+", rating: 4.8,
    topics: ["Heavy Lift Operations", "Oversized Cargo", "Route Surveys", "Engineering Logistics", "Multi-modal Coordination", "Risk Management"],
    featuredTools: ["Lashing Force Calculator", "COG Finder", "Wind Load Calculator"],
    featuredDocs: ["Method Statement", "Route Survey Report", "Risk Assessment"],
  },
  "blockchain-digital-supply-chain": {
    lessons: 5, duration: "4 hours", level: "Advanced", students: "12K+", rating: 4.5,
    topics: ["Blockchain Basics", "Smart Contracts", "Digital Documentation", "Supply Chain Visibility", "IoT Integration", "Data Analytics"],
    featuredTools: ["Traceability Ledger", "Smart Contract Builder"],
    featuredDocs: ["Digital Bill of Lading", "Electronic Certificate"],
  },
  "trade-finance": {
    lessons: 8, duration: "6 hours", level: "Advanced", students: "20K+", rating: 4.8,
    topics: ["Letters of Credit", "Documentary Collections", "Export Financing", "Trade Credit", "Forfaiting", "Payment Terms"],
    featuredTools: ["LC Cost Calculator", "Payment Terms Analyzer", "FX Hedging Tool"],
    featuredDocs: ["Letter of Credit", "Bank Guarantee", "Collection Instruction"],
  },
  "financial-payment": {
    lessons: 6, duration: "5 hours", level: "Intermediate", students: "18K+", rating: 4.7,
    topics: ["Payment Terms", "Currency Management", "Risk Assessment", "Payment Methods", "FX Hedging", "Cash Flow"],
    featuredTools: ["Payment Terms Calculator", "Break-Even Analyzer", "ROI Calculator"],
    featuredDocs: ["Payment Terms Agreement", "Credit Application", "Payment Receipt"],
  },
  "logistics-planning": {
    lessons: 8, duration: "6 hours", level: "Intermediate", students: "18K+", rating: 4.7,
    topics: ["Network Design", "Facility Location", "Demand Forecasting", "Route Optimization", "Supply Chain Modeling", "Capacity Planning"],
    featuredTools: ["Network Optimizer", "Demand Forecaster", "Route Planner"],
    featuredDocs: ["Logistics Plan", "Network Diagram", "Capacity Report"],
  },
  "inventory-management": {
    lessons: 9, duration: "7 hours", level: "Intermediate", students: "25K+", rating: 4.8,
    topics: ["ABC Analysis", "Safety Stock", "Reorder Points", "Inventory Turnover", "Demand Planning", "Stock Optimization"],
    featuredTools: ["EOQ Calculator", "Reorder Point Calculator", "ABC Analyzer"],
    featuredDocs: ["Inventory Policy", "Stock Report", "Reorder Template"],
  },
  "supply-chain-analytics": {
    lessons: 7, duration: "5 hours", level: "Advanced", students: "15K+", rating: 4.7,
    topics: ["KPI Dashboards", "Predictive Analytics", "Performance Metrics", "Data Visualization", "Benchmarking", "Decision Support"],
    featuredTools: ["KPI Dashboard", "Analytics Suite", "Performance Tracker"],
    featuredDocs: ["Analytics Report", "KPI Template", "Benchmark Guide"],
  },
  "quality-control": {
    lessons: 6, duration: "5 hours", level: "Intermediate", students: "12K+", rating: 4.6,
    topics: ["ISO Standards", "Inspection Procedures", "Defect Tracking", "Supplier Quality", "Process Control", "Continuous Improvement"],
    featuredTools: ["Quality Inspector", "Defect Tracker", "Audit Checklist"],
    featuredDocs: ["Quality Manual", "Inspection Report", "NCR Form"],
  },
  "packaging-labeling": {
    lessons: 5, duration: "4 hours", level: "Beginner", students: "10K+", rating: 4.5,
    topics: ["Packaging Design", "Material Selection", "GHS Labeling", "Retail Compliance", "Sustainability", "Cost Optimization"],
    featuredTools: ["Packaging Calculator", "Label Generator", "Material Estimator"],
    featuredDocs: ["Packaging Spec", "Label Template", "Material Sheet"],
  },
  "last-mile-delivery": {
    lessons: 6, duration: "5 hours", level: "Intermediate", students: "14K+", rating: 4.6,
    topics: ["Route Optimization", "Delivery Tracking", "Customer Experience", "Proof of Delivery", "Urban Logistics", "Returns Handling"],
    featuredTools: ["Route Optimizer", "Delivery Tracker", "POD System"],
    featuredDocs: ["Delivery Manifest", "Route Sheet", "POD Template"],
  },
  "dangerous-goods": {
    lessons: 8, duration: "8 hours", level: "Advanced", students: "16K+", rating: 4.9,
    topics: ["IMDG Code", "IATA DGR", "Classification", "Packaging Standards", "Documentation", "Emergency Response"],
    featuredTools: ["DG Classifier", "UN Number Search", "Placard Generator"],
    featuredDocs: ["DG Declaration", "MSDS Template", "Emergency Plan"],
  },
  "cold-chain": {
    lessons: 7, duration: "6 hours", level: "Advanced", students: "11K+", rating: 4.8,
    topics: ["Temperature Control", "Reefer Operations", "Pharma Logistics", "Food Safety", "GDP Compliance", "Monitoring Systems"],
    featuredTools: ["Temp Calculator", "Reefer Spec", "Cold Chain Monitor"],
    featuredDocs: ["Temp Log", "GDP Checklist", "Validation Report"],
  },
  "customs-brokerage": {
    lessons: 10, duration: "10 hours", level: "Expert", students: "9K+", rating: 4.8,
    topics: ["Entry Filing", "Tariff Classification", "Valuation", "Broker Licensing", "Client Relations", "Audit Defense"],
    featuredTools: ["Entry Filer", "Tariff Lookup", "Duty Calculator"],
    featuredDocs: ["Customs Entry", "Power of Attorney", "Broker Agreement"],
  },
  "freight-forwarding": {
    lessons: 9, duration: "8 hours", level: "Intermediate", students: "30K+", rating: 4.8,
    topics: ["Booking Operations", "Carrier Relations", "Rate Management", "Documentation", "Multimodal Coordination", "Customer Service"],
    featuredTools: ["Booking System", "Rate Manager", "Tracking Portal"],
    featuredDocs: ["Booking Confirmation", "Freight Invoice", "Delivery Order"],
  },
  "trade-compliance-advanced": {
    lessons: 12, duration: "12 hours", level: "Expert", students: "7K+", rating: 4.9,
    topics: ["Export Controls", "Sanctions Screening", "Denied Parties", "Export Licensing", "Compliance Programs", "Audit Preparation"],
    featuredTools: ["Sanctions Screener", "License Manager", "Compliance Audit"],
    featuredDocs: ["Export License", "Screening Report", "Compliance Manual"],
  },
  "vessel-operations": {
    lessons: 8, duration: "7 hours", level: "Advanced", students: "6K+", rating: 4.7,
    topics: ["Chartering", "Voyage Planning", "Bunker Management", "Port Calls", "Fleet Optimization", "Maritime Safety"],
    featuredTools: ["Voyage Calculator", "Bunker Planner", "Fleet Tracker"],
    featuredDocs: ["Charter Party", "Voyage Report", "Bunker Receipt"],
  },
  "port-operations": {
    lessons: 8, duration: "7 hours", level: "Intermediate", students: "8K+", rating: 4.7,
    topics: ["Terminal Management", "Container Handling", "Berth Scheduling", "Yard Operations", "Gate Processes", "Port Systems"],
    featuredTools: ["Berth Scheduler", "Yard Planner", "Gate Manager"],
    featuredDocs: ["Berth Application", "Cargo Manifest", "Terminal Report"],
  },
  "documents": {
    lessons: 15, duration: "10 hours", level: "All Levels", students: "60K+", rating: 4.9,
    topics: ["Commercial Documents", "Transport Documents", "Customs Documents", "Financial Documents", "Insurance Documents", "Legal Documents"],
    featuredTools: [],
    featuredDocs: ["Commercial Invoice", "Bill of Lading", "Certificate of Origin"],
  },
};

// Module Data merged with single source of truth for tools/documents counts
const modulesData = modulesMetadata.map(m => {
  const edu = moduleEducationalContent[m.slug] || {
    lessons: 5, duration: "4 hours", level: "Intermediate", students: "10K+", rating: 4.5,
    topics: [], featuredTools: [], featuredDocs: []
  };
  const colorMatch = m.color.match(/from-([a-z]+)-/);
  const colorName = colorMatch ? colorMatch[1] : "blue";
  
  return {
    id: m.slug,
    name: m.name,
    icon: moduleIconMap[m.icon] || Globe,
    color: m.color.replace("bg-gradient-to-br ", ""),
    bgColor: `bg-${colorName}-50`,
    borderColor: `border-${colorName}-200`,
    description: m.description,
    tools: m.tools,
    documents: m.documents,
    lessons: edu.lessons,
    duration: edu.duration,
    level: edu.level,
    students: edu.students,
    rating: edu.rating,
    topics: edu.topics,
    featuredTools: edu.featuredTools,
    featuredDocs: edu.featuredDocs,
  };
});

// Stats Data
const platformStats = [
  { label: "Learning Modules", value: "27", icon: BookOpen },
  { label: "Smart Calculators", value: "150+", icon: Calculator },
  { label: "Document Templates", value: "120+", icon: FileText },
  { label: "Active Learners", value: "75K+", icon: Users },
];

// Certificate tracks
const certificateTracks = [
  { name: "Trade Operations Specialist", modules: 5, duration: "40 hours" },
  { name: "Freight Forwarding Professional", modules: 6, duration: "50 hours" },
  { name: "Supply Chain Manager", modules: 8, duration: "60 hours" },
  { name: "Customs Compliance Expert", modules: 4, duration: "30 hours" },
];

export default function ModulesPageClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const filteredModules = modulesData.filter((module) => {
    const matchesSearch = module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === "all" || module.level.toLowerCase().includes(selectedLevel.toLowerCase());
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Badge className="px-4 py-2 text-sm bg-white/10 border-white/20 text-white backdrop-blur-sm">
                <Award className="h-4 w-4 mr-2" />
                Shiportrade Learning Academy
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              Master Global Trade &
              <span className="block text-cyan-300">Logistics Operations</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8"
            >
              Comprehensive education platform combining professional tools, document templates, 
              and expert training across 27 specialized logistics modules.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-2xl mx-auto mb-10"
            >
              <div className="relative bg-white rounded-2xl shadow-2xl">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-slate-400" />
                <Input
                  type="text"
                  placeholder="Search modules, tools, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-14 pr-4 text-lg text-slate-800 border-0 rounded-2xl focus:ring-2 focus:ring-cyan-400"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {platformStats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <Icon className="h-6 w-6 text-cyan-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-slate-600">Filter by level:</span>
              <div className="flex gap-2 flex-wrap">
                {["all", "Beginner", "Intermediate", "Advanced", "Expert"].map((level) => (
                  <Button
                    key={level}
                    variant={selectedLevel === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLevel(level)}
                    className={selectedLevel === level ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    {level === "all" ? "All Levels" : level}
                  </Button>
                ))}
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filteredModules.length}</span> modules
            </div>
          </motion.div>

          {/* Modules Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.02 }}
                  >
                    <Link href={`/tools/${module.id}`}>
                      <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group border-2 hover:border-blue-400 overflow-hidden">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                              <Icon className="h-7 w-7 text-white" />
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="text-sm font-medium">{module.rating}</span>
                            </div>
                          </div>
                          <CardTitle className="text-xl mt-3 group-hover:text-blue-600 transition-colors">
                            {module.name}
                          </CardTitle>
                          <CardDescription className="line-clamp-2">
                            {module.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Stats */}
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-blue-600">
                              <Calculator className="h-4 w-4" />
                              <span>{module.tools} Tools</span>
                            </div>
                            <div className="flex items-center gap-1 text-emerald-600">
                              <FileText className="h-4 w-4" />
                              <span>{module.documents} Docs</span>
                            </div>
                            <div className="flex items-center gap-1 text-purple-600">
                              <BookOpen className="h-4 w-4" />
                              <span>{module.lessons} Lessons</span>
                            </div>
                          </div>

                          {/* Meta Info */}
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {module.duration}
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {module.level}
                            </Badge>
                          </div>

                          {/* Topics */}
                          {module.topics.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {module.topics.slice(0, 3).map((topic, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {topic}
                                </Badge>
                              ))}
                              {module.topics.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{module.topics.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* CTA */}
                          <div className="flex items-center text-blue-600 text-sm font-medium group-hover:translate-x-1 transition-transform">
                            <span>Explore Module</span>
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Certificate Tracks */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Professional Certificate Tracks</h2>
              <p className="text-slate-600">Complete learning paths for career advancement</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {certificateTracks.map((track, i) => (
                <Card key={i} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <Award className="h-10 w-10 text-amber-500 mx-auto mb-3" />
                    <h3 className="font-semibold text-slate-800 mb-2">{track.name}</h3>
                    <p className="text-sm text-slate-500">{track.modules} modules • {track.duration}</p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Track
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
