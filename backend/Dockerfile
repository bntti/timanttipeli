FROM node:24-alpine AS base
RUN npm install --global pnpm@12

FROM base AS build
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY common/package.json common/package.json
COPY backend/package.json backend/package.json

RUN pnpm install --frozen-lockfile

COPY common common
COPY backend backend

RUN pnpm --filter @timanttipeli/backend build

FROM base AS prod
WORKDIR /app

COPY --from=build /app/backend/package.json ./package.json
COPY --from=build /app/backend/dist ./dist

RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 5000
CMD ["pnpm", "start"]