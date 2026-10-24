/**
 * Visualization, Previous Table and Next Table: narrow Flow to orders with
 * ⌥ + F, then to members with its card's waypoints button. Previous table
 * steps back to orders, ⌘ + Shift + Z steps forward to members again and
 * ⌘ + Z back, and Show all widens to the whole diagram, which is a step of
 * its own.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { canvasSafeMoveTo, tablePart, timer } from './_vsc-helpers.mjs';

const BAR = '.visualization-toolbar';

// The demo-visualization-focus seed: table comments, names, data types, keys
// and NOT NULL, no column comments or defaults, so three tables sit side by
// side, and every relationship joins neighbours.
const SHOW = 1 | 4 | 32 | 128 | 256;

const COL = [0, 340, 680];
const ROW = [0, 200, 400];

const ease = t => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Glides across and then down onto `to`, along a cubic that keeps the
 * pointer's height until it is nearly over `to`, so it comes onto a bar
 * button from above without brushing the buttons beside it.
 */
async function glideDownTo(d, to, duration = 550) {
  const p0 = d.mouse;
  const c1 = { x: (p0.x + to.x) / 2, y: p0.y };
  const c2 = { x: to.x, y: p0.y };
  const at = (a, b, c, e, t) =>
    a * (1 - t) ** 3 + 3 * b * t * (1 - t) ** 2 + 3 * c * t * t * (1 - t) + e * t ** 3;
  const n = Math.max(3, Math.round(duration / 16));
  for (let i = 1; i <= n; i++) {
    const t = ease(i / n);
    await d.moveTo(at(p0.x, c1.x, c2.x, to.x, t), at(p0.y, c1.y, c2.y, to.y, t), 16);
  }
}

export default {
  name: 'demo-visualization-steps',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      tables: {
        addresses: { x: COL[0], y: ROW[0] },
        members: { x: COL[1], y: ROW[0] },
        reviews: { x: COL[2], y: ROW[0] },
        payments: { x: COL[0], y: ROW[1] },
        orders: { x: COL[1], y: ROW[1] },
        products: { x: COL[2], y: ROW[1] },
        order_items: { x: COL[1], y: ROW[2] },
        categories: { x: COL[2], y: ROW[2] },
      },
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: 0.75, originX: 50, originY: 12 },
    });
    await d.page.mouse.move(880, 300);
    await d.moveTo(880, 300, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(400);

    // Select orders, then ⌥ + F: Flow opens on orders and its one hop, with
    // both arrows dimmed.
    const orders = await d.tableBox('orders');
    await d.click(orders.x + orders.width * 0.72, orders.y + 14, { duration: 650 });
    await d.sleep(250);
    // Off the table (it stays selected), to a spot no card in Flow covers.
    await d.moveTo(900, 440, 500);
    await d.sleep(150);
    await d.shot('selected');
    await d.press('Alt+KeyF');
    mark('focus');
    await d.sleep(1100);
    await d.shot('focused');

    // The waypoints button on members narrows to members: Previous table lights.
    const membersId = await d.tableId('members');
    const members = await d.tableBox('members');
    await canvasSafeMoveTo(d, { x: members.x + members.width * 0.4, y: members.y + members.height * 0.4 }, 550);
    await d.sleep(250);
    const related = await tablePart(d, membersId, '.table-related');
    await d.shot('hover-members');
    await d.click(related.x + related.width / 2, related.y + related.height / 2, { duration: 350 });
    mark('members');
    await d.sleep(300);
    // The pointer waits on the empty canvas just above the arrows, so each
    // trip to the bar is a short drop that brushes no other button. Every
    // layout in the clip leaves that strip clear.
    const bar = await d.domBox(BAR);
    const previous = center(await d.domBox(`${BAR} [title^="Previous table"]`));
    const rest = { x: previous.x + 10, y: bar.y - 36 };
    await canvasSafeMoveTo(d, rest, 550);
    await d.sleep(700);
    await d.shot('members-focus');

    // Previous table: back to orders and its one hop; Next table lights.
    await d.click(previous.x, previous.y, { duration: 320 });
    mark('previous');
    await d.sleep(200);
    await d.moveTo(rest.x, rest.y, 320);
    await d.sleep(750);
    await d.shot('previous');

    // The redo and undo keys step the same way on this tab.
    await d.press('ControlOrMeta+Shift+KeyZ');
    mark('next key');
    await d.sleep(1100);
    await d.shot('next-key');
    await d.press('ControlOrMeta+KeyZ');
    mark('previous key');
    await d.sleep(1050);
    await d.shot('previous-key');

    // Show all widens to the whole diagram, a step of its own: Previous
    // table stays lit and Next table dims.
    await glideDownTo(d, center(await d.domBox(`${BAR} [title="Show all"]`)), 600);
    await d.click(d.mouse.x, d.mouse.y, { duration: 1 });
    mark('show all');
    await d.sleep(250);
    // Then right of the bar, which shrinks once Show all is gone.
    await d.moveTo(bar.x + bar.width + 44, bar.y + bar.height / 2, 350);
    await d.shot('show-all');
    await d.sleep(1150);
    mark('end');
  },
};
