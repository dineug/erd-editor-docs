/**
 * The hero clip for the introduction page and the homepage: a colored shop
 * diagram, a connector lighting up the columns it joins, a column typed in
 * with DataType autocomplete, ⌥ + F into the Visualization tab's Flow,
 * narrowed to orders and its neighbours, and back to the ERD.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import { glide, timeline, toolbarButtonBox, waitDom } from './_misc-helpers.mjs';

const WIDTH = 960;
const HEIGHT = 540;
const ZOOM = 0.8;

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;

const BLUE = '#0090ff';
const AMBER = '#ffb224';
const GREEN = '#46a758';
const PURPLE = '#8e4ec6';

// Where rows begin on screen, and half a column row at this zoom: five-column
// tables are raised by it so their side connectors meet four-column ones level.
const ROW1 = 85;
const ROW2 = 277;
const HALF_ROW = 9.6;

/** A table placed by where its top-left corner lands on screen. */
const at = (x, y, color) => ({ x: x / ZOOM, y: (y - 30) / ZOOM, color });

// Every connector runs straight. The table that gains a column, categories,
// meets only products, directly under it: a side connector would pick up a
// jog as the table grows, since it leaves from the middle of the side.
// Catalog on the left, orders in the middle, members over orders.
//
// Categories (two columns) is centred on the four-column tables beside it,
// which also brings it closer to products. A non-identifying route is dashed
// (10 on, 10 off), and a vertical one longer than about 88px at this zoom
// shows a dash gap mid-line that reads as a broken connector; from its top
// row, categories' route would be 99px. Centred, it is 80px before the new
// row and 61px after, solid both times.
const TABLES = {
  categories: at(31.6, ROW1 + 2 * HALF_ROW, GREEN),
  addresses: at(264, ROW1, BLUE),
  members: at(502.8, ROW1, BLUE),
  products: at(28, ROW2 - HALF_ROW, GREEN),
  order_items: at(269.2, ROW2, AMBER),
  orders: at(504.8, ROW2, AMBER),
  payments: at(738, ROW2 - HALF_ROW, PURPLE),
};

// Pointer stops, in viewport pixels for the layout above. It rests in the
// gap right of members, where the clip also starts, and waits in the gap left
// of addresses while the type is picked, clear of the list under the type
// cell. Paths between them bend through the gaps between tables, so no table
// flashes its hover buttons on the way past.
const REST = { x: 712, y: 236 };
const PARK = { x: 234, y: 128 };
const TO_CATEGORIES = [
  { x: 330, y: 240 },
  { x: 236, y: 222 },
  { x: 232, y: 162 },
];
const TO_ORDERS = [
  { x: 234, y: 216 },
  { x: 300, y: 240 },
  { x: 530, y: 240 },
];
const TO_REST = [
  { x: 216, y: 58 },
  { x: 470, y: 62 },
  { x: 730, y: 64 },
];

/** Stable viewport box of a table card, once it has stopped moving. */
async function settledBox(d, name, { timeout = 8000 } = {}) {
  const until = Date.now() + timeout;
  let previous = '';
  let same = 0;
  for (;;) {
    await d.sleep(150);
    const box = await d.tableBox(name).catch(() => null);
    const key = JSON.stringify(box);
    same = box && key === previous ? same + 1 : 0;
    previous = key;
    if (same >= 4) return box;
    if (Date.now() > until) throw new Error(`${name} never settled`);
  }
}

/**
 * Opens the Flow focused on a table once, off camera, and goes back to the
 * ERD. The first ⌥ + F paints the tables where the ERD has them, at 100%,
 * until ELK answers and the view is fitted; the view keeps that landing for
 * the session, so the recorded ⌥ + F opens straight onto it.
 */
async function warmFlow(d, table) {
  const box = await d.tableBox(table);
  await d.click(box.x + box.width * 0.3, box.y + 12, { duration: 0 });
  await d.page.keyboard.press('Alt+KeyF');
  await waitDom(d, '.visualization-toolbar');
  await settledBox(d, table);
  const erd = await toolbarButtonBox(d, 'Entity Relationship Diagram');
  await d.click(erd.x + erd.width / 2, erd.y + erd.height / 2, { duration: 0 });
  await settledBox(d, table);
  // Clear the selection on empty canvas, right of members.
  await d.click(REST.x, REST.y, { duration: 0 });
  await d.whenDrawn();
}

export default {
  name: 'demo-overview',
  width: WIDTH,
  height: HEIGHT,
  // The lossy encoder leaves faint ghosts of the keycaps, the pointer's path
  // and the ERD under the Flow; lossless costs about 40% more here.
  lossless: true,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: Object.keys(TABLES),
      tables: TABLES,
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: ZOOM },
    });
    await warmFlow(d, 'orders');
    await d.moveTo(REST.x, REST.y, 0);
  },
  async scenario(d) {
    const mark = timeline();
    await d.sleep(450);

    // A connector: members to orders lights the two columns it joins.
    const members = await d.tableBox('members');
    const orders = await d.tableBox('orders');
    const link = {
      x: orders.x + orders.width / 2 + 4,
      y: (members.y + members.height + orders.y) / 2,
    };
    await d.moveTo(link.x, link.y, 500);
    mark('hover link');
    await d.sleep(750);
    await d.shot('hover-link');

    // A new column on categories, its type picked from the autocomplete.
    const name = await d.columnBox('categories', 'name');
    const nameCell = { x: name.x + 60, y: name.y + name.height / 2 };
    await glide(d, [...TO_CATEGORIES, nameCell], 760);
    await d.click(nameCell.x, nameCell.y);
    await d.sleep(200);
    await d.press('Alt+Enter', { hold: 750 });
    mark('column added');
    await d.shot('added');
    await d.moveTo(PARK.x, PARK.y, 320);
    await d.press('Enter', { badge: false });
    await d.sleep(100);
    await d.type('parent_id', 42);
    await d.press('Tab', { badge: false });
    await d.sleep(280);
    // In one input event: 'b' and 'bi' each match most of the type list, which
    // runs off the bottom of the frame for as long as either stands, and even
    // typed 40ms apart they held it on screen for three frames.
    await d.page.keyboard.insertText('big');
    await d.sleep(550);
    mark('autocomplete');
    await d.shot('autocomplete');
    await d.press('ArrowDown', { badge: false });
    await d.sleep(300);
    await d.press('Enter', { badge: false });
    mark('type picked');
    await d.sleep(450);
    await d.shot('column');

    // Select orders, then ⌥ + F: Flow, narrowed to orders and the tables one
    // relationship away. The click lands mid-header, above the name and left
    // of the members connector: the header's right end holds the add-column
    // and remove buttons.
    const ordersNow = await d.tableBox('orders');
    const header = { x: ordersNow.x + ordersNow.width * 0.3, y: ordersNow.y + 12 };
    await glide(d, [...TO_ORDERS, header], 720);
    await d.click(header.x, header.y);
    mark('orders selected');
    await d.sleep(160);
    await d.shot('selected');
    await d.press('Alt+KeyF', { hold: 750 });
    mark('focus');
    await waitDom(d, '.visualization-toolbar');
    await d.sleep(450);
    await d.shot('flow');

    // Hover the orders card: it lights up with its neighbours.
    const card = await d.tableBox('orders');
    // On the header, past the name and short of the icons that appear on
    // hover. The card's box carries a 16px margin for its glow.
    await d.moveTo(card.x + card.width * 0.54, card.y + 30, 450);
    mark('hover card');
    await d.sleep(850);
    await d.shot('lit');

    // Back to the diagram.
    const erd = await toolbarButtonBox(d, 'Entity Relationship Diagram');
    await d.click(erd.x + erd.width / 2, erd.y + erd.height / 2, { duration: 380 });
    mark('back');
    // Off the toolbar: down into the canvas, along above the first row and
    // down the gap right of members, so the held frame shows every icon and
    // no table or toolbar button is hovered on the way.
    await d.sleep(60);
    await glide(d, [...TO_REST, REST], 640);
    await d.sleep(1350);
    await d.shot('rest');
    mark('end');
  },
};
