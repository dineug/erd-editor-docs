/**
 * Table View Options: the canvas context menu's View Option submenu toggles
 * what every table shows, and the tables reflow as each option changes; the
 * last entry, Memos, hides the memos and shows them again.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed } from '../lib/seed.mjs';
import { memo, seedShop } from './_table-related-a-helpers.mjs';
import { glide } from './_table-related-b-helpers.mjs';

/**
 * The shop seed with real comments and a default on every orders column that
 * would have one, so switching Column Comment and Default off removes real
 * text rather than empty placeholders, and a unique index over two orders
 * columns, so Alternate Key marks them AK1.1 and AK1.2 when it is switched on.
 */
const SQL =
  readSeed('shop.sql').replace(
    `CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
  ordered_at DATETIME NOT NULL,`,
    `CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Order ID',
  member_id BIGINT NOT NULL COMMENT 'Buyer',
  status VARCHAR(20) NOT NULL DEFAULT 'PENDING' COMMENT 'Order status',
  ordered_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Placed at',`
  ) +
  '\nCREATE UNIQUE INDEX UQ_member_ordered_at ON orders (member_id, ordered_at);\n';

export default {
  name: 'demo-view-options',
  width: 960,
  height: 540,
  async setup(d) {
    if (!SQL.includes("'Placed at'")) {
      throw new Error('view-options: the shop seed no longer matches the patch');
    }
    await seedShop(d, {
      sql: SQL,
      tables: {
        members: { x: 30, y: 280 },
        orders: { x: 30, y: 30 },
      },
      // A memo between the tables, left of the open menus, for the Memos
      // entry to hide and show.
      memos: [
        memo('memo-checkout', 'One order per checkout; payments follow it.', {
          x: 310,
          y: 172,
          width: 180,
          height: 56,
        }),
      ],
      // A unique email, so Unique lights up a real UQ when it is switched on.
      // Set on the document: an inline UNIQUE in the SQL drops the comment.
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        const email = tableEntities[byName.get('members')].columnIds.find(
          id => tableColumnEntities[id].name === 'email'
        );
        tableColumnEntities[email].options |= 4; // ColumnOption.unique
      },
    });
    const doc = await d.value();
    const alternateKey = Object.values(doc.collections.indexEntities).find(
      index => index.unique && index.indexColumnIds.length === 2
    );
    if (!alternateKey) {
      throw new Error('view-options: the unique index on orders was not imported');
    }
    await d.moveTo(650, 300, 0);
  },
  async scenario(d) {
    await d.sleep(500);

    // Open the canvas context menu in the upper half, clear of the toolbar.
    await d.rightClick(520, 50, { duration: 600 });
    await d.sleep(400);

    // Down the menu's left padding, then into View Option.
    const view = center(await itemBox(d, 0, 'View Option'));
    await d.moveTo(524, view.y, 450);
    await d.moveTo(view.x - 20, view.y, 300);
    await d.sleep(400);

    const option = async name => center(await itemBox(d, 1, name));
    const columnComment = await option('Column Comment');
    // Into the submenu's left padding, up it and along the row, so the
    // entries level with View Option do not light up on the way.
    const lane = (await d.domBox('.context-menu-content', 1)).x + 4;
    await glide(
      d,
      [
        { x: lane, y: view.y },
        { x: lane, y: columnComment.y },
        columnComment,
      ],
      700
    );
    await d.sleep(150);
    await d.click(columnComment.x, columnComment.y, { duration: 0 });
    await d.sleep(900);
    await d.shot('column-comment-off');

    const toggle = async (name, pause) => {
      const item = await option(name);
      await d.click(item.x, item.y, { duration: 450 });
      await d.sleep(pause);
    };
    await toggle('Default', 900);
    await d.shot('default-off');
    await toggle('Unique', 800);
    await d.shot('unique-on');
    await toggle('Alternate Key', 900);
    await d.shot('alternate-key-on');
    await toggle('Auto Increment', 800);
    await d.shot('unique-ai-on');
    // Memos, the last entry, takes the memo off the canvas and puts it back.
    await toggle('Memos', 800);
    await d.shot('memos-off');
    await toggle('Memos', 900);
    await d.shot('memos-on');

    // Escape closes both menus and leaves the pointer where it is.
    await d.press('Escape');
    await d.sleep(1300);
    await d.shot('closed');
  },
};

/** Viewport box of a context menu item by label, in menu level `level`. */
async function itemBox(d, level, label) {
  const box = await d.page.evaluate(
    ([level, label]) => {
      const menu = window.__erdShadowRoot.querySelectorAll('.context-menu-content')[level];
      const item = [...(menu?.children ?? [])].find(el => el.textContent.trim().startsWith(label) && el.dataset.id);
      const r = item?.getBoundingClientRect();
      return r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null;
    },
    [level, label]
  );
  if (!box) throw new Error(`no menu item ${label}`);
  return box;
}
