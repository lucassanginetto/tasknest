FROM node:current-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

FROM node:current-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production --frozen-lockfile

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
