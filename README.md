# Kamforms V2

Kamforms V2 is a TanStack Start form builder and SaaS foundation based on the useful parts of Formcn.

The product direction is:

> Cree ton formulaire en quelques secondes avec l'IA, publie-le, recois les reponses dans ton dashboard, par email ou WhatsApp, puis exporte les donnees.

## Stack

- TanStack Start
- React
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui-style components
- Docker/Dokploy
- Clerk auth

## Current Foundation

- Formcn/TanStack Start base retained as the builder foundation.
- Dokploy Docker setup added.
- Cloudflare/Wrangler deployment path removed as primary target.
- Kamforms `FormSchemaV2` contract added in `src/lib/kamforms/schema.ts`.
- Zod generation, AI-output normalization, and V1-to-V2 migration helpers added.
- Clerk sign-in/sign-up shell added with `VITE_CLERK_PUBLISHABLE_KEY`.
- Notifications contract covers email, WhatsApp, webhook, autoresponder, and digest settings.

## Development

```bash
npm install --legacy-peer-deps
npm run dev
```

## Verification

```bash
npm test -- src/lib/kamforms/schema.test.ts
npm run build
```

## Deployment

Dokploy should build the included `Dockerfile` and expose the `app` container on port `3000`.

Set `VITE_CLERK_PUBLISHABLE_KEY` in Dokploy before building so Clerk buttons are active in production. Keep `CLERK_SECRET_KEY`, `RESEND_*`, and `EVOLUTION_*` for the server-side auth and notification flows.

See `KAMFORMS_V2_MIGRATION.md` for the migration and deployment plan.
