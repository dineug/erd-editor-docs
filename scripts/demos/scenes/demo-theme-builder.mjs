/**
 * enableThemeBuilder: the Theme button on the toolbar opens the preset panel.
 * With the tables selected so the accent shows on their outlines, the accent
 * and gray palettes are changed and the editor restyles as each swatch is
 * picked; the appearance stays dark.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { themeSwatch, timeline, toolbarButtonBox, waitDom } from './_misc-helpers.mjs';

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;
// Just above the 70% where tables fold to a name bar, so four fit with room.
const ZOOM = 0.72;

export default {
  name: 'demo-theme-builder',
  width: 960,
  height: 540,
  async setup(d) {
    await d.page.evaluate(() => {
      document.querySelector('erd-editor').enableThemeBuilder = true;
    });
    // A square of four tables right of where the panel opens and left of the
    // minimap: members over orders, products over order_items.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'products', 'order_items'],
      tables: {
        members: { x: 560, y: 96 },
        orders: { x: 562, y: 346 },
        products: { x: 850, y: 96 },
        order_items: { x: 853, y: 346 },
      },
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: ZOOM },
    });
    // Left of the diagram, so the way up to the toolbar crosses no table.
    await d.moveTo(250, 330, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(500);

    const button = await toolbarButtonBox(d, 'Theme');
    await d.click(button.x + button.width / 2, button.y + button.height / 2, {
      duration: 520,
    });
    await waitDom(d, '.theme-builder');
    mark('panel open');
    await d.sleep(500);
    await d.shot('open');

    // Select every table, so the accent color draws their outlines.
    await d.press('ControlOrMeta+KeyA', { hold: 800 });
    await d.sleep(650);
    mark('selected');

    const pick = async (group, name, pause) => {
      const p = await themeSwatch(d, group, name);
      await d.click(p.x, p.y, { duration: 340 });
      mark(`${group} ${name}`);
      await d.sleep(pause);
      await d.shot(`${group}-${name}`);
    };
    await pick('accent', 'orange', 750);
    await pick('gray', 'sand', 900);
    await pick('accent', 'jade', 750);
    await pick('gray', 'sage', 700);

    // Off the panel and onto a relationship: its hover takes the accent too.
    const members = await d.tableBox('members');
    const orders = await d.tableBox('orders');
    const x = members.x + members.width / 2;
    const y = (members.y + members.height + orders.y) / 2;
    // Beside the line rather than on it, so the arrow does not hide it.
    await d.moveTo(x + 4, y, 650);
    mark('hover link');
    await d.sleep(1400);
    mark('end');
  },
};
