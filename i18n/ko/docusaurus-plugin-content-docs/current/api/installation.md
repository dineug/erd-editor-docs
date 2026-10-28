---
sidebar_position: 1
description: npm이나 CDN으로 @dineug/erd-editor를 설치하고, 에디터와 뷰어 엘리먼트를 등록하고, 파일 대화 상자를 연결하고, 4.x나 3.x에서 업그레이드하는 방법.
---

# 설치

```sh
npm install @dineug/erd-editor
```

이 패키지는 ESM 전용(`"type": "module"`)이며 `dist` 폴더만 배포합니다.
CommonJS 빌드는 없기 때문에 `require('@dineug/erd-editor')`는 동작하지 않습니다.

이 패키지에는 커스텀 엘리먼트가 둘 있습니다. 에디터인 `<erd-editor>`, 그리고 `5.0.0`부터 다이어그램을 읽기 전용으로 보여 주는 `<erd-viewer>`입니다. [ErdViewerElement](./erd-viewer-element.md) 문서를 참고하세요.
`5.0.0`부터 패키지 루트를 import해도 둘 다 정의되지 않습니다. 각 엘리먼트에는 그 엘리먼트를 정의하는 전용 진입점이 있습니다. [엘리먼트 등록](#registering-the-elements) 항목을 참고하세요.

런타임 의존성은 번들러가 직접 해석하고 중복 제거하고 트리 셰이킹할 수 있도록 bare import 그대로 외부에 남겨 둡니다. `5.0.0`부터 `dist`에는 모듈마다 파일이 하나씩 들어 있어, 번들러는 페이지가 닿는 모듈만 남깁니다. [진입점](#진입점) 항목을 참고하세요.
shared worker는 `dist/workers/` 아래에 별도 진입 파일로 생성되며 `new URL('./…', import.meta.url)` 형태로 만들어집니다. Vite, webpack 5, Rspack이 워커 진입점으로 번들링하는 표기입니다. [Web Worker](#web-worker) 항목을 참고하세요.
번들러가 없는 페이지를 위한 자립형 빌드를 둘 제공합니다. [script 태그](#script-태그) 항목을 참고하세요.

## 사용

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js`는 import되는 즉시 `<erd-editor>`를 정의합니다. 다이어그램만 보여 주는 페이지는 대신 `@dineug/erd-editor/erd-viewer.js`를 import합니다. [ErdViewerElement](./erd-viewer-element.md) 문서를 참고하세요.

`<erd-editor>`는 자체 크기를 갖지 않습니다. 엘리먼트나 그 컨테이너에 너비와 높이를 명시적으로 지정해야 합니다.
`4.1.0`부터 열려 있는 [탐색기](../guide/guides/explorer.md)는 엘리먼트 안에서 ERD 캔버스의 왼쪽에 도킹되며, 캔버스를 덮지 않고 캔버스의 너비를 줄입니다. 새로 연 에디터는 탐색기가 닫힌 상태로 시작합니다.
패널은 `200px`보다 좁게 그려지지 않고 캔버스에 `320px` 이상의 너비를 남기므로, 엘리먼트가 `520px`보다 좁으면 열려 있는 탐색기는 엘리먼트가 넓어질 때까지 그려지지 않습니다. [캔버스 옆](../guide/guides/explorer.md#캔버스-옆) 문서를 참고하세요.

`setInitialValue('')`는 비어 있는 새 문서로 시작합니다. 반면 `value`에 할당하면 문서를 편집으로 불러오므로 Undo 히스토리에 남습니다.
`4.0.0`부터 `editor.value`는 파일에 담기는 형태의 문서이며, 저장할 것은 이 값입니다. `editor.runtimeValue`는 삭제된 엔티티까지 포함해 에디터가 가지고 있는 그대로의 문서입니다. 공동 편집자를 초기화하는 데 쓰며 파일에는 절대 저장하지 않습니다. [runtimeValue](./erd-editor-element.md#runtimevalue) 문서를 참고하세요.
`4.0.0`부터 새 문서는 모든 [설정 잠금](../guide/guides/settings.md#잠금)도 켜진 상태입니다. 화면, 탭, Code Generator 언어, 두 이름 케이스, 괄호 타입, 그리고 `4.2.0`부터는 [이름 표시](../guide/guides/logical-names.md#name-view)가 잠깁니다. 스크롤하거나 확대/축소하거나 탭을 전환하거나 이름 표시를 전환하거나 나머지 설정 중 하나를 바꿔도 `editor.value`는 그대로 유지되며 `change`도 발생하지 않습니다. 텍스트에서 불러온 문서는 그 안에 기록된 잠금을 유지합니다. `4.0.0` 이전에 저장한 모든 파일처럼 잠금이 기록되지 않은 문서는 저장된 화면과 탭에 상관없이 모든 잠금이 켜진 상태로, 확대/축소 100%와 ERD 탭에서 열립니다. 화면은 원점 `0, 0`으로 잠기며, 그 위치에 다이어그램이 전혀 그려져 있지 않으면 대신 다이어그램이 있는 곳에서 열립니다. [setInitialValue](./erd-editor-element.md#setinitialvalue) 문서를 참고하세요.
`4.2.0` 이전에 저장한 파일은 나머지 잠금이 모두 꺼져 있더라도 이름 표시가 `Physical Names`로 잠긴 상태로 열립니다. `4.0.0`이나 `4.1.0` 에디터는 저장할 때 이름 표시 잠금은 그대로 유지하지만 보기는 버리므로, 이름 표시의 잠금을 해제한 채 저장된 `4.2.0` 파일은 잠금이 해제된 상태로 남지만 다시 열면 `Physical Names`로 열립니다.
나머지 API는 [ErdEditorElement](./erd-editor-element.md) 문서를 참고하세요.

### CDN

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run`이 패키지의 외부 의존성을 대신 해석해 주므로 번들러 없이도 동작합니다.
각 진입점은 버전 뒤의 경로로 가져옵니다. `…/erd-editor.js`는 에디터를, `…/erd-viewer.js`는 뷰어를 정의하며, 뷰어는 영어를 제외한 각 표시 언어를 페이지가 요청할 때 CDN에서 가져옵니다. 패키지 기본 URL인 `https://esm.run/@dineug/erd-editor@5.0.0`은 루트를 제공하며, 루트는 엘리먼트를 정의하지 않습니다.
버전이 없는 URL은 항상 최신 릴리스를 제공합니다. 메이저 업그레이드가 예고 없이 페이지에 반영되는 것을 원하지 않는다면 위처럼 버전을 고정하세요.
`5.0.0` 자체가 메이저 업그레이드입니다. 4.x에 머물러야 하는 페이지는 `@4.2.0`으로 고정하세요. [4.x에서 업그레이드](#upgrading-from-4x) 항목을 참고하세요.

`esm.run`은 shared worker를 `cdn.jsdelivr.net`에서 제공하는데, 브라우저는 페이지의 출처가 아닌 다른 출처의 shared worker를 시작하지 않습니다. 그래서 이렇게 불러온 에디터는 호스트가 워커를 막은 경우처럼 워커 없이 동작합니다. [Web Worker](#web-worker) 항목을 참고하세요. [script 태그](#script-태그) 빌드는 워커를 파일 안에 담고 있습니다.

### script 태그

`3.6.0`부터 모든 의존성과 모든 shared worker를 한 파일 `dist/erd-editor.umd.js`에 담은 UMD 빌드도 함께 배포합니다.
`unpkg`와 `jsdelivr` 필드가 이 파일을 가리키므로 두 CDN의 패키지 기본 URL이 이 파일을 제공합니다. 이 파일은 `window.ErdEditor`를 정의합니다.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

이 파일을 불러오면 `<erd-editor>`가 정의됩니다. `window.ErdEditor`에는 파일 콜백 두 개, `ErdEditor.setExportFileCallback`과 `ErdEditor.setImportFileCallback`, `3.9.2`부터는 `ErdEditor.createKeyBindingMap`, `4.2.0`부터는 `ErdEditor.dictionaryRowChords`([dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) 문서 참고), 그리고 `5.0.0`부터는 `ErdEditor.ErdEditorElement`와 `ErdEditor.defineErdEditor`([엘리먼트 등록](#registering-the-elements) 항목 참고)가 들어 있습니다. [toImage](./to-image.md)는 들어 있지 않습니다.

`5.0.0`부터는 두 번째 파일 `dist/erd-viewer.umd.js`가 `<erd-viewer>`를 정의하고 `ErdViewerElement`와 `defineErdViewer`를 `window.ErdViewer`에 올립니다. 이 파일은 워커를 시작하지 않고, 25개 표시 언어를 모두 담고 있으며, 지정한 `src` 외에는 아무것도 요청하지 않습니다.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

어느 파일도 상대의 태그를 정의하지 않으며, 각 파일은 자신의 전역과 `window.Konva` 외에는 페이지에 전역을 남기지 않습니다.
exports 맵은 여전히 ES 모듈을 가리키므로 npm으로 설치하면 번들러가 두 파일 모두 사용하지 않습니다.
스크립트를 직접 불러올 수 없는 페이지는 호스팅되는 뷰어(erd-editor.io/embed)를 프레임으로 넣을 수 있습니다. [임베드](../guide/guides/embedding.md) 문서를 참고하세요.

### HTML

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
에디터는 25개 표시 언어를 ES 빌드와 script 태그 빌드 모두에 담고 있으므로, 따로 제공할 로케일 파일도 등록할 것도 없습니다. 선택기도 없고 `setLocale()`도 호출하지 않으면 에디터는 영어로 표시됩니다.

여기에 `readonly`를 추가하면 에디터가 읽는 사람을 위한 모습으로 열립니다. `value` 할당, `clear()` 호출, `setSchemaJSON()`과 추가 모드 호출을 포함한 모든 `setSchema*()` 호출이 무시되고 `change` 이벤트도 발생하지 않습니다. 탭, 탐색기, 빠른 검색은 읽을 수 있게 남고, 다이어그램을 편집하는 컨트롤은 모두 사라집니다.
`editor.value`와 `editor.runtimeValue`를 읽는 것은 그대로 동작하며, 둘 다 문서 자체의 설정을 유지합니다. 읽는 사람이 바꾼 확대/축소나 데이터베이스 같은 보기 설정은 그 에디터의 화면에만 머뭅니다. 불러올 때는 `setInitialValue()`를 사용하세요. [readonly](./erd-editor-element.md#readonly) 문서를 참고하세요.

### 서버 사이드 렌더링

`engine.js`와 `peer.js`를 제외한 모든 진입점은 DOM이 필요하므로 Node에서는 에러가 발생합니다. `erd-editor.js`와 `erd-viewer.js`는 모듈 스코프에서 엘리먼트를 정의하고, `5.0.0`부터 아무것도 정의하지 않는 패키지 루트도 로드하면서 두 엘리먼트 클래스를 만듭니다.
Next.js, Nuxt, SvelteKit, Astro에서는 엘리먼트의 진입점을 클라이언트에서만 실행되는 경로에서 import하고, `setExportFileCallback`이나 `toImage`처럼 루트에서 이름으로 가져오는 import도 같은 경로에서 하세요.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

개발 중에는 에디터의 배치 워커가 import하는 ELK 번들을 Vite의 사전 번들링에 추가하세요. 그렇지 않으면 그 워커가 만드는 배치가 실패합니다. 자동 배치의 `Flow`, `Tree - vertical`, `Tree - horizontal`, Visualization 탭의 Flow 모드, Flow로 배치되는 가져오기가 해당합니다.
Vite 7 이하에서는 에디터를 사전 번들링에서 제외해야 하기도 합니다. 사전 번들이 워커의 URL을 쓰이지 않은 파일로 가리키게 만들어 세 워커가 모두 실패하기 때문입니다. Vite 8에서는 이 `exclude`를 빼 두세요. 넣으면 개발 서버가 패키지의 파일을 하나씩 따로 가져올 뿐입니다. 프로덕션 빌드에는 둘 다 필요하지 않습니다.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript

`@dineug/erd-editor/erd-editor.js`를 import하면 `erd-editor`가, `@dineug/erd-editor/erd-viewer.js`를 import하면 `erd-viewer`가 `HTMLElementTagNameMap`에 병합되므로, 캐스팅 없이 타입이 지정됩니다. 루트에서 가져오는 import는 타입만 가져오더라도 둘 다 가져옵니다.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

직접 선언한 변수나 props에 타입을 지정할 수 있도록 `ErdEditorElement`를 export하고 있습니다. `5.0.0`부터는 이것이 엘리먼트의 클래스이기도 하며, `ErdViewerElement`는 뷰어의 인터페이스이자 클래스입니다. [엘리먼트 등록](#registering-the-elements) 항목을 참고하세요.
`4.0.0`부터는 `LocaleCode`, `LocaleOption`, `SchemaSQLOptions` 타입도, `5.0.0`부터는 `ToImageOptions`도 export합니다. [진입점](#진입점) 항목을 참고하세요. `setSchema*()` 메서드가 받는 옵션에는 export된 이름이 없으므로, `Parameters<ErdEditorElement['setSchemaSQL']>[1]`처럼 엘리먼트에서 읽어 오세요.
`5.0.0`부터 패키지의 `typesVersions`는 exports 맵을 읽지 않는 `moduleResolution: "node10"`에서도 각 하위 경로 진입점의 타입을 지정합니다.

## 엘리먼트 등록 {#registering-the-elements}

`5.0.0`부터 이 패키지는 페이지가 요청한 곳에서만 태그를 정의합니다.

| Import | 정의하는 것 |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | 없음 |

두 진입점은 각각 평가되는 즉시 자신의 태그를 정의하고 아무것도 export하지 않으므로 효과를 위해 import하며, 어느 쪽도 상대의 태그를 정의하지 않습니다.
루트는 두 엘리먼트 클래스 `ErdEditorElement`와 `ErdViewerElement`, 그리고 호출한 곳에서 자신의 태그를 정의하는 `defineErdEditor()`와 `defineErdViewer()`를 export합니다.

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

태그가 이미 그 클래스를 갖고 있으면 호출은 아무 일도 하지 않으므로, 진입점과 define 호출, 또는 define 호출 두 개가 한 페이지에서 만나도 됩니다. 다른 클래스가 태그를 갖고 있으면 태그 이름을 담은 `Error`를 던집니다. 같은 페이지에 번들된 이 패키지의 두 번째 복사본이 그런 경우입니다. `Another element class already defines the custom element name erd-editor`.
루트의 클래스는 진입점이 정의하는 클래스와 같으므로, 둘 중 하나가 실행된 뒤에는 `customElements.get('erd-editor') === ErdEditorElement`입니다. 태그가 정의되기 전의 `document.createElement('erd-editor')`는 에디터의 멤버가 하나도 없는 평범한 `HTMLElement`를 만들고, `new ErdEditorElement()`는 에러를 던집니다.

직접 정한 태그가 필요하면 그 이름으로 클래스를 직접 정의하고 `HTMLElementTagNameMap`에도 태그를 직접 추가하세요. 클래스는 한 window에서 이름 하나만 가질 수 있으므로, 그 엘리먼트의 진입점이나 [script 태그](#script-태그) 빌드를 불러오지 않고 그 엘리먼트의 define 함수도 호출하지 않는 window에서 하세요.

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

두 엘리먼트를 모두 담는 번들에서는 Vite와 Rolldown이 영어를 제외한 표시 언어마다 한 번씩 `INEFFECTIVE_DYNAMIC_IMPORT` 경고를 냅니다. 뷰어는 그 언어를 각각 자체 `import()`로 불러오고, 에디터는 모든 사전을 한꺼번에 import하므로 그 사전들은 에디터의 청크에 남아 함께 로드됩니다. 실패하는 것은 없으며, 뷰어만 담은 번들은 각 언어를 별도 청크로 유지합니다.

## 구문 강조

Schema SQL과 Code Generator 패널은 전용 shared worker에서 동작하는 [Shiki](https://shiki.style)가 강조하며, `4.0.0`부터는 Schema SQL 탭의 `Before tables`와 `After tables` 스크립트도 강조합니다.
`3.7.0`부터는 설치할 것도 등록할 것도 없습니다. 워커는 코드 패널이 처음 렌더링될 때 만들어지므로, 코드 패널을 한 번도 열지 않는 페이지는 문법 파일을 내려받지 않습니다.

| | |
| --- | --- |
| 언어 | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| 테마 | `github-dark`와 `github-light`. 에디터의 라이트 또는 다크 외관을 따릅니다 |

패널이 실제로 출력하는 언어와 정확히 일치합니다. `JPA`는 Java, `SQLAlchemy`는 Python, `TypeORM`, `Sequelize`, `Drizzle`, `Zod`는 TypeScript, `Doctrine`은 PHP, `SeaORM`은 Rust, `JSON Schema`는 JSON으로 강조되고, `DBML`과 `AML`은 번들에 있는 문법 중 가장 가까운 SQL로 강조됩니다. [코드 생성](../guide/guides/code-generator.md) 문서를 참고하세요.

정규 표현식 엔진이 순수 JavaScript이므로 호스트 정책에 `wasm-unsafe-eval`이 필요하지 않습니다.
`SharedWorker`가 없는 환경(Chrome 148 이전의 안드로이드 Chrome, 16.4 이전 Safari)에서는 실패가 로그로 남고 코드가 일반 텍스트로 표시됩니다. 스크립트는 그대로 편집할 수 있습니다.

`3.6.0` 이하에서 업그레이드한다면, `@dineug/erd-editor-shiki-worker`는 더 이상 배포되지 않고 `setGetShikiServiceCallback`도 함께 사라졌습니다.
설치와 등록 코드를 지우세요. CDN에서 워커를 불러오던 페이지라면 두 번째 `<script>` 태그도 함께 지웁니다.

## Web Worker

에디터는 세 가지 작업을 `SharedWorker`에서 실행합니다. 구문 강조, 이미지 내보내기, 그리고 [자동 배치](../guide/guides/table-related-functions.md#자동-배치)와 Visualization 탭의 [Flow 모드](../guide/guides/visualization.md#flow-배치-방식), `4.0.0`부터는 가져온 스키마의 배치가 사용하는 테이블 배치입니다.
셋 모두 `@dineug/erd-editor` 안에 들어 있습니다. 따로 설정할 것은 없지만, 모두 호스트가 막을 수 있는 작업입니다.
`5.0.0`부터 각 워커는 자기 전용 모듈에서 만들어지므로 번들은 그 모듈이 닿는 워커만 담습니다. [toImage](./to-image.md)만 담고 엘리먼트는 없는 번들에는 이미지 내보내기 워커만 들어 있고, `<erd-viewer>`는 워커를 전혀 시작하지 않습니다. [진입점](#진입점) 항목을 참고하세요.
문서 가비지 컬렉션을 실행하던 워커는 `4.0.0`에서 가비지 컬렉션 자체와 함께 제거되었습니다.

| 워커 | 없을 때 |
| --- | --- |
| 구문 강조 | Schema SQL과 Code Generator 패널, Schema SQL 스크립트가 일반 텍스트로 남습니다 |
| 이미지 내보내기 | PNG, SVG, `Copy to clipboard`, `Export image` 대화 상자의 미리보기, 그리고 `5.0.0`부터 [toImage()](./to-image.md)를 메인 스레드에서 그리므로 그리는 동안 페이지가 멈춥니다 |
| 테이블 배치 | 자동 배치의 `Flow`, `Tree - vertical`, `Tree - horizontal` 배치와 Visualization 탭의 Flow 모드가 `Could not place tables`로 끝납니다. Flow로 배치되는 가져오기(`Import`나 `Import and Add`로 가져온 SQL, GraphQL, DBML, AML 파일, 또는 `placement: 'auto'`를 지정한 `setSchema*()` 호출)는 메시지 없이 테이블을 여러 행으로 배치합니다. `Force`와 Graph 모드는 에디터 안에서 실행되므로 영향을 받지 않습니다 |

이미지 내보내기는 워커의 응답을 10초까지 기다린 뒤 메인 스레드에서 그리고, 구문 강조는 워커가 실패하는 즉시 코드를 일반 텍스트로 남기므로, 워커를 막는 호스트에서는 기능이 사라지는 대신 성능만 손해를 봅니다.
테이블 배치만 예외입니다. 배치를 계산하는 엔진이 에디터 자체보다 무거워 인프로세스로는 절대 올리지 않기 때문에, 첫 배치에서 워커를 30초까지 기다리고, 워커가 응답한 뒤에는 배치 결과가 돌아오기를 60초까지 기다립니다.
어느 쪽이든 기다리는 시간이 끝나면 배치는 워커가 없을 때와 같이 끝납니다. 자동 배치는 시작하자마자 `Placing tables`를 표시하지만, Flow 모드와 Flow로 배치되는 가져오기는 워커 시작까지 포함한 배치가 6초 동안 이어진 뒤에야 표시합니다.

Vite, webpack 5, Rspack은 워커를 청크 옆의 파일로 내보냅니다. esbuild와, Vite를 거치지 않고 단독으로 쓰는 Rolldown은 아무것도 내보내지 않으므로, 이들이 빌드한 페이지는 워커 없이 동작합니다.
webpack의 실험 기능 `experiments.outputModule`에서는 워커가 하나도 시작하지 않습니다. 각 워커가 거기서 분리된 청크를 기다리는데 그 청크를 로드하는 것이 없기 때문입니다. webpack의 기본 출력을 쓰거나 `optimization.splitChunks: false`를 설정하세요.

### Content Security Policy {#content-security-policy}

CSP가 엄격한 페이지에는 엘리먼트를 위해 다음 지시문이 필요합니다.

- 번들 빌드에는 `worker-src 'self'`가 필요합니다. 워커가 패키지 옆의 파일이기 때문이며, 번들러가 워커를 인라인한다면 `blob:`도 함께 필요합니다. [script 태그](#script-태그) 빌드에서는 셋 모두 `data:` URL로 파일 안에 들어가므로, 그 페이지에는 대신 `worker-src data:`가 필요합니다. `<erd-viewer>`는 워커를 시작하지 않으므로 둘 다 필요하지 않습니다.
- `5.0.0`부터 두 엘리먼트는 constructed stylesheet로 스스로 스타일을 지정하며, 이는 `style-src 'self'`로 통과됩니다. 에디터의 코드 패널은 여전히 `style` 속성으로 텍스트에 색을 입히고, `Export image` 대화 상자의 미리보기는 `blob:` URL의 이미지이므로, 에디터에는 그 둘을 위한 `style-src 'unsafe-inline'`과 `img-src blob:`도 필요합니다.
- constructed stylesheet가 없는 브라우저(101 이전 Firefox 등)는 대신 `<style>` 엘리먼트를 받으며, 어느 엘리먼트든 `style-src 'unsafe-inline'`이 필요합니다.
- `<erd-viewer>`는 `src`를 가져오므로 그 출처를 `connect-src`에 넣어야 합니다. [페이지에 더하는 것](./erd-viewer-element.md#what-it-adds-to-a-page) 항목을 참고하세요.

## 진입점

이 패키지에는 진입점이 다섯 개 있습니다.

| 진입점 | 설명 |
| --- | --- |
| `@dineug/erd-editor` | 루트입니다. 아래의 export를 제공합니다. `5.0.0`부터 엘리먼트를 정의하지 않지만, 로드하려면 여전히 DOM이 필요합니다 |
| `@dineug/erd-editor/erd-editor.js` | `5.0.0`부터 제공됩니다. `<erd-editor>`를 정의하며 아무것도 export하지 않습니다 |
| `@dineug/erd-editor/erd-viewer.js` | `5.0.0`부터 제공됩니다. `<erd-viewer>`를 정의하며 아무것도 export하지 않습니다 |
| `@dineug/erd-editor/engine.js` | DOM 없는 문서 store입니다 |
| `@dineug/erd-editor/peer.js` | `3.9.1`부터 제공됩니다. MCP 서버의 헤드리스 피어입니다 |

루트는 두 엘리먼트 클래스와 그 define 함수, 2개의 콜백 setter, `3.9.2`부터는 기본 키 바인딩과 그 타입, `4.0.0`부터는 표시 언어 타입과 `getSchemaSQL()` 옵션 타입, `4.2.0`부터는 사전 탭의 행 키 조합, `5.0.0`부터는 `toImage`를 export합니다.

| Export | 설명 |
| --- | --- |
| `ErdEditorElement` | 엘리먼트 인터페이스입니다. [ErdEditorElement](./erd-editor-element.md) 문서를 참고하세요. `5.0.0`부터는 `<erd-editor>`가 정의되는 클래스이기도 합니다. [엘리먼트 등록](#registering-the-elements) 항목을 참고하세요. |
| `ErdViewerElement` | `5.0.0`부터 제공됩니다. 뷰어의 인터페이스이자 클래스입니다. [ErdViewerElement](./erd-viewer-element.md) 문서를 참고하세요. |
| `defineErdEditor()`, `defineErdViewer()` | `5.0.0`부터 제공됩니다. `<erd-editor>`나 `<erd-viewer>`를 그 클래스로 정의합니다. 태그가 이미 그 클래스를 갖고 있으면 호출은 아무 일도 하지 않고, 다른 클래스가 갖고 있으면 `Error`를 던집니다. [엘리먼트 등록](#registering-the-elements) 항목을 참고하세요. |
| `toImage(value, options)` | `5.0.0`부터 제공됩니다. 문서를 `Export image` 대화 상자의 옵션으로 PNG `Blob`이나 SVG 문자열로 그립니다. [toImage](./to-image.md) 문서를 참고하세요. |
| `ToImageOptions` (타입) | `5.0.0`부터 제공됩니다. `toImage()`가 받는 옵션 `format`, `background`, `darkMode`, `scale`입니다. |
| `setExportFileCallback(cb)` | 브라우저 다운로드를 대체합니다. `(blob, { fileName }) => void` |
| `setImportFileCallback(cb)` | 브라우저 파일 선택창을 대체합니다. `({ type, op, accept, mode }) => void`이며, `mode`는 `4.0.0`부터 전달됩니다. `4.2.0`부터 사전 탭의 `Import CSV`는 콜백이 설정되어 있어도 브라우저의 파일 선택창을 엽니다. [파일 다이얼로그](#파일-다이얼로그) 항목을 참고하세요. |
| `createKeyBindingMap()` | 기본 키 바인딩을 호출할 때마다 새 `KeyBindingMap`으로 반환합니다. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) 문서를 참고하세요. |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (타입) | 바인딩 맵, 그 명령 이름의 유니언, 바인딩 하나의 타입입니다. |
| `dictionaryRowChords(map)` | `4.2.0`부터 제공됩니다. 전달한 `KeyBindingMap`에서 [사전](../guide/guides/dictionary.md#adding-and-deleting-rows) 탭의 그리드가 행을 삽입하고 삭제하는 키 조합을 호출할 때마다 새 `ShortcutOption[]`으로 반환합니다. 위에 행을 삽입하는 키 조합(기본값에서는 `Alt+Shift+Enter`)은 어떤 바인딩에도 들어 있지 않습니다. [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) 문서를 참고하세요. |
| `LocaleCode`, `LocaleOption` (타입) | `4.0.0`부터 제공됩니다. 25개 표시 언어 코드, 그리고 그 코드에 `'system'`을 더한 것으로 `setLocale()`이 받는 타입입니다. [Display Language](./erd-editor-element.md#display-language) 문서를 참고하세요. |
| `SchemaSQLOptions` (타입) | `4.0.0`부터 제공됩니다. `getSchemaSQL()`이 받는 옵션으로, `statements`, `header`, 그리고 `4.2.0`부터는 `logicalNameAsComment`가 있습니다. [getSchemaSQL](./erd-editor-element.md#getschemasql) 문서를 참고하세요. |

`5.0.0`부터 `dist`에는 모듈마다 minify되지 않은 파일이 선언 파일과 나란히 하나씩 들어 있고, `package.json`의 `sideEffects`에는 두 태그 진입점과 워커 파일이 필요로 하는 스텁 두 개만 올라 있습니다. 그래서 번들러는 페이지가 닿지 않는 모듈을 모두 버리고 한 번만 minify합니다.

- `setExportFileCallback`처럼 루트에서 이름으로 가져오는 import는 엘리먼트도 워커도 번들하지 않습니다.
- `toImage`는 이미지 내보내기 워커를 가져오고 엘리먼트는 가져오지 않습니다.
- `erd-editor.js`는 에디터와 shared worker 세 개를 모두 가져옵니다.
- `erd-viewer.js`는 뷰어를 가져오고 워커는 가져오지 않습니다. 영어는 그 안에 들어 있고, 다른 표시 언어는 각각 별도 청크에 있다가 페이지가 요청할 때 로드됩니다.

`@dineug/erd-editor/engine.js`는 DOM 없이 문서 store를 실행하므로 Web Worker에서도 동작합니다. [원격 저장](./advanced/remote-storage.md) 문서를 참고하세요.
이 진입점은 `createReplicationStore`와 `ReplicationStore` 타입을 export합니다. `3.10.0`부터는 복제본의 `change` 리스너가 받는 `ReplicationChange` 타입(`{ value: string; changed: boolean }`)도 export합니다. [on@change](./advanced/remote-storage.md#onchange) 문서를 참고하세요.
`4.0.0`부터 `ReplicationStore`에는 `runtimeValue`도 있습니다. 그 `value`와 `change`가 넘겨주는 `value`는 엘리먼트와 마찬가지로 파일에 담기는 형태입니다. [ReplicationStore](./advanced/remote-storage.md#replicationstore) 문서를 참고하세요.

`@dineug/erd-editor/peer.js`는 [MCP 서버](../mcp/introduction.md)가 문서를 편집할 때 거치는 헤드리스 피어입니다. 이 서버를 위한 진입점이며, 이 문서에서는 다루지 않습니다.

### 파일 다이얼로그

가져오기와 내보내기는 주입 가능한 콜백을 거치기 때문에, 브라우저 파일 대화 상자가 없는 호스트(예: IDE 웹뷰)도 자체 구현을 제공할 수 있습니다.
둘은 대칭이 아닙니다. 내보내기는 완성된 파일을 넘겨주지만, 가져오기는 파일을 요청하기만 하고 그 내용을 다시 에디터에 넣는 것은 직접 처리해야 합니다.
`4.2.0`부터 사전 탭의 `Import CSV`는 가져오기 콜백을 절대 호출하지 않는 유일한 가져오기이며, 이 콜백의 `type`에는 CSV 값이 없습니다. 이 가져오기는 항상 `.csv` 파일을 고르는 브라우저 자체의 파일 선택창을 엽니다. [CSV 가져오기와 내보내기](../guide/guides/dictionary.md#importing-and-exporting-csv) 문서를 참고하세요.

`op`는 `set` 또는 `diff`입니다. `diff`이면 `type`과 관계없이 `setDiffValue()`로 전달됩니다. 그 외에는 `type`이 메서드를 결정하며, `accept`에는 해당 타입의 확장자가 담겨 있어 호스트의 파일 대화 상자에 그대로 넘길 수 있습니다.
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

에디터가 생성하는 `fileName`은 `<database name>-<timestamp>`에 파일의 확장자를 붙인 형태이며, 타임스탬프는 현지 시간 기준으로 `yyyy-MM-dd'T'HH_mm_ss` 형식입니다. 데이터베이스 이름이 비어 있으면 `unnamed`로 대체됩니다. 사전의 CSV는 `<database name>-<timestamp>-words.csv`처럼 확장자 앞에 시트 이름이 붙습니다.
내보내기 콜백은 다음 파일을 받습니다. `4.0.0`부터는 SVG와 Code Generator의 파일도 포함되며, `.sql`은 `Export`에서 바로 저장되지 않고 Schema SQL 탭의 `Save file`에서 옵니다. `4.2.0`부터는 사전 탭의 CSV도 포함됩니다. [toImage()](./to-image.md)는 어느 콜백도 호출하지 않고 이미지를 직접 돌려줍니다.

| 파일 | 확장자 | Blob `type` |
| --- | --- | --- |
| JSON 내보내기 | `.erd.json` | `application/json` |
| 탭에 표시된 텍스트를 담는 Schema SQL 탭의 `Save file`. [Schema SQL](../guide/guides/schema-sql.md) 문서를 참고하세요 | `.sql` | 없음 |
| [Export image](../guide/guides/file-import-export.md#이미지) 대화 상자 | `.png` 또는 `.svg` | `image/png` 또는 `image/svg+xml` |
| Code Generator 탭의 `Save file`. [코드 생성](../guide/guides/code-generator.md) 문서를 참고하세요 | 언어별 확장자: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json`, `.mmd` 중 하나 | 없음 |
| 검색에 표시되는 행과 상관없이 표시된 시트의 모든 행을 담는 사전 탭의 `Export CSV`. [CSV 가져오기와 내보내기](../guide/guides/dictionary.md#importing-and-exporting-csv) 문서를 참고하세요 | `.csv` | `text/csv` |

확장자로 처리기를 고르는 호스트는 이 확장자마다 처리기가 필요합니다.

설정하지 않으면 에디터는 브라우저의 기본 다운로드와 파일 선택창을 사용합니다. `null`을 전달하면 다시 기본 동작으로 돌아갑니다.

## 브라우저 지원

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — 배포되는 번들이 빌드 대상으로 삼는 ES2022 기준입니다.
폴리필은 포함되어 있지 않습니다. 더 낮은 버전의 브라우저까지 지원하려면 직접 추가하세요.

## 4.x에서 업그레이드 {#upgrading-from-4x}

`5.0.0`은 메이저 릴리스입니다. 페이지를 4.x에서 옮길 때 다음 항목을 하나씩 확인하세요.

- `import '@dineug/erd-editor'`는 더 이상 `<erd-editor>`를 정의하지 않습니다. 대신 `@dineug/erd-editor/erd-editor.js`를 효과를 위해 import하거나 `defineErdEditor()`를 호출하고, 루트에서 이름으로 가져오는 import는 그대로 두세요. 루트의 선언이 여전히 `HTMLElementTagNameMap`에 태그를 올려 두므로 TypeScript는 기존 import에 머문 페이지를 지적하지 않지만, 그렇게 만든 엘리먼트는 평범한 `HTMLElement`라서 첫 메서드 호출이 `TypeError`를 던집니다. [엘리먼트 등록](#registering-the-elements) 항목을 참고하세요.

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- CDN에서도 마찬가지입니다. `https://esm.run/@dineug/erd-editor`는 이제 루트를 제공하며 아무것도 정의하지 않습니다. `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`를 import하세요. 버전 없는 jsDelivr와 unpkg의 패키지 기본 URL은 여전히 script 태그 빌드를 제공하며, 이 빌드는 전과 같이 `<erd-editor>`를 정의합니다. 버전이 없는 URL은 이제 최신 5.x 릴리스를 제공하므로, 4.x에 머물려면 `@4.2.0`으로 고정하세요. [CDN](#cdn)과 [script 태그](#script-태그) 항목을 참고하세요.
- 루트는 아무것도 정의하지 않지만 여전히 DOM이 필요하므로, 서버 사이드 렌더링에서는 `setExportFileCallback`처럼 루트에서 이름으로 가져오는 import도 엘리먼트의 진입점과 함께 클라이언트에서만 실행되는 경로에 두세요. [서버 사이드 렌더링](#서버-사이드-렌더링) 항목을 참고하세요.
- `window.ErdEditor`에 `ErdEditorElement`와 `defineErdEditor`가 추가됩니다. 뷰어의 script 태그 빌드는 `ErdViewerElement`와 `defineErdViewer`를 `window.ErdViewer`에 올리며, 어느 전역에도 `toImage`는 없습니다.
- `readonly` 에디터는 읽는 사람을 위한 모습으로 열립니다. 여섯 개의 탭, 탐색기, 빠른 검색, 프레즌스는 남고, 다이어그램을 편집하는 컨트롤은 비활성화되는 대신 사라집니다. 툴바는 데이터베이스 이름을 텍스트로 보여 주고, 설정 탭은 `Read only` 배지 아래에서 모든 컨트롤이 비활성화된 채로 설정을 보여 주며, 떠 있는 툴바에는 확대/축소, 이름 표시, Zen 모드, 나침반만 남으므로 `Hand`와 `Select`는 없어지고 드래그는 화면을 이동시킵니다. 누르기는 아무것도 선택하지 않습니다. 유일한 선택은 탐색기나 빠른 검색에서 이동했을 때 도착한 대상 둘레에 생기는 외곽선이며, 움직이지 않는 클릭이 이를 지우고, 모두 선택 단축키는 아무것도 선택하지 않습니다. `readonly`를 켜면 선택, 손 도구, 셀 편집기, 드래그, Map Columns, 자동 배치의 `Force` 미리보기, Time Travel처럼 열려 있던 것이 끝나고, 스크롤, 확대/축소, 탭, 이름 표시는 유지됩니다. [readonly](./erd-editor-element.md#readonly) 문서를 참고하세요.
- `readonly` 상태에서 읽는 사람이 바꾼 설정은 잠금과 상관없이 그 에디터의 화면에만 머뭅니다. 스크롤과 확대/축소, 탭, 이름 표시, View Option, 데이터베이스, Code Generator의 언어, 이름 케이스, 괄호 타입이 그렇습니다. `value`, `runtimeValue`, JSON 내보내기는 문서 자체의 설정을 유지하는데, 4.x에서는 읽는 사람의 변경이 여기에 닿을 수 있었습니다. `getSharedStore()`도 이 중 어느 것도 다른 에디터에 보내지 않습니다. 벤더 없이 호출한 `getSchemaSQL()`은 읽는 사람이 고른 데이터베이스로 작성합니다. `readonly`를 끄면 데이터베이스, 코드 설정, View Option은 문서의 값으로 돌아가고, 스크롤, 확대/축소, 탭, 이름 표시는 읽는 사람이 둔 자리에 남습니다.
- 설정 탭의 `Recalculation table width` 행은 없어졌습니다. 불러오기와 붙여넣기는 여전히 각 테이블의 너비를 텍스트에 맞춥니다.
- Vite 8에서는 `optimizeDeps`의 `exclude: ['@dineug/erd-editor']`를 빼세요. 이것이 필요한 것은 Vite 7 이하뿐이며, ELK `include`는 그대로 두세요. [Vite](#vite) 항목을 참고하세요.

## 3.x에서 업그레이드

`4.0.0`은 메이저 릴리스입니다. 페이지를 3.x에서 옮길 때 다음 항목을 하나씩 확인하고, `5.0.0`을 위해서는 이어서 [4.x에서 업그레이드](#upgrading-from-4x)의 항목도 확인하세요.

- `editor.value`, 복제본의 `value`, 그 `change`가 넘겨주는 `value`는 파일에 담기는 형태입니다. 삭제된 엔티티, 측정된 너비, 쌓임 순서, 관계 앵커는 들어 있지 않습니다. `value`는 계속 저장하고, 이 정보는 `runtimeValue`에서 읽으세요. 엔티티 타임스탬프(`meta`)는 완전히 사라졌습니다. 실행 중인 세션에 참여하는 공동 편집자나 복제본은 `value`나 파일이 아니라 실행 중인 참여자의 `runtimeValue`로 초기화하고, `runtimeValue`는 절대 저장하지 마세요. [value](./erd-editor-element.md#value)와 [runtimeValue](./erd-editor-element.md#runtimevalue) 문서를 참고하세요.
- 설정 잠금이 `Save Scroll Information`과 `Save Zoom Information`을 대체합니다. 새 문서와 `4.0.0` 이전에 저장한 모든 문서는 모든 잠금이 켜져 있으므로, 스크롤, 확대/축소, 탭 전환, 또는 Code Generator 언어나 이름 케이스, 괄호 타입을 바꿔도 `value`는 그대로 유지되며 `change`도 발생하지 않습니다. `change`로 화면을 저장해 오던 페이지라면 설정 탭에서 `Viewport`(탭은 `Canvas Type`)의 잠금을 해제하거나, `settings.lockSettings`에서 해당 비트가 꺼져 있는 문서를 사용해야 합니다. [잠금](../guide/guides/settings.md#잠금) 문서를 참고하세요.
- `settings`에는 더 이상 `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization`, `ignoreSaveSettings`가 없으며, `SaveSettingType` 상수도 사라졌습니다. `LockSettingType` 비트를 사용하는 `settings.lockSettings`가 `ignoreSaveSettings`를 대신하며, `4.0.0` 이상은 `ignoreSaveSettings`를 읽지도 쓰지도 않습니다. [Settings](./advanced/schema.md#settings) 문서를 참고하세요.
- 모든 파일이 `$schema`에 지정하는 [JSON Schema](./advanced/schema.md#json-schema)는 이제 파일에 담기는 형태만 기술하는 닫힌 스키마입니다. 이전 릴리스가 저장한 파일은 `4.0.0` 이상에서 저장해 다시 작성되기 전까지 이 스키마를 통과하지 못합니다.
- 문서 가비지 컬렉션은 그 워커와 함께 사라졌으므로, 삭제된 엔티티는 다음에 파일에서 문서를 열 때까지 `runtimeValue`에 남아 있습니다. 남은 shared worker는 세 개입니다. [Web Worker](#web-worker) 항목을 참고하세요.
- 공유 세션의 모든 에디터와 복제본을 `4.0.0` 이상으로 맞추세요. 이전 릴리스는 새 액션 타입, 즉 테이블 그룹, 컬럼 매핑, 잠금, Schema SQL 스크립트의 액션 타입을 무시합니다. [릴리스 혼용](./advanced/collaborative-editing.md#릴리스-혼용) 문서를 참고하세요.
- 가져오기 콜백은 가져와서 추가에서 `mode: 'append'`를 받으며, 콜백은 이 값을 그대로 넘겨야 합니다. 내보내기 콜백은 이제 `.svg`와 Code Generator 파일도 받으며, `Export` ▸ `Schema SQL`은 저장하는 대신 Schema SQL 탭을 열므로 `.sql`은 그 탭의 `Save file`에서만 옵니다. [파일 다이얼로그](#파일-다이얼로그) 항목을 참고하세요.
- `Delete`와 `Backspace`는 새 `removeSelection`에 지정됩니다. 에디터가 텍스트 입력란 밖에서 포커스를 가지고 있는 동안에는 모든 탭에서 키의 기본 동작이 막히며, ERD 탭에서는 선택한 항목이 삭제됩니다. `KeyBindingName`과 `KeyBindingMap`에 이 항목이 추가되었으며, `setKeyBindingMap({ removeSelection: [] })`을 호출하면 두 키를 페이지에 맡깁니다. [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) 문서를 참고하세요.
- `ThemeOptions.appearance`는 테마 빌더의 `System`에 해당하는 `'system'`도 받으며, `systemDarkMode`를 켜면 이 값이 설정됩니다. `changePresetTheme`은 `System`이 선택된 동안 `'system'`을 보고하므로, 그대로 저장했다가 `setPresetTheme`에 다시 넘기세요. `systemDarkMode`가 켜져 있을 때 `'light'`나 `'dark'`로 호출한 `setPresetTheme()`은 이제 다음 운영체제 변경에 덮어쓰이지 않고 그대로 유지됩니다. [systemDarkMode](./erd-editor-element.md#systemdarkmode)와 [changePresetTheme](./erd-editor-element.md#changepresettheme) 문서를 참고하세요.
- `@dineug/erd-editor-mcp` `1.0.0` 이상, VS Code 확장 `4.0.0` 이상, Obsidian과 JetBrains 플러그인 `1.0.0` 이상은 허브 프로토콜 2를 사용합니다. 서버 `1.0.0` 이상과 에이전트를 지원하는 이전 에디터 릴리스, 또는 이전 서버와 이 에디터들은 `protocolMismatch`로 서로를 거부하며, 업데이트해야 할 쪽을 알려 줍니다. [업데이트](../mcp/installation.md#업데이트) 문서를 참고하세요.
- 버전이 없는 CDN URL은 최신 릴리스를 제공하며, `5.0.0`부터는 5.x입니다. 3.x에 머무르려면 `@3.10.0`으로 고정하세요. [CDN](#cdn) 항목을 참고하세요.
