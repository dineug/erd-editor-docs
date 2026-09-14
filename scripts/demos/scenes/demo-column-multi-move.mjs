/**
 * Rearranging and Moving Columns: select several columns, then ⌘ + drag them
 * into another table together.
 */
import { seedSQL } from '../lib/seed.mjs';
import { columnNames, keysAt, nameCell } from './_table-editing-b-helpers.mjs';

const SQL = `
CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ordered_at DATETIME NOT NULL,
  method VARCHAR(20) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  paid_at DATETIME NULL,
  PRIMARY KEY (id)
) COMMENT 'Customer orders';

CREATE TABLE payments (
  id BIGINT NOT NULL AUTO_INCREMENT,
  order_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Payment records';

ALTER TABLE payments ADD CONSTRAINT FK_orders_TO_payments FOREIGN KEY (order_id) REFERENCES orders (id);
`;

export default {
  name: 'demo-column-multi-move',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        orders: { x: 40, y: 40 },
        payments: { x: 540, y: 200 },
      },
      settings: { databaseName: 'shop' },
    });
    // Keycaps a little left of centre, clear of the grown payments table.
    await keysAt(d, 420);
    await d.moveTo(560, 160, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // The three payment columns do not belong in orders: select them.
    const method = await nameCell(d, 'orders', 'method');
    const paidAt = await nameCell(d, 'orders', 'paid_at');
    await d.click(method.x, method.y, { duration: 800 });
    await d.sleep(500);
    await d.holding(
      ['Shift'],
      async () => {
        await d.click(paidAt.x, paidAt.y, { duration: 500 });
        await d.sleep(450);
      },
      { label: ['⇧', 'click'] }
    );
    await d.sleep(600);

    // ⌘ + drag carries the whole selection into payments. The pointer enters
    // payments on its created_at row, so the columns land once, right above it.
    // It stops on the row's empty key-icon gutter, so no name sits under it.
    const amount = await nameCell(d, 'orders', 'amount');
    const payments = await d.tableBox('payments');
    const createdAt = await d.columnBox('payments', 'created_at');
    const entryY = createdAt.y + createdAt.height / 2;
    const dropX = payments.x + 12;
    const dropY =
      amount.y +
      ((entryY - amount.y) * (dropX - amount.x)) / (payments.x - amount.x);
    await d.moveTo(amount.x, amount.y, 450);
    await d.sleep(200);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(250);
        await d.page.mouse.down();
        await d.sleep(180);
        await d.moveTo(dropX, dropY, 1300);
        await d.shot('dropped');
        await d.sleep(350);
        await d.page.mouse.up();
        await d.sleep(120);
      },
      { label: ['⌘', 'drag'] }
    );
    await d.sleep(150);
    // Off down-left into bare canvas: out of payments at once, and below the
    // relationship's crow's foot so nothing lights up on the way.
    await d.moveTo(400, 410, 650);
    await d.shot('parked');

    const orders = await columnNames(d, 'orders');
    const moved = await columnNames(d, 'payments');
    if (orders.join() !== 'id,member_id,status,ordered_at') {
      throw new Error(`orders ended as ${orders}`);
    }
    if (moved.join() !== 'id,order_id,method,amount,paid_at,created_at') {
      throw new Error(`payments ended as ${moved}`);
    }
    await d.sleep(1400);
  },
};
