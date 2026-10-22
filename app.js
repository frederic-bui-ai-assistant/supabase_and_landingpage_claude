(function () {
  "use strict";

  const { url, key } = window.SUPABASE_CONFIG;
  const client = window.supabase.createClient(url, key);

  const grid = document.getElementById("grid");
  const statusEl = document.getElementById("status");
  const searchEl = document.getElementById("search");
  const sortEl = document.getElementById("sort");

  const eur = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" });
  let produits = [];

  function stockLabel(stock) {
    if (stock <= 0) return { text: "Rupture", cls: "out" };
    if (stock < 15) return { text: `Plus que ${stock}`, cls: "low" };
    return { text: "En stock", cls: "ok" };
  }

  function render() {
    const q = searchEl.value.trim().toLowerCase();
    const [col, dir] = sortEl.value.split(".");
    const list = produits
      .filter((p) => !q || `${p.nom} ${p.description || ""}`.toLowerCase().includes(q))
      .sort((a, b) => {
        const x = a[col], y = b[col];
        const r = typeof x === "string" ? x.localeCompare(y, "fr") : x - y;
        return dir === "desc" ? -r : r;
      });

    grid.replaceChildren();
    statusEl.textContent = list.length
      ? `${list.length} produit${list.length > 1 ? "s" : ""}`
      : "Aucun produit ne correspond à la recherche.";

    for (const p of list) {
      const s = stockLabel(p.stock);
      const card = document.createElement("article");
      card.className = "card";

      const h2 = document.createElement("h2");
      h2.textContent = p.nom;

      const desc = document.createElement("p");
      desc.className = "desc";
      desc.textContent = p.description || "";

      const foot = document.createElement("div");
      foot.className = "card-foot";

      const price = document.createElement("span");
      price.className = "price";
      price.textContent = eur.format(p.prix);

      const badge = document.createElement("span");
      badge.className = `badge ${s.cls}`;
      badge.textContent = s.text;

      foot.append(price, badge);
      card.append(h2, desc, foot);
      grid.append(card);
    }
  }

  async function load() {
    const { data, error } = await client
      .from("produits")
      .select("id, nom, description, prix, stock")
      .order("nom");

    if (error) {
      statusEl.textContent = "Impossible de charger les produits : " + error.message;
      statusEl.classList.add("error");
      return;
    }
    produits = data;
    render();
  }

  searchEl.addEventListener("input", render);
  sortEl.addEventListener("change", render);
  load();
})();
