---
sidebar_position: 2
description: 导入 JSON 或 schema SQL，导出 JSON、schema SQL 或 PNG。
---

# 导入与导出文件

## 导入外部文件

### JSON

可以导入[编辑器定义的 schema 格式](../../api/advanced/schema.md)文件。
文件名必须以 `.json` 结尾，此处不接受 `.erd` 或 `.vuerd` 文件。

<img src="/img/import-json.png" width="400" alt="导入 JSON 菜单" loading="lazy" />

### Schema SQL

也可以导入用 SQL 定义的 schema 文件。  
解析器已尽量做到与数据库厂商无关且足够宽松，但仍可能存在不支持的语法。  
[支持的语法可在此查看。](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

<img src="/img/import-sql.png" width="400" alt="导入 Schema SQL 菜单" loading="lazy" />

## 导出

导出支持以下三种格式：

- JSON：编辑器定义的 schema 文件。保存为 `<数据库名>-<时间戳>.erd.json`。
- Schema SQL：按照数据库厂商语法生成的 schema 文件。
- PNG：将图导出为图片。

<img src="/img/export-menu.png" width="400" alt="导出菜单" loading="lazy" />
