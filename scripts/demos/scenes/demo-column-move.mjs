/**
 * Rearranging and Moving Columns: focus a row, drag the handle beside it to
 * reorder the column inside its table, then drag another row's handle into
 * another table.
 */
import { center } from '../lib/recorder.mjs';
import { seedSQL } from '../lib/seed.mjs';
import { columnNames } from './_table-editing-b-helpers.mjs';

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

/**
 * Where the pointer rests between gestures: bare canvas left of addresses,
 * clear of the relationship line and of the floating toolbar.
 */
const PARK = { x: 280, y: 380 };

/**
 * A point a little into a column's name cell. The row's own box takes in the
 * drag handle while the row is focused, so the name cell is measured instead.
 */
async function nameCell(d, table, column, dx = 14) {
  const id = await d.columnId(table, column);
  const box = await d.page.evaluate(id => {
    const stage = window.__erdStages.canvas;
    const cell = stage.findOne(`#column-${id}`)?.findOne('.columnName');
    if (!cell) return null;
    const r = cell.getClientRect();
    const c = stage.container().getBoundingClientRect();
    return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
  }, id);
  if (!box) throw new Error(`no name cell for ${table}.${column}`);
  return { x: box.x + dx, y: box.y + box.height / 2 };
}

/** The centre of the drag handle, which only the focused row has. */
async function handle(d) {
  const box = await d.nodeBox('.column-drag-handle');
  if (!box) throw new Error('no drag handle beside the focused row');
  return center(box);
}

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
    await d.moveTo(PARK.x, PARK.y, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // Reorder: focus created_at, then drag its handle down below nickname.
    const createdAt = await nameCell(d, 'members', 'created_at');
    await d.click(createdAt.x, createdAt.y, { duration: 850 });
    await d.sleep(600);
    const grip = await handle(d);
    await d.moveTo(grip.x, grip.y, 500);
    await d.sleep(350);
    await d.shot('hover');
    const nickname = await nameCell(d, 'members', 'nickname');
    await d.drag(grip, { x: grip.x, y: nickname.y + 3 }, {
      duration: 800,
      holdBefore: 180,
      holdAfter: 350,
    });
    await d.shot('reordered');
    await d.sleep(750);

    // Move: focus zip_code, then drag its handle into addresses, onto line1.
    const zipCode = await nameCell(d, 'members', 'zip_code');
    await d.click(zipCode.x, zipCode.y, { duration: 650 });
    await d.sleep(400);
    const zipGrip = await handle(d);
    await d.moveTo(zipGrip.x, zipGrip.y, 450);
    await d.sleep(300);
    const line1 = await nameCell(d, 'addresses', 'line1');
    await d.drag(zipGrip, line1, {
      duration: 1300,
      holdBefore: 180,
      holdAfter: 400,
    });
    await d.shot('moved');
    await d.sleep(450);
    await d.moveTo(PARK.x, PARK.y, 700);

    const members = await columnNames(d, 'members');
    const addresses = await columnNames(d, 'addresses');
    if (members.join() !== 'id,email,nickname,created_at') {
      throw new Error(`members ended as ${members}`);
    }
    if (addresses.join() !== 'id,member_id,zip_code,line1') {
      throw new Error(`addresses ended as ${addresses}`);
    }
    await d.shot('result');
    await d.sleep(1400);
  },
};
