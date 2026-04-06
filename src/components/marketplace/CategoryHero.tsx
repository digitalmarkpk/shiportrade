"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeroProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  breadcrumb?: { label: string; href: string }[];
  stats?: { label: string; value: string }[];
  gradient?: string;
}

export function CategoryHero({
  title,
  description,
  icon,
  breadcrumb,
  stats,
  gradient = "from-emerald-500 to-teal-600",
}: CategoryHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-gradient-to-br ${gradient} text-white`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative">
        {/* Breadcrumb */}
        {breadcrumb && breadcrumb.length > 0 && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm text-white/80 mb-6"
          >
            <Link href="/marketplace" className="hover:text-white transition-colors">
              Marketplace
            </Link>
            {breadcrumb.map((item, index) => (
              <span key={item.href} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                <Link href={item.href} className="hover:text-white transition-colors">
                  {item.label}
                </Link>
              </span>
            ))}
          </motion.nav>
        )}

        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              {icon && (
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-xl">
                  {icon}
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">{title}</h1>
              </div>
            </div>
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              {description}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-white text-emerald-600 hover:bg-white/90 rounded-xl shadow-xl"
              >
                <Link href="#listings">Browse Listings</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-xl"
              >
                <Link href="/marketplace/create">Create Listing</Link>
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && stats.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center"
                >
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
