---
sidebar_position: 1
description: Встановлення @dineug/erd-editor із npm або CDN, монтування користувацького елемента, підключення діалогових вікон файлів і оновлення з 3.x.
---

# Встановлення

```sh
npm install @dineug/erd-editor
```

Пакет підтримує лише ESM (`"type": "module"`) і містить тільки папку `dist`.
Збірки CommonJS немає, тож виклик `require('@dineug/erd-editor')` не працює.

Його залежності часу виконання залишено зовнішніми, у вигляді імпортів лише за назвою пакета (bare imports), які ваш збирач розв’язує, дедуплікує й очищає від невикористаного коду (tree-shaking).
Його спільні воркери (shared workers) генеруються як окремі файли точок входу в каталозі `dist/workers/` і створюються виразом `new URL('./…', import.meta.url)`, тобто записом, який Vite, webpack 5 і Rspack збирають як точку входу воркера. Див. [Web Workers](#web-workers).
Для сторінки, за якою не стоїть збирач, є друга, самодостатня збірка — див. [тег script](#script-tag).

## Використання {#usage}

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

Елемент `<erd-editor>` не має власного розміру. Задайте йому (або його контейнеру) явні ширину й висоту.
Починаючи з версії `4.1.0`, відкритий [оглядач](../guide/guides/explorer.md) закріплюється всередині елемента ліворуч від полотна ERD і звужує полотно, а не перекриває його. Новий редактор запускається із закритим оглядачем.
Панель не буває вужчою за `200px` і залишає полотну щонайменше `320px`, тож в елементі, вужчому за `520px`, відкритий оглядач не малюється, доки елемент не розшириться, — див. [поруч із полотном](../guide/guides/explorer.md#beside-the-canvas).

Виклик `setInitialValue('')` створює новий порожній документ. Присвоєння властивості `value` натомість завантажує документ як зміну, тому така зміна потрапляє в історію змін.
Починаючи з версії `4.0.0`, властивість `editor.value` — це документ у тій формі, яку містить файл, і саме його слід зберігати. Властивість `editor.runtimeValue` — це документ у тому вигляді, у якому його тримає редактор, включно з видаленими сутностями: ним ініціалізують співавтора, і він ніколи не потрапляє у файл — див. [runtimeValue](./erd-editor-element.md#runtimevalue).
Починаючи з версії `4.0.0`, у новому документі також увімкнено всі [блокування налаштувань](../guide/guides/settings.md#lock): області перегляду, вкладки, мови генератора коду, обох стилів назв і типу лапок. Прокручування, зміна масштабу, перемикання вкладок або зміна одного з цих налаштувань залишає властивість `editor.value` без змін і не генерує подію `change`. Документ, завантажений із тексту, зберігає ті блокування, які в ньому вказано. Документ, у якому не вказано жодного блокування, як-от будь-який файл, збережений до версії `4.0.0`, відкривається з усіма ввімкненими блокуваннями, у масштабі 100% і на вкладці ERD, незалежно від того, яку область перегляду та вкладку в ньому збережено. Його область перегляду заблоковано в початку координат `0, 0`, а якщо там не намальовано жодної частини діаграми, вона натомість відкривається на діаграмі — див. [setInitialValue](./erd-editor-element.md#setinitialvalue).
Про решту API див. [ErdEditorElement](./erd-editor-element.md).

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

Сервіс `esm.run` розв’язує зовнішні залежності пакета за вас, тож цей код працює без збирача.
URL без версії завжди віддає найновіший випуск. Якщо ви не хочете, щоб мажорне оновлення без попередження потрапило на вашу сторінку, закріпіть версію — `https://esm.run/@dineug/erd-editor@4.1.0`.
Версія `4.0.0` сама є таким оновленням: сторінка, яка має залишатися на 3.x, закріплює версію `@3.10.0` — див. [оновлення з 3.x](#upgrading-from-3x).

### Тег script {#script-tag}

Починаючи з версії `3.6.0`, пакет також постачає UMD-збірку, у якій усі залежності й усі спільні воркери містяться в одному файлі.
Саме на неї вказують поля `unpkg` і `jsdelivr`, тож її віддає URL лише з назвою пакета на будь-якому з цих двох CDN, і вона визначає об’єкт `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Імпорт цієї збірки так само реєструє елемент `<erd-editor>`; об’єкт `window.ErdEditor` містить дві функції зворотного виклику для файлів, `ErdEditor.setExportFileCallback` і `ErdEditor.setImportFileCallback`, а також, починаючи з версії `3.9.2`, `ErdEditor.createKeyBindingMap`.
Мапа експортів і далі спрямовує збирач до ES-модулів, тож пакет, встановлений із npm, ніколи не підхоплює цей файл.

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

Починаючи з версії `4.0.0`, атрибут `enable-locale-picker` додає на панель інструментів панель вибору `Display Language`, а атрибут `enable-welcome-screen` додає вітальний екран, який з’являється на порожній діаграмі, — див. [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) і [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Сторінка, яка завантажує документ, як це робить приклад із розділу [використання](#usage), вмикає властивість `enableWelcomeScreen` не в розмітці, а тоді, коли метод `setInitialValue()` уже завантажив документ, тож екран ніколи не блимає поверх файлу, який ще завантажується.
Усі 25 мов інтерфейсу входять до пакета — і до ES-збірки, і до збірки для тегу script, — тож не потрібно ні віддавати файл локалі, ні щось реєструвати. Без панелі вибору й без виклику `setLocale()` редактор показує інтерфейс англійською.

Додавання тут атрибута `readonly` блокує редагування: присвоєння властивості `value`, виклик `clear()` і кожен виклик `setSchema*()` — включно з `setSchemaJSON()` і викликом у режимі додавання — ігноруються, а подія `change` ніколи не генерується. Читання властивостей `editor.value` та `editor.runtimeValue` і далі працює. Натомість завантажуйте документ методом `setInitialValue()`.

### Рендеринг на сервері {#server-side-rendering}

Імпорт пакета реєструє користувацький елемент на рівні модуля, тож він потребує DOM і в Node викидає виняток.
У Next.js, Nuxt, SvelteKit або Astro підключайте його з коду, що виконується лише на клієнті.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Імпорт пакета додає тег `erd-editor` до інтерфейсу `HTMLElementTagNameMap`, тож елемент типізовано без приведення типів.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Тип `ErdEditorElement` експортується, щоб ви могли анотувати ним власні змінні й пропси.
Починаючи з версії `4.0.0`, пакет також експортує типи `LocaleCode`, `LocaleOption` і `SchemaSQLOptions` — див. [точки входу](#entry-points). Параметри, які приймають методи `setSchema*()`, не мають експортованої назви; виводьте їх з елемента, як-от `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Підсвічування синтаксису {#syntax-highlighting}

Панелі схеми SQL і генератора коду підсвічує [Shiki](https://shiki.style) в окремому спільному воркері, а також, починаючи з версії `4.0.0`, скрипти `Before tables` і `After tables` на вкладці схеми SQL.
Починаючи з версії `3.7.0`, нічого не потрібно ні встановлювати, ні реєструвати: воркер створюється під час першого рендерингу панелі коду, тож сторінка, яка не відкриває жодної такої панелі, ніколи не завантажує граматики.

| | |
| --- | --- |
| Мови | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Теми | `github-dark` і `github-light`, відповідно до світлого чи темного вигляду редактора |

Це саме ті мови, які генерують панелі: `JPA` підсвічується як Java, `SQLAlchemy` — як Python, `TypeORM`, `Sequelize`, `Drizzle` і `Zod` — як TypeScript, `Doctrine` — як PHP, `SeaORM` — як Rust, `JSON Schema` — як JSON, а `DBML` і `AML` — як SQL, найближча граматика з наявних у комплекті, — див. [генератор коду](../guide/guides/code-generator.md).

Рушій регулярних виразів написано на чистому JavaScript, тож жодна політика хоста не потребує дозволу `wasm-unsafe-eval`.
Там, де немає `SharedWorker` — у Chrome на Android, у Safari до 16.4, — збій записується в журнал, а код показується звичайним текстом; скрипти все одно можна редагувати.

Оновлення з версії `3.6.0` або старішої: пакет `@dineug/erd-editor-shiki-worker` більше не публікується, а разом із ним зникла й функція `setGetShikiServiceCallback`.
Приберіть його встановлення й реєстрацію; сторінка, яка завантажувала воркер із CDN, також прибирає той другий тег `<script>`.

## Web Workers {#web-workers}

Редактор виконує три завдання у воркерах `SharedWorker`: підсвічування синтаксису, експорт зображень і розміщення таблиць, на якому ґрунтуються [автоматичне розміщення](../guide/guides/table-related-functions.md#auto-layout), [режим Flow](../guide/guides/visualization.md#how-flow-is-placed) вкладки візуалізації та, починаючи з версії `4.0.0`, розміщення імпортованої схеми.
Усі три постачаються в пакеті `@dineug/erd-editor`. Жоден із них не потребує налаштування з вашого боку, але хост може заблокувати будь-який із них.
Воркер, який виконував збирання сміття документа, вилучено у версії `4.0.0` разом із самим збиранням.

| Воркер | Без нього |
| --- | --- |
| Підсвічування синтаксису | Панелі схеми SQL і генератора коду, а також скрипти схеми SQL залишаються звичайним текстом |
| Експорт зображень | PNG, SVG, `Copy to clipboard` і попередній перегляд діалогового вікна `Export image` малюються в головному потоці, і на час малювання сторінка блокується |
| Розміщення таблиць | Варіанти `Flow`, `Tree - vertical` і `Tree - horizontal` автоматичного розміщення, а також режим Flow вкладки візуалізації завершуються повідомленням `Could not place tables`; імпорт, таблиці якого розміщує Flow, — SQL-, GraphQL-, DBML- чи AML-файл, імпортований через `Import` або `Import and Add`, або виклик `setSchema*()` з `placement: 'auto'` — розставляє свої таблиці рядами без жодного повідомлення; на `Force` і режим Graph це не впливає, бо вони виконуються всередині редактора |

Експорт зображень чекає відповіді свого воркера десять секунд і потім малює в головному потоці, а підсвічування синтаксису залишає код звичайним текстом, щойно його воркер дає збій, тож хост, який блокує воркери, втрачає продуктивність, а не функціональність.
Розміщення таблиць — виняток: рушій, що обчислює розміщення, важить більше за сам редактор і ніколи не завантажується в процес сторінки, тож під час першого розміщення воно чекає на свій воркер тридцять секунд, а щойно воркер відповів, дає кожному розміщенню шістдесят секунд на повернення результату.
Якщо час будь-якого з цих очікувань спливає, розміщення завершується так само, як і без воркера. Автоматичне розміщення показує повідомлення `Placing tables` одразу після запуску, тоді як режим Flow та імпорт, таблиці якого розміщує Flow, показують його, лише коли розміщення, включно із запуском його воркера, триває вже шість секунд.

У збірці, яку обробляє збирач, усі три генеруються як файли поруч із пакетом, тож сувора політика CSP потребує `worker-src 'self'` — і ще `blob:`, якщо ваш збирач вбудовує воркер у код.
У збірці для [тегу script](#script-tag) усі три вбудовано у файл як URL `data:`, тож такій сторінці натомість потрібен `worker-src data:`.

## Точки входу {#entry-points}

Імпорт пакета `@dineug/erd-editor` реєструє елемент `<erd-editor>` як побічний ефект. Крім того, пакет експортує тип елемента, два сетери функцій зворотного виклику, а також, починаючи з версії `3.9.2`, типові прив’язки клавіш разом з їхніми типами і, починаючи з версії `4.0.0`, типи мов інтерфейсу та тип параметрів методу `getSchemaSQL()`.

| Експорт | Опис |
| --- | --- |
| `ErdEditorElement` (тип) | Інтерфейс елемента — див. [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Замінює браузерне завантаження файлу, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Замінює браузерне вікно вибору файлу, `({ type, op, accept, mode }) => void`; поле `mode` — починаючи з версії `4.0.0`. |
| `createKeyBindingMap()` | Під час кожного виклику повертає типові прив’язки клавіш як новий об’єкт `KeyBindingMap` — див. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (типи) | Мапа прив’язок, об’єднання назв її команд і одна прив’язка. |
| `LocaleCode`, `LocaleOption` (типи) | Починаючи з версії `4.0.0`. 25 кодів мов інтерфейсу, а також ці коди разом із `'system'`, які приймає метод `setLocale()`, — див. [мова інтерфейсу](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (тип) | Починаючи з версії `4.0.0`. Параметри `statements` і `header`, які приймає метод `getSchemaSQL()`, — див. [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Модуль `@dineug/erd-editor/engine.js` — друга точка входу. Він запускає сховище документа без DOM, тож працює у Web Worker — див. [віддалене зберігання](./advanced/remote-storage.md).
Він експортує функцію `createReplicationStore` і тип `ReplicationStore`. Починаючи з версії `3.10.0`, він також експортує тип `ReplicationChange`, `{ value: string; changed: boolean }`, який отримує слухач події `change` репліки, — див. [on@change](./advanced/remote-storage.md#onchange).
Починаючи з версії `4.0.0`, сховище `ReplicationStore` також має властивість `runtimeValue`. Його властивість `value` і значення, яке передає подія `change`, — це форма зберігання, яку містить файл, так само як в елемента, — див. [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Починаючи з версії `3.9.1`, є й третя точка входу, `@dineug/erd-editor/peer.js`: учасник без інтерфейсу (headless peer), через який [MCP-сервер](../mcp/introduction.md) редагує документ. Вона існує для цього сервера, і ця документація її не описує.

### Діалогові вікна файлів {#file-dialogs}

Імпорт і експорт проходять через функції зворотного виклику, які можна підставити, тож хост без браузерного діалогового вікна файлів — наприклад, вебподання (webview) в IDE — може надати власне.
Вони несиметричні: експорт передає вам готовий файл, тоді як імпорт лише запитує файл, а вміст ви передаєте назад самі.

Поле `op` має значення `set` або `diff` — операція `diff` передається в метод `setDiffValue()` незалежно від значення `type`. В іншому разі метод вибирається за полем `type`, а поле `accept` містить розширення цього типу, готові для передавання в діалогове вікно файлів хоста.
Починаючи з версії `4.0.0`, операція `set` містить `mode: 'append'`, коли користувач вибрав [імпорт із додаванням](../guide/guides/file-import-export.md#import-and-add), і не містить `mode` для звичайного імпорту. Передавайте цей режим далі: функція зворотного виклику, яка його відкидає, замінює діаграму, яку користувач хотів доповнити.

| `type` | `accept` | Метод |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Параметр `placement: 'auto'` розміщує таблиці за їхніми зв’язками ще до того, як вони з’являться, як це робить власний імпорт редактора, і змушує виклик повертати Promise. Без нього таблиці одразу з’являються рядами — див. [setSchemaSQL](./erd-editor-element.md#setschemasql) і [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Розгалужуйте обробку за кожним значенням `type`, яке ви підтримуєте, а решту ігноруйте.
Виклик `setSchemaJSON()` у режимі заміни, як і присвоєння властивості `value`, очищає документ перед розбором, тож передавання туди даних, які не є документом `.erd.json`, — через загальну гілку `else` або тому, що туди потрапило значення `type`, додане пізніше, — спорожнює діаграму, нічого не імпортуючи.

Значення `fileName`, яке генерує редактор, — це `<database name>-<timestamp>` плюс розширення файлу, де мітка часу — це місцевий час у форматі `yyyy-MM-dd'T'HH_mm_ss`. Якщо назва бази даних порожня, замість неї використовується `unnamed`.
Функція зворотного виклику для експорту отримує такі файли. Починаючи з версії `4.0.0`, серед них є SVG і файли генератора коду, а файл `.sql` надходить не безпосередньо з пункту `Export`, а з кнопки `Save file` на вкладці схеми SQL.

| Файл | Розширення | `type` об’єкта Blob |
| --- | --- | --- |
| Експорт у JSON | `.erd.json` | `application/json` |
| Кнопка `Save file` на вкладці схеми SQL, що зберігає текст, який показує ця вкладка, — див. [схема SQL](../guide/guides/schema-sql.md) | `.sql` | немає |
| Діалогове вікно [експорту зображення](../guide/guides/file-import-export.md#image) | `.png` або `.svg` | `image/png` або `image/svg+xml` |
| Кнопка `Save file` на вкладці генератора коду — див. [генератор коду](../guide/guides/code-generator.md) | Відповідно до мови: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` або `.mmd` | немає |

Хосту, який вибирає обробник за розширенням, потрібен обробник для кожного з них.

Якщо функції зворотного виклику не задано, редактор використовує власну поведінку браузера для завантаження й вибору файлів. Передайте `null`, щоб повернутися до неї.

## Підтримка браузерів {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — базовий рівень ES2022, під який зібрано опубліковані збірки.
Поліфіли до збірок не входять. Додайте власні, якщо вам потрібно підтримувати старіші браузери.

## Оновлення з 3.x {#upgrading-from-3x}

Версія `4.0.0` — мажорний випуск. Переводячи сторінку з 3.x, перевірте кожен із цих пунктів:

- `editor.value`, значення `value` репліки й значення `value`, яке передає її подія `change`, — це форма зберігання, яку містить файл: без видалених сутностей, виміряних ширин, порядку накладання та точок прив’язки зв’язків. Як і раніше, зберігайте `value`, а ці дані читайте з `runtimeValue`; мітки часу сутностей (`meta`) прибрано повністю. Співавтора або репліку, що приєднується до активного сеансу, ініціалізуйте з `runtimeValue` активного учасника, а не з `value` чи файлу, і ніколи не зберігайте `runtimeValue` — див. [value](./erd-editor-element.md#value) і [runtimeValue](./erd-editor-element.md#runtimevalue).
- Блокування налаштувань замінюють параметри `Save Scroll Information` і `Save Zoom Information`. У новому документі й у будь-якому документі, збереженому до версії `4.0.0`, увімкнено всі блокування, тож прокручування, зміна масштабу, перемикання вкладки або зміна мови генератора коду, стилю назв чи типу лапок залишає властивість `value` без змін і не генерує подію `change`. Сторінці, яка зберігала область перегляду через подію `change`, потрібно, щоб налаштування `Viewport` (і `Canvas Type` для вкладки) було розблоковано на вкладці налаштувань, або потрібен документ, у якому поле `settings.lockSettings` залишає ці біти скинутими, — див. [блокування](../guide/guides/settings.md#lock).
- Об’єкт `settings` більше не має полів `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` чи `ignoreSaveSettings`, а константи `SaveSettingType` зникли. Поле `settings.lockSettings` з бітами `LockSettingType` замінює поле `ignoreSaveSettings`, яке версія `4.0.0` або новіша не читає й не записує, — див. [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema), яку кожен файл указує в полі `$schema`, тепер описує лише форму зберігання й є закритою: вона відхиляє файл, збережений попереднім випуском, доки збереження у версії `4.0.0` або новішій не перезапише його.
- Збирання сміття документа зникло разом із його воркером, тож видалена сутність залишається в `runtimeValue`, доки документ не буде наступного разу відкрито з його файлу. Залишилися три спільні воркери — див. [Web Workers](#web-workers).
- Тримайте кожен редактор і кожну репліку в спільному сеансі на версії `4.0.0` або новішій. Попередній випуск ігнорує нові типи дій: дії груп таблиць, зіставлення стовпців, блокувань і скриптів схеми SQL — див. [змішані випуски](./advanced/collaborative-editing.md#mixing-releases).
- Функція зворотного виклику для імпорту отримує `mode: 'append'` для імпорту з додаванням, і це значення вона має передати далі. Функція зворотного виклику для експорту тепер також отримує файли `.svg` і файли генератора коду, а пункт `Export` ▸ `Schema SQL` відкриває вкладку схеми SQL замість збереження, тож файл `.sql` надходить лише з кнопки `Save file` цієї вкладки — див. [діалогові вікна файлів](#file-dialogs).
- Клавіші `Delete` і `Backspace` прив’язано до нової команди `removeSelection`. Поки редактор має фокус поза текстовим полем, типова дія клавіші скасовується на кожній вкладці, а на вкладці ERD виділення видаляється. Типи `KeyBindingName` і `KeyBindingMap` доповнюються нею, а виклик `setKeyBindingMap({ removeSelection: [] })` залишає обидві клавіші сторінці — див. [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Поле `ThemeOptions.appearance` також приймає `'system'` — варіант `System` конструктора теми, який встановлюється під час увімкнення `systemDarkMode`. Подія `changePresetTheme` повідомляє `'system'`, поки його вибрано, тож зберігайте це значення як є й передавайте назад у `setPresetTheme`. Коли `systemDarkMode` увімкнено, виклик `setPresetTheme()` зі значенням `'light'` або `'dark'` тепер залишається в силі, а не перезаписується наступною зміною в ОС — див. [systemDarkMode](./erd-editor-element.md#systemdarkmode) і [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, розширення для VS Code версії `4.0.0` або новішої та плагіни для Obsidian і JetBrains версії `1.0.0` або новішої працюють за протоколом хаба версії 2. Сервер `1.0.0` і старіший випуск редактора, що обслуговує агентів, або старіший сервер і один із цих редакторів відхиляють одне одного з помилкою `protocolMismatch`, указуючи сторону, яку слід оновити, — див. [оновлення](../mcp/installation.md#updating).
- URL CDN без версії тепер віддає найновіший випуск 4.x. Щоб залишитися на 3.x, закріпіть версію `@3.10.0` — див. [CDN](#cdn).
