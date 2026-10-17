---
sidebar_position: 1
description: تثبيت @dineug/erd-editor من npm أو من CDN، وتركيب العنصر المخصص، وربط مربعات حوار الملفات، والترقية من الإصدار 3.x.
---

# التثبيت

```sh
npm install @dineug/erd-editor
```

الحزمة بصيغة ESM فقط (`"type": "module"`)، ولا تتضمن سوى المجلد `dist`.
لا توجد نسخة CommonJS، لذا لا يعمل `require('@dineug/erd-editor')`.

تبقى تبعيات وقت التشغيل للحزمة خارجية، على هيئة استيرادات مجردة تحلّها أداة التجميع لديك وتزيل تكرارها وتستبعد منها ما لا يُستخدم.
تُخرَج عمّال SharedWorker الخاصة بالحزمة كملفات دخول منفصلة ضمن `dist/workers/`، وتُنشأ باستخدام `new URL('./…', import.meta.url)`، وهي الصيغة التي يجمّعها Vite وwebpack 5 وRspack بوصفها نقطة دخول لعامل. راجع [Web Workers](#web-workers).
وللصفحة التي لا تعتمد على أداة تجميع توجد نسخة ثانية مكتفية بذاتها، راجع [الوسم script](#script-tag).

## الاستخدام {#usage}

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

ليس للعنصر `<erd-editor>` حجم ذاتي. حدّد له (أو لحاويته) عرضًا وارتفاعًا صريحين.
منذ الإصدار `4.1.0`، يرسو [المستكشف](../guide/guides/explorer.md) المفتوح داخل العنصر على يسار لوحة رسم ERD، ويضيّق لوحة الرسم بدلًا من أن يغطيها. ويبدأ المحرر الجديد والمستكشف مغلق.
لا تُرسم لوحة المستكشف بعرض يقل عن `200px`، وتترك للوحة الرسم `320px` على الأقل، لذا لا يُرسم المستكشف المفتوح في عنصر يقل عرضه عن `520px` حتى يتسع العنصر، راجع [بجوار لوحة الرسم](../guide/guides/explorer.md#beside-the-canvas).

تبدأ الدالة `setInitialValue('')` مستندًا جديدًا فارغًا. أما إسناد قيمة إلى `value` فيحمّل المستند بوصفه تعديلًا، فيُضاف إلى سجل التراجع.
منذ الإصدار `4.0.0`، تمثل الخاصية `editor.value` المستند بالصيغة التي يحفظها الملف، وهي ما ينبغي تخزينه. أما `editor.runtimeValue` فتمثل المستند كما يحتفظ به المحرر، بما في ذلك الكيانات المُزالة: فهي تهيّئ متعاونًا ولا تُكتب في ملف أبدًا، راجع [runtimeValue](./erd-editor-element.md#runtimevalue).
منذ الإصدار `4.0.0`، تكون جميع [أقفال الإعدادات](../guide/guides/settings.md#lock) مفعّلة أيضًا في المستند الجديد: إطار العرض وعلامة التبويب ولغة منشئ التعليمات البرمجية ونمطا التسمية كلاهما ونوع علامات الاقتباس. التمرير أو تغيير مستوى التكبير أو التبديل بين علامات التبويب أو تغيير أحد هذه الإعدادات يُبقي القيمة `editor.value` كما هي ولا يُطلِق الحدث `change`. يحتفظ المستند المحمَّل من نص بالأقفال التي يحددها. أما المستند الذي لا يحدد أيًّا منها، مثل أي ملف حُفظ قبل الإصدار `4.0.0`، فيُفتح وكل الأقفال مفعّلة، بمستوى تكبير 100% وفي علامة تبويب ERD، أيًّا كان العرض وعلامة التبويب المحفوظان فيه. ويُقفل عرضه عند نقطة الأصل `0, 0`، ويُفتح على المخطط بدلًا من ذلك إذا لم يُرسم أي جزء من المخطط هناك، راجع [setInitialValue](./erd-editor-element.md#setinitialvalue).
لمعرفة بقية واجهة برمجة التطبيقات، راجع [ErdEditorElement](./erd-editor-element.md).

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

يحلّ `esm.run` التبعيات الخارجية للحزمة نيابةً عنك، لذا يعمل هذا دون أداة تجميع.
يقدّم عنوان URL غير المحدد بإصدار أحدث إصدار دائمًا. حدّد إصدارًا بعينه — `https://esm.run/@dineug/erd-editor@4.1.0` — إذا كنت لا تريد أن تصل ترقية رئيسية إلى صفحتك دون سابق إنذار.
والإصدار `4.0.0` نفسه ترقية من هذا النوع: فالصفحة التي يجب أن تبقى على الإصدار 3.x تحدّد `@3.10.0` في العنوان، راجع [الترقية من الإصدار 3.x](#upgrading-from-3x).

### الوسم script {#script-tag}

منذ الإصدار `3.6.0`، تتضمن الحزمة أيضًا نسخة UMD تضم كل التبعيات وكل عمّال SharedWorker داخل ملف واحد.
وهي النسخة التي يشير إليها الحقلان `unpkg` و`jsdelivr`، لذا يقدّمها عنوان URL المجرد للحزمة على أيٍّ من خدمتي CDN، وهي تعرّف `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

يسجّل استيرادها العنصر `<erd-editor>` بالطريقة نفسها؛ ويحمل `window.ErdEditor` دالتَي رد النداء الخاصتين بالملفات، `ErdEditor.setExportFileCallback` و`ErdEditor.setImportFileCallback`، ويحمل منذ الإصدار `3.9.2` الدالة `ErdEditor.createKeyBindingMap`.
ولا تزال خريطة exports توجّه أداة التجميع إلى وحدات ES، لذا لا يلتقط التثبيت من npm هذا الملف أبدًا.

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

منذ الإصدار `4.0.0`، تضيف السمة `enable-locale-picker` المنتقي `Display Language` إلى شريط الأدوات، وتضيف السمة `enable-welcome-screen` شاشة الترحيب التي يعرضها المخطط الفارغ، راجع [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) و[enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
تفعّل الصفحة التي تحمّل مستندًا، كما في [الاستخدام](#usage)، الخاصية `enableWelcomeScreen` بعد أن تحمّله الدالة `setInitialValue()` وليس في الوسوم، حتى لا تومض الشاشة أبدًا فوق ملف لا يزال قيد التحميل.
تأتي لغات العرض كلها، وعددها 25 لغة، داخل الحزمة، في نسخة ES ونسخة الوسم script على حد سواء، لذا لا يوجد ملف لغة يلزم تقديمه ولا شيء يلزم تسجيله. ومن دون المنتقي ودون استدعاء `setLocale()`، يعرض المحرر اللغة الإنجليزية.

تؤدي إضافة السمة `readonly` هنا إلى منع التحرير: يُتجاهل إسناد `value` واستدعاء `clear()` وكل استدعاء للدوال `setSchema*()` — بما في ذلك `setSchemaJSON()` واستدعاءات الإلحاق — ولا يُطلَق الحدث `change` أبدًا. ولا تزال قراءة `editor.value` و`editor.runtimeValue` تعمل. حمّل المستند باستخدام `setInitialValue()` بدلًا من ذلك.

### العرض من جانب الخادم {#server-side-rendering}

يسجّل استيراد الحزمة العنصر المخصص على مستوى الوحدة، لذا يحتاج إلى DOM ويُطلِق استثناءً في Node.
في Next.js أو Nuxt أو SvelteKit أو Astro، استورد الحزمة من مسار لا يُنفَّذ إلا في جانب العميل.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

يدمج استيراد الحزمة `erd-editor` في `HTMLElementTagNameMap`، لذا يُعرف نوع العنصر دون تحويل صريح للنوع.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

يُصدَّر النوع `ErdEditorElement` لتحديد أنواع متغيراتك وخصائص مكوناتك.
منذ الإصدار `4.0.0`، تصدّر الحزمة أيضًا الأنواع `LocaleCode` و`LocaleOption` و`SchemaSQLOptions`، راجع [نقاط الدخول](#entry-points). أما الخيارات التي تقبلها الدوال `setSchema*()` فليس لها اسم مُصدَّر؛ استخرجها من العنصر، كما في `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## تمييز الصيغة {#syntax-highlighting}

يتولى [Shiki](https://shiki.style) تمييز الصيغة في لوحتَي مخطط SQL ومنشئ التعليمات البرمجية، داخل SharedWorker خاص به، ومنذ الإصدار `4.0.0` يتولى أيضًا تمييز السكربتين `Before tables` و`After tables` في علامة تبويب مخطط SQL.
منذ الإصدار `3.7.0`، لا يوجد ما يلزم تثبيته ولا ما يلزم تسجيله: يُنشأ العامل في أول مرة تُعرض فيها لوحة تعليمات برمجية، لذا لا تجلب الصفحة التي لا تفتح أي لوحة منها القواعد النحوية أبدًا.

| | |
| --- | --- |
| اللغات | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| الأنساق | `github-dark` و`github-light`، وفقًا لمظهر المحرر الفاتح أو الداكن |

هذه هي اللغات التي تُخرجها اللوحتان بالضبط: يُميَّز `JPA` بصيغة Java، و`SQLAlchemy` بصيغة Python، و`TypeORM` و`Sequelize` و`Drizzle` و`Zod` بصيغة TypeScript، و`Doctrine` بصيغة PHP، و`SeaORM` بصيغة Rust، و`JSON Schema` بصيغة JSON، و`DBML` و`AML` بصيغة SQL، وهي أقرب قاعدة نحوية في الحزمة، راجع [منشئ التعليمات البرمجية](../guide/guides/code-generator.md).

محرك التعبيرات العادية مكتوب بلغة JavaScript خالصة، لذا لا تحتاج أي سياسة لدى المضيف إلى `wasm-unsafe-eval`.
في البيئات التي لا يتوفر فيها `SharedWorker` — Chrome على Android، وSafari قبل الإصدار 16.4 — يُسجَّل الإخفاق وتظهر التعليمات البرمجية نصًا عاديًا؛ ولا يزال تحرير السكربتات ممكنًا.

عند الترقية من الإصدار `3.6.0` أو أقدم: لم تعد الحزمة `@dineug/erd-editor-shiki-worker` تُنشر، وأُزيلت معها الدالة `setGetShikiServiceCallback`.
أزل التثبيت والتسجيل؛ وعلى الصفحة التي كانت تحمّل العامل من CDN أن تزيل أيضًا ذلك الوسم `<script>` الثاني.

## Web Workers {#web-workers}

يشغّل المحرر ثلاث مهام في عمّال `SharedWorker`: تمييز الصيغة، وتصدير الصورة، وتخطيط الجداول الذي يقف وراء [التخطيط التلقائي](../guide/guides/table-related-functions.md#auto-layout) و[وضع التدفق](../guide/guides/visualization.md#how-flow-is-placed) في علامة تبويب التصور المرئي، ومنذ الإصدار `4.0.0` ترتيب المخطط المستورد.
تأتي العمّال الثلاثة كلها داخل `@dineug/erd-editor`. لا يحتاج أي منها إلى إعداد من جانبك، لكن يمكن للمضيف أن يحظر كلًّا منها.
أُزيل العامل الذي كان يشغّل جمع البيانات المهملة للمستند في الإصدار `4.0.0`، إلى جانب عملية الجمع نفسها.

| العامل | بدونه |
| --- | --- |
| تمييز الصيغة | تبقى لوحتا مخطط SQL ومنشئ التعليمات البرمجية وسكربتات مخطط SQL نصًا عاديًا |
| تصدير الصورة | تُرسم صورة PNG وصورة SVG وما ينسخه `Copy to clipboard` ومعاينة مربع الحوار `Export image` على الخيط الرئيسي، ما يوقف استجابة الصفحة أثناء الرسم |
| تخطيط الجداول | تنتهي تخطيطات `Flow` و`Tree - vertical` و`Tree - horizontal` في التخطيط التلقائي، ووضع التدفق في علامة تبويب التصور المرئي، بالرسالة `Could not place tables`؛ والاستيراد الذي يرتّبه التدفق — ملف SQL أو GraphQL أو DBML أو AML من `Import` أو `Import and Add`، أو استدعاء `setSchema*()` مع `placement: 'auto'` — يضع جداوله في صفوف، دون أي رسالة؛ ولا يتأثر `Force` ووضع الرسم البياني، لأنهما يعملان داخل المحرر |

ينتظر تصدير الصورة عشر ثوانٍ حتى يستجيب عامله ثم يرسم على الخيط الرئيسي، ويترك تمييز الصيغة التعليمات البرمجية نصًا عاديًا بمجرد إخفاق عامله، لذا فالمضيف الذي يحظر العمّال يخسر من الأداء لا من الوظائف.
يُستثنى تخطيط الجداول من ذلك: فالمحرك الذي يحسب التخطيط أكبر حجمًا من المحرر نفسه ولا يُحمَّل أبدًا داخل عملية الصفحة، لذا ينتظر 30 ثانية حتى يستجيب عامله عند أول ترتيب، وبعد أن يستجيب العامل يمنح التخطيط 60 ثانية ليعود بالنتيجة.
إذا نفدت أيٌّ من المهلتين، ينتهي الترتيب كما ينتهي في غياب العامل. يعرض التخطيط التلقائي الإشعار `Placing tables` فور بدئه، في حين لا يعرضه وضع التدفق والاستيراد الذي يرتّبه التدفق إلا بعد أن يستمر الترتيب، بما في ذلك بدء عامله، ست ثوانٍ.

في النسخة المجمّعة تُخرَج العمّال الثلاثة كلها في ملفات بجوار الحزمة، لذا تحتاج سياسة CSP الصارمة إلى `worker-src 'self'` — بالإضافة إلى `blob:` حيثما تُضمّن أداة التجميع لديك عاملًا مباشرةً في التعليمات البرمجية.
أما في نسخة [الوسم script](#script-tag) فتنتقل الثلاثة كلها داخل الملف على هيئة عناوين URL من نوع `data:`، لذا تحتاج تلك الصفحة إلى `worker-src data:` بدلًا من ذلك.

## نقاط الدخول {#entry-points}

يسجّل استيراد `@dineug/erd-editor` العنصر `<erd-editor>` كأثر جانبي. وفضلًا عن ذلك يصدّر نوع العنصر، ودالتين لتعيين دوال رد النداء، ومنذ الإصدار `3.9.2` اختصارات لوحة المفاتيح الافتراضية مع أنواعها، ومنذ الإصدار `4.0.0` أنواع لغة العرض ونوع خيارات الدالة `getSchemaSQL()`.

| ما يُصدَّر | الوصف |
| --- | --- |
| `ErdEditorElement` (نوع) | واجهة العنصر، راجع [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | تحل محل التنزيل في المتصفح، `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | تحل محل منتقي الملفات في المتصفح، `({ type, op, accept, mode }) => void`؛ ويتوفر الحقل `mode` منذ الإصدار `4.0.0`. |
| `createKeyBindingMap()` | تُرجع اختصارات لوحة المفاتيح الافتراضية في `KeyBindingMap` جديد عند كل استدعاء، راجع [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap` و`KeyBindingName` و`ShortcutOption` (أنواع) | خريطة اختصارات، ونوع اتحاد يضم أسماء أوامرها، واختصار واحد. |
| `LocaleCode` و`LocaleOption` (نوعان) | منذ الإصدار `4.0.0`. رموز لغات العرض البالغة 25 لغة، وهذه الرموز مضافًا إليها `'system'`، وهو ما تقبله الدالة `setLocale()`، راجع [لغة العرض](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (نوع) | منذ الإصدار `4.0.0`. الخياران `statements` و`header` اللذان تقبلهما الدالة `getSchemaSQL()`، راجع [getSchemaSQL](./erd-editor-element.md#getschemasql). |

تمثل `@dineug/erd-editor/engine.js` نقطة دخول ثانية. وهي تشغّل مخزن المستند دون DOM، لذا تعمل في Web Worker، راجع [التخزين البعيد](./advanced/remote-storage.md).
وهي تصدّر `createReplicationStore` والنوع `ReplicationStore`. ومنذ الإصدار `3.10.0` تصدّر أيضًا النوع `ReplicationChange`، `{ value: string; changed: boolean }`، الذي يتلقاه مستمع الحدث `change` في النسخة المتماثلة، راجع [on@change](./advanced/remote-storage.md#onchange).
منذ الإصدار `4.0.0`، يملك المخزن `ReplicationStore` أيضًا الخاصية `runtimeValue`. أما خاصيته `value` والقيمة التي يسلّمها الحدث `change` فهما بصيغة التخزين التي يحفظها الملف، مثل قيمة العنصر، راجع [ReplicationStore](./advanced/remote-storage.md#replicationstore).

منذ الإصدار `3.9.1`، توجد نقطة دخول ثالثة، `@dineug/erd-editor/peer.js`: النظير بدون واجهة الذي يحرّر [خادم MCP](../mcp/introduction.md) المستند من خلاله. وهي موجودة لأجل ذلك الخادم، ولا توثّقها هذه الصفحات.

### مربعات حوار الملفات {#file-dialogs}

يمر الاستيراد والتصدير عبر دوال رد نداء قابلة للحقن، لذا يمكن للمضيف الذي لا يملك مربع حوار ملفات المتصفح — عرض ويب داخل بيئة تطوير، على سبيل المثال — أن يوفر مربعه الخاص.
والاثنان غير متماثلين: فالتصدير يسلّمك الملف الجاهز، بينما يطلب الاستيراد ملفًا فحسب، وتعيد أنت المحتوى إلى المحرر بنفسك.

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

يكون `fileName` الذي يُنشئه المحرر على الشكل `<database name>-<timestamp>` مضافًا إليه امتداد الملف، حيث الطابع الزمني هو الوقت المحلي بالتنسيق `yyyy-MM-dd'T'HH_mm_ss`. وإذا كان اسم قاعدة البيانات فارغًا يُستخدم `unnamed` بدلًا منه.
تتلقى دالة رد نداء التصدير هذه الملفات. منذ الإصدار `4.0.0`، أصبحت صورة SVG وملفات منشئ التعليمات البرمجية من بينها، ويأتي ملف `.sql` من الزر `Save file` في علامة تبويب مخطط SQL بدلًا من أن يأتي مباشرةً من `Export`.

| الملف | الامتداد | قيمة `type` في Blob |
| --- | --- | --- |
| تصدير JSON | `.erd.json` | `application/json` |
| ما يحفظه الزر `Save file` في علامة تبويب مخطط SQL، وهو يحتوي على النص الذي تعرضه علامة التبويب، راجع [مخطط SQL](../guide/guides/schema-sql.md) | `.sql` | لا يوجد |
| مربع حوار [تصدير الصورة](../guide/guides/file-import-export.md#image) | `.png` أو `.svg` | `image/png` أو `image/svg+xml` |
| ما يحفظه الزر `Save file` في علامة تبويب منشئ التعليمات البرمجية، راجع [منشئ التعليمات البرمجية](../guide/guides/code-generator.md) | امتداد اللغة: `.cs`، `.go`، `.java`، `.kt`، `.php`، `.rs`، `.scala`، `.swift`، `.ts`، `.py`، `.aml`، `.dbml`، `.graphql`، `.json` أو `.mmd` | لا يوجد |

يحتاج المضيف الذي يختار المعالج حسب الامتداد إلى معالج لكل منها.

إذا لم تُعيَّن الدالتان، يستخدم المحرر سلوك التنزيل ومنتقي الملفات الخاص بالمتصفح. مرّر `null` للعودة إليه.

## دعم المتصفحات {#browser-support}

Chrome 91+ وEdge 94+ وFirefox 93+ وSafari 16.4+ — وهو خط الأساس ES2022 الذي تستهدفه الحزم المجمّعة المنشورة.
لا تُضمَّن أي polyfills في الحزمة. أضف ما يلزمك منها إذا كنت تحتاج إلى دعم متصفحات أقدم.

## الترقية من الإصدار 3.x {#upgrading-from-3x}

الإصدار `4.0.0` إصدار رئيسي. تحقق من كل نقطة مما يلي عند نقل صفحة من الإصدار 3.x:

- تمثل `editor.value` و`value` الخاصة بالنسخة المتماثلة و`value` التي يسلّمها حدثها `change` صيغة التخزين التي يحفظها الملف: بلا كيانات مُزالة ولا عروض مقيسة ولا ترتيب تراص ولا نقاط ارتكاز للعلاقات. واصل حفظ `value`، واقرأ تلك المعلومات من `runtimeValue`؛ أما الطوابع الزمنية للكيانات (`meta`) فقد أُزيلت كليًا. هيّئ المتعاون أو النسخة المتماثلة التي تنضم إلى جلسة جارية من `runtimeValue` لدى نظير يعمل، لا من `value` ولا من الملف، ولا تحفظ `runtimeValue` أبدًا، راجع [value](./erd-editor-element.md#value) و[runtimeValue](./erd-editor-element.md#runtimevalue).
- تحل أقفال الإعدادات محل `Save Scroll Information` و`Save Zoom Information`. في المستند الجديد، وفي أي مستند حُفظ قبل الإصدار `4.0.0`، تكون كل الأقفال مفعّلة، لذا فإن التمرير أو تغيير مستوى التكبير أو التبديل بين علامات التبويب أو تغيير لغة منشئ التعليمات البرمجية أو نمط تسمية أو نوع علامات الاقتباس يُبقي القيمة `value` كما هي ولا يُطلِق الحدث `change`. والصفحة التي كانت تحتفظ بالعرض عبر `change` تحتاج إلى إلغاء قفل `Viewport` (و`Canvas Type` لعلامة التبويب) في علامة تبويب الإعدادات، أو إلى مستند يترك فيه `settings.lockSettings` تلك البتات غير مضبوطة، راجع [القفل](../guide/guides/settings.md#lock).
- لم يعد الكائن `settings` يحتوي على `width` أو `height` أو `scrollTop` أو `scrollLeft` أو `relationshipOptimization` أو `ignoreSaveSettings`، وأُزيلت الثوابت `SaveSettingType`. يحل `settings.lockSettings`، مع بتات `LockSettingType`، محل `ignoreSaveSettings`، الذي لا يقرؤه الإصدار `4.0.0` أو أحدث ولا يكتبه، راجع [Settings](./advanced/schema.md#settings).
- أصبح [JSON Schema](./advanced/schema.md#json-schema) الذي يذكره كل ملف في `$schema` يصف صيغة التخزين وحدها، وهو مغلق: فهو يرفض الملف الذي حفظه إصدار سابق إلى أن يُعاد حفظه بالإصدار `4.0.0` أو أحدث فتُعاد كتابته.
- أُزيل جمع البيانات المهملة للمستند مع عامله، لذا يبقى الكيان المُزال في `runtimeValue` حتى يُفتح المستند من ملفه في المرة التالية. ويبقى ثلاثة عمّال SharedWorker، راجع [Web Workers](#web-workers).
- أبقِ كل محرر وكل نسخة متماثلة في الجلسة المشتركة على الإصدار `4.0.0` أو أحدث. فالإصدار الأقدم يتجاهل أنواع الإجراءات الجديدة: إجراءات مجموعات الجداول وتعيين الأعمدة والأقفال وسكربتات مخطط SQL، راجع [الجمع بين إصدارات مختلفة](./advanced/collaborative-editing.md#mixing-releases).
- تتلقى دالة رد نداء الاستيراد `mode: 'append'` عند استخدام استيراد وإضافة، وعلى دالة رد النداء أن تمرّره. وتتلقى دالة رد نداء التصدير الآن أيضًا ملفات `.svg` وملفات منشئ التعليمات البرمجية، ويفتح `Export` ▸ `Schema SQL` علامة تبويب مخطط SQL بدلًا من الحفظ، لذا لا يصل ملف `.sql` إلا من الزر `Save file` في علامة التبويب تلك، راجع [مربعات حوار الملفات](#file-dialogs).
- يرتبط المفتاحان `Delete` و`Backspace` بالأمر الجديد `removeSelection`. وما دام التركيز في المحرر خارج حقل نصي، يُمنع السلوك الافتراضي للمفتاح في كل علامات التبويب، ويُزال التحديد في علامة تبويب ERD. ويُضاف الأمر إلى `KeyBindingName` و`KeyBindingMap`، ويترك `setKeyBindingMap({ removeSelection: [] })` كلا المفتاحين للصفحة، راجع [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- تقبل `ThemeOptions.appearance` أيضًا القيمة `'system'`، وهي `System` في منشئ النسق، والتي يضبطها تفعيل `systemDarkMode`. ويُبلغ الحدث `changePresetTheme` عن `'system'` ما دامت محددة، لذا خزّنها كما هي وأعدها إلى `setPresetTheme`. ومع تفعيل `systemDarkMode`، يبقى الآن استدعاء `setPresetTheme()` بالقيمة `'light'` أو `'dark'` بدلًا من أن يُستبدل عند التغيير التالي في نظام التشغيل، راجع [systemDarkMode](./erd-editor-element.md#systemdarkmode) و[changePresetTheme](./erd-editor-element.md#changepresettheme).
- يستخدم `@dineug/erd-editor-mcp` `1.0.0` وإضافة VS Code بالإصدار `4.0.0` أو أحدث ومكوّنا Obsidian وJetBrains الإضافيان بالإصدار `1.0.0` أو أحدث بروتوكول المحور 2. والخادم `1.0.0` مع إصدار أقدم من المحرر يخدم الوكلاء، أو خادم أقدم مع أحد هذه المحررات، يرفض كلٌّ منهما الآخر بالرمز `protocolMismatch`، مع تسمية الطرف الذي يلزم تحديثه، راجع [التحديث](../mcp/installation.md#updating).
- يقدّم عنوان CDN غير المحدد بإصدار الآن أحدث إصدار من 4.x. حدّد `@3.10.0` للبقاء على الإصدار 3.x، راجع [CDN](#cdn).
