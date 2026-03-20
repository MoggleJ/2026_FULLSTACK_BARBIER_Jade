# ── Development ──────────────────────────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "run", "dev"]

# ── Production ────────────────────────────────────────────────────────────────
FROM node:20-alpine AS prod

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

EXPOSE 5000
CMD ["node", "src/index.js"]
