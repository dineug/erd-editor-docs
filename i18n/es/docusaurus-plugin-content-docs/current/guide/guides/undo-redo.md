---
sidebar_position: 15
description: Deshacer y rehacer ediciones, qué registra el historial, los historiales propios de las hojas del diccionario y cómo recorrer paso a paso el historial del diagrama con el viaje en el tiempo.
---

# Deshacer y rehacer

Puedes volver a un estado de edición anterior o avanzar a uno posterior.  
El historial conserva hasta `2048` cambios.

- Undo: `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac)

En la pestaña ERD, la barra de herramientas incluye esos mismos dos comandos como los botones `Undo` y `Redo`, junto a `Time Travel`. En la pestaña Diccionario muestra `Undo` y `Redo` sin `Time Travel`, y ninguna otra pestaña los muestra.  
Solo se habilitan cuando hay algo que deshacer o rehacer. Un editor `readonly` los oculta, junto con `Time Travel`, y los atajos de teclado no deshacen ni rehacen nada.

Deshacer y rehacer actúan sobre el historial del diagrama solo en la pestaña ERD.  
Allí, los atajos quedan inactivos mientras está abierta la búsqueda rápida, `Table Properties`, `Diff Viewer`, la vista previa de `Auto Layout`, el cuadro de diálogo [`Export image`](./file-import-export.md#image), [Asignar columnas](./relationship-editing.md#map-columns) o el viaje en el tiempo.  
Siguen funcionando mientras el teclado está en cualquier parte del [explorador](./explorer.md#keys-in-the-explorer), árbol incluido, y mientras está abierto el [selector de color](./table-related-functions.md#table-and-memo-color-specification). Incluso con el cursor de texto en uno de sus campos, como Buscar, Reemplazar o `Hex`, deshacen y rehacen el diagrama en lugar del texto del campo.

En las demás pestañas:

- Diccionario: deshacen y rehacen las ediciones de la hoja que se muestra, `Domains`, `Words` o `Terms`, a partir del historial propio de esa hoja, nunca del historial del diagrama. En `Checks` no hacen nada; consulta [Hojas del diccionario](#dictionary-sheets).
- Visualización: en `Flow`, las mismas teclas retroceden y avanzan por lo que ha mostrado Flow, como hacen `Previous table` y `Next table`, también en un editor `readonly`. Allí nunca deshacen ni rehacen cambios del diagrama; consulta [Tabla anterior y tabla siguiente](./visualization.md#previous-table-and-next-table). En `Graph` no hacen nada.
- Esquema SQL, Generador de código y Configuración: no están disponibles. En los campos `Before tables` y `After tables` de la pestaña Esquema SQL, las mismas teclas deshacen y rehacen, en cambio, lo que escribes en el campo.

El historial se conserva en memoria durante la sesión actual. No se guarda en el documento, así que al volver a abrir un diagrama se empieza con el historial vacío.

![Mover una tabla y eliminar una columna con ⌥ + Backspace, y luego deshacer ambas acciones con ⌘ + Z y rehacerlas con ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Qué registra el historial {#what-the-history-records}

Se registra:

- Tablas y notas: añadir, eliminar, mover y color; el nombre, el nombre lógico y el comentario de una tabla; el texto y el tamaño de una nota.
- Grupos de tablas: añadir, eliminar, mover, cambiar el tamaño, nombre, color y el grupo en el que está cada tabla; consulta [Grupos de tablas](./table-groups.md).
- Columnas: añadir, eliminar, reordenar, nombre lógico, el dominio al que está vinculada cada una y todas las opciones de columna.
- Los nombres físicos que derivan los diccionarios, y si cada nombre es tuyo o de los diccionarios: un solo deshacer devuelve a la vez un nombre y ese estado; consulta [Nombres escritos por ti](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` y `Derive Physical Names Again`; consulta [Volver a derivar los nombres físicos](./dictionary.md#derive-physical-names-again).
- Relaciones: añadir, eliminar, cambio de tipo, las columnas definidas en [Asignar columnas](./relationship-editing.md#map-columns) y cada opción elegida en `On Delete` u `On Update`; consulta [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Al deshacer una eliminación, la relación vuelve con sus acciones ON DELETE y ON UPDATE.
- Índices y sus columnas.
- Posición de la vista, nivel de zoom y los interruptores de `View Option`.
- Los scripts `Before tables` y `After tables` de la pestaña Esquema SQL, un paso por cada edición que aplicas al salir del campo; consulta [Scripts previos y posteriores](./schema-sql.md#before-and-after-scripts).
- Importar un archivo y añadir uno con [`Import and Add`](./file-import-export.md#import-and-add).

No se registra:

- El proveedor de base de datos y el nombre de la base de datos.
- El lenguaje del Generador de código, `Table Name Case` y `Column Name Case`.
- El tipo de delimitador, tanto si se define en la pestaña Esquema SQL como en la pestaña Generador de código.
- Las opciones `Statements`, `Header`, `Write logical names into empty comments` y `Tables` de la pestaña Esquema SQL, que pertenecen a la ventana del editor; consulta [Panel de opciones](./schema-sql.md#options-panel).
- Todo lo que hay en la pestaña Configuración, incluidas las filas de [`Lock`](./settings.md#lock).
- Cambiar la vista de nombres, desde cualquiera de sus lugares, tanto si su bloqueo está activado como si no; consulta [Cambiar la vista](./logical-names.md#switching-the-view).
- El tema y el idioma de la interfaz; consulta [Idioma y tema](./language-and-theme.md).
- Qué tabla, nota o grupo se dibuja delante de los demás.
- El [explorador](./explorer.md): abrirlo, cerrarlo o cambiar su tamaño, contraer su árbol, y el texto y las opciones de búsqueda. Sin embargo, lo que cambian `Replace` y `Replace All` sí se registra, y también el desplazamiento que hace un salto; consulta [Un gesto, un paso](#one-gesture-one-step).
- El zoom y el desplazamiento de la vista en la pestaña Visualización en cualquiera de los dos modos, mover nodos del grafo o tarjetas de Flow, `Tidy Up`, la vista de filas, centrarse en tablas y retroceder o avanzar con `Previous table` y `Next table`; consulta [Flow nunca edita el documento](./visualization.md#flow-never-edits-the-document).
- La hoja que se muestra en la pestaña Diccionario, y la búsqueda, la selección, el desplazamiento y los anchos de columna de cada hoja; consulta [Abrir la pestaña](./dictionary.md#opening-the-tab).

Los cambios en cualquiera de estos elementos no se pueden deshacer.

Un editor de solo lectura no registra nada en absoluto. La posición de la vista, el zoom y los interruptores de `View Option` siguen cambiando allí, junto con la pestaña, la vista de nombres, la base de datos y los ajustes de código, pero solo en esa pantalla, así que no hay nada que deshacer; consulta [Editores de solo lectura](./settings.md#read-only-editors) de Configuración.

Las ediciones hechas en la pestaña Diccionario se pueden deshacer, pero van al historial de su propia hoja y no a este, así que deshacer en la pestaña ERD nunca revierte ninguna, ni siquiera el nuevo `Data Type` de un dominio y los tipos de columna que cambia; consulta [Hojas del diccionario](#dictionary-sheets).

Tampoco se registran los cambios que llegan desde otro editor, así que deshacer solo revierte los tuyos. En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), cada editor deshace sus propios cambios, y un agente de programación que edita a través del [servidor MCP](../../mcp/live-and-headless.md#undo) deshace los suyos con `erd_undo`.

Deshacer un `Import`, que sustituye todo el diagrama, recupera el diagrama anterior tal como lo tenía el editor cuando importaste, con cada [bloqueo](./settings.md#lock) activado o desactivado y cada valor bloqueado tal como estaban entonces.  
Si ese diagrama tenía `Viewport` bloqueado, la vista y el zoom vuelven a la vista bloqueada, donde se abre el diagrama, en lugar de a donde estabas. Con su `Viewport` desbloqueado, vuelven a donde estabas cuando importaste. Los demás ajustes bloqueados, como la pestaña en la que estás, el lenguaje del Generador de código o la vista de nombres, se quedan como están en tu pantalla.  
Un diagrama nuevo empieza con todos los bloqueos activados. Desbloquea `Viewport` antes de importar para que un deshacer así conserve tu vista. Desbloquearlo después, o importar un archivo JSON cuyo propio bloqueo `Viewport` esté desactivado, no cambia adónde te lleva el deshacer.

Deshacer la importación de un archivo JSON también recupera las palabras, los términos y los dominios que tenía el diagrama anterior. Una importación de Esquema SQL, GraphQL, DBML o AML conserva los diccionarios, así que deshacerla y rehacerla los deja como están, incluidas las ediciones hechas desde entonces en la pestaña Diccionario.

Un deshacer o rehacer en la pestaña ERD que vuelve a vincular una columna a un dominio, o que recupera una columna vinculada a uno, da a la columna el tipo de datos del dominio tal como está ahora. Uno que devuelve otro tipo a una columna vinculada la desvincula; consulta [Dominios y tipos de datos](./dictionary.md#domains-and-data-types).

## Un gesto, un paso {#one-gesture-one-step}

Todo lo que despacha un solo gesto se convierte en una única entrada del historial.  
Pegar varias tablas y notas a la vez, o duplicarlas con `Alt + drag`, se deshace en un solo paso.

Una pulsación de `Delete` o `Backspace`, o `Delete selected` o `Delete columns` en un menú contextual, es un solo paso, sin importar cuántas tablas, notas, grupos de tablas o columnas elimine.  
Activar o desactivar la clave principal en varias columnas seleccionadas es un solo paso, tanto con `Alt + K` (Windows/Linux) o `⌥ + K` (Mac) como con `Primary Key on selected columns` en el menú contextual de una tabla.  
Asignar un color a la selección, o quitarlo con `No color` o `Remove color`, es un solo paso, sin importar cuántas tablas, notas y grupos estén seleccionados. Elegir un color que ya tenga todo lo seleccionado no registra ningún paso, y tampoco lo registra `No color` cuando nada de lo seleccionado tiene color.  
`Map` o `Save` en [Asignar columnas](./relationship-editing.md#map-columns) es un solo paso, junto con las columnas de clave externa que añade y los tipos de datos que cambia.  
`Import and Add` es un solo paso, junto con el desplazamiento que pone a la vista el bloque añadido cuando este lo necesita.

Elegir un término de la lista bajo una celda del nombre lógico es un solo paso: el nombre lógico, el nombre físico que deriva y, en una columna, el dominio del término con su tipo de datos; consulta [Completar nombres de términos](./logical-names.md#completing-term-names).  
Elegir un dominio en la celda Dominio de una columna es un solo paso, junto con el tipo de datos que da a la columna y lo que [Sincronizar el tipo de datos en las relaciones](./settings.md#relationship-datatype-sync) transmite por las relaciones. Elegir `None`, que desvincula la columna, también es un solo paso; consulta [La celda Dominio](./logical-names.md#the-domain-cell). Escribir en una columna vinculada un tipo de datos distinto del de su dominio desvincula la columna en el paso de esa entrada.  
`Derive Physical Name Again` o `Derive Physical Names Again` es un solo paso, sin importar cuántos nombres, vínculos con dominios y tipos de datos cambie. No registra ningún paso únicamente cuando no cambia nada. Devolver a los diccionarios un nombre escrito por ti es un cambio, aunque el nombre ya contenga lo que ellos dan.

Crear un [grupo de tablas](./table-groups.md), ya sea dibujándolo o agrupando las tablas seleccionadas con `Group selected tables` o `T` y luego `G`, es un solo paso junto con todas las tablas que incluye. Eliminar un grupo es un solo paso, y al deshacerlo el grupo vuelve con sus tablas dentro.  
Al arrastrar un grupo por su barra de título se mueven el grupo y todas sus tablas en un solo paso. Las tablas que se sueltan dentro o fuera de un grupo cambian de grupo en el mismo paso que su arrastre cuando sueltas en menos de unos `200ms` desde el último movimiento, así que un solo deshacer las devuelve a donde estaban y a los grupos en los que estaban. Tras una pausa más larga antes de soltar, el cambio de grupo es un paso aparte, y el primer deshacer revierte solo eso.  
Cambiar el tamaño de un grupo desde un borde o una esquina se registra una sola vez, al soltar.  
Aplicar la [disposición automática](./table-related-functions.md#auto-layout) es un solo paso, incluidos los grupos que ajusta alrededor de sus tablas.

`Replace All` en [Buscar y reemplazar](./find-and-replace.md#replacing) también es un solo paso, sin importar cuántos nombres de tabla, nombres de columna, nombres lógicos, nombres de índice, nombres de grupo de tablas, comentarios y notas cambie, incluidos los nombres físicos y los vínculos con dominios que derivan los nombres lógicos. Cuando no cambia nada, como cuando `Preserve Case` vuelve a escribir cada coincidencia tal como estaba, no registra ningún paso.  
Un único `Replace` es un paso, incluidos lo que deriva un nombre lógico y el desplazamiento hasta la siguiente coincidencia cuando esta lo necesita. Cuando vuelve a escribir su coincidencia tal como estaba, solo registra ese desplazamiento, o nada si no lo hay.  
Ir a una coincidencia solo desplaza el lienzo cuando la coincidencia no se ve ya bien; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands). Ese desplazamiento se registra como cualquier otro cambio de posición de la vista, así que, después de recorrer coincidencias, deshacer revierte primero esos desplazamientos, uno por paso.  
Los demás saltos que terminan en el lienzo registran sus desplazamientos de la misma forma: elegir una fila en el explorador, un resultado de la búsqueda rápida, una comprobación de la hoja `Checks` de la pestaña Diccionario que nombra una tabla o una columna, o el [botón de la tarjeta](./visualization.md#card-buttons) de enlace externo en Flow. Un salto que deja la vista donde está no registra nada. Elegir una fila en la lista de `Diff Viewer` tampoco registra nada, ya que solo mueve los propios lados de solo lectura del visor de diferencias.

Un arrastre continuo, un desplazamiento de la vista del lienzo, un zoom, un pellizco o un cambio de color se acumula durante unos `200ms` y también se registra como una sola entrada.  
Un arrastre que se mueve menos de `20px` en total no registra ningún movimiento. Solo se registra el cambio de grupo que produzca, si lo hay.

Lo que escribes en una celda o una nota se registra por cada entrada de texto y no por gesto: cada carácter escrito, cada acción de pegar y cada paso de una composición IME es un paso aparte.  
Una celda del nombre lógico se registra de la misma forma. Cuando su editor se cierra con un nombre lógico distinto del que tenía al abrirse, el nombre físico que derivan de él los diccionarios es un paso más después de lo escrito. El primer deshacer revierte solo ese nombre, con el dominio y el tipo de datos que trajo un término, y deja el nombre lógico que escribiste. Cuando no se deriva nada, no se registra nada más; consulta [Escribir un nombre lógico](./logical-names.md#writing-a-logical-name).  
El nombre de un grupo de tablas se registra una sola vez, cuando se guarda al pulsar `Enter` o salir del campo, así que el nombre que escribes en un grupo que acabas de crear es un paso distinto de su creación. `Esc`, o un nombre que se deja sin cambios, no registra nada.

## Hojas del diccionario {#dictionary-sheets}

Las hojas `Domains`, `Words` y `Terms` de la pestaña Diccionario conservan cada una un historial propio, aparte del historial del diagrama. Cada edición hecha en la pestaña va al historial de la hoja cuyas filas escribe. Como el del diagrama, cada historial conserva hasta `2048` pasos y se guarda en memoria durante la sesión.

- Con el teclado en la pestaña, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) deshace la última edición de la hoja que se muestra, y `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac) rehace la última que se deshizo.
- Los botones `Undo` y `Redo` de la barra de herramientas hacen lo mismo, y solo se habilitan cuando la hoja que se muestra tiene una edición que deshacer o rehacer. Al pulsarlos, el foco del teclado se queda donde estaba, en la cuadrícula o en el campo de búsqueda. La pestaña no tiene `Time Travel`.
- En `Checks`, donde no se edita nada, los botones siguen deshabilitados, y ni ellos ni las teclas hacen nada.
- Con la edición de una celda abierta, o con el cursor de texto en el campo de búsqueda de la pestaña, las teclas deshacen y rehacen, en cambio, lo que escribes allí.

Los historiales nunca se cruzan. Deshacer en la pestaña ERD nunca revierte una edición de una hoja, y deshacer en una hoja nunca revierte una edición de otra hoja ni del diagrama. Cada hoja conserva su historial mientras cambias de hoja o de pestaña.

Cada uno de estos es un paso de su hoja:

- La edición de una celda, que se registra una sola vez cuando se escribe y no por cada carácter escrito, y solo cuando cambia el valor; consulta [Editar celdas](./dictionary.md#editing-cells).
- Un pegado, incluidas las filas que añade, y borrar las celdas seleccionadas con `Delete` o `Backspace`; consulta [Copiar y pegar](./dictionary.md#copying-and-pasting).
- `Add Row`, y cada inserción o eliminación de filas, desde la barra, el menú de la cuadrícula o las teclas, sin importar cuántas filas abarque; consulta [Añadir y eliminar filas](./dictionary.md#adding-and-deleting-rows).
- El dominio de un término elegido en su lista, `None` incluido; consulta [El dominio de un término](./dictionary.md#a-terms-domain).
- Una ordenación; consulta [Ordenar](./dictionary.md#sorting).
- Un archivo CSV importado con `Import CSV`, sin importar cuántas filas añada o actualice. Es un paso de la hoja que rellena el archivo, que la pestaña muestra a continuación, sea cual sea la hoja desde la que lo importaste; consulta [Importar](./dictionary.md#importing).

Una escritura que no cambia nada, como volver a importar el mismo archivo u ordenar una hoja que ya está en ese orden, no registra ningún paso, y tampoco una rechazada con una notificación `Nothing saved: …`. Cuando a un término sin `Physical Name` se le da un nombre, el nombre físico que componen sus palabras forma parte del paso de esa edición.

El nuevo `Data Type` de un dominio es un paso de la hoja `Domains`, junto con los tipos que da a las columnas vinculadas al dominio y a las que alcanza desde ellas el ajuste Sincronizar el tipo de datos en las relaciones; consulta [Dominios y tipos de datos](./dictionary.md#domains-and-data-types).  
Deshacerlo o rehacerlo cambia el tipo de las columnas vinculadas al dominio en ese momento, así que una columna que desde entonces hayas vinculado a otro dominio o a la que hayas cambiado el tipo conserva su tipo. Una columna que el paso desvinculó, como una clave externa a la que la sincronización desvinculó de su propio dominio, solo se vuelve a vincular mientras siga desvinculada y conserve el tipo con el que la dejó el paso.

Un editor `readonly` oculta los botones, y las teclas no deshacen ni rehacen nada.  
Tampoco se registran en el historial de una hoja los cambios de los colaboradores y de los agentes de programación.

El historial de cada hoja se vacía cuando se sustituyen los diccionarios: con un `Import` de un archivo JSON, tuyo o de un colaborador, al deshacerlo o rehacerlo y al cargar otro diagrama en el editor. Un `Import` de Esquema SQL, GraphQL, DBML o AML conserva los diccionarios, y con ellos el historial de cada hoja, también al deshacerlo y rehacerlo.

## Viaje en el tiempo {#time-travel}

Se abre con el botón `Time Travel` de la barra de herramientas, junto a los botones de deshacer y rehacer en la pestaña ERD.  
El botón no hace nada hasta que el historial del diagrama tenga al menos un cambio registrado. Un editor de solo lectura no muestra ese botón, y un editor que pasa a solo lectura cierra el viaje en el tiempo sin aplicarlo.

El viaje en el tiempo abre una copia aparte y de solo lectura del diagrama, en la posición de desplazamiento, el nivel de zoom y la [vista de nombres](./logical-names.md#name-view) que muestra el lienzo, esté o no activado el bloqueo `Viewport` o `Name View`.  
Solo recorre el historial del diagrama, así que las ediciones de las hojas del diccionario no están entre sus puntos.  
Arrastra el control deslizante, o haz clic en cualquier punto de su pista, para recorrer todo el historial de edición y ver una vista previa de cada punto. La posición más a la izquierda del control deslizante es el estado un paso antes del primer cambio registrado, y se abre con el tirador en el estado actual.  
La vista previa es inerte: dibuja un minimapa, pero no puedes desplazar la vista, desplazarte por ella ni editarla, y el documento real no se modifica hasta que apliques.

Pulsa `Apply` para restaurar el punto seleccionado, o `Cancel` o `Esc` para dejar el documento sin cambios.

![Abrir el viaje en el tiempo, arrastrar el control deslizante hacia atrás por la sesión y aplicar un punto anterior](/img/demo-time-travel.webp)
