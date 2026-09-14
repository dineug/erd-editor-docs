/**
 * Table and Memo Color Specification: select two tables and a memo, click the
 * color strip on one of them, pick a color, and every selected entity takes it
 * while the table left out of the selection keeps its own.
 */
import { center } from '../lib/recorder.mjs';
import { curveTo, grip, memo, memoBox, seedShop } from './_table-related-a-helpers.mjs';

const GREEN = '#4CAF50';
const ORANGE = '#FF9800';

export default {
  name: 'demo-table-color',
  width: 960,
  height: 520,
  async setup(d) {
    await seedShop(d, {
      // Every entity starts with a color, so the strip to click is visible
      // and the one left out of the selection visibly keeps its own.
      tables: {
        orders: { x: 40, y: 40, color: GREEN },
        payments: { x: 40, y: 270, color: GREEN },
        categories: { x: 660, y: 290, color: ORANGE },
      },
      memos: [
        memo('memo-billing', 'Billing tables share one color.', {
          x: 360,
          y: 40,
          width: 200,
          height: 70,
          color: GREEN,
        }),
      ],
      settings: { show: 421 },
    });
    await d.moveTo(230, 46, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    const orders = grip(await d.tableBox('orders'));
    const payments = grip(await d.tableBox('payments'), 150);
    const note = await memoBox(d, 'memo-billing');
    const noteGrip = { x: note.x + 50, y: note.y + 12 };

    // orders, then ⌘+click the memo and payments.
    await d.click(orders.x, orders.y, { duration: 550 });
    await d.sleep(250);
    // Over the top of orders to the memo, clear of its add/remove icons.
    await curveTo(d, { x: (orders.x + noteGrip.x) / 2, y: note.y - 36 }, noteGrip, 650);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(150);
        await d.click(noteGrip.x, noteGrip.y, { duration: 0 });
        await d.sleep(300);
        // Out of the memo's left end, then down the gap between the tables.
        await d.moveTo(note.x - 15, noteGrip.y + 2, 250);
        await curveTo(d, { x: note.x - 30, y: payments.y - 12 }, payments, 700);
        await d.click(payments.x, payments.y, { duration: 0 });
        await d.sleep(300);
      },
      { label: ['⌘', 'click'] }
    );
    await d.shot('selected');
    await d.sleep(250);

    // The strip along the top of the memo opens the picker. Back up the gap
    // and onto the strip from above, near the middle of the memo.
    const strip = { x: note.x + 70, y: note.y + 2 };
    await curveTo(d, { x: note.x - 30, y: payments.y - 32 }, { x: note.x - 30, y: note.y + 80 }, 500);
    await curveTo(d, { x: note.x - 15, y: note.y - 30 }, strip, 550);
    await d.sleep(250);
    await d.shot('on-strip');
    await d.click(strip.x, strip.y, { duration: 0 });
    await d.sleep(700);
    await d.shot('picker');

    const swatch = center(await d.domBox('.color-picker .color-item[data-color="#2196F3"]'));
    await d.click(swatch.x, swatch.y, { duration: 700 });
    await d.sleep(1100);
    await d.shot('picked');

    // A click on empty canvas closes the picker and clears the selection.
    const categories = await d.tableBox('categories');
    await d.click(categories.x + 40, categories.y - 70, { duration: 600 });
    await d.sleep(1300);
    await d.shot('done');
  },
};
