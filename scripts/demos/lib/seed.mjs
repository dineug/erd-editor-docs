import { readFileSync } from 'node:fs';
import path from 'node:path';

import { DEMOS_DIR, ERD_EDITOR_DIR, sleep } from './recorder.mjs';

/** A seed from scripts/demos/seeds, or one of erd-editor's own data/ fixtures. */
export function readSeed(file) {
  const local = path.join(DEMOS_DIR, 'seeds', file);
  try {
    return readFileSync(local, 'utf8');
  } catch {
    return readFileSync(path.join(ERD_EDITOR_DIR, 'data', file), 'utf8');
  }
}

const readDoc = page =>
  page.evaluate(() => JSON.parse(document.querySelector('erd-editor').value));

/**
 * Imports Schema SQL the way a user would, waits for the automatic placement
 * to land, then loads the result with setInitialValue, which clears the undo
 * history, so a scene opens with nothing to undo. `tables`
 * pins positions and colors by table name; `settings` is merged over the
 * document settings.
 */
export async function seedSQL(demo, sql, { tables = {}, settings = {}, only, patch } = {}) {
  const { page } = demo;
  await page.evaluate(sql => document.querySelector('erd-editor').setSchemaSQL(sql), sql);

  let previous = '';
  for (let tries = 0; ; tries++) {
    await sleep(300);
    const doc = await readDoc(page);
    const layout = JSON.stringify(
      doc.doc.tableIds.map(id => doc.collections.tableEntities[id].ui)
    );
    if (doc.doc.tableIds.length && layout === previous) break;
    previous = layout;
    if (tries > 100) throw new Error('seedSQL: the imported tables never settled');
  }

  const doc = await readDoc(page);
  const byName = new Map(
    doc.doc.tableIds.map(id => [doc.collections.tableEntities[id].name, id])
  );

  if (only) {
    const keep = new Set(only.map(name => byName.get(name)));
    doc.doc.tableIds = doc.doc.tableIds.filter(id => keep.has(id));
    doc.doc.relationshipIds = doc.doc.relationshipIds.filter(id => {
      const { start, end } = doc.collections.relationshipEntities[id];
      return keep.has(start.tableId) && keep.has(end.tableId);
    });
    doc.doc.indexIds = doc.doc.indexIds.filter(id =>
      keep.has(doc.collections.indexEntities[id].tableId)
    );
  }

  for (const [name, ui] of Object.entries(tables)) {
    const id = byName.get(name);
    if (!id) throw new Error(`seedSQL: no table named ${name}`);
    Object.assign(doc.collections.tableEntities[id].ui, ui);
  }
  Object.assign(doc.settings, { originX: 0, originY: 0, zoomLevel: 1 }, settings);
  patch?.(doc, byName);

  await seedDoc(demo, doc);
  return doc;
}

/** Loads a document object as the editor's starting state, with no history. */
export async function seedDoc(demo, doc) {
  await demo.page.evaluate(
    json => document.querySelector('erd-editor').setInitialValue(json),
    JSON.stringify(doc)
  );
  await sleep(300);
  await demo.whenDrawn();
}
