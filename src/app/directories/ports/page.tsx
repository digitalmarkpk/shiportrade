"use client";

import { useState, useMemo, useEffect } from "react";
import nextDynamic from 'next/dynamic';
import { 
  Search, 
  Globe, 
  Ship, 
  Anchor, 
  MapPin, 
  Info, 
  ChevronRight, 
  ExternalLink, 
  Navigation,
  ArrowRight,
  ChevronLeft
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import portsData from '@/../../public/data/ports-full.json';

// Dynamic import for Leaflet map to avoid SSR issues
const GlobalPortsMap = nextDynamic(() => import('@/components/GlobalPortsMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full bg-slate-100 animate-pulse flex items-center justify-center rounded-xl border border-slate-200">
      <span className="text-slate-400 font-medium">Loading interactive map...</span>
    </div>
  )
});

interface Port {
  unlocode: string;
  name: string;
  country_code: string;
  country_name?: string;
  latitude: number;
  longitude: number;
  port_type: string;
  terminals: number;
  max_depth_m?: number;
  annual_teu?: number;
  timezone?: string;
}

const ITEMS_PER_PAGE = 50;

export default function PortsDirectoryPage() {
  const [selected, setSelected] = useState<Port>(portsData[0]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Initial selection from URL without useSearchParams
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('port');
    if (code) {
      const p = portsData.find(x => x.unlocode === code.toUpperCase());
      if (p) setSelected(p);
    }
  }, []);

  // Update URL when selection changes
  useEffect(() => {
    if (selected) {
      const url = new URL(window.location.href);
      url.searchParams.set('port', selected.unlocode);
      window.history.pushState({}, '', url.toString());
    }
  }, [selected]);

  const filtered = useMemo(() => {
    if (!search) return portsData;
    const query = search.toLowerCase();
    return portsData.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.unlocode.toLowerCase().includes(query) ||
      (p.country_name && p.country_name.toLowerCase().includes(query))
    );
  }, [search]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedPorts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSelect = (port: Port) => {
    setSelected(port);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 pt-16 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-[#0F4C81]/10 text-[#0F4C81] border-none px-4 py-1.5 rounded-full">
              <Globe className="h-4 w-4 mr-2 inline" />
              11,247 Ports Worldwide
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
              Global Port Directory
            </h1>
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                placeholder="Search by name, code, or country..." 
                className="pl-12 h-14 text-lg rounded-xl border-slate-200 shadow-sm focus-visible:ring-[#0F4C81]"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT: List & Pagination (4 columns) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="font-bold text-slate-900">
                {search ? `Results (${filtered.length})` : "All Ports"}
              </h2>
              <span className="text-xs text-slate-500 font-medium">
                Page {currentPage} of {totalPages || 1}
              </span>
            </div>

            <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
              {paginatedPorts.map((port) => (
                <button
                  key={port.unlocode}
                  onClick={() => handleSelect(port)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selected?.unlocode === port.unlocode
                      ? "border-[#0F4C81] bg-white shadow-md ring-1 ring-[#0F4C81]"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900 truncate max-w-[180px]">{port.name}</h4>
                      <p className="text-xs text-slate-500 mt-1 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {port.country_name}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-mono bg-slate-50">
                      {port.unlocode}
                    </Badge>
                  </div>
                </button>
              ))}
              
              {filtered.length === 0 && (
                <div className="py-20 text-center bg-white rounded-xl border border-dashed border-slate-200">
                  <Search className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-500">No ports found matching "{search}"</p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="rounded-lg"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                </Button>
                <div className="text-sm font-medium text-slate-600">
                  {currentPage} / {totalPages}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="rounded-lg"
                >
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </div>

          {/* RIGHT: Map & Details (8 columns) */}
          <div className="lg:col-span-8 space-y-6">
            <GlobalPortsMap 
              ports={filtered} 
              selectedId={selected?.unlocode} 
              onSelect={handleSelect}
              height="500px"
              maxMarkers={500}
            />

            {selected && (
              <Card className="border-slate-200 shadow-xl rounded-2xl overflow-hidden bg-white">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white border-none">
                          {selected.port_type}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-slate-500">
                          {selected.unlocode}
                        </Badge>
                      </div>
                      <CardTitle className="text-4xl font-bold text-slate-900">{selected.name}</CardTitle>
                      <p className="text-slate-500 flex items-center mt-2 text-lg">
                        <Globe className="h-5 w-5 mr-2 text-[#0F4C81]" />
                        {selected.country_name} ({selected.country_code})
                      </p>
                    </div>
                    <Button className="bg-[#0F4C81] hover:bg-[#0F4C81]/90 h-12 px-6 rounded-xl">
                      Book Freight <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Annual Throughput</p>
                      <p className="text-xl font-bold text-slate-900">
                        {selected.annual_teu ? `${(selected.annual_teu / 1000000).toFixed(1)}M TEU` : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Max Depth</p>
                      <p className="text-xl font-bold text-slate-900">
                        {selected.max_depth_m ? `${selected.max_depth_m}m` : 'N/A'}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Terminals</p>
                      <p className="text-xl font-bold text-slate-900">{selected.terminals || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Timezone</p>
                      <p className="text-xl font-bold text-slate-900">{selected.timezone || 'UTC'}</p>
                    </div>
                  </div>

                  <div className="mt-10 p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-xl shadow-sm">
                      <Info className="h-6 w-6 text-[#0F4C81]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Port Intelligence</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {selected.name} is a key {selected.port_type.toLowerCase()} in {selected.country_name}. 
                        It handles significant maritime traffic and is essential for global supply chains.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
