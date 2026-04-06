import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertTriangle, Shield, Globe, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | Shiportrade.com",
  description: "Terms of Service and User Agreement for Shiportrade.com - Global Supply Chain Intelligence Platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <FileText className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: February 2024</p>
        <Badge className="mt-4">Version 2.0</Badge>
      </div>

      {/* Quick Summary */}
      <Card className="mb-8 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
            <CheckCircle className="h-5 w-5" />
            Quick Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li>• Our tools are provided free for legitimate business and educational purposes</li>
            <li>• Calculations are estimates and should be verified with professionals</li>
            <li>• We respect your privacy and do not sell your data</li>
            <li>• Content is provided "as is" without warranties</li>
          </ul>
        </CardContent>
      </Card>

      {/* Content */}
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>By accessing and using Shiportrade.com ("the Platform"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
            <p className="mt-4">These Terms of Service apply to all users of the Platform, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-500" />
              2. Use License
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Permission is granted to temporarily use the materials (calculators, tools, information, and software) on Shiportrade.com for personal, educational, or commercial business purposes related to logistics and trade. This is the grant of a license, not a transfer of title, and under this license you may not:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Modify or copy the materials for purposes other than legitimate business use</li>
              <li>Use the materials for any commercial purpose other than your own trade/logistics operations</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Platform</li>
              <li>Remove any copyright or other proprietary notations from the materials</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              3. Disclaimer
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>The materials on Shiportrade.com are provided on an 'as is' basis. Shiportrade.com makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
            <p className="mt-4 font-semibold text-amber-600 dark:text-amber-400">Important: All calculations, estimates, and outputs from our tools are provided for informational purposes only. They should not be relied upon as the sole basis for business, legal, or financial decisions. Always consult with qualified professionals (customs brokers, freight forwarders, accountants, lawyers) before making decisions based on these calculations.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-purple-500" />
              4. User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>As a user of Shiportrade.com, you agree to:</p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>Use the Platform only for lawful purposes related to international trade and logistics</li>
              <li>Provide accurate information when using calculators and tools</li>
              <li>Not attempt to interfere with or disrupt the Platform's operation</li>
              <li>Not use automated systems or scripts to access the Platform without permission</li>
              <li>Verify all outputs with relevant authorities and professionals before acting on them</li>
            </ul>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>5. Accuracy of Materials</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>The materials appearing on Shiportrade.com could include technical, typographical, or photographic errors. Shiportrade.com does not warrant that any of the materials on its website are accurate, complete, or current. Rates, regulations, and trade rules change frequently. Always verify with official sources.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>6. Limitations</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>In no event shall Shiportrade.com or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Shiportrade.com, even if Shiportrade.com or a Shiportrade.com authorized representative has been notified orally or in writing of the possibility of such damage.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>7. Revisions</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>The materials appearing on Shiportrade.com may include technical, typographical, or photographic errors. Shiportrade.com does not warrant that any of the materials on its website are accurate, complete, or current. Shiportrade.com may make changes to the materials contained on its website at any time without notice.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>8. Links to Other Sites</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Shiportrade.com may contain links to third-party websites. These links are provided for your convenience only. Shiportrade.com has no control over the contents of those sites or resources, and accepts no responsibility for them or for any loss or damage that may arise from your use of them.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>9. Modifications to Service</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Shiportrade.com reserves the right to modify or discontinue, temporarily or permanently, the service (or any part thereof) with or without notice. You agree that Shiportrade.com shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service.</p>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>10. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>These terms and conditions are governed by and construed in accordance with international trade laws and conventions. By using this Platform, you agree to submit to the exclusive jurisdiction of the courts located within the jurisdiction where Shiportrade.com operates.</p>
          </CardContent>
        </Card>
      </div>

      {/* Contact */}
      <Card className="mt-12 text-center">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">Questions about our Terms?</h3>
          <p className="text-muted-foreground mb-6">If you have any questions about these Terms of Service, please contact us.</p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/privacy">Privacy Policy</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
