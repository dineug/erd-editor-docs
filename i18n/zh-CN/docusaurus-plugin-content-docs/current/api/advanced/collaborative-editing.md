---
sidebar_position: 1
description: 通过 getSharedStore 在编辑器实例之间中继变更，用 runtimeValue 为加入的编辑器载入初始文档，并显示每位协作者的光标、焦点、选中内容与选择框。
---

# 协同编辑

`getSharedStore()` 会把编辑器变成协同编辑会话中的一个节点。  
它将所有变更以操作流的形式发布，并应用其他编辑器发来的操作，连接两端的传输方式（WebSocket、WebRTC，或其他任何能够传递 JSON 的方式）需要自行准备。  
它是 [ErdEditorElement](../erd-editor-element.md) 的方法之一，当中继的变更还需要保存时，可与[远程存储](./remote-storage.md)配合使用。

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

操作是描述文档中一处变更的普通可序列化对象，因此在发往传输方式的途中可以原样通过 `JSON.stringify`。  
操作会成批到达，`subscribe` 传出的是一个数组，而该数组本身就是一个单位，因此要整体中继，并在另一端整体 dispatch。  
操作所携带的内部信息正是维持编辑器之间同步的关键，因此不要读取或改写它，而应将其视为不透明的值原样传递。

编辑器所做的有些事情只留在该编辑器上。  
把表、备注或表分组移到最前面（选中它们时就会这样）不会发送出去。  
[Schema SQL](../../guide/guides/schema-sql.md) 标签页中 `Statements`、`Header` 和 `Tables` 的选择同样不会发送，它们属于做出这些选择的那个窗口。  
从 `4.1.0` 起，[资源管理器](../../guide/guides/explorer.md)同样只留在其所在的编辑器上：它是否打开、宽度、折叠的行、键盘焦点所在的行、树的滚动位置，以及其搜索与选项，都不会发送出去。  
跳转到外键时会[点亮](../../guide/guides/relationship-editing.md#reading-a-connector)其关系的连接线，这种点亮也不会发送出去。  
滚动、缩放或标签页切换会发送出去，但永远不会移动其他用户的视图或标签页。这也包括从资源管理器跳转时造成的滚动，以及从其他标签页打开资源管理器时切换到 ERD 标签页。

[锁定](../../guide/guides/settings.md#锁定)是共享的：每个编辑器上都以对某项设置最后一次的锁定或解锁为准，而锁定会携带开启它的那个编辑器上的值，因此每个编辑器和副本保存的都是同一个值。  
因此，`Viewport` 锁定保存的是开启它的那个编辑器的视图，`Canvas Type` 锁定保存的则是该编辑器在进入 Settings 标签页（锁定就在这里开启）之前所在的最后一个标签页。  
关闭 `Language`、`Table Name Case`、`Column Name Case` 或 `Bracket Type` 锁定时，还会把每个编辑器上的该设置改为关闭它的那个编辑器上显示的值，因此它们保存的仍是同一个值。关闭 `Viewport` 或 `Canvas Type` 不会移动任何人的视图或标签页。

对 `Before tables` 或 `After tables` 脚本的编辑，会在其输入框失去焦点时整体发送出去。两个脚本各自独立裁定结果，因此协作者对其中一个的编辑永远不会覆盖另一个。

在 Visualization 标签页的 [Flow 模式](../../guide/guides/visualization.md#flow-never-edits-the-document)中所做的任何操作都不是文档变更，因此处于 Flow 中的编辑器不会向其他编辑器发送任何变更，而其他编辑器发来的变更在此期间仍会继续应用。  
唯一的例外是离开 Flow 切换到其他标签页：这次标签页切换会像其他变更一样发送出去。  
外部链接卡片按钮、在 `#`、`@` 或 `:` 之后选中的[快速搜索](../../guide/guides/quick-search.md#searching-the-diagram)结果，以及打开[资源管理器](../../guide/guides/explorer.md#opening-and-closing)，都会离开 Flow 并切换到 ERD 标签页。卡片按钮或快速搜索结果在那里造成的滚动也会发送出去。

## 一个页面中的两个编辑器

这里从 subscribe 到 dispatch 的连接代替了网络，因此无需传输方式即可了解会话的结构。

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

这里的两个编辑器都从同一个新的空文档开始，因此都无需载入初始文档。  
有三个或更多编辑器时，要把每个编辑器的批次发送给其他所有编辑器：编辑器从不转发它收到的内容。

## 为协作者载入初始文档 {#seeding-a-collaborator}

shared store 只在变更发生时中继这些变更，从不把文档当前的状态交给加入者，因此加入已在进行中的会话的编辑器，必须先拿到文档。  
从 `4.0.0` 起，请用会话中已有编辑器的 [`runtimeValue`](../erd-editor-element.md#runtimevalue) 为它载入初始文档，而不是用 `value` 或保存的文件。

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

运行时值仍保留着自文档打开以来被删除的内容，因此当另一个编辑器之后对一次删除执行 Undo 时，加入者会连同名称和列一起恢复该表。  
[`value`](../erd-editor-element.md#value) 是文件所保存的形式，不含已删除的实体，因此用它或用文件载入初始文档的加入者，恢复出来的会是一个空的、没有名称的表。  
写入存储的仍应是 `value`：`runtimeValue` 只用于为另一个编辑器、第二个视图或 [replicationStore](./remote-storage.md) 载入初始文档。  
VS Code、Obsidian、JetBrains IDE 与 Web 应用中的编辑器，就是这样为已打开文档的第二个视图载入初始文档的。

`setInitialValue` 不会被中继，因此为加入者载入初始文档不会改变其他编辑器上的任何内容。  
从 `4.0.0` 起，它还会丢弃该编辑器的协同寄存器，这些寄存器用于裁定并发编辑的结果。如果该编辑器的 shared store 已经有过订阅者，store 会像首次 [subscribe](#subscribe) 时那样，再次向其他编辑器请求它们的协同寄存器，因此在会话中途重新加载的编辑器会与其他编辑器以相同的方式裁定编辑结果。  
为 `value` 赋值会保留这些寄存器，但与 `setInitialValue` 不同，它会被中继：一旦该编辑器拥有 shared store，会话中的每个编辑器都会加载所赋的文档，因此切勿以这种方式为加入者载入初始文档。

## 混用不同版本 {#mixing-releases}

编辑器只应用其自身版本所认识的操作类型，因此在混用不同版本的会话中，较旧的编辑器会错过通过较新类型传递的任何内容。

从 `3.10.0` 起，对关系的 [ON DELETE 或 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) 所做的修改，会以 `relationship.changeOnDelete` 和 `relationship.changeOnUpdate` 这两种新操作类型之一传递，`relationship.add` 也可以同时携带这两项。原样传递操作的中继无需为此做任何额外处理。  
`3.10.0` 之前的编辑器会忽略这些操作类型与字段：它永远无法得知关系的 ON DELETE 或 ON UPDATE，由它保存的文档也不会包含这两项。较旧的编辑器添加的关系到达时不带这两项，因此两者都从 `Not set` 开始。

`3.10.0` 编辑器发送的其他所有变更，都通过较旧的编辑器已经认识的操作类型传递。  
[查找与替换](../../guide/guides/find-and-replace.md#replacing)中的 `Replace All` 会把它所做的修改作为一个批次发送，其中的重命名、注释和备注操作与手动编辑时发送的操作相同。`Alternate Key` 和 `Referential Actions` [显示选项](../../guide/guides/table-related-functions.md#table-view-options)通过已有的 `settings.changeShow` 操作传递。

从 `4.0.0` 起，以下变更通过新的操作类型传递，原样传递操作的中继无需为此做任何额外处理：

- [表分组](../../guide/guides/table-groups.md)的添加、移动、调整大小、重命名、更改颜色或删除：`tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.resize`、`tableGroup.changeName`、`tableGroup.changeColor` 和 `tableGroup.remove`；表加入或离开分组：`table.changeGroup`；
- 在已有关系上执行的[映射列](../../guide/guides/relationship-editing.md#map-columns) `Save`，它会同时设置该关系的两个列列表：`relationship.changeColumns`；
- [锁定](../../guide/guides/settings.md#锁定)的开启或关闭：`settings.changeLockSettings`；
- 对 [Schema SQL](../../guide/guides/schema-sql.md) 标签页中 `Before tables` 或 `After tables` 脚本的编辑：`settings.changeDDLScript`。

`Table Groups` 和 `Memos` 显示选项通过已有的 `settings.changeShow` 操作传递。  
`settings.changeIgnoreSaveSettings` 是锁定取代 `Save Scroll Information` 和 `Save Zoom Information` 开关之前由这两个开关发送的操作，现在已不再发送；`settings.changeRelationshipOptimization` 也已移除。`4.0.0` 编辑器收到这两者中的任何一个时，都不会做出任何改变。

`4.0.0` 之前的编辑器会忽略这些新的操作类型：它永远看不到表分组，也不知道哪些表属于分组，不过拖动分组时，分组中的表在它那里仍会移动，因为拖动分组时也会发送这些表的 `table.move`。  
在映射列中执行 `Save` 后，它仍保留关系原来的列，而当原有映射中的某一列在它那里被删除时，该关系会在每个编辑器上消失。它没有锁定，也没有脚本。  
由它保存的文档不包含上述任何内容，`4.0.0` 编辑器打开这样的文档时，所有锁定都处于开启状态。  
会话中的每个编辑器，以及存储该会话文档的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都应使用 `4.0.0` 或更高版本。

`4.1.0` 编辑器不会发送任何新的操作类型，因此 `4.0.0` 和 `4.1.0` 的编辑器与副本可以共处同一会话，不会错过任何内容。  
它的[查找与替换](../../guide/guides/find-and-replace.md#replacing)还会搜索索引名和表分组名称，`Replace` 和 `Replace All` 会通过 `4.0.0` 编辑器已经能够应用的 `index.changeName` 和 `tableGroup.changeName` 操作重命名它们。

## SharedStoreConfig

### getNickname

设置在其他编辑器中显示在该用户鼠标光标旁的昵称。  
昵称缺失或为空时，其他用户会看到 `user`。

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker

将该用户的鼠标光标发送到其他编辑器。默认值为 `true`。  
其他用户发来的光标始终会显示在 ERD 画布上。

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker

发送该用户正在处理的内容。默认值为 `true`。  
获得焦点的表与单元格、选中的表、备注与表分组，以及在画布上拖动的选择框，都会发送到其他编辑器并绘制在那里。  
每位用户都有各自的颜色，因此可以彼此区分：获得焦点的表带有外框线，获得焦点的单元格带有下划线，选中的表、备注与表分组带有环形边框，选择框则是虚线矩形。  
其他用户发来的状态信息始终会绘制在你的画布上，无论该选项是否开启。  
在 Visualization 标签页的 Flow 模式中，其他用户的焦点与选中内容会绘制在表卡片上，但他们的选择框不会。你在那里选中的表仍会发送出去，而你在那里拖出的选择框则不会。

```js
editor.getSharedStore({ focusTracker: false });
```

同时关闭两个 tracker，即可把 shared store 当作不发布自身状态信息的纯中继使用。  
其他编辑器发来的状态信息仍会接收并绘制。  
VS Code、Obsidian、JetBrains IDE 与 Google Drive 中的编辑器就是这样工作的。

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

光标、焦点、选中内容与选择框这些状态信息，与文档变更走在同一条流上，但它们是临时的。  
它们不会进入文档、Undo 历史记录或 `editor.value`，因此传输方式可以将其丢弃，replicationStore 也会忽略它们。

## SharedStore

### connection, disconnect

这些方法用于设置当前的连接状态。  
处于断开状态时，变更会被缓存在内部。  
一旦恢复可发送状态，缓存的变更会发布给订阅者。  
默认状态为已连接（`connection`）。

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync

将其他编辑器实例的变更应用到当前编辑器实例。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

订阅编辑器的变更。  
在至少存在一个订阅者之前，不会有任何内容离开编辑器，在此之前发生的变更会被缓存。  
首次 subscribe 还会向其他编辑器请求它们的协同寄存器，这些寄存器用于裁定并发编辑的结果，因此后加入的一方会以相同的方式裁定这些编辑。  
它不会带来文档，因此要先为后加入的一方[载入初始文档](#seeding-a-collaborator)。  
从 `4.0.0` 起，在首次 subscribe 之后，每当 `setInitialValue` 向其编辑器加载文档时，store 都会再次请求。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

立即发送该 store 仍在暂存的流批次，而不是等到它们的静默期结束之后。  
从 `3.9.2` 起，它对 `getSharedStore` 返回的 store 生效；在 `3.9.1` 中，该方法虽然存在于类型上，但不起任何作用。  
移动表、备注或表分组，更改其颜色，调整备注大小，以及滚动或缩放视图，都会以由细小变更组成的流的形式到达。调整表分组的大小则不会：它只在拖动结束时发送一次。  
store 会把每个流合并为一个批次并暂存起来，直到该流静默 200ms 为止。这一过程分为两个阶段，因此批次会在最后一次变更之后约 400ms 发出。  
调用它会同时结束两个阶段中的这段等待。store 处于连接状态时，订阅者会在调用返回之前收到该批次。没有任何暂存内容时，调用不会发送任何内容。  
`destroy`（无论是 store 自身的还是编辑器的）会丢弃仍在暂存的批次，因此在放弃某个 store、而其他编辑器仍应保留最后一次变更时（例如关闭标签页时），需先调用此方法。

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy

彻底销毁 sharedStore 实例。  
编辑器本身不受影响，因此退出会话后文档仍可继续编辑。  
当编辑器发出的最后一个 sharedStore 被销毁时，鼠标与焦点 tracker 会停止。  
该 store 仍在暂存的流批次会随之一并丢弃；要将其发送出去，需先调用 [flushStreamBuffers](#flushstreambuffers)。

```js
sharedStore.destroy();
```
