const express = require('express');
const path = require('path');
require('dotenv').config();

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', publicRoutes);
app.use('/admin', adminRoutes);

app.use((req, res) => {
  res.status(404).render('pages/index', {
    offers: [],
    counts: { total: 0, stage: 0, alternance: 0 },
    technologies: [],
    filters: {}
  });
});

app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack || err.message);
  res.status(500).send(`
    <div style="font-family:sans-serif;padding:2rem;text-align:center;">
      <h1 style="color:#ef4444;">Une erreur est survenue sur le serveur</h1>
      <p style="color:#64748b;">${err.message}</p>
      <a href="/" style="color:#2563eb;">Retour à l'accueil</a>
    </div>
  `);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur Job Board démarré sur http://localhost:${PORT}`);
});
