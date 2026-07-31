# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project status

Early-stage scaffold (React 19 + TypeScript + Vite + Tailwind CSS v4). `src/App.tsx` still contains the default Vite/React template markup — treat it as throwaway boilerplate to replace, not established architecture.

## Commands

- `pnpm dev` — start the Vite dev server
- `pnpm build` — type-check (`tsc -b`) then build for production
- `pnpm lint` — run Oxlint
- `pnpm test` — run the test suite (Vitest, watch mode by default)
- `pnpm preview` — preview the production build

Package manager is **pnpm** (see `pnpm-lock.yaml`).

### Running a single test

Tests run in a real browser via Playwright (chromium), not jsdom. To run one file:

```
pnpm vitest run src/components/HelloWorld/HelloWorld.spec.tsx
```

## Architecture

- **Build tool**: Vite, with the React Compiler enabled via Babel (`@rolldown/plugin-babel` + `babel-plugin-react-compiler` in `vite.config.ts`). Don't hand-write `useMemo`/`useCallback` optimizations expecting them to be necessary — the compiler handles memoization automatically.
- **Styling**: Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js` — v4 uses CSS-based config in `src/index.css`). Components lean on Tailwind utility classes, including arbitrary-value utilities (e.g. `bg-[var(--accent-bg)]`) that reference CSS custom properties defined in `index.css`.
- **Testing**: Vitest is configured for **browser mode** (`vitest.config.ts`), running specs in a real Chromium instance via `@vitest/browser-playwright`, using `vitest-browser-react`'s `render` and locator-based queries (`getByText`, `getByRole`, etc.) rather than jsdom + Testing Library. Spec files live next to the component they test (e.g. `src/components/HelloWorld/HelloWorld.spec.tsx`).
- **Component convention**: one folder per component under `src/components/<Name>/`, containing `<Name>.tsx` and `<Name>.spec.tsx`.
- **Linting**: Oxlint (`.oxlintrc.json`), not ESLint. Type-aware linting is not currently enabled (would require `oxlint-tsgolint`).
- **TypeScript**: project-references setup (`tsconfig.json` → `tsconfig.app.json` for `src/`, `tsconfig.node.json` for Vite config). Strict unused-locals/params checks and `verbatimModuleSyntax` are on, so use type-only imports (`import type { X }`) where applicable.
