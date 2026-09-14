#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  DEMOS_DIR,
  FIXTURE_URL,
  PACKAGE_DIR,
  PORT,
  record,
  sleep,
} from './lib/recorder.mjs';

const args = process.argv.slice(2);
const debug = args.includes('--debug');
const list = args.includes('--list');
const wanted = args.filter(arg => !arg.startsWith('--'));

const SCENES_DIR = path.join(DEMOS_DIR, 'scenes');

async function loadScenes() {
  const scenes = [];
  const files = readdirSync(SCENES_DIR).filter(
    f => f.endsWith('.mjs') && !f.startsWith('_')
  );
  for (const file of files.sort()) {
    // One scene that fails to load must not block recording the others.
    try {
      const mod = await import(pathToFileURL(path.join(SCENES_DIR, file)).href);
      scenes.push(...[mod.default].flat());
    } catch (error) {
      console.warn(`skipping scenes/${file}: ${error.message}`);
    }
  }
  return scenes;
}

async function reachable() {
  try {
    return (await fetch(FIXTURE_URL)).ok;
  } catch {
    return false;
  }
}

/** Uses a dev server already on DEMO_PORT, or starts one for this run. */
async function ensureServer() {
  if (await reachable()) return () => {};
  console.log(`starting the erd-editor dev server on :${PORT}`);
  const server = spawn(
    'pnpm',
    ['exec', 'vp', 'dev', '--port', String(PORT), '--strictPort'],
    { cwd: PACKAGE_DIR, stdio: 'ignore', detached: true }
  );
  for (let i = 0; i < 240 && !(await reachable()); i++) await sleep(500);
  if (!(await reachable())) throw new Error('the dev server did not come up');
  return () => process.kill(-server.pid);
}

const scenes = await loadScenes();
if (list) {
  for (const scene of scenes) console.log(scene.name);
  process.exit(0);
}

const selected = wanted.length
  ? wanted.map(name => {
      const scene = scenes.find(s => s.name === name);
      if (!scene) throw new Error(`unknown scene: ${name}`);
      return scene;
    })
  : scenes;

const stop = await ensureServer();
let failed = 0;
try {
  for (const scene of selected) {
    try {
      await record(scene, { debug });
    } catch (error) {
      failed++;
      console.error(`[${scene.name}] failed:`, error);
    }
  }
} finally {
  stop();
}
process.exit(failed ? 1 : 0);
