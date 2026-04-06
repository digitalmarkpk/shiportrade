"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import {
  Globe,
  Building2,
  Ship,
  Users,
  MapPin,
  ArrowRight,
  Search,
  Plane,
  Award,
  Star,
  Shield,
  Clock,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const directoryColors: Record<string, { bg: string; text: string }> = {
  "Freight Forwarders": { bg: "icon-ocean", text: "text-[var(--ocean)]" },
  "Customs Brokers": { bg: "icon-customs", text: "text-[var(--accent-rose)]" },
  "Shipping Lines": { bg: "icon-logistics", text: "text-[var(--logistics)]" },
  "Port Directory": { bg: "icon-warehouse", text: "text-[var(--accent-cyan)]" },
  "Air Cargo Carriers": { bg: "icon-air", text: "text-[var(--accent-purple)]" },
  "Trade Associations": { bg: "icon-ecommerce", text: "text-[var(--accent-amber)]" },
};

const directories = [
  {
    title: "Freight Forwarders",
    description: "Find trusted freight forwarding companies for your shipments worldwide. Verified partners with proven track records.",
    icon: Ship,
    count: "2,500+",
    href: "/directories/freight-forwarders",
    stats: ["180+ Countries", "Verified Partners", "24/7 Support"],
  },
  {
    title: "Customs Brokers",
    description: "Licensed customs brokers for smooth clearance and compliance. Expert handling of import/export procedures.",
    icon: Building2,
    count: "1,200+",
    href: "/directories/customs-brokers",
    stats: ["Licensed Agents", "Fast Clearance", "Compliance Experts"],
  },
  {
    title: "Shipping Lines",
    description: "Major shipping lines and carriers worldwide. Compare services, routes, and schedules.",
    icon: Ship,
    count: "150+",
    href: "/directories/shipping-lines",
    stats: ["Global Coverage", "Real-time Schedules", "Rate Comparison"],
  },
  {
    title: "Port Directory",
    description: "Comprehensive port information globally. Facilities, services, contacts, and performance metrics.",
    icon: MapPin,
    count: "5,000+",
    href: "/directories/ports",
    stats: ["UN/LOCODE Data", "Terminal Info", "Performance Metrics"],
  },
  {
    title: "Air Cargo Carriers",
    description: "Airlines and air cargo operators for time-sensitive shipments. Capacity and network information.",
    icon: Plane,
    count: "200+",
    href: "/directories/air-cargo",
    stats: ["IATA Members", "Network Coverage", "Capacity Data"],
  },
  {
    title: "Trade Associations",
    description: "Industry associations and organizations. Networking, certifications, and professional development.",
    icon: Users,
    count: "300+",
    href: "/directories/associations",
    stats: ["Industry Networks", "Certifications", "Events & Training"],
  },
];

// 3D Card Component
function DirectoryCard({ directory, index }: { directory: typeof directories[0]; index: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 });
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  
  const colors = directoryColors[directory.title] || directoryColors["Freight Forwarders"];
  const Icon = directory.icon;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={directory.href}>
        <Card className="h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-xl transition-all cursor-pointer group overflow-hidden">
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/5 to-[var(--logistics)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <CardHeader className="pb-3 relative">
            <div className="flex items-center justify-between mb-3">
              <motion.div 
                className={`w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="h-7 w-7 text-white" />
              </motion.div>
              <Badge className="text-base font-bold bg-gradient-to-r from-muted to-muted/50">
                {directory.count}
              </Badge>
            </div>
            <CardTitle className="text-xl group-hover:text-[var(--ocean)] transition-colors">
              {directory.title}
            </CardTitle>
            <CardDescription className="text-sm leading-relaxed">
              {directory.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="relative">
            <div className="flex flex-wrap gap-2 mb-4">
              {directory.stats.map((stat) => (
                <Badge key={stat} variant="secondary" className="text-xs">
                  {stat}
                </Badge>
              ))}
            </div>
            <div className="flex items-center text-sm text-[var(--ocean)] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>Browse directory</span>
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}

export default function DirectoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5 border-b border-border/40">
        <div className="absolute inset-0 bg-dots-pattern opacity-30" />
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border-[var(--ocean)]/20 text-[var(--ocean)] dark:text-[var(--ocean-light)] font-medium">
                <Globe className="h-4 w-4 mr-2 text-[var(--ocean)]" />
                Industry Directory
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Find Logistics Partners
              <span className="block mt-2 text-gradient-hero">Worldwide</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with trusted freight forwarders, customs brokers, shipping lines, 
              and logistics service providers across the globe.
            </p>
            
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search directories..." 
                  className="pl-12 h-12 rounded-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Total Listings", value: "9,350+", icon: Globe, gradient: "icon-ocean" },
            { label: "Countries Covered", value: "180+", icon: MapPin, gradient: "icon-logistics" },
            { label: "Verified Partners", value: "85%", icon: Shield, gradient: "icon-air" },
            { label: "Updated Daily", value: "24/7", icon: Clock, gradient: "icon-ecommerce" },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <motion.div 
                      className={`w-12 h-12 rounded-xl ${stat.gradient} mx-auto mb-3 flex items-center justify-center shadow-md`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <div className="text-2xl font-bold text-gradient-ocean">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Directories Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {directories.map((directory, index) => (
            <DirectoryCard key={directory.title} directory={directory} index={index} />
          ))}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4 bg-muted">
            <Star className="h-4 w-4 mr-1.5 text-[var(--accent-amber)]" />
            Why Use Our Directory
          </Badge>
          <h2 className="text-3xl font-bold">Trusted by Industry Professionals</h2>
        </motion.div>
        
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Shield, title: "Verified Listings", description: "All partners are vetted and verified for quality assurance", gradient: "icon-ocean" },
            { icon: Zap, title: "Instant Access", description: "Search and connect with partners in seconds, not hours", gradient: "icon-logistics" },
            { icon: Award, title: "Industry Standards", description: "Partners meet international quality and compliance standards", gradient: "icon-air" },
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
                  <CardContent className="pt-6">
                    <div className={`w-14 h-14 rounded-2xl ${feature.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-gradient-to-r from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl icon-ocean mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Globe className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">List Your Company</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join our directory of trusted logistics partners. Get discovered by thousands of potential clients worldwide.
            </p>
            <Button asChild size="lg" className="btn-gradient text-white gap-2 h-14 px-10 text-lg">
              <Link href="/contact">
                Get Listed Today
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
