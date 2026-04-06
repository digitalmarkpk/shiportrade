"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  AlertTriangle,
  BarChart3,
  Clock,
  Container,
  Gauge,
  MapPin,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Info,
  Calendar,
  Activity,
  Loader2,
  Minus,
  Package,
  Ship,
  Globe,
  Anchor,
  Waves,
  HelpCircle,
  Zap,
  Shield,
  BarChart2,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Brand colors
const COLORS = {
  ocean: "#0F4C81",
  logistics: "#2E8B57",
  warning: "#F59E0B",
  danger: "#EF4444",
  critical: "#DC2626",
  low: "#22C55E",
  medium: "#F59E0B",
  high: "#EF4444",
  criticalLevel: "#991B1B",
  oceanLight: "#1a6fa8",
  logisticsLight: "#3da86a",
};

// Availability levels
type AvailabilityLevel = "critical" | "low" | "medium" | "high";

// Container types
interface ContainerType {
  code: string;
  name: string;
  description: string;
  teu: number;
}

const CONTAINER_TYPES: ContainerType[] = [
  { code: "20GP", name: "20' Standard", description: "20ft General Purpose Container", teu: 1 },
  { code: "40GP", name: "40' Standard", description: "40ft General Purpose Container", teu: 2 },
  { code: "40HC", name: "40' High Cube", description: "40ft High Cube Container", teu: 2 },
  { code: "45HC", name: "45' High Cube", description: "45ft High Cube Container", teu: 2.25 },
  { code: "20RF", name: "20' Reefer", description: "20ft Refrigerated Container", teu: 1 },
  { code: "40RF", name: "40' Reefer", description: "40ft Refrigerated Container", teu: 2 },
  { code: "40HR", name: "40' High Cube Reefer", description: "40ft High Cube Reefer", teu: 2 },
  { code: "20OT", name: "20' Open Top", description: "20ft Open Top Container", teu: 1 },
  { code: "40OT", name: "40' Open Top", description: "40ft Open Top Container", teu: 2 },
  { code: "20FR", name: "20' Flat Rack", description: "20ft Flat Rack Container", teu: 1 },
  { code: "40FR", name: "40' Flat Rack", description: "40ft Flat Rack Container", teu: 2 },
  { code: "20TK", name: "20' Tank", description: "20ft Tank Container", teu: 1 },
];

// Port container availability data
interface PortContainerData {
  unLoCode: string;
  name: string;
  country: string;
  region: string;
  containerData: {
    [containerType: string]: {
      availabilityScore: number;
      availabilityLevel: AvailabilityLevel;
      dwellTime: number;
      trend: "improving" | "stable" | "declining";
      emptyUnits: number;
      totalCapacity: number;
      utilization: number;
      avgWaitForEmpty: number;
      pricePremium: number;
    };
  };
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
}

// Generate port container availability data
const generatePortContainerData = (): PortContainerData[] => {
  const ports = [
    { unLoCode: "CNSHA", name: "Shanghai", country: "China", region: "Asia", lat: 31.3614, lng: 121.5878 },
    { unLoCode: "CNSZX", name: "Shenzhen", country: "China", region: "Asia", lat: 22.4797, lng: 113.9064 },
    { unLoCode: "CNNGB", name: "Ningbo-Zhoushan", country: "China", region: "Asia", lat: 29.8683, lng: 121.5440 },
    { unLoCode: "CNQIN", name: "Qingdao", country: "China", region: "Asia", lat: 36.0671, lng: 120.3826 },
    { unLoCode: "SGSIN", name: "Singapore", country: "Singapore", region: "Asia", lat: 1.2644, lng: 103.8198 },
    { unLoCode: "KRPUS", name: "Busan", country: "South Korea", region: "Asia", lat: 35.1026, lng: 129.0403 },
    { unLoCode: "HKHKG", name: "Hong Kong", country: "Hong Kong", region: "Asia", lat: 22.2855, lng: 114.1577 },
    { unLoCode: "JPYOK", name: "Yokohama", country: "Japan", region: "Asia", lat: 35.4603, lng: 139.7644 },
    { unLoCode: "TWKHH", name: "Kaohsiung", country: "Taiwan", region: "Asia", lat: 22.5619, lng: 120.3147 },
    { unLoCode: "MYPKG", name: "Port Klang", country: "Malaysia", region: "Asia", lat: 3.0019, lng: 101.3933 },
    { unLoCode: "THBKK", name: "Laem Chabang", country: "Thailand", region: "Asia", lat: 13.1014, lng: 100.8858 },
    { unLoCode: "VNHPH", name: "Haiphong", country: "Vietnam", region: "Asia", lat: 20.8519, lng: 106.7042 },
    { unLoCode: "VNSGN", name: "Ho Chi Minh City", country: "Vietnam", region: "Asia", lat: 10.7802, lng: 106.7003 },
    { unLoCode: "IDJKT", name: "Jakarta", country: "Indonesia", region: "Asia", lat: -6.1017, lng: 106.8842 },
    { unLoCode: "PHMNL", name: "Manila", country: "Philippines", region: "Asia", lat: 14.5944, lng: 120.9704 },
    { unLoCode: "INNSA", name: "Nhava Sheva", country: "India", region: "Asia", lat: 18.9639, lng: 72.9492 },
    { unLoCode: "INMAA", name: "Chennai", country: "India", region: "Asia", lat: 13.1239, lng: 80.3003 },
    { unLoCode: "LKCMB", name: "Colombo", country: "Sri Lanka", region: "Asia", lat: 6.9471, lng: 79.8458 },
    { unLoCode: "BDCGP", name: "Chittagong", country: "Bangladesh", region: "Asia", lat: 22.3071, lng: 91.7769 },
    { unLoCode: "AEJEA", name: "Jebel Ali", country: "UAE", region: "Middle East", lat: 25.0072, lng: 55.0266 },
    { unLoCode: "SAJED", name: "Jeddah", country: "Saudi Arabia", region: "Middle East", lat: 21.4814, lng: 39.1822 },
    { unLoCode: "QAHMD", name: "Hamad Port", country: "Qatar", region: "Middle East", lat: 25.0500, lng: 51.6500 },
    { unLoCode: "NLRTM", name: "Rotterdam", country: "Netherlands", region: "Europe", lat: 51.9054, lng: 4.4454 },
    { unLoCode: "BEANR", name: "Antwerp", country: "Belgium", region: "Europe", lat: 51.2640, lng: 4.3983 },
    { unLoCode: "DEHAM", name: "Hamburg", country: "Germany", region: "Europe", lat: 53.5397, lng: 9.9918 },
    { unLoCode: "DEBRV", name: "Bremerhaven", country: "Germany", region: "Europe", lat: 53.5667, lng: 8.5667 },
    { unLoCode: "GBFXT", name: "Felixstowe", country: "UK", region: "Europe", lat: 51.9537, lng: 1.3511 },
    { unLoCode: "GBSOU", name: "Southampton", country: "UK", region: "Europe", lat: 50.9000, lng: -1.4167 },
    { unLoCode: "FRMRS", name: "Marseille", country: "France", region: "Europe", lat: 43.2964, lng: 5.3700 },
    { unLoCode: "FRLEH", name: "Le Havre", country: "France", region: "Europe", lat: 49.4833, lng: 0.1167 },
    { unLoCode: "ESALG", name: "Algeciras", country: "Spain", region: "Europe", lat: 36.1333, lng: -5.4500 },
    { unLoCode: "ESBAR", name: "Barcelona", country: "Spain", region: "Europe", lat: 41.3500, lng: 2.1500 },
    { unLoCode: "ESVLC", name: "Valencia", country: "Spain", region: "Europe", lat: 39.4500, lng: -0.3333 },
    { unLoCode: "ITGOA", name: "Genoa", country: "Italy", region: "Europe", lat: 44.4000, lng: 8.9167 },
    { unLoCode: "GRPIR", name: "Piraeus", country: "Greece", region: "Europe", lat: 37.9500, lng: 23.6500 },
    { unLoCode: "TRIST", name: "Istanbul", country: "Turkey", region: "Europe", lat: 41.0000, lng: 29.0000 },
    { unLoCode: "USLAX", name: "Los Angeles", country: "USA", region: "North America", lat: 33.7405, lng: -118.2716 },
    { unLoCode: "USLGB", name: "Long Beach", country: "USA", region: "North America", lat: 33.7541, lng: -118.2171 },
    { unLoCode: "USNYC", name: "New York/New Jersey", country: "USA", region: "North America", lat: 40.6659, lng: -74.0450 },
    { unLoCode: "USSAV", name: "Savannah", country: "USA", region: "North America", lat: 32.0809, lng: -81.0875 },
    { unLoCode: "USOAK", name: "Oakland", country: "USA", region: "North America", lat: 37.8000, lng: -122.3000 },
    { unLoCode: "USSEA", name: "Seattle", country: "USA", region: "North America", lat: 47.6062, lng: -122.3321 },
    { unLoCode: "CAMTR", name: "Montreal", country: "Canada", region: "North America", lat: 45.5017, lng: -73.5673 },
    { unLoCode: "CAVAN", name: "Vancouver", country: "Canada", region: "North America", lat: 49.2827, lng: -123.1207 },
    { unLoCode: "MXMZL", name: "Manzanillo", country: "Mexico", region: "North America", lat: 19.0544, lng: -104.3213 },
    { unLoCode: "BRSSZ", name: "Santos", country: "Brazil", region: "South America", lat: -23.9618, lng: -46.2833 },
    { unLoCode: "ZADUR", name: "Durban", country: "South Africa", region: "Africa", lat: -29.8587, lng: 31.0218 },
    { unLoCode: "EGSCA", name: "Suez Canal", country: "Egypt", region: "Africa", lat: 30.0444, lng: 31.2357 },
    { unLoCode: "AUSYD", name: "Sydney", country: "Australia", region: "Oceania", lat: -33.8688, lng: 151.2093 },
    { unLoCode: "AUMEL", name: "Melbourne", country: "Australia", region: "Oceania", lat: -37.8136, lng: 144.9631 },
  ];

  return ports.map((port) => {
    const containerData: PortContainerData["containerData"] = {};

    CONTAINER_TYPES.forEach((ct) => {
      const baseScore = Math.floor(Math.random() * 60) + 25;
      const availabilityScore = Math.min(100, Math.max(0, baseScore));
      let availabilityLevel: AvailabilityLevel;

      if (availabilityScore >= 70) availabilityLevel = "high";
      else if (availabilityScore >= 45) availabilityLevel = "medium";
      else if (availabilityScore >= 25) availabilityLevel = "low";
      else availabilityLevel = "critical";

      const trendRandom = Math.random();
      const trend = trendRandom < 0.3 ? "improving" : trendRandom < 0.6 ? "stable" : "declining";

      containerData[ct.code] = {
        availabilityScore,
        availabilityLevel,
        dwellTime: Math.floor(Math.random() * 12) + 2,
        trend,
        emptyUnits: Math.floor(Math.random() * 5000) + 500,
        totalCapacity: Math.floor(Math.random() * 20000) + 5000,
        utilization: Math.floor(Math.random() * 40) + 50,
        avgWaitForEmpty: Math.floor(Math.random() * 10) + 1,
        pricePremium: Math.floor(Math.random() * 30),
      };
    });

    return {
      ...port,
      containerData,
      lastUpdated: new Date(Date.now() - Math.floor(Math.random() * 3600000)).toISOString(),
    };
  });
};

const PORTS_DATA = generatePortContainerData();

// Generate 30-day historical data
const generateHistoricalData = (currentScore: number, trend: string) => {
  const data = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    let score: number;
    if (trend === "improving") {
      score = Math.max(10, currentScore - Math.floor((i / 29) * 15) - 5);
    } else if (trend === "declining") {
      score = Math.min(95, currentScore + Math.floor((i / 29) * 15) + 5);
    } else {
      score = currentScore + Math.floor((Math.random() - 0.5) * 10);
    }

    score = Math.max(5, Math.min(98, score + Math.floor((Math.random() - 0.5) * 6)));

    data.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      availabilityScore: score,
      dwellTime: Math.max(1, Math.floor((100 - score) * 0.1 + Math.random() * 3)),
    });
  }

  return data;
};

// Generate 7-day prediction
const generatePrediction = (historicalData: { availabilityScore: number }[], trend: string) => {
  const predictions = [];
  const lastScore = historicalData[historicalData.length - 1].availabilityScore;
  const today = new Date();

  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);

    let predictedScore: number;
    if (trend === "improving") {
      predictedScore = Math.min(95, lastScore + i * 2 + Math.random() * 5);
    } else if (trend === "declining") {
      predictedScore = Math.max(10, lastScore - i * 2.5 + Math.random() * 5);
    } else {
      predictedScore = lastScore + (Math.random() - 0.5) * 8;
    }

    predictedScore = Math.max(5, Math.min(98, predictedScore));

    predictions.push({
      date: date.toISOString().split("T")[0],
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      predictedScore: Math.floor(predictedScore),
      confidence: Math.max(50, 92 - i * 6),
    });
  }

  return predictions;
};

// Get availability color
const getAvailabilityColor = (level: AvailabilityLevel) => {
  switch (level) {
    case "high": return COLORS.low;
    case "medium": return COLORS.medium;
    case "low": return COLORS.high;
    case "critical": return COLORS.criticalLevel;
  }
};

// Get availability badge
const getAvailabilityBadge = (level: AvailabilityLevel) => {
  switch (level) {
    case "high":
      return <Badge className="bg-green-500 text-white">High</Badge>;
    case "medium":
      return <Badge className="bg-yellow-500 text-white">Medium</Badge>;
    case "low":
      return <Badge className="bg-orange-500 text-white">Low</Badge>;
    case "critical":
      return <Badge className="bg-red-700 text-white animate-pulse">Critical</Badge>;
  }
};

// Gauge Chart Component
const AvailabilityGauge = ({ value, level }: { value: number; level: AvailabilityLevel }) => {
  const data = [
    { name: "availability", value: value },
    { name: "remaining", value: 100 - value },
  ];

  const color = getAvailabilityColor(level);

  return (
    <div className="relative h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="70%"
            outerRadius="100%"
            paddingAngle={0}
            dataKey="value"
          >
            <Cell fill={color} />
            <Cell fill="#e5e7eb" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center pt-8">
        <div className="text-center">
          <div className="text-4xl font-bold" style={{ color }}>
            {value}
          </div>
          <div className="text-sm text-muted-foreground">Availability Index</div>
        </div>
      </div>
    </div>
  );
};

// Alternative Port Card
const AlternativePortCard = ({
  port,
  containerType,
  currentData,
}: {
  port: PortContainerData;
  containerType: string;
  currentData: PortContainerData["containerData"][string];
}) => {
  const portData = port.containerData[containerType];
  const scoreDiff = portData.availabilityScore - currentData.availabilityScore;

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-medium">{port.name}</h4>
            <p className="text-sm text-muted-foreground">{port.country}</p>
          </div>
          {getAvailabilityBadge(portData.availabilityLevel)}
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Score:</span>
            <span className="ml-1 font-medium">{portData.availabilityScore}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Dwell:</span>
            <span className="ml-1 font-medium">{portData.dwellTime} days</span>
          </div>
        </div>
        {scoreDiff > 5 && (
          <div className="mt-2 flex items-center gap-1 text-sm text-green-600">
            <TrendingUp className="h-3 w-3" />
            <span>+{scoreDiff} points better</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// FAQs data
const FAQS_DATA = [
  {
    question: "What is the Container Availability Index?",
    answer: "The Container Availability Index is a real-time metric that measures the ease of obtaining empty containers at a specific port. It ranges from 0-100, with higher scores indicating better availability. The index considers factors like empty container inventory, dwell time, utilization rates, and wait times to provide a comprehensive availability assessment.",
  },
  {
    question: "How often is the availability data updated?",
    answer: "Our container availability data is updated in real-time, with refresh intervals typically every 15-30 minutes depending on the port. Data is sourced from terminal operators, shipping lines, and port authorities to ensure accuracy. You can manually refresh the data at any time using the refresh button.",
  },
  {
    question: "What do the different availability levels mean?",
    answer: "There are four availability levels: High (70-100) indicates containers are readily available with minimal wait times; Medium (45-69) suggests moderate availability where advance booking is recommended; Low (25-44) indicates limited availability with potential delays; Critical (0-24) signals severe shortage requiring immediate action or alternative port consideration.",
  },
  {
    question: "How accurate is the 7-day forecast?",
    answer: "Our forecasting model uses machine learning algorithms trained on historical patterns, seasonal trends, and current market conditions. The confidence level typically starts at 92% for day 1 and decreases by approximately 6% per day. Forecasts are most reliable for stable market conditions and may vary during unexpected disruptions.",
  },
  {
    question: "Why should I consider alternative ports?",
    answer: "Alternative ports with higher availability scores can offer significant benefits including reduced wait times for empty containers, lower price premiums, faster shipment processing, and better negotiation leverage with carriers. Our system automatically identifies and recommends better alternatives within the same region.",
  },
  {
    question: "What factors affect container availability?",
    answer: "Container availability is influenced by multiple factors including global trade imbalances, seasonal demand fluctuations, port congestion, vessel schedule reliability, equipment repositioning strategies of shipping lines, regional economic conditions, and unexpected events like weather disruptions or labor strikes.",
  },
  {
    question: "How is the price premium calculated?",
    answer: "Price premium represents the percentage above standard market rates that shippers typically pay for container equipment at a given port. It reflects the supply-demand imbalance and includes factors like equipment shortage fees, premium handling charges, and spot market rate variations.",
  },
  {
    question: "Can I set up alerts for availability changes?",
    answer: "Yes, you can configure custom alerts for specific ports and container types. Alerts can be set for availability score thresholds, level changes, or significant trend shifts. Notifications can be delivered via email, SMS, or integrated into your existing workflow systems through our API.",
  },
];

interface ContainerAvailabilityIndexProps {
  onPortSelect?: (port: PortContainerData) => void;
}

export function ContainerAvailabilityIndex({ onPortSelect }: ContainerAvailabilityIndexProps) {
  const [selectedPortCode, setSelectedPortCode] = useState<string>("CNSHA");
  const [selectedContainerType, setSelectedContainerType] = useState<string>("40HC");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Get selected port data
  const selectedPort = useMemo(() => {
    return PORTS_DATA.find((p) => p.unLoCode === selectedPortCode) || PORTS_DATA[0];
  }, [selectedPortCode]);

  // Get container data for selected type
  const containerData = useMemo(() => {
    return selectedPort.containerData[selectedContainerType] || selectedPort.containerData["40HC"];
  }, [selectedPort, selectedContainerType]);

  // Generate historical and prediction data
  const historicalData = useMemo(() => {
    return generateHistoricalData(containerData.availabilityScore, containerData.trend);
  }, [containerData]);

  const predictionData = useMemo(() => {
    return generatePrediction(historicalData, containerData.trend);
  }, [historicalData, containerData.trend]);

  // Combined chart data
  const combinedChartData = useMemo(() => {
    return [
      ...historicalData.map((d) => ({ ...d, predicted: null, confidence: null })),
      ...predictionData.map((d) => ({
        ...d,
        availabilityScore: null,
        dwellTime: null,
        predicted: d.predictedScore,
      })),
    ];
  }, [historicalData, predictionData]);

  // Get alternative ports (same region, better availability)
  const alternativePorts = useMemo(() => {
    return PORTS_DATA.filter((p) => p.region === selectedPort.region && p.unLoCode !== selectedPort.unLoCode)
      .filter((p) => p.containerData[selectedContainerType]?.availabilityScore > containerData.availabilityScore)
      .sort((a, b) => b.containerData[selectedContainerType]?.availabilityScore - a.containerData[selectedContainerType]?.availabilityScore)
      .slice(0, 4);
  }, [selectedPort, containerData, selectedContainerType]);

  // Filter ports by region
  const filteredPorts = useMemo(() => {
    if (selectedRegion === "all") return PORTS_DATA;
    return PORTS_DATA.filter((p) => p.region === selectedRegion);
  }, [selectedRegion]);

  // Port comparison data
  const comparisonData = useMemo(() => {
    return [...PORTS_DATA]
      .sort((a, b) => {
        const aScore = a.containerData[selectedContainerType]?.availabilityScore || 0;
        const bScore = b.containerData[selectedContainerType]?.availabilityScore || 0;
        return bScore - aScore;
      })
      .slice(0, 15);
  }, [selectedContainerType]);

  // Regions list
  const regions = useMemo(() => {
    const uniqueRegions = [...new Set(PORTS_DATA.map((p) => p.region))];
    return ["all", ...uniqueRegions];
  }, []);

  // Region distribution data for visualization
  const regionDistribution = useMemo(() => {
    const regionMap = new Map<string, { total: number; available: number }>();
    PORTS_DATA.forEach((port) => {
      const data = port.containerData[selectedContainerType];
      if (!regionMap.has(port.region)) {
        regionMap.set(port.region, { total: 0, available: 0 });
      }
      const current = regionMap.get(port.region)!;
      current.total += data.totalCapacity;
      current.available += data.emptyUnits;
    });
    return Array.from(regionMap.entries()).map(([region, data]) => ({
      region,
      available: data.available,
      total: data.total,
      percentage: Math.round((data.available / data.total) * 100),
    }));
  }, [selectedContainerType]);

  // Container type distribution data
  const containerTypeDistribution = useMemo(() => {
    return CONTAINER_TYPES.slice(0, 6).map((ct) => {
      const data = selectedPort.containerData[ct.code];
      return {
        name: ct.code,
        score: data.availabilityScore,
        fill: data.availabilityScore >= 70 ? COLORS.low : 
              data.availabilityScore >= 45 ? COLORS.medium :
              data.availabilityScore >= 25 ? COLORS.high : COLORS.criticalLevel,
      };
    });
  }, [selectedPort]);

  // Refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-yellow-500" />;
    }
  };

  // Format last updated time
  const formatLastUpdated = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div 
        className="relative overflow-hidden rounded-xl p-8 text-white"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.ocean} 0%, ${COLORS.logistics} 100%)` 
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Wave decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-16 opacity-20">
          <Waves className="w-full h-full text-white" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <Container className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">Container Availability Index</h1>
                  <p className="text-white/80 text-sm mt-1">Real-time global container availability monitoring</p>
                </div>
              </div>
              <p className="text-white/90 max-w-2xl text-sm leading-relaxed">
                Monitor empty container availability across 50+ major ports worldwide. Make informed decisions with 
                real-time data, historical trends, and AI-powered 7-day forecasts.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-4">
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Globe className="h-4 w-4" />
                  <span className="text-2xl font-bold">50+</span>
                </div>
                <span className="text-xs text-white/80">Ports Monitored</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Anchor className="h-4 w-4" />
                  <span className="text-2xl font-bold">12</span>
                </div>
                <span className="text-xs text-white/80">Container Types</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Activity className="h-4 w-4" />
                  <span className="text-2xl font-bold">30</span>
                </div>
                <span className="text-xs text-white/80">Days History</span>
              </div>
              <div className="bg-white/15 backdrop-blur-sm rounded-lg p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Zap className="h-4 w-4" />
                  <span className="text-2xl font-bold">Live</span>
                </div>
                <span className="text-xs text-white/80">Real-time Data</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Region Filter */}
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium mb-1.5 block">Region</label>
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region === "all" ? "All Regions" : region}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Port Selection */}
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium mb-1.5 block">Port</label>
            <Select value={selectedPortCode} onValueChange={setSelectedPortCode}>
              <SelectTrigger>
                <SelectValue placeholder="Select a port" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-64">
                  {filteredPorts.map((port) => (
                    <SelectItem key={port.unLoCode} value={port.unLoCode}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" style={{ color: COLORS.ocean }} />
                        <span>{port.name}</span>
                        <span className="text-muted-foreground text-xs">({port.country})</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>

          {/* Container Type Selection */}
          <div className="flex-1 max-w-xs">
            <label className="text-sm font-medium mb-1.5 block">Container Type</label>
            <Select value={selectedContainerType} onValueChange={setSelectedContainerType}>
              <SelectTrigger>
                <SelectValue placeholder="Select container type" />
              </SelectTrigger>
              <SelectContent>
                <ScrollArea className="h-64">
                  {CONTAINER_TYPES.map((ct) => (
                    <SelectItem key={ct.code} value={ct.code}>
                      <div className="flex items-center gap-2">
                        <Container className="h-3 w-3" style={{ color: COLORS.logistics }} />
                        <span>{ct.name}</span>
                        <span className="text-muted-foreground text-xs">({ct.code})</span>
                      </div>
                    </SelectItem>
                  ))}
                </ScrollArea>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="shrink-0 self-end"
          style={{ borderColor: COLORS.ocean, color: COLORS.ocean }}
        >
          {isRefreshing ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Main Content Tabs - 5 Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-1.5">
            <Gauge className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Trends</span>
          </TabsTrigger>
          <TabsTrigger value="forecast" className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Forecast</span>
          </TabsTrigger>
          <TabsTrigger value="comparison" className="flex items-center gap-1.5">
            <BarChart2 className="h-4 w-4" />
            <span className="hidden sm:inline">Comparison</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex items-center gap-1.5">
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQs</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Gauge & Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Gauge className="h-5 w-5" style={{ color: COLORS.ocean }} />
                    Availability Score
                  </span>
                  {getAvailabilityBadge(containerData.availabilityLevel)}
                </CardTitle>
                <CardDescription>
                  {selectedPort.name}, {selectedPort.country} - {selectedContainerType}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AvailabilityGauge value={containerData.availabilityScore} level={containerData.availabilityLevel} />

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    {getTrendIcon(containerData.trend)}
                    <span className="capitalize">{containerData.trend}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatLastUpdated(selectedPort.lastUpdated)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Middle Column - Key Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Dwell Time */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Dwell Time</span>
                    <Badge variant="outline">{containerData.dwellTime} days</Badge>
                  </div>
                  <Progress value={Math.min(100, containerData.dwellTime * 8)} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Average time containers stay at port</p>
                </div>

                {/* Empty Units Available */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Empty Units Available</span>
                    <Badge variant="outline">{containerData.emptyUnits.toLocaleString()}</Badge>
                  </div>
                  <Progress value={(containerData.emptyUnits / containerData.totalCapacity) * 100} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">of {containerData.totalCapacity.toLocaleString()} total capacity</p>
                </div>

                {/* Utilization */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Yard Utilization</span>
                    <Badge variant="outline">{containerData.utilization}%</Badge>
                  </div>
                  <Progress value={containerData.utilization} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Current yard space usage</p>
                </div>

                {/* Wait for Empty */}
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Wait for Empty</span>
                    <Badge variant="outline">{containerData.avgWaitForEmpty} days</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Avg. wait time to get empty container</p>
                </div>
              </CardContent>
            </Card>

            {/* Right Column - Price & Supply Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" style={{ color: COLORS.logistics }} />
                  Supply Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price Premium */}
                <div className={`p-4 rounded-lg border ${
                  containerData.pricePremium > 20
                    ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800"
                    : containerData.pricePremium > 10
                    ? "bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800"
                    : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Price Premium</span>
                    <span className="text-lg font-bold">+{containerData.pricePremium}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {containerData.pricePremium > 20
                      ? "High premium - consider alternative ports"
                      : containerData.pricePremium > 10
                      ? "Moderate premium - shop around"
                      : "Low premium - favorable rates"}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS.ocean }}>
                      {containerData.emptyUnits.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Empty Units</div>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg text-center">
                    <div className="text-2xl font-bold" style={{ color: COLORS.logistics }}>
                      {containerData.dwellTime}d
                    </div>
                    <div className="text-xs text-muted-foreground">Dwell Time</div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  containerData.availabilityLevel === "high"
                    ? "bg-green-50 dark:bg-green-950/30"
                    : containerData.availabilityLevel === "medium"
                    ? "bg-yellow-50 dark:bg-yellow-950/30"
                    : containerData.availabilityLevel === "low"
                    ? "bg-orange-50 dark:bg-orange-950/30"
                    : "bg-red-50 dark:bg-red-950/30"
                }`}>
                  {containerData.availabilityLevel === "high" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  ) : containerData.availabilityLevel === "critical" ? (
                    <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
                  ) : (
                    <Info className="h-5 w-5 text-yellow-600 shrink-0" />
                  )}
                  <div className="text-sm">
                    <p className="font-medium">
                      {containerData.availabilityLevel === "high"
                        ? "Good Availability"
                        : containerData.availabilityLevel === "medium"
                        ? "Moderate Availability"
                        : containerData.availabilityLevel === "low"
                        ? "Limited Availability"
                        : "Critical Shortage"}
                    </p>
                    <p className="text-muted-foreground">
                      {containerData.availabilityLevel === "high"
                        ? "Containers readily available for booking"
                        : containerData.availabilityLevel === "medium"
                        ? "Some delays possible, book in advance"
                        : containerData.availabilityLevel === "low"
                        ? "Significant delays expected, consider alternatives"
                        : "Severe shortage, immediate action required"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Container Type Distribution - New Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.logistics }} />
                Container Type Availability at {selectedPort.name}
              </CardTitle>
              <CardDescription>
                Availability scores across different container types
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart 
                    cx="50%" 
                    cy="50%" 
                    innerRadius="20%" 
                    outerRadius="90%" 
                    data={containerTypeDistribution} 
                    startAngle={180} 
                    endAngle={0}
                  >
                    {containerTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-4 mt-4">
                {containerTypeDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">({item.score})</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alternative Ports */}
          {alternativePorts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5" style={{ color: COLORS.ocean }} />
                  Alternative Ports with Better Availability
                </CardTitle>
                <CardDescription>
                  Other ports in {selectedPort.region} with higher {selectedContainerType} availability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {alternativePorts.map((port) => (
                    <AlternativePortCard
                      key={port.unLoCode}
                      port={port}
                      containerType={selectedContainerType}
                      currentData={containerData}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Historical Trends Tab */}
        <TabsContent value="trends" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                30-Day Historical Trend
              </CardTitle>
              <CardDescription>
                Container availability score and dwell time over the past 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="availabilityScore"
                      stroke={COLORS.ocean}
                      strokeWidth={2}
                      dot={false}
                      name="Availability Score"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="dwellTime"
                      stroke={COLORS.logistics}
                      strokeWidth={2}
                      dot={false}
                      name="Dwell Time (days)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Region Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" style={{ color: COLORS.logistics }} />
                Global Region Distribution
              </CardTitle>
              <CardDescription>
                Container availability breakdown by region for {selectedContainerType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={regionDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="region" stroke="#6b7280" fontSize={12} />
                    <YAxis stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="available" name="Available Units" fill={COLORS.logistics} />
                    <Bar dataKey="total" name="Total Capacity" fill={COLORS.ocean} opacity={0.5} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Forecast Tab */}
        <TabsContent value="forecast" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" style={{ color: COLORS.logistics }} />
                7-Day Availability Forecast
              </CardTitle>
              <CardDescription>
                Predicted container availability with confidence intervals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={combinedChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                    <YAxis domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="availabilityScore"
                      stroke={COLORS.ocean}
                      fill={COLORS.ocean}
                      fillOpacity={0.2}
                      name="Historical"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke={COLORS.logistics}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: COLORS.logistics }}
                      name="Forecast"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Forecast Table */}
              <div className="mt-6">
                <h4 className="font-medium mb-3">Daily Forecast Details</h4>
                <div className="grid grid-cols-7 gap-2">
                  {predictionData.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-muted/50 rounded-lg text-center"
                    >
                      <div className="text-xs text-muted-foreground mb-1">{day.day}</div>
                      <div className="text-lg font-bold" style={{ color: COLORS.logistics }}>
                        {day.predictedScore}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {day.confidence}% conf.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Comparison Tab */}
        <TabsContent value="comparison" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Port Comparison - {selectedContainerType} Availability
              </CardTitle>
              <CardDescription>
                Compare container availability across major ports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart data={comparisonData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis type="number" domain={[0, 100]} stroke="#6b7280" fontSize={12} />
                    <YAxis dataKey="name" type="category" stroke="#6b7280" fontSize={11} width={100} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey={`containerData.${selectedContainerType}.availabilityScore`} name="Availability Score">
                      {comparisonData.map((entry, index) => {
                        const score = entry.containerData[selectedContainerType]?.availabilityScore || 0;
                        let color = COLORS.low;
                        if (score < 25) color = COLORS.criticalLevel;
                        else if (score < 45) color = COLORS.high;
                        else if (score < 70) color = COLORS.medium;
                        return <Cell key={`cell-${index}`} fill={color} />;
                      })}
                    </Bar>
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              {/* Selected Port Highlight */}
              <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: `${COLORS.ocean}10`, borderColor: `${COLORS.ocean}40` }}>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" style={{ color: COLORS.ocean }} />
                  <span className="font-medium">{selectedPort.name}</span>
                  <span className="text-muted-foreground">currently selected</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5" style={{ color: COLORS.ocean }} />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Everything you need to know about the Container Availability Index
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div 
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: COLORS.ocean }}
                        >
                          {index + 1}
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-12 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Help Card */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div 
                  className="p-4 rounded-full"
                  style={{ backgroundColor: `${COLORS.logistics}20` }}
                >
                  <Shield className="h-8 w-8" style={{ color: COLORS.logistics }} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold mb-2">Need More Help?</h3>
                  <p className="text-muted-foreground text-sm">
                    Our support team is available 24/7 to assist you with any questions about container availability, 
                    port operations, or booking strategies. Get expert guidance for your shipping needs.
                  </p>
                </div>
                <Button 
                  className="shrink-0"
                  style={{ backgroundColor: COLORS.ocean, color: "white" }}
                >
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
