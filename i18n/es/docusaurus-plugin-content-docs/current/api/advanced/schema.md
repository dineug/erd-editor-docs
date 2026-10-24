---
sidebar_position: 3
description: "El formato de documento .erd.json: la forma de almacenamiento que contiene un archivo y el valor en tiempo de ejecución que mantiene un editor, los tipos de TypeScript, las constantes que hay detrás de cada campo numérico y el JSON Schema publicado."
---

# Esquema

`.erd.json` es el formato de documento del editor. Lee esta página si necesitas generar, validar o migrar un documento fuera del editor.

Desde la `4.0.0`, un documento tiene dos serializaciones, ambas con `version` `'3.0.0'`. La forma de almacenamiento es lo que contiene un archivo: es lo que devuelve [`editor.value`](../erd-editor-element.md#value), lo que escribe la exportación JSON y la única forma que acepta el [JSON Schema](#json-schema) publicado. El valor en tiempo de ejecución es el documento entero tal como lo mantiene un editor, y lo devuelve [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, el setter de `value` y `setSchemaJSON()` leen cualquiera de las dos formas, cualquier archivo que haya guardado una versión anterior y un documento `.vuerd` v2. Antes de la `4.0.0`, solo había una: `value` devolvía el documento entero tal como lo mantenía el editor, como hace ahora `runtimeValue`.

## Forma de almacenamiento y valor en tiempo de ejecución {#storage-form-and-runtime-value}

La forma de almacenamiento contiene solo las entidades activas: cada tabla listada en `doc.tableIds`, las columnas que listan esas tablas, las relaciones entre dos tablas conservadas, los índices de las tablas conservadas, con las columnas de índice cuya columna aún lista la tabla, las notas y los grupos de tablas listados y, desde la `4.2.0`, las palabras, los términos y los dominios listados que contienen algún valor además de su id. Deja fuera lo que un editor deriva al cargar o mantiene mientras está abierto: las entidades eliminadas, `seqColumnIds` y `seqIndexColumnIds`, cada `zIndex`, los anchos medidos, el `ui` de las columnas, el `identification`, el `startRelationshipType` y los anclajes de una relación y, desde la `4.2.0`, el `order` de cada fila de los diccionarios y las listas `doc.wordIds`, `doc.termIds` y `doc.domainIds`. Los tipos de abajo marcan cada uno de estos campos con `// runtime only`.  
Todas las colecciones salvo los diccionarios tienen como claves los ids, en orden de unidades de código, con las columnas agrupadas primero por `tableId` y las columnas de índice por `indexId`. Desde la `4.2.0`, `wordEntities`, `termEntities` y `domainEntities` van después de todas las demás colecciones, en ese orden, y cada una se escribe como un encabezado y filas, una fila por línea (consulta [Filas de los diccionarios](#dictionary-rows)). Cada entidad escribe sus campos en un orden fijo, y el texto se sangra con dos espacios y termina con un salto de línea. Así, el mismo documento escribe siempre los mismos bytes, una edición cambia solo lo que toca y un archivo guardado en un ordenador con otras fuentes se vuelve a abrir con el mismo `value`.  
VS Code, Obsidian y el plugin de JetBrains escriben un archivo solo cuando una edición cambia `value`, así que un archivo que guardó una versión anterior conserva su forma antigua hasta su primera edición.

Desde la `4.2.0`, la forma de almacenamiento también deja fuera lo que no contiene nada: cada campo de texto que una entidad o su `ui` contiene como `''` (el `name`, el `comment` y el `ui.color` de una tabla; el `name`, el `comment`, el `dataType` y el `default` de una columna; el `name` de un índice; el `value` y el `ui.color` de una nota; el `name` y el `color` de un grupo de tablas), cada lista de `doc` y cada colección que no contiene ninguna entrada, y el propio objeto `collections` en cuanto todas las colecciones están vacías. El texto formado solo por espacios en blanco se escribe tal como está, salvo un nombre lógico, que entonces se deja fuera, y una palabra, un término o un dominio cuyos valores además de su id están todos vacíos o son solo espacios en blanco, que se deja fuera entero. Se siguen escribiendo todos los ids, todas las listas dentro de una entidad y todos los números, `0` incluido. `doc` se escribe siempre, así que el archivo de un documento nuevo contiene `$schema`, `version`, sus ajustes y `"doc": {}`.  
El análisis lee un campo de texto que falta como `''` y una colección que falta como vacía, como hacen todas las versiones v3, y la forma de almacenamiento solo deja fuera una lista de `doc` mientras su colección no contiene nada (consulta [Doc](#doc)). Así, un editor anterior a la `4.2.0` también abre estos archivos, y un programa que lea un archivo por su cuenta debe leer del mismo modo lo que falta. Un archivo que guardó una versión anterior queda, tras su siguiente guardado, sin su texto, sus listas y sus colecciones vacíos, un cambio que se hace una sola vez, y a partir de entonces se guarda byte a byte igual.

El valor en tiempo de ejecución conserva lo que la forma de almacenamiento deja fuera: entidades eliminadas, secuencias, z-index, anchos, marcas de clave, indicadores de relación y anclajes, los campos de texto vacíos y, incluso cuando están vacías, las cuatro listas `tableIds`, `relationshipIds`, `indexIds` y `memoIds` y las seis colecciones de `tableEntities` a `memoEntities`. Desde la `4.2.0`, también conserva las palabras, los términos y los dominios eliminados, las filas que no contienen nada, el `order` de cada fila, las tres listas de los diccionarios, un nombre lógico formado solo por espacios en blanco y un vínculo con un dominio eliminado. Se sangra con dos espacios y no termina con salto de línea. Úsalo solo para inicializar un colaborador o una segunda vista mediante `setInitialValue()`, para que, cuando otro editor envíe el deshacer de una eliminación, la entidad vuelva allí completa. No lo escribas nunca en un archivo; el JSON Schema lo rechaza. Ya no se recolectan las entidades eliminadas, así que el valor en tiempo de ejecución las conserva hasta que el documento se vuelve a abrir desde su archivo.

Ambas formas escriben cada ajuste bloqueado con su valor bloqueado (consulta [`lockSettings`](#settings)), `settings.ddlScripts` solo mientras un script contiene texto y el `groupId` de una tabla solo mientras no está vacío. Desde la `4.2.0`, ambas escriben también `settings.nameViewMode` solo mientras el valor que escriben no es `'physical'`, `settings.columnOrder` en siete entradas donde es posible (consulta [Ajustes](#settings)) y el `nameDerived` de una tabla solo mientras es `true`.  
La forma de almacenamiento escribe `doc.tableGroupIds` y `tableGroupEntities` solo mientras existe un grupo de tablas, un `logicalName` solo mientras contiene texto distinto de espacios en blanco, el `domainId` de una columna solo mientras nombra un dominio que el archivo escribe y cada diccionario solo mientras contiene una fila que el archivo escribe. El valor en tiempo de ejecución escribe los campos de los grupos de tablas mientras el documento contiene un grupo o uno eliminado, `logicalName` y `domainId` mientras no son `''`, y cada diccionario con su lista mientras cualquiera de los dos contiene una entrada, incluida una fila eliminada.

## TypeScript {#typescript}

Los tipos describen el valor en tiempo de ejecución. Un campo marcado con `// runtime only` queda fuera de la forma de almacenamiento, y un campo marcado con `?` solo se escribe mientras contiene algo. Los textos, las listas y las colecciones vacíos que la forma de almacenamiento deja fuera desde la `4.2.0` no están marcados.

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
    wordEntities?: DictionaryRows; // rows of Word
    termEntities?: DictionaryRows; // rows of Term
    domainEntities?: DictionaryRows; // rows of Domain
  };
};
```

Toda entidad tiene un `id`, una cadena opaca, que es su clave en su colección, salvo en los tres diccionarios, donde es el primer valor de una fila. Desde la `4.2.0`, cuando una entidad de las siete colecciones con claves tiene un `id` que falta, está vacío o no es una cadena, el análisis la lee con la clave bajo la que está, y descarta una entrada que no es un objeto, o una sin id cuya clave es `''`. Una fila de diccionario se descarta cuando no es un array o su `id` no es una cadena distinta de `''`. Un editor anterior a la `4.2.0` descarta una entidad cuyo `id` falta o está vacío, así que la forma de almacenamiento sigue escribiendo todos los ids.  
Desde la `4.0.0`, cada id nuevo, incluido el de una fila de diccionario, es un UUIDv7 escrito en formato Uuid25, 25 dígitos en base 36 en minúscula como `03gzrxjv20bdlcak89q25d2m7`, de modo que los ids que genera un editor se ordenan en el orden en que los creó. Un documento conserva los ids que contiene, como los ids nanoid de una versión anterior o los ids de un archivo v2, así que nada debe depender de la forma de un id.

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
  nameViewMode?: string; // Constants: NameViewMode
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
  dictionary: '@dineug/erd-editor/builtin-dictionary',
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
  columnDomain: 8192,
} as const;

const ColumnType = {
  columnName: 1,
  columnDataType: 2,
  columnNotNull: 4,
  columnUnique: 8,
  columnAutoIncrement: 16,
  columnDefault: 32,
  columnComment: 64,
  columnLogicalName: 128,
  columnDomain: 256,
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
  unlockNameViewMode: 64, // nameViewMode; set while unlocked
} as const;

const NameViewMode = {
  physical: 'physical',
  logical: 'logical',
  both: 'both',
} as const;
```

`originX` y `originY` son la vista: el punto de la pantalla en el que cae el punto `(0, 0)` de la escena.  
`zoomLevel` va de `0.1` a `1.5`. Un documento guardado con un valor superior a `1` se abre con `1` en un editor anterior a la `3.5.0`.  
Desde la `4.0.0`, los ajustes no llevan `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ni `ignoreSaveSettings`. Nada los escribe, el analizador no conserva ninguno y el JSON Schema rechaza un archivo que todavía los tenga.

`canvasType` es la pestaña en la que se abre un documento. Un documento guardado en la pestaña Visualización contiene `'@dineug/erd-editor/builtin-visualization'`, pero no si se mostraba el modo `Graph` o `Flow`, y un editor recién creado muestra esa pestaña en modo `Graph`.  
Desde la `4.0.0`, mientras el bloqueo `Canvas Type` está activado, como lo está en un documento nuevo, el documento conserva la pestaña que se mostraba al bloquearlo, y cambiar de pestaña deja `value` como estaba. Un bloqueo activado en la pestaña Configuración guarda la pestaña de la que venía el lector, y un `'settings'` bloqueado, que solo puede escribir una edición manual, se abre en `'ERD'`.  
Desde la `4.2.0`, `canvasType` también puede ser `'@dineug/erd-editor/builtin-dictionary'`, la pestaña [Diccionario](../../guide/guides/dictionary.md), que el bloqueo `Canvas Type` guarda igual que las demás. Un editor anterior a la `4.2.0` conserva ese valor, pero no muestra ninguna pestaña bajo su barra de herramientas hasta que el lector elige una.  
No se serializa nada del estado propio del modo `Flow`: su colocación, zoom, desplazamiento de la vista, vista de filas y tablas en las que se centra se quedan en el editor y, desde la `4.2.0`, también las vistas por las que retroceden y avanzan [`Previous table` y `Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). Así, `originX`, `originY` y `zoomLevel` describen siempre el lienzo ERD.

`show` y `lockSettings` son máscaras de bits: combina los indicadores con OR.  
`columnOrder` es un array que contiene cada valor de `ColumnType` una sola vez, en el orden de visualización; desde la `4.2.0`, un documento puede escribirlo con siete de los nueve, como describe más abajo el párrafo sobre el orden de columnas.  
`database`, `language`, `tableNameCase`, `columnNameCase` y `bracketType` contienen cada uno exactamente un valor, y el JSON Schema rechaza un valor combinado.

El `show` de un documento nuevo es `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` y `relationship`.  
Desde la `3.10.0`, hay dos indicadores de `show` más, ambos desactivados en un documento nuevo y en todo documento guardado antes de la `3.10.0`.  
`columnAlternateKey` (`512`) es la opción de vista [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Con el indicador activado, marca las columnas de cada índice único de dos o más columnas como `AK1.1`, `AK1.2`, etc. Empieza desactivado, así que ningún diagrama existente cambia de ancho.  
`hideReferentialAction` (`1024`) funciona al revés: cuando está activado, oculta las [etiquetas ON DELETE y ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) de los conectores, así que se muestran de forma predeterminada. La opción de vista `Referential Actions` está marcada mientras el indicador está desactivado. No cambia el tamaño de ninguna tabla.  
Un editor anterior a la `3.10.0` conserva `show` como un número entero, así que ambos indicadores sobreviven a un guardado allí.

Desde la `4.0.0`, hay dos indicadores de `show` más, ambos desactivados en un documento nuevo y en todo documento guardado antes de la `4.0.0`. Como `hideReferentialAction`, cada uno oculta lo que nombra, así que los grupos de tablas y las notas se muestran de forma predeterminada.  
`hideTableGroup` (`2048`) oculta los [grupos de tablas](../../guide/guides/table-groups.md), y `hideMemo` (`4096`) oculta todas las notas. Son las [opciones de vista](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` y `Memos`, cada una marcada mientras su indicador está desactivado. Ninguno de los dos cambia el tamaño de ninguna tabla.  
Un editor anterior a la `4.0.0` conserva `show` como un número entero, así que ambos indicadores sobreviven a un guardado allí.

Desde la `4.2.0`, hay un indicador de `show` más, `columnDomain` (`8192`), desactivado en un documento nuevo y en todo documento guardado antes de la `4.2.0`, así que el `show` de un documento nuevo sigue siendo `431`. Es la [opción de vista](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: con el indicador activado, cada fila de columna muestra una [celda Dominio](../../guide/guides/logical-names.md#the-domain-cell), que ensancha las tablas. Empieza desactivado, así que ningún diagrama existente cambia de ancho.  
Un editor anterior a la `4.2.0` conserva `show` como un número entero, así que el indicador sobrevive a un guardado allí.

Desde la `4.2.0`, `ColumnType` tiene nueve valores. `columnLogicalName` (`128`) coloca la celda del nombre lógico, que una fila de columna solo dibuja en la vista `Both Names`, y `columnDomain` (`256`), la celda Dominio. Son las filas `Logical Name` y `Domain` del [orden de columnas](../../guide/guides/settings.md#adjusting-column-order) de la pestaña Configuración. Un editor mantiene un orden de los nueve, y el de un documento nuevo es `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
Ambas formas escriben el orden en siete entradas, dejando fuera `128` y `256`, mientras `128` está justo antes de `columnName` y `256` justo después de `columnDataType`. Así, un documento nuevo sigue escribiendo `1, 2, 4, 8, 16, 32, 64`, y un archivo cuyo orden nunca los movió conserva sus bytes. En caso contrario, escriben los nueve.  
El análisis coloca los dos en esos lugares de un orden de siete entradas, sea cual sea el orden de las siete, toma tal cual nueve entradas que contengan todos los tipos y lee cualquier otra cosa como el orden predeterminado. El JSON Schema admite siete o nueve enteros.

Desde la `4.0.0`, `Language` tiene ocho destinos más del [Generador de código](../../guide/guides/code-generator.md), de `Mermaid` a `JSONSchema`. Un `language` que el analizador no conoce se lee como `GraphQL`, así que un editor anterior a la `4.0.0` abre en GraphQL un documento guardado con uno de ellos, y al guardar allí se escribe GraphQL.

Desde la `4.0.0`, `lockSettings` ocupa el lugar de `ignoreSaveSettings`, y `LockSettingType` el de `SaveSettingType`, que se eliminó. `lockSettings` nombra los ajustes que un documento guarda tal como estaban cuando se bloquearon. `viewport` abarca `originX`, `originY` y `zoomLevel` juntos, ya que un origen guardado sin su zoom se abre en otro sitio, y cada uno de los demás bits abarca el campo del que toma su nombre. Son las filas de [`Lock`](../../guide/guides/settings.md#lock) de la pestaña Configuración.  
Tanto `value` como `runtimeValue` escriben un ajuste bloqueado con su valor bloqueado, muestre lo que muestre el editor, y cada uno de los demás ajustes tal como está. Así, mientras el bloqueo correspondiente está activado, desplazarse y hacer zoom, cambiar de pestaña, cambiar el lenguaje del Generador de código, un estilo de nombres o el tipo de delimitador, o cambiar la vista de nombres deja el archivo como estaba. Al bloquear se toma el valor que el ajuste tiene en ese momento, y el análisis toma el valor bloqueado del campo guardado.  
Un documento que parte de cero —un editor o un almacén de replicación nuevos, o un valor vacío pasado a `value` o a `setInitialValue()`— tiene `lockSettings` en `63`, con todos los bloqueos activados. Un documento cuyos `settings` no llevan `lockSettings` —todo archivo guardado antes de la `4.0.0`, sea cual sea su `ignoreSaveSettings`, y todo documento v2— también se abre con todos los bloqueos activados: su vista y su pestaña donde están las de un documento nuevo (`originX` y `originY` a `0`, `zoomLevel` a `1`, la pestaña ERD), y su lenguaje, sus estilos de nombres y su tipo de delimitador bloqueados en los valores que guardó. Un documento que nombra sus bloqueos los conserva, `0` incluido, junto con todos los valores que guardó.  
El análisis conserva todos los bits de `lockSettings`, también los desconocidos, así que un bloqueo que añada una versión posterior sobrevive a un guardado aquí; el JSON Schema solo comprueba que sea un entero. Un editor anterior a la `4.0.0` descarta `lockSettings` al guardar y escribe la vista y la pestaña tal como están, así que el archivo vuelve a abrirse aquí como uno guardado antes de la `4.0.0`.

Desde la `4.2.0`, hay un séptimo bloqueo, `unlockNameViewMode` (`64`), la fila `Name View`, que abarca `nameViewMode`. Su bit se lee al revés que los demás bits de bloqueo, como los bits de ocultación de `Show`: activado, la vista de nombres está desbloqueada, y desactivado, bloqueada. Así, `63` sigue significando todos los bloqueos activados, y un documento nuevo lo contiene con la vista de nombres bloqueada en `'physical'`. Un archivo guardado antes de la `4.2.0` tiene el bit desactivado, sean cuales sean sus demás bloqueos, `0` incluido, así que se abre con la vista de nombres bloqueada en `'physical'`. Un documento con todos los bloqueos desactivados contiene `64`, y uno con todos los demás bloqueos activados y la vista de nombres desbloqueada contiene `127`. Comprueba este bloqueo a la inversa: está activado mientras `(lockSettings & 64) === 0`.  
Mientras está activado, un cambio de la vista de nombres solo cambia la pantalla del editor que lo hizo, y el documento conserva la vista bloqueada. Mientras está desactivado, un cambio en un editor que puede editar pasa al documento, y todos los colaboradores cambian de vista con él. En ambos casos, el cambio de un editor de solo lectura solo cambia su propia pantalla. Consulta [`Lock`](../../guide/guides/settings.md#lock).  
Un editor de la `4.0.0` o la `4.1.0` conserva el bit al guardar, pero descarta `nameViewMode`, así que el documento se vuelve a abrir aquí en `'physical'`, con su bloqueo como estaba.

Desde la `4.0.0`, `ddlScripts` contiene los dos scripts de la pestaña [Esquema SQL](../../guide/guides/schema-sql.md), que escribe el DDL de todas las bases de datos: `before` después de la cabecera y antes de las tablas, `after` tras el DDL generado. El DDL escribe cada uno con saltos de línea LF, sin sus líneas en blanco iniciales ni sus espacios en blanco finales y, en MSSQL, terminado en `GO`, como se describe en [Scripts previos y posteriores](../../guide/guides/schema-sql.md#before-and-after-scripts); el propio `ddlScripts` conserva cada script tal como se escribió. La clave solo se escribe mientras alguno de los scripts contiene texto, y entonces con ambos; una clave que falta, o un script que no es una cadena, se lee como `''`. Las opciones `Statements`, `Header` y `Tables` de la pestaña y, desde la `4.2.0`, su interruptor [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) no se guardan en el documento.  
Un editor anterior a la `4.0.0` descarta los scripts al cargar un documento, así que al guardar allí se pierden.

Desde la `4.2.0`, `nameViewMode` es la [vista de nombres](../../guide/guides/logical-names.md#name-view), los nombres que dibuja el diagrama: `'physical'`, el nombre de cada tabla y columna; `'logical'`, su nombre lógico en el lugar del nombre, y `'both'`, el nombre lógico y el nombre. Los menús los llaman `Physical Names`, `Logical Names` y `Both Names`. Ambas formas lo escriben al final, después de `ddlScripts`, y solo mientras el valor que escriben no es `'physical'`; mientras el bloqueo `Name View` está activado, ese es el valor bloqueado, muestre lo que muestre la pantalla. Un valor que falta, o uno que el analizador no conoce, se lee como `'physical'`, y el JSON Schema solo acepta `"logical"` y `"both"`.  
Un editor anterior a la `4.2.0` descarta `nameViewMode` al cargar un documento.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` y `ReferentialAction` solo admiten añadir valores al final. Un documento guardado almacena el número, así que un nuevo proveedor, destino de generación de código, indicador, tipo de columna, opción de columna, bloqueo o acción toma el siguiente bit en lugar de un hueco intermedio.

### Doc {#doc}

```ts
type Doc = {
  tableIds: string[];
  relationshipIds: string[];
  indexIds: string[];
  memoIds: string[];
  tableGroupIds?: string[];
  wordIds?: string[]; // runtime only
  termIds?: string[]; // runtime only
  domainIds?: string[]; // runtime only
};
```

Cada una de las cinco primeras listas es el orden de un tipo de entidad, que leen el DDL, la ordenación de tablas y el orden de dibujo. En la forma de almacenamiento, cada lista contiene solo los ids de las entidades conservadas, cada uno una sola vez, en el orden listado y, desde la `4.2.0`, una lista que no contiene ninguno se deja fuera. Desde la `4.0.0`, `tableGroupIds` es el orden de los grupos de tablas.

Desde la `4.2.0`, `wordIds`, `termIds` y `domainIds` listan las filas activas de cada diccionario: una fila que está en su colección pero no en su lista está eliminada. No son el orden de una hoja, que da el `order` de cada fila. Solo las escribe el valor en tiempo de ejecución, cada una mientras ella o su colección contiene una entrada. Las filas de un archivo son en sí mismas la pertenencia y el orden, y el JSON Schema rechaza las listas.  
Desde la `4.2.0`, el análisis lee una lista que el documento deja fuera, o que contiene como algo que no es un array, como todas las entradas que contiene su colección, cada id una sola vez, en el orden en que están; un array vacío sigue vacío, y entonces todas las entradas de su colección se leen como eliminadas. Un editor anterior a la `4.2.0` lee una lista que falta como vacía, así que la forma de almacenamiento sigue escribiendo cada lista siempre que su colección contiene una entidad.

Desde la `4.0.0`, el orden de apilamiento no se guarda. El análisis apila cada tabla, nota y grupo de tablas listado que no lleve `zIndex` según su posición en su lista, con los posteriores delante: los grupos de tablas desde `1`, las tablas desde `2` y las notas por encima de todas las tablas. Una entidad que lleva un `zIndex`, como en un valor en tiempo de ejecución o en un archivo guardado antes de la `4.0.0`, lo conserva. Por eso, traer una tabla o una nota al frente se pierde al volver a abrir el archivo.

### Colección: tableEntities {#collection-tableentities}

```ts
type Table = {
  id: string;
  name: string;
  logicalName?: string;
  comment: string;
  columnIds: string[];
  seqColumnIds: string[]; // runtime only
  groupId?: string;
  nameDerived?: boolean;
  ui: TableUI;
};

type TableUI = {
  x: number;
  y: number;
  zIndex: number; // runtime only
  widthName: number; // runtime only
  widthLogicalName: number; // runtime only
  widthComment: number; // runtime only
  color: string;
};
```

Desde la `4.0.0`, una tabla lleva `groupId`, el id del [grupo de tablas](../../guide/guides/table-groups.md) al que pertenece. Un `groupId` que falta o está vacío, o que no nombra ningún grupo de `doc.tableGroupIds`, significa que no pertenece a ninguno, y la forma de almacenamiento solo lo escribe mientras nombra un grupo conservado.  
El análisis inicializa `seqColumnIds` con `columnIds` cuando falta o le falta un id listado, y un editor vuelve a medir `widthName`, `widthLogicalName` y `widthComment` con sus propias fuentes en cada carga.

Desde la `4.2.0`, una tabla lleva `logicalName`, el nombre que dibujan las [vistas](../../guide/guides/logical-names.md#name-view) `Logical Names` y `Both Names`, `''` si no tiene ninguno, y `nameDerived`, `true` mientras `name` sea el que los diccionarios [derivaron](../../guide/guides/dictionary.md#deriving-physical-names) del nombre lógico. Mientras está activado, un nuevo nombre lógico vuelve a derivar el nombre; mientras no lo está, el nombre lo escribió alguien, y un nuevo nombre lógico no lo toca salvo que esté vacío o sea solo espacios en blanco. Cambiar el nombre a mano lo desactiva, y [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) reescribe incluso un nombre que alguien escribió y lo activa allí donde haya un nombre lógico.  
La forma de almacenamiento escribe `logicalName` después de `name`, tal como se escribió, solo mientras contiene texto distinto de espacios en blanco, y `nameDerived` después de `groupId` solo mientras es `true`, el único valor que acepta el JSON Schema. Un `logicalName` que falta se lee como `''` y un `nameDerived` que falta, como `false`, así que todo nombre de un archivo guardado antes de la `4.2.0` cuenta como escrito por alguien.  
Un editor anterior a la `4.2.0` descarta ambos al cargar un documento, así que al guardar allí se pierde el nombre lógico de todas las tablas.

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
  logicalName?: string;
  domainId?: string;
  ui: ColumnUI; // runtime only
};

type ColumnUI = {
  keys: number; // Constants: ColumnUIKey
  widthName: number;
  widthLogicalName: number;
  widthComment: number;
  widthDataType: number;
  widthDomain: number;
  widthDefault: number;
};

// Constants
const ColumnOption = {
  autoIncrement: 1,
  primaryKey: 2,
  unique: 4,
  notNull: 8,
  nameDerived: 16,
} as const;

const ColumnUIKey = {
  primaryKey: 1,
  foreignKey: 2,
} as const;
```

Desde la `4.0.0`, la forma de almacenamiento no escribe el `ui` de las columnas. Cada carga deriva `keys` —la marca de clave principal a partir del bit `primaryKey` de `options` y la marca de clave externa a partir de las relaciones que terminan en la columna— y mide los seis anchos.  
Un editor anterior a la `4.0.0` muestra las columnas de un archivo guardado aquí sin sus iconos de clave principal.

Desde la `4.2.0`, una columna lleva `logicalName`, como una tabla, y `domainId`, el id del dominio que vincula, `''` si no vincula ninguno. Las ediciones en un editor mantienen una columna vinculada en el tipo de datos de su dominio, como se describe en [Dominios y tipos de datos](../../guide/guides/dictionary.md#domains-and-data-types). Sin embargo, el análisis no cambia el tipo de ninguna columna, así que un archivo escrito en otro sitio puede dejar una columna vinculada con otro tipo, y lo mismo pueden hacer las ediciones cruzadas de dos colaboradores; la hoja Comprobaciones lista cada caso como [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). El análisis vacía un `domainId` que no nombra ningún dominio que contenga el documento. Un dominio eliminado sigue contando, así que el editor conserva un vínculo con él mientras un deshacer pueda recuperar el dominio. Después de `options`, la forma de almacenamiento escribe `logicalName` según la regla de las tablas, y `domainId` solo mientras nombra un dominio que el archivo escribe, así que nunca un vínculo con un dominio eliminado.  
`ColumnOption.nameDerived` (`16`) es el indicador de nombre derivado de la columna, que se guarda en `options` con los demás bits y significa lo mismo que el `nameDerived` de una tabla. Por ejemplo, una clave principal no nula cuyo nombre derivaron los diccionarios contiene `options` `26`.  
Un editor anterior a la `4.2.0` descarta `logicalName` y `domainId` al cargar un documento, así que al guardar allí se pierden. Conserva `options` como un número entero, así que el bit `nameDerived` sobrevive a un guardado allí.

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

### Filas de los diccionarios {#dictionary-rows}

Desde la `4.2.0`, un documento contiene tres diccionarios, las hojas `Words`, `Terms` y `Domains` de la pestaña [Diccionario](../../guide/guides/dictionary.md), en `wordEntities`, `termEntities` y `domainEntities`. Todos los campos de una palabra, un término o un dominio son cadenas, y ninguno tiene `ui`. La hoja `Checks` se calcula a partir de los diccionarios y el diagrama, y no se guarda.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

Ninguno de los tres tiene los ids como claves. Cada uno se escribe como un encabezado y filas: `fields` nombra una vez los campos de la entidad, el id primero, y cada fila contiene los valores de una entidad en ese orden. Los tipos de abajo listan los campos de cada entidad en el orden del encabezado del valor en tiempo de ejecución. Una fila siempre conserva su id y su nombre, pero los valores vacíos finales posteriores al nombre se dejan fuera, así que un valor vacío anterior a uno que se conserva sigue siendo `''`, y el análisis lee como `''` un valor que le falta a una fila. Ambas formas escriben cada fila en una línea propia como JSON compacto, como en estas dos palabras de un archivo:

```json
"wordEntities": {
  "fields": [
    "id",
    "name",
    "abbreviation",
    "englishName",
    "description",
    "synonyms",
    "forbiddenWords"
  ],
  "rows": [
    ["w1","Customer","CUST","customer"],
    ["w2","Number","NO","number","","No, Num","Nbr"]
  ]
}
```

La forma de almacenamiento escribe las filas listadas en el orden de la hoja y deja fuera `order`, así que sus encabezados no lo nombran. Deja fuera una fila cuyos valores además de su id están todos vacíos o son solo espacios en blanco, como una que se añadió y nunca se rellenó, o que se vació, y todo vínculo con un dominio así o con uno eliminado: el `domainId` de una columna se deja fuera, y el de un término se escribe como `''`; el propio término se deja fuera si no contiene nada más.  
Los encabezados del valor en tiempo de ejecución nombran `"order"` justo después de `"name"`. Escribe todas las filas que contiene su colección, incluidas las eliminadas, en el orden en que las contiene la colección, así que, para obtener el orden de una hoja, ordena por `order`, comparado en orden de unidades de código. El análisis da a las filas de un archivo claves `order` en el orden en que están las filas, así que se vuelven a leer en el orden en que las escribió el archivo.  
Un documento sin los diccionarios, como uno guardado antes de la `4.2.0`, no tiene ninguno. Un editor anterior a la `4.2.0` descarta los tres al cargar un documento, así que al guardar allí se pierden todas las palabras, los términos y los dominios.

### Colección: wordEntities {#collection-wordentities}

```ts
type Word = {
  id: string;
  name: string;
  order: string; // runtime only
  abbreviation: string;
  englishName: string;
  description: string;
  synonyms: string;
  forbiddenWords: string;
};
```

Una palabra es una de las palabras de las que se compone un nombre lógico, y `abbreviation` es lo que la representa en un nombre físico. `synonyms` lista otras grafías de la palabra, y `forbiddenWords`, palabras que no deben usarse en su lugar, en ambos casos separadas por comas.

### Colección: termEntities {#collection-termentities}

```ts
type Term = {
  id: string;
  name: string;
  order: string; // runtime only
  physicalName: string;
  domainId: string;
  description: string;
  synonyms: string;
};
```

Un término es un nombre lógico completo. Una tabla o columna cuyo `logicalName` coincide con `name` deriva `physicalName` o, mientras este está vacío, un nombre compuesto a partir de las abreviaturas de las palabras, y una columna también toma el dominio que nombra `domainId`, `''` si no hay ninguno (consulta [Derivar nombres físicos](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` va separado por comas. El análisis vacía un `domainId` que no nombra ningún dominio, como en una columna.

### Colección: domainEntities {#collection-domainentities}

```ts
type Domain = {
  id: string;
  name: string;
  order: string; // runtime only
  category: string;
  dataType: string;
  description: string;
};
```

Un dominio es un tipo de datos con nombre; `dataType` lo contiene como lo hace una columna, longitud incluida, por ejemplo `NUMERIC(10)`. Una columna o un término vincula un dominio por su id, y el editor da a cada columna vinculada el tipo de datos del dominio (consulta [Dominios y tipos de datos](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

El archivo de esquema canónico se publica en [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) y se puede referenciar directamente con `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Pon `$schema` al principio de un archivo `.erd.json` y los editores que entienden JSON Schema, como VS Code, validan el documento y autocompletan sus campos mientras editas.

Desde la `4.0.0`, el esquema describe solo la forma de almacenamiento. Todo objeto con campos con nombre está cerrado (`additionalProperties: false`), todo campo que la forma de almacenamiento escribe siempre es obligatorio, un campo que deja fuera mientras no contiene nada se nombra pero no es obligatorio, y no se nombra ningún campo que deje fuera siempre. Por eso rechaza el valor en tiempo de ejecución. También rechaza un archivo guardado antes de la `4.0.0`, con su `meta`, sus anchos, su `zIndex`, su `ignoreSaveSettings` y lo demás, hasta que un editor de la `4.0.0` o posterior vuelva a guardar ese archivo. Un archivo guardado por la `3.2.0` o posterior ya nombra la URL de este esquema, que apunta a la rama `main`, así que un editor que valida con él señala ahora el archivo. Un archivo guardado por la `3.0.0` o la `3.1.0`, o un documento v2, no nombra ningún `$schema`.

Desde la `4.2.0`, el esquema ya no exige los campos de texto de una entidad, ni ninguna lista de `doc`, ni ninguna colección, ni el propio objeto `collections`, que la forma de almacenamiento deja fuera mientras no contienen nada. Sigue aceptando un archivo guardado por la `4.0.0` o la `4.1.0`. Nombra los campos nuevos: `nameViewMode`, que solo admite `"logical"` y `"both"`; el `logicalName` de una tabla y su `nameDerived`, que solo admite `true`; el `logicalName` y el `domainId` de una columna, y los tres diccionarios, cada uno con su encabezado y sus filas de cadenas. `canvasType` lista la pestaña Diccionario, `columnOrder` admite siete o nueve enteros, y las descripciones de `show`, `columnOrder`, `lockSettings` y `options` nombran los bits nuevos.

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "title": "ERD Editor document",
  "description": "The storage form an ERD Editor file holds (.erd, .erd.json, .vuerd, .vuerd.json): the live entities alone, each collection keyed in id order but the dictionaries, a header and one row per entry in document order, without what an editor derives on load or keeps while it is open, without an entity's text field while it is empty, which reads as the empty string, and without an empty list or collection, which reads as none",
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
      "description": "The entities of each kind, a kind with none left out",
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
        },
        "wordEntities": {
          "$ref": "#/$defs/wordEntities"
        },
        "termEntities": {
          "$ref": "#/$defs/termEntities"
        },
        "domainEntities": {
          "$ref": "#/$defs/domainEntities"
        }
      },
      "additionalProperties": false
    }
  },
  "required": ["$schema", "version", "settings", "doc"],
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
          "description": "bit value (tableComment: 1) | (columnComment: 2) | (columnDataType: 4) | (columnDefault: 8) | (columnAutoIncrement: 16) | (columnPrimaryKey: 32) | (columnUnique: 64) | (columnNotNull: 128) | (relationship: 256) | (columnAlternateKey: 512) | (hideReferentialAction: 1024) | (hideTableGroup: 2048) | (hideMemo: 4096) | (columnDomain: 8192); the three hide bits hide what they name while set",
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
            "settings",
            "@dineug/erd-editor/builtin-dictionary"
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
          "description": "bit value (columnName: 1) | (columnDataType: 2) | (columnNotNull: 4) | (columnUnique: 8) | (columnAutoIncrement: 16) | (columnDefault: 32) | (columnComment: 64) | (columnLogicalName: 128) | (columnDomain: 256); seven entries without the last two while the logical name stands just before the name and the domain just after the data type, all nine otherwise",
          "type": "array",
          "prefixItems": [
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" },
            { "type": "integer" }
          ],
          "anyOf": [
            { "minItems": 7, "maxItems": 7 },
            { "minItems": 9, "maxItems": 9 }
          ]
        },
        "maxWidthComment": {
          "type": "integer"
        },
        "lockSettings": {
          "description": "bit value (viewport: 1) | (canvasType: 2) | (language: 4) | (tableNameCase: 8) | (columnNameCase: 16) | (bracketType: 32) | (unlockNameViewMode: 64); a locked setting is saved as it stood when locked, the viewport being originX, originY and zoomLevel. The last bit reads the other way round: set, the name view mode is unlocked, and clear, as in a file saved before it, locked",
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
        },
        "nameViewMode": {
          "description": "The names the diagram shows: the logical ones, or both the physical and the logical. Absent while it shows the physical names, the default",
          "enum": ["logical", "both"]
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
      "description": "The order of each kind of entity, which the DDL, the sort and the draw order read, a kind with none left out. A list goes out whenever its collection holds an entity, since a reader that finds none lists none",
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
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
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
          "nameDerived": {
            "description": "The dictionaries filled the name, so a new logical name derives it again; absent means a name someone wrote",
            "type": "boolean",
            "const": true
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
            "required": ["x", "y"],
            "additionalProperties": false
          }
        },
        "required": ["id", "columnIds", "ui"],
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
            "description": "bit value (autoIncrement: 1) | (primaryKey: 2) | (unique: 4) | (notNull: 8) | (nameDerived: 16); nameDerived is set while the dictionaries filled the name",
            "type": "integer"
          },
          "logicalName": {
            "description": "The name the logical view shows; absent means none",
            "type": "string"
          },
          "domainId": {
            "description": "Id of the domain in domainEntities that governs the data type; absent means none",
            "type": "string"
          }
        },
        "required": ["id", "tableId", "options"],
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
        "required": ["id", "tableId", "indexColumnIds", "unique"],
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
            "required": ["x", "y", "width", "height"],
            "additionalProperties": false
          }
        },
        "required": ["id", "ui"],
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
        "required": ["id", "ui"],
        "additionalProperties": false
      }
    },
    "wordEntities": {
      "description": "The words of the dictionary, the parts a logical name is composed of, each with its abbreviation in a physical name. Written while a word exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "abbreviation", "englishName", "description", "synonyms", "forbiddenWords"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "termEntities": {
      "description": "The terms of the dictionary, logical names a column matches by its text, each with its physical name and domain id. Written while a term exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "physicalName", "domainId", "description", "synonyms"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
    },
    "domainEntities": {
      "description": "The domains of the dictionary, named data types a column or a term links to by id. Written while a domain exists; absent means none",
      "type": "object",
      "properties": {
        "fields": {
          "const": ["id", "name", "category", "dataType", "description"]
        },
        "rows": {
          "description": "One row per entry in document order, its values in the order fields names them; values past the name are left out from the last empty one back",
          "type": "array",
          "items": {
            "type": "array",
            "prefixItems": [
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" },
              { "type": "string" }
            ],
            "items": false,
            "minItems": 2
          }
        }
      },
      "required": ["fields", "rows"],
      "additionalProperties": false
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
