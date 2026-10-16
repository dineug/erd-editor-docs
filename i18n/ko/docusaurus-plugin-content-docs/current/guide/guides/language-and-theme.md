---
sidebar_position: 15
description: 에디터의 25개 표시 언어, 오른쪽에서 왼쪽 레이아웃, 테마 빌더의 System·Light·Dark 외관과 색상, 각 호스트가 이를 보관하는 위치.
---

# 언어와 테마

에디터 자체의 텍스트는 25개 언어로 제공되며, 에디터의 모습은 테마로 정해집니다. 테마는 외관(`System`, `Light`, `Dark`), 회색 색상, 강조 색상으로 이루어집니다.  
둘 다 다이어그램이 아니라 에디터를 사용하는 사람에게 속합니다. 어느 쪽도 파일에 저장되거나 [Undo 히스토리](./undo-redo.md)에 기록되거나 공동 편집자와 공유되지 않으므로 각자 자신의 언어와 테마를 보며, 어느 쪽을 바꿔도 파일이 수정됨으로 표시되지 않습니다.

둘 다 [설정](./settings.md) 탭에는 없습니다. 툴바에는 [`Explorer`](./explorer.md) 버튼 다음에 `Theme` 버튼이 있고, 바로 그 뒤에 `Display Language` 버튼이 있습니다. [빠른 검색](./quick-search.md)은 모든 탭에서 `Theme`과 `Display Language`를 나열합니다.  
웹 앱, Google Drive, VS Code, JetBrains IDE, Obsidian은 모두 둘 다 제공하며 고른 값을 기억합니다. [각 호스트에서](#각-호스트에서) 항목을 참고하세요. 둘 다 읽기 전용 에디터에서도 동작합니다.

## 표시 언어

표시 언어는 에디터 자체의 텍스트에 적용됩니다. 툴바 툴팁, 컨텍스트 메뉴, 빠른 검색, 패널과 대화 상자, 설정 탭, [시작 화면](./editing-start.md#시작-화면), 토스트와 메시지, 그리고 비어 있는 이름, 데이터 타입, 기본값, 코멘트가 캔버스와 내보낸 이미지에 표시하는 플레이스홀더가 여기에 해당합니다.  
다음은 어느 언어에서나 작성된 그대로 유지됩니다. 직접 작성한 테이블과 컬럼 이름, 코멘트, 메모, 데이터베이스 벤더, Code Generator의 언어, 파일 형식, 데이터 타입, SQL 키워드, `ON DELETE`와 `ON UPDATE` 동작, Schema SQL 옵션 `Create`, `If not exists`, `Drop & re-create`, `USE`, `CREATE + USE`, `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL`, `AK1.1` 표시, [Diff Viewer](./table-related-functions.md#diff-viewer)의 상태 문자 `A`, `M`, `D`, `R`, `~`, `None`을 제외한 이름 케이스와 `Bracket` 선택 항목, 키보드 키 이름, 테마 빌더의 색상 이름, 생성된 SQL과 코드, 내보낸 파일 이름입니다.

선택기가 나열하는 순서대로 정리한 언어는 다음과 같습니다.

| 선택기에 표시되는 이름 | 언어 | 코드 |
| --- | --- | --- |
| Bahasa Indonesia | 인도네시아어 | `id-ID` |
| Deutsch | 독일어 | `de-DE` |
| English | 영어 | `en` |
| Español | 스페인어 | `es-ES` |
| Euskara | 바스크어 | `eu-ES` |
| Français | 프랑스어 | `fr-FR` |
| Italiano | 이탈리아어 | `it-IT` |
| Nederlands | 네덜란드어 | `nl-NL` |
| Polski | 폴란드어 | `pl-PL` |
| Português | 포르투갈어 | `pt-PT` |
| Português Brasileiro | 브라질 포르투갈어 | `pt-BR` |
| Română | 루마니아어 | `ro-RO` |
| Slovenčina | 슬로바키아어 | `sk-SK` |
| Slovenščina | 슬로베니아어 | `sl-SI` |
| Svenska | 스웨덴어 | `sv-SE` |
| Türkçe | 튀르키예어 | `tr-TR` |
| Русский | 러시아어 | `ru-RU` |
| Українська | 우크라이나어 | `uk-UA` |
| עברית | 히브리어 | `he-IL` |
| العربية | 아랍어 | `ar-SA` |
| فارسی | 페르시아어 | `fa-IR` |
| 日本語 | 일본어 | `ja-JP` |
| 简体中文 | 중국어 간체 | `zh-CN` |
| 繁體中文 | 중국어 번체 | `zh-TW` |
| 한국어 | 한국어 | `ko-KR` |

빠른 검색이 Code Generator 탭에서 제공하는 `Language`와 설정 탭의 [잠금](./settings.md#잠금) 목록에 있는 `Language` 행은 표시 언어가 아니라 [Code Generator의 대상 언어](./code-generator.md#language)입니다.

### 언어 선택

`Display Language` 버튼(언어 아이콘)은 `Display Language` 선택기를 엽니다. 선택기는 툴바 아래, 열려 있는 탭 위에 표시되는 `Display Language`라는 제목의 패널입니다.  
맨 위에는 `System`이 오며, 그 옆에 지금 `System`이 나타내는 언어가 표시되고, 목록을 스크롤해도 계속 보입니다. 그 뒤로 25개 언어가 각자 그 언어로 쓴 이름으로 이어지며, 현재 적용 중인 옵션에 체크 표시가 됩니다.

![툴바에서 표시 언어를 한국어로 바꾸고, 이어서 툴바는 좌우가 뒤집히지만 다이어그램은 그대로인 العربية로 바꾼 뒤 System으로 되돌리기](/img/demo-display-language.webp)

패널은 체크 표시된 행에 키보드 포커스를 둔 채로 열립니다.

- `↑`와 `↓`로 행 사이를 이동하며 양 끝에서 순환하고, `Home`과 `End`로 첫 번째와 마지막 행으로 이동합니다.
- `Enter` 또는 `Space`는 클릭과 마찬가지로 포커스된 행을 고릅니다.

고른 언어는 바로 적용되며, 패널이 닫히고 키보드 포커스가 에디터로 돌아갑니다.

`Escape`, 제목 옆의 `x` 버튼, 툴바를 제외한 패널 바깥의 에디터 아무 곳이나 누르기, `Display Language` 버튼 다시 누르기로 고르지 않고 닫을 수 있으며, `x` 버튼의 툴팁에는 `Close (ESC)`가 표시됩니다.  
선택기를 열면 테마 빌더와 테이블 속성이 닫힙니다. 열려 있는 [탐색기](./explorer.md#탐색기-옆의-대화-상자)는 열린 채로 남으며, 왼쪽에서 오른쪽으로 쓰는 언어에서는 선택기가 탐색기를 덮지 않고 바로 그 옆에 놓입니다.  
빠른 검색이나 테마 빌더를 열면 선택기가 닫히며, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac)를 눌러도 닫힙니다. 이 키는 [탐색기](./explorer.md#열기와-닫기)를 검색 상태로 열거나, 탐색기가 이미 열려 있으면 열린 채로 두고 키보드 포커스를 Find 입력란으로 옮깁니다. 툴바의 `Explorer` 버튼을 눌러도 선택기는 열린 채로 남습니다.

패널이 키보드 포커스를 가진 동안에도 몇 가지 에디터 단축키는 계속 동작합니다. `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, `Zoom Reset`이며, [단축키](./settings.md#단축키) 문서를 참고하세요. 그 밖의 모든 에디터 단축키, 방향키, `Tab`은 패널 안에 머물므로 에디터가 이에 반응하지 않습니다. 호스트 자체의 저장처럼 에디터가 지정하지 않은 키는 평소대로 호스트에 전달됩니다.

[빠른 검색](./quick-search.md)에서 `Display Language`는 `System`과 25개 언어를 나열하며, 현재 적용 중인 옵션에 체크 표시가 됩니다. 여기서는 언어를 영어 이름이나 코드로도 찾을 수 있으므로, `german`이나 `de-DE`로 검색하면 `Deutsch`가 나옵니다.

### System이 따르는 언어

웹 앱, Google Drive, VS Code, JetBrains IDE, Obsidian에서 언어는 `System`으로 시작합니다. `System`은 호스트의 언어를 따릅니다.

- 웹 앱, Google Drive, 직접 만든 페이지: 브라우저의 선호 언어. 선호 언어가 바뀌면 바로 따라갑니다.
- VS Code: VS Code의 표시 언어.
- JetBrains IDE: IDE가 자체 인터페이스를 표시하는 언어.
- Obsidian: Obsidian의 언어.

`System`은 그 언어 중 에디터가 제공하는 첫 번째 언어를 사용하며, 하나도 제공하지 않으면 영어를 사용합니다.  
지역 변형은 그 언어로 취급되므로, `de-AT`는 Deutsch가 되고 `fr-CA`는 Français가 됩니다. 중국어는 문자 체계를 따르며, 번체는 繁體中文이 되고 그 밖의 문자 체계는 简体中文이 됩니다. 문자 체계가 지정되지 않으면 대만, 홍콩, 마카오는 繁體中文이 되고, 그 밖의 중국어는 简体中文이 됩니다. 포르투갈어는 브라질이 아닌 지역이 지정되지 않는 한 Português Brasileiro가 되므로, `pt-PT`는 Português가 됩니다. Obsidian의 포르투갈어도 Português가 됩니다.

### 오른쪽에서 왼쪽으로 쓰는 언어

עברית (히브리어), العربية (아랍어), فارسی (페르시아어)에서는 에디터가 오른쪽에서 왼쪽으로 배치되며, 툴바, 메뉴, 패널과 대화 상자, 빠른 검색, 설정 탭이 좌우로 뒤집힙니다. 컨텍스트 메뉴의 하위 메뉴는 왼쪽으로 열리고, 툴바의 Undo와 Redo 아이콘이 서로 바뀌어 Undo가 오른쪽에서 왼쪽으로 읽는 사람에게 뒤로 가는 방향을 가리킵니다.

다이어그램 자체는 뒤집히지 않습니다. 테이블, 컬럼, 관계, 메모가 있는 캔버스는 왼쪽에서 오른쪽 그대로 유지되며, 미니맵, 스크롤바, [캔버스 툴바](./table-related-functions.md#캔버스-툴바), [Visualization](./visualization.md)과 그 툴바, 데이터 타입 셀, Schema SQL과 Code Generator 탭의 코드, 색상 선택기, Diff Viewer의 양쪽 화면, Time Travel, 자동 배치 미리보기도 마찬가지입니다.  
[탐색기](./explorer.md#캔버스-옆)는 캔버스의 왼쪽에, Diff Viewer의 변경 트리는 비교 화면의 왼쪽에 그대로 있으며, 각각 드래그하는 가장자리는 오른쪽에 있습니다. 안쪽은 둘 다 오른쪽에서 왼쪽으로 읽힙니다. 입력란과 행이 좌우로 뒤집히고, 행은 오른쪽부터 들여쓰기되며, 두 트리 모두에서 `←`는 행을 펼치거나 첫 번째 하위 행으로 이동하고 `→`는 행을 접거나 상위 행으로 나갑니다. [탐색기의 키](./explorer.md#탐색기의-키) 문서를 참고하세요.  
직접 입력한 이름, 코멘트, 그 밖의 텍스트는 각자의 방향을 유지하므로, 히브리어, 아랍어, 페르시아어 이름은 캔버스에서도 오른쪽에서 왼쪽으로 읽힙니다.

## 테마

`Theme` 버튼(대비 아이콘)은 테마 빌더를 엽니다. 테마 빌더는 툴바 아래, 열려 있는 탭 위에 표시되는 `Theme`이라는 제목의 패널이며, 세 부분으로 구성됩니다.

- `Accent color`: 견본 26개. 각 견본의 툴팁에 `indigo`처럼 그 이름이 표시됩니다.
- `Gray color`: 견본 6개. `gray`, `mauve`, `slate`, `sage`, `olive`, `sand`입니다.
- `Appearance`: `System`, `Light`, `Dark`.

![툴바에서 테마 빌더를 열고 강조 색상과 회색 색상을 고른 뒤, 외관을 Light로, 이어서 System으로 바꾸기](/img/demo-theme-builder.webp)

각 부분에서 현재 적용 중인 선택에는 표시가 되며, 고른 값은 바로 적용되고 빌더는 열린 채로 남습니다.  
색상을 골라도 외관은 그대로이므로, `System`에서 고른 색상은 `System`을 유지합니다.

`System`은 호스트와 같이 라이트 또는 다크로 표시되며, 호스트가 전환하면 함께 전환됩니다.

- 웹 앱, Google Drive, 직접 만든 페이지: 브라우저가 알려 주는 라이트 또는 다크 모드이며, 이는 운영체제를 따릅니다.
- VS Code: 라이트 색상 테마에서는 라이트, 다크 색상 테마나 두 가지 고대비 테마에서는 다크.
- JetBrains IDE: IDE의 라이트 또는 다크 테마.
- Obsidian: Obsidian의 라이트 또는 다크 테마.

`Escape`, 제목 옆의 `x` 버튼, 툴바를 제외한 패널 바깥의 에디터 아무 곳이나 누르기, `Theme` 버튼 다시 누르기로 빌더를 닫으며, `x` 버튼의 툴팁에는 `Close (ESC)`가 표시됩니다.  
빌더를 열면 테이블 속성과 `Display Language` 선택기가 닫힙니다. 열려 있는 [탐색기](./explorer.md#탐색기-옆의-대화-상자)는 열린 채로 남으며, 왼쪽에서 오른쪽으로 쓰는 언어에서는 빌더가 탐색기를 덮지 않고 바로 그 옆에 놓입니다.  
빠른 검색이나 `Display Language` 선택기를 열면 빌더가 닫히며, `Ctrl + F` (Windows/Linux) or `⌘ + F` (Mac)를 눌러도 닫힙니다. 이 키는 [탐색기](./explorer.md#열기와-닫기)를 검색 상태로 열거나, 탐색기가 이미 열려 있으면 열린 채로 두고 키보드 포커스를 Find 입력란으로 옮깁니다. 툴바의 `Explorer` 버튼을 눌러도 빌더는 열린 채로 남습니다.  
빌더는 어떤 키도 가로채지 않으므로, 빌더가 열려 있는 동안에도 에디터의 단축키가 동작합니다.

[빠른 검색](./quick-search.md)에서 `Theme`은 `System`, `Light`, `Dark`를 나열하며, 현재 적용 중인 외관에 체크 표시가 됩니다. 하나를 고르면 외관만 바뀌고 회색 색상과 강조 색상은 그대로 유지됩니다.

## 각 호스트에서

에디터에서 툴바나 빠른 검색으로 고른 값은 호스트가 보관하는 위치에 저장되며, 어디에서 바꾸든 열려 있는 모든 다이어그램이 그 변경을 바로 따릅니다.  
VS Code, JetBrains IDE, Obsidian에서는 호스트의 `Auto`(VS Code에서는 값 `auto`)가 에디터의 `System`입니다. `System`을 고르면 `Auto`가 저장되고, `Light`나 `Dark`를 고르면 `Auto`가 이미 그 외관을 표시하고 있었더라도 그 외관이 저장됩니다.  
확장과 플러그인 자체의 설정과 알림은 표시 언어와 상관없이 영어로 표시됩니다.

### 웹 앱과 Google Drive

erd-editor.io(공동 편집 세션 포함)와 Google Drive에서는 하나의 언어와 하나의 테마가 앱과 그 안의 모든 다이어그램에 적용됩니다.  
둘 다 스키마나 Drive 파일이 아니라 현재 브라우저에 보관되며, erd-editor.io의 모든 탭이 이를 공유합니다. 한 탭에서 고르면 다른 탭도 바로 바뀝니다.

언어는 직접 고르기 전까지 브라우저의 선호 언어를 따르는 `System`입니다.  
사이드바, 휴지통, 공동 편집, Google Drive 화면 같은 앱 자체의 텍스트도 같은 언어를 따르며, 히브리어, 아랍어, 페르시아어에서는 앱 전체가 오른쪽에서 왼쪽으로 배치됩니다. 개인정보 처리방침, 서비스 약관, 지원 페이지는 영어로 유지됩니다.  
에디터의 패널과 빠른 검색 외에도 사이드바 맨 아래 줄의 `Privacy`와 `Terms` 링크 옆에 언어 버튼이 있으며, 툴팁에는 `Display Language`가 표시됩니다. 이 버튼의 메뉴는 `System`과 그것이 나타내는 언어, 이어서 25개 언어를 나열합니다.

테마는 `System`, 회색 색상 `olive`, 강조 색상 `jade`로 시작합니다.  
테마 빌더와 빠른 검색 외에도 사이드바 아래쪽에 `System`, `Light`, `Dark` 세 아이콘 버튼이 있으며, erd-editor.io에서는 `Trash` 옆에, Google Drive에서는 `Sign out` 옆에 있습니다. 이 버튼은 빌더와 같은 외관을 설정합니다.

### VS Code

확장의 설정은 VS Code의 Settings에서 ERD Editor 아래에 있습니다.

| 설정 | 값 | 기본값 |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` 또는 [언어 표](#표시-언어)의 코드 | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | 6가지 회색 색상 | `slate` |
| `dineug.erd-editor.theme.accentColor` | 26가지 강조 색상 | `indigo` |

Settings 편집기는 언어 설정의 값으로 `Auto`를 먼저, 이어서 각 언어를 그 언어로 쓴 이름으로 나열합니다. `settings.json`에서 어떤 언어도 가리키지 않는 값은 `auto`로 읽힙니다.  
에디터에서 테마를 고르면 세 가지 테마 설정이 모두 기록됩니다. 고른 값은 그 설정이 이미 지정된 곳에 기록되며, 작업 영역 폴더, 없으면 작업 영역, 없으면 사용자 설정 순입니다.

### JetBrains IDE

Settings | Tools | ERD Editor에는 `Appearance:`(`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:`, `Display language:`(`Auto`와 그 뒤로 각 언어를 그 언어로 쓴 이름)가 있으며, IDE 전체 설정으로 보관됩니다.  
각각 `Auto`, `Slate`, `Indigo`, `Auto`로 시작합니다.

### Obsidian

Settings → ERD Editor에는 `Appearance`(`Auto`, `Light`, `Dark`), `Gray color`, `Accent color`, `Display language`(`Auto`와 그 뒤로 각 언어를 그 언어로 쓴 이름)가 있으며, 볼트별로 보관됩니다.  
각각 `Auto`, `Slate`, `Indigo`, `Auto`로 시작합니다.  
변경 내용은 팝아웃 창에 있는 탭을 포함해 볼트의 모든 ERD 탭에 적용됩니다.

### 직접 만든 페이지

직접 만든 페이지의 `<erd-editor>`는 페이지가 [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder)와 [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker)로 켜기 전까지 `Theme`과 `Display Language` 버튼을 표시하지 않으며, 빠른 검색도 둘 다 나열하지 않습니다.  
페이지가 언어를 지정하거나 사용자가 언어를 고르기 전까지 에디터는 영어로 표시되며, `enableLocalePicker`가 켜져 있는 동안에는 `System`을 따릅니다.  
테마는 페이지가 다른 값을 지정하거나 [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode)를 켜지 않는 한 `Dark`, 회색 색상 `slate`, 강조 색상 `indigo`로 시작합니다.  
사용자가 고른 값은 바로 적용되지만 요소는 어느 쪽도 저장하지 않습니다. 시작 값은 페이지가 지정하고, 사용자가 고른 값도 페이지가 직접 저장합니다. API의 [Theme](../../api/erd-editor-element.md#theme)과 [Display Language](../../api/erd-editor-element.md#display-language) 문서를 참고하세요.
