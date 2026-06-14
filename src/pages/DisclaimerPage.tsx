export function DisclaimerPage() {
  return (
    <div className="stack">
      <section className="card">
        <h2>開發者與資料來源聲明</h2>
        <p>開發者：正衡調查與風險控管顧問有限公司</p>
      </section>

      <section className="card disclaimer-card">
        <h3>使用定位</h3>
        <p>本工具為乙級職業安全衛生管理員考試輔助工具，用於協助整理查證路徑、搜尋條件與個人筆記。</p>
      </section>

      <section className="card disclaimer-card">
        <h3>法規資料來源</h3>
        <p>法規條文、修正狀態、相關法條、授權子法與施行日期，均應以全國法規資料庫、勞動部、職業安全衛生署及主管機關最新公告為準。</p>
      </section>

      <section className="card disclaimer-card">
        <h3>AI 搜尋提醒</h3>
        <p>AI 搜尋結果僅供學習與查證輔助，不代表正式法律意見、主管機關見解或考試標準答案。使用者應回到官方條文與歷屆試題確認。</p>
      </section>

      <section className="card disclaimer-card">
        <h3>版本</h3>
        <p>V1.0：先建立第一、二章法條導航、考法搜尋、定位、收藏與筆記流程。</p>
      </section>
    </div>
  );
}
