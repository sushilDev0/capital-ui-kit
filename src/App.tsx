import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import "./App.css"; // Import your plain CSS file
import StatusBadge from "./components/StatusBadge/StatusBadge";

export default function App() {
  const [balance, setBalance] = useState(124500.5);
  const budget = 100000;
  const spent = 120000;

  return (
    <div className="app-container">
      <PrivacyBadge key="value" value="1234567890123456" label="Credit Card" revealable />

      <CurrencyCounter
        value={balance}
        label="Net Investment"
        currency="INR"
        theme="light"
        trendPercentage={15.5}
        trendDirection={spent > budget ? "down" : "up"}


      />

      <button
        onClick={() => setBalance((prev) => prev + 15000.25)}
        className="deposit-btn"
      >
        Simulate Deposit (+$15,000.25)
      </button>

      <DebouncedSearch onSearch={(q) => console.log("search:", q)} delay={400} minChars={2} />

      <StatusBadge status="failed" color="rose" theme="dark" />
    </div>
  );
}