---
sidebar_position: 1
description: Empieza desde la pantalla de bienvenida y crea tablas, notas, grupos de tablas y relaciones desde el menú contextual del lienzo, la barra de herramientas del lienzo o un atajo de teclado.
---

# Empezar a editar

La edición empieza en el menú contextual, que se abre con un clic derecho.

![Hacer clic con el botón derecho en el lienzo, abrir el submenú Relationship, añadir una tabla y abrir después su propio menú](/img/demo-context-menu.webp)

Un clic derecho sobre una tabla, una nota, un grupo de tablas o una relación abre en su lugar el menú propio de ese elemento.  
Un clic derecho sobre una tabla, una nota o un grupo de tablas que ya está seleccionado conserva toda la selección, de modo que opciones como `Color` y `Delete selected` actúan sobre toda ella; consulta [Selección múltiple](./table-related-functions.md#multiple-selection).  
Un editor de solo lectura no crea nada, así que no ofrece nada de lo que describe esta página: el menú del lienzo conserva solo `View Option`, `Name View`, `Export` y `Diff Viewer`, el menú de una tabla solo `Table Properties`, y una nota, un grupo de tablas o una relación no abre ningún menú; consulta [Editores de solo lectura](./table-related-functions.md#read-only-editors).

## Pantalla de bienvenida {#welcome-screen}

En la aplicación web, Google Drive, VS Code, Obsidian y un IDE de JetBrains, un diagrama vacío se abre con una pantalla de bienvenida sobre el lienzo ERD. Un `<erd-editor>` en tu propia página solo la muestra cuando la página la activa con [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Un diagrama cuenta como vacío mientras no contiene ninguna tabla, ninguna nota visible ni ningún grupo de tablas visible, así que las notas y los grupos ocultos con Opciones de vista no cuentan. La pantalla desaparece en cuanto el diagrama contiene uno de ellos, y vuelve cada vez que el diagrama se queda vacío de nuevo, por ejemplo después de eliminar la última tabla o de deshacer la adición de la primera.  
No se muestra en un editor de solo lectura, en el modo zen, mientras el panel Propiedades de la tabla está abierto ni mientras el visor de diferencias, la vista previa de la disposición automática o el viaje en el tiempo ocupan el lienzo.

![La pantalla de bienvenida en un diagrama vacío: abrir los formatos de Import, volver con Esc, añadir una tabla con New Table y hacer que vuelva la pantalla con ⌘ + Z](/img/demo-welcome-screen.webp)

Bajo el título `Right-click the canvas for every action.` hay un menú:

- `New Table` añade una tabla, como hace `Alt + N`.
- `New Memo` añade una nota, como hace `Alt + M`. No aparece mientras las notas están ocultas.
- `Import` sustituye el menú por `Back` y los formatos `json`, `Schema SQL`, `GraphQL`, `DBML` y `AML`. Al elegir un formato se pide un archivo de ese formato, que se carga en lugar del diagrama vacío; consulta [Importar o exportar archivos](./file-import-export.md). `Back`, o `Escape`, vuelve al primer menú.
- `Command Palette` abre la [búsqueda rápida](./quick-search.md), como hace `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac).
- `Shortcuts` abre Configuración en su pestaña [`Shortcuts`](./settings.md#shortcuts).

Donde el lienzo es lo bastante ancho, `New Table`, `New Memo` y `Command Palette` muestran la tecla asignada en ese momento a su comando, incluida una que un host haya reasignado.  
Cuando una opción tiene el foco del teclado, `↑` y `↓` recorren las opciones de forma circular, `Home` y `End` saltan a la primera y a la última, y `Enter` o `Space` pulsa la opción con el foco. Todos los demás atajos siguen funcionando, así que `Alt + N` también añade una tabla desde ahí.  
Solo el menú recibe clics: una pulsación en cualquier otro punto de la pantalla llega al lienzo, y un clic derecho en el lienzo abre el menú contextual como siempre.

Donde el lienzo tiene espacio, unas flechas dibujadas a mano señalan:

- el botón `Search` de la barra de herramientas: `Search commands and tables`
- los botones `Theme` y `Display Language`: `Pick a theme and a language`, o `Pick a theme` o `Pick a language` cuando la barra de herramientas muestra solo uno de ellos; consulta [Idioma y tema](./language-and-theme.md)
- la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar) de la parte inferior: `Pan, zoom and draw relationships`

Mientras se muestra el [explorador](./explorer.md), la pantalla de bienvenida cubre solo el lienzo que hay a su lado.  
Se omite cualquier flecha cuyo botón de la barra de herramientas quede sobre el explorador. La flecha de `Theme` y `Display Language` solo se omite cuando sus dos botones quedan sobre el explorador; hasta entonces, señala el que sigue sobre el lienzo.  
Una etiqueta sin espacio junto a su flecha se coloca, en cambio, debajo de ella.

## Creación de tablas {#table-creation}

Crea una tabla desde el menú contextual, con el botón `New Table` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar) o con el atajo de teclado `Alt + N`.

## Creación de notas {#memo-creation}

Crea una nota desde el menú contextual, con el botón `New Memo` de la barra de herramientas del lienzo o con el atajo `Alt + M`.  
Mientras Opciones de vista → `Memos` está desactivado, las notas están ocultas, `New Memo` no se ofrece en ningún sitio y `Alt + M` no añade ninguna; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options).

Una nota es una anotación de texto libre en el lienzo. Haz clic en su cuerpo y escribe; el texto se guarda con el documento.  
`Escape` cierra el editor de la nota, conserva lo que has escrito y deja la nota seleccionada, y un segundo `Escape` anula la selección.  
Arrastra su borde para cambiar su tamaño. La `x` de su encabezado, que se muestra mientras el puntero está sobre la nota, la elimina.  
Un clic derecho sobre una nota abre su menú en lugar del editor: `Color`, `Remove color` mientras algún elemento seleccionado tiene color, y `Delete`, que indica `Delete selected` mientras la nota es uno de dos o más elementos seleccionados. Una nota seleccionada también se elimina con las teclas que eliminan tablas; consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion).

![Añadir una nota con Alt + M, escribir un texto y arrastrar su borde para cambiar su tamaño](/img/demo-memo.webp)

## Creación de grupos de tablas {#table-group-creation}

Un grupo de tablas es un recuadro que contiene tablas, y puedes darle un nombre y un color. Crea uno de una de estas dos formas:

- Elige `New Table Group` en el menú contextual o en la búsqueda rápida, haz clic en el botón `New Table Group` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar) o pulsa `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), y después arrastra un recuadro sobre el lienzo. Cada tabla cuyo centro quede dentro del recuadro se une al nuevo grupo, salvo que ya esté en otro grupo; consulta [Dibujar un grupo](./table-groups.md#drawing-a-group).
- Selecciona tablas y elige `Group selected tables` en el menú contextual de una tabla o `Group Selected Tables` en la búsqueda rápida, o pulsa `T` y luego `G`; consulta [Agrupar las tablas seleccionadas](./table-groups.md#grouping-selected-tables).

Cómo darles nombre y color, moverlos, cambiar su tamaño y todo lo demás se explica en [Grupos de tablas](./table-groups.md).

## Creación de relaciones {#relationship-creation}

Inicia una relación desde el menú contextual, desde la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar) de la parte inferior del lienzo o con un atajo. Cada tipo de relación tiene el suyo:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) o `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) o `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) o `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) o `⌘ + ⌥ + 4` (Mac)

Cuando un tipo está preparado, el cursor cambia. Haz clic primero en la tabla padre y después en la tabla hija.  
La tabla padre recibe una clave principal si no tiene ninguna, y por cada columna de clave principal de la tabla padre, la tabla hija recibe una columna de clave externa `Not Null` con el mismo tipo de datos, valor predeterminado, comentario, [nombre lógico](./logical-names.md) y [dominio](./dictionary.md#domains-and-data-types).  
Una clave serial es la excepción: su clave externa toma el tipo entero que almacena el serial, como `integer` para `serial4`, y entonces no vincula ningún dominio; consulta [Relaciones identificadoras](./relationship-editing.md#identifying-relationships).  
Cada columna de clave externa recibe su nombre a partir de su clave: a un nombre de una sola palabra, como `id`, se le antepone el nombre de la tabla padre (`user_id`), un nombre de varias palabras, como `member_id`, se conserva, y un nombre que la tabla hija ya tiene se numera (`user_id_2`); consulta [Nombres de las columnas de clave externa](./relationship-editing.md#foreign-key-column-names).  
Al hacer clic dos veces en la misma tabla se dibuja una relación autorreferencial.  
Una relación nueva empieza con `On Delete` y `On Update`, ambos en `Not set`: cámbialos desde su menú contextual; consulta [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Para cancelar, pulsa `Escape` o vuelve a pulsar el mismo atajo. Al cancelar, la selección queda como está, y el siguiente `Escape` la anula.

Una vez elegida la tabla padre, al señalar con el puntero una tabla en la que puede terminar la relación, esa tabla se marca con un contorno y aparecen dos botones a su lado:

- `Create new columns` (`+`) dibuja la relación con columnas de clave externa nuevas, igual que hacer clic en la tabla.
- `Map to existing columns` (un icono de enlace) termina el dibujo y abre el cuadro de diálogo [Asignar columnas](./relationship-editing.md#map-columns) para las dos tablas, de modo que la relación pueda usar columnas que la tabla hija ya tiene. No se escribe nada hasta que pulsas `Map`.

La tabla padre también muestra los botones en cuanto el puntero se ha alejado un poco del punto donde hiciste clic en ella, así que una relación autorreferencial también se puede asignar a columnas existentes.  
Con un dedo no se puede pasar el puntero por encima, así que, al dibujar con él, los botones nunca aparecen y tocar la tabla hija dibuja la relación de inmediato; un lápiz los muestra igual que un ratón.  
Si la tabla padre ha perdido su clave principal cuando llegas a la tabla hija, por ejemplo por una acción de deshacer o por la edición de un colaborador, `Create new columns` aparece atenuado con la descripción emergente `<parent> has no primary key to copy`, y al hacer clic en la tabla hija se termina el dibujo sin dibujar nada.  
La descripción emergente nombra la tabla padre como lo hace la [vista de nombres](./logical-names.md#beyond-the-canvas).

![Dibujar una relación One N con ⌘ + ⌥ + 4 y después una Zero N desde la barra de herramientas del lienzo, con la tabla hija marcada con un contorno y sus botones Map to existing columns y Create new columns](/img/demo-relationship.webp)

## Duplicar tablas y notas {#duplicating-tables-and-memos}

Las tablas y notas existentes se pueden copiar, pegar y duplicar arrastrándolas con `Alt`; consulta [Funciones relacionadas con las tablas](./table-related-functions.md#copyingpasting-tables-and-memos).
