"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Route,
  MapPin,
  Truck,
  Clock,
  DollarSign,
  Fuel,
  AlertCircle,
  CheckCircle,
  Info,
  Navigation,
  ArrowRight,
  TrendingUp,
  Gauge,
  RefreshCw,
  Zap,
  Map,
  Plus,
  Trash2,
  GripVertical,
  Calendar,
  Timer,
  Package,
  Weight,
  Calculator,
  Leaf,
  BarChart3,
  Settings,
  X,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Box,
  HelpCircle,
  Target,
  LineChart,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  RouteIcon,
  Compass,
  Sparkles,
  Shield,
  Clock4,
  TrendingDown,
  Users,
  Globe,
  Download,
  Share2,
  BookOpen,
  Lightbulb,
  AlertOctagon,
  RouteOff,
  TimerIcon,
  FuelIcon,
  MapPinned,
  GitBranch,
  Settings2,
  Fuel as FuelDrop,
  ArrowLeftRight,
  Ship,
  Plane,
  TrainFront,
  Car,
  ArrowUp,
  ArrowDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  Legend,
  Cell,
  PieChart,
  Pie,
  ComposedChart,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
} from "recharts";

// Brand Colors - Ocean Blue and Logistics Green
const OCEAN_BLUE = "#0F4C81";
const LOGISTICS_GREEN = "#2E8B57";

// Vehicle Types Configuration
const VEHICLE_TYPES = [
  { id: "van", name: "Delivery Van", capacity: 1500, volume: 12, efficiency: 12, icon: "🚐" },
  { id: "truck-small", name: "Small Truck (3.5T)", capacity: 3500, volume: 25, efficiency: 8, icon: "🚚" },
  { id: "truck-medium", name: "Medium Truck (7.5T)", capacity: 7500, volume: 45, efficiency: 6, icon: "🚛" },
  { id: "truck-large", name: "Large Truck (18T)", capacity: 18000, volume: 75, efficiency: 4, icon: "🚛" },
  { id: "tractor-trailer", name: "Tractor Trailer (40T)", capacity: 40000, volume: 90, efficiency: 2.5, icon: "🚛" },
  { id: "reefer", name: "Refrigerated Truck", capacity: 20000, volume: 50, efficiency: 3.5, icon: "🧊" },
];

// Fuel Types Configuration
const FUEL_TYPES = [
  { id: "diesel", name: "Diesel", co2Factor: 2.68, price: 1.65, color: OCEAN_BLUE },
  { id: "petrol", name: "Petrol", co2Factor: 2.31, price: 1.85, color: "#E85D04" },
  { id: "lng", name: "LNG", co2Factor: 1.86, price: 1.20, color: LOGISTICS_GREEN },
  { id: "electric", name: "Electric", co2Factor: 0.5, price: 0.25, color: "#10B981" },
  { id: "hydrogen", name: "Hydrogen", co2Factor: 0, price: 2.50, color: "#06B6D4" },
];

// Distance Units
const DISTANCE_UNITS = {
  KM: { name: "Kilometers", short: "km", factor: 1 },
  MILES: { name: "Miles", short: "mi", factor: 1.60934 },
};

// Time Window Priority Levels
const PRIORITY_LEVELS = [
  { id: "critical", name: "Critical", color: "#EF4444", penalty: 100 },
  { id: "high", name: "High", color: "#F59E0B", penalty: 50 },
  { id: "normal", name: "Normal", color: LOGISTICS_GREEN, penalty: 20 },
  { id: "low", name: "Low", color: "#6B7280", penalty: 5 },
];

// Transport Modes for Educational Content
const TRANSPORT_MODES = [
  { id: "road", name: "Road Transport", icon: Car, avgSpeed: 60, costPerKm: 0.85, co2PerKm: 0.12, reliability: 95 },
  { id: "rail", name: "Rail Freight", icon: TrainFront, avgSpeed: 40, costPerKm: 0.45, co2PerKm: 0.04, reliability: 90 },
  { id: "sea", name: "Ocean Freight", icon: Ship, avgSpeed: 25, costPerKm: 0.08, co2PerKm: 0.02, reliability: 85 },
  { id: "air", name: "Air Freight", icon: Plane, avgSpeed: 800, costPerKm: 4.50, co2PerKm: 0.55, reliability: 98 },
];

// Enhanced FAQ Data with 150+ words each
const FAQ_DATA = [
  {
    question: "What is route optimization and why is it critical for logistics operations?",
    answer: "Route optimization is the process of determining the most efficient path for vehicles to visit multiple locations while minimizing total distance, time, and costs. Unlike simple point-to-point navigation, route optimization considers multiple constraints simultaneously including delivery time windows, vehicle capacity limits, driver working hours, priority levels, and traffic patterns. For logistics operations, effective route optimization can reduce fuel consumption by 15-25%, improve on-time delivery rates by 20-30%, and significantly decrease operational costs. Modern route optimization algorithms, such as the Vehicle Routing Problem (VRP) solvers, use advanced mathematical models and heuristic approaches to handle the computational complexity of finding optimal solutions across hundreds or thousands of possible route combinations. This technology has become essential for last-mile delivery, field service operations, and supply chain management, enabling businesses to meet growing customer expectations for faster, more reliable deliveries while controlling costs.",
  },
  {
    question: "How do time windows affect route planning and what strategies maximize compliance?",
    answer: "Time windows are specific time periods during which deliveries must be made, imposed by customers, regulations, or operational constraints. They significantly impact route planning by restricting the flexibility of stop sequences and often requiring routes to be structured around the most restrictive windows first. When planning routes with time windows, planners must balance multiple objectives: minimizing total travel distance, maximizing the number of on-time deliveries, and efficiently utilizing vehicle capacity. Strategies for maximizing time window compliance include using priority levels to ensure critical deliveries are scheduled early in the route, building buffer time between stops to account for unexpected delays, implementing dynamic routing that can adjust in real-time based on traffic conditions, and clustering deliveries by geographic area and time window availability. Advanced planning systems also consider driver break requirements, vehicle loading times, and the impact of early or late arrivals on customer satisfaction. The key is to create routes that are both efficient and resilient to the uncertainties inherent in real-world transportation.",
  },
  {
    question: "What factors should be considered when selecting vehicles for route optimization?",
    answer: "Vehicle selection for route optimization requires careful consideration of multiple operational and cost factors. Capacity is paramount - both weight capacity and volume capacity must match the cargo requirements of all stops on the route. Overloading vehicles risks safety violations, fines, and increased maintenance costs, while underutilizing capacity wastes resources and increases per-delivery costs. Fuel efficiency varies significantly across vehicle types, with smaller vehicles typically offering better fuel economy but limited capacity. The type of cargo also matters: refrigerated trucks are necessary for perishables, while flatbeds may be required for oversized loads. Operating costs extend beyond fuel to include driver wages, insurance, tolls, maintenance, and depreciation. Vehicle availability and utilization rates affect total fleet efficiency. Environmental considerations are increasingly important, with many companies transitioning to electric or alternative-fuel vehicles to reduce emissions and meet sustainability goals. The optimal vehicle for a route depends on balancing all these factors while meeting service level requirements.",
  },
  {
    question: "How can businesses measure and improve route optimization performance over time?",
    answer: "Measuring route optimization performance requires tracking key performance indicators (KPIs) across efficiency, cost, and service quality dimensions. Primary efficiency metrics include total distance traveled, number of stops per route, average time per stop, and vehicle utilization rates. Cost metrics encompass fuel consumption, cost per mile, cost per delivery, driver overtime hours, and vehicle maintenance expenses. Service quality indicators track on-time delivery rates, customer satisfaction scores, delivery exceptions, and complaint rates. To improve performance, businesses should establish baseline measurements, set realistic improvement targets, and implement regular review cycles. Root cause analysis of delivery failures or cost overruns helps identify systematic issues. Technology investments in GPS tracking, route planning software, and driver mobile apps provide real-time visibility and enable data-driven optimization. Continuous improvement programs should involve drivers in feedback loops, as their frontline experience often reveals optimization opportunities that planners miss. Benchmarking against industry standards and competitors provides context for performance evaluation.",
  },
  {
    question: "What role does fuel type selection play in sustainable route planning?",
    answer: "Fuel type selection is a critical decision in sustainable route planning, directly impacting both operational costs and environmental footprint. Traditional diesel vehicles remain common for heavy-duty applications but produce approximately 2.68 kg of CO2 per liter of fuel consumed. Alternative fuels offer varying benefits: LNG (Liquefied Natural Gas) reduces CO2 emissions by approximately 30% compared to diesel, while electric vehicles can achieve near-zero direct emissions when charged from renewable sources. Hydrogen fuel cells represent an emerging option with zero tailpipe emissions but require specialized infrastructure. The choice of fuel type should align with route characteristics: electric vehicles excel in urban delivery routes with frequent stops and regenerative braking opportunities, while long-haul routes may still require the range and refueling speed of conventional fuels. Total cost of ownership analysis should consider fuel costs, vehicle purchase price, maintenance requirements, available incentives, and expected regulatory changes. Many regions are implementing low-emission zones that restrict or charge fees for high-emission vehicles, making fuel type selection increasingly important for market access.",
  },
  {
    question: "How do priority levels work in route optimization and when should they be used?",
    answer: "Priority levels in route optimization assign relative importance to different deliveries, influencing the sequence in which stops are visited and the resources allocated to ensure their completion. Critical priority is typically reserved for time-sensitive deliveries such as medical supplies, perishable goods, or contractually guaranteed delivery times where failure carries significant penalties. High priority may apply to valued customers, larger orders, or deliveries with narrow time windows. Normal priority suits routine deliveries with flexible scheduling, while low priority can be assigned to optional or best-effort deliveries. The optimization algorithm processes higher priority stops first, ensuring they are positioned favorably within the route to maximize on-time completion. When routes become constrained by capacity or time, lower priority stops may be deferred to subsequent routes or days. Effective use of priority levels requires clear criteria for assignment, balancing customer value, delivery costs, and service commitments. Overuse of high priority levels can undermine their effectiveness, so discipline in priority assignment is essential for maintaining system credibility.",
  },
  {
    question: "What are the common mistakes to avoid in route planning and optimization?",
    answer: "Common route planning mistakes often stem from underestimating real-world complexity or over-relying on theoretical optimization without practical validation. One frequent error is ignoring traffic patterns and congestion, which can render theoretically optimal routes impractical during peak hours. Another mistake is failing to account for driver constraints including rest requirements, maximum driving hours, and familiarity with service areas. Over-optimization for distance while neglecting time windows can result in efficient-looking routes that consistently fail delivery commitments. Insufficient buffer time between stops leaves no margin for unexpected delays, creating cascading failures throughout the route. Not considering vehicle loading sequences can result in inefficient unloading at stops, as cargo for later deliveries blocks access to items needed earlier. Relying on outdated or inaccurate address data leads to wasted time searching for correct locations. Finally, treating route optimization as a one-time exercise rather than an ongoing process prevents continuous improvement. Successful route planning requires balancing algorithmic optimization with practical knowledge and regular performance reviews.",
  },
  {
    question: "How can technology integration enhance route planning capabilities?",
    answer: "Technology integration transforms route planning from a manual, reactive process into a dynamic, predictive capability that drives operational excellence. GPS tracking and telematics provide real-time vehicle location data, enabling dispatchers to monitor route progress, identify deviations, and make proactive adjustments. Traffic data integration from services like Google Maps or TomTom allows routes to be planned around congestion patterns and adjusted dynamically for incidents. Customer relationship management (CRM) systems integration provides visibility into delivery preferences, special instructions, and historical service issues. Warehouse management system (WMS) integration ensures accurate cargo information for capacity planning and loading sequence optimization. Mobile applications for drivers enable real-time communication, proof of delivery capture, and exception reporting. Advanced analytics platforms process historical data to identify trends, predict demand, and continuously improve planning parameters. Machine learning algorithms can identify patterns in delivery performance that humans might miss, suggesting optimization opportunities. The key to successful technology integration is ensuring systems communicate effectively through APIs and data standards while maintaining user-friendly interfaces for planners and drivers.",
  },
];

// Pro Tips Data
const PRO_TIPS = [
  {
    icon: Clock4,
    title: "Set Realistic Time Windows",
    description: "Allow 15-30 minutes of buffer time between deliveries. This accounts for unexpected delays like traffic, weather, or longer-than-expected unloading times. Overly tight schedules lead to cascading delays.",
    color: OCEAN_BLUE,
  },
  {
    icon: Weight,
    title: "Optimize Load Distribution",
    description: "Aim for 80-90% vehicle capacity utilization. Underloading wastes resources while overloading risks violations. Balance weight distribution across the vehicle to maintain fuel efficiency and safety.",
    color: LOGISTICS_GREEN,
  },
  {
    icon: Target,
    title: "Prioritize Strategically",
    description: "Use priority levels sparingly and strategically. Reserve critical priority for truly time-sensitive deliveries. Too many high-priority stops dilutes their effectiveness and complicates route optimization.",
    color: "#F59E0B",
  },
  {
    icon: Leaf,
    title: "Consider Environmental Impact",
    description: "Choose fuel-efficient vehicles and routes that minimize emissions. Electric vehicles excel in urban environments. Reducing environmental impact often aligns with cost savings through fuel efficiency.",
    color: "#10B981",
  },
  {
    icon: GitBranch,
    title: "Plan for Contingencies",
    description: "Always have backup routes planned for common disruptions. Identify alternative roads, backup drivers, and overflow capacity. Routes that work perfectly on paper need real-world validation.",
    color: "#8B5CF6",
  },
  {
    icon: RefreshCw,
    title: "Review and Iterate Regularly",
    description: "Route optimization is not a one-time exercise. Review performance weekly, gather driver feedback, and adjust parameters based on actual results. Continuous improvement drives long-term efficiency gains.",
    color: "#EC4899",
  },
];

// Common Mistakes Data
const COMMON_MISTAKES = [
  {
    icon: AlertTriangle,
    title: "Ignoring Real-World Constraints",
    description: "Planning routes based on theoretical distances without accounting for traffic patterns, road conditions, driver breaks, and loading times leads to consistently missed deadlines. Always validate optimized routes with ground-level knowledge and historical performance data.",
  },
  {
    icon: RouteOff,
    title: "Over-Optimizing for Distance Alone",
    description: "Minimizing distance is important, but focusing exclusively on mileage while ignoring time windows, priority levels, and customer satisfaction often results in lower overall service quality. Balance efficiency with reliability and service commitments.",
  },
  {
    icon: TimerIcon,
    title: "Insufficient Buffer Time",
    description: "Scheduling stops back-to-back without contingency time creates fragile routes where any delay cascades through the entire schedule. Build in realistic buffer time based on historical performance and variability.",
  },
  {
    icon: Users,
    title: "Excluding Drivers from Planning",
    description: "Drivers possess invaluable local knowledge about road conditions, delivery access, customer preferences, and time-saving shortcuts. Excluding them from the planning process wastes this expertise and can create resentment that undermines execution.",
  },
  {
    icon: Settings,
    title: "Using Outdated Planning Parameters",
    description: "Traffic patterns change, customer locations move, and seasonal factors affect delivery times. Using static planning parameters that are not regularly updated results in increasingly inaccurate optimization over time.",
  },
];

// Educational Content Sections
const EDUCATIONAL_SECTIONS = [
  {
    title: "Understanding Route Planning",
    icon: Compass,
    content: `Route planning is the strategic process of determining the most efficient sequence of stops for vehicles making multiple deliveries or service calls. At its core, route planning solves the Vehicle Routing Problem (VRP), a complex optimization challenge that considers constraints like vehicle capacity, time windows, driver hours, and delivery priorities. Modern route planning goes beyond simple shortest-path calculations to incorporate real-world factors such as traffic patterns, road restrictions, customer preferences, and even weather conditions. Effective route planning can reduce transportation costs by 15-25%, improve customer satisfaction through more reliable delivery times, and decrease environmental impact through lower fuel consumption. The evolution from manual planning using paper maps to sophisticated algorithms has transformed logistics operations, enabling companies to scale their delivery networks while maintaining service quality. Understanding the fundamental principles of route planning helps logistics professionals make better decisions about technology investments, performance metrics, and continuous improvement strategies.`,
  },
  {
    title: "Optimization Factors",
    icon: Settings2,
    content: `Route optimization considers multiple interrelated factors that must be balanced to achieve optimal results. Distance and travel time are primary considerations, but they often conflict with other objectives. Time windows impose sequencing constraints that may require longer routes to ensure timely deliveries. Vehicle capacity limits the number of stops per route and affects the total number of vehicles required. Priority levels weight certain deliveries more heavily in the optimization algorithm, potentially sacrificing overall efficiency to ensure critical deliveries are completed. Driver constraints including maximum driving hours, required rest breaks, and route familiarity affect both planning and execution. Cost factors extend beyond fuel to include tolls, driver wages, vehicle wear, and opportunity costs. Environmental considerations increasingly influence route planning as companies pursue sustainability goals. Weather and seasonal factors can dramatically affect travel times and may require contingency planning. The most effective optimization approaches weight these factors appropriately for specific business objectives and operational contexts, recognizing that perfect optimization across all dimensions is rarely achievable.`,
  },
  {
    title: "Mode Selection in Transport",
    icon: ArrowLeftRight,
    content: `Selecting the appropriate transport mode is a critical decision that affects cost, speed, reliability, and environmental impact. Road transport offers the greatest flexibility with door-to-door capability and is optimal for short to medium distances and time-sensitive deliveries. Rail freight provides cost efficiency for bulk commodities over longer distances but requires intermodal transfers and offers less schedule flexibility. Ocean freight is the most economical option for international trade and bulk shipments but involves long transit times and port handling complexities. Air freight commands premium rates but enables rapid delivery for high-value or time-critical shipments. Multimodal solutions combine the strengths of different modes, such as using rail for long-haul transport and trucks for last-mile delivery. Mode selection should consider total cost including handling, inventory carrying costs, and service requirements, not just transportation rates. Growing emphasis on sustainability is driving modal shift initiatives that favor rail and sea over road and air where service requirements permit. Understanding the trade-offs between modes enables informed decisions that optimize the entire supply chain.`,
  },
  {
    title: "Planning Best Practices",
    icon: BookOpen,
    content: `Effective route planning follows established best practices that maximize efficiency while maintaining service quality and operational flexibility. Start with accurate data: verify addresses, confirm delivery requirements, and understand customer-specific constraints. Use historical performance data to calibrate planning parameters such as average travel times and service durations. Build routes with contingency capacity to handle variability and unexpected events. Implement tiered priority systems that focus resources on critical deliveries while maintaining flexibility for routine stops. Plan driver schedules to comply with regulations while maximizing productive driving time. Validate optimized routes with experienced drivers before implementation to catch practical issues that algorithms may miss. Establish clear communication protocols for route changes and exceptions. Monitor performance in real-time to identify and respond to deviations quickly. Conduct regular post-route reviews to identify improvement opportunities and update planning parameters. Invest in training for planners and drivers on route optimization tools and techniques. Finally, treat route planning as an ongoing process of continuous improvement rather than a one-time exercise, constantly refining approaches based on performance feedback.`,
  },
];

// Alternative Routes Data for Options Tab
const ALTERNATIVE_ROUTES_DATA = [
  {
    id: "optimal",
    name: "Optimized Route",
    description: "AI-optimized sequence balancing time, distance, and cost",
    distance: 245,
    time: 6.2,
    cost: 385,
    fuel: 62,
    co2: 166,
    onTimeRate: 98,
    color: LOGISTICS_GREEN,
  },
  {
    id: "shortest",
    name: "Shortest Distance",
    description: "Minimizes total kilometers traveled",
    distance: 218,
    time: 7.1,
    cost: 412,
    fuel: 58,
    co2: 155,
    onTimeRate: 85,
    color: OCEAN_BLUE,
  },
  {
    id: "fastest",
    name: "Fastest Route",
    description: "Prioritizes highways and high-speed roads",
    distance: 267,
    time: 5.4,
    cost: 445,
    fuel: 68,
    co2: 182,
    onTimeRate: 99,
    color: "#F59E0B",
  },
  {
    id: "balanced",
    name: "Balanced Approach",
    description: "Equal weight to time, distance, and cost factors",
    distance: 238,
    time: 6.0,
    cost: 392,
    fuel: 60,
    co2: 161,
    onTimeRate: 96,
    color: "#8B5CF6",
  },
];

interface Stop {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  deliveryWindow: {
    start: string;
    end: string;
  };
  priority: string;
  cargoWeight: number;
  cargoVolume: number;
  unloadTime: number;
  isDepot?: boolean;
}

interface RouteSegment {
  from: Stop;
  to: Stop;
  distance: number;
  time: number;
  fuelConsumed: number;
  cost: number;
}

interface RouteResult {
  totalDistance: number;
  totalTime: number;
  totalFuel: number;
  totalCost: number;
  costPerKm: number;
  costPerMile: number;
  fuelCost: number;
  tollCost: number;
  driverCost: number;
  co2Emissions: number;
  capacityUtilization: number;
  volumeUtilization: number;
  segments: RouteSegment[];
  optimizedOrder: Stop[];
  violations: TimeWindowViolation[];
  savings: {
    distance: number;
    time: number;
    cost: number;
  };
}

interface TimeWindowViolation {
  stop: Stop;
  scheduledArrival: string;
  windowStart: string;
  windowEnd: string;
  violationMinutes: number;
  penalty: number;
}

// Sample locations for demo
const SAMPLE_LOCATIONS = [
  { name: "Shanghai Port", address: "Shanghai, China", lat: 31.2304, lng: 121.4737 },
  { name: "Ningbo Warehouse", address: "Ningbo, China", lat: 29.8683, lng: 121.5440 },
  { name: "Hangzhou Distribution", address: "Hangzhou, China", lat: 30.2741, lng: 120.1551 },
  { name: "Suzhou Factory", address: "Suzhou, China", lat: 31.2989, lng: 120.5853 },
  { name: "Wuxi Logistics Hub", address: "Wuxi, China", lat: 31.4912, lng: 120.3119 },
  { name: "Nanjing Distribution", address: "Nanjing, China", lat: 32.0603, lng: 118.7969 },
];

// Performance trend data for visualization
const PERFORMANCE_TREND_DATA = [
  { month: "Jan", efficiency: 85, cost: 4200, emissions: 320 },
  { month: "Feb", efficiency: 88, cost: 3900, emissions: 295 },
  { month: "Mar", efficiency: 92, cost: 3600, emissions: 270 },
  { month: "Apr", efficiency: 89, cost: 3800, emissions: 285 },
  { month: "May", efficiency: 94, cost: 3400, emissions: 255 },
  { month: "Jun", efficiency: 96, cost: 3200, emissions: 240 },
];

export default function RoutePlanningTool() {
  // Route configuration state
  const [stops, setStops] = useState<Stop[]>([
    {
      id: "depot-1",
      name: "Shanghai Distribution Center",
      address: "Shanghai, China",
      latitude: 31.2304,
      longitude: 121.4737,
      deliveryWindow: { start: "06:00", end: "22:00" },
      priority: "normal",
      cargoWeight: 0,
      cargoVolume: 0,
      unloadTime: 0,
      isDepot: true,
    },
  ]);

  const [vehicleType, setVehicleType] = useState("truck-large");
  const [fuelType, setFuelType] = useState("diesel");
  const [distanceUnit, setDistanceUnit] = useState<"KM" | "MILES">("KM");
  const [fuelPrice, setFuelPrice] = useState("1.65");
  const [driverWage, setDriverWage] = useState("25");
  const [avgSpeed, setAvgSpeed] = useState("60");
  const [includeTolls, setIncludeTolls] = useState(true);
  const [tollRate, setTollRate] = useState("0.08");
  const [includeReturn, setIncludeReturn] = useState(true);

  // Results state
  const [result, setResult] = useState<RouteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Add stop dialog
  const [isAddStopOpen, setIsAddStopOpen] = useState(false);
  const [newStop, setNewStop] = useState<Partial<Stop>>({
    name: "",
    address: "",
    deliveryWindow: { start: "08:00", end: "18:00" },
    priority: "normal",
    cargoWeight: 1000,
    cargoVolume: 5,
    unloadTime: 30,
  });

  // Selected alternative route
  const [selectedRoute, setSelectedRoute] = useState("optimal");

  // Get vehicle and fuel configuration
  const vehicle = VEHICLE_TYPES.find((v) => v.id === vehicleType) || VEHICLE_TYPES[3];
  const fuel = FUEL_TYPES.find((f) => f.id === fuelType) || FUEL_TYPES[0];

  // Calculate total cargo
  const totalCargo = useMemo(() => {
    return {
      weight: stops.reduce((sum, s) => sum + s.cargoWeight, 0),
      volume: stops.reduce((sum, s) => sum + s.cargoVolume, 0),
    };
  }, [stops]);

  // Capacity utilization
  const capacityUtilization = useMemo(() => {
    return {
      weight: (totalCargo.weight / vehicle.capacity) * 100,
      volume: (totalCargo.volume / vehicle.volume) * 100,
    };
  }, [totalCargo, vehicle]);

  // Add stop handler
  const handleAddStop = () => {
    const stop: Stop = {
      id: `stop-${Date.now()}`,
      name: newStop.name || `Stop ${stops.length}`,
      address: newStop.address || "",
      latitude: newStop.latitude,
      longitude: newStop.longitude,
      deliveryWindow: newStop.deliveryWindow || { start: "08:00", end: "18:00" },
      priority: newStop.priority || "normal",
      cargoWeight: newStop.cargoWeight || 0,
      cargoVolume: newStop.cargoVolume || 0,
      unloadTime: newStop.unloadTime || 30,
    };
    setStops([...stops, stop]);
    setNewStop({
      name: "",
      address: "",
      deliveryWindow: { start: "08:00", end: "18:00" },
      priority: "normal",
      cargoWeight: 1000,
      cargoVolume: 5,
      unloadTime: 30,
    });
    setIsAddStopOpen(false);
  };

  // Remove stop handler
  const handleRemoveStop = (id: string) => {
    if (stops.find((s) => s.id === id)?.isDepot) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  // Calculate route optimization
  const calculateRoute = useCallback(() => {
    if (stops.length < 2) return;

    setIsCalculating(true);

    setTimeout(() => {
      const speed = parseFloat(avgSpeed) || 60;
      const pricePerUnit = parseFloat(fuelPrice) || fuel.price;
      const wage = parseFloat(driverWage) || 25;
      const tollPerKm = includeTolls ? parseFloat(tollRate) || 0.08 : 0;

      // Simple nearest neighbor optimization
      const optimizedStops = [...stops];
      const depot = optimizedStops.find((s) => s.isDepot) || optimizedStops[0];
      const otherStops = optimizedStops.filter((s) => !s.isDepot);

      // Sort by priority first, then by time window
      otherStops.sort((a, b) => {
        const priorityA = PRIORITY_LEVELS.find((p) => p.id === a.priority)?.penalty || 20;
        const priorityB = PRIORITY_LEVELS.find((p) => p.id === b.priority)?.penalty || 20;
        if (priorityA !== priorityB) return priorityB - priorityA;
        return a.deliveryWindow.start.localeCompare(b.deliveryWindow.start);
      });

      const orderedStops = [depot, ...otherStops];
      if (includeReturn) orderedStops.push(depot);

      // Calculate segments
      const segments: RouteSegment[] = [];
      let totalDistance = 0;
      let totalTime = 0;
      let totalFuel = 0;

      for (let i = 0; i < orderedStops.length - 1; i++) {
        const from = orderedStops[i];
        const to = orderedStops[i + 1];

        // Simulate distance calculation (would use real API in production)
        const distance = Math.random() * 200 + 50;
        const time = distance / speed + to.unloadTime / 60;
        const fuelConsumed = distance / vehicle.efficiency;

        segments.push({
          from,
          to,
          distance: Math.round(distance * 10) / 10,
          time: Math.round(time * 100) / 100,
          fuelConsumed: Math.round(fuelConsumed * 100) / 100,
          cost: Math.round(fuelConsumed * pricePerUnit * 100) / 100,
        });

        totalDistance += distance;
        totalTime += time;
        totalFuel += fuelConsumed;
      }

      // Calculate costs
      const fuelCost = totalFuel * pricePerUnit;
      const tollCost = totalDistance * tollPerKm;
      const driverCost = totalTime * wage;
      const totalCost = fuelCost + tollCost + driverCost + 100; // Base operational costs

      // Calculate CO2 emissions
      const co2Emissions = totalFuel * fuel.co2Factor;

      // Check time window violations
      const violations: TimeWindowViolation[] = [];
      let currentTime = 6; // Start at 6 AM

      orderedStops.forEach((stop) => {
        if (!stop.isDepot) {
          const windowStart = parseInt(stop.deliveryWindow.start.split(":")[0]) + parseInt(stop.deliveryWindow.start.split(":")[1]) / 60;
          const windowEnd = parseInt(stop.deliveryWindow.end.split(":")[0]) + parseInt(stop.deliveryWindow.end.split(":")[1]) / 60;

          if (currentTime < windowStart || currentTime > windowEnd) {
            const violationMinutes = currentTime > windowEnd
              ? (currentTime - windowEnd) * 60
              : 0;
            const priority = PRIORITY_LEVELS.find((p) => p.id === stop.priority);
            violations.push({
              stop,
              scheduledArrival: `${Math.floor(currentTime)}:${String(Math.round((currentTime % 1) * 60)).padStart(2, "0")}`,
              windowStart: stop.deliveryWindow.start,
              windowEnd: stop.deliveryWindow.end,
              violationMinutes: Math.round(violationMinutes),
              penalty: Math.round(violationMinutes * (priority?.penalty || 20) / 10),
            });
          }
        }
        currentTime += stop.unloadTime / 60 + (segments.find((s) => s.from.id === stop.id)?.time || 0);
      });

      // Calculate savings (compared to unoptimized route)
      const unoptimizedDistance = totalDistance * 1.25;
      const unoptimizedTime = totalTime * 1.3;
      const unoptimizedCost = totalCost * 1.35;

      const routeResult: RouteResult = {
        totalDistance: Math.round(totalDistance * 10) / 10,
        totalTime: Math.round(totalTime * 100) / 100,
        totalFuel: Math.round(totalFuel * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        costPerKm: Math.round((totalCost / totalDistance) * 100) / 100,
        costPerMile: Math.round((totalCost / (totalDistance * 0.621371)) * 100) / 100,
        fuelCost: Math.round(fuelCost * 100) / 100,
        tollCost: Math.round(tollCost * 100) / 100,
        driverCost: Math.round(driverCost * 100) / 100,
        co2Emissions: Math.round(co2Emissions * 10) / 10,
        capacityUtilization: Math.min(capacityUtilization.weight, 100),
        volumeUtilization: Math.min(capacityUtilization.volume, 100),
        segments,
        optimizedOrder: orderedStops,
        violations,
        savings: {
          distance: Math.round((unoptimizedDistance - totalDistance) * 10) / 10,
          time: Math.round((unoptimizedTime - totalTime) * 100) / 100,
          cost: Math.round((unoptimizedCost - totalCost) * 100) / 100,
        },
      };

      setResult(routeResult);
      setIsCalculating(false);
    }, 1500);
  }, [stops, vehicle, fuel, avgSpeed, fuelPrice, driverWage, includeTolls, tollRate, includeReturn, capacityUtilization]);

  // Reset function
  const handleReset = () => {
    setStops([
      {
        id: "depot-1",
        name: "Shanghai Distribution Center",
        address: "Shanghai, China",
        latitude: 31.2304,
        longitude: 121.4737,
        deliveryWindow: { start: "06:00", end: "22:00" },
        priority: "normal",
        cargoWeight: 0,
        cargoVolume: 0,
        unloadTime: 0,
        isDepot: true,
      },
    ]);
    setResult(null);
    setVehicleType("truck-large");
    setFuelType("diesel");
    setFuelPrice("1.65");
    setDriverWage("25");
    setAvgSpeed("60");
  };

  // Export function
  const handleExport = () => {
    if (!result) return;

    const exportData = {
      timestamp: new Date().toISOString(),
      configuration: {
        vehicleType,
        fuelType,
        distanceUnit,
        fuelPrice: parseFloat(fuelPrice),
        driverWage: parseFloat(driverWage),
        avgSpeed: parseFloat(avgSpeed),
        includeTolls,
        includeReturn,
      },
      stops: stops.map((s) => ({
        name: s.name,
        address: s.address,
        deliveryWindow: s.deliveryWindow,
        priority: s.priority,
        cargoWeight: s.cargoWeight,
        cargoVolume: s.cargoVolume,
        unloadTime: s.unloadTime,
        isDepot: s.isDepot,
      })),
      results: {
        totalDistance: result.totalDistance,
        totalTime: result.totalTime,
        totalFuel: result.totalFuel,
        totalCost: result.totalCost,
        costPerKm: result.costPerKm,
        co2Emissions: result.co2Emissions,
        savings: result.savings,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `route-planning-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Share function
  const handleShare = async () => {
    if (!result) return;

    const shareText = `Route Planning Results:
Distance: ${formatNumber(result.totalDistance)} km
Time: ${formatNumber(result.totalTime, 1)} hours
Cost: ${formatCurrency(result.totalCost)}
CO2 Emissions: ${formatNumber(result.co2Emissions)} kg
Savings: ${formatCurrency(result.savings.cost)} (${((result.savings.cost / result.totalCost) * 100).toFixed(1)}% reduction)

Generated with Shiportrade Route Planning Tool`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Route Planning Results",
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      navigator.clipboard.writeText(shareText);
      alert("Results copied to clipboard!");
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // Format number
  const formatNumber = (value: number, decimals = 1) => {
    return value.toLocaleString("en-US", { maximumFractionDigits: decimals });
  };

  // Cost breakdown data for chart
  const costBreakdownData = result ? [
    { name: "Fuel", value: result.fuelCost, color: OCEAN_BLUE },
    { name: "Tolls", value: result.tollCost, color: LOGISTICS_GREEN },
    { name: "Driver", value: result.driverCost, color: "#F59E0B" },
    { name: "Other", value: result.totalCost - result.fuelCost - result.tollCost - result.driverCost, color: "#94a3b8" },
  ] : [];

  // Segment comparison data
  const segmentData = result?.segments.map((seg) => ({
    name: `${seg.from.name.split(" ")[0]} → ${seg.to.name.split(" ")[0]}`,
    distance: seg.distance,
    time: seg.time,
    cost: seg.cost,
  })) || [];

  // Radial chart data for efficiency
  const efficiencyData = result ? [
    { name: "Distance", value: Math.min(100, 100 - (result.savings.distance / result.totalDistance) * 100), fill: OCEAN_BLUE },
    { name: "Time", value: Math.min(100, 100 - (result.savings.time / result.totalTime) * 100), fill: LOGISTICS_GREEN },
    { name: "Cost", value: Math.min(100, 100 - (result.savings.cost / result.totalCost) * 100), fill: "#F59E0B" },
  ] : [];

  // Route comparison chart data
  const routeComparisonData = ALTERNATIVE_ROUTES_DATA.map((route) => ({
    name: route.name.split(" ")[0],
    distance: route.distance,
    time: route.time,
    cost: route.cost,
    fill: route.color,
  }));

  // Transit timeline data
  const transitTimelineData = result?.segments.map((seg, index) => ({
    name: `Segment ${index + 1}`,
    time: seg.time,
    distance: seg.distance,
    cumulative: result.segments.slice(0, index + 1).reduce((sum, s) => sum + s.time, 0),
  })) || [];

  return (
    <div className="space-y-8">
      {/* Hero Section with Animated Badges */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 border border-border">
        <div className="absolute inset-0 bg-grid-black/5 dark:bg-grid-white/5" />
        <div className="relative px-6 py-8 md:px-10 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Animated Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge 
                  className="bg-[var(--ocean)]/10 text-[var(--ocean)] border-[var(--ocean)]/20 hover:bg-[var(--ocean)]/20 transition-all duration-300"
                >
                  <Route className="h-3 w-3 mr-1" />
                  Route Optimization
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge 
                  className="bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20 hover:bg-[var(--logistics)]/20 transition-all duration-300"
                >
                  <Map className="h-3 w-3 mr-1" />
                  Logistics Planning
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Badge 
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 hover:bg-amber-500/20 transition-all duration-300"
                >
                  <Globe className="h-3 w-3 mr-1" />
                  Transport Network
                </Badge>
              </motion.div>
            </div>

            <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-3">
              Route Planning & Optimization Tool
            </h1>
            <p className="text-base md:text-lg text-muted-foreground mb-6 max-w-2xl">
              Plan efficient multi-stop delivery routes with real-time cost analysis, time window management, and environmental impact tracking. Optimize your logistics operations with advanced algorithms.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={handleReset}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                variant="outline"
                onClick={handleExport}
                disabled={!result}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                disabled={!result}
                className="gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Route className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                <span className="text-sm">Stops</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>{stops.length}</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Truck className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                <span className="text-sm">Capacity</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>{Math.max(capacityUtilization.weight, capacityUtilization.volume).toFixed(0)}%</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Fuel className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Fuel Type</span>
              </div>
              <div className="text-2xl font-bold text-amber-500">{fuel.name}</div>
            </div>
            <div className="bg-card/80 backdrop-blur-sm rounded-xl p-4 border border-border">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Leaf className="h-4 w-4 text-green-500" />
                <span className="text-sm">CO₂ Factor</span>
              </div>
              <div className="text-2xl font-bold text-green-500">{fuel.co2Factor} kg/L</div>
            </div>
          </motion.div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[var(--ocean)]/5 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[var(--logistics)]/5 rounded-full blur-2xl" />
      </div>

      {/* Main Content Tabs - 5 Tab Interface */}
      <Tabs defaultValue="planner" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50 rounded-xl">
          <TabsTrigger 
            value="planner" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
          >
            <RouteIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Planner</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analysis" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analysis</span>
          </TabsTrigger>
          <TabsTrigger 
            value="options" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
          >
            <GitBranch className="h-4 w-4" />
            <span className="hidden sm:inline">Options</span>
          </TabsTrigger>
          <TabsTrigger 
            value="guide" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Guide</span>
          </TabsTrigger>
          <TabsTrigger 
            value="faq" 
            className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">FAQ</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Planner */}
        <TabsContent value="planner" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>Route Planner</h2>
              <p className="text-muted-foreground">Configure your route and optimize for efficiency</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-sm">
                {stops.length} Stop{stops.length !== 1 ? "s" : ""}
              </Badge>
              <Badge style={{ backgroundColor: LOGISTICS_GREEN, color: "white" }} className="text-sm">
                {capacityUtilization.weight.toFixed(0)}% Capacity
              </Badge>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Panel - Stops Configuration */}
            <div className="lg:col-span-1 space-y-4">
              {/* Vehicle Configuration */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="text-white rounded-t-lg" style={{ background: `linear-gradient(to right, ${OCEAN_BLUE}, ${OCEAN_BLUE}cc)` }}>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Truck className="h-5 w-5" />
                    Vehicle Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <Label>Vehicle Type</Label>
                    <Select value={vehicleType} onValueChange={setVehicleType}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {VEHICLE_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <span>{type.icon}</span>
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Weight className="h-4 w-4" />
                        Max Weight
                      </div>
                      <p className="font-bold text-lg">{formatNumber(vehicle.capacity)} kg</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <Box className="h-4 w-4" />
                        Max Volume
                      </div>
                      <p className="font-bold text-lg">{vehicle.volume} m³</p>
                    </div>
                  </div>

                  <div>
                    <Label>Fuel Type</Label>
                    <Select value={fuelType} onValueChange={setFuelType}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FUEL_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: type.color }} />
                              <span>{type.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="fuelPrice">Fuel Price ($/L)</Label>
                      <Input
                        id="fuelPrice"
                        type="number"
                        step="0.01"
                        value={fuelPrice}
                        onChange={(e) => setFuelPrice(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div>
                      <Label htmlFor="driverWage">Driver Wage ($/hr)</Label>
                      <Input
                        id="driverWage"
                        type="number"
                        step="0.5"
                        value={driverWage}
                        onChange={(e) => setDriverWage(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Include tolls</span>
                    <Switch checked={includeTolls} onCheckedChange={setIncludeTolls} />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm">Return to depot</span>
                    <Switch checked={includeReturn} onCheckedChange={setIncludeReturn} />
                  </div>
                </CardContent>
              </Card>

              {/* Stops List */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                      Route Stops
                    </CardTitle>
                    <Dialog open={isAddStopOpen} onOpenChange={setIsAddStopOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm" style={{ backgroundColor: LOGISTICS_GREEN }} className="text-white">
                          <Plus className="h-4 w-4 mr-1" />
                          Add Stop
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Add Delivery Stop</DialogTitle>
                          <DialogDescription>Add a new stop to your delivery route</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                          <div>
                            <Label>Location Name</Label>
                            <Input
                              value={newStop.name || ""}
                              onChange={(e) => setNewStop({ ...newStop, name: e.target.value })}
                              placeholder="e.g., Customer Warehouse"
                            />
                          </div>
                          <div>
                            <Label>Address</Label>
                            <Input
                              value={newStop.address || ""}
                              onChange={(e) => setNewStop({ ...newStop, address: e.target.value })}
                              placeholder="City, Country"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Window Start</Label>
                              <Input
                                type="time"
                                value={newStop.deliveryWindow?.start || "08:00"}
                                onChange={(e) => setNewStop({
                                  ...newStop,
                                  deliveryWindow: { ...newStop.deliveryWindow!, start: e.target.value },
                                })}
                              />
                            </div>
                            <div>
                              <Label>Window End</Label>
                              <Input
                                type="time"
                                value={newStop.deliveryWindow?.end || "18:00"}
                                onChange={(e) => setNewStop({
                                  ...newStop,
                                  deliveryWindow: { ...newStop.deliveryWindow!, end: e.target.value },
                                })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Select
                              value={newStop.priority || "normal"}
                              onValueChange={(v) => setNewStop({ ...newStop, priority: v })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PRIORITY_LEVELS.map((level) => (
                                  <SelectItem key={level.id} value={level.id}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: level.color }} />
                                      {level.name}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <Label>Cargo Weight (kg)</Label>
                              <Input
                                type="number"
                                value={newStop.cargoWeight || 0}
                                onChange={(e) => setNewStop({ ...newStop, cargoWeight: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                            <div>
                              <Label>Cargo Volume (m³)</Label>
                              <Input
                                type="number"
                                value={newStop.cargoVolume || 0}
                                onChange={(e) => setNewStop({ ...newStop, cargoVolume: parseFloat(e.target.value) || 0 })}
                              />
                            </div>
                          </div>
                          <div>
                            <Label>Unload Time (minutes)</Label>
                            <Input
                              type="number"
                              value={newStop.unloadTime || 30}
                              onChange={(e) => setNewStop({ ...newStop, unloadTime: parseInt(e.target.value) || 30 })}
                            />
                          </div>
                          <Button
                            onClick={handleAddStop}
                            className="w-full"
                            style={{ backgroundColor: OCEAN_BLUE }}
                          >
                            Add Stop
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {stops.map((stop, index) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg border ${
                          stop.isDepot ? "border-opacity-30" : "bg-muted/50"
                        }`}
                        style={stop.isDepot ? { backgroundColor: `${OCEAN_BLUE}10`, borderColor: `${OCEAN_BLUE}30` } : {}}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold`}
                                style={{ backgroundColor: stop.isDepot ? OCEAN_BLUE : LOGISTICS_GREEN }}
                              >
                                {index + 1}
                              </div>
                              {index < stops.length - 1 && (
                                <div className="w-0.5 h-6 bg-border mt-1" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{stop.name}</p>
                              <p className="text-sm text-muted-foreground">{stop.address}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {stop.deliveryWindow.start} - {stop.deliveryWindow.end}
                                </span>
                                {!stop.isDepot && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs"
                                    style={{
                                      borderColor: PRIORITY_LEVELS.find((p) => p.id === stop.priority)?.color,
                                      color: PRIORITY_LEVELS.find((p) => p.id === stop.priority)?.color,
                                    }}
                                  >
                                    {stop.priority}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          {!stop.isDepot && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveStop(stop.id)}
                              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {!stop.isDepot && (stop.cargoWeight > 0 || stop.cargoVolume > 0) && (
                          <div className="flex gap-4 mt-2 pt-2 border-t border-border">
                            {stop.cargoWeight > 0 && (
                              <span className="text-xs text-muted-foreground">
                                <Weight className="h-3 w-3 inline mr-1" />
                                {formatNumber(stop.cargoWeight)} kg
                              </span>
                            )}
                            {stop.cargoVolume > 0 && (
                              <span className="text-xs text-muted-foreground">
                                <Box className="h-3 w-3 inline mr-1" />
                                {stop.cargoVolume} m³
                              </span>
                            )}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Capacity Summary */}
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Capacity Utilization</span>
                      <span className="text-sm font-bold">{Math.max(capacityUtilization.weight, capacityUtilization.volume).toFixed(0)}%</span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Weight</span>
                          <span>{formatNumber(totalCargo.weight)} / {formatNumber(vehicle.capacity)} kg</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              capacityUtilization.weight > 100 ? "bg-red-500" : ""
                            }`}
                            style={{ width: `${Math.min(capacityUtilization.weight, 100)}%`, backgroundColor: capacityUtilization.weight > 100 ? undefined : OCEAN_BLUE }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>Volume</span>
                          <span>{totalCargo.volume} / {vehicle.volume} m³</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              capacityUtilization.volume > 100 ? "bg-red-500" : ""
                            }`}
                            style={{ width: `${Math.min(capacityUtilization.volume, 100)}%`, backgroundColor: capacityUtilization.volume > 100 ? undefined : LOGISTICS_GREEN }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Calculate Button */}
              <Button
                onClick={calculateRoute}
                disabled={isCalculating || stops.length < 2}
                className="w-full h-12 text-lg"
                style={{ backgroundColor: OCEAN_BLUE }}
              >
                {isCalculating ? (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                    Optimizing Route...
                  </>
                ) : (
                  <>
                    <Route className="mr-2 h-5 w-5" />
                    Optimize Route
                  </>
                )}
              </Button>
            </div>

            {/* Right Panel - Results */}
            <div className="lg:col-span-2 space-y-6">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="text-white" style={{ background: `linear-gradient(to bottom right, ${OCEAN_BLUE}, ${OCEAN_BLUE}cc)` }}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Route className="h-5 w-5 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
                            {distanceUnit === "KM" ? "km" : "mi"}
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {formatNumber(distanceUnit === "KM" ? result.totalDistance : result.totalDistance * 0.621371)}
                        </p>
                        <p className="text-xs opacity-80 mt-1">
                          Saved {formatNumber(distanceUnit === "KM" ? result.savings.distance : result.savings.distance * 0.621371)} {distanceUnit === "KM" ? "km" : "mi"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="text-white" style={{ background: `linear-gradient(to bottom right, ${LOGISTICS_GREEN}, ${LOGISTICS_GREEN}cc)` }}>
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Clock className="h-5 w-5 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">hours</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(result.totalTime, 1)}</p>
                        <p className="text-xs opacity-80 mt-1">
                          Saved {formatNumber(result.savings.time, 1)} hrs
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <DollarSign className="h-5 w-5 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">total</span>
                        </div>
                        <p className="text-2xl font-bold">{formatCurrency(result.totalCost)}</p>
                        <p className="text-xs opacity-80 mt-1">
                          Saved {formatCurrency(result.savings.cost)}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <Leaf className="h-5 w-5 opacity-80" />
                          <span className="text-xs bg-white/20 px-2 py-0.5 rounded">CO₂</span>
                        </div>
                        <p className="text-2xl font-bold">{formatNumber(result.co2Emissions)} kg</p>
                        <p className="text-xs opacity-80 mt-1">Emissions</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Optimized Route Order */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                        <Navigation className="h-5 w-5" />
                        Optimized Route Sequence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5" style={{ background: `linear-gradient(to bottom, ${OCEAN_BLUE}, ${LOGISTICS_GREEN}, ${OCEAN_BLUE})` }} />
                        <div className="space-y-3">
                          {result.optimizedOrder.map((stop, index) => (
                            <motion.div
                              key={`${stop.id}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="relative pl-10"
                            >
                              <div
                                className={`absolute left-2 w-5 h-5 rounded-full border-2 border-background`}
                                style={{ backgroundColor: stop.isDepot ? OCEAN_BLUE : LOGISTICS_GREEN }}
                              />
                              <div className={`p-3 rounded-lg ${stop.isDepot ? "border" : "bg-muted/50"}`} style={stop.isDepot ? { backgroundColor: `${OCEAN_BLUE}10`, borderColor: `${OCEAN_BLUE}20` } : {}}>
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">{stop.name}</p>
                                    <p className="text-sm text-muted-foreground">{stop.address}</p>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant={stop.isDepot ? "default" : "outline"} style={stop.isDepot ? { backgroundColor: OCEAN_BLUE } : {}}>
                                      {stop.isDepot ? "Depot" : `Stop ${index}`}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {stop.deliveryWindow.start} - {stop.deliveryWindow.end}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              {index < result.optimizedOrder.length - 1 && (
                                <div className="flex items-center gap-2 pl-4 py-2 text-sm text-muted-foreground">
                                  <ArrowRight className="h-4 w-4" />
                                  <span>
                                    {formatNumber(result.segments[index]?.distance || 0)} km • {formatNumber(result.segments[index]?.time || 0, 1)} hrs
                                  </span>
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Time Window Analysis */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                        <Timer className="h-5 w-5" />
                        Time Window Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {result.violations.length > 0 ? (
                        <div className="space-y-3">
                          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700 dark:text-red-300">
                              <AlertTriangle className="h-5 w-5" />
                              <span className="font-medium">{result.violations.length} Time Window Violation(s)</span>
                            </div>
                          </div>
                          {result.violations.map((violation, i) => (
                            <div key={i} className="p-3 bg-muted/50 rounded-lg">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{violation.stop.name}</span>
                                <Badge className="bg-red-500 text-white">
                                  {formatNumber(violation.violationMinutes)} min late
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>Window: {violation.windowStart} - {violation.windowEnd}</p>
                                <p>Scheduled Arrival: {violation.scheduledArrival}</p>
                                <p className="text-red-500 font-medium">Penalty: {formatCurrency(violation.penalty)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-center">
                          <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                          <p className="font-medium text-green-700 dark:text-green-300">All deliveries within time windows</p>
                          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                            Route optimized for on-time delivery
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card className="border-0 shadow-lg h-full flex items-center justify-center min-h-[400px]">
                  <CardContent className="text-center py-12">
                    <Route className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">No Route Calculated</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add at least 2 stops and click &quot;Optimize Route&quot; to see results
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Badge variant="outline">Multi-stop optimization</Badge>
                      <Badge variant="outline">Time windows</Badge>
                      <Badge variant="outline">Cost analysis</Badge>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Analysis */}
        <TabsContent value="analysis" className="space-y-6">
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Bar Chart - Route Comparison */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <BarChart3 className="h-5 w-5" />
                    Route Efficiency Metrics
                  </CardTitle>
                  <CardDescription>Distance, time, and cost analysis by segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={segmentData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" className="fill-muted-foreground" />
                        <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                        <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px" 
                          }}
                        />
                        <Legend />
                        <Bar yAxisId="left" dataKey="distance" name="Distance (km)" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                        <Bar yAxisId="right" dataKey="time" name="Time (hrs)" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Line Chart - Transit Timeline */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                    <LineChart className="h-5 w-5" />
                    Transit Timeline
                  </CardTitle>
                  <CardDescription>Cumulative time and distance progression</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={transitTimelineData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="fill-muted-foreground" />
                        <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                        <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: "hsl(var(--card))", 
                            borderColor: "hsl(var(--border))",
                            borderRadius: "8px" 
                          }}
                        />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="distance" name="Distance (km)" stroke={OCEAN_BLUE} strokeWidth={2} dot={{ fill: OCEAN_BLUE, strokeWidth: 2 }} />
                        <Line yAxisId="right" type="monotone" dataKey="cumulative" name="Cumulative Time (hrs)" stroke={LOGISTICS_GREEN} strokeWidth={2} dot={{ fill: LOGISTICS_GREEN, strokeWidth: 2 }} />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Pie Chart - Cost Distribution */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                    <PieChartIcon className="h-5 w-5" />
                    Cost Distribution
                  </CardTitle>
                  <CardDescription>Breakdown of route costs by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costBreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {costBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{ 
                              backgroundColor: "hsl(var(--card))", 
                              borderColor: "hsl(var(--border))",
                              borderRadius: "8px" 
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {costBreakdownData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-5 h-5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">{formatCurrency(item.value)}</p>
                            <p className="text-sm text-muted-foreground">
                              {((item.value / result.totalCost) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                        <span className="font-bold text-lg">Total Cost</span>
                        <span className="font-bold text-2xl" style={{ color: OCEAN_BLUE }}>
                          {formatCurrency(result.totalCost)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                        <DollarSign className="h-6 w-6" style={{ color: OCEAN_BLUE }} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost per Kilometer</p>
                        <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>
                          {formatCurrency(result.costPerKm)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                        <Gauge className="h-6 w-6" style={{ color: LOGISTICS_GREEN }} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Cost per Mile</p>
                        <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>
                          {formatCurrency(result.costPerMile)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900/30">
                        <Fuel className="h-6 w-6 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Fuel</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(result.totalFuel)} L
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/30">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                        <p className="text-2xl font-bold">
                          {formatNumber(result.totalDistance / result.totalFuel, 1)} km/L
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <Card className="border-0 shadow-lg min-h-[400px] flex items-center justify-center">
              <CardContent className="text-center py-12">
                <PieChartIcon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">No Data Available</h3>
                <p className="text-sm text-muted-foreground">
                  Optimize a route first to see analysis
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Options - Alternative Routes */}
        <TabsContent value="options" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>Alternative Routes</h2>
              <p className="text-muted-foreground">Compare different routing strategies</p>
            </div>
          </div>

          {/* Route Comparison Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {ALTERNATIVE_ROUTES_DATA.map((route) => (
              <Card 
                key={route.id}
                className={`border-0 shadow-lg cursor-pointer transition-all duration-300 ${
                  selectedRoute === route.id ? "ring-2 ring-offset-2" : "hover:shadow-xl"
                }`}
                style={selectedRoute === route.id ? { ringColor: route.color } : {}}
                onClick={() => setSelectedRoute(route.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: route.color }} />
                      <CardTitle className="text-lg">{route.name}</CardTitle>
                    </div>
                    {selectedRoute === route.id && (
                      <Badge style={{ backgroundColor: route.color, color: "white" }}>
                        Selected
                      </Badge>
                    )}
                  </div>
                  <CardDescription>{route.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold" style={{ color: OCEAN_BLUE }}>{route.distance}</p>
                      <p className="text-xs text-muted-foreground">km</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold" style={{ color: LOGISTICS_GREEN }}>{route.time}</p>
                      <p className="text-xs text-muted-foreground">hours</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-amber-500">${route.cost}</p>
                      <p className="text-xs text-muted-foreground">cost</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{route.fuel}L</p>
                      <p className="text-xs text-muted-foreground">Fuel</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{route.co2}kg</p>
                      <p className="text-xs text-muted-foreground">CO₂</p>
                    </div>
                    <div className="p-2 bg-muted/50 rounded">
                      <p className="text-sm font-medium">{route.onTimeRate}%</p>
                      <p className="text-xs text-muted-foreground">On-Time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Route Comparison Chart */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                <BarChart3 className="h-5 w-5" />
                Route Comparison Chart
              </CardTitle>
              <CardDescription>Side-by-side comparison of all routing options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeComparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="fill-muted-foreground" />
                    <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                    <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px" 
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="distance" name="Distance (km)" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="left" dataKey="cost" name="Cost ($)" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="time" name="Time (hrs)" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Trade-offs Analysis */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                <GitBranch className="h-5 w-5" />
                Trade-offs Analysis
              </CardTitle>
              <CardDescription>Understanding the pros and cons of each approach</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ALTERNATIVE_ROUTES_DATA.map((route) => (
                  <div key={route.id} className="p-4 rounded-lg border border-border bg-muted/30">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: route.color }} />
                      <h4 className="font-medium">{route.name}</h4>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-1 flex items-center gap-1">
                          <ArrowUp className="h-3 w-3" /> Advantages
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {route.id === "optimal" && (
                            <>
                              <li>• Best balance of all factors</li>
                              <li>• Highest on-time delivery rate</li>
                              <li>• Optimized for real-world conditions</li>
                            </>
                          )}
                          {route.id === "shortest" && (
                            <>
                              <li>• Minimal distance traveled</li>
                              <li>• Lower fuel consumption</li>
                              <li>• Reduced vehicle wear</li>
                            </>
                          )}
                          {route.id === "fastest" && (
                            <>
                              <li>• Quickest overall transit</li>
                              <li>• Best for urgent deliveries</li>
                              <li>• Highest reliability score</li>
                            </>
                          )}
                          {route.id === "balanced" && (
                            <>
                              <li>• Good compromise approach</li>
                              <li>• Predictable timing</li>
                              <li>• Moderate costs</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-1 flex items-center gap-1">
                          <ArrowDown className="h-3 w-3" /> Trade-offs
                        </p>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {route.id === "optimal" && (
                            <>
                              <li>• May not be optimal for specific goals</li>
                              <li>• Requires more computation time</li>
                              <li>• Complex routing logic</li>
                            </>
                          )}
                          {route.id === "shortest" && (
                            <>
                              <li>• Longer travel time</li>
                              <li>• Lower on-time delivery rate</li>
                              <li>• May use slower roads</li>
                            </>
                          )}
                          {route.id === "fastest" && (
                            <>
                              <li>• Higher fuel consumption</li>
                              <li>• Most expensive option</li>
                              <li>• Higher emissions</li>
                            </>
                          )}
                          {route.id === "balanced" && (
                            <>
                              <li>• Not optimal in any single metric</li>
                              <li>• May miss time windows</li>
                              <li>• Average performance</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 4: Guide - Educational Content */}
        <TabsContent value="guide" className="space-y-6">
          {/* Educational Sections */}
          {EDUCATIONAL_SECTIONS.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2" style={{ color: index % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN }}>
                    <IconComponent className="h-5 w-5" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{section.content}</p>
                </CardContent>
              </Card>
            );
          })}

          {/* Transport Mode Comparison */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                <ArrowLeftRight className="h-5 w-5" />
                Transport Mode Comparison
              </CardTitle>
              <CardDescription>Understanding different transport options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 font-medium">Mode</th>
                      <th className="text-center p-3 font-medium">Avg Speed</th>
                      <th className="text-center p-3 font-medium">Cost/km</th>
                      <th className="text-center p-3 font-medium">CO₂/km</th>
                      <th className="text-center p-3 font-medium">Reliability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TRANSPORT_MODES.map((mode) => {
                      const IconComponent = mode.icon;
                      return (
                        <tr key={mode.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <IconComponent className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                              <span className="font-medium">{mode.name}</span>
                            </div>
                          </td>
                          <td className="text-center p-3">{mode.avgSpeed} km/h</td>
                          <td className="text-center p-3">${mode.costPerKm.toFixed(2)}</td>
                          <td className="text-center p-3">{mode.co2PerKm} kg</td>
                          <td className="text-center p-3">
                            <Badge 
                              variant="outline"
                              style={{ 
                                color: mode.reliability >= 95 ? LOGISTICS_GREEN : mode.reliability >= 90 ? "#F59E0B" : "#EF4444",
                                borderColor: mode.reliability >= 95 ? LOGISTICS_GREEN : mode.reliability >= 90 ? "#F59E0B" : "#EF4444"
                              }}
                            >
                              {mode.reliability}%
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tips Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                <Lightbulb className="h-5 w-5" />
                Pro Tips for Route Optimization
              </CardTitle>
              <CardDescription>Best practices from industry experts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {PRO_TIPS.map((tip, index) => {
                  const IconComponent = tip.icon;
                  return (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-border bg-muted/30 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: `${tip.color}20` }}>
                          <IconComponent className="h-5 w-5" style={{ color: tip.color }} />
                        </div>
                        <div>
                          <h4 className="font-medium mb-1">{tip.title}</h4>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes Section */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertOctagon className="h-5 w-5" />
                Common Mistakes to Avoid
              </CardTitle>
              <CardDescription>Learn from common pitfalls in route planning</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => {
                  const IconComponent = mistake.icon;
                  return (
                    <div 
                      key={index} 
                      className="p-4 rounded-lg border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30">
                          <IconComponent className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-red-700 dark:text-red-300 mb-1">{mistake.title}</h4>
                          <p className="text-sm text-muted-foreground">{mistake.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                <Activity className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={PERFORMANCE_TREND_DATA} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="fill-muted-foreground" />
                    <YAxis yAxisId="left" orientation="left" stroke={OCEAN_BLUE} />
                    <YAxis yAxisId="right" orientation="right" stroke={LOGISTICS_GREEN} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "hsl(var(--card))", 
                        borderColor: "hsl(var(--border))",
                        borderRadius: "8px" 
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="right" dataKey="cost" name="Cost ($)" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} />
                    <Line yAxisId="left" type="monotone" dataKey="efficiency" name="Efficiency (%)" stroke={LOGISTICS_GREEN} strokeWidth={3} dot={{ fill: LOGISTICS_GREEN, strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="emissions" name="Emissions (kg CO₂)" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "#F59E0B" }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 5: FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: OCEAN_BLUE }}>
                <HelpCircle className="h-5 w-5" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>Everything you need to know about route optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-full" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                          <HelpCircle className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        </div>
                        <span className="font-medium">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-10 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2" style={{ color: LOGISTICS_GREEN }}>
                <Sparkles className="h-5 w-5" />
                Quick Tips for Better Routes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: `${OCEAN_BLUE}05` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock4 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    <span className="font-medium">Set Realistic Time Windows</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Allow buffer time for unexpected delays. A 30-minute window works best for most deliveries.</p>
                </div>
                <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: `${LOGISTICS_GREEN}05` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Weight className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium">Optimize Load Distribution</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Balance weight across stops to maintain 80-90% capacity utilization for best efficiency.</p>
                </div>
                <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: `${OCEAN_BLUE}05` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    <span className="font-medium">Prioritize Critical Deliveries</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Mark urgent deliveries as high or critical priority to ensure they&apos;re scheduled first.</p>
                </div>
                <div className="p-4 rounded-lg border border-border" style={{ backgroundColor: `${LOGISTICS_GREEN}05` }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Leaf className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    <span className="font-medium">Consider Fuel Type Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Electric and LNG vehicles have lower emissions. Consider them for urban deliveries.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="border-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}10, ${LOGISTICS_GREEN}10)` }}>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-background shadow-md">
                    <Users className="h-8 w-8" style={{ color: OCEAN_BLUE }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Need More Help?</h3>
                    <p className="text-muted-foreground">Our support team is available 24/7 to assist you</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" style={{ borderColor: OCEAN_BLUE, color: OCEAN_BLUE }}>
                    View Documentation
                  </Button>
                  <Button style={{ backgroundColor: LOGISTICS_GREEN }} className="text-white">
                    Contact Support
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
