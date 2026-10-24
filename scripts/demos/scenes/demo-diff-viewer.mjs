/**
 * Diff Viewer: the shop document is saved as a .json file, then reworked in
 * place, so every entity keeps its id: nickname renamed to display_name, a
 * phone column added, price widened to DECIMAL(12,2), reviews dropped and
 * coupons added. The canvas context menu opens Diff Viewer on the saved file,
 * and the tree lists each change with its letter, A, M, D or R, beside the
 * saved and the current document marked to match. A click on a row takes each
 * pane holding it there, Filter by name narrows the tree, and Close ends it.
 */
import { readSeed, seedDoc, seedSQL } from '../lib/seed.mjs';
import { closeButtonBox, timeline, waitDom, waitMenuItem } from './_misc-helpers.mjs';

// Wider than most clips, so each pane keeps (1040 - 260) / 2 - 1 = 389 px
// beside the 260 px tree, about what a pane had beside 4.0.0's narrower list.
const WIDTH = 1040;
const HEIGHT = 585;

const SAVED_SQL = readSeed('shop.sql');

// Imported here only off camera, to borrow the entities the rework adds; the
// current document is the saved one edited, so the ids carry over.
const CURRENT_SQL = `${SAVED_SQL
  .replace(
    "nickname VARCHAR(50) NOT NULL COMMENT 'Display name',",
    "display_name VARCHAR(50) NOT NULL COMMENT 'Display name',"
  )
  .replace(
    "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Joined at',",
    "created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Joined at',\n  phone VARCHAR(20) NULL COMMENT 'Contact number',"
  )
  .replace('price DECIMAL(10,2)', 'price DECIMAL(12,2)')}
CREATE TABLE coupons (
  id BIGINT NOT NULL AUTO_INCREMENT,
  code VARCHAR(30) NOT NULL,
  discount_rate DECIMAL(5,2) NOT NULL,
  expires_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Discount coupons';
`;

// Table comment, data type, primary key and relationships: narrow enough
// that a table fits the left half of a diff pane, clear of its minimap.
const SHOW = 1 | 4 | 32 | 256;

// One column of tables, so each pane shows the same ones: reviews in the
// saved document and coupons in the current one share a spot. members sits
// in the middle half of a pane, where a jump to it leaves the view alone, and
// products low, its price below the edge, so going there scrolls both panes.
const POSITIONS = {
  members: { x: 30, y: 150 },
  reviews: { x: 44, y: 360 },
  coupons: { x: 30, y: 360 },
  products: { x: 28, y: 640 },
};
const pick = (names, positions = POSITIONS) =>
  Object.fromEntries(names.map(name => [name, positions[name]]));

const settings = { databaseName: 'shop', show: SHOW, zoomLevel: 0.76 };

const byName = (doc, name) =>
  doc.doc.tableIds.find(id => doc.collections.tableEntities[id].name === name);
const columnOf = (doc, tableId, name) =>
  doc.collections.tableEntities[tableId].columnIds.find(
    id => doc.collections.tableColumnEntities[id].name === name
  );

/**
 * The diff tree's row for a node id: `t:<id>` for a table, `t:prev-<id>` for
 * one only the saved document has, `c:<id>` for a column, `<row>/f:columns`
 * for a table's Columns folder. Polled until drawn; the tree is virtualized.
 */
async function rowBox(d, nodeId) {
  const selector = `.diff-viewer-tree [role="treeitem"][id$=":${nodeId}"]`;
  const box = await waitDom(d, selector);
  const level = await d.page.evaluate(
    selector => Number(window.__erdShadowRoot.querySelector(selector).getAttribute('aria-level')),
    selector
  );
  // Past the twisty and the icon, 12 px in per level below the first.
  return { ...box, name: { x: box.x + 12 * (level - 1) + 56, y: box.y + box.height / 2 } };
}

export default {
  name: 'demo-diff-viewer',
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    const savedTables = ['members', 'reviews', 'products'];
    await seedSQL(d, SAVED_SQL, {
      only: savedTables,
      tables: pick(savedTables),
      settings,
    });
    // The connectors leave and reach the middle of a table's side and turn
    // with rounded corners, so a jog of a few pixels between two tables reads
    // as a kink: centre the saved column on members so both run straight.
    const width = async name => (await d.tableBox(name)).width / settings.zoomLevel;
    const middle = POSITIONS.members.x + (await width('members')) / 2;
    const positions = { ...POSITIONS };
    for (const name of ['reviews', 'products']) {
      positions[name] = { ...POSITIONS[name], x: Math.round(middle - (await width(name)) / 2) };
    }
    await seedSQL(d, SAVED_SQL, {
      only: savedTables,
      tables: pick(savedTables, positions),
      settings,
    });
    // What the editor's json export writes.
    const saved = await d.value();
    d.savedJson = JSON.stringify(saved);

    // Borrow what the rework adds from an import of the result. The value
    // is the storage form, which holds no measured widths: a load measures.
    await seedSQL(d, CURRENT_SQL, {
      only: ['members', 'coupons'],
      tables: pick(['members', 'coupons'], positions),
      settings,
    });
    const measured = await d.value();
    const m = measured.collections;
    const mMembers = byName(measured, 'members');
    const mColumn = (table, name) => m.tableColumnEntities[columnOf(measured, table, name)];

    const current = structuredClone(saved);
    const { tableEntities, tableColumnEntities } = current.collections;
    const members = byName(current, 'members');
    const products = byName(current, 'products');
    const reviews = byName(current, 'reviews');

    // R: the same column, renamed.
    const nickname = tableColumnEntities[columnOf(current, members, 'nickname')];
    nickname.name = 'display_name';

    // M: the same column, a wider type.
    const price = tableColumnEntities[columnOf(current, products, 'price')];
    price.dataType = 'DECIMAL(12,2)';

    // A: a column on members.
    const phone = structuredClone(mColumn(mMembers, 'phone'));
    phone.tableId = members;
    tableColumnEntities[phone.id] = phone;
    tableEntities[members].columnIds.push(phone.id);

    // D: reviews, with its relationships.
    current.doc.tableIds = current.doc.tableIds.filter(id => id !== reviews);
    current.doc.relationshipIds = current.doc.relationshipIds.filter(id => {
      const { start, end } = current.collections.relationshipEntities[id];
      return start.tableId !== reviews && end.tableId !== reviews;
    });

    // A: coupons where reviews stood.
    const coupons = byName(measured, 'coupons');
    tableEntities[coupons] = structuredClone(m.tableEntities[coupons]);
    for (const id of m.tableEntities[coupons].columnIds) {
      tableColumnEntities[id] = structuredClone(m.tableColumnEntities[id]);
    }
    current.doc.tableIds.push(coupons);

    await seedDoc(d, current);
    d.ids = { members, products, reviews, coupons, nickname: nickname.id, phone: phone.id, price: price.id };
    await d.moveTo(760, 330, 0);
  },
  async scenario(d) {
    const mark = timeline();
    const { ids } = d;
    await d.sleep(450);

    // Empty canvas right of the diagram, high enough that the menu (14 rows
    // since 4.2.0) stays clear of the floating toolbar.
    await d.rightClick(700, 50, { duration: 380 });
    mark('menu');
    await d.sleep(350);
    const item = await waitMenuItem(d, 'Diff Viewer');
    await d.shot('menu');
    // Down the menu's left padding, so the submenus on the way stay shut.
    const itemY = item.y + item.height / 2;
    await d.moveTo(item.x - 3, itemY, 340);
    await d.moveTo(item.x + 120, itemY, 150);
    await d.sleep(300);

    mark('click Diff Viewer');
    const [chooser] = await Promise.all([
      d.page.waitForEvent('filechooser'),
      d.click(item.x + 120, itemY, { duration: 0 }),
    ]);
    // The moment spent picking the file, pointer drifting off the menu.
    await d.moveTo(880, 330, 200);
    await chooser.setFiles({
      name: 'shop-2026-09-01T18_20_00.erd.json',
      mimeType: 'application/json',
      buffer: Buffer.from(d.savedJson),
    });
    await waitDom(d, '.diff-viewer-tree [role="treeitem"]');
    mark('diff open');
    await d.shot('diff');
    // Tables 4: coupons A, members with display_name R and phone A, products
    // with price M, and reviews D, beside panes marked to match.
    await d.sleep(1150);

    // A click takes each pane holding the row to it and selects it there.
    const click = async (nodeId, duration, pause) => {
      const { name } = await rowBox(d, nodeId);
      await d.click(name.x, name.y, { duration });
      await d.sleep(pause);
    };
    // members is already in view: both panes select it and stay put.
    await click(`c:${ids.nickname}`, 520, 750);
    mark('display_name');
    await d.shot('display-name');
    // Both panes scroll down to products: its price was below the edge.
    await click(`c:${ids.price}`, 360, 900);
    mark('price');
    await d.shot('price');
    // Removed: the saved pane alone goes back up to it.
    await click(`t:prev-${ids.reviews}`, 300, 900);
    mark('reviews');
    await d.shot('reviews');
    // Added: the current pane alone.
    await click(`t:${ids.coupons}`, 420, 900);
    mark('coupons');
    await d.shot('coupons');

    // Filter by name keeps members and the changes under it.
    const filter = await waitDom(d, '.diff-tree-filter');
    await d.click(filter.x + 60, filter.y + filter.height / 2, { duration: 420 });
    await d.sleep(200);
    await d.type('mem', 110);
    mark('filtered');
    await d.sleep(1000);
    await d.shot('filtered');

    // Close on the notice the view opened with (measured now: it slides in).
    const close = await closeButtonBox(d);
    await d.click(close.x, close.y, { duration: 520 });
    mark('closed');
    await d.sleep(200);
    await d.moveTo(close.x - 150, close.y - 170, 260);
    await d.sleep(1100);
    mark('end');
  },
};
