"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Upload, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListingCategory, ListingType } from "@/types/marketplace";

const categories = [
  { value: ListingCategory.CONTAINERS_BUY, label: "Containers - Buy" },
  { value: ListingCategory.CONTAINERS_SELL, label: "Containers - Sell" },
  { value: ListingCategory.CONTAINERS_LEASE, label: "Containers - Lease" },
  { value: ListingCategory.CONTAINERS_REEFER, label: "Containers - Reefer" },
  { value: ListingCategory.FREIGHT_QUOTE, label: "Freight - Get Quote" },
  { value: ListingCategory.FREIGHT_POST, label: "Freight - Post RFQ" },
  { value: ListingCategory.TRANSPORT_TRUCKS, label: "Transport - Find Trucks" },
  { value: ListingCategory.TRANSPORT_POST_LOAD, label: "Transport - Post Load" },
  { value: ListingCategory.WAREHOUSING_FIND, label: "Warehousing - Find" },
  { value: ListingCategory.WAREHOUSING_LIST, label: "Warehousing - List" },
  { value: ListingCategory.VESSELS_CHARTER, label: "Vessels - Charter" },
  { value: ListingCategory.B2B_BUYERS, label: "B2B - Find Buyers" },
  { value: ListingCategory.B2B_SUPPLIERS, label: "B2B - Find Suppliers" },
];

const listingTypes = [
  { value: ListingType.SELL, label: "I'm Selling" },
  { value: ListingType.BUY, label: "I'm Buying" },
  { value: ListingType.LEASE, label: "I'm Leasing" },
  { value: ListingType.RENT, label: "I'm Renting" },
  { value: ListingType.SERVICE, label: "I'm Offering a Service" },
  { value: ListingType.RFQ, label: "Request for Quote" },
];

const currencies = ["USD", "EUR", "GBP", "CNY", "JPY", "SGD", "AED", "INR"];

export function ListingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    listingType: "",
    priceAmount: "",
    priceCurrency: "USD",
    priceUnit: "",
    priceNegotiable: false,
    locationCity: "",
    locationCountry: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    contactCompany: "",
    tags: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Redirect to marketplace
    router.push("/marketplace");
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Pricing & Location" },
    { number: 3, title: "Contact Details" },
  ];

  return (
    <Card className="overflow-hidden shadow-xl border-0">
      {/* Progress Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6 text-white">
        <CardTitle className="text-2xl mb-4">Create New Listing</CardTitle>
        <div className="flex items-center gap-4">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= s.number
                    ? "bg-white text-emerald-600"
                    : "bg-white/20 text-white"
                }`}
              >
                {step > s.number ? <CheckCircle className="h-5 w-5" /> : s.number}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${step >= s.number ? "text-white" : "text-white/60"}`}>
                {s.title}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 sm:w-16 h-0.5 mx-2 ${step > s.number ? "bg-white" : "bg-white/20"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <CardContent className="p-6">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="title">Listing Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., 40ft High Cube Container - Excellent Condition"
                  value={formData.title}
                  onChange={(e) => updateFormData("title", e.target.value)}
                  required
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about your listing..."
                  value={formData.description}
                  onChange={(e) => updateFormData("description", e.target.value)}
                  required
                  rows={5}
                  className="rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(v) => updateFormData("category", v)}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Listing Type *</Label>
                  <Select
                    value={formData.listingType}
                    onValueChange={(v) => updateFormData("listingType", v)}
                  >
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {listingTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  placeholder="e.g., container, reefer, Singapore"
                  value={formData.tags}
                  onChange={(e) => updateFormData("tags", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              {/* Image Upload Placeholder */}
              <div className="space-y-2">
                <Label>Images</Label>
                <div className="border-2 border-dashed rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop images or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 10MB each
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Pricing & Location */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <CardDescription className="text-base">
                Set your pricing and location details
              </CardDescription>

              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold">Pricing</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priceAmount">Price Amount</Label>
                    <Input
                      id="priceAmount"
                      type="number"
                      placeholder="0.00"
                      value={formData.priceAmount}
                      onChange={(e) => updateFormData("priceAmount", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select
                      value={formData.priceCurrency}
                      onValueChange={(v) => updateFormData("priceCurrency", v)}
                    >
                      <SelectTrigger className="rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies.map((cur) => (
                          <SelectItem key={cur} value={cur}>
                            {cur}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priceUnit">Unit</Label>
                    <Input
                      id="priceUnit"
                      placeholder="e.g., per container"
                      value={formData.priceUnit}
                      onChange={(e) => updateFormData("priceUnit", e.target.value)}
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="negotiable"
                    checked={formData.priceNegotiable}
                    onChange={(e) => updateFormData("priceNegotiable", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="negotiable" className="font-normal">
                    Price is negotiable
                  </Label>
                </div>
              </div>

              <Separator />

              <div className="bg-muted/50 rounded-xl p-4 space-y-4">
                <h4 className="font-semibold">Location</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationCity">City *</Label>
                    <Input
                      id="locationCity"
                      placeholder="e.g., Rotterdam"
                      value={formData.locationCity}
                      onChange={(e) => updateFormData("locationCity", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="locationCountry">Country *</Label>
                    <Input
                      id="locationCountry"
                      placeholder="e.g., Netherlands"
                      value={formData.locationCountry}
                      onChange={(e) => updateFormData("locationCountry", e.target.value)}
                      required
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Contact Details */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <CardDescription className="text-base">
                How can interested buyers reach you?
              </CardDescription>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    placeholder="John Doe"
                    value={formData.contactName}
                    onChange={(e) => updateFormData("contactName", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.contactEmail}
                    onChange={(e) => updateFormData("contactEmail", e.target.value)}
                    required
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    placeholder="+1 234 567 890"
                    value={formData.contactPhone}
                    onChange={(e) => updateFormData("contactPhone", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactCompany">Company</Label>
                  <Input
                    id="contactCompany"
                    placeholder="Your Company Name"
                    value={formData.contactCompany}
                    onChange={(e) => updateFormData("contactCompany", e.target.value)}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4">
                <p className="text-sm text-emerald-700 dark:text-emerald-400">
                  Your contact information will be shared with interested buyers who submit inquiries through the platform.
                </p>
              </div>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {step > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="rounded-lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
            ) : (
              <Button type="button" variant="outline" asChild className="rounded-lg">
                <Link href="/marketplace">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancel
                </Link>
              </Button>
            )}

            {step < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg"
              >
                Next Step
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-lg"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
