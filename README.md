# 🐟 FishCam ERP — Infrastructure de Déploiement

> Dépôt global contenant l'orchestration Docker et les scripts de déploiement pour le système FishCam ERP.

---

## 🏗️ Architecture de Production

Ce dépôt utilise **Docker Compose** pour orchestrer les 3 conteneurs nécessaires au fonctionnement de l'application sur un serveur local (Xubuntu) :

1. **`fishcam-db`** : Base de données PostgreSQL 16 (Alpine).
2. **`fishcam-backend`** : API Spring Boot 3 (Java 17).
3. **`fishcam-frontend`** : Single Page Application Angular 20 servie par Nginx (Alpine).

## 🚀 Procédure de Déploiement

### 1. Prérequis sur le serveur hôte
- Docker et Docker Compose installés.
- Un fichier `.env` à la racine contenant les secrets de production :
  ```env
  DB_NAME=fishcam_db
  DB_USER=fishcam_user
  DB_PASSWORD=***
  JWT_SECRET=***
  CF_ENDPOINT=***
  CF_ACCESS_KEY=***
  CF_SECRET_KEY=***
  CF_BUCKET=***
  ```

 ###  2. Lancement standard
Le script deploy.sh automatise l'arrêt des anciens conteneurs, la reconstruction des images (Multi-stage builds) et le nettoyage du cache.
    ```bash
    chmod +x deploy.sh
    ./deploy.sh
    ```
 ### 3. Réinitialisation totale (Danger)
Pour formater la base de données et relancer l'initialisation d'usine (ProductionInitializer) :
    ```bash
    docker-compose down -v
    ./deploy.sh
    ```
 ### 📂 Volumes Persistants
- Les données suivantes sont persistées sur le serveur hôte :
- /var/lib/postgresql/data : Données de la base PostgreSQL.
- ./logs : Fichiers de logs de l'application Spring Boot.
- ./backups : Dumps SQL et exports CSV générés quotidiennement.
- ./avatars : Photos de profil des utilisateurs.