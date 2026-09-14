import { readSeed, seedSQL } from '../lib/seed.mjs';
import { settings, timer, waitFor } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/** The point on the minimap over a scene point, read off the viewport rectangle. */
async function minimapPoint(d, x, y) {
  const vp = await d.domBox('.minimap-viewport');
  const { originX, originY, zoomLevel } = await settings(d);
  const scale = vp.width / (d.width / zoomLevel);
  return {
    x: vp.x + (x + originX / zoomLevel) * scale,
    y: vp.y + (y + originY / zoomLevel) * scale,
  };
}

/** The scene middle of a table, at zoom 1. */
async function tableMiddle(d, name) {
  const doc = await d.value();
  const { ui } = doc.collections.tableEntities[await d.tableId(name)];
  const box = await d.tableBox(name);
  return { x: ui.x + box.width / 2, y: ui.y + box.height / 2 };
}

/** With TRB_TIMING=1, where every table sits on screen. */
async function logLayout(d, label) {
  if (!process.env.TRB_TIMING) return;
  const doc = await d.value();
  const boxes = {};
  for (const id of doc.doc.tableIds) {
    const b = await d.nodeBox(`#table-${id}`);
    boxes[doc.collections.tableEntities[id].name] = b && [b.x, b.y, b.x + b.width, b.y + b.height].map(Math.round);
  }
  const vp = await d.domBox('.minimap-viewport');
  console.log(label, JSON.stringify({ origin: [doc.settings.originX, doc.settings.originY], vp, boxes }));
}

/**
 * Getting Around the Canvas: drag empty canvas and wheel to pan, click the
 * minimap and drag its viewport rectangle, then Shift + wheel past the last
 * table until the Go to content compass joins the toolbar, and follow it back.
 */
export default {
  name: 'demo-canvas-navigation',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      // Spread wide, so the minimap maps a diagram bigger than the screen, and
      // placed so the opening view holds four whole tables clear of the chrome.
      tables: {
        addresses: { x: 40, y: 40, color: '#3b82f6' },
        members: { x: 380, y: 40, color: '#3b82f6' },
        reviews: { x: 40, y: 300, color: '#ef4444' },
        orders: { x: 720, y: 200, color: '#f59e0b' },
        categories: { x: 40, y: 680, color: '#a855f7' },
        products: { x: 380, y: 680, color: '#a855f7' },
        order_items: { x: 720, y: 680, color: '#f59e0b' },
        payments: { x: 1060, y: 680, color: '#10b981' },
      },
      // Types and keys only: lighter frames for a clip that pans a lot.
      settings: { databaseName: 'shop', show: 4 | 32 | 256 },
    });
    // On empty canvas between the members-orders connector and the minimap,
    // above orders.
    await d.moveTo(720, 120, 0);
  },
  async scenario(d) {
    const mark = timer();
    const products = await tableMiddle(d, 'products');
    await d.sleep(500);
    await logLayout(d, 'open');

    // Drag empty canvas to the left: orders slides along under the minimap
    // without passing beneath it.
    mark('drag');
    await d.drag({ x: 720, y: 120 }, { x: 560, y: 120 }, { duration: 650 });
    await d.sleep(350);
    await logLayout(d, 'dragged');
    await d.shot('dragged');

    // The wheel, up: the tables slide down past the pointer without touching
    // it, stay clear of the keycaps and the toolbar, and leave an empty band
    // across the top that leads straight to the minimap.
    mark('wheel');
    await d.keys(['scroll'], 900);
    await d.wheel(-45, { steps: 2, gap: 160 });
    await d.sleep(400);
    await logLayout(d, 'wheeled');
    await d.shot('wheeled');

    // Click the minimap a little above products, which puts the bottom row
    // of tables in the middle of the screen. The pointer gets there along the
    // empty top band, over no table or connector.
    mark('minimap');
    const p = await minimapPoint(d, products.x + 10, products.y - 62);
    await d.click(p.x, p.y, { duration: 650 });
    await d.sleep(600);
    await logLayout(d, 'minimap');
    await d.shot('minimap');

    // Drag the viewport rectangle.
    mark('viewport');
    const vp = mid(await d.domBox('.minimap-viewport'));
    await d.moveTo(vp.x, vp.y, 300);
    await d.drag(vp, { x: vp.x + 34, y: vp.y }, { duration: 700 });
    await d.sleep(450);
    await logLayout(d, 'rect');
    await d.shot('rect');

    // Shift + wheel sideways past the last table.
    mark('away');
    // Below the tables and above the toolbar, where no table passes under the
    // pointer, near the end of the toolbar where the compass appears.
    await d.moveTo(560, 462, 450);
    await d.holding(
      ['Shift'],
      async () => {
        await d.sleep(150);
        await d.wheel(120, { steps: 8, gap: 70 });
        await d.sleep(200);
      },
      { label: ['⇧', 'scroll'] }
    );
    await d.sleep(300);
    await logLayout(d, 'away');
    await d.shot('away');

    // Follow the compass back.
    const compass = await waitFor(d, () => d.domBox('.content-compass'), { timeout: 1500 });
    // On its right end: the toolbar narrows about its middle once the compass
    // goes, which leaves this spot on empty canvas rather than on a button.
    await d.click(compass.x + compass.width - 10, compass.y + compass.height / 2, { duration: 450 });
    await d.moveTo(760, 430, 400);
    await logLayout(d, 'centered');
    mark('hold');
    await d.sleep(1300);
  },
};
