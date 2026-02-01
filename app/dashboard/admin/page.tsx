"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  Package,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { Automation, Profile } from "@/lib/types";

export default function AdminDashboardPage() {
  const router = useRouter();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [unauthorized, setUnauthorized] = useState(false);

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

      // Check if user is admin
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        setUnauthorized(true);
        setLoading(false);
        return;
      }

      // Fetch all automations with creator info
      const { data: automationsData } = await supabase
        .from("automations")
        .select("*, creator:profiles(id, email, full_name, role)")
        .order("created_at", { ascending: false });

      if (automationsData) {
        setAutomations(automationsData as Automation[]);
      }

      // Fetch all users
      const { data: usersData } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (usersData) {
        setUsers(usersData as Profile[]);
      }

      setLoading(false);
    }

    fetchData();
  }, [router]);

  const handleApprove = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from("automations")
      .update({ is_approved: true })
      .eq("id", id);

    if (!error) {
      setAutomations((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_approved: true } : a))
      );
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this automation?")) return;

    const supabase = createClient();
    const { error } = await supabase.from("automations").delete().eq("id", id);

    if (!error) {
      setAutomations((prev) => prev.filter((a) => a.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="h-8 w-8 animate-spin text-black" />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-red-400" />
        <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
        <p className="mt-2 text-gray-500">
          You don&apos;t have permission to access the admin dashboard.
        </p>
        <Link href="/dashboard/buyer">
          <Button className="mt-4">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const pendingAutomations = automations.filter((a) => !a.is_approved);
  const approvedAutomations = automations.filter((a) => a.is_approved);
  const totalRevenue = automations.reduce(
    (sum, a) =>
      sum + Number(a.price_monthly) * Math.floor(Number(a.install_count) * 0.3),
    0
  );

  const stats = [
    {
      label: "Total Users",
      value: String(users.length),
      icon: Users,
      color: "bg-gray-100 text-black",
    },
    {
      label: "Total Automations",
      value: String(automations.length),
      icon: Package,
      color: "bg-gray-200 text-gray-700",
    },
    {
      label: "Pending Review",
      value: String(pendingAutomations.length),
      icon: Shield,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      label: "Platform Revenue",
      value: `€${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-black" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500">
              Manage automations, users, and platform settings
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
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

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">
            Pending Review ({pendingAutomations.length})
          </TabsTrigger>
          <TabsTrigger value="approved">
            Approved ({approvedAutomations.length})
          </TabsTrigger>
          <TabsTrigger value="users">Users ({users.length})</TabsTrigger>
        </TabsList>

        {/* Pending Automations */}
        <TabsContent value="pending" className="mt-6">
          {pendingAutomations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
                <p className="text-gray-500">
                  No automations pending review.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingAutomations.map((a) => (
                <Card key={a.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {a.title}
                          </h3>
                          <Badge variant="outline">{a.platform}</Badge>
                          <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
                            Pending
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {a.short_description}
                        </p>
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                          <span>
                            By {a.creator?.full_name || "Unknown"}
                          </span>
                          <span>€{a.price_monthly}/mo</span>
                          {Number(a.setup_fee) > 0 && (
                            <span>+ €{a.setup_fee} setup</span>
                          )}
                          <span>
                            {new Date(a.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4 flex items-center gap-2">
                        <Link href={`/marketplace/${a.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-1 h-4 w-4" />
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(a.id)}
                        >
                          <CheckCircle2 className="mr-1 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => handleReject(a.id)}
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Approved Automations */}
        <TabsContent value="approved" className="mt-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-3 font-medium">Automation</th>
                    <th className="px-6 py-3 font-medium">Creator</th>
                    <th className="px-6 py-3 font-medium">Price</th>
                    <th className="px-6 py-3 font-medium">Installs</th>
                    <th className="px-6 py-3 font-medium">Rating</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedAutomations.map((a) => (
                    <tr key={a.id} className="border-b last:border-0">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {a.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {a.platform}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {a.creator?.full_name || "Unknown"}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        €{a.price_monthly}/mo
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {Number(a.install_count).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {a.avg_rating}
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/marketplace/${a.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users" className="mt-6">
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
                    <th className="px-6 py-3 font-medium">Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Role</th>
                    <th className="px-6 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {u.full_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            u.role === "admin"
                              ? "bg-red-100 text-red-700 hover:bg-red-100"
                              : u.role === "seller"
                                ? "bg-gray-200 text-gray-700 hover:bg-gray-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                          }
                        >
                          {u.role}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(u.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
