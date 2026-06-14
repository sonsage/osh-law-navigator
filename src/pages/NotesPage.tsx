import { useEffect, useMemo, useState } from "react";
import { LicenseNode } from "../components/LicenseNode";
import { calculationFormulaGroups } from "../data/calculationFormulaNotes";
import type { NoteItem } from "../types/navigation";
import { loadLicenseAccess } from "../utils/licenseCode";

export function NotesPage({
  notes,
  onRemove,
  onRemoveAll,
  onUpdate,
}: {
  notes: NoteItem[];
  onRemove: (note: NoteItem) => void;
  onRemoveAll: () => void;
  onUpdate: (note: NoteItem, content: string) => void;
}) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [notebookMessage, setNotebookMessage] = useState("");
  const [savedMessages, setSavedMessages] = useState<Record<string, string>>({});
  const [noteSearch, setNoteSearch] = useState("");
  const [formulaSearch, setFormulaSearch] = useState("");
  const [licensed, setLicensed] = useState(() => loadLicenseAccess().unlocked);
  const formulaCount = calculationFormulaGroups.reduce((sum, group) => sum + group.formulas.length, 0);

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

  const escapeHtml = (value: string) => value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

  const getNotebookSnapshot = () => notes.map((note) => ({
    ...note,
    content: drafts[note.id] ?? note.content,
  }));

  const buildNotebookPrintHtml = (previewMode: boolean) => {
    const snapshot = getNotebookSnapshot();
    const generatedAt = new Date().toLocaleString("zh-TW");
    const body = snapshot.map((note, index) => `
      <article class="note">
        <div class="meta">#${index + 1}　${escapeHtml(note.sourceLabel)}</div>
        <h2>${escapeHtml(note.title)}</h2>
        <dl>
          <dt>關鍵字</dt><dd>${escapeHtml(note.keyword)}</dd>
          <dt>搜尋句</dt><dd>${escapeHtml(note.searchQuery)}</dd>
        </dl>
        <pre>${escapeHtml(note.content.trim() || "（空白筆記）")}</pre>
      </article>
    `).join("");

    return `<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>我的筆記 PDF 預覽</title>
  <style>
    @page { size: A4; margin: 16mm; }
    * { box-sizing: border-box; }
    html { background: #f4f7fb; }
    body { max-width: ${previewMode ? "760px" : "none"}; margin: ${previewMode ? "0 auto" : "0"}; padding: ${previewMode ? "16px" : "0"}; color: #12365f; font-family: "Noto Sans TC", "Microsoft JhengHei", Arial, sans-serif; font-size: ${previewMode ? "19px" : "13px"}; line-height: 1.65; }
    header { border-bottom: 2px solid #12365f; padding-bottom: ${previewMode ? "16px" : "12px"}; margin-bottom: ${previewMode ? "18px" : "18px"}; }
    h1 { margin: 0 0 6px; font-size: ${previewMode ? "30px" : "24px"}; }
    .summary { color: #5d6b80; font-size: ${previewMode ? "15px" : "13px"}; font-weight: 700; }
    .note { break-inside: avoid; border: 1px solid #d7e1ec; border-radius: 8px; padding: ${previewMode ? "16px" : "14px"}; margin-bottom: 14px; background: #ffffff; }
    .meta { color: #5d6b80; font-size: ${previewMode ? "14px" : "12px"}; font-weight: 800; }
    h2 { margin: 6px 0 10px; font-size: ${previewMode ? "23px" : "18px"}; }
    dl { display: grid; grid-template-columns: ${previewMode ? "76px" : "64px"} 1fr; gap: 6px 10px; margin: 0 0 12px; padding: 12px; border-radius: 8px; background: #eef4fb; }
    dt { font-weight: 900; }
    dd { margin: 0; color: #263347; overflow-wrap: anywhere; }
    pre { margin: 0; white-space: pre-wrap; overflow-wrap: anywhere; color: #172033; font: inherit; font-weight: 750; }
    .print-actions { position: sticky; top: 0; display: flex; gap: 10px; margin: -16px -16px 16px; padding: 10px 16px; background: #ffffff; border-bottom: 1px solid #d7e1ec; }
    .print-actions button { min-height: 42px; border: 0; border-radius: 8px; padding: 0 14px; color: #fff; background: #12365f; font-weight: 900; font-size: 16px; }
    @media print {
      html { background: #ffffff; }
      body { max-width: none; margin: 0; padding: 0; font-size: 13px; line-height: 1.55; }
      h1 { font-size: 24px; }
      h2 { font-size: 18px; }
      .summary { font-size: 13px; }
      .note { padding: 14px; background: #ffffff; }
      .meta { font-size: 12px; }
      dl { grid-template-columns: 64px 1fr; }
      .print-actions { display: none; }
    }
  </style>
</head>
<body>
  <div class="print-actions"><button onclick="window.print()">輸出 PDF</button></div>
  <header>
    <h1>我的筆記</h1>
    <div class="summary">共 ${snapshot.length} 筆｜產生時間：${escapeHtml(generatedAt)}</div>
  </header>
  ${body}
</body>
</html>`;
  };

  const openNotebookPdf = (printNow: boolean) => {
    if (notes.length === 0) {
      setNotebookMessage("目前沒有筆記可輸出。");
      return;
    }

    const preview = window.open("", "_blank");
    if (!preview) {
      setNotebookMessage("瀏覽器封鎖新視窗，請允許彈出視窗後再試。");
      return;
    }

    preview.document.open();
    preview.document.write(buildNotebookPrintHtml(!printNow));
    preview.document.close();

    if (printNow) {
      window.setTimeout(() => {
        preview.focus();
        preview.print();
      }, 300);
    }
  };

  const saveAllDrafts = () => {
    notes.forEach((note) => {
      const draft = drafts[note.id] ?? note.content;
      if (draft !== note.content) {
        onUpdate(note, draft);
      }
    });
    setNotebookMessage("已儲存全部筆記。");
    window.setTimeout(() => setNotebookMessage(""), 1800);
  };

  const confirmRemoveAll = () => {
    if (notes.length === 0) return;
    if (window.confirm(`確定刪除全部 ${notes.length} 筆筆記？此動作無法復原。`)) {
      onRemoveAll();
      setDrafts({});
      setNotebookMessage("已刪除全部筆記。");
      window.setTimeout(() => setNotebookMessage(""), 1800);
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

  if (!licensed) {
    return (
      <div className="stack">
        <section className="card">
          <h2>我的筆記</h2>
          <p>公式橫式庫、收藏搜尋與個人筆記是授權功能。AI 搜尋可先用來找資料，真正的讀書整理從收藏與筆記開始。</p>
        </section>

        <section className="card formula-note-card">
          <div className="formula-note-heading">
            <div>
              <small>授權功能</small>
              <h2>解鎖公式、收藏與筆記</h2>
            </div>
            <span>{formulaCount} 式</span>
          </div>
          <p className="formula-source-warning">
            這裡整理的是分散在法規、附表與考題中的考場橫式。授權後可搜尋公式、從收藏建立筆記，依自己的弱點整理複習。
          </p>
          <LicenseNode onAccessChange={setLicensed} />
        </section>
      </div>
    );
  }

  return (
    <div className="stack">
      <section className="card">
        <h2>我的筆記</h2>
        <p>整理 AI 摘要、考點心得與易錯提醒。計算題公式已整理成考場可按的橫式，個人筆記可從收藏搜尋建立。</p>
      </section>

      <section className="card notebook-actions-card">
        <div className="note-search-heading">
          <strong>全部筆記工具</strong>
          <span>{notes.length} 筆</span>
        </div>
        <div className="notebook-action-grid">
          <button className="button button-ghost" type="button" disabled={notes.length === 0} onClick={() => openNotebookPdf(false)}>
            預覽 PDF
          </button>
          <button className="button button-primary" type="button" disabled={notes.length === 0} onClick={() => openNotebookPdf(true)}>
            輸出 PDF
          </button>
          <button className="button note-save-button" type="button" disabled={notes.length === 0} onClick={saveAllDrafts}>
            儲存全部
          </button>
          <button className="button notebook-delete-button" type="button" disabled={notes.length === 0} onClick={confirmRemoveAll}>
            刪除全部
          </button>
        </div>
        {notebookMessage && <p className="voice-status">{notebookMessage}</p>}
      </section>

      <section className="card formula-note-card">
        <div className="formula-note-heading">
          <div>
            <small>固定筆記</small>
            <h2>考場公式橫式筆記</h2>
          </div>
          <span>{formulaCount} 式</span>
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
        <p className="formula-source-warning">
          考場先抓題目給的數字與單位，搜尋關鍵字後直接套橫式。看不懂法規分類也沒關係，先會代入、會判斷門檻，目標是穩穩拿基本分。
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
