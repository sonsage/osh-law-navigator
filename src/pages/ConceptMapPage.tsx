import { useEffect, useRef, useState } from "react";
import type { Ref } from "react";
import { ArticleAiSearchBox } from "../components/ArticleAiSearchBox";
import { articlePositioningIds } from "../data/articlePositionings";
import { officialLawChapters, type OfficialArticle } from "../data/officialLawArticles";

function findArticleChapterId(articleId?: string) {
  if (!articleId) return undefined;
  return officialLawChapters.find((chapter) => chapter.articles.some((article) => article.id === articleId))?.id;
}

function ExamArticleCard({
  article,
  active,
  innerRef,
  onOpenArticlePosition,
}: {
  article: OfficialArticle;
  active: boolean;
  innerRef?: Ref<HTMLElement>;
  onOpenArticlePosition?: (articleId: string) => void;
}) {
  const hasPositioning = articlePositioningIds.includes(article.id);
  const needsImageSearch = ["osha-6", "osha-8", "osha-10", "osha-12", "osha-16", "osha-27", "osha-29", "osha-30", "osha-36", "osha-37", "osha-51-1"].includes(article.id);

  return (
    <article className={active ? "article-entry active" : "article-entry"} ref={innerRef}>
      <div>
        <strong>{article.articleNo}｜{article.title}</strong>
        <p>{article.text[0] ?? article.keywords.join("、")}</p>
      </div>
      <ArticleAiSearchBox
        label="本條考法關鍵詞"
        keywords={article.keywords}
        buildQuery={(keyword) => `乙級職業安全衛生管理員 職業安全衛生法 ${article.articleNo} ${keyword.trim()} 考古題`}
        placeholder="輸入或語音轉文字，例如：合梯、作業環境監測計畫"
        primaryActionLabel="AI 搜尋考法"
        imageSearch={needsImageSearch
          ? {
            label: "圖片搜尋",
            buildQuery: (keyword) => `職業安全衛生 ${article.articleNo} ${keyword.trim()}`,
          }
          : undefined}
        secondaryAction={hasPositioning && onOpenArticlePosition
          ? { label: "本條定位", onClick: () => onOpenArticlePosition(article.id) }
          : undefined}
      />
    </article>
  );
}

export function ConceptMapPage({
  selectedArticleId,
  onOpenArticlePosition,
}: {
  selectedArticleId?: string;
  onOpenArticlePosition?: (articleId: string) => void;
}) {
  const [activeArticleId, setActiveArticleId] = useState<string | undefined>(selectedArticleId);
  const [openChapterId, setOpenChapterId] = useState<string | undefined>(findArticleChapterId(selectedArticleId));
  const activeArticleRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    setActiveArticleId(selectedArticleId);
    setOpenChapterId(findArticleChapterId(selectedArticleId));
  }, [selectedArticleId]);

  useEffect(() => {
    if (!activeArticleId) return;
    const timer = window.setTimeout(() => {
      const target = activeArticleRef.current;
      if (!target) return;
      const headerOffset = 116;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [activeArticleId]);

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow dark">V1.0｜第一至六章</p>
        <h2>這條考什麼</h2>
        <p>先選條文，再用條號與法條原文關鍵詞開 AI 搜尋。搜尋結果仍要回官方條文確認。</p>
      </section>

      <section className="chapter-list">
        {officialLawChapters.map((chapter) => {
          const isOpen = openChapterId === chapter.id;
          return (
            <div className="chapter-panel" key={chapter.id}>
              <button
                className="chapter-summary"
                type="button"
                onClick={() => setOpenChapterId(isOpen ? undefined : chapter.id)}
              >
                <span>{chapter.chapterNo}｜{chapter.title}</span>
                <small>{chapter.range}</small>
              </button>
              {isOpen && (
                <div className="article-entry-list">
                  {chapter.articles.map((article) => {
                    const active = activeArticleId === article.id;
                    return (
                      <div key={article.id} onClick={() => setActiveArticleId(article.id)}>
                        <ExamArticleCard
                          article={article}
                          active={active}
                          innerRef={active ? activeArticleRef : undefined}
                          onOpenArticlePosition={onOpenArticlePosition}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
