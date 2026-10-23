// Render diagrams/*.mmd to images/work/*.svg using local Chrome.
// Usage (from the homepage folder): node tools/render-diagrams.mjs
// Needs Google Chrome and network access to cdn.jsdelivr.net (for Mermaid, at build time only).
import { spawn } from "node:child_process";
import { readdirSync, readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const port = 9334;
const profile = mkdtempSync(join(tmpdir(), "render-diagrams-"));
const chrome = spawn(CHROME, ["--headless=new", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

try {
  let targets;
  for (let i = 0; i < 50 && !targets; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); } catch { await sleep(200); }
  }
  const ws = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (m) => {
    const msg = JSON.parse(m.data);
    pending.get(msg.id)?.(msg);
  };
  const send = (method, params = {}) =>
    new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const evaluate = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
    return r.result.result.value;
  };

  await send("Page.navigate", { url: pathToFileURL(join(root, "tools/render.html")).href });
  for (let i = 0; i < 50 && !(await evaluate("typeof window.renderDiagram === 'function'").catch(() => false)); i++) await sleep(200);

  const files = readdirSync(join(root, "diagrams")).filter((f) => f.endsWith(".mmd"));
  for (const f of files) {
    const code = readFileSync(join(root, "diagrams", f), "utf8");
    let svg = await evaluate(`renderDiagram(${JSON.stringify(code)})`);
    // Mermaid emits width="100%" with no height, which an <img> treats as 300x150.
    // Stamp the real size from the viewBox so the page can scale it correctly.
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    svg = svg.replace(/^<svg([^>]*?) width="100%"/, `<svg$1 width="${Math.ceil(w)}" height="${Math.ceil(h)}"`)
      .replace(/^<svg([^>]*?) style="max-width: [^"]*;?"/, "<svg$1");
    const out = join(root, "images/work", f.replace(/\.mmd$/, ".svg"));
    writeFileSync(out, svg);
    console.log("wrote", out.slice(root.length + 1));
  }
  ws.close();
} finally {
  chrome.kill();
  rmSync(profile, { recursive: true, force: true });
}
