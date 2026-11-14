import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { cx } from "../../lib/cx";
import "./debounced-search.css";

type DebouncedSearchProps = {
  onSearch: (query: string) => void;
  delay?: number;
  minChars?: number;
  placeholder?: string;
  className?: string;
};

export function DebouncedSearch({
  onSearch,
  delay = 300,
  minChars = 2,
  placeholder = "Search…",
  className,
}: DebouncedSearchProps) {
  const [query, setQuery] = useState("");
  
  // 1. Refs for the input and the onSearch callback
  const onSearchRef = useRef(onSearch);
  const inputRef = useRef<HTMLInputElement>(null); // 🚀 ADDED THIS

  // 2. Keep the onSearch ref updated so the timer doesn't use stale props
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  // 3. 🚀 RESTORED: The actual debounce logic
  useEffect(() => {
    if (query.length >= minChars) {
      const timer = setTimeout(() => {
        onSearchRef.current(query);
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [query, delay, minChars]);

  // 4. Keyboard shortcut logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={cx("ui-search", className)}>
      <Search className="ui-search__icon" size={16} aria-hidden="true" />
      <input
        ref={inputRef} // 🚀 ATTACHED THE REF
        type="search"
        className="ui-search__input"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
    </div>
  );
}