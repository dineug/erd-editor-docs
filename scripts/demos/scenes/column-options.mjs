import { seedSQL } from '../lib/seed.mjs';

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NULL,
  PRIMARY KEY (id)
) COMMENT 'Registered users';
`;

// Show bits: every default cell plus Unique (64) and Auto Increment (16).
const SHOW = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128 | 256;

/** Where the pointer rests between gestures, off the table. */
const PARK = { x: 610, y: 285 };

/** Viewport center of one option cell ('columnNotNull', 'columnUnique', 'columnAutoIncrement'). */
async function optionCell(d, column, cellName) {
  const id = await d.columnId('members', column);
  return d.page.evaluate(
    ([id, cellName]) => {
      const stage = window.__erdStages.canvas;
      const cell = stage.findOne(`#column-${id}`).findOne(`.${cellName}`);
      const r = cell.getClientRect();
      const c = stage.container().getBoundingClientRect();
      return { x: c.left + r.x + r.width / 2, y: c.top + r.y + r.height / 2 };
    },
    [id, cellName]
  );
}

/**
 * Not Null, Unique, Auto Increment: the three toggle cells flip on a
 * double-click, or on Enter while focused.
 */
export default {
  name: 'demo-column-options',
  width: 860,
  height: 420,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { members: { x: 16, y: 22 } },
      settings: { databaseName: 'shop', zoomLevel: 1.4, show: SHOW },
    });
    await d.moveTo(PARK.x, PARK.y, 50);
  },
  async scenario(d) {
    await d.sleep(500);

    // Not Null: a double-click turns N-N into NULL.
    const notNull = await optionCell(d, 'nickname', 'columnNotNull');
    // Pointer travel runs slower while the screencast is on, so these
    // durations are shorter than the moves read on screen.
    await d.dblclick(notNull.x, notNull.y, { duration: 450 });
    await d.sleep(300);
    await d.moveTo(PARK.x, PARK.y, 380);
    await d.sleep(450);
    await d.shot('nickname-null');

    // Unique: focus the cell, Enter lights UQ up.
    const unique = await optionCell(d, 'email', 'columnUnique');
    await d.click(unique.x, unique.y, { duration: 380 });
    await d.sleep(250);
    await d.moveTo(PARK.x, PARK.y, 350);
    await d.press('Enter');
    await d.sleep(750);
    await d.shot('email-unique');

    // Auto Increment: the same on id.
    const autoIncrement = await optionCell(d, 'id', 'columnAutoIncrement');
    await d.click(autoIncrement.x, autoIncrement.y, { duration: 380 });
    await d.sleep(250);
    await d.moveTo(PARK.x, PARK.y, 350);
    await d.press('Enter');
    await d.sleep(1400);
  },
};
