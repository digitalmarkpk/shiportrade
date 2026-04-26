'use client';

import React from 'react';
import { Port } from '@/utils/data-utils';
import Link from 'next/link';
import { Anchor, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface PortTableProps {
  ports: Port[];
  countrySlug: string;
}

export default function PortTable({ ports, countrySlug }: PortTableProps) {
  if (ports.length === 0) {
    return (
      <div className="py-20 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
        <Anchor className="w-12 h-12 text-slate-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">No ports found</h3>
        <p className="text-slate-500">There are no commercial ports listed for this country.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Port Name</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">UN/LOCODE</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">Type</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Max Depth</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Annual TEU</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {(ports || []).map((port) => (
              <tr key={port.unlocode} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <Link 
                    href={`/directories/ports/${countrySlug}/${port.slug}`}
                    className="flex items-center gap-3 group/link"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover/link:bg-blue-100 transition-colors">
                      <Anchor className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 group-hover/link:text-blue-600 transition-colors">
                        {port.name}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {port.timezone}
                      </div>
                    </div>
                  </Link>
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary" className="font-mono text-[11px] bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0.5">
                    {port.unlocode}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="text-xs font-medium text-slate-600">
                    {port.port_type}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-semibold text-slate-700">
                    {port.max_depth_m > 0 ? `${port.max_depth_m}m` : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="text-sm font-semibold text-slate-700">
                    {port.annual_teu > 0 ? port.annual_teu.toLocaleString() : 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <Link href={`/directories/ports/${countrySlug}/${port.slug}`}>
                    <Button variant="ghost" size="sm" className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-bold text-xs gap-1">
                      Details
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
