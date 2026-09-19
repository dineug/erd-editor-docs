/**
 * The site's og:image: the shop diagram in color, framed for a 1200x630 link
 * preview.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';

const WIDTH = 1200;
const HEIGHT = 630;
const ZOOM = 0.95;
const TOP = 30; // the toolbar

// Table comment, data type, primary key and relationships.
const SHOW = 1 | 4 | 32 | 256;

const BLUE = '#0090ff';
const PINK = '#e93d82';
const AMBER = '#ffb224';
const GREEN = '#46a758';

/** A table placed by where its top-left corner lands on screen. */
const at = (x, y, color) => ({ x: x / ZOOM, y: (y - TOP) / ZOOM, color });

// Customers over orders, with reviews and products closing the ring on the
// right; the block sits midway between the toolbar and the canvas toolbar.
// Taller tables are raised by half the difference so connectors run straight.
const TABLES = {
  addresses: at(40, 106, BLUE),
  members: at(340, 106, BLUE),
  reviews: at(800, 94.5, PINK),
  payments: at(40, 344.5, AMBER),
  orders: at(342, 356, AMBER),
  order_items: at(640, 356, AMBER),
  products: at(940, 344.5, GREEN),
};

export default {
  name: 'still-social-card',
  width: WIDTH,
  height: HEIGHT,
  scale: 1,
  stillOnly: true,
  async setup(d) {
    await seedSQL(d, readSeed('shop.sql'), {
      only: Object.keys(TABLES),
      tables: TABLES,
      settings: { databaseName: 'shop', show: SHOW, zoomLevel: ZOOM },
    });
    await d.moveTo(WIDTH - 5, HEIGHT - 5, 0);
  },
  async scenario(d) {
    await d.still('social-card.png');
  },
};
