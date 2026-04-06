"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Container,
  Anchor,
  Globe2,
  BarChart3,
  Activity,
  LineChart,
  PieChart,
  ArrowRight,
  Clock,
  Zap,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const intelligenceFeatures = [
  {
    title: "Freight Rate Trends",
    description: "Real-time tracking of container freight rates across major trade routes with historical analysis and forecasting.",
    icon: TrendingUp,
    color: "from-blue-500 to-cyan-500",
    href: "#",
    status: "coming-soon",
  },
  {
    title: "Container Availability Index",
    description: "Monitor container availability at major ports worldwide to optimize booking and reduce wait times.",
    icon: Container,
    color: "from-emerald-500 to-teal-500",
    href: "#",
    status: "coming-soon",
  },
  {
    title: "Port Congestion Monitor",
    description: "Live congestion status and wait times at over 500 ports globally with predictive analytics.",
    icon: Anchor,
    color: "from-purple-500 to-violet-500",
    href: "#",
    status: "coming-soon",
  },
  {
    title: "Trade Route Analysis",
    description: "Comprehensive analysis of major shipping lanes including transit times, costs, and risk factors.",
    icon: Globe2,
    color: "from-orange-500 to-amber-500",
    href: "#",
    status: "coming-soon",
  },
];

const additionalTools = [
  { title: "Market Reports", icon: BarChart3, description: "Weekly market insights" },
  { title: "Demand Forecasts", icon: LineChart, description: "AI-powered predictions" },
  { title: "Risk Analysis", icon: Activity, description: "Route risk assessment" },
  { title: "Commodity Analytics", icon: PieChart, description: "Price tracking & trends" },
];

export default function TradeIntelligencePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-cyan-950/20">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Under Development
            </Badge>
          </div>
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Trade Intelligence Hub
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time market data, freight trends, and analytics for global trade professionals.
            Make data-driven decisions with actionable insights.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-5 max-w-6xl mx-auto mb-8"
        >
          {intelligenceFeatures.map((feature, index) => (
            <motion.div key={feature.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-teal-500 group-hover:to-cyan-500 group-hover:text-white transition-all"
                    disabled
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Feature in Development
                    <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-6xl mx-auto mb-8"
        >
          <h2 className="text-xl font-bold text-center mb-5">Additional Intelligence Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {additionalTools.map((tool, index) => (
              <Card
                key={tool.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                    <tool.icon className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-teal-500 to-cyan-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Launching Q2 2025</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Our Trade Intelligence Hub is currently in active development. Get access to real-time freight data,
                market analytics, and predictive insights to optimize your supply chain decisions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-teal-600 hover:bg-white/90">
                  <Link href="/tools">
                    Explore Current Tools
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/contact">
                    Get Notified
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
