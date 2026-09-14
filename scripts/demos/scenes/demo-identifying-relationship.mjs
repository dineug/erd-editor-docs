import { readSeed, seedSQL } from '../lib/seed.mjs';
import { SHOW_COMPACT } from './_relationship-editing-helpers.mjs';

/**
 * Relationship Editing > Identifying Relationships: order_items starts keyed
 * on order_id alone, so orders -> order_items is solid and products ->
 * order_items dashed. Alt+K on product_id makes it part of the key and that
 * connector solid; Alt+K again takes it back to dashed.
 */
export default {
  name: 'demo-identifying-relationship',
  width: 920,
  height: 520,
  async setup(d) {
    const sql = readSeed('shop.sql').replace(
      'PRIMARY KEY (order_id, product_id)',
      'PRIMARY KEY (order_id)'
    );
    await seedSQL(d, sql, {
      only: ['orders', 'products', 'order_items'],
      tables: {
        // Far apart, so the dashed route has a long run between its end marks.
        orders: { x: 30, y: 20 },
        products: { x: 30, y: 250 },
        order_items: { x: 600, y: 190 },
      },
      settings: { databaseName: 'shop', show: SHOW_COMPACT },
    });
    await d.moveTo(790, 450, 50);
  },
  async scenario(d) {
    await d.sleep(600);
    const cell = await d.columnBox('order_items', 'product_id');
    await d.click(cell.x + 60, cell.y + cell.height / 2, { duration: 800 });
    await d.sleep(350);
    // Down into the empty corner, clear of the key icon, both connectors and the keycaps.
    await d.moveTo(790, 440, 600);
    await d.sleep(300);
    await d.shot('dashed');

    await d.press('Alt+KeyK');
    await d.sleep(1500);
    await d.shot('identifying');

    await d.press('Alt+KeyK');
    await d.sleep(1600);
  },
};
