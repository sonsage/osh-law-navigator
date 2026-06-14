import type { FavoriteItem, NoteItem } from "../types/navigation";

const notesKey = "osh-law-navigator:notes";

export const loadNotes = (): NoteItem[] => {
  try {
    return JSON.parse(localStorage.getItem(notesKey) || "[]") as NoteItem[];
  } catch {
    return [];
  }
};

export const saveNotes = (notes: NoteItem[]) => {
  localStorage.setItem(notesKey, JSON.stringify(notes));
};

export const createNoteFromFavorite = (favorite: FavoriteItem): NoteItem => ({
  id: `note:${favorite.id}`,
  title: favorite.title,
  sourceLabel: favorite.sourceLabel ?? "AI 搜尋收藏",
  keyword: favorite.keyword ?? favorite.title,
  searchQuery: favorite.searchQuery ?? favorite.subtitle,
  searchUrl: favorite.url,
  content: "",
  createdAt: new Date().toISOString(),
});

export const sameNote = (a: NoteItem, b: NoteItem) => a.id === b.id;
