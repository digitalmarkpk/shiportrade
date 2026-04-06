'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText, Info, Lightbulb, AlertTriangle, BookOpen,
  HelpCircle, ArrowRight, CheckCircle2, Clock, FileCheck, Globe,
  ChevronRight, Home, FolderOpen, Share2, Bookmark, Printer
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';

export interface DocumentData {
  // Basic info
  title: string;
  description: string;
  icon?: ReactNode;
  category?: string;
  categoryColor?: string;
  lastUpdated?: string;

  // Educational content
  whatIs: string;
  whenToUse: string;
  keyComponents: {
    name: string;
    description: string;
    required?: boolean;
  }[];
  commonMistakes: string[];
  tips: string[];

  // Legal requirements
  legalRequirements?: {
    region: string;
    requirements: string[];
  }[];

  // FAQs
  faqs: {
    question: string;
    answer: string;
  }[];

  // Related documents
  relatedDocuments: {
    name: string;
    href: string;
    description: string;
  }[];

  // SEO & Metadata
  keywords?: string[];
  industryUsage?: string[];
  documentFormat?: string;
  estimatedTime?: string;
}

interface DocumentLayoutProps {
  data: DocumentData;
  children: ReactNode;
}

export default function DocumentLayout({ data, children }: DocumentLayoutProps) {
  // Generate Schema.org structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": `How to Create a ${data.title}`,
    "description": data.description,
    "step": [
      {
        "@type": "HowToStep",
        "name": "Fill Document Details",
        "text": "Enter all required information in the document form"
      },
      {
        "@type": "HowToStep", 
        "name": "Preview Document",
        "text": "Review the generated document preview"
      },
      {
        "@type": "HowToStep",
        "name": "Download or Print",
        "text": "Download as PDF, PNG, or print the document"
      }
    ],
    "tool": [
      {
        "@type": "HowToTool",
        "name": "Trade Document Generator"
      }
    ],
    "totalTime": data.estimatedTime || "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    }
  };

  // FAQ Schema for rich snippets
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Inject Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      {/* Breadcrumb Navigation */}
      <div className="bg-white/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-800 no-print">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-[#0F4C81] dark:hover:text-[#5BA3D9] flex items-center gap-1">
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/documents" className="hover:text-[#0F4C81] dark:hover:text-[#5BA3D9] flex items-center gap-1">
              <FolderOpen className="h-4 w-4" />
              Documents
            </Link>
            {data.category && (
              <>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-500 dark:text-slate-500">{data.category}</span>
              </>
            )}
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#0F4C81] dark:text-[#5BA3D9] font-medium">{data.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] py-12 px-4 no-print relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              {data.category && (
                <Badge variant="secondary" className="mb-3 bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {data.icon}
                  {data.category}
                </Badge>
              )}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {data.title}
              </h1>
              <p className="text-lg text-white/80 max-w-2xl leading-relaxed">
                {data.description}
              </p>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{data.estimatedTime || '5 min'} to complete</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <FileCheck className="h-4 w-4" />
                  <span>{data.documentFormat || 'PDF, PNG, Print'}</span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <Globe className="h-4 w-4" />
                  <span>International Standard</span>
                </div>
              </div>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap lg:flex-col gap-3">
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <FileCheck className="h-6 w-6 text-white" />
                <div>
                  <div className="text-white font-medium text-sm">Free Template</div>
                  <div className="text-white/60 text-xs">No registration</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Clock className="h-6 w-6 text-white" />
                <div>
                  <div className="text-white font-medium text-sm">Quick Generate</div>
                  <div className="text-white/60 text-xs">Under 5 minutes</div>
                </div>
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
                <Globe className="h-6 w-6 text-white" />
                <div>
                  <div className="text-white font-medium text-sm">Multi-Currency</div>
                  <div className="text-white/60 text-xs">180+ currencies</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Bar */}
      <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 no-print">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {data.keyComponents.filter(c => c.required).length} required fields
              </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-slate-600 dark:text-slate-400">
                {data.faqs.length} FAQs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                <Bookmark className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-400">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-slate-600 dark:text-slate-400"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                Print Guide
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Component */}
      {children}

      {/* Educational Content */}
      <div className="container mx-auto px-4 py-12 no-print">
        {/* Quick Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Badge variant="outline" className="cursor-pointer hover:bg-[#0F4C81]/10">
            <a href="#what-is" className="flex items-center gap-1">
              <Info className="h-3 w-3" /> What is it?
            </a>
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-[#0F4C81]/10">
            <a href="#key-components" className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" /> Key Components
            </a>
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-[#0F4C81]/10">
            <a href="#tips" className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" /> Pro Tips
            </a>
          </Badge>
          <Badge variant="outline" className="cursor-pointer hover:bg-[#0F4C81]/10">
            <a href="#faq" className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> FAQ
            </a>
          </Badge>
        </div>

        {/* What is & When to Use */}
        <div id="what-is" className="grid md:grid-cols-2 gap-6 mb-6 scroll-mt-20">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Info className="h-5 w-5 text-[#0F4C81]" />
                What is a {data.title}?
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">{data.whatIs}</p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#2E8B57]" />
                When to Use
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">{data.whenToUse}</p>
            </CardContent>
          </Card>
        </div>

        {/* Key Components */}
        <Card id="key-components" className="mb-6 border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm scroll-mt-20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-[#0F4C81]" />
              Key Components
            </CardTitle>
            <CardDescription>
              Essential fields and sections included in a {data.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {data.keyComponents.map((component, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {component.required ? (
                      <Badge className="bg-[#0F4C81] text-white text-xs">Required</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Optional</Badge>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100">{component.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{component.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tips & Mistakes */}
        <div id="tips" className="grid md:grid-cols-2 gap-6 mb-6 scroll-mt-20">
          <Card className="border-l-4 border-l-[#2E8B57] bg-emerald-50 dark:bg-emerald-950/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Lightbulb className="h-5 w-5 text-[#2E8B57] shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-[#2E8B57] mb-3">Pro Tips</p>
                  <ul className="space-y-2 text-emerald-700 dark:text-emerald-300">
                    {data.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-amber-950/30 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-700 dark:text-amber-300 mb-3">Common Mistakes to Avoid</p>
                  <ul className="space-y-2 text-amber-700 dark:text-amber-300">
                    {data.commonMistakes.map((mistake, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        <span>{mistake}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legal Requirements (if provided) */}
        {data.legalRequirements && data.legalRequirements.length > 0 && (
          <Card className="mb-6 border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0F4C81]" />
                Legal Requirements by Region
              </CardTitle>
              <CardDescription>
                Regional compliance requirements for {data.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.legalRequirements.map((req, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] dark:hover:border-[#5BA3D9] transition-colors"
                  >
                    <h4 className="font-semibold text-[#0F4C81] dark:text-[#5BA3D9] mb-2">{req.region}</h4>
                    <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                      {req.requirements.map((r, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-[#2E8B57] mt-1 shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Industry Usage (if provided) */}
        {data.industryUsage && data.industryUsage.length > 0 && (
          <Card className="mb-6 border-0 shadow-lg bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5 text-[#0F4C81]" />
                Industry Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {data.industryUsage.map((usage, index) => (
                  <Badge key={index} variant="secondary" className="bg-white dark:bg-slate-800">
                    {usage}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        <Card id="faq" className="mb-6 border-0 shadow-lg bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm scroll-mt-20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-[#0F4C81]" />
              Frequently Asked Questions
            </CardTitle>
            <CardDescription>
              Common questions about {data.title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {data.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left hover:text-[#0F4C81] dark:hover:text-[#5BA3D9]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Related Documents */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#0F4C81]" />
              Related Documents
            </CardTitle>
            <CardDescription>
              Other trade documents you might need
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.relatedDocuments.map((doc, index) => (
                <Link
                  key={index}
                  href={doc.href}
                  className="group flex items-start gap-3 p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] dark:hover:border-[#5BA3D9] hover:shadow-md transition-all"
                >
                  <div className="p-2 rounded-lg bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20 group-hover:bg-[#0F4C81]/20 dark:group-hover:bg-[#0F4C81]/30 transition-colors">
                    <FileText className="h-5 w-5 text-[#0F4C81]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100 group-hover:text-[#0F4C81] dark:group-hover:text-[#5BA3D9] transition-colors">
                      {doc.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {doc.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-[#0F4C81] transition-colors opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 text-center"
        >
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Ready to create your {data.title}?
          </p>
          <Button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:from-[#0F4C81]/90 hover:to-[#2E8B57]/90 text-white"
          >
            Start Generating
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </motion.div>
      </div>

      {/* Footer metadata */}
      <div className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 no-print">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-4">
              <span>Last updated: {data.lastUpdated || 'January 2025'}</span>
              <span>•</span>
              <span>Free to use</span>
            </div>
            <div className="flex items-center gap-2">
              {data.keywords && data.keywords.slice(0, 5).map((keyword, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
