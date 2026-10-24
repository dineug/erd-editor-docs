---
sidebar_position: 17
description: Los 25 idiomas de la interfaz del editor, la disposición de derecha a izquierda, las apariencias System, Light y Dark del generador de temas y sus colores, y dónde los guarda cada host.
---

# Idioma y tema

El texto propio del editor está disponible en 25 idiomas, y su aspecto es un tema: una apariencia (`System`, `Light` o `Dark`), un tono de gris y un color de énfasis.  
Ambos pertenecen a la persona que usa el editor, no al diagrama. Ninguno de los dos se guarda en el archivo, se registra en el [historial de deshacer](./undo-redo.md) ni se comparte con los colaboradores, así que cada persona ve los suyos, y cambiar cualquiera de ellos nunca marca un archivo como modificado.

Ninguno de los dos está en la pestaña [Configuración](./settings.md). La barra de herramientas tiene un botón `Theme` y, justo a continuación, un botón `Display Language`, ambos después del botón [`Explorer`](./explorer.md). La [búsqueda rápida](./quick-search.md) muestra `Theme` y `Display Language` en todas las pestañas.  
La aplicación web, Google Drive, VS Code, los IDE de JetBrains y Obsidian ofrecen ambos y recuerdan tus elecciones; consulta [En cada host](#in-each-host). Ambos funcionan también en un editor de solo lectura.

## Idioma de la interfaz {#display-language}

El idioma abarca el texto propio del editor: las descripciones emergentes de la barra de herramientas, el botón [`Name View`](./logical-names.md#switching-the-view) de la barra de herramientas del lienzo y de la barra de herramientas de Flow, el menú de vista de filas de Flow, los menús contextuales, la búsqueda rápida, los paneles y cuadros de diálogo, la pestaña [Diccionario](./dictionary.md) (los nombres de sus hojas, los encabezados de columna, las herramientas, el menú, la línea de estado y los tipos de comprobación que enumera la hoja `Checks`), la pestaña Configuración, la [pantalla de bienvenida](./editing-start.md#welcome-screen), las notificaciones y los mensajes, y el marcador de posición que se muestra en el lienzo y en una imagen exportada cuando un nombre, un nombre lógico, un tipo de datos, un dominio, un valor predeterminado o un comentario están vacíos.  
En todos los idiomas, deja tal cual: los nombres de tus tablas y columnas, los [nombres lógicos](./logical-names.md), tus comentarios y tus notas; las palabras, los términos y los dominios que guardas en la pestaña Diccionario; los proveedores de bases de datos, los lenguajes del Generador de código y los formatos de archivo; los tipos de datos, las palabras clave de SQL y las acciones `ON DELETE` y `ON UPDATE`; las opciones de Esquema SQL `Create`, `If not exists`, `Drop & re-create`, `USE` y `CREATE + USE`; las marcas `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` y `AK1.1`; las letras de estado `A`, `M`, `D`, `R` y `~` del [visor de diferencias](./table-related-functions.md#diff-viewer); las opciones de estilo de nombres y de `Bracket` distintas de `None`; los nombres de las teclas; los nombres de los colores del generador de temas; el SQL y el código generados; la fila de encabezado de un CSV de diccionario exportado; y los nombres de los archivos exportados.

En la pestaña Diccionario, al ordenar, las filas se colocan según el orden alfabético del idioma de la interfaz, y la búsqueda de la hoja `Checks` compara sus celdas tal como se leen en el idioma de la interfaz; consulta [Ordenar](./dictionary.md#sorting) y [Buscar](./dictionary.md#searching).

Los idiomas, en el orden en que los muestra el selector:

| En el selector | Idioma | Código |
| --- | --- | --- |
| Bahasa Indonesia | Indonesio | `id-ID` |
| Deutsch | Alemán | `de-DE` |
| English | Inglés | `en` |
| Español | Español | `es-ES` |
| Euskara | Euskera | `eu-ES` |
| Français | Francés | `fr-FR` |
| Italiano | Italiano | `it-IT` |
| Nederlands | Neerlandés | `nl-NL` |
| Polski | Polaco | `pl-PL` |
| Português | Portugués | `pt-PT` |
| Português Brasileiro | Portugués de Brasil | `pt-BR` |
| Română | Rumano | `ro-RO` |
| Slovenčina | Eslovaco | `sk-SK` |
| Slovenščina | Esloveno | `sl-SI` |
| Svenska | Sueco | `sv-SE` |
| Türkçe | Turco | `tr-TR` |
| Русский | Ruso | `ru-RU` |
| Українська | Ucraniano | `uk-UA` |
| עברית | Hebreo | `he-IL` |
| العربية | Árabe | `ar-SA` |
| فارسی | Persa | `fa-IR` |
| 日本語 | Japonés | `ja-JP` |
| 简体中文 | Chino simplificado | `zh-CN` |
| 繁體中文 | Chino tradicional | `zh-TW` |
| 한국어 | Coreano | `ko-KR` |

La entrada `Language` que ofrece la búsqueda rápida en la pestaña Generador de código y la fila `Language` de la lista de [Bloqueo](./settings.md#lock) de la pestaña Configuración son el [lenguaje de destino del Generador de código](./code-generator.md#language), no el idioma de la interfaz.

### Elegir un idioma {#picking-a-language}

El botón `Display Language` (un icono de idiomas) abre el selector `Display Language`, un panel titulado `Display Language` bajo la barra de herramientas, sobre la pestaña que esté abierta.  
`System` va primero, con el idioma al que corresponde en este momento a su lado, y permanece visible mientras se desplaza la lista. Le siguen los 25 idiomas, cada uno con su propio nombre, y una marca señala la opción vigente.

![Cambiar el idioma de la interfaz desde la barra de herramientas a 한국어, luego a العربية, que refleja la barra de herramientas pero no el diagrama, y volver a System](/img/demo-display-language.webp)

El panel se abre con el foco del teclado en la fila marcada:

- `↑` y `↓` recorren las filas de forma circular, y `Home` y `End` saltan a la primera y a la última.
- `Enter` o `Space` elige la fila con el foco, igual que un clic.

Una elección se aplica al instante, cierra el panel y devuelve el foco del teclado al editor.

Ciérralo sin elegir nada con `Escape`, con el botón `x` junto al título, cuya descripción emergente indica `Close (ESC)`, con una pulsación en cualquier parte del editor fuera del panel salvo en la barra de herramientas, o pulsando de nuevo el botón `Display Language`.  
Al abrirlo se cierran el generador de temas y el panel Propiedades de la tabla. Un [explorador](./explorer.md#dialogs-beside-it) abierto sigue abierto, y en un idioma de izquierda a derecha el selector se sitúa justo después de él en lugar de encima.  
Abrir la búsqueda rápida o el generador de temas lo cierra, igual que `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac). Esa combinación abre el [explorador](./explorer.md#opening-and-closing) en su búsqueda o, si el explorador ya está abierto, lo mantiene abierto y lleva el foco del teclado a su campo Buscar. El botón `Explorer` de la barra de herramientas deja abierto el selector.

Mientras el panel tiene el foco del teclado, algunos atajos de teclado del editor siguen funcionando: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` y `Zoom Reset`; consulta [Atajos de teclado](./settings.md#shortcuts). Todos los demás atajos del editor, las teclas de flecha y `Tab` no pasan del panel, así que el editor no actúa sobre ellos. Las teclas que el editor no tiene asignadas, como el guardado propio del host, llegan al host como de costumbre.

En la [búsqueda rápida](./quick-search.md), `Display Language` muestra `System` y los 25 idiomas, con una marca en la opción vigente. Allí un idioma también se encuentra por su nombre en inglés o por su código, así que `german` o `de-DE` encuentra `Deutsch`.

### Qué sigue la opción System {#what-system-follows}

`System` es el valor inicial del idioma en la aplicación web, Google Drive, VS Code, los IDE de JetBrains y Obsidian. Sigue el idioma del host:

- En la aplicación web, Google Drive y tu propia página: los idiomas preferidos del navegador. Un cambio en ellos se refleja al instante.
- En VS Code: el idioma de la interfaz de VS Code.
- En un IDE de JetBrains: el idioma en que el IDE muestra su propia interfaz.
- En Obsidian: el idioma de Obsidian.

`System` toma el primero de esos idiomas que tenga el editor, e inglés cuando no tiene ninguno de ellos.  
Una variante regional cuenta como su idioma, así que `de-AT` da Deutsch y `fr-CA` da Français. Para el chino, decide la escritura: una escritura tradicional da 繁體中文 y cualquier otra, 简体中文. Si no se indica ninguna escritura, Taiwán, Hong Kong o Macao dan 繁體中文, y cualquier otra variante del chino da 简体中文. El portugués da Português Brasileiro salvo que se indique una región distinta de Brasil, así que `pt-PT` da Português; el portugués de Obsidian también da Português.

### Idiomas de derecha a izquierda {#right-to-left-languages}

עברית (hebreo), العربية (árabe) y فارسی (persa) disponen el editor de derecha a izquierda: la barra de herramientas, los menús, los paneles y cuadros de diálogo, la búsqueda rápida, la barra y la línea de estado de la pestaña Diccionario y la pestaña Configuración aparecen reflejados. Los submenús de un menú contextual se abren hacia la izquierda, y los iconos de deshacer y rehacer de la barra de herramientas se intercambian, de modo que el de deshacer apunta hacia atrás según el sentido de lectura de derecha a izquierda.

El propio diagrama nunca se refleja. El lienzo, con sus tablas, columnas, relaciones y notas, sigue de izquierda a derecha, igual que el minimapa, las barras de desplazamiento, la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), [Visualización](./visualization.md) y su barra de herramientas, las celdas de tipo de datos, las hojas de la pestaña Diccionario y la lista de dominios de un término, el código de las pestañas Esquema SQL y Generador de código, el selector de color, los dos lados del visor de diferencias, el viaje en el tiempo y la vista previa de la disposición automática.  
En Flow, las dos flechas de la barra de herramientas de Visualización conservan su posición e intercambian lo que hacen: la flecha que apunta a la derecha es `Previous table` y la que apunta a la izquierda, `Next table`, de modo que retroceder apunta en el mismo sentido que deshacer. Las teclas de deshacer y rehacer siguen retrocediendo y avanzando; consulta [Tabla anterior y tabla siguiente](./visualization.md#previous-table-and-next-table).  
El [explorador](./explorer.md#beside-the-canvas) se queda a la izquierda del lienzo, y el árbol de cambios del visor de diferencias, a la izquierda del visor, cada uno con su borde de arrastre a la derecha. Por dentro, ambos se leen de derecha a izquierda: sus campos y filas aparecen reflejados, las filas se sangran desde la derecha y, en cualquiera de los dos árboles, `←` expande una fila o pasa a su primer hijo, mientras que `→` la contrae o sube a su padre; consulta [Teclas en el explorador](./explorer.md#keys-in-the-explorer).  
Los nombres, los comentarios y el resto del texto que has escrito conservan su propia dirección, así que un nombre en hebreo, árabe o persa también se lee de derecha a izquierda en el lienzo. Cada nombre que enumera una notificación de la pestaña Diccionario también conserva su propia dirección.

## Tema {#theme}

El botón `Theme` (un icono de contraste) abre el generador de temas, un panel titulado `Theme` bajo la barra de herramientas, sobre la pestaña que esté abierta. Tiene tres partes:

- `Accent color`: 26 muestras. La descripción emergente de cada una indica su nombre, como `indigo`.
- `Gray color`: 6 muestras, `gray`, `mauve`, `slate`, `sage`, `olive` y `sand`.
- `Appearance`: `System`, `Light` y `Dark`.

![Abrir el generador de temas desde la barra de herramientas, elegir un color de énfasis y un tono de gris, y cambiar la apariencia a Light y luego a System](/img/demo-theme-builder.webp)

La opción vigente de cada parte aparece marcada, y una elección se aplica al instante mientras el generador sigue abierto.  
Elegir un color deja la apariencia como está, así que un color elegido con `System` mantiene `System`.

`System` muestra el modo claro u oscuro igual que el host, y cambia cuando cambia el host:

- En la aplicación web, Google Drive y tu propia página: el modo claro u oscuro que indica el navegador, que sigue al sistema operativo.
- En VS Code: claro con un tema de color claro, y oscuro con uno oscuro o con cualquiera de los dos temas de alto contraste.
- En un IDE de JetBrains: el tema claro u oscuro del IDE.
- En Obsidian: el tema claro u oscuro de Obsidian.

Cierra el generador con `Escape`, con el botón `x` junto al título, cuya descripción emergente indica `Close (ESC)`, con una pulsación en cualquier parte del editor fuera del panel salvo en la barra de herramientas, o pulsando de nuevo el botón `Theme`.  
Al abrirlo se cierran el panel Propiedades de la tabla y el selector `Display Language`. Un [explorador](./explorer.md#dialogs-beside-it) abierto sigue abierto, y en un idioma de izquierda a derecha el generador se sitúa justo después de él en lugar de encima.  
Abrir la búsqueda rápida o el selector `Display Language` lo cierra, igual que `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac). Esa combinación abre el [explorador](./explorer.md#opening-and-closing) en su búsqueda o, si el explorador ya está abierto, lo mantiene abierto y lleva el foco del teclado a su campo Buscar. El botón `Explorer` de la barra de herramientas deja abierto el generador.  
El generador no retiene ninguna tecla, así que los atajos del editor funcionan mientras está abierto.

En la [búsqueda rápida](./quick-search.md), `Theme` muestra `System`, `Light` y `Dark`, con una marca en la apariencia vigente. Elegir una cambia solo la apariencia y deja como están el tono de gris y el color de énfasis.

## En cada host {#in-each-host}

Lo que eliges en el editor, desde la barra de herramientas o la búsqueda rápida, se guarda allí donde lo conserva el host, y todos los diagramas abiertos siguen al instante cualquier cambio, se haga donde se haga.  
En VS Code, un IDE de JetBrains y Obsidian, el `Auto` del host (el valor `auto` en VS Code) es el `System` del editor. Elegir `System` guarda `Auto`, y elegir `Light` o `Dark` guarda esa apariencia, aunque `Auto` ya la estuviera mostrando.  
Los ajustes y avisos propios de la extensión y de los plugins están en inglés sea cual sea el idioma de la interfaz.

### Aplicación web y Google Drive {#web-app-and-google-drive}

En erd-editor.io, incluidas sus sesiones colaborativas, y en Google Drive, un único idioma y un único tema sirven para la aplicación y para todos sus diagramas.  
Ambos se guardan en este navegador, no en el esquema ni en el archivo de Drive, y todas las pestañas de erd-editor.io los comparten: una elección en una pestaña cambia las demás al instante.

El idioma es `System`, que sigue los idiomas preferidos del navegador, hasta que eliges uno.  
El texto propio de la aplicación, como la barra lateral, la papelera, la colaboración y las pantallas de Google Drive, sigue el mismo idioma, y en hebreo, árabe y persa toda la aplicación se dispone de derecha a izquierda. La Política de privacidad, las Condiciones del servicio y las páginas de soporte se mantienen en inglés.  
Además del panel del editor y de la búsqueda rápida, la fila inferior de la barra lateral tiene un botón de idioma, cuya descripción emergente indica `Display Language`, junto a los enlaces `Privacy` y `Terms`. Su menú muestra `System`, con el idioma al que corresponde, y después los 25 idiomas.

El tema empieza en `System`, con el tono de gris `olive` y el color de énfasis `jade`.  
Además del generador de temas y de la búsqueda rápida, la parte inferior de la barra lateral tiene tres botones de icono, `System`, `Light` y `Dark`: junto a `Trash` en erd-editor.io y junto a `Sign out` en Google Drive. Establecen la misma apariencia que el generador.

### VS Code {#vs-code}

Los ajustes de la extensión están bajo ERD Editor en Settings de VS Code:

| Ajuste | Valores | Predeterminado |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` o un código de la [tabla de idiomas](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | los seis tonos de gris | `slate` |
| `dineug.erd-editor.theme.accentColor` | los 26 colores de énfasis | `indigo` |

El editor de Settings muestra el ajuste de idioma como `Auto` y después cada idioma con su propio nombre. Un valor de `settings.json` que no nombra ningún idioma se interpreta como `auto`.  
Una elección de tema en el editor escribe los tres ajustes del tema. Cada elección se escribe donde su ajuste ya está definido: la carpeta del área de trabajo; si no, el área de trabajo; y si no, los ajustes de usuario.

### IDE de JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor tiene `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` y `Display language:` (`Auto` y luego cada idioma con su propio nombre), que se guardan para todo el IDE.  
Sus valores iniciales son `Auto`, `Slate`, `Indigo` y `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor tiene `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` y `Display language` (`Auto` y luego cada idioma con su propio nombre), que se guardan por bóveda.  
Sus valores iniciales son `Auto`, `Slate`, `Indigo` y `Auto`.  
Un cambio se aplica a todas las pestañas ERD de la bóveda, incluidas las de las ventanas emergentes.

### Tu propia página {#your-own-page}

Un `<erd-editor>` en tu propia página no muestra el botón `Theme` ni el botón `Display Language`, y la búsqueda rápida no muestra ninguno de los dos, hasta que la página los activa con [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) y [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Hasta que la página establece un idioma o el lector elige uno, el editor se muestra en inglés, o sigue `System` mientras `enableLocalePicker` está activado.  
El tema empieza en `Dark`, con el tono de gris `slate` y el color de énfasis `indigo`, salvo que la página establezca otro o active [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
La elección de un lector se aplica al instante, pero el elemento no guarda ninguna de las dos: la página establece los valores iniciales y guarda ella misma las elecciones del lector; consulta [Tema](../../api/erd-editor-element.md#theme) e [Idioma de la interfaz](../../api/erd-editor-element.md#display-language) en la API.
