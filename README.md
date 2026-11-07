# Capital UI Kit

![CI](https://github.com/sushilDev0/capital-ui-kit/actions/workflows/ci.yml/badge.svg)

Typed fintech React components with Zod schemas, styled with plain layered CSS. They work in any React 19 project, and Tailwind users can override them with ordinary utility classes.

> Status: work in progress. More components and a docs site are planned.

## Install

```bash
npm install capital-ui-kit
```

Requires React 19. Importing the package also imports its stylesheet, so your bundler picks the styles up like any other CSS import and there is no CSS file to add by hand. If your setup does not process CSS from `node_modules`, import it yourself once with `import "capital-ui-kit/styles.css"`.

```tsx
import { CurrencyCounter } from "capital-ui-kit";

export default function App() {
  return (
    <CurrencyCounter
      value={150000}
      label="Net Investment"
      currency="INR"
      locale="en-IN"
      theme="dark"
      trendPercentage={15.5}
    />
  );
}
```

## Components

| Component | What it is |
|---|---|
| `CurrencyCounter` | Animated currency amount with a caption and a trend badge |
| `PrivacyBadge` | Masked card or account number with an optional reveal button |
| `DebouncedSearch` | Search input with debounce and a minimum character count |
| `StatusBadge` | Consistent paid, pending, failed and refunded states for transaction, invoice and order lists |
| `StatCard` | KPI card with spring-animated rising numbers, trend deltas, and glassmorphism |
| `OmniInput` | Universal amount input for Fiat, Crypto, Stocks, and Marketing with smart formatting |
| `HoldToConfirmButton` | Safety button requiring a long press to confirm high-stakes actions (e.g., deleting an account) |
| `FinancialCalculator` | Universal calculator engine with dynamic sliders, animated results, and amortization tables |
| `SplitBill` | Frontend-only bill splitter with equal, custom and percentage splits, tip, tax, and rounding that always sums to the total|
| `FeeTransparencyBar` | A premium checkout component showing a transparent breakdown of fees, taxes, and totals |

<!-- TODO: add a props section for StatusBadge and StatCard, like the PrivacyBadge one below -->

More fintech components are planned. `OtpInput` and `SplitBill` are next, followed by a transaction list, budget progress, a payment card and others.

### PrivacyBadge

Shows a card or account number with most of it hidden. The full value is never rendered into the page while it is hidden, and values of 4 characters or fewer are always fully masked.

```tsx
<PrivacyBadge value="1234 5678 9012 3456" label="Credit card" revealable />
// •••• •••• •••• 3456
```

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `string` | required | The number to show. Spaces and dashes are ignored and the result is regrouped in 4s. Letters work too, so account numbers such as IBANs are fine. Layout JSON validated against the schema accepts digits, spaces and dashes only |
| `label` | `string` | none | Small caption above the number |
| `maskPattern` | `"last4"` \| `"first4"` \| `"all"` | `"last4"` | Which characters stay visible |
| `maskChar` | `"•"` \| `"*"` | `"•"` | Character used for hidden positions |
| `revealable` | `boolean` | `false` | Adds an eye button that shows and hides the number |
| `theme` | `"dark"` \| `"light"` | `"dark"` | Colour theme |
| `className` | `string` | none | Added to the root element |

Screen readers do not read the row of masked characters. They hear a short description such as "Hidden, ending in 3 4 5 6", and hear the full number only after the person presses the reveal button.

### OmniInput

A highly scalable, universal input component built for Fintech, Crypto, Stock Markets, and Marketing Analytics. It handles complex locale formatting, decimal constraints, and shortcut parsing (e.g., typing `1.5k` becomes `1,500.00`).


```tsx
<OmniInput 
  format="decimal" 
  symbol="BTC" 
  symbolPosition="suffix" 
  decimals={8} 
  label="Sell Amount"
  enableShortcuts
  onChange={(val) => console.log(val)}
/>
// Output on blur: 1.50000000 BTC
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `value` | `number \| null` | `null` | The controlled numeric value. `null` means empty. |
| `onChange` | `(value: number \| null) => void` | **Required** | Called with the parsed number, never the formatted text. |
| `format` | `"currency" \| "decimal" \| "percent" \| "compact"` | `"currency"` | The formatting engine. `compact` turns `1500000` into `1.5M`. |
| `locale` | `string` | `"en-IN"` | Controls grouping (e.g., `en-IN` = `12,34,567`, `en-US` = `1,234,567`). |
| `decimals` | `number` | `2` | Max decimals. `2` for fiat, `8` for crypto, `0` for whole numbers. |
| `currency` | `string` | `"INR"` | ISO currency code used by the `Intl` API. |
| `symbol` | `string` | `none` | Overrides the currency symbol. Use for crypto (`BTC`) or stocks (`AAPL`). |
| `symbolPosition` | `"prefix" \| "suffix"` | `"prefix"` | Places the symbol before (`$100`) or after (`100 BTC`). |
| `showSymbol` | `boolean` | `true` | Toggles the currency/symbol display. |
| `min` / `max` | `number` | `none` | Validation limits checked on blur. |
| `enableShortcuts` | `boolean` | `true` | Allows typing `1k` for `1000`, `1m` for `1,000,000`. |
| `presets` | `number[]` | `none` | Renders quick-fill pill buttons below the input. |
| `size` | `"sm" \| "md" \| "lg" \| "xl"` | `"md"` | Fluidly scales padding, text, and radius. |
| `variant` | `"default" \| "ghost" \| "flushed"` | `"default"` | `default` is glass, `flushed` is an underline only. |
| `theme` | `"dark" \| "light"` | `"dark"` | Colour theme. |
| `prefix` / `suffix` | `ReactNode` | `none` | Slots to inject custom elements (e.g., a token selector or "MAX" button). |
| `className` | `string` | `none` | Added to the root element. |


### HoldToConfirmButton

A safety-first button that requires the user to press and hold for a specific duration (e.g., 1 second) to confirm a destructive or high-stakes action. Features a fluid progress animation, automatic text contrast calculation, and semantic theme colors.

```tsx
<HoldToConfirmButton 
  variant="solid" 
  theme="danger" 
  size="md" 
  onConfirm={() => alert("Account Deleted")} 
  label="Hold to Delete Account"
  icon={<TrashIcon />}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onConfirm` | `() => void` | **Required** | Callback triggered only after the hold duration completes. |
| `label` | `string` | `"Hold to confirm"` | The text inside the button. |
| `holdDuration` | `number` | `1000` | Time in milliseconds the user must hold the button. |
| `disabled` | `boolean` | `false` | Disables the button and ignores interactions. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Button padding and font size. |
| `variant` | `"solid" \| "outline" \| "ghost"` | `"solid"` | Visual style of the button. |
| `theme` | `"primary" \| "success" \| "warning" \| "danger" \| "info" \| "neutral" \| "dark" \| "light" \| string` | `"primary"` | Semantic theme or a custom CSS hex code. Auto-calculates text contrast. |
| `icon` | `ReactNode` | `none` | Optional SVG icon placed before the text. |
| `children` | `ReactNode` | `none` | Overrides the label and icon with fully custom JSX. |
| `className` | `string` | `none` | Added to the root element. |

### FinancialCalculator

A universal engine for building complex financial calculators (EMI, SIP, loans, tax). It provides a highly scalable UI shell with live sliders, animated results, and a dynamic amortization table. The actual math is decoupled and passed in via the `calculate` prop.

```tsx
<FinancialCalculator
  title="Loan EMI Calculator"
  locale="en-IN"
  inputs={[
    { id: "principal", label: "Loan Amount", min: 10000, max: 10000000, step: 10000, defaultValue: 500000, prefix: "₹" },
    { id: "rate", label: "Interest Rate", min: 1, max: 30, step: 0.1, defaultValue: 8.5, suffix: "%" },
    { id: "tenure", label: "Tenure", min: 1, max: 30, step: 1, defaultValue: 5, suffix: " Yrs" },
  ]}
  calculate={(values) => {
    // Custom math logic here
    return {
      result: { highlightLabel: "Monthly EMI", highlightValue: "₹10,255", breakdown: [...] },
      table: { columns: ["Year", "Principal", "Interest"], rows: [...] }
    };
  }}
/>
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Required** | The heading displayed at the top of the calculator. |
| `inputs` | `CalculatorInput[]` | **Required** | An array configuring the sliders (`id`, `label`, `min`, `max`, `step`, `defaultValue`, `prefix`, `suffix`). |
| `locale` | `string` | `"en-IN"` | Controls number grouping for the slider values (e.g., `en-IN` = `12,34,567`). |
| `theme` | `"dark" \| "light"` | `"dark"` | Colour theme. |
| `calculate` | `(values) => { result, table }` | **Required** | The pure math function. Receives the current slider values and returns the formatted result strings and table data. |
| `className` | `string` | `none` | Added to the root element. |

### SplitBill

> Work in progress. This section describes the planned API and may change before release.

A frontend-only bill splitter. It takes a bill amount and a group of people, works out what each person owes, and reports every change through `onChange`. It makes no network calls and saves nothing, so your app decides what to do with the result.

Money is calculated internally in whole minor units (paise, cents), never floating point, so the shares always add up exactly to the grand total. Any leftover paise from an uneven division is given to people in a fixed, predictable order.

```tsx
<SplitBill
  total={3000}
  defaultPeople={["Asha", "Ravi", "Meera", "Kabir"]}
  tipPercent={10}
  currency="INR"
  locale="en-IN"
  onChange={(result) => console.log(result.shares)}
/>
// Asha ₹825.00, Ravi ₹825.00, Meera ₹825.00, Kabir ₹825.00
```

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onChange` | `(result: SplitBillResult) => void` | **Required** | Called on every change with each person's share, the totals and the validation status. |
| `total` | `number \| null` | `null` | The bill amount before tip and tax, in major units (e.g. `3000` for ₹3,000). `null` means empty. |
| `defaultPeople` | `string[] \| Person[]` | `[]` | People to start with. Plain strings get generated ids. |
| `splitModes` | `("equal" \| "custom" \| "percent")[]` | all three | Which split modes the user can pick. |
| `defaultMode` | `"equal" \| "custom" \| "percent"` | `"equal"` | The mode shown first. |
| `tipPercent` | `number` | `0` | Starting tip percentage. |
| `tipPresets` | `number[]` | `[0, 5, 10, 15]` | Quick-pick tip buttons. A custom value is always available. |
| `taxPercent` | `number` | `0` | Tax percentage added on top of the bill. |
| `remainderTo` | `"first" \| "last"` | `"first"` | Who absorbs the leftover paise when the total does not divide evenly. |
| `currency` | `string` | `"INR"` | ISO currency code. Currencies with no decimals (such as JPY) are handled. |
| `locale` | `string` | `"en-IN"` | Controls number grouping. |
| `theme` | `"dark" \| "light"` | `"dark"` | Colour theme. |
| `className` | `string` | `none` | Added to the root element. |

`onChange` receives an object with this shape:

```ts
type SplitBillResult = {
  mode: "equal" | "custom" | "percent";
  currency: string;
  subtotal: number;
  tip: number;
  tax: number;
  total: number;
  shares: { id: string; name: string; amount: number }[];
  valid: boolean; // false while custom amounts or percentages do not add up
};
```

Rules the component enforces:

- Shares always add up to `total` exactly.
- Custom amounts must equal the total, and percentages must equal exactly 100. Otherwise `valid` is `false` and an inline error is shown.
- Zero people, an empty bill, negative values and non-numeric input never produce NaN or a negative share.
- Removing a person recalculates the split, and in custom or percent mode asks the user to rebalance.

### FeeTransparencyBar

A fee breakdown card for checkout and transfer flows. Give it an amount and a list of fee rules (fixed or percentage), and it renders each fee, a "Free" badge for zero-cost lines, and the total to pay. The calculation is a pure function, separate from the UI, and the component reports every result through `onChange`.

- Fixed and percentage fee rules, calculated in one place
- Each fee line is rounded to 2 decimals with a float-safe helper, so `1.005` rounds to `1.01`
- Automatic "Free" badge for any fee line that comes to zero
- Currency and number grouping through `Intl.NumberFormat` (for example `en-IN` gives `12,34,567`)
- Typed props and a Zod schema for validation

```tsx
<FeeTransparencyBar
  amount={1000}
  fees={[
    { label: "Service Fee", type: "percentage", value: 0.5 },
    { label: "Network Fee", type: "fixed", value: 2.5 },
    { label: "Platform Fee", type: "fixed", value: 0, isFree: true },
  ]}
  currency="USD"
  locale="en-US"
  variant="detailed"
  theme="dark"
  onChange={(result) => console.log(result)}
/>
```

This renders:

| Line | Value |
| --- | --- |
| Amount | $1,000.00 |
| Service Fee (0.5%) | $5.00 |
| Network Fee | $2.50 |
| Platform Fee | Free |
| **Total to pay** | **$1,007.50** |

The same component in Indian rupees:

```tsx
<FeeTransparencyBar
  amount={125000}
  fees={[{ label: "Processing Fee", type: "percentage", value: 1 }]}
  currency="INR"
  locale="en-IN"
/>
// Amount ₹1,25,000.00, Processing Fee (1%) ₹1,250.00, Total ₹1,26,250.00
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `amount` | `number` | **Required** | The principal amount the user is sending. Must be zero or more when validated with the schema. |
| `fees` | `FeeItem[]` | **Required** | Array of fee rules. See `FeeItem` below. |
| `currency` | `string` | `"USD"` | ISO currency code used by `Intl.NumberFormat`. |
| `locale` | `string` | `"en-US"` | Controls number grouping (for example `en-IN` = `12,34,567`). |
| `variant` | `"inline" \| "detailed" \| "marketing"` | `"detailed"` | Visual layout density. See variants below. |
| `theme` | `"dark" \| "light"` | `"dark"` | Colour theme. |
| `onChange` | `(result: FeeTransparencyBarResult) => void` | none | Fires on mount and whenever the calculation produces a new result. |
| `className` | `string` | none | Added to the root element after the default `fee-transparency-bar` class. |

Keep the `fees` array referentially stable. The result is recalculated whenever `amount` or the `fees` array reference changes, and `onChange` fires for each new result. An array literal written inline in JSX is a new reference on every render, so if your `onChange` handler sets state in the parent, you can end up in a render loop. Define the array outside the component or wrap it in `useMemo`.

```tsx
const FEES: FeeItem[] = [
  { label: "Service Fee", type: "percentage", value: 0.5 },
  { label: "Network Fee", type: "fixed", value: 2.5 },
];

function Checkout({ amount }: { amount: number }) {
  return <FeeTransparencyBar amount={amount} fees={FEES} />;
}
```

#### FeeItem

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | **Required** | Text shown for the fee line. |
| `type` | `"fixed" \| "percentage"` | **Required** | `fixed` uses `value` as a money amount. `percentage` takes `value` percent of `amount`. |
| `value` | `number` | `0` | A money amount for `fixed`, or a percentage for `percentage` (`0.5` means 0.5%). Must be zero or more. |
| `id` | `string` | none | Optional stable key for the row. The array index is used when it is missing. |
| `isFree` | `boolean` | none | Forces the fee to `0` and shows the green "Free" badge. |
| `description` | `string` | none | Shown as a tooltip (`title`) on the fee label. |

Any fee line whose calculated amount is `0` shows the "Free" badge, whether or not `isFree` is set.

#### FeeTransparencyBarResult

This is what `onChange` receives, and what `calculateFees` returns.

```ts
interface FeeTransparencyBarResult {
  subtotal: number;   // the amount you passed in
  totalFees: number;  // sum of all fee lines, rounded to 2 decimals
  total: number;      // subtotal + totalFees, rounded to 2 decimals
  breakdown: Array<FeeItem & { amount: number }>; // each fee with its calculated amount
}
```

For the first example above:

```json
{
  "subtotal": 1000,
  "totalFees": 7.5,
  "total": 1007.5,
  "breakdown": [
    { "label": "Service Fee", "type": "percentage", "value": 0.5, "amount": 5 },
    { "label": "Network Fee", "type": "fixed", "value": 2.5, "amount": 2.5 },
    { "label": "Platform Fee", "type": "fixed", "value": 0, "isFree": true, "amount": 0 }
  ]
}
```

#### Variants

| Variant | What it renders |
| --- | --- |
| `detailed` | The full card: header, line items, divider, total, and trust footer. |
| `inline` | A compact single row with the line items and total. The header, divider, and footer are hidden. |
| `marketing` | Accepted by the API and exposed as `data-variant="marketing"` on the root element. It currently has no styles of its own and looks like `detailed`. |

#### Calculation helpers

The math lives in `helpers.ts` and has no React dependency, so you can reuse the same logic in tests, server code, or a custom layout.

```ts
import { calculateFees, formatMoney } from "./helpers";

const result = calculateFees(1000, [
  { label: "Service Fee", type: "percentage", value: 0.5 },
  { label: "Network Fee", type: "fixed", value: 2.5 },
]);
// { subtotal: 1000, totalFees: 7.5, total: 1007.5, breakdown: [...] }

formatMoney(result.total, "USD", "en-US"); // "$1,007.50"
```

How the math works:

- A percentage fee is `amount * value / 100`. A fixed fee is `value`.
- A fee with `isFree: true` is always `0`.
- Each fee line is rounded to 2 decimals, then the rounded lines are summed. The total is `amount + totalFees`, rounded to 2 decimals.
- `formatMoney` uses `Intl.NumberFormat`, so the number of decimals follows the currency (0 for JPY, 2 for USD, 3 for BHD). If the currency or locale is invalid, it logs a warning and falls back to `"<currency> <amount with 2 decimals>"` instead of crashing the UI.

`calculateFees` and `formatMoney` are not re-exported from the component's `index.ts`. Import them from `./helpers` inside the repo, or add them to the exports to use them from the package.

#### Validation with Zod

```ts
import { FeeItemSchema, FeeTransparencyBarPropsSchema } from "capital-ui-kit";

const props = FeeTransparencyBarPropsSchema.parse({
  amount: 1000,
  fees: [{ label: "Service Fee", type: "percentage", value: 0.5 }],
});
// Defaults are filled in: currency "USD", locale "en-US", variant "detailed", theme "dark"
```

The schema covers the data props. `onChange` is a function, so it is added in the TypeScript type and is not part of the schema. Exported types: `FeeTransparencyBarProps`, `FeeTransparencyBarResult`, `FeeItem`.

#### Accessibility and limitations

- The root has `aria-live="polite"`, so screen readers announce updates when the amount or fees change. The info button has an `aria-label`, and the decorative icons and glow are hidden from assistive technology.
- The visible text is fixed in English: "Fee Breakdown", "Amount", "Total to pay", "Includes all fees", and "Zero hidden fees. What you see is what you pay."
- The footer's "Zero hidden fees" message is always shown in the `detailed` variant, so make sure your `fees` list really is complete.

Styling variables for this component are listed in the table under [Theme with CSS variables](#theme-with-css-variables). The light theme is applied with `data-theme="light"` on the root.

## Styling

The components use plain CSS, with no Tailwind dependency. Styles live in a `components` cascade layer and use zero-specificity selectors, so any CSS you write overrides them without `!important`.

### Override with `className`

Every component accepts one `className`, applied to its root element. The default `ui-*` class stays on the element, and yours is added after it.

```tsx
<CurrencyCounter value={5} className="max-w-md rounded-none" />
```

With Tailwind v4, utility classes win because Tailwind's `utilities` layer comes after the kit's `components` layer. This works by default, so you don't need to configure anything.

### Theme with CSS variables

To change inner parts such as the value, label or badge, set the component's CSS variables through the same `className`.

```tsx
// Tailwind arbitrary properties
<CurrencyCounter value={5} className="[--ui-cc-value:#f87171] [--ui-cc-value-size:2.5rem]" />
```

```css
/* or plain CSS */
.my-card { --ui-cc-value: #f87171; --ui-cc-value-size: 2.5rem; }
```

| Component | Variables |
|---|---|
| `CurrencyCounter` | `--ui-cc-bg` `--ui-cc-border` `--ui-cc-label` `--ui-cc-value` `--ui-cc-value-size` `--ui-up` `--ui-up-bg` `--ui-up-border` `--ui-down` `--ui-down-bg` `--ui-down-border` |
| `PrivacyBadge` | `--ui-pb-bg` `--ui-pb-border` `--ui-pb-label` `--ui-pb-value` `--ui-pb-value-size` `--ui-pb-toggle` `--ui-pb-toggle-hover` `--ui-pb-focus` |
| `DebouncedSearch` | `--ui-search-bg` `--ui-search-border` `--ui-search-text` `--ui-search-placeholder` `--ui-search-icon` `--ui-search-focus` |
| `StatusBadge` | `--ui-sb-bg` `--ui-sb-fg` `--ui-sb-border` |
| `StatCard` | `--ui-sc-bg` `--ui-sc-border` `--ui-sc-text-main` `--ui-sc-text-muted` `--ui-sc-icon-bg` `--ui-sc-trend-up-bg` `--ui-sc-trend-down-bg` |
| `OmniInput` | `--ui-omni-bg` `--ui-omni-border` `--ui-omni-text` `--ui-omni-placeholder` `--ui-omni-error-text` `--ui-omni-preset-bg` |
| `HoldToConfirmButton` | `--btn-bg` `--btn-text` `--btn-progress` `--btn-duration` |
| `FinancialCalculator` | `--ec-bg` `--ec-border` `--ec-text` `--ec-muted` `--ec-highlight` `--ec-accent` `--ec-input-bg` |
| `SplitBill` | `--ui-split-bg` `--ui-split-border` `--ui-split-text` `--ui-split-muted` `--ui-split-accent` `--ui-split-error` |
| `FeeTransparencyBar` | `--fee-bg` `--fee-border` `--fee-glow` `--fee-divider` `--fee-text-main` `--fee-text-label` `--fee-text-muted` `--fee-font-mono` `--fee-accent-success` `--fee-accent-success-bg` `--fee-accent-success-border` |

Shared variables, set by the kit on `:root` and available to every component: `--ui-font-mono`, `--ui-radius-card`, `--ui-up`, `--ui-up-bg`, `--ui-up-border`, `--ui-down`, `--ui-down-bg`, `--ui-down-border`.

```tsx
// FeeTransparencyBar example
<FeeTransparencyBar amount={500} fees={FEES} className="[--fee-bg:#111827] [--fee-accent-success:#22c55e]" />
```

### Server rendering

The stylesheet is a normal CSS import, so frameworks that render on the server handle it the same way they handle any other CSS from `node_modules`. If you see unstyled markup, import `capital-ui-kit/styles.css` explicitly in your root layout.

## Schemas and layouts

Every component has a Zod schema describing its props. A catalog built from those schemas documents each component as JSON Schema, and a layout is plain JSON:

```json
{ "sections": [{ "component": "CurrencyCounter", "props": { "value": 1250 } }] }
```

Layouts are validated before use: unknown components and invalid props are rejected. A `className` value is checked too, and only class names (including CSS-variable overrides) are accepted.

## Run it locally

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
npm run lint
npx tsc -b
```

## Build the package

```bash
npm run build:lib
```

## Project layout

```
src/
  components/      CurrencyCounter, PrivacyBadge, DebouncedSearch, StatusBadge, HoldToConfirmButton, StatCard, OmniInput, SplitBill, FeeTransparencyBar (+ Zod schemas and CSS)
  styles/          shared CSS tokens
  lib/             cx() helper and class-string validation
  meta.ts          schema, description and dependencies for each component
  catalog.ts       JSON Schema catalog of all components
  registry.ts      maps component names to React components
  layout.ts        layout schema and validation
```

A component folder such as `SplitBill` keeps its parts together:

```
SplitBill/
  index.ts          public exports
  SplitBill.tsx     the component
  SplitBill.css     default styles
  schema.ts         Zod schema and types
  reducer.ts        state, actions and reducer
  helpers.ts        pure money and split math
  helpers.test.ts   unit tests for the math
```

`FeeTransparencyBar` follows the same pattern without a reducer:

```
FeeTransparencyBar/
  index.ts                  public exports
  FeeTransparencyBar.tsx    the component
  FeeTransparencyBar.css    default styles
  schema.ts                 Zod schemas and types
  helpers.ts                calculateFees and formatMoney
```

## Experimental: AI generator

A bring-your-own-key prompt-to-layout generator (Gemini, Claude, OpenAI-compatible and Ollama) lives on the [`ai-generator`](https://github.com/sushilDev0/capital-ui-kit/tree/ai-generator) branch. It is not part of main.

## Tech

React 19, TypeScript, Vite, plain CSS (cascade layers), Motion, Zod 4, Vitest

## Roadmap

- [x] Typed components with Zod schemas
- [x] Registry, catalog and validated layouts
- [x] Unit tests and CI
- [x] Plain CSS with a single `className` prop and CSS-variable theming
- [x] Published on npm
- [x] `FinancialCalculator` (Universal Calculator)
- [ ] `PaymentTimeline` and `SavingsGola Tracker`
- [ ] 12+ fintech components
- [ ] Docs site with a live playground

## Changelog

### 0.1.5 (unreleased)

- `Savings Goal Tracker` Target, saved so far, projected completion date
- `PaymentTimeline` Initiated, processing, settled or failed, like parcel tracking
- WIP: `Any New Component asked by reviewer` waiting for any reviewers request


## License

MIT