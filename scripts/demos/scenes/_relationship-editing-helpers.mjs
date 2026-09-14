/** Shared helpers for the relationship-editing scenes. */
import { readSeed, seedSQL } from '../lib/seed.mjs';

/**
 * The default view options minus the Default and column Comment columns, so
 * tables stay narrow enough for a few of them and their connectors to fit.
 */
export const SHOW_COMPACT = 1 | 4 | 32 | 128 | 256;

/** Seeds shop.sql with the compact view and the database name set. */
export function seedShop(d, { settings, ...options }) {
  return seedSQL(d, readSeed('shop.sql'), {
    ...options,
    settings: { databaseName: 'shop', show: SHOW_COMPACT, ...settings },
  });
}

/** Id of the relationship drawn from the parent table to the child table. */
export async function relationshipId(d, parentName, childName) {
  const doc = await d.value();
  const parent = await d.tableId(parentName);
  const child = await d.tableId(childName);
  const id = doc.doc.relationshipIds.find(id => {
    const { start, end } = doc.collections.relationshipEntities[id];
    return start.tableId === parent && end.tableId === child;
  });
  if (!id) throw new Error(`no relationship ${parentName} -> ${childName}`);
  return id;
}

/** Viewport point `fraction` of the way along a connector's drawn route. */
export async function routePoint(d, parentName, childName, fraction = 0.5) {
  const id = await relationshipId(d, parentName, childName);
  return d.page.evaluate(
    ([id, fraction]) => {
      const stage = window.__erdStages.canvas;
      const group = stage
        .find('.relationship')
        .find(node => node.name().split(/\s+/)[1] === id);
      if (!group) return null;
      const route = group.findOne('.relationship-route');
      const p = route.getPointAtLength(route.getLength() * fraction);
      const abs = route.getAbsoluteTransform().point(p);
      const c = stage.container().getBoundingClientRect();
      return { x: c.left + abs.x, y: c.top + abs.y };
    },
    [id, fraction]
  );
}

/**
 * Viewport box of the context menu row whose own label is `text`, e.g.
 * 'Relationship Type', 'Delete' or 'One Only'. Null while it is not open.
 */
export function menuItemBox(d, text) {
  return d.page.evaluate(text => {
    const root = window.__erdShadowRoot;
    const labels = [...root.querySelectorAll('.context-menu-content div')].filter(
      el =>
        !el.children.length ||
        [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())
    );
    const label = labels.find(el =>
      [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim() === text)
    );
    if (!label) return null;
    const row = label.closest('[data-id]:not([data-id="root"])') ?? label;
    const r = row.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, text);
}

/**
 * A spot to hover a connector from: `fraction` along its route, nudged 3px to
 * the right of a vertical run or below a horizontal one. The hit band is 8px
 * wide, and the pointer glyph then sits beside the line instead of on it.
 */
export async function hoverPoint(d, parentName, childName, fraction = 0.5) {
  const a = await routePoint(d, parentName, childName, Math.max(0, fraction - 0.02));
  const b = await routePoint(d, parentName, childName, Math.min(1, fraction + 0.02));
  const p = await routePoint(d, parentName, childName, fraction);
  const vertical = Math.abs(b.y - a.y) > Math.abs(b.x - a.x);
  return vertical ? { x: p.x + 3, y: p.y } : { x: p.x, y: p.y + 3 };
}

/**
 * Eased pointer travel along a quadratic curve bent toward `via`, for going
 * around a table rather than across it. Built from short d.moveTo hops so
 * the recorder keeps track of where the pointer is.
 */
export async function curveTo(d, via, to, duration = 800) {
  const from = d.mouse;
  const hops = Math.max(4, Math.round(duration / 34));
  for (let i = 1; i <= hops; i++) {
    const t = i / hops;
    const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    const u = 1 - e;
    await d.moveTo(
      u * u * from.x + 2 * u * e * via.x + e * e * to.x,
      u * u * from.y + 2 * u * e * via.y + e * e * to.y,
      16
    );
  }
}

/**
 * Pointer travel that starts fast and settles, the way a hand moves on right
 * after a click, so the pointer does not dwell where it just clicked. `bend`
 * is one control point, or two ([leaving, arriving]) to set both the way out
 * and the way in.
 */
export async function glideTo(d, to, duration = 800, bend) {
  const from = d.mouse;
  const third = k => ({ x: from.x + ((to.x - from.x) * k) / 3, y: from.y + ((to.y - from.y) * k) / 3 });
  const [c1, c2] = !bend ? [third(1), third(2)] : Array.isArray(bend) ? bend : [bend, bend];
  // Each d.moveTo hop takes two 16ms pointer events.
  const hops = Math.max(4, Math.round(duration / 34));
  for (let i = 1; i <= hops; i++) {
    const e = 1 - (1 - i / hops) ** 3;
    const u = 1 - e;
    const at = key =>
      u * u * u * from[key] + 3 * u * u * e * c1[key] + 3 * u * e * e * c2[key] + e * e * e * to[key];
    await d.moveTo(at('x'), at('y'), 16);
  }
}
