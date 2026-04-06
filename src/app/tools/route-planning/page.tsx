import { Metadata } from "next";
import RoutePlanningTool from "@/components/tools/RoutePlanningTool";

export const metadata: Metadata = {
  title: "Route Planning & Optimization Tool | Shiportrade",
  description: "Multi-stop route optimization with distance calculations, cost per mile/km analysis, fuel consumption estimates, vehicle capacity utilization, and delivery time windows.",
  keywords: ["route planning", "route optimization", "delivery planning", "logistics", "fuel cost", "time windows", "multi-stop delivery"],
};

export default function RoutePlanningPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: "#2B4570" }}
          >
            <Route className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold" style={{ color: "#2B4570" }}>
              Route Planning & Optimization Tool
            </h1>
            <p className="text-muted-foreground">
              Plan efficient multi-stop routes with comprehensive cost and time analysis
            </p>
          </div>
        </div>
        
        {/* Feature highlights */}
        <div className="flex flex-wrap gap-3 mt-4">
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#2B457015", color: "#2B4570" }}
          >
            <MapPin className="h-4 w-4" />
            Multi-Stop Optimization
          </span>
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#4CAF5015", color: "#4CAF50" }}
          >
            <DollarSign className="h-4 w-4" />
            Cost per Mile/KM Analysis
          </span>
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#2B457015", color: "#2B4570" }}
          >
            <Fuel className="h-4 w-4" />
            Fuel Consumption Estimates
          </span>
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#4CAF5015", color: "#4CAF50" }}
          >
            <Truck className="h-4 w-4" />
            Vehicle Capacity Planning
          </span>
          <span 
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
            style={{ backgroundColor: "#2B457015", color: "#2B4570" }}
          >
            <Clock className="h-4 w-4" />
            Delivery Time Windows
          </span>
        </div>
      </div>
      
      <RoutePlanningTool />
      
      {/* Additional Info Section */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <div 
          className="p-6 rounded-xl border"
          style={{ borderColor: "#2B457020", backgroundColor: "#2B457005" }}
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: "#2B4570" }}>
            <Route className="h-5 w-5" />
            Smart Route Optimization
          </h3>
          <p className="text-sm text-muted-foreground">
            Automatically optimize delivery sequences based on priority, time windows, and distance. 
            Our algorithm minimizes total travel time and fuel costs while respecting delivery constraints.
          </p>
        </div>
        
        <div 
          className="p-6 rounded-xl border"
          style={{ borderColor: "#4CAF5020", backgroundColor: "#4CAF5005" }}
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: "#4CAF50" }}>
            <Calculator className="h-5 w-5" />
            Comprehensive Cost Analysis
          </h3>
          <p className="text-sm text-muted-foreground">
            Calculate total costs including fuel, tolls, driver wages, and operational expenses. 
            Get detailed cost breakdowns per kilometer, per mile, and per delivery segment.
          </p>
        </div>
        
        <div 
          className="p-6 rounded-xl border"
          style={{ borderColor: "#2B457020", backgroundColor: "#2B457005" }}
        >
          <h3 className="font-semibold mb-2 flex items-center gap-2" style={{ color: "#2B4570" }}>
            <Leaf className="h-5 w-5" />
            Environmental Impact
          </h3>
          <p className="text-sm text-muted-foreground">
            Track CO₂ emissions for each route and compare fuel types. 
            Make informed decisions about fleet sustainability and carbon footprint reduction.
          </p>
        </div>
      </div>
    </div>
  );
}

// Import icons used in the component
import { Route, MapPin, DollarSign, Fuel, Truck, Clock, Calculator, Leaf } from "lucide-react";
