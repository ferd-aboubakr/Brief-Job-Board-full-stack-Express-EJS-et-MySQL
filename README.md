# 🚀 Job Board Full-Stack – Express, EJS & MySQL (Promotion MERN 2026/2027)

> **Projet de fin de Sprint 1 - YouCode (Concepteur Développeur d'Applications)**  
> Application web complète de gestion et consultation d'offres de stage et d'alternance, connectée à une base de données MySQL relationnelle et servie par Express et EJS.

---

## 📌 Présentation du Projet & Fonctionnalités

Cette version full-stack remplace l'ancien fichier JSON statique par une véritable architecture de données :

- 🌐 **Consultation Publique :**
  - Affichage de la liste des opportunités directement depuis MySQL.
  - Page détail complète pour chaque offre avec présentation de l'entreprise, des missions et des prérequis.
  - **Filtres serveur :** Par type de contrat (Stage, Alternance), par ville (Paris, Lyon, Nantes, Remote) et par technologie (React, Node, etc.).
  - **Recherche par mot-clé :** Recherche plein texte sécurisée sur les titres, descriptions et noms d'entreprises.
  - **Tri par date :** Des plus récentes aux plus anciennes et inversement.
  - **Offres Suivies (localStorage) :** Possibilité de marquer / retirer des favoris en conservant uniquement les IDs côté navigateur sans création de compte.

- 🛡️ **Back-Office Administrateur (CRUD) :**
  - Tableau de bord listant l'intégralité des offres avec alertes système.
  - Formulaire complet de création d'offre avec sélection d'entreprise et multi-sélection de technologies.
  - Modification d'une offre existante avec pré-remplissage des champs et des cases à cocher.
  - Suppression d'une offre en direct avec confirmation visuelle et suppression en cascade dans la base MySQL.

---

## 🛠️ Stack Technique

- **Environnement d'exécution :** Node.js (v18+) & npm
- **Framework Web :** Express.js (v4.x)
- **Moteur de gabarits (Templates) :** EJS avec Partials (`header`, `navbar`, `footer`)
- **Base de données relationnelle :** MySQL 8.x
- **Pilote MySQL :** `mysql2/promise` (requêtes préparées avec `?`)
- **Variables d'environnement :** `dotenv`
- **Outils macOS recommandés :** **DBngin** (serveur MySQL local en un clic) et **TablePlus** (visualisation de la base)

---

## 💻 Installation & Configuration sur macOS (DBngin & TablePlus)

### 1. Démarrer MySQL avec DBngin
1. Ouvrez l'application **DBngin** sur votre Mac.
2. Si ce n'est pas déjà fait, créez un service **MySQL** (version 8.x) et cliquez sur **Start**.
3. Par défaut, le service s'exécute sur le port `3306`, utilisateur `root`, sans mot de passe.

*(Optionnel)* : Dans **TablePlus**, vous pouvez créer une nouvelle connexion MySQL pointant sur `localhost:3306` pour visualiser les tables en direct.

---

### 2. Cloner et installer les dépendances
Placez-vous dans le dossier du projet et installez les paquets npm :

```bash
cd job-board-express
npm install
```

---

### 3. Configurer les variables d'environnement (.env)
Copiez le fichier d'exemple `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Vérifiez que le contenu correspond à vos accès MySQL :

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=job_board_mern
```

> **Note de sécurité :** Le fichier `.env` est automatiquement ignoré par `.gitignore` pour ne jamais exposer d'identifiants sensibles sur GitHub.

---

### 4. Initialiser la Base de Données (Seeder)
Lancez la commande d'injection automatique :

```bash
npm run db:seed
```

Ce script va automatiquement :
1. Créer la base `job_board_mern` si elle n'existe pas encore.
2. Appliquer le schéma relationnel (`database/schema.sql`).
3. Injecter **6 entreprises**, **10 technologies** et **12 offres** de démonstration.

---

## 🚀 Commandes Disponibles (Scripts npm)

| Commande | Rôle |
| :--- | :--- |
| `npm run dev` | Lance le serveur en mode développement avec **nodemon** (rechargement à chaud) |
| `npm start` | Lance le serveur de production avec **Node.js** (`node server.js`) |
| `npm run db:seed` | Exécute le seeder pour remplir la base de données avec des données de test |
| `npm run db:reset` | Réinitialise complètement la base (supprime les tables, réapplique le schéma et réinjecte le jeu de données) |

Une fois le serveur lancé :
- 🌐 **Site Public :** [http://localhost:3000](http://localhost:3000)
- ⭐ **Offres Suivies :** [http://localhost:3000/offres-suivies](http://localhost:3000/offres-suivies)
- ⚙️ **Administration :** [http://localhost:3000/admin](http://localhost:3000/admin)
- ➕ **Déposer une offre :** [http://localhost:3000/admin/offres/nouveau](http://localhost:3000/admin/offres/nouveau)

---

## 📂 Architecture du Projet

```text
job-board-express/
├── .env                  # Configuration locale (ignoré par Git)
├── .env.example          # Modèle public de configuration
├── .gitignore            # Exclusion de node_modules/ et .env
├── package.json          # Dépendances et scripts npm
├── server.js             # Point d'entrée de l'application Express
│
├── database/             # Gestion de la persistance MySQL
│   ├── db.js             # Pool de connexions mysql2/promise
│   ├── schema.sql        # Création des tables, clés primaires et étrangères
│   ├── seed.js           # Seeder automatisé (6 entreprises, 10 technos, 12 offres)
│   └── reset.js          # Script de réinitialisation complète de la base
│
├── repositories/         # Couche d'accès aux données (Data Access Layer)
│   ├── offreRepository.js        # Requêtes SQL sécurisées (?) pour les offres
│   ├── entrepriseRepository.js   # Requêtes pour les entreprises partenaires
│   └── technologieRepository.js  # Requêtes pour les technologies
│
├── routes/               # Contrôleurs et aiguillage HTTP
│   ├── publicRoutes.js   # Routes publiques (accueil, détail, favoris, api)
│   └── adminRoutes.js    # Routes d'administration (CRUD)
│
├── views/                # Gabarits EJS
│   ├── partials/         # Composants réutilisables (header, navbar, footer)
│   └── pages/
│       ├── index.ejs            # Liste publique avec filtres et recherche
│       ├── offre-detail.ejs     # Fiche complète d'une offre
│       ├── offres-suivies.ejs   # Tableau de bord des favoris locaux
│       └── admin/
│           ├── index.ejs        # Liste des offres côté admin
│           └── form.ejs         # Formulaire de création / modification
│
├── public/               # Assets statiques distribués au navigateur
│   ├── css/
│   │   └── style.css     # Feuille de style globale responsive
│   └── js/
│       ├── storage.js    # Fonctions épurées pour le localStorage
│       ├── bookmarks.js  # Synchronisation des marque-pages et du badge
│       └── followed.js   # Chargement asynchrone des offres suivies
│
└── docs/                 # Documentation technique et soutenance
    ├── diagrams.md       # Diagrammes UML (Classes, Use Case, MLD, Séquence, Activité)
    └── COMMITS_AND_JIRA.md # Backlog Jira et plan des commits humains pas à pas
```

---

## 🎓 Guide de Préparation à la Soutenance (Questions Types)

Voici les réponses claires et précises aux 3 questions obligatoires du référentiel :

### 1. Comment fonctionne le seeder JavaScript (`database/seed.js`) ?
> "Le seeder se connecte d'abord à MySQL via `mysql2/promise` pour vérifier que la base de données existe (`CREATE DATABASE IF NOT EXISTS`). Il lit ensuite le fichier `schema.sql` et exécute chaque instruction pour créer des tables vierges. Puis, il insère d'abord les entités indépendantes (`entreprise` et `technologie`) pour récupérer leurs identifiants auto-incrémentés (`insertId`). Enfin, il insère les `offres` rattachées à une entreprise, et renseigne la table d'association `offre_technologie` pour lier les compétences requises."

### 2. Comment les requêtes SQL sont-elles protégées contre les injections ?
> "Dans nos repositories (par exemple dans `offreRepository.js`), aucune variable utilisateur n'est directement concaténée dans la chaîne SQL. Nous utilisons systématiquement des **requêtes préparées** avec des placeholders `?` (ex: `WHERE type_contrat = ?`). Le pilote MySQL traite ces valeurs comme de simples données littérales et non comme du code exécutable, rendant impossible toute injection SQL même si un utilisateur saisit des guillemets ou du code malveillant."

### 3. Comment installer et lancer le projet sur une autre machine ?
> "Sur une machine vierge, la procédure comprend 4 étapes simples :  
> 1. Démarrer un serveur MySQL local (ex: via DBngin, Docker ou Homebrew).  
> 2. Cloner le dépôt et exécuter `npm install`.  
> 3. Créer le fichier `.env` à partir de `.env.example` en renseignant l'hôte et le port MySQL.  
> 4. Exécuter `npm run db:seed` pour initialiser la base et les tables en une seule commande, puis démarrer l'application avec `npm run dev`."
