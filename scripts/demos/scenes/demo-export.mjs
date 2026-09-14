import { hoverMenuPath, labelPoint, seedShopRing } from './_io-settings-helpers.mjs';

/**
 * Exporting: the Export submenu offers json, Schema SQL and png; picking png
 * starts the export, and a notice says it is running.
 */

const WIDTH = 960;
const HEIGHT = 540;

export default {
  name: 'demo-export',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    await seedShopRing(d, { width: WIDTH });
    // The download lands in Playwright's temporary directory, which goes
    // with the browser; nothing is written to the repo.
    await d.moveTo(700, 70, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    await d.rightClick(470, 56, { duration: 320 });
    await d.sleep(300);
    // Into the submenu, pausing so the three formats can be read.
    await hoverMenuPath(d, ['Export', 'json'], { pause: 250, lastPause: 500 });
    await d.shot('export-submenu');
    const png = await hoverMenuPath(d, ['png'], { pause: 200 });

    const p = labelPoint(png);
    await d.click(p.x, p.y);
    // Straight down off the tables the closed menu uncovers.
    await d.moveTo(p.x - 20, 450, 260);
    await d.shot('exporting');
    await d.sleep(2200);
  },
};
