# 職業安全衛生法導航 V1.0 部署說明

## Cloudflare Pages

- Build command: `npm.cmd run build`
- Output directory: `dist`
- Node.js: 使用 Cloudflare Pages 預設新版 Node 即可
- Functions: 本專案使用 `functions/api/license.ts` 代理授權驗證 API

本專案已提供：

- `public/_redirects`：讓 Cloudflare Pages 重新整理時回到 `index.html`
- `public/_headers`：基本安全標頭與麥克風權限設定

## V1.0 正式功能

- 法條導航：第一、二章母法條文與官方資料庫連結
- 這條考什麼：條號加關鍵詞開啟 Google AI 模式搜尋
- 法條定位：第 2 條與第 6 條特殊考試脈絡
- 收藏：授權後可收藏 AI 搜尋路徑
- 我的筆記：由收藏建立筆記並保存於瀏覽器 localStorage
- 聲明：開發者、資料來源與 AI 搜尋提醒

## 授權碼

開發者產生授權碼：

```powershell
node .\scripts\license-code.cjs user@user.com.tw 202606
```

使用者在 APP 內輸入授權 Email 與授權碼後，才會解鎖：

- 最近搜尋
- 收藏搜尋
- 我的筆記入口流程

## Apps Script

V1.0 已接入 Apps Script 授權驗證 API：

- 使用者輸入授權碼
- APP 自動產生手機綁定碼
- Cloudflare Pages Function 呼叫 Apps Script
- Apps Script 回傳授權狀態、起訖日、方案與功能

後續若要擴充，建議 Apps Script 再承擔使用者回饋表單或筆記雲端同步。法規查證仍以全國法規資料庫、勞動部與職業安全衛生署官方資料為準。
