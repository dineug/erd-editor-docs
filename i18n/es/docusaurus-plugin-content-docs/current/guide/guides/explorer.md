---
sidebar_position: 8
description: Explora las tablas del diagrama con sus columnas, índices y claves externas, sus grupos de tablas y sus notas en un árbol acoplado junto al lienzo ERD, y ve a cualquiera de ellos con un clic.
---

# Explorador

El explorador es un panel acoplado al borde izquierdo del lienzo ERD que presenta el diagrama en forma de árbol: sus tablas, cada una con sus columnas, índices y claves externas, luego sus [grupos de tablas](./table-groups.md) y luego sus notas. Haz clic en una fila para ir a lo que representa en el lienzo.  
El explorador estrecha el lienzo en lugar de taparlo. Forma parte del editor de diagramas; no es la vista Explorer de VS Code ni el explorador de archivos de Obsidian.

![Abrir el explorador desde la barra de herramientas, ir a products y luego a la columna status y a la clave externa member_id de orders, contraer con Collapse All, ensanchar el panel y cerrarlo](/img/demo-explorer.webp)

[Buscar y reemplazar](./find-and-replace.md) está en su parte superior, entre su barra de título y el árbol. Mientras el campo Buscar contiene texto, el árbol muestra solo lo que coincide; consulta [Los resultados](./find-and-replace.md#the-results).  
El árbol en sí nunca cambia el diagrama: no ofrece cambiar el nombre, arrastrar, eliminar ni mostrar u ocultar. Un reemplazo es la única edición que hace el panel.

El estado propio del explorador es solo tuyo: si está abierto, su ancho, lo que tiene contraído, la fila en la que está el teclado, hasta dónde se ha desplazado y la búsqueda.  
Nada de ello se guarda en el archivo, se registra en el historial de deshacer, se comparte con los colaboradores ni se almacena en el navegador. Se conserva mientras el editor sigue abierto, al cambiar de pestaña y entre los documentos que se cargan en el mismo editor. Un editor recién abierto empieza con el explorador cerrado.

## Abrir y cerrar {#opening-and-closing}

Ábrelo de cualquiera de estas formas:

- El botón `Explorer` de la barra de herramientas, justo después de `Search`, con un icono de árbol. Su descripción emergente indica `Explorer (Ctrl + F)` (Windows/Linux) o `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), denominado `Toggle Explorer` en la pestaña [Atajos de teclado](./settings.md#shortcuts) de Configuración.
- `Toggle Explorer` en la [búsqueda rápida](./quick-search.md), disponible en todas las pestañas. Escribir `find`, `replace`, `rename`, `tree`, `outline` u `objects` lo hace aparecer.
- `Toggle Explorer` en el menú contextual del lienzo: haz clic con el botón derecho en un espacio vacío del lienzo ERD, fuera de cualquier [grupo de tablas](./table-groups.md). Está después de `New Table`, `New Memo` y `New Table Group`, y antes de `Relationship`.

Las dos opciones `Toggle Explorer` muestran el atajo a la derecha.  
El botón de la barra de herramientas, el atajo y la entrada de la búsqueda rápida funcionan desde cualquier pestaña. Desde las pestañas Visualización, Esquema SQL, Generador de código o Configuración, primero cambian a la pestaña ERD, ya que el explorador solo se muestra allí.

El botón de la barra de herramientas solo abre y cierra el panel. No pone el cursor de texto en el campo Buscar y deja abiertos el panel Propiedades de la tabla, el generador de temas y el selector `Display Language`.  
El atajo y las dos opciones `Toggle Explorer` abren el explorador en su búsqueda: el cursor de texto va al campo Buscar con su texto seleccionado, y se cierra cualquiera de los cinco cuadros de diálogo de [Cuadros de diálogo a su lado](#dialogs-beside-it). Lo que la búsqueda conserva entre una apertura y otra se explica en [Abrir y cerrar](./find-and-replace.md#opening-and-closing) de Buscar y reemplazar.  
El atajo no hace nada mientras se edita una celda de una tabla, una nota o el nombre de un grupo de tablas.

El botón de la barra de herramientas aparece pulsado mientras el explorador está abierto en la pestaña ERD y no lo oculta el [modo zen](#when-it-stands-aside). Mientras es así, el botón, el atajo y cualquiera de las dos opciones `Toggle Explorer` cierran el explorador, y el teclado, si estaba en el panel, vuelve al editor.  
El atajo nunca lo cierra mientras está abierta la búsqueda rápida o uno de los cinco cuadros de diálogo. En su lugar, cierra la paleta o el cuadro de diálogo y lleva el teclado al campo Buscar, con su texto seleccionado y, si el explorador ya se mostraba, con la coincidencia actual intacta. La entrada `Toggle Explorer` de la búsqueda rápida no hace esa excepción: al ejecutarla se cierra la paleta y, después, un explorador abierto.

El botón `x` de la barra de título, cuya descripción emergente indica `Close`, también cierra el explorador y da el teclado al lienzo. `Escape` no lo cierra; consulta [Teclas en el explorador](#keys-in-the-explorer).  
Al volver a abrirse, el explorador recupera el mismo ancho, las mismas filas contraídas, el mismo desplazamiento del árbol y la misma consulta. Si se abre con el atajo o con una opción `Toggle Explorer`, vuelve a buscar esa consulta con todos los resultados expandidos; consulta [Los resultados](./find-and-replace.md#the-results).

Cuando el atajo o una opción `Toggle Explorer` abre el explorador en un editor demasiado estrecho para él, una notificación indica `Widen the window to show the Explorer` y el teclado se queda donde estaba; consulta [Junto al lienzo](#beside-the-canvas).  
Aun así, el explorador queda abierto, con el botón de la barra de herramientas pulsado, y aparece, con la búsqueda ya hecha, en cuanto el editor es lo bastante ancho, sin tomar el teclado. Abrirlo con el botón de la barra de herramientas no muestra ninguna notificación.

## Junto al lienzo {#beside-the-canvas}

El explorador se extiende a lo largo del borde izquierdo de la pestaña ERD, bajo la barra de herramientas, en toda la altura del lienzo.  
El lienzo se estrecha para dejarle sitio, así que ninguna parte del diagrama queda bajo el panel, y la [barra de herramientas del lienzo](./table-related-functions.md#canvas-toolbar), el minimapa y la [pantalla de bienvenida](./editing-start.md#welcome-screen) se sitúan en el lienzo, a su lado.  
Abrir, cerrar o cambiar el tamaño del explorador no desplaza el diagrama ni registra nada en el [historial de deshacer](./undo-redo.md#what-the-history-records).

Empieza con `260px` de ancho en un editor recién abierto. Arrastra su borde derecho para fijarlo en cualquier valor entre `200px` y `480px`, o haz doble clic en el borde para volver a `260px`.

El lienzo siempre conserva al menos `320px` junto al explorador:

- En un editor más estrecho que el ancho del explorador más `320px`, el explorador se dibuja más estrecho para caber, hasta un mínimo de `200px`.
- En un editor de menos de `520px` de ancho, se aparta. No se dibuja, pero sigue abierto, así que el botón de la barra de herramientas sigue apareciendo pulsado y una pulsación lo cierra. En cuanto el editor es lo bastante ancho, vuelve con su propio ancho.

Lo que cuenta es el ancho del propio editor, no el de la ventana del navegador, aunque la notificación de [Abrir y cerrar](#opening-and-closing) hable de la ventana.

En un [idioma de la interfaz de derecha a izquierda](./language-and-theme.md#right-to-left-languages), el explorador se queda a la izquierda del lienzo, ya que el lienzo nunca se refleja.  
Su contenido se lee de derecha a izquierda: la barra de título, la búsqueda y las filas se reflejan, y las filas se sangran desde la derecha. El borde que se arrastra sigue en su lado derecho, contra el lienzo. Los tipos de datos, las columnas de los índices y el texto de las claves externas mantienen su orden de izquierda a derecha.

## Cuándo se aparta {#when-it-stands-aside}

El explorador solo se muestra en la pestaña ERD.  
Al cambiar a otra pestaña se oculta, y el botón de la barra de herramientas deja de aparecer pulsado. De vuelta en la pestaña ERD, se muestra de nuevo tal como lo dejaste, con las mismas filas contraídas y el mismo desplazamiento.

Mientras está abierto el [visor de diferencias](./table-related-functions.md#diff-viewer), el [viaje en el tiempo](./undo-redo.md#time-travel) o la vista previa de la [disposición automática](./table-related-functions.md#auto-layout), nada abre ni cierra el explorador:

- Un explorador abierto se oculta y vuelve a mostrarse cuando se cierran.
- El botón de la barra de herramientas aparece atenuado y no hace nada.
- La búsqueda rápida omite `Toggle Explorer`.
- El atajo queda en manos del navegador o del host; consulta [La barra de búsqueda del navegador](./find-and-replace.md#the-browsers-find-bar).

El visor de diferencias enumera sus cambios en un árbol del mismo tipo; consulta [Visor de diferencias](./table-related-functions.md#diff-viewer).

Activar el [modo zen](./table-related-functions.md#canvas-toolbar) con `Alt + Z` (Windows/Linux) o `⌥ + Z` (Mac) oculta un explorador abierto sin cerrarlo, y al desactivar el modo zen el explorador vuelve.  
En el modo zen, el atajo y las dos opciones `Toggle Explorer` siguen abriendo el explorador en su búsqueda, y el modo zen sigue activado. El explorador ocupa entonces toda la altura del editor, ya que la barra de herramientas superior desaparece, y sigue mostrándose al desactivar el modo zen. Al volver a activar el modo zen, se oculta de nuevo.

Siempre que el panel desaparece con el teclado dentro, ya sea porque se cierra, se oculta o se aparta, el teclado vuelve al editor.

## El árbol {#the-tree}

La barra de título muestra `Explorer` y contiene dos botones: `Collapse All` y la `x` que cierra el explorador. Debajo está la búsqueda —consulta [Buscar y reemplazar](./find-and-replace.md)— y, debajo de ella, el árbol.

El nivel superior contiene tres carpetas, en este orden: `Tables`, `Table Groups` y `Memos`. Bajo cada tabla están sus propias carpetas `Columns`, `Indexes` y `Foreign Keys`.  
Una carpeta vacía no se muestra, así que un diagrama vacío no muestra ninguna fila. `Table Groups` también se omite mientras [Opciones de vista](./table-related-functions.md#table-view-options) → `Table Groups` oculta los grupos, y `Memos`, mientras Opciones de vista → `Memos` oculta las notas.  
Una fila de carpeta muestra un icono de carpeta, su nombre y, al final de la fila, el número de filas que tiene directamente debajo, así que el número junto a `Tables` es el número de tablas del diagrama.

Las tablas se ordenan por nombre, sin distinguir mayúsculas y minúsculas, y las tablas con el mismo nombre mantienen el orden del documento. Los grupos de tablas se ordenan del mismo modo, igual que las tablas de cada grupo. Las columnas de una tabla mantienen el orden de la propia tabla, y sus índices, sus claves externas y las notas, el del documento.  
El árbol sigue al diagrama a medida que cambia, ya sea por una edición en el lienzo, un deshacer o rehacer, una importación, un colaborador o un agente de programación, así que al cambiar el nombre de una tabla su fila se mueve.

Cada tipo de fila muestra:

- Una tabla: un icono de tabla y su nombre.
- Una columna: un icono de llave para una columna de clave principal o de clave externa, con el color que usa la celda de clave de la propia tabla para una clave principal, una clave externa o ambas, y un icono de lista para cualquier otra columna. Después, su nombre y, atenuado, su tipo de datos seguido de `PK`, `FK` o ambos, como `id` `BIGINT PK` o `user_id` `BIGINT FK`.
- Un índice: un icono de índice y su nombre. Después, atenuado, `UNIQUE` para un índice único y sus columnas entre paréntesis en el orden del índice, con `DESC` tras una columna descendente, como `orders_user_idx` `UNIQUE (user_id DESC, total)`, o solo `(total)`.
- Una clave externa: solo aparece bajo la tabla hija, la que contiene las columnas de clave externa, y solo mientras la tabla padre está en el diagrama. Su icono de llave toma el color del conector: el color de clave principal y clave externa para una [relación identificadora](./relationship-editing.md#identifying-relationships) y, en caso contrario, el color de clave externa. Muestra las columnas de clave de la tabla hija, separadas por comas, y después, atenuado, `→` con la tabla padre y sus columnas, como `user_id` `→ users(id)`.
- Un grupo de tablas: un punto con el color del grupo, gris para un grupo sin color, y su nombre. Sus tablas aparecen debajo por nombre, y cada una lleva a su tabla. Un grupo sin tablas no tiene nada que expandir.
- Una nota: un icono de nota adhesiva y la primera línea de la nota.

Un nombre en blanco, o una nota cuya primera línea está en blanco, se muestra como `unnamed` en cursiva.  
En un panel estrecho, el texto atenuado se recorta con `…` antes que el nombre. Pasa el puntero por encima de un nombre o de su texto atenuado para verlo completo.

Al principio solo está expandida la carpeta `Tables`. Haz clic en una fila de carpeta, o pulsa `Enter` o `Space` sobre ella, para contraerla o expandirla.  
La flecha al principio de una fila contrae o expande esa fila sin ir a ninguna parte. Todas las filas de tabla tienen una, incluso las de una tabla sin nada debajo. `→` y `←` también contraen y expanden; consulta [Teclas en el explorador](#keys-in-the-explorer).  
`Collapse All` contrae un nivel en cada pulsación: el nivel más profundo de filas expandidas a la vista, de modo que las pulsaciones contraen de abajo arriba. La pulsación que llega al nivel superior contrae todas las filas, incluidas las que están bajo una fila ya contraída, y deja solo las carpetas del nivel superior.  
Las ediciones, deshacer y rehacer, y los cambios de colaboradores o de un agente de programación dejan como están las filas contraídas y expandidas.

## Ir a una fila {#going-to-a-row}

Haz clic en una fila, o pulsa `Enter` o `Space` con el teclado sobre ella, para ir a lo que representa en el lienzo ERD. Una fila de carpeta solo se contrae o se expande, y las teclas de flecha solo permiten moverse dentro del árbol.

- Una fila de tabla, o una tabla que aparece bajo un grupo, selecciona solo esa tabla y la trae al frente. La celda con el foco pasa al nombre de la tabla, salvo que ya esté en esa tabla.
- Una fila de columna selecciona solo su tabla y pone la celda con el foco en el nombre de la columna.
- Una fila de índice selecciona su tabla, como una fila de tabla. El índice en sí no se destaca; los índices se editan en el panel [Propiedades de la tabla](./table-related-functions.md#indexes).
- Una fila de clave externa hace visibles a la vez las dos tablas de la relación, o la tabla hija cuando las dos están demasiado lejos para mostrarse juntas. Selecciona solo la tabla hija con sus columnas de clave externa, con la celda con el foco en la primera de ellas, e ilumina el conector de la relación; consulta [Cómo leer un conector](./relationship-editing.md#reading-a-connector).
- Una fila de grupo de tablas hace visible el recuadro del grupo tomando como referencia su barra de título, selecciona solo el grupo y lo trae al frente con sus tablas.
- Una fila de nota selecciona solo la nota y la trae al frente.

La vista se mueve según la regla común a todos los saltos: el zoom nunca cambia, y el lienzo solo se desplaza cuando aquello a lo que vas no se ve ya bien; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands).  
Ir a una fila cierra antes el panel Propiedades de la tabla si está abierto, y nunca inicia ni termina una relación que se esté dibujando.  
Mientras el campo Buscar contiene texto, una fila cuyo propio nombre contiene una coincidencia, o una que muestra un fragmento de un comentario o de una nota, va a esa coincidencia en su lugar; consulta [Ir a una coincidencia](./find-and-replace.md#going-to-a-match).

Tras un clic, el teclado se queda en el árbol, así que `Delete`, `Backspace` y las demás teclas de edición no llegan a la nueva selección hasta que pulsas `Escape` o haces clic en el lienzo; consulta [Teclas en el explorador](#keys-in-the-explorer).

## Teclas en el explorador {#keys-in-the-explorer}

El árbol es una sola parada de `Tab`, que se omite mientras no tiene filas.  
Al entrar en él con `Tab`, el foco cae en la fila en la que estuvo el teclado por última vez o, en su defecto, en la fila de la coincidencia actual o en la primera fila completamente visible, y esa fila se desplaza hasta quedar a la vista. La fila del teclado se dibuja como una fila bajo el puntero.

En el árbol:

- `↑` y `↓` pasan a la fila anterior o siguiente, y se detienen en la primera y en la última fila en lugar de dar la vuelta. `Home` y `End` van a la primera y a la última fila.
- `→` expande una fila contraída, o pasa a la primera fila hija de una fila expandida. `←` contrae una fila expandida, o sale a su fila padre. En un idioma de la interfaz de derecha a izquierda, las dos se intercambian.
- `Enter` y `Space` actúan como un clic: van a la fila, o contraen o expanden una carpeta; consulta [Ir a una fila](#going-to-a-row).
- Escribir una letra no salta a ninguna fila.

`Escape`, pulsado en cualquier parte del explorador, ya sea en el árbol, en el campo Buscar o Reemplazar o en uno de sus botones, devuelve el teclado al lienzo. El explorador sigue abierto y la selección queda como está.  
Un `Escape` que termina una composición del método de entrada solo termina la composición. `Escape` nunca cierra el explorador, tanto si se pulsa en él como en el lienzo.

Algunos atajos del editor siguen funcionando mientras el teclado está en el explorador; consulta [Atajos de teclado](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) funciona como en el lienzo: cierra el explorador o, mientras el panel Propiedades de la tabla está abierto a su lado, cierra el panel Propiedades de la tabla y pone el cursor de texto en el campo Buscar; consulta [Abrir y cerrar](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) muestra u oculta la búsqueda rápida.
- `Undo` y `Redo` deshacen y rehacen en el diagrama en lugar de en el texto de un campo.
- `Zoom In`, `Zoom Out` y `Zoom Reset` aplican el zoom al lienzo.

Todos los demás atajos del editor se quedan en el explorador, igual que las teclas de flecha, `Tab`, `Enter`, `Space`, `Home`, `End` y cualquier tecla pulsada mientras un método de entrada está componiendo.  
Ninguno de ellos llega al lienzo: `Delete` y `Backspace` nunca eliminan la selección, `Alt + N` (Windows/Linux) o `⌥ + N` (Mac) no añade ninguna tabla, y `T` y luego `G` no agrupa nada. En un campo actúan como teclas de texto normales: `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) selecciona el texto del campo, `Delete` y `Backspace` borran texto, y `Space` escribe un espacio. `Tab` se mueve entre los botones, los campos y el árbol del explorador.  
Las teclas de los propios campos Buscar y Reemplazar se explican en [Teclas en los campos de búsqueda](./find-and-replace.md#keys-in-the-search-fields).  
Las teclas que el editor no asigna, como las del guardado o de la paleta de comandos propios del host, llegan al host como siempre.

## Cuadros de diálogo a su lado {#dialogs-beside-it}

El panel [Propiedades de la tabla](./table-related-functions.md#table-properties), el [generador de temas](./language-and-theme.md#theme), el selector [`Display Language`](./language-and-theme.md#picking-a-language), el cuadro de diálogo [`Export image`](./file-import-export.md#image) y el de [Asignar columnas](./relationship-editing.md#map-columns) dejan abierto el explorador al abrirse.

- El panel Propiedades de la tabla se abre en el centro del lienzo, junto al explorador, y solo atenúa el lienzo. El explorador sigue siendo utilizable: elegir una fila cierra el panel Propiedades de la tabla y después va a la fila.
- `Export image` y Asignar columnas atenúan todo el editor, incluidos la barra de herramientas y el explorador. El explorador sigue abierto bajo la zona atenuada, y un clic allí cierra el cuadro de diálogo, como un clic en cualquier parte de la zona atenuada; Asignar columnas se cierra entonces sin asignar nada.
- En un idioma de la interfaz de izquierda a derecha, el generador de temas y el selector `Display Language` se abren justo a continuación del explorador en lugar de encima de él, y se desplazan con él si este se abre o se cierra mientras están visibles. En un idioma de derecha a izquierda conservan su lugar a la derecha. Una pulsación en el explorador los cierra, como cualquier pulsación fuera de ellos que no sea en la barra de herramientas.

Abrir la búsqueda con el atajo o con una opción `Toggle Explorer` cierra los cinco; Asignar columnas, sin asignar nada.  
La [búsqueda rápida](./quick-search.md) también deja abierto el explorador, y `Escape` cierra entonces solo la paleta.

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly), el explorador funciona como en cualquier otro: el botón de la barra de herramientas con la misma descripción emergente, el atajo, las dos opciones `Toggle Explorer`, el árbol, contraer y expandir, `Collapse All` e ir a una fila, que selecciona como siempre aquello a lo que va. Su título también muestra `Explorer` en ese caso.  
Su búsqueda solo encuentra; consulta [Editores de solo lectura](./find-and-replace.md#read-only-editors) de Buscar y reemplazar.
