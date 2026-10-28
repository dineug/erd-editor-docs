---
sidebar_position: 1
description: تثبيت @dineug/erd-editor من npm أو من CDN، وتسجيل عنصرَي المحرر والعارض، وربط مربعات حوار الملفات، والترقية من الإصدار 4.x أو 3.x.
---

# التثبيت

```sh
npm install @dineug/erd-editor
```

الحزمة بصيغة ESM فقط (`"type": "module"`)، ولا تتضمن سوى المجلد `dist`.
لا توجد نسخة CommonJS، لذا لا يعمل `require('@dineug/erd-editor')`.

تضم الحزمة عنصرين مخصصين: `<erd-editor>` وهو المحرر، ومنذ الإصدار `5.0.0` `<erd-viewer>` الذي يعرض مخططًا للقراءة فقط، راجع [ErdViewerElement](./erd-viewer-element.md).
ومنذ الإصدار `5.0.0` لا يعرّف استيراد جذر الحزمة أيًّا منهما. ولكل عنصر نقطة دخول خاصة به تعرّفه، راجع [تسجيل العناصر](#registering-the-elements).

تبقى تبعيات وقت التشغيل للحزمة خارجية، على هيئة استيرادات مجردة تحلّها أداة التجميع لديك وتزيل تكرارها وتستبعد منها ما لا يُستخدم. ومنذ الإصدار `5.0.0` يضم مجلد `dist` فيها ملفًا واحدًا لكل وحدة، فتحتفظ أداة التجميع بالوحدات التي تصل إليها الصفحة فقط، راجع [نقاط الدخول](#entry-points).
تُخرَج عمّال SharedWorker الخاصة بالحزمة كملفات دخول منفصلة ضمن `dist/workers/`، وتُنشأ باستخدام `new URL('./…', import.meta.url)`، وهي الصيغة التي يجمّعها Vite وwebpack 5 وRspack بوصفها نقطة دخول لعامل. راجع [Web Workers](#web-workers).
وللصفحة التي لا تعتمد على أداة تجميع توجد نسختان مكتفيتان بذاتيهما، راجع [الوسم script](#script-tag).

## الاستخدام {#usage}

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

يعرّف `@dineug/erd-editor/erd-editor.js` العنصر `<erd-editor>` لحظة استيراده. أما الصفحة التي تعرض مخططًا فحسب فتستورد `@dineug/erd-editor/erd-viewer.js` بدلًا منه، راجع [ErdViewerElement](./erd-viewer-element.md).

ليس للعنصر `<erd-editor>` حجم ذاتي. حدّد له (أو لحاويته) عرضًا وارتفاعًا صريحين.
منذ الإصدار `4.1.0`، يرسو [المستكشف](../guide/guides/explorer.md) المفتوح داخل العنصر على يسار لوحة رسم ERD، ويضيّق لوحة الرسم بدلًا من أن يغطيها. ويبدأ المحرر الجديد والمستكشف مغلق.
لا تُرسم لوحة المستكشف بعرض يقل عن `200px`، وتترك للوحة الرسم `320px` على الأقل، لذا لا يُرسم المستكشف المفتوح في عنصر يقل عرضه عن `520px` حتى يتسع العنصر، راجع [بجوار لوحة الرسم](../guide/guides/explorer.md#beside-the-canvas).

تبدأ الدالة `setInitialValue('')` مستندًا جديدًا فارغًا. أما إسناد قيمة إلى `value` فيحمّل المستند بوصفه تعديلًا، فيُضاف إلى سجل التراجع.
منذ الإصدار `4.0.0`، تمثل الخاصية `editor.value` المستند بالصيغة التي يحفظها الملف، وهي ما ينبغي تخزينه. أما `editor.runtimeValue` فتمثل المستند كما يحتفظ به المحرر، بما في ذلك الكيانات المُزالة: فهي تهيّئ متعاونًا ولا تُكتب في ملف أبدًا، راجع [runtimeValue](./erd-editor-element.md#runtimevalue).
منذ الإصدار `4.0.0`، تكون جميع [أقفال الإعدادات](../guide/guides/settings.md#lock) مفعّلة أيضًا في المستند الجديد: إطار العرض وعلامة التبويب ولغة منشئ التعليمات البرمجية ونمطا التسمية كلاهما ونوع علامات الاقتباس، ومنذ الإصدار `4.2.0` [عرض الأسماء](../guide/guides/logical-names.md#name-view). التمرير أو تغيير مستوى التكبير أو التبديل بين علامات التبويب أو تبديل عرض الأسماء أو تغيير أحد الإعدادات الأخرى يُبقي القيمة `editor.value` كما هي ولا يُطلِق الحدث `change`. يحتفظ المستند المحمَّل من نص بالأقفال التي يحددها. أما المستند الذي لا يحدد أيًّا منها، مثل أي ملف حُفظ قبل الإصدار `4.0.0`، فيُفتح وكل الأقفال مفعّلة، بمستوى تكبير 100% وفي علامة تبويب ERD، أيًّا كان إطار العرض وعلامة التبويب المحفوظان فيه. ويُقفل إطار عرضه عند نقطة الأصل `0, 0`، ويُفتح موضع العرض على المخطط بدلًا من ذلك إذا لم يُرسم أي جزء من المخطط هناك، راجع [setInitialValue](./erd-editor-element.md#setinitialvalue).
يُفتح الملف المحفوظ قبل الإصدار `4.2.0` وعرض الأسماء مقفل على العرض `Physical Names`، حتى لو كانت كل أقفاله الأخرى معطّلة. يُبقي المحرر بالإصدار `4.0.0` أو `4.1.0` قفل عرض الأسماء على حاله عند الحفظ لكنه يُسقط العرض، لذا فإن ملف الإصدار `4.2.0` المحفوظ وعرض الأسماء غير مقفل يبقى غير مقفل لكنه يُعاد فتحه على العرض `Physical Names`.
لمعرفة بقية واجهة برمجة التطبيقات، راجع [ErdEditorElement](./erd-editor-element.md).

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

يحلّ `esm.run` التبعيات الخارجية للحزمة نيابةً عنك، لذا يعمل هذا دون أداة تجميع.
يصل كل مدخل بمساره بعد رقم الإصدار: فـ`…/erd-editor.js` يعرّف المحرر، و`…/erd-viewer.js` يعرّف العارض، الذي يجلب من CDN كل لغة عرض غير الإنجليزية حين تطلبها صفحة. أما عنوان الحزمة المجرد `https://esm.run/@dineug/erd-editor@5.0.0` فيقدّم الجذر الذي لا يعرّف أي عنصر.
يقدّم عنوان URL غير المحدد بإصدار أحدث إصدار دائمًا. حدّد إصدارًا بعينه، كما في الأعلى، إذا كنت لا تريد أن تصل ترقية رئيسية إلى صفحتك دون سابق إنذار.
والإصدار `5.0.0` نفسه ترقية من هذا النوع: فالصفحة التي يجب أن تبقى على الإصدار 4.x تحدّد `@4.2.0` في العنوان، راجع [الترقية من الإصدار 4.x](#upgrading-from-4x).

يقدّم `esm.run` العمّال المشتركين من `cdn.jsdelivr.net`، ولا يبدأ المتصفح عاملًا مشتركًا من أصل غير أصل الصفحة. لذا يعمل المحرر المحمَّل بهذه الطريقة دون عمّاله، كما يعمل على مضيف يحظرهم، راجع [Web Workers](#web-workers). أما نسخة [الوسم script](#script-tag) فتحملهم داخل ملفها.

### الوسم script {#script-tag}

منذ الإصدار `3.6.0`، تتضمن الحزمة أيضًا نسخة UMD تضم كل التبعيات وكل عمّال SharedWorker داخل ملف واحد، هو `dist/erd-editor.umd.js`.
وهي النسخة التي يشير إليها الحقلان `unpkg` و`jsdelivr`، لذا يقدّمها عنوان URL المجرد للحزمة على أيٍّ من خدمتي CDN، وهي تعرّف `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

يعرّف تحميلها العنصر `<erd-editor>`. ويحمل `window.ErdEditor` دالتَي رد النداء الخاصتين بالملفات، `ErdEditor.setExportFileCallback` و`ErdEditor.setImportFileCallback`، ويحمل منذ الإصدار `3.9.2` الدالة `ErdEditor.createKeyBindingMap`، ومنذ الإصدار `4.2.0` الدالة `ErdEditor.dictionaryRowChords` — راجع [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — ومنذ الإصدار `5.0.0` العنصرين `ErdEditor.ErdEditorElement` و`ErdEditor.defineErdEditor` — راجع [تسجيل العناصر](#registering-the-elements). ولا يحمل [toImage](./to-image.md).

ومنذ الإصدار `5.0.0` يعرّف ملف ثانٍ، هو `dist/erd-viewer.umd.js`، العنصر `<erd-viewer>` ويضع `ErdViewerElement` و`defineErdViewer` على `window.ErdViewer`. ولا يبدأ أي عامل، ويضم لغات العرض الخمس والعشرين كلها، ولا يطلب شيئًا سوى `src` الذي يُعطاه.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

لا يعرّف أي من الملفين وسم الآخر، ولا يترك أي منهما على الصفحة متغيرًا عامًا سوى متغيره و`window.Konva`.
ولا تزال خريطة exports توجّه أداة التجميع إلى وحدات ES، لذا لا يلتقط التثبيت من npm أيًّا من الملفين أبدًا.
وللصفحة التي لا تستطيع تحميل سكربت خاص بها أن تُطر العارض المستضاف على erd-editor.io/embed بدلًا من ذلك، راجع [التضمين](../guide/guides/embedding.md).

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

منذ الإصدار `4.0.0`، تضيف السمة `enable-locale-picker` المنتقي `Display Language` إلى شريط الأدوات، وتضيف السمة `enable-welcome-screen` شاشة الترحيب التي يعرضها المخطط الفارغ، راجع [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) و[enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
تفعّل الصفحة التي تحمّل مستندًا، كما في [الاستخدام](#usage)، الخاصية `enableWelcomeScreen` بعد أن تحمّله الدالة `setInitialValue()` وليس في الوسوم، حتى لا تومض الشاشة أبدًا فوق ملف لا يزال قيد التحميل.
يحمل المحرر لغات العرض كلها، وعددها 25 لغة، في نسخة ES ونسخة الوسم script على حد سواء، لذا لا يوجد ملف لغة يلزم تقديمه ولا شيء يلزم تسجيله. ومن دون المنتقي ودون استدعاء `setLocale()`، يعرض المحرر اللغة الإنجليزية.

تؤدي إضافة السمة `readonly` هنا إلى فتح المحرر قارئًا: يُتجاهل إسناد `value` واستدعاء `clear()` وكل استدعاء للدوال `setSchema*()` — بما في ذلك `setSchemaJSON()` واستدعاءات الإلحاق — ولا يُطلَق الحدث `change` أبدًا. وتبقى علامات تبويبه والمستكشف والبحث السريع للقراءة، ويُحذف كل عنصر تحكم كان سيعدّل المخطط.
ولا تزال قراءة `editor.value` و`editor.runtimeValue` تعمل، وكلتاهما تحتفظ بإعدادات المستند نفسه: فإعداد العرض الذي يغيّره القارئ، كالتكبير أو قاعدة البيانات، يبقى على شاشة ذلك المحرر. حمّل المستند باستخدام `setInitialValue()` بدلًا من ذلك، راجع [readonly](./erd-editor-element.md#readonly).

### العرض من جانب الخادم {#server-side-rendering}

تحتاج كل نقطة دخول عدا `engine.js` و`peer.js` إلى DOM، لذا تُطلِق استثناءً في Node. يعرّف `erd-editor.js` و`erd-viewer.js` عنصريهما على مستوى الوحدة، أما جذر الحزمة، الذي لا يعرّف شيئًا منذ الإصدار `5.0.0`، فلا يزال يبني فئتَي العنصرين أثناء تحميله.
في Next.js أو Nuxt أو SvelteKit أو Astro، استورد نقطة دخول العنصر من مسار لا يُنفَّذ إلا في جانب العميل، وكذلك أي استيراد مسمّى من الجذر، مثل `setExportFileCallback` أو `toImage`، من المسار نفسه.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

في أثناء التطوير، أضف حزمة ELK التي يستوردها عامل التخطيط في المحرر إلى التجميع المسبق في Vite، وإلا أخفقت التخطيطات التي ينشئها ذلك العامل: `Flow` و`Tree - vertical` و`Tree - horizontal` في التخطيط التلقائي، ووضع التدفق في علامة تبويب التصور المرئي، والاستيراد الذي يرتّبه التدفق.
وتحتاج الإصدارات Vite 7 وما قبلها أيضًا إلى إبقاء المحرر خارج التجميع المسبق، لأن تجميعها المسبق يوجّه عناوين URL للعمّال إلى ملفات لا يكتبها أبدًا، فيخفق العمّال الثلاثة كلهم. وفي Vite 8 اترك `exclude` هذه، فكل ما تفعله أن يجلب خادم التطوير كل ملف من ملفات الحزمة على حدة. أما بناء الإنتاج فلا يحتاج إلى أيٍّ من الاثنين.

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

يدمج استيراد `@dineug/erd-editor/erd-editor.js` العنصر `erd-editor` في `HTMLElementTagNameMap`، ويدمج `@dineug/erd-editor/erd-viewer.js` العنصر `erd-viewer`، لذا يُعرف نوع العنصر دون تحويل صريح للنوع. وأي استيراد من الجذر، حتى لو كان نوعًا وحده، يجلب العنصرين معًا.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

يُصدَّر النوع `ErdEditorElement` لتحديد أنواع متغيراتك وخصائص مكوناتك. ومنذ الإصدار `5.0.0` هو أيضًا فئة العنصر، و`ErdViewerElement` هو واجهة العارض وفئته، راجع [تسجيل العناصر](#registering-the-elements).
منذ الإصدار `4.0.0`، تصدّر الحزمة أيضًا الأنواع `LocaleCode` و`LocaleOption` و`SchemaSQLOptions`، ومنذ الإصدار `5.0.0` النوع `ToImageOptions`، راجع [نقاط الدخول](#entry-points). أما الخيارات التي تقبلها الدوال `setSchema*()` فليس لها اسم مُصدَّر؛ استخرجها من العنصر، كما في `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
ومنذ الإصدار `5.0.0` يكتب الحقل `typesVersions` في الحزمة أنواع كل نقطة دخول فرعية تحت `moduleResolution: "node10"` أيضًا، الذي لا يقرأ خريطة exports.

## تسجيل العناصر {#registering-the-elements}

منذ الإصدار `5.0.0` لا تعرّف الحزمة وسمًا إلا حيث تطلب منها الصفحة ذلك.

| الاستيراد | ما يعرّفه |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | لا شيء |

تعرّف كل من نقطتَي الدخول هاتين وسمها أثناء تقييمها ولا تصدّر شيئًا، لذا تُستورد لأثرها وحده، ولا تعرّف إحداهما وسم الأخرى.
ويصدّر الجذر فئتَي العنصرين، `ErdEditorElement` و`ErdViewerElement`، والدالتين `defineErdEditor()` و`defineErdViewer()` اللتين تعرّفان وسمهما في الموضع الذي تستدعيهما فيه:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

لا يفعل الاستدعاء شيئًا ما دام الوسم يحمل تلك الفئة، لذا يمكن لنقطة دخول ودالة تعريف، أو لدالتَي تعريف، أن تلتقيا في صفحة واحدة. ويُطلِق `Error` يسمّي الوسم حين تحمله فئة أخرى، كما يحدث حين تُجمَّع نسخة ثانية من الحزمة في الصفحة نفسها: `Another element class already defines the custom element name erd-editor`.
والفئتان اللتان يصدّرهما الجذر هما اللتان تعرّفهما نقطتا الدخول، لذا `customElements.get('erd-editor') === ErdEditorElement` بعد أن تعمل إحداهما. وإلى أن يُعرَّف الوسم، ينشئ `document.createElement('erd-editor')` عنصر `HTMLElement` عاديًّا لا يحمل أيًّا من أعضاء المحرر، ويُطلِق `new ErdEditorElement()` استثناءً.

ولوسم من اختيارك، عرّف الفئة تحته بنفسك وأضف الوسم إلى `HTMLElementTagNameMap` بنفسك. افعل ذلك في نافذة لا تحمل نقطة دخول ذلك العنصر ولا نسخة [الوسم script](#script-tag) الخاصة به ولا تستدعي دالة تعريفه، لأن الفئة تأخذ اسمًا واحدًا في كل نافذة:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

تجعل الحزمة التي تضم العنصرين Vite وRolldown يحذّران من `INEFFECTIVE_DYNAMIC_IMPORT` مرة لكل لغة عرض غير الإنجليزية. فالعارض يحمّل كلًّا منها بـ`import()` خاص به، أما المحرر فيستورد كل القواميس دفعة واحدة، لذا تبقى في قطعة المحرر وتُحمَّل معها. ولا يخفق شيء، والحزمة التي تضم العارض وحده تُبقي كل لغة في قطعة خاصة بها.

## تمييز الصيغة {#syntax-highlighting}

يتولى [Shiki](https://shiki.style) تمييز الصيغة في لوحتَي مخطط SQL ومنشئ التعليمات البرمجية، داخل SharedWorker خاص به، ومنذ الإصدار `4.0.0` يتولى أيضًا تمييز السكربتين `Before tables` و`After tables` في علامة تبويب مخطط SQL.
منذ الإصدار `3.7.0`، لا يوجد ما يلزم تثبيته ولا ما يلزم تسجيله: يُنشأ العامل في أول مرة تُعرض فيها لوحة تعليمات برمجية، لذا لا تجلب الصفحة التي لا تفتح أي لوحة منها القواعد النحوية أبدًا.

| | |
| --- | --- |
| اللغات | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| الأنساق | `github-dark` و`github-light`، وفقًا لمظهر المحرر الفاتح أو الداكن |

هذه هي اللغات التي تُخرجها اللوحتان بالضبط: يُميَّز `JPA` بصيغة Java، و`SQLAlchemy` بصيغة Python، و`TypeORM` و`Sequelize` و`Drizzle` و`Zod` بصيغة TypeScript، و`Doctrine` بصيغة PHP، و`SeaORM` بصيغة Rust، و`JSON Schema` بصيغة JSON، و`DBML` و`AML` بصيغة SQL، وهي أقرب قاعدة نحوية في الحزمة، راجع [منشئ التعليمات البرمجية](../guide/guides/code-generator.md).

محرك التعبيرات العادية مكتوب بلغة JavaScript خالصة، لذا لا تحتاج أي سياسة لدى المضيف إلى `wasm-unsafe-eval`.
في البيئات التي لا يتوفر فيها `SharedWorker` — Chrome على Android قبل Chrome 148، وSafari قبل الإصدار 16.4 — يُسجَّل الإخفاق وتظهر التعليمات البرمجية نصًا عاديًا؛ ولا يزال تحرير السكربتات ممكنًا.

عند الترقية من الإصدار `3.6.0` أو أقدم: لم تعد الحزمة `@dineug/erd-editor-shiki-worker` تُنشر، وأُزيلت معها الدالة `setGetShikiServiceCallback`.
أزل التثبيت والتسجيل؛ وعلى الصفحة التي كانت تحمّل العامل من CDN أن تزيل أيضًا ذلك الوسم `<script>` الثاني.

## Web Workers {#web-workers}

يشغّل المحرر ثلاث مهام في عمّال `SharedWorker`: تمييز الصيغة، وتصدير الصورة، وتخطيط الجداول الذي يقف وراء [التخطيط التلقائي](../guide/guides/table-related-functions.md#auto-layout) و[وضع التدفق](../guide/guides/visualization.md#how-flow-is-placed) في علامة تبويب التصور المرئي، ومنذ الإصدار `4.0.0` ترتيب المخطط المستورد.
تأتي العمّال الثلاثة كلها داخل `@dineug/erd-editor`. لا يحتاج أي منها إلى إعداد من جانبك، لكن يمكن للمضيف أن يحظر كلًّا منها.
ومنذ الإصدار `5.0.0` يُنشأ كل عامل في وحدة خاصة به، فلا تحمل الحزمة إلا العمّال التي تصل إليها وحداتها: فالحزمة التي تضم [toImage](./to-image.md) دون أي عنصر تحمل عامل تصدير الصورة وحده، ولا يبدأ `<erd-viewer>` أي عامل، راجع [نقاط الدخول](#entry-points).
أُزيل العامل الذي كان يشغّل جمع البيانات المهملة للمستند في الإصدار `4.0.0`، إلى جانب عملية الجمع نفسها.

| العامل | بدونه |
| --- | --- |
| تمييز الصيغة | تبقى لوحتا مخطط SQL ومنشئ التعليمات البرمجية وسكربتات مخطط SQL نصًا عاديًا |
| تصدير الصورة | تُرسم صورة PNG وصورة SVG وما ينسخه `Copy to clipboard` ومعاينة مربع الحوار `Export image`، ومنذ الإصدار `5.0.0` نتيجة [toImage()](./to-image.md)، على الخيط الرئيسي، ما يوقف استجابة الصفحة أثناء الرسم |
| تخطيط الجداول | تنتهي تخطيطات `Flow` و`Tree - vertical` و`Tree - horizontal` في التخطيط التلقائي، ووضع التدفق في علامة تبويب التصور المرئي، بالرسالة `Could not place tables`؛ والاستيراد الذي يرتّبه التدفق — ملف SQL أو GraphQL أو DBML أو AML من `Import` أو `Import and Add`، أو استدعاء `setSchema*()` مع `placement: 'auto'` — يضع جداوله في صفوف، دون أي رسالة؛ ولا يتأثر `Force` ووضع الرسم البياني، لأنهما يعملان داخل المحرر |

ينتظر تصدير الصورة عشر ثوانٍ حتى يستجيب عامله ثم يرسم على الخيط الرئيسي، ويترك تمييز الصيغة التعليمات البرمجية نصًا عاديًا بمجرد إخفاق عامله، لذا فالمضيف الذي يحظر العمّال يخسر من الأداء لا من الوظائف.
يُستثنى تخطيط الجداول من ذلك: فالمحرك الذي يحسب التخطيط أكبر حجمًا من المحرر نفسه ولا يُحمَّل أبدًا داخل عملية الصفحة، لذا ينتظر 30 ثانية حتى يستجيب عامله عند أول ترتيب، وبعد أن يستجيب العامل يمنح التخطيط 60 ثانية ليعود بالنتيجة.
إذا نفدت أيٌّ من المهلتين، ينتهي الترتيب كما ينتهي في غياب العامل. يعرض التخطيط التلقائي الإشعار `Placing tables` فور بدئه، في حين لا يعرضه وضع التدفق والاستيراد الذي يرتّبه التدفق إلا بعد أن يستمر الترتيب، بما في ذلك بدء عامله، ست ثوانٍ.

تُخرج Vite وwebpack 5 وRspack العمّال في ملفات بجوار قطعك. أما esbuild وRolldown حين يُستخدم وحده لا عبر Vite فلا يُخرجان شيئًا، لذا تعمل الصفحة التي يبنيانها دون العمّال.
ولا يبدأ أي عامل تحت الخيار التجريبي `experiments.outputModule` في webpack، لأن كلًّا منهم ينتظر قطعة مشتقة منه لا يحمّلها شيء. أبقِ على مخرجات webpack الافتراضية، أو اضبط `optimization.splitChunks: false`.

### سياسة أمان المحتوى {#content-security-policy}

تحتاج الصفحة الخاضعة لسياسة أمان محتوى صارمة إلى هذه التوجيهات للعنصرين:

- `worker-src 'self'` للنسخة المجمّعة، التي تكون عمّالها ملفات بجوار الحزمة، بالإضافة إلى `blob:` حيثما تُضمّن أداة التجميع لديك عاملًا مباشرةً في التعليمات البرمجية. أما في نسخة [الوسم script](#script-tag) فتنتقل الثلاثة كلها داخل الملف على هيئة عناوين URL من نوع `data:`، لذا تحتاج تلك الصفحة إلى `worker-src data:` بدلًا من ذلك. ولا يحتاج `<erd-viewer>` إلى أيٍّ منهما، لأنه لا يبدأ أي عامل.
- منذ الإصدار `5.0.0` يُنسّق العنصران نفسيهما بأوراق أنماط مُنشأة برمجيًا، يتيحها `style-src 'self'`. ولا تزال لوحتا الشيفرة في المحرر تلوّن نصها بسمات `style`، ومعاينة مربع الحوار `Export image` صورة على عنوان `blob:`، لذا يحتاج المحرر أيضًا إلى `style-src 'unsafe-inline'` و`img-src blob:` لهما.
- المتصفح الذي لا يدعم أوراق الأنماط المُنشأة برمجيًا، مثل Firefox قبل 101، يحصل على عناصر `<style>` بدلًا منها، وهي تحتاج إلى `style-src 'unsafe-inline'` لأيٍّ من العنصرين.
- يجلب `<erd-viewer>` المسار `src` الخاص به، لذا يوضع أصل ذلك المسار في `connect-src`، راجع [ما يضيفه إلى الصفحة](./erd-viewer-element.md#what-it-adds-to-a-page).

## نقاط الدخول {#entry-points}

للحزمة خمس نقاط دخول:

| نقطة الدخول | ما هي |
| --- | --- |
| `@dineug/erd-editor` | الجذر: ما يُصدَّر أدناه. ومنذ الإصدار `5.0.0` لا يعرّف أي عنصر، مع أنه لا يزال يحتاج إلى DOM ليُحمَّل |
| `@dineug/erd-editor/erd-editor.js` | منذ الإصدار `5.0.0`. يعرّف `<erd-editor>` ولا يصدّر شيئًا |
| `@dineug/erd-editor/erd-viewer.js` | منذ الإصدار `5.0.0`. يعرّف `<erd-viewer>` ولا يصدّر شيئًا |
| `@dineug/erd-editor/engine.js` | مخزن المستند دون DOM |
| `@dineug/erd-editor/peer.js` | منذ الإصدار `3.9.1`. النظير بدون واجهة لخادم MCP |

يصدّر الجذر فئتَي العنصرين ودالتَي تعريفهما، ودالتين لتعيين دوال رد النداء، ومنذ الإصدار `3.9.2` اختصارات لوحة المفاتيح الافتراضية مع أنواعها، ومنذ الإصدار `4.0.0` أنواع لغة العرض ونوع خيارات الدالة `getSchemaSQL()`، ومنذ الإصدار `4.2.0` تركيبات مفاتيح الصفوف في علامة تبويب القاموس، ومنذ الإصدار `5.0.0` الدالة `toImage`.

| ما يُصدَّر | الوصف |
| --- | --- |
| `ErdEditorElement` | واجهة العنصر، راجع [ErdEditorElement](./erd-editor-element.md). ومنذ الإصدار `5.0.0` هو أيضًا فئته، التي يُعرَّف `<erd-editor>` بها، راجع [تسجيل العناصر](#registering-the-elements). |
| `ErdViewerElement` | منذ الإصدار `5.0.0`. واجهة العارض وفئته، راجع [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()` و`defineErdViewer()` | منذ الإصدار `5.0.0`. تعرّفان `<erd-editor>` أو `<erd-viewer>` بفئته. ولا يفعل الاستدعاء شيئًا ما دام الوسم يحمل تلك الفئة، ويُطلِق `Error` حين تحمله فئة أخرى، راجع [تسجيل العناصر](#registering-the-elements). |
| `toImage(value, options)` | منذ الإصدار `5.0.0`. ترسم مستندًا في `Blob` بصيغة PNG أو في سلسلة SVG، بخيارات مربع الحوار `Export image`، راجع [toImage](./to-image.md). |
| `ToImageOptions` (نوع) | منذ الإصدار `5.0.0`. الخيارات التي تقبلها `toImage()`: `format` و`background` و`darkMode` و`scale`. |
| `setExportFileCallback(cb)` | تحل محل التنزيل في المتصفح، `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | تحل محل منتقي الملفات في المتصفح، `({ type, op, accept, mode }) => void`؛ ويتوفر الحقل `mode` منذ الإصدار `4.0.0`. ومنذ الإصدار `4.2.0` يفتح الأمر `Import CSV` في علامة تبويب القاموس منتقي الملفات في المتصفح حتى مع تعيين دالة رد نداء، راجع [مربعات حوار الملفات](#file-dialogs). |
| `createKeyBindingMap()` | تُرجع اختصارات لوحة المفاتيح الافتراضية في `KeyBindingMap` جديد عند كل استدعاء، راجع [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap` و`KeyBindingName` و`ShortcutOption` (أنواع) | خريطة اختصارات، ونوع اتحاد يضم أسماء أوامرها، واختصار واحد. |
| `dictionaryRowChords(map)` | منذ الإصدار `4.2.0`. تُرجع، في مصفوفة `ShortcutOption[]` جديدة عند كل استدعاء، تركيبات المفاتيح التي تُدرج بها شبكة علامة تبويب [القاموس](../guide/guides/dictionary.md#adding-and-deleting-rows) الصفوف وتحذفها وفق `KeyBindingMap` الذي تمرّره. أما التركيبة التي تُدرج الصفوف في الأعلى، وهي `Alt+Shift+Enter` مع القيم الافتراضية، فلا ترد في أي اختصار، راجع [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode` و`LocaleOption` (نوعان) | منذ الإصدار `4.0.0`. رموز لغات العرض البالغة 25 لغة، وهذه الرموز مضافًا إليها `'system'`، وهو ما تقبله الدالة `setLocale()`، راجع [لغة العرض](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (نوع) | منذ الإصدار `4.0.0`. الخيارات التي تقبلها الدالة `getSchemaSQL()`: `statements` و`header`، ومنذ الإصدار `4.2.0` الخيار `logicalNameAsComment`، راجع [getSchemaSQL](./erd-editor-element.md#getschemasql). |

منذ الإصدار `5.0.0` يضم `dist` ملفًا واحدًا غير مصغّر لكل وحدة، بجانب كل منها ملف التصريح الخاص بها، ولا يسمّي الحقل `sideEffects` في `package.json` سوى نقطتَي دخول الوسمين وملفَّي stub يحتاج إليهما ملفا العاملين. لذا تُسقط أداة التجميع كل وحدة لا تصل إليها الصفحة وتصغّر مرة واحدة:

- الاستيراد المسمّى من الجذر، مثل `setExportFileCallback`، لا يجمع أيًّا من العنصرين ولا أي عامل.
- `toImage` يجلب عامل تصدير الصورة ولا يجلب أي عنصر.
- `erd-editor.js` يجلب المحرر وعمّال SharedWorker الثلاثة.
- `erd-viewer.js` يجلب العارض دون أي عامل، والإنجليزية داخله وكل لغة عرض أخرى في قطعة خاصة بها، تُحمَّل حين تطلبها الصفحة.

يشغّل `@dineug/erd-editor/engine.js` مخزن المستند دون DOM، لذا يعمل في Web Worker، راجع [التخزين البعيد](./advanced/remote-storage.md).
وهي تصدّر `createReplicationStore` والنوع `ReplicationStore`. ومنذ الإصدار `3.10.0` تصدّر أيضًا النوع `ReplicationChange`، `{ value: string; changed: boolean }`، الذي يتلقاه مستمع الحدث `change` في النسخة المتماثلة، راجع [on@change](./advanced/remote-storage.md#onchange).
منذ الإصدار `4.0.0`، يملك المخزن `ReplicationStore` أيضًا الخاصية `runtimeValue`. أما خاصيته `value` والقيمة التي يسلّمها الحدث `change` فهما بصيغة التخزين التي يحفظها الملف، مثل قيمة العنصر، راجع [ReplicationStore](./advanced/remote-storage.md#replicationstore).

تمثل `@dineug/erd-editor/peer.js` النظير بدون واجهة الذي يحرّر [خادم MCP](../mcp/introduction.md) المستند من خلاله. وهي موجودة لأجل ذلك الخادم، ولا توثّقها هذه الصفحات.

### مربعات حوار الملفات {#file-dialogs}

يمر الاستيراد والتصدير عبر دوال رد نداء قابلة للحقن، لذا يمكن للمضيف الذي لا يملك مربع حوار ملفات المتصفح — عرض ويب داخل بيئة تطوير، على سبيل المثال — أن يوفر مربعه الخاص.
والاثنان غير متماثلين: فالتصدير يسلّمك الملف الجاهز، بينما يطلب الاستيراد ملفًا فحسب، وتعيد أنت المحتوى إلى المحرر بنفسك.
منذ الإصدار `4.2.0`، يمثل الأمر `Import CSV` في علامة تبويب القاموس الاستيراد الوحيد الذي لا يستدعي دالة رد نداء الاستيراد أبدًا، إذ لا يملك الحقل `type` فيها قيمة لملفات CSV. فهو يفتح دائمًا منتقي الملفات الخاص بالمتصفح، لملفات `.csv`، راجع [استيراد ملفات CSV وتصديرها](../guide/guides/dictionary.md#importing-and-exporting-csv).

تكون قيمة `op` إما `set` أو `diff` — ويُوجَّه طلب `diff` إلى `setDiffValue()` أيًّا كانت قيمة `type`. وفي غير ذلك يحدد `type` الدالة، ويحمل `accept` امتدادات ذلك النوع، جاهزةً لتمريرها إلى مربع حوار الملفات لدى المضيف.
منذ الإصدار `4.0.0`، يحمل طلب `set` القيمة `mode: 'append'` عندما يختار المستخدم [استيراد وإضافة](../guide/guides/file-import-export.md#import-and-add)، ولا يحمل أي `mode` في الاستيراد العادي. مرّره كما هو: فدالة رد النداء التي تُسقطه تستبدل المخطط الذي طلب المستخدم الإضافة إليه.

| `type` | `accept` | الدالة |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

يرتّب `placement: 'auto'` الجداول وفق علاقاتها قبل وضعها، كما يفعل الاستيراد في المحرر نفسه، ويجعل الاستدعاء يُرجع كائن Promise. ومن دونه تُوضع الجداول في صفوف على الفور، راجع [setSchemaSQL](./erd-editor-element.md#setschemasql) و[setSchemaJSON](./erd-editor-element.md#setschemajson).

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

خصّص فرعًا لكل قيمة `type` تعالجها، وتجاهل البقية.
يمسح استدعاء `setSchemaJSON()` بوضع الاستبدال، مثل إسناد `value`، المستندَ قبل أن يحلل المحتوى، لذا فإن توجيه حمولة ليست مستند `.erd.json` إليه — عبر `else` شامل، أو لأن قيمة `type` أُضيفت لاحقًا فوصلت إليه دون معالجة — يُفرغ المخطط بدلًا من استيراد أي شيء.

يكون `fileName` الذي يُنشئه المحرر على الشكل `<database name>-<timestamp>` مضافًا إليه امتداد الملف، حيث الطابع الزمني هو الوقت المحلي بالتنسيق `yyyy-MM-dd'T'HH_mm_ss`. وإذا كان اسم قاعدة البيانات فارغًا يُستخدم `unnamed` بدلًا منه. ويذكر ملف CSV الخاص بالقاموس اسم ورقته قبل الامتداد، كما في `<database name>-<timestamp>-words.csv`.
تتلقى دالة رد نداء التصدير هذه الملفات. منذ الإصدار `4.0.0`، أصبحت صورة SVG وملفات منشئ التعليمات البرمجية من بينها، ويأتي ملف `.sql` من الزر `Save file` في علامة تبويب مخطط SQL بدلًا من أن يأتي مباشرةً من `Export`. ومنذ الإصدار `4.2.0` أصبح ملف CSV من علامة تبويب القاموس من بينها أيضًا. ولا تستدعي [toImage()](./to-image.md) أيًّا من دالتَي رد النداء: فهي تسلّمك صورتها.

| الملف | الامتداد | قيمة `type` في Blob |
| --- | --- | --- |
| تصدير JSON | `.erd.json` | `application/json` |
| ما يحفظه الزر `Save file` في علامة تبويب مخطط SQL، وهو يحتوي على النص الذي تعرضه علامة التبويب، راجع [مخطط SQL](../guide/guides/schema-sql.md) | `.sql` | لا يوجد |
| مربع حوار [تصدير الصورة](../guide/guides/file-import-export.md#image) | `.png` أو `.svg` | `image/png` أو `image/svg+xml` |
| ما يحفظه الزر `Save file` في علامة تبويب منشئ التعليمات البرمجية، راجع [منشئ التعليمات البرمجية](../guide/guides/code-generator.md) | امتداد اللغة: `.cs`، `.go`، `.java`، `.kt`، `.php`، `.rs`، `.scala`، `.swift`، `.ts`، `.py`، `.aml`، `.dbml`، `.graphql`، `.json` أو `.mmd` | لا يوجد |
| ما يحفظه الأمر `Export CSV` في علامة تبويب القاموس، وهو يحتوي على كل صفوف الورقة المعروضة، أيًّا كان ما يعرضه بحثها، راجع [استيراد ملفات CSV وتصديرها](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

يحتاج المضيف الذي يختار المعالج حسب الامتداد إلى معالج لكل منها.

إذا لم تُعيَّن الدالتان، يستخدم المحرر سلوك التنزيل ومنتقي الملفات الخاص بالمتصفح. مرّر `null` للعودة إليه.

## دعم المتصفحات {#browser-support}

Chrome 91+ وEdge 94+ وFirefox 93+ وSafari 16.4+ — وهو خط الأساس ES2022 الذي تستهدفه الحزم المجمّعة المنشورة.
لا تُضمَّن أي polyfills في الحزمة. أضف ما يلزمك منها إذا كنت تحتاج إلى دعم متصفحات أقدم.

## الترقية من الإصدار 4.x {#upgrading-from-4x}

الإصدار `5.0.0` إصدار رئيسي. تحقق من كل نقطة مما يلي عند نقل صفحة من الإصدار 4.x:

- لم يعد `import '@dineug/erd-editor'` يعرّف `<erd-editor>`. استورد `@dineug/erd-editor/erd-editor.js` لأثره بدلًا من ذلك، أو استدع `defineErdEditor()`، وأبقِ استيراداتك المسمّاة من الجذر كما هي. ولا ينبّه TypeScript إلى الصفحة التي بقيت على الاستيراد المجرد، لأن تصريحات الجذر لا تزال تسمّي الوسم في `HTMLElementTagNameMap`، لكن العنصر الذي ينشئه عندئذ `HTMLElement` عادي، فيطلق أول استدعاء لإحدى دوالّه `TypeError`، راجع [تسجيل العناصر](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- على CDN ينطبق الأمر نفسه على `https://esm.run/@dineug/erd-editor`، الذي يقدّم الآن الجذر ولا يعرّف شيئًا: استورد `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. وعنوانا jsDelivr وunpkg المجردان لا يزالان يقدّمان نسخة الوسم script، التي تعرّف `<erd-editor>` كما كانت. ويقدّم العنوان غير المحدد بإصدار الآن أحدث إصدار من 5.x؛ حدّد `@4.2.0` للبقاء على الإصدار 4.x، راجع [CDN](#cdn) و[الوسم script](#script-tag).
- لا يعرّف الجذر شيئًا لكنه لا يزال يحتاج إلى DOM، لذا يبقى الاستيراد المسمّى منه، مثل `setExportFileCallback`، في العرض من جانب الخادم على المسار الخاص بجانب العميل إلى جوار نقطة دخول العنصر، راجع [العرض من جانب الخادم](#server-side-rendering).
- يكتسب `window.ErdEditor` العنصرين `ErdEditorElement` و`defineErdEditor`. وتضع نسخة الوسم script للعارض `ErdViewerElement` و`defineErdViewer` على `window.ErdViewer`، ولا يحمل أيٌّ من المتغيرين العامين `toImage`.
- يُفتح المحرر `readonly` قارئًا. تبقى علامات تبويبه الست والمستكشف والبحث السريع والحضور، ويُحذف كل عنصر تحكم كان سيعدّل المخطط بدلًا من تعطيله: يعرض شريط الأدوات اسم قاعدة البيانات نصًا، وتعرض علامة تبويب الإعدادات إعداداتها وكل عنصر تحكم فيها معطّل تحت الشارة `Read only`، ويحتفظ شريط الأدوات العائم بالتكبير وعرض الأسماء ووضع الزن والبوصلة فقط، فتزول `Hand` و`Select` ويحرّك السحب العرض. ولا يحدد الضغط شيئًا: التحديد الوحيد هو الإطار الذي يضعه الانتقال من المستكشف أو البحث السريع حول ما يصل إليه، وتمحوه نقرة ثابتة، ولا يحدد اختصارا تحديد الكل شيئًا. ويُنهي تفعيل `readonly` ما كان مفتوحًا، مثل التحديد وأداة اليد ومحرر الخلية والسحب و`Map Columns` ومعاينة `Force` في التخطيط التلقائي والسفر عبر الزمن، ويُبقي التمرير والتكبير وعلامة التبويب وعرض الأسماء، راجع [readonly](./erd-editor-element.md#readonly).
- تبقى الإعدادات التي يغيّرها قارئ `readonly` على شاشة ذلك المحرر أيًّا كانت أقفالها: التمرير والتكبير وعلامة التبويب وعرض الأسماء وView Option وقاعدة البيانات ولغة منشئ التعليمات البرمجية وأنماط التسمية ونوع علامات الاقتباس. ويحتفظ `value` و`runtimeValue` وتصدير JSON بإعدادات المستند نفسه، وهي التي كانت تغييرات القارئ في 4.x قد تصل إليها، ولا يرسل `getSharedStore()` شيئًا منها إلى المحررات الأخرى. وتكتب `getSchemaSQL()` دون نظام قاعدة بيانات القاعدة التي اختارها القارئ. ويعيد إيقاف `readonly` قاعدة البيانات وإعدادات الشيفرة وView Option إلى قيم المستند، ويترك التمرير والتكبير وعلامة التبويب وعرض الأسماء حيث تركها القارئ.
- زال الصف `Recalculation table width` من علامة تبويب الإعدادات. ولا يزال التحميل واللصق يلائمان عرض كل جدول مع نصه.
- في Vite 8 احذف `exclude: ['@dineug/erd-editor']` من `optimizeDeps`، فهذا لا تحتاج إليه إلا Vite 7 وما قبلها، وأبقِ `include` الخاص بـ ELK، راجع [Vite](#vite).

## الترقية من الإصدار 3.x {#upgrading-from-3x}

الإصدار `4.0.0` إصدار رئيسي. تحقق من كل نقطة مما يلي عند نقل صفحة من الإصدار 3.x، ثم من نقاط [الترقية من الإصدار 4.x](#upgrading-from-4x) للإصدار `5.0.0`:

- تمثل `editor.value` و`value` الخاصة بالنسخة المتماثلة و`value` التي يسلّمها حدثها `change` صيغة التخزين التي يحفظها الملف: بلا كيانات مُزالة ولا عروض مقيسة ولا ترتيب تراص ولا نقاط ارتكاز للعلاقات. واصل حفظ `value`، واقرأ تلك المعلومات من `runtimeValue`؛ أما الطوابع الزمنية للكيانات (`meta`) فقد أُزيلت كليًا. هيّئ المتعاون أو النسخة المتماثلة التي تنضم إلى جلسة جارية من `runtimeValue` لدى نظير يعمل، لا من `value` ولا من الملف، ولا تحفظ `runtimeValue` أبدًا، راجع [value](./erd-editor-element.md#value) و[runtimeValue](./erd-editor-element.md#runtimevalue).
- تحل أقفال الإعدادات محل `Save Scroll Information` و`Save Zoom Information`. في المستند الجديد، وفي أي مستند حُفظ قبل الإصدار `4.0.0`، تكون كل الأقفال مفعّلة، لذا فإن التمرير أو تغيير مستوى التكبير أو التبديل بين علامات التبويب أو تغيير لغة منشئ التعليمات البرمجية أو نمط تسمية أو نوع علامات الاقتباس يُبقي القيمة `value` كما هي ولا يُطلِق الحدث `change`. والصفحة التي كانت تحتفظ بالعرض عبر `change` تحتاج إلى إلغاء قفل `Viewport` (و`Canvas Type` لعلامة التبويب) في علامة تبويب الإعدادات، أو إلى مستند يترك فيه `settings.lockSettings` تلك البتات غير مضبوطة، راجع [القفل](../guide/guides/settings.md#lock).
- لم يعد الكائن `settings` يحتوي على `width` أو `height` أو `scrollTop` أو `scrollLeft` أو `relationshipOptimization` أو `ignoreSaveSettings`، وأُزيلت الثوابت `SaveSettingType`. يحل `settings.lockSettings`، مع بتات `LockSettingType`، محل `ignoreSaveSettings`، الذي لا يقرؤه الإصدار `4.0.0` أو أحدث ولا يكتبه، راجع [Settings](./advanced/schema.md#settings).
- أصبح [JSON Schema](./advanced/schema.md#json-schema) الذي يذكره كل ملف في `$schema` يصف صيغة التخزين وحدها، وهو مغلق: فهو يرفض الملف الذي حفظه إصدار سابق إلى أن يُعاد حفظه بالإصدار `4.0.0` أو أحدث فتُعاد كتابته.
- أُزيل جمع البيانات المهملة للمستند مع عامله، لذا يبقى الكيان المُزال في `runtimeValue` حتى يُفتح المستند من ملفه في المرة التالية. ويبقى ثلاثة عمّال SharedWorker، راجع [Web Workers](#web-workers).
- أبقِ كل محرر وكل نسخة متماثلة في الجلسة المشتركة على الإصدار `4.0.0` أو أحدث. فالإصدار الأقدم يتجاهل أنواع الإجراءات الجديدة: إجراءات مجموعات الجداول وتعيين الأعمدة والأقفال وسكربتات مخطط SQL، راجع [الجمع بين إصدارات مختلفة](./advanced/collaborative-editing.md#mixing-releases).
- تتلقى دالة رد نداء الاستيراد `mode: 'append'` عند استخدام استيراد وإضافة، وعلى دالة رد النداء أن تمرّره. وتتلقى دالة رد نداء التصدير الآن أيضًا ملفات `.svg` وملفات منشئ التعليمات البرمجية، ويفتح `Export` ▸ `Schema SQL` علامة تبويب مخطط SQL بدلًا من الحفظ، لذا لا يصل ملف `.sql` إلا من الزر `Save file` في علامة التبويب تلك، راجع [مربعات حوار الملفات](#file-dialogs).
- يرتبط المفتاحان `Delete` و`Backspace` بالأمر الجديد `removeSelection`. وما دام التركيز في المحرر خارج حقل نصي، يُمنع السلوك الافتراضي للمفتاح في كل علامات التبويب، ويُزال التحديد في علامة تبويب ERD. ويُضاف الأمر إلى `KeyBindingName` و`KeyBindingMap`، ويترك `setKeyBindingMap({ removeSelection: [] })` كلا المفتاحين للصفحة، راجع [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- تقبل `ThemeOptions.appearance` أيضًا القيمة `'system'`، وهي `System` في منشئ النسق، والتي يضبطها تفعيل `systemDarkMode`. ويُبلغ الحدث `changePresetTheme` عن `'system'` ما دامت محددة، لذا خزّنها كما هي وأعدها إلى `setPresetTheme`. ومع تفعيل `systemDarkMode`، يبقى الآن استدعاء `setPresetTheme()` بالقيمة `'light'` أو `'dark'` بدلًا من أن يُستبدل عند التغيير التالي في نظام التشغيل، راجع [systemDarkMode](./erd-editor-element.md#systemdarkmode) و[changePresetTheme](./erd-editor-element.md#changepresettheme).
- يستخدم `@dineug/erd-editor-mcp` بالإصدار `1.0.0` أو أحدث وإضافة VS Code بالإصدار `4.0.0` أو أحدث ومكوّنا Obsidian وJetBrains الإضافيان بالإصدار `1.0.0` أو أحدث بروتوكول المحور 2. والخادم بالإصدار `1.0.0` أو أحدث مع إصدار أقدم من المحرر يخدم الوكلاء، أو خادم أقدم مع أحد هذه المحررات، يرفض كلٌّ منهما الآخر بالرمز `protocolMismatch`، مع تسمية الطرف الذي يلزم تحديثه، راجع [التحديث](../mcp/installation.md#updating).
- يقدّم عنوان CDN غير المحدد بإصدار أحدث إصدار، وهو 5.x منذ الإصدار `5.0.0`. حدّد `@3.10.0` للبقاء على الإصدار 3.x، راجع [CDN](#cdn).
