"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Globe, Anchor } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/utils/slugify";

interface CountryInfo {
  country_code: string;
  name: string;
  capital: string;
  currency: string;
  coastline_km: number;
  population: number;
  flag_emoji: string;
}

interface Port {
  unlocode: string;
  name: string;
  country_code: string;
  country_name: string;
  annual_teu: number;
}

export default function PortsDirectoryPage() {
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/countries-info.json").then((res) => res.json()),
      fetch("/data/ports-main.json").then((res) => res.json()),
    ])
      .then(([countriesData, portsData]) => {
        setCountries(countriesData.sort((a: any, b: any) => a.name.localeCompare(b.name)));
        setPorts(portsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load directory data:", err);
        setLoading(false);
      });
  }, []);

  const countryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    ports.forEach((p) => {
      stats[p.country_code] = (stats[p.country_code] || 0) + 1;
    });
    return stats;
  }, [ports]);

  const filteredCountries = useMemo(() => {
    if (!search) return countries;
    const query = search.toLowerCase();
    
    // Find countries that match by name/code OR have a port that matches
    const matchingPortCountries = new Set(
      ports
        .filter(p => p.name.toLowerCase().includes(query) || p.unlocode.toLowerCase().includes(query))
        .map(p => p.country_code)
    );

    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.country_code.toLowerCase().includes(query) ||
        matchingPortCountries.has(c.country_code)
    );
  }, [search, countries, ports]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
        <div className="text-center">
          <Globe className="h-12 w-12 text-[#0F4C81] mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600 font-medium">Loading ports directory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header Section */}
      <section className="bg-white border-b border-[#e2e8f0] pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-[30px] font-bold text-slate-900 mb-2">
              World Sea Ports Directory
            </h1>
            <p className="text-[16px] text-slate-500 mb-8">
              {ports.length.toLocaleString()} major commercial ports across {countries.length} countries
            </p>
            <div className="max-w-xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Search countries or ports..."
                className="pl-12 h-12 text-[16px] rounded-lg border-[#e2e8f0] shadow-sm focus-visible:ring-[#0F4C81]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Country Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-[16px]">
          {filteredCountries.map((country) => {
            const portCount = countryStats[country.country_code] || 0;
            return (
              <Link
                key={country.country_code}
                href={`/directories/ports/country/${slugify(country.name)}`}
                className="group flex flex-col p-4 bg-white border border-[#e2e8f0] rounded-lg transition-all duration-200 hover:border-[#0F4C81] hover:shadow-md hover:-translate-y-[2px] h-full"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="relative w-8 h-6 overflow-hidden rounded-sm border border-slate-100 flex-shrink-0">
                    <img
                      src={`https://flagcdn.com/w40/${country.country_code.toLowerCase()}.png`}
                      alt={`${country.name} flag`}
                      width={32}
                      height={24}
                      className="object-cover w-full h-full"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                        if ((e.target as any).nextSibling) (e.target as any).nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="hidden absolute inset-0 bg-slate-100 items-center justify-center text-[10px] font-bold text-slate-400">
                      {country.country_code}
                    </div>
                  </div>
                  <span className="text-[12px] font-mono text-slate-400">
                    {country.country_code}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-[14px] font-semibold text-slate-900 line-clamp-2 mb-1" title={country.name}>
                    {country.name}
                  </h3>
                </div>
                <p className="text-[13px] text-slate-500 mt-2">
                  <span className="font-medium text-[#0F4C81]">{portCount}</span> {portCount === 1 ? "major port" : "major ports"}
                </p>
              </Link>
            );
          })}
        </div>

        {filteredCountries.length === 0 && (
          <div className="py-20 text-center">
            <Globe className="h-12 w-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500">No countries found matching "{search}"</p>
          </div>
        )}
      </main>
    </div>
  );
}
