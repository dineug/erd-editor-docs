---
sidebar_position: 4
description: כל הכלים ששרת ה-MCP של erd-editor מציע – קריאת מסמך דף אחר דף, 54 כלי העריכה, erd_batch, וכיצד נראים תוצאה וסירוב.
---

# כלים

השרת מציע 63 כלים: חמישה כלי סשן, שלושה כלי קריאה, 54 כלי עריכה, אחד לכל פעולת עריכה, ו-`erd_batch`, שמריץ כמה כלי עריכה כעריכה אחת.

כל כלי מלבד `erd_list_documents` מקבל את ה-`path` של המסמך כארגומנט הראשון שלו, והטבלאות שלהלן משמיטות אותו.
ארגומנט שמסומן ב-`?` הוא אופציונלי.

## כלי סשן {#session-tools}

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_list_documents` | | מציג רשימה של מסמכי ERD עם `path`, `open`, `active`, `dirty` ו-`readonly`: את המסמכים של העורך שמשרת את תיקיית העבודה, וב-IDE של JetBrains מכל הפרויקטים הפתוחים, ואחרת את קובצי ה-ERD שתחת תיקיית העבודה. |
| `erd_open_document` | `create?` | פותח מסמך לעריכה, ב-ERD Editor של העורך שמשרת אותו, אם יש כזה. עם `create` הוא יוצר תחילה את הקובץ אם הוא חסר, ושם ללא סיומת מקבל `.erd.json`. |
| `erd_save` | | שומר מסמך שעורך מחזיק. VS Code משאיר את העריכות של הסוכן לא שמורות עד שקוראים לכלי הזה; Obsidian ו-IDE של JetBrains שומרים אותן כפי שהם שומרים את העריכות של המשתמש, והכלי הזה כותב אותן מיד. במצב ללא ממשק, כל עריכה כבר נכתבה, והכלי הזה אינו עושה דבר. |
| `erd_undo` | | מבטל את העריכה האחרונה שהסוכן הזה ביצע, ולעולם לא את העריכות של המשתמש. הוא מדלג על קריאות שלא יצרו צעד ביטול ומציין אותן בשמן. |
| `erd_redo` | | מחיל שוב את העריכה ש-`erd_undo` ביטל לאחרונה. |

לגבי מה שהשמירה וביטול הפעולה עושים בכל מצב, ראו [מצב חי ומצב ללא ממשק](./live-and-headless.md).

## קריאת מסמך {#reading-a-document}

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | ההגדרות והספירות, ואחריהן דף של טבלאות עם האינדקסים והקשרים שלהן, כל טבלה עם המזהה שלה, המיקום והגודל שלה בבד הציור, מספר העמודות שלה, וקבוצת הטבלאות שלה, אם היא שייכת לאחת. אלא אם מתבצע חיפוש, אחרי הטבלאות באות קבוצות הטבלאות ואחריהן הפתקים. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | הישויות שצוינו, במלואן: טבלאות עם העמודות שלהן וקבוצת הטבלאות שלהן, קשרים עם העמודות שלהם וה-`onDelete` וה-`onUpdate` שלהם, אינדקסים עם העמודות שלהם, פתקים עם הטקסט שלהם, קבוצות טבלאות עם הטבלאות שלהן. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | המסמך כולו בבת אחת באחד מארבעה פורמטים, או ה-DDL של טבלאות או קבוצות טבלאות מסוימות בלבד. |

סוכן מוצא מזהים באמצעות `erd_list`, קורא עמודות ופרטים אחרים באמצעות `erd_get`, ומעביר את המזהים האלה לכלי העריכה.
הגודל של טבלה ב-`erd_list` הוא המלבן שהיא תופסת בבד הציור: הגובה מדויק, והרוחב משוער.
קבוצת טבלאות מופיעה ברשימה לפי המלבן שהיא שומרת, עם השם שלה, הצבע שלה ומספר הטבלאות שהיא מכילה.
כל קשר מופיע ברשימה פעם אחת, עם אחת משתי הטבלאות שלו.
ההגדרות ש-`erd_list` ו-`erd_read` מדווחים עליהן הן אלה שהקובץ שומר – ראו [הגדרות](#settings).

`erd_read` מקבל אחד מארבעה פורמטים:

| `format` | מה הוא מחזיר |
| --- | --- |
| `snapshot` | JSON תמציתי עם כל ישות והמזהה שלה, כולל קבוצות הטבלאות, ועם ההגדרות יחד עם הסקריפטים של סכמת SQL. הוא משמיט את מה שמשתנה מצופה אחד לאחר: הרוחבים שנמדדו, סדר השכבות, התצוגה והכרטיסייה. בסכמה גדולה הוא גדול. |
| `sql` | DDL לאחד משמונה מסדי הנתונים, `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` או `SQLite`. ברירת המחדל של `vendor` היא מסד הנתונים שהמסמך מוגדר אליו. ה-DDL של המסמך כולו כולל את הסקריפטים שלו שלפני הטבלאות ואחריהן. עם `tableIds`, `tableNames` או `groupNames`, רק הטבלאות האלה, עם המפתחות הזרים שהן מכילות, וללא סקריפטים. המפתחות הזרים כוללים את פעולות ה-ON DELETE וה-ON UPDATE שלהם, מלבד אלה שמסד נתוני היעד משמיט – ראו [ON DELETE ו-ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | המסמך כולו בדיוק כפי ששמירה כותבת את הקובץ, כולל עריכות שהעורך עדיין לא שמר – ראו [צורת אחסון וערך זמן ריצה](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | רק הסקריפטים של המסמך שלפני הטבלאות ואחריהן, בצורה `{"before":"…","after":"…"}`, כל אחד מהם ריק כשאינו מוגדר, ללא תלות בגודל הסכמה. |

רק הפורמט `sql` מקבל את `vendor`, `statements`, `header`, `tableIds`, `tableNames` ו-`groupNames`, ופורמט אחר דוחה אותם.

- `statements`: `create`, ברירת המחדל; `ifNotExists`, שכותב `CREATE TABLE IF NOT EXISTS` ב-MySQL, MariaDB, PostgreSQL, SQLite ו-Databricks ו-`CREATE TABLE` רגיל בשאר מסדי הנתונים; או `recreate`, שמוחק את הטבלאות לפני שהוא יוצר אותן, ובמקום זאת Snowflake כותב `CREATE OR REPLACE TABLE`.
- `header`: `none`, ברירת המחדל; `use`, שבוחר את מסד הנתונים או את הסכמה ששם מסד הנתונים של המסמך מציין; או `createAndUse`, שיוצר אותו תחילה. ב-Oracle יש רק `use`, ולכן שם `createAndUse` כותב `use`, וב-PostgreSQL יש רק `createAndUse`, ולכן שם `use` אינו כותב כותרת. SQLite אינו כותב כותרת, ואף מסד נתונים אינו כותב כותרת כל עוד שם מסד הנתונים ריק או אינו מזהה פשוט.
- `groupNames`: הטבלאות של קבוצות הטבלאות שצוינו, לפי השם, ללא תלות ברישיות, יחד עם הטבלאות של `tableIds` ו-`tableNames`. שם שאינו תואם אף קבוצה נדחה עם `notFound`. קבוצה שאינה מכילה טבלה אינה מוסיפה אף טבלה, וקריאה שלא נותרה בה אף טבלה, כמו כשכל הקבוצות שצוינו ריקות ולא צוינה אף טבלה, נדחית עם `invalidArgs`.

`statements` ו-`header` חלים גם על ה-DDL של טבלאות מסוימות. הם פועלים כמו האפשרויות `Statements` ו-`Header` בכרטיסיית [סכמת SQL](../guide/guides/schema-sql.md#options-panel) של העורך, אף שהכרטיסייה מתחילה ב-`If not exists` וב-`CREATE + USE`.
השמות נתחמים בסוג המירכאות שהקובץ שומר, כלומר בסוג הנעול כל עוד `Bracket Type` נעול – ראו [נעילה](../guide/guides/settings.md#lock).

### סכמות גדולות {#large-schemas}

גם סכמות של מאות או אלפי טבלאות עובדות.
קריאה מחזירה לכל היותר 40,000 תווים, מתחת לסף שבו Claude Code מעביר תוצאת כלי לקובץ נפרד.

- `erd_list` מחזיר כברירת מחדל דף של 100, תחילה הטבלאות, אחריהן קבוצות הטבלאות ואחריהן הפתקים, ומציין היכן מתחיל הדף הבא באמצעות `nextOffset` ו-`note`. יש להעביר את ה-`nextOffset` הזה כ-`offset`, עם אותו `query`.
- `query` מוצא טבלאות לפי מילים בשם או בהערה של טבלה או של עמודה, ללא תלות ברישיות. טבלאות ששמותיהן מכילים יותר מהמילים מופיעות ראשונות. חיפוש אינו מציג קבוצות טבלאות או פתקים.
- `namesOnly` מציג רק את שמות הטבלאות, כ-2,000 שמות קצרים בתשובה אחת.
- `erd_get` ו-`erd_read` מקבלים את `tableNames` בנוסף למזהים, ו-`erd_read` מקבל את `groupNames`, כך שסוכן שמבקשים ממנו שאילתת SQL על סכמה גדולה קורא רק את ה-DDL של הטבלאות שהוא צריך.
- `erd_get` מציג תחת `missing` מזהים ושמות שאינם מציינים דבר, ותחת `notReturned` את המזהים שלא היה להם מקום בתשובה אחת, כדי לבקש אותם שוב.
- קריאה גדולה מדי לתשובה אחת נדחית עם `tooLarge`, ועם הסבר כיצד לצמצם אותה.

## כלי עריכה {#edit-tools}

המזהים מגיעים מ-`erd_list` ומ-`erd_get`, או מה-`createdIds` של הקריאה שיצרה את הישות.
מזהה חדש מורכב מ-25 אותיות קטנות וספרות, כגון `03h17be2plxpj5n59tqag7ogj`, ואילו מזהה שכבר קיים במסמך שומר על צורתו, ולכן אין להסיק דבר מצורתו של מזהה.
`x` ו-`y` הם הקצה השמאלי והקצה העליון בבד הציור, בפיקסלים, וצבע הוא צבע CSS הקסדצימלי כגון `#3b82f6`, או מחרוזת ריקה, שמסירה את הצבע.

### טבלאות {#tables}

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_table` | | מוסיף טבלה ריקה במקום פנוי ומחזיר את המזהה שלה ב-`createdIds`. |
| `erd_remove_table` | `tableId` | מסיר טבלה יחד עם העמודות שלה, האינדקסים שלה וכל קשר שנוגע בה. |
| `erd_change_table_name` | `tableId`, `value` | משנה את שמה של טבלה. |
| `erd_change_table_comment` | `tableId`, `value` | קובע את ההערה של טבלה. מחרוזת ריקה מנקה אותה. |
| `erd_change_table_color` | `tableId`, `color` | קובע את הצבע של טבלה. |
| `erd_move_table` | `tableId`, `x`, `y` | מזיז טבלה למיקום בבד הציור. |
| `erd_move_tables` | `positions` | מזיז כמה טבלאות בעריכה אחת, שקריאה אחת ל-`erd_undo` מבטלת. `positions` מכיל `{ tableId, x, y }` לכל טבלה, כל טבלה פעם אחת לכל היותר. |
| `erd_sort_tables` | | ממקם את כל הטבלאות בשורות לרוחב בד הציור, בסדר עולה של מספר העמודות, כפי ש-`erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ו-`erd_import_aml` ממקמים אותן. הטבלאות של קבוצת טבלאות נשארות יחד, והמלבן של כל קבוצה מותאם סביבן. |

### עמודות {#columns}

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_column` | `tableId` | מוסיף עמודה ריקה לטבלה ומחזיר את המזהה שלה ב-`createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | מסיר עמודות מטבלה אחת, יחד עם הקשרים והרשומות באינדקסים שמשתמשים בהן. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | משנה את שמה של עמודה. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | קובע את סוג הנתונים, כגון `INT` או `VARCHAR(255)`. כל עוד [סנכרון סוג הנתונים בקשרים](../guide/guides/settings.md#relationship-datatype-sync) מופעל, השינוי עובר לאורך הקשרים בשני הכיוונים, כפי שקורה בעורך: סוג serial מגיע למפתחות הזרים כסוג המספר השלם שהוא מאחסן, כפי ש-`erd_add_relationship` מעתיק אותו, ומפתח serial שומר על הסוג שלו כשאחד מהמפתחות הזרים שלו משתנה, מה שעוצר שם את השינוי. הפעלת הסנכרון וכיבויו שמורים למשתמש, ו-`erd_list` מדווח עליו כ-`relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | קובע את ערך ברירת המחדל, כטקסט SQL. מחרוזת ריקה מנקה אותו. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | קובע את ההערה. מחרוזת ריקה מנקה אותה. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` הופך את העמודה לחלק מהמפתח הראשי, ו-`false` מוציא אותה ממנו. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | קובע אם העמודה ייחודית. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | קובע אם העמודה היא `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | קובע אם לעמודה יש מספור אוטומטי. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | מזיז עמודה בתוך הטבלה שלה למיקום של עמודה אחרת. |

### קשרים {#relationships}

`relationshipType` הוא הקרדינליות בקצה של טבלת הבן: `ZeroOne`, `ZeroN`, `OneOnly` או `OneN`.
טבלת ההתחלה היא טבלת האב, הצד שאליו מפנים ושמחזיק את המפתח הראשי, וטבלת הסיום היא טבלת הבן.
`onDelete` ו-`onUpdate` הם פעולות ה-ON DELETE וה-ON UPDATE של המפתח הזר: `none`, `noAction`, `cascade`, `setNull`, `setDefault` או `restrict`.
`none` אינו כותב פסוקית, ולכן חלה ברירת המחדל של מסד הנתונים – ראו [ON DELETE ו-ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
פעולה שהושמטה ב-`erd_add_relationship` או ב-`erd_link_columns` היא `none`.

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | יוצר קשר בין שתי טבלאות. הוא מעתיק את המפתח הראשי של טבלת האב לטבלת הבן כעמודות מפתח זר, ויוצר תחילה עמודת מפתח ראשי אם אין לטבלת האב כזו. כל עמודת מפתח זר מקבלת את השם ששרטוט קשר בעורך נותן לה: המפתח `id` של `users` נותן `users_id`, ומפתח כגון `member_id` שומר על שמו – ראו [שמות עמודות של מפתחות זרים](../guide/guides/relationship-editing.md#foreign-key-column-names). כל אחת מעתיקה את סוג הנתונים של המפתח שלה, אלא שמפתח serial נותן את סוג המספר השלם שהוא מאחסן, כגון `integer` עבור `serial4`, ו-`serial` לבדו נשאר `serial` מחוץ ל-PostgreSQL, MySQL ו-MariaDB – ראו [קשרים מזהים](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` מכיל את עמודת המפתח החדשה הזו אם נוצרה, את עמודות המפתח הזר, ובסוף את המזהה של הקשר. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | משרטט קשר בין עמודות שכבר קיימות, ומצמיד עמודות התחלה לעמודות סיום לפי המיקום. הוא אינו משנה שם של אף עמודה ואינו משנה אף סוג נתונים. |
| `erd_remove_relationship` | `relationshipId` | מסיר קו קשר. עמודות המפתח הזר שלו נשארות בטבלה. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | משנה את הקרדינליות של קשר. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | קובע את פעולת ה-ON DELETE של קשר: מה מחיקת שורת אב עושה לשורות הבן שלה. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | קובע את פעולת ה-ON UPDATE של קשר: מה שינוי מפתח אב עושה לשורות הבן שלו. |

`erd_add_relationship` נותן שמות לעמודות המפתח הזר בזמן שהוא רץ, ולכן יש לתת תחילה שם לטבלת האב ולמפתח הראשי שלה.

אף כלי אינו משנה את העמודות של קשר קיים כפי שעושה [מיפוי עמודות](../guide/guides/relationship-editing.md#map-columns) בעורך.
כדי למפות קשר לעמודות אחרות, יש להריץ את `erd_remove_relationship`, שמשאיר את עמודות המפתח הזר שלו בטבלה, ואת `erd_link_columns` עם העמודות הרצויות, ב-`erd_batch` אחד, שקריאה אחת ל-`erd_undo` מבטלת.

### אינדקסים {#indexes}

מזהה של עמודת אינדקס הוא רשומה ברשימת העמודות של האינדקס ש-`erd_get` מחזיר, ולא המזהה של עמודת הטבלה.

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_index` | `tableId` | מוסיף אינדקס ריק לטבלה ומחזיר את המזהה שלו ב-`createdIds`. |
| `erd_remove_index` | `indexId` | מסיר אינדקס. |
| `erd_change_index_name` | `indexId`, `value` | משנה את שמו של אינדקס. |
| `erd_set_index_unique` | `indexId`, `value` | קובע אם האינדקס ייחודי. |
| `erd_add_index_column` | `indexId`, `columnId` | מוסיף עמודה של הטבלה של האינדקס ומחזיר את המזהה של עמודת האינדקס החדשה. עמודה שכבר נמצאת באינדקס נשארת ללא שינוי. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | מסיר עמודה אחת מאינדקס. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | מזיז עמודה בתוך אינדקס למיקום של עמודה אחרת שלו. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | קובע את סדר המיון של עמודה אחת באינדקס, `ASC` או `DESC`. |

### פתקים {#memos}

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_memo` | | מוסיף פתק ריק במקום פנוי ומחזיר את המזהה שלו ב-`createdIds`. |
| `erd_remove_memo` | `memoId` | מסיר פתק. |
| `erd_change_memo_value` | `memoId`, `value` | מחליף את הטקסט של פתק. |
| `erd_change_memo_color` | `memoId`, `color` | קובע את הצבע של פתק. |
| `erd_move_memo` | `memoId`, `x`, `y` | מזיז פתק למיקום בבד הציור. |
| `erd_resize_memo` | `memoId`, `width`, `height` | משנה את הגודל של פתק. הרוחב חייב להיות לפחות כ-`116` פיקסלים, והגובה לפחות `100`. הוא אינו יוצר צעד ביטול, כי העורך רושם שינוי גודל של פתק רק מגרירה. |

כל עוד הפתקים מוסתרים באמצעות [View Option](../guide/guides/table-related-functions.md#table-view-options) ← `Memos`, `erd_add_memo` עדיין מוסיף פתק, והוא נשאר מוסתר עד שהפתקים מוצגים שוב.
`erd_list` ו-`erd_get` מציגים גם פתקים מוסתרים.

### קבוצות טבלאות {#table-groups}

קבוצת טבלאות היא מלבן בעל שם שמוצג מאחורי הטבלאות שלה, והצבע שלה מופיע על המלבן ולרוחב הכותרות של הטבלאות שלה – ראו [קבוצות טבלאות](../guide/guides/table-groups.md).
טבלה שייכת לקבוצה אחת לכל היותר. `erd_move_table`, `erd_move_tables` ו-`erd_move_table_group` לעולם אינם משנים אילו טבלאות קבוצה מכילה, בכל מקום שבו הם ממקמים טבלה, ואילו בעורך טבלה מצטרפת לקבוצה או עוזבת אותה לפי המקום שבו משחררים אותה – ראו [הוספה והסרה של טבלאות](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` ו-`erd_set_table_group` מכניסים טבלאות לקבוצה, ו-`erd_remove_table_group` משאיר את הטבלאות שלה ללא קבוצה.
קבוצה שומרת מלבן, ברוחב `160` פיקסלים לפחות ובגובה `100` לפחות, כולל שורת הכותרת, והעורך מציג את המלבן מוגדל כך שיכיל כל אחת מהטבלאות שלה.

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | מוסיף קבוצה ומחזיר את המזהה שלה ב-`createdIds`. יש להעביר את `tableIds` או מלבן, כלומר את `x`, `y`, `width` ו-`height` יחד. עם `tableIds`, כל טבלה עוזבת כל קבוצה שהייתה בה, והמלבן מותאם סביבן כפי ש[קיבוץ הטבלאות שנבחרו](../guide/guides/table-groups.md#grouping-selected-tables) מתאים אותו. מלבן קולט כל טבלה שאינה בקבוצה ושמרכזה נמצא בתוכו, כפי ש[שרטוט קבוצה](../guide/guides/table-groups.md#drawing-a-group) עושה. `name` ריק משאיר את הקבוצה ללא שם. קריאה אחת ל-`erd_undo` מסירה את הקבוצה ומחזירה כל טבלה לקבוצה שהייתה בה. |
| `erd_remove_table_group` | `groupId` | מסיר קבוצה. הטבלאות שלה נשארות במקומן, ללא קבוצה. |
| `erd_change_table_group_name` | `groupId`, `value` | משנה את שמה של קבוצה. מחרוזת ריקה משאירה אותה ללא שם. |
| `erd_change_table_group_color` | `groupId`, `color` | קובע את הצבע של קבוצה. |
| `erd_move_table_group` | `groupId`, `x`, `y` | מזיז קבוצה כך שהמלבן שלה מתחיל בנקודה הזו, ואת הטבלאות שלה באותו מרחק, כפי שעושה גרירה של שורת הכותרת שלה. הזזה של פחות מ-20 פיקסלים, בסכום התזוזה האופקית והאנכית, אינה יוצרת צעד ביטול. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | קובע את המלבן של קבוצה, והטבלאות שלה נשארות במקומן. השמטה של `x` ו-`y` משאירה את הפינה של המלבן במקומה. מלבן שלא יכיל את הטבלאות של הקבוצה עם הריווח שלהן נדחה, עם הודעה שמציינת את המלבן שהוא חייב להכיל. |
| `erd_set_table_group` | `tableIds`, `groupId` | מכניס טבלאות לקבוצה, וכל אחת מהן עוזבת כל קבוצה שהייתה בה. הערך `null` או מחרוזת ריקה ב-`groupId` מוציאים אותן מכל קבוצה. |

כל עוד הקבוצות מוסתרות באמצעות `View Option` ← `Table Groups`, הכלים האלה עדיין מוסיפים ומשנים קבוצות, שנשארות מוסתרות עד שהקבוצות מוצגות – ראו [הסתרת קבוצות](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` שומר את הטבלאות של כל קבוצה יחד, `erd_import_dbml` ו-`erd_import_json` מביאים קבוצות – ראו [ייבוא](#import) – ו-`erd_read` כותב את ה-DDL של קבוצות נבחרות באמצעות `groupNames`.
גרסה של ERD Editor שקודמת לקבוצות הטבלאות משמיטה את הקבוצות של קובץ כשהיא שומרת אותו, כפי שעושים הרחבת VS Code בגרסה שקודמת ל-`4.0.0` והתוספים ל-Obsidian ול-JetBrains בגרסה שקודמת ל-`1.0.0` – ראו [עדכון](./installation.md#updating).

### הגדרות {#settings}

סוכן קובע את ההגדרות של הסכמה עצמה: מסד הנתונים, השם שלו והסקריפטים של [סכמת SQL](../guide/guides/schema-sql.md).
כל הגדרה אחרת שהמסמך שומר נקבעת בידי המשתמש בעורך: המתגים של [אפשרויות התצוגה](../guide/guides/table-related-functions.md#table-view-options), האפשרויות של כרטיסיית [הגדרות](../guide/guides/settings.md), שפת הקוד וסגנונות השמות של מחולל הקוד, סוג המירכאות וה[נעילות](../guide/guides/settings.md#lock).
אף כלי אינו משנה אותן, מלבד כלי הייבוא במצב `replace`: `erd_import_json` מביא את ההגדרות והנעילות של המסמך שהוא טוען, וארבעת האחרים מחזירים את התצוגה לתחילת בד הציור – ראו [ייבוא](#import).
השרת בגרסה `1.0.0` הסיר את הכלים שקבעו אותן: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` ו-`erd_set_show`.

`erd_list` והפורמט `snapshot` של `erd_read` מדווחים על ההגדרות כפי שהקובץ שומר אותן, כש-`lockSettings` מכיל דגל אחד לכל נעילה: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` ו-`bracketType`.
שפת קוד, סגנון שמות או סוג מירכאות נעולים מדווחים בערך הנעול שלהם, זה שהקובץ שומר ושכל עורך נפתח בו, בלי קשר למה שמוצג במסך של עורך. התצוגה והכרטיסייה אינן מדווחות.

`erd_set_ddl_script` יוצר צעד ביטול. `erd_set_database` ו-`erd_set_database_name` אינם יוצרים צעד כזה, ולכן `erd_undo` אינו יכול לבטל אותם.

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_set_database` | `value` | קובע את מסד הנתונים: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` או `Snowflake`. הוא בוחר את סוגי הנתונים של מסד הנתונים, ואת ה-DDL ש-`erd_read` כותב כשלא ניתן `vendor`. |
| `erd_set_database_name` | `value` | קובע את שם מסד הנתונים, שהכותרות `use` ו-`createAndUse` של `erd_read` מציינות. |
| `erd_set_ddl_script` | `position`, `sql` | קובע אחד משני הסקריפטים שנכתבים סביב הטבלאות – ראו [סקריפטים לפני הטבלאות ואחריהן](../guide/guides/schema-sql.md#before-and-after-scripts). `position` הוא `before`, שנכתב לפני הטבלאות, כגון `CREATE EXTENSION` או `CREATE SCHEMA`, או `after`, שנכתב אחריהן, כגון `GRANT` או `CREATE VIEW`. `sql` מחליף את הסקריפט כולו, עד 10,000 תווים, ומחרוזת ריקה מסירה אותו. יש לקרוא תחילה את הסקריפט הנוכחי באמצעות הפורמט `scripts` של `erd_read`. |

סקריפט נכנס כמות שהוא ל-DDL של כל מסד נתונים, ולכן יש לכתוב אותו עבור מסד הנתונים של המסמך. ב-MSSQL, שורת `GO` מתווספת אחרי סקריפט שהשורה האחרונה שלו אינה `GO`.
גרסה של ERD Editor שקודמת לסקריפטים האלה משמיטה את הסקריפטים של קובץ כשהיא שומרת אותו, כפי שעושים הרחבת VS Code בגרסה שקודמת ל-`4.0.0` והתוספים ל-Obsidian ול-JetBrains בגרסה שקודמת ל-`1.0.0` – ראו [עדכון](./installation.md#updating).

### ייבוא {#import}

הכלים האלה קוראים סכמה כפי שעושה תפריט הייבוא של העורך – ראו [ייבוא וייצוא של קבצים](../guide/guides/file-import-export.md).
כל אחד מהם מקבל את הטקסט כ-`value`, ואת `mode`: `replace`, ברירת המחדל, או `append`.

| כלי | ארגומנטים | מה הוא עושה |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | טוען DDL של SQL, משפטי `CREATE TABLE` וכדומה. |
| `erd_import_graphql` | `value`, `mode?` | טוען SDL של GraphQL. |
| `erd_import_dbml` | `value`, `mode?` | טוען DBML. כל `TableGroup` הופך לקבוצת טבלאות של הטבלאות שהוא מציין – ראו [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | טוען AML. |
| `erd_import_json` | `value`, `mode?` | טוען מסמך JSON של erd-editor, כגון קובץ `.erd.json` אחר. |

`replace` מחליף את המסמך, ו-`erd_undo` משחזר את המסמך הקודם:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` ו-`erd_import_aml` מחליפים כל טבלה, קשר, אינדקס, פתק וקבוצת טבלאות. הם שומרים על ההגדרות של המסמך, כולל הנעילות שלו, מלבד התצוגה, שחוזרת לתחילת בד הציור ב-100%.
- `erd_import_json` מחליף את המסמך כולו, כולל ההגדרות שלו: ההגדרות והנעילות של ה-JSON באות במקום אלה של המסמך הזה, ו-JSON שאינו מתעד נעילות מפעיל את כל הנעילות ומציב את התצוגה בתחילת בד הציור. כדי לשמור על ההגדרות של המסמך הזה, יש להתחיל מהטקסט שהפורמט `json` של `erd_read` מחזיר. טקסט ריק נותן מסמך חדש, כמו זה ש-`erd_open_document` יוצר עם `create`.

`append` מוסיף את הייבוא למסמך, כפי שעושה [ייבוא והוספה](../guide/guides/file-import-export.md#import-and-add) בעורך, וקריאה אחת ל-`erd_undo` מסירה את כל התוספת:

- מה שהטקסט מכיל נכנס כישויות חדשות עם מזהים חדשים, בבלוק שמתחת לכל מה שהמסמך מכיל, כולל פתקים וקבוצות טבלאות מוסתרים, ומיושר לקצה השמאלי של התוכן הקיים. כל טבלה והגדרה שכבר קיימות נשארות, כולל טבלה בעלת אותו שם: שום דבר אינו מתמזג לפי שם.
- קשרים ואינדקסים נוצרים רק בין הטבלאות שהייבוא מביא, ולכן מפתח זר לטבלה שהטקסט אינו מצהיר עליה מושמט.
- `erd_import_sql`, `erd_import_graphql` ו-`erd_import_aml` מוסיפים טבלאות עם הקשרים והאינדקסים שלהן, ו-`erd_import_dbml` גם את קבוצות הטבלאות שלו. `erd_import_json` מוסיף טבלאות, קשרים, אינדקסים, פתקים וקבוצות טבלאות, לעולם לא את ההגדרות שלו, ודוחה טקסט ריק.

מסמך JSON שומר על הסידור שלו, כולל קבוצות הטבלאות שלו: עם `replace` במקום שבו הוא ממקם את הטבלאות שלו, ועם `append` בתוך הבלוק שנוסף.
הטבלאות של SQL, GraphQL, DBML ו-AML נפרסות בשורות, בסדר עולה של מספר העמודות ועם הטבלאות של כל קבוצה יחד, כפי ש-`erd_sort_tables` ממקם אותן, ולעולם לא בפריסת `Flow`, שבה הייבוא של העורך עצמו פורס אותן כשהדבר אפשרי. ארבעת הכלים האלה דוחים טקסט ריק בשני המצבים.

## erd_batch {#erd_batch}

`erd_batch` מריץ כמה כלי עריכה לפי הסדר כעריכה אחת, הכול או כלום.

- `operations` מכיל עד 100 רשומות, כל אחת `{ tool, as?, args? }`, כש-`args` הם הארגומנטים של הכלי ללא `path`.
- הפעולות מנוסות תחילה על עותק של המסמך. פעולה שנדחית מצוינת בשמה, כגון `operations[1] erd_remove_table: …`, ושום דבר אינו מוחל.
- קריאה אחת ל-`erd_undo` מבטלת את כל האצווה, מלבד הפעולות שאין באפשרותה לבטל, שה-`undoNote` של התוצאה מציין: פעולות של כלי שאינו יוצר צעד ביטול, כגון `erd_set_database`, ופעולות ששינו את המסמך בלי ליצור צעד כזה, כגון `erd_move_table_group` קצר. `erd_undo` מדלג על אצווה שלא יצרה אף צעד ביטול. `historyEntries` בתוצאה סופר את הרשומות בהיסטוריית העורך שבתוך האצווה, ולא קריאות ל-`erd_undo`.
- בסשן במצב חי, העורך מקבל את האצווה כולה או אף לא חלק ממנה.

סוכן אינו יכול לדעת את המזהים שאצווה יוצרת לפני הקריאה, ולכן פעולה שקיבלה שם באמצעות `as` מאפשרת לפעולה מאוחרת יותר להפנות אליהם: `$name` או `$name.0` למזהה הראשון שהיא יצרה, `$name.1` לשני, ו-`$name.last` לאחרון.
שם מכיל אותיות ASCII, ספרות וקווים תחתונים, אינו מתחיל בספרה, ומציין פעולה אחת בלבד.
הפניה נפתרת רק במקום שבו ארגומנט מקבל מזהה של ישות, ולכן שם או הערה שכתוב בהם `$x` נשארים טקסט.

טבלה עם העמודות שלה וקשר, בקריאה אחת:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

הטבלה `users` והמפתח שלה `id` מקבלים שם לפני הקשר, ולכן עמודת המפתח הזר שהקשר מוסיף ל-`orders` היא `users_id`.

## תוצאות {#results}

עריכה מחזירה שורה אחת של JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| שדה | משמעות |
| --- | --- |
| `mode` | `live` או `headless` – ראו [מצב חי ומצב ללא ממשק](./live-and-headless.md). |
| `createdIds` | המזהים של מה שהקריאה יצרה, לפי הסדר. |
| `batches`, `historyEntries` | כמה אצוות שינויים הקריאה שלחה, וכמה רשומות בהיסטוריית העורך היא יצרה. |
| `undoable`, `undoNote` | `undoable` הוא `false` כש-`erd_undo` ידלג על הקריאה, ו-`undoNote` מסביר מדוע: הכלי אינו יוצר צעד ביטול, הקריאה שינתה את המסמך בלי ליצור צעד כזה, כפי שעושה `erd_move_table_group` של פחות מ-20 פיקסלים, או שהערך כבר היה במסמך. תוצאה של `erd_batch` כוללת תמיד `undoNote`. כשהאצווה יצרה צעד ביטול, ההערה מציינת שקריאה אחת ל-`erd_undo` מבטלת את האצווה, ומציינת כל פעולה שהביטול משאיר בתוקף; כשלא יצרה, התוצאה כוללת `undoable: false`, וההערה מציינת ש-`erd_undo` מדלג עליה. |
| `mismatch` | קיים כשהקריאה יצרה מספר אצוות או רשומות בהיסטוריה שונה ממה שהכלי מצהיר. |
| `notes` | קיים כשמשהו בסשן השתנה, כגון עורך שנסגר או הפסיק לשרת את המסמך, או קובץ שהשתנה בדיסק. |

סירוב הוא תוצאת שגיאה שכוללת קוד והודעה שמסבירה מה לעשות:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | סיבה |
| --- | --- |
| `notFound` | מזהה אינו מציין שום דבר שקיים כעת, או שהקובץ אינו קיים. |
| `invalidArgs` | ארגומנט חסר או שיש לו ערך שגוי. |
| `invalidPath` | הנתיב אינו מסמך ERD. ב-Windows, גם נתיב עם שם ש-Windows אינו שומר כפי שנכתב, או נתיב שמגיע למסמך שעורך מחזיק תחת נתיב אחר, שההודעה מציינת. |
| `invalidDocument` | הקובץ אינו מסמך שהעורך יכול לקרוא. |
| `tooLarge` | קריאה אינה נכנסת בתשובה אחת. |
| `blocked` | עורך שה-hub שלו כבוי מחזיק את המסמך. ההודעה מסבירה כיצד להפעיל אותו: ב-VS Code, לתת אמון בסביבת העבודה ולהפעיל את `dineug.erd-editor.agentHub.enabled`, או לטעון מחדש את החלון; ב-Obsidian, להפעיל את Coding agents, או לטעון מחדש את Obsidian; ב-IDE של JetBrains, להפעיל את Coding agents, או להפעיל מחדש את ה-IDE אם ההגדרה מופעלת. |
| `hubDisabled` | IDE של JetBrains מחזיק את המסמך רק בפרויקט שהוא אינו נותן בו אמון. קריאות עדיין עובדות; כדי לאפשר לסוכן לערוך, יש לתת אמון בפרויקט. |
| `conflict` | הקובץ השתנה בדיסק במהלך הקריאה. שום דבר לא נכתב. |
| `hubAppeared`, `hubGone` | עורך התחיל לשרת מסמך שהסוכן ערך בדיסק, או שהעורך ששירת אותו עדיין פועל, אבל קובץ הנעילה והחיבור שלו נעלמו. שום דבר לא נכתב. |
| `notSaved` | `erd_save` לא הצליח לשמור את המסמך של העורך. |
| `readonly` | העורך מחזיק את המסמך לקריאה בלבד, כגון קובץ שהוא אינו יכול לכתוב אליו או אינו יכול לקרוא כתרשים. כשאין עורך, הקובץ עצמו לקריאה בלבד, כגון קובץ Perforce או TFVC שלא בוצע עליו check out. שום דבר לא נכתב. |
| `protocolMismatch` | ההרחבה או התוסף של ERD Editor בעורך והשרת מדברים בגרסאות פרוטוקול שונות, כגון השרת בגרסה `1.0.0` עם הרחבת VS Code בגרסה `3.x`. גם קריאות נדחות, וההודעה מציינת את הצד שיש לעדכן – ראו [עדכון](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | ה-hub של עורך לא קיבל את החיבור, לא ענה בתוך 30 שניות, או ניתק במהלך הקריאה. ב-Windows, `hubUnreachable` פירושו גם ש-Windows מנע מהסוכן גישה ל-hub: העורך פועל עם יותר הרשאות מהסוכן, כמו כשהוא הופעל כמנהל מערכת והסוכן לא, או שהסוכן פועל בארגז חול. |

קודים אחרים נדירים יותר, וכל סירוב כולל הודעה שמסבירה מה קרה.

כלי העריכה, `erd_batch` ושלושת כלי הקריאה דוחים ארגומנט שהם אינם מצהירים עליו, או ארגומנט מסוג שגוי, בשגיאת invalid params של JSON-RPC (`-32602`) לפני שהם נוגעים במסמך, כך שארגומנט עם שגיאת כתיב לעולם אינו מושמט בשקט.
חמשת כלי הסשן מתעלמים מארגומנטים שהם אינם מכירים.
