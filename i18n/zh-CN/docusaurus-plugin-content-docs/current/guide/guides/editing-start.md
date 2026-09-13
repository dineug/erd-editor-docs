---
sidebar_position: 1
description: 从画布右键菜单创建表、备注与关系。
---

# 开始编辑

编辑从右键菜单开始。

<img src="/img/context-menu.png" width="400" alt="画布右键菜单" loading="lazy" />

在表或关系上右键则会打开该项自身的菜单。

## 创建表

通过右键菜单或快捷键 `Alt + N` 创建表。

## 创建备注

通过右键菜单或快捷键 `Alt + M` 创建备注。

备注是画布上的自由文本笔记。在其正文区域点击后即可输入，内容会随文档一起保存。  
拖动边框可调整其大小，通过标题栏中的 `x` 可将其删除。

## 创建关系

通过右键菜单、画布底部的[画布工具栏](./table-related-functions.md#canvas-toolbar)或快捷键创建关系。每种关系类型都有各自的快捷键：

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) or `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) or `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) or `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) or `⌘ + ⌥ + 4` (Mac)

选定某种类型后光标会随之变化。先点击父表，再点击子表。  
若父表没有主键，则会为其添加主键，并在子表上创建与之匹配的外键列（名称、数据类型、默认值和注释均相同，并设为 `Not Null`）。  
对同一张表点击两次会绘制自引用关系。  
按 `Escape` 或再次按下相同的快捷键即可取消。

![demo-relationship](/img/demo-relationship.webp)

## 创建表与备注的副本

现有的表与备注可以通过复制、粘贴以及按住 `Alt` 拖动来生成副本，参见[表相关功能](./table-related-functions.md#copyingpasting-tables-and-memos)。
