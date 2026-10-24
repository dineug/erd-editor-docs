/**
 * Rearranging and Moving Columns: select several columns, then drag the
 * handle beside the focused one into another table; the whole selection
 * goes with it.
 */
import { center } from '../lib/recorder.mjs';
import { seedSQL } from '../lib/seed.mjs';
import { columnNames, keysAt } from './_table-editing-b-helpers.mjs';

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
  updated_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Payment records';

ALTER TABLE payments ADD CONSTRAINT FK_orders_TO_payments FOREIGN KEY (order_id) REFERENCES orders (id);
`;

/**
 * A point a little into a column's name cell. The row's own box takes in the
 * drag handle while the row is focused, so the name cell is measured instead.
 */
async function nameCell(d, table, column, dx = 14) {
  const id = await d.columnId(table, column);
  const box = await d.page.evaluate(id => {
    const stage = window.__erdStages.canvas;
    const cell = stage.findOne(`#column-${id}`)?.findOne('.columnName');
    if (!cell) return null;
    const r = cell.getClientRect();
    const c = stage.container().getBoundingClientRect();
    return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
  }, id);
  if (!box) throw new Error(`no name cell for ${table}.${column}`);
  return { x: box.x + dx, y: box.y + box.height / 2 };
}

export default {
  name: 'demo-column-multi-move',
  width: 960,
  height: 540,
  async setup(d) {
    // payments stands so that its created_at row, a little below its top,
    // is level with orders' paid_at row: the drag runs straight across. Both
    // stand low enough that payments' header clears the minimap.
    await seedSQL(d, SQL, {
      tables: {
        orders: { x: 40, y: 80 },
        payments: { x: 540, y: 180 },
      },
      settings: { databaseName: 'shop' },
    });
    // Keycaps a little left of centre, clear of the grown payments table.
    await keysAt(d, 420);
    // Above the relationship, so the way to orders crosses none of it.
    await d.moveTo(600, 130, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // The three payment columns do not belong in orders: select them. The
    // row clicked last, paid_at, keeps the focus and with it the handle.
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
    await d.sleep(700);
    await d.shot('selected');

    // The handle carries the whole selection into payments, no key held. The
    // pointer runs straight across and reaches payments on its created_at
    // row, where the handle's 24 px lane left of the card starts, so the
    // columns land once, right above it. The relationship ends halfway down
    // payments' left side, and the grown table takes that end down below
    // the pointer's line, so nothing lights up under the drop. The pointer
    // stops on the row's empty key-icon gutter, so no name sits under it.
    const grip = await d.nodeBox('.column-drag-handle');
    if (!grip) throw new Error('no drag handle beside paid_at');
    const from = center(grip);
    const payments = await d.tableBox('payments');
    const createdAt = await d.columnBox('payments', 'created_at');
    if (from.y < createdAt.y + 5 || from.y > createdAt.y + 12) {
      throw new Error(`the drag line misses created_at's top: ${from.y}`);
    }
    const drop = { x: payments.x + 12, y: from.y };
    await d.moveTo(from.x, from.y, 500);
    await d.sleep(300);
    await d.page.mouse.down();
    await d.sleep(180);
    await d.moveTo(drop.x, drop.y, 1300);
    await d.shot('dropped');
    await d.sleep(350);
    await d.page.mouse.up();
    await d.sleep(150);
    // Straight down the key-icon gutter and out under payments: the left side
    // carries the relationship's end, the colour edge and paid_at's handle,
    // which would each light up on the way out.
    await d.moveTo(560, 450, 600);
    await d.shot('parked');

    const orders = await columnNames(d, 'orders');
    const moved = await columnNames(d, 'payments');
    if (orders.join() !== 'id,member_id,status,ordered_at') {
      throw new Error(`orders ended as ${orders}`);
    }
    if (
      moved.join() !== 'id,order_id,method,amount,paid_at,created_at,updated_at'
    ) {
      throw new Error(`payments ended as ${moved}`);
    }
    await d.sleep(1400);
  },
};
