/**
 * Visualization, Graph Mode: open the tab, let the force graph settle, hover a
 * table for its preview and neighbourhood, pull a node around, then wheel out
 * and back in so the table names fade away and return.
 */
import { readSeed, seedSQL } from '../lib/seed.mjs';
import {
  clickDom,
  dropStrayColumns,
  graphClearPoint,
  graphDots,
  graphHoverLog,
  graphDrag,
  graphRouteMoveTo,
  graphStepOff,
  graphTables,
  tabSelector,
  timer,
  watchGraphHovers,
} from './_vsc-helpers.mjs';

// Name, data type and NOT NULL, with the relationship lines: sakila carries no
// comments or defaults worth a column, so the preview stays narrow. The
// connectors' D:/U: referential action labels are hidden (1024): sakila sets
// ON DELETE and ON UPDATE on every foreign key, and in the tight ERD layout the
// clip opens on the tables would cover half of each label.
const SHOW = 4 | 32 | 128 | 256 | 1024;

/**
 * Eleven sakila tables (film_text, actor, film_actor, language and payment are
 * left out, so the graph fits the frame at 100%), in the document order that
 * lays them out without a relationship line running through another table's
 * dot or label. The forces place a fresh graph from the node order, so this
 * order is what makes the layout below repeat on every run.
 */
const ORDER = [
  'film',
  'country',
  'category',
  'address',
  'store',
  'city',
  'rental',
  'inventory',
  'customer',
  'staff',
  'film_category',
];

// The ERD tab the clip opens on, at 72%: two tidy rows in view with the
// minimap over empty canvas, and the rest of the tables out of frame. Schema
// SQL import keeps sakila's UNSIGNED in the data types, so the tables run
// about 310 wide: three fit side by side only below the minimap, and the top
// row keeps two. The floating toolbar (about 544px wide since 4.2.0) spans
// the middle of the bottom edge, and address, eight rows tall and too wide
// to sit left of it, ends above it only below 75%; at 70% and under, the
// tables would draw as bare names. city and staff start just below the
// frame, so no sliver of them shows under the bar.
const ERD_ZOOM = 0.72;
const ERD = {
  customer: { x: 24, y: 24 },
  rental: { x: 370, y: 24 },
  address: { x: 24, y: 320 },
  store: { x: 370, y: 320 },
  inventory: { x: 744, y: 320 },
  city: { x: 24, y: 700 },
  country: { x: 24, y: 880 },
  staff: { x: 370, y: 700 },
  film: { x: 1300, y: 24 },
  film_category: { x: 1300, y: 440 },
  category: { x: 1660, y: 440 },
};

// Eight notches of 50px each way: out to 45%, where no name shows, and back
// to exactly 100%.
const NOTCH = 50;
const NOTCHES = 8;
const OUT_SCALE = Math.exp(-NOTCH * 0.002 * NOTCHES);

/**
 * The clear point near the pointer to wheel back in about that leaves the
 * graph at 100% with the most room above the Graph toolbar (for the dots over
 * it, names included) and below the top toolbar, the nearest such point when
 * several tie. Wheeling out about A and in about B moves the view by
 * (A - B)(1/s - 1), s being the zoomed-out scale.
 */
async function backInPoint(d) {
  await d.whenDrawn();
  const dots = await graphDots(d);
  const bar = await d.domBox('.visualization-toolbar');
  const a = d.mouse;
  const found = [];
  for (let dy = -30; dy <= 60; dy += 2) {
    for (let dx = -24; dx <= 24; dx += 2) {
      const b = { x: a.x + dx, y: a.y + dy };
      if (dots.some(q => Math.hypot(q.x - b.x, q.y - b.y) < 8)) continue;
      let room = Infinity;
      let left = Infinity;
      let right = -Infinity;
      for (const q of dots) {
        const p = { x: b.x + (q.x - b.x) / OUT_SCALE, y: b.y + (q.y - b.y) / OUT_SCALE };
        room = Math.min(room, p.y - 6 - 30);
        left = Math.min(left, p.x);
        right = Math.max(right, p.x);
        if (p.x > bar.x - 40 && p.x < bar.x + bar.width + 40) {
          room = Math.min(room, bar.y - (p.y + (q.table ? 26 : 5)));
        }
      }
      const offCentre = Math.abs((left + right) / 2 - d.width / 2);
      found.push({ ...b, room, offCentre, move: Math.hypot(dx, dy) });
    }
  }
  const most = Math.max(...found.map(f => f.room));
  // Roomy enough, then the graph kept in the middle, then the nearest.
  const roomy = found.filter(f => f.room >= Math.min(most, 32) - 2);
  const centred = Math.min(...roomy.map(f => f.offCentre));
  const best = roomy
    .filter(f => f.offCentre <= Math.max(centred, 24))
    .sort((p, q) => p.move - q.move)[0];
  if (process.env.DEMO_TIMING) {
    const ys = dots.map(q => best.y + (q.y - best.y) / OUT_SCALE);
    console.log(`  back in: room ${Math.round(best.room)} of ${Math.round(most)}, off centre ${Math.round(best.offCentre)}, predicted dots y ${Math.round(Math.min(...ys))}..${Math.round(Math.max(...ys))}, move ${Math.round(best.x - a.x)},${Math.round(best.y - a.y)}`);
  }
  return best;
}

export default {
  name: 'demo-visualization',
  width: 880,
  height: 495,
  // The whole graph moves for most of the clip, while it settles and after
  // the drag, so lossless is about 9MB. Lossy at 80 is under 3MB; at 60 the
  // encoder's change tolerance left stale links behind the moving nodes.
  lossless: false,
  quality: 80,
  async setup(d) {
    await seedSQL(d, readSeed('sakila.sql'), {
      only: ORDER,
      tables: ERD,
      settings: { databaseName: 'sakila', show: SHOW, zoomLevel: ERD_ZOOM },
      patch(doc) {
        dropStrayColumns(doc);
        const name = id => doc.collections.tableEntities[id].name;
        doc.doc.tableIds.sort((a, b) => ORDER.indexOf(name(a)) - ORDER.indexOf(name(b)));
      },
    });
    // The pointer waits in the gap between customer and rental, under the
    // Visualization tab: from the middle of the frame its way up would cross
    // rental and light it, and any other way in runs over a connector or
    // along the neighbouring tabs.
    const customer = await d.tableBox('customer');
    const rental = await d.tableBox('rental');
    await d.moveTo((customer.x + customer.width + rental.x) / 2, customer.y + 24, 0);
  },
  async scenario(d) {
    const mark = timer();
    if (process.env.DEMO_TIMING) {
      const r = b => [b.x, b.y, b.x + b.width, b.y + b.height].map(Math.round).join(',');
      const bar = await d.domBox('.floating-toolbar');
      const tab = await d.domBox(tabSelector('Visualization'));
      console.log(`  bar ${r(bar)}, tab ${r(tab)}, pointer ${Math.round(d.mouse.x)},${Math.round(d.mouse.y)}`);
      for (const name of ['customer', 'rental', 'address', 'store', 'inventory']) {
        console.log(`  ${name} ${r(await d.tableBox(name))}`);
      }
    }
    await d.sleep(500);
    // Into the tab right of its middle, so the way up stays clear of
    // customer's corner and of the next tab.
    await clickDom(d, tabSelector('Visualization'), { duration: 450, dx: 4 });
    mark('tab clicked');
    await watchGraphHovers(d);
    // The forces lay the graph out while the pointer drifts clear of it.
    await d.moveTo(240, 105, 500);
    await d.sleep(600);
    await d.shot('settling');

    // rental lights inventory, customer and staff, all above or left of it,
    // and its preview opens over the faded middle of the graph.
    let nodes = await graphTables(d);
    mark('route rental');
    // Resting on the top edge of the dot keeps the hand off the name below.
    await graphRouteMoveTo(d, { x: nodes.rental.x - 2, y: nodes.rental.y - 6 }, 480);
    mark('hover rental');
    await d.sleep(1200);
    await d.shot('hover-rental');

    // Step up off rental, away from its preview (which would catch the
    // pointer), then grab category and pull it out to the right: its
    // columns come along, and so does film_category at the end of its link.
    await graphStepOff(d, 'rental', { dx: 0.2, dy: -1 });
    nodes = await graphTables(d);
    await graphRouteMoveTo(d, nodes.category, 650, { stopShort: 16 });
    await d.sleep(80);
    mark('drag start');
    const from = (await graphTables(d)).category;
    const to = { x: from.x + 150, y: from.y - 70 };
    await graphDrag(d, 'category', to, { steps: 46, off: { x: to.x + 16, y: to.y - 12 } });
    mark('drag end');
    await d.shot('released');
    // category springs back and the layout settles while the pointer rests.
    await d.sleep(350);

    // Wheel out and back in about clear points in the middle of the graph:
    // the names fade below 100%, are gone under 50%, and return on the way
    // back in. The same notches each way end on exactly 100%.
    nodes = await graphTables(d);
    const spot = await graphClearPoint(d, { x: (nodes.store.x + nodes.city.x) / 2, y: nodes.store.y - 10 }, 30);
    await graphRouteMoveTo(d, spot, 500, { margin: 1.2 });
    mark('wheel out');
    await d.wheel(NOTCH, { steps: NOTCHES, gap: 45 });
    await d.shot('zoomed-out');
    // The graph opens a little low for the bar, so the wheel comes back in a
    // few px below where it went out: that lifts the graph clear of the bar at
    // 100%.
    const back = await backInPoint(d);
    await graphRouteMoveTo(d, back, 320, { margin: 0.4 });
    await d.sleep(80);
    mark('wheel in');
    await d.wheel(-NOTCH, { steps: NOTCHES, gap: 45 });
    await d.shot('zoomed-in');
    // Park the pointer off the graph for the hold.
    await d.sleep(120);
    const park = await graphClearPoint(d, { x: d.width - 110, y: d.height - 150 }, 30);
    await graphRouteMoveTo(d, park, 450);
    mark('hold');
    await d.sleep(1300);
    mark('end');
    if (process.env.DEMO_TIMING) {
      const ys = (await graphDots(d)).map(q => q.y);
      console.log(`  final dots y ${Math.round(Math.min(...ys))}..${Math.round(Math.max(...ys))}`);
    }
    if (process.env.DEMO_TIMING) console.log('  hovers', JSON.stringify(await graphHoverLog(d)));
  },
};
