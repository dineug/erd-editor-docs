/**
 * Display Language: with enableLocalePicker on, the toolbar's Display
 * Language button opens the picker. Korean turns the editor's chrome Korean,
 * as the canvas menu shows; Arabic then lays the chrome out right to left
 * while the diagram stays as drawn; System takes it back to the system
 * language, English here.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { SHOP_SHOW } from './_io-settings-helpers.mjs';
import { timeline, waitDom } from './_misc-helpers.mjs';

const ZOOM = 0.8;

/** Waits for the picker's row for `locale` ('system', 'ko-KR', 'ar-SA', ...) and returns its box. */
async function optionBox(d, locale) {
  return waitDom(d, `.locale-picker [role="option"][data-locale="${locale}"]`);
}

/**
 * Pointer travel through `waypoints` on a smooth curve (Catmull-Rom from the
 * current position), eased, that takes `duration` of wall-clock time however
 * slow each pointer event runs while the screencast is on.
 */
async function sweep(d, waypoints, duration) {
  const pts = [d.mouse, ...waypoints];
  const line = [pts[0]];
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [pts[i - 1] ?? pts[i], pts[i], pts[i + 1], pts[i + 2] ?? pts[i + 1]];
    for (let s = 1; s <= 24; s++) {
      const t = s / 24;
      const f = (a, b, c, e) =>
        0.5 *
        (2 * b +
          (c - a) * t +
          (2 * a - 5 * b + 4 * c - e) * t * t +
          (3 * b - a - 3 * c + e) * t * t * t);
      line.push({ x: f(p0.x, p1.x, p2.x, p3.x), y: f(p0.y, p1.y, p2.y, p3.y) });
    }
  }
  const lengths = [0];
  for (let i = 1; i < line.length; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(line[i].x - line[i - 1].x, line[i].y - line[i - 1].y));
  }
  const total = lengths[lengths.length - 1];
  const start = Date.now();
  let j = 1;
  for (;;) {
    const t = Math.min(1, (Date.now() - start) / duration);
    const at = total * (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
    while (j < line.length - 1 && lengths[j] < at) j++;
    const span = lengths[j] - lengths[j - 1] || 1;
    const u = Math.min(1, Math.max(0, (at - lengths[j - 1]) / span));
    await d.moveTo(
      line[j - 1].x + (line[j].x - line[j - 1].x) * u,
      line[j - 1].y + (line[j].y - line[j - 1].y) * u,
      0
    );
    if (t >= 1) break;
  }
}

export default {
  name: 'demo-display-language',
  width: 960,
  height: 540,
  async setup(d) {
    await d.page.evaluate(() => {
      const editor = document.querySelector('erd-editor');
      editor.setSystemLocale('en-US');
      editor.enableLocalePicker = true;
    });
    // The diagram right of where the picker hangs in a left-to-right
    // language, and the left of the canvas left empty for the canvas menu.
    await seedSQL(d, readSeed('shop.sql'), {
      // The top right is left to the minimap.
      only: ['members', 'orders', 'order_items'],
      tables: {
        members: { x: 400, y: 50 },
        orders: { x: 400, y: 330 },
        order_items: { x: 800, y: 330 },
      },
      settings: { databaseName: 'shop', show: SHOP_SHOW, zoomLevel: ZOOM },
    });
    await d.moveTo(170, 330, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(300);

    /**
     * Clicks the Display Language button, reached through `via` so the
     * pointer crosses no table, and up into it from under the toolbar so it
     * slides over no other button.
     */
    const openPicker = async (via, duration) => {
      const button = center(await d.domBox('.toolbar-locale'));
      await sweep(d, [...via, button], duration);
      await d.sleep(110);
      await d.click(button.x, button.y, { duration: 0 });
      await waitDom(d, '.locale-picker');
    };

    // The picker opens on System, which names the system language. Up left
    // of members, over its top and up into the button.
    await openPicker([{ x: 300, y: 56 }, { x: 395, y: 46 }], 800);
    mark('picker');
    await d.sleep(500);
    await d.shot('picker');

    // Down off the toolbar, between the panel and members, and in along the
    // foot row, neither past the panel's foot nor over the row above, then
    // down the list to the last language, 한국어, which the scroll leaves at
    // the foot of the list, under the pointer.
    const list = await d.domBox('.locale-picker [role="listbox"]');
    const foot = { x: list.x + list.width * 0.4, y: list.y + list.height - 18 };
    await sweep(
      d,
      [
        { x: d.mouse.x + 1, y: 52 },
        { x: 298, y: 60 },
        { x: 298, y: 360 },
        { x: 292, y: foot.y - 13 },
        foot,
      ],
      900
    );
    // Exactly what is left to scroll: wheeling past the end bounces the list,
    // and the sticky System row with it.
    const left = await d.page.evaluate(() => {
      const el = window.__erdShadowRoot.querySelector('.locale-picker [role="listbox"]');
      return el.scrollHeight - el.clientHeight - el.scrollTop;
    });
    await d.wheel(left / 4, { steps: 4, gap: 60 });
    await d.sleep(250);
    const korean = center(await optionBox(d, 'ko-KR'));
    await d.click(foot.x, korean.y, { duration: 200 });
    mark('korean');
    await d.sleep(200);

    // The canvas menu is Korean now.
    await d.rightClick(110, 96, { duration: 550 });
    await waitDom(d, '.context-menu-content');
    await d.sleep(1150);
    await d.shot('korean-menu');
    // A press on the toolbar leaves the menu open, so Escape closes it.
    await d.press('Escape', { hold: 650 });
    mark('menu');

    // Back to the picker, now in Korean, for Arabic: under the toolbar's
    // buttons, then up to it.
    await openPicker([{ x: 395, y: 46 }], 700);
    await d.sleep(400);
    await d.shot('picker-korean');
    const arabic = center(await optionBox(d, 'ar-SA'));
    // Down off the toolbar, outside the panel's edge, left of members, and in
    // along the row.
    await sweep(
      d,
      [
        { x: d.mouse.x + 1, y: 52 },
        { x: 298, y: 60 },
        { x: 294, y: arabic.y - 40 },
        { x: 284, y: arabic.y - 4 },
        arabic,
      ],
      750
    );
    await d.sleep(120);
    await d.click(arabic.x, arabic.y, { duration: 0 });
    mark('arabic');
    // The chrome mirrors; the diagram stays as drawn.
    await d.sleep(1100);
    await d.shot('arabic');

    // System follows the system language: English. The button is now on the
    // other side of the toolbar: up the left and along over members.
    await openPicker([{ x: 290, y: 64 }, { x: 555, y: 50 }], 1000);
    await d.sleep(300);
    await d.shot('picker-arabic');
    // The row's empty left end: once the picker closes and the chrome flips
    // back, it is empty canvas between members and the minimap.
    const row = await optionBox(d, 'system');
    const system = { x: row.x + 42, y: row.y + row.height / 2 };
    // Down off the toolbar, then over the gap above members and into the
    // System row under the panel's close button, which a straight line from
    // the button would cross.
    const panel = await d.domBox('.locale-picker');
    await sweep(
      d,
      [
        { x: d.mouse.x + 2, y: 44 },
        { x: panel.x - 2, y: system.y - 5 },
        system,
      ],
      650
    );
    await d.sleep(120);
    await d.click(system.x, system.y, { duration: 0 });
    mark('system');
    await d.sleep(1300);
    await d.shot('english');
    mark('end');
  },
};
