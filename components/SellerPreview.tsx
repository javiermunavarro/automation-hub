"use client";

import Link from "next/link";
import {
  DollarSign,
  Users,
  Download,
  Star,
  TrendingUp,
  ArrowRight,
  BarChart3,
  Globe,
  ShieldCheck,
  Zap,
  Target,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RevenueChart from "@/components/RevenueChart";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { FadeInSection } from "@/components/MotionWrapper";

const mockStats = [
  { value: "\u20AC12,450", icon: DollarSign, color: "bg-green-50 text-green-600", trend: "+24%" },
  { value: "8", icon: Users, color: "bg-gray-100 text-black", trend: "+3" },
  { value: "2,847", icon: Download, color: "bg-gray-100 text-gray-700", trend: "+18%" },
  { value: "4.8", icon: Star, color: "bg-yellow-50 text-yellow-600", trend: "+0.3" },
];

const mockRevenueData = [
  { label: "Mon", value: 1420 },
  { label: "Tue", value: 1880 },
  { label: "Wed", value: 1520 },
  { label: "Thu", value: 2190 },
  { label: "Fri", value: 1950 },
  { label: "Sat", value: 940 },
  { label: "Sun", value: 1610 },
];

const mockAutomations = [
  { title: "AI Lead Generator Pro", platform: "Make.com", status: "approved", price: 49, installs: 1247, rating: 4.9 },
  { title: "Smart Invoice Processor", platform: "n8n", status: "approved", price: 39, installs: 892, rating: 4.7 },
  { title: "Social Media Autopilot", platform: "Zapier", status: "approved", price: 29, installs: 708, rating: 4.8 },
];

export default function SellerPreview() {
  const { t } = useLanguage();
  const s = t.home.sellerPreview;

  return (
    <div>
      {/* Hero */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-gray-950 via-gray-900 to-black">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-gray-500/15 blur-[120px]" />
            <div className="absolute -left-20 top-1/3 h-[250px] w-[250px] rounded-full bg-gray-400/10 blur-[100px]" />
            <div className="absolute -right-20 top-1/4 h-[300px] w-[300px] rounded-full bg-gray-500/8 blur-[100px]" />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute right-[8%] top-[15%] hidden lg:block">
              <div className="h-14 w-14 rounded-xl border border-white/10 bg-gradient-to-br from-gray-600/30 to-gray-800/40 shadow-xl backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(25deg) rotateY(25deg) rotateZ(-10deg)" }} />
            </div>
            <div className="absolute bottom-[20%] left-[10%] hidden lg:block">
              <div className="h-10 w-10 rounded-lg border border-white/10 bg-gradient-to-br from-gray-500/20 to-gray-700/30 shadow-xl backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(20deg) rotateY(-30deg) rotateZ(15deg)" }} />
            </div>
            <div className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }} />
          </div>
          <div className="relative px-6 pb-20 pt-20 sm:px-12 sm:pb-24 sm:pt-28 lg:px-16">
            <FadeInSection className="max-w-3xl">
              <Badge className="mb-4 border-white/20 bg-white/10 text-white backdrop-blur-sm">
                {s.badge}
              </Badge>
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {s.heroTitle}
              </h1>
              <p className="mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
                {s.heroSubtitle}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl">
                    {s.heroCta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <FadeInSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-4 text-center">
              <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
                {s.previewLabel}
              </p>
              <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
                {s.previewTitle}
              </h2>
              <p className="mx-auto max-w-2xl text-gray-500">
                {s.previewSubtitle}
              </p>
            </div>

            {/* Mock Dashboard — wrapped in a "browser" frame */}
            <div className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
              {/* Browser bar */}
              <div className="flex items-center gap-2 border-b bg-gray-50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                  <div className="h-3 w-3 rounded-full bg-gray-300" />
                </div>
                <div className="ml-4 flex-1 rounded-md bg-gray-200 px-3 py-1 text-xs text-gray-400">
                  merai.io/dashboard/seller
                </div>
              </div>

              {/* Mock dashboard content */}
              <div className="p-6 sm:p-8">
                {/* KPI Cards */}
                <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {s.mockStatsLabels.map((label: string, i: number) => {
                    const stat = mockStats[i];
                    return (
                      <div key={label} className="rounded-xl border border-gray-200 p-5 transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{label}</p>
                            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
                            <div className="mt-1 flex items-center gap-1">
                              <TrendingUp className="h-3 w-3 text-green-500" />
                              <span className="text-xs font-medium text-green-600">{stat.trend}</span>
                            </div>
                          </div>
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.color}`}>
                            <stat.icon className="h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Revenue Chart */}
                <div className="mb-8 rounded-xl border border-gray-200 p-6">
                  <h3 className="mb-1 text-base font-semibold text-gray-900">{s.revenueTitle}</h3>
                  <p className="mb-4 text-sm text-gray-500">{s.revenueSubtitle}</p>
                  <RevenueChart data={mockRevenueData} />
                </div>

                {/* Mock automations table */}
                <div className="overflow-hidden rounded-xl border border-gray-200">
                  <div className="border-b bg-gray-50/80 px-6 py-4">
                    <h3 className="text-base font-semibold text-gray-900">{s.automationsTitle}</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b text-left text-xs uppercase tracking-wider text-gray-500">
                          <th className="px-6 py-3 font-medium">{s.tableHeaders[0]}</th>
                          <th className="px-6 py-3 font-medium">{s.tableHeaders[1]}</th>
                          <th className="px-6 py-3 font-medium">{s.tableHeaders[2]}</th>
                          <th className="px-6 py-3 font-medium">{s.tableHeaders[3]}</th>
                          <th className="px-6 py-3 font-medium">{s.tableHeaders[4]}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mockAutomations.map((a) => (
                          <tr key={a.title} className="border-b last:border-0">
                            <td className="px-6 py-4">
                              <p className="font-medium text-gray-900">{a.title}</p>
                              <p className="text-xs text-gray-500">{a.platform}</p>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                                {s.approved}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-900">&euro;{a.price}/mo</td>
                            <td className="px-6 py-4 text-gray-600">{a.installs.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-700">{a.rating}</span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Benefits — 3 column value props */}
      <FadeInSection>
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              {s.benefitsTitle}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {s.benefits.map((benefit: { title: string; description: string }, i: number) => {
                const icons = [Globe, Target, BarChart3, ShieldCheck, Zap, Eye];
                const Icon = icons[i];
                return (
                  <div key={benefit.title} className="rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-gray-400 hover:shadow-md">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-extrabold text-black">{benefit.title}</h3>
                    <p className="text-gray-500 leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* Market Positioning */}
      <FadeInSection>
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl">
              {s.marketsTitle}
            </h2>
            <p className="mb-12 max-w-2xl text-gray-500">{s.marketsSubtitle}</p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {s.markets.map((market: { name: string; demand: string; opportunity: string }) => (
                <div key={market.name} className="group rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-black hover:shadow-md">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-black">{market.name}</h3>
                    <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">{market.demand}</Badge>
                  </div>
                  <p className="text-sm text-gray-500">{market.opportunity}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* CTA */}
      <FadeInSection>
        <section className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-gray-950 via-gray-900 to-black py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-gray-500/12 blur-[100px]" />
              <div className="absolute -bottom-16 right-1/4 h-[250px] w-[350px] rounded-full bg-gray-400/10 blur-[90px]" />
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px]" />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {s.ctaTitle}
              </h2>
              <p className="mb-8 text-lg text-gray-400">
                {s.ctaSubtitle}
              </p>
              <Link href="/auth/register">
                <Button size="lg" className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl">
                  {s.heroCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
