import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import "./App.css"; // Import your plain CSS file

export default function App() {
  const [balance, setBalance] = useState(124500.5);

  return (
    <div className="app-container">
      <PrivacyBadge key="value" value="1234567890123456" label="Credit Card" revealable />

      <CurrencyCounter
        value={balance}
        label="Net Investment"
        currency="INR"
        locale="en-IN"
        theme="light"
        trendPercentage={15.5}
      />

      <button
        onClick={() => setBalance((prev) => prev + 15000.25)}
        className="deposit-btn"
      >
        Simulate Deposit (+$15,000.25)
      </button>

      <DebouncedSearch onSearch={(q) => console.log("search:", q)} delay={400} minChars={2} />
    </div>
  );
}