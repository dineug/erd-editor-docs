/**
 * Visualization, Flow Mode: switch from Graph to Flow, hover a card to light
 * it and the tables one relationship away (particles run along the lit
 * connectors), click to pin the light, switch the row display to Keys only,
 * then zoom in with ⌘ + wheel and press Fit to bring every card back.
 */
import { center } from '../lib/recorder.mjs';
import { readSeed, seedSQL } from '../lib/seed.mjs';
import {
  canvasSafeMoveTo,
  clickDom,
  tabSelector,
  timer,
  waitDom,
  waitMenuItem,
} from './_vsc-helpers.mjs';

const BAR = '.visualization-toolbar';

export default {
  name: 'demo-visualization-flow',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), { settings: { databaseName: 'shop' } });
    // Start on the Visualization tab in Graph, with the forces at rest.
    const tab = center(await waitDom(d, tabSelector('Visualization')));
    await d.page.mouse.click(tab.x, tab.y);
    await d.sleep(6000);
    // Keycaps at the top: zooming in grows the cards over the usual spot.
    await d.page.evaluate(() =>
      document.documentElement.style.setProperty('--demo-keys-bottom', '462px')
    );
    await d.page.mouse.move(760, 420);
    await d.moveTo(760, 420, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(450);
    await clickDom(d, `${BAR} [title="Flow"]`, { duration: 500 });
    await d.sleep(600);
    mark('flow');
    await d.shot('flow');

    // Hover orders: it lights, with members, order_items and payments.
    const orders = await d.tableBox('orders');
    const onOrders = { x: orders.x + orders.width * 0.6, y: orders.y + orders.height / 2 };
    await canvasSafeMoveTo(d, onOrders, 550);
    mark('on orders');
    await d.sleep(1400);
    await d.shot('hover-orders');

    // Click to pin the light; it stays lit as the pointer heads for the bar.
    await d.click(onOrders.x, onOrders.y, { duration: 1 });
    mark('pinned');
    await d.sleep(300);
    const trigger = center(await waitDom(d, `${BAR} [title^="Row display"]`));
    await canvasSafeMoveTo(d, trigger, 650);
    await d.sleep(250);
    await d.click(trigger.x, trigger.y, { duration: 1 });
    mark('menu open');
    await d.sleep(500);
    await d.shot('menu');

    // Row display: Keys only. The cards grow, are laid out again and fitted.
    const keys = await waitMenuItem(d, 'Keys only', { scope: '.visualization-show-mode-menu' });
    await d.click(keys.x + keys.width * 0.62, keys.y + keys.height / 2, { duration: 400 });
    mark('keys only');
    await d.sleep(250);
    // Beside the bar, where no card reaches even zoomed in.
    await canvasSafeMoveTo(d, { x: 700, y: 498 }, 300);
    await d.sleep(900);
    await d.shot('keys-only');

    // ⌘ + wheel zooms about the middle of the screen; Fit brings it all back.
    await d.holding(['ControlOrMeta'], () => d.wheel(-100, { steps: 7, gap: 60 }), {
      label: ['⌘', 'wheel'],
    });
    mark('zoomed');
    await d.sleep(450);
    await d.shot('zoomed');
    await clickDom(d, `${BAR} [title="Fit"]`, { duration: 450 });
    mark('fit');
    await d.shot('fit');
    await d.sleep(1300);
    mark('end');
  },
};
