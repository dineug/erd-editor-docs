/**
 * Writing logical names in the view of both: a new column's logical name
 * picked from the term list under the cell fills its name, type and domain,
 * and one made of registered words gets its name from their abbreviations as
 * the editor closes.
 */
import { seedSQL } from '../lib/seed.mjs';
import { timeline } from './_misc-helpers.mjs';

/** Two tables named the way the dictionaries below would name them. */
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

// The dictionaries as a file stores them, one header and its rows each
// (field lists as in erd-editor's e2e/support/schema.ts).
const WORDS = {
  fields: ['id', 'name', 'abbreviation', 'englishName', 'description', 'synonyms', 'forbiddenWords'],
  rows: [
    ['word-order', 'Order', 'ORD', 'Order', '', '', ''],
    ['word-number', 'Number', 'NO', 'Number', '', '', ''],
    ['word-date', 'Date', 'DT', 'Date', '', '', ''],
    ['word-status', 'Status', 'STAT', 'Status', '', '', ''],
    ['word-amount', 'Amount', 'AMT', 'Amount', '', '', ''],
    ['word-payment', 'Payment', 'PAY', 'Payment', '', '', ''],
    ['word-member', 'Member', 'MBR', 'Member', '', '', ''],
  ],
};
const DOMAINS = {
  fields: ['id', 'name', 'category', 'dataType', 'description'],
  rows: [
    ['domain-id', 'ID', 'Number', 'BIGINT', ''],
    ['domain-code', 'Code', 'Text', 'VARCHAR(20)', ''],
    ['domain-amount', 'Amount', 'Number', 'DECIMAL(10,2)', ''],
  ],
};
// No term is named Order Date, so that name comes from the words alone.
const TERMS = {
  fields: ['id', 'name', 'physicalName', 'domainId', 'description', 'synonyms'],
  rows: [
    ['term-order-number', 'Order Number', 'ORD_NO', 'domain-id', '', ''],
    ['term-order-status', 'Order Status', 'ORD_STAT', 'domain-code', '', ''],
    ['term-order-amount', 'Order Amount', 'ORD_AMT', 'domain-amount', '', ''],
  ],
};

/** Logical name and domain by table, then by column. */
const LOGICAL = {
  orders: {
    '': ['Order'],
    ORD_NO: ['Order Number', 'domain-id'],
    MBR_NO: ['Member Number', 'domain-id'],
    ORD_STAT: ['Order Status', 'domain-code'],
  },
  payments: {
    '': ['Payment'],
    PAY_NO: ['Payment Number', 'domain-id'],
    ORD_NO: ['Order Number', 'domain-id'],
    PAY_AMT: ['Payment Amount', 'domain-amount'],
  },
};

const NAME_DERIVED = 16; // ColumnOption.nameDerived

export default {
  name: 'demo-logical-names',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      // orders gains two rows, and the term list opens under the first of
      // them, so payments stands lower right, clear of both.
      tables: {
        orders: { x: 50, y: 60 },
        payments: { x: 500, y: 270 },
      },
      settings: {
        databaseName: 'shop',
        // Types, keys, Not Null and Domain, so the domain has its own cell.
        show: 4 | 32 | 128 | 256 | 8192,
        // Opens in the view of both: the logical name and the name side by side.
        nameViewMode: 'both',
      },
      patch(doc, byName) {
        const { tableEntities, tableColumnEntities } = doc.collections;
        for (const [table, names] of Object.entries(LOGICAL)) {
          const entity = tableEntities[byName.get(table)];
          entity.logicalName = names[''][0];
          for (const id of entity.columnIds) {
            const column = tableColumnEntities[id];
            const [logicalName, domainId] = names[column.name];
            column.logicalName = logicalName;
            column.domainId = domainId;
            column.options |= NAME_DERIVED;
          }
        }
        doc.collections.wordEntities = WORDS;
        doc.collections.domainEntities = DOMAINS;
        doc.collections.termEntities = TERMS;
      },
    });
    // Below orders, so the way up to its last row crosses no other row.
    await d.moveTo(250, 330, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(700);
    await d.shot('both');

    // Focus Order Status, then a new row below it. Alt + Enter focuses the
    // new row's name, and Shift + Tab steps back onto its logical name and
    // opens the editor there.
    mark('focus');
    const status = await cell(d, 'orders', 'ORD_STAT', 'columnLogicalName');
    await d.click(status.x + 30, status.y + status.height / 2, { duration: 800 });
    await d.sleep(250);
    // Down off the table onto bare canvas, so no row is lit while typing.
    await d.moveTo(250, 330, 450);
    await d.sleep(150);
    await d.press('Alt+Enter');
    await d.sleep(800);
    await d.shot('new-row');
    await d.press('Shift+Tab');
    await d.sleep(700);

    // The term list under the cell narrows as the letters come; Down lights
    // its row and Enter writes the term: name, type and domain at once.
    mark('term');
    await d.type('Order A', 110);
    await d.sleep(700);
    await d.shot('term-list');
    await d.press('ArrowDown');
    await d.sleep(700);
    await d.press('Enter');
    await d.sleep(1400);
    await d.shot('term-picked');

    // A logical name no term holds: the words give its name as Enter closes
    // the editor.
    mark('words');
    await d.press('Alt+Enter');
    await d.sleep(800);
    await d.press('Shift+Tab');
    await d.sleep(700);
    await d.type('Order Date', 110);
    await d.sleep(700);
    await d.shot('words-typed');
    await d.press('Enter');
    mark('hold');
    await d.sleep(1600);
    await d.shot('words-derived');
  },
};

/** Viewport box of one cell of a column row, by its Konva name. */
async function cell(d, tableName, columnName, name) {
  const id = await d.columnId(tableName, columnName);
  const box = await d.page.evaluate(
    ([id, name]) => {
      const stage = window.__erdStages.canvas;
      const node = stage.findOne(`#column-${id}`)?.findOne(`.${name}`);
      if (!node) return null;
      const r = node.getClientRect();
      const c = stage.container().getBoundingClientRect();
      return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
    },
    [id, name]
  );
  if (!box) throw new Error(`no ${name} cell on ${tableName}.${columnName}`);
  return box;
}
