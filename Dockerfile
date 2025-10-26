# 1️⃣ Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all deps for build
RUN npm install

# Copy all project files
COPY . .

# Build Next.js
RUN npm run build

# Remove dev dependencies to shrink size
RUN npm prune --production

# 2️⃣ Runner
FROM node:18-alpine AS runner
WORKDIR /app

# Copy only production deps
COPY --from=builder /app/node_modules ./node_modules

# Copy build output and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
