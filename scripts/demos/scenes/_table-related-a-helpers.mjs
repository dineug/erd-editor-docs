/** Shared helpers for the table-related-a scenes (selection, move, copy, color, view options). */
import { readSeed, seedSQL } from '../lib/seed.mjs';

const now = Date.now();

/** A memo entity, placed in ui coordinates. */
export function memo(id, value, { x, y, width = 180, height = 90, color = '' }) {
  return {
    id,
    value,
    ui: { x, y, width, height, zIndex: 2, color },
    meta: { updateAt: now, createAt: now },
  };
}

/**
 * Seeds the shop schema with only the tables named in `tables`, placed at
 * their ui positions, and any memos given.
 */
export async function seedShop(d, { tables, memos = [], settings = {}, patch, sql } = {}) {
  return seedSQL(d, sql ?? readSeed('shop.sql'), {
    only: Object.keys(tables),
    tables,
    settings: { databaseName: 'shop', ...settings },
    patch(doc, byName) {
      for (const m of memos) {
        doc.collections.memoEntities[m.id] = m;
        doc.doc.memoIds.push(m.id);
      }
      patch?.(doc, byName);
    },
  });
}

/** Viewport box of a memo by id. */
export const memoBox = (d, id) => d.nodeBox(`#memo-${id}`);

/**
 * Where a table can be grabbed to drag it: the icon band above the name cell,
 * left of the add/remove icons (the name cell, color strip and rows are blocked).
 */
export function grip(box, dx = 70) {
  return { x: box.x + dx, y: box.y + 12 };
}

export const easeInOut = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
/** Leaves at speed and settles, for a drag that should clear its start quickly. */
export const easeOut = t => 1 - (1 - t) ** 3;

/**
 * Eased pointer travel along a quadratic curve from the current pointer
 * position through `ctrl` to `to`, so a drag can bend around what it would
 * otherwise hover on the way.
 */
export async function curveTo(d, ctrl, to, duration = 900, ease = easeInOut) {
  const from = d.mouse;
  // Each hop is two pointer events about 25ms apart.
  const steps = Math.max(4, Math.round(duration / 55));
  for (let i = 1; i <= steps; i++) {
    const t = ease(i / steps);
    const x = (1 - t) ** 2 * from.x + 2 * (1 - t) * t * ctrl.x + t * t * to.x;
    const y = (1 - t) ** 2 * from.y + 2 * (1 - t) * t * ctrl.y + t * t * to.y;
    await d.moveTo(x, y, 16);
  }
}

/**
 * Pointer travel to `to` that takes `duration` of wall-clock time, however
 * slow each pointer event is. A drag that moves tables redraws a lot of text
 * on every frame, so holding its real length down keeps the clip small.
 */
export async function glideTo(d, to, duration, ease = easeInOut) {
  const from = d.mouse;
  const start = Date.now();
  for (;;) {
    const t = Math.min(1, (Date.now() - start) / duration);
    const e = ease(t);
    // Through d.moveTo, so the recorder's idea of the pointer stays in step.
    await d.moveTo(from.x + (to.x - from.x) * e, from.y + (to.y - from.y) * e, 0);
    if (t >= 1) break;
  }
}
