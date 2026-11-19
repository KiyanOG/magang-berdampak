// Fungsi bersama untuk index.html dan admin.html

function safe(u) {
  try {
    const x = new URL(u);
    return /^https?:$/.test(x.protocol) ? x.href : "";
  } catch (e) { return ""; }
}

function el(tag, props = {}, kids = []) {
  const n = document.createElement(tag);
  Object.assign(n, props);
  kids.forEach(k => n.append(k));
  return n;
}

async function loadData() {
  const r = await fetch("/api/links", { cache: "no-store" });
  if (!r.ok) throw new Error("gagal memuat");
  return r.json();
}

// Link Google Drive/Docs/Forms -> versi yang bisa tampil di iframe
function embedUrl(href) {
  try {
    const u = new URL(href);
    if (u.hostname === "drive.google.com") {
      const m = u.pathname.match(/\/file\/d\/([^/]+)/);
      if (m) return "https://drive.google.com/file/d/" + m[1] + "/preview";
    }
    if (u.hostname === "docs.google.com") {
      if (/\/forms\//.test(u.pathname)) { u.searchParams.set("embedded", "true"); return u.href; }
      return href.replace(/\/(edit|view)([?#].*)?$/, "/preview");
    }
    return href;
  } catch (e) { return href; }
}

const ICONS = {
  doc: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
  form: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8.5 12 2.5 2.5 4.5-5"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  ext: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
};
function icon(name) { const s = el("span"); s.innerHTML = ICONS[name]; return s.firstChild; }

let toastT;
function toast(msg, isErr) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = "toast show" + (isErr ? " err" : "");
  clearTimeout(toastT);
  toastT = setTimeout(() => { t.className = "toast" + (isErr ? " err" : ""); }, 2200);
}
