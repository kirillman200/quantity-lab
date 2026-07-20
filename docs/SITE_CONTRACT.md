# Project Quantity Lab site contract

- Production origin: `https://project-quantity-lab.workers.dev` until a custom domain is connected.
- Product promise: Help homeowners calculate material quantities, costs, and a practical shopping list without an account.
- Public routes: Defined once in `src/data/site.ts`; navigation, sitemap, `llms.txt`, and regression tests consume that inventory.
- Private surface: Source, dependencies, tests, environment files, Git metadata, build tooling, and local logs. Only `dist/` is deployed.
- Data boundary: Project inputs stay in the browser in URL parameters or localStorage. The app has no account, database, analytics, or advertising scripts at launch.
- Untrusted inputs: Names, dimensions, prices, and shared URL state. Inputs are length- and range-bounded and rendered by Vue text interpolation.
- Real capabilities: Five browser calculators, local saves, shareable links, print/PDF layouts, metric/imperial input, and offline reuse after a successful load.
- Unsupported capabilities: Server API, accounts, cloud sync, OAuth, MCP, A2A, checkout, purchasing, professional engineering, or code-compliance approval.
- Owner: Repository owner maintains content, security, privacy, and calculation assumptions.

All results are planning estimates. Users must confirm product coverage, site conditions, installation instructions, and local requirements before purchasing or building.
