"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store,
  Container,
  Ship,
  Truck,
  Warehouse,
  Anchor,
  Handshake,
  Wrench,
  Users,
  Search,
  ArrowRight,
  CheckCircle,
  Globe,
  TrendingUp,
  Users as UsersIcon,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ListingGrid } from "@/components/marketplace/ListingGrid";
import { CreateListingButton } from "@/components/marketplace/CreateListingButton";
import { marketplaceCategories, marketplaceStats } from "@/lib/data/marketplace-listings";
import { getFeaturedListings } from "@/lib/data/marketplace-listings";

const categoryIcons: Record<string, React.ReactNode> = {
  containers: <Container className="h-6 w-6 text-white" />,
  freight: <Ship className="h-6 w-6 text-white" />,
  transport: <Truck className="h-6 w-6 text-white" />,
  warehousing: <Warehouse className="h-6 w-6 text-white" />,
  vessels: <Anchor className="h-6 w-6 text-white" />,
  services: <Handshake className="h-6 w-6 text-white" />,
  equipment: <Wrench className="h-6 w-6 text-white" />,
  parts: <Wrench className="h-6 w-6 text-white" />,
  b2b: <Users className="h-6 w-6 text-white" />,
};

export function MarketplacePage() {
  const featuredListings = getFeaturedListings();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="container mx-auto px-4 py-20 md:py-28 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-6 bg-white/20 text-white border-0 text-sm px-4 py-1.5">
              <Sparkles className="h-4 w-4 mr-2" />
              Trusted by 8,500+ Supply Chain Professionals
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Global Supply Chain
              <span className="block">Marketplace</span>
            </h1>

            <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Buy, sell, and lease containers. Find freight quotes, warehousing solutions, 
              transport services, and connect with verified logistics partners worldwide.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    placeholder="Search containers, freight, warehouses..."
                    className="pl-12 h-14 text-base rounded-2xl border-0 shadow-xl bg-white text-gray-900"
                  />
                </div>
                <Button
                  size="lg"
                  className="h-14 px-8 bg-white text-emerald-600 hover:bg-white/90 rounded-2xl shadow-xl"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-white/70 text-sm">Popular:</span>
                {["40ft Container", "Freight Quote", "Warehouse", "Trucking"].map((term) => (
                  <Link
                    key={term}
                    href={`/marketplace?search=${encodeURIComponent(term)}`}
                    className="text-sm text-white hover:text-white/80 underline-offset-2 hover:underline"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
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

      {/* Stats Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {marketplaceStats.totalListings.toLocaleString()}+
              </div>
              <div className="text-sm text-muted-foreground mt-1">Active Listings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-cyan-600 dark:text-cyan-400">
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
                {marketplaceStats.categories}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Categories</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive marketplace categories to find exactly what you need
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplaceCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/marketplace/${category.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          {categoryIcons[category.id]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1 group-hover:text-emerald-600 transition-colors">
                            {category.name}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {category.description}
                          </p>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Listings Section */}
      <section className="py-16" id="listings">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Listings</h2>
              <p className="text-muted-foreground">
                Discover top listings from verified sellers
              </p>
            </div>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/marketplace/all">
                View All Listings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </motion.div>

          <ListingGrid listings={featuredListings} columns={3} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple 3-step process
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: 1,
                title: "Create Your Account",
                description: "Sign up for free and complete your profile to connect with global supply chain professionals.",
                icon: UsersIcon,
                color: "from-emerald-500 to-teal-600",
              },
              {
                step: 2,
                title: "Post or Browse Listings",
                description: "Create listings for containers, freight, warehousing, or browse thousands of existing opportunities.",
                icon: Package,
                color: "from-cyan-500 to-blue-600",
              },
              {
                step: 3,
                title: "Connect & Trade",
                description: "Connect with verified partners, negotiate deals, and complete transactions with confidence.",
                icon: Handshake,
                color: "from-violet-500 to-purple-600",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-6 shadow-xl`}>
                      <Icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-8 bg-white dark:bg-gray-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-lg border">
                      {item.step}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Choose Shiportrade Marketplace?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by thousands of logistics professionals worldwide
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Verified Partners",
                description: "All sellers and buyers are verified for your peace of mind",
                icon: CheckCircle,
              },
              {
                title: "Global Network",
                description: "Access listings from 156+ countries worldwide",
                icon: Globe,
              },
              {
                title: "Secure Transactions",
                description: "Trade with confidence using our secure platform",
                icon: TrendingUp,
              },
              {
                title: "24/7 Support",
                description: "Our team is here to help whenever you need us",
                icon: UsersIcon,
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
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-600/10 flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of supply chain professionals already using Shiportrade Marketplace
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-xl shadow-xl"
              >
                <Link href="/marketplace/create">
                  <Store className="h-5 w-5 mr-2" />
                  Create Your First Listing
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                <Link href="/contact">
                  Contact Sales
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
