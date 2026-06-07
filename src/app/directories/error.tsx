'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function DirectoryError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Directory error:', error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-amber-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
          Error Loading Directory
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          We encountered a problem while fetching the directory data. This could be a temporary issue.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => reset()}
            className="bg-[#0F4C81] hover:bg-[#0D3D68]"
          >
            Refresh Page
          </Button>
          <Button asChild variant="outline">
            <Link href="/directories/ports" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Ports Directory
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}