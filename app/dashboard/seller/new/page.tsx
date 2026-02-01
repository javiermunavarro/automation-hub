"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Zap, Upload, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { categories as mockCategories } from "@/lib/mock-data";
import { Category } from "@/lib/types";

const stepLabels = ["Basics", "Pricing", "Media", "Technical", "Review"];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function CreateAutomationPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "",
    shortDescription: "",
    longDescription: "",
    priceMonthly: "",
    setupFee: "",
    thumbnail: null as File | null,
    platform: "",
    tags: "",
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("categories").select("*");
      if (data && data.length > 0) {
        setCategories(data as Category[]);
      } else {
        setCategories(mockCategories);
      }
    }
    load();
  }, []);

  const updateForm = (key: string, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const categoryName = categories.find((c) => c.id === form.category)?.name || "—";

  const handleSubmit = async () => {
    setSubmitting(true);
    setError(null);

    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("You must be logged in to create an automation.");
      setSubmitting(false);
      return;
    }

    // Upload thumbnail if present
    let thumbnailUrl: string | null = null;
    if (form.thumbnail) {
      const fileExt = form.thumbnail.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(filePath, form.thumbnail);

      if (!uploadError) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("thumbnails").getPublicUrl(filePath);
        thumbnailUrl = publicUrl;
      }
    }

    const slug = slugify(form.title) || `automation-${Date.now()}`;
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error: insertError } = await supabase.from("automations").insert({
      title: form.title,
      slug,
      short_description: form.shortDescription,
      long_description: form.longDescription,
      category_id: form.category || null,
      creator_id: user.id,
      price_monthly: parseFloat(form.priceMonthly) || 0,
      setup_fee: parseFloat(form.setupFee) || 0,
      thumbnail_url: thumbnailUrl,
      is_approved: false,
      install_count: 0,
      avg_rating: 0,
      platform: form.platform || "Custom",
      tags,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Submitted!</h1>
        <p className="mb-8 text-lg text-gray-500">
          Your automation is pending review. We&apos;ll notify you within 24h.
        </p>
        <Link href="/dashboard/seller">
          <Button className="gradient-primary text-white">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/dashboard/seller"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Create New Automation
      </h1>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form */}
        <div className="lg:col-span-2">
          {/* Step Indicator */}
          <div className="mb-8 flex items-center gap-2">
            {stepLabels.map((step, i) => (
              <div key={step} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(i)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    i === currentStep
                      ? "bg-black text-white"
                      : i < currentStep
                        ? "bg-gray-100 text-black"
                        : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i + 1}
                </button>
                <span
                  className={`ml-2 text-sm font-medium ${
                    i === currentStep ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {step}
                </span>
                {i < stepLabels.length - 1 && (
                  <div className="mx-4 h-px w-8 bg-gray-200" />
                )}
              </div>
            ))}
          </div>

          <Card>
            <CardContent className="p-6">
              {/* Step 1: Basics */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g., AI Product Description Generator"
                      value={form.title}
                      onChange={(e) => updateForm("title", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={form.category}
                      onValueChange={(v) => updateForm("category", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="shortDesc">Short Description</Label>
                    <Textarea
                      id="shortDesc"
                      placeholder="Brief description (shown on cards)"
                      value={form.shortDescription}
                      onChange={(e) =>
                        updateForm("shortDescription", e.target.value)
                      }
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="longDesc">Full Description</Label>
                    <Textarea
                      id="longDesc"
                      placeholder="Detailed description with features..."
                      value={form.longDescription}
                      onChange={(e) =>
                        updateForm("longDescription", e.target.value)
                      }
                      className="mt-1"
                      rows={6}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Pricing */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="price">Monthly Price (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="49"
                      value={form.priceMonthly}
                      onChange={(e) =>
                        updateForm("priceMonthly", e.target.value)
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setup">One-Time Setup Fee (€)</Label>
                    <Input
                      id="setup"
                      type="number"
                      placeholder="99"
                      value={form.setupFee}
                      onChange={(e) => updateForm("setupFee", e.target.value)}
                      className="mt-1"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Optional. Set to 0 for no setup fee.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Media */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label>Thumbnail Image</Label>
                    <div className="mt-1 flex aspect-video items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <label className="flex cursor-pointer flex-col items-center gap-2 text-gray-500">
                        <Upload className="h-8 w-8" />
                        <span className="text-sm font-medium">
                          {form.thumbnail
                            ? form.thumbnail.name
                            : "Click to upload thumbnail"}
                        </span>
                        <span className="text-xs text-gray-400">
                          PNG, JPG up to 5MB
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            updateForm(
                              "thumbnail",
                              e.target.files?.[0] || null
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Technical */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="platform">Platform</Label>
                    <Select
                      value={form.platform}
                      onValueChange={(v) => updateForm("platform", v)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Make.com">Make.com</SelectItem>
                        <SelectItem value="n8n">n8n</SelectItem>
                        <SelectItem value="Zapier">Zapier</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., ecommerce, seo, gpt-4"
                      value={form.tags}
                      onChange={(e) => updateForm("tags", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Review Your Automation
                  </h2>
                  <p className="text-sm text-gray-500">
                    Please review all details before submitting.
                  </p>

                  {/* Preview Card */}
                  <Card className="overflow-hidden border-gray-300 bg-gray-50/30">
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                      <div className="flex h-full items-center justify-center">
                        <Zap className="h-12 w-12 text-gray-400/40" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {form.title || "Untitled Automation"}
                      </h3>
                      <p className="mb-3 text-sm text-gray-500">
                        {form.shortDescription || "No description provided."}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-gray-900">
                          €{form.priceMonthly || "0"}
                          <span className="text-sm font-normal text-gray-500">/mo</span>
                        </span>
                        {form.platform && (
                          <Badge variant="secondary">{form.platform}</Badge>
                        )}
                      </div>
                      {form.tags && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {form.tags
                            .split(",")
                            .filter((t) => t.trim())
                            .map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {tag.trim()}
                              </Badge>
                            ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Summary */}
                  <div className="space-y-3 rounded-lg border p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Category</span>
                      <span className="font-medium text-gray-900">{categoryName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform</span>
                      <span className="font-medium text-gray-900">{form.platform || "—"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Monthly Price</span>
                      <span className="font-medium text-gray-900">€{form.priceMonthly || "0"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Setup Fee</span>
                      <span className="font-medium text-gray-900">€{form.setupFee || "0"}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Thumbnail</span>
                      <span className="font-medium text-gray-900">
                        {form.thumbnail ? form.thumbnail.name : "None"}
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1 h-4 w-4 rounded border-gray-300 text-black focus:ring-gray-500"
                    />
                    <span className="text-sm text-gray-600">
                      I confirm that I own the rights to this automation and agree to the
                      marketplace terms and conditions. I understand my submission will be
                      reviewed before being published.
                    </span>
                  </label>
                </div>
              )}

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                {currentStep < stepLabels.length - 1 ? (
                  <Button
                    onClick={() =>
                      setCurrentStep((s) =>
                        Math.min(stepLabels.length - 1, s + 1)
                      )
                    }
                    className="bg-black hover:bg-gray-800"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || !agreedToTerms}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit for Review"
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="mb-4 font-semibold text-gray-900">Preview</h3>
            <Card className="overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="flex h-full items-center justify-center">
                  <Zap className="h-12 w-12 text-gray-400/40" />
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="mb-1 font-semibold text-gray-900">
                  {form.title || "Automation Title"}
                </h3>
                <p className="mb-3 text-sm text-gray-500">
                  {form.shortDescription ||
                    "Short description will appear here..."}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">
                    €{form.priceMonthly || "0"}
                    <span className="text-sm font-normal text-gray-500">
                      /mo
                    </span>
                  </span>
                  {form.platform && (
                    <Badge variant="secondary">{form.platform}</Badge>
                  )}
                </div>
                {form.tags && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {form.tags
                      .split(",")
                      .filter((t) => t.trim())
                      .map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
