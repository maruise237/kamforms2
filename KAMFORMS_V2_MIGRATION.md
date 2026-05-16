# Kamforms V2 Migration

## Decision

Kamforms V2 uses Formcn/TanStack Start as the new product base.

Kamforms V1 remains the source for the SaaS features to migrate:

- authentication and dashboard ownership;
- form publication;
- public submissions;
- submissions dashboard and CSV export;
- email and WhatsApp notifications;
- upload storage;
- rate limiting;
- analytics and production settings.

Formcn is used for the form builder foundation, UI components, React Hook Form, Zod validation, multi-step forms, and advanced field ideas.

## Deployment Target

Primary deployment target: Dokploy with Docker.

The Cloudflare/Wrangler path from Formcn is not the production target for Kamforms V2. The V2 Docker setup builds TanStack Start with Nitro's Node server preset and runs:

```bash
node .output/server/index.mjs
```

Dokploy should expose service `app` on port `3000`.

## Required Services

- PostgreSQL for users, forms, submissions, notification logs, and uploads metadata.
- Redis for rate limiting and later queue/lock behavior.
- Persistent volume `/app/uploads` for file uploads until object storage is added.

## Migration Order

1. Keep TanStack Start/Formcn as the base app.
2. Add the stable `FormSchemaV2` contract in `src/lib/kamforms/schema.ts`.
3. Make AI generate only `FormSchemaV2`, never JSX.
4. Add Prisma models for `User`, `Form`, `FormSubmission`, and `NotificationLog`.
5. Port Kamforms V1 API behavior to TanStack server functions/routes.
6. Build public renderer from `FormSchemaV2`.
7. Build dashboard/editor around pages, fields, and settings.
8. Add V1-to-V2 migration using `migrateFormSchemaV1ToV2`.
9. Add Dokploy environment variables and deploy from `git@github.com:maruise237/kamforms2.git`.

## Current Foundation

Implemented foundation files:

- `src/lib/kamforms/schema.ts`
- `src/lib/kamforms/schema.test.ts`
- `Dockerfile`
- `docker-compose.yml`
- `.env.example`
- `package-lock.json`

## Dokploy Environment

Minimum variables:

```bash
POSTGRES_USER=kamforms
POSTGRES_PASSWORD=...
POSTGRES_DB=kamforms_v2
VITE_APP_URL=https://kamforms2.kamtech.online
VITE_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
DEEPSEEK_API_KEY=...
REDIS_URL=redis://redis:6379
DATABASE_URL=postgresql://kamforms:...@postgres:5432/kamforms_v2
```

Optional variables:

```bash
EVOLUTION_API_URL=
EVOLUTION_API_KEY=
EVOLUTION_INSTANCE=
RESEND_API_KEY=
RESEND_FROM=
UPLOAD_DIR=/app/uploads
```
