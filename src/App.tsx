import { useState } from "react";
import { CurrencyCounter } from "./components/CurrencyCounter";
import { PrivacyBadge } from "./components/PrivacyBadge";
import { DebouncedSearch } from "./components/DebouncedSearch";
import StatusBadge from "./components/StatusBadge/StatusBadge";
import { StatCard } from "./components/StatCard/StatCard";
import { OmniInput } from "./components/OmniInput/OmniInput";
import { HoldToConfirmButton } from "./components/HoldToConfirmButton/HoldToConfirmButton";
import { DemoBlock } from "./components/DemoBlock";
import { AlertTriangle } from "lucide-react";
import { FinancialCalculator } from "./components/FinancialCalculator";
import { calculateEmi, generateAmortizationSchedule } from "./components/FinancialCalculator/emiHelpers";
import { SplitBill } from "./components/SplitBill";
import type { SplitBillResult } from "./components/SplitBill";
import { FeeTransparencyBar } from "./components/FeeTransparenyBar";
import type { FeeTransparencyBarResult, FeeItem } from "./components/FeeTransparenyBar";
import type { TimelineStep } from "./components/PaymentTimeline";
import PaymentTimeline from "./components/PaymentTimeline/PaymentTimeline";
// 🚀 1. IMPORT PIN INPUT & CSS
import { PinInput } from "./components/PinInput/PinInput";
import "./components/PinInput/PinInput.css";
import { SavingsGoalTracker } from "./components/SavingsGoalTracker";
import { PiggyBank } from "lucide-react";
import "./App.css";

// 🚀 2. EXTRACT DATA (Simulating data from an API)
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

const MOCK_FEES: FeeItem[] = [
  { label: "Service Fee", type: "percentage", value: 0.5 },
  { label: "Network Fee", type: "fixed", value: 2.50 },
  { label: "Platform Fee", type: "fixed", value: 0, isFree: true }, // Demonstrates the green "Free" pill
];

// 🚀 3. PAYMENT TIMELINE MOCK DATA
const MOCK_TIMELINE_STEPS: TimelineStep[] = [
  {
    id: "created",
    label: "Payment initiated",
    description: "You sent $1,250.00 to Acme Corp.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: "compliance",
    label: "Compliance review",
    description: "Automated AML check passed.",
    timestamp: new Date(Date.now() - 1000 * 60 * 45) // 45 mins ago
  },
  {
    id: "processing",
    label: "Processing payment",
    description: "Funds are being routed to the beneficiary.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    meta: { "Transaction ID": "tx_987654321" }
  },
  { id: "delivered", label: "Delivered to beneficiary" },
];

const MOCK_TIMELINE_FAILED: TimelineStep[] = [
  { id: "created", label: "Payment initiated", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3) },
  { id: "compliance", label: "Compliance review", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "processing", label: "Processing payment", description: "Insufficient funds on the source account.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1) },
  { id: "delivered", label: "Delivered to beneficiary" },
];

export default function App() {
  // State
  const [balance, setBalance] = useState(124500.5);
  const [transferAmount, setTransferAmount] = useState<number | null>(null);
  const [shares, setShares] = useState<number | null>(null);
  const [btcAmount, setBtcAmount] = useState<number | null>(null);
  const [adImpressions, setAdImpressions] = useState<number | null>(null);

  // 🚀 4. MOCK STATE FOR PIN INPUT
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState<boolean | string>(false);
  const [pinSuccess, setPinSuccess] = useState(false);

  // 🚀 5. EXTRACT HANDLERS (Prevents re-creating functions on every render)
  const handleDeposit = () => setBalance((prev) => prev + 15000.25);
  const handleConfirm = () => alert("Transfer Confirmed!");

  // 🚀 6. PIN INPUT HANDLERS
  const handlePinChange = (val: string) => {
    setPinValue(val);
    if (pinError) setPinError(false); // Clear error when user starts typing again
    if (pinSuccess) setPinSuccess(false);
  };

  // 🚀 7. SPLIT INPUT HANDLERS
  const [_, setSplitBillResult] = useState<SplitBillResult | null>(null);

  // 🚀 8. Fee Transparency State
  const [feeAmount, setFeeAmount] = useState<number | null>(1000);
  const [, setFeeResult] = useState<FeeTransparencyBarResult | null>(null);
const [saved, setSaved] = useState(45000);
  const handlePinComplete = (val: string) => {
    // Simulate API validation (1234 is the correct PIN)
    if (val === "1234") {
      setPinSuccess(true);
      setPinError(false);
    } else {
      setPinError("Incorrect PIN. Please try 1234.");
      setPinSuccess(false);

      // Optional: Clear the input after a short delay on failure
      setTimeout(() => {
        setPinValue("");
        setPinError(false);
      }, 1500);
    }
  };

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

      {/* 🚀 9. NEW PIN INPUT DEMO BLOCK */}
      <DemoBlock
        title="Pin Input Component"
        description="Secure PIN entry with mobile keyboard support. Try typing '1234' to succeed, or any other 4 digits to fail."
      >
        <div className="demo-flex-col" style={{ alignItems: "center", gap: "16px" }}>

          <PinInput
            length={4}
            mask={false} // Hides the digits with bullets
            value={pinValue}
            onChange={handlePinChange}
            onComplete={handlePinComplete}
            error={pinError}
            autoFocus={false} // Set to true if you want it to grab focus immediately
          />

          {/* Success Message Display */}
          {pinSuccess && (
            <span style={{ color: "#10b981", fontWeight: "bold" }}>
              ✅ PIN Verified Successfully!
            </span>
          )}

        </div>
      </DemoBlock>

      <DemoBlock
        title="Financial Calculator Engine"
        description="A scalable engine for EMI, SIP, and Tax calculators."
      >
        <FinancialCalculator
          title="Loan EMI Calculator"
          locale="en-IN"
          theme="dark"
          inputs={[
            { id: "principal", label: "Loan Amount", min: 10000, max: 10000000, step: 10000, defaultValue: 500000, prefix: "₹" },
            { id: "rate", label: "Interest Rate", min: 1, max: 30, step: 0.1, defaultValue: 8.5, suffix: "%" },
            { id: "tenure", label: "Tenure", min: 1, max: 30, step: 1, defaultValue: 5, suffix: " Yrs" },
          ]}
          calculate={(values) => {
            const emi = calculateEmi(values.principal, values.rate, values.tenure * 12);
            const totalPayment = emi * values.tenure * 12;
            const totalInterest = totalPayment - values.principal;
            const schedule = generateAmortizationSchedule(values.principal, values.rate, values.tenure);

            const formatMoney = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

            return {
              result: {
                highlightLabel: "Monthly EMI",
                highlightValue: formatMoney(emi),
                breakdown: [
                  { label: "Principal Amount", value: formatMoney(values.principal) },
                  { label: "Total Interest", value: formatMoney(totalInterest), isWarning: true },
                  { label: "Total Payment", value: formatMoney(totalPayment) },
                ]
              },
              table: {
                columns: ["Year", "Principal Paid", "Interest Paid", "Balance"],
                rows: schedule.map(row => [
                  `Year ${row.year}`,
                  formatMoney(row.principalPaid),
                  formatMoney(row.interestPaid),
                  formatMoney(row.balance)
                ])
              }
            };
          }}
          currency={""}
        />
      </DemoBlock>

      <DemoBlock
        title="Split Bill Component"
        description="Frontend-only bill splitter. Add people, pick a split mode, set tip and tax."
      >
        <SplitBill
          currency="INR"
          defaultPeople={["Ana", "Ben", "Cara"]}
          defaultTip={15}
          onChange={(result) => {
            console.log("onChange payload:", result);
            setSplitBillResult(result); // Keep this if you want to use the state elsewhere later
          }}
        />
      </DemoBlock>

      <DemoBlock
        title="Fee Transparency Bar"
        description="A trust mechanism for fintech. Update the amount below to see the fees calculate instantly in real-time."
      >
        <div className="demo-flex-col" style={{ gap: "32px" }}>

          {/* Input to control the amount */}
          <OmniInput
            format="currency"
            currency="USD"
            locale="en-US"
            label="Amount to send"
            value={feeAmount}
            onChange={(val) => setFeeAmount(val || 0)}
            presets={[100, 500, 1000, 5000]}
          />

          {/* The Premium Transparency Bar */}
          <FeeTransparencyBar
            amount={feeAmount || 0}
            fees={MOCK_FEES}
            currency="USD"
            locale="en-US"
            variant="detailed"
            theme="dark"
            onChange={(result) => {
              console.log("Fee calculation:", result); // Logs to browser console instead
              setFeeResult(result);
            }}
          />
        </div>
      </DemoBlock>

      {/* 🚀 10. PAYMENT TIMELINE DEMO BLOCKS */}
      <DemoBlock
        title="Payment Timeline (Vertical)"
        description="The standard audit trail view for transaction detail pages. Shows timestamps and descriptions."
      >
        <PaymentTimeline
          steps={MOCK_TIMELINE_STEPS}
          variant="vertical"
          currentStepId="processing"
          locale="en-US"
          theme="dark" showTimestamps={false} />
      </DemoBlock>

      <DemoBlock
        title="Payment Timeline (Horizontal)"
        description="A compact checkout stepper. Great for top-of-page progress indicators."
      >
        <PaymentTimeline
          steps={MOCK_TIMELINE_STEPS}
          variant="horizontal"
          currentStepId="processing"
          showTimestamps={false}
          locale="en-US"
          theme="dark"
        />
      </DemoBlock>

      <DemoBlock
        title="Payment Timeline (Compact)"
        description="A minimal vertical list for sidebars or cards. Hides descriptions to save space."
      >
        <PaymentTimeline
          steps={MOCK_TIMELINE_STEPS}
          variant="compact"
          currentStepId="processing"
          locale="en-US"
          theme="dark" showTimestamps={false} />
      </DemoBlock>

      <DemoBlock
        title="Payment Timeline (Card)"
        description="A hero view answering 'Where is my payment?'. Includes a prominent status badge."
      >
        <PaymentTimeline
          steps={MOCK_TIMELINE_STEPS}
          variant="card"
          currentStepId="processing"
          locale="en-US"
          theme="dark" showTimestamps={false} />
      </DemoBlock>

      <DemoBlock
        title="Payment Timeline (Failure State)"
        description="Demonstrates how the timeline handles a failed transaction (red X, error description)."
      >
        <PaymentTimeline
          steps={MOCK_TIMELINE_FAILED}
          variant="vertical"
          currentStepId="processing"
          failedStepId="processing"
          locale="en-US"
          theme="dark" showTimestamps={false} />
      </DemoBlock>
<DemoBlock
  title="Savings Goal (Default)"
  description="Progress bar, amounts, and time left to the target date."
>
  <SavingsGoalTracker
    title="Emergency Fund"
    targetAmount={500000}
    savedAmount={325000}
    targetDate="2027-06-30"
    currency="INR"
    locale="en-IN"
    variant="default"
    theme="dark"
    icon={<PiggyBank size={18} />}
  />
</DemoBlock>

<DemoBlock
  title="Savings Goal (Detailed)"
  description="Adds the Contribute button. Click it to add money."
>
  <SavingsGoalTracker
    title="New Laptop"
    targetAmount={120000}
    savedAmount={saved}
    targetDate="2027-03-31"
    currency="INR"
    locale="en-IN"
    variant="detailed"
    theme="dark"
    onContribute={() => setSaved((s) => s + 10000)}
  />
</DemoBlock>

<DemoBlock title="Savings Goal (Compact)" description="A small row for lists and dashboards.">
  <SavingsGoalTracker
    title="Trip Fund"
    targetAmount={80000}
    savedAmount={20000}
    currency="INR"
    locale="en-IN"
    variant="compact"
    theme="dark"
  />
</DemoBlock>

<DemoBlock title="Savings Goal (Circular)" description="A ring with the percentage in the middle.">
  <SavingsGoalTracker
    title="Down Payment"
    targetAmount={2000000}
    savedAmount={900000}
    currency="INR"
    locale="en-IN"
    variant="circular"
    theme="dark"
  />
</DemoBlock>

<DemoBlock
  title="Savings Goal (Completed)"
  description="Saved more than the target: shows the exceeded message."
>
  <SavingsGoalTracker
    title="Course Fee"
    targetAmount={25000}
    savedAmount={27500}
    currency="INR"
    locale="en-IN"
    variant="default"
    theme="dark"
  />
</DemoBlock>
    </div>
  );
}