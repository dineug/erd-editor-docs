---
sidebar_position: 2
---

# 원격 저장

에디터의 변경사항이 있을때 마다 전체 상태를 전송하는건 비효율적입니다.  
실시간 데이터 복제 API를 지원합니다.

## 설치

```sh
npm install @dineug/erd-editor
```

## 사용

```ts
type ReplicationStore = {
  readonly value: string;
  on: (reducers: Partial<{ change: () => void }>) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type EngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (context: EngineContext) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## EngineContext

### toWidth

텍스트의 width를 계산하는데 사용합니다.

```js
const toWidth = text => text.length * 10;
const replicationStore = createReplicationStore({ toWidth });
```

## ReplicationStore

### value getter

현재 에디터 상태를 json 데이터로 받아옵니다.

```js
const data = replicationStore.value;
```

### setInitialValue

이전에 저장했던 에디터 상태를 불러옵니다.

```js
replicationStore.setInitialValue('json...');
```

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

### dispatch, dispatchSync

원격 에디터 변경사항을 replicationStore에 반영합니다.

```js
replicationStore.dispatch(actions...); // async
replicationStore.dispatchSync(actions...); // sync
```

### destroy

replicationStore 인스턴스를 완전히 파괴합니다.

```js
replicationStore.destroy();
```
