---
sidebar_position: 1
description: התקנת @dineug/erd-editor מ-npm או מ-CDN, הוספת האלמנט המותאם אישית לדף, חיבור תיבות הדו-שיח של קבצים ושדרוג מגרסה 3.
---

# התקנה

```sh
npm install @dineug/erd-editor
```

החבילה היא ESM בלבד (`"type": "module"`) ומפיצה רק את התיקייה `dist` שלה.
אין לה build של CommonJS, ולכן `require('@dineug/erd-editor')` לא עובד.

תלויות זמן הריצה שלה נשארות חיצוניות, כייבואים לפי שם חבילה שה-bundler מאתר, מסיר מהם כפילויות ומבצע עליהם tree shaking.
ה-workers המשותפים שלה נוצרים כקובצי כניסה נפרדים תחת `dist/workers/` ונבנים באמצעות `new URL('./…', import.meta.url)`, צורת הכתיבה ש-Vite, webpack 5 ו-Rspack אורזים כנקודת כניסה של worker. ראו [Web Workers](#web-workers).
לדף שאין מאחוריו bundler יש build שני, עצמאי – ראו [תגית script](#script-tag).

## שימוש {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

ל-`<erd-editor>` אין גודל מובנה. יש לקבוע לו (או לאלמנט שמכיל אותו) רוחב וגובה מפורשים.
החל מגרסה `4.1.0`, [סייר](../guide/guides/explorer.md) פתוח מעוגן בתוך האלמנט, משמאל לבד הציור של ERD, ומצמצם את רוחב בד הציור במקום לכסות אותו. עורך חדש מתחיל כשהסייר סגור.
החלונית אינה מוצגת ברוחב קטן מ-`200px` ומשאירה לבד הציור לפחות `320px`, ולכן באלמנט צר מ-`520px` סייר פתוח אינו מוצג עד שהאלמנט מתרחב – ראו [לצד בד הציור](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` פותחת מסמך חדש וריק. השמה ל-`value`, לעומת זאת, טוענת מסמך כעריכה, ולכן הוא נרשם בהיסטוריית הפעולות.
החל מגרסה `4.0.0`, `editor.value` הוא המסמך בצורה שבה קובץ מכיל אותו, וזה מה שיש לשמור. `editor.runtimeValue` הוא המסמך כפי שהעורך מחזיק אותו, כולל ישויות שהוסרו: הוא משמש לאתחול שותף לעריכה ולעולם אינו נכתב לקובץ – ראו [runtimeValue](./erd-editor-element.md#runtimevalue).
החל מגרסה `4.0.0`, במסמך חדש גם כל [נעילות ההגדרות](../guide/guides/settings.md#lock) מופעלות: אזור התצוגה, הכרטיסייה, שפת הקוד במחולל הקוד, שני סגנונות השמות, סוג המירכאות, והחל מגרסה `4.2.0` גם [תצוגת השמות](../guide/guides/logical-names.md#name-view). גלילה, זום, מעבר בין כרטיסיות, החלפת תצוגת השמות או שינוי של אחת מההגדרות האחרות משאירים את `editor.value` כפי שהיה ואינם משגרים `change`. מסמך שנטען מטקסט שומר על הנעילות שהוא מציין. מסמך שאינו מציין אף נעילה, כגון כל קובץ שנשמר לפני גרסה `4.0.0`, נפתח כשכל הנעילות מופעלות, ברמת זום של 100% ובכרטיסיית ERD, בלי קשר לאזור התצוגה ולכרטיסייה שנשמרו בו. אזור התצוגה שלו נעול בנקודת הראשית `0, 0`, והתצוגה נפתחת במקום זאת על התרשים אם שום חלק מהתרשים אינו מוצג שם – ראו [setInitialValue](./erd-editor-element.md#setinitialvalue).
קובץ שנשמר לפני גרסה `4.2.0` נפתח כשתצוגת השמות נעולה על `Physical Names`, גם אם כל שאר הנעילות בו כבויות. עורך בגרסה `4.0.0` או `4.1.0` משאיר את הנעילה של תצוגת השמות כפי שהיא בשמירה אבל משמיט את התצוגה, ולכן קובץ של גרסה `4.2.0` שנשמר כשתצוגת השמות לא נעולה נשאר לא נעול, אבל נפתח מחדש בתצוגה `Physical Names`.
לגבי שאר ה-API, ראו [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` מאתר בעצמו את התלויות החיצוניות של החבילה, ולכן הקוד הזה עובד בלי bundler.
כתובת ה-URL ללא גרסה מגישה תמיד את הגרסה האחרונה. יש לקבע גרסה – `https://esm.run/@dineug/erd-editor@4.2.0` – כדי ששדרוג לגרסה ראשית חדשה לא יגיע לדף בלי הודעה מראש.
גרסה `4.0.0` היא בעצמה שדרוג כזה: דף שצריך להישאר בגרסה 3 מקבע את `@3.10.0` – ראו [שדרוג מגרסה 3](#upgrading-from-3x).

### תגית script {#script-tag}

החל מגרסה `3.6.0`, החבילה מפיצה גם build של UMD שבו כל התלויות וכל ה-workers המשותפים נמצאים בתוך קובץ אחד.
אליו מפנים השדות `unpkg` ו-`jsdelivr`, ולכן כתובת ה-URL הבסיסית של החבילה בכל אחד משני ה-CDN מגישה אותו, והוא מגדיר את `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

טעינת הקובץ רושמת את `<erd-editor>` באותו אופן; `window.ErdEditor` מכיל את שתי פונקציות ה-callback של הקבצים, `ErdEditor.setExportFileCallback` ו-`ErdEditor.setImportFileCallback`, וכן, החל מגרסה `3.9.2`, את `ErdEditor.createKeyBindingMap`. החל מגרסה `4.2.0`, הוא מכיל גם את `ErdEditor.dictionaryRowChords` – ראו [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
מפת ה-exports עדיין מפנה bundler אל מודולי ה-ES, ולכן התקנה מ-npm לעולם אינה משתמשת בקובץ הזה.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

החל מגרסה `4.0.0`, התכונה `enable-locale-picker` מוסיפה את הבורר `Display Language` בסרגל הכלים, והתכונה `enable-welcome-screen` מוסיפה את מסך הפתיחה שתרשים ריק מציג – ראו [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) ו-[enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
דף שטוען מסמך, כפי שנעשה ב[שימוש](#usage), מפעיל את `enableWelcomeScreen` אחרי ש-`setInitialValue()` טען אותו ולא בקוד ה-HTML, כך שהמסך לעולם אינו מהבהב מעל קובץ שעדיין נטען.
כל 25 שפות התצוגה כלולות בחבילה, הן ב-build של ES והן ב-build של תגית ה-script, ולכן אין קובץ שפה שצריך להגיש ואין מה לרשום. בלי הבורר ובלי קריאה ל-`setLocale()`, העורך מוצג באנגלית.

הוספת התכונה `readonly` כאן חוסמת עריכה: העורך מתעלם מהשמה ל-`value`, מקריאה ל-`clear()` ומכל קריאה ל-`setSchema*()` – כולל `setSchemaJSON()` וקריאה במצב הוספה – והאירוע `change` לעולם אינו משוגר. קריאת `editor.value` ו-`editor.runtimeValue` עדיין עובדת. במקום זאת, יש לטעון באמצעות `setInitialValue()`.

### רינדור בצד השרת {#server-side-rendering}

ייבוא החבילה רושם את האלמנט המותאם אישית ברמת המודול, ולכן הוא דורש DOM וזורק שגיאה ב-Node.
ב-Next.js, Nuxt, SvelteKit או Astro, יש לייבא אותה רק מנתיב קוד שרץ בצד הלקוח.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

ייבוא החבילה ממזג את `erd-editor` לתוך `HTMLElementTagNameMap`, כך שלאלמנט יש טיפוס גם בלי המרת טיפוס.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` מיוצא כדי לציין באמצעותו את הטיפוס של משתנים ו-props בקוד של המשתמש.
החל מגרסה `4.0.0`, החבילה מייצאת גם את הטיפוסים `LocaleCode`, `LocaleOption` ו-`SchemaSQLOptions` – ראו [נקודות כניסה](#entry-points). לאפשרויות שהמתודות `setSchema*()` מקבלות אין שם מיוצא; יש לחלץ אותן מהאלמנט, כמו ב-`Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## הדגשת תחביר {#syntax-highlighting}

החלוניות של סכמת SQL ושל מחולל הקוד מודגשות על ידי [Shiki](https://shiki.style), ב-worker משותף משלו, והחל מגרסה `4.0.0` גם הסקריפטים `Before tables` ו-`After tables` בכרטיסיית סכמת SQL.
החל מגרסה `3.7.0`, אין מה להתקין ואין מה לרשום: ה-worker נבנה בפעם הראשונה שחלונית קוד מוצגת, ולכן דף שאינו פותח אף חלונית כזו לעולם אינו מוריד את קובצי הדקדוק.

| | |
| --- | --- |
| שפות | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| ערכות נושא | `github-dark` ו-`github-light`, בהתאם למראה הבהיר או הכהה של העורך |

אלה בדיוק השפות שהחלוניות מפיקות: `JPA` מודגש כ-Java, `SQLAlchemy` כ-Python, `TypeORM`, `Sequelize`, `Drizzle` ו-`Zod` כ-TypeScript, `Doctrine` כ-PHP, `SeaORM` כ-Rust, `JSON Schema` כ-JSON, ו-`DBML` ו-`AML` כ-SQL, הדקדוק הקרוב ביותר שכלול בחבילה – ראו [מחולל קוד](../guide/guides/code-generator.md).

מנוע הביטויים הרגולריים כתוב ב-JavaScript רגיל, ולכן אף מדיניות של סביבה מארחת אינה צריכה את `wasm-unsafe-eval`.
היכן ש-`SharedWorker` חסר – Chrome ב-Android, Safari לפני גרסה 16.4 – הכישלון נרשם ביומן והקוד מוצג כטקסט רגיל; עדיין ניתן לערוך את הסקריפטים.

בשדרוג מגרסה `3.6.0` או מוקדמת ממנה: החבילה `@dineug/erd-editor-shiki-worker` כבר אינה מתפרסמת, והפונקציה `setGetShikiServiceCallback` הוסרה יחד איתה.
יש להסיר את ההתקנה ואת הרישום; דף שטען את ה-worker מ-CDN מסיר גם את תגית ה-`<script>` השנייה הזו.

## Web Workers {#web-workers}

העורך מריץ שלוש משימות במופעים של `SharedWorker`: הדגשת תחביר, ייצוא תמונות ופריסת הטבלאות שמאחורי ה[פריסה האוטומטית](../guide/guides/table-related-functions.md#auto-layout), [מצב הזרימה](../guide/guides/visualization.md#how-flow-is-placed) של כרטיסיית ויזואליזציה, והחל מגרסה `4.0.0`, מיקום הטבלאות של סכמה מיובאת.
שלושת ה-workers כלולים בתוך `@dineug/erd-editor`. אף אחד מהם אינו דורש הגדרה, אבל סביבה מארחת יכולה לחסום כל אחד מהם.
ה-worker שהריץ את איסוף האשפה של המסמך הוסר בגרסה `4.0.0`, יחד עם איסוף האשפה עצמו.

| Worker | בלעדיו |
| --- | --- |
| הדגשת תחביר | החלוניות של סכמת SQL ושל מחולל הקוד והסקריפטים של סכמת SQL נשארים טקסט רגיל |
| ייצוא תמונות | קובץ ה-PNG, קובץ ה-SVG, הלחצן `Copy to clipboard` והתצוגה המקדימה של תיבת הדו-שיח `Export image` מצוירים בתהליכון הראשי, מה שחוסם את הדף בזמן הציור |
| פריסת טבלאות | הפריסות `Flow`, `Tree - vertical` ו-`Tree - horizontal` של הפריסה האוטומטית, וכן מצב הזרימה של כרטיסיית ויזואליזציה, מסתיימים בהודעה `Could not place tables`; ייבוא שממוקם בפריסת זרימה – קובץ SQL, GraphQL, DBML או AML מ-`Import` או מ-`Import and Add`, או קריאה ל-`setSchema*()` עם `placement: 'auto'` – מציב את הטבלאות שלו בשורות, בלי שום הודעה; `Force` ומצב גרף אינם מושפעים, מכיוון שהם רצים בתוך העורך |

ייצוא התמונות ממתין עשר שניות לתשובה מה-worker שלו ואז מצייר בתהליכון הראשי, והדגשת התחביר משאירה את הקוד כטקסט רגיל ברגע שה-worker שלה נכשל, כך שסביבה מארחת שחוסמת workers פוגעת בביצועים ולא בפונקציונליות.
פריסת הטבלאות היא היוצא מן הכלל: המנוע שמחשב פריסה כבד יותר מהעורך עצמו ולעולם אינו נטען בתוך התהליך, ולכן היא ממתינה שלושים שניות ל-worker שלה במיקום הראשון, ואחרי שה-worker ענה היא נותנת לכל פריסה שישים שניות לחזור.
אם אחד מזמני ההמתנה פג, המיקום מסתיים כפי שהוא מסתיים בלי ה-worker. הפריסה האוטומטית מציגה את `Placing tables` מיד כשהיא מתחילה, ואילו מצב הזרימה וייבוא שממוקם בפריסת זרימה מציגים זאת רק אחרי שמיקום, כולל הפעלת ה-worker שלו, נמשך שש שניות.

ב-build שעובר דרך bundler, שלושתם נוצרים כקבצים לצד החבילה, ולכן CSP מחמיר דורש `worker-src 'self'` – ובנוסף `blob:` כשה-bundler מטמיע worker בתוך הקוד.
ב-build של [תגית script](#script-tag), שלושתם נמצאים בתוך הקובץ ככתובות URL מסוג `data:`, ולכן הדף הזה דורש במקום זאת `worker-src data:`.

## נקודות כניסה {#entry-points}

ייבוא של `@dineug/erd-editor` רושם את `<erd-editor>` כתופעת לוואי. מעבר לכך, החבילה מייצאת את טיפוס האלמנט, שתי פונקציות להגדרת callback, החל מגרסה `3.9.2` את צירופי המקשים של ברירת המחדל יחד עם הטיפוסים שלהם, החל מגרסה `4.0.0` את הטיפוסים של שפת התצוגה ואת טיפוס האפשרויות של `getSchemaSQL()`, והחל מגרסה `4.2.0` את צירופי המקשים של השורות בכרטיסיית מילון.

| ייצוא | תיאור |
| --- | --- |
| `ErdEditorElement` (טיפוס) | הממשק של האלמנט – ראו [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | מחליפה את ההורדה של הדפדפן, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | מחליפה את בורר הקבצים של הדפדפן, `({ type, op, accept, mode }) => void`; `mode` החל מגרסה `4.0.0`. החל מגרסה `4.2.0`, הפעולה `Import CSV` של כרטיסיית מילון פותחת את הבורר של הדפדפן גם כשמוגדרת פונקציית callback – ראו [תיבות דו-שיח של קבצים](#file-dialogs). |
| `createKeyBindingMap()` | מחזירה את צירופי המקשים של ברירת המחדל כ-`KeyBindingMap` חדש בכל קריאה – ראו [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (טיפוסים) | מפה של צירופי מקשים, האיחוד של שמות הפקודות שבה, וצירוף מקשים יחיד. |
| `dictionaryRowChords(map)` | החל מגרסה `4.2.0`. מחזירה, כ-`ShortcutOption[]` חדש בכל קריאה, את צירופי המקשים שבהם הרשת של כרטיסיית [מילון](../guide/guides/dictionary.md#adding-and-deleting-rows) מוסיפה ומוחקת שורות לפי ה-`KeyBindingMap` שמועבר אליה. הצירוף שמוסיף שורות מעל, `Alt+Shift+Enter` בברירות המחדל, אינו מופיע באף צירוף מקשים של המפה – ראו [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (טיפוסים) | החל מגרסה `4.0.0`. 25 הקודים של שפות התצוגה, ואותם קודים בתוספת `'system'`, שהמתודה `setLocale()` מקבלת – ראו [שפת תצוגה](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (טיפוס) | החל מגרסה `4.0.0`. האפשרויות שהמתודה `getSchemaSQL()` מקבלת: `statements`, `header` והחל מגרסה `4.2.0` גם `logicalNameAsComment` – ראו [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` היא נקודת כניסה שנייה. היא מריצה את מאגר המסמך בלי DOM, ולכן היא עובדת ב-Web Worker – ראו [אחסון מרוחק](./advanced/remote-storage.md).
היא מייצאת את `createReplicationStore` ואת הטיפוס `ReplicationStore`. החל מגרסה `3.10.0`, היא מייצאת גם את הטיפוס `ReplicationChange`, `{ value: string; changed: boolean }`, שמאזין ה-`change` של רפליקה מקבל – ראו [on@change](./advanced/remote-storage.md#onchange).
החל מגרסה `4.0.0`, ל-`ReplicationStore` יש גם `runtimeValue`. ה-`value` שלו וה-`value` שאירוע `change` מעביר הם צורת האחסון שקובץ מכיל, כמו אצל האלמנט – ראו [ReplicationStore](./advanced/remote-storage.md#replicationstore).

החל מגרסה `3.9.1`, יש נקודת כניסה שלישית, `@dineug/erd-editor/peer.js`: העמית ללא ממשק ש[שרת ה-MCP](../mcp/introduction.md) עורך דרכו מסמך. היא קיימת עבור השרת הזה, והדפים האלה אינם מתעדים אותה.

### תיבות דו-שיח של קבצים {#file-dialogs}

ייבוא וייצוא עוברים דרך פונקציות callback שניתן להזריק, כך שסביבה מארחת שאין בה תיבת דו-שיח של הדפדפן לבחירת קבצים – לדוגמה, webview של IDE – יכולה לספק תיבה משלה.
השניים אינם סימטריים: הייצוא מוסר לסביבה המארחת את הקובץ המוגמר, ואילו הייבוא רק מבקש קובץ, והסביבה המארחת מכניסה את התוכן חזרה בעצמה.
החל מגרסה `4.2.0`, הפעולה `Import CSV` של כרטיסיית מילון היא הייבוא היחיד שלעולם אינו קורא לפונקציית ה-callback של הייבוא, שב-`type` שלה אין ערך ל-CSV. היא תמיד פותחת את בורר הקבצים של הדפדפן עצמו, לקובצי `.csv` – ראו [ייבוא וייצוא של CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` הוא `set` או `diff` – `diff` מועבר ל-`setDiffValue()`, בלי קשר ל-`type`. אחרת, `type` קובע את המתודה, ו-`accept` מכיל את הסיומות של אותו סוג, מוכנות להעברה לתיבת דו-שיח של קבצים בסביבה המארחת.
החל מגרסה `4.0.0`, `set` כולל `mode: 'append'` כשהמשתמש בחר ב[ייבוא והוספה](../guide/guides/file-import-export.md#import-and-add), ואינו כולל `mode` בייבוא רגיל. יש להעביר אותו הלאה: פונקציית callback שמשמיטה אותו מחליפה את התרשים שהמשתמש ביקש להוסיף אליו.

| `type` | `accept` | מתודה |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` פורס את הטבלאות לפי הקשרים שלהן לפני שהן מוצבות, כמו הייבוא של העורך עצמו, וגורם לקריאה להחזיר Promise. בלעדיו הן מוצבות מיד בשורות – ראו [setSchemaSQL](./erd-editor-element.md#setschemasql) ו-[setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

יש לפצל לפי כל `type` שמטופל ולהתעלם מהשאר.
קריאה ל-`setSchemaJSON()` במצב החלפה, כמו השמה ל-`value`, מנקה את המסמך לפני הניתוח, ולכן ניתוב לשם של תוכן שאינו מסמך `.erd.json` – דרך `else` שתופס הכול, או משום ש-`type` שנוסף מאוחר יותר נפל לשם – מרוקן את התרשים במקום לייבא משהו.

ה-`fileName` שהעורך יוצר הוא `<database name>-<timestamp>` בתוספת סיומת הקובץ, כאשר חותמת הזמן היא השעה המקומית בתבנית `yyyy-MM-dd'T'HH_mm_ss`. שם מסד נתונים ריק מוחלף ב-`unnamed`. בקובץ CSV של המילון, שם הגיליון מופיע לפני הסיומת, כמו ב-`<database name>-<timestamp>-words.csv`.
פונקציית ה-callback של הייצוא מקבלת את הקבצים האלה. החל מגרסה `4.0.0`, קובץ ה-SVG והקבצים של מחולל הקוד נמנים עליהם, וקובץ ה-`.sql` מגיע מהלחצן `Save file` בכרטיסיית סכמת SQL ולא ישירות מתפריט המשנה `Export`. החל מגרסה `4.2.0`, גם קובץ ה-CSV של כרטיסיית מילון נמנה עליהם.

| קובץ | סיומת | `type` של ה-Blob |
| --- | --- | --- |
| ייצוא ה-JSON | `.erd.json` | `application/json` |
| הקובץ מהלחצן `Save file` בכרטיסיית סכמת SQL, ובו הטקסט שהכרטיסייה מציגה – ראו [סכמת SQL](../guide/guides/schema-sql.md) | `.sql` | אין |
| תיבת הדו-שיח [ייצוא תמונה](../guide/guides/file-import-export.md#image) | `.png` או `.svg` | `image/png` או `image/svg+xml` |
| הקובץ מהלחצן `Save file` בכרטיסיית מחולל קוד – ראו [מחולל קוד](../guide/guides/code-generator.md) | הסיומת של שפת הקוד: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` או `.mmd` | אין |
| הקובץ מהפעולה `Export CSV` בכרטיסיית מילון, ובו כל השורות של הגיליון המוצג, בלי קשר למה שהחיפוש בו מציג – ראו [ייבוא וייצוא של CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

סביבה מארחת שבוחרת מטפל לפי סיומת צריכה מטפל לכל אחת מהן.

כשפונקציות ה-callback אינן מוגדרות, העורך משתמש בהתנהגות ההורדה ובורר הקבצים של הדפדפן עצמו. כדי לחזור אליה, יש להעביר `null`.

## תמיכה בדפדפנים {#browser-support}

Chrome 91 ומעלה, Edge 94 ומעלה, Firefox 93 ומעלה, Safari 16.4 ומעלה – רמת הבסיס ES2022 שלפיה נבנים קובצי ה-build שמתפרסמים.
החבילה אינה כוללת polyfills. אם יש צורך לתמוך בדפדפנים ישנים יותר, יש להוסיף אותם בנפרד.

## שדרוג מגרסה 3 {#upgrading-from-3x}

`4.0.0` היא גרסה ראשית. בהעברת דף מגרסה 3 יש לבדוק כל אחד מהסעיפים האלה:

- `editor.value`, ה-`value` של רפליקה וה-`value` שאירוע ה-`change` שלה מעביר הם צורת האחסון שקובץ מכיל: בלי ישויות שהוסרו, רוחבים שנמדדו, סדר שכבות או נקודות עיגון של קשרים. יש להמשיך לשמור את `value`, ולקרוא את הנתונים האלה מ-`runtimeValue`; חותמות הזמן של הישויות (`meta`) הוסרו לגמרי. שותף לעריכה או רפליקה שמצטרפים לסשן פעיל יש לאתחל מה-`runtimeValue` של עמית פעיל, ולא מ-`value` או מהקובץ, ולעולם אין לשמור את `runtimeValue` – ראו [value](./erd-editor-element.md#value) ו-[runtimeValue](./erd-editor-element.md#runtimevalue).
- נעילות ההגדרות מחליפות את ההגדרות `Save Scroll Information` ו-`Save Zoom Information`. במסמך חדש, ובכל מסמך שנשמר לפני גרסה `4.0.0`, כל הנעילות מופעלות, ולכן גלילה, זום, מעבר בין כרטיסיות, או שינוי של שפת הקוד במחולל הקוד, של סגנון שמות או של סוג המירכאות, משאירים את `value` כפי שהיה ואינם משגרים `change`. דף ששמר את התצוגה באמצעות `change` צריך לבטל את הנעילה של `Viewport` (ושל `Canvas Type` עבור הכרטיסייה) בכרטיסיית הגדרות, או להשתמש במסמך שה-`settings.lockSettings` שלו משאיר את הסיביות האלה כבויות – ראו [נעילה](../guide/guides/settings.md#lock).
- ב-`settings` כבר אין `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` או `ignoreSaveSettings`, והקבועים `SaveSettingType` הוסרו. `settings.lockSettings`, עם הסיביות של `LockSettingType`, תופס את מקומו של `ignoreSaveSettings`, שגרסאות `4.0.0` ומעלה אינן קוראות ואינן כותבות – ראו [Settings](./advanced/schema.md#settings).
- ה-[JSON Schema](./advanced/schema.md#json-schema) שכל קובץ מציין ב-`$schema` מתארת כעת את צורת האחסון בלבד והיא סגורה: היא דוחה קובץ שגרסה קודמת שמרה, עד ששמירה בגרסה `4.0.0` ומעלה כותבת אותו מחדש.
- איסוף האשפה של המסמך הוסר יחד עם ה-worker שלו, ולכן ישות שהוסרה נשארת ב-`runtimeValue` עד לפעם הבאה שהמסמך נפתח מהקובץ שלו. נותרו שלושה workers משותפים – ראו [Web Workers](#web-workers).
- יש לוודא שכל עורך וכל רפליקה בסשן משותף נמצאים בגרסה `4.0.0` ומעלה. גרסה קודמת מתעלמת מסוגי הפעולות החדשים: אלה של קבוצות טבלאות, מיפוי עמודות, הנעילות והסקריפטים של סכמת SQL – ראו [שילוב גרסאות שונות](./advanced/collaborative-editing.md#mixing-releases).
- פונקציית ה-callback של הייבוא מקבלת `mode: 'append'` בייבוא והוספה, ועליה להעביר אותו הלאה. פונקציית ה-callback של הייצוא מקבלת כעת גם קובצי `.svg` וקבצים של מחולל הקוד, ו-`Export` ◂ `Schema SQL` פותח את כרטיסיית סכמת SQL במקום לשמור, ולכן קובץ ה-`.sql` מגיע רק מהלחצן `Save file` של אותה כרטיסייה – ראו [תיבות דו-שיח של קבצים](#file-dialogs).
- המקשים `Delete` ו-`Backspace` משויכים ל-`removeSelection` החדש. כל עוד לעורך יש פוקוס מחוץ לשדה טקסט, פעולת ברירת המחדל של המקש נמנעת בכל כרטיסייה, ובכרטיסיית ERD הבחירה מוסרת. `KeyBindingName` ו-`KeyBindingMap` כוללים אותו כעת, ו-`setKeyBindingMap({ removeSelection: [] })` משאיר את שני המקשים לדף – ראו [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` מקבל גם את `'system'`, כלומר הערך `System` של בונה ערכת הנושא, שהפעלת `systemDarkMode` מגדירה. האירוע `changePresetTheme` מדווח על `'system'` כל עוד הוא נבחר, ולכן יש לשמור אותו כמות שהוא ולהעביר אותו חזרה ל-`setPresetTheme`. כש-`systemDarkMode` מופעל, קריאה ל-`setPresetTheme()` עם `'light'` או `'dark'` נשארת כעת בתוקף במקום שהשינוי הבא ב-OS ידרוס אותה – ראו [systemDarkMode](./erd-editor-element.md#systemdarkmode) ו-[changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` בגרסה `1.0.0` ומעלה, הרחבת VS Code בגרסה `4.0.0` ומעלה והתוספים ל-Obsidian ול-JetBrains בגרסה `1.0.0` ומעלה משתמשים בגרסה 2 של פרוטוקול ה-hub. השרת בגרסה `1.0.0` ומעלה וגרסה קודמת של עורך שמשרת סוכנים, או שרת בגרסה קודמת ואחד מהעורכים האלה, דוחים זה את זה עם `protocolMismatch`, תוך ציון הצד שיש לעדכן – ראו [עדכון](../mcp/installation.md#updating).
- כתובת URL של CDN ללא גרסה מגישה כעת את הגרסה האחרונה של גרסה 4. כדי להישאר בגרסה 3, יש לקבע את `@3.10.0` – ראו [CDN](#cdn).
