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
该入口点不接触 DOM，因此可以在 Web Worker 或主线程之外的任何地方运行。  
若改为导入包的根路径，则会注册 `<erd-editor>` 自定义元素，而它需要 DOM。

## 使用

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
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
replicationStore.setInitialValue(editor.runtimeValue);

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

从 `4.0.0` 起，请像上面这样用编辑器的 `runtimeValue` 为副本载入初始文档，而不是用存储的文件或编辑器的 `value`。  
文件缺少自保存以来所做的编辑，`value` 则缺少会话中已删除的实体。  
用不含某个已删除表的文档载入初始文档的副本，在某个编辑器对该删除执行 Undo 时，会把该表恢复为没有名称和列的样子，并按此保存。  
从 `4.2.0` 起，从 [Dictionary](../../guide/guides/dictionary.md) 标签页的工作表中删除的词根、术语或域也是如此。  
当某个编辑器对该删除执行 Undo 时，用不含该行的文档载入初始文档的副本会重新列出该行，但该行为空；由于 `value` 会省略空行，副本保存的文档中不含该行。  
对于域，在该副本中，曾关联该域的列和术语也会保持未关联状态，因为副本从未持有这些关联，而 Undo 也不会发送它们。

## InjectEngineContext

### toWidth

以像素为单位测量字符串的宽度。  
store 没有 DOM，无法自行测量文本，因此每当名称、数据类型、默认值或注释发生变更时，都会通过该函数重新计算列宽度。  
从 `4.2.0` 起，这也包括表或列的[逻辑名](../../guide/guides/logical-names.md)。  
每当列关联或取消关联域，以及每当该域被添加、重命名或删除时，它都会测量该列的域单元格，域单元格显示该列所关联的域的名称。  
每当 [setInitialValue](#setinitialvalue) 加载文档时，它还会重新测量所有表和列。  
从 `4.0.0` 起，宽度只保留在 [runtimeValue](#runtimevalue-getter) 中，从不出现在 `value` 中。  
因此，由此版本保存的文档读回后得到的 `value` 逐字节相同，无论它是在哪里保存的，也无论那里的文本测量结果如何。

测量方式需与编辑器保持一致：使用编辑器字体栈中的 `400 12px`，四舍五入后再加上 2px 的内边距。  
否则 `runtimeValue` 中的宽度会与屏幕上的宽度产生偏差。

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

从 `4.0.0` 起，`value` 是存储形式，即文件所保存的文档形式，与元素的 [value](../erd-editor-element.md#value) 返回的文本相同。  
它只包含现存的实体，并按固定顺序排列，不包含已删除的实体、叠放顺序，以及加载时会重新推算的任何内容，例如 [toWidth](#towidth) 测量的宽度。  
从 `4.2.0` 起，它还包含逻辑名、每个名称是否由词典生成、域关联，以及 [Dictionary](../../guide/guides/dictionary.md) 标签页中的词根、术语和域。  
从 `4.2.0` 起，它还会省略实体中每个空的文本字段、不含任何内容的每个 `doc` 列表和集合，以及所有集合都为空时的 `collections` 本身。  
它以两个空格缩进，每个词典行单独占一行，并以换行符结尾，因此同一文档总是得到相同的字节。  
关于它包含的内容，参见[存储形式与运行时值](./schema.md#存储形式与运行时值)。

[锁定](../../guide/guides/settings.md#锁定)开启的每项设置都按锁定时的值写出，其他所有设置则按其当前状态写出。  
`Viewport` 锁定同时涵盖视图原点和缩放级别，标签页、Code Generator 的语言、两种名称大小写以及括号类型则各有自己的锁定。  
从 `4.2.0` 起，[名称显示](../../guide/guides/logical-names.md#name-view)也有自己的锁定，即 `Name View` 锁定，它在新文档中处于开启状态。  
锁定取代了文档的 `ignoreSaveSettings`，从 `4.0.0` 起，该字段既不会被读取也不会被写入。  
在 `4.0.0` 之前，`value` 是 store 所持有的整个文档，并应用了该字段的滚动和缩放标志位。

### runtimeValue getter

从 `4.0.0` 起，按副本所持有的样子序列化文档，包括已删除的实体以及加载时推算出的所有内容。  
每个锁定的设置在这里同样按其锁定的值写出。

```js
const snapshot = replicationStore.runtimeValue;
```

将它传给之后加入的编辑器或另一个 store 的 `setInitialValue`，为其载入初始文档，参见[协同编辑](./collaborative-editing.md)。  
切勿把它作为文件存储：它携带已删除的实体，所发布的 [JSON Schema](./schema.md#json-schema) 会拒绝它。  
正是这些已删除的实体，使之后发来的对删除的 Undo 能在以它载入初始文档的 store 中完整地恢复该实体。  
它们会一直保留，直到下次从文件打开该文档为止，因为文件的形式不包含它们。

### setInitialValue

加载此前保存的编辑器状态。

```js
replicationStore.setInitialValue('json...');
```

它接受存储形式、运行时值，或较早版本保存的文档（包括 v2 文档）。  
传入空字符串或任何非字符串的值时不会抛出错误，而是加载一个新的空文档。  
从未被赋予过值的 store 也以同样的新文档开始。  
从 `4.0.0` 起，该文档的所有[锁定](../../guide/guides/settings.md#锁定)都处于开启状态，因此在它所复制的编辑器滚动、缩放、切换标签页或更改这些设置期间，其 `value` 会保留它开始时的视图、标签页、Code Generator 的语言、名称大小写和括号类型。在 `3.10.0` 中，它既不保存滚动位置也不保存缩放级别，而在此之前两者都会保存。  
从 `4.2.0` 起，在编辑器切换各自的名称显示期间，它还会保留自己的名称显示，即 `Physical Names`。  
已存储的文档会沿用其中写明的锁定。  
一个锁定都没有写明的文档（即 `4.0.0` 之前保存的任何文档，包括 v2 文档）加载时所有锁定都处于开启状态：无论它保存的是什么，其视图原点都为 `0, 0`，缩放级别为 `1`，标签页为 ERD；其 Code Generator 的语言、名称大小写和括号类型则按保存时的值。  
`4.2.0` 之前保存的文档没有写明 `Name View` 锁定，因此加载时该锁定处于开启状态，并且显示方式为 `Physical Names`，即使是保存时其他所有锁定都已关闭的文档也是如此。  
从 `4.0.0` 起，`setInitialValue` 还会丢弃为前一个文档所持有的协同寄存器，与元素的 [setInitialValue](../erd-editor-element.md#setinitialvalue) 相同。  
不是 JSON 的文本（例如残留合并冲突标记的文件）同样不会抛出错误：解析错误只会输出到控制台，文档会被清空，设置则保持原样。

从 `4.0.0` 起，加载时不再执行垃圾回收，因此已删除的实体会保留在 [runtimeValue](#runtimevalue-getter) 中。  
在此之前，加载时会清除不再出现在 `doc` 中且四天以上未被改动的实体。

加载时的改写会在 `setInitialValue` 返回之前完成：根据每列的选项和关系重新读取的列上的键标记；通过 `toWidth` 重新测量的所有表和列的宽度；每条连接线与其表相接的位置；以及每个关系的识别关系标志和其父表一端的符号。  
这些都不属于 `value`，但调用之后立即读取的 `replicationStore.runtimeValue` 已经包含了它们全部。  
紧随加载之后到达的操作（例如重放的滚动）会以加载后的文档为基准进行比较，因此加载本身绝不会被报告为 [`changed`](#onchange)。

加载以及上述任何改写都不会触发 `change`。  
如果希望将加载后的文档以存储形式写回存储，需要在 `setInitialValue` 返回后自行读取 `replicationStore.value`。

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
它只在可能改变文档的那类操作上触发，另外还有较旧的编辑器可能仍会发送的 `settings.changeIgnoreSaveSettings`（参见 [dispatch, dispatchSync](#dispatch-dispatchsync)）。  
中继过来的状态信息操作或 `editor.mergeLWW` 永远不会将其唤醒。  
调用返回的函数即可取消订阅。

从 `3.10.0` 起，监听器会接收到一个 `ReplicationChange`，它是 `@dineug/erd-editor/engine.js` 与 `ReplicationStore` 一同导出的类型。  
在 `3.10.0` 之前，监听器不接收任何参数，忽略该参数的监听器仍可照常工作。  
`value` 是以存储形式序列化后的文档，与此时 `replicationStore.value` 返回的字符串相同，因此无需再次序列化。  
如果自上一次 `change`（或自加载）以来的操作使 `value` 逐字节保持原样，则 `changed` 为 `false`。

被[锁定](../../guide/guides/settings.md#锁定)排除在 `value` 之外的变更仍会触发 `change`，此时 `changed` 为 `false`，因此只在 `changed` 为 `true` 时写入。  
这类变更包括：`Viewport` 锁定时的滚动或缩放，`Canvas Type` 锁定时的标签页切换，以及在各自的锁定开启时对 Code Generator 的语言、某种名称大小写或括号类型的更改。  
从 `4.2.0` 起，`Name View` 锁定时的名称显示切换也属于此类：编辑器仍会发送它，但副本会像其他编辑器一样丢弃它。  
在只读编辑器中进行的名称显示切换同样会被丢弃，无论其锁定如何。  
元素的 [change](../erd-editor-element.md#change) 事件会略过这类变更，但副本仍会报告它。  
新文档以及 `4.0.0` 之前保存的文档中，所有锁定都处于开启状态；`4.2.0` 之前保存的任何文档中，`Name View` 都处于锁定状态。  
`Viewport` 未锁定时，滚动或缩放会改变 `value`；`Canvas Type` 未锁定时，打开编辑器的另一个标签页也会改变 `value`；`Name View` 未锁定时，来自非只读编辑器的名称显示切换同样会改变 `value`。  
开启或关闭锁定同样会改变 `value`。

从 `4.0.0` 起，`changed` 比较的是存储形式，其中既不包含已删除的实体，也不包含叠放顺序。  
因此，在一次 `change` 之内添加后又删除的表、落在另一位协作者已删除的实体上的编辑，以及只改变叠放顺序的中继加载，结果也都是 `changed` 为 `false`。  
从 `4.2.0` 起，在 Dictionary 标签页的工作表中添加后保持为空的行也是如此，因为存储形式会省略不含任何内容的行。

`changed` 从不与你存储的文件进行比较，因为文件在加载后就可能已经与 `value` 不同：较早版本保存的文件（包括 v2 文件）会如此，以字节顺序标记开头的文件和手工编辑过的文件也会如此。  
从 `4.2.0` 起，这也包括 `4.0.0` 或 `4.1.0` 保存的文件，因为 `value` 会省略这类文件中实体的空文本字段，以及其中空的 `doc` 列表和集合。  
若与这样的文件逐字节比较，就连被锁定排除在外的滚动也会被算作一次编辑。  
第一个 `changed` 为 `true` 的 `change` 会以存储形式交回这样的文件，因此写入它会将文件重写一次。  
如 [toWidth](#towidth) 所述，由此版本保存的文件不会出现差异，无论它是在哪里保存的。  
如果 `setInitialValue` 在某个 `change` 仍处于等待状态时执行，并且在其到期之前没有 dispatch 任何操作，那么该 `change` 仍会到来，携带加载后的 `value`，且 `changed` 为 `false`。

### dispatch, dispatchSync

将远程编辑器的变更应用到 replicationStore。

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` 会延迟到微任务中执行，`dispatchSync` 则会立即应用这批变更。

可以不做过滤，直接把 shared store 的操作流交给它们。  
两个方法都只保留可能改变文档的那类操作，以及本节末尾介绍的两种操作，并丢弃其余部分，因此协同编辑会话所携带的状态信息（每位用户的鼠标光标、焦点、选中内容与选择框）传入后不会产生任何效果。

从 `3.10.0` 起，被保留的操作包括 `relationship.changeOnDelete` 和 `relationship.changeOnUpdate`，并且 `relationship.add` 带有 `onDelete` 和 `onUpdate`。  
更早版本的 store 会丢弃这些操作并忽略这些字段，因此会丢失关系的 [ON DELETE 与 ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) 操作。

从 `4.0.0` 起，被保留的操作还包括 `table.changeGroup`、八个 `tableGroup` 操作中的七个（`tableGroup.add`、`tableGroup.move`、`tableGroup.moveTo`、`tableGroup.remove`、`tableGroup.resize`、`tableGroup.changeName` 和 `tableGroup.changeColor`，即除改变叠放顺序的 `tableGroup.changeZIndex` 之外的全部）、`relationship.changeColumns`、`settings.changeLockSettings` 和 `settings.changeDDLScript`。  
`settings.changeRelationshipOptimization` 已不复存在，因此两个方法都会丢弃它。  
更早版本的 store 会丢弃这些新操作，因此会丢失[表分组](../../guide/guides/table-groups.md)、[锁定](../../guide/guides/settings.md#锁定)、[Schema SQL](../../guide/guides/schema-sql.md) 脚本，以及[映射列](../../guide/guides/relationship-editing.md#map-columns)为已有关系设置的列。  
请让副本运行在与编辑器相同或更新的版本上。

`4.1.0` 没有新增任何操作类型，也没有改动 `@dineug/erd-editor/engine.js`，因此 `4.0.0` 副本与 `4.1.0` 副本一样，会保留 `4.1.0` 编辑器发送的每一项变更。  
从 `4.1.0` 起，[查找与替换](../../guide/guides/find-and-replace.md#replacing)中的 `Replace` 和 `Replace All` 还会重命名索引和表分组，所用的是 `4.0.0` 副本本来就会保留的 `index.changeName` 和 `tableGroup.changeName` 操作。  
[资源管理器](../../guide/guides/explorer.md)自身的状态从不发送，它造成的标签页切换或滚动，会像其他任何标签页切换或滚动一样到达；参见[协同编辑](./collaborative-editing.md)。

从 `4.2.0` 起，会保留的操作还包括 `table.changeLogicalName`、`table.changeNameDerived`、`column.changeLogicalName`、`column.changeDomain`、`column.changeNameDerived`、`settings.changeNameViewMode`，以及 `dictionary.add`、`dictionary.update` 和 `dictionary.remove`，后三者承载 [Dictionary](../../guide/guides/dictionary.md) 标签页各工作表上的每一次编辑、排序和导入 CSV。  
对于名称显示切换，副本只应用非只读编辑器在 `Name View` 未锁定时进行的切换，其余的都会丢弃（参见 [on@change](#onchange)）。  
较早版本的 store 会丢弃所有这些操作，因此会丢失[逻辑名](../../guide/guides/logical-names.md)、域关联、每个名称是否来自词典、词根、术语和域，以及名称显示。  
会话中 `4.2.0` 之前的编辑器仍可能让 `4.2.0` 副本失去其中的部分内容。  
在该编辑器上进行的 Schema SQL、GraphQL、DBML 或 AML `Import`（但不包括 `Import and Add`）会清空副本中的词根、术语和域。  
它对加载、`Import` 或 `clear()` 执行的 Undo 会把它自己持有的那份文档加载到副本中，其中不含逻辑名、域关联或词典；参见[混用不同版本](./collaborative-editing.md#mixing-releases)。  
`@dineug/erd-editor/engine.js` 导出的 `createReplicationStore`、`ReplicationStore` 和 `ReplicationChange` 与之前相同，`createReplicationStore` 接受的上下文也相同。

从 `4.0.0` 起，两个方法还会应用 `editor.mergeLWW`，它携带的是另一个编辑器加入会话时，某个编辑器作为回应发送的协同寄存器，因此副本裁定并发编辑结果的方式与编辑器相同。  
它不会改变 `value` 的任何字节，也不会触发 `change`。  
`4.0.0` 之前发布的编辑器可能仍会发送的 `settings.changeIgnoreSaveSettings` 会被保留，但不会改变任何内容：它会触发 `change`，且 `changed` 为 `false`。

### destroy

彻底销毁 replicationStore 实例。

```js
replicationStore.destroy();
```

销毁后 store 不再触发 `change`，也会忽略后续的 dispatch。  
文档会停留在最后的值上，而不会抛出错误。  
若要重新开始，需要创建新的 store。
