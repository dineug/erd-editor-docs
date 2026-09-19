/**
 * Copying/Pasting Tables and Memos: select two related tables, ⌘C, then ⌘V
 * twice. Each paste lands a further 50px down and right, brings the
 * relationship along, and becomes the selection; dragging the last copies
 * into the open shows the pair whole, with its relationship.
 */
import { glideTo, seedShop } from './_table-related-a-helpers.mjs';

export default {
  name: 'demo-table-copy-paste',
  width: 960,
  height: 520,
  async setup(d) {
    await seedShop(d, {
      tables: {
        members: { x: 16, y: 20 },
        addresses: { x: 330, y: 20 },
      },
      // No Not Null column: narrower tables are less to redraw while the
      // copies are dragged.
      settings: { show: 293 },
    });
    // The first clipboard read is slow; one here keeps the first paste from
    // lagging behind its keycaps.
    await d.page.evaluate(() => navigator.clipboard.readText().catch(() => ''));
    // Below where the copies land, so the pointer covers none of them.
    await d.moveTo(250, 352, 0);
  },
  async scenario(d) {
    await d.sleep(700);

    // Both tables, then copy and paste twice.
    await d.press('ControlOrMeta+KeyA');
    await d.sleep(750);
    await d.press('ControlOrMeta+KeyC');
    await d.sleep(600);
    await d.press('ControlOrMeta+KeyV');
    await d.sleep(1000);
    await d.shot('paste-1');
    await d.press('ControlOrMeta+KeyV');
    await d.sleep(1000);
    await d.shot('paste-2');

    // The newest copies are the selection and sit on top: a plain drag on the
    // header takes them down into the open, relationship and all.
    const members = await d.page.evaluate(() => {
      const doc = JSON.parse(document.querySelector('erd-editor').value);
      const ids = doc.doc.tableIds.filter(
        id => doc.collections.tableEntities[id].name === 'members'
      );
      return ids[ids.length - 1];
    });
    const copy = await d.nodeBox(`#table-${members}`);
    const from = { x: copy.x + 110, y: copy.y + 14 };
    await d.moveTo(from.x, from.y, 500);
    await d.sleep(250);
    await d.page.mouse.down();
    await d.sleep(200);
    // Brisk: every frame of the move redraws four tables' worth of text.
    await glideTo(d, { x: from.x, y: from.y + 132 }, 600);
    await d.sleep(200);
    await d.page.mouse.up();
    await d.shot('dragged');
    await d.sleep(200);
    await d.moveTo(from.x - 40, 480, 500);
    await d.sleep(1300);
  },
};
