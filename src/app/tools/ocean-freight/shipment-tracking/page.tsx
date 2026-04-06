import { Metadata } from "next";
import ShipmentTrackingDashboard from "@/components/tools/ShipmentTrackingDashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container, Ship, Bell, Globe, Route, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipment Tracking Dashboard | Shiportrade.com",
  description: "Track and manage all your ocean freight shipments in real-time. Monitor vessel positions, port arrivals, customs status, and estimated delivery times across multiple carriers.",
  keywords: ["shipment tracking", "container tracking", "ocean freight", "vessel tracking", "cargo tracking", "supply chain visibility", "ETA updates"],
};

export default function ShipmentTrackingPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <Container className="h-3 w-3 mr-2" />
          Ocean Freight Tool
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Shipment Tracking Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Monitor all your ocean freight shipments in one centralized dashboard. Track vessel positions, 
          port arrivals, customs clearance status, and get real-time ETA updates across multiple carriers.
        </p>
      </div>

      {/* Dashboard */}
      <ShipmentTrackingDashboard />

      {/* Educational Content */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Ship className="h-5 w-5 text-[var(--logistics)]" />
              Tracking Features
            </CardTitle>
            <CardDescription>
              Comprehensive visibility across your supply chain
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Real-Time Updates:</strong> Live vessel positions and status changes</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Milestone Tracking:</strong> Monitor every step from origin to delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>ETA Monitoring:</strong> Predictive arrival times with delay alerts</span>
              </li>
              <li className="flex items-start gap-2">
                <Globe className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Customs Status:</strong> Clearance progress and documentation</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Route className="h-5 w-5 text-[var(--ocean)]" />
              Supported Routes
            </CardTitle>
            <CardDescription>
              Major trade lanes covered worldwide
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <div className="grid grid-cols-1 gap-3">
              {[
                { route: "Asia - North America", desc: "Trans-Pacific trade" },
                { route: "Asia - Europe", desc: "Far East to Europe" },
                { route: "Europe - North America", desc: "Trans-Atlantic trade" },
                { route: "Asia - Asia", desc: "Intra-Asia regional" },
              ].map((item) => (
                <div key={item.route} className="flex items-center gap-2">
                  <Route className="h-3 w-3 text-[var(--logistics)] shrink-0" />
                  <span>{item.route}</span>
                  <span className="text-xs text-muted-foreground">({item.desc})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5 text-[var(--logistics)]" />
              Alert Notifications
            </CardTitle>
            <CardDescription>
              Stay informed about shipment changes
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-3">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
                <span><strong>Delay Alerts:</strong> Get notified when shipments are delayed</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>ETA Changes:</strong> Updates on revised arrival times</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                <span><strong>Milestone Events:</strong> Port arrivals, customs, delivery</span>
              </li>
              <li className="flex items-start gap-2">
                <Bell className="h-4 w-4 text-[var(--ocean)] mt-0.5 shrink-0" />
                <span><strong>Custom Alerts:</strong> Set your own notification rules</span>
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
              <p className="font-semibold mb-2">Pro Tip: Enable Real-Time Notifications</p>
              <p>
                Connect your carrier accounts to receive automatic updates via email or SMS when your 
                containers reach key milestones. Integration supports MSC, Maersk, CMA CGM, COSCO, 
                ONE, Evergreen, and more carriers worldwide.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
