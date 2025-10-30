#############################
# Builder stage
#############################
FROM node:20-bullseye as builder
WORKDIR /usr/src/app

# Install dependencies for build (including dev deps)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source and build
# Copy full source and run build (explicit diagnostics to surface errors during image build)
COPY . .
# Run TypeScript build in builder
RUN npx tsc --build

#############################
# Production stage
#############################
FROM node:20-alpine
WORKDIR /usr/src/app

# Copy only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy compiled output from build context (host dist) into the image
COPY ./dist ./dist

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
