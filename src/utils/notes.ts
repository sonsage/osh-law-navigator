import type { FavoriteItem, NoteItem } from "../types/navigation";

const notesKey = "osh-law-navigator:notes";

const isAutoFormulaNote = (content: string) => /^\s*【[^】]+】\s*\n\s*〔[^〕]+〕/.test(content);

export const loadNotes = (): NoteItem[] => {
  try {
    const notes = JSON.parse(localStorage.getItem(notesKey) || "[]") as NoteItem[];
    const cleanedNotes = notes.map((note) => isAutoFormulaNote(note.content) ? { ...note, content: "" } : note);
    if (cleanedNotes.some((note, index) => note.content !== notes[index]?.content)) {
      localStorage.setItem(notesKey, JSON.stringify(cleanedNotes));
    }
    return cleanedNotes;
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
