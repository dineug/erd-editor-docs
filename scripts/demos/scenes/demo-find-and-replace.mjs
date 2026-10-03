import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { SHOW_COMPACT } from './_relationship-editing-helpers.mjs';
import { glide } from './_table-related-b-helpers.mjs';
import { timer, waitDom } from './_vsc-helpers.mjs';

/**
 * Find and Replace: ⌘ + F opens the panel, `member` finds the members table
 * and the three member_id columns, Enter and the Next button go to each match
 * in turn (the canvas scrolls each one clear of the panel and selects it, and
 * the last brings back the starting view), then `user` in the Replace field
 * and Replace All (⌘ + Enter) rename all four in one edit, and Esc closes the
 * panel on the renamed diagram.
 */
export default {
  name: 'demo-find-and-replace',
  width: 960,
  height: 540,
  async setup(d) {
    // At 80% with the compact view, every jump lands its match beside a whole
    // neighbour, clear of the minimap and the canvas toolbar. reviews sits
    // where its member_id lands, so the fourth jump comes back to this view.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'addresses', 'orders', 'reviews'],
      tables: {
        members: { x: 85, y: 44 },
        orders: { x: 172, y: 268 },
        reviews: { x: 740, y: 230 },
        addresses: { x: 866, y: 445 },
      },
      settings: {
        databaseName: 'shop',
        show: SHOW_COMPACT,
        zoomLevel: 0.8,
      },
    });
    // Right of reviews, under the minimap: empty in every view the jumps
    // pass through, and level with the way into the panel.
    await d.moveTo(905, 212, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(600);

    await d.press('ControlOrMeta+KeyF');
    await waitDom(d, '.find-replace');
    mark('open');
    await d.sleep(500);
    await d.type('member', 120);
    await d.sleep(900);
    await d.shot('typed');

    // Enter in the Find field: members (scrolled out from under the panel),
    // then addresses.member_id.
    mark('enter');
    await d.press('Enter', { hold: 700 });
    await d.sleep(1000);
    await d.shot('match-1');
    await d.press('Enter', { hold: 700 });
    await d.sleep(900);
    await d.shot('match-2');

    // The Next button for the other two: left between reviews and addresses,
    // into the empty strip right of the Memos toggle, and down onto it.
    mark('next');
    const next = center(await d.domBox('.find-next'));
    const strip = (await d.domBox('.find-scope[data-field="memo"]')).y + 11;
    await glide(d, [{ x: 430, y: strip - 4 }, { x: next.x, y: strip }, next], 950);
    await d.sleep(150);
    await d.click(next.x, next.y, { duration: 1 });
    await d.sleep(1100);
    await d.shot('match-3');
    await d.click(next.x, next.y, { duration: 1 });
    await d.sleep(1100);
    await d.shot('match-4');

    // Up beside the Previous/Next buttons, left along the gap under the
    // Replace row, and up into the field at its right end: once the panel
    // closes, that spot is empty canvas beside members.
    mark('replace');
    const field = await d.domBox('.replace-input');
    const gap = field.y + field.height + 4;
    const into = { x: field.x + field.width - 8, y: field.y + field.height / 2 - 2 };
    await glide(d, [{ x: next.x, y: gap }, { x: into.x, y: gap }, into], 600);
    await d.click(into.x, into.y, { duration: 1 });
    await d.sleep(300);
    await d.type('user', 120);
    await d.sleep(500);

    // Replace All from the Replace field, which keeps the caret there for Esc.
    await d.press('ControlOrMeta+Enter');
    mark('replaced');
    await d.sleep(1000);
    await d.shot('replaced');

    // Off the field before closing, where the pointer would sit on the users
    // connector: along the gap, down past the scope toggles on their right, to
    // a spot that is empty canvas once the panel is gone.
    const park = { x: next.x - 10, y: strip + 2 };
    await glide(d, [{ x: into.x, y: gap }, { x: park.x, y: gap }, park], 500);
    await d.sleep(350);

    await d.press('Escape', { hold: 700 });
    mark('closed');
    await d.sleep(1600);
    await d.shot('closed');
  },
};
