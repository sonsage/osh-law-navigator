import type { FavoriteItem } from "../types/navigation";

const favoriteKey = "osh-law-navigator:favorites";
export const favoriteChangedEvent = "osh-law-navigator:favorites-changed";

export const loadFavorites = (): FavoriteItem[] => {
  try {
    return JSON.parse(localStorage.getItem(favoriteKey) || "[]") as FavoriteItem[];
  } catch {
    return [];
  }
};

export const saveFavorites = (items: FavoriteItem[]) => {
  localStorage.setItem(favoriteKey, JSON.stringify(items));
};

export const sameFavorite = (a: FavoriteItem, b: FavoriteItem) => a.type === b.type && a.id === b.id;

export const addFavorite = (item: FavoriteItem) => {
  const current = loadFavorites();
  const next = current.some((favorite) => sameFavorite(favorite, item))
    ? current.map((favorite) => (sameFavorite(favorite, item) ? { ...favorite, ...item } : favorite))
    : [{ ...item, createdAt: new Date().toISOString() }, ...current];
  saveFavorites(next);
  window.dispatchEvent(new CustomEvent(favoriteChangedEvent));
  return next;
};
