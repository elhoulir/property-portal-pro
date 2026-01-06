<!-- Copilot instructions for property-portal-pro -->
# Copilot / AI Agent Instructions

Purpose: quickly orient an AI coding agent to this Next.js + TypeScript property portal so it can make safe, useful edits.

- Project type: Next.js 14 app router, TypeScript, Tailwind CSS. Start/dev/build: `npm run dev`, `npm run build`, `npm run start` (see `package.json`).
- Source of truth (UI): `app/page.tsx` — main state, filtering, sorting, and CSV export. `app/layout.tsx` wraps the app with context providers.

Key architecture and patterns
- Providers & global state: React Context is used for cross-cutting state. See `app/context/FavoritesContext.tsx`, `ThemeContext.tsx`, and `RecentlyViewedContext.tsx`.
- localStorage helper: `app/hooks/useLocalStorage.ts` is the wrapper used by contexts — persist changes via this hook.
- Component layout: base UI components live in `app/components/ui/` (e.g. `button.tsx`, `card.tsx`, `input.tsx`). Feature components live in `app/components/` (e.g. `PropertyCard.tsx`, `PropertyList.tsx`, `PropertyModal.tsx`, `SearchFilters.tsx`, `StatsDashboard.tsx`).
- Utilities: shared helpers are in `app/lib/utils.ts`. Notable exports: `cn()` (clsx + twMerge), `formatPrice()`, `formatDate()`, `exportToCSV()`, and `calculateStats()`.
- Sample data: `app/data/properties.json` and `page.tsx`'s `sampleProperties` are used as local fallbacks. Changing data here updates the demo dataset.

Conventions & important details
- File imports use absolute aliasing from `@/app/...` (tsconfig paths enabled). Preserve these when refactoring.
- Many components are client components (`'use client'`) and expect browser APIs (e.g. DOM for CSV download, `window`, localStorage). Avoid moving those to server components unless you adapt APIs.
- Styling: Tailwind + CSS variables in `app/globals.css`. To change theme colors, edit `globals.css` or `tailwind.config.ts`.
- Animation & small UX touches: `PropertyList` staggers card reveal via inline `animationDelay` — preserve when changing rendering order.

Common quick tasks (examples)
- Add a new global utility: update `app/lib/utils.ts` and import it where needed. Keep `cn()` for class merging.
- Toggle favorites in UI: use `useFavorites()` from `app/context/FavoritesContext.tsx` and call `toggleFavorite(id)`; `favorites` is an array of `id`s.
- Open property modal: `PropertyList` passes `onPropertyClick` which `page.tsx` sets to `setSelectedProperty(property)` and `addToRecentlyViewed(id)`.
- Export CSV: call `exportToCSV(properties, filename)` from `app/lib/utils.ts` — runs in the browser and triggers a download.

Build / run / debug
- Development: `npm install` then `npm run dev` (Next.js dev server at http://localhost:3000).
- Production build: `npm run build` then `npm run start` for server-start.
- Linting/tests: none configured in this repo. Add tools conservatively — follow existing TypeScript settings (`tsconfig.json`).

Safety & constraints for automated edits
- Do not change the providers order in `app/layout.tsx` without verifying hydration and SSR behavior.
- Client-only code (`'use client'`) uses `window` and `localStorage`; keep these in client components.
- Keep the `Property` type shape in `app/types/property.ts` in sync with uses in `page.tsx`, contexts and `properties.json`.
- Prefer small, focused changes (one component or util per PR) to reduce risk.

Where to look first for specific features
- Favorites: `app/context/FavoritesContext.tsx`, `app/components/PropertyCard.tsx`.
- Theme/dark mode: `app/context/ThemeContext.tsx`, `app/globals.css`.
- CSV export: `app/lib/utils.ts` (function `exportToCSV`) and the header button in `app/page.tsx`.
- Stats & calculations: `app/lib/utils.ts` (`calculateStats`) and `app/components/StatsDashboard.tsx`.

If something is missing
- Check `README.md` for high-level feature descriptions and demo usage; it documents many interactive behaviours used by the UI.

Questions for the repo owner (leave as comments in PRs)
- Is `app/data/properties.json` authoritative or should new data be fetched externally (Google Sheets integration referenced in README)?
- Preferred Node / npm versions to pin in CI?

If you'd like edits, tell me the target file(s) and the intended behavior change. I'll produce a minimal PR with tests or manual verification steps when applicable.
