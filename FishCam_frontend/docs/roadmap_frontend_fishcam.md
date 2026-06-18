# ROADMAP FRONTEND — FishCam ERP
## Angular 20 · Signals · Standalone Components · TailwindCSS · Design Isomorphic

> **Architecte :** Claude
> **Développeur Lead :** Ulrich
> **Stack :** Angular 20 · TypeScript · TailwindCSS · Angular Signals
> **Backend :** Spring Boot 3 · Java 17 · PostgreSQL · JWT — 100% terminé
> **API Base URL :** `http://192.168.8.100:8080/api/v1`

---

## Table des matières

1. [Principes fondamentaux à maîtriser](#1-principes-fondamentaux-à-maîtriser)
2. [Architecture des dossiers](#2-architecture-des-dossiers)
3. [Stratégie Git & Branches](#3-stratégie-git--branches)
4. [Phase 0 — Setup & Configuration](#4-phase-0--setup--configuration)
5. [Phase 1 — Authentification & Layout Isomorphic](#5-phase-1--authentification--layout-isomorphic)
6. [Phase 2 — Dashboard & Poissonneries](#6-phase-2--dashboard--poissonneries)
7. [Phase 3 — Module Achats (Cœur métier)](#7-phase-3--module-achats-cœur-métier)
8. [Phase 4 — Module Clients (Dettes & Épargne)](#8-phase-4--module-clients-dettes--épargne)
9. [Phase 5 — Module Livreurs](#9-phase-5--module-livreurs)
10. [Phase 6 — Clôture Journalière](#10-phase-6--clôture-journalière)
11. [Phase 7 — Super-Admin, Audits & Backups](#11-phase-7--super-admin-audits--backups)
12. [Gestion des erreurs & UX](#12-gestion-des-erreurs--ux)
13. [Estimation du temps](#13-estimation-du-temps)
14. [Ce qu'on pousse sur GitHub](#14-ce-quon-pousse-sur-github)

---

## 1. Principes fondamentaux à maîtriser

Ces concepts sont **non-négociables**. Tu dois les comprendre avant de coder la première ligne de chaque phase. Ils ne changent pas — c'est la base de tout bon projet Angular professionnel.

---

### 1.1 Standalone Components — La nouvelle norme Angular 20

**Ce que tu dois comprendre :**
Plus aucun `NgModule` dans ton projet. Chaque composant est autonome et déclare lui-même ses dépendances dans son propre fichier. C'est plus simple, plus rapide à charger, et c'est la norme officielle depuis Angular 17.

**Ce que tu dois maîtriser :**
- Comment importer un composant directement dans un autre composant (via le tableau `imports` du composant).
- Comment déclarer un composant `standalone: true`.
- Comprendre que `app.config.ts` remplace totalement `app.module.ts`.

**Où chercher :** Documentation officielle Angular → section "Standalone Components".

---

### 1.2 Signals — La gestion d'état moderne

**Ce que tu dois comprendre :**
Les Signals remplacent `BehaviorSubject` et les `subscribe()` partout dans les composants. Angular sait exactement quand une valeur a changé et ne met à jour que la partie du DOM concernée. Résultat : zéro memory leak, code lisible, application ultra-rapide.

**Les 4 concepts à maîtriser absolument :**

- **`signal(valeurInitiale)`** — Crée un état mutable. C'est ta source de vérité. Tu lis avec `monSignal()`, tu modifies avec `monSignal.set(nouvelleValeur)` ou `monSignal.update(ancienneValeur => calcul)`.

- **`computed(() => calcul)`** — Crée une valeur dérivée qui se recalcule automatiquement quand les signals qu'elle utilise changent. Exemple : le total d'une facture calculé depuis les lignes. Ne jamais mettre de logique lourde dedans.

- **`effect(() => effetDeBord)`** — Réagit à un changement de signal pour déclencher une action secondaire (naviguer, logger, sauvegarder en localStorage). À utiliser avec parcimonie. Toujours préférer `computed()` quand c'est possible.

- **`toSignal(observable$)`** — Convertit un Observable HTTP en Signal. C'est le pont entre ton `HttpClient` (qui reste un Observable) et tes Signals. Gère le `unsubscribe` automatiquement.

**Ce que tu dois maîtriser :**
- Écrire un Store injectable avec des signals privés et des sélecteurs publics `readonly`.
- Utiliser `computed()` pour calculer les totaux dans le module Achats.
- Ne JAMAIS utiliser `subscribe()` dans un composant pour mettre à jour l'interface — c'est le signe d'une mauvaise pratique.

**Où chercher :** Documentation officielle Angular → section "Signals".

---

### 1.3 Smart vs Dumb Components — La séparation des responsabilités

**Ce que tu dois comprendre :**
Tout composant dans ton application appartient à l'une de ces deux catégories. Ne jamais les mélanger.

- **Smart Component (Page / Container)** : Connaît les services et les Stores. Contient la logique métier. Fait les appels API. Transmet les données aux Dumb components via `@Input()`. Reçoit les événements des Dumb components via `@Output()`. Il y en a un par page/fonctionnalité principale.

- **Dumb Component (UI / Présentation)** : Ne connaît aucun service. Reçoit des données via `@Input()`. Émet des événements via `@Output()`. Ne fait jamais d'appel HTTP seul. Peut être réutilisé partout.

**Exemple concret pour FishCam :**
La page des achats (`achats-page`) est Smart : elle charge les factures, communique avec `AchatsStore`. La carte d'une facture (`facture-card`) est Dumb : elle reçoit une facture en `@Input()` et émet un événement quand on clique dessus.

**Ce que tu dois maîtriser :**
- Identifier immédiatement si un composant que tu crées est Smart ou Dumb.
- Ne jamais injecter un service HTTP dans un composant Dumb.

---

### 1.4 Lazy Loading — Chargement à la demande

**Ce que tu dois comprendre :**
Angular ne charge pas tous les modules d'un coup au démarrage de l'app. Chaque fonctionnalité (Achats, Clients, Livreurs...) est chargée uniquement quand l'utilisateur navigue vers elle. Résultat : l'application démarre en 1-2 secondes même si elle a 50 pages.

**Ce que tu dois maîtriser :**
- Déclarer chaque feature comme un `loadComponent` ou `loadChildren` dans `app.routes.ts`.
- Comprendre la structure `features/nom-du-module/nom-du-module.routes.ts`.

---

### 1.5 Intercepteurs HTTP — La couche transversale

**Ce que tu dois comprendre :**
Un intercepteur est un "filtre" qui s'applique automatiquement à TOUTES tes requêtes HTTP ou réponses. Tu n'as pas besoin de répéter du code dans chaque service.

**Les deux intercepteurs obligatoires pour FishCam :**

- **`JwtInterceptor`** : Lit le token JWT stocké (`localStorage`) et l'ajoute automatiquement dans le header `Authorization: Bearer xxxxx` de chaque requête sortante. Tu ne gères plus jamais le token dans tes services.

- **`ErrorInterceptor`** : Intercepte toutes les réponses HTTP en erreur (401, 403, 404, 500...) et déclenche les bonnes actions : rediriger vers `/login` si 401, afficher un Toast rouge si 500, etc.

**Ce que tu dois maîtriser :**
- Créer des intercepteurs fonctionnels (la nouvelle syntaxe Angular sans classe).
- Les enregistrer dans `app.config.ts` via `withInterceptors([...])`.

---

### 1.6 Guards — La sécurité des routes

**Ce que tu dois comprendre :**
Un Guard est une fonction qui décide si l'utilisateur a le droit d'accéder à une route. Sans lui, n'importe qui pourrait taper `http://.../#/super-admin` dans son navigateur et y accéder.

**Les guards obligatoires pour FishCam :**
- **`authGuard`** : Vérifie si l'utilisateur est connecté (token JWT valide). Sinon → `/login`.
- **`roleGuard`** : Vérifie le rôle de l'utilisateur (SUPER_ADMIN, PATRON, CAISSIERE...). Sinon → `/accès-refusé` ou `/dashboard`.

**Ce que tu dois maîtriser :**
- Écrire des guards fonctionnels (nouvelle syntaxe Angular).
- Combiner `authGuard` et `roleGuard` sur les routes protégées.

---

### 1.7 Le nouveau Control Flow — La syntaxe des templates modernes

**Ce que tu dois comprendre :**
Angular 17+ a introduit une nouvelle syntaxe pour les templates qui remplace `*ngIf`, `*ngFor` et `*ngSwitch`. Elle est plus lisible et plus performante.

**Ce que tu dois maîtriser :**
- `@if (condition) { ... } @else { ... }` : remplace `*ngIf`.
- `@for (item of liste; track item.id) { ... }` : remplace `*ngFor`. Le `track` est **obligatoire** et améliore les performances.
- `@switch (valeur) { @case ('A') { ... } @default { ... } }` : remplace `*ngSwitch`.
- `@defer (on viewport) { ... } @placeholder { ... }` : charge un composant uniquement quand il devient visible à l'écran. Idéal pour les listes longues.

---

### 1.8 ChangeDetectionStrategy.OnPush — Performance obligatoire

**Ce que tu dois comprendre :**
Par défaut, Angular vérifie tous les composants à chaque micro-événement (clic, frappe...). Avec `OnPush`, Angular ne vérifie un composant que si ses `@Input()` ou ses Signals ont changé. Sur une app avec des tableaux de données, c'est la différence entre une app fluide et une app qui rame.

**Ce que tu dois maîtriser :**
- Ajouter `changeDetection: ChangeDetectionStrategy.OnPush` sur **chaque** composant que tu crées sans exception.
- Comprendre que `OnPush` + Signals = la combinaison parfaite (les Signals notifient Angular automatiquement).

---

### 1.9 Les Pipes — Formatage des données dans les templates

**Ce que tu dois comprendre :**
Un Pipe transforme une valeur dans un template sans modifier la donnée source. C'est réutilisable et propre.

**Les Pipes à créer pour FishCam :**
- **`CurrencyFcfaPipe`** : Transforme `25000` en `"25 000 FCFA"`. Indispensable dans tout l'ERP.
- **`RoleLabelPipe`** : Transforme `"SUPER_ADMIN"` en `"Super Administrateur"`.

**Ce que tu dois maîtriser :**
- Créer et utiliser des Pipes personnalisés standalone.
- Ne jamais faire du formatage directement dans les templates avec du code TypeScript.

---

### 1.10 La gestion du JWT & Sécurité Côté Frontend

**Ce que tu dois comprendre :**
Quand le backend retourne un token JWT après le login, le frontend doit le stocker, le lire, et le supprimer proprement.

**Ce que tu dois maîtriser :**
- Stocker le token dans `localStorage` (acceptable pour un ERP sur réseau local).
- Décoder le payload du JWT (sans bibliothèque externe — c'est juste du base64) pour lire les informations de l'utilisateur (rôle, nom, ID).
- Supprimer le token du `localStorage` à la déconnexion.
- Vérifier l'expiration du token dans le Guard.

---

## 2. Architecture des dossiers

```
src/
├── app/
│   │
│   ├── core/                               ← Singletons (chargés une seule fois)
│   │   ├── auth/
│   │   │   ├── auth.service.ts             ← Login, logout, décodage JWT
│   │   │   ├── auth.guard.ts               ← Vérifie si connecté
│   │   │   ├── role.guard.ts               ← Vérifie le rôle
│   │   │   ├── jwt.interceptor.ts          ← Injecte le token dans les requêtes
│   │   │   └── error.interceptor.ts        ← Gère les erreurs HTTP globalement
│   │   ├── stores/
│   │   │   ├── auth.store.ts               ← État global : utilisateur connecté, rôle
│   │   │   └── poissonnerie.store.ts       ← La boutique sélectionnée (contexte global)
│   │   └── models/                         ← Toutes les interfaces TypeScript
│   │       ├── user.model.ts
│   │       ├── poissonnerie.model.ts
│   │       ├── facture.model.ts
│   │       ├── ligne-achat.model.ts
│   │       ├── client.model.ts
│   │       ├── livreur.model.ts
│   │       └── audit-log.model.ts
│   │
│   ├── shared/                             ← Composants réutilisables (Dumb)
│   │   ├── components/
│   │   │   ├── stat-card/                  ← Carte de statistique (chiffre + label)
│   │   │   ├── data-table/                 ← Tableau de données réutilisable
│   │   │   ├── modal/                      ← Modale générique
│   │   │   ├── confirm-dialog/             ← Boîte de confirmation "Êtes-vous sûr ?"
│   │   │   ├── toast/                      ← Notifications (succès, erreur, info)
│   │   │   ├── loading-skeleton/           ← Squelette de chargement animé
│   │   │   ├── empty-state/                ← Message "Aucun résultat"
│   │   │   ├── badge-role/                 ← Badge coloré selon le rôle
│   │   │   └── pdf-download-button/        ← Bouton téléchargement PDF (Blob)
│   │   ├── pipes/
│   │   │   ├── currency-fcfa.pipe.ts       ← 25000 → "25 000 FCFA"
│   │   │   └── role-label.pipe.ts          ← "SUPER_ADMIN" → "Super Administrateur"
│   │   └── directives/
│   │       └── has-role.directive.ts       ← Affiche/cache un élément selon le rôle
│   │
│   ├── layouts/
│   │   ├── main-layout/                    ← Layout avec Sidebar + Topbar (pages privées)
│   │   └── auth-layout/                    ← Layout centré sans sidebar (Login)
│   │
│   ├── features/
│   │   ├── auth/                           ← Connexion
│   │   │   ├── login/
│   │   │   └── acces-refuse/
│   │   │
│   │   ├── dashboard/                      ← Page d'accueil ERP
│   │   │
│   │   ├── achats/                         ← Module Achats (factures fournisseurs)
│   │   │   ├── pages/
│   │   │   │   ├── achats-list/            ← Liste des factures du jour
│   │   │   │   └── achat-detail/           ← Détail d'une facture
│   │   │   ├── components/
│   │   │   │   ├── facture-card/
│   │   │   │   ├── ligne-achat-form/       ← Formulaire saisie ligne (calcul auto)
│   │   │   │   └── ligne-achat-row/
│   │   │   └── store/
│   │   │       └── achats.store.ts
│   │   │
│   │   ├── clients/                        ← Module Clients
│   │   │   ├── pages/
│   │   │   │   ├── clients-list/
│   │   │   │   └── client-detail/          ← Onglets : Compte Courant + Épargne
│   │   │   ├── components/
│   │   │   │   ├── client-card/
│   │   │   │   ├── versement-form/
│   │   │   │   └── epargne-tab/
│   │   │   └── store/
│   │   │       └── clients.store.ts
│   │   │
│   │   ├── livreurs/                       ← Module Livreurs
│   │   │   ├── pages/
│   │   │   │   ├── livreurs-list/
│   │   │   │   └── livreur-detail/
│   │   │   ├── components/
│   │   │   │   └── evaluation-form/
│   │   │   └── store/
│   │   │       └── livreurs.store.ts
│   │   │
│   │   ├── cloture/                        ← Clôture journalière
│   │   │   ├── pages/
│   │   │   │   └── cloture-page/
│   │   │   └── store/
│   │   │       └── cloture.store.ts
│   │   │
│   │   └── admin/                          ← Super-Admin uniquement
│   │       ├── pages/
│   │       │   ├── audit-logs/
│   │       │   └── parametres/
│   │       └── store/
│   │           └── admin.store.ts
│   │
│   ├── app.routes.ts
│   └── app.config.ts
│
├── environments/
│   ├── environment.ts                      ← Dev : API sur localhost:8080
│   └── environment.prod.ts                 ← Prod : API sur 192.168.8.100:8080
│
└── assets/
    ├── icons/
    └── logo.svg
```

---

## 3. Stratégie Git & Branches

### Structure des branches

```
main                ← Production stable (ce qui tourne sur le serveur)
  └── develop       ← Intégration (ce qui est testé mais pas encore déployé)
        ├── feature/phase-0-setup
        ├── feature/phase-1-auth-layout
        ├── feature/phase-2-dashboard
        ├── feature/phase-3-achats
        ├── feature/phase-4-clients
        ├── feature/phase-5-livreurs
        ├── feature/phase-6-cloture
        └── feature/phase-7-admin
```

### Convention des commits (à suivre strictement)

```
feat: add login page with JWT authentication
feat: add achat form with automatic total calculation
fix: correct role guard redirect on 403 error
style: apply Isomorphic sidebar design tokens
refactor: extract ligne-achat calculation to computed signal
perf: add OnPush detection on all data table rows
chore: update environment API URL to 192.168.8.100
```

---

## 4. Phase 0 — Setup & Configuration

**Durée estimée : 1 journée**

**Objectif :** Avoir un projet propre qui compile, avec Tailwind fonctionnel et la structure des dossiers en place.

### Ce qu'il faut faire

**Vérification de l'installation :**
Confirme que ton projet Angular 20 est généré en mode standalone avec SCSS et le routing activé. Lance `ng serve` et vérifie que l'app tourne sur `localhost:4200`.

**Configuration Tailwind :**
Tailwind est installé. Configure le fichier `tailwind.config.js` pour qu'il scanne tous les fichiers dans `src/**/*.{html,ts}`. Ajoute les trois directives Tailwind en haut de `styles.scss`. Lance `ng serve` et teste avec une classe Tailwind simple dans `app.component.html`.

**Copie des dossiers depuis l'ancien projet :**
Copie les dossiers `layouts` et `shared` de `Predictiondes-vehicule-frontend` vers `src/app/` du nouveau projet. Copie également `core` si la structure est réutilisable. Corrige les chemins d'import cassés (Angular affichera les erreurs dans le terminal).

**Configuration des environments :**
Crée les deux fichiers d'environnement. En développement, l'URL de l'API pointe vers `http://localhost:8080/api/v1`. En production, elle pointera vers `http://192.168.8.100:8080/api/v1`.

**Palette de couleurs Tailwind :**
Définit une palette de couleurs professionnelle dans `tailwind.config.js` en t'inspirant d'Isomorphic : bleu corporatif comme couleur primaire, gris neutres pour les fonds, rouge pour les erreurs, vert pour les succès. Ces couleurs doivent être définies une fois et réutilisées dans tout le projet via des classes personnalisées Tailwind.

**Structure des dossiers :**
Crée à la main tous les dossiers vides de l'architecture définie ci-dessus. Cela t'oblige à comprendre la structure avant de coder.

### Commit de fin de phase
```
chore: initialize FishCam ERP project with Angular 20, Tailwind, and folder structure
```

---

## 5. Phase 1 — Authentification & Layout Isomorphic

**Durée estimée : 3 jours**

**Objectif :** La caissière peut se connecter, voir le layout complet (sidebar + topbar), et être bloquée si elle n'a pas les bons droits. C'est le "squelette" de toute l'application.

### Concepts à maîtriser avant de commencer
- Signals (`signal`, `computed`)
- Intercepteurs HTTP fonctionnels Angular
- Guards fonctionnels Angular
- Décodage du payload JWT en base64

### Composants à créer

**Dumb Components (réutilisables) :**
- `toast` (dans `shared/components/`) : Composant de notification. Doit supporter trois états : succès (vert), erreur (rouge), information (bleu). Doit disparaître automatiquement après 4 secondes.

**Layouts :**
- `auth-layout` : Layout simple, fond uni ou gradient, contenu centré. Utilisé uniquement pour la page de login.
- `main-layout` : Le cœur d'Isomorphic. Contient la Sidebar latérale avec les liens de navigation (filtrés selon le rôle), la Topbar avec le nom de la poissonnerie active et le bouton de déconnexion, et le `<router-outlet>` pour afficher les pages.

**Smart Components (Pages) :**
- `login-page` : Formulaire avec champs email et mot de passe. Bouton de soumission avec état de chargement (spinner pendant l'appel API). Affiche un message d'erreur clair si le login échoue (Toast rouge "Identifiants incorrects").
- `acces-refuse-page` : Page simple affichée quand un utilisateur tente d'accéder à une page pour laquelle il n'a pas le rôle requis.

### Stores à créer

**`AuthStore` (dans `core/stores/`) :**
Ce store est le plus important de l'application. Il contient l'état global de l'utilisateur connecté.
- Signal privé : l'objet utilisateur (null si non connecté).
- Computed public : `isLoggedIn` (true/false), `isPatron`, `isCaissiere`, `isSuperAdmin`, `userRole`, `userName`.
- Actions : `setUser(user)`, `logout()` (vide le signal ET supprime le token du localStorage), `loadFromStorage()` (restaure la session au rechargement de la page).

**`PoissonnerieStore` (dans `core/stores/`) :**
- Signal privé : la poissonnerie actuellement sélectionnée.
- Action : `selectPoissonnerie(poissonnerie)`.
- Computed public : `poissonnerieActive`, `hasPoissonnerieSelected`.

### Services à créer

**`AuthService` (dans `core/auth/`) :**
Méthode `login(email, password)` : appelle `POST /auth/login`, reçoit le token JWT, le stocke dans `localStorage`, décode le payload pour extraire les informations utilisateur, met à jour `AuthStore`.
Méthode `logout()` : appelle `AuthStore.logout()`, redirige vers `/login`.

### Intercepteurs à créer

**`JwtInterceptor` :**
Lit le token dans `localStorage`. Si présent, ajoute l'en-tête `Authorization: Bearer TOKEN` à toutes les requêtes HTTP sortantes. Si absent, laisse passer la requête telle quelle.

**`ErrorInterceptor` :**
- `401` → Appelle `authService.logout()` pour vider la session et rediriger vers `/login`.
- `403` → Affiche un Toast "Accès refusé" sans déconnecter.
- `404` → Affiche un Toast "Ressource introuvable".
- `409` ou `422` → Affiche le message d'erreur retourné par le backend Spring Boot (il est dans `error.message`).
- `500` → Affiche un Toast "Erreur serveur. Veuillez réessayer.".
- Erreur réseau → Affiche "Connexion impossible. Vérifiez le réseau.".

### Guards à créer

**`authGuard` :** Vérifie `AuthStore.isLoggedIn()`. Si false → redirige vers `/login`.
**`roleGuard` :** Prend les rôles autorisés en paramètre. Vérifie `AuthStore.userRole()`. Si le rôle n'est pas dans la liste → redirige vers `/acces-refuse`.

### Configuration des routes (app.routes.ts)

Deux groupes de routes :
1. Routes publiques (sans guard, avec `auth-layout`) : `/login`, `/acces-refuse`.
2. Routes privées (avec `authGuard`, avec `main-layout`) : toutes les autres pages de l'ERP. Elles sont déclarées en `loadChildren` pour le lazy loading.

### Commits de fin de phase
```
feat: add JWT authentication with login page and AuthStore
feat: add main layout with Isomorphic sidebar and topbar
feat: add JWT and error interceptors
feat: add auth and role guards
```

---

## 6. Phase 2 — Dashboard & Poissonneries

**Durée estimée : 2 jours**

**Objectif :** La page d'accueil de l'ERP. En arrivant, l'utilisateur voit les chiffres clés de la journée et sélectionne la boutique sur laquelle il travaille.

### Concepts à maîtriser
- `computed()` pour les totaux calculés côté frontend
- `toSignal()` pour convertir les appels HTTP en Signals
- Skeleton loading (UX)

### Composants à créer

**Dumb Components :**
- `stat-card` (dans `shared/components/`) : Carte réutilisable avec un grand chiffre, un label, une icône et une couleur d'accent. Ce composant sera utilisé dans presque tous les modules.
- `loading-skeleton` (dans `shared/components/`) : Affiche des rectangles gris animés (effet shimmer) pendant le chargement des données. La forme des rectangles doit imiter la forme du vrai contenu.
- `empty-state` (dans `shared/components/`) : Message affiché quand une liste est vide. Reçoit un message et une icône en `@Input()`.

**Smart Components (Pages) :**
- `dashboard-page` : Affiche les stat-cards avec les données du jour (ventes totales, dettes actives, achats validés). Contient le sélecteur de poissonnerie si l'utilisateur en gère plusieurs.

### Stores à créer

**`DashboardStore` (dans `features/dashboard/store/`) :**
- Signal : données du dashboard (chiffres).
- Signal : état de chargement (`isLoading`).
- Signal : erreur éventuelle (`error`).
- Action : `loadDashboard(poissonnerieId)` — appelle l'API et met à jour les signals.

### Points UX importants
- Toujours afficher les squelettes de chargement avant que les données arrivent.
- Si l'utilisateur n'a pas encore sélectionné de poissonnerie, afficher un message "Veuillez sélectionner une boutique pour voir les données".
- Les chiffres doivent être formatés avec le pipe `CurrencyFcfaPipe`.

### Commits de fin de phase
```
feat: add dashboard with stat cards and daily summary
feat: add poissonnerie selector in topbar
feat: add loading skeleton component
```

---

## 7. Phase 3 — Module Achats (Cœur métier)

**Durée estimée : 5 jours**

**Objectif :** La fonctionnalité la plus complexe de l'ERP. La caissière saisit les factures fournisseurs avec calcul automatique et peut télécharger le PDF.

### Concepts à maîtriser
- Formulaires réactifs Angular (`ReactiveFormsModule`, `FormGroup`, `FormArray`)
- `computed()` pour les calculs en temps réel
- Téléchargement de fichiers Blob (PDF)
- `@defer` pour les composants lourds

### ⚠️ La règle UX absolue du formulaire d'achat

La caissière ne doit JAMAIS utiliser de calculatrice. Voici les règles strictes du formulaire de saisie d'une ligne d'achat :

**Champs que la caissière saisit :**
- Quantité de cartons
- Prix unitaire par carton
- Poids total en kg
- Prix de vente au kilo

**Ce que le frontend doit afficher en temps réel (via `computed()`) :**
- Le total de la ligne : `quantiteCartons × prixUnitaireCarton` — mis à jour à chaque frappe, avant même d'envoyer au backend.

**Ce que le backend recalcule et stocke :**
Le frontend envoie les données brutes, le backend recalcule de son côté pour s'assurer de l'intégrité des données. Ne jamais faire confiance uniquement au calcul frontend.

### Composants à créer

**Dumb Components :**
- `facture-card` : Affiche le résumé d'une facture (fournisseur, date, montant total, statut).
- `ligne-achat-row` : Une ligne dans le tableau de détail d'une facture.
- `ligne-achat-form` : Le formulaire de saisie d'une ligne. Affiche le total calculé en temps réel. C'est le composant le plus important de toute l'application.
- `pdf-download-button` (dans `shared/`) : Bouton réutilisable qui déclenche un téléchargement PDF depuis un `Blob`.

**Smart Components (Pages) :**
- `achats-list-page` : Tableau des factures du jour. Filtrable par fournisseur et par statut. Bouton "Nouvelle Facture".
- `achat-detail-page` : Affiche toutes les lignes d'une facture. Bouton "Ajouter une ligne" (ouvre `ligne-achat-form` dans une modale). Bouton "Télécharger PDF".

### Stores à créer

**`AchatsStore` (dans `features/achats/store/`) :**
- Signal : liste des factures du jour.
- Signal : la facture actuellement ouverte.
- Signal : état de chargement.
- Signal : état d'erreur.
- Computed : total de toutes les factures du jour.
- Actions : `loadFactures()`, `loadFactureById(id)`, `createFacture(data)`, `addLigneAchat(factureId, data)`, `downloadPdf(factureId)`.

### Gestion du PDF (technique importante)

Quand le backend retourne des `byte[]`, le service Angular doit préciser `responseType: 'blob'` dans la requête HTTP. Une fois le Blob reçu, le frontend crée une URL temporaire avec `window.URL.createObjectURL(blob)` et l'ouvre dans un nouvel onglet. L'utilisateur voit le PDF directement dans son navigateur.

### Points UX importants
- Le bouton "Ajouter une ligne" doit être désactivé pendant qu'un appel API est en cours (éviter les doublons).
- Après l'ajout d'une ligne, le formulaire se vide et le total de la facture se met à jour immédiatement.
- Afficher une boîte de confirmation avant la suppression d'une ligne.
- Si la facture est déjà clôturée, les boutons de modification doivent être masqués (directive `hasRole` ou `@if`).

### Commits de fin de phase
```
feat: add achats list with daily factures table
feat: add ligne-achat form with real-time total calculation
feat: add PDF download from backend Blob
feat: add facture detail page with add/remove lines
```

---

## 8. Phase 4 — Module Clients (Dettes & Épargne)

**Durée estimée : 3 jours**

**Objectif :** Suivi complet des clients : gestion des dettes (Compte Courant) et du programme d'épargne FNJLCP.

### Concepts à maîtriser
- Navigation par onglets sans routing (état local géré par un Signal)
- Formulaires conditionnels selon le type d'opération (versement vs retrait)
- `@defer` sur les listes longues

### Composants à créer

**Dumb Components :**
- `client-card` : Résumé du client avec son solde de dette et son solde d'épargne en un coup d'œil. Utilise des couleurs (rouge si dette > limite, vert si épargne positive).
- `versement-form` : Formulaire simple pour enregistrer un versement ou un retrait. Montant + commentaire.
- `epargne-tab` : Onglet contenant l'historique des opérations d'épargne.
- `compte-courant-tab` : Onglet contenant l'historique des dettes et versements.

**Smart Components (Pages) :**
- `clients-list-page` : Liste des clients avec barre de recherche. La recherche filtre localement (via `computed()`) avant d'appeler l'API pour des résultats complets.
- `client-detail-page` : Page profil du client avec deux onglets (Compte Courant / Épargne). L'onglet actif est géré par un Signal local. Boutons "Nouveau Versement" et "Nouveau Retrait" qui ouvrent `versement-form` dans une modale.

### Stores à créer

**`ClientsStore` :**
- Signals : liste des clients, client actuellement sélectionné, historique des opérations.
- Computed : total des dettes actives, total de l'épargne globale.
- Actions : `loadClients()`, `loadClientById(id)`, `addVersement(clientId, data)`, `addRetrait(clientId, data)`, `downloadFicheEpargne(clientId)`.

### Points UX importants
- Afficher clairement en rouge si le solde du client dépasse sa limite de crédit.
- Le bouton "Retrait" sur l'épargne doit être désactivé si le solde est insuffisant (vérification frontend + backend).
- La fiche d'épargne PDF se télécharge avec le même mécanisme Blob que les factures.

### Commits de fin de phase
```
feat: add clients list with search and debt overview
feat: add client detail with compte courant and epargne tabs
feat: add versement and retrait forms
feat: add epargne PDF download
```

---

## 9. Phase 5 — Module Livreurs

**Durée estimée : 2 jours**

**Objectif :** Gérer les livreurs et évaluer chaque livraison (respect du poids, qualité du produit).

### Composants à créer

**Dumb Components :**
- `livreur-card` : Carte résumé du livreur avec sa note moyenne.
- `evaluation-form` : Formulaire d'évaluation d'une livraison avec des étoiles ou des notes.

**Smart Components (Pages) :**
- `livreurs-list-page` : Liste des livreurs.
- `livreur-detail-page` : Historique des livraisons et des évaluations.

### Stores à créer

**`LivreursStore` :**
- Signals : liste des livreurs, livreur sélectionné.
- Actions : `loadLivreurs()`, `addEvaluation(livreurId, data)`.

### Commits de fin de phase
```
feat: add livreurs list and detail pages
feat: add delivery evaluation form with rating system
```

---

## 10. Phase 6 — Clôture Journalière

**Durée estimée : 2 jours**

**Objectif :** La caissière "rend ses comptes" en fin de journée. C'est une action irréversible qui clôture toutes les opérations du jour.

### Concepts à maîtriser
- Formulaires avec confirmation en deux étapes (pour éviter les erreurs)
- Gestion d'une action irréversible (UI/UX de sécurité)
- Affichage d'un résumé calculé avant confirmation finale

### Composants à créer

**Smart Components (Pages) :**
- `cloture-page` : Formulaire en plusieurs étapes. Étape 1 : saisie (argent en caisse, fond de caisse, ration, transport, autres frais). Étape 2 : affichage du résumé calculé par le backend (bénéfice, écarts). Étape 3 : bouton "Clôturer définitivement" avec un `confirm-dialog` obligatoire.

### Stores à créer

**`ClotureStore` :**
- Signal : l'aperçu de clôture (retourné par une API `GET` avant la confirmation).
- Signal : état de soumission.
- Actions : `previewCloture(data)`, `confirmerCloture(data)`.

### Points UX importants
- Le bouton final "Clôturer" doit être grisé et afficher "Déjà clôturé" si la journée est déjà fermée.
- Afficher une boîte de dialogue de confirmation avec le texte "Cette action est IRRÉVERSIBLE. Êtes-vous sûr ?"
- Après clôture réussie, rediriger vers le dashboard avec un message de succès visible.

### Commits de fin de phase
```
feat: add daily closing form with two-step confirmation
feat: add cloture preview and irreversible confirmation dialog
```

---

## 11. Phase 7 — Super-Admin, Audits & Backups

**Durée estimée : 2 jours**

**Objectif :** Le panneau de contrôle du Patron et du Super-Admin. Invisible pour les autres rôles.

### Concepts à maîtriser
- Directive `hasRole` pour masquer des éléments selon le rôle
- `roleGuard` avec plusieurs rôles autorisés
- Tableau de logs paginé

### Composants à créer

**Smart Components (Pages) :**
- `audit-logs-page` : Tableau paginé de tous les logs d'audit. Chaque ligne affiche : qui a fait quoi, sur quoi, et quand. Filtrages par date et par type d'action.
- `parametres-page` : Boutons "Forcer Backup Telegram", "Backup Email". Affiche un Toast "Backup envoyé !" ou "Échec du backup" selon la réponse du backend. Section gestion des utilisateurs (CRUD).

### Stores à créer

**`AdminStore` :**
- Signals : liste des audit logs, état de chargement.
- Actions : `loadAuditLogs(params)`, `forceBackupTelegram()`, `forceBackupEmail()`.

### Points UX importants
- Les routes `/admin/*` doivent être protégées avec `roleGuard(['SUPER_ADMIN', 'PATRON'])`.
- Les liens vers les pages admin dans la sidebar doivent être complètement masqués avec la directive `hasRole` si l'utilisateur est `CAISSIERE` ou `ENREGISTREUR`.
- Un retour visuel clair (spinner puis Toast) est obligatoire sur les boutons de backup car l'action peut prendre quelques secondes.

### Commits de fin de phase
```
feat: add audit logs page with pagination and filters
feat: add admin settings with backup triggers
feat: add hasRole directive for UI-level access control
```

---

## 12. Gestion des erreurs & UX

### Les 3 niveaux de gestion des erreurs (obligatoires)

**Niveau 1 — ErrorInterceptor (global, une seule fois) :**
```
401 → logout() + redirection /login
403 → Toast rouge "Accès non autorisé"
404 → Toast orange "Ressource introuvable"
409 / 422 → Toast rouge avec le message du backend
500 → Toast rouge "Erreur serveur"
Réseau → Toast rouge "Pas de connexion"
```

**Niveau 2 — Dans chaque Store (par feature) :**
Chaque action qui appelle l'API suit ce pattern sans exception :
1. Mettre `isLoading` à `true`.
2. Appeler l'API.
3. En cas de succès : mettre à jour les données, remettre `isLoading` à `false`.
4. En cas d'erreur : mettre `error` avec le message, remettre `isLoading` à `false`.

**Niveau 3 — Dans les templates (par composant) :**
Chaque liste ou page qui charge des données doit avoir 4 états visuels :
1. **Chargement** → `@if (store.isLoading())` → afficher `<app-loading-skeleton />`
2. **Erreur** → `@else if (store.error())` → afficher `<app-error-message />`
3. **Vide** → `@else if (!store.hasData())` → afficher `<app-empty-state />`
4. **Données** → `@else` → afficher le vrai contenu

### Principes UX non-négociables

- **Jamais de page blanche** : Toujours un squelette, un message d'erreur, ou un état vide.
- **Feedback immédiat** : Tout bouton d'action doit afficher un spinner pendant l'appel API et être désactivé pour éviter les doubles soumissions.
- **Confirmations avant irréversible** : Toute suppression ou clôture doit passer par un `confirm-dialog`.
- **Formatage cohérent** : Tous les montants passent par `CurrencyFcfaPipe`. Jamais de formatage "à la main" dans un template.
- **Rôles et permissions** : Masquer les boutons inutiles selon le rôle plutôt que d'afficher une erreur après le clic.

---

## 13. Estimation du temps

| Phase | Contenu | Durée estimée |
|---|---|---|
| Phase 0 | Setup, Tailwind, Structure | 1 jour |
| Phase 1 | Auth, Layout, Intercepteurs, Guards | 3 jours |
| Phase 2 | Dashboard, Poissonneries | 2 jours |
| Phase 3 | Module Achats + PDF | 5 jours |
| Phase 4 | Module Clients (Dettes + Épargne) | 3 jours |
| Phase 5 | Module Livreurs + Évaluations | 2 jours |
| Phase 6 | Clôture Journalière | 2 jours |
| Phase 7 | Super-Admin, Audits, Backups | 2 jours |
| **TOTAL** | | **~20 jours ouvrables** |

**Avec 4-5h par jour : environ 4 à 5 semaines.**

---

## 14. Ce qu'on pousse sur GitHub

### Ce qu'on pousse ✅
```
src/
angular.json
package.json
package-lock.json
tailwind.config.js
.gitignore
README.md
```

### Ce qu'on ne pousse JAMAIS ❌
```
node_modules/
dist/
.env
environment.prod.ts    ← Contient l'IP du serveur de production
*.log
```

---

*FishCam ERP — Frontend Roadmap*
*Architecte : Claude · Développeur : Ulrich*
*Angular 20 · Signals · Standalone · TailwindCSS · Isomorphic Design*
