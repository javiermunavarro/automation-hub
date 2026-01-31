"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

interface SubscriptionRow {
  id: string;
  automation_id: string;
  buyer_id: string;
  status: string;
  monthly_price: number;
  created_at: string;
  automation: {
    id: string;
    title: string;
    platform: string;
  };
}

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700 hover:bg-green-100",
  canceled: "bg-red-100 text-red-700 hover:bg-red-100",
  past_due: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100",
};

export default function BuyerDashboardPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
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
        .from("subscriptions")
        .select("*, automation:automations(id, title, platform)")
        .eq("buyer_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setSubscriptions(data as SubscriptionRow[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  const handleCancel = async (subId: string) => {
    if (!confirm("Are you sure you want to cancel this subscription?")) return;

    const supabase = createClient();
    const { error } = await supabase
      .from("subscriptions")
      .update({ status: "canceled" })
      .eq("id", subId);

    if (!error) {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === subId ? { ...s, status: "canceled" } : s))
      );
    }
  };

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const totalMonthly = activeSubs.reduce(
    (sum, s) => sum + Number(s.monthly_price),
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
        <p className="text-gray-500">Manage your automation subscriptions</p>
      </div>

      {/* Summary */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Active Subscriptions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {activeSubs.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Monthly Spend</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              €{totalMonthly}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-gray-500">Total Subscriptions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {subscriptions.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="mb-4 text-gray-500">
              You don&apos;t have any subscriptions yet.
            </p>
            <Link href="/marketplace">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Browse Marketplace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub) => (
            <Card key={sub.id}>
              <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100">
                    <Zap className="h-7 w-7 text-blue-600/60" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {sub.automation?.title || "Automation"}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge className={statusColors[sub.status] || statusColors.active}>
                        {sub.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        €{sub.monthly_price}/mo
                      </span>
                      <span className="text-sm text-gray-400">
                        Since{" "}
                        {new Date(sub.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/marketplace/${sub.automation_id}`}>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-1 h-4 w-4" />
                      View
                    </Button>
                  </Link>
                  {sub.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleCancel(sub.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
