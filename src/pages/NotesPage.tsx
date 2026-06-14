import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import type { NoteItem } from "../types/navigation";

const looksLikeFormula = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("$$") || trimmed.startsWith("|")) {
    return false;
  }

  return /[A-Za-z][A-Za-z0-9_{}\\]*\s*=/.test(trimmed)
    && /[=+\-*/^_{}()[\]\\]/.test(trimmed)
    && !/[：:。；;]/.test(trimmed);
};

const normalizeFormulaLine = (line: string) => line
  .trim()
  .replace(/\s+\*\s+/g, " \\times ")
  .replace(/\s*->\s*/g, " \\to ");

const formatNoteForPreview = (content: string) => {
  const lines = content.split("\n");
  const output: string[] = [];
  let inMathBlock = false;

  lines.forEach((line) => {
    if (line.trim().startsWith("$$")) {
      inMathBlock = !inMathBlock;
      output.push(line);
      return;
    }

    if (!inMathBlock && looksLikeFormula(line)) {
      output.push("$$");
      output.push(normalizeFormulaLine(line));
      output.push("$$");
      return;
    }

    output.push(line);
  });

  return output.join("\n");
};

export function NotesPage({
  notes,
  onRemove,
  onUpdate,
}: {
  notes: NoteItem[];
  onRemove: (note: NoteItem) => void;
  onUpdate: (note: NoteItem, content: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savedMessages, setSavedMessages] = useState<Record<string, string>>({});
  const [noteSearch, setNoteSearch] = useState("");

  useEffect(() => {
    setDrafts((current) => {
      const next = { ...current };
      notes.forEach((note) => {
        if (next[note.id] === undefined) {
          next[note.id] = note.content;
        }
      });
      return next;
    });
  }, [notes]);

  const filteredNotes = useMemo(() => {
    const keyword = noteSearch.trim().toLowerCase();
    if (!keyword) {
      return notes;
    }

    return notes.filter((note) => [
      note.title,
      note.sourceLabel,
      note.keyword,
      note.searchQuery,
      note.content,
    ].some((value) => value.toLowerCase().includes(keyword)));
  }, [noteSearch, notes]);

  const confirmRemove = (note: NoteItem) => {
    if (window.confirm(`確定刪除筆記「${note.title}」？`)) {
      onRemove(note);
    }
  };

  const saveDraft = (note: NoteItem) => {
    onUpdate(note, drafts[note.id] ?? "");
    setSavedMessages((current) => ({ ...current, [note.id]: "已儲存筆記。" }));
    window.setTimeout(() => {
      setSavedMessages((current) => {
        const next = { ...current };
        delete next[note.id];
        return next;
      });
    }, 1800);
  };

  return (
    <div className="stack">
      <section className="card">
        <h2>我的筆記</h2>
        <p>把 AI 搜尋結果摘要、公式、考點心得或易錯題整理到這裡。</p>
      </section>

      {notes.length > 0 && (
        <section className="card note-search-panel">
          <label>
            <strong>搜尋已儲存筆記</strong>
            <input
              type="search"
              value={noteSearch}
              onChange={(event) => setNoteSearch(event.target.value)}
              placeholder="輸入關鍵字、公式名稱或搜尋句"
            />
          </label>
        </section>
      )}

      {notes.length === 0 ? (
        <section className="card">
          <p>目前沒有筆記。可先到收藏頁，從 AI 搜尋收藏新增筆記。</p>
        </section>
      ) : filteredNotes.length === 0 ? (
        <section className="card">
          <p>找不到符合「{noteSearch}」的已儲存筆記。</p>
        </section>
      ) : filteredNotes.map((note) => {
        const draft = drafts[note.id] ?? note.content;
        const hasUnsavedChange = draft !== note.content;
        const previewContent = formatNoteForPreview(draft);

        return (
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
                value={draft}
                onChange={(event) => {
                  setDrafts((current) => ({ ...current, [note.id]: event.target.value }));
                }}
                placeholder={"可貼上 AI 摘要、公式、考點心得或易錯提醒。\n\n公式可直接貼：\nT_{m} = (1/2 + 1/N) * T\n\n也可用 LaTeX：\n$$\nT = \\frac{8}{2^{(L-90)/5}}\n$$"}
              />
            </label>
            {draft.trim() && (
              <div className="note-preview">
                <strong>筆記預覽</strong>
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {previewContent}
                </ReactMarkdown>
              </div>
            )}
            {savedMessages[note.id] && <p className="voice-status">{savedMessages[note.id]}</p>}
            <div className="favorite-card-actions">
              <button
                className="button note-save-button"
                type="button"
                disabled={!hasUnsavedChange}
                onClick={() => saveDraft(note)}
              >
                儲存筆記
              </button>
              <button className="button button-ghost" type="button" onClick={() => confirmRemove(note)}>
                刪除筆記
              </button>
            </div>
          </section>
        );
      })}
    </div>
  );
}
