#############################
# Builder stage
#############################
FROM node:20-bullseye as builder
WORKDIR /usr/src/app

# Install dependencies for build (including dev deps)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

#############################
# Production stage
#############################
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy compiled output from builder
COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
