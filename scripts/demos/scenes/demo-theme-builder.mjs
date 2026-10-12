/**
 * enableThemeBuilder: the Theme button on the toolbar opens the Theme panel.
 * With the tables selected so the accent shows on their outlines, the accent
 * and gray palettes are changed and the editor restyles as each swatch is
 * picked. Light then turns the editor light, and System takes it back to
 * the operating system's appearance, dark here. The panel's x closes it.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { themeSwatch, timeline, toolbarButtonBox, waitDom } from './_misc-helpers.mjs';

/** Viewport box of the panel's appearance button labelled `label` ('System', 'Light', 'Dark'). */
function appearanceBox(d, label) {
  return d.page.evaluate(label => {
    const button = [...window.__erdShadowRoot.querySelectorAll('.theme-builder div')].find(
      el => el.children.length === 3 && el.lastElementChild.textContent.trim() === label
    );
    if (!button) throw new Error(`no appearance button ${label}`);
    const r = button.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, label);
}

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
    await pick('gray', 'sand', 800);

    // Light, then System, which follows the operating system: dark here.
    const appearance = async (label, pause) => {
      const box = await appearanceBox(d, label);
      // Near the button's end, so the pointer leaves its label readable.
      await d.click(box.x + box.width - 12, box.y + box.height / 2, { duration: 380 });
      mark(label);
      await d.sleep(pause);
      await d.shot(label);
    };
    await appearance('Light', 1000);
    await appearance('System', 1000);

    // The x at the end of the title closes the panel.
    const close = await d.domBox('.theme-builder-close');
    await d.click(close.x + close.width / 2, close.y + close.height / 2, {
      duration: 520,
    });
    mark('closed');
    // Down off the toolbar onto empty canvas, left of the diagram.
    await d.moveTo(250, 330, 500);
    await d.sleep(1100);
    mark('end');
  },
};
