import { Metadata } from "next";
import { SmartContractCreator } from "@/components/tools/SmartContractCreator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCode, Shield, Zap, CheckCircle2, ArrowRight, AlertTriangle, Code } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Smart Contract Creator | Shiportrade.com",
  description: "Generate supply chain smart contract templates for automated logistics workflows. Create escrow, delivery verification, and payment contracts.",
  keywords: ["smart contract", "blockchain", "supply chain automation", "logistics contract", "escrow contract", "delivery verification"],
};

export default function SmartContractCreatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <FileCode className="h-3 w-3 mr-2" />
            Blockchain & Digital Supply Chain
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
            NEW
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Smart Contract Creator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Generate supply chain smart contract templates for automated logistics workflows. 
          Create escrow contracts, delivery verification, and payment automation without coding knowledge.
        </p>
      </div>

      {/* Creator Component */}
      <SmartContractCreator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Escrow Contracts
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Automatically hold payments in escrow until delivery conditions are met. 
              Protect both buyers and sellers in international trade transactions.
            </p>
            <div className="flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 dark:text-blue-400 font-medium">Secure fund management</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              Auto-Execution
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Define conditions that trigger automatic actions: payments, notifications, 
              document releases, and more. Reduce manual intervention and errors.
            </p>
            <div className="flex items-center gap-2 text-xs bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
              <Zap className="h-4 w-4 text-amber-600" />
              <span className="text-amber-700 dark:text-amber-400 font-medium">If-this-then-that logic</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5 text-green-500" />
              No-Code Templates
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Use pre-built templates for common supply chain scenarios. 
              Customize parameters without writing any Solidity or Chaincode.
            </p>
            <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <Code className="h-4 w-4 text-green-600" />
              <span className="text-green-700 dark:text-green-400 font-medium">Easy configuration</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contract Types */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">Available Contract Templates</CardTitle>
          <CardDescription>Choose from pre-built templates for common supply chain scenarios</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { 
                name: "Trade Escrow Contract", 
                useCase: "Secure payment holding until delivery confirmation",
                features: ["Multi-signature release", "Dispute resolution", "Partial payment options"]
              },
              { 
                name: "Delivery Verification Contract", 
                useCase: "Automatic verification upon GPS/IoT confirmation",
                features: ["IoT integration", "Geofencing triggers", "Condition monitoring"]
              },
              { 
                name: "Quality Assurance Contract", 
                useCase: "Release payment only after quality checks pass",
                features: ["Third-party verification", "Photo documentation", "Certificate validation"]
              },
              { 
                name: "Time-Based Release Contract", 
                useCase: "Automatic actions based on time triggers",
                features: ["Deadline enforcement", "Late penalties", "Grace periods"]
              },
            ].map((contract) => (
              <div key={contract.name} className="p-4 rounded-lg border border-border bg-muted/30">
                <h3 className="font-semibold mb-1">{contract.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{contract.useCase}</p>
                <div className="flex flex-wrap gap-2">
                  {contract.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="q1">
            <AccordionTrigger>What is a smart contract in supply chain?</AccordionTrigger>
            <AccordionContent>
              A smart contract is a self-executing program stored on a blockchain that automatically enforces the terms of an agreement. In supply chain, it can automate payments, verify deliveries, enforce quality standards, and trigger actions based on predefined conditions without human intervention.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>Do I need programming skills to use this tool?</AccordionTrigger>
            <AccordionContent>
              No programming skills required. Our Smart Contract Creator uses a no-code interface where you select templates, configure parameters, and generate contracts visually. The underlying code is generated automatically and can be exported for deployment.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>Which blockchain platforms are supported?</AccordionTrigger>
            <AccordionContent>
              Our tool supports multiple blockchain platforms including Ethereum, Hyperledger Fabric, and Polygon. Each template can be configured for your preferred platform, with platform-specific optimizations applied automatically.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>How secure are smart contracts?</AccordionTrigger>
            <AccordionContent>
              Smart contracts are highly secure due to blockchain&apos;s immutable nature. Our templates are audited and follow best practices. However, once deployed, contracts cannot be easily modified, so thorough testing is essential. We recommend security audits for high-value contracts.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>What happens if conditions cannot be met?</AccordionTrigger>
            <AccordionContent>
              Smart contracts should include fallback mechanisms for edge cases. Our templates include dispute resolution clauses, timeout mechanisms, and manual override options (with multi-signature requirements) for situations where automated resolution isn&apos;t possible.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q6">
            <AccordionTrigger>How do I integrate smart contracts with existing systems?</AccordionTrigger>
            <AccordionContent>
              Integration options include APIs, webhooks, IoT device connections, and ERP integrations. Smart contracts can receive data from external sources through oracles and trigger actions in your existing systems through event listeners and automated workflows.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Warning/Best Practices */}
      <Card className="mt-8 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-700 dark:text-amber-300">
              <p className="font-semibold mb-2">Important Considerations</p>
              <ul className="space-y-1">
                <li>• Test contracts thoroughly on testnet before mainnet deployment</li>
                <li>• Include clear dispute resolution mechanisms in all contracts</li>
                <li>• Consider gas costs for Ethereum-based contracts</li>
                <li>• Ensure all parties understand the automated terms before deployment</li>
                <li>• Keep backup documentation of all contract terms offline</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "Traceability Ledger", href: "/tools/blockchain-digital-supply-chain/traceability-ledger-simulator", icon: FileCode },
            { name: "LC Confirmation Pricing", href: "/tools/international-trade/lc-confirmation-pricing", icon: Shield },
            { name: "Freight Contract Analyzer", href: "/tools/international-trade/freight-contract", icon: Code },
            { name: "Letter of Credit", href: "/documents/letter-of-credit", icon: FileCode },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <tool.icon className="h-5 w-5 text-purple-500" />
                  <span className="text-sm font-medium">{tool.name}</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
