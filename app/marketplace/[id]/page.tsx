"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Download,
  Clock,
  Zap,
  CheckCircle2,
  ExternalLink,
  Loader2,
  Shield,
  Headphones,
  XCircle,
  ChevronRight,
  Calculator,
  FileText,
  History,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { automations as mockAutomations, mockReviews, categories as mockCategories } from "@/lib/mock-data";
import { Automation, Review } from "@/lib/types";
import { useState, useEffect, useMemo } from "react";
import RatingStars from "@/components/RatingStars";
import BadgeStack from "@/components/BadgeStack";

export default function AutomationDetailPage() {
  const params = useParams();
  const [automation, setAutomation] = useState<Automation | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setUserId(user.id);

      const { data: automationData, error: automationError } = await supabase
        .from("automations")
        .select("*")
        .eq("id", params.id)
        .single();

      if (automationError || !automationData) {
        const mock = mockAutomations.find((a) => a.id === params.id);
        setAutomation(mock || null);
        setReviews(
          mockReviews.filter((r) => r.automation_id === params.id) as Review[]
        );
      } else {
        setAutomation(automationData as Automation);

        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("*, user:profiles(id, email, full_name, role)")
          .eq("automation_id", params.id)
          .order("created_at", { ascending: false });

        setReviews((reviewsData as Review[]) || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [params.id]);

  const handleCheckout = async () => {
    if (!automation) return;
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          automationId: automation.id,
          priceMonthly: automation.price_monthly,
          setupFee: automation.setup_fee,
          title: automation.title,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    }
  };

  const handleSubmitReview = async () => {
    if (!automation || !userId) {
      setReviewError("You must be logged in to submit a review.");
      return;
    }
    if (!reviewText.trim()) {
      setReviewError("Please write a comment.");
      return;
    }

    setSubmittingReview(true);
    setReviewError(null);

    const supabase = createClient();
    const { data, error } = await supabase
      .from("reviews")
      .insert({
        automation_id: automation.id,
        user_id: userId,
        rating: reviewRating,
        comment: reviewText.trim(),
      })
      .select("*, user:profiles(id, email, full_name, role)")
      .single();

    if (error) {
      setReviewError(
        error.code === "23505"
          ? "You have already reviewed this automation."
          : error.message
      );
    } else if (data) {
      setReviews((prev) => [data as Review, ...prev]);
      setReviewText("");
      setReviewRating(5);

      const avgRes = await supabase
        .from("reviews")
        .select("rating")
        .eq("automation_id", automation.id);

      if (avgRes.data && avgRes.data.length > 0) {
        const avg =
          avgRes.data.reduce((s, r) => s + r.rating, 0) / avgRes.data.length;
        await supabase
          .from("automations")
          .update({ avg_rating: Math.round(avg * 10) / 10 })
          .eq("id", automation.id);
      }
    }

    setSubmittingReview(false);
  };

  // Rating distribution for reviews
  const ratingDistribution = useMemo(() => {
    const dist = [0, 0, 0, 0, 0]; // 1-5 stars
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(Math.round(r.rating) - 1, 0), 4);
      dist[idx]++;
    });
    return dist.reverse(); // 5 stars first
  }, [reviews]);

  // Category name from mock data
  const categoryName = automation
    ? mockCategories.find((c) => c.id === automation.category_id)?.name || "Automation"
    : "";

  // Days since last update
  const daysSinceCreated = automation
    ? Math.floor(
        (Date.now() - new Date(automation.created_at).getTime()) /
          (1000 * 60 * 60 * 24)
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (!automation) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Automation not found
        </h1>
        <Link href="/marketplace">
          <Button className="mt-4 gradient-primary text-white">
            Back to Marketplace
          </Button>
        </Link>
      </div>
    );
  }

  const tags = Array.isArray(automation.tags) ? automation.tags : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1 text-sm text-gray-500">
        <Link href="/marketplace" className="transition-colors hover:text-black">
          Marketplace
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/marketplace?category=${automation.category_id}`}
          className="transition-colors hover:text-black"
        >
          {categoryName}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-gray-900">{automation.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Hero image */}
          <div className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex aspect-video items-center justify-center">
              <Zap className="h-20 w-20 text-gray-400/30" />
            </div>
          </div>

          {/* Creator badge */}
          <div className="mb-4 flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-black text-sm font-medium text-white">
                AI
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {automation.creator?.full_name || "AI Creator"}
                </span>
                <Badge className="border-0 bg-gray-100 text-[10px] text-gray-700 hover:bg-gray-100">
                  Verified Creator
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{automation.platform} Expert</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto">
              Follow
            </Button>
          </div>

          {/* Badges + Tags */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <BadgeStack automation={automation} />
            <Badge variant="secondary">{automation.platform}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            {automation.title}
          </h1>
          <p className="mb-6 text-lg text-gray-500">
            {automation.short_description}
          </p>

          {/* Stats row */}
          <div className="mb-8 flex flex-wrap items-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {Number(automation.install_count).toLocaleString()} installs
            </span>
            <span className="flex items-center gap-1.5">
              <RatingStars rating={automation.avg_rating} size="sm" breakdown={ratingDistribution} />
              <span>{automation.avg_rating} rating</span>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Updated {daysSinceCreated} days ago
            </span>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="demo">Demo</TabsTrigger>
              <TabsTrigger value="reviews">
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
              <TabsTrigger value="changelog">Changelog</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="prose max-w-none">
                {automation.long_description.split("\n").map((paragraph, i) => (
                  <p key={i} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  "Fully automated workflow",
                  "24/7 monitoring & alerts",
                  "Custom configuration",
                  "Priority support included",
                  "Regular updates",
                  "API access",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="demo" className="mt-6">
              <Card>
                <CardContent className="flex flex-col items-center p-12 text-center">
                  <ExternalLink className="mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    Live Demo Available
                  </h3>
                  <p className="mb-4 text-gray-500">
                    See this automation in action with sample data.
                  </p>
                  <Button className="gradient-primary text-white">
                    Launch Demo
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6 space-y-6">
              {/* Rating summary */}
              {reviews.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                      <div className="text-center">
                        <p className="text-5xl font-bold text-gray-900">
                          {automation.avg_rating}
                        </p>
                        <RatingStars
                          rating={automation.avg_rating}
                          size="md"
                        />
                        <p className="mt-1 text-sm text-gray-500">
                          {reviews.length} reviews
                        </p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars, idx) => {
                          const count = ratingDistribution[idx];
                          const percent =
                            reviews.length > 0
                              ? (count / reviews.length) * 100
                              : 0;
                          return (
                            <div
                              key={stars}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="w-8 text-right text-gray-500">
                                {stars}
                              </span>
                              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                              <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                                <div
                                  className="h-full rounded-full bg-yellow-400 transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="w-8 text-gray-400">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Review Form */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 font-semibold text-gray-900">
                    Write a Review
                  </h3>
                  {!userId && (
                    <p className="mb-4 text-sm text-gray-500">
                      <Link
                        href="/auth/login"
                        className="text-black underline"
                      >
                        Log in
                      </Link>{" "}
                      to submit a review.
                    </p>
                  )}
                  {reviewError && (
                    <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                      {reviewError}
                    </div>
                  )}
                  <div className="mb-4">
                    <Label>Rating</Label>
                    <div className="mt-1">
                      <RatingStars
                        rating={reviewRating}
                        size="lg"
                        interactive
                        onChange={setReviewRating}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <Label htmlFor="review">Your Review</Label>
                    <Textarea
                      id="review"
                      placeholder="Share your experience..."
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="mt-1"
                      disabled={!userId}
                    />
                  </div>
                  <Button
                    className="gradient-primary text-white"
                    onClick={handleSubmitReview}
                    disabled={!userId || submittingReview}
                  >
                    {submittingReview ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Review"
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Reviews */}
              {reviews.length === 0 && (
                <p className="py-8 text-center text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              )}
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="mb-3 flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-100 text-black">
                          {(review.user?.full_name || "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {review.user?.full_name || "User"}
                        </p>
                        <div className="flex items-center gap-2">
                          <RatingStars rating={review.rating} size="sm" />
                          <span className="text-xs text-gray-400">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="documentation" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-5 w-5 text-black" />
                    <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
                  </div>
                  <div className="prose max-w-none text-sm text-gray-600 space-y-4">
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Getting Started</h4>
                      <p>Follow these steps to set up <strong>{automation.title}</strong> in your {automation.platform} account:</p>
                      <ol className="mt-2 ml-4 list-decimal space-y-1">
                        <li>Import the automation template into your {automation.platform} workspace</li>
                        <li>Configure your API credentials and connection settings</li>
                        <li>Customize the workflow parameters to match your needs</li>
                        <li>Test the automation with sample data</li>
                        <li>Activate and monitor the first run</li>
                      </ol>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Configuration</h4>
                      <p>This automation supports the following configuration options:</p>
                      <ul className="mt-2 ml-4 list-disc space-y-1">
                        <li>Custom trigger schedules (cron-based)</li>
                        <li>Webhook integration for real-time events</li>
                        <li>Error handling and retry policies</li>
                        <li>Output format customization</li>
                      </ul>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">API Reference</h4>
                      <p>For advanced usage, refer to the {automation.platform} API documentation. This automation uses the following endpoints and modules as part of its workflow.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="changelog" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <History className="h-5 w-5 text-black" />
                    <h3 className="text-lg font-semibold text-gray-900">Changelog</h3>
                  </div>
                  <div className="space-y-6">
                    {[
                      {
                        version: "2.1.0",
                        date: "January 2026",
                        type: "Feature",
                        changes: [
                          "Added support for batch processing",
                          "Improved error handling with detailed logs",
                          "New webhook trigger option",
                        ],
                      },
                      {
                        version: "2.0.0",
                        date: "December 2025",
                        type: "Major",
                        changes: [
                          "Complete workflow redesign for better performance",
                          "Added multi-language support",
                          "Breaking: Updated API authentication method",
                        ],
                      },
                      {
                        version: "1.2.0",
                        date: "November 2025",
                        type: "Improvement",
                        changes: [
                          "Optimized execution speed by 40%",
                          "Added retry logic for failed API calls",
                          "Minor UI fixes in configuration panel",
                        ],
                      },
                      {
                        version: "1.0.0",
                        date: "October 2025",
                        type: "Release",
                        changes: [
                          "Initial release",
                          "Core automation workflow",
                          "Basic configuration options",
                        ],
                      },
                    ].map((release) => (
                      <div key={release.version} className="relative border-l-2 border-gray-300 pl-4">
                        <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-black" />
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900">v{release.version}</span>
                          <Badge variant="secondary" className="text-xs">{release.type}</Badge>
                          <span className="text-xs text-gray-400">{release.date}</span>
                        </div>
                        <ul className="space-y-1">
                          {release.changes.map((change, i) => (
                            <li key={i} className="text-sm text-gray-600">
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sticky Pricing Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <Card className="overflow-hidden border-gray-200">
              <CardContent className="p-6">
                {/* Price */}
                <div className="mb-2">
                  <span className="text-4xl font-bold text-gray-900">
                    &euro;{automation.price_monthly}
                  </span>
                  <span className="text-lg text-gray-500">/month</span>
                </div>
                {Number(automation.setup_fee) > 0 && (
                  <p className="mb-1 text-sm text-gray-500">
                    + &euro;{automation.setup_fee} one-time setup fee
                  </p>
                )}
                {Number(automation.setup_fee) > 0 && (
                  <p className="mb-6 text-xs text-gray-400">
                    Total first month: &euro;
                    {Number(automation.price_monthly) +
                      Number(automation.setup_fee)}
                  </p>
                )}

                {/* Savings Calculator */}
                <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Calculator className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-800">Estimated Savings</span>
                  </div>
                  <p className="text-xs text-green-700">
                    Save ~15h/week = <strong>&euro;{Math.round(Number(automation.price_monthly) * 12).toLocaleString()}/mo</strong> estimated value
                  </p>
                  <p className="mt-1 text-[10px] text-green-600">
                    Based on average time saved by similar automations
                  </p>
                </div>

                <Button
                  onClick={handleCheckout}
                  className="mb-4 w-full gradient-primary text-white shadow-lg transition-all duration-200 hover:opacity-90 hover:shadow-xl"
                  size="lg"
                >
                  Subscribe Now
                </Button>

                <p className="mb-6 text-center text-xs text-gray-400">
                  Cancel anytime. No long-term commitment.
                </p>

                {/* Trust badges */}
                <div className="mb-6 space-y-3 rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4 text-green-500" />
                    Garantia 30 dias
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Headphones className="h-4 w-4 text-gray-600" />
                    Soporte incluido
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <XCircle className="h-4 w-4 text-gray-400" />
                    Cancelacion gratuita
                  </div>
                </div>

                {/* What's Included */}
                <div className="space-y-3 border-t pt-6">
                  <h4 className="font-medium text-gray-900">
                    What&apos;s Included
                  </h4>
                  {[
                    "Full automation setup",
                    "Onboarding call",
                    "Email support",
                    "Monthly updates",
                    "Usage analytics",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-gray-600"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Requirements */}
                <div className="mt-6 space-y-2 border-t pt-6">
                  <h4 className="font-medium text-gray-900">Requirements</h4>
                  <p className="text-sm text-gray-500">
                    Active {automation.platform} account required.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
