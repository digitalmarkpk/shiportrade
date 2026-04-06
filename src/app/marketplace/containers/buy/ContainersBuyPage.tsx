"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container, CheckCircle, HelpCircle, ArrowRight, Package, Truck, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CategoryHero } from "@/components/marketplace/CategoryHero";
import { SearchFilters } from "@/components/marketplace/SearchFilters";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { CreateListingButton } from "@/components/marketplace/CreateListingButton";
import { containerListings } from "@/lib/data/marketplace-listings";

export function ContainersBuyPage() {
  const stats = [
    { label: "Active Listings", value: "2,450+" },
    { label: "Verified Sellers", value: "580+" },
    { label: "Countries", value: "85+" },
    { label: "Avg. Response", value: "< 2hrs" },
  ];

  const benefits = [
    {
      icon: Package,
      title: "Wide Selection",
      description: "Choose from thousands of containers in various sizes, conditions, and locations worldwide.",
    },
    {
      icon: Shield,
      title: "Verified Sellers",
      description: "All sellers are vetted and verified for your peace of mind. Trade with confidence.",
    },
    {
      icon: Truck,
      title: "Global Delivery",
      description: "Arrange transport directly through the platform with competitive shipping rates.",
    },
    {
      icon: Clock,
      title: "Fast Transactions",
      description: "Streamlined inquiry process with average response times under 2 hours.",
    },
  ];

  const faqs = [
    {
      question: "What types of containers can I buy on Shiportrade?",
      answer: "You can buy various types of shipping containers including standard dry containers (20ft, 40ft, 40ft HC), refrigerated containers (reefers), open-top containers, flat racks, tank containers, and specialized containers for project cargo. Both new and used containers are available from verified sellers worldwide.",
    },
    {
      question: "How do I verify the condition of a container before buying?",
      answer: "All containers listed on Shiportrade come with detailed specifications and condition reports. Sellers provide information about the container's age, CSC validity, structural condition, and any defects. We recommend requesting recent photos and, for high-value transactions, arranging a third-party inspection before purchase.",
    },
    {
      question: "What is a CSC certificate and why is it important?",
      answer: "A CSC (Convention for Safe Containers) certificate is an international safety standard that certifies a container is safe for transport. All containers used for international shipping must have a valid CSC plate. When buying containers for shipping purposes, always verify the CSC validity date.",
    },
    {
      question: "Can I arrange transportation for purchased containers?",
      answer: "Yes, many sellers offer delivery services, or you can arrange transportation through our freight marketplace. We recommend getting quotes from multiple carriers to ensure competitive rates. Consider factors like distance, container size, and delivery timeline when planning transport.",
    },
    {
      question: "What payment methods are accepted?",
      answer: "Payment methods vary by seller but typically include bank transfers, letters of credit, and secure escrow services for larger transactions. Shiportrade recommends using secure payment methods and documenting all agreements in writing.",
    },
    {
      question: "Are there any fees for buying containers on the marketplace?",
      answer: "Browsing and inquiring about containers is free. Transaction fees, if any, are clearly disclosed by sellers. Some premium listings may have additional services like inspection, insurance, or delivery coordination available for separate fees.",
    },
  ];

  const useCases = [
    {
      title: "International Shipping",
      description: "Purchase CSC-certified containers for your export/import operations. Ideal for freight forwarders and trading companies.",
    },
    {
      title: "Storage Solutions",
      description: "Buy containers for on-site storage at construction sites, farms, warehouses, or industrial facilities.",
    },
    {
      title: "Container Homes & Offices",
      description: "Find suitable containers for conversion into living spaces, offices, or pop-up retail locations.",
    },
    {
      title: "Export Trading",
      description: "Container traders can source inventory from global sellers for resale in local markets.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CategoryHero
        title="Buy Shipping Containers"
        description="Browse hundreds of new and used shipping containers for sale. From standard dry containers to specialized reefers and flat racks, find the perfect container from verified sellers worldwide."
        icon={<Container className="h-8 w-8 text-white" />}
        breadcrumb={[
          { label: "Containers", href: "/marketplace/containers" },
          { label: "Buy", href: "/marketplace/containers/buy" },
        ]}
        stats={stats}
        gradient="from-emerald-500 to-teal-600"
      />

      {/* Search & Filters */}
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <SearchFilters
            categories={[
              { value: "all", label: "All Container Types" },
              { value: "20ft", label: "20ft Standard" },
              { value: "40ft", label: "40ft Standard" },
              { value: "40ft-hc", label: "40ft High Cube" },
              { value: "reefer", label: "Reefer Containers" },
              { value: "open-top", label: "Open Top" },
              { value: "flat-rack", label: "Flat Rack" },
              { value: "tank", label: "Tank Containers" },
            ]}
          />
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-12" id="listings">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Available Containers</h2>
            <Badge variant="secondary" className="text-sm">
              {containerListings.length} containers found
            </Badge>
          </div>
          <ListingGrid listings={containerListings} columns={3} />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Buy Containers on Shiportrade?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The trusted marketplace for container trading with verified sellers and secure transactions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Common Use Cases</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Shipping containers serve diverse purposes across industries
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{useCase.title}</h3>
                        <p className="text-sm text-muted-foreground">{useCase.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Everything you need to know about buying containers
              </p>
            </div>

            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    <span className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4 text-emerald-500" />
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Post a request and let verified sellers come to you with offers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-xl shadow-xl"
              >
                <Link href="/marketplace/containers/sell">
                  <Container className="h-5 w-5 mr-2" />
                  Sell Your Containers
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
