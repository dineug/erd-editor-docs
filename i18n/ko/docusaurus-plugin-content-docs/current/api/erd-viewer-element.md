---
sidebar_position: 3
description: erd-viewer 엘리먼트 API. value나 src URL로 읽기 전용 다이어그램을 보여 주며, 미니맵과 컨트롤 막대, load와 error 이벤트, 테마, 표시 언어, 포커스와 키, 불러오기, 페이지에 더하는 것을 다룹니다.
---

# ErdViewerElement

`5.0.0`부터 패키지는 문서를 읽기 전용으로 보여 주는 `<erd-viewer>`도 제공합니다. 읽는 사람은 화면을 이동하고, 확대/축소하고, 검색하고, 관계선을 강조할 수 있으며, 그 안의 어떤 것도 편집하지 않습니다. ERD 캔버스만 스크롤바, [미니맵](#minimap), [컨트롤 막대](#controls), 문서를 검색하는 팔레트와 함께 그리며, 툴바, 탭, 탐색기, 컨텍스트 메뉴는 없습니다.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

위 프레임은 erd-editor.io/embed가 보여 주는 이 엘리먼트이며, 여기서는 bookstore 샘플을 보여 줍니다. 클릭해서 포커스를 준 뒤 [포커스와 키](#focus-and-keys)의 키로 확대/축소하고 검색해 보세요. 코드 없이 직접 만든 문서를 프레임으로 넣는 방법은 [임베드](../guide/guides/embedding.md)를 참고하세요.

뷰어는 단순한 `HTMLElement`입니다.  
타입 정의는 다음과 같습니다.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

`@dineug/erd-editor/erd-viewer.js`를 import하면 `<erd-viewer>`가 정의되고 `<erd-editor>`는 정의되지 않은 채로 남습니다. 패키지 루트를 import하면 둘 다 정의되지 않습니다. 루트는 `ErdViewerElement` 클래스와, 호출한 곳에서 태그를 정의하는 `defineErdViewer()`를 export하므로, 페이지는 직접 정한 태그로 클래스를 정의할 수도 있습니다. [엘리먼트 등록](./installation.md#registering-the-elements)을 참고하세요.  
`engine.js`와 `peer.js`를 제외한 모든 진입점은 DOM이 필요하며 이 진입점도 마찬가지이므로, 서버에서 렌더링하는 페이지는 클라이언트에서 import합니다. [서버 사이드 렌더링](./installation.md#서버-사이드-렌더링) 항목을 참고하세요.  
진입점을 import하면 `HTMLElementTagNameMap`에 `erd-viewer`가 추가되므로, `document.createElement('erd-viewer')`와 `document.querySelector('erd-viewer')`는 캐스팅 없이 `ErdViewerElement` 타입이 됩니다.

에디터처럼 뷰어도 closed shadow root에 렌더링되므로 `viewer.shadowRoot`는 `null`이고 페이지 스타일이 안팎으로 새지 않습니다. 스타일은 [setTheme](#settheme)과 `--erd-editor-*` 커스텀 프로퍼티로 지정하세요. 한 페이지의 여러 뷰어는 각각 자신의 문서, 화면, 테마, 언어를 유지합니다.  
`<erd-viewer>`는 자체 크기를 갖지 않습니다. 커스텀 엘리먼트는 인라인이므로 위처럼 `display: block`과 높이를 지정하세요. 화면은 엘리먼트의 박스를 채우며, 박스 크기가 바뀌면 확대/축소를 유지한 채 따라갑니다.

속성은 `src`, `name-view`, `minimap`, `controls`뿐이며, 각 속성에는 같은 이름의 프로퍼티가 있고 `name-view`는 `nameView`입니다. [value](#value)는 프로퍼티뿐입니다.  
태그가 정의되기 전에 엘리먼트에 설정한 `value`, `src`, `nameView`, `minimap`, `controls`(예를 들어 진입점이 로드되기 전에 프레임워크가 엘리먼트를 렌더링한 경우)는 태그가 정의된 뒤에 마크업이 준 속성보다 우선하여 반영됩니다. 페이지가 각각을 처음 쓴 순서대로 반영되므로 `value`와 `src` 중 나중 것이 우선합니다. 문서를 담지 않은 `value`는 그때 던질 호출자가 없으므로 잡히지 않은 에러로 보고되며, 뷰어는 빈 채로 남습니다.

script 태그 빌드인 `dist/erd-viewer.umd.js`는 모든 의존성과 함께 뷰어만 담고 있습니다. 이 파일은 `<erd-viewer>`를 정의하고 `ErdViewerElement`와 `defineErdViewer`를 `window.ErdViewer`에 올립니다. 경로 없는 CDN URL은 대신 에디터의 빌드를 제공하므로 파일 이름을 지정하세요. [script 태그](./installation.md#script-태그) 항목을 참고하세요.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

뷰어가 가져와 보여 줄 문서의 URL입니다. 기본값은 `''`, 즉 없음입니다.  
가져오기는 자체 옵션이 없는 `GET`인 평범한 `fetch()`이므로 브라우저의 CORS 규칙이 적용됩니다. 다른 출처의 문서는 페이지의 출처를 허용하는 서버가 필요하며, 쿠키는 페이지 자체의 출처에만 전달됩니다. 상대 URL은 페이지를 기준으로 해석됩니다.  
응답은 `.erd.json` 파일이 담는 문서, 즉 에디터의 [value](./erd-editor-element.md#value)와 모든 공식 호스트가 쓰는 파일에 담기는 형태를 담고 있어야 합니다. 다른 형식은 읽지 않습니다. SQL, GraphQL, DBML, AML 파일은 파싱되지 않는 텍스트로 실패합니다.  
파싱된 문서는 화면에 맞춰져 표시되고 [load](#load)를 발행합니다. 네트워크나 CORS가 거부한 요청, `ok`가 아닌 응답, 파싱되지 않는 텍스트는 [error](#error)를 발행하고 빈 다이어그램을 남깁니다. [불러오기](#loading) 항목을 참고하세요.

마지막 요청만 유효합니다. 새 `src`는 아직 진행 중인 가져오기를 중단하므로, 느린 응답이 나중 문서 위에 표시되는 일은 없습니다. [value](#value)를 할당해도, `src`를 제거하거나 `''`로 설정해도 중단되며, 이때는 `src`를 따르지 않고 표시 중인 문서를 그대로 둡니다.  
`value`와 `src` 중 마지막에 설정한 것이 프로퍼티든 속성이든 우선합니다. `value` 뒤에 쓴 `src`는 앞서 가져온 URL과 같아도 가져옵니다. 이미 표시 중인 문서 위에 다시 쓰면 아무것도 가져오지 않습니다.  
뷰어는 페이지 안에 있는 동안에만 가져옵니다. 페이지에서 빼면 진행 중인 가져오기가 중단되고, 다시 넣으면 아직 보여 주지 않은 `src`(실패한 것 포함)를 가져오며 이미 보여 주는 것은 가져오지 않습니다.  
`src`는 패키지가 하는 유일한 `fetch()`이므로, 엄격한 Content Security Policy는 `connect-src`에 문서의 출처를 나열합니다.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

`src`에서 왔든 `value`에서 왔든 표시 중인 문서를, 에디터의 [value](./erd-editor-element.md#value)가 쓰는 파일에 담기는 형태의 JSON 문자열로 받아옵니다. 아무것도 표시하기 전에는 `doc`이 `{}`인 새 빈 문서입니다.  
문서의 `Viewport` [잠금](../guide/guides/settings.md#잠금)이 켜져 있는 동안(새 문서에서는 켜져 있습니다)에는 읽는 사람이 화면을 어디로 옮겼든 문서가 잠긴 확대/축소와 스크롤을 기록합니다. 그 잠금이 꺼져 있을 때만 화면이 서 있는 위치를 기록하며, 문서가 표시될 때 맞춰지는 위치도 포함됩니다.  
문서가 담은 이름 표시를 기록하며, 문서의 `Name View` 잠금이 꺼져 있어도 [nameView](#nameview)나 컨트롤 막대가 그 위에 표시하는 이름 표시는 기록하지 않습니다.  
[destroy](#destroy) 뒤에도 문서를 반환합니다.

```js
const data = viewer.value;
```

### setter {#setter}

문서를 텍스트로 보여 주며, 표시 중이던 문서를 교체하고 화면에 맞춥니다. [불러오기](#loading) 항목을 참고하세요. 파일이나 에디터의 `value`가 담은 텍스트를 받습니다.  
파싱되지 않는 텍스트는 아무것도 바뀌기 전에 던지며 표시 중인 문서는 그대로 남습니다. JSON이 아닌 텍스트는 `SyntaxError`, `7`처럼 문서를 담지 않은 JSON은 `TypeError`입니다. 빈 문자열이나 문자열이 아닌 값은 빈 다이어그램을 보여 줍니다.  
이것을 할당하면 진행 중인 `src` 가져오기가 중단되며 `load`도 `error`도 발행하지 않습니다.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

문서가 담은 [이름 표시](../guide/guides/logical-names.md#name-view) 위에 다이어그램을 다른 이름 표시로 보여 줍니다. `'physical'`은 `Physical Names`, `'logical'`은 `Logical Names`, `'both'`는 `Both Names`입니다. 기본값인 `null`은 문서 자체의 이름 표시를 보여 주며, 세 값이 아닌 속성 값은 `null`로 읽힙니다.  
이후에 불러오는 모든 문서에도 유지되며, [value](#value)는 이것을 기록하지 않습니다. 속성을 제거하면 문서 자체의 보기로 돌아갑니다.  
[컨트롤 막대](#controls)의 `Name View` 목록도 보기를 전환하며, 다음 문서가 표시되거나 `nameView`가 다음에 바뀔 때까지 유지됩니다. 거기서의 전환도 `value`에 기록되지 않습니다.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

문서에 테이블, 표시된 메모, 표시된 테이블 그룹이 있는 동안 오른쪽 위 모서리에 미니맵을 표시합니다. 기본값은 켜짐입니다.  
에디터의 미니맵처럼 동작합니다. 클릭하면 그 위치로 화면이 이동하고, 뷰포트 사각형을 드래그하면 화면이 이동합니다. [캔버스 이동](../guide/guides/table-related-functions.md#캔버스-이동) 문서를 참고하세요. 뷰어가 포커스를 가질 때까지 그 위의 손가락은 페이지의 것입니다.  
`minimap="false"`만 미니맵을 끕니다. 값 없는 속성, 그 밖의 값, 속성 없음은 모두 켜진 상태로 둡니다.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

캔버스 아래 가장자리 가운데에 컨트롤 막대를 표시합니다. 기본값은 켜짐이며, 왼쪽부터 차례로 다음이 있습니다.

- 확대/축소. `Zoom out`, 퍼센트로 표시되는 현재 배율, `Zoom in`으로 구성됩니다. 두 버튼은 확대/축소 키와 같은 방식으로 배율을 한 단계씩 조절하고, 퍼센트 값(`Reset zoom`)을 클릭하면 `100%`로 되돌아갑니다. 각 버튼은 툴팁에 자신의 키를 표시합니다.
- `Fit`. 다이어그램 전체가 화면에 보이도록 확대/축소와 스크롤을 맞추고 가운데에 놓습니다.
- `Name View`. 현재 보기를 표시하는 버튼이며, 누르면 막대 위에 `Physical Names`, `Logical Names`, `Both Names` 목록이 열립니다. [nameView](#nameview) 항목을 참고하세요.
- `Go to content` 나침반. 다이어그램이 화면에 하나도 없는 동안에만 막대 끝에 나타나며, 화면을 그 가장 가까운 부분으로 옮깁니다.

막대는 모든 언어에서 왼쪽에서 오른쪽으로 놓입니다.  
`controls="false"`만 막대를 끄며, 나침반과 `Name View` 목록도 함께 꺼집니다. 값 없는 속성, 그 밖의 값, 속성 없음은 모두 켜진 상태로 둡니다. 막대가 없어도 뷰어가 포커스를 가지면 휠, 핀치, 키는 여전히 확대/축소합니다.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Event {#event}

`load`와 `error`가 유일한 두 이벤트이며, 둘 다 `src`에 대해 알립니다. 어느 쪽도 버블링되지 않으므로 엘리먼트 자체에서 리스너를 등록하세요.

### load {#load}

`src`가 가리키는 문서를 가져와 표시하고 나면 발행됩니다. `event.detail`은 `null`입니다.  
`value`를 할당해도 발행되지 않으며, 나중의 `src`, `value`, 페이지에서 엘리먼트 빼기, [destroy](#destroy)가 중단한 가져오기도 발행하지 않습니다.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

`src` 가져오기가 실패할 때 발행됩니다. 네트워크나 CORS가 요청을 거부했거나, 응답이 `ok`가 아니거나, 텍스트가 파싱되지 않은 경우입니다. 그러면 뷰어는 빈 다이어그램과 `Couldn't load the diagram` 알림을 표시합니다. [불러오기](#loading) 항목을 참고하세요.  
`event.detail`은 원인입니다. `fetch()`가 거부하는 `TypeError`, `GET /missing.erd.json answered 404 Not Found`처럼 상태를 담은 `Error`, 또는 파서의 `SyntaxError`나 `TypeError`입니다.  
무언가 중단한 가져오기는 아무것도 발행하지 않습니다.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

프리셋 테마를 설정하며, 에디터의 `ThemeOptions`를 받습니다. [setPresetTheme](./erd-editor-element.md#setpresettheme)을 참고하세요.  
뷰어는 `appearance: 'system'`, `grayColor: 'slate'`, `accentColor: 'indigo'`로 시작하므로, 첫 프레임부터 운영체제가 알려 주는 라이트 또는 다크로 표시되고 그 값이 바뀌면 전환됩니다. 에디터는 대신 다크로 시작합니다.  
각 필드는 따로 적용되므로, 일부만 지정한 호출은 나머지 둘을 그대로 둡니다. 이름에 없는 값은 무시되며 호출은 던지지 않습니다.  
뷰어에는 테마 빌더도 `systemDarkMode`도 없으며, 테마에 대한 이벤트도 발행하지 않습니다.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

`'system'` 외관이 보여 줄 라이트나 다크를 지정하며, 자체 라이트와 다크가 있는 페이지를 위한 것입니다. 하나가 지정된 동안에는 운영체제의 변경이 무시됩니다.  
`null`이나 `'dark'`, `'light'`가 아닌 값은 다시 운영체제를 따릅니다.  
외관이 `'light'`나 `'dark'`인 동안에는 화면에서 아무것도 바꾸지 않지만 값은 유지되었다가 외관이 `'system'`이 되는 즉시 적용됩니다. 아무것도 발행하지 않습니다.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

프리셋 위에 테마 토큰을 덮어쓰며, 에디터의 `Theme` 토큰을 받습니다. [setTheme](./erd-editor-element.md#settheme)을 참고하세요.  
호출할 때마다 덮어쓰기 전체가 교체되므로, 프리셋으로 돌아가려면 `{}`를 전달하세요. 토큰 이름과 문자열 값만 유지되며, 이후의 `setPresetTheme`은 덮어쓰기를 그대로 둔 채 아래의 프리셋만 바꿉니다.  
`--erd-editor-*` CSS 커스텀 프로퍼티도 엘리먼트나 그 위의 어디에 설정하든 뷰어에 닿습니다. [CSS Variables](./erd-editor-element.md#css-variables)를 참고하세요. 어떤 스타일시트도 닿지 않는 캔버스는 페이지 `head`의 스타일시트가 바뀔 때, 또는 엘리먼트나 그 위 엘리먼트의 `class`나 `style` 속성이 바뀔 때 이를 다시 읽습니다. `insertRule()`로 추가한 규칙은 이 중 어느 것도 바꾸지 않으므로, 캔버스는 다음에 그런 변경이 있을 때 이를 반영합니다.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

표시 언어를 설정합니다. 기본값인 `'system'`, 또는 에디터의 [Display Language](./erd-editor-element.md#display-language)가 나열하는 25개 코드 중 하나입니다. `'ko'`만 쓴 값처럼 그 밖의 값이나 문자열이 아닌 값은 무시됩니다.  
언어는 컨트롤 막대의 툴팁, `Name View` 목록, 팔레트, 불러오기 알림, 그리고 `unnamed`처럼 다이어그램이 스스로 그리는 단어를 바꿉니다. 이름, 코멘트, 문서의 나머지는 번역되지 않습니다.

영어는 뷰어 진입점의 일부이며 호출이 반환되기 전에 적용됩니다. 다른 모든 언어는 각자의 모듈이며, 번들러가 뷰어 옆의 청크로 내보내고, 페이지가 그 언어를 처음 요청할 때 뷰어가 번들에서 가져오고, 페이지의 모든 뷰어에 대해 한 번만 가져옵니다. 도착하기 전까지 뷰어는 표시하던 언어를 계속 보여 주며, 첫 프레임에서는 영어입니다. 로드에 실패하면 뷰어는 영어를 표시하고, 그 언어를 다시 요청하면 다시 시도합니다.  
[script 태그](./installation.md#script-태그) 빌드는 25개 언어를 모두 담고 있으므로 아무것도 가져오지 않습니다. 에디터도 함께 담는 번들은 에디터의 청크와 함께 모든 언어를 로드합니다. [엘리먼트 등록](./installation.md#registering-the-elements) 항목을 참고하세요.  
반환되는 `Promise`는 그 언어가 도착하거나 실패하면 이행되며 거부되지 않습니다. 그 뒤에는 그 언어(실패했다면 영어)가 적용되며, 이후의 호출이 다른 언어를 요청했다면 그쪽이 적용됩니다. 언어가 도착하는 순서와 상관없이 나중 호출이 우선합니다.

히브리어, 아랍어, 페르시아어는 팔레트와 불러오기 알림을 오른쪽에서 왼쪽으로 배치합니다. 캔버스, 미니맵, 스크롤바, 나침반이 있는 컨트롤 막대는 에디터의 캔버스처럼 왼쪽에서 오른쪽으로 유지됩니다. [오른쪽에서 왼쪽으로 쓰는 언어](../guide/guides/language-and-theme.md#오른쪽에서-왼쪽으로-쓰는-언어)를 참고하세요.  
뷰어는 closed shadow root 안의 자체 루트에 `lang`과 `dir`을 설정하며, 호스트 엘리먼트나 페이지에는 설정하지 않습니다.  
아무것도 발행하지 않으며, 뷰어에는 언어 선택기가 없고 아무것도 저장하지 않습니다.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

`'system'`이 가리키는 언어를 BCP 47 태그로 지정하며, 자체 언어 설정이 있는 페이지를 위한 것입니다.  
태그는 공백이 제거됩니다. `null`, 빈 문자열, 문자열이 아닌 값은 페이지의 언어로 돌아갑니다.  
페이지의 언어는 뷰어가 처음 연결될 때 한 번 읽는 페이지의 `<html lang>`과 이어서 브라우저의 `navigator.languages`입니다. `'system'`은 [setSystemLocale](./erd-editor-element.md#setsystemlocale)의 에디터 규칙에 따라 뷰어가 가진 언어 중 그 목록의 첫 번째를 취하고, 하나도 없으면 영어를 취합니다. 그래서 `<html lang>`이 뷰어에 있는 언어를 가리키는 페이지는 브라우저가 무엇을 선호하든 그 언어로 표시하며, 이후에 `lang`이나 브라우저의 언어가 바뀌어도 어떤 뷰어도 움직이지 않습니다.  
적용 중인 옵션이 `'system'`일 때만 의미가 있으며, 반환되는 `Promise`는 [setLocale](#setlocale)처럼 이행됩니다.

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

뷰어를 완전히 끝냅니다. 엘리먼트가 아직 페이지 안에 있든 먼저 빼 두었든 반환되기 전에 화면을 내리고, 진행 중인 `src` 가져오기를 중단하며, 운영체제의 색상 모드와 페이지의 스타일을 따르는 것을 멈춥니다.  
파괴된 뷰어는 페이지에 다시 추가되어도 더는 아무것도 그리지 않고, 가져오지 않고, 언어를 요청하지 않습니다. [value](#value)를 읽으면 여전히 가지고 있던 문서를 반환합니다.  
엘리먼트를 페이지에서 빼는 것은 파괴가 아닙니다. 다시 넣으면 계속 동작하며, 아직 보여 주지 않은 `src`를 가져옵니다. [불러오기](#loading) 항목을 참고하세요.

```js
viewer.destroy();
```

## 포커스와 키 {#focus-and-keys}

뷰어는 마운트될 때, 문서가 표시될 때, 팔레트가 닫힐 때 포커스를 받지 않으므로, 페이지를 자신에게 스크롤하거나 페이지의 키를 가져가는 일이 없습니다.  
캔버스를 클릭하거나 탭하면 페이지를 스크롤하지 않고 포커스되며, `Tab` 키의 정거장 하나입니다. 에디터와 달리 자체 `focus()`나 `blur()` 멤버는 없습니다. 페이지의 다른 곳을 누르면 포커스가 다시 사라집니다.

뷰어가 포커스를 가질 때까지 페이지가 휠(페이지를 스크롤합니다)과 트랙패드 핀치를 유지합니다. 캔버스 위의 손가락은 페이지를 스크롤하고 아무것도 이동시키지 않으며, 모든 키는 막히지 않고 페이지에 전달됩니다.  
포커스를 가지면 다음과 같습니다.

- 휠은 화면을 이동시키고, `Shift + Wheel`은 옆으로 이동시킵니다. 텍스트가 넘치는 메모 위에서는 휠이 메모를 스크롤합니다.
- `Ctrl + Wheel` (Windows/Linux) 또는 `⌘ + Wheel` (Mac), 트랙패드 핀치, 터치 화면의 두 손가락은 확대/축소합니다.
- 손가락 하나는 화면을 이동시킵니다.
- `Ctrl + Plus`와 `Ctrl + Minus` (Windows/Linux) 또는 `⌘ + Plus`와 `⌘ + Minus` (Mac)는 `Zoom in`과 `Zoom out` 버튼처럼 배율을 한 단계씩 조절하고, `Ctrl + 0` (Windows/Linux) 또는 `⌘ + 0` (Mac)은 화면 가운데를 제자리에 둔 채 곧바로 `100%`로 되돌립니다.
- `Ctrl + K` (Windows/Linux) 또는 `⌘ + K` (Mac)는 팔레트를 열고, `Esc`는 닫습니다.

이것이 뷰어의 키 전부이며 다시 지정할 수 없습니다. 그 밖의 모든 키는 포커스 여부와 상관없이 막히지 않고 페이지에 전달됩니다. `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F`, 에디터에서 편집하는 모든 조합이 그렇습니다.

팔레트는 문서만 검색하며 명령은 나열하지 않습니다. 비어 있는 입력란은 접두사를 보여 줍니다. `#`은 테이블을, `@`은 컬럼을, `:`은 코멘트와 메모를 검색하고, `?`는 에디터에서처럼 접두사를 나열합니다. [다이어그램 검색](../guide/guides/quick-search.md#다이어그램-검색) 문서를 참고하세요. 접두사 없는 단어는 그 단어로 다이어그램을 검색하는 행들 위에 `No commands match`를 표시합니다.  
행을 고르면 에디터의 규칙인 [이동 후 화면 위치](../guide/guides/table-related-functions.md#이동-후-화면-위치)에 따라 확대/축소는 그대로 두고 화면이 이동하며, 도착한 대상을 맨 앞으로 가져와 외곽선으로 표시합니다. 테이블, 컬럼이나 코멘트를 가진 테이블, 또는 메모입니다.  
행을 고르거나 `Esc`를 누르면 팔레트가 닫히고 포커스는 어떤 엘리먼트에도 남지 않으므로, 다음 휠은 페이지를 스크롤합니다. 휠과 키를 다시 받게 하려면 화면을 클릭하세요. 팔레트가 열려 있는 동안 휠은 목록을 스크롤하며 확대/축소 키는 아무 동작도 하지 않습니다.

포커스 여부와 상관없이 마우스 주 버튼 드래그는 캔버스 어디서든, 테이블 위에서도 화면을 이동시킵니다. 움직이지 않는 클릭이나 탭은 관계선을 강조합니다. 테이블 위에서는 그 테이블의 관계선을, 관계선 위에서는 그 선을 강조하고, 메모를 포함해 다른 곳에서는 강조를 끕니다. 그런 클릭은 팔레트 이동이 남긴 외곽선도 지웁니다. 포인터가 테이블 위에 머무는 동안에는 그 테이블의 관계선이 강조됩니다.  
어떤 누르기도 아무것도 선택하거나 옮기거나 편집하지 않습니다. 이동의 외곽선 외에는 선택이 없고, 마퀴도 없으며, 더블 클릭이나 `Enter`로 열리는 셀도 없습니다.

## 불러오기 {#loading}

`src`를 불러오는 동안 캔버스 가운데의 알림이 돌아가는 로더 옆에 `Loading diagram`을 표시합니다. 불러오기가 실패하면 새 `src`나 `value`가 대신하거나 `src`가 제거될 때까지 경고 표시 옆에 `Couldn't load the diagram`을 표시합니다. 누르기는 알림을 통과해 캔버스에 닿으며, 알림은 표시 언어로 읽히고 오른쪽에서 왼쪽으로 쓰는 언어에서는 오른쪽에서 왼쪽으로 놓입니다.

`src`든 `value`든 표시되는 모든 문서는 뷰어의 박스에 맞춰집니다. `Fit`처럼 다이어그램 전체가 보이도록 확대/축소와 스크롤이 맞춰지고 가운데에 놓이며, 파일이 저장한 확대/축소와 스크롤은 제쳐 둡니다. 뷰어가 크기를 갖기 전에 넘긴 문서, 즉 페이지에 들어가기 전이나 박스가 비어 있는 동안 설정한 문서는 크기를 갖는 즉시 맞춰집니다. 이후에 크기가 바뀌어도 확대/축소는 유지되며, 다시 맞추려면 `Fit`을 사용합니다.

뷰어는 페이지 안에 있는 동안에만 `src`를 가져옵니다. 페이지에서 빼면 진행 중인 가져오기가 중단되고, 다시 넣으면 아직 보여 주지 않은 `src`(실패한 것 포함)를 가져오며 이미 보여 주는 것은 가져오지 않습니다. 더는 필요 없는 뷰어는 [destroy](#destroy)로 끝냅니다.

## 페이지에 더하는 것 {#what-it-adds-to-a-page}

- 워커 없음. 워커를 시작하지 않으므로 Content Security Policy에 이를 위한 `worker-src`가 필요하지 않습니다.
- 저장소 없음. 쿠키, `localStorage`, `sessionStorage`, IndexedDB를 쓰지 않습니다.
- 두 종류의 요청. [src](#src) 가져오기(엄격한 정책은 그 출처를 `connect-src`에 나열합니다)와, 영어가 아닌 표시 언어의 모듈(자체 번들에서 가져옵니다). [setLocale](#setlocale)을 참고하세요.
- constructed stylesheet의 스타일. 엄격한 `style-src`도 통과시킵니다. constructed stylesheet가 없는 브라우저(101 이전 Firefox 등)는 대신 `<style>` 엘리먼트를 받으며, 이에는 `style-src 'unsafe-inline'`이 필요합니다.
- `window`의 리스너. 진입점을 import하면 페이지가 유지되는 동안 세 개가 추가됩니다. `mousedown`, `touchstart`, 그리고 패키지 자체의 `@dineug/erd-editor/internal-forward-move-start` 이벤트용입니다. 캔버스를 그리는 Konva는 `window.Konva`를 설정하고, 첫 스테이지와 함께 `window`에 마우스와 터치 리스너를, `document`에 `visibilitychange` 리스너를 추가하며 이를 제거하지 않습니다. 에디터의 진입점도 같은 것을 추가합니다.
- [destroy](#destroy) 전까지 각 뷰어는 운영체제의 색상 모드를 따르고 [setTheme](#settheme)이 설명하는 커스텀 프로퍼티를 위해 페이지의 스타일을 감시합니다.
