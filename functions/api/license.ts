const appsScriptLicenseUrl = "https://script.google.com/macros/s/AKfycbwQMTMFBzrZeRYN_JDMMMyRods3okPe1rk3nqaILbHGDBs68iDqXEYWiAIQVwAZGpwW/exec";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}

export async function onRequestGet(context: { request: Request }) {
  const url = new URL(context.request.url);
  const licenseCode = url.searchParams.get("licenseCode")?.trim() ?? "";
  const deviceId = url.searchParams.get("deviceId")?.trim() ?? "";

  if (!licenseCode || !deviceId) {
    return jsonResponse({
      valid: false,
      status: "missing_parameter",
      message: "缺少授權碼或手機綁定碼",
    }, 400);
  }

  const upstreamUrl = new URL(appsScriptLicenseUrl);
  upstreamUrl.searchParams.set("licenseCode", licenseCode);
  upstreamUrl.searchParams.set("deviceId", deviceId);

  try {
    const upstreamResponse = await fetch(upstreamUrl.toString(), {
      headers: { accept: "application/json" },
    });
    const text = await upstreamResponse.text();

    try {
      return jsonResponse(JSON.parse(text), upstreamResponse.ok ? 200 : upstreamResponse.status);
    } catch {
      return jsonResponse({
        valid: false,
        status: "bad_upstream_response",
        message: "授權伺服器回傳格式錯誤",
      }, 502);
    }
  } catch {
    return jsonResponse({
      valid: false,
      status: "upstream_unavailable",
      message: "授權伺服器暫時無法連線",
    }, 502);
  }
}
