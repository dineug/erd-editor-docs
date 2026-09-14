/** Where the pointer waits, clear of the new table and its suggestion lists. */
const PARK = { x: 790, y: 300 };

/**
 * Table Editing: an Excel-like grid. A table made from the keyboard is filled
 * in with Enter and Tab, and a double-click opens a cell for editing too.
 */
export default {
  name: 'demo-table-edit',
  // Wide enough that the zoomed table ends left of the minimap, tall enough
  // that its suggestion lists end well above the floating toolbar.
  width: 900,
  height: 470,
  async setup(d) {
    await d.page.evaluate(() => {
      const editor = document.querySelector('erd-editor');
      const doc = JSON.parse(editor.value);
      doc.settings.databaseName = 'shop';
      // Zoomed in so the new table and its suggestion lists fill the frame.
      doc.settings.zoomLevel = 1.3;
      editor.setInitialValue(JSON.stringify(doc));
    });
    // The keycaps sit right of center, off the suggestion lists.
    await d.page.evaluate(() => document.getElementById('demo-keys').style.setProperty('left', '76%'));
    // Give the canvas keyboard focus before the clip starts.
    await d.click(PARK.x, PARK.y, { duration: 50 });
  },
  async scenario(d) {
    await d.sleep(450);
    await d.press('Alt+KeyN');
    await d.sleep(700);

    // Enter opens the name cell; Tab walks on, and past the comment adds a column.
    await d.press('Enter');
    await d.sleep(150);
    await d.type('orders');
    await d.press('Tab');
    await d.sleep(280);
    await d.type('Customer orders', 45);
    await d.sleep(200);
    await d.press('Tab');
    await d.sleep(320);
    await d.type('id');
    await d.press('Tab');
    await d.sleep(280);
    // A one- or two-letter prefix matches most of the list, which would flash
    // down behind the floating toolbar, so the query lands in one input.
    await d.page.keyboard.insertText('big');
    await d.sleep(500);
    await d.press('ArrowDown');
    await d.sleep(250);
    await d.press('Enter');
    await d.sleep(350);
    await d.press('Alt+KeyK');
    await d.sleep(600);

    // A new column, opened with a double-click this time.
    await d.press('Alt+Enter');
    await d.sleep(450);
    const doc = await d.value();
    const tableId = await d.tableId('orders');
    const columnId = doc.collections.tableEntities[tableId].columnIds.at(-1);
    const row = await d.nodeBox(`#column-${columnId}`);
    const at = { x: row.x + 45, y: row.y + row.height / 2 };
    await d.dblclick(at.x, at.y, { duration: 450 });
    await d.sleep(200);
    await d.moveTo(PARK.x, PARK.y, 380);
    await d.type('total_amount', 60);
    await d.press('Tab');
    await d.sleep(280);
    await d.page.keyboard.insertText('dec');
    await d.sleep(450);
    await d.press('ArrowDown');
    await d.sleep(200);
    await d.press('ArrowDown');
    await d.sleep(250);
    await d.press('Enter');
    await d.sleep(450);
    await d.press('Escape');
    await d.sleep(1300);
  },
};
