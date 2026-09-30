// repositories/entrepriseRepository.js
const pool = require('../database/db');

// Recuperer toutes les entreprises pour le formulaire de depot/edition
async function getAll() {
  const [rows] = await pool.query('SELECT * FROM entreprise ORDER BY nom ASC');
  return rows;
}

// Recuperer une entreprise par son ID
async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM entreprise WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = {
  getAll,
  getById
};
