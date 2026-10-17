---
sidebar_position: 3
description: قالب سند .erd.json — شکل ذخیره‌سازی که فایل در خود دارد و مقدار زمان اجرا که ویرایشگر در خود دارد، انواع TypeScript، ثابت‌های متناظر با هر فیلد عددی و JSON Schema منتشرشده.
---

# طرح‌واره

`.erd.json` قالب سند ویرایشگر است. اگر لازم است سندی را بیرون از ویرایشگر تولید یا اعتبارسنجی کنید یا آن را مهاجرت دهید، این صفحه را بخوانید.

از نسخهٔ `4.0.0`، هر سند دو شکل سریال‌شده دارد که `version` هر دو `'3.0.0'` است. شکل ذخیره‌سازی همان چیزی است که فایل در خود دارد: همان چیزی است که [`editor.value`](../erd-editor-element.md#value) برمی‌گرداند، همان چیزی که صادر کردن JSON می‌نویسد و تنها شکلی که [JSON Schema](#json-schema) منتشرشده می‌پذیرد. مقدار زمان اجرا کل سند است، همان‌طور که ویرایشگر آن را در خود دارد، و [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) آن را برمی‌گرداند. `setInitialValue()`، setter خاصیت `value` و `setSchemaJSON()` هر دو شکل، هر فایلی که نسخه‌ای قدیمی‌تر ذخیره کرده و یک سند v2 با قالب `.vuerd` را می‌خوانند. پیش از نسخهٔ `4.0.0` فقط یک شکل وجود داشت: `value` کل سند را همان‌طور که ویرایشگر در خود داشت برمی‌گرداند، همان کاری که اکنون `runtimeValue` می‌کند.

## شکل ذخیره‌سازی و مقدار زمان اجرا {#storage-form-and-runtime-value}

شکل ذخیره‌سازی فقط موجودیت‌های حذف‌نشده را در خود دارد: هر جدولی که در `doc.tableIds` فهرست شده، ستون‌هایی که آن جدول‌ها فهرست کرده‌اند، رابطه‌های میان دو جدول باقی‌مانده، شاخص‌های جدول‌های باقی‌مانده همراه با ستون‌های شاخصی که جدول هنوز ستونشان را فهرست کرده است و یادداشت‌ها و گروه‌های جدول فهرست‌شده. آنچه ویرایشگر هنگام بارگذاری به دست می‌آورد یا تا وقتی باز است نگه می‌دارد در آن نمی‌آید: موجودیت‌های حذف‌شده، `seqColumnIds` و `seqIndexColumnIds`، همهٔ مقادیر `zIndex`، عرض‌های اندازه‌گیری‌شده، فیلد `ui` ستون و نیز `identification`، `startRelationshipType` و نقاط اتصال رابطه. انواع زیر هر یک از این فیلدها را با `// runtime only` علامت می‌زنند.  
هر مجموعه با شناسه‌ها و به ترتیب واحدهای کد کلیدگذاری می‌شود و در آن ستون‌ها ابتدا بر اساس `tableId` و ستون‌های شاخص ابتدا بر اساس `indexId` گروه‌بندی می‌شوند. هر موجودیت فیلدهایش را به ترتیبی ثابت می‌نویسد و متن با دو فاصله تورفتگی دارد و با یک نویسهٔ خط جدید پایان می‌یابد. بنابراین سندی یکسان همیشه به همان بایت‌ها نوشته می‌شود، هر ویرایش فقط بخشی را که به آن دست می‌زند تغییر می‌دهد و فایلی که روی رایانه‌ای با قلم‌های دیگر ذخیره شده با همان `value` دوباره باز می‌شود.  
VS Code، Obsidian و پلاگین JetBrains فقط وقتی فایل را می‌نویسند که ویرایشی `value` را تغییر دهد، بنابراین فایلی که نسخه‌ای قدیمی‌تر ذخیره کرده تا نخستین ویرایشش شکل قدیمی خود را حفظ می‌کند.

مقدار زمان اجرا آنچه را شکل ذخیره‌سازی کنار می‌گذارد نگه می‌دارد: موجودیت‌های حذف‌شده، توالی‌ها، مقادیر z-index، عرض‌ها، نشانه‌های کلید، پرچم‌های رابطه و نقاط اتصال. این مقدار با دو فاصله تورفتگی دارد و در انتها نویسهٔ خط جدید ندارد. از آن فقط برای مقداردهی اولیهٔ یک همکار یا نمای دوم از طریق `setInitialValue()` استفاده کنید، تا واگرد حذفی که ویرایشگر دیگری می‌فرستد موجودیت را در آنجا به‌طور کامل برگرداند. هرگز آن را در فایل ننویسید؛ JSON Schema آن را رد می‌کند. دیگر هیچ چیز موجودیت‌های حذف‌شده را جمع‌آوری نمی‌کند، بنابراین مقدار زمان اجرا آن‌ها را تا دفعهٔ بعد که سند از فایلش باز شود نگه می‌دارد.

هر دو شکل هر تنظیم قفل‌شده را با مقدار قفل‌شده‌اش ([`lockSettings`](#settings) را ببینید)، `settings.ddlScripts` را فقط تا وقتی اسکریپتی متن دارد و `groupId` جدول را فقط تا وقتی خالی نیست می‌نویسند. شکل ذخیره‌سازی `doc.tableGroupIds` و `tableGroupEntities` را فقط تا وقتی گروه جدولی وجود دارد می‌نویسد؛ مقدار زمان اجرا آن‌ها را تا وقتی سند یک گروه یا یک گروه حذف‌شده دارد می‌نویسد.

## TypeScript {#typescript}

این انواع مقدار زمان اجرا را توصیف می‌کنند. فیلدی که با `// runtime only` علامت خورده در شکل ذخیره‌سازی نمی‌آید و فیلدی که با `?` علامت خورده فقط تا وقتی چیزی در خود دارد نوشته می‌شود.

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

کلید هر موجودیت `id` آن است، یک رشتهٔ غیرشفاف؛ هنگام تجزیه، موجودیتی که `id` آن وجود ندارد یا خالی است کنار گذاشته می‌شود. از نسخهٔ `4.0.0`، هر شناسهٔ جدید یک UUIDv7 است که به شکل Uuid25 نوشته می‌شود، یعنی 25 رقم مبنای 36 با حروف کوچک مانند `03gzrxjv20bdlcak89q25d2m7`، بنابراین شناسه‌هایی که یک ویرایشگر می‌سازد به همان ترتیبی مرتب می‌شوند که ساخته شده‌اند. هر سند شناسه‌هایی را که دارد نگه می‌دارد، مانند شناسه‌های nanoid نسخه‌ای قدیمی‌تر یا شناسه‌های یک فایل v2، بنابراین هیچ چیز نباید به شکل شناسه‌ها وابسته باشد.

از نسخهٔ `4.0.0`، هیچ موجودیتی شیء `meta` (`createAt`، `updateAt`) ندارد و نوع‌های `EntityMeta` و `EntityType` حذف شده‌اند. هیچ چیز آن را نمی‌نویسد، هنگام تجزیه شیء `meta` فایل‌های قدیمی‌تر کنار گذاشته می‌شود و JSON Schema آن را رد می‌کند. تنها کاربرد آن زمان‌بندی جمع‌آوری زبالهٔ موجودیت‌های حذف‌شده بود که آن هم دیگر وجود ندارد.

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

`originX` و `originY` نما هستند: نقطه‌ای از صفحهٔ نمایش که نقطهٔ `(0, 0)` صحنه روی آن قرار می‌گیرد.  
`zoomLevel` از `0.1` تا `1.5` است. سندی که با مقداری بیش از `1` ذخیره شده، در ویرایشگرهای پیش از نسخهٔ `3.5.0` با مقدار `1` باز می‌شود.  
از نسخهٔ `4.0.0`، تنظیمات هیچ‌یک از `width`، `height`، `scrollTop`، `scrollLeft`، `relationshipOptimization` یا `ignoreSaveSettings` را ندارند. هیچ چیز آن‌ها را نمی‌نویسد، تجزیه‌گر هیچ‌یک را نگه نمی‌دارد و JSON Schema فایلی را که هنوز آن‌ها را دارد رد می‌کند.

`canvasType` زبانه‌ای است که سند روی آن باز می‌شود. سندی که در زبانهٔ مصورسازی ذخیره شده `'@dineug/erd-editor/builtin-visualization'` را در خود دارد، اما نه اینکه حالت `Graph` نمایش داده می‌شد یا حالت `Flow`، و ویرایشگری که تازه ایجاد شده آن زبانه را در حالت `Graph` نشان می‌دهد.  
از نسخهٔ `4.0.0`، تا وقتی قفل `Canvas Type` روشن است، همان‌طور که در سند جدید روشن است، سند زبانه‌ای را که هنگام قفل شدن نمایش داده می‌شد نگه می‌دارد و جابه‌جایی میان زبانه‌ها `value` را دست‌نخورده می‌گذارد. قفلی که در زبانهٔ تنظیمات گرفته شود زبانه‌ای را نگه می‌دارد که خواننده از آن آمده بود، و `'settings'` قفل‌شده، که فقط ویرایش دستی می‌تواند آن را بنویسد، روی `'ERD'` باز می‌شود.  
هیچ بخشی از وضعیت خود حالت `Flow` سریال‌سازی نمی‌شود — چیدمان، بزرگ‌نمایی، جابه‌جایی نما، نمایش ردیف و جدول‌های مورد تمرکز آن در ویرایشگر می‌مانند — بنابراین `originX`، `originY` و `zoomLevel` همیشه بوم ERD را توصیف می‌کنند.

`show` و `lockSettings` ماسک بیتی هستند — پرچم‌ها را با OR با هم ترکیب کنید.  
`columnOrder` آرایه‌ای است که هر هفت مقدار `ColumnType` را به ترتیب نمایش در خود دارد.  
`database`، `language`، `tableNameCase`، `columnNameCase` و `bracketType` هر کدام دقیقاً یک مقدار دارند و JSON Schema مقدار ترکیبی را رد می‌کند.

مقدار `show` در سند جدید `431` است: `tableComment`، `columnComment`، `columnDataType`، `columnDefault`، `columnPrimaryKey`، `columnNotNull` و `relationship`.  
از نسخهٔ `3.10.0`، دو پرچم دیگر برای `show` وجود دارد که هر دو در سند جدید و در همهٔ سندهایی که پیش از نسخهٔ `3.10.0` ذخیره شده‌اند خاموش‌اند.  
`columnAlternateKey` (`512`) گزینهٔ نمایش [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys) است. وقتی تنظیم شده باشد، ستون‌های هر شاخص یکتا روی دو ستون یا بیشتر را با `AK1.1`، `AK1.2` و غیره علامت می‌زند. در ابتدا خاموش است، بنابراین عرض هیچ نمودار موجودی تغییر نمی‌کند.  
`hideReferentialAction` (`1024`) برعکس عمل می‌کند: وقتی تنظیم شده باشد، [برچسب‌های ON DELETE و ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) را روی خطوط اتصال پنهان می‌کند، بنابراین این برچسب‌ها به‌طور پیش‌فرض نمایش داده می‌شوند. گزینهٔ نمایش `Referential Actions` تا وقتی این پرچم خاموش است علامت‌خورده است. این پرچم اندازهٔ هیچ جدولی را تغییر نمی‌دهد.  
ویرایشگرهای پیش از نسخهٔ `3.10.0` مقدار `show` را به‌صورت یک عدد کامل نگه می‌دارند، بنابراین هر دو پرچم پس از ذخیره در آن‌ها باقی می‌مانند.

از نسخهٔ `4.0.0`، دو پرچم دیگر برای `show` وجود دارد که هر دو در سند جدید و در همهٔ سندهایی که پیش از نسخهٔ `4.0.0` ذخیره شده‌اند خاموش‌اند. هر کدام، مانند `hideReferentialAction`، همان چیزی را که نامش را می‌برد پنهان می‌کند، بنابراین گروه‌های جدول و یادداشت‌ها به‌طور پیش‌فرض نمایش داده می‌شوند.  
`hideTableGroup` (`2048`) [گروه‌های جدول](../../guide/guides/table-groups.md) را پنهان می‌کند و `hideMemo` (`4096`) همهٔ یادداشت‌ها را. این دو [گزینه‌های نمایش](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` و `Memos` هستند که هر کدام تا وقتی پرچمش خاموش است علامت‌خورده است. هیچ‌کدام اندازهٔ هیچ جدولی را تغییر نمی‌دهد.  
ویرایشگرهای پیش از نسخهٔ `4.0.0` مقدار `show` را به‌صورت یک عدد کامل نگه می‌دارند، بنابراین هر دو پرچم پس از ذخیره در آن‌ها باقی می‌مانند.

از نسخهٔ `4.0.0`، `Language` هشت هدف دیگر برای [مولد کد](../../guide/guides/code-generator.md) دارد، از `Mermaid` تا `JSONSchema`. مقداری از `language` که تجزیه‌گر آن را نمی‌شناسد `GraphQL` خوانده می‌شود، بنابراین ویرایشگرهای پیش از نسخهٔ `4.0.0` سندی را که با یکی از این هدف‌ها ذخیره شده روی GraphQL باز می‌کنند و ذخیره در آن‌ها GraphQL را می‌نویسد.

از نسخهٔ `4.0.0`، `lockSettings` جای `ignoreSaveSettings` را گرفته است و `LockSettingType` جای `SaveSettingType` را که حذف شده است. `lockSettings` تنظیماتی را مشخص می‌کند که سند آن‌ها را همان‌طور ذخیره می‌کند که هنگام قفل شدن بودند. بیت `viewport` فیلدهای `originX`، `originY` و `zoomLevel` را با هم پوشش می‌دهد، زیرا مبدئی که بدون سطح بزرگ‌نمایی‌اش ذخیره شود جای دیگری باز می‌شود، و هر بیت دیگر فیلدی را پوشش می‌دهد که هم‌نام آن است. این‌ها ردیف‌های [`Lock`](../../guide/guides/settings.md#lock) در زبانهٔ تنظیمات هستند.  
تنظیم قفل‌شده، هر چه ویرایشگر نشان دهد، هم در `value` و هم در `runtimeValue` با مقدار قفل‌شده‌اش نوشته می‌شود و هر تنظیم دیگر با مقدار فعلی‌اش. بنابراین تا وقتی قفل متناظر روشن است، پیمایش و بزرگ‌نمایی، جابه‌جایی میان زبانه‌ها یا تغییر زبان کد در مولد کد، شیوهٔ نگارش نام یا نوع علامت نقل‌قول، فایل را دست‌نخورده می‌گذارد. قفل کردن مقداری را که تنظیم در آن لحظه دارد ثبت می‌کند، و هنگام تجزیه مقدار قفل‌شده از فیلد ذخیره‌شده خوانده می‌شود.  
سندی که از صفر شروع می‌شود — ویرایشگر یا مخزن رونوشت جدید، یا مقداری خالی که به `value` یا `setInitialValue()` داده شود — مقدار `lockSettings` آن `63` است، یعنی همهٔ قفل‌ها روشن‌اند. سندی که `settings` آن فیلد `lockSettings` ندارد — همهٔ فایل‌هایی که پیش از نسخهٔ `4.0.0` ذخیره شده‌اند، با هر مقدار `ignoreSaveSettings`، و همهٔ سندهای v2 — نیز با همهٔ قفل‌های روشن باز می‌شود: نما و زبانه‌اش همانند سند جدید است (`originX` و `originY` برابر `0`، `zoomLevel` برابر `1`، زبانهٔ ERD) و زبان کد، شیوه‌های نگارش نام و نوع علامت نقل‌قولش روی مقادیری که ذخیره کرده قفل می‌شوند. سندی که قفل‌هایش را مشخص کرده است آن‌ها را، از جمله `0`، همراه با همهٔ مقادیری که ذخیره کرده نگه می‌دارد.  
هنگام تجزیه همهٔ بیت‌های `lockSettings`، حتی بیت‌های ناشناخته، حفظ می‌شوند، بنابراین قفلی که نسخه‌ای جدیدتر اضافه کند پس از ذخیره در اینجا باقی می‌ماند؛ JSON Schema فقط بررسی می‌کند که این مقدار عدد صحیح باشد. ویرایشگرهای پیش از نسخهٔ `4.0.0` هنگام ذخیره فیلد `lockSettings` را کنار می‌گذارند و نما و زبانه را همان‌طور که هستند می‌نویسند، بنابراین فایل در اینجا دوباره مانند فایلی باز می‌شود که پیش از نسخهٔ `4.0.0` ذخیره شده است.

از نسخهٔ `4.0.0`، `ddlScripts` دو اسکریپت زبانهٔ [طرح‌واره SQL](../../guide/guides/schema-sql.md) را در خود دارد که DDL همهٔ پایگاه‌های داده آن‌ها را می‌نویسد: `before` را پس از سرآیند و پیش از جدول‌ها و `after` را پس از DDL تولیدشده. DDL هر یک را با شکست خط LF، بدون خطوط خالی ابتدایی و فاصله‌های انتهایی‌اش و در MSSQL با `GO` در پایان می‌نویسد، همان‌طور که در [اسکریپت‌های پیش و پس از جدول‌ها](../../guide/guides/schema-sql.md#before-and-after-scripts) توضیح داده شده است؛ خود `ddlScripts` هر اسکریپت را همان‌طور که تایپ شده نگه می‌دارد. این کلید فقط تا وقتی یکی از دو اسکریپت متن دارد نوشته می‌شود و در آن صورت با هر دو اسکریپت؛ نبود کلید یا اسکریپتی که رشته نباشد `''` خوانده می‌شود. گزینه‌های `Statements`، `Header` و `Tables` این زبانه در سند ذخیره نمی‌شوند.  
ویرایشگرهای پیش از نسخهٔ `4.0.0` هنگام بارگذاری سند اسکریپت‌ها را کنار می‌گذارند، بنابراین ذخیره در آن‌ها اسکریپت‌ها را از بین می‌برد.

به `Database`، `Language`، `Show`، `LockSettingType` و `ReferentialAction` فقط می‌توان از انتها افزود. سند ذخیره‌شده عدد را نگه می‌دارد، بنابراین سامانهٔ پایگاه داده، هدف تولید کد، پرچم، قفل یا کنش جدید بیت بعدی را می‌گیرد، نه جایی در میانه را.

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

هر فهرست ترتیب یک نوع موجودیت است که DDL، مرتب‌سازی جدول‌ها و ترتیب رسم آن را می‌خوانند. در شکل ذخیره‌سازی، هر فهرست فقط شناسه‌های موجودیت‌های باقی‌مانده را دارد، هر کدام یک بار و به همان ترتیبی که فهرست شده‌اند. از نسخهٔ `4.0.0`، `tableGroupIds` ترتیب گروه‌های جدول است.

از نسخهٔ `4.0.0`، ترتیب لایه‌ها ذخیره نمی‌شود. هنگام تجزیه، هر جدول، یادداشت و گروه جدول فهرست‌شده‌ای که `zIndex` ندارد بر اساس جایگاهش در فهرست خود در لایه‌ها چیده می‌شود و موارد بعدی جلوتر قرار می‌گیرند: گروه‌های جدول از `1`، جدول‌ها از `2` و یادداشت‌ها بالاتر از همهٔ جدول‌ها. موجودیتی که `zIndex` دارد، مانند آنچه در مقدار زمان اجرا یا در فایلی ذخیره‌شده پیش از نسخهٔ `4.0.0` هست، آن را نگه می‌دارد. بنابراین آوردن یک جدول یا یادداشت به جلو با باز کردن دوبارهٔ فایل از بین می‌رود.

### مجموعه: tableEntities {#collection-tableentities}

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

از نسخهٔ `4.0.0`، هر جدول `groupId` دارد، یعنی شناسهٔ [گروه جدولی](../../guide/guides/table-groups.md) که به آن تعلق دارد. نبودن `groupId`، خالی بودن آن یا اشاره نکردن آن به هیچ گروهی در `doc.tableGroupIds` به معنای نداشتن گروه است و شکل ذخیره‌سازی آن را فقط تا وقتی به گروهی باقی‌مانده اشاره می‌کند می‌نویسد.  
هنگام تجزیه، اگر `seqColumnIds` وجود نداشته باشد یا یکی از شناسه‌های فهرست‌شده را کم داشته باشد، مقدار اولیهٔ آن برابر `columnIds` قرار داده می‌شود و ویرایشگر در هر بارگذاری `widthName` و `widthComment` را با قلم‌های خودش دوباره اندازه می‌گیرد.

### مجموعه: tableColumnEntities {#collection-tablecolumnentities}

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

از نسخهٔ `4.0.0`، شکل ذخیره‌سازی فیلد `ui` ستون را نمی‌نویسد. در هر بارگذاری، `keys` به دست می‌آید، یعنی نشانهٔ کلید اصلی از بیت `primaryKey` در `options` و نشانهٔ کلید خارجی از رابطه‌هایی که به ستون ختم می‌شوند، و چهار عرض اندازه‌گیری می‌شوند.  
ویرایشگرهای پیش از نسخهٔ `4.0.0` ستون‌های فایلی را که در اینجا ذخیره شده بدون نماد کلید اصلی‌شان نشان می‌دهند.

### مجموعه: relationshipEntities {#collection-relationshipentities}

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

از نسخهٔ `3.10.0`، هر رابطه `onDelete` و `onUpdate` را دارد که [کنش‌های ON DELETE و ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) آن هستند. هر کدام دقیقاً یک مقدار `ReferentialAction` دارد. `none`، که پیش‌فرض است، هیچ بندی نمی‌نویسد، بنابراین پیش‌فرض خود پایگاه داده اعمال می‌شود. پنج مقدار دیگر نمایانگر `NO ACTION`، `CASCADE`، `SET NULL`، `SET DEFAULT` و `RESTRICT` هستند. طرح‌واره SQL بند را فقط برای پایگاه داده‌ای می‌نویسد که کنش آن را بپذیرد.  
شکل ذخیره‌سازی همیشه هر دو را می‌نویسد و از نسخهٔ `4.0.0`، JSON Schema آن‌ها را الزامی می‌داند و فقط بررسی می‌کند که هر کدام عدد صحیح باشد. هنگام تجزیه، فیلد ناموجود، مانند آنچه در همهٔ سندهای ذخیره‌شده پیش از نسخهٔ `3.10.0` پیش می‌آید، همچنان `none` خوانده می‌شود و مقداری خارج از فهرست نیز همین‌طور.  
ویرایشگرهای پیش از نسخهٔ `3.10.0` این فیلدها را نمی‌شناسند و هنگام بارگذاری سند آن‌ها را کنار می‌گذارند، بنابراین ذخیره در آن‌ها همهٔ کنش‌ها را از بین می‌برد.

از نسخهٔ `4.0.0`، هر بارگذاری آنچه را شکل ذخیره‌سازی کنار می‌گذارد به دست می‌آورد. رابطه وقتی شناسا است که همهٔ ستون‌هایی که به آن‌ها ختم می‌شود کلید اصلی باشند، و `startRelationshipType` آن وقتی همهٔ این ستون‌ها NOT NULL باشند `dash` است و در غیر این صورت `ring`؛ رابطه‌ای که هیچ ستون انتهایی برایش نمانده غیرشناسا و `dash` است، همان‌طور که هر رابطهٔ جدید در آغاز چنین است. نقاط اتصال، یعنی `x`، `y` و `direction`، دوباره تعیین می‌شوند.

### مجموعه: indexEntities {#collection-indexentities}

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

هنگام تجزیه، اگر `seqIndexColumnIds` وجود نداشته باشد یا یکی از شناسه‌های فهرست‌شده را کم داشته باشد، مقدار اولیهٔ آن برابر `indexColumnIds` قرار داده می‌شود.

### مجموعه: indexColumnEntities {#collection-indexcolumnentities}

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

### مجموعه: memoEntities {#collection-memoentities}

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

از نسخهٔ `4.0.0`، جدول‌ها و یادداشت‌ها [در یک پشتهٔ مشترک قرار دارند](../../guide/guides/table-related-functions.md#moving-multiple-tables) که بر اساس `zIndex` مرتب است، بنابراین آوردن یک جدول به جلو می‌تواند آن را روی یک یادداشت قرار دهد. هنگام تجزیه، یادداشتی که بدون `zIndex` ذخیره شده بالاتر از همهٔ جدول‌ها قرار می‌گیرد، همان‌طور که در [Doc](#doc) توضیح داده شده است. یادداشتی که در فایلی ذخیره‌شده پیش از نسخهٔ `4.0.0` است `zIndex` ذخیره‌شدهٔ خود را نگه می‌دارد که از همان شمارندهٔ جدول‌ها آمده است، بنابراین یادداشتی که نسخه‌ای قدیمی‌تر روی همهٔ جدول‌ها رسم کرده بود ممکن است زیر جدولی باز شود که پس از آن به جلو آورده شده است.

### مجموعه: tableGroupEntities {#collection-tablegroupentities}

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

از نسخهٔ `4.0.0`، سند می‌تواند [گروه‌های جدول](../../guide/guides/table-groups.md) داشته باشد: مستطیل‌های نام‌دار و رنگی که پشت جدول‌ها رسم می‌شوند. هر جدول از طریق `groupId` خودش به یک گروه می‌پیوندد، بنابراین گروه فهرستی از اعضا ندارد. شکل ذخیره‌سازی این مجموعه را، مانند `doc.tableGroupIds`، فقط تا وقتی گروهی وجود دارد می‌نویسد، و سندی که آن را ندارد، مانند سندی که پیش از نسخهٔ `4.0.0` ذخیره شده، هیچ گروهی ندارد. `Show.hideTableGroup` آن‌ها را پنهان می‌کند.  
ویرایشگرهای پیش از نسخهٔ `4.0.0` هنگام بارگذاری سند گروه‌ها و `groupId` همهٔ جدول‌ها را کنار می‌گذارند، بنابراین ذخیره در آن‌ها همهٔ گروه‌ها را از بین می‌برد.

## JSON Schema {#json-schema}

فایل طرح‌وارهٔ مرجع در [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json) منتشر شده است و می‌توان مستقیماً با `$schema` به آن ارجاع داد.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

`$schema` را در بالای فایل `.erd.json` قرار دهید تا ویرایشگرهایی که JSON Schema را می‌فهمند، مانند VS Code، هنگام ویرایش سند را اعتبارسنجی کنند و فیلدهایش را تکمیل خودکار کنند.

از نسخهٔ `4.0.0`، این طرح‌واره فقط شکل ذخیره‌سازی را توصیف می‌کند. هر شیء با فیلدهای نام‌دار بسته است (`additionalProperties: false`)، هر فیلدی که شکل ذخیره‌سازی همیشه می‌نویسد الزامی است و هیچ‌یک از فیلدهایی که کنار می‌گذارد در آن نام برده نشده است. بنابراین مقدار زمان اجرا را رد می‌کند. همچنین فایلی را که پیش از نسخهٔ `4.0.0` ذخیره شده، با `meta`، عرض‌ها، `zIndex`، `ignoreSaveSettings` و بقیهٔ فیلدهایش، رد می‌کند تا وقتی که ویرایشگری با نسخهٔ `4.0.0` یا بالاتر آن فایل را دوباره ذخیره کند. فایلی که نسخهٔ `3.2.0` یا بالاتر ذخیره کرده از قبل نشانی این طرح‌واره را در خود دارد که به شاخهٔ `main` اشاره می‌کند، بنابراین ویرایشگری که بر اساس آن اعتبارسنجی می‌کند اکنون آن فایل را دارای خطا نشان می‌دهد. فایلی که نسخهٔ `3.0.0` یا `3.1.0` ذخیره کرده، یا یک سند v2، فیلد `$schema` ندارد.

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
