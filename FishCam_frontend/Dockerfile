# ─── SKELETON: Dockerfile (Frontend Angular) ───────────────────────────

# ─── STAGE 1 : BUILD ───
# DIRECTIVE: Utilise 'node:20-alpine' et nomme cette étape 'builder' (avec AS)
# YOUR CODE HERE
FROM node:20-alpine AS builder

# DIRECTIVE: Place-toi dans le dossier '/app'
# YOUR CODE HERE
WORKDIR /app

# DIRECTIVE: Copie package.json et package-lock.json dans le container
# YOUR CODE HERE
COPY package*.json ./

# DIRECTIVE: Installe les dépendances avec 'npm ci' (plus rapide et strict que npm install)
# YOUR CODE HERE
RUN npm ci --legacy-peer-deps

# DIRECTIVE: Copie tout le reste du code source
# YOUR CODE HERE
COPY . .

# DIRECTIVE: Compile l'application Angular pour la production
# Commande : npm run build -- --configuration production
# YOUR CODE HERE
RUN npm run build -- --configuration production


RUN ls -la dist/ && ls -la dist/*

# ─── STAGE 2 : PRODUCTION ───
# DIRECTIVE: Utilise 'nginx:alpine'
# YOUR CODE HERE
FROM nginx:alpine

# DIRECTIVE: Copie les fichiers compilés depuis l'étape 'builder' vers le dossier de Nginx
# Syntaxe : COPY --from=builder /app/dist/fishcam-frontend/browser /usr/share/nginx/html
# YOUR CODE HERE
COPY --from=builder /app/dist/fishcam-frontend/browser /usr/share/nginx/html

# DIRECTIVE: Expose le port 80
# YOUR CODE HERE
EXPOSE 80

# Supprime la configuration Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf
# Copie notre configuration personnalisée
COPY nginx.conf /etc/nginx/conf.d/
