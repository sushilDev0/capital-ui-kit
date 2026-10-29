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
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  useEffect(() => {
    const q = query.trim();
    if (q.length < minChars) return;
    const id = setTimeout(() => onSearchRef.current(q), delay);
    return () => clearTimeout(id);
  }, [query, delay, minChars]);

  return (
    <div className={cx("ui-search", className)}>
      <Search className="ui-search__icon" size={16} aria-hidden="true" />
      <input
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