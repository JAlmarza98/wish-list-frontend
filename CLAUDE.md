# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

WishList — Angular 18 standalone-components app, backed by its own REST API in the sibling repo [`wish-list-backend`](../wish-list-backend) (Node + Express + PostgreSQL), self-hosted via Docker rather than Firebase. UI text and user-facing strings are in Spanish.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200` (needs `wish-list-backend` running, see its README)
- `ng build` — production build to `dist/wish-list`
- `ng build --configuration development` — dev build (uses `environment.development.ts`)
- `ng test` — unit tests via Karma/Jasmine (browser launches, not headless by default)
- `ng test --include='**/groups.component.spec.ts'` — run a single spec file
- `ng generate component path/name` — scaffold a standalone component (no NgModules in this codebase)
- `docker compose up -d --build` — builds and serves the production bundle via nginx on port `8080`

There is no configured lint script (no ESLint/TSLint config present).

## Required local setup (not in git)

`src/environments/` is gitignored and does not exist in a fresh checkout. It must be created manually before the app builds, with `environment.ts` and `environment.development.ts`, each exporting:

```ts
export const environment = {
  apiUrl: 'http://localhost:3000', // wish-list-backend base URL
};
```
Referenced via the `@envs/*` path alias.

## Architecture

**Path aliases** (tsconfig.json): `@auth/*` → `src/app/auth`, `@components/*` → `src/app/components`, `@shared/*` → `src/app/shared`, `@envs/*` → `src/environments`. `@features/*` is declared but unused — no `src/app/features` directory exists yet.

**Routing** (`src/app/app.routes.ts` + `src/app/auth/auth.routes.ts`): top-level routes (`/`, `/addMember/:id`, `/group/:id`) are gated by `authGuard`; `/auth/**` (login, singup) is gated by `publicGuard` so authenticated users get redirected away from it. Both guards (`src/app/auth/guards/auth.guard.ts`) are functional `CanActivateFn`s driven by `AuthService.authState$`.

**Auth** (`src/app/auth/auth.service.ts`): thin `HttpClient` wrapper over the backend's `/auth/*` endpoints. Session is a JWT in an `httpOnly` cookie set by the backend — the frontend never touches the token directly; `credentials.interceptor.ts` adds `withCredentials: true` to every request. On app bootstrap, an `APP_INITIALIZER` in `app.config.ts` calls `AuthService.loadCurrentUser()` (`GET /auth/me`) and blocks router/guard evaluation until it resolves, so a page refresh doesn't briefly look logged-out. `AuthService.UserData` exposes the current user (`{id, email, username, mustChangePassword}` or `null`) synchronously for components that need "my own id" (e.g. filtering myself out of a group's member list).

**Data layer** — thin `HttpClient` services under `src/app/services/`, one per backend resource, no local caching beyond what each component keeps in memory:
- `GroupsService` — list/create/get groups.
- `WishlistsService` — CRUD on a user's own named wishlists, plus `getWishes`/`addWish`, and `share`/`unshare`/`getShares` to control which groups a given wishlist is visible to (`wishlist_shares` on the backend — sharing is explicit per list per group, not automatic from group membership).
- `WishesService` — update/delete a single wish, and `reserve`/`unreserve` it.
- `InvitesService` — create/preview/accept a group invite token (the token is opaque and verified server-side; the frontend never decodes it).

`src/app/services/wish-mapper.ts` adapts the backend's wish shape (`created_at`, `reserved_at`, `reserved_by_username`) into the frontend's `Wish`/`Reserved` shape (`date`, `reserved.reservedBy`) used by `TableComponent` — the backend **omits** the reservation fields entirely when the caller is the wishlist's own owner, so a user can never learn who reserved their own gift, even by inspecting the network response.

**Components**: all standalone (`standalone: true`, explicit `imports` arrays), no NgModules except the shared `MATERIAL_MODULES` array (`src/app/shared/material.module.ts`) that bundles the Angular Material modules components commonly need. `src/app/pages/` holds routed page components; `src/app/components/` holds feature components (groups, list) with their dialogs under a local `modals/` subfolder; `src/app/shared/` holds cross-cutting UI (toolbar, footer, loader, snackbar, generic table).

`ListComponent` (`src/app/components/list/list.component.ts`) is two views in one component, toggled by `selectedWishlist` being `null` or not: a grid of the user's own named wishlists (create/delete), and — once one is selected — its wishes table plus a row of checkboxes to share/unshare that specific list with each of the user's groups.

**Loader/Snackbar**: `LoaderService` and `SnackbarService` (`src/app/shared/`) are injected into feature components to show/hide a global spinner and toast notifications around async calls — follow the existing `ShowLoader()`/`.finally(() => HideLoader())` and `showSnackBar(message, 'succes' | 'error')` pattern (note: `'succes'` is the actual literal used, not `'success'`) when adding new async actions.

**IDs**: all entity ids (users, wishlists, wishes, groups) are UUIDs generated by Postgres on insert and returned by the API — the frontend never generates its own ids.
