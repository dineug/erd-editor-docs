/**
 * Code Generator: switch to the tab, right-click the code panel, pick
 * TypeScript under Language, set Table Name Case to Snake, then hover the
 * panel and copy the result: a Copied! toast confirms.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { clickDom, tabSelector, timer, waitDom, waitMenuItem } from './_vsc-helpers.mjs';

export default {
  name: 'demo-code-generator',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: ['members', 'orders', 'order_items', 'products'],
      tables: {
        members: { x: 60, y: 60 },
        orders: { x: 60, y: 290 },
        products: { x: 620, y: 60 },
        order_items: { x: 620, y: 290 },
      },
      settings: { databaseName: 'shop' },
    });
    await d.page.mouse.move(700, 470);
    await d.moveTo(700, 470, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(500);
    await clickDom(d, tabSelector('Code Generator'), { duration: 500 });
    mark('tab');
    await d.sleep(650);
    await d.shot('graphql');

    // Near the top of the panel, so all fourteen targets fit below the menu.
    const menuAt = { x: 470, y: 44 };
    await d.moveTo(menuAt.x, menuAt.y, 450);
    await d.sleep(100);
    await d.rightClick(menuAt.x, menuAt.y, { duration: 1 });
    mark('menu');
    await d.sleep(350);

    // Language: slide along the row into the submenu, then down to TypeScript.
    const language = await waitMenuItem(d, 'Language');
    const languageY = language.y + language.height / 2;
    await d.moveTo(language.x + language.width * 0.45, languageY, 350);
    await d.sleep(250);
    const typescript = await waitMenuItem(d, 'TypeScript');
    const submenuX = typescript.x + typescript.width * 0.45;
    await d.moveTo(submenuX, languageY, 300);
    await d.click(submenuX, typescript.y + typescript.height / 2, { duration: 400 });
    mark('typescript');
    // The menu stays open; the code behind it is now TypeScript.
    await d.sleep(850);
    await d.shot('typescript');

    // Table Name Case: back up inside the open submenu to its row, then left
    // onto it, so the pointer never crosses Column Name Case.
    const tableCase = await waitMenuItem(d, 'Table Name Case');
    const tableCaseY = tableCase.y + tableCase.height / 2;
    await d.moveTo(submenuX, tableCaseY, 350);
    await d.moveTo(tableCase.x + tableCase.width * 0.45, tableCaseY, 300);
    await d.sleep(250);
    const snake = await waitMenuItem(d, 'Snake');
    await d.moveTo(snake.x + snake.width * 0.45, tableCaseY, 300);
    await d.click(snake.x + snake.width * 0.45, snake.y + snake.height / 2, { duration: 350 });
    mark('snake');
    await d.sleep(800);
    await d.shot('snake');

    // The copy button shows while the pointer is over the panel; pressing it
    // also closes the menu.
    const copy = center(await waitDom(d, '[title="Copy"]'));
    await d.click(copy.x, copy.y, { duration: 650 });
    mark('copy');
    // The toast is up for two seconds: end the loop while it still shows.
    await d.sleep(150);
    await d.moveTo(copy.x - 36, copy.y + 44, 250);
    await d.shot('copied');
    await d.sleep(850);
    mark('end');
  },
};
