---
sidebar_position: 3
description: .erd.json 문서 형식의 TypeScript 타입, 숫자 필드별 상수와 게시된 JSON Schema.
---

# Schema

`.erd.json`은 에디터의 문서 형식입니다. `editor.value`가 반환하고, `setInitialValue()`가 받고, JSON 내보내기가 기록하는 형식입니다. 에디터 밖에서 문서를 생성하거나 검증하거나 마이그레이션해야 한다면 이 페이지를 참고하세요.

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

`originX`와 `originY`는 화면 위치, 즉 씬 좌표 `(0, 0)`이 화면에서 놓이는 지점입니다.  
`scrollTop`과 `scrollLeft`는 `3.6.0` 이전의 모든 에디터가 읽는 레거시 값입니다. 파서는 문서에 원점이 없을 때만 이 값을 한 번 읽어 `originX`, `originY`를 계산하며, 더 이상 어디에서도 기록하지 않습니다. 따라서 여기서 저장한 문서는 예전 에디터에서 열면 이 버전이 저장한 위치가 아니라 그 에디터가 마지막으로 보던 위치에서 열립니다.  
`width`와 `height`는 레거시 캔버스 크기입니다. 캔버스에 경계가 없어져 더 이상 설정하지 않지만, 예전 에디터가 읽을 수 있도록 기본값 그대로 기록됩니다.  
`zoomLevel`은 `0.1`부터 `1.5`까지입니다. `1`을 넘겨 저장한 문서는 `3.5.0` 이전 에디터에서 `1`로 열립니다.

`show`와 `ignoreSaveSettings`는 비트마스크이므로 플래그를 OR로 결합합니다.  
`columnOrder`는 7개의 `ColumnType` 값을 모두 담은 배열이며 표출 순서를 나타냅니다.  
`database`, `language`, `tableNameCase`, `columnNameCase`, `bracketType`은 각각 정확히 하나의 값만 가지며, 결합된 값은 JSON Schema에서 거부됩니다.

`Database`와 `Language`는 추가만 가능합니다. 저장된 문서에는 숫자가 기록되므로, 새로운 데이터베이스 벤더나 코드 생성 대상은 중간 자리를 차지하지 않고 다음 비트를 사용합니다.

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

`collections`의 모든 엔티티는 `meta` 객체를 가집니다.

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

정식 스키마 파일은 [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)에 게시되어 있으며 `$schema`로 직접 참조할 수 있습니다.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

`.erd.json` 파일 맨 위에 `$schema`를 넣으면 VS Code처럼 JSON Schema를 이해하는 에디터가 편집하는 동안 문서를 검증하고 필드를 자동완성합니다.

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
