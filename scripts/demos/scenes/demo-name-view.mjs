/**
 * Name View: the canvas toolbar's Name View list switches the tables to their
 * logical names, the canvas menu's Name View submenu to both names, and the
 * list back to the physical names. One column has no logical name, so it
 * shows its name dimmed in the logical view and the `logical` placeholder in
 * the view of both.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { hoverMenuPath } from './_io-settings-helpers.mjs';
import { glide, timeline } from './_misc-helpers.mjs';
import { waitDom, waitMenuItem } from './_vsc-helpers.mjs';

/** Logical names by table, then by column; ordered_at is left without one. */
const LOGICAL = {
  members: {
    '': 'Member',
    id: 'Member ID',
    email: 'Login Email',
    nickname: 'Display Name',
    created_at: 'Joined At',
  },
  orders: {
    '': 'Order',
    id: 'Order ID',
    member_id: 'Ordering Member',
    status: 'Order Status',
  },
};

export default {
  name: 'demo-name-view',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      // One above the other on the left, so the canvas menu and its Name View
      // submenu open over bare canvas on the right, clear of the tables even
      // at their widest, in the view of both.
      tables: {
        members: { x: 140, y: 70 },
        orders: { x: 140, y: 300 },
      },
      // Types, keys and Not Null: no comments, so the names carry the rows.
      settings: { databaseName: 'shop', show: 4 | 32 | 128 | 256 },
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        for (const [table, names] of Object.entries(LOGICAL)) {
          const entity = tableEntities[byName.get(table)];
          entity.logicalName = names[''];
          for (const id of entity.columnIds) {
            const column = tableColumnEntities[id];
            if (names[column.name]) column.logicalName = names[column.name];
          }
        }
      },
    });
    await d.moveTo(640, 140, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(500);
    await d.shot('physical');

    // The bar's Name View list, then Logical Names.
    mark('bar');
    await pickFromBar(d, 'Logical Names');
    await d.sleep(1100);
    await d.shot('logical');

    // The canvas menu's Name View submenu, then Both Names.
    mark('menu');
    await d.rightClick(540, 46, { duration: 700 });
    await d.sleep(400);
    const nameView = center(await hoverMenuPath(d, ['Name View'], { pause: 300 }));
    // Into the submenu's left padding and down it, so Physical Names, level
    // with Name View, does not light up on the way to Both Names.
    const lane = (await waitDom(d, '.context-menu-content', { index: 1 })).x + 4;
    const both = center(await waitMenuItem(d, 'Both Names'));
    await glide(d, [{ x: lane, y: nameView.y }, { x: lane, y: both.y }, both], 650);
    await d.sleep(150);
    await d.click(both.x, both.y, { duration: 0 });
    await d.sleep(1000);
    await d.shot('both');
    // The menus stay open after a pick; a click on bare canvas below the
    // submenu closes them. (An Escape keycap would stand over orders.)
    await d.click(both.x, both.y + 100, { duration: 400 });
    await d.sleep(800);
    await d.shot('both-closed');

    // The bar's list again, back to Physical Names.
    mark('physical');
    await pickFromBar(d, 'Physical Names');
    await d.sleep(300);
    await d.moveTo(700, 300, 500);
    await d.sleep(1000);
    await d.shot('physical-again');
  },
};

/**
 * Opens the canvas toolbar's Name View list, coming down onto the trigger
 * from above so no other button lights up, and picks one of its rows.
 */
async function pickFromBar(d, label) {
  const trigger = center(await waitDom(d, '.floating-toolbar .name-view-trigger'));
  await glide(d, [{ x: trigger.x, y: trigger.y - 60 }, trigger], 700);
  await d.click(trigger.x, trigger.y, { duration: 0 });
  await d.sleep(500);
  await d.shot(`bar-menu-${label}`);
  const row = center(await waitMenuItem(d, label, { scope: '.name-view-menu' }));
  await d.moveTo(row.x, row.y, 350);
  await d.sleep(200);
  await d.click(row.x, row.y, { duration: 0 });
}
