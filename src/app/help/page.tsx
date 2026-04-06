import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HelpCircle, Search, BookOpen, MessageCircle, FileText, Calculator, Ship, Plane, Truck, Shield, Warehouse, ShoppingBag } from "lucide-react";

export const metadata: Metadata = {
  title: "Help Center | Shiportrade.com",
  description: "Get help with Shiportrade calculators, documents, and features. Find answers to common questions.",
};

export default function HelpPage() {
  const categories = [
    { icon: Calculator, title: "Calculators", count: 12, desc: "Using calculation tools" },
    { icon: FileText, title: "Documents", count: 8, desc: "Document generation" },
    { icon: Ship, title: "Ocean Freight", count: 10, desc: "Sea shipping tools" },
    { icon: Plane, title: "Air Freight", count: 5, desc: "Air cargo tools" },
    { icon: Truck, title: "Road & Rail", count: 6, desc: "Surface transport" },
    { icon: Shield, title: "Customs", count: 7, desc: "Compliance help" },
  ];

  const faqs = [
    {
      q: "Are the calculators free to use?",
      a: "Yes! All 150+ calculators on Shiportrade.com are completely free to use. No registration, no credit card, no limits.",
    },
    {
      q: "How accurate are the calculations?",
      a: "Our calculators use industry-standard formulas. However, results are estimates and should be verified with professionals for critical decisions.",
    },
    {
      q: "Can I save my calculations?",
      a: "Currently, calculations are performed locally in your browser. We recommend taking screenshots or using the export features where available.",
    },
    {
      q: "Do you support different currencies?",
      a: "Yes, we support 50+ currencies with live exchange rates. Use the currency selector in the header to change your preferred currency.",
    },
    {
      q: "How do I generate a commercial invoice?",
      a: "Navigate to Documents > Commercial Invoice, fill in the required fields, and download as PDF or print directly.",
    },
    {
      q: "Is my data secure?",
      a: "Most calculations are performed locally in your browser. We don't store your calculation inputs unless you explicitly save them to an account.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <HelpCircle className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">How can we help?</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Find answers to common questions, learn how to use our tools, and get support for Shiportrade.
        </p>
        
        {/* Search */}
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search for help articles..." 
            className="pl-12 h-12 text-base rounded-xl"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12 max-w-6xl mx-auto">
        {categories.map((cat) => (
          <Card key={cat.title} className="hover:shadow-lg transition-all cursor-pointer group text-center">
            <CardContent className="pt-6">
              <cat.icon className="h-8 w-8 text-blue-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-sm mb-1">{cat.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">{cat.desc}</p>
              <Badge variant="secondary" className="text-xs">{cat.count} articles</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Quick Start Guides</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-blue-500 mb-3" />
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground mb-4">Learn the basics of using Shiportrade calculators and document generators.</p>
              <Button variant="link" className="p-0 h-auto text-blue-600">Read Guide →</Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <Calculator className="h-8 w-8 text-emerald-500 mb-3" />
              <h3 className="font-semibold mb-2">Using Calculators</h3>
              <p className="text-sm text-muted-foreground mb-4">Step-by-step tutorials for our most popular calculation tools.</p>
              <Button variant="link" className="p-0 h-auto text-emerald-600">Read Guide →</Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <FileText className="h-8 w-8 text-purple-500 mb-3" />
              <h3 className="font-semibold mb-2">Document Generation</h3>
              <p className="text-sm text-muted-foreground mb-4">Create professional trade documents in minutes.</p>
              <Button variant="link" className="p-0 h-auto text-purple-600">Read Guide →</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQs */}
      <div className="max-w-4xl mx-auto mb-12">
        <h2 className="text-2xl font-bold text-center mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-start gap-2 mb-2">
                  <span className="text-blue-500">Q:</span>
                  {faq.q}
                </h3>
                <p className="text-muted-foreground text-sm pl-4">{faq.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Still Need Help */}
      <Card className="max-w-2xl mx-auto text-center bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-8 pb-8">
          <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Still need help?</h2>
          <p className="text-muted-foreground mb-6">Our support team is here to assist you.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline">
              <a href="mailto:support@shiportrade.com">Email Us</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
