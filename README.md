# Capital UI Kit

![CI](https://github.com/sushilDev0/capital-ui-kit/actions/workflows/ci.yml/badge.svg)

Typed fintech React components with Zod schemas, styled with plain layered CSS. They work in any React 19 project, and Tailwind users can override them with ordinary utility classes.

> Status: work in progress. More components and a docs site are planned.

## Install

```bash
npm install capital-ui-kit
```

Requires React 19. The styles are injected automatically when you import a component, so there is no CSS file to import.

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

More fintech components (transaction list, budget progress, payment card and others) are planned.

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

Shared variables: `--ui-font-mono`, `--ui-radius-card`.

### Server rendering

Styles are added to `<head>` when the package loads in the browser. In server-rendered frameworks the markup can appear briefly unstyled before JavaScript runs.

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
  components/      CurrencyCounter, PrivacyBadge, DebouncedSearch (+ Zod schemas and CSS)
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
- [ ] 12+ fintech components
- [ ] Docs site with a live playground

## License

MIT