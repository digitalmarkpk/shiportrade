"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Container,
  Ship,
  Truck,
  Warehouse,
  Anchor,
  Handshake,
  Wrench,
  Users,
  ArrowRight,
  CheckCircle,
  Search,
  Star,
  Globe,
  TrendingUp,
  Shield,
  Clock,
  Package,
  ChevronRight,
  Sparkles,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { CreateListingButton } from "@/components/marketplace/CreateListingButton";
import { 
  getListingsByCategory, 
  allMarketplaceListings,
  marketplaceStats 
} from "@/lib/data/marketplace-listings";
import { ListingCategory } from "@/types/marketplace";

const categoryIcons: Record<string, React.ReactNode> = {
  containers: <Container className="h-8 w-8 text-white" />,
  freight: <Ship className="h-8 w-8 text-white" />,
  transport: <Truck className="h-8 w-8 text-white" />,
  warehousing: <Warehouse className="h-8 w-8 text-white" />,
  vessels: <Anchor className="h-8 w-8 text-white" />,
  services: <Handshake className="h-8 w-8 text-white" />,
  equipment: <Wrench className="h-8 w-8 text-white" />,
  parts: <Wrench className="h-8 w-8 text-white" />,
  b2b: <Users className="h-8 w-8 text-white" />,
};

const categoryColors: Record<string, string> = {
  containers: "from-blue-500 to-cyan-500",
  freight: "from-emerald-500 to-teal-500",
  transport: "from-orange-500 to-amber-500",
  warehousing: "from-purple-500 to-violet-500",
  vessels: "from-indigo-500 to-blue-500",
  services: "from-rose-500 to-pink-500",
  equipment: "from-slate-500 to-gray-500",
  parts: "from-cyan-500 to-sky-500",
  b2b: "from-amber-500 to-yellow-500",
};

const categoryGradientBg: Record<string, string> = {
  containers: "from-blue-600 via-cyan-600 to-teal-600",
  freight: "from-emerald-600 via-teal-600 to-cyan-600",
  transport: "from-orange-600 via-amber-600 to-yellow-600",
  warehousing: "from-purple-600 via-violet-600 to-indigo-600",
  vessels: "from-indigo-600 via-blue-600 to-cyan-600",
  services: "from-rose-600 via-pink-600 to-red-600",
  equipment: "from-slate-600 via-gray-600 to-zinc-600",
  parts: "from-cyan-600 via-sky-600 to-blue-600",
  b2b: "from-amber-600 via-yellow-600 to-orange-600",
};

// Map category slugs to listing categories
const categoryToListingCategory: Record<string, ListingCategory[]> = {
  containers: [
    ListingCategory.CONTAINERS_BUY,
    ListingCategory.CONTAINERS_SELL,
    ListingCategory.CONTAINERS_LEASE,
    ListingCategory.CONTAINERS_REEFER,
    ListingCategory.CONTAINERS_SPECIAL,
  ],
  freight: [
    ListingCategory.FREIGHT_QUOTE,
    ListingCategory.FREIGHT_POST,
  ],
  transport: [
    ListingCategory.TRANSPORT_TRUCKS,
    ListingCategory.TRANSPORT_LOADS,
  ],
  warehousing: [
    ListingCategory.WAREHOUSING_FIND,
    ListingCategory.WAREHOUSING_LIST,
    ListingCategory.WAREHOUSING_COLD_STORAGE,
  ],
  vessels: [
    ListingCategory.VESSELS_CHARTER,
    ListingCategory.VESSELS_LIST,
    ListingCategory.VESSELS_CARGO,
  ],
  services: [
    ListingCategory.SERVICES_CUSTOMS,
    ListingCategory.SERVICES_FORWARDERS,
    ListingCategory.SERVICES_INSPECTION,
    ListingCategory.SERVICES_INSURANCE,
  ],
  equipment: [
    ListingCategory.EQUIPMENT_PORT,
    ListingCategory.EQUIPMENT_CRANES,
    ListingCategory.EQUIPMENT_HANDLING,
  ],
  parts: [
    ListingCategory.PARTS_ENGINE,
    ListingCategory.PARTS_EQUIPMENT,
    ListingCategory.PARTS_NAVIGATION,
  ],
  b2b: [
    ListingCategory.B2B_BUYERS,
    ListingCategory.B2B_SUPPLIERS,
    ListingCategory.B2B_COMMODITIES,
  ],
};

interface SE0Content {
  title: string;
  description: string;
  h1: string;
  longDescription: string;
  benefits: string[];
  features: string[];
  faqs: { question: string; answer: string }[];
  keywords: string[];
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  subcategories: { name: string; slug: string }[];
}

interface Props {
  category: Category;
  seoContent: SE0Content;
}

export function MarketplaceCategoryPage({ category, seoContent }: Props) {
  // Get relevant listings for this category
  const listingCategories = categoryToListingCategory[category.slug] || [];
  const categoryListings = allMarketplaceListings
    .filter(listing => listingCategories.includes(listing.category))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${categoryGradientBg[category.slug] || "from-blue-600 to-cyan-600"} text-white`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{category.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="mb-4 bg-white/20 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {marketplaceStats.totalListings.toLocaleString()}+ Active Listings
              </Badge>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {seoContent.h1}
              </h1>

              <p className="text-lg text-white/90 mb-8 max-w-xl">
                {category.description}
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder={`Search ${category.name.toLowerCase()}...`}
                    className="pl-12 h-12 text-base rounded-xl border-0 shadow-lg bg-white text-gray-900"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-12 px-6 bg-white text-gray-900 hover:bg-white/90 rounded-xl shadow-lg"
                >
                  Search
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className={`w-32 h-32 rounded-2xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-2xl mx-auto`}>
                  {categoryIcons[category.id]}
                </div>
                {/* Floating stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="absolute -right-4 top-0 bg-white rounded-xl shadow-xl p-4 text-gray-900"
                >
                  <div className="text-2xl font-bold text-emerald-600">{categoryListings.length}+</div>
                  <div className="text-xs text-gray-500">Active Listings</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute -left-4 bottom-0 bg-white rounded-xl shadow-xl p-4 text-gray-900"
                >
                  <div className="text-2xl font-bold text-blue-600">{category.subcategories.length}</div>
                  <div className="text-xs text-gray-500">Subcategories</div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 50L48 45.8C96 41.7 192 33.3 288 35.8C384 38.3 480 51.7 576 55.8C672 60 768 55 864 47.5C960 40 1056 30 1152 32.5C1248 35 1344 50 1392 57.5L1440 65V101H1392C1344 101 1248 101 1152 101C1056 101 960 101 864 101C768 101 672 101 576 101C480 101 384 101 288 101C192 101 96 101 48 101H0V50Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Subcategories Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Browse {category.name} Subcategories</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {category.subcategories.map((sub, index) => (
              <motion.div
                key={sub.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/marketplace/${category.slug}/${sub.slug}`}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:border-primary/20">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center mx-auto mb-3 shadow-sm`}>
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-medium text-sm">{sub.name}</h3>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Section */}
      {categoryListings.length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-2">Featured {category.name} Listings</h2>
                <p className="text-muted-foreground">
                  Discover top listings from verified partners
                </p>
              </div>
              <div className="flex gap-3">
                <Button asChild variant="outline" className="rounded-xl">
                  <Link href={`/marketplace/${category.slug}/all`}>
                    View All
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <CreateListingButton category={category.slug} />
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section - Rich SEO Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Long Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">About {category.name} Marketplace</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {seoContent.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-muted-foreground leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Benefits & Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              {/* Benefits */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Key Benefits
                </h3>
                <div className="grid gap-3">
                  {seoContent.benefits.slice(0, 6).map((benefit, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-sm text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  Platform Features
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {seoContent.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${category.color}`} />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
                {marketplaceStats.totalListings.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {marketplaceStats.totalUsers.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Verified Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-violet-600 dark:text-violet-400">
                {marketplaceStats.countriesServed}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-amber-600 dark:text-amber-400">
                {marketplaceStats.inquiriesLastMonth.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Monthly Inquiries</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Why Trade With Confidence</h2>
            <p className="text-muted-foreground">Built for secure, efficient global trade</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "Verified Partners",
                description: "All trading partners undergo rigorous verification",
                color: "text-emerald-600",
              },
              {
                icon: Globe,
                title: "Global Coverage",
                description: "Access markets in 156 countries worldwide",
                color: "text-blue-600",
              },
              {
                icon: Clock,
                title: "24/7 Support",
                description: "Round-the-clock assistance in multiple languages",
                color: "text-violet-600",
              },
              {
                icon: Package,
                title: "Secure Transactions",
                description: "Protected payments and escrow services",
                color: "text-amber-600",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full text-center border-0 shadow-md hover:shadow-xl transition-shadow">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4`}>
                        <Icon className={`h-7 w-7 ${item.color}`} />
                      </div>
                      <h3 className="font-semibold mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center justify-center gap-2">
              <HelpCircle className="h-6 w-6 text-blue-500" />
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to know about our {category.name.toLowerCase()} marketplace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Accordion type="single" collapsible className="w-full space-y-4">
              {seoContent.faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white dark:bg-gray-800 rounded-xl px-6 shadow-sm border-0"
                >
                  <AccordionTrigger className="text-left font-semibold hover:no-underline py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 bg-gradient-to-br ${categoryGradientBg[category.slug] || "from-blue-600 to-cyan-600"} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of supply chain professionals on our {category.name.toLowerCase()} marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-gray-900 hover:bg-white/90 rounded-xl shadow-xl"
              >
                <Link href={`/marketplace/create?category=${category.slug}`}>
                  <Package className="h-5 w-5 mr-2" />
                  Create Listing
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                <Link href="/contact">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Contact Sales
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Floating Action Button */}
      <CreateListingButton variant="fab" category={category.slug} />
    </div>
  );
}
