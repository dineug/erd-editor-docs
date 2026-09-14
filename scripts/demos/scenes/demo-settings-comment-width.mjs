import { seedSQL } from '../lib/seed.mjs';
import { SHOP_SHOW } from './_io-settings-helpers.mjs';

/**
 * Maximum Comment Width: long comments stretch the tables; on the Settings
 * tab the switch is turned on (60px), a width of 120 is typed, and back on
 * the ERD tab the comments are cut to it.
 */

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID, assigned by the database',
  email VARCHAR(255) NOT NULL COMMENT 'Login email, unique across all members',
  nickname VARCHAR(50) NOT NULL COMMENT 'Public name shown next to reviews',
  created_at DATETIME NOT NULL COMMENT 'When the member signed up',
  PRIMARY KEY (id)
) COMMENT 'Registered users';

CREATE TABLE orders (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Order number printed on the receipt',
  member_id BIGINT NOT NULL COMMENT 'The member who placed the order',
  status VARCHAR(20) NOT NULL COMMENT 'PENDING, PAID, SHIPPED or CANCELLED',
  ordered_at DATETIME NOT NULL COMMENT 'When checkout was completed',
  PRIMARY KEY (id)
) COMMENT 'Customer orders';

ALTER TABLE orders ADD CONSTRAINT FK_members_TO_orders FOREIGN KEY (member_id) REFERENCES members (id);
`;

export default {
  name: 'demo-settings-comment-width',
  lossless: true,
  width: 800,
  height: 500,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        members: { x: 40, y: 24 },
        orders: { x: 40, y: 254 },
      },
      settings: { databaseName: 'shop', show: SHOP_SHOW },
    });
    // Above the members table, so the way to the toolbar crosses no table.
    await d.moveTo(660, 40, 0);
  },
  async scenario(d) {
    await d.sleep(600);

    const settings = await d.domBox('[title="Settings"]');
    await d.click(settings.x + settings.width / 2, settings.y + settings.height / 2, {
      duration: 420,
    });
    await d.sleep(600);
    await d.shot('settings');

    const [toggle, input] = await d.page.evaluate(() => {
      const root = window.__erdShadowRoot;
      const input = root.querySelector('input[title="Maximum comment width"]');
      const toggle = input.parentElement.querySelector('button');
      return [toggle, input].map(el => {
        const r = el.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      });
    });
    await d.click(toggle.x + toggle.width / 2, toggle.y + toggle.height / 2, {
      duration: 420,
    });
    await d.sleep(700);
    await d.shot('switched-on');

    await d.click(input.x + input.width - 8, input.y + input.height / 2, {
      duration: 320,
    });
    // Off the input so the value stays readable.
    await d.moveTo(input.x + 70, input.y + 34, 260);
    await d.press('ControlOrMeta+KeyA', { hold: 650 });
    // Long enough for the selection highlight to register before typing.
    await d.sleep(400);
    await d.shot('selected');
    await d.type('120', 170);
    await d.sleep(300);
    await d.press('Enter', { hold: 700 });
    await d.sleep(700);
    await d.shot('value-set');

    const erd = await d.domBox('[title="Entity Relationship Diagram"]');
    await d.click(erd.x + erd.width / 2, erd.y + erd.height / 2, { duration: 420 });
    await d.sleep(300);
    await d.moveTo(640, 330, 380);
    await d.whenDrawn();
    await d.shot('erd');
    await d.sleep(1400);
  },
};
