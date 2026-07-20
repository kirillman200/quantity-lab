# Project Quantity Lab

Free, product-neutral home project calculators for paint, flooring and tile, landscape materials, concrete, and fencing. Each planner supports multiple areas, metric and imperial input, waste allowances, optional pricing, local saves, shareable URL state, and print-friendly shopping lists.

## Stack

- Astro static pages and guide content
- Vue 3 calculator islands
- TypeScript calculation engine
- Vitest unit and contract tests
- Playwright critical browser flows
- Cloudflare Workers Static Assets

## Commands

```sh
npm install
npm run dev
npm run validate
npm run test:e2e
npm run deploy:dry
npm run deploy
```

The production origin is configured in `astro.config.mjs` and the deployment publishes only `dist/`. Calculations are planning estimates; confirm package coverage and local requirements before purchasing.
