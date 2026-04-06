import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, BarChart3, Shield, CheckCircle, XCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cookie Policy | Shiportrade.com",
  description: "Cookie Policy for Shiportrade.com - Learn about how we use cookies and how to manage your preferences.",
};

export default function CookiesPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Cookie className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Cookie Policy</h1>
        <p className="text-muted-foreground">Last updated: February 2024</p>
        <Badge className="mt-4 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">Essential & Non-essential Cookies</Badge>
      </div>

      {/* Cookie Types */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card className="border-green-200 dark:border-green-800">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Essential Cookies</h3>
            <p className="text-sm text-muted-foreground">Required for the platform to function properly. Cannot be disabled.</p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6 text-center">
            <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Analytics Cookies</h3>
            <p className="text-sm text-muted-foreground">Help us understand how you use the platform. Can be disabled.</p>
          </CardContent>
        </Card>
        <Card className="border-purple-200 dark:border-purple-800">
          <CardContent className="pt-6 text-center">
            <Settings className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Preference Cookies</h3>
            <p className="text-sm text-muted-foreground">Remember your settings and preferences. Can be disabled.</p>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>What Are Cookies?</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cookies We Use</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 font-semibold">Cookie Name</th>
                    <th className="text-left py-3 font-semibold">Type</th>
                    <th className="text-left py-3 font-semibold">Duration</th>
                    <th className="text-left py-3 font-semibold">Purpose</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b">
                    <td className="py-3 font-mono text-xs">session_id</td>
                    <td><Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30">Essential</Badge></td>
                    <td>Session</td>
                    <td>Maintains your session state</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-mono text-xs">csrf_token</td>
                    <td><Badge variant="outline" className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30">Essential</Badge></td>
                    <td>Session</td>
                    <td>Security and fraud prevention</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-mono text-xs">theme</td>
                    <td><Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30">Preference</Badge></td>
                    <td>1 year</td>
                    <td>Remembers your theme preference</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-mono text-xs">currency</td>
                    <td><Badge variant="outline" className="text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30">Preference</Badge></td>
                    <td>1 year</td>
                    <td>Remembers your currency preference</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 font-mono text-xs">_ga</td>
                    <td><Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30">Analytics</Badge></td>
                    <td>2 years</td>
                    <td>Google Analytics - distinguishes users</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-mono text-xs">_gid</td>
                    <td><Badge variant="outline" className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30">Analytics</Badge></td>
                    <td>24 hours</td>
                    <td>Google Analytics - distinguishes users</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Managing Cookies</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p className="mb-4">You can control and manage cookies in several ways:</p>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Browser Settings
                </h4>
                <p className="text-sm">Most browsers allow you to manage cookie settings. You can set your browser to refuse cookies or delete certain cookies. See your browser's help section for instructions.</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  Opt-out Tools
                </h4>
                <p className="text-sm">You can opt out of Google Analytics using the <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Google Analytics Opt-out Browser Add-on</a>.</p>
              </div>
            </div>
            <p className="mt-4 text-sm bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
              <strong>Please note:</strong> Disabling essential cookies may affect the functionality of our platform. Some features may not work correctly.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Third-Party Cookies</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may use third-party services that set their own cookies:</p>
            <ul className="mt-4 list-disc list-inside space-y-2">
              <li><strong>Google Analytics:</strong> For website analytics and performance monitoring</li>
              <li><strong>Cloudflare:</strong> For security and performance optimization</li>
              <li><strong>Embedded content:</strong> Third-party content may set cookies when displayed on our site</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Updates to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <p>We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. Any changes will be posted on this page with an updated revision date.</p>
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
          <Link href="/gdpr">GDPR Compliance</Link>
        </Button>
      </div>
    </div>
  );
}
