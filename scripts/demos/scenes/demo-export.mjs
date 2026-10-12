import { hoverMenuPath, labelPoint, seedShopRing } from './_io-settings-helpers.mjs';

/**
 * Exporting an image: Export > Image opens the Export image dialog, a preview
 * of the diagram beside its options. Dark mode off redraws the preview light,
 * Background off leaves it transparent over the checkerboard, 3x grows the
 * PNG size the dialog states, and Copy to clipboard answers with a notice.
 */

const WIDTH = 960;
const HEIGHT = 540;

/** Viewport box of a button of the dialog, by its text. */
function buttonBox(d, text) {
  return d.page.evaluate(text => {
    const buttons = window.__erdShadowRoot.querySelectorAll('.export-image button');
    for (const button of buttons) {
      if (button.textContent.trim() === text) {
        const r = button.getBoundingClientRect();
        return { x: r.left, y: r.top, width: r.width, height: r.height };
      }
    }
    return null;
  }, text);
}

/** Viewport box of the Background (0) or Dark mode (1) switch. */
const switchBox = (d, index) => d.domBox('.export-image button[role="switch"]', index);

/** Resolves once the preview shows a picture of the options set now. */
function previewDrawn(d) {
  return d.page.waitForFunction(
    () => {
      const preview = window.__erdShadowRoot.querySelector('.export-image-preview');
      const img = preview?.querySelector('img');
      return (
        preview?.getAttribute('aria-busy') === 'false' && img?.complete && img.naturalWidth > 0
      );
    },
    null,
    { timeout: 20_000 }
  );
}

const centre = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/** Opens Export > Image the way a person does, from the canvas menu. */
async function openExportImage(d, at, { pause, lastPause }) {
  await d.rightClick(at.x, at.y, { duration: 320 });
  await d.sleep(300);
  // Into the submenu, pausing so the three entries can be read.
  await hoverMenuPath(d, ['Export', 'json'], { pause, lastPause });
  await d.shot('export-submenu');
  const image = await hoverMenuPath(d, ['Image'], { pause: 200 });
  const p = labelPoint(image);
  await d.click(p.x, p.y);
}

export default {
  name: 'demo-export',
  lossless: true,
  width: WIDTH,
  height: HEIGHT,
  async setup(d) {
    await seedShopRing(d, { width: WIDTH });

    // Opened once beforehand and closed, so the export worker and its fonts
    // are up and the recorded preview draws at once.
    await openExportImage(d, { x: 470, y: 56 }, { pause: 0, lastPause: 0 });
    await previewDrawn(d);
    await d.page.keyboard.press('Escape');
    await d.page.waitForFunction(() => !window.__erdShadowRoot.querySelector('.export-image'));

    await d.moveTo(700, 70, 0);
  },
  async scenario(d) {
    await d.sleep(400);

    await openExportImage(d, { x: 470, y: 56 }, { pause: 250, lastPause: 500 });
    // Off the buttons the dialog opens under the pointer, into the empty
    // space of the options.
    await d.moveTo(760, 340, 420);
    await previewDrawn(d);
    await d.shot('dialog');
    // The preview, the options and the size of the PNG at 2x.
    await d.sleep(800);

    // Dark mode off: the preview redraws in the light appearance.
    const dark = centre(await switchBox(d, 1));
    await d.click(dark.x, dark.y, { duration: 520 });
    await d.sleep(300);
    await previewDrawn(d);
    await d.shot('light');
    await d.sleep(600);

    // Background off: the canvas goes, leaving the checkerboard under it.
    const background = centre(await switchBox(d, 0));
    await d.click(background.x, background.y, { duration: 360 });
    await d.sleep(300);
    await previewDrawn(d);
    await d.shot('transparent');
    await d.sleep(600);

    // 3x: the stated PNG size grows by half.
    const scale = centre(await buttonBox(d, '3x'));
    await d.click(scale.x, scale.y, { duration: 420 });
    await d.shot('scale');
    await d.sleep(650);

    // Copy to clipboard, answered by a notice over the dialog.
    const copy = await buttonBox(d, 'Copy to clipboard');
    await d.click(copy.x + copy.width * 0.62, copy.y + copy.height / 2, { duration: 460 });
    // Up off the button, so the notice and the button both read.
    await d.moveTo(copy.x + copy.width * 0.5, copy.y - 60, 380);
    await d.page.waitForFunction(
      () => window.__erdShadowRoot.textContent.includes('Copied the image to the clipboard'),
      null,
      { timeout: 20_000 }
    );
    await d.shot('copied');
    await d.sleep(1300);
  },
};
