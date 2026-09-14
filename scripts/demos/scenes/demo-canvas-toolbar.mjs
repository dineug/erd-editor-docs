import { readSeed, seedSQL } from '../lib/seed.mjs';
import { timer } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Canvas Toolbar: the hand pans even over a table and Space switches back to
 * the pointer, the zoom buttons step the zoom, and zen mode clears everything
 * but the canvas and the toolbar.
 */
export default {
  name: 'demo-canvas-toolbar',
  width: 900,
  height: 520,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'order_items'],
      // Two rows with room for each connector's notation between the tables.
      // They start left of centre, so the hand drag carries them 140px right
      // into the middle; before and after, nothing sits under the minimap,
      // the toolbar or the keycaps.
      tables: {
        members: { x: 30, y: 40, color: '#3b82f6' },
        orders: { x: 330, y: 40, color: '#f59e0b' },
        order_items: { x: 460, y: 262, color: '#f59e0b' },
      },
      // Comments, types and keys: narrow tables leave room for a long pan.
      settings: { databaseName: 'shop', show: 1 | 4 | 32 | 256 },
    });
    await d.moveTo(230, 350, 0);
  },
  async scenario(d) {
    const mark = timer();
    const button = async title => mid(await d.domBox(`.floating-toolbar > [title^="${title}"]`));
    await d.sleep(500);

    // The hand: a drag over a table pans the canvas.
    mark('hand');
    const hand = await button('Hand');
    await d.click(hand.x, hand.y, { duration: 400 });
    await d.sleep(300);
    const orders = await d.tableBox('orders');
    const from = { x: orders.x + 70, y: orders.y + 80 };
    await d.moveTo(from.x, from.y, 450);
    await d.drag(from, { x: from.x + 140, y: from.y - 10 }, { duration: 800, holdBefore: 150, holdAfter: 120 });
    await d.sleep(250);
    await d.shot('panned');

    // Space: back to the pointer.
    mark('space');
    await d.moveTo(230, 360, 400);
    await d.press('Space');
    await d.sleep(550);
    await d.shot('pointer');

    // Zoom out twice, in twice.
    mark('zoom');
    const zoomOut = await button('Zoom out');
    const zoomIn = await button('Zoom in');
    await d.click(zoomOut.x, zoomOut.y, { duration: 400 });
    await d.sleep(350);
    await d.click(zoomOut.x, zoomOut.y, { duration: 100 });
    await d.sleep(450);
    await d.shot('zoomed-out');
    await d.click(zoomIn.x, zoomIn.y, { duration: 300 });
    await d.sleep(350);
    await d.click(zoomIn.x, zoomIn.y, { duration: 100 });
    await d.sleep(450);

    // Zen mode on with Alt+Z, off with its button.
    mark('zen');
    await d.moveTo(240, 380, 300);
    await d.press('Alt+KeyZ');
    await d.sleep(1000);
    await d.shot('zen');
    const zen = await button('Zen Mode');
    // Above the zen button first, then straight down onto it, so the path
    // never crosses the relationship notation buttons beside it.
    await d.moveTo(zen.x, zen.y - 40, 350);
    await d.click(zen.x, zen.y, { duration: 180 });
    await d.sleep(250);
    // Up off the zen button first, then left above the toolbar, so the pointer
    // passes over no other button on its way out.
    await d.moveTo(zen.x - 14, zen.y - 34, 200);
    await d.moveTo(250, 400, 400);
    mark('hold');
    await d.sleep(1200);
  },
};
