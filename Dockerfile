
FROM node:18-alpine AS builder
RUN apk --no-cache add git
RUN corepack enable
RUN corepack prepare yarn@stable --activate
RUN yarn set version stable
WORKDIR /app
COPY . .
RUN yarn install
RUN ls -al
RUN yarn build

FROM nginx:1.19-alpine AS server
COPY ./etc/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder ./app/dist /usr/share/nginx/html
