export type PageKey =
  | "home"
  | "articleNode"
  | "conceptMap"
  | "articlePositioning"
  | "favorites"
  | "notes"
  | "disclaimer";

export type FavoriteType = "aiSearch";

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  title: string;
  subtitle: string;
  targetId?: string;
  url?: string;
  keyword?: string;
  searchQuery?: string;
  sourceLabel?: string;
  createdAt?: string;
};

export type NoteItem = {
  id: string;
  title: string;
  sourceLabel: string;
  keyword: string;
  searchQuery: string;
  searchUrl?: string;
  content: string;
  createdAt: string;
};
