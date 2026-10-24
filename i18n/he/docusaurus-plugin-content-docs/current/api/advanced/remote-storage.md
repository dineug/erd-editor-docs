---
sidebar_position: 2
description: שכפול עורך פעיל למאגר ללא ממשק מחוץ לתהליכון הראשי, וסריאליזציה של המסמך לצורך אחסון.
---

# אחסון מרוחק

שליחת מצב העורך כולו בכל שינוי אינה יעילה.  
למקרה זה, העורך מספק API לשכפול נתונים בזמן אמת.

## התקנה {#installation}

```sh
npm install @dineug/erd-editor
```

מאגר השכפול נמצא בנתיב המשנה `@dineug/erd-editor/engine.js`, ולא בשורש החבילה.  
נקודת הכניסה הזו אינה נוגעת ב-DOM, ולכן היא רצה ב-Web Worker או בכל מקום אחר מחוץ לתהליכון הראשי.  
לעומת זאת, ייבוא שורש החבילה רושם את האלמנט המותאם אישית `<erd-editor>`, שדורש מסמך.

## שימוש {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## שכפול עורך פעיל {#replicating-a-live-editor}

הפעולות מגיעות מהמאגר המשותף של עורך פעיל.  
ראו [עריכה שיתופית](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

רק השינוי חוצה את הגבול, ולעולם לא המסמך כולו.  
הרפליקה מחילה אותו ומבצעת סריאליזציה לתוצאה בצד שלה.  
`change` מוסר את התוצאה הזו כ-`value`, ו-`changed` מציין מתי כדאי לכתוב אותה.

החל מגרסה `4.0.0`, יש לאתחל את הרפליקה מ-`runtimeValue` של העורך, כפי שמוצג למעלה, ולא מהקובץ השמור או מ-`value` של העורך.  
בקובץ חסרות העריכות שבוצעו מאז שנשמר, וב-`value` חסרות הישויות שהוסרו במהלך הסשן.  
רפליקה שאותחלה בלי טבלה שהוסרה מחזירה אותה בלי השם או העמודות שלה כשעורך מבטל את ההסרה, ושומרת אותה כך.  
החל מגרסה `4.2.0`, אותו הדבר נכון גם למילה, למונח או לתחום שהוסרו מגיליון בכרטיסיית [מילון](../../guide/guides/dictionary.md).  
כשעורך מבטל את ההסרה, רפליקה שאותחלה בלי השורה מחזירה אותה לרשימה כשהיא ריקה, ומכיוון ש-`value` משמיט שורה ריקה, הרפליקה שומרת את המסמך בלעדיה.  
במקרה של תחום, גם העמודות והמונחים שהיו מקושרים אליו נשארים לא מקושרים ברפליקה הזו, מכיוון שהיא מעולם לא החזיקה את הקישורים, וביטול הפעולה אינו שולח אותם.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

מודדת מחרוזת בפיקסלים.  
למאגר אין DOM, ולכן הוא אינו יכול למדוד טקסט בעצמו, והוא מחשב מחדש את רוחב העמודות באמצעות הפונקציה הזו בכל פעם שמשתנים שם, סוג נתונים, ברירת מחדל או הערה.  
החל מגרסה `4.2.0`, זה כולל גם את ה[שם הלוגי](../../guide/guides/logical-names.md) של טבלה או של עמודה.  
הוא מודד את תא התחום של עמודה, שמציג את שם התחום שהעמודה מקושרת אליו, בכל פעם שהעמודה מקושרת לתחום או שהקישור שלה לתחום מבוטל, ובכל פעם שהתחום הזה נוסף, ששמו משתנה או שהוא מוסר.  
הוא גם מודד מחדש כל טבלה וכל עמודה בכל פעם ש-[setInitialValue](#setinitialvalue) טוענת מסמך.  
החל מגרסה `4.0.0`, הרוחבים נשמרים רק ב-[runtimeValue](#runtimevalue-getter), ולעולם לא ב-`value`.  
לכן מסמך שנשמר בגרסה זו מניב בקריאה חוזרת את אותו `value`, בייט אחר בייט, בלי קשר למקום שבו נשמר ולאופן שבו נמדד שם טקסט.

יש למדוד באותו אופן שבו העורך מודד – `400 12px` ברשימת הגופנים של העורך, מעוגל, ועוד ריפוד של 2px.  
אחרת, הרוחבים ב-`runtimeValue` מתרחקים מהרוחבים שעל המסך.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` הוא החלופה כשאין רכיב canvas זמין.  
חלופה זו מספיקה למאגר שהמסמך שלו רק מאוחסן, ולעולם אינו מוצג.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

מבצע סריאליזציה למצב הנוכחי של העורך.  
מחזיר מחרוזת JSON, מוכנה לאחסון כמות שהיא – ולא אובייקט שעבר ניתוח.

```js
const data = replicationStore.value;
```

החל מגרסה `4.0.0`, `value` הוא צורת האחסון: המסמך כפי שהוא מוחזק בקובץ, אותו טקסט שמחזיר המאפיין [value](../erd-editor-element.md#value) של האלמנט.  
הוא מכיל רק את הישויות הקיימות, בסדר קבוע, בלי הישויות שהוסרו, בלי סדר השכבות ובלי כל מה שטעינה מחשבת מחדש, כגון הרוחבים ש-[toWidth](#towidth) מודדת.  
החל מגרסה `4.2.0`, הוא מכיל גם את השמות הלוגיים, את המידע אם כל שם נגזר מהמילונים, את הקישורים לתחומים, ואת המילים, המונחים והתחומים של כרטיסיית [מילון](../../guide/guides/dictionary.md).  
החל מגרסה `4.2.0`, הוא גם משמיט כל שדה טקסט ריק של ישות, כל רשימת `doc` וכל אוסף שאין בהם דבר, ואת `collections` עצמו כשכל האוספים ריקים.  
הוא מוזח בשני רווחים, כל שורת מילון נמצאת בשורה נפרדת, והוא מסתיים בתו שורה חדשה, כך שאותו מסמך מפיק תמיד אותם בייטים.  
לגבי מה שהוא מכיל, ראו [צורת אחסון וערך זמן ריצה](./schema.md#storage-form-and-runtime-value).

כל הגדרה שה[נעילה](../../guide/guides/settings.md#lock) שלה מופעלת נכתבת בערך שבו ננעלה, וכל הגדרה אחרת נכתבת כפי שהיא כעת.  
הנעילה `Viewport` חלה על ראשית התצוגה ועל רמת הזום יחד, ולכרטיסייה, לשפת הקוד של מחולל הקוד, לשני סגנונות השמות ולסוג המירכאות יש לכל אחד מהם נעילה משלו.  
החל מגרסה `4.2.0`, כך גם ל[תצוגת השמות](../../guide/guides/logical-names.md#name-view), שהנעילה `Name View` שלה מופעלת במסמך חדש.  
הנעילות מחליפות את `ignoreSaveSettings` של המסמך, שהחל מגרסה `4.0.0` אינו נקרא ואינו נכתב.  
לפני גרסה `4.0.0`, `value` היה המסמך כולו כפי שהמאגר החזיק אותו, לאחר החלת סיביות הגלילה והזום של השדה הזה.

### runtimeValue getter {#runtimevalue-getter}

החל מגרסה `4.0.0`, מבצע סריאליזציה למסמך כפי שהרפליקה מחזיקה אותו, כולל הישויות שהוסרו וכל מה שטעינה מחשבת.  
גם כאן, כל הגדרה נעולה נכתבת בערך הנעול שלה.

```js
const snapshot = replicationStore.runtimeValue;
```

יש להשתמש בו כדי לאתחל עורך או מאגר אחר שמצטרף מאוחר יותר, באמצעות המתודה `setInitialValue` שלו; ראו [עריכה שיתופית](./collaborative-editing.md).  
אין לאחסן אותו לעולם כקובץ: הוא נושא את הישויות שהוסרו, וה-[JSON Schema](./schema.md#json-schema) שפורסם דוחה אותו.  
הישויות שהוסרו הן אלה שמאפשרות לביטול של הסרה, שנשלח מאוחר יותר, להחזיר את הישות בשלמותה במאגר שאותחל ממנו.  
הן נשארות עד הפעם הבאה שבה המסמך נפתח מהקובץ שלו, שהצורה שלו משמיטה אותן.

### setInitialValue {#setinitialvalue}

טוענת את מצב העורך שאוחסן קודם לכן.

```js
replicationStore.setInitialValue('json...');
```

היא מקבלת את צורת האחסון, ערך זמן ריצה, או מסמך שגרסה קודמת שמרה, כולל מסמך v2.  
העברת מחרוזת ריקה, או של כל דבר שאינו מחרוזת, טוענת מסמך חדש וריק במקום לגרום לשגיאה.  
מאגר שמעולם לא קיבל ערך מתחיל באותו מסמך חדש.  
החל מגרסה `4.0.0`, כל ה[נעילות](../../guide/guides/settings.md#lock) במסמך הזה מופעלות, ולכן ה-`value` שלו שומר על התצוגה, הכרטיסייה, שפת הקוד של מחולל הקוד, סגנונות השמות וסוג המירכאות שאיתם התחיל, בזמן שהעורכים שהמאגר משכפל גוללים, משנים את הזום, עוברים בין כרטיסיות או משנים את ההגדרות האלה. בגרסה `3.10.0` הוא לא שמר את הגלילה ולא את הזום, ולפני כן הוא שמר את שניהם.  
החל מגרסה `4.2.0`, הוא שומר גם על תצוגת השמות שלו, `Physical Names`, בזמן שהעורכים מחליפים את שלהם.  
מסמך מאוחסן שומר על הנעילות שהוא מציין.  
מסמך שאינו מציין אף נעילה, כלומר כל מסמך שנשמר לפני גרסה `4.0.0`, כולל מסמך v2, נטען כשכל הנעילות מופעלות: ראשית התצוגה שלו ב-`0, 0`, רמת הזום שלו ב-`1` והכרטיסייה שלו ב-ERD, בלי קשר למה שנשמר בו, ושפת הקוד של מחולל הקוד, סגנונות השמות וסוג המירכאות שלו כפי שנשמרו בו.  
מסמך שנשמר לפני גרסה `4.2.0` אינו מציין את הנעילה `Name View`, ולכן הוא נטען כשהנעילה הזו מופעלת ובתצוגה `Physical Names`, גם אם נשמר כשכל שאר הנעילות כבויות.  
החל מגרסה `4.0.0`, `setInitialValue` גם משליכה את אוגרי שיתוף הפעולה שהוחזקו עבור המסמך הקודם, כפי שעושה המתודה [setInitialValue](../erd-editor-element.md#setinitialvalue) של האלמנט.  
גם טקסט שאינו JSON, כגון קובץ שנשארו בו סימוני התנגשות מיזוג, אינו גורם לשגיאה: שגיאת הניתוח רק נרשמת במסוף, המסמך מתרוקן, וההגדרות נשארות כפי שהיו.

החל מגרסה `4.0.0`, הטעינה אינה מריצה איסוף זבל, ולכן ישויות שהוסרו נשארות ב-[runtimeValue](#runtimevalue-getter).  
לפני כן, היא השליכה את הישויות שכבר לא הופיעו ב-`doc` ולא נגעו בהן במשך ארבעה ימים או יותר.

השכתובים של הטעינה מסתיימים לפני ש-`setInitialValue` חוזרת: סימוני המפתחות על העמודות, הנקראים מהאפשרויות של כל עמודה ומהקשרים; הרוחב של כל טבלה וכל עמודה, הנמדד מחדש באמצעות `toWidth`; הנקודות שבהן כל קו קשר פוגש את הטבלאות שלו; ודגל הקשר המזהה של כל קשר והסמל בקצה טבלת האב שלו.  
אף אחד מהם אינו חלק מ-`value`, אבל `replicationStore.runtimeValue` כבר מכיל את כולם אם קוראים אותו מיד לאחר הקריאה למתודה.  
פעולה שמגיעה מיד אחרי הטעינה, כגון גלילה שמבוצעת מחדש, נבחנת מול המסמך שנטען, ולכן הטעינה עצמה לעולם אינה מדווחת כ-[`changed`](#onchange).

לא הטעינה ואף לא אחד מהשכתובים האלה משגרים את `change`.  
כדי לכתוב בחזרה את המסמך שנטען בצורת האחסון, יש לקרוא את `replicationStore.value` ידנית לאחר ש-`setInitialValue` חוזרת.

### on@change {#onchange}

נרשמת לשינויים במצב העורך.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` מושהה (debounce) ב-200ms, כך שרצף מהיר של פעולות מגיע כהודעה אחת.  
הוא משוגר רק עבור פעולות מסוג שיכול לשנות את המסמך, ובנוסף עבור `settings.changeIgnoreSaveSettings` שעורך ישן יותר עדיין עשוי לשלוח (ראו [dispatch, dispatchSync](#dispatch-dispatchsync)).  
פעולת נוכחות שמועברת הלאה או `editor.mergeLWW` לעולם אינן מעוררות אותו.  
לביטול ההרשמה, יש לקרוא לפונקציה המוחזרת.

החל מגרסה `3.10.0`, המאזין מקבל `ReplicationChange`, טיפוס ש-`@dineug/erd-editor/engine.js` מייצא לצד `ReplicationStore`.  
לפני גרסה `3.10.0`, הוא לא קיבל דבר, ומאזין שמתעלם מהארגומנט ממשיך לעבוד.  
`value` הוא המסמך לאחר סריאליזציה בצורת האחסון, אותה מחרוזת ש-`replicationStore.value` מחזיר באותו רגע, כך שאין צורך לבצע סריאליזציה נוספת.  
`changed` הוא `false` כשהפעולות מאז ה-`change` הקודם, או מאז הטעינה, השאירו את `value` בייט אחר בייט כפי שהיה.

שינוי ש[נעילה](../../guide/guides/settings.md#lock) משאירה מחוץ ל-`value` עדיין משגר את `change`, כש-`changed` מוגדר ל-`false`, ולכן יש לכתוב רק כש-`changed` הוא `true`.  
מדובר בגלילה או בזום כשההגדרה `Viewport` נעולה, במעבר בין כרטיסיות כשההגדרה `Canvas Type` נעולה, ובשינוי של שפת הקוד של מחולל הקוד, של סגנון שמות או של סוג המירכאות כשהנעילה של אותה הגדרה מופעלת.  
החל מגרסה `4.2.0`, מדובר גם בהחלפה של תצוגת השמות כשההגדרה `Name View` נעולה: העורך עדיין שולח אותה, אבל הרפליקה משליכה אותה, כפי שעושים העורכים האחרים.  
החלפה של תצוגת השמות שבוצעה בעורך לקריאה בלבד מושלכת באותו אופן, בלי קשר לנעילה שלה.  
האירוע [change](../erd-editor-element.md#change) של האלמנט משמיט שינוי כזה, אבל הרפליקה עדיין מדווחת עליו.  
במסמך חדש ובמסמך שנשמר לפני גרסה `4.0.0` כל הנעילות מופעלות, וההגדרה `Name View` נעולה בכל מסמך שנשמר לפני גרסה `4.2.0`.  
כשההגדרה `Viewport` אינה נעולה, גלילה או זום משנים את `value`, כשההגדרה `Canvas Type` אינה נעולה, גם פתיחה של כרטיסייה אחרת של העורך משנה אותו, וכשההגדרה `Name View` אינה נעולה, גם החלפה של תצוגת השמות מעורך שאינו לקריאה בלבד משנה אותו.  
גם הפעלה או כיבוי של נעילה משנים את `value`.

החל מגרסה `4.0.0`, `changed` משווה את צורת האחסון, שאינה מכילה את הישויות שהוסרו ולא את סדר השכבות.  
לכן גם טבלה שנוספה והוסרה שוב בתוך `change` אחד, עריכה שחלה על ישות ששותף לעריכה אחר הסיר, וטעינה שמועברת הלאה ומשנה רק את סדר השכבות מסתיימות כולן כש-`changed` מוגדר ל-`false`.  
החל מגרסה `4.2.0`, כך גם שורה שנוספה לגיליון בכרטיסיית מילון ונשארה ריקה, מכיוון שצורת האחסון משמיטה שורה שאין בה דבר.

`changed` לעולם אינו משווה לקובץ השמור, שכבר עשוי להיות שונה מ-`value` מרגע שהוא נטען: זה המצב בקובץ שגרסה קודמת שמרה, כולל קובץ v2, וכך גם בקובץ שמתחיל בסימן סדר בייטים ובקובץ שנערך ידנית.  
החל מגרסה `4.2.0`, זה כולל קובץ שגרסה `4.0.0` או `4.1.0` שמרה, מכיוון ש-`value` משמיט את שדות הטקסט הריקים של הישויות שלו ואת רשימות ה-`doc` והאוספים הריקים שקובץ כזה מכיל.  
השוואת בייטים מול קובץ כזה הייתה מחשיבה כעריכה אפילו גלילה שנעילה משמיטה.  
ה-`change` הראשון שבו `changed` מוגדר ל-`true` מוסר קובץ כזה בחזרה בצורת האחסון, כך שכתיבתו משכתבת את הקובץ פעם אחת.  
קובץ שגרסה זו שמרה אינו שונה, בלי קשר למקום שבו נשמר, כפי שמוסבר ב-[toWidth](#towidth).  
אם `setInitialValue` מתבצעת בזמן ש-`change` עדיין ממתין, ושום דבר לא מוחל ב-`dispatch` לפני מועדו, ה-`change` הזה עדיין מגיע, עם ה-`value` שנטען ו-`changed` שמוגדר ל-`false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

מחילות שינויים מעורך מרוחק על ה-replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` דוחה את ההחלה למיקרו-משימה, ו-`dispatchSync` מחילה את האצווה מיד.

ניתן להעביר את זרם הפעולות של מאגר משותף בלי לסנן אותו.  
שתי המתודות שומרות רק את הפעולות מסוג שיכול לשנות את המסמך, ובנוסף את שתי הפעולות שמתוארות בסוף הסעיף הזה, ומשליכות את השאר, כך שהנוכחות שסשן עריכה שיתופית נושא – סמן העכבר, הפוקוס, הבחירה ומלבן הבחירה של כל משתמש – עוברת דרכן בלי להשפיע על דבר.

החל מגרסה `3.10.0`, הפעולות שנשמרות כוללות את `relationship.changeOnDelete` ו-`relationship.changeOnUpdate`, ו-`relationship.add` נושאת את `onDelete` ו-`onUpdate`.  
מאגר מגרסה קודמת משליך את הפעולות האלה ומתעלם מהשדות האלה, ולכן הוא מאבד את פעולות ה-[ON DELETE ו-ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) של קשר.

החל מגרסה `4.0.0`, הפעולות שנשמרות כוללות גם את `table.changeGroup`, שבע משמונה פעולות ה-`tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` ו-`tableGroup.changeColor`, כולן מלבד שינוי סדר השכבות `tableGroup.changeZIndex`), את `relationship.changeColumns`, את `settings.changeLockSettings` ואת `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` כבר אינה קיימת, ולכן שתי המתודות משליכות אותה.  
מאגר מגרסה קודמת משליך את הפעולות החדשות, ולכן הוא מאבד את [קבוצות הטבלאות](../../guide/guides/table-groups.md), את ה[נעילות](../../guide/guides/settings.md#lock), את הסקריפטים של [סכמת SQL](../../guide/guides/schema-sql.md), ואת העמודות ש[מיפוי עמודות](../../guide/guides/relationship-editing.md#map-columns) מקצה לקשר קיים.  
יש להריץ את הרפליקה באותה גרסה שבה רצים העורכים, או בגרסה חדשה יותר.

גרסה `4.1.0` אינה מוסיפה אף סוג פעולה ומשאירה את `@dineug/erd-editor/engine.js` כפי שהיה, ולכן רפליקה בגרסה `4.0.0` שומרת כל שינוי שעורך בגרסה `4.1.0` שולח, בדיוק כמו רפליקה בגרסה `4.1.0`.  
החל מגרסה `4.1.0`, הלחצנים `Replace` ו-`Replace All` ב[איתור והחלפה](../../guide/guides/find-and-replace.md#replacing) משנים גם את השמות של אינדקסים ושל קבוצות טבלאות, באמצעות הפעולות `index.changeName` ו-`tableGroup.changeName` שרפליקה בגרסה `4.0.0` כבר שומרת.  
המצב של ה[סייר](../../guide/guides/explorer.md) עצמו לעולם אינו נשלח, ומעבר בין כרטיסיות או גלילה שהוא מבצע מגיעים כמו כל מעבר בין כרטיסיות או גלילה אחרים; ראו [עריכה שיתופית](./collaborative-editing.md).

החל מגרסה `4.2.0`, הפעולות שנשמרות כוללות גם את `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode`, ואת `dictionary.add`, `dictionary.update` ו-`dictionary.remove`, שנושאות כל עריכה, מיון וייבוא CSV בגיליונות של כרטיסיית [מילון](../../guide/guides/dictionary.md).  
מבין ההחלפות של תצוגת השמות, רפליקה מחילה רק את אלה שעורך שאינו לקריאה בלבד מבצע כשההגדרה `Name View` אינה נעולה, ומשליכה את השאר (ראו [on@change](#onchange)).  
מאגר מגרסה קודמת משליך את כל הפעולות האלה, ולכן הוא מאבד את ה[שמות הלוגיים](../../guide/guides/logical-names.md), את הקישורים לתחומים, את המידע אם כל שם הגיע מהמילונים, את המילים, המונחים והתחומים, ואת תצוגת השמות.  
עורך בגרסה שקודמת ל-`4.2.0` שנמצא בסשן עדיין יכול לגרום לרפליקה בגרסה `4.2.0` לאבד חלק מזה.  
ייבוא באמצעות `Import` של סכמת SQL, GraphQL, DBML או AML בעורך הזה, אך לא באמצעות `Import and Add`, מרוקן את המילים, המונחים והתחומים של הרפליקה.  
ביטול של טעינה, של `Import` או של `clear()` בעורך הזה טוען לרפליקה את העותק שלו של המסמך, בלי שמות לוגיים, בלי קישורים לתחומים ובלי מילונים; ראו [שילוב גרסאות שונות](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` מייצא את אותם `createReplicationStore`, `ReplicationStore` ו-`ReplicationChange` כמו קודם, ו-`createReplicationStore` מקבלת את אותו ההקשר.

החל מגרסה `4.0.0`, שתי המתודות מחילות גם את `editor.mergeLWW`, שנושאת את אוגרי שיתוף הפעולה שבהם עורך משיב כשעורך אחר מצטרף לסשן, כך שהרפליקה מכריעה בין עריכות מקבילות באותו אופן שבו העורכים מכריעים.  
היא אינה משנה אף בייט של `value` ואינה משגרת `change`.  
`settings.changeIgnoreSaveSettings`, שעורך בגרסה שקודמת ל-`4.0.0` עדיין עשוי לשלוח, נשמרת אך אינה משנה דבר: היא משגרת `change` כש-`changed` מוגדר ל-`false`.

### destroy {#destroy}

משמידה לחלוטין את המופע של replicationStore.

```js
replicationStore.destroy();
```

לאחר מכן, המאגר מפסיק לשגר את `change` ומתעלם מכל החלה נוספת ב-`dispatch`.  
המסמך קופא בערכו האחרון במקום לגרום לשגיאה.  
כדי להתחיל מחדש, יש ליצור מאגר חדש.
