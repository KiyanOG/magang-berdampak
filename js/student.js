// Halaman mahasiswa
let DATA = null, group = "all", query = "";

const dlg = el("dialog", { className: "viewer" });
const vTitle = el("b");
const vNew = el("a", { className: "btn ghost sm", target: "_blank", rel: "noopener noreferrer", textContent: "Buka di tab baru" });
const vClose = el("button", { className: "btn sm", textContent: "Tutup", onclick: () => dlg.close() });
const frame = el("iframe", { loading: "lazy", allow: "fullscreen", referrerPolicy: "no-referrer-when-downgrade", title: "Tampilan dokumen" });
frame.setAttribute("sandbox", "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads");
dlg.append(
  el("div", { className: "v-head" }, [vTitle, vNew, vClose]),
  el("div", { className: "v-body" }, [frame]),
  el("div", { className: "v-hint", textContent: "Kalau halaman kosong atau tidak tampil, klik “Buka di tab baru”." })
);
document.body.append(dlg);
dlg.addEventListener("close", () => { frame.src = "about:blank"; });
dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

function openViewer(title, href) {
  vTitle.textContent = title;
  vNew.href = href;
  frame.src = embedUrl(href);
  dlg.showModal();
}

function renderTabs() {
  const tabs = document.getElementById("tabs");
  tabs.replaceChildren();
  const all = [{ id: "all", title: "Semua" }, ...DATA.groups];
  all.forEach(g => {
    const n = DATA.items.filter(i => g.id === "all" || i.group === g.id).length;
    const b = el("button", { className: "tab", role: "tab", onclick: () => { group = g.id; renderTabs(); renderCards(); } }, [
      document.createTextNode(g.title), el("small", { textContent: n })
    ]);
    b.setAttribute("aria-selected", String(group === g.id));
    tabs.append(b);
  });
}

function renderCards() {
  const app = document.getElementById("app");
  const q = query.trim().toLowerCase();
  const list = DATA.items.filter(i =>
    (group === "all" || i.group === group) &&
    (!q || (i.title + " " + i.desc + " " + i.tag).toLowerCase().includes(q))
  );
  const open = list.filter(i => safe(i.url)).length;
  document.getElementById("meta").textContent = list.length
    ? open + " dari " + list.length + " tersedia"
    : "";
  app.replaceChildren();
  if (!list.length) {
    app.append(el("div", { className: "empty", textContent: "Tidak ada hasil. Coba kata kunci lain." }));
    return;
  }
  list.forEach(i => {
    const href = safe(i.url);
    const acts = el("div", { className: "acts" });
    if (href) {
      acts.append(
        el("button", { className: "btn main", onclick: () => openViewer(i.title, href) }, [icon("eye"), document.createTextNode("Lihat di sini")]),
        el("a", { className: "btn ghost", href, target: "_blank", rel: "noopener noreferrer", title: "Buka di tab baru", ariaLabel: "Buka di tab baru" }, [icon("ext")])
      );
    } else {
      acts.append(el("span", { className: "btn off", textContent: "Belum tersedia" }));
    }
    app.append(el("div", { className: "card" }, [
      el("div", { className: "top" }, [
        el("div", { className: "ico" }, [icon(i.group === "kumpul" ? "form" : "doc")]),
        el("span", { className: "tag " + (href ? "on" : "off"), textContent: href ? i.tag : "Segera" })
      ]),
      el("h3", { textContent: i.title }),
      el("p", { textContent: i.desc }),
      acts
    ]));
  });
}

async function refresh(first) {
  try {
    const d = await loadData();
    if (JSON.stringify(d) === JSON.stringify(DATA)) return;
    DATA = d;
    renderTabs();
    renderCards();
  } catch (e) {
    if (first) document.getElementById("app").replaceChildren(el("div", { className: "empty", textContent: "Gagal memuat data. Muat ulang halaman." }));
  }
}

document.getElementById("q").addEventListener("input", e => { query = e.target.value; if (DATA) renderCards(); });
document.addEventListener("keydown", e => {
  if (e.key === "/" && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); document.getElementById("q").focus(); }
});

// Otomatis sinkron: cek ulang tiap 20 detik & saat tab dibuka lagi
setInterval(() => { if (!document.hidden && !dlg.open) refresh(); }, 20000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) refresh(); });
refresh(true);
