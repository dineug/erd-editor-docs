---
sidebar_position: 4
description: toImage로 자체 코드에서 문서를 PNG나 SVG로 그리는 방법. Export image 대화 상자의 옵션을 쓰며, 브라우저와 내보내기 워커가 있는 환경에서 동작합니다.
---

# toImage

`5.0.0`부터 패키지 루트는 `toImage()`를 export합니다. 페이지에 에디터 없이 문서를 PNG나 SVG로 그립니다.  
[Export image](../guide/guides/file-import-export.md#이미지) 대화 상자의 `PNG`와 `SVG` 버튼이 기록하는 파일을 그대로 기록하며, 옵션도 대화 상자의 `Background`, `Dark mode`, `Scale` 세 가지뿐입니다.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions`는 함께 타입으로 export됩니다. [진입점](./installation.md#진입점) 항목을 참고하세요.

## value {#value}

문서의 텍스트입니다. `.erd.json` 파일이 담은 내용, 에디터의 [value](./erd-editor-element.md#value)나 [runtimeValue](./erd-editor-element.md#runtimevalue), 또는 [setInitialValue](./erd-editor-element.md#setinitialvalue)가 불러오는 그 밖의 텍스트입니다.  
빈 텍스트나 공백뿐인 텍스트는 빈 다이어그램을 그리며, 문서의 어떤 필드도 담지 않은 JSON도 마찬가지입니다. 파서가 기본값으로 채우기 때문입니다.

## 옵션 {#options}

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `format` | 없음. 필수입니다 | `'png'`는 `image/png` 타입의 `Blob`으로, `'svg'`는 SVG 마크업 문자열로 이행됩니다. |
| `background` | `true` | 다이어그램 뒤에 캔버스 색을 칠합니다. `false`이면 ON DELETE나 ON UPDATE 라벨 뒤의 상자를 포함해 투명하게 둡니다. |
| `darkMode` | `false` | 라이트 테마 대신 다크 테마로 그립니다. |
| `scale` | `2` | 100%에서 다이어그램 한 단위당 이미지 픽셀 수로, `1`, `2`, `3` 중 하나입니다. PNG의 크기만 정하며, SVG는 배율과 상관없이 다이어그램 크기입니다. |

`toImage()`는 다른 키를 읽지 않으므로, 표에 없는 키는 아무것도 바꾸지 않습니다.

## 그리는 내용 {#what-it-draws}

이미지는 대화 상자가 그리는 것과 같습니다.

- 다이어그램 전체를 그리는 내용에 여백을 더한 크기로 잘라 내며, 문서를 저장한 확대/축소와 상관없이 항상 100%로 그리므로 모든 테이블이 온전히 그려집니다. 문서에서 [View Option](../guide/guides/table-related-functions.md#테이블-보기-옵션)이 숨기는 것은 그려지지도 자리를 차지하지도 않고, 테이블 그룹은 다른 모든 것 뒤에 그려지며, [사전 검사](../guide/guides/dictionary.md#marks-on-the-canvas)가 이름에 입히는 색은 그려지지 않습니다.
- PNG의 크기는 100%에서의 다이어그램 크기에 `scale`을 곱한 값입니다. 브라우저 캔버스에 비해 너무 큰 이미지는 실패하지 않고 낮춘 해상도로 기록되며, `toImage()`는 이를 알리지 않습니다.
- SVG는 텍스트를 텍스트로 유지하고 글꼴을 포함하지 않고 이름으로 지정하므로, 에디터의 글꼴이 없는 뷰어는 다른 글꼴로 그립니다. 그림자는 빠집니다.

대화 상자가 에디터의 화면을 기준으로 하는 곳에서 `toImage()`는 문서만 기준으로 하므로, 어느 페이지에서나 문서는 똑같이 그려집니다.

- 색은 엘리먼트의 기본 회색과 강조색인 `slate`와 `indigo`의 프리셋이며, `darkMode`가 `true`가 아니면 라이트입니다. 페이지의 테마, [setTheme](./erd-editor-element.md#settheme) 재정의, [테마 빌더](../guide/guides/language-and-theme.md) 변경은 닿지 않습니다.
- 테이블과 컬럼은 문서가 담은 [이름 표시](../guide/guides/logical-names.md#name-view)로 표기되며, `Name View` 잠금이 켜진 파일에서는 잠긴 값입니다.
- 빈 이름의 테이블 자리 표시처럼 다이어그램이 스스로 그리는 단어는 영어입니다.

## 실행되는 곳 {#where-it-runs}

`toImage()`는 캔버스에서 측정하고 그리므로 브라우저 페이지가 필요합니다. 이 함수를 export하는 패키지 루트는 로드하는 데 DOM이 필요하므로 Node나 Web Worker에서는 닿지 않습니다. [서버 사이드 렌더링](./installation.md#서버-사이드-렌더링) 항목을 참고하세요.  
그리기 전에 페이지의 글꼴이 로드를 마치기를 기다립니다.

호스트가 이미지 내보내기 shared worker를 실행하면 대화 상자처럼 그 안에서 그리므로 그동안 페이지는 계속 반응하고, 워커가 없거나 제때 응답하지 않으면 메인 스레드에서 그립니다. [Web Worker](./installation.md#web-worker) 항목을 참고하세요.  
`toImage`를 import하고 엘리먼트는 import하지 않는 번들에는 이미지 내보내기 워커만 들어 있습니다.  
어느 [script 태그](./installation.md#script-태그) 빌드에도 들어 있지 않습니다. `window.ErdEditor`와 `window.ErdViewer`에는 `toImage`가 없습니다.

## 거부 {#rejections}

반환된 Promise는 아무것도 그려지기 전에 다음 경우 거부됩니다.

- 페이지에 `document`가 없는 경우: `Error`, `toImage needs a browser, since it draws on a canvas`
- `value`가 문자열이 아닌 경우(이미 객체로 파싱된 문서 등): `TypeError`
- 옵션이 [옵션](#options) 표에 없는 값을 담은 경우(`format`이 빠진 경우 포함)이며, SVG와 함께 문자열 `'2'`를 넘긴 `scale`도 이에 해당합니다: `toImage: scale cannot be 4`처럼 옵션 이름이 담긴 `TypeError`
- 텍스트가 파서가 읽을 수 있는 문서가 아닌 경우: 파서의 에러이며, JSON이 아닌 텍스트는 `SyntaxError`

## Export image 대화 상자 {#export-image-dialog}

대화 상자와 `toImage()`는 같은 내보내기로 그리므로 같은 옵션이면 같은 이미지를 기록하지만, 출발점이 다릅니다.

| | `Export image` 대화 상자 | `toImage()` |
| --- | --- | --- |
| 문서 | 대화 상자가 열릴 때의 다이어그램 | 넘겨준 텍스트 |
| 다크 모드 | 에디터의 외관과 같게 시작하며, 같은 동안에는 화면 자체의 색으로 그립니다 | `darkMode`가 `true`가 아니면 꺼져 있고, 항상 프리셋 색입니다 |
| 이름 표시 | 에디터가 표시하는 것 | 문서가 담은 것 |
| 자체 단어의 언어 | 에디터의 표시 언어 | 영어 |
| 결과 | 브라우저나 [내보내기 콜백](./installation.md#파일-다이얼로그)으로 저장되거나 클립보드로 복사됩니다 | 그대로 돌려줍니다. 어느 파일 콜백도 호출되지 않습니다 |

`Copy to clipboard`에 대응하는 것은 없습니다. 클립보드가 필요한 페이지는 PNG `Blob`을 직접 클립보드에 씁니다.
