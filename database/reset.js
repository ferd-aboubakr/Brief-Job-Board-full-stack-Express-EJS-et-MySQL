// database/reset.js
// Permet de repartir d'une base propre a partir du schema et du seeder
console.log('🔄 [Reset] Réinitialisation de la base de données...');

// On execute directement le script seed.js qui s'occupe de drop, recreer et re-peupler
require('./seed.js');
