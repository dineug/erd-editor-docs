---
sidebar_position: 3
description: Añade, selecciona, reordena y elimina columnas, activa o desactiva las opciones de columna y copia o pega columnas.
---

# Edición de tablas

La edición de tablas ofrece, básicamente, una experiencia de edición similar a la de Excel.  
La [vista de nombres](./logical-names.md#name-view) decide si una tabla dibuja en su encabezado y sus filas los nombres, los nombres lógicos o ambos.  
El modo de edición se inicia con `Enter` o haciendo doble clic en una celda.  
`Enter` o `Escape` lo finalizan. Lo que escribes se aplica a medida que lo escribes, así que `Escape` conserva el texto en lugar de revertirlo. Una [celda Dominio](./logical-names.md#the-domain-cell) es la excepción: solo permite elegir de su lista y nunca conserva lo que escribes. Cerrar una [celda del nombre lógico](./logical-names.md#writing-a-logical-name) sobre un nombre lógico modificado también puede rellenar el nombre físico.  
`Escape` deja la celda con el foco y la tabla seleccionada, y un segundo `Escape` quita el foco y la selección. Mientras una celda del nombre lógico muestra su [lista de términos](./logical-names.md#completing-term-names), el primer `Escape` solo cierra la lista.  
Mientras un método de entrada todavía está componiendo texto, `Escape` mantiene abierto el modo de edición.

![Añadir una tabla con Alt + N y rellenar dos columnas](/img/demo-table-edit.webp)

## Añadir columnas {#adding-columns}

Se crean con el atajo de teclado `Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac).  
Se añade una columna a cada tabla seleccionada.

## Tecla Tab {#tab-key}

Pulsa `Tab` para pasar directamente al modo de edición de la celda siguiente.  
Al pulsar `Tab` en la última celda se crea una columna nueva.  
Usa `Shift + Tab` para ir al modo de edición de la celda anterior.  
`Tab` y `Shift + Tab` pasan por las celdas que dibuja la tabla, en su orden, así que la vista de nombres y Opciones de vista → `Domain` deciden si las celdas del nombre lógico y Dominio están entre ellas; consulta [Escribir un nombre lógico](./logical-names.md#writing-a-logical-name).  
Las marcas de [clave alternativa](./table-related-functions.md#alternate-keys) que se dibujan tras la última celda de una fila no son celdas, así que el foco del teclado las salta y nunca entran en modo de edición.

![Recorrer las celdas de una fila con Tab, añadir una columna desde la última celda y volver atrás con Shift + Tab](/img/demo-table-tab.webp)

## Autocompletado del tipo de datos {#datatype-autocomplete}

Empieza a editar una celda `DataType` y escribe. Se sugieren los tipos coincidentes de la base de datos seleccionada, y se resalta la parte de cada sugerencia que contiene literalmente lo que has escrito.  
La coincidencia en sí es aproximada, así que `vch` también encuentra `VARCHAR`.

- `Arrow Up` o `Arrow Down`: moverse por las sugerencias
- `Arrow Right`, `Tab` o `Enter`: aceptar la sugerencia resaltada
- `Arrow Left`: volver al texto que has escrito

También puedes hacer clic en una sugerencia.  
La lista muestra hasta diez sugerencias a la vez y se desplaza para mostrar el resto.  
No se impone nada, así que se puede escribir libremente un tipo que no está en la lista, incluidos argumentos como `VARCHAR(255)`. La lista se cierra en cuanto lo que escribes va más allá de un nombre de tipo completo, como ocurre con `VARCHAR(255)` o `BIGINT UNSIGNED`.  
Las sugerencias siguen la base de datos seleccionada. Cambiar la base de datos cambia lo que se ofrece y deja las columnas existentes como están.

Escribir en la celda `DataType` de una columna vinculada a un dominio, o aceptar ahí una sugerencia, desvincula la columna en cuanto su tipo difiere del del dominio; consulta [Dominios y tipos de datos](./dictionary.md#domains-and-data-types).  
En `Logical Names`, mientras Opciones de vista → `Domain` está desactivado, la celda del tipo de una columna vinculada a un dominio con nombre muestra el nombre del dominio, y al editarla se abre el [selector de dominios](./logical-names.md#the-domain-cell) en lugar de estas sugerencias. Una celda del tipo que muestra un tipo de datos lo edita como se ha descrito.

![Rellenar celdas DataType a partir de sugerencias aproximadas con las teclas de flecha, Tab y Enter](/img/demo-data-type-autocomplete.webp)

## No nulo, Único, Incremento automático {#not-null-unique-auto-increment}

Estas tres celdas son interruptores, no texto.  
Haz doble clic en una, o pulsa `Enter` mientras tiene el foco, para cambiar su estado.

La celda No nulo muestra `N-N` cuando está activada y `NULL` cuando no lo está.  
`UQ` y `AI` aparecen atenuados cuando están desactivados y resaltados cuando están activados.

![Cambiar No nulo con un doble clic, y Único e Incremento automático con Enter](/img/demo-column-options.webp)

Las celdas ocultas con las [opciones de vista de tabla](./table-related-functions.md) no se pueden activar ni desactivar.

## Seleccionar varias columnas {#selecting-multiple-columns}

Admite cinco métodos:

- `Shift + Arrow Up/Down`: ampliar la selección fila a fila
- `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac): añadir una sola columna
- `Shift + click`: seleccionar el rango desde la última columna que tuvo el foco
- `Ctrl + Shift + click` (Windows/Linux) o `⌘ + Shift + click` (Mac): añadir ese rango a la selección
- `Alt + A` (Windows/Linux) o `⌥ + A` (Mac): Seleccionar todo

![Seleccionar columnas con Shift + Arrow Down, Ctrl/⌘ + click, Shift + click y Alt + A](/img/demo-column-select.webp)

Para mover juntas las columnas seleccionadas, arrastra el asa de arrastre situada junto a la que tiene el foco; consulta [Reordenar y mover columnas](#rearranging-and-moving-columns).

Un clic derecho en la fila de una columna decide sobre qué columnas actúa el menú contextual de la tabla, sea cual sea la tecla modificadora que se mantenga pulsada.  
En una fila que ya está seleccionada, la selección se mantiene y el foco pasa a esa fila. En cualquier otra fila, solo se selecciona esa fila. Esto se cumple en cualquier punto de la fila, incluidos el icono de clave y una marca de [clave alternativa](./table-related-functions.md#alternate-keys).  
Por eso, para actuar sobre varias columnas desde el menú, como en [Clave principal de columna](#column-primary-key) o [Eliminación de columnas](#column-deletion), haz clic con el botón derecho en una de las filas seleccionadas.  
En un Mac, `Ctrl + click` también abre el menú, pero cuenta como un clic normal, así que, sobre una celda, selecciona solo esa fila antes de que se abra el menú.

## Reordenar y mover columnas {#rearranging-and-moving-columns}

Una columna se mueve con su asa de arrastre, un pequeño botón con marcas de agarre que está justo fuera del borde izquierdo de la tabla, junto a la fila con el foco.  
Pon el foco en cualquier celda de la columna, haciendo clic en ella o con las teclas de flecha o `Tab`, y el asa aparece junto a su fila. Ninguna fila la tiene mientras el foco está en el encabezado de la tabla.  
El asa se dibuja tenue hasta que el puntero está sobre ella, y entonces el puntero se convierte en una mano. Una pulsación sola no hace nada: el arrastre empieza en cuanto el puntero se mueve, y puede llevar la columna a otro lugar de su tabla o a otra tabla.  
Sobre las filas de una tabla, las filas arrastradas se desplazan a su posición y las filas que rodean el punto donde se sueltan se apartan para dejar sitio. Sobre el lienzo vacío, o sobre el encabezado de una tabla que tiene columnas, una copia translúcida de las filas sigue al puntero y muestra las celdas del nombre y del tipo de cada fila tal como las dibuja la fila en la [vista de nombres](./logical-names.md#name-view) actual.  
Suelta justo debajo de la última fila de una tabla para mover la columna al final de esa tabla. En una tabla sin columnas, se puede soltar en cualquier punto de ella. La franja situada justo a la izquierda de una tabla, donde está el asa, también cuenta como filas de la tabla, así que un arrastre en línea recta hacia abajo a lo largo del asa reordena las columnas sin que el puntero entre en la tabla.  
Una columna movida a otra tabla conserva su nombre lógico y su dominio.

![Poner el foco en una columna y arrastrar el asa junto a su fila a una nueva posición y, después, arrastrar el asa de otra columna a otra tabla](/img/demo-column-move.webp)

Para mover varias columnas a la vez, [selecciónalas](#selecting-multiple-columns) y arrastra el asa junto a la que tiene el foco. Mientras la columna con el foco es una de dos o más columnas seleccionadas de su tabla, el asa las lleva todas; si no, solo lleva su propia columna.  
No hace falta ninguna tecla modificadora. Mantener pulsada `Alt` (Windows/Linux) o `⌥` (Mac) sobre el asa mueve las columnas como un arrastre normal y no duplica nada.

![Seleccionar tres columnas y, después, arrastrar a otra tabla el asa junto a la que tiene el foco, con las demás columnas seleccionadas moviéndose con ella](/img/demo-column-multi-move.webp)

Un arrastre que empieza en la fila de una columna en lugar de en su asa mueve la tabla, como un arrastre en su encabezado; consulta [Mover varias tablas](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) o `⌥ + drag` (Mac) sobre una fila duplica la tabla; consulta [Duplicar tablas y notas](./table-related-functions.md#duplicating-tables-and-memos).  
No se dibuja ningún asa con el zoom al `70%` o menos, donde las tablas solo muestran su nombre, ni en un editor de solo lectura, así que ahí no se pueden reordenar las columnas.

## Eliminación de columnas {#column-deletion}

Elimina las columnas seleccionadas de la tabla con el foco. Al hacer clic en una celda se selecciona su columna, así que hacer clic en una celda y pulsar `Delete` elimina solo esa columna.  
Atajos de teclado:

- `Delete` o `Backspace`. Eliminan las columnas seleccionadas mientras su tabla es lo único seleccionado. Sin ninguna columna seleccionada (con el foco en el nombre, el [nombre lógico](./logical-names.md#name-view) o el comentario de la tabla), con cualquier otra cosa también seleccionada o con el zoom al `70%` o menos, donde las tablas solo muestran su nombre, eliminan en su lugar toda la selección; consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` o `Alt + Delete` (Windows/Linux), `⌥ + Backspace` o `⌥ + Delete` (Mac). Eliminan las columnas seleccionadas de la tabla con el foco aunque también haya otras tablas o notas seleccionadas. No eliminan nada mientras se edita una celda ni al `70%` o menos.

![Eliminar una columna y, después, dos columnas seleccionadas con Alt + Backspace](/img/demo-column-remove.webp)

El menú contextual de la tabla hace lo mismo. Con la tabla como único elemento seleccionado, haz clic con el botón derecho en la fila de una columna: la última opción del menú indica `Delete column`, o `Delete columns` cuando esa fila es una de dos o más columnas seleccionadas.

Mientras se edita una celda, `Delete` y `Backspace` solo borran texto. Si se mantienen pulsadas fuera del editor de celdas, solo eliminan una vez.  
Tras una eliminación, el foco pasa a la columna restante más cercana por encima de la que tenía el foco. Cuando no queda ninguna por encima, el foco pasa al nombre de la tabla (en `Logical Names`, al nombre lógico dibujado en su lugar) aunque queden columnas por debajo, así que el siguiente `Delete` o `Backspace` elimina la tabla en lugar de una columna.  
Las relaciones y los índices que usan una columna eliminada se eliminan con ella. No se pide confirmación, y toda la eliminación es un solo paso de deshacer.

## Copiar y pegar columnas {#copyingpasting-columns}

Funciona como un portapapeles basado en tablas.  
Atajos de teclado: `Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac)

Al copiar a una hoja de cálculo, al pegar desde una y al pegar en la tabla cuya celda de columna tiene el foco, se usan las celdas que muestran las tablas, en el orden en que las muestran; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options), [Ajustar el orden de las columnas](./settings.md#adjusting-column-order) y [Vista de nombres](./logical-names.md#name-view). La vista de nombres cambia lo que contienen algunas de esas celdas:

- En `Logical Names`, la celda del nombre contiene el nombre lógico, o nada mientras está en blanco. Mientras Opciones de vista → `Domain` está desactivado, la celda del tipo contiene el nombre del dominio de la columna donde muestra uno, y el tipo de datos en los demás casos.
- En `Both Names`, la celda `Logical Name` se copia y se pega donde la coloca el orden de columnas.
- Una celda Dominio visible contiene el nombre del dominio, o nada en una columna que no muestra ningún dominio.

Las columnas copiadas en el editor y pegadas con el encabezado de una tabla seleccionado, o en las demás tablas seleccionadas, llevan todas las celdas de las columnas copiadas, incluidas las ocultas, como Único e Incremento automático, y sus nombres lógicos.  
Conservan un vínculo con un dominio solo mientras este diagrama incluye ese mismo dominio, no simplemente uno con el mismo nombre, y el dominio sigue teniendo el tipo de la columna copiada. Si no, llegan desvinculadas, con el tipo con el que se copiaron. Sus nombres cuentan como escritos por ti, salvo que un nombre pegado esté vacío y el nombre lógico derive uno; consulta [Derivar nombres físicos](./dictionary.md#deriving-physical-names).  
Las marcas de [clave alternativa](./table-related-functions.md#alternate-keys), como `AK1.1`, no son celdas, así que copiar y pegar las dejan fuera aunque estén visibles.

Puedes pegar del editor en Excel y de Excel de vuelta en el editor.  
Los valores de las celdas salen exactamente como se escribieron, así que un valor como `<label>` o `a &amp; b` llega sin cambios a una hoja de cálculo o a un documento.  
Las columnas de la hoja de cálculo se asocian a las celdas visibles por su posición, no por su nombre, así que las columnas de la hoja deben seguir el orden de esas celdas.  
En las columnas siguientes, cualquiera de estos valores se lee como verdadero (sin distinguir mayúsculas y minúsculas):

- AutoIncrement: `TRUE`, `1`, `YES`, `Y`
- Unique: `TRUE`, `1`, `YES`, `Y`
- Not Null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Al copiar hacia fuera, el editor escribe `TRUE` o `FALSE` en AutoIncrement y Unique, y `NOT NULL` o `NULL` en Not Null.  
Las celdas Único e Incremento automático están ocultas de forma predeterminada, así que `TRUE` y `FALSE` solo se escriben y se leen una vez que se muestran.

![Pegar cuatro columnas en una hoja de cálculo, con los indicadores escritos como TRUE/FALSE y NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Pegar tres filas de una hoja de cálculo en una tabla como columnas, con YES, 1 y NOT NULL leídos como verdaderos](/img/demo-copy-sheet-column.webp)

Dónde se aplica un pegado depende del foco:

- Con el encabezado de una tabla seleccionado, las filas pegadas se añaden como columnas nuevas a cada tabla seleccionada.
- Con el foco en una celda de columna, se sobrescriben en orden las filas seleccionadas de esa tabla y, a continuación, las filas situadas debajo de la última de ellas, tantas como se hayan pegado. Las filas que quedan entre selecciones separadas se omiten. Una fila sobrescrita recibe los valores pegados en sus celdas visibles y conserva los de las ocultas, y las filas sobrantes se añaden como columnas nuevas. En todas las demás tablas seleccionadas, las filas pegadas se añaden como columnas nuevas.

![Copiar dos columnas y pegarlas a la vez en dos tablas seleccionadas](/img/demo-copy-column-multi.webp)

Una fila pegada escribe los nombres lógicos y los dominios así:

- Un nombre lógico, de una celda `Logical Name` o de la celda del nombre en `Logical Names`, cuenta como escrito entero. Mientras el nombre de la columna está vacío o sigue siendo derivado, los [diccionarios](./dictionary.md#deriving-physical-names) derivan de él el nombre físico y vinculan el dominio que aporta su término, salvo que la propia celda Dominio de la fila vincule uno. Un nombre que pega la misma fila se conserva y cuenta como escrito por ti.
- Una celda Dominio, o la celda del tipo en `Logical Names` mientras Opciones de vista → `Domain` está desactivado, vincula el dominio que nombra su texto si el diagrama incluye uno. Cualquier otro texto, o una celda vacía, no vincula ninguno y desvincula la columna, incluso de un dominio del tipo pegado. El texto de la celda del tipo que no nombra ningún dominio se lee como un tipo de datos. Las filas copiadas en el editor vinculan en su lugar el dominio con el que se copiaron, y solo mientras este diagrama lo incluye con el tipo copiado, como hacen las columnas nuevas.
- Un dominio vinculado da a la columna su tipo de datos, salvo que la fila pegue un tipo propio. En ese caso, no se vincula un dominio de otro tipo, y la columna toma el tipo pegado.
- En una fila sin celda Dominio, un tipo pegado desvincula la columna de un dominio de otro tipo, como al escribirlo.
- Ningún pegado propaga un tipo mediante [Sincronizar el tipo de datos en las relaciones](./settings.md#relationship-datatype-sync).

## Copiar y pegar tablas y notas {#copyingpasting-tables-and-memos}

Cuando no hay ninguna columna seleccionada dentro de una tabla con el foco, los mismos atajos copian las propias tablas y notas seleccionadas; consulta [Funciones relacionadas con las tablas](./table-related-functions.md).

## Clave principal de columna {#column-primary-key}

Activa o desactiva la clave principal en la columna con el foco, que es la columna a la que pertenece la celda con el foco.  
Cuando la columna con el foco es una de dos o más columnas seleccionadas, el cambio se aplica a todas las columnas seleccionadas: si alguna de ellas no es clave, todas pasan a serlo, y si todas ya lo son, todas dejan de serlo. Las columnas fuera de la selección no se modifican.  
Usa el menú contextual de la tabla o el atajo `Alt + K` (Windows/Linux) o `⌥ + K` (Mac). Cuando el cambio afecta a dos o más columnas, la opción del menú indica `Primary Key on selected columns` en lugar de `Primary Key`.  
El icono de clave de la fila es solo informativo, así que hacer clic en él no establece la clave.

Para convertir varias columnas en una sola clave compuesta, [selecciónalas](#selecting-multiple-columns) y luego pulsa `Alt + K` (Windows/Linux) o `⌥ + K` (Mac), o haz clic con el botón derecho en una de las filas seleccionadas y elige `Primary Key on selected columns`. Cada cambio es un paso de deshacer.

![Seleccionar dos columnas con Shift + Arrow Down y, después, convertir ambas en clave principal con ⌥ + K y quitarles la clave a ambas con una segunda pulsación](/img/demo-column-pk.webp)
