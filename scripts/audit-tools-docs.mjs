import { toolCategories, documentCategories } from '../src/lib/constants/tools.ts';
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('src');

function walkPageRoutes(dir, skip = []) {
  const routes = [];
  if (!fs.existsSync(dir)) return routes;
  function walk(current, rel) {
    for (const ent of fs.readdirSync(current, { withFileTypes: true })) {
      if (skip.some((s) => ent.name.includes(s))) continue;
      const p = path.join(current, ent.name);
      const r = rel ? `${rel}/${ent.name}` : ent.name;
      if (ent.isDirectory()) walk(p, r);
      else if (ent.name === 'page.tsx' && rel) routes.push({ route: rel.replace(/\\/g, '/'), file: p });
    }
  }
  walk(dir, '');
  return routes;
}

function pageHasWorkingTool(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (/coming soon|under construction|not yet available/i.test(content)) return false;
  return /@\/components\/tools\//.test(content) || /from ['"]@\/components\/tools/.test(content);
}

function pageHasDocumentGenerator(file) {
  const content = fs.readFileSync(file, 'utf8');
  if (/coming soon|under construction/i.test(content)) return false;
  return (
    /DocumentGenerator|from ['"]@\/components\/documents\//i.test(content) ||
    /Generator from ['"]@\/components\/documents/i.test(content)
  );
}

const toolPages = walkPageRoutes(path.join(ROOT, 'app/tools'), ['[...slug]', '[categorySlug]']);
const docPages = walkPageRoutes(path.join(ROOT, 'app/documents'), ['[...slug]', '[categorySlug]']);
const docCategoryPages = docPages.filter((p) => p.route.includes('/'));

const catalogTools = toolCategories.flatMap((c) =>
  c.tools.map((t) => ({ module: c.slug, slug: t.slug, name: t.name }))
);

const workingTools = [];
const partialTools = [];
const missingTools = [];

for (const t of catalogTools) {
  const routeKey = `${t.module}/${t.slug}`;
  const page = toolPages.find((p) => p.route === routeKey || p.route === t.slug);
  if (!page) {
    missingTools.push({ ...t, reason: 'no page' });
    continue;
  }
  if (pageHasWorkingTool(page.file)) workingTools.push({ ...t, route: page.route });
  else partialTools.push({ ...t, route: page.route, reason: 'page without tool component' });
}

const catalogDocs = documentCategories.flatMap((c) =>
  c.documents.map((d) => ({ category: c.slug, categoryName: c.name, slug: d.slug, name: d.name }))
);

const workingDocs = [];
const stubDocs = [];
const missingDocs = [];

for (const d of catalogDocs) {
  const candidates = [
    d.slug,
    `${d.category}/${d.slug}`,
    `international-trade/${d.slug}`,
    `ocean-freight/${d.slug}`,
    `customs/${d.slug}`,
    `air-freight/${d.slug}`,
    `documents/${d.slug}`,
  ];
  const page =
    docPages.find((p) => candidates.includes(p.route)) ||
    toolPages.find((p) => p.route === `documents/${d.slug}` || p.route.endsWith(`/${d.slug}`) && p.route.includes('documents'));

  if (!page) {
    missingDocs.push(d);
    continue;
  }
  if (pageHasDocumentGenerator(page.file)) workingDocs.push({ ...d, route: page.route });
  else stubDocs.push({ ...d, route: page.route });
}

console.log(
  JSON.stringify(
    {
      summary: {
        toolsCatalog: catalogTools.length,
        toolsFullyWorking: workingTools.length,
        toolsPartialOrStub: partialTools.length,
        toolsMissingPage: missingTools.length,
        documentsCatalog: catalogDocs.length,
        documentsWithGenerator: workingDocs.length,
        documentsStubOnly: stubDocs.length,
        documentsMissingPage: missingDocs.length,
        documentCategoryPagesOnly: docCategoryPages.length,
      },
      workingTools: workingTools.map((t) => `${t.module}/${t.slug}`),
      partialTools: partialTools.map((t) => ({ route: t.route, name: t.name, reason: t.reason })),
      missingTools: missingTools.map((t) => `${t.module}/${t.slug}`),
      workingDocuments: workingDocs.map((d) => `${d.route} (${d.name})`),
      stubDocuments: stubDocs.map((d) => `${d.route} (${d.name})`),
      missingDocuments: missingDocs.map((d) => `${d.category}/${d.slug} (${d.name})`),
    },
    null,
    2
  )
);
