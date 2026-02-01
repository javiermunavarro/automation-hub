"use client";

import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Category } from "@/lib/types";

interface MarketplaceFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  selectedPlatforms: string[];
  onPlatformsChange: (platforms: string[]) => void;
  minRating: number;
  onMinRatingChange: (rating: number) => void;
  freeTrialOnly: boolean;
  onFreeTrialChange: (value: boolean) => void;
  categoryCounts?: Record<string, number>;
}

const platforms = ["Make.com", "n8n", "Zapier"];
const ratingOptions = [
  { label: "4+ Stars", value: 4 },
  { label: "3+ Stars", value: 3 },
  { label: "2+ Stars", value: 2 },
];

export default function MarketplaceFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  selectedPlatforms,
  onPlatformsChange,
  minRating,
  onMinRatingChange,
  freeTrialOnly,
  onFreeTrialChange,
  categoryCounts,
}: MarketplaceFiltersProps) {
  const handleClearAll = () => {
    onCategoryChange(null);
    onPriceRangeChange([0, 200]);
    onPlatformsChange([]);
    onMinRatingChange(0);
    onFreeTrialChange(false);
  };

  const togglePlatform = (platform: string) => {
    if (selectedPlatforms.includes(platform)) {
      onPlatformsChange(selectedPlatforms.filter((p) => p !== platform));
    } else {
      onPlatformsChange([...selectedPlatforms, platform]);
    }
  };

  const hasFilters =
    selectedCategory !== null ||
    priceRange[1] < 200 ||
    selectedPlatforms.length > 0 ||
    minRating > 0 ||
    freeTrialOnly;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-auto p-0 text-xs text-black hover:text-gray-600"
          >
            <X className="mr-1 h-3 w-3" />
            Clear All
          </Button>
        )}
      </div>

      {/* Category */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">Category</Label>
        <div className="space-y-1">
          <button
            onClick={() => onCategoryChange(null)}
            className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
              selectedCategory === null
                ? "bg-gray-100 font-medium text-black"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() =>
                onCategoryChange(cat.slug === selectedCategory ? null : cat.slug)
              }
              className={`w-full rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                selectedCategory === cat.slug
                  ? "bg-gray-100 font-medium text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cat.name}
              {categoryCounts?.[cat.id] !== undefined && (
                <span className="ml-1 text-gray-400">({categoryCounts[cat.id]})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">
          Max Price: &euro;{priceRange[1]}
        </Label>
        <input
          type="range"
          min={0}
          max={200}
          value={priceRange[1]}
          onChange={(e) => {
            const val = Number(e.target.value);
            onPriceRangeChange([0, val]);
          }}
          className="w-full accent-black"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>&euro;0</span>
          <span>&euro;200</span>
        </div>
      </div>

      {/* Platform */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">Platform</Label>
        <div className="space-y-2">
          {platforms.map((platform) => (
            <label
              key={platform}
              className="flex cursor-pointer items-center gap-2 text-sm text-gray-600"
            >
              <input
                type="checkbox"
                checked={selectedPlatforms.includes(platform)}
                onChange={() => togglePlatform(platform)}
                className="h-4 w-4 rounded border-gray-300 text-black accent-black"
              />
              {platform}
            </label>
          ))}
        </div>
      </div>

      {/* Min Rating */}
      <div>
        <Label className="mb-2 block text-sm font-medium text-gray-700">Minimum Rating</Label>
        <div className="space-y-2">
          {ratingOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() =>
                onMinRatingChange(minRating === opt.value ? 0 : opt.value)
              }
              className={`flex w-full items-center gap-1.5 rounded-md px-3 py-1.5 text-left text-sm transition-colors ${
                minRating === opt.value
                  ? "bg-gray-100 font-medium text-black"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-3 w-3 ${
                      i < opt.value
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span>& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Free Trial */}
      <div>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Free Trial Only</span>
          <button
            onClick={() => onFreeTrialChange(!freeTrialOnly)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              freeTrialOnly ? "bg-black" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform ${
                freeTrialOnly ? "translate-x-4.5" : "translate-x-1"
              }`}
              style={{ transform: freeTrialOnly ? "translateX(18px)" : "translateX(3px)" }}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
