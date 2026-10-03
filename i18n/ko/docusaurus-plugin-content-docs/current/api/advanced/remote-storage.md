---
sidebar_position: 2
description: 메인 스레드 밖 복제 store로 실행 중인 에디터 복제, 저장을 위한 문서 직렬화.
---

# 원격 저장

에디터에 변경사항이 있을 때마다 전체 상태를 전송하는 건 비효율적입니다.  
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
replicationStore.setInitialValue(savedJson);

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

경계를 넘어가는 것은 변경사항뿐이며 문서 전체는 전송되지 않습니다.  
복제본이 변경사항을 반영하고 결과를 자체적으로 직렬화합니다.  
`change`는 그 결과를 `value`로 전달하며, `changed`로 저장할 시점을 알 수 있습니다.

## InjectEngineContext

### toWidth

문자열의 너비를 픽셀 단위로 측정합니다.  
store에는 DOM이 없어 직접 텍스트를 측정할 수 없으므로, 이름, 데이터 타입, 기본값, 코멘트가 변경될 때마다 이 함수로 컬럼 너비를 다시 계산합니다.  
[setInitialValue](#setinitialvalue)로 문서를 불러올 때마다 모든 테이블과 컬럼도 다시 측정합니다.  
따라서 다른 기기나 다른 릴리스처럼 텍스트가 다르게 측정되는 곳에서 저장한 문서는 이 store의 너비로 다시 읽히며, 아무것도 편집하기 전부터 `value`가 저장된 텍스트와 달라집니다.  
그래서 [on@change](#onchange)는 `changed`를 파일이 아니라 불러온 시점을 기준으로 판단합니다.

에디터와 동일한 방식으로 측정하세요. 에디터 폰트 스택의 `400 12px`로 측정한 값을 반올림하고 2px 패딩을 더합니다.  
그렇지 않으면 복제된 컬럼 너비가 화면에 보이는 값과 어긋납니다.

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
    // 사용할 수 있는 canvas가 없음
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

직렬화할 때 문서의 `ignoreSaveSettings`가 적용됩니다.  
scroll 비트가 설정되어 있으면 화면 원점이 `0, 0`으로, zoom 비트가 설정되어 있으면 확대/축소 레벨이 `1`로 기록됩니다.  
해당 비트는 [Schema](./schema.md) 문서를 참고하세요.

### setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다.

```js
replicationStore.setInitialValue('json...');
```

빈 문자열이나 문자열이 아닌 값을 전달하면 오류가 발생하지 않고 비어 있는 새 문서를 불러옵니다.  
값을 한 번도 전달받지 않은 store도 같은 새 문서로 시작합니다.  
`3.10.0`부터 이 문서는 스크롤과 확대/축소를 모두 저장하지 않습니다. [`Save Scroll Information`](../../guide/guides/settings.md#스크롤-정보-저장)과 [`Save Zoom Information`](../../guide/guides/settings.md#확대축소-정보-저장)을 끈 것처럼 `ignoreSaveSettings`의 두 비트가 모두 설정되어 있습니다. `3.10.0` 이전에는 둘 다 저장했습니다.  
저장된 문서는 그 안에 기록된 스위치 값을 유지하며, 스위치가 기록되지 않은 문서는 v2 문서를 포함해 둘 다 저장합니다.  
병합 충돌 표시가 남은 파일처럼 JSON이 아닌 텍스트도 오류를 발생시키지 않습니다. 파싱 오류는 콘솔에 기록될 뿐이며, 문서는 비워지고 설정은 그대로 유지됩니다.

불러오기는 문서에 대한 가비지 컬렉션도 함께 수행합니다.  
`doc`에 더 이상 나타나지 않으면서 4일 이상 변경되지 않은 엔티티를 제거하므로, 공동 편집자가 작업 중인 변경사항은 수집되지 않습니다.  
`3.10.0`부터 이 작업은 `setInitialValue`가 반환되기 전에 완료됩니다.  
`3.10.0` 이전에는 이후 몇 밀리초에 걸쳐 실행되던 불러오기의 다른 재작성 작업도 마찬가지입니다. 관계에서 다시 읽어 들이는 컬럼의 foreign key 표시, `toWidth`로 다시 측정하는 모든 테이블과 컬럼의 너비, 각 연결선이 테이블과 만나는 지점, 각 관계의 식별 관계 여부와 부모 쪽 끝의 기호가 여기에 해당합니다.  
따라서 호출 직후 읽은 `replicationStore.value`는 이미 가비지 컬렉션과 재작성이 모두 끝난 문서입니다. 다시 재생된 스크롤처럼 불러오기 직후에 도착한 액션은 이 문서를 기준으로 비교되므로, 불러오기 자체의 재작성이 [`changed`](#onchange)로 보고되는 일은 없습니다.

불러오기와 이러한 재작성 작업은 어느 것도 `change`를 발행하지 않습니다.  
이 문서를 다시 저장하려면 `setInitialValue`가 반환된 뒤 직접 `replicationStore.value`를 읽으세요.

### on@change

에디터의 상태변경 이벤트를 구독합니다.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change`는 200ms 디바운스되며, 연속된 액션은 하나의 알림으로 전달됩니다.  
문서를 변경할 수 있는 종류의 액션에만 발생하므로 중계된 presence 액션은 이벤트를 발생시키지 않습니다.  
구독을 해제하려면 반환된 함수를 호출하세요.

`3.10.0`부터 리스너는 `@dineug/erd-editor/engine.js`가 `ReplicationStore`와 함께 export하는 타입인 `ReplicationChange`를 전달받습니다.  
`3.10.0` 이전에는 아무것도 전달받지 않았으며, 인자를 무시하는 리스너는 그대로 동작합니다.  
`value`는 직렬화된 문서로, 그 시점에 `replicationStore.value`가 반환하는 문자열과 같으므로 다시 직렬화할 필요가 없습니다.  
`changed`는 이전 `change` 이후, 또는 불러온 이후의 액션이 `value`를 바이트 단위까지 그대로 두었을 때 `false`입니다.

문서의 저장 스위치 때문에 `value`에 반영되지 않는 스크롤이나 확대/축소도 `change`를 발생시키며, 이때 `changed`는 `false`이므로 `changed`가 `true`일 때만 저장하세요.  
`Save Scroll Information`이 꺼져 있으면 스크롤은 아무것도 바꾸지 않습니다.  
확대/축소는 화면 원점도 함께 이동시키므로, `Save Zoom Information`과 `Save Scroll Information`이 모두 꺼져 있을 때만 아무것도 바꾸지 않습니다. `Save Zoom Information`만 꺼져 있으면 여전히 `value`가 바뀝니다.  
에디터의 다른 탭을 여는 것은 어느 스위치에도 해당하지 않으므로 항상 `value`를 바꿉니다.

`changed`는 저장된 파일과 비교하지 않습니다. 저장된 파일은 불러오자마자 `value`와 달라질 수 있으며, [toWidth](#towidth)에서 설명한 것처럼 텍스트가 다르게 측정되는 곳에서 저장한 파일이 그렇고, 화면 원점이 없는 파일도 모두 그렇습니다.  
파일과 바이트 단위로 비교하면 스위치 때문에 반영되지 않는 스크롤까지 편집으로 간주하게 됩니다.  
`change`가 아직 대기 중일 때 `setInitialValue`가 실행되고 그 `change`가 발생할 시점까지 아무것도 dispatch되지 않으면, 그 `change`는 그대로 발생하며 불러온 `value`와 `false`인 `changed`를 전달합니다.

### dispatch, dispatchSync

원격 에디터 변경사항을 replicationStore에 반영합니다.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch`는 마이크로태스크로 지연 실행하고, `dispatchSync`는 배치를 즉시 반영합니다.

shared store의 스트림을 필터링 없이 그대로 전달해도 됩니다.  
두 메서드 모두 문서를 변경할 수 있는 종류의 액션만 남기고 나머지는 버리므로, 공동 편집 세션이 전달하는 presence 정보(각 사용자의 마우스 커서, 포커스, 선택 영역, 드래그 박스)는 아무 동작 없이 통과합니다.

`3.10.0`부터 남기는 액션에 `relationship.changeOnDelete`와 `relationship.changeOnUpdate`가 포함되며, `relationship.add`는 `onDelete`와 `onUpdate`를 함께 전달합니다.  
이전 릴리스의 store는 이 액션을 버리고 이 필드를 무시하므로, 관계의 [ON DELETE와 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete와-on-update) 동작을 잃습니다.  
복제본은 에디터와 같은 릴리스나 그보다 새로운 릴리스에서 실행하세요.

### destroy

replicationStore 인스턴스를 완전히 파괴합니다.

```js
replicationStore.destroy();
```

이후에는 `change`를 발행하지 않고 이어지는 dispatch도 무시합니다.  
오류가 발생하는 대신 문서가 마지막 값으로 고정됩니다.  
다시 시작하려면 새 store를 생성하세요.
