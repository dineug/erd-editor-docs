---
sidebar_position: 2
description: erd-editor 엘리먼트 API의 속성, value와 runtimeValue, 이벤트, 테마, 표시 언어, 시작 화면, 단축키와 스키마 가져오기, 내보내기.
---

# ErdEditorElement

에디터는 단순한 `HTMLElement`입니다.  
타입 정의는 다음과 같습니다.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

에디터는 closed shadow root에 렌더링되므로 `editor.shadowRoot`는 `null`이고 페이지 스타일이 안팎으로 새지 않습니다.  
내부 요소는 선택자로 접근할 수 없기 때문에, 스타일은 [setTheme](#settheme)과 `--erd-editor-*` 커스텀 프로퍼티로 지정하세요.

속성은 `readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker`, `enable-welcome-screen` 5개뿐이며, 다섯 모두 기본값은 `false`입니다. 마지막 두 개는 `4.0.0`에서 새로 추가되었습니다. 각 속성은 [readonly](#readonly)에서 설명하는 방식으로 값을 읽습니다.

`4.1.0`부터 ERD 탭에는 [탐색기](../guide/guides/explorer.md)가 있습니다. 탐색기는 캔버스 왼쪽에 도킹되어 다이어그램을 트리로 보여 주며, 맨 위에 찾기와 바꾸기가 있습니다. 탐색기를 열거나 닫거나 그 상태를 알려 주는 속성, 프로퍼티, 메서드, 이벤트는 없습니다. 탐색기는 툴바의 `Explorer` 버튼, 빠른 검색이나 캔버스 컨텍스트 메뉴의 `Toggle Explorer`, 또는 [`findReplace`](#setkeybindingmap) 바인딩으로 엽니다.  
모든 엘리먼트는 탐색기가 닫힌 상태로 시작합니다. 탐색기가 열려 있는지 여부, 너비, 접힌 상태, 검색은 탭 전환과 `setInitialValue`를 포함한 모든 불러오기를 거쳐 엘리먼트가 있는 동안 유지되며, `value`, `runtimeValue`, Undo 기록, shared store 어디에도 담기지 않습니다.

## readonly

에디터 편집 가능 여부를 설정합니다.  
설정된 동안에는 `value` 할당, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, Undo, Redo가 모두 무시되고 `change` 이벤트도 발행되지 않습니다. 문서를 불러올 때는 [setInitialValue](#setinitialvalue)를 사용하세요.  
보기는 그대로 동작합니다. 확대/축소, 화면 이동, 손 도구, Zen 모드, 캔버스 탭, 두 모드와 테이블 포커스를 포함한 [Visualization](../guide/guides/visualization.md) 탭, 데이터베이스 벤더, SQL과 코드 생성 출력 설정이 모두 적용되므로, `readonly` 상태에서도 다른 벤더의 SQL을 내보내거나 생성된 코드를 확인할 수 있습니다.  
`4.1.0`부터는 [탐색기](../guide/guides/explorer.md#읽기-전용-에디터)도 열리며, 탐색기의 행을 고르면 편집 가능한 에디터에서와 마찬가지로 그 행이 나타내는 대상으로 이동합니다. 탐색기 맨 위의 [찾기와 바꾸기](../guide/guides/find-and-replace.md#읽기-전용-에디터)는 `Toggle Replace` 화살표와 Replace 줄 없이 찾기만 하며, 일치 항목으로 이동하면 여전히 그 항목을 화면에 표시하고 선택합니다. 패널의 제목은 `Explorer`이고, 툴바 버튼의 툴팁은 모든 에디터에서 `Explorer (Ctrl + F)` (Windows/Linux) or `Explorer (⌘ + F)` (Mac)입니다. `3.10.0`부터 `4.0.0`까지는 찾기와 바꾸기가 제목이 `Find`인 찾기 전용의 떠 있는 패널로 열렸습니다.  
테이블 속성도 그대로 열리며, `3.10.0`부터는 제목 옆에 `Read only` 배지가 표시되고 `Indexes` 탭에서는 아무것도 편집할 수 없습니다. [테이블 속성](../guide/guides/table-related-functions.md#테이블-속성) 문서를 참고하세요.  
`4.0.0`부터 `readonly` 에디터는 [`Import and Add`](../guide/guides/file-import-export.md#가져와서-추가), `New Table Group`, `Group selected tables`, `Remove from group`([테이블 그룹](../guide/guides/table-groups.md#읽기-전용-에디터) 문서 참고), [`Map Columns`](../guide/guides/relationship-editing.md#컬럼-매핑)를 제공하지 않으며, [시작 화면](#enablewelcomescreen)도 표시하지 않습니다. Settings 탭의 잠금 버튼은 아무것도 바꾸지 않으며, Schema SQL 탭의 `Before tables`와 `After tables` 스크립트는 편집할 수 없습니다.  
`4.1.0`부터는 [캔버스 툴바](../guide/guides/table-related-functions.md#캔버스-툴바)에 `New Table`, `New Memo`, `New Table Group` 버튼도 표시하지 않으며, `addTableGroup`과 `groupSelectedTables` 바인딩은 아무 동작도 하지 않습니다.  
저장되지 않는 Schema SQL 탭의 `This window only` 선택인 `Statements`, `Header`, `Tables`는 그대로 적용되며, [`Export image`](../guide/guides/file-import-export.md#이미지) 대화 상자, 테마 빌더, Display Language 선택기도 마찬가지입니다. 테마 빌더나 Display Language 선택기에서 고르면 여전히 [changePresetTheme](#changepresettheme)이나 [changeLocale](#changelocale)을 발행합니다.  
속성만 쓰거나 `=""`, `="true"`는 모두 `true`로 읽힙니다. `="false"`는 `false`로 읽히고, HTML 관용 표기인 `readonly="readonly"`를 포함해 그 밖의 문자열도 마찬가지입니다.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode

시스템의 다크/라이트 모드를 자동으로 동기화할지 설정합니다.  
`4.0.0`부터 켜면 `setPresetTheme({ appearance: 'system' })`과 마찬가지로 테마의 `appearance`를 `'system'`으로 지정합니다. 그러면 에디터는 운영체제가 알려 주는 라이트 또는 다크, 또는 [setSystemAppearance](#setsystemappearance)로 지정한 값으로 표시되며, 그 값이 바뀌면 함께 전환됩니다.  
이후 `'light'`나 `'dark'`로 호출한 [setPresetTheme](#setpresettheme), 또는 테마 빌더나 빠른 검색에서 고른 `Light`나 `Dark`는 `'system'`을 대체하고 그대로 유지됩니다. `systemDarkMode`가 여전히 `true`여도 다음 운영체제 변경이 더 이상 이를 덮어쓰지 않습니다. `4.0.0` 이전에는 다음 운영체제 변경이 이를 덮어썼습니다.  
외관이 `'system'`인 동안 끄면 그 순간 표시되던 라이트 또는 다크가 유지됩니다. 외관이 `'system'`에서 다른 값으로 바뀐 뒤에 끄면 외관은 그대로 유지됩니다.  
값을 바꿔도 이벤트를 발행하지 않습니다.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder

preset 테마를 쉽게 사용자 정의할 수 있는 UI를 제공할지 여부입니다.  
툴바에 `Theme` 버튼을 표시하며, 이 버튼은 `Accent color`, `Gray color`, `Appearance`가 있는 테마 빌더를 엽니다. `4.0.0`부터 `Appearance`는 `Light`, `Dark`와 함께 `System`을 제공하며, 이 값이 켜져 있는 동안 빠른 검색에는 `System`, `Light`, `Dark`를 담은 `Theme`이 나열됩니다. [언어와 테마](../guide/guides/language-and-theme.md) 문서를 참고하세요.

![툴바에서 테마 빌더를 열고 강조 색상과 회색 색상을 고른 뒤, 외관을 Light로, 이어서 System으로 바꾸기](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

이 패널이나 빠른 검색에서 preset 테마를 변경하면 [changePresetTheme](#changepresettheme) 이벤트를 발행합니다.

## enableLocalePicker

`4.0.0`부터 에디터의 표시 언어를 고르는 UI를 제공할지 설정합니다.  
툴바에 `Display Language` 버튼을 표시하며, 둘 다 표시될 때는 `Theme` 다음에 놓입니다. 이 버튼은 Display Language 선택기를 열고, 빠른 검색에는 `Display Language`가 나열됩니다. 둘 다 `System`과 25개 언어를 제공합니다. [언어와 테마](../guide/guides/language-and-theme.md) 문서를 참고하세요.  
[setLocale](#setlocale)을 호출하거나 언어를 고르기 전에 에디터가 무엇을 표시할지도 이 값이 정합니다. 켜져 있는 동안에는 `'system'`, 꺼져 있는 동안에는 영어이므로, 아무것도 설정하지 않은 엘리먼트는 늘 표시하던 영어를 계속 표시합니다. 켜거나 끄면 둘 사이가 바로 전환됩니다. 언어를 한 번 지정하거나 고르면, 이 값을 어느 쪽으로 바꾸든 그 선택이 유지됩니다.  
첫 프레임부터 `'system'`을 따르게 하려면 엘리먼트를 페이지에 추가하기 전에 설정하세요.  
언어를 고르면 [changeLocale](#changelocale)을 발행합니다.

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen

`4.0.0`부터 빈 다이어그램에서 [시작 화면](../guide/guides/editing-start.md#시작-화면)을 표시할지 설정합니다.  
문서에 테이블도, 표시된 메모도, 표시된 테이블 그룹도 없는 동안 ERD 탭 위에 표시됩니다. `readonly`가 설정된 동안, Zen 모드에서, 그리고 테이블 속성, Diff Viewer, Time Travel, 자동 배치 미리보기가 열려 있는 동안에는 표시되지 않습니다. 첫 테이블, 표시된 메모, 표시된 테이블 그룹이 생기면 사라지고, Undo로 다이어그램이 다시 비면 다시 나타납니다.  
`New Table`, `New Memo`, `Command Palette` 항목은 [setKeyBindingMap](#setkeybindingmap)이 설정한 대로 `addTable`, `addMemo`, `search`의 첫 번째 키 조합을 표시하며, 비워 둔 이름에는 아무것도 표시하지 않습니다. 화살표는 `enableThemeBuilder`와 `enableLocalePicker`가 `Theme`과 `Display Language` 버튼을 표시하는 경우에만 그 버튼을 가리킵니다.  
메뉴에서 `↑`, `↓`, `Home`, `End`는 항목 사이를 이동하며, 이 키 입력에는 `preventDefault()`와 `stopPropagation()`을 모두 호출합니다. `Enter`와 `Space`에는 `preventDefault()` 없이 `stopPropagation()`만 호출하므로 포커스된 항목이 이 입력을 받으며, `Import` 형식 목록에서 누른 `Escape`는 처음 메뉴로 돌아가고 `preventDefault()`와 `stopPropagation()`을 모두 호출합니다. 그 밖의 모든 키는 평소대로 에디터와 페이지에 전달됩니다.  
문서를 전혀 바꾸지 않으므로 `value`는 그대로 유지되고 `change`도 발행하지 않습니다.  
공식 호스트처럼 [setInitialValue](#setinitialvalue)로 문서를 불러온 뒤에 켜세요. 그래야 아직 불러오는 중인 파일 위로 화면이 잠깐 나타나는 일이 없습니다.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value

### getter

현재 문서를 에디터가 정의한 [스키마](./advanced/schema.md) 형식의 JSON 문자열로 받아옵니다.  
`4.0.0`부터 이 값은 파일에 담기는 형태의 문서이며, `json` 내보내기가 작성하고 공식 호스트가 저장하는 것도 이 값입니다. 살아 있는 엔티티만 담으며, 삭제된 엔티티, 쌓임 순서, 그리고 측정된 너비, 키 표시, 관계 앵커처럼 에디터가 스스로 계산하는 정보는 담지 않습니다. 엔티티는 고정된 순서로 키가 놓이고, 두 칸으로 들여쓰며, 줄바꿈으로 끝나므로 같은 문서는 항상 같은 바이트가 됩니다.  
[잠금](../guide/guides/settings.md#잠금)이 켜진 설정은 화면에 보이는 값이 아니라 잠긴 값으로 기록됩니다. `Viewport` 잠금은 `originX`, `originY`, `zoomLevel`을 담고, `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`은 각각 자신의 설정을 담습니다. 그 밖의 설정은 현재 값 그대로 기록되며, `lockSettings`는 항상 기록됩니다. 각 비트는 [Settings](./advanced/schema.md#settings) 문서를 참고하세요.  
새 문서는 값을 전달받기 전에 엘리먼트가 표시하는 문서든 빈 값으로 불러온 문서든 모든 잠금이 켜져 있습니다. 이런 문서의 `value`는 해당 잠금을 끄기 전까지 원점 `0, 0`, 확대/축소 레벨 `1`, ERD 탭, 기본 Code Generator 언어, 이름 케이스, 괄호 타입을 유지합니다.  
`4.0.0` 이전에는 `ignoreSaveSettings`를 적용한 문서 전체를 에디터가 가지고 있는 그대로 반환했습니다. 에디터가 가지고 있는 그대로의 문서는 이제 [runtimeValue](#runtimevalue)이며, `ignoreSaveSettings`는 더 이상 읽지도 쓰지도 않습니다.

```js
const data = editor.value;
```

### setter

이전에 저장했던 에디터 상태를 불러옵니다. 문서 전체를 교체하며, 현재 문서는 먼저 비워집니다.  
`clear()`, `setInitialValue()`, 기본값인 `mode: 'replace'`로 호출한 `setSchema*` 메서드와 마찬가지로 Visualization 탭의 Flow 뷰도 버립니다. 배치, 범위를 좁혀 둔 테이블, 행 표시, 확대/축소, 화면 이동 상태가 모두 해당합니다. 추가(`mode: 'append'`)는 이를 버리지 않습니다.  
히스토리 목록에 기록되어 `Undo, Redo`가 가능하고, `change` 이벤트를 발행합니다.  
파일에 담기는 형태, [runtimeValue](#runtimevalue), 이전 릴리스가 저장한 파일을 모두 받습니다.  
빈 문자열이나 문자열이 아닌 값은 에러가 아니라 새 문서로 불러오므로, 할당하기 전에 값을 확인하세요.  
이 새 문서는 `setInitialValue('')`로 시작하는 문서와 같습니다. 비어 있고 기본 설정을 사용하며, `4.0.0`부터는 모든 잠금이 켜져 있습니다. `3.10.x`에서는 스크롤 위치와 확대/축소 레벨을 모두 저장하지 않았고, 그 이전에는 둘 다 저장했습니다.  
shared store는 이 불러오기를 새 문서의 전체 JSON과 함께 공동 편집자에게 전달하므로, 이전 릴리스를 사용하는 참여자를 포함해 모든 참여자가 같은 문서를 불러옵니다.  
`4.0.0`부터 불러온 문서의 잠금과, 이후 `value`가 기록하는 잠긴 값은 텍스트에서 가져오며, 화면은 텍스트가 지정한 위치로 이동하고, 그 위치에 다이어그램이 전혀 그려져 있지 않으면 다이어그램이 있는 곳으로 이동합니다. 텍스트가 잠근 그 밖의 설정, 즉 탭, Code Generator 언어, 이름 케이스, 괄호 타입은 에디터가 불러오기 전에 표시하던 것을 계속 표시합니다. 텍스트가 잠그지 않은 설정은 텍스트의 값을 따릅니다. [setInitialValue](#setinitialvalue)는 대신 텍스트에 담긴 모든 값을 따르며, 잠금이 기록되지 않은 텍스트에 대해서도 해당 문서를 참고하세요.  
병합 충돌 표시가 남은 파일처럼 JSON이 아닌 텍스트도 에러를 발생시키지 않습니다. 문서는 비워지고 설정은 그대로 유지되며, 파싱 에러는 콘솔에 기록됩니다.  
`readonly`가 설정된 동안에는 무시되며, `readonly` 에디터에 문서를 불러올 때는 [setInitialValue](#setinitialvalue)를 사용하세요.

```js
editor.value = 'json...';
```

## runtimeValue

`4.0.0`부터 이 에디터가 가지고 있는 그대로의 문서를 JSON 문자열로 받아옵니다. setter가 없으므로 strict 모드 코드에서 값을 할당하면 에러가 발생합니다.  
[value](#value)가 담지 않는 정보를 담습니다. 삭제된 엔티티와 그 순서, 쌓임 순서, 측정된 너비, 키 표시, 관계 앵커, 시퀀스가 여기에 해당합니다. 잠긴 설정은 여기서도 잠긴 값으로 기록됩니다.  
공동 편집자나 같은 문서의 두 번째 뷰처럼 이미 실행 중인 세션에 참여하는 다른 에디터를 초기화할 때, 그 에디터의 [setInitialValue](#setinitialvalue)에 전달해 사용합니다. 그러면 세션이 나중에 보내는 삭제의 Undo가 그 에디터에서 엔티티를 온전히 복원합니다. 반면 `value`로 초기화한 에디터에는 삭제된 엔티티가 없으므로 대신 비어 있고 이름 없는 테이블을 복원합니다. [공동 편집](./advanced/collaborative-editing.md) 문서를 참고하세요.  
삭제된 엔티티를 수집하는 작업은 더 이상 없으므로, 삭제된 엔티티는 다음에 파일에서 문서를 열 때까지 이 값에 남아 있습니다.  
파일에는 절대 기록하지 마세요. 저장할 것은 [JSON Schema](./advanced/schema.md#json-schema)가 받아들이는 `value`이며, 이 값은 받아들여지지 않습니다.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다. 불러오기 자체는 히스토리 목록에 기록되지 않아 되돌릴 수 없고, `change` 이벤트도 발행되지 않습니다.  
불러올 때 Undo 기록도 비우므로, 불러오기 전에 한 작업을 불러온 문서 위에서 `Undo, Redo`할 수 없습니다.  
파일에 담기는 형태, [runtimeValue](#runtimevalue), 이전 릴리스가 저장한 파일을 모두 받으며, `value` 할당과 달리 탭과 코드 설정을 포함해 텍스트에 담긴 모든 설정을 따릅니다.  
빈 문자열이나 문자열이 아닌 값은 에러가 아니라 새 문서로 불러오므로, `setInitialValue('')`는 빈 다이어그램으로 시작합니다.  
`4.0.0`부터 이 새 문서는 값을 전달받기 전에 엘리먼트가 표시하는 문서이기도 하며, 모든 잠금이 켜져 있습니다. 스크롤, 확대/축소, 탭 전환, Code Generator 언어나 이름 케이스, 괄호 타입 변경은 `value`를 그대로 두며 `change`도 발행하지 않습니다. `3.10.x`에서는 스크롤 위치와 확대/축소 레벨을 모두 저장하지 않았고, 그 이전에는 둘 다 저장했습니다.  
텍스트에서 불러온 문서는 그 안에 기록된 잠금을 유지합니다. `ignoreSaveSettings` 값과 상관없이 `4.0.0` 이전에 저장한 모든 파일과 v2 `.vuerd` 파일처럼 잠금이 기록되지 않은 문서는 모든 잠금이 켜진 상태로 열립니다. `Viewport`는 원점 `0, 0`과 확대/축소 레벨 `1`로 잠기고, ERD 탭에서 열리며, 언어, 이름 케이스, 괄호 타입은 저장된 그대로입니다.  
어느 쪽이든 화면은 문서의 화면, 즉 잠금이 기록된 텍스트는 텍스트에 저장된 화면, 잠금이 기록되지 않은 텍스트는 확대/축소 레벨 `1`의 원점 `0, 0`에서 열리며, 그 위치에 다이어그램이 전혀 그려져 있지 않으면 다이어그램이 있는 곳에서 열립니다. 잠긴 `Viewport`는 그래도 `value`에 잠긴 값을 유지합니다.  
`4.0.0`부터는 이전에 가지고 있던 문서의 공동 편집 상태도 버리며, 이미 구독 중인 이 에디터의 [shared store](#getsharedstore)는 다른 에디터에게 그 상태를 다시 요청하므로, 실행 중인 세션에서 다시 불러온 에디터도 따라잡습니다. 이런 에디터는 다른 에디터의 [runtimeValue](#runtimevalue)로 초기화하세요.  
JSON이 아닌 텍스트도 에러를 발생시키지 않습니다. 문서는 비워지고 설정은 그대로 유지되며, 파싱 에러는 콘솔에 기록됩니다.  
`value` 할당과 달리 `readonly`에 막히지 않기 때문에, `readonly` 에디터에 문서를 불러오는 방법입니다.

```js
editor.setInitialValue('json...');
```

시작할 때 불러오고, 변경될 때 저장합니다.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event

공개 이벤트는 `change`, `changePresetTheme`, `changeLocale` 3개뿐이며, `changeLocale`은 `4.0.0`에서 새로 추가되었습니다.  
엘리먼트는 내부 연결을 위해 자기 자신에게 `@dineug/erd-editor/internal-*` 이벤트도 발행하지만, 이는 API가 아닙니다.

### change

에디터에 변경이 있을 때 이벤트를 발행합니다.  
200ms 디바운스되며, `readonly`가 `true`인 동안에는 발행되지 않습니다.  
UI 편집, `value` 할당, `clear()`, 각 `setSchema*` 메서드, 그리고 `4.0.0`부터는 `setSchemaJSON()`과 `Import and Add` 등 문서가 변경되는 모든 경우에 발행됩니다. `setInitialValue`는 발행하지 않습니다.  
Visualization 탭의 Flow 모드 안에서 하는 확대/축소, 화면 이동, 카드 이동, `Tidy Up`, 행 표시 변경, 카드에서 뷰 범위 좁히기는 모두 문서 변경이 아니므로 어느 것도 이벤트를 발행하지 않습니다.  
`4.0.0`부터 [잠금](../guide/guides/settings.md#잠금)이 켜진 설정의 변경도 화면만 바꾸고 `value`는 바꾸지 않으므로 이벤트를 발행하지 않습니다. `Viewport`가 잠겨 있는 동안의 ERD 캔버스 스크롤이나 확대/축소, `Canvas Type`이 잠겨 있는 동안의 탭 전환, 그리고 각자의 잠금이 켜져 있는 동안의 Code Generator 언어, 테이블 이름 케이스, 컬럼 이름 케이스, 괄호 타입 변경이 해당합니다. 제외되는 것은 이런 변경뿐이므로, 문서도 함께 편집하는 묶음은 여전히 이벤트를 발행합니다. 설정을 잠그거나 잠금을 해제하면 이벤트를 발행합니다.  
새 문서와 `4.0.0` 이전에 저장한 모든 파일은 모든 잠금이 켜져 있으므로, 기본적으로 스크롤, 확대/축소, 탭 전환은 아무것도 발행하지 않습니다. ERD 탭에서 실행하는 테이블 포커스, Flow에서 ERD 탭으로 돌아가는 외부 링크 카드 버튼, 탐색기의 행이나 검색의 일치 항목으로 이동하는 것, 그리고 다른 탭에서 탐색기를 열거나 빠른 검색 결과로 이동하는 것도 여기에 해당합니다. 이들은 각각을 다루는 잠금이 꺼져 있는 동안에만 `change`를 한 번 발행합니다. 탭 전환은 `Canvas Type`, 카드 버튼, 빠른 검색 결과, 탐색기의 행, 검색의 일치 항목이 함께 일으키는 스크롤은 `Viewport`입니다. `4.1.0`부터 이 스크롤은 모두 [이동 후 화면 위치](../guide/guides/table-related-functions.md#이동-후-화면-위치)라는 하나의 규칙을 따르므로, 빠른 검색의 테이블 결과가 더 이상 매번 스크롤하지 않으며, 규칙에 따라 화면을 그대로 두는 이동에는 발행할 스크롤이 없습니다. 탐색기를 열거나 닫거나 크기를 조절하면 캔버스는 원점을 옮기지 않은 채 좁아지거나 넓어지며, 이 역시 아무것도 발행하지 않습니다. `4.0.0` 이전에는 스크롤, 확대/축소, 탭 전환이 `editor.value`가 같게 나오더라도 항상 이벤트를 발행했습니다.  
아무것도 바꾸지 않는 쓰기를 건너뛰려면 불러온 파일이 아니라 마지막으로 저장한 값과 `editor.value`를 비교하세요. `value`는 파일에 담기는 형태로 기록하므로, 이전 릴리스가 저장한 파일, v2 파일, 직접 편집한 파일은 불러오자마자 `value`가 달라질 수 있습니다. `Viewport` 잠금이 꺼져 있고 원점이 이 화면에 다이어그램을 전혀 그리지 않는 파일도 마찬가지입니다. 불러오기가 화면을 다이어그램이 있는 곳으로 옮기고, `value`는 옮겨 간 위치를 기록합니다. `4.0.0`부터는 `value`에 측정된 너비가 담기지 않으므로 측정된 너비 때문에 이런 일이 생기지는 않습니다. 파일을 저장하는 호스트는 대신 복제 store의 `changed`로 편집과 화면 변경을 구분할 수 있습니다. [on@change](./advanced/remote-storage.md#onchange) 문서를 참고하세요.  
이벤트에는 `detail`이 없고 버블링되거나 shadow 경계를 넘지도 않으므로, 엘리먼트 자체에서 수신하고 핸들러에서 `editor.value`를 읽으세요.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme

내장 테마 빌더에서, 또는 `4.0.0`부터는 빠른 검색의 `Theme`에서 preset 테마를 변경할 때 발행합니다. 이미 적용 중인 옵션을 다시 고른 경우를 포함해 고를 때마다 발행합니다.  
직접 [setPresetTheme](#setpresettheme)이나 [setSystemAppearance](#setsystemappearance)를 호출하거나, [systemDarkMode](#systemdarkmode)를 켜거나 끈 경우에는 발행되지 않습니다.  
`event.detail`은 요청한 일부 값이 아니라 고른 뒤의 전체 `ThemeOptions`(`{ appearance, grayColor, accentColor }`)입니다. `4.0.0`부터 `System`이 선택된 동안에는 `appearance`가 표시 중인 라이트나 다크가 아니라 `'system'`이므로, 그대로 저장했다가 `setPresetTheme`에 다시 넘기세요.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale

`4.0.0`부터 에디터에서 언어를 고를 때 발행합니다. Display Language 선택기나 빠른 검색의 `Display Language`에서 고르는 경우이며, 둘 다 [enableLocalePicker](#enablelocalepicker)로 켭니다.  
언어가 적용된 뒤에 발행되며, 이미 적용 중인 옵션을 다시 고른 경우를 포함해 고를 때마다 발행합니다. [setLocale](#setlocale)과 [setSystemLocale](#setsystemlocale)은 이 이벤트를 발행하지 않으며, 브라우저의 언어가 바뀌어도 발행되지 않습니다. 언어를 전환해도 `change`는 발행되지 않습니다.  
`event.detail`은 `LocaleOption`인 `{ locale }`이며, `System`을 고르면 `'system'`, 그 밖에는 해당 언어의 코드입니다. 엘리먼트는 고른 값을 기억하지 않으므로, 저장했다가 다음에 불러올 때 `setLocale`에 전달하세요.  
`change`와 마찬가지로 버블링되지 않으므로, 엘리먼트 자체에서 수신하세요.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus

에디터에 포커스를 줍니다.

```js
editor.focus();
```

## blur

에디터의 포커스를 제거합니다.

```js
editor.blur();
```

## clear

모든 테이블, 컬럼, 관계, 인덱스, 메모, 그리고 `4.0.0`부터는 모든 테이블 그룹을 제거해 문서를 비웁니다.  
데이터베이스, 화면 위치, 확대/축소 레벨, 테이블 보기 옵션, 각 잠금과 그 잠금이 담은 값, Schema SQL 탭의 `Before tables`와 `After tables` 스크립트를 포함해 모든 설정이 유지되므로, 비운 파일은 이전에 저장하던 것을 계속 저장합니다. 대신 새 문서로 시작하려면 `value`에 `''`를 할당하거나 `setInitialValue('')`를 호출하세요.  
히스토리 목록에 기록되어 Undo가 가능하고, `change` 이벤트를 발행합니다. Undo하면 문서가 에디터가 가지고 있던 그대로, 잠긴 각 설정은 잠긴 값으로 돌아옵니다. `readonly`가 설정된 동안에는 무시됩니다.

```js
editor.clear();
```

## destroy

에디터 인스턴스를 재사용 불가능하게 완전히 파괴합니다.  
에디터의 리스너와 구독을 해제하고, [getSharedStore](#getsharedstore)로 반환된 모든 shared store를 파괴합니다.  
shared store가 아직 보류하고 있는 스트림 묶음은 함께 버려지므로, 전송하려면 먼저 해당 store의 [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers)를 호출하세요.

```js
editor.destroy();
```

## setKeyBindingMap

단축키를 재정의합니다.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut`, `zoomReset`은 고정이며 재정의할 수 없습니다.  
아래 21개 이름만 적용되고, 고정된 이름을 포함해 객체의 나머지 값은 무시됩니다.  
`3.10.0`부터 `search`를 재정의할 수 있으며, `findReplace`가 새로 추가되었습니다. 이전에는 `search`가 고정이었습니다. `4.0.0`부터 `removeSelection`이 새로 추가되었습니다. `4.1.0`부터 `addTableGroup`과 `groupSelectedTables`가 새로 추가되었습니다.  
값은 `ShortcutOption[]`이어야 합니다. 문자열만 전달하면 무시되므로 `{ addTable: 'Alt+KeyN' }`이 아니라 `{ addTable: [{ shortcut: 'Alt+KeyN' }] }`으로 작성하세요.  
빈 배열도 허용되며 아무 키도 지정하지 않습니다. `setKeyBindingMap({ findReplace: [] })`는 `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac)를 페이지에 맡기고, `{ search: [] }`는 `Ctrl + K` (Windows/Linux) or `⌘ + K` (Mac)를 마찬가지로 페이지에 맡깁니다. 툴바의 `Search` 버튼으로는 여전히 빠른 검색이 열리고, 툴바의 `Explorer` 버튼으로는 여전히 탐색기가 열리고 닫히며, 빠른 검색과 캔버스 컨텍스트 메뉴의 `Toggle Explorer`는 여전히 탐색기의 검색을 열거나 탐색기를 닫습니다. 비워 둔 이름의 단축키는 이 중 어디에도 표시되지 않습니다. `{ removeSelection: [] }`는 `Delete`와 `Backspace`를 페이지에 맡기며, 이때 테이블, 메모, 테이블 그룹 메뉴의 삭제 항목(`Delete`, `Delete selected`, `Delete column`, `Delete columns`)에는 단축키가 표시되지 않습니다.  
`4.1.0`부터 `{ addTableGroup: [] }`는 `Alt + G` (Windows/Linux) or `⌥ + G` (Mac)를, `{ groupSelectedTables: [] }`는 `T` 다음 `G`를 페이지에 맡깁니다. 캔버스 툴바, 캔버스 컨텍스트 메뉴, 빠른 검색의 `New Table Group`, 테이블 메뉴의 `Group selected tables`, 빠른 검색의 `Group Selected Tables`는 단축키가 표시되지 않을 뿐 그대로 동작합니다. 캔버스 툴바의 `New Table`, `New Memo`, `New Table Group` 버튼의 툴팁은 `addTable`, `addMemo`, `addTableGroup`의 첫 번째 키 조합을 표시하며, 비워 둔 바인딩이라면 버튼 이름만 표시합니다.  
호출은 부분 병합이라 생략한 이름은 기본값을 유지하고, 두 번 호출해도 앞선 변경이 유지됩니다. 현재 설정을 읽는 getter는 없습니다. [createKeyBindingMap](#createkeybindingmap)은 `setKeyBindingMap`으로 변경한 내용이 아니라 기본값을 반환합니다.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection`, 그리고 `4.1.0`부터는 `groupSelectedTables`도 커서에 양보합니다. 포커스가 input, textarea, `contenteditable` 안에 있는 동안에는 `$mod + A`가 텍스트를 선택하고, `Space`는 공백을 입력하며, `Delete`와 `Backspace`는 텍스트를 지우고, `T` 다음 `G`는 두 글자를 입력하며, 캔버스까지 전달되지 않습니다. 이 키 입력 중 어느 것에도 `preventDefault()`를 호출하지 않습니다. 다른 단축키로 재정의해도 동작은 같습니다.

`4.0.0`부터 `removeSelection` (`Delete` 또는 `Backspace`)은 ERD 탭에서 확인 없이 선택한 항목을 Undo 한 단계로 삭제합니다. 포커스한 테이블만 선택되어 있고, 그 테이블의 컬럼이 하나 이상 선택되어 있으며, 확대/축소 배율이 그 행을 그리는 경우에는 그 컬럼을 삭제합니다. 그렇지 않으면 선택된 모든 테이블, 메모, 테이블 그룹을 삭제하며, 그룹의 테이블은 남겨 둡니다. [테이블, 메모 삭제](../guide/guides/table-related-functions.md#테이블-메모-삭제) 문서를 참고하세요.  
키를 누르고 있어도 한 번만 삭제하며, 셀, 메모, 테이블 그룹 이름의 편집모드가 열려 있는 동안에는 아무것도 삭제하지 않습니다. 텍스트 입력란과 바인딩을 붙잡아 두는 패널([createKeyBindingMap](#createkeybindingmap) 참고) 밖에서는 에디터에 포커스가 있는 동안 모든 탭에서 이 키 입력에 `preventDefault()`를 호출하며, 포커스된 툴바 버튼에서도, 아무것도 삭제하지 않는 `readonly` 에디터에서도 마찬가지입니다.

`4.1.0`부터 `addTableGroup` (`Alt+KeyG`)은 캔버스 툴바의 `New Table Group` 버튼처럼 ERD 탭에서 `New Table Group` 그리기를 준비하며, 그다음 캔버스를 마우스 왼쪽 버튼으로 누르면 그룹이 그려집니다. 이 키를 다시 누르면 그리기 준비가 해제됩니다. `groupSelectedTables` (`KeyT KeyG`, `T` 다음 `G`)는 테이블 컨텍스트 메뉴의 `Group selected tables`처럼 선택한 테이블을 새 그룹에 넣고 그 그룹의 이름 편집모드를 엽니다. 선택한 테이블이 없으면 아무것도 추가하지 않으며, 선택한 메모나 테이블 그룹은 포함되지 않습니다. [그룹 그리기](../guide/guides/table-groups.md#그룹-그리기)와 [선택한 테이블 그룹화](../guide/guides/table-groups.md#선택한-테이블-그룹화) 문서를 참고하세요.  
두 바인딩은 메뉴가 그룹을 제공하는 곳에서만 동작하므로, `readonly`가 설정된 동안, View Option → `Table Groups`로 그룹을 숨긴 동안, 셀, 메모, 테이블 그룹 이름의 편집모드가 열려 있는 동안에는 동작하지 않습니다. 다른 캔버스 바인딩과 마찬가지로 ERD 탭에서만 동작하며, 빠른 검색, 테이블 속성, Diff Viewer, Time Travel, 자동 배치 미리보기, `Export image`, `Map Columns`가 열려 있는 동안에는 동작하지 않습니다. 아무 동작도 하지 않는 경우에도 `groupSelectedTables`가 커서에 양보할 때가 아니면 이 키 입력에 여전히 `preventDefault()`를 호출합니다. `addTableGroup`에는 `focusView`, `zenMode`와 마찬가지로 `stopPropagation()`도 호출하므로, 페이지의 버블링 `keydown` 리스너는 이 입력을 받지 않습니다.

`3.10.0`부터 `findReplace` (`$mod+KeyF`)는 [찾기와 바꾸기](../guide/guides/find-and-replace.md)를 엽니다. `4.1.0`부터는 찾기와 바꾸기를 담고 있는 [탐색기](../guide/guides/explorer.md#열기와-닫기)를 열고 닫으며, Shortcuts 탭에는 `Toggle Explorer`로 표시됩니다.  
툴바의 `Explorer` 버튼이 눌린 상태로 표시되는 동안(ERD 탭에서 탐색기가 열려 있고 Zen 모드로 숨겨져 있지 않은 동안)에는 탐색기를 닫습니다. 단, 빠른 검색, 테이블 속성, 테마 빌더, Display Language 선택기, `Export image` 대화 상자, `Map Columns`가 열려 있으면 탐색기를 닫지 않습니다. 그 밖의 경우에는 그중 열려 있는 것을 닫고, 다른 탭에서는 ERD 탭으로 전환한 뒤, 커서를 `Find` 입력란에 두고 검색어를 선택한 채 탐색기를 엽니다. 캔버스 옆에 탐색기를 표시하기에는 에디터가 너무 좁으면 탐색기를 열린 채로 비켜나게 두고 `Widen the window to show the Explorer` 토스트를 표시합니다. `4.1.0` 이전에는 떠 있는 찾기와 바꾸기 패널을 열거나 그 입력란에 키보드 포커스를 돌려주었으며, 패널을 닫지는 않았습니다.  
이 키는 커서에 양보하지 않습니다. 에디터에 포커스가 있는 동안에는 캔버스에서든 에디터 안의 입력란에서든 모든 탭에서 이 키를 에디터가 처리합니다. 이 키 입력에 `preventDefault()`를 호출하므로 브라우저의 찾기 막대가 열리지 않고, `stopPropagation()`도 호출하므로 페이지의 버블링 `keydown` 리스너는 이 입력을 받지 않습니다. 셀이나 메모의 편집모드, 또는 `4.0.0`부터는 테이블 그룹 이름의 편집모드가 열려 있을 때도 `preventDefault()`와 `stopPropagation()`을 호출하지만 아무 동작도 하지 않습니다.  
어느 탭에서든 Diff Viewer, Time Travel, 자동 배치 미리보기가 열려 있는 동안이나 IME가 아직 조합 중일 때는 `preventDefault()`도 `stopPropagation()`도 호출하지 않으므로, 브라우저나 호스트 자체의 찾기 기능이 이 입력을 받습니다. 탐색기 안에서는 조합 중인 입력에 `stopPropagation()`만 호출하고 `preventDefault()`는 호출하지 않습니다. `findReplace`를 다른 단축키로 재정의해도 동작은 같습니다.

`focusView`는 ERD 탭에서만 동작합니다. 테이블이 하나 이상 선택되어 있으면 Visualization 탭을 Flow 모드로 열어, 선택한 테이블과 그 테이블에 관계 하나로 이어진 모든 테이블로 범위를 좁힙니다. 선택한 메모나 테이블 그룹은 포함되지 않으며, 선택한 테이블이 없으면 아무 동작도 하지 않습니다. [테이블 포커스](../guide/guides/visualization.md#테이블-포커스) 문서를 참고하세요.

ERD 탭에서 `stop` (`Escape`)은 셀이나 메모의 편집모드, 또는 그리는 중인 관계를 끝내고 선택은 그대로 둡니다. `4.0.0`부터는 이름을 기록하지 않고 테이블 그룹 이름의 편집모드를 끝내며, `New Table Group` 그리기도 끝냅니다. 에디터는 이 키 입력에 `preventDefault()`를 호출합니다.  
그중 아무것도 열려 있지 않으면 `Escape`는 선택과 포커스한 셀을 해제하며, 이때는 `preventDefault()`를 호출하지 않습니다. 따라서 편집을 끝내고 선택까지 해제하려면 두 번 눌러야 합니다.  
탐색기, [시작 화면](#enablewelcomescreen)의 `Import` 형식 목록, 아래의 선택기와 대화 상자를 제외하면 에디터는 `Escape`의 전파를 막지 않으므로, 예를 들어 자체 다이얼로그를 닫기 위해 직접 `Escape`를 수신하는 페이지는 두 키 입력을 모두 받으며, `defaultPrevented`가 `true`인 입력은 건너뛸 수 있습니다.  
빠른 검색, 테이블 속성, Diff Viewer, 자동 배치 미리보기, Time Travel이 열려 있는 동안에는 `Escape`가 대신 그것을 닫고 선택은 그대로 둡니다. 이 키 입력에도 `preventDefault()`를 호출하지 않습니다.  
`4.0.0`부터는 열려 있는 [`Export image`](../guide/guides/file-import-export.md#이미지)나 [`Map Columns`](../guide/guides/relationship-editing.md#컬럼-매핑) 대화 상자도 `Escape`를 받아 스스로 닫히고 선택은 그대로 둡니다. 각 대화 상자는 열릴 때 키보드 포커스를 가져가며, 이 `Escape`에는 `preventDefault()`와 `stopPropagation()`을 모두 호출합니다.  
`4.1.0`부터 포커스가 [탐색기](../guide/guides/explorer.md#탐색기의-키) 안, 즉 트리, 입력란, 버튼에 있을 때 누른 `Escape`는 키보드 포커스를 캔버스로 돌려주며, 탐색기는 열린 채로, 선택은 그대로 둡니다. 에디터는 이 키 입력에 `preventDefault()`와 `stopPropagation()`을 모두 호출하므로, 페이지의 버블링 `keydown` 리스너에는 전달되지 않습니다.  
캔버스에서 누른 `Escape`는 탐색기를 닫지 않습니다. `4.1.0` 이전에는 찾기와 바꾸기 패널 안에서 누른 `Escape`가 패널을 닫았고, 캔버스에서 누른 `Escape`는 선택을 해제하는 바로 그 입력으로 패널도 닫았습니다.  
`4.0.0`부터 Display Language 선택기와 색상 선택기는 `Escape`로 닫힙니다. 그 안에서 누른 `Escape`에는 `preventDefault()`와 `stopPropagation()`을 모두 호출하며, 캔버스에서 누른 `Escape`는 선택을 해제하는 바로 그 입력으로 이들을 닫고 `preventDefault()`도 `stopPropagation()`도 호출하지 않습니다.  
IME가 아직 조합 중일 때 누른 `Escape`는 조합에 속합니다. 열려 있는 편집모드는 그대로 두고 `preventDefault()`도 호출하지 않으므로, 페이지는 `isComposing`이 `true`이거나 `keyCode`가 `229`인 입력도 건너뛸 수 있습니다. 탐색기 안에서는 조합 중에 누른 다른 키와 마찬가지로 이 입력에도 `stopPropagation()`을 호출하며, 키보드 포커스는 입력란에 그대로 남습니다.  
`3.9.2` 이전에는 `Escape` 한 번으로 편집이나 관계 그리기를 끝내는 동시에 선택까지 해제했고, 에디터는 `preventDefault()`를 호출하지 않았습니다.

### createKeyBindingMap

`3.9.2`부터 패키지는 `createKeyBindingMap()`과 함께 `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` 타입을 export합니다.  
고정된 이름을 포함한 28개 이름 전체의 기본 키 바인딩을 호출할 때마다 새 맵으로 반환하므로, 반환된 맵을 변경해도 다른 곳에는 영향이 없습니다.  
모든 에디터가 시작할 때 사용하는 값이며, `setKeyBindingMap` 호출은 여기에 반영되지 않습니다.  
런타임 export는 `createKeyBindingMap`뿐이며, 나머지 셋은 타입입니다.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

각 `shortcut`은 키를 `KeyboardEvent.code`로 지정하는 [tinykeys](https://github.com/jamiebuilds/tinykeys) 문법의 키 조합이며, [`$mod`](#mod)는 macOS에서는 `⌘`, 그 외 환경에서는 `Control`입니다.  
`4.0.0`부터 에디터는 이 키 조합을 tinykeys를 거치지 않고 같은 문법으로 직접 읽습니다. 키는 `code`로, 또는 대소문자와 상관없이 `key`로 일치하며, 키 입력은 지정된 수정자 키를 정확히 그대로 누르고 있을 때만 일치합니다. `AltGraph`는 Windows에서는 `Control`과 `Alt`로, macOS에서는 `Alt`로 취급됩니다. 공백으로 구분한 키 입력은 시퀀스가 되며, 1초 동안 keydown이 없으면 처음부터 다시 시작합니다.  
`4.1.0`부터 기본값 하나가 시퀀스입니다. `groupSelectedTables`는 `KeyT KeyG`, 즉 `T` 다음 `G`입니다. 시퀀스는 그것을 완성하는 키 입력에서 실행되며, `preventDefault`와 `stopPropagation`도 그 입력에만 적용되므로, 기본값에서는 `T`가 페이지에 전달되고 `G`에만 `preventDefault()`를 호출합니다. 메뉴, 빠른 검색, Shortcuts 탭은 시퀀스를 키 입력 하나마다 키 하나씩 표시합니다.  
고정된 이름은 `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`), `$mod+Digit0` (`zoomReset`)에 바인딩되어 있습니다. `edit`과 `stop`에는 플래그가 없고, 나머지 다섯은 `preventDefault`와 `stopPropagation`을 가집니다. `search`와 `findReplace`를 포함한 그 외 이름은 위의 기본값과 같습니다.

에디터는 자신의 엘리먼트에서 이 키들을 수신하므로, 전역 단축키나 캡처 단계의 `keydown` 리스너로 에디터보다 먼저 키를 받는 호스트는 에디터에 포커스가 있는 동안 이 키들을 통과시켜야 합니다.  
통과시킬 목록은 `createKeyBindingMap()`으로 만들되, `setKeyBindingMap`에 전달한 바인딩으로 해당 기본값을 대체하세요.  
`3.10.0`부터 이 목록에는 브라우저 자체의 찾기 키 조합인 `$mod+KeyF`가 포함됩니다. 이 키 조합에서 호스트 자체의 찾기 기능을 유지하려면 `setKeyBindingMap({ findReplace: [] })`를 전달하세요.  
`4.0.0`부터는 수정자 키 없는 `Delete`와 `Backspace`도 포함됩니다. 호스트가 이 키를 유지하려면 `setKeyBindingMap({ removeSelection: [] })`를 전달하세요.  
`4.1.0`부터는 `Alt+KeyG`와 시퀀스 `KeyT KeyG`도 포함됩니다. 시퀀스는 하나의 문자열로 들어 있으므로, 공백에서 나누어 수정자 키 없는 `T`와 `G`를 포함한 각 키 입력을 통과시키세요. 키 입력이 하나라도 빠진 시퀀스는 완성되지 않기 때문입니다. 호스트가 이 키를 유지하려면 `setKeyBindingMap({ addTableGroup: [] })`나 `setKeyBindingMap({ groupSelectedTables: [] })`를 전달하세요.

포커스가 탐색기 안, 즉 트리, `Find`와 `Replace` 입력란, 버튼에 있는 동안에는 `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut`, `zoomReset`이 에디터로 전달되므로, `findReplace`는 탐색기 안에서도 캔버스에서와 같이 동작합니다. 현재 설정된 그 밖의 모든 바인딩은 탐색기에서 멈추며, 시퀀스는 마지막 키 입력(기본값에서는 수정자 키 없는 `G`)에서 멈춥니다. 방향키, `Tab`, `Enter`, `Space`, `Home`, `End`, 그리고 IME가 아직 조합 중일 때 누른 모든 키도 마찬가지입니다. 키보드 포커스를 캔버스로 돌려주는 `Escape`를 제외하면, 이 키들에는 `preventDefault()` 없이 `stopPropagation()`만 호출하므로 탐색기의 입력란, 버튼, 트리에서 일반 키로 동작하며, 캔버스에도 페이지의 버블링 `keydown` 리스너에도 전달되지 않습니다. 따라서 탐색기에서 `Alt + N`은 테이블을 추가하지 않고, `Delete`는 아무것도 삭제하지 않습니다. 트리의 행 사이를 이동하거나, 행을 접고 펼치거나, 행으로 이동하는 키와, `Find` 또는 `Replace` 입력란에서 일치 항목 사이를 이동하거나 바꾸기를 실행하는 `Enter`에는 `preventDefault()`도 호출합니다.  
호스트의 저장이나 명령 팔레트 키 조합처럼 그 밖의 키는 평소대로 페이지에 전달됩니다. [탐색기의 키](../guide/guides/explorer.md#탐색기의-키) 문서를 참고하세요. `4.1.0` 이전에는 떠 있는 찾기와 바꾸기 패널이 같은 방식으로 키를 붙잡았으며, `Home`, `End`, 시퀀스의 마지막 키 입력, 그리고 `handTool`이 다른 키에 지정된 동안의 `Space`만 예외였습니다.  
`4.0.0`부터 Display Language 선택기도 같은 방식으로 키를 붙잡습니다. 같은 일곱 바인딩은 에디터로 전달되고, 그 밖의 모든 바인딩(`4.1.0`부터 시퀀스는 마지막 키 입력에서), 방향키, `Tab`에는 IME가 아직 조합 중일 때 누른 모든 키와 마찬가지로 `preventDefault()` 없이 `stopPropagation()`만 호출하므로 선택기에서 멈춥니다. 행에서 누른 `↑`, `↓`, `Home`, `End`, `Enter`, `Space`는 행 사이를 이동하거나 행을 고르며, 여기에는 `preventDefault()`도 호출합니다.

### $mod

`Control` 키를 환경에 따라 분기합니다.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Shortcut Table

키보드 이벤트 `key, code` 프로퍼티를 사용합니다.  
절대 위치에는 `code`를, 입력값에는 `key`를 사용합니다.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Theme

### setPresetTheme

preset 테마를 설정합니다.  
기본값은 `appearance: 'dark'`, `grayColor: 'slate'`, `accentColor: 'indigo'`입니다.  
각 필드는 개별로 적용되므로 일부만 전달하면 나머지 두 개는 그대로 유지됩니다. 아래 목록에 없는 값은 무시되며, 호출이 에러를 발생시키지 않습니다.  
`4.0.0`부터 `appearance`는 테마 빌더의 `System`에 해당하는 `'system'`도 받습니다. 운영체제가 알려 주는 라이트 또는 다크, 또는 [setSystemAppearance](#setsystemappearance)로 지정한 값으로 표시되며, 그 값이 바뀌면 함께 전환됩니다.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance

`4.0.0`부터 IDE 테마처럼 자체 라이트와 다크를 가진 호스트를 위해, `'system'` 외관이 표시할 라이트 또는 다크를 지정합니다. 값이 지정된 동안에는 운영체제의 변경이 무시됩니다.  
`null`, 또는 `'dark'`나 `'light'`가 아닌 값을 전달하면 다시 운영체제를 따릅니다.  
외관이 `'light'`나 `'dark'`인 동안에는 화면에 아무 변화가 없지만, 값은 유지되어 외관이 `'system'`이 되는 즉시 적용됩니다. 그 외에는 바로 적용됩니다. 아무 이벤트도 발행하지 않으며, `changePresetTheme`은 계속 `'system'`을 보고합니다.  
VS Code, JetBrains, Obsidian 호스트는 자체 라이트 또는 다크로 이 메서드를 호출하며, 그 값이 바뀔 때마다 다시 호출합니다.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme

테마 사용자 정의가 가능합니다.  
호출할 때마다 사용자 정의 오버레이 전체가 교체되므로, 이미 재정의한 값 위에 토큰 하나만 바꾸려면 전체 객체를 다시 전달하고, preset으로 되돌리려면 `{}`를 전달하세요.  
아래 토큰 이름에 문자열 값을 지정한 것만 유지되고, 그 밖의 값은 에러 없이 버려집니다.  
오버레이는 preset 위에 놓이기 때문에, 이후에 `setPresetTheme`을 호출하면 아래쪽 preset만 바뀌고 재정의한 값은 그대로 유지됩니다.

#### JavaScript

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow`와 `memoShadow`는 ERD 캔버스에서 테이블과 메모가 드리우는 그림자의 색상입니다. 다크 preset은 이 값을 `transparent`로 두어, `setTheme`에 `none`이나 빈 문자열을 넘겼을 때와 마찬가지로 그림자를 드리우지 않고, 라이트 preset은 `rgba(0, 0, 0, 0.18)`을 사용합니다.

`4.0.0`부터 토큰 9개가 추가되었습니다.

- `tableGroupHeaderBackground`, `tableGroupBackground`, `tableGroupBorder`는 자체 색상이 없는 [테이블 그룹](../guide/guides/table-groups.md)의 제목 표시줄, 본문, 테두리 색상입니다.
- `toastSuccess`와 `toastError`는 작업이 어떻게 끝났는지 알리는 토스트의 표시 기호 색상입니다.
- `findReplaceError`와 `mapColumnsError`는 찾기와 바꾸기와 Map Columns 대화 상자가 표시하는 에러의 색상입니다. 찾기와 바꾸기는 이전에 `diffDeleteForeground`를 사용했으므로, 이 값을 재정의해도 더 이상 찾기와 바꾸기의 색상이 바뀌지 않습니다.
- `schemaSqlWarningBackground`와 `schemaSqlWarningForeground`는 Schema SQL 탭 옵션의 경고 색상입니다.

`4.1.0`부터 토큰 9개가 추가되었습니다.

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted`, `treeMatch`는 [탐색기](../guide/guides/explorer.md#트리)와 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer)가 함께 쓰는 트리의 색상으로, 차례로 다음을 칠합니다. 탐색기의 `Find`와 `Replace` 입력란도 채우는 트리의 배경, 포인터가 올라간 행·트리에 포커스가 있는 동안 키보드 포커스가 있는 행·탐색기의 제목 표시줄과 검색에서 포인터가 올라간 버튼, 현재 검색 일치 항목의 행, 개수·데이터 타입·접기 화살표 같은 흐린 텍스트, 그리고 검색이 찾은 텍스트 뒤의 표시입니다.
- `explorerBackground`와 `explorerBorder`는 탐색기 패널과 그 선의 색상입니다. 캔버스와 맞닿은 가장자리, 검색 아래의 선, 입력란과 `Search In`이 펼치는 버튼의 테두리가 해당합니다. `explorerBorder`는 Diff Viewer 트리의 가장자리, `Filter by name` 입력란 아래의 선과 그 입력란의 테두리도 그립니다. 탐색기의 키 아이콘은 `keyPK`, `keyFK`, `keyPFK`를 사용합니다.
- `diffModifyForeground`와 `diffRenameForeground`는 Diff Viewer가 트리와 양쪽 문서에서 변경과 이름 변경으로 표시하는 항목의 색상입니다. `diffModifyForeground`는 이동, 크기 조절, 색상 변경, 소속 그룹 변경이 있었던 테이블, 메모, 테이블 그룹도 다른 변경과 상관없이 외곽선으로 둘러싸며, 변경된 foreign key의 연결선도 그립니다.

`diffInsertForeground`와 `diffDeleteForeground`는 이제 Diff Viewer가 추가와 삭제로 표시하는 항목을 트리와 그 항목이 있는 문서에서 텍스트, 외곽선, 연결선을 가리지 않고 칠합니다. Diff Viewer가 더 이상 셀을 채우지 않으므로 `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground`, `diffCrossForeground`는 `4.1.0`에서 제거되었습니다. `setTheme`은 이 이름들을 `Theme`에 없는 다른 이름과 마찬가지로 버리며, 그 훅인 `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background`, `--erd-editor-diff-cross-foreground`도 더 이상 읽지 않습니다.

#### CSS Variables

`Theme`의 모든 토큰은 `--erd-editor-`에 케밥 케이스 키를 붙인 CSS 훅을 가집니다. `grayColor10`은 `--erd-editor-gray-color-10`, `keyPK`는 `--erd-editor-key-pk`, `keyPFK`는 `--erd-editor-key-pfk`입니다.  
훅은 에디터로 상속되므로 적용하려는 위치 어디에나 지정할 수 있습니다. `:root`에 지정하면 페이지의 모든 에디터에, 엘리먼트에 지정하면 해당 에디터에만 적용됩니다.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

`3.4.0`부터 잘못 표기되어 있던 `dargSelect` 토큰이 `dragSelect`로 바뀌었고, 훅도 `--erd-editor-darg-select-background`, `--erd-editor-darg-select-border`에서 `--erd-editor-drag-select-background`, `--erd-editor-drag-select-border`로 변경되었습니다. 예전 이름을 그대로 쓰는 스타일시트는 무시됩니다.

<details>
<summary>기본 테마 값</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Display Language

`4.0.0`부터 메뉴, 패널, 대화 상자, 빠른 검색, 토스트, 그리고 내보낸 이미지를 포함해 다이어그램에 그려지는 `unnamed` 같은 단어까지, 에디터 자체의 텍스트가 25개 언어로 제공됩니다. 테이블과 컬럼 이름, SQL, 데이터 타입, 생성된 코드는 번역되지 않습니다. [언어와 테마](../guide/guides/language-and-theme.md) 문서를 참고하세요.  
[setLocale](#setlocale)을 호출하거나 언어를 고르기 전에는 에디터가 영어로 표시되며, [enableLocalePicker](#enablelocalepicker)가 켜져 있는 동안에는 `'system'`을 따릅니다.  
에디터는 호스트 엘리먼트나 페이지가 아니라 closed shadow root 안의 자체 루트에 `lang`과 `dir`을 설정하므로, 오른쪽에서 왼쪽으로 쓰는 페이지가 에디터를 뒤집지 않고, 오른쪽에서 왼쪽으로 쓰는 언어가 페이지를 뒤집지도 않습니다. 히브리어, 아랍어, 페르시아어에서는 에디터 인터페이스가 오른쪽에서 왼쪽으로 배치되며, 다이어그램 자체는 좌우로 뒤집히지 않습니다. `4.1.0`부터 [탐색기](../guide/guides/explorer.md)는 모든 언어에서 캔버스 왼쪽에 그대로 있으며, 이 세 언어에서는 탐색기 자체의 행이 오른쪽에서 왼쪽으로 읽힙니다.  
패키지는 `LocaleCode`(아래 코드 중 하나)와 `LocaleOption` 타입을 export합니다.

```ts
type LocaleOption = LocaleCode | 'system';
```

| 코드    | 표시 이름            | 언어              |
| ------- | -------------------- | ----------------- |
| `id-ID` | Bahasa Indonesia     | 인도네시아어      |
| `de-DE` | Deutsch              | 독일어            |
| `en`    | English              | 영어              |
| `es-ES` | Español              | 스페인어          |
| `eu-ES` | Euskara              | 바스크어          |
| `fr-FR` | Français             | 프랑스어          |
| `it-IT` | Italiano             | 이탈리아어        |
| `nl-NL` | Nederlands           | 네덜란드어        |
| `pl-PL` | Polski               | 폴란드어          |
| `pt-PT` | Português            | 포르투갈어        |
| `pt-BR` | Português Brasileiro | 브라질 포르투갈어 |
| `ro-RO` | Română               | 루마니아어        |
| `sk-SK` | Slovenčina           | 슬로바키아어      |
| `sl-SI` | Slovenščina          | 슬로베니아어      |
| `sv-SE` | Svenska              | 스웨덴어          |
| `tr-TR` | Türkçe               | 튀르키예어        |
| `ru-RU` | Русский              | 러시아어          |
| `uk-UA` | Українська           | 우크라이나어      |
| `he-IL` | עברית                | 히브리어          |
| `ar-SA` | العربية              | 아랍어            |
| `fa-IR` | فارسی                | 페르시아어        |
| `ja-JP` | 日本語               | 일본어            |
| `zh-CN` | 简体中文             | 중국어 간체       |
| `zh-TW` | 繁體中文             | 중국어 번체       |
| `ko-KR` | 한국어               | 한국어            |

### setLocale

표시 언어를 `'system'` 또는 위의 코드 중 하나로 설정합니다. 지역 없는 `'ko'`, 알 수 없는 코드, 문자열이 아닌 값처럼 그 밖의 값은 에러 없이 무시됩니다.  
반환되기 전에 적용되므로, 엘리먼트를 페이지에 추가하기 전에 설정한 언어는 첫 프레임부터 표시됩니다.  
`changeLocale`도 `change`도 발행하지 않으며, `value`, Undo 기록, shared store 중 어느 것도 건드리지 않습니다.  
선택은 `enableLocalePicker`를 어느 쪽으로 바꾸든 유지되며, `setLocale('system')`은 선택기가 꺼져 있어도 시스템을 따릅니다.  
에디터는 아무것도 저장하지 않습니다. 사용자의 선택을 유지하려면 [changeLocale](#changelocale)을 수신했다가 다음에 불러올 때 다시 전달하세요.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale

자체 표시 언어를 가진 호스트를 위해, `'system'`이 나타내는 언어를 BCP 47 태그로 지정합니다. VS Code, JetBrains, Obsidian 호스트는 자체 표시 언어로 이 메서드를 호출합니다.  
태그의 앞뒤 공백은 제거됩니다. `null`, 빈 문자열, 문자열이 아닌 값을 전달하면 다시 브라우저의 `navigator.languages`를 따르며, 에디터는 그 값이 바뀌면 함께 따라갑니다.  
현재 적용 중인 옵션이 `'system'`일 때만 의미가 있으며, 바로 적용됩니다. 선택기의 `System` 행에는 이 값이 가리키는 언어가 표시됩니다.  
태그, 또는 브라우저의 각 언어를 순서대로, 대소문자와 밑줄을 무시하고 언어 하위 태그로 비교해 에디터가 제공하는 첫 번째 언어로 결정합니다. `de-AT`는 `de-DE`가 되고 `en-GB`는 `en`이 됩니다. 중국어는 문자 체계를 따라 `Hant`는 `zh-TW`, `Hans`는 `zh-CN`이 되며, 문자 체계가 없으면 지역을 따라 `TW`, `HK`, `MO`는 `zh-TW`, 그 밖에는 `zh-CN`이 됩니다. `pt`는 `BR`이 아닌 지역이 지정되지 않는 한 `pt-BR`이 됩니다. 일치하는 언어가 없으면 에디터는 영어로 표시됩니다.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL

Schema SQL 파일을 불러옵니다.  
기본적으로 현재 문서에 병합하지 않고 교체합니다. 아래의 `mode`를 참고하세요. 화면 위치와 확대/축소 레벨을 제외한 기존 설정은 각 잠금과 잠긴 값을 포함해 유지되며, 파일을 읽고 나면 테이블이 배치됩니다. 아래의 `placement`가 달리 지정하지 않는 한 테이블은 여러 행으로 배치됩니다. `Viewport`가 잠겨 있으면 `value`는 가져오기가 시작하는 화면인 확대/축소 레벨 `1`의 원점 `0, 0`을 기록합니다. 따라서 값을 한 번도 전달받지 않은 엘리먼트로 가져온 문서는 새 문서와 마찬가지로 모든 잠금이 켜져 있습니다.  
히스토리 목록에 기록되어 `Undo, Redo`가 가능하고, `change` 이벤트를 발행합니다. 빈 문자열은 무시되고, `readonly`가 설정된 동안에는 아무 동작도 하지 않습니다.  
`setSchemaGraphQL`, `setSchemaDBML`, `setSchemaAML`도 동일하게 동작하며, 각 파서는 실패하지 않습니다. 읽을 수 없는 텍스트는 에러가 아니라 빈 문서로 불러옵니다.  
`4.0.0`부터 네 메서드 모두 선택적인 두 번째 인자 `{ placement, mode }`를 받습니다.

- `placement: 'grid'`(기본값)는 이전과 마찬가지로 테이블을 바로 여러 행으로 배치하며, 호출은 아무것도 반환하지 않습니다.
- `placement: 'auto'`는 에디터의 `Import`처럼 먼저 테이블을 관계에 따라 배치하며, 가져오기가 Undo 한 단계로 반영되면 resolve되는 `Promise`를 반환합니다. 테이블이 두 개 미만이거나, 관계가 없거나, 배치에 실패하거나, `SharedWorker`가 없는 페이지이거나, `Placing tables` 토스트에서 `Cancel`을 누르면 대신 여러 행으로 배치합니다. 그 사이에 다른 교체 가져오기, `value` 할당, `setInitialValue()`, `clear()`, 공동 편집자의 불러오기, 불러오기나 `clear()`의 Undo 또는 Redo 같은 불러오기가 일어나면 이 호출은 무효가 되며, `Promise`는 아무것도 불러오지 않은 채 resolve됩니다. 이 방식으로 배치한 가져오기는 시작한 순서대로 반영됩니다.
- `mode: 'replace'`(기본값)는 문서를 교체합니다. `mode: 'append'`는 [가져와서 추가](../guide/guides/file-import-export.md#가져와서-추가)처럼 파일을 다이어그램 아래에 추가하며, 이미 있던 모든 테이블과, 탭과 화면 위치를 제외한 모든 설정을 그대로 둡니다. 다른 탭에서는 먼저 ERD 탭으로 전환합니다. 새 테이블과, 테이블 그룹이 표시되는 동안 DBML 파일이 가져온 테이블 그룹이 선택되며, `4.1.0`부터 모든 이동이 따르는 규칙에 따라 이들이 이미 잘 보이는 상태가 아니면 화면이 그곳으로 스크롤됩니다. [이동 후 화면 위치](../guide/guides/table-related-functions.md#이동-후-화면-위치) 문서를 참고하세요. Undo 한 번으로 추가 전체가 제거됩니다. 읽을 수 없는 텍스트는 아무것도 추가하지 않고 문서를 그대로 둡니다.

`readonly`가 설정된 동안에는 교체는 무시되고, 추가는 아무것도 추가하지 않으며, `placement: 'auto'` 호출은 바로 resolve됩니다.  
`3.10.0`부터 `setSchemaSQL`은 문서에 현재 선택된 데이터베이스에 맞춰 파일을 읽습니다. Databricks가 선택되어 있으면 작은따옴표로 감싼 문자열은 Spark의 백슬래시 이스케이프를 따릅니다. [코멘트](../guide/guides/file-import-export.md#코멘트) 문서를 참고하세요.  
`3.10.0`부터 `setSchemaSQL`은 두 개 이상의 컬럼에 걸친 `UNIQUE`를 각 컬럼의 Unique 플래그가 아니라 하나의 unique 인덱스로 읽습니다. [Unique 키와 인덱스](../guide/guides/file-import-export.md#unique-키와-인덱스) 문서를 참고하세요.  
`3.10.0`부터 SQL, DBML, AML 가져오기는 읽어 들인 foreign key의 `ON DELETE`와 `ON UPDATE` 동작을 유지합니다.  
`4.0.0`부터 `setSchemaSQL`은 컬럼의 `DEFAULT` 표현식 전체를 유지하고, SQL Server의 `ADD DEFAULT … FOR`와 `MS_Description` 코멘트를 읽으며, PostgreSQL의 serial과 identity 컬럼을 Auto Increment로 바꾸고, 데이터 타입의 `UNSIGNED`와 `ZEROFILL`을 유지하며, `ALTER TABLE … ADD PRIMARY KEY`가 `CLUSTERED`, `NONCLUSTERED`, `USING BTREE`로 표시한 primary key를 읽습니다. [Schema SQL](../guide/guides/file-import-export.md#schema-sql) 문서를 참고하세요.  
각 파서가 지원하는 문법은 [파일 가져오기와 내보내기](../guide/guides/file-import-export.md) 문서를 참고하세요.

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL

GraphQL SDL 문서를 불러옵니다.  
오브젝트 타입 정의는 테이블이 되고, 다른 테이블을 타입으로 갖는 필드는 관계가 됩니다.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML

dbdiagram.io와 dbdocs에서 사용하는 형식인 DBML 파일을 불러옵니다.  
`4.0.0`부터 각 `TableGroup`은 [테이블 그룹](../guide/guides/table-groups.md)이 되고, 테이블의 `headercolor`는 그 테이블의 색상이 됩니다. [DBML](../guide/guides/file-import-export.md#dbml) 문서를 참고하세요.

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML

AML(Azimutt Markup Language) 파일을 불러옵니다. 현재 표기와 예전 v1 표기를 모두 지원합니다.  
`4.0.0`부터 엔티티의 색상은 Azimutt의 색상 이름 중 하나든 따옴표로 감싼 hex 값이든 그 테이블의 색상이 됩니다. [AML](../guide/guides/file-import-export.md#aml) 문서를 참고하세요.

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON

`4.0.0`부터 [value](#value)가 반환하는 텍스트 같은 `.erd.json` 문서를 불러옵니다.  
기본값인 `mode: 'replace'`에서는 `value` 할당과 같은 방식으로 문서를 불러옵니다. 히스토리 목록에 기록되고, `change` 이벤트를 발행하며, 문서의 잠금도 같은 방식으로 따릅니다. `value`와 달리 빈 문자열이나 문자열이 아닌 값은 새 문서를 시작하지 않고 무시됩니다. JSON이 아닌 텍스트는 `value`와 마찬가지로 문서를 비웁니다.  
`mode: 'append'`는 [가져와서 추가](../guide/guides/file-import-export.md#가져와서-추가)가 `json` 파일에 하는 것처럼, 문서의 테이블, 관계, 인덱스, 메모, 테이블 그룹을 서로의 상대 위치를 유지한 채 새 id로 다이어그램 아래에 추가하며, 문서의 설정은 제외합니다. 읽을 수 없는 텍스트나 테이블도 메모도 없는 문서는 아무것도 추가하지 않습니다. 그 밖의 경우에는 [setSchemaSQL](#setschemasql)의 추가와 같은 방식으로 반영되며, 새 메모와 테이블 그룹은 각각 표시되는 동안 테이블과 함께 선택됩니다.  
문서가 반영된 뒤에 반환되며, `readonly`가 설정된 동안에는 무시됩니다.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL

현재 에디터 상태를 Schema SQL로 추출합니다.  
`databaseVendor`가 없으면 현재 에디터에 설정된 벤더로 동작합니다. 아래 목록에 없는 이름도 에러 없이 동일하게 처리됩니다.  
이름은 에디터에 표시되는 괄호 타입으로 감쌉니다. `Bracket Type`이 [잠겨](../guide/guides/settings.md#잠금) 있는 동안에는 이 값이 `value`가 저장하는 괄호 타입과 다를 수 있으며, 코딩 에이전트의 [`erd_read`](../mcp/tools.md#문서-읽기)가 이름을 감쌀 때 사용하는 것은 `value`가 저장하는 쪽입니다.  
`4.0.0`부터 선택적인 `options` 인자로 [Schema SQL](../guide/guides/schema-sql.md) 탭의 옵션처럼 구문과 헤더를 고릅니다. `SchemaSQLOptions`는 타입으로 export됩니다.

- `statements`: 기본값인 `'create'`, MySQL, MariaDB, PostgreSQL, SQLite, Databricks에서 `IF NOT EXISTS`를 작성하고 그 외에서는 `'create'`로 대체되는 `'ifNotExists'`, 또는 테이블을 생성하기 전에 삭제하는 `'recreate'` 중 하나입니다. `'recreate'`에서 Snowflake는 대신 `CREATE OR REPLACE TABLE`을 작성합니다.
- `header`: 기본값인 `'none'`, 문서의 데이터베이스나 스키마로 전환하는 `'use'`, 또는 그것이 없으면 먼저 생성한 뒤 전환하는 `'createAndUse'` 중 하나입니다. 요청한 헤더가 없는 데이터베이스는 탭과 같은 방식으로 대체합니다. Oracle은 `'createAndUse'` 대신 `'use'`를 작성하고, PostgreSQL은 `'use'`에서 헤더를 작성하지 않으며, SQLite는 헤더를 작성하지 않습니다. 헤더는 문서의 데이터베이스 이름이 ASCII 문자, 숫자, `_`로만 이루어지고 숫자로 시작하지 않는 일반 식별자일 때만 작성됩니다.

생략한 옵션이나 알 수 없는 값의 옵션은 기본값으로 읽으므로, 옵션 없이 호출하면 이전과 마찬가지로 헤더 없는 일반 `CREATE` 문을 작성합니다.  
`4.0.0`부터 출력에는 항상 문서의 `Before tables`와 `After tables` 스크립트가 포함되며, 헤더, 앞 스크립트, DROP 문, 테이블, 뒤 스크립트 순으로 놓입니다. Schema SQL 탭 자체의 `Statements`, `Header`, `Tables` 선택은 이 호출에 영향을 주지 않으며, 이 호출은 항상 문서 전체를 작성합니다.  
`3.10.0`부터 각 foreign key에는 관계의 `ON DELETE`와 `ON UPDATE` 절이 포함됩니다. 절은 동작이 설정되어 있고 해당 벤더가 지원할 때만 작성되므로, 그 벤더가 지원하지 않는 동작은 생략되고 기본 동작이 적용됩니다. `4.0.0`부터 Snowflake는 `NO ACTION`만 지원합니다. 데이터베이스별로 작성되는 내용은 [ON DELETE와 ON UPDATE](../guide/guides/relationship-editing.md#on-delete와-on-update) 문서를 참고하세요.  
`3.10.0`부터 테이블이나 컬럼 코멘트 안의 작은따옴표를 이스케이프하므로, `it's` 같은 코멘트가 더 이상 구문을 깨뜨리지 않습니다. 코멘트를 문자열 리터럴로 작성하는 모든 벤더는 따옴표를 두 번 겹쳐 쓰며, Databricks만 각 따옴표와 각 백슬래시 앞에 백슬래시를 붙입니다. SQLite는 여전히 코멘트를 `--` 줄로 작성합니다.  
`4.0.0`부터 여러 데이터베이스가 키 이름, 기본값, auto increment도 다르게 작성합니다. [DDL이 작성하는 내용](../guide/guides/schema-sql.md#ddl이-작성하는-내용) 문서를 참고하세요.

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore

실시간 공동 편집을 위한 store를 반환합니다.  
`config`는 `{ getNickname?, mouseTracker?, focusTracker? }`입니다. 두 tracker의 기본값은 모두 `true`이며, `mouseTracker`는 이 에디터의 커서를, `focusTracker`는 포커스된 셀, 선택 영역, 드래그 박스를 다른 참여자에게 전송합니다.  
[공동 편집](./advanced/collaborative-editing.md) 문서를 참고하세요.

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue

전달한 문서와 현재 열려 있는 문서를 비교하는 Diff Viewer를 엽니다.  
반환값이 없고 문서를 변경하지 않기 때문에, 뷰어를 닫으면 에디터는 그대로 유지됩니다.  
빈 값이나 문자열이 아닌 값은 빈 문서와 비교합니다.  
캔버스 컨텍스트 메뉴의 [Diff Viewer](../guide/guides/table-related-functions.md#diff-viewer)와 동일한 화면입니다.  
`4.1.0`부터는 두 문서의 항목을 먼저 id로 짝짓고, 그다음에야 테이블의 이름이나 메모의 텍스트처럼 각 항목이 유지하고 있는 정보로 짝짓습니다. [비교 대상](../guide/guides/table-related-functions.md#비교-대상) 문서를 참고하세요. 따라서 파일의 Git 리비전처럼 같은 문서의 이전 버전과 비교하면 이름 변경은 이름이 바뀐 항목 하나로 표시되고, id가 다른 문서와 비교하면 삭제 하나와 추가 하나로 표시됩니다. 뷰어는 변경된 내용을 두 문서 옆의 트리에 나열하며, 셀을 채우는 대신 색으로 변경을 표시합니다.

```js
editor.setDiffValue('prev json...');
```
