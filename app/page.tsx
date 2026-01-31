import Link from "next/link";
import {
  ShoppingCart,
  Building2,
  Megaphone,
  DollarSign,
  Headphones,
  BarChart3,
  ArrowRight,
  Shield,
  Code2,
  HeadphonesIcon,
  RefreshCw,
  LineChart,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { automations as mockAutomations } from "@/lib/mock-data";
import { Automation } from "@/lib/types";
import AutomationCard from "@/components/AutomationCard";
import RatingStars from "@/components/RatingStars";
import {
  FadeInSection,
  StaggerGrid,
  StaggerItem,
  TestimonialsCarousel,
} from "@/components/MotionWrapper";

async function getFeatured(): Promise<Automation[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from("automations")
      .select("*")
      .eq("is_approved", true)
      .order("install_count", { ascending: false })
      .limit(4);

    if (error || !data || data.length === 0) {
      return mockAutomations.slice(0, 4);
    }
    return data as Automation[];
  } catch {
    return mockAutomations.slice(0, 4);
  }
}

const features = [
  {
    icon: Shield,
    title: "Automatizaciones Verificadas",
    description: "Cada automatizacion es revisada y probada por nuestro equipo antes de publicarse.",
  },
  {
    icon: DollarSign,
    title: "Pagos Seguros",
    description: "Transacciones protegidas con Stripe. Garantia de devolucion de 30 dias.",
  },
  {
    icon: Code2,
    title: "Sin Codigo",
    description: "Implementa automatizaciones sin escribir una sola linea de codigo.",
  },
  {
    icon: HeadphonesIcon,
    title: "Soporte 24/7",
    description: "Equipo de soporte dedicado para ayudarte en cada paso del proceso.",
  },
  {
    icon: RefreshCw,
    title: "Actualizaciones Continuas",
    description: "Las automatizaciones se actualizan regularmente para mantenerse al dia.",
  },
  {
    icon: LineChart,
    title: "Analytics Integrados",
    description: "Mide el rendimiento de tus automatizaciones con dashboards detallados.",
  },
];

const trendingCategories = [
  { name: "E-Commerce", slug: "ecommerce", icon: ShoppingCart, count: 85 },
  { name: "Real Estate", slug: "real-estate", icon: Building2, count: 42 },
  { name: "Marketing", slug: "marketing", icon: Megaphone, count: 120 },
  { name: "Finance", slug: "finance", icon: DollarSign, count: 68 },
  { name: "Customer Support", slug: "customer-support", icon: Headphones, count: 95 },
  { name: "Data & Analytics", slug: "data-analytics", icon: BarChart3, count: 73 },
];

const steps = [
  {
    number: "1",
    title: "Explora",
    description: "Navega por cientos de automatizaciones verificadas en nuestro marketplace.",
  },
  {
    number: "2",
    title: "Suscribete",
    description: "Elige el plan que mejor se adapte a tu negocio con pagos seguros.",
  },
  {
    number: "3",
    title: "Automatiza",
    description: "Implementa en minutos y empieza a ahorrar tiempo desde el primer dia.",
  },
];

const testimonials = [
  {
    name: "Maria Garcia",
    role: "CEO, ShopFlow",
    quote: "merAI transformo completamente nuestra operacion de e-commerce. Ahorramos 40 horas semanales.",
    rating: 5,
    initials: "MG",
  },
  {
    name: "Carlos Rodriguez",
    role: "CTO, DataPrime",
    quote: "La calidad de las automatizaciones es impresionante. El soporte es de primera clase.",
    rating: 5,
    initials: "CR",
  },
  {
    name: "Ana Martinez",
    role: "Marketing Director, GrowthLab",
    quote: "Desde que usamos merAI, nuestro ROI en marketing digital se triplico.",
    rating: 5,
    initials: "AM",
  },
];

export default async function HomePage() {
  const featured = await getFeatured();

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 lg:px-8">
          <FadeInSection className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              El Marketplace de Automatizaciones IA para tu Negocio
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-blue-100 sm:text-xl">
              Compra soluciones probadas. Vende tus automatizaciones. Sin codigo.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl"
                >
                  Explorar Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/seller">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  Empezar a Vender
                </Button>
              </Link>
            </div>
          </FadeInSection>
        </div>
      </section>

      {/* 2. Stats Bar */}
      <section className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <StaggerGrid className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { value: "500+", label: "Automatizaciones" },
              { value: "50K+", label: "Horas Ahorradas" },
              { value: "\u20AC2M+", label: "Revenue Generado" },
            ].map((stat) => (
              <StaggerItem key={stat.label}>
                <div className="text-center">
                  <p className="text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="mt-1 text-sm text-gray-500">{stat.label}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 3. Bento Grid Features */}
      <section className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Todo lo que necesitas para automatizar
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-500">
              Una plataforma completa para comprar y vender automatizaciones de IA
            </p>
          </FadeInSection>
          <StaggerGrid className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <Card
                  className="border-gray-100 transition-all duration-200 hover:border-blue-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <feature.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 4. Featured Automations */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection>
            <div className="mb-10 flex items-center justify-between">
              <div>
                <h2 className="mb-2 text-3xl font-bold text-gray-900">
                  Automatizaciones Destacadas
                </h2>
                <p className="text-gray-500">
                  Las automatizaciones mas populares del marketplace
                </p>
              </div>
              <Link href="/marketplace">
                <Button variant="outline" className="hidden sm:flex">
                  Ver Todas
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
                Ver Todas las Automatizaciones
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Trending Categories */}
      <section className="border-t bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Categorias Populares
            </h2>
            <p className="text-gray-500">
              Encuentra la automatizacion perfecta para tu industria
            </p>
          </FadeInSection>
          <StaggerGrid className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trendingCategories.map((cat) => (
              <StaggerItem key={cat.slug}>
                <Link href={`/marketplace?category=${cat.slug}`}>
                  <div className="group flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-6 text-center transition-all duration-200 hover:border-blue-200 hover:shadow-md">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 transition-transform duration-200 group-hover:scale-110">
                      <cat.icon className="h-7 w-7 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {cat.name}
                    </span>
                    <span className="mt-0.5 text-xs text-gray-400">
                      {cat.count} soluciones
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 6. How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Como Funciona
            </h2>
            <p className="text-gray-500">
              Tres pasos simples para transformar tu negocio
            </p>
          </FadeInSection>
          <StaggerGrid className="grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <StaggerItem key={step.number}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary text-2xl font-bold text-white shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="text-gray-500">{step.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* 7. Testimonials */}
      <section className="border-t bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeInSection className="mb-12 text-center">
            <h2 className="mb-3 text-3xl font-bold text-gray-900">
              Lo que dicen nuestros clientes
            </h2>
            <p className="text-gray-500">
              Miles de empresas confian en merAI
            </p>
          </FadeInSection>
          <FadeInSection>
            <TestimonialsCarousel>
              {testimonials.map((t) => (
                <Card
                  key={t.name}
                  className="border-gray-100 transition-all duration-200 hover:shadow-md"
                >
                  <CardContent className="p-6">
                    <Quote className="mb-4 h-8 w-8 text-blue-200" />
                    <p className="mb-6 text-gray-600">&ldquo;{t.quote}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-blue-600 text-sm font-medium text-white">
                          {t.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{t.name}</p>
                        <p className="text-sm text-gray-500">{t.role}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <RatingStars rating={t.rating} size="sm" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TestimonialsCarousel>
          </FadeInSection>
        </div>
      </section>

      {/* 8. CTA */}
      <FadeInSection>
        <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 py-20">
          <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Empieza a usar merAI hoy
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Unete a miles de empresas que ya automatizan sus procesos con IA
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link href="/marketplace">
                <Button
                  size="lg"
                  className="h-13 rounded-xl bg-white px-8 text-base font-semibold text-blue-700 shadow-lg transition-all duration-200 hover:bg-blue-50 hover:shadow-xl"
                >
                  Explorar Marketplace
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard/seller">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 rounded-xl border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white transition-all duration-200 hover:bg-white/10"
                >
                  Empezar a Vender
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </FadeInSection>
    </div>
  );
}
