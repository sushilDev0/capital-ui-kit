import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import "./App.css"; // Import your plain CSS file
import StatusBadge from "./components/StatusBadge/StatusBadge";
import { StatCard } from "./components/StatCard/StatCard";

export default function App() {
  const [balance, setBalance] = useState(124500.5);
  const budget = 100000;
  const spent = 120000;

  return (
    <div className="app-container">
      <div className="app-blocks">
        <h2>Privacy Badge Component</h2>
        <PrivacyBadge key="value" value="1234567890123456" label="Credit Card" revealable />
      </div>
      <div className="app-blocks">
        <h2>CurrencyCounter Component</h2>
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

      </div>
      <div className="app-blocks">
        <h2>Debounced Search Component</h2>
        <p>Type in the search box below. The search will be logged to the console after a 400ms delay.</p>
        <DebouncedSearch onSearch={(q) => console.log("search:", q)} delay={400} minChars={2} />
      </div>
      <div className="app-blocks">
        <h2>Status Badge Component</h2>
        <p>This is a status badge indicating a failed status with a rose color theme.</p>
        <div className="status-badge-container">

          <StatusBadge status="failed" color="rose" theme="dark" />
          <StatusBadge status="completed" color="teal" theme="dark" />
          <StatusBadge status="arrived" color="indigo" theme="dark" />
          <StatusBadge status="refunded" color="amber" theme="dark" />

        </div>
      </div>
      <div className="app-blocks">
     
        <h2>Stat Card Component</h2>
        <p>This is a stat card showing total revenue with an upward trend.</p>
        <div className="stat-card-container">
          <StatCard
            title="Total Revenue"
            value="$1,200,000"
            delta="+15.5%"
            trend="up"
            size="md"
            theme="dark"
          />
          <StatCard
            title="Active Users"
            value="3,450"
            delta="-5.2%"
            trend="down"
            size="md"
            theme="dark"
          />
          <StatCard
            title="New Signups"
            value="1,200"
            delta="+0.0%"
            trend="neutral"
            size="md"
            theme="dark"
          />
        </div>
      </div>

    </div>
  );
}