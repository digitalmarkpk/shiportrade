'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
        Something went wrong!
      </h1>
      <p className="text-slate-600 dark:text-slate-400 max-w-md mb-8">
        An unexpected error occurred while loading this page. Our team has been notified.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          onClick={() => reset()}
          size="lg"
          className="bg-[#0F4C81] hover:bg-[#0D3D68]"
        >
          Try again
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/">
            Go to Homepage
          </Link>
        </Button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-12 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg text-left max-w-2xl overflow-auto">
          <p className="font-mono text-sm text-red-600">{error.message}</p>
          <pre className="mt-2 text-xs text-slate-500">{error.stack}</pre>
        </div>
      )}
    </div>
  );
}