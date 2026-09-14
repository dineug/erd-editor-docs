/**
 * Moving Multiple Tables: select two tables, then drag one of them with no
 * modifier; the whole selection moves and the connectors follow.
 */
import { curveTo, glideTo, grip, seedShop } from './_table-related-a-helpers.mjs';

export default {
  name: 'demo-table-multiple-move',
  width: 880,
  height: 520,
  async setup(d) {
    await seedShop(d, {
      tables: {
        members: { x: 30, y: 30 },
        addresses: { x: 340, y: 30 },
        orders: { x: 40, y: 300 },
      },
      // Table comment, data type, PK and relationships only: narrower tables
      // keep the moving area, and so the clip, small.
      settings: { show: 293 },
    });
    await d.moveTo(290, 44, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    // members, then ⌘+click addresses, over the top of both tables.
    const members = grip(await d.tableBox('members'));
    const addresses = grip(await d.tableBox('addresses'));
    await curveTo(d, { x: members.x + 60, y: 40 }, members, 600);
    await d.click(members.x, members.y, { duration: 0 });
    await d.sleep(300);
    await curveTo(d, { x: (members.x + addresses.x) / 2, y: 6 }, addresses, 650);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(150);
        await d.click(addresses.x, addresses.y, { duration: 0 });
        await d.sleep(300);
      },
      { label: ['⌘', 'click'] }
    );
    await d.shot('selected');
    await d.sleep(600);

    // A plain drag on addresses carries members with it, and the relationship
    // from members to orders, which stays put, bends to follow.
    await d.page.mouse.down();
    await d.sleep(250);
    // Quick and short: every frame of the move redraws both tables.
    await glideTo(d, { x: addresses.x + 110, y: addresses.y + 2 }, 600);
    await d.sleep(250);
    await d.page.mouse.up();
    await d.shot('moved');
    await d.sleep(300);
    // Up off addresses into the gap above the two tables, so the result is
    // held unobstructed.
    await curveTo(d, { x: addresses.x + 90, y: 36 }, { x: addresses.x - 5, y: 44 }, 600);
    await d.sleep(1300);
  },
};
