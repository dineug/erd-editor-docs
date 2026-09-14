/** Shared helpers for the table-related-b scenes. */

/**
 * Viewport box of the first element in the editor's shadow root that matches
 * `selector` and whose trimmed text equals `text`. Null when absent.
 */
export function textBox(d, selector, text, index = 0) {
  return d.page.evaluate(
    ([selector, text, index]) => {
      const root = window.__erdShadowRoot;
      if (!root) return null;
      const el = [...root.querySelectorAll(selector)].filter(
        el => el.textContent.trim() === text
      )[index];
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    },
    [selector, text, index]
  );
}

/** Polls fn until it returns something truthy. */
export async function waitFor(d, fn, { timeout = 5000, gap = 50 } = {}) {
  const until = Date.now() + timeout;
  for (;;) {
    const value = await fn();
    if (value) return value;
    if (Date.now() > until) throw new Error('waitFor: timed out');
    await d.sleep(gap);
  }
}

/**
 * Moves the pointer along a polyline through `points` (the first one is where
 * it starts) with one ease over the whole length, so a route that has to keep
 * off hover targets still reads as a single motion rather than stop-and-go.
 */
export async function glide(d, points, duration = 800) {
  const path = [{ x: d.mouse.x, y: d.mouse.y }, ...points];
  const lengths = path.slice(1).map((p, i) => Math.hypot(p.x - path[i].x, p.y - path[i].y));
  const total = lengths.reduce((a, b) => a + b, 0);
  if (total < 1) return;
  const at = s => {
    let i = 0;
    while (i < lengths.length - 1 && s > lengths[i]) s -= lengths[i++];
    const k = lengths[i] ? Math.min(1, s / lengths[i]) : 1;
    return { x: path[i].x + (path[i + 1].x - path[i].x) * k, y: path[i].y + (path[i + 1].y - path[i].y) * k };
  };
  // d.moveTo with a tiny duration emits two events about 16ms apart.
  const steps = Math.max(2, Math.round(duration / 36));
  for (let i = 1; i <= steps; i++) {
    const t = i / steps;
    const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const p = at(e * total);
    const m = d.mouse;
    if (Math.hypot(p.x - m.x, p.y - m.y) < 1) {
      // Under a pixel moveTo jumps without waiting; keep the pace anyway.
      await d.moveTo(p.x, p.y);
      await d.sleep(16);
    } else {
      await d.moveTo(p.x, p.y, 16);
    }
  }
}

/** The live editor settings (zoom, origin, ...). */
export function settings(d) {
  return d.page.evaluate(
    () => JSON.parse(document.querySelector('erd-editor').value).settings
  );
}

/** With TRB_TIMING=1, logs how far into the scenario each mark lands. */
export function timer() {
  const t0 = Date.now();
  return label => {
    if (process.env.TRB_TIMING) console.log(`${((Date.now() - t0) / 1000).toFixed(2)}s ${label}`);
  };
}

/**
 * Viewport box of the context menu item named `name` (the menu's label, not
 * its shortcut), or null while no open menu holds one.
 */
export function menuItemBox(d, name) {
  return d.page.evaluate(name => {
    const root = window.__erdShadowRoot;
    if (!root) return null;
    const item = [...root.querySelectorAll('.context-menu-content [data-id]')].find(
      el => el.firstElementChild?.children[1]?.textContent.trim() === name
    );
    if (!item) return null;
    const r = item.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, name);
}
