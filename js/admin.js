// Halaman admin: simpan otomatis ke server, langsung aktif untuk mahasiswa
let DATA = null, PW = sessionStorage.getItem("adm") || "";

async function post(body) {
  const r = await fetch("/api/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: PW, ...body })
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || "Gagal menyimpan.");
  return j;
}

function updSum() {
  const f = DATA.items.filter(i => i.url).length;
  document.getElementById("sum").textContent = f + " dari " + DATA.items.length + " tautan aktif";
  document.getElementById("bar").style.width = (f / DATA.items.length * 100) + "%";
}

function render() {
  const app = document.getElementById("app");
  app.replaceChildren();
  let n = 0;
  DATA.groups.forEach(g => {
    app.append(el("div", { className: "gtitle", textContent: g.title }));
    DATA.items.filter(i => i.group === g.id).forEach(i => {
      n++;
      const inp = el("input", { className: "in", type: "url", placeholder: "https://… tempel link Google Drive / Forms", value: i.url || "" });
      const tag = el("span", { className: "tag" });
      const test = el("a", { className: "btn ghost sm", textContent: "Tes", target: "_blank", rel: "noopener noreferrer" });
      const clr = el("button", { className: "btn ghost sm", textContent: "Hapus", type: "button" });
      const row = el("div", { className: "row" }, [
        el("div", { className: "ico" }, [icon(i.group === "kumpul" ? "form" : "doc")]),
        el("div", {}, [el("b", { textContent: i.title }), el("small", { textContent: i.desc })]),
        tag,
        el("div", { className: "fld" }, [inp, test, clr])
      ]);
      const show = () => {
        const on = !!i.url;
        tag.textContent = on ? "Aktif" : "Kosong";
        tag.className = "tag " + (on ? "on" : "off");
        test.hidden = !on; clr.hidden = !on;
        if (on) test.href = i.url;
        updSum();
      };
      let t;
      const save = async () => {
        const raw = inp.value.trim();
        const v = raw ? safe(raw) : "";
        if (raw && !v) { row.classList.add("bad"); tag.textContent = "Link tidak valid"; tag.className = "tag off"; return; }
        row.classList.remove("bad");
        if (v === (i.url || "")) { show(); return; }
        tag.textContent = "Menyimpan…"; tag.className = "tag";
        try {
          await post({ id: i.id, url: v });
          i.url = v; inp.value = v; show();
          toast(v ? "Tersimpan. Mahasiswa sudah bisa membuka." : "Link dihapus.");
        } catch (e) { show(); toast(e.message, true); }
      };
      inp.addEventListener("input", () => { clearTimeout(t); t = setTimeout(save, 700); });
      inp.addEventListener("blur", () => { clearTimeout(t); save(); });
      clr.addEventListener("click", () => { inp.value = ""; save(); });
      app.append(row);
      show();
    });
  });
}

async function enter() {
  DATA = await loadData();
  document.getElementById("login").hidden = true;
  document.getElementById("panel").hidden = false;
  document.getElementById("topact").hidden = false;
  render();
}

document.getElementById("lf").addEventListener("submit", async e => {
  e.preventDefault();
  PW = document.getElementById("pw").value;
  const err = document.getElementById("lerr");
  err.textContent = "";
  try { await post({}); sessionStorage.setItem("adm", PW); await enter(); }
  catch (x) { err.textContent = x.message; }
});

document.getElementById("logout").addEventListener("click", () => { sessionStorage.removeItem("adm"); location.reload(); });

if (PW) post({}).then(enter).catch(() => sessionStorage.removeItem("adm"));
