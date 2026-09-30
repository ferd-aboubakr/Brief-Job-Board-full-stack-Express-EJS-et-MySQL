-- ==========================================================
-- Schema de base de donnees : Job Board MERN 2026/2027
-- SGBD : MySQL 8.x
-- ==========================================================

-- Suppression des tables dans l'ordre inverse des dependances (cles etrangeres)
DROP TABLE IF EXISTS offre_technologie;
DROP TABLE IF EXISTS offre;
DROP TABLE IF EXISTS technologie;
DROP TABLE IF EXISTS entreprise;

-- 1. Table des Entreprises
CREATE TABLE entreprise (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  description TEXT,
  secteur VARCHAR(100),
  ville VARCHAR(100),
  site_web VARCHAR(255),
  logo_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table des Technologies (ex: React, Node.js, MongoDB...)
CREATE TABLE technologie (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table des Offres de Stage / Alternance
CREATE TABLE offre (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titre VARCHAR(200) NOT NULL,
  description_courte VARCHAR(300) NOT NULL,
  description_longue TEXT NOT NULL,
  profil_recherche TEXT NOT NULL,
  ville VARCHAR(100) NOT NULL,
  type_contrat VARCHAR(50) NOT NULL, -- 'Stage' ou 'Alternance'
  date_publication DATE NOT NULL,
  contact_email VARCHAR(150),
  lien_candidature VARCHAR(255),
  entreprise_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (entreprise_id) REFERENCES entreprise(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table d'association entre Offres et Technologies (Relation N to N)
CREATE TABLE offre_technologie (
  offre_id INT NOT NULL,
  technologie_id INT NOT NULL,
  PRIMARY KEY (offre_id, technologie_id),
  FOREIGN KEY (offre_id) REFERENCES offre(id) ON DELETE CASCADE,
  FOREIGN KEY (technologie_id) REFERENCES technologie(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
