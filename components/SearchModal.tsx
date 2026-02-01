"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Clock, TrendingUp, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { automations as mockAutomations } from "@/lib/mock-data";

const recentSearches = ["ecommerce automation", "email marketing", "lead generation"];
const popularSearches = ["AI chatbot", "social media scheduler", "invoice automation", "CRM sync"];

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && open) {
        onClose();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const suggestions =
    query.length >= 2
      ? mockAutomations
          .filter(
            (a) =>
              a.title.toLowerCase().includes(query.toLowerCase()) ||
              a.short_description.toLowerCase().includes(query.toLowerCase())
          )
          .slice(0, 5)
      : [];

  const handleSelect = (id: string) => {
    onClose();
    router.push(`/marketplace/${id}`);
  };

  const handleSearchSubmit = () => {
    if (query.trim()) {
      onClose();
      router.push(`/marketplace?search=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/50 backdrop-blur-sm pt-[10vh]"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl mx-4 rounded-2xl bg-white shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearchSubmit();
              if (e.key === "Escape") onClose();
            }}
            placeholder="Search automations..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
          />
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4">
          {query.length >= 2 && suggestions.length > 0 ? (
            <div>
              <p className="mb-2 text-xs font-medium uppercase text-gray-400">Results</p>
              {suggestions.map((a) => (
                <button
                  key={a.id}
                  onClick={() => handleSelect(a.id)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                    <Zap className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-black">{a.title}</p>
                    <p className="truncate text-xs text-gray-500">{a.platform} &middot; &euro;{a.price_monthly}/mo</p>
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <p className="py-8 text-center text-sm text-gray-500">No results found for &ldquo;{query}&rdquo;</p>
          ) : (
            <div className="space-y-6">
              {/* Recent Searches */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-400">Recent Searches</p>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Popular Searches */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-400">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-600 transition-colors hover:border-black hover:bg-gray-50 hover:text-black"
                    >
                      <TrendingUp className="h-3 w-3" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Suggested Automations */}
              <div>
                <p className="mb-2 text-xs font-medium uppercase text-gray-400">Suggested</p>
                {mockAutomations.slice(0, 3).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleSelect(a.id)}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                      <Zap className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-black">{a.title}</p>
                      <p className="truncate text-xs text-gray-500">{a.short_description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t px-4 py-2.5 text-xs text-gray-400 flex items-center justify-between">
          <span>Press <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono">/</kbd> to search</span>
          <span>Press <kbd className="rounded border bg-gray-100 px-1.5 py-0.5 text-[10px] font-mono">ESC</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
