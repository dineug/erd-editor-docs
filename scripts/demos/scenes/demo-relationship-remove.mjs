import { center } from '../lib/recorder.mjs';
import { menuItemBox, routePoint, seedShop } from './_relationship-editing-helpers.mjs';

/**
 * Relationship Editing > Deletion: right-click the products -> reviews
 * connector, pick Delete, and the connector is gone while members -> reviews
 * stays.
 */
export default {
  name: 'demo-relationship-remove',
  width: 880,
  height: 500,
  async setup(d) {
    await seedShop(d, {
      only: ['products', 'members', 'reviews'],
      tables: {
        // reviews sits low and far right, so the products connector has a
        // long upper run and its menu opens over empty canvas.
        products: { x: 40, y: 30 },
        members: { x: 40, y: 255 },
        reviews: { x: 600, y: 200 },
      },
    });
    // Parked in the empty space above the connectors, so no pointer path crosses a table.
    await d.moveTo(480, 95, 50);
  },
  async scenario(d) {
    await d.sleep(600);
    // On the upper run next to products: the menu then opens over empty
    // canvas, and the reviews end of the connector stays in view.
    const route = await routePoint(d, 'products', 'reviews', 0.02);
    const p = { x: route.x, y: route.y + 2 };
    await d.moveTo(p.x, p.y, 700);
    await d.sleep(450);
    await d.rightClick(p.x, p.y);
    await d.sleep(700);
    await d.shot('menu');

    const remove = center(await menuItemBox(d, 'Delete'));
    // Down the menu's inner margin first: crossing the Relationship Type row
    // would open its submenu over the clip.
    // Into the row's lower edge, under the label, then along it to past the
    // end of "Delete": the pointer never slides across the label, and neither
    // it nor the click ripple covers it.
    const hit = { x: remove.x + 40, y: remove.y + 8 };
    await d.moveTo(p.x + 3, hit.y, 380);
    await d.moveTo(hit.x, hit.y, 450);
    await d.sleep(400);
    await d.click(hit.x, hit.y, { duration: 100 });
    await d.sleep(120);
    // Up into the empty canvas, well away from reviews and its product_id row.
    await d.moveTo(520, 95, 650);
    await d.shot('removed');
    await d.sleep(1400);
  },
};
