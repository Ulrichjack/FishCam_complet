# ─── STAGE 1 : BUILD ───
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build -- --configuration production

# ─── STAGE 2 : PRODUCTION ───
FROM nginx:alpine

# Nettoyage du dossier par défaut de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copie avec le nom exact extrait de votre angular.json
COPY --from=builder /app/dist/FishCam_frontend/browser /usr/share/nginx/html

EXPOSE 80

# Suppression et remplacement de la configuration Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
