---
sidebar_position: 2
description: 通过 @dineug/erd-editor-yjs 借助 Yjs 文档使 `<erd-editor>` 元素或无头对等存储保持同步，为房间载入初始文档，通过 Awareness 显示在线状态，支持离线继续编辑，并用压缩 sidecar 合并房间的历史。
---

# Yjs

`@dineug/erd-editor-yjs` 借助 [Yjs](https://github.com/yjs/yjs) 文档使图保持同步。它是一个独立的包，随 `@dineug/erd-editor` `5.1.0` 一同首次发布，版本为 `0.1.0`。  
`bindErdEditor` 将 `<erd-editor>` 元素绑定到 `Y.Doc`，`bindPeerStore` 则将来自 `@dineug/erd-editor/peer.js` 的无头对等存储绑定到 `Y.Doc`。  
承载 `Y.Doc` 的 provider 就承载这张图：websocket 服务器、WebRTC、IndexedDB，或你自己的 provider 均可。provider 和 `Y.Doc` 仍归你所有：绑定不会连接、断开或销毁它们。

编辑以编辑器自己的动作批次形式传输，绑定会保持这些批次与存储发送时一致。  
因此，编辑器的协同寄存器处理同一时刻进行的编辑的方式，与通过 `getSharedStore` 接入的会话相同，例外情况也相同，例如颜色更改，参见[并发编辑](./collaborative-editing.md#concurrent-edits)。  
光标、焦点、选中范围和拖动框通过 provider 的 Awareness 传输，参见[在线状态](#presence)。  
与自行将共享存储接入传输层相比，该绑定额外提供：

- 加入的客户端会打开房间中保存的图，无需从正在运行的编辑器传入 [runtimeValue](../erd-editor-element.md#runtimevalue)。
- 断开连接的客户端可以继续编辑，其编辑会在重新连接时送达，参见[离线编辑与重新加入](#offline-edits-and-rejoins)。
- 持久化 provider 返回的 `Y.Doc` 会打开其中保存的图，参见[房间保存的内容](#what-the-room-holds)。
- 一个可选的 Node sidecar 会将房间的历史合并为一份快照，参见[压缩房间](#compacting-a-room)。

该绑定需要 `5.1.0` 为共享存储和对等存储新增的五个方法：[getLWW](./collaborative-editing.md#getlww)、[mergeLWW](./collaborative-editing.md#mergelww)、[getVersion](./collaborative-editing.md#getversion)、[forgetPeer](./collaborative-editing.md#forgetpeer) 和 [reseed](./collaborative-editing.md#reseed)，并且会自行完成所需的全部调用。

## 安装 {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`、`yjs` 和 `y-protocols` 是 peer dependency，因此一个页面中各只有一份：`@dineug/erd-editor` 为 `5.x` 中 `5.1.0` 或更高版本，`yjs` 为 `13.x` 中 `13.6` 或更高版本，`y-protocols` 为 `1.x` 中 `1.0` 或更高版本。  
该包只引用它们的类型，并作用于你传入的 `Y.Doc` 和 `Awareness`，因此不会自行加载任何 Yjs、y-protocols 或编辑器代码。  
同一页面中有两份 Yjs 会使彼此的构造函数检查失败，第二份会输出 `Yjs was already imported`。当你的代码和 provider 从两个位置解析 `yjs` 时，请在打包工具中去重（Vite：`resolve.dedupe: ['yjs']`）。

该包仅提供 ESM（`"type": "module"`），只有包根目录一个入口，并标记为无副作用，因此只导入 `bindErdEditor` 的打包产物不会包含压缩器。  
`bindErdEditor` 需要 DOM，因为它绑定的是已定义的 `<erd-editor>` 元素。`bindPeerStore` 还可以在纯 Node 中运行（需要 Node.js 22.12 或更高版本），[压缩 sidecar](#compacting-a-room) 即是如此。

## 使用 {#usage}

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

`wss://yjs.example.com` 和 `my-diagram` 代表你自己的服务器和房间。  
仅在 provider 同步完成后再进行绑定和载入初始文档，y-websocket 的 `sync` 事件带 `true` 即表示同步完成。过早载入初始文档可能会替换房间中的图，参见[为房间载入初始文档](#seeding-a-room)。

绑定时若 `Y.Doc` 中保存着房间的快照，绑定会立即在元素中打开它：加载快照及其寄存器和版本，如同 [reseed](./collaborative-editing.md#reseed) 一样，并应用此后记录的所有编辑。  
这次打开会像重新加入一样清除和关闭相应的内容，参见[离线编辑与重新加入](#offline-edits-and-rejoins)，元素会打开到快照所指定的位置。这次首次打开不会触发 `rejoin`。  
当 `Y.Doc` 中没有快照时，例如房间为空或 provider 尚未同步，元素会保留其文档，绑定也不会向房间写入任何内容，直到出现快照，即它自己的 [seed](#seed) 或其他客户端的快照。

`bindErdEditor` 通过 [getSharedStore](../erd-editor-element.md#getsharedstore) 从元素获取一个共享存储，[destroy](#destroy) 会将其释放。  
该元素必须已经是 `<erd-editor>`，即已导入其入口或已调用 `defineErdEditor()`，参见[注册元素](../installation.md#registering-the-elements)。在标签被定义之前，`<erd-editor>` 只是普通的 `HTMLElement`，待标签被定义且元素位于文档中后，浏览器才会将其升级。对于尚未升级的元素，`bindErdEditor` 会抛出 `TypeError`，而不是触发 `error`。

房间的编辑会像协作者的编辑一样应用到元素并触发 [change](../erd-editor-element.md#change)，快照打开后重放的编辑也包括在内。  
无论是在绑定时还是重新加入时，打开快照都不会产生 Undo 记录，不会触发 `change`，也不会向房间写入任何内容，但[离线编辑与重新加入](#offline-edits-and-rejoins)所述的逻辑名生成除外。  
要将另一份文档载入已载入初始文档的房间，请进行一次每个客户端都会应用的更改：赋值 [value](../erd-editor-element.md#value)、调用 [clear](../erd-editor-element.md#clear)，或导入一份文档。  
[setInitialValue](../erd-editor-element.md#setinitialvalue) 永远不会写入房间，因为共享存储不会发送它，所以它只会改变该元素，其他所有客户端仍保留房间中的图。请改用 [seed](#seed) 为空房间载入初始文档。

一个 `Y.Doc` 保存一张图。绑定将其保存在 `Y.Doc` 的 `erd:` 名称下，并设置本地 Awareness 状态的 `erd` 字段，其他名称和字段一概不动。  
请为每个已绑定的元素提供各自的 `Y.Doc` 和 Awareness，就像房间中的每个客户端那样：两个绑定共用一个 Awareness 会互相覆盖对方的 `erd` 字段。

## 为房间载入初始文档 {#seeding-a-room}

在某个客户端[载入初始文档](#seed)之前，房间中没有图。  
在此期间编辑器所持有的内容会进入它自己的初始文档，如果另一个客户端的初始文档先到达，则让位于它：绑定会通过 `rejoin('snapshot')` 在其上重新打开，元素原先持有的文档以及绑定后在其中所做的编辑都会丢失。

两个客户端同时载入初始文档时，在每个客户端上都是同一份初始文档胜出。  
另一个载入初始文档的客户端会通过 `rejoin('seedLost')` 在胜出者上重新打开，并丢失自己载入之后所做的编辑；加入了落败初始文档的客户端也是如此，会通过 `rejoin('snapshot')` 重新打开。它们在落败初始文档中的编辑不会送达任何人。  
在 provider 同步之前载入的初始文档，视为与房间中图的来源初始文档在同一时刻载入，因此它可能胜过后者，并替换房间中的图。

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

承载光标、焦点、选中范围和拖动框的 `Awareness`，例如 provider 的 Awareness。  
有了它，绑定会开启元素的鼠标和焦点跟踪器，并在元素上绘制其他客户端的在线状态，参见[在线状态](#presence)。  
没有它则只同步图：元素不会发送光标、焦点或选中范围，也不会绘制其他人的这些内容。

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

其他人在此编辑器光标旁看到的名称。  
元素的共享存储每次发送时都会读取它，与 [getSharedStore](./collaborative-editing.md#getnickname) 相同；缺失或为空白时，其他用户看到的是 `user`。

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

`on(event, listener)` 返回一个用于移除该监听器的函数。

### seed {#seed}

根据编辑器的文档写入房间的第一份快照，并返回 `true`。  
如果传入 `value`，即 [setInitialValue](../erd-editor-element.md#setinitialvalue) 可读取的任意形式的文档文本，则先将其载入编辑器。  
随后，它会放弃（不记录日志）编辑器仍在暂存的拖动、调整大小和颜色更改，因此它们都不会在快照之后进入房间。没有 `value` 时，快照已经包含这些内容，因为它取自编辑器的文档；有 `value` 时，它们属于被 `value` 替换的那份文档。  
然后写入[房间保存的内容](#what-the-room-holds)所述的快照。  
一旦房间中已有快照，它就返回 `false`，不写入任何内容，也不载入 `value`，因此每个客户端都可以在绑定后调用它。绑定已被销毁或已停止时，以及绑定时被[拒绝](#onerror)的绑定上，它同样返回 `false`。

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

绑定在房间的快照上重新打开了编辑器，如同 [reseed](./collaborative-editing.md#reseed) 一样；它会保留什么、丢失什么，参见[离线编辑与重新加入](#offline-edits-and-rejoins)。  
`reason` 说明原因：

- `'snapshot'`：快照包含绑定尚未应用的编辑，原因是绑定离开期间压缩器将其合并了，或者压缩器在自己的一次合并中放回了它先前合并进快照、后被另一个压缩器的快照取代的内容（参见[每个房间一个压缩器](#one-compactor-per-room)）。当该快照是空房间的绑定收到的第一份快照，以及它属于另一份初始文档、而该绑定加入的是并非自己所写的初始文档时，原因同样是 `'snapshot'`。
- `'seedLost'`：另一个客户端的初始文档胜过了此绑定所写的初始文档。

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

绑定拒绝绑定、已停止，或拒绝了某个选项。每条消息都以 `erd-editor-yjs: ` 开头。

在绑定时，出现以下情况不会绑定任何内容：

- 该编辑器或对等存储已经绑定到此 `Y.Doc`；
- 其 `@dineug/erd-editor` 构建于 `5.1.0` 之前；绑定会销毁它从元素获取的共享存储；
- 对等存储在绑定之前已被销毁；
- 房间中保存的快照所用的格式不是此版本可读取的（参见[房间保存的内容](#what-the-room-holds)）。

这样的绑定会在微任务中触发 `error`，因此在调用后紧接着添加的监听器也能收到，并且它之后永远不会触发 `rejoin`。

之后，出现以下情况绑定会停止：

- 房间的快照变成了此版本不可读取的格式。此版本的所有绑定都会停止，每个编辑器保留已应用的内容，此后的编辑不会被写入；
- 它的对等存储在绑定期间被销毁，这会在房间下次变化或调用 `seed()` 或 `compact()` 时被发现。

停止的绑定会释放它获取的共享存储，也会释放它的存储与 `Y.Doc` 这一对，如同 [destroy](#destroy) 一样，并保留其监听器。

仅对 `bindPeerStore` 而言，以下情况会触发 `error`，绑定会继续运行：

- `compactAfter` 不是正整数：绑定仅在被要求时才合并；
- `electionGraceMs` 或 `retainMs` 不是 0 到 2,147,483,647 毫秒之间的数字：改用其默认值，因为超出该范围的定时器会立即触发；
- `synced` 被拒绝：绑定永远不合并，并把选举交给其他压缩器（参见[每个房间一个压缩器](#one-compactor-per-room)）。

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

将编辑器仍在暂存的拖动、调整大小和颜色更改发送到房间，把绑定的 `erd` Awareness 字段设为 `null`，使其他人立即丢弃它的光标、焦点和选中范围，并停止观察 `Y.Doc` 和 Awareness。  
对于元素，它还会销毁所获取的共享存储，而元素及其文档保持原样。  
再次调用不会产生任何效果。此后编辑器所做的编辑不会送达任何人。

对等存储、`Y.Doc` 和 provider 仍归你所有，应在绑定之后销毁：先销毁的对等存储永远不会发送它仍在暂存的拖动。  
元素自己的 [destroy](../erd-editor-element.md#destroy) 会销毁它交出的每个共享存储，包括该绑定的共享存储，并丢弃它们暂存的内容，因此请先销毁绑定。  
在把同一个编辑器或对等存储再次绑定到同一个 `Y.Doc` 之前，请先销毁绑定；因 `error` 而停止的绑定已经释放了它们。

```js
binding.destroy();
editor.destroy();
```

## 在线状态 {#presence}

有了 [awareness](#awareness)，编辑器的光标、获得焦点的表或单元格、选中范围和拖动框会在其本地 Awareness 状态的 `erd` 字段中传输，而不会进入 `Y.Doc`，因此它们永远不会进入房间的历史、快照或持久化的 `Y.Doc`。  
其他人像绘制协作者的在线状态那样绘制它们，参见 [focusTracker](./collaborative-editing.md#focustracker)，而加入的客户端会绘制房间已经显示的在线状态。  
元素每 30 秒重新发送一次焦点和选中范围，每秒重新发送一次拖动框。其中每次重新发送，即使与上一次相同，也会送达其他人，因此用户仍在持有的内容不会失效。

离开的客户端会被立即遗忘。  
当 Awareness 丢弃其状态，或其 `erd` 字段变为 `null`（如 [destroy](#destroy) 所设置的）或指向另一个编辑器时，绑定会通过 [forgetPeer](./collaborative-editing.md#forgetpeer) 从元素中移除该编辑器的光标、焦点、选中范围和拖动框，而不是等待它们过期。  
只要另一个客户端仍显示同一个编辑器，例如再次绑定到房间另一个 `Y.Doc` 的元素，就会保留它们。

## 离线编辑与重新加入 {#offline-edits-and-rejoins}

与 provider 断开的客户端可以继续编辑。它的编辑暂存在本地 `Y.Doc` 中，而不是共享存储中，并在 provider 重新连接并同步后送达其他人。

如果客户端离开期间压缩器合并了它从未应用的编辑，则快照包含这些编辑，因此重新连接时，客户端会在发送编辑器仍在暂存的拖动、调整大小和颜色更改之后，通过 `rejoin('snapshot')` 在快照上重新打开。只合并了客户端已应用内容的合并不会重新打开任何内容。  
在绑定所加入的初始文档的快照上重新加入，会重放快照中没有的每一条编辑，其中包括该客户端离开期间自己所做的编辑，因此不会丢失任何内容。在另一份初始文档上重新加入则不保留任何内容，参见[为房间载入初始文档](#seeding-a-room)。

每次重新加入都会清除 Undo 历史记录、选中范围和焦点，并关闭已打开的 [Flow](../../guide/guides/visualization.md#flow-mode) 视图、[正在绘制的关系](../../guide/guides/editing-start.md#创建关系)，以及备注、表分组名称或单元格编辑器，因为它们可能指向快照中已不存在的内容。  
已输入但尚未确认的表分组名称会被丢弃。关闭逻辑名单元格时，如果重新打开的文档中仍有其阅读者输入的逻辑名，就会据此生成物理名，与任何一次关闭该单元格时相同。这次生成是普通编辑：房间会记录它，它会产生 Undo 记录，并触发 `change`，参见 [reseed](./collaborative-editing.md#reseed)。  
已加入房间的绑定会保留其阅读者所看到的内容：滚动位置、缩放级别和标签页，以及只读阅读者更改的设置。  
只要各项的[锁定](../../guide/guides/settings.md#锁定)在重新加入之前是开启的、之后仍然开启且锁定的值相同，它还会保留阅读者自己显示的名称显示和代码设置（Code Generator 语言、名称大小写和括号类型）。  
它所保留的内容都不会进入 `value`，`value` 反映的是重新打开的文档的设置，参见带 `keepScreen` 的 [reseed](./collaborative-editing.md#reseed)。  
自上次加载以来未显示过的元素的滚动位置和缩放级别，以及尚未加入的绑定的整个屏幕，会打开到快照所指定的位置。  
对等存储没有屏幕，因此其重新加入不保留任何屏幕内容。

## 只读编辑器 {#read-only-editors}

绑定到房间的[只读](../erd-editor-element.md#readonly)元素不会向房间的历史写入任何内容：它的共享存储不发送任何更改，只发送其跟踪器和寄存器握手，房间也[不记录这两者](#what-the-room-holds)。  
它仍会应用房间传来的每一条编辑，并且有了 [awareness](#awareness)，其阅读者的光标、焦点、选中范围和拖动框仍会送达其他人。  
其阅读者更改的设置只显示在其屏幕上，与任何只读编辑器相同。  
[seed](#seed) 不会被拒绝：只读元素可以用它所持有的文档为空房间载入初始文档，传入 `value` 时则用 `value`。

## 房间保存的内容 {#what-the-room-holds}

绑定将图保存在 `Y.Doc` 的两个名称下：`erd:snapshot`，一个保存文档快照的 map；以及 `erd:log`，一个保存此后编辑器动作批次的数组。持久化 provider 会将这两者与 `Y.Doc` 的其余内容一同存储。

快照保存文档的 [runtimeValue](../erd-editor-element.md#runtimevalue)（包括已删除的实体）、其协同寄存器和版本，以及每个写入方的编辑已合并到何处。初始文档会写入它，压缩器的每次合并也会写入。  
在 `5.1.1` 之前的 `@dineug/erd-editor` 上载入初始文档或合并所写出的快照中，没有任何备注属于表分组，参见[混用不同版本](./collaborative-editing.md#mixing-releases)。  
每个日志条目是编辑器发送的一个批次，包括其元数据，其中带有发送方的编辑器 id 和昵称。  
滚动、缩放、标签页切换、在线状态和寄存器握手永远不会被记录。编辑器发送的其他所有更改都会被记录，其中包括在其[锁定](../../guide/guides/settings.md#锁定)下进行的名称显示切换，其他所有客户端都会丢弃它。  
在锁定下更改的 Code Generator 语言、名称大小写或括号类型永远不会被发送，因此只显示在该编辑器的屏幕上，永远不会进入房间。

持久化 provider 返回的 `Y.Doc` 会打开其中保存的图，如同绑定打开任何带有快照的 `Y.Doc` 一样，参见[使用](#usage)。

快照不是文件：它的运行时值带有已删除的实体，而文件不得包含这些实体。  
要将房间的图写入存储，请在已绑定元素的 [change](../erd-editor-element.md#change) 事件触发时保存其 [value](../erd-editor-element.md#value)。  
此外，还要在绑定之后、传入 `value` 的 [seed](#seed) 之后，以及在 [rejoin](#onrejoin) 监听器中保存一次，因为这些加载都不会触发 `change`。  
[只读](../erd-editor-element.md#readonly)元素永远不会触发 `change`，因此请从非只读的元素保存，或者读取已绑定对等存储的 `value`，它会在房间的编辑到达时应用它们。  
[replicationStore](./remote-storage.md) 无法被绑定，因为它缺少绑定所需的方法；而从已绑定元素的共享存储获取数据的 replicationStore 会漏掉房间的编辑，参见[复制实时编辑器](./remote-storage.md#复制实时编辑器)。

该格式是私有的，可能会随 [ERD_YJS_FORMAT](#exports) 而变化。  
请仅通过绑定读取房间，并将 `erd:` 名称和 Awareness 字段 `erd` 留给它。

## 压缩房间 {#compacting-a-room}

房间的历史会随每次编辑增长，加入的每个客户端都要重放全部历史，直到有东西将其合并。  
`bindPeerStore` 绑定来自 `@dineug/erd-editor/peer.js` 的无头对等存储，并返回 `ErdYjsPeerBinding`：同样的 [seed](#seed)、[on](#erdyjsbinding) 和 [destroy](#destroy)，外加 [compact](#compact)。  
绑定在服务器旁的 Node 进程中的对等存储，即 sidecar，会将历史合并为它自己那张图的快照。  
元素的绑定从不合并，而未设置 `compactAfter` 且从不调用 `compact()` 的已绑定对等存储只是普通的无头对等方。

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

对等存储仍归你所有：绑定从不销毁它。它的昵称是传给 `createPeerStore` 的那个，而 `presence: false` 使它不发送自己的焦点。

一次合并会根据对等存储自己的运行时值、寄存器和版本写入快照，并在同一个事务中删除它所涵盖的日志条目以及另一份初始文档的所有条目。  
已应用全部内容的客户端会看到这些条目消失；未应用全部内容的客户端会在快照上重新打开（参见[离线编辑与重新加入](#offline-edits-and-rejoins)）。  
每次合并都会把整张图重写进快照，因此每次合并都会向每个客户端发送一个更新，其大小约为图的运行时 JSON 与寄存器之和，无论它合并多少条目。请将 `compactAfter` 设得足够高，使一次合并所涵盖的条目的总大小超过一份图的副本。

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

| 选项 | 默认值 | 说明 |
| --- | --- | --- |
| `awareness` | 无 | 在房间的 Awareness 中显示该对等存储，如同 [awareness](#awareness) 对元素的作用。自行合并的压缩器会在其中被标记，因此彼此可见的压缩器会选出一个来合并，而看不到其他客户端的压缩器不会自行合并任何内容，参见[每个房间一个压缩器](#one-compactor-per-room)。没有它，压缩器会自行合并，不进行选举，也没有宽限期。 |
| `compactAfter` | 无 | 一旦日志中达到这么多条一次合并会涵盖的条目，就自行合并。没有它，或者没有 `synced`，则只有 `compact()` 会合并，以及放回内容的那次合并（参见[每个房间一个压缩器](#one-compactor-per-room)）。 |
| `synced` | 无 | 在 provider 同步完成后解决的 promise。在它之前不进行任何合并，包括 `compact()`。没有它，则不会自行合并任何内容，而 `compact()` 会立即合并。 |
| `electionGraceMs` | `3000` | 有 `awareness` 时，压缩器在自行合并之前观察房间的时长；在 `synced` 之后观察一次，此后每当从没有其他客户端变为出现其他客户端时，都会再次观察。 |
| `retainMs` | `600000`（十分钟） | 一次合并的条目被保留以便放回的时长（参见[每个房间一个压缩器](#one-compactor-per-room)），从合并后房间发送的第一个更新开始计算。 |

无效的选项，或被拒绝的 `synced`，会触发 [error](#onerror)。

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

立即合并，不进行选举，没有宽限期，也没有阈值。  
它首先采纳房间当前的快照（必要时包括重新加入），并发送其对等存储仍在暂存的内容。  
它返回 `{ compacted: true, generation }`，其中 `generation` 统计快照的合并次数：初始文档为 `0`，每合并一次加一。  
否则它返回 `{ compacted: false, reason }`：

- `'destroyed'`：绑定已被销毁或已停止，以及绑定时被[拒绝](#onerror)的绑定，即使 `synced` 尚未解决；
- `'not-synced'`：`synced` 解决之前；
- `'no-snapshot'`：没有任何客户端载入过初始文档的房间。

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## 每个房间一个压缩器 {#one-compactor-per-room}

每个房间应当只运行一个压缩器，并且只在旧的压缩器停止之后再启动新的。没有任何机制强制这一点。  
在 Awareness 中彼此可见的压缩器里，只有 Yjs 客户端 id 最小的那个会自行合并；它离开，或其 `synced` 被拒绝时，下一个会立即接手。  
如果压缩器的 Awareness 中没有其他客户端，例如它自己的 socket 关闭并丢弃了所有客户端，则在其他客户端重新出现并且它观察了房间 `electionGraceMs` 之前，它不会自行合并任何内容。

两个彼此断开的压缩器，或在前一个实例仍在运行时重新启动的压缩器，仍可能各自进行合并。  
房间随后会保留两份快照中的一份，而快照落败的压缩器会在持有期间放回它合并过而胜出者没有的内容：持有期为 `retainMs`，并且最多是其最近的 1,000 个条目，无论每个条目有多大。  
因此，只要快照落败的压缩器是重新连接的那一个，并且分离期间合并的条目不超过 1,000 个，就不会丢失任何内容。  
如果它是一直在线的那一个，并且其持有期已过，则在它再次合并之前，房间的快照和历史都缺少它合并过的内容。错过这些编辑的客户端，或在此期间加入的客户端，都缺少它们，并且会暂缓其编辑已被该压缩器合并的每个写入方的后续编辑。压缩器的下一次合并会把它们全部带回，除非胜出的快照包含它所缺少的编辑，这会使它在该快照上重新打开，并永久丢失它合并过的内容。

压缩器会在自己的一次合并中放回内容，这次合并在它赶上胜出的快照之后进行，不进行选举，没有宽限期，也没有阈值，每个客户端都会通过 `rejoin('snapshot')` 在这次合并上重新打开。  
放回的编辑除这次合并外不会送达任何客户端，因此一直在线的客户端最终与其他客户端以及之后加入的客户端结果一致，即使另一个写入方的后续编辑建立在其中某条编辑之上，例如重命名另一个客户端添加的表。  
每次放回都会让每个客户端经历那次重新加入，以及[重新加入会丢失的内容](#offline-edits-and-rejoins)。两个压缩器同时放回时，每个客户端最终结果仍然一致，不过某条编辑可能先于它所依赖的编辑保持已应用状态。  
如果绑定在这次合并运行之前就被销毁或已停止，例如由 `rejoin` 监听器销毁它，则会改为单独放回这些编辑。不会丢失任何内容，但这时一直在线的客户端可能在另一个写入方依赖它的编辑之后才应用它，并且最终与之后加入的客户端结果不一致。

## 限制 {#limits}

- **视口只留在各自的屏幕上。** 滚动、缩放和标签页切换[永远不会被记录](#what-the-room-holds)，尽管通过 `getSharedStore` 接入的会话会发送它们（在那里它们也不会移动其他用户的视图或标签页）。每个阅读者保留自己的视口，绑定只在其 Awareness 状态中显示它，目前还没有任何东西读取。当 `Viewport` 或 `Canvas Type` [锁定](../../guide/guides/settings.md#锁定)关闭时，每个客户端的 `value` 保存自己的视口；在锁定开启时（新文档默认开启），每个客户端保存锁定的值。
- **快照每个绑定增加一个条目。** 对于曾向房间写入过的每个绑定，它都会记录其编辑合并到何处，并且从不丢弃任何一条。重新创建的绑定，或迁移到另一份初始文档的绑定，会重新计数，放回内容的每次合并也是如此。一个条目是一个 32 个字符的 id 加一个数字，因此一万个写入会话会给每份快照和每次合并增加几百 KB。
- **hub 与房间之间互不转发。** 同时绑定到房间和编码智能体的 [hub](../../mcp/live-and-headless.md#实时模式)（或通过 `getSharedStore()` 绑定到任何其他传输层）的元素，会应用两者的编辑，但两边都听不到对方的编辑，因为共享存储从不转发它收到的内容。
- **同时添加的内容可能排列不一致。** 两个客户端同时添加的表或备注，在每个客户端的图中可能处于不同的顺序，与通过 `getSharedStore` 接入的会话相同，参见[并发编辑](./collaborative-editing.md#concurrent-edits)。
- **同时进行的颜色等少数更改可能最终不一致。** 颜色更改记录时不带版本，每个客户端在应用时用自己的版本为其盖章。因此，对同一个表、备注或表分组同时进行两次重新着色，可能使各客户端，以及之后加入并重放日志的客户端，最终颜色不同。每个客户端按听到的顺序应用的其他更改也是如此，例如同一个表或索引内的两次列移动，或对数据库的两次更改，参见[并发编辑](./collaborative-editing.md#concurrent-edits)。
- **离开的光标要等服务器。** 只要 Awareness 丢弃一个对等方的光标，绑定就会立即清除它。如果服务器在 socket 关闭时只移除该 socket 最初添加的 Awareness 状态，那么已重新连接的客户端在离开后会一直留在其他人的屏幕上，直到 Awareness 在 30 秒后将其超时。如果服务器移除 socket 最后写入的每个状态（更新与添加一样算数），则会立即清除。

## 导出 {#exports}

| 导出 | 说明 |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | 绑定 `<erd-editor>` 元素，参见[使用](#usage)。返回 [ErdYjsBinding](#erdyjsbinding)。 |
| `bindPeerStore(peer, doc, options?)` | 绑定来自 `@dineug/erd-editor/peer.js` 的对等存储，参见[压缩房间](#compacting-a-room)。返回同样的绑定，外加 [compact](#compact)（`ErdYjsPeerBinding`）。 |
| `ERD_YJS_FORMAT` | 此版本写入的 `Y.Doc` 格式，为 `1`；绑定会拒绝以其他格式写入的房间。 |

类型：`BindOptions`、`PeerBindOptions`、`CompactOptions`、`CompactResult`、`BindingEvents`、`RejoinReason`、`ErdYjsBinding`、`ErdYjsPeerBinding`。
