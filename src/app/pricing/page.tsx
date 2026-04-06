"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  X,
  Sparkles,
  Building2,
  Users,
  Zap,
  Shield,
  Clock,
  Headphones,
  FileText,
  Calculator,
  Globe,
  ArrowRight,
  Star,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const plans = [
  {
    name: "Free",
    description: "Perfect for individuals getting started",
    price: { monthly: 0, annual: 0 },
    period: "forever",
    icon: Users,
    gradient: "icon-ocean",
    features: [
      { name: "Access to all 82+ calculators", included: true },
      { name: "Basic document generators", included: true },
      { name: "Limited calculations per day", included: true, detail: "20/day" },
      { name: "Standard support", included: true },
      { name: "PDF exports", included: true },
      { name: "Save calculations", included: false },
      { name: "Custom branding", included: false },
      { name: "API access", included: false },
    ],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Pro",
    description: "For professionals and growing businesses",
    price: { monthly: 29, annual: 23 },
    period: "per month",
    icon: Sparkles,
    gradient: "icon-logistics",
    features: [
      { name: "Everything in Free, plus:", included: true, isHeader: true },
      { name: "Unlimited calculations", included: true },
      { name: "All 72+ document templates", included: true },
      { name: "Save & organize calculations", included: true },
      { name: "Custom company branding", included: true },
      { name: "Export to DOCX, XLSX", included: true },
      { name: "Document history (90 days)", included: true },
      { name: "Email support", included: true },
    ],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Business",
    description: "For teams and larger operations",
    price: { monthly: 99, annual: 79 },
    period: "per month",
    icon: Building2,
    gradient: "icon-air",
    features: [
      { name: "Everything in Pro, plus:", included: true, isHeader: true },
      { name: "Up to 10 team members", included: true },
      { name: "API access (10,000 calls/mo)", included: true },
      { name: "Document history (unlimited)", included: true },
      { name: "Shared workspaces", included: true },
      { name: "Admin dashboard", included: true },
      { name: "Priority email support", included: true },
    ],
    cta: "Start Business Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    description: "Custom solutions for organizations",
    price: { monthly: null, annual: null },
    period: "contact us",
    icon: Shield,
    gradient: "icon-ecommerce",
    features: [
      { name: "Everything in Business, plus:", included: true, isHeader: true },
      { name: "Unlimited team members", included: true },
      { name: "Unlimited API calls", included: true },
      { name: "SSO integration", included: true },
      { name: "Custom integrations", included: true },
      { name: "Dedicated account manager", included: true },
      { name: "24/7 phone support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans anytime?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the credit will be applied to future billing cycles.",
  },
  {
    question: "Is there a free trial for paid plans?",
    answer: "Yes, both Pro and Business plans come with a 14-day free trial. No credit card required to start. You'll only be charged after the trial period ends.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Enterprise plans.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes, we offer a 20% discount when you choose annual billing. Enterprise customers can also negotiate custom terms for multi-year commitments.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5 border-b border-border/40">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-[var(--ocean)]/10 to-[var(--logistics)]/10 border-[var(--ocean)]/20">
              <Zap className="h-4 w-4 mr-2 text-[var(--accent-amber)]" />
              Pricing Plans
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Choose the Right Plan
              <span className="block mt-2 text-gradient-hero">For Your Business</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              From free tools for individuals to enterprise solutions for global trade operations.
              Start free, scale as you grow.
            </p>
            
            {/* Billing Toggle */}
            <motion.div 
              className="flex items-center justify-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
              <Switch
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                className="data-[state=checked]:bg-[var(--logistics)]"
              />
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
                <Badge className="ml-2 bg-[var(--logistics)]/10 text-[var(--logistics)] border-[var(--logistics)]/20">Save 20%</Badge>
              </span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.price.annual : plan.price.monthly;
            
            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={plan.popular ? "lg:-mt-4 lg:mb-4" : ""}
              >
                <Card className={`relative h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-xl transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-[var(--logistics)] shadow-xl" : ""
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-logistics text-white px-4 py-1 text-sm shadow-lg">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-2">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl ${plan.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      {price !== null ? (
                        <>
                          <span className="text-4xl font-bold">${price}</span>
                          <span className="text-muted-foreground ml-1">/{plan.period}</span>
                        </>
                      ) : (
                        <span className="text-3xl font-bold">Custom</span>
                      )}
                    </div>
                    
                    <ul className="space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          {feature.included ? (
                            <Check className="h-4 w-4 text-[var(--logistics)] mt-0.5 shrink-0" />
                          ) : (
                            <X className="h-4 w-4 text-muted-foreground/30 mt-0.5 shrink-0" />
                          )}
                          <span className={feature.isHeader ? "font-semibold text-foreground" : ""}>
                            {feature.name}
                            {feature.detail && (
                              <span className="text-muted-foreground ml-1">({feature.detail})</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full h-12 rounded-xl ${plan.popular ? "btn-gradient text-white" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Trust Signals */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Shield, title: "Secure & Private", description: "Bank-level encryption, GDPR compliant, and SOC 2 certified. Your data is safe with us.", gradient: "icon-ocean" },
            { icon: Clock, title: "99.9% Uptime", description: "Enterprise-grade infrastructure ensures your tools are available when you need them.", gradient: "icon-logistics" },
            { icon: Headphones, title: "Expert Support", description: "Our team of logistics experts is here to help you make the most of the platform.", gradient: "icon-air" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full border-0 bg-gradient-to-br from-white to-muted/20 dark:from-card dark:to-muted/5 hover:shadow-lg transition-all">
                  <CardContent className="pt-8">
                    <motion.div 
                      className={`w-14 h-14 rounded-2xl ${item.gradient} mx-auto mb-4 flex items-center justify-center shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </motion.div>
                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <motion.div 
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-muted">
              <HelpCircle className="h-4 w-4 mr-1.5" />
              FAQ
            </Badge>
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 bg-gradient-to-r from-muted/30 to-transparent hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2 flex items-start gap-2">
                      <HelpCircle className="h-4 w-4 text-[var(--ocean)] mt-1 shrink-0" />
                      {faq.question}
                    </h3>
                    <p className="text-sm text-muted-foreground ml-6">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/40 bg-gradient-to-r from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5">
        <div className="container mx-auto px-4 py-16">
          <motion.div 
            className="text-center max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 rounded-2xl icon-ocean mx-auto mb-6 flex items-center justify-center shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Trade Operations?</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of logistics professionals who trust Shiportrade for their daily operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-gradient text-white gap-2 h-14 px-10 text-lg">
                <Link href="/register">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-10 text-lg border-2">
                <Link href="/contact">
                  Contact Sales
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
