import { readSeed, seedSQL } from '../lib/seed.mjs';
import { curveTo, hoverPoint, SHOW_COMPACT } from './_relationship-editing-helpers.mjs';

/**
 * Relationship Editing > Reading a Connector: three connectors that read
 * differently (a solid identifying One N, a dashed Zero N, and a nullable
 * foreign key with a ring at its parent end) hovered one at a time, each
 * lighting up with the columns it links in both tables.
 */
export default {
  name: 'demo-relationship-hover',
  width: 900,
  height: 560,
  async setup(d) {
    // A review stays when the member who wrote it is gone.
    const sql = readSeed('shop.sql').replace(
      'member_id BIGINT NOT NULL,\n  rating',
      'member_id BIGINT NULL,\n  rating'
    );
    await seedSQL(d, sql, {
      only: ['members', 'orders', 'reviews', 'order_items'],
      tables: {
        // Gaps wide enough that a dashed route shows its dashes between the
        // solid end marks, and each child on its parent's centre line.
        members: { x: 34, y: 30 },
        orders: { x: 454, y: 30 },
        reviews: { x: 48, y: 322 },
        order_items: { x: 452, y: 300 },
      },
      settings: { databaseName: 'shop', show: SHOW_COMPACT },
      patch(doc, byName) {
        for (const id of doc.doc.relationshipIds) {
          const r = doc.collections.relationshipEntities[id];
          if (r.start.tableId === byName.get('orders') && r.end.tableId === byName.get('order_items')) {
            r.relationshipType = 16; // One N: an order has at least one line
          }
        }
      },
    });
    await d.moveTo(364, 300, 50);
  },
  async scenario(d) {
    await d.sleep(600);
    const lines = await hoverPoint(d, 'orders', 'order_items', 0.35);
    await d.moveTo(lines.x, lines.y, 700);
    await d.sleep(1300);
    await d.shot('orders-order_items');

    const orders = await hoverPoint(d, 'members', 'orders', 0.5);
    await curveTo(d, { x: 394, y: 250 }, orders, 900);
    await d.sleep(1300);
    await d.shot('members-orders');

    const reviews = await hoverPoint(d, 'members', 'reviews', 0.5);
    await curveTo(d, { x: 344, y: 280 }, reviews, 900);
    await d.sleep(1300);
    await d.shot('members-reviews');

    await curveTo(d, { x: 314, y: 300 }, { x: 364, y: 300 }, 700);
    await d.sleep(1300);
  },
};
