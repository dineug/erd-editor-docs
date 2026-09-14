import { readSeed, seedSQL } from '../lib/seed.mjs';
import { menuItemBox, timer, waitFor } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Databases: switch the document from MySQL to PostgreSQL in the canvas
 * context menu, then add a column whose DataType autocomplete now offers
 * PostgreSQL's types.
 */
export default {
  name: 'demo-database',
  width: 900,
  height: 480,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['payments'],
      tables: { payments: { x: 90, y: 90, color: '#10b981' } },
      settings: { databaseName: 'shop' },
      patch(doc, byName) {
        // Its DATETIME is MySQL's; leave it out of a table turned PostgreSQL.
        const table = doc.collections.tableEntities[byName.get('payments')];
        const keep = id => doc.collections.tableColumnEntities[id].name !== 'paid_at';
        table.columnIds = table.columnIds.filter(keep);
        table.seqColumnIds = table.seqColumnIds.filter(keep);
      },
    });
    await d.moveTo(600, 200, 0);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);

    // Database submenu: MySQL is checked; pick PostgreSQL.
    mark('menu');
    await d.rightClick(500, 52, { duration: 400 });
    await d.sleep(300);
    const db = mid(await waitFor(d, () => menuItemBox(d, 'Database')));
    const menu = await d.domBox('.context-menu-content');
    // Down the outside edge of the menu, so no other submenu opens on the way.
    await d.moveTo(menu.x - 6, db.y, 400);
    await d.moveTo(menu.x + menu.width - 40, db.y, 350);
    await d.sleep(450);
    const pg = mid(await waitFor(d, () => menuItemBox(d, 'PostgreSQL')));
    await d.moveTo(pg.x - 30, db.y, 200);
    await d.moveTo(pg.x - 20, pg.y, 400);
    await d.sleep(200);
    mark('pick');
    await d.click(pg.x - 20, pg.y, { duration: 100 });
    await d.sleep(800);
    // Close the menu with Escape, leaving the pointer where it is.
    await d.press('Escape');
    await d.sleep(350);

    // Select the table and add a column.
    mark('column');
    const table = await d.tableBox('payments');
    const right = table.x + table.width;
    // In from above the table's right end, so no row lights up on the way.
    await d.moveTo(right + 30, table.y - 14, 400);
    await d.click(table.x + 200, table.y + 14, { duration: 400 });
    await d.sleep(200);
    await d.press('Alt+Enter');
    await d.sleep(200);
    // Out the same way, and park where the autocomplete list will not open
    // under the pointer.
    await d.moveTo(right + 30, table.y - 14, 300);
    await d.moveTo(600, 330, 300);
    await d.press('Enter');
    await d.sleep(150);
    await d.type('metadata', 60);
    await d.press('Tab');
    await d.sleep(300);
    mark('type');
    // "js" alone matches a long fuzzy list; pass it quickly.
    await d.type('j', 75);
    await d.type('so', 15);
    await d.sleep(750);
    await d.press('ArrowDown');
    await d.sleep(300);
    await d.press('ArrowDown');
    await d.sleep(400);
    await d.press('Enter');
    mark('hold');
    await d.shot('done');
    await d.sleep(1500);
  },
};
