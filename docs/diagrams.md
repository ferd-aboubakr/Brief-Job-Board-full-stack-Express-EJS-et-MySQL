# Documentation Technique & Diagrammes - Job Board Full-Stack

Ce dossier rassemble l'ensemble des diagrammes de conception exigés par le référentiel et le cahier des charges du projet.

---

## 1. Diagramme de Classes UML (Domaine Métier)

Ce diagramme modélise les entités principales de l'application, leurs attributs et leurs relations :
- Une **Entreprise** peut publier plusieurs **Offres** (1 à N).
- Une **Offre** est rattachée à une seule **Entreprise** (1 à 1).
- Une **Offre** requiert plusieurs **Technologies** et une **Technologie** peut être demandée par plusieurs **Offres** (N à N).

```mermaid
classDiagram
    class Entreprise {
        +int id
        +string nom
        +string description
        +string secteur
        +string ville
        +string site_web
        +string logo_url
    }

    class Offre {
        +int id
        +string titre
        +string description_courte
        +string description_longue
        +string profil_recherche
        +string ville
        +string type_contrat
        +date date_publication
        +string contact_email
        +string lien_candidature
        +int entreprise_id
    }

    class Technologie {
        +int id
        +string nom
    }

    Entreprise "1" --> "0..*" Offre : publie
    Offre "0..*" <--> "1..*" Technologie : requiert
```

---

## 2. Diagramme de Cas d'Utilisation (Use Cases)

Identifie les interactions entre les utilisateurs du système :
- **Visiteur / Étudiant** : Consultation, recherche, filtres (ville, contrat, techno), tri, gestion des favoris locaux.
- **Administrateur / Recruteur** : Gestion complète (CRUD) des offres et association des compétences techniques.

```mermaid
flowchart LR
    subgraph Acteurs
        V["👤 Visiteur / Étudiant"]
        A["🛡️ Administrateur"]
    end

    subgraph "Application Job Board"
        UC1["Consulter la liste des offres"]
        UC2["Filtrer par contrat, ville, techno"]
        UC3["Rechercher par mot-clé"]
        UC4["Trier par date de publication"]
        UC5["Consulter le détail d'une offre"]
        UC6["Suivre / Retirer des offres (localStorage)"]
        
        UC7["Accéder au back-office"]
        UC8["Créer une nouvelle offre"]
        UC9["Associer des technologies"]
        UC10["Modifier une offre existante"]
        UC11["Supprimer une offre"]
    end

    V --> UC1
    V --> UC2
    V --> UC3
    V --> UC4
    V --> UC5
    V --> UC6

    A --> UC7
    A --> UC8
    A --> UC10
    A --> UC11

    UC8 -.->|include| UC9
    UC10 -.->|include| UC9
```

---

## 3. Modèle Relationnel Logique (MLD / LRM)

Traduction du diagramme de classes en schéma relationnel normalisé avec clés primaires (PK) et clés étrangères (FK) :

- **ENTREPRISE** (<ins>id</ins>, nom, description, secteur, ville, site_web, logo_url, created_at)
- **TECHNOLOGIE** (<ins>id</ins>, nom)
- **OFFRE** (<ins>id</ins>, titre, description_courte, description_longue, profil_recherche, ville, type_contrat, date_publication, contact_email, lien_candidature, #entreprise_id, created_at)
  - Clé étrangère : *entreprise_id* fait référence à *ENTREPRISE(id)* avec suppression en cascade (`ON DELETE CASCADE`).
- **OFFRE_TECHNOLOGIE** (<ins>#offre_id, #technologie_id</ins>)
  - Clé primaire composite : *(offre_id, technologie_id)*
  - Clé étrangère : *offre_id* fait référence à *OFFRE(id)* (`ON DELETE CASCADE`)
  - Clé étrangère : *technologie_id* fait référence à *TECHNOLOGIE(id)* (`ON DELETE CASCADE`)

```mermaid
erDiagram
    ENTREPRISE ||--o{ OFFRE : "publie (1,n)"
    OFFRE ||--|{ OFFRE_TECHNOLOGIE : "possede"
    TECHNOLOGIE ||--|{ OFFRE_TECHNOLOGIE : "associee"

    ENTREPRISE {
        int id PK
        varchar nom
        text description
        varchar secteur
        varchar ville
        varchar site_web
        varchar logo_url
    }

    OFFRE {
        int id PK
        varchar titre
        varchar description_courte
        text description_longue
        text profil_recherche
        varchar ville
        varchar type_contrat
        date date_publication
        varchar contact_email
        varchar lien_candidature
        int entreprise_id FK
    }

    TECHNOLOGIE {
        int id PK
        varchar nom
    }

    OFFRE_TECHNOLOGIE {
        int offre_id PK,FK
        int technologie_id PK,FK
    }
```

---

## 4. Diagramme de Séquence (Flux Route Express -> Repository -> MySQL -> Vue EJS)

Ce diagramme illustre le flux complet d'une requête HTTP publique (ex: l'utilisateur filtre les offres sur la page d'accueil) :

```mermaid
sequenceDiagram
    autonumber
    actor U as 🌐 Navigateur Client
    participant R as 🔀 Route Express (publicRoutes.js)
    participant Repo as 📦 Repository (offreRepository.js)
    participant DB as 🗄️ MySQL (mysql2 pool)
    participant V as 📄 Vue EJS (index.ejs)

    U->>R: GET /?contract=Stage&location=Paris
    Note over R: 1. Récupère req.query<br/>Valide les paramètres
    R->>Repo: getAll({ contract: 'Stage', location: 'Paris' })
    Note over Repo: 2. Prépare SQL avec '?'<br/>Placeholders sécurisés
    Repo->>DB: pool.query("SELECT ... WHERE type_contrat = ? AND ville = ?", ['Stage', 'Paris'])
    DB-->>Repo: Retourne les lignes SQL brutes
    Note over Repo: 3. Formate les objets<br/>(tableau de technologies)
    Repo-->>R: Retourne le tableau d'offres
    R->>V: res.render('pages/index', { offers, filters, counts })
    Note over V: 4. Injection des données dans le HTML<br/>Boucle EJS <% offers.forEach %>
    V-->>U: Réponse HTTP 200 avec page HTML complète
```

---

## 5. Diagramme d'Activité (Création d'une Offre en Back-Office)

Illustre le cycle de vie de la soumission d'une offre depuis le formulaire administrateur jusqu'à la persistance en base :

```mermaid
flowchart TD
    Start([Début : L'admin clique sur '+ Nouvelle offre']) --> FormView[Express affiche le formulaire EJS avec la liste des entreprises et technos]
    FormView --> FillData[L'administrateur renseigne les champs et coche les technologies]
    FillData --> SubmitForm[Soumission du formulaire POST /admin/offres]
    SubmitForm --> Validate{Champs obligatoires valides ?}
    
    Validate -- Non --> ReturnError[Affichage du formulaire avec message d'erreur]
    ReturnError --> FillData

    Validate -- Oui --> InsertOffer[1. INSERT INTO offre avec paramètres ? sécurisés]
    InsertOffer --> GetOfferId[Récupération de l'ID généré insertId]
    GetOfferId --> HasTechs{Des technologies sont-elles cochées ?}

    HasTechs -- Oui --> LoopTechs[2. Pour chaque ID techno : INSERT INTO offre_technologie]
    LoopTechs --> Redirect[3. Redirection HTTP 302 vers /admin]
    
    HasTechs -- Non --> Redirect

    Redirect --> AdminList[L'administrateur visualise l'offre ajoutée dans la liste]
    AdminList --> End([Fin])
```
