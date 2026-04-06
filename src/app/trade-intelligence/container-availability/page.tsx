"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Container,
  ArrowRight,
  Clock,
  Zap,
  MapPin,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  Anchor,
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

const availabilityCards = [
  {
    title: "Asia Pacific Ports",
    description: "Container availability at major Asian hubs including Shanghai, Singapore, Busan, and Hong Kong.",
    icon: Anchor,
    color: "from-emerald-500 to-teal-500",
    status: "High",
    statusColor: "text-emerald-600",
    index: 85,
  },
  {
    title: "European Ports",
    description: "Track container availability at Rotterdam, Antwerp, Hamburg, and other European gateways.",
    icon: Container,
    color: "from-blue-500 to-indigo-500",
    status: "Medium",
    statusColor: "text-amber-600",
    index: 62,
  },
  {
    title: "North American Ports",
    description: "Container availability index for LA, Long Beach, NY/NJ, and Savannah.",
    icon: MapPin,
    color: "from-purple-500 to-violet-500",
    status: "Low",
    statusColor: "text-red-600",
    index: 38,
  },
  {
    title: "Global Overview",
    description: "Worldwide container availability trends and predictive analytics for 30-day forecasting.",
    icon: Activity,
    color: "from-orange-500 to-amber-500",
    status: "Live",
    statusColor: "text-blue-600",
    index: "Real-time",
  },
];

const containerTypes = [
  { type: "20' Standard", availability: "Good", icon: CheckCircle, color: "text-emerald-600" },
  { type: "40' Standard", availability: "Moderate", icon: AlertCircle, color: "text-amber-600" },
  { type: "40' High Cube", availability: "Limited", icon: TrendingDown, color: "text-red-600" },
  { type: "Reefer Units", availability: "Available", icon: CheckCircle, color: "text-emerald-600" },
];

export default function ContainerAvailabilityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-teal-50/30 dark:from-slate-950 dark:via-emerald-950/10 dark:to-teal-950/20">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge variant="outline" className="px-4 py-1.5 text-sm border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Container className="h-10 w-10 text-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Container Availability Index
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track container availability at major ports worldwide. Make informed booking decisions 
            and reduce wait times with real-time availability data.
          </p>
        </motion.div>

        {/* Main Availability Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {availabilityCards.map((card) => (
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
                      <p className="text-xs text-muted-foreground">Availability Status</p>
                      <p className={`font-semibold ${card.statusColor}`}>{card.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Index Score</p>
                      <p className="font-bold text-lg">{card.index}{typeof card.index === 'number' ? '/100' : ''}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-teal-500 group-hover:text-white transition-all"
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

        {/* Container Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Container Type Availability</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {containerTypes.map((item) => (
              <Card
                key={item.type}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center mx-auto mb-3">
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{item.type}</h3>
                  <p className={`text-sm ${item.color}`}>{item.availability}</p>
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
          <Card className="bg-gradient-to-r from-emerald-500 to-teal-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-4">Container Intelligence Coming Soon</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Get real-time container availability data, predictive analytics, and smart booking 
                recommendations to optimize your supply chain.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-emerald-600 hover:bg-white/90">
                  <Link href="/tools/ocean-freight/container-guide">
                    Container Guide
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
