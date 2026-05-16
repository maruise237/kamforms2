FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps --include=optional && \
    npm install --no-save --legacy-peer-deps \
      @rollup/rollup-linux-x64-gnu@4.53.3 \
      lightningcss-linux-x64-gnu@1.30.2 \
      @tailwindcss/oxide-linux-x64-gnu@4.1.18 \
      @rolldown/binding-linux-x64-gnu@1.0.1 && \
    node -e "require('@rollup/rollup-linux-x64-gnu'); require('lightningcss-linux-x64-gnu'); require('@tailwindcss/oxide-linux-x64-gnu'); require('@rolldown/binding-linux-x64-gnu')"

FROM node:22-bookworm-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
