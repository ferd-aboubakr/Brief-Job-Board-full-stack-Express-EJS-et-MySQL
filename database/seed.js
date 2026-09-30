const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'job_board_mern'
};

async function seed() {
  console.log('🌱 [Seeder] Connexion à MySQL...');

  // 1. Connexion initiale sans base specifique pour creer la base si elle n'existe pas
  const initialConnection = await mysql.createConnection({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password
  });

  await initialConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await initialConnection.end();

  // 2. Connexion avec la base de donnees active
  const connection = await mysql.createConnection(dbConfig);

  console.log(`📦 [Seeder] Initialisation du schema dans la base '${dbConfig.database}'...`);

  // Lecture et execution du schema.sql
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

  // Separer les requetes par point-virgule pour mysql2
  const statements = schemaSql
    .split(';')
    .map(st => st.trim())
    .filter(st => st.length > 0);

  for (const statement of statements) {
    await connection.query(statement);
  }

  console.log('✅ [Seeder] Tables creees avec succes (schema.sql applique).');

  // 3. Insertion des Entreprises (6 entreprises)
  console.log('🏢 [Seeder] Insertion des entreprises...');
  const entreprises = [
    {
      nom: 'Scaleway Cloud',
      description: 'Fournisseur européen de cloud computing, infrastructure haute performance et services managés.',
      secteur: 'Cloud & Infrastructure',
      ville: 'Paris',
      site_web: 'https://scaleway.com',
      logo_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100'
    },
    {
      nom: 'DoctoTech Solutions',
      description: 'Plateforme e-santé simplifiant la prise de rendez-vous médicaux et la téléconsultation sécurisée.',
      secteur: 'Santé & MedTech',
      ville: 'Lyon',
      site_web: 'https://doctotech.fr',
      logo_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100'
    },
    {
      nom: 'PayFlow Analytics',
      description: 'Fintech spécialisée dans l automatisation de la réconciliation bancaire et le scoring de trésorerie.',
      secteur: 'Fintech & SaaS',
      ville: 'Remote',
      site_web: 'https://payflow.io',
      logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100'
    },
    {
      nom: 'GreenPulse Studio',
      description: 'Studio digital engagé dans le calcul d impact carbone et l éco-conception d applications web.',
      secteur: 'GreenTech & RSE',
      ville: 'Nantes',
      site_web: 'https://greenpulse.io',
      logo_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=100'
    },
    {
      nom: 'Nexus Interactive',
      description: 'Agence web créative concevant des expériences immersives et des plateformes e-commerce sur mesure.',
      secteur: 'Agence Web & E-commerce',
      ville: 'Paris',
      site_web: 'https://nexusinteractive.fr',
      logo_url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=100'
    },
    {
      nom: 'Qonto Tech',
      description: 'Solution de gestion financière pour les PME et indépendants leader en Europe.',
      secteur: 'Fintech B2B',
      ville: 'Paris',
      site_web: 'https://qonto.com',
      logo_url: 'https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=100'
    }
  ];

  const entrepriseMap = {}; // nom -> id
  for (const ent of entreprises) {
    const [result] = await connection.query(
      'INSERT INTO entreprise (nom, description, secteur, ville, site_web, logo_url) VALUES (?, ?, ?, ?, ?, ?)',
      [ent.nom, ent.description, ent.secteur, ent.ville, ent.site_web, ent.logo_url]
    );
    entrepriseMap[ent.nom] = result.insertId;
  }
  console.log(`✅ [Seeder] ${entreprises.length} entreprises insérées.`);

  // 4. Insertion des Technologies (10 technologies)
  console.log('⚡ [Seeder] Insertion des technologies...');
  const technologies = [
    'React',
    'Node.js',
    'MongoDB',
    'TypeScript',
    'Express',
    'Next.js',
    'Tailwind CSS',
    'Docker',
    'GraphQL',
    'Jest'
  ];

  const technoMap = {}; // nom -> id
  for (const tech of technologies) {
    const [result] = await connection.query(
      'INSERT INTO technologie (nom) VALUES (?)',
      [tech]
    );
    technoMap[tech] = result.insertId;
  }
  console.log(`✅ [Seeder] ${technologies.length} technologies insérées.`);

  // 5. Insertion des Offres (12 offres) avec associations
  console.log('📋 [Seeder] Insertion des offres...');
  const offres = [
    {
      titre: 'Développeur Fullstack MERN – Plateforme Core',
      entreprise: 'Scaleway Cloud',
      ville: 'Paris',
      type_contrat: 'Alternance',
      technologies: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
      date_publication: '2026-03-16',
      description_courte: 'Intégrez l équipe Compute pour concevoir les portails d administration interne.',
      description_longue: 'Au sein d une squad de 6 développeurs, vous participerez activement aux chantiers d architecture web et de micro-services. Vous contribuerez à l intégration des composants d interface React et développerez les endpoints backend Express.',
      profil_recherche: 'Étudiant en bac+3/5 informatique. Bonne maîtrise de JavaScript moderne (ES6+), bases solides en React et Node.js, rigueur et sensibilité aux architectures distribuées.',
      contact_email: null,
      lien_candidature: 'https://scaleway.com/careers'
    },
    {
      titre: 'Stage Frontend & BFF – React / Express',
      entreprise: 'DoctoTech Solutions',
      ville: 'Lyon',
      type_contrat: 'Stage',
      technologies: ['React', 'Express', 'TypeScript'],
      date_publication: '2026-03-17',
      description_courte: 'Rejoignez notre squad télémédecine pour créer des dashboards praticiens modernes.',
      description_longue: 'Conception d interfaces d administration réactives en React, développement d une couche BFF (Backend for Frontend) sous Express, et consommation d APIs de santé sécurisées.',
      profil_recherche: 'Curiosité pour TypeScript, appétence pour l UX des logiciels médicaux, autonomie et respect des bonnes pratiques de tests.',
      contact_email: 'recrutement@doctotech.fr',
      lien_candidature: null
    },
    {
      titre: 'Ingénieur Backend Node.js / MongoDB',
      entreprise: 'PayFlow Analytics',
      ville: 'Remote',
      type_contrat: 'Alternance',
      technologies: ['Node.js', 'MongoDB', 'Express'],
      date_publication: '2026-03-15',
      description_courte: 'Optimisation de pipelines d agrégation MongoDB pour flux bancaires en temps réel.',
      description_longue: 'Développement d APIs REST hautement scalables sous Express, indexation poussée de collections MongoDB et sécurisation des échanges inter-services.',
      profil_recherche: 'Goût prononcé pour la logique backend, compréhension des requêtes SQL et NoSQL, rigueur dans la gestion des données financières.',
      contact_email: null,
      lien_candidature: 'https://payflow.io/jobs'
    },
    {
      titre: 'Stage Développeur MERN – Bilan Carbone SaaS',
      entreprise: 'GreenPulse Studio',
      ville: 'Nantes',
      type_contrat: 'Stage',
      technologies: ['React', 'Node.js', 'MongoDB'],
      date_publication: '2026-03-14',
      description_courte: 'Participation active au sprint de lancement de la v2 de notre SaaS climat.',
      description_longue: 'Implémentation de dashboards interactifs de visualisation de données d empreinte carbone et création d endpoints backend sous Express.',
      profil_recherche: 'Sensibilité aux enjeux climatiques, esprit d équipe, autonomie et solide maîtrise des bases React/Node.',
      contact_email: 'contact@greenpulse.io',
      lien_candidature: null
    },
    {
      titre: 'Alternant Web Application Engineer (MERN)',
      entreprise: 'Nexus Interactive',
      ville: 'Paris',
      type_contrat: 'Alternance',
      technologies: ['React', 'TypeScript', 'Express'],
      date_publication: '2026-03-13',
      description_courte: 'Création d applications web headless et interfaces client sur mesure.',
      description_longue: 'Accompagnement de nos clients grands comptes dans la digitalisation de leurs services : composants React modulaires, architecture MVC côté backend et optimisation des performances web.',
      profil_recherche: 'Formation bac+2 ou bac+3 en cours, curiosité technique, bon relationnel et esprit de synthèse.',
      contact_email: 'jobs@nexusinteractive.fr',
      lien_candidature: null
    },
    {
      titre: 'Stage Développeur Backend Express & API',
      entreprise: 'Scaleway Cloud',
      ville: 'Paris',
      type_contrat: 'Stage',
      technologies: ['Node.js', 'Express', 'Docker'],
      date_publication: '2026-03-12',
      description_courte: 'Refonte des services d orchestration et automatisation des déploiements.',
      description_longue: 'Conception de scripts d automatisation, mise en place de conteneurs Docker pour les environnements de staging et écriture d endpoints Express pour les API de monitoring.',
      profil_recherche: 'Passionné par l environnement Linux, les outils CLI, la conteneurisation et l architecture backend.',
      contact_email: null,
      lien_candidature: 'https://scaleway.com/careers'
    },
    {
      titre: 'Alternance Frontend React / Design System',
      entreprise: 'Qonto Tech',
      ville: 'Paris',
      type_contrat: 'Alternance',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      date_publication: '2026-03-11',
      description_courte: 'Évolution du Design System et création de composants réutilisables.',
      description_longue: 'Vous intégrerez l équipe Design System pour normaliser les composants d interface, assurer l accessibilité (a11y) et optimiser la vitesse de chargement sur mobile et desktop.',
      profil_recherche: 'Œil attentif aux détails d intégration, bonne connaissance de React et Tailwind, envie d apprendre TypeScript en profondeur.',
      contact_email: 'careers@qonto.com',
      lien_candidature: null
    },
    {
      titre: 'Stage Développeur Full-Stack Node / React',
      entreprise: 'DoctoTech Solutions',
      ville: 'Lyon',
      type_contrat: 'Stage',
      technologies: ['React', 'Node.js', 'Jest'],
      date_publication: '2026-03-10',
      description_courte: 'Développement de modules de notifications et mise en place de tests unitaires.',
      description_longue: 'Écriture de tests unitaires et d intégration avec Jest, refonte des templates de notifications par email et enrichissement du portail utilisateur.',
      profil_recherche: 'Rigueur, méthodique, attrait pour la qualité logicielle et le code testé.',
      contact_email: 'recrutement@doctotech.fr',
      lien_candidature: null
    },
    {
      titre: 'Alternance Développeur GraphQL & Node.js',
      entreprise: 'PayFlow Analytics',
      ville: 'Remote',
      type_contrat: 'Alternance',
      technologies: ['Node.js', 'GraphQL', 'TypeScript'],
      date_publication: '2026-03-09',
      description_courte: 'Migration progressive d API REST vers un schéma unifié GraphQL.',
      description_longue: 'Définition des types et résolveurs GraphQL, optimisation des temps de réponse et documentation des endpoints pour les équipes frontend.',
      profil_recherche: 'Intérêt pour les schémas d API modernes, rigueur dans le typage des données et esprit d initiative.',
      contact_email: null,
      lien_candidature: 'https://payflow.io/jobs'
    },
    {
      titre: 'Stage Ingénieur Web Eco-Conception',
      entreprise: 'GreenPulse Studio',
      ville: 'Nantes',
      type_contrat: 'Stage',
      technologies: ['React', 'Tailwind CSS', 'Node.js'],
      date_publication: '2026-03-08',
      description_courte: 'Audit de performance et optimisation de l impact environnemental de nos outils.',
      description_longue: 'Mesure de l empreinte carbone numérique de sites clients, mise en œuvre de recommandations de réduction de requêtes HTTP et optimisation des assets.',
      profil_recherche: 'Sensibilité au numérique responsable, curiosité intellectuelle et compétences solides en frontend moderne.',
      contact_email: 'contact@greenpulse.io',
      lien_candidature: null
    },
    {
      titre: 'Alternant Développeur Node.js & Docker',
      entreprise: 'Nexus Interactive',
      ville: 'Remote',
      type_contrat: 'Alternance',
      technologies: ['Node.js', 'Docker', 'Express'],
      date_publication: '2026-03-07',
      description_courte: 'Industrialisation des environnements de dev et mise en place de pipelines CI/CD.',
      description_longue: 'Création d images Docker optimisées, standardisation des scripts npm pour toute l équipe et automatisation des phases de tests avant déploiement.',
      profil_recherche: 'Bon esprit de communication, goût pour l infrastructure logicielle et la culture DevOps.',
      contact_email: 'jobs@nexusinteractive.fr',
      lien_candidature: null
    },
    {
      titre: 'Stage Développeur Next.js & React 19',
      entreprise: 'Qonto Tech',
      ville: 'Lyon',
      type_contrat: 'Stage',
      technologies: ['Next.js', 'React', 'TypeScript'],
      date_publication: '2026-03-06',
      description_courte: 'Création de landing pages ultra-rapides et optimisation du référencement naturel.',
      description_longue: 'Intégration de maquettes Figma haute fidélité, rendu hybride SSR/SSG avec Next.js et mesure continue des Core Web Vitals.',
      profil_recherche: 'Maîtrise de HTML/CSS sémantique, bonnes bases sur React et passion pour les performances web.',
      contact_email: 'careers@qonto.com',
      lien_candidature: null
    }
  ];

  for (const o of offres) {
    const entrepriseId = entrepriseMap[o.entreprise];
    const [result] = await connection.query(
      `INSERT INTO offre (titre, description_courte, description_longue, profil_recherche, ville, type_contrat, date_publication, contact_email, lien_candidature, entreprise_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.titre,
        o.description_courte,
        o.description_longue,
        o.profil_recherche,
        o.ville,
        o.type_contrat,
        o.date_publication,
        o.contact_email,
        o.lien_candidature,
        entrepriseId
      ]
    );

    const offreId = result.insertId;

    // Association des technologies
    for (const techName of o.technologies) {
      const techId = technoMap[techName];
      if (techId) {
        await connection.query(
          'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)',
          [offreId, techId]
        );
      }
    }
  }

  console.log(`✅ [Seeder] ${offres.length} offres créées avec leurs technologies associées.`);

  await connection.end();
  console.log('🎉 [Seeder] Base de données initialisée avec succès !');
}

seed().catch(err => {
  console.error('❌ [Seeder] Erreur lors de l exécution :', err.message);
  process.exit(1);
});
