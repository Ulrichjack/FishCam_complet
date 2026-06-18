 # 🚀 1. Les commandes incontournables (celles qu'on a le plus utilisées)Ce sont vos commandes de survie pour piloter l'architecture FishCam au quotidien depuis le dossier ~/fishcam-erp/ :
 * docker compose up -d : Lance tous les conteneurs en arrière-plan (mode détaché).
 * docker compose down : Arrête et supprime les conteneurs et les réseaux (sans perdre vos données).
 * docker compose up -d --build : Force la re-compilation (Maven / Angular) et reconstruit les images avant de lancer.
 * docker compose down -v : Radical. Arrête tout et efface complètement la base de données (pgdata) pour repartir à zéro.
 * docker compose logs -f [service] : Affiche les logs en temps réel (ex: fishcam-backend ou fishcam-frontend) pour traquer les erreurs 500 ou les bugs Nginx.
 
 # 🔍 2. Les commandes d'inspection (pour voir ce qui se passe)Idéal pour vérifier l'état de santé de votre vieux PC (Jack) :
 * docker compose ps : Liste vos conteneurs avec leur statut (Up, Exit, Healthy) et les ports ouverts.docker ps : La commande globale pour voir tous les conteneurs qui tournent actuellement sur la machine.
 * docker stats : Affiche en temps réel la consommation d'espace, de CPU et surtout de RAM de chaque conteneur (très utile pour vérifier que le backend ne dépasse pas sa limite de 1 Go).
 
 # 🛠️ 3. Les commandes d'exécution et de debug (à l'intérieur du conteneur)Pour interagir directement avec vos outils sans les installer sur votre système hôte :
 * docker exec -it fishcam-db psql -U fishcam_user -d fishcam_db : Vous connecte directement à la console PostgreSQL pour lancer vos requêtes SQL (SELECT, UPDATE).
 * docker exec -it fishcam-frontend ls -la /usr/share/nginx/html : Permet d'explorer les dossiers d'un conteneur pour vérifier si les fichiers Angular ont été copiés au bon endroit.
 * docker exec -it [nom-container] sh : Ouvre un terminal (shell) à l’intérieur de n'importe quel conteneur pour naviguer dedans comme sur un autre PC Linux.
 
 # 🧹 4. Les commandes de nettoyage (pour libérer de l'espace)Votre serveur de production étant un vieux PC, le stockage peut vite saturer à force de reconstruire des images. Utilisez ces commandes pour faire de la place :
 * docker image prune -f : Supprime toutes les images intermédiaires "suspendues" (les résidus de vos builds précédents).
 * docker system prune -a --volumes : Attention, nettoyage de printemps ! Supprime absolument tout ce qui n'est pas utilisé (images, conteneurs arrêtés, et volumes inutilisés). À n'utiliser que si vous voulez vider tout le cache du PC