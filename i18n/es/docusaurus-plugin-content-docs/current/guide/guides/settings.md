---
sidebar_position: 14
description: Sincronización del tipo de datos en las relaciones, ancho máximo de comentario, recálculo del ancho de las tablas, bloqueos de ajustes (vista, pestaña y ajustes de código), orden de visualización de las columnas y lista de atajos de teclado.
---

# Configuración

Ábrela con el botón `Settings` de la barra de herramientas o desde la [búsqueda rápida](./quick-search.md), en `Tab`.
La pantalla Configuración tiene dos pestañas: `Preferences` y `Shortcuts`. Primero se abre `Preferences`, salvo desde la fila `Shortcuts` de la [pantalla de bienvenida](./editing-start.md#welcome-screen), que abre `Shortcuts`.

El tema y el idioma de la interfaz no están en esta pantalla. Se abren con los botones `Theme` y `Display Language` de la barra de herramientas; consulta [Idioma y tema](./language-and-theme.md).

## Sincronizar el tipo de datos en las relaciones {#relationship-datatype-sync}

Determina si se sincronizan los tipos de datos. Está activado de forma predeterminada.
Entonces, al cambiar el tipo de datos de una columna, ese tipo se aplica a todas las columnas unidas a ella por una relación, siguiendo la cadena desde ambos extremos, de modo que una clave externa nunca deja de coincidir con la clave a la que hace referencia.
De una clave a sus claves externas, un tipo serial se transmite como el tipo entero que almacena, igual que cuando se dibuja una relación; consulta [Relaciones identificadoras](./relationship-editing.md#identifying-relationships). Así, en PostgreSQL, cambiar una clave a `serial` da `integer` a sus claves externas, y el cambio sigue bajando por la cadena desde ahí.
De una clave externa de vuelta a su clave, el tipo se transmite tal como está escrito, salvo que una clave serial conserva su tipo y el cambio se detiene ahí.
[Asignar columnas](./relationship-editing.md#map-columns) también sigue este ajuste: mientras está activado, cada columna existente que asigna toma el tipo que su clave padre da a una clave externa, y el cambio continúa por las relaciones como se ha descrito arriba. Mientras está desactivado, o cuando la clave no tiene tipo de datos, la columna conserva el suyo.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Ajuste de sincronización del tipo de datos en las relaciones" loading="lazy" />

![Cambiar members.id a BIGINT UNSIGNED, lo que actualiza todos los member_id unidos a esa columna](/img/demo-relationship-data-type-sync.webp)

## Ancho máximo de comentario {#maximum-comment-width}

Especifica el ancho máximo de la columna de comentario en píxeles (`60` ~ `200`).
Al desactivar el interruptor se elimina el límite, y el campo queda deshabilitado mientras está desactivado.
Al activarlo, empieza en `60px`. Un valor escrito fuera del rango se ajusta al extremo más cercano.

![Activar Maximum comment width, escribir 120 y la pestaña ERD con los comentarios recortados a ese ancho](/img/demo-settings-comment-width.webp)

## Recalcular el ancho de las tablas {#recalculation-table-width}

Pulsa `Sync` para recalcular el ancho de todas las tablas y celdas de columna según su texto actual, y para volver a dibujar los conectores de las relaciones en torno a los nuevos tamaños.
Una notificación `Recalculated table width` lo confirma.
Los anchos se recalculan solos cada vez que se carga un documento, así que esto solo hace falta cuando un cambio de fuente o de renderizado los ha dejado desactualizados.
Los anchos no se guardan en el archivo, así que `Sync` nunca lo modifica.

## Bloqueo {#lock}

La lista `Lock` contiene seis ajustes. Mientras el bloqueo de un ajuste está activado, el archivo conserva el valor que tenía el ajuste cuando se bloqueó, así que cambiarlo en pantalla deja el archivo como estaba.

| Fila | Lo que conserva el archivo | En un diagrama nuevo |
| --- | --- | --- |
| `Viewport` | El nivel de zoom y la posición de la vista del lienzo ERD, con un solo bloqueo | `100% · 0, 0` |
| `Canvas Type` | La pestaña en la que se abre el diagrama: `ERD`, `Visualization`, `Schema SQL` o `Code Generator` | `ERD` |
| `Language` | El lenguaje del [Generador de código](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | El [estilo de nombres de tabla](./code-generator.md#name-case) del Generador de código | `Pascal` |
| `Column Name Case` | El [estilo de nombres de columna](./code-generator.md#name-case) del Generador de código | `Camel` |
| `Bracket Type` | La opción `Bracket` de la pestaña [Esquema SQL](./schema-sql.md#database-and-bracket) y de los destinos del [Generador de código](./code-generator.md#bracket) que la ofrecen | `None` |

Cada fila muestra un valor y un botón de bloqueo, y un clic en el botón activa o desactiva solo ese bloqueo.
Mientras un bloqueo está activado, el botón muestra un candado cerrado con la descripción emergente `Unlock Viewport` (y así con cada fila), y el valor, con la descripción emergente `Locked value`, es el que conserva el archivo.
Mientras está desactivado, el botón muestra un candado abierto con la descripción emergente `Lock Viewport`, y el valor, atenuado y con la descripción emergente `Current value`, es el ajuste tal como está ahora.
`Viewport` indica el zoom y después la posición de la vista, como `75% · -40, 91`. La posición de la vista es el punto de la pantalla, en píxeles, donde se encuentra el `0, 0` del diagrama, y una coordenada de mil o más se abrevia, como en `1.2k` o `-24k`.

Al bloquear se toma el ajuste tal como está en ese momento.
Mientras un bloqueo está activado, el ajuste sigue funcionando en pantalla: puedes desplazar la vista y hacer zoom, cambiar de pestaña y elegir otro lenguaje, estilo de nombres o delimitador desde los menús, los paneles de opciones o la búsqueda rápida.
Sin embargo, el archivo conserva el valor bloqueado y la fila lo sigue mostrando, así que el diagrama se vuelve a abrir en la vista bloqueada, en la pestaña bloqueada y con el lenguaje, los estilos de nombres y el delimitador bloqueados. Una exportación JSON también escribe los valores bloqueados.
Para guardar lo que muestra la pantalla, desactiva el bloqueo, y a partir de entonces el archivo sigue el ajuste: con `Viewport` desactivado, el diagrama se abre donde lo dejaste. Para bloquear en su lugar un valor nuevo, como una nueva vista inicial, desactiva el bloqueo y vuelve a activarlo.
Si la vista bloqueada no muestra nada del diagrama cuando se abre el archivo, la pantalla se desplaza igualmente hasta el diagrama, y el valor bloqueado se queda como está.
`Canvas Type` nunca conserva la pestaña Configuración. Al activarlo se bloquea la última pestaña distinta de Configuración en la que estuviste, y mientras está desactivado, su fila muestra el nombre de esa pestaña.

![Desbloquear Viewport, desplazar el diagrama y hacer zoom en él, y volver a bloquearlo en la nueva vista que muestra su fila](/img/demo-settings-locks.webp)

Activar o desactivar un bloqueo modifica el archivo, ya que el archivo guarda qué bloqueos están activados, pero, como el resto de la pestaña Configuración, no se registra en el [historial de deshacer](./undo-redo.md#what-the-history-records). En un editor de solo lectura, los botones de bloqueo no hacen nada.
Todos los demás ajustes se guardan tal como están: la base de datos, los interruptores de [`View Option`](./table-related-functions.md#table-view-options) y el resto de la pestaña `Preferences`.

En un diagrama nuevo, uno empezado desde cero, todos los bloqueos están activados: un archivo vacío abierto en VS Code, Obsidian o un IDE de JetBrains (`ERD Editor: Create new diagram` y `New ERD` de Obsidian crean uno), un esquema nuevo en la aplicación web, un archivo creado desde el menú New de Google Drive o un `<erd-editor>` al que no se da ningún valor.
Un esquema o un archivo de Google Drive que la aplicación web crea al importar un archivo SQL, DBML, AML o GraphQL también empieza con todos los bloqueos activados. Uno creado a partir de un archivo JSON conserva los bloqueos que registra ese archivo.
Un archivo que abres conserva los bloqueos con los que se guardó, cada uno con su valor bloqueado.
Un archivo que no registra ningún bloqueo, como uno guardado por una versión anterior a los bloqueos o escrito a mano, se abre con todos los bloqueos activados: la vista en `100% · 0, 0` y la pestaña en `ERD`, sean cuales sean la vista y la pestaña que guardó, y su lenguaje, sus estilos de nombres y su tipo de delimitador bloqueados tal como los guardó.
Una importación con `Import` que sustituye el diagrama también establece los bloqueos: un archivo JSON trae los bloqueos que registra y los valores que contienen, y un archivo SQL, DBML, AML o GraphQL conserva tus bloqueos, pero devuelve la vista a `100% · 0, 0`, bloqueada o no; consulta [Importar archivos externos](./file-import-export.md#importing-external-files). Deshacer la importación devuelve los bloqueos y los valores bloqueados que sustituyó.

Un cambio que un bloqueo mantiene fuera del archivo no cuenta como cambio. VS Code no marca la pestaña como modificada, y Obsidian y un IDE de JetBrains dejan el archivo como estaba, tanto cuando guardan por su cuenta como cuando se cierra la pestaña.
Así, con todos los bloqueos activados, recorrer un diagrama, cambiar de pestaña y probar otro lenguaje, estilo de nombres o delimitador nunca aparecen en `git diff`.
Con `Viewport` desactivado, desplazar la vista y hacer zoom modifican el archivo, y con `Canvas Type` desactivado, también lo hace cambiar de pestaña, incluso a la pestaña Configuración.
El archivo vacío de un diagrama nuevo sigue vacío hasta el primer cambio que conserva el archivo: una edición, un cambio en un ajuste que ningún bloqueo retiene o un bloqueo que se activa o se desactiva.
Abrir un diagrama y cerrarlo sin ningún cambio de ese tipo deja el archivo como estaba, sea cual sea la versión o el ordenador que lo escribió. El archivo contiene solo lo que es el diagrama, en un orden fijo, y un archivo guardado en una forma anterior se reescribe en esta forma una sola vez, en su primer cambio de ese tipo; consulta [Forma de almacenamiento y valor en tiempo de ejecución](../../api/advanced/schema.md#storage-form-and-runtime-value).
En VS Code, una revisión que se vuelve a abrir como diagrama con `Reopen Editor With...`, como una revisión de Git o una entrada de Local History, es de solo lectura y nunca se marca como modificada.
En Google Drive, un desplazamiento, un zoom o un cambio a otra pestaña nunca se guardan por sí solos, estén bloqueados o no. Con `Viewport` desactivado, la vista solo se escribe junto con otro cambio, así que un archivo de Drive se abre donde estaba la vista en su último guardado, y lo mismo ocurre con la pestaña con `Canvas Type` desactivado.

En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), activar o desactivar un bloqueo llega a todos los editores, y un bloqueo conserva el valor del editor que lo activó.
Desactivar `Language`, un estilo de nombres o `Bracket Type` da a todos los editores el valor que se muestra en el editor que lo desactivó, de modo que todos guardan un mismo valor. Desactivar `Viewport` o `Canvas Type` no mueve la vista ni la pestaña de nadie.
Un agente de programación que trabaja a través del servidor MCP no tiene ninguna herramienta para los bloqueos ni para los ajustes que retienen, y lee un lenguaje, un estilo de nombres o un tipo de delimitador bloqueados con el valor que conserva el archivo. Solo sus importaciones en modo `replace` llegan a ellos, como hace una importación con `Import`; consulta [Ajustes](../../mcp/tools.md#settings) e [Importación](../../mcp/tools.md#import).

## Ajustar el orden de las columnas {#adjusting-column-order}

Establece el orden en que se muestran las columnas en las tablas.
Arrastra una fila para moverla: toda la fila se puede arrastrar, y el icono del asa de arrastre la señala. Las siete filas, en su orden predeterminado, son `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` y `Comment`.
Una celda oculta por una [opción de vista de tabla](./table-related-functions.md#table-view-options) conserva su lugar en la lista, así que el orden se aplica a las celdas que se muestren.
La marca de [clave alternativa](./table-related-functions.md#alternate-keys) (`AK1.1`, etc.) no es una de estas filas. Siempre va al final de una fila, después de la celda que este orden ponga en último lugar.

![Desplazarse hasta Column Order y arrastrar la fila Comment hacia arriba, bajo Name, lo que coloca cada comentario justo después del nombre de su columna](/img/demo-settings-column-order.webp)

## Atajos de teclado {#shortcuts}

La pestaña `Shortcuts` es una tabla de solo lectura con las columnas `Command` y `Keybinding` que enumera las combinaciones de teclas de la plataforma en la que estás.

| Comando | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` y luego `G` | `T` y luego `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

La mayoría solo actúan en la pestaña ERD, y quedan inactivos mientras está abierta la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, la vista previa de la disposición automática, el viaje en el tiempo, el cuadro de diálogo [`Export image`](./file-import-export.md#image) o [`Map Columns`](./relationship-editing.md#map-columns).
`Search`, `Toggle Explorer` y `Stop` son las excepciones: `Search` abre o cierra la búsqueda rápida desde cualquier pestaña, `Toggle Explorer` abre el [explorador](./explorer.md#opening-and-closing) en su búsqueda desde cualquier pestaña y muestra la pestaña ERD, y `Stop` es el comando que cierra la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, la vista previa de la disposición automática, el viaje en el tiempo, el cuadro de diálogo `Export image`, `Map Columns`, el generador de temas, el selector `Display Language`, el selector de color y un menú contextual abierto.
`Toggle Explorer` vuelve a cerrar el explorador mientras está abierto en la pestaña ERD y no lo oculta el modo zen, como hace el botón `Explorer` de la barra de herramientas. Con la búsqueda rápida, el panel Propiedades de la tabla, el generador de temas, el selector `Display Language`, el cuadro de diálogo `Export image` o `Map Columns` abiertos, en su lugar cierra lo que esté abierto y lleva el foco del teclado a la búsqueda del explorador.
`Toggle Explorer` no hace nada mientras se edita una celda, una nota o el nombre de un grupo de tablas. Mientras está abierto el visor de diferencias, la vista previa de la disposición automática o el viaje en el tiempo, deja su tecla al navegador o al host; consulta [La barra de búsqueda del navegador](./find-and-replace.md#the-browsers-find-bar).
En la pestaña ERD, `Stop` sale del editor abierto de una celda o de una nota, cierra el editor de nombre de un [grupo de tablas](./table-groups.md) sin cambiar el nombre del grupo o cancela una relación o un `New Table Group` que se esté dibujando, y deja la selección como está. Si no hay nada de eso abierto, anula la selección, quita el foco de la celda y, con la misma pulsación, cierra un selector de color abierto. Un generador de temas o un selector `Display Language` abiertos se cierran con la misma pulsación en cualquier caso.
Un explorador, un generador de temas o un selector `Display Language` abiertos no dejan inactivo ninguno de los atajos del lienzo. `Stop` nunca cierra el explorador. Para saber qué hacen `Stop` y las demás teclas dentro del explorador, consulta [Teclas en el explorador](./explorer.md#keys-in-the-explorer), y dentro del selector, consulta [Elegir un idioma](./language-and-theme.md#picking-a-language).
`Delete Selection` elimina todas las tablas, notas y grupos de tablas seleccionados o, cuando hay una sola tabla seleccionada con algunas de sus columnas y el zoom es superior al `70%`, esas columnas; consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` también elimina los grupos de tablas seleccionados.
`Add Table Group` empieza a dibujar un [`New Table Group`](./table-groups.md#drawing-a-group), como hace el botón `New Table Group` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), y una segunda pulsación cancela el dibujo. `Group Selected Tables` consiste en dos pulsaciones sin tecla modificadora, `T` y luego `G` en menos de un segundo. Pone las tablas seleccionadas en un grupo nuevo y abre su editor de nombre, como hace `Group selected tables` en el menú contextual de una tabla, y no hace nada cuando no hay ninguna tabla seleccionada; consulta [Agrupar las tablas seleccionadas](./table-groups.md#grouping-selected-tables). Ninguno de los dos hace nada en un editor de solo lectura ni mientras los grupos están [ocultos](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out` y `Zoom Reset` también hacen zoom en la pestaña [Visualización](./visualization.md#toolbar), tanto en `Graph` como en `Flow`, salvo que esté abierta la búsqueda rápida.
En la pestaña Visualización, `Stop` también cierra el menú de [vista de filas](./visualization.md#row-display) y cancela una [disposición de Flow](./visualization.md#how-flow-is-placed) que todavía está en curso; no amplía una vista acotada con `Focus on this table`.
`Focus on this table` abre la pestaña Visualización en `Flow`, acotada a las tablas seleccionadas y a todas las tablas a una relación de distancia, y no hace nada cuando no hay ninguna tabla seleccionada; consulta [Centrarse en tablas](./visualization.md#focusing-on-tables).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` y `Group Selected Tables` ceden el paso a un cursor de texto: mientras editas una celda o una nota o escribes en un campo de texto como el campo Buscar del explorador, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) selecciona el texto, `Space` escribe un espacio, `Delete` y `Backspace` borran texto, y `T` y luego `G` escribe las dos letras.
Copiar y pegar usan los atajos propios del navegador, `Ctrl + C` y `Ctrl + V` (Windows/Linux) o `⌘ + C` y `⌘ + V` (Mac), así que no figuran en esta lista; consulta [Edición de tablas](./table-editing.md).

Las combinaciones de teclas no se pueden cambiar desde esta pestaña.
Un host que integra el editor las reasigna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), salvo las de `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` y `Zoom Reset`, que son fijas.
La pestaña `Shortcuts` muestra entonces las combinaciones del host: un comando que el host no reasigna conserva su combinación predeterminada, y uno que el host no asigna a ninguna tecla no muestra ninguna.

En Obsidian, estas teclas llegan al editor siempre que la pestaña de Obsidian del diagrama está activa, incluso cuando un atajo de Obsidian usa la misma tecla, como `Alt + Enter`, `Ctrl + K` y `Ctrl + F` (Windows/Linux) o `⌥ + Enter`, `⌘ + K` y `⌘ + F` (Mac). Todos los demás atajos de Obsidian siguen funcionando allí. Para `Ctrl + F` o `⌘ + F`, consulta [La barra de búsqueda del navegador](./find-and-replace.md#the-browsers-find-bar).
