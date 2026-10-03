import {
  glideTo,
  hoverPoint,
  menuItemBox,
  routePoint,
  seedShop,
} from './_relationship-editing-helpers.mjs';

/**
 * Headless Chromium draws no native tooltips, so the one a connector gives the
 * canvas (the `title` its container carries while the pointer rests on a
 * connector that sets an action) is painted here: its own text, below the
 * pointer, once the pointer has rested as long as a browser waits.
 */
function paintNativeTooltip(d) {
  return d.page.evaluate(() => {
    const container = window.__erdStages.canvas.container();
    const tip = document.createElement('div');
    tip.id = 'demo-tooltip';
    Object.assign(tip.style, {
      position: 'fixed',
      zIndex: '2147483645',
      pointerEvents: 'none',
      padding: '3px 7px',
      borderRadius: '4px',
      background: '#f4f4f5',
      color: '#18181b',
      border: '1px solid rgba(0,0,0,.2)',
      boxShadow: '0 3px 10px rgba(0,0,0,.4)',
      font: '12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',
      whiteSpace: 'pre',
      opacity: '0',
      transition: 'opacity .12s ease',
    });
    document.body.appendChild(tip);

    let x = 0;
    let y = 0;
    let movedAt = 0;
    window.addEventListener(
      'mousemove',
      event => {
        x = event.clientX;
        y = event.clientY;
        movedAt = performance.now();
      },
      { capture: true, passive: true }
    );

    let shown = '';
    const tick = () => {
      const title = container.getAttribute('title') ?? '';
      if (!title) {
        shown = '';
        tip.style.opacity = '0';
      } else if (title !== shown && performance.now() - movedAt > 650) {
        shown = title;
        tip.textContent = title;
        const width = tip.offsetWidth;
        tip.style.left = `${Math.min(x + 2, innerWidth - width - 8)}px`;
        tip.style.top = `${y + 22}px`;
        tip.style.opacity = '1';
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Opens the On Delete or On Update submenu from the menu's inner left margin,
 * so the pointer crosses no other row on the way, and then moves into the
 * submenu level with that row: its first row, Not set, sits level with it.
 */
async function openActions(d, name) {
  const row = await menuItemBox(d, name);
  const y = row.y + row.height / 2;
  await d.moveTo(row.x - 4, y, 300);
  await d.moveTo(row.x + 125, y, 350);
  await d.sleep(480);
  await d.shot(name.toLowerCase().replace(' ', '-'));
  const sub = await menuItemBox(d, 'Not set');
  // The submenu opens to the left of the menu when the right has no room.
  const x = sub.x < row.x ? sub.x + sub.width - 40 : sub.x + 40;
  await d.moveTo(x, y, 300);
}

/** Moves down the open submenu onto an action and clicks it. */
async function pick(d, name) {
  const item = await menuItemBox(d, name);
  const target = { x: item.x + 110, y: item.y + item.height / 2 };
  await d.moveTo(target.x, target.y, 400);
  await d.sleep(260);
  await d.click(target.x, target.y, { duration: 80 });
}

/**
 * Relationship Editing > ON DELETE and ON UPDATE: the orders -> order_items
 * connector gets ON DELETE CASCADE and then ON UPDATE RESTRICT from its
 * context menu. The label at the order_items end reads D:C, then D:C U:R,
 * and hovering the connector spells both clauses out in its tooltip.
 */
export default {
  name: 'demo-referential-actions',
  width: 800,
  height: 450,
  async setup(d) {
    await seedShop(d, {
      only: ['orders', 'order_items'],
      tables: {
        // The parent at the top left and the child below on the right: the
        // menus open from the parent end, the submenus flip left over the
        // parent, and the child end and its label stay clear of all of them.
        orders: { x: 40, y: 30 },
        order_items: { x: 480, y: 200 },
      },
    });
    await paintNativeTooltip(d);
    await d.moveTo(420, 60, 50);
  },
  async scenario(d) {
    await d.sleep(500);
    const route = await routePoint(d, 'orders', 'order_items', 0.02);
    await d.moveTo(route.x, route.y, 600);
    await d.sleep(400);
    await d.rightClick(route.x, route.y, { duration: 100 });
    await d.sleep(400);
    await d.shot('menu');

    await openActions(d, 'On Delete');
    await pick(d, 'CASCADE');
    await d.sleep(800);
    await d.shot('cascade');

    await openActions(d, 'On Update');
    await pick(d, 'RESTRICT');
    await d.sleep(800);
    await d.shot('restrict');

    // Down and out of the submenu, below the RESTRICT label rather than
    // across it, to the empty canvas where a click closes the menu; then
    // around below orders and up between it and the connector, onto the run
    // leaving orders, so the tooltip opens over empty canvas.
    const restrict = await menuItemBox(d, 'RESTRICT');
    await d.click(restrict.x - 30, restrict.y + restrict.height + 24, { duration: 400 });
    await d.sleep(150);
    const hover = await hoverPoint(d, 'orders', 'order_items', 0.05);
    await glideTo(d, hover, 700, [
      { x: 300, y: 380 },
      { x: 340, y: 220 },
    ]);
    await d.sleep(2000);
    await d.shot('tooltip');
  },
};
