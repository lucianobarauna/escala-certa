# AGENTS.md

This file provides guidance to AI coding agents (Claude Code, Codex, Cursor, etc.) when working with code in this repository.

## Project status

Early-stage scaffold (React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui). `src/App.tsx` no longer has the default Vite template — it's now a minimal placeholder wiring up `HelloWorld` and a shadcn `Button`, still throwaway rather than established architecture.

## Commands

- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then build for production
- `pnpm lint` — run Oxlint
- `pnpm format` / `pnpm format:check` — format (or check formatting) with oxfmt, config in `.oxfmtrc.json` (also sorts imports and Tailwind classes)
- `pnpm test` — run the test suite (Vitest, watch mode by default)
- `pnpm preview` — preview the production build

Package manager is **pnpm** (see `pnpm-lock.yaml`). Node version is pinned in `.nvmrc` (also consumed by the CI deploy workflow).

### Running a single test

Tests run in a real browser via Playwright (chromium), not jsdom. To run one file:

```
pnpm vitest run src/components/HelloWorld/HelloWorld.spec.tsx
```

## Architecture

- **Build tool**: Vite, with the React Compiler enabled via Babel (`@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.ts`). Don't hand-write `useMemo`/`useCallback` optimizations expecting them to be necessary — the compiler handles memoization automatically.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 uses CSS-based config in `src/index.css`). Components lean on Tailwind utility classes, including arbitrary-value utilities (e.g. `bg-(--accent-bg)`) that reference CSS custom properties defined in `index.css`.
- **UI components**: shadcn/ui is installed (`components.json`), configured with the `aria-nova` style (built on `react-aria-components`, not Radix), `mist` base color, and `lucide-react` for icons. Generated primitives live in `src/components/ui/` (e.g. `button.tsx`); the `cn()` class-merging helper (`clsx` + `tailwind-merge`) is in `src/lib/utils.ts`. Theme tokens (colors, radius, sidebar/chart variables) are defined as CSS custom properties in `src/index.css` under `:root` / `.dark` and exposed to Tailwind via `@theme inline`. Fonts are self-hosted via `@fontsource-variable/geist` and `@fontsource-variable/inter` (Inter is the active `--font-sans`).
- **Path aliases**: `@/*` maps to `src/*` (`vite.config.ts` resolve alias, mirrored in `tsconfig.json`/`tsconfig.app.json` `paths`, and used by shadcn's `aliases` in `components.json`).
- **Testing**: Vitest is configured for **browser mode** (`vitest.config.ts`), running specs in a real Chromium instance via `@vitest/browser-playwright`, using `vitest-browser-react`'s `render` and locator-based queries (`getByText`, `getByRole`, etc.) rather than jsdom + Testing Library. Spec files live next to the component they test (e.g. `src/components/HelloWorld/HelloWorld.spec.tsx`).
- **Component convention**: one folder per component under `src/components/<Name>/`, containing `<Name>.tsx` and `<Name>.spec.tsx`. (shadcn-generated primitives in `src/components/ui/` are flat files, not folders.)
- **Linting/formatting**: Oxlint (`.oxlintrc.json`) for linting, not ESLint. Type-aware linting is not currently enabled (would require `oxlint-tsgolint`). oxfmt (`.oxfmtrc.json`) handles formatting, import sorting, and Tailwind class sorting — not Prettier.
- **TypeScript**: project-references setup (`tsconfig.json` → `tsconfig.app.json` for `src/`, `tsconfig.node.json` for Vite config). Strict unused-locals/params checks and `verbatimModuleSyntax` are on, so use type-only imports (`import type { X }`) where applicable.
- **Deployment**: `.github/workflows/deploy.yml` builds and deploys `dist/` to GitHub Pages on every push to `main` (or manual dispatch). Vite's `base` in `vite.config.ts` is set to `/escala-certa/` to match the Pages subpath — keep them in sync if the repo is ever renamed.
