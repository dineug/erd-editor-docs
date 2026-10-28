---
sidebar_position: 4
description: ציור מסמך כ-PNG או כ-SVG מהקוד שלכם באמצעות toImage, עם האפשרויות של תיבת הדו-שיח Export image, בדפדפן וב-worker הייצוא היכן שיש כזה.
---

# toImage

החל מגרסה `5.0.0`, שורש החבילה מייצא את `toImage()`, שמצייר מסמך כ-PNG או כ-SVG בלי עורך בדף.  
היא כותבת את הקבצים שהלחצנים `PNG` ו-`SVG` של תיבת הדו-שיח [Export image](../guide/guides/file-import-export.md#image) כותבים, עם שלוש האפשרויות של התיבה, `Background`, `Dark mode` ו-`Scale`, ובלי אחרות.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` מיוצא כטיפוס לצידה – ראו [נקודות כניסה](./installation.md#entry-points).

## value {#value}

הטקסט של המסמך: מה שקובץ `.erd.json` מכיל, [value](./erd-editor-element.md#value) או [runtimeValue](./erd-editor-element.md#runtimevalue) של עורך, או כל טקסט אחר ש-[setInitialValue](./erd-editor-element.md#setinitialvalue) טוענת.  
טקסט ריק, או רווחים בלבד, מצייר תרשים ריק, וכך גם JSON שאינו מכיל אף אחד משדות המסמך, שהמנתח ממלא בברירות מחדל.

## אפשרויות {#options}

| אפשרות | ברירת מחדל | תיאור |
| --- | --- | --- |
| `format` | אין; היא חובה | `'png'` מחזיר `Blob` מסוג `image/png`, ו-`'svg'` את הסימון של ה-SVG כמחרוזת. |
| `background` | `true` | צובע את צבע בד הציור מאחורי התרשים. `false` משאיר אותו שקוף, כולל התיבה שמתחת לתווית ON DELETE או ON UPDATE. |
| `darkMode` | `false` | מצייר את ערכת הנושא הכהה במקום הבהירה. |
| `scale` | `2` | `1`, `2` או `3` פיקסלים של תמונה ליחידה של התרשים ב-100%. היא קובעת את גודל ה-PNG בלבד; ה-SVG הוא בגודל התרשים, יהיה ה-scale אשר יהיה. |

`toImage()` אינה קוראת מפתח אחר, ולכן מפתח שהטבלה אינה מונה אינו משנה דבר.

## מה היא מציירת {#what-it-draws}

התמונה היא זו שהתיבה מציירת:

- התרשים כולו, חתוך למה שהוא מצייר בתוספת שוליים ותמיד ב-100%, יהיה הזום ששמר המסמך אשר יהיה, כך שכל טבלה מצוירת במלואה. מה ש-[View Option](../guide/guides/table-related-functions.md#table-view-options) מסתיר במסמך אינו מצויר ואינו מקבל מקום, קבוצות טבלאות מצוירות מאחורי כל השאר, והצבעים ש[בדיקות המילון](../guide/guides/dictionary.md#marks-on-the-canvas) נותנות לשמות אינם מצוירים.
- PNG הוא בגודל התרשים ב-100% כפול `scale`. כזה שגדול מדי לבד ציור של דפדפן נכתב ברזולוציה מופחתת ולא נכשל, ו-`toImage()` אינה מודיעה על כך.
- SVG שומר את הטקסט שלו כטקסט ומציין את הגופנים שלו במקום להטמיע אותם, ולכן מציג שאין לו הגופן של העורך מצייר גופן אחר. צללים מושמטים.

במקום שבו התיבה לוקחת את המסך של העורך, `toImage()` לוקחת את המסמך בלבד, כך שמסמך מצויר באותו אופן בכל דף:

- הצבעים שלה הם ערכת הנושא של ברירת המחדל של האלמנט לגוון האפור ולצבע ההדגשה, `slate` ו-`indigo`, בהירה אלא אם `darkMode` הוא `true`. שום ערכת נושא של הדף, שום עקיפה של [setTheme](./erd-editor-element.md#settheme) ושום שינוי ב[בונה ערכת הנושא](../guide/guides/language-and-theme.md) אינם מגיעים אליה.
- הטבלאות והעמודות שלה נקראות ב[תצוגת השמות](../guide/guides/logical-names.md#name-view) שהמסמך מחזיק, שעבור קובץ שהנעילה `Name View` שלו מופעלת היא הנעולה.
- המילים שהתרשים מצייר בעצמו, כמו מציין המיקום של טבלה ללא שם, הן באנגלית.

## היכן היא רצה {#where-it-runs}

`toImage()` צריכה דף בדפדפן, כי היא מודדת ומציירת על בד ציור. השורש שממנו היא באה צריך DOM כדי להיטען, ולכן לא ניתן להגיע אליה מ-Node או מ-Web Worker – ראו [רינדור בצד השרת](./installation.md#server-side-rendering).  
היא ממתינה לסיום טעינת הגופנים של הדף לפני שהיא מציירת.

היא מציירת ב-worker המשותף של ייצוא התמונות היכן שהמארח מריץ כזה, כפי שהתיבה עושה, כך שהדף נשאר מגיב בינתיים, ובתהליכון הראשי היכן שאין כזה או שה-worker אינו עונה בזמן – ראו [Web Workers](./installation.md#web-workers).  
חבילה שמייבאת את `toImage` וללא אלמנט נושאת את ה-worker של ייצוא התמונות בלבד.  
אף אחד משני ה-builds של [תגית script](./installation.md#script-tag) אינו נושא אותה: ל-`window.ErdEditor` ול-`window.ErdViewer` אין `toImage`.

## דחיות {#rejections}

ה-Promise שהיא מחזירה נדחה, לפני שמצוייר דבר, כאשר:

- לדף אין `document`: `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` אינו מחרוזת, כמו מסמך שכבר נותח לאובייקט: `TypeError`;
- אפשרות מחזיקה ערך שטבלת [האפשרויות](#options) אינה מונה, כולל `format` חסר, וכך גם `scale` של `'2'` שהועבר עם SVG: `TypeError` שמציין את האפשרות, כמו ב-`toImage: scale cannot be 4`;
- הטקסט אינו מסמך שהמנתח יכול לקרוא: השגיאה של המנתח, `SyntaxError` עבור טקסט שאינו JSON.

## תיבת הדו-שיח Export image {#export-image-dialog}

התיבה ו-`toImage()` מציירות דרך אותו ייצוא, ולכן עם אותן אפשרויות הן כותבות את אותה תמונה, אבל הן מתחילות ממקומות שונים:

| | תיבת הדו-שיח `Export image` | `toImage()` |
| --- | --- | --- |
| מסמך | התרשים כפי שהיה כשהתיבה נפתחה | הטקסט שאתם מעבירים |
| Dark mode | מתחיל בהתאמה למראה של העורך, וכל עוד הוא תואם מצייר את הצבעים של המסך עצמו | כבוי אלא אם `darkMode` הוא `true`, ותמיד ערכת הנושא של ברירת המחדל |
| תצוגת השמות | זו שהעורך מציג | זו שהמסמך מחזיק |
| שפת המילים שלה עצמה | שפת התצוגה של העורך | אנגלית |
| תוצאה | נשמרת דרך הדפדפן או דרך [פונקציית ה-callback של הייצוא](./installation.md#file-dialogs), או מועתקת ללוח | מוחזרת לכם; אף אחת משתי פונקציות ה-callback של הקבצים אינה נקראת |

ל-`Copy to clipboard` אין מקבילה. דף שרוצה כזו כותב את ה-`Blob` של ה-PNG ללוח בעצמו.
