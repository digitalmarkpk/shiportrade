import { Metadata } from "next";
import { ContainerTracking } from "@/components/tools/ContainerTracking";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Ship, Bell, Globe } from "lucide-react";

export const metadata: Metadata = {
  title: "Container Tracking | Shiportrade.com",
  description: "Track your shipping containers in real-time. Monitor vessel positions, port arrivals, and estimated delivery times for major carriers.",
  keywords: ["container tracking", "ship tracking", "cargo tracking", "vessel tracking", "freight tracking"],
};

export default function ContainerTrackingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Container className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Container Tracking
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Track your shipping containers in real-time across major ocean carriers. 
          Get visibility into vessel positions, port calls, and estimated arrival times.
        </p>
      </div>

      {/* Tracker */}
      <ContainerTracking />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ship className="h-5 w-5 text-[var(--logistics)]" />
              Supported Carriers
            </CardTitle>
            <CardDescription>
              Track containers from major shipping lines worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-2 gap-3">
              {[
                "MSC", "Maersk", "CMA CGM", "COSCO",
                "Hapag-Lloyd", "ONE", "Evergreen", "Yang Ming",
                "HMM", "ZIM", "PIL", "Wan Hai",
              ].map((carrier) => (
                <div key={carrier} className="flex items-center gap-2">
                  <Ship className="h-3 w-3 text-[var(--logistics)] shrink-0" />
                  <span>{carrier}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--ocean)]" />
              Tracking Features
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Real-Time Updates:</strong> Vessel position and status updates</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Port Information:</strong> Arrival/departure times and terminals</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Customs Status:</strong> Clearance progress and documentation</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Last Mile:</strong> Delivery scheduling and confirmation</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="mt-6 bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-2">Get Automatic Notifications</p>
              <p>
                Sign up for automatic email or SMS notifications when your container reaches 
                key milestones. Never miss a critical update about your shipment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
