"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  MessageCircle,
  HelpCircle,
  BookMarked,
  Calendar,
  Globe,
  ArrowRight,
  Sparkles,
  Heart,
  Share2,
  Award,
} from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const communitySections = [
  {
    title: "Discussion Forums",
    description: "Join conversations on shipping, logistics, customs, and trade finance topics. Share knowledge and learn from industry experts.",
    icon: MessageCircle,
    color: "from-rose-500 to-pink-500",
    features: ["Topic Categories", "Expert Moderators", "Real-time Discussions"],
    status: "coming-soon",
  },
  {
    title: "Q&A Section",
    description: "Get answers to your trade questions from professionals worldwide. Vote on answers and build your reputation.",
    icon: HelpCircle,
    color: "from-violet-500 to-purple-500",
    features: ["Expert Answers", "Reputation System", "Knowledge Base"],
    status: "coming-soon",
  },
  {
    title: "Trade Stories",
    description: "Share your trade experiences and learn from others. Success stories, challenges overcome, and industry insights.",
    icon: BookMarked,
    color: "from-amber-500 to-orange-500",
    features: ["User Stories", "Industry Insights", "Lessons Learned"],
    status: "coming-soon",
  },
  {
    title: "Industry Events",
    description: "Discover and share trade events, conferences, and webinars. Connect with professionals at industry gatherings.",
    icon: Calendar,
    color: "from-teal-500 to-cyan-500",
    features: ["Event Calendar", "Networking", "RSVP System"],
    status: "coming-soon",
  },
];

const communityStats = [
  { label: "Community Members", value: "15K+", icon: Users },
  { label: "Discussions", value: "5,000+", icon: MessageCircle },
  { label: "Countries", value: "120+", icon: Globe },
  { label: "Expert Contributors", value: "500+", icon: Award },
];

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-pink-50/20 dark:from-slate-950 dark:via-rose-950/10 dark:to-pink-950/10">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <Badge className="px-4 py-1.5 text-sm bg-gradient-to-r from-rose-500 to-pink-500 text-white border-0">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Coming Soon
            </Badge>
          </div>
          
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Users className="h-10 w-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Trade Community
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect, discuss, and share knowledge with trade professionals worldwide.
            Build your network and grow together.
          </p>
        </motion.div>

        {/* Main Sections Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto mb-16"
        >
          {communitySections.map((section, index) => (
            <motion.div key={section.title} variants={itemVariants}>
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-lg`}>
                      <section.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-4">{section.title}</CardTitle>
                  <CardDescription className="text-base">
                    {section.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {section.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-pink-500 group-hover:text-white transition-all"
                    disabled
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Coming Soon
                    <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="max-w-6xl mx-auto mb-16"
        >
          <h2 className="text-2xl font-bold text-center mb-8">What We Value</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Knowledge Sharing",
                icon: Share2,
                desc: "Share your expertise and learn from others in the trade community",
                color: "from-rose-500/20 to-pink-500/20",
                iconColor: "text-rose-600 dark:text-rose-400",
              },
              {
                title: "Mutual Support",
                icon: Heart,
                desc: "Help fellow traders succeed and get support when you need it",
                color: "from-violet-500/20 to-purple-500/20",
                iconColor: "text-violet-600 dark:text-violet-400",
              },
              {
                title: "Recognition",
                icon: Award,
                desc: "Earn badges and reputation for valuable contributions",
                color: "from-amber-500/20 to-orange-500/20",
                iconColor: "text-amber-600 dark:text-amber-400",
              },
            ].map((item, index) => (
              <Card
                key={item.title}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm border-0 shadow-md hover:shadow-lg transition-all"
              >
                <CardContent className="pt-6 text-center">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Community Stats Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="bg-gradient-to-r from-rose-500 to-pink-500 border-0 shadow-xl overflow-hidden">
            <CardContent className="pt-8 pb-8 text-center text-white">
              <h2 className="text-2xl font-bold mb-2">Be Part of Something Big</h2>
              <p className="text-white/90 mb-6 max-w-xl mx-auto">
                Our community is launching soon. Be among the first to connect with trade professionals
                from around the world and share your knowledge.
              </p>
              <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto mb-6">
                {communityStats.map((stat) => (
                  <div key={stat.label}>
                    <stat.icon className="h-5 w-5 mx-auto mb-1 opacity-80" />
                    <div className="text-xl font-bold">{stat.value}</div>
                    <div className="text-xs text-white/80">{stat.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" variant="secondary" className="bg-white text-rose-600 hover:bg-white/90">
                  <Link href="/tools">
                    Explore Tools
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/50 text-white hover:bg-white/10">
                  <Link href="/contact">
                    Get Launch Update
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
