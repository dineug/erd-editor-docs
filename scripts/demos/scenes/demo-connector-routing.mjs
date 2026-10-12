import { readSeed, seedSQL } from '../lib/seed.mjs';
import { SHOW_COMPACT } from './_relationship-editing-helpers.mjs';

/**
 * Relationship Editing > Connector Routing: categories sits between members
 * and the two tables it connects to. Dragging members down, back up and down
 * again re-routes the connector to orders live: it swaps between passing right
 * of categories and going round its left, every corner rounded, while the one
 * to addresses only moves its bend. Members is dropped low, so the clip ends
 * on the route round the left.
 *
 * Drawn at 100%, so the 8px corners read at their full size; the tables sit
 * close enough for that and still leave the routes room to go around one.
 * The dragged table is one the connectors attach to: dragging categories
 * itself re-routes them too, but erd-editor 3.8.0 did not repaint the
 * connectors until something else redrew them.
 */
export default {
  name: 'demo-connector-routing',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'addresses', 'categories'],
      tables: {
        orders: { x: 20, y: 20 },
        addresses: { x: 20, y: 370 },
        categories: { x: 360, y: 190 },
        members: { x: 680, y: 200 },
      },
      settings: { databaseName: 'shop', show: SHOW_COMPACT },
    });
    // Above members' left end: the way down to its header crosses no connector.
    await d.moveTo(720, 190, 50);
  },
  async scenario(d) {
    await d.sleep(700);
    const box = await d.tableBox('members');
    // The header's left end, by its icon, clear of the name and the comment,
    // which underline under a hover.
    const grab = { x: box.x + 10, y: box.y + 13 };
    // Where the pointer is with members moved by (dx, dy).
    const at = (dx, dy) => ({ x: grab.x + dx, y: grab.y + dy });

    await d.moveTo(grab.x, grab.y, 700);
    await d.sleep(250);
    await d.page.mouse.down();
    await d.sleep(200);

    // Each step re-routes, which slows the page down, so the durations here
    // come out about twice as long on screen.
    let p = at(-10, 120);
    await d.moveTo(p.x, p.y, 750);
    await d.sleep(700);
    await d.shot('down');

    p = at(0, 0);
    await d.moveTo(p.x, p.y, 650);
    await d.sleep(600);
    await d.shot('up');

    // Back down the way the first drag went: a path slanted further, to
    // (-20, 95), grazed a spot where the two routes tie, and the connector
    // flickered between them for a frame on the way. 10px short of the first
    // drop, the dashes (10 on, 10 off, counted from members) land on both of
    // the route's corners rather than leaving the upper one in a gap.
    p = at(-10, 110);
    await d.moveTo(p.x, p.y, 650);
    await d.sleep(300);
    await d.page.mouse.up();
    await d.sleep(300);
    await d.shot('dropped');

    // Back up into the empty canvas above members, crossing no connector, so
    // nothing is hovered at the end.
    await d.moveTo(720, 190, 700);
    await d.sleep(1400);
  },
};
