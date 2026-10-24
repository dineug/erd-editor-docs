/**
 * Derive Physical Names Again: on the Words sheet, Number's abbreviation
 * changes from NO to NUM. Back on the diagram (Both Names) the physical
 * names still read MBR_NO and PAY_NO, since editing a word renames nothing.
 * The canvas menu's Derive Physical Names Again derives every name with a
 * logical name again: MBR_NUM and PAY_NUM, while ORD_NO, which the term
 * Order Number gives, stays. The tables have no logical names, so the
 * document-wide derive leaves their names alone.
 */
import { seedSQL } from '../lib/seed.mjs';
import { labelPoint } from './_io-settings-helpers.mjs';
import {
  canvasSafeMoveTo,
  clickDom,
  tabSelector,
  timer,
  waitDom,
  waitMenuItem,
} from './_vsc-helpers.mjs';

const SQL = `
CREATE TABLE orders (
  ORD_NO BIGINT NOT NULL AUTO_INCREMENT,
  MBR_NO BIGINT NOT NULL,
  ORD_STAT VARCHAR(20) NOT NULL,
  PRIMARY KEY (ORD_NO)
);
CREATE TABLE payments (
  PAY_NO BIGINT NOT NULL AUTO_INCREMENT,
  ORD_NO BIGINT NOT NULL,
  PAY_AMT DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (PAY_NO)
);
ALTER TABLE payments ADD CONSTRAINT FK_orders_TO_payments FOREIGN KEY (ORD_NO) REFERENCES orders (ORD_NO);
`;

// The dictionaries as the file stores them: a field list and its rows.
const DOMAINS = {
  fields: ['id', 'name', 'category', 'dataType', 'description'],
  rows: [
    ['dom-id', 'ID', 'Number', 'BIGINT', ''],
    ['dom-code', 'Code', 'Text', 'VARCHAR(20)', ''],
    ['dom-name', 'Name', 'Text', 'VARCHAR(100)', ''],
    ['dom-amount', 'Amount', 'Number', 'DECIMAL(10,2)', ''],
    ['dom-datetime', 'Date Time', 'Date', 'DATETIME', ''],
  ],
};
const WORDS = {
  fields: ['id', 'name', 'abbreviation', 'englishName', 'description', 'synonyms', 'forbiddenWords'],
  rows: [
    ['w-order', 'Order', 'ORD', '', '', '', ''],
    ['w-number', 'Number', 'NO', '', '', '', 'Num'],
    ['w-status', 'Status', 'STAT', '', '', '', ''],
    ['w-amount', 'Amount', 'AMT', '', '', '', ''],
    ['w-date', 'Date', 'DT', '', '', '', ''],
    ['w-payment', 'Payment', 'PAY', '', '', '', ''],
    ['w-member', 'Member', 'MBR', '', '', 'Customer', ''],
    ['w-name', 'Name', 'NM', '', '', '', ''],
  ],
};
const TERMS = {
  fields: ['id', 'name', 'physicalName', 'domainId', 'description', 'synonyms'],
  rows: [
    ['t-order-number', 'Order Number', 'ORD_NO', 'dom-id', '', ''],
    ['t-order-status', 'Order Status', 'ORD_STAT', 'dom-code', '', ''],
    ['t-order-amount', 'Order Amount', 'ORD_AMT', 'dom-amount', '', ''],
    ['t-member-name', 'Member Name', 'MBR_NM', 'dom-name', '', ''],
  ],
};

// Logical name and domain per column. Order Number and Order Status are
// terms; the other names are composed from the words' abbreviations.
const COLUMNS = {
  'orders.ORD_NO': ['Order Number', 'dom-id'],
  'orders.MBR_NO': ['Member Number', 'dom-id'],
  'orders.ORD_STAT': ['Order Status', 'dom-code'],
  'payments.PAY_NO': ['Payment Number', 'dom-id'],
  'payments.ORD_NO': ['Order Number', 'dom-id'],
  'payments.PAY_AMT': ['Payment Amount', 'dom-amount'],
};

// ColumnOption.nameDerived: the physical names came from the logical ones.
const NAME_DERIVED = 16;
// DataType, PK, NotNull, Relationship.
const SHOW = 4 | 32 | 128 | 256;

// Bare canvas right of the tables, below the minimap.
const PARK = { x: 640, y: 330 };
// The canvas menu opens here, right of the tables, leaving them in sight.
const MENU = { x: 560, y: 70 };

// The sheet buttons above the grid, in order: Domains, Words, Terms, Checks.
const SHEET_BUTTONS = '.dictionary [role="group"] button';
const WORDS_SHEET = 1;

/** Viewport box of a cell of the Dictionary grid, by row and column widths. */
async function gridCell(d, row, widths, col) {
  const s = await waitDom(d, '.dictionary .dineug-grid-scroller');
  // The 28px column header, then 28px rows; the row numbers are 40px wide.
  const x = s.x + 40 + widths.slice(0, col).reduce((a, b) => a + b, 0);
  return { x, y: s.y + 28 + row * 28, width: widths[col], height: 28 };
}

// Words sheet: Word, Abbreviation, English Name, Description, Synonyms, Forbidden Words.
const WORD_WIDTHS = [160, 120, 160, 280, 160, 160];

/** Resolves once the Dictionary tab has given way to the diagram. */
async function waitDiagram(d, timeout = 3000) {
  const until = Date.now() + timeout;
  while (await d.domBox('.dictionary')) {
    if (Date.now() > until) throw new Error('the Dictionary tab never closed');
    await d.sleep(50);
  }
}

export default {
  name: 'demo-derive-physical-names',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { orders: { x: 120, y: 60 }, payments: { x: 120, y: 240 } },
      settings: { databaseName: 'shop', show: SHOW, nameViewMode: 'both' },
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        for (const [table, id] of byName) {
          for (const columnId of tableEntities[id].columnIds) {
            const column = tableColumnEntities[columnId];
            const [logicalName, domainId] = COLUMNS[`${table}.${column.name}`];
            column.logicalName = logicalName;
            column.domainId = domainId;
            column.options |= NAME_DERIVED;
          }
        }
        doc.collections.domainEntities = DOMAINS;
        doc.collections.wordEntities = WORDS;
        doc.collections.termEntities = TERMS;
      },
    });
    await d.moveTo(PARK.x, PARK.y, 0);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(600);

    // Number's abbreviation, NO to NUM, on the Words sheet.
    await clickDom(d, tabSelector('Dictionary'), { duration: 650 });
    mark('dictionary');
    await waitDom(d, '.dictionary .dineug-grid-scroller');
    await d.sleep(250);
    await clickDom(d, SHEET_BUTTONS, { index: WORDS_SHEET, duration: 500 });
    mark('words');
    await d.sleep(350);
    const abbreviation = await gridCell(d, 1, WORD_WIDTHS, 1);
    // On the cell's right end, clear of the abbreviation typed at its left.
    await d.click(abbreviation.x + abbreviation.width - 24, abbreviation.y + 14, {
      duration: 550,
    });
    await d.sleep(200);
    await d.type('NUM', 120);
    await d.sleep(300);
    await d.shot('typed');
    await d.press('Enter', { hold: 500 });
    await d.sleep(500);
    await d.shot('word-edited');

    // The physical names have not changed.
    await clickDom(d, tabSelector('Entity Relationship Diagram'), { duration: 650 });
    mark('erd');
    await waitDiagram(d);
    await d.whenDrawn();
    // Round orders, not across it, whose header would light up.
    await canvasSafeMoveTo(d, PARK, 500);
    await d.sleep(800);
    await d.shot('unchanged');

    // Derive Physical Names Again, for the whole document.
    await d.rightClick(MENU.x, MENU.y, { duration: 450 });
    await d.sleep(300);
    const item = await waitMenuItem(d, 'Derive Physical Names Again');
    // Down the menu's left padding, so the submenus above do not flash open.
    await d.moveTo(item.x - 4, item.y + item.height / 2, 300);
    const p = labelPoint(item);
    await d.moveTo(p.x, p.y, 220);
    await d.sleep(450);
    await d.click(p.x, p.y, { duration: 1 });
    mark('derived');
    await d.whenDrawn();
    await d.moveTo(PARK.x, PARK.y, 450);
    await d.sleep(1500);
    await d.shot('derived');
  },
};
