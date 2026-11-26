---
sidebar_position: 2
description: "@dineug/erd-editor-yjs로 Y.Doc을 통해 <erd-editor> 엘리먼트나 헤드리스 피어 store 동기화, 룸 시드, Awareness를 통한 프레즌스 표시, 오프라인에서 계속 편집, 압축 사이드카로 룸의 히스토리 접기."
---

# Yjs

`@dineug/erd-editor-yjs`는 [Yjs](https://github.com/yjs/yjs)의 `Y.Doc`을 통해 다이어그램을 동기화합니다. 독립된 패키지이며, `@dineug/erd-editor` `5.1.0`과 함께 `0.1.0`으로 처음 릴리스되었습니다.  
`bindErdEditor`는 `<erd-editor>` 엘리먼트를, `bindPeerStore`는 `@dineug/erd-editor/peer.js`의 헤드리스 피어 store를 `Y.Doc`에 바인딩합니다.  
`Y.Doc`을 전달하는 프로바이더가 다이어그램도 전달합니다. websocket 서버, WebRTC, IndexedDB, 직접 만든 프로바이더 모두 가능합니다. 프로바이더와 `Y.Doc`은 사용자의 것으로 남으며, 바인딩은 이들을 연결하지도, 끊지도, 정리하지도 않습니다.

편집은 에디터 고유의 액션 묶음으로 전달되며, 바인딩은 store가 보낸 그대로 보관합니다.  
따라서 에디터의 협업 레지스터는 `getSharedStore`로 연결한 세션과 같은 방식으로 같은 순간에 한 편집의 결과를 결정하며, 색상 변경 같은 예외도 같습니다. [동시 편집](./collaborative-editing.md#concurrent-edits) 항목을 참고하세요.  
커서, 포커스, 선택, 드래그 박스는 프로바이더의 Awareness를 통해 전달됩니다. [프레즌스](#presence) 항목을 참고하세요.  
shared store를 전송 수단에 직접 연결하는 방식과 비교하면, 바인딩이 더해 주는 기능은 다음과 같습니다.

- 참여하는 클라이언트는 실행 중인 에디터에서 [runtimeValue](../erd-editor-element.md#runtimevalue)를 넘겨받지 않고도 룸이 담고 있는 다이어그램을 엽니다.
- 연결이 끊긴 클라이언트도 계속 편집할 수 있으며, 그 편집은 다시 연결될 때 반영됩니다. [오프라인 편집과 재참여](#offline-edits-and-rejoins) 항목을 참고하세요.
- 영속화 프로바이더가 돌려주는 `Y.Doc`은 그 안에 담긴 다이어그램을 엽니다. [룸이 담고 있는 것](#what-the-room-holds) 항목을 참고하세요.
- 선택 사항인 Node 사이드카가 룸의 히스토리를 하나의 스냅샷으로 접습니다. [룸 압축](#compacting-a-room) 항목을 참고하세요.

바인딩에는 `5.1.0`에서 shared store와 피어 store에 추가된 다섯 가지 메서드, 즉 [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer), [reseed](./collaborative-editing.md#reseed)가 필요하며, 이들의 호출은 모두 바인딩이 직접 처리합니다.

## 설치 {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs`, `y-protocols`는 peer 의존성이므로 한 페이지에는 각각 하나의 복사본만 존재합니다. 필요한 버전은 `5.x` 안에서 `5.1.0` 이상의 `@dineug/erd-editor`, `13.x` 안에서 `13.6` 이상의 `yjs`, `1.x` 안에서 `1.0` 이상의 `y-protocols`입니다.  
이 패키지는 이들의 타입만 가져오고 사용자가 넘긴 `Y.Doc`과 `Awareness`에서 동작하므로, 자체적으로 Yjs, y-protocols, 에디터 코드를 로드하지 않습니다.  
한 페이지에 Yjs 복사본이 둘이면 서로의 생성자 검사를 깨뜨리고, 두 번째 복사본은 `Yjs was already imported`를 기록합니다. 사용자의 코드와 프로바이더가 `yjs`를 서로 다른 위치에서 해석한다면 번들러에서 중복을 제거하세요(Vite: `resolve.dedupe: ['yjs']`).

이 패키지는 ESM 전용(`"type": "module"`)이며 진입점은 패키지 루트 하나입니다. 부수 효과가 없다고 표시되어 있으므로 `bindErdEditor`만 import하는 번들에서는 압축기가 빠집니다.  
`bindErdEditor`는 정의된 `<erd-editor>` 엘리먼트를 바인딩하므로 DOM이 필요합니다. `bindPeerStore`는 [압축 사이드카](#compacting-a-room)처럼 Node.js 22.12 이상의 순수 Node에서도 실행됩니다.

## 사용법 {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com`과 `my-diagram`은 사용자의 서버와 룸을 나타냅니다.  
y-websocket의 `sync` 이벤트가 `true`로 알려 주듯이, 프로바이더가 동기화된 뒤에만 바인딩하고 시드하세요. 그보다 일찍 시드하면 룸의 다이어그램이 교체될 수 있습니다. [룸 시드](#seeding-a-room) 항목을 참고하세요.

바인딩 시점에 `Y.Doc`이 룸의 스냅샷을 담고 있으면 바인딩은 그 스냅샷을 곧바로 엘리먼트에 엽니다. [reseed](./collaborative-editing.md#reseed)처럼 레지스터와 버전이 포함된 스냅샷을 로드하고, 이후 로그에 기록된 편집을 모두 적용합니다.  
이렇게 열 때는 재참여 때와 같은 것을 비우고 닫으며([오프라인 편집과 재참여](#offline-edits-and-rejoins) 항목을 참고하세요), 엘리먼트는 스냅샷이 정한 위치에서 열립니다. 이 첫 번째 열기에서는 `rejoin`이 발생하지 않습니다.  
룸이 비어 있거나 프로바이더가 아직 동기화되기 전처럼 `Y.Doc`에 스냅샷이 없으면 엘리먼트는 자신의 문서를 유지하고, 스냅샷이 나타날 때까지(자신의 [seed](#seed)이든 다른 클라이언트의 것이든) 바인딩은 룸에 아무것도 기록하지 않습니다.

`bindErdEditor`는 [getSharedStore](../erd-editor-element.md#getsharedstore)로 엘리먼트에서 shared store 하나를 가져가며, [destroy](#destroy)를 호출하면 그것을 놓아줍니다.  
엘리먼트는 이미 `<erd-editor>`여야 하며, 진입점을 import했거나 `defineErdEditor()`를 호출한 상태여야 합니다. [엘리먼트 등록](../installation.md#registering-the-elements) 항목을 참고하세요. 태그가 정의되기 전의 `<erd-editor>`는 일반 `HTMLElement`이며, 태그가 정의되고 엘리먼트가 문서에 있게 되면 브라우저가 업그레이드합니다. 아직 업그레이드되지 않은 엘리먼트에 대해서는 `bindErdEditor`가 `error`를 발생시키지 않고 `TypeError`를 던집니다.

룸의 편집은 공동 편집자의 편집처럼 엘리먼트에 적용되고 [change](../erd-editor-element.md#change)를 발생시키며, 스냅샷이 열린 뒤 다시 재생되는 편집도 마찬가지입니다.  
바인딩 시점이든 재참여 때든 스냅샷을 여는 일은 Undo 항목을 만들지 않고, `change`를 발생시키지 않으며, 룸에 아무것도 기록하지 않습니다. 다만 [오프라인 편집과 재참여](#offline-edits-and-rejoins)에서 설명하는, 논리명에서 물리명을 생성하는 동작은 예외입니다.  
시드된 룸에 다른 문서를 불러오려면 모든 클라이언트가 적용하는 변경을 만드세요. [value](../erd-editor-element.md#value)를 할당하거나, [clear](../erd-editor-element.md#clear)를 호출하거나, 문서를 가져오면 됩니다.  
[setInitialValue](../erd-editor-element.md#setinitialvalue)는 shared store가 보내지 않으므로 룸에 기록되지 않습니다. 그래서 해당 엘리먼트만 바뀌고 다른 모든 클라이언트는 룸의 다이어그램을 그대로 유지합니다. 비어 있는 룸은 대신 [seed](#seed)로 시드하세요.

하나의 `Y.Doc`은 하나의 다이어그램을 담습니다. 바인딩은 이를 `Y.Doc`의 `erd:` 이름 아래에 보관하고 로컬 Awareness 상태의 `erd` 필드를 설정하며, 그 밖의 이름과 필드는 건드리지 않습니다.  
룸의 각 클라이언트가 그렇듯 바인딩된 엘리먼트마다 `Y.Doc`과 Awareness를 각각 따로 주세요. 하나의 Awareness를 공유하는 두 바인딩은 서로의 `erd` 필드를 덮어씁니다.

## 룸 시드 {#seeding-a-room}

클라이언트가 [시드](#seed)하기 전까지 룸에는 다이어그램이 없습니다.  
그동안 에디터가 담고 있는 내용은 그 에디터 자신의 시드가 되며, 다른 클라이언트의 시드가 먼저 도착하면 그 시드에 자리를 내줍니다. 바인딩은 `rejoin('snapshot')`으로 그 시드에서 다시 열리고, 엘리먼트가 담고 있던 문서와 바인딩 이후 그 안에서 편집한 내용은 사라집니다.

두 클라이언트가 동시에 시드하면 모든 클라이언트에서 하나의 시드가 이깁니다.  
진 시드를 기록한 클라이언트는 `rejoin('seedLost')`로 이긴 시드에서 다시 열리고 자신의 시드 이후 편집한 내용을 잃으며, 진 시드에 참여했던 클라이언트도 `rejoin('snapshot')`으로 같은 일을 겪습니다. 진 시드 안에서 한 편집은 누구에게도 전달되지 않습니다.  
프로바이더가 동기화되기 전에 한 시드는 룸의 다이어그램이 유래한 시드와 같은 순간에 한 것으로 취급되므로, 그 시드를 이겨 룸의 다이어그램을 교체할 수 있습니다.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

프로바이더의 것과 같이, 커서, 포커스, 선택, 드래그 박스를 전달하는 `Awareness`입니다.  
이것이 있으면 바인딩은 엘리먼트의 마우스 트래커와 포커스 트래커를 켜고 엘리먼트 위에 다른 클라이언트의 프레즌스를 그립니다. [프레즌스](#presence) 항목을 참고하세요.  
없으면 다이어그램만 동기화됩니다. 엘리먼트는 커서, 포커스, 선택을 보내지 않고 다른 사람의 것도 그리지 않습니다.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

이 에디터의 커서 옆에 다른 사람에게 보이는 이름입니다.  
엘리먼트의 shared store는 [getSharedStore](./collaborative-editing.md#getnickname)와 마찬가지로 보낼 때마다 이 값을 읽으며, 값이 없거나 비어 있으면 다른 사용자에게는 `user`가 보입니다.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)`는 리스너를 제거하는 함수를 반환합니다.

### seed {#seed}

에디터의 문서로 룸의 첫 번째 스냅샷을 기록하고 `true`를 반환합니다.  
`value`, 즉 [setInitialValue](../erd-editor-element.md#setinitialvalue)가 읽는 어떤 형태든 문서 텍스트가 주어지면, 먼저 그것을 에디터에 로드합니다.  
그런 다음 에디터가 아직 보류 중인 드래그, 크기 조절, 색상 변경을 로그에 기록하지 않고 놓아주므로, 스냅샷 뒤에 그 어느 것도 룸에 반영되지 않습니다. `value` 없이 호출하면 스냅샷이 에디터의 문서를 가져오므로 이미 그 변경을 보여 주고, `value`가 있으면 그 변경은 `value`가 대체한 문서에 속해 있던 것입니다.  
그런 다음 [룸이 담고 있는 것](#what-the-room-holds)에서 설명하는 스냅샷을 기록합니다.  
룸이 이미 스냅샷을 담고 있으면 `value`를 로드하지 않고 `false`를 반환하며 아무것도 기록하지 않으므로, 모든 클라이언트가 바인딩한 뒤에 호출해도 됩니다. 바인딩이 destroy되었거나 중지된 뒤, 그리고 바인딩 시점에 [거부된](#onerror) 바인딩에서도 `false`를 반환합니다.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

바인딩이 [reseed](./collaborative-editing.md#reseed)처럼 에디터를 룸의 스냅샷으로 다시 열었습니다. 무엇을 유지하고 무엇을 잃는지는 [오프라인 편집과 재참여](#offline-edits-and-rejoins)에서 설명합니다.  
`reason`은 그 이유를 알려 줍니다.

- `'snapshot'`: 스냅샷에 바인딩이 아직 적용하지 않은 편집이 들어 있습니다. 바인딩이 떨어져 있는 동안 압축기가 그 편집을 접었거나, 다른 압축기의 스냅샷으로 교체된 스냅샷에 접어 넣었던 편집을 압축기가 자신의 압축에서 되돌려 놓았기 때문입니다([한 룸에 압축기는 하나](#one-compactor-per-room) 항목을 참고하세요). 빈 룸에 있는 바인딩에 스냅샷이 처음 도착했을 때, 그리고 그 스냅샷이 다른 시드의 것인데 이 바인딩이 자신이 쓰지 않은 시드에 참여해 있었을 때도 이 이유가 사용됩니다.
- `'seedLost'`: 이 바인딩이 기록한 시드가 다른 클라이언트의 시드에 졌습니다.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

바인딩이 바인딩을 거부했거나, 중지되었거나, 옵션을 받아들이지 않았습니다. 각 메시지는 `erd-editor-yjs: `로 시작합니다.

바인딩 시점에 다음 경우에는 아무것도 바인딩하지 않습니다.

- 에디터나 피어 store가 이미 이 `Y.Doc`에 바인딩되어 있습니다.
- `@dineug/erd-editor`가 `5.1.0` 이전에 빌드되었습니다. 바인딩은 엘리먼트에서 가져온 shared store를 destroy합니다.
- 피어 store가 바인딩되기 전에 destroy되었습니다.
- 룸이 이 릴리스가 읽지 못하는 레이아웃의 스냅샷을 담고 있습니다([룸이 담고 있는 것](#what-the-room-holds) 항목을 참고하세요).

이런 바인딩은 마이크로태스크에서 `error`를 발생시키므로 호출 직후에 추가한 리스너도 이를 받으며, 이 바인딩에서는 `rejoin`이 발생하지 않습니다.

이후에는 다음 경우에 바인딩이 중지됩니다.

- 룸의 스냅샷이 이 릴리스가 읽지 못하는 레이아웃으로 바뀝니다. 이 릴리스의 모든 바인딩이 중지되고, 각 에디터는 적용해 둔 내용을 유지하며, 그 뒤에 편집한 내용은 기록되지 않습니다.
- 피어 store가 바인딩 아래에서 destroy되었습니다. 룸이 바뀌거나 `seed()` 또는 `compact()`가 호출될 때 처음 발견됩니다.

중지된 바인딩은 [destroy](#destroy)처럼 가져간 shared store와 자신의 store 및 `Y.Doc` 쌍을 놓아주며, 리스너는 유지합니다.

`bindPeerStore`에서만, 다음 경우에는 `error`를 발생시키고 바인딩은 계속 동작합니다.

- `compactAfter`가 양의 정수가 아닙니다. 바인딩은 요청받을 때만 접습니다.
- `electionGraceMs`나 `retainMs`가 0부터 2,147,483,647 ms까지의 숫자가 아닙니다. 그 범위를 넘는 타이머는 즉시 실행되므로 기본값이 대신 사용됩니다.
- `synced`가 reject됩니다. 바인딩은 접지 않으며, 선출은 다른 압축기에 맡깁니다([한 룸에 압축기는 하나](#one-compactor-per-room) 항목을 참고하세요).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

에디터가 아직 보류 중인 드래그, 크기 조절, 색상 변경을 룸에 보내고, 바인딩의 `erd` Awareness 필드를 `null`로 설정해 다른 클라이언트가 이 에디터의 커서, 포커스, 선택을 즉시 지우게 한 뒤, `Y.Doc`과 Awareness 관찰을 중단합니다.  
엘리먼트의 경우에는 가져간 shared store도 destroy하며, 엘리먼트와 그 문서는 그대로 둡니다.  
두 번째 호출은 아무 동작도 하지 않습니다. 이후 에디터가 하는 편집은 누구에게도 전달되지 않습니다.

피어 store, `Y.Doc`, 프로바이더는 사용자의 것으로 남으며 바인딩을 destroy한 뒤에 직접 destroy하세요. 피어 store를 먼저 destroy하면 아직 보류 중이던 드래그가 전송되지 않습니다.  
엘리먼트 자체의 [destroy](../erd-editor-element.md#destroy)는 바인딩의 것을 포함해 엘리먼트가 내준 모든 shared store를 destroy하고 그것들이 보류 중이던 내용을 버리므로, 바인딩을 먼저 destroy하세요.  
같은 에디터나 피어 store를 같은 `Y.Doc`에 다시 바인딩하기 전에 바인딩을 destroy하세요. `error`로 중지된 바인딩은 이미 놓아준 상태입니다.

```js
binding.destroy();
editor.destroy();
```

## 프레즌스 {#presence}

[awareness](#awareness)가 있으면 에디터의 커서, 포커스된 테이블이나 셀, 선택, 드래그 박스는 로컬 Awareness 상태의 `erd` 필드로 전달되며 `Y.Doc`에는 들어가지 않으므로, 룸의 히스토리, 스냅샷, 영속화된 `Y.Doc`에 들어가지 않습니다.  
다른 클라이언트는 공동 편집자의 프레즌스를 그리는 방식대로 이를 그립니다. [focusTracker](./collaborative-editing.md#focustracker) 항목을 참고하세요. 참여하는 클라이언트는 룸이 이미 보여 주는 프레즌스를 그립니다.  
엘리먼트는 포커스와 선택을 30초마다, 드래그 박스를 1초마다 다시 보냅니다. 이렇게 다시 보내는 것은 직전 값과 같아도 다른 클라이언트에 전달되므로, 사용자가 계속 잡고 있는 것은 만료되지 않습니다.

떠난 클라이언트는 즉시 잊힙니다.  
Awareness가 한 클라이언트의 상태를 지우거나, [destroy](#destroy)가 설정하듯 그 `erd` 필드가 `null`이 되거나, 다른 에디터를 가리키면 바인딩은 만료를 기다리지 않고 [forgetPeer](./collaborative-editing.md#forgetpeer)로 엘리먼트에서 그 에디터의 커서, 포커스, 선택, 드래그 박스를 제거합니다.  
룸의 다른 `Y.Doc`에 다시 바인딩된 엘리먼트처럼 다른 클라이언트가 같은 에디터를 여전히 보여 주고 있으면 이를 유지합니다.

## 오프라인 편집과 재참여 {#offline-edits-and-rejoins}

프로바이더와 연결이 끊긴 클라이언트도 계속 편집합니다. 그 편집은 shared store가 아닌 로컬 `Y.Doc`에서 대기하다가, 프로바이더가 다시 연결되어 동기화되면 다른 클라이언트에 전달됩니다.

클라이언트가 떨어져 있는 동안 압축기가 이 클라이언트가 적용한 적 없는 편집을 접었다면 스냅샷이 그 편집을 담고 있으므로, 다시 연결될 때 클라이언트는 에디터가 아직 보류 중이던 드래그, 크기 조절, 색상 변경을 보낸 뒤 `rejoin('snapshot')`으로 스냅샷에서 다시 열립니다. 클라이언트가 이미 적용한 것만 접은 압축은 아무것도 다시 열지 않습니다.  
바인딩이 참여한 시드의 스냅샷으로 재참여하면 스냅샷이 담고 있지 않은 모든 편집이 재생되며, 떨어져 있는 동안 이 클라이언트가 직접 한 편집도 포함되므로 잃는 것이 없습니다. 다른 시드로 재참여하면 [룸 시드](#seeding-a-room)에서 설명하듯 아무것도 유지되지 않습니다.

모든 재참여는 Undo 히스토리, 선택, 포커스를 지우고, 열려 있는 [Flow](../../guide/guides/visualization.md#flow-모드) 보기, [관계 그리기](../../guide/guides/editing-start.md#관계-생성), 메모, 테이블 그룹 이름, 셀 편집모드를 닫습니다. 이들이 스냅샷에 더 이상 없는 것을 가리킬 수 있기 때문입니다.  
입력했지만 아직 확정하지 않은 테이블 그룹 이름은 버려집니다. 닫히는 논리명 셀은, 다시 열린 문서에 사용자가 입력한 논리명이 남아 있으면 그 논리명에서 물리명을 생성하며, 이는 그 셀이 닫힐 때 늘 하는 동작과 같습니다. 이 생성은 일반 편집입니다. 룸이 로그에 기록하고, Undo 항목을 만들고, `change`를 발생시킵니다. [reseed](./collaborative-editing.md#reseed) 항목을 참고하세요.  
룸에 참여했던 바인딩은 사용자가 보던 화면, 즉 스크롤 위치, 확대/축소 수준, 탭, 그리고 읽기 전용 에디터에서 사용자가 바꾼 설정을 유지합니다.  
또한 사용자가 직접 정한 이름 표시와 코드 설정(Code Generator 언어, 이름 케이스, 괄호 타입)도, 각각의 [잠금](../../guide/guides/settings.md#잠금)이 재참여 전에 켜져 있었고 재참여 뒤에도 같은 잠긴 값으로 켜져 있는 한 유지합니다.  
유지되는 것 중 어느 것도 `value`에는 반영되지 않으며, `value`는 다시 열린 문서의 설정을 보고합니다. `keepScreen`을 사용하는 [reseed](./collaborative-editing.md#reseed) 항목을 참고하세요.  
마지막 로드 이후 표시된 적 없는 엘리먼트의 스크롤 위치와 확대/축소 수준, 그리고 아직 참여하지 않은 바인딩의 화면 전체는 스냅샷이 정한 위치에서 열립니다.  
피어 store에는 화면이 없으므로 재참여해도 유지되는 화면이 없습니다.

## 읽기 전용 에디터 {#read-only-editors}

룸에 바인딩된 [읽기 전용](../erd-editor-element.md#readonly) 엘리먼트는 룸의 히스토리에 아무것도 기록하지 않습니다. 이 엘리먼트의 shared store는 변경을 보내지 않고 트래커와 레지스터 핸드셰이크만 보내며, 룸은 [그 둘을 로그에 기록하지 않습니다](#what-the-room-holds).  
룸이 전달하는 모든 편집은 여전히 적용하며, [awareness](#awareness)가 있으면 사용자의 커서, 포커스, 선택, 드래그 박스도 여전히 다른 클라이언트에 전달됩니다.  
사용자가 바꾸는 설정은 다른 읽기 전용 에디터와 마찬가지로 그 화면에만 남습니다.  
[seed](#seed)는 거부되지 않습니다. 읽기 전용 엘리먼트도 자신이 담고 있는 문서로, `value`가 주어지면 그 문서로 빈 룸을 시드합니다.

## 룸이 담고 있는 것 {#what-the-room-holds}

바인딩은 다이어그램을 `Y.Doc`의 두 이름에 보관합니다. 문서의 스냅샷을 담은 맵인 `erd:snapshot`과 그 이후 에디터의 액션 묶음을 담은 배열인 `erd:log`입니다. 영속화 프로바이더는 이 둘을 `Y.Doc`의 나머지와 함께 저장합니다.

스냅샷은 삭제된 엔티티를 포함한 문서의 [runtimeValue](../erd-editor-element.md#runtimevalue), 협업 레지스터와 버전, 그리고 각 작성자의 편집이 어디까지 접혀 있는지를 담습니다. 시드가 이를 기록하며, 압축기의 모든 압축도 기록합니다.  
`5.1.1` 이전의 `@dineug/erd-editor`로 한 시드나 압축은 그룹에 속한 메모가 없는 스냅샷을 기록합니다. [릴리스 혼용](./collaborative-editing.md#릴리스-혼용) 문서를 참고하세요.  
각 로그 항목은 에디터가 보낸 그대로의 묶음 하나이며, 보낸 에디터의 id와 닉네임을 담은 메타도 포함합니다.  
스크롤, 확대/축소, 탭 전환, 프레즌스, 레지스터 핸드셰이크는 로그에 기록되지 않습니다. 에디터가 보내는 그 밖의 모든 변경은 기록되며, [잠금](../../guide/guides/settings.md#잠금)이 켜진 상태에서 한 이름 표시 전환도 포함되지만 다른 모든 클라이언트는 이를 버립니다.  
잠금이 켜진 상태에서 바꾼 Code Generator 언어, 이름 케이스, 괄호 타입은 전송되지 않으므로 그 에디터의 화면에만 남고 룸에는 전달되지 않습니다.

영속화 프로바이더가 돌려주는 `Y.Doc`은, 스냅샷을 담은 어떤 `Y.Doc`이든 바인딩이 여는 것과 같이, 그 안에 담긴 다이어그램을 엽니다. [사용법](#usage) 항목을 참고하세요.

스냅샷은 파일이 아닙니다. 스냅샷의 런타임 값에는 삭제된 엔티티가 담겨 있는데, 파일에는 이를 담으면 안 되기 때문입니다.  
룸의 다이어그램을 저장소에 기록하려면 바인딩된 엘리먼트의 [change](../erd-editor-element.md#change) 이벤트가 발생할 때마다 그 [value](../erd-editor-element.md#value)를 저장하세요.  
바인딩한 직후, `value`를 준 [seed](#seed) 뒤, [rejoin](#onrejoin) 리스너에서도 한 번 저장하세요. 이 불러오기는 어느 것도 `change`를 발생시키지 않기 때문입니다.  
[읽기 전용](../erd-editor-element.md#readonly) 엘리먼트는 `change`를 발생시키지 않으므로, 읽기 전용이 아닌 엘리먼트에서 저장하거나, 룸의 편집이 도착하는 대로 적용하는 바인딩된 피어 store에서 `value`를 읽으세요.  
[replicationStore](./remote-storage.md)는 바인딩에 필요한 메서드가 없어 바인딩할 수 없으며, 바인딩된 엘리먼트의 shared store에서 공급받는 복제본은 룸의 편집을 놓칩니다. [실행 중인 에디터 복제](./remote-storage.md#실행-중인-에디터-복제) 항목을 참고하세요.

레이아웃은 비공개이며 [ERD_YJS_FORMAT](#exports)과 함께 바뀔 수 있습니다.  
룸은 반드시 바인딩을 통해서만 읽고, `erd:` 이름과 Awareness 필드 `erd`는 바인딩에 맡기세요.

## 룸 압축 {#compacting-a-room}

룸의 히스토리는 편집할 때마다 늘어나며, 무언가가 접어 주기 전까지는 참여하는 클라이언트마다 그 전체를 재생합니다.  
`bindPeerStore`는 `@dineug/erd-editor/peer.js`의 헤드리스 피어 store를 바인딩하고 `ErdYjsPeerBinding`을 반환합니다. [seed](#seed), [on](#erdyjsbinding), [destroy](#destroy)는 같고, [compact](#compact)가 더해집니다.  
서버 옆의 Node 프로세스에서 바인딩한 피어 store, 즉 사이드카는 자신의 다이어그램에 대한 스냅샷으로 히스토리를 접습니다.  
엘리먼트의 바인딩은 접지 않으며, `compactAfter`도 `compact()` 호출도 없이 바인딩한 피어 store는 일반 헤드리스 피어입니다.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

피어 store는 사용자의 것으로 남으며, 바인딩은 이를 destroy하지 않습니다. 닉네임은 `createPeerStore`에 준 것이고, `presence: false`는 이 store가 자신의 포커스를 보내지 않게 합니다.

압축은 피어 store 자신의 런타임 값, 레지스터, 버전으로 스냅샷을 기록하고, 그 압축이 포함하는 로그 항목과 다른 시드의 모든 항목을 하나의 트랜잭션으로 삭제합니다.  
모든 것을 적용한 클라이언트는 항목이 사라지는 것을 보며, 그렇지 않았던 클라이언트는 스냅샷에서 다시 열립니다([오프라인 편집과 재참여](#offline-edits-and-rejoins) 항목을 참고하세요).  
압축할 때마다 전체 다이어그램이 스냅샷에 다시 기록되므로, 항목이 아무리 적어도 각 압축은 모든 클라이언트에 다이어그램의 런타임 JSON과 레지스터를 합친 크기쯤 되는 업데이트를 보냅니다. 압축이 가져가는 항목이 다이어그램 사본 하나보다 무겁도록 `compactAfter`를 충분히 높게 설정하세요.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| 옵션 | 기본값 | 설명 |
| --- | --- | --- |
| `awareness` | 없음 | [awareness](#awareness)가 엘리먼트에 하듯 피어 store를 룸의 Awareness에 표시합니다. 스스로 접는 압축기는 거기에 표시되므로, 서로를 보는 압축기들이 접을 하나를 선출하며, 다른 클라이언트가 보이지 않는 압축기는 스스로 접지 않습니다. [한 룸에 압축기는 하나](#one-compactor-per-room) 항목을 참고하세요. 없으면 압축기는 선출도 유예도 없이 스스로 접습니다. |
| `compactAfter` | 없음 | 압축이 가져갈 로그 항목이 이 개수만큼 쌓이면 스스로 접습니다. 이 옵션이나 `synced`가 없으면 `compact()`와 되돌려 놓는 압축([한 룸에 압축기는 하나](#one-compactor-per-room) 항목을 참고하세요)만 접습니다. |
| `synced` | 없음 | 프로바이더가 동기화되면 resolve되는 프라미스입니다. `compact()`를 포함해 이보다 앞서 접는 일은 없습니다. 없으면 스스로 접지 않고 `compact()`는 즉시 접습니다. |
| `electionGraceMs` | `3000` | `awareness`가 있을 때, `synced` 뒤에, 그리고 아무도 없다가 다른 클라이언트가 나타날 때마다, 압축기가 스스로 접기 전에 룸을 지켜보는 시간입니다. |
| `retainMs` | `600000` (10분) | 압축한 항목을 되돌려 놓기 위해 보관하는 시간입니다([한 룸에 압축기는 하나](#one-compactor-per-room) 항목을 참고하세요). 압축 뒤 룸이 보내는 첫 업데이트부터 셉니다. |

잘못된 옵션이나 reject되는 `synced`는 [error](#onerror)를 발생시킵니다.

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

선출, 유예, 임계값 없이 즉시 접습니다.  
먼저 룸의 현재 스냅샷을 받아들이며(재참여 포함), 피어 store가 아직 보류 중인 것을 보냅니다.  
`{ compacted: true, generation }`으로 응답하며, `generation`은 스냅샷이 접힌 횟수로 시드는 `0`이고 압축할 때마다 하나씩 늘어납니다.  
그렇지 않으면 `{ compacted: false, reason }`으로 응답합니다.

- `'destroyed'`: 바인딩이 destroy되었거나 중지된 뒤, 그리고 바인딩 시점에 [거부된](#onerror) 바인딩에서는 `synced`가 resolve되기 전이라도 이 값입니다.
- `'not-synced'`: `synced`가 resolve되기 전입니다.
- `'no-snapshot'`: 어떤 클라이언트도 시드하지 않은 룸입니다.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## 한 룸에 압축기는 하나 {#one-compactor-per-room}

룸마다 압축기를 정확히 하나만 실행하고, 새 압축기는 이전 것이 중지된 뒤에만 시작하세요. 이를 강제하는 것은 없습니다.  
Awareness에서 서로를 보는 압축기 중에서는 Yjs 클라이언트 id가 가장 작은 하나만 스스로 접으며, 그것이 떠나거나 `synced`가 reject되면 다음 압축기가 즉시 이어받습니다.  
자신의 소켓이 닫히면서 모두 사라진 경우처럼 Awareness에 다른 클라이언트가 보이지 않는 압축기는, 다른 클라이언트가 다시 나타나고 `electionGraceMs` 동안 룸을 지켜볼 때까지 스스로 접지 않습니다.

서로 연결이 끊긴 두 압축기나, 이전 압축기가 아직 실행 중인 재시작에서는 각자 접을 수 있습니다.  
그러면 룸은 두 스냅샷 중 하나를 유지하며, 스냅샷이 진 압축기는 자신이 접은 것 중 이긴 쪽에 없는 것을 보유하는 동안 되돌려 놓습니다. 그 보유는 `retainMs` 동안이며, 각 항목의 크기와 상관없이 최근 1,000개 항목까지입니다.  
따라서 스냅샷이 진 압축기가 다시 연결되는 쪽이라면, 떨어져 있는 동안 접은 항목이 1,000개를 넘지 않는 한 잃는 것이 없습니다.  
온라인을 유지한 쪽이고 보유 시간이 지났다면, 그 압축기가 다시 접기 전까지 룸의 스냅샷과 히스토리에는 그 압축기가 접은 것이 빠져 있습니다. 그 편집을 놓친 클라이언트와 그동안 참여한 클라이언트는 그것이 없으며, 압축기가 그 편집을 접은 작성자들의 이후 편집도 보류합니다. 압축기의 다음 압축이 이를 모두 되돌려 놓지만, 이긴 스냅샷에 압축기에 없던 편집이 들어 있었다면 그 스냅샷에서 다시 열려 접은 것이 영영 사라집니다.

압축기는 이긴 스냅샷을 따라잡은 뒤 선출, 유예, 임계값 없이 자신의 압축에서 되돌려 놓으며, 모든 클라이언트는 `rejoin('snapshot')`으로 그 압축에서 다시 열립니다.  
되돌려 놓은 편집은 그 압축 외에는 어떤 클라이언트에도 도달하지 않으므로, 내내 온라인이던 클라이언트는 다른 클라이언트와 나중에 참여하는 클라이언트와 같은 상태로 끝납니다. 다른 작성자의 이후 편집이 그중 하나를 기반으로 하는 경우, 예를 들어 다른 클라이언트가 추가한 테이블의 이름 바꾸기가 있어도 마찬가지입니다.  
되돌려 놓을 때마다 모든 클라이언트가 그 재참여를 치르며, [재참여가 잃는 것](#offline-edits-and-rejoins)이 따릅니다. 두 압축기가 동시에 되돌려 놓아도 모든 클라이언트는 여전히 같은 상태로 끝나지만, 어떤 편집이 자신이 기반으로 하는 편집보다 앞서 적용된 채 남을 수 있습니다.  
그 압축이 실행되기 전에 바인딩이 destroy되었거나 중지된 경우, 예를 들어 `rejoin` 리스너가 destroy한 경우에는 편집을 자체적으로 되돌려 놓습니다. 잃는 것은 없지만, 이때 내내 온라인이던 클라이언트는 그 편집을 기반으로 하는 다른 작성자의 편집 뒤에 그 편집을 적용할 수 있으며, 나중에 참여하는 클라이언트와 다른 상태로 끝납니다.

## 제한 {#limits}

- **뷰포트는 각 화면에 남습니다.** 스크롤, 확대/축소, 탭 전환은 [로그에 기록되지 않습니다](#what-the-room-holds). `getSharedStore`로 연결한 세션은 이를 보내지만, 그 세션에서도 다른 사용자의 화면이나 탭은 움직이지 않습니다. 각 사용자는 자신의 것을 유지하며, 바인딩은 이를 Awareness 상태에만 표시하고 아직 이를 읽는 곳은 없습니다. `Viewport` 또는 `Canvas Type` [잠금](../../guide/guides/settings.md#잠금)이 꺼져 있으면 각 클라이언트의 `value`가 자신의 것을 저장하고, 새 문서가 켜 둔 상태인 잠금이 켜져 있으면 모든 클라이언트가 잠긴 값을 저장합니다.
- **스냅샷은 바인딩마다 항목이 하나씩 늘어납니다.** 스냅샷은 룸에 기록한 적이 있는 모든 바인딩에 대해 그 편집이 어디까지 접혀 있는지를 보관하며, 하나도 버리지 않습니다. 다시 만든 바인딩이나 다른 시드로 옮긴 바인딩은 새로 세고, 되돌려 놓는 압축마다 그렇습니다. 항목은 32자 id와 숫자 하나이므로, 쓰기 세션이 만 개면 모든 스냅샷과 모든 압축에 수백 킬로바이트가 더해집니다.
- **허브와 룸은 서로 사이에서 아무것도 중계하지 않습니다.** 룸과 코딩 에이전트의 [허브](../../mcp/live-and-headless.md#라이브)에 함께 바인딩된 엘리먼트, 또는 `getSharedStore()`를 통한 다른 전송 수단에 함께 연결된 엘리먼트는 양쪽의 편집을 적용하지만, shared store는 받은 것을 다시 보내지 않으므로 어느 쪽도 상대편의 편집을 듣지 못합니다.
- **동시에 추가한 항목은 서로 다른 순서로 나열될 수 있습니다.** 두 클라이언트가 동시에 추가한 테이블이나 메모는 `getSharedStore`로 연결한 세션에서처럼 각 클라이언트의 다이어그램에서 다른 순서로 놓일 수 있습니다. [동시 편집](./collaborative-editing.md#concurrent-edits) 항목을 참고하세요.
- **색상과 그 밖의 일부 변경은 동시에 하면 서로 다르게 끝날 수 있습니다.** 색상 변경은 버전 없이 로그에 기록되며, 각 클라이언트는 이를 적용할 때 자신의 버전으로 스탬프를 찍습니다. 따라서 한 테이블, 메모, 테이블 그룹을 동시에 두 번 다시 칠하면 클라이언트들, 그리고 나중에 참여해 로그를 재생하는 클라이언트가 서로 다른 색상으로 끝날 수 있습니다. 한 테이블이나 인덱스 안의 두 컬럼 이동, 데이터베이스의 두 번의 변경처럼 각 클라이언트가 들은 순서대로 적용하는 다른 변경도 마찬가지입니다. [동시 편집](./collaborative-editing.md#concurrent-edits) 항목을 참고하세요.
- **떠나는 커서는 서버를 기다립니다.** 바인딩은 Awareness가 피어의 커서를 지우는 즉시 그 커서를 지웁니다. 소켓이 닫힐 때 그 소켓이 처음 추가한 Awareness 상태만 제거하는 서버는, 다시 연결했던 클라이언트가 떠난 뒤에도 Awareness가 30초 뒤에 타임아웃시킬 때까지 다른 클라이언트의 화면에 남겨 둡니다. 소켓이 마지막으로 쓴 모든 상태를, 추가뿐 아니라 업데이트까지 제거하는 서버는 즉시 지웁니다.

## 내보내기 {#exports}

| Export | 설명 |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | `<erd-editor>` 엘리먼트를 바인딩합니다. [사용법](#usage) 항목을 참고하세요. [ErdYjsBinding](#erdyjsbinding)을 반환합니다. |
| `bindPeerStore(peer, doc, options?)` | `@dineug/erd-editor/peer.js`의 피어 store를 바인딩합니다. [룸 압축](#compacting-a-room) 항목을 참고하세요. [compact](#compact)가 더해진 같은 바인딩(`ErdYjsPeerBinding`)을 반환합니다. |
| `ERD_YJS_FORMAT` | 이 릴리스가 기록하는 `Y.Doc`의 레이아웃으로 `1`입니다. 바인딩은 다른 레이아웃으로 기록된 룸을 거부합니다. |

타입: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
