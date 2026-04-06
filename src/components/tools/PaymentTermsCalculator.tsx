'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calculator,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  Clock,
  Building,
  Percent,
  CreditCard,
  BarChart3,
  PieChart,
  HelpCircle,
  Shield,
  Zap,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Info,
  Globe,
  FileText,
  Landmark,
  Wallet,
  ArrowDownCircle,
  Sparkles,
  Download,
  Share2,
  BookOpen,
  Target,
  Lightbulb,
  AlertCircle,
  Users,
  Handshake,
  Scale,
  FileCheck,
  XCircle,
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
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart as RechartsPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, LineChart, Line, Area, AreaChart, Tooltip } from 'recharts';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface PaymentSchedule {
  installment: number;
  description: string;
  amount: number;
  percentage: number;
  dueDate: string;
  daysFromStart: number;
}

interface PaymentResult {
  totalAmount: number;
  financingCost: number;
  effectiveRate: number;
  schedule: PaymentSchedule[];
  cashFlowAnalysis: {
    upfrontPayment: number;
    deferredPayment: number;
    averagePaymentDays: number;
  };
  comparison: {
    method: string;
    totalCost: number;
    financingCost: number;
    riskLevel: string;
  }[];
  recommendations: string[];
}

const paymentTermsOptions = [
  { value: 'advance', label: 'T/T in Advance (100%)', deposit: 100 },
  { value: '30-70', label: '30% Deposit, 70% Before Shipment', deposit: 30 },
  { value: '30-70-arrival', label: '30% Deposit, 70% on Arrival', deposit: 30 },
  { value: 'lc-sight', label: 'L/C at Sight', deposit: 0 },
  { value: 'lc-30', label: 'L/C 30 Days', deposit: 0 },
  { value: 'lc-60', label: 'L/C 60 Days', deposit: 0 },
  { value: 'oa-30', label: 'Open Account 30 Days', deposit: 0 },
  { value: 'oa-60', label: 'Open Account 60 Days', deposit: 0 },
  { value: 'dp-sight', label: 'D/P at Sight', deposit: 0 },
  { value: 'da-30', label: 'D/A 30 Days', deposit: 0 },
];

const bankRates = {
  'lc-issuance': 0.15,
  'lc-confirmation': 0.2,
  'lc-amendment': 50,
  'tt-fee': 25,
  'interest-rate': 6,
};

// Brand Colors
const OCEAN_BLUE = '#0F4C81';
const LOGISTICS_GREEN = '#2E8B57';

// Chart colors
const CHART_COLORS = [OCEAN_BLUE, LOGISTICS_GREEN, '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];

// Comprehensive FAQ data with 150+ words each
const faqData = [
  {
    question: 'What are the key differences between T/T in Advance and Open Account payment terms?',
    answer: 'T/T in Advance (Telegraphic Transfer) and Open Account represent opposite ends of the payment risk spectrum in international trade. With T/T in Advance, the buyer transfers the full payment to the seller before any goods are shipped, placing all the risk on the buyer. This method provides maximum security for sellers as they receive guaranteed funds upfront, eliminating concerns about non-payment. However, it can be a significant barrier for buyers who must trust the seller to deliver quality goods on time without any leverage. Open Account operates in the complete opposite manner, where the seller ships goods and extends credit to the buyer, allowing payment at a later date (typically 30, 60, or 90 days after shipment or arrival). This arrangement shifts all risk to the seller, who must trust that the buyer will honor the payment commitment. Open Account terms are typically reserved for established, trusted business relationships with proven payment histories. The choice between these methods often depends on market conditions, competitive pressures, and the relative bargaining power of the parties involved. In highly competitive markets, sellers may offer Open Account terms to win business, while in seller-favorable markets, T/T in Advance may be more readily accepted.',
  },
  {
    question: 'How do Letters of Credit (L/C) protect both buyers and sellers in international trade?',
    answer: 'Letters of Credit provide a balanced framework for managing payment risk in international trade by involving banks as trusted intermediaries. For sellers, an L/C offers assurance that payment will be made by the bank upon presentation of compliant shipping documents, regardless of the buyers financial situation or willingness to pay. This bank guarantee significantly reduces the credit risk that sellers face when dealing with unknown or distant buyers. The seller knows that as long as they meet all documentary requirements specified in the L/C, they will receive payment. For buyers, L/Cs ensure that payment is only released when the seller has fulfilled their obligations as evidenced by the required documents. Buyers can specify exactly what documents they need (commercial invoice, bill of lading, inspection certificates, etc.) and set conditions that must be met before payment. This creates accountability for the seller and provides buyers with documentary proof that goods have been shipped according to contract terms. However, L/Cs require careful attention to document preparation, as even minor discrepancies can result in payment delays or refusals. Both parties should understand that L/C transactions are document-based rather than goods-based, meaning banks deal in documents, not the actual quality or condition of the goods shipped.',
  },
  {
    question: 'What factors should businesses consider when negotiating payment terms with international trading partners?',
    answer: 'Negotiating payment terms in international trade requires careful consideration of multiple interconnected factors that balance risk management with business development objectives. First, the transaction value plays a crucial role - larger orders warrant more secure payment methods like L/C to protect both parties significant investments. Second, the relationship history matters enormously; new trading partners typically start with more conservative terms, while established relationships with proven track records can justify more flexible arrangements. Third, market conditions and competitive landscape influence what terms are acceptable - in buyers markets, sellers may need to offer favorable terms to remain competitive. Fourth, the buyers creditworthiness and financial stability should be thoroughly assessed through credit reports, financial statements, and trade references. Fifth, the sellers cash flow requirements and financing costs must be factored in, as longer payment terms tie up working capital. Sixth, industry norms and practices should be considered, as deviating too far from standard terms can affect competitiveness. Seventh, the regulatory environment in both countries, including currency controls and import/export restrictions, may limit available options. Eighth, the nature of the goods - whether they are custom-made or readily resalable - affects the risk profile. Ninth, the shipping route and transit times influence when payment milestones should occur. Finally, the cost of various payment methods, including bank fees for L/Cs or the opportunity cost of capital tied up in extended credit terms, should be calculated and compared.',
  },
  {
    question: 'What are the most common mistakes businesses make when choosing payment terms?',
    answer: 'Businesses frequently make several critical errors when selecting payment terms that can lead to financial losses, damaged relationships, or missed opportunities. One of the most common mistakes is failing to assess the creditworthiness of new trading partners before extending favorable payment terms. Many sellers, eager to secure new business, offer Open Account or extended credit terms without conducting proper due diligence, only to face payment defaults later. Another frequent error is not properly calculating the true cost of deferred payment terms, including the opportunity cost of capital tied up and the risk premium that should be charged. Sellers often underestimate these costs and end up eroding their profit margins. A third mistake is using a one-size-fits-all approach rather than tailoring terms to each customer and transaction. Different customers, markets, and products may require different risk management strategies. Fourth, many businesses fail to regularly review and adjust payment terms as relationships evolve or circumstances change. A customer who was once high-risk may have improved their financial position, while a previously reliable customer may be experiencing difficulties. Fifth, inadequate documentation of payment terms in contracts leads to misunderstandings and disputes. Clear, written agreements specifying exactly when payment is due, what constitutes acceptance, and remedies for non-payment are essential. Sixth, overlooking currency risk when dealing in foreign currencies can result in significant losses due to exchange rate movements between order placement and payment receipt.',
  },
  {
    question: 'How can businesses effectively manage cash flow when using deferred payment terms?',
    answer: 'Managing cash flow effectively with deferred payment terms requires a comprehensive strategy that addresses both the timing and certainty of incoming payments. Businesses should start by conducting thorough cash flow forecasting that maps expected payment receipts against operational expenses and other cash outflows. This forecasting should account for the full payment cycle, including production lead times, shipping durations, and credit periods. Maintaining adequate working capital reserves is essential - businesses should have sufficient cash buffers to cover operations during the gap between paying suppliers and receiving customer payments. Invoice financing and factoring can be valuable tools to bridge cash flow gaps, allowing businesses to receive immediate payment (minus fees) for outstanding invoices. Negotiating favorable terms with suppliers, such as extended payment periods or early payment discounts, can help align outgoing and incoming cash flows. Diversifying the customer base and payment term mix reduces concentration risk - if most customers are on 60-day terms, having some on shorter terms or advance payment helps maintain steady cash flow. Implementing efficient invoicing processes ensures invoices are sent promptly and accurately, avoiding delays that extend the effective credit period. Following up proactively on approaching due dates helps prevent late payments. Building strong banking relationships provides access to credit facilities that can be used to manage temporary cash flow shortfalls. Finally, businesses should regularly review and optimize their payment terms strategy based on actual payment patterns and changing business needs.',
  },
  {
    question: 'What are the key differences between D/P (Documents against Payment) and D/A (Documents against Acceptance) terms?',
    answer: 'D/P (Documents against Payment) and D/A (Documents against Acceptance) are documentary collection methods that differ fundamentally in when the buyer gains access to shipping documents and therefore possession of the goods. Under D/P terms, the buyer must pay the full amount to their bank before receiving the original shipping documents needed to claim the goods from the carrier. This provides significant protection for the seller, as the buyer cannot take possession of the goods without first making payment. The seller retains control and can redirect goods to another buyer if payment is refused, though this may involve additional costs. D/A terms, on the other hand, allow the buyer to receive the documents upon accepting a time draft (essentially signing a promise to pay at a future date), rather than making immediate payment. This gives the buyer access to the goods before paying, shifting significant risk to the seller. D/A is essentially a form of seller-financed credit, where the seller extends credit to the buyer for the draft period (typically 30, 60, or 90 days). The sellers bank holds the accepted draft and presents it for payment when due. If the buyer fails to honor the accepted draft, the sellers recourse is legal action rather than simply reclaiming the goods, as the buyer already has possession. D/P is more appropriate for new customer relationships or higher-risk transactions, while D/A may be used for established customers with proven creditworthiness.',
  },
  {
    question: 'How do international payment terms impact supply chain relationships and negotiations?',
    answer: 'Payment terms significantly influence the dynamics of supply chain relationships and serve as a critical negotiating point that reflects the balance of power between buyers and sellers. Favorable payment terms can be a competitive advantage - sellers offering Open Account or extended credit terms may win business over competitors requiring advance payment. However, these terms must be priced appropriately to cover the associated risks and costs. The negotiation of payment terms often reflects the relative market power of the parties; in buyer-favorable markets, purchasers may demand extended terms, while in seller-favorable markets, suppliers may insist on advance payment. Payment terms also signal trust and commitment in the relationship. As relationships develop and trust builds, parties typically progress toward more favorable terms for the buyer. However, this progression should be based on demonstrated payment performance, not just time. The length of payment terms affects the entire supply chain, as each participant must manage their own cash flow while potentially offering terms to their customers. Long payment cycles can create working capital challenges throughout the chain, potentially affecting smaller suppliers disproportionately. Some buyers use payment terms strategically to optimize their own working capital, extending terms to suppliers while requiring prompt payment from customers. This practice can strain supplier relationships and may lead to supply disruptions if suppliers face cash flow difficulties. Transparent communication about payment expectations and mutual understanding of each partys constraints helps build sustainable supply chain partnerships.',
  },
  {
    question: 'What insurance and risk mitigation options are available for international payment risks?',
    answer: 'Businesses engaged in international trade have access to various insurance and risk mitigation tools that can protect against payment defaults and other trade-related risks. Export credit insurance is one of the most important options, covering sellers against the risk of buyer non-payment due to commercial risks (buyer insolvency or protracted default) and political risks (war, currency inconvertibility, import restrictions). Government-sponsored export credit agencies in many countries offer such coverage, often at competitive rates. Trade credit insurance from private insurers provides similar protection and can cover single buyers or entire portfolios of customers. Letters of Credit themselves serve as risk mitigation tools, replacing buyer credit risk with bank risk, which is typically more reliable. Bank guarantees and standby L/Cs can provide additional security, ensuring payment if the buyer defaults. Forfaiting allows exporters to sell their medium-term receivables at a discount, transferring both credit risk and collection responsibility to the forfaiter. Factoring companies purchase accounts receivable and assume credit risk, providing immediate payment to sellers (minus fees) and taking responsibility for collection. Political risk insurance protects against losses from government actions, war, or civil unrest in the buyers country. Currency hedging instruments like forward contracts and options protect against exchange rate fluctuations between order date and payment date. Credit investigation services and trade reference networks help assess buyer creditworthiness before extending terms. A comprehensive risk management approach typically combines several of these tools, tailored to the specific risks and transaction characteristics.',
  },
];

// Pro Tips Data
const proTips = [
  {
    icon: Target,
    title: 'Start Conservative, Build Trust',
    description: 'Begin new trading relationships with secure payment terms like T/T or L/C, then gradually offer more favorable terms as the partner demonstrates reliability over multiple transactions. This approach balances risk management with relationship development.',
    color: OCEAN_BLUE,
  },
  {
    icon: Calculator,
    title: 'Calculate True Cost of Credit',
    description: 'Always factor in the opportunity cost of deferred payment terms. Calculate the effective annual cost using your cost of capital - a 60-day credit period at 8% cost of capital adds approximately 1.3% to your real cost, which should be reflected in pricing.',
    color: LOGISTICS_GREEN,
  },
  {
    icon: Shield,
    title: 'Use L/C for High-Value Orders',
    description: 'For transactions exceeding $50,000, strongly consider Letters of Credit. The bank fees (typically 0.15-0.25% of value) are a small price for the security of guaranteed payment, especially with new customers or in higher-risk markets.',
    color: '#8B5CF6',
  },
  {
    icon: Users,
    title: 'Diversify Payment Term Exposure',
    description: 'Avoid concentrating too much exposure with a single payment term or customer. If most of your receivables are with one customer or due at the same time, a single default could devastate your cash flow. Spread risk across multiple customers and term lengths.',
    color: '#F59E0B',
  },
  {
    icon: FileCheck,
    title: 'Document Everything Precisely',
    description: 'Clear documentation prevents disputes. Ensure contracts specify exact payment dates, currencies, bank details, and documentary requirements. For L/C transactions, match documents precisely - even minor discrepancies can delay payment by weeks.',
    color: '#EC4899',
  },
  {
    icon: TrendingUp,
    title: 'Monitor Currency Risk',
    description: 'When dealing in foreign currencies, implement hedging strategies for significant exposures. A 5% adverse currency movement can eliminate profit margins on thin deals. Consider forward contracts to lock in exchange rates for known future payments.',
    color: '#06B6D4',
  },
];

// Common Mistakes Data
const commonMistakes = [
  {
    icon: AlertCircle,
    title: 'Skipping Credit Assessment',
    description: 'One of the most dangerous mistakes is extending favorable payment terms without properly vetting the buyers creditworthiness. Always conduct credit checks, request trade references, and review financial statements before offering Open Account or extended credit terms. The cost of a credit report is negligible compared to the potential loss from a default.',
    color: '#EF4444',
  },
  {
    icon: XCircle,
    title: 'Ignoring L/C Discrepancies',
    description: 'Many exporters lose time and money due to documentation errors in L/C transactions. Common discrepancies include late shipment dates, inconsistent quantities between documents, and missing signatures. Always have documents pre-checked by banking professionals and allow buffer time for corrections before presentation deadlines.',
    color: '#F97316',
  },
  {
    icon: AlertTriangle,
    title: 'Underpricing Credit Terms',
    description: 'Offering extended payment terms without adjusting pricing is essentially providing free financing. Calculate your cost of capital, include it in your pricing, and consider offering discounts for early payment. For example, 2/10 net 30 terms encourage prompt payment while giving buyers flexibility.',
    color: '#EAB308',
  },
  {
    icon: Globe,
    title: 'Overlooking Country Risk',
    description: 'Focusing solely on buyer credit risk while ignoring country risk can lead to losses even with creditworthy customers. Political instability, currency controls, or changes in import regulations can prevent payment regardless of the buyers intentions. Check country risk ratings and consider export credit insurance for higher-risk destinations.',
    color: '#8B5CF6',
  },
  {
    icon: Clock,
    title: 'Poor Cash Flow Planning',
    description: 'Accepting long payment terms without adequate working capital planning can create a cash crunch that threatens business operations. Always model your cash flow including production lead times, shipping durations, and credit periods. Maintain reserves or credit facilities to bridge payment gaps.',
    color: '#06B6D4',
  },
];

// Payment Terms Reference Data
const paymentTermsReference = [
  {
    term: 'T/T in Advance',
    buyerRisk: 'High',
    sellerRisk: 'Lowest',
    typicalUse: 'New relationships, small orders, high-risk markets',
    bankFees: 'Minimal (wire transfer fees only)',
    icon: Wallet,
  },
  {
    term: '30/70 Deposit/Balance',
    buyerRisk: 'Medium',
    sellerRisk: 'Low',
    typicalUse: 'Regular trade, established relationships',
    bankFees: 'Two wire transfers',
    icon: CreditCard,
  },
  {
    term: 'L/C at Sight',
    buyerRisk: 'Low',
    sellerRisk: 'Low',
    typicalUse: 'Large orders, new customers, high-value goods',
    bankFees: '0.15-0.25% issuance fee + confirmation fees',
    icon: Landmark,
  },
  {
    term: 'L/C Usance (30/60/90 days)',
    buyerRisk: 'Low',
    sellerRisk: 'Medium',
    typicalUse: 'When buyer needs time to sell goods before paying',
    bankFees: 'Issuance fee + acceptance fee + interest',
    icon: Landmark,
  },
  {
    term: 'D/P at Sight',
    buyerRisk: 'Low',
    sellerRisk: 'Medium',
    typicalUse: 'Established customers with good payment history',
    bankFees: 'Collection fees (0.1-0.2%)',
    icon: FileText,
  },
  {
    term: 'D/A Terms',
    buyerRisk: 'Low',
    sellerRisk: 'High',
    typicalUse: 'Long-term trusted customers only',
    bankFees: 'Collection fees + acceptance fees',
    icon: FileText,
  },
  {
    term: 'Open Account',
    buyerRisk: 'Lowest',
    sellerRisk: 'High',
    typicalUse: 'Group companies, top-tier customers with excellent credit',
    bankFees: 'None directly, but consider credit insurance cost',
    icon: Globe,
  },
];

export default function PaymentTermsCalculator() {
  const [invoiceAmount, setInvoiceAmount] = useState('100000');
  const [currency, setCurrency] = useState('USD');
  const [paymentTerms, setPaymentTerms] = useState('30-70');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [shipmentDate, setShipmentDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [arrivalDate, setArrivalDate] = useState(new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [annualInterestRate, setAnnualInterestRate] = useState('6');
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [activeTab, setActiveTab] = useState('calculator');
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const calculatePayment = useCallback(() => {
    setIsCalculating(true);
    
    setTimeout(() => {
      const amount = parseFloat(invoiceAmount) || 0;
      const interestRate = parseFloat(annualInterestRate) || 6;
      const start = new Date(startDate);
      const shipment = new Date(shipmentDate);
      const arrival = new Date(arrivalDate);

      let schedule: PaymentSchedule[] = [];
      let financingCost = 0;
      let effectiveRate = 0;
      let upfrontPayment = 0;
      let deferredPayment = 0;

      const daysToShipment = Math.ceil((shipment.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const daysToArrival = Math.ceil((arrival.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

      switch (paymentTerms) {
        case 'advance':
          schedule = [{
            installment: 1,
            description: 'Full Payment',
            amount: amount,
            percentage: 100,
            dueDate: startDate,
            daysFromStart: 0,
          }];
          upfrontPayment = amount;
          break;

        case '30-70':
          schedule = [
            {
              installment: 1,
              description: 'Deposit (30%)',
              amount: amount * 0.3,
              percentage: 30,
              dueDate: startDate,
              daysFromStart: 0,
            },
            {
              installment: 2,
              description: 'Balance Before Shipment (70%)',
              amount: amount * 0.7,
              percentage: 70,
              dueDate: shipmentDate,
              daysFromStart: daysToShipment,
            },
          ];
          upfrontPayment = amount * 0.3;
          deferredPayment = amount * 0.7;
          financingCost = (deferredPayment * (interestRate / 100) * daysToShipment) / 365;
          break;

        case '30-70-arrival':
          schedule = [
            {
              installment: 1,
              description: 'Deposit (30%)',
              amount: amount * 0.3,
              percentage: 30,
              dueDate: startDate,
              daysFromStart: 0,
            },
            {
              installment: 2,
              description: 'Balance on Arrival (70%)',
              amount: amount * 0.7,
              percentage: 70,
              dueDate: arrivalDate,
              daysFromStart: daysToArrival,
            },
          ];
          upfrontPayment = amount * 0.3;
          deferredPayment = amount * 0.7;
          financingCost = (deferredPayment * (interestRate / 100) * daysToArrival) / 365;
          break;

        case 'lc-sight':
          schedule = [{
            installment: 1,
            description: 'L/C Payment at Sight',
            amount: amount,
            percentage: 100,
            dueDate: arrivalDate,
            daysFromStart: daysToArrival,
          }];
          deferredPayment = amount;
          financingCost = amount * bankRates['lc-issuance'] / 100;
          break;

        case 'lc-30': {
          const lc30Days = daysToArrival + 30;
          const lc30Date = new Date(arrival);
          lc30Date.setDate(lc30Date.getDate() + 30);
          schedule = [{
            installment: 1,
            description: 'L/C Payment 30 Days',
            amount: amount,
            percentage: 100,
            dueDate: lc30Date.toISOString().split('T')[0],
            daysFromStart: lc30Days,
          }];
          deferredPayment = amount;
          financingCost = amount * bankRates['lc-issuance'] / 100 + (amount * (interestRate / 100) * 30) / 365;
          break;
        }

        case 'lc-60': {
          const lc60Days = daysToArrival + 60;
          const lc60Date = new Date(arrival);
          lc60Date.setDate(lc60Date.getDate() + 60);
          schedule = [{
            installment: 1,
            description: 'L/C Payment 60 Days',
            amount: amount,
            percentage: 100,
            dueDate: lc60Date.toISOString().split('T')[0],
            daysFromStart: lc60Days,
          }];
          deferredPayment = amount;
          financingCost = amount * bankRates['lc-issuance'] / 100 + (amount * (interestRate / 100) * 60) / 365;
          break;
        }

        case 'oa-30': {
          const oa30Date = new Date(arrival);
          oa30Date.setDate(oa30Date.getDate() + 30);
          schedule = [{
            installment: 1,
            description: 'Open Account Payment 30 Days',
            amount: amount,
            percentage: 100,
            dueDate: oa30Date.toISOString().split('T')[0],
            daysFromStart: daysToArrival + 30,
          }];
          deferredPayment = amount;
          financingCost = (amount * (interestRate / 100) * (daysToArrival + 30)) / 365;
          break;
        }

        case 'oa-60': {
          const oa60Date = new Date(arrival);
          oa60Date.setDate(oa60Date.getDate() + 60);
          schedule = [{
            installment: 1,
            description: 'Open Account Payment 60 Days',
            amount: amount,
            percentage: 100,
            dueDate: oa60Date.toISOString().split('T')[0],
            daysFromStart: daysToArrival + 60,
          }];
          deferredPayment = amount;
          financingCost = (amount * (interestRate / 100) * (daysToArrival + 60)) / 365;
          break;
        }

        case 'dp-sight':
          schedule = [{
            installment: 1,
            description: 'D/P Payment at Sight',
            amount: amount,
            percentage: 100,
            dueDate: arrivalDate,
            daysFromStart: daysToArrival,
          }];
          deferredPayment = amount;
          financingCost = amount * 0.1 / 100;
          break;

        case 'da-30': {
          const da30Date = new Date(arrival);
          da30Date.setDate(da30Date.getDate() + 30);
          schedule = [{
            installment: 1,
            description: 'D/A Payment 30 Days',
            amount: amount,
            percentage: 100,
            dueDate: da30Date.toISOString().split('T')[0],
            daysFromStart: daysToArrival + 30,
          }];
          deferredPayment = amount;
          financingCost = amount * 0.1 / 100 + (amount * (interestRate / 100) * 30) / 365;
          break;
        }
      }

      effectiveRate = amount > 0 ? (financingCost / amount) * 100 : 0;

      const avgDays = schedule.reduce((sum, s) => sum + s.daysFromStart * s.percentage, 0) / 100;

      const comparison: PaymentResult['comparison'] = [];

      comparison.push({
        method: 'T/T in Advance',
        totalCost: amount,
        financingCost: 0,
        riskLevel: 'Lowest buyer risk',
      });

      comparison.push({
        method: '30% Deposit, 70% Before Shipment',
        totalCost: amount + (amount * 0.7 * (interestRate / 100) * daysToShipment) / 365,
        financingCost: (amount * 0.7 * (interestRate / 100) * daysToShipment) / 365,
        riskLevel: 'Balanced risk',
      });

      comparison.push({
        method: 'L/C at Sight',
        totalCost: amount + amount * bankRates['lc-issuance'] / 100,
        financingCost: amount * bankRates['lc-issuance'] / 100,
        riskLevel: 'Bank-guaranteed',
      });

      comparison.push({
        method: 'Open Account 30 Days',
        totalCost: amount + (amount * (interestRate / 100) * (daysToArrival + 30)) / 365,
        financingCost: (amount * (interestRate / 100) * (daysToArrival + 30)) / 365,
        riskLevel: 'Higher seller risk',
      });

      const recommendations: string[] = [];

      if (amount > 50000 && !paymentTerms.includes('lc')) {
        recommendations.push('For high-value transactions, consider L/C for added security');
      }
      if (paymentTerms.includes('oa') && amount > 20000) {
        recommendations.push('Open Account carries credit risk - ensure buyer creditworthiness');
      }
      if (financingCost > amount * 0.02) {
        recommendations.push('Financing cost exceeds 2% - consider negotiating better terms');
      }
      if (paymentTerms === 'advance' && amount > 30000) {
        recommendations.push('Full advance payment on large orders may be difficult for buyers');
      }

      setResult({
        totalAmount: amount,
        financingCost: Math.round(financingCost * 100) / 100,
        effectiveRate: Math.round(effectiveRate * 100) / 100,
        schedule,
        cashFlowAnalysis: {
          upfrontPayment: Math.round(upfrontPayment * 100) / 100,
          deferredPayment: Math.round(deferredPayment * 100) / 100,
          averagePaymentDays: Math.round(avgDays),
        },
        comparison,
        recommendations,
      });
      
      setIsCalculating(false);
    }, 300);
  }, [invoiceAmount, annualInterestRate, startDate, shipmentDate, arrivalDate, paymentTerms]);

  useEffect(() => {
    calculatePayment();
  }, []);

  const resetForm = () => {
    setInvoiceAmount('100000');
    setPaymentTerms('30-70');
    setAnnualInterestRate('6');
    setResult(null);
    calculatePayment();
  };

  const exportResults = () => {
    if (!result) return;
    
    const exportData = {
      calculationDate: new Date().toISOString(),
      inputs: {
        invoiceAmount,
        currency,
        paymentTerms,
        startDate,
        shipmentDate,
        arrivalDate,
        annualInterestRate,
      },
      results: result,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-terms-calculation-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Export Successful',
      description: 'Your calculation has been downloaded as a JSON file.',
    });
  };

  const shareResults = async () => {
    if (!result) return;
    
    const shareText = `Payment Terms Calculation
Invoice Amount: ${currency} ${result.totalAmount.toLocaleString()}
Financing Cost: ${currency} ${result.financingCost.toLocaleString()} (${result.effectiveRate}%)
Average Payment Days: ${result.cashFlowAnalysis.averagePaymentDays} days
Payment Terms: ${paymentTermsOptions.find(t => t.value === paymentTerms)?.label || paymentTerms}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Payment Terms Calculation',
          text: shareText,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({
        title: 'Copied to Clipboard',
        description: 'Calculation summary has been copied to your clipboard.',
      });
    }
  };

  // Prepare chart data
  const paymentPieData = result?.schedule.map((item) => ({
    name: item.description,
    value: item.amount,
    percentage: item.percentage,
  })) || [];

  const comparisonBarData = result?.comparison.map((item) => ({
    name: item.method.length > 20 ? item.method.substring(0, 20) + '...' : item.method,
    totalCost: item.totalCost,
    financingCost: item.financingCost,
    invoiceAmount: result.totalAmount,
  })) || [];

  const cashFlowData = result ? [
    { name: 'Upfront Payment', value: result.cashFlowAnalysis.upfrontPayment, color: OCEAN_BLUE },
    { name: 'Deferred Payment', value: result.cashFlowAnalysis.deferredPayment, color: LOGISTICS_GREEN },
  ] : [];

  // Cash flow timeline data for line chart
  const cashFlowTimelineData = result ? [
    { day: 0, cumulative: result.cashFlowAnalysis.upfrontPayment, label: 'Start' },
    { day: Math.round(result.cashFlowAnalysis.averagePaymentDays * 0.25), cumulative: result.cashFlowAnalysis.upfrontPayment + result.cashFlowAnalysis.deferredPayment * 0.25, label: 'Week 1' },
    { day: Math.round(result.cashFlowAnalysis.averagePaymentDays * 0.5), cumulative: result.cashFlowAnalysis.upfrontPayment + result.cashFlowAnalysis.deferredPayment * 0.5, label: 'Week 2' },
    { day: Math.round(result.cashFlowAnalysis.averagePaymentDays * 0.75), cumulative: result.cashFlowAnalysis.upfrontPayment + result.cashFlowAnalysis.deferredPayment * 0.75, label: 'Week 3' },
    { day: result.cashFlowAnalysis.averagePaymentDays, cumulative: result.totalAmount, label: 'Complete' },
  ] : [];

  // Terms comparison bar chart data
  const termsComparisonData = paymentTermsReference.map((term) => ({
    name: term.term,
    buyerRisk: term.buyerRisk === 'Highest' ? 5 : term.buyerRisk === 'High' ? 4 : term.buyerRisk === 'Medium' ? 3 : term.buyerRisk === 'Low' ? 2 : 1,
    sellerRisk: term.sellerRisk === 'Highest' ? 5 : term.sellerRisk === 'High' ? 4 : term.sellerRisk === 'Medium' ? 3 : term.sellerRisk === 'Low' ? 2 : 1,
  }));

  const chartConfig = {
    totalCost: { label: 'Total Cost', color: OCEAN_BLUE },
    financingCost: { label: 'Financing Cost', color: LOGISTICS_GREEN },
    invoiceAmount: { label: 'Invoice Amount', color: '#8B5CF6' },
    upfrontPayment: { label: 'Upfront Payment', color: OCEAN_BLUE },
    deferredPayment: { label: 'Deferred Payment', color: LOGISTICS_GREEN },
    buyerRisk: { label: 'Buyer Risk', color: '#EF4444' },
    sellerRisk: { label: 'Seller Risk', color: LOGISTICS_GREEN },
    cumulative: { label: 'Cumulative Payment', color: OCEAN_BLUE },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--ocean)]/5 via-background to-[var(--logistics)]/5 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Floating particles */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full opacity-20"
              style={{
                background: i % 2 === 0 ? OCEAN_BLUE : LOGISTICS_GREEN,
                left: `${(i * 73) % 100}%`,
                top: `${(i * 47) % 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3 + (i % 5),
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
          
          {/* Gradient orbs */}
          <motion.div
            className="absolute -top-40 -right-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${OCEAN_BLUE} 0%, transparent 70%)` }}
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20"
            style={{ background: `radial-gradient(circle, ${LOGISTICS_GREEN} 0%, transparent 70%)` }}
            animate={{ scale: [1.1, 1, 1.1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Animated Badges */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {[
                { text: 'Trade Finance', color: OCEAN_BLUE },
                { text: 'Payment Terms', color: LOGISTICS_GREEN },
                { text: 'Cash Flow', color: '#8B5CF6' },
              ].map((badge, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm"
                  style={{ 
                    background: `linear-gradient(135deg, ${badge.color}15, ${badge.color}05)`,
                    borderColor: `${badge.color}30`,
                  }}
                >
                  <Sparkles className="h-3.5 w-3.5" style={{ color: badge.color }} />
                  <span className="text-sm font-medium" style={{ color: badge.color }}>{badge.text}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
              className="flex justify-center mb-6"
            >
              <div
                className="p-5 rounded-3xl shadow-2xl relative"
                style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
              >
                <CreditCard className="h-12 w-12 text-white relative z-10" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            >
              <span style={{ color: OCEAN_BLUE }}>Payment Terms</span>
              <span className="block mt-2" style={{ color: LOGISTICS_GREEN }}>Calculator</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Analyze different payment methods, calculate financing costs, compare terms, 
              and optimize your international trade cash flow with our comprehensive tool.
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap justify-center gap-3"
            >
              <Button
                size="lg"
                variant="outline"
                onClick={resetForm}
                className="gap-2 h-11"
              >
                <RefreshCw className="h-4 w-4" />
                Reset
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={exportResults}
                disabled={!result}
                className="gap-2 h-11"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={shareResults}
                disabled={!result}
                className="gap-2 h-11"
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
              <Button
                size="lg"
                className="gap-2 shadow-xl h-11"
                style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Calculating
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div id="calculator-section" className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* 5 Tabs */}
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-5 w-full max-w-3xl h-12">
              <TabsTrigger value="calculator" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <Calculator className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">Calculator</span>
              </TabsTrigger>
              <TabsTrigger value="analysis" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <TrendingUp className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="terms" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <FileText className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">Terms</span>
              </TabsTrigger>
              <TabsTrigger value="guide" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <BookOpen className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">Guide</span>
              </TabsTrigger>
              <TabsTrigger value="faq" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white">
                <HelpCircle className="h-4 w-4 hidden sm:block" />
                <span className="text-sm">FAQ</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab 1: Calculator */}
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
                      <DollarSign className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                      Transaction Parameters
                    </CardTitle>
                    <CardDescription>Enter invoice amount and payment terms</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="invoiceAmount">Invoice Amount</Label>
                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                              {currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'CNY' ? '¥' : '$'}
                            </span>
                            <Input
                              id="invoiceAmount"
                              type="number"
                              value={invoiceAmount}
                              onChange={(e) => setInvoiceAmount(e.target.value)}
                              className="pl-8"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Currency</Label>
                          <Select value={currency} onValueChange={setCurrency}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="CNY">CNY</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Terms</Label>
                        <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {paymentTermsOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Separator />

                    {/* Dates */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Calendar className="h-4 w-4" style={{ color: LOGISTICS_GREEN }} />
                        Key Dates
                      </h4>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-xs">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="shipmentDate" className="text-xs">Shipment Date</Label>
                          <Input
                            id="shipmentDate"
                            type="date"
                            value={shipmentDate}
                            onChange={(e) => setShipmentDate(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arrivalDate" className="text-xs">Arrival Date</Label>
                          <Input
                            id="arrivalDate"
                            type="date"
                            value={arrivalDate}
                            onChange={(e) => setArrivalDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Financial Parameters */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Percent className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                        Financial Parameters
                      </h4>

                      <div className="space-y-2">
                        <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                        <Input
                          id="interestRate"
                          type="number"
                          value={annualInterestRate}
                          onChange={(e) => setAnnualInterestRate(e.target.value)}
                        />
                        <p className="text-xs text-slate-500">Used to calculate financing cost for deferred payments</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={calculatePayment}
                        disabled={isCalculating}
                        className="flex-1 h-12"
                        style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                      >
                        {isCalculating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            <RefreshCw className="h-4 w-4 mr-2" />
                          </motion.div>
                        ) : (
                          <Calculator className="h-4 w-4 mr-2" />
                        )}
                        Calculate Payment Plan
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="h-12 w-12">
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
                      <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                      Payment Analysis
                    </CardTitle>
                    <CardDescription>Payment schedule and cost analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnimatePresence mode="wait">
                      {result ? (
                        <motion.div
                          key="results"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="space-y-6"
                        >
                          {/* Cost Summary */}
                          <div className="grid grid-cols-2 gap-4">
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              className="rounded-2xl p-5 text-white text-center shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${OCEAN_BLUE}cc)` }}
                            >
                              <p className="text-sm opacity-90 mb-2">Invoice Amount</p>
                              <p className="text-3xl font-bold">${result.totalAmount.toLocaleString()}</p>
                            </motion.div>
                            <motion.div
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.2 }}
                              className="rounded-2xl p-5 text-white text-center shadow-lg"
                              style={{ background: `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${LOGISTICS_GREEN}cc)` }}
                            >
                              <p className="text-sm opacity-90 mb-2">Financing Cost</p>
                              <p className="text-3xl font-bold">${result.financingCost.toLocaleString()}</p>
                              <p className="text-xs opacity-75 mt-1">({result.effectiveRate}%)</p>
                            </motion.div>
                          </div>

                          {/* Payment Schedule */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Payment Schedule</h4>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                              {result.schedule.map((item, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: 0.3 + index * 0.1 }}
                                  className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-700"
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                                        {item.installment}
                                      </Badge>
                                      <span className="font-medium">{item.description}</span>
                                    </div>
                                    <Badge style={{ backgroundColor: OCEAN_BLUE }} className="text-white">
                                      ${item.amount.toLocaleString()}
                                    </Badge>
                                  </div>
                                  <div className="flex justify-between text-sm text-slate-500">
                                    <span>Percentage: {item.percentage}%</span>
                                    <span>Date: {item.dueDate}</span>
                                  </div>
                                  <Progress value={item.percentage} className="mt-2 h-1.5" />
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Cash Flow Analysis */}
                          <div className="space-y-3">
                            <h4 className="font-semibold text-slate-700 dark:text-slate-300">Cash Flow Analysis</h4>
                            <div className="grid grid-cols-3 gap-3">
                              {[
                                { label: 'Upfront Payment', value: `$${result.cashFlowAnalysis.upfrontPayment.toLocaleString()}`, color: OCEAN_BLUE, icon: Wallet },
                                { label: 'Deferred Payment', value: `$${result.cashFlowAnalysis.deferredPayment.toLocaleString()}`, color: LOGISTICS_GREEN, icon: ArrowDownCircle },
                                { label: 'Avg Payment Days', value: `${result.cashFlowAnalysis.averagePaymentDays} days`, color: '#8B5CF6', icon: Clock },
                              ].map((item, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.5 + index * 0.1 }}
                                  className="rounded-xl p-4 text-center border"
                                  style={{ backgroundColor: `${item.color}10`, borderColor: `${item.color}20` }}
                                >
                                  <item.icon className="h-4 w-4 mx-auto mb-1" style={{ color: item.color }} />
                                  <p className="text-xs text-slate-500 mb-1">{item.label}</p>
                                  <p className="font-semibold text-lg" style={{ color: item.color }}>{item.value}</p>
                                </motion.div>
                              ))}
                            </div>
                          </div>

                          {/* Recommendations */}
                          {result.recommendations.length > 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                              className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border border-amber-200 dark:border-amber-800"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className="h-4 w-4 text-amber-600" />
                                <p className="font-semibold text-amber-700 dark:text-amber-400">Recommendations</p>
                              </div>
                              <ul className="text-sm text-amber-600 dark:text-amber-400 space-y-1">
                                {result.recommendations.map((rec, index) => (
                                  <li key={index} className="flex items-start gap-2">
                                    <Info className="h-3 w-3 mt-1 flex-shrink-0" />
                                    <span>{rec}</span>
                                  </li>
                                ))}
                              </ul>
                            </motion.div>
                          )}
                        </motion.div>
                      ) : (
                        <motion.div
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="flex flex-col items-center justify-center py-16 text-center"
                        >
                          <div
                            className="p-6 rounded-2xl mb-4"
                            style={{ backgroundColor: `${OCEAN_BLUE}10` }}
                          >
                            <CreditCard className="h-12 w-12" style={{ color: OCEAN_BLUE }} />
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 mb-4">
                            Enter parameters and click calculate button
                          </p>
                          <Button
                            variant="outline"
                            onClick={calculatePayment}
                            className="gap-2"
                          >
                            <Calculator className="h-4 w-4" />
                            Calculate Now
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          {/* Tab 2: Analysis - Cash Flow Impact */}
          <TabsContent value="analysis" className="space-y-6">
            {!result ? (
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardContent className="py-20 text-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="p-6 rounded-2xl inline-block mb-4"
                    style={{ backgroundColor: `${OCEAN_BLUE}10` }}
                  >
                    <TrendingUp className="h-16 w-16" style={{ color: OCEAN_BLUE }} />
                  </motion.div>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
                    Please calculate a payment plan first to see the analysis.
                  </p>
                  <Button
                    size="lg"
                    onClick={() => setActiveTab('calculator')}
                    className="gap-2"
                    style={{ background: `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` }}
                  >
                    <Calculator className="h-5 w-5" />
                    Go to Calculator
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {/* Payment Breakdown Pie Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Payment Breakdown
                      </CardTitle>
                      <CardDescription>Distribution of payment amounts</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={paymentPieData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ percentage }) => `${percentage}%`}
                            >
                              {paymentPieData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Cash Flow Distribution */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                        Cash Flow Distribution
                      </CardTitle>
                      <CardDescription>Upfront vs deferred payment breakdown</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={cashFlowData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={100}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ value }) => `$${(value as number).toLocaleString()}`}
                            >
                              {cashFlowData.map((entry) => (
                                <Cell key={entry.name} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Cash Flow Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="md:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                        Cash Flow Timeline
                      </CardTitle>
                      <CardDescription>Cumulative payment received over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={cashFlowTimelineData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis dataKey="label" tick={{ fill: 'var(--muted-foreground)' }} />
                            <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} tick={{ fill: 'var(--muted-foreground)' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'var(--background)', 
                                border: '1px solid var(--border)',
                                borderRadius: '8px'
                              }} 
                            />
                            <Line 
                              type="monotone" 
                              dataKey="cumulative" 
                              name="Cumulative Payment" 
                              stroke={OCEAN_BLUE} 
                              strokeWidth={3} 
                              dot={{ fill: OCEAN_BLUE, strokeWidth: 2, r: 6 }} 
                              activeDot={{ r: 8 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Terms Comparison Bar Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="md:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                        Payment Method Cost Comparison
                      </CardTitle>
                      <CardDescription>Compare total costs across different payment methods</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={comparisonBarData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                            <XAxis type="number" tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} tick={{ fill: 'var(--muted-foreground)' }} />
                            <YAxis type="category" dataKey="name" width={180} tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: 'var(--background)', 
                                border: '1px solid var(--border)',
                                borderRadius: '8px'
                              }} 
                            />
                            <Legend />
                            <Bar dataKey="invoiceAmount" name="Invoice Amount" fill={CHART_COLORS[2]} radius={[0, 4, 4, 0]} />
                            <Bar dataKey="financingCost" name="Financing Cost" fill={LOGISTICS_GREEN} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Key Metrics Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="md:col-span-2"
                >
                  <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle>Key Financial Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'Total Amount', value: `$${result.totalAmount.toLocaleString()}`, color: OCEAN_BLUE },
                          { label: 'Financing Cost', value: `$${result.financingCost.toLocaleString()}`, color: LOGISTICS_GREEN },
                          { label: 'Effective Rate', value: `${result.effectiveRate}%`, color: '#8B5CF6' },
                          { label: 'Avg Payment Days', value: `${result.cashFlowAnalysis.averagePaymentDays} days`, color: '#F59E0B' },
                        ].map((metric, index) => (
                          <motion.div
                            key={index}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="text-center p-6 rounded-xl border"
                            style={{ backgroundColor: `${metric.color}10`, borderColor: `${metric.color}20` }}
                          >
                            <p className="text-sm text-slate-500 mb-2">{metric.label}</p>
                            <p className="text-3xl font-bold" style={{ color: metric.color }}>{metric.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </TabsContent>

          {/* Tab 3: Terms - Different Payment Terms Explained */}
          <TabsContent value="terms" className="space-y-6">
            {/* Terms Comparison Table */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Payment Terms Comparison
                </CardTitle>
                <CardDescription>Comprehensive analysis of various payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-slate-200 dark:border-slate-700">
                        <th className="text-left py-4 px-4 font-semibold">Payment Method</th>
                        <th className="text-center py-4 px-4 font-semibold">Buyer Risk</th>
                        <th className="text-center py-4 px-4 font-semibold">Seller Risk</th>
                        <th className="text-left py-4 px-4 font-semibold">Typical Use</th>
                        <th className="text-left py-4 px-4 font-semibold">Bank Fees</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentTermsReference.map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className={`border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${index % 2 === 1 ? 'bg-slate-50/50 dark:bg-slate-800/30' : ''}`}
                        >
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="p-2 rounded-lg"
                                style={{ backgroundColor: `${OCEAN_BLUE}10` }}
                              >
                                <row.icon className="h-4 w-4" style={{ color: OCEAN_BLUE }} />
                              </div>
                              <span className="font-medium">{row.term}</span>
                            </div>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className={`${row.buyerRisk === 'High' ? 'bg-red-500' : row.buyerRisk === 'Medium' ? 'bg-amber-500' : row.buyerRisk === 'Highest' ? 'bg-red-600' : row.buyerRisk === 'Lowest' ? 'bg-emerald-500' : 'bg-emerald-500'} text-white`}>
                              {row.buyerRisk}
                            </Badge>
                          </td>
                          <td className="text-center py-4 px-4">
                            <Badge className={`${row.sellerRisk === 'High' ? 'bg-red-500' : row.sellerRisk === 'Medium' ? 'bg-amber-500' : row.sellerRisk === 'Highest' ? 'bg-red-600' : row.sellerRisk === 'Lowest' ? 'bg-emerald-500' : 'bg-emerald-500'} text-white`}>
                              {row.sellerRisk}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{row.typicalUse}</td>
                          <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-400">{row.bankFees}</td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Risk Comparison Chart */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                  Risk Level Comparison
                </CardTitle>
                <CardDescription>Buyer vs Seller risk by payment method (1=Lowest, 5=Highest)</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={termsComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} angle={-45} textAnchor="end" height={80} />
                      <YAxis domain={[0, 5]} tick={{ fill: 'var(--muted-foreground)' }} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--background)', 
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }} 
                      />
                      <Legend />
                      <Bar dataKey="buyerRisk" name="Buyer Risk" fill="#EF4444" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="sellerRisk" name="Seller Risk" fill={LOGISTICS_GREEN} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 4: Guide - Educational Content */}
          <TabsContent value="guide" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Understanding Payment Terms */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                    Understanding Payment Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Payment terms in international trade define when and how the buyer will pay the seller for goods or services. These terms are fundamental to managing risk, cash flow, and competitive positioning in global commerce. Unlike domestic transactions where payment is often immediate or within short credit periods, international trade involves longer timelines, greater distances, and more complex risk considerations. The choice of payment terms directly impacts who bears the financial risk at each stage of the transaction, from order placement through delivery and beyond.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    The spectrum of payment terms ranges from seller-favorable methods like T/T in Advance, where the buyer pays before shipment, to buyer-favorable methods like Open Account, where the seller extends credit and receives payment weeks or months after delivery. Between these extremes are various balanced approaches such as Letters of Credit, documentary collections, and partial payment arrangements. Each method has specific cost implications, documentation requirements, and risk profiles that must be carefully evaluated for each transaction.
                  </p>
                </CardContent>
              </Card>

              {/* Common Trade Terms */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" style={{ color: LOGISTICS_GREEN }} />
                    Common Trade Terms
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    T/T (Telegraphic Transfer) refers to electronic bank transfers, with T/T in Advance requiring full payment before shipment. L/C (Letter of Credit) is a bank guarantee where the issuing bank commits to paying the seller upon presentation of compliant documents. D/P (Documents against Payment) requires the buyer to pay to receive shipping documents, while D/A (Documents against Acceptance) allows document release against acceptance of a time draft. Open Account means the seller ships goods and invoices the buyer, with payment due at an agreed future date.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    Common variations include partial payment arrangements like 30/70 (30% deposit, 70% before shipment or on arrival) or 25/75 terms. L/C terms vary by payment timing: at sight for immediate payment upon document presentation, or usance L/C with deferred payment at 30, 60, or 90 days. Understanding these terms and their implications is essential for effective negotiation and risk management in international trade transactions.
                  </p>
                </CardContent>
              </Card>

              {/* Cash Flow Impact */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" style={{ color: '#8B5CF6' }} />
                    Cash Flow Impact
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Payment terms have a profound impact on business cash flow and working capital requirements. When sellers offer deferred payment terms, they effectively become financiers, tying up their capital in accounts receivable for extended periods. This has real costs including the opportunity cost of capital (what else could that money be doing), financing costs if the business needs to borrow to cover the gap, and inflation erosion over time. A business offering 60-day terms on $1 million in monthly sales needs approximately $2 million in working capital just to cover the payment cycle gap.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    From the buyers perspective, longer payment terms improve their working capital by allowing them to sell goods before paying suppliers. This supplier-financed inventory can significantly improve the buyers return on capital. Businesses must carefully balance these cash flow implications against competitive pressures and customer relationship considerations. The financing cost calculator helps quantify these impacts, enabling data-driven decisions about payment term offerings.
                  </p>
                </CardContent>
              </Card>

              {/* Negotiation Strategies */}
              <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Handshake className="h-5 w-5" style={{ color: '#F59E0B' }} />
                    Negotiation Strategies
                  </CardTitle>
                </CardHeader>
                <CardContent className="prose dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Effective payment term negotiation requires understanding both your own constraints and the other partys motivations. Start by knowing your walk-away points: the minimum terms you can accept without compromising your business. Research market norms for your industry and the specific markets you are trading with. Use payment terms as a negotiating lever alongside price, quantity, and delivery terms. For example, you might accept a lower price in exchange for better payment terms, or offer favorable terms in exchange for larger order quantities.
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed mt-4">
                    Consider offering a menu of options with different price and term combinations, letting the customer choose based on their priorities. Build in escalation clauses that automatically improve terms based on proven performance. For new customers, start conservatively and offer improvements as trust builds. Document all agreements clearly and ensure both parties understand the terms. Remember that the best negotiation outcome is one where both parties feel they have received fair value.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Pro Tips Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Pro Tips for Payment Terms Management
                </CardTitle>
                <CardDescription>Best practices from trade finance experts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {proTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 rounded-xl border hover:shadow-lg transition-shadow"
                      style={{ backgroundColor: `${tip.color}08`, borderColor: `${tip.color}20` }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="p-2.5 rounded-lg"
                          style={{ backgroundColor: `${tip.color}15` }}
                        >
                          <tip.icon className="h-5 w-5" style={{ color: tip.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2" style={{ color: tip.color }}>{tip.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Common Mistakes Section */}
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Common Mistakes to Avoid
                </CardTitle>
                <CardDescription>Learn from common pitfalls in payment terms management</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {commonMistakes.map((mistake, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-5 rounded-xl border bg-red-50/50 dark:bg-red-950/20"
                      style={{ borderColor: `${mistake.color}30` }}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className="p-2.5 rounded-lg flex-shrink-0"
                          style={{ backgroundColor: `${mistake.color}15` }}
                        >
                          <mistake.icon className="h-5 w-5" style={{ color: mistake.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2" style={{ color: mistake.color }}>{mistake.title}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{mistake.description}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 5: FAQ */}
          <TabsContent value="faq" className="space-y-6">
            <Card className="border-0 shadow-xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" style={{ color: OCEAN_BLUE }} />
                  Frequently Asked Questions
                </CardTitle>
                <CardDescription>Comprehensive answers to common questions about international trade payment terms</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqData.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-200 dark:border-slate-700">
                      <AccordionTrigger className="text-left font-medium hover:no-underline py-4">
                        <div className="flex items-center gap-4">
                          <motion.div
                            initial={{ scale: 0.8 }}
                            whileInView={{ scale: 1 }}
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md flex-shrink-0"
                            style={{ background: index % 2 === 0 ? `linear-gradient(135deg, ${OCEAN_BLUE}, ${LOGISTICS_GREEN})` : `linear-gradient(135deg, ${LOGISTICS_GREEN}, ${OCEAN_BLUE})` }}
                          >
                            {index + 1}
                          </motion.div>
                          <span className="text-slate-700 dark:text-slate-300 text-sm md:text-base">{faq.question}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pl-14 text-slate-600 dark:text-slate-400 leading-relaxed pb-4">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>

            {/* Quick Reference Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Need Help?',
                  description: 'Contact our trade finance experts for personalized advice on payment terms.',
                  icon: HelpCircle,
                  color: OCEAN_BLUE,
                },
                {
                  title: 'Risk Assessment',
                  description: 'Get a comprehensive risk analysis for your trading partners and payment structures.',
                  icon: Shield,
                  color: LOGISTICS_GREEN,
                },
                {
                  title: 'Quick Compare',
                  description: 'Use our calculator to compare different payment terms and their financial impact.',
                  icon: ArrowRight,
                  color: '#8B5CF6',
                },
              ].map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div
                          className="p-4 rounded-xl transition-transform group-hover:scale-110"
                          style={{ backgroundColor: `${card.color}15` }}
                        >
                          <card.icon className="h-6 w-6" style={{ color: card.color }} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-700 dark:text-slate-300 mb-2">{card.title}</h4>
                          <p className="text-sm text-slate-500">{card.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
