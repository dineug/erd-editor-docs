---
sidebar_position: 1
---

# 설치

```sh
npm install @dineug/erd-editor
```

## Usage

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
document.body.appendChild(editor);
```

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

### html

```html
<erd-editor readonly system-dark-mode enable-theme-builder></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```
