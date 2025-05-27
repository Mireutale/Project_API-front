# Build 단계
FROM node:18 AS build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Serve 단계
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
