FROM node:22-alpine AS build

WORKDIR /app
RUN mkdir frontend

COPY tsconfig.base.json ./

# Prepare frontend folder
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install --production

COPY frontend/tsconfig.json frontend/tsconfig.app.json frontend/tsconfig.node.json ./
COPY frontend/index.html frontend/vite.config.mts ./
COPY frontend/src ./src

RUN yarn build


FROM nginx:alpine AS run

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/frontend/dist /usr/share/nginx/html

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80