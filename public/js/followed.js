// public/js/followed.js
// Affichage et gestion des offres suivies sur la page dediee

const container = document.querySelector('.followed-offers-grid');
const clearBtn = document.querySelector('.clear-followed-button');
const sortSelect = document.getElementById('followed-sort');

let loadedOffers = [];

// 1. Rendu d'une carte d'offre
function createOfferCard(offer) {
  const badgeClass = offer.type_contrat === 'Stage' ? 'badge-stage' : 'badge-alternance';
  const techBadges = offer.technologies.map(t => `<span class="tech-tag">${t}</span>`).join('');

  return `
    <article class="card offer-card" data-id="${offer.id}">
      <div class="card-header">
        <div class="company-info">
          <div class="company-logo-placeholder">
            ${offer.entreprise_logo ? `<img src="${offer.entreprise_logo}" alt="${offer.entreprise_nom}" style="width:100%;height:100%;object-fit:cover;border-radius:4px;">` : '🏢'}
          </div>
          <div>
            <h3 class="offer-title">
              <a href="/offres/${offer.id}">${offer.titre}</a>
            </h3>
            <div class="company-meta">
              <strong>${offer.entreprise_nom}</strong> • 📍 ${offer.ville}
            </div>
          </div>
        </div>

        <div class="card-top-right">
          <span class="badge ${badgeClass}">${offer.type_contrat}</span>
          <input type="checkbox" id="fav-${offer.id}" class="bookmark-checkbox" data-id="${offer.id}" checked>
          <label for="fav-${offer.id}" class="bookmark-btn" title="Retirer des offres suivies">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
          </label>
        </div>
      </div>

      <p class="offer-description">${offer.description_courte}</p>

      <div class="tech-tags">${techBadges}</div>

      <div class="card-footer">
        <span class="publication-date">Publié le ${new Date(offer.date_publication).toLocaleDateString('fr-FR')}</span>
        <a href="/offres/${offer.id}" class="btn btn-outline btn-sm">Voir l'offre</a>
      </div>
    </article>
  `;
}

// 2. Afficher l'etat vide
function showEmptyState() {
  container.innerHTML = `
    <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--surface); border: 1px dashed var(--border-color); border-radius: var(--radius-lg);">
      <svg style="width:48px;height:48px;color:var(--text-muted);margin-bottom:1rem;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
      <h3 style="font-size:1.125rem;font-weight:700;margin-bottom:0.5rem;">Aucune offre suivie pour le moment</h3>
      <p style="color:var(--text-muted);font-size:0.875rem;margin-bottom:1.5rem;">Cliquez sur l'icône de marque-page d'une offre pour la sauvegarder ici.</p>
      <a href="/" class="btn btn-primary btn-sm">Découvrir les offres</a>
    </div>
  `;
}

// 3. Charger les donnees depuis l'API MySQL
async function loadFollowedOffers() {
  const ids = getFollowedIds();
  updateNavCount();

  if (ids.length === 0) {
    showEmptyState();
    return;
  }

  try {
    const res = await fetch('/api/offres-suivies?ids=' + ids.join(','));
    loadedOffers = await res.json();
    renderList();
  } catch (err) {
    console.error('Erreur chargement offres suivies:', err);
    showEmptyState();
  }
}

// 4. Rendu et tri de la liste
function renderList() {
  if (loadedOffers.length === 0) {
    showEmptyState();
    return;
  }

  const sortValue = sortSelect ? sortSelect.value : 'newest';
  const sorted = [...loadedOffers].sort((a, b) => {
    const dateA = new Date(a.date_publication);
    const dateB = new Date(b.date_publication);
    return sortValue === 'oldest' ? dateA - dateB : dateB - dateA;
  });

  container.innerHTML = sorted.map(createOfferCard).join('');

  // Ecouteur pour retirer une offre
  container.querySelectorAll('.bookmark-checkbox').forEach(box => {
    box.addEventListener('change', () => {
      const id = box.dataset.id;
      removeFollowed(id);
      loadedOffers = loadedOffers.filter(o => o.id !== Number(id));
      renderList();
      updateNavCount();
    });
  });
}

// 5. Gestion des evenements
if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    if (confirm('Voulez-vous vraiment effacer toutes vos offres suivies ?')) {
      clearAllFollowed();
      loadedOffers = [];
      showEmptyState();
      updateNavCount();
    }
  });
}

if (sortSelect) {
  sortSelect.addEventListener('change', renderList);
}

document.addEventListener('DOMContentLoaded', loadFollowedOffers);
