---
sidebar_position: 2
description: "La API del elemento erd-editor: atributos, value y runtimeValue, eventos, temas, idioma de la interfaz, pantalla de bienvenida, combinaciones de teclas e importación y exportación de esquemas."
---

# ErdEditorElement

El editor es un simple `HTMLElement`.  
Su definición de tipos es la siguiente.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

El editor se renderiza dentro de un shadow root cerrado, así que `editor.shadowRoot` es `null` y los estilos de la página no se filtran ni hacia dentro ni hacia fuera.  
No se puede llegar a nada de su interior con un selector; en su lugar, aplícale estilos con [setTheme](#settheme) y las propiedades personalizadas `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` y `enable-welcome-screen` son los únicos atributos, y los cinco valen `false` de forma predeterminada. Los dos últimos son nuevos en la `4.0.0`. Cada uno interpreta su valor como se describe en [readonly](#readonly).

Desde la `4.1.0`, la pestaña ERD tiene un [explorador](../guide/guides/explorer.md), un árbol del diagrama acoplado a la izquierda del lienzo con Buscar y reemplazar en su parte superior. Ningún atributo, propiedad, método ni evento lo abre, lo cierra ni informa sobre él: se abre con el botón `Explorer` de la barra de herramientas, con `Toggle Explorer` en la búsqueda rápida o en el menú contextual del lienzo, o con la asignación [`findReplace`](#setkeybindingmap).  
Todo elemento empieza con el explorador cerrado. Su estado abierto o cerrado, su ancho, lo que tiene contraído y su búsqueda se conservan mientras exista el elemento, pese a los cambios de pestaña y a cualquier carga, incluida la de `setInitialValue`, y nunca están en `value`, `runtimeValue`, el historial de deshacer ni un almacén compartido.

Desde la `4.2.0`, las tablas y las columnas pueden tener [nombres lógicos](../guide/guides/logical-names.md) junto a sus nombres, y la vista de nombres, un ajuste del documento como la pestaña, decide si el lienzo dibuja sus nombres, sus nombres lógicos o ambos.  
La barra de herramientas también tiene una pestaña [Diccionario](../guide/guides/dictionary.md), entre `Code Generator` y `Settings`, que contiene las palabras, los términos y los dominios del documento y una hoja `Checks`. Es una pestaña como las demás: su `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, lo abarca el bloqueo `Canvas Type`, así que un texto guardado en ella se abre en ella con [setInitialValue](#setinitialvalue), y un cambio a ella se escribe en `value` y emite [change](#change) solo mientras ese bloqueo está desactivado. Ningún atributo, propiedad, método ni evento propio la abre ni informa sobre ella. Sus ediciones son cambios del documento: están en `value`, emiten [change](#change) y llegan a los colaboradores, pero deshacerlas y rehacerlas actúa sobre el historial propio de cada hoja, no sobre el del documento.  
El estado propio de la pestaña —qué hoja se muestra, al principio `Domains`, y la búsqueda, la selección, el desplazamiento y el ancho de las columnas de cada hoja— se conserva mientras exista el elemento, pese a los cambios de pestaña y a cualquier carga, y nunca está en `value`, `runtimeValue`, un historial de deshacer ni un almacén compartido.  
La interfaz `ErdEditorElement` no incorpora ningún miembro. Lo que añade la API es `logicalNameAsComment` en las opciones de [getSchemaSQL](#getschemasql), doce [tokens del tema](#settheme) y la exportación [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Define la capacidad de edición del editor.  
Mientras está activado, se ignoran la asignación de `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, deshacer y rehacer, desde la `4.2.0` incluidos los de una hoja de la pestaña Diccionario, y el evento `change` nunca se emite. En su lugar, carga un documento con [setInitialValue](#setinitialvalue).  
Ver el documento sigue funcionando: el zoom, el desplazamiento de la vista, la herramienta Mano, el modo zen, la pestaña del lienzo, la pestaña [Visualización](../guide/guides/visualization.md) en sus dos modos, incluido centrarse en tablas, el proveedor de base de datos y los ajustes de salida de SQL y del Generador de código siguen aplicándose, así que un visor de solo lectura puede seguir exportando SQL para otro proveedor o leyendo el código generado.  
Desde la `4.1.0`, el [explorador](../guide/guides/explorer.md#read-only-editors) también se abre, y elegir una de sus filas lleva a lo que esta representa, igual que en un editor editable. [Buscar y reemplazar](../guide/guides/find-and-replace.md#read-only-editors), en su parte superior, solo busca, sin la flecha `Toggle Replace` ni la fila Reemplazar, e ir a una coincidencia sigue mostrándola en pantalla y seleccionándola. El panel se titula `Explorer`, y la descripción emergente del botón de la barra de herramientas es `Explorer (Ctrl + F)` (Windows/Linux) o `Explorer (⌘ + F)` (Mac) en todos los editores. De la `3.10.0` a la `4.0.0`, Buscar y reemplazar se abría como un panel flotante solo de búsqueda titulado `Find`.  
El panel Propiedades de la tabla sigue abriéndose y, desde la `3.10.0`, muestra un distintivo `Read only` junto a su título, y su pestaña `Indexes` no permite ninguna edición; consulta [Propiedades de la tabla](../guide/guides/table-related-functions.md#table-properties).  
Desde la `4.0.0`, un editor de solo lectura no ofrece [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (consulta [Grupos de tablas](../guide/guides/table-groups.md#read-only-editors)) ni [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), y no muestra la [pantalla de bienvenida](#enablewelcomescreen). Los botones de bloqueo de la pestaña Configuración no cambian nada, y los scripts `Before tables` y `After tables` de la pestaña Esquema SQL no se pueden editar.  
Desde la `4.1.0`, tampoco muestra los botones `New Table`, `New Memo` ni `New Table Group` en la [barra de herramientas del lienzo](../guide/guides/table-related-functions.md#canvas-toolbar), y las asignaciones `addTableGroup` y `groupSelectedTables` no hacen nada.  
Desde la `4.2.0`, la [vista de nombres](../guide/guides/logical-names.md#read-only-editors) sigue cambiando desde cada uno de sus selectores, pero solo en la pantalla de ese editor: diga lo que diga su bloqueo, el cambio nunca llega a los colaboradores. `Previous table` y `Next table` de Flow siguen retrocediendo y avanzando, con sus botones o con las teclas de deshacer y rehacer.  
La pestaña [Diccionario](../guide/guides/dictionary.md#read-only-editors) sigue abriéndose: se puede cambiar de hoja y buscar, seleccionar, desplazarse y copiar en sus hojas, y una fila de la hoja `Checks` sigue llevando a lo que indica. Ninguna celda admite una edición, un pegado ni un borrado, la pestaña no muestra las herramientas `Add Row`, `Delete Rows`, `Import CSV` ni `Export CSV` ni ningún menú en la cuadrícula, y sus combinaciones de filas no insertan ni eliminan nada. El menú de la tabla, el menú del lienzo y la búsqueda rápida no ofrecen [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) ni `Derive Physical Name Again`.  
Las opciones `This window only` de la pestaña Esquema SQL, `Statements`, `Header`, `Write logical names into empty comments` (desde la `4.2.0`) y `Tables`, nunca se guardan y siguen aplicándose, igual que el cuadro de diálogo [`Export image`](../guide/guides/file-import-export.md#image), el generador de temas y el selector de idioma. Una elección en el generador de temas o en el selector de idioma sigue emitiendo [changePresetTheme](#changepresettheme) o [changeLocale](#changelocale).  
Un atributo sin valor, `=""` y `="true"` se interpretan como `true`. `="false"` se interpreta como `false`, igual que cualquier otra cadena, incluida la forma idiomática de HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Determina si se sincroniza automáticamente con el modo oscuro/claro del sistema.  
Desde la `4.0.0`, activarlo establece el `appearance` del tema en `'system'`, como hace `setPresetTheme({ appearance: 'system' })`. El editor muestra entonces el modo claro u oscuro que indica el sistema operativo, o el que establece [setSystemAppearance](#setsystemappearance), y cambia cuando este cambia.  
Una llamada posterior a [setPresetTheme](#setpresettheme) con `'light'` o `'dark'`, o la elección de `Light` o `Dark` en el generador de temas o en la búsqueda rápida, sustituye a `'system'` y se mantiene: el siguiente cambio del sistema operativo ya no la sobrescribe, aunque `systemDarkMode` siga siendo `true`. Antes de la `4.0.0`, el siguiente cambio del sistema operativo la sobrescribía.  
Desactivarlo mientras la apariencia es `'system'` conserva el modo claro u oscuro que se muestra en ese momento. Desactivarlo después de que la apariencia haya dejado de ser `'system'` la deja como está.  
Cambiarlo no emite ningún evento.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Determina si se ofrece una interfaz para establecer fácilmente temas predefinidos.  
Muestra el botón `Theme` de la barra de herramientas, que abre el generador de temas con `Accent color`, `Gray color` y `Appearance`. Desde la `4.0.0`, `Appearance` ofrece `System` junto a `Light` y `Dark`, y, mientras está activado, la búsqueda rápida incluye `Theme` con `System`, `Light` y `Dark`. Consulta [Idioma y tema](../guide/guides/language-and-theme.md).

![Abrir el generador de temas desde la barra de herramientas, elegir el color de énfasis y el tono de gris, y cambiar la apariencia a Light y luego a System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Cambiar el tema predefinido desde este panel, o desde la búsqueda rápida, emite el evento [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Desde la `4.0.0`, determina si se ofrece una interfaz para elegir el idioma en que se muestra el editor.  
Muestra el botón `Display Language` de la barra de herramientas, después de `Theme` cuando se muestran los dos. El botón abre el selector de idioma, y la búsqueda rápida incluye `Display Language`. Ambos ofrecen `System` y los 25 idiomas; consulta [Idioma y tema](../guide/guides/language-and-theme.md).  
También decide qué muestra un editor antes de que se llame a [setLocale](#setlocale) o se elija un idioma: `'system'` mientras está activado e inglés mientras está desactivado, de modo que un elemento que no configura nada sigue mostrando el inglés de siempre. Activarlo o desactivarlo cambia entre ambos al instante. Una vez que se ha establecido o elegido un idioma, esa elección se mantiene tanto si está activado como desactivado.  
Actívalo antes de insertar el elemento para que el primer fotograma ya siga `'system'`.  
Cada elección emite [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Desde la `4.0.0`, determina si un diagrama vacío recibe al lector con la [pantalla de bienvenida](../guide/guides/editing-start.md#welcome-screen).  
Se superpone a la pestaña ERD mientras el documento no tiene ninguna tabla, ninguna nota visible ni ningún grupo de tablas visible. No se muestra mientras `readonly` está activado, en el modo zen ni mientras está abierto el panel Propiedades de la tabla, el visor de diferencias, el viaje en el tiempo o la vista previa de la disposición automática. La primera tabla, nota visible o grupo de tablas visible la retira, y deshacer hasta volver a un diagrama vacío la hace reaparecer.  
Sus filas `New Table`, `New Memo` y `Command Palette` muestran la primera combinación de `addTable`, `addMemo` y `search` tal como las dejó [setKeyBindingMap](#setkeybindingmap), y ninguna para un nombre que se dejó vacío. Sus flechas apuntan a los botones `Theme` y `Display Language` solo donde `enableThemeBuilder` y `enableLocalePicker` los muestran.  
En su menú, `↑`, `↓`, `Home` y `End` recorren las filas, y se cancela su acción predeterminada y se detiene su propagación. En `Enter` y `Space` se detiene la propagación, pero no se cancela la acción predeterminada, así que los recibe la fila con el foco, y `Escape` entre los formatos de `Import` vuelve atrás, con la acción predeterminada cancelada y la propagación detenida. Cualquier otra tecla llega al editor y a la página como de costumbre.  
No cambia nada del documento, así que deja `value` como estaba y no emite `change`.  
Actívalo una vez que [setInitialValue](#setinitialvalue) haya cargado el documento, como hacen los hosts oficiales, para que la pantalla nunca aparezca fugazmente sobre un archivo que aún se está cargando.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Obtiene el documento actual como una cadena JSON, en el [esquema](./advanced/schema.md) que define el editor.  
Desde la `4.0.0`, es la forma de almacenamiento, el documento tal como lo guarda un archivo, que es también lo que escribe la exportación `json` y lo que guardan los hosts oficiales. Contiene solo las entidades activas, sin las eliminadas, sin el orden de apilamiento y sin lo que el editor calcula por sí mismo, como los anchos medidos, las marcas de clave y los anclajes de las relaciones. Las claves de sus entidades siguen un orden fijo, tiene una sangría de dos espacios y termina con un salto de línea, así que el mismo documento siempre da los mismos bytes.  
Desde la `4.2.0`, también omite lo que está vacío: una lista vacía de `doc`, una colección vacía, una fila de diccionario que no contiene nada y un campo de texto vacío de una entidad, como un nombre, un comentario, un tipo de datos, un valor predeterminado o un color. Una lista dentro de una entidad, como los `columnIds` de una tabla, se sigue escribiendo aunque esté vacía. El `doc` de un documento nuevo es `{}`, y no tiene `collections`, así que interpreta como vacíos un campo, una lista o una colección que falten. Contiene los nombres lógicos y los indicadores de nombre derivado de las tablas y columnas, los vínculos de las columnas con sus dominios y las palabras, los términos y los dominios, cada diccionario escrito como un encabezado de nombres de campo seguido de sus filas, una fila por línea, en el orden de la hoja. Consulta [Forma de almacenamiento y valor en tiempo de ejecución](./advanced/schema.md#storage-form-and-runtime-value).  
Cada ajuste cuyo [bloqueo](../guide/guides/settings.md#lock) está activado se escribe con el valor en que está bloqueado, no como lo muestra la pantalla. El bloqueo `Viewport` abarca `originX`, `originY` y `zoomLevel`, y `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` y, desde la `4.2.0`, `Name View` abarcan cada uno su propio ajuste. La vista de nombres se escribe como `nameViewMode`, y solo mientras no es `'physical'`. Cualquier otro ajuste se escribe tal como está, y `lockSettings` siempre se escribe. Consulta [Ajustes](./advanced/schema.md#settings) para ver los bits; el bit del bloqueo `Name View` se interpreta al revés.  
Un documento nuevo tiene todos los bloqueos activados, tanto si es el que muestra un elemento antes de recibir un valor como si se ha cargado a partir de un valor en blanco. Su `value` mantiene el origen en `0, 0`, el nivel de zoom en `1`, la pestaña ERD, el lenguaje del Generador de código, los estilos de nombres y el tipo de delimitador predeterminados y, desde la `4.2.0`, `Physical Names`, hasta que se desactiva el bloqueo correspondiente.  
Antes de la `4.0.0`, devolvía todo el documento tal como lo tenía el editor, con `ignoreSaveSettings` aplicado. El documento tal como lo tiene el editor es ahora [runtimeValue](#runtimevalue), e `ignoreSaveSettings` ya no se lee ni se escribe.

```js
const data = editor.value;
```

### setter {#setter}

Carga un estado del editor guardado previamente. Sustituye todo el documento: primero se vacía el actual. Desde la `4.2.0`, eso incluye las palabras, los términos y los dominios: el documento toma los que contiene el texto, o ninguno, y se vacía el historial de deshacer propio de cada hoja de la pestaña Diccionario.  
Al igual que `clear()`, `setInitialValue()` y los métodos `setSchema*` en su `mode: 'replace'` predeterminado, también descarta la vista Flow de la pestaña Visualización: su disposición, las tablas a las que está acotada, su vista de filas, el zoom y el desplazamiento y, desde la `4.2.0`, las tablas que recorren sus `Previous table` y `Next table`. Una adición (`mode: 'append'`) no la descarta.  
Se registra en el historial, lo que permite `Undo, Redo`, y emite `change`.  
Admite la forma de almacenamiento, un [runtimeValue](#runtimevalue) o un archivo guardado por una versión anterior.  
Una cadena en blanco, o cualquier cosa que no sea una cadena, carga un documento nuevo en lugar de lanzar un error, así que comprueba el valor antes de asignarlo.  
Ese documento nuevo es el mismo con el que empieza `setInitialValue('')`: vacío, con los ajustes predeterminados y, desde la `4.0.0`, con todos los bloqueos activados. En la `3.10.x`, no guardaba ni la posición de desplazamiento ni el nivel de zoom, y antes guardaba ambos.  
Un almacén compartido retransmite esa carga a los colaboradores con el JSON completo del documento nuevo, así que cada par, incluso uno con una versión anterior, lo carga, aunque un editor anterior a la `4.2.0` descarta lo que no conoce, como los nombres lógicos, los vínculos con dominios y los diccionarios; consulta [Mezclar versiones](./advanced/collaborative-editing.md#mixing-releases).  
Desde la `4.0.0`, los bloqueos del documento cargado, y los valores bloqueados que luego escribe `value`, proceden del texto, y la vista queda donde la sitúa el texto, o sobre el diagrama cuando ahí no se dibuja ninguna parte de él. Para cada uno de los demás ajustes que el texto bloquea —la pestaña, el lenguaje del Generador de código, los estilos de nombres, el tipo de delimitador y, desde la `4.2.0`, la vista de nombres—, el editor sigue mostrando lo que mostraba antes de la carga. Un ajuste que el texto deja sin bloquear toma el valor del texto. Un archivo guardado antes de la `4.2.0` no indica ningún bloqueo `Name View`, salvo que un editor de la `4.2.0` haya desactivado ese bloqueo en él, así que se carga con la vista de nombres bloqueada en `Physical Names`, y el editor conserva la vista de nombres que mostraba. [setInitialValue](#setinitialvalue), en cambio, toma todos los valores que contiene el texto; consúltalo también para un texto que no indica ningún bloqueo.  
Un texto que no es JSON, como un archivo con marcadores de conflicto de fusión, tampoco lanza un error: el documento se vacía, sus ajustes se quedan como estaban y el error de análisis se registra en la consola.  
Se ignora mientras `readonly` está activado; usa [setInitialValue](#setinitialvalue) para cargar en un editor de solo lectura.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Desde la `4.0.0`, obtiene el documento tal como lo tiene este editor, como una cadena JSON. No tiene setter, así que asignarle un valor lanza un error en código en modo estricto.  
Incluye lo que [value](#value) omite: las entidades eliminadas y su orden, el orden de apilamiento, los anchos medidos, las marcas de clave, los anclajes de las relaciones y las secuencias y, desde la `4.2.0`, los campos de texto, las listas de `doc` y las colecciones vacíos; las filas eliminadas de una hoja de la pestaña Diccionario y las que no contienen nada; la clave de orden de cada fila de diccionario; las listas de `doc` de las palabras, los términos y los dominios; y un vínculo con un dominio eliminado. Aquí también los ajustes bloqueados se escriben con sus valores bloqueados.  
Úsalo para inicializar, mediante su [setInitialValue](#setinitialvalue), otro editor que se une a una sesión ya en curso, como un colaborador o una segunda vista del mismo documento. Así, si más tarde la sesión envía el deshacer de una eliminación, allí se restaura la entidad completa, mientras que un editor inicializado a partir de `value` no contiene ninguna entidad eliminada y restaura en su lugar una tabla vacía y sin nombre o, desde la `4.2.0`, una fila de diccionario vacía. Consulta [Edición colaborativa](./advanced/collaborative-editing.md).  
Ya nada recolecta las entidades eliminadas, así que permanecen en él hasta la próxima vez que el documento se abra desde su archivo.  
Nunca lo escribas en un archivo: guarda `value`, que el [JSON Schema](./advanced/schema.md#json-schema) acepta y este no.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Carga un estado del editor guardado previamente. La carga en sí no se registra en el historial, así que no se puede deshacer, y no se emite ningún evento `change`.  
También vacía el historial de deshacer, así que nada de lo hecho antes de la carga se puede deshacer ni rehacer sobre el documento cargado, y, desde la `4.2.0`, también el historial propio de cada hoja de la pestaña Diccionario.  
Admite la forma de almacenamiento, un [runtimeValue](#runtimevalue) o un archivo guardado por una versión anterior y, a diferencia de asignar `value`, toma todos los ajustes que contiene el texto, incluidos la pestaña y los ajustes de código.  
Una cadena en blanco, o cualquier cosa que no sea una cadena, carga un documento nuevo en lugar de lanzar un error, así que `setInitialValue('')` empieza un diagrama en blanco.  
Desde la `4.0.0`, ese documento nuevo, que es también lo que muestra un elemento antes de recibir ningún valor, tiene todos los bloqueos activados. Desplazarse, hacer zoom, cambiar de pestaña y cambiar el lenguaje del Generador de código, los estilos de nombres, el tipo de delimitador o, desde la `4.2.0`, la vista de nombres dejan `value` como estaba y no emiten `change`. En la `3.10.x`, no guardaba ni la posición de desplazamiento ni el nivel de zoom, y antes guardaba ambos.  
Un documento cargado desde un texto conserva los bloqueos que indica. Uno que no indica ninguno —cualquier archivo guardado antes de la `4.0.0`, dijera lo que dijera su `ignoreSaveSettings`, y un archivo `.vuerd` v2— se abre con todos los bloqueos activados, su `Viewport` bloqueado en el origen `0, 0` y el nivel de zoom `1`, en la pestaña ERD, con su lenguaje, sus estilos de nombres y su tipo de delimitador tal como los guardó.  
Desde la `4.2.0`, un texto que indica sus bloqueos pero no el bloqueo `Name View` también se abre con ese bloqueo activado, aunque todos los demás bloqueos estén desactivados. Un archivo guardado antes de la `4.2.0` es un texto así, salvo que un editor de la `4.2.0` haya desactivado ese bloqueo en él (consulta [Ajustes](./advanced/schema.md#settings)). Se abre en `Physical Names`, como uno que no indica ningún bloqueo.  
En ambos casos, la vista se abre en la vista del documento —la que guardó el texto cuando indica sus bloqueos, el origen `0, 0` con el nivel de zoom `1` cuando no indica ninguno— o sobre el diagrama cuando ahí no se dibuja ninguna parte de él. Un `Viewport` bloqueado sigue conservando sus valores bloqueados en `value`.  
Desde la `4.0.0`, también descarta el estado de colaboración del documento que tenía antes, y un [almacén compartido](#getsharedstore) de este editor que ya esté suscrito vuelve a pedir el suyo a los demás editores, de modo que un editor recargado en una sesión en curso se pone al día. Inicializa ese editor con el [runtimeValue](#runtimevalue) de otro editor.  
Un texto que no es JSON tampoco lanza un error: el documento se vacía, sus ajustes se quedan como estaban y el error de análisis se registra en la consola.  
A diferencia de asignar `value`, `readonly` no lo bloquea, así que es la forma de cargar un documento en un visor de solo lectura.

```js
editor.setInitialValue('json...');
```

Carga al inicio y guarda con cada cambio.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Eventos {#event}

`change`, `changePresetTheme` y `changeLocale` son los únicos tres eventos públicos; `changeLocale` es nuevo en la `4.0.0`.  
El elemento también despacha sobre sí mismo eventos internos `@dineug/erd-editor/internal-*` para su funcionamiento interno; esos no forman parte de la API.

### change {#change}

Cuando hay cambios en el editor, emite un evento.  
El evento tiene un debounce de 200 ms y no se emite mientras `readonly` es `true`.  
Se dispara con cualquier cambio del documento: una edición en la interfaz, la asignación de `value`, `clear()`, cada uno de los métodos `setSchema*` y, desde la `4.0.0`, `setSchemaJSON()` e `Import and Add`. `setInitialValue` no lo emite.  
Desde la `4.2.0`, eso incluye cada edición en la pestaña [Diccionario](../guide/guides/dictionary.md) y cada deshacer o rehacer de una de ellas, un cambio de un nombre lógico o de un vínculo con un dominio, `Derive Physical Names Again` y un cambio de vista de nombres mientras el bloqueo `Name View` está desactivado.  
Nada de lo que se hace en el modo Flow de la pestaña Visualización lo emite —el zoom, el desplazamiento de la vista, mover tarjetas, `Tidy Up`, la vista de filas, acotar la vista desde una tarjeta ni, desde la `4.2.0`, retroceder o avanzar con `Previous table` y `Next table` o con las teclas de deshacer y rehacer—, ya que nada de ello es un cambio del documento. Su lista `Name View` es la excepción: un cambio en ella lo emite mientras el bloqueo `Name View` está desactivado, como lo emite uno en la pestaña ERD.  
Desde la `4.0.0`, tampoco lo emite un cambio en un ajuste cuyo [bloqueo](../guide/guides/settings.md#lock) está activado, porque solo afecta a la pantalla y nunca a `value`: un desplazamiento o un zoom del lienzo ERD mientras `Viewport` está bloqueado, un cambio de pestaña mientras `Canvas Type` está bloqueado, un cambio del lenguaje del Generador de código, del estilo de nombres de tabla, del estilo de nombres de columna o del tipo de delimitador mientras su propio bloqueo está activado y, desde la `4.2.0`, un cambio de vista de nombres mientras `Name View` está bloqueado. Solo se excluyen esos cambios, así que un lote que además edita el documento sí lo emite. Bloquear o desbloquear un ajuste lo emite.  
Todos los bloqueos están activados en un documento nuevo y en cualquier archivo guardado antes de la `4.0.0`, y el bloqueo `Name View` está activado en cualquier archivo guardado antes de la `4.2.0`, salvo que un editor de la `4.2.0` lo haya desactivado en él, así que, de forma predeterminada, desplazarse, hacer zoom, cambiar de pestaña y cambiar la vista de nombres no emiten nada. Eso incluye centrarse en tablas desde la pestaña ERD, el botón de enlace externo de las tarjetas que lleva de Flow de vuelta a la pestaña ERD, ir a una fila del explorador o a una coincidencia de búsqueda, abrir el explorador o ir a un resultado de la búsqueda rápida desde otra pestaña y, desde la `4.2.0`, ir a una tabla o a una columna desde una fila de la hoja `Checks` de la pestaña Diccionario. Cada una de esas acciones emite un `change` solo mientras está desactivado un bloqueo que la abarca: `Canvas Type` para el cambio de pestaña y `Viewport` para el desplazamiento que también provocan un botón de tarjeta, un resultado de la búsqueda rápida, una fila del explorador, una coincidencia de búsqueda o una fila de `Checks`. Desde la `4.1.0`, todos esos desplazamientos siguen una única regla, [Dónde termina un salto](../guide/guides/table-related-functions.md#where-a-jump-lands), así que un resultado de tabla de la búsqueda rápida ya no desplaza la vista siempre, y un salto que la regla deja en su sitio no produce ningún desplazamiento que emitir. Abrir, cerrar o cambiar el tamaño del explorador estrecha o ensancha el lienzo sin mover su origen, y tampoco emite nada. Antes de la `4.0.0`, desplazarse, hacer zoom y cambiar de pestaña siempre lo emitían, aunque `editor.value` resultara igual.  
Para omitir escrituras que no cambian nada, compara `editor.value` con el último valor que guardaste, no con el archivo que cargaste: un archivo escrito por una versión anterior, un archivo v2 o uno editado a mano pueden salir distintos en `value` en cuanto se cargan, porque `value` los escribe en la forma de almacenamiento. Lo mismo puede ocurrir con un archivo cuyo bloqueo `Viewport` está desactivado y cuyo origen no muestra ninguna parte del diagrama en esta pantalla: la carga mueve la vista sobre el diagrama y `value` escribe dónde queda. Desde la `4.0.0`, los anchos medidos ya no lo provocan, porque `value` no contiene ninguno. Desde la `4.2.0`, también puede salir distinto un archivo guardado por la `4.0.0` o la `4.1.0`, ya que `value` omite ahora sus campos de texto, listas y colecciones vacíos, así que ese archivo se reescribe una vez, en su siguiente guardado. En su lugar, un host que escribe archivos puede distinguir una edición de un cambio de vista con el `changed` de un almacén de replicación; consulta [on@change](./advanced/remote-storage.md#onchange).  
El evento no lleva `detail` y ni se propaga ni cruza el límite del shadow root, así que escucha en el propio elemento y lee `editor.value` en el controlador.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Se emite cuando se cambia el tema predefinido en el generador de temas integrado o, desde la `4.0.0`, con `Theme` en la búsqueda rápida. Lo emite cada elección, incluida la de la opción ya vigente.  
Llamar tú mismo a [setPresetTheme](#setpresettheme) o a [setSystemAppearance](#setsystemappearance), o activar o desactivar [systemDarkMode](#systemdarkmode), no lo emite.  
`event.detail` es el `ThemeOptions` completo tras la elección —`{ appearance, grayColor, accentColor }`—, no el objeto parcial que se pidió. Desde la `4.0.0`, su `appearance` es `'system'` mientras está elegido `System`, no el modo claro u oscuro que muestra, así que guárdalo tal cual y devuélveselo a `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Desde la `4.0.0`, se emite cuando se elige un idioma en el editor, en el selector de idioma o con `Display Language` en la búsqueda rápida, ambos activados por [enableLocalePicker](#enablelocalepicker).  
Se dispara después de aplicarse el idioma, con cada elección, incluida la de la opción ya vigente. [setLocale](#setlocale) y [setSystemLocale](#setsystemlocale) nunca lo emiten, ni tampoco un cambio de los idiomas del navegador. Un cambio de idioma no emite `change`.  
`event.detail` es `{ locale }`, un `LocaleOption`: `'system'` cuando se eligió `System` y, si no, el código del idioma. El elemento no recuerda la elección, así que guárdala y pásasela a `setLocale` en la siguiente carga.  
Al igual que `change`, no se propaga, así que escucha en el propio elemento.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Pone el foco en el editor.

```js
editor.focus();
```

## blur {#blur}

Quita el foco del editor.

```js
editor.blur();
```

## clear {#clear}

Vacía el documento: elimina todas las tablas, columnas, relaciones, índices y notas, desde la `4.0.0` todos los grupos de tablas y, desde la `4.2.0`, las palabras, los términos y los dominios de la pestaña Diccionario, y vacía también el historial de deshacer propio de cada hoja.  
Todos los ajustes se mantienen, incluidos la base de datos, la posición de la vista, el nivel de zoom, las opciones de vista de tabla, cada bloqueo con su valor y los scripts `Before tables` y `After tables` de la pestaña Esquema SQL, así que un archivo vaciado sigue guardando lo que guardaba. Si lo que quieres es empezar un documento nuevo, asigna `''` a `value` o llama a `setInitialValue('')`.  
Se registra en el historial, así que se puede deshacer, y emite `change`. Deshacer devuelve el documento tal como lo tenía el editor, con sus palabras, sus términos y sus dominios, y con cada ajuste bloqueado en su valor bloqueado. Se ignora mientras `readonly` está activado.

```js
editor.clear();
```

## destroy {#destroy}

Destruye por completo la instancia del editor, de modo que ya no se puede reutilizar.  
Libera los listeners y las suscripciones del editor, y destruye todos los almacenes compartidos que haya devuelto [getSharedStore](#getsharedstore).  
Un lote del flujo que un almacén compartido aún esté reteniendo se descarta con él; para enviarlo, llama antes al [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) de ese almacén.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Redefine los atajos de teclado.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` y `zoomReset` son fijos y no se pueden redefinir.  
Solo se escriben los veintiún nombres siguientes; cualquier otra cosa del objeto se ignora, incluidos los nombres fijos.  
Desde la `3.10.0`, `search` se puede redefinir y `findReplace` es nuevo. Antes, `search` era fijo. Desde la `4.0.0`, `removeSelection` es nuevo. Desde la `4.1.0`, `addTableGroup` y `groupSelectedTables` son nuevos.  
El valor de una asignación debe ser un `ShortcutOption[]`. Una cadena suelta se ignora, así que escribe `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` en lugar de `{ addTable: 'Alt+KeyN' }`.  
Se acepta un array vacío, que no asigna nada: `setKeyBindingMap({ findReplace: [] })` deja `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) a la página, y `{ search: [] }` hace lo mismo con `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac). El botón `Search` de la barra de herramientas sigue abriendo la búsqueda rápida, el botón `Explorer` de la barra de herramientas sigue abriendo y cerrando el explorador, y `Toggle Explorer` en la búsqueda rápida y en el menú contextual del lienzo sigue abriendo su búsqueda o cerrándolo; ninguno de ellos muestra un atajo para un nombre que se dejó vacío. `{ removeSelection: [] }` deja `Delete` y `Backspace` a la página, y las opciones de eliminar de los menús de tabla, nota y grupo de tablas (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) no muestran entonces ningún atajo.  
Desde la `4.1.0`, `{ addTableGroup: [] }` deja `Alt + G` (Windows/Linux) o `⌥ + G` (Mac) a la página, y `{ groupSelectedTables: [] }` deja `T` y luego `G`. `New Table Group` en la barra de herramientas del lienzo, en el menú contextual del lienzo y en la búsqueda rápida, `Group selected tables` en el menú de la tabla y `Group Selected Tables` en la búsqueda rápida siguen funcionando, sin mostrar ningún atajo. Las descripciones emergentes de los botones `New Table`, `New Memo` y `New Table Group` de la barra de herramientas del lienzo indican la primera combinación de `addTable`, `addMemo` y `addTableGroup`, o solo el botón cuando la asignación se dejó vacía.  
Desde la `4.2.0`, `addColumn` y `removeColumn` también dan a la cuadrícula de la pestaña Diccionario sus combinaciones de filas, como se explica más abajo, así que reasignar cualquiera de los dos cambia también esas combinaciones. `{ addColumn: [] }` deja la cuadrícula sin ninguna combinación para insertar filas, y las dos opciones de insertar del menú de la cuadrícula no muestran entonces ningún atajo; `{ removeColumn: [] }` la deja sin ninguna para eliminarlas, y la opción de eliminar del menú y la descripción emergente de `Delete Rows` no muestran entonces ninguno.  
La llamada es una fusión parcial: los nombres que omites conservan sus valores predeterminados, y llamarla dos veces conserva los cambios anteriores. No hay ningún getter para las asignaciones actuales: [createKeyBindingMap](#createkeybindingmap) devuelve las predeterminadas, no lo que cambió `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` y, desde la `4.1.0`, `groupSelectedTables` ceden el paso al cursor de texto: mientras el foco está en un campo de entrada, un área de texto o un `contenteditable`, `$mod + A` selecciona el texto, `Space` escribe un espacio, `Delete` y `Backspace` borran texto, y `T` y luego `G` escriben las dos letras, en lugar de llegar al lienzo. En ninguna de esas pulsaciones se cancela la acción predeterminada. Cualquier combinación a la que las reasignes se comporta igual.

Desde la `4.0.0`, `removeSelection` (`Delete` o `Backspace`) elimina la selección en la pestaña ERD como un solo paso de deshacer, sin pedir confirmación. Cuando la tabla con el foco es lo único seleccionado, hay una o varias de sus columnas seleccionadas y el zoom dibuja sus filas, elimina esas columnas; en caso contrario, elimina todas las tablas, notas y grupos de tablas seleccionados, aunque conserva las tablas de los grupos. Consulta [Eliminación de tablas y notas](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Mantener pulsada la tecla elimina una sola vez, y no se elimina nada mientras está abierto el editor de una celda, de una nota o del nombre de un grupo de tablas. Fuera de un campo de texto y de los paneles y las pestañas que retienen las asignaciones (consulta [createKeyBindingMap](#createkeybindingmap)), se cancela la acción predeterminada de la pulsación en todas las pestañas mientras el editor tiene el foco, también en un botón de la barra de herramientas con el foco, y en un editor de solo lectura, donde no elimina nada.

Desde la `4.1.0`, `addTableGroup` (`Alt+KeyG`) prepara el dibujo de `New Table Group` en la pestaña ERD, de modo que la siguiente pulsación del botón principal en el lienzo dibuja el grupo, y volver a pulsar la combinación cancela el dibujo, como hace el botón `New Table Group` de la barra de herramientas del lienzo. `groupSelectedTables` (`KeyT KeyG`, `T` y luego `G`) pone las tablas seleccionadas en un grupo nuevo y abre el editor de su nombre, como hace `Group selected tables` en el menú contextual de una tabla. Sin ninguna tabla seleccionada no añade nada; una nota o un grupo de tablas seleccionados no cuentan. Consulta [Dibujar un grupo](../guide/guides/table-groups.md#drawing-a-group) y [Agrupar las tablas seleccionadas](../guide/guides/table-groups.md#grouping-selected-tables).  
Ambas actúan solo donde los menús ofrecen un grupo: no mientras `readonly` está activado, mientras la opción de vista `Table Groups` oculta los grupos ni mientras está abierto el editor de una celda, de una nota o del nombre de un grupo de tablas. Como las demás asignaciones del lienzo, solo actúan en la pestaña ERD, y no mientras está abierta la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, el viaje en el tiempo, la vista previa de la disposición automática, `Export image` o `Map Columns`. Donde no hacen nada, se sigue cancelando la acción predeterminada de la pulsación, salvo cuando `groupSelectedTables` cede el paso al cursor de texto. En `addTableGroup` también se detiene la propagación, como en `focusView` y `zenMode`, así que un listener de `keydown` de la página en la fase de burbuja nunca la recibe.

Desde la `4.2.0`, en la pestaña [Diccionario](../guide/guides/dictionary.md#adding-and-deleting-rows), cada combinación de una sola pulsación de `addColumn` inserta bajo la selección tantas filas como abarca la selección, la misma combinación con `Shift` también pulsada las inserta encima, y cada combinación de una sola pulsación de `removeColumn` elimina las filas que abarca la selección: `Alt+Enter`, `Alt+Shift+Enter` y `Alt+Backspace` o `Alt+Delete` con los valores predeterminados. Actúan en la cuadrícula de las hojas `Domains`, `Words` y `Terms` mientras no hay ninguna edición de celda abierta. Una combinación de `addColumn` que ya incluye `Shift` no da ninguna combinación para insertar encima, y una secuencia asignada a cualquiera de los dos nombres no da nada a la cuadrícula.  
En cada una de esas pulsaciones se cancela la acción predeterminada según indica su opción y siempre se detiene la propagación, así que no añade ni elimina ninguna columna en la pestaña ERD. En la hoja `Checks` y en un editor de solo lectura no hace nada, aunque se sigue cancelando la acción predeterminada y deteniendo la propagación. En una edición de celda abierta o en el campo de búsqueda de la pestaña, las combinaciones se dejan al texto: allí se detiene su propagación, pero no se cancela su acción predeterminada, así que el campo actúa con ellas como lo haría en cualquier otro sitio (en un Mac, `⌥ + Backspace` borra una palabra). [dictionaryRowChords](#dictionaryrowchords) las enumera.

Desde la `3.10.0`, `findReplace` (`$mod+KeyF`) abre [Buscar y reemplazar](../guide/guides/find-and-replace.md). Desde la `4.1.0`, muestra u oculta el [explorador](../guide/guides/explorer.md#opening-and-closing) que lo contiene, y la pestaña Atajos de teclado lo incluye como `Toggle Explorer`.  
Mientras el botón `Explorer` de la barra de herramientas aparece pulsado (con el explorador abierto en la pestaña ERD y no oculto por el modo zen), cierra el explorador, salvo que esté abierta la búsqueda rápida, el panel Propiedades de la tabla, el generador de temas, el selector de idioma, el cuadro de diálogo `Export image` o `Map Columns`. En caso contrario, cierra cualquiera de ellos que esté abierto, pasa a la pestaña ERD desde cualquier otra pestaña y abre el explorador con el cursor de texto en su campo `Find` y la consulta seleccionada. Un editor demasiado estrecho para mostrar el explorador junto al lienzo lo mantiene abierto pero apartado, y muestra la notificación `Widen the window to show the Explorer`. Antes de la `4.1.0`, abría el panel flotante de Buscar y reemplazar, o devolvía el teclado a su campo, y nunca lo cerraba.  
No cede el paso al cursor de texto: mientras el editor tiene el foco, se captura en todas las pestañas, desde el lienzo o desde un campo de entrada dentro del editor. Se cancela la acción predeterminada de la pulsación, así que el navegador no abre su barra de búsqueda, y se detiene su propagación, así que ningún listener de `keydown` de la página en la fase de burbuja la recibe. Con el editor de una celda o de una nota abierto, desde la `4.0.0` el del nombre de un grupo de tablas o, desde la `4.2.0`, una edición de celda en la cuadrícula de la pestaña Diccionario, se sigue cancelando la acción predeterminada y deteniendo la propagación, pero no hace nada. En este último caso, `search` tampoco hace nada, así que se conserva el texto escrito hasta entonces.  
Mientras está abierto el visor de diferencias, el viaje en el tiempo o la vista previa de la disposición automática, en cualquier pestaña, o mientras un IME aún está componiendo, no se cancela su acción predeterminada ni se detiene su propagación, así que la recibe la búsqueda propia del navegador o del host. Dentro del explorador, en una pulsación aún en composición se detiene allí la propagación, aunque no se cancela la acción predeterminada. Cualquier combinación a la que reasignes `findReplace` se comporta igual.

`focusView` solo actúa en la pestaña ERD. Con al menos una tabla seleccionada, abre la pestaña Visualización en modo Flow, acotada a esas tablas y a todas las tablas que están a una relación de distancia; una nota o un grupo de tablas seleccionados no cuentan, y sin ninguna tabla seleccionada no hace nada. Consulta [Centrarse en tablas](../guide/guides/visualization.md#focusing-on-tables).

`undo` y `redo` actúan según la pestaña. En la pestaña ERD, deshacen y rehacen en el historial del documento. Desde la `4.2.0`, en la pestaña Diccionario deshacen y rehacen en el historial propio de la hoja que se muestra, y no hacen nada en la hoja `Checks`; consulta [Hojas del diccionario](../guide/guides/undo-redo.md#dictionary-sheets). En el modo Flow de la pestaña Visualización, retroceden y avanzan como hacen [`Previous table` y `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), sin tocar el historial del documento. En las demás pestañas, y en el modo Graph, no deshacen nada.

`stop` (`Escape`) en la pestaña ERD pone fin al editor abierto de una celda o de una nota, o a una relación que se esté dibujando, y deja la selección como está. Desde la `4.0.0`, también pone fin al editor del nombre de un grupo de tablas, sin escribir ningún nombre, y a un dibujo de `New Table Group`. El editor llama a `preventDefault()` en esa pulsación.  
Si no hay nada de eso abierto, `Escape` anula la selección y quita el foco de la celda, y no se cancela su acción predeterminada. Por tanto, salir de una edición y anular la selección requiere dos pulsaciones.  
Desde la `4.2.0`, mientras se muestra la lista de términos de una celda del nombre lógico (consulta [Completar nombres de términos](../guide/guides/logical-names.md#completing-term-names)), el primer `Escape` solo cierra la lista y deja el editor abierto. En esa pulsación se cancela la acción predeterminada y se detiene la propagación en la celda, así que no la reciben ni `stop` ni un listener de `keydown` de la página en la fase de burbuja.  
Salvo en el explorador, en los formatos de `Import` de la [pantalla de bienvenida](#enablewelcomescreen), en la lista de términos de una celda del nombre lógico, en la pestaña [Diccionario](../guide/guides/dictionary.md#keys-on-the-tab) y en los selectores y cuadros de diálogo que se indican más abajo, el editor nunca detiene la propagación de `Escape`, así que una página que escucha esa tecla por su cuenta, por ejemplo para cerrar un cuadro de diálogo propio, recibe las dos pulsaciones y puede omitir aquella cuyo `defaultPrevented` es `true`.  
Mientras está abierta la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, la vista previa de la disposición automática o el viaje en el tiempo, `Escape`, en cambio, cierra ese elemento y deja la selección como está. En esa pulsación tampoco se cancela la acción predeterminada.  
Desde la `4.0.0`, un cuadro de diálogo [`Export image`](../guide/guides/file-import-export.md#image) o [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) abierto también recibe `Escape`: se cierra y deja la selección como está. Cada uno toma el teclado al abrirse, y en ese `Escape` se cancela la acción predeterminada y se detiene la propagación.  
Desde la `4.1.0`, un `Escape` pulsado con el foco dentro del [explorador](../guide/guides/explorer.md#keys-in-the-explorer), en su árbol, sus campos o sus botones, devuelve el teclado al lienzo y deja el explorador abierto y la selección como está. El editor llama tanto a `preventDefault()` como a `stopPropagation()` en él, así que nunca llega a un listener de `keydown` de la página en la fase de burbuja.  
Un `Escape` en el lienzo nunca cierra el explorador. Antes de la `4.1.0`, un `Escape` dentro del panel de Buscar y reemplazar lo cerraba, y uno en el lienzo lo cerraba con la misma pulsación que anulaba la selección.  
Desde la `4.0.0`, el selector de idioma y el selector de color se cierran con `Escape`: dentro de ellos se cancela su acción predeterminada y se detiene su propagación, y en el lienzo los cierra con la misma pulsación que anula la selección, sin cancelar la acción predeterminada ni detener la propagación.  
Un `Escape` pulsado mientras un IME aún está componiendo pertenece a la composición. Deja como está el editor abierto y no se cancela su acción predeterminada, así que una página también puede omitir una pulsación cuyo `isComposing` es `true`, o cuyo `keyCode` es `229`. Dentro del explorador, en esa pulsación, como en cualquier tecla pulsada allí en plena composición, también se detiene la propagación, y el teclado se queda en el campo.  
Antes de la `3.9.2`, un solo `Escape` ponía fin a una edición o a un dibujo y además anulaba la selección, y el editor nunca cancelaba su acción predeterminada.

### createKeyBindingMap {#createkeybindingmap}

Desde la `3.9.2`, el paquete exporta `createKeyBindingMap()` y, con ella, los tipos `KeyBindingMap`, `KeyBindingName` y `ShortcutOption`.  
Devuelve las combinaciones de teclas predeterminadas, los 28 nombres, incluidos los fijos, como un mapa nuevo en cada llamada, así que cambiar el mapa que devuelve no cambia nada más.  
Es el punto de partida de todos los editores, y una llamada a `setKeyBindingMap` no se refleja en él.  
De estas cuatro, solo `createKeyBindingMap` es una exportación en tiempo de ejecución; las otras tres son tipos. Desde la `4.2.0`, [dictionaryRowChords](#dictionaryrowchords) se exporta junto a ella.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Cada `shortcut` es una combinación en la sintaxis de [tinykeys](https://github.com/jamiebuilds/tinykeys) que nombra su tecla por `KeyboardEvent.code`, donde [`$mod`](#mod) es `⌘` en macOS y `Control` en los demás sistemas.  
Desde la `4.0.0`, el editor lee estas combinaciones por sí mismo en lugar de mediante tinykeys, con la misma sintaxis. Una tecla coincide por su `code`, o por su `key` en mayúsculas o minúsculas, y una pulsación solo coincide si se mantienen pulsadas exactamente las teclas modificadoras que nombra. `AltGraph` cuenta como `Control` y `Alt` en Windows y como `Alt` en macOS. Las pulsaciones separadas por un espacio forman una secuencia, que vuelve a empezar tras un segundo sin ningún evento keydown.  
Desde la `4.1.0`, una de las combinaciones predeterminadas es una secuencia: `groupSelectedTables` es `KeyT KeyG`, `T` y luego `G`. Una secuencia se ejecuta con la pulsación que la completa, y solo esa pulsación recibe su `preventDefault` y su `stopPropagation`, así que con los valores predeterminados `T` llega a la página y solo en `G` se cancela la acción predeterminada. Los menús, la búsqueda rápida y la pestaña Atajos de teclado muestran una secuencia como una tecla por pulsación.  
Los nombres fijos están asignados a `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) y `$mod+Digit0` (`zoomReset`). `edit` y `stop` no llevan indicadores; los otros cinco llevan `preventDefault` y `stopPropagation`. El resto son los valores predeterminados de más arriba, entre ellos `search` y `findReplace`.

El editor las escucha en su propio elemento, así que un host que capture las teclas antes que el editor, con atajos globales o con un listener de `keydown` en la fase de captura, tiene que dejarlas pasar mientras el editor tiene el foco.  
Construye la lista de las que hay que dejar pasar a partir de `createKeyBindingMap()`, con las asignaciones que pasaste a `setKeyBindingMap` en lugar de las predeterminadas.  
Desde la `3.10.0`, esa lista incluye `$mod+KeyF`, la combinación de búsqueda del propio navegador. Un host que quiera mantener su propia búsqueda en esa combinación pasa `setKeyBindingMap({ findReplace: [] })`.  
Desde la `4.0.0`, también incluye `Delete` y `Backspace` sin modificadores. Un host que quiera conservar esas teclas pasa `setKeyBindingMap({ removeSelection: [] })`.  
Desde la `4.1.0`, también incluye `Alt+KeyG` y la secuencia `KeyT KeyG`, que llega como una sola cadena: divídela por el espacio y deja pasar cada pulsación, incluidas `T` y `G` sin modificadores, ya que una secuencia a la que le falta una pulsación nunca se completa. Un host que quiera conservar esas teclas pasa `setKeyBindingMap({ addTableGroup: [] })` o `setKeyBindingMap({ groupSelectedTables: [] })`.  
Desde la `4.2.0`, añade a esa lista las combinaciones que devuelve [dictionaryRowChords](#dictionaryrowchords) para el mismo mapa, entre ellas `Alt+Shift+Enter`. Un host que quiera conservar esas teclas pasa `setKeyBindingMap({ addColumn: [] })` o `setKeyBindingMap({ removeColumn: [] })`, lo que también las retira de añadir y eliminar columnas en la pestaña ERD.

Mientras el foco está dentro del explorador, en su árbol, en sus campos `Find` y `Replace` o en sus botones, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` y `zoomReset` pasan al editor, así que `findReplace` actúa allí igual que en el lienzo. Cualquier otra asignación, tal como esté configurada, se detiene en el explorador, una secuencia por su última pulsación (una `G` sin modificadores con los valores predeterminados), y lo mismo ocurre con las teclas de flecha, `Tab`, `Enter`, `Space`, `Home`, `End` y cualquier tecla pulsada mientras un IME aún está componiendo. Salvo en `Escape`, que devuelve el teclado al lienzo, en todas ellas se detiene la propagación sin cancelar la acción predeterminada, así que actúan como teclas normales en los campos, los botones y el árbol del explorador y no llegan ni al lienzo ni a un listener de `keydown` de la página en la fase de burbuja: allí `Alt + N` no añade ninguna tabla y `Delete` no elimina nada. En las teclas que recorren las filas del árbol, las contraen o van a ellas, y en `Enter` en el campo `Find` o `Replace`, que recorre las coincidencias o reemplaza, también se cancela la acción predeterminada.  
Cualquier otra tecla, como la combinación de guardar o de la paleta de comandos de un host, sigue llegando a la página como de costumbre. Consulta [Teclas en el explorador](../guide/guides/explorer.md#keys-in-the-explorer). Antes de la `4.1.0`, el panel flotante de Buscar y reemplazar retenía las teclas de la misma forma, salvo `Home`, `End`, la última pulsación de una secuencia y `Space` mientras `handTool` estaba asignado a otra tecla.  
Desde la `4.0.0`, el selector de idioma retiene las teclas de la misma forma: pasan las mismas siete asignaciones, y en cualquier otra asignación (desde la `4.1.0`, una secuencia por su última pulsación), en las teclas de flecha y en `Tab` se detiene allí la propagación sin cancelar la acción predeterminada, igual que en cualquier tecla pulsada mientras un IME aún está componiendo. `↑`, `↓`, `Home`, `End`, `Enter` y `Space` sobre una de sus filas recorren las filas o eligen una, y además se cancela su acción predeterminada.

Desde la `4.2.0`, la pestaña [Diccionario](../guide/guides/dictionary.md#keys-on-the-tab) también retiene las teclas, y solo pasan al editor `search`, `findReplace`, `undo` y `redo`. `undo` y `redo` actúan sobre el historial propio de la hoja que se muestra y, con una edición de celda abierta o con el foco en el campo de búsqueda de la pestaña, se dejan al texto: allí se detiene su propagación, pero no se cancela su acción predeterminada. `search` y `findReplace` no hacen nada mientras hay una edición de celda abierta, como se indica más arriba. Las combinaciones de filas actúan en la cuadrícula, como se describe más arriba en `addColumn` y `removeColumn`.  
Cualquier otra asignación, tal como esté configurada, se detiene en la pestaña, una secuencia por su última pulsación, y lo mismo ocurre con las teclas de flecha, `Tab`, `Enter`, `Space`, `Home`, `End` y cualquier tecla pulsada mientras un IME aún está componiendo. Ninguna de ellas llega al lienzo ni a un listener de `keydown` de la página en la fase de burbuja: allí `Alt + N` no añade ninguna tabla y `Delete` no elimina nada del diagrama. Los eventos de copiar, cortar y pegar de la pestaña también se detienen allí, así que el diagrama nunca los toma como propios. Cualquier otra tecla sigue llegando a la página como de costumbre.

### dictionaryRowChords {#dictionaryrowchords}

Desde la `4.2.0`, el paquete exporta `dictionaryRowChords()`. Devuelve, como un `ShortcutOption[]` nuevo en cada llamada, todas las combinaciones con las que la cuadrícula de la pestaña Diccionario inserta o elimina filas con el mapa de combinaciones de teclas que le pasas.  
Por orden, son las combinaciones de una sola pulsación de `addColumn`, que insertan filas bajo la selección; cada una de ellas con `Shift` también pulsada, que insertan filas encima, ninguna para una combinación que ya incluye `Shift`; y las combinaciones de una sola pulsación de `removeColumn`, que eliminan filas. Cada una conserva el `preventDefault` y el `stopPropagation` de la asignación de la que procede, y se omite toda secuencia. Consulta [Añadir y eliminar filas](../guide/guides/dictionary.md#adding-and-deleting-rows).  
La combinación que inserta filas encima, `Alt+Shift+Enter` con los valores predeterminados, no está en ninguna asignación, así que un host que compara las teclas modificadoras de forma exacta y construye su lista de teclas que dejar pasar solo a partir de [createKeyBindingMap](#createkeybindingmap) nunca la deja pasar. Deja pasar las dos listas, como hace el plugin de Obsidian.  
Solo lee el mapa que recibe, no las asignaciones del elemento, así que pásale el mapa a partir del que construiste tu lista de teclas.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Cambia la tecla `Control` según el entorno.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabla de atajos {#shortcut-table}

Usa las propiedades `key, code` del evento de teclado.  
Usa `code` para posiciones absolutas y `key` para valores de entrada.

| Windows        | macOS           | `key`          | `code`                         |
| -------------- | --------------- | -------------- | ------------------------------ |
| N/A            | `Command` / `⌘` | `Meta`         | `MetaLeft` / `MetaRight`       |
| `Alt`          | `Option` / `⌥`  | `Alt`          | `AltLeft` / `AltRight`         |
| `Control`      | `Control` / `^` | `Control`      | `ControlLeft` / `ControlRight` |
| `Shift`        | `Shift`         | `Shift`        | `ShiftLeft` / `ShiftRight`     |
| `Space`        | `Space`         | N/A            | `Space`                        |
| `Enter`        | `Return`        | `Enter`        | `Enter`                        |
| `Esc`          | `Esc`           | `Escape`       | `Escape`                       |
| `Backspace`    | `Delete` / `⌫`  | `Backspace`    | `Backspace`                    |
| `Delete`       | `fn` + `Delete` | `Delete`       | `Delete`                       |
| `1`, `2`, etc. | `1`, `2`, etc.  | `1`, `2`, etc. | `Digit1`, `Digit2`, etc.       |
| `a`, `b`, etc. | `a`, `b`, etc.  | `a`, `b`, etc. | `KeyA`, `KeyB`, etc.           |
| `-`            | `-`             | `-`            | `Minus`                        |
| `=`            | `=`             | `=`            | `Equal`                        |
| `+`            | `+`             | `+`            | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Establece un tema predefinido.  
Los valores predeterminados son `appearance: 'dark'`, `grayColor: 'slate'` y `accentColor: 'indigo'`.  
Cada campo se aplica por separado, así que una llamada parcial deja los otros dos como están. Un valor que no sea uno de los nombres de abajo se ignora, y la llamada nunca lanza un error.  
Desde la `4.0.0`, `appearance` también admite `'system'`, el `System` del generador de temas. Muestra el modo claro u oscuro que indica el sistema operativo, o el que establece [setSystemAppearance](#setsystemappearance), y cambia cuando este cambia.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Desde la `4.0.0`, indica el modo claro u oscuro que muestra la apariencia `'system'`, para un host con su propio modo claro y oscuro, como el tema de un IDE. Mientras haya uno indicado, se ignoran los cambios del sistema operativo.  
`null`, o cualquier valor distinto de `'dark'` o `'light'`, vuelve a seguir al sistema operativo.  
Mientras la apariencia es `'light'` o `'dark'`, no cambia nada en pantalla, pero el valor se conserva y se aplica en cuanto la apariencia pasa a ser `'system'`. En caso contrario, se aplica al instante. No emite nada, y `changePresetTheme` sigue indicando `'system'`.  
Los hosts de VS Code, JetBrains y Obsidian lo llaman con su propio modo claro u oscuro, y de nuevo cada vez que este cambia.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Permite personalizar el tema.  
Cada llamada sustituye toda la capa personalizada, así que vuelve a pasar el objeto completo para cambiar un token sobre una personalización existente, y pasa `{}` para volver al tema predefinido.  
Solo se conservan los nombres de token de abajo, con valores de cadena; cualquier otra cosa se descarta sin error.  
La capa se sitúa sobre el tema predefinido, así que un `setPresetTheme` posterior cambia el tema predefinido de debajo mientras tus personalizaciones se mantienen.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` y `memoShadow` son el color de la sombra que proyectan las tablas y las notas en el lienzo ERD. El tema predefinido oscuro los deja en `transparent`, que no proyecta ninguna, igual que pasar `none` o una cadena vacía a `setTheme`; el tema predefinido claro usa `rgba(0, 0, 0, 0.18)`.

Desde la `4.0.0`, hay nueve tokens más:

- `tableGroupHeaderBackground`, `tableGroupBackground` y `tableGroupBorder` dan color a la barra de título, al cuerpo y al contorno de un [grupo de tablas](../guide/guides/table-groups.md) que no tiene color propio.
- `toastSuccess` y `toastError` dan color a la marca de una notificación que indica cómo terminó algo.
- `findReplaceError` y `mapColumnsError` dan color a los errores que muestran Buscar y reemplazar y el cuadro de diálogo Asignar columnas. Antes, Buscar y reemplazar usaba `diffDeleteForeground`, así que personalizar ese token ya no le cambia el color.
- `schemaSqlWarningBackground` y `schemaSqlWarningForeground` dan color a los avisos de las opciones de la pestaña Esquema SQL.

Desde la `4.1.0`, hay nueve tokens más:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` y `treeMatch` dan color al árbol que comparten el [explorador](../guide/guides/explorer.md#the-tree) y el [visor de diferencias](../guide/guides/table-related-functions.md#diff-viewer): su fondo, que también rellena los campos `Find` y `Replace` del explorador; una fila bajo el puntero, la fila en la que está el teclado mientras el árbol tiene el foco y un botón bajo el puntero en el encabezado y la búsqueda del explorador; la fila de la coincidencia actual de la búsqueda; el texto atenuado, como los recuentos, los tipos de datos y las flechas para contraer; y la marca detrás del texto que encontró una búsqueda.
- `explorerBackground` y `explorerBorder` dan color al panel del explorador y a sus líneas: su borde junto al lienzo, la línea bajo su búsqueda y los bordes de sus campos y de los botones que despliega `Search In`. `explorerBorder` también dibuja el borde del árbol del visor de diferencias, la línea bajo su campo `Filter by name` y el borde de ese campo. Los iconos de clave del explorador usan `keyPK`, `keyFK` y `keyPFK`.
- `diffModifyForeground` y `diffRenameForeground` dan color a lo que el visor de diferencias marca como modificado y renombrado, en su árbol y en ambos documentos. `diffModifyForeground` también traza el contorno de una tabla, nota o grupo de tablas que se ha movido, ha cambiado de tamaño, de color o de grupo, independientemente de qué más haya cambiado en él, y dibuja el conector de una clave externa que ha cambiado.

`diffInsertForeground` y `diffDeleteForeground` dan color ahora a lo que el visor de diferencias marca como añadido y eliminado, en su árbol y en el documento que lo contiene, tanto en el texto como en los contornos y los conectores. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` y `diffCrossForeground` se eliminaron en la `4.1.0`, porque el visor de diferencias ya no rellena celdas. `setTheme` los descarta como cualquier otro nombre que no esté en `Theme`, y sus hooks, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` y `--erd-editor-diff-cross-foreground`, ya no se leen.

Desde la `4.2.0`, hay doce tokens más:

- `columnHandleBackground` y `columnHandleBorder` dan color al relleno y al contorno del [asa de arrastre de la columna](../guide/guides/table-editing.md#rearranging-and-moving-columns), que se dibuja justo fuera del borde izquierdo de una tabla, junto a la fila de la columna con el foco, y `columnHandleHoverBackground` y `columnHandleHoverBorder` los sustituyen mientras el puntero está sobre ella. Sus marcas de agarre usan `foreground` y, bajo el puntero, `active`.
- `dictionaryErrorForeground` y `dictionaryWarningForeground` dan color a lo que detectan las [comprobaciones del diccionario](../guide/guides/dictionary.md#what-each-check-finds), un error o una advertencia: un nombre señalado en el lienzo ERD (consulta [Marcas en el lienzo](../guide/guides/dictionary.md#marks-on-the-canvas)), el texto de una celda señalada en las hojas `Domains`, `Words` y `Terms` y el recuento de `Checks`. `dictionaryErrorBackground` y `dictionaryWarningBackground` rellenan esa celda. `dictionaryErrorForeground` también da color a la herramienta `Delete Rows` bajo el puntero.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` y `dictionaryHeaderSelect` dan color a la hoja de la pestaña [Diccionario](../guide/guides/dictionary.md#the-sheets): sus celdas, cuyo color también rellena el campo de búsqueda de la pestaña y la lista de dominios de un término; sus encabezados de columna y sus números de fila; las líneas entre celdas, que también dibujan la barra de la pestaña y los bordes de sus campos; y un encabezado cuya fila o columna toca la selección. El resto de la hoja usa tokens compartidos: `foreground` para las etiquetas de los encabezados, `active` para el texto de las celdas, `grayColor7` para la línea que separa los encabezados de columna y los números de fila de las celdas, `focus` para el borde de la celda activa, `accentColor9` para el borde de un rango seleccionado y, con un 20 % de opacidad, para su relleno, `accentColor6` para el encabezado de una fila o columna seleccionada entera, `grayColor3` para las celdas de solo lectura y los tokens de la barra de desplazamiento. Un `accentColor9` que no esté escrito como `#rgb` o `#rrggbb` deja sin relleno un rango seleccionado.

#### Variables CSS {#css-variables}

Cada token de `Theme` tiene un hook CSS correspondiente cuyo nombre es `--erd-editor-` seguido de la clave en kebab-case: `grayColor10` es `--erd-editor-gray-color-10`, `keyPK` es `--erd-editor-key-pk` y `keyPFK` es `--erd-editor-key-pfk`.  
Los hooks se heredan dentro del editor, así que defínelos allí donde quieras que se apliquen. En `:root` aplican el tema a todos los editores de la página; en el propio elemento, solo a ese.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Desde la `3.4.0`, los tokens `dargSelect`, mal escritos, se escriben `dragSelect`, y sus hooks pasaron de `--erd-editor-darg-select-background` y `--erd-editor-darg-select-border` a `--erd-editor-drag-select-background` y `--erd-editor-drag-select-border`. Una hoja de estilos que siga usando los nombres antiguos se ignora.

<details>
<summary>Valores predeterminados del tema</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Idioma de la interfaz {#display-language}

Desde la `4.0.0`, el texto propio del editor —sus menús, paneles y cuadros de diálogo, la búsqueda rápida, las notificaciones y las palabras que dibuja en el diagrama, como `unnamed`, incluidas las exportaciones de imagen— está disponible en 25 idiomas. Los nombres de tablas y columnas, el SQL, los tipos de datos y el código generado nunca se traducen. Consulta [Idioma y tema](../guide/guides/language-and-theme.md).  
Antes de que se llame a [setLocale](#setlocale) o se elija un idioma, el editor se muestra en inglés, o sigue `'system'` mientras [enableLocalePicker](#enablelocalepicker) está activado.  
El editor establece `lang` y `dir` en su propia raíz dentro del shadow root cerrado, nunca en el elemento host ni en la página, así que una página de derecha a izquierda no invierte el editor y un idioma de derecha a izquierda no invierte la página. El hebreo, el árabe y el persa disponen la interfaz del editor de derecha a izquierda; el diagrama en sí nunca se refleja. Desde la `4.1.0`, el [explorador](../guide/guides/explorer.md) se queda a la izquierda del lienzo en todos los idiomas, aunque en esos tres sus propias filas se leen de derecha a izquierda.  
El paquete exporta los tipos `LocaleCode` (uno de los códigos de abajo) y `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Código  | Se muestra como      | Idioma               |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesio            |
| `de-DE` | Deutsch              | Alemán               |
| `en`    | English              | Inglés               |
| `es-ES` | Español              | Español              |
| `eu-ES` | Euskara              | Euskera              |
| `fr-FR` | Français             | Francés              |
| `it-IT` | Italiano             | Italiano             |
| `nl-NL` | Nederlands           | Neerlandés           |
| `pl-PL` | Polski               | Polaco               |
| `pt-PT` | Português            | Portugués            |
| `pt-BR` | Português Brasileiro | Portugués de Brasil  |
| `ro-RO` | Română               | Rumano               |
| `sk-SK` | Slovenčina           | Eslovaco             |
| `sl-SI` | Slovenščina          | Esloveno             |
| `sv-SE` | Svenska              | Sueco                |
| `tr-TR` | Türkçe               | Turco                |
| `ru-RU` | Русский              | Ruso                 |
| `uk-UA` | Українська           | Ucraniano            |
| `he-IL` | עברית                | Hebreo               |
| `ar-SA` | العربية              | Árabe                |
| `fa-IR` | فارسی                | Persa                |
| `ja-JP` | 日本語               | Japonés              |
| `zh-CN` | 简体中文             | Chino simplificado   |
| `zh-TW` | 繁體中文             | Chino tradicional    |
| `ko-KR` | 한국어               | Coreano              |

### setLocale {#setlocale}

Establece el idioma de la interfaz: `'system'` o uno de los códigos de arriba. Cualquier otra cosa, como un `'ko'` a secas, un código desconocido o un valor que no sea una cadena, se ignora sin error.  
Se aplica antes de devolver el control, así que un idioma establecido antes de insertar el elemento ya está en su primer fotograma.  
No emite nada, ni `changeLocale` ni `change`, y no toca `value`, el historial de deshacer ni ningún almacén compartido.  
La elección se mantiene tanto si `enableLocalePicker` está activado como desactivado, y `setLocale('system')` sigue al sistema también con el selector desactivado.  
El editor no guarda nada. Para conservar la elección de un lector, escucha [changeLocale](#changelocale) y vuelve a pasarla en la siguiente carga.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Indica el idioma al que corresponde `'system'`, como una etiqueta BCP 47, para un host con su propio idioma de la interfaz. Los hosts de VS Code, JetBrains y Obsidian lo llaman con su propio idioma de la interfaz.  
Se eliminan los espacios de los extremos de la etiqueta. `null`, una cadena en blanco o un valor que no sea una cadena vuelve a `navigator.languages` del navegador, que el editor sigue a medida que cambia.  
Solo importa mientras la opción vigente es `'system'`, y se aplica al instante. La fila `System` del selector indica el idioma al que se resuelve.  
La etiqueta, o cada uno de los idiomas del navegador por orden, se resuelve, por su subetiqueta de idioma, al primer idioma que tenga el editor, sin distinguir mayúsculas y minúsculas y sin tener en cuenta los guiones bajos: `de-AT` da `de-DE` y `en-GB` da `en`. El chino se resuelve por su escritura, `Hant` da `zh-TW` y `Hans` da `zh-CN`, y, si no la indica, por región: `TW`, `HK` y `MO` dan `zh-TW` y cualquier otra, `zh-CN`. `pt` da `pt-BR`, salvo que se indique una región distinta de `BR`. Cuando nada coincide, el editor se muestra en inglés.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Carga un archivo de Esquema SQL.  
De forma predeterminada sustituye el documento actual en lugar de fusionarse con él; consulta `mode` más abajo. Se conservan los ajustes que ya tienes, incluidos cada bloqueo y su valor bloqueado, salvo la posición de la vista y el nivel de zoom, y las tablas se colocan una vez leído el archivo, en filas salvo que `placement`, más abajo, indique otra cosa. Con `Viewport` bloqueado, `value` escribe entonces la vista en la que empieza la importación, el origen `0, 0` con el nivel de zoom `1`. Por tanto, un documento importado en un elemento que nunca recibió un valor tiene todos los bloqueos activados, como un documento nuevo.  
Desde la `4.2.0`, una sustitución también conserva las palabras, los términos y los dominios del documento, que el texto no puede contener, con el historial de deshacer de cada hoja de la pestaña Diccionario, y deshacer o rehacer la importación también los conserva. En cambio, un [setSchemaJSON](#setschemajson) que sustituye y la asignación de `value` toman los que contiene su documento.  
Se registra en el historial, lo que permite `Undo, Redo`, y emite `change`. Una cadena vacía se ignora, y la llamada no hace nada mientras `readonly` está activado.  
`setSchemaGraphQL`, `setSchemaDBML` y `setSchemaAML` se comportan igual, y sus analizadores nunca fallan: un texto que no pueden leer carga un documento vacío en lugar de lanzar un error.  
Desde la `4.0.0`, los cuatro admiten un segundo argumento opcional, `{ placement, mode }`:

- `placement: 'grid'`, el valor predeterminado, coloca las tablas en filas al instante, como antes, y la llamada no devuelve nada.
- `placement: 'auto'` primero dispone las tablas según sus relaciones, como hace `Import` en el editor, y devuelve una `Promise` que se resuelve una vez que la importación ha quedado colocada como un solo paso de deshacer. Con menos de dos tablas, sin ninguna relación, si la disposición falla, en una página sin `SharedWorker` o con `Cancel` en la notificación `Placing tables`, se colocan en filas. Una carga entretanto —otra importación que sustituye, la asignación de `value`, `setInitialValue()`, `clear()`, la carga de un colaborador o deshacer o rehacer una carga o `clear()`— la deja sin efecto, y la `Promise` se resuelve sin haber cargado nada. Las importaciones colocadas de este modo quedan en el orden en que empezaron.
- `mode: 'replace'`, el valor predeterminado, sustituye el documento. `mode: 'append'` añade el archivo debajo del diagrama, como hace [Importar y añadir](../guide/guides/file-import-export.md#import-and-add), y deja como están todas las tablas que ya había y todos los ajustes salvo la pestaña y la posición de la vista. Desde otra pestaña, primero se pasa a la pestaña ERD. Las tablas nuevas, y los grupos de tablas que aporta un archivo DBML mientras los grupos de tablas se muestran, pasan a ser la selección, y la vista se desplaza hasta ellos salvo que ya se vean bien, según la regla que sigue todo salto desde la `4.1.0`; consulta [Dónde termina un salto](../guide/guides/table-related-functions.md#where-a-jump-lands). Un solo deshacer elimina toda la adición. Un texto que no puede leer no añade nada y deja el documento como está.

Mientras `readonly` está activado, una sustitución se ignora, una adición no añade nada y una llamada con `placement: 'auto'` se resuelve al instante.  
Desde la `3.10.0`, `setSchemaSQL` lee el archivo según la base de datos actual del documento: con Databricks seleccionado, las cadenas entre comillas simples siguen las secuencias de escape con barra invertida de Spark. Consulta [Comentarios](../guide/guides/file-import-export.md#comments).  
Desde la `3.10.0`, `setSchemaSQL` lee un `UNIQUE` sobre dos o más columnas como un solo índice único en lugar de un indicador Único en cada columna. Consulta [Claves únicas e índices](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Desde la `3.10.0`, las importaciones de SQL, DBML y AML conservan las acciones `ON DELETE` y `ON UPDATE` de las claves externas que leen.  
Desde la `4.0.0`, `setSchemaSQL` conserva la expresión `DEFAULT` completa de una columna, lee `ADD DEFAULT … FOR` de SQL Server y sus comentarios `MS_Description`, convierte las columnas serial y de identidad de PostgreSQL en Incremento automático, conserva `UNSIGNED` y `ZEROFILL` en un tipo de datos y lee una clave principal que `ALTER TABLE … ADD PRIMARY KEY` marca como `CLUSTERED`, `NONCLUSTERED` o `USING BTREE`. Consulta [Esquema SQL](../guide/guides/file-import-export.md#schema-sql).  
Consulta [Importar o exportar archivos](../guide/guides/file-import-export.md) para ver la sintaxis que acepta cada analizador.

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Carga un documento GraphQL SDL.  
Las definiciones de tipos de objeto se convierten en tablas, y un campo cuyo tipo es otra tabla se convierte en una relación.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Carga un archivo DBML, el formato que usan dbdiagram.io y dbdocs.  
Desde la `4.0.0`, cada `TableGroup` se convierte en un [grupo de tablas](../guide/guides/table-groups.md), y el `headercolor` de una tabla pasa a ser su color. Consulta [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Carga un archivo AML (Azimutt Markup Language). Se aceptan tanto la sintaxis actual como la antigua v1.  
Desde la `4.0.0`, el color de una entidad, uno de los nombres de color de Azimutt o un valor hexadecimal entre comillas, pasa a ser el color de su tabla. Consulta [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Desde la `4.0.0`, carga un documento `.erd.json`, como el texto que devuelve [value](#value).  
En su `mode: 'replace'` predeterminado, carga el documento como lo hace asignar `value`: se registra en el historial, emite `change` y toma los bloqueos del documento de la misma forma y, desde la `4.2.0`, las palabras, los términos y los dominios del documento sustituyen a los del editor. A diferencia de `value`, una cadena vacía o un valor que no sea una cadena se ignora en lugar de empezar un documento nuevo. Un texto que no es JSON vacía el documento, igual que con `value`.  
`mode: 'append'` añade las tablas, relaciones, índices, notas y grupos de tablas del documento debajo del diagrama con ids nuevos, conserva sus posiciones relativas y omite los ajustes del documento, como hace [Importar y añadir](../guide/guides/file-import-export.md#import-and-add) con un archivo `json`. Desde la `4.2.0`, conserva los nombres lógicos y los indicadores de nombre derivado de las tablas y columnas, pero deja fuera las palabras, los términos y los dominios del documento, así que ninguna de sus columnas queda vinculada a un dominio. Un texto que no puede leer, o un documento sin ninguna tabla ni nota, no añade nada. En caso contrario, queda colocado como una adición de [setSchemaSQL](#setschemasql), con sus notas y grupos de tablas nuevos seleccionados junto con sus tablas, cada tipo mientras se muestra.  
Devuelve el control una vez que el documento ha quedado colocado, y se ignora mientras `readonly` está activado.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporta el estado actual del editor como Esquema SQL.  
Si no se especifica `databaseVendor`, funciona según el proveedor configurado actualmente. Un nombre que no está en la lista de abajo se trata del mismo modo, sin lanzar un error.  
Los nombres se entrecomillan con el tipo de delimitador que muestra el editor. Mientras `Bracket Type` está [bloqueado](../guide/guides/settings.md#lock), puede ser distinto del que guarda `value`, que es con el que entrecomilla [`erd_read`](../mcp/tools.md#reading-a-document) de un agente de programación. Los nombres que se escriben son siempre los físicos, sea cual sea la vista de nombres.  
Desde la `4.0.0`, un argumento opcional `options` elige las sentencias y la cabecera, como hacen las opciones de la pestaña [Esquema SQL](../guide/guides/schema-sql.md), y, desde la `4.2.0`, si los nombres lógicos rellenan los comentarios vacíos. `SchemaSQLOptions` se exporta como tipo.

- `statements`: `'create'`, el valor predeterminado; `'ifNotExists'`, que escribe `IF NOT EXISTS` en MySQL, MariaDB, PostgreSQL, SQLite y Databricks y recurre a `'create'` en las demás; o `'recreate'`, que elimina las tablas antes de crearlas, aunque Snowflake escribe `CREATE OR REPLACE TABLE` en su lugar.
- `header`: `'none'`, el valor predeterminado; `'use'`, que cambia a la base de datos o al esquema del documento; o `'createAndUse'`, que primero lo crea si no existe y luego cambia a él. Una base de datos que no admite la opción pedida recurre a otra como hace la pestaña: Oracle escribe `'use'` para `'createAndUse'`, PostgreSQL no escribe ninguna cabecera para `'use'` y SQLite no escribe ninguna. Solo se escribe una cabecera mientras el nombre de la base de datos del documento es un identificador simple: letras ASCII, dígitos y `_`, sin empezar por un dígito.
- `logicalNameAsComment`, desde la `4.2.0`: `true` escribe el nombre lógico de una tabla o de una columna como su comentario donde su propio comentario está vacío o solo contiene espacios en blanco y el nombre lógico no, en la forma en que esa base de datos escribe un comentario. Un comentario con texto se escribe como antes. Solo `true` lo activa: omitirlo, `false` o cualquier otro valor, como `'true'` o `1`, no escriben ningún nombre lógico. Hace lo mismo que el interruptor [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) de la pestaña.

Una opción omitida, o una con un valor desconocido, se interpreta como su valor predeterminado, así que una llamada sin opciones escribe sentencias `CREATE` simples sin cabecera, como antes.  
Desde la `4.0.0`, la salida siempre incluye los scripts `Before tables` y `After tables` del documento, en este orden: cabecera, script previo, sentencias de eliminación, tablas y script posterior. Las opciones `Statements`, `Header`, `Write logical names into empty comments` y `Tables` de la propia pestaña Esquema SQL nunca afectan a esta llamada, que siempre escribe el documento completo.  
Desde la `3.10.0`, cada clave externa lleva las cláusulas `ON DELETE` y `ON UPDATE` de la relación. Una cláusula solo se escribe cuando su acción está establecida y el proveedor la acepta, así que una acción que ese proveedor no admite se omite y se aplica su valor predeterminado. Desde la `4.0.0`, Snowflake solo acepta `NO ACTION`. Consulta [ON DELETE y ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) para ver lo que escribe cada base de datos.  
Desde la `3.10.0`, una comilla simple dentro del comentario de una tabla o de una columna se escapa, así que un comentario como `it's` ya no rompe la sentencia. Todos los proveedores que escriben los comentarios como literales de cadena la duplican, excepto Databricks, que pone una barra invertida delante de cada comilla y de cada barra invertida. SQLite sigue escribiendo los comentarios como líneas `--`.  
Desde la `4.2.0`, SQL Server escribe cada comentario como un literal nacional, `N'…'`, así que se conserva el texto que queda fuera de la página de códigos de la base de datos, como el coreano. Oracle escribe cada serie de líneas en blanco de un comentario como un solo salto de línea, y SQLite escribe los saltos de línea de un comentario como espacios, de modo que este se queda en su línea `--`. Consulta [Comentarios](../guide/guides/schema-sql.md#comments).  
Desde la `4.0.0`, varias bases de datos también escriben de otra forma los nombres de las claves, los valores predeterminados y el incremento automático. Consulta [Qué escribe el DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Devuelve un almacén para la edición colaborativa en tiempo real.  
`config` es `{ getNickname?, mouseTracker?, focusTracker? }`. Los dos rastreadores valen `true` de forma predeterminada: `mouseTracker` difunde el cursor de este editor a los demás, y `focusTracker` difunde su celda con el foco, su selección y su cuadro de arrastre.  
Consulta [Edición colaborativa](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Abre el visor de diferencias y compara el documento abierto actualmente con el que pasas.  
No devuelve nada ni modifica el documento, así que cerrar el visor deja el editor exactamente como estaba.  
Un valor en blanco, o cualquier cosa que no sea una cadena, se compara con un documento vacío.  
Es la misma vista superpuesta que abre [Visor de diferencias](../guide/guides/table-related-functions.md#diff-viewer) en el menú contextual del lienzo.  
Desde la `4.1.0`, empareja lo que contienen los dos documentos primero por id y solo después por lo que guarda cada elemento, como el nombre de una tabla o el texto de una nota; consulta [Qué se compara](../guide/guides/table-related-functions.md#what-is-compared). Por tanto, frente a una versión anterior del mismo documento, como una revisión de Git de su archivo, un cambio de nombre aparece como un único elemento renombrado; frente a un documento cuyos ids son distintos, aparece como una eliminación y una adición. El visor muestra lo que ha cambiado en un árbol junto a los dos documentos y marca los cambios con color en lugar de rellenar celdas.  
Desde la `4.2.0`, los dos documentos se abren en la vista de nombres que muestra este editor, sea cual sea la que guardó el documento que se pasa, y el árbol también nombra las tablas y las columnas según ella; consulta [Más allá del lienzo](../guide/guides/logical-names.md#beyond-the-canvas). Los nombres lógicos, los vínculos con dominios y los diccionarios no se comparan, así que un cambio solo en ellos no muestra ningún cambio.

```js
editor.setDiffValue('prev json...');
```
