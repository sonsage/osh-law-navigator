import { useMemo, useState } from "react";
import {
  buildOperationSearchQuery,
  getOperationOfficialUrl,
  type OperationExamPoint,
  operationExamPoints,
} from "../data/operationExamPoints";
import type { FavoriteItem } from "../types/navigation";
import { sameFavorite } from "../utils/favorites";
import { buildGoogleAIModeSearchUrl } from "../utils/searchQueryBuilder";

const lawFilters = ["全部", "職業安全衛生設施規則", "營造安全衛生設施標準"] as const;

type OperationPointsPageProps = {
  favorites: FavoriteItem[];
  onToggleFavorite: (item: FavoriteItem) => void;
};

function buildOperationFavorite(point: OperationExamPoint): FavoriteItem {
  const query = buildOperationSearchQuery(point);
  return {
    id: `operation:${point.id}`,
    type: "aiSearch",
    title: point.name,
    subtitle: `${point.law} 第 ${point.article} 條`,
    targetId: point.id,
    url: buildGoogleAIModeSearchUrl(query),
    keyword: point.name,
    searchQuery: query,
    sourceLabel: "作業考點名單",
  };
}

export function OperationPointsPage({ favorites, onToggleFavorite }: OperationPointsPageProps) {
  const [keyword, setKeyword] = useState("");
  const [lawFilter, setLawFilter] = useState<(typeof lawFilters)[number]>("全部");

  const filteredPoints = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();
    return operationExamPoints.filter((point) => {
      const matchLaw = lawFilter === "全部" || point.law === lawFilter;
      if (!matchLaw) return false;
      if (!normalizedKeyword) return true;

      return [
        point.name,
        point.law,
        point.article,
        ...point.keywords,
      ].some((value) => value.toLowerCase().includes(normalizedKeyword));
    });
  }, [keyword, lawFilter]);

  return (
    <div className="stack">
      <section className="card">
        <h2>作業考點名單</h2>
        <p>先找到「某某作業」名稱，再用 AI 搜尋查它會接作業計畫、作業主管、紀錄或報告書。</p>
      </section>

      <section className="card note-search-panel">
        <div className="note-search-heading">
          <strong>搜尋作業名單</strong>
          <span>{filteredPoints.length}/{operationExamPoints.length}</span>
        </div>
        <label>
          <input
            type="search"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="輸入作業、法規、條號或關鍵字"
          />
        </label>
        <div className="operation-filter-row" aria-label="法規篩選">
          {lawFilters.map((filter) => (
            <button
              className={lawFilter === filter ? "active" : ""}
              key={filter}
              type="button"
              onClick={() => setLawFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>
        {keyword.trim() && (
          <button className="button button-ghost note-search-clear" type="button" onClick={() => setKeyword("")}>
            清除搜尋
          </button>
        )}
      </section>

      {filteredPoints.length === 0 ? (
        <section className="card">
          <p>找不到符合「{keyword}」的作業名單。</p>
        </section>
      ) : (
        <section className="operation-point-list">
          {filteredPoints.map((point) => {
            const query = buildOperationSearchQuery(point);
            const favorite = buildOperationFavorite(point);
            const isFavorite = favorites.some((item) => sameFavorite(item, favorite));
            return (
              <article className="card operation-point-card" key={point.id}>
                <small>{point.law} 第 {point.article} 條</small>
                <h3>{point.name}</h3>
                <div className="operation-keyword-row">
                  {point.keywords.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="favorite-card-actions">
                  <a className="button button-primary app-link-button" href={buildGoogleAIModeSearchUrl(query)} target="_blank" rel="noreferrer">
                    AI 搜尋
                  </a>
                  <a className="button button-ghost app-link-button" href={getOperationOfficialUrl(point)} target="_blank" rel="noreferrer">
                    官方條文
                  </a>
                  <button className="button button-ghost" type="button" onClick={() => onToggleFavorite(favorite)}>
                    {isFavorite ? "已收藏" : "加入收藏"}
                  </button>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
