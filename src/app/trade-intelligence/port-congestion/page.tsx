"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Anchor,
  ArrowRight,
  Clock,
  Zap,
  AlertTriangle,
  Clock3,
  Ship,
  Activity,
  TrendingUp,
  MapPin,
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

const congestionCards = [
  {
    title: "US West Coast",
    description: "Real-time congestion monitoring for Los Angeles, Long Beach, Oakland, and Seattle ports.",
    icon: Ship,
    color: "from-purple-500 to-violet-500",
    avgWait: "5-8 days",
    vessels: 45,
    status: "High Congestion",
  },
  {
    title: "Northern Europe",
    description: "Track vessel queues and berth availability at Rotterdam, Antwerp, and Hamburg.",
    icon: Anchor,
    color: "from-blue-500 to-indigo-500",
    avgWait: "2-4 days",
    vessels: 28,
    status: "Moderate",
  },
  {
    title: "Asia Hub Ports",
    description: "Congestion status at Shanghai, Singapore, Busan, and major Asian transshipment hubs.",
    icon: MapPin,
    color: "from-emerald-500 to-teal-500",
    avgWait: "1-2 days",
    vessels: 15,
    status: "Normal",
  },
  {
    title: "Global Predictions",
    description: "AI-powered congestion forecasts with 14-day predictive analytics and alerts.",
    icon: Activity,
    color: "from-orange-500 to-amber-500",
    avgWait: "Forecasting",
    vessels: "N/A",
    status: "Coming Soon",
  },
];

const congestionLevels = [
  { port: "Los Angeles", level: "High", color: "bg-red-500", waitTime: "7.2 days" },
  { port: "Long Beach", level: "High", color: "bg-red-500", waitTime: "6.8 days" },
  { port: "Rotterdam", level: "Medium", color: "bg-amber-500", waitTime: "3.1 days" },
  { port: "Singapore", level: "Low", color: "bg-emerald-500", waitTime: "1.5 days" },
];

export default function PortCongestionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-violet-50/30 dark:from-slate-950 dark:via-purple-950/10 dark:to-violet-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-purple-300 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Anchor className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
              Port Congestion Monitor
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time port congestion tracking and predictions. Plan shipments around congestion 
            hotspots and reduce costly delays with predictive insights.
          </p>
        </motion.div>

        {/* Quick Status Banner */}
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
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                  <span className="font-semibold">Current Port Status</span>
                </div>
                <div className="flex flex-wrap gap-6">
                  {congestionLevels.map((port) => (
                    <div key={port.port} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${port.color}`} />
                      <span className="text-sm text-muted-foreground">{port.port}:</span>
                      <span className="text-sm font-medium">{port.waitTime}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Congestion Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {congestionCards.map((card) => (
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
                      <p className="text-xs text-muted-foreground">Avg Wait Time</p>
                      <p className="font-semibold">{card.avgWait}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">Vessels Waiting</p>
                      <p className="font-semibold">{card.vessels}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="font-medium text-sm">{card.status}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-violet-500 group-hover:text-white transition-all"
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
          <h2 className="text-2xl font-bold text-center mb-8">Congestion Intelligence Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Live Vessel Tracking", icon: Ship },
              { title: "Berth Availability", icon: Anchor },
              { title: "Wait Time Estimates", icon: Clock3 },
              { title: "Trend Analysis", icon: TrendingUp },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-3">
                    <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
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
          <Card className="bg-gradient-to-r from-purple-500 to-violet-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Port Intelligence Launching Q2 2025</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Get ahead of port congestion with real-time monitoring, predictive analytics, 
                and automated alerts for your critical shipments.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-white/90">
                  <Link href="/tools/ocean-freight/port-performance">
                    Port Performance Tool
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
