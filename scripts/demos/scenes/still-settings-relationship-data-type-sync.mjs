import { readSeed, seedSQL } from '../lib/seed.mjs';
import { settingsRowBox } from './_io-settings-helpers.mjs';

/** Still: the Relationship DataType Sync row on the Settings tab. */
export default {
  name: 'still-settings-relationship-data-type-sync',
  width: 800,
  height: 450,
  stillOnly: true,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      settings: { databaseName: 'shop', canvasType: 'settings' },
    });
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
