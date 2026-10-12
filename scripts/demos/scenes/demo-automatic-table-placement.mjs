import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide, menuItemBox, timer, waitFor } from './_table-related-b-helpers.mjs';

const mid = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Auto Layout: a diagram left in a heap is tidied from the canvas context
 * menu with the Flow layout, which lays the tables out left to right along
 * their relationships, each connector on its own point of contact, and
 * centers the result.
 */
export default {
  name: 'demo-automatic-table-placement',
  width: 960,
  height: 540,
  async setup(d) {
    const sql = readSeed('shop.sql');
    // Warms the layout worker, so the recorded Flow lands at once and its
    // Placing toast is up as briefly as it can be.
    await d.page.evaluate(
      sql => document.querySelector('erd-editor').setSchemaSQL(sql, { placement: 'auto' }),
      sql
    );
    await seedSQL(d, sql, {
      // Two chains that meet at order_items: Flow draws them with no crossing.
      only: ['members', 'orders', 'order_items', 'products', 'categories'],
      tables: {
        members: { x: 60, y: 60, color: '#3b82f6' },
        orders: { x: 190, y: 165, color: '#f59e0b' },
        products: { x: 110, y: 370, color: '#a855f7' },
        order_items: { x: 400, y: 300, color: '#f59e0b' },
        categories: { x: 620, y: 100, color: '#a855f7' },
      },
      // Names, types and keys only, at 80%, so the finished Flow layout fills
      // the frame clear of the minimap and the canvas toolbar.
      settings: { databaseName: 'shop', show: 4 | 32 | 256, zoomLevel: 0.8 },
    });
    await d.moveTo(560, 70, 0);
  },
  async scenario(d) {
    const mark = timer();
    // A cheap read of one Konva node, since a heavier poll could crowd the
    // frame the tables land in.
    const membersId = await d.tableId('members');
    const membersX = async () => (await d.nodeBox(`#table-${membersId}`)).x;
    await d.sleep(500);
    await d.shot('messy');

    mark('menu');
    await d.rightClick(470, 62, { duration: 450 });
    await d.sleep(350);
    const auto = mid(await waitFor(d, () => menuItemBox(d, 'Auto Layout')));
    // Down the menu's left padding, clear of its rows (no other submenu opens
    // on the way) and of the canvas (no table or connector lights up).
    const menu = await d.domBox('.context-menu-content');
    await glide(
      d,
      [
        { x: menu.x + 4, y: auto.y },
        { x: auto.x - 20, y: auto.y },
      ],
      750
    );
    await d.sleep(450);
    await d.shot('submenu');
    const flow = mid(await waitFor(d, () => menuItemBox(d, 'Flow')));
    // Force sits level with Auto Layout: into the submenu's left padding,
    // down it and along the Flow row, so Force does not light up on the way.
    const lane = (await d.domBox('.context-menu-content', 1)).x + 4;
    await glide(
      d,
      [
        { x: lane, y: auto.y },
        { x: lane, y: flow.y },
        { x: flow.x - 20, y: flow.y },
      ],
      550
    );
    await d.sleep(350);
    mark('click');
    const before = await membersX();
    await d.click(flow.x - 20, flow.y, { duration: 100 });
    // Off to a spot no table covers before or after, and still while they land.
    await d.moveTo(700, 440, 300);
    await waitFor(d, async () => (await membersX()) !== before, { timeout: 5000, gap: 100 });
    mark('placed');
    await d.shot('flow');
    await d.sleep(1800);
  },
};
