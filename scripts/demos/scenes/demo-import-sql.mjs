import { readSeed } from '../lib/seed.mjs';
import { hoverMenuPath, labelPoint } from './_io-settings-helpers.mjs';

/**
 * Importing Schema SQL: from an empty document, Import > Schema SQL reads
 * shop.sql, and the tables arrive already laid out by Flow, left to right
 * along their relationships, at 100% from the top left, as the import resets
 * the view. The layout is wider than the screen, so the clip then zooms out
 * and scrolls to show the whole of it.
 */

const WIDTH = 960;
const HEIGHT = 540;

const ZOOM_TICKS = 19; // 0.03 each: 100% -> 43%
// Where the placed layout (about 1670x580 scene px) should land once zoomed
// out, in viewport pixels: its left edge and its top edge, which leave it
// centred left of the minimap and above the canvas toolbar.
const LAYOUT_LEFT = 34;
const LAYOUT_TOP = 120;

const SHOP_TABLES = [
  'members',
  'addresses',
  'categories',
  'products',
  'orders',
  'order_items',
  'payments',
  'reviews',
];

/** Viewport box round every table of the shop. */
async function layoutBox(d) {
  const boxes = await Promise.all(SHOP_TABLES.map(name => d.tableBox(name)));
  const left = Math.min(...boxes.map(b => b.x));
  const top = Math.min(...boxes.map(b => b.y));
  const right = Math.max(...boxes.map(b => b.x + b.width));
  const bottom = Math.max(...boxes.map(b => b.y + b.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export default {
  name: 'demo-import-sql',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    await d.page.evaluate(async sql => {
      const editor = document.querySelector('erd-editor');
      const empty = JSON.parse(editor.value);
      // Warms the layout worker, so the recorded import lands at once.
      await editor.setSchemaSQL(sql, { placement: 'auto' });
      empty.settings.databaseName = 'shop';
      editor.setInitialValue(JSON.stringify(empty));
    }, readSeed('shop.sql'));
    await d.whenDrawn();
    await d.moveTo(520, 300, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    // As high as the menu opens. Since 4.2.0 its last row (Diff Viewer) still
    // covers the canvas toolbar for the second the menu is open.
    await d.rightClick(380, 64, { duration: 320 });
    await d.sleep(300);
    const item = await hoverMenuPath(d, ['Import', 'Schema SQL'], {
      pause: 250,
      lastPause: 120,
    });
    await d.shot('import-submenu');

    const p = labelPoint(item);
    const [chooser] = await Promise.all([
      d.page.waitForEvent('filechooser'),
      d.click(p.x, p.y),
    ]);
    // The moment a person spends picking the file. The pointer goes to the
    // top-left corner, clear of the tables to come.
    await d.moveTo(24, 48, 380);
    await chooser.setFiles({
      name: 'shop.sql',
      mimeType: 'application/sql',
      buffer: Buffer.from(readSeed('shop.sql')),
    });
    // Flow places the tables before they land, in one step. An empty
    // document's value leaves tableIds out (since 4.2.0).
    await d.page.waitForFunction(
      () => JSON.parse(document.querySelector('erd-editor').value).doc.tableIds?.length > 0
    );
    await d.whenDrawn();
    await d.shot('imported');
    // The tables land at 100% from the top left.
    await d.sleep(900);

    // Zoom out, which keeps the middle of the screen in place, then scroll
    // the layout into place. The pointer stays in its corner.
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.wheel(100, { steps: ZOOM_TICKS, gap: 45 });
        await d.sleep(250);
      },
      { label: ['⌘', 'scroll'] }
    );
    await d.whenDrawn();
    await d.sleep(300);
    await d.shot('zoomed');

    const box = await layoutBox(d);
    const steps = 12;
    await d.wheel((box.y - LAYOUT_TOP) / steps, {
      deltaX: (box.x - LAYOUT_LEFT) / steps,
      steps,
      gap: 35,
    });
    await d.whenDrawn();
    await d.shot('placed');
    await d.sleep(1500);
  },
};
