---
sidebar_position: 3
description: تنسيق المستند .erd.json — صيغة التخزين التي يحملها الملف وقيمة وقت التشغيل التي يحملها المحرر، وأنواع TypeScript، والثوابت التي تقابل كل حقل رقمي، وJSON Schema المنشور.
---

# المخطط

`.erd.json` هو تنسيق مستندات المحرر. اقرأ هذه الصفحة إذا كنت تحتاج إلى إنشاء مستند أو التحقق من صحته أو ترحيله خارج المحرر.

منذ الإصدار `4.0.0`، يُحوَّل المستند إلى سلسلة بصيغتين، تحمل كلتاهما القيمة `'3.0.0'` في `version`. صيغة التخزين هي ما يحمله الملف: فهي ما تُرجعه الخاصية [`editor.value`](../erd-editor-element.md#value)، وما يكتبه تصدير JSON، والصيغة الوحيدة التي يقبلها [JSON Schema](#json-schema) المنشور. أما قيمة وقت التشغيل فهي المستند كاملًا كما يحمله المحرر، وتُرجعها الخاصية [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). تقرأ `setInitialValue()` وsetter الخاصية `value` و`setSchemaJSON()` أيًّا من الصيغتين، وأي ملف حفظه إصدار سابق، ومستند `.vuerd` من v2. قبل الإصدار `4.0.0` لم تكن هناك إلا صيغة واحدة: كانت الخاصية `value` تُرجع المستند كاملًا كما يحمله المحرر، كما تفعل الخاصية `runtimeValue` الآن.

## صيغة التخزين وقيمة وقت التشغيل {#storage-form-and-runtime-value}

تحمل صيغة التخزين الكيانات القائمة وحدها: كل جدول مدرج في `doc.tableIds`، والأعمدة التي تدرجها تلك الجداول، والعلاقات بين جدولين محتفَظ بهما، وفهارس الجداول المحتفَظ بها مع أعمدة الفهارس التي لا يزال الجدول يدرج عمودها، والملاحظات ومجموعات الجداول المدرجة. وتستبعد ما يشتقه المحرر عند التحميل أو يحتفظ به ما دام مفتوحًا: الكيانات المُزالة، و`seqColumnIds` و`seqIndexColumnIds`، وكل `zIndex`، وقيم العرض المقيسة، والحقل `ui` في العمود، و`identification` و`startRelationshipType` ونقاط الارتكاز في العلاقة. وتضع الأنواع أدناه على كل حقل من هذه الحقول التعليق `// runtime only`.  
مفاتيح كل مجموعة كيانات هي المعرّفات مرتبةً بترتيب وحدات الترميز، مع تجميع الأعمدة حسب `tableId` وأعمدة الفهارس حسب `indexId` أولًا. ويكتب كل كيان حقوله بترتيب ثابت، ويُزاح النص بمسافتين وينتهي بحرف سطر جديد. لذا يُكتب المستند نفسه دائمًا بالبايتات نفسها، ولا يغيّر التعديل إلا ما يمسّه، ويُعاد فتح الملف المحفوظ على جهاز ذي خطوط أخرى على قيمة `value` نفسها.  
لا يكتب VS Code وObsidian ومكوّن JetBrains الإضافي ملفًا إلا عندما يغيّر تعديلٌ قيمة `value`، لذا يحتفظ الملف الذي حفظه إصدار سابق بصيغته القديمة حتى أول تعديل عليه.

تحتفظ قيمة وقت التشغيل بما تستبعده صيغة التخزين: الكيانات المُزالة والتسلسلات وقيم z-index وقيم العرض وعلامات المفاتيح وعلامات العلاقات ونقاط الارتكاز. وتُزاح بمسافتين دون حرف سطر جديد في نهايتها. استخدمها فقط لتهيئة متعاون أو عرض ثانٍ عبر `setInitialValue()`، حتى يعيد التراجع عن إزالةٍ يرسلها محرر آخر الكيانَ كاملًا هناك. لا تكتبها في ملف أبدًا؛ إذ يرفضها JSON Schema. لم يعد هناك ما يجمع الكيانات المُزالة، لذا تحتفظ بها قيمة وقت التشغيل حتى يُفتح المستند من ملفه في المرة التالية.

تكتب كلتا الصيغتين كل إعداد مقفل بقيمته المقفلة (راجع الحقل [`lockSettings`](#settings))، و`settings.ddlScripts` فقط ما دام أحد السكربتين يحمل نصًا، و`groupId` الخاص بالجدول فقط ما دام غير فارغ. تكتب صيغة التخزين `doc.tableGroupIds` و`tableGroupEntities` فقط ما دامت هناك مجموعة جداول؛ أما قيمة وقت التشغيل فتكتبهما ما دام المستند يحمل مجموعة أو مجموعة مُزالة.

## TypeScript {#typescript}

تصف الأنواع قيمة وقت التشغيل. يُستبعد الحقل الذي يحمل التعليق `// runtime only` من صيغة التخزين، ولا يُكتب الحقل الذي يحمل العلامة `?` إلا ما دام يحمل شيئًا.

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

مفتاح كل كيان هو `id` الخاص به، وهو سلسلة نصية مبهمة؛ ويُسقط التحليل أي كيان يكون `id` فيه مفقودًا أو فارغًا. منذ الإصدار `4.0.0`، كل معرّف جديد هو UUIDv7 مكتوب بصيغة Uuid25، أي 25 رقمًا بأحرف صغيرة في نظام العدّ ذي الأساس 36، مثل `03gzrxjv20bdlcak89q25d2m7`، لذا تُرتَّب المعرّفات التي يُنشئها محرر واحد بالترتيب الذي أنشأها به. يحتفظ المستند بالمعرّفات التي يحملها، مثل معرّفات nanoid من إصدار سابق أو معرّفات ملف v2، لذا لا ينبغي لأي شيء أن يعتمد على شكل المعرّف.

منذ الإصدار `4.0.0`، لا يحمل أي كيان الكائن `meta` (`createAt`، `updateAt`)، وأُزيل النوعان `EntityMeta` و`EntityType`. لا شيء يكتبه، ويُسقط التحليل الكائن `meta` الذي يحمله ملف أقدم، ويرفضه JSON Schema. كان دوره يقتصر على تحديد توقيت جمع البيانات المهملة للكيانات المُزالة، وقد أُزيل جمع البيانات المهملة هو أيضًا.

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

يمثل `originX` و`originY` العرض: نقطة الشاشة التي تقع عليها النقطة `(0, 0)` من المشهد.  
تتراوح قيمة `zoomLevel` من `0.1` إلى `1.5`. ويُفتح المستند المحفوظ بقيمة تتجاوز `1` بالقيمة `1` في محرر أقدم من الإصدار `3.5.0`.  
منذ الإصدار `4.0.0`، لا تحمل الإعدادات `width` ولا `height` ولا `scrollTop` ولا `scrollLeft` ولا `relationshipOptimization` ولا `ignoreSaveSettings`. لا شيء يكتبها، ولا يحتفظ المحلل بأي منها، ويرفض JSON Schema أي ملف لا يزال يحتوي عليها.

يمثل `canvasType` علامة التبويب التي يُفتح عليها المستند. يحمل المستند المحفوظ في علامة تبويب التصور المرئي القيمة `'@dineug/erd-editor/builtin-visualization'` دون أن يحمل ما إذا كان المعروض وضع `Graph` أم وضع `Flow`، ويعرض المحرر المُنشأ حديثًا علامة التبويب هذه في وضع `Graph`.  
منذ الإصدار `4.0.0`، ما دام قفل `Canvas Type` مفعّلًا، كما هو الحال في المستند الجديد، يحتفظ المستند بعلامة التبويب التي كانت معروضة عند قفله، ويترك التبديل بين علامات التبويب قيمة `value` على حالها. ويحفظ القفل المُفعَّل في علامة تبويب الإعدادات علامةَ التبويب التي جاء منها القارئ، وتُفتح القيمة المقفلة `'settings'`، التي لا يكتبها إلا التحرير اليدوي، على `'ERD'`.  
لا يُحوَّل أي جزء من حالة وضع `Flow` الخاصة إلى سلسلة — إذ تبقى مواضع عناصره ومستوى التكبير وتحريك العرض وعرض الصفوف والجداول المركَّز عليها في المحرر — لذا يصف `originX` و`originY` و`zoomLevel` دائمًا لوحة رسم ERD.

يمثل كل من `show` و`lockSettings` قناع بتات — اجمع العلامات بعملية OR.  
يمثل `columnOrder` مصفوفة تحمل جميع قيم `ColumnType` السبع، بترتيب العرض.  
يحمل كل من `database` و`language` و`tableNameCase` و`columnNameCase` و`bracketType` قيمة واحدة بالضبط، ويرفض JSON Schema القيمة المركّبة.

قيمة `show` في المستند الجديد هي `431`: `tableComment` و`columnComment` و`columnDataType` و`columnDefault` و`columnPrimaryKey` و`columnNotNull` و`relationship`.  
منذ الإصدار `3.10.0`، توجد علامتان إضافيتان في `show`، كلتاهما معطّلة في المستند الجديد وفي كل مستند حُفظ قبل الإصدار `3.10.0`.  
العلامة `columnAlternateKey` (`512`) هي خيار العرض [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). عند تعيينها، تُعلِّم أعمدة كل فهرس فريد يضم عمودين أو أكثر بالعلامات `AK1.1` و`AK1.2` وهكذا. وتبدأ معطّلة، فلا يتغير عرض أي مخطط موجود.  
تعمل العلامة `hideReferentialAction` (`1024`) بالعكس: عند تعيينها، تُخفي [تسميات ON DELETE وON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) على خطوط الربط، لذا تظهر هذه التسميات افتراضيًا. ويكون خيار العرض `Referential Actions` محددًا ما دامت العلامة معطّلة. ولا تغيّر حجم أي جدول.  
يحتفظ المحرر الأقدم من الإصدار `3.10.0` بقيمة `show` عددًا صحيحًا كاملًا، لذا تبقى العلامتان بعد الحفظ فيه.

منذ الإصدار `4.0.0`، توجد علامتان إضافيتان في `show`، كلتاهما معطّلة في المستند الجديد وفي كل مستند حُفظ قبل الإصدار `4.0.0`. ومثل `hideReferentialAction`، تُخفي كل منهما ما تسمّيه، لذا تظهر مجموعات الجداول والملاحظات افتراضيًا.  
تُخفي العلامة `hideTableGroup` (`2048`) [مجموعات الجداول](../../guide/guides/table-groups.md)، وتُخفي العلامة `hideMemo` (`4096`) كل ملاحظة. وهما [خيارا العرض](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` و`Memos`، وكل منهما محدد ما دامت علامته معطّلة. ولا تغيّر أي منهما حجم أي جدول.  
يحتفظ المحرر الأقدم من الإصدار `4.0.0` بقيمة `show` عددًا صحيحًا كاملًا، لذا تبقى العلامتان بعد الحفظ فيه.

منذ الإصدار `4.0.0`، يضم `Language` ثمانية أهداف إضافية في [منشئ التعليمات البرمجية](../../guide/guides/code-generator.md)، من `Mermaid` إلى `JSONSchema`. وتُقرأ أي قيمة `language` لا يعرفها المحلل على أنها `GraphQL`، لذا يفتح المحرر الأقدم من الإصدار `4.0.0` المستند المحفوظ بأحد هذه الأهداف على GraphQL، ويكتب الحفظ فيه GraphQL.

منذ الإصدار `4.0.0`، يحل `lockSettings` محل `ignoreSaveSettings`، ويحل `LockSettingType` محل `SaveSettingType` الذي أُزيل. يحدد `lockSettings` الإعدادات التي يحفظها المستند كما كانت عند قفلها. ويشمل `viewport` الحقول `originX` و`originY` و`zoomLevel` معًا، إذ إن نقطة الأصل المحفوظة دون مستوى تكبيرها تُفتح في مكان آخر، ويشمل كل بت آخر الحقل الذي يحمل البت اسمه. وهذه هي صفوف [`Lock`](../../guide/guides/settings.md#lock) في علامة تبويب الإعدادات.  
يُكتب الإعداد المقفل بقيمته المقفلة، أيًّا كان ما يعرضه المحرر، في الخاصيتين `value` و`runtimeValue` على السواء، ويُكتب كل إعداد آخر كما هو. لذا ما دام القفل المقابل مفعّلًا، فإن التمرير وتغيير مستوى التكبير، أو التبديل بين علامات التبويب، أو تغيير لغة منشئ التعليمات البرمجية أو أحد أنماط التسمية أو نوع علامات الاقتباس، يترك الملف على حاله. يأخذ القفل القيمة التي يحملها الإعداد في تلك اللحظة، ويأخذ التحليل القيمة المقفلة من الحقل المحفوظ.  
المستند الذي يبدأ من لا شيء — محرر جديد أو مخزن نسخ متماثل جديد، أو قيمة فارغة تُمرَّر إلى `value` أو `setInitialValue()` — تكون فيه قيمة `lockSettings` هي `63`، أي أن كل الأقفال مفعّلة. والمستند الذي لا تحمل `settings` فيه `lockSettings` — كل ملف حُفظ قبل الإصدار `4.0.0`، أيًّا كانت قيمة `ignoreSaveSettings` فيه، وكل مستند v2 — يُفتح هو أيضًا وكل الأقفال مفعّلة: عرضه وعلامة تبويبه حيث يكونان في المستند الجديد (`originX` و`originY` بالقيمة `0`، و`zoomLevel` بالقيمة `1`، وعلامة تبويب ERD)، ولغته وأنماط التسمية ونوع علامات الاقتباس مقفلة على ما حفظه. والمستند الذي يسمّي أقفاله يحتفظ بها، بما فيها `0`، وبكل قيمة حفظها.  
يحتفظ التحليل بكل بتات `lockSettings`، حتى غير المعروفة منها، لذا يبقى القفل الذي يضيفه إصدار لاحق بعد الحفظ هنا؛ ولا يتحقق JSON Schema إلا من كونه عددًا صحيحًا. أما المحرر الأقدم من الإصدار `4.0.0` فيُسقط `lockSettings` عند الحفظ ويكتب العرض وعلامة التبويب كما هما، لذا يُفتح الملف هنا مجددًا كأنه ملف حُفظ قبل الإصدار `4.0.0`.

منذ الإصدار `4.0.0`، يحمل `ddlScripts` السكربتين الخاصين بعلامة تبويب [مخطط SQL](../../guide/guides/schema-sql.md)، وتكتبهما DDL لأي قاعدة بيانات: `before` بعد الترويسة وقبل الجداول، و`after` بعد DDL المُنشأة. تكتب DDL كل سكربت بفواصل أسطر LF، دون الأسطر الفارغة في بدايته والمسافات البيضاء في نهايته، وتختمه على MSSQL بالكلمة `GO`، كما يوضّح قسم [السكربتات قبل الجداول وبعدها](../../guide/guides/schema-sql.md#before-and-after-scripts)؛ أما `ddlScripts` نفسه فيحتفظ بكل سكربت كما كُتب. لا يُكتب المفتاح إلا ما دام أحد السكربتين يحمل نصًا، وعندئذ يُكتب حاملًا كليهما؛ والمفتاح المفقود، أو السكربت الذي ليس سلسلة نصية، يُقرأ على أنه `''`. ولا تُحفظ خيارات `Statements` و`Header` و`Tables` الخاصة بعلامة التبويب في المستند.  
يُسقط المحرر الأقدم من الإصدار `4.0.0` السكربتات عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدانها.

لا تقبل الثوابت `Database` و`Language` و`Show` و`LockSettingType` و`ReferentialAction` إلا الإضافة في نهايتها. يخزّن المستند المحفوظ العدد، لذا يأخذ أي نظام قاعدة بيانات أو هدف إنشاء تعليمات برمجية أو علامة أو قفل أو إجراء جديد البت التالي بدلًا من خانة في المنتصف.

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

تمثل كل قائمة ترتيب نوع واحد من الكيانات، وهو الترتيب الذي تقرؤه DDL وفرز الجداول وترتيب الرسم. في صيغة التخزين، لا تحمل كل قائمة إلا معرّفات الكيانات المحتفَظ بها، يرد كلٌّ منها مرة واحدة، بالترتيب المدرج. منذ الإصدار `4.0.0`، يمثل `tableGroupIds` ترتيب مجموعات الجداول.

منذ الإصدار `4.0.0`، لا يُحفظ ترتيب التراص. يضع التحليل في ترتيب التراص كل جدول وملاحظة ومجموعة جداول مدرجة لا تحمل `zIndex` حسب موضعها في قائمتها، والمتأخر منها في المقدمة: مجموعات الجداول بدءًا من `1`، والجداول بدءًا من `2`، والملاحظات فوق كل جدول. أما الكيان الذي يحمل `zIndex`، كما في قيمة وقت التشغيل أو في ملف حُفظ قبل الإصدار `4.0.0`، فيحتفظ به. لذا يضيع إحضار جدول أو ملاحظة إلى المقدمة عند إعادة فتح الملف.

### Collection: tableEntities {#collection-tableentities}

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

منذ الإصدار `4.0.0`، يحمل الجدول `groupId`، وهو معرّف [مجموعة الجداول](../../guide/guides/table-groups.md) التي ينتمي إليها. ويعني `groupId` المفقود أو الفارغ، أو الذي لا يسمّي أي مجموعة في `doc.tableGroupIds`، عدم وجود مجموعة، ولا تكتبه صيغة التخزين إلا ما دام يسمّي مجموعة محتفَظًا بها.  
يضبط التحليل `seqColumnIds` على `columnIds` عندما يكون مفقودًا أو ينقصه معرّف مدرج، ويقيس المحرر `widthName` و`widthComment` من جديد بخطوطه الخاصة عند كل تحميل.

### Collection: tableColumnEntities {#collection-tablecolumnentities}

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

منذ الإصدار `4.0.0`، لا تكتب صيغة التخزين الحقل `ui` في العمود. فكل تحميل يشتق `keys`، أي علامة المفتاح الأساسي من البت `primaryKey` في `options` وعلامة المفتاح الخارجي من العلاقات التي تنتهي عند العمود، ويقيس قيم العرض الأربع.  
يعرض المحرر الأقدم من الإصدار `4.0.0` أعمدة الملف المحفوظ هنا دون أيقونات المفتاح الأساسي.

### Collection: relationshipEntities {#collection-relationshipentities}

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

منذ الإصدار `3.10.0`، تحمل العلاقة `onDelete` و`onUpdate`، أي [إجراءات ON DELETE وON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) الخاصة بها. يحمل كل منهما قيمة `ReferentialAction` واحدة بالضبط. والقيمة `none`، وهي الافتراضية، لا تكتب أي بند، فيسري السلوك الافتراضي لقاعدة البيانات نفسها. وتمثل القيم الخمس الأخرى `NO ACTION` و`CASCADE` و`SET NULL` و`SET DEFAULT` و`RESTRICT`. ولا يكتب مخطط SQL بندًا إلا لقاعدة بيانات تقبل إجراءه.  
تكتب صيغة التخزين كليهما دائمًا، ومنذ الإصدار `4.0.0` يشترطهما JSON Schema، ولا يتحقق إلا من أن كلًّا منهما عدد صحيح. ولا يزال التحليل يقرأ الحقل المفقود، كما في كل مستند حُفظ قبل الإصدار `3.10.0`، على أنه `none`، وكذلك القيمة الواقعة خارج القائمة.  
لا يعرف المحرر الأقدم من الإصدار `3.10.0` هذين الحقلين ويُسقطهما عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدان كل الإجراءات.

منذ الإصدار `4.0.0`، يشتق كل تحميل ما تستبعده صيغة التخزين. تكون العلاقة مُعرِّفة عندما يكون كل عمود تنتهي عنده مفتاحًا أساسيًا، ويكون `startRelationshipType` الخاص بها `dash` عندما يكون كل عمود من هذه الأعمدة NOT NULL، و`ring` في غير ذلك؛ والعلاقة التي لم يبقَ أي عمود تنتهي عنده تكون غير مُعرِّفة و`dash`، كما تبدأ العلاقة الجديدة. ويُعاد وضع نقاط الارتكاز، `x` و`y` و`direction`.

### Collection: indexEntities {#collection-indexentities}

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

يضبط التحليل `seqIndexColumnIds` على `indexColumnIds` عندما يكون مفقودًا أو ينقصه معرّف مدرج.

### Collection: indexColumnEntities {#collection-indexcolumnentities}

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

### Collection: memoEntities {#collection-memoentities}

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

منذ الإصدار `4.0.0`، تقع الجداول والملاحظات في [ترتيب تراص واحد مشترك](../../guide/guides/table-related-functions.md#moving-multiple-tables) يُرتَّب حسب `zIndex`، لذا قد يضع إحضار جدول إلى المقدمة ذلك الجدول فوق ملاحظة. يضع التحليل الملاحظة المحفوظة دون `zIndex` فوق كل جدول، كما يوضّح قسم [Doc](#doc). أما الملاحظة في ملف حُفظ قبل الإصدار `4.0.0` فتحتفظ بقيمة `zIndex` التي حفظتها، وقد جاءت من العدّاد نفسه الذي جاءت منه قيم الجداول، لذا قد تُفتح الملاحظة التي رسمها إصدار سابق فوق كل الجداول تحت جدول أُحضر إلى المقدمة بعدها.

### Collection: tableGroupEntities {#collection-tablegroupentities}

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

منذ الإصدار `4.0.0`، يمكن أن يحمل المستند [مجموعات الجداول](../../guide/guides/table-groups.md): مستطيلات مسماة وملونة تُرسم خلف الجداول. ينضم الجدول إلى مجموعة عبر `groupId` الخاص به، لذا لا تحمل المجموعة قائمة بأعضائها. تكتب صيغة التخزين مجموعة الكيانات هذه، مثل `doc.tableGroupIds`، فقط ما دامت هناك مجموعة جداول، والمستند الذي يخلو منها، مثل المستند المحفوظ قبل الإصدار `4.0.0`، لا يحتوي على مجموعات. ويُخفيها `Show.hideTableGroup`.  
يُسقط المحرر الأقدم من الإصدار `4.0.0` المجموعات و`groupId` في كل جدول عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدان كل المجموعات.

## JSON Schema {#json-schema}

يُنشر ملف المخطط المعتمد في [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)، ويمكن الإشارة إليه مباشرةً عبر `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

ضع `$schema` في أعلى ملف `.erd.json`، فتتحقق المحررات التي تفهم JSON Schema، مثل VS Code، من صحة المستند وتكمل حقوله تلقائيًا أثناء تحريرك.

منذ الإصدار `4.0.0`، يصف المخطط صيغة التخزين وحدها. فكل كائن ذي حقول مسماة مغلق (`additionalProperties: false`)، وكل حقل تكتبه صيغة التخزين دائمًا مطلوب، ولا يُسمّى أي حقل تستبعده. لذا يرفض قيمة وقت التشغيل. ويرفض أيضًا الملف المحفوظ قبل الإصدار `4.0.0`، بما فيه من `meta` وقيم العرض و`zIndex` و`ignoreSaveSettings` وما إلى ذلك، حتى يحفظ ذلك الملفَ من جديد محررٌ من الإصدار `4.0.0` أو أحدث. والملف الذي حفظه الإصدار `3.2.0` أو أحدث يسمّي بالفعل عنوان URL لهذا المخطط، الذي يشير إلى الفرع `main`، لذا يُبلغ المحرر الذي يتحقق من الصحة وفقًا له عن خطأ في الملف الآن. أما الملف الذي حفظه الإصدار `3.0.0` أو `3.1.0`، أو مستند v2، فلا يسمّي أي `$schema`.

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
