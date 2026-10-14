FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx ng build

FROM nginx:alpine
COPY --from=build /app/dist/wish-list/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.d/30-wishu-env.sh /docker-entrypoint.d/30-wishu-env.sh
RUN chmod +x /docker-entrypoint.d/30-wishu-env.sh
EXPOSE 80
