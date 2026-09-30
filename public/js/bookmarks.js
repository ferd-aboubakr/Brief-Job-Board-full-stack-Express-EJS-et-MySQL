function updateNavCount() {
  const count = getFollowedIds().length;
  document.querySelectorAll('[data-followed-count]').forEach(el => {
    el.textContent = count;
  });
}

function initBookmarks() {
  updateNavCount();

  const checkboxes = document.querySelectorAll('.bookmark-checkbox');
  checkboxes.forEach(box => {
    const offerId = box.dataset.id;
    if (offerId) {
      box.checked = isFollowed(offerId);
    }

    box.addEventListener('change', () => {
      toggleFollowed(offerId);
      updateNavCount();
    });
  });
}

document.addEventListener('DOMContentLoaded', initBookmarks);
