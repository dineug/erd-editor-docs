import { readSeed, seedSQL } from '../lib/seed.mjs';
import { timer } from './_table-related-b-helpers.mjs';

/**
 * Zoom In/Out: ⌘ + wheel zooms out past 70%, where tables collapse to their
 * color bar and name; ⌘ + Plus steps back over the line, ⌘ + Minus steps
 * under it again, and ⌘ + 0 returns to 100%.
 */
export default {
  name: 'demo-zoom',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'order_items', 'products'],
      // Four whole tables at 100%, clear of the minimap, the toolbar and the
      // keycaps, around an empty middle: every zoom below keeps the middle of
      // the canvas still, so the pointer can sit there without lighting a row.
      tables: {
        members: { x: 60, y: 30, color: '#3b82f6' },
        orders: { x: 380, y: 30, color: '#f59e0b' },
        order_items: { x: 700, y: 200, color: '#f59e0b' },
        products: { x: 60, y: 260, color: '#a855f7' },
      },
      settings: { databaseName: 'shop', show: 4 | 32 | 256 },
    });
    await d.moveTo(590, 310, 0);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);

    // ⌘ + wheel, with the pointer on the middle of the canvas so every step
    // below keeps the same point still.
    mark('wheel');
    await d.moveTo(480, 285, 450);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(200);
        await d.wheel(100, { steps: 12, gap: 110 });
        await d.sleep(200);
      },
      { label: ['⌘', 'scroll'] }
    );
    await d.sleep(250);
    // Back to where it started, a gap no table or connector reaches at any
    // zoom below.
    await d.moveTo(590, 310, 450);
    await d.sleep(550);

    // ⌘ + Plus twice: 72%, full tables again. The recorder labels Equal as
    // '+', which the overlay draws as a separator, so the caps are set here.
    mark('plus');
    for (let i = 0; i < 2; i++) {
      await d.keys(['⌘', '+\u200b']);
      await d.sleep(130);
      await d.page.keyboard.press('ControlOrMeta+Equal');
      await d.sleep(380);
    }
    await d.sleep(750);

    // ⌘ + Minus: 68%, collapsed again.
    mark('minus');
    await d.press('ControlOrMeta+Minus');
    await d.sleep(1100);

    // ⌘ + 0: back to 100%.
    mark('reset');
    await d.press('ControlOrMeta+Digit0');
    mark('hold');
    await d.sleep(1900);
  },
};
