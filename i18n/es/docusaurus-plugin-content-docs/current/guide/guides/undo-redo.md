---
sidebar_position: 13
description: Deshacer y rehacer ediciones, qué registra el historial y cómo recorrerlo paso a paso con el viaje en el tiempo.
---

# Deshacer y rehacer

Puedes volver a un estado de edición anterior o avanzar a uno posterior.  
El historial conserva hasta `2048` cambios.

- Undo: `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac)
- Redo: `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac)

La barra de herramientas incluye esos mismos dos comandos como los botones `Undo` y `Redo`, junto a `Time Travel`.  
Solo se habilitan cuando hay algo que deshacer o rehacer. Un editor `readonly` oculta los tres, y los atajos de teclado no hacen nada.

Deshacer y rehacer solo funcionan en la pestaña ERD. No están disponibles en las pestañas Visualización, Esquema SQL, Generador de código y Configuración. En los campos `Before tables` y `After tables` de la pestaña Esquema SQL, las mismas teclas deshacen y rehacen, en cambio, lo que escribes en el campo.  
Los atajos también quedan inactivos mientras está abierta la búsqueda rápida, `Table Properties`, `Diff Viewer`, la vista previa de `Auto Layout`, el cuadro de diálogo [`Export image`](./file-import-export.md#image), [Asignar columnas](./relationship-editing.md#map-columns) o el viaje en el tiempo.  
Siguen funcionando mientras el teclado está en cualquier parte del [explorador](./explorer.md#keys-in-the-explorer), árbol incluido, y mientras está abierto el [selector de color](./table-related-functions.md#table-and-memo-color-specification). Incluso con el cursor de texto en uno de sus campos, como Buscar, Reemplazar o `Hex`, deshacen y rehacen el diagrama en lugar del texto del campo.

El historial se conserva en memoria durante la sesión actual. No se guarda en el documento, así que al volver a abrir un diagrama se empieza con el historial vacío.

![Mover una tabla y eliminar una columna con ⌥ + Backspace, y luego deshacer ambas acciones con ⌘ + Z y rehacerlas con ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Qué registra el historial {#what-the-history-records}

Se registra:

- Tablas y notas: añadir, eliminar, mover, color, nombre y comentario, texto y tamaño de las notas.
- Grupos de tablas: añadir, eliminar, mover, cambiar el tamaño, nombre, color y el grupo en el que está cada tabla; consulta [Grupos de tablas](./table-groups.md).
- Columnas: añadir, eliminar, reordenar y todas las opciones de columna.
- Relaciones: añadir, eliminar, cambio de tipo, las columnas definidas en [Asignar columnas](./relationship-editing.md#map-columns) y cada opción elegida en `On Delete` u `On Update`; consulta [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Al deshacer una eliminación, la relación vuelve con sus acciones ON DELETE y ON UPDATE.
- Índices y sus columnas.
- Posición de la vista, nivel de zoom y los interruptores de `View Option`.
- Los scripts `Before tables` y `After tables` de la pestaña Esquema SQL, un paso por cada edición que aplicas al salir del campo; consulta [Scripts previos y posteriores](./schema-sql.md#before-and-after-scripts).
- Importar un archivo y añadir uno con [`Import and Add`](./file-import-export.md#import-and-add).

No se registra:

- El proveedor de base de datos y el nombre de la base de datos.
- El lenguaje del Generador de código, `Table Name Case` y `Column Name Case`.
- El tipo de delimitador, tanto si se define en la pestaña Esquema SQL como en la pestaña Generador de código.
- Las opciones `Statements`, `Header` y `Tables` de la pestaña Esquema SQL, que pertenecen a la ventana del editor; consulta [Panel de opciones](./schema-sql.md#options-panel).
- Todo lo que hay en la pestaña Configuración, incluidas las filas de [`Lock`](./settings.md#lock).
- El tema y el idioma de la interfaz; consulta [Idioma y tema](./language-and-theme.md).
- Qué tabla, nota o grupo se dibuja delante de los demás.
- El [explorador](./explorer.md): abrirlo, cerrarlo o cambiar su tamaño, contraer su árbol, y el texto y las opciones de búsqueda. Sin embargo, lo que cambian `Replace` y `Replace All` sí se registra, y también el desplazamiento que hace un salto; consulta [Un gesto, un paso](#one-gesture-one-step).
- El zoom y el desplazamiento de la vista en la pestaña Visualización en cualquiera de los dos modos, mover nodos del grafo o tarjetas de Flow, `Tidy Up`, la vista de filas y centrarse en tablas; consulta [Flow nunca edita el documento](./visualization.md#flow-never-edits-the-document).

Los cambios en cualquiera de estos elementos no se pueden deshacer.

Tampoco se registran los cambios que llegan desde otro editor, así que deshacer solo revierte los tuyos. En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), cada editor deshace sus propios cambios, y un agente de programación que edita a través del [servidor MCP](../../mcp/live-and-headless.md#undo) deshace los suyos con `erd_undo`.

Deshacer un `Import`, que sustituye todo el diagrama, recupera el diagrama anterior tal como lo tenía el editor cuando importaste, con cada [bloqueo](./settings.md#lock) activado o desactivado y cada valor bloqueado tal como estaban entonces.  
Si ese diagrama tenía `Viewport` bloqueado, la vista y el zoom vuelven a la vista bloqueada, donde se abre el diagrama, en lugar de a donde estabas. Con su `Viewport` desbloqueado, vuelven a donde estabas cuando importaste. Los demás ajustes bloqueados, como la pestaña en la que estás o el lenguaje del Generador de código, se quedan como están en tu pantalla.  
Un diagrama nuevo empieza con todos los bloqueos activados. Desbloquea `Viewport` antes de importar para que un deshacer así conserve tu vista. Desbloquearlo después, o importar un archivo JSON cuyo propio bloqueo `Viewport` esté desactivado, no cambia adónde te lleva el deshacer.

## Un gesto, un paso {#one-gesture-one-step}

Todo lo que despacha un solo gesto se convierte en una única entrada del historial.  
Pegar varias tablas y notas a la vez, o duplicarlas con `Alt + drag`, se deshace en un solo paso.

Una pulsación de `Delete` o `Backspace`, o `Delete selected` o `Delete columns` en un menú contextual, es un solo paso, sin importar cuántas tablas, notas, grupos de tablas o columnas elimine.  
Activar o desactivar la clave principal en varias columnas seleccionadas es un solo paso, tanto con `Alt + K` (Windows/Linux) o `⌥ + K` (Mac) como con `Primary Key on selected columns` en el menú contextual de una tabla.  
Asignar un color a la selección, o quitarlo con `No color` o `Remove color`, es un solo paso, sin importar cuántas tablas, notas y grupos estén seleccionados. Elegir un color que ya tenga todo lo seleccionado no registra ningún paso, y tampoco lo registra `No color` cuando nada de lo seleccionado tiene color.  
`Map` o `Save` en [Asignar columnas](./relationship-editing.md#map-columns) es un solo paso, junto con las columnas de clave externa que añade y los tipos de datos que cambia.  
`Import and Add` es un solo paso, junto con el desplazamiento que pone a la vista el bloque añadido cuando este lo necesita.

Crear un [grupo de tablas](./table-groups.md), ya sea dibujándolo o agrupando las tablas seleccionadas con `Group selected tables` o `T` y luego `G`, es un solo paso junto con todas las tablas que incluye. Eliminar un grupo es un solo paso, y al deshacerlo el grupo vuelve con sus tablas dentro.  
Al arrastrar un grupo por su barra de título se mueven el grupo y todas sus tablas en un solo paso. Las tablas que se sueltan dentro o fuera de un grupo cambian de grupo en el mismo paso que su arrastre cuando sueltas en menos de unos `200ms` desde el último movimiento, así que un solo deshacer las devuelve a donde estaban y a los grupos en los que estaban. Tras una pausa más larga antes de soltar, el cambio de grupo es un paso aparte, y el primer deshacer revierte solo eso.  
Cambiar el tamaño de un grupo desde un borde o una esquina se registra una sola vez, al soltar.  
Aplicar la [disposición automática](./table-related-functions.md#auto-layout) es un solo paso, incluidos los grupos que ajusta alrededor de sus tablas.

`Replace All` en [Buscar y reemplazar](./find-and-replace.md#replacing) también es un solo paso, sin importar cuántos nombres de tabla, nombres de columna, nombres de índice, nombres de grupo de tablas, comentarios y notas cambie. Cuando no cambia nada, como cuando `Preserve Case` vuelve a escribir cada coincidencia tal como estaba, no registra ningún paso.  
Un único `Replace` es un paso, incluido el desplazamiento hasta la siguiente coincidencia cuando esta lo necesita. Cuando vuelve a escribir su coincidencia tal como estaba, solo registra ese desplazamiento, o nada si no lo hay.  
Ir a una coincidencia solo desplaza el lienzo cuando la coincidencia no se ve ya bien; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands). Ese desplazamiento se registra como cualquier otro cambio de posición de la vista, así que, después de recorrer coincidencias, deshacer revierte primero esos desplazamientos, uno por paso.  
Los demás saltos que terminan en el lienzo registran sus desplazamientos de la misma forma: elegir una fila en el explorador, un resultado de la búsqueda rápida o el [botón de la tarjeta](./visualization.md#card-buttons) de enlace externo en Flow. Un salto que deja la vista donde está no registra nada. Elegir una fila en la lista de `Diff Viewer` tampoco registra nada, ya que solo mueve los propios lados de solo lectura del visor de diferencias.

Un arrastre continuo, un desplazamiento de la vista del lienzo, un zoom, un pellizco o un cambio de color se acumula durante unos `200ms` y también se registra como una sola entrada.  
Un arrastre que se mueve menos de `20px` en total no registra ningún movimiento. Solo se registra el cambio de grupo que produzca, si lo hay.

Lo que escribes en una celda o una nota se registra por cada entrada de texto y no por gesto: cada carácter escrito, cada acción de pegar y cada paso de una composición IME es un paso aparte.  
El nombre de un grupo de tablas se registra una sola vez, cuando se guarda al pulsar `Enter` o salir del campo, así que el nombre que escribes en un grupo que acabas de crear es un paso distinto de su creación. `Esc`, o un nombre que se deja sin cambios, no registra nada.

## Viaje en el tiempo {#time-travel}

Se abre con el botón `Time Travel` de la barra de herramientas, junto a los botones de deshacer y rehacer.  
El botón no hace nada hasta que la sesión tenga al menos un cambio registrado.

El viaje en el tiempo abre una copia aparte y de solo lectura del diagrama, en la posición de desplazamiento y el nivel de zoom que muestra el lienzo, esté o no activado el bloqueo `Viewport`.  
Arrastra el control deslizante, o haz clic en cualquier punto de su pista, para recorrer todo el historial de edición y ver una vista previa de cada punto. La posición más a la izquierda del control deslizante es el estado un paso antes del primer cambio registrado, y se abre con el tirador en el estado actual.  
La vista previa es inerte: dibuja un minimapa, pero no puedes desplazar la vista, desplazarte por ella ni editarla, y el documento real no se modifica hasta que apliques.

Pulsa `Apply` para restaurar el punto seleccionado, o `Cancel` o `Esc` para dejar el documento sin cambios.

![Abrir el viaje en el tiempo, arrastrar el control deslizante hacia atrás por la sesión y aplicar un punto anterior](/img/demo-time-travel.webp)
