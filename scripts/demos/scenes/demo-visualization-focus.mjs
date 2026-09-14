/**
 * Visualization, Focusing on Tables: select orders on the ERD tab and press
 * ⌥ + F. Flow opens narrowed to orders and the tables one relationship away,
 * a card's waypoints button narrows to that card instead, and Show all goes
 * back to the whole diagram.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { canvasSafeMoveTo, clickDom, tablePart, timer } from './_vsc-helpers.mjs';

const BAR = '.visualization-toolbar';

// Table comments, names, data types, keys and NOT NULL: no column comments
// or defaults, so three tables sit side by side.
const SHOW = 1 | 4 | 32 | 128 | 256;

const COL = [0, 340, 680];
const ROW = [0, 200, 400];

export default {
  name: 'demo-visualization-focus',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      // Every relationship joins neighbours: members over orders over
      // order_items, with products between reviews and categories.
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
    await d.sleep(500);

    // Select orders, then ⌥ + F.
    const orders = await d.tableBox('orders');
    await d.click(orders.x + orders.width * 0.72, orders.y + 14, { duration: 700 });
    await d.sleep(300);
    // Off the table (it stays selected), to a spot no card in Flow covers.
    await d.moveTo(900, 440, 550);
    await d.sleep(200);
    await d.shot('selected');
    mark('selected');
    await d.press('Alt+KeyF');
    mark('focus');
    await d.sleep(1300);
    await d.shot('focused');

    // The waypoints button on members narrows to members instead.
    const doc = await d.value();
    const idOf = name =>
      doc.doc.tableIds.find(id => doc.collections.tableEntities[id].name === name);
    const members = await d.tableBox('members');
    await canvasSafeMoveTo(d, { x: members.x + members.width * 0.4, y: members.y + members.height * 0.4 }, 600);
    await d.sleep(350);
    const related = await tablePart(d, idOf('members'), '.table-related');
    await d.shot('hover-members');
    await d.click(related.x + related.width / 2, related.y + related.height / 2, { duration: 350 });
    mark('related');
    await d.sleep(350);
    await canvasSafeMoveTo(d, { x: 760, y: 498 }, 500);
    await d.sleep(900);
    await d.shot('members-focus');

    // Show all goes back to the whole diagram.
    await clickDom(d, `${BAR} [title="Show all"]`, { duration: 500 });
    mark('show all');
    await d.sleep(250);
    await d.moveTo(760, 498, 350);
    await d.shot('show-all');
    await d.sleep(1300);
    mark('end');
  },
};
