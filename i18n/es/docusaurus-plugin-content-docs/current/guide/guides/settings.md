---
sidebar_position: 16
description: Sincronización del tipo de datos en las relaciones y dominios, ancho máximo de comentario, bloqueos de ajustes (vista, pestaña, ajustes de código y vista de nombres), orden de visualización de las columnas, lista de atajos de teclado y la pestaña Configuración de un editor de solo lectura.
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

Un [dominio](./dictionary.md#domains-and-data-types) da su `Data Type` a las columnas vinculadas a él, cuando ese tipo cambia y cuando se vincula una columna. Mientras este ajuste está activado, el cambio continúa por las relaciones desde cada una de esas columnas como se ha descrito arriba; mientras está desactivado, solo cambian las columnas vinculadas. Una columna que toma el tipo de su dominio en ese paso lo conserva, incluso donde la sincronización le daría otro, como el tipo entero que una clave serial da a sus claves externas.
Una columna vinculada a la que la sincronización o Asignar columnas dan un tipo distinto del de su propio dominio se desvincula de ese dominio en el mismo paso; consulta [Desvincular](./dictionary.md#unlinking). Ningún pegado de columnas transmite un tipo a través de este ajuste, ni siquiera el tipo de un dominio que vincula el pegado; consulta [Copiar y pegar columnas](./table-editing.md#copyingpasting-columns). Un `Data Type` pegado en la hoja `Domains` de la pestaña Diccionario sí lo transmite, como hace cualquier cambio en el tipo de un dominio.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Ajuste de sincronización del tipo de datos en las relaciones" loading="lazy" />

![Cambiar members.id a BIGINT UNSIGNED, lo que actualiza todos los member_id unidos a esa columna](/img/demo-relationship-data-type-sync.webp)

## Ancho máximo de comentario {#maximum-comment-width}

Especifica el ancho máximo de la columna de comentario en píxeles (`60` ~ `200`).
Al desactivar el interruptor se elimina el límite, y el campo queda deshabilitado mientras está desactivado.
Al activarlo, empieza en `60px`. Un valor escrito fuera del rango se ajusta al extremo más cercano.

![Activar Maximum comment width, escribir 120 y la pestaña ERD con los comentarios recortados a ese ancho](/img/demo-settings-comment-width.webp)

## Bloqueo {#lock}

La lista `Lock` contiene siete ajustes. Mientras el bloqueo de un ajuste está activado, el archivo conserva el valor que tenía el ajuste cuando se bloqueó, así que cambiarlo en pantalla deja el archivo como estaba.

| Fila | Lo que conserva el archivo | En un diagrama nuevo |
| --- | --- | --- |
| `Viewport` | El nivel de zoom y la posición de la vista del lienzo ERD, con un solo bloqueo | `100% · 0, 0` |
| `Canvas Type` | La pestaña en la que se abre el diagrama: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` o `Dictionary` | `ERD` |
| `Language` | El lenguaje del [Generador de código](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | El [estilo de nombres de tabla](./code-generator.md#name-case) del Generador de código | `Pascal` |
| `Column Name Case` | El [estilo de nombres de columna](./code-generator.md#name-case) del Generador de código | `Camel` |
| `Bracket Type` | La opción `Bracket` de la pestaña [Esquema SQL](./schema-sql.md#database-and-bracket) y de los destinos del [Generador de código](./code-generator.md#bracket) que la ofrecen | `None` |
| `Name View` | La [vista de nombres](./logical-names.md#name-view) en la que se abre el diagrama: `Physical Names`, `Logical Names` o `Both Names` | `Physical Names` |

Cada fila muestra un valor y un botón de bloqueo, y un clic en el botón activa o desactiva solo ese bloqueo.
Mientras un bloqueo está activado, el botón muestra un candado cerrado con la descripción emergente `Unlock Viewport` (y así con cada fila), y el valor, con la descripción emergente `Locked value`, es el que conserva el archivo.
Mientras está desactivado, el botón muestra un candado abierto con la descripción emergente `Lock Viewport`, y el valor, atenuado y con la descripción emergente `Current value`, es el ajuste tal como está ahora.
`Viewport` indica el zoom y después la posición de la vista, como `75% · -40, 91`. La posición de la vista es el punto de la pantalla, en píxeles, donde se encuentra el `0, 0` del diagrama, y una coordenada de mil o más se abrevia, como en `1.2k` o `-24k`.

Al bloquear se toma el ajuste tal como está en ese momento.
Mientras un bloqueo está activado, el ajuste sigue funcionando en pantalla: puedes desplazar la vista y hacer zoom, cambiar de pestaña, elegir otro lenguaje, estilo de nombres o delimitador desde los menús, los paneles de opciones o la búsqueda rápida, y cambiar la vista de nombres desde cualquiera de sus selectores; consulta [Cambiar la vista](./logical-names.md#switching-the-view).
Sin embargo, el archivo conserva el valor bloqueado y la fila lo sigue mostrando, así que el diagrama se vuelve a abrir en la vista bloqueada, en la pestaña bloqueada, en la vista de nombres bloqueada y con el lenguaje, los estilos de nombres y el delimitador bloqueados. Una exportación JSON también escribe los valores bloqueados.
Para guardar lo que muestra la pantalla, desactiva el bloqueo, y a partir de entonces el archivo sigue el ajuste: con `Viewport` desactivado, el diagrama se abre donde lo dejaste. Para bloquear en su lugar un valor nuevo, como una nueva vista inicial, desactiva el bloqueo y vuelve a activarlo.
Si la vista bloqueada no muestra nada del diagrama cuando se abre el archivo, la pantalla se desplaza igualmente hasta el diagrama, y el valor bloqueado se queda como está.
`Canvas Type` nunca conserva la pestaña Configuración. Al activarlo se bloquea la última pestaña distinta de Configuración en la que estuviste, y mientras está desactivado, su fila muestra el nombre de esa pestaña.

![Desbloquear Viewport, desplazar el diagrama y hacer zoom en él, y volver a bloquearlo en la nueva vista que muestra su fila](/img/demo-settings-locks.webp)

Activar o desactivar un bloqueo modifica el archivo, ya que el archivo guarda qué bloqueos están activados, pero, como el resto de la pestaña Configuración, no se registra en el [historial de deshacer](./undo-redo.md#what-the-history-records). Tampoco se registra un cambio de vista de nombres, esté bloqueada o no.
Todos los demás ajustes se guardan tal como están: la base de datos, los interruptores de [`View Option`](./table-related-functions.md#table-view-options) y el resto de la pestaña `Preferences`.
Un editor de solo lectura no cambia el archivo con ninguno de ellos, digan lo que digan los bloqueos: sus botones de bloqueo y los demás controles de `Preferences` están desactivados, y los ajustes que aún deja cambiar se quedan en esa pantalla; consulta [Editores de solo lectura](#read-only-editors).

En un diagrama nuevo, uno empezado desde cero, todos los bloqueos están activados: un archivo vacío abierto en VS Code, Obsidian o un IDE de JetBrains (`ERD Editor: Create new diagram` y `New ERD` de Obsidian crean uno), un esquema nuevo en la aplicación web, un archivo creado desde el menú New de Google Drive o un `<erd-editor>` al que no se da ningún valor.
Un esquema o un archivo de Google Drive que la aplicación web crea al importar un archivo SQL, DBML, AML o GraphQL también empieza con todos los bloqueos activados. Uno creado a partir de un archivo JSON conserva los bloqueos que registra ese archivo.
Un archivo que abres conserva los bloqueos con los que se guardó, cada uno con su valor bloqueado.
Un archivo que no registra ningún bloqueo, como uno guardado por una versión anterior a los bloqueos o escrito a mano, se abre con todos los bloqueos activados: la vista en `100% · 0, 0` y la pestaña en `ERD`, sean cuales sean la vista y la pestaña que guardó, y su lenguaje, sus estilos de nombres, su tipo de delimitador y su vista de nombres bloqueados tal como los guardó.
Un archivo guardado por una versión anterior al bloqueo de la vista de nombres se abre en `Physical Names` con `Name View` bloqueado, aunque todos los demás bloqueos que registra estén desactivados.
Una importación con `Import` que sustituye el diagrama también establece los bloqueos: un archivo JSON trae los bloqueos que registra y los valores que contienen, y un archivo SQL, DBML, AML o GraphQL conserva tus bloqueos, pero devuelve la vista a `100% · 0, 0`, bloqueada o no; consulta [Importar archivos externos](./file-import-export.md#importing-external-files). Deshacer la importación devuelve los bloqueos y los valores bloqueados que sustituyó.

Un cambio que un bloqueo mantiene fuera del archivo no cuenta como cambio. VS Code no marca la pestaña como modificada, y Obsidian y un IDE de JetBrains dejan el archivo como estaba, tanto cuando guardan por su cuenta como cuando se cierra la pestaña.
Así, con todos los bloqueos activados, recorrer un diagrama, cambiar de pestaña, probar otro lenguaje, estilo de nombres o delimitador y cambiar la vista de nombres nunca aparecen en `git diff`.
Con `Viewport` desactivado, desplazar la vista y hacer zoom modifican el archivo; con `Canvas Type` desactivado, también lo hace cambiar de pestaña, incluso a la pestaña Configuración, y con `Name View` desactivado, también lo hace cambiar la vista de nombres.
El archivo vacío de un diagrama nuevo sigue vacío hasta el primer cambio que conserva el archivo: una edición, un cambio en un ajuste que ningún bloqueo retiene o un bloqueo que se activa o se desactiva.
Abrir un diagrama y cerrarlo sin ningún cambio de ese tipo deja el archivo como estaba, sea cual sea la versión o el ordenador que lo escribió. El archivo contiene solo lo que es el diagrama, en un orden fijo, y un archivo guardado en una forma anterior se reescribe en esta forma una sola vez, en su primer cambio de ese tipo; consulta [Forma de almacenamiento y valor en tiempo de ejecución](../../api/advanced/schema.md#storage-form-and-runtime-value).
En VS Code, una revisión que se vuelve a abrir como diagrama con `Reopen Editor With...`, como una revisión de Git o una entrada de Local History, es de solo lectura y nunca se marca como modificada.
En Google Drive, un desplazamiento, un zoom o un cambio a otra pestaña nunca se guardan por sí solos, estén bloqueados o no. Con `Viewport` desactivado, la vista solo se escribe junto con otro cambio, así que un archivo de Drive se abre donde estaba la vista en su último guardado, y lo mismo ocurre con la pestaña con `Canvas Type` desactivado. Un cambio de vista de nombres hecho con `Name View` desactivado se guarda como se guarda una edición, y uno hecho mientras está activado, o en un editor de solo lectura, nunca se guarda.

En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), activar o desactivar un bloqueo llega a todos los editores, y un bloqueo conserva el valor del editor que lo activó.
Desactivar `Language`, un estilo de nombres, `Bracket Type` o `Name View` da a todos los editores el valor que se muestra en el editor que lo desactivó, de modo que todos guardan un mismo valor. Desactivar `Viewport` o `Canvas Type` no mueve la vista ni la pestaña de nadie.
Un lenguaje, un estilo de nombres o un delimitador elegidos mientras su bloqueo está activado siguen llegando a todos los editores, pero la vista de nombres es propia de cada editor mientras `Name View` está activado: un cambio solo se ve en el editor que lo hizo, y activar el bloqueo no cambia la vista de nadie. Mientras está desactivado, un cambio en cualquier editor que no sea de solo lectura cambia la vista de todos los editores.
Un agente de programación que trabaja a través del servidor MCP no tiene ninguna herramienta para los bloqueos ni para los ajustes que retienen, y lee un lenguaje, un estilo de nombres o un tipo de delimitador bloqueados con el valor que conserva el archivo. Solo sus importaciones en modo `replace` llegan a ellos, como hace una importación con `Import`; consulta [Ajustes](../../mcp/tools.md#settings) e [Importación](../../mcp/tools.md#import). Su `erd_list` y el formato `snapshot` de `erd_read` omiten la vista de nombres, y el agente edita el esquema, nombres lógicos incluidos, sea cual sea la vista que esté mirando una persona.

## Ajustar el orden de las columnas {#adjusting-column-order}

Establece el orden en que se muestran las columnas en las tablas.
Arrastra una fila para moverla: toda la fila se puede arrastrar, y el icono del asa de arrastre la señala. Las nueve filas, en su orden predeterminado, son `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` y `Comment`.
`Logical Name` coloca la celda del nombre lógico que dibuja una fila en `Both Names`. En `Logical Names`, el nombre lógico ocupa en cambio el lugar de la fila `Name`, y la vista `Physical Names` no dibuja ninguna; consulta [Vista de nombres](./logical-names.md#name-view). `Domain` coloca la celda Dominio que muestra Opciones de vista → `Domain`; consulta [La celda Dominio](./logical-names.md#the-domain-cell).
Una celda oculta por una [opción de vista de tabla](./table-related-functions.md#table-view-options) u omitida por la vista de nombres conserva su lugar en la lista, así que el orden se aplica a las celdas que se muestren.
Un diagrama cuyo orden se estableció antes de que `Logical Name` y `Domain` fueran filas recibe `Logical Name` justo antes de `Name` y `Domain` justo después de `DataType`, estén donde estén esas filas en su orden.
Un diagrama guardado por una versión posterior conserva también su orden, aunque esa versión tenga una fila que esta no tiene: las filas que tiene esta versión quedan en el orden que da el archivo, y la fila desconocida se omite. Guardar el diagrama aquí escribe el orden sin ella, y la versión posterior vuelve a poner esa fila junto a su vecina en su propio orden predeterminado.
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
`Search`, `Toggle Explorer` y `Stop` son las excepciones: `Search` abre o cierra la búsqueda rápida desde cualquier pestaña, `Toggle Explorer` abre el [explorador](./explorer.md#opening-and-closing) en su búsqueda desde cualquier pestaña y muestra la pestaña ERD, y `Stop` es el comando que cierra la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, la vista previa de la disposición automática, el viaje en el tiempo, el cuadro de diálogo `Export image`, `Map Columns`, el generador de temas, el selector `Display Language`, el selector de color, la lista que abre un botón `Name View` y un menú contextual abierto.
`Toggle Explorer` vuelve a cerrar el explorador mientras está abierto en la pestaña ERD y no lo oculta el modo zen, como hace el botón `Explorer` de la barra de herramientas. Con la búsqueda rápida, el panel Propiedades de la tabla, el generador de temas, el selector `Display Language`, el cuadro de diálogo `Export image` o `Map Columns` abiertos, en su lugar cierra lo que esté abierto y lleva el foco del teclado a la búsqueda del explorador.
`Toggle Explorer` no hace nada mientras se edita una celda, una nota o el nombre de un grupo de tablas. Ni este comando ni `Search` hacen nada mientras se edita una celda de la pestaña [Diccionario](./dictionary.md), de modo que se conserva el texto escrito en ella. Mientras está abierto el visor de diferencias, la vista previa de la disposición automática o el viaje en el tiempo, `Toggle Explorer` deja su tecla al navegador o al host; consulta [La barra de búsqueda del navegador](./find-and-replace.md#the-browsers-find-bar).
En la pestaña ERD, `Stop` sale del editor abierto de una celda o de una nota, cierra el editor de nombre de un [grupo de tablas](./table-groups.md) sin cambiar el nombre del grupo o cancela una relación o un `New Table Group` que se esté dibujando, y deja la selección como está. Si no hay nada de eso abierto, anula la selección, quita el foco de la celda y, con la misma pulsación, cierra un selector de color abierto. Un generador de temas o un selector `Display Language` abiertos se cierran con la misma pulsación en cualquier caso.
En una celda del nombre lógico con su lista de términos abierta, la primera pulsación de `Stop` solo cierra la lista; consulta [Completar nombres de términos](./logical-names.md#completing-term-names).
Un explorador, un generador de temas o un selector `Display Language` abiertos no dejan inactivo ninguno de los atajos del lienzo. `Stop` nunca cierra el explorador. Para saber qué hacen `Stop` y las demás teclas dentro del explorador, consulta [Teclas en el explorador](./explorer.md#keys-in-the-explorer), y dentro del selector, consulta [Elegir un idioma](./language-and-theme.md#picking-a-language).
`Delete Selection` elimina todas las tablas, notas y grupos de tablas seleccionados o, cuando hay una sola tabla seleccionada con algunas de sus columnas y el zoom es superior al `70%`, esas columnas; consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` también elimina los grupos de tablas seleccionados.
`Add Table Group` empieza a dibujar un [`New Table Group`](./table-groups.md#drawing-a-group), como hace el botón `New Table Group` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), y una segunda pulsación cancela el dibujo. `Group Selected Tables` consiste en dos pulsaciones sin tecla modificadora, `T` y luego `G` en menos de un segundo. Pone las tablas seleccionadas en un grupo nuevo y abre su editor de nombre, como hace `Group selected tables` en el menú contextual de una tabla, y no hace nada cuando no hay ninguna tabla seleccionada; consulta [Agrupar las tablas seleccionadas](./table-groups.md#grouping-selected-tables). Ninguno de los dos hace nada en un editor de solo lectura ni mientras los grupos están [ocultos](./table-groups.md#hiding-groups).
En un editor de solo lectura solo funcionan las teclas que leen: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` y `Focus on this table` sobre la tabla que seleccionó un salto, las tres teclas de zoom, `Zen Mode`, copiar y las teclas de flecha, que mueven la celda con el foco. `Editing`, todas las teclas `Add` y `Remove`, `Delete Selection`, `Primary Key`, las dos teclas de seleccionar todo, las cuatro teclas de relación, `Add Table Group`, `Group Selected Tables`, `Hand Tool` y pegar no hacen nada, y `Undo` y `Redo` no deshacen ni rehacen nada; consulta [Editores de solo lectura](./table-related-functions.md#read-only-editors).
`Zoom In`, `Zoom Out` y `Zoom Reset` también hacen zoom en la pestaña [Visualización](./visualization.md#toolbar), tanto en `Graph` como en `Flow`, salvo que esté abierta la búsqueda rápida.
En `Flow`, `Undo` y `Redo` retroceden y avanzan por las vistas a las que se ha acotado Flow, como hacen sus botones `Previous table` y `Next table`, salvo que esté abierta la búsqueda rápida. Allí nunca deshacen cambios del diagrama, y en `Graph` no hacen nada; consulta [Tabla anterior y tabla siguiente](./visualization.md#previous-table-and-next-table).
En la pestaña Visualización, `Stop` también cierra el menú de [vista de filas](./visualization.md#row-display) y cancela una [disposición de Flow](./visualization.md#how-flow-is-placed) que todavía está en curso; no amplía una vista acotada con `Focus on this table`.
`Focus on this table` abre la pestaña Visualización en `Flow`, acotada a las tablas seleccionadas y a todas las tablas a una relación de distancia, y no hace nada cuando no hay ninguna tabla seleccionada; consulta [Centrarse en tablas](./visualization.md#focusing-on-tables).
En la pestaña Diccionario, `Undo` y `Redo` actúan sobre el historial de la hoja que se muestra en lugar del historial del diagrama, y no hacen nada en `Checks`; consulta [Hojas del diccionario](./undo-redo.md#dictionary-sheets). En las hojas `Domains`, `Words` y `Terms`, `Add Column` inserta filas debajo de la selección, su combinación de teclas con `Shift` añadido las inserta encima, y `Remove Column` elimina las filas que abarca la selección; consulta [Añadir y eliminar filas](./dictionary.md#adding-and-deleting-rows). Para las demás teclas de la pestaña, consulta [Teclas en la pestaña](./dictionary.md#keys-on-the-tab).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` y `Group Selected Tables` ceden el paso a un cursor de texto: mientras editas una celda o una nota o escribes en un campo de texto como el campo Buscar del explorador, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) selecciona el texto, `Space` escribe un espacio, `Delete` y `Backspace` borran texto, y `T` y luego `G` escribe las dos letras.
Copiar y pegar usan los atajos propios del navegador, `Ctrl + C` y `Ctrl + V` (Windows/Linux) o `⌘ + C` y `⌘ + V` (Mac), así que no figuran en esta lista; consulta [Edición de tablas](./table-editing.md).

Las combinaciones de teclas no se pueden cambiar desde esta pestaña.
Un host que integra el editor las reasigna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), salvo las de `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` y `Zoom Reset`, que son fijas.
La pestaña `Shortcuts` muestra entonces las combinaciones del host: un comando que el host no reasigna conserva su combinación predeterminada, y uno que el host no asigna a ninguna tecla no muestra ninguna.
Las teclas de filas de la pestaña Diccionario siguen a `Add Column` y `Remove Column`, así que reasignar cualquiera de los dos las cambia; consulta [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

En Obsidian, estas teclas llegan al editor siempre que la pestaña de Obsidian del diagrama está activa, incluso cuando un atajo de Obsidian usa la misma tecla, como `Alt + Enter`, `Ctrl + K` y `Ctrl + F` (Windows/Linux) o `⌥ + Enter`, `⌘ + K` y `⌘ + F` (Mac). También llega `Alt + Shift + Enter` (Windows/Linux) o `⌥ + Shift + Enter` (Mac) de la pestaña Diccionario, que no figura en ninguna fila de esta lista. Todos los demás atajos de Obsidian siguen funcionando allí. Para `Ctrl + F` o `⌘ + F`, consulta [La barra de búsqueda del navegador](./find-and-replace.md#the-browsers-find-bar).

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly), la pestaña Configuración muestra los ajustes del diagrama y no cambia ninguno. Un distintivo `Read only` está junto al encabezado de cada página, `Preferences` y `Shortcuts`.
Los interruptores `Relationship DataType Sync` y `Maximum comment width` y el campo de ancho están desactivados, y también lo está cada botón de bloqueo. Las filas de `Column Order` no muestran ningún agarre y no se pueden arrastrar.
Cada fila de `Lock` sigue mostrando su valor. Una fila bloqueada muestra el valor que conserva el archivo, y una desbloqueada el ajuste tal como lo tiene esa pantalla, que puede diferir del del archivo, como se explica abajo.

Los ajustes que deciden lo que muestra la pantalla siguen cambiando allí: la posición de la vista y el zoom, la pestaña, la vista de nombres, la base de datos, el lenguaje del Generador de código, los dos estilos de nombres, el delimitador y los interruptores de [`View Option`](./table-related-functions.md#table-view-options).
Cada uno cambia solo esa pantalla, sea cual sea su bloqueo. No se guarda en el archivo ni lo escribe una exportación JSON, no se registra en el historial de deshacer, no cuenta como un cambio y nunca llega a los colaboradores. Los paneles de opciones de las pestañas [Esquema SQL](./schema-sql.md#options-panel) y [Generador de código](./code-generator.md#options-panel) rotulan estas elecciones `This window only` allí, en lugar de `Saved in the document`.
Cuando el editor vuelve a ser editable, la base de datos, el lenguaje, los estilos de nombres, el delimitador y los interruptores de View Option regresan a los valores del archivo. La vista, la pestaña y la vista de nombres se quedan como las dejaste, y el archivo toma cada uno de ellos, según lo que permita su bloqueo, con tu siguiente cambio de él.
