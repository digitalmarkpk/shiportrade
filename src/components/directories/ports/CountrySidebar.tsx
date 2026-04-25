'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Anchor, Globe } from 'lucide-react';
import { Country, Region } from '@/utils/data-utils';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface CountrySidebarProps {
  regions: Region[];
  countries: Country[];
  selectedCountryCode?: string;
  onSelectCountry: (country: Country) => void;
}

export default function CountrySidebar({ 
  regions, 
  countries, 
  selectedCountryCode, 
  onSelectCountry 
}: CountrySidebarProps) {
  const [openRegions, setOpenRegions] = useState<string[]>(['asia']); // Default open Asia

  const toggleRegion = (regionSlug: string) => {
    setOpenRegions(prev => 
      prev.includes(regionSlug) 
        ? prev.filter(r => r !== regionSlug) 
        : [...prev, regionSlug]
    );
  };

  const countriesByRegion = (regionName: string) => {
    return countries
      .filter(c => c.region === regionName)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  return (
    <div className="flex flex-col h-full border-r border-slate-200 bg-white">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-600" />
          Browse by Region
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {regions.map((region) => {
          const isOpen = openRegions.includes(region.slug);
          const regionCountries = countriesByRegion(region.name);
          
          return (
            <div key={region.slug} className="border-b border-slate-50">
              <button
                onClick={() => toggleRegion(region.slug)}
                className={cn(
                  "w-full px-4 py-3 flex items-center justify-between hover:bg-slate-50 transition-colors",
                  isOpen && "bg-slate-50/50 border-b border-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-700">{region.name}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {region.countries_count}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {isOpen && (
                <div className="py-1 bg-white">
                  {regionCountries.map((country) => (
                    <button
                      key={country.iso_alpha2}
                      onClick={() => onSelectCountry(country)}
                      className={cn(
                        "w-full px-6 py-2 flex items-center justify-between group hover:bg-blue-50 transition-colors text-left",
                        selectedCountryCode === country.iso_alpha2 && "bg-blue-50 text-blue-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-6 h-4 overflow-hidden rounded-sm border border-slate-100 bg-slate-50 flex-shrink-0">
                          <Image
                            src={country.flag_url}
                            alt={country.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="text-sm font-medium truncate max-w-[160px]">
                          {country.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-blue-400">
                        ({country.total_sea_ports})
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
