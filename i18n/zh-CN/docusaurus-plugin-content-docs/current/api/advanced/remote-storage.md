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

## 复制实时编辑器

这些操作来自实时编辑器的 shared store。  
参见[协同编辑](./collaborative-editing.md)。

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

跨越边界的只有变更本身，而不是整个文档。  
副本在自己这一侧应用变更并序列化结果。  
`change` 会把该结果作为 `value` 交给你，`changed` 则会告知何时值得写入。

## InjectEngineContext

### toWidth

以像素为单位测量文本的 width。  
store 没有 DOM，无法自行测量文本，因此每当名称、数据类型、默认值或注释发生变更时，都会通过该函数重新计算列宽度。  
每当 [setInitialValue](#setinitialvalue) 加载文档时，它还会重新测量所有表和列。  
因此，在文本测量结果不同的环境中（另一台机器或另一个发布版本）保存的文档，读回时会采用此 store 的宽度，`value` 在任何编辑之前就已与存储的文本不同。  
这正是 [on@change](#onchange) 以加载时为基准、而不是以文件为基准来判断 `changed` 的原因。

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

传入空字符串或任何非字符串的值时不会抛出错误，而是加载一个新的空文档。  
从未被赋予过值的 store 也以同样的新文档开始。  
从 `3.10.0` 起，该文档既不保存滚动位置也不保存缩放级别：它的 `ignoreSaveSettings` 的两个标志位都已设置，相当于关闭了 [`Save Scroll Information`](../../guide/guides/settings.md#保存滚动信息) 和 [`Save Zoom Information`](../../guide/guides/settings.md#保存缩放信息)。在 `3.10.0` 之前，两者都会保存。  
已存储的文档会沿用其中写明的开关，一个开关都没有写明的文档（包括 v2 文档）则两者都保存。  
不是 JSON 的文本（例如残留合并冲突标记的文件）同样不会抛出错误：解析错误只会输出到控制台，文档会被清空，设置则保持原样。

加载时还会对文档执行一次垃圾回收。  
不再出现在 `doc` 中且四天以上未被改动的实体会被清除，因此协作者正在进行的变更不会被回收。  
从 `3.10.0` 起，该回收过程会在 `setInitialValue` 返回之前完成。  
加载时的其他改写也是如此，它们在 `3.10.0` 之前会在随后的几毫秒内陆续执行：根据关系重新读取的列上的外键标记；通过 `toWidth` 重新测量的所有表和列的宽度；每条连接线与其表相接的位置；以及每个关系的识别关系标志和其父表一端的符号。  
因此，调用之后立即读取的 `replicationStore.value` 已经是回收完毕、稳定下来的文档。紧随加载之后到达的操作（例如重放的滚动）会以该文档为基准进行比较，因此加载自身的改写绝不会被报告为 [`changed`](#onchange)。

加载以及上述任何改写都不会触发 `change`。  
如果希望将该文档写回存储，需要在 `setInitialValue` 返回后自行读取 `replicationStore.value`。

### on@change

订阅编辑器的状态变更事件。

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` 有 200ms 的防抖，因此短时间内的大量操作只会汇总为一次通知。  
它只在可能改变文档的那类操作上触发，因此中继过来的状态信息操作不会将其唤醒。  
调用返回的函数即可取消订阅。

从 `3.10.0` 起，监听器会接收到一个 `ReplicationChange`，它是 `@dineug/erd-editor/engine.js` 与 `ReplicationStore` 一同导出的类型。  
在 `3.10.0` 之前，监听器不接收任何参数，忽略该参数的监听器仍可照常工作。  
`value` 是序列化后的文档，与此时 `replicationStore.value` 返回的字符串相同，因此无需再次序列化。  
如果自上一次 `change`（或自加载）以来的操作使 `value` 逐字节保持原样，则 `changed` 为 `false`。

被文档的保存开关排除在 `value` 之外的滚动或缩放仍会触发 `change`，此时 `changed` 为 `false`，因此只在 `changed` 为 `true` 时写入。  
`Save Scroll Information` 关闭时，滚动不会改变任何内容。  
缩放同样会移动视图原点，因此只有在 `Save Zoom Information` 和 `Save Scroll Information` 都关闭时，它才不会改变任何内容。仅关闭 `Save Zoom Information` 时，缩放仍会改变 `value`。  
打开编辑器的另一个标签页总会改变 `value`，因为两个开关都不涵盖它。

`changed` 从不与你存储的文件进行比较，因为文件在加载后就可能已经与 `value` 不同：如 [toWidth](#towidth) 所述，在文本测量结果不同的环境中保存的文件会如此，任何不带视图原点的文件也会如此。  
若与文件逐字节比较，就会把被开关排除在外的滚动也算作一次编辑。  
如果 `setInitialValue` 在某个 `change` 仍处于等待状态时执行，并且在其到期之前没有 dispatch 任何操作，那么该 `change` 仍会到来，携带加载后的 `value`，且 `changed` 为 `false`。

### dispatch, dispatchSync

将远程编辑器的变更应用到 replicationStore。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` 会延迟到微任务中执行，`dispatchSync` 则会立即应用这批变更。

可以不做过滤，直接把 shared store 的操作流交给它们。  
两个方法都只保留可能改变文档的那类操作并丢弃其余部分，因此协同会话所携带的状态信息（每位用户的鼠标光标、焦点、选中内容与选择框）传入后不会产生任何效果。

从 `3.10.0` 起，被保留的操作包括 `relationship.changeOnDelete` 和 `relationship.changeOnUpdate`，并且 `relationship.add` 带有 `onDelete` 和 `onUpdate`。  
更早版本的 store 会丢弃这些操作并忽略这些字段，因此会丢失关系的 [ON DELETE 与 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) 操作。  
请让副本运行在与编辑器相同或更新的版本上。

### destroy

彻底销毁 replicationStore 实例。

```js
replicationStore.destroy();
```

销毁后 store 不再触发 `change`，也会忽略后续的 dispatch。  
文档会停留在最后的值上，而不会抛出错误。  
若要重新开始，需要创建新的 store。
