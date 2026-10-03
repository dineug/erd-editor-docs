---
sidebar_position: 1
description: 从画布右键菜单创建表、备注与关系。
---

# 开始编辑

编辑从右键菜单开始。

![右键点击画布，浏览 Relationship 子菜单，新建表后再打开该表自身的菜单](/img/demo-context-menu.webp)

在表或关系上右键则会打开该项自身的菜单。

## 创建表

通过右键菜单或快捷键 `Alt + N` 创建表。

## 创建备注

通过右键菜单或快捷键 `Alt + M` 创建备注。

备注是画布上的自由文本笔记。在其正文区域点击后即可输入，内容会随文档一起保存。  
`Escape` 会关闭备注编辑器，保留已输入的内容，并让该备注保持选中状态，再按一次 `Escape` 则会清除选中状态。  
拖动边框可调整其大小，通过标题栏中的 `x` 可将其删除。

![按 Alt + M 添加备注，输入内容后拖动边框调整其大小](/img/demo-memo.webp)

## 创建关系

通过右键菜单、画布底部的[画布工具栏](./table-related-functions.md#canvas-toolbar)或快捷键创建关系。每种关系类型都有各自的快捷键：

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

选定某种类型后光标会随之变化。先点击父表，再点击子表。  
若父表没有主键，则会为其添加主键；父表的每个主键列都会在子表上对应生成一个 `Not Null` 外键列，其数据类型、默认值和注释均与该主键列相同。  
每个外键列都以其对应的键命名：像 `id` 这样由一个单词组成的名称会在前面加上父表的名称（`user_id`），像 `member_id` 这样由多个单词组成的名称保持不变，子表中已有的名称则会加上编号（`user_id_2`），参见[外键列名](./relationship-editing.md#foreign-key-column-names)。  
对同一张表点击两次会绘制自引用关系。  
新建关系的 `On Delete` 与 `On Update` 起初均为 `Not set`，可通过该关系的右键菜单修改，参见 [ON DELETE 与 ON UPDATE](./relationship-editing.md#on-delete-and-on-update)。  
按 `Escape` 或再次按下相同的快捷键即可取消。取消后选中状态保持不变，再按一次 `Escape` 才会将其清除。

![用 ⌘ + ⌥ + 4 创建 One N 关系，再从画布工具栏创建 Zero N 关系](/img/demo-relationship.webp)

## 创建表与备注的副本

现有的表与备注可以通过复制、粘贴以及按住 `Alt` 拖动来生成副本，参见[表相关功能](./table-related-functions.md#copyingpasting-tables-and-memos)。
