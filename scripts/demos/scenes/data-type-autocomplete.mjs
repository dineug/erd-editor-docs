import { seedSQL } from '../lib/seed.mjs';

const SQL = `
CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Catalog items';
`;

/** Where the pointer waits: under the table, left of every suggestion list. */
const PARK = { x: 62, y: 236 };

/** Viewport point inside one column's DataType cell. */
async function dataTypeCell(d, column) {
  const id = await d.columnId('products', column);
  return d.page.evaluate(id => {
    const stage = window.__erdStages.canvas;
    const texts = stage.findOne(`#column-${id}`).find('.cell-text');
    const c = stage.container().getBoundingClientRect();
    const r = texts[1].getClientRect();
    return { x: c.left + r.x + 24, y: c.top + r.y + r.height / 2 };
  }, id);
}

/** Double-clicks a DataType cell into edit mode and moves the pointer aside. */
async function editDataType(d, column) {
  const at = await dataTypeCell(d, column);
  // Pointer travel runs slower while the screencast is on, so the durations
  // here are shorter than the moves read on screen.
  await d.dblclick(at.x, at.y, { duration: 300 });
  await d.sleep(80);
  await d.moveTo(PARK.x, PARK.y, 220);
}

/**
 * DataType Autocomplete: the literal part of a suggestion is highlighted, the
 * match is fuzzy, the arrows move and go back, and Right, Tab and Enter accept.
 */
export default {
  name: 'demo-data-type-autocomplete',
  width: 640,
  height: 500,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { products: { x: 20, y: 8 } },
      settings: { databaseName: 'shop', zoomLevel: 1 },
      patch(doc) {
        for (const column of Object.values(doc.collections.tableColumnEntities)) {
          if (['name', 'price', 'is_active'].includes(column.name)) column.dataType = '';
        }
      },
    });
    await d.moveTo(PARK.x, PARK.y, 50);
    // The keycaps sit right of center, off the suggestion lists.
    await d.page.evaluate(() => document.getElementById('demo-keys').style.setProperty('left', '76%'));
  },
  async scenario(d) {
    const key = async (combo, pause = 250) => {
      await d.press(combo, { hold: 600 });
      await d.sleep(pause);
    };
    await d.sleep(500);

    // price: "dec" lights up the literal DEC; Down and Up move, Right accepts.
    await editDataType(d, 'price');
    // A one- or two-letter prefix matches most of the list, which would flash
    // down behind the floating toolbar, so each query lands in one input.
    await d.page.keyboard.insertText('dec');
    await d.sleep(550);
    await d.shot('dec');
    await key('ArrowDown');
    await key('ArrowDown');
    await key('ArrowDown', 300);
    await key('ArrowUp', 400);
    await d.shot('dec-up');
    await key('ArrowRight', 400);
    await d.shot('dec-accepted');

    // name: the match is fuzzy, so "vch" finds VARCHAR; Tab accepts, and the
    // arguments are typed freely after it.
    await editDataType(d, 'name');
    await d.page.keyboard.insertText('vch');
    await d.sleep(550);
    await d.shot('vch');
    for (let i = 0; i < 4; i++) await key('ArrowDown', 170);
    await d.sleep(250);
    await d.shot('vch-varchar');
    await key('Tab', 250);
    await d.shot('vch-tab');
    // "VARCHAR(" alone still matches 17 types; landing "(2" together keeps
    // the list short of the toolbar.
    await d.page.keyboard.insertText('(2');
    await d.sleep(90);
    await d.type('55)', 70);
    await d.sleep(300);
    await d.shot('varchar-255');
    // Nothing is highlighted, so Enter keeps the typed text and ends the edit.
    await key('Enter', 200);

    // is_active: Left goes back to the typed text; Enter accepts and ends the edit.
    await editDataType(d, 'is_active');
    await d.page.keyboard.insertText('boo');
    await d.sleep(450);
    await d.shot('boo');
    await key('ArrowDown', 350);
    await key('ArrowLeft', 450);
    await d.shot('boo-left');
    await key('ArrowDown');
    await key('ArrowDown', 350);
    await d.shot('boo-boolean');
    await d.press('Enter', { hold: 600 });
    await d.sleep(1300);
  },
};
