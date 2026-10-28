---
sidebar_position: 3
description: "La API del elemento erd-viewer: un diagrama de solo lectura a partir de un value o de una URL src, su minimapa y su barra de controles, los eventos load y error, los temas, el idioma de la interfaz, el foco y las teclas, la carga y lo que añade a una página."
---

# ErdViewerElement

Desde la `5.0.0`, el paquete incluye también `<erd-viewer>`, una vista de solo lectura de un documento: un lector desplaza la vista, hace zoom, busca e ilumina relaciones, y nada en ella edita. Dibuja solo el lienzo ERD, con sus barras de desplazamiento, un [minimapa](#minimap), una [barra de controles](#controls) y una paleta que busca en el documento, y no tiene barra de herramientas, pestañas, explorador ni menú contextual.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

El marco de arriba es este elemento tal como lo muestra erd-editor.io/embed, aquí con el ejemplo de la librería: haz clic en él para darle el foco y luego haz zoom y busca con las teclas de [Foco y teclas](#focus-and-keys), y consulta [Incrustación](../guide/guides/embedding.md) para enmarcar un documento tuyo sin código.

El visor es un simple `HTMLElement`.  
Su definición de tipos es la siguiente.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Importar `@dineug/erd-editor/erd-viewer.js` define `<erd-viewer>` y deja `<erd-editor>` sin definir. Importar la raíz del paquete no define ninguno de los dos: exporta la clase `ErdViewerElement` y `defineErdViewer()`, que define la etiqueta donde la llamas, de modo que una página también puede definir la clase con una etiqueta propia; consulta [Registro de los elementos](./installation.md#registering-the-elements).  
Todas las entradas salvo `engine.js` y `peer.js` necesitan un DOM, esta también, así que una página renderizada en el servidor la importa en el cliente; consulta [Renderizado del lado del servidor](./installation.md#server-side-rendering).  
Importar la entrada añade `erd-viewer` a `HTMLElementTagNameMap`, así que `document.createElement('erd-viewer')` y `document.querySelector('erd-viewer')` quedan tipados como `ErdViewerElement` sin necesidad de una conversión de tipo.

Como el editor, el visor se renderiza en un shadow root cerrado, así que `viewer.shadowRoot` es `null` y los estilos de la página ni entran ni salen; dale estilo con [setTheme](#settheme) y las propiedades personalizadas `--erd-editor-*`. Varios visores en una página conservan cada uno su propio documento, vista, tema e idioma.  
`<erd-viewer>` no tiene tamaño intrínseco. Un elemento personalizado es en línea, así que dale `display: block` y una altura, como arriba. La vista ocupa la caja del elemento y la sigue cuando cambia de tamaño, conservando su zoom.

`src`, `name-view`, `minimap` y `controls` son sus únicos atributos, cada uno con una propiedad del mismo nombre, `nameView` para `name-view`. [value](#value) es solo una propiedad.  
Un `value`, `src`, `nameView`, `minimap` o `controls` establecido en el elemento antes de que se defina su etiqueta, por ejemplo por un framework que renderiza el elemento antes de que se haya cargado la entrada, se recoge cuando se define la etiqueta, por encima de los atributos que le dio el marcado. Se recogen en el orden en que la página escribió cada uno por primera vez, así que prevalece el último de `value` y `src`. Un `value` que no contiene ningún documento ya no tiene a quién lanzar la excepción: se informa como un error no capturado, y el visor se queda vacío.

La compilación de etiqueta script, `dist/erd-viewer.umd.js`, contiene solo el visor con todas sus dependencias. Define `<erd-viewer>` y pone `ErdViewerElement` y `defineErdViewer` en `window.ErdViewer`. Una URL de CDN sin ruta sirve en cambio la compilación del editor, así que nombra el archivo; consulta [Etiqueta script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

La URL de un documento que el visor descarga y muestra. Es `''`, ninguna, de forma predeterminada.  
La descarga es un `fetch()` simple, un `GET` sin opciones propias, así que la regulan las reglas CORS del navegador: un documento de otro origen necesita un servidor que permita el origen de la página, y las cookies van solo al origen de la propia página. Una URL relativa se resuelve respecto a la página.  
La respuesta tiene que contener un documento como el de un archivo `.erd.json`, la forma de almacenamiento que escriben el [value](./erd-editor-element.md#value) del editor y todos los hosts oficiales. No se lee ningún otro formato: un archivo SQL, GraphQL, DBML o AML falla como texto que no se analiza.  
Un documento que se analiza queda ajustado a la vista y emite [load](#load). Una petición que la red o CORS rechazó, una respuesta que no es `ok` o un texto que no se analiza emite [error](#error) y deja un diagrama vacío; consulta [Carga](#loading).

Solo cuenta la última petición. Un `src` nuevo aborta la descarga en curso, así que una respuesta lenta nunca se impone a un documento posterior. Asignar [value](#value) también la aborta, y también quitar `src` o ponerlo en `''`, lo que deja de seguirlo y deja el documento mostrado como estaba.  
Prevalece el último de `value` y `src` que se establezca, tanto por la propiedad como por el atributo. Un `src` escrito después de un `value` se descarga aunque nombre la URL descargada antes. Escrito de nuevo sobre el documento que ya muestra, no descarga nada.  
El visor descarga solo mientras está en una página. Sacarlo aborta una descarga en curso, y volver a ponerlo descarga un `src` que no ha mostrado, uno que falló incluido, y nunca uno que ya muestra.  
`src` es el único `fetch()` que hace el paquete, así que una Content Security Policy estricta lista el origen del documento en `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Obtiene el documento mostrado, venga de `src` o de `value`, como una cadena JSON en la forma de almacenamiento que escribe el [value](./erd-editor-element.md#value) del editor. Antes de que se muestre algo es un documento nuevo y vacío, cuyo `doc` es `{}`.  
Mientras el [bloqueo](../guide/guides/settings.md#lock) `Viewport` del documento está activado, como lo está en un documento nuevo, escribe el zoom y el desplazamiento en que está bloqueado el documento, esté donde esté la vista que movió el lector. Solo con ese bloqueo desactivado escribe dónde está la vista, incluido el ajuste que hace un aterrizaje.  
Escribe la vista de nombres que contiene el documento, nunca la que [nameView](#nameview) o la barra de controles muestran por encima, ni siquiera en un documento cuyo bloqueo `Name View` está desactivado.  
Sigue devolviendo el documento después de [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Muestra un documento a partir de su texto, sustituyendo al mostrado, y lo ajusta a la vista; consulta [Carga](#loading). Admite el texto que contiene un archivo o el `value` del editor.  
Un texto que no se analiza lanza una excepción antes de cambiar nada, y el documento mostrado se queda: un `SyntaxError` para un texto que no es JSON, un `TypeError` para un JSON que no contiene ningún documento, como `7`. Una cadena en blanco, o cualquier cosa que no sea una cadena, muestra un diagrama vacío.  
Asignarlo aborta una descarga de `src` en curso y no emite ni `load` ni `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Muestra el diagrama en una [vista de nombres](../guide/guides/logical-names.md#name-view) por encima de la que contiene el documento: `'physical'` para `Physical Names`, `'logical'` para `Logical Names` o `'both'` para `Both Names`. `null`, el valor predeterminado, muestra la propia del documento, y un valor de atributo distinto de los tres se interpreta como `null`.  
Sigue vigente sobre todo documento cargado después, y [value](#value) nunca la escribe. Quitar el atributo vuelve a la vista propia del documento.  
La lista `Name View` de la [barra de controles](#controls) también cambia la vista, hasta que llegue el siguiente documento o `nameView` cambie de nuevo. Un cambio allí tampoco se escribe en `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Muestra el minimapa en la esquina superior derecha, mientras el documento contiene una tabla, una nota mostrada o un grupo de tablas mostrado. Está activado de forma predeterminada.  
Funciona como el del editor: haz clic en él para mover la vista allí, o arrastra su rectángulo de vista para desplazarla; consulta [Moverse por el lienzo](../guide/guides/table-related-functions.md#getting-around-the-canvas). Un dedo sobre él es de la página hasta que el visor tiene el foco.  
Solo `minimap="false"` lo desactiva. Un atributo sin valor, cualquier otro valor y la ausencia de atributo lo dejan activado.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Muestra la barra de controles sobre el centro del borde inferior del lienzo. Está activada de forma predeterminada y contiene, de izquierda a derecha:

- El zoom: `Zoom out`, el zoom actual como porcentaje y `Zoom in`. Los dos botones dan pasos de zoom como las teclas de zoom, y hacer clic en el porcentaje, `Reset zoom`, lo devuelve a `100%`. Cada uno nombra su tecla en su descripción emergente.
- `Fit`, que hace zoom y desplaza la vista para que todo el diagrama se vea en ella, centrado.
- `Name View`, un botón que nombra la vista vigente y abre sobre la barra una lista de `Physical Names`, `Logical Names` y `Both Names`; consulta [nameView](#nameview).
- La brújula `Go to content`, que se une al final de la barra solo mientras nada del diagrama está en pantalla, y lleva la vista a la parte más cercana de él.

La barra se dispone de izquierda a derecha en todos los idiomas.  
Solo `controls="false"` la desactiva, con su brújula y su lista `Name View`. Un atributo sin valor, cualquier otro valor y la ausencia de atributo la dejan activada. Sin la barra, la rueda, un gesto de pellizco y las teclas siguen haciendo zoom en cuanto el visor tiene el foco.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Eventos {#event}

`load` y `error` son los dos únicos eventos, y ambos informan sobre `src`. Ninguno burbujea, así que escucha en el propio elemento.

### load {#load}

Se emite cuando el documento que nombra `src` se ha descargado y mostrado. `event.detail` es `null`.  
Asignar `value` no emite ninguno, y tampoco una descarga que abortó un `src` posterior, un `value`, sacar el elemento de la página o [destroy](#destroy).

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Se emite cuando falla la descarga de `src`: la red o CORS rechazaron la petición, la respuesta no era `ok` o su texto no se analizó. El visor muestra entonces un diagrama vacío y el aviso `Couldn't load the diagram`; consulta [Carga](#loading).  
`event.detail` es la causa: el `TypeError` con el que rechaza `fetch()`, un `Error` que nombra el estado, como `GET /missing.erd.json answered 404 Not Found`, o el `SyntaxError` o `TypeError` del analizador.  
Una descarga que algo abortó no emite nada.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Establece un tema predefinido, con los `ThemeOptions` del editor; consulta [setPresetTheme](./erd-editor-element.md#setpresettheme).  
El visor empieza con `appearance: 'system'`, `grayColor: 'slate'` y `accentColor: 'indigo'`, así que desde su primer fotograma muestra el claro u oscuro que indica el sistema operativo, y cambia cuando este cambia. El editor empieza en oscuro.  
Cada campo se aplica por separado, así que una llamada parcial deja los otros dos como están. Un valor que no es uno de los nombres se ignora, y la llamada nunca lanza una excepción.  
El visor no tiene generador de temas ni `systemDarkMode`, y no emite ningún evento por un tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Nombra el claro u oscuro que muestra la apariencia `'system'`, para una página con un claro y un oscuro propios. Mientras se nombra uno, se ignoran los cambios del sistema operativo.  
`null`, o cualquier valor distinto de `'dark'` o `'light'`, vuelve a seguir al sistema operativo.  
Mientras la apariencia es `'light'` o `'dark'` no cambia nada en pantalla, pero el valor se conserva y se aplica en cuanto la apariencia pasa a ser `'system'`. No emite nada.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Sustituye tokens del tema sobre el tema predefinido, con los tokens `Theme` del editor; consulta [setTheme](./erd-editor-element.md#settheme).  
Cada llamada sustituye toda la capa, así que pasa `{}` para volver al tema predefinido. Solo se conservan los nombres de token, con valores de cadena, y un `setPresetTheme` posterior cambia el tema predefinido de debajo mientras las sustituciones se quedan.  
Las propiedades personalizadas CSS `--erd-editor-*` llegan también al visor, establecidas en el elemento o en cualquier elemento por encima de él; consulta [Variables CSS](./erd-editor-element.md#css-variables). El lienzo, al que no llega ninguna hoja de estilo, las vuelve a leer cuando cambia una hoja de estilo del `head` de la página, o cuando cambia el atributo `class` o `style` del elemento o de un elemento por encima de él. Una regla añadida con `insertRule()` no cambia ninguno de ellos, así que el lienzo la recoge en el siguiente cambio de este tipo.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Establece el idioma de la interfaz: `'system'`, el valor predeterminado, o uno de los 25 códigos que lista el [Idioma de la interfaz](./erd-editor-element.md#display-language) del editor. Cualquier otra cosa, como un `'ko'` a secas o un valor que no es una cadena, se ignora.  
El idioma cambia las descripciones emergentes de la barra de controles, la lista `Name View`, la paleta, los avisos de carga y las palabras que dibuja el propio diagrama, como `unnamed`. Los nombres, los comentarios y el resto del documento nunca se traducen.

El inglés forma parte de la entrada del visor y se aplica antes de que la llamada retorne. Cada uno de los demás idiomas es un módulo propio, que tu bundler genera como un chunk junto al visor y que el visor descarga de tu bundle la primera vez que una página pide ese idioma, una vez para todos los visores de la página. Hasta que llega, el visor sigue mostrando el idioma que mostraba, el inglés en un primer fotograma. Si no se carga, el visor muestra inglés, y pedir de nuevo ese idioma lo intenta otra vez.  
La compilación de [etiqueta script](./installation.md#script-tag) contiene los 25 idiomas, así que no descarga ninguno. Un bundle que contiene también el editor carga todos los idiomas con el chunk del editor; consulta [Registro de los elementos](./installation.md#registering-the-elements).  
La `Promise` que devuelve se resuelve cuando ese idioma ha llegado o ha fallado, y nunca se rechaza. Ese idioma, o el inglés tras un fallo, queda entonces vigente, salvo que una llamada posterior haya pedido otro: prevalece la llamada posterior, sea cual sea el orden en que lleguen los idiomas.

El hebreo, el árabe y el persa disponen la paleta y los avisos de carga de derecha a izquierda. El lienzo, el minimapa, las barras de desplazamiento y la barra de controles con su brújula se quedan de izquierda a derecha, como el lienzo del editor; consulta [Idiomas de derecha a izquierda](../guide/guides/language-and-theme.md#right-to-left-languages).  
El visor establece `lang` y `dir` en su propia raíz dentro del shadow root cerrado, nunca en el elemento anfitrión ni en la página.  
No emite nada, y el visor no tiene selector de idioma ni guarda nada.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Nombra el idioma que representa `'system'`, como una etiqueta BCP 47, para una página con un ajuste de idioma propio.  
La etiqueta se recorta. `null`, una cadena en blanco o un valor que no es una cadena vuelve a los idiomas de la página.  
Esos son el `<html lang>` de la página y luego el `navigator.languages` del navegador, leídos una vez, cuando el visor se conecta por primera vez. `'system'` toma el primero de ellos para el que el visor tiene idioma, por la regla del editor en [setSystemLocale](./erd-editor-element.md#setsystemlocale), y el inglés cuando no tiene ninguno. Así, una página cuyo `<html lang>` nombra un idioma que el visor tiene muestra ese idioma sea cual sea el que prefiera el navegador, y un cambio posterior de `lang` o de los idiomas del navegador no mueve ningún visor.  
Solo importa mientras la opción vigente es `'system'`, y su `Promise` se resuelve como la de [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Termina el visor para siempre. Desmonta la vista antes de retornar, esté el elemento todavía en la página o se haya sacado antes, aborta una descarga de `src` en curso y deja de seguir el esquema de color del sistema operativo y los estilos de la página.  
Un visor destruido no dibuja nada más, no descarga nada y no pide ningún idioma, aunque se vuelva a añadir a una página. Leer [value](#value) sigue devolviendo el documento que contenía.  
Sacar el elemento de la página no lo destruye: si se vuelve a poner, continúa, y descarga un `src` que aún no ha mostrado; consulta [Carga](#loading).

```js
viewer.destroy();
```

## Foco y teclas {#focus-and-keys}

Un visor no toma el foco al montarse, al llegar un documento ni al cerrarse su paleta, así que nunca desplaza la página hacia sí ni toma las teclas de la página.  
Un clic o un toque en su lienzo le da el foco sin desplazar la página, y es una parada de la tecla `Tab`. A diferencia del editor, no tiene miembros `focus()` ni `blur()` propios. Una pulsación en cualquier otro punto de la página le quita el foco de nuevo.

Hasta que el visor tiene el foco, la página conserva la rueda, que desplaza la página, y un gesto de pellizco del trackpad. Un dedo en el lienzo desplaza la página y no desplaza nada del visor, y todas las teclas llegan a la página sin impedirse.  
Una vez que tiene el foco:

- La rueda desplaza la vista, y `Shift + Wheel` la desplaza hacia los lados. Sobre una nota cuyo texto se desborda, la rueda desplaza la nota.
- `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac), un gesto de pellizco del trackpad o dos dedos en una pantalla táctil hacen zoom.
- Un dedo desplaza la vista.
- `Ctrl + Plus` y `Ctrl + Minus` (Windows/Linux) o `⌘ + Plus` y `⌘ + Minus` (Mac) dan pasos de zoom como los botones `Zoom in` y `Zoom out`, y `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) vuelve directamente a `100%`, manteniendo donde está el centro de la pantalla.
- `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) abre la paleta, y `Esc` la cierra.

Esas son sus únicas teclas, y no se pueden reasignar. Todas las demás teclas llegan a la página sin impedirse, con foco o sin él: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` y toda combinación que edita en el editor.

La paleta busca solo en el documento y no lista ningún comando. Su entrada vacía muestra los prefijos: `#` busca en las tablas, `@` en las columnas, `:` en los comentarios y las notas, y `?` lista los prefijos, como en el editor; consulta [Buscar en el diagrama](../guide/guides/quick-search.md#searching-the-diagram). Una palabra sin prefijo muestra `No commands match` sobre las filas que buscan esa palabra en el diagrama.  
Elegir una fila mueve la vista por la regla del editor, [Dónde termina un salto](../guide/guides/table-related-functions.md#where-a-jump-lands), dejando el zoom como está, y perfila lo que alcanzó, traído al frente: la tabla, la tabla que contiene la columna o el comentario, o la nota.  
Elegir una fila o pulsar `Esc` cierra la paleta y deja el foco sin ningún elemento, así que la siguiente rueda desplaza la página; haz clic en la vista para devolverle la rueda y las teclas. Mientras la paleta está abierta, la rueda desplaza su lista, y las teclas de zoom no hacen nada.

Con foco o sin él, un arrastre con el botón principal del ratón desplaza la vista desde cualquier punto del lienzo, también sobre una tabla. Un clic o un toque que no se mueve ilumina relaciones: sobre una tabla, las relaciones de esa tabla; sobre una línea de relación, esa línea; en cualquier otro sitio, una nota incluida, apaga la iluminación. Un clic así borra también el contorno que dejó un salto de la paleta. El puntero sobre una tabla ilumina sus relaciones mientras está allí.  
Ninguna pulsación selecciona, mueve ni edita nada. No hay más selección que el contorno de un salto, ni cuadro de selección, y ni un doble clic ni `Enter` abren una celda.

## Carga {#loading}

Mientras `src` se carga, un aviso sobre el centro del lienzo dice `Loading diagram` junto a un indicador que gira. Cuando una carga falla, dice `Couldn't load the diagram` junto a una señal de advertencia, hasta que un `src` nuevo o un `value` ocupan su lugar o se quita `src`. Las pulsaciones atraviesan el aviso hasta el lienzo, y se lee en el idioma de la interfaz, de derecha a izquierda en uno de derecha a izquierda.

Todo documento que llega, desde `src` o desde `value`, se ajusta a la caja del visor: con zoom y desplazamiento para que todo el diagrama se vea, centrado, como hace `Fit`, y se deja de lado el zoom y el desplazamiento que guardó el archivo. Un documento entregado antes de que el visor tenga tamaño, establecido antes de que esté en una página o mientras su caja está vacía, se ajusta cuando lo tiene. Un cambio de tamaño posterior conserva el zoom; `Fit` vuelve a ajustar.

El visor descarga un `src` solo mientras está en una página. Sacarlo aborta una descarga en curso, y volver a ponerlo descarga un `src` que no ha mostrado, uno que falló incluido, y nunca uno que ya muestra. Un visor que ya no hace falta se termina con [destroy](#destroy).

## Qué añade a una página {#what-it-adds-to-a-page}

- Ningún worker. No inicia ninguno, así que una Content Security Policy no necesita `worker-src` para él.
- Ningún almacenamiento. No escribe ninguna cookie, `localStorage`, `sessionStorage` ni IndexedDB.
- Dos tipos de petición: la descarga de [src](#src), cuyo origen una política estricta lista en `connect-src`, y el módulo de un idioma de la interfaz distinto del inglés, desde tu propio bundle; consulta [setLocale](#setlocale).
- Estilos en hojas de estilo construidas, que un `style-src` estricto deja pasar. Un navegador sin hojas de estilo construidas, como Firefox anterior a la 101, recibe en su lugar elementos `<style>`, que necesitan `style-src 'unsafe-inline'`.
- Listeners en `window`. Importar la entrada añade tres durante la vida de la página, para `mousedown`, `touchstart` y el propio evento `@dineug/erd-editor/internal-forward-move-start` del paquete. Konva, que dibuja el lienzo, establece `window.Konva` y, con su primer stage, añade listeners de ratón y táctiles a `window` y un listener de `visibilitychange` a `document`, que nunca quita. La entrada del editor añade los mismos.
- Hasta [destroy](#destroy), cada visor sigue el esquema de color del sistema operativo y vigila los estilos de la página en busca de las propiedades personalizadas que describe [setTheme](#settheme).
