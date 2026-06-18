#!/bin/bash
# ─── SKELETON: deploy.sh ───────────────────────────

echo "🚀 Démarrage du déploiement de FishCam ERP..."

# DIRECTIVE: Arrête les containers existants proprement
# Commande : docker-compose down
docker-compose down

echo "📦 Construction des nouvelles images et lancement des containers..."

# DIRECTIVE: Lance les containers en arrière-plan (-d) et force la reconstruction des images (--build)
docker-compose up -d --build

echo "🧹 Nettoyage des anciennes images Docker inutilisées (pour libérer de l'espace sur le vieux PC)..."
# DIRECTIVE: Supprime les images "dangling" (les restes des anciens builds) sans demander confirmation
# Commande : docker image prune -f
docker image prune -f

echo "✅ Déploiement terminé avec succès !"
echo "🌐 L'application est accessible sur http://172.20.10.5/"
