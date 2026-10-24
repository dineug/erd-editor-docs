/**
 * Editing the Words sheet the way a spreadsheet is edited: typing on the
 * active cell replaces it and Enter commits and moves down, Alt + Enter
 * inserts an empty row below the selection to fill in with Tab, the grid's
 * menu sorts the sheet by the column right clicked, and the Search field
 * narrows the rows until Escape empties it.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { clickDom, tabSelector, timer, waitDom, waitMenuItem } from './_vsc-helpers.mjs';

// The grid's column header and each row are 28 px; the row-number column is
// 40 px; the Words sheet opens with Word 160 px and Abbreviation 120 px wide.
const ROW = 28;
const ROW_NUMBERS = 40;
const WORD_WIDTH = 160;
const ABBREVIATION_WIDTH = 120;

const WORDS = [
  ['Order', 'ORD', 'Order', '', '', ''],
  ['Number', 'NO', 'Number', '', '', 'Num'],
  ['Status', 'STAT', 'Status', '', '', ''],
  ['Amount', 'AMT', 'Amount', '', '', ''],
  ['Date', 'DT', 'Date', '', '', ''],
  ['Payment', 'PAY', 'Payment', '', '', ''],
  ['Member', 'MBR', 'Member', '', 'Customer', ''],
  ['Name', 'NM', 'Name', '', '', ''],
];
const DOMAINS = [
  ['ID', 'Number', 'BIGINT', ''],
  ['Code', 'Text', 'VARCHAR(20)', ''],
  ['Name', 'Text', 'VARCHAR(100)', ''],
  ['Amount', 'Number', 'DECIMAL(10,2)', ''],
  ['Date Time', 'Date', 'DATETIME', ''],
];
const TERMS = [
  ['Order Number', 'ORD_NO', 'ID', '', ''],
  ['Order Status', 'ORD_STAT', 'Code', '', ''],
  ['Order Amount', 'ORD_AMT', 'Amount', '', ''],
  ['Member Name', 'MBR_NM', 'Name', '', ''],
];

/** The three dictionaries as a file keeps them, a header and a row each, ids first. */
function dictionaries() {
  const domainId = name => `domain-${DOMAINS.findIndex(row => row[0] === name) + 1}`;
  return {
    wordEntities: {
      fields: [
        'id',
        'name',
        'abbreviation',
        'englishName',
        'description',
        'synonyms',
        'forbiddenWords',
      ],
      rows: WORDS.map((row, i) => [`word-${i + 1}`, ...row]),
    },
    domainEntities: {
      fields: ['id', 'name', 'category', 'dataType', 'description'],
      rows: DOMAINS.map((row, i) => [`domain-${i + 1}`, ...row]),
    },
    termEntities: {
      fields: ['id', 'name', 'physicalName', 'domainId', 'description', 'synonyms'],
      rows: TERMS.map(([name, physicalName, domain, ...rest], i) => [
        `term-${i + 1}`,
        name,
        physicalName,
        domainId(domain),
        ...rest,
      ]),
    },
  };
}

/** The sheet button whose label (without its count) is `label`. */
const sheetButton = (d, label) =>
  d.page.evaluate(label => {
    for (const button of window.__erdShadowRoot.querySelectorAll(
      '.dictionary [role="group"] button'
    )) {
      if (button.querySelector('span')?.textContent.trim() !== label) continue;
      const r = button.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    }
    return null;
  }, label);

/** The status line, 'N rows' and 'N selected'. */
const statusText = d =>
  d.page.evaluate(
    () => window.__erdShadowRoot.querySelector('.dictionary')?.lastElementChild?.innerText ?? ''
  );

/**
 * The Words sheet's rows in the order it shows them, [name, abbreviation]: the
 * live document's listed words by order key, a row without one last, then by id.
 */
const wordRows = d =>
  d.page.evaluate(() => {
    const { doc, collections } = JSON.parse(
      document.querySelector('erd-editor').runtimeValue
    );
    const { fields, rows } = collections.wordEntities;
    const at = field => fields.indexOf(field);
    const byId = new Map(rows.map(row => [row[at('id')], row]));
    const text = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    return doc.wordIds
      .map(id => byId.get(id))
      .filter(Boolean)
      .sort((a, b) => {
        const ka = a[at('order')] || '';
        const kb = b[at('order')] || '';
        if (!ka !== !kb) return ka ? -1 : 1;
        return text(ka, kb) || text(a[at('id')], b[at('id')]);
      })
      .map(row => [row[at('name')], row[at('abbreviation')]]);
  });

async function waitFor(d, fn, what, timeout = 4000) {
  const until = Date.now() + timeout;
  while (!(await fn())) {
    if (Date.now() > until) throw new Error(`demo-dictionary-editing: ${what}`);
    await d.sleep(40);
  }
}

/** Middle of a body cell, by row and by the column's left edge and width. */
async function cellPoint(d, row, left, width) {
  const s = await waitDom(d, '.dictionary .dineug-grid-scroller');
  return { x: s.x + ROW_NUMBERS + left + width / 2, y: s.y + ROW + row * ROW + ROW / 2 };
}

const wordCell = (d, row) => cellPoint(d, row, 0, WORD_WIDTH);
const abbreviationCell = (d, row) => cellPoint(d, row, WORD_WIDTH, ABBREVIATION_WIDTH);

export default {
  name: 'demo-dictionary-editing',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['orders', 'payments'],
      tables: { orders: { x: 70, y: 170 }, payments: { x: 520, y: 250 } },
      settings: { databaseName: 'shop', show: 4 | 32 | 128 | 256 },
      patch(doc) {
        Object.assign(doc.collections, dictionaries());
      },
    });
    // The clip opens on the Words sheet; opening the tab is the import clip's.
    await clickDom(d, tabSelector('Dictionary'), { duration: 1 });
    await waitFor(d, () => sheetButton(d, 'Words'), 'no Words button');
    const c = center(await sheetButton(d, 'Words'));
    await d.click(c.x, c.y, { duration: 1 });
    await waitFor(
      d,
      async () => (await statusText(d)).startsWith(`${WORDS.length} rows`),
      'the Words sheet never showed its rows'
    );
    // On bare grid below the rows.
    await d.page.mouse.move(600, 400);
    await d.moveTo(600, 400, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);

    // Number's abbreviation: typing on the active cell replaces NO.
    const number = await abbreviationCell(d, 1);
    await d.click(number.x, number.y, { duration: 650 });
    await d.sleep(350);
    await d.type('NUM', 100);
    await d.sleep(200);
    await d.press('Enter', { hold: 700 });
    mark('edited');
    await d.sleep(500);
    await d.shot('edited');

    // Alt + Enter: an empty row below the selection, Status, to fill in.
    await d.press('Alt+Enter');
    await waitFor(
      d,
      async () => (await statusText(d)).startsWith(`${WORDS.length + 1} rows`),
      'Alt+Enter inserted no row'
    );
    mark('inserted');
    await d.sleep(450);
    await d.shot('inserted');
    await d.type('Code', 90);
    await d.sleep(150);
    await d.press('Tab', { hold: 700 });
    await d.sleep(200);
    await d.type('CD', 90);
    await d.sleep(150);
    await d.press('Enter', { hold: 700 });
    mark('filled');
    await d.sleep(400);
    await d.shot('filled');

    // The grid's menu, on a Word cell: sort by that column.
    const order = await wordCell(d, 0);
    await d.moveTo(order.x - 10, order.y, 650);
    await d.sleep(120);
    await d.rightClick(order.x - 10, order.y, { duration: 1 });
    const sort = await waitMenuItem(d, 'Sort by Word, ascending');
    await d.sleep(650);
    await d.shot('menu');
    await d.click(sort.x + 70, sort.y + sort.height / 2, { duration: 500 });
    await waitFor(
      d,
      async () => (await wordRows(d))[0]?.[0] === 'Amount',
      'the sort never ordered the words'
    );
    mark('sorted');
    await d.sleep(800);
    await d.shot('sorted');

    // Search narrows the rows; Escape empties it.
    // Right of where the text goes, so the pointer leaves it in sight.
    await clickDom(d, '.dictionary input[placeholder="Search"]', { duration: 650, dx: 60 });
    await d.sleep(200);
    await d.type('ord', 110);
    await waitFor(
      d,
      async () => (await statusText(d)).startsWith('1 row'),
      'the search never narrowed'
    );
    mark('searched');
    await d.sleep(900);
    await d.shot('searched');
    await d.press('Escape', { hold: 700 });
    await waitFor(
      d,
      async () => (await statusText(d)).startsWith(`${WORDS.length + 1} rows`),
      'Escape never emptied the search'
    );
    mark('cleared');
    await d.sleep(1500);
    mark('end');

    const rows = await wordRows(d);
    const expected = [
      ['Amount', 'AMT'],
      ['Code', 'CD'],
      ['Date', 'DT'],
      ['Member', 'MBR'],
      ['Name', 'NM'],
      ['Number', 'NUM'],
      ['Order', 'ORD'],
      ['Payment', 'PAY'],
      ['Status', 'STAT'],
    ];
    if (JSON.stringify(rows) !== JSON.stringify(expected)) {
      throw new Error(`demo-dictionary-editing: words ended ${JSON.stringify(rows)}`);
    }
  },
};
