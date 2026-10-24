import { seedSQL } from '../lib/seed.mjs';

// order_items from shop.sql, without its composite key: the clip sets it.
const SQL = `
CREATE TABLE order_items (
  order_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL
) COMMENT 'Order lines';
`;

/** Where the pointer rests between gestures, off the table. */
const PARK = { x: 600, y: 290 };

const PRIMARY_KEY = 2; // ColumnOption.primaryKey

/**
 * Column Primary Key: Alt+K reaches every selected column. Select order_id
 * and product_id, one press makes both the key, the next clears both.
 */
export default {
  name: 'demo-column-pk',
  width: 800,
  height: 420,
  async setup(d) {
    // x 36 leaves room for the drag handle beside the focused row.
    await seedSQL(d, SQL, {
      tables: { order_items: { x: 36, y: 14 } },
      settings: { databaseName: 'shop', zoomLevel: 1.4 },
    });
    await d.moveTo(PARK.x, PARK.y, 50);
  },
  async scenario(d) {
    /** The table's columns that are a primary key, in order. */
    const keys = async () => {
      const doc = await d.value();
      const table = Object.values(doc.collections.tableEntities)[0];
      return table.columnIds
        .map(id => doc.collections.tableColumnEntities[id])
        .filter(column => column.options & PRIMARY_KEY)
        .map(column => column.name)
        .join();
    };

    await d.sleep(500);
    // Focus order_id, then leave the table so no row is hovered.
    const orderId = await d.columnBox('order_items', 'order_id');
    await d.click(orderId.x + 80, orderId.y + orderId.height / 2, { duration: 520 });
    await d.sleep(200);
    await d.moveTo(PARK.x, PARK.y, 420);
    await d.sleep(150);

    // Shift + ↓ adds product_id to the selection.
    await d.press('Shift+ArrowDown');
    await d.sleep(800);
    await d.shot('selected');

    // One Alt+K makes both of them the key...
    await d.press('Alt+KeyK');
    await d.sleep(1300);
    await d.shot('keys-on');
    if ((await keys()) !== 'order_id,product_id') {
      throw new Error(`keys after the first press: ${await keys()}`);
    }

    // ...and the next clears both, since both already are.
    await d.press('Alt+KeyK');
    await d.sleep(400);
    if ((await keys()) !== '') {
      throw new Error(`keys after the second press: ${await keys()}`);
    }
    await d.sleep(1400);
  },
};
