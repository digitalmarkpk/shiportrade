'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Package, Tag, Globe, Info, AlertTriangle, BookOpen, ChevronRight, FileText, ArrowRight,
  Download, Share2, BarChart3, HelpCircle, Layers, TrendingUp, Shield, CheckCircle2,
  ArrowUpRight, Sparkles, Building, Users, ClipboardCheck, Lightbulb, XCircle, RefreshCw,
  Zap, Target, FileSearch, Scale, AlertCircle, Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

interface HSCodeResult {
  hsCode: string;
  description: string;
  chapter: string;
  heading: string;
  subheading: string;
  dutyRate: {
    us: string;
    eu: string;
    cn: string;
  };
  restrictions: string[];
  relatedCodes: {
    code: string;
    description: string;
  }[];
  classificationNotes: string;
}

// Complete HS Code database (sample)
const hsCodeDatabase: HSCodeResult[] = [
  {
    hsCode: '8471.30',
    description: 'Portable digital automatic data processing machines, weighing not more than 10 kg, consisting of at least a central processing unit, a keyboard and a display',
    chapter: '84: Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof',
    heading: '8471: Automatic data processing machines and units thereof',
    subheading: '8471.30: Portable computers',
    dutyRate: { us: '0%', eu: '0%', cn: '0%' },
    restrictions: ['None for most countries', 'Export license required for certain destinations'],
    relatedCodes: [
      { code: '8471.41', description: 'Other digital ADP machines, comprising in the same housing at least a CPU and an input/output unit' },
      { code: '8471.49', description: 'Other digital ADP machines' },
    ],
    classificationNotes: 'Includes laptops, notebooks, and tablet computers with keyboard. Does not include tablets without detachable keyboards.',
  },
  {
    hsCode: '6203.42',
    description: 'Men\'s or boys\' trousers, bib and brace overalls, breeches and shorts, of cotton',
    chapter: '62: Articles of apparel and clothing accessories, not knitted or crocheted',
    heading: '6203: Men\'s or boys\' suits, ensembles, jackets, blazers, trousers, bib and brace overalls, breeches and shorts',
    subheading: '6203.42: Trousers, bib and brace overalls, breeches and shorts, of cotton',
    dutyRate: { us: '16.6%', eu: '12%', cn: '17%' },
    restrictions: ['Quota restrictions may apply', 'Certificate of origin required for preferential rates'],
    relatedCodes: [
      { code: '6203.43', description: 'Of synthetic fibres' },
      { code: '6203.49', description: 'Of other textile materials' },
    ],
    classificationNotes: 'Applies to men\'s and boys\' trousers made of cotton, not knitted or crocheted. For knitted/crocheted items, see Chapter 61.',
  },
  {
    hsCode: '8517.12',
    description: 'Smartphones and mobile phones',
    chapter: '85: Electrical machinery and equipment and parts thereof',
    heading: '8517: Electrical apparatus for line telephony or line telegraphy',
    subheading: '8517.12: Telephones for cellular networks or for other wireless networks',
    dutyRate: { us: '0%', eu: '0%', cn: '0%' },
    restrictions: ['FCC certification required (US)', 'CE marking required (EU)', 'MIIT approval (CN)'],
    relatedCodes: [
      { code: '8517.62', description: 'Other apparatus for transmission or reception of voice, images or other data' },
      { code: '8525.60', description: 'Transmission apparatus incorporating reception apparatus' },
    ],
    classificationNotes: 'Includes all smartphones and feature phones capable of connecting to cellular networks.',
  },
  {
    hsCode: '3926.90',
    description: 'Other articles of plastics and articles of other materials of headings 3901 to 3914',
    chapter: '39: Plastics and articles thereof',
    heading: '3926: Other articles of plastics and articles of other materials',
    subheading: '3926.90: Other articles',
    dutyRate: { us: '5.3%', eu: '6.5%', cn: '10%' },
    restrictions: ['Material composition certificate may be required'],
    relatedCodes: [
      { code: '3926.10', description: 'Office or school supplies' },
      { code: '3926.20', description: 'Articles of apparel and clothing accessories' },
    ],
    classificationNotes: 'Catch-all heading for plastic articles not elsewhere specified. Often used for custom plastic products.',
  },
  {
    hsCode: '9503.00',
    description: 'Toys, games and sports requisites; parts and accessories thereof',
    chapter: '95: Toys, games and sports requisites; parts and accessories thereof',
    heading: '9503: Toys and games',
    subheading: '9503.00: Tricycles, scooters, pedal cars and similar wheeled toys; dolls\' carriages; dolls; other toys',
    dutyRate: { us: '0%', eu: '0%', cn: '0%' },
    restrictions: ['Safety standards certification required (ASTM F963 for US, EN71 for EU)', 'Age labeling requirements'],
    relatedCodes: [
      { code: '9504.40', description: 'Video games and articles for funfair, table or parlour games' },
      { code: '9506.99', description: 'Other sports and outdoor games equipment' },
    ],
    classificationNotes: 'Covers most children\'s toys and games. Video game consoles are classified under 9504.',
  },
  {
    hsCode: '7326.90',
    description: 'Other articles of iron or steel',
    chapter: '73: Articles of iron or steel',
    heading: '7326: Other articles of iron or steel',
    subheading: '7326.90: Other articles',
    dutyRate: { us: '3%', eu: '2.7%', cn: '8%' },
    restrictions: ['Anti-dumping duties may apply for certain products from specific countries'],
    relatedCodes: [
      { code: '7326.11', description: 'Grindstones, polishing stones and the like, of iron or steel' },
      { code: '7326.19', description: 'Other articles of non-malleable cast iron' },
    ],
    classificationNotes: 'Catch-all for iron/steel articles not elsewhere specified. Often requires material certification.',
  },
];

// Complete HS Chapters with all 99 chapters organized by section
const hsSections = [
  {
    section: 'I',
    name: 'Live Animals; Animal Products',
    chapters: [
      { code: '01', name: 'Live animals' },
      { code: '02', name: 'Meat and edible meat offal' },
      { code: '03', name: 'Fish and crustaceans, molluscs and other aquatic invertebrates' },
      { code: '04', name: 'Dairy produce; birds\' eggs; natural honey' },
      { code: '05', name: 'Products of animal origin, not elsewhere specified' },
    ]
  },
  {
    section: 'II',
    name: 'Vegetable Products',
    chapters: [
      { code: '06', name: 'Live trees and other plants; bulbs, roots and the like' },
      { code: '07', name: 'Edible vegetables and certain roots and tubers' },
      { code: '08', name: 'Edible fruit and nuts; peel of citrus fruit or melons' },
      { code: '09', name: 'Coffee, tea, maté and spices' },
      { code: '10', name: 'Cereals' },
      { code: '11', name: 'Products of the milling industry; malt; starches' },
      { code: '12', name: 'Oil seeds and oleaginous fruits; miscellaneous grains' },
      { code: '13', name: 'Lac; gums, resins and other vegetable saps and extracts' },
      { code: '14', name: 'Vegetable plaiting materials; vegetable products' },
    ]
  },
  {
    section: 'III',
    name: 'Animal or Vegetable Fats and Oils',
    chapters: [
      { code: '15', name: 'Animal or vegetable fats and oils and their cleavage products' },
    ]
  },
  {
    section: 'IV',
    name: 'Prepared Foodstuffs; Beverages, Spirits and Vinegar; Tobacco',
    chapters: [
      { code: '16', name: 'Preparations of meat, of fish or of crustaceans, molluscs' },
      { code: '17', name: 'Sugars and sugar confectionery' },
      { code: '18', name: 'Cocoa and cocoa preparations' },
      { code: '19', name: 'Preparations of cereals, flour, starch or milk; pastrycooks\' products' },
      { code: '20', name: 'Preparations of vegetables, fruit, nuts or other parts of plants' },
      { code: '21', name: 'Miscellaneous edible preparations' },
      { code: '22', name: 'Beverages, spirits and vinegar' },
      { code: '23', name: 'Residues and waste from the food industries; prepared animal fodder' },
      { code: '24', name: 'Tobacco and manufactured tobacco substitutes' },
    ]
  },
  {
    section: 'V',
    name: 'Mineral Products',
    chapters: [
      { code: '25', name: 'Salt; sulphur; earths and stone; plastering materials, lime and cement' },
      { code: '26', name: 'Ores, slag and ash' },
      { code: '27', name: 'Mineral fuels, mineral oils and products of their distillation' },
    ]
  },
  {
    section: 'VI',
    name: 'Products of the Chemical or Allied Industries',
    chapters: [
      { code: '28', name: 'Inorganic chemicals; organic or inorganic compounds of precious metals' },
      { code: '29', name: 'Organic chemicals' },
      { code: '30', name: 'Pharmaceutical products' },
      { code: '31', name: 'Fertilisers' },
      { code: '32', name: 'Tanning or dyeing extracts; tannins and their derivatives' },
      { code: '33', name: 'Essential oils and resinoids; perfumery, cosmetic or toilet preparations' },
      { code: '34', name: 'Soap, organic surface-active agents, washing preparations' },
      { code: '35', name: 'Albuminoidal substances; modified starches; glues; enzymes' },
      { code: '36', name: 'Explosives; pyrotechnic products; matches; pyrophoric alloys' },
      { code: '37', name: 'Photographic or cinematographic goods' },
      { code: '38', name: 'Miscellaneous chemical products' },
    ]
  },
  {
    section: 'VII',
    name: 'Plastics and Articles Thereof; Rubber and Articles Thereof',
    chapters: [
      { code: '39', name: 'Plastics and articles thereof' },
      { code: '40', name: 'Rubber and articles thereof' },
    ]
  },
  {
    section: 'VIII',
    name: 'Raw Hides and Skins, Leather, Furskins and Articles Thereof',
    chapters: [
      { code: '41', name: 'Raw hides and skins (other than furskins) and leather' },
      { code: '42', name: 'Articles of leather; saddlery and harness; travel goods, handbags' },
      { code: '43', name: 'Furskins and artificial fur; manufactures thereof' },
    ]
  },
  {
    section: 'IX',
    name: 'Wood and Articles of Wood; Wood Charcoal; Cork and Articles of Cork',
    chapters: [
      { code: '44', name: 'Wood and articles of wood; wood charcoal' },
      { code: '45', name: 'Cork and articles of cork' },
      { code: '46', name: 'Manufactures of straw, of esparto or of other plaiting materials' },
    ]
  },
  {
    section: 'X',
    name: 'Pulp of Wood or of Other Fibrous Material; Paper and Paperboard',
    chapters: [
      { code: '47', name: 'Pulp of wood or of other fibrous cellulosic material; recovered paper' },
      { code: '48', name: 'Paper and paperboard; articles of paper pulp, of paper or of paperboard' },
      { code: '49', name: 'Printed books, newspapers, pictures and other products of the printing industry' },
    ]
  },
  {
    section: 'XI',
    name: 'Textiles and Textile Articles',
    chapters: [
      { code: '50', name: 'Silk' },
      { code: '51', name: 'Wool, fine or coarse animal hair; horsehair yarn and woven fabric' },
      { code: '52', name: 'Cotton' },
      { code: '53', name: 'Other vegetable textile fibres; paper yarn and woven fabrics of paper yarn' },
      { code: '54', name: 'Man-made filaments; strip and the like of man-made textile materials' },
      { code: '55', name: 'Man-made staple fibres' },
      { code: '56', name: 'Wadding, felt and nonwovens; special yarns; twine, cordage, ropes' },
      { code: '57', name: 'Carpets and other textile floor coverings' },
      { code: '58', name: 'Special woven or tufted fabric; lace; tapestries; trimmings; embroidery' },
      { code: '59', name: 'Impregnated, coated, covered or laminated textile fabrics' },
      { code: '60', name: 'Knitted or crocheted fabrics' },
      { code: '61', name: 'Articles of apparel and clothing accessories, knitted or crocheted' },
      { code: '62', name: 'Articles of apparel and clothing accessories, not knitted or crocheted' },
      { code: '63', name: 'Other made up textile articles; sets; worn clothing and worn textile articles' },
    ]
  },
  {
    section: 'XII',
    name: 'Footwear, Headgear, Umbrellas, Sun Umbrellas, Walking-Sticks',
    chapters: [
      { code: '64', name: 'Footwear, gaiters and the like; parts of such articles' },
      { code: '65', name: 'Headgear and parts thereof' },
      { code: '66', name: 'Umbrellas, sun umbrellas, walking-sticks, seat-sticks, whips' },
      { code: '67', name: 'Prepared feathers and down and articles made of feathers or of down' },
    ]
  },
  {
    section: 'XIII',
    name: 'Articles of Stone, Plaster, Cement, Asbestos, Mica or Similar Materials',
    chapters: [
      { code: '68', name: 'Articles of stone, plaster, cement, asbestos, mica or similar materials' },
      { code: '69', name: 'Ceramic products' },
      { code: '70', name: 'Glass and glassware' },
    ]
  },
  {
    section: 'XIV',
    name: 'Natural or Cultured Pearls, Precious or Semi-Precious Stones',
    chapters: [
      { code: '71', name: 'Natural or cultured pearls, precious or semi-precious stones, precious metals' },
    ]
  },
  {
    section: 'XV',
    name: 'Base Metals and Articles of Base Metal',
    chapters: [
      { code: '72', name: 'Iron and steel' },
      { code: '73', name: 'Articles of iron or steel' },
      { code: '74', name: 'Copper and articles thereof' },
      { code: '75', name: 'Nickel and articles thereof' },
      { code: '76', name: 'Aluminium and articles thereof' },
      { code: '77', name: 'Magnesium and beryllium and articles thereof' },
      { code: '78', name: 'Lead and articles thereof' },
      { code: '79', name: 'Zinc and articles thereof' },
      { code: '80', name: 'Tin and articles thereof' },
      { code: '81', name: 'Other base metals; cermets; articles thereof' },
      { code: '82', name: 'Tools, implements, cutlery, spoons and forks, of base metal' },
      { code: '83', name: 'Miscellaneous articles of base metal' },
    ]
  },
  {
    section: 'XVI',
    name: 'Machinery and Mechanical Appliances; Electrical Equipment',
    chapters: [
      { code: '84', name: 'Nuclear reactors, boilers, machinery and mechanical appliances' },
      { code: '85', name: 'Electrical machinery and equipment and parts thereof' },
    ]
  },
  {
    section: 'XVII',
    name: 'Vehicles, Aircraft, Vessels and Associated Transport Equipment',
    chapters: [
      { code: '86', name: 'Railway or tramway locomotives, rolling-stock and parts thereof' },
      { code: '87', name: 'Vehicles other than railway or tramway rolling-stock, and parts thereof' },
      { code: '88', name: 'Aircraft, spacecraft, and parts thereof' },
      { code: '89', name: 'Ships, boats and floating structures' },
    ]
  },
  {
    section: 'XVIII',
    name: 'Optical, Photographic, Cinematographic, Measuring, Checking Instruments',
    chapters: [
      { code: '90', name: 'Optical, photographic, cinematographic, measuring, checking instruments' },
      { code: '91', name: 'Clocks and watches and parts thereof' },
      { code: '92', name: 'Musical instruments; parts and accessories of such articles' },
    ]
  },
  {
    section: 'XIX',
    name: 'Arms and Ammunition; Parts and Accessories Thereof',
    chapters: [
      { code: '93', name: 'Arms and ammunition; parts and accessories thereof' },
    ]
  },
  {
    section: 'XX',
    name: 'Miscellaneous Manufactured Articles',
    chapters: [
      { code: '94', name: 'Furniture; bedding, mattresses, mattress supports, cushions' },
      { code: '95', name: 'Toys, games and sports requisites; parts and accessories thereof' },
      { code: '96', name: 'Miscellaneous manufactured articles' },
    ]
  },
  {
    section: 'XXI',
    name: 'Works of Art, Collectors\' Pieces and Antiques',
    chapters: [
      { code: '97', name: 'Works of art, collectors\' pieces and antiques' },
      { code: '98', name: 'Special classification provisions (US-specific)' },
      { code: '99', name: 'Special classification provisions (country-specific)' },
    ]
  },
];

// GRI - General Rules of Interpretation
const griRules = [
  {
    rule: 'GRI 1',
    title: 'Classification by Terms of Headings',
    description: 'Classification is determined legally by the terms of the headings and any relative Section or Chapter Notes. If goods fit clearly within a heading, they are classified there without reference to other rules.',
    example: 'A complete bicycle is classified under heading 8712 (Bicycles) based on the heading text alone.',
  },
  {
    rule: 'GRI 2(a)',
    title: 'Incomplete or Unfinished Articles',
    description: 'Any reference in a heading to an article shall be taken to include a reference to that article incomplete or unfinished, provided that, as entered, the incomplete or unfinished article has the essential character of the complete or finished article.',
    example: 'An unassembled bicycle frame with all parts provided has the essential character of a bicycle and is classified as such.',
  },
  {
    rule: 'GRI 2(b)',
    title: 'Mixtures and Combinations',
    description: 'Any reference in a heading to a material or substance shall be taken to include a reference to mixtures or combinations of that material or substance with other materials or substances.',
    example: 'A heading for "cotton" includes cotton blended with other fibers, but classification may shift based on predominant material.',
  },
  {
    rule: 'GRI 3(a)',
    title: 'Most Specific Description',
    description: 'When goods are prima facie classifiable under two or more headings, the heading which provides the most specific description shall be preferred to headings providing a more general description.',
    example: 'A dedicated camera is classified under cameras (9006) rather than the more general optical instruments heading.',
  },
  {
    rule: 'GRI 3(b)',
    title: 'Essential Character (Composites)',
    description: 'Mixtures, composite goods consisting of different materials or made up of different components, and goods put up in sets for retail sale shall be classified as if they consisted of the material or component which gives them their essential character.',
    example: 'A gift set containing coffee, a mug, and chocolates - the coffee (heading 0901) gives the set its essential character.',
  },
  {
    rule: 'GRI 3(c)',
    title: 'Heading Occurring Last in Numerical Order',
    description: 'When goods cannot be classified by reference to GRI 3(a) or 3(b), they shall be classified under the heading which occurs last in numerical order among those which equally merit consideration.',
    example: 'If a product could equally fall under heading 3926 (plastics) or 8479 (machines), it would be classified under 8479.',
  },
  {
    rule: 'GRI 4',
    title: 'Goods Not Classified Elsewhere',
    description: 'Goods which cannot be classified in accordance with the above rules shall be classified under the heading appropriate to the goods to which they are most similar.',
    example: 'Novel products without a clear heading are classified by similarity to existing classified goods.',
  },
  {
    rule: 'GRI 5(a)',
    title: 'Containers and Packaging (Reusable)',
    description: 'Camera cases, musical instrument cases, gun cases, drawing instrument cases, necklace cases and similar containers, specially shaped or fitted to contain a specific article or set of articles, suitable for long-term use and entered with the article, shall be classified with such articles.',
    example: 'A professional camera case sold with a camera is classified with the camera, not separately as a container.',
  },
  {
    rule: 'GRI 5(b)',
    title: 'Containers and Packaging (Standard)',
    description: 'Subject to the provisions of GRI 5(a), packing materials and packing containers entered with the goods therein shall be classified with the goods if they are of a kind normally used for packing such goods.',
    example: 'A cardboard box containing shoes is classified with the shoes, not separately as packaging.',
  },
  {
    rule: 'GRI 6',
    title: 'Subheading Classification',
    description: 'For legal purposes, classification of goods in the subheadings of a heading shall be determined according to the terms of those subheadings and any related Subheading Notes. Mutatis mutandis, the principles of GRIs 1-5 apply.',
    example: 'Within heading 8471 (computers), laptops are classified under subheading 8471.30, not generic 8471.49.',
  },
];

// Sample duty rates by chapter
const dutyRatesByChapter = [
  { chapter: '01-05', category: 'Animal Products', usMin: 0, usMax: 26, euMin: 0, euMax: 189 },
  { chapter: '06-14', category: 'Vegetable Products', usMin: 0, usMax: 164, euMin: 0, euMax: 189 },
  { chapter: '15', category: 'Fats & Oils', usMin: 0, usMax: 18, euMin: 0, euMax: 13 },
  { chapter: '16-24', category: 'Foodstuffs', usMin: 0, usMax: 164, euMin: 0, euMax: 234 },
  { chapter: '25-27', category: 'Mineral Products', usMin: 0, usMax: 13, euMin: 0, euMax: 10 },
  { chapter: '28-38', category: 'Chemicals', usMin: 0, usMax: 15, euMin: 0, euMax: 12 },
  { chapter: '39-40', category: 'Plastics & Rubber', usMin: 0, usMax: 12, euMin: 0, euMax: 8 },
  { chapter: '41-43', category: 'Hides & Skins', usMin: 0, usMax: 20, euMin: 0, euMax: 11 },
  { chapter: '44-46', category: 'Wood Products', usMin: 0, usMax: 12, euMin: 0, euMax: 10 },
  { chapter: '47-49', category: 'Pulp & Paper', usMin: 0, usMax: 8, euMin: 0, euMax: 6 },
  { chapter: '50-63', category: 'Textiles', usMin: 0, usMax: 32, euMin: 0, euMax: 17 },
  { chapter: '64-67', category: 'Footwear', usMin: 0, usMax: 67, euMin: 0, euMax: 17 },
  { chapter: '68-70', category: 'Stone & Glass', usMin: 0, usMax: 20, euMin: 0, euMax: 14 },
  { chapter: '71', category: 'Precious Stones', usMin: 0, usMax: 14, euMin: 0, euMax: 4 },
  { chapter: '72-83', category: 'Base Metals', usMin: 0, usMax: 15, euMin: 0, euMax: 10 },
  { chapter: '84-85', category: 'Machinery', usMin: 0, usMax: 8, euMin: 0, euMax: 6 },
  { chapter: '86-89', category: 'Transport', usMin: 0, usMax: 25, euMin: 0, euMax: 10 },
  { chapter: '90-92', category: 'Instruments', usMin: 0, usMax: 8, euMin: 0, euMax: 5 },
  { chapter: '93', category: 'Arms', usMin: 0, usMax: 10, euMin: 0, euMax: 5 },
  { chapter: '94-96', category: 'Miscellaneous', usMin: 0, usMax: 20, euMin: 0, euMax: 8 },
  { chapter: '97-99', category: 'Special', usMin: 0, usMax: 8, euMin: 0, euMax: 4 },
];

// Chapter distribution data for chart
const chapterDistributionData = [
  { name: 'Animal & Veg', chapters: 14, color: '#0F4C81' },
  { name: 'Foodstuffs', chapters: 9, color: '#2E8B57' },
  { name: 'Minerals', chapters: 3, color: '#6366f1' },
  { name: 'Chemicals', chapters: 11, color: '#8b5cf6' },
  { name: 'Plastics', chapters: 2, color: '#ec4899' },
  { name: 'Textiles', chapters: 14, color: '#f59e0b' },
  { name: 'Metals', chapters: 12, color: '#ef4444' },
  { name: 'Machinery', chapters: 2, color: '#14b8a6' },
  { name: 'Transport', chapters: 4, color: '#06b6d4' },
  { name: 'Instruments', chapters: 3, color: '#84cc16' },
  { name: 'Miscellaneous', chapters: 7, color: '#f97316' },
];

// FAQ Data with comprehensive answers (150+ words each)
const faqData = [
  {
    question: 'What is an HS Code and why is it important for international trade?',
    answer: 'The Harmonized System (HS) Code is a standardized numerical system developed by the World Customs Organization (WCO) for classifying traded products across international borders. This universally recognized nomenclature serves as the foundational language of global trade, employed by over 200 countries and covering more than 98% of worldwide merchandise trade. The system was first implemented in 1988 and undergoes updates every five years to reflect technological advancements and evolving trade patterns. HS codes are critically important because they determine the customs duties, taxes, and regulatory requirements applied to imported goods. They enable governments to collect uniform trade statistics, facilitate streamlined customs clearance procedures, support trade agreement negotiations, and establish rules of origin for preferential tariff programs. Accurate HS code classification is legally mandatory for all international shipments, and misclassification can result in costly delays, significant financial penalties, or even seizure of goods by customs authorities.',
  },
  {
    question: 'How is an HS Code structured and what do the different digits represent?',
    answer: 'The HS code follows a carefully designed hierarchical structure with increasing levels of specificity at each digit level. The first 2 digits identify the Chapter, representing broad product categories organized into 21 sections covering everything from live animals to works of art - there are 99 chapters total in the system. The first 4 digits form the Heading, which identifies specific product groups within a chapter, with approximately 1,244 headings in the current HS nomenclature. The first 6 digits constitute the Subheading, which represents the international standard recognized and harmonized by all WCO member countries - there are roughly 5,300 subheadings at this level. Countries may add additional digits (typically 2-4 more) for national tariff lines, creating 8-10 digit codes that provide even more specific classification for domestic tariff and statistical purposes. For example, code 8471.30.20 breaks down as: Chapter 84 (Machinery), Heading 8471 (Data processing machines), Subheading 8471.30 (Portable computers), and national suffix 20 for specific tariff classification.',
  },
  {
    question: 'What are the General Rules of Interpretation (GRI) and how do they work?',
    answer: 'The General Rules of Interpretation (GRI) are six internationally agreed-upon rules that provide a systematic methodology for classifying goods when the classification is not immediately apparent from the heading text alone. GRI 1 establishes that classification begins with the terms of headings and relevant Section or Chapter Notes - if goods clearly fit within a heading, they are classified there. GRI 2 addresses incomplete or unfinished goods (GRI 2a) and mixtures or combinations (GRI 2b), providing guidance on when such goods can be classified as complete articles. GRI 3 resolves conflicts when goods could potentially fall under multiple headings, using the principles of most specific description (GRI 3a), essential character (GRI 3b), or numerical order (GRI 3c). GRI 4 handles goods not classifiable by other rules through similarity to classified goods. GRI 5 addresses containers and packaging, distinguishing between reusable specialized containers (classified with contents) and standard packaging. GRI 6 applies these same principles at the subheading level for more precise classification.',
  },
  {
    question: 'How do HS codes affect customs duties, taxes, and trade compliance?',
    answer: 'HS codes serve as the primary determinant for customs duties, taxes, and regulatory requirements applied to internationally traded goods. Each tariff line has an associated duty rate, which can be ad valorem (a percentage of the customs value), specific (a fixed amount per unit), or compound (a combination of both). Duty rates vary dramatically by product category, ranging from duty-free treatment for many technology products to rates exceeding 100% for certain protected agricultural goods. HS codes also determine eligibility for preferential duty rates under Free Trade Agreements (FTAs), which can significantly reduce or eliminate duties for qualifying goods. Additionally, HS codes trigger the application of anti-dumping duties, countervailing duties, and quota restrictions that may apply to specific products from particular countries. Many countries also apply Value Added Tax (VAT) or Goods and Services Tax (GST) based on HS classification. Regulatory requirements such as import licenses, safety certifications, health certificates, and product standards are often tied to HS codes, making accurate classification essential for compliance with customs and trade regulations.',
  },
  {
    question: 'What are the consequences of HS code misclassification and how can they be avoided?',
    answer: 'HS code misclassification can result in severe financial, operational, and legal consequences for businesses engaged in international trade. Financial impacts include underpayment or overpayment of duties leading to penalties that can reach 2-4 times the duty difference, plus interest charges. Operational consequences include customs clearance delays causing supply chain disruptions, missed delivery deadlines, and storage charges at ports. In severe cases, customs authorities may seize or forfeit goods, potentially resulting in total loss of the shipment. Legal consequences can include fraud investigations, criminal charges for intentional misclassification, loss of import privileges, and increased scrutiny on all future shipments. Companies may also face retroactive audits extending back several years, uncovering systemic classification errors. To avoid these risks, businesses should invest in proper staff training on classification principles, use authoritative classification databases and tools, document their classification rationale thoroughly, obtain binding rulings from customs authorities for uncertain classifications, engage qualified customs brokers or trade professionals, and conduct regular internal audits of their HS code classifications.',
  },
  {
    question: 'Can HS codes differ between countries and how should businesses handle this?',
    answer: 'Yes, HS codes can and do differ between countries, particularly beyond the first 6 internationally harmonized digits. The World Customs Organization ensures that the first 6 digits are standardized globally, providing consistent classification across all member countries at the subheading level. However, individual countries are permitted to extend the nomenclature with additional digits for national tariff and statistical purposes, resulting in codes of 8, 10, or even more digits. The United States uses 10-digit HTS (Harmonized Tariff Schedule) codes, the European Union employs 10-digit TARIC codes, China utilizes 10-digit codes, and many other nations have their own unique extensions. These extended codes may carry different duty rates, statistical reporting requirements, or regulatory conditions. When conducting international trade, businesses must verify the correct classification in both the exporting and importing countries, as the extended digits may differ significantly even for identical products. It is essential to consult the official tariff schedules of each relevant country and consider seeking professional advice for complex products that may be classified differently across jurisdictions.',
  },
  {
    question: 'How can businesses obtain certainty on HS code classification for complex products?',
    answer: 'Businesses seeking certainty on HS code classification for complex, novel, or ambiguous products have several options at their disposal. The most definitive approach is requesting a Binding Ruling from customs authorities in the relevant country. A binding ruling is an official written determination that provides legal certainty on the classification of specific goods, typically valid for a defined period (often 2-3 years) and legally binding on both the importer and customs. In the United States, these are issued by U.S. Customs and Border Protection; in the EU, Binding Tariff Information (BTI) rulings are issued by national customs authorities. Businesses can also consult the World Customs Organization\'s Explanatory Notes, which provide detailed guidance on the interpretation of headings and subheadings. Engaging licensed customs brokers, trade attorneys, or classification specialists can provide expert guidance on difficult classifications. Many companies maintain internal classification databases with documented rationale for each product, supporting consistency and defensibility in case of customs audits. Trade associations and industry groups often publish classification guides for products common to their sectors.',
  },
  {
    question: 'What role do HS codes play in Free Trade Agreements and preferential trade programs?',
    answer: 'HS codes play a central and indispensable role in Free Trade Agreements (FTAs) and preferential trade programs by establishing the rules of origin that determine whether goods qualify for preferential tariff treatment. Each FTA specifies rules of origin based on HS classification, typically requiring that goods either be wholly obtained within the partner countries or undergo sufficient transformation (often measured by a change in HS heading or chapter) to qualify for preferential rates. The specific rule varies by product and agreement - some require a change in tariff classification (CTC) at the chapter, heading, or subheading level, while others use regional value content (RVC) calculations based on the percentage of value added within the FTA territory. HS codes also determine the baseline Most Favored Nation (MFN) duty rate from which preferential reductions are calculated. Goods must be classified under the correct HS code to claim FTA benefits, and incorrect classification can result in denial of preferential treatment, penalties, and potential fraud investigations. Many FTAs include specific provisions for classification disputes and cooperation between customs authorities.',
  },
];

// Pro Tips Data
const proTips = [
  {
    icon: FileSearch,
    title: 'Start with Chapter Notes',
    description: 'Always review the Chapter and Section Notes before classifying. These legal notes define what is included and excluded from each chapter, often providing decisive guidance that supersedes the heading text.',
  },
  {
    icon: Target,
    title: 'Document Your Reasoning',
    description: 'Maintain detailed classification files with your rationale, supporting documents, and any rulings or precedents. This documentation is essential for audits and defending your classification decisions.',
  },
  {
    icon: Scale,
    title: 'Consider All GRI Rules',
    description: 'Apply the General Rules of Interpretation systematically. Don\'t jump to conclusions based on GRI 1 alone - many products require analysis through multiple GRI rules for correct classification.',
  },
  {
    icon: Zap,
    title: 'Leverage Technology Wisely',
    description: 'Use classification databases and tools as starting points, but always verify results. Automated classification tools can speed up the process but should supplement, not replace, human expertise.',
  },
  {
    icon: Briefcase,
    title: 'Seek Binding Rulings Early',
    description: 'For high-value shipments or novel products, request binding rulings from customs authorities before importation. The cost and time investment is minimal compared to potential penalties from misclassification.',
  },
  {
    icon: RefreshCw,
    title: 'Stay Updated on Changes',
    description: 'HS codes are updated every 5 years by the WCO, and individual countries make regular tariff changes. Subscribe to customs updates and review classifications periodically to ensure continued accuracy.',
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    icon: XCircle,
    title: 'Relying Solely on Supplier Classifications',
    description: 'Never accept supplier-provided HS codes without verification. Suppliers may use outdated classifications, codes from different jurisdictions, or intentionally incorrect codes to show lower duty rates. Importers bear legal responsibility for correct classification.',
  },
  {
    icon: XCircle,
    title: 'Ignoring Section and Chapter Notes',
    description: 'The Section and Chapter Notes have legal force in classification decisions. Ignoring these notes can lead to incorrect classification even when the heading text seems to match. Many exclusions and specific provisions are buried in these notes.',
  },
  {
    icon: XCircle,
    title: 'Classifying by Common Name Alone',
    description: 'Product names in common usage often differ from HS terminology. A "notebook" could be a computer (8471), paper product (4820), or something else entirely. Classification must be based on the product\'s characteristics and the HS nomenclature.',
  },
  {
    icon: XCircle,
    title: 'Using Outdated Classification References',
    description: 'HS codes change with WCO updates (every 5 years) and national tariff modifications. Using outdated references can result in invalid codes that no longer exist or have been redefined. Always use current, official tariff schedules.',
  },
  {
    icon: XCircle,
    title: 'Assuming Same Code for Similar Products',
    description: 'Minor differences in product composition, construction, or use can result in different HS classifications. Don\'t assume that similar products have the same code - each product must be classified on its own merits against the nomenclature.',
  },
];

// Key metrics
const keyMetrics = [
  { label: 'Total Chapters', value: '99', icon: Layers, color: '#0F4C81' },
  { label: 'Sections', value: '21', icon: BarChart3, color: '#2E8B57' },
  { label: 'Countries Using', value: '200+', icon: Globe, color: '#6366f1' },
  { label: 'Trade Coverage', value: '98%', icon: TrendingUp, color: '#f59e0b' },
];

// Animated badge variants
const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

export default function HSCodeSearchTool() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'code' | 'keyword'>('keyword');
  const [selectedCountry, setSelectedCountry] = useState('us');
  const [searchResults, setSearchResults] = useState<HSCodeResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<HSCodeResult | null>(null);
  const [activeTab, setActiveTab] = useState('search');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;
    
    let results: HSCodeResult[] = [];
    
    if (searchType === 'code') {
      results = hsCodeDatabase.filter(item => 
        item.hsCode.includes(searchTerm.replace(/[.-]/g, ''))
      );
    } else {
      const term = searchTerm.toLowerCase();
      results = hsCodeDatabase.filter(item =>
        item.description.toLowerCase().includes(term) ||
        item.chapter.toLowerCase().includes(term) ||
        item.heading.toLowerCase().includes(term)
      );
    }
    
    setSearchResults(results);
    setSelectedResult(results.length > 0 ? results[0] : null);
    setHasSearched(true);
    
    // Switch to results tab after search
    if (results.length > 0) {
      setActiveTab('results');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectResult = (result: HSCodeResult) => {
    setSelectedResult(result);
  };

  const handleReset = () => {
    setSearchTerm('');
    setSearchResults([]);
    setSelectedResult(null);
    setHasSearched(false);
    setActiveTab('search');
  };

  // Export functionality
  const handleExport = () => {
    const data = selectedResult ? JSON.stringify(selectedResult, null, 2) : JSON.stringify(searchResults, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedResult 
      ? `hs-code-${selectedResult.hsCode.replace('.', '-')}.json`
      : 'hs-code-search-results.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Share functionality
  const handleShare = async () => {
    if (!selectedResult) return;
    const shareData = {
      title: `HS Code ${selectedResult.hsCode}`,
      text: selectedResult.description,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(
        `HS Code ${selectedResult.hsCode}: ${selectedResult.description}\n\nDuty Rates: US ${selectedResult.dutyRate.us}, EU ${selectedResult.dutyRate.eu}, CN ${selectedResult.dutyRate.cn}`
      );
    }
  };

  // Get all chapters flattened
  const allChapters = useMemo(() => {
    return hsSections.flatMap(section => 
      section.chapters.map(ch => ({
        ...ch,
        section: section.section,
        sectionName: section.name
      }))
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {/* Animated Badges */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            {['HS Codes', 'Trade Classification', 'Customs Compliance'].map((badge, i) => (
              <motion.div
                key={badge}
                custom={i}
                variants={badgeVariants}
              >
                <Badge 
                  variant="secondary" 
                  className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 border border-[#0F4C81]/20 dark:border-[#0F4C81]/30"
                >
                  {i === 0 && <Sparkles className="h-4 w-4 mr-2 text-[#0F4C81]" />}
                  {badge}
                  {i === 2 && <Sparkles className="h-4 w-4 ml-2 text-[#2E8B57]" />}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl shadow-lg">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
              HS Code Search Tool
            </h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Search Harmonized System codes for international trade classification and duty rates. 
            The universal language of global trade.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="border-[#0F4C81]/30 text-[#0F4C81] hover:bg-[#0F4C81]/10 dark:border-[#0F4C81]/50 dark:text-[#0F4C81]"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={searchResults.length === 0}
              className="border-[#0F4C81]/30 text-[#0F4C81] hover:bg-[#0F4C81]/10 dark:border-[#0F4C81]/50 dark:text-[#0F4C81]"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare}
              disabled={!selectedResult}
              className="border-[#2E8B57]/30 text-[#2E8B57] hover:bg-[#2E8B57]/10 dark:border-[#2E8B57]/50 dark:text-[#2E8B57]"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {keyMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm hover:shadow-xl transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${metric.color}15` }}
                        >
                          <Icon className="h-5 w-5" style={{ color: metric.color }} />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-bold" style={{ color: metric.color }}>
                            {metric.value}
                          </p>
                          <p className="text-xs text-muted-foreground">{metric.label}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
            <TabsTrigger value="search" className="text-xs md:text-sm">
              <Search className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Search</span>
            </TabsTrigger>
            <TabsTrigger value="results" className="text-xs md:text-sm">
              <Package className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Results</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="text-xs md:text-sm">
              <Layers className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Reference</span>
            </TabsTrigger>
            <TabsTrigger value="guide" className="text-xs md:text-sm">
              <BookOpen className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">Guide</span>
            </TabsTrigger>
            <TabsTrigger value="faq" className="text-xs md:text-sm">
              <HelpCircle className="h-4 w-4 mr-1 md:mr-2" />
              <span className="hidden sm:inline">FAQ</span>
            </TabsTrigger>
          </TabsList>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Search Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-[#0F4C81]" />
                      Search HS Codes
                    </CardTitle>
                    <CardDescription>Enter code or product description</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Search Type</Label>
                      <Select value={searchType} onValueChange={(v: 'code' | 'keyword') => setSearchType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keyword">By Keyword</SelectItem>
                          <SelectItem value="code">By HS Code</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="searchTerm">
                        {searchType === 'code' ? 'HS Code' : 'Product Description'}
                      </Label>
                      <Input
                        id="searchTerm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder={searchType === 'code' ? 'e.g., 8471.30' : 'e.g., laptop, clothing'}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Primary Market</Label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="cn">China</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={handleSearch}
                      className="w-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Access Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[#2E8B57]" />
                      Quick Access
                    </CardTitle>
                    <CardDescription>Common HS codes at a glance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {hsCodeDatabase.slice(0, 6).map((item) => (
                        <button
                          key={item.hsCode}
                          onClick={() => {
                            setSearchTerm(item.hsCode);
                            setSearchType('code');
                            handleSearch();
                          }}
                          className="p-3 rounded-lg border border-border hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition-all text-left group"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-mono font-semibold text-[#0F4C81]">{item.hsCode}</span>
                            <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description.substring(0, 50)}...
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Results Tab */}
          <TabsContent value="results" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Results List */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-1"
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-[#0F4C81]" />
                      Search Results
                    </CardTitle>
                    <CardDescription>
                      {hasSearched ? `${searchResults.length} result(s) found` : 'Search to see results'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {hasSearched && searchResults.length > 0 ? (
                      <div className="max-h-96 overflow-y-auto space-y-2 custom-scrollbar">
                        {searchResults.map((result) => (
                          <button
                            key={result.hsCode}
                            onClick={() => selectResult(result)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedResult?.hsCode === result.hsCode
                                ? 'border-[#0F4C81] bg-[#0F4C81]/10 dark:bg-[#0F4C81]/20'
                                : 'border-border hover:border-[#0F4C81]/50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-semibold text-[#0F4C81]">{result.hsCode}</span>
                              <ChevronRight className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {result.description}
                            </p>
                          </button>
                        ))}
                      </div>
                    ) : hasSearched ? (
                      <div className="text-center py-8">
                        <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No results found</p>
                        <p className="text-sm text-muted-foreground">Try a different search term</p>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Search className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <p className="text-muted-foreground">No search performed yet</p>
                        <p className="text-sm text-muted-foreground">Use the Search tab to find HS codes</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Details Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2"
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Tag className="h-5 w-5 text-[#2E8B57]" />
                          Classification Details
                        </CardTitle>
                        <CardDescription>HS Code information and duty rates</CardDescription>
                      </div>
                      {selectedResult && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={handleExport}>
                            <Download className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                          <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    {selectedResult ? (
                      <div className="space-y-6">
                        {/* HS Code Header */}
                        <div className="bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl p-6 text-white">
                          <div className="flex items-center gap-4 mb-4">
                            <div className="bg-white/20 rounded-lg px-4 py-2">
                              <span className="text-3xl font-mono font-bold">{selectedResult.hsCode}</span>
                            </div>
                            <Badge className="bg-white/20 text-white text-sm">
                              Chapter {selectedResult.hsCode.split('.')[0].substring(0, 2)}
                            </Badge>
                          </div>
                          <p className="text-lg">{selectedResult.description}</p>
                        </div>

                        {/* Classification Hierarchy */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Classification Hierarchy</h4>
                          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                            <div className="flex items-start gap-3">
                              <div className="w-1 h-full bg-[#0F4C81] rounded-full" />
                              <div>
                                <p className="text-xs text-muted-foreground">Chapter</p>
                                <p className="font-medium text-foreground">{selectedResult.chapter}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 pl-4">
                              <div className="w-1 h-full bg-[#2E8B57] rounded-full" />
                              <div>
                                <p className="text-xs text-muted-foreground">Heading</p>
                                <p className="font-medium text-foreground">{selectedResult.heading}</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3 pl-8">
                              <div className="w-1 h-full bg-purple-500 rounded-full" />
                              <div>
                                <p className="text-xs text-muted-foreground">Subheading</p>
                                <p className="font-medium text-foreground">{selectedResult.subheading}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Duty Rates */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Duty Rates</h4>
                          <div className="grid grid-cols-3 gap-4">
                            <div className={`rounded-lg p-4 ${selectedCountry === 'us' ? 'bg-[#0F4C81]/10 border-2 border-[#0F4C81]' : 'bg-muted/50'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-[#0F4C81]" />
                                <span className="text-sm text-muted-foreground">United States</span>
                              </div>
                              <p className="text-2xl font-bold text-[#0F4C81]">{selectedResult.dutyRate.us}</p>
                            </div>
                            <div className={`rounded-lg p-4 ${selectedCountry === 'eu' ? 'bg-[#2E8B57]/10 border-2 border-[#2E8B57]' : 'bg-muted/50'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-[#2E8B57]" />
                                <span className="text-sm text-muted-foreground">European Union</span>
                              </div>
                              <p className="text-2xl font-bold text-[#2E8B57]">{selectedResult.dutyRate.eu}</p>
                            </div>
                            <div className={`rounded-lg p-4 ${selectedCountry === 'cn' ? 'bg-purple-500/10 border-2 border-purple-500' : 'bg-muted/50'}`}>
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-purple-600" />
                                <span className="text-sm text-muted-foreground">China</span>
                              </div>
                              <p className="text-2xl font-bold text-purple-600">{selectedResult.dutyRate.cn}</p>
                            </div>
                          </div>
                        </div>

                        {/* Restrictions */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            Restrictions & Requirements
                          </h4>
                          <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-4">
                            <ul className="space-y-2">
                              {selectedResult.restrictions.map((restriction, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                                  <span className="mt-1">•</span>
                                  {restriction}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Related Codes */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground">Related HS Codes</h4>
                          <div className="space-y-2">
                            {selectedResult.relatedCodes.map((related, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div>
                                  <span className="font-mono text-[#0F4C81] font-semibold">{related.code}</span>
                                  <p className="text-sm text-muted-foreground">{related.description}</p>
                                </div>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setSearchTerm(related.code);
                                    setSearchType('code');
                                    handleSearch();
                                  }}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Classification Notes */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            <Info className="h-4 w-4 text-[#0F4C81]" />
                            Classification Notes
                          </h4>
                          <div className="bg-[#0F4C81]/5 dark:bg-[#0F4C81]/10 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground">{selectedResult.classificationNotes}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Package className="h-16 w-16 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Search for an HS code to see details
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Reference Tab */}
          <TabsContent value="reference" className="space-y-6">
            {/* Classification Distribution Pie Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#0F4C81]" />
                    HS Code Chapters Distribution
                  </CardTitle>
                  <CardDescription>Visual breakdown of chapters by product category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chapterDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="chapters"
                          nameKey="name"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {chapterDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: number) => [`${value} chapters`, 'Count']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Duty Rates Bar Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                    Duty Rate Ranges by Category
                  </CardTitle>
                  <CardDescription>Compare duty rate ranges across major markets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={dutyRatesByChapter}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          type="number" 
                          tickFormatter={(value) => `${value}%`}
                          stroke="hsl(var(--muted-foreground))"
                        />
                        <YAxis 
                          type="category" 
                          dataKey="category"
                          stroke="hsl(var(--muted-foreground))"
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip 
                          formatter={(value: number) => [`${value}%`, '']}
                          contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                        />
                        <Legend />
                        <Bar dataKey="usMax" name="US Max Duty" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="euMax" name="EU Max Duty" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* All Chapters by Section */}
            {hsSections.map((section, sectionIndex) => (
              <motion.div
                key={section.section}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * sectionIndex }}
              >
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
                  <div 
                    className="h-2"
                    style={{ 
                      background: `linear-gradient(to right, #0F4C81, #2E8B57)` 
                    }}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{section.section}</span>
                      </div>
                      <div>
                        <CardTitle className="text-lg">Section {section.section}</CardTitle>
                        <CardDescription>{section.name}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {section.chapters.map((chapter) => (
                        <button
                          key={chapter.code}
                          className="p-3 border border-border rounded-lg hover:border-[#0F4C81] hover:bg-[#0F4C81]/5 transition-all text-left group"
                          onClick={() => {
                            setSearchTerm(chapter.code);
                            setSearchType('code');
                            setActiveTab('search');
                            handleSearch();
                          }}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <Badge variant="outline" className="text-xs">
                              Ch. {chapter.code}
                            </Badge>
                            <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm font-medium text-foreground line-clamp-2">
                            {chapter.name}
                          </p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Complete Chapter Reference Table */}
            <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Complete Chapter Reference</CardTitle>
                <CardDescription>All 99 chapters of the Harmonized System</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto custom-scrollbar">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card">
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-semibold">Ch.</th>
                        <th className="text-left py-3 px-4 font-semibold">Description</th>
                        <th className="text-left py-3 px-4 font-semibold">Section</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allChapters.map((chapter) => (
                        <tr
                          key={chapter.code}
                          className="border-b hover:bg-muted/50 cursor-pointer transition-colors"
                          onClick={() => {
                            setSearchTerm(chapter.code);
                            setSearchType('code');
                            setActiveTab('search');
                            handleSearch();
                          }}
                        >
                          <td className="py-2 px-4">
                            <Badge variant="outline" className="font-mono">{chapter.code}</Badge>
                          </td>
                          <td className="py-2 px-4 text-foreground">{chapter.name}</td>
                          <td className="py-2 px-4">
                            <Badge 
                              variant="secondary"
                              className="text-xs"
                            >
                              {chapter.section}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            {/* Educational Content Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Understanding HS Codes */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-[#0F4C81]" />
                      </div>
                      <CardTitle>Understanding HS Codes</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The Harmonized System (HS) Code is an internationally standardized system of names and numbers 
                      for classifying traded products, developed and maintained by the World Customs Organization (WCO). 
                      This comprehensive nomenclature serves as the foundation for customs tariffs and international 
                      trade statistics across more than 200 countries and economies, covering approximately 98% of 
                      world merchandise trade. The system was first implemented in 1988 and is updated every five 
                      years to reflect changes in technology and trade patterns. HS codes are essential for determining 
                      customs duties, trade statistics, rules of origin, and trade negotiations. They enable governments 
                      to collect trade data uniformly, facilitate international trade procedures, and serve as the basis 
                      for many trade agreements and preferential tariff programs. The standardized nature of HS codes 
                      ensures that products are classified consistently across borders, reducing confusion and disputes 
                      in international trade while enabling accurate tariff calculations and regulatory compliance.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* HS Code Structure */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center">
                        <Layers className="h-5 w-5 text-[#2E8B57]" />
                      </div>
                      <CardTitle>Classification Process</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      The HS code classification process requires a systematic approach that considers both the 
                      physical characteristics and intended use of products:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-[#0F4C81]/5">
                        <div className="w-8 h-8 rounded bg-[#0F4C81] flex items-center justify-center text-white text-sm font-bold shrink-0">1</div>
                        <div>
                          <p className="font-medium text-foreground">Identify Product Characteristics</p>
                          <p className="text-sm text-muted-foreground">Determine material composition, function, and physical attributes</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-[#2E8B57]/5">
                        <div className="w-8 h-8 rounded bg-[#2E8B57] flex items-center justify-center text-white text-sm font-bold shrink-0">2</div>
                        <div>
                          <p className="font-medium text-foreground">Review Section Notes</p>
                          <p className="text-sm text-muted-foreground">Check relevant section for inclusions and exclusions</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-500/5">
                        <div className="w-8 h-8 rounded bg-purple-500 flex items-center justify-center text-white text-sm font-bold shrink-0">3</div>
                        <div>
                          <p className="font-medium text-foreground">Apply GRI Rules</p>
                          <p className="text-sm text-muted-foreground">Use General Rules of Interpretation systematically</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5">
                        <div className="w-8 h-8 rounded bg-amber-500 flex items-center justify-center text-white text-sm font-bold shrink-0">4</div>
                        <div>
                          <p className="font-medium text-foreground">Verify & Document</p>
                          <p className="text-sm text-muted-foreground">Confirm classification and maintain records</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Duty Determination */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-[#0F4C81]" />
                      </div>
                      <CardTitle>Duty Determination</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      HS codes serve as the primary determinant for customs duties, taxes, and regulatory requirements 
                      applied to internationally traded goods. Each tariff line has an associated duty rate, which can 
                      be ad valorem (a percentage of the customs value), specific (a fixed amount per unit), or compound 
                      (a combination of both). Duty rates vary dramatically by product category, ranging from duty-free 
                      treatment for many technology products to rates exceeding 100% for certain protected agricultural 
                      goods. HS codes also determine eligibility for preferential duty rates under Free Trade Agreements 
                      (FTAs), which can significantly reduce or eliminate duties for qualifying goods. The classification 
                      directly impacts the total landed cost of imported products, making accurate classification essential 
                      for pricing decisions, budgeting, and competitive analysis. Additionally, HS codes trigger the 
                      application of anti-dumping duties, countervailing duties, and quota restrictions that may apply 
                      to specific products from particular countries.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Common Classifications */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-[#2E8B57]" />
                      </div>
                      <CardTitle>Common Classifications</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Understanding common product classifications helps traders navigate the HS system more effectively. 
                      Electronics typically fall under Chapters 84-85, with computers in 8471, phones in 8517, and 
                      semiconductor devices in 8541. Textiles and apparel span Chapters 50-63, with distinctions between 
                      knitted (Chapter 61) and woven (Chapter 62) articles. Machinery and mechanical appliances are 
                      primarily in Chapter 84, while electrical equipment occupies Chapter 85. Agricultural products 
                      are covered in Chapters 1-24, including live animals (01), meat (02), vegetables (07), fruits (08), 
                      and prepared foods (16-21). Chemical products span Chapters 28-38, with pharmaceuticals specifically 
                      in Chapter 30. Vehicles and transport equipment are found in Chapters 86-89, while instruments and 
                      precision equipment occupy Chapters 90-92. Understanding these broad categories helps narrow down 
                      the classification search and ensures goods are placed in the appropriate section before applying 
                      detailed classification rules.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* GRI Rules */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center">
                      <ClipboardCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>General Rules of Interpretation (GRI)</CardTitle>
                      <CardDescription>Official WCO classification rules for goods</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-2">
                    {griRules.map((gri, index) => (
                      <AccordionItem 
                        key={gri.rule} 
                        value={gri.rule}
                        className="border border-border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <Badge 
                              className="shrink-0"
                              style={{ 
                                backgroundColor: index % 2 === 0 ? '#0F4C81' : '#2E8B57' 
                              }}
                            >
                              {gri.rule}
                            </Badge>
                            <span className="font-medium text-foreground">{gri.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-3 pt-2">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {gri.description}
                            </p>
                            <div className="bg-muted/50 rounded-lg p-3">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Example:</p>
                              <p className="text-sm text-muted-foreground">{gri.example}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Pro Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0F4C81]/10 flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-[#0F4C81]" />
                    </div>
                    <CardTitle>Pro Tips for HS Code Classification</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {proTips.map((tip, index) => {
                      const Icon = tip.icon;
                      return (
                        <div
                          key={index}
                          className="p-4 rounded-lg border border-border hover:border-[#0F4C81]/50 transition-colors"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10 flex items-center justify-center">
                              <Icon className="h-5 w-5 text-[#0F4C81]" />
                            </div>
                            <h4 className="font-semibold text-foreground">{tip.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Common Mistakes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <CardTitle>Common Mistakes to Avoid</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {commonMistakes.map((mistake, index) => {
                      const Icon = mistake.icon;
                      return (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50/50 dark:bg-red-950/20"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-red-500" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-1">{mistake.title}</h4>
                            <p className="text-sm text-muted-foreground">{mistake.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center">
                      <HelpCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle>Frequently Asked Questions</CardTitle>
                      <CardDescription>Comprehensive answers to common questions about HS Code classification</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {faqData.map((faq, index) => (
                      <AccordionItem 
                        key={index} 
                        value={`faq-${index}`}
                        className="border border-border rounded-lg px-4 overflow-hidden"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-start gap-3 text-left">
                            <div 
                              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                              style={{ 
                                backgroundColor: index % 2 === 0 ? '#0F4C8115' : '#2E8B5715' 
                              }}
                            >
                              <span 
                                className="font-bold text-sm"
                                style={{ color: index % 2 === 0 ? '#0F4C81' : '#2E8B57' }}
                              >
                                {index + 1}
                              </span>
                            </div>
                            <span className="font-medium text-foreground">{faq.question}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="pl-11">
                            <p className="text-muted-foreground leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Reference Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#0F4C81] to-[#0F4C81]/80 text-white h-full">
                  <CardContent className="p-6">
                    <Building className="h-8 w-8 mb-4 opacity-80" />
                    <h3 className="font-bold text-lg mb-2">For Exporters</h3>
                    <p className="text-sm opacity-90">
                      Ensure accurate classification to avoid delays, penalties, and to qualify for 
                      preferential trade agreements. Document your classification rationale thoroughly.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-[#2E8B57] to-[#2E8B57]/80 text-white h-full">
                  <CardContent className="p-6">
                    <Users className="h-8 w-8 mb-4 opacity-80" />
                    <h3 className="font-bold text-lg mb-2">For Importers</h3>
                    <p className="text-sm opacity-90">
                      Verify supplier classifications independently. Calculate total landed costs 
                      including all applicable duties and taxes based on HS codes.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-600/80 text-white h-full">
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 mb-4 opacity-80" />
                    <h3 className="font-bold text-lg mb-2">Compliance Tips</h3>
                    <p className="text-sm opacity-90">
                      Request binding rulings for uncertain classifications. Maintain records for 
                      5+ years. Conduct periodic audits of your HS code classifications.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Export/Share */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex justify-center gap-4"
        >
          <Button 
            variant="outline" 
            className="border-[#0F4C81]/30 text-[#0F4C81] hover:bg-[#0F4C81]/10 dark:border-[#0F4C81]/50"
            onClick={handleExport}
            disabled={searchResults.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Results
          </Button>
          <Button 
            variant="outline"
            className="border-[#2E8B57]/30 text-[#2E8B57] hover:bg-[#2E8B57]/10 dark:border-[#2E8B57]/50"
            onClick={handleShare}
            disabled={!selectedResult}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Classification
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
