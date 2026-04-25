'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { Search, MapPin, Globe, Anchor, Plane, Train, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Port, Country } from '@/utils/data-utils';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface SearchBoxProps {
  ports: Port[];
  countries: Country[];
  className?: string;
}

export default function SearchBox({ ports, countries, className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (query.length < 2) return [];

    const searchPorts = ports.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.unlocode.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5).map(p => ({ type: 'port' as const, item: p }));

    const searchCountries = countries.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.iso_alpha2.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3).map(c => ({ type: 'country' as const, item: c }));

    return [...searchCountries, ...searchPorts];
  }, [query, ports, countries]);

  useEffect(() => {
    if (query.length >= 2 && results.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query, results.length]);

  const handleSelect = (result: { type: string; item: any }) => {
    if (result.type === 'country') {
      router.push(`/directories/ports/country/${result.item.slug}`);
    } else {
      router.push(`/directories/ports/${result.item.country_slug}/${result.item.slug}`);
    }
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto", className)} ref={dropdownRef}>
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5 group-focus-within:text-blue-500 transition-colors" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by port name, country, or UN/LOCODE..."
          className="pl-12 h-14 bg-white border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 rounded-2xl text-lg shadow-xl transition-all"
          onFocus={() => query.length >= 2 && setIsOpen(true)}
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 rounded-full text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2">
            {results.map((result, idx) => (
              <button
                key={`${result.type}-${idx}`}
                onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-4 p-3 hover:bg-slate-50 transition-colors rounded-xl text-left group"
              >
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                  result.type === 'country' ? "bg-slate-100 group-hover:bg-slate-200" : "bg-blue-50 group-hover:bg-blue-100"
                )}>
                  {result.type === 'country' ? (
                    <div className="relative w-6 h-4 overflow-hidden rounded-sm border border-slate-200">
                      <Image 
                        src={result.item.flag_url} 
                        alt={result.item.name} 
                        fill 
                        className="object-cover" 
                        unoptimized
                      />
                    </div>
                  ) : (
                    <Anchor className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {result.item.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 py-0.5 bg-slate-100 rounded">
                      {result.type === 'country' ? result.item.iso_alpha2 : result.item.unlocode}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                    {result.type === 'country' ? (
                      <>
                        <Globe className="w-3 h-3" />
                        {result.item.region} • {result.item.total_sea_ports} Ports
                      </>
                    ) : (
                      <>
                        <MapPin className="w-3 h-3" />
                        {result.item.country_name} • {result.item.port_type}
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
