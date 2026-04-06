import { Metadata } from "next";
import Link from "next/link";
import { 
  Ship, 
  Globe, 
  Building2, 
  MapPin, 
  ArrowRight,
  Star,
  Search,
  TrendingUp,
  Container,
  Users
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  shippingLines, 
  shippingLinesStats, 
  getTopShippingLines,
  type ShippingLine 
} from "@/lib/data/shipping-lines";

export const metadata: Metadata = {
  title: "Shipping Lines Directory | All Container Carriers | Shiportrade",
  description: "Complete directory of 320+ container shipping lines worldwide. Find major carriers like MSC, Maersk, CMA CGM, COSCO and regional operators. Compare capacity, routes, and contact information.",
  keywords: [
    "shipping lines",
    "container carriers",
    "MSC",
    "Maersk",
    "CMA CGM",
    "COSCO",
    "shipping companies",
    "ocean carriers",
    "container shipping",
    "freight forwarders"
  ],
  openGraph: {
    title: "Shipping Lines Directory | All Container Carriers",
    description: "Complete directory of 320+ container shipping lines. Compare capacity, routes, and find official contacts.",
    type: "website",
  },
};

// Country flags
const countryFlags: Record<string, string> = {
  "Switzerland": "🇨🇭",
  "Denmark": "🇩🇰",
  "France": "🇫🇷",
  "China": "🇨🇳",
  "Germany": "🇩🇪",
  "Singapore": "🇸🇬",
  "Taiwan": "🇹🇼",
  "Israel": "🇮🇱",
  "South Korea": "🇰🇷",
  "Hong Kong": "🇭🇰",
  "Iran": "🇮🇷",
  "South Africa": "🇿🇦",
  "Thailand": "🇹🇭",
  "United States": "🇺🇸",
  "India": "🇮🇳",
  "Netherlands": "🇳🇱",
  "Brazil": "🇧🇷",
  "Australia": "🇦🇺",
  "Japan": "🇯🇵",
  "Indonesia": "🇮🇩",
  "Turkey": "🇹🇷",
  "Russia": "🇷🇺",
  "Italy": "🇮🇹",
  "Papua New Guinea": "🇵🇬",
  "Malaysia": "🇲🇾",
};

// Alliance colors
const allianceColors: Record<string, string> = {
  "Ocean Alliance": "bg-blue-100 text-blue-700 border-blue-200",
  "THE Alliance": "bg-purple-100 text-purple-700 border-purple-200",
  "Gemini Cooperation": "bg-emerald-100 text-emerald-700 border-emerald-200",
  "2M Alliance": "bg-amber-100 text-amber-700 border-amber-200",
  "Independent Operator": "bg-gray-100 text-gray-700 border-gray-200",
  "Part of Maersk": "bg-sky-100 text-sky-700 border-sky-200",
  "Part of CMA CGM": "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Part of MSC": "bg-orange-100 text-orange-700 border-orange-200",
  "Part of ONE": "bg-rose-100 text-rose-700 border-rose-200",
};

function getAllianceColor(alliance: string): string {
  for (const [key, value] of Object.entries(allianceColors)) {
    if (alliance.includes(key)) return value;
  }
  return allianceColors["Independent Operator"];
}

// Shipping Line Card Component
function ShippingLineCard({ line, index }: { line: ShippingLine; index: number }) {
  const flag = countryFlags[line.country] || "🌍";
  const primaryAlliance = line.alliances[0] || "Independent Operator";
  const allianceClass = getAllianceColor(primaryAlliance);

  return (
    <Link href={`/directories/shipping-lines/${line.id}`}>
      <Card className="group h-full hover:shadow-xl transition-all duration-300 cursor-pointer border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 hover:from-blue-50 hover:to-indigo-50 dark:hover:from-gray-800 dark:hover:to-gray-700 overflow-hidden">
        {/* Rank Badge */}
        <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          #{index + 1}
        </div>
        
        <CardContent className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
              {line.shortName.substring(0, 3)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{flag}</span>
                <span className="text-sm text-muted-foreground">{line.country}</span>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-blue-600 transition-colors truncate">
                {line.name}
              </h3>
              <p className="text-sm text-muted-foreground">{line.shortName}</p>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-blue-600">{(line.teu / 1000000).toFixed(2)}M</div>
              <div className="text-xs text-muted-foreground">TEU Capacity</div>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-emerald-600">{line.fleet.vessels}</div>
              <div className="text-xs text-muted-foreground">Vessels</div>
            </div>
          </div>

          {/* Market Share Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Market Share</span>
              <span className="font-medium">{line.marketShare}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500 group-hover:from-blue-400 group-hover:to-indigo-400"
                style={{ width: `${Math.min(line.marketShare * 4, 100)}%` }}
              />
            </div>
          </div>

          {/* Alliance Badge */}
          <div className="flex flex-wrap gap-1 mb-3">
            <Badge className={`text-xs ${allianceClass}`}>
              {primaryAlliance}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Founded {line.founded}
            </Badge>
          </div>

          {/* Services */}
          <div className="flex flex-wrap gap-1">
            {line.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {line.services.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{line.services.length - 3} more
              </Badge>
            )}
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <span className="text-xs text-muted-foreground line-clamp-1">{line.headquarters}</span>
            <ArrowRight className="h-4 w-4 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function ShippingLinesPage() {
  const topLines = getTopShippingLines(10);
  const otherLines = shippingLines.slice(10);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-white/20 text-white border-0">
                <Ship className="h-3 w-3 mr-1" />
                Industry Directory
              </Badge>
              <Badge className="bg-white/20 text-white border-0">
                {shippingLines.length}+ Carriers
              </Badge>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Shipping Lines Directory
            </h1>
            
            <p className="text-xl text-white/90 mb-8 max-w-3xl leading-relaxed">
              Find all major container shipping companies worldwide. Compare fleet capacity, 
              market share, routes, services, and connect directly with official websites.
            </p>

            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input 
                  placeholder="Search shipping lines..." 
                  className="pl-12 h-14 rounded-xl text-base bg-white/95 text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{shippingLinesStats.total}+</div>
              <div className="text-sm text-muted-foreground mt-1">Shipping Lines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600">{(shippingLinesStats.totalTeu / 1000000).toFixed(1)}M</div>
              <div className="text-sm text-muted-foreground mt-1">Total TEU Capacity</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{shippingLinesStats.totalVessels.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground mt-1">Total Vessels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600">{shippingLinesStats.topCountries.length}</div>
              <div className="text-sm text-muted-foreground mt-1">Major Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* Top 10 Shipping Lines */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Badge className="mb-3 bg-amber-100 text-amber-700 border-amber-200">
              <Star className="h-3 w-3 mr-1" />
              Top Carriers
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">
              Top 10 Shipping Lines by Capacity
            </h2>
            <p className="text-muted-foreground mt-2">
              The largest container shipping companies by TEU capacity
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topLines.map((line, index) => (
            <ShippingLineCard key={line.id} line={line} index={index} />
          ))}
        </div>
      </section>

      {/* Alliances Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <Badge className="mb-3">
              <Globe className="h-3 w-3 mr-1" />
              Major Alliances
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold">Shipping Alliances</h2>
            <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
              Major shipping alliances coordinate vessel sharing and service routes
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { 
                name: "Ocean Alliance", 
                members: ["CMA CGM", "COSCO", "Evergreen", "OOCL", "ONE"],
                color: "from-blue-500 to-indigo-500",
                description: "One of the largest alliances covering major trade routes"
              },
              { 
                name: "THE Alliance", 
                members: ["Hapag-Lloyd", "Yang Ming", "HMM", "ONE"],
                color: "from-purple-500 to-pink-500",
                description: "Partnership of major Asian and European carriers"
              },
              { 
                name: "Gemini Cooperation", 
                members: ["Maersk", "Hapag-Lloyd"],
                color: "from-emerald-500 to-teal-500",
                description: "New cooperation starting 2025"
              },
              { 
                name: "Independent Operators", 
                members: ["MSC", "ZIM", "PIL", "SM Line", "Others"],
                color: "from-amber-500 to-orange-500",
                description: "Carriers operating outside formal alliances"
              }
            ].map((alliance) => (
              <Card key={alliance.name} className="border-0 bg-white dark:bg-gray-900 shadow-lg">
                <CardContent className="p-5">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${alliance.color} flex items-center justify-center mb-4`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{alliance.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{alliance.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {alliance.members.slice(0, 3).map((member) => (
                      <Badge key={member} variant="secondary" className="text-xs">
                        {member}
                      </Badge>
                    ))}
                    {alliance.members.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{alliance.members.length - 3}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Other Shipping Lines */}
      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <Badge className="mb-3">
            <Globe className="h-3 w-3 mr-1" />
            Regional & Specialized Carriers
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold">
            All Shipping Lines
          </h2>
          <p className="text-muted-foreground mt-2">
            Browse all {shippingLines.length} shipping lines in our directory
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {otherLines.map((line, index) => {
            const flag = countryFlags[line.country] || "🌍";
            
            return (
              <Link key={line.id} href={`/directories/shipping-lines/${line.id}`}>
                <Card className="group hover:shadow-lg transition-all cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {line.shortName.substring(0, 3)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span>{flag}</span>
                          <span className="font-medium text-sm group-hover:text-blue-600 transition-colors truncate">
                            {line.name}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {(line.teu / 1000).toFixed(0)}K TEU • {line.fleet.vessels} vessels
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Info Section */}
      <section className="container mx-auto px-4 py-12 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">About Container Shipping Lines</h2>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed">
              Container shipping lines are companies that operate container vessels for the transportation of goods across oceans and seas. These carriers form the backbone of global trade, moving approximately 80% of world merchandise by volume. The industry has seen significant consolidation over the past decades, with major alliances forming to optimize routes and reduce costs.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Key Industry Players</h3>
            <p className="text-muted-foreground leading-relaxed">
              The top 10 shipping lines control over 85% of global container capacity. <strong>Mediterranean Shipping Company (MSC)</strong> currently leads the market with over 21% share, followed by <strong>Maersk</strong> at 14% and <strong>CMA CGM</strong> at 12%. These three European-based carriers operate vast networks spanning all major trade lanes.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Understanding TEU Capacity</h3>
            <p className="text-muted-foreground leading-relaxed">
              TEU (Twenty-foot Equivalent Unit) is the standard measure for container capacity. One TEU represents one standard 20-foot container. Modern container vessels can carry upwards of 24,000 TEUs, with the largest ships operated by MSC, Evergreen, and other major carriers on Asia-Europe routes.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3">Major Trade Routes</h3>
            <ul className="text-muted-foreground space-y-2">
              <li><strong>Asia-Europe:</strong> The busiest trade lane connecting manufacturing hubs to consumer markets</li>
              <li><strong>Trans-Pacific:</strong> Links Asian producers to North American consumers</li>
              <li><strong>Trans-Atlantic:</strong> Connects Europe and North America</li>
              <li><strong>Intra-Asia:</strong> Regional trade within Asian markets</li>
              <li><strong>North-South:</strong> Emerging routes to South America, Africa, and Oceania</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need Shipping Services?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Get quotes from multiple carriers and find the best rates for your shipments.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/tools/ocean-freight">
                <Ship className="h-5 w-5 mr-2" />
                Calculate Freight Rates
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              <Link href="/directories">
                Browse All Directories
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
