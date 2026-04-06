'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, TrendingUp, AlertTriangle, Ship, Plane, Truck, Warehouse,
  Globe, DollarSign, BarChart3, LineChart, PieChart, Map, Zap, Clock,
  ChevronRight, Filter, Download, Share2, Bookmark, RefreshCw, Brain,
  Target, Eye, Layers, Activity, ArrowUpRight, ArrowDownRight, Info,
  X, Maximize2, Minimize2, Settings, Bell, Star, ExternalLink, CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import AIInsightPanel from './AIInsightPanel';
import PredictiveAnalytics from './PredictiveAnalytics';
import GlobalHeatmap from './GlobalHeatmap';
import InsightsDashboard from './InsightsDashboard';
import AnomalyAlerts from './AnomalyAlerts';
import ScenarioModeling from './ScenarioModeling';

// Search categories with icons
const searchCategories = [
  { id: 'all', label: 'All Intelligence', icon: Globe },
  { id: 'shipping', label: 'Shipping & Freight', icon: Ship },
  { id: 'ports', label: 'Ports & Terminals', icon: Warehouse },
  { id: 'trade', label: 'Trade & Tariffs', icon: DollarSign },
  { id: 'logistics', label: 'Logistics & Warehousing', icon: Truck },
  { id: 'vessels', label: 'Vessel Tracking', icon: Ship },
  { id: 'routes', label: 'Trade Routes', icon: Globe },
  { id: 'analytics', label: 'Market Analytics', icon: BarChart3 },
];

// Trending searches for quick access
const trendingSearches = [
  'Trans-Pacific freight rates trend',
  'Shanghai port congestion status',
  'Container availability index',
  'Suez Canal transit updates',
  'IMO 2023 emissions regulations',
  'Spot rate forecast Asia-Europe',
  'US-China trade tariff impact',
  'Global supply chain disruptions',
];

// Quick insight cards
const quickInsights = [
  {
    title: 'Freight Rate Alert',
    description: 'Asia-Europe spot rates up 12% this week',
    trend: 'up',
    value: '+12.3%',
    category: 'shipping',
    urgency: 'high',
  },
  {
    title: 'Port Congestion',
    description: 'Los Angeles: 18 vessels in queue',
    trend: 'down',
    value: '-5 vessels',
    category: 'ports',
    urgency: 'medium',
  },
  {
    title: 'Container Index',
    description: 'Global container availability improving',
    trend: 'up',
    value: '0.72',
    category: 'logistics',
    urgency: 'low',
  },
  {
    title: 'Trade Volume',
    description: 'China exports exceed forecasts',
    trend: 'up',
    value: '+8.5%',
    category: 'trade',
    urgency: 'medium',
  },
];

export default function QuantumAISearchEngine() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeView, setActiveView] = useState<'results' | 'dashboard' | 'heatmap' | 'predictive'>('results');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [savedSearches, setSavedSearches] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isGeneratingInsight, setIsGeneratingInsight] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle search submission
  const handleSearch = useCallback(async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowSuggestions(false);
    
    // Add to search history
    setSearchHistory(prev => {
      const newHistory = [searchQuery, ...prev.filter(h => h !== searchQuery)].slice(0, 10);
      return newHistory;
    });

    try {
      // Call the AI Search API
      const response = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          category: selectedCategory,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSearchResults({
        query: searchQuery,
        timestamp: data.timestamp || new Date().toISOString(),
        webResults: data.webResults || [],
        insight: data.insight || '',
        category: selectedCategory,
      });
      
      setAiInsight(data.insight || '');
      setActiveView('results');
    } catch (error: any) {
      console.error('Search error:', error);
      // Show error state with helpful message
      setSearchResults({
        query: searchQuery,
        timestamp: new Date().toISOString(),
        webResults: [],
        insight: `## Search Error\n\nWe encountered an issue while searching for "${searchQuery}". Please try again.\n\n**Error:** ${error.message}\n\n### Suggestions:\n- Check your internet connection\n- Try a different search query\n- Refresh the page and try again`,
        category: selectedCategory,
        error: true,
      });
    } finally {
      setIsSearching(false);
    }
  }, [query, selectedCategory]);

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Save search
  const handleSaveSearch = (searchQuery: string) => {
    setSavedSearches(prev => {
      if (prev.includes(searchQuery)) return prev;
      return [searchQuery, ...prev].slice(0, 5);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="p-3 bg-gradient-to-br from-[#0F4C81] via-purple-500 to-[#2E8B57] rounded-xl shadow-lg"
            >
              <Brain className="h-8 w-8 text-white" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0F4C81] via-purple-500 to-[#2E8B57] bg-clip-text text-transparent">
              Quantum AI Search Engine
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Revolutionary intelligence across global supply chain, shipping, trade, and logistics.
            Real-time predictive analytics, visual insights, and actionable recommendations.
          </p>
        </motion.div>

        {/* Main Search Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8"
        >
          <Card className="border-0 shadow-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
            <CardContent className="p-6">
              {/* Search Input */}
              <div className="relative mb-4">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input
                      ref={searchInputRef}
                      value={query}
                      onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyPress={handleKeyPress}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Ask anything about global trade, shipping, logistics..."
                      className="pl-12 h-14 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-[#0F4C81] rounded-xl"
                    />
                    {query && (
                      <button
                        onClick={() => setQuery('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                  <Button
                    onClick={() => handleSearch()}
                    disabled={isSearching || !query.trim()}
                    className="h-14 px-8 bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90 rounded-xl"
                  >
                    {isSearching ? (
                      <RefreshCw className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showSuggestions && query.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 z-50 overflow-hidden"
                    >
                      {/* AI-Powered Suggestions */}
                      <div className="p-3 bg-gradient-to-r from-[#0F4C81]/5 to-[#2E8B57]/5 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
                          <Brain className="h-4 w-4 text-purple-500" />
                          AI Suggestions
                        </div>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {trendingSearches
                          .filter(s => s.toLowerCase().includes(query.toLowerCase()))
                          .slice(0, 5)
                          .map((suggestion, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setQuery(suggestion);
                                setShowSuggestions(false);
                                handleSearch(suggestion);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                            >
                              <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                              <span className="text-sm">{suggestion}</span>
                            </button>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {searchCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <Button
                      key={cat.id}
                      variant={selectedCategory === cat.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`rounded-full ${selectedCategory === cat.id ? 'bg-[#0F4C81] hover:bg-[#0F4C81]/90' : ''}`}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {cat.label}
                    </Button>
                  );
                })}
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-slate-500 mr-2">Quick searches:</span>
                {trendingSearches.slice(0, 4).map((search, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="cursor-pointer hover:bg-[#0F4C81] hover:text-white transition-colors"
                    onClick={() => {
                      setQuery(search);
                      handleSearch(search);
                    }}
                  >
                    {search}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Insights Cards */}
        {!searchResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {quickInsights.map((insight, idx) => (
              <Card
                key={idx}
                className="border-0 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => {
                  setQuery(insight.description);
                  handleSearch(insight.description);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <Badge
                      variant={insight.urgency === 'high' ? 'destructive' : insight.urgency === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {insight.urgency === 'high' ? 'Alert' : insight.urgency === 'medium' ? 'Watch' : 'Info'}
                    </Badge>
                    {insight.trend === 'up' ? (
                      <ArrowUpRight className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1 group-hover:text-[#0F4C81] transition-colors">
                    {insight.title}
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">{insight.description}</p>
                  <div className={`text-lg font-bold ${insight.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {insight.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1 space-y-4"
          >
            {/* View Selector */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">View Mode</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { id: 'results', label: 'Search Results', icon: Search },
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'heatmap', label: 'Global Map', icon: Map },
                  { id: 'predictive', label: 'Predictive AI', icon: Zap },
                ].map((view) => {
                  const Icon = view.icon;
                  return (
                    <Button
                      key={view.id}
                      variant={activeView === view.id ? 'default' : 'ghost'}
                      className={`w-full justify-start ${activeView === view.id ? 'bg-[#0F4C81] hover:bg-[#0F4C81]/90' : ''}`}
                      onClick={() => setActiveView(view.id as any)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {view.label}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Search History */}
            {searchHistory.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {searchHistory.slice(0, 5).map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 truncate"
                    >
                      {item}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Saved Searches */}
            {savedSearches.length > 0 && (
              <Card className="border-0 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Bookmark className="h-4 w-4" />
                    Saved Searches
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {savedSearches.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQuery(item);
                        handleSearch(item);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 truncate flex items-center gap-2"
                    >
                      <Star className="h-3 w-3 text-amber-500" />
                      {item}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Trending Topics */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-[#2E8B57]" />
                  Trending Now
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {trendingSearches.slice(0, 6).map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setQuery(topic);
                      handleSearch(topic);
                    }}
                    className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                    <span className="truncate">{topic}</span>
                  </button>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <AnimatePresence mode="wait">
              {activeView === 'results' && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <AIInsightPanel
                    searchResults={searchResults}
                    isSearching={isSearching}
                    onSaveSearch={handleSaveSearch}
                    query={query}
                  />
                </motion.div>
              )}

              {activeView === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <InsightsDashboard />
                </motion.div>
              )}

              {activeView === 'heatmap' && (
                <motion.div
                  key="heatmap"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <GlobalHeatmap />
                </motion.div>
              )}

              {activeView === 'predictive' && (
                <motion.div
                  key="predictive"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <PredictiveAnalytics />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Anomaly Alerts Banner */}
        <AnomalyAlerts />

        {/* Scenario Modeling Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <ScenarioModeling />
        </motion.div>
      </div>
    </div>
  );
}
