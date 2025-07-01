FROM node:22-alpine AS base

ARG VITE_LOOPLICANT_API_BASE

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
# Install dependencies based on the preferred package manager
RUN npm ci --no-audit --no-fund --quiet


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/ .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED=1

ENV VITE_LOOPLICANT_API_BASE=$VITE_LOOPLICANT_API_BASE
# dunno build doesnt run without a defined url
RUN echo "NEO4J_URI=bolt://localhost:7687" > apps/looplicant/.env
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/apps/looplicant/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/looplicant/.next/static ./apps/looplicant/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/looplicant/public ./apps/looplicant/public

USER nextjs

EXPOSE 3000

ENV PORT=3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
ENV HOSTNAME="0.0.0.0"
CMD ["node", "apps/looplicant/server.js"]