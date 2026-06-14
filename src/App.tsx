import { useEffect, useState } from "react";
import { AppHeader } from "./components/AppHeader";
import { BottomNav } from "./components/BottomNav";
import { ArticleNodePage } from "./pages/ArticleNodePage";
import { ArticlePositioningPage } from "./pages/ArticlePositioningPage";
import { ConceptMapPage } from "./pages/ConceptMapPage";
import { DisclaimerPage } from "./pages/DisclaimerPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { NotesPage } from "./pages/NotesPage";
import type { FavoriteItem, NoteItem, PageKey } from "./types/navigation";
import { favoriteChangedEvent, loadFavorites, sameFavorite, saveFavorites } from "./utils/favorites";
import { buildFormulaNoteContent, createNoteFromFavorite, loadNotes, sameNote, saveNotes } from "./utils/notes";

const pageMeta: Record<PageKey, { title: string; subtitle?: string }> = {
  home: { title: "職業安全衛生法導航", subtitle: "乙級管理員考試利器" },
  articleNode: { title: "法條導航", subtitle: "第一、二章官方條文入口" },
  conceptMap: { title: "這條考什麼", subtitle: "用條號與關鍵詞查考法" },
  articlePositioning: { title: "法條定位" },
  favorites: { title: "收藏", subtitle: "保留常用查證入口" },
  notes: { title: "我的筆記", subtitle: "整理 AI 摘要與考點心得" },
  disclaimer: { title: "聲明", subtitle: "開發者與資料來源" },
};

function App() {
  const [page, setPage] = useState<PageKey>("home");
  const [selectedExamArticleId, setSelectedExamArticleId] = useState<string | undefined>();
  const [selectedPositionArticleId, setSelectedPositionArticleId] = useState<string | undefined>();
  const [favorites, setFavorites] = useState<FavoriteItem[]>(loadFavorites);
  const [notes, setNotes] = useState<NoteItem[]>(loadNotes);

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  useEffect(() => {
    const syncFavorites = () => setFavorites(loadFavorites());
    window.addEventListener(favoriteChangedEvent, syncFavorites);
    window.addEventListener("storage", syncFavorites);
    return () => {
      window.removeEventListener(favoriteChangedEvent, syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [page, selectedExamArticleId, selectedPositionArticleId]);

  const navigate = (nextPage: PageKey) => {
    if (nextPage === "conceptMap") {
      setSelectedExamArticleId(undefined);
    }
    if (nextPage === "articlePositioning") {
      setSelectedPositionArticleId(undefined);
    }
    setPage(nextPage);
  };

  const openArticleExam = (articleId: string) => {
    setSelectedExamArticleId(articleId);
    setPage("conceptMap");
  };

  const openArticlePosition = (articleId: string) => {
    setSelectedPositionArticleId(articleId);
    setPage("articlePositioning");
  };

  const toggleFavorite = (item: FavoriteItem) => {
    setFavorites((current) => current.some((favorite) => sameFavorite(favorite, item))
      ? current.filter((favorite) => !sameFavorite(favorite, item))
      : [{ ...item, createdAt: new Date().toISOString() }, ...current]);
  };

  const addNoteFromFavorite = (item: FavoriteItem) => {
    const nextNote = createNoteFromFavorite(item);
    setNotes((current) => {
      const existingNote = current.find((note) => sameNote(note, nextNote));
      if (!existingNote) {
        return [nextNote, ...current];
      }

      const formulaContent = buildFormulaNoteContent(item);
      if (!existingNote.content.trim() && formulaContent) {
        return current.map((note) => sameNote(note, nextNote) ? { ...note, content: formulaContent } : note);
      }

      return current;
    });
    setPage("notes");
  };

  const removeNote = (item: NoteItem) => {
    setNotes((current) => current.filter((note) => !sameNote(note, item)));
  };

  const updateNote = (item: NoteItem, content: string) => {
    setNotes((current) => current.map((note) => sameNote(note, item) ? { ...note, content } : note));
  };

  const exitApp = () => {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    window.close();
  };

  const meta = pageMeta[page];
  const headerAction = page === "home"
    ? { label: "退出", onClick: exitApp }
    : { label: "回首頁", onClick: () => navigate("home") };

  return (
    <div className="app-shell">
      <AppHeader
        title={meta.title}
        subtitle={meta.subtitle}
        actionLabel={headerAction.label}
        onAction={headerAction.onClick}
      />
      <main>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "articleNode" && <ArticleNodePage onOpenArticleExam={openArticleExam} />}
        {page === "conceptMap" && <ConceptMapPage selectedArticleId={selectedExamArticleId} onOpenArticlePosition={openArticlePosition} />}
        {page === "articlePositioning" && <ArticlePositioningPage selectedArticleId={selectedPositionArticleId} />}
        {page === "favorites" && <FavoritesPage favorites={favorites} onRemove={toggleFavorite} onAddNote={addNoteFromFavorite} />}
        {page === "notes" && <NotesPage notes={notes} onRemove={removeNote} onUpdate={updateNote} />}
        {page === "disclaimer" && <DisclaimerPage />}
        {!["home", "articleNode", "conceptMap", "articlePositioning", "favorites", "notes", "disclaimer"].includes(page) && <HomePage onNavigate={navigate} />}
      </main>
      <BottomNav currentPage={page} onNavigate={navigate} />
    </div>
  );
}

export default App;
