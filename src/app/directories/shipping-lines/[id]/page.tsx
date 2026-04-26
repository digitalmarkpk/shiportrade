import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { 
  Ship, 
  Globe, 
  Building2, 
  MapPin, 
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  Container,
  TrendingUp,
  Anchor,
  Mail,
  Phone,
  Route,
  Layers,
  CheckCircle2,
  Star,
  Share2,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  getShippingLineById,
  shippingLines,
  type ShippingLine 
} from "@/lib/data/shipping-lines";

// Generate static params for all shipping lines
export async function generateStaticParams() {
  return shippingLines.map((line) => ({
    id: line.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const line = getShippingLineById(resolvedParams.id);
  
  if (!line) {
    return {
      title: "Shipping Line Not Found | Shiportrade",
    };
  }

  return {
    title: `${line.name} (${line.shortName}) | Shipping Line Profile | Shiportrade`,
    description: `${line.name} is a ${line.country}-based shipping company with ${line.fleet.vessels} vessels and ${(line.teu / 1000000).toFixed(2)}M TEU capacity. Founded in ${line.founded}. Routes, services, contact information and official website.`,
    keywords: [
      line.name,
      line.shortName,
      `${line.shortName} shipping`,
      `${line.name} container`,
      "shipping line",
      "container carrier",
      line.country,
      line.headquarters,
      ...(line.routes || []),
      ...(line.services?.slice(0, 3) || [])
    ],
    openGraph: {
      title: `${line.name} (${line.shortName}) | Shipping Line Profile`,
      description: `${line.name} - ${line.teu.toLocaleString()} TEU capacity, ${line.fleet.vessels} vessels, ${line.marketShare}% market share. Official profile, routes, and services.`,
      type: "profile",
    },
    alternates: {
      canonical: `/directories/shipping-lines/${line.id}`,
    },
  };
}

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

// Alliance badge colors
const allianceColors: Record<string, { bg: string; text: string; border: string }> = {
  "Ocean Alliance": { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200" },
  "THE Alliance": { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200" },
  "Gemini Cooperation": { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
  "2M Alliance": { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  "Independent Operator": { bg: "bg-gray-100", text: "text-gray-700", border: "border-gray-200" },
  "Part of Maersk": { bg: "bg-sky-100", text: "text-sky-700", border: "border-sky-200" },
  "Part of CMA CGM": { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
  "Part of MSC": { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-200" },
};

function getAllianceStyle(alliance: string) {
  for (const [key, value] of Object.entries(allianceColors)) {
    if (alliance.includes(key)) return value;
  }
  return allianceColors["Independent Operator"];
}

export default async function ShippingLineDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const line = getShippingLineById(resolvedParams.id);

  if (!line) {
    notFound();
  }

  const flag = countryFlags[line.country] || "🌍";
  const alliance = line.alliances[0] || "Independent Operator";
  const allianceStyle = getAllianceStyle(alliance);

  // Get related shipping lines (same country or alliance)
  const relatedLines = shippingLines
    .filter(l => l.id !== line.id && (l.country === line.country || l.alliances.some(a => a.includes(alliance.split(" ")[0]))))
    .slice(0, 4);

  // Calculate market position
  const position = shippingLines
    .sort((a, b) => b.teu - a.teu)
    .findIndex(l => l.id === line.id) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": line.name,
            "alternateName": line.shortName,
            "url": line.website,
            "logo": line.logo,
            "foundingDate": line.founded,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": line.country,
              "addressLocality": line.headquarters
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "email": line.contact.email,
              "telephone": line.contact.phone
            },
            "numberOfEmployees": line.stats.employees,
            "sameAs": line.website
          })
        }}
      />

      {/* Breadcrumb */}
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/directories" className="text-muted-foreground hover:text-foreground">Directories</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <Link href="/directories/shipping-lines" className="text-muted-foreground hover:text-foreground">Shipping Lines</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{line.shortName}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-[url('/patterns/dots.svg')] opacity-10" />
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Logo & Name */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                {line.shortName.substring(0, 3)}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{flag}</span>
                  <span className="text-white/80">{line.country}</span>
                  <Badge className={`bg-white/20 text-white border-0`}>
                    #{position} Globally
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{line.name}</h1>
                <p className="text-lg text-white/80 mt-1">{line.shortName}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:ml-auto flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold">{(line.teu / 1000000).toFixed(2)}M</div>
                <div className="text-sm text-white/80">TEU Capacity</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold">{line.fleet.vessels}</div>
                <div className="text-sm text-white/80">Vessels</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold">{line.marketShare}%</div>
                <div className="text-sm text-white/80">Market Share</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <a href={line.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit Official Website
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  About {line.shortName}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {line.description}
                </p>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-blue-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Founded</div>
                    <div className="font-semibold">{line.founded}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-emerald-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                    <div className="font-semibold">{line.headquarters}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 text-purple-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Employees</div>
                    <div className="font-semibold">{line.stats.employees || "N/A"}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <TrendingUp className="h-5 w-5 text-amber-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Annual Revenue</div>
                    <div className="font-semibold">{line.stats.annualRevenue || "N/A"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Fleet Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Ship className="h-5 w-5 text-blue-500" />
                  Fleet & Capacity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* TEU Capacity */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">TEU Capacity</span>
                      <span className="font-medium">{line.teu.toLocaleString()} TEU</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${Math.min(line.marketShare * 4, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {line.marketShare}% of global container capacity
                    </p>
                  </div>

                  {/* Vessels */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Fleet Size</span>
                      <span className="font-medium">{line.fleet.vessels} vessels</span>
                    </div>
                    <div className="h-4 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                        style={{ width: `${Math.min((line.fleet.vessels / 825) * 100, 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Average vessel size: {Math.round(line.teu / line.fleet.vessels).toLocaleString()} TEU
                    </p>
                  </div>
                </div>

                {/* Capacity vs Market */}
                <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Market Position</div>
                      <div className="text-2xl font-bold text-blue-600">#{position} Worldwide</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-blue-700 dark:text-blue-400 font-medium">Ports Served</div>
                      <div className="text-2xl font-bold text-blue-600">{line.stats.portsServed || "500+"}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Container className="h-5 w-5 text-blue-500" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(line.services || []).map((service) => (
                    <div 
                      key={service}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trade Routes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5 text-blue-500" />
                  Major Trade Routes
                </CardTitle>
                <CardDescription>
                  Primary shipping lanes served by {line.shortName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(line.routes || []).map((route) => (
                    <Badge key={route} variant="secondary" className="py-2 px-4">
                      <Globe className="h-3 w-3 mr-2" />
                      {route}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-amber-500" />
                  Specialties
                </CardTitle>
                <CardDescription>
                  Cargo types and services {line.shortName} specializes in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(line.specialties || []).map((specialty, idx) => (
                    <div 
                      key={idx}
                      className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
                    >
                      <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                        <CheckCircle2 className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="font-medium text-sm">{specialty}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Alliance & Group */}
            <Card className="border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Alliance Membership</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={`${allianceStyle.bg} ${allianceStyle.text} ${allianceStyle.border} text-sm py-2 px-4`}>
                  <Layers className="h-4 w-4 mr-2" />
                  {alliance}
                </Badge>
                {line.alliances.length > 1 && (
                  <div className="mt-3 text-sm text-muted-foreground">
                    Also part of: {line.alliances.slice(1).join(", ")}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {line.contact.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Email</div>
                      <a href={`mailto:${line.contact.email}`} className="text-sm font-medium hover:text-blue-600">
                        {line.contact.email}
                      </a>
                    </div>
                  </div>
                )}
                {line.contact.phone && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                      <Phone className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Phone</div>
                      <a href={`tel:${line.contact.phone}`} className="text-sm font-medium hover:text-emerald-600">
                        {line.contact.phone}
                      </a>
                    </div>
                  </div>
                )}
                <Separator />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Headquarters</div>
                    <div className="text-sm font-medium">{line.headquarters}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Official Website */}
            <Card className="border-2 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Official Website</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visit {line.shortName}&apos;s official website for bookings, tracking, and more information.
                  </p>
                  <Button asChild className="w-full">
                    <a href={line.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit {line.shortName}.com
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Founded</span>
                    <span className="font-medium">{line.founded}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{flag} {line.country}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Market Share</span>
                    <span className="font-medium">{line.marketShare}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Fleet Size</span>
                    <span className="font-medium">{line.fleet.vessels} vessels</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Global Rank</span>
                    <span className="font-medium">#{position}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Lines */}
            {relatedLines.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Carriers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(relatedLines || []).map((related) => {
                    const relatedFlag = countryFlags[related.country] || "🌍";
                    return (
                      <Link 
                        key={related.id} 
                        href={`/directories/shipping-lines/${related.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {related.shortName.substring(0, 3)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{related.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {relatedFlag} {related.country}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Back Link */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/directories/shipping-lines" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shipping Lines Directory
        </Link>
      </div>
    </div>
  );
}
