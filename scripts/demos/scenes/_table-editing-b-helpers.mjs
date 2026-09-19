/** Shared helpers for the table-editing-b scenes (column move, remove, copy/paste). */

/** The middle of a column's name cell, where a person grabs a row. */
export async function nameCell(d, table, column, dx = 34) {
  const box = await d.columnBox(table, column);
  if (!box) throw new Error(`no column box for ${table}.${column}`);
  return { x: box.x + dx, y: box.y + box.height / 2 };
}

/** Where a person clicks a table's name, on the header band's one line, to select the table. */
export async function tableHeader(d, table, dx = 40) {
  const box = await d.tableBox(table);
  if (!box) throw new Error(`no table box for ${table}`);
  return { x: box.x + dx, y: box.y + 14 };
}

/** Column names of a table, in document order. */
export async function columnNames(d, table) {
  const doc = await d.value();
  const id = doc.doc.tableIds.find(
    id => doc.collections.tableEntities[id].name === table
  );
  return doc.collections.tableEntities[id].columnIds.map(
    id => doc.collections.tableColumnEntities[id].name
  );
}

/**
 * Narrows the editor to the left `editorWidth` px and puts a plain,
 * unbranded spreadsheet grid ("Sheet1") on the right. The grid is a real
 * clipboard peer: ⌘C writes the selected range as TSV, ⌘V reads TSV from the
 * clipboard into the cells from the active cell. `columns` are
 * { width } per column letter, `cells` is a row-major array of strings, and
 * `headerRow` dims row 1 as labels.
 */
export async function installSheet(
  d,
  { editorWidth, columns, cells = [], active = [0, 0], headerRow = false }
) {
  await d.page.evaluate(
    ({ editorWidth, columns, cells, active, headerRow }) => {
      document.getElementById('app').style.width = `${editorWidth}px`;

      const ROWS = 18;
      const HEAD = 24;
      const ROW = 26;
      const GUTTER = 34;
      const style = document.createElement('style');
      style.textContent = `
        #sheet{position:fixed;top:0;bottom:0;right:0;left:${editorWidth}px;display:flex;flex-direction:column;
          background:#18191b;border-left:1px solid #363a3f;outline:none;overflow:hidden;
          font:13px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;color:#edeef0;user-select:none}
        #sheet .bar{height:30px;flex:none;display:flex;align-items:center;gap:8px;padding:0 10px;background:#111113;
          border-bottom:1px solid #2b2e33}
        #sheet .ref{width:44px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:4px;
          background:#212225;color:#b0b4ba;font-size:12px}
        #sheet .val{flex:1;height:20px;display:flex;align-items:center;padding:0 8px;border-radius:4px;background:#212225;
          color:#edeef0;font-size:12px;white-space:nowrap;overflow:hidden}
        #sheet .grid{position:relative;flex:1;overflow:hidden}
        #sheet .h,#sheet .n,#sheet .c{position:absolute;box-sizing:border-box;white-space:nowrap;overflow:hidden}
        #sheet .h{top:0;height:${HEAD}px;display:flex;align-items:center;justify-content:center;background:#111113;
          color:#8b8f96;font-size:11px;border-right:1px solid #2b2e33;border-bottom:1px solid #2b2e33}
        #sheet .h.on,#sheet .n.on{color:#edeef0;background:#1f2330}
        #sheet .n{left:0;width:${GUTTER}px;height:${ROW}px;display:flex;align-items:center;justify-content:center;
          background:#111113;color:#8b8f96;font-size:11px;border-right:1px solid #2b2e33;border-bottom:1px solid #2b2e33}
        #sheet .c{height:${ROW}px;padding:0 6px;display:flex;align-items:center;border-right:1px solid #26282c;
          border-bottom:1px solid #26282c;font-size:12px}
        #sheet .c.hd{color:#8b8f96;font-weight:600}
        #sheet .sel{position:absolute;pointer-events:none;box-sizing:border-box;background:rgba(84,114,228,.16);
          border:1px solid rgba(84,114,228,.9)}
        #sheet .act{position:absolute;pointer-events:none;box-sizing:border-box;border:2px solid #5472e4}
        #sheet .ants{position:absolute;pointer-events:none;box-sizing:border-box;border:2px dashed #7c95f0;display:none}
        #sheet input{position:absolute;box-sizing:border-box;border:2px solid #5472e4;background:#18191b;color:#edeef0;
          font:12px -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:0 5px;outline:none;z-index:3}
        #sheet .tabs{height:28px;flex:none;display:flex;align-items:stretch;background:#111113;border-top:1px solid #2b2e33;padding-left:${GUTTER}px}
        #sheet .tab{display:flex;align-items:center;padding:0 14px;font-size:12px;color:#edeef0;background:#18191b;
          border-right:1px solid #2b2e33;border-bottom:2px solid #5472e4}`;
      document.head.appendChild(style);

      const sheet = document.createElement('div');
      sheet.id = 'sheet';
      sheet.tabIndex = 0;
      sheet.innerHTML =
        '<div class="bar"><div class="ref"></div><div class="val"></div></div>' +
        '<div class="grid"></div><div class="tabs"><div class="tab">Sheet1</div></div>';
      document.body.appendChild(sheet);
      const grid = sheet.querySelector('.grid');
      const refBox = sheet.querySelector('.ref');
      const valBox = sheet.querySelector('.val');

      const COLS = columns.length;
      const lefts = [];
      let x = GUTTER;
      for (const col of columns) {
        lefts.push(x);
        x += col.width;
      }
      const letter = c => String.fromCharCode(65 + c);
      const data = Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: COLS }, (_, c) => cells[r]?.[c] ?? '')
      );
      const cellEls = [];
      const colHeads = [];
      const rowHeads = [];

      columns.forEach((col, c) => {
        const h = document.createElement('div');
        h.className = 'h';
        h.style.left = `${lefts[c]}px`;
        h.style.width = `${col.width}px`;
        h.textContent = letter(c);
        grid.appendChild(h);
        colHeads.push(h);
      });
      const corner = document.createElement('div');
      corner.className = 'h';
      corner.style.left = '0px';
      corner.style.width = `${GUTTER}px`;
      grid.appendChild(corner);
      // Filler so the header strip runs to the edge.
      const filler = document.createElement('div');
      filler.className = 'h';
      filler.style.left = `${x}px`;
      filler.style.right = '0';
      filler.style.borderRight = 'none';
      grid.appendChild(filler);

      for (let r = 0; r < ROWS; r++) {
        const n = document.createElement('div');
        n.className = 'n';
        n.style.top = `${HEAD + r * ROW}px`;
        n.textContent = String(r + 1);
        grid.appendChild(n);
        rowHeads.push(n);
        cellEls.push(
          columns.map((col, c) => {
            const el = document.createElement('div');
            el.className = 'c';
            el.dataset.r = r;
            el.dataset.c = c;
            el.style.left = `${lefts[c]}px`;
            el.style.top = `${HEAD + r * ROW}px`;
            el.style.width = `${col.width}px`;
            grid.appendChild(el);
            return el;
          })
        );
        const rest = document.createElement('div');
        rest.className = 'c';
        rest.style.left = `${x}px`;
        rest.style.right = '0';
        rest.style.top = `${HEAD + r * ROW}px`;
        grid.appendChild(rest);
      }

      const selBox = document.createElement('div');
      selBox.className = 'sel';
      const actBox = document.createElement('div');
      actBox.className = 'act';
      const ants = document.createElement('div');
      ants.className = 'ants';
      grid.append(selBox, ants, actBox);

      let anchor = [...active];
      let focus = [...active];
      let cur = [...active];
      let editor = null;
      let dragging = false;

      const rect = (r1, c1, r2, c2) => {
        const top = Math.min(r1, r2);
        const bottom = Math.max(r1, r2);
        const left = Math.min(c1, c2);
        const right = Math.max(c1, c2);
        return {
          top,
          bottom,
          left,
          right,
          x: lefts[left] - 1,
          y: HEAD + top * ROW - 1,
          w: lefts[right] + columns[right].width - lefts[left] + 1,
          h: (bottom - top + 1) * ROW + 1,
        };
      };
      const place = (el, b) => {
        el.style.left = `${b.x}px`;
        el.style.top = `${b.y}px`;
        el.style.width = `${b.w}px`;
        el.style.height = `${b.h}px`;
      };
      const render = () => {
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            const el = cellEls[r][c];
            el.textContent = data[r][c];
            el.classList.toggle('hd', headerRow && r === 0);
          }
        }
        const s = rect(anchor[0], anchor[1], focus[0], focus[1]);
        const multi = s.top !== s.bottom || s.left !== s.right;
        selBox.style.display = multi ? 'block' : 'none';
        place(selBox, s);
        place(actBox, rect(cur[0], cur[1], cur[0], cur[1]));
        colHeads.forEach((h, c) => h.classList.toggle('on', c >= s.left && c <= s.right));
        rowHeads.forEach((h, r) => h.classList.toggle('on', r >= s.top && r <= s.bottom));
        refBox.textContent = `${letter(cur[1])}${cur[0] + 1}`;
        valBox.textContent = data[cur[0]][cur[1]];
      };

      const hit = e => {
        const el = e.target.closest?.('.c[data-r]');
        return el ? [Number(el.dataset.r), Number(el.dataset.c)] : null;
      };
      const commit = () => {
        if (!editor) return;
        data[editor.r][editor.c] = editor.input.value;
        editor.input.remove();
        editor = null;
        sheet.focus({ preventScroll: true });
        render();
      };
      const startEdit = (initial = null) => {
        const [r, c] = cur;
        const input = document.createElement('input');
        const b = rect(r, c, r, c);
        place(input, b);
        input.value = initial ?? data[r][c];
        grid.appendChild(input);
        editor = { r, c, input };
        input.focus({ preventScroll: true });
        input.setSelectionRange(input.value.length, input.value.length);
        input.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            commit();
            if (e.key === 'Enter') cur = [Math.min(ROWS - 1, cur[0] + 1), cur[1]];
            else cur = [cur[0], Math.min(COLS - 1, cur[1] + 1)];
            anchor = [...cur];
            focus = [...cur];
            render();
          } else if (e.key === 'Escape') {
            editor.input.remove();
            editor = null;
            sheet.focus({ preventScroll: true });
            render();
          }
          e.stopPropagation();
        });
      };

      grid.addEventListener('mousedown', e => {
        const at = hit(e);
        if (!at) return;
        e.preventDefault();
        commit();
        ants.style.display = 'none';
        sheet.focus({ preventScroll: true });
        if (e.shiftKey) {
          focus = at;
        } else {
          anchor = at;
          focus = at;
          cur = at;
        }
        dragging = true;
        render();
      });
      grid.addEventListener('mousemove', e => {
        if (!dragging) return;
        const at = hit(e);
        if (!at) return;
        focus = at;
        render();
      });
      window.addEventListener('mouseup', () => {
        dragging = false;
      });
      grid.addEventListener('dblclick', e => {
        if (hit(e)) startEdit();
      });

      sheet.addEventListener('keydown', e => {
        if (editor) return;
        if (e.metaKey || e.ctrlKey || e.altKey) return;
        const move = { ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] }[e.key];
        if (move) {
          e.preventDefault();
          cur = [
            Math.max(0, Math.min(ROWS - 1, cur[0] + move[0])),
            Math.max(0, Math.min(COLS - 1, cur[1] + move[1])),
          ];
          anchor = [...cur];
          focus = [...cur];
          render();
        } else if (e.key === 'Enter') {
          e.preventDefault();
          startEdit();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
          e.preventDefault();
          const s = rect(anchor[0], anchor[1], focus[0], focus[1]);
          for (let r = s.top; r <= s.bottom; r++) for (let c = s.left; c <= s.right; c++) data[r][c] = '';
          render();
        } else if (e.key.length === 1) {
          e.preventDefault();
          startEdit(e.key);
        }
      });

      document.addEventListener('copy', e => {
        if (document.activeElement !== sheet || editor) return;
        const s = rect(anchor[0], anchor[1], focus[0], focus[1]);
        const rows = [];
        for (let r = s.top; r <= s.bottom; r++) {
          rows.push(data[r].slice(s.left, s.right + 1).join('\t'));
        }
        e.clipboardData.setData('text/plain', rows.join('\n'));
        e.preventDefault();
        place(ants, s);
        ants.style.display = 'block';
      });
      document.addEventListener('paste', e => {
        if (document.activeElement !== sheet || editor) return;
        const text = e.clipboardData.getData('text/plain');
        if (!text) return;
        e.preventDefault();
        const rows = text.replace(/\r/g, '').replace(/\n$/, '').split('\n').map(row => row.split('\t'));
        const [r0, c0] = cur;
        rows.forEach((row, i) =>
          row.forEach((value, j) => {
            if (r0 + i < ROWS && c0 + j < COLS) data[r0 + i][c0 + j] = value;
          })
        );
        ants.style.display = 'none';
        anchor = [r0, c0];
        focus = [
          Math.min(ROWS - 1, r0 + rows.length - 1),
          Math.min(COLS - 1, c0 + Math.max(...rows.map(row => row.length)) - 1),
        ];
        render();
      });

      window.__sheet = {
        data,
        cellBox(r, c) {
          const b = cellEls[r][c].getBoundingClientRect();
          return { x: b.left, y: b.top, width: b.width, height: b.height };
        },
      };
      render();
    },
    { editorWidth, columns, cells, active, headerRow }
  );
  // The editor follows its host's new size on the next observer tick.
  await d.sleep(300);
  await d.whenDrawn();
}

/** Viewport box of a sheet cell, row and column from zero. */
export function sheetCell(d, r, c) {
  return d.page.evaluate(([r, c]) => window.__sheet.cellBox(r, c), [r, c]);
}

/** The sheet's current values. */
export function sheetData(d) {
  return d.page.evaluate(() => window.__sheet.data);
}

/** Centres the keycap badge on viewport x, so keys show beside the side they act on. */
export function keysAt(d, x) {
  return d.page.evaluate(x => {
    const keys = document.getElementById('demo-keys');
    if (keys) keys.style.left = `${x}px`;
  }, x);
}
