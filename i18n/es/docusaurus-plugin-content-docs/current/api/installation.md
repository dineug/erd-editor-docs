---
sidebar_position: 1
description: Instala @dineug/erd-editor desde npm o una CDN, registra los elementos del editor y del visor, conecta los cuadros de diálogo de archivo y actualiza desde la 4.x o la 3.x.
---

# Instalación

```sh
npm install @dineug/erd-editor
```

El paquete es exclusivamente ESM (`"type": "module"`) e incluye únicamente su carpeta `dist`.
No hay compilación CommonJS, así que `require('@dineug/erd-editor')` no funciona.

Contiene dos elementos personalizados: `<erd-editor>`, el editor, y, desde la `5.0.0`, `<erd-viewer>`, que muestra un diagrama en solo lectura; consulta [ErdViewerElement](./erd-viewer-element.md).
Desde la `5.0.0`, importar la raíz del paquete no define ninguno de los dos. Cada elemento tiene una entrada propia que lo define; consulta [Registro de los elementos](#registering-the-elements).

Sus dependencias de tiempo de ejecución se dejan externas, como importaciones por nombre de paquete que tu bundler resuelve, deduplica y optimiza con tree shaking. Desde la `5.0.0`, su `dist` contiene un archivo por módulo, así que un bundler conserva solo los módulos a los que llega una página; consulta [Puntos de entrada](#entry-points).
Sus workers compartidos se generan como archivos de entrada independientes en `dist/workers/` y se construyen con `new URL('./…', import.meta.url)`, la sintaxis que Vite, webpack 5 y Rspack empaquetan como punto de entrada de un worker. Consulta [Web Workers](#web-workers).
Para una página sin bundler detrás existen dos compilaciones autónomas; consulta [Etiqueta script](#script-tag).

## Uso {#usage}

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

`@dineug/erd-editor/erd-editor.js` define `<erd-editor>` en cuanto se importa. Una página que solo muestra un diagrama importa en su lugar `@dineug/erd-editor/erd-viewer.js`; consulta [ErdViewerElement](./erd-viewer-element.md).

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
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` resuelve por ti las dependencias externas del paquete, así que esto funciona sin bundler.
Cada entrada se alcanza por su ruta tras la versión: `…/erd-editor.js` define el editor y `…/erd-viewer.js` el visor, que descarga de la CDN cada idioma de la interfaz salvo el inglés cuando una página lo pide. La URL del paquete a secas, `https://esm.run/@dineug/erd-editor@5.0.0`, sirve la raíz, que no define ningún elemento.
Una URL sin número de versión siempre sirve la versión más reciente. Fija una versión, como arriba, si no quieres que una actualización mayor llegue a tu página sin previo aviso.
La propia `5.0.0` es una actualización mayor: una página que tenga que seguir en la 4.x fija `@4.2.0`; consulta [Actualizar desde 4.x](#upgrading-from-4x).

`esm.run` sirve los workers compartidos desde `cdn.jsdelivr.net`, y un navegador no inicia un worker compartido de un origen distinto del de la página. Así, un editor cargado de esta forma funciona sin sus workers, como en un host que los bloquea; consulta [Web Workers](#web-workers). La compilación de [etiqueta script](#script-tag) los lleva dentro de su archivo.

### Etiqueta script {#script-tag}

Desde la `3.6.0`, el paquete también incluye una compilación UMD con todas las dependencias y todos los workers compartidos dentro de un único archivo, `dist/erd-editor.umd.js`.
Los campos `unpkg` y `jsdelivr` apuntan a ella, así que la URL del paquete a secas la sirve en cualquiera de las dos CDN; además, esta compilación define `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Al cargarla se define `<erd-editor>`. `window.ErdEditor` contiene los dos callbacks de archivo, `ErdEditor.setExportFileCallback` y `ErdEditor.setImportFileCallback`, desde la `3.9.2` `ErdEditor.createKeyBindingMap`, desde la `4.2.0` `ErdEditor.dictionaryRowChords` —consulta [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)— y desde la `5.0.0` `ErdEditor.ErdEditorElement` y `ErdEditor.defineErdEditor`; consulta [Registro de los elementos](#registering-the-elements). No contiene [toImage](./to-image.md).

Desde la `5.0.0`, un segundo archivo, `dist/erd-viewer.umd.js`, define `<erd-viewer>` y pone `ErdViewerElement` y `defineErdViewer` en `window.ErdViewer`. No inicia ningún worker, contiene los 25 idiomas de la interfaz y no solicita nada salvo el `src` que se le da.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Ninguno de los dos archivos define la etiqueta del otro, y cada uno no deja en la página ningún global salvo el suyo y `window.Konva`.
El mapa de exportaciones del paquete sigue dirigiendo a los bundlers a los módulos ES, así que una instalación desde npm nunca usa ninguno de los dos archivos.
Una página que no puede cargar un script propio puede enmarcar el visor alojado en erd-editor.io/embed; consulta [Incrustación](../guide/guides/embedding.md).

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

Desde la `4.0.0`, `enable-locale-picker` añade el selector `Display Language` de la barra de herramientas y `enable-welcome-screen`, la pantalla de bienvenida que muestra un diagrama vacío; consulta [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) y [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Una página que carga un documento, como en [Uso](#usage), activa `enableWelcomeScreen` una vez que `setInitialValue()` lo ha cargado, y no en el marcado, para que la pantalla nunca aparezca fugazmente sobre un archivo que aún se está cargando.
El editor lleva los 25 idiomas de la interfaz, tanto en la compilación ES como en la de etiqueta script, así que no hay ningún archivo de idioma que servir ni nada que registrar. Sin el selector y sin una llamada a `setLocale()`, el editor se muestra en inglés.

Añadir `readonly` aquí abre el editor como un lector: asignar `value`, llamar a `clear()` y todas las llamadas a `setSchema*()` —incluidas `setSchemaJSON()` y las que añaden al diagrama— se ignoran, y el evento `change` nunca se dispara. Sus pestañas, el explorador y la búsqueda rápida siguen para leer, y todo control que editaría el diagrama desaparece.
Leer `editor.value` y `editor.runtimeValue` sigue funcionando, y ambos conservan los ajustes propios del documento: un ajuste de la vista que cambia el lector, como el zoom o la base de datos, se queda en la pantalla de ese editor. Para cargar, usa `setInitialValue()`; consulta [readonly](./erd-editor-element.md#readonly).

### Renderizado del lado del servidor {#server-side-rendering}

Todas las entradas salvo `engine.js` y `peer.js` necesitan un DOM, así que lanzan una excepción en Node. `erd-editor.js` y `erd-viewer.js` definen su elemento en el ámbito del módulo, y la raíz del paquete, que desde la `5.0.0` no define nada, sigue construyendo las clases de ambos elementos al cargarse.
En Next.js, Nuxt, SvelteKit o Astro, llega a la entrada del elemento desde código que solo se ejecute en el cliente, y desde el mismo código una importación con nombre de la raíz, como `setExportFileCallback` o `toImage`.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

En desarrollo, añade a la preoptimización de Vite el bundle de ELK que importa el worker de disposición del editor, o fallarán las disposiciones que hace ese worker: `Flow`, `Tree - vertical` y `Tree - horizontal` de la disposición automática, el modo Flow de la pestaña Visualización y una importación colocada por Flow.
Vite 7 y anteriores necesitan además mantener el editor fuera de la preoptimización, ya que su preoptimización apunta las URL de los workers a archivos que nunca escribe, así que fallan los tres workers. En Vite 8 omite ese `exclude`, que solo hace que el servidor de desarrollo descargue cada archivo del paquete por separado. Una compilación de producción no necesita ninguno de los dos.

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

Importar `@dineug/erd-editor/erd-editor.js` fusiona `erd-editor` en `HTMLElementTagNameMap`, y `@dineug/erd-editor/erd-viewer.js` fusiona `erd-viewer`, así que el elemento queda tipado sin necesidad de una conversión de tipo. Cualquier importación de la raíz, incluso solo de un tipo, trae ambos.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` se exporta para anotar tus propias variables y props. Desde la `5.0.0` es también la clase del elemento, y `ErdViewerElement` es la interfaz y la clase del visor; consulta [Registro de los elementos](#registering-the-elements).
Desde la `4.0.0`, el paquete también exporta los tipos `LocaleCode`, `LocaleOption` y `SchemaSQLOptions`, y desde la `5.0.0` `ToImageOptions`; consulta [Puntos de entrada](#entry-points). Las opciones que admiten los métodos `setSchema*()` no tienen un nombre exportado; obtenlas a partir del elemento, como `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Desde la `5.0.0`, los `typesVersions` del paquete tipan también cada entrada de subruta bajo `moduleResolution: "node10"`, que no lee el mapa de exportaciones.

## Registro de los elementos {#registering-the-elements}

Desde la `5.0.0`, el paquete define una etiqueta solo donde una página se lo pide.

| Importación | Define |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nada |

Cada una de las dos entradas define su etiqueta al evaluarse y no exporta nada, así que se importa solo por su efecto, y ninguna define la etiqueta de la otra.
La raíz exporta las dos clases de elemento, `ErdEditorElement` y `ErdViewerElement`, y `defineErdEditor()` y `defineErdViewer()`, que definen su etiqueta donde las llamas:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Una llamada no hace nada mientras la etiqueta ya tiene esa clase, así que una entrada y una llamada de definición, o dos llamadas de definición, pueden coincidir en una misma página. Lanza un `Error` que nombra la etiqueta cuando la tiene otra clase, como ocurriría con una segunda copia del paquete incluida en la misma página: `Another element class already defines the custom element name erd-editor`.
Las clases de la raíz son las que definen las entradas, así que `customElements.get('erd-editor') === ErdEditorElement` una vez que se ha ejecutado cualquiera de las dos. Hasta que se define la etiqueta, `document.createElement('erd-editor')` crea un `HTMLElement` simple sin ninguno de los miembros del editor, y `new ErdEditorElement()` lanza una excepción.

Para una etiqueta propia, define tú mismo la clase con ella y añade tú mismo la etiqueta a `HTMLElementTagNameMap`. Hazlo en una ventana que no cargue la entrada de ese elemento ni su compilación de [etiqueta script](#script-tag) y no llame a ninguna función de definición para él, ya que una clase admite un solo nombre por ventana:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Un bundle que contiene ambos elementos hace que Vite y Rolldown avisen de un `INEFFECTIVE_DYNAMIC_IMPORT` una vez por cada idioma de la interfaz salvo el inglés. El visor carga cada uno de ellos con un `import()` propio, y el editor importa todos los diccionarios a la vez, así que se quedan en el chunk del editor y se cargan con él. No falla nada, y un bundle solo con el visor conserva cada idioma en un chunk propio.

## Resaltado de sintaxis {#syntax-highlighting}

Los paneles de Esquema SQL y del Generador de código los resalta [Shiki](https://shiki.style), en un worker compartido propio, y desde la `4.0.0` también los scripts `Before tables` y `After tables` de la pestaña Esquema SQL.
Desde la `3.7.0`, no hay nada que instalar ni nada que registrar: el worker se crea la primera vez que se renderiza un panel de código, así que una página que no abre ninguno nunca descarga las gramáticas.

| | |
| --- | --- |
| Lenguajes | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temas | `github-dark` y `github-light`, según la apariencia clara u oscura del editor |

Son exactamente los lenguajes que generan los paneles: `JPA` se resalta como Java; `SQLAlchemy`, como Python; `TypeORM`, `Sequelize`, `Drizzle` y `Zod`, como TypeScript; `Doctrine`, como PHP; `SeaORM`, como Rust; `JSON Schema`, como JSON, y `DBML` y `AML`, como SQL, la gramática más cercana de las incluidas; consulta [Generador de código](../guide/guides/code-generator.md).

El motor de expresiones regulares es JavaScript puro, así que ninguna política del host necesita `wasm-unsafe-eval`.
Donde falta `SharedWorker` —Chrome en Android anterior a Chrome 148, Safari anterior a la 16.4—, el fallo se registra y el código se muestra como texto sin formato; los scripts se pueden seguir editando.

Si actualizas desde la `3.6.0` o anterior: `@dineug/erd-editor-shiki-worker` ya no se publica y `setGetShikiServiceCallback` ha desaparecido con él.
Quita la instalación y el registro; una página que cargaba el worker desde una CDN quita también esa segunda etiqueta `<script>`.

## Web Workers {#web-workers}

El editor ejecuta tres tareas en `SharedWorker`: el resaltado de sintaxis, la exportación de imagen y la disposición de tablas en la que se basan la [disposición automática](../guide/guides/table-related-functions.md#auto-layout), el [modo Flow](../guide/guides/visualization.md#how-flow-is-placed) de la pestaña Visualización y, desde la `4.0.0`, la colocación de un esquema importado.
Los tres vienen dentro de `@dineug/erd-editor`. Ninguno requiere configuración por tu parte, pero un host puede bloquear cualquiera de ellos.
Desde la `5.0.0`, cada worker se construye en un módulo propio, así que un bundle lleva solo los workers a los que llegan sus módulos: un bundle de [toImage](./to-image.md) y ningún elemento lleva solo el worker de exportación de imagen, y `<erd-viewer>` no inicia ningún worker; consulta [Puntos de entrada](#entry-points).
El worker que ejecutaba la recolección de elementos no utilizados del documento se eliminó en la `4.0.0`, junto con la propia recolección.

| Worker | Sin él |
| --- | --- |
| Resaltado de sintaxis | Los paneles de Esquema SQL y del Generador de código y los scripts de Esquema SQL se quedan en texto sin formato |
| Exportación de imagen | El PNG, el SVG, `Copy to clipboard`, la vista previa del cuadro de diálogo `Export image` y, desde la `5.0.0`, [toImage()](./to-image.md) se dibujan en el hilo principal, lo que bloquea la página mientras se dibujan |
| Disposición de tablas | Las disposiciones `Flow`, `Tree - vertical` y `Tree - horizontal` de la disposición automática y el modo Flow de la pestaña Visualización terminan en `Could not place tables`; una importación colocada por Flow —un archivo SQL, GraphQL, DBML o AML desde `Import` o `Import and Add`, o una llamada a `setSchema*()` con `placement: 'auto'`— coloca sus tablas en filas, sin ningún mensaje; `Force` y el modo Graph no se ven afectados, ya que se ejecutan dentro del editor |

La exportación de imagen espera diez segundos a que responda su worker y después dibuja en el hilo principal, y el resaltado de sintaxis deja el código como texto sin formato en cuanto su worker falla, así que un host que bloquea los workers cuesta rendimiento, no funcionalidad.
La disposición de tablas es la excepción: el motor que calcula una disposición pesa más que el propio editor y nunca se carga en el mismo proceso, así que espera treinta segundos a su worker en la primera colocación y, una vez que el worker ha respondido, da sesenta segundos a cada disposición para completarse.
Si se agota cualquiera de las dos esperas, la colocación termina igual que sin el worker. La disposición automática muestra `Placing tables` en cuanto empieza, mientras que el modo Flow y una importación colocada por Flow solo lo muestran cuando una colocación, incluido el arranque de su worker, lleva seis segundos en curso.

Vite, webpack 5 y Rspack generan los workers como archivos junto a tus chunks. esbuild, y Rolldown usado por sí solo y no a través de Vite, no generan ninguno, así que una página que construyen funciona sin los workers.
Bajo el `experiments.outputModule` experimental de webpack no arranca ningún worker, ya que cada uno espera un chunk separado de él que nada carga. Conserva la salida predeterminada de webpack, o establece `optimization.splitChunks: false`.

### Política de seguridad de contenido {#content-security-policy}

Una página bajo una política de seguridad de contenido estricta necesita estas directivas para los elementos:

- `worker-src 'self'` para la compilación empaquetada, cuyos workers son archivos junto al paquete, más `blob:` donde tu bundler incruste un worker en línea. En la compilación de [etiqueta script](#script-tag), los tres viajan dentro del archivo como URL `data:`, así que esa página necesita `worker-src data:` en su lugar. `<erd-viewer>` no necesita ninguna de las dos, ya que no inicia ningún worker.
- Desde la `5.0.0`, ambos elementos aplican sus estilos con hojas de estilo construidas, que `style-src 'self'` deja pasar. Los paneles de código del editor siguen coloreando su texto con atributos `style`, y la vista previa del cuadro de diálogo `Export image` es una imagen en una URL `blob:`, así que el editor necesita además `style-src 'unsafe-inline'` e `img-src blob:` para ellos.
- Un navegador sin hojas de estilo construidas, como Firefox anterior a la 101, recibe en su lugar elementos `<style>`, que necesitan `style-src 'unsafe-inline'` para cualquiera de los dos elementos.
- `<erd-viewer>` descarga su `src`, así que ese origen va en `connect-src`; consulta [Qué añade a una página](./erd-viewer-element.md#what-it-adds-to-a-page).

## Puntos de entrada {#entry-points}

El paquete tiene cinco entradas:

| Entrada | Qué es |
| --- | --- |
| `@dineug/erd-editor` | La raíz: las exportaciones de abajo. Desde la `5.0.0` no define ningún elemento, aunque sigue necesitando un DOM para cargarse |
| `@dineug/erd-editor/erd-editor.js` | Desde la `5.0.0`. Define `<erd-editor>` y no exporta nada |
| `@dineug/erd-editor/erd-viewer.js` | Desde la `5.0.0`. Define `<erd-viewer>` y no exporta nada |
| `@dineug/erd-editor/engine.js` | El almacén del documento sin DOM |
| `@dineug/erd-editor/peer.js` | Desde la `3.9.1`. El par headless del servidor MCP |

La raíz exporta las dos clases de elemento y sus funciones de definición, dos setters de callbacks, desde la `3.9.2` las combinaciones de teclas predeterminadas con sus tipos, desde la `4.0.0` los tipos del idioma de la interfaz y el tipo de las opciones de `getSchemaSQL()`, desde la `4.2.0` las combinaciones de teclas de filas de la pestaña Diccionario y desde la `5.0.0` `toImage`.

| Exportación | Descripción |
| --- | --- |
| `ErdEditorElement` | La interfaz del elemento; consulta [ErdEditorElement](./erd-editor-element.md). Desde la `5.0.0` es también su clase, aquella con la que se define `<erd-editor>`; consulta [Registro de los elementos](#registering-the-elements). |
| `ErdViewerElement` | Desde la `5.0.0`. La interfaz y la clase del visor; consulta [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Desde la `5.0.0`. Definen `<erd-editor>` o `<erd-viewer>` con su clase. Una llamada no hace nada mientras la etiqueta tiene esa clase, y lanza un `Error` cuando la tiene otra clase; consulta [Registro de los elementos](#registering-the-elements). |
| `toImage(value, options)` | Desde la `5.0.0`. Dibuja un documento como un `Blob` PNG o una cadena SVG, con las opciones del cuadro de diálogo `Export image`; consulta [toImage](./to-image.md). |
| `ToImageOptions` (tipo) | Desde la `5.0.0`. Las opciones que admite `toImage()`: `format`, `background`, `darkMode` y `scale`. |
| `setExportFileCallback(cb)` | Sustituye la descarga del navegador, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Sustituye el selector de archivos del navegador, `({ type, op, accept, mode }) => void`; `mode` desde la `4.0.0`. Desde la `4.2.0`, la herramienta `Import CSV` de la pestaña Diccionario abre el selector del navegador aunque haya un callback establecido; consulta [Cuadros de diálogo de archivo](#file-dialogs). |
| `createKeyBindingMap()` | Devuelve las combinaciones de teclas predeterminadas como un nuevo `KeyBindingMap` en cada llamada; consulta [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipos) | Un mapa de combinaciones, la unión de sus nombres de comando y una combinación. |
| `dictionaryRowChords(map)` | Desde la `4.2.0`. Devuelve, como un nuevo `ShortcutOption[]` en cada llamada, las combinaciones con las que la cuadrícula de la pestaña [Diccionario](../guide/guides/dictionary.md#adding-and-deleting-rows) inserta y elimina filas según el `KeyBindingMap` que le pases. La que inserta filas encima, `Alt+Shift+Enter` con los valores predeterminados, no forma parte de ninguna asignación; consulta [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipos) | Desde la `4.0.0`. Los 25 códigos de idioma de la interfaz, y esos códigos más `'system'`, que es lo que admite `setLocale()`; consulta [Idioma de la interfaz](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | Desde la `4.0.0`. Las opciones que admite `getSchemaSQL()`: `statements`, `header` y, desde la `4.2.0`, `logicalNameAsComment`; consulta [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Desde la `5.0.0`, `dist` contiene un archivo sin minificar por módulo, cada uno junto a su declaración, y el `sideEffects` de `package.json` nombra solo las dos entradas de etiqueta y dos stubs que necesitan los archivos de los workers. Así, un bundler descarta todo módulo al que no llega una página y minifica una sola vez:

- Una importación con nombre de la raíz, como `setExportFileCallback`, no incluye ningún elemento ni ningún worker.
- `toImage` trae el worker de exportación de imagen y ningún elemento.
- `erd-editor.js` trae el editor y los tres workers compartidos.
- `erd-viewer.js` trae el visor y ningún worker, con el inglés dentro y cada otro idioma de la interfaz en un chunk propio, que se carga cuando una página lo pide.

`@dineug/erd-editor/engine.js` ejecuta el almacén del documento sin DOM, así que funciona en un Web Worker; consulta [Almacenamiento remoto](./advanced/remote-storage.md).
Exporta `createReplicationStore` y el tipo `ReplicationStore`. Desde la `3.10.0`, también exporta el tipo `ReplicationChange`, `{ value: string; changed: boolean }`, que recibe el listener de `change` de una réplica; consulta [on@change](./advanced/remote-storage.md#onchange).
Desde la `4.0.0`, un `ReplicationStore` también tiene un `runtimeValue`. Su `value` y el que entrega un `change` son la forma de almacenamiento que se guarda en un archivo, como los del elemento; consulta [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` es el par headless a través del cual el [servidor MCP](../mcp/introduction.md) edita un documento. Existe para ese servidor, y estas páginas no lo documentan.

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
El callback de exportación recibe estos archivos. Desde la `4.0.0`, el SVG y los archivos del Generador de código están entre ellos, y el `.sql` procede del botón `Save file` de la pestaña Esquema SQL y no directamente de `Export`. Desde la `4.2.0`, el CSV de la pestaña Diccionario también está entre ellos. [toImage()](./to-image.md) no llama a ninguno de los dos callbacks: te devuelve su imagen.

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

## Actualizar desde 4.x {#upgrading-from-4x}

La `5.0.0` es una versión mayor. Comprueba cada uno de estos puntos al migrar una página desde la 4.x:

- `import '@dineug/erd-editor'` ya no define `<erd-editor>`. Importa en su lugar `@dineug/erd-editor/erd-editor.js` por su efecto, o llama a `defineErdEditor()`, y deja como están tus importaciones con nombre de la raíz. TypeScript no avisa de una página que se queda con la importación a secas, ya que las declaraciones de la raíz siguen nombrando la etiqueta en `HTMLElementTagNameMap`, pero el elemento que crea es un `HTMLElement` simple, así que su primera llamada a un método lanza un `TypeError`; consulta [Registro de los elementos](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- En una CDN ocurre lo mismo con `https://esm.run/@dineug/erd-editor`, que ahora sirve la raíz y no define nada: importa `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Las URL a secas de jsDelivr y unpkg siguen sirviendo la compilación de etiqueta script, que define `<erd-editor>` como antes. Una URL sin versión ahora sirve la última versión 5.x; fija `@4.2.0` para quedarte en la 4.x; consulta [CDN](#cdn) y [Etiqueta script](#script-tag).
- La raíz no define nada pero sigue necesitando un DOM, así que con renderizado del lado del servidor una importación con nombre de ella, como `setExportFileCallback`, se queda en el código solo de cliente junto a la entrada del elemento; consulta [Renderizado del lado del servidor](#server-side-rendering).
- `window.ErdEditor` incorpora `ErdEditorElement` y `defineErdEditor`. La compilación de etiqueta script del visor pone `ErdViewerElement` y `defineErdViewer` en `window.ErdViewer`, y ninguno de los dos globales contiene `toImage`.
- Un editor `readonly` se abre como un lector. Sus seis pestañas, el explorador, la búsqueda rápida y la presencia se quedan, y todo control que editaría el diagrama desaparece en lugar de desactivarse: la barra de herramientas muestra el nombre de la base de datos como texto, la pestaña Configuración muestra sus ajustes con todos los controles desactivados bajo un distintivo `Read only`, y la barra de herramientas flotante conserva solo el zoom, la vista de nombres, el modo zen y la brújula, así que `Hand` y `Select` desaparecen y un arrastre desplaza la vista. Una pulsación no selecciona nada: la única selección es el contorno que un salto desde el explorador o la búsqueda rápida pone alrededor de lo que alcanza, que un clic sin movimiento borra, y las combinaciones de seleccionar todo no seleccionan nada. Activar `readonly` termina lo que estaba abierto, como la selección, la herramienta Mano, un editor de celda, un arrastre, Map Columns, la vista previa `Force` de Auto Layout y Time Travel, y conserva el desplazamiento, el zoom, la pestaña y la vista de nombres; consulta [readonly](./erd-editor-element.md#readonly).
- Los ajustes que cambia un lector `readonly` se quedan en la pantalla de ese editor digan lo que digan sus bloqueos: el desplazamiento y el zoom, la pestaña, la vista de nombres, View Option, la base de datos, y el lenguaje, los estilos de nombres y el tipo de delimitador del Generador de código. `value`, `runtimeValue` y la exportación JSON conservan los del documento, a los que podían llegar los cambios de un lector de la 4.x, y `getSharedStore()` no envía ninguno de ellos a los demás editores. `getSchemaSQL()` sin proveedor escribe la base de datos que eligió el lector. Desactivar `readonly` devuelve la base de datos, los ajustes de código y View Option a los del documento, y deja el desplazamiento, el zoom, la pestaña y la vista de nombres donde los dejó el lector.
- Ha desaparecido la fila `Recalculation table width` de la pestaña Configuración. Una carga y un pegado siguen ajustando el ancho de cada tabla a su texto.
- En Vite 8 quita de `optimizeDeps` un `exclude: ['@dineug/erd-editor']`, que solo necesitan aún Vite 7 y anteriores, y conserva el `include` de ELK; consulta [Vite](#vite).

## Actualizar desde 3.x {#upgrading-from-3x}

La `4.0.0` es una versión mayor. Comprueba cada uno de estos puntos al migrar una página desde la 3.x y después los de [Actualizar desde 4.x](#upgrading-from-4x) para la `5.0.0`:

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
- Una URL de CDN sin versión sirve la última versión, la 5.x desde la `5.0.0`. Fija `@3.10.0` para quedarte en la 3.x; consulta [CDN](#cdn).
