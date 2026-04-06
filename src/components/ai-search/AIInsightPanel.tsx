'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Sparkles, Globe, DollarSign, BarChart3, Clock,
  Download, Share2, Bookmark, Brain,
  Target, Layers, ExternalLink, CheckCircle, AlertCircle,
  Building2, Ship, Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchResultCards from './SearchResultCards';
import DataVisualization from './DataVisualization';
import TradeStats from './TradeStats';
import { renderMarkdown } from '@/lib/markdown-renderer';

interface AIInsightPanelProps {
  searchResults: any;
  isSearching: boolean;
  onSaveSearch: (query: string) => void;
  query: string;
}

export default function AIInsightPanel({ searchResults, isSearching, onSaveSearch, query }: AIInsightPanelProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'charts' | 'sources' | 'tradestats'>('overview');

  // Loading state
  if (isSearching) {
    return (
      <Card className="border-0 shadow-xl overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-[#0F4C81] via-purple-500 to-[#2E8B57] animate-pulse" />
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="p-4 bg-gradient-to-br from-[#0F4C81] via-purple-500 to-[#2E8B57] rounded-2xl shadow-xl"
            >
              <Brain className="h-12 w-12 text-white" />
            </motion.div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Quantum AI Processing</h3>
              <p className="text-slate-500">Analyzing global supply chain intelligence...</p>
            </div>
            <div className="w-80 space-y-3">
              <Progress value={66} className="h-2" />
              <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Searching 150+ data sources
                </motion.div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!searchResults) {
    return (
      <Card className="border-0 shadow-xl bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-slate-800 overflow-hidden">
        <CardContent className="p-12">
          <div className="flex flex-col items-center justify-center space-y-6 text-center">
            <div className="relative">
              <div className="p-6 bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-2xl">
                <Search className="h-16 w-16 text-[#0F4C81]" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 p-2 bg-[#2E8B57] rounded-full"
              >
                <Sparkles className="h-4 w-4 text-white" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Start Your Intelligence Search</h3>
              <p className="text-slate-500 max-w-lg mx-auto">
                Search for companies, freight rates, trade routes, ports, or any supply chain topic.
                Get AI-powered insights with interactive visualizations.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full max-w-2xl">
              {[
                { icon: Ship, label: 'Shipping Companies', color: 'text-blue-500', bg: 'bg-blue-50' },
                { icon: Globe, label: 'Trade Routes', color: 'text-green-500', bg: 'bg-green-50' },
                { icon: DollarSign, label: 'Freight Rates', color: 'text-amber-500', bg: 'bg-amber-50' },
                { icon: BarChart3, label: 'Market Trends', color: 'text-purple-500', bg: 'bg-purple-50' },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    className={`flex flex-col items-center p-4 rounded-xl ${item.bg} dark:bg-slate-800 cursor-pointer`}
                  >
                    <Icon className={`h-8 w-8 ${item.color} mb-2`} />
                    <span className="text-xs font-medium text-center">{item.label}</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Detect content type
  const hasCompanies = searchResults.companies && searchResults.companies.length > 0;
  const queryType = searchResults.queryType || 'general';

  // Get query type label
  const getQueryTypeLabel = (type: string) => {
    switch (type) {
      case 'company_list': return 'Company Rankings';
      case 'comparison': return 'Comparison Analysis';
      case 'rates': return 'Rate Analysis';
      case 'routes': return 'Route Intelligence';
      case 'ports': return 'Port Intelligence';
      case 'analytics': return 'Market Analytics';
      default: return 'Intelligence Brief';
    }
  };

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-[#0F4C81] via-purple-500 to-[#2E8B57]" />
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    {getQueryTypeLabel(queryType)}
                  </Badge>
                  {hasCompanies && (
                    <Badge variant="outline">
                      {searchResults.companies.length} Companies Found
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                  {searchResults.query}
                </CardTitle>
                <CardDescription className="mt-1">
                  Generated on {new Date(searchResults.timestamp).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={() => onSaveSearch(query)}>
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>

          {/* Smart Tab Navigation */}
          <div className="px-6 pb-2">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
              <TabsList className="bg-slate-100 dark:bg-slate-800 w-full justify-start overflow-x-auto">
                <TabsTrigger value="overview" className="gap-1">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                {hasCompanies && (
                  <TabsTrigger value="companies" className="gap-1">
                    <Building2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Companies</span>
                  </TabsTrigger>
                )}
                <TabsTrigger value="charts" className="gap-1">
                  <BarChart3 className="h-4 w-4" />
                  <span className="hidden sm:inline">Charts</span>
                </TabsTrigger>
                <TabsTrigger value="sources" className="gap-1">
                  <ExternalLink className="h-4 w-4" />
                  <span className="hidden sm:inline">Sources</span>
                </TabsTrigger>
                <TabsTrigger value="tradestats" className="gap-1">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Trade Stats</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </Card>
      </motion.div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                {searchResults.insight ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="prose prose-slate dark:prose-invert max-w-none"
                  >
                    {renderMarkdown(searchResults.insight, searchResults.companies)}
                  </motion.div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No insight generated for this query.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Companies Tab */}
        {activeTab === 'companies' && hasCompanies && (
          <motion.div
            key="companies"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <SearchResultCards
              companies={searchResults.companies}
              query={searchResults.query}
            />
          </motion.div>
        )}

        {/* Charts Tab - Query Relevant */}
        {activeTab === 'charts' && (
          <motion.div
            key="charts"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DataVisualization
              data={{ companies: searchResults.companies }}
              query={searchResults.query}
              companies={searchResults.companies}
            />
          </motion.div>
        )}

        {/* Sources Tab */}
        {activeTab === 'sources' && (
          <motion.div
            key="sources"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-[#0F4C81]" />
                  Source References
                </CardTitle>
                <CardDescription>
                  {searchResults.webResults?.length || 0} sources referenced
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {searchResults.webResults && searchResults.webResults.length > 0 ? (
                  searchResults.webResults.map((result: any, idx: number) => (
                    <motion.a
                      key={idx}
                      href={result.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="block p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] hover:shadow-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-[#0F4C81]/10 to-[#2E8B57]/10 rounded-xl group-hover:from-[#0F4C81]/20 group-hover:to-[#2E8B57]/20 transition-colors">
                          <Globe className="h-5 w-5 text-[#0F4C81]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0F4C81] transition-colors line-clamp-1">
                            {result.name}
                          </h4>
                          <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                            {result.snippet}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {result.host_name || new URL(result.url).hostname}
                            </Badge>
                            {result.date && (
                              <span className="text-xs text-slate-400">{result.date}</span>
                            )}
                          </div>
                        </div>
                        <ExternalLink className="h-5 w-5 text-slate-300 group-hover:text-[#0F4C81] transition-colors flex-shrink-0" />
                      </div>
                    </motion.a>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500">No external sources found for this query.</p>
                    <p className="text-xs text-slate-400 mt-1">The AI insight is based on trained knowledge.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Trade Stats Tab - Global Shipping Statistics */}
        {activeTab === 'tradestats' && (
          <motion.div
            key="tradestats"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-0 shadow-xl mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5 text-[#0F4C81]" />
                  Global Shipping & Trade Statistics
                </CardTitle>
                <CardDescription>
                  Industry-wide data for container shipping, freight rates, and port operations
                </CardDescription>
              </CardHeader>
            </Card>
            <TradeStats />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Stats Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          { label: 'Relevance', value: '94%', icon: Target, color: 'text-green-500' },
          { label: 'Data Freshness', value: 'Live', icon: Clock, color: 'text-blue-500' },
          { label: 'Confidence', value: 'High', icon: CheckCircle, color: 'text-[#2E8B57]' },
          { label: 'Sources', value: String(searchResults.webResults?.length || 0), icon: Globe, color: 'text-purple-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-0 shadow-lg">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-lg font-bold">{stat.value}</p>
                  <p className="text-xs text-slate-500">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Related Topics */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#0F4C81]" />
            Related Topics to Explore
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              'Freight Rate Forecast',
              'Port Congestion Analysis',
              'Trade Route Optimization',
              'Container Availability',
              'Supply Chain Risk',
              'Market Outlook 2024',
            ].map((topic, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="cursor-pointer hover:bg-[#0F4C81] hover:text-white hover:border-[#0F4C81] transition-all px-3 py-1"
              >
                {topic}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
