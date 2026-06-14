import type { PageKey } from "../types/navigation";

const entries: Array<{ page: PageKey; title: string; text: string; icon: string; tone: string }> = [
  {
    page: "articleNode",
    title: "法條導航",
    text: "先看第一、二章母法條文，再用原文關鍵詞查子法、附表與官方資料。",
    icon: "法",
    tone: "blue",
  },
  {
    page: "conceptMap",
    title: "這條考什麼",
    text: "用條號與法條關鍵詞開 AI 搜尋，快速看考古題可能怎麼問。",
    icon: "考",
    tone: "violet",
  },
  {
    page: "articlePositioning",
    title: "法條定位",
    text: "看第 2 條職災調查與第 6 條設施規則章節。",
    icon: "位",
    tone: "green",
  },
  {
    page: "favorites",
    title: "收藏",
    text: "保留查過的 AI 搜尋路徑，之後可直接重新搜尋。",
    icon: "藏",
    tone: "cyan",
  },
  {
    page: "notes",
    title: "我的筆記",
    text: "整理 AI 摘要、考點心得與易錯題。",
    icon: "記",
    tone: "amber",
  },
  {
    page: "disclaimer",
    title: "聲明",
    text: "查看開發者、資料來源與 AI 搜尋使用提醒。",
    icon: "明",
    tone: "slate",
  },
];

export function HomePage({ onNavigate }: { onNavigate: (page: PageKey) => void }) {
  return (
    <>
      <section className="card mother-summary">
        <h2>看到一條法條，知道下一步查什麼。</h2>
        <div className="study-chips" aria-label="V1.0 功能">
          <span>先看官方</span>
          <span>再查關鍵詞</span>
          <span>最後看考法</span>
        </div>
      </section>

      <section className="entry-grid">
        {entries.map((entry) => (
          <button key={entry.page} className={`entry-card tone-${entry.tone}`} onClick={() => onNavigate(entry.page)}>
            <span className="entry-icon" aria-hidden="true">{entry.icon}</span>
            <strong>{entry.title}</strong>
            <span>{entry.text}</span>
          </button>
        ))}
      </section>

      <p className="disclaimer">
        V1.0 只整理職業安全衛生法第一、二章的導覽入口；條文全文、修正狀態與子法內容，以全國法規資料庫及主管機關最新資料為準。
      </p>
    </>
  );
}
