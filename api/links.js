const crypto = require("crypto");
const { groups, items } = require("./_data");

const DB_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const DB_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "magang:urls";

async function redis(cmd) {
  const r = await fetch(DB_URL, {
    method: "POST",
    headers: { Authorization: "Bearer " + DB_TOKEN },
    body: JSON.stringify(cmd)
  });
  const j = await r.json();
  if (!r.ok || j.error) throw new Error(j.error || "Database error");
  return j.result;
}

async function readUrls() {
  if (!DB_URL || !DB_TOKEN) return {};
  const v = await redis(["GET", KEY]);
  return v ? JSON.parse(v) : {};
}

function merged(urls) {
  return {
    groups,
    items: items.map(i => ({ ...i, url: i.id in urls ? urls[i.id] : i.url }))
  };
}

function safe(u) {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) ? x.href : "";
  } catch (e) { return ""; }
}

function same(a, b) {
  const x = crypto.createHash("sha256").update(String(a)).digest();
  const y = crypto.createHash("sha256").update(String(b)).digest();
  return crypto.timingSafeEqual(x, y);
}

module.exports = async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (req.method === "GET") {
      return res.status(200).json(merged(await readUrls()));
    }
    if (req.method === "POST") {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
      if (!process.env.ADMIN_PASSWORD) return res.status(500).json({ error: "ADMIN_PASSWORD belum diatur di Vercel." });
      if (!same(body.password || "", process.env.ADMIN_PASSWORD)) return res.status(401).json({ error: "Password salah." });
      if (body.id === undefined) return res.status(200).json({ ok: true }); // cek login saja
      if (!DB_URL || !DB_TOKEN) return res.status(500).json({ error: "Database belum terhubung. Hubungkan Upstash Redis di Vercel." });
      if (!items.some(i => i.id === body.id)) return res.status(400).json({ error: "ID tidak dikenal." });
      const raw = String(body.url || "").trim();
      const url = raw ? safe(raw) : "";
      if (raw && !url) return res.status(400).json({ error: "Link harus diawali http:// atau https://" });
      const urls = await readUrls();
      urls[body.id] = url;
      await redis(["SET", KEY, JSON.stringify(urls)]);
      return res.status(200).json({ ok: true, ...merged(urls) });
    }
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    return res.status(500).json({ error: "Terjadi kesalahan server." });
  }
};
