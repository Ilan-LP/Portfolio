# Multi-stage build to reduce final image size
FROM node:20-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (ci is faster and respects lockfile exactly)
RUN npm ci --loglevel=error

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript project
RUN npm run build

# Production stage
FROM node:20-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Copy necessary files from the builder
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nodejs:nodejs /app/prisma.config.ts ./prisma.config.ts

# Create uploads directory (will be overridden by volume mount if configured)
RUN mkdir -p /app/uploads && chown nodejs:nodejs /app/uploads

# Switch to non-root user
USER nodejs

# Expose the port
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy || true; npx prisma db push; npx prisma db seed || true; node dist/index.js"]
