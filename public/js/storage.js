const STORAGE_KEY = 'mern_followed_offers';

function getFollowedIds() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function isFollowed(id) {
  return getFollowedIds().includes(Number(id));
}

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

function removeFollowed(id) {
  const numId = Number(id);
  const ids = getFollowedIds().filter(item => item !== numId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
}

function clearAllFollowed() {
  localStorage.removeItem(STORAGE_KEY);
}
