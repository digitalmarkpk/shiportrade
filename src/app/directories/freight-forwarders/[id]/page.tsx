import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Truck,
  Globe,
  Building2,
  MapPin,
  ArrowLeft,
  ExternalLink,
  Calendar,
  Users,
  Mail,
  Phone,
  Route,
  Layers,
  CheckCircle2,
  Star,
  Share2,
  ChevronRight,
  Award,
  Shield,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  getFreightForwarderById,
  freightForwarders,
  type FreightForwarder
} from "@/lib/data/freight-forwarders";

// Generate static params for all freight forwarders
export async function generateStaticParams() {
  return freightForwarders.map((ff) => ({
    id: ff.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const resolvedParams = await params;
  const forwarder = getFreightForwarderById(resolvedParams.id);

  if (!forwarder) {
    return {
      title: "Freight Forwarder Not Found | Shiportrade",
    };
  }

  return {
    title: `${forwarder.name} | Freight Forwarder Profile | Shiportrade`,
    description: `${forwarder.name} is a ${forwarder.country}-based freight forwarder with ${forwarder.offices} offices in ${forwarder.countries} countries. Services: ${forwarder.services?.slice(0, 3).join(", ")}. Founded ${forwarder.founded}.`,
    keywords: [
      forwarder.name,
      `${forwarder.name} freight`,
      `${forwarder.name} logistics`,
      "freight forwarder",
      "logistics company",
      forwarder.country,
      forwarder.headquarters,
      ...(forwarder.services?.slice(0, 3) || []),
    ],
    openGraph: {
      title: `${forwarder.name} | Freight Forwarder Profile`,
      description: `${forwarder.name} - ${forwarder.offices} offices, ${forwarder.countries} countries served, rated ${forwarder.rating}/5. Official profile, services, and contact information.`,
      type: "profile",
    },
    alternates: {
      canonical: `/directories/freight-forwarders/${forwarder.id}`,
    },
  };
}

// Country flags
const countryFlags: Record<string, string> = {
  "Switzerland": "🇨🇭",
  "Germany": "🇩🇪",
  "Denmark": "🇩🇰",
  "France": "🇫🇷",
  "United States": "🇺🇸",
  "Japan": "🇯🇵",
  "New Zealand": "🇳🇿",
  "Kuwait": "🇰🇼",
  "Netherlands": "🇳🇱",
  "Hong Kong": "🇭🇰",
  "India": "🇮🇳",
  "Belgium": "🇧🇪",
  "South Korea": "🇰🇷",
  "United Arab Emirates": "🇦🇪",
  "China": "🇨🇳",
  "Australia": "🇦🇺",
};

export default async function FreightForwarderDetailPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const resolvedParams = await params;
  const forwarder = getFreightForwarderById(resolvedParams.id);

  if (!forwarder) {
    notFound();
  }

  const flag = countryFlags[forwarder.country] || "🌍";

  // Get related freight forwarders (same country or region)
  const relatedForwarders = freightForwarders
    .filter(ff => ff.id !== forwarder.id && (ff.country === forwarder.country || ff.region === forwarder.region))
    .slice(0, 4);

  // Calculate position by rating
  const position = freightForwarders
    .sort((a, b) => b.rating - a.rating)
    .findIndex(ff => ff.id === forwarder.id) + 1;

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": forwarder.name,
            "url": forwarder.website,
            "foundingDate": forwarder.founded,
            "address": {
              "@type": "PostalAddress",
              "addressCountry": forwarder.country,
              "addressLocality": forwarder.headquarters
            },
            "numberOfEmployees": forwarder.employees,
            "sameAs": forwarder.website
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
            <Link href="/directories/freight-forwarders" className="text-muted-foreground hover:text-foreground">Freight Forwarders</Link>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{forwarder.name}</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0F4C81] via-[#0F4C81]/90 to-[#2E8B57] text-white">
        <div className="container mx-auto px-4 py-12 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Logo & Name */}
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                {forwarder.name.substring(0, 3).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{flag}</span>
                  <span className="text-white/80">{forwarder.country}</span>
                  <Badge className="bg-white/20 text-white border-0">
                    #{position} by Rating
                  </Badge>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{forwarder.name}</h1>
                <p className="text-lg text-white/80 mt-1">{forwarder.region}</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="lg:ml-auto flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold">{forwarder.offices}</div>
                <div className="text-sm text-white/80">Offices</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold">{forwarder.countries}</div>
                <div className="text-sm text-white/80">Countries</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 text-center">
                <div className="text-2xl font-bold flex items-center gap-1">
                  <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                  {forwarder.rating.toFixed(1)}
                </div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-8">
            <Button asChild size="lg" className="bg-white text-[#0F4C81] hover:bg-gray-100">
              <a href={forwarder.website} target="_blank" rel="noopener noreferrer">
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
                  <Building2 className="h-5 w-5 text-[#0F4C81]" />
                  About {forwarder.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {forwarder.description}
                </p>

                {/* Key Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Calendar className="h-5 w-5 text-[#0F4C81] mb-2" />
                    <div className="text-sm text-muted-foreground">Founded</div>
                    <div className="font-semibold">{forwarder.founded}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <MapPin className="h-5 w-5 text-[#2E8B57] mb-2" />
                    <div className="text-sm text-muted-foreground">Headquarters</div>
                    <div className="font-semibold">{forwarder.headquarters}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Users className="h-5 w-5 text-purple-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Employees</div>
                    <div className="font-semibold">{forwarder.employees || 'N/A'}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50">
                    <Globe className="h-5 w-5 text-amber-500 mb-2" />
                    <div className="text-sm text-muted-foreground">Region</div>
                    <div className="font-semibold">{forwarder.region}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#0F4C81]" />
                  Services Offered
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(forwarder.services || []).map((service) => (
                    <div
                      key={service}
                      className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#2E8B57] shrink-0" />
                      <span className="text-sm">{service}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trade Lanes */}
            {(forwarder.tradeLanes?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-[#0F4C81]" />
                    Trade Lanes
                  </CardTitle>
                  <CardDescription>
                    Key shipping routes served by {forwarder.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forwarder.tradeLanes.map((lane) => (
                      <Badge key={lane} variant="secondary" className="py-2 px-4">
                        <Globe className="h-3 w-3 mr-2" />
                        {lane}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Specializations */}
            {(forwarder.specializations?.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Specializations
                  </CardTitle>
                  <CardDescription>
                    Industry sectors and cargo types {forwarder.name} specializes in
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {forwarder.specializations.map((spec, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-4 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20"
                      >
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <CheckCircle2 className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="font-medium text-sm">{spec}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Certifications */}
            {(forwarder.certifications?.length > 0) && (
              <Card className="border-2">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-[#0F4C81]" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {forwarder.certifications.map((cert) => (
                      <Badge key={cert} variant="outline" className="py-1.5 px-3">
                        <Award className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Official Website */}
            <Card className="border-2 border-[#0F4C81]/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Official Website</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Visit {forwarder.name}&apos;s official website for bookings, tracking, and more information.
                  </p>
                  <Button asChild className="w-full">
                    <a href={forwarder.website} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
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
                    <span className="font-medium">{forwarder.founded}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Country</span>
                    <span className="font-medium">{flag} {forwarder.country}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">Offices</span>
                    <span className="font-medium">{forwarder.offices}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-muted-foreground">Rating Rank</span>
                    <span className="font-medium">#{position}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Forwarders */}
            {relatedForwarders.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Related Companies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {relatedForwarders.map((related) => {
                    const relatedFlag = countryFlags[related.country] || "🌍";
                    return (
                      <Link
                        key={related.id}
                        href={`/directories/freight-forwarders/${related.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center text-white font-bold text-sm">
                          {related.name.substring(0, 3).toUpperCase()}
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
          href="/directories/freight-forwarders"
          className="inline-flex items-center gap-2 text-[#0F4C81] hover:text-[#0F4C81]/80"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Freight Forwarders Directory
        </Link>
      </div>
    </div>
  );
}
