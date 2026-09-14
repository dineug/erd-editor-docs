/**
 * Quick Search: ⌘ + K opens the palette, typing part of a table name and
 * running the entry jumps to that table and selects it; then the Import
 * submenu, where `sdl` finds GraphQL by its keywords, and Esc closes it.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { timer, waitDom } from './_vsc-helpers.mjs';

export default {
  name: 'demo-quick-search',
  width: 960,
  height: 540,
  async setup(d) {
    // Four tables on screen; payments and the rest sit off to the right.
    await seedSQL(d, readSeed('shop.sql'), {
      tables: {
        members: { x: 60, y: 60 },
        reviews: { x: 60, y: 290 },
        categories: { x: 620, y: 60 },
        products: { x: 620, y: 250 },
        payments: { x: 1600, y: 100 },
        addresses: { x: 1600, y: 330 },
        orders: { x: 2100, y: 100 },
        order_items: { x: 2100, y: 330 },
      },
      settings: { databaseName: 'shop' },
    });
    // The palette is all keyboard: the pointer waits in a corner that stays
    // empty before and after the jump.
    await d.page.mouse.move(936, 522);
    await d.moveTo(936, 522, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(600);

    await d.press('ControlOrMeta+KeyK');
    await waitDom(d, '.quick-search');
    mark('open');
    await d.sleep(700);
    await d.type('pay', 140);
    await d.sleep(600);
    await d.shot('typed-pay');
    await d.press('ArrowDown', { hold: 700 });
    await d.sleep(450);
    await d.press('Enter', { hold: 700 });
    mark('jump');
    await d.sleep(1400);
    await d.shot('jumped');

    await d.press('ControlOrMeta+KeyK');
    await waitDom(d, '.quick-search');
    await d.sleep(500);
    await d.type('imp', 130);
    await d.sleep(450);
    await d.press('ArrowDown', { hold: 700 });
    await d.sleep(350);
    await d.press('Enter', { hold: 700 });
    mark('import');
    await d.sleep(800);
    await d.shot('import');
    await d.type('sdl', 150);
    await d.sleep(1300);
    await d.shot('sdl');
    await d.press('Escape', { hold: 700 });
    mark('closed');
    await d.sleep(1300);
  },
};
