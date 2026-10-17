---
sidebar_position: 3
description: "El formato de documento .erd.json: la forma de almacenamiento que contiene un archivo y el valor en tiempo de ejecución que mantiene un editor, los tipos de TypeScript, las constantes que hay detrás de cada campo numérico y el JSON Schema publicado."
---

# Esquema

`.erd.json` es el formato de documento del editor. Lee esta página si necesitas generar, validar o migrar un documento fuera del editor.

Desde la `4.0.0`, un documento tiene dos serializaciones, ambas con `version` `'3.0.0'`. La forma de almacenamiento es lo que contiene un archivo: es lo que devuelve [`editor.value`](../erd-editor-element.md#value), lo que escribe la exportación JSON y la única forma que acepta el [JSON Schema](#json-schema) publicado. El valor en tiempo de ejecución es el documento entero tal como lo mantiene un editor, y lo devuelve [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, el setter de `value` y `setSchemaJSON()` leen cualquiera de las dos formas, cualquier archivo que haya guardado una versión anterior y un documento `.vuerd` v2. Antes de la `4.0.0`, solo había una: `value` devolvía el documento entero tal como lo mantenía el editor, como hace ahora `runtimeValue`.

## Forma de almacenamiento y valor en tiempo de ejecución {#storage-form-and-runtime-value}

La forma de almacenamiento contiene solo las entidades activas: cada tabla listada en `doc.tableIds`, las columnas que listan esas tablas, las relaciones entre dos tablas conservadas, los índices de las tablas conservadas, con las columnas de índice cuya columna aún lista la tabla, y las notas y los grupos de tablas listados. Deja fuera lo que un editor deriva al cargar o mantiene mientras está abierto: las entidades eliminadas, `seqColumnIds` y `seqIndexColumnIds`, cada `zIndex`, los anchos medidos, el `ui` de las columnas y, de una relación, `identification`, `startRelationshipType` y los anclajes. Los tipos de abajo marcan cada uno de estos campos con `// runtime only`.  
Cada colección tiene como claves los ids, en orden de unidades de código, con las columnas agrupadas primero por `tableId` y las columnas de índice por `indexId`. Cada entidad escribe sus campos en un orden fijo, y el texto se sangra con dos espacios y termina con un salto de línea. Así, el mismo documento escribe siempre los mismos bytes, una edición cambia solo lo que toca y un archivo guardado en un ordenador con otras fuentes se vuelve a abrir con el mismo `value`.  
VS Code, Obsidian y el plugin de JetBrains escriben un archivo solo cuando una edición cambia `value`, así que un archivo que guardó una versión anterior conserva su forma antigua hasta su primera edición.

El valor en tiempo de ejecución conserva lo que la forma de almacenamiento deja fuera: entidades eliminadas, secuencias, z-index, anchos, marcas de clave, indicadores de relación y anclajes. Se sangra con dos espacios y no termina con salto de línea. Úsalo solo para inicializar un colaborador o una segunda vista mediante `setInitialValue()`, para que, cuando otro editor envíe el deshacer de una eliminación, la entidad vuelva allí completa. No lo escribas nunca en un archivo; el JSON Schema lo rechaza. Ya no se recolectan las entidades eliminadas, así que el valor en tiempo de ejecución las conserva hasta que el documento se vuelve a abrir desde su archivo.

Ambas formas escriben cada ajuste bloqueado con su valor bloqueado (consulta [`lockSettings`](#settings)), `settings.ddlScripts` solo mientras un script contiene texto y el `groupId` de una tabla solo mientras no está vacío. La forma de almacenamiento escribe `doc.tableGroupIds` y `tableGroupEntities` solo mientras existe un grupo de tablas; el valor en tiempo de ejecución los escribe mientras el documento contiene un grupo o uno eliminado.

## TypeScript {#typescript}

Los tipos describen el valor en tiempo de ejecución. Un campo marcado con `// runtime only` queda fuera de la forma de almacenamiento, y un campo marcado con `?` solo se escribe mientras contiene algo.

### ERDEditorSchemaV3 {#erdeditorschemav3}

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
    tableGroupEntities?: Record<string, TableGroup>;
  };
};
```

La clave de cada entidad es su `id`, una cadena opaca; el análisis descarta una entidad cuyo `id` falta o está vacío. Desde la `4.0.0`, cada id nuevo es un UUIDv7 escrito en formato Uuid25, 25 dígitos en base 36 en minúscula como `03gzrxjv20bdlcak89q25d2m7`, de modo que los ids que genera un editor se ordenan en el orden en que los creó. Un documento conserva los ids que contiene, como los ids nanoid de una versión anterior o los ids de un archivo v2, así que nada debe depender de la forma de un id.

Desde la `4.0.0`, ninguna entidad lleva un objeto `meta` (`createAt`, `updateAt`), y se eliminaron los tipos `EntityMeta` y `EntityType`. Nada lo escribe, el análisis descarta el `meta` que lleva un archivo más antiguo y el JSON Schema lo rechaza. Solo servía para temporizar la recolección de elementos no utilizados de las entidades eliminadas, que también ha desaparecido.

### Ajustes {#settings}

```ts
type Settings = {
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
  columnOrder: number[]; // Constants: ColumnType
  maxWidthComment: number;
  lockSettings: number; // Constants: LockSettingType
  ddlScripts?: DDLScripts;
};

type DDLScripts = {
  before: string;
  after: string;
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
  columnAlternateKey: 512,
  hideReferentialAction: 1024,
  hideTableGroup: 2048,
  hideMemo: 4096,
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
  Mermaid: 16384,
  PHP: 32768,
  Doctrine: 65536,
  Rust: 131072,
  SeaORM: 262144,
  Swift: 524288,
  Zod: 1048576,
  JSONSchema: 2097152,
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

const LockSettingType = {
  viewport: 1, // originX, originY and zoomLevel
  canvasType: 2,
  language: 4,
  tableNameCase: 8,
  columnNameCase: 16,
  bracketType: 32,
} as const;
```

`originX` y `originY` son la vista: el punto de la pantalla en el que cae el punto `(0, 0)` de la escena.  
`zoomLevel` va de `0.1` a `1.5`. Un documento guardado con un valor superior a `1` se abre con `1` en un editor anterior a la `3.5.0`.  
Desde la `4.0.0`, los ajustes no llevan `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ni `ignoreSaveSettings`. Nada los escribe, el analizador no conserva ninguno y el JSON Schema rechaza un archivo que todavía los tenga.

`canvasType` es la pestaña en la que se abre un documento. Un documento guardado en la pestaña Visualización contiene `'@dineug/erd-editor/builtin-visualization'`, pero no si se mostraba el modo `Graph` o `Flow`, y un editor recién creado muestra esa pestaña en modo `Graph`.  
Desde la `4.0.0`, mientras el bloqueo `Canvas Type` está activado, como lo está en un documento nuevo, el documento conserva la pestaña que se mostraba al bloquearlo, y cambiar de pestaña deja `value` como estaba. Un bloqueo activado en la pestaña Configuración guarda la pestaña de la que venía el lector, y un `'settings'` bloqueado, que solo puede escribir una edición manual, se abre en `'ERD'`.  
No se serializa nada del estado propio del modo `Flow` —su colocación, zoom, desplazamiento de la vista, vista de filas y tablas en las que se centra se quedan en el editor—, así que `originX`, `originY` y `zoomLevel` describen siempre el lienzo ERD.

`show` y `lockSettings` son máscaras de bits: combina los indicadores con OR.  
`columnOrder` es un array que contiene los siete valores de `ColumnType`, en el orden de visualización.  
`database`, `language`, `tableNameCase`, `columnNameCase` y `bracketType` contienen cada uno exactamente un valor, y el JSON Schema rechaza un valor combinado.

El `show` de un documento nuevo es `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` y `relationship`.  
Desde la `3.10.0`, hay dos indicadores de `show` más, ambos desactivados en un documento nuevo y en todo documento guardado antes de la `3.10.0`.  
`columnAlternateKey` (`512`) es la opción de vista [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Con el indicador activado, marca las columnas de cada índice único de dos o más columnas como `AK1.1`, `AK1.2`, etc. Empieza desactivado, así que ningún diagrama existente cambia de ancho.  
`hideReferentialAction` (`1024`) funciona al revés: cuando está activado, oculta las [etiquetas ON DELETE y ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) de los conectores, así que se muestran de forma predeterminada. La opción de vista `Referential Actions` está marcada mientras el indicador está desactivado. No cambia el tamaño de ninguna tabla.  
Un editor anterior a la `3.10.0` conserva `show` como un número entero, así que ambos indicadores sobreviven a un guardado allí.

Desde la `4.0.0`, hay dos indicadores de `show` más, ambos desactivados en un documento nuevo y en todo documento guardado antes de la `4.0.0`. Como `hideReferentialAction`, cada uno oculta lo que nombra, así que los grupos de tablas y las notas se muestran de forma predeterminada.  
`hideTableGroup` (`2048`) oculta los [grupos de tablas](../../guide/guides/table-groups.md), y `hideMemo` (`4096`) oculta todas las notas. Son las [opciones de vista](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` y `Memos`, cada una marcada mientras su indicador está desactivado. Ninguno de los dos cambia el tamaño de ninguna tabla.  
Un editor anterior a la `4.0.0` conserva `show` como un número entero, así que ambos indicadores sobreviven a un guardado allí.

Desde la `4.0.0`, `Language` tiene ocho destinos más del [Generador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Un `language` que el analizador no conoce se lee como `GraphQL`, así que un editor anterior a la `4.0.0` abre en GraphQL un documento guardado con uno de ellos, y al guardar allí se escribe GraphQL.

Desde la `4.0.0`, `lockSettings` ocupa el lugar de `ignoreSaveSettings`, y `LockSettingType` el de `SaveSettingType`, que se eliminó. `lockSettings` nombra los ajustes que un documento guarda tal como estaban cuando se bloquearon. `viewport` abarca `originX`, `originY` y `zoomLevel` juntos, ya que un origen guardado sin su zoom se abre en otro sitio, y cada uno de los demás bits abarca el campo del que toma su nombre. Son las filas de [`Lock`](../../guide/guides/settings.md#lock) de la pestaña Configuración.  
Tanto `value` como `runtimeValue` escriben un ajuste bloqueado con su valor bloqueado, muestre lo que muestre el editor, y cada uno de los demás ajustes tal como está. Así, mientras el bloqueo correspondiente está activado, desplazarse y hacer zoom, cambiar de pestaña o cambiar el lenguaje del Generador de código, un estilo de nombres o el tipo de delimitador deja el archivo como estaba. Al bloquear se toma el valor que el ajuste tiene en ese momento, y el análisis toma el valor bloqueado del campo guardado.  
Un documento que parte de cero —un editor o un almacén de replicación nuevos, o un valor vacío pasado a `value` o a `setInitialValue()`— tiene `lockSettings` en `63`, con todos los bloqueos activados. Un documento cuyos `settings` no llevan `lockSettings` —todo archivo guardado antes de la `4.0.0`, sea cual sea su `ignoreSaveSettings`, y todo documento v2— también se abre con todos los bloqueos activados: su vista y su pestaña donde están las de un documento nuevo (`originX` y `originY` a `0`, `zoomLevel` a `1`, la pestaña ERD), y su lenguaje, sus estilos de nombres y su tipo de delimitador bloqueados en los valores que guardó. Un documento que nombra sus bloqueos los conserva, `0` incluido, junto con todos los valores que guardó.  
El análisis conserva todos los bits de `lockSettings`, también los desconocidos, así que un bloqueo que añada una versión posterior sobrevive a un guardado aquí; el JSON Schema solo comprueba que sea un entero. Un editor anterior a la `4.0.0` descarta `lockSettings` al guardar y escribe la vista y la pestaña tal como están, así que el archivo vuelve a abrirse aquí como uno guardado antes de la `4.0.0`.

Desde la `4.0.0`, `ddlScripts` contiene los dos scripts de la pestaña [Esquema SQL](../../guide/guides/schema-sql.md), que escribe el DDL de todas las bases de datos: `before` después de la cabecera y antes de las tablas, `after` tras el DDL generado. El DDL escribe cada uno con saltos de línea LF, sin sus líneas en blanco iniciales ni sus espacios en blanco finales y, en MSSQL, terminado en `GO`, como se describe en [Scripts previos y posteriores](../../guide/guides/schema-sql.md#before-and-after-scripts); el propio `ddlScripts` conserva cada script tal como se escribió. La clave solo se escribe mientras alguno de los scripts contiene texto, y entonces con ambos; una clave que falta, o un script que no es una cadena, se lee como `''`. Las opciones `Statements`, `Header` y `Tables` de la pestaña no se guardan en el documento.  
Un editor anterior a la `4.0.0` descarta los scripts al cargar un documento, así que al guardar allí se pierden.

`Database`, `Language`, `Show`, `LockSettingType` y `ReferentialAction` solo admiten añadir valores al final. Un documento guardado almacena el número, así que un nuevo proveedor, destino de generación de código, indicador, bloqueo o acción toma el siguiente bit en lugar de un hueco intermedio.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
};
```

Cada lista es el orden de un tipo de entidad, que leen el DDL, la ordenación de tablas y el orden de dibujo. En la forma de almacenamiento, cada lista contiene solo los ids de las entidades conservadas, cada uno una sola vez, en el orden listado. Desde la `4.0.0`, `tableGroupIds` es el orden de los grupos de tablas.

Desde la `4.0.0`, el orden de apilamiento no se guarda. El análisis apila cada tabla, nota y grupo de tablas listado que no lleve `zIndex` según su posición en su lista, con los posteriores delante: los grupos de tablas desde `1`, las tablas desde `2` y las notas por encima de todas las tablas. Una entidad que lleva un `zIndex`, como en un valor en tiempo de ejecución o en un archivo guardado antes de la `4.0.0`, lo conserva. Por eso, traer una tabla o una nota al frente se pierde al volver a abrir el archivo.

### Colección: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Desde la `4.0.0`, una tabla lleva `groupId`, el id del [grupo de tablas](../../guide/guides/table-groups.md) al que pertenece. Un `groupId` que falta o está vacío, o que no nombra ningún grupo de `doc.tableGroupIds`, significa que no pertenece a ninguno, y la forma de almacenamiento solo lo escribe mientras nombra un grupo conservado.  
El análisis inicializa `seqColumnIds` con `columnIds` cuando falta o le falta un id listado, y un editor vuelve a medir `widthName` y `widthComment` con sus propias fuentes en cada carga.

### Colección: tableColumnEntities {#collection-tablecolumnentities}

```ts
type Column = {
  id: string;
  tableId: string;
  name: string;
  comment: string;
  dataType: string;
  default: string;
  options: number; // Constants: ColumnOption
  ui: ColumnUI; // runtime only
};

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

Desde la `4.0.0`, la forma de almacenamiento no escribe el `ui` de las columnas. Cada carga deriva `keys` —la marca de clave principal a partir del bit `primaryKey` de `options` y la marca de clave externa a partir de las relaciones que terminan en la columna— y mide los cuatro anchos.  
Un editor anterior a la `4.0.0` muestra las columnas de un archivo guardado aquí sin sus iconos de clave principal.

### Colección: relationshipEntities {#collection-relationshipentities}

```ts
type Relationship = {
  id: string;
  identification: boolean; // runtime only
  relationshipType: number; // Constants: RelationshipType
  startRelationshipType: number; // Constants: StartRelationshipType; runtime only
  onDelete: number; // Constants: ReferentialAction
  onUpdate: number; // Constants: ReferentialAction
  start: RelationshipPoint;
  end: RelationshipPoint;
};

type RelationshipPoint = {
  tableId: string;
  columnIds: string[];
  x: number; // runtime only
  y: number; // runtime only
  direction: number; // Constants: Direction; runtime only
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

const ReferentialAction = {
  none: 1,
  noAction: 2,
  cascade: 4,
  setNull: 8,
  setDefault: 16,
  restrict: 32,
} as const;

const Direction = {
  left: 1,
  right: 2,
  top: 4,
  bottom: 8,
} as const;
```

Desde la `3.10.0`, una relación lleva `onDelete` y `onUpdate`, sus [acciones ON DELETE y ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Cada uno contiene exactamente un valor de `ReferentialAction`. `none`, el valor predeterminado, no escribe ninguna cláusula, así que se aplica el valor predeterminado de la propia base de datos. Los otros cinco representan `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` y `RESTRICT`. Esquema SQL solo escribe una cláusula para una base de datos que acepte su acción.  
La forma de almacenamiento siempre escribe ambos y, desde la `4.0.0`, el JSON Schema los exige y solo comprueba que cada uno sea un entero. El análisis sigue leyendo como `none` un campo que falta, como en todo documento guardado antes de la `3.10.0`, y lo mismo hace con un valor fuera de la lista.  
Un editor anterior a la `3.10.0` no conoce estos campos y los descarta al cargar un documento, así que al guardar allí se pierden todas las acciones.

Desde la `4.0.0`, cada carga deriva lo que la forma de almacenamiento deja fuera. Una relación es identificadora cuando todas las columnas en las que termina son clave principal, y su `startRelationshipType` es `dash` cuando todas esas columnas son NOT NULL y `ring` en caso contrario; una a la que no le queda ninguna columna final es no identificadora y `dash`, como empieza una relación nueva. Los anclajes —`x`, `y` y `direction`— se vuelven a colocar.

### Colección: indexEntities {#collection-indexentities}

```ts
type Index = {
  id: string;
  name: string;
  tableId: string;
  indexColumnIds: string[];
  seqIndexColumnIds: string[]; // runtime only
  unique: boolean;
};
```

El análisis inicializa `seqIndexColumnIds` con `indexColumnIds` cuando falta o le falta un id listado.

### Colección: indexColumnEntities {#collection-indexcolumnentities}

```ts
type IndexColumn = {
  id: string;
  indexId: string;
  columnId: string;
  orderType: number; // Constants: OrderType
};

// Constants
const OrderType = {
  ASC: 1,
  DESC: 2,
} as const;
```

### Colección: memoEntities {#collection-memoentities}

```ts
type Memo = {
  id: string;
  value: string;
  ui: MemoUI;
};

type MemoUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
  color: string;
};
```

Desde la `4.0.0`, las tablas y las notas [comparten una misma pila](../../guide/guides/table-related-functions.md#moving-multiple-tables) ordenada por `zIndex`, así que traer una tabla al frente puede colocarla sobre una nota. El análisis apila una nota guardada sin `zIndex` por encima de todas las tablas, como se describe en [Doc](#doc). Una nota de un archivo guardado antes de la `4.0.0` conserva el `zIndex` que guardó, que procedía del mismo contador que el de las tablas, así que una nota que una versión anterior dibujó sobre todas las tablas puede abrirse debajo de una tabla traída al frente después de ella.

### Colección: tableGroupEntities {#collection-tablegroupentities}

```ts
type TableGroup = {
  id: string;
  name: string;
  color: string;
  ui: TableGroupUI;
};

type TableGroupUI = {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number; // runtime only
};
```

Desde la `4.0.0`, un documento puede contener [grupos de tablas](../../guide/guides/table-groups.md): rectángulos con nombre y color que se dibujan detrás de las tablas. Una tabla se une a uno mediante su propio `groupId`, así que un grupo no contiene ninguna lista de miembros. La forma de almacenamiento escribe la colección, como `doc.tableGroupIds`, solo mientras existe un grupo, y un documento sin ella, como uno guardado antes de la `4.0.0`, no tiene grupos. `Show.hideTableGroup` los oculta.  
Un editor anterior a la `4.0.0` descarta los grupos y el `groupId` de cada tabla al cargar un documento, así que al guardar allí se pierden todos los grupos.

## JSON Schema {#json-schema}

El archivo de esquema canónico se publica en [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) y se puede referenciar directamente con `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Pon `$schema` al principio de un archivo `.erd.json` y los editores que entienden JSON Schema, como VS Code, validan el documento y autocompletan sus campos mientras editas.

Desde la `4.0.0`, el esquema describe solo la forma de almacenamiento. Todo objeto con campos con nombre está cerrado (`additionalProperties: false`), todo campo que la forma de almacenamiento escribe siempre es obligatorio y no se nombra ningún campo que deje fuera. Por eso rechaza el valor en tiempo de ejecución. También rechaza un archivo guardado antes de la `4.0.0`, con su `meta`, sus anchos, su `zIndex`, su `ignoreSaveSettings` y lo demás, hasta que un editor de la `4.0.0` o posterior vuelva a guardar ese archivo. Un archivo guardado por la `3.2.0` o posterior ya nombra la URL de este esquema, que apunta a la rama `main`, así que un editor que valida con él señala ahora el archivo. Un archivo guardado por la `3.0.0` o la `3.1.0`, o un documento v2, no nombra ningún `$schema`.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order, without what an editor derives on load or keeps while it is open",
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
        },
        "tableGroupEntities": {
          "$ref": "#/$defs/tableGroupEntities"
        }
      },
      "required": [
        "tableEntities",
        "tableColumnEntities",
        "relationshipEntities",
        "indexEntities",
        "indexColumnEntities",
        "memoEntities"
      ],
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc", "collections"],
  "additionalProperties": false,
  "$defs": {
    "settings": {
      "type": "object",
      "properties": {
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096); the three hide bits hide what they name while set",
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
          "description": "bit value (GraphQL: 1) | (csharp: 2) | (Java: 4) | (Kotlin: 8) | (TypeScript: 16) | (JPA: 32) | (Scala: 64) | (Go: 128) | (SQLAlchemy: 256) | (TypeORM: 512) | (Sequelize: 1024) | (Drizzle: 2048) | (DBML: 4096) | (AML: 8192) | (Mermaid: 16384) | (PHP: 32768) | (Doctrine: 65536) | (Rust: 131072) | (SeaORM: 262144) | (Swift: 524288) | (Zod: 1048576) | (JSONSchema: 2097152)",
          "type": "integer",
          "enum": [1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576, 2097152]
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
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel",
          "type": "integer"
        },
        "ddlScripts": {
          "description": "SQL the Schema SQL writes as is for every database: before after the header and ahead of the tables, after past the generated DDL. Absent while both are empty",
          "type": "object",
          "properties": {
            "before": { "type": "string" },
            "after": { "type": "string" }
          },
          "required": ["before", "after"],
          "additionalProperties": false
        }
      },
      "required": [
        "originX",
        "originY",
        "zoomLevel",
        "show",
        "database",
        "databaseName",
        "canvasType",
        "language",
        "tableNameCase",
        "columnNameCase",
        "bracketType",
        "relationshipDataTypeSync",
        "columnOrder",
        "maxWidthComment",
        "lockSettings"
      ],
      "additionalProperties": false
    },
    "doc": {
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read",
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
        },
        "tableGroupIds": {
          "description": "Order of the table groups. Written while a group exists; absent means none",
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      },
      "required": ["tableIds", "relationshipIds", "indexIds", "memoIds"],
      "additionalProperties": false
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
          "groupId": {
            "description": "Id of the table group in doc.tableGroupIds the table belongs to; absent means none",
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
              "color": {
                "type": "string"
              }
            },
            "required": ["x", "y", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "comment", "columnIds", "ui"],
        "additionalProperties": false
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
          }
        },
        "required": [
          "id",
          "tableId",
          "name",
          "comment",
          "dataType",
          "default",
          "options"
        ],
        "additionalProperties": false
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
          "relationshipType": {
            "description": "bit value (ZeroOne: 2) | (ZeroN: 4) | (OneOnly: 8) | (OneN: 16)",
            "type": "integer"
          },
          "onDelete": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON DELETE clause",
            "type": "integer"
          },
          "onUpdate": {
            "description": "bit value (none: 1) | (noAction: 2) | (cascade: 4) | (setNull: 8) | (setDefault: 16) | (restrict: 32); none, the default, writes no ON UPDATE clause",
            "type": "integer"
          },
          "start": {
            "$ref": "#/$defs/RelationshipPoint"
          },
          "end": {
            "$ref": "#/$defs/RelationshipPoint"
          }
        },
        "required": [
          "id",
          "relationshipType",
          "onDelete",
          "onUpdate",
          "start",
          "end"
        ],
        "additionalProperties": false
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
          "unique": {
            "type": "boolean"
          }
        },
        "required": ["id", "name", "tableId", "indexColumnIds", "unique"],
        "additionalProperties": false
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
          }
        },
        "required": ["id", "indexId", "columnId", "orderType"],
        "additionalProperties": false
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
            "required": ["x", "y", "width", "height", "color"],
            "additionalProperties": false
          }
        },
        "required": ["id", "value", "ui"],
        "additionalProperties": false
      }
    },
    "tableGroupEntities": {
      "description": "Named, coloured rectangles drawn behind tables; a table joins one through its groupId. Written while a group exists; absent means none",
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
          "color": {
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
              "width": {
                "type": "number"
              },
              "height": {
                "type": "number"
              }
            },
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "name", "color", "ui"],
        "additionalProperties": false
      }
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
        }
      },
      "required": ["tableId", "columnIds"],
      "additionalProperties": false
    }
  }
}
```
