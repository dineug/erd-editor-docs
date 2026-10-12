import { seedShopRing } from './_io-settings-helpers.mjs';
import { glide } from './_misc-helpers.mjs';

/**
 * Lock: the Settings tab lists one lock per saved setting with the value it
 * holds. Unlocking Viewport dims its value, which then follows the screen:
 * after a scroll and a zoom on the ERD tab the row reads the new view, and
 * locking it again keeps that view at full strength.
 */

/** Viewport box of the Viewport row's lock button, whichever way it is set. */
const viewportButton = d =>
  d.page.evaluate(() => {
    const el = window.__erdShadowRoot.querySelector(
      'button[title="Unlock Viewport"], button[title="Lock Viewport"]'
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  });

/** The text the Viewport row shows, and whether it is the locked value. */
const viewportValue = d =>
  d.page.evaluate(() => {
    const button = window.__erdShadowRoot.querySelector(
      'button[title="Unlock Viewport"], button[title="Lock Viewport"]'
    );
    const value = button?.previousElementSibling;
    return value && { text: value.textContent.trim(), locked: value.hasAttribute('data-locked') };
  });

const tab = async (d, title) => {
  const box = await d.domBox(`.toolbar [title="${title}"]`);
  return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
};

/** Waits for the Settings tab's lock rows after a tab click. */
const waitLocks = async d => {
  for (let tries = 0; !(await viewportButton(d)); tries++) {
    if (tries > 60) throw new Error('the Lock list did not show');
    await d.sleep(50);
  }
};

// The empty band between the toolbar and the shop ring at 80%. Every table
// sits below it, the scroll moves them down and right, and the zoom draws them
// towards this point from below, so no table or connector passes under it.
const PAN = { x: 480, y: 62 };
// ⌘ + wheel steps out: from 80% to 71%, short of 70%, below which the tables
// collapse to their names.
const ZOOM_TICKS = 3;

export default {
  name: 'demo-settings-locks',
  lossless: true,
  width: 960,
  height: 540,
  async setup(d) {
    await seedShopRing(d, { width: 960 });
    // Starts on the Settings tab; the view it locks is the seeded 80% one.
    const settings = await tab(d, 'Settings');
    await d.page.mouse.click(settings.x, settings.y);
    await waitLocks(d);
    // Right of the Preferences rows, where nothing lights up.
    await d.moveTo(640, 250, 0);
  },
  async scenario(d) {
    await d.sleep(1000);
    await d.shot('locks');

    // Unlock Viewport: in from the right along its row, past the values.
    let button = await viewportButton(d);
    const row = button.y + button.height / 2;
    await glide(d, [{ x: button.x + 70, y: row }], 360);
    await d.click(button.x + button.width / 2, row, { duration: 260 });
    await d.sleep(150);
    // Off the button so its open lock is not under the hover.
    await d.moveTo(button.x + 70, row + 2, 220);
    await d.sleep(700);
    await d.shot('unlocked');
    if ((await viewportValue(d)).locked) throw new Error('Viewport did not unlock');

    // To the ERD tab along the empty band under the toolbar, so neither the
    // Preferences rows nor the other tabs light up.
    const erd = await tab(d, 'Entity Relationship Diagram');
    await glide(
      d,
      [
        { x: 600, y: 120 },
        { x: 540, y: 48 },
        { x: erd.x + 14, y: 46 },
      ],
      480
    );
    await d.click(erd.x, erd.y, { duration: 200 });
    await d.whenDrawn();
    await d.sleep(150);
    await d.shot('erd');

    // Scroll and zoom the diagram from above the tables: down out of the
    // toolbar under the ERD tab first, so the other tabs do not light up.
    await glide(d, [{ x: erd.x + 8, y: 50 }, PAN], 420);
    await d.sleep(100);
    await d.keys(['scroll'], 900);
    await d.wheel(-10, { deltaX: -20, steps: 3, gap: 110 });
    await d.sleep(250);
    await d.holding(
      ['ControlOrMeta'],
      async () => {
        await d.sleep(150);
        await d.wheel(100, { steps: ZOOM_TICKS, gap: 110 });
        await d.sleep(150);
      },
      { label: ['⌘', 'scroll'] }
    );
    await d.whenDrawn();
    await d.sleep(350);
    await d.shot('moved');

    // Back to Settings: the row follows the screen, dimmed.
    const settings = await tab(d, 'Settings');
    await glide(d, [{ x: settings.x + 40, y: 46 }], 380);
    await d.click(settings.x, settings.y, { duration: 200 });
    await waitLocks(d);
    await d.sleep(150);
    button = await viewportButton(d);
    // Round the Preferences rows on the right, into the Viewport row.
    await glide(
      d,
      [
        { x: settings.x + 6, y: 50 },
        { x: 580, y: 70 },
        { x: 600, y: row - 30 },
        { x: button.x + 70, y: row + 2 },
      ],
      520
    );
    await d.sleep(1100);
    await d.shot('following');

    // Lock it again, at the view as it stands.
    await d.click(button.x + button.width / 2, row, { duration: 260 });
    await d.sleep(150);
    await d.moveTo(button.x + 70, row + 2, 220);
    await d.sleep(1300);
    await d.shot('relocked');

    const value = await viewportValue(d);
    if (!value.locked) throw new Error('Viewport did not lock again');
    if (value.text.startsWith('80%')) throw new Error(`the view did not change: ${value.text}`);
  },
};
