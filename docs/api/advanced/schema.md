---
sidebar_position: 3
---

# Schema

The definition of the editor's schema is as follows.

## Typescript

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
  lww: LWW;
};
```

### Settings

```ts
type Settings = {
  width: number;
  height: number;
  scrollTop: number;
  scrollLeft: number;
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
  tableComment: /*        */ 0b0000000000000000000000000000001,
  columnComment: /*       */ 0b0000000000000000000000000000010,
  columnDataType: /*      */ 0b0000000000000000000000000000100,
  columnDefault: /*       */ 0b0000000000000000000000000001000,
  columnAutoIncrement: /* */ 0b0000000000000000000000000010000,
  columnPrimaryKey: /*    */ 0b0000000000000000000000000100000,
  columnUnique: /*        */ 0b0000000000000000000000001000000,
  columnNotNull: /*       */ 0b0000000000000000000000010000000,
  relationship: /*        */ 0b0000000000000000000000100000000,
} as const;

const ColumnType = {
  columnName: /*          */ 0b0000000000000000000000000000001,
  columnDataType: /*      */ 0b0000000000000000000000000000010,
  columnNotNull: /*       */ 0b0000000000000000000000000000100,
  columnUnique: /*        */ 0b0000000000000000000000000001000,
  columnAutoIncrement: /* */ 0b0000000000000000000000000010000,
  columnDefault: /*       */ 0b0000000000000000000000000100000,
  columnComment: /*       */ 0b0000000000000000000000001000000,
} as const;

const Database = {
  MariaDB: /*    */ 0b0000000000000000000000000000001,
  MSSQL: /*      */ 0b0000000000000000000000000000010,
  MySQL: /*      */ 0b0000000000000000000000000000100,
  Oracle: /*     */ 0b0000000000000000000000000001000,
  PostgreSQL: /* */ 0b0000000000000000000000000010000,
  SQLite: /*     */ 0b0000000000000000000000000100000,
} as const;

const Language = {
  GraphQL: /*    */ 0b0000000000000000000000000000001,
  csharp: /*     */ 0b0000000000000000000000000000010,
  Java: /*       */ 0b0000000000000000000000000000100,
  Kotlin: /*     */ 0b0000000000000000000000000001000,
  TypeScript: /* */ 0b0000000000000000000000000010000,
  JPA: /*        */ 0b0000000000000000000000000100000,
  Scala: /*      */ 0b0000000000000000000000001000000,
} as const;

const NameCase = {
  none: /*       */ 0b0000000000000000000000000000001,
  camelCase: /*  */ 0b0000000000000000000000000000010,
  pascalCase: /* */ 0b0000000000000000000000000000100,
  snakeCase: /*  */ 0b0000000000000000000000000001000,
} as const;

const BracketType = {
  none: /*        */ 0b0000000000000000000000000000001,
  doubleQuote: /* */ 0b0000000000000000000000000000010,
  singleQuote: /* */ 0b0000000000000000000000000000100,
  backtick: /*    */ 0b0000000000000000000000000001000,
} as const;

const SaveSettingType = {
  scroll: /*    */ 0b0000000000000000000000000000001,
  zoomLevel: /* */ 0b0000000000000000000000000000010,
};
```

### Doc

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
};
```

### LWW

```ts
/**
 * Last write wins
 * @example
 * Record<uuid, [tag, add, remove, Record<path, timestamp>]>
 */
type LWW = Record<string, LWWTuple>;
type LWWTuple = [string, number, number, Record<string, number>];
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
  autoIncrement: /* */ 0b0000000000000000000000000000001,
  primaryKey: /*    */ 0b0000000000000000000000000000010,
  unique: /*        */ 0b0000000000000000000000000000100,
  notNull: /*       */ 0b0000000000000000000000000001000,
} as const;

const ColumnUIKey = {
  primaryKey: /* */ 0b0000000000000000000000000000001,
  foreignKey: /* */ 0b0000000000000000000000000000010,
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
  ZeroOne: /*  */ 0b0000000000000000000000000000010,
  ZeroN: /*    */ 0b0000000000000000000000000000100,
  OneOnly: /*  */ 0b0000000000000000000000000001000,
  OneN: /*     */ 0b0000000000000000000000000010000,
} as const;

const StartRelationshipType = {
  ring: /* */ 0b0000000000000000000000000000001,
  dash: /* */ 0b0000000000000000000000000000010,
} as const;

const Direction = {
  left: /*   */ 0b0000000000000000000000000000001,
  right: /*  */ 0b0000000000000000000000000000010,
  top: /*    */ 0b0000000000000000000000000000100,
  bottom: /* */ 0b0000000000000000000000000001000,
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
  ASC: /*  */ 0b0000000000000000000000000000001,
  DESC: /* */ 0b0000000000000000000000000000010,
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

## [json-schema](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)

```json
{
  "$schema": "https://json-schema.org/draft-07/schema#",
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
      "$ref": "#/definitions/settings"
    },
    "doc": {
      "$ref": "#/definitions/doc"
    },
    "lww": {
      "$ref": "#/definitions/lww"
    },
    "collections": {
      "type": "object",
      "properties": {
        "tableEntities": {
          "$ref": "#/definitions/tableEntities"
        },
        "tableColumnEntities": {
          "$ref": "#/definitions/tableColumnEntities"
        },
        "relationshipEntities": {
          "$ref": "#/definitions/relationshipEntities"
        },
        "indexEntities": {
          "$ref": "#/definitions/indexEntities"
        },
        "indexColumnEntities": {
          "$ref": "#/definitions/indexColumnEntities"
        },
        "memoEntities": {
          "$ref": "#/definitions/memoEntities"
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
  "required": ["version", "settings", "doc", "lww", "collections"],
  "definitions": {
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
        "zoomLevel": {
          "type": "number",
          "minimum": 0.1,
          "maximum": 1
        },
        "show": {
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256)",
          "type": "integer"
        },
        "database": {
          "description": "bit value (MariaDB: 1) | (MSSQL: 2) | (MySQL: 4) | (Oracle: 8) | (PostgreSQL: 16) | (SQLite: 32)",
          "type": "integer"
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
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64)",
          "type": "integer"
        },
        "tableNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer"
        },
        "columnNameCase": {
          "description": "bit value (none: 1) | (camelCase: 2) | (pascalCase: 4) | (snakeCase: 8)",
          "type": "integer"
        },
        "bracketType": {
          "description": "bit value (none: 1) | (doubleQuote: 2) | (singleQuote: 4) | (backtick: 8)",
          "type": "integer"
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
    "lww": {
      "type": "object",
      "additionalProperties": {
        "type": "array",
        "prefixItems": [
          { "type": "string" },
          { "type": "integer" },
          { "type": "integer" },
          {
            "type": "object",
            "additionalProperties": {
              "type": "integer"
            }
          }
        ]
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
            "$ref": "#/definitions/EntityMeta"
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
            "$ref": "#/definitions/EntityMeta"
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
            "$ref": "#/definitions/RelationshipPoint"
          },
          "end": {
            "$ref": "#/definitions/RelationshipPoint"
          },
          "meta": {
            "$ref": "#/definitions/EntityMeta"
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
            "$ref": "#/definitions/EntityMeta"
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
            "$ref": "#/definitions/EntityMeta"
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
            "$ref": "#/definitions/EntityMeta"
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
