"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Ship,
  Plane,
  Truck,
  CheckCircle,
  ArrowRight,
  Clock,
  Globe,
  Shield,
  DollarSign,
  Calendar,
  Package,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CategoryHero } from "@/components/marketplace/CategoryHero";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { CreateListingButton } from "@/components/marketplace/CreateListingButton";
import { freightListings } from "@/lib/data/marketplace-listings";

export function FreightQuotePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    origin: "",
    destination: "",
    cargoType: "",
    weight: "",
    volume: "",
    containerType: "",
    readyDate: "",
    incoterms: "",
    email: "",
    phone: "",
    company: "",
    additionalInfo: "",
  });

  const stats = [
    { label: "Active Carriers", value: "1,200+" },
    { label: "Routes Covered", value: "15,000+" },
    { label: "Avg. Response", value: "< 4hrs" },
    { label: "Countries", value: "156" },
  ];

  const transportModes = [
    {
      icon: Ship,
      title: "Ocean Freight",
      description: "FCL and LCL container shipping worldwide",
      color: "from-cyan-500 to-blue-600",
    },
    {
      icon: Plane,
      title: "Air Freight",
      description: "Express air cargo for time-sensitive shipments",
      color: "from-sky-500 to-indigo-600",
    },
    {
      icon: Truck,
      title: "Road & Rail",
      description: "Trucking and intermodal transport solutions",
      color: "from-orange-500 to-amber-600",
    },
  ];

  const advantages = [
    {
      icon: DollarSign,
      title: "Competitive Rates",
      description: "Compare quotes from multiple carriers to find the best price for your shipment.",
    },
    {
      icon: Clock,
      title: "Fast Responses",
      description: "Get quotes within hours, not days. Our average response time is under 4 hours.",
    },
    {
      icon: Globe,
      title: "Global Coverage",
      description: "Access carriers covering over 15,000 routes across 156 countries.",
    },
    {
      icon: Shield,
      title: "Verified Partners",
      description: "All freight forwarders and carriers are vetted for reliability and compliance.",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    // In a real app, this would submit to an API
  };

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title="Get Freight Quotes"
        description="Request and compare freight quotes from verified carriers and freight forwarders. Ocean, air, and road transport options available with competitive pricing."
        icon={<Ship className="h-8 w-8 text-white" />}
        breadcrumb={[
          { label: "Freight", href: "/marketplace/freight" },
          { label: "Get Quote", href: "/marketplace/freight/quote" },
        ]}
        stats={stats}
        gradient="from-cyan-500 to-blue-600"
      />

      {/* Quote Request Form */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="shadow-xl border-0">
                <CardHeader className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-xl">Request a Freight Quote</CardTitle>
                  <CardDescription className="text-white/80">
                    Fill in your shipment details to receive competitive quotes
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Route Information */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-cyan-500" />
                        Route Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="origin">Origin (City/Port) *</Label>
                          <Input
                            id="origin"
                            placeholder="e.g., Shanghai, China"
                            value={formData.origin}
                            onChange={(e) => updateFormData("origin", e.target.value)}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="destination">Destination (City/Port) *</Label>
                          <Input
                            id="destination"
                            placeholder="e.g., Los Angeles, USA"
                            value={formData.destination}
                            onChange={(e) => updateFormData("destination", e.target.value)}
                            required
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Shipment Details */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Package className="h-4 w-4 text-cyan-500" />
                        Shipment Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Cargo Type *</Label>
                          <Select
                            value={formData.cargoType}
                            onValueChange={(v) => updateFormData("cargoType", v)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select cargo type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">General Cargo</SelectItem>
                              <SelectItem value="hazardous">Hazardous/DG</SelectItem>
                              <SelectItem value="perishable">Perishable</SelectItem>
                              <SelectItem value="oversized">Oversized/Project</SelectItem>
                              <SelectItem value="vehicles">Vehicles</SelectItem>
                              <SelectItem value="bulk">Bulk</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Container Type</Label>
                          <Select
                            value={formData.containerType}
                            onValueChange={(v) => updateFormData("containerType", v)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select container type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="20ft">20ft Standard</SelectItem>
                              <SelectItem value="40ft">40ft Standard</SelectItem>
                              <SelectItem value="40hc">40ft High Cube</SelectItem>
                              <SelectItem value="reefer">Reefer Container</SelectItem>
                              <SelectItem value="open-top">Open Top</SelectItem>
                              <SelectItem value="flat-rack">Flat Rack</SelectItem>
                              <SelectItem value="lcl">LCL (Less than Container)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="weight">Weight (kg)</Label>
                          <Input
                            id="weight"
                            type="number"
                            placeholder="Total weight"
                            value={formData.weight}
                            onChange={(e) => updateFormData("weight", e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="volume">Volume (CBM)</Label>
                          <Input
                            id="volume"
                            type="number"
                            placeholder="Total volume"
                            value={formData.volume}
                            onChange={(e) => updateFormData("volume", e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Timeline & Terms */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-cyan-500" />
                        Timeline & Terms
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="readyDate">Ready Date *</Label>
                          <Input
                            id="readyDate"
                            type="date"
                            value={formData.readyDate}
                            onChange={(e) => updateFormData("readyDate", e.target.value)}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Incoterms</Label>
                          <Select
                            value={formData.incoterms}
                            onValueChange={(v) => updateFormData("incoterms", v)}
                          >
                            <SelectTrigger className="rounded-lg">
                              <SelectValue placeholder="Select Incoterms" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="exw">EXW - Ex Works</SelectItem>
                              <SelectItem value="fob">FOB - Free on Board</SelectItem>
                              <SelectItem value="cif">CIF - Cost Insurance Freight</SelectItem>
                              <SelectItem value="ddp">DDP - Delivered Duty Paid</SelectItem>
                              <SelectItem value="fca">FCA - Free Carrier</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Information */}
                    <div>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-cyan-500" />
                        Contact Information
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={(e) => updateFormData("email", e.target.value)}
                            required
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 234 567 890"
                            value={formData.phone}
                            onChange={(e) => updateFormData("phone", e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="company">Company</Label>
                          <Input
                            id="company"
                            placeholder="Your company name"
                            value={formData.company}
                            onChange={(e) => updateFormData("company", e.target.value)}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor="additionalInfo">Additional Information</Label>
                          <Textarea
                            id="additionalInfo"
                            placeholder="Any special requirements, hazmat details, or additional notes..."
                            value={formData.additionalInfo}
                            onChange={(e) => updateFormData("additionalInfo", e.target.value)}
                            rows={3}
                            className="rounded-lg resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-xl h-12"
                    >
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                          />
                          Submitting Request...
                        </>
                      ) : (
                        <>
                          Get Freight Quotes
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Transport Modes */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Transport Modes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {transportModes.map((mode) => {
                    const Icon = mode.icon;
                    return (
                      <div key={mode.title} className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mode.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{mode.title}</div>
                          <div className="text-xs text-muted-foreground">{mode.description}</div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Tips */}
              <Card className="shadow-lg border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Quick Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Provide accurate weight and dimensions for best quotes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Include hazardous cargo details upfront</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Specify preferred transit time if urgent</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Compare at least 3 quotes before booking</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Use Our Freight Marketplace?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Streamline your freight procurement with our trusted platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <motion.div
                  key={advantage.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-blue-600/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                      <h3 className="font-semibold mb-2">{advantage.title}</h3>
                      <p className="text-sm text-muted-foreground">{advantage.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Available Quotes Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Available Freight Quotes</h2>
              <p className="text-muted-foreground">Browse current freight offerings from carriers</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              {freightListings.length} quotes available
            </Badge>
          </div>
          <ListingGrid listings={freightListings} columns={3} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Need Help Finding the Right Carrier?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Our logistics experts can help you find the best freight solution for your needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-cyan-600 hover:bg-white/90 rounded-xl shadow-xl"
              >
                <Link href="/marketplace/freight/forwarders">
                  <Ship className="h-5 w-5 mr-2" />
                  Find Freight Forwarders
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                <Link href="/contact">
                  Contact Support
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <CreateListingButton variant="fab" />
    </div>
  );
}
