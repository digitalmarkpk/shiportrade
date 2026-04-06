"use client";

import { Listing } from "@/types/marketplace";
import { ListingCard } from "./ListingCard";

interface ListingGridProps {
  listings: Listing[];
  featured?: boolean;
  columns?: 2 | 3 | 4;
  showEmpty?: boolean;
}

export function ListingGrid({ 
  listings, 
  featured = false,
  columns = 3,
  showEmpty = true 
}: ListingGridProps) {
  const gridCols = {
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  };

  if (listings.length === 0 && showEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <span className="text-4xl">📦</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">No listings found</h3>
        <p className="text-muted-foreground max-w-md">
          No listings match your current filters. Try adjusting your search criteria or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {listings.map((listing) => (
        <ListingCard 
          key={listing.id} 
          listing={listing} 
          featured={listing.featured || featured}
        />
      ))}
    </div>
  );
}
