import { useEffect, useMemo, useState } from "react";
import { buildGoogleAIModeSearchUrl, buildGoogleImageSearchUrl } from "../utils/searchQueryBuilder";
import { addFavorite } from "../utils/favorites";
import { LicenseNode } from "./LicenseNode";
import { loadLicenseAccess } from "../utils/licenseCode";

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

type SpeechRecognition = {
  lang: string;
  interimResults: boolean;
  start: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
};

type SpeechRecognitionEvent = {
  results: ArrayLike<ArrayLike<{ transcript: string }>>;
};

type SpeechRecognitionErrorEvent = {
  error: string;
};

type ArticleAiSearchBoxProps = {
  label: string;
  keywords: string[];
  buildQuery: (keyword: string) => string;
  placeholder: string;
  primaryActionLabel: string;
  imageSearch?: {
    label: string;
    buildQuery: (keyword: string) => string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
};

const maxRecentQueries = 8;

function readRecentQueries(storageKey: string) {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

export function ArticleAiSearchBox({ label, keywords, buildQuery, placeholder, primaryActionLabel, imageSearch, secondaryAction }: ArticleAiSearchBoxProps) {
  const storageKey = useMemo(() => `osh-law-search:${label}:${keywords.join("|")}`, [keywords, label]);
  const suggestionListId = useMemo(() => `search-suggestions-${Math.random().toString(36).slice(2)}`, []);
  const [query, setQuery] = useState("");
  const [licensed, setLicensed] = useState(() => loadLicenseAccess().unlocked);
  const [recentQueries, setRecentQueries] = useState<string[]>(() => loadLicenseAccess().unlocked ? readRecentQueries(storageKey) : []);
  const [listening, setListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const finalQuery = useMemo(() => buildQuery(query), [buildQuery, query]);
  const searchUrl = useMemo(() => buildGoogleAIModeSearchUrl(finalQuery), [finalQuery]);
  const imageQuery = useMemo(() => imageSearch?.buildQuery(query) ?? "", [imageSearch, query]);
  const imageSearchUrl = useMemo(() => buildGoogleImageSearchUrl(imageQuery), [imageQuery]);

  useEffect(() => {
    setRecentQueries(licensed ? readRecentQueries(storageKey) : []);
  }, [licensed, storageKey]);

  const rememberQuery = () => {
    if (!licensed) return;
    const trimmed = query.trim();
    if (!trimmed) return;
    const nextQueries = [trimmed, ...recentQueries.filter((item) => item !== trimmed)].slice(0, maxRecentQueries);
    setRecentQueries(nextQueries);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(nextQueries));
    } catch {
      // localStorage may be unavailable in private or restricted browser contexts.
    }
  };

  const removeRecentQuery = (target: string) => {
    const nextQueries = recentQueries.filter((item) => item !== target);
    setRecentQueries(nextQueries);
    try {
      if (nextQueries.length === 0) {
        window.localStorage.removeItem(storageKey);
        return;
      }
      window.localStorage.setItem(storageKey, JSON.stringify(nextQueries));
    } catch {
      // localStorage may be unavailable in private or restricted browser contexts.
    }
  };

  const favoriteSearch = () => {
    if (!licensed) {
      setFavoriteMessage("收藏搜尋屬於授權便利功能，請先輸入授權碼。");
      return;
    }

    const keyword = query.trim();
    if (!keyword) {
      setFavoriteMessage("請先輸入關鍵詞再收藏。");
      return;
    }

    rememberQuery();
    addFavorite({
      id: `ai:${finalQuery}`,
      type: "aiSearch",
      title: keyword,
      subtitle: finalQuery,
      keyword,
      searchQuery: finalQuery,
      sourceLabel: label,
      url: searchUrl,
    });
    setFavoriteMessage("已收藏此搜尋。");
  };

  const startVoiceInput = () => {
    const Recognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!Recognition) {
      setVoiceMessage("此瀏覽器不支援語音輸入，請改用手機鍵盤語音或直接輸入。");
      return;
    }

    const recognition = new Recognition();
    recognition.lang = "zh-TW";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript;
      if (transcript) {
        setQuery(transcript);
        setVoiceMessage("已帶入語音文字。");
      }
    };
    recognition.onerror = (event) => {
      const messageMap: Record<string, string> = {
        "not-allowed": "麥克風權限被拒絕，請允許瀏覽器使用麥克風。",
        "no-speech": "沒有偵測到語音，請再試一次或直接輸入。",
        "audio-capture": "找不到可用麥克風，請檢查裝置權限。",
        network: "語音辨識服務連線失敗，請改用輸入框。",
      };
      setVoiceMessage(messageMap[event.error] ?? "語音輸入失敗，請改用輸入框。");
      setListening(false);
    };
    recognition.onend = () => setListening(false);

    try {
      setVoiceMessage("請開始說話。");
      setListening(true);
      recognition.start();
    } catch {
      setVoiceMessage("語音輸入無法啟動，請改用輸入框或手機鍵盤語音。");
      setListening(false);
    }
  };

  return (
    <div className="article-search-box">
      <label>{label}</label>
      <div className="article-search-controls">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          list={recentQueries.length > 0 ? suggestionListId : undefined}
        />
        {licensed && recentQueries.length > 0 && (
          <datalist id={suggestionListId}>
            {recentQueries.map((recentQuery) => (
              <option key={recentQuery} value={recentQuery} />
            ))}
          </datalist>
        )}
        {licensed && recentQueries.length > 0 && (
          <div className="recent-query-list" aria-label="最近搜尋">
            {recentQueries.slice(0, 4).map((recentQuery) => (
              <span className="recent-query-chip" key={recentQuery}>
                <button type="button" onClick={() => setQuery(recentQuery)}>
                  {recentQuery}
                </button>
                <button type="button" aria-label={`刪除 ${recentQuery}`} onClick={() => removeRecentQuery(recentQuery)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <LicenseNode onAccessChange={setLicensed} />
      <div className={secondaryAction ? "article-search-actions has-secondary" : "article-search-actions"}>
        <button className="button search-action-voice" type="button" onClick={startVoiceInput}>
          <svg className="mic-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 14a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v5a3 3 0 0 0 3 3Z" />
            <path d="M19 11a7 7 0 0 1-14 0" />
            <path d="M12 18v3" />
            <path d="M8 21h8" />
          </svg>
          {listening ? "聆聽中" : "語音輸入"}
        </button>
        <a className="button search-action-ai app-link-button" href={searchUrl} target="_blank" rel="noreferrer" onClick={rememberQuery}>
          {primaryActionLabel}
        </a>
        {secondaryAction && (
          <button className="button search-action-secondary" type="button" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </button>
        )}
      </div>
      {imageSearch && (
        <a className="button image-search-button app-link-button" href={imageSearchUrl} target="_blank" rel="noreferrer" onClick={rememberQuery}>
          {imageSearch.label}
        </a>
      )}
      <button className="button favorite-search-button" type="button" onClick={favoriteSearch}>
        收藏搜尋
      </button>
      {voiceMessage && <p className="voice-status">{voiceMessage}</p>}
      {favoriteMessage && <p className="voice-status">{favoriteMessage}</p>}
      <p className="search-query-preview">搜尋：{finalQuery}</p>
    </div>
  );
}
