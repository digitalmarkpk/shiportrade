"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowRight, Ship, Github, Chrome, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--ocean)]/5 via-transparent to-[var(--logistics)]/5" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-[var(--ocean)]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-gradient-to-tr from-[var(--logistics)]/10 to-transparent rounded-full blur-3xl" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative"
      >
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-muted/30 dark:from-card dark:to-muted/10">
          <CardHeader className="text-center pb-2">
            <motion.div 
              className="mx-auto w-16 h-16 rounded-2xl icon-ocean flex items-center justify-center mb-4 shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <Ship className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
            <CardDescription className="text-base">
              Sign in to your Shiportrade account
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-xl border-2 hover:border-[var(--ocean)] transition-colors">
                <Chrome className="h-5 w-5 mr-2" />
                Google
              </Button>
              <Button variant="outline" className="h-12 rounded-xl border-2 hover:border-[var(--ocean)] transition-colors">
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-3 text-muted-foreground">Or continue with email</span>
              </div>
            </div>

            {/* Email/Password Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="name@example.com" 
                    className="pl-12 h-12 rounded-xl text-base"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" className="text-sm text-[var(--ocean)] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    className="pl-12 pr-12 h-12 rounded-xl text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="rounded border-gray-300 w-4 h-4" />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me for 30 days</Label>
            </div>

            <Button className="w-full h-12 rounded-xl btn-gradient text-white gap-2 text-base font-semibold">
              Sign In
              <ArrowRight className="h-5 w-5" />
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-[var(--ocean)] hover:underline font-semibold">
                Create one free
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
