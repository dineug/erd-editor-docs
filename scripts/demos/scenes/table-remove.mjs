/**
 * Table and Memo Deletion: select a table and press ⌘+Backspace, and it goes
 * with its relationships; then a table and a memo selected together go at once.
 */
import { curveTo, grip, memo, memoBox, seedShop } from './_table-related-a-helpers.mjs';

export default {
  name: 'demo-table-remove',
  width: 800,
  height: 500,
  async setup(d) {
    await seedShop(d, {
      tables: {
        members: { x: 16, y: 10 },
        // Far enough below members, and beside payments, that both of its
        // relationships draw with their ends clearly apart.
        orders: { x: 16, y: 250 },
        payments: { x: 500, y: 200 },
      },
      memos: [
        memo('memo-refunds', 'Refunds are recorded as negative payments.', {
          x: 300,
          y: 50,
          width: 190,
          height: 80,
        }),
      ],
      settings: { show: 421 },
    });
    await d.moveTo(400, 250, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    // One table: orders goes, and both of its relationships with it.
    const orders = grip(await d.tableBox('orders'));
    await d.click(orders.x, orders.y, { duration: 700 });
    await d.sleep(500);
    await d.moveTo(400, 250, 600);
    await d.shot('orders-selected');
    await d.press('ControlOrMeta+Backspace');
    await d.sleep(1000);
    await d.shot('orders-removed');

    // A table and a memo selected together.
    const payments = grip(await d.tableBox('payments'));
    await d.click(payments.x, payments.y, { duration: 650 });
    await d.sleep(300);
    const note = await memoBox(d, 'memo-refunds');
    const noteGrip = { x: note.x + 50, y: note.y + 12 };
    // Up and over the top of the memo, then down onto its left end, so
    // neither its text nor its remove icon is hovered on the way.
    const above = note.y - 30;
    await curveTo(d, { x: payments.x, y: above }, { x: noteGrip.x + 100, y: above }, 550);
    await curveTo(d, { x: noteGrip.x, y: above }, noteGrip, 400);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(200);
        await d.click(noteGrip.x, noteGrip.y, { duration: 0 });
        await d.sleep(350);
      },
      { label: ['⌘', 'click'] }
    );
    await d.shot('both-selected');
    await d.sleep(250);
    await d.press('ControlOrMeta+Backspace');
    await d.sleep(1300);
    await d.shot('removed');
  },
};
