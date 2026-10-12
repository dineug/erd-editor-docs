import { glideTo, seedShop } from './_relationship-editing-helpers.mjs';

/**
 * The drawing preview starts out pointing at the canvas origin and only
 * follows the pointer from its next move, so a press that picks the parent
 * would flash a line off to the top left corner. Every press is followed by a
 * move to the very spot it landed on, the event a hand on a real mouse sends
 * anyway, so the first frame drawn already ends at the pointer.
 */
function moveOnPress(d) {
  return d.page.evaluate(() => {
    window.addEventListener('mousedown', event => {
      const { clientX, clientY } = event;
      event
        .composedPath()[0]
        .dispatchEvent(
          new MouseEvent('mousemove', { bubbles: true, composed: true, clientX, clientY, view: window })
        );
    });
  });
}

/**
 * Relationship Editing > Map Columns: orders already holds member_id, but no
 * relationship says so. A Zero N draw from members, ended on the pill's link
 * button instead of a press on orders, opens Map Columns, where id is mapped
 * onto member_id. The connector lands on that column and orders keeps its
 * four columns.
 *
 * The row is not prefilled: only members_id would match by name.
 */
export default {
  name: 'demo-map-columns',
  width: 960,
  height: 540,
  async setup(d) {
    await seedShop(d, {
      only: ['members', 'orders'],
      tables: {
        members: { x: 60, y: 60 },
        orders: { x: 520, y: 250 },
      },
      patch(doc, byName) {
        // orders.member_id stays a plain column with no relationship behind it.
        doc.doc.relationshipIds = doc.doc.relationshipIds.filter(id => {
          const { start, end } = doc.collections.relationshipEntities[id];
          const drop = start.tableId === byName.get('members') && end.tableId === byName.get('orders');
          if (drop) delete doc.collections.relationshipEntities[id];
          return !drop;
        });
      },
    });
    await d.moveTo(380, 420, 50);
    await moveOnPress(d);
  },
  async scenario(d) {
    await d.sleep(600);

    await d.press('ControlOrMeta+Alt+Digit2');
    await d.sleep(400);

    // members, picked in its header right of the comment.
    const members = await d.tableBox('members');
    const membersAt = { x: members.x + members.width - 50, y: members.y + 13 };
    await d.click(membersAt.x, membersAt.y, { duration: 800 });
    await d.shot('start');

    // Onto orders, resting on the member_id row the key is meant for: orders
    // gets its outline and the two buttons beside it.
    const memberId = await d.columnBox('orders', 'member_id');
    const ordersAt = { x: memberId.x + memberId.width - 90, y: memberId.y + memberId.height / 2 };
    await glideTo(d, ordersAt, 900);
    await d.sleep(700);
    await d.shot('target');

    // The link button: Map to existing columns.
    const map = await d.domBox('.draw-target-map');
    await d.click(map.x + map.width / 2, map.y + map.height / 2, { duration: 650 });
    await d.sleep(1100);
    await d.shot('dialog');

    // The pointer rests on the list while the pick is made: a native list
    // popup is not drawn in a headless capture.
    const select = await d.domBox('.map-columns select[data-parent-column-id]');
    await d.moveTo(select.x + select.width - 40, select.y + select.height / 2, 700);
    await d.sleep(450);
    await d.page
      .locator('erd-editor .map-columns select[data-parent-column-id]')
      .first()
      .selectOption({ label: 'member_id (BIGINT)' });
    await d.sleep(900);
    await d.shot('picked');

    const confirm = await d.domBox('.map-columns-confirm');
    await d.click(confirm.x + confirm.width / 2, confirm.y + confirm.height / 2, { duration: 600 });
    await d.sleep(500);
    await d.shot('mapped');

    // Off into the empty canvas below members, clear of the new connector.
    await glideTo(d, { x: 300, y: 430 }, 800);
    await d.sleep(1400);
  },
};
