"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileCode,
  Shield,
  Zap,
  Clock,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Code,
  Settings,
  AlertTriangle,
  ArrowRight,
  Plus,
  Trash2,
  RefreshCw,
  Info,
  BookOpen,
  HelpCircle,
  Share2,
  BarChart3,
  Lightbulb,
  Layers,
  Database,
  Globe,
  Lock,
  FileText,
  Wallet,
  Scale,
  Target,
  Link,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

interface ContractCondition {
  id: string;
  type: "delivery" | "quality" | "time" | "payment" | "custom";
  description: string;
  parameter: string;
  operator: string;
  value: string;
  action: string;
}

interface ContractConfig {
  name: string;
  type: "escrow" | "delivery" | "quality" | "time" | "custom";
  platform: "ethereum" | "hyperledger" | "polygon";
  parties: {
    buyer: string;
    seller: string;
    arbitrator?: string;
  };
  amount: string;
  currency: string;
  conditions: ContractCondition[];
  autoExecute: boolean;
  disputeResolution: "arbitration" | "voting" | "escrow";
  expiryDays: number;
}

const contractTemplates = [
  {
    id: "escrow",
    name: "Trade Escrow Contract",
    description: "Secure payment holding until delivery confirmation with automatic release upon verified conditions",
    icon: Shield,
    color: "#0F4C81",
    useCase: "International trade transactions requiring secure payment protection",
    defaultConditions: [
      { type: "delivery", description: "Delivery confirmed by buyer", parameter: "deliveryStatus", operator: "==", value: "confirmed", action: "releasePayment" },
    ],
    features: ["Multi-signature release", "Time-locked expiry", "Dispute arbitration"],
  },
  {
    id: "delivery",
    name: "Delivery Verification Contract",
    description: "Automatic verification upon GPS/IoT confirmation with real-time tracking integration",
    icon: CheckCircle2,
    color: "#2E8B57",
    useCase: "Supply chain verification with IoT sensor integration",
    defaultConditions: [
      { type: "delivery", description: "GPS location within delivery zone", parameter: "gpsLocation", operator: "inZone", value: "destination", action: "confirmDelivery" },
    ],
    features: ["GPS verification", "IoT sensor integration", "Real-time updates"],
  },
  {
    id: "quality",
    name: "Quality Assurance Contract",
    description: "Release payment only after quality checks pass with third-party verification",
    icon: Zap,
    color: "#F59E0B",
    useCase: "Commodity trading with quality-dependent payments",
    defaultConditions: [
      { type: "quality", description: "Quality grade meets threshold", parameter: "qualityGrade", operator: ">=", value: "A", action: "approveQuality" },
    ],
    features: ["Third-party inspection", "Quality thresholds", "Conditional payments"],
  },
  {
    id: "time",
    name: "Time-Based Release Contract",
    description: "Automatic actions based on time triggers with grace period provisions",
    icon: Clock,
    color: "#8B5CF6",
    useCase: "Deferred payment arrangements and milestone-based releases",
    defaultConditions: [
      { type: "time", description: "Release after delivery + grace period", parameter: "deliveryDate", operator: "+", value: "7 days", action: "autoRelease" },
    ],
    features: ["Milestone tracking", "Grace periods", "Automatic triggers"],
  },
];

const conditionTypes = [
  { value: "delivery", label: "Delivery Confirmation" },
  { value: "quality", label: "Quality Check" },
  { value: "time", label: "Time-Based Trigger" },
  { value: "payment", label: "Payment Event" },
  { value: "custom", label: "Custom Condition" },
];

const operators = [
  { value: "==", label: "Equals" },
  { value: "!=", label: "Not Equals" },
  { value: ">", label: "Greater Than" },
  { value: ">=", label: "Greater or Equal" },
  { value: "<", label: "Less Than" },
  { value: "<=", label: "Less or Equal" },
  { value: "inZone", label: "In Zone" },
  { value: "contains", label: "Contains" },
];

const actions = [
  { value: "releasePayment", label: "Release Payment" },
  { value: "refundBuyer", label: "Refund Buyer" },
  { value: "confirmDelivery", label: "Confirm Delivery" },
  { value: "approveQuality", label: "Approve Quality" },
  { value: "triggerDispute", label: "Trigger Dispute" },
  { value: "notifyParties", label: "Notify Parties" },
  { value: "autoRelease", label: "Auto-Release Funds" },
  { value: "customAction", label: "Custom Action" },
];

const platformData = [
  { name: "Ethereum", tvl: 85, speed: 70, cost: 40, security: 95, adoption: 98 },
  { name: "Polygon", tvl: 45, speed: 90, cost: 95, security: 85, adoption: 80 },
  { name: "Hyperledger", tvl: 30, speed: 85, cost: 90, security: 90, adoption: 45 },
];

const useCaseData = [
  { name: "Escrow", value: 35, fill: "#0F4C81" },
  { name: "Delivery", value: 28, fill: "#2E8B57" },
  { name: "Quality", value: 18, fill: "#F59E0B" },
  { name: "Time-Based", value: 12, fill: "#8B5CF6" },
  { name: "Custom", value: 7, fill: "#6B7280" },
];

const FAQS = [
  {
    question: "What is a smart contract and how does it work in logistics?",
    answer: "A smart contract is a self-executing program stored on a blockchain that runs when predetermined conditions are met. In logistics and supply chain management, smart contracts automate the enforcement of agreements between parties—such as buyers, sellers, carriers, and customs brokers—without requiring intermediaries. When conditions like delivery confirmation, quality verification, or time thresholds are satisfied, the contract automatically executes the agreed-upon actions, such as releasing payment or updating shipment status. This automation reduces transaction costs, eliminates delays from manual processing, and provides an immutable audit trail that enhances transparency and trust among all stakeholders in the supply chain.",
  },
  {
    question: "How secure are smart contracts for international trade?",
    answer: "Smart contracts provide robust security through blockchain's inherent properties: cryptographic hashing, distributed consensus, and immutability. Once deployed, the contract code cannot be altered, preventing tampering by any single party. However, security also depends on the quality of the contract code itself. Bugs or vulnerabilities in poorly written contracts can be exploited, leading to financial losses. For international trade, we recommend having contracts audited by security professionals before deployment, using established contract patterns, and implementing multi-signature requirements for high-value transactions. Additionally, consider using established blockchain platforms with proven security track records and incorporating dispute resolution mechanisms for edge cases where automated execution may not suffice.",
  },
  {
    question: "What blockchain platforms are best for supply chain smart contracts?",
    answer: "The choice of blockchain platform depends on your specific requirements. Ethereum offers the largest ecosystem of developers and tools, making it ideal for public, transparent supply chains, though gas fees can be high during network congestion. Polygon provides Ethereum compatibility with lower fees and faster transactions, suitable for high-volume logistics operations. Hyperledger Fabric is designed for enterprise use with permissioned access, making it appropriate for private supply chain networks where confidentiality is paramount. Other platforms like VeChain and IBM Food Trust are specifically built for supply chain applications with built-in features for product tracking and verification. Consider factors including transaction volume, privacy requirements, cost sensitivity, and integration needs when selecting your platform.",
  },
  {
    question: "How do smart contracts handle disputes in logistics transactions?",
    answer: "Smart contracts can incorporate various dispute resolution mechanisms to handle situations where automated execution may be inappropriate. Common approaches include: (1) Multi-signature escrow requiring manual release by both parties or an arbitrator; (2) Time-locked delays that provide a window for raising objections before automatic execution; (3) Oracle-based verification where trusted third parties provide data inputs for dispute resolution; (4) Decentralized arbitration platforms like Kleros that use token-holder juries to adjudicate disputes. Well-designed contracts specify clear conditions under which disputes can be raised, evidence requirements, resolution procedures, and fallback actions. This hybrid approach combines the efficiency of automation with human judgment for exceptional circumstances.",
  },
  {
    question: "What are the costs associated with deploying smart contracts?",
    answer: "Smart contract costs fall into several categories: (1) Development costs—hiring experienced blockchain developers typically ranges from $50-200+ per hour depending on expertise and location; (2) Security audits—professional audits range from $5,000 to $100,000+ for complex contracts; (3) Deployment costs—on Ethereum mainnet, deployment can cost $50-500+ in gas fees depending on contract complexity and network conditions, while Polygon and other L2 solutions offer significantly lower deployment costs; (4) Transaction costs—each contract interaction requires gas fees, ranging from cents on Polygon to dollars on Ethereum; (5) Maintenance costs—monitoring, upgrades (via proxy patterns), and oracle service fees for external data. For enterprises, private chains like Hyperledger eliminate most transaction fees but require infrastructure investment.",
  },
  {
    question: "How do I integrate smart contracts with existing logistics systems?",
    answer: "Integration with existing logistics systems involves several key components: (1) API connectors that link your ERP, warehouse management, or transportation management systems to the blockchain; (2) IoT devices and sensors that provide real-time data inputs (location, temperature, humidity) to trigger contract conditions; (3) Oracle services (like Chainlink) that connect smart contracts to external data sources including shipping APIs, quality certification databases, and customs systems; (4) Identity management systems that link blockchain addresses to real-world entities; (5) User interfaces that abstract blockchain complexity from end users. Many platforms offer SDKs and APIs to facilitate integration. Consider a phased approach: start with simple use cases like payment escrow before advancing to complex multi-party supply chain orchestration.",
  },
  {
    question: "What legal considerations apply to smart contracts in trade?",
    answer: "Smart contracts exist in a developing legal landscape that varies by jurisdiction. Key considerations include: (1) Legal enforceability—many jurisdictions now recognize smart contracts as legally binding, but traditional contract elements (offer, acceptance, consideration) must still be present; (2) Jurisdictional issues—international transactions may span multiple legal systems, requiring clear choice-of-law provisions; (3) Regulatory compliance—smart contracts must comply with existing regulations including customs, sanctions screening, and data protection laws; (4) Dispute resolution—specify arbitration forums and governing law in the contract metadata; (5) Liability—determine liability allocation for contract failures, bugs, or oracle manipulation; (6) Documentation—maintain off-chain records linking smart contracts to underlying trade documents. Consult legal counsel experienced in blockchain and international trade law.",
  },
];

const PRO_TIPS = [
  {
    title: "Start Simple",
    description: "Begin with basic escrow contracts before implementing complex multi-condition logic. Test thoroughly on testnet before mainnet deployment.",
    icon: Target,
  },
  {
    title: "Use Established Patterns",
    description: "Leverage audited contract libraries like OpenZeppelin for security-critical functions such as access control and payment handling.",
    icon: Shield,
  },
  {
    title: "Plan for Upgrades",
    description: "Implement proxy patterns to allow contract upgrades without losing state. Bugs are inevitable—plan for them.",
    icon: RefreshCw,
  },
  {
    title: "Verify Oracle Data",
    description: "Use multiple oracle sources for critical conditions. A single compromised oracle can lead to incorrect contract execution.",
    icon: Database,
  },
  {
    title: "Document Everything",
    description: "Maintain comprehensive documentation of contract logic, parameters, and expected behaviors for legal and operational clarity.",
    icon: FileText,
  },
];

export function SmartContractCreator() {
  const [activeTab, setActiveTab] = useState("creator");
  const [config, setConfig] = useState<ContractConfig>({
    name: "Trade Escrow Contract",
    type: "escrow",
    platform: "ethereum",
    parties: {
      buyer: "0x1234...5678",
      seller: "0xABCD...EF12",
      arbitrator: "0x9999...8888",
    },
    amount: "10000",
    currency: "USDC",
    conditions: [
      {
        id: "1",
        type: "delivery",
        description: "Delivery confirmed by buyer",
        parameter: "deliveryStatus",
        operator: "==",
        value: "confirmed",
        action: "releasePayment",
      },
    ],
    autoExecute: true,
    disputeResolution: "arbitration",
    expiryDays: 30,
  });

  const [selectedTemplate, setSelectedTemplate] = useState("escrow");
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const generateContractCode = useMemo(() => {
    const header = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ${config.name}
 * @dev Generated by Shiportrade.com Smart Contract Creator
 * @notice This contract handles ${config.type} operations
 * @author Shiportrade Blockchain Team
 */

contract ${config.name.replace(/\s+/g, '')} {
    // ============================================
    // State Variables
    // ============================================
    
    // Contract parties
    address public immutable buyer = ${config.parties.buyer};
    address public immutable seller = ${config.parties.seller};
    address public arbitrator = ${config.parties.arbitrator || 'address(0)'};
    
    // Contract value
    uint256 public amount = ${parseFloat(config.amount) * 1e18} wei;
    bool public released = false;
    bool public disputed = false;
    
    // Contract state
    enum State { Created, Funded, Completed, Disputed, Expired }
    State public currentState = State.Created;
    
    // ============================================
    // Events
    // ============================================
    
    event PaymentDeposited(address indexed from, uint256 amount);
    event PaymentReleased(address indexed to, uint256 amount);
    event DisputeRaised(address indexed by, uint256 timestamp);
    event ConditionMet(string condition, uint256 timestamp);
    event StateChanged(State oldState, State newState);
`;

    const conditions = config.conditions.map((c, i) => `
    // ============================================
    // Condition ${i + 1}: ${c.description}
    // ============================================
    
    bool public condition${i + 1}Met = false;
    string public condition${i + 1}Param = "${c.parameter}";
    string public condition${i + 1}Operator = "${c.operator}";
    string public condition${i + 1}Value = "${c.value}";
    
    /**
     * @dev Check and update condition ${i + 1}
     * @param _value The value to check against
     */
    function checkCondition${i + 1}(string memory _value) public returns (bool) {
        require(!released, "Contract already executed");
        require(currentState == State.Funded, "Contract not funded");
        
        // Implementation for: ${c.description}
        // Action on success: ${c.action}
        condition${i + 1}Met = true;
        emit ConditionMet("condition${i + 1}", block.timestamp);
        
        ${config.autoExecute ? '_tryExecute();' : ''}
        return true;
    }
`).join('\n');

    const footer = `
    // ============================================
    // Main Execution Logic
    // ============================================
    
    /**
     * @dev Attempt to execute the contract if all conditions are met
     */
    function _tryExecute() internal {
        if (_allConditionsMet() && !released) {
            released = true;
            State oldState = currentState;
            currentState = State.Completed;
            payable(seller).transfer(amount);
            emit PaymentReleased(seller, amount);
            emit StateChanged(oldState, currentState);
        }
    }
    
    /**
     * @dev Check if all conditions have been met
     */
    function _allConditionsMet() internal view returns (bool) {
        ${config.conditions.map((_, i) => `if (!condition${i + 1}Met) return false;`).join('\n        ')}
        return true;
    }
    
    // ============================================
    // Dispute Resolution
    // ============================================
    
    /**
     * @dev Raise a dispute, only buyer or arbitrator can call
     */
    function raiseDispute() external {
        require(msg.sender == buyer || msg.sender == arbitrator, "Unauthorized");
        require(!released, "Already released");
        require(!disputed, "Already disputed");
        
        disputed = true;
        State oldState = currentState;
        currentState = State.Disputed;
        emit DisputeRaised(msg.sender, block.timestamp);
        emit StateChanged(oldState, currentState);
    }
    
    /**
     * @dev Resolve dispute by arbitrator
     * @param _releaseToSeller If true, release to seller; otherwise refund buyer
     */
    function resolveDispute(bool _releaseToSeller) external {
        require(msg.sender == arbitrator, "Only arbitrator");
        require(disputed, "No dispute active");
        
        released = true;
        State oldState = currentState;
        currentState = State.Completed;
        
        if (_releaseToSeller) {
            payable(seller).transfer(amount);
            emit PaymentReleased(seller, amount);
        } else {
            payable(buyer).transfer(amount);
            emit PaymentReleased(buyer, amount);
        }
        emit StateChanged(oldState, currentState);
    }
    
    // ============================================
    // Time-based Functions
    // ============================================
    
    uint256 public expiresAt = block.timestamp + (${config.expiryDays} days);
    
    /**
     * @dev Claim refund after expiry
     */
    function claimExpiry() external {
        require(block.timestamp > expiresAt, "Not expired yet");
        require(!released, "Already released");
        require(msg.sender == buyer, "Only buyer");
        
        released = true;
        State oldState = currentState;
        currentState = State.Expired;
        payable(buyer).transfer(amount);
        emit PaymentReleased(buyer, amount);
        emit StateChanged(oldState, currentState);
    }
    
    // ============================================
    // Funding
    // ============================================
    
    /**
     * @dev Fund the contract
     */
    function fund() external payable {
        require(msg.value >= amount, "Insufficient funds");
        require(currentState == State.Created, "Invalid state");
        
        State oldState = currentState;
        currentState = State.Funded;
        emit PaymentDeposited(msg.sender, msg.value);
        emit StateChanged(oldState, currentState);
    }
    
    // ============================================
    // Receive Function
    // ============================================
    
    receive() external payable {
        emit PaymentDeposited(msg.sender, msg.value);
    }
}`;

    return header + conditions + footer;
  }, [config]);

  const addCondition = () => {
    const newCondition: ContractCondition = {
      id: `${config.conditions.length + 1}`,
      type: "delivery",
      description: "",
      parameter: "",
      operator: "==",
      value: "",
      action: "releasePayment",
    };
    setConfig({
      ...config,
      conditions: [...config.conditions, newCondition],
    });
  };

  const removeCondition = (id: string) => {
    setConfig({
      ...config,
      conditions: config.conditions.filter((c) => c.id !== id),
    });
  };

  const updateCondition = (id: string, field: keyof ContractCondition, value: string) => {
    setConfig({
      ...config,
      conditions: config.conditions.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      ),
    });
  };

  const applyTemplate = (templateId: string) => {
    const template = contractTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      setConfig({
        ...config,
        name: template.name,
        type: templateId as ContractConfig["type"],
        conditions: template.defaultConditions.map((c, i) => ({
          ...c,
          id: `${i + 1}`,
        })),
      });
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateContractCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setConfig({
      name: "Trade Escrow Contract",
      type: "escrow",
      platform: "ethereum",
      parties: {
        buyer: "0x1234...5678",
        seller: "0xABCD...EF12",
        arbitrator: "0x9999...8888",
      },
      amount: "10000",
      currency: "USDC",
      conditions: [
        {
          id: "1",
          type: "delivery",
          description: "Delivery confirmed by buyer",
          parameter: "deliveryStatus",
          operator: "==",
          value: "confirmed",
          action: "releasePayment",
        },
      ],
      autoExecute: true,
      disputeResolution: "arbitration",
      expiryDays: 30,
    });
    setSelectedTemplate("escrow");
  };

  // Chart data
  const contractComplexityData = [
    { name: "Conditions", value: config.conditions.length, max: 10 },
    { name: "Parties", value: config.parties.arbitrator ? 3 : 2, max: 5 },
    { name: "Expiry Days", value: Math.min(config.expiryDays / 10, 10), max: 10 },
  ];

  const getTemplateColor = (id: string) => {
    const template = contractTemplates.find((t) => t.id === id);
    return template?.color || "#6B7280";
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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge className="bg-[var(--ocean)] text-white">
                  <Link className="h-3 w-3 mr-1" />
                  Blockchain
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Badge variant="outline" className="border-[var(--logistics)] text-[var(--logistics)]">
                  <Globe className="h-3 w-3 mr-1" />
                  Digital Supply Chain
                </Badge>
              </motion.div>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              Smart Contract Creator
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Generate production-ready smart contracts for logistics and supply chain operations. 
              Configure conditions, parties, and automatic execution rules with visual tools.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetForm}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="creator" className="flex items-center gap-2">
            <FileCode className="h-4 w-4" />
            <span className="hidden sm:inline">Creator</span>
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            <span className="hidden sm:inline">Templates</span>
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Preview</span>
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

        {/* Creator Tab */}
        <TabsContent value="creator" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Configuration Panel */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5 text-[var(--ocean)]" />
                    Contract Configuration
                  </CardTitle>
                  <CardDescription>
                    Define the basic parameters for your smart contract
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Contract Name</Label>
                      <Input
                        value={config.name}
                        onChange={(e) => setConfig({ ...config, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Platform</Label>
                      <Select
                        value={config.platform}
                        onValueChange={(v) => setConfig({ ...config, platform: v as ContractConfig["platform"] })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum</SelectItem>
                          <SelectItem value="polygon">Polygon</SelectItem>
                          <SelectItem value="hyperledger">Hyperledger Fabric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      Contract Parties
                    </Label>
                    <div className="grid grid-cols-1 gap-3">
                      <div>
                        <Label className="text-xs text-muted-foreground">Buyer Address</Label>
                        <Input
                          value={config.parties.buyer}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              parties: { ...config.parties, buyer: e.target.value },
                            })
                          }
                          placeholder="0x..."
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Seller Address</Label>
                        <Input
                          value={config.parties.seller}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              parties: { ...config.parties, seller: e.target.value },
                            })
                          }
                          placeholder="0x..."
                          className="font-mono text-xs"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Arbitrator (Optional)</Label>
                        <Input
                          value={config.parties.arbitrator || ""}
                          onChange={(e) =>
                            setConfig({
                              ...config,
                              parties: { ...config.parties, arbitrator: e.target.value },
                            })
                          }
                          placeholder="0x..."
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="number"
                        value={config.amount}
                        onChange={(e) => setConfig({ ...config, amount: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select
                        value={config.currency}
                        onValueChange={(v) => setConfig({ ...config, currency: v })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USDC">USDC</SelectItem>
                          <SelectItem value="USDT">USDT</SelectItem>
                          <SelectItem value="ETH">ETH</SelectItem>
                          <SelectItem value="DAI">DAI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Expiry (Days)</Label>
                      <Input
                        type="number"
                        value={config.expiryDays}
                        onChange={(e) => setConfig({ ...config, expiryDays: parseInt(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-Execute</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically execute when all conditions are met
                      </p>
                    </div>
                    <Switch
                      checked={config.autoExecute}
                      onCheckedChange={(checked) => setConfig({ ...config, autoExecute: checked })}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Conditions Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5 text-[var(--logistics)]" />
                      Smart Conditions
                    </CardTitle>
                    <Button onClick={addCondition} size="sm" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Condition
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AnimatePresence>
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {config.conditions.map((condition, index) => (
                        <motion.div
                          key={condition.id}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-4 rounded-lg border border-border bg-muted/30"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <Badge variant="outline" style={{ borderColor: getTemplateColor(config.type), color: getTemplateColor(config.type) }}>
                              Condition {index + 1}
                            </Badge>
                            <Button
                              onClick={() => removeCondition(condition.id)}
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Type</Label>
                              <Select
                                value={condition.type}
                                onValueChange={(v) => updateCondition(condition.id, "type", v)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {conditionTypes.map((t) => (
                                    <SelectItem key={t.value} value={t.value}>
                                      {t.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-xs">Action</Label>
                              <Select
                                value={condition.action}
                                onValueChange={(v) => updateCondition(condition.id, "action", v)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {actions.map((a) => (
                                    <SelectItem key={a.value} value={a.value}>
                                      {a.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            <Label className="text-xs">Description</Label>
                            <Input
                              value={condition.description}
                              onChange={(e) => updateCondition(condition.id, "description", e.target.value)}
                              placeholder="What triggers this condition?"
                              className="h-8"
                            />
                          </div>

                          <div className="mt-3 grid grid-cols-3 gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Parameter</Label>
                              <Input
                                value={condition.parameter}
                                onChange={(e) => updateCondition(condition.id, "parameter", e.target.value)}
                                placeholder="param"
                                className="h-8 text-xs font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Operator</Label>
                              <Select
                                value={condition.operator}
                                onValueChange={(v) => updateCondition(condition.id, "operator", v)}
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {operators.map((o) => (
                                    <SelectItem key={o.value} value={o.value}>
                                      {o.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Value</Label>
                              <Input
                                value={condition.value}
                                onChange={(e) => updateCondition(condition.id, "value", e.target.value)}
                                placeholder="value"
                                className="h-8"
                              />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>

                  {config.conditions.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No conditions added yet</p>
                      <Button onClick={addCondition} variant="link" size="sm">
                        Add your first condition
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Summary Panel */}
            <div className="space-y-6">
              <Card className="border-2 border-[var(--ocean)]/20">
                <CardHeader className="bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5">
                  <CardTitle className="flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-[var(--ocean)]" />
                    Contract Summary
                  </CardTitle>
                  <CardDescription>
                    Overview of your smart contract configuration
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div
                      key={config.name}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-[var(--ocean)]/10 rounded-lg text-center"
                    >
                      <div className="text-lg font-bold text-[var(--ocean)] truncate">
                        {config.name}
                      </div>
                      <div className="text-sm text-muted-foreground">Contract Name</div>
                    </motion.div>
                    <motion.div
                      key={config.amount}
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="p-4 bg-[var(--logistics)]/10 rounded-lg text-center"
                    >
                      <div className="text-lg font-bold text-[var(--logistics)]">
                        {config.amount} {config.currency}
                      </div>
                      <div className="text-sm text-muted-foreground">Contract Value</div>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-[var(--ocean)] capitalize">{config.platform}</div>
                      <div className="text-xs text-muted-foreground">Platform</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-[var(--logistics)]">{config.conditions.length}</div>
                      <div className="text-xs text-muted-foreground">Conditions</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{config.expiryDays}d</div>
                      <div className="text-xs text-muted-foreground">Expiry</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Auto-Execute</span>
                    <Badge className={config.autoExecute ? "bg-[var(--logistics)] text-white" : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"}>
                      {config.autoExecute ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">Dispute Resolution</span>
                    <Badge variant="outline" className="capitalize">
                      {config.disputeResolution}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Complexity Visualization */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-[var(--ocean)]" />
                    Contract Complexity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={contractComplexityData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="name" className="text-xs" />
                        <PolarRadiusAxis domain={[0, 10]} tick={false} />
                        <Radar
                          name="Complexity"
                          dataKey="value"
                          stroke="#0F4C81"
                          fill="#0F4C81"
                          fillOpacity={0.3}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Warning */}
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    <p className="font-medium mb-1">Important Security Notice</p>
                    <p>This is a template contract. Always audit smart contracts before deploying to mainnet. 
                       Consider security implications and test thoroughly on testnet first. Professional security 
                       audits are recommended for contracts handling significant value.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--ocean)]" />
                Pre-Built Contract Templates
              </CardTitle>
              <CardDescription>
                Choose from industry-standard smart contract templates for common logistics use cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {contractTemplates.map((template) => {
                  const Icon = template.icon;
                  const isSelected = selectedTemplate === template.id;
                  return (
                    <motion.div
                      key={template.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyTemplate(template.id)}
                      className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-[var(--ocean)] bg-[var(--ocean)]/5"
                          : "border-border hover:border-muted-foreground/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                          style={{ backgroundColor: template.color + "20" }}
                        >
                          <Icon className="h-6 w-6" style={{ color: template.color }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            {isSelected && (
                              <Badge className="bg-[var(--logistics)] text-white text-xs">Selected</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                          <div className="mt-2">
                            <p className="text-xs text-muted-foreground">
                              <strong>Use Case:</strong> {template.useCase}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {template.features.map((feature, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Use Case Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-[var(--logistics)]" />
                Smart Contract Use Cases in Logistics
              </CardTitle>
              <CardDescription>
                Distribution of smart contract applications in supply chain management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={useCaseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {useCaseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card className="lg:sticky lg:top-4">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Code className="h-5 w-5 text-[var(--logistics)]" />
                  Generated Contract Code
                </CardTitle>
                <div className="flex gap-2">
                  <Button onClick={copyCode} size="sm" variant="outline">
                    {copied ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download .sol
                  </Button>
                </div>
              </div>
              <CardDescription>
                Solidity code for Ethereum-compatible blockchains (EVM)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-xs text-green-400 overflow-x-auto max-h-[600px] overflow-y-auto">
                  <code>{generateContractCode}</code>
                </pre>
              </div>

              {/* Contract Summary */}
              <div className="mt-4 p-4 rounded-lg bg-muted/50">
                <h4 className="font-medium mb-3 text-sm flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Deployment Information
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground">Contract Type:</span>
                    <Badge variant="outline" className="ml-2 text-xs capitalize">{config.type}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform:</span>
                    <Badge variant="outline" className="ml-2 text-xs capitalize">{config.platform}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Value:</span>
                    <span className="font-medium ml-1">{config.amount} {config.currency}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Conditions:</span>
                    <span className="font-medium ml-1">{config.conditions.length}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Auto-Execute:</span>
                    <Badge className={`ml-2 text-xs ${config.autoExecute ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300" : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"}`}>
                      {config.autoExecute ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Expiry:</span>
                    <span className="font-medium ml-1">{config.expiryDays} days</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Solidity Version:</span>
                    <span className="font-medium ml-1">0.8.19</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">License:</span>
                    <span className="font-medium ml-1">MIT</span>
                  </div>
                </div>
              </div>

              {/* Deployment Steps */}
              <div className="mt-4 p-4 rounded-lg border border-border">
                <h4 className="font-medium mb-3 text-sm">Next Steps</h4>
                <div className="space-y-2">
                  {[
                    { step: 1, text: "Review and customize the generated code" },
                    { step: 2, text: "Test on testnet (Goerli, Sepolia)" },
                    { step: 3, text: "Get a professional security audit" },
                    { step: 4, text: "Deploy to mainnet with verified bytecode" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-center gap-3 text-sm">
                      <div className="w-6 h-6 rounded-full bg-[var(--ocean)] text-white flex items-center justify-center text-xs font-bold">
                        {item.step}
                      </div>
                      <span className="text-muted-foreground">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Guide Tab */}
        <TabsContent value="guide" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Pro Tips for Smart Contract Development
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {PRO_TIPS.map((tip, index) => (
                    <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                      <tip.icon className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-sm">{tip.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-[var(--ocean)]" />
                  Understanding Smart Contracts in Logistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Smart contracts are revolutionizing supply chain management by automating trust between 
                  parties who may have never transacted before. In traditional logistics, payment and delivery 
                  coordination requires extensive documentation, trusted intermediaries, and often results in 
                  payment delays that strain supplier relationships. Smart contracts eliminate these friction 
                  points by encoding business logic directly into self-executing code on a blockchain.
                </p>
                <p>
                  The key innovation is that contract execution becomes deterministic—when predefined conditions 
                  are verified (such as GPS coordinates confirming delivery, IoT sensors verifying temperature 
                  compliance, or quality certificates uploaded by inspectors), the contract automatically 
                  triggers the agreed actions. This removes the need for parties to trust each other&apos;s 
                  goodwill; they need only trust the code and the underlying blockchain&apos;s security.
                </p>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Key Components:</h4>
                  <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-[var(--ocean)]" />
                      <span><strong>Parties:</strong> Buyer, seller, and optional arbitrator addresses</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-[var(--logistics)]" />
                      <span><strong>Conditions:</strong> Triggers that must be satisfied for execution</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wallet className="h-4 w-4 text-amber-500" />
                      <span><strong>Actions:</strong> Automatic responses when conditions are met</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-purple-500" />
                      <span><strong>Dispute Resolution:</strong> Fallback mechanisms for exceptional cases</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--ocean)]" />
                Blockchain Platform Comparison
              </CardTitle>
              <CardDescription>
                Compare key metrics across different blockchain platforms for smart contract deployment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={platformData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="security" name="Security" fill="#0F4C81" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="speed" name="Transaction Speed" fill="#2E8B57" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="cost" name="Cost Efficiency" fill="#F59E0B" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="adoption" name="Adoption" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Reference Guide */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Contract Development Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="condition-types">
                  <AccordionTrigger>Condition Types Explained</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold text-[var(--ocean)]">Delivery Confirmation</h5>
                        <p className="text-muted-foreground">Triggers when delivery is verified through GPS, signature, or IoT sensor data. Most common use case for logistics contracts.</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold text-[var(--logistics)]">Quality Check</h5>
                        <p className="text-muted-foreground">Activated when quality parameters meet specified thresholds. Ideal for commodity trading and temperature-sensitive goods.</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold text-amber-500">Time-Based Trigger</h5>
                        <p className="text-muted-foreground">Executes based on time elapsed since a reference event. Useful for grace periods and milestone deadlines.</p>
                      </div>
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <h5 className="font-semibold text-purple-500">Payment Event</h5>
                        <p className="text-muted-foreground">Triggers based on payment-related conditions such as deposit confirmation or installment completion.</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="security-considerations">
                  <AccordionTrigger>Security Considerations</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Reentrancy Attacks:</strong> Always use the checks-effects-interactions pattern and ReentrancyGuard.</p>
                      <p><strong>Integer Overflow:</strong> Solidity 0.8+ includes built-in overflow protection, but be careful with unchecked blocks.</p>
                      <p><strong>Access Control:</strong> Use Ownable or AccessControl for privileged functions.</p>
                      <p><strong>Oracle Manipulation:</strong> Use multiple oracle sources and time-weighted average prices for critical data.</p>
                      <p><strong>Front-running:</strong> Consider commit-reveal schemes for sensitive operations.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="gas-optimization">
                  <AccordionTrigger>Gas Optimization Tips</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Pack Variables:</strong> Group smaller uint types together to share storage slots.</p>
                      <p><strong>Use Constants:</strong> Mark immutable values as constant or immutable.</p>
                      <p><strong>Batch Operations:</strong> Process multiple items in single transactions when possible.</p>
                      <p><strong>Events vs Storage:</strong> Use events for historical data instead of storing in contract state.</p>
                      <p><strong>Short-Circuit Logic:</strong> Order conditions in if-statements with cheaper checks first.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                Common questions about smart contracts in logistics and supply chain management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
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
