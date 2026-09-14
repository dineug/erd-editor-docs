/** Column Deletion: ⌥ + ⌫ removes the selected column, or every selected column. */
import { seedSQL } from '../lib/seed.mjs';
import { columnNames, nameCell } from './_table-editing-b-helpers.mjs';

const SQL = `
CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  coupon_code VARCHAR(20) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  gift_message VARCHAR(255) NULL,
  gift_wrap BOOLEAN NOT NULL DEFAULT FALSE,
  ordered_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Customer orders';
`;

export default {
  name: 'demo-column-remove',
  width: 800,
  height: 450,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { orders: { x: 150, y: 50 } },
      settings: { databaseName: 'shop' },
    });
    await d.moveTo(640, 300, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // One column.
    const coupon = await nameCell(d, 'orders', 'coupon_code');
    await d.click(coupon.x, coupon.y, { duration: 800 });
    await d.sleep(550);
    await d.press('Alt+Backspace');
    await d.sleep(1000);

    // Several columns at once.
    const message = await nameCell(d, 'orders', 'gift_message');
    const wrap = await nameCell(d, 'orders', 'gift_wrap');
    await d.click(message.x, message.y, { duration: 650 });
    await d.sleep(450);
    await d.holding(
      ['Shift'],
      async () => {
        await d.click(wrap.x, wrap.y, { duration: 450 });
        await d.sleep(450);
      },
      { label: ['⇧', 'click'] }
    );
    await d.sleep(500);
    await d.press('Alt+Backspace');
    await d.sleep(500);
    await d.moveTo(640, 300, 700);

    const orders = await columnNames(d, 'orders');
    if (orders.join() !== 'id,member_id,status,ordered_at') {
      throw new Error(`orders ended as ${orders}`);
    }
    await d.shot('result');
    await d.sleep(1300);
  },
};
