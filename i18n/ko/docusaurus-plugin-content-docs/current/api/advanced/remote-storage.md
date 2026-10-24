---
sidebar_position: 2
description: 메인 스레드 밖의 헤드리스 복제 store로 실행 중인 에디터 복제, 저장을 위한 문서 직렬화.
---

# 원격 저장

에디터에 변경 사항이 있을 때마다 전체 상태를 전송하는 건 비효율적입니다.  
이런 경우를 위해 실시간 데이터 복제 API를 제공합니다.

## 설치

```sh
npm install @dineug/erd-editor
```

복제 store는 패키지 루트가 아니라 `@dineug/erd-editor/engine.js` 하위 경로에 있습니다.  
이 진입점은 DOM을 사용하지 않으므로 Web Worker를 비롯해 메인 스레드 밖 어디에서도 동작합니다.  
반면 패키지 루트를 import하면 document가 필요한 `<erd-editor>` 커스텀 엘리먼트가 등록됩니다.

## 사용

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## 실행 중인 에디터 복제

액션은 실행 중인 에디터의 shared store에서 가져옵니다.  
[공동 편집](./collaborative-editing.md) 문서를 참고하세요.

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

경계를 넘어가는 것은 변경 사항뿐이며 문서 전체는 전송되지 않습니다.  
복제본이 변경 사항을 반영하고 결과를 자체적으로 직렬화합니다.  
`change`는 그 결과를 `value`로 전달하며, `changed`로 저장할 시점을 알 수 있습니다.

`4.0.0`부터는 위 예시처럼 저장된 파일이나 에디터의 `value`가 아니라 에디터의 `runtimeValue`로 복제본을 초기화하세요.  
파일에는 저장한 이후의 편집이 없고, `value`에는 세션에서 삭제된 엔티티가 없습니다.  
삭제된 테이블 없이 초기화된 복제본은 에디터가 그 삭제를 되돌리면 테이블을 이름과 컬럼 없이 되살리고, 그 상태로 저장합니다.  
`4.2.0`부터는 [사전](../../guide/guides/dictionary.md) 시트에서 삭제한 단어, 용어, 도메인도 마찬가지입니다.  
에디터가 그 삭제를 되돌리면 그 행 없이 초기화된 복제본은 그 행을 빈 행으로 다시 나열하며, `value`는 빈 행을 생략하므로 복제본은 그 행이 없는 문서를 저장합니다.  
도메인이라면 그 도메인을 연결했던 컬럼과 용어도 그 복제본에서는 연결이 해제된 채로 남습니다. 복제본은 그 연결을 가진 적이 없고, 삭제를 되돌릴 때 연결은 전송되지 않기 때문입니다.

## InjectEngineContext

### toWidth

문자열의 너비를 픽셀 단위로 측정합니다.  
store에는 DOM이 없어 직접 텍스트를 측정할 수 없으므로, 이름, 데이터 타입, 기본값, 코멘트가 변경될 때마다 이 함수로 컬럼 너비를 다시 계산합니다.  
`4.2.0`부터는 테이블이나 컬럼의 [논리명](../../guide/guides/logical-names.md)도 여기에 포함됩니다.  
컬럼이 도메인을 연결하거나 연결을 해제할 때마다, 그리고 그 도메인이 추가되거나 이름이 바뀌거나 삭제될 때마다, 컬럼이 연결한 도메인의 이름을 표시하는 컬럼의 도메인 셀을 측정합니다.  
[setInitialValue](#setinitialvalue)로 문서를 불러올 때마다 모든 테이블과 컬럼도 다시 측정합니다.  
`4.0.0`부터 너비는 [runtimeValue](#runtimevalue-getter)에만 들어 있고 `value`에는 절대 들어가지 않습니다.  
따라서 이 릴리스에서 저장한 문서는 어디에서 저장했든, 그곳에서 텍스트가 어떻게 측정되었든 바이트 단위까지 같은 `value`로 다시 읽힙니다.

에디터와 동일한 방식으로 측정하세요. 에디터 폰트 스택의 `400 12px`로 측정한 값을 반올림하고 2px 패딩을 더합니다.  
그렇지 않으면 `runtimeValue`의 너비가 화면에 보이는 값과 어긋납니다.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10`은 canvas를 사용할 수 없을 때의 대체 값입니다.  
렌더링하지 않고 저장만 하는 문서를 다루는 store에는 이 정도로 충분합니다.

## ReplicationStore

### value getter

현재 에디터 상태를 직렬화합니다.  
파싱된 객체가 아니라 그대로 저장할 수 있는 JSON 문자열을 반환합니다.

```js
const data = replicationStore.value;
```

`4.0.0`부터 `value`는 저장 형태, 즉 파일에 담기는 형태의 문서이며, 엘리먼트의 [value](../erd-editor-element.md#value)가 반환하는 것과 같은 텍스트입니다.  
현재 있는 엔티티만 고정된 순서로 담으며, 삭제된 엔티티, 쌓임 순서, 그리고 [toWidth](#towidth)가 측정하는 너비처럼 불러올 때 다시 계산되는 정보는 담지 않습니다.  
`4.2.0`부터는 논리명, 각 이름이 사전에서 생성되었는지 여부, 도메인 연결, 그리고 [사전](../../guide/guides/dictionary.md) 탭의 단어, 용어, 도메인도 담습니다.  
또한 `4.2.0`부터는 엔티티의 비어 있는 텍스트 필드, 아무것도 담지 않은 `doc` 목록과 컬렉션, 그리고 모든 컬렉션이 비어 있을 때는 `collections` 자체를 생략합니다.  
공백 두 칸으로 들여쓰고, 사전의 각 행을 한 줄에 하나씩 기록하며, 줄바꿈으로 끝나므로, 같은 문서는 항상 같은 바이트가 됩니다.  
담기는 내용은 [저장 형태와 런타임 값](./schema.md#저장-형태와-런타임-값) 문서를 참고하세요.

[잠금](../../guide/guides/settings.md#잠금)이 켜진 설정은 잠근 시점의 값으로, 나머지 설정은 현재 상태 그대로 기록됩니다.  
`Viewport` 잠금은 화면 원점과 확대/축소 레벨을 함께 다루며, 탭, Code Generator 언어, 두 이름 케이스, 괄호 타입에는 각각 별도의 잠금이 있습니다.  
`4.2.0`부터는 [이름 표시](../../guide/guides/logical-names.md#name-view)에도 별도의 잠금이 있으며, 이 `Name View` 잠금은 새 문서에서 켜져 있습니다.  
잠금은 문서의 `ignoreSaveSettings`를 대체하며, `4.0.0`부터 이 필드는 읽지도 쓰지도 않습니다.  
`4.0.0` 이전의 `value`는 store가 가지고 있는 문서 전체였으며, 이 필드의 스크롤 비트와 확대/축소 비트가 적용되었습니다.

### runtimeValue getter

`4.0.0`부터 제공되며, 삭제된 엔티티와 불러올 때 계산되는 모든 정보를 포함해 복제본이 가지고 있는 그대로의 문서를 직렬화합니다.  
여기서도 잠긴 설정은 각각 잠긴 값으로 기록됩니다.

```js
const snapshot = replicationStore.runtimeValue;
```

나중에 참여하는 에디터나 다른 store를 `setInitialValue`로 초기화할 때 사용하세요. [공동 편집](./collaborative-editing.md) 문서를 참고하세요.  
파일로는 절대 저장하지 마세요. 삭제된 엔티티가 들어 있으며, 게시된 [JSON Schema](./schema.md#json-schema)도 이 값을 거부합니다.  
이 삭제된 엔티티 덕분에, 나중에 전달된 삭제 되돌리기가 이 값으로 초기화한 store에서 엔티티를 온전히 되살릴 수 있습니다.  
삭제된 엔티티는 파일에 담기는 형태에서 빠지므로, 다음에 파일에서 문서를 열 때까지만 남아 있습니다.

### setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다.

```js
replicationStore.setInitialValue('json...');
```

저장 형태, 런타임 값, 그리고 v2 문서를 포함해 이전 릴리스가 저장한 문서를 모두 받습니다.  
빈 문자열이나 문자열이 아닌 값을 전달하면 오류가 발생하지 않고 비어 있는 새 문서를 불러옵니다.  
값을 한 번도 전달받지 않은 store도 같은 새 문서로 시작합니다.  
`4.0.0`부터 이 문서는 모든 [잠금](../../guide/guides/settings.md#잠금)이 켜져 있으므로, 복제하는 에디터가 스크롤하거나 확대/축소하거나 탭을 전환하거나 이 설정들을 바꾸어도 `value`는 처음의 화면, 탭, Code Generator 언어, 이름 케이스, 괄호 타입을 유지합니다. `3.10.0`에서는 스크롤과 확대/축소를 모두 저장하지 않았고, 그 이전에는 둘 다 저장했습니다.  
`4.2.0`부터는 에디터들이 이름 표시를 전환하는 동안에도 자신의 이름 표시인 `Physical Names`를 유지합니다.  
저장된 문서는 그 안에 기록된 잠금을 유지합니다.  
v2 문서를 포함해 `4.0.0` 이전에 저장된 모든 문서처럼 잠금이 기록되지 않은 문서는 모든 잠금이 켜진 상태로 불러옵니다. 저장된 값에 상관없이 화면 원점은 `0, 0`, 확대/축소 레벨은 `1`, 탭은 ERD로 잠기며, Code Generator 언어, 이름 케이스, 괄호 타입은 저장된 값으로 잠깁니다.  
`4.2.0` 이전에 저장된 문서에는 `Name View` 잠금이 기록되어 있지 않으므로, 나머지 잠금을 모두 끈 채 저장된 문서라도 이 잠금이 켜지고 `Physical Names`인 상태로 불러옵니다.  
`4.0.0`부터 `setInitialValue`는 엘리먼트의 [setInitialValue](../erd-editor-element.md#setinitialvalue)와 마찬가지로 이전 문서에 대해 가지고 있던 협업 레지스터도 함께 버립니다.  
병합 충돌 표시가 남은 파일처럼 JSON이 아닌 텍스트도 오류를 발생시키지 않습니다. 파싱 오류는 콘솔에 기록될 뿐이며, 문서는 비워지고 설정은 그대로 유지됩니다.

`4.0.0`부터 불러오기는 가비지 컬렉션을 수행하지 않으므로, 삭제된 엔티티가 [runtimeValue](#runtimevalue-getter)에 남아 있습니다.  
이전에는 `doc`에 더 이상 나타나지 않으면서 4일 이상 변경되지 않은 엔티티를 제거했습니다.

불러오기의 재작성 작업은 `setInitialValue`가 반환되기 전에 완료됩니다. 각 컬럼의 옵션과 관계에서 다시 읽어 들이는 컬럼의 키 표시, `toWidth`로 다시 측정하는 모든 테이블과 컬럼의 너비, 각 연결선이 테이블과 만나는 지점, 각 관계의 식별 관계 여부와 부모 쪽 끝의 기호가 여기에 해당합니다.  
이 중 어느 것도 `value`에는 들어가지 않지만, 호출 직후 읽은 `replicationStore.runtimeValue`에는 이미 모두 들어 있습니다.  
다시 재생된 스크롤처럼 불러오기 직후에 도착한 액션은 불러온 문서를 기준으로 비교되므로, 불러오기 자체가 [`changed`](#onchange)로 보고되는 일은 없습니다.

불러오기와 이러한 재작성 작업은 어느 것도 `change`를 발행하지 않습니다.  
불러온 문서를 저장 형태로 다시 저장하려면 `setInitialValue`가 반환된 뒤 직접 `replicationStore.value`를 읽으세요.

### on@change

에디터의 상태 변경 이벤트를 구독합니다.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change`는 200ms 디바운스되므로, 연속된 액션은 하나의 알림으로 전달됩니다.  
문서를 변경할 수 있는 종류의 액션과, 이전 에디터가 아직 보낼 수 있는 `settings.changeIgnoreSaveSettings`에만 발생합니다([dispatch, dispatchSync](#dispatch-dispatchsync) 항목 참고).  
중계된 presence 액션이나 `editor.mergeLWW`는 이벤트를 발생시키지 않습니다.  
구독을 해제하려면 반환된 함수를 호출하세요.

`3.10.0`부터 리스너는 `@dineug/erd-editor/engine.js`가 `ReplicationStore`와 함께 export하는 타입인 `ReplicationChange`를 전달받습니다.  
`3.10.0` 이전에는 아무것도 전달받지 않았으며, 인자를 무시하는 리스너는 그대로 동작합니다.  
`value`는 저장 형태로 직렬화된 문서로, 그 시점에 `replicationStore.value`가 반환하는 문자열과 같으므로 다시 직렬화할 필요가 없습니다.  
`changed`는 이전 `change` 이후, 또는 불러온 이후의 액션이 `value`를 바이트 단위까지 그대로 두었을 때 `false`입니다.

[잠금](../../guide/guides/settings.md#잠금) 때문에 `value`에 반영되지 않는 변경도 `change`를 발생시키며, 이때 `changed`는 `false`이므로 `changed`가 `true`일 때만 저장하세요.  
`Viewport`가 잠긴 동안의 스크롤이나 확대/축소, `Canvas Type`이 잠긴 동안의 탭 전환, 그리고 각각의 잠금이 켜진 동안의 Code Generator 언어, 이름 케이스, 괄호 타입 변경이 여기에 해당합니다.  
`4.2.0`부터는 `Name View`가 잠긴 동안의 이름 표시 전환도 여기에 해당합니다. 에디터는 이 전환을 여전히 보내지만, 다른 에디터와 마찬가지로 복제본도 이를 버립니다.  
읽기 전용 에디터에서 한 이름 표시 전환도 잠금과 상관없이 같은 방식으로 버려집니다.  
엘리먼트의 [change](../erd-editor-element.md#change) 이벤트는 이런 변경을 제외하지만, 복제본은 여전히 보고합니다.  
새 문서와 `4.0.0` 이전에 저장된 문서에서는 모든 잠금이 켜져 있으며, `4.2.0` 이전에 저장된 모든 문서에서는 `Name View`가 잠겨 있습니다.  
`Viewport`의 잠금이 꺼져 있으면 스크롤이나 확대/축소가 `value`를 바꾸고, `Canvas Type`의 잠금이 꺼져 있으면 에디터의 다른 탭을 여는 것도, `Name View`의 잠금이 꺼져 있으면 읽기 전용이 아닌 에디터의 이름 표시 전환도 `value`를 바꿉니다.  
잠금을 켜거나 끄는 것도 `value`를 바꿉니다.

`4.0.0`부터 `changed`는 삭제된 엔티티도 쌓임 순서도 담지 않는 저장 형태를 비교합니다.  
따라서 한 번의 `change` 안에서 추가되었다가 다시 삭제된 테이블, 다른 공동 편집자가 삭제한 엔티티에 적용된 편집, 쌓임 순서만 바꾸는 중계된 불러오기도 모두 `changed`가 `false`로 전달됩니다.  
`4.2.0`부터는 사전 시트에 추가된 뒤 비어 있는 채로 남은 행도 마찬가지입니다. 저장 형태는 아무것도 담지 않은 행을 생략하기 때문입니다.

`changed`는 저장된 파일과 비교하지 않습니다. 저장된 파일은 불러오자마자 `value`와 달라질 수 있으며, v2 파일을 포함해 이전 릴리스가 저장한 파일이 그렇고, 바이트 순서 표시(BOM)로 시작하는 파일과 직접 편집한 파일도 그렇습니다.  
`4.2.0`부터는 `4.0.0`이나 `4.1.0`이 저장한 파일도 여기에 포함됩니다. 그런 파일에 들어 있는 엔티티의 비어 있는 텍스트 필드와 빈 `doc` 목록, 빈 컬렉션을 `value`가 생략하기 때문입니다.  
이런 파일과 바이트 단위로 비교하면 잠금 때문에 반영되지 않는 스크롤까지 편집으로 간주하게 됩니다.  
`changed`가 `true`인 첫 `change`는 이런 파일을 저장 형태로 넘겨주므로, 이를 저장하면 파일이 한 번 다시 작성됩니다.  
[toWidth](#towidth)에서 설명한 것처럼, 이 릴리스에서 저장한 파일은 어디에서 저장했든 달라지지 않습니다.  
`change`가 아직 대기 중일 때 `setInitialValue`가 실행되고 그 `change`가 발생할 시점까지 아무것도 dispatch되지 않으면, 그 `change`는 그대로 발생하며 불러온 `value`와 `false`인 `changed`를 전달합니다.

### dispatch, dispatchSync

원격 에디터 변경 사항을 replicationStore에 반영합니다.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch`는 마이크로태스크로 지연 실행하고, `dispatchSync`는 묶음을 즉시 반영합니다.

shared store의 스트림을 필터링 없이 그대로 전달해도 됩니다.  
두 메서드 모두 문서를 변경할 수 있는 종류의 액션과 이 항목 끝에서 설명하는 두 액션만 남기고 나머지는 버리므로, 공동 편집 세션이 전달하는 presence 정보(각 사용자의 마우스 커서, 포커스, 선택 영역, 드래그 박스)는 아무 동작 없이 통과합니다.

`3.10.0`부터 남기는 액션에 `relationship.changeOnDelete`와 `relationship.changeOnUpdate`가 포함되며, `relationship.add`는 `onDelete`와 `onUpdate`를 함께 전달합니다.  
이전 릴리스의 store는 이 액션을 버리고 이 필드를 무시하므로, 관계의 [ON DELETE와 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete와-on-update) 동작을 잃습니다.

`4.0.0`부터 남기는 액션에 `table.changeGroup`, 8개의 `tableGroup` 액션 중 쌓임 순서를 바꾸는 `tableGroup.changeZIndex`를 제외한 7개(`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor`), `relationship.changeColumns`, `settings.changeLockSettings`, `settings.changeDDLScript`도 포함됩니다.  
`settings.changeRelationshipOptimization`은 더 이상 존재하지 않으므로 두 메서드 모두 이 액션을 버립니다.  
이전 릴리스의 store는 새 액션을 버리므로 [테이블 그룹](../../guide/guides/table-groups.md), [잠금](../../guide/guides/settings.md#잠금), [Schema SQL](../../guide/guides/schema-sql.md) 스크립트, 그리고 [컬럼 매핑](../../guide/guides/relationship-editing.md#컬럼-매핑)이 이미 있는 관계에 지정하는 컬럼을 잃습니다.  
복제본은 에디터와 같은 릴리스나 그보다 새로운 릴리스에서 실행하세요.

`4.1.0`은 새 액션 타입을 추가하지 않고 `@dineug/erd-editor/engine.js`도 그대로 두므로, `4.0.0` 복제본도 `4.1.0` 복제본과 마찬가지로 `4.1.0` 에디터가 보내는 변경 사항을 모두 남깁니다.  
`4.1.0`부터 [찾기와 바꾸기](../../guide/guides/find-and-replace.md#바꾸기)의 `Replace`와 `Replace All`은 `4.0.0` 복제본이 이미 남기는 `index.changeName`과 `tableGroup.changeName` 액션으로 인덱스와 테이블 그룹의 이름도 바꿉니다.  
[탐색기](../../guide/guides/explorer.md) 자체의 상태는 전송되지 않으며, 탐색기가 일으키는 탭 전환이나 스크롤은 다른 탭 전환이나 스크롤과 똑같이 전달됩니다. [공동 편집](./collaborative-editing.md) 문서를 참고하세요.

`4.2.0`부터 남기는 액션에 `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode`, 그리고 [사전](../../guide/guides/dictionary.md) 시트의 모든 편집, 정렬, CSV 가져오기를 전달하는 `dictionary.add`, `dictionary.update`, `dictionary.remove`도 포함됩니다.  
이름 표시 전환 중에서 복제본은 `Name View`의 잠금이 해제된 동안 읽기 전용이 아닌 에디터가 한 전환만 반영하고 나머지는 버립니다([on@change](#onchange) 항목 참고).  
이전 릴리스의 store는 이 액션을 모두 버리므로 [논리명](../../guide/guides/logical-names.md), 도메인 연결, 각 이름이 사전에서 생성되었는지 여부, 단어, 용어, 도메인, 그리고 이름 표시를 잃습니다.  
세션에 있는 `4.2.0` 이전의 에디터는 여전히 `4.2.0` 복제본에서 이 중 일부를 없앨 수 있습니다.  
그 에디터에서 한 Schema SQL, GraphQL, DBML, AML `Import`는 복제본의 단어, 용어, 도메인을 비웁니다. `Import and Add`는 비우지 않습니다.  
그 에디터에서 불러오기, `Import`, `clear()`를 되돌리면 그 에디터 자신이 가진 문서 사본을 논리명, 도메인 연결, 사전 없이 복제본에 불러옵니다. [릴리스 혼용](./collaborative-editing.md#릴리스-혼용) 문서를 참고하세요.  
`@dineug/erd-editor/engine.js`는 이전과 같은 `createReplicationStore`, `ReplicationStore`, `ReplicationChange`를 export하며, `createReplicationStore`는 같은 컨텍스트를 받습니다.

`4.0.0`부터 두 메서드는 `editor.mergeLWW`도 반영합니다. 이 액션은 다른 에디터가 세션에 참여할 때 에디터가 응답으로 보내는 협업 레지스터를 담고 있으므로, 복제본도 에디터와 같은 방식으로 동시 편집의 결과를 결정합니다.  
`value`의 바이트를 하나도 바꾸지 않으며 `change`도 발생시키지 않습니다.  
`4.0.0` 이전에 릴리스된 에디터가 아직 보낼 수 있는 `settings.changeIgnoreSaveSettings`는 남기지만 아무것도 바꾸지 않습니다. 이 액션은 `changed`가 `false`인 `change`를 발생시킵니다.

### destroy

replicationStore 인스턴스를 완전히 파괴합니다.

```js
replicationStore.destroy();
```

이후에는 `change`를 발행하지 않고 이어지는 dispatch도 무시합니다.  
오류가 발생하는 대신 문서가 마지막 값으로 고정됩니다.  
다시 시작하려면 새 store를 생성하세요.
