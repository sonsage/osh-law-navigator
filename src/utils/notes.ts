import { calculationFormulaGroups } from "../data/calculationFormulaNotes";
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

export const buildFormulaNoteContent = (favorite: FavoriteItem) => {
  const searchText = [
    favorite.title,
    favorite.keyword,
    favorite.searchQuery,
    favorite.subtitle,
    favorite.sourceLabel,
  ].filter(Boolean).join(" ").toLowerCase();

  const matchedGroups = calculationFormulaGroups.filter((group) => {
    const groupTitle = group.title.toLowerCase();
    return searchText.includes(groupTitle)
      || group.formulas.some((formula) => searchText.includes(formula.name.toLowerCase().split(" ")[0]));
  });

  const keywordMatches = calculationFormulaGroups.filter((group) => {
    if (matchedGroups.includes(group)) return false;
    return group.formulas.some((formula) => [
      formula.name,
      formula.expression,
      formula.note ?? "",
    ].some((value) => searchText.includes(value.toLowerCase())));
  });

  const groups = [...matchedGroups, ...keywordMatches];
  if (groups.length === 0) {
    return "";
  }

  return groups.map((group) => [
    `【${group.title}】`,
    ...group.formulas.map((formula) => {
      const sourcePrefix = formula.sourceLabel ? `〔${formula.sourceLabel}〕` : "";
      return `${sourcePrefix}${formula.name}：${formula.expression}${formula.note ? `（${formula.note}）` : ""}`;
    }),
  ].join("\n")).join("\n\n");
};

export const createNoteFromFavorite = (favorite: FavoriteItem): NoteItem => ({
  id: `note:${favorite.id}`,
  title: favorite.title,
  sourceLabel: favorite.sourceLabel ?? "AI 搜尋收藏",
  keyword: favorite.keyword ?? favorite.title,
  searchQuery: favorite.searchQuery ?? favorite.subtitle,
  searchUrl: favorite.url,
  content: buildFormulaNoteContent(favorite),
  createdAt: new Date().toISOString(),
});

export const sameNote = (a: NoteItem, b: NoteItem) => a.id === b.id;
