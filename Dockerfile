# Base
FROM oven/bun:1-alpine AS base
WORKDIR /app

# Install all dependencies (needed for build)
FROM base AS install
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Build
FROM base AS build
COPY --from=install /app/node_modules node_modules
COPY . .
RUN bun run build

# Install production dependencies only
FROM base AS prod-deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production

# Runtime
FROM base AS release
ENV NODE_ENV production
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./

USER bun
EXPOSE 3000
ENTRYPOINT [ "bun", "run", "dist/main.js" ]
