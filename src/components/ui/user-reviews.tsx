"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Star, ThumbsUp, MessageCircle, Flag, User, ChevronDown, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Review {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  helpful: number;
  verified: boolean;
}

interface UserReviewsRatingsProps {
  toolId: string;
  toolName: string;
}

// Simulated reviews data
const generateSimulatedReviews = (toolId: string): Review[] => {
  const reviews: Review[] = [
    {
      id: "rev-1",
      userId: "user-1",
      userName: "Sarah M.",
      userRole: "Freight Forwarder",
      rating: 5,
      title: "Excellent tool for daily operations",
      content: "This calculator has become an essential part of our daily operations. The accuracy and ease of use are outstanding. Highly recommended for anyone in logistics.",
      date: "2024-12-15",
      helpful: 24,
      verified: true,
    },
    {
      id: "rev-2",
      userId: "user-2",
      userName: "John K.",
      userRole: "Import Manager",
      rating: 4,
      title: "Very helpful, small improvements needed",
      content: "Great tool overall. The calculations are accurate and the interface is intuitive. Would be perfect with export to PDF functionality.",
      date: "2024-12-10",
      helpful: 18,
      verified: true,
    },
    {
      id: "rev-3",
      userId: "user-3",
      userName: "Maria L.",
      userRole: "Supply Chain Analyst",
      rating: 5,
      title: "Best free tool I've found",
      content: "After trying many similar tools, this is by far the most comprehensive and accurate. The educational content is a great bonus.",
      date: "2024-12-05",
      helpful: 31,
      verified: true,
    },
    {
      id: "rev-4",
      userId: "user-4",
      userName: "Ahmed R.",
      userRole: "Export Coordinator",
      rating: 5,
      title: "Saves hours of manual calculation",
      content: "This tool has significantly improved our workflow. What used to take hours now takes minutes. The interface is clean and professional.",
      date: "2024-11-28",
      helpful: 15,
      verified: false,
    },
    {
      id: "rev-5",
      userId: "user-5",
      userName: "Lisa T.",
      userRole: "Logistics Manager",
      rating: 4,
      title: "Solid tool with room for growth",
      content: "Accurate calculations and good UI. Looking forward to seeing more features added. The customer support is responsive.",
      date: "2024-11-20",
      helpful: 12,
      verified: true,
    },
  ];
  
  return reviews;
};

const ratingDistribution = [
  { stars: 5, count: 67, percentage: 67 },
  { stars: 4, count: 22, percentage: 22 },
  { stars: 3, count: 8, percentage: 8 },
  { stars: 2, count: 2, percentage: 2 },
  { stars: 1, count: 1, percentage: 1 },
];

export function UserReviewsRatings({ toolId, toolName }: UserReviewsRatingsProps) {
  const [reviews] = useState<Review[]>(() => generateSimulatedReviews(toolId));
  const [sortBy, setSortBy] = useState("helpful");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [showAll, setShowAll] = useState(false);
  
  const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const totalReviews = 100; // Simulated total
  
  const sortedReviews = [...reviews]
    .filter(r => filterRating === "all" || r.rating === parseInt(filterRating))
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpful - a.helpful;
      if (sortBy === "recent") return new Date(b.date).getTime() - new Date(a.date).getTime();
      if (sortBy === "rating-high") return b.rating - a.rating;
      if (sortBy === "rating-low") return a.rating - b.rating;
      return 0;
    });
  
  const displayedReviews = showAll ? sortedReviews : sortedReviews.slice(0, 3);

  return (
    <Card className="border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-[var(--ocean)]" />
          User Reviews & Ratings
        </CardTitle>
        <CardDescription>
          See what logistics professionals are saying about this tool
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Rating Summary */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Overall Rating */}
          <div className="text-center md:text-left md:w-1/3">
            <div className="text-5xl font-bold text-[var(--ocean)]">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center md:justify-start gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Based on {totalReviews} reviews
            </p>
          </div>
          
          {/* Rating Distribution */}
          <div className="flex-1">
            {ratingDistribution.map((item) => (
              <div key={item.stars} className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm">{item.stars}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percentage}%` }}
                    transition={{ duration: 0.5, delay: item.stars * 0.1 }}
                    className="h-full bg-gradient-to-r from-[var(--ocean)] to-[var(--logistics)] rounded-full"
                  />
                </div>
                <span className="text-xs text-muted-foreground w-8">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Sort & Filter */}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="helpful">Most Helpful</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="rating-high">Highest Rated</SelectItem>
                <SelectItem value="rating-low">Lowest Rated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stars</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Write Review Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
                <DialogDescription>
                  Share your experience with {toolName}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Your Rating</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star className="h-6 w-6 text-gray-300 hover:fill-amber-400 hover:text-amber-400" />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Review Title</Label>
                  <input
                    type="text"
                    placeholder="Summarize your experience"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--ocean)]/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Your Review</Label>
                  <Textarea
                    placeholder="Tell us about your experience..."
                    rows={4}
                  />
                </div>
                <Button className="w-full">
                  Submit Review
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Reviews are moderated and may take 24-48 hours to appear
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* Reviews List */}
        <div className="space-y-4">
          {displayedReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 border rounded-xl hover:border-[var(--ocean)]/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--ocean)] to-[var(--logistics)] flex items-center justify-center text-white font-semibold">
                    {review.userName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{review.userName}</span>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-500/30">
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{review.userRole}</span>
                      <span>•</span>
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating
                          ? "fill-amber-400 text-amber-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
              
              <h4 className="font-medium mb-1">{review.title}</h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.content}
              </p>
              
              <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--ocean)] transition-colors">
                  <ThumbsUp className="h-4 w-4" />
                  Helpful ({review.helpful})
                </button>
                <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors">
                  <Flag className="h-4 w-4" />
                  Report
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Show More Button */}
        {sortedReviews.length > 3 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="gap-2"
            >
              {showAll ? "Show Less" : `Show All ${sortedReviews.length} Reviews`}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
            </Button>
          </div>
        )}
        
        {/* Premium Feature Notice */}
        <div className="p-4 bg-gradient-to-r from-[var(--ocean)]/5 to-[var(--logistics)]/5 rounded-xl border">
          <p className="text-sm text-muted-foreground text-center">
            <User className="h-4 w-4 inline mr-1" />
            <strong>Premium Feature:</strong> Unlock advanced analytics, response management, and priority support with a Pro subscription.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Compact Star Rating Component
export function StarRating({ rating, maxRating = 5, size = "md" }: { rating: number; maxRating?: number; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };
  
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: maxRating }).map((_, index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} ${
            index < rating
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
          }`}
        />
      ))}
    </div>
  );
}

// Interactive Star Rating Input
export function StarRatingInput({ 
  value, 
  onChange, 
  size = "lg" 
}: { 
  value: number; 
  onChange: (rating: number) => void; 
  size?: "sm" | "md" | "lg" 
}) {
  const [hoverValue, setHoverValue] = useState(0);
  
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className="p-0.5 hover:scale-110 transition-transform"
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors ${
              star <= (hoverValue || value)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
