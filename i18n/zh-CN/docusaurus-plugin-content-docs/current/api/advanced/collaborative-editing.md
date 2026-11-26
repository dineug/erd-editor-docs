---
sidebar_position: 1
description: 通过 getSharedStore 在编辑器实例之间中继变更，用 runtimeValue 和 store 的寄存器为加入的编辑器载入初始文档，处理同一时刻进行的编辑，并显示每位协作者的光标、焦点、选中内容与选择框。
---

# 协同编辑

`getSharedStore()` 会把编辑器变成协同编辑会话中的一个节点。  
它将所有变更以操作流的形式发布，并应用其他编辑器发来的操作，连接两端的传输方式（WebSocket、WebRTC，或其他任何能够传递 JSON 的方式）需要自行准备。  
它是 [ErdEditorElement](../erd-editor-element.md) 的方法之一，当中继的变更还需要保存时，可与[远程存储](./remote-storage.md)配合使用。  
从 `5.1.0` 起，若要通过 Yjs 文档及其任意 provider 共享图，而不是自行搭建传输方式，请用 `@dineug/erd-editor-yjs` 绑定编辑器，参见 [Yjs](./yjs.md)。

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` 没有按名称导出这些类型。TypeScript 代码通过 `ErdEditorElement` 获取它们，例如 `ReturnType<ErdEditorElement['getSharedStore']>`。

操作是描述文档中一处变更的普通可序列化对象，因此在发往传输方式的途中可以原样通过 `JSON.stringify`。  
操作会成批到达，`subscribe` 传出的是一个数组，而该数组本身就是一个单位，因此要整体中继，并在另一端整体 dispatch。  
操作所携带的内部信息（例如其[版本](#concurrent-edits)）正是维持编辑器之间同步的关键，因此不要读取或改写它，而应将其视为不透明的值原样传递。

编辑器所做的有些事情只留在该编辑器上。  
把表、备注或表分组移到最前面（选中它们时就会这样）不会发送出去。  
[Schema SQL](../../guide/guides/schema-sql.md) 标签页中 `Statements`、`Header`、`Write logical names into empty comments`（从 `4.2.0` 起）和 `Tables` 的选择同样不会发送，它们属于做出这些选择的那个窗口。  
从 `4.1.0` 起，[资源管理器](../../guide/guides/explorer.md)同样只留在其所在的编辑器上：它是否打开、宽度、折叠的行、键盘焦点所在的行、树的滚动位置，以及其搜索与选项，都不会发送出去。  
跳转到外键时会[点亮](../../guide/guides/relationship-editing.md#reading-a-connector)其关系的连接线，这种点亮也不会发送出去。  
从 `4.2.0` 起，[Dictionary](../../guide/guides/dictionary.md) 标签页同样只留在其所在的编辑器上：显示的是哪个工作表，以及每个工作表的搜索、选中范围、滚动位置和列宽，都不会发送出去。它的编辑、排序和导入 CSV 则会发送出去。  
滚动、缩放或标签页切换会发送出去，但永远不会移动其他用户的视图或标签页。这也包括从资源管理器跳转时造成的滚动、从其他标签页打开资源管理器时切换到 ERD 标签页，以及从 Dictionary 标签页的 [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) 工作表跳转到表或列时造成的标签页切换和滚动。从该工作表跳转到词根、术语或域时会停留在 Dictionary 标签页，因此不会发送任何内容。

从 `4.2.0` 起，[名称显示](../../guide/guides/logical-names.md#switching-the-view)的切换也会发送出去，由其[锁定](../../guide/guides/settings.md#锁定)决定其他编辑器如何处理它。在新的图以及 `4.2.0` 之前的任何文档中，`Name View` 锁定都处于开启状态。  
该锁定开启期间，切换只会显示在执行切换的编辑器上：它仍会发送出去，但其他每个编辑器和每个副本都会丢弃它，因此每位用户可以查看不同的显示方式，而 `value` 保留锁定的显示方式。  
该锁定关闭期间，在可编辑的编辑器中进行的切换会改变每个编辑器和副本上的名称显示，以最后一次切换为准，并且它们都会保存这一显示方式。  
只读编辑器自身的切换始终只留在该编辑器上，而该编辑器仍会跟随其他编辑器共享的切换。

从 `5.1.0` 起，[Code Generator](../../guide/guides/code-generator.md) 语言、表名大小写、列名大小写或括号类型的更改，同样遵循各自的锁定（`Language`、`Table Name Case`、`Column Name Case` 或 `Bracket Type`），只有一点不同：锁定开启期间，这类更改根本不会发送。  
它只显示在执行更改的编辑器上，该编辑器的 Code Generator 和 Schema SQL 标签页会跟随它，其他编辑器和副本都看不到。`value` 和 `runtimeValue` 保留锁定的值，因此用任何编辑器载入初始文档的加入者同样看不到它，锁定开启期间每位用户可以查看不同的语言、名称大小写或括号类型。  
锁定关闭期间，在可编辑的编辑器中进行的更改会带着共享标记发送出去（其 payload 中的 `shared: true`）。它会改变每个编辑器和副本上的该设置，以最后一次更改为准，并且它们都会保存。`5.1.0` 编辑器或副本无论自身的锁定如何，都会应用带标记的更改，因此在关闭锁定之后立即进行的更改会到达所有位置，即使它先于关闭锁定到达。  
在 `5.1.0` 之前，这样的更改无论锁定是否开启都会到达每个编辑器和副本，而文件保留的是锁定的值。

从 `5.0.0` 起，[只读](../erd-editor-element.md#readonly)编辑器完全不发送任何更改。其阅读者更改的滚动、缩放、标签页、名称显示、数据库、Code Generator 的语言、名称大小写、括号类型和 `View Option` 各行，无论它们的锁定如何，都只保留在其屏幕上；在 `5.0.0` 之前，它的滚动、缩放、标签页切换、数据库和代码设置会像可编辑的编辑器那样发送出去。  
它的 store 仍会发送其 tracker 发出的阅读者的光标、焦点、选中状态和拖动框，回答加入的编辑器所请求的寄存器，并应用其他编辑器发来的每项更改。数据库、Code Generator 设置或 `View Option` 某行的变化会到达它的文档，除非阅读者在那里更改了该设置，否则也会到达它的屏幕；共享的名称显示切换则无论如何都会显示在它的屏幕上。从 `5.1.0` 起，只有当某项 Code Generator 设置是在锁定关闭时更改的，或者由关闭锁定带来时，它才会收到该设置。  
在编辑器变为只读时，它会先发出 store 仍扣留的拖动或滚动内容，与 [flushStreamBuffers](#flushstreambuffers) 的做法相同，这样其他编辑器就能保留其最后的内容。

[锁定](../../guide/guides/settings.md#锁定)是共享的：每个编辑器上都以对某项设置最后一次的锁定或解锁为准，而锁定会携带开启它的那个编辑器上的值，因此每个编辑器和副本保存的都是同一个值。  
因此，`Viewport` 锁定保存的是开启它的那个编辑器的视图，`Canvas Type` 锁定保存的则是该编辑器在进入 Settings 标签页（锁定就在这里开启）之前所在的最后一个标签页。  
关闭 `Language`、`Table Name Case`、`Column Name Case`、`Bracket Type` 或（从 `4.2.0` 起）`Name View` 锁定时，还会把每个编辑器上的该设置改为关闭它的那个编辑器上显示的值（包括该编辑器在锁定期间自行做出的更改），因此它们保存的仍是同一个值。关闭 `Viewport` 或 `Canvas Type` 不会移动任何人的视图或标签页。

对 `Before tables` 或 `After tables` 脚本的编辑，会在其输入框失去焦点时整体发送出去。两个脚本各自独立裁定结果，因此协作者对其中一个的编辑永远不会覆盖另一个。

在 Visualization 标签页的 [Flow 模式](../../guide/guides/visualization.md#flow-never-edits-the-document)中所做的任何操作都不是文档变更，因此处于 Flow 中的编辑器不会向其他编辑器发送任何变更，而其他编辑器发来的变更在此期间仍会继续应用。  
有两个例外。离开 Flow 切换到其他标签页是一次标签页切换，会像其他切换一样发送出去。从 `4.2.0` 起，在 Flow 工具栏的名称显示列表中做出的选择是一次名称显示切换，会像在画布上进行的切换一样发送和应用。  
在 Flow 中用于[逐个切换视图](../../guide/guides/visualization.md#previous-table-and-next-table)的 `Previous table`、`Next table` 以及撤回与重做的快捷键不会发送出去。  
外部链接卡片按钮、在 `#`、`@` 或 `:` 之后选中的[快速搜索](../../guide/guides/quick-search.md#searching-the-diagram)结果，以及打开[资源管理器](../../guide/guides/explorer.md#opening-and-closing)，都会离开 Flow 并切换到 ERD 标签页。卡片按钮或快速搜索结果在那里造成的滚动也会发送出去。

## 一个页面中的两个编辑器

这里从 subscribe 到 dispatch 的连接代替了网络，因此无需传输方式即可了解会话的结构。

```js
import '@dineug/erd-editor/erd-editor.js';

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
用 [`@dineug/erd-editor-yjs`](./yjs.md) 绑定的房间，在有客户端为它[载入初始文档](./yjs.md#seeding-a-room)之后，会自行保存文档，因此绑定到它的每个编辑器都无需传入 `runtimeValue` 即可打开该文档。

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

运行时值仍保留着自文档打开以来被删除的内容，因此当另一个编辑器之后对一次删除执行 Undo 时，加入者会连同名称和列一起恢复该表。  
[`value`](../erd-editor-element.md#value) 是文件所保存的形式，不含已删除的实体，因此用它或用文件载入初始文档的加入者，恢复出来的会是一个空的、没有名称的表。  
从 `4.2.0` 起，从 [Dictionary](../../guide/guides/dictionary.md) 标签页的工作表中删除的词根、术语或域也是如此：当另一个编辑器对该删除执行 Undo 时，用 `runtimeValue` 载入初始文档的加入者会完整地重新列出该行，而用 `value` 载入初始文档的加入者则会列出一个空行，随后其自身的 `value` 会省略该行。  
写入存储的仍应是 `value`：`runtimeValue` 只用于为另一个编辑器、第二个视图或 [replicationStore](./remote-storage.md) 载入初始文档。  
VS Code、Obsidian、JetBrains IDE 与 Web 应用中的编辑器，就是这样为已打开文档的第二个视图载入初始文档的。

`setInitialValue` 不会被中继，因此为加入者载入初始文档不会改变其他编辑器上的任何内容。  
从 `4.0.0` 起，它还会丢弃该编辑器的协同寄存器，这些寄存器用于裁定[并发编辑](#concurrent-edits)的结果。如果该编辑器的 shared store 已经有过订阅者，store 会像首次 [subscribe](#subscribe) 时那样，再次向其他编辑器请求它们的协同寄存器，因此在会话中途重新加载的编辑器会与其他编辑器以相同的方式裁定编辑结果。  
为 `value` 赋值会保留这些寄存器，但与 `setInitialValue` 不同，它会被中继：一旦该编辑器拥有 shared store，会话中的每个编辑器都会加载所赋的文档，因此切勿以这种方式为加入者载入初始文档。

`value` 和 `runtimeValue` 都不含寄存器，也不含编辑器的时钟已达到的版本，因此仅用 `runtimeValue` 载入初始文档的加入者，会从会话中的编辑器对其首次 subscribe 发回的答复中获取它们。  
在该答复到达之前，加入者所做的编辑携带的版本可能低于其他编辑器持有的版本，因此其他编辑器会拒绝它，它只留在加入者上，而仍在途中的较旧写入会覆盖初始文档所持有的较新写入。没有任何运行中的编辑器作答时，例如由服务器或文档存储保存会话文档的情形，加入者永远得不到它们。  
从 `5.1.0` 起，请把它们与值一并交出。在会话中的某个编辑器上，先调用 [`flushStreamBuffers()`](#flushstreambuffers)，让它仍在扣留的拖动或颜色更改先发出，然后在同一时刻读取 `runtimeValue` 以及其 store 的 [`getLWW()`](#getlww) 和 [`getVersion()`](#getversion)。加入者用 `setInitialValue` 载入该值，然后用自己 store 的 [`mergeLWW`](#mergelww) 接收其余部分，顺序不能颠倒，因为每次 `setInitialValue` 都会丢弃寄存器。这样它的下一次编辑携带的版本会超过初始文档持有的每一个版本，因此无需等待答复即可生效。对于已经存在的 store，[`reseed`](#reseed) 一次调用即可完成这两步。

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

以这种方式保存、用于为之后的加入者打开文档的初始文档，会同时保存这三者。它不是文件：写入存储的仍应是 `value`。  
[replicationStore](./remote-storage.md#runtimevalue-getter) 不会交出寄存器，因此用其 `runtimeValue` 载入初始文档的加入者，仍会从编辑器的答复中获取它们。

## 并发编辑 {#concurrent-edits}

每个编辑器和副本，对每个名称和几乎每个其他字段，都保存着设置它的那次写入的版本：这就是它的协同寄存器。只有当写入的版本不低于所持有的版本时，该写入才会生效，因此以不同顺序收到相同变更的编辑器最终得到相同的文档。  
从 `5.1.0` 起，每个版本在计数器之下还带有一个写入该版本的编辑器自己的槽位，取自其 id。因此版本以 4,194,304 为步长增长，计数器达到 512 时就会超出 32 位整数。`JSON.stringify` 和 `JSON.parse` 会完整地传递它们，但用其他语言解析它们的中继或存储必须将其保存为 64 位数字，绝不能保存为 32 位整数。

从 `5.1.0` 起，两个编辑器在同一时刻更改同一个名称或字段时（下述例外除外），每个编辑器和副本上最终得到相同的值：它们在同一个计数器上写入，会盖上两个不同的版本，版本较大的一方在所有位置胜出。在 `5.1.0` 之前，两者可能盖上同一个版本，每个编辑器保留它最后收到的那个，因此最终可能不一致。两个编辑器共用同一个槽位的概率是每对 4,194,304 分之一，此时它们仍像以前一样平局。

从 `5.1.0` 起，表的位置、备注或表分组的位置和大小，以及视图的原点和缩放级别，都以同样的方式带有版本，而移动它们的操作会以其终点的形式发出：

- 拖动会为每个被移动的实体发出一个 `table.moveTo`、`memo.moveTo` 或 `tableGroup.moveTo`，放在同一个批次中，因此拖动分组时会同时携带其中表的点（从 `5.1.1` 起还有其中备注的点）和分组的点；
- 拖动的 Undo 或 Redo 以它把每个实体放到的那个点的形式发出；
- 平移以 `settings.scrollTo` 发出，缩放以 `settings.changeZoomLevel` 发出；
- 备注或表分组的调整大小，以其位置和大小一起发出。

因此，两位用户在同一时刻移动、或移动并调整同一个表、备注或表分组的大小，每个编辑器和副本上它最终都处于同一个点、具有同一个大小。点归版本较大的那次写入所有，两个轴一起取。移动不会写入大小，因此即使同时进行的移动取得了点，调整大小仍保留它的大小。  
在 `5.1.0` 之前，拖动以移动的距离发出，因此对同一个表的两次拖动会叠加，而同时对同一个备注或表分组进行的移动和调整大小，最终可能不一致。  
不足 20 px、不会留下 Undo 记录的拖动，与其他拖动一样发送，因此作为一个点，它可能覆盖另一位用户在同一时刻对同一实体所做的拖动。传输方式重复传递的拖动、平移或缩放批次，不会造成二次移动。

颜色更改是例外。它发出时不带版本，每个编辑器和副本用自己的版本为它盖章，并保留它最后收到的颜色，因此两位用户在同一时刻为同一个表、备注或表分组更改颜色，最终可能得到不同的颜色。  
还有少数变更完全没有版本，因此每个编辑器和副本按收到的顺序应用它们，同一时刻进行的两项变更同样可能最终不一致：表或索引中列的移动（`column.move`、`indexColumn.move`），以及[数据库](../../guide/guides/table-related-functions.md#databases)、[`View Option`](../../guide/guides/table-related-functions.md#table-view-options) 某一行，或 [Settings](../../guide/guides/settings.md) 标签页的 `Relationship DataType Sync`、`Maximum comment width` 或 `Column Order` 的更改。  
两位用户在同一时刻添加的实体，例如两个表或同一个表的两列，在每个编辑器和副本上也可能排列顺序不同，每个编辑器的 `value` 保存的是它自己的顺序。

以上这些在 `5.1.0` 或更高版本的编辑器和副本之间成立；较旧的版本会带来什么变化，参见[混用不同版本](#mixing-releases)。

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

`4.0.0` 之前的编辑器会忽略这些新的操作类型：它永远看不到表分组，也不知道哪些表属于分组，不过拖动分组时，分组中的表在它那里仍会移动，因为拖动分组时也会发送对其中每个表的移动。  
在映射列中执行 `Save` 后，它仍保留关系原来的列，而当原有映射中的某一列在它那里被删除时，该关系会在每个编辑器上消失。它没有锁定，也没有脚本。  
由它保存的文档不包含上述任何内容，`4.0.0` 编辑器打开这样的文档时，所有锁定都处于开启状态。  
会话中的每个编辑器，以及存储该会话文档的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都应使用 `4.0.0` 或更高版本。

`4.1.0` 编辑器不会发送任何新的操作类型，因此 `4.0.0` 和 `4.1.0` 的编辑器与副本可以共处同一会话，不会错过任何内容。  
它的[查找与替换](../../guide/guides/find-and-replace.md#replacing)还会搜索索引名和表分组名称，`Replace` 和 `Replace All` 会通过 `4.0.0` 编辑器已经能够应用的 `index.changeName` 和 `tableGroup.changeName` 操作重命名它们。

从 `4.2.0` 起，以下变更通过新的操作类型传递，原样传递操作的中继无需为此做任何额外处理：

- 表或列的[逻辑名](../../guide/guides/logical-names.md)：`table.changeLogicalName` 和 `column.changeLogicalName`；其名称是否[由词典生成](../../guide/guides/dictionary.md#deriving-physical-names)：`table.changeNameDerived` 和 `column.changeNameDerived`；
- 列关联到[域](../../guide/guides/dictionary.md#domains-and-data-types)或取消关联：`column.changeDomain`；
- 在 [Dictionary](../../guide/guides/dictionary.md) 标签页中添加、更改（包括排序所设置的它在工作表中的位置）或删除词根、术语或域：`dictionary.add`、`dictionary.update` 和 `dictionary.remove`；
- [名称显示](../../guide/guides/logical-names.md#switching-the-view)的切换：`settings.changeNameViewMode`。

`Name View` 锁定通过已有的 `settings.changeLockSettings` 操作传递，`Domain` 显示选项通过 `settings.changeShow` 传递，在[列顺序](../../guide/guides/settings.md#adjusting-column-order)中移动 `Logical Name` 或 `Domain` 则通过 `settings.changeColumnOrder` 传递。  
通过 `Import` 进行的 Schema SQL、GraphQL、DBML 或 AML 导入所发送的 `editor.clear` 和 `editor.loadJson` 带有 `keepDictionaries: true`，它会在每个编辑器上保留词根、术语和域。以替换方式调用的 [setSchemaSQL](../erd-editor-element.md#setschemasql)、`setSchemaGraphQL`、`setSchemaDBML` 或 `setSchemaAML` 所发送的这两个操作也是如此。  
词典生成的物理名通过 `table.changeName` 或 `column.changeName` 传递，域赋予其列的数据类型则通过 `column.changeDataType` 传递，这些都是手动编辑时发送的操作。

`4.2.0` 之前的编辑器会忽略这些新的操作类型：它没有逻辑名、域关联、词典或名称显示。开启或关闭 `Name View` 锁定在它那里不会产生任何效果，在列顺序中移动 `Logical Name` 或 `Domain`，或者把其他项移到这两者之一的位置上，也都不会产生任何效果。从 Dictionary 标签页进入 Settings 标签页的编辑器所开启的 `Canvas Type` 锁定同样如此：较旧的编辑器不认识该标签页，因此它会让 `Canvas Type` 保持未锁定状态。它仍会显示词典生成的物理名以及域所赋予的数据类型。  
它自身的编辑对逻辑名、域和词典一无所知，并会对较新的编辑器产生以下影响：

- 它手动重命名的表或列，其名称仍标记为由词典生成，因此之后在较新的编辑器上为其输入的逻辑名，可能会重新生成名称，覆盖它所输入的名称。
- 它为关联到域的列设置数据类型时会保留该关联，因此 `Checks` 工作表会列出 `Domain type mismatch`，而该域下一次更改类型时，会再次让该列采用域的类型。
- 它添加的关系的外键列不会从其对应的键获得逻辑名或域。
- 它粘贴或创建副本的表到达时不带逻辑名或域关联。
- 在它上面进行的 Schema SQL、GraphQL、DBML 或 AML 导入不会发送 `keepDictionaries`，因此会清空每个编辑器上的词根、术语和域。
- 它对加载、导入或 `clear()` 执行的 Undo 会在每个编辑器上加载它自己持有的那份文档，而这份文档不含逻辑名、域关联或词典。
- 这份文档，以及在它上面进行的 Schema SQL、GraphQL、DBML 或 AML 导入所加载的文档，还会把每个编辑器上的 `Name View` 锁定恢复为那个较旧的编辑器当初所见的状态。随后每个编辑器都会将 `Physical Names` 保存为名称显示，如果该锁定处于关闭状态，还会显示它。

由它保存的文档不含逻辑名、域关联、词典或名称显示，因此 `4.2.0` 编辑器会以 `Physical Names` 打开它。不过，较旧的编辑器会按其所见的状态保存 `Name View` 锁定，因此在 `4.2.0` 编辑器中解锁的文档会保持解锁状态。  
会话中的每个编辑器，以及存储该会话文档的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都应使用 `4.2.0` 或更高版本。

`5.1.0` 编辑器不会发送任何新的操作类型，因此 `5.1.0` 之前的编辑器和副本仍可与它共处同一会话，原样传递操作的中继无需为此做任何额外处理。不过，[并发编辑](#concurrent-edits)所描述的内容只在 `5.1.0` 的编辑器和副本之间成立：

- `5.1.0` 编辑器的拖动以点的形式通过 `table.moveTo`、`memo.moveTo` 和 `tableGroup.moveTo` 传递，较旧的编辑器已经能够应用这些操作；它的平移和缩放以点的形式通过 `settings.scrollTo` 和 `settings.changeZoomLevel` 传递，与所有平移和缩放一样，其他编辑器都不会应用，只有副本会接收。较旧的编辑器按拖动的每个点到达的顺序应用它们，且不经过任何寄存器；较旧的副本对拖动、平移或缩放的每个点也是如此，因此在那里，同一时刻为同一个实体或同一个视图发出的两个点，最终可能不一致。
- 较旧编辑器的拖动仍以移动的距离传递，每个编辑器和副本都会在寄存器之外累加它；它的平移或缩放同样以距离传递，每个副本以同样方式累加。对同一个实体同时发出的一个距离和一个点，在以不同顺序收到它们的编辑器和副本上，最终可能不一致；传输方式重复传递的距离会被累加两次。
- 在[并发编辑](#concurrent-edits)所列的例外之外，`5.1.0` 编辑器对某个名称或字段的写入，与较旧编辑器在同一时刻对其所做的写入相比，几乎总是胜出，并且每个编辑器和副本得到的结果相同。两个较旧的编辑器对同一字段同时写入，仍可能最终不一致。
- `5.1.0` 编辑器只在锁定关闭期间才会发送 Code Generator 语言、名称大小写或括号类型的更改，并带有 `shared: true` 标记；较旧的编辑器会忽略该标记，仍像以前一样应用这项更改。较旧的编辑器在锁定下所做的更改仍会照常发出，不带标记：`5.1.0` 编辑器或副本在该设置被锁定时会丢弃它，而较旧的编辑器会应用它。因此在锁定下，较旧的编辑器彼此跟随各自的选择，而 `5.1.0` 编辑器保留自己的选择，无论哪种情况，文件保留的都是锁定的值。在任一版本上进行的关闭锁定，都会把关闭锁定者的值带到每个编辑器和副本。
- 替换文档的加载，例如赋值 `value`、`clear()` 或替换式导入，会在每个 `5.1.0` 编辑器上结束正在绘制的关系，包括执行该操作的编辑器和每个接收它的编辑器。较旧的编辑器则会让它的绘制在加载之后仍保持待命。

会话中的每个编辑器，以及存储该会话文档的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都应使用 `5.1.0` 或更高版本，这样同一时刻进行的编辑才会在各处最终结果一致，[并发编辑](#concurrent-edits)所列的例外除外；要保留逻辑名和词典，仍需 `4.2.0` 或更高版本。`1.2.0` 之前的 [MCP 服务器](../../mcp/live-and-headless.md#edits-made-at-the-same-moment)在这里算作 `5.1.0` 之前的编辑器，而 `5.1.0` 之前的编辑器根本无法绑定到 [Yjs](./yjs.md) 房间。

从 `5.1.1` 起，备注加入或离开[表分组](../../guide/guides/table-groups.md)会通过一个新的操作类型 `memo.changeGroup` 传递，原样传递操作的中继无需为此做任何额外处理。以下情况会发送它：把备注放入或移出分组，在处于显示状态、且不属于任何分组的备注周围绘制新分组，选中表的同时也选中备注时执行 `Group selected tables`，选中范围中含有备注时执行 `Remove from group`，已删除分组中的每个备注，编码智能体通过 [MCP 服务器](../../mcp/tools.md#表分组)进行的备注分组调用，以及上述每种情况的 Undo 和 Redo。分组包含备注的 `Import and Add` 或 `setSchemaJSON` 追加也会发送它，它的 Redo 同样如此，而它的 Undo 只会移除这些备注。

`5.1.1` 之前的编辑器或副本会忽略 `memo.changeGroup`，其解析会丢弃每个备注的 `groupId`，因此它从不会看到分组中的备注，不过 `5.1.1` 编辑器拖动分组时，分组中的备注在它那里仍会移动，因为它还会为每个备注发送一个 `memo.moveTo`。它自己的编辑不了解备注所属的分组，会对较新的编辑器造成以下影响：

- 它拖入某个分组框内的备注仍留在分组之外，它拖出框外的成员备注仍留在分组中，框会撑大，把它包在其中。
- 它拖动分组，与它的 `Auto Layout` 一样，只会移动分组及其中的表，而让分组中的备注留在原处，框会撑大，把留在原处的显示的备注包在其中。
- 在它上面进行的 `Import and Add` 不会把任何备注放入它所添加的分组。
- 它删除的分组会让其中每个备注的 `groupId` 仍指向该分组：这些备注读作不属于任何分组，而它对该删除的 Undo 会把它们放回分组。
- 它对加载、导入或 `clear()` 执行的 Undo 会在每个编辑器上加载它自己持有的那份文档，而这份文档中没有任何备注属于分组。

由它保存的文档没有任何备注属于分组，不过 `4.0.0` 或更高版本的编辑器仍会保留表所属的分组。  
要让备注保留在其表分组中，会话中的每个编辑器，以及存储该会话文档的任何 [replicationStore](./remote-storage.md#dispatch-dispatchsync)，都应使用 `5.1.1` 或更高版本；要裁定同一时刻进行的编辑，仍需 `5.1.0` 或更高版本。`1.2.1` 之前的 [MCP 服务器](../../mcp/installation.md#更新)同样既看不到备注属于哪个表分组，也不会保留它。

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
从 `4.2.0` 起，在名称显示的锁定开启期间，或者在只读编辑器自行切换之后，每位用户看到的[名称显示](../../guide/guides/logical-names.md#collaborators)可能各不相同。如果获得焦点的单元格在你的显示方式中没有绘制，下划线会画在代替它绘制的单元格上：名称与逻辑名彼此替代，数据类型与域也是如此。  
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
当批次中包含另一个编辑器对寄存器的请求（加入者首次 [subscribe](#subscribe) 时会发送这样的请求）时，store 会通过其订阅者发回自己的寄存器和版本，除非它没有任何寄存器。  
从 `5.1.0` 起，它会先发送仍在扣留的每个流批次，与 [flushStreamBuffers](#flushstreambuffers) 的做法相同，这样其答复所携带的每个版本，都建立在其他编辑器已收到的写入之上。因此加入者的到来会让会话中的每个编辑器同时发出它仍在扣留的拖动、平移、缩放、颜色更改或备注调整大小。

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe

订阅编辑器的变更。  
在至少存在一个订阅者之前，不会有任何内容离开编辑器，在此之前发生的变更会被缓存。  
首次 subscribe 还会向其他编辑器请求它们的协同寄存器，这些寄存器用于裁定[并发编辑](#concurrent-edits)的结果，因此后加入的一方会以相同的方式裁定这些编辑。  
它不会带来文档，因此要先为后加入的一方[载入初始文档](#seeding-a-collaborator)；从 `5.1.0` 起，初始文档也可以携带寄存器。  
从 `4.0.0` 起，在首次 subscribe 之后，每当 `setInitialValue`（从 `5.1.0` 起还有 [reseed](#reseed)）向其编辑器加载文档时，store 都会再次请求。

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers

立即发送该 store 仍在暂存的流批次，而不是等到它们的静默期结束之后。  
从 `3.9.2` 起，它对 `getSharedStore` 返回的 store 生效；在 `3.9.1` 中，该方法虽然存在于类型上，但不起任何作用。  
移动表、备注或表分组，更改其颜色，调整备注大小，以及滚动或缩放视图，都是以由细小变更组成的流的形式进行的。调整表分组的大小则不是：它只在拖动结束时发送一次。  
store 会把每个流合并为一个批次并暂存起来，直到该流静默 200ms 为止，这一过程分为两个阶段。颜色更改或备注调整大小会经过这两个阶段，因此它会在最后一次变更之后约 400ms 发出，在 `5.1.0` 之前每个流都是如此。从 `5.1.0` 起，拖动、平移或缩放在第一个阶段之后就会发出，即在其最后一步之后约 200ms，以其终点的形式发出（参见[并发编辑](#concurrent-edits)）。  
调用它会同时结束两个阶段中的这段等待。store 处于连接状态时，订阅者会在调用返回之前收到该批次。没有任何暂存内容时，调用不会发送任何内容。  
`destroy`（无论是 store 自身的还是编辑器的）会丢弃仍在暂存的批次，因此在放弃某个 store、而其他编辑器仍应保留最后一次变更时（例如关闭标签页时），需先调用此方法。

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

从 `5.1.0` 起，返回编辑器协同寄存器的一份副本（参见[并发编辑](#concurrent-edits)）。  
这份副本是通过 JSON 生成的，因此它是可直接用于 `JSON.stringify` 的普通对象，对它的更改不会影响 store 的寄存器。  
请将它原样交给另一个 store 的 [mergeLWW](#mergelww) 或 [reseed](#reseed)。它的结构由编辑器自己决定，因此不要读取其中的任何字段。  
要[为加入者载入初始文档](#seeding-a-collaborator)，请在同一时刻读取它、[getVersion](#getversion) 和编辑器的 `runtimeValue`。

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

从 `5.1.0` 起，把另一个 store 用 [getLWW](#getlww) 交出的寄存器并入本 store 的寄存器，每一项保留较大的版本，并把 `version` 并入编辑器的时钟，时钟保留自己的版本和给定版本中较大的一个。  
它不会改变文档中的任何内容：`value` 或 `runtimeValue` 不会有一个字节的变化，也没有 Undo 记录和 `change` 事件。它只会抬高之后的写入必须超过的版本，因此之后比给定寄存器更旧的写入会被拒绝，而编辑器的下一次编辑携带的版本会超过 `version`。  
它不会发送任何内容，也不会作答。这相当于加入者首次 subscribe 从其他编辑器的答复中得到的内容，只是直接并入。  
请在 `setInitialValue` 之后调用它，绝不能在此之前：每次 `setInitialValue` 和每次 [reseed](#reseed) 都会丢弃已持有的寄存器，连同在此之前的 `mergeLWW` 所并入的内容。

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

从 `5.1.0` 起，返回编辑器的时钟已合并的最高版本：包括它所做或接收的变更的版本、加入过程中交换的寄存器请求和答复的版本，以及传给 `mergeLWW` 或 `reseed` 的每个 `version` 中最大的一个。  
光标、焦点、选中状态和拖动框，无论是它自己的还是其他编辑器的，都不会使它变化。  
请把它与在同一时刻读取的 [getLWW()](#getlww) 一并交给加入者的 [mergeLWW](#mergelww) 或 [reseed](#reseed)。它是与其操作所携带的版本相同的[版本](#concurrent-edits)。

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

从 `5.1.0` 起，立即移除给定 id 的编辑器发来的光标、焦点、选中状态和拖动框，以及它们各自正在等待的过期计时。其他每个编辑器的则保留。  
该 id 就是该编辑器的 shared store 所发送的每个操作所携带的 `meta.editorId`。对于本编辑器没有保存任何内容的 id，调用不会改变任何东西。  
当传输方式得知某个对等方已离开时请调用它。否则，该对等方发来的内容会一直绘制到过期为止：其光标在最后一次收到之后 30 秒过期，焦点和选中状态在之后 90 秒过期，拖动框在之后 3 秒过期。

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

从 `5.1.0` 起，在编辑器中重新打开会话的文档，与重新加入的做法相同。[Yjs](./yjs.md) 绑定在绑定到已载入初始文档的房间时，会调用它来打开房间的文档，并在每次重新加入时再次调用，一旦加入过房间就会保留屏幕上的内容。  
它像 [setInitialValue](../erd-editor-element.md#setinitialvalue) 那样加载 `value`，并像 [mergeLWW](#mergelww) 那样接收 `lww` 和 `version`，因此之后 store 持有的恰好是给定的寄存器，它的时钟则是自己的版本和 `version` 中较大的一个。它还会清空 Undo 历史记录，并且与 `setInitialValue` 不同，它会丢弃选中状态和焦点，因为它们所指向的内容可能已不在该值中。  
除了下文的逻辑名生成之外，它不会产生 Undo 记录，不会触发 `change` 事件，也不会发送任何变更。一旦 store 有过订阅者，它就会发送每次这样的加载都会发送的寄存器请求（已经交出寄存器的传输方式可以丢弃它），并且在 [focusTracker](#focustracker) 开启时，发送被清除的选中状态和焦点。  
与 `setInitialValue` 一样，它在设置了 [readonly](../erd-editor-element.md#readonly) 时也能工作，会丢弃 Flow 视图，结束正在绘制的关系，并关闭备注、表分组名称和单元格编辑器，对其中已输入内容的保留或丢弃方式也相同；而正在关闭的逻辑名单元格根据其阅读者输入的内容所生成的名称，则属于普通编辑：会发送、可 Undo，并作为 `change` 事件触发。

不带 `keepScreen` 时，屏幕显示的是该值所包含的内容，与 `setInitialValue` 之后相同。带 `keepScreen: true` 时，阅读者的屏幕会重新叠加到加载的文档上，且只在该屏幕上生效：

- 滚动位置和缩放级别，前提是该元素已经显示过它们；从未显示过的，或加载时处于隐藏状态且之后没有显示过的，会在该值所指定的位置打开，与后加入者的情形相同；
- 标签页，前提是加载移动了它；在 Settings 标签页上还包括阅读者来自的那个标签页，在那里开启的 `Canvas Type` 锁定会指向它；
- 阅读者在锁定下自行显示的名称显示和各项 Code Generator 设置，但仅限于该锁定在加载之前已开启、在加载之后仍然开启、并且保持相同的锁定值的情形。因此，当对等方在此期间关闭锁定、更改并再次以另一个值锁定某项设置时，编辑器会以新的锁定值打开；而锁定在加载之前或之后处于关闭状态时，显示的则是加载的值；
- 只读阅读者在自己屏幕上更改的每项设置，无论锁定如何。

这些都不会发送出去，而 `value` 和 `runtimeValue` 报告的仍是加载的文档。对等方之后关闭锁定会替换以这种方式保留的代码设置，任何关闭锁定都是如此。  
阅读者在编辑器可编辑时所做的下一次滚动或缩放，会让保留的滚动位置和缩放级别重新成为文档的，并以屏幕当前所处的位置为首发出，因此副本也会采用该缩放级别。

重新载入初始文档不会动 store 扣留的内容。仍在扣留的拖动、平移或缩放会在它之后发出，根据重新载入初始文档后的文档读取；颜色更改或备注调整大小则按它们当初做出的样子发出，尽管编辑器已不再显示它们；而 `disconnect()` 扣留的内容会在 `connection()` 时发出。  
因此请先调用 [flushStreamBuffers](#flushstreambuffers)，把它发出的内容发送出去，再用包含这些内容的值调用 reseed。切勿在断开连接时调用 reseed。

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy

彻底销毁 sharedStore 实例。  
编辑器本身不受影响，因此退出会话后文档仍可继续编辑。  
当编辑器发出的最后一个 sharedStore 被销毁时，鼠标与焦点 tracker 会停止。  
该 store 仍在暂存的流批次会随之一并丢弃；要将其发送出去，需先调用 [flushStreamBuffers](#flushstreambuffers)。  
其他编辑器发来的光标、焦点、选中状态和拖动框会一直绘制到过期为止；从 `5.1.0` 起，[forgetPeer](#forgetpeer) 可以立即移除某一个编辑器的这些内容。

```js
sharedStore.destroy();
```
