import { seedSQL } from '../lib/seed.mjs';

// Three shop tables with their foreign keys left out, for the clip to draw them.
// Each key is named after its table, so the column copied to the child reads as a foreign key.
const SQL = `
CREATE TABLE members (
  member_id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Member ID',
  email VARCHAR(255) NOT NULL COMMENT 'Login email',
  nickname VARCHAR(50) NOT NULL COMMENT 'Display name',
  PRIMARY KEY (member_id)
) COMMENT 'Registered users';

CREATE TABLE orders (
  order_id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Order ID',
  status VARCHAR(20) NOT NULL COMMENT 'Order status',
  ordered_at DATETIME NOT NULL COMMENT 'Ordered at',
  PRIMARY KEY (order_id)
) COMMENT 'Customer orders';

CREATE TABLE payments (
  payment_id BIGINT NOT NULL AUTO_INCREMENT COMMENT 'Payment ID',
  method VARCHAR(20) NOT NULL COMMENT 'Payment method',
  amount DECIMAL(10,2) NOT NULL COMMENT 'Paid amount',
  PRIMARY KEY (payment_id)
) COMMENT 'Payment records';
`;

/**
 * A new relationship is painted once with both ends at scene (0, 0), a frame
 * before the sort places them: a stub flashes at the scene origin while the
 * preview is already gone and the connector not yet drawn. The tables sit this
 * far into the scene and the view is scrolled by the same amount, so they land
 * where they would at the origin and nothing legitimate is ever drawn near it.
 */
const OFFSET = 400;

/**
 * A point on a table's header, where a click selects the table. The preview
 * starts from the side midpoint of the parent nearest the pointer, so parents
 * are pressed close to the side that faces the child.
 */
const headerPoint = async (d, name, dx = 0.5, dy = 14) => {
  const box = await d.tableBox(name);
  return { x: box.x + box.width * dx, y: box.y + dy };
};

/** Editing Start > Relationship Creation: ⌘⌥4 then parent, child; then from the canvas toolbar. */
export default {
  name: 'demo-relationship',
  width: 960,
  height: 540,
  async setup(d) {
    // orders above members, centred on it, so the first connector runs from
    // members' top to orders' bottom; payments to the right, so the second one
    // leaves orders from its right side, away from the first.
    const at = (x, y) => ({ x: x + OFFSET, y: y + OFFSET });
    await seedSQL(d, SQL, {
      tables: {
        orders: at(46, 20),
        members: at(40, 300),
        payments: at(520, 250),
      },
      settings: {
        databaseName: 'shop',
        show: 1 | 2 | 4 | 32 | 128 | 256,
        originX: -OFFSET,
        originY: -OFFSET,
      },
    });
    await d.page.mouse.click(620, 110);
    await d.moveTo(620, 110, 0);

    // The editor mounts the dashed relationship preview with its end at the
    // scene origin and only moves it on the next mousemove, so for a frame or
    // more a line shoots off to the top-left corner. A mousemove right where
    // the pointer already is, fired as soon as a press is handled, anchors the
    // preview to the pointer before it is ever painted.
    await d.page.evaluate(() => {
      window.addEventListener(
        'mousedown',
        event => {
          const target = event.composedPath()[0];
          const init = {
            clientX: event.clientX,
            clientY: event.clientY,
            bubbles: true,
            composed: true,
          };
          const fire = () => {
            if (target.isConnected) target.dispatchEvent(new MouseEvent('mousemove', init));
          };
          requestAnimationFrame(fire);
          setTimeout(fire, 0);
        },
        true
      );
    });

    // While a new relationship is still unplaced (see OFFSET), its draws are
    // held back: the connector goes to the drag layer under the pressed table
    // and the preview leaves the scene layer on separate draws a frame apart.
    // Both layers are painted together once the connector is placed, so the
    // preview is swapped for the connector with no empty frame in between.
    await d.page.evaluate(limit => {
      const layers = window.__erdStages.canvas
        .getLayers()
        .filter(layer => ['canvas-background', 'scene'].includes(layer.name()));
      const draw = new Map(layers.map(layer => [layer, layer.drawScene]));
      const held = new Set();
      let since = 0;
      const unplaced = () =>
        layers.some(layer =>
          layer.find('.relationship-route').some(route => {
            const { x, y } = route.getSelfRect();
            return x < limit && y < limit;
          })
        );
      for (const layer of layers) {
        layer.drawScene = function (...args) {
          // Held for a few frames at most, should the sort never come.
          if (unplaced() && performance.now() - (since ||= performance.now()) < 150) {
            held.add(this);
            return this;
          }
          since = 0;
          held.delete(this);
          draw.get(this).apply(this, args);
          for (const other of held) draw.get(other).call(other);
          held.clear();
          return this;
        };
      }
    }, OFFSET / 4);
  },
  async scenario(d) {
    await d.sleep(500);
    await d.press('ControlOrMeta+Alt+Digit4');
    await d.sleep(500);
    await d.shot('armed');

    // members' header, near its top side, which faces orders.
    const members = await headerPoint(d, 'members', 0.5, 12);
    const orders = await headerPoint(d, 'orders', 0.5, 14);
    await d.click(members.x, members.y, { duration: 500 });
    await d.moveTo(orders.x, orders.y, 600);
    await d.shot('drawing');
    await d.sleep(150);
    await d.click(orders.x, orders.y);
    await d.whenDrawn();
    await d.sleep(900);
    await d.shot('one-n');

    // The same from the canvas toolbar, in Zero N.
    // Hover, then click the button's bottom edge: the hand glyph hangs below
    // the hotspot, so the notation icon stays in sight.
    const zeroN = await d.domBox('.floating-toolbar > [title^="Zero N"]');
    const zx = zeroN.x + zeroN.width / 2 + 2;
    const zy = zeroN.y + zeroN.height - 3;
    await d.moveTo(zx, zy, 650);
    await d.sleep(250);
    await d.shot('toolbar-hover');
    await d.click(zx, zy, { duration: 0 });
    await d.sleep(450);
    await d.shot('toolbar-armed');
    // The right end of orders' name row, below the header's add/remove
    // buttons: its right side faces payments.
    const orders2 = await headerPoint(d, 'orders', 0.9, 34);
    const payments = await headerPoint(d, 'payments', 0.35, 14);
    await d.click(orders2.x, orders2.y, { duration: 600 });
    await d.moveTo(payments.x, payments.y, 600);
    await d.shot('drawing-2');
    await d.sleep(150);
    await d.click(payments.x, payments.y);
    await d.whenDrawn();
    await d.sleep(400);
    await d.moveTo(720, 480, 500);
    await d.sleep(1300);
  },
};
