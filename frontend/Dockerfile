FROM node:24-alpine AS base
RUN npm install --global pnpm@12

FROM base AS build
WORKDIR /app

COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY common/package.json common/package.json
COPY frontend/package.json frontend/package.json

RUN pnpm install --frozen-lockfile

COPY common common
COPY frontend frontend

RUN pnpm --filter @timanttipeli/frontend build

FROM nginx:alpine AS run

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
