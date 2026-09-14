/**
 * Shared helpers for the import/export and settings scenes.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';

/** Hides the Default column (Show without columnDefault), so five tables fit at 80%. */
export const SHOP_SHOW = 423;

/**
 * Five shop tables in two rows at 80% in a 960x540 viewport: a ring of
 * relationships with the top-right cell left empty for the minimap. The
 * taller tables are raised so each row's connectors run straight between
 * vertically centred neighbours.
 */
export async function seedShopRing(d, { settings = {}, width = 960, zoom = 0.8 } = {}) {
  const col = [0, 408, 796];
  const row = [0, 236];
  // Left edge of members to right edge of products, in scene units.
  const span = 1131;
  return seedSQL(d, readSeed('shop.sql'), {
    only: ['members', 'reviews', 'orders', 'order_items', 'products'],
    tables: {
      members: { x: col[0], y: row[0] },
      reviews: { x: col[1], y: row[0] - 12 },
      orders: { x: col[0], y: row[1] },
      order_items: { x: col[1], y: row[1] },
      products: { x: col[2], y: row[1] - 74 },
    },
    settings: {
      databaseName: 'shop',
      show: SHOP_SHOW,
      zoomLevel: zoom,
      originX: Math.round((width - span * zoom) / 2),
      originY: 70,
      ...settings,
    },
  });
}

/**
 * Viewport box of a context menu item by its label, e.g. 'Import' or 'png'.
 * Submenus are rendered as sibling `.context-menu-content` elements, and only
 * one submenu per level is open at a time, so a label is unique on screen.
 */
export function menuItemBox(d, label) {
  return d.page.evaluate(label => {
    const items = window.__erdShadowRoot.querySelectorAll(
      // A submenu is itself a data-id child of its parent menu: skip it.
      '.context-menu-content > div[data-id]:not(.context-menu-content)'
    );
    for (const item of items) {
      const name = item.innerText.split('\n')[0].trim();
      if (name === label) {
        const r = item.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      }
    }
    return null;
  }, label);
}

/** Waits for a menu item to be on screen and returns its box. */
export async function waitMenuItem(d, label, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await menuItemBox(d, label);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`menu item not found: ${label}`);
    await d.sleep(50);
  }
}

/** A point inside a menu row, past its label so the pointer does not cover it. */
export const labelPoint = box => ({
  x: box.x + Math.round(box.width * 0.62),
  y: box.y + box.height / 2,
});

/**
 * Walks a context menu path such as ['Import', 'json'] the way a person does:
 * along the parent row into the submenu, then up or down inside it, so the
 * pointer never crosses a sibling row that would swap the submenu. Does not
 * click the last item; returns its box.
 */
export async function hoverMenuPath(d, labels, { pause = 380, lastPause = pause } = {}) {
  let box = null;
  for (let i = 0; i < labels.length; i++) {
    box = await waitMenuItem(d, labels[i]);
    const p = labelPoint(box);
    if (i === 0) {
      // Down the menu's left padding, where no row is entered, so the
      // submenus of the rows passed on the way do not flash open.
      if (Math.abs(p.y - d.mouse.y) > box.height && d.mouse.x <= box.x) {
        await d.moveTo(box.x - 4, p.y, 320);
      }
      await d.moveTo(p.x, p.y, 240);
    } else {
      // Straight across into the submenu, then along it to the item.
      await d.moveTo(p.x, d.mouse.y, 280);
      if (Math.abs(p.y - d.mouse.y) > 2) {
        await d.sleep(80);
        await d.moveTo(p.x, p.y, 280);
      } else {
        // Land exactly on the point, so a click there needs no travel: a
        // moveTo over a pixel or two still spends its whole duration (600ms
        // by default, well over a second in practice) and reads as a stall.
        await d.moveTo(p.x, p.y, 0);
      }
    }
    await d.sleep(i === labels.length - 1 ? lastPause : pause);
  }
  return box;
}

/**
 * Viewport box of one cell of a column row, by its Konva name: columnName,
 * columnDataType, columnNotNull, columnUnique, columnAutoIncrement,
 * columnDefault or columnComment.
 */
export async function cellBox(d, tableName, columnName, cell) {
  const id = await d.columnId(tableName, columnName);
  return d.page.evaluate(
    ([id, cell]) => {
      const stage = window.__erdStages.canvas;
      const node = stage.findOne(`#column-${id}`)?.findOne(`.${cell}`);
      if (!node) return null;
      const r = node.getClientRect();
      const c = stage.container().getBoundingClientRect();
      return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
    },
    [id, cell]
  );
}

/** Viewport box of a Preferences row on the Settings tab, by its label. */
export function settingsRowBox(d, label) {
  return d.page.evaluate(label => {
    const root = window.__erdShadowRoot;
    // The row is the div whose first child is the bare label.
    const row = [...root.querySelectorAll('div')].find(el => {
      const first = el.firstElementChild;
      return (
        first &&
        first.children.length === 0 &&
        first.textContent.trim() === label &&
        el.children.length > 1
      );
    });
    if (!row) return null;
    const r = row.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, label);
}
