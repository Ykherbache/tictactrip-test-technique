# Stage 1: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY tsconfig.*.json ./
COPY src ./src
COPY typings ./typings
RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine AS production
# Enable corepack for pnpm
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install production dependencies including OpenTelemetry packages
RUN pnpm install --frozen-lockfile --prod
RUN pnpm add @opentelemetry/api @opentelemetry/auto-instrumentations-node @opentelemetry/winston-transport

# Copy built application
COPY --from=builder /app/dist ./dist

# Set OpenTelemetry environment variables (will be overridden by Coolify)
ENV NODE_OPTIONS="--require @opentelemetry/auto-instrumentations-node/register"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

CMD ["node", "dist/main.js"]