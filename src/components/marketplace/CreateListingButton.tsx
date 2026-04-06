"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Container, Ship, Truck, Warehouse, Anchor, Wrench, Users, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CreateListingButtonProps {
  variant?: "fab" | "cta" | "inline";
}

const quickListingOptions = [
  { label: "Container Listing", href: "/marketplace/containers/create", icon: Container, color: "from-emerald-500 to-teal-600" },
  { label: "Freight Quote", href: "/marketplace/freight/post", icon: Ship, color: "from-cyan-500 to-blue-600" },
  { label: "Transport Service", href: "/marketplace/transport/post-load", icon: Truck, color: "from-orange-500 to-amber-600" },
  { label: "Warehouse Space", href: "/marketplace/warehousing/list", icon: Warehouse, color: "from-violet-500 to-purple-600" },
];

export function CreateListingButton({ variant = "fab" }: CreateListingButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (variant === "cta") {
    return (
      <Button
        asChild
        size="lg"
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl shadow-lg"
      >
        <Link href="/marketplace/create">
          <Plus className="h-5 w-5 mr-2" />
          Create Listing
        </Link>
      </Button>
    );
  }

  if (variant === "inline") {
    return (
      <Button
        asChild
        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl"
      >
        <Link href="/marketplace/create">
          <Plus className="h-4 w-4 mr-2" />
          Create Listing
        </Link>
      </Button>
    );
  }

  // FAB variant
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border p-4 w-64"
          >
            <div className="space-y-2">
              {quickListingOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Link
                    key={option.href}
                    href={option.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors group"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-sm">{option.label}</span>
                  </Link>
                );
              })}
              <div className="pt-2 border-t mt-2">
                <Link
                  href="/marketplace/create"
                  className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-sm hover:from-emerald-600 hover:to-teal-700 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <Plus className="h-4 w-4" />
                  All Listing Types
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all ${
          isOpen
            ? "bg-gray-100 dark:bg-gray-800 rotate-45"
            : "bg-gradient-to-r from-emerald-500 to-teal-600"
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        ) : (
          <Plus className="h-6 w-6 text-white" />
        )}
      </motion.button>
    </div>
  );
}
