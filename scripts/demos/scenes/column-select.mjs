import { seedSQL } from '../lib/seed.mjs';

const SQL = `
CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  category_id BIGINT NOT NULL,
  sku VARCHAR(40) NOT NULL,
  name VARCHAR(200) NOT NULL,
  description TEXT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Catalog items';
`;

/**
 * Where the pointer waits between gestures: right of the table, left of the
 * minimap. A hovered row looks much like a selected one, so the pointer only
 * crosses the table along the row it clicks.
 */
const OUT_X = 590;

/**
 * Selecting Multiple Columns: Shift+Arrow, ⌘+click, ⌘+Shift+click,
 * Shift+click and Alt+A.
 */
export default {
  name: 'demo-column-select',
  width: 820,
  height: 450,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { products: { x: 20, y: 12 } },
      settings: { databaseName: 'shop', zoomLevel: 1.3 },
    });
    const id = await d.columnBox('products', 'id');
    await d.moveTo(OUT_X, id.y + id.height / 2, 50);
    // The keycaps sit right of the table, clear of its bottom rows and the pointer.
    await d.page.evaluate(() => document.getElementById('demo-keys').style.setProperty('left', '86%'));
  },
  async scenario(d) {
    /** A point on a column's name cell. */
    const row = async column => {
      const box = await d.columnBox('products', column);
      return { x: box.x + 70, y: box.y + box.height / 2 };
    };
    // Pointer travel runs slower while the screencast is on, so the durations
    // here are shorter than the moves read on screen.
    /**
     * Comes in along a column's row from outside the table, clicks it with the
     * modifiers held and their keycaps up, and goes back out along the row.
     */
    const modClick = async (column, modifiers, label) => {
      const at = await row(column);
      await d.moveTo(OUT_X, at.y, 220);
      await d.moveTo(at.x, at.y, 320);
      await d.holding(
        modifiers,
        async () => {
          await d.sleep(180);
          await d.click(at.x, at.y, { duration: 1 });
          await d.sleep(200);
          await d.moveTo(OUT_X, at.y, 280);
        },
        { label }
      );
      // The new selection, with no hover on the table.
      await d.sleep(350);
      await d.shot(label.join(''));
    };

    await d.sleep(450);
    const first = await row('id');
    await d.click(first.x, first.y, { duration: 380 });
    await d.sleep(150);
    await d.moveTo(OUT_X, first.y, 280);
    await d.sleep(120);
    // Shift+Arrow Down extends the selection one row at a time.
    await d.press('Shift+ArrowDown', { hold: 520 });
    await d.sleep(380);
    await d.press('Shift+ArrowDown', { hold: 520 });
    await d.sleep(450);
    await d.shot('shift-arrow');

    // ⌘+click adds one column.
    await modClick('description', ['ControlOrMeta'], ['⌘', 'click']);
    // ⌘+Shift+click adds the range from the last focused column.
    await modClick('stock', ['ControlOrMeta', 'Shift'], ['⌘', '⇧', 'click']);
    // Shift+click selects that range alone.
    await modClick('name', ['Shift'], ['⇧', 'click']);

    await d.press('Alt+KeyA');
    await d.sleep(1400);
  },
};
