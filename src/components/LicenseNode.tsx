import { useState } from "react";
import {
  clearLicenseAccess,
  getDeviceId,
  getMaskedDeviceId,
  loadLicenseAccess,
  saveLicenseAccess,
  toLicenseAccess,
  verifyLicenseCode,
} from "../utils/licenseCode";

type LicenseNodeProps = {
  onAccessChange: (unlocked: boolean) => void;
};

export function LicenseNode({ onAccessChange }: LicenseNodeProps) {
  const storedAccess = loadLicenseAccess();
  const deviceId = getDeviceId();
  const [code, setCode] = useState(storedAccess.code);
  const [unlocked, setUnlocked] = useState(storedAccess.unlocked);
  const [message, setMessage] = useState(storedAccess.unlocked ? `授權有效至 ${storedAccess.endDate || "授權期間內"}。` : "");
  const [checking, setChecking] = useState(false);

  const unlockConvenience = async () => {
    setChecking(true);
    try {
      const response = await verifyLicenseCode(code);
      if (!response.valid) {
        setUnlocked(false);
        onAccessChange(false);
        setMessage(response.message || "授權驗證失敗");
        return;
      }

      const access = toLicenseAccess(response);
      saveLicenseAccess(access);
      setCode(access.code);
      setUnlocked(true);
      onAccessChange(true);
      setMessage(`${response.message}；有效期間 ${access.startDate} 至 ${access.endDate}。`);
    } catch {
      setUnlocked(false);
      onAccessChange(false);
      setMessage("授權伺服器連線失敗，請稍後再試。");
    } finally {
      setChecking(false);
    }
  };

  const lockConvenience = () => {
    clearLicenseAccess();
    setUnlocked(false);
    onAccessChange(false);
    setMessage("已關閉授權便利功能。");
  };

  return (
    <details className={unlocked ? "license-node unlocked" : "license-node"}>
      <summary>{unlocked ? "授權便利功能已啟用" : "授權便利功能"}</summary>
      <div className="license-node-body">
        <p>輸入授權碼後，會綁定本裝置並啟用最近搜尋、收藏搜尋與筆記。</p>
        <small>本機綁定碼：{getMaskedDeviceId(deviceId)}</small>
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.trim())}
          placeholder="輸入授權碼"
          autoCapitalize="characters"
        />
        <div className="license-action-row">
          <button className="button license-button" type="button" onClick={unlockConvenience} disabled={checking}>
            {checking ? "驗證中" : "驗證授權"}
          </button>
          {unlocked && (
            <button className="button license-clear-button" type="button" onClick={lockConvenience}>
              關閉
            </button>
          )}
        </div>
        {message && <p className={unlocked ? "license-message success" : "license-message"}>{message}</p>}
      </div>
    </details>
  );
}
