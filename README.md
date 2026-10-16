# Capital UI Kit

![CI](https://github.com/sushilDev0/capital-ui-kit/actions/workflows/ci.yml/badge.svg)

Typed fintech React components with Zod schemas, a component registry and a validated JSON layout renderer, plus a bring-your-own-key generator that turns a prompt into a page built from those components.

> Status: work in progress. The generator runs from the terminal; a CLI and a docs site are planned.

<!-- Add a screenshot or a short screen recording of a prompt turning into a page here. -->

## How it works

```
prompt ──► model (your key) ──► JSON layout ──► Zod validation ──► renderer / generated .tsx
                  ▲                                  │
                  └────── validation errors ◄────────┘  (one automatic retry)
```

1. Every component has a Zod schema describing the props a model may set.
2. A catalog is built from those schemas and sent to the model with your prompt.
3. The model replies with a JSON layout: `{ "sections": [{ "component": "CurrencyCounter", "props": { "value": 1250 } }] }`.
4. The layout is validated. Unknown components and invalid props are rejected, never rendered or printed as code. If validation fails, the errors go back to the model once.
5. Valid layouts render live, or print as a ready-to-paste `.tsx` file. The model never writes JSX; the code is generated from the validated JSON, so imports and props are always ones the kit defines.

## Components

| Component | What it is |
|---|---|
| `CurrencyCounter` | Animated currency amount with a caption and a trend badge |
| `PrivacyBadge` | Masked card or account number with an optional reveal button |
| `DebouncedSearch` | Search input with debounce, minimum characters and a Cmd/Ctrl+K shortcut |

More fintech components (transaction list, budget progress, payment card and others) are planned.

## Run it locally

```bash
npm install
npm run dev
```

## Generate a page from a prompt (bring your own key)

Copy `.env.example` to `.env` and fill in your own values:

```
LLM_PROVIDER=gemini
LLM_API_KEY=your_key
LLM_MODEL=a_current_model_id_from_your_provider
```

Then:

```bash
npm run generate -- "A dashboard header with a balance card and a masked credit card"
```

| `LLM_PROVIDER` | Provider |
|---|---|
| `gemini` | Google Gemini |
| `anthropic` | Claude |
| `openai`, `deepseek`, `openrouter` | OpenAI-compatible APIs |
| `ollama` | Local models (no cost) |

Model names change often, so the model id is always a setting, never hardcoded.

## Privacy and security

- Your key stays in your own `.env`, which is git-ignored. Requests go straight from your machine to the provider, never through a server of mine.
- Use fake data in prompts. Some free tiers may use requests to improve their products.
- The model only picks component names and props. It cannot inject imports or arbitrary code, and the `value` of `PrivacyBadge` is a placeholder that the host app replaces at runtime.

## Tests and evals

```bash
npm test          # unit tests: validation, code generation, masking, provider flow
npm run eval      # runs 10 prompts against your provider and writes a report to evals/results/
```

The eval reports the share of valid layouts, valid-on-first-try, correct components, a safety check (a prompt-injection case must not leak a card number), token use and latency. Add `EVAL_PRICE_IN_PER_M` and `EVAL_PRICE_OUT_PER_M` to `.env` to estimate cost.

### Results

<!-- Run `npm run eval`, then paste the summary table from evals/results/ here. -->

## Project layout

```
src/
  components/      CurrencyCounter, PrivacyBadge, DebouncedSearch (+ Zod schemas)
  meta.ts          schema, description and dependencies for each component
  catalog.ts       JSON Schema catalog sent to the model
  registry.ts      maps component names to React components
  layout.ts        layout schema and validation
  Renderer.tsx     draws a validated layout
  providers/       Gemini, Claude and OpenAI-compatible adapters (plain fetch)
  generate.ts      prompt -> validated layout, with one retry
  codegen.ts       validated layout -> .tsx source
scripts/           try-generate, try-codegen, print-catalog, eval
evals/             prompt set and saved reports
```

## Tech

React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Zod 4, Vitest

## Roadmap

- [x] Typed components with Zod schemas
- [x] Registry, catalog and validated layout renderer
- [x] Multi-provider generation with validation and retry
- [x] Code generation from validated layouts
- [x] Unit tests, CI and an eval harness
- [ ] 12+ fintech components
- [ ] `capital-ui` CLI that writes generated code into your project
- [ ] Docs site with a live playground
- [ ] Styling props (size, accent) and per-part `className` slots

## License

MIT
