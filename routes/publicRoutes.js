// routes/publicRoutes.js
const express = require('express');
const router = express.Router();

const offreRepository = require('../repositories/offreRepository');
const technologieRepository = require('../repositories/technologieRepository');

// 1. Page d'accueil : liste des offres avec filtres, recherche et tri
router.get('/', async (req, res, next) => {
  try {
    const filters = {
      q: req.query.q || '',
      contract: req.query.contract || 'all',
      location: req.query.location || 'all',
      technology: req.query.technology || 'all',
      sort: req.query.sort || 'newest'
    };

    // Requetes MySQL en parallele
    const [offers, counts, technologies] = await Promise.all([
      offreRepository.getAll(filters),
      offreRepository.getContractCounts(),
      technologieRepository.getAll()
    ]);

    res.render('pages/index', {
      offers,
      counts,
      technologies,
      filters
    });
  } catch (err) {
    next(err);
  }
});

// 2. Page des offres suivies (stockees dans le localStorage)
router.get('/offres-suivies', (req, res) => {
  res.render('pages/offres-suivies');
});

// 3. API : recuperer les details des offres suivies a partir d'une liste d'IDs
router.get('/api/offres-suivies', async (req, res, next) => {
  try {
    const idsQuery = req.query.ids || '';
    const ids = idsQuery
      .split(',')
      .map(id => parseInt(id.trim(), 10))
      .filter(id => !isNaN(id) && id > 0);

    const offers = await offreRepository.getByIds(ids);
    res.json(offers);
  } catch (err) {
    next(err);
  }
});

// 4. Page de detail d'une offre
router.get('/offres/:id', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.redirect('/');
    }

    const offer = await offreRepository.getById(id);
    if (!offer) {
      return res.status(404).send('Offre non trouvée');
    }

    res.render('pages/offre-detail', { offer });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
