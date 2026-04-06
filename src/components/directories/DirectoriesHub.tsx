"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronRight,
  CheckCircle2,
  Info,
  Sparkles,
  BookOpen,
  Handshake,
  Anchor,
  Container,
  FileCheck,
  TrendingUp,
  ArrowUp,
  Filter,
  X,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// =====================================================
// DIRECTORY DATA
// =====================================================

const directoryCategories = [
  {
    id: "freight-forwarders",
    title: "Freight Forwarders",
    shortTitle: "Forwarders",
    description: "Find trusted freight forwarding companies for your shipments worldwide. Our verified partners have proven track records in handling international cargo across all transport modes.",
    icon: Ship,
    count: "2,500+",
    href: "/directories/freight-forwarders",
    color: "from-blue-500 to-indigo-600",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    stats: ["180+ Countries", "Verified Partners", "24/7 Support", "All Modes"],
    features: ["Door-to-door coordination", "Documentation handling", "Cargo insurance", "Customs clearance"],
    educationalContent: "Freight forwarders act as intermediaries between shippers and transportation services. They leverage their expertise and relationships to negotiate the best rates and routes for your cargo, handling all the logistics complexity so you don't have to."
  },
  {
    id: "customs-brokers",
    title: "Customs Brokers",
    shortTitle: "Brokers",
    description: "Licensed customs brokers for smooth clearance and compliance. Expert handling of import/export procedures ensures your goods move through borders without delays.",
    icon: Shield,
    count: "1,200+",
    href: "/directories/customs-brokers",
    color: "from-rose-500 to-pink-600",
    bgColor: "bg-rose-50",
    textColor: "text-rose-600",
    stats: ["Licensed Agents", "Fast Clearance", "Compliance Experts", "Duty Optimization"],
    features: ["HS code classification", "Duty calculation", "Regulatory compliance", "Document preparation"],
    educationalContent: "Customs brokers are licensed professionals who specialize in navigating the complex world of import and export regulations. They ensure your shipments comply with all customs requirements, helping you avoid costly delays and penalties."
  },
  {
    id: "shipping-lines",
    title: "Shipping Lines",
    shortTitle: "Carriers",
    description: "Major container shipping lines and ocean carriers worldwide. Compare services, routes, vessel schedules, and transit times for ocean freight.",
    icon: Anchor,
    count: "320+",
    href: "/directories/shipping-lines",
    color: "from-cyan-500 to-teal-600",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-600",
    stats: ["Global Coverage", "Real-time Schedules", "Rate Comparison", "Vessel Tracking"],
    features: ["Container booking", "Route optimization", "Reefer services", "Special cargo"],
    educationalContent: "Shipping lines own and operate the vessels that carry the majority of world trade. Understanding different carriers' strengths, routes, and service offerings helps you choose the right partner for your specific shipping needs."
  },
  {
    id: "ports",
    title: "Port Directory",
    shortTitle: "Ports",
    description: "Comprehensive global port information including facilities, services, contacts, and performance metrics. Essential for route planning and logistics decisions.",
    icon: MapPin,
    count: "5,000+",
    href: "/directories/ports",
    color: "from-violet-500 to-purple-600",
    bgColor: "bg-violet-50",
    textColor: "text-violet-600",
    stats: ["UN/LOCODE Data", "Terminal Info", "Performance Metrics", "Facilities Guide"],
    features: ["Terminal details", "Berth information", "Equipment specs", "Contact directory"],
    educationalContent: "Ports are critical nodes in the global supply chain. Understanding port facilities, capabilities, and performance helps logistics professionals make informed decisions about routing, transit times, and potential bottlenecks."
  },
  {
    id: "air-cargo",
    title: "Air Cargo Carriers",
    shortTitle: "Airlines",
    description: "Airlines and air cargo operators for time-sensitive shipments. Capacity and network information for express freight and specialized cargo.",
    icon: Plane,
    count: "200+",
    href: "/directories/air-cargo",
    color: "from-sky-500 to-blue-600",
    bgColor: "bg-sky-50",
    textColor: "text-sky-600",
    stats: ["IATA Members", "Network Coverage", "Capacity Data", "Express Services"],
    features: ["Express delivery", "Temperature control", "Dangerous goods", "Charter services"],
    educationalContent: "Air cargo is essential for time-sensitive, high-value, or perishable shipments. Air carriers offer various service levels and specializations, from express parcel delivery to heavyweight cargo charter operations."
  },
  {
    id: "associations",
    title: "Trade Associations",
    shortTitle: "Associations",
    description: "Industry associations and organizations. Networking, certifications, professional development, and industry standards information.",
    icon: Users,
    count: "300+",
    href: "/directories/associations",
    color: "from-amber-500 to-orange-600",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    stats: ["Industry Networks", "Certifications", "Events & Training", "Best Practices"],
    features: ["Industry standards", "Professional development", "Networking events", "Certifications"],
    educationalContent: "Trade associations play a vital role in setting industry standards, providing education, and advocating for the logistics and trade community. Membership can provide valuable networking opportunities and professional development resources."
  }
];

// FAQ Data
const faqData = [
  {
    question: "What is a freight forwarder and do I need one?",
    answer: "A freight forwarder is a company that arranges the transportation of goods on behalf of shippers. They handle the logistics of moving cargo from origin to destination, including booking cargo space, preparing documentation, and coordinating with carriers. If you're shipping internationally, especially if you're new to trade, a freight forwarder can save you time, money, and headaches by navigating the complexities of international shipping."
  },
  {
    question: "How do I choose the right customs broker?",
    answer: "Look for a licensed customs broker with experience in your specific product category and trade lanes. Check their track record, response times, and knowledge of current regulations. A good broker should be proactive about compliance and help you optimize duty payments. Always verify their license status with the relevant customs authority."
  },
  {
    question: "What's the difference between a shipping line and a freight forwarder?",
    answer: "A shipping line (or ocean carrier) owns and operates the vessels that carry cargo. They provide the actual transportation service. A freight forwarder, on the other hand, doesn't own vessels but arranges transportation on your behalf, working with shipping lines and other carriers. Forwarders provide additional services like documentation, customs clearance, and door-to-door coordination."
  },
  {
    question: "How can I verify if a logistics partner is legitimate?",
    answer: "Check for proper licensing and certifications (FMC license for US ocean freight, customs broker license, IATA accreditation for air cargo). Look for industry association memberships (FIATA, IATA, NCBFAA). Read reviews and ask for references. Verify their business registration and insurance coverage. Our directory only lists verified partners to help you avoid fraudulent operators."
  },
  {
    question: "What information should I have ready when contacting a freight forwarder?",
    answer: "Prepare: commodity description and HS code, cargo weight and dimensions, pickup and delivery locations, incoterms, desired shipping date, any special requirements (temperature, hazardous materials, etc.). The more details you provide, the more accurate your quote will be."
  },
  {
    question: "Are the listings in this directory verified?",
    answer: "Yes, we verify listings through multiple methods: business registration checks, license verification with relevant authorities, industry association membership confirmation, and ongoing performance monitoring. However, we always recommend conducting your own due diligence before entering into business relationships."
  }
];

// Benefits data
const benefits = [
  {
    icon: Shield,
    title: "Verified Partners",
    description: "All listings are vetted for legitimacy, proper licensing, and good standing in the industry."
  },
  {
    icon: Zap,
    title: "Quick Connections",
    description: "Find and contact partners in minutes with our comprehensive directory and direct contact information."
  },
  {
    icon: Globe,
    title: "Global Coverage",
    description: "Access partners in 180+ countries for truly worldwide logistics solutions."
  },
  {
    icon: TrendingUp,
    title: "Compare & Choose",
    description: "Compare services, rates, and capabilities to find the best fit for your needs."
  }
];

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export function DirectoriesHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      // Calculate scroll progress
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter directories based on search
  const filteredDirectories = directoryCategories.filter(dir => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      dir.title.toLowerCase().includes(query) ||
      dir.description.toLowerCase().includes(query) ||
      dir.features.some(f => f.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section - Clean & Simple */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50">
        {/* Subtle Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/50 via-cyan-50/30 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-emerald-50/40 via-teal-50/20 to-transparent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-10 md:py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-700 font-medium">Directories</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-3 px-3 py-1.5 bg-blue-50 text-blue-700 border-blue-200">
                <Sparkles className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
                Partner Network
              </Badge>

              <h1 className="text-3xl md:text-4xl font-bold mb-3 text-slate-900">
                Logistics Directories
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mt-1">
                  Find Your Partner
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-600 mb-6 max-w-2xl mx-auto leading-relaxed">
                Connect with <strong>9,000+ verified</strong> freight forwarders, customs brokers, 
                shipping lines, and logistics professionals worldwide.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-4 md:gap-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {[
                { icon: Users, value: "9,000+", label: "Partners", color: "text-blue-600" },
                { icon: Globe, value: "180+", label: "Countries", color: "text-emerald-600" },
                { icon: Award, value: "6", label: "Categories", color: "text-amber-600" },
                { icon: Clock, value: "24/7", label: "Access", color: "text-purple-600" },
              ].map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                    <div className="text-left">
                      <div className="text-base font-bold text-slate-800">{stat.value}</div>
                      <div className="text-xs text-slate-500">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Search */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search directories, partners..." 
                  className="pl-12 h-12 rounded-xl text-base"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4 text-muted-foreground" />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Intro */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Understanding Directories
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
            Your Complete Guide to Logistics Partners
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Finding the right logistics partner is crucial for successful international trade. 
            Our directories connect you with verified professionals who can help you navigate 
            the complexities of global shipping, customs, and supply chain management. 
            Each directory is designed to help you find, compare, and connect with the 
            best partners for your specific needs.
          </p>
        </motion.div>
      </section>

      {/* Directories Grid */}
      <section className="container mx-auto px-4 py-8">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {filteredDirectories.map((directory, index) => {
            const Icon = directory.icon;
            return (
              <motion.div
                key={directory.id}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="h-full"
              >
                <Link href={directory.href} className="block h-full">
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group">
                    {/* Color Bar */}
                    <div className={`h-2 bg-gradient-to-r ${directory.color}`} />
                    
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between mb-3">
                        <motion.div 
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${directory.color} flex items-center justify-center shadow-lg`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <Icon className="h-7 w-7 text-white" />
                        </motion.div>
                        <Badge className={`text-base font-bold ${directory.bgColor} ${directory.textColor} border-0`}>
                          {directory.count}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                        {directory.title}
                      </CardTitle>
                      <CardDescription className="text-sm leading-relaxed line-clamp-3">
                        {directory.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-3">
                      {/* Stats */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {directory.stats.map((stat) => (
                          <Badge key={stat} variant="secondary" className="text-xs font-medium">
                            {stat}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Features */}
                      <div className="space-y-2">
                        {directory.features.slice(0, 3).map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className={`h-4 w-4 ${directory.textColor}`} />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className={`pt-0 ${directory.bgColor} bg-opacity-30`}>
                      <div className={`flex items-center text-sm font-semibold ${directory.textColor} group-hover:gap-2 transition-all`}>
                        <span>Browse Directory</span>
                        <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {filteredDirectories.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">No directories found matching "{searchQuery}"</p>
            <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
              Clear search
            </Button>
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge className="mb-4">
            <Star className="h-4 w-4 mr-2 text-amber-500" />
            Why Choose Our Directories
          </Badge>
          <h2 className="text-3xl font-bold mb-4 text-foreground">Trusted by Industry Professionals</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We&apos;ve built the most comprehensive and reliable logistics directory to help you 
            find partners you can trust.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full text-center border-0 shadow-md hover:shadow-xl transition-all">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 mx-auto mb-4 flex items-center justify-center shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-foreground">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Educational Content - How to Use */}
      <section className="container mx-auto px-4 py-12">
        <Card className="max-w-4xl mx-auto border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                <Info className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">How to Use These Directories</CardTitle>
                <CardDescription>Get the most out of our partner listings</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">1</span>
                  Search & Filter
                </h4>
                <p className="text-sm text-muted-foreground pl-8">
                  Use the search box to find partners by name, service, or location. 
                  Each directory has additional filters for specific needs.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">2</span>
                  Compare Options
                </h4>
                <p className="text-sm text-muted-foreground pl-8">
                  Review partner profiles, services, and credentials. 
                  Compare multiple options before making contact.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">3</span>
                  Verify Credentials
                </h4>
                <p className="text-sm text-muted-foreground pl-8">
                  Check licensing, certifications, and industry memberships. 
                  Our verified badge indicates we&apos;ve confirmed their legitimacy.
                </p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">4</span>
                  Connect & Partner
                </h4>
                <p className="text-sm text-muted-foreground pl-8">
                  Use the contact information to reach out directly. 
                  Many partners offer quotes and consultations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Badge variant="secondary" className="mb-4">
            <HelpCircle className="h-4 w-4 mr-2" />
            Frequently Asked Questions
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">Common Questions</h2>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`faq-${index}`} 
                className="bg-white rounded-2xl border shadow-sm overflow-hidden px-6 data-[state=open]:shadow-lg transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold hover:text-blue-600 py-5 hover:no-underline">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-blue-500 shrink-0" />
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5 leading-relaxed pl-8">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-slate-100 bg-gradient-to-r from-blue-50 via-white to-emerald-50/50">
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-14 h-14 rounded-2xl icon-ocean mx-auto mb-4 flex items-center justify-center shadow-lg">
              <Handshake className="h-7 w-7 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-slate-900">
              List Your Company
            </h2>
            <p className="text-muted-foreground mb-6">
              Join our directory of trusted logistics partners. Get discovered by thousands of 
              potential clients actively searching for services.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild size="default" className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 gap-2 shadow-lg px-6">
                <Link href="/contact">
                  Get Listed Today
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="default" variant="outline" className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-2">
                <Link href="/about">
                  Learn More
                </Link>
              </Button>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Free basic listing
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Verified badge
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Global exposure
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Top */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center hover:shadow-xl hover:scale-110 transition-all z-50"
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
