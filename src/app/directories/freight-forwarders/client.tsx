'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, MapPin, Globe, Star, CheckCircle, Search,
  Filter, Ship, Plane, Truck, Package, Award, Users, Phone, ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  freightForwarders, serviceTypes, certificationTypes, regionOptions, FreightForwarder
} from '@/lib/data/freight-forwarders';

const getServiceIcon = (service: string) => {
  if (service.toLowerCase().includes('sea') || service.toLowerCase().includes('ocean')) return Ship;
  if (service.toLowerCase().includes('air')) return Plane;
  if (service.toLowerCase().includes('road') || service.toLowerCase().includes('land') || service.toLowerCase().includes('truck')) return Truck;
  return Package;
};

function ForwarderCard({ forwarder }: { forwarder: FreightForwarder }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#0F4C81] to-[#2E8B57] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                {forwarder.name.charAt(0)}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {forwarder.name}
                  {forwarder.verified && (
                    <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {forwarder.headquarters}, {forwarder.country}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{forwarder.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {forwarder.description}
          </p>
          
          <div className="flex flex-wrap gap-1.5">
            {forwarder.services.slice(0, 4).map((service) => {
              const Icon = getServiceIcon(service);
              return (
                <Badge key={service} variant="secondary" className="text-xs">
                  <Icon className="h-3 w-3 mr-1" />
                  {service}
                </Badge>
              );
            })}
            {forwarder.services.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{forwarder.services.length - 4} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Offices</p>
              <p className="font-bold text-[#0F4C81]">{forwarder.offices.toLocaleString()}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Countries</p>
              <p className="font-bold text-[#2E8B57]">{forwarder.countries}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Est. Year</p>
              <p className="font-bold text-slate-700">{forwarder.founded}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {forwarder.certifications.slice(0, 3).map((cert) => (
              <Badge key={cert} variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200">
                <Award className="h-2.5 w-2.5 mr-1" />
                {cert}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/directories/freight-forwarders/${forwarder.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] hover:opacity-90">
                View Details
              </Button>
            </Link>
            <Button variant="outline" size="icon" asChild>
              <a href={forwarder.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FreightForwardersClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  const filteredForwarders = useMemo(() => {
    return freightForwarders.filter(f => {
      const matchesSearch = 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || f.region === selectedRegion;
      
      const matchesService = selectedService === 'all' || 
        f.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
      
      return matchesSearch && matchesRegion && matchesService;
    });
  }, [searchQuery, selectedRegion, selectedService]);

  const stats = useMemo(() => {
    const totalOffices = freightForwarders.reduce((sum, f) => sum + f.offices, 0);
    const totalCountries = [...new Set(freightForwarders.map(f => f.country))].length;
    const totalTEU = freightForwarders.reduce((sum, f) => sum + (f.annualTEU || 0), 0);
    return { totalOffices, totalCountries, totalTEU };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] to-[#2E8B57] text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Globe className="h-3 w-3 mr-1" />
              Global Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Freight Forwarders Directory
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Connect with verified logistics partners worldwide. Find trusted freight forwarders for sea, air, and land transportation.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Building2 className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{freightForwarders.length}</p>
                <p className="text-sm text-white/70">Forwarders</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Users className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{stats.totalCountries}</p>
                <p className="text-sm text-white/70">Countries</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Package className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{(stats.totalTEU / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-white/70">Annual TEU</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="browse">Browse All</TabsTrigger>
            <TabsTrigger value="search">Advanced Search</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search forwarders by name, location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  {regionOptions.map((region) => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceTypes.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="py-2 px-3">
                {filteredForwarders.length} results
              </Badge>
            </div>

            {/* Forwarders Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredForwarders.map((forwarder) => (
                <ForwarderCard key={forwarder.id} forwarder={forwarder} />
              ))}
            </div>

            {filteredForwarders.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No forwarders found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#0F4C81]" />
                  Advanced Search Filters
                </CardTitle>
                <CardDescription>
                  Use multiple filters to find the perfect logistics partner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Filter by Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {serviceTypes.map((service) => (
                        <Badge
                          key={service}
                          variant={selectedService === service ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all ${
                            selectedService === service 
                              ? 'bg-[#0F4C81] text-white' 
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                          onClick={() => setSelectedService(selectedService === service ? 'all' : service)}
                        >
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Filter by Region</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {regionOptions.map((region) => (
                        <button
                          key={region}
                          onClick={() => setSelectedRegion(selectedRegion === region ? 'all' : region)}
                          className={`p-3 rounded-lg border transition-all text-left ${
                            selectedRegion === region
                              ? 'border-[#2E8B57] bg-[#2E8B57]/10 text-[#2E8B57]'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl">How to Choose a Freight Forwarder</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0F4C81]">Key Considerations</h3>
                    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Experience & Reputation:</strong> Look for established forwarders with proven track records in your industry</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Global Network:</strong> Ensure they have offices and partners in your key markets</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Certifications:</strong> Check for AEO, ISO, and industry-specific certifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Technology:</strong> Modern tracking systems and digital platforms for visibility</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Financial Stability:</strong> Ensure they have the financial capacity to handle your volume</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#2E8B57]">Questions to Ask</h3>
                    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <span className="text-[#0F4C81] font-bold">1.</span>
                        What are your core trade lanes and expertise areas?
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0F4C81] font-bold">2.</span>
                        Can you provide references from similar businesses?
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0F4C81] font-bold">3.</span>
                        What cargo insurance options do you offer?
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0F4C81] font-bold">4.</span>
                        How do you handle customs clearance in different countries?
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#0F4C81] font-bold">5.</span>
                        What is your process for handling delays or cargo damage?
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Tip:</strong> Always verify a forwarder's certifications and insurance coverage before signing contracts. 
                    Consider starting with a small shipment to evaluate their service quality.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
