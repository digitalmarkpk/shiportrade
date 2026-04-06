"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, Clock, Eye, MessageSquare, CheckCircle, Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Listing, ListingType } from "@/types/marketplace";

interface ListingCardProps {
  listing: Listing;
  featured?: boolean;
}

const listingTypeStyles: Record<ListingType, { color: string; label: string }> = {
  buy: { color: "bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300", label: "Buying" },
  sell: { color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300", label: "Selling" },
  lease: { color: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300", label: "Leasing" },
  rent: { color: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300", label: "Renting" },
  service: { color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/50 dark:text-cyan-300", label: "Service" },
  rfq: { color: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300", label: "RFQ" },
  auction: { color: "bg-orange-100 text-orange-700 dark:bg-orange-900/50 dark:text-orange-300", label: "Auction" },
};

export function ListingCard({ listing, featured = false }: ListingCardProps) {
  const typeStyle = listingTypeStyles[listing.listingType];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const formatPrice = () => {
    if (!listing.price) return "Contact for Price";
    const { amount, currency, unit } = listing.price;
    return `${currency} ${amount.toLocaleString()}${unit ? ` ${unit}` : ""}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className={`h-full hover:shadow-xl transition-all duration-300 group overflow-hidden ${
        featured ? "ring-2 ring-emerald-500/20" : ""
      }`}>
        {/* Featured Badge */}
        {featured && (
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1 fill-current" />
              Featured
            </Badge>
          </div>
        )}
        
        {/* Image Placeholder */}
        <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-600/20 flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Header with Type Badge */}
          <div className="flex items-start justify-between gap-2">
            <Badge className={`${typeStyle.color} font-medium`}>
              {typeStyle.label}
            </Badge>
            {listing.verified && (
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle className="h-4 w-4" />
                <span className="text-xs font-medium">Verified</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-emerald-600 transition-colors">
              {listing.title}
            </h3>
          </div>

          {/* Price */}
          {listing.price && (
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {formatPrice()}
              {listing.price.negotiable && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  (Negotiable)
                </span>
              )}
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-emerald-500" />
            <span className="truncate">
              {listing.location.city}, {listing.location.country}
            </span>
          </div>

          {/* Tags */}
          {listing.tags && listing.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {listing.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {listing.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{listing.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t mt-auto">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {formatDate(listing.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {listing.views.toLocaleString()}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              {listing.inquiries}
            </span>
          </div>
          <Button asChild size="sm" className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white">
            <Link href={`/marketplace/listing/${listing.slug}`}>
              View Details
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
