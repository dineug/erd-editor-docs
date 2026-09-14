import { readSeed } from '../lib/seed.mjs';
import { hoverMenuPath, labelPoint } from './_io-settings-helpers.mjs';

/**
 * Importing Schema SQL: from an empty document, Import > Schema SQL reads
 * shop.sql, and the tables are placed automatically, at 100% from the top
 * left, as the import resets the view. The automatic grid is 2000px wide, so
 * the clip then zooms out and scrolls to show the whole of it.
 */

const WIDTH = 960;
const HEIGHT = 540;

// Where the placed grid (scene x 50..1874, y 50..714) should land once zoomed
// out: left edge and top edge in viewport pixels. The top row stays left of
// the minimap and the second row passes under it.
const ZOOM_TICKS = 17; // 0.03 each: 100% -> 49%
const GRID_LEFT = 33;
const GRID_TOP = 110;

export default {
  name: 'demo-import-sql',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    await d.page.evaluate(() => {
      const editor = document.querySelector('erd-editor');
      const doc = JSON.parse(editor.value);
      doc.settings.databaseName = 'shop';
      editor.setInitialValue(JSON.stringify(doc));
    });
    await d.moveTo(520, 300, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    await d.rightClick(380, 90, { duration: 320 });
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
    await d.moveTo(28, 48, 380);
    await chooser.setFiles({
      name: 'shop.sql',
      mimeType: 'application/sql',
      buffer: Buffer.from(readSeed('shop.sql')),
    });
    await d.whenDrawn();
    await d.shot('imported');
    // The tables land at 100% from the top left.
    await d.sleep(650);

    // Zoom out around the middle of the screen, then scroll the grid into
    // place.
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

    const { originX, originY, zoomLevel } = (await d.value()).settings;
    // The canvas starts under the 30px toolbar.
    const left = originX + 50 * zoomLevel;
    const top = 30 + originY + 50 * zoomLevel;
    const steps = 12;
    await d.wheel((top - GRID_TOP) / steps, {
      deltaX: (left - GRID_LEFT) / steps,
      steps,
      gap: 35,
    });
    await d.whenDrawn();
    await d.shot('placed');
    await d.sleep(1500);
  },
};
