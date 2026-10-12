# Nexus

Nexus is the Innovation Value Realization Portal. It tracks an innovation portfolio from the IDEAx Labs designs: initiatives (products, programs, ventures and R&D), their milestones, progress updates, and the value they deliver against strategic objectives.

Data comes from the [Nexus API](https://www.nexus-api.somee.com/swagger/index.html), fetched with [TanStack Query](https://tanstack.com/query) (React Query).

## Stack

- [Next.js 16](https://nextjs.org) with the App Router and a `src/` directory. This version has breaking changes from earlier releases; read `node_modules/next/dist/docs/` before relying on older patterns (see [AGENTS.md](AGENTS.md)).
- React 19 and TypeScript in strict mode, with the `@/*` import alias pointing to `src/*`.
- Tailwind CSS v4. There is no `tailwind.config` file; design tokens live in the `@theme` block of [src/app/globals.css](src/app/globals.css).
- Lato, loaded with `next/font`.
- TanStack Query v5 for data fetching and caching.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be sent to `/login`; sign in with a `@wemabank.com` account.

| Script          | Purpose                     |
| --------------- | --------------------------- |
| `npm run dev`   | Start the dev server        |
| `npm run build` | Make a production build     |
| `npm run start` | Serve the production build  |
| `npm run lint`  | Run ESLint                  |

The app has an admin side and a user side; see [Roles](#roles).

### Environment variables

Copy `.env.example` to `.env` (git ignores it) and adjust as needed.

| Variable        | Required | Description                                                                                     |
| --------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `NEXUS_API_URL` | No       | API base URL including the version. Defaults to `https://www.nexus-api.somee.com/api/v1`. |

## Roles

The signed-in person is either an **admin** (API role `Admin` or `SuperAdmin`) or a **user** (API role `User`, shown as "Member" in the app). The UI rules are in [src/lib/viewer.ts](src/lib/viewer.ts); the API enforces the real permissions.

| Capability                          | Admin | User                        |
| ----------------------------------- | ----- | --------------------------- |
| View every page and initiative      | ✓     | ✓                           |
| **New Project** button (Projects page) | ✓   | —                           |
| **Add Member** button (Team)        | ✓     | —                           |
| **Remove member** (trash icon on the Team table, or member profile) | ✓ | — |
| **New Objective** (Value Realization) | ✓   | —                           |
| **Add Update** on an initiative     | Any   | Only initiatives they're assigned to |

Client components read the signed-in person with `useViewer()` from [src/components/auth/viewer-context.tsx](src/components/auth/viewer-context.tsx).

## Routes

| Route                                 | Screen                                          |
| ------------------------------------- | ----------------------------------------------- |
| `/login`                              | Sign in                                         |
| `/`                                   | Dashboard                                       |
| `/initiatives`                        | Portfolio (card and table views)                |
| `/initiatives/[id]`                   | Initiative overview                             |
| `/initiatives/[id]/milestones`        | Milestones achieved                             |
| `/initiatives/[id]/updates`           | Update history                                  |
| `/initiatives/[id]/value`             | Value metrics reported                          |
| `/updates`                            | Updates feed across all initiatives             |
| `/value-realization`                  | Value by strategic objective                    |
| `/team`, `/team/[id]`                 | Team list and member profile                    |
| `/settings`                           | Profile and notification settings               |

Every route except `/login` is inside the `(app)` route group, whose layout adds the sidebar and top bar.

## How the API is called

The browser never holds the API tokens. Every request goes through this app's server:

1. **Sign in.** [src/app/login/actions.ts](src/app/login/actions.ts) calls `auth/login` from a server action and stores the access token, refresh token and a small profile in httpOnly cookies (`nexus_access`, `nexus_refresh`, `nexus_profile`).
2. **Fetch.** Components use the hooks in [src/lib/api/queries.ts](src/lib/api/queries.ts) (`useProjects`, `useProject`, `useCreateProjectUpdate`, …). They call `/api/nexus/<path>`, and the route handler in [src/app/api/nexus/[...path]/route.ts](src/app/api/nexus/[...path]/route.ts) forwards to `NEXUS_API_URL/<path>` with the access token attached.
3. **Refresh.** Access tokens last about 6 minutes. The route handler refreshes them shortly before they expire, or when the API answers 401, and writes the new pair to the cookies. Refresh tokens are single-use, so concurrent requests share one refresh ([src/lib/api/server.ts](src/lib/api/server.ts)).
4. **Expiry.** If the refresh fails, the handler clears the cookies and answers 401; the client then sends the user to `/login?next=…`.

[src/proxy.ts](src/proxy.ts) (Next 16's replacement for `middleware.ts`) only checks that a session cookie exists: visitors without one are sent to `/login?next=…`, and signed-in visitors who open `/login` go to `/`. It skips `/api` and static assets. When you add a new top-level folder to `public/`, add it to the `matcher` too, or signed-out visitors (including the login page) won't be able to load its files.

API response types are in [src/lib/api/types.ts](src/lib/api/types.ts), and [src/lib/api/adapters.ts](src/lib/api/adapters.ts) maps API values to the UI's (statuses, project types, avatars, dates).

## Project structure

```
src/
  app/
    (app)/            Signed-in pages, sharing the sidebar and top-bar layout
    login/            Sign-in page and server actions
    api/nexus/        Proxy route that attaches the session token to API calls
    globals.css       Tailwind import and @theme design tokens
    icon.svg, favicon.ico, apple-icon.png   App icons (Next file conventions)
  components/
    ui/               Shared building blocks: Button, Modal, dropdowns, form fields, pills…
    layout/           App shell, sidebar, top bar, nav items
    auth/             Login form, viewer context
    providers/        React Query provider
    dashboard/ initiatives/ initiative-detail/ updates/ value/ team/ settings/ charts/
    modals/           New Initiative, Add Update, Add Member, New Objective
  lib/
    api/              API types, server session (login, token refresh), browser client, React Query hooks, adapters
    data.ts           Static settings content
    auth.ts, viewer.ts, session-cookie.ts   Signed-in viewer and roles
    status.ts, initiative-types.ts, people.ts, cn.ts
  proxy.ts            Redirects for signed-in and signed-out visitors
public/
  icons/              Single-colour SVG icons, tinted with CSS masks
  brand/              Logo marks
  decor/              Decorative artwork for the sidebar and dashboard cards
  login/              Login background
```
