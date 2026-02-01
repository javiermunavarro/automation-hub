"use client";

import { Users, Zap, Shield, HeadphonesIcon } from "lucide-react";
import { useLanguage } from "@/lib/i18n/LanguageContext";

const valueIcons = [Zap, Shield, Users, HeadphonesIcon];

export default function AboutPage() {
  const { t } = useLanguage();
  const a = t.about;

  return (
    <div>
      {/* Hero - Who are we? */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl bg-black px-8 py-12 sm:px-12 sm:py-16">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              {a.heroTitle}
            </h1>
            <p className="text-lg leading-relaxed text-gray-400 sm:text-xl">
              {a.heroDescription}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-px overflow-hidden rounded-3xl border border-gray-200 bg-gray-200 sm:grid-cols-2">
            <div className="bg-white p-8 sm:p-10">
              <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-black">
                {a.missionTitle}
              </h2>
              <p className="text-lg text-gray-500">
                {a.missionDescription}
              </p>
            </div>
            <div className="bg-white p-8 sm:p-10">
              <h2 className="mb-3 text-2xl font-extrabold tracking-tight text-black">
                {a.visionTitle}
              </h2>
              <p className="text-lg text-gray-500">
                {a.visionDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {a.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-black sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-extrabold tracking-tight text-black">
              {a.valuesTitle}
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500">
              {a.valuesSubtitle}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {a.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <div
                  key={value.title}
                  className="rounded-2xl border border-gray-200 bg-white p-8 transition-all duration-200 hover:border-gray-400 hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-black">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-black">
                    {value.title}
                  </h3>
                  <p className="text-gray-500">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {a.ctaTitle}
          </h2>
          <p className="mb-8 text-lg text-gray-400">
            {a.ctaDescription}
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <a
              href="/marketplace"
              className="inline-flex h-12 items-center rounded-xl bg-white px-8 text-base font-semibold text-black shadow-lg transition-all duration-200 hover:bg-gray-100"
            >
              {a.ctaExplore}
            </a>
            <a
              href="/auth/register"
              className="inline-flex h-12 items-center rounded-xl border-2 border-white/30 px-8 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
            >
              {a.ctaRegister}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
