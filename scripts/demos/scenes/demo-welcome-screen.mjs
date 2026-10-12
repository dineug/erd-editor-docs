/**
 * Welcome Screen: with enableWelcomeScreen on, an empty diagram shows a
 * heading, a menu of ways to start and hand-drawn hints at the palette, the
 * Theme and Display Language buttons and the floating toolbar. Import swaps
 * the rows for its formats and Escape goes back; New Table adds the first
 * table, which takes the screen away, and an undo brings it back.
 */
import { center } from '../lib/recorder.mjs';
import { glide, timeline, waitDom } from './_misc-helpers.mjs';

/** Viewport box of the welcome menu row labelled `label`. */
function rowBox(d, label) {
  return d.page.evaluate(label => {
    const row = [...window.__erdShadowRoot.querySelectorAll('.welcome-screen-item')].find(
      el => el.innerText.split('\n')[0].trim() === label
    );
    if (!row) return null;
    const r = row.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, label);
}

async function waitRow(d, label, timeout = 3000) {
  const until = Date.now() + timeout;
  for (;;) {
    const box = await rowBox(d, label);
    if (box && box.width > 0) return box;
    if (Date.now() > until) throw new Error(`welcome row not found: ${label}`);
    await d.sleep(50);
  }
}

export default {
  name: 'demo-welcome-screen',
  // The hints need a canvas of 720x562; the toolbar takes 30px of the height.
  width: 960,
  height: 620,
  async setup(d) {
    await d.page.evaluate(() => {
      const editor = document.querySelector('erd-editor');
      editor.setSystemLocale('en-US');
      editor.enableThemeBuilder = true;
      editor.enableLocalePicker = true;
      editor.enableWelcomeScreen = true;
      // Keycaps in the gap under the menu, clear of the floating toolbar's hint.
      document.documentElement.style.setProperty('--demo-keys-bottom', '158px');
    });
    await waitDom(d, '.welcome-screen-menu');
    await d.sleep(300);
    const menu = await d.domBox('.welcome-screen-menu');
    d.rest = { x: menu.x + menu.width + 150, y: menu.y + menu.height - 20 };
    await d.moveTo(d.rest.x, d.rest.y, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(1600);
    await d.shot('welcome');
    mark('welcome');

    // Import opens its formats in place, with Back on top. In from the right
    // and pressed near the row's end, so the pointer is off the formats that
    // take its place at once.
    const importRow = await waitRow(d, 'Import');
    const importAt = { x: importRow.x + importRow.width - 24, y: center(importRow).y };
    await glide(d, [{ x: importAt.x + 70, y: importAt.y + 6 }, importAt], 700);
    await d.click(importAt.x, importAt.y, { duration: 0 });
    await waitRow(d, 'Back');
    mark('import');
    await d.moveTo(importAt.x + 60, importAt.y + 10, 160);
    await d.moveTo(d.rest.x, d.rest.y, 400);
    await d.sleep(800);
    await d.shot('formats');

    await d.press('Escape');
    await waitRow(d, 'New Table');
    mark('back');
    await d.sleep(600);
    await d.shot('back');

    // New Table: the first table takes the screen away.
    // Up the right of the menu and in along the row, crossing no other row.
    const newTable = await waitRow(d, 'New Table');
    const newAt = { x: newTable.x + newTable.width * 0.62, y: center(newTable).y };
    await glide(
      d,
      [{ x: newTable.x + newTable.width + 60, y: newAt.y + 4 }, newAt],
      800
    );
    await d.click(newAt.x, newAt.y, { duration: 0 });
    mark('new table');
    await d.sleep(300);
    await d.moveTo(d.rest.x, d.rest.y + 60, 500);
    await d.sleep(900);
    await d.shot('table');

    // An undo takes the table back, and the screen with it.
    await d.press('ControlOrMeta+KeyZ');
    await waitDom(d, '.welcome-screen-menu');
    mark('undo');
    await d.sleep(1400);
    await d.shot('undone');
    mark('end');
  },
};
