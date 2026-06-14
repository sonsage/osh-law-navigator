import { useEffect, useMemo, useState } from "react";
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
        <p>整理 AI 摘要、考點心得與易錯提醒。公式或圖片先保留在原搜尋結果，筆記只記考試重點。</p>
      </section>

      {notes.length > 0 && (
        <section className="card note-search-panel">
          <label>
            <strong>搜尋已儲存筆記</strong>
            <input
              type="search"
              value={noteSearch}
              onChange={(event) => setNoteSearch(event.target.value)}
              placeholder="輸入關鍵字、考點或搜尋句"
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
                placeholder={"用自己的話記考點，例如：\n噪音：90dB 8小時、95dB 4小時、100dB 2小時。\n雙手啟動式：全轉式離合器，按下後不可中途停止。"}
              />
            </label>
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
