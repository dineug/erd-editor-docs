---
sidebar_position: 1
description: Установка @dineug/erd-editor из npm или с CDN, добавление пользовательского элемента на страницу, подключение диалоговых окон выбора файлов и переход с версии 3.x.
---

# Установка

```sh
npm install @dineug/erd-editor
```

Пакет распространяется только в формате ESM (`"type": "module"`) и включает лишь папку `dist`.
Сборки CommonJS нет, поэтому вызов `require('@dineug/erd-editor')` не работает.

Зависимости времени выполнения оставлены внешними, в виде импортов по имени пакета, которые сборщик разрешает, дедуплицирует и очищает от неиспользуемого кода.
Общие воркеры пакета выводятся отдельными файлами точек входа в папке `dist/workers/` и создаются через `new URL('./…', import.meta.url)` — в той форме записи, которую Vite, webpack 5 и Rspack собирают как точку входа воркера. См. [Web Worker](#web-workers).
Для страницы без сборщика есть вторая, самодостаточная сборка — см. [Тег script](#script-tag).

## Использование {#usage}

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

У элемента `<erd-editor>` нет собственного размера. Задайте ему (или его контейнеру) явные ширину и высоту.
Начиная с версии `4.1.0` открытый [Обозреватель](../guide/guides/explorer.md) закрепляется внутри элемента слева от холста ERD и сужает холст, а не перекрывает его. В новом редакторе он изначально закрыт.
Панель отрисовывается шириной не менее `200px` и оставляет холсту не менее `320px`, поэтому в элементе шириной менее `520px` открытый Обозреватель не отрисовывается, пока элемент не станет шире, — см. [Рядом с холстом](../guide/guides/explorer.md#beside-the-canvas).

Вызов `setInitialValue('')` создает новый пустой документ. Присваивание значения свойству `value`, напротив, загружает документ как правку, поэтому она попадает в историю изменений.
Начиная с версии `4.0.0` свойство `editor.value` содержит документ в той форме, в которой его хранит файл, — именно его и нужно сохранять. Свойство `editor.runtimeValue` содержит документ в том виде, в каком его держит редактор, включая удаленные сущности: оно служит для инициализации соавтора и никогда не попадает в файл — см. [runtimeValue](./erd-editor-element.md#runtimevalue).
Начиная с версии `4.0.0` в новом документе также включены все [блокировки настроек](../guide/guides/settings.md#lock): область просмотра, вкладка, язык Генератора кода, оба стиля имен и тип кавычек. Прокрутка, масштабирование, переключение вкладок или изменение одной из этих настроек оставляют свойство `editor.value` прежним, и событие `change` не возникает. Документ, загруженный из текста, сохраняет указанные в нем блокировки. Документ, в котором блокировки не указаны, например любой файл, сохраненный до версии `4.0.0`, открывается со всеми включенными блокировками, с масштабом 100% и на вкладке ERD, какие бы вид и вкладку он ни сохранил. Его вид заблокирован в начале координат `0, 0`, а если там не отрисовано ничего из диаграммы, вид вместо этого открывается на диаграмме — см. [setInitialValue](./erd-editor-element.md#setinitialvalue).
Об остальном API см. [ErdEditorElement](./erd-editor-element.md).

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

Сервис `esm.run` сам разрешает внешние зависимости пакета, поэтому такой вариант работает без сборщика.
URL без версии всегда отдает последнюю версию. Закрепите версию — `https://esm.run/@dineug/erd-editor@4.1.0`, — если не хотите, чтобы новая мажорная версия попала на страницу без предупреждения.
Версия `4.0.0` — как раз такая: страница, которой нужно остаться на 3.x, закрепляет версию `@3.10.0` — см. [Переход с версии 3.x](#upgrading-from-3x).

### Тег script {#script-tag}

Начиная с версии `3.6.0` пакет также содержит UMD-сборку, в которой все зависимости и все общие воркеры находятся внутри одного файла.
Именно на нее указывают поля `unpkg` и `jsdelivr`, поэтому на любой из этих двух CDN ее отдает URL с одним лишь именем пакета, и она определяет `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Подключение этой сборки точно так же регистрирует элемент `<erd-editor>`; объект `window.ErdEditor` содержит два файловых колбэка, `ErdEditor.setExportFileCallback` и `ErdEditor.setImportFileCallback`, а начиная с версии `3.9.2` — и `ErdEditor.createKeyBindingMap`.
Карта экспортов пакета по-прежнему направляет сборщик к ES-модулям, поэтому установка из npm никогда не подхватывает этот файл.

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

Начиная с версии `4.0.0` атрибут `enable-locale-picker` добавляет на панель инструментов окно выбора `Display Language`, а атрибут `enable-welcome-screen` — экран приветствия, который показывается на пустой диаграмме, — см. [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) и [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Страница, которая загружает документ, как в разделе [Использование](#usage), включает свойство `enableWelcomeScreen` не в разметке, а после того как метод `setInitialValue()` загрузит документ, поэтому экран никогда не мелькает поверх файла, который еще загружается.
Все 25 языков интерфейса входят в пакет, причем как в ES-сборку, так и в сборку для тега script, поэтому не нужно ни отдавать файлы локалей с сервера, ни что-либо регистрировать. Без окна выбора и без вызова `setLocale()` редактор отображается на английском языке.

Если добавить сюда атрибут `readonly`, редактирование блокируется: присваивание значения свойству `value`, вызов `clear()` и любые вызовы `setSchema*()` — в том числе `setSchemaJSON()` и вызовы с добавлением — игнорируются, а событие `change` никогда не возникает. Чтение `editor.value` и `editor.runtimeValue` по-прежнему работает. Вместо этого загружайте документ через `setInitialValue()`.

### Серверный рендеринг {#server-side-rendering}

Импорт пакета регистрирует пользовательский элемент на уровне модуля, поэтому для него нужен DOM, а в Node он выбрасывает исключение.
В Next.js, Nuxt, SvelteKit или Astro загружайте пакет из кода, который выполняется только на клиенте.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Импорт пакета добавляет `erd-editor` в `HTMLElementTagNameMap`, поэтому элемент типизирован без приведения типа.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Тип `ErdEditorElement` экспортируется для аннотирования собственных переменных и пропсов.
Начиная с версии `4.0.0` пакет также экспортирует типы `LocaleCode`, `LocaleOption` и `SchemaSQLOptions` — см. [Точки входа](#entry-points). У параметров, которые принимают методы `setSchema*()`, нет экспортируемого имени; получайте их из типа элемента в виде `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Подсветка синтаксиса {#syntax-highlighting}

Панели Схемы SQL и Генератора кода подсвечивает [Shiki](https://shiki.style) в собственном общем воркере, а начиная с версии `4.0.0` — и скрипты `Before tables` и `After tables` на вкладке «Схема SQL».
Начиная с версии `3.7.0` ничего не нужно ни устанавливать, ни регистрировать: воркер создается при первой отрисовке панели с кодом, поэтому страница, которая не открывает ни одной такой панели, никогда не загружает грамматики.

| | |
| --- | --- |
| Языки | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Темы | `github-dark` и `github-light` в зависимости от светлого или темного оформления редактора |

Это ровно те языки, которые выводят панели: `JPA` подсвечивается как Java, `SQLAlchemy` — как Python, `TypeORM`, `Sequelize`, `Drizzle` и `Zod` — как TypeScript, `Doctrine` — как PHP, `SeaORM` — как Rust, `JSON Schema` — как JSON, а `DBML` и `AML` — как SQL, самая близкая к ним грамматика в комплекте, — см. [Генератор кода](../guide/guides/code-generator.md).

Движок регулярных выражений написан на чистом JavaScript, поэтому политике хоста не требуется разрешение `wasm-unsafe-eval`.
Там, где `SharedWorker` отсутствует, — в Chrome для Android и в Safari до версии 16.4 — сбой записывается в журнал, а код отображается обычным текстом; скрипты по-прежнему можно редактировать.

При переходе с версии `3.6.0` или более ранней: пакет `@dineug/erd-editor-shiki-worker` больше не публикуется, и вместе с ним исчезла функция `setGetShikiServiceCallback`.
Уберите установку пакета и регистрацию, а со страницы, которая загружала воркер с CDN, также уберите второй тег `<script>`.

## Web Worker {#web-workers}

Редактор выполняет три задачи в воркерах `SharedWorker`: подсветку синтаксиса, экспорт изображения и размещение таблиц, на котором основаны [Автоматическое размещение](../guide/guides/table-related-functions.md#auto-layout), [режим Flow](../guide/guides/visualization.md#how-flow-is-placed) на вкладке «Визуализация» и начиная с версии `4.0.0` размещение импортированной схемы.
Все три воркера входят в пакет `@dineug/erd-editor`. Ни один из них не требует настройки, но любой из них может быть заблокирован хостом.
Воркер, который выполнял сборку мусора документа, удален в версии `4.0.0` вместе с самой сборкой мусора.

| Воркер | Без него |
| --- | --- |
| Подсветка синтаксиса | Панели Схемы SQL и Генератора кода, а также скрипты Схемы SQL остаются обычным текстом |
| Экспорт изображения | PNG, SVG, `Copy to clipboard` и предварительный просмотр в окне `Export image` отрисовываются в основном потоке, что блокирует страницу на время отрисовки |
| Размещение таблиц | Варианты размещения `Flow`, `Tree - vertical` и `Tree - horizontal` в Автоматическом размещении, а также режим Flow на вкладке «Визуализация» завершаются сообщением `Could not place tables`; импорт, размещаемый с помощью Flow, — файл SQL, GraphQL, DBML или AML из пункта `Import` или `Import and Add` либо вызов `setSchema*()` с параметром `placement: 'auto'` — располагает свои таблицы рядами без какого-либо сообщения; `Force` и режим Graph это не затрагивает, так как они выполняются внутри редактора |

Экспорт изображения ждет ответа своего воркера десять секунд и затем рисует в основном потоке, а подсветка синтаксиса оставляет код обычным текстом, как только ее воркер дает сбой, поэтому, если хост блокирует воркеры, теряется производительность, а не функциональность.
Исключение — размещение таблиц: движок, который вычисляет размещение, весит больше самого редактора и никогда не загружается в процесс страницы, поэтому при первом размещении эта задача ждет свой воркер тридцать секунд, а после того как воркер ответил, отводит размещению шестьдесят секунд на возврат результата.
Если время любого из этих ожиданий истекает, размещение завершается так же, как без воркера. Автоматическое размещение показывает `Placing tables` сразу после запуска, а режим Flow и импорт, размещаемый с помощью Flow, показывают его, только когда размещение, включая запуск воркера, длится уже шесть секунд.

В варианте со сборщиком все три выводятся отдельными файлами рядом с пакетом, поэтому строгой политике CSP нужна директива `worker-src 'self'` — плюс `blob:`, если сборщик встраивает воркер в код.
В сборке для [тега script](#script-tag) все три находятся внутри файла в виде URL `data:`, поэтому такой странице вместо этого нужна директива `worker-src data:`.

## Точки входа {#entry-points}

Импорт `@dineug/erd-editor` регистрирует элемент `<erd-editor>` в качестве побочного эффекта. Кроме того, пакет экспортирует тип элемента, два сеттера колбэков, начиная с версии `3.9.2` — привязки клавиш по умолчанию с их типами, а начиная с версии `4.0.0` — типы языка интерфейса и тип параметров `getSchemaSQL()`.

| Экспорт | Описание |
| --- | --- |
| `ErdEditorElement` (тип) | Интерфейс элемента — см. [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Заменяет скачивание файла браузером, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Заменяет окно выбора файла браузера, `({ type, op, accept, mode }) => void`; `mode` — начиная с версии `4.0.0`. |
| `createKeyBindingMap()` | При каждом вызове возвращает привязки клавиш по умолчанию в виде нового объекта `KeyBindingMap` — см. [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (типы) | Карта привязок, тип-объединение имен ее команд и одна привязка. |
| `LocaleCode`, `LocaleOption` (типы) | Начиная с версии `4.0.0`. Коды 25 языков интерфейса, а также эти коды вместе со значением `'system'`, которые принимает метод `setLocale()`, — см. [Язык интерфейса](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (тип) | Начиная с версии `4.0.0`. Параметры `statements` и `header`, которые принимает метод `getSchemaSQL()`, — см. [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Вторая точка входа — `@dineug/erd-editor/engine.js`. Она запускает хранилище документа без DOM, поэтому работает в Web Worker — см. [Удаленное хранение](./advanced/remote-storage.md).
Она экспортирует `createReplicationStore` и тип `ReplicationStore`. Начиная с версии `3.10.0` она также экспортирует тип `ReplicationChange`, `{ value: string; changed: boolean }`, который получает обработчик события `change` реплики, — см. [on@change](./advanced/remote-storage.md#onchange).
Начиная с версии `4.0.0` у `ReplicationStore` также есть свойство `runtimeValue`. Как и у элемента, его свойство `value` и значение, которое передает событие `change`, имеют форму хранения, как в файле, — см. [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Начиная с версии `3.9.1` есть и третья — `@dineug/erd-editor/peer.js`: участник без интерфейса, через которого [MCP-сервер](../mcp/introduction.md) редактирует документ. Она существует для этого сервера, и на этих страницах она не описывается.

### Диалоговые окна выбора файлов {#file-dialogs}

Импорт и экспорт проходят через подключаемые колбэки, поэтому хост без браузерного окна выбора файла — например, webview в IDE — может предоставить собственное.
Эти колбэки несимметричны: экспорт передает вам готовый файл, а импорт лишь запрашивает его, и содержимое в редактор вы загружаете сами.

Поле `op` принимает значение `set` или `diff` — запрос `diff` передается в `setDiffValue()`, каким бы ни было поле `type`. В остальных случаях поле `type` определяет метод, а поле `accept` содержит расширения этого типа, готовые для передачи окну выбора файла хоста.
Начиная с версии `4.0.0` запрос `set` содержит `mode: 'append'`, если пользователь выбрал [Импорт с добавлением](../guide/guides/file-import-export.md#import-and-add), и не содержит `mode` при обычном Импорте. Передавайте его дальше: колбэк, который его отбрасывает, заменяет диаграмму, в которую пользователь хотел добавить содержимое.

| `type` | `accept` | Метод |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Параметр `placement: 'auto'` располагает таблицы по их связям до того, как они появятся на холсте, как это делает собственный Импорт редактора, и заставляет вызов возвращать Promise. Без него таблицы сразу появляются рядами — см. [setSchemaSQL](./erd-editor-element.md#setschemasql) и [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Предусмотрите отдельную ветку для каждого обрабатываемого значения `type`, а остальные игнорируйте.
Замещающий вызов `setSchemaJSON()`, как и присваивание значения свойству `value`, очищает документ перед разбором, поэтому передача туда данных, не являющихся документом `.erd.json`, — через универсальную ветку `else` или потому, что добавленный позже `type` не нашел своей ветки, — оставляет диаграмму пустой вместо того, чтобы что-либо импортировать.

Имя файла `fileName`, которое генерирует редактор, имеет вид `<database name>-<timestamp>` с добавленным расширением файла, где метка времени — это локальное время в формате `yyyy-MM-dd'T'HH_mm_ss`. Если имя базы данных пустое, используется значение `unnamed`.
Колбэк экспорта получает следующие файлы. Начиная с версии `4.0.0` среди них есть SVG и файлы Генератора кода, а файл `.sql` поступает от кнопки `Save file` на вкладке «Схема SQL», а не напрямую из меню `Export`.

| Файл | Расширение | `type` объекта Blob |
| --- | --- | --- |
| Экспорт JSON | `.erd.json` | `application/json` |
| Кнопка `Save file` на вкладке «Схема SQL», сохраняющая отображаемый на вкладке текст, — см. [Схема SQL](../guide/guides/schema-sql.md) | `.sql` | нет |
| Окно [«Экспорт изображения»](../guide/guides/file-import-export.md#image) | `.png` или `.svg` | `image/png` или `image/svg+xml` |
| Кнопка `Save file` на вкладке «Генератор кода» — см. [Генератор кода](../guide/guides/code-generator.md) | Расширение языка: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` или `.mmd` | нет |

Хосту, который выбирает обработчик по расширению, нужен обработчик для каждого из них.

Если колбэки не заданы, редактор использует стандартное поведение браузера для скачивания и выбора файлов. Чтобы вернуться к нему, передайте `null`.

## Поддержка браузеров {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — базовый уровень ES2022, на который рассчитаны опубликованные сборки.
Полифилы в сборку не входят. Если нужна поддержка более старых браузеров, добавьте собственные.

## Переход с версии 3.x {#upgrading-from-3x}

Версия `4.0.0` — мажорная. При переводе страницы с 3.x проверьте каждый из следующих пунктов:

- Свойство `editor.value`, свойство `value` реплики и значение `value`, которое передает ее событие `change`, имеют форму хранения, как в файле: без удаленных сущностей, измеренных ширин, порядка наложения и точек привязки связей. Продолжайте сохранять `value`, а эти данные читайте из `runtimeValue`; метки времени сущностей (`meta`) удалены полностью. Инициализируйте соавтора или реплику, которые подключаются к уже идущему сеансу, из `runtimeValue` работающего участника, а не из `value` или файла, и никогда не сохраняйте `runtimeValue` — см. [value](./erd-editor-element.md#value) и [runtimeValue](./erd-editor-element.md#runtimevalue).
- Блокировки настроек заменяют `Save Scroll Information` и `Save Zoom Information`. В новом документе и в любом документе, сохраненном до версии `4.0.0`, включены все блокировки, поэтому прокрутка, масштабирование, переключение вкладки или изменение языка Генератора кода, стиля имен либо типа кавычек оставляют свойство `value` прежним, и событие `change` не возникает. Странице, которая сохраняла вид через событие `change`, нужно разблокировать строку `Viewport` (и `Canvas Type` для вкладки) на вкладке «Настройки» либо использовать документ, в котором поле `settings.lockSettings` оставляет эти биты сброшенными, — см. [Блокировка](../guide/guides/settings.md#lock).
- В объекте `settings` больше нет полей `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` и `ignoreSaveSettings`, а константы `SaveSettingType` удалены. Поле `settings.lockSettings` с битами `LockSettingType` заменяет поле `ignoreSaveSettings`, которое версии `4.0.0` или новее не читают и не записывают, — см. [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema), которую каждый файл указывает в поле `$schema`, теперь описывает только форму хранения и является закрытой: она отклоняет файл, сохраненный более ранней версией, пока его не перезапишет сохранение в версии `4.0.0` или новее.
- Сборка мусора документа удалена вместе с ее воркером, поэтому удаленная сущность остается в `runtimeValue` до следующего открытия документа из файла. Остаются три общих воркера — см. [Web Worker](#web-workers).
- Держите все редакторы и реплики в общем сеансе на версии `4.0.0` или новее. Более ранняя версия игнорирует новые типы действий: действия групп таблиц, окна «Сопоставить столбцы», блокировок и скриптов Схемы SQL — см. [Разные версии в одном сеансе](./advanced/collaborative-editing.md#mixing-releases).
- Колбэк импорта получает `mode: 'append'` для Импорта с добавлением, и колбэк должен передать его дальше. Колбэк экспорта теперь также получает файлы `.svg` и файлы Генератора кода, а `Export` ▸ `Schema SQL` открывает вкладку «Схема SQL» вместо сохранения, поэтому файл `.sql` поступает только от кнопки `Save file` на этой вкладке — см. [Диалоговые окна выбора файлов](#file-dialogs).
- Клавиши `Delete` и `Backspace` привязаны к новой команде `removeSelection`. Пока фокус находится в редакторе вне текстового поля, стандартное действие клавиши подавляется на всех вкладках, а на вкладке ERD выделение удаляется. Команда добавлена в `KeyBindingName` и `KeyBindingMap`, а вызов `setKeyBindingMap({ removeSelection: [] })` оставляет обе клавиши странице — см. [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Свойство `ThemeOptions.appearance` также принимает `'system'` — вариант `System` конструктора темы, который устанавливается при включении `systemDarkMode`. Событие `changePresetTheme` сообщает `'system'`, пока выбран этот вариант, поэтому сохраняйте значение как есть и передавайте его обратно в `setPresetTheme`. При включенном `systemDarkMode` вызов `setPresetTheme()` со значением `'light'` или `'dark'` теперь остается в силе, а не перезаписывается следующим изменением в ОС — см. [systemDarkMode](./erd-editor-element.md#systemdarkmode) и [changePresetTheme](./erd-editor-element.md#changepresettheme).
- Пакет `@dineug/erd-editor-mcp` версии `1.0.0`, расширение VS Code версии `4.0.0` или новее и плагины для Obsidian и JetBrains версии `1.0.0` или новее используют протокол хаба версии 2. Сервер версии `1.0.0` и более ранняя версия редактора, обслуживающая агентов, либо более ранний сервер и один из этих редакторов отклоняют друг друга с ошибкой `protocolMismatch`, указывая, какую сторону нужно обновить, — см. [Обновление](../mcp/installation.md#updating).
- URL CDN без версии теперь отдает последнюю версию 4.x. Чтобы остаться на 3.x, закрепите версию `@3.10.0` — см. [CDN](#cdn).
