"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Plane,
  Train,
  Truck,
  Clock,
  MapPin,
  Calendar,
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  Globe,
  BarChart3,
  BookOpen,
  HelpCircle,
  Calculator,
  Route,
  Zap,
  TrendingUp,
  Package,
  Check,
  RotateCcw,
  Info,
  AlertTriangle,
  Target,
  Layers,
  DollarSign,
  Sun,
  Cloud,
  Snowflake,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  ComposedChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

// Transit times in days with ranges
const transitTimes: Record<string, Record<string, { sea: { min: number; avg: number; max: number }; air: { min: number; avg: number; max: number }; rail: { min: number; avg: number; max: number }; road: { min: number; avg: number; max: number } }>> = {
  "Asia": {
    "Asia": { sea: { min: 5, avg: 7, max: 10 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 3, avg: 5, max: 7 }, road: { min: 2, avg: 4, max: 6 } },
    "Europe": { sea: { min: 25, avg: 30, max: 40 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 14, avg: 18, max: 22 }, road: { min: 12, avg: 15, max: 18 } },
    "North America": { sea: { min: 15, avg: 20, max: 28 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "South America": { sea: { min: 30, avg: 35, max: 45 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Africa": { sea: { min: 20, avg: 25, max: 35 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Oceania": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
  },
  "Europe": {
    "Asia": { sea: { min: 25, avg: 30, max: 40 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 14, avg: 18, max: 22 }, road: { min: 12, avg: 15, max: 18 } },
    "Europe": { sea: { min: 3, avg: 5, max: 8 }, air: { min: 1, avg: 1, max: 2 }, rail: { min: 2, avg: 3, max: 5 }, road: { min: 1, avg: 2, max: 4 } },
    "North America": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "South America": { sea: { min: 20, avg: 25, max: 32 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Africa": { sea: { min: 8, avg: 12, max: 18 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 5, avg: 7, max: 10 } },
    "Oceania": { sea: { min: 35, avg: 40, max: 50 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
  },
  "North America": {
    "Asia": { sea: { min: 15, avg: 20, max: 28 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Europe": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "North America": { sea: { min: 3, avg: 5, max: 8 }, air: { min: 1, avg: 1, max: 2 }, rail: { min: 3, avg: 4, max: 6 }, road: { min: 2, avg: 3, max: 5 } },
    "South America": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 8, avg: 10, max: 14 } },
    "Africa": { sea: { min: 20, avg: 25, max: 32 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Oceania": { sea: { min: 25, avg: 30, max: 38 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
  },
  "South America": {
    "Asia": { sea: { min: 30, avg: 35, max: 45 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Europe": { sea: { min: 20, avg: 25, max: 32 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "North America": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 8, avg: 10, max: 14 } },
    "South America": { sea: { min: 5, avg: 7, max: 10 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 3, avg: 5, max: 8 } },
    "Africa": { sea: { min: 15, avg: 20, max: 28 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Oceania": { sea: { min: 30, avg: 35, max: 45 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
  },
  "Africa": {
    "Asia": { sea: { min: 20, avg: 25, max: 35 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Europe": { sea: { min: 8, avg: 12, max: 18 }, air: { min: 1, avg: 2, max: 3 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 5, avg: 7, max: 10 } },
    "North America": { sea: { min: 20, avg: 25, max: 32 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "South America": { sea: { min: 15, avg: 20, max: 28 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Africa": { sea: { min: 5, avg: 7, max: 10 }, air: { min: 1, avg: 1, max: 2 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 2, avg: 4, max: 6 } },
    "Oceania": { sea: { min: 25, avg: 30, max: 38 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
  },
  "Oceania": {
    "Asia": { sea: { min: 12, avg: 15, max: 20 }, air: { min: 2, avg: 3, max: 4 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Europe": { sea: { min: 35, avg: 40, max: 50 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "North America": { sea: { min: 25, avg: 30, max: 38 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "South America": { sea: { min: 30, avg: 35, max: 45 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Africa": { sea: { min: 25, avg: 30, max: 38 }, air: { min: 3, avg: 4, max: 5 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 0, avg: 0, max: 0 } },
    "Oceania": { sea: { min: 3, avg: 5, max: 8 }, air: { min: 1, avg: 1, max: 2 }, rail: { min: 0, avg: 0, max: 0 }, road: { min: 2, avg: 3, max: 5 } },
  },
};

const regions = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

const majorPorts: Record<string, { name: string; code: string; teu: string }[]> = {
  "Asia": [
    { name: "Shanghai, China", code: "CNSHA", teu: "47M" },
    { name: "Singapore", code: "SGSIN", teu: "37M" },
    { name: "Shenzhen, China", code: "CNSZX", teu: "28M" },
    { name: "Ningbo, China", code: "CNNGB", teu: "33M" },
    { name: "Busan, South Korea", code: "KRPUS", teu: "22M" },
  ],
  "Europe": [
    { name: "Rotterdam, Netherlands", code: "NLRTM", teu: "15M" },
    { name: "Antwerp, Belgium", code: "BEANR", teu: "12M" },
    { name: "Hamburg, Germany", code: "DEHAM", teu: "9M" },
    { name: "Felixstowe, UK", code: "GBFXT", teu: "4M" },
    { name: "Le Havre, France", code: "FRLEH", teu: "3M" },
  ],
  "North America": [
    { name: "Los Angeles, USA", code: "USLAX", teu: "10M" },
    { name: "Long Beach, USA", code: "USLGB", teu: "9M" },
    { name: "New York/New Jersey", code: "USNYC", teu: "8M" },
    { name: "Savannah, USA", code: "USSAV", teu: "5M" },
    { name: "Vancouver, Canada", code: "CAVAN", teu: "3M" },
  ],
  "South America": [
    { name: "Santos, Brazil", code: "BRSSZ", teu: "4M" },
    { name: "Buenos Aires, Argentina", code: "ARBUE", teu: "2M" },
    { name: "Callao, Peru", code: "PECLL", teu: "2M" },
    { name: "San Antonio, Chile", code: "CLSAI", teu: "1M" },
  ],
  "Africa": [
    { name: "Durban, South Africa", code: "ZADUR", teu: "3M" },
    { name: "Tanger Med, Morocco", code: "MATNG", teu: "7M" },
    { name: "Lagos, Nigeria", code: "NGLOS", teu: "1M" },
    { name: "Mombasa, Kenya", code: "KEMOM", teu: "1M" },
  ],
  "Oceania": [
    { name: "Sydney, Australia", code: "AUSYD", teu: "2M" },
    { name: "Melbourne, Australia", code: "AUMEL", teu: "3M" },
    { name: "Auckland, New Zealand", code: "NZAKL", teu: "1M" },
    { name: "Brisbane, Australia", code: "AUBNE", teu: "1M" },
  ],
};

// Popular trade routes with detailed information
const popularRoutes = [
  { origin: "Asia", destination: "Europe", name: "Asia-Europe Trade Lane", volume: "25M TEU", seaDays: "28-35", airDays: "2-4", trend: "+5%" },
  { origin: "Asia", destination: "North America", name: "Trans-Pacific Eastbound", volume: "18M TEU", seaDays: "15-22", airDays: "2-3", trend: "+3%" },
  { origin: "Europe", destination: "North America", name: "Trans-Atlantic Westbound", volume: "8M TEU", seaDays: "12-18", airDays: "1-2", trend: "+2%" },
  { origin: "Asia", destination: "Oceania", name: "Asia-Oceania Route", volume: "5M TEU", seaDays: "12-18", airDays: "2-3", trend: "+4%" },
  { origin: "Europe", destination: "Africa", name: "Europe-Africa Trade", volume: "4M TEU", seaDays: "8-15", airDays: "1-3", trend: "+6%" },
  { origin: "North America", destination: "South America", name: "North-South America", volume: "3M TEU", seaDays: "12-18", airDays: "1-2", trend: "+1%" },
];

// Seasonal variation data
const seasonalData = [
  { month: "Jan", ocean: 32, air: 3, congestion: 15, name: "Winter" },
  { month: "Feb", ocean: 35, air: 3, congestion: 20, name: "Winter" },
  { month: "Mar", ocean: 30, air: 3, congestion: 12, name: "Spring" },
  { month: "Apr", ocean: 28, air: 3, congestion: 8, name: "Spring" },
  { month: "May", ocean: 27, air: 3, congestion: 10, name: "Spring" },
  { month: "Jun", ocean: 29, air: 3, congestion: 15, name: "Summer" },
  { month: "Jul", ocean: 31, air: 3, congestion: 22, name: "Summer" },
  { month: "Aug", ocean: 33, air: 3, congestion: 28, name: "Summer" },
  { month: "Sep", ocean: 35, air: 3, congestion: 35, name: "Fall" },
  { month: "Oct", ocean: 38, air: 3, congestion: 45, name: "Fall" },
  { month: "Nov", ocean: 40, air: 3, congestion: 50, name: "Fall" },
  { month: "Dec", ocean: 36, air: 3, congestion: 30, name: "Winter" },
];

// Pro Tips for transit planning
const PRO_TIPS = [
  {
    title: "Plan for Peak Seasons",
    description: "Chinese New Year (Jan-Feb), Golden Week (Oct), and pre-holiday seasons cause significant delays. Book 4-6 weeks in advance during these periods.",
    icon: Calendar,
  },
  {
    title: "Include Buffer Time",
    description: "Add 10-15% buffer for routine shipments, 20-30% for critical cargo. Port congestion, weather, and customs can add unexpected delays.",
    icon: Clock,
  },
  {
    title: "Monitor Carrier Schedules",
    description: "Vessel schedules change frequently. Use tracking tools to stay updated on actual departure and arrival times rather than relying on initial estimates.",
    icon: Ship,
  },
  {
    title: "Consider Total Landed Cost",
    description: "Faster transit may cost more but reduce inventory carrying costs, stockout risks, and improve cash flow. Evaluate total cost, not just freight rates.",
    icon: DollarSign,
  },
  {
    title: "Diversify Your Routes",
    description: "Have backup routing options. Alternative ports, different carriers, or multimodal solutions provide resilience when primary routes face disruptions.",
    icon: Route,
  },
];

// Educational content sections
const EDUCATIONAL_CONTENT = {
  factors: {
    title: "Factors Affecting Transit Time",
    content: `Transit time in freight transportation is influenced by a complex interplay of multiple factors that can significantly impact delivery schedules. Distance remains the primary determinant, with longer routes naturally requiring more time. However, the choice of transport mode creates dramatic differences - ocean freight typically takes 20-45 days for intercontinental routes, while air freight covers the same distance in 2-5 days at substantially higher costs. Rail transport offers a middle ground, particularly for Eurasian routes where China-Europe rail services take 14-22 days.

Port congestion has become increasingly critical since 2020, with major hubs like Los Angeles, Rotterdam, and Shanghai experiencing wait times of 5-15 days during peak periods. Weather patterns including typhoons in the Pacific, monsoons in Asia, and winter storms in the Atlantic can add days to weeks of delay. Vessel speed adjustments, known as slow steaming, are used by carriers to reduce fuel costs and emissions, adding 3-7 days to typical routes. Transshipment through hub ports rather than direct services adds handling time at each intermediate stop.

Customs clearance efficiency varies dramatically by country and product type. Some ports clear cargo in hours, while others require days or weeks, particularly for goods requiring inspections, certifications, or duty calculations. Documentation accuracy is crucial - errors can cause holds lasting weeks. Labor disruptions, including strikes at ports or rail facilities, create unpredictable delays. Understanding these factors allows shippers to build realistic timelines and appropriate contingency plans into their supply chain operations.`,
  },
  planning: {
    title: "How to Plan Shipments Effectively",
    content: `Effective shipment planning requires a systematic approach that balances cost, speed, reliability, and risk management. Begin by clearly defining your shipment requirements: delivery deadline, budget constraints, cargo characteristics, and any special handling needs. This foundation determines which transport modes are viable options for your specific situation.

Work backward from your required delivery date, building in buffer time at each stage. Industry best practice suggests adding 3-5 days for ocean freight, 1-2 days for air freight, and 2-3 days for rail as a minimum buffer. During peak seasons or for critical shipments, double these recommendations. Consider port holidays in both origin and destination countries - Chinese New Year, European summer holidays, and US Thanksgiving all impact schedules significantly.

Select your carrier strategically, not just on price. Review their on-time performance statistics, which are published by various industry sources. Premium services with fewer port calls and faster vessels command higher rates but deliver more predictable transit times. For time-sensitive cargo, consider guaranteed services that offer compensation for delays.

Coordinate with all supply chain partners early. Freight forwarders need time to book space, customs brokers require documentation in advance, and drayage providers need notice for port pickups. Communication gaps at any handoff point can cascade into significant delays. Implement tracking systems to monitor progress proactively rather than reacting to problems after they occur. Modern visibility platforms provide real-time updates and predictive ETAs based on current conditions.`,
  },
  buffer: {
    title: "Buffer Time Recommendations",
    content: `Buffer time in freight planning represents the safety margin between expected and actual delivery dates, accounting for the inherent variability in transportation systems. Determining appropriate buffer requires analyzing historical performance data, current market conditions, and your specific supply chain requirements.

For standard shipments under normal conditions, industry guidelines suggest the following minimum buffers: ocean freight add 10-15% to quoted transit time (typically 3-5 days), air freight add 5-10% (typically 1-2 days), rail freight add 10-15% (typically 2-3 days), and road freight add 5-10% (typically 1 day per week of transit). These baseline recommendations assume average conditions and non-critical cargo.

During peak seasons, increase buffers substantially. The pre-Christmas rush (August-October) and Chinese New Year period (December-February) see congestion levels 2-3 times normal. Double your standard buffer during these periods. Port strikes, weather events, or geopolitical disruptions require case-by-case assessment - some situations may warrant buffers of 10-14 days or more.

Consider your inventory position when setting buffer. Just-in-time operations with minimal safety stock require larger buffers to prevent stockouts. Companies with higher inventory levels can accept more transit variability. The cost of buffer time (working capital tied up in early arrivals) must be balanced against stockout costs. For critical components or promotional goods, conservative buffers protect against expensive disruptions.

Document your buffer assumptions and track actual performance against predictions. Over time, this data enables more precise planning and identifies routes or carriers that consistently underperform their quotes. This systematic approach transforms buffer planning from guesswork into data-driven decision making.`,
  },
  seasonal: {
    title: "Seasonal Considerations in Transit Planning",
    content: `Seasonal variations dramatically impact freight transit times and require proactive planning to maintain supply chain reliability. Understanding these patterns allows shippers to anticipate challenges and adjust strategies accordingly, avoiding costly delays and capacity shortages.

Spring (March-May) generally offers favorable conditions across most trade lanes. Port congestion decreases as holiday periods end, weather improves in northern hemisphere routes, and capacity is more readily available. This is often the best time for non-urgent shipments to benefit from competitive rates and reliable transit times. However, monsoon seasons in Southeast Asia and typhoon risks in the Pacific begin developing in late spring.

Summer (June-August) brings mixed conditions. European port efficiency improves with good weather, but vacation periods can reduce labor availability. Hurricane season in the Atlantic and Gulf of Mexico (June-November) creates route disruptions and delays. Typhoon activity in the Pacific intensifies, potentially adding 3-7 days to Asia-America routes. Capacity tightens as retailers build inventory for holiday seasons.

Fall (September-November) represents the most challenging period for transit planning. Peak shipping season for Christmas merchandise creates severe capacity constraints and port congestion. Chinese Golden Week in early October virtually shuts down Asian supply chains for 7-10 days. Rates increase 30-50% and transit times extend as carriers maximize vessel utilization. Weather risks remain with Atlantic hurricanes and Pacific typhoons.

Winter (December-February) brings Chinese New Year disruptions that ripple through global supply chains for 4-6 weeks. Factory shutdowns, reduced vessel schedules, and post-holiday backlog create extended delays. Northern European and North American ports may face ice conditions. Plan major shipments well before or well after the Chinese New Year period to avoid the worst congestion.`,
  },
};

// FAQ Data
const FAQ_DATA = [
  {
    question: "What is transit time in freight shipping?",
    answer: "Transit time refers to the total duration cargo spends in transportation from the point of origin to the final destination. It encompasses the actual movement time plus any intermediate handling, but excludes time spent on documentation processing, customs clearance, and loading/unloading at origin and destination facilities. Transit time is typically expressed in days and varies significantly by transport mode - ocean freight ranges from 15-45 days for intercontinental routes, air freight from 1-5 days, rail from 7-22 days, and road transport depends on distance. Understanding transit time is fundamental to supply chain planning as it directly impacts inventory levels, order lead times, and customer service commitments.",
  },
  {
    question: "How is transit time calculated by carriers?",
    answer: "Carriers calculate transit time from the scheduled departure date to the estimated arrival date at the destination port or terminal. For ocean freight, this includes vessel sailing time, any transshipment stops, and canal transits if applicable. The calculation typically assumes normal operating conditions and excludes force majeure events. Carriers publish port-to-port transit times in their service schedules, but actual times may vary based on vessel speed, weather routing, port congestion, and schedule recovery efforts. For door-to-door transit time, you must add inland transportation time at both ends, customs clearance time, and handling time at terminals. Most freight forwarders provide door-to-door estimates that aggregate these components, though each element carries its own variability.",
  },
  {
    question: "What is the difference between ETA and ETD?",
    answer: "ETD (Estimated Time of Departure) and ETA (Estimated Time of Arrival) are fundamental shipping terms that bookend the transit time calculation. ETD indicates when a vessel, aircraft, or vehicle is scheduled to depart from its origin point. This date is crucial for planning cargo cutoff times - when your shipment must be delivered to the terminal to make a specific sailing or flight. ETA represents the expected arrival time at the destination. The difference between ETD and ETA represents the transit time. However, both estimates are subject to change. Vessels may depart late due to cargo operations, arrive early through favorable weather, or experience delays at transshipment ports. Modern tracking systems provide updated ETAs based on actual vessel position and speed, offering more accurate predictions than the original schedule. Always verify current ETAs for time-sensitive shipments rather than relying on initial quotes.",
  },
  {
    question: "What factors commonly delay shipments?",
    answer: "Shipment delays stem from numerous sources across the supply chain. Port congestion has emerged as a primary factor since 2020, with vessels waiting days or weeks for berth availability at major hubs. Weather events including typhoons, hurricanes, and winter storms force route deviations or port closures. Carrier operational issues such as vessel mechanical problems, crew changes, and schedule adjustments impact timing. Labor disputes and strikes at ports, rail yards, or trucking companies create unpredictable stoppages. Customs holds for inspection, documentation errors, or regulatory compliance issues can add days to weeks. Overbooked vessels during peak seasons result in cargo being 'rolled' to subsequent sailings. Infrastructure limitations like draft restrictions at ports or rail bottlenecks constrain capacity. Geopolitical events including trade disputes, sanctions, or canal closures reroute cargo through longer paths. Supply chain professionals must monitor all these factors and maintain contingency plans for the most likely delay scenarios.",
  },
  {
    question: "How can I track my shipment in transit?",
    answer: "Modern shipment tracking offers multiple options to monitor cargo progress. Carrier websites and apps provide real-time vessel or aircraft positions with updated ETAs using your booking or container number. Third-party visibility platforms like project44, FourKites, or Vizion aggregate data from multiple carriers into unified dashboards with predictive analytics. Your freight forwarder should provide regular updates and can access detailed status through their carrier relationships. For ocean freight, automatic identification system (AIS) data shows actual vessel positions globally. Container tracking reveals terminal handling events - gate in, vessel load, transshipment, vessel discharge, and gate out. Air freight tracking through airline systems or IATA's Cargo-IMP provides milestone updates. Set up automated alerts for key events and exceptions to enable proactive management rather than reactive firefighting. The most effective tracking combines automated notifications with periodic manual reviews of high-value or time-sensitive shipments.",
  },
  {
    question: "What are the best practices for transit time planning?",
    answer: "Effective transit time planning combines data-driven analysis with practical contingencies. Start by understanding your product requirements - shelf life, production schedules, and customer commitments define your timeline constraints. Build buffer time appropriate to your risk tolerance: 10-15% for standard cargo, 20-30% for critical shipments, and double during peak seasons. Diversify your carrier portfolio to avoid single points of failure - maintain relationships with 2-3 carriers on key lanes. Establish communication protocols with all supply chain partners, ensuring contact information is current and escalation paths are clear. Monitor leading indicators like port congestion indices, carrier schedule reliability, and weather forecasts. Develop contingency plans for common disruption scenarios including port strikes, vessel delays, and capacity shortages. Consider total landed cost when selecting transit options - faster shipping may reduce inventory carrying costs and stockout risks enough to justify higher freight rates. Document planned versus actual transit times to identify consistently problematic routes or carriers. This systematic approach transforms transit planning from reactive firefighting to proactive supply chain management.",
  },
  {
    question: "When should I choose air freight vs ocean freight?",
    answer: `The choice between air and ocean freight involves balancing speed, cost, cargo characteristics, and supply chain strategy. Choose air freight when: delivery timelines are under 2 weeks, product value exceeds $10/kg, goods are perishable or seasonal, inventory carrying costs are high, or stockouts carry severe consequences. Air freight costs 10-15 times more than ocean freight per kilogram but reduces transit time from weeks to days. The total cost comparison must include inventory costs - air freight's speed reduces working capital requirements and storage needs.

Choose ocean freight when: timelines permit 3-6 weeks, cargo volume is large, product value is moderate, you're shipping heavy or bulky items, or budget constraints are primary. Ocean freight becomes more economical for shipments over 100kg, with the break-even point varying by route and product value. Many shippers use a hybrid approach: ocean for regular replenishment with air freight for emergency top-ups or urgent orders.

Consider intermediate options like rail freight for China-Europe routes (14-22 days at costs between air and ocean) or expedited ocean services with fewer port calls and faster vessel speeds. The optimal choice depends on your specific circumstances - there's no universal rule. Analyze your supply chain holistically, considering not just freight cost but total delivered cost including inventory, risk, and service level impacts.`,
  },
];

interface TransitResult {
  mode: "sea" | "air" | "rail" | "road";
  transitDays: { min: number; avg: number; max: number };
  departureDate: Date;
  arrivalDate: { min: Date; avg: Date; max: Date };
  available: boolean;
}

// Color constants
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

export function FreightTransitCalculator() {
  const [originRegion, setOriginRegion] = useState<string>("Asia");
  const [destinationRegion, setDestinationRegion] = useState<string>("Europe");
  const [departureDate, setDepartureDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [bufferDays, setBufferDays] = useState<string>("3");
  const [activeTab, setActiveTab] = useState("calculator");
  const [copied, setCopied] = useState(false);

  const results = useMemo((): TransitResult[] => {
    const transit = transitTimes[originRegion]?.[destinationRegion] || {
      sea: { min: 0, avg: 0, max: 0 },
      air: { min: 0, avg: 0, max: 0 },
      rail: { min: 0, avg: 0, max: 0 },
      road: { min: 0, avg: 0, max: 0 },
    };
    const departure = new Date(departureDate);
    const buffer = parseInt(bufferDays) || 0;

    return (["sea", "air", "rail", "road"] as const).map((mode) => ({
      mode,
      transitDays: transit[mode],
      departureDate: departure,
      arrivalDate: {
        min: new Date(departure.getTime() + (transit[mode].min + buffer) * 24 * 60 * 60 * 1000),
        avg: new Date(departure.getTime() + (transit[mode].avg + buffer) * 24 * 60 * 60 * 1000),
        max: new Date(departure.getTime() + (transit[mode].max + buffer) * 24 * 60 * 60 * 1000),
      },
      available: transit[mode].avg > 0,
    }));
  }, [originRegion, destinationRegion, departureDate, bufferDays]);

  const comparisonChartData = useMemo(() => {
    return results.filter((r) => r.available).map((result) => ({
      mode: result.mode.charAt(0).toUpperCase() + result.mode.slice(1),
      min: result.transitDays.min,
      avg: result.transitDays.avg,
      max: result.transitDays.max,
    }));
  }, [results]);

  const modeComparisonData = useMemo(() => {
    return [
      { name: "Ocean", days: results[0]?.transitDays.avg || 0, color: OCEAN_BLUE, cost: "$", speed: "Slowest" },
      { name: "Air", days: results[1]?.transitDays.avg || 0, color: "#8b5cf6", cost: "$$$", speed: "Fastest" },
      { name: "Rail", days: results[2]?.transitDays.avg || 0, color: "#f59e0b", cost: "$$", speed: "Medium" },
      { name: "Road", days: results[3]?.transitDays.avg || 0, color: LOGISTICS_GREEN, cost: "$$", speed: "Variable" },
    ].filter(d => d.days > 0);
  }, [results]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "sea": return Ship;
      case "air": return Plane;
      case "rail": return Train;
      case "road": return Truck;
      default: return Ship;
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case "sea": return OCEAN_BLUE;
      case "air": return "#8b5cf6";
      case "rail": return "#f59e0b";
      case "road": return LOGISTICS_GREEN;
      default: return OCEAN_BLUE;
    }
  };

  const getModeDescription = (mode: string) => {
    switch (mode) {
      case "sea": return "Most economical for large volumes";
      case "air": return "Fastest option for urgent cargo";
      case "rail": return "Balanced cost-speed option";
      case "road": return "Flexible door-to-door delivery";
      default: return "";
    }
  };

  const handleExport = () => {
    const data = {
      route: { origin: originRegion, destination: destinationRegion },
      departureDate,
      bufferDays,
      results: results.map((r) => ({
        mode: r.mode,
        transitDays: r.transitDays,
        arrivalDate: { avg: formatDate(r.arrivalDate.avg) },
        available: r.available,
      })),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transit-times-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Transit times exported!");
  };

  const handleShare = async () => {
    const shareText = `Transit Time: ${originRegion} → ${destinationRegion}
Ocean: ${results[0].transitDays.avg} days | Air: ${results[1].transitDays.avg} days
Departure: ${formatDate(new Date(departureDate))}
Buffer: ${bufferDays} days`;
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  const resetForm = () => {
    setOriginRegion("Asia");
    setDestinationRegion("Europe");
    setDepartureDate(new Date().toISOString().split("T")[0]);
    setBufferDays("3");
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 80) return "#10B981";
    if (efficiency >= 60) return "#22C55E";
    if (efficiency >= 40) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Globe className="h-3 w-3 mr-1" />
                  Logistics
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Clock className="h-3 w-3 mr-1" />
                  Transit Planning
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge variant="secondary">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time Estimates
                </Badge>
              </motion.div>
            </div>
            <motion.h1
              className="text-2xl lg:text-3xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Freight Transit Time Calculator
            </motion.h1>
            <motion.p
              className="text-muted-foreground max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Estimate transit times across ocean, air, rail, and road transport modes. Plan shipments with confidence 
              using historical data, carrier schedules, and seasonal variations for global trade routes.
            </motion.p>
          </div>

          <motion.div
            className="flex gap-2 flex-wrap"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare}>
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Share"}
            </Button>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {results.filter((r) => r.available).slice(0, 4).map((result, index) => {
            const Icon = getModeIcon(result.mode);
            const color = getModeColor(result.mode);
            return (
              <motion.div
                key={result.mode}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * (index + 1) + 0.5 }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 border"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="h-4 w-4" style={{ color }} />
                  <span className="text-sm text-muted-foreground capitalize">{result.mode}</span>
                </div>
                <div className="text-xl font-bold" style={{ color }}>
                  {result.transitDays.avg} days
                </div>
                <div className="text-xs text-muted-foreground">
                  Range: {result.transitDays.min}-{result.transitDays.max} days
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Routes</span>
          </TabsTrigger>
          <TabsTrigger value="analysis" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="guide" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                    Route Selection
                  </CardTitle>
                  <CardDescription>Select origin and destination regions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Origin Region</Label>
                    <Select value={originRegion} onValueChange={setOriginRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {majorPorts[originRegion]?.slice(0, 3).map((p) => (
                        <Badge key={p.code} variant="secondary" className="text-xs">{p.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const t = originRegion;
                        setOriginRegion(destinationRegion);
                        setDestinationRegion(t);
                      }}
                      className="rounded-full"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Destination Region</Label>
                    <Select value={destinationRegion} onValueChange={setDestinationRegion}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {regions.map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {majorPorts[destinationRegion]?.slice(0, 3).map((p) => (
                        <Badge key={p.code} variant="secondary" className="text-xs">{p.name}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[var(--logistics)]" />
                    Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="departure">Departure Date</Label>
                    <Input
                      id="departure"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="buffer">Buffer Days</Label>
                      <Badge variant="outline" className="text-xs">Recommended: 3-7</Badge>
                    </div>
                    <Input
                      id="buffer"
                      type="number"
                      min="0"
                      max="30"
                      value={bufferDays}
                      onChange={(e) => setBufferDays(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Additional days for customs, port handling, and delays
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleExport}>
                  <Download className="h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" className="flex-1 gap-2" onClick={handleShare}>
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                  {copied ? "Copied!" : "Share"}
                </Button>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-[var(--ocean)]" />
                    Transit Time Estimates
                  </CardTitle>
                  <CardDescription>{originRegion} → {destinationRegion}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      {results.filter((r) => r.available).map((result, index) => {
                        const Icon = getModeIcon(result.mode);
                        const color = getModeColor(result.mode);
                        return (
                          <motion.div
                            key={result.mode}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-4 rounded-lg border"
                            style={{ borderColor: `${color}30`, backgroundColor: `${color}05` }}
                          >
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                                  style={{ backgroundColor: `${color}15` }}
                                >
                                  <Icon className="h-5 w-5" style={{ color }} />
                                </div>
                                <div>
                                  <div className="font-semibold capitalize">{result.mode} Freight</div>
                                  <div className="text-xs text-muted-foreground">{getModeDescription(result.mode)}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold" style={{ color }}>{result.transitDays.avg}</div>
                                <div className="text-xs text-muted-foreground">{result.transitDays.min}-{result.transitDays.max} days</div>
                              </div>
                            </div>
                            <Separator className="my-3" />
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-muted-foreground">Departure</div>
                                <div className="font-medium">{formatDate(result.departureDate)}</div>
                              </div>
                              <div>
                                <div className="text-muted-foreground">Expected Arrival</div>
                                <div className="font-medium">{formatDate(result.arrivalDate.avg)}</div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    <Zap className="h-5 w-5 text-amber-600 shrink-0" />
                    <div>
                      <div className="font-semibold text-amber-700 dark:text-amber-300">Planning Tip</div>
                      <p className="text-sm text-amber-600 dark:text-amber-400 mt-1">
                        For time-sensitive cargo, consider air freight despite higher costs. The inventory carrying cost 
                        savings from faster transit often justify the premium. Calculate total landed cost, not just freight rates.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Routes Tab */}
        <TabsContent value="routes" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5 text-[var(--ocean)]" />
                Popular Trade Routes
              </CardTitle>
              <CardDescription>Major shipping lanes with transit times and annual volumes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularRoutes.map((route, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`overflow-hidden h-full ${
                      originRegion === route.origin && destinationRegion === route.destination
                        ? "border-2 border-[var(--ocean)]"
                        : ""
                    }`}>
                      <div
                        className="h-1"
                        style={{
                          backgroundColor: originRegion === route.origin && destinationRegion === route.destination
                            ? OCEAN_BLUE
                            : "#e5e7eb"
                        }}
                      />
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">{route.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {route.origin} → {route.destination}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary">{route.volume}</Badge>
                          <Badge className="bg-[var(--logistics)] text-white">{route.trend} YoY</Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Ship className="h-3 w-3" /> Ocean
                            </div>
                            <div className="font-semibold">{route.seaDays} days</div>
                          </div>
                          <div className="p-2 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-1 text-muted-foreground">
                              <Plane className="h-3 w-3" /> Air
                            </div>
                            <div className="font-semibold">{route.airDays} days</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-[var(--logistics)]" />
                Major Ports by Region
              </CardTitle>
              <CardDescription>Key shipping hubs and their annual container throughput</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(majorPorts).map(([region, ports]) => (
                  <Card key={region} className="overflow-hidden">
                    <div
                      className="h-1"
                      style={{
                        backgroundColor: region === originRegion
                          ? OCEAN_BLUE
                          : region === destinationRegion
                            ? LOGISTICS_GREEN
                            : "#e5e7eb"
                      }}
                    />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        {region}
                        {region === originRegion && <Badge className="bg-[var(--ocean)]">Origin</Badge>}
                        {region === destinationRegion && <Badge className="bg-[var(--logistics)]">Destination</Badge>}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {ports.map((port) => (
                          <div key={port.code} className="flex items-center justify-between p-2 rounded-lg bg-muted/30 text-sm">
                            <div>
                              <div className="font-medium">{port.name}</div>
                              <div className="text-xs text-muted-foreground">{port.code}</div>
                            </div>
                            <Badge variant="secondary">{port.teu} TEU</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                  Transit Time by Mode
                </CardTitle>
                <CardDescription>Comparison of min, average, and max transit days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={comparisonChartData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" unit=" days" className="text-xs" />
                      <YAxis type="category" dataKey="mode" className="text-xs" width={60} />
                      <Tooltip
                        formatter={(value: number) => [`${value} days`, ""]}
                        contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Legend />
                      <Bar dataKey="min" name="Minimum" fill="#22c55e" radius={[0, 4, 4, 0]} />
                      <Bar dataKey="avg" name="Average" fill={OCEAN_BLUE} radius={[0, 4, 4, 0]} />
                      <Bar dataKey="max" name="Maximum" fill="#ef4444" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                  Seasonal Variations
                </CardTitle>
                <CardDescription>How transit times vary throughout the year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={seasonalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" className="text-xs" />
                      <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                      <YAxis yAxisId="right" orientation="right" stroke="#ef4444" />
                      <Tooltip
                        contentStyle={{ backgroundColor: "hsl(var(--background))", border: "1px solid hsl(var(--border))" }}
                      />
                      <Legend />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="ocean"
                        name="Ocean Transit (days)"
                        fill={`${OCEAN_BLUE}30`}
                        stroke={OCEAN_BLUE}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="congestion"
                        name="Congestion Index"
                        stroke="#ef4444"
                        strokeWidth={2}
                        dot={{ fill: "#ef4444" }}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mode Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[var(--ocean)]" />
                Mode Comparison: Speed vs Cost
              </CardTitle>
              <CardDescription>Choose the right transport mode based on your priorities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {modeComparisonData.map((mode) => (
                  <div
                    key={mode.name}
                    className="p-4 rounded-lg border-2 transition-all hover:shadow-lg"
                    style={{ borderColor: `${mode.color}40` }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${mode.color}15` }}
                      >
                        {mode.name === "Ocean" && <Ship className="h-5 w-5" style={{ color: mode.color }} />}
                        {mode.name === "Air" && <Plane className="h-5 w-5" style={{ color: mode.color }} />}
                        {mode.name === "Rail" && <Train className="h-5 w-5" style={{ color: mode.color }} />}
                        {mode.name === "Road" && <Truck className="h-5 w-5" style={{ color: mode.color }} />}
                      </div>
                      <span className="font-semibold">{mode.name}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transit:</span>
                        <span className="font-medium">{mode.days} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="font-medium">{mode.cost}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Speed:</span>
                        <span className="font-medium">{mode.speed}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Seasonal Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[var(--logistics)]" />
                Seasonal Planning Calendar
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                {[
                  { season: "Spring", icon: Leaf, months: "Mar-May", status: "Optimal", color: "#22c55e", tip: "Best rates, good availability" },
                  { season: "Summer", icon: Sun, months: "Jun-Aug", status: "Moderate", color: "#f59e0b", tip: "Watch for hurricanes" },
                  { season: "Fall", icon: Cloud, months: "Sep-Nov", status: "Peak Season", color: "#ef4444", tip: "Book early, higher rates" },
                  { season: "Winter", icon: Snowflake, months: "Dec-Feb", status: "Variable", color: "#3b82f6", tip: "CNY disruptions" },
                ].map((item) => (
                  <div key={item.season} className="p-4 rounded-lg border" style={{ borderColor: `${item.color}40` }}>
                    <div className="flex items-center gap-2 mb-2">
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                      <span className="font-semibold">{item.season}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{item.months}</div>
                    <Badge style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-2">{item.tip}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Pro Tips for Transit Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-3 p-4 bg-muted/30 rounded-lg"
                  >
                    <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Educational Content */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-[var(--ocean)]" />
                  {EDUCATIONAL_CONTENT.factors.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {EDUCATIONAL_CONTENT.factors.content}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-[var(--logistics)]" />
                  {EDUCATIONAL_CONTENT.planning.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {EDUCATIONAL_CONTENT.planning.content}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  {EDUCATIONAL_CONTENT.buffer.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {EDUCATIONAL_CONTENT.buffer.content}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                  {EDUCATIONAL_CONTENT.seasonal.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {EDUCATIONAL_CONTENT.seasonal.content}
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Common questions about freight transit times and planning</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-2">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-2 text-left">
                        <div className="w-6 h-6 rounded-full bg-[var(--ocean)]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[var(--ocean)]">{index + 1}</span>
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed pl-8">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
