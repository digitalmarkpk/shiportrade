import { Metadata } from "next";
import ColdChainMonitor from "@/components/tools/ColdChainMonitor";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Shield, AlertTriangle, LineChart, ArrowRight, Snowflake, Package } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cold Chain Monitor | Shiportrade.com",
  description: "Real-time temperature tracking, humidity monitoring, and compliance checking for cold chain logistics. Monitor shelf life impact and manage temperature excursions.",
  keywords: ["cold chain", "temperature monitoring", "humidity tracking", "pharmaceutical logistics", "food safety", "reefer container", "cold chain compliance"],
};

export default function ColdChainPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3 bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
          <Snowflake className="h-3 w-3 mr-2" />
          Sustainability Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Cold Chain Monitor
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Real-time monitoring and compliance tracking for temperature-sensitive shipments. 
          Track temperature, humidity, shelf life impact, and ensure regulatory compliance across your cold chain.
        </p>
      </div>

      {/* Monitor Component */}
      <ColdChainMonitor />

      {/* Feature Cards */}
      <div className="mt-12 grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Thermometer className="h-5 w-5 text-[var(--ocean)]" />
              Temperature Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Real-time temperature monitoring with configurable thresholds for different 
              product types including fresh, frozen, and pharmaceutical goods.
            </p>
            <div className="text-xs bg-muted/50 p-2 rounded">
              Supports <span className="text-[var(--logistics)] font-medium">10+ product categories</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--logistics)]" />
              Compliance Check
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Automated compliance verification against FDA, HACCP, GDP, and other 
              regulatory standards based on product type and destination.
            </p>
            <div className="text-xs bg-muted/50 p-2 rounded">
              <span className="text-green-600 font-medium">Auto-verification</span> of regulatory requirements
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Excursion Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Track and analyze temperature excursions with detailed logs including 
              duration, deviation severity, and resolution status.
            </p>
            <div className="text-xs bg-muted/50 p-2 rounded">
              <span className="text-amber-600 font-medium">Instant alerts</span> on threshold breaches
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LineChart className="h-5 w-5 text-purple-500" />
              Shelf Life Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p className="mb-3">
              Calculate remaining shelf life using Q10 methodology based on actual 
              temperature conditions throughout the supply chain.
            </p>
            <div className="text-xs bg-muted/50 p-2 rounded">
              <span className="text-purple-600 font-medium">Scientific modeling</span> for quality prediction
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Industry Applications */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/30 dark:to-blue-950/30 border-cyan-200 dark:border-cyan-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-[var(--ocean)]" />
              Supported Industries
            </CardTitle>
            <CardDescription>Product categories with specific cold chain requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 text-sm">
                <span>🥬</span> Fresh Produce
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🧊</span> Frozen Foods
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🧀</span> Dairy Products
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🥩</span> Meat & Poultry
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🐟</span> Seafood
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>💊</span> Pharmaceuticals
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>💉</span> Vaccines
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>🍫</span> Chocolates
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-[var(--logistics)]" />
              Regulatory Compliance
            </CardTitle>
            <CardDescription>Standards and regulations supported</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded">
                <span>FDA Food Safety Modernization Act</span>
                <Badge variant="outline" className="text-xs">FSMA</Badge>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded">
                <span>HACCP Certification</span>
                <Badge variant="outline" className="text-xs">Food</Badge>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded">
                <span>Good Distribution Practice</span>
                <Badge variant="outline" className="text-xs">GDP</Badge>
              </div>
              <div className="flex items-center justify-between text-sm p-2 bg-white/50 dark:bg-black/20 rounded">
                <span>WHO Temperature Standards</span>
                <Badge variant="outline" className="text-xs">WHO</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related Tools */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Related Tools</CardTitle>
          <CardDescription>Other sustainability and monitoring tools you may find useful</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link href="/tools/ocean-freight/reefer-settings" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--ocean)]/10 flex items-center justify-center">
                <Thermometer className="h-5 w-5 text-[var(--ocean)]" />
              </div>
              <div>
                <div className="font-medium text-sm">Reefer Settings</div>
                <div className="text-xs text-muted-foreground">Container temperature guidelines</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link href="/tools/sustainability/carbon-footprint" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--logistics)]/10 flex items-center justify-center">
                <LineChart className="h-5 w-5 text-[var(--logistics)]" />
              </div>
              <div>
                <div className="font-medium text-sm">Carbon Footprint</div>
                <div className="text-xs text-muted-foreground">Calculate emissions impact</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
            <Link href="/tools/ocean-freight/container-tracking" className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="font-medium text-sm">Container Tracking</div>
                <div className="text-xs text-muted-foreground">Real-time shipment location</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto text-muted-foreground" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
