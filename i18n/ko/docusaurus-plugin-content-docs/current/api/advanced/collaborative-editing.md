---
sidebar_position: 1
description: getSharedStore로 에디터 간 변경사항 중계, 참여자별 커서, 포커스, 선택과 드래그 박스 표시.
---

# 공동 편집

`getSharedStore()`는 에디터를 공동 편집 세션의 노드로 만듭니다.  
모든 변경사항을 액션 스트림으로 발행하고 다른 에디터가 보내온 액션을 반영하며, 둘 사이를 잇는 전송 수단(WebSocket, WebRTC, JSON을 전달할 수 있는 그 밖의 무엇이든)은 직접 준비합니다.  
[ErdEditorElement](../erd-editor-element.md)의 메서드 중 하나이며, 중계한 변경사항을 저장까지 해야 한다면 [원격 저장](./remote-storage.md)과 함께 사용합니다.

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

액션은 문서의 변경 하나를 기술하는 직렬화 가능한 평범한 객체이므로, 전송 수단으로 전달되는 과정에서 `JSON.stringify`를 그대로 통과합니다.  
액션은 묶음으로 도착합니다. `subscribe`는 배열을 넘겨주고 그 배열이 하나의 단위이므로, 통째로 중계하고 반대쪽에서도 통째로 dispatch합니다.  
액션이 담고 있는 내부 정보가 에디터 사이의 동기화를 유지하므로, 액션을 읽거나 고치지 말고 불투명한 값으로 두고 그대로 전달합니다.

Visualization 탭의 [Flow 모드](../../guide/guides/visualization.md#flow는-문서를-편집하지-않음)에서 하는 어떤 동작도 문서 변경이 아니므로, Flow에 있는 에디터는 다른 에디터에 변경사항을 보내지 않고, 그동안에도 다른 에디터가 보낸 변경사항은 계속 반영됩니다.  
유일한 예외는 ERD 탭으로 돌아가는 외부 링크 카드 버튼입니다. 이 버튼의 탭 전환과 스크롤은 다른 변경사항과 똑같이 전송됩니다.

## 한 페이지의 두 에디터

여기서는 subscribe에서 dispatch로 이어지는 연결이 네트워크를 대신하므로, 전송 수단 없이 세션의 구조를 확인할 수 있습니다.

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

다른 에디터에서 이 사용자의 마우스 커서 옆에 표시할 nickname을 설정합니다.  
nickname이 없거나 비어 있으면 다른 사용자에게 `user`로 표시됩니다.

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
포커스한 테이블과 셀, 선택한 테이블과 메모, 캔버스에서 드래그한 박스가 다른 에디터로 전송되어 그곳에 그려집니다.  
사용자마다 고유한 색상이 지정되어 서로 구분할 수 있습니다. 포커스한 테이블에는 외곽선, 포커스한 셀에는 밑줄, 선택한 테이블과 메모에는 테두리, 드래그 박스에는 점선 사각형이 표시됩니다.  
다른 사용자에게서 도착한 정보는 이 옵션을 켜든 끄든 항상 캔버스에 그려집니다.  
Visualization 탭의 Flow 모드에서는 다른 사용자의 포커스와 선택이 테이블 카드에 그려지지만 드래그 박스는 그려지지 않습니다. 그곳에서 선택한 테이블은 그대로 전송되지만, 그곳에서 드래그한 박스는 전송되지 않습니다.

```js
editor.getSharedStore({ focusTracker: false });
```

두 트래커를 모두 끄면 자체 정보는 전혀 발행하지 않는 단순한 중계자로 shared store를 사용할 수 있습니다.  
다른 에디터가 보낸 정보는 그대로 수신되어 그려집니다.  
VSCode와 IntelliJ 에디터가 이렇게 동작합니다.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

커서, 포커스, 선택, 드래그 박스는 문서 변경사항과 같은 스트림으로 전달되지만 일시적인 정보입니다.  
문서나 Undo 히스토리, `editor.value`에는 전혀 들어가지 않으므로, 전송 수단이 이를 버려도 되고 replicationStore도 무시합니다.

## SharedStore

### connection, disconnect

연결 상태를 설정하는 메서드입니다.  
`disconnect` 상태에서는 변경사항을 내부 버퍼에 저장합니다.  
전송 가능한 상태가 되면 버퍼에 쌓인 변경사항을 구독자에게 발행합니다.  
기본 상태는 연결됨(`connection`)입니다.

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

다른 에디터 인스턴스의 변경사항을 현재 에디터 인스턴스에 반영합니다.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

에디터의 변경사항을 구독합니다.  
구독자가 하나도 없으면 에디터 밖으로 아무것도 나가지 않으며, 그 전에 발생한 변경사항은 버퍼에 쌓입니다.  
첫 subscribe는 다른 에디터에 현재 상태를 요청하므로, 늦게 참여해도 최신 상태를 따라잡습니다.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

sharedStore 인스턴스를 완전히 파괴합니다.  
에디터 자체는 그대로 두므로 세션에서 나가더라도 문서는 계속 편집할 수 있습니다.  
에디터가 발급한 마지막 sharedStore가 파괴되면 마우스와 포커스 트래커가 멈춥니다.

```js
sharedStore.destroy();
```
