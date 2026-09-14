import { center } from '../lib/recorder.mjs';
import { readSeed } from '../lib/seed.mjs';
import { seedClean } from './_editing-helpers.mjs';

/** Editing Start > Memo Creation: Alt+M, type a note into the body, resize it. */
export default {
  name: 'demo-memo',
  width: 800,
  height: 490,
  async setup(d) {
    await seedClean(d, readSeed('shop.sql'), {
      only: ['orders'],
      tables: { orders: { x: 450, y: 190 } },
      // Column comments off: the table stays narrow enough to sit beside the memo.
      settings: { databaseName: 'shop', show: 1 | 4 | 8 | 32 | 128 | 256 },
    });
    await d.page.mouse.click(120, 330);
    await d.moveTo(120, 330, 0);
  },
  async scenario(d) {
    await d.sleep(500);
    await d.press('Alt+KeyM');
    await d.whenDrawn();
    await d.sleep(600);
    await d.shot('memo');

    const clip = await d.nodeBox('.memo-text-clip');
    await d.click(clip.x + 20, clip.y + 12, { duration: 450 });
    await d.sleep(200);
    // Out of the text's way while typing.
    await d.moveTo(clip.x - 60, clip.y + 150, 400);
    await d.shot('editing');
    await d.type('Orders stay PENDING until the payment is confirmed.', 55);
    await d.sleep(600);
    await d.shot('typed');

    const sash = center(await d.nodeBox('.memo-sash-right'));
    await d.moveTo(sash.x, sash.y + 20, 500);
    await d.sleep(350);
    await d.shot('sash-hover');
    await d.drag({ x: sash.x, y: sash.y + 20 }, { x: sash.x + 80, y: sash.y + 22 }, { duration: 550 });
    await d.sleep(400);
    await d.shot('resized');
    await d.moveTo(150, 380, 450);
    await d.sleep(1300);
  },
};
