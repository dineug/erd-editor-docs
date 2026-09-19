import { seedSQL } from '../lib/seed.mjs';

// The shop tables with no foreign keys yet: the recorded session draws them.
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

const header = async (d, name, dx = 0.5) => {
  const box = await d.tableBox(name);
  return { x: box.x + box.width * dx, y: box.y + 14 };
};

/** A table dragged by its header, then a pause so the move lands as its own entry. */
const moveTable = async (d, name, dx, dy) => {
  const from = await header(d, name, 0.6);
  await d.drag(from, { x: from.x + dx, y: from.y + dy }, { duration: 200 });
  await d.sleep(400);
};

/** A relationship drawn from parent to child with the notation already armed. */
const connect = async (d, parent, child) => {
  const p = await header(d, parent, 0.6);
  await d.click(p.x, p.y, { duration: 100 });
  await d.sleep(150);
  const c = await header(d, child, 0.6);
  await d.click(c.x, c.y, { duration: 100 });
  await d.sleep(400);
};

/** Undo, Redo > Time Travel: open it, scrub back through the session, apply an earlier point. */
export default {
  name: 'demo-time-travel',
  width: 960,
  height: 540,
  async setup(d) {
    await seedSQL(d, SQL, {
      // Placed so no table covers another table or a connector at any point
      // of the session. Column comments are off to leave room for that.
      tables: {
        members: { x: 60, y: 40 },
        orders: { x: 380, y: 300 },
        payments: { x: 480, y: 20 },
      },
      settings: { databaseName: 'shop', show: 1 | 4 | 32 | 128 | 256 },
    });

    // The session Time Travel replays, made through the UI so each step is recorded.
    await d.page.mouse.click(700, 250);
    await moveTable(d, 'orders', 160, -110);
    await d.page.keyboard.press('ControlOrMeta+Alt+Digit4');
    await connect(d, 'members', 'orders');
    await moveTable(d, 'payments', -420, 260);
    await d.page.keyboard.press('ControlOrMeta+Alt+Digit2');
    await connect(d, 'orders', 'payments');
    await d.page.mouse.click(700, 470);
    await d.moveTo(700, 470, 0);
    await d.sleep(300);
  },
  async scenario(d) {
    await d.sleep(500);
    const button = await d.domBox('.undo-redo[title="Time Travel"]');
    await d.click(button.x + button.width / 2, button.y + button.height / 2, { duration: 450 });
    await d.sleep(550);
    await d.shot('open');

    // The slider runs from one step before the first change (-1) to the current state.
    const { track, steps } = await d.page.evaluate(() => {
      const root = window.__erdShadowRoot;
      const apply = [...root.querySelectorAll('button')].find(b => b.textContent.trim() === 'Apply');
      const slider = apply.parentElement.firstElementChild;
      const r = slider.getBoundingClientRect();
      return { track: { x: r.left, y: r.top + r.height / 2, width: r.width }, steps: 4 };
    });
    const at = step => track.x + (track.width * (step + 1)) / steps;
    const thumb = { x: at(steps - 1), y: track.y };

    await d.moveTo(thumb.x - 6, thumb.y, 480);
    await d.sleep(150);
    await d.page.mouse.down();
    for (const step of [2, 1, 0, -1]) {
      await d.moveTo(at(step) + (step === -1 ? 4 : 0), track.y, 360);
      await d.sleep(step === -1 ? 950 : 850);
      await d.shot(`step${step}`);
    }
    // Forward again to the first change, and keep that one.
    await d.moveTo(at(0), track.y, 420);
    await d.sleep(700);
    await d.page.mouse.up();
    await d.shot('step0-again');
    await d.sleep(150);

    const apply = await d.page.evaluate(() => {
      const el = [...window.__erdShadowRoot.querySelectorAll('button')].find(
        b => b.textContent.trim() === 'Apply'
      );
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    await d.click(apply.x, apply.y, { duration: 450 });
    await d.sleep(350);
    await d.moveTo(700, 470, 380);
    await d.sleep(1300);
  },
};
