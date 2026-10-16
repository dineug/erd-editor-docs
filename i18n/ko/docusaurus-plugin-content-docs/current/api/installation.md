---
sidebar_position: 1
description: npm이나 CDN으로 @dineug/erd-editor를 설치하고, 커스텀 엘리먼트를 마운트하고, 파일 다이얼로그를 연결하고, 3.x에서 업그레이드하는 방법.
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
`4.1.0`부터 열려 있는 [탐색기](../guide/guides/explorer.md)는 엘리먼트 안에서 ERD 캔버스의 왼쪽에 도킹되며, 캔버스를 덮지 않고 캔버스의 너비를 줄입니다. 새로 연 에디터는 탐색기가 닫힌 상태로 시작합니다.
패널은 `200px`보다 좁게 그려지지 않고 캔버스에 `320px` 이상의 너비를 남기므로, 엘리먼트가 `520px`보다 좁으면 열려 있는 탐색기는 엘리먼트가 넓어질 때까지 그려지지 않습니다. [캔버스 옆](../guide/guides/explorer.md#캔버스-옆) 문서를 참고하세요.

`setInitialValue('')`는 비어 있는 새 문서로 시작합니다. `value`에 할당하면 편집으로 처리되어 Undo 기록에 남습니다.
`4.0.0`부터 `editor.value`는 파일에 담기는 형태의 문서이며, 저장할 것은 이 값입니다. `editor.runtimeValue`는 삭제된 엔티티까지 포함해 에디터가 가지고 있는 그대로의 문서입니다. 공동 편집자를 초기화하는 데 쓰며 파일에는 절대 저장하지 않습니다. [runtimeValue](./erd-editor-element.md#runtimevalue) 문서를 참고하세요.
`4.0.0`부터 새 문서는 모든 [설정 잠금](../guide/guides/settings.md#잠금)도 켜진 상태입니다. 화면, 탭, Code Generator 언어, 두 이름 케이스, 괄호 타입이 잠깁니다. 스크롤하거나 확대/축소하거나 탭을 전환하거나 이 설정 중 하나를 바꿔도 `editor.value`는 그대로 유지되며 `change`도 발생하지 않습니다. 텍스트에서 불러온 문서는 그 안에 기록된 잠금을 유지합니다. `4.0.0` 이전에 저장한 모든 파일처럼 잠금이 기록되지 않은 문서는 저장된 화면과 탭에 상관없이 모든 잠금이 켜진 상태로, 확대/축소 100%와 ERD 탭에서 열립니다. 화면은 원점 `0, 0`으로 잠기며, 그 위치에 다이어그램이 전혀 그려져 있지 않으면 대신 다이어그램이 있는 곳에서 열립니다. [setInitialValue](./erd-editor-element.md#setinitialvalue) 문서를 참고하세요.
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
버전이 없는 URL은 항상 최신 릴리스를 제공합니다. 메이저 업그레이드가 예고 없이 페이지에 반영되는 것을 원하지 않는다면 `https://esm.run/@dineug/erd-editor@4.1.0`처럼 버전을 고정하세요.
`4.0.0` 자체가 메이저 업그레이드입니다. 3.x에 머물러야 하는 페이지는 `@3.10.0`으로 고정하세요. [3.x에서 업그레이드](#3x에서-업그레이드) 항목을 참고하세요.

### script 태그

`3.6.0`부터 모든 의존성과 모든 shared worker를 한 파일에 담은 UMD 빌드도 함께 배포합니다.
`unpkg`와 `jsdelivr` 필드가 이 파일을 가리키므로 두 CDN의 패키지 기본 URL이 이 파일을 제공하며, `window.ErdEditor`를 정의합니다.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

이 파일을 불러오면 `<erd-editor>`가 동일하게 등록되고, `window.ErdEditor`에 파일 콜백 두 개, `ErdEditor.setExportFileCallback`과 `ErdEditor.setImportFileCallback`, 그리고 `3.9.2`부터는 `ErdEditor.createKeyBindingMap`이 들어 있습니다.
exports 맵은 여전히 ES 모듈을 가리키므로 npm으로 설치하면 번들러가 이 파일을 사용하지 않습니다.

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
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

`4.0.0`부터 `enable-locale-picker`는 툴바에 `Display Language` 선택기를, `enable-welcome-screen`은 빈 다이어그램에 표시되는 시작 화면을 추가합니다. [enableLocalePicker](./erd-editor-element.md#enablelocalepicker)와 [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen) 문서를 참고하세요.
[사용](#사용)의 예제처럼 문서를 불러오는 페이지는 마크업에서 켜지 말고 `setInitialValue()`로 문서를 불러온 뒤에 `enableWelcomeScreen`을 켜세요. 그래야 아직 불러오는 중인 파일 위로 시작 화면이 잠깐 나타나는 일이 없습니다.
25개 표시 언어는 ES 빌드와 script 태그 빌드 모두 패키지 안에 들어 있으므로, 따로 제공할 로케일 파일도 등록할 것도 없습니다. 선택기도 없고 `setLocale()`도 호출하지 않으면 에디터는 영어로 표시됩니다.

여기에 `readonly`를 추가하면 편집이 차단됩니다. `value` 할당, `clear()` 호출, `setSchemaJSON()`과 추가 모드 호출을 포함한 모든 `setSchema*()` 호출이 무시되고 `change` 이벤트도 발생하지 않습니다. `editor.value`와 `editor.runtimeValue`로 읽는 것은 그대로 동작합니다. 불러올 때는 `setInitialValue()`를 사용하세요.

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
`4.0.0`부터는 `LocaleCode`, `LocaleOption`, `SchemaSQLOptions` 타입도 export합니다. [진입점](#진입점) 항목을 참고하세요. `setSchema*()` 메서드가 받는 옵션에는 export된 이름이 없으므로, `Parameters<ErdEditorElement['setSchemaSQL']>[1]`처럼 엘리먼트에서 읽어 오세요.

## 구문 강조

Schema SQL과 Code Generator 패널은 전용 shared worker에서 동작하는 [Shiki](https://shiki.style)가 강조하며, `4.0.0`부터는 Schema SQL 탭의 `Before tables`와 `After tables` 스크립트도 강조합니다.
`3.7.0`부터는 설치할 것도 등록할 것도 없습니다. 워커는 코드 패널이 처음 렌더링될 때 만들어지므로, 코드 패널을 한 번도 열지 않는 페이지는 문법 파일을 내려받지 않습니다.

| | |
| --- | --- |
| 언어 | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| 테마 | `github-dark`와 `github-light`. 에디터의 밝은 / 어두운 외형을 따릅니다 |

패널이 실제로 출력하는 언어와 정확히 일치합니다. `JPA`는 Java, `SQLAlchemy`는 Python, `TypeORM`, `Sequelize`, `Drizzle`, `Zod`는 TypeScript, `Doctrine`은 PHP, `SeaORM`은 Rust, `JSON Schema`는 JSON으로 강조되고, `DBML`과 `AML`은 번들에 있는 문법 중 가장 가까운 SQL로 강조됩니다. [코드 생성](../guide/guides/code-generator.md) 문서를 참고하세요.

정규식 엔진이 순수 JavaScript이므로 호스트 정책에 `wasm-unsafe-eval`이 필요하지 않습니다.
`SharedWorker`가 없는 환경(안드로이드 Chrome, 16.4 이전 Safari)에서는 실패가 로그로 남고 코드가 일반 텍스트로 표시됩니다. 스크립트는 그대로 편집할 수 있습니다.

`3.6.0` 이하에서 올라온다면, `@dineug/erd-editor-shiki-worker`는 더 이상 배포되지 않고 `setGetShikiServiceCallback`도 함께 사라졌습니다.
설치와 등록 코드를 지우세요. CDN에서 워커를 불러오던 페이지라면 두 번째 `<script>` 태그도 함께 지웁니다.

## Web Worker

에디터는 세 가지 작업을 `SharedWorker`에서 실행합니다. 구문 강조, 이미지 내보내기, 그리고 [자동 배치](../guide/guides/table-related-functions.md#자동-배치)와 Visualization 탭의 [Flow 모드](../guide/guides/visualization.md#flow-배치-방식), `4.0.0`부터는 가져온 스키마의 배치가 사용하는 테이블 배치입니다.
셋 모두 `@dineug/erd-editor` 안에 들어 있습니다. 따로 설정할 것은 없지만, 모두 호스트가 막을 수 있는 작업입니다.
문서 가비지 컬렉션을 실행하던 워커는 `4.0.0`에서 가비지 컬렉션 자체와 함께 제거되었습니다.

| 워커 | 없을 때 |
| --- | --- |
| 구문 강조 | Schema SQL과 Code Generator 패널, Schema SQL 스크립트가 일반 텍스트로 남습니다 |
| 이미지 내보내기 | PNG, SVG, `Copy to clipboard`, `Export image` 대화 상자의 미리보기를 메인 스레드에서 그리므로 그리는 동안 페이지가 멈춥니다 |
| 테이블 배치 | 자동 배치의 `Flow`, `Tree - vertical`, `Tree - horizontal` 배치와 Visualization 탭의 Flow 모드가 `Could not place tables`로 끝납니다. Flow로 배치되는 가져오기(`Import`나 `Import and Add`로 가져온 SQL, GraphQL, DBML, AML 파일, 또는 `placement: 'auto'`를 지정한 `setSchema*()` 호출)는 메시지 없이 테이블을 여러 행으로 배치합니다. `Force`와 Graph 모드는 에디터 안에서 실행되므로 영향을 받지 않습니다 |

이미지 내보내기는 워커의 응답을 10초까지 기다린 뒤 메인 스레드에서 그리고, 구문 강조는 워커가 실패하는 즉시 코드를 일반 텍스트로 남기므로, 워커를 막는 호스트에서는 기능이 사라지는 대신 성능만 손해를 봅니다.
테이블 배치만 예외입니다. 배치를 계산하는 엔진이 에디터 자체보다 무거워 인프로세스로는 절대 올리지 않기 때문에, 첫 배치에서 워커를 30초까지 기다리고, 워커가 응답한 뒤에는 배치 결과가 돌아오기를 60초까지 기다립니다.
어느 쪽이든 기다리는 시간이 끝나면 배치는 워커가 없을 때와 같이 끝납니다. 자동 배치는 시작하자마자 `Placing tables`를 표시하지만, Flow 모드와 Flow로 배치되는 가져오기는 워커 시작까지 포함한 배치가 6초 동안 이어진 뒤에야 표시합니다.

번들 빌드에서는 세 워커가 모두 별도 파일로 함께 배포되므로, CSP가 엄격한 페이지에는 `worker-src 'self'`가 필요합니다. 번들러가 워커를 인라인한다면 `blob:`도 함께 필요합니다.
[script 태그](#script-태그) 빌드에서는 셋 모두 `data:` URL로 파일 안에 들어가므로, 그 페이지에는 `worker-src data:`가 필요합니다.

## 진입점

`@dineug/erd-editor`를 import하면 부수 효과로 `<erd-editor>`가 등록됩니다. 그 외에는 엘리먼트 타입과 2개의 콜백 setter, `3.9.2`부터는 기본 키 바인딩과 그 타입, `4.0.0`부터는 표시 언어 타입과 `getSchemaSQL()` 옵션 타입을 export합니다.

| Export | 설명 |
| --- | --- |
| `ErdEditorElement` (타입) | 엘리먼트 인터페이스입니다. [ErdEditorElement](./erd-editor-element.md) 문서를 참고하세요. |
| `setExportFileCallback(cb)` | 브라우저 다운로드를 대체합니다. `(blob, { fileName }) => void` |
| `setImportFileCallback(cb)` | 브라우저 파일 선택창을 대체합니다. `({ type, op, accept, mode }) => void`이며, `mode`는 `4.0.0`부터 전달됩니다. |
| `createKeyBindingMap()` | 기본 키 바인딩을 호출할 때마다 새 `KeyBindingMap`으로 반환합니다. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) 문서를 참고하세요. |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (타입) | 바인딩 맵, 그 명령 이름의 유니언, 바인딩 하나의 타입입니다. |
| `LocaleCode`, `LocaleOption` (타입) | `4.0.0`부터 제공됩니다. 25개 표시 언어 코드, 그리고 그 코드에 `'system'`을 더한 것으로 `setLocale()`이 받는 타입입니다. [Display Language](./erd-editor-element.md#display-language) 문서를 참고하세요. |
| `SchemaSQLOptions` (타입) | `4.0.0`부터 제공됩니다. `getSchemaSQL()`이 받는 `statements`와 `header` 옵션입니다. [getSchemaSQL](./erd-editor-element.md#getschemasql) 문서를 참고하세요. |

`@dineug/erd-editor/engine.js`는 두 번째 진입점입니다. DOM 없이 문서 store를 실행하므로 Web Worker에서도 동작합니다. [원격 저장](./advanced/remote-storage.md) 문서를 참고하세요.
이 진입점은 `createReplicationStore`와 `ReplicationStore` 타입을 export합니다. `3.10.0`부터는 복제본의 `change` 리스너가 받는 `ReplicationChange` 타입(`{ value: string; changed: boolean }`)도 export합니다. [on@change](./advanced/remote-storage.md#onchange) 문서를 참고하세요.
`4.0.0`부터 `ReplicationStore`에는 `runtimeValue`도 있습니다. 그 `value`와 `change`가 넘겨주는 `value`는 엘리먼트와 마찬가지로 파일에 담기는 형태입니다. [ReplicationStore](./advanced/remote-storage.md#replicationstore) 문서를 참고하세요.

`3.9.1`부터는 세 번째 진입점 `@dineug/erd-editor/peer.js`가 있습니다. [MCP 서버](../mcp/introduction.md)가 문서를 편집할 때 거치는 헤드리스 피어입니다. 이 서버를 위한 진입점이며, 이 문서에서는 다루지 않습니다.

### 파일 다이얼로그

가져오기와 내보내기는 주입 가능한 콜백을 거치기 때문에, 브라우저 파일 다이얼로그가 없는 호스트(예: IDE 웹뷰)도 자체 구현을 제공할 수 있습니다.
둘은 대칭이 아닙니다. 내보내기는 완성된 파일을 넘겨주지만, 가져오기는 파일을 요청하기만 하고 그 내용을 다시 에디터에 넣는 것은 직접 처리해야 합니다.

`op`는 `set` 또는 `diff`입니다. `diff`이면 `type`과 관계없이 `setDiffValue()`로 전달됩니다. 그 외에는 `type`이 메서드를 결정하며, `accept`에는 해당 타입의 확장자가 담겨 있어 호스트의 파일 다이얼로그에 그대로 넘길 수 있습니다.
`4.0.0`부터 사용자가 [Import and Add](../guide/guides/file-import-export.md#가져와서-추가)를 고르면 `set`에 `mode: 'append'`가 함께 전달되며, 일반 Import에는 `mode`가 없습니다. 이 값을 그대로 넘기세요. `mode`를 버리는 콜백은 사용자가 추가하려던 다이어그램을 대체해 버립니다.

| `type` | `accept` | 메서드 |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'`는 에디터 자체의 Import와 마찬가지로 테이블을 놓기 전에 관계를 따라 배치하며, 호출이 Promise를 반환하게 합니다. 지정하지 않으면 테이블은 즉시 여러 행으로 놓입니다. [setSchemaSQL](./erd-editor-element.md#setschemasql)과 [setSchemaJSON](./erd-editor-element.md#setschemajson) 문서를 참고하세요.

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

처리할 `type`마다 분기하고 나머지는 무시하세요.
문서를 대체하는 `setSchemaJSON()`은 `value` 할당과 마찬가지로 파싱하기 전에 문서를 먼저 비우기 때문에, `.erd.json` 문서가 아닌 데이터를 그쪽으로 보내면(catch-all `else`를 두었거나 나중에 추가된 `type`이 흘러 들어온 경우) 가져오기 대신 다이어그램이 비워집니다.

에디터가 생성하는 `fileName`은 `<데이터베이스 이름>-<시간>`에 파일의 확장자를 붙인 형태이며, 시간은 현지 시간 기준으로 `yyyy-MM-dd'T'HH_mm_ss` 형식입니다. 데이터베이스 이름이 비어 있으면 `unnamed`로 대체됩니다.
내보내기 콜백은 다음 파일을 받습니다. `4.0.0`부터는 SVG와 Code Generator의 파일도 포함되며, `.sql`은 `Export`에서 바로 저장되지 않고 Schema SQL 탭의 `Save file`에서 옵니다.

| 파일 | 확장자 | Blob `type` |
| --- | --- | --- |
| JSON 내보내기 | `.erd.json` | `application/json` |
| 탭에 표시된 텍스트를 담는 Schema SQL 탭의 `Save file`. [Schema SQL](../guide/guides/schema-sql.md) 문서를 참고하세요 | `.sql` | 없음 |
| [Export image](../guide/guides/file-import-export.md#이미지) 대화 상자 | `.png` 또는 `.svg` | `image/png` 또는 `image/svg+xml` |
| Code Generator 탭의 `Save file`. [코드 생성](../guide/guides/code-generator.md) 문서를 참고하세요 | 언어별 확장자: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json`, `.mmd` 중 하나 | 없음 |

확장자로 처리기를 고르는 호스트는 이 확장자마다 처리기가 필요합니다.

설정하지 않으면 에디터는 브라우저의 기본 다운로드와 파일 선택창을 사용합니다. `null`을 전달하면 다시 기본 동작으로 돌아갑니다.

## 브라우저 지원

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — 배포되는 번들이 빌드되는 ES2022 기준입니다.
폴리필은 포함되어 있지 않습니다. 더 낮은 버전의 브라우저까지 지원하려면 직접 추가하세요.

## 3.x에서 업그레이드

`4.0.0`은 메이저 릴리스입니다. 페이지를 3.x에서 옮길 때 다음 항목을 하나씩 확인하세요.

- `editor.value`, 복제본의 `value`, 그 `change`가 넘겨주는 `value`는 파일에 담기는 형태입니다. 삭제된 엔티티, 측정된 너비, 쌓임 순서, 관계 앵커는 들어 있지 않습니다. `value`는 계속 저장하고, 이 정보는 `runtimeValue`에서 읽으세요. 엔티티 타임스탬프(`meta`)는 완전히 사라졌습니다. 실행 중인 세션에 참여하는 공동 편집자나 복제본은 `value`나 파일이 아니라 실행 중인 피어의 `runtimeValue`로 초기화하고, `runtimeValue`는 절대 저장하지 마세요. [value](./erd-editor-element.md#value)와 [runtimeValue](./erd-editor-element.md#runtimevalue) 문서를 참고하세요.
- 설정 잠금이 `Save Scroll Information`과 `Save Zoom Information`을 대체합니다. 새 문서와 `4.0.0` 이전에 저장한 모든 문서는 모든 잠금이 켜져 있으므로, 스크롤, 확대/축소, 탭 전환, 또는 Code Generator 언어나 이름 케이스, 괄호 타입을 바꿔도 `value`는 그대로 유지되며 `change`도 발생하지 않습니다. `change`로 화면을 저장해 오던 페이지라면 Settings 탭에서 `Viewport`(탭은 `Canvas Type`)의 잠금을 해제하거나, `settings.lockSettings`에서 해당 비트가 꺼져 있는 문서를 사용해야 합니다. [잠금](../guide/guides/settings.md#잠금) 문서를 참고하세요.
- `settings`에는 더 이상 `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, `ignoreSaveSettings`가 없으며, `SaveSettingType` 상수도 사라졌습니다. `LockSettingType` 비트를 사용하는 `settings.lockSettings`가 `ignoreSaveSettings`를 대신하며, `4.0.0` 이상은 `ignoreSaveSettings`를 읽지도 쓰지도 않습니다. [Settings](./advanced/schema.md#settings) 문서를 참고하세요.
- 모든 파일이 `$schema`에 지정하는 [JSON Schema](./advanced/schema.md#json-schema)는 이제 파일에 담기는 형태만 기술하는 닫힌 스키마입니다. 이전 릴리스가 저장한 파일은 `4.0.0` 이상에서 저장해 다시 작성되기 전까지 이 스키마를 통과하지 못합니다.
- 문서 가비지 컬렉션은 그 워커와 함께 사라졌으므로, 삭제된 엔티티는 다음에 파일에서 문서를 열 때까지 `runtimeValue`에 남아 있습니다. 남은 shared worker는 세 개입니다. [Web Worker](#web-worker) 항목을 참고하세요.
- 공유 세션의 모든 에디터와 복제본을 `4.0.0` 이상으로 맞추세요. 이전 릴리스는 새 액션 타입, 즉 테이블 그룹, Map Columns, 잠금, Schema SQL 스크립트의 액션 타입을 무시합니다. [릴리스 혼용](./advanced/collaborative-editing.md#릴리스-혼용) 문서를 참고하세요.
- 가져오기 콜백은 Import and Add에서 `mode: 'append'`를 받으며, 콜백은 이 값을 그대로 넘겨야 합니다. 내보내기 콜백은 이제 `.svg`와 Code Generator 파일도 받으며, `Export` ▸ `Schema SQL`은 저장하는 대신 Schema SQL 탭을 열므로 `.sql`은 그 탭의 `Save file`에서만 옵니다. [파일 다이얼로그](#파일-다이얼로그) 항목을 참고하세요.
- `Delete`와 `Backspace`는 새 `removeSelection`에 지정됩니다. 에디터가 텍스트 입력란 밖에서 포커스를 가지고 있는 동안에는 모든 탭에서 키의 기본 동작이 막히며, ERD 탭에서는 선택한 항목이 삭제됩니다. `KeyBindingName`과 `KeyBindingMap`에 이 항목이 추가되었으며, `setKeyBindingMap({ removeSelection: [] })`을 호출하면 두 키를 페이지에 맡깁니다. [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) 문서를 참고하세요.
- `ThemeOptions.appearance`는 테마 빌더의 `System`에 해당하는 `'system'`도 받으며, `systemDarkMode`를 켜면 이 값이 설정됩니다. `changePresetTheme`은 `System`이 선택된 동안 `'system'`을 보고하므로, 그대로 저장했다가 `setPresetTheme`에 다시 넘기세요. `systemDarkMode`가 켜져 있을 때 `'light'`나 `'dark'`로 호출한 `setPresetTheme()`은 이제 다음 운영체제 변경에 덮어쓰이지 않고 그대로 유지됩니다. [systemDarkMode](./erd-editor-element.md#systemdarkmode)와 [changePresetTheme](./erd-editor-element.md#changepresettheme) 문서를 참고하세요.
- `@dineug/erd-editor-mcp` `1.0.0`, VS Code 확장 `4.0.0` 이상, Obsidian과 JetBrains 플러그인 `1.0.0` 이상은 허브 프로토콜 2를 사용합니다. 서버 `1.0.0`과 에이전트를 지원하는 이전 에디터 릴리스, 또는 이전 서버와 이 에디터들은 `protocolMismatch`로 서로를 거부하며, 업데이트해야 할 쪽을 알려 줍니다. [업데이트](../mcp/installation.md#업데이트) 문서를 참고하세요.
- 버전이 없는 CDN URL은 이제 최신 4.x 릴리스를 제공합니다. 3.x에 머무르려면 `@3.10.0`으로 고정하세요. [CDN](#cdn) 항목을 참고하세요.
