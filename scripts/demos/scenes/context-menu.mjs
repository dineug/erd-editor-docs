/** Editing Start: the canvas context menu, New Table, then a table's own menu. */

/** Viewport box of a context menu entry by its visible name. */
const menuItem = (d, name) =>
  d.page.evaluate(name => {
    const root = window.__erdShadowRoot;
    const rows = [...root.querySelectorAll('.context-menu-content [data-id]')];
    const el = rows.find(
      row => row.firstElementChild?.textContent.trim().startsWith(name)
    );
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, width: r.width, height: r.height };
  }, name);

export default {
  name: 'demo-context-menu',
  width: 800,
  height: 450,
  async setup(d) {
    await d.page.evaluate(() => {
      const editor = document.querySelector('erd-editor');
      const doc = JSON.parse(editor.value);
      doc.settings.databaseName = 'shop';
      editor.setInitialValue(JSON.stringify(doc));
    });
    await d.moveTo(600, 250, 0);
  },
  async scenario(d) {
    await d.sleep(500);
    await d.rightClick(330, 64, { duration: 450 });
    await d.sleep(550);
    await d.shot('menu');

    // Glide down the entries, into the Relationship submenu and back.
    for (const name of ['New Table', 'New Memo', 'Relationship']) {
      const b = await menuItem(d, name);
      await d.moveTo(b.x + 150, b.y + b.height / 2, 260);
      await d.sleep(160);
    }
    await d.sleep(250);
    const zeroOne = await menuItem(d, 'Zero One');
    const oneN = await menuItem(d, 'One N');
    await d.moveTo(zeroOne.x + 110, zeroOne.y + zeroOne.height / 2, 260);
    await d.moveTo(oneN.x + 110, oneN.y + oneN.height / 2, 420);
    await d.sleep(550);
    await d.shot('submenu');

    // Back to the top and create a table. Straight up inside the submenu, then
    // left onto Relationship along its own row, so the pointer never crosses
    // another parent entry (View Option would flash its submenu open).
    const relationship = await menuItem(d, 'Relationship');
    const rowY = Math.max(
      zeroOne.y + 3,
      Math.min(zeroOne.y + zeroOne.height - 3, relationship.y + relationship.height / 2)
    );
    await d.moveTo(oneN.x + 110, rowY, 420);
    await d.sleep(120);
    await d.moveTo(relationship.x + 150, rowY, 320);
    await d.sleep(120);
    const newTable = await menuItem(d, 'New Table');
    await d.click(newTable.x + 90, newTable.y + newTable.height / 2, { duration: 320 });
    await d.whenDrawn();
    await d.sleep(800);
    await d.shot('table');

    // A table opens its own menu.
    const table = await d.nodeBox('.table-header');
    await d.rightClick(table.x + table.width * 0.6, table.y + 12, { duration: 420 });
    await d.sleep(400);
    const primaryKey = await menuItem(d, 'Primary Key');
    const color = await menuItem(d, 'Color');
    await d.moveTo(primaryKey.x + 150, primaryKey.y + primaryKey.height / 2, 240);
    await d.moveTo(color.x + 150, color.y + color.height / 2, 520);
    await d.sleep(550);
    await d.shot('table-menu');
    await d.press('Escape');
    await d.sleep(1400);
  },
};
