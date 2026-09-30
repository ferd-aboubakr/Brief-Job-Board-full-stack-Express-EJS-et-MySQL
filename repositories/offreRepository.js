// repositories/offreRepository.js
// Couche d'acces aux donnees pour la table 'offre'
const pool = require('../database/db');

// Fonction utilitaire pour formater une ligne retournee par MySQL
function formatRow(row) {
  return {
    ...row,
    technologies: row.technologies_str ? row.technologies_str.split(',') : [],
    technology_ids: row.technologies_ids_str ? row.technologies_ids_str.split(',').map(Number) : []
  };
}

// 1. Recuperer toutes les offres avec filtres, recherche et tri
async function getAll(filters = {}) {
  const conditions = [];
  const params = [];

  // Filtre par type de contrat (Stage, Alternance)
  if (filters.contract && filters.contract !== 'all') {
    conditions.push('o.type_contrat = ?');
    params.push(filters.contract);
  }

  // Filtre par ville (Paris, Lyon, Nantes, Remote)
  if (filters.location && filters.location !== 'all') {
    conditions.push('o.ville = ?');
    params.push(filters.location);
  }

  // Recherche par mot-cle (dans le titre, la description courte ou le nom de l'entreprise)
  if (filters.q && filters.q.trim() !== '') {
    conditions.push('(o.titre LIKE ? OR o.description_courte LIKE ? OR e.nom LIKE ?)');
    const term = `%${filters.q.trim()}%`;
    params.push(term, term, term);
  }

  // Filtre par technologie
  if (filters.technology && filters.technology !== 'all') {
    conditions.push(`
      o.id IN (
        SELECT ot_sub.offre_id
        FROM offre_technologie ot_sub
        JOIN technologie t_sub ON ot_sub.technologie_id = t_sub.id
        WHERE t_sub.nom = ?
      )
    `);
    params.push(filters.technology);
  }

  let sql = `
    SELECT o.*,
           e.nom AS entreprise_nom,
           e.logo_url AS entreprise_logo,
           GROUP_CONCAT(DISTINCT t.nom ORDER BY t.nom SEPARATOR ',') AS technologies_str
    FROM offre o
    JOIN entreprise e ON o.entreprise_id = e.id
    LEFT JOIN offre_technologie ot ON o.id = ot.offre_id
    LEFT JOIN technologie t ON ot.technologie_id = t.id
  `;

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  sql += ' GROUP BY o.id';

  // Tri par date
  if (filters.sort === 'oldest') {
    sql += ' ORDER BY o.date_publication ASC';
  } else {
    sql += ' ORDER BY o.date_publication DESC';
  }

  const [rows] = await pool.query(sql, params);
  return rows.map(formatRow);
}

// 2. Recuperer une offre par son ID
async function getById(id) {
  const sql = `
    SELECT o.*,
           e.nom AS entreprise_nom,
           e.site_web AS entreprise_site_web,
           e.secteur AS entreprise_secteur,
           e.logo_url AS entreprise_logo,
           GROUP_CONCAT(DISTINCT t.nom ORDER BY t.nom SEPARATOR ',') AS technologies_str,
           GROUP_CONCAT(DISTINCT t.id SEPARATOR ',') AS technologies_ids_str
    FROM offre o
    JOIN entreprise e ON o.entreprise_id = e.id
    LEFT JOIN offre_technologie ot ON o.id = ot.offre_id
    LEFT JOIN technologie t ON ot.technologie_id = t.id
    WHERE o.id = ?
    GROUP BY o.id
  `;
  const [rows] = await pool.query(sql, [id]);
  if (rows.length === 0) return null;
  return formatRow(rows[0]);
}

// 3. Recuperer plusieurs offres par leurs IDs (pour les offres suivies dans localStorage)
async function getByIds(ids = []) {
  if (!ids || ids.length === 0) return [];

  // Preparation des placeholders ? selon la taille du tableau d'IDs
  const placeholders = ids.map(() => '?').join(',');
  const sql = `
    SELECT o.*,
           e.nom AS entreprise_nom,
           e.logo_url AS entreprise_logo,
           GROUP_CONCAT(DISTINCT t.nom ORDER BY t.nom SEPARATOR ',') AS technologies_str
    FROM offre o
    JOIN entreprise e ON o.entreprise_id = e.id
    LEFT JOIN offre_technologie ot ON o.id = ot.offre_id
    LEFT JOIN technologie t ON ot.technologie_id = t.id
    WHERE o.id IN (${placeholders})
    GROUP BY o.id
    ORDER BY o.date_publication DESC
  `;

  const [rows] = await pool.query(sql, ids);
  return rows.map(formatRow);
}

// 4. Compter les offres par type de contrat (pour les badges du filtre)
async function getContractCounts() {
  const sql = `
    SELECT type_contrat, COUNT(*) AS total
    FROM offre
    GROUP BY type_contrat
  `;
  const [rows] = await pool.query(sql);

  const counts = { total: 0, stage: 0, alternance: 0 };
  for (const row of rows) {
    counts.total += row.total;
    if (row.type_contrat === 'Stage') counts.stage = row.total;
    if (row.type_contrat === 'Alternance') counts.alternance = row.total;
  }
  return counts;
}

// 5. Creer une nouvelle offre avec ses technologies
async function create(data, technologyIds = []) {
  const sql = `
    INSERT INTO offre (
      titre, description_courte, description_longue, profil_recherche,
      ville, type_contrat, date_publication, contact_email, lien_candidature, entreprise_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await pool.query(sql, [
    data.titre,
    data.description_courte,
    data.description_longue,
    data.profil_recherche,
    data.ville,
    data.type_contrat,
    data.date_publication || new Date().toISOString().split('T')[0],
    data.contact_email || null,
    data.lien_candidature || null,
    data.entreprise_id
  ]);

  const newId = result.insertId;

  // Lier les technologies selectionnees
  if (Array.isArray(technologyIds) && technologyIds.length > 0) {
    for (const techId of technologyIds) {
      if (techId) {
        await pool.query(
          'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)',
          [newId, techId]
        );
      }
    }
  }

  return newId;
}

// 6. Mettre a jour une offre existante
async function update(id, data, technologyIds = []) {
  const sql = `
    UPDATE offre
    SET titre = ?,
        description_courte = ?,
        description_longue = ?,
        profil_recherche = ?,
        ville = ?,
        type_contrat = ?,
        contact_email = ?,
        lien_candidature = ?,
        entreprise_id = ?
    WHERE id = ?
  `;

  await pool.query(sql, [
    data.titre,
    data.description_courte,
    data.description_longue,
    data.profil_recherche,
    data.ville,
    data.type_contrat,
    data.contact_email || null,
    data.lien_candidature || null,
    data.entreprise_id,
    id
  ]);

  // Remplacer les associations de technologies
  await pool.query('DELETE FROM offre_technologie WHERE offre_id = ?', [id]);

  if (Array.isArray(technologyIds) && technologyIds.length > 0) {
    for (const techId of technologyIds) {
      if (techId) {
        await pool.query(
          'INSERT INTO offre_technologie (offre_id, technologie_id) VALUES (?, ?)',
          [id, techId]
        );
      }
    }
  }
}

// 7. Supprimer une offre
async function deleteById(id) {
  // Grace a ON DELETE CASCADE, les lignes dans offre_technologie sont automatiquement supprimees
  await pool.query('DELETE FROM offre WHERE id = ?', [id]);
}

module.exports = {
  getAll,
  getById,
  getByIds,
  getContractCounts,
  create,
  update,
  deleteById
};
