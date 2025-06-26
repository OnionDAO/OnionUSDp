# Multi-stage build for OnionUSD-P
FROM node:18-alpine AS base

# Install dependencies
WORKDIR /app
COPY package*.json ./
COPY frontend/onion-dao/package*.json ./frontend/onion-dao/
COPY pUSD/package*.json ./pUSD/
RUN npm ci

# Copy source code
COPY . .

# Build frontend
FROM base AS frontend-build
WORKDIR /app/frontend/onion-dao
RUN npm run build

# Build backend
FROM base AS backend-build
WORKDIR /app/pUSD
RUN npm run build

# Production image
FROM node:18-alpine AS production

# Install production dependencies
WORKDIR /app
COPY package*.json ./
COPY frontend/onion-dao/package*.json ./frontend/onion-dao/
COPY pUSD/package*.json ./pUSD/
RUN npm ci --only=production

# Copy built applications
COPY --from=frontend-build /app/frontend/onion-dao/dist ./frontend/onion-dao/dist
COPY --from=backend-build /app/pUSD/dist ./pUSD/dist
COPY --from=backend-build /app/pUSD/src ./pUSD/src

# Copy configuration files
COPY postcss.config.mjs ./
COPY keypairs/ ./keypairs/

# Expose port for frontend
EXPOSE 5173 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5173 || exit 1

# Start the application
CMD ["npm", "run", "dev:frontend"]