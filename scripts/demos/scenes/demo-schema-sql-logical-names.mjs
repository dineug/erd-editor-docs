/**
 * Logical names as comments: on the Schema SQL tab, with every shop table and
 * column given a logical name, turn on Write logical names into empty
 * comments in the options panel. The order_items columns, which have no
 * comment, gain COMMENT 'Order Number' and so on, while the members columns
 * and both tables keep the comments written for them.
 */
import { center } from '../lib/recorder.mjs';
import { seedDoc } from '../lib/seed.mjs';
import { seedShopRing } from './_io-settings-helpers.mjs';
import { tabSelector, timer, waitDom } from './_vsc-helpers.mjs';

/** Table and column logical names, none of them the same as a comment. */
const LOGICAL = {
  members: ['Member', {
    id: 'Member Number',
    email: 'Email Address',
    nickname: 'Nickname',
    created_at: 'Join Date',
  }],
  order_items: ['Order Item', {
    order_id: 'Order Number',
    product_id: 'Product Number',
    quantity: 'Order Quantity',
    unit_price: 'Unit Price',
  }],
  orders: ['Order', {
    id: 'Order Number',
    member_id: 'Member Number',
    status: 'Order Status',
    ordered_at: 'Order Date',
  }],
  products: ['Product', {
    id: 'Product Number',
    category_id: 'Category Number',
    name: 'Product Name',
    price: 'Unit Price',
    stock: 'Stock Quantity',
  }],
  reviews: ['Review', {
    id: 'Review Number',
    product_id: 'Product Number',
    member_id: 'Member Number',
    rating: 'Rating',
    body: 'Review Text',
  }],
};

const SWITCH = '.schema-sql-options-logical-name [role="switch"]';

export default {
  name: 'demo-schema-sql-logical-names',
  // Wide enough that the members DDL, whose comments stay, is not cut off by
  // the panel: its created_at line runs to about 700 px.
  width: 1040,
  height: 600,
  async setup(d) {
    const doc = await seedShopRing(d, { width: 1040, settings: { originY: 110 } });
    const { tableEntities, tableColumnEntities } = doc.collections;
    for (const id of doc.doc.tableIds) {
      const table = tableEntities[id];
      const [logicalName, columns] = LOGICAL[table.name];
      table.logicalName = logicalName;
      for (const columnId of table.columnIds) {
        const column = tableColumnEntities[columnId];
        column.logicalName = columns[column.name];
      }
    }
    await seedDoc(d, doc);

    // Open on the tab, the pointer at rest in the panel under the switch row,
    // off the code, whose copy button shows under a pointer.
    const tab = center(await waitDom(d, tabSelector('Schema SQL')));
    await d.click(tab.x, tab.y, { duration: 1 });
    const row = await waitDom(d, '.schema-sql-options-logical-name');
    await d.moveTo(row.x + row.width - 40, row.y + row.height + 42, 1);
  },
  async scenario(d) {
    const mark = timer();
    await d.sleep(1400);
    await d.shot('off');

    const sw = await waitDom(d, SWITCH);
    await d.click(sw.x + sw.width * 0.4, sw.y + sw.height / 2, { duration: 550 });
    mark('on');
    // Off the switch, so its thumb shows on the right: into the blank space
    // after the label's second line.
    await d.sleep(250);
    await d.moveTo(sw.x - 70, sw.y + sw.height + 6, 400);
    await d.sleep(2600);
    await d.shot('on');
    mark('end');
  },
};
