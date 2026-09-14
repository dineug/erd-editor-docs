import { seedSQL } from '../lib/seed.mjs';
import {
  hoverMenuPath,
  labelPoint,
  SHOP_SHOW,
  seedShopRing,
} from './_io-settings-helpers.mjs';

/**
 * Importing JSON: a draft document is replaced by a saved shop diagram,
 * which brings its own settings (database name, zoom and view) with it.
 */

const DRAFT_SQL = `
CREATE TABLE carts (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  created_at DATETIME NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Shopping carts';

CREATE TABLE cart_items (
  id BIGINT NOT NULL AUTO_INCREMENT,
  cart_id BIGINT NOT NULL,
  product_id BIGINT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  PRIMARY KEY (id)
) COMMENT 'Cart lines';

ALTER TABLE cart_items ADD CONSTRAINT FK_carts_TO_cart_items FOREIGN KEY (cart_id) REFERENCES carts (id);
`;

const WIDTH = 960;
const HEIGHT = 540;

export default {
  name: 'demo-import-json',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    // The file being imported: part of the shop diagram, saved at 80%.
    const shop = await seedShopRing(d, { width: WIDTH });
    d.shopJson = JSON.stringify(shop);

    // The document open before the import: a small draft.
    await seedSQL(d, DRAFT_SQL, {
      tables: {
        carts: { x: 330, y: 90 },
        cart_items: { x: 330, y: 290 },
      },
      settings: { databaseName: 'draft', show: SHOP_SHOW },
    });
    // Off the draft's relationship, which highlights under a hovering pointer.
    await d.moveTo(290, 190, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    await d.rightClick(150, 70, { duration: 320 });
    await d.sleep(300);
    const json = await hoverMenuPath(d, ['Import', 'json'], { pause: 250, lastPause: 120 });
    await d.shot('import-submenu');

    // hoverMenuPath leaves the pointer on the label point: no travel here.
    const p = labelPoint(json);
    const [chooser] = await Promise.all([
      d.page.waitForEvent('filechooser'),
      d.click(p.x, p.y),
    ]);
    // The moment a person spends picking the file. The pointer stays put: it
    // rests in a gap between tables both in the draft and in the diagram
    // that replaces it, where moving it anywhere would cross a table.
    await d.sleep(450);
    await chooser.setFiles({
      name: 'shop-2026-09-14T10_30_00.erd.json',
      mimeType: 'application/json',
      buffer: Buffer.from(d.shopJson),
    });
    await d.whenDrawn();
    await d.shot('imported');
    await d.sleep(1500);
  },
};
