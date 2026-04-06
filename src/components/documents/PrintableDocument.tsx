'use client';

import { ReactNode, useRef, useState } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { Printer, Download, FileImage, FileText, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PrintableDocumentProps {
  children: ReactNode;
  documentTitle?: string;
  className?: string;
  showActions?: boolean;
  documentType?: string;
}

export default function PrintableDocument({
  children,
  documentTitle = 'document',
  className = '',
  showActions = true,
  documentType = 'document',
}: PrintableDocumentProps) {
  const documentRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    // Create a dedicated print container
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
    if (documentRef.current) {
      const clone = documentRef.current.cloneNode(true) as HTMLElement;
      
      // Remove buttons from clone
      clone.querySelectorAll('button').forEach(btn => btn.remove());
      clone.querySelectorAll('.no-print').forEach(el => el.remove());
      
      // Style the clone
      clone.style.cssText = `
        background: white;
        width: 100%;
        box-shadow: none;
        border: none;
        border-radius: 0;
      `;
      
      printContainer.appendChild(clone);
    }
    
    // Hide all other content
    document.body.style.overflow = 'hidden';
    const allElements = document.body.children;
    for (let i = 0; i < allElements.length; i++) {
      (allElements[i] as HTMLElement).style.display = 'none';
    }
    
    // Add print container to body
    document.body.appendChild(printContainer);
    
    // Store original title
    const originalTitle = document.title;
    document.title = documentTitle;
    
    // Print
    window.print();
    
    // Restore after print
    setTimeout(() => {
      // Remove print container
      printContainer.remove();
      
      // Restore all elements
      for (let i = 0; i < allElements.length; i++) {
        (allElements[i] as HTMLElement).style.display = '';
      }
      document.body.style.overflow = '';
      document.title = originalTitle;
    }, 500);
  };

  const handleDownloadPDF = async () => {
    if (!documentRef.current) return;
    
    setIsExporting(true);
    setExportFormat('pdf');
    
    try {
      // For PDF, we'll use the print dialog which has PDF export option
      handlePrint();
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    if (!documentRef.current) return;
    
    setIsExporting(true);
    setExportFormat(format);
    
    try {
      // Hide any no-print elements before capture
      const noPrintElements = documentRef.current.querySelectorAll('.no-print');
      const hiddenStates: Map<Element, string> = new Map();
      
      noPrintElements.forEach((el) => {
        hiddenStates.set(el, (el as HTMLElement).style.display);
        (el as HTMLElement).style.display = 'none';
      });

      const options = {
        quality: 0.95,
        pixelRatio: 2, // Higher resolution for better quality
        backgroundColor: '#ffffff',
        cacheBust: true,
        // Only capture the document content, not the page
        filter: (node: HTMLElement) => {
          // Filter out any elements that shouldn't be in the image
          if (node.classList && node.classList.contains('no-print')) {
            return false;
          }
          return true;
        },
      };

      let dataUrl: string;
      let extension: string;

      if (format === 'png') {
        dataUrl = await toPng(documentRef.current, options);
        extension = 'png';
      } else {
        dataUrl = await toJpeg(documentRef.current, options);
        extension = 'jpg';
      }

      // Restore hidden elements
      noPrintElements.forEach((el) => {
        (el as HTMLElement).style.display = hiddenStates.get(el) || '';
      });

      // Create download link
      const link = document.createElement('a');
      link.download = `${documentTitle.replace(/\s+/g, '_').toLowerCase()}.${extension}`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error(`Error generating ${format.toUpperCase()}:`, error);
    } finally {
      setIsExporting(false);
      setExportFormat(null);
    }
  };

  const handleCopyToClipboard = async () => {
    if (!documentRef.current) return;
    
    try {
      // Get the text content of the document
      const textContent = documentRef.current.innerText;
      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="relative printable-document-wrapper">
      {/* Action Buttons - Hidden when printing */}
      {showActions && (
        <div className="flex flex-wrap justify-end gap-2 mb-4 print:hidden no-print">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleCopyToClipboard}
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-slate-900"
                  disabled={isExporting}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-green-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Text
                    </>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy document text</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="bg-white dark:bg-slate-900"
                  disabled={isExporting}
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print or save as PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-blue-800 to-emerald-600 hover:from-blue-800/90 hover:to-emerald-600/90 text-white"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleDownloadPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Download as PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDownloadImage('png')}>
                <FileImage className="h-4 w-4 mr-2" />
                Download as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownloadImage('jpeg')}>
                <FileImage className="h-4 w-4 mr-2" />
                Download as JPEG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Document Preview Container - This is what gets printed/downloaded */}
      <div
        ref={documentRef}
        className={`document-content-only bg-white dark:bg-slate-900 rounded-lg shadow-xl p-8 ${className}`}
        data-document-type={documentType}
        data-document-title={documentTitle}
      >
        {children}
      </div>
    </div>
  );
}

// Utility function to format dates for documents
export function formatDocumentDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Utility function to format currency for documents
export function formatDocumentCurrency(
  amount: number,
  currency: string = 'USD'
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Utility function to format numbers for documents
export function formatDocumentNumber(
  number: number,
  decimals: number = 2
): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(number);
}
