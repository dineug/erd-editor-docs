import { seedDoc, seedSQL } from '../lib/seed.mjs';

/**
 * seedSQL, then a reload before the document is loaded again. setInitialValue
 * does not clear the undo history, so without the reload the import itself
 * stays undoable: the Undo button is lit from the first frame, one ⌘Z empties
 * the canvas, and Time Travel's slider starts on a blank diagram.
 */
export async function seedClean(d, sql, options) {
  const doc = await seedSQL(d, sql, options);
  await d.page.reload();
  await d.page.waitForFunction(() => window.__erdStages?.canvas);
  await d.page.evaluate(() => window.__erdWhenDrawn?.());
  await seedDoc(d, doc);
  return doc;
}
