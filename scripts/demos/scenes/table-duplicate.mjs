/**
 * Duplicating Tables and Memos: ⌥+drag a table, a translucent preview follows
 * the pointer and the copy drops where it is released; ⌥+click without moving
 * drops another copy 50px down and to the right.
 */
import { curveTo, easeOut, grip, seedShop } from './_table-related-a-helpers.mjs';

export default {
  name: 'demo-table-duplicate',
  width: 880,
  height: 520,
  async setup(d) {
    await seedShop(d, {
      tables: {
        members: { x: 30, y: 16 },
        // Far enough below members that the relationship's two ends read apart.
        orders: { x: 30, y: 266 },
      },
      settings: { show: 421 },
    });
    await d.moveTo(430, 300, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    const from = grip(await d.tableBox('orders'));
    const to = { x: from.x + 330, y: from.y - 120 };

    await d.moveTo(from.x, from.y, 700);
    await d.holding(
      ['Alt'],
      async () => {
        await d.sleep(250);
        await d.page.mouse.down();
        await d.sleep(200);
        // Out to the right first, clear of the relationship and members; it
        // leaves at speed so the preview comes off the original quickly.
        await curveTo(d, { x: from.x + 240, y: from.y }, to, 1300, easeOut);
        await d.sleep(350);
        await d.page.mouse.up();
        await d.shot('dropped');
      },
      { label: ['⌥', 'drag'] }
    );
    await d.sleep(900);

    // ⌥+click without moving: another copy, 50px down and right.
    await d.holding(
      ['Alt'],
      async () => {
        await d.sleep(250);
        await d.click(to.x, to.y, { duration: 0 });
        await d.sleep(450);
      },
      { label: ['⌥', 'click'] }
    );
    await d.shot('alt-click');
    await d.moveTo(600, 90, 600);
    await d.sleep(1300);
  },
};
