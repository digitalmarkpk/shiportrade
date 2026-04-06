import { Metadata } from "next";
import { TraceabilityLedgerSimulator } from "@/components/tools/TraceabilityLedgerSimulator";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, Link2, Shield, Globe, ArrowRight, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Traceability Ledger Simulator | Shiportrade.com",
  description: "Simulate product journey tracking on blockchain. Visualize supply chain transparency with immutable record-keeping.",
  keywords: ["blockchain traceability", "supply chain transparency", "ledger simulation", "product tracking", "smart logistics"],
};

export default function TraceabilityLedgerSimulatorPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="secondary" className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            <Layers className="h-3 w-3 mr-2" />
            Blockchain & Digital Supply Chain
          </Badge>
          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
            NEW
          </Badge>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Traceability Ledger Simulator
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Simulate how your products move through the supply chain on a blockchain ledger. 
          Visualize transparency, track custody changes, and understand the power of immutable record-keeping.
        </p>
      </div>

      {/* Simulator Component */}
      <TraceabilityLedgerSimulator />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Link2 className="h-5 w-5 text-purple-500" />
              Immutable Records
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Every transaction recorded on the blockchain is permanent and tamper-proof. 
              This creates an unalterable audit trail from origin to destination.
            </p>
            <div className="flex items-center gap-2 text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <span className="text-green-700 dark:text-green-400 font-medium">Cryptographically secured</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Trust & Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              All participants in the supply chain can verify product authenticity and 
              provenance without relying on a single central authority.
            </p>
            <div className="flex items-center gap-2 text-xs bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 dark:text-blue-400 font-medium">Decentralized trust</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-green-500" />
              Global Visibility
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Track products across borders and through multiple handlers with complete 
              visibility. Know exactly where your goods are at any moment.
            </p>
            <div className="flex items-center gap-2 text-xs bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
              <Globe className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-400 font-medium">End-to-end tracking</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How Blockchain Traceability Works */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-xl">How Blockchain Traceability Works</CardTitle>
          <CardDescription>Understanding the journey of a product on the blockchain</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: 1, title: "Origin Record", desc: "Product created/harvested with timestamp, location, and producer details recorded on-chain" },
              { step: 2, title: "Processing", desc: "Manufacturing or processing steps added with quality checks and certifications" },
              { step: 3, title: "Logistics", desc: "Each handoff recorded: carrier, route, conditions, and timestamps" },
              { step: 4, title: "Destination", desc: "Final delivery confirmed with customer verification and feedback" },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-sm">
                    {item.step}
                  </div>
                  <span className="font-medium text-sm">{item.title}</span>
                </div>
                <p className="text-xs text-muted-foreground ml-10">{item.desc}</p>
                {item.step < 4 && (
                  <ArrowRight className="hidden md:block absolute top-4 -right-4 h-4 w-4 text-muted-foreground" />
                )}
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
            <AccordionTrigger>What is blockchain traceability?</AccordionTrigger>
            <AccordionContent>
              Blockchain traceability uses distributed ledger technology to record every step of a product&apos;s journey through the supply chain. Each transaction creates an immutable block that links to previous records, forming a complete chain of custody that cannot be altered or deleted.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q2">
            <AccordionTrigger>How does this benefit supply chain management?</AccordionTrigger>
            <AccordionContent>
              Blockchain traceability provides complete transparency, reduces fraud, enables faster issue resolution, ensures regulatory compliance, builds consumer trust, and creates an auditable record for quality control and recall management.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q3">
            <AccordionTrigger>What types of products benefit most from blockchain tracking?</AccordionTrigger>
            <AccordionContent>
              High-value goods, pharmaceuticals, perishable foods, luxury items, electronics, and regulated products benefit most. Any product where provenance, authenticity, or chain of custody is important is a good candidate for blockchain tracking.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q4">
            <AccordionTrigger>How do smart contracts enhance traceability?</AccordionTrigger>
            <AccordionContent>
              Smart contracts automate processes when predefined conditions are met. For example, payment can be automatically released when goods reach a specific location, or alerts can be triggered if temperature thresholds are exceeded during transport.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q5">
            <AccordionTrigger>Is blockchain traceability expensive to implement?</AccordionTrigger>
            <AccordionContent>
              Initial setup costs vary, but blockchain solutions are becoming more accessible through cloud-based platforms. The ROI typically comes from reduced fraud, faster dispute resolution, improved efficiency, and enhanced brand value from transparency.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="q6">
            <AccordionTrigger>What standards govern blockchain supply chain solutions?</AccordionTrigger>
            <AccordionContent>
              Key standards include GS1 standards for product identification, ISO/TC 307 for blockchain governance, and industry-specific frameworks. Interoperability standards are evolving to enable cross-chain communication and data sharing.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Pro Tips */}
      <Card className="mt-8 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
            <div className="text-sm text-purple-700 dark:text-purple-300">
              <p className="font-semibold mb-2">Getting Started with Blockchain Traceability</p>
              <ul className="space-y-1">
                <li>• Start with high-risk or high-value product categories</li>
                <li>• Identify key tracking points in your supply chain</li>
                <li>• Partner with technology providers experienced in supply chain blockchain</li>
                <li>• Train staff on data entry protocols and system usage</li>
                <li>• Integrate with existing ERP and warehouse management systems</li>
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
            { name: "Smart Contract Creator", href: "/tools/blockchain-digital-supply-chain/smart-contract-creator", icon: Layers },
            { name: "Supply Chain Visibility", href: "/tools/international-trade/supply-chain-visibility", icon: Globe },
            { name: "Container Tracking", href: "/tools/ocean-freight/container-tracking", icon: Link2 },
            { name: "Shipment Tracking", href: "/tools/ocean-freight/shipment-tracking", icon: Shield },
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
