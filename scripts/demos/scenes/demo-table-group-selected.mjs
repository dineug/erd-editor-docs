/**
 * Grouping selected tables: categories and products are selected, and T then
 * G, Group selected tables' key sequence, wraps them in a group, its name
 * editor open for Catalog. The group's own menu then gives it a color, and both
 * member tables' header bands take it, while members and orders, outside the
 * group, keep theirs.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { waitMenuItem } from './_io-settings-helpers.mjs';
import { timeline, waitDom } from './_misc-helpers.mjs';
import { curveTo } from './_table-related-a-helpers.mjs';

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;
const ZOOM = 0.8;

/** Polls a Konva node on the canvas stage until it is drawn, and returns its box. */
async function waitNode(d, selector, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.nodeBox(selector);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`node not found: ${selector}`);
    await d.sleep(50);
  }
}

/** Hovers a menu row down the menu's left padding, so no other row lights up, and clicks it. */
async function pickMenuItem(d, label, pause = 320) {
  const item = await waitMenuItem(d, label);
  const y = item.y + item.height / 2;
  if (Math.abs(d.mouse.y - y) > item.height / 2) {
    await d.moveTo(item.x - 4, y, 280);
  }
  const at = { x: item.x + item.width * 0.55, y };
  await d.moveTo(at.x, at.y, 240);
  await d.sleep(pause);
  await d.click(at.x, at.y, { duration: 0 });
}

export default {
  name: 'demo-table-group-selected',
  width: 960,
  height: 540,
  async setup(d) {
    // The two tables to group on the top row, where the color picker opens
    // with room below it; members and orders stay out, on the lower row.
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['categories', 'products', 'members', 'orders'],
      tables: {
        categories: { x: 70, y: 95 },
        products: { x: 390, y: 90 },
        members: { x: 70, y: 380 },
        orders: { x: 390, y: 380 },
      },
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: ZOOM },
    });
    await d.moveTo(640, 300, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(400);

    // categories, then ⌘+click products.
    const categories = await d.tableBox('categories');
    const products = await d.tableBox('products');
    const catGrip = { x: categories.x + 60, y: categories.y + 10 };
    const prodGrip = { x: products.x + 64, y: products.y + 10 };
    await curveTo(d, { x: 400, y: 40 }, catGrip, 800);
    await d.sleep(120);
    await d.click(catGrip.x, catGrip.y, { duration: 0 });
    await d.sleep(250);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(120);
        await curveTo(d, { x: (catGrip.x + prodGrip.x) / 2, y: catGrip.y - 30 }, prodGrip, 600);
        await d.sleep(100);
        await d.click(prodGrip.x, prodGrip.y, { duration: 0 });
        await d.sleep(250);
      },
      { label: ['⌘', 'click'] }
    );
    mark('selected');
    await d.sleep(200);
    await d.shot('selected');

    // T, then G: the second press within a second of the first. Pressed
    // straight to the page, so the T keycap stays up while G joins it.
    await d.keys(['T'], 1600);
    await d.sleep(130);
    await d.page.keyboard.press('KeyT');
    await d.sleep(380);
    await d.keys(['T', 'G'], 900);
    await d.sleep(130);
    await d.page.keyboard.press('KeyG');
    await waitDom(d, '.table-group-name-input');
    mark('grouped');
    // The keycaps go down before the name is typed.
    await d.sleep(650);
    await d.shot('grouped');

    await d.type('Catalog', 90);
    await d.sleep(200);
    await d.press('Enter', { hold: 700 });
    await d.whenDrawn();
    mark('named');
    await d.sleep(300);
    await d.shot('named');

    // The group's menu: Color opens the picker at the pointer.
    const bar = await waitNode(d, '.table-group-title-bar');
    const barAt = { x: bar.x + bar.width * 0.62, y: bar.y + bar.height / 2 };
    await curveTo(d, { x: barAt.x + 60, y: barAt.y + 40 }, barAt, 650);
    await d.sleep(200);
    await d.rightClick(barAt.x, barAt.y, { duration: 0 });
    await d.sleep(150);
    await d.shot('group-menu');
    await pickMenuItem(d, 'Color', 380);
    const panel = await waitDom(d, '.color-picker [role="dialog"]');
    mark('picker');
    await d.sleep(450);
    await d.shot('picker');

    const violet = center(await d.domBox('.color-picker button[role="radio"][aria-label="Violet"]'));
    await curveTo(d, { x: panel.x + panel.width + 30, y: violet.y - 40 }, violet, 700);
    await d.sleep(150);
    await d.click(violet.x, violet.y, { duration: 0 });
    mark('colored');
    await d.sleep(700);
    await d.shot('colored');

    // Escape closes the picker, so the pointer leaves the swatches without
    // lighting up the others; a click on empty canvas lets the group go.
    await d.press('Escape', { hold: 700 });
    await d.sleep(150);
    const orders = await d.tableBox('orders');
    await d.click(orders.x + orders.width + 190, orders.y - 40, { duration: 550 });
    await d.sleep(1200);
    await d.shot('done');
    mark('end');
  },
};
