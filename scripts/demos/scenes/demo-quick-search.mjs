/**
 * Quick Search: ⌘ + K opens the palette on the command list with the prefix
 * hints under the input; `#pay` jumps to the payments table, `@price` lists
 * the columns holding price and jumps to products.price, and `:address`
 * finds a table comment and a column comment and jumps to the first.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { timer, waitDom } from './_vsc-helpers.mjs';

/**
 * Waits for the palette to list `count` rows. The list is virtual: it draws
 * only the rows in view, each a .quick-search-row, which a list this short
 * holds all of.
 */
async function waitRows(d, count) {
  const until = Date.now() + 4000;
  for (;;) {
    const rows = await d.page.evaluate(
      () => window.__erdShadowRoot.querySelectorAll('.quick-search .quick-search-row').length
    );
    if (rows === count) return;
    if (Date.now() > until) throw new Error(`waitRows: ${rows} rows, wanted ${count}`);
    await d.sleep(30);
  }
}

/** Waits for the palette to close. */
async function waitClosed(d) {
  const until = Date.now() + 4000;
  while (await d.domBox('.quick-search')) {
    if (Date.now() > until) throw new Error('the palette never closed');
    await d.sleep(30);
  }
}

export default {
  name: 'demo-quick-search',
  width: 960,
  // Tall enough for the whole palette: its list stands at most 400px, which
  // ends the command list at about 541px.
  height: 560,
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
    // empty before and after every jump.
    await d.page.mouse.move(936, 542);
    await d.moveTo(936, 542, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(600);

    // The command list, with the prefixes hinted under the input.
    await d.press('ControlOrMeta+KeyK');
    await waitDom(d, '.quick-search-hint');
    mark('open');
    await d.sleep(1500);
    await d.shot('open');

    // # narrows to tables.
    await d.type('#', 1);
    await d.sleep(800);
    await d.shot('tables');
    await d.type('pay', 140);
    await waitRows(d, 1);
    await d.sleep(700);
    await d.shot('typed-pay');
    await d.press('ArrowDown', { hold: 600 });
    await d.sleep(400);
    await d.press('Enter', { hold: 600 });
    await waitClosed(d);
    mark('table');
    await d.sleep(1300);
    await d.shot('jumped-table');

    // @ narrows to column names, found anywhere in them.
    await d.press('ControlOrMeta+KeyK');
    await waitDom(d, '.quick-search');
    await d.sleep(450);
    await d.type('@price', 120);
    await waitRows(d, 2);
    await d.sleep(900);
    await d.shot('typed-price');
    await d.press('ArrowDown', { hold: 600 });
    await d.sleep(400);
    await d.press('Enter', { hold: 600 });
    await waitClosed(d);
    mark('column');
    await d.sleep(1300);
    await d.shot('jumped-column');

    // : narrows to table comments, column comments and memos.
    await d.press('ControlOrMeta+KeyK');
    await waitDom(d, '.quick-search');
    await d.sleep(450);
    await d.type(':address', 110);
    await waitRows(d, 2);
    await d.sleep(1000);
    await d.shot('typed-address');
    await d.press('ArrowDown', { hold: 600 });
    await d.sleep(400);
    await d.press('Enter', { hold: 600 });
    await waitClosed(d);
    mark('comment');
    await d.sleep(1500);
    await d.shot('jumped-comment');
  },
};
