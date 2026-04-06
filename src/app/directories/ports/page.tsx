import { Metadata } from "next";
import { PortDirectory } from "@/components/tools/PortDirectory";
import { Badge } from "@/components/ui/badge";
import { MapPin, Info, Ship } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Global Port Directory | Shiportrade.com",
  description: "Comprehensive directory of major ports worldwide. Find port information, facilities, throughput data, and contact details.",
  keywords: ["port directory", "shipping ports", "container terminals", "port information", "major ports"],
};

export default function PortsDirectoryPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Badge variant="secondary" className="mb-3">
          <MapPin className="h-3 w-3 mr-2" />
          Port Directory
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Global Port Directory
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Find information about major ports worldwide including throughput data, facilities, 
          terminal information, and port codes.
        </p>
      </div>

      {/* Port Directory Component */}
      <PortDirectory />

      {/* Info Card */}
      <Card className="mt-8 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-semibold mb-2">About This Directory</p>
              <p>
                This directory contains information about major container ports worldwide. 
                Throughput data is based on the most recent available annual statistics. 
                For detailed port information, vessel schedules, and real-time data, 
                please visit the official port authority websites.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
