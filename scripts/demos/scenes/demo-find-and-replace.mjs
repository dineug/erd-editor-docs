import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide, timer } from './_table-related-b-helpers.mjs';
import { waitDom } from './_vsc-helpers.mjs';

/**
 * Find and Replace in the Explorer: ⌘ + F opens the Explorer docked left of
 * the canvas with the caret in its Find field, and `member` turns the tree
 * into the six matches (addresses.member_id, members, the UQ_MEMBER_EMAIL
 * index, orders.member_id, reviews.member_id and the Member area group).
 * Enter goes to the first two, which already show well, so the view stays
 * put and only the selection moves; a click on the reviews › member_id row
 * scrolls the canvas to it. Toggle Replace unfolds the Replace row, Preserve
 * Case goes on, and `user` with Replace All (⌘ + Enter) renames all six in
 * one edit, ending on users, three user_id and the User area group.
 */

const GROUP_ID = 'member-area';
// Data type, primary key and relationships: no table comments or N-N, so the
// tables stay narrow enough for the diagram and its one scroll to fit beside
// the 260px Explorer.
const SHOW = 4 | 32 | 256;

/** Viewport box of the Explorer's tree row for a node id such as `c:<columnId>`. */
const rowBox = (d, nodeId) => d.domBox(`.explorer [role="treeitem"][id$=":${nodeId}"]`);

/** Waits for the count line under the Find field to read `text`. */
async function waitCount(d, text) {
  const until = Date.now() + 4000;
  for (;;) {
    const count = await d.page.evaluate(
      () => window.__erdShadowRoot.querySelector('.explorer .find-count')?.textContent ?? ''
    );
    if (count === text) return;
    if (Date.now() > until) throw new Error(`waitCount: "${count}", wanted "${text}"`);
    await d.sleep(30);
  }
}

export default {
  name: 'demo-find-and-replace',
  width: 960,
  height: 540,
  async setup(d) {
    // At 80%, laid out for the 700px canvas the Explorer leaves: opening it
    // keeps the origin, so the diagram slides 260px right. The Member area
    // group (members over addresses) has its row middles in the middle half
    // of that canvas, so the first two jumps leave the view alone. orders and
    // reviews stand right of it, below the minimap, where the
    // reviews.member_id row is past the middle half: its jump centres it
    // across, which leaves the whole diagram in view beside the Explorer.
    await seedSQL(
      d,
      readSeed('shop.sql') + '\nCREATE UNIQUE INDEX UQ_MEMBER_EMAIL ON members (email);\n',
      {
        only: ['members', 'addresses', 'orders', 'reviews'],
        tables: {
          members: { x: 315, y: 112 },
          addresses: { x: 315, y: 280 },
          orders: { x: 601, y: 225 },
          reviews: { x: 601, y: 375 },
        },
        settings: {
          databaseName: 'shop',
          show: SHOW,
          zoomLevel: 0.8,
        },
        patch(doc, byName) {
          // The storage form leaves both out while there is no group.
          doc.collections.tableGroupEntities ??= {};
          doc.doc.tableGroupIds ??= [];
          doc.collections.tableGroupEntities[GROUP_ID] = {
            id: GROUP_ID,
            name: 'Member area',
            color: '#0d9488',
            ui: { x: 291, y: 60, width: 270, height: 372, zIndex: 1 },
          };
          doc.doc.tableGroupIds.push(GROUP_ID);
          for (const name of ['members', 'addresses']) {
            doc.collections.tableEntities[byName.get(name)].groupId = GROUP_ID;
          }
        },
      }
    );
    // Bottom left: empty canvas now, and below the last tree row once the
    // Explorer is open, the Replace row unfolded too.
    await d.moveTo(40, 520, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(600);

    await d.press('ControlOrMeta+KeyF');
    await waitDom(d, '.explorer .find-input');
    mark('open');
    await d.sleep(500);
    await d.type('member', 120);
    await waitCount(d, '6 matches');
    await d.sleep(1000);
    await d.shot('typed');

    // Enter in the Find field: addresses.member_id, then members. Both
    // already show well, so the canvas only selects them.
    mark('enter');
    await d.press('Enter', { hold: 700 });
    await waitCount(d, '1 of 6');
    await d.sleep(900);
    await d.shot('match-1');
    await d.press('Enter', { hold: 700 });
    await waitCount(d, '2 of 6');
    await d.sleep(900);
    await d.shot('match-2');

    // A click on the reviews › member_id row, reached through the empty
    // canvas strip beside the Explorer so no other row lights on the way:
    // the canvas scrolls to centre the row across.
    mark('row');
    const strip = (await d.domBox('.explorer')).width + 12;
    const row = await rowBox(d, `c:${await d.columnId('reviews', 'member_id')}`);
    const onRow = { x: 100, y: row.y + row.height / 2 };
    await glide(d, [{ x: strip, y: 505 }, { x: strip, y: onRow.y }, onRow], 1000);
    await d.click(onRow.x, onRow.y, { duration: 1 });
    await waitCount(d, '5 of 6');
    await d.sleep(1100);
    await d.shot('match-5');

    // Up the same strip, which the scrolled group leaves clear, and in along
    // the gap above the Find field to the Toggle Replace chevron.
    mark('replace');
    const toggle = center(await d.domBox('.explorer-replace-toggle'));
    const above = (await d.domBox('.explorer-search')).y + 1;
    await glide(
      d,
      [
        { x: strip, y: onRow.y },
        { x: strip, y: above },
        { x: toggle.x, y: above },
        toggle,
      ],
      1000
    );
    await d.click(toggle.x, toggle.y, { duration: 1 });
    await waitDom(d, '.explorer .replace-input');
    await d.sleep(450);

    // Preserve Case, then into the Replace field.
    const preserve = center(await d.domBox('.explorer .find-preserve-case'));
    await d.click(preserve.x, preserve.y, { duration: 450 });
    await d.sleep(450);
    const field = await d.domBox('.explorer .replace-input');
    await d.click(field.x + field.width - 30, field.y + field.height / 2, { duration: 350 });
    await d.sleep(250);
    await d.type('user', 120);
    await d.sleep(450);
    await d.shot('typed-user');

    // Replace All from the Replace field: six renames in one edit, with
    // Preserve Case writing User area and UQ_USER_EMAIL. Nothing matches
    // member any more, so the tree empties.
    await d.press('ControlOrMeta+Enter');
    await waitCount(d, 'Replaced 6 matches');
    mark('replaced');
    await d.sleep(1700);
    await d.shot('replaced');
  },
};
