---
sidebar_position: 3
description: Формат документа .erd.json — форма хранения, которую содержит файл, и значение времени выполнения, которое хранит редактор, типы TypeScript, константы каждого числового поля и опубликованная JSON Schema.
---

# Схема

`.erd.json` — это формат документа редактора. Прочитайте эту страницу, если нужно генерировать или проверять документ либо выполнять его миграцию вне редактора.

Начиная с версии `4.0.0` у документа два варианта сериализации, оба со значением `version`, равным `'3.0.0'`. Форма хранения — это то, что содержит файл: ее возвращает [`editor.value`](../erd-editor-element.md#value), ее записывает экспорт в JSON, и это единственная форма, которую принимает опубликованная [JSON Schema](#json-schema). Значение времени выполнения — это весь документ в том виде, в каком его хранит редактор; его возвращает [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). Метод `setInitialValue()`, сеттер `value` и метод `setSchemaJSON()` читают любую из форм, любой файл, сохраненный более ранней версией, и документ `.vuerd` формата v2. До версии `4.0.0` форма была только одна: свойство `value` возвращало весь документ в том виде, в каком его хранил редактор, как сейчас это делает свойство `runtimeValue`.

## Форма хранения и значение времени выполнения {#storage-form-and-runtime-value}

Форма хранения содержит только действующие сущности: каждую таблицу из списка `doc.tableIds`, столбцы из списков этих таблиц, связи между двумя сохраняемыми таблицами, индексы сохраняемых таблиц со столбцами индекса, ссылающимися на столбцы, которые все еще есть в списке таблицы, а также заметки и группы таблиц из списков. В нее не входит то, что редактор вычисляет при загрузке или хранит, пока документ открыт: удаленные сущности, `seqColumnIds` и `seqIndexColumnIds`, все поля `zIndex`, измеренные значения ширины, поле `ui` столбца, а также поля `identification` и `startRelationshipType` связи и ее точки привязки. В типах ниже каждое из этих полей помечено комментарием `// runtime only`.  
Ключами каждой коллекции служат идентификаторы, упорядоченные по кодовым единицам, причем столбцы сначала группируются по `tableId`, а столбцы индекса — по `indexId`. Каждая сущность записывает свои поля в фиксированном порядке, а текст имеет отступ в два пробела и заканчивается переводом строки. Поэтому один и тот же документ всегда дает одни и те же байты, правка меняет только то, чего касается, а файл, сохраненный на компьютере с другими шрифтами, снова открывается с тем же значением `value`.  
VS Code, Obsidian и плагин для JetBrains записывают файл, только когда правка меняет значение `value`, поэтому файл, сохраненный более ранней версией, остается в прежней форме до первой правки.

Значение времени выполнения сохраняет то, что не входит в форму хранения: удаленные сущности, последовательности, z-индексы, значения ширины, метки ключей, флаги связей и точки привязки. Оно имеет отступ в два пробела и не заканчивается переводом строки. Используйте его только для инициализации соавтора или второго представления через `setInitialValue()`, чтобы отмена удаления, которую присылает другой редактор, возвращала там сущность целиком. Никогда не записывайте его в файл: JSON Schema его отклоняет. Сборка мусора для удаленных сущностей больше не выполняется, поэтому значение времени выполнения хранит их до следующего открытия документа из файла.

Обе формы записывают каждую заблокированную настройку с ее заблокированным значением (см. [`lockSettings`](#settings)), `settings.ddlScripts` — только пока в скрипте есть текст, а `groupId` таблицы — только пока это поле не пустое. Форма хранения записывает `doc.tableGroupIds` и `tableGroupEntities` только при наличии группы таблиц; значение времени выполнения записывает их, пока в документе есть группа или удаленная группа.

## TypeScript {#typescript}

Типы описывают значение времени выполнения. Поле с пометкой `// runtime only` не входит в форму хранения, а поле с пометкой `?` записывается, только пока в нем что-то есть.

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

Ключ каждой сущности — ее `id`, непрозрачная строка; при разборе сущность без `id` или с пустым `id` отбрасывается. Начиная с версии `4.0.0` каждый новый идентификатор — это UUIDv7, записанный в форме Uuid25: 25 цифр по основанию 36 в нижнем регистре, например `03gzrxjv20bdlcak89q25d2m7`, поэтому идентификаторы, созданные одним редактором, сортируются в порядке их создания. Документ сохраняет имеющиеся в нем идентификаторы, например идентификаторы nanoid более ранней версии или идентификаторы файла v2, поэтому не следует полагаться на формат идентификатора.

Начиная с версии `4.0.0` ни одна сущность не содержит объекта `meta` (`createAt`, `updateAt`), а типы `EntityMeta` и `EntityType` удалены. Его ничто не записывает, при разборе объект `meta` из более старого файла отбрасывается, а JSON Schema его отклоняет. Он служил лишь для определения времени сборки мусора удаленных сущностей, которой тоже больше нет.

### Settings {#settings}

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

`originX` и `originY` задают вид: это точка экрана, в которую попадает точка сцены `(0, 0)`.  
`zoomLevel` принимает значения от `0.1` до `1.5`. Документ, сохраненный с масштабом больше `1`, в редакторе до версии `3.5.0` открывается с масштабом `1`.  
Начиная с версии `4.0.0` в настройках нет полей `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` и `ignoreSaveSettings`. Их ничто не записывает, парсер не сохраняет ни одно из них, а JSON Schema отклоняет файл, в котором они еще есть.

`canvasType` — это вкладка, на которой открывается документ. Документ, сохраненный на вкладке «Визуализация», содержит `'@dineug/erd-editor/builtin-visualization'`, но не сведения о том, какой режим был показан — `Graph` или `Flow`, а только что созданный редактор показывает эту вкладку в режиме `Graph`.  
Начиная с версии `4.0.0`, пока блокировка `Canvas Type` включена, как в новом документе, документ сохраняет вкладку, которая была открыта в момент блокировки, а переключение вкладок не меняет `value`. Блокировка, установленная на вкладке «Настройки», сохраняет вкладку, с которой вы перешли, а заблокированное значение `'settings'`, которое можно записать только ручной правкой, открывается как `'ERD'`.  
Собственное состояние режима `Flow` не сериализуется — его размещение, масштаб, перемещение, отображение строк и таблицы в фокусе остаются в редакторе, — поэтому `originX`, `originY` и `zoomLevel` всегда описывают холст ERD.

`show` и `lockSettings` являются битовыми масками — объединяйте флаги операцией OR.  
`columnOrder` — это массив, содержащий все семь значений `ColumnType` в порядке отображения.  
Каждое из полей `database`, `language`, `tableNameCase`, `columnNameCase` и `bracketType` содержит ровно одно значение, и JSON Schema отклоняет комбинированное значение.

В новом документе поле `show` равно `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` и `relationship`.  
Начиная с версии `3.10.0` у поля `show` есть еще два флага; оба выключены в новом документе и в каждом документе, сохраненном до версии `3.10.0`.  
`columnAlternateKey` (`512`) — это параметр вида [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Когда флаг установлен, столбцы каждого уникального индекса по двум и более столбцам помечаются как `AK1.1`, `AK1.2` и т. д. Изначально он выключен, поэтому ни одна существующая диаграмма не меняет ширину.  
`hideReferentialAction` (`1024`) работает наоборот: когда флаг установлен, он скрывает [метки ON DELETE и ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) на линиях связи, поэтому по умолчанию они отображаются. Флажок параметра вида `Referential Actions` установлен, пока флаг выключен. Флаг не меняет размер ни одной таблицы.  
Редактор до версии `3.10.0` хранит `show` как целое число, поэтому при сохранении в нем оба флага не теряются.

Начиная с версии `4.0.0` у поля `show` есть еще два флага; оба выключены в новом документе и в каждом документе, сохраненном до версии `4.0.0`. Как и флаг `hideReferentialAction`, каждый из них скрывает то, что указано в его имени, поэтому группы таблиц и заметки по умолчанию отображаются.  
`hideTableGroup` (`2048`) скрывает [группы таблиц](../../guide/guides/table-groups.md), а `hideMemo` (`4096`) скрывает все заметки. Это [параметры вида](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` и `Memos`, флажок каждого из которых установлен, пока его флаг выключен. Ни один из них не меняет размер таблиц.  
Редактор до версии `4.0.0` хранит `show` как целое число, поэтому при сохранении в нем оба флага не теряются.

Начиная с версии `4.0.0` в константе `Language` есть еще восемь целевых форматов [Генератора кода](../../guide/guides/code-generator.md): от `Mermaid` до `JSONSchema`. Неизвестное парсеру значение `language` читается как `GraphQL`, поэтому редактор до версии `4.0.0` открывает документ, сохраненный с одним из них, с языком GraphQL, и при сохранении в нем записывается GraphQL.

Начиная с версии `4.0.0` поле `lockSettings` заменяет поле `ignoreSaveSettings`, а константа `LockSettingType` — удаленную константу `SaveSettingType`. Поле `lockSettings` указывает настройки, которые документ сохраняет в том виде, в каком они были в момент блокировки. Бит `viewport` охватывает `originX`, `originY` и `zoomLevel` вместе, поскольку начало координат, сохраненное без своего масштаба, открывается в другом месте, а каждый из остальных битов — поле, по имени которого он назван. Им соответствуют строки [`Lock`](../../guide/guides/settings.md#lock) на вкладке «Настройки».  
И `value`, и `runtimeValue` записывают заблокированную настройку с ее заблокированным значением, что бы ни показывал редактор, а каждую из остальных настроек — с текущим значением. Поэтому, пока соответствующая блокировка включена, прокрутка и масштабирование, переключение вкладок или изменение языка Генератора кода, стиля имен либо типа кавычек оставляют файл прежним. Блокировка берет значение, которое настройка имеет в этот момент, а при разборе заблокированное значение берется из сохраненного поля.  
Документ, начатый с нуля, — новый редактор или хранилище репликации либо пустое значение, переданное в `value` или `setInitialValue()`, — получает значение `lockSettings`, равное `63`: все блокировки включены. Документ, в `settings` которого нет `lockSettings`, — каждый файл, сохраненный до версии `4.0.0`, независимо от его `ignoreSaveSettings`, и каждый документ v2 — тоже открывается со всеми включенными блокировками: его вид и вкладка такие же, как у нового документа (`originX` и `originY` равны `0`, `zoomLevel` равно `1`, вкладка ERD), а язык, стили имен и тип кавычек заблокированы на сохраненных в нем значениях. Документ, в котором указаны его блокировки, сохраняет их, включая `0`, и все сохраненные в нем значения.  
При разборе сохраняются все биты `lockSettings`, в том числе неизвестные, поэтому блокировка, добавленная в более поздней версии, не теряется при сохранении в этой версии; JSON Schema проверяет только то, что это целое число. Редактор до версии `4.0.0` при сохранении отбрасывает `lockSettings` и записывает вид и вкладку в текущем состоянии, поэтому в этой версии файл снова открывается как сохраненный до версии `4.0.0`.

Начиная с версии `4.0.0` поле `ddlScripts` содержит два скрипта вкладки [«Схема SQL»](../../guide/guides/schema-sql.md), которые записываются в DDL любой базы данных: `before` — после заголовка и перед таблицами, `after` — после сгенерированного DDL. DDL записывает каждый из них с переводами строк LF, без начальных пустых строк и конечных пробельных символов, а для MSSQL — с завершающим `GO`, как описано в разделе [Скрипты перед таблицами и после них](../../guide/guides/schema-sql.md#before-and-after-scripts); само поле `ddlScripts` хранит каждый скрипт в том виде, в каком он введен. Ключ записывается, только пока хотя бы в одном скрипте есть текст, и тогда с обоими скриптами; отсутствующий ключ или скрипт, не являющийся строкой, читается как `''`. Выбор `Statements`, `Header` и `Tables` на этой вкладке в документе не сохраняется.  
Редактор до версии `4.0.0` отбрасывает скрипты при загрузке документа, поэтому при сохранении в нем они теряются.

Константы `Database`, `Language`, `Show`, `LockSettingType` и `ReferentialAction` только дополняются. Сохраненный документ хранит число, поэтому новая СУБД, целевой формат генерации кода, флаг, блокировка или действие занимают следующий бит, а не место в середине.

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

Каждый список задает порядок сущностей одного вида, который используют DDL, сортировка таблиц и порядок отрисовки. В форме хранения каждый список содержит только идентификаторы сохраняемых сущностей, каждый по одному разу, в порядке списка. Начиная с версии `4.0.0` список `tableGroupIds` задает порядок групп таблиц.

Начиная с версии `4.0.0` порядок наложения не сохраняется. При разборе каждая таблица, заметка и группа таблиц из списка, у которой нет `zIndex`, располагается в порядке наложения по своему месту в списке, причем более поздние оказываются впереди: группы таблиц — начиная с `1`, таблицы — начиная с `2`, а заметки — над всеми таблицами. Сущность, у которой есть `zIndex`, как в значении времени выполнения или в файле, сохраненном до версии `4.0.0`, сохраняет его. Поэтому перенос таблицы или заметки на передний план теряется при повторном открытии файла.

### Коллекция: tableEntities {#collection-tableentities}

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

Начиная с версии `4.0.0` у таблицы есть поле `groupId` — идентификатор [группы таблиц](../../guide/guides/table-groups.md), к которой она принадлежит. Если поле `groupId` отсутствует, пусто или не указывает ни на одну группу в `doc.tableGroupIds`, таблица не входит ни в одну группу, а форма хранения записывает это поле, только пока оно указывает на сохраняемую группу.  
Если поле `seqColumnIds` отсутствует или в нем нет какого-либо идентификатора из списка, при разборе оно заполняется значением `columnIds`, а редактор при каждой загрузке заново измеряет `widthName` и `widthComment` своими шрифтами.

### Коллекция: tableColumnEntities {#collection-tablecolumnentities}

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

Начиная с версии `4.0.0` форма хранения не записывает поле `ui` столбца. При каждой загрузке вычисляется `keys` — метка первичного ключа по биту `primaryKey` в `options` и метка внешнего ключа по связям, которые заканчиваются на столбце, — и измеряются четыре значения ширины.  
Редактор до версии `4.0.0` показывает столбцы файла, сохраненного в этой версии, без значков первичного ключа.

### Коллекция: relationshipEntities {#collection-relationshipentities}

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

Начиная с версии `3.10.0` у связи есть поля `onDelete` и `onUpdate` — ее [действия ON DELETE и ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Каждое из них содержит ровно одно значение `ReferentialAction`. Значение по умолчанию `none` не записывает предложение, поэтому действует поведение самой базы данных по умолчанию. Остальные пять соответствуют `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` и `RESTRICT`. Схема SQL записывает предложение только для базы данных, которая поддерживает это действие.  
Форма хранения всегда записывает оба поля, и начиная с версии `4.0.0` JSON Schema требует их наличия, проверяя только то, что каждое из них — целое число. При разборе отсутствующее поле, как в каждом документе, сохраненном до версии `3.10.0`, по-прежнему читается как `none`, как и значение вне списка.  
Редактор до версии `3.10.0` не знает этих полей и отбрасывает их при загрузке документа, поэтому при сохранении в нем теряются все действия.

Начиная с версии `4.0.0` при каждой загрузке вычисляется то, что не входит в форму хранения. Связь является идентифицирующей, если каждый столбец, на котором она заканчивается, — первичный ключ, а ее `startRelationshipType` равен `dash`, если каждый такой столбец — NOT NULL, и `ring` в противном случае; связь, у которой не осталось ни одного конечного столбца, — неидентифицирующая со значением `dash`, как и только что созданная связь. Точки привязки — `x`, `y` и `direction` — размещаются заново.

### Коллекция: indexEntities {#collection-indexentities}

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

Если поле `seqIndexColumnIds` отсутствует или в нем нет какого-либо идентификатора из списка, при разборе оно заполняется значением `indexColumnIds`.

### Коллекция: indexColumnEntities {#collection-indexcolumnentities}

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

### Коллекция: memoEntities {#collection-memoentities}

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

Начиная с версии `4.0.0` таблицы и заметки [находятся в общем порядке наложения](../../guide/guides/table-related-functions.md#moving-multiple-tables), упорядоченном по `zIndex`, поэтому таблица, перенесенная на передний план, может оказаться над заметкой. При разборе заметка, сохраненная без `zIndex`, помещается над всеми таблицами, как описано в разделе [Doc](#doc). Заметка в файле, сохраненном до версии `4.0.0`, сохраняет записанный в нем `zIndex`, который брался из того же счетчика, что и у таблиц, поэтому заметка, которую более ранняя версия рисовала поверх всех таблиц, может открыться под таблицей, перенесенной на передний план после нее.

### Коллекция: tableGroupEntities {#collection-tablegroupentities}

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

Начиная с версии `4.0.0` документ может содержать [группы таблиц](../../guide/guides/table-groups.md): именованные цветные прямоугольники, которые рисуются позади таблиц. Таблица входит в группу через собственное поле `groupId`, поэтому группа не хранит список своих членов. Форма хранения записывает эту коллекцию, как и `doc.tableGroupIds`, только при наличии группы, а в документе без нее, например сохраненном до версии `4.0.0`, групп нет. Их скрывает флаг `Show.hideTableGroup`.  
Редактор до версии `4.0.0` при загрузке документа отбрасывает группы и поле `groupId` каждой таблицы, поэтому при сохранении в нем теряются все группы.

## JSON Schema {#json-schema}

Канонический файл схемы опубликован по адресу [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json), и на него можно сослаться напрямую через `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Укажите `$schema` в начале файла `.erd.json`, и редакторы, поддерживающие JSON Schema, например VS Code, будут проверять документ и автодополнять его поля во время редактирования.

Начиная с версии `4.0.0` схема описывает только форму хранения. Каждый объект с именованными полями закрыт (`additionalProperties: false`), каждое поле, которое форма хранения записывает всегда, обязательно, а поля, которые в нее не входят, в схеме не названы. Поэтому схема отклоняет значение времени выполнения. Она также отклоняет файл, сохраненный до версии `4.0.0`, с его `meta`, значениями ширины, `zIndex`, `ignoreSaveSettings` и прочим, пока редактор версии `4.0.0` или новее не сохранит этот файл заново. В файле, сохраненном версией `3.2.0` или новее, уже указан URL этой схемы, который ведет на ветку `main`, поэтому редактор, проверяющий файл по ней, теперь помечает его как некорректный. В файле, сохраненном версией `3.0.0` или `3.1.0`, как и в документе v2, поле `$schema` не указано.

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
