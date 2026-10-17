---
sidebar_position: 3
description: Формат документа .erd.json — форма зберігання, яку містить файл, і значення часу виконання, яке тримає редактор, типи TypeScript, константи, що стоять за кожним числовим полем, і опублікована JSON Schema.
---

# Схема

`.erd.json` — це формат документів редактора. Прочитайте цю сторінку, якщо вам потрібно генерувати, перевіряти або мігрувати документ поза редактором.

Починаючи з версії `4.0.0`, документ має дві форми серіалізації, обидві з полем `version`, що має значення `'3.0.0'`. Форма зберігання — це те, що містить файл: її повертає [`editor.value`](../erd-editor-element.md#value), її записує експорт у JSON, і це єдина форма, яку приймає опублікована [JSON Schema](#json-schema). Значення часу виконання — це весь документ у тому вигляді, в якому його тримає редактор; саме його повертає [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). `setInitialValue()`, сетер `value` і `setSchemaJSON()` читають будь-яку з цих форм, будь-який файл, збережений попереднім випуском, і документ v2 у форматі `.vuerd`. До версії `4.0.0` форма була лише одна: властивість `value` повертала весь документ у тому вигляді, в якому його тримав редактор, як тепер це робить `runtimeValue`.

## Форма зберігання й значення часу виконання {#storage-form-and-runtime-value}

Форма зберігання містить лише наявні сутності: кожну таблицю, перелічену в `doc.tableIds`, стовпці, перелічені в цих таблицях, зв’язки між двома наявними таблицями, індекси наявних таблиць разом зі стовпцями індексів, стовпець яких досі є в переліку таблиці, а також перелічені нотатки й групи таблиць. До неї не входить те, що редактор обчислює під час завантаження або тримає, поки відкритий: видалені сутності, `seqColumnIds` і `seqIndexColumnIds`, усі поля `zIndex`, виміряні ширини, поле `ui` стовпця, а також поля `identification` і `startRelationshipType` зв’язку та його точки прив’язки. Типи нижче позначають кожне з цих полів коментарем `// runtime only`.  
Записи кожної колекції йдуть за ключами-ідентифікаторами в порядку кодових одиниць, причому стовпці спершу групуються за `tableId`, а стовпці індексів — за `indexId`. Кожна сутність записує свої поля у фіксованому порядку, а текст має відступ у два пробіли й завершується символом нового рядка. Тому той самий документ завжди дає ті самі байти, зміна впливає лише на те, чого вона стосується, а файл, збережений на комп’ютері з іншими шрифтами, знову відкривається з тим самим значенням `value`.  
VS Code, Obsidian і плагін для JetBrains записують файл лише тоді, коли зміна робить значення `value` іншим, тож файл, збережений попереднім випуском, зберігає стару форму до першої зміни.

Значення часу виконання зберігає те, що пропускає форма зберігання: видалені сутності, послідовності, z-індекси, ширини, позначки ключів, прапорці зв’язків і точки прив’язки. Воно має відступ у два пробіли й не має завершального символу нового рядка. Використовуйте його лише для ініціалізації співавтора або другого подання через `setInitialValue()`, щоб відміна видалення, яку надсилає інший редактор, повністю повертала там сутність. Ніколи не записуйте його у файл; JSON Schema його відхиляє. Видалені сутності більше ніщо не прибирає, тож значення часу виконання зберігає їх, доки документ не буде наступного разу відкрито з його файлу.

Обидві форми записують кожне заблоковане налаштування з його заблокованим значенням (див. [`lockSettings`](#settings)), `settings.ddlScripts` — лише поки скрипт містить текст, а поле `groupId` таблиці — лише поки воно не порожнє. Форма зберігання записує `doc.tableGroupIds` і `tableGroupEntities` лише тоді, коли існує група таблиць; значення часу виконання записує їх, поки документ містить групу або видалену групу.

## TypeScript {#typescript}

Типи описують значення часу виконання. Поле, позначене `// runtime only`, не входить у форму зберігання, а поле, позначене `?`, записується лише тоді, коли щось містить.

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

Ключем кожної сутності є її `id` — непрозорий рядок; під час розбору сутність, у якої поле `id` відсутнє або порожнє, відкидається. Починаючи з версії `4.0.0`, кожен новий ідентифікатор — це UUIDv7, записаний у формі Uuid25: 25 цифр системи числення з основою 36 у нижньому регістрі, як-от `03gzrxjv20bdlcak89q25d2m7`, тож ідентифікатори, які створює один редактор, сортуються в порядку їх створення. Документ зберігає ті ідентифікатори, які в ньому є, як-от ідентифікатори nanoid попереднього випуску або ідентифікатори файлу v2, тож ніщо не повинно покладатися на вигляд ідентифікатора.

Починаючи з версії `4.0.0`, жодна сутність не містить об’єкта `meta` (`createAt`, `updateAt`), а типи `EntityMeta` і `EntityType` видалено. Ніщо його не записує, під час розбору об’єкт `meta` зі старішого файлу відкидається, а JSON Schema його відхиляє. Він лише задавав час збирання сміття для видалених сутностей, якого теж більше немає.

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

`originX` і `originY` — це область перегляду: точка екрана, на яку припадає точка сцени `(0, 0)`.  
Поле `zoomLevel` набуває значень від `0.1` до `1.5`. Документ, збережений зі значенням понад `1`, у редакторі до версії `3.5.0` відкривається зі значенням `1`.  
Починаючи з версії `4.0.0`, налаштування не містять полів `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` чи `ignoreSaveSettings`. Ніщо їх не записує, парсер жодного з них не зберігає, а JSON Schema відхиляє файл, у якому вони ще є.

Поле `canvasType` — це вкладка, на якій відкривається документ. Документ, збережений на вкладці візуалізації, містить `'@dineug/erd-editor/builtin-visualization'`, але не те, який режим було показано, `Graph` чи `Flow`, а щойно створений редактор показує цю вкладку в режимі `Graph`.  
Починаючи з версії `4.0.0`, поки блокування `Canvas Type` увімкнено, як у новому документі, документ зберігає вкладку, яку було показано в момент блокування, а перемикання вкладок залишає значення `value` без змін. Блокування, встановлене на вкладці налаштувань, зберігає вкладку, з якої ви на неї перейшли, а заблоковане значення `'settings'`, яке можна записати лише ручним редагуванням, відкривається на вкладці `'ERD'`.  
Жодна частина власного стану режиму `Flow` не серіалізується — його розміщення, масштаб, панорамування, відображення рядків і таблиці у фокусі залишаються в редакторі, — тож `originX`, `originY` і `zoomLevel` завжди описують полотно ERD.

Поля `show` і `lockSettings` є бітовими масками — об’єднуйте прапорці операцією OR.  
Поле `columnOrder` — це масив, що містить усі сім значень `ColumnType` у порядку відображення.  
Кожне з полів `database`, `language`, `tableNameCase`, `columnNameCase` і `bracketType` містить рівно одне значення, а JSON Schema відхиляє комбіноване значення.

У новому документі поле `show` дорівнює `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` і `relationship`.  
Починаючи з версії `3.10.0`, поле `show` має ще два прапорці, обидва вимкнені в новому документі й у кожному документі, збереженому до версії `3.10.0`.  
Прапорець `columnAlternateKey` (`512`) відповідає параметру відображення [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). Коли його встановлено, він позначає стовпці кожного унікального індексу з двох або більше стовпців як `AK1.1`, `AK1.2` і так далі. Спочатку він вимкнений, тож ширина жодної наявної діаграми не змінюється.  
Прапорець `hideReferentialAction` (`1024`) працює навпаки: коли його встановлено, він ховає [мітки ON DELETE і ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) на лініях зв’язку, тож за замовчуванням вони показуються. Параметр відображення `Referential Actions` позначено, поки прапорець вимкнений. Він не змінює розміру жодної таблиці.  
Редактор до версії `3.10.0` тримає поле `show` як ціле число, тож обидва прапорці не втрачаються, коли документ зберігають у ньому.

Починаючи з версії `4.0.0`, поле `show` має ще два прапорці, обидва вимкнені в новому документі й у кожному документі, збереженому до версії `4.0.0`. Як і `hideReferentialAction`, кожен із них ховає те, що вказано в його назві, тож групи таблиць і нотатки за замовчуванням показуються.  
Прапорець `hideTableGroup` (`2048`) ховає [групи таблиць](../../guide/guides/table-groups.md), а `hideMemo` (`4096`) ховає всі нотатки. Це [параметри відображення](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` і `Memos`, кожен з яких позначено, поки його прапорець вимкнений. Жоден із них не змінює розміру жодної таблиці.  
Редактор до версії `4.0.0` тримає поле `show` як ціле число, тож обидва прапорці не втрачаються, коли документ зберігають у ньому.

Починаючи з версії `4.0.0`, константа `Language` має ще вісім цільових форматів [генератора коду](../../guide/guides/code-generator.md), від `Mermaid` до `JSONSchema`. Значення `language`, якого парсер не знає, читається як `GraphQL`, тож редактор до версії `4.0.0` відкриває документ, збережений з одним із них, з мовою GraphQL, а збереження в ньому записує GraphQL.

Починаючи з версії `4.0.0`, поле `lockSettings` замінює `ignoreSaveSettings`, а `LockSettingType` — тип `SaveSettingType`, який видалено. Поле `lockSettings` визначає налаштування, які документ зберігає такими, якими вони були в момент блокування. Біт `viewport` охоплює `originX`, `originY` і `zoomLevel` разом, оскільки початок координат, збережений без свого масштабу, відкривається в іншому місці, а кожен інший біт охоплює однойменне поле. Це рядки [`Lock`](../../guide/guides/settings.md#lock) вкладки налаштувань.  
І `value`, і `runtimeValue` записують заблоковане налаштування з його заблокованим значенням, хоч би що показував редактор, а кожне інше налаштування — таким, яким воно є зараз. Тож поки відповідне блокування увімкнено, прокручування й масштабування, перемикання вкладок чи зміна мови генератора коду, стилю назв або типу лапок залишають файл без змін. Блокування бере значення, яке налаштування має в цей момент, а під час розбору заблоковане значення береться зі збереженого поля.  
Документ, створений з нуля, — у новому редакторі чи сховищі реплікації або з порожнього значення, переданого у `value` чи `setInitialValue()`, — має поле `lockSettings` зі значенням `63`: усі блокування ввімкнено. Документ, поле `settings` якого не містить `lockSettings`, — кожен файл, збережений до версії `4.0.0`, незалежно від його `ignoreSaveSettings`, і кожен документ v2, — так само відкривається з усіма ввімкненими блокуваннями: його область перегляду й вкладка такі самі, як у нового документа (`originX` і `originY` дорівнюють `0`, `zoomLevel` — `1`, вкладка ERD), а його мову, стилі назв і тип лапок заблоковано на збережених значеннях. Документ, який указує свої блокування, зберігає їх, включно з `0`, і всі збережені значення.  
Під час розбору зберігаються всі біти `lockSettings`, зокрема невідомі, тож блокування, яке додасть пізніший випуск, не втрачається під час збереження тут; JSON Schema перевіряє лише те, що це ціле число. Редактор до версії `4.0.0` під час збереження відкидає `lockSettings` і записує область перегляду й вкладку такими, якими вони є, тож тут файл знову відкривається як збережений до версії `4.0.0`.

Починаючи з версії `4.0.0`, поле `ddlScripts` містить два скрипти вкладки [схеми SQL](../../guide/guides/schema-sql.md), які записує DDL для кожної бази даних: `before` — після заголовка й перед таблицями, `after` — після згенерованого DDL. DDL записує кожен скрипт з розривами рядків LF, без початкових порожніх рядків і кінцевих пробільних символів, а для MSSQL — із `GO` наприкінці, як описано в розділі [скрипти перед таблицями й після них](../../guide/guides/schema-sql.md#before-and-after-scripts); саме поле `ddlScripts` зберігає кожен скрипт у тому вигляді, в якому його введено. Ключ записується лише тоді, коли хоча б один скрипт містить текст, і тоді — з обома скриптами; відсутній ключ або скрипт, що не є рядком, читається як `''`. Вибір у параметрах вкладки `Statements`, `Header` і `Tables` не зберігається в документі.  
Редактор до версії `4.0.0` відкидає скрипти під час завантаження документа, тож під час збереження в ньому вони втрачаються.

Константи `Database`, `Language`, `Show`, `LockSettingType` і `ReferentialAction` розширюються лише додаванням у кінець. У збереженому документі записано число, тож нова СУБД, цільовий формат генерації коду, прапорець, блокування чи дія займає наступний біт, а не місце посередині.

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

Кожен список задає порядок сутностей одного виду, який зчитують DDL, сортування таблиць і порядок малювання. У формі зберігання кожен список містить лише ідентифікатори наявних сутностей, кожен по одному разу, у тому порядку, в якому їх перелічено. Починаючи з версії `4.0.0`, поле `tableGroupIds` задає порядок груп таблиць.

Починаючи з версії `4.0.0`, порядок накладання не зберігається. Під час розбору кожна перелічена таблиця, нотатка й група таблиць без поля `zIndex` розміщується в порядку накладання відповідно до своєї позиції у списку, пізніші — попереду: групи таблиць починаючи з `1`, таблиці — з `2`, а нотатки — над усіма таблицями. Сутність, що має `zIndex`, як у значенні часу виконання або у файлі, збереженому до версії `4.0.0`, зберігає його. Тому виведення таблиці чи нотатки на передній план утрачається, коли файл відкривають знову.

### Колекція: tableEntities {#collection-tableentities}

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

Починаючи з версії `4.0.0`, таблиця містить поле `groupId` — ідентифікатор [групи таблиць](../../guide/guides/table-groups.md), до якої вона належить. Відсутнє чи порожнє поле `groupId` або таке, що не вказує на жодну групу в `doc.tableGroupIds`, означає відсутність групи, і форма зберігання записує його лише тоді, коли воно вказує на наявну групу.  
Під час розбору поле `seqColumnIds` отримує значення `columnIds`, якщо воно відсутнє або в ньому бракує переліченого ідентифікатора, а редактор під час кожного завантаження знову вимірює `widthName` і `widthComment` власними шрифтами.

### Колекція: tableColumnEntities {#collection-tablecolumnentities}

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

Починаючи з версії `4.0.0`, форма зберігання не записує поле `ui` стовпців. Під час кожного завантаження обчислюється `keys` — позначка первинного ключа з біта `primaryKey` поля `options` і позначка зовнішнього ключа зі зв’язків, що закінчуються на стовпці, — і вимірюються чотири ширини.  
Редактор до версії `4.0.0` показує стовпці файлу, збереженого тут, без значків первинного ключа.

### Колекція: relationshipEntities {#collection-relationshipentities}

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

Починаючи з версії `3.10.0`, зв’язок містить поля `onDelete` і `onUpdate` — свої [дії ON DELETE і ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update). Кожне з них містить рівно одне значення `ReferentialAction`. Типове значення `none` не записує жодної конструкції, тож застосовується власне типове значення бази даних. Інші п’ять відповідають `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` і `RESTRICT`. Схема SQL записує конструкцію лише для бази даних, яка підтримує відповідну дію.  
Форма зберігання завжди записує обидва поля, і, починаючи з версії `4.0.0`, JSON Schema вимагає їх, перевіряючи лише те, що кожне з них є цілим числом. Під час розбору відсутнє поле, як-от у кожному документі, збереженому до версії `3.10.0`, і далі читається як `none`, і так само читається значення поза списком.  
Редактор до версії `3.10.0` не знає цих полів і відкидає їх під час завантаження документа, тож під час збереження в ньому всі дії втрачаються.

Починаючи з версії `4.0.0`, під час кожного завантаження обчислюється те, що пропускає форма зберігання. Зв’язок є ідентифікувальним, коли кожен стовпець, на якому він закінчується, є первинним ключем, а його поле `startRelationshipType` дорівнює `dash`, коли кожен такий стовпець є NOT NULL, і `ring` в іншому разі; зв’язок, у якого не залишилося жодного кінцевого стовпця, є неідентифікувальним і має `dash`, як і щойно створений зв’язок. Точки прив’язки — `x`, `y` і `direction` — розміщуються заново.

### Колекція: indexEntities {#collection-indexentities}

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

Під час розбору поле `seqIndexColumnIds` отримує значення `indexColumnIds`, якщо воно відсутнє або в ньому бракує переліченого ідентифікатора.

### Колекція: indexColumnEntities {#collection-indexcolumnentities}

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

### Колекція: memoEntities {#collection-memoentities}

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

Починаючи з версії `4.0.0`, таблиці й нотатки [мають спільний стек](../../guide/guides/table-related-functions.md#moving-multiple-tables), упорядкований за `zIndex`, тож виведення таблиці на передній план може розмістити її поверх нотатки. Під час розбору нотатка, збережена без `zIndex`, розміщується над усіма таблицями, як описано в розділі [Doc](#doc). Нотатка у файлі, збереженому до версії `4.0.0`, зберігає записаний для неї `zIndex`, який брався з того самого лічильника, що й значення таблиць, тож нотатка, яку попередній випуск малював поверх усіх таблиць, може відкритися під таблицею, виведеною на передній план після неї.

### Колекція: tableGroupEntities {#collection-tablegroupentities}

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

Починаючи з версії `4.0.0`, документ може містити [групи таблиць](../../guide/guides/table-groups.md): іменовані кольорові прямокутники, що малюються позаду таблиць. Таблиця приєднується до групи через власне поле `groupId`, тож група не містить списку членів. Форма зберігання записує цю колекцію, як і `doc.tableGroupIds`, лише тоді, коли існує група, а документ без неї, як-от збережений до версії `4.0.0`, не має груп. Прапорець `Show.hideTableGroup` ховає їх.  
Редактор до версії `4.0.0` під час завантаження документа відкидає групи й поле `groupId` кожної таблиці, тож під час збереження в ньому всі групи втрачаються.

## JSON Schema {#json-schema}

Канонічний файл схеми опубліковано за адресою [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json), і на нього можна посилатися безпосередньо через `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

Розмістіть поле `$schema` на початку файлу `.erd.json`, і редактори, які розуміють JSON Schema, як-от VS Code, перевірятимуть документ і автодоповнюватимуть його поля під час редагування.

Починаючи з версії `4.0.0`, схема описує лише форму зберігання. Кожен об’єкт з іменованими полями закритий (`additionalProperties: false`), кожне поле, яке форма зберігання завжди записує, є обов’язковим, а жодного поля, яке вона пропускає, у схемі не названо. Тому схема відхиляє значення часу виконання. Вона також відхиляє файл, збережений до версії `4.0.0`, з його `meta`, ширинами, `zIndex`, `ignoreSaveSettings` тощо, доки редактор версії `4.0.0` або новішої не збереже цей файл знову. Файл, збережений версією `3.2.0` або новішою, уже вказує URL цієї схеми, що веде на гілку `main`, тож редактор, який перевіряє файл за нею, тепер позначає його як помилковий. Файл, збережений версією `3.0.0` чи `3.1.0`, або документ v2 не вказує поля `$schema`.

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
