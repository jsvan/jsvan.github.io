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

  function loadEssay(p) {
    const path = p.essay;
    if (!essayCache.has(path)) {
      essayCache.set(
        path,
        fetch(path)
          .then((r) => {
            if (!r.ok) throw new Error(r.status);
            return r.text();
          })
          // An essay that opens with its own tagline would show it twice.
          .then((t) => (t.trimStart().startsWith(p.tagline) ? t.trimStart().slice(p.tagline.length) : t))
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
    loadEssay(p).then((html) => {
      if (seq === renderSeq) essayEl.innerHTML = html;
    });
  }

  function select(p, fromClick) {
    const row = rows.get(p.id) || null;
    if (activeRow) activeRow.classList.remove("active");
    if (row) row.classList.add("active");
    activeRow = row;
    renderFeatured(p);
    current = p;
    if (fromClick) {
      history.replaceState(null, "", p === HOME ? location.pathname : `?p=${p.id}`);
      if (window.matchMedia("(max-width: 768px)").matches) {
        setMenuOpen(false);
        featured.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  const HOME = window.HOME;
  let current = null;
  const goHome = () => { if (current !== HOME) select(HOME, true); };

  // Taglines live in essays/descriptions.txt, one "Title: tagline" per line,
  // matched to titles ignoring case.
  fetch("essays/descriptions.txt")
    .then((r) => (r.ok ? r.text() : ""))
    .catch(() => "")
    .then((text) => {
      const taglines = new Map();
      for (const line of text.split("\n")) {
        const m = line.match(/^([^:]+):\s*(.*)$/);
        if (m) taglines.set(m[1].trim().toLowerCase(), m[2].trim());
      }
      for (const p of [HOME, ...window.FOLDERS.flatMap((f) => f.items)]) {
        p.tagline = taglines.get(p.title.toLowerCase()) || "";
        if (!p.tagline) console.warn(`No line for "${p.title}" in essays/descriptions.txt`);
      }
      build();
    });

  function build() {
    // Home is a row like any project, but with no folder, tagline or X.
    const homeRow = document.createElement("button");
    homeRow.className = "sidebar-row sidebar-home";
    homeRow.innerHTML = `<h3 class="sidebar-row-title">${esc(HOME.title)}</h3>`;
    homeRow.addEventListener("click", goHome);
    rows.set(HOME.id, homeRow);
    sidebar.append(homeRow);

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
        row.innerHTML = `<h3 class="sidebar-row-title">${esc(p.title)}</h3><div class="sidebar-row-meta">${esc(p.tagline)}</div><span class="sidebar-row-close" aria-label="Close, back to Home" title="Back to Home">×</span>`;
        row.addEventListener("click", (e) => {
          if (e.target.closest(".sidebar-row-close")) goHome();
          else select(p, true);
        });
        rows.set(p.id, row);
        group.appendChild(row);
      }
      sidebar.append(label, group);
    }

    const wanted = new URLSearchParams(location.search).get("p");
    select(all.find((p) => p.id === wanted) || HOME, false);
    // Warm the cache so switching projects feels instant.
    [HOME, ...all].forEach(loadEssay);

    // A click anywhere off the open project goes Home. Rows handle their own
    // clicks (including the X), links open in a new tab, Contact has its own menu,
    // and the phone drawer's toggle and backdrop only open and close it.
    document.addEventListener("click", (e) => {
      if (featured.contains(e.target) || e.target.closest(".sidebar-row, a, .contact, .menu-toggle, .sidebar-backdrop, .menu-open .landing-sidebar")) return;
      goHome();
    });
  }

  // Phone drawer: the hamburger opens the project list over the page; the
  // backdrop, Escape or picking a row closes it.
  const menuToggle = document.querySelector(".menu-toggle");
  const backdrop = document.querySelector(".sidebar-backdrop");
  function setMenuOpen(open) {
    document.body.classList.toggle("menu-open", open);
    backdrop.hidden = !open;
    menuToggle.setAttribute("aria-expanded", open);
  }
  menuToggle.addEventListener("click", () => setMenuOpen(!document.body.classList.contains("menu-open")));
  backdrop.addEventListener("click", () => setMenuOpen(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenuOpen(false); });

  // Contact dropdown: toggles on its button, closes on Escape or a click outside.
  const COPY_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
  const CHECK_ICON = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  const contact = document.querySelector(".contact");
  const toggle = contact.querySelector(".contact-toggle");
  const menu = contact.querySelector(".contact-menu");
  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute("aria-expanded", open);
  };
  toggle.addEventListener("click", () => setOpen(menu.hidden));
  document.addEventListener("click", (e) => { if (!contact.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setOpen(false); });
  // The icon and the label both copy; the icon flips to a check to confirm.
  for (const item of contact.querySelectorAll(".contact-item")) {
    const icon = item.querySelector(".contact-copy");
    icon.innerHTML = COPY_ICON;
    const copy = () => {
      navigator.clipboard.writeText(icon.dataset.copy).then(() => {
        icon.innerHTML = CHECK_ICON;
        setTimeout(() => (icon.innerHTML = COPY_ICON), 1200);
      });
    };
    icon.addEventListener("click", copy);
    item.querySelector(".contact-label").addEventListener("click", copy);
  }
})();
