"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, Building, ArrowRight, Ship, Github, Chrome, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const passwordRequirements = [
  { text: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { text: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { text: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { text: "One number", test: (p: string) => /[0-9]/.test(p) },
];

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--logistics)]/5 via-transparent to-[var(--ocean)]/5" />
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gradient-to-br from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-gradient-to-tl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-muted/30 dark:from-card dark:to-muted/10">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="mx-auto w-16 h-16 rounded-2xl icon-logistics flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Ship className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
            <CardDescription className="text-base">
              Start using 82+ tools and 72+ document generators for free
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5 pt-4">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl border-2 hover:border-[var(--logistics)] transition-colors">
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-2 hover:border-[var(--logistics)] transition-colors">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">Or create with email</span>
              </div>
            </div>

            {/* Registration Form */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">First name</Label>
                  <Input id="firstName" placeholder="John" className="h-11 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">Last name</Label>
                  <Input id="lastName" placeholder="Doe" className="h-11 rounded-xl" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="name@company.com" className="pl-12 h-11 rounded-xl" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium">Company <span className="text-muted-foreground">(optional)</span></Label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="company" placeholder="Your company name" className="pl-12 h-11 rounded-xl" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-12 pr-12 h-11 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {/* Password requirements */}
                {password && (
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-xs">
                        <Check className={`h-3 w-3 ${req.test(password) ? 'text-[var(--logistics)]' : 'text-muted-foreground/30'}`} />
                        <span className={req.test(password) ? 'text-[var(--logistics)]' : 'text-muted-foreground'}>
                          {req.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="rounded border-gray-300 w-4 h-4 mt-0.5" />
              <label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                I agree to the{" "}
                <Link href="/terms" className="text-[var(--ocean)] hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[var(--ocean)] hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button className="w-full h-12 rounded-xl btn-gradient text-white gap-2 text-base font-semibold">
              Create Account
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-[var(--ocean)] hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
