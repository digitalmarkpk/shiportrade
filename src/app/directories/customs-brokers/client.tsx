'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, MapPin, Search, CheckCircle, Star, FileCheck,
  Globe, Award, Phone, ExternalLink, Briefcase, Users
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  customsBrokers, brokerServices, brokerSpecialties, CustomsBroker
} from '@/lib/data/customs-brokers';

function BrokerCard({ broker }: { broker: CustomsBroker }) {
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#2E8B57] to-[#0F4C81] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {broker.name}
                  {broker.verified && (
                    <CheckCircle className="h-4 w-4 text-[#2E8B57]" />
                  )}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3" />
                  {broker.headquarters}, {broker.country}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 px-2 py-1 rounded-lg">
              <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-amber-700 dark:text-amber-300">{broker.rating}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
            {broker.description}
          </p>
          
          <div className="flex flex-wrap gap-1.5">
            {broker.services.slice(0, 3).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">
                <FileCheck className="h-3 w-3 mr-1" />
                {service}
              </Badge>
            ))}
            {broker.services.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{broker.services.length - 3} more
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs text-slate-500 font-medium">Key Specialties</p>
            <div className="flex flex-wrap gap-1">
              {broker.specialties.slice(0, 3).map((specialty) => (
                <Badge key={specialty} variant="outline" className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Est.</p>
              <p className="font-bold text-[#0F4C81]">{broker.established}</p>
            </div>
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-2">
              <p className="text-slate-500">Clearances/Year</p>
              <p className="font-bold text-[#2E8B57]">{(broker.clearanceVolume || 0).toLocaleString()}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {broker.certifications.slice(0, 2).map((cert) => (
              <Badge key={cert} variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200">
                <Award className="h-2.5 w-2.5 mr-1" />
                {cert}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Link href={`/directories/customs-brokers/${broker.id}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-[#2E8B57] to-[#0F4C81] hover:opacity-90">
                View Profile
              </Button>
            </Link>
            <Button variant="outline" size="icon" asChild>
              <a href={broker.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function CustomsBrokersClient() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<string>('all');

  const filteredBrokers = useMemo(() => {
    return customsBrokers.filter(b => {
      const matchesSearch = 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.headquarters.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRegion = selectedRegion === 'all' || b.region === selectedRegion;
      
      const matchesService = selectedService === 'all' || 
        b.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
      
      return matchesSearch && matchesRegion && matchesService;
    });
  }, [searchQuery, selectedRegion, selectedService]);

  const regions = [...new Set(customsBrokers.map(b => b.region))];
  const totalVolume = customsBrokers.reduce((sum, b) => sum + (b.clearanceVolume || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#2E8B57] to-[#0F4C81] text-white py-16">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 bg-white/20 text-white border-white/30">
              <Shield className="h-3 w-3 mr-1" />
              Licensed Professionals
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Customs Brokers Directory
            </h1>
            <p className="text-lg text-white/80 mb-6">
              Connect with licensed customs brokers for seamless trade compliance. Expert clearance services across global ports.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Briefcase className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{customsBrokers.length}</p>
                <p className="text-sm text-white/70">Brokers</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <Globe className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{regions.length}</p>
                <p className="text-sm text-white/70">Regions</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <FileCheck className="h-6 w-6 mx-auto mb-2 text-white/80" />
                <p className="text-2xl font-bold">{(totalVolume / 1000000).toFixed(1)}M</p>
                <p className="text-sm text-white/70">Annual Clearances</p>
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
                    placeholder="Search brokers by name, location..."
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
                  {regions.map((region) => (
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
                  {brokerServices.map((service) => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="py-2 px-3">
                {filteredBrokers.length} brokers
              </Badge>
            </div>

            {/* Brokers Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBrokers.map((broker) => (
                <BrokerCard key={broker.id} broker={broker} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Advanced Search</CardTitle>
                <CardDescription>
                  Filter by services, specialties, and certifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Filter by Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {brokerServices.slice(0, 8).map((service) => (
                        <Badge
                          key={service}
                          variant={selectedService === service ? 'default' : 'outline'}
                          className={`cursor-pointer transition-all ${
                            selectedService === service 
                              ? 'bg-[#2E8B57] text-white' 
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
                    <h4 className="font-semibold text-sm text-slate-700 dark:text-slate-300">Browse by Region</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {regions.map((region) => (
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
                <CardTitle>Choosing the Right Customs Broker</CardTitle>
              </CardHeader>
              <CardContent className="prose dark:prose-invert max-w-none">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#2E8B57]">What to Look For</h3>
                    <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Valid License:</strong> Verify they hold current customs broker license in your jurisdiction</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Industry Experience:</strong> Choose brokers familiar with your product category</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Certifications:</strong> Look for AEO, C-TPAT, or equivalent certifications</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-[#2E8B57] mt-0.5 flex-shrink-0" />
                        <span><strong>Local Knowledge:</strong> Ensure expertise in specific ports you use</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-[#0F4C81]">Common Services</h3>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                      {brokerServices.slice(0, 6).map((service, i) => (
                        <li key={service} className="flex items-center gap-2">
                          <span className="w-5 h-5 bg-[#0F4C81]/10 rounded flex items-center justify-center text-[#0F4C81] text-xs font-bold">
                            {i + 1}
                          </span>
                          {service}
                        </li>
                      ))}
                    </ul>
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
