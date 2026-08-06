# CSCS Backend API

REST API for the Country Soccer Club System (CSCS) — Comp 353 Main Project.
Sits between the React/Vite frontend and the AITS-hosted MySQL database.

```
+------------------+
| React / Vite UI  |
+--------+---------+
         |
      HTTP (JSON)
         |
         v
+------------------+
| Express API      |
|                  |
| Routes           |
| Validation       |
| Controllers      |
| Services (logic) |
+--------+---------+
         |
      mysql2 pool
         |
         v
+------------------+
| AITS MySQL       |
+------------------+
```

## Tech stack

- **Node.js + Express** — HTTP layer
- **TypeScript** (strict mode) — compiled with `tsc`, run in dev via `tsx`
- **mysql2/promise** — connection pool to AITS, no ORM
- **Zod** — request validation and env var validation

## Project structure

```
src/
├── config/        env var loading + validation (fails fast on startup)
├── db/            mysql2 pool + connection health check
├── types/         per-entity TS interfaces + Zod schemas
├── middleware/     validate, errorHandler, notFound
├── utils/         AppError hierarchy, asyncHandler wrapper
├── services/      SQL + business logic, one file per entity
├── controllers/   HTTP request/response glue, one file per entity
├── routes/        Express routers, one file per entity + index.ts
├── app.ts         builds the Express app (middleware + routes)
└── server.ts      starts the HTTP server, checks DB, graceful shutdown
```

Each entity is one file per layer (`location.types.ts`, `location.service.ts`,
`location.controller.ts`, `location.routes.ts`) rather than one big file per
layer — keeps a PR touching `ClubMember` from ever conflicting with one
touching `Payment`.

## Getting started

```bash
npm install
cp .env.example .env   # fill in real AITS credentials
npm run dev
```

Confirm it's actually reaching AITS:

```
GET http://localhost:4000/api/v1/health
```

## Environment variables

| Variable              | Required | Default       | Notes                                   |
| --------------------- | -------- | ------------- | --------------------------------------- |
| `NODE_ENV`            | no       | `development` | `development` \| `test` \| `production` |
| `PORT`                | no       | `4000`        | API port                                |
| `DB_HOST`             | yes      | —             | AITS host                               |
| `DB_PORT`             | no       | `3306`        |                                         |
| `DB_USER`             | yes      | —             | AITS username                           |
| `DB_PASSWORD`         | no       | `''`          | AITS password                           |
| `DB_NAME`             | yes      | —             | `wqc353_1`                              |
| `DB_CONNECTION_LIMIT` | no       | `10`          | mysql2 pool size                        |

Missing/invalid values fail loudly at startup (see `src/config/env.ts`)
rather than surfacing as a confusing error mid-request later.

## Scripts

| Command             | Purpose                                   |
| ------------------- | ----------------------------------------- |
| `npm run dev`       | Run with hot reload (`tsx watch`)         |
| `npm run build`     | Compile TypeScript to `dist/`             |
| `npm start`         | Run the compiled build (`dist/server.js`) |
| `npm run typecheck` | Type-check without emitting files         |

## API conventions

- Base path: `/api/v1`
- Success response: `{ "success": true, "data": ... }`
- Error response: `{ "success": false, "error": { "message": "..." } }`
- Status codes: `200` read, `201` create, `204` delete, `400` validation,
  `404` not found, `409` conflict (e.g. duplicate unique field), `500`
  unexpected error
- Every resource below follows the same shape unless noted: `GET /`
  (list), `GET /:id`, `POST /`, `PUT /:id`, `DELETE /:id`

## Endpoints

| Resource       | Base path                | Notes                                                  |
| -------------- | ------------------------ | ------------------------------------------------------ |
| Health         | `/api/v1/health`         | `GET` only — live AITS connection check                |
| Locations      | `/api/v1/locations`      | Head office + branches                                 |
| Personnel      | `/api/v1/personnel`      | Location assignments are time-based, see below         |
| Family Members | `/api/v1/family-members` | Primary/Secondary relation to club members             |
| Club Members   | `/api/v1/club-members`   | Major/minor status is derived, not stored              |
| Hobbies        | `/api/v1/hobbies`        | Fixed list + member assignments                        |
| Payments       | `/api/v1/payments`       | Active status + donations are derived, not stored      |
| Sessions       | `/api/v1/sessions`       | Training/game sessions                                 |
| Formations     | `/api/v1/formations`     | Roster gender/location homogeneity enforced, see below |
| FIFA Games     | `/api/v1/fifa-games`     | Games + participation                                  |
| Email Logs     | `/api/v1/email-logs`     | `GET` only — system-generated by the weekly email job  |

Association data that doesn't map to a single row (a member's hobby list, a
formation's roster, a game's participants) is exposed as a nested route
under its parent resource rather than a separate top-level one — follow
whatever pattern the entity implementing it already uses.

## Business rules enforced outside the schema

These can't be expressed as a plain FK/CHECK constraint, so they live in
the service layer and/or a DB trigger — documented here so they're not
silently lost:

- Club member `Major`/`Minor` status — derived from date of birth
- `Active`/`Inactive` status — derived from whether prior-year fees were
  fully paid
- Donation amount — derived as `SUM(payments) - fee_cap` for the year
- Formation rosters — all players must share the same gender and be at
  the formation's location
- A club member can't be assigned to two formations on the same day unless
  their session start times are ≥3 hours apart (rejected on violation)
- `EmailLog.subject`/`body_snippet` are stored as sent (audit trail), not
  re-derived if the underlying formation is edited later

## Adding a new resource

Follow the `Location` implementation as the reference:

1. `types/<entity>.types.ts` — TS interface + Zod create/update schemas
2. `services/<entity>.service.ts` — SQL queries + any business rules
3. `controllers/<entity>.controller.ts` — thin HTTP glue, no SQL here
4. `routes/<entity>.routes.ts` — wire validation + controller per verb
5. One line in `routes/index.ts`: `router.use('/<path>', entityRoutes)`
