# AI Agent Context — kwizicle.com

## What this project is

<1-2 sentence description — fill in>

## Stack

Vite (per the central multi-stack builder at `~/work/projects/builder/`).

## Project structure

- `src/` — application source
- `docs/` — PRD, Prompts log
- `Makefile` — includes the central builder; auto-detects stack
- `scripts/` *(if present)* — ingester or build-time helpers

## Building info

Stack auto-detected by the central builder at `~/work/projects/builder/`,
which provides per-stack Makefiles (`Makefile.react`, `Makefile.python`, etc.).

Two ways to build:

1. **Via sites/Makefile** (Docker-orchestrated, common): from `sites/`:
   - `make buildsh` — enter the dev container
   - `make build proj=kwizicle.com` / `make run proj=kwizicle.com` / `make test proj=kwizicle.com`

2. **From this project dir** (own Makefile + builder include):
   - `make deps` — install dependencies
   - `make build` / `make run` / `make test`

See `~/work/projects/builder/README.md` for the central builder docs.

## Deployment info

- **Platform**: cloudflare-pages
- **Live URL**: https://kwizicle.com/  *(update once deployed)*
- **Last deployed commit**: <fill once shipped>
- **Deploy trigger**: push to main → CF Pages build hook
- **Notes**: `wrangler.toml` declares the Pages project; deploy plumbing lands in v3.C

## How to run

```bash
make deps
make run
```

## Key conventions

- Stack: vite
- Build via the central builder
- Cloudflare Pages constraints respected: Vite ≥6, frozen-lockfile install, no `_redirects` SPA fallback

## Out of scope / don't touch

- *(leave blank — fill in when something is)*
