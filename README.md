# Nexus

Nexus is the Innovation Value Realization Portal. It tracks an innovation portfolio from the IDEAx Labs designs: initiatives (products, programs, ventures and R&D), their milestones, progress updates, and the value they deliver against strategic objectives.

> **Status:** front-end prototype. All data is static and lives in `src/lib/data.ts`. Forms such as New Project and Add Update don't save anything yet.

## Stack

- [Next.js 16](https://nextjs.org) with the App Router and a `src/` directory. This version has breaking changes from earlier releases; read `node_modules/next/dist/docs/` before relying on older patterns (see [AGENTS.md](AGENTS.md)).
- React 19 and TypeScript in strict mode, with the `@/*` import alias pointing to `src/*`.
- Tailwind CSS v4. There is no `tailwind.config` file; design tokens live in the `@theme` block of [src/app/globals.css](src/app/globals.css).
- Lato, loaded with `next/font`.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You'll be sent to `/login`.

| Script          | Purpose                     |
| --------------- | --------------------------- |
| `npm run dev`   | Start the dev server        |
| `npm run build` | Make a production build     |
| `npm run start` | Serve the production build  |
| `npm run lint`  | Run ESLint                  |

The app has an admin side and a user side; see [Roles](#roles).

### Environment variables

| Variable         | Required        | Description                                                                                                     |
| ---------------- | --------------- | --------------------------------------------------------------------------------------------------------------- |
| `SESSION_SECRET` | In production   | The key that signs the session cookie. Without it the app uses a built-in development key, which is not secure. |

## Roles

The signed-in person is either an **admin** or a **user** (shown as "Member" in the app). The rules are in [src/lib/viewer.ts](src/lib/viewer.ts).

| Capability                          | Admin | User                        |
| ----------------------------------- | ----- | --------------------------- |
| View every page and initiative      | ✓     | ✓                           |
| **New Projects** button (top bar)   | ✓     | —                           |
| **Add Member** button (Team)        | ✓     | —                           |
| **Add Update** on an initiative     | Any   | Only initiatives they own   |

Client components read the signed-in person with `useViewer()` from [src/components/auth/viewer-context.tsx](src/components/auth/viewer-context.tsx).

## Routes

| Route                                 | Screen                                          |
| ------------------------------------- | ----------------------------------------------- |
| `/login`                              | Sign in                                         |
| `/`                                   | Dashboard                                       |
| `/initiatives`                        | Portfolio (card and table views)                |
| `/initiatives/[slug]`                 | Initiative overview                             |
| `/initiatives/[slug]/milestones`      | Milestones (phases)                             |
| `/initiatives/[slug]/updates`         | Update history                                  |
| `/initiatives/[slug]/value`           | Value realized against target                   |
| `/updates`                            | Updates feed across all initiatives             |
| `/value-realization`                  | Value by strategic objective                    |
| `/team`, `/team/[id]`                 | Team list and member profile                    |
| `/settings`                           | Profile and notification settings               |

Every route except `/login` is inside the `(app)` route group, whose layout adds the sidebar and top bar.

## How sign-in works

Signing in is a deliberately simple demo. Replace it with a real identity provider before launch.

1. [src/app/login/actions.ts](src/app/login/actions.ts) checks the email and password in a server action. On success it sets an httpOnly `nexus_session` cookie, signed with HMAC and valid for 8 hours.
2. [src/proxy.ts](src/proxy.ts) (Next 16's replacement for `middleware.ts`) makes a quick first check:
   - Visitors with no cookie are sent to `/login?next=…`.
   - Signed-in visitors who open `/login` are sent to `/`.
   - Static assets are excluded in its `matcher`. When you add a new top-level folder to `public/`, add it there too, or signed-out visitors, including the login page, won't be able to load its files.
3. `requireViewer()` in [src/lib/auth.ts](src/lib/auth.ts) checks the cookie's signature in the `(app)` layout.

## Project structure

```
src/
  app/
    (app)/            Signed-in pages, sharing the sidebar and top-bar layout
    login/            Sign-in page and server actions
    globals.css       Tailwind import and @theme design tokens
    icon.svg, favicon.ico, apple-icon.png   App icons (Next file conventions)
  components/
    ui/               Shared building blocks: Button, Modal, dropdowns, form fields, pills…
    layout/           App shell, sidebar, top bar, nav items
    auth/             Login form, viewer context
    dashboard/ initiatives/ initiative-detail/ updates/ value/ team/ settings/ charts/
    modals/           New Initiative and Add Update
  lib/
    data.ts           Initiatives, people, objectives, updates and dashboard stats
    placeholders.ts   Generated milestones, value and update history for initiatives the designs don't cover
    auth.ts, viewer.ts, session-cookie.ts   Sign-in and roles
    status.ts, initiative-types.ts, people.ts, cn.ts
  proxy.ts            Redirects for signed-in and signed-out visitors
public/
  icons/              Single-colour SVG icons, tinted with CSS masks
  brand/              Logo marks
  decor/              Decorative artwork for the sidebar and dashboard cards
  login/              Login background
```
