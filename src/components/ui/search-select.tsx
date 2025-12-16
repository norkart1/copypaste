"use client";

import { Search, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

export interface SearchSelectOption {
  value: string;
  label: string;
  meta?: string;
}

interface SearchSelectProps {
  name: string;
  options: SearchSelectOption[];
  className?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  emptyMessage?: string;
}

export function SearchSelect({
  name,
  options,
  className,
  placeholder = "Search and select",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  required = false,
  emptyMessage = "No matches found",
}: SearchSelectProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(
    value ?? defaultValue ?? options[0]?.value ?? "",
  );
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const selectedValue = isControlled ? value ?? "" : internalValue;

  const selectedOption = useMemo(
    () => options.find((option) => option.value === selectedValue),
    [options, selectedValue],
  );

  useEffect(() => {
    if (isControlled) {
      setInternalValue(value ?? "");
    }
  }, [isControlled, value]);

  useEffect(() => {
    // Don't auto-select if value is explicitly empty string in controlled mode
    if (isControlled && selectedValue === "") {
      return;
    }
    if (!options.some((option) => option.value === selectedValue)) {
      const fallbackValue = options[0]?.value ?? "";
      if (!isControlled) {
        setInternalValue(fallbackValue);
      }
      if (fallbackValue && fallbackValue !== selectedValue) {
        onValueChange?.(fallbackValue);
      }
    }
  }, [isControlled, onValueChange, options, selectedValue]);

  // Focus search input when popup opens
  useEffect(() => {
    if (open && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  // Handle escape key and body scroll
  useEffect(() => {
    if (!open) return;

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("keydown", handleKey);
    
    // Prevent body scroll when popup is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    if (!query.trim()) {
      return options;
    }
    const normalizedQuery = query.toLowerCase();
    return options.filter((option) => {
      const labelMatch = option.label.toLowerCase().includes(normalizedQuery);
      const metaMatch = option.meta?.toLowerCase().includes(normalizedQuery);
      return labelMatch || metaMatch;
    });
  }, [options, query]);

  const handleSelect = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      onValueChange?.(nextValue);
      setOpen(false);
      setQuery("");
    },
    [isControlled, onValueChange],
  );

  const displayLabel = selectedOption?.label ?? placeholder;

  const popupContent = open && !disabled && typeof document !== "undefined" && (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          setOpen(false);
          setQuery("");
        }}
      />
      
      {/* Popup Content */}
      <div className="relative z-[100000] w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Search and Select</h3>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className="rounded-full border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Input */}
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-3">
          <Search className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Type to search..."
            className="flex-1 bg-transparent py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          />
        </div>

        {/* Options List */}
        <div className="max-h-[400px] overflow-y-auto">
          {filteredOptions.length > 0 ? (
            <div className="space-y-1">
              {filteredOptions.map((option) => (
                <button
                  type="button"
                  key={option.value}
                  className={cn(
                    "w-full rounded-xl px-4 py-3 text-left transition hover:bg-gray-100",
                    option.value === selectedValue
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "text-gray-900",
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <p className="font-semibold">{option.label}</p>
                  {option.meta && (
                    <p className="mt-0.5 text-xs text-gray-500">{option.meta}</p>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="text-sm text-gray-500">{emptyMessage}</p>
            </div>
          )}
        </div>

        {/* Footer Info */}
        {filteredOptions.length > 0 && (
          <div className="mt-4 text-center text-xs text-gray-400">
            {filteredOptions.length} {filteredOptions.length === 1 ? "option" : "options"} found
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className={cn("relative", className)} ref={containerRef}>
        <input
          type="hidden"
          name={name}
          value={selectedValue}
          required={required}
        />
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 text-left text-sm text-gray-900 transition hover:border-emerald-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40",
            disabled && "cursor-not-allowed opacity-60",
            open && "border-emerald-400 ring-2 ring-emerald-400/40",
          )}
          onClick={() => !disabled && setOpen((prev) => !prev)}
          disabled={disabled}
        >
          <span className={cn(!selectedOption && "text-gray-400")}>
            {displayLabel}
          </span>
          <svg
            className={cn(
              "h-4 w-4 transition-transform",
              open ? "rotate-180" : "rotate-0",
            )}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 7.5L10 12.5L15 7.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {typeof document !== "undefined" && createPortal(popupContent, document.body)}
    </>
  );
}


