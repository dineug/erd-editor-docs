import { readSeed, seedSQL } from '../lib/seed.mjs';
import { settingsRowBox } from './_io-settings-helpers.mjs';

/** Still: the Relationship DataType Sync row on the Settings tab. */
export default {
  name: 'still-settings-relationship-data-type-sync',
  width: 800,
  height: 450,
  stillOnly: true,
  async setup(d) {
    // No canvasType in the seed: a new document has its tab locked, and a tab
    // locked at Settings opens on the ERD. The toolbar's tab is clicked instead.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      settings: { databaseName: 'shop' },
    });
    const tab = await d.domBox('.toolbar [title="Settings"]');
    await d.page.mouse.click(tab.x + tab.width / 2, tab.y + tab.height / 2);
    for (let tries = 0; !(await settingsRowBox(d, 'Relationship DataType Sync')); tries++) {
      if (tries > 40) throw new Error('the Settings tab did not open');
      await d.sleep(50);
    }
    await d.moveTo(700, 420, 0);
  },
  async scenario(d) {
    const row = await settingsRowBox(d, 'Relationship DataType Sync');
    if (!row) throw new Error('Relationship DataType Sync row not found');
    // The Preferences heading above the row, for context.
    await d.still('settings-relationship-data-type-sync.png', {
      x: row.x - 14,
      y: row.y - 62,
      width: 290,
      height: row.height + 62 + 14,
    });
  },
};
