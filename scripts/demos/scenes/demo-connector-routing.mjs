import { readSeed, seedSQL } from '../lib/seed.mjs';
import { SHOW_COMPACT } from './_relationship-editing-helpers.mjs';

const ZOOM = 0.8;

/**
 * Relationship Editing > Connector Routing: categories sits between members
 * and the two tables it connects to. Dragging members down and back up
 * re-routes both connectors live: the one to orders swaps from passing right
 * of categories to going round its left, every corner cut at 45 degrees, and
 * the two routes leaving members' left side keep corridors of their own.
 *
 * Drawn at 80% so the tables leave the routes room to go around one. The
 * dragged table is one the connectors attach to: dragging categories itself
 * re-routes them too, but erd-editor 3.8.0 does not repaint the connectors
 * until something else redraws them (see the editor issues in the report).
 */
export default {
  name: 'demo-connector-routing',
  width: 900,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'addresses', 'categories'],
      tables: {
        orders: { x: 40, y: 60 },
        addresses: { x: 40, y: 420 },
        categories: { x: 430, y: 235 },
        members: { x: 800, y: 250 },
      },
      settings: { databaseName: 'shop', show: SHOW_COMPACT, zoomLevel: ZOOM },
    });
    await d.moveTo(600, 180, 50);
  },
  async scenario(d) {
    await d.sleep(700);
    const box = await d.tableBox('members');
    const grab = { x: box.x + 120, y: box.y + 8 };
    // Where the pointer is with members moved by (dx, dy) document units.
    const at = (dx, dy) => ({ x: grab.x + dx * ZOOM, y: grab.y + dy * ZOOM });

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

    p = at(-20, 95);
    await d.moveTo(p.x, p.y, 650);
    await d.sleep(300);
    await d.page.mouse.up();
    await d.sleep(300);
    await d.shot('dropped');

    // Up into the empty canvas above members, so nothing is hovered at the end.
    await d.moveTo(600, 180, 700);
    await d.sleep(1400);
  },
};
