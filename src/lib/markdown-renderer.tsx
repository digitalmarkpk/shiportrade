'use client';

import React from 'react';

// Known company websites for auto-linking
const COMPANY_WEBSITES: Record<string, string> = {
  // Meat Exporters
  'jbs': 'jbs.com.br',
  'tyson foods': 'tysonfoods.com',
  'cargill': 'cargill.com',
  'brf': 'brf-br.com',
  'nh foods': 'nhfoods.co.jp',
  'vion': 'vionfoodgroup.com',
  'danish crown': 'danishcrown.com',
  'marfrig': 'marfrig.com.br',
  'minerva': 'minervafoods.com',
  ' hormel': 'hormel.com',
  
  // Shipping Companies
  'maersk': 'maersk.com',
  'msc': 'msc.com',
  'cma cgm': 'cma-cgm.com',
  'cosco': 'coscoshipping.com',
  'hapag-lloyd': 'hapag-lloyd.com',
  'one': 'one-line.com',
  'evergreen': 'evergreen-marine.com',
  'hmm': 'hmm21.com',
  'yang ming': 'yangming.com',
  'zim': 'zim.com',
  
  // Tech Companies
  'apple': 'apple.com',
  'microsoft': 'microsoft.com',
  'google': 'google.com',
  'amazon': 'amazon.com',
  'meta': 'meta.com',
  'tesla': 'tesla.com',
  
  // General Trading
  'glencore': 'glencore.com',
  'trafigura': 'trafigura.com',
  'vitol': 'vitol.com',
  'gunvor': 'gunvorgroup.com',
  'mercuria': 'mercuria.com',
};

// Find company website
function findCompanyWebsite(name: string): string | null {
  const lowerName = name.toLowerCase().trim();
  
  // Direct match
  if (COMPANY_WEBSITES[lowerName]) {
    return `https://${COMPANY_WEBSITES[lowerName]}`;
  }
  
  // Partial match
  for (const [key, domain] of Object.entries(COMPANY_WEBSITES)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return `https://${domain}`;
    }
  }
  
  // Try to construct from name
  if (name.length > 2) {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
    return `https://www.google.com/search?q=${encodeURIComponent(name + ' company official website')}`;
  }
  
  return null;
}

// Parse markdown text and render as React elements
export function renderMarkdown(text: string, companies?: any[]): React.ReactNode {
  if (!text) return null;

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  let keyIndex = 0;

  // Build company lookup for highlighting
  const companyNames = companies?.map(c => c.name?.toLowerCase()).filter(Boolean) || [];

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${keyIndex++}`} className="list-disc list-inside space-y-2 pl-4 my-4 text-slate-700 dark:text-slate-300">
            {currentList.items.map((item, i) => (
              <li key={i} className="leading-relaxed">{parseInlineFormatting(item, companyNames)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${keyIndex++}`} className="list-decimal list-inside space-y-2 pl-4 my-4 text-slate-700 dark:text-slate-300">
            {currentList.items.map((item, i) => (
              <li key={i} className="leading-relaxed">{parseInlineFormatting(item, companyNames)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Empty line
    if (!line.trim()) {
      flushList();
      continue;
    }

    // H3 header (###)
    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h4 key={`h3-${keyIndex++}`} className="text-base font-semibold mt-5 mb-2 text-[#0F4C81] dark:text-blue-400">
          {parseInlineFormatting(line.slice(4), companyNames)}
        </h4>
      );
      continue;
    }

    // H2 header (##)
    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h3 key={`h2-${keyIndex++}`} className="text-lg font-semibold mt-6 mb-3 text-[#0F4C81] dark:text-blue-400 border-b border-slate-200 dark:border-slate-700 pb-2">
          {parseInlineFormatting(line.slice(3), companyNames)}
        </h3>
      );
      continue;
    }

    // H1 header (#)
    if (line.startsWith('# ')) {
      flushList();
      elements.push(
        <h2 key={`h1-${keyIndex++}`} className="text-xl font-bold mt-6 mb-4 text-slate-900 dark:text-white">
          {parseInlineFormatting(line.slice(2), companyNames)}
        </h2>
      );
      continue;
    }

    // Unordered list item (- or *)
    if (line.startsWith('- ') || line.startsWith('* ')) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(line.slice(2));
      continue;
    }

    // Numbered list item (1., 2., etc.)
    const numberedMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numberedMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numberedMatch[2]);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${keyIndex++}`} className="text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
        {parseInlineFormatting(line, companyNames)}
      </p>
    );
  }

  flushList();
  return elements;
}

// Parse inline formatting (bold, italic, code, company names)
function parseInlineFormatting(text: string, companyNames: string[] = []): React.ReactNode {
  if (!text) return text;

  const parts: React.ReactNode[] = [];
  let remaining = text;
  let partKey = 0;

  // Combine all patterns to find
  const patterns = [
    { regex: /\*\*(.+?)\*\*/g, type: 'bold' },
    { regex: /\*(.+?)\*/g, type: 'italic' },
    { regex: /`(.+?)`/g, type: 'code' },
  ];

  while (remaining) {
    // Find all potential matches
    interface Match {
      type: string;
      text: string;
      index: number;
      fullMatch: string;
    }
    
    const allMatches: Match[] = [];
    
    // Bold
    const boldMatch = /\*\*(.+?)\*\*/g.exec(remaining);
    if (boldMatch) {
      allMatches.push({ type: 'bold', text: boldMatch[1], index: boldMatch.index, fullMatch: boldMatch[0] });
    }
    
    // Italic (not inside bold)
    const italicMatch = /(?<!\*)\*([^*]+?)\*(?!\*)/g.exec(remaining);
    if (italicMatch) {
      allMatches.push({ type: 'italic', text: italicMatch[1], index: italicMatch.index, fullMatch: italicMatch[0] });
    }
    
    // Code
    const codeMatch = /`(.+?)`/g.exec(remaining);
    if (codeMatch) {
      allMatches.push({ type: 'code', text: codeMatch[1], index: codeMatch.index, fullMatch: codeMatch[0] });
    }
    
    // Company names - check for known companies
    for (const companyName of companyNames) {
      const companyRegex = new RegExp(`\\b(${escapeRegex(companyName)})\\b`, 'gi');
      const companyMatch = companyRegex.exec(remaining);
      if (companyMatch) {
        allMatches.push({ type: 'company', text: companyMatch[1], index: companyMatch.index, fullMatch: companyMatch[0] });
      }
    }
    
    // Also check for capitalized words that might be companies
    const capWordMatch = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g.exec(remaining);
    if (capWordMatch && capWordMatch[1].length > 3) {
      const word = capWordMatch[1];
      const website = findCompanyWebsite(word);
      if (website && !allMatches.find(m => m.index === capWordMatch.index)) {
        allMatches.push({ type: 'company', text: word, index: capWordMatch.index, fullMatch: capWordMatch[0] });
      }
    }

    if (allMatches.length === 0) {
      // No more matches, add remaining text
      parts.push(remaining);
      break;
    }

    // Find earliest match
    const earliest = allMatches.reduce((a, b) => a.index < b.index ? a : b);

    // Add text before match
    if (earliest.index > 0) {
      parts.push(remaining.slice(0, earliest.index));
    }

    // Add the formatted element
    if (earliest.type === 'bold') {
      parts.push(<strong key={`b-${partKey++}`} className="font-semibold text-slate-900 dark:text-white">{earliest.text}</strong>);
    } else if (earliest.type === 'italic') {
      parts.push(<em key={`i-${partKey++}`}>{earliest.text}</em>);
    } else if (earliest.type === 'code') {
      parts.push(
        <code key={`c-${partKey++}`} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-sm font-mono text-[#0F4C81]">
          {earliest.text}
        </code>
      );
    } else if (earliest.type === 'company') {
      const website = findCompanyWebsite(earliest.text);
      if (website) {
        parts.push(
          <a
            key={`company-${partKey++}`}
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0F4C81] dark:text-blue-400 hover:text-[#2E8B57] font-semibold hover:underline underline-offset-2 inline-flex items-center gap-0.5"
          >
            {earliest.text}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        );
      } else {
        parts.push(
          <span key={`company-${partKey++}`} className="font-semibold text-slate-900 dark:text-white">
            {earliest.text}
          </span>
        );
      }
    }

    // Continue with remaining text
    remaining = remaining.slice(earliest.index + earliest.fullMatch.length);
  }

  return parts.length > 0 ? parts : text;
}

function escapeRegex(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Extract specific sections from markdown
export function extractSection(text: string, sectionTitle: string): string | null {
  const lines = text.split('\n');
  let inSection = false;
  let sectionContent: string[] = [];

  for (const line of lines) {
    if (line.startsWith('## ') || line.startsWith('# ')) {
      if (inSection) break; // End of section
      if (line.toLowerCase().includes(sectionTitle.toLowerCase())) {
        inSection = true;
        continue;
      }
    }
    if (inSection) {
      sectionContent.push(line);
    }
  }

  return sectionContent.join('\n').trim() || null;
}
