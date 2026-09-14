/**
 * Injected into the page before any script runs. Headless Chromium draws no
 * pointer and shows no keys, so both are painted over the editor here.
 */
(() => {
  const SVG = {
    default:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 3v16.2l4.4-4.1 2.9 6.6 2.9-1.3-2.9-6.4H18Z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>',
    pointer:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M9.2 2.6c-.9 0-1.6.7-1.6 1.6v9.3l-1.5-1.6c-.7-.7-1.8-.7-2.4 0-.6.6-.6 1.5-.1 2.2l4.6 6.1c.6.8 1.6 1.3 2.6 1.3h5.9c1.6 0 2.9-1.2 3.1-2.8l.6-5.5c.1-1-.6-1.9-1.6-2.1l-6-1V4.2c0-.9-.7-1.6-1.6-1.6Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    text:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M9 4h2.2c.5 0 .8.3.8.8v14.4c0 .5-.3.8-.8.8H9m6-16h-2.2c-.5 0-.8.3-.8.8v14.4c0 .5.3.8.8.8H15" fill="none" stroke="#111" stroke-width="3.2" stroke-linecap="round"/><path d="M9 4h2.2c.5 0 .8.3.8.8v14.4c0 .5-.3.8-.8.8H9m6-16h-2.2c-.5 0-.8.3-.8.8v14.4c0 .5.3.8.8.8H15" fill="none" stroke="#fff" stroke-width="1.4" stroke-linecap="round"/></svg>',
    grab:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8.4 21h7.2c1.4 0 2.6-1 2.9-2.4l1-5.6V8.6c0-.9-.7-1.6-1.6-1.6s-1.5.7-1.5 1.6V6.3c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6v-1c0-.9-.7-1.6-1.6-1.6S10 4.4 10 5.3V6c0-.9-.7-1.6-1.6-1.6S6.9 5.1 6.9 6v8.2L5.6 13c-.7-.6-1.7-.5-2.3.1-.5.6-.5 1.4 0 2l3.1 4.8c.5.7 1.2 1.1 2 1.1Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    grabbing:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M8.6 21h7c1.4 0 2.6-1 2.9-2.4l1-5.1v-2.8c0-.9-.7-1.6-1.6-1.6s-1.5.7-1.5 1.6v-.6c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6v-.5c0-.9-.7-1.6-1.6-1.6s-1.6.7-1.6 1.6V9.1c0-.9-.7-1.6-1.6-1.6s-1.5.7-1.5 1.6v5.2l-.9-.8c-.7-.6-1.7-.5-2.3.1-.5.6-.5 1.4 0 2l3.1 4.3c.5.7 1.2 1.1 2 1.1Z" fill="#fff" stroke="#111" stroke-width="1.3" stroke-linejoin="round"/></svg>',
    crosshair:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3v18M3 12h18" stroke="#111" stroke-width="3.4" stroke-linecap="round"/><path d="M12 3v18M3 12h18" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
    move:
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.5 9 5.8h2v5.2H5.8V9L2.5 12 5.8 15v-2H11v5.2H9l3 3.3 3-3.3h-2V13h5.2v2l3.3-3-3.3-3v2H13V5.8h2Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    'ns-resize':
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 2.5 7.5 7.5H11v9H7.5L12 21.5l4.5-5H13v-9h3.5Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    'ew-resize':
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M2.5 12 7.5 7.5V11h9V7.5l5 4.5-5 4.5V13h-9v3.5Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    'nwse-resize':
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M4 4h6.4L8.3 6.1l9.6 9.6 2.1-2.1V20h-6.4l2.1-2.1-9.6-9.6L4 10.4Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    'nesw-resize':
      '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20 4h-6.4l2.1 2.1-9.6 9.6L4 13.6V20h6.4l-2.1-2.1 9.6-9.6 2.1 2.1Z" fill="#fff" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>',
  };
  // Where the click lands inside each 24px glyph.
  const HOTSPOT = {
    default: [5, 3],
    pointer: [9, 3],
    text: [12, 12],
    grab: [12, 12],
    grabbing: [12, 12],
    crosshair: [12, 12],
    move: [12, 12],
    'ns-resize': [12, 12],
    'ew-resize': [12, 12],
    'nwse-resize': [12, 12],
    'nesw-resize': [12, 12],
  };
  const ALIAS = {
    auto: 'default',
    'row-resize': 'ns-resize',
    'col-resize': 'ew-resize',
    'n-resize': 'ns-resize',
    's-resize': 'ns-resize',
    'e-resize': 'ew-resize',
    'w-resize': 'ew-resize',
    'nw-resize': 'nwse-resize',
    'se-resize': 'nwse-resize',
    'ne-resize': 'nesw-resize',
    'sw-resize': 'nesw-resize',
    'all-scroll': 'move',
    cell: 'crosshair',
    copy: 'default',
    'not-allowed': 'default',
  };

  const install = () => {
    const style = document.createElement('style');
    style.textContent = `
      #demo-cursor{position:fixed;left:0;top:0;z-index:2147483647;pointer-events:none;
        width:24px;height:24px;transform:translate(-100px,-100px);will-change:transform;
        filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))}
      #demo-cursor svg,#demo-cursor img{display:block}
      .demo-ripple{position:fixed;z-index:2147483646;pointer-events:none;width:36px;height:36px;
        margin:-18px 0 0 -18px;border-radius:50%;border:2px solid rgba(120,160,255,.95);
        background:rgba(120,160,255,.2);animation:demo-ripple .5s ease-out forwards}
      @keyframes demo-ripple{from{transform:scale(.3);opacity:1}to{transform:scale(1.3);opacity:0}}
      #demo-keys{position:fixed;left:50%;bottom:var(--demo-keys-bottom,72px);z-index:2147483647;
        pointer-events:none;display:flex;gap:6px;padding:8px 10px;border-radius:12px;
        background:rgba(18,18,22,.86);
        box-shadow:0 8px 24px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.09);
        transform:translate(-50%,8px);opacity:0;transition:opacity .16s ease,transform .16s ease;
        font:600 15px/1 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#f4f4f5}
      #demo-keys.on{opacity:1;transform:translate(-50%,0)}
      #demo-keys kbd{min-width:28px;padding:7px 9px;border-radius:7px;text-align:center;font:inherit;
        background:linear-gradient(#3a3a42,#2c2c33);
        box-shadow:inset 0 -2px 0 rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.1)}
`;
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.id = 'demo-cursor';
    document.body.appendChild(cursor);

    const keys = document.createElement('div');
    keys.id = 'demo-keys';
    document.body.appendChild(keys);

    let x = -100;
    let y = -100;
    let target = null;
    let shape = '';
    let hotspot = [0, 0];

    const resolve = () => {
      let value = 'default';
      if (target && target.isConnected) {
        value = getComputedStyle(target).cursor.trim() || 'default';
      }
      if (window.__demoCursorLock) value = window.__demoCursorLock;
      if (value === shape) return;
      shape = value;

      const url = value.match(/url\(["']?([^"')]+)["']?\)\s*(\d+)?\s*(\d+)?/);
      if (url) {
        cursor.innerHTML = `<img src="${url[1]}">`;
        hotspot = [Number(url[2] ?? 0), Number(url[3] ?? 0)];
      } else {
        const keyword = value.split(',').pop().trim();
        const name = SVG[keyword] ? keyword : (ALIAS[keyword] ?? 'default');
        cursor.innerHTML = SVG[name];
        hotspot = HOTSPOT[name];
      }
      place();
    };
    const place = () => {
      cursor.style.transform = `translate(${x - hotspot[0]}px,${y - hotspot[1]}px)`;
    };

    const track = e => {
      x = e.clientX;
      y = e.clientY;
      target = e.composedPath()[0] ?? e.target;
      resolve();
      place();
    };
    const options = { capture: true, passive: true };
    window.addEventListener('mousemove', track, options);
    window.addEventListener('mouseup', track, options);
    window.addEventListener('mousedown', e => {
      track(e);
      const ripple = document.createElement('div');
      ripple.className = 'demo-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 550);
    }, options);

    // The editor changes the cursor without the pointer moving, e.g. when a
    // relationship shortcut arms the draw tool.
    const tick = () => {
      resolve();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    let timer = 0;
    window.__demoKeys = (labels, holdMs) => {
      keys.innerHTML = labels.map(label => `<kbd>${label}</kbd>`).join('');
      keys.classList.add('on');
      clearTimeout(timer);
      timer = setTimeout(() => keys.classList.remove('on'), holdMs);
    };
    window.__demoHideKeys = () => keys.classList.remove('on');
  };

  if (document.body) install();
  else document.addEventListener('DOMContentLoaded', install);
})();
