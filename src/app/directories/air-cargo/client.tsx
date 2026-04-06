'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Plane, MapPin, Search, CheckCircle, Star, Globe, Package,
  Award, ExternalLink, Navigation, Thermometer, Zap, Truck
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  airCargoCarriers, serviceCategories, cargoTypes, regionOptions, AirCargoCarrier
} from '@/lib/data/air-cargo-carriers';

function CarrierCard({ carrier }: { carrier: AirCargoCarrier }) {
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#0F4C81] to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                {carrier.iataCode}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {carrier.name}
                  {carrier.verified && (
                    <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 mt-1">
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{carrier.icaoCode}</span>
                  <MapPin className="h-3 w-3" />
                  {carrier.headquarters}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{carrier.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {carrier.description}
          </p>
          
          <div className="flex flex-wrap gap-1.5">
            {carrier.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">
                <Plane className="h-3 w-3 mr-1" />
                {service}
              </Badge>
            ))}
            {carrier.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{carrier.services.length - 3} more
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Fleet</p>
              <p className="font-bold text-[#0F4C81]">{carrier.fleet.total}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Freighters</p>
              <p className="font-bold text-cyan-600">{carrier.fleet.freighters}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Dest.</p>
              <p className="font-bold text-[#2E8B57]">{carrier.destinations}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Countries</p>
              <p className="font-bold text-slate-700">{carrier.countriesServed}</p>
            </div>
          </div>

          {carrier.alliance && (
            <Badge variant="outline" className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200">
              <Award className="h-2.5 w-2.5 mr-1" />
              {carrier.alliance}
            </Badge>
          )}

          <div className="flex gap-2 pt-2">
            <Link href={`/directories/air-cargo/${carrier.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#0F4C81] to-cyan-600 hover:opacity-90">
                View Details
              </Button>
            </Link>
            <Button variant="outline" size="icon" asChild>
              <a href={carrier.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function AirCargoCarriersClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  const filteredCarriers = useMemo(() => {
    return airCargoCarriers.filter(c => {
      const matchesSearch = 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.iataCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || c.region === selectedRegion;
      
      const matchesService = selectedService === 'all' || 
        c.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
      
      return matchesSearch && matchesRegion && matchesService;
    });
  }, [searchQuery, selectedRegion, selectedService]);

  const stats = useMemo(() => {
    const totalFleet = airCargoCarriers.reduce((sum, c) => sum + c.fleet.total, 0);
    const totalFreighters = airCargoCarriers.reduce((sum, c) => sum + c.fleet.freighters, 0);
    const totalTonnage = airCargoCarriers.reduce((sum, c) => sum + c.capacity.annualFreightTonnage, 0);
    return { totalFleet, totalFreighters, totalTonnage };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-cyan-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0F4C81] via-cyan-700 to-[#0F4C81] text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Plane className="h-3 w-3 mr-1" />
              Global Air Freight Network
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Air Cargo Carriers Directory
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Connect with leading air cargo carriers worldwide. Express, freight, and specialized air logistics partners.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Plane className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{airCargoCarriers.length}</p>
                <p className="text-sm text-white/70">Carriers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Navigation className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{stats.totalFreighters}</p>
                <p className="text-sm text-white/70">Freighters</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Package className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{(stats.totalTonnage / 1000000).toFixed(0)}M</p>
                <p className="text-sm text-white/70">Tonnes/Year</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="browse">Browse</TabsTrigger>
            <TabsTrigger value="search">Advanced</TabsTrigger>
            <TabsTrigger value="guide">Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm">
              <div className="flex-1 min-w-[250px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by carrier name, IATA code, location..."
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
                  {serviceCategories.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="py-2 px-3">
                {filteredCarriers.length} carriers
              </Badge>
            </div>

            {/* Carriers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCarriers.map((carrier) => (
                <CarrierCard key={carrier.id} carrier={carrier} />
              ))}
            </div>

            {filteredCarriers.length === 0 && (
              <div className="text-center py-16">
                <Plane className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-600 mb-2">No carriers found</h3>
                <p className="text-slate-500">Try adjusting your search or filters</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-[#0F4C81]" />
                  Advanced Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Filter by Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {serviceCategories.map((service) => (
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
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300'
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
                <CardTitle className="text-xl">Choosing the Right Air Cargo Carrier</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0F4C81]">Key Considerations</h3>
                    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Network Coverage:</strong> Ensure the carrier serves your origin and destination airports</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Fleet Capacity:</strong> Consider freighter-only carriers for large shipments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Service Type:</strong> Express vs. standard freight based on urgency</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Specializations:</strong> Match carrier expertise to your cargo type</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-cyan-600">Cargo Type Guide</h3>
                    <div className="space-y-2">
                      {[
                        { icon: Thermometer, label: 'Temperature-Sensitive', tip: 'Choose carriers with cold chain expertise' },
                        { icon: Zap, label: 'Time-Critical', tip: 'Express carriers like FedEx, DHL, UPS' },
                        { icon: Package, label: 'General Cargo', tip: 'Belly capacity on passenger flights' },
                        { icon: Truck, label: 'Oversized Cargo', tip: 'Specialized freighters like Cargolux' }
                      ].map((item) => (
                        <div key={item.label} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                          <item.icon className="h-5 w-5 text-[#0F4C81] mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{item.label}</p>
                            <p className="text-xs text-slate-500">{item.tip}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
