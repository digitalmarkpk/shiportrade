"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Ship, Plane, Train, Package, Anchor, MapPin, ChevronRight, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { slugify } from '@/utils/slugify';

interface Port {
  id: number;
  un_locode: string;
  name: string;
  slug: string;
  city: string;
  port_type: string;
}

interface PortsListProps {
  ports: Port[];
  countrySlug: string;
}

export default function PortsList({ ports, countrySlug }: PortsListProps) {
  const [search, setSearch] = useState("");
  const [displayLimit, setDisplayLimit] = useState(24);

  const getPortIcon = (type: string) => {
    switch(type) {
      case 'sea_port': return <Ship className="w-4 h-4 text-blue-500" />;
      case 'airport': return <Plane className="w-4 h-4 text-amber-500" />;
      case 'container_terminal': return <Package className="w-4 h-4 text-emerald-500" />;
      case 'dry_port':
      case 'rail_terminal': return <Train className="w-4 h-4 text-rose-500" />;
      default: return <Anchor className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredPorts = useMemo(() => {
    const safePorts = Array.isArray(ports) ? ports : [];
    if (!search) return safePorts;
    const query = search.toLowerCase();
    return safePorts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.un_locode.toLowerCase().includes(query) ||
      (p.city && p.city.toLowerCase().includes(query))
    );
  }, [ports, search]);

  const displayedPorts = filteredPorts.slice(0, displayLimit);
  const hasMore = displayLimit < filteredPorts.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center px-2">
        <h2 className="text-2xl font-bold text-slate-900 flex items-center">
          <Anchor className="w-5 h-5 mr-2 text-blue-600" />
          All Transport Locations
          <span className="ml-3 text-sm font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
            {filteredPorts.length}
          </span>
        </h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search in country..." 
            className="pl-9 bg-white border-slate-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setDisplayLimit(24); // Reset limit on search
            }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedPorts.map((port) => (
          <Card key={port.un_locode} className="group p-5 hover:border-blue-300 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-slate-50 group-hover:bg-blue-50 transition-colors`}>
                {getPortIcon(port.port_type)}
              </div>
              <Badge variant="outline" className="font-mono text-[10px] text-slate-400 border-slate-100">
                {port.un_locode}
              </Badge>
            </div>
            
            <h3 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
              {port.name}
            </h3>
            <div className="text-xs text-slate-500 mb-6 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> {port.city || 'Commercial Hub'}
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-50">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {port.port_type.replace('_', ' ')}
              </div>
              <Link 
                href={`/directories/ports/${countrySlug}/${port.slug}`}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center"
              >
                View Details <ChevronRight className="w-3 h-3 ml-1" />
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            className="px-8 py-6 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 font-bold"
            onClick={() => setDisplayLimit(prev => prev + 24)}
          >
            Load More Ports ({filteredPorts.length - displayLimit} remaining)
          </Button>
        </div>
      )}

      {filteredPorts.length === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100">
          <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-slate-500">No ports found matching your search.</p>
        </div>
      )}
    </div>
  );
}