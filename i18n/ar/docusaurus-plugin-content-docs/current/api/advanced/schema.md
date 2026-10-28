---
sidebar_position: 3
description: تنسيق المستند .erd.json — صيغة التخزين التي يحملها الملف وقيمة وقت التشغيل التي يحملها المحرر، وأنواع TypeScript، والثوابت التي تقابل كل حقل رقمي، وJSON Schema المنشور.
---

# المخطط

`.erd.json` هو تنسيق مستندات المحرر. اقرأ هذه الصفحة إذا كنت تحتاج إلى إنشاء مستند أو التحقق من صحته أو ترحيله خارج المحرر.

منذ الإصدار `4.0.0`، يُحوَّل المستند إلى سلسلة بصيغتين، تحمل كلتاهما القيمة `'3.0.0'` في `version`. صيغة التخزين هي ما يحمله الملف: فهي ما تُرجعه الخاصية [`editor.value`](../erd-editor-element.md#value)، وما يكتبه تصدير JSON، والصيغة الوحيدة التي يقبلها [JSON Schema](#json-schema) المنشور. أما قيمة وقت التشغيل فهي المستند كاملًا كما يحمله المحرر، وتُرجعها الخاصية [`editor.runtimeValue`](../erd-editor-element.md#runtimevalue). تقرأ `setInitialValue()` وsetter الخاصية `value` و`setSchemaJSON()` أيًّا من الصيغتين، وأي ملف حفظه إصدار سابق، ومستند `.vuerd` من v2. قبل الإصدار `4.0.0` لم تكن هناك إلا صيغة واحدة: كانت الخاصية `value` تُرجع المستند كاملًا كما يحمله المحرر، كما تفعل الخاصية `runtimeValue` الآن.

## صيغة التخزين وقيمة وقت التشغيل {#storage-form-and-runtime-value}

تحمل صيغة التخزين الكيانات القائمة وحدها: كل جدول مدرج في `doc.tableIds`، والأعمدة التي تدرجها تلك الجداول، والعلاقات بين جدولين محتفَظ بهما، وفهارس الجداول المحتفَظ بها مع أعمدة الفهارس التي لا يزال الجدول يدرج عمودها، والملاحظات ومجموعات الجداول المدرجة، ومنذ الإصدار `4.2.0` الكلمات والمصطلحات والمجالات المدرجة التي تحمل قيمة بعد معرّفها. وتستبعد ما يشتقه المحرر عند التحميل أو يحتفظ به ما دام مفتوحًا: الكيانات المُزالة، و`seqColumnIds` و`seqIndexColumnIds`، وكل `zIndex`، وقيم العرض المقيسة، والحقل `ui` في العمود، و`identification` و`startRelationshipType` ونقاط الارتكاز في العلاقة، ومنذ الإصدار `4.2.0` الحقل `order` في كل صف من صفوف القواميس والقوائم `doc.wordIds` و`doc.termIds` و`doc.domainIds`. وتضع الأنواع أدناه على كل حقل من هذه الحقول التعليق `// runtime only`.  
مفاتيح كل مجموعة كيانات، عدا القواميس، هي المعرّفات مرتبةً بترتيب وحدات الترميز، مع تجميع الأعمدة حسب `tableId` وأعمدة الفهارس حسب `indexId` أولًا. ومنذ الإصدار `4.2.0` تأتي `wordEntities` و`termEntities` و`domainEntities` بعد كل مجموعات الكيانات الأخرى، بهذا الترتيب، ويُكتب كلٌّ منها على هيئة رأس وصفوف، صف واحد في كل سطر (راجع [صفوف القواميس](#dictionary-rows)). ويكتب كل كيان حقوله بترتيب ثابت، ويُزاح النص بمسافتين وينتهي بحرف سطر جديد. لذا يُكتب المستند نفسه دائمًا بالبايتات نفسها، ولا يغيّر التعديل إلا ما يمسّه، ويُعاد فتح الملف المحفوظ على جهاز ذي خطوط أخرى على قيمة `value` نفسها.  
لا يكتب VS Code وObsidian ومكوّن JetBrains الإضافي ملفًا إلا عندما يغيّر تعديلٌ قيمة `value`، لذا يحتفظ الملف الذي حفظه إصدار سابق بصيغته القديمة حتى أول تعديل عليه.

منذ الإصدار `4.2.0`، تستبعد صيغة التخزين أيضًا ما لا يحمل شيئًا: كل حقل نصي يحمله كيان أو الحقل `ui` فيه بالقيمة `''` (الحقول `name` و`comment` و`ui.color` في الجدول، و`name` و`comment` و`dataType` و`default` في العمود، و`name` في الفهرس، و`value` و`ui.color` في الملاحظة، و`name` و`color` في مجموعة الجداول)، وكل قائمة في `doc` وكل مجموعة كيانات لا تحمل أي إدخال، و`collections` نفسه متى أصبحت كل مجموعات الكيانات فارغة. ويُكتب النص الذي لا يحوي إلا مسافات كما هو، باستثناء الاسم المنطقي، الذي يُستبعد عندئذ، والكلمة أو المصطلح أو المجال الذي تكون كل قيمه بعد معرّفه فارغة أو لا تحوي إلا مسافات، فيُستبعد كاملًا. ولا يزال يُكتب كل معرّف، وكل قائمة داخل كيان، وكل عدد، بما في ذلك `0`. ويُكتب `doc` دائمًا، لذا يحمل ملف المستند الجديد `$schema` و`version` وإعداداته و`"doc": {}`.  
يقرأ التحليل الحقل النصي المفقود على أنه `''` ومجموعة الكيانات المفقودة على أنها فارغة، كما يفعل كل إصدار من v3، ولا تستبعد صيغة التخزين قائمة من `doc` إلا ما دامت مجموعة كياناتها لا تحمل شيئًا (راجع [Doc](#doc)). لذا يفتح المحرر الأقدم من الإصدار `4.2.0` هذه الملفات أيضًا، وعلى البرنامج الذي يقرأ الملف بنفسه أن يقرأ المفقود بالطريقة نفسها. والملف الذي حفظه إصدار سابق يعود من حفظه التالي وقد استُبعدت منه النصوص والقوائم ومجموعات الكيانات الفارغة، وهو تغيير يحدث مرة واحدة، ثم يُحفظ بايتًا ببايت منذ ذلك الحين.

تحتفظ قيمة وقت التشغيل بما تستبعده صيغة التخزين: الكيانات المُزالة والتسلسلات وقيم z-index وقيم العرض وعلامات المفاتيح وعلامات العلاقات ونقاط الارتكاز والحقول النصية الفارغة، والقوائم الأربع `tableIds` و`relationshipIds` و`indexIds` و`memoIds` ومجموعات الكيانات الست من `tableEntities` إلى `memoEntities` حتى وهي فارغة. ومنذ الإصدار `4.2.0` تحتفظ أيضًا بالكلمات والمصطلحات والمجالات المُزالة، والصفوف التي لا تحمل شيئًا، والحقل `order` في كل صف، وقوائم القواميس الثلاث، والاسم المنطقي الذي لا يحوي إلا مسافات، والربط بمجال مُزال. وتُزاح بمسافتين دون حرف سطر جديد في نهايتها. استخدمها فقط لتهيئة متعاون أو عرض ثانٍ عبر `setInitialValue()`، حتى يعيد التراجع عن إزالةٍ يرسلها محرر آخر الكيانَ كاملًا هناك. لا تكتبها في ملف أبدًا؛ إذ يرفضها JSON Schema. لم يعد هناك ما يجمع الكيانات المُزالة، لذا تحتفظ بها قيمة وقت التشغيل حتى يُفتح المستند من ملفه في المرة التالية.

تكتب كلتا الصيغتين كل إعداد مقفل بقيمته المقفلة (راجع الحقل [`lockSettings`](#settings))، و`settings.ddlScripts` فقط ما دام أحد السكربتين يحمل نصًا، و`groupId` الخاص بالجدول فقط ما دام غير فارغ. ومنذ الإصدار `4.2.0` تكتب كلتاهما أيضًا `settings.nameViewMode` فقط ما دامت القيمة التي تكتبانها ليست `'physical'`، و`settings.columnOrder` في سبعة إدخالات حيثما أمكن (راجع [Settings](#settings))، و`nameDerived` الخاص بالجدول فقط ما دام `true`.  
تكتب صيغة التخزين `doc.tableGroupIds` و`tableGroupEntities` فقط ما دامت هناك مجموعة جداول، و`logicalName` فقط ما دام يحمل نصًا غير المسافات، و`domainId` الخاص بالعمود فقط ما دام يسمّي مجالًا يكتبه الملف، وكل قاموس فقط ما دام يحمل صفًا يكتبه الملف. أما قيمة وقت التشغيل فتكتب حقلي مجموعات الجداول ما دام المستند يحمل مجموعة أو مجموعة مُزالة، و`logicalName` و`domainId` ما داما ليسا `''`، وكل قاموس مع قائمته ما دام أيٌّ منهما يحمل إدخالًا، بما في ذلك الصف المُزال.

## TypeScript {#typescript}

تصف الأنواع قيمة وقت التشغيل. يُستبعد الحقل الذي يحمل التعليق `// runtime only` من صيغة التخزين، ولا يُكتب الحقل الذي يحمل العلامة `?` إلا ما دام يحمل شيئًا. أما النصوص والقوائم ومجموعات الكيانات الفارغة التي تستبعدها صيغة التخزين منذ الإصدار `4.2.0` فلا تحمل أي علامة.

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

لكل كيان `id`، وهو سلسلة نصية مبهمة تُستخدم مفتاحًا له في مجموعة كياناته، إلا في القواميس الثلاثة، حيث يكون أول قيمة في الصف. ومنذ الإصدار `4.2.0`، إذا كان `id` في كيان من مجموعات الكيانات السبع ذات المفاتيح مفقودًا أو فارغًا أو ليس سلسلة نصية، يقرأ التحليل معرّفه من المفتاح الذي يُحفظ تحته، ويُسقط الإدخال الذي ليس كائنًا، أو الذي لا معرّف له ومفتاحه `''`. ويُسقَط صف القاموس إذا لم يكن مصفوفة أو لم يكن `id` فيه سلسلة نصية غير `''`. أما المحرر الأقدم من الإصدار `4.2.0` فيُسقط الكيان الذي يكون `id` فيه مفقودًا أو فارغًا، لذا لا تزال صيغة التخزين تكتب كل معرّف.  
منذ الإصدار `4.0.0`، كل معرّف جديد، بما في ذلك معرّف صف القاموس، هو UUIDv7 مكتوب بصيغة Uuid25، أي 25 رقمًا بأحرف صغيرة في نظام العدّ ذي الأساس 36، مثل `03gzrxjv20bdlcak89q25d2m7`، لذا تُرتَّب المعرّفات التي يُنشئها محرر واحد بالترتيب الذي أنشأها به. يحتفظ المستند بالمعرّفات التي يحملها، مثل معرّفات nanoid من إصدار سابق أو معرّفات ملف v2، لذا لا ينبغي لأي شيء أن يعتمد على شكل المعرّف.

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

يمثل `originX` و`originY` العرض: نقطة الشاشة التي تقع عليها النقطة `(0, 0)` من المشهد.  
تتراوح قيمة `zoomLevel` من `0.1` إلى `1.5`. ويُفتح المستند المحفوظ بقيمة تتجاوز `1` بالقيمة `1` في محرر أقدم من الإصدار `3.5.0`.  
منذ الإصدار `4.0.0`، لا تحمل الإعدادات `width` ولا `height` ولا `scrollTop` ولا `scrollLeft` ولا `relationshipOptimization` ولا `ignoreSaveSettings`. لا شيء يكتبها، ولا يحتفظ المحلل بأي منها، ويرفض JSON Schema أي ملف لا يزال يحتوي عليها.

يمثل `canvasType` علامة التبويب التي يُفتح عليها المستند. يحمل المستند المحفوظ في علامة تبويب التصور المرئي القيمة `'@dineug/erd-editor/builtin-visualization'` دون أن يحمل ما إذا كان المعروض وضع `Graph` أم وضع `Flow`، ويعرض المحرر المُنشأ حديثًا علامة التبويب هذه في وضع `Graph`.  
منذ الإصدار `4.0.0`، ما دام قفل `Canvas Type` مفعّلًا، كما هو الحال في المستند الجديد، يحتفظ المستند بعلامة التبويب التي كانت معروضة عند قفله، ويترك التبديل بين علامات التبويب قيمة `value` على حالها. ويحفظ القفل المُفعَّل في علامة تبويب الإعدادات علامةَ التبويب التي جاء منها القارئ، وتُفتح القيمة المقفلة `'settings'`، التي لا يكتبها إلا التحرير اليدوي، على `'ERD'`.  
منذ الإصدار `4.2.0`، يمكن أن تكون قيمة `canvasType` أيضًا `'@dineug/erd-editor/builtin-dictionary'`، أي علامة تبويب [القاموس](../../guide/guides/dictionary.md)، التي يحفظها قفل `Canvas Type` كما يحفظ غيرها. ويحتفظ المحرر الأقدم من الإصدار `4.2.0` بتلك القيمة لكنه لا يعرض أي علامة تبويب تحت شريط أدواته حتى يختار القارئ إحداها.  
لا يُحوَّل أي جزء من حالة وضع `Flow` الخاصة إلى سلسلة: إذ تبقى مواضع عناصره ومستوى التكبير وتحريك العرض وعرض الصفوف والجداول المركَّز عليها في المحرر، ومنذ الإصدار `4.2.0` تبقى فيه كذلك الخطوات التي ينتقل عبرها [`Previous table` و`Next table`](../../guide/guides/visualization.md#previous-table-and-next-table). لذا يصف `originX` و`originY` و`zoomLevel` دائمًا لوحة رسم ERD.

يمثل كل من `show` و`lockSettings` قناع بتات — اجمع العلامات بعملية OR.  
يمثل `columnOrder` مصفوفة تحمل كل قيمة من قيم `ColumnType` مرة واحدة، بترتيب العرض؛ ومنذ الإصدار `4.2.0` يمكن أن يكتبها المستند بسبع قيم من التسع، كما توضّح الفقرة الخاصة بترتيب الأعمدة أدناه.  
يحمل كل من `database` و`language` و`tableNameCase` و`columnNameCase` و`bracketType` قيمة واحدة بالضبط، ويرفض JSON Schema القيمة المركّبة.

قيمة `show` في المستند الجديد هي `431`: `tableComment` و`columnComment` و`columnDataType` و`columnDefault` و`columnPrimaryKey` و`columnNotNull` و`relationship`.  
منذ الإصدار `3.10.0`، توجد علامتان إضافيتان في `show`، كلتاهما معطّلة في المستند الجديد وفي كل مستند حُفظ قبل الإصدار `3.10.0`.  
العلامة `columnAlternateKey` (`512`) هي خيار العرض [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). عند تعيينها، تُعلِّم أعمدة كل فهرس فريد يضم عمودين أو أكثر بالعلامات `AK1.1` و`AK1.2` وهكذا. وتبدأ معطّلة، فلا يتغير عرض أي مخطط موجود.  
تعمل العلامة `hideReferentialAction` (`1024`) بالعكس: عند تعيينها، تُخفي [تسميات ON DELETE وON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) على خطوط الربط، لذا تظهر هذه التسميات افتراضيًا. ويكون خيار العرض `Referential Actions` محددًا ما دامت العلامة معطّلة. ولا تغيّر حجم أي جدول.  
يحتفظ المحرر الأقدم من الإصدار `3.10.0` بقيمة `show` عددًا صحيحًا كاملًا، لذا تبقى العلامتان بعد الحفظ فيه.

منذ الإصدار `4.0.0`، توجد علامتان إضافيتان في `show`، كلتاهما معطّلة في المستند الجديد وفي كل مستند حُفظ قبل الإصدار `4.0.0`. ومثل `hideReferentialAction`، تُخفي كل منهما ما تسمّيه، لذا تظهر مجموعات الجداول والملاحظات افتراضيًا.  
تُخفي العلامة `hideTableGroup` (`2048`) [مجموعات الجداول](../../guide/guides/table-groups.md)، وتُخفي العلامة `hideMemo` (`4096`) كل ملاحظة. وهما [خيارا العرض](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` و`Memos`، وكل منهما محدد ما دامت علامته معطّلة. ولا تغيّر أي منهما حجم أي جدول.  
يحتفظ المحرر الأقدم من الإصدار `4.0.0` بقيمة `show` عددًا صحيحًا كاملًا، لذا تبقى العلامتان بعد الحفظ فيه.

منذ الإصدار `4.2.0`، توجد علامة إضافية واحدة في `show`، هي `columnDomain` (`8192`)، وهي معطّلة في المستند الجديد وفي كل مستند حُفظ قبل الإصدار `4.2.0`، لذا تبقى قيمة `show` في المستند الجديد `431`. وهي [خيار العرض](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: عند تعيينها، يعرض كل صف عمود [خلية المجال](../../guide/guides/logical-names.md#the-domain-cell)، ما يوسّع الجداول. وتبدأ معطّلة، فلا يتغير عرض أي مخطط موجود.  
يحتفظ المحرر الأقدم من الإصدار `4.2.0` بقيمة `show` عددًا صحيحًا كاملًا، لذا تبقى العلامة بعد الحفظ فيه.

منذ الإصدار `4.2.0`، يضم `ColumnType` تسع قيم. تحدد `columnLogicalName` (`128`) موضع خلية الاسم المنطقي، التي لا يرسمها صف العمود إلا في العرض `Both Names`، وتحدد `columnDomain` (`256`) موضع خلية المجال. وهما الصفان `Logical Name` و`Domain` في [ترتيب الأعمدة](../../guide/guides/settings.md#adjusting-column-order) في علامة تبويب الإعدادات. ويحمل المحرر ترتيبًا يضم القيم التسع كلها، وترتيب المستند الجديد هو `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
تكتب كلتا الصيغتين الترتيب في سبعة إدخالات، مستبعدتين `128` و`256`، ما دامت `128` تقع مباشرةً قبل `columnName` و`256` مباشرةً بعد `columnDataType`. لذا لا يزال المستند الجديد يكتب `1, 2, 4, 8, 16, 32, 64`، ويحتفظ الملف الذي لم يحرّكهما ترتيبه قط ببايتاته. وفي غير ذلك تكتبان القيم التسع كلها.  
يضع التحليل القيمتين في الترتيب ذي الإدخالات السبعة في هذين الموضعين، أيًّا كان ترتيب القيم السبع، ويأخذ الإدخالات التسعة التي تضم كل الأنواع كما هي.  
ومنذ الإصدار `5.0.0` يقبل أي ترتيب آخر أيضًا. فهو يحتفظ بكل `ColumnType` يعرفه مرة واحدة بالترتيب المعطى، ويُسقط كل إدخال آخر: قيمة لا يسمّيها أي `ColumnType`، كنوع يضيفه إصدار لاحق، وإدخالًا ثانيًا للنوع نفسه. ويوضع كل نوع ينقص الترتيب مباشرةً بعد أقرب نوع يسبقه في الترتيب الافتراضي مما يضمه الترتيب، أو، إن لم يكن قبله شيء، مباشرةً قبل أقرب نوع بعده، وهكذا تجد `128` و`256` موضعيهما في سبعة إدخالات. ولا يُقرأ على أنه الترتيب الافتراضي إلا ترتيب لا يسمّي أي نوع يعرفه، أو قيمة ليست مصفوفة.  
لذا يُفتح الملف الذي حفظه إصدار لاحق بترتيبه للأنواع التي يعرفها هذا الإصدار، ويكتب الحفظ هنا ذلك الترتيب دون غيرها. وقبل `5.0.0` كان التحليل يقرأ أي ترتيب آخر على أنه الترتيب الافتراضي، فيُفتح ذلك الملف وقد أُعيد ضبط ترتيب أعمدته. ويقبل JSON Schema سبعة أعداد صحيحة أو تسعة.

منذ الإصدار `4.0.0`، يضم `Language` ثمانية أهداف إضافية في [منشئ التعليمات البرمجية](../../guide/guides/code-generator.md)، من `Mermaid` إلى `JSONSchema`. وتُقرأ أي قيمة `language` لا يعرفها المحلل على أنها `GraphQL`، لذا يفتح المحرر الأقدم من الإصدار `4.0.0` المستند المحفوظ بأحد هذه الأهداف على GraphQL، ويكتب الحفظ فيه GraphQL.

منذ الإصدار `4.0.0`، يحل `lockSettings` محل `ignoreSaveSettings`، ويحل `LockSettingType` محل `SaveSettingType` الذي أُزيل. يحدد `lockSettings` الإعدادات التي يحفظها المستند كما كانت عند قفلها. ويشمل `viewport` الحقول `originX` و`originY` و`zoomLevel` معًا، إذ إن نقطة الأصل المحفوظة دون مستوى تكبيرها تُفتح في مكان آخر، ويشمل كل بت آخر الحقل الذي يحمل البت اسمه. وهذه هي صفوف [`Lock`](../../guide/guides/settings.md#lock) في علامة تبويب الإعدادات.  
يُكتب الإعداد المقفل بقيمته المقفلة، أيًّا كان ما يعرضه المحرر، في الخاصيتين `value` و`runtimeValue` على السواء، ويُكتب كل إعداد آخر كما هو. لذا ما دام القفل المقابل مفعّلًا، فإن التمرير وتغيير مستوى التكبير، أو التبديل بين علامات التبويب، أو تغيير لغة منشئ التعليمات البرمجية أو أحد أنماط التسمية أو نوع علامات الاقتباس، أو تبديل عرض الأسماء، يترك الملف على حاله. يأخذ القفل القيمة التي يحملها الإعداد في تلك اللحظة، ويأخذ التحليل القيمة المقفلة من الحقل المحفوظ.  
المستند الذي يبدأ من لا شيء — محرر جديد أو مخزن نسخ متماثل جديد، أو قيمة فارغة تُمرَّر إلى `value` أو `setInitialValue()` — تكون فيه قيمة `lockSettings` هي `63`، أي أن كل الأقفال مفعّلة. والمستند الذي لا تحمل `settings` فيه `lockSettings` — كل ملف حُفظ قبل الإصدار `4.0.0`، أيًّا كانت قيمة `ignoreSaveSettings` فيه، وكل مستند v2 — يُفتح هو أيضًا وكل الأقفال مفعّلة: عرضه وعلامة تبويبه حيث يكونان في المستند الجديد (`originX` و`originY` بالقيمة `0`، و`zoomLevel` بالقيمة `1`، وعلامة تبويب ERD)، ولغته وأنماط التسمية ونوع علامات الاقتباس مقفلة على ما حفظه. والمستند الذي يسمّي أقفاله يحتفظ بها، بما فيها `0`، وبكل قيمة حفظها.  
يحتفظ التحليل بكل بتات `lockSettings`، حتى غير المعروفة منها، لذا يبقى القفل الذي يضيفه إصدار لاحق بعد الحفظ هنا؛ ولا يتحقق JSON Schema إلا من كونه عددًا صحيحًا. أما المحرر الأقدم من الإصدار `4.0.0` فيُسقط `lockSettings` عند الحفظ ويكتب العرض وعلامة التبويب كما هما، لذا يُفتح الملف هنا مجددًا كأنه ملف حُفظ قبل الإصدار `4.0.0`.

منذ الإصدار `4.2.0`، يوجد قفل سابع، `unlockNameViewMode` (`64`)، وهو الصف `Name View`، ويشمل `nameViewMode`. ويُقرأ بته بعكس بتات الأقفال الأخرى، كما تُقرأ بتات الإخفاء في `Show`: عند تعيينه يكون عرض الأسماء غير مقفل، وعند مسحه يكون مقفلًا. لذا لا تزال `63` تعني أن كل الأقفال مفعّلة، ويحملها المستند الجديد وعرض الأسماء مقفل على `'physical'`. ويحمل الملف المحفوظ قبل الإصدار `4.2.0` هذا البت ممسوحًا، أيًّا كانت أقفاله الأخرى، بما فيها `0`، لذا يُفتح وعرض الأسماء مقفل على `'physical'`. ويحمل المستند الذي عُطّلت فيه كل الأقفال القيمة `64`، ويحمل المستند الذي فُعّلت فيه كل الأقفال الأخرى وأُلغي فيه قفل عرض الأسماء القيمة `127`. اختبر هذا القفل معكوسًا: يكون مفعّلًا ما دام `(lockSettings & 64) === 0`.  
ما دام مفعّلًا، لا يغيّر تبديل عرض الأسماء إلا شاشة المحرر الذي أجراه، ويحتفظ المستند بالعرض المقفل. وما دام معطّلًا، يكون التبديل في محرر قادر على التحرير تبديلًا للمستند، ويبدّل كل متعاون معه. أما تبديل محرر للقراءة فقط فلا يغيّر إلا شاشته في الحالتين. راجع [`Lock`](../../guide/guides/settings.md#lock).  
ويحتفظ المحرر بالإصدار `4.0.0` أو `4.1.0` بالبت عند الحفظ لكنه يُسقط `nameViewMode`، لذا يُعاد فتح المستند هنا على `'physical'`، وقفله على حاله.

منذ الإصدار `4.0.0`، يحمل `ddlScripts` السكربتين الخاصين بعلامة تبويب [مخطط SQL](../../guide/guides/schema-sql.md)، وتكتبهما DDL لأي قاعدة بيانات: `before` بعد الترويسة وقبل الجداول، و`after` بعد DDL المُنشأة. تكتب DDL كل سكربت بفواصل أسطر LF، دون الأسطر الفارغة في بدايته والمسافات البيضاء في نهايته، وتختمه على MSSQL بالكلمة `GO`، كما يوضّح قسم [السكربتات قبل الجداول وبعدها](../../guide/guides/schema-sql.md#before-and-after-scripts)؛ أما `ddlScripts` نفسه فيحتفظ بكل سكربت كما كُتب. لا يُكتب المفتاح إلا ما دام أحد السكربتين يحمل نصًا، وعندئذ يُكتب حاملًا كليهما؛ والمفتاح المفقود، أو السكربت الذي ليس سلسلة نصية، يُقرأ على أنه `''`. ولا تُحفظ في المستند خيارات `Statements` و`Header` و`Tables` الخاصة بعلامة التبويب، ولا مفتاح التبديل [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) فيها منذ الإصدار `4.2.0`.  
يُسقط المحرر الأقدم من الإصدار `4.0.0` السكربتات عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدانها.

منذ الإصدار `4.2.0`، يمثل `nameViewMode` [عرض الأسماء](../../guide/guides/logical-names.md#name-view)، أي الأسماء التي يرسمها المخطط: `'physical'` اسم كل جدول وعمود، و`'logical'` اسمه المنطقي في مكان الاسم، و`'both'` الاسم المنطقي والاسم. وتسمّيها القوائم `Physical Names` و`Logical Names` و`Both Names`. وتكتبه كلتا الصيغتين في الأخير، بعد `ddlScripts`، وفقط ما دامت القيمة التي تكتبانها ليست `'physical'`؛ وما دام القفل `Name View` مفعّلًا، فتلك هي القيمة المقفلة، أيًّا كان ما تعرضه الشاشة. وتُقرأ القيمة المفقودة، أو التي لا يعرفها المحلل، على أنها `'physical'`، ولا يقبل JSON Schema إلا `"logical"` و`"both"`.  
يُسقط المحرر الأقدم من الإصدار `4.2.0` الحقل `nameViewMode` عند تحميل المستند.

لا تقبل الثوابت `Database` و`Language` و`Show` و`ColumnType` و`ColumnOption` و`LockSettingType` و`ReferentialAction` إلا الإضافة في نهايتها. يخزّن المستند المحفوظ العدد، لذا يأخذ أي نظام قاعدة بيانات أو هدف إنشاء تعليمات برمجية أو علامة أو نوع عمود أو خيار عمود أو قفل أو إجراء جديد البت التالي بدلًا من خانة في المنتصف.

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

تمثل كل قائمة من القوائم الخمس الأولى ترتيب نوع واحد من الكيانات، وهو الترتيب الذي تقرؤه DDL وفرز الجداول وترتيب الرسم. في صيغة التخزين، لا تحمل كل قائمة إلا معرّفات الكيانات المحتفَظ بها، يرد كلٌّ منها مرة واحدة، بالترتيب المدرج، ومنذ الإصدار `4.2.0` تُستبعد القائمة التي لا تحمل أيًّا منها. منذ الإصدار `4.0.0`، يمثل `tableGroupIds` ترتيب مجموعات الجداول.

منذ الإصدار `4.2.0`، تُدرج `wordIds` و`termIds` و`domainIds` الصفوف القائمة في كل قاموس: فالصف الذي تحمله مجموعة كياناته ولا تحمله قائمته صف مُزال. وهي لا تمثل ترتيب الورقة، الذي يعطيه الحقل `order` في كل صف. ولا تكتبها إلا قيمة وقت التشغيل، كلًّا منها ما دامت هي أو مجموعة كياناتها تحمل إدخالًا. أما صفوف الملف فهي نفسها العضوية والترتيب، ويرفض JSON Schema هذه القوائم.  
منذ الإصدار `4.2.0`، يقرأ التحليل القائمة التي يستبعدها المستند، أو يحملها بشكل غير المصفوفة، على أنها كل إدخال تحمله مجموعة كياناتها، كل معرّف مرة واحدة، بالترتيب المحفوظ؛ أما المصفوفة الفارغة فتبقى فارغة، فيُقرأ عندئذ كل إدخال في مجموعة كياناتها على أنه مُزال. ويقرأ المحرر الأقدم من الإصدار `4.2.0` القائمة المفقودة على أنها فارغة، لذا لا تزال صيغة التخزين تكتب كل قائمة متى حملت مجموعة كياناتها كيانًا.

منذ الإصدار `4.0.0`، لا يُحفظ ترتيب التراص. يضع التحليل في ترتيب التراص كل جدول وملاحظة ومجموعة جداول مدرجة لا تحمل `zIndex` حسب موضعها في قائمتها، والمتأخر منها في المقدمة: مجموعات الجداول بدءًا من `1`، والجداول بدءًا من `2`، والملاحظات فوق كل جدول. أما الكيان الذي يحمل `zIndex`، كما في قيمة وقت التشغيل أو في ملف حُفظ قبل الإصدار `4.0.0`، فيحتفظ به. لذا يضيع إحضار جدول أو ملاحظة إلى المقدمة عند إعادة فتح الملف.

### Collection: tableEntities {#collection-tableentities}

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

منذ الإصدار `4.0.0`، يحمل الجدول `groupId`، وهو معرّف [مجموعة الجداول](../../guide/guides/table-groups.md) التي ينتمي إليها. ويعني `groupId` المفقود أو الفارغ، أو الذي لا يسمّي أي مجموعة في `doc.tableGroupIds`، عدم وجود مجموعة، ولا تكتبه صيغة التخزين إلا ما دام يسمّي مجموعة محتفَظًا بها.  
يضبط التحليل `seqColumnIds` على `columnIds` عندما يكون مفقودًا أو ينقصه معرّف مدرج، ويقيس المحرر `widthName` و`widthLogicalName` و`widthComment` من جديد بخطوطه الخاصة عند كل تحميل.

منذ الإصدار `4.2.0`، يحمل الجدول `logicalName`، وهو الاسم الذي يرسمه [العرضان](../../guide/guides/logical-names.md#name-view) `Logical Names` و`Both Names`، وقيمته `''` إن لم يوجد اسم منطقي، و`nameDerived`، وقيمته `true` ما دامت القواميس قد [اشتقت](../../guide/guides/dictionary.md#deriving-physical-names) `name` من الاسم المنطقي. وما دام معيّنًا، يشتق الاسم المنطقي الجديد الاسمَ من جديد؛ وما دام غير معيّن، يكون الاسم اسمًا كتبه أحدهم بنفسه، ويتركه الاسم المنطقي الجديد على حاله ما لم يكن الاسم فارغًا أو لا يحوي إلا مسافات. وتعطّله إعادة التسمية يدويًا، أما الأمر [`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) فيعيد كتابة الاسم حتى لو كتبه أحدهم بنفسه، ويعيّنه حيثما وُجد اسم منطقي.  
تكتب صيغة التخزين `logicalName` بعد `name`، كما كُتب، فقط ما دام يحمل نصًا غير المسافات، و`nameDerived` بعد `groupId` فقط ما دام `true`، وهي القيمة الوحيدة التي يقبلها JSON Schema. ويُقرأ `logicalName` المفقود على أنه `''` و`nameDerived` المفقود على أنه `false`، لذا يُعدّ كل اسم في ملف حُفظ قبل الإصدار `4.2.0` اسمًا كتبه أحدهم بنفسه.  
يُسقط المحرر الأقدم من الإصدار `4.2.0` كليهما عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدان الاسم المنطقي لكل جدول.

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

منذ الإصدار `4.0.0`، لا تكتب صيغة التخزين الحقل `ui` في العمود. فكل تحميل يشتق `keys`، أي علامة المفتاح الأساسي من البت `primaryKey` في `options` وعلامة المفتاح الخارجي من العلاقات التي تنتهي عند العمود، ويقيس قيم العرض الست.  
يعرض المحرر الأقدم من الإصدار `4.0.0` أعمدة الملف المحفوظ هنا دون أيقونات المفتاح الأساسي.

منذ الإصدار `4.2.0`، يحمل العمود `logicalName`، كما يفعل الجدول، و`domainId`، وهو معرّف المجال المرتبط به العمود، وقيمته `''` إن لم يكن مرتبطًا بأي مجال. وتُبقي التعديلات في محرر واحد العمودَ المرتبط بمجال على نوع بيانات مجاله، كما يوضّح قسم [المجالات وأنواع البيانات](../../guide/guides/dictionary.md#domains-and-data-types). لكن التحليل لا يغيّر نوع أي عمود، لذا قد يترك ملف كُتب في مكان آخر عمودًا مرتبطًا بمجال على نوع آخر، وكذلك قد تفعل التعديلات المتقاطعة لمتعاونَين؛ وتُدرج ورقة الفحوصات كل حالة منها على أنها [`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). ويمسح التحليل `domainId` الذي لا يسمّي أي مجال يحمله المستند. ولا يزال المجال المُزال محسوبًا، لذا يحتفظ المحرر بالربط به ما دام التراجع قادرًا على إعادة المجال. وبعد `options`، تكتب صيغة التخزين `logicalName` وفق القاعدة الخاصة بالجدول، و`domainId` فقط ما دام يسمّي مجالًا يكتبه الملف، فلا تكتب أبدًا ربطًا بمجال مُزال.  
يمثل `ColumnOption.nameDerived` (`16`) علامة الاسم المشتق في العمود، ويُحفظ في `options` مع البتات الأخرى ويعني ما يعنيه `nameDerived` في الجدول. فالمفتاح الأساسي غير NULL الذي اشتقت القواميس اسمه، على سبيل المثال، يحمل القيمة `26` في `options`.  
يُسقط المحرر الأقدم من الإصدار `4.2.0` الحقلين `logicalName` و`domainId` عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدانهما. ويحتفظ بقيمة `options` عددًا صحيحًا كاملًا، لذا يبقى البت `nameDerived` بعد الحفظ فيه.

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

### صفوف القواميس {#dictionary-rows}

منذ الإصدار `4.2.0`، يحمل المستند ثلاثة قواميس، هي الأوراق `Words` و`Terms` و`Domains` في علامة تبويب [القاموس](../../guide/guides/dictionary.md)، في `wordEntities` و`termEntities` و`domainEntities`. وكل حقل في الكلمة أو المصطلح أو المجال سلسلة نصية، وليس لأيٍّ منها `ui`. أما الورقة `Checks` فتُستخلص من القواميس والمخطط، ولا تُحفظ.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

لا يُستخدم المعرّف مفتاحًا في أيٍّ من الثلاثة، وإنما يُكتب كلٌّ منها على هيئة رأس وصفوف: يسمّي `fields` حقول الكيان مرة واحدة، والمعرّف أولًا، ويحمل كل صف قيم كيان واحد بذلك الترتيب. وتُدرج الأنواع أدناه حقول كل كيان بترتيب رأس قيمة وقت التشغيل. ويحتفظ الصف دائمًا بمعرّفه واسمه، لكن قيمه الفارغة في نهايته بعد الاسم تُستبعد، لذا تبقى القيمة الفارغة التي تسبق قيمة محتفَظًا بها `''`، ويقرأ التحليل القيمة التي ينقصها الصف على أنها `''`. وتكتب كلتا الصيغتين كل صف في سطر خاص به بصيغة JSON مضغوطة، كما في هاتين الكلمتين من ملف:

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

تكتب صيغة التخزين الصفوف المدرجة بترتيب الورقة وتستبعد `order`، لذا لا تسمّيه رؤوسها. وتستبعد الصف الذي تكون كل قيمه بعد معرّفه فارغة أو لا تحوي إلا مسافات، مثل الصف الذي أُضيف ولم يُملأ قط، أو الذي أُفرغ، وتستبعد كل ربط بمجال كهذا أو بمجال مُزال: فيُستبعد `domainId` في العمود، ويُكتب `domainId` في المصطلح بالقيمة `''`، ويُستبعد المصطلح نفسه إذا لم يحمل شيئًا آخر.  
تسمّي رؤوس قيمة وقت التشغيل `"order"` مباشرةً بعد `"name"`. وتكتب كل صف تحمله مجموعة الكيانات، بما في ذلك الصفوف المُزالة، بالترتيب الذي تحملها به مجموعة الكيانات، لذا افرز حسب `order`، مع المقارنة بترتيب وحدات الترميز، للحصول على ترتيب الورقة. ويمنح التحليل صفوف الملف مفاتيح `order` بترتيب وقوعها، لذا تُقرأ مجددًا بالترتيب الذي كتبها به الملف.  
والمستند الذي لا يحمل القواميس، مثل المستند المحفوظ قبل الإصدار `4.2.0`، ليس فيه أي قاموس. ويُسقط المحرر الأقدم من الإصدار `4.2.0` القواميس الثلاثة عند تحميل المستند، لذا يؤدي الحفظ فيه إلى فقدان كل كلمة ومصطلح ومجال.

### Collection: wordEntities {#collection-wordentities}

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

الكلمة إحدى الكلمات التي يتكوّن منها الاسم المنطقي، و`abbreviation` هو ما يمثلها في الاسم المادي. ويُدرج `synonyms` تهجئات أخرى للكلمة، و`forbiddenWords` كلماتٍ لا يجوز استخدامها مكانها، وكلاهما مفصول بفواصل.

### Collection: termEntities {#collection-termentities}

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

المصطلح اسم منطقي كامل. والجدول أو العمود الذي يطابق `logicalName` فيه `name` يشتق `physicalName` أو، ما دام فارغًا، اسمًا مكوّنًا من اختصارات الكلمات، ويأخذ العمود أيضًا المجال الذي يسمّيه `domainId`، وقيمته `''` إن لم يوجد مجال (راجع [اشتقاق الأسماء المادية](../../guide/guides/dictionary.md#deriving-physical-names)). و`synonyms` مفصول بفواصل. ويمسح التحليل `domainId` الذي لا يسمّي أي مجال، كما في العمود.

### Collection: domainEntities {#collection-domainentities}

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

المجال نوع بيانات مسمّى، يحمله `dataType` كما يحمله العمود، بما في ذلك الطول، مثل `NUMERIC(10)`. ويرتبط العمود أو المصطلح بالمجال عبر معرّفه، ويمنح المحرر كل عمود مرتبط بمجال نوع بيانات ذلك المجال (راجع [المجالات وأنواع البيانات](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

يُنشر ملف المخطط المعتمد في [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json)، ويمكن الإشارة إليه مباشرةً عبر `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

ضع `$schema` في أعلى ملف `.erd.json`، فتتحقق المحررات التي تفهم JSON Schema، مثل VS Code، من صحة المستند وتكمل حقوله تلقائيًا أثناء تحريرك.

منذ الإصدار `4.0.0`، يصف المخطط صيغة التخزين وحدها. فكل كائن ذي حقول مسماة مغلق (`additionalProperties: false`)، وكل حقل تكتبه صيغة التخزين دائمًا مطلوب، والحقل الذي تستبعده ما دام لا يحمل شيئًا مسمّى لكنه غير مطلوب، ولا يُسمّى أي حقل تستبعده دائمًا. لذا يرفض قيمة وقت التشغيل. ويرفض أيضًا الملف المحفوظ قبل الإصدار `4.0.0`، بما فيه من `meta` وقيم العرض و`zIndex` و`ignoreSaveSettings` وما إلى ذلك، حتى يحفظ ذلك الملفَ من جديد محررٌ من الإصدار `4.0.0` أو أحدث. والملف الذي حفظه الإصدار `3.2.0` أو أحدث يسمّي بالفعل عنوان URL لهذا المخطط، الذي يشير إلى الفرع `main`، لذا يُبلغ المحرر الذي يتحقق من الصحة وفقًا له عن خطأ في الملف الآن. أما الملف الذي حفظه الإصدار `3.0.0` أو `3.1.0`، أو مستند v2، فلا يسمّي أي `$schema`.

منذ الإصدار `4.2.0`، لم يعد المخطط يشترط الحقول النصية للكيان، ولا أي قائمة في `doc`، ولا أي مجموعة كيانات، ولا `collections` نفسه، وهي ما تستبعده صيغة التخزين ما دامت لا تحمل شيئًا. ولا يزال يقبل الملف الذي حفظه الإصدار `4.0.0` أو `4.1.0`. ويسمّي الحقول الجديدة: `nameViewMode`، الذي لا يقبل إلا `"logical"` و`"both"`؛ و`logicalName` و`nameDerived` في الجدول، والأخير لا يقبل إلا `true`؛ و`logicalName` و`domainId` في العمود؛ والقواميس الثلاثة، لكلٍّ منها رأسه وصفوفه من السلاسل النصية. ويُدرج `canvasType` علامة تبويب القاموس، ويقبل `columnOrder` سبعة أعداد صحيحة أو تسعة، وتسمّي أوصاف `show` و`columnOrder` و`lockSettings` و`options` البتات الجديدة.

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
