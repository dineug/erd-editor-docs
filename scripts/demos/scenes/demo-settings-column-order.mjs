import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide } from './_misc-helpers.mjs';

/** Viewport boxes of the Column Order rows, by label. */
const columnOrderRows = d =>
  d.page.evaluate(() =>
    Object.fromEntries(
      [...window.__erdShadowRoot.querySelectorAll('[draggable="true"]')].map(el => {
        const r = el.getBoundingClientRect();
        return [el.innerText.trim(), { x: r.left, y: r.top, width: r.width, height: r.height }];
      })
    )
  );

/**
 * How far the Preferences page must scroll for the whole Column Order list,
 * and the bottom of its scroll box: the Lock list above it pushes the list
 * below the fold of a 640px frame.
 */
const columnOrderOverflow = d =>
  d.page.evaluate(() => {
    const items = window.__erdShadowRoot.querySelectorAll('[draggable="true"]');
    const last = items[items.length - 1];
    let box = last.parentElement;
    while (box && getComputedStyle(box).overflowY !== 'auto') box = box.parentElement;
    const bottom = box.getBoundingClientRect().bottom;
    return { need: last.getBoundingClientRect().bottom - bottom, bottom };
  });

/**
 * Adjusting Column Order: on the Settings tab the Comment row is dragged up
 * to sit under Name, and back on the ERD tab every table shows its comment
 * cell right after the column name.
 */
export default {
  name: 'demo-settings-column-order',
  lossless: true,
  width: 800,
  height: 640,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders'],
      tables: {
        members: { x: 40, y: 50 },
        orders: { x: 190, y: 320 },
      },
      settings: { databaseName: 'shop' },
      // shop.sql leaves the orders columns uncommented; give them comments so
      // both tables show the moved cell with text in it.
      patch(doc, byName) {
        const comments = {
          id: 'Order number',
          member_id: 'Buyer',
          status: 'Order state',
          ordered_at: 'Checkout time',
        };
        const orders = doc.collections.tableEntities[byName.get('orders')];
        for (const id of orders.columnIds) {
          const column = doc.collections.tableColumnEntities[id];
          column.comment = comments[column.name] ?? column.comment;
        }
      },
    });
    // A native drag sends drag events rather than mouse moves, so the painted
    // pointer is fed from dragover and shown grabbing while the row is held.
    await d.page.evaluate(() => {
      const options = { capture: true, passive: true };
      window.addEventListener(
        'dragover',
        e => {
          window.dispatchEvent(
            new MouseEvent('mousemove', { clientX: e.clientX, clientY: e.clientY })
          );
        },
        options
      );
      window.addEventListener('dragstart', () => (window.__demoCursorLock = 'grabbing'), options);
      window.addEventListener('dragend', () => (window.__demoCursorLock = null), options);
    });
    // Above the members table, so the way to the toolbar crosses no table.
    await d.moveTo(600, 44, 0);
  },
  async scenario(d) {
    await d.sleep(550);

    const settings = await d.domBox('[title="Settings"]');
    await d.click(settings.x + settings.width / 2, settings.y + settings.height / 2, {
      duration: 420,
    });
    await d.sleep(500);
    await d.shot('settings');

    // Down the page to the Column Order list, under the Lock rows. The wheel
    // turns right of the lists, where no row lights up; the pointer gets
    // there round the right of the Preferences rows, clear of their switches.
    await glide(
      d,
      [
        { x: settings.x + settings.width / 2 + 8, y: 52 },
        { x: 600, y: 96 },
        { x: 640, y: 430 },
      ],
      800
    );
    await d.sleep(200);
    const { need } = await columnOrderOverflow(d);
    if (need > -12) {
      const step = 30;
      await d.wheel(step, { steps: Math.ceil((need + 12) / step), gap: 45 });
    }
    await d.sleep(450);
    const after = await columnOrderOverflow(d);
    if (after.need > 0) throw new Error(`the Column Order list is ${after.need}px below the fold`);
    await d.shot('scrolled');

    const rows = await columnOrderRows(d);
    const from = rows.Comment;
    const to = rows.DataType;
    const gripX = from.x + 22;
    const midY = box => box.y + box.height / 2;
    const pitch = rows.DataType.y - rows.Name.y;
    // The list's first row, Logical Name since 4.2.0.
    const first = rows['Logical Name'] ?? rows.Name;
    // Take the row by its grip, coming in along the gap above the list and
    // down its left edge, so the rows on the way do not light up.
    await glide(
      d,
      [
        { x: 560, y: first.y - 10 },
        { x: from.x - 8, y: first.y - 4 },
        { x: from.x - 8, y: midY(from) },
      ],
      900
    );
    await d.moveTo(gripX, midY(from), 180);
    await d.sleep(350);

    // Up one row at a time. The list reorders once the pointer enters the
    // next row and slides the two rows past each other over 0.3s; each hold
    // lets that finish so the held row stays under the hand.
    await d.page.mouse.down();
    await d.sleep(250);
    const steps = Math.round((midY(from) - midY(to)) / pitch);
    for (let i = 1; i <= steps; i++) {
      await d.moveTo(gripX, midY(from) - pitch * i, 220);
      await d.shot(`step-${i}`);
      await d.sleep(i === steps ? 450 : 330);
    }
    await d.page.mouse.up();
    // Along the row, off its label, so the hover follows the released pointer.
    await d.moveTo(to.x + 230, to.y + to.height / 2 + 2, 300);
    await d.sleep(450);
    await d.shot('reordered');

    const erd = await d.domBox('[title="Entity Relationship Diagram"]');
    await d.click(erd.x + erd.width / 2, erd.y + erd.height / 2, { duration: 520 });
    await d.sleep(200);
    // Along the empty strip above the members table.
    await d.moveTo(600, 56, 420);
    await d.whenDrawn();
    await d.shot('erd');
    await d.sleep(1300);

    // A drag that never started records a clip where nothing moves.
    const { columnOrder } = (await d.value()).settings;
    const name = columnOrder.indexOf(1);
    if (columnOrder[name + 1] !== 64) {
      throw new Error(`Comment is not under Name: ${columnOrder.join(', ')}`);
    }
  },
};
