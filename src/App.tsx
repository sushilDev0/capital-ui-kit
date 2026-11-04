
import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import StatusBadge from "./components/StatusBadge/StatusBadge";
import { StatCard } from "./components/StatCard/StatCard";
import { OmniInput } from "./components/OmniInput/OmniInput";
import { HoldToConfirmButton } from "./components/HoldToConfirmButton/HoldToConfirmButton";
import { DemoBlock } from "./components/DemoBlock";
import {  AlertTriangle } from "lucide-react";
import "./App.css";

// 🚀 1. EXTRACT DATA (Simulating data from an API)
const MOCK_STATS = [
  { title: "Total Revenue", value: "$1,200,000", delta: "+15.5%", trend: "up" as const },
  { title: "Active Users", value: "3,450", delta: "-5.2%", trend: "down" as const },
  { title: "New Signups", value: "1,200", delta: "+0.0%", trend: "neutral" as const },
];

const MOCK_BADGES = [
  { status: "failed" as const, color: "rose" as const },
  { status: "completed" as const, color: "teal" as const },
  { status: "arrived" as const, color: "indigo" as const },
  { status: "refunded" as const, color: "amber" as const },
];

export default function App() {
  // State
  const [balance, setBalance] = useState(124500.5);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);
  const [shares, setShares] = useState<number | null>(null);
  const [btcAmount, setBtcAmount] = useState<number | null>(null);
  const [adImpressions, setAdImpressions] = useState<number | null>(null);

  // 🚀 2. EXTRACT HANDLERS (Prevents re-creating functions on every render)
  const handleDeposit = () => setBalance((prev) => prev + 15000.25);
  const handleConfirm = () => alert("Transfer Confirmed!");

  return (
    <div className="app-container">
      
      <DemoBlock title="Privacy Badge Component">
        <PrivacyBadge value="1234567890123456" label="Credit Card" revealable />
      </DemoBlock>

      <DemoBlock title="CurrencyCounter Component">
        <CurrencyCounter
          value={balance}
          label="Net Investment"
          currency="INR"
          theme="light"
          trendPercentage={15.5}
          trendDirection="up"
        />
        <button onClick={handleDeposit} className="deposit-btn">
          Simulate Deposit (+$15,000.25)
        </button>
      </DemoBlock>

      <DemoBlock 
        title="Debounced Search Component" 
        description="Type in the search box below. The search will be logged after a 400ms delay."
      >
        <DebouncedSearch onSearch={(q) => console.log("search:", q)} delay={400} minChars={2} />
      </DemoBlock>

      <DemoBlock 
        title="Status Badge Component" 
        description="Map over an array of statuses to render badges dynamically."
      >
        <div className="status-badge-container">
          {/* 🚀 3. DYNAMIC RENDERING */}
          {MOCK_BADGES.map((badge, i) => (
            <StatusBadge key={i} status={badge.status} color={badge.color} theme="dark" />
          ))}
        </div>
      </DemoBlock>

      <DemoBlock title="Stat Card Component" description="KPI cards with spring animations.">
        <div className="demo-flex-row">
          {MOCK_STATS.map((stat, i) => (
            <StatCard key={i} {...stat} size="md" theme="dark" />
          ))}
        </div>
      </DemoBlock>

      <DemoBlock 
        title="Omni Input (Universal Input)" 
        description="Demonstrating 4 different domains using one component."
      >
        <div className="demo-flex-col">
          <OmniInput
            format="currency"
            currency="USD"
            locale="en-US"
            label="Transfer Amount (Fiat)"
            value={transferAmount}
            onChange={setTransferAmount}
            presets={[500, 1000, 5000]}
            min={100}
            max={100000}
          />

          <OmniInput 
            format="decimal"
            symbol="AAPL"
            symbolPosition="suffix"
            decimals={2}
            label="Buy Shares (Stock Market)"
            value={shares}
            onChange={setShares}
          />

          <OmniInput 
            format="decimal"
            symbol="BTC"
            symbolPosition="suffix"
            decimals={8}
            label="Sell Amount (Crypto)"
            enableShortcuts
            value={btcAmount}
            onChange={setBtcAmount}
          />

          <OmniInput 
            format="compact"
            decimals={0}
            label="Ad Impressions (Marketing)"
            value={adImpressions}
            onChange={setAdImpressions}
          />
        </div>
      </DemoBlock>

      <DemoBlock 
        title="Hold To Confirm Button" 
        description="A safety interaction for high-stakes actions."
      >
       <HoldToConfirmButton 
          variant="solid" 
          theme="danger" 
          size="md" 
          holdDuration={2000}
          onConfirm={handleConfirm} 
          label="Hold to Factory Reset"
          icon={<AlertTriangle size={18} />}
        />

     
      </DemoBlock>

    </div>
  );
}