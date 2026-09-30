// routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const offreRepository = require('../repositories/offreRepository');
const entrepriseRepository = require('../repositories/entrepriseRepository');
const technologieRepository = require('../repositories/technologieRepository');

// Helper pour normaliser les IDs de technologies recus du formulaire
function extractTechnologyIds(rawTechs) {
  if (!rawTechs) return [];
  if (Array.isArray(rawTechs)) {
    return rawTechs.map(id => parseInt(id, 10)).filter(id => !isNaN(id));
  }
  const singleId = parseInt(rawTechs, 10);
  return isNaN(singleId) ? [] : [singleId];
}

// 1. Liste de toutes les offres (Tableau de bord admin)
router.get('/', async (req, res, next) => {
  try {
    const [offers, counts] = await Promise.all([
      offreRepository.getAll(),
      offreRepository.getContractCounts()
    ]);

    res.render('pages/admin/index', {
      offers,
      counts
    });
  } catch (err) {
    next(err);
  }
});

// 2. Afficher le formulaire de creation
router.get('/offres/nouveau', async (req, res, next) => {
  try {
    const [entreprises, technologies] = await Promise.all([
      entrepriseRepository.getAll(),
      technologieRepository.getAll()
    ]);

    res.render('pages/admin/form', {
      isEdit: false,
      offer: null,
      entreprises,
      technologies
    });
  } catch (err) {
    next(err);
  }
});

// 3. Traiter la creation d'une offre
router.post('/offres', async (req, res, next) => {
  try {
    const technologyIds = extractTechnologyIds(req.body.technologies);
    await offreRepository.create(req.body, technologyIds);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

// 4. Afficher le formulaire de modification
router.get('/offres/:id/modifier', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const [offer, entreprises, technologies] = await Promise.all([
      offreRepository.getById(id),
      entrepriseRepository.getAll(),
      technologieRepository.getAll()
    ]);

    if (!offer) {
      return res.redirect('/admin');
    }

    res.render('pages/admin/form', {
      isEdit: true,
      offer,
      entreprises,
      technologies
    });
  } catch (err) {
    next(err);
  }
});

// 5. Traiter la modification d'une offre
router.post('/offres/:id/modifier', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    const technologyIds = extractTechnologyIds(req.body.technologies);
    await offreRepository.update(id, req.body, technologyIds);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

// 6. Traiter la suppression d'une offre
router.post('/offres/:id/supprimer', async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    await offreRepository.deleteById(id);
    res.redirect('/admin');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
