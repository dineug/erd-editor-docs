import { readSeed, seedSQL } from '../lib/seed.mjs';

/**
 * Adjusting Column Order: on the Settings tab the Comment row is dragged up
 * to sit under Name, and back on the ERD tab every table shows its comment
 * cell right after the column name.
 */
export default {
  name: 'demo-settings-column-order',
  lossless: true,
  width: 800,
  // Tall enough for the whole Column Order list without scrolling.
  height: 640,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      tables: {
        members: { x: 40, y: 50 },
        orders: { x: 190, y: 320 },
      },
      settings: { databaseName: 'shop' },
      // shop.sql leaves the orders columns uncommented; give them comments so
      // both tables show the moved cell with text in it.
      patch(doc, byName) {
        const comments = {
          id: 'Order number',
          member_id: 'Buyer',
          status: 'Order state',
          ordered_at: 'Checkout time',
        };
        const orders = doc.collections.tableEntities[byName.get('orders')];
        for (const id of orders.columnIds) {
          const column = doc.collections.tableColumnEntities[id];
          column.comment = comments[column.name] ?? column.comment;
        }
      },
    });
    // A native drag sends drag events rather than mouse moves, so the painted
    // pointer is fed from dragover and shown grabbing while the row is held.
    await d.page.evaluate(() => {
      const options = { capture: true, passive: true };
      window.addEventListener(
        'dragover',
        e => {
          window.dispatchEvent(
            new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY })
          );
        },
        options
      );
      window.addEventListener('dragstart', () => (window.__demoCursorLock = 'grabbing'), options);
      window.addEventListener('dragend', () => (window.__demoCursorLock = null), options);
    });
    // Above the members table, so the way to the toolbar crosses no table.
    await d.moveTo(600, 44, 0);
  },
  async scenario(d) {
    await d.sleep(550);

    const settings = await d.domBox('[title="Settings"]');
    await d.click(settings.x + settings.width / 2, settings.y + settings.height / 2, {
      duration: 420,
    });
    await d.sleep(500);
    await d.shot('settings');

    const rows = await d.page.evaluate(() =>
      Object.fromEntries(
        [...window.__erdShadowRoot.querySelectorAll('[draggable="true"]')].map(el => {
          const r = el.getBoundingClientRect();
          return [el.innerText.trim(), { x: r.left, y: r.top, width: r.width, height: r.height }];
        })
      )
    );
    const from = rows.Comment;
    const to = rows.DataType;
    const gripX = from.x + 22;
    const midY = box => box.y + box.height / 2;
    const pitch = rows.DataType.y - rows.Name.y;
    // Take the row by its grip, coming in from the left edge of the list so
    // the rows above it do not light up on the way.
    await d.moveTo(from.x - 8, rows.Name.y, 420);
    await d.moveTo(from.x - 8, midY(from), 300);
    await d.moveTo(gripX, midY(from), 180);
    await d.sleep(350);

    // Up one row at a time. The list reorders once the pointer enters the
    // next row and slides the two rows past each other over 0.3s; each hold
    // lets that finish so the held row stays under the hand.
    await d.page.mouse.down();
    await d.sleep(250);
    const steps = Math.round((midY(from) - midY(to)) / pitch);
    for (let i = 1; i <= steps; i++) {
      await d.moveTo(gripX, midY(from) - pitch * i, 220);
      await d.shot(`step-${i}`);
      await d.sleep(i === steps ? 450 : 330);
    }
    await d.page.mouse.up();
    // Along the row, off its label, so the hover follows the released pointer.
    await d.moveTo(to.x + 230, to.y + to.height / 2 + 2, 300);
    await d.sleep(450);
    await d.shot('reordered');

    const erd = await d.domBox('[title="Entity Relationship Diagram"]');
    await d.click(erd.x + erd.width / 2, erd.y + erd.height / 2, { duration: 520 });
    await d.sleep(200);
    // Along the empty strip above the members table.
    await d.moveTo(600, 56, 420);
    await d.whenDrawn();
    await d.shot('erd');
    await d.sleep(1300);
  },
};
