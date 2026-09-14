/**
 * Diff Viewer: the shop document is saved as a .json file, then reworked
 * (a column renamed and one added, a data type changed, reviews dropped and
 * coupons added). The canvas context menu opens Diff Viewer, the saved file
 * is picked, and the view lists the changes beside the saved and the current
 * document. The pointer runs down the changes, then Close ends it.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import {
  closeButtonBox,
  diffTreeRows,
  timeline,
  waitDom,
  waitMenuItem,
} from './_misc-helpers.mjs';

const WIDTH = 960;
const HEIGHT = 540;

const SAVED_SQL = readSeed('shop.sql');

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

// One column of tables, so each pane shows the same three side by side:
// reviews in the saved document and coupons in the current one share a spot.
const POSITIONS = {
  members: { x: 30, y: 28 },
  reviews: { x: 44, y: 236 },
  coupons: { x: 30, y: 236 },
  products: { x: 28, y: 468 },
};
const pick = names => Object.fromEntries(names.map(name => [name, POSITIONS[name]]));

// 76% keeps all three tables inside the pane height.
const settings = { databaseName: 'shop', show: SHOW, zoomLevel: 0.76 };

export default {
  name: 'demo-diff-viewer',
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    const savedTables = ['members', 'reviews', 'products'];
    const saved = await seedSQL(d, SAVED_SQL, {
      only: savedTables,
      tables: pick(savedTables),
      settings,
    });
    // What the editor's json export would have written.
    d.savedJson = JSON.stringify(saved);

    const currentTables = ['members', 'coupons', 'products'];
    await seedSQL(d, CURRENT_SQL, {
      only: currentTables,
      tables: pick(currentTables),
      settings,
    });
    await d.moveTo(700, 300, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(450);

    // Empty canvas to the right of the diagram, high enough that the menu
    // stays clear of the floating toolbar.
    await d.rightClick(640, 64, { duration: 380 });
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
    await d.moveTo(820, 330, 200);
    await chooser.setFiles({
      name: 'shop-2026-09-01T18_20_00.erd.json',
      mimeType: 'application/json',
      buffer: Buffer.from(d.savedJson),
    });
    await waitDom(d, '.diff-viewer-insert');
    mark('diff open');
    await d.shot('diff');
    const rows = await diffTreeRows(d);
    await d.sleep(1100);

    // Down the list of changes, past the labels so the pointer hides none.
    const row = (name, after) => {
      const from = after ? rows.findIndex(r => r.name === after) : 0;
      const found = rows.slice(from).find(r => r.name === name);
      if (!found) throw new Error(`diff row not found: ${name}`);
      return { x: 168, y: found.y + found.height / 2 };
    };
    const hover = async (p, duration, pause) => {
      await d.moveTo(p.x, p.y, duration);
      await d.sleep(pause);
    };
    await hover(row('coupons'), 420, 650);
    mark('coupons');
    await hover(row('members'), 300, 250);
    await hover(row('phone', 'members'), 300, 400);
    mark('phone');
    await hover(row('price'), 220, 500);
    await hover(row('reviews'), 200, 700);
    mark('reviews');
    await d.shot('hover-reviews');

    // Close on the notice the view opened with (measured now: it slides in).
    const close = await closeButtonBox(d);
    await d.click(close.x, close.y, { duration: 420 });
    mark('closed');
    await d.sleep(200);
    await d.moveTo(close.x - 150, close.y - 170, 260);
    await d.sleep(1150);
    mark('end');
  },
};
