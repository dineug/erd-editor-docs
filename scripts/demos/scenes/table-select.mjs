/**
 * Multiple Selection: ⌘+drag a selection box (it takes what it covers the
 * middle of, not what it only touches), ⌘+click to add, a click on empty
 * canvas to clear, ⌘+A for every table and memo, and a click to clear again.
 */
import { curveTo, grip, memo, seedShop } from './_table-related-a-helpers.mjs';

export default {
  name: 'demo-table-select',
  width: 880,
  height: 500,
  async setup(d) {
    await seedShop(d, {
      tables: {
        categories: { x: 40, y: 56 },
        orders: { x: 40, y: 226 },
        products: { x: 400, y: 56 },
      },
      memos: [
        memo('memo-stock', 'Stock is reserved when an order is placed.', {
          x: 660,
          y: 262,
          width: 180,
          height: 80,
        }),
      ],
      settings: { show: 421 },
    });
    await d.moveTo(90, 462, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    // A box over the middle of categories and orders; it only clips the
    // left edge of products, so products stays out. The pointer goes up the
    // empty left margin and then along the band above the tables, so it
    // hovers nothing on the way.
    await d.moveTo(20, 432, 500);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(200);
        await d.page.mouse.down();
        await d.sleep(150);
        await d.moveTo(20, 62, 750);
        await d.moveTo(440, 62, 850);
        await d.sleep(350);
        await d.page.mouse.up();
      },
      { label: ['⌘', 'drag'] }
    );
    await d.shot('after-drag');
    await d.sleep(500);

    // ⌘+click adds products.
    const products = grip(await d.tableBox('products'));
    await d.moveTo(products.x, products.y, 450);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(200);
        await d.click(products.x, products.y, { duration: 0 });
        await d.sleep(350);
      },
      { label: ['⌘', 'click'] }
    );
    await d.shot('after-cmd-click');
    await d.sleep(450);

    // Out of products along its header band, and a click on the empty
    // canvas above the gap clears the selection.
    const empty = { x: 349, y: 58 };
    await curveTo(d, { x: 356, y: products.y }, empty, 600);
    await d.click(empty.x, empty.y, { duration: 0 });
    await d.shot('cleared-1');
    await d.sleep(700);

    // ⌘+A takes every table and the memo.
    await d.press('ControlOrMeta+KeyA');
    await d.sleep(1000);
    await d.shot('after-select-all');

    // A click on empty canvas clears it again.
    await d.click(empty.x - 14, empty.y + 2, { duration: 350 });
    await d.shot('cleared-2');
    await d.sleep(1300);
  },
};
