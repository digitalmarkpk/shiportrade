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
  ChevronRight,
  Sparkles,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListingCard } from "@/components/marketplace/ListingCard";
import { CreateListingButton } from "@/components/marketplace/CreateListingButton";
import { 
  allMarketplaceListings, 
  marketplaceCategories,
  marketplaceStats 
} from "@/lib/data/marketplace-listings";
import { ListingCategory, Listing } from "@/types/marketplace";

// Category colors for gradients
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

// Map subcategories to listing categories
const subcategoryToListingCategory: Record<string, Record<string, ListingCategory>> = {
  containers: {
    buy: ListingCategory.CONTAINERS_BUY,
    sell: ListingCategory.CONTAINERS_SELL,
    lease: ListingCategory.CONTAINERS_LEASE,
    reefer: ListingCategory.CONTAINERS_REEFER,
    special: ListingCategory.CONTAINERS_SPECIAL,
  },
  freight: {
    quote: ListingCategory.FREIGHT_QUOTE,
    post: ListingCategory.FREIGHT_POST,
    forwarders: ListingCategory.SERVICES_FORWARDERS,
    book: ListingCategory.FREIGHT_QUOTE,
  },
  transport: {
    trucks: ListingCategory.TRANSPORT_TRUCKS,
    "post-load": ListingCategory.TRANSPORT_LOADS,
    available: ListingCategory.TRANSPORT_TRUCKS,
  },
  warehousing: {
    find: ListingCategory.WAREHOUSING_FIND,
    list: ListingCategory.WAREHOUSING_LIST,
    "cold-storage": ListingCategory.WAREHOUSING_COLD_STORAGE,
    fulfillment: ListingCategory.WAREHOUSING_FIND,
  },
  vessels: {
    charter: ListingCategory.VESSELS_CHARTER,
    list: ListingCategory.VESSELS_LIST,
    cargo: ListingCategory.VESSELS_CARGO,
  },
  services: {
    customs: ListingCategory.SERVICES_CUSTOMS,
    forwarders: ListingCategory.SERVICES_FORWARDERS,
    inspection: ListingCategory.SERVICES_INSPECTION,
    insurance: ListingCategory.SERVICES_INSURANCE,
  },
  equipment: {
    port: ListingCategory.EQUIPMENT_PORT,
    cranes: ListingCategory.EQUIPMENT_CRANES,
    handling: ListingCategory.EQUIPMENT_HANDLING,
  },
  parts: {
    engine: ListingCategory.PARTS_ENGINE,
    equipment: ListingCategory.PARTS_EQUIPMENT,
    navigation: ListingCategory.PARTS_NAVIGATION,
  },
  b2b: {
    buyers: ListingCategory.B2B_BUYERS,
    suppliers: ListingCategory.B2B_SUPPLIERS,
    commodities: ListingCategory.B2B_COMMODITIES,
    rfqs: ListingCategory.B2B_SUPPLIERS,
  },
};

interface Subcategory {
  name: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  subcategories: Subcategory[];
}

interface SEOContent {
  title: string;
  description: string;
}

interface Props {
  category: Category;
  subcategory: Subcategory;
  seoContent: SEOContent;
}

export function MarketplaceSubcategoryPage({ category, subcategory, seoContent }: Props) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  
  // Get listings for this subcategory
  const listingCategory = subcategoryToListingCategory[category.slug]?.[subcategory.slug];
  let listings: Listing[] = [];
  
  if (listingCategory) {
    listings = allMarketplaceListings.filter(l => l.category === listingCategory);
  } else {
    // Fallback: show all category listings
    const categoryListingCategories = Object.values(subcategoryToListingCategory[category.slug] || {});
    listings = allMarketplaceListings.filter(l => categoryListingCategories.includes(l.category));
  }

  // Sort listings
  const sortedListings = [...listings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "oldest":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "price-low":
        return (a.price?.amount || 0) - (b.price?.amount || 0);
      case "price-high":
        return (b.price?.amount || 0) - (a.price?.amount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className={`relative overflow-hidden bg-gradient-to-br ${categoryGradientBg[category.slug] || "from-blue-600 to-cyan-600"} text-white py-12`}>
        <div className="container mx-auto px-4 relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/marketplace" className="hover:text-white transition-colors">Marketplace</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/marketplace/${category.slug}`} className="hover:text-white transition-colors">{category.name}</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white font-medium">{subcategory.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-3 bg-white/20 text-white border-0">
                <Sparkles className="h-3 w-3 mr-1" />
                {sortedListings.length} Listings Available
              </Badge>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                {subcategory.name}
              </h1>
              <p className="text-white/80 max-w-xl">
                {seoContent.description}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-3"
            >
              <CreateListingButton category={category.slug} subcategory={subcategory.slug} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-6 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${subcategory.name.toLowerCase()}...`}
                className="pl-10 bg-white dark:bg-gray-800"
              />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 bg-white dark:bg-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex items-center border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              {/* Filters Button */}
              <Button variant="outline" className="bg-white dark:bg-gray-800">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Subcategories */}
      <section className="py-6 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2">
            {category.subcategories.map((sub) => (
              <Link 
                key={sub.slug} 
                href={`/marketplace/${category.slug}/${sub.slug}`}
              >
                <Badge 
                  variant={sub.slug === subcategory.slug ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 ${
                    sub.slug === subcategory.slug 
                      ? `bg-gradient-to-r ${categoryColors[category.slug]} text-white border-0` 
                      : "hover:bg-muted"
                  }`}
                >
                  {sub.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <section className="py-8 bg-background">
        <div className="container mx-auto px-4">
          {sortedListings.length > 0 ? (
            <div className={viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {sortedListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <ListingCard listing={listing} />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${categoryColors[category.slug]} flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                <Search className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Listings Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                There are no listings in this subcategory yet. Be the first to create one!
              </p>
              <CreateListingButton category={category.slug} subcategory={subcategory.slug} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Pagination */}
      {sortedListings.length > 0 && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {sortedListings.length} of {sortedListings.length} listings
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled>Previous</Button>
                <Button variant="outline" disabled>Next</Button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">About {subcategory.name}</h2>
            <p className="text-muted-foreground leading-relaxed">
              {seoContent.description} Browse our comprehensive selection of {subcategory.name.toLowerCase()} 
              {` on Shiportrade's global marketplace. Connect with verified partners, compare prices, 
              and complete transactions securely. Our platform serves thousands of supply chain 
              professionals across ${marketplaceStats.countriesServed} countries.`}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-12 bg-gradient-to-br ${categoryGradientBg[category.slug] || "from-blue-600 to-cyan-600"} text-white`}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-white/90 mb-6 max-w-xl mx-auto">
            Create your listing or browse more categories to find what you need
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-gray-900 hover:bg-white/90 rounded-xl"
            >
              <Link href={`/marketplace/create?category=${category.slug}&subcategory=${subcategory.slug}`}>
                Create Listing
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-white hover:bg-white/10 rounded-xl"
            >
              <Link href={`/marketplace/${category.slug}`}>
                Browse All {category.name}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <CreateListingButton variant="fab" category={category.slug} subcategory={subcategory.slug} />
    </div>
  );
}
