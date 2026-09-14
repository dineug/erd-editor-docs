import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide, textBox, timer, waitFor } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Table Properties + Indexes: open the property panel of a table, add an
 * index, tick two columns, reorder them, flip one to DESC, and read the index
 * back in the Schema SQL tab.
 */
export default {
  name: 'demo-table-properties',
  width: 960,
  height: 530,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'payments'],
      tables: {
        // Clear of the minimap and the canvas toolbar, with room for each
        // connector's notation between the tables, and wholly behind the
        // property panel once it opens.
        members: { x: 40, y: 40, color: '#3b82f6' },
        orders: { x: 525, y: 250, color: '#f59e0b' },
        payments: { x: 40, y: 244, color: '#10b981' },
      },
      settings: { databaseName: 'shop' },
      patch(doc) {
        // The import keeps the bare word; show the literal as SQL writes it.
        for (const column of Object.values(doc.collections.tableColumnEntities)) {
          if (column.default === 'PENDING') column.default = "'PENDING'";
        }
      },
    });
    await d.moveTo(700, 140, 0);

    // HTML5 drag and drop sends no mousemove, so the painted pointer would
    // freeze mid-drag; follow dragover instead (grab-style glyphs are centered).
    await d.page.evaluate(() => {
      const cursor = document.getElementById('demo-cursor');
      window.addEventListener(
        'dragover',
        e => {
          cursor.style.transform = `translate(${e.clientX - 12}px,${e.clientY - 12}px)`;
        },
        true
      );
    });
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);

    mark('open');
    // Select the table and open its properties.
    const orders = await d.tableBox('orders');
    await d.click(orders.x + 70, orders.y + 12, { duration: 450 });
    await d.sleep(300);
    // Caps up with the press, not ahead of it, so they do not sit on the
    // diagram before the panel covers it.
    await d.keys(['⌥', 'Space']);
    await d.page.keyboard.press('Alt+Space');
    await waitFor(d, () => d.domBox('[title="Add Index"]'));
    await d.sleep(550);

    mark('add');
    // Add an index and name it.
    const add = await d.domBox('[title="Add Index"]');
    await d.click(add.x + 22, add.y + add.height / 2, { duration: 450 });
    await d.sleep(350);
    const name = await waitFor(d, () => d.domBox('input[placeholder="name"]'));
    await d.click(name.x + 30, name.y + name.height / 2, { duration: 300 });
    await d.sleep(120);
    // Off the field, down into the empty index list, so the name is not typed
    // under the pointer.
    await d.moveTo(name.x + 30, name.y + name.height / 2 + 62, 250);
    await d.sleep(120);
    await d.type('IX_member_ordered_at', 40);
    await d.sleep(250);

    mark('tick');
    // Tick the columns: ordered_at first, then member_id.
    const checkbox = async i => mid(await d.domBox('input[type="checkbox"]', i));
    let c = await checkbox(3);
    await d.click(c.x, c.y, { duration: 450 });
    await d.sleep(350);
    c = await checkbox(1);
    await d.click(c.x, c.y, { duration: 300 });
    await d.sleep(450);

    mark('reorder');
    // Drag member_id above ordered_at by its grip.
    const grip = mid(await d.domBox('[draggable="true"] .icon', 1));
    const first = await d.domBox('[draggable="true"]', 0);
    await d.moveTo(grip.x, grip.y, 400);
    await d.sleep(120);
    await d.page.mouse.down();
    await d.sleep(150);
    await d.moveTo(grip.x, first.y + 6, 450);
    await d.sleep(350);
    await d.page.mouse.up();
    await d.sleep(500);

    mark('order');
    // Flip ordered_at to DESC.
    const asc = mid(await d.domBox('[draggable="true"] [title="Ascending"]', 1));
    await d.click(asc.x, asc.y, { duration: 350 });
    await d.sleep(60);
    // Off the chip, just below the list, so DESC can be read.
    const rows = await d.domBox('[draggable="true"]', 1);
    const below = rows.y + rows.height + 15;
    await d.moveTo(asc.x, below, 200);
    await d.sleep(500);

    mark('sql');
    // The index in the Schema SQL tab. The way there keeps off every hover
    // target: left under the list, up the gap between the index list and the
    // column rows, left along the gap under the tabs, and up into the tab.
    const tabBox = await textBox(d, '.table-properties div', 'Schema SQL');
    const addIndex = await d.domBox('[title="Add Index"]');
    const lane = (addIndex.x + addIndex.width + rows.x) / 2;
    const band = tabBox.y + tabBox.height + 6;
    const tab = { x: tabBox.x + tabBox.width - 24, y: tabBox.y + tabBox.height / 2 };
    await glide(
      d,
      [
        { x: lane, y: below - 4 },
        { x: lane, y: band + 1 },
        { x: tabBox.x + tabBox.width - 2, y: band },
        tab,
      ],
      750
    );
    await d.click(tab.x, tab.y);
    await d.sleep(150);
    // Out of the way without crossing the SQL, whose copy button shows on
    // hover: back along the gap under the tabs, and up beside them.
    await glide(
      d,
      [
        { x: tabBox.x + tabBox.width - 8, y: band },
        { x: 520, y: band },
        { x: 570, y: tab.y },
      ],
      550
    );
    await d.sleep(150);
    mark('hold');
    await d.sleep(1300);
  },
};
