---
sidebar_position: 1
description: התקנת @dineug/erd-editor מ-npm או מ-CDN, רישום אלמנט העורך ואלמנט המציג, חיבור תיבות הדו-שיח של קבצים ושדרוג מגרסה 4 או 3.
---

# התקנה

```sh
npm install @dineug/erd-editor
```

החבילה היא ESM בלבד (`"type": "module"`) ומפיצה רק את התיקייה `dist` שלה.
אין לה build של CommonJS, ולכן `require('@dineug/erd-editor')` לא עובד.

היא מכילה שני אלמנטים מותאמים אישית: `<erd-editor>`, העורך, והחל מגרסה `5.0.0` גם `<erd-viewer>`, שמציג תרשים לקריאה בלבד – ראו [ErdViewerElement](./erd-viewer-element.md).
החל מגרסה `5.0.0`, ייבוא שורש החבילה אינו מגדיר אף אחד מהם. לכל אלמנט יש נקודת כניסה משלו שמגדירה אותו – ראו [רישום האלמנטים](#registering-the-elements).

תלויות זמן הריצה שלה נשארות חיצוניות, כייבואים לפי שם חבילה שה-bundler מאתר, מסיר מהם כפילויות ומבצע עליהם tree shaking. החל מגרסה `5.0.0`, ה-`dist` שלה מכיל קובץ אחד לכל מודול, ולכן ה-bundler שומר רק את המודולים שהדף מגיע אליהם – ראו [נקודות כניסה](#entry-points).
ה-workers המשותפים שלה נוצרים כקובצי כניסה נפרדים תחת `dist/workers/` ונבנים באמצעות `new URL('./…', import.meta.url)`, צורת הכתיבה ש-Vite, webpack 5 ו-Rspack אורזים כנקודת כניסה של worker. ראו [Web Workers](#web-workers).
לדף שאין מאחוריו bundler יש שני builds עצמאיים – ראו [תגית script](#script-tag).

## שימוש {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` מגדיר את `<erd-editor>` ברגע שהוא מיובא. דף שרק מציג תרשים מייבא במקום זאת את `@dineug/erd-editor/erd-viewer.js` – ראו [ErdViewerElement](./erd-viewer-element.md).

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
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` מאתר בעצמו את התלויות החיצוניות של החבילה, ולכן הקוד הזה עובד בלי bundler.
כל נקודת כניסה מושגת לפי הנתיב שאחרי הגרסה: `…/erd-editor.js` מגדיר את העורך, ו-`…/erd-viewer.js` את המציג, שמוריד מה-CDN כל שפת תצוגה מלבד אנגלית ברגע שדף מבקש אותה. כתובת החבילה החשופה, `https://esm.run/@dineug/erd-editor@5.0.0`, מגישה את השורש, שאינו מגדיר אלמנט.
כתובת URL ללא גרסה מגישה תמיד את הגרסה האחרונה. יש לקבע גרסה, כמו למעלה, כדי ששדרוג לגרסה ראשית חדשה לא יגיע לדף בלי הודעה מראש.
גרסה `5.0.0` היא בעצמה שדרוג כזה: דף שצריך להישאר בגרסה 4 מקבע את `@4.2.0` – ראו [שדרוג מגרסה 4](#upgrading-from-4x).

`esm.run` מגיש את ה-workers המשותפים מ-`cdn.jsdelivr.net`, ודפדפן אינו מפעיל worker משותף ממקור שאינו המקור של הדף. לכן עורך שנטען כך רץ בלי ה-workers שלו, כמו במארח שחוסם אותם – ראו [Web Workers](#web-workers). ה-build של [תגית script](#script-tag) נושא אותם בתוך הקובץ שלו.

### תגית script {#script-tag}

החל מגרסה `3.6.0`, החבילה מפיצה גם build של UMD שבו כל התלויות וכל ה-workers המשותפים נמצאים בתוך קובץ אחד, `dist/erd-editor.umd.js`.
אליו מפנים השדות `unpkg` ו-`jsdelivr`, ולכן כתובת ה-URL הבסיסית של החבילה בכל אחד משני ה-CDN מגישה אותו, והוא מגדיר את `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

טעינת הקובץ מגדירה את `<erd-editor>`. `window.ErdEditor` מכיל את שתי פונקציות ה-callback של הקבצים, `ErdEditor.setExportFileCallback` ו-`ErdEditor.setImportFileCallback`, החל מגרסה `3.9.2` את `ErdEditor.createKeyBindingMap`, החל מגרסה `4.2.0` את `ErdEditor.dictionaryRowChords` – ראו [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – והחל מגרסה `5.0.0` את `ErdEditor.ErdEditorElement` ואת `ErdEditor.defineErdEditor` – ראו [רישום האלמנטים](#registering-the-elements). הוא אינו מכיל את [toImage](./to-image.md).

החל מגרסה `5.0.0`, קובץ שני, `dist/erd-viewer.umd.js`, מגדיר את `<erd-viewer>` ומציב את `ErdViewerElement` ואת `defineErdViewer` על `window.ErdViewer`. הוא אינו מפעיל אף worker, מכיל את כל 25 שפות התצוגה, ואינו מבקש דבר מלבד ה-`src` שניתן לו.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

אף אחד משני הקבצים אינו מגדיר את התגית של השני, וכל אחד מהם אינו משאיר בדף משתנה גלובלי מלבד שלו ו-`window.Konva`.
מפת ה-exports עדיין מפנה bundler אל מודולי ה-ES, ולכן התקנה מ-npm לעולם אינה משתמשת באף אחד משני הקבצים.
דף שאינו יכול לטעון סקריפט משלו יכול במקום זאת למסגר את המציג המתארח בכתובת erd-editor.io/embed – ראו [הטמעה](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
העורך נושא את כל 25 שפות התצוגה, הן ב-build של ES והן ב-build של תגית ה-script, ולכן אין קובץ שפה שצריך להגיש ואין מה לרשום. בלי הבורר ובלי קריאה ל-`setLocale()`, העורך מוצג באנגלית.

הוספת התכונה `readonly` כאן פותחת את העורך כקורא: העורך מתעלם מהשמה ל-`value`, מקריאה ל-`clear()` ומכל קריאה ל-`setSchema*()` – כולל `setSchemaJSON()` וקריאה במצב הוספה – והאירוע `change` לעולם אינו משוגר. הכרטיסיות שלו, הסייר והחיפוש המהיר נשארים לקריאה, וכל פקד שהיה עורך את התרשים מושמט.
קריאת `editor.value` ו-`editor.runtimeValue` עדיין עובדת, ושניהם שומרים את הגדרות המסמך עצמן: הגדרת תצוגה שהקורא משנה, כמו הזום או מסד הנתונים, נשארת על המסך של אותו עורך. במקום זאת, יש לטעון באמצעות `setInitialValue()` – ראו [readonly](./erd-editor-element.md#readonly).

### רינדור בצד השרת {#server-side-rendering}

כל נקודת כניסה מלבד `engine.js` ו-`peer.js` דורשת DOM, ולכן היא זורקת שגיאה ב-Node. `erd-editor.js` ו-`erd-viewer.js` מגדירים את האלמנט שלהם ברמת המודול, ושורש החבילה, שמאז גרסה `5.0.0` אינו מגדיר דבר, עדיין בונה את שתי מחלקות האלמנט בזמן שהוא נטען.
ב-Next.js, Nuxt, SvelteKit או Astro, יש לייבא את נקודת הכניסה של האלמנט מנתיב קוד שרץ בצד הלקוח, וייבוא בשם מהשורש, כמו `setExportFileCallback` או `toImage`, מאותו נתיב.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

בפיתוח, יש להוסיף את חבילת ELK שה-worker של הפריסה בעורך מייבא אל ה-pre-bundling של Vite, אחרת הפריסות ש-worker זה מבצע נכשלות: הפריסות `Flow`, `Tree - vertical` ו-`Tree - horizontal` של הפריסה האוטומטית, מצב הזרימה של כרטיסיית ויזואליזציה וייבוא שממוקם בפריסת זרימה.
ב-Vite 7 ומטה יש גם להוציא את העורך מה-pre-bundling, כי ה-pre-bundle שלו מפנה את כתובות ה-URL של ה-workers אל קבצים שהוא אינו כותב, ולכן שלושת ה-workers נכשלים. ב-Vite 8 יש להשמיט את ה-`exclude` הזה, שרק גורם לשרת הפיתוח להביא כל אחד מקובצי החבילה בנפרד. build לייצור אינו צריך אף אחד מהשניים.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

ייבוא של `@dineug/erd-editor/erd-editor.js` ממזג את `erd-editor` לתוך `HTMLElementTagNameMap`, וייבוא של `@dineug/erd-editor/erd-viewer.js` ממזג את `erd-viewer`, כך שלאלמנט יש טיפוס גם בלי המרת טיפוס. כל ייבוא מהשורש, גם של טיפוס בלבד, מביא את שניהם.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` מיוצא כדי לציין באמצעותו את הטיפוס של משתנים ו-props בקוד של המשתמש. החל מגרסה `5.0.0` הוא גם המחלקה של האלמנט, ו-`ErdViewerElement` הוא הממשק והמחלקה של המציג – ראו [רישום האלמנטים](#registering-the-elements).
החל מגרסה `4.0.0`, החבילה מייצאת גם את הטיפוסים `LocaleCode`, `LocaleOption` ו-`SchemaSQLOptions`, והחל מגרסה `5.0.0` גם את `ToImageOptions` – ראו [נקודות כניסה](#entry-points). לאפשרויות שהמתודות `setSchema*()` מקבלות אין שם מיוצא; יש לחלץ אותן מהאלמנט, כמו ב-`Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
החל מגרסה `5.0.0`, ה-`typesVersions` של החבילה מגדיר טיפוסים לכל נתיב משנה של נקודת כניסה גם תחת `moduleResolution: "node10"`, שאינו קורא מפת exports.

## רישום האלמנטים {#registering-the-elements}

החל מגרסה `5.0.0`, החבילה מגדירה תגית רק במקום שדף מבקש זאת.

| ייבוא | מגדיר |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | דבר |

כל אחת משתי נקודות הכניסה מגדירה את התגית שלה בזמן שהיא מוערכת ואינה מייצאת דבר, ולכן מייבאים אותה לשם תופעת הלוואי שלה, ואף אחת מהן אינה מגדירה את התגית של השנייה.
השורש מייצא את שתי מחלקות האלמנט, `ErdEditorElement` ו-`ErdViewerElement`, ואת `defineErdEditor()` ו-`defineErdViewer()`, שמגדירות את התגית שלהן במקום שבו קוראים להן:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

קריאה אינה עושה דבר כל עוד התגית מחזיקה את המחלקה הזו, ולכן נקודת כניסה וקריאה להגדרה, או שתי קריאות להגדרה, יכולות להיפגש בדף אחד. היא זורקת `Error` שמציין את התגית כשמחלקה אחרת מחזיקה בה, כמו עותק שני של החבילה שנארז באותו דף: `Another element class already defines the custom element name erd-editor`.
המחלקות של השורש הן אלה שנקודות הכניסה מגדירות, ולכן `customElements.get('erd-editor') === ErdEditorElement` מרגע שאחת מהן רצה. כל עוד התגית לא הוגדרה, `document.createElement('erd-editor')` יוצר `HTMLElement` רגיל בלי אף אחד מהאיברים של העורך, ו-`new ErdEditorElement()` זורק שגיאה.

לתגית משלכם, יש להגדיר את המחלקה תחתיה בעצמכם ולהוסיף את התגית ל-`HTMLElementTagNameMap` בעצמכם. יש לעשות זאת בחלון שאינו טוען את נקודת הכניסה של האלמנט ההוא או את ה-build של [תגית script](#script-tag) שלו ואינו קורא לפונקציית ההגדרה שלו, כי מחלקה מקבלת שם אחד לכל חלון:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

חבילה שמכילה את שני האלמנטים גורמת ל-Vite ול-Rolldown להזהיר מפני `INEFFECTIVE_DYNAMIC_IMPORT` פעם אחת לכל שפת תצוגה מלבד אנגלית. המציג טוען כל אחת מהן ב-`import()` משלו, והעורך מייבא את כל המילונים בבת אחת, ולכן הם נשארים ב-chunk של העורך ונטענים איתו. דבר אינו נכשל, וחבילה עם המציג בלבד שומרת כל שפה ב-chunk משלה.

## הדגשת תחביר {#syntax-highlighting}

החלוניות של סכמת SQL ושל מחולל הקוד מודגשות על ידי [Shiki](https://shiki.style), ב-worker משותף משלו, והחל מגרסה `4.0.0` גם הסקריפטים `Before tables` ו-`After tables` בכרטיסיית סכמת SQL.
החל מגרסה `3.7.0`, אין מה להתקין ואין מה לרשום: ה-worker נבנה בפעם הראשונה שחלונית קוד מוצגת, ולכן דף שאינו פותח אף חלונית כזו לעולם אינו מוריד את קובצי הדקדוק.

| | |
| --- | --- |
| שפות | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| ערכות נושא | `github-dark` ו-`github-light`, בהתאם למראה הבהיר או הכהה של העורך |

אלה בדיוק השפות שהחלוניות מפיקות: `JPA` מודגש כ-Java, `SQLAlchemy` כ-Python, `TypeORM`, `Sequelize`, `Drizzle` ו-`Zod` כ-TypeScript, `Doctrine` כ-PHP, `SeaORM` כ-Rust, `JSON Schema` כ-JSON, ו-`DBML` ו-`AML` כ-SQL, הדקדוק הקרוב ביותר שכלול בחבילה – ראו [מחולל קוד](../guide/guides/code-generator.md).

מנוע הביטויים הרגולריים כתוב ב-JavaScript רגיל, ולכן אף מדיניות של סביבה מארחת אינה צריכה את `wasm-unsafe-eval`.
היכן ש-`SharedWorker` חסר – Chrome ב-Android לפני Chrome 148, Safari לפני גרסה 16.4 – הכישלון נרשם ביומן והקוד מוצג כטקסט רגיל; עדיין ניתן לערוך את הסקריפטים.

בשדרוג מגרסה `3.6.0` או מוקדמת ממנה: החבילה `@dineug/erd-editor-shiki-worker` כבר אינה מתפרסמת, והפונקציה `setGetShikiServiceCallback` הוסרה יחד איתה.
יש להסיר את ההתקנה ואת הרישום; דף שטען את ה-worker מ-CDN מסיר גם את תגית ה-`<script>` השנייה הזו.

## Web Workers {#web-workers}

העורך מריץ שלוש משימות במופעים של `SharedWorker`: הדגשת תחביר, ייצוא תמונות ופריסת הטבלאות שמאחורי ה[פריסה האוטומטית](../guide/guides/table-related-functions.md#auto-layout), [מצב הזרימה](../guide/guides/visualization.md#how-flow-is-placed) של כרטיסיית ויזואליזציה, והחל מגרסה `4.0.0`, מיקום הטבלאות של סכמה מיובאת.
שלושת ה-workers כלולים בתוך `@dineug/erd-editor`. אף אחד מהם אינו דורש הגדרה, אבל סביבה מארחת יכולה לחסום כל אחד מהם.
החל מגרסה `5.0.0`, כל worker נבנה במודול משלו, ולכן חבילה נושאת רק את ה-workers שהמודולים שלה מגיעים אליהם: חבילה של [toImage](./to-image.md) ללא אלמנט נושאת את ה-worker של ייצוא התמונות בלבד, ו-`<erd-viewer>` אינו מפעיל אף worker – ראו [נקודות כניסה](#entry-points).
ה-worker שהריץ את איסוף האשפה של המסמך הוסר בגרסה `4.0.0`, יחד עם איסוף האשפה עצמו.

| Worker | בלעדיו |
| --- | --- |
| הדגשת תחביר | החלוניות של סכמת SQL ושל מחולל הקוד והסקריפטים של סכמת SQL נשארים טקסט רגיל |
| ייצוא תמונות | קובץ ה-PNG, קובץ ה-SVG, הלחצן `Copy to clipboard`, התצוגה המקדימה של תיבת הדו-שיח `Export image` והחל מגרסה `5.0.0` גם [toImage()](./to-image.md) מצוירים בתהליכון הראשי, מה שחוסם את הדף בזמן הציור |
| פריסת טבלאות | הפריסות `Flow`, `Tree - vertical` ו-`Tree - horizontal` של הפריסה האוטומטית, וכן מצב הזרימה של כרטיסיית ויזואליזציה, מסתיימים בהודעה `Could not place tables`; ייבוא שממוקם בפריסת זרימה – קובץ SQL, GraphQL, DBML או AML מ-`Import` או מ-`Import and Add`, או קריאה ל-`setSchema*()` עם `placement: 'auto'` – מציב את הטבלאות שלו בשורות, בלי שום הודעה; `Force` ומצב גרף אינם מושפעים, מכיוון שהם רצים בתוך העורך |

ייצוא התמונות ממתין עשר שניות לתשובה מה-worker שלו ואז מצייר בתהליכון הראשי, והדגשת התחביר משאירה את הקוד כטקסט רגיל ברגע שה-worker שלה נכשל, כך שסביבה מארחת שחוסמת workers פוגעת בביצועים ולא בפונקציונליות.
פריסת הטבלאות היא היוצא מן הכלל: המנוע שמחשב פריסה כבד יותר מהעורך עצמו ולעולם אינו נטען בתוך התהליך, ולכן היא ממתינה שלושים שניות ל-worker שלה במיקום הראשון, ואחרי שה-worker ענה היא נותנת לכל פריסה שישים שניות לחזור.
אם אחד מזמני ההמתנה פג, המיקום מסתיים כפי שהוא מסתיים בלי ה-worker. הפריסה האוטומטית מציגה את `Placing tables` מיד כשהיא מתחילה, ואילו מצב הזרימה וייבוא שממוקם בפריסת זרימה מציגים זאת רק אחרי שמיקום, כולל הפעלת ה-worker שלו, נמשך שש שניות.

Vite, webpack 5 ו-Rspack מוציאים את ה-workers כקבצים לצד ה-chunks שלכם. esbuild, ו-Rolldown כשמשתמשים בו לבדו ולא דרך Vite, אינם מוציאים אף אחד, ולכן דף שהם בונים רץ בלי ה-workers.
תחת `experiments.outputModule` הניסיוני של webpack אף worker אינו מתחיל, כי כל אחד ממתין ל-chunk שפוצל ממנו ושדבר אינו טוען. יש להשאיר את פלט ברירת המחדל של webpack, או להגדיר `optimization.splitChunks: false`.

### מדיניות אבטחת תוכן {#content-security-policy}

דף תחת מדיניות אבטחת תוכן (Content Security Policy) מחמירה צריך את ההנחיות האלה עבור האלמנטים:

- `worker-src 'self'` עבור ה-build שעובר דרך bundler, שה-workers שלו הם קבצים לצד החבילה, ובנוסף `blob:` כשה-bundler מטמיע worker בתוך הקוד. ב-build של [תגית script](#script-tag), שלושת ה-workers נמצאים בתוך הקובץ ככתובות URL מסוג `data:`, ולכן הדף הזה דורש במקום זאת `worker-src data:`. `<erd-viewer>` אינו צריך אף אחד מהם, כי הוא אינו מפעיל worker.
- החל מגרסה `5.0.0`, שני האלמנטים מעצבים את עצמם בגיליונות סגנון שנבנו בקוד, ש-`style-src 'self'` מתיר. חלוניות הקוד של העורך עדיין צובעות את הטקסט שלהן בתכונות `style`, והתצוגה המקדימה של תיבת הדו-שיח `Export image` היא תמונה בכתובת `blob:`, ולכן העורך צריך גם `style-src 'unsafe-inline'` ו-`img-src blob:` עבורן.
- דפדפן בלי גיליונות סגנון שנבנו בקוד, כמו Firefox לפני גרסה 101, מקבל במקומם אלמנטי `<style>`, שדורשים `style-src 'unsafe-inline'` עבור כל אחד משני האלמנטים.
- `<erd-viewer>` מביא את ה-`src` שלו, ולכן המקור הזה נכנס ל-`connect-src` – ראו [מה הוא מוסיף לדף](./erd-viewer-element.md#what-it-adds-to-a-page).

## נקודות כניסה {#entry-points}

לחבילה יש חמש נקודות כניסה:

| נקודת כניסה | מה היא |
| --- | --- |
| `@dineug/erd-editor` | השורש: הייצואים שלהלן. החל מגרסה `5.0.0` הוא אינו מגדיר אלמנט, אף שהוא עדיין צריך DOM כדי להיטען |
| `@dineug/erd-editor/erd-editor.js` | החל מגרסה `5.0.0`. מגדיר את `<erd-editor>` ואינו מייצא דבר |
| `@dineug/erd-editor/erd-viewer.js` | החל מגרסה `5.0.0`. מגדיר את `<erd-viewer>` ואינו מייצא דבר |
| `@dineug/erd-editor/engine.js` | מאגר המסמך בלי DOM |
| `@dineug/erd-editor/peer.js` | החל מגרסה `3.9.1`. העמית ללא ממשק של שרת ה-MCP |

השורש מייצא את שתי מחלקות האלמנט ואת פונקציות ההגדרה שלהן, שתי פונקציות להגדרת callback, החל מגרסה `3.9.2` את צירופי המקשים של ברירת המחדל יחד עם הטיפוסים שלהם, החל מגרסה `4.0.0` את הטיפוסים של שפת התצוגה ואת טיפוס האפשרויות של `getSchemaSQL()`, החל מגרסה `4.2.0` את צירופי המקשים של השורות בכרטיסיית מילון, והחל מגרסה `5.0.0` את `toImage`.

| ייצוא | תיאור |
| --- | --- |
| `ErdEditorElement` | הממשק של האלמנט – ראו [ErdEditorElement](./erd-editor-element.md). החל מגרסה `5.0.0` גם המחלקה שלו, זו ש-`<erd-editor>` מוגדר כמוה – ראו [רישום האלמנטים](#registering-the-elements). |
| `ErdViewerElement` | החל מגרסה `5.0.0`. הממשק והמחלקה של המציג – ראו [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | החל מגרסה `5.0.0`. מגדירות את `<erd-editor>` או את `<erd-viewer>` כמחלקה שלהן. קריאה אינה עושה דבר כל עוד התגית מחזיקה את המחלקה הזו, וזורקת `Error` כשמחלקה אחרת מחזיקה בה – ראו [רישום האלמנטים](#registering-the-elements). |
| `toImage(value, options)` | החל מגרסה `5.0.0`. מצייר מסמך כ-`Blob` של PNG או כמחרוזת SVG, עם האפשרויות של תיבת הדו-שיח `Export image` – ראו [toImage](./to-image.md). |
| `ToImageOptions` (טיפוס) | החל מגרסה `5.0.0`. האפשרויות ש-`toImage()` מקבלת: `format`, `background`, `darkMode` ו-`scale`. |
| `setExportFileCallback(cb)` | מחליפה את ההורדה של הדפדפן, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | מחליפה את בורר הקבצים של הדפדפן, `({ type, op, accept, mode }) => void`; `mode` החל מגרסה `4.0.0`. החל מגרסה `4.2.0`, הפעולה `Import CSV` של כרטיסיית מילון פותחת את הבורר של הדפדפן גם כשמוגדרת פונקציית callback – ראו [תיבות דו-שיח של קבצים](#file-dialogs). |
| `createKeyBindingMap()` | מחזירה את צירופי המקשים של ברירת המחדל כ-`KeyBindingMap` חדש בכל קריאה – ראו [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (טיפוסים) | מפה של צירופי מקשים, האיחוד של שמות הפקודות שבה, וצירוף מקשים יחיד. |
| `dictionaryRowChords(map)` | החל מגרסה `4.2.0`. מחזירה, כ-`ShortcutOption[]` חדש בכל קריאה, את צירופי המקשים שבהם הרשת של כרטיסיית [מילון](../guide/guides/dictionary.md#adding-and-deleting-rows) מוסיפה ומוחקת שורות לפי ה-`KeyBindingMap` שמועבר אליה. הצירוף שמוסיף שורות מעל, `Alt+Shift+Enter` בברירות המחדל, אינו מופיע באף צירוף מקשים של המפה – ראו [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (טיפוסים) | החל מגרסה `4.0.0`. 25 הקודים של שפות התצוגה, ואותם קודים בתוספת `'system'`, שהמתודה `setLocale()` מקבלת – ראו [שפת תצוגה](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (טיפוס) | החל מגרסה `4.0.0`. האפשרויות שהמתודה `getSchemaSQL()` מקבלת: `statements`, `header` והחל מגרסה `4.2.0` גם `logicalNameAsComment` – ראו [getSchemaSQL](./erd-editor-element.md#getschemasql). |

החל מגרסה `5.0.0`, ה-`dist` מכיל קובץ אחד שאינו ממוזער לכל מודול, כל אחד לצד ההצהרה שלו, וה-`sideEffects` של `package.json` מונה רק את שתי נקודות הכניסה של התגיות ושני stubs שקובצי ה-workers צריכים. לכן bundler משמיט כל מודול שהדף אינו מגיע אליו וממזער פעם אחת:

- ייבוא בשם מהשורש, כמו `setExportFileCallback`, אורז לא אלמנט ולא worker.
- `toImage` מביא את ה-worker של ייצוא התמונות וללא אלמנט.
- `erd-editor.js` מביא את העורך ואת שלושת ה-workers המשותפים.
- `erd-viewer.js` מביא את המציג וללא worker, כשאנגלית בתוכו וכל שפת תצוגה אחרת ב-chunk משלה, שנטען ברגע שדף מבקש אותה.

`@dineug/erd-editor/engine.js` מריץ את מאגר המסמך בלי DOM, ולכן הוא עובד ב-Web Worker – ראו [אחסון מרוחק](./advanced/remote-storage.md).
היא מייצאת את `createReplicationStore` ואת הטיפוס `ReplicationStore`. החל מגרסה `3.10.0`, היא מייצאת גם את הטיפוס `ReplicationChange`, `{ value: string; changed: boolean }`, שמאזין ה-`change` של רפליקה מקבל – ראו [on@change](./advanced/remote-storage.md#onchange).
החל מגרסה `4.0.0`, ל-`ReplicationStore` יש גם `runtimeValue`. ה-`value` שלו וה-`value` שאירוע `change` מעביר הם צורת האחסון שקובץ מכיל, כמו אצל האלמנט – ראו [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` הוא העמית ללא ממשק ש[שרת ה-MCP](../mcp/introduction.md) עורך דרכו מסמך. היא קיימת עבור השרת הזה, והדפים האלה אינם מתעדים אותה.

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
פונקציית ה-callback של הייצוא מקבלת את הקבצים האלה. החל מגרסה `4.0.0`, קובץ ה-SVG והקבצים של מחולל הקוד נמנים עליהם, וקובץ ה-`.sql` מגיע מהלחצן `Save file` בכרטיסיית סכמת SQL ולא ישירות מתפריט המשנה `Export`. החל מגרסה `4.2.0`, גם קובץ ה-CSV של כרטיסיית מילון נמנה עליהם. [toImage()](./to-image.md) אינה קוראת לאף אחת משתי פונקציות ה-callback של הקבצים: היא מחזירה לכם את התמונה שלה.

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

## שדרוג מגרסה 4 {#upgrading-from-4x}

`5.0.0` היא גרסה ראשית. בהעברת דף מגרסה 4 יש לבדוק כל אחד מהסעיפים האלה:

- `import '@dineug/erd-editor'` כבר אינו מגדיר את `<erd-editor>`. יש לייבא במקום זאת את `@dineug/erd-editor/erd-editor.js` לשם תופעת הלוואי שלו, או לקרוא ל-`defineErdEditor()`, ולהשאיר את הייבואים בשם מהשורש כפי שהם. TypeScript אינו מסמן דף שנשאר עם הייבוא החשוף, כי ההצהרות של השורש עדיין נותנות שם לתגית ב-`HTMLElementTagNameMap`, אבל האלמנט שהוא יוצר הוא `HTMLElement` רגיל, ולכן הקריאה הראשונה למתודה שלו זורקת `TypeError` – ראו [רישום האלמנטים](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- ב-CDN אותו דבר נכון לגבי `https://esm.run/@dineug/erd-editor`, שמגיש כעת את השורש ואינו מגדיר דבר: יש לייבא את `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. כתובות jsDelivr ו-unpkg החשופות עדיין מגישות את ה-build של תגית script, שמגדיר את `<erd-editor>` כמקודם. כתובת URL ללא גרסה מגישה כעת את הגרסה האחרונה של גרסה 5; כדי להישאר בגרסה 4, יש לקבע את `@4.2.0` – ראו [CDN](#cdn) ו-[תגית script](#script-tag).
- השורש אינו מגדיר דבר אבל עדיין צריך DOM, ולכן ברינדור בצד השרת ייבוא בשם ממנו, כמו `setExportFileCallback`, נשאר בנתיב הצד-לקוח לצד נקודת הכניסה של האלמנט – ראו [רינדור בצד השרת](#server-side-rendering).
- ל-`window.ErdEditor` נוספים `ErdEditorElement` ו-`defineErdEditor`. ה-build של המציג בתגית script מציב את `ErdViewerElement` ואת `defineErdViewer` על `window.ErdViewer`, ואף אחד משני המשתנים הגלובליים אינו נושא את `toImage`.
- עורך `readonly` נפתח כקורא. ששת הכרטיסיות שלו, הסייר, החיפוש המהיר והנוכחות של שותפים נשארים, וכל פקד שהיה עורך את התרשים מושמט ולא מושבת: סרגל הכלים מציג את שם מסד הנתונים כטקסט, כרטיסיית הגדרות מציגה את ההגדרות שלה עם כל הפקדים מושבתים תחת התג `Read only`, וסרגל הכלים הצף שומר רק את הזום, את תצוגת השמות, את מצב זן ואת המצפן, כך ש-`Hand` ו-`Select` נעלמים וגרירה מזיזה את התצוגה. לחיצה אינה בוחרת דבר: הבחירה היחידה היא המתאר שמעבר מהסייר או מהחיפוש המהיר מניח סביב מה שהוא מגיע אליו, ולחיצה ללא תנועה מנקה אותו, וצירופי המקשים לבחירת הכול אינם בוחרים דבר. הפעלת `readonly` מסיימת את מה שעמד פתוח, כמו הבחירה, כלי היד, עורך תא, גרירה, `Map Columns`, התצוגה המקדימה של `Force` בפריסה האוטומטית ומסע בזמן, ושומרת את הגלילה, הזום, הכרטיסייה ותצוגת השמות – ראו [readonly](./erd-editor-element.md#readonly).
- ההגדרות שקורא של `readonly` משנה נשארות על המסך של אותו עורך יהיו הנעילות שלהן אשר יהיו: הגלילה והזום, הכרטיסייה, תצוגת השמות, View Option, מסד הנתונים, ושפת מחולל הקוד, סגנונות השמות וסוג המירכאות. `value`, `runtimeValue` וייצוא ה-JSON שומרים את אלה של המסמך עצמו, שהשינויים של קורא בגרסה 4 יכלו להגיע אליהם, ו-`getSharedStore()` אינו שולח אף אחת מהן לעורכים האחרים. `getSchemaSQL()` ללא מסד נתונים כותבת את מסד הנתונים שהקורא בחר. כיבוי `readonly` מחזיר את מסד הנתונים, הגדרות הקוד ו-View Option לאלה של המסמך, ומשאיר את הגלילה, הזום, הכרטיסייה ותצוגת השמות במקום שבו הקורא השאיר אותם.
- השורה `Recalculation table width` בכרטיסיית הגדרות הוסרה. טעינה והדבקה עדיין מתאימות את רוחב כל טבלה לטקסט שלה.
- ב-Vite 8 יש להסיר מ-`optimizeDeps` את `exclude: ['@dineug/erd-editor']`, שרק Vite 7 ומטה עדיין צריכים, ולהשאיר את ה-`include` של ELK – ראו [Vite](#vite).

## שדרוג מגרסה 3 {#upgrading-from-3x}

`4.0.0` היא גרסה ראשית. בהעברת דף מגרסה 3 יש לבדוק כל אחד מהסעיפים האלה, ואחריהם את אלה של [שדרוג מגרסה 4](#upgrading-from-4x) עבור `5.0.0`:

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
- כתובת URL של CDN ללא גרסה מגישה את הגרסה האחרונה, גרסה 5 מאז `5.0.0`. כדי להישאר בגרסה 3, יש לקבע את `@3.10.0` – ראו [CDN](#cdn).
