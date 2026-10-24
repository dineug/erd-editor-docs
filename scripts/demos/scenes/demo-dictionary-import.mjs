/**
 * The Dictionary tab: the toolbar's Dictionary button opens it, on a first
 * visit on the Domains sheet, which is empty and asks for a CSV file or a row.
 * Import CSV then reads three files, the domains first since a term names its
 * domain: each one fills the dictionary its header names, switches the tab to
 * that sheet and reports what it added in a toast at the bottom right.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide } from './_misc-helpers.mjs';
import { clickDom, tabSelector, timer, waitDom } from './_vsc-helpers.mjs';

const IMPORT_CSV = '.dictionary [title="Import CSV"]';

/** A file as the editor writes one: a byte order mark first and a CRLF after each record. */
const csv = (header, ...records) =>
  `﻿${[header, ...records].map(line => `${line}\r\n`).join('')}`;

const FILES = [
  {
    name: 'domains.csv',
    sheet: 'Domains',
    rows: 5,
    content: csv(
      'name,category,dataType,description',
      'ID,Number,BIGINT,',
      'Code,Text,VARCHAR(20),',
      'Name,Text,VARCHAR(100),',
      'Amount,Number,"DECIMAL(10,2)",',
      'Date Time,Date,DATETIME,'
    ),
  },
  {
    name: 'words.csv',
    sheet: 'Words',
    rows: 8,
    content: csv(
      'name,abbreviation,englishName,description,synonyms,forbiddenWords',
      'Order,ORD,Order,,,',
      'Number,NO,Number,,,Num',
      'Status,STAT,Status,,,',
      'Amount,AMT,Amount,,,',
      'Date,DT,Date,,,',
      'Payment,PAY,Payment,,,',
      'Member,MBR,Member,,Customer,',
      'Name,NM,Name,,,'
    ),
  },
  {
    name: 'terms.csv',
    sheet: 'Terms',
    rows: 4,
    content: csv(
      'name,physicalName,domain,description,synonyms',
      'Order Number,ORD_NO,ID,,',
      'Order Status,ORD_STAT,Code,,',
      'Order Amount,ORD_AMT,Amount,,',
      'Member Name,MBR_NM,Name,,'
    ),
  },
];

/** The sheet the bar shows pressed, by its label without the count. */
const shownSheet = d =>
  d.page.evaluate(
    () =>
      window.__erdShadowRoot
        .querySelector('.dictionary [role="group"] button[aria-pressed="true"] span')
        ?.textContent.trim() ?? ''
  );

/** The status line, 'N rows' and 'N selected'. */
const statusText = d =>
  d.page.evaluate(
    () => window.__erdShadowRoot.querySelector('.dictionary')?.lastElementChild?.innerText ?? ''
  );

async function waitFor(d, fn, what, timeout = 4000) {
  const until = Date.now() + timeout;
  while (!(await fn())) {
    if (Date.now() > until) throw new Error(`demo-dictionary-import: ${what}`);
    await d.sleep(40);
  }
}

/** Import CSV, and the file a person picks in the dialog it opens. */
async function importFile(d, file) {
  const c = center(await waitDom(d, IMPORT_CSV));
  // Up to the button from the grid below it, so the way there lights no
  // other tool or toolbar button.
  if (d.mouse.y < c.y + 30) {
    await glide(d, [{ x: 360, y: 150 }, { x: c.x - 6, y: c.y + 56 }, c], 900);
  }
  const [chooser] = await Promise.all([
    d.page.waitForEvent('filechooser'),
    d.click(c.x, c.y, { duration: 380 }),
  ]);
  // The moment spent picking the file: off the button and the column header,
  // onto the grid's top rows, clear of the toasts.
  await d.moveTo(c.x - 24, c.y + 80, 320);
  await chooser.setFiles({
    name: file.name,
    mimeType: 'text/csv',
    buffer: Buffer.from(file.content),
  });
  await waitFor(
    d,
    async () =>
      (await shownSheet(d)) === file.sheet &&
      (await statusText(d)).startsWith(`${file.rows} rows`),
    `${file.name} never landed on ${file.sheet}`
  );
  await d.whenDrawn();
}

export default {
  name: 'demo-dictionary-import',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['orders', 'payments'],
      tables: { orders: { x: 70, y: 170 }, payments: { x: 520, y: 250 } },
      settings: { databaseName: 'shop', show: 4 | 32 | 128 | 256 },
    });
    // Above the tables and below the Dictionary button, so the way up to it
    // crosses no table and no other button.
    await d.page.mouse.move(345, 120);
    await d.moveTo(345, 120, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(300);
    await clickDom(d, tabSelector('Dictionary'), { duration: 450 });
    mark('tab');
    await waitDom(d, '.dictionary .dineug-grid-scroller');
    if ((await shownSheet(d)) !== 'Domains') {
      throw new Error('demo-dictionary-import: the tab did not open on Domains');
    }
    await d.whenDrawn();
    // The empty Domains sheet: its columns, the hint, '0 rows'. The way on
    // to Import CSV drops off the toolbar into the sheet first.
    await d.sleep(450);
    await d.shot('empty');

    for (const [i, file] of FILES.entries()) {
      await importFile(d, file);
      mark(file.name);
      await d.shot(`imported-${file.sheet.toLowerCase()}`);
      await d.sleep([750, 900, 300][i]);
    }

    // Off the bar, onto bare grid clear of the rows and the toasts.
    await d.moveTo(520, 420, 700);
    mark('parked');
    // Toasts close 5 s after they open: the domains' one goes while the terms
    // land and the words' one before this hold ends, which leaves the terms'
    // own toast on a still last second.
    await d.sleep(1900);
    mark('end');

    // The runtime value lists every dictionary's ids; the storage form a file
    // saves keeps the rows alone.
    const doc = await d.page.evaluate(() =>
      JSON.parse(document.querySelector('erd-editor').runtimeValue)
    );
    const counts = ['domainIds', 'wordIds', 'termIds'].map(key => doc.doc[key]?.length ?? 0);
    if (counts.join() !== '5,8,4') {
      throw new Error(`demo-dictionary-import: dictionaries hold ${counts.join()}, not 5,8,4`);
    }
  },
};
