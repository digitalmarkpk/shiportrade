'use client';

import { useRef, useCallback } from 'react';
import { Printer, Download, FileText, Eye, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface DocumentPreviewProps {
  children: React.ReactNode;
  documentTitle: string;
  documentType: string;
  documentNumber?: string;
  onPrint?: () => void;
  onExport?: () => void;
}

// Print-specific styles
const printStyleId = 'document-print-styles';

function injectPrintStyles() {
  if (typeof document === 'undefined') return;
  
  if (!document.getElementById(printStyleId)) {
    const style = document.createElement('style');
    style.id = printStyleId;
    style.textContent = `
      @media print {
        @page {
          size: A4 portrait;
          margin: 12mm;
        }
        
        body * {
          visibility: hidden;
        }
        
        .print-area,
        .print-area * {
          visibility: visible;
        }
        
        .print-area {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          background: white !important;
          color: black !important;
        }
        
        .no-print {
          display: none !important;
        }
        
        .print-document {
          font-family: 'Segoe UI', Arial, sans-serif !important;
          font-size: 10pt !important;
          line-height: 1.4 !important;
          color: #000 !important;
          background: #fff !important;
          width: 100% !important;
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
        }
        
        .print-document * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        
        .print-document table {
          width: 100% !important;
          border-collapse: collapse !important;
        }
        
        .print-document th,
        .print-document td {
          border: 1px solid #333 !important;
          padding: 4pt 6pt !important;
        }
        
        .print-document th {
          background: #e5e5e5 !important;
        }
        
        .print-document .doc-header {
          border-bottom: 2px solid #000 !important;
          padding-bottom: 8pt !important;
          margin-bottom: 12pt !important;
        }
        
        .print-document .doc-footer {
          border-top: 1px solid #ccc !important;
          padding-top: 8pt !important;
          margin-top: 16pt !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export function DocumentPreview({
  children,
  documentTitle,
  documentType,
  documentNumber,
  onPrint,
  onExport,
}: DocumentPreviewProps) {
  const printRef = useRef<HTMLDivElement>(null);
  
  // Inject print styles on mount
  if (typeof window !== 'undefined') {
    injectPrintStyles();
  }
  
  const handlePrint = useCallback(() => {
    // Set document title for PDF filename
    const originalTitle = document.title;
    document.title = `${documentType}_${documentNumber || Date.now()}`;
    
    // Trigger print
    window.print();
    
    // Restore original title
    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
    
    onPrint?.();
  }, [documentType, documentNumber, onPrint]);
  
  const handleExportHTML = useCallback(() => {
    if (!printRef.current) return;
    
    const content = printRef.current.innerHTML;
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11pt; line-height: 1.4; color: #333; padding: 20mm; }
    table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #333; padding: 6pt 8pt; text-align: left; }
    th { background: #f0f0f0; font-weight: 600; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .doc-header { border-bottom: 2px solid #0F4C81; padding-bottom: 12pt; margin-bottom: 16pt; text-align: center; }
    .doc-footer { border-top: 1px solid #ccc; padding-top: 12pt; margin-top: 24pt; font-size: 9pt; text-align: center; color: #666; }
    h1 { font-size: 18pt; margin-bottom: 8pt; }
    h2 { font-size: 14pt; margin-bottom: 6pt; }
    h3 { font-size: 12pt; margin-bottom: 4pt; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
    
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentType}_${documentNumber || Date.now()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    onExport?.();
  }, [documentTitle, documentType, documentNumber, onExport]);
  
  return (
    <div className="space-y-4">
      {/* Action Buttons - No Print */}
      <div className="flex justify-end gap-3 no-print">
        <Button onClick={handlePrint} className="gap-2 bg-[var(--ocean)] hover:bg-[var(--ocean)]/90">
          <Printer className="h-4 w-4" />
          Print Document
        </Button>
        <Button onClick={handleExportHTML} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export HTML
        </Button>
      </div>
      
      {/* Document Preview - A4 Sized */}
      <div className="print-area" ref={printRef}>
        <div className="print-document bg-white text-gray-900 mx-auto shadow-xl" style={{ 
          width: '210mm', 
          minHeight: '297mm',
          padding: '15mm',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Document Preview Dialog for quick preview
export function DocumentPreviewDialog({
  trigger,
  children,
  title,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <div className="bg-white text-gray-900 mx-auto shadow-lg rounded-lg overflow-hidden" style={{ 
            width: '100%',
            maxWidth: '210mm',
            minHeight: '400px',
            padding: '10mm',
            transform: 'scale(0.6)',
            transformOrigin: 'top left',
          }}>
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Document Header Component
export function DocumentHeader({ 
  title, 
  subtitle,
  documentNo,
  date,
  page = '1 of 1'
}: { 
  title: string; 
  subtitle?: string;
  documentNo?: string;
  date?: string;
  page?: string;
}) {
  return (
    <div className="doc-header text-center border-b-2 border-gray-800 pb-3 mb-4">
      <h1 className="text-xl font-bold text-gray-900 uppercase tracking-wide">{title}</h1>
      {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
      <div className="flex justify-between items-center mt-2 text-xs text-gray-500">
        <span>Doc: {documentNo || 'N/A'}</span>
        <span>Date: {date || new Date().toISOString().split('T')[0]}</span>
        <span>Page: {page}</span>
      </div>
    </div>
  );
}

// Document Footer Component
export function DocumentFooter({
  companyName = 'Shiportrade.com',
  disclaimer,
}: {
  companyName?: string;
  disclaimer?: string;
}) {
  return (
    <div className="doc-footer border-t border-gray-300 pt-3 mt-6 text-center">
      <p className="text-xs text-gray-500">
        {disclaimer || 'This document is computer generated and valid for trade purposes.'}
      </p>
      <p className="text-xs text-gray-400 mt-1">
        Generated by {companyName} - Global Supply Chain Intelligence Platform
      </p>
    </div>
  );
}

// Signature Area Component
export function SignatureArea({
  sellerLabel = 'Seller Signature',
  buyerLabel = 'Buyer Signature',
  showDate = true,
}: {
  sellerLabel?: string;
  buyerLabel?: string;
  showDate?: boolean;
}) {
  return (
    <div className="flex justify-between mt-12 pt-4">
      <div className="text-center w-2/5">
        <div className="border-t border-gray-800 pt-2 mt-16">
          <p className="font-medium text-sm">{sellerLabel}</p>
          {showDate && <p className="text-xs text-gray-500">Date: ____________</p>}
        </div>
      </div>
      <div className="text-center w-2/5">
        <div className="border-t border-gray-800 pt-2 mt-16">
          <p className="font-medium text-sm">{buyerLabel}</p>
          {showDate && <p className="text-xs text-gray-500">Date: ____________</p>}
        </div>
      </div>
    </div>
  );
}

// Document Table Component
export function DocumentTable({
  headers,
  rows,
  totals,
}: {
  headers: string[];
  rows: React.ReactNode[][];
  totals?: { label: string; value: string; colSpan?: number }[];
}) {
  return (
    <table className="w-full border-collapse text-sm mb-4">
      <thead>
        <tr className="bg-gray-100">
          {headers.map((header, i) => (
            <th key={i} className="border border-gray-800 px-2 py-1.5 text-left font-semibold">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="even:bg-gray-50">
            {row.map((cell, j) => (
              <td key={j} className="border border-gray-800 px-2 py-1.5">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {totals && totals.length > 0 && (
        <tfoot>
          {totals.map((total, i) => (
            <tr key={i} className="bg-gray-100 font-semibold">
              <td className="border border-gray-800 px-2 py-1.5" colSpan={total.colSpan || 1}>
                {total.label}
              </td>
              <td className="border border-gray-800 px-2 py-1.5 text-right">
                {total.value}
              </td>
            </tr>
          ))}
        </tfoot>
      )}
    </table>
  );
}

// Info Row Component for displaying key-value pairs
export function DocumentInfoRow({
  label,
  value,
  className = '',
}: {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex ${className}`}>
      <span className="text-gray-600 w-36 shrink-0">{label}:</span>
      <span className="font-medium">{value || '-'}</span>
    </div>
  );
}

// Section Box for grouping information
export function DocumentSection({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-gray-300 rounded mb-4 ${className}`}>
      <div className="bg-gray-100 px-3 py-1.5 border-b border-gray-300">
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>
      <div className="p-3 text-sm">
        {children}
      </div>
    </div>
  );
}

export default DocumentPreview;
