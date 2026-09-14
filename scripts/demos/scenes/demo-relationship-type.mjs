import { center } from '../lib/recorder.mjs';
import { menuItemBox, routePoint, seedShop } from './_relationship-editing-helpers.mjs';

/** Moves onto a row of the open type submenu and clicks it. */
async function pickType(d, type, duration = 450) {
  const item = await menuItemBox(d, type);
  const target = { x: item.x + item.width / 2, y: item.y + item.height / 2 };
  await d.moveTo(target.x, target.y, duration);
  await d.sleep(400);
  await d.click(target.x, target.y, { duration: 80 });
}

/**
 * Relationship Editing > Type Change: the categories -> products connector
 * goes from Zero N to One Only to One N from its context menu. The check
 * follows the current type and the notation at the products end follows it.
 */
export default {
  name: 'demo-relationship-type',
  width: 800,
  height: 450,
  async setup(d) {
    await seedShop(d, {
      only: ['categories', 'products'],
      tables: {
        products: { x: 40, y: 90 },
        categories: { x: 430, y: 180 },
      },
    });
    await d.moveTo(470, 110, 50);
  },
  async scenario(d) {
    await d.sleep(600);
    const route = await routePoint(d, 'categories', 'products', 0.12);
    await d.moveTo(route.x, route.y, 700);
    await d.sleep(400);
    await d.rightClick(route.x, route.y, { duration: 100 });
    await d.sleep(400);

    const row = center(await menuItemBox(d, 'Relationship Type'));
    await d.moveTo(row.x + 40, row.y, 450);
    await d.sleep(750);
    await d.shot('submenu');

    // Straight across into the submenu first, so the pointer stays on the
    // Relationship Type row until it gets there.
    const first = await menuItemBox(d, 'Zero One');
    await d.moveTo(first.x + 40, row.y, 350);
    await pickType(d, 'One Only');
    await d.sleep(950);
    await d.shot('one-only');
    await pickType(d, 'One N', 400);
    await d.sleep(950);
    await d.shot('one-n');

    // Out past the submenu's lower right corner, crossing no other row, and a
    // click on the empty canvas there closes the menu.
    await d.click(730, 415, { duration: 500 });
    await d.sleep(1400);
  },
};
