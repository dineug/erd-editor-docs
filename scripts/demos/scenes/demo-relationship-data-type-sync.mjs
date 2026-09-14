import { readSeed, seedSQL } from '../lib/seed.mjs';
import { cellBox, SHOP_SHOW } from './_io-settings-helpers.mjs';

/**
 * Relationship DataType Sync: changing members.id from BIGINT to
 * BIGINT UNSIGNED changes every member_id joined to it (addresses, orders,
 * reviews) as it is typed.
 *
 * Not BIGINT -> INT: the DataType hint list is a fuzzy search, and typing
 * "I" and "IN" lists 41 and 49 types (650-790px at 80%), taller than the
 * frame. Appending " UNSIGNED" lists one row the whole way.
 */

// Where the pointer rests: empty canvas above members, off every table.
const PARK = { x: 236, y: 88 };

export default {
  name: 'demo-relationship-data-type-sync',
  lossless: true,
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'addresses', 'orders', 'reviews'],
      tables: {
        members: { x: 0, y: 100 },
        addresses: { x: 520, y: 0 },
        orders: { x: 520, y: 172 },
        reviews: { x: 520, y: 344 },
      },
      settings: {
        databaseName: 'shop',
        show: SHOP_SHOW,
        zoomLevel: 0.8,
        originX: 48,
        originY: 16,
        relationshipDataTypeSync: true,
      },
    });
    // Keycaps over the floating toolbar rather than over the reviews table.
    await d.page.evaluate(() =>
      document.documentElement.style.setProperty('--demo-keys-bottom', '18px')
    );
    await d.moveTo(PARK.x, PARK.y, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    const cell = await cellBox(d, 'members', 'id', 'columnDataType');
    // In from above, through the header only, not across the other rows.
    await d.dblclick(cell.x + 22, cell.y + cell.height / 2, { duration: 420 });
    await d.sleep(220);
    // Back out the way it came, clear of the text and the hint list.
    await d.moveTo(PARK.x, PARK.y, 480);
    await d.sleep(300);
    // Space and U as one input: "BIGINT " alone raises 19 hints for a frame
    // or two, a flicker down the canvas. The space is invisible, so on screen
    // this is just the U being typed.
    await d.page.keyboard.insertText(' U');
    await d.sleep(150 + Math.random() * 35);
    await d.type('NSIGNED', 150);
    await d.shot('typed');
    await d.sleep(900);
    await d.press('Enter', { hold: 700 });
    await d.whenDrawn();
    await d.shot('committed');
    await d.sleep(1600);
  },
};
