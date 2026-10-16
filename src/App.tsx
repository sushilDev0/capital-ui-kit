import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import { Renderer } from "./Renderer";

const goodLayout = {
  sections: [
    { component: "CurrencyCounter", props: { value: 125000.5, label: "Total Balance", trendPercentage: 12.5 } },
    { component: "PrivacyBadge", props: { value: "1234567890123456", label: "Credit Card", revealable: true } },
    { component: "DebouncedSearch", props: { delay: 400 } },
  ],
};

const brokenLayout = {
  sections: [
    { component: "CurrencyCounter", props: { value: "abc", currency: "RUPEES" } },
    { component: "NotAComponent", props: {} },
    { component: "PrivacyBadge", props: { value: "9876543210", label: "Account" } },
  ],
};

export default function App() {
  const [balance, setBalance] = useState(124500.5);

  return (
    <div className="flex min-h-screen flex-col items-center gap-6 bg-slate-950 p-10">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Manual</h2>

      <PrivacyBadge key="value" value="1234567890123456" label="Credit Card" revealable />

      <CurrencyCounter
        value={balance}
        label="Net Investment"
        currency="USD"
        trendPercentage={8.4}
      />

      <button
        onClick={() => setBalance((prev) => prev + 15000.25)}
        className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-emerald-400"
      >
        Simulate Deposit (+$15,000.25)
      </button>

      <DebouncedSearch onSearch={(q) => console.log("search:", q)} delay={400} minChars={2} />

      <hr className="my-6 w-full max-w-sm border-slate-800" />

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">From JSON layout</h2>

      <div className="w-full max-w-sm">
        <Renderer
          layout={goodLayout}
          runtime={{ DebouncedSearch: { onSearch: (q: string) => console.log("layout search:", q) } }}
        />
      </div>

      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Broken layout (should show errors)</h2>

      <div className="w-full max-w-sm">
        <Renderer layout={brokenLayout} />
      </div>


       <div className="flex flex-col gap-4">
      <CurrencyCounter
        value={24580}
        currency="USD"
        locale="en-US"
        label="Total Balance"
        trendPercentage={12}
      />
      <PrivacyBadge key="value"
        value="0000 0000 0000 4821"
        label="Linked Card"
        maskPattern="last4"
        revealable
      />
    </div>
    </div>
  );
}