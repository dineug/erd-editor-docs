/**
 * Code Generator: switch to the tab, where the code shows beside the options
 * panel. Right-click the code and pick TypeScript under Language, whose 22
 * targets come in three groups, then Rust from the same list; the panel's
 * Language list follows. Then set Column Name Case to Snake in the panel, so
 * the Rust fields read member_id, and copy the result from the panel: a
 * Copied! toast confirms.
 */
import { center } from '../lib/recorder.mjs';
import { seedShopRing } from './_io-settings-helpers.mjs';
import { clickDom, tabSelector, timer, waitDom, waitMenuItem } from './_vsc-helpers.mjs';

/**
 * Picks `label` in one of the panel's native lists. The popup a click opens is
 * not drawn in a headless screencast, so the pointer rests on the list while
 * the option is chosen the way a keyboard or the popup would.
 */
async function choosePanelOption(d, id, label) {
  const box = await waitDom(d, `#${id}`);
  await d.moveTo(box.x + box.width * 0.4, box.y + box.height / 2, 450);
  await d.sleep(350);
  await d.page.locator(`erd-editor #${id}`).selectOption({ label });
}

export default {
  name: 'demo-code-generator',
  width: 960,
  height: 540,
  async setup(d) {
    // The five-table ring the export clips open on, clear of the minimap.
    await seedShopRing(d, { width: 960 });
    // Above the tables, so the way up to the toolbar crosses none of them.
    await d.page.mouse.move(250, 62);
    await d.moveTo(250, 62, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);
    await clickDom(d, tabSelector('Code Generator'), { duration: 500 });
    mark('tab');
    await waitDom(d, '.generator-code-options');
    await d.sleep(900);
    await d.shot('graphql');

    // Low and left in the code, so the menu leaves the first struct and the
    // panel in sight; the long Language list clamps to the top of the window.
    const menuAt = { x: 150, y: 300 };
    await d.moveTo(menuAt.x, menuAt.y, 500);
    await d.sleep(100);
    await d.rightClick(menuAt.x, menuAt.y, { duration: 1 });
    mark('menu');
    await d.sleep(500);
    await d.shot('menu');

    // Language: slide along the row into the submenu, then down to TypeScript.
    const language = await waitMenuItem(d, 'Language');
    const languageY = language.y + language.height / 2;
    await d.moveTo(language.x + language.width * 0.45, languageY, 350);
    await d.sleep(300);
    const typescript = await waitMenuItem(d, 'TypeScript');
    const submenuX = typescript.x + typescript.width * 0.45;
    // Straight on up, so the row the slide lands on lights only in passing.
    await d.moveTo(submenuX, languageY, 300);
    await d.click(submenuX, typescript.y + typescript.height / 2, { duration: 450 });
    mark('typescript');
    // The menu stays open; the code and the panel's list are now TypeScript.
    await d.sleep(1000);
    await d.shot('typescript');

    // Up the same list to Rust, one of the new targets.
    const rust = await waitMenuItem(d, 'Rust');
    await d.click(submenuX, rust.y + rust.height / 2, { duration: 450 });
    mark('rust');
    await d.sleep(1000);
    await d.shot('rust');

    // Escape closes the menu.
    await d.press('Escape', { hold: 700 });
    await d.sleep(300);

    // Snake column names in the panel, the way Rust writes its fields.
    await choosePanelOption(d, 'generator-code-column-name-case', 'Snake');
    mark('snake');
    await d.sleep(1200);
    await d.shot('snake');

    const copy = center(await waitDom(d, '.generator-code-options-copy'));
    await d.click(copy.x, copy.y, { duration: 550 });
    mark('copy');
    // The toast is up for two seconds: end the loop while it still shows.
    await d.sleep(150);
    await d.moveTo(copy.x - 40, copy.y - 60, 300);
    await d.shot('copied');
    await d.sleep(1000);
    mark('end');
  },
};
