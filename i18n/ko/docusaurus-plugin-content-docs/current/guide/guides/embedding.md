---
sidebar_position: 18
description: 코드 없이 erd-editor.io/embed를 프레임으로 넣어 다른 사이트에 다이어그램을 읽기 전용으로 보여 주는 방법. 빌더로 URL과 iframe 줄을 만들고, URL에서 테마, 언어, 이름 표시, 미니맵, 컨트롤, 색상을 설정하며, GitHub나 CORS를 허용하는 서버에서 파일을 제공합니다.
---

# 임베드

[erd-editor.io/embed](https://erd-editor.io/embed)는 다른 사이트가 프레임으로 넣을 수 있도록, 페이지를 가득 채우는 뷰어에 다이어그램을 읽기 전용으로 보여 줍니다. 위키, 블로그, 사이트 빌더, 또는 자체 스크립트를 불러올 수 없는 모든 페이지가 대상입니다.  
`src` 파라미터는 문서, 즉 `.erd.json` 파일처럼 ERD Editor가 저장한 파일의 주소를 가리킵니다. URL의 나머지는 뷰어가 그것을 어떻게 보여 줄지 정하며, 같은 주소의 빌더가 URL과 iframe 줄을 대신 만들어 줍니다.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

이 프레임은 erd-editor 저장소의 [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json)을 보여 주며, 이것을 페이지에 넣는 줄은 다음과 같습니다.

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## 프레임이 보여 주는 것 {#what-the-frame-shows}

프레임은 다이어그램의 테이블, 컬럼, 관계, 메모, 테이블 그룹을 보여 주며, 그 안의 어떤 것도 다이어그램이나 파일을 편집하지 않습니다.  
다이어그램은 파일이 저장한 확대/축소와 스크롤 위치와 상관없이 불러올 때 프레임에 맞춰지므로, 프레임의 크기가 열릴 때의 확대/축소를 정합니다.

캔버스 위에는 다음이 있습니다.

- 다이어그램에 내용이 있는 동안 표시되는 미니맵
- 아래쪽의 컨트롤 막대: `Zoom out`, 클릭하면 확대/축소를 초기화하는 확대/축소 수준, `Zoom in`, `Fit`, `Name View` 목록, 그리고 다이어그램이 화면에 하나도 없는 동안 표시되는 `Go to content`
- 오른쪽 아래의 `erd-editor.io` 링크. 새 탭에서 erd-editor.io를 열고 리퍼러를 보내지 않으므로, 클릭해도 사이트는 프레임이 보여 주는 문서에 대해 아무것도 알 수 없습니다. 좁은 프레임에서는 컨트롤 막대 일부를 가릴 수 있습니다.

파일을 불러오는 동안 프레임에는 `Loading diagram`이 표시됩니다. 파일을 가져올 수 없거나 문서가 없으면 프레임은 빈 다이어그램과 `Couldn't load the diagram`을 표시합니다. [GitHub의 파일](#files-on-github)과 [다른 서버의 파일](#files-on-other-servers) 항목을 참고하세요.

프레임은 URL과 방문자의 시스템만 따릅니다. 방문자가 erd-editor.io에서 쓰는 언어와 테마는 프레임에 적용되지 않습니다.

## 빌더 {#the-builder}

`src` 없이 [erd-editor.io/embed](https://erd-editor.io/embed)를 열면 `Embed a diagram`이라는 제목의 페이지인 빌더가 나옵니다.

1. `Document URL`에 문서의 주소를 붙여 넣습니다. `Enter`를 누르거나 입력란을 벗어날 때 적용되므로, 입력하는 동안에는 아무것도 가져오지 않습니다. 적용되면 입력란 아래의 `Loads from` 줄이 뷰어가 가져오는 주소를 보여 줍니다. 입력한 주소이거나, GitHub의 페이지라면 GitHub의 raw 호스트에 있는 그 주소입니다. [GitHub의 파일](#files-on-github) 항목을 참고하세요.
2. 옵션을 고릅니다. 각 옵션은 미리보기, URL, iframe 줄에 바로 적용됩니다.
   - `Theme`: `System`, `Light`, `Dark`
   - `Display Language`: `System`(그 옆에 브라우저에서 이것이 가리키는 언어가 표시됩니다)과 25개 언어이며, 각 언어는 자기 이름으로 표시됩니다.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names`, `Both Names`. `As Saved`는 파일이 저장한 이름 표시를 보여 줍니다.
   - `Accent color`와 `Gray color`: 각각 견본과 함께 이름으로 나열됩니다.
   - `Minimap`과 `Controls`: 두 스위치이며 둘 다 켜져 있습니다.
   - `Height`: 픽셀 단위이며 처음에는 `480`입니다. 양의 정수가 아닌 높이는 `480`으로 간주합니다.
3. `Preview`를 확인합니다. 프레임이 보여 줄 모습 그대로의 뷰어이며, `erd-editor.io` 링크가 있고, `Height`만큼 높은 상자 안에 있습니다. 미리보기의 `System` 언어는 erd-editor.io 자체가 표시하는 언어와 상관없이 브라우저의 언어입니다.
4. 결과를 복사합니다. `Embed URL`은 프레임의 주소이고, `Embed code`는 설정한 높이와 너비 `100%`를 담은 iframe 줄입니다. 각각 `Copy` 버튼이 있으며, 문서 URL이 적용되기 전에는 비활성화되어 있고, 복사한 뒤 잠시 `Copied`로 표시되다가 변경이 복사한 내용을 다시 쓰면 원래대로 돌아갑니다.

`Document URL`을 지우면 적용될 때 미리보기와 두 결과가 비워집니다.

## URL 파라미터 {#url-parameters}

| 파라미터 | 값 | 기본값 |
| --- | --- | --- |
| `src` | URL 인코딩한 문서의 주소 | 없음. 이것이 없거나 비어 있으면 페이지는 빌더입니다. |
| `theme` | `light`, `dark`, `system` | `system`: 방문자의 브라우저가 알려 주는 라이트 또는 다크 모드 |
| `locale` | `system`, 또는 `de-DE`처럼 [언어 표](./language-and-theme.md#표시-언어)의 코드 | `system`: 방문자의 브라우저 언어이며, [System](./language-and-theme.md#system이-따르는-언어)이 맞추는 방식으로 맞추고, 뷰어에 그 언어가 하나도 없으면 영어 |
| `name-view` | `physical`, `logical`, `both` | 파일이 저장한 이름 표시 |
| `minimap` | `false`는 미니맵을 숨깁니다 | 표시 |
| `controls` | `false`는 컨트롤 막대를 숨깁니다 | 표시 |
| `accent-color` | `jade`처럼 [테마 빌더](./language-and-theme.md#테마)의 강조 색상 26개 중 하나 | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive`, `sand` | `slate` |

기본값은 뷰어 자체의 값이며, `jade`와 `olive`로 시작하는 웹 앱의 값이 아닙니다.

- 빌더는 기본값인 옵션을 URL에서 빼므로, 임베드 URL에는 기본값과 다른 것만 담깁니다.
- 뷰어가 받지 않는 값은 무시되고, 그 옵션은 기본값을 유지합니다. 값은 나열된 그대로 정확히 비교하므로 `theme=Dark`는 무시되며, `minimap`과 `controls`는 `false` 외의 어떤 값에서도 표시됩니다.
- 두 번 주어진 파라미터는 첫 번째 값을 취합니다.
- `src`는 빌더가 쓰는 대로 URL 인코딩합니다. `&`나 `#`이 들어 있는 주소는 그렇지 않으면 중간에서 잘리기 때문입니다.

## GitHub의 파일 {#files-on-github}

GitHub의 파일이나 gist는 위 프레임처럼 그 페이지가 보여 주는 주소로 지정할 수 있습니다. 뷰어는 대신 GitHub의 raw 호스트에서 가져오는데, 이 호스트는 페이지 자체의 주소가 응답하지 않는 다른 사이트의 요청에 응답합니다.

- 파일의 페이지 `https://github.com/<owner>/<repo>/blob/<ref>/<path>`나 그 `raw` 주소 `https://github.com/<owner>/<repo>/raw/<ref>/<path>`는 `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`에서 불러옵니다. `<ref>`는 브랜치, 태그, 커밋입니다. 브랜치는 그 브랜치가 가진 파일을 보여 주고, 태그와 커밋은 그 버전을 유지합니다.
- gist의 페이지 `https://gist.github.com/<user>/<id>`는 gist의 첫 번째 파일인 `https://gist.githubusercontent.com/<user>/<id>/raw`에서 불러옵니다. 다이어그램을 gist의 유일한 파일로 두세요.

임베드 URL은 입력한 주소를 유지하고, 빌더의 `Loads from` 줄은 가져오는 주소를 보여 줍니다.  
이것은 공개 저장소와 공개 gist에서만 동작합니다. raw 호스트는 각 파일을 5분 동안 캐시하므로, 푸시한 변경이 프레임에 나타나기까지 그만큼 걸릴 수 있습니다.

## 다른 서버의 파일 {#files-on-other-servers}

erd-editor.io의 뷰어는 방문자의 브라우저에서 단순한 `GET`으로 파일을 가져오므로, 파일을 가진 서버가 이 교차 출처 요청을 허용해야 합니다(CORS). 응답에 `*`처럼 `https://erd-editor.io`를 허용하는 `Access-Control-Allow-Origin` 헤더가 있어야 합니다.  
요청에는 쿠키가 실리지 않으므로, 파일은 로그인하지 않고 읽을 수 있어야 합니다.  
이 헤더가 없거나, 에러로 응답하거나 ERD Editor 문서가 아닌 것으로 응답하는 주소에서는 프레임이 `Couldn't load the diagram`을 표시합니다.

## 프레임 안에서 {#in-the-frame}

프레임은 방문자가 클릭하거나 탭하거나 `Tab`으로 도달하기 전까지 휠, 제스처, 키를 받지 않습니다. 그 전에는 휠, 스와이프, 핀치가 평소처럼 프레임을 둘러싼 페이지를 스크롤하거나 확대/축소합니다.  
포커스를 받으면 휠은 다이어그램을 이동시키고, `Ctrl + Wheel` (Windows/Linux) 또는 `⌘ + Wheel` (Mac)과 핀치는 확대/축소하며, `Ctrl + K` (Windows/Linux) 또는 `⌘ + K` (Mac)는 문서를 검색하는 창을 엽니다. 거기서 `#`은 테이블을, `@`은 컬럼을, `:`은 코멘트나 메모를 찾습니다.  
드래그는 프레임에 포커스가 있든 없든 다이어그램을 이동시키며, 클릭이나 탭은 관계를 강조합니다. 클릭한 테이블의 관계나 클릭한 관계 하나입니다. 포인터가 올라가 있는 테이블은 자신의 관계를 강조합니다. 모든 키는 [포커스와 키](../../api/erd-viewer-element.md#focus-and-keys) 항목을 참고하세요.

더 큰 다이어그램에서 확대/축소와 검색을 해 보려면 테이블 아홉 개와 테이블 그룹 두 개가 있는 [bookstore 샘플](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json)을 별도 페이지로 열어 보세요.

## 분석 {#analytics}

erd-editor.io는 웹 앱의 방문을 집계하는 것과 마찬가지로 Google Analytics로 프레임의 방문을 집계합니다. 프레임에 대해 기록되는 주소는 `src`가 가리키는 문서 주소 없이 `erd-editor.io/embed`뿐입니다.  
[개인정보 처리방침](https://erd-editor.io/privacy)을 참고하세요.

## 뷰어를 직접 불러오기 {#loading-the-viewer-yourself}

스크립트를 불러올 수 있는 페이지는 대신 `@dineug/erd-editor` 패키지의 [`<erd-viewer>`](../../api/erd-viewer-element.md) 엘리먼트로 다이어그램을 보여 줄 수 있습니다. 같은 옵션을 속성과 메서드로 받고, erd-editor.io에는 요청을 보내지 않으며, 페이지 자체 사이트의 문서를 불러올 수도 있는데 이때는 CORS가 필요하지 않습니다.
