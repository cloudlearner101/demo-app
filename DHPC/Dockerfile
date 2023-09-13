FROM node:16-alpine AS builder

WORKDIR /app

COPY dhpc-app/package.json dhpc-app/package-lock.json ./
COPY dhpc-app/public/ public/
COPY dhpc-app/src/ src/
RUN npm ci
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.25.2-alpine3.18

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

ENV REACT_APP_USERNAME="admin" \
    REACT_APP_PASSWORD="admin" \
    API_URL="http://localhost:8080"

USER nginx
EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]