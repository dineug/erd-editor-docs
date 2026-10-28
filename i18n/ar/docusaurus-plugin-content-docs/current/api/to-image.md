---
sidebar_position: 4
description: ارسم مستندًا بصيغة PNG أو SVG من شيفرتك الخاصة باستخدام toImage، بخيارات مربع الحوار Export image، في المتصفح وفي عامل التصدير حيث وُجد.
---

# toImage

منذ الإصدار `5.0.0` يصدّر جذر الحزمة الدالة `toImage()`، التي ترسم مستندًا بصيغة PNG أو SVG دون محرر في الصفحة.  
وهي تكتب الملفات التي يكتبها الزران `PNG` و`SVG` في مربع الحوار [Export image](../guide/guides/file-import-export.md#image)، بخيارات المربع الثلاثة، `Background` و`Dark mode` و`Scale`، ولا شيء غيرها.

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

ويُصدَّر `ToImageOptions` نوعًا بجانبها، راجع [نقاط الدخول](./installation.md#entry-points).

## value {#value}

نص المستند: ما يحمله ملف `.erd.json`، أو [value](./erd-editor-element.md#value) أو [runtimeValue](./erd-editor-element.md#runtimevalue) في محرر، أو أي نص آخر تحمّله [setInitialValue](./erd-editor-element.md#setinitialvalue).  
والنص الفارغ، أو الذي لا يضم سوى مسافات، يرسم مخططًا فارغًا، وكذلك JSON الذي لا يحمل أيًّا من حقول المستند، فيملؤها المحلل بالقيم الافتراضية.

## الخيارات {#options}

| الخيار | القيمة الافتراضية | الوصف |
| --- | --- | --- |
| `format` | لا توجد؛ وهو مطلوب | يُحَلّ `'png'` إلى `Blob` من النوع `image/png`، و`'svg'` إلى شيفرة SVG سلسلةً نصية. |
| `background` | `true` | يطلي لون لوحة الرسم خلف المخطط. و`false` يتركه شفافًا، بما في ذلك الصندوق تحت تسمية ON DELETE أو ON UPDATE. |
| `darkMode` | `false` | يرسم النسق الداكن بدلًا من الفاتح. |
| `scale` | `2` | `1` أو `2` أو `3` من وحدات البكسل في الصورة لكل وحدة من المخطط عند 100%. وهو يحدد حجم PNG وحده؛ أما SVG فبحجم المخطط أيًّا كان المقياس. |

ولا تقرأ `toImage()` أي مفتاح آخر، لذا فإن مفتاحًا لا يسرده الجدول لا يغيّر شيئًا.

## ما ترسمه {#what-it-draws}

الصورة هي التي يرسمها مربع الحوار:

- المخطط كله، مقتطعًا إلى ما يرسمه مع هامش وعند 100% دائمًا، أيًّا كان التكبير الذي حُفظ به المستند، فيُرسم كل جدول كاملًا. وما تخفيه [View Option](../guide/guides/table-related-functions.md#table-view-options) في المستند لا يُرسم ولا يُترك له مكان، وتُرسم مجموعات الجداول خلف كل شيء آخر، ولا تُرسم الألوان التي تمنحها [فحوصات القاموس](../guide/guides/dictionary.md#marks-on-the-canvas) للأسماء.
- وصورة PNG بحجم المخطط عند 100% مضروبًا في `scale`. والصورة التي تكبر على لوحة رسم المتصفح تُكتب بدقة مخفّضة بدلًا من أن تخفق، ولا تخبر `toImage()` بذلك.
- وSVG يحتفظ بنصه نصًّا ويسمّي خطوطه بدلًا من تضمينها، لذا يرسم العارض الذي لا يملك خط المحرر بخط آخر. وتُترك الظلال.

وحيث يأخذ مربع الحوار شاشة المحرر، تأخذ `toImage()` المستند وحده، لذا يُرسم المستند على نحو متماثل في كل صفحة:

- ألوانه هي النسق المسبق للرمادي ولون التمييز الافتراضيين للعنصر، `slate` و`indigo`، فاتحًا ما لم تكن `darkMode` تساوي `true`. ولا يصلها أي نسق للصفحة، ولا تجاوز من [setTheme](./erd-editor-element.md#settheme)، ولا تغيير في [منشئ النسق](../guide/guides/language-and-theme.md).
- وتُسمّى جداوله وأعمدته في [عرض الأسماء](../guide/guides/logical-names.md#name-view) الذي يحمله المستند، وهو، في ملف قفل `Name View` فيه مفعّل، العرض المقفل.
- والكلمات التي يرسمها المخطط بنفسه، مثل نص بديل لجدول بلا اسم، بالإنجليزية.

## أين تعمل {#where-it-runs}

تحتاج `toImage()` إلى صفحة متصفح، لأنها تقيس وترسم على لوحة رسم canvas. وجذر الحزمة الذي تأتي منه يحتاج إلى DOM ليُحمَّل، فلا يمكن بلوغها من Node أو Web Worker، راجع [العرض من جانب الخادم](./installation.md#server-side-rendering).  
وهي تنتظر حتى تنتهي خطوط الصفحة من التحميل قبل أن ترسم.

وترسم في SharedWorker الخاص بتصدير الصورة حيث يشغّل المضيف واحدًا، كما يفعل مربع الحوار، فتبقى الصفحة مستجيبة أثناء ذلك، وترسم على الخيط الرئيسي حيث لا يوجد أو حيث لا يجيب العامل في الوقت المناسب، راجع [Web Workers](./installation.md#web-workers).  
والحزمة التي تستورد `toImage` ولا تستورد أي عنصر تحمل عامل تصدير الصورة وحده.  
ولا تحملها أي من نسختَي [الوسم script](./installation.md#script-tag): فـ`window.ErdEditor` و`window.ErdViewer` لا تضمان `toImage`.

## حالات الرفض {#rejections}

يُرفض الوعد `Promise` الذي تُرجعه، قبل أن يُرسم أي شيء، حين:

- لا يكون للصفحة `document`: `Error`، `toImage needs a browser, since it draws on a canvas`؛
- لا تكون `value` سلسلة نصية، مثل مستند حُلِّل بالفعل إلى كائن: `TypeError`؛
- يحمل خيار قيمة لا يسردها جدول [الخيارات](#options)، بما في ذلك `format` غائب، وكذلك `scale` تساوي `'2'` تُمرَّر مع SVG: `TypeError` يسمّي الخيار، كما في `toImage: scale cannot be 4`؛
- يكون النص مستندًا لا يستطيع المحلل قراءته: خطأ المحلل، `SyntaxError` للنص الذي ليس JSON.

## مربع الحوار Export image {#export-image-dialog}

يرسم المربع و`toImage()` عبر التصدير نفسه، فبالخيارات نفسها يكتبان الصورة نفسها، لكنهما يبدآن من موضعين مختلفين:

| | مربع الحوار `Export image` | `toImage()` |
| --- | --- | --- |
| المستند | المخطط كما كان حين فُتح المربع | النص الذي تمرّره |
| الوضع الداكن | يبدأ مطابقًا لمظهر المحرر، وما دام مطابقًا يرسم ألوان الشاشة نفسها | معطّل ما لم تكن `darkMode` تساوي `true`، وهو النسق المسبق دائمًا |
| عرض الأسماء | الذي يعرضه المحرر | الذي يحمله المستند |
| لغة كلماته الخاصة | لغة عرض المحرر | الإنجليزية |
| النتيجة | تُحفظ عبر المتصفح أو [دالة رد نداء التصدير](./installation.md#file-dialogs)، أو تُنسخ إلى الحافظة | تُسلَّم إليك؛ ولا تُستدعى أي من دالتَي رد النداء للملفات |

ولا مقابل للأمر `Copy to clipboard`. والصفحة التي تريده تكتب `Blob` بصيغة PNG إلى الحافظة بنفسها.
