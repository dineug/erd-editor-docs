import { readSeed, seedSQL } from '../lib/seed.mjs';
import { hoverMenuPath, labelPoint, SHOP_SHOW } from './_io-settings-helpers.mjs';

/**
 * Import and Add: a diagram holding the shop's members and orders keeps
 * them, and Import and Add > Schema SQL brings the catalog tables of another
 * file in below it, laid out by Flow along their relationships, in line with
 * the diagram's left edge, and selected.
 */

const WIDTH = 960;
const HEIGHT = 540;

const SHOP = readSeed('shop.sql');

/**
 * The file added: the shop's catalog, where products take a brand and a
 * category, so Flow stands the two parents in one column and products in
 * the next.
 */
const CATALOG_SQL = `
CREATE TABLE brands (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Product brands';

CREATE TABLE categories (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Product categories';

CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  brand_id BIGINT NOT NULL,
  category_id BIGINT NOT NULL,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) COMMENT 'Catalog items';

ALTER TABLE products ADD CONSTRAINT FK_brands_TO_products FOREIGN KEY (brand_id) REFERENCES brands (id);
ALTER TABLE products ADD CONSTRAINT FK_categories_TO_products FOREIGN KEY (category_id) REFERENCES categories (id);
`;

export default {
  name: 'demo-import-and-add',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    // Warms the layout worker, so the recorded import lands at once.
    await d.page.evaluate(
      sql => document.querySelector('erd-editor').setSchemaSQL(sql, { placement: 'auto' }),
      CATALOG_SQL
    );

    await seedSQL(d, SHOP, {
      only: ['members', 'orders'],
      tables: {
        members: { x: 50, y: 40 },
        orders: { x: 470, y: 40 },
      },
      settings: {
        databaseName: 'shop',
        show: SHOP_SHOW,
        zoomLevel: 0.8,
        originX: 0,
        originY: 0,
      },
    });
    await d.moveTo(620, 330, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    await d.rightClick(420, 230, { duration: 320 });
    await d.sleep(300);
    const item = await hoverMenuPath(d, ['Import and Add', 'Schema SQL'], {
      pause: 250,
      lastPause: 120,
    });
    await d.shot('import-and-add-submenu');

    const p = labelPoint(item);
    const [chooser] = await Promise.all([
      d.page.waitForEvent('filechooser'),
      d.click(p.x, p.y),
    ]);
    await d.shot('picking');
    // The moment a person spends picking the file. The pointer goes right,
    // clear of the block to come.
    await d.moveTo(780, 330, 380);
    await chooser.setFiles({
      name: 'catalog.sql',
      mimeType: 'application/sql',
      buffer: Buffer.from(CATALOG_SQL),
    });
    await d.page.waitForFunction(
      () => JSON.parse(document.querySelector('erd-editor').value).doc.tableIds.length > 2
    );
    await d.whenDrawn();
    await d.shot('added');
    await d.sleep(1800);
  },
};
