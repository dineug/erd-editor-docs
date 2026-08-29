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
  on: (listeners: Partial<{ change: () => void }>) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
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
  change: () => save(replicationStore.value),
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

경계를 넘어가는 것은 변경사항뿐이며 문서 전체는 전송되지 않습니다.  
복제본이 변경사항을 반영하고 결과를 자체적으로 직렬화하며, `change`로 저장할 시점을 알 수 있습니다.

## InjectEngineContext

### toWidth

문자열의 너비를 픽셀 단위로 측정합니다.  
store에는 DOM이 없어 직접 텍스트를 측정할 수 없으므로, 이름, 데이터 타입, 기본값, 코멘트가 변경될 때마다 이 함수로 컬럼 너비를 다시 계산합니다.

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
scroll 비트가 설정되어 있으면 스크롤 위치가 `0`으로, zoom 비트가 설정되어 있으면 확대/축소 레벨이 `1`로 기록됩니다.  
해당 비트는 [Schema](./schema.md) 문서를 참고하세요.

### setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다.

```js
replicationStore.setInitialValue('json...');
```

빈 문자열이나 문자열이 아닌 값을 전달하면 오류가 발생하지 않고 빈 문서를 불러옵니다.

불러오기는 문서에 대한 가비지 컬렉션도 함께 수행합니다.  
`doc`에 더 이상 나타나지 않으면서 4일 이상 변경되지 않은 엔티티를 제거하므로, 공동 편집자가 작업 중인 변경사항은 수집되지 않습니다.  
이 작업은 비동기로 완료됩니다.

불러오기와 가비지 컬렉션 모두 `change`를 발행하지 않습니다.  
수집된 문서를 다시 저장하려면 불러온 뒤 직접 `replicationStore.value`를 읽으세요.

### on@change

에디터의 상태변경 이벤트를 구독합니다.

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

`change`는 200ms 디바운스되며, 연속된 액션은 하나의 알림으로 전달됩니다.  
문서를 변경하는 액션에만 발생하므로 중계된 presence 액션은 이벤트를 발생시키지 않습니다.  
구독을 해제하려면 반환된 함수를 호출하세요.

### dispatch, dispatchSync

원격 에디터 변경사항을 replicationStore에 반영합니다.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch`는 마이크로태스크로 지연 실행하고, `dispatchSync`는 배치를 즉시 반영합니다.

shared store의 스트림을 필터링 없이 그대로 전달해도 됩니다.  
두 메서드 모두 문서를 변경하는 액션만 남기고 나머지는 버리므로, 공동 편집 세션이 전달하는 presence 정보(각 사용자의 마우스 커서, 포커스, 선택 영역, 드래그 박스)는 아무 동작 없이 통과합니다.

### destroy

replicationStore 인스턴스를 완전히 파괴합니다.

```js
replicationStore.destroy();
```

이후에는 `change`를 발행하지 않고 이어지는 dispatch도 무시합니다.  
오류가 발생하는 대신 문서가 마지막 값으로 고정됩니다.  
다시 시작하려면 새 store를 생성하세요.
