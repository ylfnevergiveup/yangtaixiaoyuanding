# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project overview

阳台小园丁 (Balcony Gardener) — a Chinese-language home gardening knowledge site. The site is a static export (`output: "export"`) hosted on Tencent Cloud CloudBase with a serverless CMS backend. Domain: `yangtaixiaoyuanding.com` (ICP filing pending). Public URL: `https://yangtaixiaoyuanding-d7b1c10c2d50-1438704930.tcloudbaseapp.com/v2/`.

## Commands

```bash
npm run dev              # Start dev server (Turbopack, port 3000)
npm run build            # Static export → out/
npm run deploy           # Sync CMS data → build → fix → deploy to /v2/ and root
npm run deploy:clean     # Clean build + deploy
npm run deploy:cms       # Deploy cloud function (cms-api) only
npm run lint             # ESLint
npm run sync:data        # Sync CMS data to static JSON files only
```

**Critical: Always build with `ASSET_PREFIX` env var.** Without it, CDN-cached SPA fallbacks will break JS loading. The `deploy` and `deploy:clean` scripts set this automatically; for manual builds:
```bash
ASSET_PREFIX=/v2 npm run build   # For production build
```

## Architecture

### Tech stack
- **Next.js 16.2.6** with static export (`output: "export"`, `trailingSlash: true`, `assetPrefix: process.env.ASSET_PREFIX`)
- **Tailwind CSS v4** (no config file — uses `@tailwindcss/postcss`)
- **TipTap** rich text editor (React wrapper, StarterKit + image/link/underline/text-align/color/text-style extensions)
- **lucide-react** for icons
- **Tencent Cloud CloudBase**: Static Hosting (CDN) + SCF cloud functions (HTTP-triggered) + document database + COS cloud storage

### Data flow (dual-source)
The frontend uses a dual-fetch strategy in `src/lib/api.ts`:
1. **CMS API** (preferred) — live data from the cloud function at runtime (8s timeout, 1 retry)
2. **Static JSON** (`/data/*.json`) — fallback when CMS is unreachable

Data is loaded via `loadJSON(collectionName)`. The function fetches from both sources simultaneously via `Promise.all`, prefers CMS data, and filters out items with `status: "draft"` for public-facing pages. Admin pages use `fetchAdminData()` which does not filter drafts. If both sources fail, cached data is preserved as last resort.

### CMS API (`cloudfunctions/cms-api/index.js`)
A single Node.js cloud function handling all CMS operations. Key endpoints:

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET | `/api/cms/:collection` | No | List documents |
| GET | `/api/cms/:collection/:id` | No | Single document |
| POST | `/api/cms/:collection` | Varies† | Create document |
| PUT | `/api/cms/:collection/:id` | Yes | Update document |
| DELETE | `/api/cms/:collection/:id` | Yes | Delete document |
| POST | `/api/cms/login` | No | Admin password verification |
| POST | `/api/cms/upload` | Yes | Image upload to CloudBase COS |
| GET | `/api/cms/image-url?path=...` | No | Refresh expired CloudBase temp URL |
| POST | `/api/cms/analytics` | No | Record page view |
| GET | `/api/cms/analytics` | No | Return stats (excludes visitor detail) |
| POST | `/api/cms/register` | No | User registration |
| POST | `/api/cms/login-user` | No | User login |
| GET | `/api/cms/me` | User† | Get current user profile |
| PUT | `/api/cms/me` | User† | Update user profile |
| POST | `/api/cms/qa/:id/answer` | No | Submit answer to question |

† Public collections (`comments`, `qa`, `users`) don't require auth for POST. User endpoints use `user_token` Bearer token.

**Security features** (added 2026-06-04):
- **Rate limiting**: Write ops 30/min per IP, read ops 120/min per IP (in-memory sliding window)
- **Error sanitization**: All errors return generic messages; details logged to console only
- **Password**: Must be set via CloudBase env var `CMS_ADMIN_PASSWORD` (no hardcoded fallback)
- **Image uploads**: Magic byte validation (JPG/PNG/GIF/WebP only), 10MB limit

**Image URL management**: CloudBase `getTempFileURL()` generates signed URLs that EXPIRE (despite 10-year maxAge, signatures can be invalidated by key rotation). The `image-url` endpoint regenerates fresh URLs from `cloudPath`. `CoverImage.tsx` automatically detects broken images and refreshes URLs.

### API URL configuration
The CMS API URL is resolved at runtime through multiple fallbacks:
1. `window.__CMS_API__` — set via `setCMSApi()` from the `cms_api` cookie (set during login)
2. `process.env.NEXT_PUBLIC_CMS_API` — build-time env var from `.env.local`
3. Hardcoded fallback URL in `api.ts`

### assetPrefix and CDN cache (CRITICAL)
**This is the most important config for production stability.**

The `assetPrefix` in `next.config.ts` reads from `ASSET_PREFIX` env var (typically `/v2`). This makes ALL static asset references use `/v2/_next/...` instead of `/_next/...`.

**Why this is necessary**: CloudBase CDN has a 2-minute cache TTL. During deployment, files are uploaded one-by-one. If a browser requests a JS/CSS file before it exists on COS, the CDN caches the SPA fallback (index.html) as the response. The CDN then serves HTML for JS files, breaking the entire page. Since Turbopack uses content-hashed filenames, framework chunks (e.g., `0pqt~8bl3ukh4.js`) have the SAME hash across deploys — the bad cache persists forever.

Using `assetPrefix: "/v2"` puts assets on a fresh CDN path, bypassing any stale cache for `/_next/`.

**Never rewrite `/_next/` paths to `/static/` or add `?v=` query params.** Both approaches break Turbopack's RSC chunk matching. The RSC inline data scripts (`self.__next_f.push(...)`) reference chunks by path, and any mismatch causes "Invalid or unexpected token" errors and React hydration failure.

### Static export post-build: `scripts/fix-deploy.mjs`
This script runs after `next build`. It does NOT rewrite paths or add version params. It only:
1. Copies old CSS filenames for backward CDN compatibility
2. Fixes RSC notFound boundary issues in static HTML

### CMS data sync: `scripts/sync-from-cms.mjs`
Pulls latest data from CMS API and writes to `public/data/*.json` BEFORE each build. This ensures static JSON fallback data is current. Run via `npm run deploy` (included automatically).

### Admin panel (`/admin`)
All admin pages are client components (`"use client"`) that fetch data via the CMS API. Auth is cookie-based (`admin_token=authenticated` + `cms_password`). Uses shared `AdminLayout` component with 12 nav items in sidebar.

Admin sections: Dashboard, Plants (9 categories), Guides, Diary, Products, Images, Announcements, Homepage, Categories, Comments, Q&A, Users (13 routes including login).

### Login page (`/admin/login`)
Two-layer authentication:
1. **React handler** — `handleLogin()` calls CMS API, sets cookies, redirects
2. **Vanilla JS fallback** — inline `<script>` with `DOMContentLoaded` listener on `#admin-password` and `#admin-login-btn`. This ensures login works even if React hydration fails due to CDN-related JS errors.

Cookies are set with `Secure; SameSite=Strict` on the `/v2/` path.

### Category system
Categories are stored in the `settings` CMS collection as `{ id: "categories", groups: [...] }`. The `useCategories()` hook in `src/lib/useCategories.ts` loads them at runtime and merges with hardcoded defaults.

### Rich text editor
`RichTextEditor.tsx` wraps TipTap. Content stored as HTML strings. `contentToHtml()` converts old markdown/array content. `MarkdownRenderer.tsx` renders HTML via `dangerouslySetInnerHTML` with Tailwind prose classes.

### Image upload & cropping
`ImageUpload.tsx` and `RichTextEditor.tsx` both use `ImageCropper.tsx`. After selecting a file, the cropper opens with a **"跳过裁剪"** (skip crop) button to upload the original image without cropping. Images uploaded as FormData to `POST /api/cms/upload`, which stores them in CloudBase COS and returns a signed URL.

### COVER_IMAGE auto-refresh
`CoverImage.tsx` wraps `<img>` with error handling. On load failure, it extracts `cloudPath` from the CloudBase URL, calls `GET /api/cms/image-url?path=...` to get a fresh signed URL, and retries. Falls back to an `ImageOff` placeholder icon if refresh also fails.

### Page view tracking
`PageViewTracker.tsx` sends page views via `navigator.sendBeacon` to `/api/cms/analytics` after 2s delay, skipping `/admin/*` paths.

### Site search
`SearchDialog.tsx` is a modal overlay triggered from Header (search icon + Cmd/Ctrl+K) and homepage. Searches plants/guides/diary with 200ms debounce using client-side string matching.

### User authentication system
A complete user auth system separate from admin auth, using `AuthContext.tsx` (React context) wrapped via `AuthWrapper.tsx` in layout:

- **Login/Register**: `/login` page with tab switching (`?tab=login` / `?tab=register`). Username min 2 chars, password min 6 chars. Tokens stored as `user_token` cookie (7-day expiry, `SameSite=Lax; Secure`).
- **Profile**: `/profile` page shows user's questions and comments. Supports viewing other users via `?user=username`. Editable nickname and bio.
- **Header integration**: User dropdown (profile, logout) when logged in; login button when not.
- **API functions** in `api.ts`: `register()`, `loginUser()`, `getCurrentUser()`, `updateProfile()`, `getUserToken()`, `setUserToken()`, `clearUserToken()`.
- **CMS endpoints**: `POST /api/cms/register`, `POST /api/cms/login-user`, `GET /api/cms/me`, `PUT /api/cms/me`.

### Community Q&A (`/community`)
Full Q&A system with question listing, tag filtering, search, and answer submission:
- `/community` — question list with tag tabs and search
- `/community/ask` — post a new question
- `/community/question?id=...` — question detail with answer submission
- CMS collection: `qa`. Answers submitted via `POST /api/cms/qa/:id/answer`.
- Local fallback data in `src/data/questions.ts` (Question + Answer interfaces).

### Related content matching
`src/lib/relatedContent.ts` provides `findRelatedContent(plantId, plantName, allGuides?, allDiaries?)` that matches guides and diaries to plants using a 4-tier strategy:
1. Explicit ID match — `guide.relatedPlants` array / `diary.plantId`
2. Plant name appears in title
3. Plant name appears in tags
4. Plant name appears in summary

`RelatedContent.tsx` renders the results as card grids. Integrated in `PlantDetailClient.tsx`, which now loads CMS plants/guides/diaries in parallel via `Promise.all` — **CMS data always takes precedence over local static data**, so admin edits reflect immediately on page refresh.

### Auto-save drafts
`src/lib/useAutoSave.ts` — generic hook for admin forms. Configurable delay (default 30s), min title length, and beforeunload dirty-state detection. Saves with `status: "draft"` automatically. Used in guides, diary, and plants admin pages.

### Balcony assessment tool (`/assessment`)
Multi-step wizard: balcony orientation → enclosed? → city (searchable dropdown, 337 cities from `src/data/cities.ts`) → size → planting goals → results. City data includes climate zone templates.

### Image error handling
Two-layer image recovery:
1. `CoverImage.tsx` — per-image error handler: extracts `cloudPath` from CloudBase URL, calls `GET /api/cms/image-url?path=...` for a fresh signed URL
2. `ImageErrorHandler.tsx` — global capture-phase `<img>` error listener in layout, catches ALL broken CloudBase images and refreshes their URLs (max 1 retry per image)

### Additional pages
- `/guide` — scenario-based planting guides (distinct from `/guides` which is article listing)
- `/calendar` — seasonal planting calendar
- `/tools` — product recommendations (`src/data/products.ts`, includes CPS affiliate links)
- `/profile` — user profile (see User auth section)

### Data architecture (full picture)
Three-layer data sourcing:
1. **CMS API** (live) — `loadJSON()` fetches from CloudBase cloud function
2. **Static JSON** (`public/data/*.json`) — built-time snapshot, updated by `sync-from-cms.mjs`
3. **Local TypeScript** (`src/data/*.ts`) — hardcoded fallback, imported directly at build time

The sync pipeline: CMS API → `scripts/sync-from-cms.mjs` → `public/data/*.json` + `src/data/synced/*.ts` → `scripts/sync-data.mjs` → `src/data/*.ts` (updates local TS fallback files).

Key `api.ts` functions beyond `loadJSON`:
- `loadSingle(collection, key)` — fetch one document by id or slug
- `fetchAdminData(collection)` — admin data without draft filtering
- `saveToCMS(collection, records)` — iterates records, checks existence via GET, then PUT (update) or POST (create)
- `deleteFromCMS(collection, id)` — delete a record
- `submitToCMS(collection, record)` — public submission (no auth, for comments/QA)
- `submitAnswer(questionId, answer)` — submit answer to a QA question
- `clearCache(name?)` — invalidate in-memory cache

### Dark mode
`next-themes` `ThemeProvider` wraps the app. Tailwind `dark:` variants used throughout. Dark palette is green-tinted (`dark:bg-[#0f1a14]`, `dark:bg-[#1a2e22]/80`).

### Security hardening
- `public/robots.txt` — disallows `/admin`, `/login`, `/api/`; crawl-delay 3s
- `public/sitemap.xml` — lists 8 main public pages
- `<meta>` tags in layout: `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
- Cookies: `Secure; SameSite=Strict` for admin, `Secure; SameSite=Lax` for user tokens
- Cloud function: rate limiting, error sanitization, env-var-only password

## Key patterns
- **Auth**: Cookie-based. `admin_token=authenticated` for session, `cms_password` for API auth. Login page at `/admin/login` sets both. Separate user auth via `user_token` cookie + `AuthContext`.
- **ID generation**: Client-side slug generation from Chinese titles. Cloud function also generates IDs via `generateId()` as fallback.
- **Cache**: In-memory cache in `api.ts` (`cache` object). `clearCache()` busts it after writes.
- **SaveToCMS**: Iterates records one-by-one (no batch upsert). Checks existence via GET first, then PUT (update) or POST (create).
- **Dual deploy**: Deploy to both root and `/v2/` paths on CloudBase hosting. Assets use `/v2/_next/` prefix via `assetPrefix` + `basePath`. **Both must be set to the same value** (`process.env.ASSET_PREFIX`).
- **CDN**: 2-min cache TTL. Never trust CDN for newly-deployed files — use `assetPrefix` for versioned asset paths.
- **Content display**: CMS data always takes precedence over local static data. Plant detail pages load plants + guides + diaries from CMS in parallel via `Promise.all`, falling back to local TS data when CMS is unreachable.
- **Draft system**: Items with `status: "draft"` are filtered by `loadJSON()` for public pages but shown in admin via `fetchAdminData()`. `useAutoSave` hook auto-saves drafts in admin forms.
- **Content associations**: `relatedPlants` field on guides links them to plant IDs. `findRelatedContent()` also does name-based fuzzy matching across title/tags/summary.
- **User content**: Comments and QA answers require login. Author names are clickable links to `/profile?user=...`.
