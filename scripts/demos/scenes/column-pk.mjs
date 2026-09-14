import { seedSQL } from '../lib/seed.mjs';

const SQL = `
CREATE TABLE reviews (
  id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  member_id BIGINT NOT NULL,
  rating TINYINT NOT NULL,
  body TEXT NULL
) COMMENT 'Product reviews';
`;

/** Where the pointer rests between gestures, off the table. */
const PARK = { x: 600, y: 290 };

/**
 * Column Primary Key: Alt+K toggles the key on the focused column — on for
 * one column, then for another, then off again for the first.
 */
export default {
  name: 'demo-column-pk',
  width: 800,
  height: 420,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { reviews: { x: 20, y: 14 } },
      settings: { databaseName: 'shop', zoomLevel: 1.4 },
    });
    await d.moveTo(PARK.x, PARK.y, 50);
  },
  async scenario(d) {
    /** Clicks a column's name cell, then moves the pointer off the table. */
    const focus = async column => {
      const box = await d.columnBox('reviews', column);
      await d.click(box.x + 80, box.y + box.height / 2, { duration: 420 });
      await d.sleep(200);
      await d.moveTo(PARK.x, PARK.y, 380);
    };
    const toggle = async label => {
      await d.press('Alt+KeyK');
      await d.sleep(850);
      await d.shot(label);
    };

    await d.sleep(500);
    // The key goes on product_id first...
    await focus('product_id');
    await toggle('product-on');
    // ...on id as well...
    await focus('id');
    await toggle('id-on');
    // ...and off again for product_id.
    await focus('product_id');
    await d.press('Alt+KeyK');
    await d.sleep(1400);
  },
};
