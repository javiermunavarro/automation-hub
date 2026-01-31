"use client";

import {
  ShoppingCart,
  Building2,
  Megaphone,
  DollarSign,
  Headphones,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  ShoppingCart: <ShoppingCart className="h-4 w-4" />,
  Building2: <Building2 className="h-4 w-4" />,
  Megaphone: <Megaphone className="h-4 w-4" />,
  DollarSign: <DollarSign className="h-4 w-4" />,
  Headphones: <Headphones className="h-4 w-4" />,
  BarChart3: <BarChart3 className="h-4 w-4" />,
};

interface CategoryFilterProps {
  categories: Category[];
  selected: string | null;
  onSelect: (slug: string | null) => void;
  categoryCounts?: Record<string, number>;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
  categoryCounts,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none">
      <Button
        variant={selected === null ? "default" : "outline"}
        size="sm"
        onClick={() => onSelect(null)}
        className={
          selected === null
            ? "gradient-primary text-white hover:opacity-90"
            : "transition-all duration-200"
        }
      >
        All
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.slug}
          variant={selected === cat.slug ? "default" : "outline"}
          size="sm"
          onClick={() => onSelect(cat.slug === selected ? null : cat.slug)}
          className={
            selected === cat.slug
              ? "gradient-primary text-white hover:opacity-90"
              : "transition-all duration-200"
          }
        >
          {iconMap[cat.icon]}
          <span className="ml-1.5">
            {cat.name}
            {categoryCounts?.[cat.id] !== undefined && (
              <span className="ml-1 opacity-70">({categoryCounts[cat.id]})</span>
            )}
          </span>
        </Button>
      ))}
    </div>
  );
}
