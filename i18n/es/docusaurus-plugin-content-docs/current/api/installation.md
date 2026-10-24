---
sidebar_position: 1
description: Instala @dineug/erd-editor desde npm o una CDN, monta el elemento personalizado, conecta los cuadros de diálogo de archivo y actualiza desde la 3.x.
---

# Instalación

```sh
npm install @dineug/erd-editor
```

El paquete es exclusivamente ESM (`"type": "module"`) e incluye únicamente su carpeta `dist`.
No hay compilación CommonJS, así que `require('@dineug/erd-editor')` no funciona.

Sus dependencias de tiempo de ejecución se dejan externas, como importaciones por nombre de paquete que tu bundler resuelve, deduplica y optimiza con tree shaking.
Sus workers compartidos se generan como archivos de entrada independientes en `dist/workers/` y se construyen con `new URL('./…', import.meta.url)`, la sintaxis que Vite, webpack 5 y Rspack empaquetan como punto de entrada de un worker. Consulta [Web Workers](#web-workers).
Para una página sin bundler detrás existe una segunda compilación autónoma; consulta [Etiqueta script](#script-tag).

## Uso {#usage}

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

`<erd-editor>` no tiene tamaño intrínseco. Dale (a él o a su contenedor) un ancho y un alto explícitos.
Desde la `4.1.0`, un [explorador](../guide/guides/explorer.md) abierto se acopla dentro del elemento, a la izquierda del lienzo ERD, y estrecha el lienzo en lugar de cubrirlo. Un editor nuevo empieza con él cerrado.
El panel nunca se dibuja con menos de `200px` de ancho y deja al lienzo al menos `320px`, así que en un elemento de menos de `520px` de ancho un explorador abierto no se dibuja hasta que el elemento se ensancha; consulta [Junto al lienzo](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` empieza un documento nuevo y vacío. Asignar `value`, en cambio, carga uno como una edición, de modo que queda en el historial de deshacer.
Desde la `4.0.0`, `editor.value` es el documento en la forma en que lo contiene un archivo, que es lo que hay que guardar. `editor.runtimeValue` es el documento tal como lo mantiene el editor, entidades eliminadas incluidas: sirve para inicializar un colaborador y nunca va a un archivo; consulta [runtimeValue](./erd-editor-element.md#runtimevalue).
Desde la `4.0.0`, un documento nuevo también tiene activados todos los [bloqueos de ajustes](../guide/guides/settings.md#lock): el área visible, la pestaña, el lenguaje del Generador de código, los dos estilos de nombres, el tipo de delimitador y, desde la `4.2.0`, la [vista de nombres](../guide/guides/logical-names.md#name-view). Desplazar la vista, hacer zoom, cambiar de pestaña, cambiar la vista de nombres o cambiar uno de los demás ajustes deja `editor.value` como estaba y no dispara ningún `change`. Un documento cargado desde texto conserva los bloqueos que indica. Uno que no indica ninguno, como cualquier archivo guardado antes de la `4.0.0`, se abre con todos los bloqueos activados, con el zoom al 100 % y en la pestaña ERD, sean cuales sean el área visible y la pestaña que guardó. Su área visible queda bloqueada en el origen `0, 0` y, si allí no se dibuja ninguna parte del diagrama, la vista se abre en cambio sobre el diagrama; consulta [setInitialValue](./erd-editor-element.md#setinitialvalue).
Un archivo guardado antes de la `4.2.0` se abre con la vista de nombres bloqueada en `Physical Names`, incluso uno con todos los demás bloqueos desactivados. Un editor de la `4.0.0` o la `4.1.0` conserva al guardar el bloqueo de la vista de nombres tal como está, pero descarta la vista, así que un archivo de la `4.2.0` guardado con la vista de nombres desbloqueada sigue desbloqueado, pero se vuelve a abrir en `Physical Names`.
Consulta [ErdEditorElement](./erd-editor-element.md) para el resto de la API.

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

`esm.run` resuelve por ti las dependencias externas del paquete, así que esto funciona sin bundler.
La URL sin número de versión siempre sirve la versión más reciente. Fija una versión —`https://esm.run/@dineug/erd-editor@4.2.0`— si no quieres que una actualización mayor llegue a tu página sin previo aviso.
La propia `4.0.0` es una actualización mayor: una página que tenga que seguir en la 3.x fija `@3.10.0`; consulta [Actualizar desde 3.x](#upgrading-from-3x).

### Etiqueta script {#script-tag}

Desde la `3.6.0`, el paquete también incluye una compilación UMD con todas las dependencias y todos los workers compartidos dentro de un único archivo.
Los campos `unpkg` y `jsdelivr` apuntan a ella, así que la URL del paquete a secas la sirve en cualquiera de las dos CDN; además, esta compilación define `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Al importarla, `<erd-editor>` se registra de la misma forma; `window.ErdEditor` contiene los dos callbacks de archivo, `ErdEditor.setExportFileCallback` y `ErdEditor.setImportFileCallback`, y, desde la `3.9.2`, `ErdEditor.createKeyBindingMap`. Desde la `4.2.0`, también contiene `ErdEditor.dictionaryRowChords`; consulta [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
El mapa de exportaciones del paquete sigue dirigiendo a los bundlers a los módulos ES, así que una instalación desde npm nunca usa este archivo.

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

Desde la `4.0.0`, `enable-locale-picker` añade el selector `Display Language` de la barra de herramientas y `enable-welcome-screen`, la pantalla de bienvenida que muestra un diagrama vacío; consulta [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) y [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Una página que carga un documento, como en [Uso](#usage), activa `enableWelcomeScreen` una vez que `setInitialValue()` lo ha cargado, y no en el marcado, para que la pantalla nunca aparezca fugazmente sobre un archivo que aún se está cargando.
Los 25 idiomas de la interfaz vienen dentro del paquete, tanto en la compilación ES como en la de etiqueta script, así que no hay ningún archivo de idioma que servir ni nada que registrar. Sin el selector y sin una llamada a `setLocale()`, el editor se muestra en inglés.

Añadir `readonly` aquí bloquea la edición: asignar `value`, llamar a `clear()` y todas las llamadas a `setSchema*()` —incluidas `setSchemaJSON()` y las que añaden al diagrama— se ignoran, y el evento `change` nunca se dispara. Leer `editor.value` y `editor.runtimeValue` sigue funcionando. Para cargar, usa `setInitialValue()`.

### Renderizado del lado del servidor {#server-side-rendering}

Al importar el paquete se registra el elemento personalizado en el ámbito del módulo, así que necesita un DOM y lanza una excepción en Node.
En Next.js, Nuxt, SvelteKit o Astro, impórtalo desde código que solo se ejecute en el cliente.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Al importar el paquete se fusiona `erd-editor` en `HTMLElementTagNameMap`, así que el elemento queda tipado sin necesidad de una conversión de tipo.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` se exporta para anotar tus propias variables y props.
Desde la `4.0.0`, el paquete también exporta los tipos `LocaleCode`, `LocaleOption` y `SchemaSQLOptions`; consulta [Puntos de entrada](#entry-points). Las opciones que admiten los métodos `setSchema*()` no tienen un nombre exportado; obtenlas a partir del elemento, como `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Resaltado de sintaxis {#syntax-highlighting}

Los paneles de Esquema SQL y del Generador de código los resalta [Shiki](https://shiki.style), en un worker compartido propio, y desde la `4.0.0` también los scripts `Before tables` y `After tables` de la pestaña Esquema SQL.
Desde la `3.7.0`, no hay nada que instalar ni nada que registrar: el worker se crea la primera vez que se renderiza un panel de código, así que una página que no abre ninguno nunca descarga las gramáticas.

| | |
| --- | --- |
| Lenguajes | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temas | `github-dark` y `github-light`, según la apariencia clara u oscura del editor |

Son exactamente los lenguajes que generan los paneles: `JPA` se resalta como Java; `SQLAlchemy`, como Python; `TypeORM`, `Sequelize`, `Drizzle` y `Zod`, como TypeScript; `Doctrine`, como PHP; `SeaORM`, como Rust; `JSON Schema`, como JSON, y `DBML` y `AML`, como SQL, la gramática más cercana de las incluidas; consulta [Generador de código](../guide/guides/code-generator.md).

El motor de expresiones regulares es JavaScript puro, así que ninguna política del host necesita `wasm-unsafe-eval`.
Donde falta `SharedWorker` —Chrome en Android, Safari anterior a la 16.4—, el fallo se registra y el código se muestra como texto sin formato; los scripts se pueden seguir editando.

Si actualizas desde la `3.6.0` o anterior: `@dineug/erd-editor-shiki-worker` ya no se publica y `setGetShikiServiceCallback` ha desaparecido con él.
Quita la instalación y el registro; una página que cargaba el worker desde una CDN quita también esa segunda etiqueta `<script>`.

## Web Workers {#web-workers}

El editor ejecuta tres tareas en `SharedWorker`: el resaltado de sintaxis, la exportación de imagen y la disposición de tablas en la que se basan la [disposición automática](../guide/guides/table-related-functions.md#auto-layout), el [modo Flow](../guide/guides/visualization.md#how-flow-is-placed) de la pestaña Visualización y, desde la `4.0.0`, la colocación de un esquema importado.
Los tres vienen dentro de `@dineug/erd-editor`. Ninguno requiere configuración por tu parte, pero un host puede bloquear cualquiera de ellos.
El worker que ejecutaba la recolección de elementos no utilizados del documento se eliminó en la `4.0.0`, junto con la propia recolección.

| Worker | Sin él |
| --- | --- |
| Resaltado de sintaxis | Los paneles de Esquema SQL y del Generador de código y los scripts de Esquema SQL se quedan en texto sin formato |
| Exportación de imagen | El PNG, el SVG, `Copy to clipboard` y la vista previa del cuadro de diálogo `Export image` se dibujan en el hilo principal, lo que bloquea la página mientras se dibujan |
| Disposición de tablas | Las disposiciones `Flow`, `Tree - vertical` y `Tree - horizontal` de la disposición automática y el modo Flow de la pestaña Visualización terminan en `Could not place tables`; una importación colocada por Flow —un archivo SQL, GraphQL, DBML o AML desde `Import` o `Import and Add`, o una llamada a `setSchema*()` con `placement: 'auto'`— coloca sus tablas en filas, sin ningún mensaje; `Force` y el modo Graph no se ven afectados, ya que se ejecutan dentro del editor |

La exportación de imagen espera diez segundos a que responda su worker y después dibuja en el hilo principal, y el resaltado de sintaxis deja el código como texto sin formato en cuanto su worker falla, así que un host que bloquea los workers cuesta rendimiento, no funcionalidad.
La disposición de tablas es la excepción: el motor que calcula una disposición pesa más que el propio editor y nunca se carga en el mismo proceso, así que espera treinta segundos a su worker en la primera colocación y, una vez que el worker ha respondido, da sesenta segundos a cada disposición para completarse.
Si se agota cualquiera de las dos esperas, la colocación termina igual que sin el worker. La disposición automática muestra `Placing tables` en cuanto empieza, mientras que el modo Flow y una importación colocada por Flow solo lo muestran cuando una colocación, incluido el arranque de su worker, lleva seis segundos en curso.

En la compilación empaquetada, los tres se generan como archivos junto al paquete, así que una CSP estricta necesita `worker-src 'self'`, más `blob:` donde tu bundler incruste un worker en línea.
En la compilación de [etiqueta script](#script-tag), los tres viajan dentro del archivo como URL `data:`, así que esa página necesita `worker-src data:` en su lugar.

## Puntos de entrada {#entry-points}

Importar `@dineug/erd-editor` registra `<erd-editor>` como efecto secundario. Aparte de eso, exporta el tipo del elemento, dos setters de callbacks, desde la `3.9.2` las combinaciones de teclas predeterminadas con sus tipos, desde la `4.0.0` los tipos del idioma de la interfaz y el tipo de las opciones de `getSchemaSQL()` y, desde la `4.2.0`, las combinaciones de teclas de filas de la pestaña Diccionario.

| Exportación | Descripción |
| --- | --- |
| `ErdEditorElement` (tipo) | La interfaz del elemento; consulta [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Sustituye la descarga del navegador, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Sustituye el selector de archivos del navegador, `({ type, op, accept, mode }) => void`; `mode` desde la `4.0.0`. Desde la `4.2.0`, la herramienta `Import CSV` de la pestaña Diccionario abre el selector del navegador aunque haya un callback establecido; consulta [Cuadros de diálogo de archivo](#file-dialogs). |
| `createKeyBindingMap()` | Devuelve las combinaciones de teclas predeterminadas como un nuevo `KeyBindingMap` en cada llamada; consulta [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipos) | Un mapa de combinaciones, la unión de sus nombres de comando y una combinación. |
| `dictionaryRowChords(map)` | Desde la `4.2.0`. Devuelve, como un nuevo `ShortcutOption[]` en cada llamada, las combinaciones con las que la cuadrícula de la pestaña [Diccionario](../guide/guides/dictionary.md#adding-and-deleting-rows) inserta y elimina filas según el `KeyBindingMap` que le pases. La que inserta filas encima, `Alt+Shift+Enter` con los valores predeterminados, no forma parte de ninguna asignación; consulta [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipos) | Desde la `4.0.0`. Los 25 códigos de idioma de la interfaz, y esos códigos más `'system'`, que es lo que admite `setLocale()`; consulta [Idioma de la interfaz](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | Desde la `4.0.0`. Las opciones que admite `getSchemaSQL()`: `statements`, `header` y, desde la `4.2.0`, `logicalNameAsComment`; consulta [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` es un segundo punto de entrada. Ejecuta el almacén del documento sin DOM, así que funciona en un Web Worker; consulta [Almacenamiento remoto](./advanced/remote-storage.md).
Exporta `createReplicationStore` y el tipo `ReplicationStore`. Desde la `3.10.0`, también exporta el tipo `ReplicationChange`, `{ value: string; changed: boolean }`, que recibe el listener de `change` de una réplica; consulta [on@change](./advanced/remote-storage.md#onchange).
Desde la `4.0.0`, un `ReplicationStore` también tiene un `runtimeValue`. Su `value` y el que entrega un `change` son la forma de almacenamiento que se guarda en un archivo, como los del elemento; consulta [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Desde la `3.9.1`, hay un tercero, `@dineug/erd-editor/peer.js`: el par headless a través del cual el [servidor MCP](../mcp/introduction.md) edita un documento. Existe para ese servidor, y estas páginas no lo documentan.

### Cuadros de diálogo de archivo {#file-dialogs}

La importación y la exportación pasan por callbacks inyectables, así que un host sin cuadro de diálogo de archivo del navegador —un webview de un IDE, por ejemplo— puede aportar el suyo.
Las dos operaciones no son simétricas: la exportación te entrega el archivo terminado, mientras que la importación solo pide uno, y eres tú quien vuelve a introducir el contenido.
Desde la `4.2.0`, la herramienta `Import CSV` de la pestaña Diccionario es la única importación que nunca llama al callback de importación, cuyo `type` no tiene ningún valor para CSV. Siempre abre el selector de archivos propio del navegador, para archivos `.csv`; consulta [Importar y exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` es `set` o `diff`; un `diff` va a `setDiffValue()`, sea cual sea el `type`. En caso contrario, `type` elige el método y `accept` lleva las extensiones de ese tipo, listas para pasarlas a un cuadro de diálogo de archivo del host.
Desde la `4.0.0`, un `set` lleva `mode: 'append'` cuando el usuario ha elegido [Importar y añadir](../guide/guides/file-import-export.md#import-and-add), y ningún `mode` en una importación normal. Transmítelo: un callback que lo descarte sustituye el diagrama al que el usuario pidió añadir.

| `type` | `accept` | Método |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` dispone las tablas según sus relaciones antes de colocarlas, como hace la importación del propio editor, y hace que la llamada devuelva una promesa. Sin él, se colocan en filas de inmediato; consulta [setSchemaSQL](./erd-editor-element.md#setschemasql) y [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Trata de forma explícita cada `type` que gestiones e ignora el resto.
Un `setSchemaJSON()` que sustituye el diagrama, como asignar `value`, borra el documento antes de analizar el contenido, así que enviarle algo que no sea un documento `.erd.json` —a través de un `else` que lo recoja todo o porque un `type` añadido más adelante acabó llegando ahí— vacía el diagrama en lugar de importar nada.

El `fileName` que genera el editor es `<database name>-<timestamp>` más la extensión del archivo, donde la marca de tiempo es la hora local con el formato `yyyy-MM-dd'T'HH_mm_ss`. Si el nombre de la base de datos está vacío, se usa `unnamed`. Un CSV del diccionario indica su hoja antes de la extensión, como en `<database name>-<timestamp>-words.csv`.
El callback de exportación recibe estos archivos. Desde la `4.0.0`, el SVG y los archivos del Generador de código están entre ellos, y el `.sql` procede del botón `Save file` de la pestaña Esquema SQL y no directamente de `Export`. Desde la `4.2.0`, el CSV de la pestaña Diccionario también está entre ellos.

| Archivo | Extensión | `type` del Blob |
| --- | --- | --- |
| La exportación JSON | `.erd.json` | `application/json` |
| El botón `Save file` de la pestaña Esquema SQL, con el texto que muestra la pestaña; consulta [Esquema SQL](../guide/guides/schema-sql.md) | `.sql` | ninguno |
| El cuadro de diálogo [Exportar imagen](../guide/guides/file-import-export.md#image) | `.png` o `.svg` | `image/png` o `image/svg+xml` |
| El botón `Save file` de la pestaña Generador de código; consulta [Generador de código](../guide/guides/code-generator.md) | La del lenguaje: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` o `.mmd` | ninguno |
| La herramienta `Export CSV` de la pestaña Diccionario, con todas las filas de la hoja que se muestra, liste lo que liste su búsqueda; consulta [Importar y exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Un host que elige un controlador según la extensión necesita uno para cada uno de ellos.

Si no se establecen, el editor usa el comportamiento propio del navegador para la descarga y el selector de archivos. Pasa `null` para volver a él.

## Compatibilidad con navegadores {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+: la base de referencia ES2022 para la que se compilan los bundles publicados.
No se incluye ningún polyfill. Añade los tuyos si necesitas llegar a navegadores más antiguos.

## Actualizar desde 3.x {#upgrading-from-3x}

La `4.0.0` es una versión mayor. Comprueba cada uno de estos puntos al migrar una página desde la 3.x:

- `editor.value`, el `value` de una réplica y el `value` que entrega su `change` son la forma de almacenamiento que se guarda en un archivo: sin entidades eliminadas, anchos medidos, orden de apilamiento ni anclajes de relaciones. Sigue guardando `value` y lee esos datos de `runtimeValue`; las marcas de tiempo de las entidades (`meta`) han desaparecido por completo. Inicializa un colaborador o una réplica que se una a una sesión en curso a partir del `runtimeValue` de un par en ejecución, no de `value` ni del archivo, y nunca guardes `runtimeValue`; consulta [value](./erd-editor-element.md#value) y [runtimeValue](./erd-editor-element.md#runtimevalue).
- Los bloqueos de ajustes sustituyen a `Save Scroll Information` y `Save Zoom Information`. Un documento nuevo, y cualquier documento guardado antes de la `4.0.0`, tiene todos los bloqueos activados, así que un desplazamiento, un zoom, un cambio de pestaña o un cambio del lenguaje del Generador de código, de un estilo de nombres o del tipo de delimitador deja `value` como estaba y no dispara ningún `change`. Una página que conservaba la vista mediante `change` necesita `Viewport` (y `Canvas Type` para la pestaña) desbloqueados en la pestaña Configuración, o un documento cuyo `settings.lockSettings` deje esos bits a cero; consulta [Bloqueo](../guide/guides/settings.md#lock).
- `settings` ya no tiene `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ni `ignoreSaveSettings`, y las constantes `SaveSettingType` han desaparecido. `settings.lockSettings`, con los bits de `LockSettingType`, ocupa el lugar de `ignoreSaveSettings`, que la `4.0.0` o posterior no lee ni escribe; consulta [Ajustes](./advanced/schema.md#settings).
- El [JSON Schema](./advanced/schema.md#json-schema) que cada archivo indica en `$schema` ahora describe solo la forma de almacenamiento y es cerrado: rechaza un archivo guardado por una versión anterior hasta que lo reescriba un guardado con la `4.0.0` o posterior.
- La recolección de elementos no utilizados del documento ha desaparecido con su worker, así que una entidad eliminada permanece en `runtimeValue` hasta la próxima vez que se abra el documento desde su archivo. Quedan tres workers compartidos; consulta [Web Workers](#web-workers).
- Mantén todos los editores y réplicas de una sesión compartida en la `4.0.0` o posterior. Una versión anterior ignora los nuevos tipos de acción: los de los grupos de tablas, Asignar columnas, los bloqueos y los scripts de Esquema SQL; consulta [Mezclar versiones](./advanced/collaborative-editing.md#mixing-releases).
- El callback de importación recibe `mode: 'append'` con Importar y añadir, y el callback tiene que transmitirlo. El callback de exportación ahora también recibe archivos `.svg` y del Generador de código, y `Export` ▸ `Schema SQL` abre la pestaña Esquema SQL en lugar de guardar, así que el `.sql` solo llega desde el botón `Save file` de esa pestaña; consulta [Cuadros de diálogo de archivo](#file-dialogs).
- `Delete` y `Backspace` corresponden a la nueva asignación `removeSelection`. Mientras el editor tiene el foco fuera de un campo de texto, se cancela la acción predeterminada de la tecla en todas las pestañas, y en la pestaña ERD se elimina la selección. `KeyBindingName` y `KeyBindingMap` la incorporan, y `setKeyBindingMap({ removeSelection: [] })` deja ambas teclas a la página; consulta [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` también admite `'system'`, el `System` del generador de temas, que se establece al activar `systemDarkMode`. `changePresetTheme` informa de `'system'` mientras está elegido, así que guárdalo tal cual y devuélveselo a `setPresetTheme`. Con `systemDarkMode` activado, un `setPresetTheme()` con `'light'` o `'dark'` ahora se mantiene en lugar de quedar sobrescrito por el siguiente cambio del sistema operativo; consulta [systemDarkMode](./erd-editor-element.md#systemdarkmode) y [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` o posterior, la extensión de VS Code `4.0.0` o posterior y los plugins de Obsidian y JetBrains `1.0.0` o posterior usan la versión 2 del protocolo del hub. El servidor `1.0.0` o posterior y una versión anterior del editor que da servicio a agentes, o un servidor anterior y uno de estos editores, se rechazan mutuamente con `protocolMismatch`, indicando qué lado hay que actualizar; consulta [Actualizar](../mcp/installation.md#updating).
- Una URL de CDN sin versión ahora sirve la última versión 4.x. Fija `@3.10.0` para quedarte en la 3.x; consulta [CDN](#cdn).
