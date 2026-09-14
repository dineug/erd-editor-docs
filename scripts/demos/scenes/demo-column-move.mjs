/**
 * Rearranging and Moving Columns: drag a row to reorder it inside its table,
 * then drag a row into another table.
 */
import { seedSQL } from '../lib/seed.mjs';
import { columnNames, nameCell } from './_table-editing-b-helpers.mjs';

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Joined at',
  email VARCHAR(255) NOT NULL COMMENT 'Login email',
  nickname VARCHAR(50) NOT NULL COMMENT 'Display name',
  zip_code VARCHAR(10) NOT NULL,
  PRIMARY KEY (id)
) COMMENT 'Registered users';

CREATE TABLE addresses (
  id BIGINT NOT NULL AUTO_INCREMENT,
  member_id BIGINT NOT NULL,
  line1 VARCHAR(255) NOT NULL COMMENT 'Street address',
  PRIMARY KEY (id)
) COMMENT 'Shipping addresses';

ALTER TABLE addresses ADD CONSTRAINT FK_members_TO_addresses FOREIGN KEY (member_id) REFERENCES members (id);
`;

export default {
  name: 'demo-column-move',
  width: 860,
  height: 500,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: {
        members: { x: 40, y: 40 },
        addresses: { x: 400, y: 250 },
      },
      settings: { databaseName: 'shop' },
    });
    await d.moveTo(700, 470, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // Reorder: created_at goes below nickname.
    const createdAt = await nameCell(d, 'members', 'created_at');
    const nickname = await nameCell(d, 'members', 'nickname');
    await d.moveTo(createdAt.x, createdAt.y, 850);
    await d.sleep(250);
    await d.drag(createdAt, { x: nickname.x + 4, y: nickname.y + 3 }, {
      duration: 800,
      holdBefore: 180,
      holdAfter: 350,
    });
    await d.sleep(750);

    // Move: zip_code leaves members for addresses, above line1.
    const zipCode = await nameCell(d, 'members', 'zip_code');
    await d.moveTo(zipCode.x, zipCode.y, 600);
    await d.sleep(250);
    const line1 = await nameCell(d, 'addresses', 'line1');
    await d.drag(zipCode, { x: line1.x, y: line1.y }, {
      duration: 1300,
      holdBefore: 180,
      holdAfter: 400,
    });
    await d.sleep(450);
    await d.moveTo(700, 470, 700);

    const members = await columnNames(d, 'members');
    const addresses = await columnNames(d, 'addresses');
    if (members.join() !== 'id,email,nickname,created_at') {
      throw new Error(`members ended as ${members}`);
    }
    if (addresses.join() !== 'id,member_id,zip_code,line1') {
      throw new Error(`addresses ended as ${addresses}`);
    }
    await d.sleep(1400);
  },
};
