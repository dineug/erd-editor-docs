/**
 * Schema SQL options: Export ▸ Schema SQL opens the Schema SQL tab with its
 * options panel beside the DDL. Statements goes from If not exists to Create
 * and then to Drop & re-create, which adds the DROP block and a warning;
 * Header goes from CREATE + USE to USE, which keeps only `USE shop;`; and a
 * script typed into Before tables shows at the top of the DDL once the field
 * is left.
 */
import { center } from '../lib/recorder.mjs';
import { hoverMenuPath, labelPoint, seedShopRing } from './_io-settings-helpers.mjs';
import { timer, waitDom } from './_vsc-helpers.mjs';

/** Viewport box of a segment button of the panel's Statements or Header row. */
async function segmentBox(d, row, label) {
  const box = await d.page.evaluate(
    ([row, label]) => {
      const buttons = window.__erdShadowRoot.querySelectorAll(
        `[aria-labelledby="schema-sql-${row}"] button`
      );
      const button = [...buttons].find(b => b.textContent.trim() === label);
      if (!button) return null;
      const r = button.getBoundingClientRect();
      return { x: r.left, y: r.top, width: r.width, height: r.height };
    },
    [row, label]
  );
  if (!box) throw new Error(`no ${row} segment ${label}`);
  return box;
}

/** Viewport box of the caption over the Before tables and After tables scripts. */
function scriptsCaptionBox(d) {
  return d.page.evaluate(() => {
    const caption = window.__erdShadowRoot
      .querySelector('#schema-sql-before')
      .closest('section')
      .querySelector(':scope > span');
    const r = caption.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  });
}

const SCRIPT = 'SET NAMES utf8mb4;';

export default {
  name: 'demo-schema-sql-options',
  width: 960,
  height: 600,
  async setup(d) {
    // The five-table ring the export clips open on, clear of the minimap,
    // lowered to the middle of the taller window.
    await seedShopRing(d, { width: 960, settings: { originY: 110 } });
    await d.moveTo(700, 70, 0);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(300);

    await d.rightClick(470, 56, { duration: 320 });
    await d.sleep(300);
    // Into the submenu, pausing so json, Schema SQL and Image can be read.
    const item = await hoverMenuPath(d, ['Export', 'Schema SQL'], { pause: 250, lastPause: 450 });
    const p = labelPoint(item);
    await d.click(p.x, p.y, { duration: 1 });
    mark('tab');
    await waitDom(d, '.schema-sql-options');
    // Onto the panel's blank caption row, off the code, whose copy button
    // shows under a pointer, and off every button.
    const statements = await waitDom(d, '#schema-sql-statements');
    await d.moveTo(statements.x + 160, statements.y - 22, 450);
    await d.sleep(800);
    await d.shot('open');

    const press = async (row, label, pause) => {
      const c = center(await segmentBox(d, row, label));
      await d.click(c.x, c.y, { duration: 450 });
      mark(label);
      await d.sleep(pause);
      await d.shot(label.replace(/\W+/g, '-'));
    };
    await press('statements', 'Create', 700);
    await press('statements', 'Drop & re-create', 1200);
    await press('header', 'USE', 900);

    const before = await waitDom(d, '#schema-sql-before');
    await d.click(before.x + 40, before.y + before.height / 2, { duration: 500 });
    await d.sleep(150);
    await d.type(SCRIPT, 55);
    mark('typed');
    await d.sleep(300);

    // Leaving the field commits the script, which the DDL then opens with: a
    // click on the scripts' caption above it (its label would focus it again).
    const caption = await scriptsCaptionBox(d);
    await d.click(caption.x + caption.width - 30, caption.y + 8, { duration: 450 });
    mark('committed');
    await d.sleep(1400);
    await d.shot('script');
    mark('end');
  },
};
