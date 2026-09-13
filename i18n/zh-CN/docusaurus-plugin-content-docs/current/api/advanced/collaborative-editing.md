---
sidebar_position: 1
description: 通过 getSharedStore 在编辑器实例之间中继变更，显示每位参与者的光标、焦点、选中内容与选择框。
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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

操作是描述文档中一处变更的普通可序列化对象，因此在发往传输方式的途中可以原样通过 `JSON.stringify`。  
操作会成批到达，`subscribe` 传出的是一个数组，而该数组本身就是一个单位，因此要整体中继，并在另一端整体 dispatch。  
操作所携带的内部信息正是维持编辑器之间同步的关键，因此不要读取或改写它，而应将其视为不透明的值原样传递。

在 Visualization 标签页的 [Flow 模式](../../guide/guides/visualization.md#flow-never-edits-the-document)中所做的任何操作都不是文档变更，因此处于 Flow 中的编辑器不会向其他编辑器发送任何变更，而其他编辑器发来的变更在此期间仍会继续应用。  
唯一的例外是带你回到 ERD 标签页的外部链接卡片按钮：它造成的标签页切换与滚动会像其他变更一样发送出去。

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

## SharedStoreConfig

### getNickname

设置在其他编辑器中显示在该用户鼠标光标旁的 nickname。  
nickname 缺失或为空时，其他用户会看到 `user`。

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
获得焦点的表与单元格、选中的表与备注，以及在画布上拖动的选择框，都会发送到其他编辑器并绘制在那里。  
每位用户都有各自的颜色，因此可以彼此区分：获得焦点的表带有外框线，获得焦点的单元格带有下划线，选中的表与备注带有环形边框，选择框则是虚线矩形。  
从其他用户到达的状态信息始终会绘制在自己的画布上，无论该选项是否开启。  
在 Visualization 标签页的 Flow 模式中，其他用户的焦点与选中内容会绘制在表卡片上，但他们的选择框不会。你在那里选中的表仍会发送出去，而你在那里拖出的选择框则不会。

```js
editor.getSharedStore({ focusTracker: false });
```

同时关闭两个 tracker，即可把 shared store 当作不发布自身状态信息的纯中继使用。  
其他编辑器发来的状态信息仍会接收并绘制。  
VS Code 与 IntelliJ 编辑器就是这样工作的。

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
首次 subscribe 还会向其他编辑器请求当前状态，因此后加入的一方也能跟上进度。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### destroy

彻底销毁 sharedStore 实例。  
编辑器本身不受影响，因此退出会话后文档仍可继续编辑。  
当编辑器发出的最后一个 sharedStore 被销毁时，鼠标与焦点 tracker 会停止。

```js
sharedStore.destroy();
```
