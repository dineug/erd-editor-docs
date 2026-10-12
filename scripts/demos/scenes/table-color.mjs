/**
 * Table and Memo Color Specification: select two tables and a memo, click the
 * color strip on one of them to open the color picker, pick a preset, and
 * every selected entity takes it while the table left out of the selection
 * keeps its own; then No color takes the color off them again.
 */
import { center } from '../lib/recorder.mjs';
import { curveTo, grip, memo, memoBox, seedShop } from './_table-related-a-helpers.mjs';

const GREEN = '#4CAF50';
const ORANGE = '#FF9800';

/** Viewport box of the picker button whose trimmed text is `text`. */
function pickerButton(d, text) {
  return d.page.evaluate(text => {
    const el = [...(window.__erdShadowRoot?.querySelectorAll('.color-picker button') ?? [])].find(
      el => el.textContent.trim() === text
    );
    const r = el?.getBoundingClientRect();
    return r ? { x: r.left, y: r.top, width: r.width, height: r.height } : null;
  }, text);
}

export default {
  name: 'demo-table-color',
  width: 960,
  height: 520,
  async setup(d) {
    await seedShop(d, {
      // Every entity starts with a color, so the strip to click is visible
      // and the one left out of the selection visibly keeps its own.
      tables: {
        // The picker opens at the pointer, so the memo sits to the right,
        // where it opens over empty canvas, and categories below, clear of it.
        orders: { x: 40, y: 40, color: GREEN },
        payments: { x: 40, y: 270, color: GREEN },
        categories: { x: 330, y: 300, color: ORANGE },
      },
      memos: [
        memo('memo-billing', 'Billing tables share one color.', {
          x: 560,
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
    // Over the top of orders to the memo, under the toolbar and clear of
    // the memo's add/remove icons.
    await curveTo(d, { x: (orders.x + noteGrip.x) / 2, y: note.y - 8 }, noteGrip, 750);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(150);
        await d.click(noteGrip.x, noteGrip.y, { duration: 0 });
        await d.sleep(300);
        // Out of the memo's left end, then across the open middle of the
        // canvas, between orders and categories, to payments.
        await d.moveTo(note.x - 15, noteGrip.y + 2, 250);
        await curveTo(d, { x: note.x - 60, y: payments.y - 40 }, payments, 800);
        await d.click(payments.x, payments.y, { duration: 0 });
        await d.sleep(300);
      },
      { label: ['⌘', 'click'] }
    );
    await d.shot('selected');
    await d.sleep(250);

    // The strip along the top of the memo opens the picker at the pointer.
    // Near its right end, so the picker opens over empty canvas: round the
    // memo's right end and onto the strip from above.
    const strip = { x: note.x + note.width - 12, y: note.y + 2 };
    await curveTo(d, { x: note.x + note.width + 60, y: payments.y - 20 }, { x: note.x + note.width + 14, y: note.y + 20 }, 900);
    await curveTo(d, { x: note.x + note.width + 4, y: note.y - 10 }, strip, 350);
    await d.sleep(250);
    await d.shot('on-strip');
    await d.click(strip.x, strip.y, { duration: 0 });
    await d.sleep(250);
    // Off the panel's left edge, under the memo, so the area, the hue
    // slider, the fields and the swatches read before one is picked.
    const panel = await d.domBox('.color-picker [role="dialog"]');
    await d.moveTo(panel.x - 16, note.y + note.height + 40, 450);
    await d.sleep(800);
    await d.shot('picker');

    const blue = center(await d.domBox('.color-picker button[role="radio"][aria-label="Blue"]'));
    await curveTo(d, { x: panel.x - 14, y: blue.y }, blue, 650);
    await d.sleep(120);
    await d.click(blue.x, blue.y, { duration: 0 });
    await d.sleep(1100);
    await d.shot('picked');

    // No color, at the foot of the picker, takes the color off all three and
    // closes the picker.
    const clear = center(await pickerButton(d, 'No color'));
    await d.click(clear.x, clear.y, { duration: 550 });
    await d.sleep(500);
    // Off to empty canvas; a click there clears the selection.
    await d.click(note.x + 40, note.y + note.height + 120, { duration: 650 });
    await d.sleep(1300);
    await d.shot('done');
  },
};
