FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json esbuild.mjs ./
COPY src ./src

RUN npm run build


FROM node:20-alpine AS app
WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./

EXPOSE 5000
ENTRYPOINT ["node", "index.mjs"]