'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ExternalLink, Star, MapPin, Ship, DollarSign, TrendingUp, TrendingDown,
  Building2, Globe, Users, Container, Anchor, ArrowUpRight, ArrowDownRight,
  ChevronRight, Bookmark, Share2, Eye, Clock, Award, BarChart3, PieChart,
  Activity, Zap, Shield, CheckCircle, AlertCircle, Info
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Company {
  name: string;
  rank?: number;
  website?: string;
  headquarters?: string;
  fleetSize?: string;
  teuCapacity?: string;
  revenue?: string;
  founded?: string;
  description?: string;
  logo?: string;
  country?: string;
  employees?: string;
  marketShare?: number;
  growth?: number;
  rating?: number;
}

interface SearchResultCardsProps {
  companies: Company[];
  query: string;
  onSaveCompany?: (company: Company) => void;
}

// Company card with detailed info
function CompanyCard({ company, index, onSaveCompany }: { company: Company; index: number; onSaveCompany?: (company: Company) => void }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSaveCompany?.(company);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Card className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-300 ${isHovered ? 'scale-[1.02] ring-2 ring-[#0F4C81]/20' : ''}`}>
        <CardContent className="p-0">
          {/* Rank Banner */}
          {company.rank && (
            <div className="relative">
              <div className={`absolute top-3 left-3 z-10 flex items-center gap-1 px-3 py-1 rounded-full text-white text-sm font-bold ${
                company.rank <= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 
                company.rank <= 10 ? 'bg-gradient-to-r from-slate-600 to-slate-700' : 
                'bg-gradient-to-r from-slate-400 to-slate-500'
              }`}>
                {company.rank <= 3 && <Award className="h-4 w-4" />}
                #{company.rank}
              </div>
            </div>
          )}

          {/* Company Header */}
          <div className="p-5 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 flex-1">
                {/* Company Logo/Icon */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {company.name?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white truncate">
                      {company.name}
                    </h3>
                    {company.website && (
                      <a
                        href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F4C81] hover:text-[#2E8B57] transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    {company.country && (
                      <Badge variant="outline" className="text-xs">
                        <MapPin className="h-3 w-3 mr-1" />
                        {company.country}
                      </Badge>
                    )}
                    {company.headquarters && (
                      <span className="text-xs text-slate-500">{company.headquarters}</span>
                    )}
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className={`${isSaved ? 'text-amber-500' : 'text-slate-400'} hover:text-amber-500`}
              >
                <Star className={`h-5 w-5 ${isSaved ? 'fill-current' : ''}`} />
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="px-5 pb-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {company.teuCapacity && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-blue-600 text-xs mb-1">
                    <Container className="h-3 w-3" />
                    TEU Capacity
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{company.teuCapacity}</p>
                </div>
              )}
              {company.fleetSize && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-green-600 text-xs mb-1">
                    <Ship className="h-3 w-3" />
                    Fleet Size
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{company.fleetSize}</p>
                </div>
              )}
              {company.revenue && (
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-amber-600 text-xs mb-1">
                    <DollarSign className="h-3 w-3" />
                    Revenue
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{company.revenue}</p>
                </div>
              )}
              {company.employees && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
                  <div className="flex items-center gap-1 text-purple-600 text-xs mb-1">
                    <Users className="h-3 w-3" />
                    Employees
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">{company.employees}</p>
                </div>
              )}
            </div>
          </div>

          {/* Market Share & Growth */}
          {(company.marketShare || company.growth) && (
            <div className="px-5 pb-3">
              <div className="flex items-center gap-6">
                {company.marketShare && (
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Market Share</span>
                      <span className="font-semibold">{company.marketShare}%</span>
                    </div>
                    <Progress value={company.marketShare} className="h-2 bg-slate-200" />
                  </div>
                )}
                {company.growth && (
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                    company.growth > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {company.growth > 0 ? (
                      <ArrowUpRight className="h-4 w-4" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4" />
                    )}
                    <span className="font-semibold text-sm">{Math.abs(company.growth)}%</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {company.description && (
            <div className="px-5 pb-3">
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {company.description}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-b-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              {company.website && (
                <Button
                  asChild
                  size="sm"
                  className="bg-[#0F4C81] hover:bg-[#0F4C81]/90"
                >
                  <a
                    href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-4 w-4 mr-1" />
                    Visit Website
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="h-3 w-3" />
              Updated 2024
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Grid view for comparison
function CompanyGrid({ companies, onSaveCompany }: { companies: Company[]; onSaveCompany?: (company: Company) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {companies.map((company, idx) => (
        <CompanyCard key={company.name || idx} company={company} index={idx} onSaveCompany={onSaveCompany} />
      ))}
    </div>
  );
}

// List view for quick scanning
function CompanyList({ companies, onSaveCompany }: { companies: Company[]; onSaveCompany?: (company: Company) => void }) {
  return (
    <div className="space-y-2">
      {companies.map((company, idx) => (
        <motion.div
          key={company.name || idx}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.03 }}
          className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-[#0F4C81] hover:shadow-md transition-all group"
        >
          {/* Rank */}
          {company.rank && (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm ${
              company.rank <= 3 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 
              company.rank <= 10 ? 'bg-slate-600' : 'bg-slate-400'
            }`}>
              {company.rank}
            </div>
          )}

          {/* Company Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold truncate">{company.name}</h4>
              {company.website && (
                <a
                  href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0F4C81] opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              {company.country && <span>{company.country}</span>}
              {company.teuCapacity && <span>TEU: {company.teuCapacity}</span>}
              {company.fleetSize && <span>Fleet: {company.fleetSize}</span>}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="hidden md:flex items-center gap-4">
            {company.marketShare && (
              <div className="text-center">
                <p className="text-xs text-slate-500">Market Share</p>
                <p className="font-semibold">{company.marketShare}%</p>
              </div>
            )}
            {company.growth && (
              <div className={`flex items-center gap-1 ${company.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {company.growth > 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                <span className="font-semibold">{Math.abs(company.growth)}%</span>
              </div>
            )}
          </div>

          {/* Action */}
          {company.website && (
            <Button
              asChild
              size="sm"
              variant="outline"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Button>
          )}
        </motion.div>
      ))}
    </div>
  );
}

// Comparison table view
function ComparisonTable({ companies }: { companies: Company[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 dark:bg-slate-800">
            <th className="p-3 text-left font-semibold text-sm">Rank</th>
            <th className="p-3 text-left font-semibold text-sm">Company</th>
            <th className="p-3 text-left font-semibold text-sm">Country</th>
            <th className="p-3 text-left font-semibold text-sm">TEU Capacity</th>
            <th className="p-3 text-left font-semibold text-sm">Fleet Size</th>
            <th className="p-3 text-left font-semibold text-sm">Revenue</th>
            <th className="p-3 text-left font-semibold text-sm">Market Share</th>
            <th className="p-3 text-left font-semibold text-sm">Link</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company, idx) => (
            <motion.tr
              key={company.name || idx}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: idx * 0.03 }}
              className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/50"
            >
              <td className="p-3">
                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                  company.rank && company.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                }`}>
                  {company.rank || idx + 1}
                </span>
              </td>
              <td className="p-3 font-medium">{company.name}</td>
              <td className="p-3">
                <Badge variant="outline">{company.country || company.headquarters || '-'}</Badge>
              </td>
              <td className="p-3 font-mono text-sm">{company.teuCapacity || '-'}</td>
              <td className="p-3 font-mono text-sm">{company.fleetSize || '-'}</td>
              <td className="p-3 font-mono text-sm">{company.revenue || '-'}</td>
              <td className="p-3">
                {company.marketShare ? (
                  <div className="flex items-center gap-2">
                    <Progress value={company.marketShare} className="w-16 h-2" />
                    <span className="text-sm">{company.marketShare}%</span>
                  </div>
                ) : '-'}
              </td>
              <td className="p-3">
                {company.website && (
                  <Button asChild size="sm" variant="ghost">
                    <a
                      href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SearchResultCards({ companies, query, onSaveCompany }: SearchResultCardsProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  if (!companies || companies.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      {/* Header with view toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {companies.length} Companies Found
          </h3>
          <p className="text-sm text-slate-500">
            Results for "{query}"
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className={viewMode === 'grid' ? 'bg-[#0F4C81]' : ''}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
            className={viewMode === 'list' ? 'bg-[#0F4C81]' : ''}
          >
            <Activity className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('table')}
            className={viewMode === 'table' ? 'bg-[#0F4C81]' : ''}
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content based on view mode */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' && (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CompanyGrid companies={companies} onSaveCompany={onSaveCompany} />
          </motion.div>
        )}
        {viewMode === 'list' && (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CompanyList companies={companies} onSaveCompany={onSaveCompany} />
          </motion.div>
        )}
        {viewMode === 'table' && (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="border-0 shadow-lg overflow-hidden">
              <ComparisonTable companies={companies} />
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
