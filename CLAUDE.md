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
npm run daemon           # Start local deploy daemon (port 3456, required for admin deploy button)
npm run seed:db          # Interactive CloudBase database seed/init script
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
- **Rate limiting**: Write ops 30/min per IP, read ops 120/min per IP (in-memory sliding window). User registration: 1 per IP per 24 hours (checked via DB query on `registerIP` field).
- **Error sanitization**: All errors return generic messages; details logged to console only
- **Password**: Must be set via CloudBase env var `CMS_ADMIN_PASSWORD` (no hardcoded fallback)
- **Image uploads**: Magic byte validation (JPG/PNG/GIF/WebP only), 10MB limit
- **Auto-deploy trigger**: After every successful POST/PUT/DELETE, `triggerDeploy()` (3s debounce) fires a `repository_dispatch` to GitHub Actions. The GitHub PAT is resolved from: `process.env.DEPLOY_PAT` → database `settings` collection (`id: "deploy-config"`) → null (skip). Logs to `[Deploy]` prefix.

**Database patching via CLI**: Use `cloudbase db nosql execute` for direct DB operations when the CMS API is insufficient:
```bash
# Insert
cloudbase db nosql execute -c '[{"TableName":"settings","CommandType":"INSERT","Command":"{\"insert\":\"settings\",\"documents\":[{\"id\":\"key\",\"value\":\"data\"}]}"}]'
# Query
cloudbase db nosql execute -c '[{"TableName":"settings","CommandType":"QUERY","Command":"{\"find\":\"settings\",\"filter\":{\"id\":\"key\"}}"}]'
```

**Image URL management**: CloudBase `getTempFileURL()` generates signed URLs that EXPIRE (despite 10-year maxAge, signatures can be invalidated by key rotation). The `image-url` endpoint regenerates fresh URLs from `cloudPath`. `CoverImage.tsx` automatically detects broken images and refreshes URLs.

**⚠️ Empty collection bug**: CloudBase NoSQL `orderBy()` can throw 500 on empty collections or missing indexes. The CMS API GET handler now has try-catch fallback — if sorted query fails, retries without sorting. This affected `announcements` (new empty collection) and can affect any newly created collection.

**Cloud function deploy**: Non-interactive deploy requires piping `yes`:
```bash
yes | npx cloudbase fn deploy cms-api --dir ./cloudfunctions/cms-api --force
```

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
**Uses `process.cwd() + "/out"`** (relative path, works in CI).

### COS header fix: `scripts/fix-cos-headers.mjs`
Fixes CloudBase COS objects that have broken `Content-Disposition: attachment` headers causing HTML/CSS/JS to be downloaded instead of rendered. Rewrites headers to `inline` for text-based MIME types.

### CMS data sync: `scripts/sync-from-cms.mjs`
Pulls latest data from CMS API and writes to `public/data/*.json` BEFORE each build. This ensures static JSON fallback data is current. Run via `npm run deploy` (included automatically).

### Auto-deploy pipeline (GitHub Actions + CMS webhook)
**When content is created/updated/deleted via the admin panel on ANY computer, the site automatically redeploys within ~5 minutes.** The pipeline:

1. Admin saves content → CMS API cloud function handles the write
2. Cloud function's `triggerDeploy()` fires (3s debounce) → calls GitHub API `POST /repos/ylfnevergiveup/yangtaixiaoyuanding/dispatches` with `{ event_type: 'cms-updated' }`
3. GitHub Actions workflow `.github/workflows/deploy.yml` runs: `npm ci` → `cloudbase login` → `npm run deploy`
4. New static pages live on CloudBase CDN ~5 min after content save

**Key details:**
- **GitHub repo**: `ylfnevergiveup/yangtaixiaoyuanding` (public)
- **PAT storage**: The cloud function reads the GitHub PAT from the CloudBase `settings` collection (`id: "deploy-config"`), falling back to `DEPLOY_PAT` env var. This avoids hardcoding secrets and allows runtime updates.
- **GitHub Secrets** (set via `gh secret set`): `TCB_ENV_ID`, `TENCENTCLOUD_SECRET_ID`, `TENCENTCLOUD_SECRET_KEY`, `CMS_ADMIN_PASSWORD`, `DEPLOY_PAT`
- **Manual trigger**: `gh workflow run deploy.yml` or `gh api repos/ylfnevergiveup/yangtaixiaoyuanding/dispatches -f event_type=cms-updated`

### Local deploy daemon (`scripts/deploy-daemon.js`)
A lightweight HTTP server on `127.0.0.1:3456` that runs `npm run deploy` when called:
- `POST /deploy` — trigger a deploy in background
- `GET /status` — check deploy status
- Started via `npm run daemon` (must run in a persistent terminal on the dev machine)
- Called by the admin header's "🚀 部署" button and automatically after publish saves
- The deploy button falls back to showing instructions if the daemon is unreachable

### Admin panel (`/admin`)
All admin pages are client components (`"use client"`) that fetch data via the CMS API. Auth is cookie-based (`admin_token=authenticated` + `cms_password`). Uses shared `AdminLayout` component with 12 nav items in sidebar.

Admin sections (13 routes including login): Dashboard (stats + analytics + backup), Plants (9 categories: 蔬菜/香草/多肉/花卉/水果/观叶/球根花卉/水生植物/食用菌, ~172 species), Guides (search + draft + related plants), Diary (draft + auto-save), Products, Images (browse/search/preview/copy URLs from all content), Announcements (CRUD + color themes), Homepage (section visibility toggles + ordering), Categories (dynamic value/label editing), Comments (status filter tabs), Q&A (content review: filter tabs 全部/待审核/已发布, one-click approve), Users (list + delete).

### Login page (`/admin/login`)
Two-layer authentication:
1. **React handler** — `handleLogin()` calls CMS API, sets cookies, redirects
2. **Vanilla JS fallback** — inline `<script>` with `DOMContentLoaded` listener on `#admin-password` and `#admin-login-btn`. This ensures login works even if React hydration fails due to CDN-related JS errors.

Cookies are set with `Secure; SameSite=Strict` on the `/v2/` path.

### Category system
Categories are stored in the `settings` CMS collection as `{ id: "categories", groups: [...] }`. The `useCategories()` hook in `src/lib/useCategories.ts` loads them at runtime and merges with hardcoded defaults.

**CDN-resistant pattern**: The plants listing page (`src/app/plants/page.tsx`) hardcodes all 9 category labels inline (`ALL_CATEGORIES`) and derives the visible set from loaded plants. This prevents CDN-cached old JS from showing stale/incomplete category tabs. When adding features that depend on build-time constants visible across deploys, prefer inline hardcoding or runtime derivation over imported constants.

### Rich text editor
`RichTextEditor.tsx` wraps TipTap. Content stored as HTML strings. `contentToHtml()` converts old markdown/array content. `MarkdownRenderer.tsx` renders HTML via `dangerouslySetInnerHTML` with Tailwind prose classes.

### Slug generation and URL safety
**`slugify(text)`** in `src/lib/utils.ts` generates URL-safe slugs from Chinese titles — strips parentheses, brackets, special punctuation, and whitespace while preserving Chinese characters and alphanumerics.

**Auto-fill behavior in admin forms** (guides, diary, PlantEditor):
- Typing a title automatically populates the slug field in real-time
- Once the slug field is manually edited by the user, auto-fill is disabled (tracked via `useRef`)
- On save, the final fallback chain is: `form.slug || slugify(form.title) || form.id`
- The slug placeholder text shows "留空则自动生成"

**⚠️ Critical URL encoding rule**: Always use `encodeURI()` (NOT `encodeURIComponent()`) for Chinese slugs in URLs. `encodeURIComponent` percent-encodes Chinese characters, producing URLs that don't match static file paths. `encodeURI` preserves Chinese characters, which Next.js static export generates as-is.

### Admin search
Both `/admin/plants` and `/admin/guides` have real-time search bars:
- **Plants**: filters by plant name, scientific name, ID/slug, category (Chinese label), difficulty (新手/进阶/高手), and planting season.
- **Guides**: filters by title, ID/slug, category (入门/时令/DIY/技巧 label), tags, author, summary, and related plants.
Results update on every keystroke via `useMemo`. Shows "筛选出 N 篇/种" count when searching, and a "没有找到匹配的..." empty state when no results match. Search bar has a search icon + clear (X) button, styled consistently across both pages.

### Admin dashboard (`/admin`)
The dashboard (`/admin/page.tsx`) provides:
- **Stats cards**: Dynamic counts for plants, guides, diary entries, products
- **Analytics**: Total PV, total UV, today's visits, top 8 pages from CMS analytics
- **Quick actions**: Buttons to create plants, guides, diary, products, and preview the site
- **Data backup/restore**: Export all content as a single JSON file; restore by importing JSON (iterates records through `saveToCMS`)
- **Recent content**: Shows up to 8 recently updated items across all content types

### Homepage random display
The homepage (園丁日記, 種植指南, 社區問答 sections) displays randomly shuffled content on each page load:
- **Plants**: Featured plants first, then shuffled non-featured (6 max)
- **Diary**: Pinned entries first, then shuffled (2 max)
- **Guides**: Fully shuffled (3 max)
- **Q&A**: Random 3 questions from CMS, with local fallback data while loading
- The Q&A section was previously hardcoded; now loads from CMS `qa` collection

### Image upload & cropping
`ImageUpload.tsx` and `RichTextEditor.tsx` both use `ImageCropper.tsx`. After selecting a file, the cropper opens with a **"跳过裁剪"** (skip crop) button to upload the original image without cropping. Images uploaded as FormData to `POST /api/cms/upload`, which stores them in CloudBase COS and returns a signed URL.

### COVER_IMAGE auto-refresh
`CoverImage.tsx` wraps `<img>` with error handling. On load failure, it extracts `cloudPath` from the CloudBase URL, calls `GET /api/cms/image-url?path=...` to get a fresh signed URL, and retries. Falls back to an `ImageOff` placeholder icon if refresh also fails.

### Page view tracking
`PageViewTracker.tsx` sends page views via `navigator.sendBeacon` to `/api/cms/analytics` after 2s delay, skipping `/admin/*` paths.

### Site search
`SearchDialog.tsx` is a modal overlay triggered from Header (search icon + Cmd/Ctrl+K) and homepage. Searches plants/guides/diary with 200ms debounce using client-side string matching.

### Announcements
`AnnouncementBar.tsx` renders active announcements on public pages with dismiss and auto-rotation. Managed via `/admin/announcements` (CRUD with color themes and enable/disable toggle). Stored in CMS `announcements` collection.

### Comments
`CommentSection.tsx` renders comments on public pages with author links to `/profile?user=...`. Users must be logged in to comment. Admin moderation at `/admin/comments` with status filter tabs (all/published/draft).

### Image focal point
`FocalPointPicker.tsx` provides a 3x3 grid selector for setting CSS `object-position` on images, used in admin image uploads.

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
- CMS collection: `qa`. Answers submitted via `POST /api/cms/qa/:id/answer`. Answers default to `status: "draft"` (both frontend and API).
- Local fallback data in `src/data/questions.ts` (Question + Answer interfaces).
- **Content review**: User-submitted questions and answers default to `status: "draft"` and are hidden from public pages. Admin approves via `/admin/qa` — status filter tabs (全部/待审核/已发布), draft rows highlighted amber, one-click "通过" button to publish. `loadJSON` and CMS API GET both filter drafts for unauthenticated requests.

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
2. **Static JSON** (`public/data/*.json`) — built-time snapshot, updated by `sync-from-cms.mjs`. Files: `plants.json`, `guides.json`, `diary.json`, `products.json`, `comments.json`, `qa.json`.
3. **Local TypeScript** (`src/data/*.ts`) — hardcoded fallback, imported directly at build time

The sync pipeline:
- **Build-time**: CMS API → `scripts/sync-from-cms.mjs` → `public/data/*.json` + `src/data/synced/*.ts`
- **Manual sync**: `npm run sync:data` runs `scripts/sync-data.mjs` to push `public/data/*.json` → `src/data/*.ts` (updates local TS fallback files with latest static data)

Key `api.ts` functions beyond `loadJSON`:
- `loadSingle(collection, key)` — fetch one document by id or slug
- `fetchAdminData(collection)` — admin data without draft filtering (includes `?sort=_updatedAt,desc`). **Has 8s timeout** via AbortController, falls back to static JSON. Used by all admin pages.
- `saveToCMS(collection, records)` — iterates records, checks existence via GET, then PUT (update) or POST (create). **Matches by `id` field, not `_id`.**
- `deleteFromCMS(collection, id)` — delete a record
- `submitToCMS(collection, record)` — public submission (no auth, for comments/QA)
- `submitAnswer(questionId, answer)` — submit answer to a QA question
- `clearCache(name?)` — invalidate in-memory cache

Key `utils.ts` exports:
- `slugify(text)` — generate URL-safe slug from Chinese title
- `categoryLabels` / `categoryEmojis` — Chinese labels and emoji mappings for 9 plant + 4 difficulty + 4 guide categories
- `orientationLabels` — Chinese labels for balcony orientations
- `BUILD_FINGERPRINT` — version marker for cache busting
- `cn(...classes)` — conditional class name joiner

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
- **ID/slug generation**: Use `slugify()` from `src/lib/utils.ts` for generating URL-safe slugs from Chinese titles. Admin forms auto-fill slugs from titles in real-time; manual edits disable auto-fill. Fallback chain: `form.slug || slugify(form.title) || form.id`.
- **Cache**: In-memory cache in `api.ts` (`cache` object). `clearCache()` busts it after writes.
- **SaveToCMS**: Iterates records one-by-one (no batch upsert). Checks existence via GET first, then PUT (update) or POST (create). Updates are matched by `id` field (not `_id` — the CloudBase internal `_id` differs from the document's `id` field).
- **Dual deploy**: Deploy to both root and `/v2/` paths on CloudBase hosting. Assets use `/v2/_next/` prefix via `assetPrefix` + `basePath`. **Both must be set to the same value** (`process.env.ASSET_PREFIX`).
- **CDN**: 2-min cache TTL (nominal). Never trust CDN for newly-deployed files — use `assetPrefix` for versioned asset paths. **CDN edge nodes sometimes retain old HTML despite redeploy; if frontend shows stale content, redeploy `/v2/` again** (`npx cloudbase hosting deploy out /v2/`).
- **Content display**: CMS data always takes precedence over local static data. Plant detail pages load plants + guides + diaries from CMS in parallel via `Promise.all`, falling back to local TS data when CMS is unreachable.
- **Draft system**: Items with `status: "draft"` are filtered by `loadJSON()` for public pages but shown in admin via `fetchAdminData()`. `useAutoSave` hook auto-saves drafts in admin forms.
- **Content associations**: `relatedPlants` field on guides links them to plant IDs. `findRelatedContent()` also does name-based fuzzy matching across title/tags/summary.
- **User content**: Comments and QA answers require login. Author names are clickable links to `/profile?user=...`.
- **Auto-deploy**: CMS write operations trigger a GitHub Actions deploy via `repository_dispatch` (3s debounce in cloud function). The GitHub PAT is read from `settings` collection (`deploy-config` doc) at runtime. GitHub repo: `ylfnevergiveup/yangtaixiaoyuanding`.
- **`cloudbaserc.json`**: Contains the `envId` and framework plugin config. **Contains `CMS_ADMIN_PASSWORD` in `framework.plugins.cmsApi.inputs.envVariables` — this is committed to the repo.** Never add additional secrets (like PATs) to this file permanently. Use `cloudbase config update fn cms-api` for env var changes, then revert the file.
- **Static export limitation**: New CMS content requires a redeploy to generate static HTML files. Without redeploy, new guides/plants/diary entries will 404. The auto-deploy pipeline handles this automatically.
