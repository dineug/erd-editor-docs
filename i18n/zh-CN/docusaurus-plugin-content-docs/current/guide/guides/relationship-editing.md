---
sidebar_position: 5
description: 删除关系、修改关系类型、读懂连接线，以及 N:M 关系与识别关系。
---

# 编辑关系

关系通过画布右键菜单或快捷键创建，参见[开始编辑](./editing-start.md)。  
本页介绍关系创建之后可以进行的操作。

## 删除

可通过关系的右键菜单删除。

<img src="/img/relationship-remove.png" width="400" alt="包含删除项的关系右键菜单" loading="lazy" />

由于关系不像表或备注那样会被选中，因此没有对应的快捷键。  
关系还会随它连接的对象一起被删除：删除表会删除与该表相连的所有关系，删除列会删除使用该列的所有关系。

## 修改类型

可通过关系的右键菜单修改。  
提供以下四种类型，当前类型会带有勾选标记：

- Zero One
- Zero N
- One Only
- One N

<img src="/img/relationship-type.png" width="400" alt="关系类型菜单" loading="lazy" />

这与创建关系时选择的四种类型相同，每种类型都有各自的快捷键，参见[开始编辑](./editing-start.md)。

## N:M 关系

由于编辑器基于物理模型，N:M 关系会如下图所示，用一张映射表来表达。

<img src="/img/relationship-n-m.png" width="400" alt="N:M 关系的生成结果" loading="lazy" />

导入 GraphQL、DBML 或 AML 时会自动生成映射表。  
多对多声明会生成名为 `<left>_<right>` 的表，并带有 `Junction table inferred from <left> <-> <right>` 注释，通过识别关系与两侧相连。  
参见[导入与导出文件](./file-import-export.md)。

## 识别关系

创建关系时，父表的每个主键都会以 `NOT NULL` 外键列的形式复制到子表上，因此新建的关系起初是非识别关系。  
若要使其成为识别关系，可通过 `Alt + K` 或表右键菜单中的 `Primary Key`，将子表上的这些外键列设为主键。

<img src="/img/identifier-relationship.png" width="400" alt="识别关系" loading="lazy" />

编辑器会自动保持该状态同步。  
子表一侧的所有列都是主键时为识别关系，其中任意一列不再是主键时就会变为非识别关系。

## 读懂连接线

- 识别关系以实线绘制，非识别关系以虚线绘制。
- 子表一端带有关系类型对应的基数符号：Zero One 为圆环和竖线，Zero N 为圆环和鸦爪，One Only 为两条竖线，One N 为竖线和鸦爪。
- 当任意外键列允许 `NULL` 时，父表一端为圆环，当所有外键列均为 `NOT NULL` 时则为一条短线。
- 鼠标悬停在连接线上时，会同时高亮该连接线以及它在两个表中连接的列。

通过 `Relationship` 显示选项可以完全隐藏连接线，参见[表相关功能](./table-related-functions.md)。

## 连接线路径

连接线按正交方式布置。  
路径会绕开位于两端之间的表，而不是从表上穿过，拐角以 45 度切除。  
从表的同一侧引出的路径会被分到各自独立的通道上，以免相互重叠。

没有可配置的项目。  
画布上有任何元素移动或改变大小时，路径都会自动重新计算，因此无需手动调整。
