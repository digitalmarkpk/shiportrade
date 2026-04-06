"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  ArrowRight,
  Clock,
  Zap,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Wheat,
  Fuel,
  Activity,
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

const commodityCards = [
  {
    title: "Agricultural Commodities",
    description: "Track prices and trade flows for grain, soybeans, wheat, corn, and other agricultural products.",
    icon: Wheat,
    color: "from-amber-500 to-yellow-500",
    topCommodity: "Soybeans",
    price: "$528/MT",
    change: "+2.4%",
    trendUp: true,
  },
  {
    title: "Energy & Fuels",
    description: "Crude oil, LNG, coal, and refined petroleum product prices and shipping demand analysis.",
    icon: Fuel,
    color: "from-slate-500 to-gray-600",
    topCommodity: "Brent Crude",
    price: "$78.50/bbl",
    change: "-1.2%",
    trendUp: false,
  },
  {
    title: "Metals & Minerals",
    description: "Iron ore, copper, aluminum, and steel pricing with shipping route cost analysis.",
    icon: Package,
    color: "from-orange-500 to-red-500",
    topCommodity: "Iron Ore",
    price: "$118/MT",
    change: "+3.8%",
    trendUp: true,
  },
  {
    title: "Trade Flow Analytics",
    description: "Visualize commodity trade flows, identify emerging routes, and analyze market shifts.",
    icon: Activity,
    color: "from-blue-500 to-indigo-500",
    topCommodity: "Analysis",
    price: "Real-time",
    change: "Live",
    trendUp: true,
  },
];

const priceIndices = [
  { name: "BDI (Dry Bulk)", value: "1,847", change: "+2.1%", up: true },
  { name: "Baltic Cape", value: "2,450", change: "+4.3%", up: true },
  { name: "Baltic Panamax", value: "1,680", change: "-0.8%", up: false },
  { name: "Baltic Supramax", value: "1,320", change: "+1.5%", up: true },
];

export default function CommoditiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/20 to-amber-50/30 dark:from-slate-950 dark:via-orange-950/10 dark:to-amber-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <BarChart3 className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Commodity Trade Analytics
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track commodity prices and trade flows. Understand market dynamics and optimize 
            your commodity shipping strategy with real-time intelligence.
          </p>
        </motion.div>

        {/* Price Indices Banner */}
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
                  <DollarSign className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold">Shipping Indices</span>
                </div>
                <div className="flex flex-wrap gap-6">
                  {priceIndices.map((index) => (
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

        {/* Main Commodity Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {commodityCards.map((card) => (
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
                      <p className="text-xs text-muted-foreground">Top Commodity</p>
                      <p className="font-medium">{card.topCommodity}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-semibold">{card.price}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Change</p>
                      <p className={`font-medium flex items-center gap-1 justify-end ${card.trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
                        {card.trendUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {card.change}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all"
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
          <h2 className="text-2xl font-bold text-center mb-8">Analytics Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Price Alerts", icon: DollarSign },
              { title: "Flow Visualizations", icon: Activity },
              { title: "Market Reports", icon: BarChart3 },
              { title: "Supply Analysis", icon: Package },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
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
          <Card className="bg-gradient-to-r from-orange-500 to-amber-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Commodity Intelligence Launching Soon</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Get comprehensive commodity trade analytics, price tracking, and flow visualization 
                to make informed trading and shipping decisions.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-orange-600 hover:bg-white/90">
                  <Link href="/tools/ocean-freight/freight-index">
                    Freight Index Tool
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/trade-intelligence">
                    Back to Intelligence Hub
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
