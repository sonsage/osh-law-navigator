import { useMemo, useState } from "react";
import type { FavoriteItem } from "../types/navigation";

export function FavoritesPage({
  favorites,
  onRemove,
  onAddNote,
}: {
  favorites: FavoriteItem[];
  onRemove: (item: FavoriteItem) => void;
  onAddNote: (item: FavoriteItem) => void;
}) {
  const [favoriteSearch, setFavoriteSearch] = useState("");
  const filteredFavorites = useMemo(() => {
    const keyword = favoriteSearch.trim().toLowerCase();
    if (!keyword) {
      return favorites;
    }

    return favorites.filter((item) => [
      item.title,
      item.subtitle,
      item.sourceLabel ?? "",
      item.keyword ?? "",
      item.searchQuery ?? "",
      item.url ?? "",
    ].some((value) => value.toLowerCase().includes(keyword)));
  }, [favoriteSearch, favorites]);
  const searchFavorites = filteredFavorites.filter((item) => item.type === "aiSearch");
  const otherFavorites = filteredFavorites.filter((item) => item.type !== "aiSearch");
  const confirmRemove = (item: FavoriteItem) => {
    if (window.confirm(`確定移除收藏「${item.title}」？`)) {
      onRemove(item);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>收藏</h2>
        <p>收藏你查過的 AI 搜尋路徑，之後可在本頁搜尋、建立筆記或重新開啟查證。</p>
      </section>

      {favorites.length === 0 ? (
        <section className="card">
          <p>目前沒有收藏。</p>
        </section>
      ) : (
        <>
          <section className="card note-search-panel">
            <div className="note-search-heading">
              <strong>搜尋已收藏資料</strong>
              <span>{filteredFavorites.length}/{favorites.length}</span>
            </div>
            <label>
              <input
                type="search"
                value={favoriteSearch}
                onChange={(event) => setFavoriteSearch(event.target.value)}
                placeholder="輸入來源、關鍵字或搜尋句"
              />
            </label>
            {favoriteSearch.trim() && (
              <button className="button button-ghost note-search-clear" type="button" onClick={() => setFavoriteSearch("")}>
                清除搜尋
              </button>
            )}
          </section>

          {filteredFavorites.length === 0 && (
            <section className="card">
              <p>找不到符合「{favoriteSearch}」的已收藏資料。</p>
            </section>
          )}

          {searchFavorites.length > 0 && (
            <section className="stack">
              <h2 className="section-heading">AI 搜尋收藏</h2>
              {searchFavorites.map((item) => (
                <section className="card favorite-search-card" key={`${item.type}-${item.id}`}>
                  <small>來源：{item.sourceLabel ?? "AI 搜尋"}</small>
                  <h3>{item.title}</h3>
                  <div className="favorite-data-list">
                    <p><strong>關鍵字：</strong>{item.keyword ?? item.title}</p>
                    <p><strong>搜尋句：</strong>{item.searchQuery ?? item.subtitle}</p>
                  </div>
                  <div className="favorite-card-actions">
                    {item.url && (
                      <a className="button button-primary app-link-button" href={item.url} target="_blank" rel="noreferrer">
                        開啟搜尋
                      </a>
                    )}
                    <button className="button button-ghost" type="button" onClick={() => onAddNote(item)}>
                      新增筆記
                    </button>
                    <button className="button button-ghost" type="button" onClick={() => confirmRemove(item)}>
                      移除
                    </button>
                  </div>
                </section>
              ))}
            </section>
          )}

          {otherFavorites.map((item) => (
            <section className="card" key={`${item.type}-${item.id}`}>
              <h3>{item.title}</h3>
              <p>{item.subtitle}</p>
              <button className="button button-ghost" onClick={() => confirmRemove(item)}>移除</button>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
