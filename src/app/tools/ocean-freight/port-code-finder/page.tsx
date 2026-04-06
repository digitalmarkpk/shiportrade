import { Metadata } from "next";
import { PortCodeFinder } from "@/components/tools/PortCodeFinder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Ship,
  Info,
  Clock,
  Globe,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Port Code Finder (UN/LOCODE) | Shiportrade.com",
  description: "Search and explore UN/LOCODE port codes worldwide. Find seaports, airports, and inland ports by name, code, country, or region.",
  keywords: ["UN/LOCODE", "port codes", "shipping ports", "container terminals", "port finder", "LOCODE search"],
};

export default function PortCodeFinderPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <MapPin className="h-3 w-3 mr-2" />
          Ocean Freight Tools
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Port Code Finder (UN/LOCODE)
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Search and explore UN/LOCODE port codes for seaports, airports, and inland terminals worldwide. 
          Find the correct 5-character code for any shipping location.
        </p>
      </div>

      {/* Tool Component */}
      <PortCodeFinder />

      {/* Quick Reference Section */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* UN/LOCODE Structure */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Database className="h-5 w-5 text-[var(--ocean)]" />
              UN/LOCODE Structure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="font-mono text-lg font-bold text-center mb-2">
                <span className="text-[var(--ocean)]">XX</span>
                <span className="text-[var(--logistics)]">XXX</span>
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-[var(--ocean)] font-bold">XX</span>
                  <p className="text-muted-foreground">Country Code (ISO 3166-1)</p>
                </div>
                <div>
                  <span className="text-[var(--logistics)] font-bold">XXX</span>
                  <p className="text-muted-foreground">Location Code</p>
                </div>
              </div>
            </div>
            <div className="text-sm">
              <p className="font-medium">Example: CNSHA</p>
              <p className="text-muted-foreground">CN = China, SHA = Shanghai</p>
            </div>
          </CardContent>
        </Card>

        {/* Top Ports Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Ship className="h-5 w-5 text-[var(--ocean)]" />
              Top 5 Container Ports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { code: "CNSHA", name: "Shanghai, China", throughput: "47M+ TEU" },
                { code: "SGSIN", name: "Singapore", throughput: "37M+ TEU" },
                { code: "CNNGB", name: "Ningbo-Zhoushan, China", throughput: "33M+ TEU" },
                { code: "CNSZX", name: "Shenzhen, China", throughput: "28M+ TEU" },
                { code: "KRPUS", name: "Busan, South Korea", throughput: "22M+ TEU" },
              ].map((port) => (
                <div key={port.code} className="flex items-center justify-between p-2 rounded hover:bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">{port.code}</Badge>
                    <span className="text-sm">{port.name}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{port.throughput}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Code Types */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Location Types
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-[var(--ocean)]">1</Badge>
                <span>Sea port / Freight terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[var(--logistics)]">2</Badge>
                <span>Rail terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">3</Badge>
                <span>Road terminal</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">4</Badge>
                <span>Airport</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">6</Badge>
                <span>Inland clearance depot</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">B</Badge>
                <span>Border crossing</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pro Tips Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[var(--logistics)]" />
            Pro Tips for Using Port Codes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Always verify the code",
                description: "Cross-reference with official UN/LOCODE database for accuracy, especially for less common ports.",
              },
              {
                title: "Use in all documentation",
                description: "Include UN/LOCODE in Bills of Lading, Letters of Credit, and shipping instructions for clarity.",
              },
              {
                title: "Check for alternatives",
                description: "Some regions have multiple ports - choose the correct one based on your cargo routing.",
              },
              {
                title: "Note the timezone",
                description: "Port timezones are crucial for coordinating arrivals, departures, and customs cutoffs.",
              },
              {
                title: "Consider port facilities",
                description: "Verify the port can handle your cargo type (reefer, OOG, bulk, etc.) before booking.",
              },
              {
                title: "Stay updated",
                description: "UN/LOCODE is updated biannually. New codes are added and deprecated codes are marked.",
              },
            ].map((tip, index) => (
              <div key={index} className="flex gap-3 p-3 bg-muted/30 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-[var(--logistics)] shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{tip.title}</p>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Common Mistakes */}
      <Card className="mt-6 border-destructive/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Common Mistakes to Avoid
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                mistake: "Using IATA codes for seaports",
                correction: "IATA codes (3 letters) are for airports. Seaports use 5-character UN/LOCODE.",
              },
              {
                mistake: "Confusing similar codes",
                correction: "CNSHA (Shanghai) ≠ CNSZX (Shenzhen). Always verify the full port name.",
              },
              {
                mistake: "Using city names instead of codes",
                correction: "Some ports have different names than cities. Use the official UN/LOCODE.",
              },
              {
                mistake: "Incorrect formatting",
                correction: "Always use 5 uppercase characters with no spaces: CNSHA, not cnsha or CN SHA.",
              },
            ].map((item, index) => (
              <div key={index} className="flex gap-3 p-3 bg-destructive/5 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{item.mistake}</p>
                  <p className="text-sm text-muted-foreground">{item.correction}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[var(--ocean)]" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>What is the difference between UN/LOCODE and IATA codes?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  UN/LOCODE (5 characters) is used for sea ports, rail terminals, road terminals, and inland ports. 
                  IATA codes (3 letters) are primarily for airports. While some locations have both, they serve 
                  different purposes in logistics. For maritime shipping, always use UN/LOCODE.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q2">
              <AccordionTrigger>How often is the UN/LOCODE database updated?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  The UN/LOCODE database is maintained by UNECE and updated biannually. New codes are added, 
                  existing codes may be modified, and deprecated codes are marked. Always verify codes against 
                  the latest version for critical shipments.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q3">
              <AccordionTrigger>Can a location have multiple UN/LOCODEs?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Yes, large port complexes may have multiple codes for different terminals or facilities. 
                  For example, Shanghai has CNSHA (main port) but different terminals within may have 
                  specific codes. Use the most appropriate code based on your terminal or facility.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q4">
              <AccordionTrigger>What if a port is not in the database?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  If a location is not found in UN/LOCODE, it may be too small or new. You can submit 
                  a request to UNECE through your national trade facilitation body. In the meantime, 
                  use the nearest major port code with a note specifying the actual location.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q5">
              <AccordionTrigger>Are UN/LOCODEs used in customs declarations?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Yes, UN/LOCODEs are widely used in customs declarations, especially for specifying 
                  ports of loading, discharge, and transit. Many customs systems require the 5-character 
                  code rather than the port name for standardization.
                </p>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="q6">
              <AccordionTrigger>How do I find the UN/LOCODE for an inland location?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p>
                  Inland locations (dry ports, ICDs, rail terminals) also have UN/LOCODEs. Use the search 
                  function and filter by port type, or look for locations with type codes 2 (rail), 3 (road), 
                  or 6 (ICD). The location code will still be 5 characters.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-[var(--ocean)]" />
            Related Tools
          </CardTitle>
          <CardDescription>Other tools that work well with port codes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Container Tracking", slug: "container-tracking", icon: Ship },
              { name: "Transit Time Calculator", slug: "transit-time", icon: Clock },
              { name: "Freight Rate Calculator", slug: "freight-rate-calculator", icon: Globe },
              { name: "Bill of Lading Generator", slug: "bill-of-lading", icon: FileText },
            ].map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/ocean-freight/${tool.slug}`}
                className="flex items-center gap-3 p-4 rounded-lg border hover:border-[var(--ocean)]/50 hover:bg-muted/50 transition-colors"
              >
                <tool.icon className="h-5 w-5 text-[var(--ocean)]" />
                <div>
                  <p className="font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    View tool <ArrowRight className="h-3 w-3" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
