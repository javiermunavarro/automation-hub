"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Automation } from "@/lib/types";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  automations?: Automation[];
}

export default function SearchBar({ value, onChange, automations = [] }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const suggestions =
    value.length >= 2
      ? automations
          .filter(
            (a) =>
              a.title.toLowerCase().includes(value.toLowerCase()) ||
              a.short_description.toLowerCase().includes(value.toLowerCase())
          )
          .slice(0, 5)
      : [];

  useEffect(() => {
    setHighlightIndex(-1);
    setIsOpen(suggestions.length > 0 && value.length >= 2);
  }, [value, suggestions.length]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      router.push(`/marketplace/${suggestions[highlightIndex].id}`);
      setIsOpen(false);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        type="text"
        placeholder="Buscar automatizaciones..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => suggestions.length > 0 && setIsOpen(true)}
        className="pl-10"
      />
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((a, index) => (
            <button
              key={a.id}
              className={`flex w-full items-center justify-between px-4 py-3 text-left text-sm transition-colors ${
                index === highlightIndex ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => {
                router.push(`/marketplace/${a.id}`);
                setIsOpen(false);
              }}
              onMouseEnter={() => setHighlightIndex(index)}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-gray-900">{a.title}</p>
                <p className="truncate text-xs text-gray-500">{a.platform}</p>
              </div>
              <span className="ml-3 flex-shrink-0 text-sm font-semibold text-gray-700">
                &euro;{a.price_monthly}/mo
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
