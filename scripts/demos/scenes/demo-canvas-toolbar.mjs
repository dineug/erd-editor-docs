import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide, timer } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Canvas Toolbar: New Table and New Memo add one each, New Table Group shows
 * pressed while armed and a second press disarms it, the hand pans even over
 * a table and Space switches back to the pointer, the zoom buttons step the
 * zoom, and zen mode clears everything but the canvas and the toolbar.
 */
export default {
  name: 'demo-canvas-toolbar',
  width: 900,
  height: 520,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      // New Table lands at (200, 100) on the canvas and New Memo, with a table
      // standing there, 50px further down and right (nextPoint), so the left
      // half is kept empty for them. The two tables stand right of centre,
      // one above the other with room for the notation between them, so the
      // hand drag carries them 140px left without anything passing under the
      // minimap, the toolbar or the keycaps.
      tables: {
        members: { x: 470, y: 20, color: '#3b82f6' },
        orders: { x: 470, y: 225, color: '#f59e0b' },
      },
      // Comments, types and keys: the tables stay short enough for the pan.
      settings: { databaseName: 'shop', show: 1 | 4 | 32 | 256 },
    });
    await d.moveTo(300, 410, 0);
  },
  async scenario(d) {
    const mark = timer();
    const box = async selector => mid(await d.domBox(`.floating-toolbar > ${selector}`));
    const button = title => box(`[title^="${title}"]`);
    await d.sleep(400);

    // New Table, then New Memo: one each, where the editor adds them.
    mark('add');
    const addTable = await box('.add-table');
    await d.click(addTable.x, addTable.y, { duration: 380 });
    await d.sleep(500);
    await d.shot('table');
    const addMemo = await box('.add-memo');
    await d.click(addMemo.x, addMemo.y, { duration: 200 });
    await d.sleep(550);
    await d.shot('memo');

    // New Table Group: pressed while armed, Select unmarked, the crosshair
    // over the canvas; a second press disarms it.
    mark('group');
    const addGroup = await box('.add-table-group');
    await d.click(addGroup.x, addGroup.y, { duration: 200 });
    await d.sleep(100);
    await d.moveTo(addGroup.x, addGroup.y - 40, 220);
    await d.sleep(450);
    await d.shot('armed');
    await d.click(addGroup.x, addGroup.y, { duration: 200 });
    await d.sleep(250);
    await d.shot('disarmed');

    // The hand: a drag over a table pans the canvas. Up off the bar first and
    // along above it, so no other button lights up on the way.
    mark('hand');
    const hand = await button('Hand');
    await glide(
      d,
      [
        { x: addGroup.x, y: addGroup.y - 34 },
        { x: hand.x, y: hand.y - 34 },
      ],
      420
    );
    await d.click(hand.x, hand.y, { duration: 150 });
    await d.sleep(120);
    const orders = await d.tableBox('orders');
    const from = { x: orders.x + 90, y: orders.y + 80 };
    await d.moveTo(from.x, from.y, 350);
    await d.drag(from, { x: from.x - 140, y: from.y + 6 }, { duration: 650, holdBefore: 120, holdAfter: 90 });
    await d.sleep(120);
    await d.shot('panned');

    // Space: back to the pointer, on empty canvas below the memo.
    mark('space');
    await d.moveTo(240, 400, 350);
    await d.press('Space');
    await d.sleep(300);
    await d.shot('pointer');

    // Zoom out twice, in twice. Down onto the bar from above it.
    mark('zoom');
    const zoomOut = await button('Zoom out');
    const zoomIn = await button('Zoom in');
    await glide(d, [{ x: zoomOut.x, y: zoomOut.y - 40 }], 300);
    await d.click(zoomOut.x, zoomOut.y, { duration: 150 });
    await d.sleep(220);
    await d.click(zoomOut.x, zoomOut.y, { duration: 100 });
    await d.sleep(300);
    await d.shot('zoomed-out');
    // Over the zoom % rather than across it, so the readout does not light up.
    await glide(
      d,
      [
        { x: zoomOut.x, y: zoomOut.y - 30 },
        { x: zoomIn.x, y: zoomIn.y - 30 },
      ],
      260
    );
    await d.click(zoomIn.x, zoomIn.y, { duration: 120 });
    await d.sleep(220);
    await d.click(zoomIn.x, zoomIn.y, { duration: 100 });
    await d.sleep(250);

    // Zen mode on with Alt+Z, off with its button.
    mark('zen');
    // Up off the bar, then over to empty canvas below the memo.
    await glide(d, [{ x: zoomIn.x - 6, y: zoomIn.y - 36 }, { x: 250, y: 400 }], 380);
    await d.press('Alt+KeyZ');
    await d.sleep(650);
    await d.shot('zen');
    const zen = await button('Zen Mode');
    // Above the zen button first, then straight down onto it, so the path
    // never crosses the relationship notation buttons beside it.
    await d.moveTo(zen.x, zen.y - 40, 300);
    await d.click(zen.x, zen.y, { duration: 180 });
    await d.sleep(200);
    // Up off the zen button, onto empty canvas, so it shows unpressed.
    await d.moveTo(zen.x - 14, zen.y - 34, 200);
    mark('hold');
    await d.sleep(1200);
  },
};
