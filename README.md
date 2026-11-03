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
| `StatCard` | Card for showing a key figure or metric |

<!-- TODO: check the StatCard description above and add a props section for StatusBadge and StatCard, like the PrivacyBadge one below -->

More fintech components are planned. `AmountInput` and `HoldToConfirmButton` are next, followed by a transaction list, budget progress, a payment card and others.

### PrivacyBadge

Shows a card or account number with most of it hidden. The full value is never rendered into the page while it is hidden, and values of 4 characters or fewer are always fully masked.

```tsx
<PrivacyBadge value="1234 5678 9012 3456" label="Credit card" revealable />
// •••• •••• •••• 3456
```

| Prop | Type | Default | What it does |
|---|---|---|---|
| `value` | `string` | required | The number to show. Spaces and dashes are ignored and the result is regrouped in 4s. Letters work too, so account numbers such as IBANs are fine. Layout JSON validated against the schema accepts digits, spaces and dashes only |
| `label` | `string` | none | Small caption above the number |
| `maskPattern` | `"last4"` \| `"first4"` \| `"all"` | `"last4"` | Which characters stay visible |
| `maskChar` | `"•"` \| `"*"` | `"•"` | Character used for hidden positions |
| `revealable` | `boolean` | `false` | Adds an eye button that shows and hides the number |
| `theme` | `"dark"` \| `"light"` | `"dark"` | Colour theme |
| `className` | `string` | none | Added to the root element |

Screen readers do not read the row of masked characters. They hear a short description such as "Hidden, ending in 3 4 5 6", and hear the full number only after the person presses the reveal button.

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

<!-- TODO: add rows for StatusBadge and StatCard to the table above with their --ui-* variables -->

Shared variables, set by the kit on `:root` and available to every component: `--ui-font-mono`, `--ui-radius-card`, `--ui-up`, `--ui-up-bg`, `--ui-up-border`, `--ui-down`, `--ui-down-bg`, `--ui-down-border`.

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
  components/      CurrencyCounter, PrivacyBadge, DebouncedSearch, StatusBadge, StatCard (+ Zod schemas and CSS)
  styles/          shared CSS tokens
  lib/             cx() helper and class-string validation
  meta.ts          schema, description and dependencies for each component
  catalog.ts       JSON Schema catalog of all components
  registry.ts      maps component names to React components
  layout.ts        layout schema and validation
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
- [x] `StatusBadge` and `StatCard`
- [ ] `AmountInput` and `HoldToConfirmButton`
- [ ] 12+ fintech components
- [ ] Docs site with a live playground

## Changelog

### 0.1.3 (unreleased)

- Added: `StatusBadge` for paid, pending, failed and refunded states.
- Added: `StatCard`.

<!-- TODO: add AmountInput and HoldToConfirmButton here once they are done, and set the final release date -->

### 0.1.2

- Fixed: the stylesheet is now imported by the package entry, so components are styled without any extra import. Version 0.1.1 shipped without this.
- Fixed: shared variables (`--ui-radius-card`, `--ui-font-mono`, `--ui-up`, `--ui-down` and their background and border variants) are now included in `styles.css`. In 0.1.1 they were missing, so `CurrencyCounter` lost its rounded corners and trend colours.
- `PrivacyBadge`: `maskPattern`, `maskChar` and `theme` now work, matching its schema.
- `PrivacyBadge`: fixed a bug where `visibleEnd={0}` showed the full number. **Removed the undocumented `visibleEnd` prop.** Use `maskPattern` instead: `"last4"` matches the old default of 4 visible characters, `"first4"` shows the start, and `"all"` hides everything.
- `PrivacyBadge`: added a light theme and screen reader support.

## License

MIT
