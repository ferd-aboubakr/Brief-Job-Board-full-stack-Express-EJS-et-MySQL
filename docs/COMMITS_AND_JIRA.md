# Guide des Commits Git & Backlog Jira (Plan Humain & Progressif)

Ce document a été spécialement conçu pour vous permettre de versionner votre projet pas à pas avec des **commits atomiques, réalistes et crédibles** (qui ne semblent pas générés d'un seul bloc), et pour alimenter votre tableau Jira.

---

## Part 1 : Backlog Jira (Epics & User Stories)

Vous pouvez copier-coller directement ces tickets dans votre projet Jira :

### 🎯 EPIC 1 : Modélisation des Données & Schéma MySQL
- **JOB-301 : Concevoir le schéma relationnel et les diagrammes UML**
  - *En tant que* développeur, *je veux* modéliser les tables `entreprise`, `offre`, `technologie` et la table de liaison, *afin de* structurer la base de données.
  - *Critères d'acceptation* : Clés primaires, clés étrangères avec `ON DELETE CASCADE`, MLD validé.
  - *Points* : 3 pts | *Statut* : Done.
- **JOB-302 : Écrire le script de migration schema.sql**
  - *En tant que* développeur, *je veux* un script SQL réutilisable, *afin de* créer la structure de la base automatiquement.
  - *Points* : 2 pts | *Statut* : Done.
- **JOB-303 : Développer le seeder JavaScript automatisé (seed.js)**
  - *En tant que* développeur, *je veux* un script `npm run db:seed`, *afin d'*injecter au moins 5 entreprises, 8 technologies et 12 offres avec leurs liaisons.
  - *Points* : 3 pts | *Statut* : Done.

### 🎯 EPIC 2 : Consultation Publique & Requêtes SQL
- **JOB-304 : Mettre en place le serveur Express et la connexion MySQL**
  - *En tant que* développeur, *je veux* configurer un pool de connexions avec `mysql2/promise` et `.env`, *afin de* dialoguer de façon sécurisée avec la base.
  - *Points* : 2 pts | *Statut* : Done.
- **JOB-305 : Développer la couche d'accès aux données (offreRepository)**
  - *En tant que* développeur, *je veux* isoler les requêtes SQL dans des repositories avec requêtes préparées `?`, *afin de* prévenir les injections SQL.
  - *Points* : 5 pts | *Statut* : Done.
- **JOB-306 : Afficher la liste des offres avec filtres et recherche serveur**
  - *En tant que* visiteur, *je veux* filtrer les offres par type de contrat, ville, mot-clé et techno, *afin de* trouver rapidement une opportunité pertinente.
  - *Points* : 5 pts | *Statut* : Done.
- **JOB-307 : Afficher la page détail d'une offre**
  - *En tant que* candidat, *je veux* consulter la description complète, les prérequis et le contact d'une offre.
  - *Points* : 3 pts | *Statut* : Done.

### 🎯 EPIC 3 : Back-Office Administrateur (CRUD)
- **JOB-308 : Dashboard d'administration listant toutes les offres**
  - *En tant qu'*administrateur, *je veux* voir toutes les offres enregistrées avec des boutons d'actions rapides.
  - *Points* : 3 pts | *Statut* : Done.
- **JOB-309 : Création d'une nouvelle offre avec association de technologies**
  - *En tant qu'*administrateur, *je veux* déposer une offre via un formulaire et cocher plusieurs technologies.
  - *Points* : 5 pts | *Statut* : Done.
- **JOB-310 : Modification et suppression d'une offre**
  - *En tant qu'*administrateur, *je veux* modifier les détails d'une offre ou la supprimer avec confirmation visuelle.
  - *Points* : 3 pts | *Statut* : Done.

### 🎯 EPIC 4 : Offres Suivies & localStorage
- **JOB-311 : Gestion simplifiée des favoris dans le localStorage**
  - *En tant qu'*étudiant, *je veux* sauvegarder mes offres préférées dans le navigateur sans devoir créer de compte.
  - *Points* : 3 pts | *Statut* : Done.
- **JOB-312 : Page dédiée aux offres suivies synchronisée avec MySQL**
  - *En tant qu'*étudiant, *je veux* voir ma liste d'offres suivies, pouvoir les trier et tout vider en un clic.
  - *Points* : 3 pts | *Statut* : Done.

---

## Part 2 : Plan des Commits Git (Démarche Humaine en 5 Étapes)

Vous pouvez suivre cet ordre chronologique pour commiter votre travail. Cela démontre une progression logique et professionnelle lors de la soutenance.

---

### Étape 1 : Branche `brief-3/database-and-seed`

```bash
git checkout -b brief-3/database-and-seed
```

#### Commit 1.1 : Initialisation du projet et dépendances
```bash
git add package.json .gitignore .env.example
git commit -m "chore: initialize express project structure and dependencies"
```
*Ce que vous expliquez à l'évaluateur :* "J'ai configuré `package.json` avec Express, EJS, mysql2 et dotenv, et j'ai créé un `.env.example` pour ne jamais versionner les identifiants réels."

#### Commit 1.2 : Schéma SQL relationnel
```bash
git add database/schema.sql docs/diagrams.md
git commit -m "feat(db): define relational schema with constraints and foreign keys"
```
*Ce que vous expliquez :* "J'ai conçu 4 tables normalisées : `entreprise`, `offre`, `technologie` et la table d'association `offre_technologie`. J'ai utilisé `ON DELETE CASCADE` pour assurer l'intégrité référentielle."

#### Commit 1.3 : Connexion MySQL et script Seeder
```bash
git add database/db.js database/seed.js database/reset.js
git commit -m "feat(db): implement mysql connection pool and automated seeder"
```
*Ce que vous expliquez :* "J'ai créé un pool de connexions `mysql2/promise` et un seeder qui injecte automatiquement 6 entreprises, 10 technologies et 12 offres avec des messages console clairs."

---

### Étape 2 : Branche `brief-3/express-public-pages`

```bash
git checkout -b brief-3/express-public-pages
```

#### Commit 2.1 : Couche d'accès aux données (Repositories)
```bash
git add repositories/
git commit -m "feat(repo): create data access layer with prepared statements"
```
*Ce que vous expliquez :* "Toutes les requêtes SQL sont encapsulées dans des fonctions dédiées et utilisent systématiquement des placeholders `?` pour se prémunir totalement contre les failles d'injection SQL."

#### Commit 2.2 : Vues publiques EJS et Partials
```bash
git add views/partials/ views/pages/index.ejs views/pages/offre-detail.ejs public/css/
git commit -m "feat(views): implement responsive ejs templates with header and navbar partials"
```
*Ce que vous expliquez :* "J'ai factorisé le HTML avec des partials (`header`, `navbar`, `footer`) et affiché les données réelles en provenance de MySQL grâce aux boucles EJS."

#### Commit 2.3 : Routes publiques, recherche et filtrage serveur
```bash
git add routes/publicRoutes.js server.js
git commit -m "feat(routes): handle server-side filtering, keyword search, and sorting"
```
*Ce que vous expliquez :* "Le filtrage par ville, contrat et mot-clé ne se fait plus côté navigateur sur un fichier JSON : c'est le serveur Express qui construit la clause SQL `WHERE` dynamiquement."

---

### Étape 3 : Branche `brief-3/admin-crud`

```bash
git checkout -b brief-3/admin-crud
```

#### Commit 3.1 : Tableau de bord d'administration et suppression
```bash
git add views/pages/admin/index.ejs routes/adminRoutes.js
git commit -m "feat(admin): list all offers with quick actions and delete handler"
```
*Ce que vous expliquez :* "La console d'administration affiche toutes les offres en direct depuis MySQL et permet la suppression avec confirmation utilisateur."

#### Commit 3.2 : Formulaire de création et modification avec technologies
```bash
git add views/pages/admin/form.ejs
git commit -m "feat(admin): add reusable form for creating and editing offers"
```
*Ce que vous expliquez :* "Le formulaire permet de renseigner les détails du poste et de cocher plusieurs technologies, gérant à la fois les requêtes INSERT et UPDATE dans `offre_technologie`."

---

### Étape 4 : Branche `brief-3/localstorage-followed`

```bash
git checkout -b brief-3/localstorage-followed
```

#### Commit 4.1 : Logique simplifiée de localStorage
```bash
git add public/js/storage.js public/js/bookmarks.js
git commit -m "feat(storage): implement simplified localstorage helper for bookmarked offers"
```
*Ce que vous expliquez :* "Le code de localStorage a été simplifié au maximum : on ne stocke que les identifiants numériques dans un tableau JSON `[1, 4, 9]` via `JSON.stringify` et `JSON.parse`."

#### Commit 4.2 : Page des offres suivies et API dédiée
```bash
git add views/pages/offres-suivies.ejs public/js/followed.js
git commit -m "feat(followed): display tracked offers with clear and sorting features"
```
*Ce que vous expliquez :* "La page dédiée lit les IDs du navigateur, appelle l'endpoint `/api/offres-suivies?ids=...` et injecte les offres correspondantes."

---

### Étape 5 : Branche `brief-3/documentation-readme`

```bash
git checkout -b brief-3/documentation-readme
```

#### Commit 5.1 : Documentation complète et README final
```bash
git add README.md docs/
git commit -m "docs: complete readme installation guide and technical architecture"
```
*Ce que vous expliquez :* "Le README contient la procédure d'installation pas-à-pas pour macOS avec DBngin et TablePlus, les scripts npm et le récapitulatif d'architecture."
