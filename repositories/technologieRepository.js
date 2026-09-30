// repositories/technologieRepository.js
const pool = require('../database/db');

// Recuperer toutes les technologies pour les filtres et les formulaires
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM technologie ORDER BY nom ASC');
  return rows;
}

module.exports = {
  getAll
};
