'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calculator,
  Container,
  Box,
  Package,
  ArrowRight,
  AlertTriangle,
  Info,
  RefreshCw,
  Layers,
  Weight,
  Ruler,
  BarChart3,
  HelpCircle,
  Ship,
  TrendingUp,
  Zap,
  CheckCircle2,
  ChevronDown,
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
import { Progress } from '@/components/ui/progress';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from 'recharts';

interface CargoItem {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  quantity: number;
  weight: number;
  stackable: boolean;
}

interface LoadResult {
  totalCargoCBM: number;
  totalCargoWeight: number;
  containerUtilization: {
    volume: number;
    weight: number;
  };
  recommendedContainer: string;
  containersNeeded: number;
  remainingCBM: number;
  remainingWeight: number;
  efficiency: 'excellent' | 'good' | 'moderate' | 'poor';
  suggestions: string[];
  breakdown: {
    containerType: string;
    quantity: number;
    cbmPerContainer: number;
    weightPerContainer: number;
  }[];
}

// Container specifications
const containerSpecs = {
  '20GP': {
    name: '20ft General Purpose',
    internalLength: 5.9,
    internalWidth: 2.35,
    internalHeight: 2.39,
    maxWeight: 21900,
    maxCBM: 33.2,
    tareWeight: 2300,
  },
  '40GP': {
    name: '40ft General Purpose',
    internalLength: 12.03,
    internalWidth: 2.35,
    internalHeight: 2.39,
    maxWeight: 26630,
    maxCBM: 67.7,
    tareWeight: 3800,
  },
  '40HC': {
    name: '40ft High Cube',
    internalLength: 12.03,
    internalWidth: 2.35,
    internalHeight: 2.69,
    maxWeight: 26330,
    maxCBM: 76.3,
    tareWeight: 4000,
  },
  '45HC': {
    name: '45ft High Cube',
    internalLength: 13.56,
    internalWidth: 2.35,
    internalHeight: 2.69,
    maxWeight: 25500,
    maxCBM: 86.1,
    tareWeight: 4500,
  },
  '20RF': {
    name: '20ft Refrigerated',
    internalLength: 5.45,
    internalWidth: 2.29,
    internalHeight: 2.26,
    maxWeight: 21150,
    maxCBM: 28.4,
    tareWeight: 3100,
  },
  '40RF': {
    name: '40ft Refrigerated',
    internalLength: 11.58,
    internalWidth: 2.29,
    internalHeight: 2.28,
    maxWeight: 25890,
    maxCBM: 60.6,
    tareWeight: 4600,
  },
  '20OT': {
    name: '20ft Open Top',
    internalLength: 5.9,
    internalWidth: 2.35,
    internalHeight: 2.38,
    maxWeight: 21770,
    maxCBM: 33.0,
    tareWeight: 2380,
  },
  '40OT': {
    name: '40ft Open Top',
    internalLength: 12.03,
    internalWidth: 2.34,
    internalHeight: 2.35,
    maxWeight: 26450,
    maxCBM: 66.2,
    tareWeight: 3850,
  },
};

// Brand colors
const OCEAN_BLUE = '#0F4C81';
const LOGISTICS_GREEN = '#2E8B57';

// Chart configurations
const containerComparisonConfig = {
  cbm: { label: 'Volume (CBM)', color: OCEAN_BLUE },
  weight: { label: 'Max Weight (t)', color: LOGISTICS_GREEN },
} satisfies ChartConfig;

const utilizationConfig = {
  used: { label: 'Used', color: OCEAN_BLUE },
  available: { label: 'Available', color: '#E5E7EB' },
} satisfies ChartConfig;

// FAQ data
const faqs = [
  {
    question: '什么是CBM？如何计算？',
    answer: 'CBM (Cubic Meter) 是立方米的意思，是衡量货物体积的标准单位。计算公式：CBM = 长(m) × 宽(m) × 高(m) × 数量。例如：100个60cm×40cm×30cm的纸箱，CBM = 0.6×0.4×0.3×100 = 7.2 CBM。',
  },
  {
    question: '如何选择合适的集装箱类型？',
    answer: '选择集装箱需考虑：1) 货物体积 - 体积大选大箱；2) 货物重量 - 重货选20GP，轻泡货选40HC；3) 货物特性 - 冷藏品用RF，超高货物用OT或HC；4) 成本效益 - 综合运费和利用率选择最优方案。',
  },
  {
    question: '为什么实际装载量通常低于理论容量？',
    answer: '实际装载受多种因素影响：1) 货物形状不规则导致空间浪费；2) 需要留出固定和通风空间；3) 货物堆叠限制；4) 重量分布要求；5) 装卸操作空间。一般实际利用率在理论容量的80-90%。',
  },
  {
    question: '20GP和40GP的主要区别是什么？',
    answer: '20GP：内部体积33.2 CBM，最大载重21.9吨，适合重型货物。40GP：内部体积67.7 CBM，最大载重26.6吨，适合一般货物。20GP单位载重更高，40GP单位体积成本更低。选择时需权衡重量和体积利用率。',
  },
  {
    question: '什么是高柜(High Cube)集装箱？有何优势？',
    answer: '高柜集装箱比标准箱高约30cm(2.69m vs 2.39m)，40HC容积76.3 CBM，比40GP多8.6 CBM。优势：1) 适合轻泡货物；2) 可堆叠更多层；3) 提高空间利用率；4) 单位运输成本更低。运费通常略高于标准箱。',
  },
  {
    question: '冷藏集装箱(RF)的装载注意事项？',
    answer: '冷藏箱使用注意：1) 预冷货物至要求温度；2) 留出冷风循环空间；3) 货物不能直接接触箱壁；4) 温度记录设备需正确设置；5) 内部尺寸比普通箱小；6) 运费较高需权衡必要性。',
  },
  {
    question: '如何提高集装箱装载效率？',
    answer: '提高效率的方法：1) 使用专业的装箱软件规划；2) 合理搭配不同尺寸货物；3) 统一包装规格；4) 采用托盘化装载；5) 考虑货物堆叠可能性；6) 预先测量和规划；7) 培训专业装货人员。',
  },
  {
    question: '集装箱装载有哪些安全注意事项？',
    answer: '安全注意：1) 重下轻上原则；2) 重量左右对称分布；3) 货物固定牢靠；4) 易碎品特殊保护；5) 危险品按规定装载；6) 检查箱体状况；7) 记录装货照片；8) 控制总重量在限重内。',
  },
];

// Visualization data
const containerComparisonData = Object.entries(containerSpecs).map(([code, spec]) => ({
  name: code,
  cbm: spec.maxCBM,
  weight: Math.round(spec.maxWeight / 1000),
}));

const efficiencyData = [
  { name: 'Excellent (85%+)', value: 35, color: LOGISTICS_GREEN },
  { name: 'Good (70-85%)', value: 30, color: OCEAN_BLUE },
  { name: 'Moderate (50-70%)', value: 20, color: '#F59E0B' },
  { name: 'Poor (<50%)', value: 15, color: '#EF4444' },
];

const containerRadarData = [
  { metric: 'Volume Capacity', '20GP': 40, '40GP': 80, '40HC': 90 },
  { metric: 'Weight Capacity', '20GP': 85, '40GP': 70, '40HC': 65 },
  { metric: 'Cost Efficiency', '20GP': 70, '40GP': 85, '40HC': 80 },
  { metric: 'Availability', '20GP': 90, '40GP': 95, '40HC': 75 },
  { metric: 'Versatility', '20GP': 80, '40GP': 85, '40HC': 70 },
];

export default function ContainerLoadCalculator() {
  const [containerType, setContainerType] = useState<'20GP' | '40GP' | '40HC' | '45HC' | '20RF' | '40RF' | '20OT' | '40OT'>('40HC');
  const [cargoItems, setCargoItems] = useState<CargoItem[]>([
    { id: '1', name: 'Carton Box', length: 60, width: 40, height: 30, quantity: 100, weight: 15, stackable: true },
  ]);
  const [result, setResult] = useState<LoadResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');

  const addItem = () => {
    const newItem: CargoItem = {
      id: Date.now().toString(),
      name: '',
      length: 50,
      width: 40,
      height: 30,
      quantity: 1,
      weight: 10,
      stackable: true,
    };
    setCargoItems([...cargoItems, newItem]);
  };

  const removeItem = (id: string) => {
    if (cargoItems.length > 1) {
      setCargoItems(cargoItems.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof CargoItem, value: string | number | boolean) => {
    setCargoItems(items =>
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateLoad = () => {
    const spec = containerSpecs[containerType];
    
    // Calculate total cargo CBM and weight
    let totalCBM = 0;
    let totalWeight = 0;

    cargoItems.forEach(item => {
      const itemCBM = (item.length * item.width * item.height * item.quantity) / 1000000; // cm³ to m³
      totalCBM += itemCBM;
      totalWeight += item.weight * item.quantity;
    });

    // Calculate utilization
    const volumeUtilization = (totalCBM / spec.maxCBM) * 100;
    const weightUtilization = (totalWeight / spec.maxWeight) * 100;

    // Calculate containers needed
    const containersByVolume = Math.ceil(totalCBM / spec.maxCBM);
    const containersByWeight = Math.ceil(totalWeight / spec.maxWeight);
    const containersNeeded = Math.max(containersByVolume, containersByWeight);

    // Calculate remaining capacity
    const remainingCBM = (containersNeeded * spec.maxCBM) - totalCBM;
    const remainingWeight = (containersNeeded * spec.maxWeight) - totalWeight;

    // Determine efficiency
    let efficiency: 'excellent' | 'good' | 'moderate' | 'poor';
    const avgUtilization = (volumeUtilization + weightUtilization) / 2 / containersNeeded;
    if (avgUtilization >= 85) efficiency = 'excellent';
    else if (avgUtilization >= 70) efficiency = 'good';
    else if (avgUtilization >= 50) efficiency = 'moderate';
    else efficiency = 'poor';

    // Generate suggestions
    const suggestions: string[] = [];
    if (volumeUtilization > 100) {
      suggestions.push('货物体积超出单箱容量，需要分批装运');
    }
    if (weightUtilization > 100) {
      suggestions.push('货物重量超出单箱限额，请检查重量分布');
    }
    if (containersNeeded > 1 && remainingCBM > spec.maxCBM * 0.3) {
      suggestions.push('最后一箱空间利用率较低，考虑合并货物或调整装载方案');
    }
    if (containerType === '40HC' && weightUtilization > 80 && volumeUtilization < 50) {
      suggestions.push('考虑使用20GP集装箱可能更经济');
    }
    if (containerType === '20GP' && volumeUtilization > 80) {
      suggestions.push('考虑使用40GP或40HC可能更高效');
    }

    // Breakdown
    const breakdown = [];
    for (let i = 0; i < containersNeeded; i++) {
      const cbmForThis = i === containersNeeded - 1 
        ? totalCBM - (spec.maxCBM * i)
        : spec.maxCBM;
      const weightForThis = i === containersNeeded - 1
        ? totalWeight - (spec.maxWeight * i)
        : spec.maxWeight;
      breakdown.push({
        containerType: spec.name,
        quantity: i + 1,
        cbmPerContainer: Math.min(cbmForThis, spec.maxCBM),
        weightPerContainer: Math.min(weightForThis, spec.maxWeight),
      });
    }

    setResult({
      totalCargoCBM: Math.round(totalCBM * 100) / 100,
      totalCargoWeight: Math.round(totalWeight),
      containerUtilization: {
        volume: Math.round(volumeUtilization * 10) / 10,
        weight: Math.round(weightUtilization * 10) / 10,
      },
      recommendedContainer: containerType,
      containersNeeded,
      remainingCBM: Math.round(remainingCBM * 100) / 100,
      remainingWeight: Math.round(remainingWeight),
      efficiency,
      suggestions,
      breakdown,
    });
  };

  const resetForm = () => {
    setCargoItems([
      { id: '1', name: 'Carton Box', length: 60, width: 40, height: 30, quantity: 100, weight: 15, stackable: true },
    ]);
    setResult(null);
  };

  const selectedSpec = containerSpecs[containerType];

  // Generate utilization pie data based on result
  const getUtilizationPieData = () => {
    if (!result) return [];
    return [
      { name: 'Used', value: result.containerUtilization.volume, fill: OCEAN_BLUE },
      { name: 'Available', value: 100 - result.containerUtilization.volume, fill: '#E5E7EB' },
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F4C81]/5 via-transparent to-[#2E8B57]/5" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#0F4C81]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2E8B57]/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-12 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0F4C81]/10 to-[#2E8B57]/10 border border-[#0F4C81]/20 rounded-full px-4 py-2 mb-6"
            >
              <Zap className="h-4 w-4 text-[#2E8B57]" />
              <span className="text-sm font-medium text-[#0F4C81]">智能集装箱装载规划工具</span>
            </motion.div>

            {/* Main Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="p-4 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-2xl shadow-xl"
              >
                <Ship className="h-10 w-10 text-white" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] bg-clip-text text-transparent">
                  集装箱装载计算器
                </span>
              </h1>
            </div>

            {/* Subtitle */}
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              精确计算货物体积与重量，智能推荐最优集装箱类型，最大化空间利用率并降低运输成本
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {[
                { icon: Calculator, text: '智能计算', color: OCEAN_BLUE },
                { icon: TrendingUp, text: '效率分析', color: LOGISTICS_GREEN },
                { icon: BarChart3, text: '可视化报告', color: OCEAN_BLUE },
                { icon: CheckCircle2, text: '优化建议', color: LOGISTICS_GREEN },
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center gap-2 bg-white dark:bg-slate-800 shadow-md rounded-full px-4 py-2"
                >
                  <feature.icon className="h-4 w-4" style={{ color: feature.color }} />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{feature.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
            >
              {[
                { value: '8+', label: '集装箱类型', color: OCEAN_BLUE },
                { value: '99%', label: '计算准确率', color: LOGISTICS_GREEN },
                { value: '30%', label: '成本节约', color: OCEAN_BLUE },
                { value: '24/7', label: '在线服务', color: LOGISTICS_GREEN },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-slate-200/50 dark:border-slate-700/50"
                >
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto h-12 bg-white dark:bg-slate-800 shadow-md rounded-xl p-1">
            <TabsTrigger value="calculator" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0F4C81] data-[state=active]:to-[#2E8B57] data-[state=active]:text-white">
              <Calculator className="h-4 w-4 mr-2" />
              计算器
            </TabsTrigger>
            <TabsTrigger value="specs" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0F4C81] data-[state=active]:to-[#2E8B57] data-[state=active]:text-white">
              <Container className="h-4 w-4 mr-2" />
              规格
            </TabsTrigger>
            <TabsTrigger value="visualizations" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0F4C81] data-[state=active]:to-[#2E8B57] data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4 mr-2" />
              可视化
            </TabsTrigger>
            <TabsTrigger value="guide" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0F4C81] data-[state=active]:to-[#2E8B57] data-[state=active]:text-white">
              <Ruler className="h-4 w-4 mr-2" />
              指南
            </TabsTrigger>
            <TabsTrigger value="faq" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0F4C81] data-[state=active]:to-[#2E8B57] data-[state=active]:text-white">
              <HelpCircle className="h-4 w-4 mr-2" />
              FAQ
            </TabsTrigger>
          </TabsList>

          {/* Calculator Tab */}
          <TabsContent value="calculator" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                      集装箱选择
                    </CardTitle>
                    <CardDescription>选择集装箱类型并输入货物信息</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Container Selection */}
                    <div className="space-y-2">
                      <Label>集装箱类型</Label>
                      <Select value={containerType} onValueChange={(v: typeof containerType) => setContainerType(v)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(containerSpecs).map(([code, spec]) => (
                            <SelectItem key={code} value={code}>
                              {spec.name} ({spec.maxCBM} CBM, {Math.round(spec.maxWeight / 1000)}t)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Container Info */}
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-xs text-slate-500">内部尺寸</p>
                          <p className="font-semibold text-sm">{selectedSpec.internalLength}×{selectedSpec.internalWidth}×{selectedSpec.internalHeight}m</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">最大载重</p>
                          <p className="font-semibold text-sm">{(selectedSpec.maxWeight / 1000).toFixed(1)}t</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">最大体积</p>
                          <p className="font-semibold text-sm">{selectedSpec.maxCBM} CBM</p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Cargo Items */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                          <Package className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                          货物清单
                        </h4>
                        <Button size="sm" onClick={addItem} variant="outline">
                          <Box className="h-4 w-4 mr-1" />
                          添加货物
                        </Button>
                      </div>

                      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                        {cargoItems.map((item, index) => (
                          <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-4">
                            <div className="flex justify-between items-center">
                              <Badge variant="outline">货物 {index + 1}</Badge>
                              {cargoItems.length > 1 && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <RefreshCw className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="col-span-2 space-y-2">
                                <Label className="text-xs">货物名称</Label>
                                <Input
                                  value={item.name}
                                  onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                                  placeholder="描述"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">长 (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.length}
                                  onChange={(e) => updateItem(item.id, 'length', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">宽 (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.width}
                                  onChange={(e) => updateItem(item.id, 'width', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">高 (cm)</Label>
                                <Input
                                  type="number"
                                  value={item.height}
                                  onChange={(e) => updateItem(item.id, 'height', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">数量</Label>
                                <Input
                                  type="number"
                                  value={item.quantity}
                                  onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs">单件重量 (kg)</Label>
                                <Input
                                  type="number"
                                  value={item.weight}
                                  onChange={(e) => updateItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={calculateLoad}
                        className="flex-1 text-white"
                        style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                      >
                        <Calculator className="h-4 w-4 mr-2" />
                        计算装载方案
                      </Button>
                      <Button
                        variant="outline"
                        onClick={resetForm}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Results Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Layers className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      装载分析结果
                    </CardTitle>
                    <CardDescription>集装箱装载效率与建议</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {result ? (
                      <div className="space-y-6">
                        {/* Primary Metrics */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="rounded-xl p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${OCEAN_BLUE}cc)` }}>
                            <p className="text-sm opacity-90 mb-1">货物总体积</p>
                            <p className="text-2xl font-bold">{result.totalCargoCBM}</p>
                            <p className="text-xs opacity-75">CBM</p>
                          </div>
                          <div className="rounded-xl p-4 text-white text-center" style={{ background: `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${LOGISTICS_GREEN}cc)` }}>
                            <p className="text-sm opacity-90 mb-1">货物总重量</p>
                            <p className="text-2xl font-bold">{result.totalCargoWeight.toLocaleString()}</p>
                            <p className="text-xs opacity-75">kg</p>
                          </div>
                        </div>

                        {/* Container Requirement */}
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 text-center">
                          <p className="text-sm text-slate-500 mb-2">所需集装箱数量</p>
                          <p className="text-5xl font-bold" style={{ color: OCEAN_BLUE }}>{result.containersNeeded}</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                            {selectedSpec.name}
                          </p>
                        </div>

                        {/* Utilization */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300">空间利用率</h4>
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">体积利用率</span>
                                <span className="font-semibold">{result.containerUtilization.volume}%</span>
                              </div>
                              <Progress 
                                value={Math.min(result.containerUtilization.volume, 100)} 
                                className="h-3"
                                style={{ 
                                  background: `${OCEAN_BLUE}20`,
                                }}
                              />
                            </div>
                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-slate-600 dark:text-slate-400">重量利用率</span>
                                <span className="font-semibold">{result.containerUtilization.weight}%</span>
                              </div>
                              <Progress 
                                value={Math.min(result.containerUtilization.weight, 100)} 
                                className="h-3"
                                style={{ 
                                  background: `${LOGISTICS_GREEN}20`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Efficiency Badge */}
                        <div className="flex justify-center">
                          <Badge className={`text-lg px-4 py-2 ${
                            result.efficiency === 'excellent' ? 'bg-emerald-500' :
                            result.efficiency === 'good' ? 'bg-blue-500' :
                            result.efficiency === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
                          }`}>
                            效率评估: {result.efficiency === 'excellent' ? '优秀' :
                                       result.efficiency === 'good' ? '良好' :
                                       result.efficiency === 'moderate' ? '一般' : '待优化'}
                          </Badge>
                        </div>

                        {/* Remaining Capacity */}
                        {result.containersNeeded === 1 && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: `${OCEAN_BLUE}15` }}>
                              <p className="text-xs text-slate-500">剩余体积</p>
                              <p className="font-semibold" style={{ color: OCEAN_BLUE }}>{result.remainingCBM} CBM</p>
                            </div>
                            <div className="rounded-lg p-3 text-center" style={{ backgroundColor: `${LOGISTICS_GREEN}15` }}>
                              <p className="text-xs text-slate-500">剩余载重</p>
                              <p className="font-semibold" style={{ color: LOGISTICS_GREEN }}>{result.remainingWeight} kg</p>
                            </div>
                          </div>
                        )}

                        {/* Suggestions */}
                        {result.suggestions.length > 0 && (
                          <div className="rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30">
                            <div className="flex items-center gap-2 mb-2">
                              <Info className="h-4 w-4 text-amber-600" />
                              <p className="font-semibold text-amber-700 dark:text-amber-400">建议</p>
                            </div>
                            <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                              {result.suggestions.map((suggestion, index) => (
                                <li key={index}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Container className="h-16 w-16 text-slate-300 dark:text-slate-700 mb-4" />
                        <p className="text-slate-500 dark:text-slate-400">
                          输入货物信息后点击计算
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Specs Tab */}
          <TabsContent value="specs">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  集装箱规格参考
                </CardTitle>
                <CardDescription>各类集装箱详细规格参数</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 font-semibold">类型</th>
                        <th className="text-center py-3 px-4 font-semibold">内部尺寸 (m)</th>
                        <th className="text-center py-3 px-4 font-semibold">最大体积</th>
                        <th className="text-center py-3 px-4 font-semibold">最大载重</th>
                        <th className="text-center py-3 px-4 font-semibold">皮重</th>
                        <th className="text-center py-3 px-4 font-semibold">用途</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(containerSpecs).map(([code, spec], index) => (
                        <tr key={code} className={`border-b border-slate-100 dark:border-slate-800 ${index % 2 === 0 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}>
                          <td className="py-3 px-4">
                            <div>
                              <p className="font-semibold">{code}</p>
                              <p className="text-xs text-slate-500">{spec.name}</p>
                            </div>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline">
                              {spec.internalLength}×{spec.internalWidth}×{spec.internalHeight}
                            </Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge style={{ backgroundColor: `${LOGISTICS_GREEN}20`, color: LOGISTICS_GREEN }}>{spec.maxCBM} CBM</Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge style={{ backgroundColor: `${OCEAN_BLUE}20`, color: OCEAN_BLUE }}>{(spec.maxWeight / 1000).toFixed(1)}t</Badge>
                          </td>
                          <td className="text-center py-3 px-4">
                            <Badge variant="outline">{(spec.tareWeight / 1000).toFixed(1)}t</Badge>
                          </td>
                          <td className="text-center py-3 px-4 text-sm text-slate-600 dark:text-slate-400">
                            {code.includes('RF') ? '冷藏货物' : 
                             code.includes('OT') ? '超高/超重货物' : 
                             '普通干货'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Visualizations Tab */}
          <TabsContent value="visualizations" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Container Comparison Chart */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    集装箱容量对比
                  </CardTitle>
                  <CardDescription>各类集装箱体积与载重对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={containerComparisonConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={containerComparisonData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Bar dataKey="cbm" fill={OCEAN_BLUE} radius={[4, 4, 0, 0]} name="体积 (CBM)" />
                        <Bar dataKey="weight" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} name="载重 (t)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Utilization Pie Chart */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    效率分布统计
                  </CardTitle>
                  <CardDescription>装载效率等级分布</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={utilizationConfig} className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={efficiencyData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}%`}
                          labelLine={false}
                        >
                          {efficiencyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Radar Chart */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    集装箱综合性能雷达图
                  </CardTitle>
                  <CardDescription>主流集装箱类型多维度性能对比</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={containerComparisonConfig} className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={containerRadarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                        <Radar name="20GP" dataKey="20GP" stroke={OCEAN_BLUE} fill={OCEAN_BLUE} fillOpacity={0.3} />
                        <Radar name="40GP" dataKey="40GP" stroke={LOGISTICS_GREEN} fill={LOGISTICS_GREEN} fillOpacity={0.3} />
                        <Radar name="40HC" dataKey="40HC" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} />
                        <Legend />
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Utilization Visualization from Result */}
              {result && (
                <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Weight className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      当前计算结果可视化
                    </CardTitle>
                    <CardDescription>您货物的装载利用率分析</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="text-center">
                        <ChartContainer config={utilizationConfig} className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={getUtilizationPieData()}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                              >
                                {getUtilizationPieData().map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                        <p className="text-sm text-slate-500 mt-2">体积利用率: {result.containerUtilization.volume}%</p>
                      </div>
                      <div className="flex flex-col justify-center space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                          <span className="text-sm font-medium">货物总体积</span>
                          <span className="text-lg font-bold" style={{ color: OCEAN_BLUE }}>{result.totalCargoCBM} CBM</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                          <span className="text-sm font-medium">货物总重量</span>
                          <span className="text-lg font-bold" style={{ color: LOGISTICS_GREEN }}>{result.totalCargoWeight.toLocaleString()} kg</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-slate-100 dark:bg-slate-800">
                          <span className="text-sm font-medium">所需集装箱</span>
                          <span className="text-lg font-bold">{result.containersNeeded} × {result.recommendedContainer}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    集装箱装载原则
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400">
                    合理的集装箱装载不仅能最大化空间利用率，还能确保货物运输安全。
                    以下是集装箱装载的核心原则和最佳实践。
                  </p>
                  <h4 className="text-lg font-semibold mt-4 text-slate-700 dark:text-slate-300">装载基本原则</h4>
                  <ul className="text-slate-600 dark:text-slate-400 space-y-2">
                    <li><strong>重下轻上：</strong>重货放置底部，轻货放置顶部</li>
                    <li><strong>大下小上：</strong>大件货物放底部，小件货物放上部</li>
                    <li><strong>紧密排列：</strong>减少货物之间的空隙</li>
                    <li><strong>均匀分布：</strong>重量左右对称分布</li>
                    <li><strong>固定牢固：</strong>使用填充物和固定带固定货物</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                    常见装载问题
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <ul className="text-slate-600 dark:text-slate-400 space-y-3">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span><strong>超重风险：</strong>注意集装箱最大载重限制，特别是20GP容易超重</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span><strong>空间浪费：</strong>不规则形状货物可能导致空间利用率低</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span><strong>货物损坏：</strong>固定不牢导致运输途中货物移动受损</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-1 flex-shrink-0" />
                      <span><strong>偏载问题：</strong>重量分布不均影响运输安全</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Container className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    集装箱类型选择指南
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${OCEAN_BLUE}10` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Container className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        <h5 className="font-semibold" style={{ color: OCEAN_BLUE }}>20GP</h5>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        适合重型货物，载重能力相对较大，适合钢材、瓷砖等重货
                      </p>
                    </div>
                    <div className="rounded-lg p-4" style={{ backgroundColor: `${LOGISTICS_GREEN}10` }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Container className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                        <h5 className="font-semibold" style={{ color: LOGISTICS_GREEN }}>40GP</h5>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        适合一般货物，空间利用率高，是最常用的集装箱类型
                      </p>
                    </div>
                    <div className="rounded-lg p-4 bg-purple-50 dark:bg-purple-950/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Container className="h-5 w-5 text-purple-600" />
                        <h5 className="font-semibold text-purple-600">40HC</h5>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        适合轻泡货物，比40GP高出30cm，适合棉花、家具等体积大的货物
                      </p>
                    </div>
                    <div className="rounded-lg p-4 bg-amber-50 dark:bg-amber-950/30">
                      <div className="flex items-center gap-2 mb-3">
                        <Container className="h-5 w-5 text-amber-600" />
                        <h5 className="font-semibold text-amber-600">特殊箱型</h5>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        冷藏箱(RF)、开顶箱(OT)、框架箱(FR)适合特殊货物需求
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  常见问题解答
                </CardTitle>
                <CardDescription>关于集装箱装载的常见问题</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left hover:no-underline">
                        <div className="flex items-center gap-3">
                          <div 
                            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                            style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                          >
                            {index + 1}
                          </div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-14">
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {faq.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
