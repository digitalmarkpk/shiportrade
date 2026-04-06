import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Code, Key, Book, Zap, Shield, Globe, Terminal, FileJson, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "API Documentation | Shiportrade.com",
  description: "Integrate Shiportrade calculators and tools into your applications with our API.",
};

export default function ApiDocsPage() {
  const endpoints = [
    { method: "GET", path: "/api/v1/calculators/cbm", desc: "Calculate cubic meters" },
    { method: "POST", path: "/api/v1/calculators/landed-cost", desc: "Calculate landed cost" },
    { method: "GET", path: "/api/v1/calculators/volumetric-weight", desc: "Calculate volumetric weight" },
    { method: "POST", path: "/api/v1/documents/invoice", desc: "Generate commercial invoice" },
    { method: "GET", path: "/api/v1/ports/search", desc: "Search ports by UN/LOCODE" },
    { method: "GET", path: "/api/v1/currencies/rates", desc: "Get exchange rates" },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Code className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">API Documentation</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Integrate Shiportrade's powerful calculators and tools directly into your applications, ERPs, and logistics platforms.
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">REST API</Badge>
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">JSON Response</Badge>
          <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">Rate Limited</Badge>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
        {[
          { icon: Zap, title: "Fast", desc: "<100ms response time" },
          { icon: Shield, title: "Secure", desc: "API key authentication" },
          { icon: Globe, title: "Global", desc: "Available worldwide" },
          { icon: FileJson, title: "Simple", desc: "RESTful JSON API" },
        ].map((item) => (
          <Card key={item.title} className="text-center">
            <CardContent className="pt-6">
              <item.icon className="h-8 w-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Start */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-green-500" />
            Quick Start
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Get started with our API in minutes:</p>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100 overflow-x-auto">
            <pre>{`# Example: Calculate CBM
curl -X POST "https://api.shiportrade.com/v1/calculators/cbm" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "length": 1.2,
    "width": 0.8,
    "height": 0.9,
    "quantity": 10,
    "unit": "meters"
  }'`}</pre>
          </div>
        </CardContent>
      </Card>

      {/* Endpoints */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Method</th>
                  <th className="text-left py-3 font-semibold">Endpoint</th>
                  <th className="text-left py-3 font-semibold">Description</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map((ep, index) => (
                  <tr key={index} className="border-b last:border-0">
                    <td className="py-3">
                      <Badge className={ep.method === "GET" ? "bg-green-100 text-green-700 dark:bg-green-900/30" : "bg-blue-100 text-blue-700 dark:bg-blue-900/30"}>
                        {ep.method}
                      </Badge>
                    </td>
                    <td className="py-3 font-mono text-xs">{ep.path}</td>
                    <td className="py-3 text-muted-foreground">{ep.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-amber-500" />
            Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-4">All API requests require authentication via an API key. Include your key in the Authorization header:</p>
          <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-100">
            <pre>{`Authorization: Bearer YOUR_API_KEY`}</pre>
          </div>
          <p className="mt-4">To obtain an API key, contact our business team at <a href="mailto:api@shiportrade.com" className="text-blue-500 hover:underline">api@shiportrade.com</a></p>
        </CardContent>
      </Card>

      {/* Rate Limits */}
      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">100</p>
              <p className="text-sm text-muted-foreground">requests/minute</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-emerald-600">5,000</p>
              <p className="text-sm text-muted-foreground">requests/day</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg text-center">
              <p className="text-2xl font-bold text-purple-600">100,000</p>
              <p className="text-sm text-muted-foreground">requests/month</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="max-w-2xl mx-auto text-center">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-800">
          <CardContent className="pt-8 pb-8">
            <h2 className="text-xl font-bold mb-2">Ready to Integrate?</h2>
            <p className="text-muted-foreground mb-6">Contact our team to get your API key and start building.</p>
            <div className="flex gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white">
                <Link href="/contact">
                  Get API Key
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild variant="outline">
                <a href="mailto:api@shiportrade.com">Email API Team</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
