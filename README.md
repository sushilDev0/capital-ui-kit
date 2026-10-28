# Capital UI Kit

![CI](https://github.com/sushilDev0/capital-ui-kit/actions/workflows/ci.yml/badge.svg)

Typed fintech React components with Zod schemas, a component registry, a validated JSON layout renderer and deterministic code generation.

> Status: work in progress. More components and a docs site are planned.

## How it works

```
JSON layout ──► Zod validation ──► renderer / generated .tsx
```

1. Every component has a Zod schema describing its props.
2. A catalog is built from those schemas, so each component's props are documented as JSON Schema.
3. A layout is plain JSON: `{ "sections": [{ "component": "CurrencyCounter", "props": { "value": 1250 } }] }`.
4. The layout is validated. Unknown components and invalid props are rejected, never rendered or printed as code.
5. Valid layouts render live, or generate a ready-to-paste `.tsx` file. The code comes from the validated JSON only, so imports and props are always ones the kit defines.

## Components

| Component | What it is |
|---|---|
| `CurrencyCounter` | Animated currency amount with a caption and a trend badge |
| `PrivacyBadge` | Masked card or account number with an optional reveal button |
| `DebouncedSearch` | Search input with debounce, minimum characters and a Cmd/Ctrl+K shortcut |

Every component accepts a `className` for the root element, and the schema-driven ones also take per-part `classNames` slots (Tailwind classes only).

More fintech components (transaction list, budget progress, payment card and others) are planned.

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

## Project layout

```
src/
  components/      CurrencyCounter, PrivacyBadge, DebouncedSearch (+ Zod schemas)
  lib/             cn() and Tailwind class-string validation
  meta.ts          schema, description and dependencies for each component
  catalog.ts       JSON Schema catalog of all components
  registry.ts      maps component names to React components
  layout.ts        layout schema and validation
  Renderer.tsx     draws a validated layout
  codegen.ts       turns a validated layout into .tsx source
```

## Experimental: AI generator

A bring-your-own-key prompt-to-layout generator (Gemini, Claude, OpenAI-compatible and Ollama) lives on the [`ai-generator`](https://github.com/sushilDev0/capital-ui-kit/tree/ai-generator) branch. It is not part of main.

## Tech

React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Zod 4, Vitest

## Roadmap

- [x] Typed components with Zod schemas
- [x] Registry, catalog and validated layout renderer
- [x] Code generation from validated layouts
- [x] Unit tests and CI
- [x] Per-part `classNames` slots and `className`
- [ ] 12+ fintech components
- [ ] Docs site with a live playground

## License

MIT