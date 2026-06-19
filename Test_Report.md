# 🧪 RAPPORT DE TESTS GLOBAUX — FISHCAM ERP

**Date :** 18 Juin 2026
**Serveur :** Xubuntu (4 Go RAM, 256 Go HDD)
**Architecture :** Docker (PostgreSQL 16, Spring Boot 3, Nginx/Angular)

## 1. Test de Concurrence (Transactions Simultanées)
- **Objectif :** Vérifier que deux caissières ne peuvent pas corrompre un solde en cliquant en même temps.
- **Résultat attendu :** Les deux transactions passent, le solde final est exact.
- **Statut :** 🔲 À faire
- **Observations :** ...

## 2. Test de Montée en Charge (Load Testing)
- **Objectif :** Créer 500 factures en moins d'une minute via un script Python.
- **Résultat attendu :** Le serveur ne crash pas, la RAM reste < 3 Go, 0 erreur 500.
- **Statut :** 🔲 À faire
- **Observations :** ...

## 3. Test de Résilience (Coupure Réseau)
- **Objectif :** Débrancher le câble réseau pendant une transaction.
- **Résultat attendu :** Le frontend affiche une erreur propre, la base de données n'est pas corrompue.
- **Statut :** 🔲 À faire
- **Observations :** ...