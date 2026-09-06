---
sidebar_position: 2
description: 在主线程之外将实时编辑器复制到无 DOM 的 store，并将文档序列化以便存储。
---

# 远程存储

每次变更都发送编辑器的全部状态并不高效。  
为此，编辑器提供了实时数据复制 API。

## 安装

```sh
npm install @dineug/erd-editor
```

用于数据复制的 store 位于 `@dineug/erd-editor/engine.js` 子路径，而不是包的根路径。  
该入口不接触 DOM，因此可以在 Web Worker 或主线程之外的任何地方运行。  
若改为导入包的根路径，则会注册 `<erd-editor>` 自定义元素，而它需要 DOM。

## 使用

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

## 复制实时编辑器

这些操作来自实时编辑器的 shared store。  
参见[协同编辑](./collaborative-editing.md)。

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

跨越边界的只有变更本身，而不是整个文档。  
副本在自己这一侧应用变更并序列化结果，`change` 则会告知何时值得写入。

## InjectEngineContext

### toWidth

以像素为单位测量文本的 width。  
store 没有 DOM，无法自行测量文本，因此每当名称、数据类型、默认值或注释发生变更时，都会通过该函数重新计算列宽度。

测量方式需与编辑器保持一致：使用编辑器字体栈中的 `400 12px`，四舍五入后再加上 2px 的内边距。  
否则复制出来的列宽度会与屏幕上的宽度产生偏差。

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

`text.length * 10` 是没有 canvas 可用时的回退方案。  
对于文档只被存储、不被渲染的 store 来说，这已经足够。

## ReplicationStore

### value getter

序列化当前的编辑器状态。  
返回的是可以直接存储的 JSON 字符串，而不是解析后的对象。

```js
const data = replicationStore.value;
```

序列化时会应用文档自身的 `ignoreSaveSettings`。  
设置了滚动标志位时，视图原点会写为 `0, 0`，设置了缩放标志位时，缩放级别会写为 `1`。  
关于这些标志位，参见 [Schema](./schema.md)。

### setInitialValue

加载此前保存的编辑器状态。

```js
replicationStore.setInitialValue('json...');
```

传入空字符串或任何非字符串的值时不会抛出错误，而是加载一个空文档。

加载时还会对文档执行一次垃圾回收。  
不再出现在 `doc` 中且四天以上未被改动的实体会被清除，因此协作者正在进行的变更不会被回收。  
该回收过程以异步方式完成。

加载与回收都不会触发 `change`。  
如果希望将回收后的文档写回存储，需要在加载后自行读取 `replicationStore.value`。

### on@change

订阅编辑器的状态变更事件。

```js
const unsubscribe = replicationStore.on({
  change: () => {
    const data = replicationStore.value;
    // save...
  },
});
```

`change` 有 200ms 的防抖，因此短时间内的大量操作只会汇总为一次通知。  
它只在会改变文档的操作上触发，因此中继过来的状态信息操作不会将其唤醒。  
调用返回的函数即可取消订阅。

### dispatch, dispatchSync

将远程编辑器的变更应用到 replicationStore。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` 会延迟到微任务中执行，`dispatchSync` 则会立即应用这批变更。

可以不做过滤，直接把 shared store 的操作流交给它们。  
两个方法都只保留会改变文档的操作并丢弃其余部分，因此协同会话所携带的状态信息（每位用户的鼠标光标、焦点、选中内容与选择框）传入后不会产生任何效果。

### destroy

彻底销毁 replicationStore 实例。

```js
replicationStore.destroy();
```

销毁后 store 不再触发 `change`，也会忽略后续的 dispatch。  
文档会停留在最后的值上，而不会抛出错误。  
若要重新开始，需要创建新的 store。
