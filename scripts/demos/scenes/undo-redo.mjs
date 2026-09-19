import { readSeed, seedSQL } from '../lib/seed.mjs';

/** Undo, Redo: two edits, stepped back with ⌘Z and forward again with ⌘⇧Z. */
export default {
  name: 'demo-undo-redo',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      // orders sits to the right of members the whole time, so the drag below
      // only bends the connector and never flips it to other sides.
      tables: {
        members: { x: 40, y: 20 },
        orders: { x: 540, y: 190 },
      },
      // Column comments off so the two tables fit side by side.
      settings: { databaseName: 'shop', show: 1 | 4 | 8 | 32 | 128 | 256 },
    });
    // Parked right of members, above the connector: the reach for its header
    // crosses no rows and passes above the header's add and remove buttons.
    await d.moveTo(610, 36, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    // Edit 1: move members down, level with orders.
    // The reach runs just above the table, clear of the header's buttons.
    const members = await d.tableBox('members');
    const grab = { x: members.x + 300, y: members.y + 10 };
    await d.moveTo(grab.x + 6, members.y - 12, 600);
    await d.moveTo(grab.x, grab.y, 220);
    await d.sleep(80);
    await d.page.mouse.down();
    await d.sleep(120);
    await d.moveTo(grab.x + 10, grab.y + 194, 800);
    await d.sleep(90);
    await d.page.mouse.up();
    await d.sleep(500);
    await d.shot('moved');

    // Edit 2: remove members.created_at.
    const column = await d.columnBox('members', 'created_at');
    await d.click(column.x + 40, column.y + column.height / 2, { duration: 500 });
    await d.sleep(300);
    await d.press('Alt+Backspace');
    await d.sleep(700);
    await d.shot('removed');
    await d.moveTo(720, 470, 450);

    await d.press('ControlOrMeta+KeyZ');
    await d.sleep(800);
    await d.shot('undo-1');
    await d.press('ControlOrMeta+KeyZ');
    await d.sleep(900);
    await d.shot('undo-2');
    await d.press('ControlOrMeta+Shift+KeyZ');
    await d.sleep(800);
    await d.shot('redo-1');
    await d.press('ControlOrMeta+Shift+KeyZ');
    await d.sleep(1300);
    await d.shot('redo-2');
  },
};
