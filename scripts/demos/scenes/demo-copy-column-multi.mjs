/**
 * Copying/Pasting Columns: columns pasted while several tables are selected
 * are added to every selected table.
 */
import { seedSQL } from '../lib/seed.mjs';
import { columnNames, nameCell, tableHeader } from './_table-editing-b-helpers.mjs';

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NULL,
  PRIMARY KEY (id)
) COMMENT 'Registered users';

CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  status VARCHAR(20) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Customer orders';

CREATE TABLE products (
  id BIGINT NOT NULL AUTO_INCREMENT,
  name VARCHAR(200) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Catalog items';

ALTER TABLE orders ADD CONSTRAINT FK_members_TO_orders FOREIGN KEY (member_id) REFERENCES members (id);
`;

export default {
  name: 'demo-copy-column-multi',
  width: 900,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        members: { x: 30, y: 6 },
        orders: { x: 30, y: 212 },
        products: { x: 440, y: 212 },
      },
      settings: { databaseName: 'shop' },
    });
    // Keycaps just above the floating toolbar, clear of the grown tables.
    await d.page.evaluate(() =>
      document.documentElement.style.setProperty('--demo-keys-bottom', '64px')
    );
    await d.moveTo(560, 110, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // Copy the two timestamp columns.
    const createdAt = await nameCell(d, 'members', 'created_at');
    const updatedAt = await nameCell(d, 'members', 'updated_at');
    await d.click(createdAt.x, createdAt.y, { duration: 800 });
    await d.sleep(350);
    await d.holding(
      ['Shift'],
      async () => {
        await d.click(updatedAt.x, updatedAt.y, { duration: 450 });
        await d.sleep(400);
      },
      { label: ['⇧', 'click'] }
    );
    await d.sleep(400);
    await d.press('ControlOrMeta+KeyC');
    await d.sleep(700);

    // Select both target tables.
    const orders = await tableHeader(d, 'orders');
    const products = await tableHeader(d, 'products');
    await d.click(orders.x, orders.y, { duration: 800 });
    await d.sleep(450);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.click(products.x, products.y, { duration: 700 });
        await d.sleep(400);
      },
      { label: ['⌘', 'click'] }
    );
    await d.sleep(450);

    // Paste: both tables get the columns.
    await d.press('ControlOrMeta+KeyV');
    await d.sleep(600);
    await d.moveTo(600, 130, 700);

    const expect = {
      members: 'id,email,created_at,updated_at',
      orders: 'id,member_id,status,created_at,updated_at',
      products: 'id,name,price,created_at,updated_at',
    };
    for (const [table, names] of Object.entries(expect)) {
      const actual = (await columnNames(d, table)).join();
      if (actual !== names) throw new Error(`${table} ended as ${actual}`);
    }
    await d.shot('result');
    await d.sleep(1300);
  },
};
