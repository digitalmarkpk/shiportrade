"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { 
  FileText, Printer, Download, Eye, Building, Globe, Calendar, 
  Package, Info, Plus, Trash2, Edit, Save, RefreshCw,
  CheckCircle, AlertCircle, Clock, DollarSign
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PrintableDocument from "./PrintableDocument";

interface DocumentField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'currency';
  placeholder?: string;
  required?: boolean;
  section?: string;
  options?: { value: string; label: string }[];
}

interface GenericDocumentGeneratorProps {
  documentTitle: string;
  documentDescription?: string;
  fields: DocumentField[];
  categorySlug: string;
}

// Currency options for currency type fields
const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "EUR", label: "EUR - Euro" },
  { value: "GBP", label: "GBP - British Pound" },
  { value: "JPY", label: "JPY - Japanese Yen" },
  { value: "CNY", label: "CNY - Chinese Yuan" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "AED", label: "AED - UAE Dirham" },
  { value: "SAR", label: "SAR - Saudi Riyal" },
  { value: "AUD", label: "AUD - Australian Dollar" },
  { value: "CAD", label: "CAD - Canadian Dollar" },
  { value: "CHF", label: "CHF - Swiss Franc" },
  { value: "HKD", label: "HKD - Hong Kong Dollar" },
  { value: "SGD", label: "SGD - Singapore Dollar" },
];

export default function GenericDocumentGenerator({
  documentTitle,
  documentDescription,
  fields,
  categorySlug,
}: GenericDocumentGeneratorProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  // Initialize form data with default values
  const initialFormData = fields.reduce((acc, field) => {
    if (field.type === 'date') {
      acc[field.id] = new Date().toISOString().split('T')[0];
    } else if (field.type === 'currency') {
      acc[field.id] = '';
      acc[`${field.id}_currency`] = 'USD';
    } else if (field.type === 'number') {
      acc[field.id] = '';
    } else {
      acc[field.id] = '';
    }
    return acc;
  }, {} as Record<string, string>);

  const [formData, setFormData] = useState<Record<string, string>>(initialFormData);

  const updateField = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  // Calculate completion percentage
  const requiredFields = fields.filter(f => f.required);
  const filledRequired = requiredFields.filter(f => formData[f.id] && formData[f.id].trim() !== '');
  const completionPercentage = requiredFields.length > 0 
    ? Math.round((filledRequired.length / requiredFields.length) * 100) 
    : 100;

  const handlePrint = () => {
    // Create a dedicated print container for clean output
    const printContainer = document.createElement('div');
    printContainer.id = 'print-container';
    printContainer.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 100%;
      background: white;
      z-index: 99999;
      padding: 10mm;
    `;
    
    // Clone the document content
    if (printRef.current) {
      const clone = printRef.current.cloneNode(true) as HTMLElement;
      
      // Remove buttons and non-print elements from clone
      clone.querySelectorAll('button').forEach(btn => btn.remove());
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      
      // Style the clone for print
      clone.style.cssText = `
        background: white;
        width: 100%;
        box-shadow: none;
        border: none;
        border-radius: 0;
      `;
      
      printContainer.appendChild(clone);
    }
    
    // Hide all page content
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
      (allElements[i] as HTMLElement).style.display = 'none';
    }
    
    // Add print container to body
    document.body.appendChild(printContainer);
    
    // Set document title
    const originalTitle = document.title;
    document.title = `${documentTitle.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}`;
    
    // Print
    window.print();
    
    // Restore after print
    setTimeout(() => {
      printContainer.remove();
      for (let i = 0; i < allElements.length; i++) {
        (allElements[i] as HTMLElement).style.display = '';
      }
      document.title = originalTitle;
    }, 500);
  };

  // Reset form
  const handleReset = () => {
    setFormData(initialFormData);
  };

  // Group fields by section
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || 'General Information';
    if (!acc[section]) acc[section] = [];
    acc[section].push(field);
    return acc;
  }, {} as Record<string, DocumentField[]>);

  // Get sections array
  const sections = Object.entries(groupedFields);

  // Render input based on type
  const renderInput = (field: DocumentField) => {
    if (field.type === 'select' && field.options) {
      return (
        <Select
          value={formData[field.id] || ''}
          onValueChange={(v) => updateField(field.id, v)}
        >
          <SelectTrigger>
            <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    
    if (field.type === 'currency') {
      return (
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              id={field.id}
              type="number"
              value={formData[field.id]}
              onChange={(e) => updateField(field.id, e.target.value)}
              placeholder={field.placeholder || "0.00"}
              className="font-mono"
            />
          </div>
          <Select
            value={formData[`${field.id}_currency`] || 'USD'}
            onValueChange={(v) => updateField(`${field.id}_currency`, v)}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencyOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }
    
    if (field.type === 'textarea') {
      return (
        <Textarea
          id={field.id}
          value={formData[field.id]}
          onChange={(e) => updateField(field.id, e.target.value)}
          placeholder={field.placeholder}
          rows={3}
        />
      );
    }
    
    return (
      <Input
        id={field.id}
        type={field.type}
        value={formData[field.id]}
        onChange={(e) => updateField(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={field.type === 'number' ? 'font-mono' : ''}
      />
    );
  };

  // Format value for display
  const formatValue = (field: DocumentField, value: string) => {
    if (!value || value.trim() === '') {
      return <span className="text-slate-400 italic text-xs">Not specified</span>;
    }
    
    if (field.type === 'currency') {
      const currency = formData[`${field.id}_currency`] || 'USD';
      return (
        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
          {currency} {parseFloat(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      );
    }
    
    if (field.type === 'date') {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
    
    return value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 no-print"
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              {documentTitle} Generator
            </h1>
          </div>
          {documentDescription && (
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              {documentDescription}
            </p>
          )}
          
          {/* Progress Bar */}
          <div className="max-w-md mx-auto mt-4">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Completion</span>
              <span className={completionPercentage === 100 ? 'text-emerald-500 font-medium' : ''}>
                {completionPercentage}%
              </span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 rounded-full ${
                  completionPercentage === 100 
                    ? 'bg-gradient-to-r from-emerald-500 to-green-500' 
                    : completionPercentage >= 50 
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500'
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Layout - Side by Side */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Column - Form */}
          <div className="space-y-4 no-print">
            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
              <div className="space-y-4">
                {sections.map(([section, sectionFields], sectionIndex) => (
                  <motion.div
                    key={section}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.05 }}
                  >
                    <Card 
                      className={`border-0 shadow-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm transition-shadow hover:shadow-xl ${
                        activeSection === section ? 'ring-2 ring-[#0F4C81]/50' : ''
                      }`}
                      onMouseEnter={() => setActiveSection(section)}
                      onMouseLeave={() => setActiveSection(null)}
                    >
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            sectionIndex % 2 === 0 ? 'bg-[#0F4C81]/10' : 'bg-[#2E8B57]/10'
                          }`}>
                            <Package className={`h-4 w-4 ${
                              sectionIndex % 2 === 0 ? 'text-[#0F4C81]' : 'text-[#2E8B57]'
                            }`} />
                          </div>
                          {section}
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {sectionFields.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid gap-4">
                          {sectionFields.map((field) => (
                            <div key={field.id} className="space-y-1.5">
                              <Label htmlFor={field.id} className="text-sm flex items-center gap-1">
                                {field.label}
                                {field.required && (
                                  <span className="text-red-500 text-xs">*</span>
                                )}
                                {field.type === 'currency' && (
                                  <DollarSign className="h-3 w-3 text-emerald-500 ml-1" />
                                )}
                              </Label>
                              {renderInput(field)}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button 
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button 
                size="lg" 
                onClick={handlePrint}
                className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white gap-2"
                disabled={completionPercentage < 50}
              >
                <Printer className="h-4 w-4" />
                Print / Save as PDF
              </Button>
            </div>
          </div>

          {/* Right Column - Preview */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="flex items-center justify-between mb-4 no-print">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">Document Preview</h3>
                {completionPercentage === 100 && (
                  <Badge className="bg-emerald-500 text-white text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Ready
                  </Badge>
                )}
              </div>
              <Badge variant="outline" className="text-xs gap-1">
                <Eye className="h-3 w-3" />
                Live
              </Badge>
            </div>

            <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
              <PrintableDocument documentTitle={`${documentTitle.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}`}>
                <div ref={printRef} className="bg-white dark:bg-slate-900 p-6 print:p-0">
                  {/* Document Header */}
                  <div className="text-center border-b-2 border-[#0F4C81] pb-4 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileText className="h-6 w-6 text-[#0F4C81]" />
                      <h1 className="text-lg font-bold text-[#0F4C81] uppercase tracking-wide">
                        {documentTitle}
                      </h1>
                    </div>
                    <p className="text-xs text-slate-500">
                      Generated on: {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>

                  {/* Document Content */}
                  <div className="space-y-5">
                    {sections.map(([section, sectionFields]) => (
                      <div key={section} className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-4">
                        <h3 className="font-semibold text-[#2E8B57] mb-3 text-sm flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-[#2E8B57] rounded-full" />
                          {section}
                        </h3>
                        <div className="grid gap-2">
                          {sectionFields.map((field) => (
                            <div key={field.id} className="flex items-start gap-3 py-1.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                              <p className="text-xs text-slate-500 min-w-[120px] pt-0.5">{field.label}</p>
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1">
                                {formatValue(field, formData[field.id])}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Document Footer */}
                  <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                    <p className="text-xs text-slate-400">
                      Generated using Shiportrade.com - Professional Trade Document Platform
                    </p>
                    <p className="text-[10px] text-slate-300 mt-1">
                      This document is computer-generated and valid without signature
                    </p>
                  </div>
                </div>
              </PrintableDocument>
            </div>
            
            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-3 gap-2 no-print">
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold text-[#0F4C81]">{sections.length}</p>
                <p className="text-xs text-slate-500">Sections</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold text-[#2E8B57]">{fields.length}</p>
                <p className="text-xs text-slate-500">Fields</p>
              </div>
              <div className="bg-white dark:bg-slate-800 rounded-lg p-3 text-center border border-slate-200 dark:border-slate-700">
                <p className="text-lg font-bold text-amber-500">{requiredFields.length}</p>
                <p className="text-xs text-slate-500">Required</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
