import type { PageKey } from "../types/navigation";

const entries: Array<{ page: PageKey; title: string; text: string; icon: string; tone: string }> = [
  {
    page: "articleNode",
    title: "法條導航",
    text: "查看職安法條文與官方入口，再用關鍵字查子法、附表與考題。",
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
    page: "operationPoints",
    title: "作業考點",
    text: "整理設施規則、營造標準常見某某作業名單，再開 AI 查計畫、主管與報告書。",
    icon: "業",
    tone: "rose",
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
    </>
  );
}
