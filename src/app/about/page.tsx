import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ship, Users, Globe, Target, Zap, Award, Heart, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Shiportrade.com",
  description: "Learn about Shiportrade.com - The World's Most Complete Supply Chain Intelligence Platform built by logistics veterans.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16 max-w-4xl mx-auto">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Ship className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Built by Logistics Veterans,
          <br />
          <span className="text-gradient-hero">For Trade Professionals</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're on a mission to democratize supply chain intelligence and make professional-grade trade tools accessible to everyone.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-4xl mx-auto">
        {[
          { label: "Smart Calculators", value: "150+" },
          { label: "Document Generators", value: "120+" },
          { label: "Countries Supported", value: "180+" },
          { label: "Trade Professionals", value: "75K+" },
        ].map((stat) => (
          <Card key={stat.label} className="text-center">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mission */}
      <Card className="max-w-4xl mx-auto mb-16 border-blue-200 dark:border-blue-800 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-start gap-6">
            <Target className="h-12 w-12 text-blue-500 shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                To empower every logistics professional, freight forwarder, and trader with the tools and knowledge they need to succeed in global trade. We believe that access to accurate calculations, professional documents, and trade intelligence should not be limited by budget or technical expertise.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Values */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">User First</h3>
              <p className="text-sm text-muted-foreground">Every decision we make starts with the question: "How does this help our users?"</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Award className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Excellence</h3>
              <p className="text-sm text-muted-foreground">We strive for accuracy and reliability in every calculation and tool we build.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="font-bold text-lg mb-2">Innovation</h3>
              <p className="text-sm text-muted-foreground">We continuously improve and add new tools based on user feedback and industry needs.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Story */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-muted-foreground leading-relaxed">
                Shiportrade.com was born from a simple frustration: why should traders and logistics professionals need expensive software or consulting services just to calculate landed costs, estimate freight, or generate trade documents?
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Our founding team brings together over 20 years of combined experience in international logistics, freight forwarding, and supply chain management. We've worked with small importers struggling to understand their true costs, and large enterprises looking for quick, accurate calculations without opening complex systems.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                What started as a simple CBM calculator has grown into a comprehensive platform covering every aspect of global trade - from ocean freight to air cargo, from customs compliance to e-commerce, from sustainability metrics to blockchain traceability.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Today, we're proud to serve over 75,000 trade professionals across 180+ countries, helping them make smarter decisions, save time, and grow their businesses.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Built by Experts</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Users className="h-10 w-10 text-blue-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Logistics Professionals</h3>
              <p className="text-sm text-muted-foreground">Our team includes certified freight forwarders, customs brokers, and supply chain managers who understand the real challenges of global trade.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <TrendingUp className="h-10 w-10 text-emerald-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">Trade Finance Experts</h3>
              <p className="text-sm text-muted-foreground">We collaborate with trade finance professionals to ensure our financial tools meet industry standards and real-world requirements.</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global */}
      <div className="max-w-4xl mx-auto mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Global Coverage</h2>
        <Card>
          <CardContent className="pt-6 text-center">
            <Globe className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform supports trade professionals in over 180 countries, with localized data, multi-currency support, and tools designed for the unique requirements of different markets and trade routes.
            </p>
            <div className="flex flex-wrap gap-2 justify-center mt-6">
              {["North America", "South America", "Europe", "Middle East", "Africa", "Asia Pacific", "Oceania"].map((region) => (
                <Badge key={region} variant="secondary">{region}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Trade Operations?</h2>
        <p className="text-muted-foreground mb-6">Join 75,000+ logistics professionals who trust Shiportrade daily.</p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
            <Link href="/tools">Explore Tools</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
