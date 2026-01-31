"use client";

import { Star } from "lucide-react";
import { useState } from "react";

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
  breakdown?: number[];
}

const sizeMap = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-6 w-6",
};

export default function RatingStars({
  rating,
  count,
  size = "sm",
  interactive = false,
  onChange,
  breakdown,
}: RatingStarsProps) {
  const iconSize = sizeMap[size];
  const [showTooltip, setShowTooltip] = useState(false);

  const total = breakdown ? breakdown.reduce((s, c) => s + c, 0) : 0;

  return (
    <div
      className="relative inline-flex items-center gap-1"
      onMouseEnter={() => breakdown && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={interactive ? "cursor-pointer focus:outline-none" : "cursor-default"}
          >
            <Star
              className={`${iconSize} transition-colors ${
                star <= Math.round(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "fill-gray-200 text-gray-200"
              } ${interactive ? "hover:fill-yellow-300 hover:text-yellow-300" : ""}`}
            />
          </button>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-muted-foreground">({count} reviews)</span>
      )}

      {/* Breakdown Tooltip */}
      {showTooltip && breakdown && total > 0 && (
        <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
          <div className="absolute -top-1.5 left-4 h-3 w-3 rotate-45 border-l border-t border-gray-200 bg-white" />
          <p className="mb-2 text-xs font-semibold text-gray-900">Rating Breakdown</p>
          {[5, 4, 3, 2, 1].map((stars) => {
            const idx = 5 - stars;
            const starCount = breakdown[idx] ?? 0;
            const percent = total > 0 ? (starCount / total) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-1.5 text-xs">
                <span className="w-3 text-right text-gray-500">{stars}</span>
                <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-yellow-400"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-7 text-right text-gray-400">{Math.round(percent)}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
