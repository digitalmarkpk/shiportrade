"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { glossaryTerms } from "@/lib/constants/tools";

interface GlossaryTooltipProps {
  term: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function GlossaryTooltip({ term, children, showIcon = false }: GlossaryTooltipProps) {
  const termKey = term.toLowerCase().replace(/[-\s]/g, "");
  const definition = glossaryTerms[termKey] || glossaryTerms[term.toLowerCase() as keyof typeof glossaryTerms];
  
  if (!definition) {
    return <>{children}</>;
  }
  
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-1 cursor-help border-b border-dashed border-[var(--ocean)]/50 text-[var(--ocean)] hover:text-[var(--ocean)]/80 transition-colors">
            {children}
            {showIcon && <Info className="h-3 w-3 opacity-50" />}
          </span>
        </TooltipTrigger>
        <TooltipContent 
          side="top" 
          className="max-w-xs p-3 bg-white dark:bg-gray-900 border shadow-lg"
          sideOffset={5}
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="font-semibold text-sm mb-1">{definition.term}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {definition.definition}
            </p>
          </motion.div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Higher-order component to wrap text with glossary terms
interface GlossaryTextProps {
  text: string;
}

export function GlossaryText({ text }: GlossaryTextProps) {
  // Find and replace glossary terms in text
  const terms = Object.keys(glossaryTerms);
  
  // Sort by length (longest first) to avoid partial replacements
  const sortedTerms = terms.sort((a, b) => b.length - a.length);
  
  let result: React.ReactNode[] = [text];
  
  sortedTerms.forEach((termKey) => {
    const term = glossaryTerms[termKey as keyof typeof glossaryTerms];
    if (!term) return;
    
    const regex = new RegExp(`\\b(${term.term})\\b`, "gi");
    
    result = result.flatMap((node) => {
      if (typeof node !== "string") return node;
      
      const parts = node.split(regex);
      
      return parts.map((part, index) => {
        if (regex.test(part)) {
          return (
            <GlossaryTooltip key={`${termKey}-${index}`} term={termKey}>
              {part}
            </GlossaryTooltip>
          );
        }
        return part;
      });
    });
  });
  
  return <>{result}</>;
}

// Glossary sidebar component for Learning Centers
export function GlossarySidebar() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTerms = Object.entries(glossaryTerms).filter(([key, value]) => 
    value.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    value.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Info className="h-5 w-5 text-[var(--ocean)]" />
        Supply Chain Glossary
      </h3>
      
      <input
        type="text"
        placeholder="Search terms..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-[var(--ocean)]/50"
      />
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {filteredTerms.map(([key, value]) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <p className="font-medium text-sm">{value.term}</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {value.definition}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
