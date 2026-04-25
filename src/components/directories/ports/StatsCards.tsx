'use client';

import { useEffect, useState } from 'react';
import { Globe, Anchor, Plane, Train } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatItemProps {
  label: string;
  value: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}

function Counter({ end, duration = 2000 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
}

function StatItem({ label, value, icon: Icon, color, suffix = "" }: StatItemProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group flex-1 min-w-[200px]">
      <div className="flex items-center gap-4">
        <div className={cn("p-3 rounded-xl transition-colors", color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 leading-none mb-1">
            <Counter end={value} />{suffix}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            {label}
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatsCardsProps {
  stats: {
    countries: number;
    seaPorts: number;
    airports: number;
    dryPorts: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="flex flex-wrap gap-4">
      <StatItem 
        label="Countries" 
        value={stats.countries} 
        icon={Globe} 
        color="bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
        suffix="+"
      />
      <StatItem 
        label="Sea Ports" 
        value={stats.seaPorts} 
        icon={Anchor} 
        color="bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white"
        suffix="+"
      />
      <StatItem 
        label="Airports" 
        value={stats.airports} 
        icon={Plane} 
        color="bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white"
        suffix="+"
      />
      <StatItem 
        label="Dry Ports" 
        value={stats.dryPorts} 
        icon={Train} 
        color="bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white"
        suffix="+"
      />
    </div>
  );
}
