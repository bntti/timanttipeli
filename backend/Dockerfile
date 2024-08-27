FROM node:22-alpine AS build

WORKDIR /app
RUN mkdir backend

COPY tsconfig.base.json ./

# Prepare backend folder
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install

COPY backend/tsconfig.json backend/esbuild.mjs ./
COPY backend/src ./src

RUN yarn build


FROM node:22-alpine AS app
WORKDIR /app

ENV NODE_ENV=production

COPY backend/package.json backend/yarn.lock ./
RUN yarn install && yarn cache clean

COPY --from=build /app/backend/dist ./

EXPOSE 5000
ENTRYPOINT ["node", "index.mjs"]