# React 앱 build + Nginx에 정적 파일 배치
FROM node:20 AS build
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Nginx로 정적 파일 서빙 및 API 프록시 설정
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
