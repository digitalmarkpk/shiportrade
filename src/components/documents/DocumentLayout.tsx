'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FileText, Printer, Download, Share2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export interface DocumentData {
  title: string;
  description: string;
  icon?: ReactNode;
  category?: string;
  categoryColor?: string;
  lastUpdated?: string;
  whatIs: string;
  whenToUse: string;
  keyComponents: {
    name: string;
    description: string;
    required?: boolean;
  }[];
  commonMistakes: string[];
  tips: string[];
  legalRequirements?: {
    region: string;
    requirements: string[];
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  relatedDocuments: {
    name: string;
    href: string;
    description: string;
  }[];
  keywords?: string[];
  industryUsage?: string[];
  documentFormat?: string;
  estimatedTime?: string;
}

interface DocumentLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
  data?: DocumentData;
}

export default function DocumentLayout({ title, description, children, data }: DocumentLayoutProps) {
  const displayTitle = title || data?.title || 'Document Generator';
  const displayDescription = description || data?.description || 'Create and manage your trade documents.';
  const displayIcon = data?.icon || <FileText className="h-6 w-6 text-primary" />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-none shadow-xl bg-card overflow-hidden">
          <CardHeader className="bg-muted/30 pb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-xl">
                  {displayIcon}
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold tracking-tight">
                    {displayTitle}
                  </CardTitle>
                  <CardDescription className="text-lg mt-1">
                    {displayDescription}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <Separator />
          <CardContent className="p-6 md:p-10">
            {children}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
