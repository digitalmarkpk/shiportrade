"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ship,
  Container,
  MapPin,
  Clock,
  CheckCircle2,
  Truck,
  Anchor,
  Navigation,
  Search,
  Calendar,
  Package,
  Building2,
  ArrowRight,
  RefreshCw,
  Info,
  Download,
  Share2,
  RotateCcw,
  BarChart3,
  BookOpen,
  HelpCircle,
  Zap,
  Globe,
  Route,
  AlertTriangle,
  Bell,
  FileText,
  ExternalLink,
  Copy,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ComposedChart,
  Line,
} from "recharts";

interface TrackingEvent {
  id: string;
  status: string;
  location: string;
  date: string;
  time: string;
  type: "departure" | "arrival" | "transit" | "customs" | "delivery";
  completed: boolean;
  coordinates?: { lat: number; lng: number };
}

interface PortCall {
  port: string;
  country: string;
  arrival: string;
  departure: string;
  purpose: "load" | "unload" | "transship";
  completed: boolean;
}

interface ContainerInfo {
  containerNumber: string;
  bookingNumber: string;
  vessel: string;
  voyage: string;
  carrier: string;
  origin: string;
  destination: string;
  eta: string;
  status: "in-transit" | "arrived" | "customs" | "delivered";
  events: TrackingEvent[];
  portCalls: PortCall[];
  lastUpdate: string;
}

// Simulated container data
const mockContainers: Record<string, ContainerInfo> = {
  "MSCU1234567": {
    containerNumber: "MSCU1234567",
    bookingNumber: "BK2024001234",
    vessel: "MSC GÜLSÜN",
    voyage: "V.245E",
    carrier: "MSC",
    origin: "Shanghai, China",
    destination: "Los Angeles, USA",
    eta: "2024-02-15",
    status: "in-transit",
    lastUpdate: "2024-01-28 14:30 UTC",
    events: [
      {
        id: "1",
        status: "Container Loaded",
        location: "Shanghai Port, China",
        date: "2024-01-20",
        time: "14:30",
        type: "departure",
        completed: true,
        coordinates: { lat: 31.2304, lng: 121.4737 },
      },
      {
        id: "2",
        status: "Vessel Departed",
        location: "Shanghai Port, China",
        date: "2024-01-21",
        time: "08:00",
        type: "departure",
        completed: true,
        coordinates: { lat: 31.2304, lng: 121.4737 },
      },
      {
        id: "3",
        status: "Transshipped",
        location: "Busan Port, South Korea",
        date: "2024-01-25",
        time: "16:45",
        type: "transit",
        completed: true,
        coordinates: { lat: 35.1796, lng: 129.0756 },
      },
      {
        id: "4",
        status: "In Transit",
        location: "Pacific Ocean",
        date: "2024-01-28",
        time: "—",
        type: "transit",
        completed: true,
      },
      {
        id: "5",
        status: "Arriving Soon",
        location: "Los Angeles Port, USA",
        date: "2024-02-15",
        time: "Est. 06:00",
        type: "arrival",
        completed: false,
        coordinates: { lat: 33.7361, lng: -118.2628 },
      },
      {
        id: "6",
        status: "Customs Clearance",
        location: "Los Angeles, USA",
        date: "Est. 2024-02-16",
        time: "—",
        type: "customs",
        completed: false,
      },
      {
        id: "7",
        status: "Out for Delivery",
        location: "Los Angeles, USA",
        date: "Est. 2024-02-18",
        time: "—",
        type: "delivery",
        completed: false,
      },
    ],
    portCalls: [
      { port: "Shanghai", country: "China", arrival: "2024-01-19", departure: "2024-01-21", purpose: "load", completed: true },
      { port: "Busan", country: "South Korea", arrival: "2024-01-25", departure: "2024-01-26", purpose: "transship", completed: true },
      { port: "Los Angeles", country: "USA", arrival: "2024-02-15", departure: "—", purpose: "unload", completed: false },
    ],
  },
  "MAEU7654321": {
    containerNumber: "MAEU7654321",
    bookingNumber: "BK2024005678",
    vessel: "MAERSK EDINBURGH",
    voyage: "V.128S",
    carrier: "Maersk",
    origin: "Rotterdam, Netherlands",
    destination: "New York, USA",
    eta: "2024-02-10",
    status: "customs",
    lastUpdate: "2024-02-10 09:15 UTC",
    events: [
      {
        id: "1",
        status: "Container Loaded",
        location: "Rotterdam Port, Netherlands",
        date: "2024-01-25",
        time: "10:00",
        type: "departure",
        completed: true,
        coordinates: { lat: 51.9244, lng: 4.4777 },
      },
      {
        id: "2",
        status: "Vessel Departed",
        location: "Rotterdam Port, Netherlands",
        date: "2024-01-26",
        time: "18:30",
        type: "departure",
        completed: true,
      },
      {
        id: "3",
        status: "Vessel Arrived",
        location: "New York Port, USA",
        date: "2024-02-08",
        time: "14:00",
        type: "arrival",
        completed: true,
        coordinates: { lat: 40.6892, lng: -74.0445 },
      },
      {
        id: "4",
        status: "Container Discharged",
        location: "New York Port, USA",
        date: "2024-02-09",
        time: "08:30",
        type: "arrival",
        completed: true,
      },
      {
        id: "5",
        status: "Customs Clearance",
        location: "New York, USA",
        date: "2024-02-10",
        time: "In Progress",
        type: "customs",
        completed: false,
      },
      {
        id: "6",
        status: "Out for Delivery",
        location: "New York, USA",
        date: "Est. 2024-02-12",
        time: "—",
        type: "delivery",
        completed: false,
      },
    ],
    portCalls: [
      { port: "Rotterdam", country: "Netherlands", arrival: "2024-01-24", departure: "2024-01-26", purpose: "load", completed: true },
      { port: "New York", country: "USA", arrival: "2024-02-08", departure: "—", purpose: "unload", completed: false },
    ],
  },
};

const statusColors: Record<string, string> = {
  "in-transit": "bg-blue-500",
  "arrived": "bg-green-500",
  "customs": "bg-amber-500",
  "delivered": "bg-[var(--logistics)]",
};

const eventTypeIcons: Record<string, typeof Ship> = {
  departure: Ship,
  arrival: Anchor,
  transit: Navigation,
  customs: Building2,
  delivery: Truck,
};

const FAQS = [
  {
    question: "How do I track a container?",
    answer: "To track a container, you need the container number, which is typically an 11-character alphanumeric code (e.g., MSCU1234567). Enter this number in the tracking search box above and click the Track button. The system will retrieve real-time information about your container's current location, status, vessel details, and estimated arrival time. You can also track through carrier websites or third-party tracking platforms. For the most accurate results, use the container number provided on your bill of lading or booking confirmation.",
  },
  {
    question: "What is a container number and where can I find it?",
    answer: "A container number is a unique 11-character identification code assigned to every shipping container. It consists of 4 letters (owner code + equipment category) followed by 6 digits (serial number) and a check digit. For example, in 'MSCU1234567', 'MSCU' identifies MSC as the owner, '123456' is the serial number, and '7' is the check digit. You can find this number on your booking confirmation, bill of lading, shipping instructions, or physically printed on the container's exterior on all four sides and the roof.",
  },
  {
    question: "What do the different tracking statuses mean?",
    answer: "Tracking statuses indicate the current stage of your shipment: 'In Transit' means the container is on a vessel moving between ports; 'Arrived' indicates the vessel has reached the destination port; 'Customs' means the container is undergoing customs clearance; 'Delivered' confirms the container has been released to the consignee. Other common statuses include 'Loading' (being loaded onto vessel), 'Discharged' (removed from vessel), 'Gate In/Out' (container entering/exiting terminal), and 'Transshipment' (transferred between vessels at an intermediate port).",
  },
  {
    question: "How often is container tracking information updated?",
    answer: "Container tracking information is typically updated at key milestone events rather than in real-time. Updates occur when containers pass through port gates, are loaded or discharged from vessels, clear customs, or change custody. Major carriers usually update their systems within 1-6 hours of these events. Vessel positions are updated more frequently (every few hours) via AIS transponders. During ocean transit, there may be gaps of several days between updates until the vessel approaches the next port. Always check the 'last update' timestamp to gauge information freshness.",
  },
  {
    question: "What should I do if my container is delayed?",
    answer: "If your container is delayed, first check the tracking details for the reason—common causes include port congestion, adverse weather, vessel schedule changes, or customs holds. Contact your freight forwarder or carrier's customer service for specific information. If the delay impacts your supply chain significantly, consider: activating contingency plans, communicating with customers about revised delivery dates, checking if demurrage/detention charges apply, and reviewing your contract for delay compensation clauses. For recurring delays on critical shipments, consider alternative routes or carriers for future bookings.",
  },
  {
    question: "What is the difference between tracking and tracing?",
    answer: "While often used interchangeably, tracking and tracing serve different purposes in logistics. Tracking refers to real-time monitoring of a shipment's current location and status—you track where your container is right now. Tracing involves reconstructing the historical path and events of a shipment—you trace where your container has been. Tracking is proactive, helping you manage current shipments, while tracing is often reactive, used for investigating issues, resolving disputes, or auditing supply chain performance. Modern tracking systems combine both capabilities to provide complete shipment visibility.",
  },
  {
    question: "Can I track multiple containers at once?",
    answer: "Yes, most tracking platforms support bulk or batch tracking. You can enter multiple container numbers separated by commas, spaces, or line breaks. Some platforms allow you to save container lists for regular monitoring or set up automated email notifications for status changes. Advanced features may include dashboard views showing all your shipments on a single screen, exception alerts for delayed or problematic containers, and export capabilities for reporting. Enterprise users often integrate tracking APIs directly into their supply chain management systems for seamless monitoring of hundreds or thousands of containers.",
  },
];

const EDUCATION_SECTIONS = [
  {
    title: "How Container Tracking Works",
    content: `Container tracking relies on multiple interconnected systems to provide shipment visibility throughout the supply chain. At the port level, Terminal Operating Systems (TOS) record container movements as they pass through gates, are stacked in yards, or are loaded onto vessels. These systems use OCR (Optical Character Recognition) cameras, RFID tags, and manual scanning to capture container numbers and timestamps. When containers are loaded onto vessels, the information is transmitted to carrier management systems along with vessel schedules and voyage numbers.`,
    icon: Globe,
  },
  {
    title: "Understanding Tracking Status",
    content: `Each tracking status represents a specific milestone in the container's journey. The status hierarchy typically progresses from Booking Confirmed → Gate In (at origin) → Loaded on Vessel → In Transit → Vessel Arrived → Discharged → Customs Clearance → Gate Out (at destination) → Delivered. Understanding these statuses helps you anticipate next steps and identify potential delays. For example, extended time in 'Customs Clearance' may indicate documentation issues requiring your attention, while 'In Transit' status with no updates for an unusual period might signal vessel schedule changes.`,
    icon: Info,
  },
  {
    title: "Common Shipping Terms",
    content: `Understanding shipping terminology is essential for interpreting tracking information correctly. Key terms include: ETA (Estimated Time of Arrival) - the expected date/time at destination; ETD (Estimated Time of Departure) - the expected departure date/time; POD (Port of Discharge) - where cargo is unloaded from the vessel; POL (Port of Loading) - where cargo is loaded onto the vessel; TEU (Twenty-foot Equivalent Unit) - standard container measurement; Bill of Lading (B/L) - the contract between shipper and carrier; Demurrage - charges for container detention at port beyond free days; Detention - charges for container retention beyond agreed period.`,
    icon: BookOpen,
  },
  {
    title: "What to Do When Shipments Are Delayed",
    content: `When tracking shows delays, take proactive steps to minimize impact on your supply chain. First, identify the delay cause through tracking details or carrier communication. Common causes include port congestion (especially at major hubs), vessel mechanical issues, weather disruptions, labor strikes, or customs inspections. For time-sensitive cargo, explore alternatives: expedited customs clearance programs, transshipment to faster services, or alternative port routing. Document all communications and additional costs for potential claims. Maintain buffer inventory for critical items and communicate transparently with customers about revised delivery expectations. Consider freight insurance that covers delay-related losses.`,
    icon: AlertTriangle,
  },
];

export function ContainerTracking() {
  const [searchQuery, setSearchQuery] = useState("");
  const [containerData, setContainerData] = useState<ContainerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("track");

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setError("Please enter a container number");
      return;
    }

    setIsLoading(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      const container = mockContainers[searchQuery.toUpperCase()];
      if (container) {
        setContainerData(container);
        setError("");
      } else {
        setError("Container not found. Try: MSCU1234567 or MAEU7654321");
        setContainerData(null);
      }
      setIsLoading(false);
    }, 1500);
  };

  const getProgressPercentage = () => {
    if (!containerData) return 0;
    const completedEvents = containerData.events.filter((e) => e.completed).length;
    return (completedEvents / containerData.events.length) * 100;
  };

  const resetForm = () => {
    setSearchQuery("");
    setContainerData(null);
    setError("");
  };

  // Chart data
  const timelineChartData = useMemo(() => {
    if (!containerData) return [];
    return containerData.events.map((event, index) => ({
      name: event.status.substring(0, 15),
      progress: ((index + 1) / containerData.events.length) * 100,
      completed: event.completed ? 100 : 0,
      index: index + 1,
    }));
  }, [containerData]);

  const milestoneData = useMemo(() => {
    if (!containerData) return [];
    const completed = containerData.events.filter((e) => e.completed).length;
    const pending = containerData.events.length - completed;
    return [
      { name: "Completed", value: completed, fill: "#2E8B57" },
      { name: "Pending", value: pending, fill: "#E5E7EB" },
    ];
  }, [containerData]);

  const journeyProgressData = useMemo(() => {
    if (!containerData) return [];
    const progress = getProgressPercentage();
    return [
      { stage: "Origin", progress: 100, fill: "#0F4C81" },
      { stage: "Transit", progress: Math.min(progress, 85), fill: "#2E8B57" },
      { stage: "Destination", progress: Math.max(0, progress - 70), fill: "#F59E0B" },
    ];
  }, [containerData]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-6 border">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--logistics)]/5 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Ship className="h-3 w-3 mr-1" />
                  Ocean Freight
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-time Tracking
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Container Tracking System
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Track your shipping containers in real-time across global trade routes. Get instant visibility into 
              vessel positions, port calls, customs status, and estimated arrival times for informed supply chain decisions.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" disabled={!containerData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" disabled={!containerData}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="track" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Track</span>
          </TabsTrigger>
          <TabsTrigger value="status" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Status</span>
          </TabsTrigger>
          <TabsTrigger value="route" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Route</span>
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

        {/* Track Tab */}
        <TabsContent value="track" className="space-y-6">
          {/* Search Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Container className="h-5 w-5 text-[var(--logistics)]" />
                Track Your Container
              </CardTitle>
              <CardDescription>
                Enter your container number to get real-time tracking information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter container number (e.g., MSCU1234567)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="pl-10 font-mono"
                  />
                </div>
                <Button onClick={handleSearch} disabled={isLoading}>
                  {isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Track
                    </>
                  )}
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 mt-2">{error}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Demo containers: MSCU1234567, MAEU7654321
              </p>
            </CardContent>
          </Card>

          {/* Results Section */}
          <AnimatePresence mode="wait">
            {containerData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Status Overview */}
                <Card className="overflow-hidden">
                  <div className={`h-2 ${statusColors[containerData.status]}`} />
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-2xl font-mono flex items-center gap-2">
                          {containerData.containerNumber}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(containerData.containerNumber)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardTitle>
                        <CardDescription>
                          Booking: {containerData.bookingNumber}
                        </CardDescription>
                      </div>
                      <Badge className={`${statusColors[containerData.status]} text-white`}>
                        {containerData.status.replace("-", " ").toUpperCase()}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Journey Progress</span>
                        <span className="font-medium">{Math.round(getProgressPercentage())}%</span>
                      </div>
                      <div className="h-3 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)]"
                          initial={{ width: 0 }}
                          animate={{ width: `${getProgressPercentage()}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          Origin
                        </div>
                        <div className="font-medium">{containerData.origin}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <MapPin className="h-4 w-4" />
                          Destination
                        </div>
                        <div className="font-medium">{containerData.destination}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Ship className="h-4 w-4" />
                          Vessel
                        </div>
                        <div className="font-medium">{containerData.vessel}</div>
                        <div className="text-xs text-muted-foreground">{containerData.voyage}</div>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Calendar className="h-4 w-4" />
                          ETA
                        </div>
                        <div className="font-medium">{containerData.eta}</div>
                      </div>
                    </div>

                    {/* Last Update */}
                    <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                      <Bell className="h-3 w-3" />
                      Last updated: {containerData.lastUpdate}
                    </div>
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-[var(--ocean)]" />
                      Tracking Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {containerData.events.map((event, index) => {
                        const EventIcon = eventTypeIcons[event.type];
                        const isLast = index === containerData.events.length - 1;
                        
                        return (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="relative flex gap-4 pb-8"
                          >
                            {/* Timeline Line */}
                            {!isLast && (
                              <div
                                className={`absolute left-[18px] top-10 w-0.5 h-full ${
                                  event.completed ? "bg-[var(--logistics)]" : "bg-muted"
                                }`}
                              />
                            )}
                            
                            {/* Icon */}
                            <div
                              className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                                event.completed
                                  ? "bg-[var(--logistics)] text-white"
                                  : "bg-muted text-muted-foreground border-2 border-dashed border-muted-foreground/30"
                              }`}
                            >
                              {event.completed ? (
                                <CheckCircle2 className="h-5 w-5" />
                              ) : (
                                <EventIcon className="h-4 w-4" />
                              )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 pb-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="font-medium">{event.status}</div>
                                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {event.location}
                                  </div>
                                </div>
                                <div className="text-right text-sm">
                                  <div className={event.completed ? "font-medium" : "text-muted-foreground"}>
                                    {event.date}
                                  </div>
                                  <div className="text-muted-foreground text-xs">{event.time}</div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Additional Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Package className="h-4 w-4 text-[var(--logistics)]" />
                        Container Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Container Number</span>
                          <span className="font-mono">{containerData.containerNumber}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Carrier</span>
                          <span>{containerData.carrier}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type</span>
                          <span>40&apos; High Cube</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service</span>
                          <span>FCL (Full Container Load)</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Info className="h-4 w-4 text-[var(--ocean)]" />
                        Need Help?
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p className="mb-4">
                        For detailed information about your shipment or to report issues, 
                        contact the carrier directly.
                      </p>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <Building2 className="h-4 w-4 mr-2" />
                          Contact {containerData.carrier}
                        </Button>
                        <Button variant="outline" className="w-full justify-start" size="sm">
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh Tracking Data
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Empty State */}
          {!containerData && !isLoading && (
            <Card className="bg-muted/30">
              <CardContent className="py-12 text-center">
                <Container className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">Track Your Shipment</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Enter a container number above to view real-time tracking information, 
                  including vessel details, port calls, and estimated arrival times.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Status Tab */}
        <TabsContent value="status" className="space-y-6">
          {containerData ? (
            <>
              {/* Current Status Card */}
              <Card className="overflow-hidden">
                <div className={`h-2 ${statusColors[containerData.status]}`} />
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-[var(--ocean)]" />
                    Current Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <div className={`text-4xl font-bold ${containerData.status === 'in-transit' ? 'text-blue-500' : containerData.status === 'arrived' ? 'text-green-500' : containerData.status === 'customs' ? 'text-amber-500' : 'text-[var(--logistics)]'}`}>
                        {Math.round(getProgressPercentage())}%
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Journey Complete</div>
                      <Progress value={getProgressPercentage()} className="mt-3 h-2" />
                    </div>
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <div className="text-4xl font-bold text-[var(--ocean)]">
                        {containerData.events.filter((e) => e.completed).length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Milestones Completed</div>
                    </div>
                    <div className="text-center p-6 bg-muted/30 rounded-lg">
                      <div className="text-4xl font-bold text-[var(--logistics)]">
                        {containerData.events.length - containerData.events.filter((e) => e.completed).length}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Remaining Steps</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visualizations */}
              <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                      Journey Progress Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timelineChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={60} />
                          <YAxis domain={[0, 100]} />
                          <Tooltip formatter={(value: number) => `${value}%`} />
                          <Area
                            type="monotone"
                            dataKey="progress"
                            name="Progress"
                            stroke="#0F4C81"
                            fill="#0F4C81"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-[var(--logistics)]" />
                      Milestone Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={milestoneData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {milestoneData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Milestone Progress Bars */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitBranch className="h-5 w-5 text-[var(--logistics)]" />
                    Stage Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {journeyProgressData.map((stage, index) => (
                      <div key={index}>
                        <div className="flex justify-between text-sm mb-1">
                          <span>{stage.stage}</span>
                          <span className="font-medium">{stage.progress}%</span>
                        </div>
                        <Progress
                          value={stage.progress}
                          className="h-2"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Container Selected</h3>
                <p className="text-muted-foreground">
                  Please search for a container in the Track tab to view status details.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("track")}>
                  Go to Track Tab
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Route Tab */}
        <TabsContent value="route" className="space-y-6">
          {containerData ? (
            <>
              {/* Visual Route Map */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-[var(--ocean)]" />
                    Visual Route Map
                  </CardTitle>
                  <CardDescription>
                    Container journey from {containerData.origin} to {containerData.destination}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Simple visual route representation */}
                  <div className="relative py-8">
                    <div className="absolute left-0 right-0 top-1/2 h-1 bg-muted rounded-full" />
                    <motion.div
                      className="absolute left-0 top-1/2 h-1 bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                    
                    {/* Port markers */}
                    {containerData.portCalls.map((port, index) => {
                      const position = (index / (containerData.portCalls.length - 1)) * 100;
                      return (
                        <motion.div
                          key={index}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: `${position}%` }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.2 }}
                        >
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            port.completed
                              ? "bg-[var(--logistics)] border-[var(--logistics)] text-white"
                              : "bg-background border-muted-foreground/30 text-muted-foreground"
                          }`}>
                            {port.completed ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <Anchor className="h-3 w-3" />
                            )}
                          </div>
                          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                            <div className="font-medium text-sm">{port.port}</div>
                            <div className="text-xs text-muted-foreground">{port.country}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                    
                    {/* Vessel indicator */}
                    <motion.div
                      className="absolute top-1/2 -translate-y-1/2 z-10"
                      style={{ left: `${Math.min(getProgressPercentage(), 95)}%` }}
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)] flex items-center justify-center shadow-lg">
                        <Ship className="h-4 w-4 text-white" />
                      </div>
                    </motion.div>
                  </div>
                  
                  {/* Route Legend */}
                  <div className="flex justify-center gap-6 mt-16 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--logistics)]" />
                      <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[var(--ocean)]" />
                      <span>In Transit</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border border-muted-foreground/30" />
                      <span>Pending</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Port Calls Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Anchor className="h-5 w-5 text-[var(--logistics)]" />
                    Port Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Port</th>
                          <th className="text-left p-3">Country</th>
                          <th className="text-left p-3">Arrival</th>
                          <th className="text-left p-3">Departure</th>
                          <th className="text-left p-3">Purpose</th>
                          <th className="text-left p-3">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {containerData.portCalls.map((port, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{port.port}</td>
                            <td className="p-3">{port.country}</td>
                            <td className="p-3">{port.arrival}</td>
                            <td className="p-3">{port.departure}</td>
                            <td className="p-3">
                              <Badge variant="outline" className={
                                port.purpose === "load" ? "border-green-500 text-green-600" :
                                port.purpose === "unload" ? "border-blue-500 text-blue-600" :
                                "border-amber-500 text-amber-600"
                              }>
                                {port.purpose}
                              </Badge>
                            </td>
                            <td className="p-3">
                              {port.completed ? (
                                <Badge className="bg-[var(--logistics)] text-white">Completed</Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card className="bg-muted/30">
              <CardContent className="py-12 text-center">
                <Route className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Container Selected</h3>
                <p className="text-muted-foreground">
                  Please search for a container in the Track tab to view route details.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("track")}>
                  Go to Track Tab
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {EDUCATION_SECTIONS.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <section.icon className="h-5 w-5 text-[var(--ocean)]" />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-500" />
                Pro Tips for Container Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "Bookmark Your Containers", desc: "Save frequently used container numbers for quick access" },
                  { title: "Set Up Notifications", desc: "Enable email or SMS alerts for status changes" },
                  { title: "Verify Number Format", desc: "Ensure 11 characters: 4 letters + 6 digits + 1 check digit" },
                  { title: "Check Multiple Sources", desc: "Cross-reference with carrier websites for accuracy" },
                  { title: "Document Everything", desc: "Save tracking screenshots for claims or disputes" },
                  { title: "Plan for Delays", desc: "Build buffer time into your supply chain planning" },
                ].map((tip, index) => (
                  <div key={index} className="p-3 bg-muted/30 rounded-lg">
                    <h4 className="font-medium text-sm mb-1">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground">{tip.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Find answers to common questions about container tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="text-left font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Additional Resources */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-[var(--logistics)]" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Carrier Tracking Portals</div>
                      <div className="text-xs text-muted-foreground">Direct links to major carrier tracking systems</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Container Number Validator</div>
                      <div className="text-xs text-muted-foreground">Verify container number format and check digit</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Vessel Schedule Database</div>
                      <div className="text-xs text-muted-foreground">Check vessel routes and estimated schedules</div>
                    </div>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start gap-3">
                    <ExternalLink className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                    <div className="text-left">
                      <div className="font-medium">Port Community Systems</div>
                      <div className="text-xs text-muted-foreground">Access port-specific tracking and documentation</div>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
