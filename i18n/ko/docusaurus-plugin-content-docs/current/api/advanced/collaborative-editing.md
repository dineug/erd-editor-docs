---
sidebar_position: 1
description: getSharedStore로 에디터 간 변경 사항 중계, runtimeValue와 store의 레지스터로 참여하는 에디터 초기화, 같은 순간에 한 편집의 결과 결정, 공동 편집자별 커서, 포커스, 선택과 드래그 박스 표시.
---

# 공동 편집

`getSharedStore()`는 에디터를 공동 편집 세션의 노드로 만듭니다.  
모든 변경 사항을 액션 스트림으로 발행하고 다른 에디터가 보내온 액션을 반영하며, 에디터 사이를 잇는 전송 수단(WebSocket, WebRTC, JSON을 전달할 수 있는 그 밖의 무엇이든)은 직접 준비해야 합니다.  
[ErdEditorElement](../erd-editor-element.md)의 메서드 중 하나이며, 중계한 변경 사항을 저장까지 해야 한다면 [원격 저장](./remote-storage.md)과 함께 사용합니다.  
`5.1.0`부터는 전송 수단을 직접 연결하는 대신 `Y.Doc`과 그 프로바이더로 다이어그램을 공유하려면 `@dineug/erd-editor-yjs`로 에디터를 바인딩하세요. [Yjs](./yjs.md) 문서를 참고하세요.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor`는 이 타입들을 이름으로 export하지 않습니다. TypeScript 코드에서는 `ReturnType<ErdEditorElement['getSharedStore']>`처럼 `ErdEditorElement`를 통해 접근합니다.

액션은 문서의 변경 하나를 기술하는 직렬화 가능한 평범한 객체이므로, 전송 수단으로 전달되는 과정에서 `JSON.stringify`를 거쳐도 손상되지 않습니다.  
액션은 묶음으로 도착합니다. `subscribe`는 배열을 넘겨주고 그 배열이 하나의 단위이므로, 통째로 중계하고 반대쪽에서도 통째로 dispatch합니다.  
액션이 담고 있는 내부 정보, 이를테면 [버전](#concurrent-edits)이 에디터 사이의 동기화를 유지하므로, 액션을 읽거나 고치지 말고 불투명한 값으로 두고 그대로 전달합니다.

에디터에서 하는 일 중 일부는 그 에디터에만 머뭅니다.  
테이블, 메모, 테이블 그룹을 맨 앞으로 가져오는 동작은 전송되지 않으며, 선택할 때 맨 앞으로 오는 것도 마찬가지입니다.  
[Schema SQL](../../guide/guides/schema-sql.md) 탭의 `Statements`, `Header`, `Write logical names into empty comments`(`4.2.0`부터), `Tables` 선택도 그 선택을 한 창에 속하므로 전송되지 않습니다.  
`4.1.0`부터는 [탐색기](../../guide/guides/explorer.md)도 그 에디터에만 머뭅니다. 탐색기가 열려 있는지 여부, 너비, 접힌 행, 키보드 포커스가 있는 행, 트리의 스크롤 위치, 검색과 옵션은 전송되지 않습니다.  
foreign key로 이동할 때 그 관계의 연결선에 표시되는 [강조](../../guide/guides/relationship-editing.md#연결선-읽기)도 전송되지 않습니다.  
`4.2.0`부터는 [사전](../../guide/guides/dictionary.md) 탭도 그 에디터에만 머뭅니다. 어떤 시트가 표시되는지와 각 시트의 검색, 선택, 스크롤, 열 너비는 전송되지 않습니다. 사전 탭의 편집, 정렬, CSV 가져오기는 전송됩니다.  
스크롤, 확대/축소, 탭 전환은 전송되지만, 다른 사용자의 화면이나 탭을 움직이지는 않습니다. 탐색기에서 이동할 때 일어나는 스크롤, 다른 탭에서 탐색기를 열 때 일어나는 ERD 탭 전환, 사전 탭의 [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) 시트에서 테이블이나 컬럼으로 이동할 때 일어나는 탭 전환과 스크롤도 마찬가지입니다. 그 시트에서 단어, 용어, 도메인으로 이동하는 것은 사전 탭 안에 머물므로 아무것도 전송되지 않습니다.

`4.2.0`부터는 [이름 표시](../../guide/guides/logical-names.md#switching-the-view) 전환도 전송되며, 다른 에디터가 이 전환을 어떻게 처리할지는 그 [잠금](../../guide/guides/settings.md#잠금)이 정합니다. `Name View` 잠금은 새 다이어그램과 `4.2.0` 이전의 모든 문서에서 켜져 있습니다.  
잠금이 켜져 있는 동안에는 전환이 전환한 에디터에만 표시됩니다. 전환은 여전히 전송되지만 다른 모든 에디터와 모든 복제본이 이를 버리므로, `value`가 잠긴 보기를 유지하는 동안 사용자마다 다른 보기를 볼 수 있습니다.  
잠금이 꺼져 있는 동안에는 편집할 수 있는 에디터에서 한 전환이 모든 에디터와 복제본의 이름 표시를 바꾸며, 가장 나중에 한 전환이 우선하고, 모든 에디터와 복제본이 이를 저장합니다.  
읽기 전용 에디터에서 직접 한 전환은 항상 그 에디터에만 머물며, 그 에디터도 다른 에디터들이 공유하는 전환은 그대로 따릅니다.

`5.1.0`부터 [Code Generator](../../guide/guides/code-generator.md) 언어, 테이블 이름 케이스, 컬럼 이름 케이스, 괄호 타입의 변경도 각자의 잠금(`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`)을 똑같이 따르지만, 한 가지가 다릅니다. 잠금이 켜져 있는 동안에는 그 변경이 전혀 전송되지 않습니다.  
이 변경은 변경한 에디터에만 표시되고 그 에디터의 Code Generator와 Schema SQL 탭이 이를 따르며, 다른 어떤 에디터나 복제본도 이를 보지 못합니다. `value`와 `runtimeValue`는 잠긴 값을 유지하므로 어느 에디터에서 초기화한 참여 에디터도 이를 보지 못하며, 잠금이 켜져 있는 동안 사용자마다 다른 언어, 이름 케이스, 괄호 타입을 볼 수 있습니다.  
잠금이 꺼져 있는 동안에는 편집할 수 있는 에디터에서 한 변경이 공유됨 표시(페이로드의 `shared: true`)와 함께 전송됩니다. 이 변경은 모든 에디터와 복제본의 설정을 바꾸고, 가장 나중에 한 변경이 우선하며, 모든 에디터와 복제본이 이를 저장합니다. `5.1.0` 에디터나 복제본은 표시된 변경을 자신의 잠금과 상관없이 적용하므로, 잠금을 해제한 직후에 한 변경은 해제보다 먼저 도착하는 곳을 포함해 모든 곳에 반영됩니다.  
`5.1.0` 이전에는 이런 변경이 잠금이 켜져 있든 아니든 모든 에디터와 복제본에 반영되었고, 파일에는 잠긴 값이 남았습니다.

`5.0.0`부터 [읽기 전용](../erd-editor-element.md#readonly) 에디터는 어떤 변경도 전송하지 않습니다. 읽는 사람이 바꾸는 스크롤, 확대/축소, 탭, 이름 표시, 데이터베이스, Code Generator 언어, 이름 케이스, 괄호 타입, `View Option` 행은 잠금과 상관없이 그 에디터의 화면에만 머물며, `5.0.0` 이전에는 읽기 전용 에디터의 스크롤, 확대/축소, 탭 전환, 데이터베이스, 코드 설정도 편집 가능한 에디터와 똑같이 전송되었습니다.  
읽기 전용 에디터의 store는 트래커가 보내는 읽는 사람의 커서, 포커스, 선택, 드래그 박스, 그리고 합류하는 에디터가 요청하는 레지스터는 여전히 전송하고, 다른 에디터가 보내는 모든 변경도 적용합니다. 데이터베이스, Code Generator 설정, `View Option` 행의 변경은 문서에 반영되며, 읽는 사람이 그 화면에서 그 설정을 바꾸지 않았다면 화면에도 반영됩니다. 공유된 이름 표시 전환은 어느 쪽이든 화면에 표시됩니다. `5.1.0`부터는 Code Generator 설정을 그 설정이 잠금이 꺼진 상태에서 변경되었거나 잠금 해제에 담겨 있을 때만 받습니다.  
에디터가 읽기 전용이 될 때는 먼저 store가 드래그나 스크롤에서 아직 쥐고 있는 것을 [flushStreamBuffers](#flushstreambuffers)처럼 전송하므로, 다른 에디터는 그 마지막 부분까지 받습니다.

[잠금](../../guide/guides/settings.md#잠금)은 공유됩니다. 한 설정에 대해서는 가장 나중에 한 잠금이나 잠금 해제가 모든 에디터에서 우선하며, 잠금은 그 잠금을 켠 에디터의 값을 담고 있으므로 모든 에디터와 복제본이 같은 값을 저장합니다.  
따라서 `Viewport` 잠금은 잠금을 켠 에디터의 화면을 저장하고, `Canvas Type` 잠금은 잠금을 켜는 곳인 설정 탭으로 오기 전에 그 에디터가 마지막으로 있던 탭을 저장합니다.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, 또는 `4.2.0`부터는 `Name View` 잠금을 끄면 모든 에디터의 해당 설정도 잠금을 끈 에디터에 표시된 값(그 에디터가 잠금 아래에서 한 자신의 변경 포함)으로 바뀌므로, 모든 에디터가 계속 하나의 값을 저장합니다. `Viewport`나 `Canvas Type` 잠금을 꺼도 누구의 화면이나 탭도 움직이지 않습니다.

`Before tables`나 `After tables` 스크립트를 편집하면 입력란이 포커스를 잃을 때 스크립트 전체가 전송됩니다. 두 스크립트의 결과는 따로 결정되므로, 공동 편집자가 한쪽을 편집해도 다른 쪽을 덮어쓰지 않습니다.

Visualization 탭의 [Flow 모드](../../guide/guides/visualization.md#flow는-문서를-편집하지-않음)에서 하는 어떤 동작도 문서 변경이 아니므로, Flow에 있는 에디터는 다른 에디터에 변경 사항을 보내지 않고, 그동안에도 다른 에디터가 보낸 변경 사항은 계속 반영됩니다.  
예외는 두 가지입니다. Flow를 떠나 다른 탭으로 이동하는 것은 탭 전환이며, 다른 탭 전환과 똑같이 전송됩니다. `4.2.0`부터 Flow 툴바의 이름 표시 목록에서 고르는 것은 이름 표시 전환이며, 캔버스에서 한 전환과 똑같이 전송되고 반영됩니다.  
Flow에서 [좁힌 범위를 한 단계씩 오가는](../../guide/guides/visualization.md#previous-table-and-next-table) `Previous table`, `Next table`, Undo와 Redo 키는 전송되지 않습니다.  
외부 링크 카드 버튼, `#`, `@`, `:` 접두사로 검색해 고른 [빠른 검색](../../guide/guides/quick-search.md#다이어그램-검색) 결과, [탐색기](../../guide/guides/explorer.md#열기와-닫기) 열기는 모두 Flow를 떠나 ERD 탭으로 이동합니다. 카드 버튼이나 빠른 검색 결과가 그곳에서 일으키는 스크롤도 전송됩니다.

## 한 페이지의 두 에디터

여기서는 subscribe에서 dispatch로 이어지는 연결이 네트워크를 대신하므로, 전송 수단 없이 세션의 구조를 확인할 수 있습니다.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

여기서는 두 에디터가 같은 비어 있는 새 문서에서 시작하므로, 어느 쪽도 초기화할 필요가 없습니다.  
에디터가 셋 이상이면 각 에디터의 묶음을 나머지 모든 에디터에 보내세요. 에디터는 받은 것을 다시 전달하지 않습니다.

## 공동 편집자 초기화

shared store는 변경 사항을 생기는 대로 중계할 뿐 참여하는 에디터에 현재 상태의 문서를 넘겨주지 않으므로, 이미 진행 중인 세션에 참여하는 에디터에는 먼저 문서를 전달해야 합니다.  
`4.0.0`부터는 `value`나 저장된 파일이 아니라, 이미 세션에 있는 에디터의 [`runtimeValue`](../erd-editor-element.md#runtimevalue)로 초기화하세요.  
[`@dineug/erd-editor-yjs`](./yjs.md)로 바인딩한 룸은 클라이언트가 [시드](./yjs.md#seeding-a-room)하고 나면 문서 자체를 담고 있으므로, 그 룸에 바인딩된 모든 에디터는 `runtimeValue`를 넘겨받지 않고도 그 문서를 엽니다.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

런타임 값에는 문서를 연 이후 삭제된 항목이 아직 남아 있으므로, 나중에 다른 에디터가 삭제를 되돌리면 참여한 에디터도 그 테이블을 이름과 컬럼까지 그대로 되살립니다.  
[`value`](../erd-editor-element.md#value)는 파일에 담기는 형태이며 삭제된 엔티티가 없으므로, 이 값이나 파일로 초기화한 에디터는 대신 이름 없는 빈 테이블을 되살리게 됩니다.  
`4.2.0`부터는 [사전](../../guide/guides/dictionary.md) 시트에서 삭제한 단어, 용어, 도메인도 마찬가지입니다. 다른 에디터가 그 삭제를 되돌리면 `runtimeValue`로 초기화한 참여 에디터는 그 행을 온전히 다시 나열하고, `value`로 초기화한 참여 에디터는 빈 행을 나열하며, 그 에디터 자신의 `value`는 이 빈 행을 생략합니다.  
저장소에는 계속 `value`를 기록하세요. `runtimeValue`는 다른 에디터, 두 번째 뷰, [replicationStore](./remote-storage.md)를 초기화하는 용도로만 사용합니다.  
VS Code, Obsidian, JetBrains IDE, 웹 앱의 에디터는 열려 있는 문서의 두 번째 뷰를 이 방식으로 초기화합니다.

`setInitialValue`는 중계되지 않으므로, 참여하는 에디터를 초기화해도 다른 에디터에는 아무 변화가 없습니다.  
`4.0.0`부터는 [동시 편집](#concurrent-edits)의 결과를 결정하는 에디터의 협업 레지스터도 함께 버립니다. 에디터의 shared store에 이미 구독자가 있었다면, store는 첫 [subscribe](#subscribe) 때처럼 다른 에디터에 그 에디터들의 레지스터를 다시 요청하므로, 세션 도중에 문서를 다시 불러온 에디터도 다른 에디터와 같은 방식으로 편집의 결과를 결정합니다.  
`value`를 할당하면 레지스터는 유지되지만, `setInitialValue`와 달리 중계됩니다. 에디터에 shared store가 생긴 뒤에는 세션의 모든 에디터가 할당한 문서를 불러오므로, 절대 이 방법으로 참여하는 에디터를 초기화하지 마세요.

`value`와 `runtimeValue` 어느 쪽에도 레지스터와, 에디터의 클록이 도달한 버전이 들어 있지 않으므로, `runtimeValue`만으로 초기화한 참여 에디터는 세션의 에디터들이 첫 subscribe에 보내는 응답에서 이를 가져옵니다.  
그 응답이 도착하기 전에는 참여 에디터가 한 편집이 다른 에디터들이 가진 것보다 낮은 버전을 담을 수 있으므로, 그 편집은 참여 에디터에만 남은 채 다른 에디터들에게 거부되고, 아직 오고 있는 더 오래된 쓰기가 시드가 가진 더 새로운 쓰기 위에 반영됩니다. 서버나 문서 저장소가 세션의 문서를 보관하는 경우처럼 응답하는 실행 중인 에디터가 없으면 참여 에디터는 이를 끝내 얻지 못합니다.  
`5.1.0`부터는 이를 값과 함께 넘겨주세요. 세션의 에디터에서 [`flushStreamBuffers()`](#flushstreambuffers)를 호출해 아직 보류 중인 드래그나 색상 변경을 먼저 내보낸 다음, `runtimeValue`와 그 store의 [`getLWW()`](#getlww), [`getVersion()`](#getversion)을 같은 순간에 읽으세요. 참여 에디터는 `setInitialValue`로 값을 불러온 다음 자신의 store의 [`mergeLWW`](#mergelww)로 나머지를 받으며, 모든 `setInitialValue`가 레지스터를 버리므로 이 순서를 지켜야 합니다. 그러면 참여 에디터의 다음 편집은 시드가 가진 모든 버전을 넘어선 버전을 담으므로, 응답을 기다리지 않고도 반영됩니다. 이미 있는 store에서는 [`reseed`](#reseed)가 이 둘을 한 번의 호출로 처리합니다.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

이렇게 나중에 참여할 에디터를 위해 보관하는 시드는 이 셋을 함께 담습니다. 파일이 아니므로, 저장소에 기록할 것은 여전히 `value`입니다.  
[replicationStore](./remote-storage.md#runtimevalue-getter)는 레지스터를 넘겨주지 않으므로, 그 `runtimeValue`로 초기화한 참여 에디터는 여전히 에디터들의 응답에서 레지스터를 가져옵니다.

## 동시 편집 {#concurrent-edits}

모든 에디터와 복제본은 이름과 거의 모든 다른 필드마다 그 값을 쓴 쓰기의 버전을 유지하며, 이것이 협업 레지스터입니다. 쓰기는 보유한 버전보다 낮지 않은 버전일 때만 반영되므로, 같은 변경을 서로 다른 순서로 받은 에디터들도 같은 문서로 끝납니다.  
`5.1.0`부터 각 버전은 카운터 아래에 쓴 에디터 자신의 슬롯을 담으며, 슬롯은 그 에디터의 id에서 가져옵니다. 따라서 버전은 4,194,304 단위로 증가하고 카운터가 512에 이르면 32비트 정수를 넘어섭니다. `JSON.stringify`와 `JSON.parse`는 이를 온전히 전달하지만, 이를 다른 언어로 파싱하는 중계자나 store는 32비트 정수가 아니라 64비트 숫자로 유지해야 합니다.

`5.1.0`부터 아래 예외를 제외하면, 같은 순간에 한 이름이나 필드를 바꾸는 두 에디터는 모든 에디터와 복제본에서 같은 값으로 끝납니다. 같은 카운터로 쓰더라도 서로 다른 두 버전을 기록하고, 더 큰 쪽이 모든 곳에서 이깁니다. `5.1.0` 이전에는 둘이 하나의 버전을 기록할 수 있었고 각 에디터가 나중에 받은 쪽을 유지했으므로 서로 다르게 끝날 수 있었습니다. 두 에디터가 슬롯을 공유할 확률은 한 쌍당 4,194,304분의 1이며, 그 경우에는 이전처럼 동률이 됩니다.

`5.1.0`부터 테이블의 위치, 메모와 테이블 그룹의 위치와 크기, 화면의 원점과 확대/축소 수준도 같은 방식으로 버전이 붙으며, 이를 움직이는 동작은 끝난 지점으로 전송됩니다.

- 드래그: 이동한 엔티티마다 하나의 `table.moveTo`, `memo.moveTo`, `tableGroup.moveTo`가 한 묶음으로 전송되며, 그룹 드래그는 그룹의 지점과 함께 그 테이블들의 지점도 담습니다;
- 드래그의 Undo나 Redo: 각 엔티티를 놓는 지점으로 전송됩니다;
- 화면 이동과 확대/축소: 화면 이동은 `settings.scrollTo`로, 확대/축소는 `settings.changeZoomLevel`로 전송됩니다;
- 메모나 테이블 그룹의 크기 조절: 위치와 크기를 함께 전송합니다.

따라서 같은 순간에 하나의 테이블, 메모, 테이블 그룹을 이동하거나 이동과 크기 조절을 하는 두 사용자는 모든 에디터와 복제본에서 그것이 하나의 지점과 하나의 크기에 놓인 채 끝납니다. 지점은 더 큰 버전의 쓰기로 가며, 두 축이 함께 갑니다. 이동은 크기를 쓰지 않으므로, 동시에 한 이동이 지점을 가져가더라도 크기 조절은 자신의 크기를 유지합니다.  
`5.1.0` 이전에는 드래그가 이동한 거리로 전송되었으므로 한 테이블의 두 드래그는 합산되었고, 한 메모나 테이블 그룹에 동시에 이루어진 이동과 크기 조절은 서로 다르게 끝날 수 있었습니다.  
Undo 항목을 남기지 않는 20 px 미만의 드래그도 다른 드래그와 똑같이 전송되므로, 지점으로서 같은 순간에 다른 사용자가 한 같은 엔티티의 드래그를 덮어쓸 수 있습니다. 전송 수단이 두 번 전달한 드래그, 화면 이동, 확대/축소 묶음은 아무것도 두 번 움직이지 않습니다.

색상 변경은 예외입니다. 버전 없이 전송되며, 각 에디터와 복제본이 자신의 버전을 기록해 나중에 받은 색상을 유지하므로, 같은 순간에 하나의 테이블, 메모, 테이블 그룹의 색상을 바꾼 두 사용자는 서로 다른 색상으로 끝날 수 있습니다.  
버전이 전혀 없는 변경도 몇 가지 있어 각 에디터와 복제본이 받은 순서대로 적용하므로, 같은 순간에 이루어진 두 변경도 서로 다르게 끝날 수 있습니다. 테이블이나 인덱스 안에서 컬럼을 옮기는 것(`column.move`, `indexColumn.move`), 그리고 [데이터베이스](../../guide/guides/table-related-functions.md#데이터베이스), [`View Option`](../../guide/guides/table-related-functions.md#테이블-보기-옵션) 행, [설정](../../guide/guides/settings.md) 탭의 `Relationship DataType Sync`, `Maximum comment width`, `Column Order`의 변경입니다.  
같은 순간에 두 사용자가 추가한 엔티티, 이를테면 두 테이블이나 한 테이블의 두 컬럼도 각 에디터와 복제본에서 서로 다른 순서로 놓일 수 있으며, 각자의 `value`는 자신의 순서를 저장합니다.

이 모든 것은 `5.1.0` 이상의 에디터와 복제본 사이에서 성립합니다. 더 이전 버전이 무엇을 바꾸는지는 [릴리스 혼용](#릴리스-혼용) 항목을 참고하세요.

## 릴리스 혼용

에디터는 자신의 릴리스가 아는 액션 타입만 반영하므로, 여러 릴리스가 섞인 세션에서는 이전 릴리스의 에디터가 더 새로운 타입으로 전달되는 변경을 놓칩니다.

`3.10.0`부터 관계의 [ON DELETE나 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete와-on-update) 변경은 새로 추가된 두 액션 타입 `relationship.changeOnDelete`와 `relationship.changeOnUpdate` 중 하나로 전달되며, `relationship.add`에도 둘 다 담길 수 있습니다. 액션을 그대로 전달하는 중계자라면 이를 위해 새로 할 일이 없습니다.  
`3.10.0` 이전 버전의 에디터는 이 액션 타입과 필드를 무시하므로, 관계의 ON DELETE나 ON UPDATE를 전혀 알지 못하며, 그 에디터에서 저장한 문서에는 둘 다 없습니다. 이전 버전의 에디터가 추가한 관계는 두 동작 없이 도착하므로 둘 다 `Not set`으로 시작합니다.

`3.10.0` 에디터가 보내는 그 밖의 모든 변경 사항은 이전 버전의 에디터도 이미 알고 있는 액션 타입으로 전달됩니다.  
[찾기와 바꾸기](../../guide/guides/find-and-replace.md#바꾸기)의 `Replace All`은 바꾼 내용을, 직접 편집할 때 보내는 것과 같은 이름 변경, 코멘트, 메모 액션의 한 묶음으로 보냅니다. `Alternate Key`와 `Referential Actions` [보기 옵션](../../guide/guides/table-related-functions.md#테이블-보기-옵션)은 기존의 `settings.changeShow` 액션으로 전달됩니다.

`4.0.0`부터 다음 변경 사항은 새 액션 타입으로 전달되며, 액션을 그대로 전달하는 중계자라면 이를 위해 새로 할 일이 없습니다.

- [테이블 그룹](../../guide/guides/table-groups.md)의 추가, 이동, 크기 조절, 이름 변경, 색상 변경, 삭제: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor`, `tableGroup.remove`. 테이블이 그룹에 들어가거나 그룹에서 빠지는 것: `table.changeGroup`
- 이미 있는 관계에서 두 컬럼 목록을 한 번에 지정하는 [컬럼 매핑](../../guide/guides/relationship-editing.md#컬럼-매핑)의 `Save`: `relationship.changeColumns`
- [잠금](../../guide/guides/settings.md#잠금)을 켜거나 끄는 것: `settings.changeLockSettings`
- [Schema SQL](../../guide/guides/schema-sql.md) 탭의 `Before tables`나 `After tables` 스크립트 편집: `settings.changeDDLScript`

`Table Groups`와 `Memos` 보기 옵션은 기존의 `settings.changeShow` 액션으로 전달됩니다.  
잠금이 대체하기 전에 `Save Scroll Information`과 `Save Zoom Information` 스위치가 보내던 `settings.changeIgnoreSaveSettings`는 더 이상 전송되지 않으며, `settings.changeRelationshipOptimization`은 없어졌습니다. `4.0.0` 에디터는 둘 중 어느 것을 받아도 아무것도 바꾸지 않습니다.

`4.0.0` 이전 버전의 에디터는 새 액션 타입을 무시합니다. 테이블 그룹도, 어떤 테이블이 그룹에 속하는지도 알지 못하지만, 그룹을 드래그하면 그룹에 속한 각 테이블의 이동도 함께 전송되므로 그 에디터에서도 그룹의 테이블은 이동합니다.  
컬럼 매핑의 `Save` 뒤에도 관계의 이전 컬럼을 유지하며, 그 에디터에서 이전 매핑의 컬럼이 삭제되면 그 관계는 모든 에디터에서 사라집니다. 잠금도 스크립트도 없습니다.  
그 에디터에서 저장한 문서에는 이 중 어느 것도 없으며, `4.0.0` 에디터는 그 문서를 모든 잠금이 켜진 상태로 엽니다.  
세션의 모든 에디터와, 그 문서를 저장하는 [replicationStore](./remote-storage.md#dispatch-dispatchsync)는 모두 `4.0.0` 이상으로 유지하세요.

`4.1.0` 에디터는 새 액션 타입을 보내지 않으므로, `4.0.0`과 `4.1.0`의 에디터와 복제본은 놓치는 변경 없이 한 세션을 함께 사용합니다.  
`4.1.0` 에디터의 [찾기와 바꾸기](../../guide/guides/find-and-replace.md#바꾸기)는 인덱스 이름과 테이블 그룹 이름도 검색하며, `Replace`와 `Replace All`은 `4.0.0` 에디터가 이미 반영하는 `index.changeName`과 `tableGroup.changeName` 액션으로 이들의 이름을 바꿉니다.

`4.2.0`부터 다음 변경 사항은 새 액션 타입으로 전달되며, 액션을 그대로 전달하는 중계자라면 이를 위해 새로 할 일이 없습니다.

- 테이블이나 컬럼의 [논리명](../../guide/guides/logical-names.md): `table.changeLogicalName`, `column.changeLogicalName`. 그 이름이 [사전에서 생성되었는지](../../guide/guides/dictionary.md#deriving-physical-names) 여부: `table.changeNameDerived`, `column.changeNameDerived`
- 컬럼을 [도메인](../../guide/guides/dictionary.md#domains-and-data-types)에 연결하거나 연결을 해제하는 것: `column.changeDomain`
- [사전](../../guide/guides/dictionary.md) 탭에서 단어, 용어, 도메인을 추가, 변경(정렬이 정하는 시트 안의 위치 포함), 삭제하는 것: `dictionary.add`, `dictionary.update`, `dictionary.remove`
- [이름 표시](../../guide/guides/logical-names.md#switching-the-view) 전환: `settings.changeNameViewMode`

`Name View` 잠금은 기존의 `settings.changeLockSettings` 액션으로, `Domain` 보기 옵션은 `settings.changeShow`로, [컬럼 순서](../../guide/guides/settings.md#컬럼-순서-조정)에서 `Logical Name`이나 `Domain`을 옮기는 것은 `settings.changeColumnOrder`로 전달됩니다.  
`Import`로 하는 Schema SQL, GraphQL, DBML, AML 가져오기의 `editor.clear`와 `editor.loadJson`에는 `keepDictionaries: true`가 담기며, 이 값이 모든 에디터의 단어, 용어, 도메인을 유지합니다. 문서를 대체하는 [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML`, `setSchemaAML`의 액션도 마찬가지입니다.  
사전이 생성하는 물리명은 `table.changeName`이나 `column.changeName`으로, 도메인이 자신의 컬럼에 주는 데이터 타입은 `column.changeDataType`으로 전달되며, 둘 다 직접 편집할 때 보내는 것과 같은 액션입니다.

`4.2.0` 이전의 에디터는 새 액션 타입을 무시합니다. 그 에디터에는 논리명, 도메인 연결, 사전, 이름 표시가 없습니다. 그 에디터에서는 `Name View`의 잠금이나 잠금 해제가 아무것도 바꾸지 않으며, `Logical Name`이나 `Domain`을 옮기거나 그 둘 중 하나의 자리로 옮기는 컬럼 순서 이동도 마찬가지입니다. 사전 탭에서 설정 탭으로 온 에디터가 켠 `Canvas Type` 잠금도 마찬가지입니다. 이전 에디터는 사전 탭을 모르므로 `Canvas Type`의 잠금을 해제된 상태로 유지합니다. 그래도 사전이 생성하는 물리명과 도메인이 주는 데이터 타입은 표시합니다.  
이전 에디터 자신의 편집은 논리명, 도메인, 사전을 전혀 알지 못하므로, 새 에디터에 다음과 같은 영향을 줍니다.

- 이전 에디터가 직접 이름을 바꾼 테이블이나 컬럼은 이름이 생성된 것으로 표시된 채 남으므로, 나중에 새 에디터에서 그 테이블이나 컬럼에 논리명을 쓰면 이전 에디터에서 입력한 이름 위에 이름이 다시 생성될 수 있습니다.
- 이전 에디터가 도메인에 연결된 컬럼에 지정한 데이터 타입은 연결을 그대로 두므로, `Checks` 시트에 `Domain type mismatch`가 나열되고, 도메인의 타입이 다음에 바뀔 때 컬럼에 다시 도메인의 타입이 지정됩니다.
- 이전 에디터가 추가한 관계의 foreign key 컬럼은 그 키에서 논리명이나 도메인을 받지 않습니다.
- 이전 에디터가 붙여넣거나 복제한 테이블은 논리명이나 도메인 연결 없이 도착합니다.
- 이전 에디터에서 한 Schema SQL, GraphQL, DBML, AML 가져오기는 `keepDictionaries`를 보내지 않으므로 모든 에디터의 단어, 용어, 도메인을 비웁니다.
- 이전 에디터에서 불러오기, 가져오기, `clear()`를 되돌리면 모든 에디터에 그 에디터 자신이 가진 문서 사본을 불러오며, 그 사본에는 논리명, 도메인 연결, 사전이 없습니다.
- 그 사본과, 이전 에디터에서 한 Schema SQL, GraphQL, DBML, AML 가져오기가 불러오는 문서는 모든 에디터의 `Name View` 잠금도 그 에디터가 받았을 때의 상태로 되돌립니다. 그러면 모든 에디터가 이름 표시로 `Physical Names`를 저장하며, 잠금이 꺼져 있으면 `Physical Names`를 표시하기도 합니다.

이전 에디터에서 저장한 문서에는 논리명, 도메인 연결, 사전, 이름 표시가 없으므로, `4.2.0` 에디터는 그 문서를 `Physical Names`로 엽니다. 다만 이전 에디터도 `Name View` 잠금은 받았을 때의 상태 그대로 저장하므로, `4.2.0` 에디터에서 잠금을 해제한 문서는 잠금이 해제된 상태로 남습니다.  
세션의 모든 에디터와, 그 문서를 저장하는 [replicationStore](./remote-storage.md#dispatch-dispatchsync)는 모두 `4.2.0` 이상으로 유지하세요.

`5.1.0` 에디터는 새 액션 타입을 보내지 않으므로, `5.1.0` 이전의 에디터와 복제본도 여전히 그 에디터와 한 세션을 함께 사용하며, 액션을 그대로 전달하는 중계자라면 새로 할 일이 없습니다. 다만 [동시 편집](#concurrent-edits)이 설명하는 것은 `5.1.0` 에디터와 복제본 사이에서만 성립합니다.

- `5.1.0` 에디터의 드래그는 이전 에디터가 이미 적용하는 `table.moveTo`, `memo.moveTo`, `tableGroup.moveTo`의 지점으로, 화면 이동과 확대/축소는 `settings.scrollTo`와 `settings.changeZoomLevel`의 지점으로 전달되며, 후자는 모든 화면 이동과 확대/축소가 그렇듯 다른 에디터는 적용하지 않고 복제본만 받습니다. 이전 에디터는 드래그의 각 지점을 도착한 순서대로 레지스터 밖에서 적용하고, 이전 복제본은 드래그, 화면 이동, 확대/축소의 각 지점을 똑같이 적용하므로, 한 엔티티나 화면에 동시에 보낸 두 지점은 그곳에서 서로 다르게 끝날 수 있습니다.
- 이전 에디터의 드래그는 여전히 이동한 거리로 전달되며 모든 에디터와 복제본이 이를 레지스터 밖에서 더하고, 화면 이동이나 확대/축소도 거리로 전달되어 모든 복제본이 같은 방식으로 더합니다. 한 엔티티에 동시에 보낸 거리와 지점은 이를 서로 다른 순서로 받는 에디터와 복제본에서 서로 다르게 끝날 수 있으며, 전송 수단이 두 번 전달한 거리는 두 번 더해집니다.
- [동시 편집](#concurrent-edits)이 나열하는 예외를 제외하면, `5.1.0` 에디터와 이전 에디터가 같은 순간에 한 이름이나 필드를 쓰면 거의 항상 `5.1.0` 에디터의 쓰기가 이기며, 모든 에디터와 복제본에서 같은 결과가 됩니다. 이전 에디터 둘이 동시에 쓴 하나의 필드는 여전히 서로 다르게 끝날 수 있습니다.
- `5.1.0` 에디터는 Code Generator 언어, 이름 케이스, 괄호 타입의 변경을 잠금이 꺼져 있을 때만 `shared: true` 표시와 함께 보내며, 이전 에디터는 이 표시를 무시하고 변경을 이전처럼 적용합니다. 이전 에디터는 잠금 아래에서 한 변경을 여전히 표시 없이 보내며, `5.1.0` 에디터나 복제본은 그 설정이 그곳에서 잠겨 있는 동안 이를 버리고 이전 에디터는 적용합니다. 따라서 잠금 아래에서 이전 에디터끼리는 서로의 선택을 따르고 `5.1.0` 에디터는 각자의 선택을 유지하며, 어느 쪽이든 파일에는 잠긴 값이 남습니다. 어느 릴리스에서 잠금을 해제하든, 그 해제는 해제한 사용자의 값을 모든 에디터와 복제본에 전달합니다.
- `value` 할당, `clear()`, 문서를 대체하는 가져오기처럼 문서를 대체하는 불러오기는 모든 `5.1.0` 에디터, 즉 그것을 한 에디터와 그것을 받는 각 에디터에서 그리는 중인 관계를 끝냅니다. 이전 에디터는 그 불러오기 후에도 관계 그리기를 켜진 채로 유지합니다.

세션의 모든 에디터와, 그 문서를 저장하는 [replicationStore](./remote-storage.md#dispatch-dispatchsync)는 모두 `5.1.0` 이상으로 유지하세요. 그러면 같은 순간에 한 편집이 [동시 편집](#concurrent-edits)이 나열하는 예외를 제외하고 어디서나 같은 결과로 끝납니다. 논리명과 사전을 유지하는 것은 여전히 `4.2.0` 이상입니다. `1.2.0` 이전의 [MCP 서버](../../mcp/live-and-headless.md#edits-made-at-the-same-moment)는 여기서 `5.1.0` 이전 에디터로 계산되며, `5.1.0` 이전 에디터는 [Yjs](./yjs.md) 룸에 아예 바인딩할 수 없습니다.

## SharedStoreConfig

### getNickname

다른 에디터에서 이 사용자의 마우스 커서 옆에 표시할 닉네임을 설정합니다.  
닉네임이 없거나 비어 있으면 다른 사용자에게 `user`로 표시됩니다.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

이 사용자의 마우스 커서를 다른 에디터에 전송합니다. 기본값은 `true`입니다.  
다른 사용자가 보낸 커서는 항상 ERD 캔버스에 표시됩니다.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker

이 사용자가 작업 중인 내용을 전송합니다. 기본값은 `true`입니다.  
포커스한 테이블과 셀, 선택한 테이블, 메모, 테이블 그룹, 캔버스에서 드래그한 박스가 다른 에디터로 전송되어 그곳에 그려집니다.  
사용자마다 고유한 색상이 지정되어 서로 구분할 수 있습니다. 포커스한 테이블에는 외곽선, 포커스한 셀에는 밑줄, 선택한 테이블, 메모, 테이블 그룹에는 테두리, 드래그 박스에는 점선 사각형이 표시됩니다.  
`4.2.0`부터는 잠금이 켜져 있는 동안이나 읽기 전용 에디터에서 직접 전환한 뒤에는 사용자마다 다른 [이름 표시](../../guide/guides/logical-names.md#collaborators)를 보고 있을 수 있습니다. 자신의 보기가 그리지 않는 셀에 있는 포커스는 그 보기가 대신 그리는 셀에 밑줄로 표시됩니다. 이름과 논리명이 서로를 대신하며, 데이터 타입과 도메인도 마찬가지입니다.  
다른 사용자에게서 도착한 presence 정보는 이 옵션을 켜든 끄든 항상 캔버스에 그려집니다.  
Visualization 탭의 Flow 모드에서는 다른 사용자의 포커스와 선택이 테이블 카드에 그려지지만 드래그 박스는 그려지지 않습니다. 그곳에서 선택한 테이블은 그대로 전송되지만, 그곳에서 드래그한 박스는 전송되지 않습니다.

```js
editor.getSharedStore({ focusTracker: false });
```

두 트래커를 모두 끄면 자체 presence 정보는 전혀 발행하지 않는 단순한 중계자로 shared store를 사용할 수 있습니다.  
다른 에디터가 보낸 presence 정보는 그대로 수신되어 그려집니다.  
VS Code, Obsidian, JetBrains IDE, Google Drive의 에디터가 이렇게 동작합니다.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

커서, 포커스, 선택, 드래그 박스는 문서 변경 사항과 같은 스트림으로 전달되지만 일시적인 정보입니다.  
문서나 Undo 히스토리, `editor.value`에는 전혀 들어가지 않으므로, 전송 수단이 이를 버려도 되고 replicationStore도 무시합니다.

## SharedStore

### connection, disconnect

현재 연결 상태를 설정하는 메서드입니다.  
연결이 끊긴 동안에는 변경 사항을 내부 버퍼에 저장합니다.  
전송 가능한 상태가 되면 버퍼에 쌓인 변경 사항을 구독자에게 발행합니다.  
기본 상태는 연결됨(`connection`)입니다.

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

다른 에디터 인스턴스의 변경 사항을 현재 에디터 인스턴스에 반영합니다.  
묶음에 다른 에디터의 레지스터 요청이 담겨 있으면(참여 에디터의 첫 [subscribe](#subscribe)가 보내는 것처럼), store는 레지스터가 없는 경우가 아니면 자신의 레지스터와 버전을 구독자를 통해 응답합니다.  
`5.1.0`부터는 먼저 [flushStreamBuffers](#flushstreambuffers)처럼 아직 보류 중인 스트림 묶음을 모두 보내므로, 응답이 담는 각 버전은 다른 에디터들이 이미 전달받은 쓰기 위에 서 있습니다. 따라서 참여 에디터가 도착하면 세션의 모든 에디터가 아직 보류 중인 드래그, 화면 이동, 확대/축소, 색상 변경, 메모 크기 조절을 한꺼번에 전송합니다.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

에디터의 변경 사항을 구독합니다.  
구독자가 하나 이상 생기기 전까지는 에디터 밖으로 아무것도 나가지 않으며, 그 전에 발생한 변경 사항은 버퍼에 쌓입니다.  
첫 subscribe는 다른 에디터에 [동시 편집](#concurrent-edits)의 결과를 결정하는 협업 레지스터도 요청하므로, 늦게 참여한 에디터도 같은 방식으로 결과를 결정합니다.  
문서는 가져오지 않으므로, 늦게 참여하는 에디터는 먼저 [초기화하세요](#공동-편집자-초기화). `5.1.0`부터는 시드가 레지스터도 담을 수 있습니다.  
`4.0.0`부터 store는 첫 subscribe 이후 `setInitialValue`, 또는 `5.1.0`부터는 [reseed](#reseed)가 에디터에 문서를 불러올 때마다 다시 요청합니다.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

이 store가 아직 보류하고 있는 스트림 묶음을 스트림이 잠잠해지기를 기다리지 않고 지금 바로 전송합니다.  
`3.9.2`부터 `getSharedStore`가 반환한 store에서 동작합니다. `3.9.1`에서는 타입에 메서드가 있지만 아무 동작도 하지 않습니다.  
테이블, 메모, 테이블 그룹의 이동과 색상 변경, 메모 크기 조절, 화면 스크롤과 확대/축소는 각각 작은 변경 사항이 이어지는 스트림으로 발생합니다. 테이블 그룹 크기 조절은 그렇지 않으며, 드래그가 끝날 때 한 번 전송됩니다.  
store는 각 스트림을 하나의 묶음으로 모아, 스트림이 200ms 동안 잠잠해질 때까지 두 단계로 보류합니다. 색상 변경과 메모 크기 조절은 두 단계를 모두 거치므로 `5.1.0` 이전의 모든 스트림처럼 마지막 변경 후 약 400ms 뒤에 전송됩니다. `5.1.0`부터 드래그, 화면 이동, 확대/축소는 첫 단계 뒤, 즉 마지막 움직임으로부터 약 200ms 뒤에 끝난 지점으로 전송됩니다. [동시 편집](#concurrent-edits) 항목을 참고하세요.  
호출하면 두 단계의 대기가 모두 끝납니다. store가 연결된 상태라면 구독자는 호출이 반환되기 전에 묶음을 받습니다. 보류 중인 것이 없으면 호출해도 아무것도 전송하지 않습니다.  
store 자체의 `destroy`든 에디터의 `destroy`든 호출하면 아직 보류 중인 묶음은 버려지므로, 탭이 닫힐 때처럼 store를 정리하면서 다른 에디터에 마지막 변경이 남아야 한다면 이 메서드를 먼저 호출하세요.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

`5.1.0`부터, 에디터의 협업 레지스터([동시 편집](#concurrent-edits) 참고)의 사본을 반환합니다.  
사본은 JSON을 거쳐 만들어지므로 `JSON.stringify`에 바로 쓸 수 있는 평범한 객체이며, 이를 바꿔도 store의 레지스터는 그대로입니다.  
그대로 다른 store의 [mergeLWW](#mergelww)나 [reseed](#reseed)에 넘기세요. 그 형태는 에디터 고유의 것이므로 어떤 필드도 읽지 마세요.  
[참여 에디터를 초기화](#공동-편집자-초기화)하려면 [getVersion](#getversion), 에디터의 `runtimeValue`와 같은 순간에 읽으세요.

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

`5.1.0`부터, 다른 store가 [getLWW](#getlww)로 내준 레지스터를 이 store의 레지스터에 받아들이면서 각각 더 큰 버전을 유지하고, `version`을 에디터의 클록에 받아들이는데 클록은 자신의 버전과 주어진 버전 중 더 큰 쪽을 유지합니다.  
문서는 전혀 바꾸지 않습니다. `value`나 `runtimeValue`는 한 바이트도 바뀌지 않고, Undo 항목도 `change` 이벤트도 없습니다. 이후의 쓰기가 넘어야 할 버전만 올리므로, 이후에는 주어진 레지스터보다 오래된 쓰기가 거부되고 에디터의 다음 편집은 `version`을 넘어선 버전을 담습니다.  
아무것도 전송하지 않고 아무것도 응답하지 않습니다. 참여 에디터의 첫 subscribe가 다른 에디터의 응답에서 얻는 것을 직접 받아들이는 방법입니다.  
반드시 `setInitialValue` 뒤에 호출하세요. 모든 `setInitialValue`와 모든 [reseed](#reseed)가 가진 레지스터를 버리며, 그 앞에 한 `mergeLWW`가 받아들인 것도 함께 버려집니다.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

`5.1.0`부터, 에디터의 클록이 병합한 가장 높은 버전을 반환합니다. 에디터가 한 변경이나 받아들인 변경의 버전, 참여 과정에서 주고받는 레지스터 요청과 응답의 버전, `mergeLWW`나 `reseed`에 주어진 각 `version` 중 가장 큰 값입니다.  
자신의 것이든 다른 에디터의 것이든 커서, 포커스, 선택, 드래그 박스는 이 값을 움직이지 않습니다.  
같은 순간에 읽은 [getLWW()](#getlww)와 함께 참여 에디터의 [mergeLWW](#mergelww)나 [reseed](#reseed)에 넘겨주세요. 액션이 담고 있는 것과 같은 [버전](#concurrent-edits)입니다.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

`5.1.0`부터, 주어진 id의 에디터가 보낸 커서, 포커스, 선택, 드래그 박스와 각각이 기다리던 만료를 즉시 제거합니다. 다른 모든 에디터의 것은 그대로입니다.  
id는 그 에디터의 shared store가 보내는 모든 액션이 담고 있는 `meta.editorId`입니다. 이 에디터가 아무것도 가지고 있지 않은 id는 아무것도 바꾸지 않습니다.  
전송 수단이 피어가 나갔음을 알게 되었을 때 호출하세요. 그렇지 않으면 피어가 보낸 것은 만료될 때까지 그려진 채 남습니다. 커서는 마지막으로 받은 후 30초, 포커스와 선택은 90초, 드래그 박스는 3초 뒤입니다.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

`5.1.0`부터, 재참여처럼 세션의 문서를 에디터에 다시 엽니다. [Yjs](./yjs.md) 바인딩은 시드된 룸에 바인딩할 때 룸의 문서를 열기 위해, 그리고 재참여할 때마다 이를 호출하며, 룸에 한 번 참여한 뒤에는 화면을 유지합니다.  
[setInitialValue](../erd-editor-element.md#setinitialvalue)처럼 `value`를 불러오고 [mergeLWW](#mergelww)처럼 `lww`와 `version`을 받으므로, store는 주어진 레지스터를 정확히 갖게 되고 클록은 자신의 버전과 `version` 중 더 큰 쪽을 갖게 됩니다. 또 Undo 히스토리를 비우고, `setInitialValue`와 달리 선택과 포커스를 버립니다. 값이 더 이상 담고 있지 않은 것을 가리킬 수 있기 때문입니다.  
아래에서 설명하는, 논리명에서 이름을 생성하는 경우를 제외하면 Undo 항목을 만들지 않고, `change` 이벤트를 발생시키지 않으며, 변경을 전송하지 않습니다. store에 구독자가 한 번이라도 있었다면, 이런 모든 불러오기가 보내는 레지스터 요청을 보내며, 이미 레지스터를 넘겨준 전송 수단은 이를 버려도 됩니다. [focusTracker](#focustracker)가 켜져 있으면 비워진 선택과 포커스도 보냅니다.  
`setInitialValue`처럼 [readonly](../erd-editor-element.md#readonly)가 설정된 동안에도 동작하고, Flow 보기를 버리고, 그리는 중인 관계를 끝내고, 메모, 테이블 그룹 이름, 셀 편집모드를 닫으며 입력하던 내용은 같은 방식으로 유지하거나 버립니다. 닫히는 논리명 셀이 읽는 사람이 입력한 것에서 생성하는 이름은 일반적인 편집이므로 전송되고, 되돌릴 수 있으며, `change` 이벤트로 발생합니다.

`keepScreen` 없이는 화면이 `setInitialValue` 뒤처럼 값이 담고 있는 것을 표시합니다. `keepScreen: true`이면 읽는 사람의 화면이 불러온 문서 위에 다시 덮이며, 그 화면에만 적용됩니다.

- 스크롤 위치와 확대/축소 수준: 엘리먼트가 한 번이라도 표시했을 때만이며, 한 번도 표시하지 않았거나 숨겨진 채 불러온 뒤 표시된 적이 없으면 늦게 참여한 에디터처럼 값이 정한 위치에서 열립니다;
- 불러오기가 탭을 옮겼을 때의 탭이며, 설정 탭에서는 읽는 사람이 오기 전에 있던 탭도 포함합니다. 그곳에서 켠 `Canvas Type` 잠금이 이 탭을 지정합니다;
- 읽는 사람이 잠금 아래에서 자기 화면에 표시하던 이름 표시와 각 Code Generator 설정. 단 그 잠금이 불러오기 전에 켜져 있었고 불러온 뒤에도 켜져 있으며 같은 잠긴 값을 담고 있을 때만 해당합니다. 그동안 피어가 설정을 잠금 해제하고 바꾸고 다른 값으로 다시 잠갔다면 에디터는 새 잠긴 값에서 열리며, 불러오기 전이나 후에 잠금이 꺼져 있으면 불러온 값을 표시합니다;
- 잠금과 상관없이, 읽기 전용 에디터의 읽는 사람이 자신의 화면에서 바꾼 모든 설정.

이 중 어느 것도 전송되지 않으며, `value`와 `runtimeValue`는 여전히 불러온 문서를 보고합니다. 피어가 나중에 잠금을 해제하면 다른 모든 잠금 해제처럼 이렇게 유지된 코드 설정을 대체합니다.  
에디터가 편집할 수 있는 동안 읽는 사람이 다음에 하는 스크롤이나 확대/축소는 유지되던 스크롤 위치와 확대/축소 수준을 다시 문서의 것으로 만들며, 화면이 있는 위치를 앞세워 전송되므로 복제본도 그 확대/축소를 받습니다.

`reseed`는 store가 보류하고 있는 것을 그대로 둡니다. 아직 보류 중인 드래그, 화면 이동, 확대/축소는 `reseed`한 문서에서 읽은 값으로 그 뒤에 전송되고, 색상 변경이나 메모 크기 조절은 에디터가 더 이상 표시하지 않더라도 한 그대로 전송되며, `disconnect()`가 보류하던 것은 `connection()`에서 전송됩니다.  
따라서 먼저 [flushStreamBuffers](#flushstreambuffers)를 호출하고, 그것이 내보내는 것을 전송한 다음, 그것을 담은 값으로 `reseed`하세요. 연결이 끊긴 동안에는 절대 `reseed`하지 마세요.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy

sharedStore 인스턴스를 완전히 파괴합니다.  
에디터 자체는 그대로 두므로 세션에서 나가더라도 문서는 계속 편집할 수 있습니다.  
에디터가 발급한 마지막 sharedStore가 파괴되면 마우스와 포커스 트래커가 멈춥니다.  
store가 아직 보류하고 있는 스트림 묶음은 함께 버려지므로, 전송하려면 먼저 [flushStreamBuffers](#flushstreambuffers)를 호출하세요.  
다른 에디터가 보낸 커서, 포커스, 선택, 드래그 박스는 만료될 때까지 그려진 채 남으며, `5.1.0`부터는 [forgetPeer](#forgetpeer)가 한 에디터의 것을 즉시 제거합니다.

```js
sharedStore.destroy();
```
