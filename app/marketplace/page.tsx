"use client";

import { useState, useMemo, useEffect } from "react";
import { ArrowUpDown, Loader2, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import AutomationCard from "@/components/AutomationCard";
import CategoryFilter from "@/components/CategoryFilter";
import SearchBar from "@/components/SearchBar";
import MarketplaceFilters from "@/components/MarketplaceFilters";
import { createClient } from "@/lib/supabase/client";
import {
  automations as mockAutomations,
  categories as mockCategories,
} from "@/lib/mock-data";
import { Automation, Category } from "@/lib/types";

type SortOption = "popular" | "price-asc" | "price-desc" | "rating";

const ITEMS_PER_PAGE = 12;

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("popular");
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Advanced filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [freeTrialOnly, setFreeTrialOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();

      const [automationsRes, categoriesRes] = await Promise.all([
        supabase
          .from("automations")
          .select("*, category:categories(*)")
          .eq("is_approved", true),
        supabase.from("categories").select("*"),
      ]);

      if (
        automationsRes.error ||
        !automationsRes.data ||
        automationsRes.data.length === 0
      ) {
        setAutomations(mockAutomations);
      } else {
        setAutomations(automationsRes.data as Automation[]);
      }

      if (
        categoriesRes.error ||
        !categoriesRes.data ||
        categoriesRes.data.length === 0
      ) {
        setCategories(mockCategories);
      } else {
        setCategories(categoriesRes.data as Category[]);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    automations.forEach((a) => {
      counts[a.category_id] = (counts[a.category_id] || 0) + 1;
    });
    return counts;
  }, [automations]);

  const filtered = useMemo(() => {
    let result = [...automations];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.short_description.toLowerCase().includes(q) ||
          (a.tags && a.tags.some((t) => t.includes(q)))
      );
    }

    if (selectedCategory) {
      const cat = categories.find((c) => c.slug === selectedCategory);
      if (cat) {
        result = result.filter((a) => a.category_id === cat.id);
      }
    }

    // Price range filter
    result = result.filter(
      (a) =>
        Number(a.price_monthly) >= priceRange[0] &&
        Number(a.price_monthly) <= priceRange[1]
    );

    // Platform filter
    if (selectedPlatforms.length > 0) {
      result = result.filter((a) => selectedPlatforms.includes(a.platform));
    }

    // Min rating filter
    if (minRating > 0) {
      result = result.filter((a) => Number(a.avg_rating) >= minRating);
    }

    switch (sort) {
      case "popular":
        result.sort(
          (a, b) => Number(b.install_count) - Number(a.install_count)
        );
        break;
      case "price-asc":
        result.sort(
          (a, b) => Number(a.price_monthly) - Number(b.price_monthly)
        );
        break;
      case "price-desc":
        result.sort(
          (a, b) => Number(b.price_monthly) - Number(a.price_monthly)
        );
        break;
      case "rating":
        result.sort((a, b) => Number(b.avg_rating) - Number(a.avg_rating));
        break;
    }

    return result;
  }, [
    automations,
    categories,
    search,
    selectedCategory,
    sort,
    priceRange,
    selectedPlatforms,
    minRating,
  ]);

  const visibleItems = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-500">
          Discover AI-powered automations for your business
        </p>
      </div>

      {/* Sticky header: SearchBar + Category pills */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={search}
              onChange={setSearch}
              automations={automations}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="lg:hidden"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal className="mr-1 h-4 w-4" />
              Filters
            </Button>
            <ArrowUpDown className="h-4 w-4 text-gray-400" />
            <Select
              value={sort}
              onValueChange={(v) => setSort(v as SortOption)}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={(slug) => {
            setSelectedCategory(slug);
            setVisibleCount(ITEMS_PER_PAGE);
          }}
          categoryCounts={categoryCounts}
        />
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500">
        {filtered.length} automatizaciones encontradas
      </p>

      {/* Layout: sidebar + grid */}
      <div className="flex gap-8">
        {/* Sidebar filters - desktop */}
        <aside className="hidden w-60 flex-shrink-0 lg:block">
          <div className="sticky top-24 rounded-xl border bg-white p-5">
            <MarketplaceFilters
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={(slug) => {
                setSelectedCategory(slug);
                setVisibleCount(ITEMS_PER_PAGE);
              }}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              selectedPlatforms={selectedPlatforms}
              onPlatformsChange={setSelectedPlatforms}
              minRating={minRating}
              onMinRatingChange={setMinRating}
              freeTrialOnly={freeTrialOnly}
              onFreeTrialChange={setFreeTrialOnly}
              categoryCounts={categoryCounts}
            />
          </div>
        </aside>

        {/* Mobile filters drawer */}
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setShowMobileFilters(false)}
            />
            <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Filters</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <MarketplaceFilters
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={(slug) => {
                  setSelectedCategory(slug);
                  setVisibleCount(ITEMS_PER_PAGE);
                }}
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                selectedPlatforms={selectedPlatforms}
                onPlatformsChange={setSelectedPlatforms}
                minRating={minRating}
                onMinRatingChange={setMinRating}
                freeTrialOnly={freeTrialOnly}
                onFreeTrialChange={setFreeTrialOnly}
                categoryCounts={categoryCounts}
              />
              <Button
                className="mt-6 w-full gradient-primary text-white"
                onClick={() => setShowMobileFilters(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg text-gray-500">
                No automations found. Try adjusting your filters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {visibleItems.map((a) => (
                  <AutomationCard
                    key={a.id}
                    automation={a}
                    showQuickSubscribe
                  />
                ))}
              </div>

              {hasMore && (
                <div className="mt-10 text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() =>
                      setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                    }
                    className="px-8"
                  >
                    Load More ({filtered.length - visibleCount} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
