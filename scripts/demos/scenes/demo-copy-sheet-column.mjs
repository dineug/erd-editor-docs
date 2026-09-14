/**
 * Copying/Pasting Columns: rows written in a spreadsheet are copied and pasted
 * onto a table, and YES, 1 and NOT NULL are read as set flags.
 */
import { seedSQL } from '../lib/seed.mjs';
import {
  columnNames,
  installSheet,
  keysAt,
  sheetCell,
  sheetData,
  tableHeader,
} from './_table-editing-b-helpers.mjs';

// Name, data type, not null, unique, auto increment and comment are shown;
// default is hidden so the rows fit the sheet.
const SHOW = 1 | 2 | 4 | 16 | 32 | 64 | 128 | 256;

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID',
  email VARCHAR(255) NOT NULL COMMENT 'Login email' UNIQUE,
  nickname VARCHAR(50) NOT NULL COMMENT 'Display name',
  PRIMARY KEY (id)
) COMMENT 'Registered users';
`;

const SHEET_COLUMNS = [
  { width: 72 },
  { width: 94 },
  { width: 70 },
  { width: 50 },
  { width: 50 },
  { width: 104 },
];
const SHEET_CELLS = [
  ['Name', 'Type', 'Not Null', 'UQ', 'AI', 'Comment'],
  ['phone', 'VARCHAR(20)', '1', '', 'FALSE', 'Contact number'],
  ['birth_date', 'DATE', 'NULL', 'FALSE', 'FALSE', 'Date of birth'],
  ['point', 'INT', 'NOT NULL', 'N', 'FALSE', 'Reward points'],
];

/** Bits of a column's options: auto increment 1, primary key 2, unique 4, not null 8. */
const UNIQUE = 4;
const NOT_NULL = 8;

export default {
  name: 'demo-copy-sheet-column',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { members: { x: 24, y: 175 } },
      settings: { databaseName: 'shop', show: SHOW },
    });
    await installSheet(d, {
      editorWidth: 480,
      columns: SHEET_COLUMNS,
      cells: SHEET_CELLS,
      active: [0, 0],
      headerRow: true,
    });
    await d.moveTo(780, 330, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // Mark phone as unique.
    const d2 = await sheetCell(d, 1, 3);
    await d.click(d2.x + d2.width / 2, d2.y + d2.height / 2, { duration: 800 });
    await d.sleep(200);
    // Off the cell, so the typed value stays readable.
    await d.moveTo(d2.x + d2.width / 2 + 24, d2.y + 120, 400);
    await d.type('YES', 110);
    await d.sleep(300);
    await d.press('Enter', { badge: false });
    await d.sleep(400);

    // Copy the three rows.
    const a2 = await sheetCell(d, 1, 0);
    const f4 = await sheetCell(d, 3, 5);
    await d.moveTo(a2.x + 20, a2.y + a2.height / 2, 700);
    await d.sleep(200);
    await d.drag(
      { x: a2.x + 20, y: a2.y + a2.height / 2 },
      { x: f4.x + 40, y: f4.y + f4.height / 2 },
      { duration: 900, holdBefore: 120, holdAfter: 200 }
    );
    await d.sleep(450);
    await keysAt(d, 720);
    await d.press('ControlOrMeta+KeyC');
    await d.sleep(600);

    // Paste onto the selected table.
    const header = await tableHeader(d, 'members');
    await d.click(header.x, header.y, { duration: 900 });
    await d.sleep(400);
    await keysAt(d, 240);
    await d.press('ControlOrMeta+KeyV');
    await d.sleep(600);
    await d.moveTo(230, 130, 600);

    const names = await columnNames(d, 'members');
    if (names.join() !== 'id,email,nickname,phone,birth_date,point') {
      throw new Error(`members ended as ${names}`);
    }
    const doc = await d.value();
    const options = Object.fromEntries(
      Object.values(doc.collections.tableColumnEntities).map(c => [c.name, c.options])
    );
    const flags = name => [options[name] & NOT_NULL, options[name] & UNIQUE].map(Boolean).join();
    if (
      flags('phone') !== 'true,true' ||
      flags('birth_date') !== 'false,false' ||
      flags('point') !== 'true,false'
    ) {
      throw new Error(`flags ${JSON.stringify(options)} sheet ${JSON.stringify((await sheetData(d)).slice(0, 4))}`);
    }
    await d.sleep(1100);
  },
};
