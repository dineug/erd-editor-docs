---
sidebar_position: 1
description: نصب @dineug/erd-editor از npm یا یک CDN، ثبت عنصرهای ویرایشگر و نمایشگر، اتصال کادرهای گفت‌وگوی فایل و ارتقا از 4.x یا 3.x.
---

# نصب

```sh
npm install @dineug/erd-editor
```

این بسته فقط ESM است (`"type": "module"`) و تنها پوشهٔ `dist` خود را منتشر می‌کند.
بیلد CommonJS وجود ندارد، بنابراین `require('@dineug/erd-editor')` کار نمی‌کند.

این بسته دو عنصر سفارشی دارد: `<erd-editor>`، یعنی ویرایشگر، و از نسخهٔ `5.0.0` `<erd-viewer>` که یک نمودار را فقط خواندنی نشان می‌دهد — [ErdViewerElement](./erd-viewer-element.md) را ببینید.
از نسخهٔ `5.0.0` وارد کردن ریشهٔ بسته هیچ‌کدام را تعریف نمی‌کند. هر عنصر نقطهٔ ورودی جداگانه‌ای دارد که آن را تعریف می‌کند — [ثبت عنصرها](#registering-the-elements) را ببینید.

وابستگی‌های زمان اجرای آن خارجی می‌مانند، به‌صورت دستورهای import بدون مسیر که باندلر شما آن‌ها را مسیریابی می‌کند، نسخه‌های تکراری‌شان را یکی می‌کند و روی آن‌ها tree-shaking انجام می‌دهد. از نسخهٔ `5.0.0` پوشهٔ `dist` آن برای هر ماژول یک فایل دارد، بنابراین باندلر فقط ماژول‌هایی را نگه می‌دارد که صفحه به آن‌ها می‌رسد — [نقاط ورود](#entry-points) را ببینید.
هر Shared Worker آن به‌صورت یک فایل ورودی جداگانه در `dist/workers/` تولید می‌شود و با `new URL('./…', import.meta.url)` ساخته می‌شود، یعنی همان نگارشی که Vite، webpack 5 و Rspack آن را به‌عنوان نقطهٔ ورود ورکر باندل می‌کنند. [Web Worker](#web-workers) را ببینید.
برای صفحه‌ای که باندلری پشت آن نیست، دو بیلد خودبسنده وجود دارد؛ [تگ script](#script-tag) را ببینید.

## نحوهٔ استفاده {#usage}

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

`@dineug/erd-editor/erd-editor.js` همان‌طور که وارد می‌شود `<erd-editor>` را تعریف می‌کند. صفحه‌ای که فقط یک نمودار را نشان می‌دهد به‌جای آن `@dineug/erd-editor/erd-viewer.js` را وارد می‌کند — [ErdViewerElement](./erd-viewer-element.md) را ببینید.

`<erd-editor>` اندازهٔ ذاتی ندارد. به آن (یا به عنصر دربرگیرنده‌اش) عرض و ارتفاع صریح بدهید.
از نسخهٔ `4.1.0`، [کاوشگر](../guide/guides/explorer.md) وقتی باز است، درون عنصر در سمت چپ بوم ERD جای می‌گیرد و به‌جای پوشاندن بوم، آن را باریک‌تر می‌کند. ویرایشگر جدید با کاوشگر بسته شروع می‌شود.
این پنل باریک‌تر از `200px` رسم نمی‌شود و دست‌کم `320px` را برای بوم باقی می‌گذارد، بنابراین در عنصری باریک‌تر از `520px`، کاوشگر باز تا زمانی که عنصر پهن‌تر شود رسم نمی‌شود؛ [در کنار بوم](../guide/guides/explorer.md#beside-the-canvas) را ببینید.

`setInitialValue('')` یک سند جدید و خالی را آغاز می‌کند. در مقابل، مقداردهی خاصیت `value` سند را به‌صورت یک ویرایش بارگذاری می‌کند، بنابراین در تاریخچهٔ واگرد ثبت می‌شود.
از نسخهٔ `4.0.0`، `editor.value` سند به همان شکلی است که فایل نگه می‌دارد و همان چیزی است که باید ذخیره شود. `editor.runtimeValue` سند به همان شکلی است که ویرایشگر نگه می‌دارد، همراه با موجودیت‌های حذف‌شده: برای مقداردهی اولیهٔ یک همکار به کار می‌رود و هرگز به فایل نمی‌رود؛ [runtimeValue](./erd-editor-element.md#runtimevalue) را ببینید.
از نسخهٔ `4.0.0`، همهٔ [قفل‌های تنظیمات](../guide/guides/settings.md#lock) در سند جدید نیز روشن‌اند: ناحیهٔ دید، زبانه، زبان مولد کد، هر دو شیوهٔ نگارش نام، نوع علامت نقل‌قول و از نسخهٔ `4.2.0`، [نمایش نام‌ها](../guide/guides/logical-names.md#name-view). پیمایش، بزرگ‌نمایی، جابه‌جایی بین زبانه‌ها، تغییر نمایش نام‌ها یا تغییر یکی از تنظیمات دیگر، `editor.value` را همان‌طور که بود باقی می‌گذارد و هیچ رویداد `change` ارسال نمی‌کند. سندی که از متن بارگذاری می‌شود، قفل‌هایی را که در آن نام برده شده‌اند نگه می‌دارد. سندی که هیچ قفلی را نام نبرد، مانند هر فایلی که پیش از نسخهٔ `4.0.0` ذخیره شده است، صرف‌نظر از ناحیهٔ دید و زبانه‌ای که ذخیره کرده، با همهٔ قفل‌ها در حالت روشن، با بزرگ‌نمایی 100% و در زبانهٔ ERD باز می‌شود. ناحیهٔ دید آن در مبدأ `0, 0` قفل می‌شود و اگر هیچ بخشی از نمودار در آنجا رسم نشده باشد، نما در عوض روی نمودار باز می‌شود؛ [setInitialValue](./erd-editor-element.md#setinitialvalue) را ببینید.
فایلی که پیش از نسخهٔ `4.2.0` ذخیره شده است، در حالی باز می‌شود که نمایش نام‌ها روی نمای `Physical Names` قفل است، حتی اگر همهٔ قفل‌های دیگر آن خاموش باشند. ویرایشگر نسخهٔ `4.0.0` یا `4.1.0` هنگام ذخیره، قفل نمایش نام‌ها را همان‌طور که هست نگه می‌دارد اما خود نما را کنار می‌گذارد، بنابراین فایلی از نسخهٔ `4.2.0` که نمایش نام‌ها در آن بدون قفل ذخیره شده است، بدون قفل می‌ماند اما دوباره روی نمای `Physical Names` باز می‌شود.
برای بقیهٔ API، [ErdEditorElement](./erd-editor-element.md) را ببینید.

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

`esm.run` وابستگی‌های خارجی بسته را برای شما مسیریابی می‌کند، بنابراین این روش بدون باندلر کار می‌کند.
هر نقطهٔ ورود با مسیرش پس از نسخه به دست می‌آید: `…/erd-editor.js` ویرایشگر را تعریف می‌کند و `…/erd-viewer.js` نمایشگر را، که هر زبان نمایش جز انگلیسی را وقتی صفحه بخواهد از CDN دریافت می‌کند. نشانی بدون مسیر بسته، `https://esm.run/@dineug/erd-editor@5.0.0`، ریشه را ارائه می‌دهد که هیچ عنصری تعریف نمی‌کند.
نشانی بدون نسخه همیشه آخرین نسخه را ارائه می‌دهد. اگر نمی‌خواهید یک ارتقای نسخهٔ اصلی بدون اطلاع قبلی به صفحهٔ شما برسد، نسخه را ثابت کنید، مانند بالا.
خود `5.0.0` نیز یک ارتقای نسخهٔ اصلی است: صفحه‌ای که باید روی 4.x بماند، `@4.2.0` را ثابت می‌کند؛ [ارتقا از 4.x](#upgrading-from-4x) را ببینید.

`esm.run` ورکرهای مشترک را از `cdn.jsdelivr.net` ارائه می‌دهد و مرورگر هیچ shared worker‌ای را از مبدأیی غیر از مبدأ صفحه شروع نمی‌کند. بنابراین ویرایشگری که به این روش بارگذاری شود بدون ورکرهایش اجرا می‌شود، همان‌طور که روی میزبانی که آن‌ها را مسدود می‌کند؛ [Web Worker](#web-workers) را ببینید. بیلد [تگ script](#script-tag) آن‌ها را درون فایل خود دارد.

### تگ script {#script-tag}

از نسخهٔ `3.6.0`، بسته یک بیلد UMD نیز عرضه می‌کند که هر وابستگی و هر Shared Worker را درون یک فایل جای داده است، یعنی `dist/erd-editor.umd.js`.
فیلدهای `unpkg` و `jsdelivr` به همین بیلد اشاره می‌کنند، بنابراین نشانی بسته بدون مسیر در هر یک از این دو CDN همین بیلد را ارائه می‌دهد و این بیلد `window.ErdEditor` را تعریف می‌کند.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

بارگذاری آن `<erd-editor>` را تعریف می‌کند. `window.ErdEditor` دو تابع callback فایل، یعنی `ErdEditor.setExportFileCallback` و `ErdEditor.setImportFileCallback`، از نسخهٔ `3.9.2` `ErdEditor.createKeyBindingMap`، از نسخهٔ `4.2.0` `ErdEditor.dictionaryRowChords` — [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) را ببینید — و از نسخهٔ `5.0.0` `ErdEditor.ErdEditorElement` و `ErdEditor.defineErdEditor` را در خود دارد — [ثبت عنصرها](#registering-the-elements) را ببینید. [toImage](./to-image.md) را در خود ندارد.

از نسخهٔ `5.0.0` فایل دومی، `dist/erd-viewer.umd.js`، `<erd-viewer>` را تعریف می‌کند و `ErdViewerElement` و `defineErdViewer` را روی `window.ErdViewer` می‌گذارد. هیچ ورکری شروع نمی‌کند، هر 25 زبان نمایش را در خود دارد و جز `src` که به آن داده می‌شود چیزی را درخواست نمی‌کند.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

هیچ‌یک از این دو فایل تگ دیگری را تعریف نمی‌کند و هر کدام جز global خودش و `window.Konva` چیزی روی صفحه باقی نمی‌گذارد.
نگاشت exports همچنان باندلر را به ماژول‌های ES هدایت می‌کند، بنابراین نصب از npm هرگز از هیچ‌یک از این دو فایل استفاده نمی‌کند.
صفحه‌ای که نمی‌تواند اسکریپت خودش را بارگذاری کند می‌تواند به‌جای آن نمایشگر میزبانی‌شده در erd-editor.io/embed را در یک قاب بگذارد — [جاسازی](../guide/guides/embedding.md) را ببینید.

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

از نسخهٔ `4.0.0`، صفت `enable-locale-picker` انتخابگر `Display Language` را به نوار ابزار اضافه می‌کند و صفت `enable-welcome-screen` صفحهٔ خوش‌آمدی را اضافه می‌کند که در نمودار خالی نمایش داده می‌شود؛ [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) و [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen) را ببینید.
صفحه‌ای که یک سند را بارگذاری می‌کند، همان‌طور که در [نحوهٔ استفاده](#usage) انجام می‌شود، خاصیت `enableWelcomeScreen` را نه در نشانه‌گذاری، بلکه پس از آنکه `setInitialValue()` سند را بارگذاری کرد روشن می‌کند، بنابراین صفحهٔ خوش‌آمد هرگز برای لحظه‌ای روی فایلی که هنوز در حال بارگذاری است ظاهر نمی‌شود.
ویرایشگر همهٔ 25 زبان نمایش را در خود دارد، چه در بیلد ES و چه در بیلد تگ script، بنابراین نه فایل زبانی برای ارائه هست و نه چیزی برای ثبت. بدون انتخابگر و بدون فراخوانی `setLocale()`، ویرایشگر به انگلیسی نمایش داده می‌شود.

افزودن صفت `readonly` در اینجا ویرایشگر را به‌صورت یک خواننده باز می‌کند: مقداردهی خاصیت `value`، فراخوانی `clear()` و هر فراخوانی `setSchema*()` — از جمله `setSchemaJSON()` و فراخوانی با حالت افزودن — نادیده گرفته می‌شوند و رویداد `change` هرگز ارسال نمی‌شود. زبانه‌های آن، کاوشگر و جست‌وجوی سریع برای خواندن می‌مانند و هر کنترلی که نمودار را ویرایش می‌کرد حذف می‌شود.
خواندن `editor.value` و `editor.runtimeValue` همچنان کار می‌کند و هر دو تنظیم‌های خود سند را نگه می‌دارند: تنظیم نمایشی که خواننده تغییر می‌دهد، مانند بزرگ‌نمایی یا پایگاه داده، روی صفحهٔ همان ویرایشگر می‌ماند. در عوض با `setInitialValue()` بارگذاری کنید — [readonly](./erd-editor-element.md#readonly) را ببینید.

### رندر سمت سرور {#server-side-rendering}

هر نقطهٔ ورود جز `engine.js` و `peer.js` به DOM نیاز دارد، بنابراین در Node خطا می‌دهد. `erd-editor.js` و `erd-viewer.js` عنصر خود را در سطح ماژول تعریف می‌کنند و ریشهٔ بسته، که از نسخهٔ `5.0.0` چیزی تعریف نمی‌کند، همچنان هنگام بارگذاری هر دو کلاس عنصر را می‌سازد.
در Next.js، Nuxt، SvelteKit یا Astro، نقطهٔ ورود عنصر را از مسیری که فقط در سمت کلاینت اجرا می‌شود به دست آورید، و یک import نام‌دار از ریشه، مانند `setExportFileCallback` یا `toImage`، را از همان مسیر.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

در توسعه، بستهٔ ELK را که ورکر چیدمان ویرایشگر وارد می‌کند به پیش‌باندل Vite اضافه کنید، وگرنه چیدمان‌هایی که آن ورکر می‌سازد شکست می‌خورند: `Flow`، `Tree - vertical` و `Tree - horizontal` در چیدمان خودکار، حالت جریان در زبانهٔ مصورسازی و وارد کردنی که با چیدمان جریان چیده می‌شود.
Vite 7 و قدیمی‌تر نیاز دارند ویرایشگر را هم از پیش‌باندل بیرون نگه دارید، چون پیش‌باندل آن‌ها نشانی ورکرها را به فایل‌هایی اشاره می‌دهد که هرگز نوشته نمی‌شوند، بنابراین هر سه ورکر شکست می‌خورند. در Vite 8 این `exclude` را حذف کنید، که فقط باعث می‌شود سرور توسعه هر فایل بسته را جداگانه دریافت کند. بیلد تولید به هیچ‌کدام نیاز ندارد.

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

وارد کردن `@dineug/erd-editor/erd-editor.js`، `erd-editor` را در `HTMLElementTagNameMap` ادغام می‌کند و `@dineug/erd-editor/erd-viewer.js`، `erd-viewer` را، بنابراین عنصر بدون cast نوع‌دار است. هر import از ریشه، حتی فقط یک نوع، هر دو را می‌آورد.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` برای مشخص کردن نوع متغیرها و props خودتان صادر می‌شود. از نسخهٔ `5.0.0` کلاس عنصر هم هست و `ErdViewerElement` رابط و کلاس نمایشگر است — [ثبت عنصرها](#registering-the-elements) را ببینید.
از نسخهٔ `4.0.0`، بسته نوع‌های `LocaleCode`، `LocaleOption` و `SchemaSQLOptions` را نیز صادر می‌کند و از نسخهٔ `5.0.0` `ToImageOptions` را؛ [نقاط ورود](#entry-points) را ببینید. گزینه‌هایی که متدهای `setSchema*()` می‌گیرند با نامی صادر نمی‌شوند؛ آن‌ها را از خود عنصر بخوانید، مانند `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
از نسخهٔ `5.0.0` فیلد `typesVersions` بسته نوع هر نقطهٔ ورود زیرمسیر را زیر `moduleResolution: "node10"` هم تعیین می‌کند، که نگاشت exports را نمی‌خواند.

## ثبت عنصرها {#registering-the-elements}

از نسخهٔ `5.0.0` بسته تگ را فقط جایی تعریف می‌کند که صفحه بخواهد.

| import | تعریف می‌کند |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | هیچ‌چیز |

هر یک از این دو نقطهٔ ورود تگ خود را همان‌طور که ارزیابی می‌شود تعریف می‌کند و چیزی صادر نمی‌کند، بنابراین فقط برای اثرش وارد می‌شود، و هیچ‌کدام تگ دیگری را تعریف نمی‌کند.
ریشه هر دو کلاس عنصر، `ErdEditorElement` و `ErdViewerElement`، و `defineErdEditor()` و `defineErdViewer()` را صادر می‌کند که تگ خود را همان‌جا که فراخوانی‌شان کنید تعریف می‌کنند:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

تا وقتی تگ همان کلاس را دارد، فراخوانی کاری نمی‌کند، بنابراین یک نقطهٔ ورود و یک فراخوانی define، یا دو فراخوانی define، می‌توانند در یک صفحه کنار هم بیایند. وقتی کلاس دیگری تگ را در اختیار دارد، مانند نسخهٔ دوم بسته که در همان صفحه باندل شده باشد، یک `Error` با نام تگ پرتاب می‌کند: `Another element class already defines the custom element name erd-editor`.
کلاس‌های ریشه همان‌هایی هستند که نقاط ورود تعریف می‌کنند، بنابراین پس از اجرای هر یک، `customElements.get('erd-editor') === ErdEditorElement` برقرار است. تا وقتی تگ تعریف نشده است، `document.createElement('erd-editor')` یک `HTMLElement` ساده بدون هیچ‌یک از اعضای ویرایشگر می‌سازد و `new ErdEditorElement()` خطا پرتاب می‌کند.

برای تگی از خودتان، کلاس را خودتان زیر آن تعریف کنید و تگ را خودتان به `HTMLElementTagNameMap` اضافه کنید. این کار را در پنجره‌ای انجام دهید که نه نقطهٔ ورود آن عنصر و نه بیلد [تگ script](#script-tag) آن را بارگذاری می‌کند و هیچ تابع define‌ای برای آن فراخوانی نمی‌کند، چون یک کلاس در هر پنجره فقط یک نام می‌گیرد:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

باندلی که هر دو عنصر را دارد باعث می‌شود Vite و Rolldown برای هر زبان نمایش جز انگلیسی یک بار هشدار `INEFFECTIVE_DYNAMIC_IMPORT` بدهند. نمایشگر هر یک از آن‌ها را با `import()` جداگانهٔ خود بارگذاری می‌کند و ویرایشگر همهٔ واژه‌نامه‌ها را یک‌جا وارد می‌کند، بنابراین در بخش ویرایشگر می‌مانند و با آن بارگذاری می‌شوند. هیچ‌چیز شکست نمی‌خورد و باندلی که فقط نمایشگر را دارد هر زبان را در بخشی جداگانه نگه می‌دارد.

## برجسته‌سازی نحو {#syntax-highlighting}

پنل‌های طرح‌واره SQL و مولد کد با [Shiki](https://shiki.style)، در یک Shared Worker مخصوص خودش، برجسته‌سازی می‌شوند و از نسخهٔ `4.0.0`، اسکریپت‌های `Before tables` و `After tables` زبانهٔ طرح‌واره SQL نیز برجسته‌سازی می‌شوند.
از نسخهٔ `3.7.0`، نه چیزی برای نصب هست و نه چیزی برای ثبت: ورکر در نخستین باری که یک پنل کد رندر می‌شود ساخته می‌شود، بنابراین صفحه‌ای که هیچ پنل کدی را باز نکند، هرگز گرامرها را دریافت نمی‌کند.

| | |
| --- | --- |
| زبان‌ها | SQL، TypeScript، GraphQL، C#، Java، Kotlin، Scala، Go، Python، PHP، Rust، Swift، JSON، Mermaid |
| طرح‌های زمینه | `github-dark` و `github-light`، مطابق با ظاهر روشن یا تیرهٔ ویرایشگر |

این‌ها دقیقاً همان زبان‌هایی هستند که پنل‌ها تولید می‌کنند: `JPA` به‌عنوان Java برجسته‌سازی می‌شود، `SQLAlchemy` به‌عنوان Python، `TypeORM`، `Sequelize`، `Drizzle` و `Zod` به‌عنوان TypeScript، `Doctrine` به‌عنوان PHP، `SeaORM` به‌عنوان Rust، `JSON Schema` به‌عنوان JSON و `DBML` و `AML` به‌عنوان SQL، یعنی نزدیک‌ترین گرامر موجود در بسته؛ [مولد کد](../guide/guides/code-generator.md) را ببینید.

موتور عبارت باقاعده با JavaScript خالص نوشته شده است، بنابراین هیچ سیاستی در میزبان به `wasm-unsafe-eval` نیاز ندارد.
جایی که `SharedWorker` در دسترس نیست — Chrome در Android پیش از Chrome 148، Safari پیش از 16.4 — خطا ثبت می‌شود و کد به‌صورت متن ساده نمایش داده می‌شود؛ اسکریپت‌ها همچنان قابل ویرایش‌اند.

ارتقا از نسخهٔ `3.6.0` یا پیش از آن: `@dineug/erd-editor-shiki-worker` دیگر منتشر نمی‌شود و `setGetShikiServiceCallback` نیز همراه با آن حذف شده است.
نصب و ثبت را حذف کنید؛ صفحه‌ای که ورکر را از یک CDN بارگذاری می‌کرد، آن تگ `<script>` دوم را نیز حذف می‌کند.

## Web Worker {#web-workers}

ویرایشگر سه کار را در ورکرهای `SharedWorker` اجرا می‌کند: برجسته‌سازی نحو، صادر کردن تصویر و چیدمان جدول‌ها که پشتوانهٔ [چیدمان خودکار](../guide/guides/table-related-functions.md#auto-layout)، [حالت جریان](../guide/guides/visualization.md#how-flow-is-placed) در زبانهٔ مصورسازی و از نسخهٔ `4.0.0`، چیدمان طرح‌وارهٔ واردشده است.
هر سه درون `@dineug/erd-editor` عرضه می‌شوند. هیچ‌کدام نیازی به راه‌اندازی از سوی شما ندارد، اما میزبان می‌تواند هر کدام را مسدود کند.
از نسخهٔ `5.0.0` هر ورکر در ماژولی جداگانه ساخته می‌شود، بنابراین باندل فقط ورکرهایی را دارد که ماژول‌هایش به آن‌ها می‌رسند: باندلی از [toImage](./to-image.md) و بدون هیچ عنصر فقط ورکر صادر کردن تصویر را دارد و `<erd-viewer>` هیچ ورکری شروع نمی‌کند — [نقاط ورود](#entry-points) را ببینید.
ورکری که جمع‌آوری زبالهٔ سند را اجرا می‌کرد، در نسخهٔ `4.0.0` همراه با خود جمع‌آوری زباله حذف شد.

| ورکر | بدون آن |
| --- | --- |
| برجسته‌سازی نحو | پنل‌های طرح‌واره SQL و مولد کد و اسکریپت‌های طرح‌واره SQL به‌صورت متن ساده باقی می‌مانند |
| صادر کردن تصویر | PNG، SVG، `Copy to clipboard`، پیش‌نمایش کادر گفت‌وگوی `Export image` و از نسخهٔ `5.0.0` [toImage()](./to-image.md) روی رشتهٔ اصلی رسم می‌شوند و این کار صفحه را در حین رسم مسدود می‌کند |
| چیدمان جدول‌ها | چیدمان‌های `Flow`، `Tree - vertical` و `Tree - horizontal` در چیدمان خودکار و حالت جریان در زبانهٔ مصورسازی با `Could not place tables` پایان می‌یابند؛ وارد کردنی که با چیدمان جریان چیده می‌شود — یک فایل SQL، GraphQL، DBML یا AML از `Import` یا `Import and Add`، یا یک فراخوانی `setSchema*()` با `placement: 'auto'` — جدول‌هایش را بدون هیچ پیامی در ردیف‌ها قرار می‌دهد؛ `Force` و حالت گراف تحت تأثیر قرار نمی‌گیرند، چون درون خود ویرایشگر اجرا می‌شوند |

صادر کردن تصویر ده ثانیه منتظر پاسخ ورکر خود می‌ماند و سپس روی رشتهٔ اصلی رسم می‌کند و برجسته‌سازی نحو به‌محض شکست ورکرش، کد را به‌صورت متن ساده باقی می‌گذارد، بنابراین مسدود کردن ورکرها از سوی میزبان به قیمت کارایی تمام می‌شود، نه کارکرد.
چیدمان جدول‌ها استثناست: موتوری که چیدمان را محاسبه می‌کند از خود ویرایشگر حجیم‌تر است و هرگز درون همان فرایند بارگذاری نمی‌شود، بنابراین در نخستین چیدمان سی ثانیه منتظر ورکر خود می‌ماند و پس از آنکه ورکر پاسخ داد، به هر چیدمان شصت ثانیه فرصت می‌دهد تا بازگردد.
اگر هر یک از این دو زمان انتظار به پایان برسد، چیدمان همان‌طور پایان می‌یابد که بدون ورکر پایان می‌یابد. چیدمان خودکار به‌محض شروع، `Placing tables` را نشان می‌دهد، در حالی که حالت جریان و وارد کردنی که با چیدمان جریان چیده می‌شود، آن را تنها زمانی نشان می‌دهند که یک چیدمان، با احتساب راه‌اندازی ورکرش، شش ثانیه طول کشیده باشد.

Vite، webpack 5 و Rspack ورکرها را به‌صورت فایل در کنار بخش‌های شما تولید می‌کنند. esbuild و Rolldown وقتی مستقل به کار می‌روند، نه از طریق Vite، هیچ فایلی تولید نمی‌کنند، بنابراین صفحه‌ای که با آن‌ها ساخته شود بدون ورکرها اجرا می‌شود.
زیر `experiments.outputModule` آزمایشی webpack هیچ ورکری شروع نمی‌شود، چون هر کدام منتظر بخشی است که از آن جدا شده و هیچ‌چیز آن را بارگذاری نمی‌کند. خروجی پیش‌فرض webpack را نگه دارید، یا `optimization.splitChunks: false` را تنظیم کنید.

### Content Security Policy {#content-security-policy}

صفحه‌ای زیر Content Security Policy سخت‌گیرانه برای این عنصرها به این دستورها نیاز دارد:

- `worker-src 'self'` برای بیلد باندل‌شده که ورکرهایش فایل‌هایی در کنار بسته‌اند، به‌علاوهٔ `blob:` در جایی که باندلر شما یک ورکر را درون‌خطی می‌کند. در بیلد [تگ script](#script-tag)، هر سه به‌صورت نشانی‌های `data:` درون فایل جای دارند، بنابراین آن صفحه در عوض به `worker-src data:` نیاز دارد. `<erd-viewer>` به هیچ‌کدام نیاز ندارد، چون هیچ ورکری شروع نمی‌کند.
- از نسخهٔ `5.0.0` هر دو عنصر خود را با stylesheetهای ساخته‌شده (constructed stylesheets) استایل می‌دهند، که `style-src 'self'` آن‌ها را می‌پذیرد. پنل‌های کد ویرایشگر همچنان متن خود را با صفت‌های `style` رنگ می‌کنند و پیش‌نمایش کادر گفت‌وگوی `Export image` تصویری در یک نشانی `blob:` است، بنابراین ویرایشگر برای آن‌ها به `style-src 'unsafe-inline'` و `img-src blob:` هم نیاز دارد.
- مرورگری که constructed stylesheets ندارد، مانند Firefox پیش از 101، به‌جای آن عنصرهای `<style>` می‌گیرد که برای هر یک از دو عنصر به `style-src 'unsafe-inline'` نیاز دارند.
- `<erd-viewer>` مقدار `src` خود را fetch می‌کند، بنابراین آن مبدأ در `connect-src` می‌آید — [آنچه به صفحه اضافه می‌کند](./erd-viewer-element.md#what-it-adds-to-a-page) را ببینید.

## نقاط ورود {#entry-points}

بسته پنج نقطهٔ ورود دارد:

| نقطهٔ ورود | چیست |
| --- | --- |
| `@dineug/erd-editor` | ریشه: خروجی‌های زیر. از نسخهٔ `5.0.0` هیچ عنصری تعریف نمی‌کند، هرچند برای بارگذاری همچنان به DOM نیاز دارد |
| `@dineug/erd-editor/erd-editor.js` | از نسخهٔ `5.0.0`. `<erd-editor>` را تعریف می‌کند و چیزی صادر نمی‌کند |
| `@dineug/erd-editor/erd-viewer.js` | از نسخهٔ `5.0.0`. `<erd-viewer>` را تعریف می‌کند و چیزی صادر نمی‌کند |
| `@dineug/erd-editor/engine.js` | مخزن سند بدون DOM |
| `@dineug/erd-editor/peer.js` | از نسخهٔ `3.9.1`. همتای بدون رابط کاربری سرور MCP |

ریشه هر دو کلاس عنصر و توابع define آن‌ها، دو تابع تنظیم callback، از نسخهٔ `3.9.2` کلیدهای میان‌بر پیش‌فرض همراه با نوع‌هایشان، از نسخهٔ `4.0.0` نوع‌های زبان نمایش و نوع گزینه‌های `getSchemaSQL()`، از نسخهٔ `4.2.0` ترکیب‌های کلید ردیف‌ها در زبانهٔ واژه‌نامه و از نسخهٔ `5.0.0` تابع `toImage` را صادر می‌کند.

| خروجی | توضیح |
| --- | --- |
| `ErdEditorElement` | رابط عنصر؛ [ErdEditorElement](./erd-editor-element.md) را ببینید. از نسخهٔ `5.0.0` کلاس آن هم هست، همان که `<erd-editor>` با آن تعریف می‌شود؛ [ثبت عنصرها](#registering-the-elements) را ببینید. |
| `ErdViewerElement` | از نسخهٔ `5.0.0`. رابط و کلاس نمایشگر؛ [ErdViewerElement](./erd-viewer-element.md) را ببینید. |
| `defineErdEditor()`، `defineErdViewer()` | از نسخهٔ `5.0.0`. `<erd-editor>` یا `<erd-viewer>` را با کلاس آن تعریف می‌کنند. تا وقتی تگ همان کلاس را دارد فراخوانی کاری نمی‌کند و وقتی کلاس دیگری آن را دارد یک `Error` پرتاب می‌کند؛ [ثبت عنصرها](#registering-the-elements) را ببینید. |
| `toImage(value, options)` | از نسخهٔ `5.0.0`. یک سند را به‌صورت `Blob` از نوع PNG یا رشتهٔ SVG، با گزینه‌های کادر گفت‌وگوی `Export image` رسم می‌کند؛ [toImage](./to-image.md) را ببینید. |
| `ToImageOptions` (نوع) | از نسخهٔ `5.0.0`. گزینه‌هایی که `toImage()` می‌گیرد: `format`، `background`، `darkMode` و `scale`. |
| `setExportFileCallback(cb)` | دانلود مرورگر را جایگزین می‌کند، `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | انتخابگر فایل مرورگر را جایگزین می‌کند، `({ type, op, accept, mode }) => void`؛ `mode` از نسخهٔ `4.0.0`. از نسخهٔ `4.2.0`، `Import CSV` در زبانهٔ واژه‌نامه حتی با وجود تابع callback تنظیم‌شده، انتخابگر فایل مرورگر را باز می‌کند؛ [کادرهای گفت‌وگوی فایل](#file-dialogs) را ببینید. |
| `createKeyBindingMap()` | در هر فراخوانی، کلیدهای میان‌بر پیش‌فرض را به‌صورت یک `KeyBindingMap` جدید برمی‌گرداند؛ [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap) را ببینید. |
| `KeyBindingMap`، `KeyBindingName`، `ShortcutOption` (نوع‌ها) | یک نگاشت کلیدهای میان‌بر، اجتماع نام‌های فرمان آن و یک کلید میان‌بر. |
| `dictionaryRowChords(map)` | از نسخهٔ `4.2.0`. ترکیب‌های کلیدی را که شبکهٔ زبانهٔ [واژه‌نامه](../guide/guides/dictionary.md#adding-and-deleting-rows) با آن‌ها، بر اساس `KeyBindingMap` که ارسال می‌کنید، ردیف درج و حذف می‌کند، در هر فراخوانی به‌صورت یک `ShortcutOption[]` جدید برمی‌گرداند. ترکیبی که ردیف‌ها را در بالا درج می‌کند، یعنی `Alt+Shift+Enter` با مقادیر پیش‌فرض، در هیچ کلید میان‌بری نیامده است؛ [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) را ببینید. |
| `LocaleCode`، `LocaleOption` (نوع‌ها) | از نسخهٔ `4.0.0`. کدهای 25 زبان نمایش و همین کدها به‌علاوهٔ `'system'` که `setLocale()` می‌گیرد؛ [زبان نمایش](./erd-editor-element.md#display-language) را ببینید. |
| `SchemaSQLOptions` (نوع) | از نسخهٔ `4.0.0`. گزینه‌هایی که `getSchemaSQL()` می‌گیرد: `statements`، `header` و از نسخهٔ `4.2.0`، `logicalNameAsComment`؛ [getSchemaSQL](./erd-editor-element.md#getschemasql) را ببینید. |

از نسخهٔ `5.0.0` پوشهٔ `dist` برای هر ماژول یک فایل کوچک‌نشده دارد، هر کدام در کنار declaration خود، و فیلد `sideEffects` در `package.json` فقط دو نقطهٔ ورود تگ و دو stub مورد نیاز فایل‌های ورکر را نام می‌برد. بنابراین باندلر هر ماژولی را که صفحه به آن نمی‌رسد کنار می‌گذارد و فقط یک بار کوچک می‌کند:

- یک import نام‌دار از ریشه، مانند `setExportFileCallback`، نه عنصری را باندل می‌کند و نه ورکری را.
- `toImage` ورکر صادر کردن تصویر را می‌آورد و هیچ عنصری را.
- `erd-editor.js` ویرایشگر و هر سه Shared Worker را می‌آورد.
- `erd-viewer.js` نمایشگر را می‌آورد و هیچ ورکری را، با انگلیسی درون آن و هر زبان نمایش دیگر در بخشی جداگانه که وقتی صفحه بخواهد بارگذاری می‌شود.

`@dineug/erd-editor/engine.js` مخزن سند را بدون DOM اجرا می‌کند، بنابراین در یک Web Worker کار می‌کند؛ [ذخیره‌سازی راه دور](./advanced/remote-storage.md) را ببینید.
این نقطهٔ ورود `createReplicationStore` و نوع `ReplicationStore` را صادر می‌کند. از نسخهٔ `3.10.0`، نوع `ReplicationChange` را نیز صادر می‌کند، یعنی `{ value: string; changed: boolean }`، که شنوندهٔ رویداد `change` یک رونوشت آن را دریافت می‌کند؛ [on@change](./advanced/remote-storage.md#onchange) را ببینید.
از نسخهٔ `4.0.0`، هر `ReplicationStore` یک خاصیت `runtimeValue` نیز دارد. خاصیت `value` آن و مقداری که رویداد `change` تحویل می‌دهد، مانند مقادیر عنصر، همان شکل ذخیره‌سازی‌اند که فایل نگه می‌دارد؛ [ReplicationStore](./advanced/remote-storage.md#replicationstore) را ببینید.

`@dineug/erd-editor/peer.js` همتای بدون رابط کاربری که [سرور MCP](../mcp/introduction.md) از طریق آن سند را ویرایش می‌کند. این نقطهٔ ورود برای همان سرور وجود دارد و این صفحه‌ها آن را مستند نمی‌کنند.

### کادرهای گفت‌وگوی فایل {#file-dialogs}

وارد کردن و صادر کردن از طریق توابع callback قابل تزریق انجام می‌شوند، بنابراین میزبانی که کادر گفت‌وگوی فایل مرورگر را ندارد — برای نمونه یک webview در IDE — می‌تواند کادر گفت‌وگوی خودش را فراهم کند.
این دو متقارن نیستند: صادر کردن فایل نهایی را به شما تحویل می‌دهد، در حالی که وارد کردن فقط یک فایل درخواست می‌کند و خودتان محتوا را به ویرایشگر بازمی‌گردانید.
از نسخهٔ `4.2.0`، `Import CSV` در زبانهٔ واژه‌نامه تنها وارد کردنی است که هرگز تابع callback وارد کردن را فراخوانی نمی‌کند، چون `type` این تابع مقداری برای CSV ندارد. این گزینه همیشه انتخابگر فایل خود مرورگر را برای فایل‌های `.csv` باز می‌کند؛ [وارد کردن و صادر کردن CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) را ببینید.

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

مقدار `fileName` که ویرایشگر تولید می‌کند، `<database name>-<timestamp>` به‌علاوهٔ پسوند فایل است، که در آن مهر زمانی، زمان محلی با قالب `yyyy-MM-dd'T'HH_mm_ss` است. اگر نام پایگاه داده خالی باشد، `unnamed` به کار می‌رود. فایل CSV واژه‌نامه نام برگهٔ خود را پیش از پسوند می‌آورد، مانند `<database name>-<timestamp>-words.csv`.
تابع callback صادر کردن این فایل‌ها را دریافت می‌کند. از نسخهٔ `4.0.0`، SVG و فایل‌های مولد کد نیز در میان آن‌ها هستند و فایل `.sql` از `Save file` در زبانهٔ طرح‌واره SQL می‌آید، نه مستقیماً از `Export`. از نسخهٔ `4.2.0`، فایل CSV زبانهٔ واژه‌نامه نیز در میان آن‌هاست. [toImage()](./to-image.md) هیچ‌یک از دو callback را فراخوانی نمی‌کند: تصویرش را به شما برمی‌گرداند.

| فایل | پسوند | `type` در Blob |
| --- | --- | --- |
| صادر کردن JSON | `.erd.json` | `application/json` |
| `Save file` در زبانهٔ طرح‌واره SQL، شامل متنی که این زبانه نشان می‌دهد؛ [طرح‌واره SQL](../guide/guides/schema-sql.md) را ببینید | `.sql` | ندارد |
| کادر گفت‌وگوی [صادر کردن تصویر](../guide/guides/file-import-export.md#image) | `.png` یا `.svg` | `image/png` یا `image/svg+xml` |
| `Save file` در زبانهٔ مولد کد؛ [مولد کد](../guide/guides/code-generator.md) را ببینید | پسوند زبان کد: `.cs`، `.go`، `.java`، `.kt`، `.php`، `.rs`، `.scala`، `.swift`، `.ts`، `.py`، `.aml`، `.dbml`، `.graphql`، `.json` یا `.mmd` | ندارد |
| `Export CSV` در زبانهٔ واژه‌نامه، شامل همهٔ ردیف‌های برگهٔ نمایش داده‌شده، صرف‌نظر از آنچه جست‌وجوی آن فهرست می‌کند؛ [وارد کردن و صادر کردن CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) را ببینید | `.csv` | `text/csv` |

میزبانی که پردازشگر را بر اساس پسوند انتخاب می‌کند، برای هر یک از آن‌ها به یک پردازشگر نیاز دارد.

اگر این توابع callback تنظیم نشوند، ویرایشگر از رفتار دانلود و انتخابگر فایل خود مرورگر استفاده می‌کند. برای بازگشت به آن، `null` را ارسال کنید.

## پشتیبانی مرورگرها {#browser-support}

Chrome 91+، Edge 94+، Firefox 93+، Safari 16.4+ — خط پایهٔ ES2022 که باندل‌های منتشرشده بر اساس آن ساخته می‌شوند.
هیچ پلی‌فیلی در باندل گنجانده نشده است. اگر باید از مرورگرهای قدیمی‌تر پشتیبانی کنید، پلی‌فیل‌های خودتان را اضافه کنید.

## ارتقا از 4.x {#upgrading-from-4x}

`5.0.0` یک نسخهٔ اصلی است. هنگام انتقال یک صفحه از 4.x، هر یک از این موارد را بررسی کنید:

- `import '@dineug/erd-editor'` دیگر `<erd-editor>` را تعریف نمی‌کند. به‌جای آن `@dineug/erd-editor/erd-editor.js` را برای اثرش وارد کنید، یا `defineErdEditor()` را فراخوانی کنید، و import‌های نام‌دار خود از ریشه را همان‌طور که هستند نگه دارید. TypeScript صفحه‌ای را که روی import بدون مسیر مانده است علامت نمی‌زند، چون declarationهای ریشه همچنان تگ را در `HTMLElementTagNameMap` نام می‌برند، اما عنصری که ساخته می‌شود یک `HTMLElement` ساده است، بنابراین نخستین فراخوانی متد آن یک `TypeError` پرتاب می‌کند — [ثبت عنصرها](#registering-the-elements) را ببینید.

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- در یک CDN همین در مورد `https://esm.run/@dineug/erd-editor` صدق می‌کند، که اکنون ریشه را ارائه می‌دهد و چیزی تعریف نمی‌کند: `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js` را وارد کنید. نشانی‌های بدون مسیر jsDelivr و unpkg همچنان بیلد تگ script را ارائه می‌دهند، که `<erd-editor>` را مانند قبل تعریف می‌کند. نشانی بدون نسخه اکنون آخرین نسخهٔ 5.x را ارائه می‌دهد؛ برای ماندن روی 4.x، `@4.2.0` را ثابت کنید — [CDN](#cdn) و [تگ script](#script-tag) را ببینید.
- ریشه چیزی تعریف نمی‌کند اما همچنان به DOM نیاز دارد، بنابراین در رندر سمت سرور یک import نام‌دار از آن، مانند `setExportFileCallback`، در کنار نقطهٔ ورود عنصر در مسیر فقط-کلاینت می‌ماند — [رندر سمت سرور](#server-side-rendering) را ببینید.
- `window.ErdEditor` دو عضو `ErdEditorElement` و `defineErdEditor` را می‌گیرد. بیلد تگ script نمایشگر `ErdViewerElement` و `defineErdViewer` را روی `window.ErdViewer` می‌گذارد و هیچ‌یک از دو global تابع `toImage` را ندارد.
- ویرایشگر `readonly` به‌صورت یک خواننده باز می‌شود. شش زبانه، کاوشگر، جست‌وجوی سریع و حضور دیگران می‌مانند و هر کنترلی که نمودار را ویرایش می‌کرد به‌جای غیرفعال شدن حذف می‌شود: نوار ابزار نام پایگاه داده را به‌صورت متن نشان می‌دهد، زبانهٔ تنظیمات تنظیم‌هایش را با هر کنترل غیرفعال زیر نشان `Read only` نشان می‌دهد و نوار ابزار شناور فقط بزرگ‌نمایی، نمایش نام‌ها، حالت ذن و قطب‌نما را نگه می‌دارد، بنابراین `Hand` و `Select` حذف می‌شوند و کشیدن بوم را جابه‌جا می‌کند. فشردن چیزی را انتخاب نمی‌کند: تنها انتخاب، خط دورنمایی است که پرش از کاوشگر یا جست‌وجوی سریع دور چیزی که به آن می‌رسد می‌گذارد و یک کلیک بی‌حرکت آن را پاک می‌کند، و کلیدهای انتخاب همه چیزی را انتخاب نمی‌کنند. روشن کردن `readonly` آنچه را باز بود می‌بندد، مانند انتخاب، ابزار دست، ویرایشگر خانه، یک کشیدن، Map Columns، پیش‌نمایش `Force` در چیدمان خودکار و سفر در زمان، و پیمایش، بزرگ‌نمایی، زبانه و نمایش نام‌ها را نگه می‌دارد — [readonly](./erd-editor-element.md#readonly) را ببینید.
- تنظیم‌هایی که خوانندهٔ `readonly` تغییر می‌دهد، قفل‌هایشان هرچه باشد، روی صفحهٔ همان ویرایشگر می‌مانند: پیمایش و بزرگ‌نمایی، زبانه، نمایش نام‌ها، View Option، پایگاه داده، و زبان، شیوه‌های نگارش نام و نوع علامت نقل‌قول Code Generator. `value`، `runtimeValue` و خروجی JSON تنظیم‌های خود سند را نگه می‌دارند، که تغییرهای خوانندهٔ 4.x می‌توانست به آن‌ها برسد، و `getSharedStore()` هیچ‌کدام را به ویرایشگرهای دیگر نمی‌فرستد. `getSchemaSQL()` بدون سامانهٔ پایگاه داده برای پایگاه داده‌ای می‌نویسد که خواننده انتخاب کرده است. خاموش کردن `readonly` پایگاه داده، تنظیمات کد و View Option را به مقدار سند برمی‌گرداند و پیمایش، بزرگ‌نمایی، زبانه و نمایش نام‌ها را همان‌جا که خواننده رها کرده بود می‌گذارد.
- ردیف `Recalculation table width` در زبانهٔ تنظیمات حذف شده است. بارگذاری و جای‌گذاری همچنان عرض هر جدول را با متن آن تنظیم می‌کنند.
- در Vite 8 مقدار `exclude: ['@dineug/erd-editor']` را از `optimizeDeps` حذف کنید، که فقط Vite 7 و قدیمی‌تر هنوز به آن نیاز دارند، و `include` مربوط به ELK را نگه دارید — [Vite](#vite) را ببینید.

## ارتقا از 3.x {#upgrading-from-3x}

`4.0.0` یک نسخهٔ اصلی است. هنگام انتقال یک صفحه از 3.x، هر یک از این موارد را بررسی کنید و سپس موارد [ارتقا از 4.x](#upgrading-from-4x) را برای `5.0.0`:

- `editor.value`، خاصیت `value` یک رونوشت و مقدار `value` که رویداد `change` آن تحویل می‌دهد، همان شکل ذخیره‌سازی‌اند که فایل نگه می‌دارد: بدون موجودیت‌های حذف‌شده، عرض‌های اندازه‌گیری‌شده، ترتیب لایه‌ها یا نقاط اتصال رابطه‌ها. همچنان `value` را ذخیره کنید و این موارد را از `runtimeValue` بخوانید؛ مهرهای زمانی موجودیت‌ها (`meta`) به‌کلی حذف شده‌اند. همکار یا رونوشتی را که به یک نشست در حال اجرا می‌پیوندد، از `runtimeValue` یک همتای در حال اجرا مقداردهی اولیه کنید، نه از `value` یا فایل، و هرگز `runtimeValue` را ذخیره نکنید؛ [value](./erd-editor-element.md#value) و [runtimeValue](./erd-editor-element.md#runtimevalue) را ببینید.
- قفل‌های تنظیمات جایگزین `Save Scroll Information` و `Save Zoom Information` شده‌اند. در سند جدید و در هر سندی که پیش از نسخهٔ `4.0.0` ذخیره شده است، همهٔ قفل‌ها روشن‌اند، بنابراین پیمایش، بزرگ‌نمایی، جابه‌جایی زبانه یا تغییر زبان مولد کد، یکی از شیوه‌های نگارش نام یا نوع علامت نقل‌قول، `value` را همان‌طور که بود باقی می‌گذارد و هیچ رویداد `change` ارسال نمی‌کند. صفحه‌ای که نما را از طریق `change` حفظ می‌کرد، به باز بودن قفل `Viewport` (و برای زبانه، `Canvas Type`) در زبانهٔ تنظیمات نیاز دارد، یا به سندی که `settings.lockSettings` آن این بیت‌ها را صفر بگذارد؛ [قفل](../guide/guides/settings.md#lock) را ببینید.
- `settings` دیگر `width`، `height`، `scrollTop`، `scrollLeft`، `relationshipOptimization` یا `ignoreSaveSettings` را ندارد و ثابت‌های `SaveSettingType` حذف شده‌اند. `settings.lockSettings` همراه با بیت‌های `LockSettingType` جای `ignoreSaveSettings` را می‌گیرد که نسخهٔ `4.0.0` یا بالاتر نه آن را می‌خواند و نه می‌نویسد؛ [Settings](./advanced/schema.md#settings) را ببینید.
- [JSON Schema](./advanced/schema.md#json-schema) که هر فایل در `$schema` نام می‌برد، اکنون فقط شکل ذخیره‌سازی را توصیف می‌کند و ساختاری بسته دارد: فایلی را که نسخه‌ای قدیمی‌تر ذخیره کرده است، رد می‌کند تا زمانی که ذخیره‌ای با نسخهٔ `4.0.0` یا بالاتر آن را بازنویسی کند.
- جمع‌آوری زبالهٔ سند همراه با ورکر آن حذف شده است، بنابراین موجودیت حذف‌شده تا دفعهٔ بعدی که سند از فایلش باز شود، در `runtimeValue` باقی می‌ماند. سه Shared Worker باقی مانده‌اند؛ [Web Worker](#web-workers) را ببینید.
- همهٔ ویرایشگرها و رونوشت‌های یک نشست مشترک را روی نسخهٔ `4.0.0` یا بالاتر نگه دارید. نسخه‌ای قدیمی‌تر انواع جدید کنش را نادیده می‌گیرد: کنش‌های گروه‌های جدول، نگاشت ستون‌ها، قفل‌ها و اسکریپت‌های طرح‌واره SQL؛ [ترکیب نسخه‌ها](./advanced/collaborative-editing.md#mixing-releases) را ببینید.
- تابع callback وارد کردن برای «وارد کردن و افزودن»، `mode: 'append'` را دریافت می‌کند که تابع callback باید آن را منتقل کند. تابع callback صادر کردن اکنون فایل‌های `.svg` و فایل‌های مولد کد را نیز دریافت می‌کند و `Export` ▸ `Schema SQL` به‌جای ذخیره کردن، زبانهٔ طرح‌واره SQL را باز می‌کند، بنابراین فایل `.sql` فقط از `Save file` همان زبانه می‌رسد؛ [کادرهای گفت‌وگوی فایل](#file-dialogs) را ببینید.
- کلیدهای `Delete` و `Backspace` به فرمان جدید `removeSelection` متصل شده‌اند. تا زمانی که ویرایشگر بیرون از یک فیلد متنی فوکوس دارد، در همهٔ زبانه‌ها از رفتار پیش‌فرض کلید جلوگیری می‌شود و در زبانهٔ ERD موارد انتخاب‌شده حذف می‌شوند. `KeyBindingName` و `KeyBindingMap` اکنون آن را در بر می‌گیرند و `setKeyBindingMap({ removeSelection: [] })` هر دو کلید را به صفحه وامی‌گذارد؛ [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap) را ببینید.
- `ThemeOptions.appearance` مقدار `'system'` را نیز می‌پذیرد، یعنی گزینهٔ `System` در سازندهٔ طرح زمینه، که با روشن کردن `systemDarkMode` تنظیم می‌شود. رویداد `changePresetTheme` تا زمانی که این گزینه انتخاب شده است، `'system'` را گزارش می‌کند، بنابراین آن را همان‌طور که هست ذخیره کنید و به `setPresetTheme` بازگردانید. با روشن بودن `systemDarkMode`، فراخوانی `setPresetTheme()` با `'light'` یا `'dark'` اکنون باقی می‌ماند، به‌جای اینکه با تغییر بعدی در OS بازنویسی شود؛ [systemDarkMode](./erd-editor-element.md#systemdarkmode) و [changePresetTheme](./erd-editor-element.md#changepresettheme) را ببینید.
- `@dineug/erd-editor-mcp` نسخهٔ `1.0.0` یا بالاتر، افزونهٔ VS Code نسخهٔ `4.0.0` یا بالاتر و پلاگین‌های Obsidian و JetBrains نسخهٔ `1.0.0` یا بالاتر از پروتکل هاب 2 استفاده می‌کنند. سرور نسخهٔ `1.0.0` یا بالاتر و نسخه‌ای قدیمی‌تر از ویرایشگر که به عامل‌ها سرویس می‌دهد، یا سروری قدیمی‌تر و یکی از این ویرایشگرها، یکدیگر را با `protocolMismatch` رد می‌کنند و طرفی را که باید به‌روزرسانی شود نام می‌برند؛ [به‌روزرسانی](../mcp/installation.md#updating) را ببینید.
- نشانی CDN بدون نسخه آخرین نسخه را ارائه می‌دهد، که از نسخهٔ `5.0.0` نسخهٔ 5.x است. برای ماندن روی 3.x، `@3.10.0` را ثابت کنید؛ [CDN](#cdn) را ببینید.
