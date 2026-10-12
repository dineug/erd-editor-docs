import { seedSQL } from '../lib/seed.mjs';
import { glide } from './_misc-helpers.mjs';

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

/**
 * A point on a table's bottom border, below its last row: the lowest point
 * along x where a press lands on the table's own body rather than on a row.
 * A row lights up its remove × on hover and a press on any of its cells
 * focuses the row; the border does neither.
 */
const bottomEdgePoint = async (d, name, dx) => {
  const box = await d.tableBox(name);
  const x = box.x + box.width * dx;
  const y = await d.page.evaluate(
    ({ x, top, bottom }) => {
      const stage = window.__erdStages.canvas;
      const c = stage.container().getBoundingClientRect();
      for (let y = Math.floor(bottom); y > top; y -= 0.5) {
        const hit = stage.getIntersection({ x: x - c.left, y: y - c.top });
        if (hit?.name() === 'table-body') return y;
      }
      return null;
    },
    { x, top: box.y + box.height - 6, bottom: box.y + box.height }
  );
  if (y === null) throw new Error(`no border under the rows of ${name}`);
  return { x, y };
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
    // The child is outlined and the Map to existing columns / Create new
    // columns pill stands beside it; a press on the table itself creates new
    // columns. Hold so the buttons read before the click.
    await d.sleep(450);
    await d.shot('drawing');
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
    // Out over orders' top edge and down the gap right of it, so no column
    // row lights up on the way, then onto the button from straight above.
    // The run along the top edge stays 1px above the table: the spline would
    // bulge up into the header toolbar (y < 30) ahead of a sharper bend, so
    // the turn down is eased in over two points.
    const ordersBox = await d.tableBox('orders');
    const right = ordersBox.x + ordersBox.width;
    await glide(
      d,
      [
        { x: orders.x + 35, y: ordersBox.y - 1 },
        { x: right - 23, y: ordersBox.y - 3 },
        { x: right + 17, y: ordersBox.y + 2 },
        { x: right + 35, y: ordersBox.y + 40 },
        { x: right + 62, y: 260 },
        { x: zx, y: zeroN.y - 40 },
        { x: zx, y: zy },
      ],
      1000
    );
    await d.sleep(250);
    await d.shot('toolbar-hover');
    await d.click(zx, zy, { duration: 0 });
    await d.sleep(450);
    await d.shot('toolbar-armed');
    // On orders' bottom border under its comment column, reached from below:
    // the pointer leaves orders at once, long before the start table would
    // offer its own (self reference) pill 24px from the press; no row is
    // hovered or focused, so no remove × shows and no row stays lit through
    // the draw. Far enough right that orders' right side, which faces
    // payments, is the nearest one the preview starts from.
    const orders2 = await bottomEdgePoint(d, 'orders', 0.84);
    const payments = await headerPoint(d, 'payments', 0.35, 14);
    await d.click(orders2.x, orders2.y, { duration: 600 });
    await d.moveTo(payments.x, payments.y, 600);
    await d.sleep(450);
    await d.shot('drawing-2');
    await d.click(payments.x, payments.y);
    await d.whenDrawn();
    await d.sleep(400);
    // Off payments through its header's top edge, to rest in the empty canvas
    // above it, clear of both connectors.
    await d.moveTo(payments.x + 40, payments.y - 72, 500);
    await d.sleep(1300);
  },
};
