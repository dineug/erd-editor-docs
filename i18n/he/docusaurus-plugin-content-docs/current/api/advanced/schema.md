---
sidebar_position: 3
description: פורמט המסמך של ERD Editor, .erd.json – צורת האחסון שקובץ מכיל וערך זמן הריצה שעורך מחזיק, טיפוסי TypeScript, הקבועים שמאחורי כל שדה מספרי, וה-JSON Schema שפורסם.
---

# סכמה

`.erd.json` הוא פורמט המסמך של העורך. יש לקרוא דף זה כשצריך ליצור, לאמת או להמיר מסמך מחוץ לעורך.

החל מגרסה `4.0.0`, למסמך יש שתי צורות סריאליזציה, ובשתיהן `version` הוא `'3.0.0'`. צורת האחסון היא מה שקובץ מכיל: זה מה ש-[`editor.value`](../erd-editor-element.md#value) מחזיר, מה שייצוא ה-JSON כותב, והצורה היחידה שה-[JSON Schema](#json-schema) שפורסם מקבל. ערך זמן הריצה הוא המסמך כולו כפי שעורך מחזיק אותו, ו-[`editor.runtimeValue`](../erd-editor-element.md#runtimevalue) מחזיר אותו. `setInitialValue()`, ה-setter של `value` ו-`setSchemaJSON()` קוראים כל אחת משתי הצורות, כל קובץ שגרסה קודמת שמרה, ומסמך `.vuerd` של v2. לפני גרסה `4.0.0`, הייתה רק צורה אחת: `value` החזיר את המסמך כולו כפי שהעורך החזיק אותו, כמו ש-`runtimeValue` מחזיר כעת.

## צורת אחסון וערך זמן ריצה {#storage-form-and-runtime-value}

צורת האחסון מכילה רק את הישויות הקיימות: כל טבלה שמופיעה ב-`doc.tableIds`, העמודות שהטבלאות האלה מפרטות, הקשרים בין שתי טבלאות שנשמרות, האינדקסים של טבלאות שנשמרות יחד עם עמודות האינדקס שהעמודה שלהן עדיין מופיעה ברשימה של הטבלה, הפתקים וקבוצות הטבלאות שמופיעים ברשימות, והחל מגרסה `4.2.0` גם המילים, המונחים והתחומים שמופיעים ברשימות ומכילים ערך כלשהו מעבר למזהה שלהם. היא משמיטה את מה שעורך מחשב בעת הטעינה או מחזיק כל עוד הוא פתוח: ישויות שהוסרו, `seqColumnIds` ו-`seqIndexColumnIds`, כל `zIndex`, הרוחבים שנמדדו, ה-`ui` של העמודה, `identification`, `startRelationshipType` ונקודות העיגון של קשר, והחל מגרסה `4.2.0` גם ה-`order` של כל שורת מילון והרשימות `doc.wordIds`, `doc.termIds` ו-`doc.domainIds`. הטיפוסים שלהלן מסמנים כל אחד מהשדות האלה ב-`// runtime only`.  
המפתחות של כל אוסף מלבד המילונים הם המזהים, בסדר יחידות הקוד, כשהעמודות מקובצות תחילה לפי `tableId` ועמודות האינדקס לפי `indexId`. החל מגרסה `4.2.0`, `wordEntities`, `termEntities` ו-`domainEntities` באים אחרי כל שאר האוספים, בסדר הזה, וכל אחד מהם נכתב כשורת כותרות ושורות, כל שורה בשורה נפרדת (ראו [שורות המילון](#dictionary-rows)). כל ישות כותבת את השדות שלה בסדר קבוע, והטקסט מוזח בשני רווחים ומסתיים בתו שורה חדשה. כך אותו מסמך נכתב תמיד באותם בייטים, עריכה משנה רק את מה שהיא נוגעת בו, וקובץ שנשמר במחשב עם גופנים אחרים נפתח מחדש עם אותו `value`.  
VS Code, Obsidian והתוסף ל-JetBrains כותבים קובץ רק כשעריכה משנה את `value`, ולכן קובץ שגרסה קודמת שמרה שומר על הצורה הישנה שלו עד העריכה הראשונה שלו.

החל מגרסה `4.2.0`, צורת האחסון משמיטה גם את מה שאין בו דבר: כל שדה טקסט שישות או ה-`ui` שלה מכילים כ-`''` (ה-`name`, ה-`comment` וה-`ui.color` של טבלה, ה-`name`, ה-`comment`, ה-`dataType` וה-`default` של עמודה, ה-`name` של אינדקס, ה-`value` וה-`ui.color` של פתק, ה-`name` וה-`color` של קבוצת טבלאות), כל רשימת `doc` וכל אוסף שאין בהם אף רשומה, ואת `collections` עצמו ברגע שכל האוספים ריקים. טקסט שמכיל רווחים בלבד נכתב כפי שהוא, מלבד שם לוגי, שמושמט במקרה כזה, ומלבד מילה, מונח או תחום שכל הערכים שלהם מעבר למזהה ריקים או מכילים רווחים בלבד, שמושמטים בשלמותם. כל מזהה, כל רשימה בתוך ישות וכל מספר, כולל `0`, עדיין נכתבים. `doc` נכתב תמיד, ולכן הקובץ של מסמך חדש מכיל את `$schema`, את `version`, את ההגדרות שלו ואת `"doc": {}`.  
ניתוח קורא שדה טקסט חסר כ-`''` ואוסף חסר כאוסף ריק, כפי שעושה כל גרסה של v3, וצורת האחסון משמיטה רשימת `doc` רק כל עוד אין באוסף שלה דבר (ראו [Doc](#doc)). לכן גם עורך בגרסה שקודמת ל-`4.2.0` פותח את הקבצים האלה, ותוכנה שקוראת קובץ בעצמה צריכה לקרוא את מה שחסר באותו אופן. קובץ שגרסה קודמת שמרה חוזר מהשמירה הבאה שלו בלי הטקסט, הרשימות והאוספים הריקים שלו, שינוי שמתבצע פעם אחת, ומאז והלאה הוא נשמר זהה בייט אחר בייט.

ערך זמן הריצה שומר את מה שצורת האחסון משמיטה: ישויות שהוסרו, רצפים, ערכי z-index, רוחבים, סימוני מפתחות, דגלי קשרים ונקודות עיגון, שדות הטקסט הריקים, וארבע הרשימות `tableIds`, `relationshipIds`, `indexIds` ו-`memoIds` וששת האוספים מ-`tableEntities` עד `memoEntities` גם כשהם ריקים. החל מגרסה `4.2.0`, הוא שומר גם מילים, מונחים ותחומים שהוסרו, שורות שאין בהן דבר, את ה-`order` של כל שורה, את שלוש רשימות המילונים, שם לוגי שמכיל רווחים בלבד וקישור לתחום שהוסר. הוא מוזח בשני רווחים, בלי תו שורה חדשה בסופו. יש להשתמש בו רק כדי לאתחל שותף לעריכה או תצוגה שנייה באמצעות `setInitialValue()`, כך שביטול פעולה של הסרה שעורך אחר שולח יחזיר שם את הישות בשלמותה. לעולם אין לכתוב אותו לקובץ; ה-JSON Schema דוחה אותו. שום דבר כבר אינו אוסף ישויות שהוסרו, ולכן ערך זמן הריצה שומר אותן עד לפעם הבאה שבה המסמך נפתח מהקובץ שלו.

שתי הצורות כותבות כל הגדרה נעולה בערך הנעול שלה (ראו [`lockSettings`](#settings)), את `settings.ddlScripts` רק כל עוד סקריפט מכיל טקסט, ואת `groupId` של טבלה רק כל עוד הוא אינו ריק. החל מגרסה `4.2.0`, שתיהן כותבות גם את `settings.nameViewMode` רק כל עוד הערך שהן כותבות אינו `'physical'`, את `settings.columnOrder` בשבעה איברים כשהדבר אפשרי (ראו [Settings](#settings)), ואת `nameDerived` של טבלה רק כל עוד הוא `true`.  
צורת האחסון כותבת את `doc.tableGroupIds` ו-`tableGroupEntities` רק כל עוד קיימת קבוצת טבלאות, את `logicalName` רק כל עוד הוא מכיל טקסט שאינו רווחים בלבד, את `domainId` של עמודה רק כל עוד הוא מציין תחום שהקובץ כותב, ואת כל מילון רק כל עוד הוא מכיל שורה שהקובץ כותב. ערך זמן הריצה כותב את השדות של קבוצות הטבלאות כל עוד המסמך מכיל קבוצה או קבוצה שהוסרה, את `logicalName` ו-`domainId` כל עוד הם אינם `''`, ואת כל מילון יחד עם הרשימה שלו כל עוד אחד מהם מכיל רשומה, כולל שורה שהוסרה.

## TypeScript {#typescript}

הטיפוסים מתארים את ערך זמן הריצה. שדה שמסומן ב-`// runtime only` מושמט מצורת האחסון, ושדה שמסומן ב-`?` נכתב רק כל עוד הוא מכיל משהו. הטקסט, הרשימות והאוספים הריקים שצורת האחסון משמיטה החל מגרסה `4.2.0` אינם מסומנים.

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

לכל ישות יש `id`, מחרוזת אטומה, שמשמשת כמפתח שלה באוסף שלה, מלבד בשלושת המילונים, שבהם הוא הערך הראשון של שורה. החל מגרסה `4.2.0`, ניתוח קורא ישות באחד משבעת האוספים בעלי המפתחות, שה-`id` שלה חסר, ריק או אינו מחרוזת, לפי המפתח שתחתיו היא מוחזקת, ומשמיט רשומה שאינה אובייקט, או רשומה בלי מזהה שהמפתח שלה הוא `''`. שורת מילון מושמטת כשהיא אינה מערך או כשה-`id` שלה אינו מחרוזת שונה מ-`''`. עורך בגרסה שקודמת ל-`4.2.0` משמיט ישות שה-`id` שלה חסר או ריק, ולכן צורת האחסון עדיין כותבת כל מזהה.  
החל מגרסה `4.0.0`, כל מזהה חדש, כולל מזהה של שורת מילון, הוא UUIDv7 שנכתב בצורת Uuid25, כלומר 25 ספרות בבסיס 36 באותיות קטנות, כגון `03gzrxjv20bdlcak89q25d2m7`, ולכן המזהים שעורך אחד מייצר ממוינים לפי הסדר שבו הוא יצר אותם. מסמך שומר את המזהים שהוא מכיל, כגון מזהי ה-nanoid של גרסה קודמת או המזהים של קובץ v2, ולכן אין להסתמך על המבנה של מזהה.

החל מגרסה `4.0.0`, אף ישות אינה נושאת אובייקט `meta` (`createAt`, `updateAt`), והטיפוסים `EntityMeta` ו-`EntityType` הוסרו. שום דבר אינו כותב אותו, ניתוח משמיט את ה-`meta` שקובץ ישן יותר נושא, וה-JSON Schema דוחה אותו. הוא שימש רק לתזמון איסוף הזבל של ישויות שהוסרו, שגם הוא כבר אינו קיים.

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

`originX` ו-`originY` הם התצוגה: הנקודה במסך שבה נמצאת נקודת הסצנה `(0, 0)`.  
`zoomLevel` נע מ-`0.1` עד `1.5`. מסמך שנשמר עם ערך מעל `1` נפתח ב-`1` בעורך בגרסה שקודמת ל-`3.5.0`.  
החל מגרסה `4.0.0`, ההגדרות אינן נושאות `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` או `ignoreSaveSettings`. שום דבר אינו כותב אותם, המנתח אינו שומר אף אחד מהם, וה-JSON Schema דוחה קובץ שעדיין מכיל אותם.

`canvasType` הוא הכרטיסייה שבה מסמך נפתח. מסמך שנשמר בכרטיסיית ויזואליזציה מכיל את `'@dineug/erd-editor/builtin-visualization'`, אבל לא את המידע אם הוצג מצב `Graph` או מצב `Flow`, ועורך שנוצר זה עתה מציג את הכרטיסייה הזו במצב `Graph`.  
החל מגרסה `4.0.0`, כל עוד הנעילה `Canvas Type` מופעלת, כפי שהיא מופעלת במסמך חדש, המסמך שומר את הכרטיסייה שהוצגה בעת הנעילה, ומעבר בין כרטיסיות משאיר את `value` כפי שהיה. נעילה שמתבצעת בכרטיסיית הגדרות שומרת את הכרטיסייה שממנה הגיע המשתמש, וערך `'settings'` נעול, שרק עריכה ידנית יכולה לכתוב, נפתח ב-`'ERD'`.  
החל מגרסה `4.2.0`, `canvasType` יכול להיות גם `'@dineug/erd-editor/builtin-dictionary'`, כרטיסיית [מילון](../../guide/guides/dictionary.md), שהנעילה `Canvas Type` מחזיקה כפי שהיא מחזיקה את האחרות. עורך בגרסה שקודמת ל-`4.2.0` שומר את הערך הזה, אבל אינו מציג אף כרטיסייה מתחת לסרגל הכלים שלו עד שהמשתמש בוחר אחת.  
שום חלק מהנתונים של מצב `Flow` עצמו אינו עובר סריאליזציה: המיקום, הזום, הזזת התצוגה, תצוגת השורות וההתמקדות בטבלאות נשארים בעורך, והחל מגרסה `4.2.0` גם התצוגות ש-[`Previous table` ו-`Next table`](../../guide/guides/visualization.md#previous-table-and-next-table) עוברים ביניהן. לכן `originX`, `originY` ו-`zoomLevel` מתארים תמיד את בד הציור של ERD.

`show` ו-`lockSettings` הם מסכות סיביות – יש לשלב את הדגלים באמצעות OR.  
`columnOrder` הוא מערך שמכיל כל ערך של `ColumnType` פעם אחת, בסדר התצוגה; החל מגרסה `4.2.0`, מסמך יכול לכתוב אותו עם שבעה מתוך תשעת הערכים, כפי שמתואר בפסקה על סדר העמודות שלהלן.  
כל אחד מ-`database`, `language`, `tableNameCase`, `columnNameCase` ו-`bracketType` מכיל ערך אחד בדיוק, וה-JSON Schema דוחה ערך משולב.

ה-`show` של מסמך חדש הוא `431`: `tableComment`, `columnComment`, `columnDataType`, `columnDefault`, `columnPrimaryKey`, `columnNotNull` ו-`relationship`.  
החל מגרסה `3.10.0`, יש שני דגלי `show` נוספים, ושניהם כבויים במסמך חדש ובכל מסמך שנשמר לפני גרסה `3.10.0`.  
`columnAlternateKey` (`512`) היא אפשרות התצוגה [`Alternate Key`](../../guide/guides/table-related-functions.md#alternate-keys). כשהדגל מוגדר, הוא מסמן את העמודות של כל אינדקס ייחודי על שתי עמודות או יותר כ-`AK1.1`, `AK1.2` וכן הלאה. הדגל כבוי בהתחלה, כך שאף תרשים קיים אינו משנה את רוחבו.  
`hideReferentialAction` (`1024`) פועל בכיוון ההפוך: כשהוא מוגדר, הוא מסתיר את ה[תוויות ON DELETE ו-ON UPDATE](../../guide/guides/relationship-editing.md#reading-a-connector) שעל קווי הקשר, ולכן כברירת מחדל הן מוצגות. אפשרות התצוגה `Referential Actions` מסומנת כל עוד הדגל כבוי. הדגל אינו משנה את הגודל של אף טבלה.  
עורך בגרסה שקודמת ל-`3.10.0` שומר את `show` כמספר שלם, ולכן שני הדגלים נשארים גם אחרי שמירה בו.

החל מגרסה `4.0.0`, יש שני דגלי `show` נוספים, ושניהם כבויים במסמך חדש ובכל מסמך שנשמר לפני גרסה `4.0.0`. בדומה ל-`hideReferentialAction`, כל אחד מהם מסתיר את מה ששמו מציין, ולכן קבוצות טבלאות ופתקים מוצגים כברירת מחדל.  
`hideTableGroup` (`2048`) מסתיר את [קבוצות הטבלאות](../../guide/guides/table-groups.md), ו-`hideMemo` (`4096`) מסתיר כל פתק. אלה [אפשרויות התצוגה](../../guide/guides/table-related-functions.md#table-view-options) `Table Groups` ו-`Memos`, וכל אחת מהן מסומנת כל עוד הדגל שלה כבוי. אף אחד מהדגלים אינו משנה את הגודל של טבלה כלשהי.  
עורך בגרסה שקודמת ל-`4.0.0` שומר את `show` כמספר שלם, ולכן שני הדגלים נשארים גם אחרי שמירה בו.

החל מגרסה `4.2.0`, יש דגל `show` נוסף, `columnDomain` (`8192`), שכבוי במסמך חדש ובכל מסמך שנשמר לפני גרסה `4.2.0`, ולכן ה-`show` של מסמך חדש הוא עדיין `431`. זוהי [אפשרות התצוגה](../../guide/guides/table-related-functions.md#table-view-options) `Domain`: כשהדגל מוגדר, כל שורת עמודה מציגה [תא תחום](../../guide/guides/logical-names.md#the-domain-cell), שמרחיב את הטבלאות. הדגל כבוי בהתחלה, כך שאף תרשים קיים אינו משנה את רוחבו.  
עורך בגרסה שקודמת ל-`4.2.0` שומר את `show` כמספר שלם, ולכן הדגל נשאר גם אחרי שמירה בו.

החל מגרסה `4.2.0`, ל-`ColumnType` יש תשעה ערכים. `columnLogicalName` (`128`) ממקם את תא השם הלוגי, ששורת עמודה מציגה רק בתצוגה `Both Names`, ו-`columnDomain` (`256`) את תא התחום. אלה השורות `Logical Name` ו-`Domain` של [סדר העמודות](../../guide/guides/settings.md#adjusting-column-order) בכרטיסיית הגדרות. עורך מחזיק סדר של כל התשעה, והסדר של מסמך חדש הוא `128, 1, 2, 256, 4, 8, 16, 32, 64`.  
שתי הצורות כותבות את הסדר בשבעה איברים, בלי `128` ו-`256`, כל עוד `128` עומד מיד לפני `columnName` ו-`256` מיד אחרי `columnDataType`. לכן מסמך חדש עדיין כותב `1, 2, 4, 8, 16, 32, 64`, וקובץ שהסדר שלו מעולם לא הזיז אותם שומר על הבייטים שלו. אחרת, הן כותבות את כל התשעה.  
ניתוח מכניס את השניים לסדר של שבעה איברים במקומות האלה, בלי קשר לסדר של השבעה, ומקבל כפי שהם תשעה איברים שמכילים כל סוג.  
החל מגרסה `5.0.0` הוא מקבל גם כל סדר אחר. הוא שומר כל `ColumnType` שהוא מכיר פעם אחת, לפי הסדר שניתן, ומשליך כל איבר אחר: ערך ש-`ColumnType` כלשהו אינו נושא את שמו, כמו סוג שגרסה מאוחרת יותר מוסיפה, ואיבר שני מאותו סוג. כל סוג שהסדר חסר ממוקם מיד אחרי הסוג הקרוב ביותר שלפניו בסדר ברירת המחדל שהסדר מכיל, או, כשאין סוג כזה, מיד לפני הקרוב ביותר שאחריו, וכך `128` ו-`256` מוצאים את מקומם בשבעה איברים. רק סדר שאינו נותן שם לאף סוג מוכר, או ערך שאינו מערך, נקרא כסדר ברירת המחדל.  
לכן קובץ שגרסה מאוחרת יותר שמרה נפתח עם הסדר שלו של הסוגים שהגרסה הזו מכירה, ושמירה כאן כותבת את הסדר הזה בלי האחרים. לפני גרסה `5.0.0` ניתוח קרא כל סדר אחר כברירת המחדל, ולכן קובץ כזה נפתח עם סדר עמודות שאופס. ה-JSON Schema מקבל שבעה או תשעה מספרים שלמים.

החל מגרסה `4.0.0`, ל-`Language` יש שמונה יעדים נוספים של [מחולל הקוד](../../guide/guides/code-generator.md), מ-`Mermaid` עד `JSONSchema`. ערך `language` שהמנתח אינו מכיר נקרא כ-`GraphQL`, ולכן עורך בגרסה שקודמת ל-`4.0.0` פותח מסמך שנשמר עם אחד מהם ב-GraphQL, ושמירה בו כותבת GraphQL.

החל מגרסה `4.0.0`, `lockSettings` תופס את מקומו של `ignoreSaveSettings`, ו-`LockSettingType` את מקומו של `SaveSettingType`, שהוסר. `lockSettings` מציין את ההגדרות שמסמך שומר כפי שהיו בעת נעילתן. `viewport` מכסה את `originX`, `originY` ו-`zoomLevel` יחד, כי ראשית תצוגה שנשמרה בלי הזום שלה נפתחת במקום אחר, וכל סיבית אחרת מכסה את השדה שעל שמו היא נקראת. אלה שורות ה-[`Lock`](../../guide/guides/settings.md#lock) בכרטיסיית הגדרות.  
הגדרה נעולה נכתבת בערך הנעול שלה, בלי קשר למה שהעורך מציג, הן על ידי `value` והן על ידי `runtimeValue`, וכל הגדרה אחרת נכתבת כפי שהיא. לכן, כל עוד הנעילה המתאימה מופעלת, גלילה וזום, מעבר בין כרטיסיות, שינוי של שפת הקוד במחולל הקוד, של סגנון שמות או של סוג המירכאות, או החלפה של תצוגת השמות משאירים את הקובץ כפי שהיה. הנעילה לוקחת את הערך שיש להגדרה באותו רגע, וניתוח לוקח את הערך הנעול מהשדה השמור.  
במסמך שמתחיל מאפס – עורך חדש או מאגר שכפול חדש, או ערך ריק שמועבר ל-`value` או ל-`setInitialValue()` – `lockSettings` מוגדר ל-`63`, וכל הנעילות מופעלות. מסמך שה-`settings` שלו אינם נושאים `lockSettings` – כל קובץ שנשמר לפני גרסה `4.0.0`, יהיה ה-`ignoreSaveSettings` שלו אשר יהיה, וכל מסמך v2 – נפתח גם הוא כשכל הנעילות מופעלות: התצוגה והכרטיסייה שלו נמצאות היכן שהן נמצאות במסמך חדש (`originX` ו-`originY` הם `0`, `zoomLevel` הוא `1`, כרטיסיית ERD), ושפת הקוד, סגנונות השמות וסוג המירכאות שלו נעולים על מה שהוא שמר. מסמך שמציין את הנעילות שלו שומר עליהן, כולל `0`, ועל כל ערך שהוא שמר.  
ניתוח שומר כל סיבית של `lockSettings`, גם סיביות לא מוכרות, ולכן נעילה שגרסה מאוחרת יותר מוסיפה נשמרת גם אחרי שמירה כאן; ה-JSON Schema בודק רק שזהו מספר שלם. עורך בגרסה שקודמת ל-`4.0.0` משמיט את `lockSettings` כשהוא שומר, וכותב את התצוגה והכרטיסייה כפי שהן, ולכן הקובץ נפתח כאן שוב כקובץ שנשמר לפני גרסה `4.0.0`.

החל מגרסה `4.2.0`, יש נעילה שביעית, `unlockNameViewMode` (`64`), השורה `Name View`, שמכסה את `nameViewMode`. הסיבית שלה מתפרשת הפוך משאר סיביות הנעילה, כמו סיביות ההסתרה של `Show`: כשהיא מוגדרת, תצוגת השמות אינה נעולה, וכשהיא מאופסת, היא נעולה. לכן `63` עדיין פירושו שכל הנעילות מופעלות, ומסמך חדש מכיל אותו כשתצוגת השמות נעולה על `'physical'`. בקובץ שנשמר לפני גרסה `4.2.0` הסיבית מאופסת, בלי קשר לשאר הנעילות שלו, כולל `0`, ולכן הוא נפתח כשתצוגת השמות נעולה על `'physical'`. מסמך שכל הנעילות בו כבויות מכיל `64`, ומסמך שכל שאר הנעילות בו מופעלות ותצוגת השמות בו אינה נעולה מכיל `127`. יש לבדוק את הנעילה הזו בהיפוך: היא מופעלת כל עוד `(lockSettings & 64) === 0`.  
כל עוד היא מופעלת, החלפה של תצוגת השמות משנה רק את המסך של העורך שביצע אותה, והמסמך שומר את התצוגה הנעולה. כל עוד היא כבויה, החלפה בעורך שמאפשר עריכה שייכת למסמך, וכל שותף לעריכה מחליף יחד איתה. החלפה בעורך לקריאה בלבד משנה בכל מקרה רק את המסך שלו. ראו [`Lock`](../../guide/guides/settings.md#lock).  
עורך בגרסה `4.0.0` או `4.1.0` שומר את הסיבית לאורך שמירה אבל משמיט את `nameViewMode`, ולכן המסמך נפתח כאן מחדש ב-`'physical'`, והנעילה שלו נשארת כפי שהייתה.

החל מגרסה `4.0.0`, `ddlScripts` מכיל את שני הסקריפטים של כרטיסיית [סכמת SQL](../../guide/guides/schema-sql.md), שה-DDL של כל מסד נתונים כותב: את `before` אחרי הכותרת ולפני הטבלאות, ואת `after` אחרי ה-DDL שנוצר. ה-DDL כותב כל אחד מהם עם מעברי שורה מסוג LF, בלי השורות הריקות שבתחילתו והרווחים הלבנים שבסופו, וב-MSSQL עם `GO` בסופו, כמתואר ב[סקריפטים לפני הטבלאות ואחריהן](../../guide/guides/schema-sql.md#before-and-after-scripts); `ddlScripts` עצמו שומר כל סקריפט כפי שהוקלד. המפתח נכתב רק כל עוד אחד מהסקריפטים מכיל טקסט, ואז עם שניהם; מפתח חסר, או סקריפט שאינו מחרוזת, נקרא כ-`''`. הבחירות `Statements`, `Header` ו-`Tables` של הכרטיסייה, והחל מגרסה `4.2.0` גם המתג [`Write logical names into empty comments`](../../guide/guides/schema-sql.md#logical-names-as-comments) שלה, אינם נשמרים במסמך.  
עורך בגרסה שקודמת ל-`4.0.0` משמיט את הסקריפטים כשהוא טוען מסמך, ולכן שמירה בו מאבדת אותם.

החל מגרסה `4.2.0`, `nameViewMode` הוא [תצוגת השמות](../../guide/guides/logical-names.md#name-view), השמות שהתרשים מציג: `'physical'` את השם של כל טבלה ועמודה, `'logical'` את השם הלוגי שלהן במקום השם, ו-`'both'` את השם הלוגי ואת השם. התפריטים קוראים להם `Physical Names`, `Logical Names` ו-`Both Names`. שתי הצורות כותבות אותו אחרון, אחרי `ddlScripts`, ורק כל עוד הערך שהן כותבות אינו `'physical'`; כל עוד הנעילה `Name View` מופעלת, זהו הערך הנעול, בלי קשר למה שהמסך מציג. ערך חסר, או ערך שהמנתח אינו מכיר, נקרא כ-`'physical'`, וה-JSON Schema מקבל רק את `"logical"` ו-`"both"`.  
עורך בגרסה שקודמת ל-`4.2.0` משמיט את `nameViewMode` כשהוא טוען מסמך.

`Database`, `Language`, `Show`, `ColumnType`, `ColumnOption`, `LockSettingType` ו-`ReferentialAction` גדלים רק בהוספה לסופם. מסמך שמור מאחסן את המספר, ולכן מסד נתונים, יעד ליצירת קוד, דגל, סוג עמודה, אפשרות עמודה, נעילה או פעולת הפניה חדשים מקבלים את הסיבית הבאה ולא משבצת באמצע.

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

כל אחת מחמש הרשימות הראשונות היא הסדר של סוג אחד של ישויות, שה-DDL, מיון הטבלאות וסדר ההצגה קוראים. בצורת האחסון, כל רשימה מכילה רק את המזהים של ישויות שנשמרות, כל אחד פעם אחת, בסדר שבו הם מופיעים, והחל מגרסה `4.2.0` רשימה שאין בה אף מזהה מושמטת. החל מגרסה `4.0.0`, `tableGroupIds` הוא הסדר של קבוצות הטבלאות.

החל מגרסה `4.2.0`, `wordIds`, `termIds` ו-`domainIds` מפרטות את השורות הקיימות של כל מילון: שורה שהאוסף שלה מכיל אבל הרשימה שלה אינה מכילה נחשבת לשורה שהוסרה. הן אינן הסדר של גיליון, שאותו נותן ה-`order` של כל שורה. רק ערך זמן הריצה כותב אותן, כל אחת כל עוד היא או האוסף שלה מכילים רשומה. בקובץ, השורות עצמן קובעות אילו רשומות קיימות ובאיזה סדר, וה-JSON Schema דוחה את הרשימות.  
החל מגרסה `4.2.0`, ניתוח קורא רשימה שהמסמך משמיט, או מכיל כמשהו שאינו מערך, ככל הרשומות שהאוסף שלה מכיל, כל מזהה פעם אחת, בסדר שבו הן מוחזקות; מערך ריק נשאר ריק, וכל רשומה באוסף שלו נקראת אז כרשומה שהוסרה. עורך בגרסה שקודמת ל-`4.2.0` קורא רשימה חסרה כרשימה ריקה, ולכן צורת האחסון עדיין כותבת כל רשימה בכל פעם שהאוסף שלה מכיל ישות.

החל מגרסה `4.0.0`, סדר השכבות אינו נשמר. ניתוח מסדר בשכבות כל טבלה, פתק וקבוצת טבלאות שמופיעים ברשימה ואין להם `zIndex`, לפי מקומם ברשימה שלהם, כשהמאוחרים יותר נמצאים מלפנים: קבוצות טבלאות מ-`1`, טבלאות מ-`2`, ופתקים מעל כל טבלה. ישות שיש לה `zIndex`, כמו בערך זמן ריצה או בקובץ שנשמר לפני גרסה `4.0.0`, שומרת עליו. לכן העברה של טבלה או פתק לחזית הולכת לאיבוד כשהקובץ נפתח מחדש.

### אוסף: tableEntities {#collection-tableentities}

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

החל מגרסה `4.0.0`, טבלה נושאת `groupId`, המזהה של [קבוצת הטבלאות](../../guide/guides/table-groups.md) שאליה היא שייכת. `groupId` חסר או ריק, או כזה שאינו מציין אף קבוצה ב-`doc.tableGroupIds`, פירושו שאין קבוצה, וצורת האחסון כותבת אותו רק כל עוד הוא מציין קבוצה שנשמרת.  
ניתוח מאתחל את `seqColumnIds` ל-`columnIds` כשהוא חסר או שחסר בו מזהה שמופיע ברשימה, ועורך מודד מחדש את `widthName`, `widthLogicalName` ו-`widthComment` עם הגופנים שלו בכל טעינה.

החל מגרסה `4.2.0`, טבלה נושאת `logicalName`, השם ש[התצוגות](../../guide/guides/logical-names.md#name-view) `Logical Names` ו-`Both Names` מציגות, `''` כשאין שם כזה, ו-`nameDerived`, שהוא `true` כל עוד המילונים [גזרו](../../guide/guides/dictionary.md#deriving-physical-names) את `name` מהשם הלוגי. כל עוד הוא מוגדר, שם לוגי חדש גוזר את השם מחדש; כל עוד אינו מוגדר, השם נחשב לשם שנכתב ידנית, ושם לוגי חדש אינו נוגע בו, אלא אם השם ריק או מכיל רווחים בלבד. שינוי שם ידני מכבה אותו, ו-[`Derive Physical Names Again`](../../guide/guides/dictionary.md#derive-physical-names-again) משכתב גם שם שנכתב ידנית ומפעיל אותו בכל מקום שיש בו שם לוגי.  
צורת האחסון כותבת את `logicalName` אחרי `name`, כפי שהוקלד, רק כל עוד הוא מכיל טקסט שאינו רווחים בלבד, ואת `nameDerived` אחרי `groupId` רק כל עוד הוא `true`, הערך היחיד שה-JSON Schema מקבל. `logicalName` חסר נקרא כ-`''` ו-`nameDerived` חסר נקרא כ-`false`, ולכן כל שם בקובץ שנשמר לפני גרסה `4.2.0` נחשב לשם שנכתב ידנית.  
עורך בגרסה שקודמת ל-`4.2.0` משמיט את שניהם כשהוא טוען מסמך, ולכן שמירה בו מאבדת את השם הלוגי של כל טבלה.

### אוסף: tableColumnEntities {#collection-tablecolumnentities}

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

החל מגרסה `4.0.0`, צורת האחסון אינה כותבת `ui` של עמודה. כל טעינה מחשבת את `keys`, את סימון המפתח הראשי מהסיבית `primaryKey` של `options` ואת סימון המפתח הזר מהקשרים שמסתיימים בעמודה, ומודדת את ששת הרוחבים.  
עורך בגרסה שקודמת ל-`4.0.0` מציג את העמודות של קובץ שנשמר כאן בלי סמלי המפתח הראשי שלהן.

החל מגרסה `4.2.0`, עמודה נושאת `logicalName`, כמו טבלה, ו-`domainId`, המזהה של התחום שהיא מקושרת אליו, `''` כשאין תחום. עריכות בעורך אחד שומרות עמודה מקושרת על סוג הנתונים של התחום שלה, כמתואר ב[תחומים וסוגי נתונים](../../guide/guides/dictionary.md#domains-and-data-types). עם זאת, ניתוח אינו משנה את הסוג של אף עמודה, ולכן קובץ שנכתב במקום אחר יכול להשאיר עמודה מקושרת בסוג אחר, וכך גם עריכות מצטלבות של שני שותפים לעריכה; גיליון הבדיקות מציג כל מקרה כזה כ-[`Domain type mismatch`](../../guide/guides/dictionary.md#what-each-check-finds). ניתוח מנקה `domainId` שאינו מציין אף תחום שהמסמך מכיל. תחום שהוסר עדיין נחשב, ולכן העורך שומר קישור אליו כל עוד ביטול פעולה יכול להחזיר את התחום. אחרי `options`, צורת האחסון כותבת את `logicalName` לפי הכלל של טבלה, ואת `domainId` רק כל עוד הוא מציין תחום שהקובץ כותב, ולכן לעולם לא קישור לתחום שהוסר.  
`ColumnOption.nameDerived` (`16`) הוא הדגל של השם הנגזר של העמודה, שנשמר ב-`options` יחד עם שאר הסיביות ומשמעותו כמשמעות `nameDerived` של טבלה. לדוגמה, ה-`options` של מפתח ראשי לא NULL שהמילונים גזרו את שמו הוא `26`.  
עורך בגרסה שקודמת ל-`4.2.0` משמיט את `logicalName` ואת `domainId` כשהוא טוען מסמך, ולכן שמירה בו מאבדת אותם. הוא שומר את `options` כמספר שלם, ולכן הסיבית `nameDerived` נשארת גם אחרי שמירה בו.

### אוסף: relationshipEntities {#collection-relationshipentities}

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

החל מגרסה `3.10.0`, קשר נושא את `onDelete` ו-`onUpdate`, [פעולות ON DELETE ו-ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) שלו. כל אחד מהם מכיל ערך `ReferentialAction` אחד בדיוק. `none`, ברירת המחדל, אינו כותב שום פסוקית, ולכן חלה ברירת המחדל של מסד הנתונים עצמו. חמשת הערכים האחרים מייצגים את `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` ו-`RESTRICT`. סכמת SQL כותבת פסוקית רק עבור מסד נתונים שמקבל את הפעולה שלה.  
צורת האחסון כותבת תמיד את שניהם, והחל מגרסה `4.0.0`, ה-JSON Schema מחייב אותם ובודק רק שכל אחד מהם הוא מספר שלם. ניתוח עדיין קורא שדה חסר, כמו בכל מסמך שנשמר לפני גרסה `3.10.0`, כ-`none`, וכך גם ערך שמחוץ לרשימה.  
עורך בגרסה שקודמת ל-`3.10.0` אינו מכיר את השדות ומשמיט אותם כשהוא טוען מסמך, ולכן שמירה בו מאבדת כל פעולה.

החל מגרסה `4.0.0`, כל טעינה מחשבת את מה שצורת האחסון משמיטה. קשר הוא קשר מזהה כשכל עמודה שהוא מסתיים בה היא מפתח ראשי, וה-`startRelationshipType` שלו הוא `dash` כשכל עמודה כזו היא NOT NULL, ו-`ring` אחרת; קשר שלא נותרה לו אף עמודה בקצה הסיום הוא קשר לא מזהה ו-`dash`, כפי שקשר חדש מתחיל. נקודות העיגון, `x`, `y` ו-`direction`, ממוקמות מחדש.

### אוסף: indexEntities {#collection-indexentities}

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

ניתוח מאתחל את `seqIndexColumnIds` ל-`indexColumnIds` כשהוא חסר או שחסר בו מזהה שמופיע ברשימה.

### אוסף: indexColumnEntities {#collection-indexcolumnentities}

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

### אוסף: memoEntities {#collection-memoentities}

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

החל מגרסה `4.0.0`, טבלאות ופתקים [חולקים סדר שכבות אחד](../../guide/guides/table-related-functions.md#moving-multiple-tables) שנקבע לפי `zIndex`, ולכן העברה של טבלה לחזית יכולה להציב אותה מעל פתק. ניתוח מציב פתק שנשמר בלי `zIndex` מעל כל טבלה, כמתואר ב-[Doc](#doc). פתק בקובץ שנשמר לפני גרסה `4.0.0` שומר על ה-`zIndex` שהוא שמר, שהגיע מאותו מונה כמו זה של הטבלאות, ולכן פתק שגרסה קודמת הציגה מעל כל טבלה יכול להיפתח מתחת לטבלה שהועברה לחזית אחריו.

### אוסף: tableGroupEntities {#collection-tablegroupentities}

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

החל מגרסה `4.0.0`, מסמך יכול להכיל [קבוצות טבלאות](../../guide/guides/table-groups.md): מלבנים בעלי שם וצבע שמוצגים מאחורי טבלאות. טבלה מצטרפת לקבוצה דרך ה-`groupId` שלה עצמה, ולכן קבוצה אינה מחזיקה רשימת חברים. צורת האחסון כותבת את האוסף, בדומה ל-`doc.tableGroupIds`, רק כל עוד קיימת קבוצה, ולמסמך שאין בו את האוסף, כגון מסמך שנשמר לפני גרסה `4.0.0`, אין קבוצות. `Show.hideTableGroup` מסתיר אותן.  
עורך בגרסה שקודמת ל-`4.0.0` משמיט את הקבוצות ואת ה-`groupId` של כל טבלה כשהוא טוען מסמך, ולכן שמירה בו מאבדת כל קבוצה.

### שורות המילון {#dictionary-rows}

החל מגרסה `4.2.0`, מסמך מכיל שלושה מילונים, הגיליונות `Words`, `Terms` ו-`Domains` של כרטיסיית [מילון](../../guide/guides/dictionary.md), ב-`wordEntities`, `termEntities` ו-`domainEntities`. כל שדה של מילה, מונח או תחום הוא מחרוזת, ולאף אחד מהם אין `ui`. הגיליון `Checks` מחושב מהמילונים ומהתרשים, ואינו נשמר.

```ts
type DictionaryRows = {
  fields: string[];
  rows: string[][];
};
```

באף אחד מהשלושה המפתחות אינם מזהים. כל אחד מהם נכתב כשורת כותרות ושורות: `fields` מציין את השדות של הישות פעם אחת, המזהה ראשון, וכל שורה מכילה את הערכים של ישות אחת בסדר הזה. הטיפוסים שלהלן מפרטים את השדות של כל ישות בסדר שורת הכותרות של ערך זמן הריצה. שורה שומרת תמיד את המזהה והשם שלה, אבל הערכים הריקים שבסופה, אחרי השם, מושמטים, כך שערך ריק שבא לפני ערך שנשמר נשאר `''`, וניתוח קורא ערך שחסר בשורה כ-`''`. שתי הצורות כותבות כל שורה בשורה נפרדת כ-JSON דחוס, כמו בשתי המילים האלה מתוך קובץ:

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

צורת האחסון כותבת את השורות שמופיעות ברשימה בסדר הגיליון ומשמיטה את `order`, ולכן שורות הכותרות שלה אינן מציינות אותו. היא משמיטה שורה שכל הערכים שלה מעבר למזהה ריקים או מכילים רווחים בלבד, כגון שורה שנוספה ומעולם לא מולאה, או שרוקנה, וכל קישור לתחום כזה או לתחום שהוסר: ה-`domainId` של עמודה מושמט, וזה של מונח נכתב כ-`''`, והמונח עצמו מושמט אם אין בו שום דבר אחר.  
שורות הכותרות של ערך זמן הריצה מציינות את `"order"` מיד אחרי `"name"`. הוא כותב כל שורה שהאוסף שלה מכיל, כולל שורות שהוסרו, בסדר שבו האוסף מחזיק אותן, ולכן כדי לקבל את סדר הגיליון יש למיין לפי `order`, בהשוואה בסדר יחידות הקוד. ניתוח נותן לשורות של קובץ מפתחות `order` לפי הסדר שבו השורות מופיעות, כך שהן נקראות בחזרה בסדר שבו הקובץ כתב אותן.  
למסמך שאין בו את המילונים, כגון מסמך שנשמר לפני גרסה `4.2.0`, אין מילים, מונחים או תחומים. עורך בגרסה שקודמת ל-`4.2.0` משמיט את שלושתם כשהוא טוען מסמך, ולכן שמירה בו מאבדת כל מילה, מונח ותחום.

### אוסף: wordEntities {#collection-wordentities}

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

מילה היא אחת מהמילים שמהן מורכב שם לוגי, ו-`abbreviation` הוא מה שמייצג אותה בשם פיזי. `synonyms` מפרט כתיבים אחרים של המילה, ו-`forbiddenWords` מפרט מילים שאסור להשתמש בהן במקומה, ובשניהם הערכים מופרדים בפסיקים.

### אוסף: termEntities {#collection-termentities}

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

מונח הוא שם לוגי שלם. טבלה או עמודה שה-`logicalName` שלה תואם ל-`name` גוזרת את `physicalName`, או, כל עוד הוא ריק, שם שמורכב מהקיצורים של המילים, ועמודה גם מקבלת את התחום ש-`domainId` מציין, `''` כשאין תחום (ראו [גזירת שמות פיזיים](../../guide/guides/dictionary.md#deriving-physical-names)). `synonyms` מופרד בפסיקים. ניתוח מנקה `domainId` שאינו מציין אף תחום, כמו בעמודה.

### אוסף: domainEntities {#collection-domainentities}

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

תחום הוא סוג נתונים בעל שם, ו-`dataType` מכיל אותו כפי שעמודה מכילה אותו, כולל האורך, כגון `NUMERIC(10)`. עמודה או מונח מקושרים לתחום דרך המזהה שלו, והעורך נותן לכל עמודה מקושרת את סוג הנתונים של התחום (ראו [תחומים וסוגי נתונים](../../guide/guides/dictionary.md#domains-and-data-types)).

## JSON Schema {#json-schema}

קובץ הסכמה הקנוני מתפרסם בכתובת [json-schema/schema.json](https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json), וניתן להפנות אליו ישירות באמצעות `$schema`.

```json
{
  "$schema": "https://raw.githubusercontent.com/dineug/erd-editor/main/json-schema/schema.json",
  "version": "3.0.0"
}
```

כשמציבים את `$schema` בראש קובץ `.erd.json`, עורכים שמבינים JSON Schema, כגון VS Code, מאמתים את המסמך ומשלימים אוטומטית את השדות שלו במהלך העריכה.

החל מגרסה `4.0.0`, הסכמה מתארת רק את צורת האחסון. כל אובייקט שיש לו שדות בעלי שם הוא סגור (`additionalProperties: false`), כל שדה שצורת האחסון כותבת תמיד הוא חובה, שדה שהיא משמיטה כל עוד אין בו דבר מוזכר בה אבל אינו חובה, ואף שדה שהיא משמיטה תמיד אינו מוזכר בה. לכן היא דוחה את ערך זמן הריצה. היא דוחה גם קובץ שנשמר לפני גרסה `4.0.0`, עם ה-`meta`, הרוחבים, ה-`zIndex`, ה-`ignoreSaveSettings` וכל השאר, עד שעורך בגרסה `4.0.0` ומעלה שומר את הקובץ הזה שוב. קובץ שנשמר על ידי גרסה `3.2.0` ומעלה כבר מציין את כתובת ה-URL של הסכמה הזו, שמצביעה על הענף `main`, ולכן עורך שמאמת מולה מתריע כבר עכשיו על הקובץ. קובץ שנשמר על ידי גרסה `3.0.0` או `3.1.0`, או מסמך v2, אינו מציין `$schema`.

החל מגרסה `4.2.0`, הסכמה כבר אינה דורשת את שדות הטקסט של ישות, רשימות של `doc`, אוספים או את `collections` עצמו, שצורת האחסון משמיטה כל עוד אין בהם דבר. היא עדיין מקבלת קובץ שנשמר על ידי גרסה `4.0.0` או `4.1.0`. היא מציינת את השדות החדשים: `nameViewMode`, שמקבל רק את `"logical"` ו-`"both"`; את `logicalName` ואת `nameDerived` של טבלה, כש-`nameDerived` מקבל רק את `true`; את `logicalName` ו-`domainId` של עמודה; ואת שלושת המילונים, כל אחד עם שורת הכותרות שלו ושורות של מחרוזות. `canvasType` מפרט את כרטיסיית מילון, `columnOrder` מקבל שבעה או תשעה מספרים שלמים, והתיאורים של `show`, `columnOrder`, `lockSettings` ו-`options` מציינים את הסיביות החדשות.

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
