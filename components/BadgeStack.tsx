import { Badge } from "@/components/ui/badge";
import { Automation } from "@/lib/types";

type BadgeType = "featured" | "bestseller" | "new" | "verified";

interface BadgeStackProps {
  badges?: BadgeType[];
  automation?: Automation;
}

const badgeConfig: Record<BadgeType, { label: string; className: string }> = {
  featured: {
    label: "Featured",
    className: "bg-black text-white hover:bg-gray-800 border-0",
  },
  bestseller: {
    label: "Bestseller",
    className: "bg-gray-700 text-white hover:bg-gray-600 border-0",
  },
  new: {
    label: "New",
    className: "bg-gray-900 text-white hover:bg-gray-800 border-0",
  },
  verified: {
    label: "Verified",
    className: "bg-gray-500 text-white hover:bg-gray-400 border-0",
  },
};

function deriveBadges(automation: Automation): BadgeType[] {
  const badges: BadgeType[] = [];
  if (Number(automation.install_count) > 1000) badges.push("bestseller");
  const created = new Date(automation.created_at);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (created > thirtyDaysAgo) badges.push("new");
  if (Number(automation.avg_rating) >= 4.5) badges.push("verified");
  return badges;
}

export default function BadgeStack({ badges, automation }: BadgeStackProps) {
  const resolved = badges ?? (automation ? deriveBadges(automation) : []);

  if (resolved.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      {resolved.map((type) => {
        const config = badgeConfig[type];
        return (
          <Badge key={type} className={`text-[10px] ${config.className}`}>
            {config.label}
          </Badge>
        );
      })}
    </div>
  );
}
