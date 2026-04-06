import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Clock, Users, Rocket, Heart, Globe, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Careers | Shiportrade.com",
  description: "Join the Shiportrade team and help build the future of global trade intelligence.",
};

export default function CareersPage() {
  const positions = [
    {
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build and scale our supply chain intelligence platform using Next.js, TypeScript, and modern cloud technologies.",
    },
    {
      title: "Product Manager - Trade Tools",
      department: "Product",
      location: "Remote",
      type: "Full-time",
      description: "Define and execute the product roadmap for our calculators and document generators.",
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote",
      type: "Full-time",
      description: "Create intuitive and beautiful interfaces that make complex logistics calculations simple.",
    },
    {
      title: "Content Writer - Logistics",
      department: "Content",
      location: "Remote",
      type: "Contract",
      description: "Write educational content, guides, and documentation for international trade topics.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <Briefcase className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Join Our Mission to
          <br />
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Transform Global Trade
          </span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          We're looking for passionate people who want to make international trade more accessible, efficient, and transparent.
        </p>
      </div>

      {/* Why Join */}
      <div className="grid md:grid-cols-4 gap-4 mb-16 max-w-5xl mx-auto">
        {[
          { icon: Globe, title: "100% Remote", desc: "Work from anywhere in the world" },
          { icon: Clock, title: "Flexible Hours", desc: "Results matter more than hours" },
          { icon: Rocket, title: "Growth", desc: "Learn and grow with us" },
          { icon: Heart, title: "Impact", desc: "Help millions of traders" },
        ].map((item) => (
          <Card key={item.title} className="text-center">
            <CardContent className="pt-6">
              <item.icon className="h-8 w-8 text-purple-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Culture */}
      <Card className="max-w-4xl mx-auto mb-16 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
        <CardContent className="pt-8 pb-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Our Culture</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Zap className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Innovation First</h4>
                  <p className="text-sm text-muted-foreground">We encourage experimentation and learning from failures.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Collaboration</h4>
                  <p className="text-sm text-muted-foreground">We work together across teams and time zones.</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">User Obsessed</h4>
                  <p className="text-sm text-muted-foreground">Every decision starts with user needs.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Global Perspective</h4>
                  <p className="text-sm text-muted-foreground">We understand and serve users worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Open Positions */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Open Positions</h2>
        <div className="space-y-4">
          {positions.map((position, index) => (
            <Card key={index} className="hover:shadow-lg transition-all cursor-pointer group">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-purple-600 transition-colors">{position.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{position.description}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary">{position.department}</Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {position.location}
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {position.type}
                      </Badge>
                    </div>
                  </div>
                  <Button className="shrink-0">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No fit? */}
        <Card className="mt-8 text-center">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-2">Don't see a perfect fit?</h3>
            <p className="text-muted-foreground mb-4">We're always looking for talented people. Send us your resume!</p>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
