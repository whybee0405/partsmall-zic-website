# syntax=docker/dockerfile:1

FROM node:24-alpine AS base
WORKDIR /app

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# --- dev: hot-reload target, source is bind-mounted at runtime ---
FROM deps AS dev
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- builder: produces the standalone production build ---
# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, not
# read at container startup — .env is deliberately excluded from the build
# context (.dockerignore) since it's where real secrets would go, so these
# come in as build args instead. Passed via docker-compose.prod.yml's
# build.args, which docker compose resolves from its own .env lookup —
# unrelated to, and unaffected by, .dockerignore.
FROM deps AS builder
ARG NEXT_PUBLIC_GA_MEASUREMENT_ID
ARG NEXT_PUBLIC_GSC_VERIFICATION
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$NEXT_PUBLIC_GA_MEASUREMENT_ID
ENV NEXT_PUBLIC_GSC_VERIFICATION=$NEXT_PUBLIC_GSC_VERIFICATION
COPY . .
RUN npm run build

# --- runner: minimal production image ---
FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

COPY --chown=node:node --from=builder /app/public ./public
COPY --chown=node:node --from=builder /app/.next/standalone ./
COPY --chown=node:node --from=builder /app/.next/static ./.next/static

EXPOSE 3000
USER node
CMD ["node", "server.js"]
