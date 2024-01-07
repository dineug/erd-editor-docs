---
sidebar_position: 1
---

# 공동 편집

실시간 공동 편집 API를 지원합니다.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (config?: SharedStoreConfig) => SharedStore;
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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

## 간단한 미러링 예시

```js
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

## SharedStoreConfig

### getNickname

표시할 사용자 nickname을 설정합니다.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

## SharedStore

### connection, disconnect

현재 연결 상태를 알려줍니다.  
`disconnect`가 되었을때 내부에서 발생한 변경사항을 버퍼링에 저장합니다.  
전송 가능한 상태가 되었을때 이벤트를 발행합니다.  
기본 상태는 `connection`입니다.

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

다른 에디터 변경사항을 현재 에디터 인스턴스에 반영합니다.

```js
sharedStore.dispatch(actions...); // async
sharedStore.dispatchSync(actions...); // sync
```

### subscribe

에디터의 변경사항을 구독합니다.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

sharedStore 인스턴스를 완전히 파괴합니다.

```js
sharedStore.destroy();
```
