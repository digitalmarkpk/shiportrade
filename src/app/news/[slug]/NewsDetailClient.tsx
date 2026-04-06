"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Share2,
  Download,
  Copy,
  Check,
  Twitter,
  Linkedin,
  Facebook,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Printer,
  Ship,
  Plane,
  DollarSign,
  Shield,
  Leaf,
  Zap,
  Truck,
  Briefcase,
  Newspaper,
  AlertTriangle,
  Loader2,
  Landmark,
  Eye,
  Maximize2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";

// Category config with proper Unsplash credits
const categoryConfig: Record<string, { icon: React.ElementType; color: string; gradient: string; image: string; imageCredit: string; imageAuthor: string; imageLink: string }> = {
  "Ocean Freight": { 
    icon: Ship, 
    color: "text-blue-600", 
    gradient: "from-blue-500 to-cyan-500", 
    image: "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Ant Rozetsky",
    imageAuthor: "Ant Rozetsky",
    imageLink: "https://unsplash.com/@antonrozetsky"
  },
  "Air Freight": { 
    icon: Plane, 
    color: "text-purple-600", 
    gradient: "from-purple-500 to-violet-500", 
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by 张 鑫",
    imageAuthor: "张 鑫",
    imageLink: "https://unsplash.com/@zhang_xinn"
  },
  "Trade Finance": { 
    icon: DollarSign, 
    color: "text-emerald-600", 
    gradient: "from-emerald-500 to-teal-500", 
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Michael Longmire",
    imageAuthor: "Michael Longmire",
    imageLink: "https://unsplash.com/@mlongmire"
  },
  "Customs": { 
    icon: Shield, 
    color: "text-rose-600", 
    gradient: "from-rose-500 to-pink-500", 
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Mick Haupt",
    imageAuthor: "Mick Haupt",
    imageLink: "https://unsplash.com/@rojekilian"
  },
  "Technology": { 
    icon: Zap, 
    color: "text-indigo-600", 
    gradient: "from-indigo-500 to-blue-500", 
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Louis Reed",
    imageAuthor: "Louis Reed",
    imageLink: "https://unsplash.com/@_louisreed"
  },
  "Sustainability": { 
    icon: Leaf, 
    color: "text-green-600", 
    gradient: "from-green-500 to-emerald-500", 
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Matt Howard",
    imageAuthor: "Matt Howard",
    imageLink: "https://unsplash.com/@thematthoward"
  },
  "Logistics": { 
    icon: Truck, 
    color: "text-orange-600", 
    gradient: "from-orange-500 to-amber-500", 
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Kyle Deang",
    imageAuthor: "Kyle Deang",
    imageLink: "https://unsplash.com/@kyledeang"
  },
  "E-Commerce": { 
    icon: Briefcase, 
    color: "text-pink-600", 
    gradient: "from-pink-500 to-rose-500", 
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by CardMapr",
    imageAuthor: "CardMapr",
    imageLink: "https://unsplash.com/@cardmapr"
  },
  "Geopolitical": { 
    icon: Landmark, 
    color: "text-red-700", 
    gradient: "from-red-600 to-rose-600", 
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=600&fit=crop&q=80",
    imageCredit: "Photo by Colin Watts",
    imageAuthor: "Colin Watts",
    imageLink: "https://unsplash.com/@colin_watts"
  },
};

const regions: Record<string, string> = {
  'global': '🌐 Global',
  'asia-pacific': '🌏 Asia Pacific',
  'europe': '🇪🇺 Europe',
  'americas': '🌎 Americas',
  'middle-east': '🕌 Middle East',
  'africa': '🌍 Africa',
};

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  category: string;
  publishedAt: string;
  source: string;
  sourceUrl: string;
  originalUrl: string;
  region: string;
  isAlert: boolean;
  trending: boolean;
  imageUrl?: string;
  imageCredit?: string;
  imageSource?: string;
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return `${diffDays}d ago`;
};

interface NewsDetailClientProps {
  slug: string;
}

export default function NewsDetailClient({ slug }: NewsDetailClientProps) {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);
  const hdCardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadingHD, setDownloadingHD] = useState(false);
  const [news, setNews] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [hdImageLoaded, setHdImageLoaded] = useState(false);
  
  // Check if saved
  useEffect(() => {
    const saved = localStorage.getItem("shiportrade-saved-news");
    if (saved && news) {
      const savedList = JSON.parse(saved);
      setIsSaved(savedList.includes(news.id));
    }
  }, [news]);
  
  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      const newsId = searchParams.get('id');
      
      if (!newsId) {
        setError('News ID not provided');
        setIsLoading(false);
        return;
      }
      
      try {
        // Fetch all news and find by ID
        const response = await fetch('/api/news?limit=100');
        const data = await response.json();
        
        if (data.success) {
          const found = data.data.find((item: NewsItem) => item.id === newsId);
          if (found) {
            setNews(found);
            // Get related news (same category, excluding current)
            const related = data.data
              .filter((item: NewsItem) => item.category === found.category && item.id !== found.id)
              .slice(0, 4);
            setRelatedNews(related);
            
            // Pre-fetch image as base64 for download
            fetchImageAsBase64(found.imageUrl || categoryConfig[found.category]?.image || categoryConfig["Ocean Freight"].image);
          } else {
            setError('News article not found');
          }
        } else {
          setError('Failed to load news');
        }
      } catch (err) {
        setError('Unable to fetch news');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNews();
  }, [searchParams]);
  
  // Fetch image as base64 for card download (avoids CORS issues)
  const fetchImageAsBase64 = async (imageUrl: string) => {
    try {
      // Use a proxy endpoint or direct fetch with CORS
      const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
      if (response.ok) {
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageBase64(reader.result as string);
        };
        reader.readAsDataURL(blob);
      }
    } catch (error) {
      // If proxy fails, try to use the image URL directly
      console.log('Could not fetch image as base64, will use original URL');
    }
  };
  
  const categoryCfg = news ? categoryConfig[news.category] || categoryConfig["Ocean Freight"] : null;
  
  // Toggle save
  const toggleSave = useCallback(() => {
    if (!news) return;
    
    const saved = localStorage.getItem("shiportrade-saved-news");
    let savedList = saved ? JSON.parse(saved) : [];
    
    if (isSaved) {
      savedList = savedList.filter((id: string) => id !== news.id);
      toast({
        title: "Removed from saved",
        description: "Article removed from your saved list",
      });
    } else {
      savedList.push(news.id);
      toast({
        title: "Saved for later",
        description: "Article added to your saved list",
      });
    }
    
    localStorage.setItem("shiportrade-saved-news", JSON.stringify(savedList));
    setIsSaved(!isSaved);
  }, [news, isSaved, toast]);
  
  // Copy link
  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast({
      title: "Link copied!",
      description: "The link has been copied to your clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  }, [toast]);
  
  // Download card as image
  const handleDownloadCard = useCallback(async () => {
    if (!cardRef.current || !news) return;
    
    setDownloading(true);
    
    try {
      // Pre-fetch the image and convert to base64 if not already done
      let imgSrc = imageBase64;
      if (!imgSrc) {
        const imageUrl = news.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80";
        
        // Try to fetch via proxy
        try {
          const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
          if (response.ok) {
            const blob = await response.blob();
            imgSrc = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch {
          // Use category image as fallback
          const categoryImage = categoryCfg?.image || categoryConfig["Ocean Freight"].image;
          try {
            const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(categoryImage)}`);
            if (response.ok) {
              const blob = await response.blob();
              imgSrc = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            }
          } catch {
            // Continue with whatever we have
          }
        }
      }
      
      // Set a data URL on the card image element for rendering
      const cardImage = cardRef.current.querySelector('.card-image') as HTMLImageElement;
      if (cardImage && imgSrc) {
        cardImage.src = imgSrc;
      }
      
      // Dynamic import of html-to-image
      const { toPng } = await import('html-to-image');
      
      // Wait a bit for image to load
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 3, // Higher resolution
        backgroundColor: '#ffffff',
        cacheBust: true,
        fetchRequestInit: {
          mode: 'cors',
        },
      });
      
      const link = document.createElement('a');
      link.download = `${news.slug}-shiportrade-news.png`;
      link.href = dataUrl;
      link.click();
      
      toast({
        title: "Card downloaded!",
        description: "The news card has been saved to your device.",
      });
    } catch (error) {
      console.error('Error generating image:', error);
      toast({
        title: "Download failed",
        description: "Please try again or use the 'View HD Image' option to save the image directly.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  }, [news, categoryCfg, imageBase64, toast]);
  
  // Handle view HD image - fetch via proxy to avoid CORS
  const handleViewHDImage = useCallback(async () => {
    setShowImageDialog(true);
    setHdImageLoaded(false);
    
    // Pre-fetch the HD image via proxy
    if (news) {
      const hdImageUrl = news.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&h=1200&fit=crop&q=95";
      try {
        const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(hdImageUrl)}`);
        if (response.ok) {
          const blob = await response.blob();
          const hdBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
          // Store the HD image for the dialog
          setImageBase64(hdBase64);
        }
      } catch (error) {
        console.log('Could not pre-fetch HD image, will load directly');
      }
    }
  }, [news, categoryCfg]);

  // Download the HD card as PNG
  const handleDownloadHDImage = useCallback(async () => {
    if (!hdCardRef.current || !news) return;

    setDownloadingHD(true);

    try {
      // Pre-fetch the image and convert to base64 if not already done
      let imgSrc = imageBase64;
      if (!imgSrc) {
        const imageUrl = news.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80";

        // Try to fetch via proxy
        try {
          const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(imageUrl)}`);
          if (response.ok) {
            const blob = await response.blob();
            imgSrc = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.readAsDataURL(blob);
            });
          }
        } catch {
          // Use category image as fallback
          const categoryImage = categoryCfg?.image || categoryConfig["Ocean Freight"].image;
          try {
            const response = await fetch(`/api/image-proxy?url=${encodeURIComponent(categoryImage)}`);
            if (response.ok) {
              const blob = await response.blob();
              imgSrc = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(blob);
              });
            }
          } catch {
            // Continue with whatever we have
          }
        }
      }

      // Set a data URL on the HD card image element for rendering
      const hdCardImage = hdCardRef.current.querySelector('.hd-card-image') as HTMLImageElement;
      if (hdCardImage && imgSrc) {
        hdCardImage.src = imgSrc;
      }

      // Dynamic import of html-to-image
      const { toPng } = await import('html-to-image');

      // Wait a bit for image to load
      await new Promise(resolve => setTimeout(resolve, 500));

      const dataUrl = await toPng(hdCardRef.current, {
        quality: 1,
        pixelRatio: 3, // Higher resolution
        backgroundColor: '#ffffff',
        cacheBust: true,
        fetchRequestInit: {
          mode: 'cors',
        },
      });

      const link = document.createElement('a');
      link.download = `${news.slug}-hd-shiportrade-news.png`;
      link.href = dataUrl;
      link.click();

      toast({
        title: "HD Card downloaded!",
        description: "The HD news card has been saved to your device.",
      });
    } catch (error) {
      console.error('Error generating HD image:', error);
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloadingHD(false);
    }
  }, [news, categoryCfg, imageBase64, toast]);
  
  // Social sharing
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = news ? `${news.title} - Read more on Shiportrade` : '';
  
  const socialShares = [
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#1DA1F2] hover:text-white',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareText)}`,
      color: 'hover:bg-[#0A66C2] hover:text-white',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: 'hover:bg-[#1877F2] hover:text-white',
    },
  ];
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading article...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !news) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">News Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || "The article you're looking for doesn't exist."}</p>
          <Button asChild>
            <Link href="/news">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to News
            </Link>
          </Button>
        </div>
      </div>
    );
  }
  
  const CategoryIcon = categoryCfg?.icon || Newspaper;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={toggleSave}>
                {isSaved ? (
                  <BookmarkCheck className="h-4 w-4 text-blue-600" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Article Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Hero Image */}
              <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-6">
                <Image
                  src={news.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80"}
                  alt={news.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Image Credit */}
                <span 
                  className="absolute bottom-3 left-3 text-xs text-white/70 hover:text-white transition-colors bg-black/50 px-2 py-1 rounded-lg backdrop-blur-sm"
                >
                  📷 {news.imageCredit || categoryCfg?.imageCredit || 'Unsplash'}
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 flex-wrap mb-3">
                    {news.isAlert && (
                      <Badge className="bg-red-500 text-white animate-pulse">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        ALERT
                      </Badge>
                    )}
                    <Badge className={`bg-gradient-to-r ${categoryCfg?.gradient} text-white`}>
                      <CategoryIcon className="h-3 w-3 mr-1" />
                      {news.category}
                    </Badge>
                    <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                      {regions[news.region] || news.region}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                {news.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="font-medium">{news.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {formatDate(news.publishedAt)}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {formatRelativeTime(news.publishedAt)}
                </div>
              </div>
            </motion.div>
            
            <Separator />
            
            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg dark:prose-invert max-w-none"
            >
              <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-6">
                {news.excerpt}
              </p>
              {/* Complete description - except last line */}
              <div className="whitespace-pre-line text-foreground leading-relaxed">
                {(() => {
                  const fullContent = news.content || news.excerpt;
                  const lines = fullContent.split('\n').filter((line: string) => line.trim() !== '');
                  if (lines.length > 1) {
                    return lines.slice(0, -1).join('\n');
                  }
                  return fullContent;
                })()}
              </div>
            </motion.div>
            
            {/* Read More Button - Links to Original Source */}
            <div className="flex justify-center my-6">
              <Button 
                asChild 
                size="default"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-lg transition-all gap-2 px-6 py-2.5 text-sm font-medium rounded-full"
              >
                <a href={news.originalUrl || news.sourceUrl} target="_blank" rel="noopener noreferrer nofollow">
                  <ExternalLink className="h-4 w-4" />
                  Read Full Article
                </a>
              </Button>
            </div>
            
            <Separator />
            
            {/* Share Section */}
            <div className="flex items-center justify-between">
              <p className="font-medium">Share this article</p>
              <div className="flex items-center gap-2">
                {socialShares.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="outline"
                      size="icon"
                      className={`rounded-full ${social.color}`}
                      asChild
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-4 w-4" />
                      </a>
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            
            {/* Credits & Attribution Section */}
            <Card className="border border-border/50 bg-muted/30">
              <CardContent className="pt-5">
                <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Credits & Attribution
                </h3>
                <div className="space-y-3 text-sm">
                  {/* Content Source */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                      <Newspaper className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground text-xs">Source:</p>
                      <p className="font-medium text-base">{news.source}</p>
                      <a 
                        href={news.originalUrl || news.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer nofollow"
                        className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        View Original Article
                      </a>
                    </div>
                  </div>
                  
                  {/* Image Credit */}
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Eye className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Featured Image:</p>
                      <p className="font-medium">
                        {news.imageCredit || categoryCfg?.imageCredit || 'Unsplash'}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {news.imageSource ? (
                          <>Image sourced from <span className="text-blue-500">{news.imageSource}</span></>
                        ) : (
                          <>via <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Unsplash</a> (Free to use)</>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t border-border/50">
                  <p className="text-xs text-muted-foreground">
                    This article is aggregated from publicly available RSS feeds for informational purposes. 
                    All content, including images, remains the property of its respective owners. 
                    Shiportrade claims no ownership of third-party content. All credits are properly attributed.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Related News */}
            {relatedNews.length > 0 && (
              <div className="pt-6">
                <h3 className="font-semibold mb-4">Related Articles</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relatedNews.map((item) => {
                    const relConfig = categoryConfig[item.category] || categoryConfig["Ocean Freight"];
                    return (
                      <Link key={item.id} href={`/news/${item.slug}?id=${item.id}`}>
                        <Card className="h-full border-0 shadow-md hover:shadow-lg transition-all cursor-pointer group overflow-hidden">
                          <CardContent className="p-4">
                            <Badge variant="outline" className={`text-xs mb-2 ${relConfig.color}`}>
                              {item.category}
                            </Badge>
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {item.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>Source: {item.source}</span>
                              <span>•</span>
                              <span>{formatRelativeTime(item.publishedAt)}</span>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar - Shareable Card - Centered */}
          <div className="lg:col-span-1 flex justify-center">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky top-24 space-y-4 flex flex-col items-center"
            >
              <p className="font-medium text-center">Shareable News Card</p>
              
              {/* Instagram/LinkedIn Size Shareable Card - 1080x1350 (4:5 ratio) */}
              <div
                ref={cardRef}
                className="bg-white rounded-2xl shadow-2xl overflow-hidden"
                style={{ width: '100%', maxWidth: '360px', aspectRatio: '4/5' }}
              >
                {/* Card Image Section - Using regular img tag for download compatibility */}
                <div className="relative h-[45%] w-full">
                  <img
                    src={imageBase64 || `/api/image-proxy?url=${encodeURIComponent(news.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=800&h=600&fit=crop&q=80")}`}
                    alt={news.title}
                    className="card-image w-full h-full object-cover"
                    crossOrigin="anonymous"
                    onContextMenu={(e) => {
                      // Allow right-click context menu for copy/save image
                      e.stopPropagation();
                    }}
                    style={{ cursor: 'context-menu' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  {/* Category Badge on Image */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`bg-gradient-to-r ${categoryCfg?.gradient} text-white text-xs shadow-lg`}>
                      {news.category}
                    </Badge>
                  </div>
                  {news.isAlert && (
                    <Badge className="absolute top-3 right-3 bg-red-500 text-white text-xs shadow-lg animate-pulse">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      ALERT
                    </Badge>
                  )}
                  {/* Image Credit */}
                  <span className="absolute bottom-2 right-2 text-[10px] text-white/70 bg-black/40 px-2 py-0.5 rounded">
                    📷 {news.imageCredit || categoryCfg?.imageCredit || 'Unsplash'}
                  </span>
                </div>
                
                {/* Card Content Section */}
                <div className="p-5 flex flex-col h-[55%]">
                  {/* Title */}
                  <h2 className="text-lg font-bold mb-3 text-gray-900 leading-tight line-clamp-3">
                    {news.title}
                  </h2>
                  
                  {/* Summary */}
                  <p className="text-sm text-gray-600 mb-4 line-clamp-4 leading-relaxed flex-grow">
                    {news.excerpt}
                  </p>
                  
                  {/* Footer */}
                  <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                          <Ship className="h-3.5 w-3.5 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900">Shiportrade</p>
                          <p className="text-[9px] text-gray-500">Global Trade Intelligence</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-medium text-gray-600">Source: {news.source}</p>
                        <p className="text-[9px] text-gray-400">{formatDate(news.publishedAt).split(',')[0]}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Download Buttons */}
              <div className="flex gap-2 w-full max-w-[360px]">
                <Button 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white gap-2"
                  onClick={handleDownloadCard}
                  disabled={downloading}
                >
                  <Download className="h-4 w-4" />
                  {downloading ? 'Generating...' : 'Download Card'}
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleViewHDImage}
                >
                  <Maximize2 className="h-4 w-4" />
                  View HD
                </Button>
              </div>
              
              {/* Social Share Buttons */}
              <div className="flex gap-2 w-full max-w-[360px]">
                {socialShares.map((social) => {
                  const Icon = social.icon;
                  return (
                    <Button
                      key={social.name}
                      variant="outline"
                      className="flex-1 gap-1.5 text-xs"
                      asChild
                    >
                      <a href={social.url} target="_blank" rel="noopener noreferrer">
                        <Icon className="h-3.5 w-3.5" />
                        {social.name}
                      </a>
                    </Button>
                  );
                })}
              </div>
              
              <Button variant="outline" className="w-full max-w-[360px] gap-2" onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Link Copied!' : 'Copy Link'}
              </Button>
            </motion.div>
          </div>
        </div>
      </main>
      
      {/* HD Image Dialog - Full News Card View (Same as Downloadable Card) */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-lg w-full max-h-[95vh] p-0 overflow-hidden bg-transparent border-0 shadow-2xl">
          <DialogClose className="absolute top-4 right-4 z-50 rounded-full bg-black/20 hover:bg-black/40 p-2 transition-colors">
            <X className="h-5 w-5 text-white" />
          </DialogClose>
          
          {/* Loading indicator */}
          {!hdImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-slate-900 rounded-2xl z-40">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
            </div>
          )}
          
          {/* HD News Card - Same format as sidebar card but larger */}
          <div
            ref={hdCardRef}
            className="bg-white rounded-2xl shadow-2xl overflow-hidden mx-auto"
            style={{ width: '100%', maxWidth: '480px', aspectRatio: '4/5' }}
          >
            {/* Card Image Section */}
            <div className="relative h-[45%] w-full">
              <img
                src={imageBase64 || `/api/image-proxy?url=${encodeURIComponent(news?.imageUrl || categoryCfg?.image || "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1600&h=1200&fit=crop&q=95")}`}
                alt={news?.title || "News image"}
                className={`hd-card-image w-full h-full object-cover transition-opacity duration-300 ${hdImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setHdImageLoaded(true)}
                crossOrigin="anonymous"
                onContextMenu={(e) => {
                  // Allow right-click context menu
                  e.stopPropagation();
                }}
                style={{ cursor: 'context-menu' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <Badge className={`bg-gradient-to-r ${categoryCfg?.gradient} text-white text-sm shadow-lg`}>
                  {news?.category}
                </Badge>
              </div>
              
              {news?.isAlert && (
                <Badge className="absolute top-4 right-4 bg-red-500 text-white text-sm shadow-lg animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  ALERT
                </Badge>
              )}
              
              {/* Image Credit */}
              <span className="absolute bottom-2 right-2 text-xs text-white/70 bg-black/40 px-2 py-1 rounded">
                📷 {news?.imageCredit || categoryCfg?.imageCredit || 'Unsplash'}
              </span>
            </div>
            
            {/* Card Content Section */}
            <div className="p-6 flex flex-col h-[55%]">
              {/* Title */}
              <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight line-clamp-3">
                {news?.title}
              </h2>
              
              {/* Summary */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-4 leading-relaxed flex-grow">
                {news?.excerpt}
              </p>
              
              {/* Footer */}
              <div className="mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Ship className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">Shiportrade</p>
                      <p className="text-xs text-gray-500">Global Trade Intelligence</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600">Source: {news?.source}</p>
                    <p className="text-xs text-gray-400">{formatDate(news?.publishedAt || '').split(',')[0]}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Action Buttons below the card */}
          <div className="space-y-2 mt-4 px-4">
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white gap-2"
                onClick={handleDownloadHDImage}
                disabled={downloadingHD}
              >
                <Download className="h-4 w-4" />
                {downloadingHD ? 'Generating...' : 'Download HD Card'}
              </Button>
              <Button
                variant="secondary"
                className="flex-1 gap-2 bg-white/90 hover:bg-white"
                onClick={() => setShowImageDialog(false)}
              >
                <ExternalLink className="h-4 w-4" />
                Back to Article
              </Button>
            </div>
            {/* Image Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-white/80 hover:bg-white text-xs"
                onClick={() => {
                  const imgUrl = news?.imageUrl || categoryCfg?.image;
                  if (imgUrl) {
                    window.open(imgUrl, '_blank');
                  }
                }}
              >
                <ExternalLink className="h-3 w-3" />
                Open Image in New Tab
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 bg-white/80 hover:bg-white text-xs"
                onClick={async () => {
                  const imgUrl = news?.imageUrl || categoryCfg?.image;
                  if (imgUrl) {
                    try {
                      await navigator.clipboard.writeText(imgUrl);
                      toast({
                        title: "Image URL Copied!",
                        description: "Image link has been copied to clipboard.",
                      });
                    } catch {
                      toast({
                        title: "Copy Failed",
                        description: "Please right-click on the image and select 'Copy Image Address'",
                      });
                    }
                  }
                }}
              >
                <Copy className="h-3 w-3" />
                Copy Image URL
              </Button>
            </div>
            <p className="text-[10px] text-center text-gray-400">
              💡 Right-click on the image above to save or copy directly
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
