const crypto = require("crypto");

const prefix = "OSH";
const salt = "CHENGHENG-OSH-LAW-2026";
const email = String(process.argv[2] || "").trim().toLowerCase();
const ym =
  String(process.argv[3] || "")
    .trim()
    .replace(/[^0-9]/g, "") ||
  new Date().toISOString().slice(0, 7).replace("-", "");

if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error("Usage: node scripts/license-code.cjs user@example.com [YYYYMM]");
  process.exit(1);
}

if (!/^\d{6}$/.test(ym) || Number(ym.slice(4, 6)) < 1 || Number(ym.slice(4, 6)) > 12) {
  console.error("YYYYMM must be a valid license month, for example 202606.");
  process.exit(1);
}

const token = crypto
  .createHash("sha256")
  .update(`${salt}:${email}:${ym}`)
  .digest("hex")
  .slice(0, 6)
  .toUpperCase();

console.log(`${prefix}-${ym}-${token}`);
