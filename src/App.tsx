import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";

export default function App() {
  const [balance, setBalance] = useState(124500.5);

  return (
    <div className="min-h-screen bg-slate-950 p-10 flex flex-col items-center justify-center gap-6">
      <PrivacyBadge
        sensitiveNumber="1234567890123456"
        label="Credit Card"
      />

      <CurrencyCounter
        value={balance}
        label="Net Investment"
        currency="USD"
        trendPercentage={8.4}
      />

      <button
        onClick={() => setBalance((prev) => prev + 15000.25)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
      >
        Simulate Deposit (+₹15,000.25)
      </button>

      <DebouncedSearch
        placeholder="Search for something..."
        onSearch={(query) => console.log("Searching for:", query)}
        enableShortcut={true}
      />
    </div>
  );
}