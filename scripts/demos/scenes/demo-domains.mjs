/**
 * Domains: View Option ▸ Domain gives every row a Domain cell after its
 * DataType. Enter on payments.PAY_AMT's empty one opens the picker (None,
 * then every domain); typing "amo" narrows it to Amount, and the pick links
 * the domain and takes its type, DECIMAL(8,2) becoming DECIMAL(10,2). On the
 * Dictionary tab, Amount's Data Type changes to DECIMAL(12,2), and back on
 * the diagram the linked column has followed it. Typing another type into
 * the column then unlinks it: the Domain cell shows its placeholder again.
 */
import { seedSQL } from '../lib/seed.mjs';
import { cellBox, hoverMenuPath, labelPoint } from './_io-settings-helpers.mjs';
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
  PAY_AMT DECIMAL(8,2) NOT NULL,
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

// Logical name and domain per column; PAY_AMT starts with no domain.
const COLUMNS = {
  'orders.ORD_NO': ['Order Number', 'dom-id'],
  'orders.MBR_NO': ['Member Number', 'dom-id'],
  'orders.ORD_STAT': ['Order Status', 'dom-code'],
  'payments.PAY_NO': ['Payment Number', 'dom-id'],
  'payments.ORD_NO': ['Order Number', 'dom-id'],
  'payments.PAY_AMT': ['Payment Amount', ''],
};

// ColumnOption.nameDerived: the physical names came from the logical ones.
const NAME_DERIVED = 16;
// DataType, PK, NotNull, Relationship; Domain (8192) is left off for the menu.
const SHOW = 4 | 32 | 128 | 256;

// Bare canvas right of the tables, below the minimap, off every connector.
const PARK = { x: 640, y: 300 };
// The canvas menu opens here, so its View Option submenu leaves the tables
// on the left in sight as they gain their Domain cells.
const MENU = { x: 500, y: 64 };
// Where the clip opens: near the menu, so the right-click needs little travel.
const START = { x: 580, y: 150 };

/** Viewport box of a cell of the Dictionary grid, by row and column widths. */
async function gridCell(d, row, widths, col) {
  const s = await waitDom(d, '.dictionary .dineug-grid-scroller');
  // The 28px column header, then 28px rows; the row numbers are 40px wide.
  const x = s.x + 40 + widths.slice(0, col).reduce((a, b) => a + b, 0);
  return { x, y: s.y + 28 + row * 28, width: widths[col], height: 28 };
}

// Domains sheet: Domain, Category, Data Type, Description.
const DOMAIN_WIDTHS = [160, 120, 160, 280];

export default {
  name: 'demo-domains',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      tables: { orders: { x: 120, y: 50 }, payments: { x: 120, y: 220 } },
      settings: { databaseName: 'shop', show: SHOW },
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        tableEntities[byName.get('orders')].logicalName = 'Order';
        tableEntities[byName.get('payments')].logicalName = 'Payment';
        for (const [table, id] of byName) {
          for (const columnId of tableEntities[id].columnIds) {
            const column = tableColumnEntities[columnId];
            const [logicalName, domainId] = COLUMNS[`${table}.${column.name}`];
            column.logicalName = logicalName;
            if (domainId) column.domainId = domainId;
            column.options |= NAME_DERIVED;
          }
        }
        doc.collections.domainEntities = DOMAINS;
        doc.collections.wordEntities = WORDS;
        doc.collections.termEntities = TERMS;
      },
    });
    // Keycaps right of the tables and the domain picker under PAY_AMT.
    await d.page.evaluate(() => {
      document.getElementById('demo-keys').style.left = '700px';
    });
    await d.moveTo(START.x, START.y, 0);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(400);

    // View Option ▸ Domain: a Domain cell after every DataType.
    await d.rightClick(MENU.x, MENU.y, { duration: 350 });
    await d.sleep(250);
    const item = await hoverMenuPath(d, ['View Option', 'Domain'], { pause: 220, lastPause: 380 });
    const p = labelPoint(item);
    await d.click(p.x, p.y, { duration: 1 });
    mark('domain on');
    await d.whenDrawn();
    await d.shot('clicked-domain');
    await d.sleep(700);
    await d.press('Escape', { hold: 500 });
    await d.sleep(300);
    await d.shot('domain-cells');

    // The picker on PAY_AMT's empty Domain cell, narrowed to Amount.
    const domain = await cellBox(d, 'payments', 'PAY_AMT', 'columnDomain');
    await d.click(domain.x + 22, domain.y + domain.height / 2, { duration: 600 });
    await d.sleep(200);
    await d.press('Enter', { hold: 500 });
    await waitDom(d, '.edit-overlay .domain-hint-item');
    // Off the list, below and left of it, so its rows read clear.
    await d.moveTo(domain.x - 90, domain.y + 90, 350);
    await d.sleep(500);
    await d.shot('picker');
    await d.type('amo', 130);
    await d.sleep(500);
    await d.shot('narrowed');
    await d.press('Enter', { hold: 500 });
    mark('linked');
    await d.whenDrawn();
    await d.sleep(800);
    await d.shot('linked');

    // Amount's Data Type on the Domains sheet.
    await clickDom(d, tabSelector('Dictionary'), { duration: 650 });
    mark('dictionary');
    const type = await gridCell(d, 3, DOMAIN_WIDTHS, 2);
    await d.sleep(250);
    // On the cell's right end, clear of the type typed at its left.
    await d.click(type.x + type.width - 24, type.y + type.height / 2, { duration: 550 });
    await d.sleep(150);
    await d.type('DECIMAL(12,2)', 50);
    await d.sleep(300);
    await d.shot('typed');
    await d.press('Enter', { hold: 500 });
    await d.sleep(600);
    await d.shot('dictionary-edited');

    // Back on the diagram, PAY_AMT has followed its domain.
    await clickDom(d, tabSelector('Entity Relationship Diagram'), { duration: 650 });
    mark('erd');
    await d.whenDrawn();
    // Round orders, not across it, whose header would light up.
    await canvasSafeMoveTo(d, PARK, 500);
    await d.sleep(800);
    await d.shot('followed');

    // A type of its own unlinks the column.
    const dataType = await cellBox(d, 'payments', 'PAY_AMT', 'columnDataType');
    await d.dblclick(dataType.x + 30, dataType.y + dataType.height / 2, { duration: 600 });
    await d.sleep(200);
    await d.moveTo(dataType.x + 30, dataType.y + 100, 300);
    await d.press('ControlOrMeta+KeyA', { badge: false });
    await d.sleep(150);
    // In one input: "NUMERIC(12,2)" is past a type name, so no hint list
    // flickers up as it would on each letter typed.
    await d.page.keyboard.insertText('NUMERIC(12,2)');
    await d.sleep(600);
    await d.shot('retyped');
    await d.press('Enter', { hold: 500 });
    mark('unlinked');
    await d.whenDrawn();
    await d.sleep(1300);
    await d.shot('unlinked');
  },
};
