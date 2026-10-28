---
sidebar_position: 1
description: getSharedStore로 에디터 간 변경 사항 중계, runtimeValue로 참여하는 에디터 초기화, 공동 편집자별 커서, 포커스, 선택과 드래그 박스 표시.
---

# 공동 편집

`getSharedStore()`는 에디터를 공동 편집 세션의 노드로 만듭니다.  
모든 변경 사항을 액션 스트림으로 발행하고 다른 에디터가 보내온 액션을 반영하며, 에디터 사이를 잇는 전송 수단(WebSocket, WebRTC, JSON을 전달할 수 있는 그 밖의 무엇이든)은 직접 준비해야 합니다.  
[ErdEditorElement](../erd-editor-element.md)의 메서드 중 하나이며, 중계한 변경 사항을 저장까지 해야 한다면 [원격 저장](./remote-storage.md)과 함께 사용합니다.

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

액션은 문서의 변경 하나를 기술하는 직렬화 가능한 평범한 객체이므로, 전송 수단으로 전달되는 과정에서 `JSON.stringify`를 거쳐도 손상되지 않습니다.  
액션은 묶음으로 도착합니다. `subscribe`는 배열을 넘겨주고 그 배열이 하나의 단위이므로, 통째로 중계하고 반대쪽에서도 통째로 dispatch합니다.  
액션이 담고 있는 내부 정보가 에디터 사이의 동기화를 유지하므로, 액션을 읽거나 고치지 말고 불투명한 값으로 두고 그대로 전달합니다.

에디터에서 하는 일 중 일부는 그 에디터에만 머뭅니다.  
테이블, 메모, 테이블 그룹을 맨 앞으로 가져오는 동작은 전송되지 않으며, 선택할 때 맨 앞으로 오는 것도 마찬가지입니다.  
[Schema SQL](../../guide/guides/schema-sql.md) 탭의 `Statements`, `Header`, `Write logical names into empty comments`(`4.2.0`부터), `Tables` 선택도 그 선택을 한 창에 속하므로 전송되지 않습니다.  
`4.1.0`부터는 [탐색기](../../guide/guides/explorer.md)도 그 에디터에만 머뭅니다. 탐색기가 열려 있는지 여부, 너비, 접힌 행, 키보드 포커스가 있는 행, 트리의 스크롤 위치, 검색과 옵션은 전송되지 않습니다.  
foreign key로 이동할 때 그 관계의 연결선에 표시되는 [강조](../../guide/guides/relationship-editing.md#연결선-읽기)도 전송되지 않습니다.  
`4.2.0`부터는 [사전](../../guide/guides/dictionary.md) 탭도 그 에디터에만 머뭅니다. 어떤 시트가 표시되는지와 각 시트의 검색, 선택, 스크롤, 열 너비는 전송되지 않습니다. 사전 탭의 편집, 정렬, CSV 가져오기는 전송됩니다.  
스크롤, 확대/축소, 탭 전환은 전송되지만, 다른 사용자의 화면이나 탭을 움직이지는 않습니다. 탐색기에서 이동할 때 일어나는 스크롤, 다른 탭에서 탐색기를 열 때 일어나는 ERD 탭 전환, 사전 탭의 [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) 시트에서 테이블이나 컬럼으로 이동할 때 일어나는 탭 전환과 스크롤도 마찬가지입니다. 그 시트에서 단어, 용어, 도메인으로 이동하는 것은 사전 탭 안에 머물므로 아무것도 전송되지 않습니다.

`4.2.0`부터는 [이름 표시](../../guide/guides/logical-names.md#switching-the-view) 전환도 전송되며, 다른 에디터가 이 전환을 어떻게 처리할지는 그 [잠금](../../guide/guides/settings.md#잠금)이 정합니다. `Name View` 잠금은 새 다이어그램과 `4.2.0` 이전의 모든 문서에서 켜져 있습니다.  
잠금이 켜져 있는 동안에는 전환이 전환한 에디터에만 표시됩니다. 전환은 여전히 전송되지만 다른 모든 에디터와 모든 복제본이 이를 버리므로, `value`가 잠긴 보기를 유지하는 동안 사용자마다 다른 보기를 볼 수 있습니다. 언어, 이름 케이스, 괄호 타입 변경은 다릅니다. 이 변경은 잠금이 켜져 있든 아니든 모든 에디터에 반영됩니다.  
잠금이 꺼져 있는 동안에는 편집할 수 있는 에디터에서 한 전환이 모든 에디터와 복제본의 이름 표시를 바꾸며, 가장 나중에 한 전환이 우선하고, 모든 에디터와 복제본이 이를 저장합니다.  
읽기 전용 에디터에서 직접 한 전환은 항상 그 에디터에만 머물며, 그 에디터도 다른 에디터들이 공유하는 전환은 그대로 따릅니다.

`5.0.0`부터 [읽기 전용](../erd-editor-element.md#readonly) 에디터는 어떤 변경도 전송하지 않습니다. 읽는 사람이 바꾸는 스크롤, 확대/축소, 탭, 이름 표시, 데이터베이스, Code Generator 언어, 이름 케이스, 괄호 타입, `View Option` 행은 잠금과 상관없이 그 에디터의 화면에만 머물며, `5.0.0` 이전에는 읽기 전용 에디터의 스크롤, 확대/축소, 탭 전환, 데이터베이스, 코드 설정도 편집 가능한 에디터와 똑같이 전송되었습니다.  
읽기 전용 에디터의 store는 트래커가 보내는 읽는 사람의 커서, 포커스, 선택, 드래그 상자, 그리고 합류하는 에디터가 요청하는 레지스터는 여전히 전송하고, 다른 에디터가 보내는 모든 변경도 적용합니다. 데이터베이스, Code Generator 설정, `View Option` 행의 변경은 문서에 반영되며, 읽는 사람이 그 화면에서 그 설정을 바꾸지 않았다면 화면에도 반영됩니다. 공유된 이름 표시 전환은 어느 쪽이든 화면에 표시됩니다.  
에디터가 읽기 전용이 될 때는 먼저 store가 드래그나 스크롤에서 아직 쥐고 있는 것을 [flushStreamBuffers](#flushstreambuffers)처럼 전송하므로, 다른 에디터는 그 마지막 부분까지 받습니다.

[잠금](../../guide/guides/settings.md#잠금)은 공유됩니다. 한 설정에 대해서는 가장 나중에 한 잠금이나 잠금 해제가 모든 에디터에서 우선하며, 잠금은 그 잠금을 켠 에디터의 값을 담고 있으므로 모든 에디터와 복제본이 같은 값을 저장합니다.  
따라서 `Viewport` 잠금은 잠금을 켠 에디터의 화면을 저장하고, `Canvas Type` 잠금은 잠금을 켜는 곳인 설정 탭으로 오기 전에 그 에디터가 마지막으로 있던 탭을 저장합니다.  
`Language`, `Table Name Case`, `Column Name Case`, `Bracket Type`, 또는 `4.2.0`부터는 `Name View` 잠금을 끄면 모든 에디터의 해당 설정도 잠금을 끈 에디터에 표시된 값으로 바뀌므로, 모든 에디터가 계속 하나의 값을 저장합니다. `Viewport`나 `Canvas Type` 잠금을 꺼도 누구의 화면이나 탭도 움직이지 않습니다.

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
`4.0.0`부터는 동시 편집의 결과를 결정하는 에디터의 협업 레지스터도 함께 버립니다. 에디터의 shared store에 이미 구독자가 있었다면, store는 첫 [subscribe](#subscribe) 때처럼 다른 에디터에 그 에디터들의 레지스터를 다시 요청하므로, 세션 도중에 문서를 다시 불러온 에디터도 다른 에디터와 같은 방식으로 편집의 결과를 결정합니다.  
`value`를 할당하면 레지스터는 유지되지만, `setInitialValue`와 달리 중계됩니다. 에디터에 shared store가 생긴 뒤에는 세션의 모든 에디터가 할당한 문서를 불러오므로, 절대 이 방법으로 참여하는 에디터를 초기화하지 마세요.

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

`4.0.0` 이전 버전의 에디터는 새 액션 타입을 무시합니다. 테이블 그룹도, 어떤 테이블이 그룹에 속하는지도 알지 못하지만, 그룹을 드래그하면 그룹에 속한 테이블의 `table.move`도 함께 전송되므로 그 에디터에서도 그룹의 테이블은 이동합니다.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

에디터의 변경 사항을 구독합니다.  
구독자가 하나 이상 생기기 전까지는 에디터 밖으로 아무것도 나가지 않으며, 그 전에 발생한 변경 사항은 버퍼에 쌓입니다.  
첫 subscribe는 다른 에디터에 동시 편집의 결과를 결정하는 협업 레지스터도 요청하므로, 늦게 참여한 에디터도 같은 방식으로 결과를 결정합니다.  
문서는 가져오지 않으므로, 늦게 참여하는 에디터는 먼저 [초기화하세요](#공동-편집자-초기화).  
`4.0.0`부터 store는 첫 subscribe 이후 `setInitialValue`가 에디터에 문서를 불러올 때마다 다시 요청합니다.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

이 store가 아직 보류하고 있는 스트림 묶음을 스트림이 잠잠해지기를 기다리지 않고 지금 바로 전송합니다.  
`3.9.2`부터 `getSharedStore`가 반환한 store에서 동작합니다. `3.9.1`에서는 타입에 메서드가 있지만 아무 동작도 하지 않습니다.  
테이블, 메모, 테이블 그룹의 이동과 색상 변경, 메모 크기 조절, 화면 스크롤과 확대/축소는 각각 작은 변경 사항이 이어지는 스트림으로 도착합니다. 테이블 그룹 크기 조절은 그렇지 않으며, 드래그가 끝날 때 한 번 전송됩니다.  
store는 각 스트림을 하나의 묶음으로 모아, 스트림이 200ms 동안 잠잠해질 때까지 보류합니다. 이 과정이 두 단계로 이루어지므로 묶음은 마지막 변경 후 약 400ms 뒤에 전송됩니다.  
호출하면 두 단계의 대기가 모두 끝납니다. store가 연결된 상태라면 구독자는 호출이 반환되기 전에 묶음을 받습니다. 보류 중인 것이 없으면 호출해도 아무것도 전송하지 않습니다.  
store 자체의 `destroy`든 에디터의 `destroy`든 호출하면 아직 보류 중인 묶음은 버려지므로, 탭이 닫힐 때처럼 store를 정리하면서 다른 에디터에 마지막 변경이 남아야 한다면 이 메서드를 먼저 호출하세요.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy

sharedStore 인스턴스를 완전히 파괴합니다.  
에디터 자체는 그대로 두므로 세션에서 나가더라도 문서는 계속 편집할 수 있습니다.  
에디터가 발급한 마지막 sharedStore가 파괴되면 마우스와 포커스 트래커가 멈춥니다.  
store가 아직 보류하고 있는 스트림 묶음은 함께 버려지므로, 전송하려면 먼저 [flushStreamBuffers](#flushstreambuffers)를 호출하세요.

```js
sharedStore.destroy();
```
