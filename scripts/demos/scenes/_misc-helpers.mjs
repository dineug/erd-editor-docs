/**
 * Shared helpers for the misc scenes: diff viewer, theme builder, overview
 * and the social card.
 */

/** Viewport box of a DOM element in the shadow root, polled until it is laid out. */
export async function waitDom(d, selector, { index = 0, timeout = 3000 } = {}) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.domBox(selector, index);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`element not found: ${selector}`);
    await d.sleep(50);
  }
}

/**
 * Viewport box of a context menu row by its label. Submenus are sibling
 * `.context-menu-content` elements, so a label is unique on screen.
 */
export function menuItemBox(d, label) {
  return d.page.evaluate(label => {
    const items = window.__erdShadowRoot.querySelectorAll(
      '.context-menu-content > div[data-id]:not(.context-menu-content)'
    );
    for (const item of items) {
      if (item.innerText.split('\n')[0].trim() === label) {
        const r = item.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      }
    }
    return null;
  }, label);
}

export async function waitMenuItem(d, label, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await menuItemBox(d, label);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`menu item not found: ${label}`);
    await d.sleep(50);
  }
}

/**
 * Viewport boxes of the diff viewer's change list, top to bottom, as
 * { name, x, y, width, height }. Rows are the direct children of the tree root
 * (the first flex column inside the viewer) that carry an icon and a label.
 */
export function diffTreeRows(d) {
  return d.page.evaluate(() => {
    const rows = [...window.__erdShadowRoot.querySelectorAll('div')].filter(
      el =>
        el.children.length === 2 &&
        el.lastElementChild?.tagName === 'SPAN' &&
        el.getBoundingClientRect().left === 0 &&
        getComputedStyle(el).cursor === 'pointer'
    );
    return rows.map(el => {
      const r = el.getBoundingClientRect();
      return {
        name: el.innerText.trim(),
        x: r.left,
        y: r.top,
        width: r.width,
        height: r.height,
      };
    });
  });
}

/** Viewport box of the top toolbar button whose title starts with `title`, e.g. 'Theme'. */
export function toolbarButtonBox(d, title) {
  return d.page.evaluate(title => {
    const el = window.__erdShadowRoot.querySelector(`.toolbar [title^="${title}"]`);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, title);
}

/**
 * Logs how far into the scenario each step lands when DEMO_TIMING is set.
 * Pointer travel runs slower while the screencast is on, so pacing is tuned
 * against a recorded run rather than the nominal durations.
 */
export function timeline() {
  const start = Date.now();
  return label => {
    if (process.env.DEMO_TIMING) {
      console.log(`  ${((Date.now() - start) / 1000).toFixed(2)}s ${label}`);
    }
  };
}

/**
 * Eased pointer travel along a smooth curve through `waypoints` (a Catmull-Rom
 * spline from the current position), so the pointer can round a table instead
 * of flashing its hover state on the way past. Built from short d.moveTo steps
 * so the recorder keeps track of where the pointer is.
 */
export async function glide(d, waypoints, duration = 700) {
  const pts = [d.mouse, ...waypoints];
  const line = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    for (let s = 1; s <= 24; s++) {
      const t = s / 24;
      const f = (a, b, c, e) =>
        0.5 *
        (2 * b +
          (c - a) * t +
          (2 * a - 5 * b + 4 * c - e) * t * t +
          (3 * b - a - 3 * c + e) * t * t * t);
      line.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  const lengths = [0];
  for (let i = 1; i < line.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y));
  }
  const total = lengths[lengths.length - 1];
  const steps = Math.max(2, Math.round(duration / 32));
  let j = 1;
  for (let k = 1; k <= steps; k++) {
    const t = k / steps;
    const at = total * (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    while (j < line.length - 1 && lengths[j] < at) j++;
    const span = lengths[j] - lengths[j - 1] || 1;
    const u = Math.min(1, Math.max(0, (at - lengths[j - 1]) / span));
    const x = line[j - 1].x + (line[j].x - line[j - 1].x) * u;
    const y = line[j - 1].y + (line[j].y - line[j - 1].y) * u;
    const { x: mx, y: my } = d.mouse;
    // A step under a pixel moves without waiting, so wait for it here.
    if (Math.hypot(x - mx, y - my) < 1) await d.sleep(32);
    await d.moveTo(x, y, 16);
  }
}

/** Centre of the `Close` button on the diff viewer's notice. */
export function closeButtonBox(d) {
  return d.page.evaluate(() => {
    const el = [...window.__erdShadowRoot.querySelectorAll('button, div')]
      .filter(el => el.children.length === 0 && el.textContent.trim() === 'Close')
      .pop();
    if (!el) throw new Error('no Close button');
    const r = (el.closest('button') ?? el).getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  });
}

/**
 * Centre of a swatch in the theme builder panel: group 'accent' or 'gray',
 * name as the swatch's title ('orange', 'sand', ...). Both palettes have a
 * 'gray', so the lookup is scoped to the palette.
 */
export function themeSwatch(d, group, name) {
  return d.page.evaluate(
    ([group, name]) => {
      const palettes = [
        ...window.__erdShadowRoot.querySelectorAll('.theme-builder > div'),
      ].filter(el => el.querySelector('span[title]'));
      const palette = palettes[group === 'gray' ? 1 : 0];
      const el = palette?.querySelector(`span[title="${name}"]`);
      if (!el) throw new Error(`no ${group} swatch ${name}`);
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    },
    [group, name]
  );
}
