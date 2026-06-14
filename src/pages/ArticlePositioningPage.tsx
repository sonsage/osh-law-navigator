import { useEffect, useRef } from "react";
import { ArticleAiSearchBox } from "../components/ArticleAiSearchBox";
import { articlePositionings } from "../data/articlePositionings";

export function ArticlePositioningPage({ selectedArticleId }: { selectedArticleId?: string }) {
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    if (!selectedArticleId) return;
    const target = sectionRefs.current[selectedArticleId];
    if (!target) return;

    const timer = window.setTimeout(() => {
      const headerOffset = 116;
      const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: "auto" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [selectedArticleId]);

  return (
    <div className="stack">
      {articlePositionings.map((item) => (
        <section
          className="card positioning-panel"
          key={item.articleId}
          ref={(element) => {
            sectionRefs.current[item.articleId] = element;
          }}
        >
          <p className="eyebrow dark">{item.lawLabel}</p>
          <h2>{item.title}</h2>
          <p>{item.summary}</p>

          <div className="positioning-field-grid">
            {item.points.map((point) => (
              <div key={point.title}>
                <strong>{point.title}</strong>
                <span>{point.text}</span>
              </div>
            ))}
          </div>

          {item.referenceList && (
            <div className="facility-chapter-group">
              <h3>{item.referenceList.title}</h3>
              <div className="facility-chapter-list" aria-label={item.referenceList.title}>
                {item.referenceList.items.map((referenceItem) => (
                  <span key={referenceItem}>{referenceItem}</span>
                ))}
              </div>
            </div>
          )}

          <ArticleAiSearchBox
            label="定位查證關鍵詞"
            keywords={item.keywords}
            buildQuery={(keyword) => `${item.queryPrefix} ${keyword.trim()} 考古題`}
            placeholder={item.placeholder}
            primaryActionLabel="AI 搜尋定位"
          />
        </section>
      ))}
    </div>
  );
}
