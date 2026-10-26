// TEMPORARY: paste a hex color to try it as the page background.
// Remove this file and its <script> tag in index.html when you've picked one,
// then put the winner in style.css (:root { --bg: ... }).
(function () {
  const KEY = "tune-bg";
  const DEFAULT = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  const root = document.documentElement;

  const panel = document.createElement("div");
  panel.innerHTML = `
    <label style="display:block;font-weight:600;margin-bottom:6px">Background</label>
    <div style="display:flex;gap:6px;align-items:center">
      <span class="tb-swatch" style="width:22px;height:22px;border:1px solid #0003;border-radius:3px;flex:none"></span>
      <input class="tb-input" spellcheck="false" placeholder="#f4f1ec"
        style="width:110px;font:13px ui-monospace,Menlo,monospace;padding:4px 6px;border:1px solid #0003;border-radius:3px;background:#fff;color:#1a1a1a">
      <button class="tb-reset" title="Back to default" style="font:inherit;padding:4px 8px;border:1px solid #0003;border-radius:3px;background:#fff;color:#1a1a1a;cursor:pointer">Reset</button>
    </div>
    <div class="tb-history" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;max-width:200px"></div>`;
  panel.style.cssText =
    "position:fixed;right:16px;bottom:16px;z-index:9999;background:#fff;color:#1a1a1a;" +
    "font:12px -apple-system,sans-serif;padding:10px 12px;border-radius:6px;box-shadow:0 4px 18px #0003";
  document.body.appendChild(panel);

  const input = panel.querySelector(".tb-input");
  const swatch = panel.querySelector(".tb-swatch");
  const history = panel.querySelector(".tb-history");
  const tried = [];

  const normalize = (v) => {
    const m = v.trim().replace(/^#/, "").match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i);
    return m ? "#" + m[1].toLowerCase() : null;
  };

  function apply(hex, remember) {
    root.style.setProperty("--bg", hex);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", hex);
    swatch.style.background = hex;
    input.value = hex;
    try { localStorage.setItem(KEY, hex); } catch {}
    if (remember && !tried.includes(hex)) {
      tried.push(hex);
      const chip = document.createElement("button");
      chip.title = hex;
      chip.style.cssText = `width:18px;height:18px;border:1px solid #0003;border-radius:3px;background:${hex};cursor:pointer;padding:0`;
      chip.addEventListener("click", () => apply(hex, false));
      history.appendChild(chip);
    }
  }

  input.addEventListener("input", () => {
    const hex = normalize(input.value);
    input.style.borderColor = hex || !input.value ? "#0003" : "#c0392b";
    if (hex) apply(hex, true);
  });
  panel.querySelector(".tb-reset").addEventListener("click", () => {
    root.style.removeProperty("--bg");
    try { localStorage.removeItem(KEY); } catch {}
    swatch.style.background = DEFAULT;
    input.value = DEFAULT;
  });

  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  if (saved) apply(saved, true);
  else { swatch.style.background = DEFAULT; input.value = DEFAULT; }
})();
