/**
 * Table Groups, memos: a memo dragged into the teal Billing group outlines the
 * group while its drop would put the memo there, joins as it lands, its header
 * band taking the teal, and the box stretches round it. The title bar then
 * carries the group, its tables and the memo, and Remove from group in the
 * memo's menu takes it out: its header goes plain and the box back to its own
 * size, leaving the memo where it stands.
 */
import { glide, timeline, waitMenuItem } from './_misc-helpers.mjs';
import { glideTo, memo, memoBox, seedShop } from './_table-related-a-helpers.mjs';

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;
const ZOOM = 0.8;
const MEMO_ID = 'memo-refunds';
// The teal preset (#12a594), which takes white text and a white remove icon.
const GROUP = {
  id: 'billing',
  name: 'Billing',
  color: '#12a594',
  ui: { x: 40, y: 110, width: 760, height: 300, zIndex: 1 },
};

/**
 * Half the peak speed of the cubic ease. A dragged memo is drawn a frame behind
 * the pointer, so the faster the pointer rises, the nearer it comes to the
 * memo's colour strip.
 */
const easeInOutSine = t => (1 - Math.cos(Math.PI * t)) / 2;

/** Polls a Konva node on the canvas stage until it is drawn, and returns its box. */
async function waitNode(d, selector, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await d.nodeBox(selector);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`node not found: ${selector}`);
    await d.sleep(50);
  }
}

/**
 * Hovers a menu row down the menu's left padding, so no other row lights up,
 * and clicks it at 65% of its width, so the pointer is left right of the memo,
 * off its text, once the menu closes.
 */
async function pickMenuItem(d, label, pause = 320) {
  const item = await waitMenuItem(d, label);
  const y = item.y + item.height / 2;
  if (Math.abs(d.mouse.y - y) > item.height / 2) {
    await d.moveTo(item.x - 4, y, 280);
  }
  const at = { x: item.x + item.width * 0.65, y };
  await d.moveTo(at.x, at.y, 240);
  await d.sleep(pause);
  await d.click(at.x, at.y, { duration: 0 });
}

export default {
  name: 'demo-table-group-memo',
  width: 960,
  height: 540,
  async setup(d) {
    // orders and payments in the teal Billing group, with room on its right;
    // the memo, in no group, waits right of the box, under the minimap.
    await seedShop(d, {
      tables: { orders: { x: 75, y: 185 }, payments: { x: 375, y: 185 } },
      memos: [
        memo(MEMO_ID, 'Refunds are recorded as negative payments.', {
          x: 880,
          y: 300,
          width: 170,
          height: 60,
        }),
      ],
      settings: { show: SHOW, zoomLevel: ZOOM },
      patch(doc, byName) {
        doc.collections.tableGroupEntities[GROUP.id] = GROUP;
        doc.doc.tableGroupIds.push(GROUP.id);
        for (const name of ['orders', 'payments']) {
          doc.collections.tableEntities[byName.get(name)].groupId = GROUP.id;
        }
      },
    });
    // Empty canvas, clear of the minimap and the floating toolbar.
    await d.moveTo(840, 430, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(400);

    // The memo onto the group, grabbed by its header band: up past its right
    // side, over its top, then steeply down into the band and along it, so
    // neither its text, its remove icon nor a sash is hovered on the way. The
    // colour strip on top is crossed between two pointer events, so its hand
    // cursor never shows. glide sends its events at the same points on every
    // run (duration / 32 steps, two events each), and these waypoints and
    // durations, here and below, put none within 5 px of a memo's strip or
    // text: change one and check the frames again. The grip sits low in the
    // band, 9.6 px under the strip, and the drag rises at most about 3.6 px a
    // frame, so the memo, drawn a frame late, never brings its strip under the
    // pointer (at + 11 with the cubic ease it did, and the hand flickered).
    // The group is outlined while the drop would put the memo there, and the
    // memo joins as it lands.
    const note = await memoBox(d, MEMO_ID);
    const grip = { x: note.x + 40, y: note.y + 14 };
    await glide(d, [{ x: 885, y: 330 }, { x: 844, y: 239 }, { x: 820, y: grip.y - 2 }, grip], 560);
    await d.sleep(180);
    await d.page.mouse.down();
    await d.sleep(120);
    await glideTo(d, { x: 590, y: 213 }, 1000, easeInOutSine);
    await d.sleep(450);
    await d.shot('drop-target');
    await d.page.mouse.up();
    mark('joined');
    await d.sleep(500);
    await d.shot('joined');

    // The title bar carries the group, its tables and the memo. Along the
    // memo's band and up off it, crossing its colour strip between two
    // pointer events, then across the box above payments, so no table
    // lights up.
    const joined = await memoBox(d, MEMO_ID);
    const bar = await waitNode(d, '.table-group-title-bar');
    const grab = { x: bar.x + 150, y: bar.y + bar.height / 2 };
    await glide(
      d,
      [{ x: joined.x + 16, y: joined.y + 12 }, { x: joined.x - 25, y: joined.y - 50 }, grab],
      520
    );
    await d.sleep(250);
    await d.page.mouse.down();
    await d.sleep(120);
    // +40 keeps the stretched box's corner clear of the minimap.
    await glideTo(d, { x: grab.x + 40, y: grab.y + 80 }, 900);
    await d.sleep(150);
    await d.page.mouse.up();
    mark('moved');
    await d.sleep(400);
    await d.shot('moved');

    // The memo's menu, opened on its header band: Remove from group takes it
    // out, and the box goes back to its own size.
    const moved = await memoBox(d, MEMO_ID);
    const head = { x: moved.x + 40, y: moved.y + 11 };
    const barNow = await waitNode(d, '.table-group-title-bar');
    // Above the tables, then steeply down into the memo's band right of the
    // point and along it, crossing the colour strip between two pointer events
    // as on the way in.
    await glide(
      d,
      [
        { x: head.x - 40, y: barNow.y + barNow.height + 20 },
        { x: head.x + 40, y: moved.y - 26 },
        { x: head.x + 45, y: head.y },
        head,
      ],
      560
    );
    await d.sleep(200);
    await d.rightClick(head.x, head.y, { duration: 0 });
    await d.sleep(150);
    await d.shot('memo-menu');
    await pickMenuItem(d, 'Remove from group', 380);
    mark('removed');
    await d.sleep(600);
    await d.shot('removed');

    // A click on empty canvas lets the memo go.
    await d.click(860, 440, { duration: 550 });
    await d.sleep(1200);
    await d.shot('done');
    mark('end');
  },
};
