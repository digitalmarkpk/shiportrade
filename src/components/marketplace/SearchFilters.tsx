"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ListingCategory, ListingType } from "@/types/marketplace";

interface SearchFiltersProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: FilterState) => void;
  categories?: { value: string; label: string }[];
  showCategoryFilter?: boolean;
  showTypeFilter?: boolean;
  showLocationFilter?: boolean;
}

interface FilterState {
  query: string;
  category: string;
  type: string;
  location: string;
  priceMin: string;
  priceMax: string;
}

const defaultCategories = [
  { value: "all", label: "All Categories" },
  { value: "containers", label: "Containers" },
  { value: "freight", label: "Freight & Shipping" },
  { value: "transport", label: "Transport & Trucking" },
  { value: "warehousing", label: "Warehousing" },
  { value: "vessels", label: "Vessel & Chartering" },
  { value: "services", label: "Logistics Services" },
  { value: "equipment", label: "Equipment & Machinery" },
  { value: "parts", label: "Marine Spare Parts" },
  { value: "b2b", label: "B2B Trade" },
];

const listingTypes = [
  { value: "all", label: "All Types" },
  { value: "buy", label: "Buying" },
  { value: "sell", label: "Selling" },
  { value: "lease", label: "Leasing" },
  { value: "rent", label: "Renting" },
  { value: "service", label: "Service" },
  { value: "rfq", label: "RFQ" },
];

export function SearchFilters({
  onSearch,
  onFilterChange,
  categories = defaultCategories,
  showCategoryFilter = true,
  showTypeFilter = true,
  showLocationFilter = true,
}: SearchFiltersProps) {
  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    category: "all",
    type: "all",
    location: "",
    priceMin: "",
    priceMax: "",
  });

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v && v !== "all" && v !== ""
  ).length;

  const handleSearch = () => {
    onSearch?.(query);
    onFilterChange?.({ ...filters, query });
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      query: "",
      category: "all",
      type: "all",
      location: "",
      priceMin: "",
      priceMax: "",
    };
    setFilters(clearedFilters);
    setQuery("");
    onFilterChange?.(clearedFilters);
  };

  return (
    <div className="space-y-4">
      {/* Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search listings, containers, freight services..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10 h-12 text-base rounded-xl"
          />
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <DropdownMenu open={showAdvanced} onOpenChange={setShowAdvanced}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-12 px-4 rounded-xl relative">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-emerald-500 text-white text-xs">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-4 shadow-2xl rounded-xl">
              <div className="space-y-4">
                <h4 className="font-semibold">Advanced Filters</h4>
                
                {showCategoryFilter && (
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={filters.category}
                      onValueChange={(v) => handleFilterChange("category", v)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showTypeFilter && (
                  <div className="space-y-2">
                    <Label>Listing Type</Label>
                    <Select
                      value={filters.type}
                      onValueChange={(v) => handleFilterChange("type", v)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {listingTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {showLocationFilter && (
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      placeholder="City, country, or port..."
                      value={filters.location}
                      onChange={(e) => handleFilterChange("location", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                )}

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Min Price</Label>
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange("priceMin", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Max Price</Label>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange("priceMax", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <Separator />

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-lg"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                  <Button
                    className="flex-1 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white"
                    onClick={() => setShowAdvanced(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Active Filter Tags */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.category && filters.category !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.value === filters.category)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("category", "all")}
              />
            </Badge>
          )}
          {filters.type && filters.type !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Type: {listingTypes.find(t => t.value === filters.type)?.label}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("type", "all")}
              />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="gap-1">
              Location: {filters.location}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => handleFilterChange("location", "")}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
