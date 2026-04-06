import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Database, Globe, UserCheck, Bell, Mail } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Shiportrade.com",
  description: "Privacy Policy for Shiportrade.com - Learn how we protect your data and privacy.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2024</p>
        <Badge className="mt-4 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">We respect your privacy</Badge>
      </div>

      {/* Key Points */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6 text-center">
            <Lock className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Data Encryption</h3>
            <p className="text-sm text-muted-foreground">All data transmitted is encrypted using industry-standard TLS 1.3</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6 text-center">
            <UserCheck className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">No Data Selling</h3>
            <p className="text-sm text-muted-foreground">We never sell your personal or business data to third parties</p>
          </CardContent>
        </Card>
        <Card className="border-emerald-200 dark:border-emerald-800">
          <CardContent className="pt-6 text-center">
            <Globe className="h-8 w-8 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">GDPR Compliant</h3>
            <p className="text-sm text-muted-foreground">Fully compliant with EU GDPR and international privacy laws</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              1. Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">When you use Shiportrade.com, we may collect the following types of information:</p>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Automatically Collected Data</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Browser type and version</li>
                  <li>Operating system</li>
                  <li>Referring website</li>
                  <li>Time and date of visit</li>
                  <li>Pages visited and time spent</li>
                  <li>IP address (anonymized)</li>
                </ul>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">User-Provided Data</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Email address (for newsletter subscriptions)</li>
                  <li>Calculation inputs (processed locally, not stored)</li>
                  <li>Contact form submissions</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-purple-500" />
              2. How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">We use the information we collect for the following purposes:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>To provide and maintain our services</li>
              <li>To improve user experience and platform functionality</li>
              <li>To send newsletters and updates (only if you opt-in)</li>
              <li>To respond to inquiries and provide customer support</li>
              <li>To analyze usage patterns and improve our tools</li>
              <li>To detect and prevent fraud or abuse</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. Data Storage and Security</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>SSL/TLS encryption for all data transmission</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Data backup and recovery procedures</li>
            </ul>
            <p className="mt-4 text-sm bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <strong>Note:</strong> Most calculations on our platform are performed locally in your browser. We do not store your calculation inputs or results on our servers unless you explicitly save them to your account.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Cookies and Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">We use cookies and similar tracking technologies to:</p>
            <ul className="list-disc list-inside space-y-2 mb-4">
              <li>Remember your preferences (currency, theme, etc.)</li>
              <li>Analyze platform usage and performance</li>
              <li>Provide personalized content</li>
            </ul>
            <p>You can control cookie settings through your browser. For more details, see our <Link href="/cookies" className="text-blue-500 hover:underline">Cookie Policy</Link>.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may use third-party services that collect anonymous usage data:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li><strong>Analytics:</strong> To understand how users interact with our platform</li>
              <li><strong>CDN Services:</strong> To deliver content faster and more reliably</li>
              <li><strong>Email Services:</strong> To send newsletters and notifications</li>
            </ul>
            <p className="mt-4">These third parties are bound by confidentiality agreements and may not use your data for their own purposes.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Your Rights</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">Under GDPR and other privacy regulations, you have the right to:</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Access:</strong> Request a copy of your personal data
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Rectification:</strong> Correct inaccurate data
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Erasure:</strong> Request deletion of your data
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Portability:</strong> Receive data in a portable format
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Objection:</strong> Object to certain processing activities
              </div>
              <div className="p-3 bg-muted/50 rounded-lg text-sm">
                <strong>Withdrawal:</strong> Withdraw consent at any time
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We retain personal information only for as long as necessary to fulfill the purposes for which it was collected:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li>Newsletter subscriptions: Until you unsubscribe</li>
              <li>Contact form submissions: 90 days after resolution</li>
              <li>Analytics data: 26 months (anonymized)</li>
              <li>Account data: Until account deletion + 30 days</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Children's Privacy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children. If you become aware that a child has provided us with personal information, please contact us.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Significant changes will be communicated via email to registered users.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">If you have any questions about this Privacy Policy or our data practices, please contact us:</p>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="h-4 w-4 text-emerald-500" />
              <span>privacy@shiportrade.com</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Related */}
      <div className="mt-12 flex flex-wrap gap-4 justify-center">
        <Button asChild variant="outline">
          <Link href="/terms">Terms of Service</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/cookies">Cookie Policy</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/gdpr">GDPR Compliance</Link>
        </Button>
      </div>
    </div>
  );
}
