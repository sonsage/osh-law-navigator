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
  const searchFavorites = favorites.filter((item) => item.type === "aiSearch");
  const otherFavorites = favorites.filter((item) => item.type !== "aiSearch");
  const confirmRemove = (item: FavoriteItem) => {
    if (window.confirm(`確定移除收藏「${item.title}」？`)) {
      onRemove(item);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>收藏</h2>
        <p>收藏你查過的 AI 搜尋路徑，之後可直接重開同一個搜尋。</p>
      </section>

      {favorites.length === 0 ? (
        <section className="card">
          <p>目前沒有收藏。</p>
        </section>
      ) : (
        <>
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
                        重新搜尋
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
