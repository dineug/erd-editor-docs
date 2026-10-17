---
sidebar_position: 5
description: Reúne tablas relacionadas en un recuadro con nombre y color dibujado detrás de ellas; crea grupos, dales nombre y color, muévelos, cambia su tamaño y elimínalos, ve a ellos desde el explorador, cambia qué tablas contienen, ocúltalos y mantenlos en la disposición automática, el Esquema SQL y DBML.
---

# Grupos de tablas

Un grupo de tablas es un recuadro con nombre y color que se dibuja detrás de tablas relacionadas en el lienzo ERD para mostrar qué tablas van juntas.  
Una tabla está como máximo en un grupo. Los grupos se guardan con el diagrama, junto con el grupo en el que está cada tabla.

El recuadro tiene en su parte superior una barra de título con un icono de grupo, el nombre del grupo en negrita y, mientras el puntero está sobre el grupo, una `x` que lo elimina; consulta [Eliminar un grupo](#removing-a-group). Un grupo sin nombre muestra `unnamed`, y un nombre demasiado largo para la barra se corta con `…`.  
El recuadro siempre contiene sus tablas: conserva el tamaño que se le dio, pero se amplía para mantener dentro cada tabla con `24px` de margen a su alrededor y la barra de título encima. Una tabla que crece amplía el recuadro con ella, y lo mismo ocurre con una tabla que se suelta cerca de un borde con su centro todavía dentro del recuadro. Mientras se arrastran tablas, el recuadro ni crece ni se encoge. La ampliación no se guarda: el recuadro vuelve a su propio tamaño en cuanto la tabla ya no necesita el espacio.

Los grupos se dibujan detrás de todo lo demás en el lienzo: tablas, notas y líneas de relación.  
Donde los grupos se superponen, el último sobre el que se ha pulsado o el último añadido se dibuja delante, y el cuerpo de un grupo nunca tapa la barra de título de otro. El orden no se guarda, así que un diagrama que se vuelve a abrir apila sus grupos en el orden en que se añadieron.  
Los grupos se muestran en el lienzo ERD, en el minimapa y en una imagen exportada, y el [explorador](./explorer.md) los enumera; consulta [Ir a un grupo](#going-to-a-group). La pestaña [Visualización](./visualization.md) no dibuja grupos ni colores de grupo en ninguno de los dos modos.

Un agente de programación también puede crear y cambiar grupos, y leer el DDL de los grupos elegidos; consulta [Grupos de tablas](../../mcp/tools.md#table-groups) en las herramientas MCP.

![Preparar el dibujo de un grupo con ⌥ + G, dibujarlo sobre orders y payments, llamarlo Billing, soltar order_items dentro y luego mover el grupo y cambiar su tamaño](/img/demo-table-group.webp)

## Crear un grupo {#creating-a-group}

Hay dos formas de crear un grupo, cada una con un atajo de teclado. Ninguna se ofrece en un editor de solo lectura ni mientras los grupos están [ocultos](#hiding-groups), y entonces sus atajos no hacen nada.  
Como los demás atajos del lienzo, solo funcionan en la pestaña ERD y quedan inactivos mientras se edita una celda, una nota o el nombre de un grupo; consulta [Atajos de teclado](./settings.md#shortcuts).

### Dibujar un grupo {#drawing-a-group}

Haz clic en el botón `New Table Group` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), pulsa `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), o elige `New Table Group` en el menú contextual del lienzo, donde sigue a `New Table` y `New Memo`, o en la [búsqueda rápida](./quick-search.md) de la pestaña ERD. Después arrastra un recuadro sobre el lienzo.  
El botón y el atajo activan o desactivan el dibujo, así que pulsar cualquiera de los dos mientras está preparado lo termina, sin importar cómo se haya iniciado; la opción del menú contextual y la búsqueda rápida solo lo inician. Al iniciarlo se desactiva la herramienta Mano y se cancela la relación que se esté dibujando.  
Mientras el dibujo está preparado, el cursor es una cruz, y una pulsación inicia el recuadro dondequiera que caiga, incluso sobre una tabla, en lugar de seleccionar o mover lo que hay debajo. La barra de herramientas del lienzo marca entonces su botón `New Table Group`, y no la mano ni el puntero.

Al soltar se añade un grupo en ese recuadro, nunca menor de `160px` de ancho y `100px` de alto, barra de título incluida, por corto que sea el arrastre. Un clic sin arrastrar añade un grupo de `480px` de ancho y `320px` de alto con su esquina superior izquierda en el punto del clic.  
Toda tabla sin grupo cuyo centro quede dentro del nuevo recuadro se une al grupo. Una tabla que ya está en otro grupo se queda en él.

El botón central del ratón sigue desplazando la vista del lienzo y deja el dibujo preparado. Lo siguiente termina el dibujo sin añadir ningún grupo:

- `Escape`, o `Alt + G` (Windows/Linux) o `⌥ + G` (Mac), antes de la pulsación o durante el arrastre. Antes de la pulsación dejan la selección como está; la pulsación que inicia el recuadro ya la ha anulado.
- Un clic derecho, que anula la selección. No se abre ningún menú contextual.
- Cambiar a la herramienta Mano con `Space` o con la barra de herramientas del lienzo, hacer clic en el puntero de la barra de herramientas o en su botón `New Table Group`, o iniciar una relación.
- Cambiar a otra pestaña, ocultar los grupos o que el editor pase a ser de solo lectura.

### Agrupar las tablas seleccionadas {#grouping-selected-tables}

Selecciona una o varias tablas y pulsa `T` y luego `G`, o elige `Group selected tables` en el menú contextual de una tabla o `Group Selected Tables` en la búsqueda rápida, que lo incluye mientras hay una tabla seleccionada.  
El nuevo grupo se dibuja alrededor de las tablas seleccionadas con `24px` de margen por cada lado y la barra de título encima. Cada tabla seleccionada se une a él y sale del grupo en el que estuviera, y el grupo que deja se mantiene, aunque ahora esté vacío. Las notas de la selección se omiten.

`T` y luego `G` consiste en dos pulsaciones sin tecla modificadora, con `G` en menos de un segundo tras `T`. Sin ninguna tabla seleccionada no hace nada, y en un campo de texto, como el campo Buscar del explorador, escribe las dos letras.

![Agrupar categories y products con T y luego G, llamar al grupo Catalog y luego darle color violeta desde su menú para que ambos encabezados tomen el color](/img/demo-table-group-selected.webp)

En ambos casos, el nuevo grupo no tiene nombre ni color. Queda seleccionado él solo, y su editor de nombre se abre sobre la barra de título para que puedas escribir un nombre enseguida; consulta [Dar nombre a un grupo](#naming-a-group).  
El grupo y las tablas que incorpora son un paso de deshacer, y el nombre que escribes es otro.

## Dar nombre a un grupo {#naming-a-group}

El nombre de un grupo se edita en un campo que se abre sobre su barra de título. Se abre solo al crearse un grupo, al hacer doble clic en la barra de título y desde `Rename` en el menú contextual del grupo.  
`Enter`, o hacer clic en otra parte, guarda el nombre. `Escape` cierra el campo sin cambiar el nombre y deja el grupo seleccionado, y un segundo `Escape` anula la selección.  
Un nombre cambiado es un paso de deshacer; guardar el nombre sin cambios no registra nada. Un nombre vacío o en blanco se muestra como `unnamed`.  
Mientras el campo está abierto, los atajos del lienzo quedan inactivos y los atajos de la búsqueda rápida y de `Toggle Explorer` no hacen nada, como mientras se edita una celda de una tabla.

[Buscar y reemplazar](./find-and-replace.md#what-it-searches) busca en los nombres de grupo con el ámbito `Table group names` mientras se muestran los grupos, y con `Replace` y `Replace All` cambia el nombre de los grupos; consulta [Reemplazar](./find-and-replace.md#replacing). La [búsqueda rápida](./quick-search.md#searching-the-diagram) no busca en los nombres de grupo.

## Dar color a un grupo {#coloring-a-group}

Elige `Color` en el menú contextual del grupo para abrir el selector de color con el color del grupo.  
Como con las tablas y las notas, el selector aplica el color a todas las tablas, notas y grupos seleccionados, y `Remove color` en el menú, o `No color` en el selector, les quita el color a todos; consulta [Asignación de colores a tablas y notas](./table-related-functions.md#table-and-memo-color-specification). El color de un grupo también se ofrece en `Document colors` del selector.

Un grupo con color dibuja su barra de título y su contorno en ese color, y su cuerpo, en un matiz más pálido de ese color. Un grupo sin color usa los grises neutros del tema.  
Cada tabla de un grupo con color lleva el color del grupo en todo su encabezado y conserva su propio color en el borde izquierdo, de modo que se ven ambos.  
El texto y los botones de ese encabezado se vuelven blancos, o negros sobre un color claro en el que el negro se lee mucho mejor, igual que el nombre, el icono y la `x` de la barra de título del grupo. Entre las muestras predefinidas del selector, Orange, Amber, Yellow y Lime llevan negro, y el resto, blanco.  
Una tabla conserva su propio encabezado mientras su grupo no tiene color, mientras los grupos están ocultos, con un zoom del `70%` o inferior, en el que las tablas se reducen a su nombre, y en la pestaña Visualización.

Un cambio de color se registra en el [historial de deshacer](./undo-redo.md#one-gesture-one-step) igual que en las tablas y las notas.

## Seleccionar grupos {#selecting-groups}

Haz clic en la barra de título de un grupo para seleccionar solo ese grupo, o haz `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) para añadirlo a la selección.  
Al pulsar sobre la barra de título de un grupo que ya está seleccionado se mantiene toda la selección, así que un arrastre a continuación la mueve entera.  
Al pulsar sobre la barra de título, o al hacer clic con el botón derecho en el grupo, el grupo pasa delante de los demás grupos, y sus tablas, delante de todas las demás tablas y notas.

Para el botón izquierdo del ratón, el cuerpo, la zona bajo la barra de título, es el lienzo: al arrastrarlo se desplaza la vista, `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) dibuja un cuadro de selección y un clic anula la selección. Las tablas, notas y líneas de relación que hay sobre el cuerpo responden al puntero como siempre.

Un cuadro de selección incluye un grupo solo cuando abarca todo el recuadro del grupo, así que un cuadro dibujado dentro de un grupo selecciona tablas sin el grupo; consulta [Selección múltiple](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) nunca selecciona un grupo.

`Select tables` en el menú contextual del grupo sustituye la selección por las tablas del grupo, dejando fuera el propio grupo, de modo que el siguiente comando solo afecta a las tablas.  
Úsalo antes de comandos que actúan solo sobre tablas, como copiar o [centrarse en tablas](./table-related-functions.md#focusing-on-tables), que omiten un grupo seleccionado.

El contorno de un grupo seleccionado toma el color de selección. En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), un grupo que selecciona otro participante aparece rodeado del color de ese participante.

## Ir a un grupo {#going-to-a-group}

El [explorador](./explorer.md#the-tree) enumera los grupos en su carpeta `Table Groups`, por nombre, cada uno con sus tablas debajo. La búsqueda rápida no enumera grupos.

Elegir la fila de un grupo en el explorador, una coincidencia de [Buscar y reemplazar](./find-and-replace.md#going-to-a-match) en el nombre de un grupo o la fila de un grupo en la lista del [visor de diferencias](./table-related-functions.md#the-change-tree) lleva a ese grupo.  
Esto hace visible el recuadro del grupo, tomando como referencia su barra de título cuando el recuadro es más alto que el lienzo; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands). Después selecciona solo el grupo y lo trae al frente con sus tablas, como al pulsar sobre su barra de título.  
Mientras los grupos están [ocultos](#hiding-groups), o una vez eliminado el grupo, ir a él no hace nada.  
En el visor de diferencias, cada lado va al grupo solo si su propio documento lo contiene y lo muestra; consulta [Ir a un cambio](./table-related-functions.md#going-to-a-change).

## Mover un grupo y cambiar su tamaño {#moving-and-resizing-a-group}

Arrastra un grupo por su barra de título para moverlo con todas sus tablas.  
Si el grupo forma parte de una selección mayor, toda la selección se mueve con él, y una tabla que está seleccionada y además en el grupo se mueve una sola vez.  
El arrastre solo empieza cuando el puntero se ha movido un poco, así que un clic o un doble clic en la barra de título sigue siendo un clic. `Alt + drag` en una barra de título mueve el grupo igual que un arrastre normal; un grupo nunca se duplica.  
El movimiento, con todas las tablas que lleva, es un paso de deshacer.

Arrastrar una tabla sola mueve únicamente esa tabla, y puede meterla en un grupo o sacarla de él; consulta [Añadir y quitar tablas](#adding-and-removing-tables).

Todos los grupos tienen controladores de tamaño en sus cuatro bordes y sus cuatro esquinas, estén seleccionados o no, como una nota.  
Arrastra uno con el botón izquierdo del ratón: el recuadro sigue al puntero, y el nuevo tamaño se guarda al soltar, como un paso de deshacer.  
No se puede reducir un grupo a menos de `160px` por `100px`, ni hacerlo más pequeño que sus tablas con sus `24px` de margen y la barra de título. El borde se detiene ahí por mucho que se aleje el puntero.

## Añadir y quitar tablas {#adding-and-removing-tables}

Una tabla entra en un grupo o sale de él según dónde la sueltes.  
Cuando arrastras tablas y las sueltas, cada tabla arrastrada que no va con un grupo seleccionado se evalúa por su centro. Entra en el grupo superior cuyo recuadro contiene su centro, o sale de su grupo si su centro no queda en el recuadro de ningún grupo. El grupo superior es el que se dibuja delante.  
Un grupo que el arrastre deja en su sitio conserva el recuadro que tenía al empezar el arrastre, así que una tabla que se desplaza un poco dentro de su propio grupo se queda en él, y para salir hay que arrastrarla hasta que su centro quede fuera de ese recuadro.  
Mientras arrastras, se marca con un contorno cada grupo en el que, al soltar, entraría una tabla.

Si sueltas antes de que pasen unos `200ms` desde el último movimiento, el cambio de grupo forma parte del paso de deshacer del arrastre, así que un solo deshacer devuelve las tablas a donde estaban y a los grupos en los que estaban. Tras una pausa más larga antes de soltar, el cambio de grupo es un paso aparte; consulta [Un gesto, un paso](./undo-redo.md#one-gesture-one-step).  
Un clic, o un arrastre de unos pocos píxeles, no cambia ningún grupo, y nada cambia de grupo mientras los grupos están ocultos.

Las otras formas de cambiar qué tablas contiene un grupo:

- `Remove from group` en el menú contextual de una tabla saca cada tabla seleccionada de su grupo. Se muestra mientras alguna tabla seleccionada está en un grupo, incluso con los grupos ocultos, y es un paso de deshacer.
- `Group selected tables` mueve las tablas seleccionadas a un nuevo grupo; consulta [Agrupar las tablas seleccionadas](#grouping-selected-tables).
- Eliminar un grupo deja sus tablas sin grupo.

Una tabla pegada o duplicada con `Alt` no está en ningún grupo, aunque quede dentro del recuadro de un grupo. Al arrastrarla después, se aplica la regla de dónde se suelta.

## Eliminar un grupo {#removing-a-group}

Eliminar un grupo nunca elimina sus tablas: se quedan donde están, sin grupo.

- La `x` del final de la barra de título, que se muestra mientras el puntero está sobre el grupo, elimina solo ese grupo.
- `Delete` en el menú contextual del grupo elimina el grupo. Cuando el grupo es uno de varios elementos seleccionados, la opción indica `Delete selected` y elimina todo lo seleccionado: tablas, notas y grupos.
- Con grupos seleccionados, `Delete` o `Backspace` elimina los grupos seleccionados junto con las tablas y notas seleccionadas, igual que `Ctrl + Backspace` y `Ctrl + Delete` (Windows/Linux) o `⌘ + Backspace` y `⌘ + Delete` (Mac); consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion).

Cada eliminación es un paso de deshacer, que recupera el grupo con sus tablas dentro.

## El menú del grupo {#the-group-menu}

Haz clic con el botón derecho en la barra de título, el cuerpo o el borde de un grupo para abrir su menú. En un Mac también lo abre `Ctrl + click`, y en una pantalla táctil, una pulsación larga.  
El clic derecho selecciona primero el grupo, solo él salvo que ya forme parte de la selección, así que `Color` y `Delete selected` afectan al resto de la selección solo cuando el grupo estaba en ella.

- `Select tables`: selecciona solo las tablas del grupo; consulta [Seleccionar grupos](#selecting-groups).
- `Rename`: abre el editor de nombre; consulta [Dar nombre a un grupo](#naming-a-group).
- `Color`: abre el selector de color; consulta [Dar color a un grupo](#coloring-a-group).
- `Remove color`: se muestra mientras algo seleccionado tiene color.
- `Delete`, o `Delete selected` cuando el grupo es uno de varios elementos seleccionados, con la tecla `Delete` indicada a la derecha; consulta [Eliminar un grupo](#removing-a-group).

El menú contextual de una tabla añade `Group selected tables` y `Remove from group` después de `Color` y `Remove color`, antes de su opción Delete, y el menú contextual del lienzo añade `New Table Group`.  
`Group selected tables` muestra sus teclas, `T` y luego `G`, a la derecha, y `New Table Group` muestra `Alt + G` (Windows/Linux) o `⌥ + G` (Mac).

## Ocultar grupos {#hiding-groups}

`View Option` → `Table Groups` en el menú contextual del lienzo muestra u oculta todos los grupos. Está marcado de forma predeterminada; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options).  
Si se desmarca, los recuadros de grupo y los colores de grupo de los encabezados de las tablas desaparecen del lienzo, del minimapa y de las imágenes exportadas, y las barras de desplazamiento y el minimapa dejan de reservar espacio para los grupos. Nada se mueve ni cambia de tamaño, y cada tabla se queda en su grupo.  
Al ocultar los grupos se anula su selección, se termina un dibujo de `New Table Group` y se cierra el editor de nombre que esté abierto.

Mientras los grupos están ocultos:

- `New Table Group` y `Group selected tables` no se ofrecen en los menús, ni `New Table Group` y `Group Selected Tables` en la búsqueda rápida, y la barra de herramientas del lienzo omite su botón `New Table Group`. `Remove from group` se sigue ofreciendo.
- Ni `Alt + G` (Windows/Linux) o `⌥ + G` (Mac) ni `T` y luego `G` hacen nada.
- Arrastrar tablas no cambia ningún grupo, y un cuadro de selección no incluye ningún grupo.
- El explorador omite su carpeta `Table Groups`, y Buscar y reemplazar ni encuentra ni reemplaza nombres de grupo, aunque `Table group names` esté activado.
- La [disposición automática](#auto-layout) sigue manteniendo juntas las tablas de cada grupo, la pestaña Esquema SQL sigue ofreciendo los [grupos entre los que elegir](#schema-sql-by-group), DBML los sigue escribiendo e [Importar y añadir](./file-import-export.md#import-and-add) sigue colocando lo añadido debajo de los recuadros ocultos.

La elección se guarda en el documento y se registra en el [historial de deshacer](./undo-redo.md#what-the-history-records), como los demás interruptores de Opciones de vista.

## Disposición automática {#auto-layout}

La [disposición automática](./table-related-functions.md#auto-layout), con cualquiera de sus disposiciones, mantiene juntas las tablas de cada grupo, se muestren o no los grupos.

- `Force` mueve cada grupo con sus tablas como un solo recuadro, dentro del cual las tablas conservan su sitio, y mantiene el recuadro de cada grupo a un mínimo de `100px` de los demás grupos y de las tablas sin grupo. La vista previa muestra cada grupo donde va a quedar.
- `Flow`, `Tree - vertical` y `Tree - horizontal` disponen las tablas de cada grupo dentro del grupo y colocan los grupos según las relaciones entre ellos, con las tablas sin grupo dispuestas a su alrededor.

Después, cada grupo que contiene tablas se ajusta a ellas: su recuadro pasa a ser el que las abarca, con `24px` de margen y la barra de título. Un grupo sin tablas conserva su posición y su tamaño.  
Las tablas y los grupos se colocan en un solo paso de deshacer.

Una importación de DBML ajusta cada grupo a sus tablas del mismo modo, dondequiera que se coloquen; consulta [DBML](./file-import-export.md#dbml).

## Esquema SQL por grupo {#schema-sql-by-group}

La pestaña [Esquema SQL](./schema-sql.md) puede escribir solo las tablas de los grupos elegidos.  
Mientras el documento contiene algún grupo, visible u oculto, su panel de opciones muestra una fila `Tables` bajo `This window only`, con una casilla para `All`, una para cada grupo y una para `No group`, las tablas sin grupo; consulta [Tablas](./schema-sql.md#tables).  
La elección pertenece a la ventana del editor y no se guarda en el documento.

## Importar, exportar y copiar {#import-export-and-copying}

- DBML conserva los grupos en ambos sentidos. Una importación de DBML convierte cada bloque `TableGroup` en un grupo —consulta [DBML](./file-import-export.md#dbml)— y el destino `DBML` del Generador de código escribe un bloque `TableGroup` por cada grupo que contiene alguna tabla; consulta [Generador de código](./code-generator.md#language).
- Un archivo JSON conserva sus grupos. Ningún otro formato los lleva: las importaciones de SQL, GraphQL y AML no traen ninguno, y el Esquema SQL y los demás destinos del Generador de código no escriben ninguno.
- [Importar y añadir](./file-import-export.md#import-and-add) trae los grupos de un archivo como grupos nuevos que contienen sus tablas, y los selecciona junto con las tablas nuevas mientras se muestran los grupos, así que al arrastrar el bloque añadido se mueven también sus grupos.
- Una [imagen exportada](./file-import-export.md#image) dibuja los grupos visibles detrás de las tablas, con los colores de grupo en sus encabezados.
- Copiar y pegar, o duplicar con `Alt`, nunca copia un grupo; consulta [Copiar y pegar tablas y notas](./table-related-functions.md#copyingpasting-tables-and-memos) y [Añadir y quitar tablas](#adding-and-removing-tables).

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly), los grupos se dibujan y aparecen en el explorador como siempre, y es posible seleccionarlos e ir a ellos, pero no modificarlos:

- Una pulsación en una barra de título selecciona el grupo y no mueve nada. No hay controladores de tamaño ni `x`.
- Un doble clic en la barra de título no abre el editor de nombre, y el menú del grupo solo contiene `Select tables`.
- El menú del lienzo no tiene `New Table Group`, el menú de la tabla no tiene `Group selected tables` ni `Remove from group`, y la búsqueda rápida no muestra ninguno de los dos comandos de grupo. Un dibujo de `New Table Group` termina cuando el editor pasa a ser de solo lectura.
- La [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar) no muestra ninguno de sus botones de añadir, `New Table Group` incluido, y ni `Alt + G` (Windows/Linux) o `⌥ + G` (Mac) ni `T` y luego `G` hacen nada.
- La opción de vista `Table Groups` no cambia nada, como todas las opciones de vista.
- La elección `Tables` de la pestaña Esquema SQL sigue funcionando.
