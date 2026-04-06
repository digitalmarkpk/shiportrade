"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe2,
  ArrowRight,
  Clock,
  Zap,
  Ship,
  MapPin,
  Navigation,
  Route,
  Clock3,
  AlertTriangle,
  TrendingUp,
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

const routeCards = [
  {
    title: "Asia-Europe Trade Lane",
    description: "Major shipping route connecting Chinese and Southeast Asian ports with European hubs via Suez Canal.",
    icon: Ship,
    color: "from-blue-500 to-indigo-500",
    transitTime: "28-35 days",
    distance: "10,000+ nm",
    ports: "Shanghai, Singapore, Rotterdam, Hamburg",
  },
  {
    title: "Trans-Pacific Eastbound",
    description: "Primary trade route from Asia to North American West Coast ports.",
    icon: Navigation,
    color: "from-emerald-500 to-teal-500",
    transitTime: "14-18 days",
    distance: "5,500+ nm",
    ports: "Shanghai, Busan, LA, Long Beach",
  },
  {
    title: "Trans-Atlantic Routes",
    description: "Connects European and North American East Coast ports across the Atlantic Ocean.",
    icon: Globe2,
    color: "from-purple-500 to-violet-500",
    transitTime: "10-14 days",
    distance: "3,500+ nm",
    ports: "Rotterdam, Antwerp, NY, Savannah",
  },
  {
    title: "Intra-Asia Network",
    description: "Regional routes connecting ports across Southeast, East, and South Asia.",
    icon: Route,
    color: "from-orange-500 to-amber-500",
    transitTime: "3-10 days",
    distance: "500-2,500 nm",
    ports: "Singapore, Hong Kong, Tokyo, Mumbai",
  },
];

const routeFeatures = [
  { title: "Transit Time Analysis", icon: Clock3, description: "Compare transit times" },
  { title: "Port Call Schedules", icon: MapPin, description: "Weekly schedules" },
  { title: "Risk Assessment", icon: AlertTriangle, description: "Route risk factors" },
  { title: "Cost Optimization", icon: TrendingUp, description: "Route cost analysis" },
];

export default function TradeRoutesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-blue-50/30 dark:from-slate-950 dark:via-indigo-950/10 dark:to-blue-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Globe2 className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              Trade Route Analysis
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive analysis of global shipping routes. Optimize your supply chain with 
            detailed route intelligence, transit times, and cost comparisons.
          </p>
        </motion.div>

        {/* Main Route Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {routeCards.map((card) => (
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
                  <div className="space-y-2 mb-4 p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Transit Time:</span>
                      <span className="font-medium">{card.transitTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance:</span>
                      <span className="font-medium">{card.distance}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Major Ports:</span>
                      <span className="font-medium text-right text-xs">{card.ports}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-indigo-500 group-hover:to-blue-500 group-hover:text-white transition-all"
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

        {/* Route Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Route Intelligence Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {routeFeatures.map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-blue-500/20 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
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
          <Card className="bg-gradient-to-r from-indigo-500 to-blue-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Route Analysis Coming Q2 2025</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Access comprehensive trade route data, optimize shipping lanes, and reduce transit times 
                with our intelligent route analysis platform.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-indigo-600 hover:bg-white/90">
                  <Link href="/tools/ocean-freight/transit-time">
                    Transit Time Calculator
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
