"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Users,
  Download,
  Star,
  Plus,
  Eye,
  Edit,
  Trash2,
  Loader2,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createClient } from "@/lib/supabase/client";
import { Automation } from "@/lib/types";
import RatingStars from "@/components/RatingStars";
import RevenueChart from "@/components/RevenueChart";

export default function SellerDashboardPage() {
  const router = useRouter();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setAutomations(data as Automation[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("automations").delete().eq("id", id);

    if (!error) {
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const totalInstalls = automations.reduce(
    (sum, a) => sum + Number(a.install_count),
    0
  );
  const avgRating =
    automations.length > 0
      ? (
          automations.reduce((sum, a) => sum + Number(a.avg_rating), 0) /
          automations.length
        ).toFixed(1)
      : "0";
  const totalRevenue = automations.reduce(
    (sum, a) =>
      sum + Number(a.price_monthly) * Math.floor(Number(a.install_count) * 0.3),
    0
  );

  const stats = [
    {
      label: "Est. Revenue",
      value: `\u20AC${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-50 text-green-600",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Automations",
      value: String(automations.length),
      icon: Users,
      color: "bg-blue-50 text-blue-600",
      trend: "+3",
      trendUp: true,
    },
    {
      label: "Total Installs",
      value: totalInstalls.toLocaleString(),
      icon: Download,
      color: "bg-purple-50 text-purple-600",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: Star,
      color: "bg-yellow-50 text-yellow-600",
      trend: "-0.1",
      trendUp: false,
    },
  ];

  // Mock recent reviews
  const recentReviews = [
    {
      id: "r1",
      userName: "Maria Garcia",
      initials: "MG",
      rating: 5,
      comment: "Incredible tool! Saved us 40+ hours per week.",
      date: "2 days ago",
      automationTitle: "AI Product Description Generator",
    },
    {
      id: "r2",
      userName: "James Wilson",
      initials: "JW",
      rating: 5,
      comment: "Setup was smooth, support was responsive.",
      date: "5 days ago",
      automationTitle: "AI Product Description Generator",
    },
    {
      id: "r3",
      userName: "Lucas Dupont",
      initials: "LD",
      rating: 4,
      comment: "Great overall. Multi-language support needs improvement.",
      date: "1 week ago",
      automationTitle: "Invoice Processing Autopilot",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Seller Dashboard
          </h1>
          <p className="text-gray-500">
            Manage your automations and track performance
          </p>
        </div>
        <Link href="/dashboard/seller/new">
          <Button className="gradient-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <div className="mt-1 flex items-center gap-1">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-green-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        stat.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.trend} vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart */}
      <Card className="mb-8">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Revenue This Week
          </h2>
          <p className="text-sm text-gray-500">Daily estimated revenue</p>
        </div>
        <CardContent className="p-6">
          <RevenueChart />
        </CardContent>
      </Card>

      {/* Automations Table */}
      <Card className="mb-8">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            My Automations
          </h2>
        </div>
        {automations.length === 0 ? (
          <div className="p-12 text-center">
            <p className="mb-4 text-gray-500">
              You haven&apos;t created any automations yet.
            </p>
            <Link href="/dashboard/seller/new">
              <Button className="gradient-primary text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Automation
              </Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50/50 text-left text-sm text-gray-500">
                  <th className="px-6 py-3 font-medium">Automation</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Price</th>
                  <th className="px-6 py-3 font-medium">Installs</th>
                  <th className="px-6 py-3 font-medium">Rating</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {automations.map((a) => (
                  <tr
                    key={a.id}
                    className="border-b transition-colors last:border-0 hover:bg-gray-50/50"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{a.title}</p>
                        <p className="text-sm text-gray-500">{a.platform}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        className={
                          a.is_approved
                            ? "bg-green-50 text-green-700 hover:bg-green-50"
                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
                        }
                      >
                        {a.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      &euro;{a.price_monthly}/mo
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {Number(a.install_count).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <RatingStars rating={a.avg_rating} size="sm" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link href={`/marketplace/${a.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/seller/edit/${a.id}`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(a.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Recent Reviews */}
      <Card>
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Reviews
          </h2>
          <p className="text-sm text-gray-500">Latest feedback from users</p>
        </div>
        <CardContent className="divide-y p-0">
          {recentReviews.map((review) => (
            <div key={review.id} className="flex gap-4 p-6">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-50 text-sm font-medium text-blue-600">
                  {review.initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="mb-1 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-gray-900">
                      {review.userName}
                    </span>
                    <span className="ml-2 text-xs text-gray-400">
                      {review.date}
                    </span>
                  </div>
                  <RatingStars rating={review.rating} size="sm" />
                </div>
                <p className="text-sm text-gray-500">
                  on{" "}
                  <span className="font-medium text-gray-700">
                    {review.automationTitle}
                  </span>
                </p>
                <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
