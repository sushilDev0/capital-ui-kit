import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, X, Loader2 } from "lucide-react";
import { useDebounce } from "./useDebounce";
import type { DebouncedSearchProps } from "./schema";

const themes = {
  dark: {
    icon: "text-slate-500",
    input:
      "border-slate-800 bg-slate-900/80 text-slate-100 placeholder-slate-500 focus:border-emerald-500/50 focus:ring-emerald-500/20",
    clear: "text-slate-500 hover:bg-slate-800 hover:text-slate-200",
    kbd: "border-slate-800 bg-slate-950 text-slate-500",
  },
  light: {
    icon: "text-slate-400",
    input:
      "border-slate-200 bg-white/90 text-slate-900 placeholder-slate-400 focus:border-emerald-500/60 focus:ring-emerald-500/20",
    clear: "text-slate-400 hover:bg-slate-100 hover:text-slate-700",
    kbd: "border-slate-200 bg-slate-50 text-slate-500",
  },
};

const isMac =
  typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform);

export function DebouncedSearch({
  onSearch,
  delay = 300,
  minChars = 2,
  isLoading = false,
  enableShortcut = true,
  placeholder = "Search assets or transactions...",
  theme = "dark",
  className = "",
  ...restProps
}: DebouncedSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedValue = useDebounce(searchTerm, delay);
  const inputRef = useRef<HTMLInputElement>(null);

  // Always call the latest onSearch without re-running effects
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // Last query actually sent; starts empty so mount doesn't fire
  const lastSent = useRef("");

  const send = (query: string) => {
    if (query === lastSent.current) return;
    lastSent.current = query;
    onSearchRef.current(query);
  };

  // 1. Fire onSearch when the debounced value changes
  useEffect(() => {
    const trimmed = debouncedValue.trim();
    send(trimmed.length >= minChars ? trimmed : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue, minChars]);

  // 2. Cmd+K / Ctrl+K focuses the input
  useEffect(() => {
    if (!enableShortcut) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableShortcut]);

  const handleClear = () => {
    setSearchTerm("");
    send(""); // reset results immediately
    inputRef.current?.focus();
  };

  const t = themes[theme];

  return (
    <div role="search" className={`relative w-full max-w-sm ${className}`}>
      <div className="relative flex items-center">
        <div className={`pointer-events-none absolute left-3.5 flex items-center justify-center ${t.icon}`}>
          <Search size={16} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape" && searchTerm) handleClear();
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-busy={isLoading}
          className={`w-full rounded-2xl border py-2.5 pl-10 pr-20 text-sm shadow-lg backdrop-blur-sm transition-colors focus:outline-none focus:ring-2 ${t.input}`}
          {...restProps}
        />

        <div className="absolute right-3 flex items-center gap-1.5">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center text-emerald-500"
              >
                <Loader2 size={16} className="animate-spin" />
              </motion.div>
            ) : searchTerm ? (
              <motion.button
                key="clear"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                type="button"
                onClick={handleClear}
                className={`rounded-full p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${t.clear}`}
                aria-label="Clear search input"
              >
                <X size={14} />
              </motion.button>
            ) : enableShortcut ? (
              <motion.kbd
                key="shortcut"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`pointer-events-none hidden select-none items-center rounded border px-1.5 py-0.5 font-mono text-[10px] sm:inline-flex ${t.kbd}`}
              >
                {isMac ? "⌘K" : "Ctrl K"}
              </motion.kbd>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}