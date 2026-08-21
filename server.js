
const express = require("express");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 10000;
const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "soopgodsky221010><";

if (!DATABASE_URL) {
  console.error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

const ALLOWED_KEYS = new Set([
  "gaksky_calendar_shared_v1",
  "skyCalendarEvents",
  "sky_notice_data",
  "skyDresses",
  "skyUpboItems"
]);

app.use(express.json({ limit: "5mb" }));
app.use(express.static(path.join(__dirname, "public")));

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS sky_day_data (
      key TEXT PRIMARY KEY,
      value JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  console.log("PostgreSQL 초기화 완료");
}

function validKey(req, res, next) {
  if (!ALLOWED_KEYS.has(req.params.key)) {
    return res.status(404).json({ error: "알 수 없는 데이터입니다." });
  }
  next();
}

function requireAdmin(req, res, next) {
  if (req.get("x-admin-password") !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "관리자 인증에 실패했습니다." });
  }
  next();
}

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ ok: false, error: "database unavailable" });
  }
});

app.get("/api/data/:key", validKey, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT value, updated_at FROM sky_day_data WHERE key = $1",
      [req.params.key]
    );
    if (!result.rowCount) return res.json({ exists: false });
    res.json({
      exists: true,
      value: result.rows[0].value,
      updatedAt: result.rows[0].updated_at
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 불러오지 못했습니다." });
  }
});

app.put("/api/data/:key", validKey, requireAdmin, async (req, res) => {
  if (!Object.prototype.hasOwnProperty.call(req.body || {}, "value")) {
    return res.status(400).json({ error: "value가 필요합니다." });
  }
  try {
    await pool.query(
      `INSERT INTO sky_day_data (key, value, updated_at)
       VALUES ($1, $2::jsonb, NOW())
       ON CONFLICT (key)
       DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
      [req.params.key, JSON.stringify(req.body.value)]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "데이터를 저장하지 못했습니다." });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

initDb()
  .then(() => app.listen(PORT, "0.0.0.0", () => {
    console.log(`SKY-DAY server running on ${PORT}`);
  }))
  .catch((err) => {
    console.error("DB 초기화 실패", err);
    process.exit(1);
  });
