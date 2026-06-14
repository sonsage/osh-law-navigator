const licenseStorageKey = "osh-law-navigator:license";
const deviceStorageKey = "osh-law-navigator:device-id";

export type LicenseFeatures = Record<string, boolean>;

export type LicenseAccess = {
  code: string;
  deviceId: string;
  startDate: string;
  endDate: string;
  plan: string;
  features: LicenseFeatures;
  unlocked: boolean;
};

export type LicenseApiResponse = {
  valid: boolean;
  status: string;
  message: string;
  licenseCode?: string;
  deviceId?: string;
  startDate?: string;
  endDate?: string;
  plan?: string;
  features?: LicenseFeatures;
};

function createDeviceId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  const values = crypto.getRandomValues(new Uint8Array(16));
  values[6] = (values[6] & 0x0f) | 0x40;
  values[8] = (values[8] & 0x3f) | 0x80;
  const hex = Array.from(values, (value) => value.toString(16).padStart(2, "0"));
  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

export function getDeviceId() {
  const storedDeviceId = window.localStorage.getItem(deviceStorageKey);
  if (storedDeviceId) return storedDeviceId;

  const nextDeviceId = createDeviceId();
  window.localStorage.setItem(deviceStorageKey, nextDeviceId);
  return nextDeviceId;
}

export function getMaskedDeviceId(deviceId: string) {
  return deviceId ? deviceId.slice(-8).toUpperCase() : "";
}

export async function verifyLicenseCode(code: string): Promise<LicenseApiResponse> {
  const licenseCode = code.trim();
  const deviceId = getDeviceId();

  if (!licenseCode) {
    return {
      valid: false,
      status: "missing_parameter",
      message: "請輸入授權碼",
    };
  }

  const params = new URLSearchParams({ licenseCode, deviceId });
  const response = await fetch(`/api/license?${params.toString()}`);
  if (!response.ok) {
    return {
      valid: false,
      status: "network_error",
      message: "授權伺服器連線失敗，請稍後再試",
    };
  }

  return await response.json() as LicenseApiResponse;
}

export function toLicenseAccess(response: LicenseApiResponse): LicenseAccess {
  return {
    code: response.licenseCode ?? "",
    deviceId: response.deviceId ?? getDeviceId(),
    startDate: response.startDate ?? "",
    endDate: response.endDate ?? "",
    plan: response.plan ?? "",
    features: response.features ?? {},
    unlocked: response.valid === true,
  };
}

export function loadLicenseAccess(): LicenseAccess {
  try {
    const raw = window.localStorage.getItem(licenseStorageKey);
    if (!raw) {
      return { code: "", deviceId: getDeviceId(), startDate: "", endDate: "", plan: "", features: {}, unlocked: false };
    }
    const parsed = JSON.parse(raw) as Partial<LicenseAccess>;
    return {
      code: typeof parsed.code === "string" ? parsed.code : "",
      deviceId: typeof parsed.deviceId === "string" && parsed.deviceId ? parsed.deviceId : getDeviceId(),
      startDate: typeof parsed.startDate === "string" ? parsed.startDate : "",
      endDate: typeof parsed.endDate === "string" ? parsed.endDate : "",
      plan: typeof parsed.plan === "string" ? parsed.plan : "",
      features: parsed.features && typeof parsed.features === "object" ? parsed.features : {},
      unlocked: parsed.unlocked === true,
    };
  } catch {
    return { code: "", deviceId: getDeviceId(), startDate: "", endDate: "", plan: "", features: {}, unlocked: false };
  }
}

export function saveLicenseAccess(access: LicenseAccess) {
  window.localStorage.setItem(licenseStorageKey, JSON.stringify(access));
}

export function clearLicenseAccess() {
  window.localStorage.removeItem(licenseStorageKey);
}
