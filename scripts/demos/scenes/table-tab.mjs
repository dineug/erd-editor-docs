import { readSeed, seedSQL } from '../lib/seed.mjs';

/** Where the pointer waits: right of the table, between the minimap and the keycaps. */
const PARK = { x: 700, y: 235 };

/**
 * Tab Key: Tab walks along a row in edit mode, Tab on the last cell adds a
 * column, and Shift+Tab goes back to the cell before.
 */
export default {
  name: 'demo-table-tab',
  width: 860,
  height: 400,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members'],
      tables: { members: { x: 25, y: 30 } },
      settings: { databaseName: 'shop', zoomLevel: 1.2 },
    });
    // Park the pointer off the table so no row starts out hovered.
    await d.moveTo(PARK.x, PARK.y, 50);
    // The keycaps sit right of the table, clear of the row Tab adds at its bottom.
    await d.page.evaluate(() => document.getElementById('demo-keys').style.setProperty('left', '84%'));
  },
  async scenario(d) {
    const row = await d.columnBox('members', 'created_at');

    await d.sleep(500);
    // Pointer travel runs slower while the screencast is on, so these
    // durations are shorter than the moves read on screen.
    await d.click(row.x + 44, row.y + row.height / 2, { duration: 400 });
    await d.sleep(250);
    await d.moveTo(PARK.x, PARK.y, 300);
    await d.press('Enter');
    await d.sleep(650);
    await d.shot('edit-name');

    // DATETIME, N-N (a toggle: focused, not edited), CURRENT_TIMESTAMP, Joined at
    for (const label of ['datatype', 'notnull', 'default', 'comment']) {
      await d.press('Tab');
      await d.sleep(620);
      await d.shot(`tab-${label}`);
    }

    // Tab on the last cell of the last row adds a column.
    await d.press('Tab');
    await d.sleep(750);
    await d.shot('tab-new-column');
    await d.type('phone');
    await d.sleep(250);
    await d.press('Tab');
    await d.sleep(700);
    await d.shot('tab-new-datatype');

    await d.press('Shift+Tab');
    await d.sleep(650);
    await d.shot('shift-tab');
    await d.type('_number');
    await d.sleep(1400);
  },
};
