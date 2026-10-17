---
sidebar_position: 4
description: Selecciona, mueve, copia, duplica y elimina tablas y notas, asigna colores y opciones de vista, define índices y claves alternativas, elige una base de datos, muévete por el lienzo infinito y compara documentos.
---

# Funciones relacionadas con las tablas

Todo lo que haces con las tablas y las notas una vez que existen —seleccionarlas, moverlas, copiarlas, eliminarlas, darles color y decidir qué muestra el lienzo—, además de los controles del lienzo que las rodean.  
Primero vienen los comandos de tablas y notas; después, las propiedades de la tabla, centrarse en tablas, los índices y las claves alternativas, la disposición automática y el proveedor de base de datos; y por último, el propio lienzo: la barra de herramientas del lienzo, el zoom, el desplazamiento de la vista y dónde termina un salto, y el visor de diferencias.  
Los grupos de tablas, los recuadros que reúnen tablas, tienen su propia página; consulta [Grupos de tablas](./table-groups.md).

## Selección múltiple {#multiple-selection}

Admite tres métodos:

- `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac)
- `Ctrl + A` o `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` o `⌘ + ⌥ + A` (Mac)

Las notas se seleccionan del mismo modo, y cualquiera de los dos atajos para seleccionar todo toma todas las tablas y notas a la vez. Las notas ocultas con Opciones de vista → `Memos` quedan fuera de seleccionar todo y del cuadro de selección; consulta [Opciones de vista de tabla](#table-view-options).  
Los [grupos de tablas](./table-groups.md#selecting-groups) se añaden a la selección con `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) en su barra de título, pero seleccionar todo nunca toma ninguno.  
`Ctrl + A` cede el paso al cursor de texto, de modo que, mientras editas una celda, selecciona el texto en lugar del diagrama.  
Un cuadro de selección marca una tabla o una nota cuando cubre su centro, no cuando solo toca un borde. Solo toma un grupo de tablas cuando abarca todo el recuadro del grupo, así que un cuadro dibujado dentro de un grupo selecciona tablas sin el grupo.  
Un clic derecho sobre algo ya seleccionado conserva toda la selección, de modo que opciones del menú como `Color`, `Group selected tables` y `Delete selected` actúan sobre toda ella. Un clic derecho sobre cualquier otra tabla, nota o grupo de tablas selecciona solo ese elemento, aunque mantengas pulsado `Ctrl` o `⌘`, y un clic derecho sobre una relación o sobre un espacio vacío del lienzo anula la selección.  
`Escape` anula la selección. Mientras está abierto el editor de una celda, de una nota o del nombre de un grupo de tablas, o mientras se dibuja una relación o un `New Table Group`, el primer `Escape` termina esa acción y un segundo `Escape` anula la selección.

![Seleccionar tablas con ⌘ + drag y ⌘ + click y, luego, todas las tablas y notas con ⌘ + A](/img/demo-table-select.webp)

En una sesión colaborativa, la selección, la celda con el foco y el cuadro de selección de cada participante se dibujan en el lienzo con el color de ese participante; consulta [Edición colaborativa](../../api/advanced/collaborative-editing.md).

## Mover varias tablas {#moving-multiple-tables}

Arrastra cualquier tabla o nota que ya forme parte de la selección y toda la selección se mueve con ella; no hace falta ninguna tecla modificadora.  
Al arrastrar algo que está fuera de la selección, la selección se reduce a ese elemento y solo se mueve él. `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) conserva la selección en ambos casos.  
Solo el botón izquierdo del ratón mueve tablas y notas. Un clic derecho elige sobre qué actúa el menú contextual y no mueve nada, y un arrastre con el botón central, en cambio, desplaza la vista del lienzo; consulta [Moverse por el lienzo](#getting-around-the-canvas).

![Al arrastrar una de dos tablas seleccionadas se mueven ambas, y la relación las sigue](/img/demo-table-multiple-move.webp)

Un [grupo de tablas](./table-groups.md) seleccionado también se mueve, llevando consigo sus tablas, y una tabla seleccionada que además está en un grupo en movimiento se mueve una sola vez.  
El lugar donde sueltas una tabla puede meterla en un grupo o sacarla de él; consulta [Añadir y quitar tablas](./table-groups.md#adding-and-removing-tables).

Las tablas y las notas comparten un único orden de apilamiento. Al pulsar sobre una tabla o una nota, con el botón izquierdo o el derecho, esta pasa por delante de todas las demás tablas y notas, y al pulsar sobre la barra de título de un grupo de tablas, o hacer clic con el botón derecho en su cuerpo, sus tablas pasan al frente.  
El orden no se guarda: al volver a abrir un diagrama, sus tablas se apilan en el orden en que las enumera el archivo, con todas las notas por encima.

## Copiar y pegar tablas y notas {#copyingpasting-tables-and-memos}

Copia las tablas y notas seleccionadas y las vuelve a pegar como tablas y notas nuevas.  
Atajos de teclado: `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac)

Una tabla copiada conserva su nombre, comentario, columnas y color; una nota copiada conserva su texto, tamaño y color.  
Los índices y las relaciones también se copian: un índice se copia entero en la tabla copiada, y una relación se copia con su tipo y sus acciones ON DELETE y ON UPDATE cuando las dos tablas que une están en el conjunto copiado. Una relación a medias se descarta en lugar de quedar apuntando al original.  
Las copias pegadas pasan a ser la nueva selección, y cada vez que vuelves a pegar la misma copia, esta se desplaza otros `50px`, para que los pegados repetidos no se apilen unos encima de otros.  
Una copia no conserva su [grupo de tablas](./table-groups.md): la tabla pegada no pertenece a ningún grupo, aunque quede dentro del recuadro de un grupo, y un grupo seleccionado no se copia.  
Mientras Opciones de vista → `Memos` oculta las notas, un pegado sigue añadiendo las notas que lleva, ocultas y sin seleccionar, de modo que solo las tablas pegadas pasan a ser la selección.

![Copiar dos tablas relacionadas y pegarlas dos veces, con su relación incluida](/img/demo-table-copy-paste.webp)

Cuando hay columnas seleccionadas dentro de una tabla con el foco, el mismo atajo copia esas columnas en su lugar; consulta [Edición de tablas](./table-editing.md).

## Duplicar tablas y notas {#duplicating-tables-and-memos}

Mantén pulsado `Alt` y arrastra una tabla o una nota con el botón izquierdo del ratón.  
Una vista previa translúcida sigue al puntero, y al soltar el botón la copia se coloca donde está la vista previa.  
Si lo que agarras ya forma parte de una selección, se duplica toda la selección. De lo contrario, la selección se sustituye por el elemento que hay bajo el puntero.  
`Alt + click` sin mover el ratón coloca la copia `50px` más abajo y a la derecha, y avanza un paso más cada vez que ese sitio ya está ocupado.

Un duplicado lleva lo mismo que un pegado: nombres, comentarios, columnas, colores, tamaños de las notas y los índices y relaciones que pertenecen por completo a lo que has copiado. Como un pegado, no queda en ningún grupo de tablas.  
`Alt + drag` en la barra de título de un grupo de tablas mueve el grupo igual que un arrastre normal; un grupo nunca se duplica.

![Duplicar una tabla con Alt + drag y, después, Alt + click para otra copia más abajo y a la derecha](/img/demo-table-duplicate.webp)

## Eliminación de tablas y notas {#table-and-memo-deletion}

Elimina las tablas, notas y [grupos de tablas](./table-groups.md) seleccionados.  
Atajos de teclado:

- `Delete` o `Backspace`. Eliminan toda la selección, salvo cuando lo único seleccionado es una tabla con algunas de sus columnas seleccionadas y el zoom está por encima del `70%`: entonces eliminan esas columnas; consulta [Eliminación de columnas](./table-editing.md#column-deletion).
- `Ctrl + Backspace` o `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` o `⌘ + Delete` (Mac). Siempre eliminan las tablas, notas y grupos de tablas seleccionados, aunque haya columnas seleccionadas.

![Eliminar una tabla y sus relaciones con la tecla Delete y, después, una tabla y una nota a la vez con Delete selected desde el menú de la nota](/img/demo-table-remove.webp)

Los menús contextuales también eliminan. La última opción del menú de una tabla o de una nota indica `Delete selected` mientras esa tabla o nota es uno de dos o más elementos seleccionados, y elimina toda la selección. En caso contrario, indica `Delete` y elimina solo esa tabla o nota. Sobre la fila de una columna seleccionada, el menú de una tabla indica en su lugar `Delete column` o `Delete columns`, como en [Eliminación de columnas](./table-editing.md#column-deletion).

Al eliminar una tabla se eliminan con ella sus relaciones e índices. Al eliminar un grupo de tablas se conservan sus tablas, sin grupo; consulta [Eliminar un grupo](./table-groups.md#removing-a-group).  
No se pide confirmación, cada eliminación es un paso de deshacer y en un editor `readonly` no se elimina nada.  
Si se mantienen pulsadas, `Delete` y `Backspace` solo eliminan una vez, y nunca eliminan una relación; consulta [Edición de relaciones](./relationship-editing.md#deletion). Mientras escribes en una celda, en una nota o en cualquier otro campo de texto, editan el texto en su lugar.  
En Configuración, las dos teclas aparecen como `Delete Selection`; consulta [Atajos de teclado](./settings.md#shortcuts).

## Asignación de colores a tablas y notas {#table-and-memo-color-specification}

Puedes asignar colores para distinguirlas por categoría.  
Una tabla lleva su color a lo largo del borde izquierdo, y una nota, a lo largo de su parte superior. Haz clic en ese borde o esa franja con el botón izquierdo, o elige `Color` en el menú contextual de la tabla o de la nota, para abrir el selector de color en la posición del puntero. El color se aplica a todas las tablas, notas y grupos de tablas seleccionados, no solo al elemento en el que has hecho clic.  
A un grupo de tablas se le da color desde `Color` en su propio menú, y una tabla de un grupo con color lleva el color del grupo en su encabezado y conserva su propio color en el borde izquierdo; consulta [Dar color a un grupo](./table-groups.md#coloring-a-group).

![Elegir el color predefinido Blue desde la franja de color de una nota para dos tablas seleccionadas y la nota, y quitar después el color con No color](/img/demo-table-color.webp)

El selector contiene, de arriba abajo:

- Un área de saturación y brillo y, después, el control deslizante de tono con una vista previa del color a su lado. Donde el navegador ofrece un cuentagotas, un botón de pipeta antes del control deslizante, `Pick a color from the screen`, toma un color de cualquier parte de la pantalla.
- Los campos `Hex`, `R`, `G` y `B`. `Hex` admite 3, 4, 6 u 8 dígitos hexadecimales, con o sin `#`, o un `rgb()`, un `hsl()` o un nombre de color CSS pegados. Un valor completo de 6 u 8 dígitos se aplica mientras escribes, y cualquier otro, al pulsar `Enter` o al salir del campo. `R`, `G` y `B` admiten números enteros, interpretan cualquier valor superior a `255` como `255` y se aplican al pulsar `Enter` o al salir del campo. El texto que el selector no puede interpretar se descarta.
- Dieciséis muestras predefinidas en dos filas de ocho: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown y Gray. Al pasar el puntero por encima de una muestra se ve su código hexadecimal.
- `Document colors`: hasta ocho colores que ya usan las tablas, notas y grupos de tablas del documento, empezando por el más usado. La fila solo aparece cuando hay alguno.
- `No color`.

Un color siempre es opaco: el selector no tiene control de transparencia y descarta cualquier transparencia que traiga un valor escrito o pegado.  
Abrir el selector no cambia nada, y elegir el color que ya tiene la selección no añade ningún paso de deshacer.

`No color` quita el color de todas las tablas, notas y grupos de tablas seleccionados en un solo paso de deshacer y cierra el selector. `Remove color`, justo debajo de `Color` en los menús contextuales de tabla, nota y grupo de tablas mientras algún elemento seleccionado tiene color, hace lo mismo sin abrir el selector.

El selector toma el foco del teclado al abrirse, y `Tab` y `Shift + Tab` recorren sus controles. Las teclas de flecha mueven el área y el control deslizante de tono de 1 en 1, o de 10 en 10 con `Shift`, y pasan de una muestra a otra y aplican cada una al llegar a ella.  
Mientras el selector tiene el foco del teclado, deshacer y rehacer, los atajos de zoom, `Search` y `Toggle Explorer` siguen llegando al editor, y los demás atajos del editor no: los atajos de [eliminación](#table-and-memo-deletion) no eliminan nada, y `Delete` y `Backspace` solo editan el texto de los campos `Hex`, `R`, `G` y `B`.  
`Escape` cierra el selector, y también lo cierra una pulsación en el lienzo fuera de él.  
Una pulsación en el [explorador](./explorer.md) no es una pulsación en el lienzo, así que deja el selector abierto. Una fila elegida allí cambia la selección, y el siguiente color elegido se aplica a la nueva selección.

## Opciones de vista de tabla {#table-view-options}

Ofrece las siguientes opciones de vista:

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Unique`, `Alternate Key` y `Auto Increment` están desactivadas de forma predeterminada, y el resto, activadas.  
`Alternate Key` marca las columnas de cada clave alternativa, como `AK1.1`; consulta [Claves alternativas](#alternate-keys).  
`Referential Actions` muestra las etiquetas `D:` y `U:` que las acciones ON DELETE y ON UPDATE de una relación colocan en el extremo de su conector que da a la tabla hija; consulta [Cómo leer un conector](./relationship-editing.md#reading-a-connector). Al desactivarla, solo se ocultan esas etiquetas y no se mueve ninguna tabla ni ningún conector.  
`Table Groups` muestra los [grupos de tablas](./table-groups.md) y los colores de grupo en los encabezados de sus tablas. Al desactivarla, se ocultan en el lienzo, el minimapa y las exportaciones de imagen, no se mueve ninguna tabla y cada tabla sigue en su grupo; consulta [Ocultar grupos](./table-groups.md#hiding-groups). También quita la carpeta `Table Groups` del [explorador](./explorer.md#the-tree) y `New Table Group` de la [barra de herramientas del lienzo](#canvas-toolbar), y la búsqueda del explorador deja de encontrar nombres de grupo.  
`Memos` muestra las notas. Al desactivarla, se ocultan todas las notas en el lienzo, el minimapa y las exportaciones de imagen, y no se mueve ninguna tabla ni ningún conector. Las notas ocultas no ocupan espacio, así que las barras de desplazamiento, el minimapa y la brújula `Go to content` no las tienen en cuenta.  
Al ocultar las notas, se anula su selección y se cierra el editor de notas que esté abierto. El [explorador](./explorer.md#the-tree) quita su carpeta `Memos`, y ni su búsqueda [Buscar y reemplazar](./find-and-replace.md) ni el `:` de la búsqueda rápida las incluyen. Mientras están ocultas, `New Memo` desaparece del menú contextual, de la [barra de herramientas del lienzo](#canvas-toolbar), de la búsqueda rápida y de la [pantalla de bienvenida](./editing-start.md#welcome-screen), y `Alt + M` no añade ninguna nota. Un pegado o un [Importar y añadir](./file-import-export.md#import-and-add) sigue añadiendo las notas que lleva, ocultas y sin seleccionar.  
En un editor `readonly`, los interruptores no cambian nada.

![Activar y desactivar opciones del menú Opciones de vista mientras las tablas se reorganizan, marcar un índice único compuesto como AK1.1 y AK1.2 con Alternate Key y, después, desactivar y volver a activar Memos](/img/demo-view-options.webp)

Las tarjetas del modo `Flow` de la pestaña Visualización no siguen estas opciones: usan su propia [vista de filas](./visualization.md#row-display) y dibujan sus conectores aunque `Relationship` esté desactivada.

## Propiedades de la tabla {#table-properties}

Abre el panel de propiedades de una tabla.  
Empieza desde `Table Properties` en el menú contextual de la tabla, que lo abre para la tabla en la que has hecho clic con el botón derecho, o selecciona una tabla y pulsa `Alt + Space`.  
El panel se abre en el centro del lienzo atenuado. Solo se atenúa el lienzo, así que un [explorador](./explorer.md#dialogs-beside-it) abierto sigue abierto y utilizable a su lado. Su encabezado contiene el título `Table Properties`, las cinco tablas abiertas más recientemente como chips, con la actual resaltada, y un botón de cierre. Haz clic en un chip para pasar a esa tabla sin volver a abrir el panel.  
Debajo del encabezado hay tres pestañas: `Indexes`, `Schema SQL` y `Code Generator`. El panel mantiene el mismo tamaño para las tres, así que cambiar de pestaña no lo mueve ni cambia su tamaño.  
Ciérralo con el botón de cierre, con `Escape` o haciendo clic fuera de él en el lienzo.  
Elegir en el explorador una fila que no sea una carpeta, o ir a una coincidencia de su búsqueda, cierra el panel Propiedades de la tabla antes del salto. Lo mismo hace `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), que abre la búsqueda del explorador, o pone el cursor de texto en su campo Buscar cuando el explorador ya está abierto. Cualquier otro clic en el explorador, incluido uno en una fila de carpeta, o en el botón `Explorer` de la barra de herramientas, deja abierto el panel Propiedades de la tabla. Un `Escape` pulsado mientras el foco del teclado está en el explorador solo devuelve el teclado al lienzo, así que hace falta un segundo `Escape` para cerrar el panel Propiedades de la tabla.

La pestaña `Indexes` se explica en [Índices](#indexes).  
La pestaña `Schema SQL` muestra el DDL de la tabla para la [base de datos](#databases) seleccionada: su `CREATE TABLE`, las restricciones independientes que algunas bases de datos escriben para sus columnas únicas, así como sus índices. Siempre escribe sentencias `CREATE` simples, sin cabecera ni scripts previos o posteriores, sea cual sea la configuración de la pestaña [Esquema SQL](./schema-sql.md) de la barra de herramientas. No tiene panel de opciones, y su menú contextual solo ofrece `Database` y `Bracket`.  
La pestaña `Code Generator` genera código solo para esta tabla; consulta [Generador de código](./code-generator.md).

En un editor `readonly`, el panel se sigue abriendo, con un distintivo `Read only` junto a su título, pero su pestaña `Indexes` no permite ninguna edición.

## Centrarse en tablas {#focusing-on-tables}

Abre la pestaña Visualización en modo `Flow`, acotada a las tablas elegidas y a todas las tablas que están a una relación de distancia de ellas.  
Empieza desde el menú contextual de la tabla con `Focus on this table`, o selecciona una o varias tablas y pulsa `Alt + F`.  
Cuando la tabla en la que haces clic con el botón derecho es una de varias tablas seleccionadas, la opción indica `Focus on selected tables` y se centra en toda la selección. Al hacer clic con el botón derecho en una tabla fuera de la selección, se centra solo en esa tabla.  
El atajo toma las tablas seleccionadas, deja fuera las notas y no hace nada cuando no hay ninguna tabla seleccionada.  
Un [grupo de tablas](./table-groups.md) seleccionado no cuenta aquí, ni en el atajo ni en la opción del menú: sus tablas solo se toman cuando están seleccionadas ellas mismas, que es lo que hace `Select tables` en el menú del grupo.  
Lo que muestra la vista acotada, y cómo volver al diagrama completo, se explica en [Visualización](./visualization.md#focusing-on-tables).

## Índices {#indexes}

Los índices se definen en la pestaña `Indexes` del panel de propiedades de la tabla y se incluyen en el Esquema SQL exportado.

El lado izquierdo muestra las claves y los índices de la tabla en dos grupos.  
`Keys`, que se muestra cuando la tabla tiene alguna, enumera las claves que declaran sus columnas: `PK_<table name>` sobre las columnas marcadas como PK y, después, `UQ_<table name>_<column name>` por cada columna marcada como Único, en el orden de las columnas. Los nombres siguen el Esquema SQL de la base de datos seleccionada, de modo que, con `Bracket` en `None`, una tabla cualificada con esquema como `sales.users` muestra `PK_users` en todas las bases de datos excepto Databricks y Snowflake; consulta [Nombres de tabla cualificados con esquema](./schema-sql.md#schema-qualified-table-names). Cada una lleva la etiqueta `PK` o `UQ` y un candado. Aquí son de solo lectura y solo cambian con los indicadores [PK](./table-editing.md#column-primary-key) y [Único](./table-editing.md#not-null-unique-auto-increment) de las columnas.  
`Indexes` enumera los índices de la tabla en el orden en que se añadieron. Cada índice tiene un interruptor `UQ` que lo hace único, un campo de nombre y una `x` que lo elimina. Un índice que es una [clave alternativa](#alternate-keys) muestra también su número, como `AK1`. Añade un índice con `Add Index`, al final de la lista.

El lado derecho muestra las columnas de la tabla bajo `Columns`, cada una con su casilla. No se puede editar nada hasta que se selecciona un índice a la izquierda.  
Marca una columna para añadirla al índice seleccionado y desmárcala para quitarla. Al seleccionar una clave se muestran sus columnas marcadas, pero las casillas siguen deshabilitadas.  
Las columnas del índice seleccionado aparecen debajo, bajo `Index order`. Arrástralas por el asa de arrastre para reordenarlas, y haz clic en el chip `ASC` o `DESC` de una fila para invertir su orden. En una clave alternativa, cada fila termina con su marca `AK<n>.<m>`. La lista muestra tres filas a la vez y se desplaza para mostrar el resto.

En un editor `readonly`, al seleccionar una clave o un índice se siguen mostrando sus columnas, pero no hay `Add Index` ni `x`, y no se puede cambiar nada más de la pestaña.

El [explorador](./explorer.md#the-tree) muestra los índices de cada tabla en la carpeta `Indexes` de la tabla, y al elegir uno allí se va a su tabla. Su búsqueda también encuentra nombres de índice y puede cambiarles el nombre; consulta [Qué se busca](./find-and-replace.md#what-it-searches).

![Abrir Table Properties en orders, donde la pestaña Indexes muestra las claves PK y UQ encima de los índices, y añadir después un índice sobre member_id y ordered_at DESC y comprobarlo en la pestaña Schema SQL](/img/demo-table-properties.webp)

## Claves alternativas {#alternate-keys}

Una clave alternativa es un índice único sobre dos o más columnas: un índice de la pestaña `Indexes` con su interruptor `UQ` activado y al menos dos columnas de la tabla marcadas.  
Un índice único sobre una sola columna no dice más que el indicador Único de esa columna, así que no es una clave alternativa, como tampoco lo son un índice normal, la clave principal ni una columna marcada como Único.

Con `Alternate Key` activada en las [opciones de vista](#table-view-options), el diagrama marca las columnas de cada clave alternativa como las escriben erwin e IDEF1X: `AK1.1`, `AK1.2`, etc. La opción está desactivada de forma predeterminada.

Las claves se numeran según la posición de sus columnas en la tabla, no según el orden en que se añadieron los índices. La clave cuya primera columna en su `Index order` está más arriba en la tabla es `AK1`. En caso de empate, decide la siguiente columna de cada clave, y una clave que es la parte inicial de otra más larga va antes que ella.  
Mover una columna dentro de la tabla, o reordenar el `Index order` de una clave, puede cambiar la numeración de las claves. Deshacer la eliminación de una clave le devuelve su número, y todos los colaboradores ven los mismos números.

Cada columna de una clave se marca como `AK<n>.<m>`, donde `n` es el número de la clave y `m`, la posición de la columna en el `Index order` de la clave. Una columna que está en varias claves lleva todas las marcas, unidas por una coma.  
Por ejemplo, en una tabla con las columnas `a`, `b` y `c`, los índices únicos sobre (`c`, `a`) y (`b`, `a`) pasan a ser `AK1` = (`b`, `a`) y `AK2` = (`c`, `a`), porque `b` está por encima de `c`. Así, `b` muestra `AK1.1`, `c` muestra `AK2.1` y `a` muestra `AK1.2,AK2.2`.

La marca se dibuja al final de la fila, después de la celda que el [orden de columnas](./settings.md#adjusting-column-order) coloque en último lugar. No es una celda, así que nunca recibe el foco ni se puede editar ni copiar; consulta [Edición de tablas](./table-editing.md).  
Una columna de clave principal o de clave externa también puede llevar una marca AK, ya que la marca no sustituye nada: el icono de clave al principio de la fila sigue mostrando PK y FK, y la celda Único conserva su propio `UQ`.  
Una tabla que tiene una clave alternativa reserva espacio tras la última celda de cada fila para su marca más larga; una tabla sin ninguna conserva su ancho.  
Las marcas se muestran en el lienzo ERD, donde una tabla reducida a su nombre al `70%` o menos no muestra ninguna, y en una [exportación de imagen](./file-import-export.md#image), que dibuja todas las tablas completas sea cual sea el zoom. La [vista previa al pasar el puntero](./visualization.md#hover-preview) de la pestaña Visualización en modo `Graph` también las muestra; las tarjetas de `Flow` nunca las muestran.

La pestaña `Indexes` muestra los números tanto si la opción está activada como si no; consulta [Índices](#indexes).

## Disposición automática {#auto-layout}

Dispone por ti todas las tablas del lienzo.  
Abre `Auto Layout` desde el menú contextual del lienzo o desde la búsqueda rápida, y elige una de las cuatro disposiciones:

| Disposición | Qué dibuja |
| --- | --- |
| `Force` | Una simulación: las relaciones atraen las tablas entre sí, las vecinas se repelen y las tablas superpuestas se separan. |
| `Flow` | De izquierda a derecha siguiendo las relaciones, con un punto de contacto propio en la tabla para cada conector. Intenta que haya pocos cruces, pero puede dejar alguno que otra disposición evitaría. |
| `Tree - vertical` | Por capas hacia abajo: una tabla padre se sitúa encima de las tablas que tienen una clave externa hacia ella. |
| `Tree - horizontal` | Las mismas capas, de izquierda a derecha. |

`Force` abre una vista previa mientras la disposición se estabiliza, con `Apply` y `Cancel` en el aviso que muestra.  
La vista previa se encuadra sobre el diagrama tal como estaba cuando empezó la disposición, así que las tablas pueden salirse del encuadre mientras la disposición se estabiliza. Se dibuja al `70%` o menos, así que sus tablas se ven reducidas a su nombre y su borde de color.  
`Apply` conserva las posiciones tal como están en ese momento, y la disposición se aplica sola en cuanto se detiene. `Cancel` o `Escape` deja el diagrama como estaba.

Las otras tres se calculan de una vez, fuera del hilo principal, así que no hay nada que ver: se muestra un aviso mientras se calcula la disposición, y el resultado final se centra en la zona que ya ocupa el diagrama. `Cancel` o `Escape` descarta una disposición que ya no quieres esperar, y en un host que no ejecuta ningún worker compartido termina en `Could not place tables`; consulta [Web Workers](../../api/installation.md#web-workers). Una disposición que no ha vuelto en 60 segundos termina igual.

Elijas la que elijas, se mueven las tablas y los grupos de tablas, y las notas se quedan donde están. Una relación de una tabla consigo misma se ignora, y varias relaciones entre las mismas dos tablas cuentan como una.  
Todas las disposiciones mantienen juntas las tablas de cada grupo, se muestren o no los grupos, y ajustan cada grupo que contiene tablas alrededor de ellas; consulta [Grupos de tablas](./table-groups.md#auto-layout).  
El resultado queda como una sola entrada del historial, así que deshacer una vez devuelve cada tabla y cada grupo a donde estaba.

![Ordenar un montón de tablas con la disposición automática Flow desde el menú contextual del lienzo, que las alinea de izquierda a derecha siguiendo sus relaciones](/img/demo-automatic-table-placement.webp)

## Bases de datos {#databases}

Entre las bases de datos compatibles están:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Elige una con `Database` en el menú contextual del lienzo, en el panel de opciones o el menú contextual de las pestañas Esquema SQL y Generador de código, o en la búsqueda rápida. Todos ellos cambian el mismo ajuste.

Estas opciones determinan la sintaxis del Esquema SQL al exportar, el autocompletado del tipo de datos y los tipos a los que se resuelven el código generado y los esquemas importados.  
Deciden qué opciones de `Statements` y `Header` puede escribir la pestaña [Esquema SQL](./schema-sql.md#options-panel). Una opción que la base de datos no tiene sigue en el panel de opciones, atenuada, y el SQL recurre a la más cercana que sí tiene.  
También deciden qué acciones ON DELETE y ON UPDATE escriben el Esquema SQL y los destinos ORM del Generador de código, y cuáles marcan los menús de relación como `not in <database>`; consulta [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update) y [Generador de código](./code-generator.md#database).  
La importación de Esquema SQL conserva el tipo de datos de una columna, con su lista de argumentos incluida, tanto si el editor lo enumera como si no, por ejemplo `TIMESTAMP WITH TIME ZONE`, `public.mood` o `integer[]`; consulta [Tipos de datos](./file-import-export.md#data-types). El autocompletado del tipo de datos solo sugiere los tipos que enumera la base de datos seleccionada.

![Cambiar la base de datos a PostgreSQL y elegir después un tipo de PostgreSQL en el autocompletado](/img/demo-database.webp)

![Autocompletado aproximado del tipo de datos, recorrido con las teclas de flecha y aceptado con Right, Tab o Enter](/img/demo-data-type-autocomplete.webp)

## Barra de herramientas del lienzo {#canvas-toolbar}

Una pequeña barra de herramientas flota sobre el centro del borde inferior del lienzo y contiene, de izquierda a derecha, las herramientas que actúan sobre el propio lienzo y los comandos que le añaden elementos:

- La mano y el puntero. El puntero es la herramienta predeterminada; la mano convierte cualquier arrastre en un desplazamiento de la vista, tanto sobre las tablas como sobre el espacio vacío. `Space` alterna entre ellas. Mientras el dibujo de un [`New Table Group`](./table-groups.md#drawing-a-group) está preparado, se marca el botón `New Table Group` en lugar de cualquiera de ellas, y hacer clic en cualquiera de las dos, pulsar `Space` o elegir una notación de relación termina el dibujo sin añadir ningún grupo.
- `New Table`, `New Memo` y `New Table Group`. `New Table` añade una tabla como `Alt + N`, y `New Memo` añade una nota como `Alt + M`. `New Table Group` prepara el [dibujo de grupos](./table-groups.md#drawing-a-group) como `Alt + G` y desactiva la mano; un segundo clic, como un segundo `Alt + G`, termina el dibujo sin añadir ningún grupo. `New Memo` no aparece mientras Opciones de vista → `Memos` oculta las notas, ni `New Table Group` mientras Opciones de vista → `Table Groups` oculta los grupos. Un editor `readonly` no muestra ninguno de los tres.
- El zoom: `Zoom out`, el zoom actual como porcentaje y `Zoom in`. Los dos botones cambian el zoom por pasos igual que los atajos de zoom, y al hacer clic en el porcentaje el zoom vuelve al `100%`.
- Las cuatro notaciones de relación, las mismas cuatro con las que empiezas una relación; consulta [Empezar a editar](./editing-start.md). Al elegir una se vuelve al puntero, ya que una relación se dibuja haciendo clic en dos tablas.
- El modo zen, `Alt + Z`, que quita todo excepto el lienzo y esta barra de herramientas. Volver a pulsar `Alt + Z`, o el botón, recupera el resto. Un explorador abierto se oculta con el resto, sin cerrarse, y vuelve con él. Aún se puede abrir durante el modo zen; consulta [Cuándo se aparta](./explorer.md#when-it-stands-aside).
- La brújula `Go to content`, que se añade al final de la barra de herramientas solo mientras no hay en pantalla ninguna tabla, nota visible ni grupo de tablas visible; consulta [Moverse por el lienzo](#getting-around-the-canvas).

Cada botón con atajo lo indica en su descripción emergente, por ejemplo `New Table (Alt + N)` (Windows/Linux) o `New Table (⌥ + N)` (Mac).  
La barra de herramientas se aparta mientras está abierta la vista previa de la disposición automática `Force`, el panel Propiedades de la tabla, el viaje en el tiempo o el visor de diferencias, y vuelve en cuanto se cierra.

![Añadir una tabla y una nota desde la barra de herramientas, preparar y cancelar New Table Group, desplazar la vista con la mano, cambiar el zoom por pasos y activar y desactivar el modo zen con ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Acercar y alejar {#zoom-inout}

Se hace zoom con `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac). La rueda sola desplaza la vista del lienzo.  
Pellizcar en el panel táctil también hace zoom, alrededor del punto donde pellizcas, y lo mismo hacen dos dedos en una pantalla táctil, que además desplazan la vista al moverse.  
Atajos de teclado: `Ctrl + Plus` (Windows/Linux) o `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) o `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) vuelve directamente al `100%`, manteniendo el centro de la pantalla donde está.

Los botones `Zoom out` y `Zoom in` de la [barra de herramientas del lienzo](#canvas-toolbar) cambian el zoom por pasos como los atajos `Minus` y `Plus`: cada pulsación lo mueve 4 puntos porcentuales, manteniendo el centro de la pantalla donde está. El porcentaje entre ellos muestra el zoom actual, y al hacer clic en él se vuelve directamente al `100%`, como con `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac).

El zoom va del `10%` al `150%`.  
Al `70%` o menos, las tablas se reducen a su nombre y su borde de color, y la edición de celdas, los atajos de celda y copiar y pegar dejan de funcionar hasta que vuelves a acercar el zoom.

Los mismos tres atajos también hacen zoom en la pestaña Visualización, tanto en modo `Graph` como en `Flow`, cada modo dentro de su propio rango; consulta [Visualización](./visualization.md#toolbar).

![Alejar con ⌘ + Wheel hasta que las tablas se reducen a su nombre y volver después por pasos con ⌘ + Plus, ⌘ + Minus y ⌘ + 0](/img/demo-zoom.webp)

## Moverse por el lienzo {#getting-around-the-canvas}

El lienzo no tiene bordes ni un tamaño que definir. Las tablas y las notas se quedan donde las pongas, y todo lo que sigue describe el diagrama, no una página fija.

Arrastra una zona vacía del lienzo para desplazar la vista, o cambia a la herramienta Mano con `Space` y arrastra en cualquier parte, incluso sobre una tabla. La rueda también desplaza la vista, y `Shift + Wheel` la desplaza en horizontal.  
El cuerpo de un [grupo de tablas](./table-groups.md#selecting-groups), la zona bajo su barra de título, cuenta como lienzo vacío para el botón izquierdo: al arrastrarlo se desplaza la vista, `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) dibuja un cuadro de selección y un clic anula la selección.  
El desplazamiento de la vista no tiene límites: la rueda, un arrastre y la herramienta Mano llevan la vista tan lejos como la muevas, más allá de las tablas por cualquier lado.

Arrastra con el botón central del ratón (pulsa la rueda) para desplazar la vista desde cualquier parte del lienzo, tanto con el puntero como con la mano. Funciona incluso cuando la pulsación cae sobre una tabla, una nota, una celda, un icono o una relación.  
Un arrastre con el botón central no selecciona, no mueve ni hace clic en nada, y conserva la selección. Cierra el menú contextual que esté abierto y el selector de color, y no se activan el desplazamiento ni el pegado propios del navegador con el clic central.  
Una pulsación con el botón central en las barras de desplazamiento, el minimapa, la barra de herramientas del lienzo o un editor de celda o de nota abierto no desplaza la vista.

El minimapa de la esquina superior derecha representa el diagrama con el espacio de una pantalla por cada lado, el alcance de las barras de desplazamiento, ajustado hacia fuera a una cuadrícula gruesa, así que cuanto más alejas el zoom, más pequeño se ve el diagrama en él. Haz clic en él para mover la vista a ese punto, o arrastra el rectángulo del área visible para desplazar la vista. Al alejar el zoom, el rectángulo del área visible crece para cubrir una parte mayor del mapa.  
Dibuja cada tabla con el color de la tabla, y cada grupo de tablas visible como un recuadro con el color del grupo detrás de sus tablas.  
Las barras de desplazamiento de los bordes derecho e inferior describen el mismo recorrido, que va desde el diagrama situado justo fuera de un lado de la pantalla hasta justo fuera del otro, así que es al menos una pantalla más largo que el diagrama dibujado, y más largo aún mientras la vista está más allá de él. Fuera del modo zen, las dos barras de desplazamiento se muestran siempre que el documento contiene una tabla, una nota visible o un grupo de tablas visible, aunque todo quepa en pantalla. Un documento sin ninguno de ellos, como uno cuyas únicas notas están ocultas con Opciones de vista → `Memos`, no muestra ninguna de las dos, ni el minimapa.  
Arrastrar el cuadro de desplazamiento de una barra o el rectángulo del área visible del minimapa es el único desplazamiento que se detiene: no va más allá de las tablas situadas justo fuera de la pantalla, o del punto donde empezó el arrastre si estaba más lejos.

Si un desplazamiento de la vista deja la pantalla sin ninguna tabla, nota visible ni grupo de tablas visible, se añade al final de la [barra de herramientas del lienzo](#canvas-toolbar) una brújula `Go to content`, con una flecha que señala el más cercano y la distancia a la que se encuentra. Haz clic en ella para centrar ese elemento sin cambiar el zoom.

![Desplazar la vista arrastrando el lienzo vacío, con un arrastre con el botón central sobre una tabla, con el minimapa y con la rueda, y volver después siguiendo la brújula Go to content](/img/demo-canvas-navigation.webp)

### Dónde termina un salto {#where-a-jump-lands}

Todo salto que te lleva a algo del lienzo mueve la vista según una misma regla: los resultados `#`, `@` y `:` de la [búsqueda rápida](./quick-search.md#searching-the-diagram), las filas del [explorador](./explorer.md#going-to-a-row) y las coincidencias de su búsqueda [Buscar y reemplazar](./find-and-replace.md#going-to-a-match), las filas de la lista del [visor de diferencias](#going-to-a-change), el [botón de la tarjeta](./visualization.md#card-buttons) de enlace externo en Flow y el destino de un [Importar y añadir](./file-import-export.md#import-and-add). Cada una de esas secciones indica qué selecciona el salto; esta indica adónde va la vista.

Un salto nunca cambia el zoom y hace como mucho un desplazamiento. Desde otra pestaña, primero cambia a la pestaña ERD.  
Mide el lienzo tal como se muestra: por debajo de la barra de herramientas superior, o con toda la altura en el modo zen, y a la derecha de un explorador abierto, que estrecha el lienzo en lugar de taparlo.

Las direcciones horizontal y vertical se evalúan por separado, y una dirección en la que el destino ya se ve bien se deja exactamente como está:

- Un destino que no mide más de la mitad del lienzo en esa dirección se queda donde está mientras su centro esté en la mitad central del lienzo, entre una cuarta parte y tres cuartas partes del ancho, o del alto. De lo contrario, su centro se lleva al centro del lienzo.
- Un destino más largo que aún cabe con `40px` de margen en cada extremo se queda donde está mientras se vea entero. De lo contrario, en horizontal, se centra; en vertical, su parte superior se lleva a `40px` por debajo del borde superior del lienzo.
- Un destino aún más largo se queda donde está mientras se vea entero o, cuando es más largo que el lienzo, mientras se vea su parte clave, indicada más abajo. De lo contrario, se centra si cabe o, si no, se coloca tan cerca del centro como permita mantener los dos extremos de su parte clave al menos `40px` dentro del lienzo; si la parte clave es demasiado larga para eso, su inicio se mantiene `40px` hacia dentro.

Así, una tabla pequeña cerca del borde izquierdo del lienzo, a media altura, solo se mueve en horizontal.

Lo que un salto muestra y la parte clave que debe verse cuando no cabe entero:

- Una tabla: la tabla entera, por la franja del nombre de su parte superior, o por su celda de comentario si la coincidencia está en el comentario de la tabla mientras Opciones de vista → `Table Comment` muestra los comentarios. Al `70%` o menos, donde las tablas se reducen a su nombre, por el nombre en el centro del recuadro.
- Una columna: su fila, por la celda a la que va el salto: su nombre, o el comentario en el que está la coincidencia mientras Opciones de vista → `Column Comment` muestra los comentarios. Al `70%` o menos, una columna muestra su tabla según la regla de la tabla.
- Una celda demasiado ancha para verse entera, como un comentario largo: por el texto coincidente que contiene.
- Una relación: el recuadro que abarca sus dos tablas, por la tabla hija.
- Un grupo de tablas: su recuadro, por su barra de título.
- Una nota, o el bloque que coloca un Importar y añadir: entero.

Cuando ninguna dirección se movería, no hay desplazamiento, así que ir al mismo sitio dos veces seguidas no mueve nada la segunda vez. Un salto que desplaza el lienzo registra el desplazamiento en el [historial de deshacer](./undo-redo.md#what-the-history-records) como cualquier otro cambio de posición de la vista, y uno que no mueve nada no deja nada que deshacer. En un Importar y añadir, el desplazamiento forma parte del mismo paso que la adición. Una fila de la lista del visor de diferencias solo mueve los lados de solo lectura del visor, así que no registra nada.  
Ningún salto inicia ni termina una relación que se esté dibujando. La brújula `Go to content` no es un salto: centra aquello a lo que apunta.

## Visor de diferencias {#diff-viewer}

Puedes comparar documentos guardados anteriormente con el documento actual.  
Elige `Diff Viewer` en el menú contextual del lienzo y, a continuación, un documento `.json` que hayas exportado antes.

La vista se abre sobre el lienzo: lo que ha cambiado a la izquierda y, después, el documento guardado y el actual, uno al lado del otro.  
El documento actual se compara tal como está cuando se abre la vista; los cambios hechos después, incluidos los de un colaborador, no llegan a la vista. Un [explorador](./explorer.md#when-it-stands-aside) abierto se oculta mientras la vista está abierta, así que la vista ocupa todo el ancho del editor.  
En cada lado, la vista se desplaza con la rueda, arrastrando una zona vacía o el cuerpo de un grupo de tablas, o arrastrando con el botón central en cualquier punto del lado, y se hace zoom con `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) o pellizcando. Al `70%` o menos, sus tablas se reducen igual que en el lienzo; consulta [Marcas en los dos lados](#marks-on-the-two-sides).  
Los dos lados son de solo lectura, así que no se modifica nada de tu documento. Cada uno conserva su propia selección, y un clic en una tabla allí la selecciona solo en ese lado.  
Cierra la vista con el botón `Close` del aviso `Diff Viewer` que aparece al abrirla, o con `Escape`.

![Abrir el visor de diferencias con un archivo .json guardado, hacer clic en filas marcadas con A, M, D y R en su árbol, filtrar por nombre y cerrarlo](/img/demo-diff-viewer.webp)

### Qué se compara {#what-is-compared}

Se comparan las tablas, las columnas, los índices, las claves externas, las notas y los grupos de tablas.  
Cada elemento se empareja primero por su id, así que, frente a una versión anterior del mismo archivo, que conserva los ids, una tabla, columna, índice o grupo de tablas renombrado sigue siendo un solo elemento, que aparece como renombrado.  
Lo que queda se empareja uno a uno por lo que conserva: una tabla o un grupo de tablas, por su nombre, distinguiendo mayúsculas y minúsculas; una columna o un índice, por su tabla y su nombre; una clave externa, por sus dos tablas y sus pares de columnas; y una nota, por su texto y, después, por su posición. Un índice sin nombre se empareja por sus columnas, su orden y dirección, y si es único, y un grupo de tablas sin nombre, por el mayor número de tablas que comparte.  
Así, frente a un archivo de otra procedencia, como un diagrama reconstruido mediante la importación de SQL, una tabla renombrada aparece como una eliminada y otra añadida.

Qué cuenta como cambio:

- Una tabla: su nombre, comentario, grupo de tablas, posición y color.
- Una columna: su nombre, comentario, tipo de datos, valor predeterminado, Incremento automático, clave principal, Único, No nulo y su posición en la tabla. Solo cuentan como movidas las columnas que quedan fuera del orden que comparten ambos documentos, así que añadir, quitar o mover una columna no marca las demás.
- Un índice: su nombre, UNIQUE y sus columnas, con su orden y dirección.
- Una clave externa: sus pares de columnas, su tipo de relación y sus acciones ON DELETE y ON UPDATE.
- Una nota: su texto, posición, tamaño y color.
- Un grupo de tablas: su nombre, las tablas que contiene, color, posición y tamaño.

Así, una tabla, nota o grupo que solo se ha movido, ha cambiado de tamaño o ha cambiado de color cuenta como modificado. Las posiciones y los tamaños se comparan en píxeles enteros, y el orden de apilamiento y el punto donde un conector se une a una tabla nunca cuentan.

### El árbol de cambios {#the-change-tree}

La lista de la izquierda se dibuja como el [árbol del explorador](./explorer.md#the-tree) y solo contiene lo que ha cambiado: `Tables`, `Table Groups` y `Memos`, que solo se muestran cuando contienen alguna fila, y, bajo una tabla, sus propias carpetas `Columns`, `Indexes` y `Foreign Keys`. Una clave externa aparece bajo su tabla hija, y una tabla añadida o eliminada no muestra nada dentro.  
Cada carpeta muestra cuántas filas contiene, y todas las carpetas y tablas empiezan expandidas.  
Las tablas y los grupos de tablas se ordenan por nombre, sin distinguir mayúsculas y minúsculas. Las notas, y las columnas, índices y claves externas de una tabla, mantienen el orden del documento actual, y un elemento eliminado se vuelve a colocar donde estaba. Una fila de nota muestra la primera línea de la nota, y una fila de clave externa muestra sus columnas hijas y, después, `→` con la tabla padre y sus columnas, como `user_id → users(id)`. Un nombre vacío se muestra como `unnamed` en cursiva.

Cada fila termina con una letra, y una fila marcada con `A`, `D`, `M` o `R` tiene su nombre en el color de la letra:

- `A`, añadido, en verde: solo en el documento actual.
- `D`, eliminado, en rojo y tachado: solo en el documento guardado.
- `M`, modificado, en ámbar: en ambos, con cambios.
- `R`, renombrado, en azul: en ambos, con un nombre nuevo. Un cambio de nombre prevalece sobre cualquier otro cambio, que la descripción emergente sigue mostrando.
- `~`, en ámbar, aparece al final de cada carpeta y de cada tabla que solo figura por lo que ha cambiado dentro de ella; sus nombres conservan el color habitual.

Pasa el puntero por encima del nombre de una fila para ver su descripción emergente: el estado, `Added`, `Deleted`, `Modified`, `Renamed` o `Changed inside`, y después una línea por cambio, como `Name: users → members` o `NN: ✗ → ✓`. Un texto se cita por su primera línea, cortada a partir de 40 caracteres, y un valor vacío se muestra como `—`. La descripción emergente de un elemento añadido o eliminado es solo su estado.

`Filter by name`, encima del árbol, conserva las filas cuyo nombre actual o guardado contiene lo que escribes, sin distinguir mayúsculas y minúsculas. Una tabla cuyo nombre coincide conserva todas sus filas, y una que no coincide se queda solo con las filas que coinciden. Un filtro que no coincide con nada deja el árbol vacío.  
Cuando los dos documentos no difieren en nada, el árbol indica `No changes`.

Arrastra el borde derecho del árbol para ensancharlo o estrecharlo, de `200px` a `480px`, y haz doble clic en el borde para devolverlo a `260px`. Cada comparación se abre a `260px`, y los dos lados se reparten a partes iguales el resto del ancho.  
El teclado recorre el árbol igual que el del explorador —consulta [Teclas en el explorador](./explorer.md#keys-in-the-explorer)—, pero aquí `Escape`, en el árbol o en `Filter by name`, cierra la vista.

### Ir a un cambio {#going-to-a-change}

Haz clic en una fila, o pulsa `Enter` o `Space` con el foco del teclado en ella, para ir a su elemento en cada lado que lo contiene: un elemento añadido, solo en el lado actual; uno eliminado, solo en el lado guardado; y cualquier cosa que contengan ambos, en los dos lados. Una fila de carpeta solo se contrae o se expande, y lo mismo ocurre con la flecha al principio de una fila de tabla.

- Una fila de tabla, de columna o de índice selecciona solo la tabla.
- Una fila de clave externa muestra sus dos tablas, o la tabla hija cuando están demasiado separadas para verse juntas, selecciona la tabla hija con sus columnas de clave externa e ilumina el conector; consulta [Cómo leer un conector](./relationship-editing.md#reading-a-connector).
- Una fila de nota selecciona la nota, y una fila de grupo de tablas selecciona el grupo. Una nota o un grupo que el documento de un lado oculta no lleva a ninguna parte en ese lado.

Cada lado se mueve según la regla de [Dónde termina un salto](#where-a-jump-lands), medida en ese lado, así que volver a hacer clic en la misma fila no mueve nada.

### Marcas en los dos lados {#marks-on-the-two-sides}

Los dos lados colorean el texto, los contornos y los conectores, y no rellenan nada. Lo añadido es verde y solo se muestra en el lado actual, lo eliminado es rojo y solo se muestra en el lado guardado, y lo modificado, en ámbar, y lo renombrado, en azul, se muestran en ambos lados. Todo lo que no ha cambiado se dibuja como siempre.

- Una tabla o un grupo de tablas añadido o eliminado lleva un contorno de su color, y su nombre toma ese color. Una nota añadida o eliminada lleva un contorno.
- Una columna añadida o eliminada en una tabla que existe en ambos documentos colorea toda su fila, y una columna que se ha movido pone toda su fila en ámbar. Dentro de una tabla añadida o eliminada no se marca nada por separado.
- El texto de una celda modificada se vuelve ámbar: el comentario de una tabla; el comentario, el tipo de datos, el valor predeterminado, Incremento automático, Único o No nulo de una columna; o el texto de una nota. Un cambio de clave principal pone en ámbar el icono de clave de la columna.
- Una tabla, columna o grupo de tablas renombrado tiene su nombre en azul.
- Una tabla, nota o grupo de tablas con un cambio que no tiene celda propia, como un movimiento, un nuevo tamaño o color, o un cambio de grupo o de las tablas de un grupo, lleva un contorno ámbar.
- Una clave externa añadida, eliminada o modificada dibuja su conector en ese color. Al pasar el puntero por encima, o cuando una fila lo ilumina, se dibuja en cambio con el color habitual al pasar el puntero.
- Un cambio de índice no marca nada en ninguno de los lados; solo se muestra en el árbol.

Cada lado sigue las opciones de vista de su propio documento. Un cambio en una celda que ese lado no dibuja se muestra, en su lugar, en el nombre. Un cambio de columna en una celda que oculta una opción de vista, como `Unique` o `Auto Increment`, ambas desactivadas de forma predeterminada, pone en ámbar el nombre de la columna, y lo mismo hace un cambio de clave principal en una fila que no muestra icono de clave. Un cambio en el comentario de la tabla mientras `Table Comment` está desactivada pone en ámbar el nombre de la tabla. El azul de un cambio de nombre prevalece sobre este ámbar. Una nota o un grupo de tablas que su documento oculta aparece en el árbol, pero no se dibuja en ese lado.

Al `70%` o menos, las tablas reducidas conservan su contorno. El nombre conserva el verde o el rojo de una tabla añadida o eliminada, o el azul de un cambio de nombre, y, si no, toma el ámbar de un cambio de comentario. Los cambios de columna no se dibujan hasta que vuelves a acercar el zoom; el árbol sigue mostrándolos.
