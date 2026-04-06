"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Calculator,
  Download,
  Share2,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Info,
  Weight,
  Ruler,
  Target,
  Box,
  RotateCcw,
  Plus,
  Trash2,
  Eye,
  Move3d,
  Shield,
  Anchor,
  ArrowUpRight,
  GripVertical,
  AlertCircle,
  Zap,
  Lightbulb,
  TrendingUp,
  BarChart3,
  PieChart as PieChartIcon,
  LineChart,
  FileText,
  HelpCircle,
  MapPin,
  Building2,
  Users,
  Gauge,
  Network,
  DollarSign,
  Clock,
  Layers,
  Settings,
  ArrowRight,
  CheckCircle,
  XCircle,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
  ReferenceLine,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart as RechartsLineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// Unit conversion factors
const CONVERSIONS = {
  metric: {
    length: 1, // meters
    weight: 1, // kg
    lengthUnit: "m",
    weightUnit: "kg",
  },
  imperial: {
    length: 0.3048, // feet to meters
    weight: 0.453592, // lbs to kg
    lengthUnit: "ft",
    weightUnit: "lb",
  },
};

// Support point configurations
const SUPPORT_CONFIGS = {
  THREE_POINT: { name: "3-Point (Triangle)", points: 3, stabilityFactor: 0.8 },
  FOUR_POINT: { name: "4-Point (Rectangle)", points: 4, stabilityFactor: 0.9 },
  SIX_POINT: { name: "6-Point (Extended)", points: 6, stabilityFactor: 0.95 },
  EIGHT_POINT: { name: "8-Point (Full)", points: 8, stabilityFactor: 1.0 },
};

interface CargoPiece {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  posX: number;
  posY: number;
  posZ: number;
  color: string;
}

interface CoGResult {
  cogX: number;
  cogY: number;
  cogZ: number;
  totalWeight: number;
  boundingBox: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    minZ: number;
    maxZ: number;
  };
  stability: {
    status: "stable" | "marginal" | "unstable";
    tippingAngleX: number;
    tippingAngleY: number;
    stabilityMarginX: number;
    stabilityMarginY: number;
  };
  supportPointLoads: number[];
  recommendedLiftingPoints: { x: number; y: number; z: number }[];
  warnings: string[];
  suggestions: string[];
}

const CARGO_COLORS = [
  "#0F4C81", // Ocean Blue
  "#2E8B57", // Logistics Green
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#06B6D4", // Cyan
  "#EF4444", // Red
  "#84CC16", // Lime
];

// Generate unique ID
const generateId = () => Math.random().toString(36).substring(2, 9);

// Create default cargo piece
const createDefaultCargoPiece = (index: number): CargoPiece => ({
  id: generateId(),
  name: `Cargo Piece ${index + 1}`,
  length: 2,
  width: 1.5,
  height: 1,
  weight: 5000,
  posX: 0,
  posY: 0,
  posZ: 0,
  color: CARGO_COLORS[index % CARGO_COLORS.length],
});

// Animated badge component
const AnimatedBadge = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <Badge variant="secondary" className="px-3 py-1 text-sm font-medium">
      {children}
    </Badge>
  </motion.div>
);

// FAQ data
const FAQ_DATA = [
  {
    question: "What is the Center of Gravity Method and how is it used in logistics?",
    answer: `The Center of Gravity (CoG) Method is a quantitative approach used in logistics and supply chain management to determine the optimal location for distribution centers, warehouses, or facilities. This method calculates the geographic center point that minimizes total transportation costs based on the location of demand points and their relative weights or volumes.

In practical applications, the CoG method considers multiple factors including customer locations, demand volumes at each location, transportation costs per unit distance, and service level requirements. The calculation uses weighted averages of coordinates (latitude and longitude or X-Y coordinates) where each demand point's influence is proportional to its weight in the overall distribution network.

For facility location decisions, the method provides an initial starting point that can be refined based on practical considerations such as land availability, infrastructure quality, labor market conditions, and regulatory requirements. The CoG method is particularly valuable during the initial screening phase of site selection when evaluating multiple potential locations across a broad geographic area.

Modern implementations often incorporate additional factors beyond simple distance minimization, including inventory carrying costs, facility construction and operating costs, service time constraints, and multi-echelon network considerations. Advanced versions may also account for different transportation modes, varying cost structures, and dynamic demand patterns over time.`
  },
  {
    question: "What are the key factors to consider when using the Center of Gravity method?",
    answer: `When applying the Center of Gravity method for facility location or cargo balancing, several critical factors must be considered to ensure accurate and practical results. First, demand volume or weight at each location is fundamental—the method gives more influence to high-volume locations, so accurate demand forecasting is essential. Seasonal variations and growth trends should be factored into these projections.

Transportation cost structures vary significantly by mode (truck, rail, air, ocean) and by lane. The simple distance-based approach may not capture real cost differences caused by terrain, congestion, fuel surcharges, or carrier pricing strategies. Many practitioners use weighted distances where costs per mile vary by lane or region.

Service level requirements impose constraints that may override the mathematically optimal location. Maximum delivery distances, next-day service commitments, and customer pickup preferences can shift the optimal location away from the pure center of gravity. These constraints often require iterative adjustments to balance cost minimization with service objectives.

Infrastructure and operational factors include highway access, rail connectivity, port proximity, utilities availability, and labor market conditions. The theoretical optimal location may be infeasible due to zoning restrictions, land costs, or lack of suitable sites. Environmental considerations, including emissions regulations and sustainability goals, increasingly influence location decisions beyond pure cost calculations.`
  },
  {
    question: "How does the Center of Gravity method differ from other location analysis techniques?",
    answer: `The Center of Gravity method is one of several location analysis techniques, each with distinct advantages and limitations. Unlike qualitative methods such as factor rating or weighted scoring, the CoG method provides an objective, mathematically-derived starting point based on quantitative data. This makes it particularly useful for initial screening when evaluating large geographic areas.

Compared to the Load-Distance method, the CoG approach calculates a single optimal point mathematically, while Load-Distance evaluates multiple pre-defined candidate locations. The CoG method may suggest locations that aren't practically available, whereas Load-Distance assesses real alternatives. However, CoG provides a theoretical optimum against which candidate locations can be measured.

Network optimization models go beyond the single-facility CoG approach to evaluate multi-facility networks. These models consider facility fixed costs, capacity constraints, and complex routing patterns that the basic CoG method cannot address. For strategic network design involving multiple distribution centers, more sophisticated optimization techniques are typically required.

The Gravity Model variant incorporates interaction intensity between origin-destination pairs, making it suitable for retail location planning where customer travel behavior is a key factor. This differs from the standard CoG method which assumes all demand flows to a single central point. The choice between methods depends on the specific problem context, data availability, and decision criteria.`
  },
  {
    question: "What are the limitations of the Center of Gravity method?",
    answer: `While the Center of Gravity method provides valuable insights for location decisions, it has several important limitations that practitioners must understand. First, the method assumes a flat plane and straight-line distances, which rarely reflect real-world transportation networks. Actual travel distances may be 20-40% greater than straight-line distances due to road networks, terrain features, and routing constraints.

The basic CoG method treats transportation cost as directly proportional to distance, ignoring economies of scale, volume discounts, and modal differences. In reality, per-unit transportation costs decrease with volume, vary by mode, and are influenced by lane-specific factors such as backhaul opportunities and carrier competition. These complexities require modifications to the basic model.

Single-facility optimization is another limitation. The method finds the optimal location for one facility but cannot address multi-facility network design problems where demand allocation, facility sizing, and inter-facility flows must be optimized simultaneously. For network-level decisions, more sophisticated operations research techniques are needed.

The method also assumes static demand patterns and doesn't account for temporal variations, growth trends, or strategic considerations such as market expansion plans. Dynamic models that incorporate demand uncertainty and multi-period planning horizons provide more robust solutions for strategic decisions. Finally, the CoG calculation ignores qualitative factors such as labor quality, tax environment, regulatory climate, and community receptiveness that significantly impact facility success.`
  },
  {
    question: "How can I validate and refine Center of Gravity calculations for real-world applications?",
    answer: `Validating and refining Center of Gravity calculations requires a systematic approach that bridges theoretical optimization with practical constraints. Begin by comparing the calculated optimal location against actual transportation costs using geographic information systems (GIS) that model real road networks, travel times, and distances. This ground-truthing often reveals significant deviations from straight-line assumptions.

Sensitivity analysis is crucial for understanding how changes in input parameters affect the optimal location. Vary demand weights by ±10-20% to assess stability of the solution, and evaluate scenarios representing growth forecasts or market shifts. If the optimal location shifts dramatically with small input changes, the solution may be unstable and require additional constraints or analysis.

Field verification of candidate locations should include site visits to assess infrastructure quality, access to transportation networks, utility availability, and development potential. Local zoning regulations, environmental constraints, and community acceptance factors can only be evaluated through on-the-ground research and stakeholder engagement.

Iterative refinement incorporating stakeholder feedback improves practical acceptance of the final location decision. Operations teams can provide insights on service delivery requirements, while real estate specialists can evaluate site availability and costs. Finance teams should validate cost assumptions and model total cost of ownership including facility development, operating expenses, and ongoing transportation costs. This collaborative approach ensures the mathematical optimum is translated into a feasible and effective location choice.`
  },
  {
    question: "What role does Center of Gravity analysis play in cargo handling and lifting operations?",
    answer: `In cargo handling and lifting operations, Center of Gravity analysis is critical for safety, efficiency, and equipment selection. The CoG determines how weight is distributed across lifting points and influences the forces acting on rigging equipment. For crane operations, the hook must be positioned directly above the CoG to prevent load swing, rotation, or dangerous pendulum effects during lifting.

Stability during transport depends heavily on CoG position relative to the support base. A high CoG increases the risk of tipping during acceleration, braking, or cornering. Maritime cargo securing calculations use CoG position to determine lashing requirements and predict how cargo will behave under vessel motions including rolling, pitching, and heaving.

Load moment calculations for mobile cranes and other lifting equipment require accurate CoG data to ensure the equipment operates within its rated capacity. The load moment (weight × radius from the crane's center of rotation) determines whether a lift can be safely performed. Incorrect CoG assumptions can lead to overloading and catastrophic equipment failure.

For multi-piece cargo assemblies, calculating the combined CoG requires considering each component's individual CoG and weight. This composite calculation determines the overall balance point and influences how the assembly should be rigged and lifted. Understanding CoG distribution also helps in planning cargo placement on trucks, railcars, and vessels to optimize stability and maximize payload capacity.`
  },
  {
    question: "How do modern technologies enhance Center of Gravity analysis?",
    answer: `Modern technologies have significantly enhanced Center of Gravity analysis capabilities, making it more accurate, accessible, and actionable. Geographic Information Systems (GIS) enable real-world distance calculations using actual road networks, traffic patterns, and travel times rather than idealized straight-line distances. This dramatically improves the accuracy of location optimization for logistics applications.

3D scanning and modeling technologies allow precise determination of cargo CoG for complex, irregularly-shaped loads. Laser scanning and photogrammetry create detailed digital models from which CoG can be calculated with high precision. This is particularly valuable for project cargo, heavy lift operations, and offshore equipment where safety margins depend on accurate weight distribution data.

Cloud computing and advanced optimization algorithms enable rapid evaluation of complex multi-facility network scenarios that would be impossible with manual calculations. Real-time data integration allows dynamic CoG analysis that responds to changing demand patterns, traffic conditions, and operational constraints. Machine learning models can predict demand shifts and automatically update optimal locations.

Digital twins and simulation tools enable virtual testing of facility locations and cargo configurations before physical implementation. These technologies allow planners to evaluate scenarios, identify potential problems, and optimize configurations in a risk-free virtual environment. Integration with enterprise systems ensures that CoG calculations are based on current, accurate data and that results flow directly into operational planning and execution systems.`
  },
  {
    question: "What are the best practices for implementing Center of Gravity analysis in supply chain planning?",
    answer: `Implementing Center of Gravity analysis effectively in supply chain planning requires adherence to several best practices that ensure practical value and stakeholder acceptance. Start with high-quality data—garbage in, garbage out applies strongly to location analysis. Validate customer location data, demand volumes, and growth projections through multiple sources before analysis.

Use iterative refinement rather than expecting a single calculation to provide the final answer. Begin with the mathematical CoG as a starting point, then layer in practical constraints such as available sites, transportation infrastructure, labor markets, and regulatory requirements. Each constraint may shift the optimal location, requiring recalculation of costs and service levels.

Engage cross-functional stakeholders throughout the process. Operations teams understand service requirements and practical constraints, real estate teams know site availability and costs, finance teams validate cost assumptions, and legal teams assess regulatory risks. This collaborative approach ensures that the final location decision balances analytical rigor with practical feasibility.

Document assumptions and conduct sensitivity analysis to understand the robustness of the solution. Present results with appropriate confidence intervals and scenario ranges rather than single-point estimates. This transparency helps decision-makers understand uncertainty and make informed trade-offs. Finally, establish processes for periodic re-evaluation as market conditions, demand patterns, and cost structures evolve over time. Location decisions have long-lasting implications, but periodic optimization ensures the network remains effective as conditions change.`
  }
];

// Pro tips data
const PRO_TIPS = [
  {
    icon: Target,
    title: "Start with Accurate Data",
    description: "Use precise coordinates and weights for each demand point. Small input errors can significantly shift the calculated optimal location."
  },
  {
    icon: MapPin,
    title: "Consider Real Distance Networks",
    description: "Factor in actual road networks, traffic patterns, and terrain features rather than straight-line distances for more realistic results."
  },
  {
    icon: Layers,
    title: "Layer in Constraints Gradually",
    description: "Begin with the mathematical optimum, then add practical constraints one at a time to understand their impact on the solution."
  },
  {
    icon: TrendingUp,
    title: "Account for Future Growth",
    description: "Project demand patterns 3-5 years ahead. A location optimal today may become suboptimal as demand shifts over time."
  },
  {
    icon: DollarSign,
    title: "Include All Cost Components",
    description: "Consider facility costs, labor, taxes, utilities, and inventory carrying costs—not just transportation expenses."
  },
  {
    icon: Users,
    title: "Engage Stakeholders Early",
    description: "Involve operations, real estate, and finance teams from the start to ensure practical feasibility and organizational buy-in."
  }
];

// Common mistakes data
const COMMON_MISTAKES = [
  {
    icon: XCircle,
    title: "Assuming Uniform Density",
    description: "Real cargo often has non-uniform weight distribution. Heavy components may be concentrated in specific areas, shifting the actual CoG from geometric center. Always verify with weight tests or manufacturer specifications when available."
  },
  {
    icon: XCircle,
    title: "Ignoring Dynamic Forces",
    description: "Static CoG analysis doesn't account for acceleration, braking, or vessel motions. These dynamic forces can shift the effective CoG and cause tipping. Apply appropriate safety factors for transport conditions."
  },
  {
    icon: XCircle,
    title: "Neglecting Height Effects",
    description: "A high CoG significantly increases tipping risk even when horizontal position is correct. Taller cargo requires more careful handling and may need special transport arrangements or additional securing measures."
  },
  {
    icon: XCircle,
    title: "Overlooking Asymmetric Loads",
    description: "Off-center CoG positions require special handling considerations. Crane hooks may need offset positions, and transport vehicles may need weight redistribution to avoid axle overloads."
  },
  {
    icon: XCircle,
    title: "Skipping Validation Tests",
    description: "Theoretical calculations should be validated through test lifts or tilt tests where safety permits. Small modeling errors can have significant consequences during actual operations."
  }
];

export function CenterOfGravityFinder() {
  const [activeTab, setActiveTab] = useState("calculator");
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [cargoPieces, setCargoPieces] = useState<CargoPiece[]>([createDefaultCargoPiece(0)]);
  const [supportConfig, setSupportConfig] = useState<keyof typeof SUPPORT_CONFIGS>("FOUR_POINT");
  const [supportWidth, setSupportWidth] = useState<number>(3);
  const [supportLength, setSupportLength] = useState<number>(4);
  const [safetyFactor, setSafetyFactor] = useState<number>(1.5);
  const [groundClearance, setGroundClearance] = useState<number>(0.5);
  
  // Scenario analysis state
  const [scenarioWeightMultiplier, setScenarioWeightMultiplier] = useState<number>(1.0);
  const [scenarioPositionOffset, setScenarioPositionOffset] = useState<number>(0);

  // Unit conversion helpers
  const toMetric = useCallback((value: number, type: "length" | "weight") => {
    if (unitSystem === "metric") return value;
    return value * CONVERSIONS.imperial[type === "length" ? "length" : "weight"];
  }, [unitSystem]);

  const fromMetric = useCallback((value: number, type: "length" | "weight") => {
    if (unitSystem === "metric") return value;
    return value / CONVERSIONS.imperial[type === "length" ? "length" : "weight"];
  }, [unitSystem]);

  // Calculate Center of Gravity
  const cogResult = useMemo((): CoGResult => {
    if (cargoPieces.length === 0) {
      return {
        cogX: 0,
        cogY: 0,
        cogZ: 0,
        totalWeight: 0,
        boundingBox: { minX: 0, maxX: 0, minY: 0, maxY: 0, minZ: 0, maxZ: 0 },
        stability: {
          status: "unstable",
          tippingAngleX: 0,
          tippingAngleY: 0,
          stabilityMarginX: 0,
          stabilityMarginY: 0,
        },
        supportPointLoads: [],
        recommendedLiftingPoints: [],
        warnings: ["No cargo pieces defined"],
        suggestions: ["Add at least one cargo piece to begin calculations"],
      };
    }

    // Apply scenario modifications
    const modifiedPieces = cargoPieces.map(piece => ({
      ...piece,
      weight: piece.weight * scenarioWeightMultiplier,
      posX: piece.posX + scenarioPositionOffset,
    }));

    // Convert all pieces to metric for calculations
    const metricPieces = modifiedPieces.map((piece) => ({
      ...piece,
      length: toMetric(piece.length, "length"),
      width: toMetric(piece.width, "length"),
      height: toMetric(piece.height, "length"),
      weight: toMetric(piece.weight, "weight"),
      posX: toMetric(piece.posX, "length"),
      posY: toMetric(piece.posY, "length"),
      posZ: toMetric(piece.posZ, "length"),
    }));

    // Calculate total weight
    const totalWeight = metricPieces.reduce((sum, piece) => sum + piece.weight, 0);

    // Calculate weighted center of gravity
    let cogX = 0;
    let cogY = 0;
    let cogZ = 0;

    metricPieces.forEach((piece) => {
      const pieceCogX = piece.posX + piece.length / 2;
      const pieceCogY = piece.posY + piece.width / 2;
      const pieceCogZ = piece.posZ + piece.height / 2;

      cogX += pieceCogX * piece.weight;
      cogY += pieceCogY * piece.weight;
      cogZ += pieceCogZ * piece.weight;
    });

    cogX /= totalWeight;
    cogY /= totalWeight;
    cogZ /= totalWeight;

    // Calculate bounding box
    const boundingBox = {
      minX: Math.min(...metricPieces.map((p) => p.posX)),
      maxX: Math.max(...metricPieces.map((p) => p.posX + p.length)),
      minY: Math.min(...metricPieces.map((p) => p.posY)),
      maxY: Math.max(...metricPieces.map((p) => p.posY + p.width)),
      minZ: Math.min(...metricPieces.map((p) => p.posZ)),
      maxZ: Math.max(...metricPieces.map((p) => p.posZ + p.height)),
    };

    // Calculate stability
    const totalLength = boundingBox.maxX - boundingBox.minX;
    const totalWidth = boundingBox.maxY - boundingBox.minY;
    const totalHeight = boundingBox.maxZ - boundingBox.minZ;

    // Distance from CoG to edges
    const distToFront = cogX - boundingBox.minX;
    const distToRear = boundingBox.maxX - cogX;
    const distToLeft = cogY - boundingBox.minY;
    const distToRight = boundingBox.maxY - cogY;

    // Tipping angles (when CoG projection falls outside support base)
    const tippingAngleX = Math.atan(Math.min(distToFront, distToRear) / cogZ) * (180 / Math.PI);
    const tippingAngleY = Math.atan(Math.min(distToLeft, distToRight) / cogZ) * (180 / Math.PI);

    // Stability margins (percentage of base within stable zone)
    const stabilityMarginX = Math.min(distToFront, distToRear) / (totalLength / 2) * 100;
    const stabilityMarginY = Math.min(distToLeft, distToRight) / (totalWidth / 2) * 100;

    // Determine stability status
    let stabilityStatus: "stable" | "marginal" | "unstable" = "stable";
    if (stabilityMarginX < 20 || stabilityMarginY < 20 || tippingAngleX < 15 || tippingAngleY < 15) {
      stabilityStatus = "unstable";
    } else if (stabilityMarginX < 35 || stabilityMarginY < 35 || tippingAngleX < 25 || tippingAngleY < 25) {
      stabilityStatus = "marginal";
    }

    // Calculate support point loads
    const supportPoints = SUPPORT_CONFIGS[supportConfig].points;
    const supportWidthM = toMetric(supportWidth, "length");
    const supportLengthM = toMetric(supportLength, "length");

    // Generate support point positions
    const supportPositions: { x: number; y: number }[] = [];
    const centerX = (boundingBox.minX + boundingBox.maxX) / 2;
    const centerY = (boundingBox.minY + boundingBox.maxY) / 2;

    if (supportPoints === 3) {
      supportPositions.push(
        { x: centerX, y: centerY - supportWidthM / 2 },
        { x: centerX - supportLengthM / 2, y: centerY + supportWidthM / 2 },
        { x: centerX + supportLengthM / 2, y: centerY + supportWidthM / 2 }
      );
    } else if (supportPoints === 4) {
      supportPositions.push(
        { x: centerX - supportLengthM / 2, y: centerY - supportWidthM / 2 },
        { x: centerX + supportLengthM / 2, y: centerY - supportWidthM / 2 },
        { x: centerX - supportLengthM / 2, y: centerY + supportWidthM / 2 },
        { x: centerX + supportLengthM / 2, y: centerY + supportWidthM / 2 }
      );
    } else if (supportPoints >= 6) {
      const spacing = supportLengthM / 3;
      supportPositions.push(
        { x: centerX - supportLengthM / 2, y: centerY - supportWidthM / 2 },
        { x: centerX, y: centerY - supportWidthM / 2 },
        { x: centerX + supportLengthM / 2, y: centerY - supportWidthM / 2 },
        { x: centerX - supportLengthM / 2, y: centerY + supportWidthM / 2 },
        { x: centerX, y: centerY + supportWidthM / 2 },
        { x: centerX + supportLengthM / 2, y: centerY + supportWidthM / 2 }
      );
      if (supportPoints === 8) {
        supportPositions.push(
          { x: centerX - supportLengthM / 2, y: centerY },
          { x: centerX + supportLengthM / 2, y: centerY }
        );
      }
    }

    // Calculate load distribution using inverse distance weighting
    const supportPointLoads = supportPositions.map((pos) => {
      const distance = Math.sqrt(Math.pow(cogX - pos.x, 2) + Math.pow(cogY - pos.y, 2));
      const maxDist = Math.sqrt(Math.pow(supportLengthM / 2, 2) + Math.pow(supportWidthM / 2, 2));
      const loadFactor = 1 - (distance / maxDist) * 0.5;
      return (totalWeight * loadFactor) / supportPoints;
    });

    // Normalize loads
    const totalLoad = supportPointLoads.reduce((sum, load) => sum + load, 0);
    const normalizedLoads = supportPointLoads.map((load) => (load / totalLoad) * totalWeight);

    // Recommended lifting points (centered around CoG)
    const recommendedLiftingPoints = [
      { x: cogX - supportLengthM * 0.2, y: cogY, z: cogZ + totalHeight * 0.3 },
      { x: cogX + supportLengthM * 0.2, y: cogY, z: cogZ + totalHeight * 0.3 },
    ];

    // Generate warnings and suggestions
    const warnings: string[] = [];
    const suggestions: string[] = [];

    if (cogZ > totalHeight * 0.6) {
      warnings.push("Center of gravity is high - increased tipping risk");
      suggestions.push("Consider lowering heavy components or adding ballast at the base");
    }

    if (Math.abs(cogX - centerX) > totalLength * 0.2) {
      warnings.push("CoG is significantly offset from center in X direction");
      suggestions.push("Reposition cargo pieces to balance the load");
    }

    if (Math.abs(cogY - centerY) > totalWidth * 0.2) {
      warnings.push("CoG is significantly offset from center in Y direction");
      suggestions.push("Adjust cargo arrangement to center the weight distribution");
    }

    if (tippingAngleX < 20 || tippingAngleY < 20) {
      warnings.push("Low tipping angle - cargo may become unstable during handling");
      suggestions.push("Use additional securing measures during transport");
    }

    if (totalWeight > 50000) {
      suggestions.push("Heavy cargo - ensure crane and rigging capacity is verified");
    }

    return {
      cogX,
      cogY,
      cogZ,
      totalWeight,
      boundingBox,
      stability: {
        status: stabilityStatus,
        tippingAngleX,
        tippingAngleY,
        stabilityMarginX,
        stabilityMarginY,
      },
      supportPointLoads: normalizedLoads,
      recommendedLiftingPoints,
      warnings,
      suggestions,
    };
  }, [cargoPieces, supportConfig, supportWidth, supportLength, toMetric, scenarioWeightMultiplier, scenarioPositionOffset]);

  // Chart data for weight distribution
  const weightDistributionData = useMemo(() => {
    return cargoPieces.map((piece, index) => ({
      name: piece.name,
      weight: toMetric(piece.weight, "weight"),
      color: piece.color,
      percentage: (toMetric(piece.weight, "weight") / cogResult.totalWeight) * 100,
    }));
  }, [cargoPieces, cogResult.totalWeight, toMetric]);

  // Support point load chart data
  const supportLoadData = useMemo(() => {
    return cogResult.supportPointLoads.map((load, index) => ({
      name: `Point ${index + 1}`,
      load: Math.round(load),
      percentage: (load / cogResult.totalWeight) * 100,
    }));
  }, [cogResult.supportPointLoads, cogResult.totalWeight]);

  // Scatter plot data for location visualization
  const scatterData = useMemo(() => {
    return cargoPieces.map((piece) => ({
      x: toMetric(piece.posX + piece.length / 2, "length"),
      y: toMetric(piece.posY + piece.width / 2, "length"),
      z: toMetric(piece.weight, "weight"),
      name: piece.name,
      color: piece.color,
    }));
  }, [cargoPieces, toMetric]);

  // Distance comparison data
  const distanceComparisonData = useMemo(() => {
    const centerX = (cogResult.boundingBox.minX + cogResult.boundingBox.maxX) / 2;
    const centerY = (cogResult.boundingBox.minY + cogResult.boundingBox.maxY) / 2;
    
    return [
      { dimension: "Front Distance", value: cogResult.cogX - cogResult.boundingBox.minX, fill: "#0F4C81" },
      { dimension: "Rear Distance", value: cogResult.boundingBox.maxX - cogResult.cogX, fill: "#2E8B57" },
      { dimension: "Left Distance", value: cogResult.cogY - cogResult.boundingBox.minY, fill: "#F59E0B" },
      { dimension: "Right Distance", value: cogResult.boundingBox.maxY - cogResult.cogY, fill: "#8B5CF6" },
    ];
  }, [cogResult]);

  // Radar chart data for factor analysis
  const radarData = useMemo(() => {
    const centerX = (cogResult.boundingBox.minX + cogResult.boundingBox.maxX) / 2;
    const centerY = (cogResult.boundingBox.minY + cogResult.boundingBox.maxY) / 2;
    const totalLength = cogResult.boundingBox.maxX - cogResult.boundingBox.minX;
    const totalWidth = cogResult.boundingBox.maxY - cogResult.boundingBox.minY;
    
    return [
      { factor: "X Balance", value: Math.min(100 - (Math.abs(cogResult.cogX - centerX) / (totalLength / 2)) * 100, 100) },
      { factor: "Y Balance", value: Math.min(100 - (Math.abs(cogResult.cogY - centerY) / (totalWidth / 2)) * 100, 100) },
      { factor: "Z Position", value: Math.min(100 - (cogResult.cogZ / cogResult.boundingBox.maxZ) * 50, 100) },
      { factor: "X Stability", value: cogResult.stability.stabilityMarginX },
      { factor: "Y Stability", value: cogResult.stability.stabilityMarginY },
    ];
  }, [cogResult]);

  // Scenario comparison data
  const scenarioData = useMemo(() => {
    const scenarios = [];
    for (let mult = 0.5; mult <= 1.5; mult += 0.25) {
      const modifiedWeight = cogResult.totalWeight * mult;
      const modifiedCoGZ = cogResult.cogZ * (mult > 1 ? 1 + (mult - 1) * 0.2 : 1 - (1 - mult) * 0.1);
      scenarios.push({
        name: `${Math.round(mult * 100)}% Weight`,
        weight: modifiedWeight,
        cogZ: modifiedCoGZ,
        tippingAngle: Math.atan(2 / modifiedCoGZ) * (180 / Math.PI),
      });
    }
    return scenarios;
  }, [cogResult]);

  // Add cargo piece
  const addCargoPiece = useCallback(() => {
    setCargoPieces((prev) => [...prev, createDefaultCargoPiece(prev.length)]);
  }, []);

  // Remove cargo piece
  const removeCargoPiece = useCallback((id: string) => {
    setCargoPieces((prev) => prev.filter((piece) => piece.id !== id));
  }, []);

  // Update cargo piece
  const updateCargoPiece = useCallback((id: string, updates: Partial<CargoPiece>) => {
    setCargoPieces((prev) =>
      prev.map((piece) => (piece.id === id ? { ...piece, ...updates } : piece))
    );
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    setCargoPieces([createDefaultCargoPiece(0)]);
    setSupportConfig("FOUR_POINT");
    setSupportWidth(3);
    setSupportLength(4);
    setSafetyFactor(1.5);
    setGroundClearance(0.5);
    setScenarioWeightMultiplier(1.0);
    setScenarioPositionOffset(0);
  }, []);

  // Export function
  const exportResults = useCallback(() => {
    const data = {
      timestamp: new Date().toISOString(),
      cargoPieces: cargoPieces.map(p => ({
        name: p.name,
        dimensions: { length: p.length, width: p.width, height: p.height },
        weight: p.weight,
        position: { x: p.posX, y: p.posY, z: p.posZ },
      })),
      centerOfGravity: {
        x: cogResult.cogX,
        y: cogResult.cogY,
        z: cogResult.cogZ,
      },
      totalWeight: cogResult.totalWeight,
      stability: cogResult.stability,
      boundingBox: cogResult.boundingBox,
      supportPointLoads: cogResult.supportPointLoads,
      warnings: cogResult.warnings,
      suggestions: cogResult.suggestions,
      unitSystem,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cog-analysis-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [cargoPieces, cogResult, unitSystem]);

  // Share function
  const shareResults = useCallback(() => {
    const shareText = `Center of Gravity Analysis Results:
- Total Weight: ${cogResult.totalWeight.toFixed(0)} kg
- CoG Position: (${cogResult.cogX.toFixed(2)}, ${cogResult.cogY.toFixed(2)}, ${cogResult.cogZ.toFixed(2)}) m
- Stability Status: ${cogResult.stability.status}
- X Tipping Angle: ${cogResult.stability.tippingAngleX.toFixed(1)}°
- Y Tipping Angle: ${cogResult.stability.tippingAngleY.toFixed(1)}°`;

    if (navigator.share) {
      navigator.share({
        title: "Center of Gravity Analysis",
        text: shareText,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText).catch(() => {});
    }
  }, [cogResult]);

  // Format number with unit
  const formatValue = (value: number, type: "length" | "weight", decimals = 2) => {
    const displayValue = fromMetric(value, type);
    const unit = unitSystem === "metric"
      ? CONVERSIONS.metric[type === "length" ? "lengthUnit" : "weightUnit"]
      : CONVERSIONS.imperial[type === "length" ? "lengthUnit" : "weightUnit"];
    return `${displayValue.toFixed(decimals)} ${unit}`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 rounded-xl p-8 border">
        <div className="flex flex-wrap gap-2 mb-4">
          <AnimatedBadge delay={0}>
            <Network className="h-3 w-3 mr-1" />
            Logistics Optimization
          </AnimatedBadge>
          <AnimatedBadge delay={0.1}>
            <MapPin className="h-3 w-3 mr-1" />
            Location Analysis
          </AnimatedBadge>
          <AnimatedBadge delay={0.2}>
            <Building2 className="h-3 w-3 mr-1" />
            Distribution Network
          </AnimatedBadge>
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Center of Gravity Finder</h1>
            <p className="text-muted-foreground max-w-2xl">
              Calculate the optimal center of gravity for multi-piece cargo assemblies. 
              Determine stability margins, tipping angles, and recommended lifting points for safe handling operations.
            </p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={resetAll}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" className="gradient-ocean" onClick={shareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calculator">
            <Calculator className="h-4 w-4 mr-2" />
            Calculator
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="scenarios">
            <TrendingUp className="h-4 w-4 mr-2" />
            Scenarios
          </TabsTrigger>
          <TabsTrigger value="guide">
            <FileText className="h-4 w-4 mr-2" />
            Guide
          </TabsTrigger>
          <TabsTrigger value="faq">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQ
          </TabsTrigger>
        </TabsList>

        {/* Calculator Tab */}
        <TabsContent value="calculator" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-sm">
                {cargoPieces.length} piece{cargoPieces.length !== 1 ? "s" : ""}
              </Badge>
              <div className="flex items-center gap-2">
                <Label className="text-sm">Units:</Label>
                <Select
                  value={unitSystem}
                  onValueChange={(v) => setUnitSystem(v as "metric" | "imperial")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="metric">Metric (m, kg)</SelectItem>
                    <SelectItem value="imperial">Imperial (ft, lb)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={addCargoPiece} className="gradient-ocean">
              <Plus className="h-4 w-4 mr-2" />
              Add Cargo Piece
            </Button>
          </div>

          {/* Cargo Pieces */}
          <AnimatePresence>
            {cargoPieces.map((piece, index) => (
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-l-4" style={{ borderLeftColor: piece.color }}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-5 w-5 text-muted-foreground" />
                        <Input
                          value={piece.name}
                          onChange={(e) => updateCargoPiece(piece.id, { name: e.target.value })}
                          className="w-48 font-semibold"
                        />
                        <Badge
                          style={{ backgroundColor: piece.color + "20", color: piece.color }}
                        >
                          {formatValue(toMetric(piece.weight, "weight"), "weight", 0)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCargoPiece(piece.id)}
                        disabled={cargoPieces.length === 1}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Dimensions */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Dimensions
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">L</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.length}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { length: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">W</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.width}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { width: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">H</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.height}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { height: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {unitSystem === "metric" ? "meters" : "feet"}
                        </p>
                      </div>

                      {/* Weight */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">Weight</Label>
                        <Input
                          type="number"
                          step="1"
                          value={piece.weight}
                          onChange={(e) =>
                            updateCargoPiece(piece.id, { weight: parseFloat(e.target.value) || 0 })
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          {unitSystem === "metric" ? "kilograms" : "pounds"}
                        </p>
                      </div>

                      {/* Position */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Position (X, Y, Z)
                        </Label>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs text-muted-foreground">X</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.posX}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { posX: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Y</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.posY}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { posY: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-muted-foreground">Z</Label>
                            <Input
                              type="number"
                              step="0.1"
                              value={piece.posZ}
                              onChange={(e) =>
                                updateCargoPiece(piece.id, { posZ: parseFloat(e.target.value) || 0 })
                              }
                            />
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Origin at front-left-bottom
                        </p>
                      </div>

                      {/* Volume */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-muted-foreground">
                          Calculated
                        </Label>
                        <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Volume:</span>
                            <span className="font-medium">
                              {formatValue(
                                toMetric(piece.length, "length") *
                                  toMetric(piece.width, "length") *
                                  toMetric(piece.height, "length"),
                                "length"
                              )}
                              <span className="text-xs ml-1">
                                {unitSystem === "metric" ? "m³" : "ft³"}
                              </span>
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Density:</span>
                            <span className="font-medium">
                              {(
                                toMetric(piece.weight, "weight") /
                                (toMetric(piece.length, "length") *
                                  toMetric(piece.width, "length") *
                                  toMetric(piece.height, "length"))
                              ).toFixed(1)}{" "}
                              kg/m³
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Support Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                Support Configuration
              </CardTitle>
              <CardDescription>
                Define support points for weight distribution calculation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Support Type</Label>
                  <Select
                    value={supportConfig}
                    onValueChange={(v) => setSupportConfig(v as keyof typeof SUPPORT_CONFIGS)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(SUPPORT_CONFIGS).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          {config.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Support Width ({unitSystem === "metric" ? "m" : "ft"})</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={supportWidth}
                    onChange={(e) => setSupportWidth(parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label>Support Length ({unitSystem === "metric" ? "m" : "ft"})</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={supportLength}
                    onChange={(e) => setSupportLength(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>

              <Separator />

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Safety Factor</Label>
                  <Select
                    value={safetyFactor.toString()}
                    onValueChange={(v) => setSafetyFactor(parseFloat(v))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.25">1.25 - Light duty</SelectItem>
                      <SelectItem value="1.5">1.5 - Standard</SelectItem>
                      <SelectItem value="2.0">2.0 - Heavy lift</SelectItem>
                      <SelectItem value="2.5">2.5 - Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Ground Clearance ({unitSystem === "metric" ? "m" : "ft"})</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={groundClearance}
                    onChange={(e) => setGroundClearance(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Results Summary */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
                    <Target className="h-5 w-5 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Center of Gravity</p>
                    <p className="text-sm font-bold">
                      ({cogResult.cogX.toFixed(1)}, {cogResult.cogY.toFixed(1)}, {cogResult.cogZ.toFixed(1)})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--logistics)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
                    <Weight className="h-5 w-5 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Weight</p>
                    <p className="text-sm font-bold">{formatValue(cogResult.totalWeight, "weight", 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <RotateCcw className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Tipping Angle</p>
                    <p className="text-sm font-bold">{cogResult.stability.tippingAngleX.toFixed(1)}°</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className={cogResult.stability.status === "stable" ? "border-[var(--logistics)]/20" : cogResult.stability.status === "marginal" ? "border-amber-500/20" : "border-destructive/20"}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${cogResult.stability.status === "stable" ? "bg-[var(--logistics)]/10" : cogResult.stability.status === "marginal" ? "bg-amber-500/10" : "bg-destructive/10"}`}>
                    {cogResult.stability.status === "stable" ? (
                      <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
                    ) : cogResult.stability.status === "marginal" ? (
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stability</p>
                    <p className={`text-sm font-bold capitalize ${cogResult.stability.status === "stable" ? "text-[var(--logistics)]" : cogResult.stability.status === "marginal" ? "text-amber-500" : "text-destructive"}`}>
                      {cogResult.stability.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analysis Tab */}
        <TabsContent value="analysis" className="space-y-6 mt-6">
          {/* Summary Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-[var(--ocean)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-[var(--ocean)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Center of Gravity</p>
                    <p className="text-lg font-bold">
                      ({formatValue(cogResult.cogX, "length", 1)}, {formatValue(cogResult.cogY, "length", 1)}, {formatValue(cogResult.cogZ, "length", 1)})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[var(--logistics)]/20">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[var(--logistics)]/10 flex items-center justify-center">
                    <Weight className="h-6 w-6 text-[var(--logistics)]" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Weight</p>
                    <p className="text-lg font-bold">{formatValue(cogResult.totalWeight, "weight", 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-2 ${
                cogResult.stability.status === "stable"
                  ? "border-[var(--logistics)]/30 bg-[var(--logistics)]/5"
                  : cogResult.stability.status === "marginal"
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      cogResult.stability.status === "stable"
                        ? "bg-[var(--logistics)]/20"
                        : cogResult.stability.status === "marginal"
                        ? "bg-amber-500/20"
                        : "bg-destructive/20"
                    }`}
                  >
                    {cogResult.stability.status === "stable" ? (
                      <CheckCircle2 className="h-6 w-6 text-[var(--logistics)]" />
                    ) : cogResult.stability.status === "marginal" ? (
                      <AlertCircle className="h-6 w-6 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-destructive" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Stability Status</p>
                    <p
                      className={`text-lg font-bold capitalize ${
                        cogResult.stability.status === "stable"
                          ? "text-[var(--logistics)]"
                          : cogResult.stability.status === "marginal"
                          ? "text-amber-500"
                          : "text-destructive"
                      }`}
                    >
                      {cogResult.stability.status}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Warnings */}
          {cogResult.warnings.length > 0 && (
            <Card className="border-destructive/50 bg-destructive/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {cogResult.warnings.map((warning, index) => (
                    <div key={index} className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{warning}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggestions */}
          {cogResult.suggestions.length > 0 && (
            <Card className="border-blue-500/50 bg-blue-500/5">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {cogResult.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                      <Info className="h-5 w-5 shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Scatter Plot - Location Visualization */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--ocean)]" />
                  Location Scatter Plot
                </CardTitle>
                <CardDescription>
                  Cargo piece positions with CoG marker
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        type="number" 
                        dataKey="x" 
                        name="X Position" 
                        unit="m"
                        label={{ value: "X (Length)", position: "bottom", offset: 0 }}
                      />
                      <YAxis 
                        type="number" 
                        dataKey="y" 
                        name="Y Position" 
                        unit="m"
                        label={{ value: "Y (Width)", angle: -90, position: "insideLeft" }}
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} name="Weight" unit="kg" />
                      <Tooltip 
                        cursor={{ strokeDasharray: "3 3" }}
                        formatter={(value: number, name: string) => [`${value.toFixed(2)}`, name]}
                      />
                      <ReferenceLine x={cogResult.cogX} stroke="#EF4444" strokeDasharray="5 5" />
                      <ReferenceLine y={cogResult.cogY} stroke="#EF4444" strokeDasharray="5 5" />
                      <Scatter 
                        name="Cargo Pieces" 
                        data={scatterData} 
                        fill="#0F4C81"
                      >
                        {scatterData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500" style={{ borderStyle: "dashed" }} />
                    <span className="text-muted-foreground">CoG Lines</span>
                  </div>
                  {scatterData.map((entry, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-muted-foreground">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart - Distance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ruler className="h-5 w-5 text-[var(--logistics)]" />
                  Distance Comparison
                </CardTitle>
                <CardDescription>
                  CoG distances from bounding box edges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={distanceComparisonData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis type="number" unit="m" />
                      <YAxis type="category" dataKey="dimension" width={100} />
                      <Tooltip 
                        formatter={(value: number) => [`${value.toFixed(2)} m`, "Distance"]}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {distanceComparisonData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart - Factor Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                  Factor Analysis
                </CardTitle>
                <CardDescription>
                  Multi-dimensional stability assessment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid strokeDasharray="3 3" opacity={0.3} />
                      <PolarAngleAxis dataKey="factor" className="text-sm" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="value"
                        stroke="#0F4C81"
                        fill="#0F4C81"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Weight Distribution Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-[var(--logistics)]" />
                  Weight Distribution
                </CardTitle>
                <CardDescription>
                  Weight share by cargo piece
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={weightDistributionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="weight"
                        label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {weightDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value.toFixed(0)} kg`, "Weight"]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Support Point Loads */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="h-5 w-5 text-[var(--ocean)]" />
                Support Point Load Distribution
              </CardTitle>
              <CardDescription>
                Estimated weight on each support point based on CoG position
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={supportLoadData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(v) => `${v} kg`} />
                    <Tooltip
                      formatter={(value: number, name: string) => [
                        name === "load" ? `${value} kg` : `${value.toFixed(1)}%`,
                        name === "load" ? "Load" : "Share",
                      ]}
                    />
                    <Bar dataKey="load" fill="#0F4C81" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                {cogResult.supportPointLoads.map((load, index) => (
                  <div key={index} className="p-3 bg-muted/50 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Point {index + 1}</p>
                    <p className="text-lg font-bold text-[var(--ocean)]">
                      {formatValue(load, "weight", 0)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {((load / cogResult.totalWeight) * 100).toFixed(1)}%
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommended Lifting Points */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-[var(--ocean)]" />
                Recommended Lifting Points
              </CardTitle>
              <CardDescription>
                Optimal hook positions centered around the CoG
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {cogResult.recommendedLiftingPoints.map((point, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">Lifting Point {index + 1}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center p-2 bg-[var(--ocean)]/10 rounded">
                        <p className="text-xs text-muted-foreground">X</p>
                        <p className="font-bold">{formatValue(point.x, "length", 2)}</p>
                      </div>
                      <div className="text-center p-2 bg-[var(--logistics)]/10 rounded">
                        <p className="text-xs text-muted-foreground">Y</p>
                        <p className="font-bold">{formatValue(point.y, "length", 2)}</p>
                      </div>
                      <div className="text-center p-2 bg-amber-500/10 rounded">
                        <p className="text-xs text-muted-foreground">Z</p>
                        <p className="font-bold">{formatValue(point.z, "length", 2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scenarios Tab */}
        <TabsContent value="scenarios" className="space-y-6 mt-6">
          {/* Scenario Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[var(--ocean)]" />
                What-If Parameters
              </CardTitle>
              <CardDescription>
                Adjust parameters to see how CoG changes under different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Weight Multiplier: {scenarioWeightMultiplier.toFixed(2)}x</Label>
                  <span className="text-sm text-muted-foreground">
                    {(scenarioWeightMultiplier * 100).toFixed(0)}% of original weight
                  </span>
                </div>
                <Slider
                  value={[scenarioWeightMultiplier]}
                  onValueChange={(v) => setScenarioWeightMultiplier(v[0])}
                  min={0.5}
                  max={1.5}
                  step={0.05}
                  className="w-full"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Position Offset: {scenarioPositionOffset.toFixed(1)} m</Label>
                  <span className="text-sm text-muted-foreground">
                    Shift all pieces in X direction
                  </span>
                </div>
                <Slider
                  value={[scenarioPositionOffset]}
                  onValueChange={(v) => setScenarioPositionOffset(v[0])}
                  min={-2}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </CardContent>
          </Card>

          {/* Scenario Comparison Chart */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-[var(--ocean)]" />
                  Weight Sensitivity Analysis
                </CardTitle>
                <CardDescription>
                  How CoG height changes with weight variations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" orientation="left" stroke="#0F4C81" />
                      <YAxis yAxisId="right" orientation="right" stroke="#2E8B57" />
                      <Tooltip />
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="cogZ"
                        stroke="#0F4C81"
                        fill="#0F4C81"
                        fillOpacity={0.2}
                        name="CoG Height (m)"
                      />
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="tippingAngle"
                        stroke="#2E8B57"
                        fill="#2E8B57"
                        fillOpacity={0.2}
                        name="Tipping Angle (°)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-[var(--logistics)]" />
                  Scenario Comparison
                </CardTitle>
                <CardDescription>
                  Weight and stability metrics across scenarios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={scenarioData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="weight" fill="#0F4C81" name="Weight (kg)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="cogZ" fill="#2E8B57" name="CoG Z (m)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Scenario Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Scenario Summary</CardTitle>
              <CardDescription>
                Detailed metrics for each weight scenario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Scenario</th>
                      <th className="text-right p-3">Total Weight</th>
                      <th className="text-right p-3">CoG Z</th>
                      <th className="text-right p-3">Tipping Angle</th>
                      <th className="text-right p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scenarioData.map((scenario, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3 font-medium">{scenario.name}</td>
                        <td className="text-right p-3">{scenario.weight.toFixed(0)} kg</td>
                        <td className="text-right p-3">{scenario.cogZ.toFixed(2)} m</td>
                        <td className="text-right p-3">{scenario.tippingAngle.toFixed(1)}°</td>
                        <td className="text-right p-3">
                          <Badge className={scenario.tippingAngle > 30 ? "bg-[var(--logistics)]" : scenario.tippingAngle > 20 ? "bg-amber-500" : "bg-destructive"}>
                            {scenario.tippingAngle > 30 ? "Stable" : scenario.tippingAngle > 20 ? "Marginal" : "Unstable"}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sensitivity Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
                Sensitivity Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-[var(--ocean)]" />
                    <span className="font-medium">Weight Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    A 50% increase in weight may shift CoG height by up to 10% depending on cargo configuration.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-4 w-4 text-[var(--logistics)]" />
                    <span className="font-medium">Position Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Moving cargo 1m can shift the overall CoG by the same proportion relative to total weight.
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Stability Impact</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Higher weight scenarios typically increase tipping risk due to elevated CoG position.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6 mt-6">
          {/* What is Center of Gravity Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-[var(--ocean)]" />
                What is the Center of Gravity Method?
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                The <strong>Center of Gravity (CoG) Method</strong> is a fundamental analytical technique used across multiple disciplines including logistics, physics, engineering, and cargo handling. At its core, the method identifies the single point at which the entire mass of an object or system can be considered to act. This point represents the theoretical balance point where all gravitational forces converge.
              </p>
              <p className="text-muted-foreground mt-3">
                In logistics and supply chain management, the CoG method is employed for strategic facility location decisions. By calculating the weighted center of demand points based on their volume or weight, organizations can identify optimal locations for distribution centers, warehouses, and cross-dock facilities that minimize total transportation costs. The mathematical approach uses coordinate geometry to find the point that balances all demand locations according to their relative importance.
              </p>
              <p className="text-muted-foreground mt-3">
                In cargo handling and heavy lift operations, the CoG method is critical for safe lifting and transport. Knowing the precise center of gravity allows engineers to position crane hooks correctly, design appropriate rigging configurations, and predict how cargo will behave during handling operations. An incorrectly identified CoG can lead to dangerous load swings, tipping incidents, or structural failures during lifting.
              </p>
              <p className="text-muted-foreground mt-3">
                The calculation itself involves weighted averaging of coordinates. For each component or demand point, its position is multiplied by its weight or volume, then divided by the total weight or volume. This yields the three-dimensional coordinates (X, Y, Z) of the combined center of gravity. Modern software tools automate these calculations and can handle complex multi-piece assemblies with varying densities and irregular shapes.
              </p>
            </CardContent>
          </Card>

          {/* When to Use */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--logistics)]" />
                When to Use Center of Gravity Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Center of Gravity analysis is most valuable when making location decisions that involve minimizing transportation costs or distances across a network of demand or supply points. The method excels as an initial screening tool during the early stages of strategic planning, providing an objective starting point that can be refined with practical constraints.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Facility Location Decisions:</strong> When evaluating potential sites for new warehouses, distribution centers, or manufacturing facilities, CoG analysis identifies the theoretical optimal location. This is particularly useful when exploring greenfield opportunities where multiple geographic regions are under consideration. The method helps narrow down vast search areas to specific regions for more detailed investigation.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Network Optimization:</strong> In supply chain network design, CoG analysis supports decisions about how many facilities to operate and where to locate them. While sophisticated optimization models handle complex multi-facility scenarios, CoG provides foundational insights about natural demand clusters and geographic centers of gravity for different regions.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Cargo and Heavy Lift Operations:</strong> For project cargo, offshore equipment, and heavy machinery, CoG analysis is essential for planning lifting operations. Before any lift, engineers must calculate the combined center of gravity to position crane hooks, design spreader bars, and determine appropriate rigging configurations. The method is also applied in maritime cargo securing to predict vessel stability and determine lashing requirements.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Transportation Planning:</strong> Route optimization and load planning benefit from understanding the center of gravity. For trucking operations, the CoG position affects axle weight distribution and regulatory compliance. In air freight, weight and balance calculations using CoG principles ensure safe flight operations.
              </p>
            </CardContent>
          </Card>

          {/* Factors Beyond Distance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-amber-500" />
                Factors Beyond Distance
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                While the basic Center of Gravity method focuses on minimizing distances, real-world applications must consider numerous additional factors that influence optimal location decisions. Transportation costs rarely scale linearly with distance, and qualitative factors often override purely quantitative optimization.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Transportation Mode Differences:</strong> Different modes have vastly different cost structures and distance relationships. Trucking costs per mile may be relatively consistent, while rail and ocean shipping offer significant economies over longer distances. Air freight costs are dominated by fixed handling charges rather than distance. Multi-modal shipments require weighted distance factors that reflect actual cost patterns for each mode.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Infrastructure Quality:</strong> The theoretical optimal location may lack necessary infrastructure including highway access, rail sidings, port facilities, or airport proximity. Poor road conditions, weight restrictions on bridges, and limited operating hours can all impact actual transportation costs and service levels. Sites with superior infrastructure may justify higher real estate costs through operational savings.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Labor Market Conditions:</strong> Wage rates, skill availability, and labor regulations vary significantly by location. Areas with lower transportation costs may have higher labor costs or insufficient workforce availability. Turnover rates, training requirements, and union environments all factor into total cost of operations beyond simple distance calculations.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Regulatory and Tax Environment:</strong> State and local tax incentives, zoning regulations, environmental permits, and business climate factors can shift the optimal location away from the geographic center of gravity. Enterprise zones, foreign trade zones, and tax abatement programs may make alternative locations more attractive despite longer transportation distances.
              </p>
            </CardContent>
          </Card>

          {/* Limitations and Considerations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Limitations and Considerations
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm dark:prose-invert max-w-none">
              <p className="text-muted-foreground">
                Understanding the limitations of Center of Gravity analysis is essential for appropriate application and interpretation of results. The method provides valuable insights but should not be used as the sole decision criterion for complex location or engineering problems.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Planar Distance Assumption:</strong> The basic method assumes straight-line distances on a flat plane, ignoring the curvature of the earth and actual transportation networks. Road distances typically exceed straight-line distances by 20-40%, and the ratio varies by terrain and network density. Advanced implementations use GIS-based routing to calculate actual travel distances and times.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Single Facility Focus:</strong> The standard CoG method optimizes for a single facility location. It cannot address multi-facility network design problems where demand allocation, facility sizing, and inter-facility flows must be optimized simultaneously. Network optimization models using mixed-integer programming are required for these more complex scenarios.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Static Demand Assumption:</strong> Traditional CoG analysis assumes fixed demand volumes and locations. Real demand patterns evolve with market conditions, seasonal variations, and strategic growth. Dynamic models that incorporate demand uncertainty and multi-period planning horizons provide more robust solutions for long-term strategic decisions.
              </p>
              <p className="text-muted-foreground mt-3">
                <strong>Uniform Density Assumption:</strong> In cargo applications, the method assumes known center of gravity for each piece based on geometric centers. Real cargo often has non-uniform density, with heavy components concentrated in specific areas. Without actual weight and balance data from manufacturers or weighing tests, calculated CoG positions may differ from reality, potentially leading to unsafe handling operations.
              </p>
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-amber-500" />
                Pro Tips & Best Practices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {PRO_TIPS.map((tip, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center">
                        <tip.icon className="h-4 w-4 text-[var(--ocean)]" />
                      </div>
                      <span className="font-medium">{tip.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{tip.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Common Mistakes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Common Mistakes to Avoid
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {COMMON_MISTAKES.map((mistake, index) => (
                  <div key={index} className="p-4 border border-destructive/20 rounded-lg bg-destructive/5">
                    <div className="flex items-start gap-3">
                      <mistake.icon className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{mistake.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{mistake.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQ Tab */}
        <TabsContent value="faq" className="space-y-6 mt-6">
          <Card className="border-[var(--ocean)]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                Frequently Asked Questions
              </CardTitle>
              <CardDescription>
                Comprehensive answers to common questions about Center of Gravity analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="space-y-4">
                {FAQ_DATA.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground whitespace-pre-line">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={resetAll}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
        <Button variant="outline" size="sm" onClick={exportResults}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button size="sm" className="gradient-ocean" onClick={shareResults}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}
