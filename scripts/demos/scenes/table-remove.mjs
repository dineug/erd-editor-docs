/**
 * Table and Memo Deletion: select a table and press Delete, and it goes with
 * its relationships; then a table and a memo selected together go at once
 * through the memo menu's Delete selected, which names the same key.
 *
 * Delete and Backspace remove the selection while the keyboard is in the
 * editor and no text field, cell editor or panel holds it. With a column
 * selected in the one focused table they remove that column instead, so the
 * tables here are picked by their header, which focuses no column.
 */
import { curveTo, grip, memo, memoBox, seedShop } from './_table-related-a-helpers.mjs';

/** Viewport boxes of the open context menu row labelled `text` and of its label. */
function menuRowBox(d, text) {
  return d.page.evaluate(text => {
    const root = window.__erdShadowRoot;
    const label = [...root.querySelectorAll('.context-menu-content [data-id] div')].find(
      el => !el.children.length && el.textContent.trim() === text
    );
    const row = label?.closest('[data-id]');
    if (!row) return null;
    const box = el => {
      const r = el.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    };
    return { ...box(row), label: box(label) };
  }, text);
}

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
    await d.sleep(400);
    await d.moveTo(400, 250, 550);
    await d.shot('orders-selected');
    await d.press('Delete');
    await d.sleep(1000);
    await d.shot('orders-removed');

    // A table and a memo selected together. payments is reached in an arc
    // over its top edge into its header, since its left edge is a colour
    // strip that takes a hand (a straight glide from the rest point put one
    // pointer event on it); at 1200 it sends about as many pointer events as
    // the straight 650 did, so it takes about as long.
    const paymentsBox = await d.tableBox('payments');
    const payments = grip(paymentsBox);
    await curveTo(d, { x: paymentsBox.x - 20, y: paymentsBox.y - 35 }, payments, 1200);
    await d.click(payments.x, payments.y, { duration: 0 });
    await d.sleep(300);
    const note = await memoBox(d, 'memo-refunds');
    const noteGrip = { x: note.x + 50, y: note.y + 16 };
    // Up and over the top of the memo, then down into its header band and
    // along it to the grip, so neither its text nor its
    // remove icon is hovered on the way. The band sits under a 4 px colour
    // strip that takes a hand; this curve sends its pointer events at the
    // same points on every run, and they cross the strip between y 77 and 86,
    // two rows clear of it on each side. Change a number here and check the
    // frames again.
    const above = note.y - 30;
    await curveTo(d, { x: payments.x, y: above }, { x: noteGrip.x + 100, y: above }, 550);
    await curveTo(d, { x: noteGrip.x + 30, y: note.y + 8 }, noteGrip, 400);
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
    await d.sleep(300);

    // A right press inside the selection keeps it, so the memo's menu ends
    // with Delete selected. Along the memo's header band from the grip, and
    // pressed in it between the end of the text (152 px in) and the remove
    // icon (188 px in): the band is clear of the text clip below it, which
    // takes an I-beam that would stay on screen until the pointer moves onto
    // the menu, and of the colour strip above it, which takes a hand. The menu
    // opens at the pointer, so from here it leaves the memo's text in view.
    // Whole pixels, so the menu's corner is right under the pointer.
    const press = { x: Math.round(note.x + 162), y: Math.round(note.y + 14) };
    await d.moveTo(press.x, press.y, 400);
    await d.sleep(150);
    await d.rightClick(press.x, press.y, { duration: 0 });
    await d.sleep(650);
    await d.shot('menu');
    const row = await menuRowBox(d, 'Delete selected');
    if (!row) throw new Error('no Delete selected row in the memo menu');
    // Down the menu's left padding, left of every row, so only Delete selected
    // lights up, then along its lower half to the gap between the label and
    // its Delete key, so the pointer and the click ripple leave both clear.
    const hit = { x: row.label.x + row.label.width + 12, y: row.y + row.height / 2 + 5 };
    await d.moveTo(row.x - 4, hit.y, 350);
    await d.moveTo(hit.x, hit.y, 400);
    await d.shot('hover-delete');
    await d.sleep(450);
    await d.click(hit.x, hit.y, { duration: 0 });
    await d.sleep(150);
    await d.moveTo(420, 300, 600);
    await d.shot('removed');
    await d.sleep(1300);
  },
};
