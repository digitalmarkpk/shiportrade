import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, DollarSign, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CurrencyConverter } from "@/components/tools/CurrencyConverter";

export const metadata: Metadata = {
  title: "Currency Converter - Live Exchange Rates | Shiportrade.com",
  description: "Convert between 180+ currencies with live exchange rates. Free currency converter for international trade.",
};

export default function CurrencyConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        <span>/</span>
        <Link href="/tools/international-trade" className="hover:text-foreground">International Trade</Link>
        <span>/</span>
        <span className="text-foreground">Currency Converter</span>
      </nav>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[var(--ocean)]/10 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-[var(--ocean)]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Currency Converter</h1>
            <p className="text-muted-foreground">Live exchange rates for 180+ currencies</p>
          </div>
        </div>
        <Badge className="gradient-ocean text-white">Free Tool</Badge>
      </div>

      <CurrencyConverter />
    </div>
  );
}
