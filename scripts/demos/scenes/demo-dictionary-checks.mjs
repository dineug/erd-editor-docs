/**
 * The Checks sheet: in Logical Names, orders' "Customer Num" is drawn red (a
 * forbidden word, Num for Number, and a synonym, Customer for Member) and
 * "Order Stat" amber (Stat is no registered word). On the Dictionary tab the
 * Checks count reads 3 in red; the Checks sheet lists the three. A double
 * click on the Forbidden word row goes back to the diagram with Customer
 * Num's cell focused, where retyping it as "Member Number" clears its marks,
 * and the Checks count drops to 1.
 */
import { seedSQL } from '../lib/seed.mjs';
import { canvasSafeMoveTo, clickDom, tabSelector, timer, waitDom } from './_vsc-helpers.mjs';

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

// Logical name and domain per column: two of orders' names break the words.
const COLUMNS = {
  'orders.ORD_NO': ['Order Number', 'dom-id'],
  'orders.MBR_NO': ['Customer Num', 'dom-id'],
  'orders.ORD_STAT': ['Order Stat', 'dom-code'],
  'payments.PAY_NO': ['Payment Number', 'dom-id'],
  'payments.ORD_NO': ['Order Number', 'dom-id'],
  'payments.PAY_AMT': ['Payment Amount', 'dom-amount'],
};

// DataType, PK, NotNull, Relationship.
const SHOW = 4 | 32 | 128 | 256;

// Bare canvas between the tables, off the connector.
const PARK = { x: 380, y: 400 };

// The sheet buttons above the grid, in order: Domains, Words, Terms, Checks.
const SHEET_BUTTONS = '.dictionary [role="group"] button';
const CHECKS = 3;

/** Resolves once the Dictionary tab has given way to the diagram. */
async function waitDiagram(d, timeout = 3000) {
  const until = Date.now() + timeout;
  while (await d.domBox('.dictionary')) {
    if (Date.now() > until) throw new Error('the Dictionary tab never closed');
    await d.sleep(50);
  }
}

/** Viewport point inside a cell of the Dictionary grid, by row and column widths. */
async function gridPoint(d, row, widths, col, dx = 0.5) {
  const s = await waitDom(d, '.dictionary .dineug-grid-scroller');
  // The 28px column header, then 28px rows; the row numbers are 40px wide.
  const x = s.x + 40 + widths.slice(0, col).reduce((a, b) => a + b, 0);
  return { x: x + widths[col] * dx, y: s.y + 28 + row * 28 + 14 };
}

// Checks sheet: Type, Target, Detail.
const CHECK_WIDTHS = [180, 240, 360];

export default {
  name: 'demo-dictionary-checks',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      // Customer Num's row inside the middle half of the canvas both ways, so
      // the jump back to it leaves the diagram where it was.
      tables: { orders: { x: 160, y: 100 }, payments: { x: 520, y: 270 } },
      settings: { databaseName: 'shop', show: SHOW, nameViewMode: 'logical' },
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        tableEntities[byName.get('orders')].logicalName = 'Order';
        tableEntities[byName.get('payments')].logicalName = 'Payment';
        for (const [table, id] of byName) {
          for (const columnId of tableEntities[id].columnIds) {
            const column = tableColumnEntities[columnId];
            const [logicalName, domainId] = COLUMNS[`${table}.${column.name}`];
            column.logicalName = logicalName;
            column.domainId = domainId;
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
    // The marked names on the canvas.
    await d.sleep(1000);
    await d.shot('marks');

    // The Checks count on the sheet bar, then the Checks sheet.
    await clickDom(d, tabSelector('Dictionary'), { duration: 650 });
    mark('dictionary');
    await waitDom(d, '.dictionary .dineug-grid-scroller');
    await d.sleep(500);
    await clickDom(d, SHEET_BUTTONS, { index: CHECKS, duration: 600 });
    mark('checks');
    await d.sleep(300);
    // Down off the bar, clear of the rows.
    const off = await gridPoint(d, 5, CHECK_WIDTHS, 1);
    await d.moveTo(off.x, off.y, 400);
    await d.sleep(1000);
    await d.shot('checks');

    // The Forbidden word row goes to its column on the diagram. Pressed past
    // its Detail text, a point that is bare canvas once the diagram is back.
    const forbidden = await gridPoint(d, 1, CHECK_WIDTHS, 2, 0.32);
    await d.dblclick(forbidden.x, forbidden.y, { duration: 550 });
    mark('goto');
    await waitDiagram(d);
    await d.whenDrawn();
    // Off the connector on the way down.
    await canvasSafeMoveTo(d, PARK, 450);
    await d.sleep(700);
    await d.shot('goto');

    // Retyped with the standard words, it loses its marks.
    await d.press('Enter', { hold: 500 });
    await d.press('ControlOrMeta+KeyA', { badge: false });
    await d.sleep(150);
    await d.type('Member Number', 75);
    await d.sleep(300);
    await d.shot('typed');
    await d.press('Enter', { hold: 500 });
    mark('fixed');
    await d.whenDrawn();
    await d.sleep(900);
    await d.shot('fixed');

    // One check left.
    await clickDom(d, tabSelector('Dictionary'), { duration: 650 });
    mark('dictionary again');
    await waitDom(d, '.dictionary .dineug-grid-scroller');
    await d.moveTo(off.x, off.y, 500);
    await d.sleep(1300);
    await d.shot('one-left');
  },
};
