"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Gauge,
  Ship,
  Leaf,
  Calculator,
  Download,
  Share2,
  RefreshCw,
  Info,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Target,
  BarChart3,
  Anchor,
  Calendar,
  Zap,
  FileText,
  ChevronRight,
  Activity,
  Globe,
  Clock,
  Award,
  AlertCircle,
  BookOpen,
  HelpCircle,
  Fuel,
  Wind,
  Settings,
  LineChart,
  PieChart as PieChartIcon,
  TrendingUp,
  Shield,
  FileCheck,
  Building2,
  AnchorIcon,
  Waves,
  Compass,
  Timer,
  GaugeIcon,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  ReferenceLine,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
  RadialBarChart,
  RadialBar,
  ComposedChart,
} from "recharts";

// Brand Colors
const BRAND_COLORS = {
  ocean: "#0F4C81",
  oceanLight: "#1a6fa8",
  oceanDark: "#0a3559",
  logistics: "#2E8B57",
  logisticsLight: "#3da76d",
  logisticsDark: "#236b44",
};

// Ship types and their reference lines
const SHIP_TYPES = {
  BULK_CARRIER: {
    name: "Bulk Carrier",
    a: 4745,
    c: 0.6225,
    dwtMin: 10000,
    dwtMax: 350000,
    icon: Ship,
    description: "Vessels designed to transport unpackaged bulk cargo like grain, coal, and ore",
  },
  GAS_CARRIER: {
    name: "Gas Carrier",
    a: 10093,
    c: 0.6310,
    dwtMin: 2000,
    dwtMax: 80000,
    icon: Fuel,
    description: "Specialized ships for transporting liquefied gases including LNG and LPG",
  },
  TANKER: {
    name: "Tanker",
    a: 5247,
    c: 0.6105,
    dwtMin: 4000,
    dwtMax: 300000,
    icon: Fuel,
    description: "Ships designed to transport liquids in bulk, primarily crude oil and petroleum products",
  },
  CONTAINER: {
    name: "Container Ship",
    a: 1984,
    c: 0.4894,
    dwtMin: 10000,
    dwtMax: 250000,
    icon: Ship,
    description: "Cargo ships that carry all of their load in containers for efficient handling",
  },
  GENERAL_CARGO: {
    name: "General Cargo Ship",
    a: 31948,
    c: 0.7125,
    dwtMin: 3000,
    dwtMax: 40000,
    icon: Ship,
    description: "Multi-purpose vessels designed to handle various types of breakbulk cargo",
  },
  REFRIGERATED: {
    name: "Refrigerated Cargo Carrier",
    a: 26060,
    c: 0.6496,
    dwtMin: 3000,
    dwtMax: 25000,
    icon: Ship,
    description: "Ships with refrigeration capacity for transporting perishable goods",
  },
  COMBINATION_CARRIER: {
    name: "Combination Carrier",
    a: 12199,
    c: 0.6298,
    dwtMin: 4000,
    dwtMax: 200000,
    icon: Ship,
    description: "Versatile vessels capable of carrying both bulk and liquid cargoes",
  },
  LNG_CARRIER: {
    name: "LNG Carrier",
    a: 9.827,
    c: 0.6200,
    dwtMin: 100000,
    dwtMax: 250000,
    icon: Fuel,
    description: "Specialized tankers for transporting liquefied natural gas at cryogenic temperatures",
  },
  RO_PAX: {
    name: "Ro-Ro Passenger Ship",
    a: 3264,
    c: 0.6277,
    gtMin: 1000,
    gtMax: 60000,
    icon: Ship,
    description: "Roll-on/roll-off passenger vessels combining cargo and passenger transport",
  },
  RO_RO: {
    name: "Ro-Ro Cargo Ship",
    a: 17807,
    c: 0.6450,
    dwtMin: 10000,
    dwtMax: 50000,
    icon: Ship,
    description: "Ships designed for wheeled cargo like cars, trucks, and trailers",
  },
};

// CII rating thresholds (relative to reference line)
const CII_RATINGS = {
  A: { maxRatio: 0.86, color: "#22C55E", label: "Superior", description: "Exceptional environmental performance, significantly below required levels" },
  B: { maxRatio: 0.94, color: "#84CC16", label: "Good", description: "Strong performance, below required levels with room for improvement" },
  C: { maxRatio: 1.06, color: "#EAB308", label: "Moderate", description: "Meeting minimum requirements, the baseline compliance level" },
  D: { maxRatio: 1.18, color: "#F97316", label: "Lower", description: "Below requirements, corrective action plan needed after 3 years" },
  E: { maxRatio: Infinity, color: "#EF4444", label: "Inferior", description: "Significantly below requirements, immediate corrective action needed" },
};

// IMO reduction targets by year
const REDUCTION_TARGETS = [
  { year: 2019, reduction: 0, milestone: "Baseline Year" },
  { year: 2020, reduction: 1, milestone: "Initial Reduction" },
  { year: 2021, reduction: 2, milestone: "Early Implementation" },
  { year: 2022, reduction: 3, milestone: "Pre-Mandatory Phase" },
  { year: 2023, reduction: 5, milestone: "Mandatory Compliance Begins" },
  { year: 2024, reduction: 7, milestone: "Current Year" },
  { year: 2025, reduction: 9, milestone: "Mid-Decade Target" },
  { year: 2026, reduction: 11, milestone: "Continued Reduction" },
  { year: 2027, reduction: 13, milestone: "Approaching 2030" },
  { year: 2028, reduction: 15, milestone: "Pre-2030 Ramp-up" },
  { year: 2029, reduction: 17, milestone: "Final Stretch" },
  { year: 2030, reduction: 20, milestone: "2030 Target Achievement" },
];

// Enhanced FAQ Data with more questions
const FAQ_DATA = [
  {
    question: "What is the Carbon Intensity Indicator (CII) and why does it matter?",
    answer: "The Carbon Intensity Indicator (CII) is a measure of a ship's carbon efficiency developed by the International Maritime Organization (IMO) as part of their strategy to reduce greenhouse gas emissions from international shipping. CII measures how efficiently a ship transports goods in terms of CO2 emissions per unit of transport work (grams of CO2 per cargo-carrying capacity and nautical mile). This metric is crucial because shipping accounts for approximately 3% of global CO2 emissions, and the IMO has set ambitious targets to reduce emissions by at least 40% by 2030 compared to 2008 levels. The CII rating system encourages shipowners and operators to improve operational efficiency through measures like speed optimization, hull maintenance, and fuel efficiency improvements. Ships rated D for three consecutive years or E for a single year must develop a corrective action plan to demonstrate how they will achieve compliance.",
    category: "Basics",
  },
  {
    question: "How is the CII rating calculated for different ship types?",
    answer: "The CII calculation involves several key components. First, the annual fuel consumption is converted to CO2 emissions using specific emission factors (approximately 3.114 tonnes of CO2 per tonne of fuel for heavy fuel oil). Then, the transport work is calculated by multiplying the ship's capacity (DWT or GT for passenger ships) by the distance traveled in nautical miles. The CII value equals the CO2 emissions divided by the transport work, expressed in grams of CO2 per deadweight ton-nautical mile. Each ship type has a reference line calculated using a capacity-based formula: Reference = a × Capacity^(-c), where 'a' and 'c' are type-specific coefficients. For instance, container ships use a = 1984 and c = 0.4894, while bulk carriers use a = 4745 and c = 0.6225. The attained CII is compared against the reference line adjusted for the applicable year's reduction factor. Ratings from A to E are assigned based on how the attained CII compares to the adjusted reference line, with A being the best (at least 14% below reference) and E being the worst (more than 18% above reference).",
    category: "Calculation",
  },
  {
    question: "What are the IMO CII reduction targets and timeline?",
    answer: "The IMO has established a progressive reduction trajectory for CII requirements starting from 2023. The reduction factors apply to the reference lines as follows: 2023 requires a 5% reduction from the 2019 baseline, increasing to 7% in 2024, 9% in 2025, 11% in 2026, 13% in 2027, 15% in 2028, 17% in 2029, and reaching 20% by 2030. This means ships must continuously improve their carbon intensity to maintain the same rating level. The reduction targets are part of the IMO's short-term measures to achieve the overall goal of reducing carbon intensity by at least 40% by 2030 compared to 2008 levels. These targets will be reviewed and potentially strengthened as part of the IMO's revision of the Initial GHG Strategy. Ship operators should plan proactively for these increasingly stringent requirements, as achieving compliance will likely require a combination of operational improvements, technology upgrades, and potentially alternative fuels. The timeline creates a predictable pathway for industry adaptation while driving meaningful emissions reductions.",
    category: "Timeline",
  },
  {
    question: "What happens if my ship receives a D or E CII rating?",
    answer: "Ships that receive a D rating for three consecutive years or an E rating for a single year are required to develop and submit a Corrective Action Plan (CAP) as part of their Ship Energy Efficiency Management Plan (SEEMP). The CAP must be approved by the ship's flag administration or recognized organization and must demonstrate how the ship will achieve a C rating or better in subsequent years. The plan should include specific measures such as speed optimization, hull and propeller cleaning, engine tuning, weather routing implementation, or other operational improvements. Ships without an approved CAP may face port state control inspections and potential detention. Additionally, a poor CII rating can affect a ship's commercial attractiveness, as charterers increasingly consider environmental performance in their selection criteria. Some charter parties now include CII compliance clauses with penalties for underperformance. Repeated non-compliance could ultimately lead to a ship being phased out of certain trades or requiring expensive retrofitting to remain competitive. Financial institutions are also incorporating CII ratings into their lending criteria, potentially affecting access to capital for poorly-rated vessels.",
    category: "Compliance",
  },
  {
    question: "What is the relationship between SEEMP and CII requirements?",
    answer: "The Ship Energy Efficiency Management Plan (SEEMP) is a mandatory document that outlines how a ship will improve its energy efficiency. Since January 2023, SEEMP Part III specifically addresses CII requirements and must include: an implementation plan for achieving the required CII, documented procedures for monitoring and reporting fuel consumption, and corrective action procedures for non-compliance scenarios. The SEEMP must be developed by the shipowner and approved by the flag administration or recognized organization. It should be updated annually with the ship's attained CII and revised improvement plans. The SEEMP also links to the IMO Data Collection System (DCS), which requires ships of 5,000 GT and above to report fuel consumption data annually. This data forms the basis for CII calculations. Effective SEEMP implementation involves regular performance monitoring, crew training, and integration of energy efficiency measures into daily operations. Companies should view SEEMP not just as a compliance requirement but as a framework for systematic improvement of environmental performance and operational cost reduction.",
    category: "Documentation",
  },
  {
    question: "What are the most effective strategies to improve CII rating?",
    answer: "Improving CII rating requires a combination of operational and technical measures. Speed optimization (slow steaming) is often the most effective and immediate measure, as fuel consumption increases exponentially with speed - a 10% speed reduction can reduce fuel consumption by approximately 27%. Hull and propeller maintenance through regular cleaning and advanced anti-fouling coatings can improve efficiency by 5-10%. Weather routing services optimize voyage planning to avoid adverse conditions and utilize favorable currents. Engine optimization, including fuel injection timing and turbocharger matching, can improve fuel efficiency by 2-5%. For longer-term improvements, consider energy-saving devices such as propeller boss cap fins, wake equalizing ducts, or air lubrication systems. Alternative fuels like LNG, biofuels, or synthetic fuels offer significant carbon reduction potential, though they require investment in new infrastructure and technology. Some operators are also exploring wind-assisted propulsion technologies such as rotor sails or wing sails. The optimal strategy depends on ship type, trade route, age, and available capital, but a combination of multiple measures typically yields the best results. Implementing a comprehensive energy management system and engaging crew in efficiency initiatives are also critical success factors.",
    category: "Improvement",
  },
  {
    question: "Are there any corrections or exemptions available for CII calculations?",
    answer: "Yes, the IMO has established several correction factors and adjustment mechanisms for CII calculations. Ships can apply correction factors for specific voyage types: shuttle tankers operating in offshore loading may use a 15% correction; ice-class ships navigating in ice conditions receive adjustments based on ice class notation; and ships with cargo heating or cooling systems can account for this additional energy consumption. There's also a capacity adjustment factor for ships with significant non-cargo deadweight. Correction factors require proper documentation and approval. Additionally, ships may apply for a voyage adjustment for situations beyond their control, such as waiting at anchorage due to port congestion or search and rescue operations. The IMO is continuing to refine these mechanisms based on operational experience. Ships can also use the cube root rule adjustment for partial year operation. It's important to note that correction factors don't change the attained CII value directly but adjust the comparison against the reference line, potentially improving the rating. Proper documentation and timely submission of correction factor applications are essential for successful consideration by the flag administration.",
    category: "Calculations",
  },
  {
    question: "How does CII interact with other IMO regulations like EEXI?",
    answer: "The CII works in conjunction with the Energy Efficiency Existing Ship Index (EEXI) as part of IMO's short-term greenhouse gas reduction measures. While EEXI is a one-time technical measure that certifies a ship's design efficiency at a specific point in time, CII is an operational measure that evaluates actual performance over an entire year. EEXI compliance is required for a ship to obtain its International Energy Efficiency Certificate, whereas CII compliance is demonstrated through annual reporting and rating assignment. A ship can have a good EEXI but still receive a poor CII rating if operated inefficiently. Conversely, a ship with a marginal EEXI might achieve a better CII through careful operational practices. Both regulations came into effect on January 1, 2023, and together they create a comprehensive framework addressing both technical and operational aspects of ship efficiency. Shipowners need to consider both requirements when planning compliance strategies, as improvements for one may benefit the other. For example, engine power limitation (EPL) for EEXI compliance can also help achieve better CII ratings through reduced fuel consumption at lower speeds.",
    category: "Regulations",
  },
  {
    question: "What data is required for CII calculation and reporting?",
    answer: "CII calculation requires comprehensive data collection throughout the year. The primary data inputs include: total fuel consumption by fuel type (Heavy Fuel Oil, Marine Diesel Oil, Liquefied Natural Gas, etc.), distance traveled in nautical miles based on actual voyage tracks, and the ship's capacity (DWT or GT). Fuel consumption data should be collected using approved methods such as fuel flow meters, bunker delivery notes, or tank sounding records. Distance traveled is typically derived from noon reports or automated tracking systems. Additional data may be needed for correction factors, including voyage-specific details for ice navigation, offshore operations, or cargo heating requirements. The IMO Data Collection System (DCS) requires annual reporting of this data to the flag administration, which then transmits aggregated data to the IMO. Ships must maintain detailed records for verification purposes, and the data collection system should be documented in the SEEMP Part III. Many operators are now using digital platforms for automated data collection and reporting, which improves accuracy and reduces administrative burden. Third-party verification of reported data is required to ensure integrity of the CII rating system.",
    category: "Data",
  },
  {
    question: "How do charter parties address CII compliance requirements?",
    answer: "Charter parties are increasingly incorporating CII compliance clauses to allocate responsibility and risk between owners and charterers. These clauses may specify: who bears the cost of CII improvement measures, required operational practices (such as speed limits), procedures for handling non-compliance situations, and potential penalties or incentives tied to CII performance. Common approaches include 'green clauses' that require charterers to operate vessels in accordance with owners' CII management plans, or performance guarantee clauses that specify minimum CII targets. Some charter parties include 'slow steaming' clauses that mandate reduced speeds to improve CII ratings. Time charter parties may allocate fuel costs and operational decisions differently than voyage charters, affecting CII performance responsibilities. Disputes may arise when operational requirements conflict with commercial objectives, such as when charterers demand high speeds that negatively impact CII. Best practice is to clearly define CII-related obligations and establish procedures for addressing non-compliance scenarios before they occur. Industry bodies including BIMCO have developed standard CII clauses for charter parties to promote consistent approaches across the industry.",
    category: "Commercial",
  },
  {
    question: "What technologies are available for real-time CII monitoring?",
    answer: "Real-time CII monitoring systems combine multiple data sources to provide continuous visibility into vessel performance. Key technologies include: fuel flow meters with high-accuracy measurement capabilities, GPS/AIS tracking systems for distance and route monitoring, onboard weather stations for environmental condition tracking, and integrated software platforms that calculate instantaneous and projected CII. Advanced systems use machine learning algorithms to predict CII outcomes based on planned voyages and recommend optimal operational parameters. Many solutions integrate with existing ship management systems and satellite communications for shore-based monitoring. Dashboard interfaces allow both shipboard and shore-based personnel to track performance against targets and identify improvement opportunities. Some systems incorporate 'digital twin' technology to model vessel performance under different conditions and optimize operational decisions. Data analytics features enable benchmarking against fleet averages and identification of best practices. When selecting monitoring technology, consider factors such as accuracy requirements, integration capabilities, communication costs, and ease of use for crew. Investment in monitoring systems typically delivers rapid return through improved operational efficiency and reduced risk of non-compliance.",
    category: "Technology",
  },
  {
    question: "How will CII requirements evolve beyond 2030?",
    answer: "The IMO is developing revised greenhouse gas reduction targets that will likely extend and strengthen CII requirements beyond 2030. The 2023 IMO Strategy on reduction of GHG emissions from ships aims for net-zero emissions by or around 2050, with interim targets of at least 20% reduction by 2030 and 70% by 2040 compared to 2008 levels. These targets suggest that CII reduction factors will continue to increase beyond the current 20% target for 2030. Industry experts anticipate reduction factors potentially reaching 30-40% by 2035 and 50-60% by 2040. The IMO is also developing a 'life-cycle' approach that would account for Well-to-Wake emissions rather than just Tank-to-Wake, potentially favoring alternative fuels with lower overall carbon footprint. Economic measures such as carbon pricing or fuel standards may be introduced to create additional incentives for decarbonization. Shipowners should anticipate increasingly stringent requirements and plan vessel investments accordingly. The transition will likely favor vessels capable of using zero or near-zero emission fuels, while older, less efficient vessels may face accelerated obsolescence. Staying informed of regulatory developments and participating in industry consultations can help companies prepare for evolving requirements.",
    category: "Future",
  },
];

// Educational content for What is CII
const WHAT_IS_CII_CONTENT = `The Carbon Intensity Indicator (CII) represents a groundbreaking regulatory mechanism introduced by the International Maritime Organization (IMO) to measure and improve the carbon efficiency of ships. As part of the IMO's broader strategy to reduce greenhouse gas emissions from international shipping, the CII framework came into effect on January 1, 2023, making it one of the most significant environmental regulations in maritime history.

The CII is expressed as grams of CO2 emitted per cargo-carrying capacity and nautical mile traveled. For most ship types, this translates to grams of CO2 per deadweight ton-nautical mile (gCO2/dwt-nm), while passenger ships use gross tonnage instead. This metric captures the essential relationship between cargo transported, distance covered, and emissions generated, providing a comprehensive view of a ship's operational efficiency.

What makes CII particularly significant is its universal applicability. All ships of 5,000 gross tonnage and above engaged in international voyages must calculate and report their CII, covering bulk carriers, gas carriers, tankers, container ships, general cargo ships, refrigerated cargo carriers, combination carriers, LNG carriers, and Ro-Ro vessels. This broad scope ensures that the regulation affects a substantial portion of the global fleet.

The rating system assigns a grade from A to E based on how the ship's attained CII compares to the required annual operational CII. A rating of A or B indicates superior or good performance, while C represents moderate performance meeting the minimum requirements. Ratings D and E trigger compliance requirements, including the development of corrective action plans. This graduated approach provides both recognition for good performers and a clear pathway for improvement for underperformers.

The maritime industry is responsible for approximately 3% of global CO2 emissions, and the CII regulation represents a critical step toward decarbonization. By establishing clear performance metrics and consequences for non-compliance, the IMO has created a powerful incentive for ship operators to invest in efficiency improvements. The regulation also supports broader industry efforts to meet climate commitments under the Paris Agreement and positions shipping as a responsible contributor to global climate goals.`;

// Educational content for How CII is calculated
const HOW_CII_CALCULATED_CONTENT = `The CII calculation methodology follows a structured approach that accounts for fuel consumption, transport work, and ship-specific factors. Understanding this calculation is essential for ship operators to identify improvement opportunities and ensure accurate compliance reporting.

The fundamental formula for CII calculation is straightforward: CII = Annual CO2 Emissions / Annual Transport Work. However, the components of this equation require careful consideration. Annual CO2 emissions are calculated by summing the fuel consumption for each fuel type multiplied by the corresponding CO2 conversion factor. For example, Heavy Fuel Oil (HFO) has a conversion factor of 3.114 tonnes CO2 per tonne of fuel, while Marine Gas Oil (MGO) has a factor of 3.206.

Transport work is calculated by multiplying the ship's capacity by the distance traveled. For most ship types, capacity is measured in deadweight tonnage (DWT), while passenger ships use gross tonnage (GT). Distance is measured in nautical miles based on the actual voyage track. This means that both the amount of cargo carried and the efficiency of the route planning directly impact the CII.

The reference line serves as the benchmark against which a ship's performance is measured. Each ship type has a specific reference line formula derived from statistical analysis of the global fleet's performance data. The formula takes the form: Reference = a × Capacity^(-c), where 'a' and 'c' are empirically determined coefficients. For instance, container ships use a = 1984 and c = 0.4894, while bulk carriers use a = 4745 and c = 0.6225.

The final rating determination involves comparing the attained CII to the required CII, which is the reference line adjusted by the applicable reduction factor for the year. The rating thresholds are: A (attained CII ≤ 86% of required), B (≤ 94%), C (≤ 106%), D (≤ 118%), and E (> 118%). This system creates clear performance targets while accounting for the inherent differences between ship types and sizes.

Accurate data collection is critical for CII calculation. Ships must maintain detailed records of fuel consumption by type, voyage distances, and any applicable correction factors. Many operators are now investing in automated data collection systems to improve accuracy and reduce the administrative burden of compliance reporting.`;

// Educational content for IMO Decarbonization Targets
const IMO_TARGETS_CONTENT = `The International Maritime Organization has established ambitious decarbonization targets that represent a fundamental transformation of the maritime industry. These targets are structured around three key timeframes: short-term (2023-2030), medium-term (2030-2040), and long-term (2050 and beyond).

The short-term measures, including the CII regulation, aim to reduce the carbon intensity of international shipping by at least 40% by 2030 compared to 2008 levels. This is supported by the Energy Efficiency Existing Ship Index (EEXI) for new ships and the CII for operational efficiency. The progressive reduction factors built into the CII framework—starting at 5% in 2023 and reaching 20% by 2030—create a clear trajectory for continuous improvement.

Looking further ahead, the IMO's revised greenhouse gas strategy targets a reduction in total GHG emissions from international shipping of at least 20% by 2030 and 70% by 2040, striving for 30% and 80% respectively, compared to 2008 levels. The ultimate goal is to reach net-zero GHG emissions by or around 2050. These targets reflect the urgent need to address shipping's contribution to climate change while recognizing the practical challenges of fleet-wide decarbonization.

The implementation of these targets will require unprecedented investment in new technologies, alternative fuels, and operational practices. Industry analysts estimate that achieving net-zero emissions by 2050 will require cumulative investments of $1.4-1.9 trillion, with approximately 87% needed for land-based infrastructure and fuel production. For individual shipowners, this means making strategic decisions about vessel investment, retrofit versus replacement, and fuel pathway selection.

The regulatory framework continues to evolve, with the IMO working on economic measures such as carbon pricing or fuel standards that could further incentivize decarbonization. Ship operators should stay informed of these developments and prepare for increasingly stringent requirements in the years ahead. Early adopters of low-carbon technologies may gain competitive advantages as regulations tighten and customer expectations evolve.`;

// Educational content for Rating Correction Factors
const CORRECTION_FACTORS_CONTENT = `The IMO CII framework includes several correction factors and adjustment mechanisms designed to ensure fair and accurate assessment of ship performance. These corrections account for specific operational circumstances that may affect a ship's carbon intensity beyond the operator's control.

Ice navigation presents unique challenges, as ships operating in ice-infested waters require additional power and consume more fuel. The ice correction factor varies based on the ice class notation and the actual ice conditions encountered. Ships with Ice Class IA, IA Super, or equivalent notations can apply these corrections to account for the additional energy requirements. Documentation must include evidence of ice conditions and the vessel's ice class certification.

Ships with significant boiler consumption for cargo heating, cooling, or tank cleaning can apply for corrections related to these non-propulsion energy uses. This is particularly relevant for product tankers carrying heated cargoes, chemical tankers requiring temperature control, and LNG carriers managing boil-off gas. The correction requires detailed fuel consumption logs distinguishing between propulsion and other uses.

Shuttle tankers engaged in offshore loading operations face unique operational profiles that differ from conventional trading. The frequent maneuvering, dynamic positioning requirements, and waiting time at offshore terminals affect their energy consumption. A specific correction factor of up to 15% may be applied for these operations with appropriate documentation.

The capacity correction accounts for ships with significant non-cargo deadweight, such as those with substantial ballast water treatment systems or other permanent equipment that reduces effective cargo capacity. Additionally, voyage adjustments may be granted for situations like search and rescue operations, waiting for port congestion, or other events beyond the ship's control. These corrections require thorough documentation and must be submitted through the appropriate flag administration channels.`;

// Educational content for SEEMP and CII Requirements
const SEEMP_CII_CONTENT = `The Ship Energy Efficiency Management Plan (SEEMP) serves as the cornerstone of a ship's energy efficiency strategy, and its Part III specifically addresses CII compliance requirements. Understanding the SEEMP framework is essential for both regulatory compliance and operational improvement.

SEEMP Part III must be developed for each ship of 5,000 GT and above and should include three main components: an implementation plan documenting how the required CII will be achieved, procedures for monitoring and reporting fuel consumption and distance traveled, and a corrective action plan for addressing potential non-compliance. The implementation plan should identify specific measures, responsible personnel, timelines, and expected outcomes.

The monitoring procedures in SEEMP Part III are linked to the IMO Data Collection System (DCS), which requires annual reporting of fuel consumption data. Ship operators must establish robust systems for collecting, verifying, and reporting this data. Modern solutions include fuel flow meters, noon reports, and automated data collection systems that improve accuracy and reduce administrative burden. The reported data forms the basis for CII calculation and must be verified by the flag administration or recognized organization.

For ships that receive a D rating for three consecutive years or an E rating for a single year, the corrective action plan becomes mandatory. This plan must demonstrate specific measures that will be implemented to achieve a C rating or better, including technical measures, operational changes, or a combination of both. The plan must include measurable targets, timelines, and responsible parties. Flag administrations may require periodic updates on the implementation progress.

The SEEMP should be viewed as a living document that evolves with the ship's operations and the regulatory landscape. Regular reviews and updates ensure that the plan remains relevant and effective. Best practices include annual reviews, crew training programs, performance benchmarking against similar vessels, and continuous improvement initiatives. Companies that proactively manage their SEEMP often find opportunities for operational savings beyond regulatory compliance.`;

// Educational content for Investment and Financial Implications
const INVESTMENT_CONTENT = `CII compliance has significant financial implications for shipowners and operators, affecting both operational costs and capital investment decisions. Understanding these financial aspects is crucial for strategic planning and maintaining competitiveness in an evolving regulatory environment.

Operational improvements for CII compliance, such as speed optimization and hull maintenance, often provide positive return on investment through reduced fuel consumption. A 10% speed reduction can yield fuel savings of 25-30%, directly improving both CII rating and operating costs. Hull and propeller maintenance investments typically pay back within 6-18 months through improved efficiency. These measures represent the first line of defense for improving CII performance.

More substantial investments may be required for vessels with poor baseline performance or facing increasingly stringent reduction targets. Engine power limitation (EPL) installations, energy-saving devices, and alternative fuel systems require capital investment but can be essential for maintaining compliance. The payback period for these investments depends on fuel prices, operational profile, and regulatory developments. Financial analysis should consider both direct fuel savings and avoided costs of non-compliance.

Financing considerations are increasingly important as lenders and investors incorporate environmental performance into their criteria. The Poseidon Principles, adopted by major shipping banks, require signatories to incorporate climate considerations into lending decisions. Poor CII ratings may affect access to capital or increase borrowing costs. Conversely, vessels with good environmental performance may benefit from preferential financing terms and enhanced charter attractiveness.

Insurance premiums are also beginning to reflect environmental performance, with some insurers offering favorable terms for well-rated vessels. Additionally, carbon pricing mechanisms under development by the IMO and regional regulators may create direct financial exposure for higher-emitting vessels. Strategic planning should account for these evolving financial pressures when evaluating investment options for CII improvement.`;

// Educational content for Alternative Fuels
const ALTERNATIVE_FUELS_CONTENT = `Alternative fuels represent a pathway to significant CII improvement and are essential for achieving the IMO's long-term decarbonization targets. Understanding the options available and their implications is critical for strategic fleet planning and investment decisions.

Liquefied Natural Gas (LNG) is the most mature alternative fuel option currently available, offering approximately 20-25% reduction in CO2 emissions compared to conventional marine fuels. LNG infrastructure is well-developed in many key shipping routes, and the technology is proven across multiple vessel types. However, methane slip from LNG engines can partially offset climate benefits, and LNG is generally considered a transitional fuel rather than a long-term solution.

Biofuels, including fatty acid methyl esters (FAME) and hydrotreated vegetable oil (HVO), can be used as drop-in replacements or blends with conventional fuels. The carbon reduction potential depends on feedstock and production methods, with some pathways achieving near-carbon-neutral performance. Supply availability and price volatility remain challenges, but biofuels offer an attractive option for immediate emissions reduction without major vessel modifications.

Methanol and ammonia are emerging as promising future fuels with potential for zero-carbon operation when produced from renewable sources. Methanol is easier to handle than LNG and can be stored at ambient temperature, while ammonia offers high energy density by volume but requires careful handling due to toxicity. Both fuels require new vessel designs or major conversions for existing ships.

Hydrogen represents the ultimate clean fuel but faces significant challenges related to storage density and handling requirements. For most existing vessels, hydrogen is not a practical retrofit option, but it may play a role in newbuild designs for specific applications.

The selection of alternative fuel pathway should consider vessel age, trading pattern, infrastructure availability, and total cost of ownership. Many operators are adopting a 'fuel-flexible' approach, designing newbuilds to accommodate multiple fuel options as the market develops.`;

// Improvement strategies data
const IMPROVEMENT_STRATEGIES = [
  {
    title: "Speed Optimization",
    icon: Gauge,
    potential: "15-25%",
    color: BRAND_COLORS.logistics,
    description: "Reducing speed by 10% can lower fuel consumption by ~27% due to the cubic relationship between speed and power. Calculate optimal speed for your routes considering schedule requirements and charter party constraints.",
    timeframe: "Immediate",
    investment: "Low",
    details: [
      "Implement slow steaming policies where commercially viable",
      "Use weather routing to optimize speed during adverse conditions",
      "Coordinate with charterers on speed-consumption trade-offs",
      "Monitor and optimize propeller RPM for efficiency",
    ],
  },
  {
    title: "Hull & Propeller Optimization",
    icon: Target,
    potential: "5-10%",
    color: BRAND_COLORS.ocean,
    description: "Regular hull cleaning and propeller polishing reduce friction. Consider advanced anti-fouling coatings and propeller boss cap fins for additional efficiency gains.",
    timeframe: "Short-term",
    investment: "Medium",
    details: [
      "Schedule regular hull inspections and cleaning",
      "Apply advanced anti-fouling coatings during dry dock",
      "Install propeller boss cap fins or Mewis ducts",
      "Monitor hull performance trend data",
    ],
  },
  {
    title: "Route Optimization",
    icon: Compass,
    potential: "3-8%",
    color: BRAND_COLORS.logisticsLight,
    description: "Use weather routing and ocean current data to find optimal routes. Reduce distance and avoid adverse conditions through sophisticated voyage planning.",
    timeframe: "Immediate",
    investment: "Low",
    details: [
      "Subscribe to professional weather routing services",
      "Utilize ocean current data for route optimization",
      "Avoid adverse weather conditions proactively",
      "Plan just-in-time arrivals to reduce waiting time",
    ],
  },
  {
    title: "Alternative Fuels",
    icon: Fuel,
    potential: "20-100%",
    color: BRAND_COLORS.oceanLight,
    description: "LNG, biofuels, or e-fuels can significantly reduce carbon intensity. Consider fuel switching for ECA zones and explore long-term fuel transition strategies.",
    timeframe: "Long-term",
    investment: "High",
    details: [
      "Evaluate LNG conversion or newbuild options",
      "Test biofuel blends for compatibility",
      "Monitor development of synthetic fuel supply",
      "Consider dual-fuel engines for flexibility",
    ],
  },
  {
    title: "Just-In-Time Arrival",
    icon: Timer,
    potential: "5-15%",
    color: BRAND_COLORS.logistics,
    description: "Coordinate with terminals for optimized arrival times. Reduce waiting time and anchor fuel consumption through better voyage planning and communication.",
    timeframe: "Short-term",
    investment: "Low",
    details: [
      "Establish communication protocols with terminals",
      "Use Virtual Arrival arrangements where available",
      "Optimize berth scheduling coordination",
      "Reduce anchorage time through better planning",
    ],
  },
  {
    title: "Engine Optimization",
    icon: Settings,
    potential: "2-5%",
    color: BRAND_COLORS.ocean,
    description: "Regular engine tuning, turbocharger maintenance, and fuel injection optimization can improve combustion efficiency. Consider engine power limitation for EEXI compliance.",
    timeframe: "Short-term",
    investment: "Medium",
    details: [
      "Schedule regular engine tuning and maintenance",
      "Optimize fuel injection timing",
      "Maintain turbocharger efficiency",
      "Consider engine power limitation (EPL) installation",
    ],
  },
];

interface CIIResult {
  ciiValue: number;
  referenceLine: number;
  rating: string;
  ratingColor: string;
  ratingLabel: string;
  ratio: number;
  annualReduction: number;
  distanceToNextRating: number;
  nextRating: string | null;
  complianceStatus: "compliant" | "at_risk" | "non_compliant";
  annualCO2: number;
  requiredCIIForNextYear: number;
  fuelSavingsPotential: number;
  projectedRatings: { year: number; rating: string; ciiRequired: number }[];
}

export function CIIChecker() {
  const [activeTab, setActiveTab] = useState("calculator");

  // Input parameters
  const [shipType, setShipType] = useState<keyof typeof SHIP_TYPES>("CONTAINER");
  const [capacity, setCapacity] = useState<string>("50000"); // DWT or GT
  const [fuelConsumption, setFuelConsumption] = useState<string>("50"); // tonnes/day
  const [operationalDays, setOperationalDays] = useState<string>("280"); // days/year
  const [distanceTravelled, setDistanceTravelled] = useState<string>("50000"); // nautical miles
  const [currentYear, setCurrentYear] = useState<number>(2024);

  // Calculate CII
  const result = useMemo((): CIIResult => {
    const ship = SHIP_TYPES[shipType];
    const capacityValue = parseFloat(capacity) || 0;
    const fuel = parseFloat(fuelConsumption) || 0;
    const days = parseFloat(operationalDays) || 0;
    const distance = parseFloat(distanceTravelled) || 0;

    // Calculate CO2 emissions (tonnes)
    const co2Emissions = fuel * days * 3.114;

    // Calculate transport work (million tonne-miles or GT-miles)
    const transportWork = (capacityValue * distance) / 1000000;

    // Calculate CII (gCO2/dwt-nmile or gCO2/GT-nmile)
    const ciiValue = transportWork > 0 ? (co2Emissions / transportWork) : 0;

    // Calculate reference line
    const referenceLine = ship.a * Math.pow(capacityValue, -ship.c);

    // Get reduction target for current year
    const target = REDUCTION_TARGETS.find(t => t.year === currentYear) || REDUCTION_TARGETS[6];
    const annualReduction = target.reduction;

    // Apply reduction to reference line
    const adjustedReference = referenceLine * (1 - annualReduction / 100);

    // Calculate ratio
    const ratio = ciiValue / adjustedReference;

    // Determine rating
    let rating = "E";
    let ratingColor = CII_RATINGS.E.color;
    let ratingLabel = CII_RATINGS.E.label;
    let nextRating: string | null = null;

    if (ratio <= CII_RATINGS.A.maxRatio) {
      rating = "A";
      ratingColor = CII_RATINGS.A.color;
      ratingLabel = CII_RATINGS.A.label;
    } else if (ratio <= CII_RATINGS.B.maxRatio) {
      rating = "B";
      ratingColor = CII_RATINGS.B.color;
      ratingLabel = CII_RATINGS.B.label;
      nextRating = "A";
    } else if (ratio <= CII_RATINGS.C.maxRatio) {
      rating = "C";
      ratingColor = CII_RATINGS.C.color;
      ratingLabel = CII_RATINGS.C.label;
      nextRating = "B";
    } else if (ratio <= CII_RATINGS.D.maxRatio) {
      rating = "D";
      ratingColor = CII_RATINGS.D.color;
      ratingLabel = CII_RATINGS.D.label;
      nextRating = "C";
    } else {
      nextRating = "D";
    }

    // Calculate distance to next rating
    let distanceToNextRating = 0;
    if (nextRating) {
      const nextThreshold = CII_RATINGS[nextRating as keyof typeof CII_RATINGS].maxRatio;
      distanceToNextRating = ((ratio - nextThreshold) / nextThreshold) * 100;
    }

    // Compliance status
    let complianceStatus: "compliant" | "at_risk" | "non_compliant" = "compliant";
    if (rating === "D") complianceStatus = "at_risk";
    if (rating === "E") complianceStatus = "non_compliant";

    // Calculate required CII for next year
    const nextYearTarget = REDUCTION_TARGETS.find(t => t.year === currentYear + 1);
    const nextYearReduction = nextYearTarget?.reduction || annualReduction + 2;
    const requiredCIIForNextYear = referenceLine * (1 - nextYearReduction / 100);

    // Calculate fuel savings potential
    const fuelSavingsPotential = ciiValue > requiredCIIForNextYear 
      ? ((ciiValue - requiredCIIForNextYear) / ciiValue) * 100 
      : 0;

    // Project ratings for future years
    const projectedRatings = REDUCTION_TARGETS.filter(t => t.year >= currentYear).map(t => {
      const reqCII = referenceLine * (1 - t.reduction / 100);
      const projectedRatio = ciiValue / reqCII;
      let projRating = "E";
      if (projectedRatio <= CII_RATINGS.A.maxRatio) projRating = "A";
      else if (projectedRatio <= CII_RATINGS.B.maxRatio) projRating = "B";
      else if (projectedRatio <= CII_RATINGS.C.maxRatio) projRating = "C";
      else if (projectedRatio <= CII_RATINGS.D.maxRatio) projRating = "D";
      return { year: t.year, rating: projRating, ciiRequired: reqCII };
    });

    return {
      ciiValue,
      referenceLine: adjustedReference,
      rating,
      ratingColor,
      ratingLabel,
      ratio,
      annualReduction,
      distanceToNextRating,
      nextRating,
      complianceStatus,
      annualCO2: co2Emissions,
      requiredCIIForNextYear,
      fuelSavingsPotential,
      projectedRatings,
    };
  }, [shipType, capacity, fuelConsumption, operationalDays, distanceTravelled, currentYear]);

  // Historical trend data
  const trendData = useMemo(() => {
    const ship = SHIP_TYPES[shipType];
    const capacityValue = parseFloat(capacity) || 0;
    const baseReference = ship.a * Math.pow(capacityValue, -ship.c);

    return REDUCTION_TARGETS.map(t => ({
      year: t.year,
      referenceLine: parseFloat((baseReference * (1 - t.reduction / 100)).toFixed(2)),
      reduction: t.reduction,
      milestone: t.milestone,
    }));
  }, [shipType, capacity]);

  // Rating scale visualization data
  const ratingScaleData = [
    { rating: "A", max: CII_RATINGS.A.maxRatio * 100, color: CII_RATINGS.A.color, label: "Superior", description: "Exceptional environmental performance" },
    { rating: "B", max: CII_RATINGS.B.maxRatio * 100, color: CII_RATINGS.B.color, label: "Good", description: "Strong performance below requirements" },
    { rating: "C", max: CII_RATINGS.C.maxRatio * 100, color: CII_RATINGS.C.color, label: "Moderate", description: "Meeting minimum requirements" },
    { rating: "D", max: CII_RATINGS.D.maxRatio * 100, color: CII_RATINGS.D.color, label: "Lower", description: "Below requirements, action needed" },
    { rating: "E", max: 130, color: CII_RATINGS.E.color, label: "Inferior", description: "Significantly below requirements" },
  ];

  // Radial bar data for rating gauge
  const radialData = [
    {
      name: "Performance",
      value: Math.min(result.ratio * 100, 130),
      fill: result.ratingColor,
    },
  ];

  // Fleet comparison data
  const fleetComparisonData = useMemo(() => {
    const currentCII = result.ciiValue;
    const capacityValue = parseFloat(capacity) || 50000;
    
    return Object.entries(SHIP_TYPES).map(([key, ship]) => {
      const reference = ship.a * Math.pow(capacityValue, -ship.c);
      const adjustedReference = reference * (1 - result.annualReduction / 100);
      return {
        name: ship.name.split(" ")[0],
        reference: parseFloat(adjustedReference.toFixed(2)),
        current: key === shipType ? currentCII : null,
        isCurrentShip: key === shipType,
      };
    });
  }, [shipType, capacity, result]);

  // CO2 breakdown by source
  const co2BreakdownData = useMemo(() => {
    const fuel = parseFloat(fuelConsumption) || 0;
    const days = parseFloat(operationalDays) || 0;
    const hfoConsumption = fuel * days * 0.7; // Assume 70% HFO
    const mgoConsumption = fuel * days * 0.3; // Assume 30% MGO
    
    return [
      { name: "Heavy Fuel Oil", value: hfoConsumption * 3.114, color: BRAND_COLORS.ocean },
      { name: "Marine Gas Oil", value: mgoConsumption * 3.206, color: BRAND_COLORS.logistics },
    ];
  }, [fuelConsumption, operationalDays]);

  // Ship type reference table data
  const shipTypeReferenceData = Object.entries(SHIP_TYPES).map(([key, data]) => {
    const capacityValue = parseFloat(capacity) || 50000;
    const refLine = data.a * Math.pow(capacityValue, -data.c);
    return {
      type: data.name,
      a: data.a,
      c: data.c,
      refLine: refLine.toFixed(2),
      capacityRange: data.dwtMin ? `${data.dwtMin.toLocaleString()} - ${data.dwtMax.toLocaleString()} DWT` : `${data.gtMin?.toLocaleString()} - ${data.gtMax?.toLocaleString()} GT`,
    };
  });

  // Key metrics for hero section
  const keyMetrics = [
    {
      label: "CII Rating",
      value: result.rating,
      subValue: result.ratingLabel,
      icon: Award,
      color: result.ratingColor,
      trend: result.rating === "A" || result.rating === "B" ? "up" : result.rating === "C" ? "neutral" : "down",
    },
    {
      label: "Annual CO2",
      value: `${(result.annualCO2 / 1000).toFixed(1)}kt`,
      subValue: `${(result.annualCO2 * 3.67 / 1000).toFixed(1)}k trees to offset`,
      icon: Leaf,
      color: BRAND_COLORS.logistics,
      trend: "neutral",
    },
    {
      label: "Compliance",
      value: result.complianceStatus === "compliant" ? "Compliant" : result.complianceStatus === "at_risk" ? "At Risk" : "Non-Compliant",
      subValue: `${result.annualReduction}% reduction target (${currentYear})`,
      icon: result.complianceStatus === "compliant" ? CheckCircle2 : AlertTriangle,
      color: result.complianceStatus === "compliant" ? BRAND_COLORS.logistics : result.complianceStatus === "at_risk" ? "#F59E0B" : "#EF4444",
      trend: result.complianceStatus === "compliant" ? "up" : "down",
    },
    {
      label: "CII Value",
      value: result.ciiValue.toFixed(1),
      subValue: `vs ${result.referenceLine.toFixed(1)} required`,
      icon: Gauge,
      color: BRAND_COLORS.ocean,
      trend: result.ciiValue <= result.referenceLine ? "up" : "down",
    },
  ];

  // Future projection data
  const futureProjectionData = useMemo(() => {
    return result.projectedRatings.slice(0, 7).map(p => ({
      year: p.year,
      required: parseFloat(p.ciiRequired.toFixed(1)),
      current: parseFloat(result.ciiValue.toFixed(1)),
      status: p.rating,
    }));
  }, [result]);

  const handleReset = () => {
    setShipType("CONTAINER");
    setCapacity("50000");
    setFuelConsumption("50");
    setOperationalDays("280");
    setDistanceTravelled("50000");
    setCurrentYear(2024);
  };

  const handleExport = () => {
    const reportData = {
      shipType: SHIP_TYPES[shipType].name,
      capacity,
      fuelConsumption,
      operationalDays,
      distanceTravelled,
      assessmentYear: currentYear,
      result: {
        ciiValue: result.ciiValue.toFixed(2),
        rating: result.rating,
        ratingLabel: result.ratingLabel,
        complianceStatus: result.complianceStatus,
        annualCO2: result.annualCO2.toFixed(2),
        referenceLine: result.referenceLine.toFixed(2),
        ratio: (result.ratio * 100).toFixed(1) + "%",
        projectedRatings: result.projectedRatings,
      },
      generatedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CII_Report_${SHIP_TYPES[shipType].name.replace(/\s+/g, "_")}_${currentYear}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    const shareText = `🚢 CII Assessment Results:\n\n` +
      `• Ship Type: ${SHIP_TYPES[shipType].name}\n` +
      `• Capacity: ${parseFloat(capacity).toLocaleString()} ${shipType === "RO_PAX" ? "GT" : "DWT"}\n` +
      `• CII Rating: ${result.rating} (${result.ratingLabel})\n` +
      `• CII Value: ${result.ciiValue.toFixed(2)} gCO2/dwt-nm\n` +
      `• Annual CO2: ${(result.annualCO2 / 1000).toFixed(1)} kt\n` +
      `• Status: ${result.complianceStatus === "compliant" ? "✅ IMO Compliant" : result.complianceStatus === "at_risk" ? "⚠️ At Risk" : "❌ Non-Compliant"}\n\n` +
      `Calculated using Shiportrade.com CII Checker`;

    if (navigator.share) {
      navigator.share({
        title: "CII Assessment Report",
        text: shareText,
      });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/95 to-[#2E8B57] p-8 md:p-10 text-white shadow-xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#2E8B57]/30 rounded-full blur-2xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <div className="absolute inset-0 bg-[url('/wave-pattern.svg')] opacity-5" />
          
          {/* Floating Ship Icon */}
          <motion.div
            className="absolute top-1/2 right-8 transform -translate-y-1/2 hidden lg:block"
            animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Ship className="h-40 w-40 text-white/10" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-[#2E8B57] hover:bg-[#2E8B57]/90 text-white px-4 py-1.5 text-sm font-medium border border-white/20">
                <Activity className="h-4 w-4 mr-2 animate-pulse" />
                IMO Compliance Tool
              </Badge>
              <Badge variant="outline" className="border-white/30 text-white/90 px-3 py-1">
                <Globe className="h-3.5 w-3.5 mr-1.5" />
                International Maritime Organization
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 tracking-tight">
              Carbon Intensity Indicator
              <span className="block text-[#2E8B57] mt-1">CII Checker</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl leading-relaxed">
              Calculate and assess your vessel&apos;s CII rating in compliance with IMO MEPC regulations.
              Track carbon intensity performance against international standards and plan your decarbonization strategy.
            </p>
          </motion.div>

          {/* Key Metrics Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {keyMetrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                variants={itemVariants}
                className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${metric.trend === "up" ? "bg-green-500/20" : metric.trend === "down" ? "bg-red-500/20" : "bg-white/10"}`}>
                    <metric.icon className="h-5 w-5" style={{ color: metric.color === BRAND_COLORS.ocean || metric.color === BRAND_COLORS.logistics ? "white" : metric.color }} />
                  </div>
                  {metric.trend === "up" && <TrendingUp className="h-4 w-4 text-green-400" />}
                  {metric.trend === "down" && <TrendingDown className="h-4 w-4 text-red-400" />}
                </div>
                <p className="text-white/60 text-sm font-medium">{metric.label}</p>
                <p className="text-2xl md:text-3xl font-bold mt-1" style={{ color: metric.color === BRAND_COLORS.ocean || metric.color === BRAND_COLORS.logistics ? "white" : metric.color }}>
                  {metric.value}
                </p>
                <p className="text-white/50 text-xs mt-1.5">{metric.subValue}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Info Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-wrap items-center gap-4 text-sm text-white/70"
          >
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Assessment Year: <strong className="text-white">{currentYear}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Ship className="h-4 w-4" />
              <span>Ship Type: <strong className="text-white">{SHIP_TYPES[shipType].name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4" />
              <span>Reduction Target: <strong className="text-white">{result.annualReduction}%</strong></span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-auto p-1 bg-muted/50">
          <TabsTrigger value="calculator" className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calculator className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="ratings" className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Gauge className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Rating Scale</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4" />
            <span className="text-xs sm:text-sm">IMO Timeline</span>
          </TabsTrigger>
          <TabsTrigger value="improvement" className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <TrendingDown className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Strategies</span>
          </TabsTrigger>
          <TabsTrigger value="faq" className="flex flex-col sm:flex-row items-center gap-1.5 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <HelpCircle className="h-4 w-4" />
            <span className="text-xs sm:text-sm">FAQ</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Tab 1: Calculator */}
            <TabsContent value="calculator" className="space-y-6 mt-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Input Card */}
                <Card className="border-2 hover:border-[var(--ocean)]/30 transition-colors">
                  <CardHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                        <Ship className="h-5 w-5 text-[var(--ocean)]" />
                      </div>
                      CII Calculator
                    </CardTitle>
                    <CardDescription>Enter vessel parameters to calculate Carbon Intensity Indicator</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 pt-6">
                    <div>
                      <Label className="text-sm font-medium mb-2 block">Ship Type</Label>
                      <Select value={shipType} onValueChange={(v) => setShipType(v as keyof typeof SHIP_TYPES)}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(SHIP_TYPES).map(([key, data]) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <data.icon className="h-4 w-4 text-muted-foreground" />
                                {data.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1.5">{SHIP_TYPES[shipType].description}</p>
                    </div>

                    <div>
                      <Label htmlFor="capacity" className="text-sm font-medium mb-2 block">
                        {shipType === "RO_PAX" ? "Gross Tonnage (GT)" : "Deadweight Tonnage (DWT)"}
                      </Label>
                      <Input
                        id="capacity"
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                        className="h-11"
                        placeholder="Enter capacity"
                      />
                      <p className="text-xs text-muted-foreground mt-1.5">
                        Range: {SHIP_TYPES[shipType].dwtMin?.toLocaleString() || SHIP_TYPES[shipType].gtMin?.toLocaleString()} - {SHIP_TYPES[shipType].dwtMax?.toLocaleString() || SHIP_TYPES[shipType].gtMax?.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="fuelConsumption" className="text-sm font-medium mb-2 block">Fuel Consumption (tonnes/day)</Label>
                      <Input
                        id="fuelConsumption"
                        type="number"
                        step="0.1"
                        value={fuelConsumption}
                        onChange={(e) => setFuelConsumption(e.target.value)}
                        className="h-11"
                        placeholder="Enter daily fuel consumption"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="operationalDays" className="text-sm font-medium mb-2 block">Operational Days/Year</Label>
                        <Input
                          id="operationalDays"
                          type="number"
                          value={operationalDays}
                          onChange={(e) => setOperationalDays(e.target.value)}
                          className="h-11"
                          placeholder="Days"
                        />
                      </div>
                      <div>
                        <Label htmlFor="distanceTravelled" className="text-sm font-medium mb-2 block">Distance (NM)</Label>
                        <Input
                          id="distanceTravelled"
                          type="number"
                          value={distanceTravelled}
                          onChange={(e) => setDistanceTravelled(e.target.value)}
                          className="h-11"
                          placeholder="Nautical miles"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium mb-2 block">Assessment Year</Label>
                      <Select value={currentYear.toString()} onValueChange={(v) => setCurrentYear(parseInt(v))}>
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {REDUCTION_TARGETS.map(t => (
                            <SelectItem key={t.year} value={t.year.toString()}>
                              <div className="flex items-center justify-between gap-4">
                                <span>{t.year}</span>
                                <span className="text-muted-foreground text-xs">{t.reduction}% reduction</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Results Card */}
                <Card className="border-2 border-[var(--logistics)]/20">
                  <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-transparent">
                    <CardTitle className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                        <Gauge className="h-5 w-5 text-[var(--logistics)]" />
                      </div>
                      CII Rating Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {/* Rating Display */}
                      <div className="text-center p-8 rounded-xl bg-gradient-to-br from-muted/50 to-muted/30 border">
                        <motion.div
                          key={result.rating}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", stiffness: 200 }}
                        >
                          <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wide">Current Rating</p>
                          <div className="text-8xl font-bold tracking-tight" style={{ color: result.ratingColor }}>
                            {result.rating}
                          </div>
                          <Badge className="mt-3 text-sm px-4 py-1" style={{ backgroundColor: `${result.ratingColor}20`, color: result.ratingColor, border: `1px solid ${result.ratingColor}40` }}>
                            {result.ratingLabel}
                          </Badge>
                        </motion.div>
                      </div>

                      {/* CII Value Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-muted/30 rounded-xl border">
                          <p className="text-sm text-muted-foreground mb-1">CII Value</p>
                          <p className="text-3xl font-bold text-[var(--ocean)]">{result.ciiValue.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-1">gCO2/dwt-nmile</p>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl border">
                          <p className="text-sm text-muted-foreground mb-1">Required CII</p>
                          <p className="text-3xl font-bold">{result.referenceLine.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground mt-1">({result.annualReduction}% reduction)</p>
                        </div>
                      </div>

                      {/* Performance Ratio */}
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-medium">Performance Ratio</span>
                          <span className="text-lg font-bold">{(result.ratio * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.min((1 - result.ratio + 1) * 50, 100)} className="h-3" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-2">
                          <span>Superior (A)</span>
                          <span>Reference Line</span>
                          <span>Inferior (E)</span>
                        </div>
                      </div>

                      {/* Compliance Status */}
                      <motion.div
                        key={result.complianceStatus}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-4 rounded-xl border ${
                          result.complianceStatus === "compliant" 
                            ? "bg-[var(--logistics)]/10 border-[var(--logistics)]/30" 
                            : result.complianceStatus === "at_risk" 
                              ? "bg-yellow-500/10 border-yellow-500/30" 
                              : "bg-red-500/10 border-red-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {result.complianceStatus === "compliant" ? (
                            <CheckCircle2 className="h-6 w-6 text-[var(--logistics)]" />
                          ) : result.complianceStatus === "at_risk" ? (
                            <AlertTriangle className="h-6 w-6 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-6 w-6 text-red-500" />
                          )}
                          <div>
                            <p className="font-semibold">
                              {result.complianceStatus === "compliant" ? "IMO Compliant" :
                               result.complianceStatus === "at_risk" ? "At Risk - Action Required" :
                               "Non-Compliant - Immediate Action"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {result.complianceStatus === "compliant" 
                                ? "Vessel meets current IMO requirements" 
                                : result.complianceStatus === "at_risk"
                                  ? "Corrective action plan required after 3 consecutive years"
                                  : "Submit corrective action plan to flag administration"}
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      {/* Next Year Projection */}
                      <div className="p-4 bg-muted/30 rounded-xl border">
                        <div className="flex items-center gap-2 mb-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm font-medium">{currentYear + 1} Projection</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Required CII:</span>
                          <span className="font-bold">{result.requiredCIIForNextYear.toFixed(2)}</span>
                        </div>
                        {result.fuelSavingsPotential > 0 && (
                          <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                            ⚠️ {result.fuelSavingsPotential.toFixed(1)}% reduction needed to maintain rating
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Educational Content: What is CII */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    Understanding CII (Carbon Intensity Indicator)
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {WHAT_IS_CII_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed text-sm md:text-base">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* CO2 Emissions Breakdown */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                      <PieChartIcon className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    Annual CO2 Emissions Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={co2BreakdownData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {co2BreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            formatter={(value: number) => [`${value.toFixed(0)} tonnes CO2`, "Emissions"]}
                          />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <p className="text-sm text-muted-foreground">Total Annual CO2</p>
                        <p className="text-3xl font-bold text-[var(--ocean)]">{(result.annualCO2 / 1000).toFixed(2)} kt</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <p className="text-sm text-muted-foreground">Equivalent Trees for Offset</p>
                        <p className="text-2xl font-bold text-[var(--logistics)]">{(result.annualCO2 * 3.67).toLocaleString()}</p>
                        <p className="text-xs text-muted-foreground mt-1">Based on 1 tree absorbing ~21 kg CO2/year</p>
                      </div>
                      <div className="p-4 bg-muted/30 rounded-xl">
                        <p className="text-sm text-muted-foreground">Emissions per Nautical Mile</p>
                        <p className="text-2xl font-bold">{(result.annualCO2 / parseFloat(distanceTravelled || "1")).toFixed(2)} kg</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 2: Rating Scale */}
            <TabsContent value="ratings" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <Gauge className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    CII Rating Scale
                  </CardTitle>
                  <CardDescription>Understanding the IMO CII rating thresholds from A (Superior) to E (Inferior)</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Rating Visualization */}
                    <div className="space-y-4">
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ratingScaleData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                            <XAxis type="number" domain={[0, 130]} tickFormatter={(v) => `${v}%`} />
                            <YAxis dataKey="rating" type="category" width={50} tick={{ fontSize: 16, fontWeight: "bold" }} />
                            <Tooltip
                              formatter={(value: number) => [`≤${value}% of reference`, "Threshold"]}
                              contentStyle={{ borderRadius: "8px" }}
                            />
                            <Bar dataKey="max" radius={[0, 8, 8, 0]}>
                              {ratingScaleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Bar>
                            <ReferenceLine x={result.ratio * 100} stroke="#000" strokeDasharray="5 5" strokeWidth={2} label={{ value: "Your Ship", position: "top" }} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Rating Cards */}
                    <div className="space-y-3">
                      {ratingScaleData.map((item) => (
                        <motion.div
                          key={item.rating}
                          whileHover={{ scale: 1.02 }}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            result.rating === item.rating 
                              ? "border-current shadow-lg" 
                              : "border-transparent hover:border-muted"
                          }`}
                          style={{ 
                            backgroundColor: `${item.color}10`,
                            borderColor: result.rating === item.rating ? item.color : undefined,
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold" style={{ color: item.color }}>{item.rating}</div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{item.label}</p>
                                {result.rating === item.rating && (
                                  <Badge style={{ backgroundColor: item.color, color: "white" }}>Current</Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                              <p className="text-xs mt-1 text-muted-foreground">Threshold: ≤{item.max}% of reference line</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Educational Content: How CII is calculated */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <Calculator className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    How CII is Calculated
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {HOW_CII_CALCULATED_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Rating Correction Factors */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <FileText className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    Rating Correction Factors
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {CORRECTION_FACTORS_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 3: IMO Timeline */}
            <TabsContent value="timeline" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <Calendar className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    IMO CII Reduction Targets (2019-2030)
                  </CardTitle>
                  <CardDescription>Reference line reduction trajectory and compliance milestones</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-80 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="year" />
                        <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => v.toFixed(1)} />
                        <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                          formatter={(value: number, name: string) => [
                            name === "referenceLine" ? value.toFixed(2) : `${value}%`,
                            name === "referenceLine" ? "Reference Line" : "Reduction"
                          ]}
                          contentStyle={{ borderRadius: "8px" }}
                        />
                        <Legend />
                        <Area
                          yAxisId="left"
                          type="monotone"
                          dataKey="referenceLine"
                          stroke={BRAND_COLORS.ocean}
                          fill={BRAND_COLORS.ocean}
                          fillOpacity={0.2}
                          name="referenceLine"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="reduction"
                          stroke={BRAND_COLORS.logistics}
                          strokeWidth={3}
                          name="reduction"
                          dot={{ fill: BRAND_COLORS.logistics, strokeWidth: 2 }}
                        />
                        <ReferenceLine x={currentYear} stroke={BRAND_COLORS.oceanLight} strokeDasharray="5 5" strokeWidth={2} label={{ value: "Current", position: "top" }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto rounded-xl border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="text-left py-3 px-4 font-semibold">Year</th>
                          <th className="text-right py-3 px-4 font-semibold">Reduction</th>
                          <th className="text-right py-3 px-4 font-semibold">Reference Line</th>
                          <th className="text-left py-3 px-4 font-semibold">Milestone</th>
                          <th className="text-left py-3 px-4 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trendData.map((row) => (
                          <tr key={row.year} className={`border-b hover:bg-muted/30 transition-colors ${row.year === currentYear ? "bg-[var(--ocean)]/5" : ""}`}>
                            <td className="py-3 px-4 font-medium">{row.year}</td>
                            <td className="text-right py-3 px-4">
                              <span className="font-bold text-[var(--logistics)]">{row.reduction}%</span>
                            </td>
                            <td className="text-right py-3 px-4 font-mono">{row.referenceLine.toFixed(2)}</td>
                            <td className="py-3 px-4 text-muted-foreground">{row.milestone}</td>
                            <td className="py-3 px-4">
                              {row.year === currentYear && <Badge className="bg-[var(--ocean)]">Current</Badge>}
                              {row.year < currentYear && <Badge variant="outline">Historical</Badge>}
                              {row.year > currentYear && <Badge variant="secondary">Future</Badge>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Future Projections */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                      <LineChart className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    Your Vessel&apos;s Future Rating Projections
                  </CardTitle>
                  <CardDescription>Projected CII ratings if current performance is maintained</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={futureProjectionData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip
                          contentStyle={{ borderRadius: "8px" }}
                          formatter={(value: number, name: string) => [
                            value.toFixed(2),
                            name === "required" ? "Required CII" : "Current CII"
                          ]}
                        />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="required"
                          stroke={BRAND_COLORS.ocean}
                          fill={BRAND_COLORS.ocean}
                          fillOpacity={0.3}
                          name="required"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="current"
                          stroke={BRAND_COLORS.logistics}
                          strokeWidth={2}
                          name="current"
                          dot={{ fill: BRAND_COLORS.logistics, strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
                    {futureProjectionData.slice(0, 4).map((proj) => (
                      <div 
                        key={proj.year} 
                        className={`p-3 rounded-xl border text-center ${
                          proj.year === currentYear ? "bg-[var(--ocean)]/10 border-[var(--ocean)]/30" : "bg-muted/30"
                        }`}
                      >
                        <p className="text-sm text-muted-foreground">{proj.year}</p>
                        <p className="text-2xl font-bold" style={{ 
                          color: CII_RATINGS[proj.status as keyof typeof CII_RATINGS]?.color 
                        }}>
                          {proj.status}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* IMO Decarbonization Targets */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <Globe className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    IMO Decarbonization Targets
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {IMO_TARGETS_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fleet Comparison Chart */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <BarChart3 className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    Ship Type Reference Comparison
                  </CardTitle>
                  <CardDescription>Compare reference lines across ship types at the same capacity</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={fleetComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                        <YAxis />
                        <Tooltip contentStyle={{ borderRadius: "8px" }} />
                        <Legend />
                        <Bar dataKey="reference" name="Reference Line" radius={[4, 4, 0, 0]}>
                          {fleetComparisonData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.isCurrentShip ? BRAND_COLORS.logistics : BRAND_COLORS.ocean} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab 4: Improvement Strategies */}
            <TabsContent value="improvement" className="space-y-6 mt-6">
              {/* Overview Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-0">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Current CII</p>
                    <p className="text-3xl font-bold text-[var(--ocean)]">{improvementScenarios.currentCII}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-0">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">{currentYear + 1} Required</p>
                    <p className="text-3xl font-bold">{improvementScenarios.nextYearReference}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-[var(--logistics)]/10 to-transparent border border-[var(--logistics)]/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Required Reduction</p>
                    <p className="text-3xl font-bold text-[var(--logistics)]">{improvementScenarios.requiredReduction}%</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-0">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">Potential Savings</p>
                    <p className="text-3xl font-bold text-[var(--ocean)]">{improvementScenarios.fuelSavings}t</p>
                    <p className="text-xs text-muted-foreground">fuel/year</p>
                  </CardContent>
                </Card>
              </div>

              {/* Improvement Strategies Grid */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                      <TrendingDown className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    Improvement Strategies
                  </CardTitle>
                  <CardDescription>Strategies to improve CII rating and achieve compliance</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {IMPROVEMENT_STRATEGIES.map((strategy, index) => (
                      <motion.div
                        key={strategy.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="p-5 rounded-xl border-2 hover:border-current/30 transition-all bg-gradient-to-br from-background to-muted/20"
                        style={{ borderColor: `${strategy.color}20` }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: `${strategy.color}15` }}>
                            <strategy.icon className="h-5 w-5" style={{ color: strategy.color }} />
                          </div>
                          <Badge variant="outline" style={{ color: strategy.color, borderColor: strategy.color }}>
                            {strategy.potential}
                          </Badge>
                        </div>
                        <h4 className="font-semibold mb-2">{strategy.title}</h4>
                        <p className="text-sm text-muted-foreground mb-3">{strategy.description}</p>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">{strategy.timeframe}</Badge>
                          <Badge variant="outline" className="text-xs">{strategy.investment} Investment</Badge>
                        </div>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {strategy.details.slice(0, 2).map((detail, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <ChevronRight className="h-3 w-3 mt-0.5 shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* SEEMP and CII Requirements */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <FileText className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    SEEMP and CII Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {SEEMP_CII_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment and Financial Implications */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--logistics)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--logistics)]/10">
                      <Building2 className="h-5 w-5 text-[var(--logistics)]" />
                    </div>
                    Investment and Financial Implications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {INVESTMENT_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alternative Fuels */}
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <Fuel className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    Alternative Fuels for CII Improvement
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {ALTERNATIVE_FUELS_CONTENT.split('\n\n').map((paragraph, index) => (
                      <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Corrective Action Warning */}
              {(result.rating === "D" || result.rating === "E") && (
                <Card className="border-2 border-yellow-500/50 bg-yellow-500/5">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Corrective Action Plan Required</h4>
                        <p className="text-sm text-muted-foreground">
                          Ships rated D for three consecutive years or E for one year must submit a corrective action plan 
                          to their flag administration. The plan must demonstrate specific measures to achieve a C rating 
                          or better, including timelines, responsible parties, and expected outcomes.
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          <FileCheck className="h-4 w-4 mr-2" />
                          Generate CAP Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Tab 5: FAQ */}
            <TabsContent value="faq" className="space-y-6 mt-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
                      <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
                    </div>
                    Frequently Asked Questions
                  </CardTitle>
                  <CardDescription>Comprehensive answers to common CII questions</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {FAQ_DATA.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-4">
                        <AccordionTrigger className="text-left hover:no-underline py-4">
                          <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-[var(--ocean)] shrink-0 mt-0.5" />
                            <div>
                              <span className="font-medium">{faq.question}</span>
                              <Badge variant="outline" className="ml-2 text-xs">{faq.category}</Badge>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground leading-relaxed pl-8 pb-2">
                            {faq.answer}
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>

      {/* Ship Type Reference Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-transparent border-b">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--ocean)]/10">
              <Anchor className="h-5 w-5 text-[var(--ocean)]" />
            </div>
            Ship Type Reference Table
          </CardTitle>
          <CardDescription>Reference line coefficients and capacity ranges by ship type</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left py-3 px-4 font-semibold">Ship Type</th>
                  <th className="text-right py-3 px-4 font-semibold">Coefficient a</th>
                  <th className="text-right py-3 px-4 font-semibold">Coefficient c</th>
                  <th className="text-right py-3 px-4 font-semibold">Reference Line*</th>
                  <th className="text-left py-3 px-4 font-semibold">Capacity Range</th>
                </tr>
              </thead>
              <tbody>
                {shipTypeReferenceData.map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b hover:bg-muted/30 transition-colors ${
                      SHIP_TYPES[Object.keys(SHIP_TYPES)[index] as keyof typeof SHIP_TYPES]?.name === SHIP_TYPES[shipType].name 
                        ? "bg-[var(--ocean)]/5" 
                        : ""
                    }`}
                  >
                    <td className="py-3 px-4 font-medium">{row.type}</td>
                    <td className="text-right py-3 px-4">{row.a.toLocaleString()}</td>
                    <td className="text-right py-3 px-4">{row.c.toFixed(4)}</td>
                    <td className="text-right py-3 px-4 font-mono">{row.refLine}</td>
                    <td className="py-3 px-4 text-muted-foreground">{row.capacityRange}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            *Reference line calculated at {parseFloat(capacity).toLocaleString()} {shipType === "RO_PAX" ? "GT" : "DWT"} capacity
          </p>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button size="sm" className="bg-[var(--logistics)] hover:bg-[var(--logistics)]/90" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>
    </div>
  );
}

// Helper constant for improvement scenarios
const improvementScenarios = {
  currentCII: "0.00",
  nextYearReference: "0.00",
  requiredReduction: "0.0",
  fuelSavings: "0",
};
