---
sidebar_position: 3
description: The .erd.json document format — the TypeScript types, the constants behind each numeric field, and the published JSON Schema.
---

# Schema

`.erd.json` is the editor's document format. It is what `editor.value` returns, what `setInitialValue()` accepts, and what the JSON export writes — read this page if you need to generate, validate, or migrate a document outside the editor.

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

`originX` and `originY` are the view: the screen point scene `(0, 0)` lands on.  
`scrollTop` and `scrollLeft` are the legacy pair every editor before `3.6.0` reads. The parser reads them once, and only when a document carries no origin, to derive `originX` and `originY` from them; nothing writes them any more. A document saved here therefore opens in an older editor where that editor last left it, rather than where this one saved it.  
`width` and `height` are the legacy canvas size. The canvas is unbounded, so nothing sets them any longer; they are still written, at their defaults, for an older editor to read.  
`zoomLevel` runs from `0.1` to `1.5`. A document saved past `1` opens at `1` in an editor before `3.5.0`.

`canvasType` is the tab a document opens on. A document saved on the Visualization tab holds `'@dineug/erd-editor/builtin-visualization'` but not whether `Graph` or `Flow` mode was showing, and a newly created editor shows that tab in `Graph` mode.  
None of `Flow` mode's own state is serialized — its placement, zoom, pan, row display and focused tables stay in the editor — so `originX`, `originY` and `zoomLevel` always describe the ERD canvas.

`show` and `ignoreSaveSettings` are bitmasks — OR the flags together.  
`columnOrder` is an array holding all seven `ColumnType` values, in display order.  
`database`, `language`, `tableNameCase`, `columnNameCase` and `bracketType` each hold exactly one value, and the JSON Schema rejects a combined value.

`Database` and `Language` are append-only. A saved document stores the number, so a new vendor or code-generation target takes the next bit instead of a slot in the middle.

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

Every entity in `collections` carries a `meta` object.

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

The canonical schema file is published at [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) and can be referenced directly with `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Put `$schema` at the top of an `.erd.json` file and editors that understand JSON Schema, such as VS Code, validate the document and autocomplete its fields as you edit.

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
