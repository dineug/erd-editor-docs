/** Shared by the visualization, quick search and code generator scenes. */
import { center } from '../lib/recorder.mjs';

/** Waits for a DOM element in the editor's shadow root and returns its box. */
export async function waitDom(d, selector, { index = 0, timeout = 5000 } = {}) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.domBox(selector, index);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`waitDom: ${selector} never appeared`);
    await d.sleep(50);
  }
}

/** Moves to and clicks the middle of a DOM element in the shadow root. */
export async function clickDom(d, selector, { index = 0, duration = 700, dx = 0, dy = 0 } = {}) {
  const box = await waitDom(d, selector, { index });
  const c = center(box);
  await d.click(c.x + dx, c.y + dy, { duration });
  return box;
}

/**
 * Waits for a context menu row labelled `label` (first line of its text) and
 * returns its box. Rows are the data-id children of a `.context-menu-content`;
 * `scope` narrows the search to one menu's container.
 */
export async function waitMenuItem(d, label, { scope = '', timeout = 4000 } = {}) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.page.evaluate(
      ([label, scope]) => {
        const rows = window.__erdShadowRoot.querySelectorAll(
          `${scope} .context-menu-content > div[data-id]:not(.context-menu-content)`
        );
        for (const row of rows) {
          if (row.innerText.split('\n')[0].trim() !== label) continue;
          const r = row.getBoundingClientRect();
          if (r.width > 0) return { x: r.left, y: r.top, width: r.width, height: r.height };
        }
        return null;
      },
      [label, scope]
    );
    if (box) return box;
    if (Date.now() > until) throw new Error(`waitMenuItem: no row labelled ${label}`);
    await d.sleep(50);
  }
}

/** A top toolbar tab by its title: 'Visualization', 'Code Generator', ... */
export const tabSelector = title => `.toolbar [title="${title}"]`;

/** Viewport centres of the Graph mode's table dots, keyed by table name. */
export function graphTables(d) {
  return d.page.evaluate(() => {
    const stage = window.__erdStages.visualization;
    const doc = JSON.parse(document.querySelector('erd-editor').value);
    const c = stage.container().getBoundingClientRect();
    const out = {};
    stage
      .find('.visualization-node')
      .filter(n => n.getAttr('kind') === 'visualization-table')
      .forEach(n => {
        const r = n.getClientRect();
        const name = doc.collections.tableEntities[n.getAttr('tableId')].name;
        out[name] = { x: c.left + r.x + r.width / 2, y: c.top + r.y + r.height / 2 };
      });
    return out;
  });
}

/**
 * The point near `near` that lies farthest from every Graph dot (tables and
 * columns), so a wheel or a parked pointer there hovers nothing.
 */
export function graphClearPoint(d, near, radius = 90) {
  return d.page.evaluate(
    ([near, radius]) => {
      const stage = window.__erdStages.visualization;
      const c = stage.container().getBoundingClientRect();
      const dots = stage.find('.visualization-node').map(n => {
        const r = n.getClientRect();
        return { x: c.left + r.x + r.width / 2, y: c.top + r.y + r.height / 2 };
      });
      let best = near;
      let bestGap = -1;
      for (let dx = -radius; dx <= radius; dx += 6) {
        for (let dy = -radius; dy <= radius; dy += 6) {
          const p = { x: near.x + dx, y: near.y + dy };
          const gap = Math.min(...dots.map(q => Math.hypot(q.x - p.x, q.y - p.y)));
          if (gap > bestGap) {
            bestGap = gap;
            best = p;
          }
        }
      }
      return best;
    },
    [near, radius]
  );
}

/**
 * Moves the pointer to `to` without brushing a Graph dot on the way (which
 * would ring a column or open a table preview), through one waypoint if the
 * straight line is blocked. Dots right around `to` do not count, so it can
 * head onto a table dot too.
 */
export async function graphSafeMoveTo(d, to, duration = 500) {
  const all = await d.page.evaluate(() => {
    const stage = window.__erdStages.visualization;
    const c = stage.container().getBoundingClientRect();
    return stage.find('.visualization-node').map(n => {
      const r = n.getClientRect();
      return {
        x: c.left + r.x + r.width / 2,
        y: c.top + r.y + r.height / 2,
        clear: r.width / 2 + 9,
      };
    });
  });
  // Leaving or heading onto a dot: the column dots around it are fair to cross.
  const from = d.mouse;
  const dots = all.filter(
    q => Math.hypot(q.x - to.x, q.y - to.y) > 44 && Math.hypot(q.x - from.x, q.y - from.y) > 44
  );
  const clearLine = (a, b) => {
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(len / 4));
    for (let i = 0; i <= steps; i++) {
      const p = { x: a.x + ((b.x - a.x) * i) / steps, y: a.y + ((b.y - a.y) * i) / steps };
      if (dots.some(q => Math.hypot(q.x - p.x, q.y - p.y) < q.clear)) return false;
    }
    return true;
  };
  if (clearLine(from, to)) return d.moveTo(to.x, to.y, duration);
  let best = null;
  for (let x = 20; x < d.width - 20; x += 20) {
    for (let y = 50; y < d.height - 20; y += 20) {
      const w = { x, y };
      const len = Math.hypot(w.x - from.x, w.y - from.y) + Math.hypot(to.x - w.x, to.y - w.y);
      if (best && len >= best.len) continue;
      if (clearLine(from, w) && clearLine(w, to)) best = { w, len };
    }
  }
  if (!best) return d.moveTo(to.x, to.y, duration);
  const first = Math.hypot(best.w.x - from.x, best.w.y - from.y) / best.len;
  await d.moveTo(best.w.x, best.w.y, Math.max(120, duration * first));
  await d.moveTo(to.x, to.y, Math.max(120, duration * (1 - first)));
}

/**
 * Schema SQL import of sakila.sql leaves stray columns behind: one named "ON"
 * per `ON DELETE` / `ON UPDATE` of an inline foreign key (data type empty, or
 * "SET" for `ON DELETE SET NULL`), and one per inline `UNIQUE INDEX name` or
 * `FULLTEXT` index, with no data type. Real sakila columns all have one.
 */
export function dropStrayColumns(doc) {
  for (const id of doc.doc.tableIds) {
    const table = doc.collections.tableEntities[id];
    table.columnIds = table.columnIds.filter(columnId => {
      const column = doc.collections.tableColumnEntities[columnId];
      const stray = column.name === 'ON' || !column.dataType;
      if (stray) delete doc.collections.tableColumnEntities[columnId];
      return !stray;
    });
    if (table.seqColumnIds) {
      table.seqColumnIds = table.seqColumnIds.filter(
        columnId => doc.collections.tableColumnEntities[columnId]
      );
    }
  }
}

/**
 * Moves the pointer to `to` over the canvas stage (ERD or Flow) crossing as
 * little as possible on the way: a table or memo it passes over would light
 * or hover, and so would a connector. The tables under the start and the end,
 * and the connectors that reach them (already lit), cost nothing. Straight
 * when that is free, else through the cheapest, then shortest, waypoint.
 */
export async function canvasSafeMoveTo(d, to, duration = 600) {
  const from = d.mouse;
  const w = await d.page.evaluate(
    ([from, to, width, height]) => {
      const stage = window.__erdStages.canvas;
      const doc = JSON.parse(document.querySelector('erd-editor').value);
      const c = stage.container().getBoundingClientRect();
      const entityAt = (x, y) => {
        if (y < c.top || y > c.bottom || x < c.left || x > c.right) return null;
        let node = stage.getIntersection({ x: x - c.left, y: y - c.top });
        while (node) {
          const kind = node.getAttr('kind');
          if (kind === 'table' || kind === 'memo') return { kind, id: node.id().replace(/^\w+-/, '') };
          if (kind === 'relationship') return { kind, id: node.name().split(' ')[1] };
          node = node.getParent();
        }
        return null;
      };
      const ends = new Set(
        [entityAt(from.x, from.y), entityAt(to.x, to.y)]
          .filter(e => e?.kind === 'table')
          .map(e => e.id)
      );
      const costOf = e => {
        if (!e) return 0;
        if (e.kind === 'relationship') {
          const r = doc.collections.relationshipEntities[e.id];
          return r && (ends.has(r.start.tableId) || ends.has(r.end.tableId)) ? 0 : 1;
        }
        return ends.has(e.id) ? 0 : 10;
      };
      const cost = (a, b) => {
        const seen = new Map();
        const len = Math.hypot(b.x - a.x, b.y - a.y);
        const steps = Math.max(1, Math.ceil(len / 4));
        for (let i = 0; i <= steps; i++) {
          const e = entityAt(a.x + ((b.x - a.x) * i) / steps, a.y + ((b.y - a.y) * i) / steps);
          if (e) seen.set(`${e.kind}:${e.id}`, costOf(e));
        }
        return [...seen.values()].reduce((sum, v) => sum + v, 0);
      };
      if (cost(from, to) === 0) return null;
      const direct = Math.hypot(to.x - from.x, to.y - from.y);
      let best = { cost: cost(from, to), len: direct, w: null };
      const candidates = [];
      for (let x = 16; x < width - 8; x += 24) {
        for (let y = 40; y < height - 8; y += 24) {
          const len = Math.hypot(x - from.x, y - from.y) + Math.hypot(to.x - x, to.y - y);
          candidates.push({ x, y, len });
        }
      }
      candidates.sort((a, b) => a.len - b.len);
      for (const p of candidates) {
        // A detour longer than twice the straight line reads as wandering.
        if (p.len > direct * 2) break;
        const total = costOf(entityAt(p.x, p.y)) + cost(from, p) + cost(p, to);
        if (total < best.cost || (total === best.cost && p.len < best.len)) {
          best = { cost: total, len: p.len, w: p };
          if (total === 0) break;
        }
      }
      return best.w;
    },
    [from, to, d.width, d.height]
  );
  if (!w) return d.moveTo(to.x, to.y, duration);
  const first = Math.hypot(w.x - from.x, w.y - from.y) / w.len;
  await d.moveTo(w.x, w.y, Math.max(150, duration * first));
  await d.moveTo(to.x, to.y, Math.max(150, duration * (1 - first)));
}

/** Viewport box of a named child ('.table-related', ...) of a table's group. */
export function tablePart(d, tableId, part) {
  return d.page.evaluate(
    ([tableId, part]) => {
      const stage = window.__erdStages.canvas;
      const node = stage?.findOne(`#table-${tableId}`)?.findOne(part);
      if (!node) return null;
      const r = node.getClientRect();
      const c = stage.container().getBoundingClientRect();
      return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
    },
    [tableId, part]
  );
}

/** With DEMO_TIMING set, logs seconds since the scenario started at each mark. */
export function timer() {
  const start = Date.now();
  return label =>
    process.env.DEMO_TIMING &&
    console.log(`  ${((Date.now() - start) / 1000).toFixed(2)}s ${label}`);
}

/** Every Graph dot in viewport px: { x, y, table, name } (name only on tables). */
export function graphDots(d) {
  return d.page.evaluate(() => {
    const stage = window.__erdStages.visualization;
    const doc = JSON.parse(document.querySelector('erd-editor').value);
    const c = stage.container().getBoundingClientRect();
    return stage.find('.visualization-node').map(n => {
      const r = n.getClientRect();
      const table = n.getAttr('kind') === 'visualization-table';
      return {
        x: c.left + r.x + r.width / 2,
        y: c.top + r.y + r.height / 2,
        table,
        name: table ? doc.collections.tableEntities[n.getAttr('tableId')].name : null,
      };
    });
  });
}

/** Viewport box of the Graph's table preview, or null while none is open. */
export const graphPreviewBox = d => d.domBox('.table[data-id]');

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Moves the pointer to `to` along a path that keeps clear of every Graph dot
 * (a brushed table dot opens its preview and relights the graph, a brushed
 * column dot rings), found by A* on a 6px grid and pulled straight wherever
 * the line of sight allows, then walked with one ease over the whole length.
 * The dots right at `from` and `to` are the ones being left and reached; the
 * dots around them are passed closer. `avoid` holds extra viewport boxes to
 * keep out of (an open preview catches the pointer). `margin` scales every
 * clearance, for a layout that is still moving under the pointer. `stopShort`
 * ends the walk that many px before `to`.
 */
export async function graphRouteMoveTo(
  d,
  to,
  duration = 600,
  { avoid = [], margin = 1, stopShort = 0 } = {}
) {
  const from = d.mouse;
  const dots = await graphDots(d);
  const near = (q, p, r) => Math.hypot(q.x - p.x, q.y - p.y) < r;
  const obstacles = dots
    .filter(q => !near(q, to, q.table ? 10 : 5) && !near(q, from, q.table ? 10 : 5))
    .map(q => {
      const end = near(q, to, 52) || near(q, from, 52);
      const clear = q.table ? (end ? 14 : 26) : end ? 9 : 14;
      return { x: q.x, y: q.y, clear: clear * margin };
    });
  const boxes = avoid.filter(Boolean).map(b => ({
    x0: b.x - 8, y0: b.y - 8, x1: b.x + b.width + 8, y1: b.y + b.height + 8,
  }));
  const free = (x, y) =>
    x > 4 && y > 36 && x < d.width - 4 && y < d.height - 4 &&
    obstacles.every(q => Math.hypot(q.x - x, q.y - y) >= q.clear) &&
    boxes.every(b => x < b.x0 || x > b.x1 || y < b.y0 || y > b.y1);
  const sight = (a, b) => {
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const steps = Math.max(1, Math.ceil(len / 3));
    for (let i = 0; i <= steps; i++) {
      const x = a.x + ((b.x - a.x) * i) / steps;
      const y = a.y + ((b.y - a.y) * i) / steps;
      // The first and last few px sit on the dots being left and reached.
      const fromStart = Math.hypot(x - from.x, y - from.y);
      const toEnd = Math.hypot(x - to.x, y - to.y);
      if (fromStart < 6 || toEnd < 6) continue;
      if (!free(x, y)) return false;
    }
    return true;
  };

  let path;
  if (sight(from, to)) {
    path = [from, to];
  } else {
    const S = 6;
    const cols = Math.ceil(d.width / S);
    const rows = Math.ceil(d.height / S);
    const key = (i, j) => j * cols + i;
    const cell = p => [Math.round(p.x / S), Math.round(p.y / S)];
    const [si, sj] = cell(from);
    const [gi, gj] = cell(to);
    const open = new Map([[key(si, sj), { i: si, j: sj, g: 0, f: 0, prev: null }]]);
    const done = new Map();
    let goal = null;
    while (open.size) {
      let cur = null;
      for (const n of open.values()) if (!cur || n.f < cur.f) cur = n;
      open.delete(key(cur.i, cur.j));
      done.set(key(cur.i, cur.j), cur);
      if (Math.abs(cur.i - gi) <= 1 && Math.abs(cur.j - gj) <= 1) {
        goal = cur;
        break;
      }
      for (let di = -1; di <= 1; di++) {
        for (let dj = -1; dj <= 1; dj++) {
          if (!di && !dj) continue;
          const i = cur.i + di;
          const j = cur.j + dj;
          if (i < 0 || j < 0 || i >= cols || j >= rows || done.has(key(i, j))) continue;
          const x = i * S;
          const y = j * S;
          const startish = Math.hypot(x - from.x, y - from.y) < 8;
          if (!startish && !free(x, y)) continue;
          const g = cur.g + Math.hypot(di, dj);
          const old = open.get(key(i, j));
          if (old && old.g <= g) continue;
          open.set(key(i, j), { i, j, g, f: g + Math.hypot(i - gi, j - gj), prev: cur });
        }
      }
    }
    if (!goal) throw new Error(`graphRouteMoveTo: no clear path to ${Math.round(to.x)},${Math.round(to.y)}`);
    const cells = [];
    for (let n = goal; n; n = n.prev) cells.unshift({ x: n.i * S, y: n.j * S });
    cells[0] = from;
    cells.push(to);
    path = [from];
    let at = 0;
    while (at < cells.length - 1) {
      let next = at + 1;
      for (let k = cells.length - 1; k > at + 1; k--) {
        if (sight(cells[at], cells[k])) {
          next = k;
          break;
        }
      }
      path.push(cells[next]);
      at = next;
    }
  }

  const lengths = [0];
  for (let i = 1; i < path.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(path[i].x - path[i - 1].x, path[i].y - path[i - 1].y));
  }
  const total = lengths[lengths.length - 1];
  if (total < 1) return d.moveTo(to.x, to.y, 16);
  const pointAt = s => {
    let k = 1;
    while (k < lengths.length - 1 && lengths[k] < s) k++;
    const t = (s - lengths[k - 1]) / Math.max(1e-6, lengths[k] - lengths[k - 1]);
    return {
      x: path[k - 1].x + (path[k].x - path[k - 1].x) * Math.min(1, t),
      y: path[k - 1].y + (path[k].y - path[k - 1].y) * Math.min(1, t),
    };
  };
  const walk = Math.max(0, total - stopShort);
  const n = Math.max(3, Math.round(duration / 34));
  for (let i = 1; i <= n; i++) {
    const p = pointAt(walk * ease(i / n));
    await d.moveTo(p.x, p.y, 16);
  }
  return path;
}

/**
 * Logs every Graph dot the pointer enters, as [ms since install, kind, name],
 * so a debug run can prove a path hovered only what it meant to. Read it back
 * with graphHoverLog(d).
 */
export function watchGraphHovers(d) {
  return d.page.evaluate(() => {
    const stage = window.__erdStages.visualization;
    const doc = JSON.parse(document.querySelector('erd-editor').value);
    const start = performance.now();
    window.__vscHovers = [];
    stage.off('.vsc');
    const log = type => e => {
      const kind = e.target.getAttr('kind');
      if (!kind) return;
      const table = doc.collections.tableEntities[e.target.getAttr('tableId')];
      const p = stage.getPointerPosition();
      window.__vscHovers.push([
        Math.round(performance.now() - start),
        type,
        kind.replace('visualization-', ''),
        table?.name,
        p && `${Math.round(p.x)},${Math.round(p.y)}`,
      ]);
    };
    stage.on('mouseover.vsc', log('in'));
    stage.on('mouseout.vsc', log('out'));
  });
}

export const graphHoverLog = d => d.page.evaluate(() => window.__vscHovers ?? []);

/**
 * Tells the recorder the pointer now stands at x,y after a raw
 * page.mouse.move, without moving it again: d.moveTo walks from where it last
 * put the pointer, so it is run once with the page's mouse moves muted.
 */
export async function syncPointer(d, x, y) {
  const { mouse } = d.page;
  mouse.move = async () => {};
  try {
    await d.moveTo(x, y, 16);
  } finally {
    delete mouse.move;
  }
}

const cdpSessions = new WeakMap();

/** A CDP session of the page, opened once. */
async function cdpOf(d) {
  if (!cdpSessions.has(d.page)) {
    cdpSessions.set(d.page, await d.page.context().newCDPSession(d.page));
  }
  return cdpSessions.get(d.page);
}

/**
 * Drags a Graph table dot to `to` and lets go, then steps `off` it, without
 * its preview ever painting. Call it with the pointer a few px off the dot
 * (graphRouteMoveTo with stopShort). A mouse move is dispatched at the start
 * of a frame and painted with it, so moving onto the dot and then pressing
 * would show the preview for one frame; the press is sent at the dot instead,
 * which hovers nothing, and the press itself hides the preview for the drag.
 * On release the step off goes out back to back, before the preview, which
 * would open again where the drag began, can paint.
 */
export async function graphDrag(d, tableName, to, { steps = 36, holdBefore = 90, holdAfter = 110, off }) {
  const cdp = await cdpOf(d);
  const dot = (await graphTables(d))[tableName];
  const at = (type, p, pressed) =>
    cdp.send('Input.dispatchMouseEvent', {
      type,
      x: p.x,
      y: p.y,
      button: type === 'mouseMoved' && !pressed ? 'none' : 'left',
      buttons: pressed ? 1 : 0,
      clickCount: type === 'mouseMoved' ? 0 : 1,
    });
  // The held dot is drawn where the pointer was a frame or two ago; a pointer
  // that runs more than its radius ahead leaves it and the highlight blinks
  // off. So each step waits for the dot to catch up before the next.
  const caughtUp = p =>
    d.page.evaluate(
      async ([name, p]) => {
        const stage = window.__erdStages.visualization;
        const doc = JSON.parse(document.querySelector('erd-editor').value);
        const id = doc.doc.tableIds.find(id => doc.collections.tableEntities[id].name === name);
        const node = stage.find('.visualization-node').find(n => n.getAttr('tableId') === id && n.getAttr('kind') === 'visualization-table');
        const c = stage.container().getBoundingClientRect();
        const until = performance.now() + 150;
        for (;;) {
          await new Promise(r => requestAnimationFrame(r));
          const r = node.getClientRect();
          const gap = Math.hypot(c.left + r.x + r.width / 2 - p.x, c.top + r.y + r.height / 2 - p.y);
          if (gap < 2.5 || performance.now() > until) return;
        }
      },
      [tableName, p]
    );
  await at('mousePressed', dot, true);
  await d.sleep(holdBefore);
  const sine = t => (1 - Math.cos(Math.PI * t)) / 2;
  for (let i = 1; i <= steps; i++) {
    const e = sine(i / steps);
    const p = { x: dot.x + (to.x - dot.x) * e, y: dot.y + (to.y - dot.y) * e };
    await at('mouseMoved', p, true);
    await caughtUp(p);
  }
  await d.sleep(holdAfter);
  await at('mouseReleased', to, false);
  await at('mouseMoved', off, false);
  await syncPointer(d, off.x, off.y);
  return dot;
}

/**
 * Steps the pointer off a hovered table dot in one move, `by` px from the
 * dot's centre in the direction given. The dot drifts under a resting pointer
 * while the layout settles, and an eased walk from its edge can leave and
 * enter it again, which closes and reopens the preview. Waits for the preview
 * to close.
 */
export async function graphStepOff(d, tableName, { dx = 0, dy = -1, by = 15 } = {}) {
  const dot = (await graphTables(d))[tableName];
  const len = Math.hypot(dx, dy);
  const p = { x: dot.x + (dx / len) * by, y: dot.y + (dy / len) * by };
  await d.page.mouse.move(p.x, p.y);
  await syncPointer(d, p.x, p.y);
  for (let i = 0; i < 20 && (await graphPreviewBox(d)); i++) await d.sleep(16);
}
