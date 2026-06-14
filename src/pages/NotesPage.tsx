import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import type { NoteItem } from "../types/navigation";

export function NotesPage({
  notes,
  onRemove,
  onUpdate,
}: {
  notes: NoteItem[];
  onRemove: (note: NoteItem) => void;
  onUpdate: (note: NoteItem, content: string) => void;
}) {
  const confirmRemove = (note: NoteItem) => {
    if (window.confirm(`確定刪除筆記「${note.title}」？`)) {
      onRemove(note);
    }
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>我的筆記</h2>
        <p>之後可把 AI 搜尋結果摘要、考點心得或易錯題整理到這裡。</p>
      </section>

      {notes.length === 0 ? (
        <section className="card">
          <p>目前沒有筆記。可先到收藏頁，從 AI 搜尋收藏新增筆記。</p>
        </section>
      ) : notes.map((note) => (
        <section className="card favorite-search-card" key={note.id}>
          <small>來源：{note.sourceLabel}</small>
          <h3>{note.title}</h3>
          <div className="favorite-data-list">
            <p><strong>關鍵字：</strong>{note.keyword}</p>
            <p><strong>搜尋句：</strong>{note.searchQuery}</p>
          </div>
          <label className="note-editor">
            <strong>筆記內容</strong>
            <textarea
              value={note.content}
              onChange={(event) => onUpdate(note, event.target.value)}
              placeholder={"可貼上 AI 摘要、考點心得或易錯提醒。\n\n公式可用：\n$$\nT = \\frac{8}{2^{(L-90)/5}}\n$$"}
            />
          </label>
          {note.content.trim() && (
            <div className="note-preview">
              <strong>筆記預覽</strong>
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {note.content}
              </ReactMarkdown>
            </div>
          )}
          <div className="favorite-card-actions">
            {note.searchUrl && (
              <a className="button button-primary app-link-button" href={note.searchUrl} target="_blank" rel="noreferrer">
                重新搜尋
              </a>
            )}
            <button className="button button-ghost" type="button" onClick={() => confirmRemove(note)}>
              刪除筆記
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
