// public/js/storage.js
// Gestion simplifiee du localStorage pour les offres suivies

const STORAGE_KEY = 'mern_followed_offers';

// 1. Lire la liste des IDs sauvegardes (ex: [1, 4, 9])
function getFollowedIds() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

// 2. Verifier si une offre est deja suivie
function isFollowed(id) {
  return getFollowedIds().includes(Number(id));
}

// 3. Basculer : ajouter si absent, retirer si present
function toggleFollowed(id) {
  const numId = Number(id);
  let ids = getFollowedIds();

  if (ids.includes(numId)) {
    ids = ids.filter(item => item !== numId);
  } else {
    ids.push(numId);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  return ids.includes(numId);
}

// 4. Supprimer une seule offre
function removeFollowed(id) {
  const numId = Number(id);
  const ids = getFollowedIds().filter(item => item !== numId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

// 5. Tout effacer
function clearAllFollowed() {
  localStorage.removeItem(STORAGE_KEY);
}
