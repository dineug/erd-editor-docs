import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const DEMOS_DIR = path.resolve(fileURLToPath(import.meta.url), '../..');
export const ROOT = path.resolve(DEMOS_DIR, '../..');
export const OUT_DIR = path.join(DEMOS_DIR, '.out');
export const IMG_DIR = path.join(ROOT, 'static/img');
export const ERD_EDITOR_DIR =
  process.env.ERD_EDITOR_DIR ?? path.resolve(ROOT, '../erd-editor');
export const PACKAGE_DIR = path.join(ERD_EDITOR_DIR, 'packages/erd-editor');
export const PORT = Number(process.env.DEMO_PORT ?? 5231);
export const FIXTURE_URL = `http://localhost:${PORT}/e2e/fixture/index.html`;

const LOCAL_FFMPEG = path.join(OUT_DIR, 'bin/ffmpeg');
const FFMPEG =
  process.env.FFMPEG_PATH ?? (existsSync(LOCAL_FFMPEG) ? LOCAL_FFMPEG : 'ffmpeg');
const FPS = 30;
const LOCK_DIR = path.join(OUT_DIR, '.capture.lock');
const OVERLAY = readFileSync(path.join(DEMOS_DIR, 'lib/overlay.js'), 'utf8');
const IS_MAC = process.platform === 'darwin';

export const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const KEY_LABEL = {
  Alt: '⌥',
  Meta: '⌘',
  ControlOrMeta: IS_MAC ? '⌘' : 'Ctrl',
  Control: 'Ctrl',
  Shift: '⇧',
  Enter: 'Enter',
  Tab: 'Tab',
  Escape: 'Esc',
  Backspace: '⌫',
  Delete: 'Delete',
  Space: 'Space',
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Equal: '+',
  Minus: '−',
};

/** The keycap labels one Playwright key combo is shown with. */
export function labelsOf(combo) {
  return combo
    .split('+')
    .filter(Boolean)
    .map(key => KEY_LABEL[key] ?? key.replace(/^Key|^Digit/, ''));
}

async function loadPlaywright() {
  const entry = path.join(PACKAGE_DIR, 'node_modules/@playwright/test/index.mjs');
  if (!existsSync(entry)) {
    throw new Error(
      `Playwright not found at ${entry}. Set ERD_EDITOR_DIR to an erd-editor checkout with dependencies installed.`
    );
  }
  return import(pathToFileURL(entry).href);
}

/**
 * Only one capture runs at a time: a second browser encoding frames beside it
 * drops frames from both. Probes and encodes do not take the lock.
 */
async function withCaptureLock(fn) {
  mkdirSync(OUT_DIR, { recursive: true });
  for (;;) {
    try {
      mkdirSync(LOCK_DIR);
      break;
    } catch {
      try {
        if (Date.now() - statSync(LOCK_DIR).mtimeMs > 4 * 60_000) {
          rmSync(LOCK_DIR, { recursive: true, force: true });
        }
      } catch {}
      await sleep(500);
    }
  }
  try {
    return await fn();
  } finally {
    rmSync(LOCK_DIR, { recursive: true, force: true });
  }
}

function createDemo(page, { width, height, outDir, debug }) {
  let mouse = { x: width / 2, y: height / 2 };
  let shotIndex = 0;

  const demo = {
    page,
    sleep,
    width,
    height,

    get mouse() {
      return { ...mouse };
    },

    /** Eased pointer travel, one event per frame, so drags and hovers read as a person. */
    async moveTo(x, y, duration = 600) {
      const from = { ...mouse };
      const distance = Math.hypot(x - from.x, y - from.y);
      if (distance < 1) {
        await page.mouse.move(x, y);
        mouse = { x, y };
        return;
      }
      const steps = Math.max(2, Math.round(duration / 16));
      for (let i = 1; i <= steps; i++) {
        const t = i / steps;
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        mouse = { x: from.x + (x - from.x) * e, y: from.y + (y - from.y) * e };
        await page.mouse.move(mouse.x, mouse.y);
        await sleep(16);
      }
    },

    async click(x, y, { button = 'left', modifiers = [], duration, clickCount = 1 } = {}) {
      await demo.moveTo(x, y, duration);
      await sleep(110);
      for (const m of modifiers) await page.keyboard.down(m);
      for (let i = 1; i <= clickCount; i++) {
        await page.mouse.down({ button, clickCount: i });
        await sleep(60);
        await page.mouse.up({ button, clickCount: i });
        if (i < clickCount) await sleep(60);
      }
      for (const m of [...modifiers].reverse()) await page.keyboard.up(m);
    },

    dblclick(x, y, options = {}) {
      return demo.click(x, y, { ...options, clickCount: 2 });
    },

    rightClick(x, y, options = {}) {
      return demo.click(x, y, { ...options, button: 'right' });
    },

    async drag(from, to, { duration = 900, modifiers = [], holdBefore = 120, holdAfter = 90 } = {}) {
      await demo.moveTo(from.x, from.y);
      for (const m of modifiers) await page.keyboard.down(m);
      await page.mouse.down();
      await sleep(holdBefore);
      await demo.moveTo(to.x, to.y, duration);
      await sleep(holdAfter);
      await page.mouse.up();
      for (const m of [...modifiers].reverse()) await page.keyboard.up(m);
    },

    /** Presses a Playwright combo such as 'Alt+KeyN' and shows it as keycaps. */
    async press(combo, { badge = true, hold = 950 } = {}) {
      if (badge) {
        await demo.keys(labelsOf(combo), hold);
        await sleep(130);
      }
      await page.keyboard.press(combo);
    },

    /** Shows keycaps without pressing anything, e.g. ['⌘', 'drag']. */
    async keys(labels, hold = 950) {
      await page.evaluate(([l, h]) => window.__demoKeys(l, h), [labels, hold]);
    },

    /** Holds modifier keys, with their keycaps on screen, for the length of fn. */
    async holding(modifiers, fn, { label } = {}) {
      const labels = label ?? modifiers.flatMap(m => labelsOf(m));
      await demo.keys(labels, 600_000);
      await sleep(150);
      for (const m of modifiers) await page.keyboard.down(m);
      try {
        await fn();
      } finally {
        for (const m of [...modifiers].reverse()) await page.keyboard.up(m);
        await page.evaluate(() => window.__demoHideKeys());
      }
    },

    async type(text, delay = 80) {
      for (const ch of text) {
        await page.keyboard.type(ch);
        await sleep(delay + Math.random() * 35);
      }
    },

    async wheel(deltaY, { deltaX = 0, steps = 1, gap = 60 } = {}) {
      for (let i = 0; i < steps; i++) {
        await page.mouse.wheel(deltaX, deltaY);
        await sleep(gap);
      }
    },

    /**
     * Opens a file chooser with trigger() and answers it with an in-memory
     * file, e.g. { name: 'shop.sql', content: sql }.
     */
    async chooseFile(trigger, { name, content, mimeType = 'application/octet-stream' }) {
      const [chooser] = await Promise.all([page.waitForEvent('filechooser'), trigger()]);
      await chooser.setFiles({ name, mimeType, buffer: Buffer.from(content) });
    },

    /**
     * Saves a still to static/img/<file> at the capture scale (2x), clipped
     * to a viewport box when one is given. Skipped in debug mode.
     */
    async still(file, clip) {
      if (debug) return demo.shot(`still-${file}`);
      await page.evaluate(() => {
        document.getElementById('demo-cursor')?.style.setProperty('visibility', 'hidden');
      });
      await page.screenshot({ path: path.join(IMG_DIR, file), clip, scale: 'device' });
      await page.evaluate(() => {
        document.getElementById('demo-cursor')?.style.removeProperty('visibility');
      });
      console.log(`still -> static/img/${file}`);
    },

    /** Debug-mode screenshot, a no-op while recording. */
    async shot(label) {
      if (!debug) return;
      await sleep(250);
      const file = `shot-${String(shotIndex++).padStart(2, '0')}-${label}.png`;
      await page.screenshot({ path: path.join(outDir, file), scale: 'css' });
    },

    /** The live document, parsed from the element's value getter. */
    value() {
      return page.evaluate(() => JSON.parse(document.querySelector('erd-editor').value));
    },

    async tableId(name) {
      const doc = await demo.value();
      const id = doc.doc.tableIds.find(
        id => doc.collections.tableEntities[id].name === name
      );
      if (!id) throw new Error(`no table named ${name}`);
      return id;
    },

    async columnId(tableName, columnName) {
      const doc = await demo.value();
      const tableId = await demo.tableId(tableName);
      const id = doc.collections.tableEntities[tableId].columnIds.find(
        id => doc.collections.tableColumnEntities[id].name === columnName
      );
      if (!id) throw new Error(`no column ${tableName}.${columnName}`);
      return id;
    },

    /**
     * Viewport box of a Konva node on a registered stage ('canvas', 'minimap',
     * 'visualization'), found by '#id' or '.name' selector. Null when absent.
     */
    nodeBox(selector, stageName = 'canvas', index = 0) {
      return page.evaluate(
        ([selector, stageName, index]) => {
          const stage = window.__erdStages?.[stageName];
          if (!stage) return null;
          const nodes = selector.startsWith('#')
            ? [stage.findOne(selector)].filter(Boolean)
            : stage.find(selector);
          const node = nodes[index];
          if (!node) return null;
          const r = node.getClientRect();
          const c = stage.container().getBoundingClientRect();
          return { x: c.left + r.x, y: c.top + r.y, width: r.width, height: r.height };
        },
        [selector, stageName, index]
      );
    },

    async tableBox(name) {
      return demo.nodeBox(`#table-${await demo.tableId(name)}`);
    },

    async columnBox(tableName, columnName) {
      return demo.nodeBox(`#column-${await demo.columnId(tableName, columnName)}`);
    },

    /** Viewport box of a DOM element inside the editor's (reopened) shadow root. */
    domBox(selector, index = 0) {
      return page.evaluate(
        ([selector, index]) => {
          const el = window.__erdShadowRoot?.querySelectorAll(selector)[index];
          if (!el) return null;
          const r = el.getBoundingClientRect();
          return { x: r.left, y: r.top, width: r.width, height: r.height };
        },
        [selector, index]
      );
    },

    /** Resolves once the scene has painted the latest change. */
    whenDrawn() {
      return page.evaluate(async () => {
        await window.__erdWhenDrawn?.();
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      });
    },
  };

  return demo;
}

export const center = box => ({ x: box.x + box.width / 2, y: box.y + box.height / 2 });

/**
 * Records one scene to static/img/<output>.webp (2x, 30fps), or with debug
 * only runs it and leaves step screenshots in .out/<name>/.
 */
export async function record(scene, { debug = false } = {}) {
  const {
    name,
    output = name,
    width = 800,
    height = 450,
    scale = 2,
    setup,
    scenario,
    // A scene that only calls d.still() sets this and skips the capture.
    stillOnly = false,
    // Lossless WebP. The lossy animation encoder skips pixel changes under
    // its tolerance, so fading overlays (click ripples, closing menus, tab
    // switches) leave faint ghosts behind; lossless compares exactly, and on
    // flat UI it costs little.
    lossless = true,
    // Lossy WebP quality, used only with lossless: false. A scene whose whole
    // frame keeps moving (the force graph settling) can trade exactness for size.
    quality = 85,
  } = scene;
  const outDir = path.join(OUT_DIR, name);
  rmSync(outDir, { recursive: true, force: true });
  mkdirSync(path.join(outDir, 'frames'), { recursive: true });

  const { chromium } = await loadPlaywright();

  const run = async () => {
    const browser = await chromium.launch({
      args: [`--force-device-scale-factor=${scale}`],
    });
    try {
      const context = await browser.newContext({
        viewport: { width, height },
        deviceScaleFactor: scale,
        colorScheme: 'dark',
        permissions: ['clipboard-read', 'clipboard-write'],
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error));
      await page.addInitScript(OVERLAY);
      await page.goto(scene.url ?? FIXTURE_URL);
      await page.waitForFunction(() => window.__erdStages?.canvas);
      await page.evaluate(() => window.__erdWhenDrawn?.());

      const demo = createDemo(page, { width, height, outDir, debug });
      await setup?.(demo);
      await demo.whenDrawn();
      await page.mouse.move(demo.mouse.x, demo.mouse.y);
      await sleep(400);

      if (debug || stillOnly) {
        await demo.shot('start');
        await scenario(demo);
        await demo.shot('end');
        return { errors };
      }

      const cdp = await context.newCDPSession(page);
      const frames = [];
      cdp.on('Page.screencastFrame', ({ data, metadata, sessionId }) => {
        frames.push({ ts: metadata.timestamp, data });
        cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
      });
      await cdp.send('Page.startScreencast', {
        format: 'png',
        everyNthFrame: 1,
        maxWidth: width * scale,
        maxHeight: height * scale,
      });
      // The first frame arrives as soon as the cast starts; wait for it so
      // the clip opens on the settled page rather than on nothing.
      while (!frames.length) await sleep(10);
      const startedAt = frames[0].ts;

      await scenario(demo);

      const endedAt = Date.now() / 1000;
      await cdp.send('Page.stopScreencast');
      return { errors, frames, startedAt, endedAt };
    } finally {
      await browser.close();
    }
  };

  const result = debug || stillOnly ? await run() : await withCaptureLock(run);
  for (const error of result.errors) console.warn(`[${name}] pageerror: ${error.message}`);
  if (stillOnly && !debug) return { outDir };
  if (debug) {
    console.log(`[${name}] debug screenshots in ${path.relative(ROOT, outDir)}`);
    return { outDir };
  }

  const { frames, startedAt, endedAt } = result;
  const concat = [];
  frames.forEach((frame, i) => {
    const file = `frames/${String(i).padStart(5, '0')}.png`;
    writeFileSync(path.join(outDir, file), Buffer.from(frame.data, 'base64'));
    const next = i + 1 < frames.length ? frames[i + 1].ts : endedAt;
    const duration = Math.max(0.001, next - Math.max(frame.ts, startedAt));
    concat.push(`file '${file}'`, `duration ${duration.toFixed(4)}`);
  });
  concat.push(`file 'frames/${String(frames.length - 1).padStart(5, '0')}.png'`);
  writeFileSync(path.join(outDir, 'concat.txt'), concat.join('\n') + '\n');

  const seconds = endedAt - startedAt;
  const target = path.join(IMG_DIR, `${output}.webp`);
  const ffmpeg = args =>
    execFileSync(FFMPEG, ['-hide_banner', '-loglevel', 'error', '-y', ...args], {
      cwd: outDir,
      stdio: 'inherit',
    });
  const input = ['-f', 'concat', '-safe', '0', '-i', 'concat.txt'];

  ffmpeg([
    ...input,
    '-vf', `fps=${FPS}`,
    '-c:v', 'libwebp_anim',
    '-lossless', lossless ? '1' : '0',
    '-quality', String(quality),
    '-compression_level', '6',
    '-loop', '0',
    target,
  ]);
  // A contact sheet, one tile per second, for reviewing the clip at a glance.
  const columns = 4;
  const rows = Math.ceil(Math.max(1, Math.floor(seconds)) / columns);
  ffmpeg([
    ...input,
    '-vf', `fps=1,scale=480:-1,tile=${columns}x${rows}:padding=6:color=0xff3040`,
    '-frames:v', '1',
    'review.png',
  ]);

  const kb = Math.round(statSync(target).size / 1024);
  console.log(
    `[${name}] ${frames.length} frames, ${seconds.toFixed(1)}s -> ${path.relative(ROOT, target)} (${kb}KB); review: ${path.relative(ROOT, path.join(outDir, 'review.png'))}`
  );
  return { target, seconds, kb, review: path.join(outDir, 'review.png') };
}
