import { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  Ship,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Clock,
  DollarSign,
  Package,
  Building2,
  Globe,
  ArrowRight,
  Zap,
  FileText,
  Info,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ContainerBookingTool from "@/components/tools/ContainerBookingTool";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Container Booking Tool | Shiportrade.com",
  description: "Book container shipments with real-time availability checks, rate quotes, and carrier selection across major global trade lanes.",
  keywords: ["container booking", "ocean freight booking", "container shipping", "freight booking", "shipping container", "FCL booking"],
  openGraph: {
    title: "Container Booking Tool - Shiportrade.com",
    description: "Book container shipments with real-time availability checks and instant rate quotes.",
    type: "website",
  },
};

export default function ContainerBookingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/ocean-freight" className="hover:text-foreground">Ocean Freight</Link>
        <span>/</span>
        <span className="text-foreground">Container Booking</span>
      </nav>

      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#0F4C81]/10 flex items-center justify-center">
            <Container className="h-6 w-6 text-[#0F4C81]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Container Booking Tool</h1>
            <p className="text-muted-foreground">Book container shipments with real-time availability and rate quotes</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className="bg-[#0F4C81] text-white">Free Tool</Badge>
          <Badge variant="outline" className="border-[#2E8B57] text-[#2E8B57]">Instant Quote</Badge>
        </div>
      </div>

      {/* Booking Tool */}
      <ContainerBookingTool />

      <Separator className="my-12" />

      {/* Educational Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Booking Process */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-[#0F4C81]" />
              Container Booking Process
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              <strong>Container booking</strong> is the process of reserving space on a vessel for your cargo. 
              The booking process involves selecting the right container type, choosing origin and destination 
              ports, specifying cargo details, and confirming rates with carriers.
            </p>
            <p className="text-muted-foreground mt-3">
              A successful booking requires accurate cargo information, proper documentation, and 
              understanding of carrier schedules and cutoff dates. Early booking ensures equipment 
              availability and better rates.
            </p>
          </CardContent>
        </Card>

        {/* Key Considerations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Zap className="h-5 w-5 text-[#2E8B57]" />
              Key Considerations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Container Selection:</strong> Choose the right type for your cargo
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Equipment Availability:</strong> Check container stock at origin
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Cutoff Dates:</strong> Meet documentation and cargo delivery deadlines
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#2E8B57] mt-0.5 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  <strong>Carrier Selection:</strong> Compare reliability and transit times
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Documentation Required */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-[#0F4C81]" />
              Required Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Booking Confirmation (SO)
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Commercial Invoice
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Packing List
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Bill of Lading
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Certificate of Origin (if applicable)
              </li>
              <li className="flex items-center gap-2">
                <Package className="h-4 w-4 text-[#0F4C81]" />
                Dangerous Goods Declaration (if applicable)
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Container Types */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Container className="h-5 w-5 text-[#0F4C81]" />
            Container Types Available for Booking
          </CardTitle>
          <CardDescription>Choose the right container for your cargo requirements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { type: "20GP", name: "20ft General Purpose", capacity: "33.2 CBM", desc: "Standard dry cargo", multiplier: "1.0x" },
              { type: "40GP", name: "40ft General Purpose", capacity: "67.7 CBM", desc: "Standard dry cargo", multiplier: "1.27x" },
              { type: "40HC", name: "40ft High Cube", capacity: "76.3 CBM", desc: "Voluminous cargo", multiplier: "1.35x" },
              { type: "45HC", name: "45ft High Cube", capacity: "86.1 CBM", desc: "Maximum volume", multiplier: "1.52x" },
              { type: "20RF", name: "20ft Refrigerated", capacity: "28.4 CBM", desc: "Temperature controlled", multiplier: "2.2x" },
              { type: "40RF", name: "40ft Refrigerated HC", capacity: "67.5 CBM", desc: "Temperature controlled", multiplier: "2.5x" },
              { type: "20OT", name: "20ft Open Top", capacity: "33.2 CBM", desc: "Over-height cargo", multiplier: "1.45x" },
              { type: "40FR", name: "40ft Flat Rack", capacity: "52.1 CBM", desc: "Oversized cargo", multiplier: "1.85x" },
            ].map((item) => (
              <div key={item.type} className="p-4 bg-muted/50 rounded-lg">
                <Badge className="mb-2 bg-[#0F4C81]/10 text-[#0F4C81]">{item.type}</Badge>
                <p className="font-semibold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.capacity}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                <p className="text-xs font-medium text-[#2E8B57] mt-1">Rate: {item.multiplier}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Timeline */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-[#0F4C81]" />
            Booking Timeline
          </CardTitle>
          <CardDescription>Typical timeline from booking to shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { day: "Day -14", step: "Request Quote", desc: "Get rate quotes from carriers", icon: DollarSign },
              { day: "Day -10", step: "Submit Booking", desc: "Confirm booking with carrier", icon: FileText },
              { day: "Day -5", step: "Equipment Pickup", desc: "Pick up empty container", icon: Container },
              { day: "Day -2", step: "Documentation Cutoff", desc: "Submit all required docs", icon: Package },
              { day: "Day 0", step: "Vessel Loading", desc: "Cargo loaded on vessel", icon: Ship },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#0F4C81]/10 flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-[#0F4C81]" />
                  </div>
                  <Badge variant="outline" className="text-xs">{item.day}</Badge>
                </div>
                <p className="font-semibold text-sm">{item.step}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
                {index < 4 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-4 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips & Mistakes */}
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <Card className="border-[#2E8B57]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-[#2E8B57]">
              <CheckCircle2 className="h-5 w-5" />
              Pro Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Book at least 2-3 weeks before loading date to secure equipment
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Verify container availability at origin before confirming sales orders
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Consider booking multiple containers together for volume discounts
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Check carrier reliability scores before selecting your shipping line
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Prepare documentation early to avoid cutoff date issues
              </li>
              <li className="flex gap-2">
                <span className="text-[#2E8B57]">•</span>
                Consider alternative ports when equipment is scarce
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Common Mistakes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Booking too close to loading date without checking availability
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Selecting wrong container type for cargo requirements
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not accounting for dangerous goods documentation requirements
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Missing documentation cutoff dates resulting in rolled shipments
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Overlooking carrier transit time differences
              </li>
              <li className="flex gap-2">
                <span className="text-destructive">✗</span>
                Not verifying weight limits against container payload capacity
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="q1">
              <AccordionTrigger>How far in advance should I book container space?</AccordionTrigger>
              <AccordionContent>
                For standard containers on major trade lanes, booking 2-3 weeks in advance is 
                recommended. During peak seasons (Q4, pre-holiday periods), book 4-6 weeks ahead. 
                For special equipment like reefers or flat racks, allow 3-4 weeks minimum due to 
                limited availability.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2">
              <AccordionTrigger>What is a booking confirmation (SO)?</AccordionTrigger>
              <AccordionContent>
                A Shipping Order (SO) or Booking Confirmation is the official document from the 
                carrier confirming your container booking. It includes the booking number, vessel 
                details, sailing date, cutoff dates, and pickup location for the empty container. 
                This document is essential for coordinating with truckers and warehouses.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3">
              <AccordionTrigger>What are cutoff dates and why are they important?</AccordionTrigger>
              <AccordionContent>
                <strong>Cutoff dates</strong> are deadlines set by carriers for various booking activities:
                <ul className="list-disc ml-4 mt-2">
                  <li><strong>Documentation Cutoff:</strong> Deadline to submit shipping instructions</li>
                  <li><strong> Cargo Cutoff:</strong> Deadline for container gate-in at terminal</li>
                  <li><strong>VGM Cutoff:</strong> Deadline to submit Verified Gross Mass</li>
                </ul>
                Missing these deadlines can result in rolled shipments (delayed to next vessel) 
                and additional charges.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4">
              <AccordionTrigger>How do I check container availability at my origin port?</AccordionTrigger>
              <AccordionContent>
                Use our Container Booking Tool&apos;s availability check feature to see real-time 
                equipment status. The tool shows availability scores (0-100%) and equipment status 
                (Available, Limited, Shortage, Critical). For the most current status, contact your 
                carrier or freight forwarder directly, as availability can change daily based on 
                vessel arrivals and export demand.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q5">
              <AccordionTrigger>Can I change my booking after confirmation?</AccordionTrigger>
              <AccordionContent>
                Yes, changes are possible but subject to carrier approval and may incur amendment 
                fees. Common changes include adjusting quantity, container type, or cargo description. 
                Date changes require checking new vessel availability. Major changes close to cutoff 
                dates may not be possible. Always communicate changes through your booking agent 
                promptly.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q6">
              <AccordionTrigger>What happens if equipment is unavailable at my port?</AccordionTrigger>
              <AccordionContent>
                When equipment is unavailable, you have several options:
                <ul className="list-disc ml-4 mt-2">
                  <li>Wait for next vessel arrival with empty containers (1-2 weeks typical)</li>
                  <li>Pick up containers from alternative nearby ports</li>
                  <li>Use a different container type if suitable for your cargo</li>
                  <li>Switch to a different carrier with better equipment availability</li>
                  <li>For urgent shipments, consider premium pricing for guaranteed equipment</li>
                </ul>
                Your freight forwarder can help navigate these alternatives.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Related Tools */}
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Related Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: "Container Availability", href: "/tools/ocean-freight/container-availability" },
            { name: "Freight Rate Calculator", href: "/tools/ocean-freight/rate-calculator" },
            { name: "Transit Time Estimator", href: "/tools/ocean-freight/transit-time" },
            { name: "Carrier Selection", href: "/tools/ocean-freight/carrier-selection" },
          ].map((tool) => (
            <Link key={tool.name} href={tool.href}>
              <Card className="h-full hover:shadow-md transition-all hover:border-[#0F4C81]/50 cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="font-medium group-hover:text-[#0F4C81] transition-colors">
                    {tool.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-[#0F4C81] transition-colors" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
