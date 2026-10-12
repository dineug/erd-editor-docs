/**
 * Table Groups: New Table Group on the canvas menu arms a draw, and the box
 * dragged over orders and payments becomes a group they join, its name
 * editor open for Billing. order_items dragged onto the group joins it too,
 * the group outlined while it would; the title bar then carries the group
 * and its three tables, and a corner sash resizes it.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { waitMenuItem } from './_io-settings-helpers.mjs';
import { timeline, waitDom } from './_misc-helpers.mjs';
import { curveTo, glideTo } from './_table-related-a-helpers.mjs';

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;
const ZOOM = 0.8;

/** Polls a Konva node on the canvas stage until it is drawn, and returns its box. */
async function waitNode(d, selector, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.nodeBox(selector);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`node not found: ${selector}`);
    await d.sleep(50);
  }
}

/**
 * Pointer travel through `waypoints` on a smooth curve (Catmull-Rom from the
 * current position), eased, that takes `duration` of wall-clock time however
 * slow each pointer event runs while the screencast is on.
 */
async function sweep(d, waypoints, duration) {
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
  const start = Date.now();
  let j = 1;
  for (;;) {
    const t = Math.min(1, (Date.now() - start) / duration);
    const at = total * (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    while (j < line.length - 1 && lengths[j] < at) j++;
    const span = lengths[j] - lengths[j - 1] || 1;
    const u = Math.min(1, Math.max(0, (at - lengths[j - 1]) / span));
    await d.moveTo(
      line[j - 1].x + (line[j].x - line[j - 1].x) * u,
      line[j - 1].y + (line[j].y - line[j - 1].y) * u,
      0
    );
    if (t >= 1) break;
  }
}

export default {
  name: 'demo-table-group',
  width: 960,
  height: 540,
  async setup(d) {
    // members stays out of the group, top left. orders and payments share the
    // lower row, with room right of payments for order_items, which waits
    // further right, under the minimap.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'payments', 'order_items'],
      tables: {
        members: { x: 50, y: 40 },
        orders: { x: 75, y: 325 },
        payments: { x: 375, y: 325 },
        order_items: { x: 880, y: 340 },
      },
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: ZOOM },
    });
    await d.moveTo(560, 150, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(400);

    // The canvas menu, then New Table Group: the pointer becomes a crosshair.
    await d.rightClick(540, 64, { duration: 450 });
    const item = await waitMenuItem(d, 'New Table Group');
    // Down the menu's left padding, then in along the row.
    await d.moveTo(item.x - 4, item.y + item.height / 2, 260);
    const at = { x: item.x + item.width * 0.55, y: item.y + item.height / 2 };
    await d.moveTo(at.x, at.y, 260);
    await d.sleep(320);
    await d.click(at.x, at.y, { duration: 0 });
    mark('armed');

    // Draw a box over orders and payments, with room to their right.
    const orders = await d.tableBox('orders');
    const payments = await d.tableBox('payments');
    const from = { x: orders.x - 30, y: orders.y - 50 };
    const to = { x: payments.x + payments.width + 175, y: payments.y + payments.height + 36 };
    await curveTo(d, { x: from.x + 120, y: from.y - 80 }, from, 650);
    await d.sleep(200);
    await d.drag(from, to, { duration: 1100, holdBefore: 80, holdAfter: 160 });
    await waitDom(d, '.table-group-name-input');
    mark('drawn');
    await d.sleep(400);
    await d.shot('drawn');

    // Name it.
    await d.type('Billing', 90);
    await d.sleep(200);
    await d.press('Enter', { hold: 700 });
    await d.whenDrawn();
    mark('named');
    await d.sleep(350);
    await d.shot('named');

    // order_items onto the group: the group is outlined while the drop
    // would put it there, and it joins as it lands.
    const items = await d.tableBox('order_items');
    const grip = { x: items.x + 56, y: items.y + 10 };
    await curveTo(d, { x: grip.x - 20, y: grip.y - 90 }, grip, 750);
    await d.sleep(180);
    await d.page.mouse.down();
    await d.sleep(120);
    // Its centre well inside the box, a gap right of payments.
    const drop = { x: payments.x + payments.width + 26 + 56, y: grip.y - 8 };
    await glideTo(d, drop, 1000);
    await d.sleep(300);
    await d.shot('drop-target');
    await d.page.mouse.up();
    mark('joined');
    await d.sleep(500);
    await d.shot('joined');

    // The title bar carries the group and its tables; members stays.
    const bar = await waitNode(d, '.table-group-title-bar');
    const grab = { x: bar.x + 150, y: bar.y + bar.height / 2 };
    await curveTo(d, { x: grab.x + 160, y: grab.y - 40 }, grab, 700);
    await d.sleep(250);
    await d.shot('bar-hover');
    await d.page.mouse.down();
    await d.sleep(120);
    await glideTo(d, { x: grab.x + 110, y: grab.y - 40 }, 900);
    await d.sleep(150);
    await d.page.mouse.up();
    mark('moved');
    await d.sleep(350);
    await d.shot('moved');

    // A corner sash resizes it. Over the tables' tops inside the group, out
    // past its right edge and down to the corner, crossing no table.
    const sash = center(await waitNode(d, '.table-group-sash-rb'));
    const right = sash.x + 30;
    await sweep(
      d,
      [
        { x: d.mouse.x + 260, y: d.mouse.y + 22 },
        { x: right, y: d.mouse.y + 40 },
        { x: right, y: sash.y - 28 },
        sash,
      ],
      1100
    );
    await d.sleep(250);
    await d.page.mouse.down();
    await d.sleep(120);
    await glideTo(d, { x: sash.x + 50, y: sash.y + 30 }, 800);
    await d.sleep(150);
    await d.page.mouse.up();
    mark('resized');
    await d.sleep(400);
    await d.shot('resized');

    // A click on empty canvas lets the group go.
    await d.click(680, 140, { duration: 550 });
    await d.sleep(1200);
    await d.shot('done');
    mark('end');
  },
};
