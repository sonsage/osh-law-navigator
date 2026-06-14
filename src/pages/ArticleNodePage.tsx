import { useState } from "react";
import { ArticleAiSearchBox } from "../components/ArticleAiSearchBox";
import {
  officialLawChapters,
  getOfficialAuthorizedSubLawsUrl,
  getOfficialArticleUrl,
  getOfficialRelatedArticlesUrl,
  getLawAllUrl,
  type OfficialArticle,
} from "../data/officialLawArticles";

type ArticleNodePageProps = {
  onOpenArticleExam?: (articleId: string) => void;
};

function buildFocusedQuery(article: OfficialArticle, value: string) {
  const text = value.trim();
  return text ? `職業安全衛生法 ${article.articleNo} ${text}` : `職業安全衛生法 ${article.articleNo}`;
}

export function ArticleNodePage({ onOpenArticleExam }: ArticleNodePageProps) {
  const [openChapterId, setOpenChapterId] = useState<string | undefined>();

  return (
    <div className="stack">
      <section className="card">
        <p className="eyebrow dark">V1.0｜第一、二章</p>
        <h2>職業安全衛生法</h2>
        <p>完整列出母法條文。看完條文後，由你輸入或選取關鍵詞，再用 AI 搜尋查子法、附表、計畫、作業或考法。</p>
        <div className="action-row">
          <a className="button button-ghost app-link-button" href={getLawAllUrl()} target="_blank" rel="noreferrer">
            開啟官方全文
          </a>
        </div>
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
                  {chapter.articles.map((article) => (
                    <article className="article-entry" key={article.id}>
                      <div>
                        <strong>{article.articleNo}｜{article.title}</strong>
                        <div className="official-link-row">
                          <a className="official-article-link" href={getOfficialArticleUrl(article.articleNo)} target="_blank" rel="noreferrer">
                            官方條文
                          </a>
                          <a className="official-article-link related" href={getOfficialRelatedArticlesUrl(article.articleNo)} target="_blank" rel="noreferrer">
                            相關法條
                          </a>
                          <a className="official-article-link authorized" href={getOfficialAuthorizedSubLawsUrl(article.articleNo)} target="_blank" rel="noreferrer">
                            授權子法
                          </a>
                        </div>
                      </div>
                      <div className="article-law-text">
                        {article.text.map((paragraph) => (
                          <p key={paragraph}>{paragraph}</p>
                        ))}
                      </div>
                      <ArticleAiSearchBox
                        label="AI 搜尋關鍵詞"
                        keywords={article.keywords}
                        buildQuery={(keyword) => buildFocusedQuery(article, keyword)}
                        placeholder="輸入或語音轉文字，例如：聽力保護計畫"
                        primaryActionLabel="AI 搜尋"
                        secondaryAction={{ label: "本條考法", onClick: () => onOpenArticleExam?.(article.id) }}
                      />
                    </article>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </section>
    </div>
  );
}
