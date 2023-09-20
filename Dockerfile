FROM node:hydrogen-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM node:hydrogen-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
RUN npm prune --omit dev

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 4000
CMD ["node", "dist/main"]