---
sidebar_position: 4
description: Da nombres lógicos a tablas y columnas, muestra los nombres físicos, los nombres lógicos o ambos con la vista de nombres, completa nombres de términos mientras escribes, vincula columnas a dominios y consulta en qué otros lugares los nombres siguen la vista.
---

# Nombres lógicos

Una tabla y cada una de sus columnas pueden tener un nombre lógico junto a su nombre. El nombre lógico es el que leen las personas, como `Customer Name` para `CUST_NM`. El nombre en sí es el nombre físico, el que escriben el [Esquema SQL](./schema-sql.md) y el [Generador de código](./code-generator.md).  
La vista de nombres decide cuál de los dos dibuja el lienzo ERD: los nombres, los nombres lógicos o ambos; consulta [Vista de nombres](#name-view).  
Un nombre lógico también puede dar a su tabla o columna un nombre físico, derivado de las palabras y los términos de la pestaña [Diccionario](./dictionary.md); consulta [Derivar nombres físicos](./dictionary.md#deriving-physical-names).  
Una columna se puede vincular a un dominio, un tipo de datos con nombre, como `Name` para `VARCHAR(100)`, guardado en la hoja `Domains` de la pestaña Diccionario, y entonces tiene el tipo de datos del dominio; consulta [La celda Dominio](#the-domain-cell).  
El Esquema SQL puede escribir cada nombre lógico en un comentario vacío; consulta [Nombres lógicos como comentarios](./schema-sql.md#logical-names-as-comments).

## Vista de nombres {#name-view}

Hay tres vistas, y cada una dibuja a su manera el encabezado y las filas de una tabla:

- `Physical Names`, la vista de un diagrama nuevo, no dibuja ningún nombre lógico. El encabezado muestra el nombre de la tabla y, mientras Opciones de vista → `Table Comment` está activado, su comentario, y cada fila muestra sus celdas en el [orden de columnas](./settings.md#adjusting-column-order).
- La vista `Logical Names` dibuja el nombre lógico en el lugar de cada nombre: en el encabezado y, en cada fila, donde `Name` figura en el orden de columnas. La celda del tipo de una fila puede representar el dominio de la columna, como se describe a continuación.
- La vista `Both Names` dibuja el nombre lógico junto al nombre. El encabezado muestra el nombre lógico, luego el nombre y luego el comentario, y cada fila gana una celda `Logical Name`, que el orden de columnas coloca de forma predeterminada justo antes de `Name`.

Un nombre lógico en blanco, incluido uno formado solo por espacios, muestra un sustituto atenuado. En `Logical Names` es el nombre, dibujado en su lugar, o el marcador de posición `table` o `column` cuando el nombre también está en blanco. En `Both Names` es el marcador de posición `logical`.

En `Logical Names`, una columna vinculada a un dominio con nombre de la hoja `Domains` de la pestaña Diccionario muestra el nombre de ese dominio en su celda del tipo en lugar de su tipo de datos. Todas las demás columnas muestran ahí su tipo de datos.  
Mientras Opciones de vista → `Domain` está activado, el dominio tiene una celda propia y la celda del tipo conserva el tipo de datos, así que ninguna fila muestra el dominio dos veces; consulta [La celda Dominio](#the-domain-cell).

Cada tabla es tan ancha como las celdas que dibuja en la vista, así que un cambio de vista cambia el tamaño de las tablas y vuelve a trazar sus conectores. Ninguna tabla se mueve.  
Al `70%` o menos, una tabla se reduce a su nombre; consulta [Acercar y alejar](./table-related-functions.md#zoom-inout). En `Logical Names` muestra el nombre lógico o, mientras no lo hay, el nombre atenuado. En `Both Names` muestra el nombre lógico con el nombre en una línea debajo, o solo el nombre mientras no hay nombre lógico.

Las comprobaciones del diccionario pueden escribir un nombre lógico o un nombre en rojo o ámbar donde lo señalan; consulta [Marcas en el lienzo](./dictionary.md#marks-on-the-canvas).

## Cambiar la vista {#switching-the-view}

La vista se cambia desde cuatro lugares, y cada uno muestra `Physical Names`, `Logical Names` y `Both Names` con la vista vigente marcada:

- El botón `Name View` de la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), entre las cuatro notaciones de relación y el modo zen. Muestra el nombre de la vista vigente, con una flecha hacia abajo, y su descripción emergente indica `Name View`. Un clic abre la lista encima de la barra de herramientas, y al elegir una vista se cierra.
- `Name View` en el menú contextual del lienzo, justo después de `View Option`: un submenú con las tres vistas. El menú sigue abierto después de elegir una.
- La misma lista en la barra de herramientas de la pestaña Visualización en el modo `Flow`, después del menú de vista de filas; consulta [Barra de herramientas](./visualization.md#toolbar).
- `Name View` en la [búsqueda rápida](./quick-search.md#what-the-palette-lists), justo después de `Tab` y solo en la pestaña ERD. Su submenú se abre con el resaltado en la vista vigente.

![Cambiar la vista de nombres a Logical Names desde la barra de herramientas del lienzo, a Both Names desde el menú del lienzo y de vuelta a Physical Names, con ordered_at, que no tiene nombre lógico, atenuado y luego mostrado como el marcador de posición logical](/img/demo-name-view.webp)

Los cuatro establecen la misma vista. La barra de herramientas superior no tiene ningún botón para ella.

Un cambio de vista conserva la selección y no se registra en el [historial de deshacer](./undo-redo.md#what-the-history-records).  
Si la nueva vista no dibuja la celda con el foco, el foco pasa a la celda dibujada en su lugar: el nombre y el nombre lógico ocupan el uno el lugar del otro, como el tipo y el dominio. Un editor de celdas abierto en esa celda se cierra. Activar o desactivar Opciones de vista → `Domain` mueve el foco del mismo modo.  
Mientras el bloqueo `Name View` está activado, como en un diagrama nuevo, un cambio de vista solo cambia tu propia pantalla y el archivo conserva la vista en la que se bloqueó. Con el bloqueo desactivado, el archivo guarda la vista a la que cambias; consulta [Bloqueo](./settings.md#lock).

## Escribir un nombre lógico {#writing-a-logical-name}

La vista `Physical Names` no dibuja ningún nombre lógico, así que cambia a `Logical Names` o `Both Names` para escribir uno en el lienzo:

- En `Logical Names`, las celdas del nombre del encabezado y de las filas contienen los nombres lógicos, así que en esta vista no se puede editar un nombre físico en el lienzo.
- En `Both Names`, las celdas del nombre lógico contienen los nombres lógicos, y las celdas del nombre, los nombres físicos.

Una celda del nombre lógico se edita como cualquier otra celda: empieza con `Enter` o con un doble clic; consulta [Edición de tablas](./table-editing.md). Abierto sobre un nombre lógico en blanco, el editor muestra como marcador de posición lo que dibujaba la celda: el nombre en `Logical Names` y `logical` en `Both Names`.  
Al escribir, solo se modifica el nombre lógico. El nombre físico se deriva de él cuando el editor se cierra (`Enter`, `Tab`, `Escape` o un clic en otro sitio) sobre un nombre lógico modificado, como un paso de deshacer propio, posterior a lo que has escrito. Un nombre físico escrito por ti se deja como está; consulta [Derivar nombres físicos](./dictionary.md#deriving-physical-names).

`Tab` y `Shift + Tab` recorren las celdas que dibuja la vista, en su orden; consulta [Tecla Tab](./table-editing.md#tab-key):

- En `Logical Names`, el nombre lógico del encabezado, luego su comentario y luego las celdas de cada fila en el orden de columnas, con el nombre lógico en el lugar del nombre.
- En `Both Names`, el nombre lógico, el nombre y el comentario del encabezado, y luego las celdas de cada fila en el orden de columnas, con su celda `Logical Name` en primer lugar de forma predeterminada.

`Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac) añade una columna y pone el foco en la primera celda que dibuja su fila. Con el orden de columnas predeterminado es su celda del nombre, que en `Logical Names` es su nombre lógico y en `Both Names` su celda `Logical Name`, así que puedes empezar por el nombre lógico; consulta [Añadir columnas](./table-editing.md#adding-columns).

Una columna de clave externa que añade una relación copia el nombre lógico y el dominio de su clave, junto con su tipo; consulta [Relaciones identificadoras](./relationship-editing.md#identifying-relationships).  
Al copiar columnas a una hoja de cálculo y al pegar columnas desde una se usan las celdas que dibuja la vista, incluidas las celdas del nombre lógico y las celdas Dominio; consulta [Copiar y pegar columnas](./table-editing.md#copyingpasting-columns).

## Completar nombres de términos {#completing-term-names}

Mientras escribes en una celda del nombre lógico, la del encabezado o la de una fila, una lista bajo la celda ofrece los términos cuyos nombres empiezan por el texto, sin distinguir mayúsculas y minúsculas y sin tener en cuenta los espacios que lo preceden. Un término es un nombre lógico completo guardado en la hoja `Terms` de la pestaña Diccionario, con el nombre físico y el dominio que aporta. La lista muestra hasta ocho, ordenados por nombre, con el texto escrito resaltado. No hay lista mientras ningún término empiece así.

![Añadir una columna con ⌥ + Enter en Both Names, elegir Order Amount en la lista de términos bajo su nombre lógico para rellenar ORD_AMT, DECIMAL(10,2) y el dominio Amount y, después, escribir Order Date, cuyo nombre ORD_DT dan las palabras al cerrar el editor con Enter](/img/demo-logical-names.webp)

- Al principio no hay nada resaltado. `↑` y `↓` mueven el resaltado, que pasa al otro extremo al llegar a uno de ellos, y el término resaltado muestra la tecla `Enter`.
- `Enter` sobre un término resaltado escribe su nombre como nombre lógico y termina la edición. Salvo que el nombre físico sea uno escrito por ti, el mismo paso de deshacer deriva al instante el nombre físico del término y, en una columna, le da también el dominio del término. `Enter` sin nada resaltado termina la edición y conserva lo que has escrito.
- Un clic en un término lo escribe del mismo modo y deja el editor abierto.
- `Escape` mientras se muestra la lista solo cierra la lista, y el siguiente `Escape` termina la edición.
- `Tab` avanza con el texto tal como se ha escrito, y el nombre físico se deriva de él al cerrarse el editor.
- Mientras un método de entrada está componiendo, las flechas y `Enter` pertenecen a la composición.

Lo que un término aporta a una tabla o a una columna se explica en [Derivar nombres físicos](./dictionary.md#deriving-physical-names).

## La celda Dominio {#the-domain-cell}

Opciones de vista → `Domain`, desactivado de forma predeterminada, da a cada fila una celda Dominio en todas las vistas, donde `Domain` figura en el orden de columnas, que de forma predeterminada es justo después de `DataType`; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options).  
La celda muestra el nombre del dominio al que está vinculada la columna o, en una columna que no está vinculada a ningún dominio de la hoja `Domains`, el marcador de posición `domain`, atenuado.

![Activar Opciones de vista → Domain, elegir Amount en la celda Domain de PAY_AMT tras acotar la lista con amo, cambiar el Data Type de Amount a DECIMAL(12,2) en la pestaña Dictionary y comprobar que la columna cambia con él y, después, escribir NUMERIC(12,2) en la columna, lo que la desvincula](/img/demo-domains.webp)

`Enter` o un doble clic abre un selector sobre la celda: un campo vacío con el texto de la celda como marcador de posición y, debajo, `None` y luego todos los dominios con nombre de la hoja `Domains`, en el orden de la hoja. El resaltado empieza en el dominio vinculado o en `None`.

- Al escribir, solo se muestran los dominios cuyo nombre contiene el texto, sin distinguir mayúsculas y minúsculas, desaparece `None` y se resalta el primero. `↑` y `↓` mueven el resaltado.
- `Enter` vincula el dominio resaltado, y un clic vincula aquel en el que se hace clic. Cualquiera de los dos da a la columna el tipo de datos del dominio, como un solo paso de deshacer, y termina la edición. `None` desvincula la columna y conserva su tipo de datos.
- Lo que escribes nunca se escribe en la columna. Mientras la hoja `Domains` no tiene ningún dominio con nombre no hay lista, y `Enter` termina la edición sin escribir nada.

En `Logical Names` con Opciones de vista → `Domain` desactivado, una celda del tipo que muestra el nombre de un dominio abre este selector, y una que muestra un tipo de datos abre el editor del tipo de datos; consulta [Autocompletado del tipo de datos](./table-editing.md#datatype-autocomplete). Para vincular un dominio a una columna que no tiene ninguno, activa la celda Dominio.  
Una columna vinculada tiene el tipo de datos de su dominio y lo sigue cuando cambia el tipo del dominio, y escribir otro tipo en su celda Tipo de datos la desvincula; consulta [Dominios y tipos de datos](./dictionary.md#domains-and-data-types).

## Más allá del lienzo {#beyond-the-canvas}

La mayoría de los demás lugares que nombran una tabla o una columna también siguen la vista de nombres:

- La vista `Physical Names` muestra el nombre.
- La vista `Logical Names` muestra el nombre lógico o, mientras este está en blanco, el nombre, atenuado donde el lugar puede atenuarlo.
- La vista `Both Names` muestra el nombre lógico seguido del nombre: atenuado en una fila de texto, en una segunda línea en una etiqueta de Graph y entre paréntesis donde un mismo texto tiene que contener ambos, como `Member (member)`. Una tabla o columna sin nombre lógico muestra solo su nombre.

Una lista ordenada por nombre, como las tablas del explorador o las filas `#` de la búsqueda rápida, sigue ordenada por nombre en todas las vistas, nunca por nombre lógico.

Los lugares que siguen la vista:

- En la pestaña Visualización, las tarjetas de Flow —consulta [Nombres en las tarjetas](./visualization.md#names-on-the-cards)— y las etiquetas de Graph y su vista previa al pasar el puntero; consulta [Cómo leer el grafo](./visualization.md#reading-the-graph) y [Vista previa al pasar el puntero](./visualization.md#hover-preview).
- El panel [Propiedades de la tabla](./table-related-functions.md#table-properties): sus chips y, en la pestaña `Indexes`, las filas `Columns` y la lista `Index order`; consulta [Índices](./table-related-functions.md#indexes).
- Las filas de tabla y de columna del [explorador](./explorer.md#the-tree) y las tablas que aparecen bajo cada grupo de tablas.
- Las filas `#` de la búsqueda rápida; consulta [Buscar en el diagrama](./quick-search.md#searching-the-diagram).
- El árbol de cambios del [visor de diferencias](./table-related-functions.md#diff-viewer) y sus dos lados.
- [Asignar columnas](./relationship-editing.md#map-columns) y la descripción emergente `<parent> has no primary key to copy` que puede mostrar `Create new columns` mientras se dibuja una relación; consulta [Creación de relaciones](./editing-start.md#relationship-creation).
- La copia de las filas que lleva el arrastre de una columna sobre el lienzo vacío, que muestra las celdas del nombre y del tipo de cada fila tal como las dibuja la fila; consulta [Reordenar y mover columnas](./table-editing.md#rearranging-and-moving-columns).
- La columna `Target` de la hoja `Checks` de la pestaña Diccionario; consulta [La hoja Comprobaciones](./dictionary.md#the-checks-sheet).
- Una [imagen exportada](./file-import-export.md#image).

Unos pocos lugares conservan los nombres sea cual sea la vista: las filas de índice y de clave externa del explorador, las `Keys` de la pestaña `Indexes` del panel Propiedades de la tabla, el `New column: <name>` de Asignar columnas y la ubicación escrita junto a una fila `@` o `:` de la búsqueda rápida.

El visor de diferencias, el [viaje en el tiempo](./undo-redo.md#time-travel), la vista previa `Force` de la [disposición automática](./table-related-functions.md#auto-layout) y el cuadro de diálogo `Export image` se abren en la vista de nombres que estás viendo, sea cual sea la vista que guarda el archivo. Cada uno conserva esa vista mientras está abierto.  
Toda disposición automática, y todo `Import` o `Import and Add` de Esquema SQL, GraphQL, DBML o AML, colocan las tablas con el ancho que tienen en tu vista.

## Buscar por nombre lógico {#finding-by-logical-name}

Los nombres lógicos se encuentran en todas las vistas de nombres, incluida `Physical Names`, en la que el lienzo no dibuja ninguno:

- [Buscar y reemplazar](./find-and-replace.md#what-it-searches) los busca como un tipo de texto, `Logical names`, tanto en tablas como en columnas, y está activado cuando se abre la búsqueda por primera vez. Reemplazar un nombre lógico deriva de él el nombre físico, como al escribirlo.
- En la [búsqueda rápida](./quick-search.md#searching-the-diagram), `#` encuentra una tabla por su nombre o por su nombre lógico, y `@` encuentra una columna por cualquiera de los dos; una coincidencia en el nombre lógico muestra `Logical name` a su lado. La parte de la tabla de `@`, antes del `.`, también coincide con el nombre o el nombre lógico de una tabla.

Cambiar la vista de nombres cambia cómo se nombran los resultados, nunca lo que se encuentra.

## Colaboradores {#collaborators}

En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), los nombres lógicos y los vínculos con dominios llegan a todos los editores como cualquier otra edición.  
Mientras el bloqueo `Name View` está activado, cada editor conserva una vista propia, y un cambio de vista solo se ve en el editor que lo hace. Mientras está desactivado, un cambio de vista en cualquier editor que no sea de solo lectura cambia la vista de todos los editores; consulta [Bloqueo](./settings.md#lock), que también explica qué le hace a la vista de cada editor activar o desactivar el bloqueo.  
Cuando tu vista no dibuja la celda con el foco de un participante, su color se muestra en la celda que tu vista dibuja en su lugar: una celda del nombre en `Physical Names` se muestra en tu celda del nombre lógico en `Logical Names`, y viceversa, y una celda del tipo y el dominio que ocupa su lugar se corresponden del mismo modo.

Un agente de programación que trabaja a través del servidor MCP establece nombres lógicos y vincula dominios sea cual sea la vista que estás viendo, y no tiene ninguna herramienta que cambie la vista de nombres; consulta [Diccionarios](../../mcp/tools.md#dictionaries) y [Ajustes](../../mcp/tools.md#settings).

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly) funcionan todos los selectores de la vista de nombres: el botón `Name View` de la barra de herramientas del lienzo, `Name View` en el menú contextual del lienzo y en la búsqueda rápida, y la lista de la barra de herramientas de Flow.  
Un cambio ahí solo cambia esa pantalla, sea cual sea el bloqueo: el archivo, los colaboradores y el historial de deshacer conservan la vista como estaba. Cuando el editor vuelve a ser editable, la vista elegida se queda en esa pantalla hasta el siguiente cambio allí o, mientras el bloqueo está desactivado, hasta que un colaborador la cambia o se vuelve a cargar el documento.  
Ahí no se pueden editar los nombres lógicos ni los dominios, así que no se abre ningún editor de celda, ninguna lista de términos ni ningún selector de dominios, y no se ofrece ninguna de las opciones `Derive Physical Name Again` y `Derive Physical Names Again`.  
Opciones de vista → `Domain` muestra u oculta la celda Dominio solo en esa pantalla, como hace allí toda [opción de vista](./table-related-functions.md#table-view-options), y cuando el editor vuelve a ser editable se restablecen las opciones de vista que contiene el documento.
