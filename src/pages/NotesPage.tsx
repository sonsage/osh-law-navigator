import { useEffect, useMemo, useState } from "react";
import { calculationFormulaGroups } from "../data/calculationFormulaNotes";
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
  const [formulaSearch, setFormulaSearch] = useState("");

  useEffect(() => {
    setDrafts((current) => {
      const next = { ...current };
      notes.forEach((note) => {
        if (next[note.id] === undefined || (!next[note.id].trim() && note.content.trim())) {
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
      drafts[note.id] ?? "",
    ].some((value) => value.toLowerCase().includes(keyword)));
  }, [drafts, noteSearch, notes]);

  const filteredFormulaGroups = useMemo(() => {
    const keyword = formulaSearch.trim().toLowerCase();
    if (!keyword) {
      return calculationFormulaGroups;
    }

    return calculationFormulaGroups
      .map((group) => ({
        ...group,
        formulas: group.formulas.filter((formula) => [
          group.title,
          formula.name,
          formula.expression,
          formula.sourceLabel ?? "",
          formula.sourceType ?? "",
          formula.note ?? "",
        ].some((value) => value.toLowerCase().includes(keyword))),
      }))
      .filter((group) => group.formulas.length > 0);
  }, [formulaSearch]);

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
        <p>整理 AI 摘要、考點心得與易錯提醒。計算題公式已整理成考場可按的橫式，個人筆記可從收藏搜尋建立。</p>
      </section>

      <section className="card formula-note-card">
        <div className="formula-note-heading">
          <div>
            <small>固定筆記</small>
            <h2>考場公式橫式筆記</h2>
          </div>
          <span>{calculationFormulaGroups.reduce((sum, group) => sum + group.formulas.length, 0)} 式</span>
        </div>
        <label className="formula-search-field">
          <strong>搜尋公式</strong>
          <input
            type="search"
            value={formulaSearch}
            onChange={(event) => setFormulaSearch(event.target.value)}
            placeholder="輸入噪音、TWA、WBGT、風量、照度..."
          />
        </label>
        <div className="formula-tip-list">
          <span>法規原式優先</span>
          <span>log=log10</span>
          <span>百分比先除以 100</span>
          <span>先統一單位再按</span>
        </div>
        <p className="formula-source-warning">
          有機、特化、粉塵等法規或附表若有明定公式、控制風速、換氣條件，考場以法規原式為準；本區的文字換算式只作快速換算輔助。
        </p>
        {filteredFormulaGroups.length === 0 ? (
          <p className="formula-empty-message">找不到符合「{formulaSearch}」的公式。</p>
        ) : (
          <div className="formula-group-list">
            {filteredFormulaGroups.map((group) => (
              <details className="formula-group" key={group.title} open={Boolean(formulaSearch)}>
                <summary>
                  <strong>{group.title}</strong>
                  <span>{group.formulas.length}</span>
                </summary>
                <div className="formula-row-list">
                  {group.formulas.map((formula) => (
                    <article className="formula-row" key={`${group.title}-${formula.name}`}>
                      <div className="formula-row-heading">
                        <strong>{formula.name}</strong>
                        {formula.sourceLabel && (
                          <span className={`formula-source formula-source-${formula.sourceType ?? "conversion"}`}>
                            {formula.sourceLabel}
                          </span>
                        )}
                      </div>
                      <code>{formula.expression}</code>
                      {formula.note && <small>{formula.note}</small>}
                    </article>
                  ))}
                </div>
              </details>
            ))}
          </div>
        )}
      </section>

      {notes.length > 0 && (
        <section className="card note-search-panel">
          <div className="note-search-heading">
            <strong>搜尋已儲存筆記</strong>
            <span>{filteredNotes.length}/{notes.length}</span>
          </div>
          <label>
            <input
              type="search"
              value={noteSearch}
              onChange={(event) => setNoteSearch(event.target.value)}
              placeholder="輸入關鍵字、考點或搜尋句"
            />
          </label>
          {noteSearch.trim() && (
            <button className="button button-ghost note-search-clear" type="button" onClick={() => setNoteSearch("")}>
              清除搜尋
            </button>
          )}
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
