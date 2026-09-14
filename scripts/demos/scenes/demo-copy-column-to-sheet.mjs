/**
 * Copying/Pasting Columns: copy columns out of the editor and paste them into
 * a spreadsheet, where the flags arrive as TRUE/FALSE and NOT NULL/NULL.
 */
import { seedSQL } from '../lib/seed.mjs';
import {
  installSheet,
  keysAt,
  nameCell,
  sheetCell,
  sheetData,
} from './_table-editing-b-helpers.mjs';

// Name, data type, not null, unique, auto increment and comment are shown;
// default is hidden so the copied rows fit the sheet.
const SHOW = 1 | 2 | 4 | 16 | 32 | 64 | 128 | 256;

const SQL = `
CREATE TABLE members (
  id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID',
  email VARCHAR(255) NOT NULL COMMENT 'Login email' UNIQUE,
  nickname VARCHAR(50) NOT NULL COMMENT 'Display name',
  phone VARCHAR(20) NULL COMMENT 'Contact number',
  PRIMARY KEY (id)
) COMMENT 'Registered users';
`;

// The same labels the table shows for the unique and auto increment cells.
const SHEET_COLUMNS = [
  { width: 70 },
  { width: 96 },
  { width: 70 },
  { width: 50 },
  { width: 50 },
  { width: 104 },
];
const SHEET_HEADER = ['Name', 'Type', 'Not Null', 'UQ', 'AI', 'Comment'];

export default {
  name: 'demo-copy-column-to-sheet',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { members: { x: 24, y: 200 } },
      settings: { databaseName: 'shop', show: SHOW },
    });
    await installSheet(d, {
      editorWidth: 480,
      columns: SHEET_COLUMNS,
      cells: [SHEET_HEADER],
      active: [0, 0],
      headerRow: true,
    });
    await d.moveTo(250, 140, 50);
  },
  async scenario(d) {
    await d.sleep(600);

    // Select the four columns and copy them.
    const id = await nameCell(d, 'members', 'id');
    const phone = await nameCell(d, 'members', 'phone');
    await d.click(id.x, id.y, { duration: 800 });
    await d.sleep(400);
    await keysAt(d, 240);
    await d.holding(
      ['Shift'],
      async () => {
        await d.click(phone.x, phone.y, { duration: 500 });
        await d.sleep(400);
      },
      { label: ['⇧', 'click'] }
    );
    await d.sleep(450);
    await d.press('ControlOrMeta+KeyC');
    await d.sleep(700);

    // Paste them under the sheet's header row.
    const a2 = await sheetCell(d, 1, 0);
    await d.click(a2.x + 24, a2.y + a2.height / 2, { duration: 900 });
    await d.sleep(450);
    await keysAt(d, 720);
    await d.press('ControlOrMeta+KeyV');
    await d.sleep(500);
    await d.moveTo(760, 330, 700);

    const rows = (await sheetData(d)).slice(1, 5).map(row => row.join('|'));
    const expected = [
      'id|BIGINT|NOT NULL|FALSE|TRUE|Member ID',
      'email|VARCHAR(255)|NOT NULL|TRUE|FALSE|Login email',
      'nickname|VARCHAR(50)|NOT NULL|FALSE|FALSE|Display name',
      'phone|VARCHAR(20)|NULL|FALSE|FALSE|Contact number',
    ];
    if (rows.join('\n') !== expected.join('\n')) {
      throw new Error(`sheet ended as ${rows.join(' / ')}`);
    }
    await d.sleep(1400);
  },
};
