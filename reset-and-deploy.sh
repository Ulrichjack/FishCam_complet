#!/bin/bash
# ─── SCRIPT DE RÉINITIALISATION TOTALE ───────────────────────────
# ⚠️ ATTENTION : CE SCRIPT EFFACE TOUTE LA BASE DE DONNÉES !

echo "🚨 ATTENTION : Vous êtes sur le point de SUPPRIMER TOUTES LES DONNÉES."
read -p "Êtes-vous sûr de vouloir continuer ? (Tapez 'OUI' pour confirmer) : " confirmation

if [ "$confirmation" != "OUI" ]; then
    echo "❌ Annulation. Aucune donnée n'a été supprimée."
    exit 1
fi

echo "🗑️ Suppression des conteneurs ET des volumes de données..."
# Le flag -v est la clé : il supprime les volumes (donc la base de données pgdata)
docker-compose down -v

echo "📦 Construction des nouvelles images et lancement des containers..."
docker-compose up -d --build

echo "🧹 Nettoyage des anciennes images Docker inutilisées..."
docker image prune -f

echo "✅ Réinitialisation et déploiement terminés avec succès !"
echo "🌐 L'application est accessible sur http://192.168.8.100"