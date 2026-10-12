import { seedSQL } from '../lib/seed.mjs';
import { curveTo, glideTo, SHOW_COMPACT } from './_relationship-editing-helpers.mjs';

// Keys named after their table, the way a mapping table wants them: each
// drawn relationship copies the parent key's name onto the child.
const SQL = `
CREATE TABLE products (
  product_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (product_id)
) COMMENT 'Catalog items';

CREATE TABLE tags (
  tag_id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  PRIMARY KEY (tag_id)
) COMMENT 'Product tags';

CREATE TABLE product_tags (
  placeholder INT NULL
) COMMENT 'Products <-> tags';
`;

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
 * How long the pointer rests on the table a draw is about to end on: the
 * outline and the Map / New buttons appear beside it as it arrives.
 */
const PILL_HOLD = 450;

/**
 * A two-event flick straight to `to`. The one event in between lands halfway,
 * so both ends and the midpoint are picked clear of rows and connectors.
 */
function flick(d, to) {
  return d.moveTo(to.x, to.y, 16);
}

/**
 * Relationship Editing > N:M Relationships: products and then tags each get a
 * relationship into the empty product_tags table, which ends up holding a
 * foreign key to both sides.
 *
 * The mapping table sits on the left so its right end, short of the + and x
 * buttons, faces both parents: each preview reaches it from below without
 * crossing any header text or button. products is on top and tags level with
 * product_tags, so product_id (the first column) takes the upper connector
 * and tag_id the lower one, and tags lines up with that lower anchor for a
 * straight connector.
 *
 * Over product_tags each draw outlines it and shows the Map / New buttons on
 * its right, the side the pointer comes in from: there is no room on its left.
 * The pointer reaches the table before they appear, so it never hovers them,
 * and presses the table itself, which adds new columns as the + button would.
 */
export default {
  name: 'demo-relationship-n-m',
  width: 920,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        products: { x: 450, y: 30 },
        tags: { x: 450, y: 261 },
        product_tags: { x: 50, y: 236 },
      },
      settings: { databaseName: 'shop', show: SHOW_COMPACT },
      patch(doc, byName) {
        // SQL has no empty table, so the placeholder column comes out here.
        const mapping = doc.collections.tableEntities[byName.get('product_tags')];
        for (const id of mapping.columnIds) delete doc.collections.tableColumnEntities[id];
        mapping.columnIds = [];
        mapping.seqColumnIds = [];
      },
    });
    await d.moveTo(340, 432, 50);
    await moveOnPress(d);
  },
  async scenario(d) {
    await d.sleep(600);

    // products first. Picked on its last row, at the left end, where nothing
    // covers its names.
    await d.press('ControlOrMeta+Alt+Digit2');
    await d.sleep(450);
    const products = await d.tableBox('products');
    const productsAt = { x: products.x + 6, y: products.y + products.height - 5 };
    await curveTo(d, { x: products.x - 30, y: products.y + products.height + 40 }, productsAt, 850);
    await d.click(productsAt.x, productsAt.y);

    // Into the right end of the empty table, its header all there is of it,
    // short of the + and x buttons in its last 36px. Up from below, so the
    // pointer never crosses those buttons, which would flash a hand cursor.
    let mapping = await d.tableBox('product_tags');
    const firstAt = { x: mapping.x + mapping.width - 44, y: mapping.y + mapping.height / 2 };
    // Down past the table's right end first, then under it and up, so the
    // way in passes neither its buttons nor tags.
    await glideTo(d, firstAt, 1000, [
      { x: productsAt.x - 40, y: firstAt.y + 90 },
      { x: firstAt.x - 6, y: firstAt.y + 80 },
    ]);
    // The table under the pointer gets its outline and the Map / New buttons
    // beside it; a moment on it lets them read before the press draws to it.
    await d.sleep(PILL_HOLD);
    await d.shot('first-target');
    await d.click(firstAt.x, firstAt.y);
    await d.shot('first');

    // Out below the new connector's end, clear of it and of the new row:
    // halfway lands 8px past the table's right border, under the crow's foot.
    await d.sleep(60);
    mapping = await d.tableBox('product_tags');
    const right = mapping.x + mapping.width;
    await flick(d, { x: right + 60, y: mapping.y + 80 });
    await glideTo(d, { x: 340, y: 432 }, 750);
    await d.sleep(450);

    // Then tags, the same way.
    await d.press('ControlOrMeta+Alt+Digit2');
    await d.sleep(450);
    const tags = await d.tableBox('tags');
    const tagsAt = { x: tags.x + 6, y: tags.y + tags.height - 5 };
    await curveTo(d, { x: tags.x - 40, y: tags.y + tags.height + 10 }, tagsAt, 650);
    await d.click(tagsAt.x, tagsAt.y);

    // Onto product_id, at the right end, short of the row's remove button,
    // again up from below.
    const productId = await d.columnBox('product_tags', 'product_id');
    const secondAt = { x: right - 44, y: productId.y + productId.height / 2 };
    await glideTo(d, secondAt, 950, [
      { x: tagsAt.x - 90, y: tagsAt.y + 10 },
      { x: secondAt.x - 6, y: secondAt.y + 60 },
    ]);
    await d.sleep(PILL_HOLD);
    await d.shot('second-target');
    await d.click(secondAt.x, secondAt.y);
    await d.shot('second');

    // Straight down out of the table: halfway is already below its border,
    // so the tag_id row and the new connector beside it are never hovered.
    // Then along under tags, clear of it, to the lower right.
    await d.sleep(60);
    await d.whenDrawn();
    mapping = await d.tableBox('product_tags');
    const below = mapping.y + mapping.height;
    await flick(d, { x: secondAt.x - 8, y: 2 * (below + 8) - secondAt.y });
    await glideTo(d, { x: 810, y: 450 }, 1100);
    await d.sleep(1400);
  },
};
