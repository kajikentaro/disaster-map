FROM node:16.19 as builder_2d

ARG GoogleMapsAPIKey
ARG GoogleMapsMapId

# [MYSTERY] if WORKDIR /app, don't work
WORKDIR /work/2d
COPY 2d/package*.json /work/2d
RUN yarn
COPY 2d /work/2d
RUN yarn build --base=/2d

FROM node:16.19 as builder_3d

ARG GoogleMapsAPIKey
ARG GoogleMapsMapId

WORKDIR /work/3d
COPY 3d/package*.json /work/3d
RUN yarn
COPY 3d /work/3d
RUN yarn build --base=/3d

FROM nginx:stable-alpine3.17-slim

COPY --from=builder_2d /work/2d/dist /usr/share/nginx/html/2d
COPY --from=builder_3d /work/3d/dist /usr/share/nginx/html/3d
COPY nginx-custom.conf /etc/nginx/conf.d
