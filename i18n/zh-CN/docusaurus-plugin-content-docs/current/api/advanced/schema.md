---
sidebar_position: 3
description: .erd.json 文档格式：TypeScript 类型、各数值字段背后的常量，以及发布的 JSON Schema。
---

# Schema

`.erd.json` 是编辑器的文档格式。它是 `editor.value` 返回的内容、`setInitialValue()` 接受的内容，也是 JSON 导出写入的内容。如果需要在编辑器之外生成、校验或迁移文档，可以阅读本页。

## TypeScript

### ERDEditorSchemaV3

```ts
type ERDEditorSchemaV3 = {
  $schema: 'https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json';
  version: '3.0.0';
  settings: Settings;
  doc: Doc;
  collections: {
    tableEntities: Record<string, Table>;
    tableColumnEntities: Record<string, Column>;
    relationshipEntities: Record<string, Relationship>;
    indexEntities: Record<string, Index>;
    indexColumnEntities: Record<string, IndexColumn>;
    memoEntities: Record<string, Memo>;
  };
};
```

### Settings

```ts
type Settings = {
  width: number;
  height: number;
  scrollTop: number; // legacy, read once to migrate
  scrollLeft: number; // legacy, read once to migrate
  originX: number;
  originY: number;
  zoomLevel: number;
  show: number; // Constants: Show
  database: number; // Constants: Database
  databaseName: string;
  canvasType: string; // Constants: CanvasType
  language: number; // Constants: Language
  tableNameCase: number; // Constants: NameCase
  columnNameCase: number; // Constants: NameCase
  bracketType: number; // Constants: BracketType
  relationshipDataTypeSync: boolean;
  relationshipOptimization: boolean;
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  ignoreSaveSettings: number; // Constants: SaveSettingType
};

// Constants
const CanvasType = {
  ERD: 'ERD',
  visualization: '@dineug/erd-editor/builtin-visualization',
  schemaSQL: '@dineug/erd-editor/builtin-schema-sql',
  generatorCode: '@dineug/erd-editor/builtin-generator-code',
  settings: 'settings',
} as const;

const Show = {
  tableComment: 1,
  columnComment: 2,
  columnDataType: 4,
  columnDefault: 8,
  columnAutoIncrement: 16,
  columnPrimaryKey: 32,
  columnUnique: 64,
  columnNotNull: 128,
  relationship: 256,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
} as const;

const Database = {
  MariaDB: 1,
  MSSQL: 2,
  MySQL: 4,
  Oracle: 8,
  PostgreSQL: 16,
  SQLite: 32,
  Databricks: 64,
  Snowflake: 128,
} as const;

const Language = {
  GraphQL: 1,
  csharp: 2,
  Java: 4,
  Kotlin: 8,
  TypeScript: 16,
  JPA: 32,
  Scala: 64,
  Go: 128,
  SQLAlchemy: 256,
  TypeORM: 512,
  Sequelize: 1024,
  Drizzle: 2048,
  DBML: 4096,
  AML: 8192,
} as const;

const NameCase = {
  none: 1,
  camelCase: 2,
  pascalCase: 4,
  snakeCase: 8,
} as const;

const BracketType = {
  none: 1,
  doubleQuote: 2,
  singleQuote: 4,
  backtick: 8,
} as const;

const SaveSettingType = {
  scroll: 1,
  zoomLevel: 2,
} as const;
```

`originX` 和 `originY` 表示视图，也就是场景坐标 `(0, 0)` 落在屏幕上的位置。  
`scrollTop` 和 `scrollLeft` 是 `3.6.0` 之前所有编辑器都会读取的旧字段。解析器只在文档不带原点时读取它们一次，用以推算出 `originX` 和 `originY`，此后不再有任何地方写入它们。因此在这里保存的文档，用旧版编辑器打开时会停在那个编辑器上次离开的位置，而不是此版本保存的位置。  
`width` 和 `height` 是旧的画布尺寸。画布已经没有边界，因此不再有任何地方设置它们，但仍会以默认值写出，供旧版编辑器读取。  
`zoomLevel` 的范围是 `0.1` ~ `1.5`。保存时超过 `1` 的文档在 `3.5.0` 之前的编辑器中会以 `1` 打开。

`show` 和 `ignoreSaveSettings` 是位掩码，将各标志位通过 OR 运算组合。  
`columnOrder` 是一个数组，按显示顺序保存全部七个 `ColumnType` 值。  
`database`、`language`、`tableNameCase`、`columnNameCase` 和 `bracketType` 各自只保存一个值，JSON Schema 会拒绝组合后的值。

`Database` 和 `Language` 只会追加新值。已保存的文档中存储的是数字，因此新增的数据库厂商或代码生成目标会占用下一个比特位，而不是中间的某个位置。

### Doc

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
};
```

### EntityType

`collections` 中的每个实体都带有一个 `meta` 对象。

```ts
type EntityMeta = {
  updateAt: number;
  createAt: number;
};

type EntityType<T> = T & {
  meta: EntityMeta;
};
```

### Collection: tableEntities

```ts
type Table = EntityType<{
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[];
  ui: TableUI;
}>;

type TableUI = {
  x: number;
  y: number;
  zIndex: number;
  widthName: number;
  widthComment: number;
  color: string;
};
```

### Collection: tableColumnEntities

```ts
type Column = EntityType<{
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  ui: ColumnUI;
}>;

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthComment: number;
  widthDataType: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

### Collection: relationshipEntities

```ts
type Relationship = EntityType<{
  id: string;
  identification: boolean;
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType
  start: RelationshipPoint;
  end: RelationshipPoint;
}>;

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number;
  y: number;
  direction: number; // Constants: Direction
};

// Constants
const RelationshipType = {
  ZeroOne: 2,
  ZeroN: 4,
  OneOnly: 8,
  OneN: 16,
} as const;

const StartRelationshipType = {
  ring: 1,
  dash: 2,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

### Collection: indexEntities

```ts
type Index = EntityType<{
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[];
  unique: boolean;
}>;
```

### Collection: indexColumnEntities

```ts
type IndexColumn = EntityType<{
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
}>;

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Collection: memoEntities

```ts
type Memo = EntityType<{
  id: string;
  value: string;
  ui: MemoUI;
}>;

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  color: string;
};
```

## JSON Schema

规范的 schema 文件发布在 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)，可通过 `$schema` 直接引用。

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

在 `.erd.json` 文件顶部写入 `$schema`，VS Code 等支持 JSON Schema 的编辑器就会校验该文档，并在编辑时自动补全其字段。

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "erd-editor schema",
  "description": "Entity-Relationship Diagram Editor Schema",
  "type": "object",
  "properties": {
    "$schema": {
      "type": "string"
    },
    "version": {
      "description": "Version of the schema",
      "const": "3.0.0"
    },
    "settings": {
      "$ref": "#/$defs/settings"
    },
    "doc": {
      "$ref": "#/$defs/doc"
    },
    "collections": {
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/$defs/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/$defs/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/$defs/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/$defs/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/$defs/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/$defs/memoEntities"
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ]
    }
  },
  "required": ["version", "settings", "doc", "collections"],
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
        "width": {
          "type": "number",
          "minimum": 2000,
          "maximum": 20000
        },
        "height": {
          "type": "number",
          "minimum": 2000,
          "maximum": 20000
        },
        "scrollTop": {
          "type": "number"
        },
        "scrollLeft": {
          "type": "number"
        },
        "originX": {
          "type": "number"
        },
        "originY": {
          "type": "number"
        },
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1.5
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256)",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32) | (Databricks: 64) | (Snowflake: 128)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128]
        },
        "databaseName": {
          "type": "string"
        },
        "canvasType": {
          "enum": [
            "ERD",
            "@dineug/erd-editor/builtin-visualization",
            "@dineug/erd-editor/builtin-schema-sql",
            "@dineug/erd-editor/builtin-generator-code",
            "settings"
          ]
        },
        "language": {
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192]
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer",
          "enum": [1, 2, 4, 8]
        },
        "relationshipDataTypeSync": {
          "type": "boolean"
        },
        "relationshipOptimization": {
          "type": "boolean"
        },
        "columnOrder": {
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64)",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "minItems": 7,
          "maxItems": 7
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "ignoreSaveSettings": {
          "description": "bit value (scroll: 1) | (zoomLevel: 2)",
          "type": "integer"
        }
      },
      "required": [
        "width",
        "height",
        "scrollTop",
        "scrollLeft",
        "zoomLevel",
        "show",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "relationshipOptimization",
        "columnOrder",
        "maxWidthComment"
      ]
    },
    "doc": {
      "type": "object",
      "properties": {
        "tableIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "relationshipIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "indexIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "memoIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    },
    "tableEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "columnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "seqColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "zIndex": {
                "type": "number"
              },
              "widthName": {
                "type": "number"
              },
              "widthComment": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": [
              "x",
              "y",
              "zIndex",
              "widthName",
              "widthComment",
              "color"
            ]
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": [
          "id",
          "name",
          "comment",
          "columnIds",
          "seqColumnIds",
          "ui",
          "meta"
        ]
      }
    },
    "tableColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "comment": {
            "type": "string"
          },
          "dataType": {
            "type": "string"
          },
          "default": {
            "type": "string"
          },
          "options": {
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8)",
            "type": "integer"
          },
          "ui": {
            "type": "object",
            "properties": {
              "keys": {
                "description": "bit value (primaryKey: 1) | (foreignKey: 2)",
                "type": "integer"
              },
              "widthName": {
                "type": "number"
              },
              "widthComment": {
                "type": "number"
              },
              "widthDataType": {
                "type": "number"
              },
              "widthDefault": {
                "type": "number"
              }
            },
            "required": [
              "keys",
              "widthName",
              "widthComment",
              "widthDataType",
              "widthDefault"
            ]
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options",
          "ui",
          "meta"
        ]
      }
    },
    "relationshipEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "identification": {
            "type": "boolean"
          },
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "startRelationshipType": {
            "description": "bit value (ring: 1) | (dash: 2)",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": [
          "id",
          "identification",
          "relationshipType",
          "startRelationshipType",
          "start",
          "end",
          "meta"
        ]
      }
    },
    "indexEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "name": {
            "type": "string"
          },
          "tableId": {
            "type": "string"
          },
          "indexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "seqIndexColumnIds": {
            "type": "array",
            "items": {
              "type": "string"
            }
          },
          "unique": {
            "type": "boolean"
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": [
          "id",
          "name",
          "tableId",
          "indexColumnIds",
          "seqIndexColumnIds",
          "unique",
          "meta"
        ]
      }
    },
    "indexColumnEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "indexId": {
            "type": "string"
          },
          "columnId": {
            "type": "string"
          },
          "orderType": {
            "description": "bit value (ASC: 1) | (DESC: 2)",
            "type": "integer"
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": ["id", "indexId", "columnId", "orderType", "meta"]
      }
    },
    "memoEntities": {
      "type": "object",
      "additionalProperties": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string"
          },
          "value": {
            "type": "string"
          },
          "ui": {
            "type": "object",
            "properties": {
              "x": {
                "type": "number"
              },
              "y": {
                "type": "number"
              },
              "zIndex": {
                "type": "number"
              },
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              },
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "zIndex", "width", "height", "color"]
          },
          "meta": {
            "$ref": "#/$defs/EntityMeta"
          }
        },
        "required": ["id", "value", "ui", "meta"]
      }
    },
    "EntityMeta": {
      "type": "object",
      "properties": {
        "updateAt": {
          "type": "integer"
        },
        "createAt": {
          "type": "integer"
        }
      },
      "required": ["updateAt", "createAt"]
    },
    "RelationshipPoint": {
      "type": "object",
      "properties": {
        "tableId": {
          "type": "string"
        },
        "columnIds": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "x": {
          "type": "number"
        },
        "y": {
          "type": "number"
        },
        "direction": {
          "description": "bit value (left: 1) | (right: 2) | (top: 4) | (bottom: 8)",
          "type": "integer"
        }
      },
      "required": ["tableId", "columnIds", "x", "y", "direction"]
    }
  }
}
```
