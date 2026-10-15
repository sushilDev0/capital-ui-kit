🚀 Capital UI Kit

Typed fintech React components with Zod schemas, a component registry and a validated JSON layout renderer. The goal is a bring-your-own-key developer tool that turns a prompt into a page built from these components.

> Status: work in progress.

 What works now
- Three components with typed props and Zod schemas: `CurrencyCounter`, `PrivacyBadge`, `DebouncedSearch`
- Safe formatting, accessibility fixes and a dark/light theme
- Component metadata, a JSON-Schema catalog and a registry
- Layout validation: unknown components or invalid props show an error box instead of crashing
- A `Renderer` that draws a JSON layout with real components

 In progress
- Multi-provider model layer (Gemini, Claude, OpenAI-compatible, DeepSeek) using your own API key
- Prompt-to-layout generation with schema validation and retry

 Planned
- 12+ fintech components (transactions, budget progress, payment card and more)
- CLI that writes the generated code into your project
- Docs site with a live playground

Tech
React 19, TypeScript, Vite, Tailwind CSS v4, Motion, Zod 4

Run it locally
```bash
npm install
npm run dev
```

How it works
1. Each component has a Zod schema describing the props a model may set.
2. A catalog is built from those schemas.
3. A layout is JSON like `{ "sections": [{ "component": "CurrencyCounter", "props": { "value": 1250 } }] }`.
4. The layout is validated, then rendered. Invalid sections are shown as errors.

Privacy
Bring your own key. Calls go straight from your machine to the model provider. Use fake data in demos and never commit your `.env` file.

License
MIT
