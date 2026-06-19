# 🧪 RAPPORT DE TESTS GLOBAUX — FISHCAM ERP

**Date :** 18 Juin 2026
**Serveur :** Xubuntu (4 Go RAM, 256 Go HDD)
**Architecture :** Docker (PostgreSQL 16, Spring Boot 3, Nginx/Angular)

## 1. Test de Concurrence (Transactions Simultanées)
- **Objectif :** Vérifier que deux caissières ne peuvent pas corrompre un solde en cliquant en même temps.
- **Résultat attendu :** Les deux transactions passent, le solde final est exact.
- **Statut :** ✅ Validé
- **Observations :** Avant la correction, le test échouait (perte de mise à jour). Après l'ajout de `@Lock(LockModeType.PESSIMISTIC_WRITE)` dans le Repository, PostgreSQL met les requêtes en file d'attente. Le solde final est parfaitement calculé, même avec des clics à la milliseconde près.

## 2. Test de Montée en Charge (Load Testing)
- **Objectif :** Créer 500 factures simultanément via un script Python.
- **Résultat attendu :** Le serveur ne crash pas, la RAM reste stable, 0 erreur 500.
- **Statut :** ✅ Validé
- **Observations :** 500 requêtes traitées en 12.88 secondes. 100% de succès (Code 201). Le CPU du backend est monté à 125% temporairement pour absorber la charge, mais la RAM est restée dans les limites fixées par Docker. Le système est extrêmement robuste.

## 3. Test de Résilience (Coupure Réseau)
- **Objectif :** Débrancher le câble réseau pendant une transaction.
- **Résultat attendu :** Le frontend affiche une erreur propre, la base de données n'est pas corrompue.
- **Statut :** 🔲 À faire
- **Observations :** ...