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
 * The mapping table sits on the left so its right end, past the comment and
 * below the + and x buttons, faces both parents: each preview reaches it
 * without crossing any header text. products is on top and tags level with
 * product_tags, so product_id (the first column) takes the upper connector
 * and tag_id the lower one, and tags lines up with that lower anchor for a
 * straight connector.
 */
export default {
  name: 'demo-relationship-n-m',
  width: 920,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        products: { x: 450, y: 30 },
        tags: { x: 450, y: 276 },
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

    // products first. Picked in the padding under its last row, at the left
    // end: no row lights up, and nothing covers its names.
    await d.press('ControlOrMeta+Alt+Digit2');
    await d.sleep(450);
    const products = await d.tableBox('products');
    const productsAt = { x: products.x + 6, y: products.y + products.height - 5 };
    await curveTo(d, { x: products.x - 30, y: products.y + products.height + 40 }, productsAt, 850);
    await d.click(productsAt.x, productsAt.y);

    // Into the right end of the empty table, in from the right.
    let mapping = await d.tableBox('product_tags');
    const firstAt = { x: mapping.x + mapping.width - 9, y: mapping.y + 34 };
    await glideTo(d, firstAt, 950, [
      { x: productsAt.x - 110, y: productsAt.y + 70 },
      { x: firstAt.x + 60, y: firstAt.y + 4 },
    ]);
    await d.click(firstAt.x, firstAt.y);
    await d.shot('first');

    // Out below the new connector's end, clear of it and of the new row:
    // halfway lands just past the table's right border, under the crow's foot.
    await d.sleep(60);
    mapping = await d.tableBox('product_tags');
    const right = mapping.x + mapping.width;
    await flick(d, { x: right + 27, y: mapping.y + 80 });
    await glideTo(d, { x: 340, y: 432 }, 750);
    await d.sleep(450);

    // Then tags, the same way.
    await d.press('ControlOrMeta+Alt+Digit2');
    await d.sleep(450);
    const tags = await d.tableBox('tags');
    const tagsAt = { x: tags.x + 6, y: tags.y + tags.height - 5 };
    await curveTo(d, { x: tags.x - 40, y: tags.y + tags.height + 10 }, tagsAt, 650);
    await d.click(tagsAt.x, tagsAt.y);

    // Into the padding under product_id, at the right end.
    const secondAt = { x: right - 13, y: mapping.y + 75 };
    await glideTo(d, secondAt, 950, [
      { x: tagsAt.x - 90, y: tagsAt.y + 10 },
      { x: secondAt.x + 70, y: secondAt.y + 8 },
    ]);
    await d.click(secondAt.x, secondAt.y);
    await d.shot('second');

    // Out between the two connectors: halfway is already past the border.
    await d.sleep(60);
    await flick(d, { x: right + 17, y: mapping.y + 59 });
    // Up through the middle of the gap between products and tags, well clear
    // of both, and down past the right side of tags.
    await glideTo(d, { x: 810, y: 450 }, 1100, [
      { x: 390, y: 220 },
      { x: 900, y: 190 },
    ]);
    await d.sleep(1400);
  },
};
