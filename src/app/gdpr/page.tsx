import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, FileText, UserCheck, Globe, Mail, AlertCircle, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "GDPR Compliance | Shiportrade.com",
  description: "GDPR Compliance statement for Shiportrade.com - How we comply with EU General Data Protection Regulation.",
};

export default function GDPRPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">GDPR Compliance</h1>
        <p className="text-muted-foreground">General Data Protection Regulation</p>
        <div className="flex gap-2 justify-center mt-4">
          <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">EU Compliant</Badge>
          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Privacy First</Badge>
        </div>
      </div>

      {/* Key Compliance Points */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Data Minimization</h3>
                <p className="text-sm text-muted-foreground">We only collect data necessary for providing our services. No excessive data collection.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Purpose Limitation</h3>
                <p className="text-sm text-muted-foreground">Data is only used for the purposes explicitly stated at the time of collection.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Storage Limitation</h3>
                <p className="text-sm text-muted-foreground">Personal data is retained only as long as necessary for the specified purposes.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <CheckCircle className="h-6 w-6 text-green-500 mt-1 shrink-0" />
              <div>
                <h3 className="font-bold mb-2">Security by Design</h3>
                <p className="text-sm text-muted-foreground">Data protection measures are integrated into our systems from the ground up.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" />
              Our GDPR Commitment
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Shiportrade.com is committed to complying with the European Union's General Data Protection Regulation (GDPR), which took effect on May 25, 2018. This regulation sets high standards for data protection and privacy for all individuals within the European Union and European Economic Area.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              Your Rights Under GDPR
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">Under GDPR, you have the following rights regarding your personal data:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Access</h4>
                <p className="text-xs text-muted-foreground mt-1">Obtain confirmation and access to your personal data</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Rectification</h4>
                <p className="text-xs text-muted-foreground mt-1">Request correction of inaccurate personal data</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Erasure</h4>
                <p className="text-xs text-muted-foreground mt-1">Request deletion of your personal data</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Restriction</h4>
                <p className="text-xs text-muted-foreground mt-1">Request restriction of processing your data</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Portability</h4>
                <p className="text-xs text-muted-foreground mt-1">Receive your data in a structured, machine-readable format</p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground text-sm">Right to Object</h4>
                <p className="text-xs text-muted-foreground mt-1">Object to processing of your personal data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Upon receipt of a verified request regarding your personal data, we will respond within one month. If a request is complex or numerous, the period may be extended by two months. You will be informed of any extension within one month of receipt.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              Legal Basis for Processing
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">We process personal data based on the following legal grounds:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Consent:</strong> When you opt-in to receive newsletters or marketing communications</li>
              <li><strong>Contract:</strong> When processing is necessary to provide our services</li>
              <li><strong>Legitimate Interest:</strong> For improving our services and ensuring security</li>
              <li><strong>Legal Obligation:</strong> When required by applicable laws</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Data Breach Notification
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>In the unlikely event of a personal data breach that poses a risk to your rights and freedoms, we will notify the relevant supervisory authority within 72 hours of becoming aware of the breach. If the breach is likely to result in a high risk to your rights and freedoms, we will also notify you directly.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Protection Officer</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">For GDPR-related inquiries or to exercise your rights, contact our Data Protection Officer:</p>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="font-semibold">Data Protection Officer</p>
              <p className="text-sm mt-2">Email: <a href="mailto:dpo@shiportrade.com" className="text-blue-500 hover:underline">dpo@shiportrade.com</a></p>
              <p className="text-sm text-muted-foreground mt-1">Response within 30 days guaranteed</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>If we transfer personal data outside the EU/EEA, we ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission or transfers to countries with adequacy decisions.</p>
          </CardContent>
        </Card>
      </div>

      {/* Related */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/privacy">Privacy Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/terms">Terms of Service</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
