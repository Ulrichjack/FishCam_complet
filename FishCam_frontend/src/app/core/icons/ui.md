




JMeter ou Gatling : Des logiciels gratuits pour simuler 50 caissières qui enregistrent des factures en même temps.
Cypress ou Playwright : Pour simuler des clics automatiques sur l'interface Angular.
VisualVM : Pour surveiller la RAM de Spring Boot en direct.



# ╔══════════════════════════════════════════════════════════════════════╗
# ║        FISHCAM ERP — MASTER PROMPT v5.0 (PHASE DÉPLOIEMENT)          ║
# ║        Angular 20 · Spring Boot 3 · Docker · Xubuntu                 ║
# ╚══════════════════════════════════════════════════════════════════════╝

## 🔁 CONTINUITY BLOCK — READ THIS FIRST
PROJECT   : FishCam ERP — Poissonnerie Management System, Cameroon
DEVELOPER : Ulrich — Licence 3, 2026, Douala
SERVER    : HP Desktop, Xubuntu, 4GB RAM, 256GB HDD, Docker installé
IP SERVER : 192.168.8.100 (Réseau local)

### Phase Status
✅ PHASES 1 à 13 — DÉVELOPPEMENT FRONTEND & BACKEND → TERMINÉ À 100%
🔲 PHASE 14 — DÉPLOIEMENT DOCKER (XUBUNTU)          → EN COURS
🔲 PHASE 15 — TESTS DE MONTÉE EN CHARGE (LOAD TEST) → NOT STARTED
🔲 PHASE 16 — CORRECTIONS POST-DÉPLOIEMENT          → NOT STARTED

---

## 🐳 PHASE 14 — DÉPLOIEMENT DOCKER (L'OBJECTIF ACTUEL)

L'application doit tourner sur le vieux PC Xubuntu (4Go RAM). 
Contraintes strictes de RAM pour éviter le crash du serveur :
- PostgreSQL : Limité via configuration de base.
- Spring Boot : Limité via JAVA_OPTS (`-Xms512m -Xmx1g`).
- Angular : Servi par Nginx Alpine (très léger).

### Ordre de création des fichiers (Méthode Squelette -> Ulrich -> Claude) :
STEP 14.1 : `Dockerfile` pour le Backend (Spring Boot)
STEP 14.2 : `Dockerfile` pour le Frontend (Angular + Nginx)
STEP 14.3 : `nginx.conf` (Configuration du reverse proxy et routage Angular)
STEP 14.4 : `docker-compose.yml` (Orchestration globale : DB + Backend + Frontend)
STEP 14.5 : Script bash de déploiement (`deploy.sh`)

---

## 🧪 PHASE 15 — TESTS GLOBAUX (APRÈS DÉPLOIEMENT)

Une fois l'application en ligne sur `http://192.168.8.100`, nous ferons :
1. Test de concurrence : 2 utilisateurs modifient le même compte courant.
2. Test de charge : Script Python/JMeter pour insérer 1000 factures en 1 minute.
3. Test de résilience : Couper le réseau (câble RJ45) pendant une transaction.

---

## 🔒 HOW WE WORK — THE METHOD (TOUJOURS ACTIVE)

Même pour le DevOps (Docker), on garde la méthode d'apprentissage :
STEP 1 — QUESTION : Claude pose une question sur Docker/Nginx.
STEP 2 — SKELETON : Claude donne la structure du fichier (ex: Dockerfile vide avec commentaires).
STEP 3 — RESEARCH : Ulrich cherche comment écrire les commandes Docker.
STEP 4 — SEND : Ulrich envoie le fichier complété.
STEP 5 — VALIDATE : Claude corrige et valide.

---














# ╔══════════════════════════════════════════════════════════════════╗
# ║   FISHCAM ERP — COMPLETE UI SPECIFICATION                       ║
# ║   All Pages · All Modals · All Slide-Overs · All Messages       ║
# ║   Source: All Backend Controllers (validated)                   ║
# ╚══════════════════════════════════════════════════════════════════╝

---

## ANSWER — Création Compte Courant

The `POST /comptes-courants/client/{clientId}` endpoint exists.
This means the backend does NOT auto-create a compte courant.

**UI Rule :**
```
On Client Detail page:
  @if client has no compte courant yet:
    → Show "Ouvrir un compte courant" button
    → Calls POST /comptes-courants/client/{clientId}
    → On success: refreshes client detail

  @if client has no épargne yet:
    → Show "Ouvrir un compte épargne" button
    → Calls POST /epargnes  { clientId }
    → On success: refreshes client detail
```

---

## SIDEBAR — PER ROLE (updated from all controllers)

```
┌──────────────────────────────────┬────────────────┬──────────────────────────────┐
│ NAV ITEM                         │ ICON           │ VISIBLE FOR                  │
├──────────────────────────────────┼────────────────┼──────────────────────────────┤
│ Tableau de bord                  │ LayoutDashboard│ All                          │
│ Clients                          │ Users          │ All                          │
│ Factures                         │ FileText       │ All                          │
│ Transactions                     │ ArrowLeftRight │ All                          │
│ Livreurs                         │ Truck          │ All                          │
│ Produits                         │ Package        │ All                          │
│ Fournisseurs                     │ Store          │ All                          │
│ Notifications                    │ Bell + badge   │ All                          │
│ ──────────────────────────────── │                │                              │
│ Comptes en dette                 │ AlertTriangle  │ PATRON + SUPER_ADMIN         │
│ Clôture journalière              │ CalendarCheck  │ PATRON + SUPER_ADMIN         │
│ Bilans                           │ BarChart2      │ PATRON + SUPER_ADMIN         │
│ Statistiques                     │ TrendingUp     │ PATRON + SUPER_ADMIN         │
│ Récapitulatifs                   │ ClipboardList  │ PATRON + SUPER_ADMIN         │
│ ──────────────────────────────── │                │                              │
│ Poissonneries                    │ Building2      │ SUPER_ADMIN only             │
│ Équipe                           │ UserCog        │ PATRON + SUPER_ADMIN         │
│ Audit logs                       │ ScrollText     │ PATRON + SUPER_ADMIN         │
│ Sauvegarde                       │ Database       │ All                          │
└──────────────────────────────────┴────────────────┴──────────────────────────────┘
```

**Sidebar Bottom — User Footer :**
```
┌─────────────────────────────────────────┐
│  [MK]  Marie Kamga                      │
│        CAISSIÈRE                        │
│  Poissonnerie La Référence · [logout→]  │
└─────────────────────────────────────────┘
```
- Avatar: initials circle bg-fc-green
- Role chip: PATRON(yellow) / SUPER_ADMIN(red) / CAISSIERE(green) / ENREGISTREUR(gray)

---

## MESSAGE SYSTEM — TOASTS & ALERTS

### Toast Notification (global)

Appears top-right corner, auto-dismiss after 4 seconds.
Animation: slide in from right → fade out.

```
SUCCESS                          ERROR
┌──────────────────────────┐     ┌──────────────────────────┐
│ ✅ Client créé avec       │     │ ❌ Erreur serveur (500)   │
│    succès                 │     │    Réessayez plus tard   │
│ ──────────────────────── │     │ ──────────────────────── │
│  [×]          4s ████░░  │     │  [×]          4s ████░░  │
└──────────────────────────┘     └──────────────────────────┘
  bg-fc-green-light                bg-fc-red-light
  border-fc-green                  border-fc-red
  text-fc-green                    text-fc-red

WARNING                          INFO
┌──────────────────────────┐     ┌──────────────────────────┐
│ ⚠️ Montant dépasse la    │     │ ℹ️ Données simulées      │
│    limite autorisée       │     │   (mode hors-ligne)      │
└──────────────────────────┘     └──────────────────────────┘
  bg-fc-yellow-light               bg-blue-50
  border-fc-yellow                 border-blue-200
```

**Toast triggers (from each endpoint) :**
```
POST /clients              → ✅ "Client créé avec succès"
PUT  /clients/{id}         → ✅ "Client modifié avec succès"
POST /comptes-courants/emprunts      → ✅ "Emprunt enregistré"
POST /comptes-courants/remboursements→ ✅ "Remboursement enregistré"
POST /epargnes/depot       → ✅ "Dépôt effectué avec succès"
POST /epargnes/retrait     → ✅ "Retrait effectué avec succès"
POST /factures             → ✅ "Facture créée avec succès"
PUT  /factures/{id}/cloturer→ ✅ "Facture clôturée"
POST /clotures             → ✅ "Journée clôturée avec succès"
401 error                  → ❌ "Session expirée, reconnectez-vous"
403 error                  → ❌ "Accès refusé"
500 error                  → ❌ "Erreur serveur. Réessayez."
network error              → ❌ "Connexion impossible"
```

### Inline Form Errors (under each field)

```
┌──────────────────────────────────────┐
│ Prénom *                             │
│ ┌────────────────────────────────┐   │
│ │                                │   │  ← red border
│ └────────────────────────────────┘   │
│ ⚠ Prénom requis (minimum 2 car.)    │  ← text-fc-red text-xs
└──────────────────────────────────────┘
```

### Confirm Dialog (before destructive actions)

Animation: fade in + scale up from center.
```
         ┌────────────────────────────────────┐
[overlay]│  ⚠️  Êtes-vous sûr ?               │
         │                                    │
         │  Désactiver Marie Kamga supprimera │
         │  son accès au système.             │
         │  Cette action peut être annulée.   │
         │                                    │
         │         [Annuler]  [Désactiver]    │
         │                   button: fc-red   │
         └────────────────────────────────────┘
```

---

## PAGE 1 — LOGIN

```
┌────────────────────┬────────────────────────────────────────┐
│   GAUCHE (5/12)    │   DROITE (7/12)  bg gradient vert      │
│   bg-white         │                                        │
│                    │                                        │
│  [logo Fish-Cam]   │         [logo Fish-Cam large]          │
│                    │                                        │
│  Accès au système  │    [fish1.svg illustration]            │
│  de gestion.       │                                        │
│                    │    Système de Gestion                  │
│  [error banner]    │    POISSONNERIE LA RÉFÉRENCE           │
│                    │                                        │
│  Téléphone *       │    ┌──────────┐┌──────────┐┌────────┐ │
│  [🇨🇲+237|✆|input]│    │Gestion   ││Suivi des ││Rapports│ │
│                    │    │stocks    ││ventes    ││        │ │
│  Mot de passe *    │    └──────────┘└──────────┘└────────┘ │
│  [🔒|input|👁]    │                                        │
│  [Oublié ?]        │                                        │
│                    │                                        │
│  [Accéder→]        │                                        │
│                    │                                        │
│  © 2026 Fish-Cam   │                                        │
└────────────────────┴────────────────────────────────────────┘
```

---

## PAGE 2 — DASHBOARD (PATRON / SUPER_ADMIN)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔3] [MK] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Marie · Mercredi 25 Avril 2026 · Poissonnerie Akwa     │
├────────────┬────────────┬────────────┬────────────┬────────────┤
│ 📉 Total   │ 👥 Clients │ 🏦 Total   │ ⬆️ Emprunts│ ⬇️ Rembt  │
│   Dettes   │ en dette   │  Épargne   │  du jour   │  du jour  │
│ 485k FCFA  │ 12 clients │ 1.23M FCFA │ 75k FCFA   │ 42k FCFA  │
│ [RED card] │[ORANGE card│[GREEN card]│[YELLOW card│[GREEN card│
└────────────┴────────────┴────────────┴────────────┴────────────┘
│  ⚠️ Marie Kamga -47 500   Paul Biya -8 200   Awa Nguele -2 100  │
│  [Alert ribbon — horizontal scroll — debtors pills]             │
├────────────────────────────────────┬────────────────────────────┤
│  RAPPORT JOURNALIER (col 3/5)      │ NOTIFICATIONS (col 2/5)    │
│ ┌──────────────────────────────┐   │ Notifications récentes      │
│ │ bg-fc-green text-white       │   │ Voir tout →                │
│ │ 📊 Rapport du 24 Avril 2026  │   │                            │
│ ├──────────────────────────────┤   │ 🔴 Marie Kamga dépasse     │
│ │ Transactions :   18          │   │    le seuil · 14:30        │
│ │ Emprunts     : 120 000 FCFA  │   │                            │
│ │ Remboursements:  65 000 FCFA │   │ 📊 Rapport 24 Avril...     │
│ │ Dettes       :  10 clients   │   │    19:00                   │
│ │ ─────────────────────────── │   │                            │
│ │ Solde net : -55 000 FCFA 🔴  │   │ ✅ Paul Biya soldé         │
│ └──────────────────────────────┘   │    son compte · 11:00      │
└────────────────────────────────────┴────────────────────────────┘
```

---

## PAGE 3 — DASHBOARD (CAISSIERE)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔2] [JD] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Jean · Mercredi 25 Avril 2026 · Poissonnerie Akwa      │
├──────────────────────┬──────────────────┬───────────────────────┤
│ 📋 Factures aujourd'│ 💳 Emprunts       │ ✅ Remboursements     │
│    hui               │    aujourd'hui    │    aujourd'hui        │
│    5 factures        │    47 500 FCFA   │    12 000 FCFA        │
│ [source: /factures   │ [source:notifs]  │ [source:notifs]      │
│  ?date=today]        │                  │                       │
└──────────────────────┴──────────────────┴───────────────────────┘
│  ⚠️ Alert ribbon — clients en dette (accessible to CAISSIERE)   │
├──────────────────────────────────────────────────────────────────┤
│  ACTIONS RAPIDES                                                 │
│  [💳 Enregistrer un emprunt]   [✅ Enregistrer remboursement]   │
│  → Opens search for client → then transaction modal             │
├──────────────────────────────────────────────────────────────────┤
│  Notifications récentes                                          │
└──────────────────────────────────────────────────────────────────┘
```

---

## PAGE 4 — DASHBOARD (ENREGISTREUR)

```
┌─────────────────────────────────────────────────────────────────┐
│ TOPBAR: Tableau de bord                    [🔔1] [AB] [▼]       │
├─────────────────────────────────────────────────────────────────┤
│  Bonjour Albert · Mercredi 25 Avril 2026 · Poissonnerie Akwa    │
├─────────────────────────────────────────────────────────────────┤
│  ACTIONS RAPIDES                                                 │
│  [+ Nouvelle Facture]      [+ Nouveau client]                   │
├─────────────────────────────────────────────────────────────────┤
│  Factures du jour (source: GET /factures?poissonnerieId&date)   │
│ ┌──────────────┬───────────────┬───────────┬───────────────┐   │
│ │ Date         │ Fournisseur   │ Nb lignes │ Total achat   │   │
│ ├──────────────┼───────────────┼───────────┼───────────────┤   │
│ │ 25/04/2026   │ Jean Dupont   │ 5         │ 85 000 FCFA   │   │
│ │ 25/04/2026   │ Awa Commerce  │ 3         │ 42 000 FCFA   │   │
│ └──────────────┴───────────────┴───────────┴───────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  Notifications récentes                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 5 — CLIENTS LIST (/clients)

```
┌─────────────────────────────────────────────────────────────────┐
│ Clients (87 au total)                   [+ Nouveau client]      │
├─────────────────────────────────────────────────────────────────┤
│ [ 🔍 Rechercher par nom ou téléphone... ]   [Actifs ▼] [+filtre]│
├──────────────┬───────────┬───────────────┬──────────┬──────────┤
│ Nom          │ Téléphone │ Solde CC      │ Épargne  │ Actions  │
├──────────────┼───────────┼───────────────┼──────────┼──────────┤
│ Marie Kamga  │ 690 123.. │ -47 500 🔴    │ 12 000   │[👁][✏️][💬]│
│ Paul Biya Jr │ 677 456.. │ -2 100 🟠     │ 0        │[👁][✏️][💬]│
│ Awa Nguele   │ 655 789.. │ Soldé 🟢      │ 45 200   │[👁][✏️][💬]│
│ Jean Foko    │ 699 000.. │ -58 000 🔴💥  │ 0        │[👁][✏️][💬]│
│ Suzanne Moto │ 678 111.. │ Soldé 🟢      │ 8 500    │[👁][✏️][💬]│
└──────────────┴───────────┴───────────────┴──────────┴──────────┘
│ Affichage 1-20 de 87 clients        [< 1  2  3  4  5 >]        │
│                                                                  │
│ 🔴💥 = solde dépasse limiteCreditMax (animate-pulse)            │
└─────────────────────────────────────────────────────────────────┘
```

**Action buttons visibility by role :**
```
[👁 Voir]     → all roles
[✏️ Modifier] → SUPER_ADMIN, PATRON, CAISSIERE
[💬 Trans.]   → all roles (but modal will hide certain actions per role)
```

---

## PAGE 6 — CLIENT DETAIL (/clients/:id)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour   Marie Kamga        [ACTIVE 🟢]                       │
│            📞 690 123 456 · Quartier Akwa · Rue des Cocotiers   │
│                                                                  │
│  All roles:     [💳 Emprunter]                                  │
│  CAISSIERE+:    [✅ Rembourser]  [💰 Dépôt]  [💸 Retrait]      │
│  PATRON+:       [✏️ Modifier limite crédit]                     │
│                                                                  │
│  ← If no compte courant: [Ouvrir un compte courant]             │
│  ← If no épargne:        [Ouvrir un compte épargne]             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│ [Compte Courant]      [Épargne]          ← active tab underline │
├─────────────────────────────────────────────────────────────────┤
│ TAB 1 — COMPTE COURANT                                          │
│                                                                  │
│  Solde : -47 500 FCFA 🔴        Limite : 50 000 FCFA            │
│  Statut : [EN_DETTE 🔴]                                          │
│                                                                  │
│ ┌────────────┬───────────────┬──────────────┬─────────────────┐ │
│ │ Date       │ Type          │ Montant      │ Description     │ │
│ ├────────────┼───────────────┼──────────────┼─────────────────┤ │
│ │ 25/04/2026 │ 🔴 DETTE      │ -25 000 FCFA │ Poisson frais  │ │
│ │ 20/04/2026 │ ✅ REMBT      │ +10 000 FCFA │ Versement      │ │
│ │ 15/04/2026 │ 🔴 DETTE      │ -32 500 FCFA │ Achat carpe    │ │
│ └────────────┴───────────────┴──────────────┴─────────────────┘ │
│  Page: 1 of 5  [< 1 2 3 4 5 >]                                 │
├─────────────────────────────────────────────────────────────────┤
│ TAB 2 — ÉPARGNE                                                 │
│                                                                  │
│  Solde épargne : 12 000 FCFA 🟢                                 │
│                                                                  │
│ ┌────────────┬──────────┬──────────────┐                        │
│ │ Date       │ Type     │ Montant      │                        │
│ ├────────────┼──────────┼──────────────┤                        │
│ │ 15/04/2026 │ 💰 DÉPÔT │ +5 000 FCFA  │                       │
│ │ 10/04/2026 │ 💸 RETRAIT│ -2 000 FCFA │                       │
│ │ 05/04/2026 │ 💰 DÉPÔT │ +9 000 FCFA  │                       │
│ └────────────┴──────────┴──────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 7 — FACTURES LIST (/factures)

```
┌─────────────────────────────────────────────────────────────────┐
│ Factures                                  [+ Nouvelle Facture]  │
├─────────────────────────────────────────────────────────────────┤
│ [📅 Date: 25/04/2026]  [Fournisseur ▼]  [Statut: Tous ▼]       │
├───────────┬───────────┬────────┬──────────┬──────────┬─────────┤
│ Date      │Fournisseur│Nb lig. │Total achat│Vente prév│ Actions │
├───────────┼───────────┼────────┼──────────┼──────────┼─────────┤
│ 25/04     │ Jean D.   │ 5      │ 85 500   │ 112 000  │[👁][📄][🔒]│
│ 25/04     │ Awa C.    │ 3      │ 42 000   │  55 000  │[👁][📄]   │
│ 24/04     │ Pierre M. │ 7      │ 120 000  │ 158 000  │[👁][📄]✓ │
└───────────┴───────────┴────────┴──────────┴──────────┴─────────┘
│  ✓ = déjà clôturée   [🔒] = clôturer (PATRON+ only)            │
│  [📄] = Télécharger PDF                                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 8 — FACTURE CREATE (/factures/new) — SPLIT SCREEN

```
┌──────────────────────────┬─────────────────────────────────────┐
│   FORMULAIRE (40%)       │   APERÇU EN DIRECT (60%)            │
│                          │                                     │
│  Date *                  │  ┌───────────────────────────────┐  │
│  [25/04/2026   📅]       │  │  🐟 FISH-CAM                 │  │
│                          │  │  Poissonnerie La Référence    │  │
│  Fournisseur *           │  │  Nkongsamba · Cameroun        │  │
│  [Jean Dupont      ▼]    │  ├───────────────────────────────┤  │
│                          │  │  Facture d'achat              │  │
│  Livreur (optionnel)     │  │  Date : 25 Avril 2026         │  │
│  [Dernier: Ali M.  ▼]    │  │  Fournisseur : Jean Dupont    │  │
│                          │  │  Livreur : Ali Moussa         │  │
│  ─── PRODUITS ────────   │  ├─────────┬─────┬──────┬───────┤  │
│  [🔍 Chercher produit..] │  │ Produit │ Qté │ Prix │ Total │  │
│   └─ dropdown résultats  │  ├─────────┼─────┼──────┼───────┤  │
│                          │  │ Carpe   │  5  │12 000│60 000 │  │
│  ┌── Ligne 1 ──────────┐ │  │ Tilapia │  3  │ 8 500│25 500 │  │
│  │ Carpe        [×]    │ │  │ Silure  │  2  │15 000│30 000 │  │
│  │ Qté cartons: [  5 ] │ │  ├─────────┴─────┴──────┴───────┤  │
│  │ Prix/carton:[12 000]│ │  │ Total achats :  115 500 FCFA  │  │
│  │ Poids kg:   [ 30  ] │ │  │ Total vente  :  153 200 FCFA  │  │
│  │ Prix/kg:    [  500 ]│ │  │ Bénéfice prév:   37 700 FCFA 🟢│ │
│  │ = 60 000 FCFA [≡]  │ │  └───────────────────────────────┘  │
│  └────────────────────┘ │                                     │
│                          │                                     │
│  [+ Ajouter une ligne]   │                                     │
│                          │                                     │
│  [❌ Annuler] [💾 Sauver]│                                     │
└──────────────────────────┴─────────────────────────────────────┘
```

**Product autocomplete dropdown :**
```
  [🔍 car                              ]
  ┌─────────────────────────────────────┐
  │ 🐟 Carpe (Poisson)    → sélectionner│
  │ 📦 Carton vide        → sélectionner│
  │ 🐟 Carpe fumée        → sélectionner│
  └─────────────────────────────────────┘
  On click → GET /lignes/dernier-prix → auto-fill prix
```

---

## PAGE 9 — FACTURE DETAIL (/factures/:id)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Retour   Facture #42 · 25 Avril 2026   [🟡 OUVERTE]          │
│            Jean Dupont · Livreur: Ali Moussa                    │
│                                      [📄 PDF]  [🔒 Clôturer]   │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────┬─────────────┬───────┬────────┬────────┬───────────┐ │
│ │ Produit │ Qté cartons │ Prix  │ Montant│ Poids  │ Vente/kg  │ │
│ ├─────────┼─────────────┼───────┼────────┼────────┼───────────┤ │
│ │ Carpe   │      5      │12 000 │60 000  │  30 kg │    500    │ │
│ │ Tilapia │      3      │ 8 500 │25 500  │  18 kg │    600    │ │
│ └─────────┴─────────────┴───────┴────────┴────────┴───────────┘ │
├──────────────────────────────────┬──────────────────────────────┤
│ Total achats :     85 500 FCFA   │ Total vente prév: 112 000    │
│                                  │ Bénéfice prév :   26 500 🟢  │
└──────────────────────────────────┴──────────────────────────────┘
```

---

## PAGE 10 — TRANSACTIONS (/transactions)

```
┌─────────────────────────────────────────────────────────────────┐
│ Journal des Transactions                                        │
├─────────────────────────────────────────────────────────────────┤
│ [📅 25/04/2026]  [Type: Tous ▼]  [🔍 Client...]                │
├──────────────┬──────────────────┬──────────────┬───────────────┤
│ Date / Heure │ Client           │ Type         │ Montant       │
├──────────────┼──────────────────┼──────────────┼───────────────┤
│ 25/04 14:32  │ Marie Kamga      │ 🔴 DETTE     │ -25 000 FCFA  │
│ 25/04 11:15  │ Paul Biya Jr     │ ✅ REMBT     │ +10 000 FCFA  │
│ 25/04 09:40  │ Awa Nguele       │ 💰 DÉPÔT     │  +5 000 FCFA  │
│ 24/04 16:00  │ Suzanne Moto     │ 💸 RETRAIT   │  -2 000 FCFA  │
└──────────────┴──────────────────┴──────────────┴───────────────┘
│ 1-20 de 342 transactions             [< 1 2 3 ... 18 >]        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 11 — DETTES (/dettes) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Comptes en Dépassement · 12 clients         [Tri: + endetté ▼] │
├─────────────────────────────────────────────────────────────────┤
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🔴 Marie Kamga          📞 690 123 456                     │ │
│  │    Dette : -47 500 FCFA  /  Limite : 50 000 FCFA          │ │
│  │    Progression : ████████████████████ 95%                  │ │
│  │    [✅ Remboursement rapide]    [👁 Voir compte complet]   │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 🟠 Paul Biya Jr         📞 677 456 789                     │ │
│  │    Dette : -8 200 FCFA  /  Limite : 50 000 FCFA           │ │
│  │    Progression : ████░░░░░░░░░░░░░░░░░ 16%                 │ │
│  │    [✅ Remboursement rapide]    [👁 Voir compte complet]   │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 12 — CLÔTURE JOURNALIÈRE (/cloture) — PATRON + SUPER_ADMIN

```
STEP 1 — Sélection
┌─────────────────────────────────────────────────────────────────┐
│ Clôture Journalière                                             │
├─────────────────────────────────────────────────────────────────┤
│  Poissonnerie : [La Référence - Akwa          ▼]               │
│  Date         : [25/04/2026                  📅]               │
│                                                                 │
│                          [Préparer →]                           │
└─────────────────────────────────────────────────────────────────┘

STEP 2 — Résumé + Formulaire (after GET /clotures/preparer)
┌─────────────────────────────────────────────────────────────────┐
│ Clôture du 25 Avril 2026 · La Référence                        │
├─────────────────────────────────────────────────────────────────┤
│  RÉSUMÉ JOURNÉE (lecture seule)                                 │
│  Emprunts du jour         :   120 000 FCFA                     │
│  Remboursements du jour   :    65 000 FCFA                     │
│  Total ventes prévisibles :   153 000 FCFA                     │
│  Nombre de factures       :   5                                 │
├─────────────────────────────────────────────────────────────────┤
│  SAISIE CAISSE                                                  │
│  Fonds de caisse initial  : [________________] FCFA            │
│  Argent en caisse réel    : [________________] FCFA            │
│  Dépense ration           : [________________] FCFA            │
│  Dépense transport        : [________________] FCFA            │
│  Autres dépenses          : [________________] FCFA            │
│  Description autres        : [________________________________] │
│                                                                 │
│  Écart de caisse (calculé): = Réel - Initial - Dépenses        │
│  ÉCART : -12 500 FCFA 🔴                                        │
│                                                                 │
│  [← Retour]                    [⚠️ Clôturer la journée]        │
│                                    → opens confirm-dialog       │
└─────────────────────────────────────────────────────────────────┘

HISTORIQUE (below, from GET /clotures/historique)
┌────────────┬──────────┬──────────┬───────────┬────────────────┐
│ Date       │ Fonds CC │ Réel CC  │ Écart     │ Actions        │
├────────────┼──────────┼──────────┼───────────┼────────────────┤
│ 24/04/2026 │ 50 000   │ 37 500   │ -12 500 🔴│ [👁 Voir]      │
│ 23/04/2026 │ 50 000   │ 52 000   │ +2 000 🟢 │ [👁 Voir]      │
└────────────┴──────────┴──────────┴───────────┴────────────────┘
```

---

## PAGE 13 — BILANS (/bilans) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Bilan Mensuel              [Poissonnerie: La Référence ▼]       │
│                            [Mois: Avril ▼] [Année: 2026 ▼]    │
├──────────────────┬──────────────────┬──────────────────────────┤
│ 💰 Total Achats  │ 💵 Total Ventes  │ 📈 Bénéfice Brut         │
│  1 840 000 FCFA  │  2 430 000 FCFA  │    590 000 FCFA 🟢       │
├──────────────────┼──────────────────┼──────────────────────────┤
│ 📉 Total Dettes  │ ✅ Remboursements│ 💸 Dépenses totales      │
│  485 000 FCFA    │  320 000 FCFA    │    142 000 FCFA          │
├──────────────────┴──────────────────┴──────────────────────────┤
│ BÉNÉFICE NET : 448 000 FCFA 🟢                                  │
├─────────────────────────────────────────────────────────────────┤
│ COMPARAISON DES BOUTIQUES (SUPER_ADMIN — GET /bilans/comparaison)│
│  Boutique        │ Achats    │ Ventes   │ Bénéfice              │
│  La Référence    │ 1 840 000 │ 2 430 000│ 590 000 🟢            │
│  Bonamoussadi    │ 1 200 000 │ 1 580 000│ 380 000 🟢            │
│  Ndokoti         │   980 000 │ 1 150 000│ 170 000 🟡            │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 14 — STATISTIQUES (/statistiques) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Statistiques · La Référence                    [Global ▼]       │
├──────────────┬──────────────┬──────────────┬───────────────────┤
│ 👥 Clients   │ 💰 Épargne   │ 🏦 Moy.épar. │ 📉 En dette      │
│ 87 clients   │ 1.23M FCFA   │ 14 138 FCFA  │ 12 clients       │
└──────────────┴──────────────┴──────────────┴───────────────────┘
│  REVENUS MENSUELS (bar chart from revenueMensuel[])             │
│  Jan  Fév  Mar  Avr  Mai  Juin Juil Août Sep  Oct  Nov  Déc    │
│  ██   ██   ██   ████ ░░   ░░   ░░   ░░   ░░   ░░   ░░   ░░   │
├────────────────────────────────┬────────────────────────────────┤
│  TOP 5 DÉBITEURS               │  TOP 5 PRODUITS                │
│  Marie Kamga    -47 500 FCFA   │  Carpe      45 cartons         │
│  Paul Biya Jr    -8 200 FCFA   │  Tilapia    38 cartons         │
│  Awa Nguele      -2 100 FCFA   │  Silure     22 cartons         │
└────────────────────────────────┴────────────────────────────────┘
```

---

## PAGE 15 — NOTIFICATIONS (/notifications)

```
┌─────────────────────────────────────────────────────────────────┐
│ Notifications                     [✅ Tout marquer comme lu]    │
├─────────────────────────────────────────────────────────────────┤
│ [Tous (8)] [🔴 ALERTE (3)] [✅ SOLDE (2)] [📊 RAPPORT (1)] [ℹ️]│
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 🔴│ COMPTE_COURANT_ALERTE          25/04/2026 14:30 🟢  │   │
│ │   │ Marie Kamga dépasse le seuil (-47 500 FCFA)          │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ 📊│ RAPPORT_JOURNALIER             24/04/2026 19:00      │   │
│ │   │ 📊 Rapport du 24 Avril 2026                          │   │
│ │   │ Transactions : 18 · Emprunts : 120 000 FCFA...       │   │
│ ├──────────────────────────────────────────────────────────┤   │
│ │ ✅│ COMPTE_SOLDE                   23/04/2026 11:00      │   │
│ │   │ Paul Biya Jr a soldé son compte courant              │   │
│ └──────────────────────────────────────────────────────────┘   │
│ [< 1  2  3 >]                                                   │
│ 🟢 = non lu                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 16 — LIVREURS (/livreurs)

```
┌─────────────────────────────────────────────────────────────────┐
│ Livreurs                                     [+ Nouveau]        │
├──────────────┬──────────────┬────────────┬────────┬────────────┤
│ Nom          │ Téléphone    │ Véhicule   │ Statut │ Actions    │
├──────────────┼──────────────┼────────────┼────────┼────────────┤
│ Ali Moussa   │ 690 111 222  │ Moto Benin │ [● ACT]│[★ Eval][⏸]│
│ Jean Pierre  │ 677 333 444  │ Vélo       │ [○ INR]│[★ Eval][▶]│
└──────────────┴──────────────┴────────────┴────────┴────────────┘
│ [●] = actif (green toggle)   [○] = inactif (gray toggle)        │
│ [★ Eval] = opens evaluation modal                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 17 — PRODUITS (/produits)

```
┌─────────────────────────────────────────────────────────────────┐
│ Produits                    [🔍 Rechercher...]    [+ Nouveau]   │
├──────────────────┬────────────────┬──────────────┬─────────────┤
│ Nom              │ Catégorie      │ Poids/Carton │ Actions     │
├──────────────────┼────────────────┼──────────────┼─────────────┤
│ Carpe            │ Poisson frais  │ 20 kg        │[✏️][🗑️]    │
│ Tilapia          │ Poisson frais  │ 15 kg        │[✏️][🗑️]    │
│ Silure fumé      │ Poisson fumé   │ 10 kg        │[✏️][🗑️]    │
└──────────────────┴────────────────┴──────────────┴─────────────┘
```

---

## PAGE 18 — FOURNISSEURS (/fournisseurs)

```
┌─────────────────────────────────────────────────────────────────┐
│ Fournisseurs                                       [+ Nouveau]  │
├─────────────────────────┬────────────────┬────────┬────────────┤
│ Nom                     │ Téléphone      │ Ville  │ Actions    │
├─────────────────────────┼────────────────┼────────┼────────────┤
│ Jean Dupont Commerce    │ 690 555 777    │ Douala │[✏️][🗑️]   │
│ Awa Commerce Générale   │ 677 888 999    │ Yaoundé│[✏️][🗑️]   │
└─────────────────────────┴────────────────┴────────┴────────────┘
```

---

## PAGE 19 — POISSONNERIES (/poissonneries) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Poissonneries                                      [+ Nouveau]  │
├───────────────────┬──────────────┬────────────┬────────┬───────┤
│ Nom               │ Adresse      │ Téléphone  │ Active │Actions│
├───────────────────┼──────────────┼────────────┼────────┼───────┤
│ La Référence Akwa │ Rue Akwa     │ 233 42..   │ ● ACT  │[✏️][🗑️]│
│ Bonamoussadi      │ Carrefour... │ 233 43..   │ ● ACT  │[✏️][🗑️]│
│ Ndokoti Market    │ Marché...    │ 233 44..   │ ○ INA  │[✏️][▶]│
└───────────────────┴──────────────┴────────────┴────────┴───────┘
│ [🗑️] = SUPER_ADMIN only                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 20 — ÉQUIPE (/equipe) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Équipe                                         [+ Nouveau]      │
├──────────────┬───────────────┬────────────┬───────────┬────────┤
│ Prénom/Nom   │ Téléphone     │ Rôle       │ Boutique  │Actions │
├──────────────┼───────────────┼────────────┼───────────┼────────┤
│ Marie Kamga  │ 690 123 456   │ [CAISSIÈRE]│ La Réf.   │[✏️][🗑️]│
│ Jean Foko    │ 677 456 789   │[ENREGISTR.]│ La Réf.   │[✏️][🗑️]│
│ Pierre Ndo   │ 655 789 012   │ [PATRON]   │ Bonams.   │[✏️]    │
└──────────────┴───────────────┴────────────┴───────────┴────────┘
│ PATRON(yellow) CAISSIERE(green) ENREGISTREUR(gray)             │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 21 — AUDIT LOGS (/audit) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Journal d'Audit (lecture seule)                                 │
├──────────────┬───────────┬──────────┬────────────┬─────────────┤
│ Date         │ Action    │ Entité   │ Utilisateur│ Détails     │
├──────────────┼───────────┼──────────┼────────────┼─────────────┤
│ 25/04 14:32  │ CREATE    │ Client   │ M. Kamga   │ id=42       │
│ 25/04 14:30  │ EMPRUNT   │ CC       │ M. Kamga   │ 25000 FCFA  │
│ 25/04 11:15  │ UPDATE    │ Client   │ Admin      │ id=38       │
└──────────────┴───────────┴──────────┴────────────┴─────────────┘
│ [< 1 2 3 ... 48 >]                                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 22 — SAUVEGARDE (/backup) — All roles

```
┌─────────────────────────────────────────────────────────────────┐
│ Sauvegardes de la Base de Données                              │
├────────────────────────────────┬────────────────────────────────┤
│  📱 TELEGRAM                   │  📧 EMAIL                      │
│  Dernière : 22/04/2026 02:00   │  Dernière : 01/04/2026 03:00   │
│  Statut : ✅ OK                │  Statut : ⚠️ Retard 24j        │
│                                │                                │
│  [📤 Envoyer maintenant]       │  [📤 Envoyer maintenant]       │
└────────────────────────────────┴────────────────────────────────┘
│  ⚠️ Banner if backup missed: "Sauvegarde manquée - Envoyez"    │
└─────────────────────────────────────────────────────────────────┘
```

---

## PAGE 23 — RÉCAPITULATIF (/recapitulatifs) — PATRON + SUPER_ADMIN

```
┌─────────────────────────────────────────────────────────────────┐
│ Récapitulatif des Ventes                                        │
├─────────────────────────────────────────────────────────────────┤
│ Poissonnerie : [La Référence ▼]                                │
│ Période      : Du [01/04/2026] Au [30/04/2026]                 │
│                                                                 │
│                   [Générer le récapitulatif]                    │
├─────────────────────────────────────────────────────────────────┤
│  (result after generation)                                      │
│  Total achats    : 7 840 000 FCFA                              │
│  Total ventes    : 10 430 000 FCFA                             │
│  Nb factures     : 42                                          │
│                                                                 │
│                         [📄 Télécharger PDF]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ALL MODALS SUMMARY

```
┌─────────────────────────────────┬──────────────────────────────────────────────┐
│ MODAL                           │ TRIGGER + ENDPOINT                           │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Emprunt                         │ [Emprunter] on client detail                 │
│                                 │ → POST /comptes-courants/emprunts             │
│                                 │ Fields: montant*, description*               │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Remboursement                   │ [Rembourser] on client detail / dettes        │
│                                 │ → POST /comptes-courants/remboursements       │
│                                 │ Fields: montant* (max=|solde|)               │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Dépôt Épargne                   │ [Dépôt] on client detail                     │
│                                 │ → POST /epargnes/depot                        │
│                                 │ Fields: montant* (no max)                    │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Retrait Épargne                 │ [Retrait] on client detail                   │
│                                 │ → POST /epargnes/retrait                      │
│                                 │ Fields: montant* (max=currentBalance)        │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Transfert Épargne → CC          │ [Transférer épargne] on client detail        │
│                                 │ → POST /comptes-courants/transfert-epargne    │
│                                 │ Fields: montant* (max=epargne balance)       │
│                                 │ Roles: SUPER_ADMIN, PATRON, CAISSIERE         │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Modifier limite crédit          │ [✏️ Limite] on client detail                 │
│                                 │ → PUT /comptes-courants/{id}/limite-credit    │
│                                 │ Fields: nouvelleLimite*                      │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Évaluation Livreur              │ [★ Eval] on livreurs list                    │
│                                 │ → POST /evaluations                           │
│                                 │ Fields: livreurId, achatId,                  │
│                                 │         noteRespectPoids(1-5),               │
│                                 │         noteQualite(1-5), commentaire        │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Clôturer Facture (confirm)      │ [🔒 Clôturer] on factures                   │
│                                 │ → PUT /factures/{id}/cloturer                 │
│                                 │ "Cette action est irréversible"              │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Clôture Journée (confirm)       │ On clôture form submission                   │
│                                 │ → POST /clotures                              │
│                                 │ "IRRÉVERSIBLE - Confirmer?"                  │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Désactiver Client (confirm)     │ [🗑️] on clients list                        │
│                                 │ → DELETE /clients/{id}                        │
│                                 │ Roles: SUPER_ADMIN, PATRON                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Changer mot de passe            │ Profile menu → "Changer MDP"                │
│                                 │ → PUT /auth/change-password                   │
│                                 │ Fields: ancienMdp*, nouveauMdp*,             │
│                                 │         confirmerMdp*                        │
│                                 │ Roles: ALL                                   │
├─────────────────────────────────┼──────────────────────────────────────────────┤
│ Réinitialiser MDP (admin)       │ [✏️] on équipe → "Réinitialiser MDP"        │
│                                 │ → PUT /auth/reset-password                    │
│                                 │ Fields: userId, nouveauMdp*                  │
│                                 │ Roles: PATRON, SUPER_ADMIN                   │
└─────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## ALL SLIDE-OVERS SUMMARY

```
┌───────────────────────┬──────────────────────────────────────────┐
│ SLIDE-OVER            │ FIELDS + ENDPOINT                        │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ firstName*, lastName*, phone*, quartier*, │
│ Client                │ address (optional)                       │
│                       │ CREATE → POST /clients                   │
│                       │ EDIT   → PUT  /clients/{id}              │
│                       │ Roles: ALL (edit: SUPER_ADMIN,PATRON,CC) │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, telephone*, ville*                  │
│ Fournisseur           │ CREATE → POST /fournisseurs              │
│                       │ EDIT   → PUT  /fournisseurs/{id}         │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, telephone*, vehicule*               │
│ Livreur               │ CREATE → POST /livreurs                  │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ nom*, categorie*, poidsParCarton*,        │
│ Produit               │ alerteStock*                             │
│                       │ CREATE → POST /produits                  │
│                       │ EDIT   → PUT  /produits/{id}             │
│                       │ Roles: ALL                               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ name*, address*, phone*,                  │
│ Poissonnerie          │ fondDeCaisseDefaut*, loyer*              │
│                       │ CREATE → POST /poissonneries             │
│                       │ EDIT   → PUT  /poissonneries/{id}        │
│                       │ Roles: SUPER_ADMIN, PATRON               │
├───────────────────────┼──────────────────────────────────────────┤
│ Nouveau / Modifier    │ firstName*, lastName*, phone*,            │
│ Employé               │ role* (select), poissonnerieId*,         │
│                       │ password* (create only)                  │
│                       │ CREATE → POST /employes                  │
│                       │ EDIT   → PUT  /employes/{id}             │
│                       │ Roles: SUPER_ADMIN, PATRON               │
└───────────────────────┴──────────────────────────────────────────┘
```

---

## MODAL — ÉVALUATION LIVREUR

```
    ┌────────────────────────────────────────────────┐
    │  Évaluer Ali Moussa                       [×]  │
    ├────────────────────────────────────────────────┤
    │                                                │
    │  Facture associée                              │
    │  [Facture du 25/04 - Jean Dupont         ▼]   │
    │                                                │
    │  Respect du poids (1 à 5) *                   │
    │  ☆ ☆ ☆ ☆ ☆  ← star rating interactive        │
    │                                                │
    │  Qualité du poisson (1 à 5) *                 │
    │  ☆ ☆ ☆ ☆ ☆                                    │
    │                                                │
    │  Commentaire                                   │
    │  ┌──────────────────────────────────────────┐  │
    │  │ Poids conforme, poisson en bon état...   │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    ├────────────────────────────────────────────────┤
    │       [Annuler]    [Soumettre l'évaluation]    │
    └────────────────────────────────────────────────┘
```

---

## MODAL — MODIFIER LIMITE DE CRÉDIT

```
    ┌────────────────────────────────────────────────┐
    │  Modifier la limite de crédit             [×]  │
    ├────────────────────────────────────────────────┤
    │                                                │
    │  ┌──────────────────────────────────────────┐  │
    │  │  Client : Marie Kamga                    │  │
    │  │  Limite actuelle : 50 000 FCFA           │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    │  Nouvelle limite (FCFA) *                      │
    │  ┌──────────────────────────────────────────┐  │
    │  │ 75 000                                   │  │
    │  └──────────────────────────────────────────┘  │
    │                                                │
    ├────────────────────────────────────────────────┤
    │        [Annuler]    [Modifier la limite]       │
    │                      button: bg-fc-green       │
    └────────────────────────────────────────────────┘
```

---

## MODAL — CHANGER MOT DE PASSE

```
    ┌────────────────────────────────────────────────┐
    │  Changer mon mot de passe                 [×]  │
    ├────────────────────────────────────────────────┤
    │  Ancien mot de passe *                         │
    │  [••••••••                            👁]      │
    │                                                │
    │  Nouveau mot de passe *                        │
    │  [••••••••                            👁]      │
    │                                                │
    │  Confirmer le nouveau *                        │
    │  [••••••••                            👁]      │
    │  ← error if not matching                       │
    ├────────────────────────────────────────────────┤
    │      [Annuler]    [Modifier le mot de passe]   │
    └────────────────────────────────────────────────┘
```

---

## LOADING STATES (on every list/page)

```
SKELETON (while loading)              EMPTY STATE (no data)
┌──────────────────────────────┐      ┌──────────────────────────────┐
│ ████████████ ░░░░ ████████   │      │                              │
│ ████████ ░░░░░░░░ ██████     │      │        [icon Users]          │
│ ██████████ ░░░░ ████████     │      │                              │
│ ████████ ░░░░░░░░ ██████     │      │   Aucun client trouvé        │
│ ██████████ ░░░░ ████████     │      │   pour cette boutique        │
└──────────────────────────────┘      │                              │
  animated shimmer gray bars           │   [+ Créer le premier]      │
                                       └──────────────────────────────┘

ERROR STATE
┌──────────────────────────────┐
│                              │
│      [icon AlertTriangle]    │
│                              │
│  Impossible de charger       │
│  les données.                │
│                              │
│      [↺ Réessayer]           │
└──────────────────────────────┘
```

---

## TOPBAR NOTIFICATION DROPDOWN

```
                          ┌──────────────────────────────────────┐
                          │ Notifications           [Voir tout]  │
                          ├──────────────────────────────────────┤
                          │ 🟢 Marie Kamga dépasse le seuil      │
                          │    25/04/2026 14:30                  │
                          ├──────────────────────────────────────┤
                          │    📊 Rapport du 24 Avril            │
                          │    24/04/2026 19:00                  │
                          ├──────────────────────────────────────┤
                          │ 🟢 Paul Biya Jr soldé son compte     │
                          │    23/04/2026 11:00                  │
                          ├──────────────────────────────────────┤
                          │  [Voir toutes les notifications]     │
                          └──────────────────────────────────────┘
  🟢 = unread dot   click notification → mark as read → close dropdown
```



## IMAGE 1 — FICHE D'ÉPARGNE (Physical document decoded)
GIC FNJLCP · FISH-CAM · Poissonnerie La Référence
FICHE D'ÉPARGNE N°003/25
Client: MAYWEGHUA LTETMBOUG SAMARING · Tél: 674 52 18 14
Table: Date | Retrait | Versement | Solde | Solde en lettres | Signature

INTERFACE 1 — PAGE DÉTAIL ÉPARGNE (/clients/:id → Tab Épargne)
```
┌─────────────────────────────────────────────────────────────────────┐
│ ← Retour    Marie Kamga                              [ACTIVE 🟢]    │
│             📞 674 52 18 14 · Quartier Akwa                         │
├─────────────────────────────────────────────────────────────────────┤
│  [Compte Courant]        **[Épargne]**        ← active tab          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  **COMPTE ÉPARGNE**                   N° Fiche : 003/25            │
│  ─────────────────────────────────────────────────────────          │
│                                                                     │
│  ┌──────────────┬───────────────┬───────────────────────────────┐  │
│  │              │               │   **Solde actuel**            │  │
│  │              │               │   47 000 FCFA 🟢              │  │
│  │              │               │                               │  │
│  │  [💰 Dépôt] │ [💸 Retrait]  │   [📄 Télécharger Fiche PDF] │  │
│  └──────────────┴───────────────┴───────────────────────────────┘  │
│                                                                     │
│  **Historique des Mouvements**                                      │
│  ─────────────────────────────────────────────────────────          │
│                                                                     │
│ ┌──────────────┬────────────────┬────────────────┬────────────────┐ │
│ │ **Date**     │ **Retrait**    │ **Versement**  │ **Solde**      │ │
│ ├──────────────┼────────────────┼────────────────┼────────────────┤ │
│ │ 19/06/2025   │ —              │ +13 000 FCFA🟢 │ 13 000 FCFA    │ │
│ │ 25/06/2025   │ —              │ +10 000 FCFA🟢 │ 23 000 FCFA    │ │
│ │ 02/07/2025   │ -5 000 FCFA 🔴 │ —              │ 18 000 FCFA    │ │
│ │ 15/07/2025   │ —              │ +20 000 FCFA🟢 │ 38 000 FCFA    │ │
│ │ 01/08/2025   │ —              │  +9 000 FCFA🟢 │ 47 000 FCFA    │ │
│ └──────────────┴────────────────┴────────────────┴────────────────┘ │
│  Page 1 sur 3                              [< Précédent  Suivant >] │
│                                                                     │
│  ─────────────────────────────────────────────────────────          │
│  **Solde Total : 47 000 FCFA**   Nombre de mouvements : 14          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

Color rules for movements :
Versement (Dépôt)  → +montant  bg-fc-green-light  text-fc-green   🟢
Retrait            → -montant  bg-fc-red-light    text-fc-red     🔴
Solde positif      → text-fc-green  font-bold
Solde zéro         → text-gray-500

## MODAL — Faire un Dépôt (Versement)
```
         ┌────────────────────────────────────────────┐
         │  💰 Faire un Versement / Dépôt        [×]  │
         ├────────────────────────────────────────────┤
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │  Client : Marie Kamga                │  │
         │  │  N° Fiche : 003/25                   │  │
         │  │  Solde actuel : 47 000 FCFA 🟢       │  │
         │  └──────────────────────────────────────┘  │
         │                                            │
         │  Montant du versement (FCFA) *             │
         │  ┌──────────────────────────────────────┐  │
         │  │ 10 000                               │  │
         │  └──────────────────────────────────────┘  │
         │  ← Pas de maximum (versement libre)        │
         │                                            │
         │  Nouveau solde après dépôt :               │
         │  **57 000 FCFA** ← calculated in real-time │
         │                                            │
         ├────────────────────────────────────────────┤
         │      [Annuler]    [✅ Confirmer le dépôt]  │
         │                    button: bg-fc-green     │
         └────────────────────────────────────────────┘
```

## MODAL — Faire un Retrait
```
         ┌────────────────────────────────────────────┐
         │  💸 Faire un Retrait                  [×]  │
         ├────────────────────────────────────────────┤
         │                                            │
         │  ┌──────────────────────────────────────┐  │
         │  │  Client : Marie Kamga                │  │
         │  │  N° Fiche : 003/25                   │  │
         │  │  Solde actuel : 47 000 FCFA 🟢       │  │
         │  └──────────────────────────────────────┘  │
         │                                            │
         │  Montant du retrait (FCFA) *               │
         │  ┌──────────────────────────────────────┐  │
         │  │ 5 000                                │  │
         │  └──────────────────────────────────────┘  │
         │  Maximum : **47 000 FCFA** (solde actuel)  │
         │                                            │
         │  Nouveau solde après retrait :             │
         │  **42 000 FCFA** ← calculated in real-time │
         │                                            │
         │  ⚠️ Retrait impossible si solde < montant  │
         │                                            │
         ├────────────────────────────────────────────┤
         │      [Annuler]   [💸 Confirmer le retrait] │
         │                   button: bg-fc-orange     │
         └────────────────────────────────────────────┘
```

## IMAGE 2 — INVENTAIRE MENSUEL DÉCEMBRE 2025 (Physical document decoded)
FISH-CAM · POISSONNERIE LA REFERENCE · AGENCE NKONGSAMBA II LELE
INVENTAIRE MOIS DE DECEMBRE 2025
Columns: DATE | MONTANT ACHAT | VENTE PREVISIBLE | VENTE REALISEE
28 rows (daily entries) + TOTAL(FCFA) at bottom

## INTERFACE 2 — PAGE RÉCAPITULATIF (/recapitulatifs)
```
┌─────────────────────────────────────────────────────────────────────┐
│ **Récapitulatif Mensuel**                                           │
├─────────────────────────────────────────────────────────────────────┤
│  Poissonnerie : [La Référence - Nkongsamba      ▼]                 │
│  Mois         : [Décembre                       ▼]                 │
│  Année        : [2025                           ▼]                 │
│                                                                     │
│                    [📊 Générer le Récapitulatif]                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  **INVENTAIRE MOIS DE DÉCEMBRE 2025**                              │
│  Poissonnerie La Référence · Agence Nkongsamba II Lélé             │
│                                                                     │
│  ─── KPI SUMMARY ─────────────────────────────────────────         │
│                                                                     │
│  ┌──────────────┬──────────────┬──────────────┬───────────────┐   │
│  │ Total Achats │ Vente Prév.  │ Vente Réal.  │ Bénéfice Réel │   │
│  │ 4 285 250    │ 5 042 600    │ 4 718 000    │ +432 750 🟢   │   │
│  │ FCFA         │ FCFA         │ FCFA         │ FCFA          │   │
│  └──────────────┴──────────────┴──────────────┴───────────────┘   │
│                                                                     │
│  ─── TABLEAU JOURNALIER ───────────────────────────────────────    │
│                                                                     │
│ ┌──────┬───────────────┬────────────────┬────────────────┬───────┐ │
│ │**Jn**│**Mont. Achat**│**Vente Prév.** │**Vente Réal.** │**Marge│ │
│ ├──────┼───────────────┼────────────────┼────────────────┼───────┤ │
│ │  1   │  178 000      │  193 900       │  183 500       │ +5 500│ │
│ │  2   │  232 500      │  456 300       │  167 500       │-65 000│ │
│ │  3   │  230 250      │  253 250       │  162 500       │-67 750│ │
│ │  4   │  127 000      │  139 400       │  192 300       │+65 300│ │
│ │  5   │  143 750      │  156 900       │  165 500       │+21 750│ │
│ │  6   │  175 500      │  190 500       │  236 500       │+61 000│ │
│ │  7   │  210 000      │  259 500       │  169 500       │-40 500│ │
│ │  8   │  125 000      │  135 000       │  183 500       │+58 500│ │
│ │  9   │  147 500      │  156 500       │  173 500       │+26 000│ │
│ │  10  │  247 750      │  266 000       │  202 500       │-45 250│ │
│ │  11  │  151 000      │  161 500       │  162 500       │+11 500│ │
│ │  12  │  237 000      │  257 000       │  162 500       │-74 500│ │
│ │  13  │   95 500      │  101 500       │  151 500       │+56 000│ │
│ │  14  │  105 500      │  110 500       │  145 500       │+40 000│ │
│ │  15  │  180 750      │  198 000       │  189 500       │ +8 750│ │
│ │  16  │  135 500      │  149 500       │  153 500       │+18 000│ │
│ │  17  │  173 500      │  186 000       │  147 500       │-26 000│ │
│ │  18  │  146 500      │  161 000       │  147 500       │ +1 000│ │
│ │  19  │  192 000      │  208 500       │  187 500       │ -4 500│ │
│ │  20  │  160 000      │  172 500       │  171 500       │+11 500│ │
│ │  21  │  155 750      │  148 800       │  135 800       │-19 950│ │
│ │  22  │  102 000      │  108 000       │  160 500       │+58 500│ │
│ │  23  │  184 000      │  196 000       │  158 500       │-25 500│ │
│ │  24  │  397 500      │  427 000       │  429 500       │+32 000│ │
│ │  25  │  142 500      │  151 000       │  170 500       │+28 000│ │
│ │  26  │  104 500      │  115 000       │  105 000       │   500 │ │
│ │  27  │  126 800      │  138 500       │  141 500       │+14 700│ │
│ ├──────┼───────────────┼────────────────┼────────────────┼───────┤ │
│ │**TOT**│**4 285 250** │**5 042 600**   │**4 718 000**   │**+432 │ │
│ │      │  FCFA        │  FCFA          │  FCFA          │ 750** │ │
│ └──────┴───────────────┴────────────────┴────────────────┴───────┘ │
│                                                                     │
│  ─── ANALYSE ─────────────────────────────────────────────────     │
│                                                                     │
│  Jours bénéficiaires : **18 / 27**   (🟢 Vente Réal. > Achat)     │
│  Meilleur jour       : **Jour 24**   → +32 000 FCFA bénéfice      │
│  Pire jour           : **Jour 12**   → -74 500 FCFA de perte      │
│  Taux réalisation    : **93.6%**     (Réal. / Prévisible)          │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                   [📄 Télécharger PDF]    [📊 Exporter Excel]       │
│               → GET /exports/recapitulatif/pdf                     │
└─────────────────────────────────────────────────────────────────────┘

```
Marge column color rules :
Marge positive  → text-fc-green   ← Vente réalisée > Achat
Marge négative  → text-fc-red     ← Vente réalisée < Achat
Marge = 0       → text-gray-500

## PDF EXPORT — Fiche d'Épargne (matches physical document)
```
┌─────────────────────────────────────────────────────────────────────┐
│                        **GIC FNJLCP**                              │
│         FORCE NATIONALE DES JEUNES POUR LA LUTTE CONTRE            │
│                        LA PAUVRETE                                  │
│              Siège : FISH-CAM (Poissonnerie la Référence)          │
│              Tél : 676.02.88.00 / 699.02.58.64                     │
│                                                                     │
│              **FICHE D'ÉPARGNE N°____ / 25**                       │
├──────────────────────────────────────────────────────────────────── │
│  Nom  : ________________________________                            │
│  Prénom : ________________________________                          │
│  CNI N° : ________________________________  Tél : _______________  │
├──────┬─────────────┬─────────────┬──────────┬───────────┬─────────┤
│      │  **Retrait**│**Versement**│ **Solde**│ Solde en  │Sign.    │
│**Dt**│  withdrawal │   Deposit   │ Balance  │ lettres   │ visa    │
├──────┼─────────────┼─────────────┼──────────┼───────────┼─────────┤
│      │             │             │          │           │         │
│      │             │             │          │           │         │
│      │             │             │          │           │         │
│      │             │             │          │           │         │
└──────┴─────────────┴─────────────┴──────────┴───────────┴─────────┘
```

## API CALLS MAPPING
 ```
Dépôt (Versement) :
  POST /epargnes/depot
  Body: { epargneId: number, amount: number }
  → Response: EpargneResponse { id, currentBalance }

Retrait :
  POST /epargnes/retrait
  Body: { epargneId: number, amount: number }
  → Validation: amount ≤ currentBalance

Historique épargne :
  GET  /epargnes/{id}
  → Response: EpargneDetailResponse { epargne, transactions[] }

Récapitulatif :
  GET  /recapitulatifs?poissonnerieId=X&start=YYYY-MM-01&end=YYYY-MM-31
  → Response: RecapitulatifResponse

Export PDF fiche épargne :
  GET  /exports/epargnes/{id}/pdf
  → byte[] → Blob → download

Export PDF récapitulatif :
  GET  /exports/recapitulatif/{id}/pdf?poissonnerieId=X&start=Y&end=Z
  → byte[] → Blob → download

  ```
