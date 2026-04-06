"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  ArrowRight,
  Clock,
  Zap,
  LineChart,
  BarChart3,
  Activity,
  Globe2,
  Ship,
  DollarSign,
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

const rateCards = [
  {
    title: "Asia-Europe Rates",
    description: "Track container freight rates from major Asian ports to European destinations including Rotterdam, Hamburg, and Felixstowe.",
    icon: Ship,
    color: "from-blue-500 to-cyan-500",
    route: "Asia → Europe",
    avgRate: "$2,450/FEU",
    trend: "+5.2%",
    trendUp: true,
  },
  {
    title: "Trans-Pacific Rates",
    description: "Real-time rates for shipments from Asia to North American West and East Coast ports.",
    icon: Globe2,
    color: "from-emerald-500 to-teal-500",
    route: "Asia → USA",
    avgRate: "$3,850/FEU",
    trend: "+8.1%",
    trendUp: true,
  },
  {
    title: "Intra-Asia Rates",
    description: "Regional shipping rates across Southeast Asia, East Asia, and South Asia trade lanes.",
    icon: Activity,
    color: "from-purple-500 to-violet-500",
    route: "Intra-Asia",
    avgRate: "$650/FEU",
    trend: "-2.3%",
    trendUp: false,
  },
  {
    title: "Rate Trend Charts",
    description: "Interactive charts showing historical freight rate movements, seasonal patterns, and market trends.",
    icon: LineChart,
    color: "from-orange-500 to-amber-500",
    route: "Analytics",
    avgRate: "Multi-index",
    trend: "Live",
    trendUp: true,
  },
];

const marketIndices = [
  { name: "FBX Global", value: "3,920", change: "+2.4%", up: true },
  { name: "SCFI", value: "2,156", change: "+3.1%", up: true },
  { name: "BDI Baltic", value: "1,847", change: "-1.2%", up: false },
  { name: "WCI", value: "2,890", change: "+1.8%", up: true },
];

export default function FreightRatesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-blue-950/20 dark:to-cyan-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <TrendingUp className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Freight Rate Trends & Analysis
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time freight rate tracking across major trade routes. Make informed shipping decisions with comprehensive market data and predictive analytics.
          </p>
        </motion.div>

        {/* Market Indices Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="py-4">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">Market Indices</span>
                </div>
                <div className="flex flex-wrap gap-6">
                  {marketIndices.map((index) => (
                    <div key={index.name} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{index.name}:</span>
                      <span className="font-semibold">{index.value}</span>
                      <span className={`text-sm ${index.up ? 'text-emerald-600' : 'text-red-600'}`}>
                        {index.change}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Rate Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {rateCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg`}>
                      <card.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{card.title}</CardTitle>
                  <CardDescription className="text-base">
                    {card.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4 p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-xs text-muted-foreground">Route</p>
                      <p className="font-medium">{card.route}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Avg Rate</p>
                      <p className="font-semibold">{card.avgRate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Trend</p>
                      <p className={`font-medium ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                        {card.trend}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-cyan-500 group-hover:text-white transition-all"
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

        {/* Features Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Planned Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: "Real-time Rate Alerts", icon: Activity },
              { title: "Historical Rate Charts", icon: LineChart },
              { title: "Route Comparisons", icon: Globe2 },
              { title: "Carrier Rate Cards", icon: DollarSign },
              { title: "Forecasting Models", icon: TrendingUp },
              { title: "Market Reports", icon: BarChart3 },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Rate Intelligence Launching Soon</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Get early access to our freight rate analytics platform. Track rates, analyze trends, 
                and make data-driven shipping decisions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-white/90">
                  <Link href="/tools/ocean-freight/freight-rate-benchmark">
                    Explore Rate Tools
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
