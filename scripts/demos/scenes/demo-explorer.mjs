/**
 * Explorer: the toolbar's Explorer button docks the panel left of the canvas,
 * which narrows while the diagram keeps its origin and slides right. A click
 * on products scrolls the canvas to it; orders unfolds to its Columns, Indexes
 * and Foreign Keys, a click on status takes the canvas back with the status
 * cell focused, and the member_id foreign key selects orders with its key
 * column and lights the connector to members. Collapse All folds the tree a
 * level per press, the edge widens the panel, and the toolbar button closes
 * it again. The seed holds a group and a memo so their folders show too.
 */
import { readSeed } from '../lib/seed.mjs';
import { glide, timeline, waitDom } from './_misc-helpers.mjs';
import { relationshipId } from './_relationship-editing-helpers.mjs';
import { memo, seedShop } from './_table-related-a-helpers.mjs';

// Wider than most clips: the panel takes 260 px and the canvas keeps 780.
const WIDTH = 1040;
const HEIGHT = 585;

// Table comment, data type, primary key and relationships; the hide bits for
// groups and memos stay off, so the tree has both folders.
const SHOW = 1 | 4 | 32 | 256;
const ZOOM = 0.8;

// A unique index, so orders has an Indexes folder beside its other two.
const SQL = `${readSeed('shop.sql')}
CREATE UNIQUE INDEX UQ_member_ordered_at ON orders (member_id, ordered_at);
`;

// Laid out for the 780 px canvas the Explorer leaves, clear of the minimap at
// its top right and the floating toolbar at its bottom, with the status row
// of orders at the canvas's centre: where a jump to it puts it, so the jump
// back from products lands on the view the clip opened with. products waits
// far right, off screen, for its row to scroll to.
const TABLES = {
  members: { x: 369, y: 38 },
  payments: { x: 56, y: 260 },
  orders: { x: 369, y: 260 },
  order_items: { x: 681, y: 260 },
  products: { x: 1400, y: 300 },
};

const GROUP = {
  id: 'billing',
  name: 'Billing',
  color: '#f59e0b',
  ui: { x: 38, y: 200, width: 588, height: 245, zIndex: 1 },
};

// Empty canvas right of the diagram, where the pointer starts and ends.
const REST = { x: 850, y: 430 };

/** The Explorer's row for a tree node id, polled until it is drawn. */
async function rowBox(d, nodeId) {
  const selector = `.explorer [role="treeitem"][id$=":${nodeId}"]`;
  const box = await waitDom(d, selector);
  const level = await d.page.evaluate(
    selector => Number(window.__erdShadowRoot.querySelector(selector).getAttribute('aria-level')),
    selector
  );
  // The twisty starts 12 px in per level below the first, the name 18 px after it.
  const indent = 12 * (level - 1);
  return {
    ...box,
    level,
    twisty: { x: box.x + indent + 8, y: box.y + box.height / 2 },
    name: { x: box.x + indent + 52, y: box.y + box.height / 2 },
  };
}

export default {
  name: 'demo-explorer',
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    await seedShop(d, {
      sql: SQL,
      tables: TABLES,
      memos: [
        memo('memo-settle', 'Payments settle within 3 days', {
          x: 56,
          y: 480,
          width: 200,
          height: 56,
        }),
      ],
      settings: { show: SHOW, zoomLevel: ZOOM },
      // The storage form leaves the group collections out while empty.
      patch(doc, byName) {
        doc.collections.tableGroupEntities ??= {};
        doc.doc.tableGroupIds ??= [];
        doc.collections.tableGroupEntities[GROUP.id] = GROUP;
        doc.doc.tableGroupIds.push(GROUP.id);
        for (const name of ['orders', 'payments']) {
          doc.collections.tableEntities[byName.get(name)].groupId = GROUP.id;
        }
      },
    });
    d.ids = {
      orders: await d.tableId('orders'),
      products: await d.tableId('products'),
      status: await d.columnId('orders', 'status'),
      fk: await relationshipId(d, 'members', 'orders'),
    };
    await d.moveTo(REST.x, REST.y, 0);
  },
  async scenario(d) {
    const mark = timeline();
    const { ids } = d;
    const click = async (p, duration, pause = 0) => {
      await d.click(p.x, p.y, { duration });
      if (pause) await d.sleep(pause);
    };
    const row = async id => rowBox(d, id);
    await d.sleep(400);

    // The toolbar's Explorer button, right after Search.
    const button = await waitDom(d, '.toolbar-explorer');
    const buttonAt = { x: button.x + button.width / 2, y: button.y + button.height / 2 };
    await click(buttonAt, 600);
    await waitDom(d, '.explorer');
    mark('open');
    await d.sleep(550);
    await d.shot('open');

    // products is off screen: its row scrolls the canvas to it.
    await click((await row(`t:${ids.products}`)).name, 460, 750);
    mark('products');
    await d.shot('products');

    // Unfold orders by its arrow, then its Columns folder.
    await click((await row(`t:${ids.orders}`)).twisty, 360, 380);
    await click((await row(`t:${ids.orders}/f:columns`)).name, 280, 380);
    mark('columns');
    await d.shot('columns');

    // status: the canvas goes back to orders with the status cell focused.
    await click((await row(`c:${ids.status}`)).name, 320, 900);
    mark('status');
    await d.shot('status');

    // The foreign key: orders selected with member_id, the connector lit.
    await click((await row(`t:${ids.orders}/f:foreignKeys`)).name, 320, 300);
    await click((await row(`r:${ids.fk}`)).name, 260, 1050);
    mark('foreign key');
    await d.shot('foreign-key');

    // Collapse All folds the deepest open level per press: orders' folders,
    // then orders.
    const collapse = await waitDom(d, '.explorer-collapse-all');
    const collapseAt = { x: collapse.x + collapse.width / 2, y: collapse.y + collapse.height / 2 };
    await click(collapseAt, 520, 500);
    await d.shot('collapse-1');
    await click(collapseAt, 0, 600);
    mark('collapsed');
    await d.shot('collapse-2');

    // Widen the panel by its edge, low enough to pass no row.
    const sash = await waitDom(d, '.explorer-sash .sash');
    const from = { x: sash.x + sash.width / 2, y: 520 };
    await d.moveTo(from.x, from.y, 500);
    await d.drag(from, { x: from.x + 80, y: from.y }, { duration: 550 });
    mark('resized');
    await d.sleep(450);
    await d.shot('resized');

    // The toolbar button closes it, and the diagram slides back.
    await click(buttonAt, 520);
    mark('closed');
    await d.sleep(200);
    // Above members and right of order_items, so neither lights up.
    await glide(d, [{ x: 780, y: 150 }, REST], 600);
    await d.sleep(1000);
    mark('end');
  },
};
