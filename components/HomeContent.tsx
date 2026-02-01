"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Building2,
  Megaphone,
  DollarSign,
  Headphones,
  BarChart3,
  ArrowRight,
  Quote,
  Search,
  Cpu,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Automation } from "@/lib/types";
import AutomationCard from "@/components/AutomationCard";
import RatingStars from "@/components/RatingStars";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
  TestimonialsCarousel,
} from "@/components/MotionWrapper";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const categoryMeta = [
  { slug: "ecommerce", icon: ShoppingCart },
  { slug: "real-estate", icon: Building2 },
  { slug: "marketing", icon: Megaphone },
  { slug: "finance", icon: DollarSign },
  { slug: "customer-support", icon: Headphones },
  { slug: "data-analytics", icon: BarChart3 },
];

const categoryNames: Record<string, { ES: string; EN: string }> = {
  ecommerce: { ES: "E-Commerce", EN: "E-Commerce" },
  "real-estate": { ES: "Real Estate", EN: "Real Estate" },
  marketing: { ES: "Marketing", EN: "Marketing" },
  finance: { ES: "Finance", EN: "Finance" },
  "customer-support": { ES: "Customer Support", EN: "Customer Support" },
  "data-analytics": { ES: "Data & Analytics", EN: "Data & Analytics" },
};

const categoryCounts = [85, 42, 120, 68, 95, 73];

const testimonialRatings = [5, 5, 5];
const testimonialInitials = ["MG", "CR", "AM"];

const stepIcons = [Search, Cpu, Rocket];

export default function HomeContent({ featured }: { featured: Automation[] }) {
  const { lang, t } = useLanguage();
  const h = t.home;

  return (
    <div>
      {/* 1. Hero — left-aligned, editorial style */}
      <section className="px-4 pt-6 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-gray-950 via-gray-900 to-black">
          {/* Ambient glow orbs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-32 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-gray-500/15 blur-[120px]" />
            <div className="absolute -left-20 top-1/3 h-[300px] w-[300px] rounded-full bg-gray-400/10 blur-[100px]" />
            <div className="absolute -right-20 top-1/4 h-[350px] w-[350px] rounded-full bg-gray-500/8 blur-[100px]" />
            <div className="absolute -bottom-20 left-1/2 h-[200px] w-[600px] -translate-x-1/2 rounded-full bg-white/5 blur-[80px]" />
          </div>

          {/* 3D geometric shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute bottom-[-60px] left-1/2 -translate-x-1/2">
              <div
                className="h-40 w-40 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-700/40 to-gray-900/60 shadow-2xl backdrop-blur-sm sm:h-56 sm:w-56"
                style={{ transform: "perspective(800px) rotateX(55deg) rotateZ(45deg)" }}
              />
              <div
                className="absolute left-2 top-6 h-40 w-40 rounded-3xl border border-white/5 bg-gradient-to-br from-gray-800/30 to-transparent sm:left-3 sm:top-8 sm:h-56 sm:w-56"
                style={{ transform: "perspective(800px) rotateX(55deg) rotateZ(45deg)" }}
              />
            </div>
            <div className="absolute left-[8%] top-[15%] hidden lg:block">
              <div
                className="h-16 w-16 rounded-xl border border-white/10 bg-gradient-to-br from-gray-600/30 to-gray-800/40 shadow-xl backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(25deg) rotateY(-30deg) rotateZ(15deg)" }}
              />
            </div>
            <div className="absolute right-[10%] top-[20%] hidden lg:block">
              <div
                className="h-12 w-12 rounded-lg border border-white/10 bg-gradient-to-br from-gray-500/20 to-gray-700/30 shadow-xl backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(20deg) rotateY(25deg) rotateZ(-10deg)" }}
              />
            </div>
            <div className="absolute bottom-[30%] left-[15%] hidden md:block">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-500/30 to-gray-700/20 shadow-lg" />
            </div>
            <div className="absolute bottom-[40%] right-[12%] hidden md:block">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-400/25 to-gray-600/15 shadow-lg" />
            </div>
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />
          </div>

          {/* Content — left-aligned */}
          <div className="relative px-6 pb-32 pt-20 sm:px-12 sm:pb-40 sm:pt-28 lg:px-16">
            <FadeInSection className="max-w-3xl">
              <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl" style={{ fontFamily: "var(--font-inter), Georgia, serif" }}>
                {h.heroTitle}
              </h1>
              <p className="mb-10 max-w-2xl text-lg text-gray-400 sm:text-xl">
                {h.heroSubtitle}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl"
                  >
                    {h.heroCtaPrimary}
                  </Button>
                </Link>
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-xl border-2 border-white/20 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/10"
                  >
                    {h.heroCtaSecondary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </FadeInSection>
          </div>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {h.stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <p className="text-3xl font-extrabold text-black sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 3. Get Started — editorial text + decorative side */}
      <FadeInSection>
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Left: text content */}
              <div>
                <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
                  {h.getStartedTitle}
                </p>
                <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-black sm:text-4xl" style={{ fontFamily: "var(--font-inter), Georgia, serif" }}>
                  {h.getStartedHeading}
                </h2>
                <div className="space-y-6 text-gray-600 leading-relaxed">
                  <p>{h.getStartedP1}</p>
                  <p>{h.getStartedP2}</p>
                  <p>{h.getStartedP3}</p>
                </div>
                <div className="mt-8">
                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      className="h-13 rounded-xl bg-black px-8 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:bg-gray-800"
                    >
                      {h.getStartedCta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right: decorative element — abstract circuit/AI visual */}
              <div className="relative hidden lg:flex items-center justify-center">
                <div className="relative h-[420px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200">
                  {/* Abstract circuit lines */}
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 420" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Vertical lines */}
                    <line x1="100" y1="60" x2="100" y2="360" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    <line x1="200" y1="30" x2="200" y2="390" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    <line x1="300" y1="80" x2="300" y2="340" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    {/* Horizontal lines */}
                    <line x1="60" y1="140" x2="340" y2="140" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    <line x1="80" y1="210" x2="320" y2="210" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    <line x1="60" y1="280" x2="340" y2="280" stroke="currentColor" className="text-gray-300" strokeWidth="1" />
                    {/* Diagonal connections */}
                    <line x1="100" y1="140" x2="200" y2="210" stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
                    <line x1="200" y1="210" x2="300" y2="140" stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
                    <line x1="200" y1="210" x2="300" y2="280" stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
                    <line x1="100" y1="280" x2="200" y2="210" stroke="currentColor" className="text-gray-400" strokeWidth="1.5" />
                    {/* Nodes */}
                    <circle cx="100" cy="140" r="6" className="fill-black" />
                    <circle cx="200" cy="210" r="10" className="fill-black" />
                    <circle cx="300" cy="140" r="6" className="fill-black" />
                    <circle cx="300" cy="280" r="6" className="fill-black" />
                    <circle cx="100" cy="280" r="6" className="fill-black" />
                    {/* Small decorative dots */}
                    <circle cx="150" cy="175" r="3" className="fill-gray-400" />
                    <circle cx="250" cy="175" r="3" className="fill-gray-400" />
                    <circle cx="250" cy="245" r="3" className="fill-gray-400" />
                    <circle cx="150" cy="245" r="3" className="fill-gray-400" />
                    {/* Outer glow ring */}
                    <circle cx="200" cy="210" r="40" stroke="currentColor" className="text-gray-300" strokeWidth="1" fill="none" />
                    <circle cx="200" cy="210" r="70" stroke="currentColor" className="text-gray-200" strokeWidth="0.5" fill="none" />
                    {/* Radiating dots from center */}
                    <circle cx="200" cy="130" r="2" className="fill-gray-400" />
                    <circle cx="200" cy="290" r="2" className="fill-gray-400" />
                    <circle cx="130" cy="210" r="2" className="fill-gray-400" />
                    <circle cx="270" cy="210" r="2" className="fill-gray-400" />
                    <circle cx="155" cy="165" r="1.5" className="fill-gray-300" />
                    <circle cx="245" cy="165" r="1.5" className="fill-gray-300" />
                    <circle cx="245" cy="255" r="1.5" className="fill-gray-300" />
                    <circle cx="155" cy="255" r="1.5" className="fill-gray-300" />
                  </svg>
                  {/* Central glow */}
                  <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/5 blur-[40px]" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* 4. Value Props — 3 column card (like "Join the AI Revolution") */}
      <FadeInSection>
        <section className="px-4 pb-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-8 text-3xl font-extrabold tracking-tight text-black sm:text-4xl" style={{ fontFamily: "var(--font-inter), Georgia, serif" }}>
              {h.valuePropsTitle}
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <div className="grid divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 divide-gray-200">
                {h.valueProps.map((prop) => (
                  <div key={prop.title} className="p-8 sm:p-10">
                    <h3 className="mb-3 text-xl font-extrabold text-black" style={{ fontFamily: "var(--font-inter), Georgia, serif" }}>
                      {prop.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* 5. How It Works — visual flow */}
      <FadeInSection>
        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-black sm:text-4xl" style={{ fontFamily: "var(--font-inter), Georgia, serif" }}>
              {h.howTitle}
            </h2>

            {/* Flow diagram */}
            <div className="mt-12 mb-12">
              <div className="relative rounded-2xl border border-gray-200 bg-gray-100/80 p-8 sm:p-12">
                <div className="grid gap-8 sm:grid-cols-3">
                  {h.howSteps.map((step, i) => {
                    const Icon = stepIcons[i];
                    return (
                      <div key={i} className="relative flex flex-col items-center text-center">
                        {/* Connector line */}
                        {i < 2 && (
                          <div className="absolute left-[calc(50%+48px)] top-10 hidden h-0.5 w-[calc(100%-96px)] bg-gray-300 sm:block" />
                        )}
                        {/* Step card */}
                        <div className="relative z-10 flex w-full flex-col items-center rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-md">
                          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-black shadow-lg">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className="mb-1 text-xs font-bold uppercase tracking-widest text-gray-400">
                            {String(i + 1).padStart(2, "0")}
                          </div>
                          <h3 className="mb-2 text-lg font-extrabold text-black">
                            {step.title}
                          </h3>
                          <p className="text-sm text-gray-500">{step.description}</p>
                        </div>
                        {/* Connector dot */}
                        {i < 2 && (
                          <div className="absolute -right-4 top-10 z-20 hidden h-3 w-3 rounded-full border-2 border-gray-300 bg-white sm:block" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="mx-auto max-w-3xl text-center text-gray-600 leading-relaxed sm:text-lg">
              {h.howSubtitle}
            </p>
          </div>
        </section>
      </FadeInSection>

      {/* 6. Featured Automations */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-extrabold tracking-tight text-black">
                  {h.featuredTitle}
                </h2>
                <p className="text-gray-500">
                  {h.featuredSubtitle}
                </p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline" className="hidden sm:flex">
                  {h.viewAll}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </FadeInSection>
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((automation) => (
              <StaggerItem key={automation.id}>
                <AutomationCard automation={automation} />
              </StaggerItem>
            ))}
          </StaggerGrid>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/marketplace">
              <Button variant="outline">
                {h.viewAllAutomations}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Trending Categories */}
      <section className="border-t bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-black">
              {h.categoriesTitle}
            </h2>
            <p className="text-gray-500">
              {h.categoriesSubtitle}
            </p>
          </FadeInSection>
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categoryMeta.map((cat, i) => (
              <StaggerItem key={cat.slug}>
                <Link href={`/marketplace?category=${cat.slug}`}>
                  <div className="group flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-6 text-center transition-all duration-200 hover:border-black hover:shadow-md">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 transition-all duration-200 group-hover:bg-black group-hover:scale-110">
                      <cat.icon className="h-7 w-7 text-gray-600 transition-colors group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {categoryNames[cat.slug][lang]}
                    </span>
                    <span className="mt-0.5 text-xs text-gray-400">
                      {categoryCounts[i]} {h.solutions}
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 8. Testimonials */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-black">
              {h.testimonialsTitle}
            </h2>
            <p className="text-gray-500">
              {h.testimonialsSubtitle}
            </p>
          </FadeInSection>
          <FadeInSection>
            <TestimonialsCarousel>
              {h.testimonials.map((testimonial, i) => (
                <Card
                  key={testimonial.name}
                  className="border-gray-200 transition-all duration-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <Quote className="mb-4 h-8 w-8 text-gray-300" />
                    <p className="mb-6 text-gray-600">&ldquo;{testimonial.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-black text-sm font-medium text-white">
                          {testimonialInitials[i]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-black">{testimonial.name}</p>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <RatingStars rating={testimonialRatings[i]} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TestimonialsCarousel>
          </FadeInSection>
        </div>
      </section>

      {/* 9. CTA */}
      <FadeInSection>
        <section className="px-4 pb-6 sm:px-6 lg:px-8">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-b from-gray-950 via-gray-900 to-black py-20">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-20 left-1/4 h-[300px] w-[400px] rounded-full bg-gray-500/12 blur-[100px]" />
              <div className="absolute -bottom-16 right-1/4 h-[250px] w-[350px] rounded-full bg-gray-400/10 blur-[90px]" />
              <div className="absolute left-1/2 top-1/2 h-[200px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[80px]" />
            </div>
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute bottom-8 left-[10%] h-16 w-16 rounded-xl border border-white/10 bg-gradient-to-br from-gray-700/30 to-gray-900/40 opacity-60 backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(40deg) rotateZ(45deg)" }} />
              <div className="absolute right-[12%] top-10 h-12 w-12 rounded-lg border border-white/8 bg-gradient-to-br from-gray-600/20 to-gray-800/30 opacity-50 backdrop-blur-sm"
                style={{ transform: "perspective(600px) rotateX(35deg) rotateZ(-30deg)" }} />
              <div className="absolute bottom-12 right-[20%] h-8 w-8 rounded-full bg-gradient-to-br from-gray-500/20 to-gray-700/10 opacity-50" />
              <div className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
                  backgroundSize: "60px 60px",
                }} />
            </div>
            <div className="relative z-10 mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
              <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {h.ctaTitle}
              </h2>
              <p className="mb-8 text-lg text-gray-400">
                {h.ctaSubtitle}
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/marketplace">
                  <Button
                    size="lg"
                    className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:bg-gray-100 hover:shadow-xl"
                  >
                    {h.heroCtaSecondary}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                  >
                    {h.heroCtaPrimary}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
