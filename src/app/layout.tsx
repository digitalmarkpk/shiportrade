import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/layout/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { OrganizationSchema } from "@/components/seo/OrganizationSchema";
import { WebSiteSchema } from "@/components/seo/WebSiteSchema";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shiportrade.com - Global Supply Chain Intelligence Hub",
  description: "The ultimate platform for global logistics, trade finance, and supply chain management. 82+ calculators, 72+ document generators, and comprehensive trade intelligence.",
  keywords: ["logistics", "freight", "supply chain", "trade finance", "CBM calculator", "HS code", "landed cost", "shipping documents", "Incoterms"],
  authors: [{ name: "Shiportrade Team" }],
  
  // Browser Tab (Favicon) ke liye
  icons: {
    icon: "/Logo.svg",
  },

  // Google Search & Facebook Share ke liye
  openGraph: {
    title: "Shiportrade.com - Global Supply Chain Intelligence Hub",
    description: "The ultimate platform for global logistics, trade finance, and supply chain management.",
    url: "https://shiportrade.com",
    siteName: "Shiportrade",
    type: "website",
    images: [
      {
        url: "/Logo.png",
        width: 1200,
        height: 630,
        alt: "Shiportrade Logo",
      },
    ],
  },

  // Twitter Share ke liye
  twitter: {
    card: "summary_large_image",
    title: "Shiportrade.com",
    description: "Global Supply Chain Intelligence Hub",
    images: ["/Logo.png"],
  },
};
// === Google Verification Code Yahan Add Karein ===
  verification: {
    google: "google-site-verification=Uqxi_FsvFbJANEEp_eYxOyKIguZVuoyUcXFJ-voxYfs",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <OrganizationSchema />
        <WebSiteSchema />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
