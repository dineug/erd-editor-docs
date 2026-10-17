---
sidebar_position: 1
description: نصب @dineug/erd-editor از npm یا یک CDN، قرار دادن عنصر سفارشی در صفحه، اتصال کادرهای گفت‌وگوی فایل و ارتقا از 3.x.
---

# نصب

```sh
npm install @dineug/erd-editor
```

این بسته فقط ESM است (`"type": "module"`) و تنها پوشهٔ `dist` خود را منتشر می‌کند.
بیلد CommonJS وجود ندارد، بنابراین `require('@dineug/erd-editor')` کار نمی‌کند.

وابستگی‌های زمان اجرای آن خارجی می‌مانند، به‌صورت دستورهای import بدون مسیر که باندلر شما آن‌ها را مسیریابی می‌کند، نسخه‌های تکراری‌شان را یکی می‌کند و روی آن‌ها tree-shaking انجام می‌دهد.
هر Shared Worker آن به‌صورت یک فایل ورودی جداگانه در `dist/workers/` تولید می‌شود و با `new URL('./…', import.meta.url)` ساخته می‌شود، یعنی همان نگارشی که Vite، webpack 5 و Rspack آن را به‌عنوان نقطهٔ ورود ورکر باندل می‌کنند. [Web Worker](#web-workers) را ببینید.
برای صفحه‌ای که باندلری پشت آن نیست، بیلد دوم و خودبسنده‌ای وجود دارد؛ [تگ script](#script-tag) را ببینید.

## نحوهٔ استفاده {#usage}

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

`<erd-editor>` اندازهٔ ذاتی ندارد. به آن (یا به عنصر دربرگیرنده‌اش) عرض و ارتفاع صریح بدهید.
از نسخهٔ `4.1.0`، [کاوشگر](../guide/guides/explorer.md) وقتی باز است، درون عنصر در سمت چپ بوم ERD جای می‌گیرد و به‌جای پوشاندن بوم، آن را باریک‌تر می‌کند. ویرایشگر جدید با کاوشگر بسته شروع می‌شود.
این پنل باریک‌تر از `200px` رسم نمی‌شود و دست‌کم `320px` را برای بوم باقی می‌گذارد، بنابراین در عنصری باریک‌تر از `520px`، کاوشگر باز تا زمانی که عنصر پهن‌تر شود رسم نمی‌شود؛ [در کنار بوم](../guide/guides/explorer.md#beside-the-canvas) را ببینید.

`setInitialValue('')` یک سند جدید و خالی را آغاز می‌کند. در مقابل، مقداردهی خاصیت `value` سند را به‌صورت یک ویرایش بارگذاری می‌کند، بنابراین در تاریخچهٔ واگرد ثبت می‌شود.
از نسخهٔ `4.0.0`، `editor.value` سند به همان شکلی است که فایل نگه می‌دارد و همان چیزی است که باید ذخیره شود. `editor.runtimeValue` سند به همان شکلی است که ویرایشگر نگه می‌دارد، همراه با موجودیت‌های حذف‌شده: برای مقداردهی اولیهٔ یک همکار به کار می‌رود و هرگز به فایل نمی‌رود؛ [runtimeValue](./erd-editor-element.md#runtimevalue) را ببینید.
از نسخهٔ `4.0.0`، همهٔ [قفل‌های تنظیمات](../guide/guides/settings.md#lock) در سند جدید نیز روشن‌اند: ناحیهٔ دید، زبانه، زبان مولد کد، هر دو شیوهٔ نگارش نام و نوع علامت نقل‌قول. پیمایش، بزرگ‌نمایی، جابه‌جایی بین زبانه‌ها یا تغییر یکی از این تنظیمات، `editor.value` را همان‌طور که بود باقی می‌گذارد و هیچ رویداد `change` ارسال نمی‌کند. سندی که از متن بارگذاری می‌شود، قفل‌هایی را که در آن نام برده شده‌اند نگه می‌دارد. سندی که هیچ قفلی را نام نبرد، مانند هر فایلی که پیش از نسخهٔ `4.0.0` ذخیره شده است، صرف‌نظر از نما و زبانه‌ای که ذخیره کرده، با همهٔ قفل‌ها در حالت روشن، با بزرگ‌نمایی 100% و در زبانهٔ ERD باز می‌شود. نمای آن در مبدأ `0, 0` قفل می‌شود و اگر هیچ بخشی از نمودار در آنجا رسم نشده باشد، در عوض روی نمودار باز می‌شود؛ [setInitialValue](./erd-editor-element.md#setinitialvalue) را ببینید.
برای بقیهٔ API، [ErdEditorElement](./erd-editor-element.md) را ببینید.

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

`esm.run` وابستگی‌های خارجی بسته را برای شما مسیریابی می‌کند، بنابراین این روش بدون باندلر کار می‌کند.
نشانی بدون نسخه همیشه آخرین نسخه را ارائه می‌دهد. اگر نمی‌خواهید یک ارتقای نسخهٔ اصلی بدون اطلاع قبلی به صفحهٔ شما برسد، نسخه را ثابت کنید — `https://esm.run/@dineug/erd-editor@4.1.0`.
خود `4.0.0` نیز یک ارتقای نسخهٔ اصلی است: صفحه‌ای که باید روی 3.x بماند، `@3.10.0` را ثابت می‌کند؛ [ارتقا از 3.x](#upgrading-from-3x) را ببینید.

### تگ script {#script-tag}

از نسخهٔ `3.6.0`، بسته یک بیلد UMD نیز عرضه می‌کند که هر وابستگی و هر Shared Worker را درون یک فایل جای داده است.
فیلدهای `unpkg` و `jsdelivr` به همین بیلد اشاره می‌کنند، بنابراین نشانی بسته بدون مسیر در هر یک از این دو CDN همین بیلد را ارائه می‌دهد و این بیلد `window.ErdEditor` را تعریف می‌کند.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

وارد کردن آن `<erd-editor>` را به همان شیوه ثبت می‌کند؛ `window.ErdEditor` دو تابع callback فایل، یعنی `ErdEditor.setExportFileCallback` و `ErdEditor.setImportFileCallback`، و از نسخهٔ `3.9.2`، `ErdEditor.createKeyBindingMap` را در خود دارد.
نگاشت exports همچنان باندلر را به ماژول‌های ES هدایت می‌کند، بنابراین نصب از npm هرگز از این فایل استفاده نمی‌کند.

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

از نسخهٔ `4.0.0`، صفت `enable-locale-picker` انتخابگر `Display Language` را به نوار ابزار اضافه می‌کند و صفت `enable-welcome-screen` صفحهٔ خوش‌آمدی را اضافه می‌کند که در نمودار خالی نمایش داده می‌شود؛ [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) و [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen) را ببینید.
صفحه‌ای که یک سند را بارگذاری می‌کند، همان‌طور که در [نحوهٔ استفاده](#usage) انجام می‌شود، خاصیت `enableWelcomeScreen` را نه در نشانه‌گذاری، بلکه پس از آنکه `setInitialValue()` سند را بارگذاری کرد روشن می‌کند، بنابراین صفحهٔ خوش‌آمد هرگز برای لحظه‌ای روی فایلی که هنوز در حال بارگذاری است ظاهر نمی‌شود.
همهٔ 25 زبان نمایش درون بسته عرضه می‌شوند، چه در بیلد ES و چه در بیلد تگ script، بنابراین نه فایل زبانی برای ارائه هست و نه چیزی برای ثبت. بدون انتخابگر و بدون فراخوانی `setLocale()`، ویرایشگر به انگلیسی نمایش داده می‌شود.

افزودن صفت `readonly` در اینجا جلوی ویرایش را می‌گیرد: مقداردهی خاصیت `value`، فراخوانی `clear()` و هر فراخوانی `setSchema*()` — از جمله `setSchemaJSON()` و فراخوانی با حالت افزودن — نادیده گرفته می‌شوند و رویداد `change` هرگز ارسال نمی‌شود. خواندن `editor.value` و `editor.runtimeValue` همچنان کار می‌کند. در عوض با `setInitialValue()` بارگذاری کنید.

### رندر سمت سرور {#server-side-rendering}

وارد کردن بسته، عنصر سفارشی را در سطح ماژول ثبت می‌کند، بنابراین به DOM نیاز دارد و در Node خطا می‌دهد.
در Next.js، Nuxt، SvelteKit یا Astro، از مسیری که فقط در سمت کلاینت اجرا می‌شود به آن دسترسی پیدا کنید.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

وارد کردن بسته، `erd-editor` را در `HTMLElementTagNameMap` ادغام می‌کند، بنابراین عنصر بدون cast نوع‌دار است.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` برای مشخص کردن نوع متغیرها و props خودتان صادر می‌شود.
از نسخهٔ `4.0.0`، بسته نوع‌های `LocaleCode`، `LocaleOption` و `SchemaSQLOptions` را نیز صادر می‌کند؛ [نقاط ورود](#entry-points) را ببینید. گزینه‌هایی که متدهای `setSchema*()` می‌گیرند با نامی صادر نمی‌شوند؛ آن‌ها را از خود عنصر بخوانید، مانند `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## برجسته‌سازی نحو {#syntax-highlighting}

پنل‌های طرح‌واره SQL و مولد کد با [Shiki](https://shiki.style)، در یک Shared Worker مخصوص خودش، برجسته‌سازی می‌شوند و از نسخهٔ `4.0.0`، اسکریپت‌های `Before tables` و `After tables` زبانهٔ طرح‌واره SQL نیز برجسته‌سازی می‌شوند.
از نسخهٔ `3.7.0`، نه چیزی برای نصب هست و نه چیزی برای ثبت: ورکر در نخستین باری که یک پنل کد رندر می‌شود ساخته می‌شود، بنابراین صفحه‌ای که هیچ پنل کدی را باز نکند، هرگز گرامرها را دریافت نمی‌کند.

| | |
| --- | --- |
| زبان‌ها | SQL، TypeScript، GraphQL، C#، Java، Kotlin، Scala، Go، Python، PHP، Rust، Swift، JSON، Mermaid |
| طرح‌های زمینه | `github-dark` و `github-light`، مطابق با ظاهر روشن یا تیرهٔ ویرایشگر |

این‌ها دقیقاً همان زبان‌هایی هستند که پنل‌ها تولید می‌کنند: `JPA` به‌عنوان Java برجسته‌سازی می‌شود، `SQLAlchemy` به‌عنوان Python، `TypeORM`، `Sequelize`، `Drizzle` و `Zod` به‌عنوان TypeScript، `Doctrine` به‌عنوان PHP، `SeaORM` به‌عنوان Rust، `JSON Schema` به‌عنوان JSON و `DBML` و `AML` به‌عنوان SQL، یعنی نزدیک‌ترین گرامر موجود در بسته؛ [مولد کد](../guide/guides/code-generator.md) را ببینید.

موتور عبارت باقاعده با JavaScript خالص نوشته شده است، بنابراین هیچ سیاستی در میزبان به `wasm-unsafe-eval` نیاز ندارد.
جایی که `SharedWorker` در دسترس نیست — Chrome در Android، Safari پیش از 16.4 — خطا ثبت می‌شود و کد به‌صورت متن ساده نمایش داده می‌شود؛ اسکریپت‌ها همچنان قابل ویرایش‌اند.

ارتقا از نسخهٔ `3.6.0` یا پیش از آن: `@dineug/erd-editor-shiki-worker` دیگر منتشر نمی‌شود و `setGetShikiServiceCallback` نیز همراه با آن حذف شده است.
نصب و ثبت را حذف کنید؛ صفحه‌ای که ورکر را از یک CDN بارگذاری می‌کرد، آن تگ `<script>` دوم را نیز حذف می‌کند.

## Web Worker {#web-workers}

ویرایشگر سه کار را در ورکرهای `SharedWorker` اجرا می‌کند: برجسته‌سازی نحو، صادر کردن تصویر و چیدمان جدول‌ها که پشتوانهٔ [چیدمان خودکار](../guide/guides/table-related-functions.md#auto-layout)، [حالت جریان](../guide/guides/visualization.md#how-flow-is-placed) در زبانهٔ مصورسازی و از نسخهٔ `4.0.0`، چیدمان طرح‌وارهٔ واردشده است.
هر سه درون `@dineug/erd-editor` عرضه می‌شوند. هیچ‌کدام نیازی به راه‌اندازی از سوی شما ندارد، اما میزبان می‌تواند هر کدام را مسدود کند.
ورکری که جمع‌آوری زبالهٔ سند را اجرا می‌کرد، در نسخهٔ `4.0.0` همراه با خود جمع‌آوری زباله حذف شد.

| ورکر | بدون آن |
| --- | --- |
| برجسته‌سازی نحو | پنل‌های طرح‌واره SQL و مولد کد و اسکریپت‌های طرح‌واره SQL به‌صورت متن ساده باقی می‌مانند |
| صادر کردن تصویر | PNG، SVG، `Copy to clipboard` و پیش‌نمایش کادر گفت‌وگوی `Export image` روی رشتهٔ اصلی رسم می‌شوند و این کار صفحه را در حین رسم مسدود می‌کند |
| چیدمان جدول‌ها | چیدمان‌های `Flow`، `Tree - vertical` و `Tree - horizontal` در چیدمان خودکار و حالت جریان در زبانهٔ مصورسازی با `Could not place tables` پایان می‌یابند؛ وارد کردنی که با چیدمان جریان چیده می‌شود — یک فایل SQL، GraphQL، DBML یا AML از `Import` یا `Import and Add`، یا یک فراخوانی `setSchema*()` با `placement: 'auto'` — جدول‌هایش را بدون هیچ پیامی در ردیف‌ها قرار می‌دهد؛ `Force` و حالت گراف تحت تأثیر قرار نمی‌گیرند، چون درون خود ویرایشگر اجرا می‌شوند |

صادر کردن تصویر ده ثانیه منتظر پاسخ ورکر خود می‌ماند و سپس روی رشتهٔ اصلی رسم می‌کند و برجسته‌سازی نحو به‌محض شکست ورکرش، کد را به‌صورت متن ساده باقی می‌گذارد، بنابراین مسدود کردن ورکرها از سوی میزبان به قیمت کارایی تمام می‌شود، نه کارکرد.
چیدمان جدول‌ها استثناست: موتوری که چیدمان را محاسبه می‌کند از خود ویرایشگر حجیم‌تر است و هرگز درون همان فرایند بارگذاری نمی‌شود، بنابراین در نخستین چیدمان سی ثانیه منتظر ورکر خود می‌ماند و پس از آنکه ورکر پاسخ داد، به هر چیدمان شصت ثانیه فرصت می‌دهد تا بازگردد.
اگر هر یک از این دو زمان انتظار به پایان برسد، چیدمان همان‌طور پایان می‌یابد که بدون ورکر پایان می‌یابد. چیدمان خودکار به‌محض شروع، `Placing tables` را نشان می‌دهد، در حالی که حالت جریان و وارد کردنی که با چیدمان جریان چیده می‌شود، آن را تنها زمانی نشان می‌دهند که یک چیدمان، با احتساب راه‌اندازی ورکرش، شش ثانیه طول کشیده باشد.

در بیلد باندل‌شده، هر سه به‌صورت فایل‌هایی در کنار بسته تولید می‌شوند، بنابراین یک CSP سخت‌گیرانه به `worker-src 'self'` نیاز دارد — به‌علاوهٔ `blob:` در جایی که باندلر شما یک ورکر را درون‌خطی می‌کند.
در بیلد [تگ script](#script-tag)، هر سه به‌صورت نشانی‌های `data:` درون فایل جای دارند، بنابراین آن صفحه در عوض به `worker-src data:` نیاز دارد.

## نقاط ورود {#entry-points}

وارد کردن `@dineug/erd-editor` به‌عنوان اثر جانبی، `<erd-editor>` را ثبت می‌کند. علاوه بر این، نوع عنصر، دو تابع تنظیم callback، از نسخهٔ `3.9.2` کلیدهای میان‌بر پیش‌فرض همراه با نوع‌هایشان و از نسخهٔ `4.0.0` نوع‌های زبان نمایش و نوع گزینه‌های `getSchemaSQL()` را صادر می‌کند.

| خروجی | توضیح |
| --- | --- |
| `ErdEditorElement` (نوع) | رابط عنصر؛ [ErdEditorElement](./erd-editor-element.md) را ببینید. |
| `setExportFileCallback(cb)` | دانلود مرورگر را جایگزین می‌کند، `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | انتخابگر فایل مرورگر را جایگزین می‌کند، `({ type, op, accept, mode }) => void`؛ `mode` از نسخهٔ `4.0.0`. |
| `createKeyBindingMap()` | در هر فراخوانی، کلیدهای میان‌بر پیش‌فرض را به‌صورت یک `KeyBindingMap` جدید برمی‌گرداند؛ [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) را ببینید. |
| `KeyBindingMap`، `KeyBindingName`، `ShortcutOption` (نوع‌ها) | یک نگاشت کلیدهای میان‌بر، اجتماع نام‌های فرمان آن و یک کلید میان‌بر. |
| `LocaleCode`، `LocaleOption` (نوع‌ها) | از نسخهٔ `4.0.0`. کدهای 25 زبان نمایش و همین کدها به‌علاوهٔ `'system'` که `setLocale()` می‌گیرد؛ [زبان نمایش](./erd-editor-element.md#display-language) را ببینید. |
| `SchemaSQLOptions` (نوع) | از نسخهٔ `4.0.0`. گزینه‌های `statements` و `header` که `getSchemaSQL()` می‌گیرد؛ [getSchemaSQL](./erd-editor-element.md#getschemasql) را ببینید. |

`@dineug/erd-editor/engine.js` نقطهٔ ورود دوم است. این نقطهٔ ورود مخزن سند را بدون DOM اجرا می‌کند، بنابراین در یک Web Worker کار می‌کند؛ [ذخیره‌سازی راه دور](./advanced/remote-storage.md) را ببینید.
این نقطهٔ ورود `createReplicationStore` و نوع `ReplicationStore` را صادر می‌کند. از نسخهٔ `3.10.0`، نوع `ReplicationChange` را نیز صادر می‌کند، یعنی `{ value: string; changed: boolean }`، که شنوندهٔ رویداد `change` یک رونوشت آن را دریافت می‌کند؛ [on@change](./advanced/remote-storage.md#onchange) را ببینید.
از نسخهٔ `4.0.0`، هر `ReplicationStore` یک خاصیت `runtimeValue` نیز دارد. خاصیت `value` آن و مقداری که رویداد `change` تحویل می‌دهد، مانند مقادیر عنصر، همان شکل ذخیره‌سازی‌اند که فایل نگه می‌دارد؛ [ReplicationStore](./advanced/remote-storage.md#replicationstore) را ببینید.

از نسخهٔ `3.9.1`، نقطهٔ ورود سومی نیز وجود دارد، `@dineug/erd-editor/peer.js`: همتای بدون رابط کاربری که [سرور MCP](../mcp/introduction.md) از طریق آن سند را ویرایش می‌کند. این نقطهٔ ورود برای همان سرور وجود دارد و این صفحه‌ها آن را مستند نمی‌کنند.

### کادرهای گفت‌وگوی فایل {#file-dialogs}

وارد کردن و صادر کردن از طریق توابع callback قابل تزریق انجام می‌شوند، بنابراین میزبانی که کادر گفت‌وگوی فایل مرورگر را ندارد — برای نمونه یک webview در IDE — می‌تواند کادر گفت‌وگوی خودش را فراهم کند.
این دو متقارن نیستند: صادر کردن فایل نهایی را به شما تحویل می‌دهد، در حالی که وارد کردن فقط یک فایل درخواست می‌کند و خودتان محتوا را به ویرایشگر بازمی‌گردانید.

`op` برابر `set` یا `diff` است — یک `diff` به `setDiffValue()` می‌رود، هر `type` که داشته باشد. در غیر این صورت `type` متد را انتخاب می‌کند و `accept` پسوندهای آن نوع را در بر دارد، آماده برای تحویل به کادر گفت‌وگوی فایل میزبان.
از نسخهٔ `4.0.0`، وقتی کاربر [وارد کردن و افزودن](../guide/guides/file-import-export.md#import-and-add) را انتخاب کرده باشد، `set` حامل `mode: 'append'` است و برای وارد کردن ساده هیچ `mode` ندارد. آن را منتقل کنید: اگر تابع callback آن را کنار بگذارد، نموداری را که کاربر خواسته بود به آن افزوده شود جایگزین می‌کند.

| `type` | `accept` | متد |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` جدول‌ها را پیش از قرار گرفتن، بر اساس رابطه‌هایشان می‌چیند، همان‌طور که وارد کردن در خود ویرایشگر انجام می‌دهد، و باعث می‌شود فراخوانی یک Promise برگرداند. بدون آن، جدول‌ها بی‌درنگ در ردیف‌ها قرار می‌گیرند؛ [setSchemaSQL](./erd-editor-element.md#setschemasql) و [setSchemaJSON](./erd-editor-element.md#setschemajson) را ببینید.

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

هر `type` را که پشتیبانی می‌کنید جداگانه بررسی کنید و بقیه را نادیده بگیرید.
`setSchemaJSON()` در حالت جایگزینی، مانند مقداردهی خاصیت `value`، سند را پیش از تجزیه پاک می‌کند، بنابراین فرستادن داده‌ای که سند `.erd.json` نیست به آنجا — از طریق یک `else` فراگیر، یا به این دلیل که یک `type` که بعدها اضافه شده به آن شاخه رسیده است — به‌جای وارد کردن چیزی، نمودار را خالی می‌کند.

مقدار `fileName` که ویرایشگر تولید می‌کند، `<database name>-<timestamp>` به‌علاوهٔ پسوند فایل است، که در آن مهر زمانی، زمان محلی با قالب `yyyy-MM-dd'T'HH_mm_ss` است. اگر نام پایگاه داده خالی باشد، `unnamed` به کار می‌رود.
تابع callback صادر کردن این فایل‌ها را دریافت می‌کند. از نسخهٔ `4.0.0`، SVG و فایل‌های مولد کد نیز در میان آن‌ها هستند و فایل `.sql` از `Save file` در زبانهٔ طرح‌واره SQL می‌آید، نه مستقیماً از `Export`.

| فایل | پسوند | `type` در Blob |
| --- | --- | --- |
| صادر کردن JSON | `.erd.json` | `application/json` |
| `Save file` در زبانهٔ طرح‌واره SQL، شامل متنی که این زبانه نشان می‌دهد؛ [طرح‌واره SQL](../guide/guides/schema-sql.md) را ببینید | `.sql` | ندارد |
| کادر گفت‌وگوی [صادر کردن تصویر](../guide/guides/file-import-export.md#image) | `.png` یا `.svg` | `image/png` یا `image/svg+xml` |
| `Save file` در زبانهٔ مولد کد؛ [مولد کد](../guide/guides/code-generator.md) را ببینید | پسوند زبان کد: `.cs`، `.go`، `.java`، `.kt`، `.php`، `.rs`، `.scala`، `.swift`، `.ts`، `.py`، `.aml`، `.dbml`، `.graphql`، `.json` یا `.mmd` | ندارد |

میزبانی که پردازشگر را بر اساس پسوند انتخاب می‌کند، برای هر یک از آن‌ها به یک پردازشگر نیاز دارد.

اگر این توابع callback تنظیم نشوند، ویرایشگر از رفتار دانلود و انتخابگر فایل خود مرورگر استفاده می‌کند. برای بازگشت به آن، `null` را ارسال کنید.

## پشتیبانی مرورگرها {#browser-support}

Chrome 91+، Edge 94+، Firefox 93+، Safari 16.4+ — خط پایهٔ ES2022 که باندل‌های منتشرشده بر اساس آن ساخته می‌شوند.
هیچ پلی‌فیلی در باندل گنجانده نشده است. اگر باید از مرورگرهای قدیمی‌تر پشتیبانی کنید، پلی‌فیل‌های خودتان را اضافه کنید.

## ارتقا از 3.x {#upgrading-from-3x}

`4.0.0` یک نسخهٔ اصلی است. هنگام انتقال یک صفحه از 3.x، هر یک از این موارد را بررسی کنید:

- `editor.value`، خاصیت `value` یک رونوشت و مقدار `value` که رویداد `change` آن تحویل می‌دهد، همان شکل ذخیره‌سازی‌اند که فایل نگه می‌دارد: بدون موجودیت‌های حذف‌شده، عرض‌های اندازه‌گیری‌شده، ترتیب لایه‌ها یا نقاط اتصال رابطه‌ها. همچنان `value` را ذخیره کنید و این موارد را از `runtimeValue` بخوانید؛ مهرهای زمانی موجودیت‌ها (`meta`) به‌کلی حذف شده‌اند. همکار یا رونوشتی را که به یک نشست در حال اجرا می‌پیوندد، از `runtimeValue` یک همتای در حال اجرا مقداردهی اولیه کنید، نه از `value` یا فایل، و هرگز `runtimeValue` را ذخیره نکنید؛ [value](./erd-editor-element.md#value) و [runtimeValue](./erd-editor-element.md#runtimevalue) را ببینید.
- قفل‌های تنظیمات جایگزین `Save Scroll Information` و `Save Zoom Information` شده‌اند. در سند جدید و در هر سندی که پیش از نسخهٔ `4.0.0` ذخیره شده است، همهٔ قفل‌ها روشن‌اند، بنابراین پیمایش، بزرگ‌نمایی، جابه‌جایی زبانه یا تغییر زبان مولد کد، یکی از شیوه‌های نگارش نام یا نوع علامت نقل‌قول، `value` را همان‌طور که بود باقی می‌گذارد و هیچ رویداد `change` ارسال نمی‌کند. صفحه‌ای که نما را از طریق `change` حفظ می‌کرد، به باز بودن قفل `Viewport` (و برای زبانه، `Canvas Type`) در زبانهٔ تنظیمات نیاز دارد، یا به سندی که `settings.lockSettings` آن این بیت‌ها را صفر بگذارد؛ [قفل](../guide/guides/settings.md#lock) را ببینید.
- `settings` دیگر `width`، `height`، `scrollTop`، `scrollLeft`، `relationshipOptimization` یا `ignoreSaveSettings` را ندارد و ثابت‌های `SaveSettingType` حذف شده‌اند. `settings.lockSettings` همراه با بیت‌های `LockSettingType` جای `ignoreSaveSettings` را می‌گیرد که نسخهٔ `4.0.0` یا بالاتر نه آن را می‌خواند و نه می‌نویسد؛ [Settings](./advanced/schema.md#settings) را ببینید.
- [JSON Schema](./advanced/schema.md#json-schema) که هر فایل در `$schema` نام می‌برد، اکنون فقط شکل ذخیره‌سازی را توصیف می‌کند و ساختاری بسته دارد: فایلی را که نسخه‌ای قدیمی‌تر ذخیره کرده است، رد می‌کند تا زمانی که ذخیره‌ای با نسخهٔ `4.0.0` یا بالاتر آن را بازنویسی کند.
- جمع‌آوری زبالهٔ سند همراه با ورکر آن حذف شده است، بنابراین موجودیت حذف‌شده تا دفعهٔ بعدی که سند از فایلش باز شود، در `runtimeValue` باقی می‌ماند. سه Shared Worker باقی مانده‌اند؛ [Web Worker](#web-workers) را ببینید.
- همهٔ ویرایشگرها و رونوشت‌های یک نشست مشترک را روی نسخهٔ `4.0.0` یا بالاتر نگه دارید. نسخه‌ای قدیمی‌تر انواع جدید کنش را نادیده می‌گیرد: کنش‌های گروه‌های جدول، نگاشت ستون‌ها، قفل‌ها و اسکریپت‌های طرح‌واره SQL؛ [ترکیب نسخه‌ها](./advanced/collaborative-editing.md#mixing-releases) را ببینید.
- تابع callback وارد کردن برای «وارد کردن و افزودن»، `mode: 'append'` را دریافت می‌کند که تابع callback باید آن را منتقل کند. تابع callback صادر کردن اکنون فایل‌های `.svg` و فایل‌های مولد کد را نیز دریافت می‌کند و `Export` ▸ `Schema SQL` به‌جای ذخیره کردن، زبانهٔ طرح‌واره SQL را باز می‌کند، بنابراین فایل `.sql` فقط از `Save file` همان زبانه می‌رسد؛ [کادرهای گفت‌وگوی فایل](#file-dialogs) را ببینید.
- کلیدهای `Delete` و `Backspace` به فرمان جدید `removeSelection` متصل شده‌اند. تا زمانی که ویرایشگر بیرون از یک فیلد متنی فوکوس دارد، در همهٔ زبانه‌ها از رفتار پیش‌فرض کلید جلوگیری می‌شود و در زبانهٔ ERD موارد انتخاب‌شده حذف می‌شوند. `KeyBindingName` و `KeyBindingMap` اکنون آن را در بر می‌گیرند و `setKeyBindingMap({ removeSelection: [] })` هر دو کلید را به صفحه وامی‌گذارد؛ [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) را ببینید.
- `ThemeOptions.appearance` مقدار `'system'` را نیز می‌پذیرد، یعنی گزینهٔ `System` در سازندهٔ طرح زمینه، که با روشن کردن `systemDarkMode` تنظیم می‌شود. رویداد `changePresetTheme` تا زمانی که این گزینه انتخاب شده است، `'system'` را گزارش می‌کند، بنابراین آن را همان‌طور که هست ذخیره کنید و به `setPresetTheme` بازگردانید. با روشن بودن `systemDarkMode`، فراخوانی `setPresetTheme()` با `'light'` یا `'dark'` اکنون باقی می‌ماند، به‌جای اینکه با تغییر بعدی در OS بازنویسی شود؛ [systemDarkMode](./erd-editor-element.md#systemdarkmode) و [changePresetTheme](./erd-editor-element.md#changepresettheme) را ببینید.
- `@dineug/erd-editor-mcp` نسخهٔ `1.0.0`، افزونهٔ VS Code نسخهٔ `4.0.0` یا بالاتر و پلاگین‌های Obsidian و JetBrains نسخهٔ `1.0.0` یا بالاتر از پروتکل هاب 2 استفاده می‌کنند. سرور نسخهٔ `1.0.0` و نسخه‌ای قدیمی‌تر از ویرایشگر که به عامل‌ها سرویس می‌دهد، یا سروری قدیمی‌تر و یکی از این ویرایشگرها، یکدیگر را با `protocolMismatch` رد می‌کنند و طرفی را که باید به‌روزرسانی شود نام می‌برند؛ [به‌روزرسانی](../mcp/installation.md#updating) را ببینید.
- نشانی CDN بدون نسخه اکنون آخرین نسخهٔ 4.x را ارائه می‌دهد. برای ماندن روی 3.x، `@3.10.0` را ثابت کنید؛ [CDN](#cdn) را ببینید.
