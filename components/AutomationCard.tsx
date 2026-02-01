"use client";

import Link from "next/link";
import { Download, Zap, Bot, Megaphone, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Automation } from "@/lib/types";
import RatingStars from "@/components/RatingStars";
import PricingBadge from "@/components/PricingBadge";
import BadgeStack from "@/components/BadgeStack";

const platformIcons: Record<string, React.ElementType> = {
  "Make.com": Zap,
  n8n: Bot,
  Zapier: Megaphone,
};

interface AutomationCardProps {
  automation: Automation;
  showQuickSubscribe?: boolean;
}

export default function AutomationCard({
  automation,
  showQuickSubscribe = false,
}: AutomationCardProps) {
  const PlatformIcon = platformIcons[automation.platform] || Zap;
  const creatorInitials = automation.creator?.full_name
    ? automation.creator.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "AI";

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="group h-full cursor-pointer overflow-hidden border border-gray-200 transition-all duration-200 hover:border-black/50 hover:shadow-xl">
        <Link href={`/marketplace/${automation.id}`}>
          {/* Thumbnail */}
          <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex h-full items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <PlatformIcon className="h-14 w-14 text-gray-400/50" />
            </div>

            {/* Badge overlay top-left */}
            <div className="absolute left-3 top-3">
              <BadgeStack automation={automation} />
            </div>

            {/* Platform badge top-right */}
            <Badge className="absolute right-3 top-3 border-0 bg-white/90 text-xs font-medium text-gray-700 backdrop-blur-sm hover:bg-white">
              {automation.platform}
            </Badge>

            {/* Creator avatar bottom-left */}
            <div className="absolute bottom-3 left-3">
              <Avatar className="h-8 w-8 border-2 border-white shadow-sm">
                <AvatarFallback className="bg-black text-[10px] font-medium text-white">
                  {creatorInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Content */}
          <CardContent className="p-4">
            <h3 className="mb-1 line-clamp-1 font-semibold text-black transition-colors group-hover:text-gray-600">
              {automation.title}
            </h3>
            <p className="mb-3 line-clamp-2 text-sm text-gray-500">
              {automation.short_description}
            </p>

            {/* Metadata row */}
            <div className="mb-3 flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <PlatformIcon className="h-3 w-3" />
                {automation.platform}
              </span>
              <span className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {Number(automation.install_count).toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(automation.created_at).toLocaleDateString("es-ES", {
                  month: "short",
                  year: "2-digit",
                })}
              </span>
            </div>

            {/* Rating */}
            <div className="mb-3">
              <RatingStars rating={automation.avg_rating} size="sm" />
            </div>

            {/* Price */}
            <div className="flex items-center justify-between">
              <PricingBadge price={automation.price_monthly} size="sm" />
            </div>
          </CardContent>
        </Link>

        {/* Optional dual buttons */}
        {showQuickSubscribe && (
          <div className="flex gap-2 border-t px-4 py-3">
            <Link href={`/marketplace/${automation.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs">
                Ver Detalles
              </Button>
            </Link>
            <Link href={`/marketplace/${automation.id}`} className="flex-1">
              <Button
                size="sm"
                className="w-full bg-black text-xs text-white hover:bg-gray-800"
              >
                Suscribirse
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
