(function () {
  const featured = document.getElementById("featured");
  const sidebar = document.getElementById("sidebar");
  const essayCache = new Map();
  const rows = new Map();
  let activeRow = null;
  let renderSeq = 0;

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  // Escape, then bold (**x**), inline code (`x`) and bare URLs.
  const inline = (s) =>
    esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*\s][^*]*?)\*(?!\*)/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/(https?:\/\/[^\s<]+[^\s<.,;:)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');

  // A short line with no closing punctuation reads as a section heading.
  const looksLikeHeading = (line) =>
    line.length <= 50 &&
    line.split(/\s+/).length <= 8 &&
    !/[.!?:,;"”)]$/.test(line);

  function renderEssay(text) {
    // Markdown files (READMEs) have real headings; only plain-text essays need guessing.
    const isMarkdown = /^#{2,}\s/m.test(text);
    const out = [];
    let list = null;
    const closeList = () => {
      if (list) out.push(`</${list}>`);
      list = null;
    };
    for (const raw of text.replace(/\r/g, "").split("\n")) {
      const line = raw.trim();
      if (!line) { closeList(); continue; }
      let m;
      if (/^#\s+/.test(line)) { closeList(); continue; } // doc title; the panel has its own
      if ((m = line.match(/^#{2,}\s+(.*)/))) {
        closeList();
        out.push(`<h3 class="essay-heading">${inline(m[1])}</h3>`);
      } else if ((m = line.match(/^[-*]\s+(.*)/)) || (m = line.match(/^\d+\.\s+(.*)/))) {
        const type = /^\d/.test(line) ? "ol" : "ul";
        if (list !== type) { closeList(); out.push(`<${type}>`); list = type; }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if (!isMarkdown && looksLikeHeading(line)) {
        closeList();
        out.push(`<h3 class="essay-heading">${inline(line)}</h3>`);
      } else {
        closeList();
        out.push(`<p>${inline(line)}</p>`);
      }
    }
    closeList();
    return out.join("\n");
  }

  function loadEssay(path) {
    if (!essayCache.has(path)) {
      essayCache.set(
        path,
        fetch(path)
          .then((r) => {
            if (!r.ok) throw new Error(r.status);
            return r.text();
          })
          .then(renderEssay)
          .catch(() => '<p class="essay-error">This essay could not be loaded. If you opened the file directly, serve the folder instead (python3 -m http.server).</p>')
      );
    }
    return essayCache.get(path);
  }

  const link = (p, inner, cls = "") =>
    p.url ? `<a class="${cls}" href="${esc(p.url)}" target="_blank" rel="noopener">${inner}</a>` : inner;

  function renderFeatured(p) {
    const seq = ++renderSeq;
    const isDiagram = p.image.endsWith(".svg");
    const alt = p.alt || `${isDiagram ? "Diagram" : "Screenshot"} of ${p.title}`;
    const visual = `<img class="featured-image${isDiagram ? " featured-diagram" : ""}" src="${esc(p.image)}" alt="${esc(alt)}">`;
    featured.innerHTML = `
      ${link(p, visual, "featured-image-link")}
      <div class="featured-body">
        <h2 class="featured-title">${link(p, esc(p.title))}</h2>
        <p class="featured-summary">${esc(p.tagline)}</p>
        <article class="featured-essay"><p class="essay-loading">Loading…</p></article>
      </div>`;
    featured.scrollTop = 0;
    // Missing image (e.g. the photo isn't added yet): keep the grey box, not a broken icon.
    featured.querySelector(".featured-image").addEventListener("error", (e) => {
      e.target.replaceWith(Object.assign(document.createElement("div"), { className: "featured-image" }));
    });

    const essayEl = featured.querySelector(".featured-essay");
    loadEssay(p.essay).then((html) => {
      if (seq === renderSeq) essayEl.innerHTML = html;
    });
  }

  function select(p, fromClick) {
    const row = rows.get(p.id) || null;
    if (activeRow) activeRow.classList.remove("active");
    if (row) row.classList.add("active");
    activeRow = row;
    renderFeatured(p);
    if (fromClick) {
      history.replaceState(null, "", `?p=${p.id}`);
      if (window.matchMedia("(max-width: 768px)").matches) featured.scrollIntoView({ behavior: "smooth" });
    }
  }

  const all = [];
  for (const folder of window.FOLDERS) {
    const label = document.createElement("h2");
    label.className = "sidebar-folder-name";
    label.textContent = folder.name;
    const group = document.createElement("div");
    group.className = "sidebar-folder-group";
    for (const p of folder.items) {
      all.push(p);
      const row = document.createElement("button");
      row.className = "sidebar-row";
      row.innerHTML = `<h3 class="sidebar-row-title">${esc(p.title)}</h3><div class="sidebar-row-meta">${esc(p.tagline)}</div>`;
      row.addEventListener("click", () => select(p, true));
      rows.set(p.id, row);
      group.appendChild(row);
    }
    sidebar.append(label, group);
  }

  const wanted = new URLSearchParams(location.search).get("p");
  select(all.find((p) => p.id === wanted) || window.ABOUT, false);
  // Warm the cache so switching projects feels instant.
  [window.ABOUT, ...all].forEach((p) => loadEssay(p.essay));
})();
