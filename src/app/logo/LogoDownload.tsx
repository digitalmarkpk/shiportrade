"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Download, ExternalLink, Copy, Check, Ship, Twitter, Linkedin, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// SVG Logo Component - scalable
function ShiportradeLogo({ 
  size = 512, 
  showText = true, 
  backgroundColor = "transparent",
  textColor = "#0284c7"
}: { 
  size?: number; 
  showText?: boolean;
  backgroundColor?: string;
  textColor?: string;
}) {
  const boxSize = size * 0.35;
  const boxX = size * 0.1;
  const boxY = showText ? size * 0.15 : (size - boxSize) / 2;
  const borderRadius = size * 0.08;
  const shipSize = size * 0.22;
  const shipX = boxX + (boxSize - shipSize) / 2;
  const shipY = boxY + (boxSize - shipSize) / 2;
  
  return (
    <svg 
      width={size} 
      height={showText ? size * 0.5 : size} 
      viewBox={`0 0 ${size} ${showText ? size * 0.5 : size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background if specified */}
      {backgroundColor !== "transparent" && (
        <rect width="100%" height="100%" fill={backgroundColor} rx={size * 0.05}/>
      )}
      
      {/* Logo Box with gradient */}
      <defs>
        <linearGradient id="boxGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="50%" stopColor="#0284c7"/>
          <stop offset="100%" stopColor="#0369a1"/>
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="50%" stopColor="#0284c7"/>
          <stop offset="100%" stopColor="#0891b2"/>
        </linearGradient>
      </defs>
      
      {/* Rounded Square Box */}
      <rect 
        x={boxX} 
        y={boxY} 
        width={boxSize} 
        height={boxSize} 
        rx={borderRadius}
        fill="url(#boxGradient)"
      />
      
      {/* Ship Icon */}
      <g transform={`translate(${shipX}, ${shipY})`}>
        {/* Hull */}
        <path 
          d={`M${shipSize*0.05} ${shipSize*0.55} 
              Q${shipSize*0.1} ${shipSize*0.75} ${shipSize*0.5} ${shipSize*0.75} 
              Q${shipSize*0.9} ${shipSize*0.75} ${shipSize*0.95} ${shipSize*0.55}
              L${shipSize*0.85} ${shipSize*0.55}
              Q${shipSize*0.5} ${shipSize*0.6} ${shipSize*0.15} ${shipSize*0.55}
              Z`}
          fill="white"
        />
        {/* Cabin */}
        <rect 
          x={shipSize*0.35} 
          y={shipSize*0.3} 
          width={shipSize*0.3} 
          height={shipSize*0.25} 
          fill="white"
          rx={shipSize*0.02}
        />
        {/* Mast */}
        <rect 
          x={shipSize*0.48} 
          y={shipSize*0.05} 
          width={shipSize*0.04} 
          height={shipSize*0.35} 
          fill="white"
        />
        {/* Flag */}
        <path 
          d={`M${shipSize*0.52} ${shipSize*0.05} 
              L${shipSize*0.72} ${shipSize*0.12} 
              L${shipSize*0.52} ${shipSize*0.19} 
              Z`}
          fill="white"
        />
      </g>
      
      {/* Text */}
      {showText && (
        <text 
          x={boxX + boxSize + size * 0.05} 
          y={boxY + boxSize * 0.7}
          fontFamily="system-ui, -apple-system, sans-serif"
          fontSize={size * 0.18}
          fontWeight="bold"
          fill="url(#textGradient)"
        >
          Shiportrade
        </text>
      )}
    </svg>
  );
}

// Icon-only version for social media
function ShiportradeIcon({ 
  size = 512,
  backgroundColor = "transparent"
}: { 
  size?: number;
  backgroundColor?: string;
}) {
  const padding = size * 0.15;
  const boxSize = size - (padding * 2);
  const borderRadius = size * 0.12;
  const shipSize = boxSize * 0.6;
  const shipX = padding + (boxSize - shipSize) / 2;
  const shipY = padding + (boxSize - shipSize) / 2;
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="iconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9"/>
          <stop offset="50%" stopColor="#0284c7"/>
          <stop offset="100%" stopColor="#0369a1"/>
        </linearGradient>
      </defs>
      
      {/* Background if specified */}
      {backgroundColor !== "transparent" && (
        <rect width="100%" height="100%" fill={backgroundColor}/>
      )}
      
      {/* Rounded Square Box */}
      <rect 
        x={padding} 
        y={padding} 
        width={boxSize} 
        height={boxSize} 
        rx={borderRadius}
        fill="url(#iconGradient)"
      />
      
      {/* Ship Icon - Larger */}
      <g transform={`translate(${shipX}, ${shipY})`}>
        {/* Hull */}
        <path 
          d={`M${shipSize*0.05} ${shipSize*0.5} 
              Q${shipSize*0.15} ${shipSize*0.8} ${shipSize*0.5} ${shipSize*0.8} 
              Q${shipSize*0.85} ${shipSize*0.8} ${shipSize*0.95} ${shipSize*0.5}
              L${shipSize*0.8} ${shipSize*0.5}
              Q${shipSize*0.5} ${shipSize*0.55} ${shipSize*0.2} ${shipSize*0.5}
              Z`}
          fill="white"
        />
        {/* Cabin */}
        <rect 
          x={shipSize*0.3} 
          y={shipSize*0.2} 
          width={shipSize*0.4} 
          height={shipSize*0.28} 
          fill="white"
          rx={shipSize*0.03}
        />
        {/* Mast */}
        <rect 
          x={shipSize*0.47} 
          y={shipSize*0.02} 
          width={shipSize*0.06} 
          height={shipSize*0.35} 
          fill="white"
        />
        {/* Flag */}
        <path 
          d={`M${shipSize*0.53} ${shipSize*0.02} 
              L${shipSize*0.85} ${shipSize*0.12} 
              L${shipSize*0.53} ${shipSize*0.22} 
              Z`}
          fill="white"
        />
      </g>
    </svg>
  );
}

const downloadSizes = [
  { name: "Small", size: 128, desc: "Website favicons, small icons" },
  { name: "Medium", size: 256, desc: "Social media profile pictures" },
  { name: "Large", size: 512, desc: "Presentations, documents" },
  { name: "Extra Large", size: 1024, desc: "Print materials, high-res" },
  { name: "Ultra HD", size: 2048, desc: "Large banners, billboards" },
];

const socialFormats = [
  { name: "Facebook", icon: Facebook, size: 1200, height: 630, desc: "Cover photo" },
  { name: "LinkedIn", icon: Linkedin, size: 1200, height: 627, desc: "Banner" },
  { name: "Twitter/X", icon: Twitter, size: 1500, height: 500, desc: "Header" },
  { name: "Instagram", icon: Instagram, size: 1080, height: 1080, desc: "Profile" },
];

export default function LogoDownload() {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("icon");

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadSVG = (svgString: string, filename: string) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPNG = (svgElement: SVGSVGElement, size: number, filename: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = filename;
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgString)));
  };

  const openInNewTab = (type: "icon" | "logo", bg: string) => {
    const size = 2048;
    const svgString = type === "icon" 
      ? `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0ea5e9"/>
              <stop offset="50%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
          </defs>
          ${bg !== "transparent" ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}
          <rect x="${size*0.12}" y="${size*0.12}" width="${size*0.76}" height="${size*0.76}" rx="${size*0.1}" fill="url(#g)"/>
          <g transform="translate(${size*0.22}, ${size*0.22})">
            <path d="M${size*0.05} ${size*0.4} Q${size*0.15} ${size*0.7} ${size*0.45} ${size*0.7} Q${size*0.75} ${size*0.7} ${size*0.85} ${size*0.4} L${size*0.72} ${size*0.4} Q${size*0.45} ${size*0.45} ${size*0.18} ${size*0.4} Z" fill="white"/>
            <rect x="${size*0.27}" y="${size*0.15}" width="${size*0.36}" height="${size*0.26}" fill="white" rx="${size*0.02}"/>
            <rect x="${size*0.42}" y="${size*0.02}" width="${size*0.06}" height="${size*0.32}" fill="white"/>
            <path d="M${size*0.48} ${size*0.02} L${size*0.78} ${size*0.12} L${size*0.48} ${size*0.22} Z" fill="white"/>
          </g>
        </svg>`
      : `<svg width="${size*2}" height="${size}" viewBox="0 0 ${size*2} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0ea5e9"/>
              <stop offset="50%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0369a1"/>
            </linearGradient>
            <linearGradient id="tg" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#0ea5e9"/>
              <stop offset="50%" stop-color="#0284c7"/>
              <stop offset="100%" stop-color="#0891b2"/>
            </linearGradient>
          </defs>
          ${bg !== "transparent" ? `<rect width="100%" height="100%" fill="${bg}"/>` : ''}
          <rect x="${size*0.1}" y="${size*0.2}" width="${size*0.35}" height="${size*0.35}" rx="${size*0.04}" fill="url(#g)"/>
          <g transform="translate(${size*0.18}, ${size*0.28})">
            <path d="M${size*0.03} ${size*0.18} Q${size*0.06} ${size*0.32} ${size*0.18} ${size*0.32} Q${size*0.3} ${size*0.32} ${size*0.33} ${size*0.18} L${size*0.28} ${size*0.18} Q${size*0.18} ${size*0.2} ${size*0.08} ${size*0.18} Z" fill="white"/>
            <rect x="${size*0.1}" y="${size*0.06}" width="${size*0.16}" height="${size*0.11}" fill="white" rx="${size*0.01}"/>
            <rect x="${size*0.165}" y="${size*0.01}" width="${size*0.03}" height="${size*0.14}" fill="white"/>
            <path d="M${size*0.195} ${size*0.01} L${size*0.28} ${size*0.05} L${size*0.195} ${size*0.09} Z" fill="white"/>
          </g>
          <text x="${size*0.55}" y="${size*0.55}" font-family="system-ui, -apple-system, sans-serif" font-size="${size*0.2}" font-weight="bold" fill="url(#tg)">Shiportrade</text>
        </svg>`;
    
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <Badge className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-1.5">
              Brand Assets
            </Badge>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold mb-4"
          >
            Shiportrade Logo
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Download high-resolution logo files for your social media platforms, presentations, and marketing materials.
          </motion.p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="icon">Icon Only</TabsTrigger>
            <TabsTrigger value="logo">Full Logo</TabsTrigger>
          </TabsList>

          {/* Icon Tab */}
          <TabsContent value="icon" className="space-y-8">
            {/* Preview with Open in New Tab */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10">
                <CardTitle className="flex items-center justify-between">
                  <span>Icon Preview</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openInNewTab("icon", "transparent")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Transparent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openInNewTab("icon", "#ffffff")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open White BG
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                      onClick={() => openInNewTab("icon", "#0f172a")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Dark BG
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Click buttons to open in new tab for download</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex flex-wrap justify-center gap-8">
                  {/* Transparent */}
                  <div className="text-center">
                    <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCBmaWxsPSIjZTNlM2UzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZTNlM2UzIiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] p-6 rounded-xl inline-block">
                      <ShiportradeIcon size={150} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Transparent</p>
                  </div>
                  {/* White */}
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-xl inline-block shadow-lg">
                      <ShiportradeIcon size={150} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">White BG</p>
                  </div>
                  {/* Dark */}
                  <div className="text-center">
                    <div className="bg-slate-900 p-6 rounded-xl inline-block">
                      <ShiportradeIcon size={150} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Dark BG</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Download Sizes */}
            <Card>
              <CardHeader>
                <CardTitle>Download PNG</CardTitle>
                <CardDescription>Choose a size for your needs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {downloadSizes.map((item) => (
                    <motion.div
                      key={item.name}
                      whileHover={{ scale: 1.02 }}
                      className="border rounded-xl p-4 text-center hover:border-sky-500 transition-colors cursor-pointer group"
                    >
                      <div className="bg-muted rounded-lg p-4 mb-3 inline-block group-hover:bg-sky-50 transition-colors">
                        <ShiportradeIcon size={item.size > 256 ? 80 : item.size / 3} />
                      </div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-xs text-muted-foreground">{item.size}x{item.size}px</p>
                      <p className="text-xs text-muted-foreground mb-3">{item.desc}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="h-3 w-3 mr-1" />
                        PNG
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logo Tab */}
          <TabsContent value="logo" className="space-y-8">
            {/* Preview */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-sky-500/10 to-cyan-500/10">
                <CardTitle className="flex items-center justify-between">
                  <span>Full Logo Preview</span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openInNewTab("logo", "transparent")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Transparent
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => openInNewTab("logo", "#ffffff")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open White BG
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white"
                      onClick={() => openInNewTab("logo", "#0f172a")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Open Dark BG
                    </Button>
                  </div>
                </CardTitle>
                <CardDescription>Click buttons to open high-resolution logo in new tab</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Transparent */}
                  <div className="text-center">
                    <div className="bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImNoZWNrZXJib2FyZCIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cmVjdCBmaWxsPSIjZTNlM2UzIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiLz48cmVjdCBmaWxsPSIjZTNlM2UzIiB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgZmlsbD0idXJsKCNjaGVja2VyYm9hcmQpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] p-6 rounded-xl inline-block">
                      <ShiportradeLogo size={400} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Transparent Background</p>
                  </div>
                  {/* White */}
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-xl inline-block shadow-lg">
                      <ShiportradeLogo size={400} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">White Background</p>
                  </div>
                  {/* Dark */}
                  <div className="text-center">
                    <div className="bg-slate-900 p-6 rounded-xl inline-block">
                      <ShiportradeLogo size={400} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Dark Background</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Social Media Formats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Social Media Formats</CardTitle>
            <CardDescription>Pre-sized for popular platforms</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {socialFormats.map((format) => {
                const Icon = format.icon;
                return (
                  <motion.div
                    key={format.name}
                    whileHover={{ scale: 1.02 }}
                    className="border rounded-xl p-4 text-center hover:border-sky-500 transition-colors cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-500 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold">{format.name}</h3>
                    <p className="text-xs text-muted-foreground">{format.size}x{format.height}px</p>
                    <p className="text-xs text-muted-foreground mb-3">{format.desc}</p>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="h-3 w-3 mr-1" />
                      Download
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Color Codes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>Use these colors for consistent branding</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "Sky Blue", hex: "#0ea5e9", rgb: "rgb(14, 165, 233)" },
                { name: "Ocean Blue", hex: "#0284c7", rgb: "rgb(2, 132, 199)" },
                { name: "Deep Blue", hex: "#0369a1", rgb: "rgb(3, 105, 161)" },
                { name: "Cyan", hex: "#0891b2", rgb: "rgb(8, 145, 178)" },
              ].map((color) => (
                <motion.div
                  key={color.name}
                  whileHover={{ scale: 1.02 }}
                  className="border rounded-xl p-4 cursor-pointer group"
                  onClick={() => copyToClipboard(color.hex, color.hex)}
                >
                  <div 
                    className="w-full h-16 rounded-lg mb-3 group-hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: color.hex }}
                  />
                  <h3 className="font-semibold">{color.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-sm text-muted-foreground">{color.hex}</p>
                    {copied === color.hex ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-600 mb-2">✓ Do</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Use on white or light backgrounds</li>
                  <li>• Maintain minimum spacing around logo</li>
                  <li>• Use provided color variations</li>
                  <li>• Scale proportionally</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-600 mb-2">✗ Don't</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Stretch or distort the logo</li>
                  <li>• Change the brand colors</li>
                  <li>• Add effects like shadows or glows</li>
                  <li>• Rotate the logo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Button variant="outline" asChild>
            <a href="/">
              ← Back to Homepage
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
