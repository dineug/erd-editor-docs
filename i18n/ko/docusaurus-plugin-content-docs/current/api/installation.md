---
sidebar_position: 1
description: npm이나 CDN으로 @dineug/erd-editor를 설치하고, 커스텀 엘리먼트를 마운트하고, 구문 강조를 추가하고, 파일 다이얼로그를 연결하는 방법.
---

# 설치

```sh
npm install @dineug/erd-editor
```

이 패키지는 ESM 전용(`"type": "module"`)이며 `dist` 폴더만 배포합니다.
CommonJS 빌드는 없기 때문에 `require('@dineug/erd-editor')`는 동작하지 않습니다.

런타임 의존성은 번들러가 직접 해석하고 중복 제거하고 트리 셰이킹할 수 있도록 bare import 그대로 외부에 남겨 둡니다.
shared worker는 `dist/workers/` 아래에 별도 진입 파일로 생성되며 `new URL('./…', import.meta.url)` 형태로 만들어집니다. Vite, webpack 5, Rspack이 워커 진입점으로 인식하는 표기입니다. [Web Worker](#web-worker) 항목을 참고하세요.
번들러가 없는 페이지를 위한 자립형 빌드도 함께 제공합니다. [script 태그](#script-태그) 항목을 참고하세요.

## 사용

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// Undo 기록을 남기지 않고 문서를 불러온 뒤, 변경사항을 계속 동기화합니다
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>`는 자체 크기를 갖지 않습니다. 요소나 컨테이너에 width, height를 지정해야 합니다.

`setInitialValue('')`는 빈 문서로 시작합니다. `value`에 할당하면 편집으로 처리되어 Undo 기록에 남습니다.
나머지 API는 [ErdEditorElement](./erd-editor-element.md) 문서를 참고하세요.

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run`이 패키지의 외부 의존성을 대신 해석해 주므로 번들러 없이도 동작합니다.
버전이 없는 URL은 항상 최신 릴리스를 제공합니다. 메이저 업그레이드가 예고 없이 페이지에 반영되는 것을 원하지 않는다면 `https://esm.run/@dineug/erd-editor@3.6.0`처럼 버전을 고정하세요.

### script 태그

`3.6.0`부터 모든 의존성과 두 개의 shared worker를 한 파일에 담은 UMD 빌드도 함께 배포합니다.
`unpkg`와 `jsdelivr` 필드가 이 파일을 가리키므로 두 CDN의 패키지 기본 URL이 이 파일을 제공하며, `window.ErdEditor`를 정의합니다.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@3.6.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

이 파일을 불러오면 `<erd-editor>`가 동일하게 등록되고, `window.ErdEditor`에 `ErdEditor.setGetShikiServiceCallback` 같은 콜백 설정 함수가 들어 있습니다.
exports 맵은 여전히 ES 모듈을 가리키므로 npm으로 설치하면 번들러가 이 파일을 사용하지 않습니다.

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

여기에 `readonly`를 추가하면 편집이 차단됩니다. `value` 할당, `clear()` 호출, 모든 `setSchema*()`가 무시되고 `change` 이벤트도 발생하지 않습니다. `editor.value`로 읽는 것은 그대로 동작합니다. 불러올 때는 `setInitialValue()`를 사용하세요.

### 서버 사이드 렌더링

패키지를 import하면 모듈 스코프에서 커스텀 엘리먼트를 등록하기 때문에 DOM이 필요하며 Node에서는 에러가 발생합니다.
Next.js, Nuxt, SvelteKit, Astro에서는 클라이언트에서만 실행되는 경로에서 import하세요.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript

패키지를 import하면 `erd-editor`가 `HTMLElementTagNameMap`에 병합되므로, 캐스팅 없이 타입이 지정됩니다.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

직접 선언한 변수나 props에 타입을 지정할 수 있도록 `ErdEditorElement`를 export하고 있습니다.

## 구문 강조

Schema SQL과 Code Generator 패널은 하이라이터를 제공하지 않으면 일반 텍스트로 표시됩니다.
[`@dineug/erd-editor-shiki-worker`](https://www.npmjs.com/package/@dineug/erd-editor-shiki-worker)는 하이라이터를 shared worker에서 실행합니다.
Shiki와 문법 파일의 빌드 크기가 1MB를 훌쩍 넘기 때문에 별도 패키지로 분리되어 있습니다.

```sh
npm install @dineug/erd-editor-shiki-worker
```

```js
import { setGetShikiServiceCallback } from '@dineug/erd-editor';

// 하이라이터가 메인 청크에 포함되지 않도록 지연 로딩합니다
import('@dineug/erd-editor-shiki-worker').then(({ getShikiService }) => {
  setGetShikiServiceCallback(getShikiService);
});
```

CDN에서 사용하는 경우:

```html
<script type="module">
  import { setGetShikiServiceCallback } from 'https://esm.run/@dineug/erd-editor';
  import { getShikiService } from 'https://esm.run/@dineug/erd-editor-shiki-worker';

  setGetShikiServiceCallback(getShikiService);
</script>
```

script 태그에서는 두 UMD 빌드가 정의하는 전역을 사용합니다.

```html
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@3.6.0"></script>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor-shiki-worker@0.3.0"></script>
<script>
  ErdEditor.setGetShikiServiceCallback(ErdEditorShikiWorker.getShikiService);
</script>
```

에디터가 마운트되기 전이든 후든 한 번만 등록하면 됩니다. 이미 화면에 열려 있는 패널은 하이라이터가 도착하면 다시 렌더링됩니다.
SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python을 지원합니다. `AML`과 `DBML` [코드 생성](../guide/guides/code-generator.md) 대상은 번들에 문법 파일이 없어서 해당 패널은 일반 텍스트로 남습니다.

`SharedWorker`가 없는 환경(안드로이드 Chrome, 16.4 이전 Safari)에서는 하이라이터가 반환되지 않아 패널이 일반 텍스트로 남습니다.

## Web Worker

에디터는 세 가지 작업을 `SharedWorker`에서 실행합니다. 구문 강조, PNG 내보내기, 문서 가비지 컬렉션입니다.
따로 설정할 것은 없지만 호스트가 막을 수 있는 작업들이므로, 각각 대체 경로를 가지고 있습니다.

| 워커 | 출처 | 없을 때 |
| --- | --- | --- |
| 구문 강조 | `@dineug/erd-editor-shiki-worker`, 직접 등록 | Schema SQL과 Code Generator 패널이 일반 텍스트로 남습니다 |
| PNG 내보내기 | `@dineug/erd-editor` | 메인 스레드에서 그리므로 그리는 동안 페이지가 멈춥니다 |
| 스키마 가비지 컬렉션 | `@dineug/erd-editor` | 인프로세스로 실행됩니다 |

에디터가 소유한 두 워커는 응답을 10초까지 기다린 뒤 워커 없이 진행하므로, 워커를 막는 호스트에서는 기능이 사라지는 대신 성능만 손해를 봅니다.

번들 빌드에서는 에디터가 소유한 두 워커가 별도 파일로 함께 배포되므로, CSP가 엄격한 페이지에는 `worker-src 'self'`가 필요합니다. 번들러가 워커를 인라인한다면 `blob:`도 함께 필요합니다.
[script 태그](#script-태그) 빌드에서는 두 워커가 `data:` URL로 파일 안에 함께 들어가므로, 그 페이지에는 `worker-src data:`가 필요합니다.

## 진입점

`@dineug/erd-editor`를 import하면 부수 효과로 `<erd-editor>`가 등록됩니다. 그 외에는 엘리먼트 타입과 3개의 콜백 setter를 export합니다.

| Export | 설명 |
| --- | --- |
| `ErdEditorElement` (타입) | 엘리먼트 인터페이스입니다. [ErdEditorElement](./erd-editor-element.md) 문서를 참고하세요. |
| `setGetShikiServiceCallback(cb)` | 구문 강조기를 주입합니다. `() => ShikiService \| null` |
| `setExportFileCallback(cb)` | 브라우저 다운로드를 대체합니다. `(blob, { fileName }) => void` |
| `setImportFileCallback(cb)` | 브라우저 파일 선택창을 대체합니다. `({ type, op, accept }) => void` |

`@dineug/erd-editor/engine.js`는 두 번째 진입점입니다. DOM 없이 문서 store를 실행하므로 Web Worker에서도 동작합니다. [원격 저장](./advanced/remote-storage.md) 문서를 참고하세요.

### 파일 다이얼로그

가져오기와 내보내기는 주입 가능한 콜백을 거치기 때문에, 브라우저 파일 다이얼로그가 없는 호스트(예: IDE 웹뷰)도 자체 구현을 제공할 수 있습니다.
둘은 대칭이 아닙니다. 내보내기는 완성된 파일을 넘겨주지만, 가져오기는 파일을 요청하기만 하고 그 내용을 다시 에디터에 넣는 것은 직접 처리해야 합니다.

`op`는 `set` 또는 `diff`입니다. `diff`이면 `type`과 관계없이 `setDiffValue()`로 전달됩니다. 그 외에는 `type`이 메서드를 결정하며, `accept`에는 해당 타입의 확장자가 담겨 있어 호스트의 파일 다이얼로그에 그대로 넘길 수 있습니다.

| `type` | `accept` | 메서드 |
| --- | --- | --- |
| `json` | `.json` | `editor.value = text` |
| `sql` | `.sql` | `editor.setSchemaSQL(text)` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text)` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text)` |
| `aml` | `.aml` | `editor.setSchemaAML(text)` |

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.value = text;
  } else if (type === 'sql') {
    editor.setSchemaSQL(text);
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text);
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text);
  } else if (type === 'aml') {
    editor.setSchemaAML(text);
  }
});
```

처리할 `type`마다 분기하고 나머지는 무시하세요.
`value`에 할당하면 파싱하기 전에 문서를 먼저 비우기 때문에, `.erd.json` 문서가 아닌 데이터를 그쪽으로 보내면(catch-all `else`를 두었거나 나중에 추가된 `type`이 흘러 들어온 경우) 가져오기 대신 다이어그램이 비워집니다.

에디터가 생성하는 `fileName`은 `<데이터베이스 이름>-<시간>`에 `.erd.json`, `.sql`, `.png`를 붙인 형태이며, 시간은 `yyyy-MM-dd'T'HH_mm_ss` 형식입니다. 데이터베이스 이름이 비어 있으면 `unnamed`로 대체됩니다.

설정하지 않으면 에디터는 브라우저의 기본 다운로드와 파일 선택창을 사용합니다. `null`을 전달하면 다시 기본 동작으로 돌아갑니다.

## 브라우저 지원

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — 배포되는 번들이 빌드되는 ES2022 기준입니다.
폴리필은 포함되어 있지 않습니다. 더 낮은 버전의 브라우저까지 지원하려면 직접 추가하세요.
