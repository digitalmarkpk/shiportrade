'use client';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const GlobalPortsMap = dynamic(() => import('@/components/GlobalPortsMap'), { 
  ssr: false,
  loading: () => <Skeleton className="h-full w-full rounded-xl" />
});

export default GlobalPortsMap;
