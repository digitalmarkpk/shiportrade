/**
 * Single source of truth for platform counts (derived from tools.ts catalog).
 * Update toolCategories / documentCategories only — UI and SEO follow automatically.
 */
import {
  totalToolsCount,
  totalDocumentsCount,
  totalDocumentCategoriesCount,
  toolCategories,
} from "@/lib/constants/tools";

export const PLATFORM_STATS = {
  tools: totalToolsCount,
  documents: totalDocumentsCount,
  modules: toolCategories.length,
  documentCategories: totalDocumentCategoriesCount,
} as const;

export type PlatformStatKey = keyof typeof PLATFORM_STATS;

/** Exact count, e.g. "190" */
export function statCount(key: PlatformStatKey): string {
  return String(PLATFORM_STATS[key]);
}

/** Count with "+" suffix for compact labels, e.g. "190+" */
export function statCountPlus(key: PlatformStatKey): string {
  return `${PLATFORM_STATS[key]}+`;
}

export const META_PLATFORM_DESCRIPTION = `The ultimate platform for global logistics, trade finance, and supply chain management. ${PLATFORM_STATS.tools} calculators, ${PLATFORM_STATS.documents} document generators, and comprehensive trade intelligence.`;

export const META_TOOLS_DESCRIPTION = `${PLATFORM_STATS.tools} free professional calculators and tools for international trade, ocean freight, air cargo, customs compliance, warehousing, and e-commerce. Accurate, reliable, and trusted by logistics professionals worldwide.`;

export const META_DOCUMENTS_DESCRIPTION = `${PLATFORM_STATS.documents} free professional document generators for international trade. Create commercial invoices, bills of lading, packing lists, certificates of origin, and more. Export to PDF, DOCX, or XLSX.`;

export const META_MODULES_DESCRIPTION = `Master ${PLATFORM_STATS.modules} specialized logistics modules with ${PLATFORM_STATS.tools} calculators, ${PLATFORM_STATS.documents} document templates, and expert educational resources for supply chain professionals.`;

export const platformTaglineShort = `${PLATFORM_STATS.tools} calculators · ${PLATFORM_STATS.documents} documents · ${PLATFORM_STATS.modules} modules`;
