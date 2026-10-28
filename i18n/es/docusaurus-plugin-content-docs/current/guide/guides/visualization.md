---
sidebar_position: 11
description: "Explora el esquema en modo Graph, como un grafo dirigido por fuerzas, o en modo Flow, como tarjetas de tabla: haz zoom y desplaza la vista, ilumina las tablas relacionadas con una tabla, céntrate en unas pocas tablas a la vez y retrocede paso a paso por los centrados anteriores."
---

# Visualización

Muestra todo el documento de un vistazo, en uno de dos modos:

- `Graph`, un grafo dirigido por fuerzas de todas las tablas, sus columnas y las relaciones entre ellas; consulta [Modo Graph](#graph-mode).
- `Flow`, cada tabla dibujada como una tarjeta y dispuesta siguiendo sus relaciones; consulta [Modo Flow](#flow-mode).

Ábrela desde la pestaña `Visualization` de la barra de herramientas superior, o desde la [búsqueda rápida](./quick-search.md), en `Tab`.  
Desde la pestaña ERD, `Alt + F` (Windows/Linux) o `⌥ + F` (Mac) y la opción `Focus on this table` del menú contextual de la tabla la abren directamente en `Flow`, acotada a las tablas que hayas elegido y a las que están a una relación de distancia; consulta [Centrarse en tablas](#focusing-on-tables).

Cambia de modo con los botones `Graph` y `Flow` del extremo izquierdo de la [barra de herramientas](#toolbar).  
Un editor recién abierto empieza en `Graph`. El modo que elijas se mantiene mientras el editor está abierto, aunque visites otras pestañas, pero no se guarda en el documento.

## Barra de herramientas {#toolbar}

Una barra de herramientas flota sobre el centro del borde inferior de la pestaña. De izquierda a derecha:

- `Graph` y `Flow`, con el modo actual resaltado.
- `Previous table` y `Next table`, solo en `Flow`: una flecha hacia la izquierda y una flecha hacia la derecha que retroceden y avanzan por las tablas a las que se ha acotado Flow; consulta [Tabla anterior y tabla siguiente](#previous-table-and-next-table). Cada una aparece atenuada mientras no hay nada a lo que ir en ese sentido.
- `Zoom out`, el zoom actual como porcentaje, por ejemplo `100%`, y `Zoom in`. Cada pulsación cambia el zoom en 4 puntos porcentuales y mantiene el centro de la pantalla donde está. El porcentaje muestra el zoom del modo en el que estás, y al hacer clic en él ese zoom vuelve al `100%`.
- `Fit`, que deja a la vista todo lo que muestra el modo: todos los nodos en `Graph`, todas las tarjetas en `Flow`.
- `Tidy Up`, solo en `Flow`, que vuelve a disponer las tarjetas; consulta [Cómo coloca Flow las tarjetas](#how-flow-is-placed).
- El menú de vista de filas, solo en `Flow`, cuya etiqueta es la opción actual; consulta [Vista de filas](#row-display).
- La lista `Name View`, solo en `Flow`, cuya etiqueta es la vista vigente; consulta [Nombres en las tarjetas](#names-on-the-cards).
- `Show all`, solo en `Flow` y solo mientras la vista está acotada, que vuelve a todo el diagrama; consulta [Centrarse en tablas](#focusing-on-tables).
- La brújula `Go to content`, que se añade al final de la barra de herramientas solo mientras no hay ningún nodo ni ninguna tarjeta en pantalla. Muestra una flecha que apunta al elemento más cercano, sea un nodo o una tarjeta, y a qué distancia está, por ejemplo `1.2k`. Haz clic en ella para centrar ese nodo o esa tarjeta sin cambiar el zoom.

Los botones de zoom y las dos flechas indican sus atajos de teclado en sus descripciones emergentes, por ejemplo `Zoom in (Ctrl + Plus)` (Windows/Linux) o `Zoom in (⌘ + Plus)` (Mac), y `Previous table (Ctrl + Z)` (Windows/Linux) o `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` y `Ctrl + Minus` (Windows/Linux) o `⌘ + Plus` y `⌘ + Minus` (Mac) cambian el zoom por pasos como los botones, en cualquiera de los dos modos, y `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac) vuelve directamente al `100%`. En `Flow`, `Ctrl + Z` y `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Z` y `⌘ + Shift + Z` (Mac) retroceden y avanzan por pasos como las dos flechas.  
Hacer clic en el porcentaje equivale a `Ctrl + 0` (Windows/Linux) o `⌘ + 0` (Mac), y su descripción emergente indica ese atajo. Los atajos no hacen nada mientras la búsqueda rápida está abierta.

## Modo Graph {#graph-mode}

Dibuja todo el documento como un grafo dirigido por fuerzas, para que veas de un vistazo cómo se relacionan las tablas entre sí y cuáles ocupan el centro de un dominio.

![Abrir el modo Graph, pasar el puntero por encima de una tabla para ver su vista previa, arrastrar un nodo y alejar y volver a acercar](/img/demo-visualization.webp)

### Cómo leer el grafo {#reading-the-graph}

Cada tabla y cada columna es un nodo, y los dos tipos se dibujan en colores distintos. Las notas y los [grupos de tablas](./table-groups.md) no se dibujan.  
Cada nodo de columna está enlazado con la tabla a la que pertenece, y dos tablas unidas por una relación están enlazadas entre sí.  
Las tablas unidas por más de una relación en el mismo sentido se enlazan una sola vez, y una relación que empieza y termina en la misma tabla no dibuja ningún enlace.

Los nombres de las tablas aparecen en el grafo a medida que acercas la vista, de forma gradual entre el `50%` y el `100%`, y un nombre de más de 15 caracteres se recorta. Los nodos de columna no llevan etiqueta con ningún nivel de zoom.  
Las etiquetas siguen la vista de nombres; consulta [Más allá del lienzo](./logical-names.md#beyond-the-canvas). En `Both Names`, una etiqueta pone el nombre lógico en una línea y el nombre en la línea de debajo, y cada línea se recorta por separado.

### Moverse por el grafo {#getting-around-the-graph}

La rueda hace zoom, con centro en lo que haya bajo el puntero, del `10%` al `400%`.  
Pellizcar en el panel táctil hace zoom de la misma forma, y dos dedos en una pantalla táctil hacen zoom con centro en el punto que hay entre ellos y desplazan la vista al moverse.  
Arrastra el fondo para desplazar la vista, o arrastra con el botón central del ratón desde cualquier parte, incluido un nodo, como en el [lienzo ERD](./table-related-functions.md#getting-around-the-canvas). Un arrastre con el botón central solo desplaza la vista: nunca tira de un nodo.

Los botones de zoom de la [barra de herramientas](#toolbar) y los atajos de zoom, en cambio, mantienen fijo el centro de la pantalla, dentro del mismo intervalo, y `Fit` deja a la vista todos los nodos.

### Vista previa al pasar el puntero {#hover-preview}

Pasa el puntero por encima de un nodo de tabla para ver una vista previa de esa tabla junto al cursor.  
Al pasar el puntero por encima de un nodo de columna solo se dibuja un anillo a su alrededor; no se abre ninguna vista previa.

La vista previa muestra las mismas columnas y celdas que el lienzo ERD, en el mismo orden, y las nombra como lo hace el lienzo en la vista de nombres en la que estás; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options), [Ajustar el orden de las columnas](./settings.md#adjusting-column-order) y [Vista de nombres](./logical-names.md#name-view).  
Con la opción de vista `Alternate Key` activada, cada columna de una [clave alternativa](./table-related-functions.md#alternate-keys) lleva su marca, como `AK1.1`, al final de su fila, y la vista previa se ensancha para mostrarla, igual que la tabla en el lienzo ERD.  
A diferencia de una tabla en el lienzo ERD, su encabezado nunca toma el color del [grupo](./table-groups.md#coloring-a-group) de la tabla, y sus nombres nunca llevan las [marcas](./dictionary.md#marks-on-the-canvas) que las comprobaciones del diccionario ponen en el lienzo.  
Es solo de visualización y se oculta mientras arrastras un nodo o desplazas la vista.

### Resaltar la vecindad {#highlighting-a-neighbourhood}

Al pasar el puntero por encima de una tabla también se ilumina su vecindad: la propia tabla, sus propias columnas, las tablas que sus relaciones unen en cualquiera de los dos sentidos y los enlaces entre ellas.  
Todo lo demás del grafo se atenúa, de modo que lo que toca la tabla se distingue por sí solo.

### Mover nodos {#moving-nodes}

Arrastra un nodo con el botón izquierdo del ratón para llevarlo, junto con todo lo que está enlazado a él, a una nueva posición.  
El nodo queda fijado bajo el puntero mientras lo mantienes pulsado, y la disposición se reactiva a su alrededor.  
Se vuelve a estabilizar cuando lo sueltas; nada queda fijado donde lo soltaste.  
Una pulsación o un arrastre con el botón derecho sobre un nodo ni tira de él ni desplaza la vista.

### El grafo es una instantánea {#the-graph-is-a-snapshot}

El grafo se construye a partir del documento tal como está en el momento en que abres esta pestaña, y se reconstruye desde cero cada vez que vuelves a ella.  
Cambiar a `Graph` desde `Flow` también lo reconstruye, y cada reconstrucción vuelve a empezar al `100%`.

## Modo Flow {#flow-mode}

Dibuja cada tabla como una tarjeta y dispone las tarjetas siguiendo sus relaciones. Las notas y los [grupos de tablas](./table-groups.md) no se dibujan.  
No se trata de la disposición `Flow` de la [disposición automática](./table-related-functions.md#auto-layout), que mueve las propias tablas de la pestaña ERD.

Cada tarjeta se dibuja como una tabla en la pestaña ERD: el color de la tabla a lo largo de su borde izquierdo, una franja de encabezado con un icono de tabla y los nombres de la tabla tal como los muestra la [vista de nombres](#names-on-the-cards), y después las filas que pide su [vista de filas](#row-display). A diferencia de una tabla en la pestaña ERD, una tarjeta también dibuja una línea entre sus filas, y su encabezado nunca toma el color del [grupo](./table-groups.md#coloring-a-group) de la tabla. Las tarjetas mantienen ese aspecto con cualquier nivel de zoom y nunca se reducen a su nombre como hacen las tablas en la pestaña ERD al `70%` o menos. No se puede editar nada de una tarjeta.

Un conector es una sola curva suave de tabla a tabla, dibujada por debajo de las tarjetas, por lo que puede pasar por detrás de una. Una relación de una tabla consigo misma se curva alrededor de la esquina superior derecha de la tarjeta, como en la pestaña ERD; consulta [Trazado de los conectores](./relationship-editing.md#connector-routing). Todos los conectores se dibujan con la misma línea continua gris, sea la relación identificadora o no, con las mismas marcas de extremo que en la pestaña ERD; consulta [Cómo leer un conector](./relationship-editing.md#reading-a-connector). Flow dibuja los conectores incluso cuando la [opción de vista](./table-related-functions.md#table-view-options) `Relationship` está desactivada. Nunca dibuja las etiquetas `D:` y `U:` de las acciones ON DELETE y ON UPDATE de una relación ni muestra la descripción emergente que las detalla, diga lo que diga la opción de vista `Referential Actions`.

En el diagrama completo, las tablas que ninguna relación une a otra tabla se reúnen en un solo bloque en lugar de dispersarse entre las demás.

![Cambiar a Flow, pasar el puntero por encima de orders para iluminarla junto con sus vecinas, fijar la iluminación, elegir Keys only y después acercar con ⌘ + Wheel y pulsar Fit](/img/demo-visualization-flow.webp)

### Vista de filas {#row-display}

El menú de vista de filas de la [barra de herramientas](#toolbar) determina cuánto se dibuja de cada tarjeta. Su etiqueta es la opción actual, y su descripción emergente indica, por ejemplo, `Row display: Name only`.  
El menú se abre encima de la barra de herramientas con una marca de verificación junto a la opción actual. Se cierra cuando eliges una, vuelves a hacer clic en la etiqueta, haces clic en cualquier otra parte del editor, pulsas `Escape` o cambias a `Graph`.

| Vista de filas | Qué muestra cada tarjeta |
| --- | --- |
| `Name only` | Solo el encabezado. |
| `Keys only` | Las columnas de clave principal y de clave externa, además de cualquier otra columna en la que termine una relación. |
| `All fields` | Todas las columnas. |

Las filas se enumeran en el orden de las columnas de la tabla. Cada fila muestra el nombre de la columna, con un icono de llave delante cuando la columna es clave principal, clave externa o ambas, y el tipo de datos a la derecha, esté o no [iluminada](#lighting-related-tables) la tarjeta. La [vista de nombres](#names-on-the-cards) decide qué nombres muestra una fila y si muestra el dominio de la columna.  
No se dibuja ninguna otra celda ni marca de clave alternativa, y ni [Opciones de vista de tabla](./table-related-functions.md#table-view-options) ni [Ajustar el orden de las columnas](./settings.md#adjusting-column-order), que ordena las celdas dentro de una fila, se aplican a las tarjetas.

La primera vez que se abre Flow, empieza en `Name only`, o en `Keys only` si se abrió al [centrarse en tablas](#focusing-on-tables). A partir de ahí, la vista de filas solo cambia cuando eliges otra, y acotar o ampliar la vista la conserva.  
Cambiar la vista de filas cambia el tamaño de las tarjetas, así que Flow las vuelve a disponer y las ajusta a la pantalla.

### Nombres en las tarjetas {#names-on-the-cards}

Una tarjeta nombra su tabla y sus columnas en la vista de nombres, la misma en la que dibuja la pestaña ERD; consulta [Vista de nombres](./logical-names.md#name-view).  
Cámbiala aquí con la lista `Name View` de la [barra de herramientas](#toolbar). Su botón indica la vista vigente, `Physical Names`, `Logical Names` o `Both Names`, y su descripción emergente indica `Name View`. La lista se abre encima de la barra de herramientas con una marca de verificación junto a la vista vigente, y se cierra como el menú de [vista de filas](#row-display). Una elección cambia la vista de todo el editor, incluida la pestaña ERD, como hace un cambio hecho en cualquier otro lugar; consulta [Cambiar la vista](./logical-names.md#switching-the-view).

Las tarjetas disponen sus celdas solo según la vista de nombres. Ninguna [opción de vista](./table-related-functions.md#table-view-options) las cambia, `Domain` incluida:

| Vista de nombres | Encabezado | Cada fila |
| --- | --- | --- |
| `Physical Names` | El nombre de la tabla. | El nombre de la columna y, después, el tipo de datos. |
| `Logical Names` | El nombre lógico de la tabla. | El nombre lógico de la columna y, después, el nombre de su [dominio](./dictionary.md#domains-and-data-types), o su tipo de datos mientras no tiene ninguno. |
| `Both Names` | El nombre lógico y, después, el nombre de la tabla, atenuado. | El nombre lógico, el nombre, el dominio y el tipo de datos. |

Mientras un nombre lógico está vacío, la vista `Logical Names` muestra el nombre en su lugar, atenuado, o el marcador de posición `table` o `column` cuando el nombre también está vacío, y la vista `Both Names` muestra el marcador de posición atenuado `logical`. En `Both Names`, una columna sin dominio muestra el marcador de posición atenuado `domain`.  
Una tarjeta nunca lleva las [marcas](./dictionary.md#marks-on-the-canvas) que las comprobaciones del diccionario ponen en los nombres de la pestaña ERD.  
Cambiar la vista de nombres cambia el tamaño de las tarjetas, así que Flow las vuelve a disponer; consulta [Cómo coloca Flow las tarjetas](#how-flow-is-placed).

### Moverse por Flow {#getting-around-the-flow}

La rueda desplaza la vista, y `Shift + Wheel` la desplaza en horizontal. `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac) hace zoom y mantiene el centro de la pantalla donde está.  
Pellizcar en el panel táctil hace zoom con centro en el punto donde pellizcas, y dos dedos en una pantalla táctil hacen zoom con centro en el punto que hay entre ellos y desplazan la vista al moverse.  
Arrastra el fondo para desplazar la vista, o arrastra con el botón central del ratón desde cualquier parte, incluida una tarjeta. Un arrastre con el botón central solo desplaza la vista y deja la selección como está. El desplazamiento de la vista no tiene límites, como en el [lienzo ERD](./table-related-functions.md#getting-around-the-canvas).  
El zoom va del `10%` al `150%`. Flow tiene su propio zoom y su propio desplazamiento, independientes de los de la pestaña ERD, y ninguno de los dos se guarda en el documento.

Pulsar sobre el fondo anula la selección, y `Ctrl + drag` (Windows/Linux) o `⌘ + drag` (Mac) sobre el fondo dibuja un cuadro de selección.  
Flow no tiene minimapa ni barras de desplazamiento. Cuando un desplazamiento deja la pantalla sin ninguna tarjeta, usa la brújula `Go to content` de la [barra de herramientas](#toolbar).

### Iluminar las tablas relacionadas {#lighting-related-tables}

Pasa el puntero por encima de una tarjeta para iluminarla junto con las tablas que están a una relación de distancia de ella y los conectores que la unen a esas tablas. Un conector entre dos de esas tablas sigue sin iluminarse.  
Una tarjeta iluminada recibe un borde y un resplandor del color de énfasis, y se tiñen las filas en las que termina una relación. Un conector iluminado adopta el color de énfasis.  
Nada más se atenúa, a diferencia de lo que ocurre en [Graph](#highlighting-a-neighbourhood), y no hay nada iluminado mientras ninguna tarjeta esté bajo el puntero ni fijada.

Haz clic en una tarjeta para fijar su iluminación, de modo que siga iluminada cuando el puntero se aleje. Vuelve a hacer clic en la misma tarjeta, o haz clic en el fondo, para liberarla; al hacer clic en otra tarjeta, la fijación pasa a ella. La tarjeta bajo el puntero y la tarjeta fijada se iluminan a la vez.  
Arrastrar, `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac), desplazar la vista y los [botones de la tarjeta](#card-buttons) no fijan ni liberan ninguna tarjeta.

Por cada conector iluminado circulan partículas, desde el extremo de la tabla padre, donde está la clave principal, hasta el extremo de la tabla hija. Cuando hay más de 60 conectores iluminados a la vez, las partículas se detienen y la iluminación se mantiene.

### Botones de la tarjeta {#card-buttons}

Mientras el puntero está sobre una tarjeta, aparecen en el extremo derecho de su encabezado dos botones de icono, ninguno con descripción emergente:

- El icono de puntos de ruta, el mismo que muestra el botón `Flow`, acota Flow a esa tabla y a las tablas que están a una relación de distancia; consulta [Centrarse en tablas](#focusing-on-tables). Lo que mostraba Flow antes queda a un `Previous table` de distancia; consulta [Tabla anterior y tabla siguiente](#previous-table-and-next-table).
- El icono de enlace externo cambia a la pestaña ERD, selecciona solo esa tabla, la trae al frente y lleva el foco a la celda de su nombre, o a la de su nombre lógico en `Logical Names` y `Both Names`, salvo que ya lo tenga una celda de esa tabla. El lienzo solo se desplaza hasta la tabla si esta no se ve ya bien; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands). Nunca inicia ni termina una relación que se esté dibujando.

Una pulsación en cualquiera de los dos botones solo afecta al botón: a diferencia de una pulsación en otra parte de la tarjeta, no selecciona la tarjeta ni la trae al frente. Por eso, el botón de puntos de ruta deja la selección que tenías; el botón de enlace externo selecciona la tabla solo como parte de su cambio a la pestaña ERD. Los dos botones solo responden al clic izquierdo.

### Mover tarjetas {#moving-cards}

Arrastra una tarjeta con el botón izquierdo del ratón desde cualquier parte de ella excepto los dos botones de la tarjeta; un arrastre con el botón derecho no mueve nada.  
Pulsar sobre una tarjeta la selecciona, `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) la añade a la selección, y arrastrar una tarjeta seleccionada mueve todas las tarjetas seleccionadas. La selección es la misma que usa la pestaña ERD, así que lo que seleccionas aquí sigue seleccionado cuando vuelves.

Una tarjeta solo se mueve en Flow: su tabla se queda donde está en la pestaña ERD.  
Una tarjeta movida se queda en su sitio al desplazar la vista, al hacer zoom y con `Fit`. Vuelve a donde la colocó la disposición cuando sales de la pestaña o cambias a `Graph` y vuelves, y cuando `Show all` o un [paso](#previous-table-and-next-table) vuelven a una disposición que Flow ya tiene. Una nueva disposición la vuelve a colocar teniendo en cuenta dónde la dejaste; consulta [Cómo coloca Flow las tarjetas](#how-flow-is-placed).

### Centrarse en tablas {#focusing-on-tables}

En la pestaña ERD, selecciona una o varias tablas y pulsa `Alt + F` (Windows/Linux) o `⌥ + F` (Mac), o haz clic con el botón derecho en una tabla y elige `Focus on this table`.  
La pestaña Visualización se abre en `Flow`, acotada a esas tablas y a todas las tablas que están a una relación de distancia de cualquiera de ellas, en cualquiera de los dos sentidos. Solo se dibujan los conectores entre las tablas que muestra.

Cuando la tabla en la que haces clic con el botón derecho es una de varias tablas seleccionadas, la opción indica `Focus on selected tables` y centra la vista en toda la selección. Hacer clic con el botón derecho en una tabla que está fuera de la selección centra la vista solo en esa tabla.  
`Alt + F` toma las tablas seleccionadas y deja fuera las notas y los [grupos de tablas](./table-groups.md). Si no hay ninguna tabla seleccionada, no hace nada, aunque haya un grupo seleccionado: elige primero `Select tables` en el menú contextual del grupo; consulta [Seleccionar grupos](./table-groups.md#selecting-groups).  
Se ignora mientras se edita una celda, una nota o el nombre de un grupo, mientras el teclado está en el [explorador](./explorer.md#keys-in-the-explorer), o mientras están abiertos la búsqueda rápida, el panel Propiedades de la tabla, el visor de diferencias, la vista previa de la disposición automática, el viaje en el tiempo, el cuadro de diálogo [`Export image`](./file-import-export.md#image) o [`Map Columns`](./relationship-editing.md#map-columns).

Dentro de Flow, el [botón de la tarjeta](#card-buttons) con el icono de puntos de ruta acota la vista del mismo modo, a esa única tabla. `Show all`, en la [barra de herramientas](#toolbar), vuelve a todo el diagrama. `Previous table` y `Next table`, en la barra de herramientas, o sus teclas, retroceden y avanzan por las vistas a las que se ha acotado Flow; consulta [Tabla anterior y tabla siguiente](#previous-table-and-next-table).  
Una vista acotada se dispone por separado y se ajusta a la pantalla. Sigue acotada cuando sales de la pestaña o cambias a `Graph` y vuelves, y `Escape` no la amplía.

![Centrarse en orders con ⌥ + F, acotar a members con el botón de puntos de ruta de su tarjeta y después Show all](/img/demo-visualization-focus.webp)

### Tabla anterior y tabla siguiente {#previous-table-and-next-table}

Flow recuerda las vistas a las que se ha acotado, como el historial de un navegador. Cada vez que la vista pasa a otras tablas —al [centrarse en tablas](#focusing-on-tables) desde la pestaña ERD, mediante el [botón de la tarjeta](#card-buttons) con el icono de puntos de ruta o con `Show all`—, lo que mostraba antes se conserva como un paso atrás, tanto si eran unas pocas tablas como si era todo el diagrama.

![Acotar Flow a orders con ⌥ + F y después a members, retroceder con Previous table, avanzar con ⌘ + Shift + Z y retroceder con ⌘ + Z, y después Show all](/img/demo-visualization-steps.webp)

- `Previous table`, en la [barra de herramientas](#toolbar), retrocede un paso, y `Next table` vuelve a avanzar hasta lo que dejó `Previous table`.
- En `Flow`, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) retrocede un paso como `Previous table`, y `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Shift + Z` (Mac) avanza un paso como `Next table`. Allí nunca deshacen ni rehacen una edición del diagrama. En `Graph`, y mientras la búsqueda rápida está abierta, no hacen nada.
- Acotar la vista o pulsar `Show all` después de retroceder descarta los pasos hacia delante. Volver a centrarse exactamente en las tablas a las que Flow ya está acotado no añade ningún paso ni descarta ninguno.
- Se conservan los 100 últimos pasos atrás, y el más antiguo es el primero en descartarse.

Un paso muestra aquellas de sus tablas que siguen en el diagrama, con todas las tablas a una relación de distancia, como hace el centrado en tablas. Un paso cuyas tablas se han eliminado todas se omite y se descarta, igual que uno que dejaría Flow donde está: en las mismas tablas a las que está acotado ahora, o en todo el diagrama mientras Flow ya lo muestra.  
Un botón aparece atenuado, y no hace nada, mientras no queda ningún paso en ese sentido. Los dos aparecen atenuados la primera vez que se abre Flow, ya sea con el diagrama completo o con las tablas con las que lo abrió un centrado. Una vez abierto Flow, un centrado posterior desde la pestaña ERD conserva como paso atrás lo que mostraba Flow cuando saliste de él.  
Un paso se dispone y se ajusta a la pantalla como un centrado —consulta [Cómo coloca Flow las tarjetas](#how-flow-is-placed)—, y la vista de filas se queda como está.

Los pasos son propios de Flow. Se conservan mientras el editor está abierto, aunque visites otras pestañas y `Graph`, pero no se guardan en el documento ni se envían a los colaboradores, y no añaden nada al historial de deshacer. Sustituir todo el documento los descarta junto con el resto de Flow.

En un idioma de la interfaz de derecha a izquierda, la barra de herramientas conserva su orden y las dos flechas intercambian lo que hacen, así que `Previous table` es la flecha que apunta a la derecha. Las teclas siguen siendo las mismas; consulta [Idiomas de derecha a izquierda](./language-and-theme.md#right-to-left-languages).

### Cómo coloca Flow las tarjetas {#how-flow-is-placed}

La primera vez que se muestra `Flow`, las tablas que muestra se disponen fuera del hilo principal y el resultado se ajusta a la pantalla.  
La disposición se conserva mientras el editor está abierto. Si sales de la pestaña o cambias a `Graph` y vuelves, Flow la reutiliza, con el zoom y el desplazamiento donde los dejaste.  
Flow conserva una disposición para el diagrama completo y otra para las últimas tablas a las que se acotó, así que `Show all` vuelve a la disposición del diagrama completo y la ajusta a la pantalla sin volver a calcularla, siempre que no haya cambiado nada de lo que se usó para calcular esa disposición. Un [paso](#previous-table-and-next-table) al diagrama completo, o a las últimas tablas a las que se acotó Flow, reutiliza esa disposición de la misma manera.

Flow vuelve a disponer las tarjetas cuando:

- Pulsas `Tidy Up`. El resultado se ajusta a la pantalla.
- Cambias la vista de filas, acotas la vista a otras tablas o pasas a otras tablas con `Previous table` o `Next table`. El resultado se ajusta a la pantalla.
- Eliges otra vista en la lista `Name View`. El resultado se ajusta a la pantalla.
- Se añaden o se eliminan tablas o relaciones, o se cambia la vista de nombres: mientras no estás en Flow, lo que se detecta al volver, o por parte de un colaborador mientras estás en Flow. El zoom y el desplazamiento se quedan como están.

Cada disposición tiene en cuenta dónde están las tarjetas en ese momento, así que `Tidy Up` no restaura necesariamente una distribución anterior.  
Un cambio que solo modifica el tamaño de una tarjeta, como cambiar el nombre de una tabla, escribir un nombre lógico o añadir una columna, no vuelve a disponer las tarjetas. Pulsa `Tidy Up` si las tarjetas acaban superponiéndose.

Una disposición que tarda más de 6 segundos muestra un aviso `Placing tables`, con un indicador de carga giratorio y `Cancel`.  
`Cancel`, o `Escape` en cualquier momento mientras se calcula la disposición, la descarta; `Tidy Up`, o volver a `Flow`, la vuelve a solicitar.  
Si una disposición falla —el host no ejecuta ningún worker compartido, el worker no llega a iniciarse o no se recibe ninguna disposición en 60 segundos—, Flow muestra un aviso `Could not place tables` con un icono de advertencia, y `Tidy Up` lo vuelve a intentar. Consulta [Web Workers](../../api/installation.md#web-workers).  
Flow solo dibuja las tablas que colocó su última disposición, tanto en el diagrama completo como en una vista acotada, así que la primera vez que se muestra puede no haber ninguna tarjeta hasta que una disposición se complete con éxito.  
Siempre que Flow vuelve a disponer las tarjetas, por ejemplo cuando acotas la vista a otras tablas, la distribución anterior permanece en pantalla hasta que llega la nueva disposición, y sigue ahí si esa disposición se cancela o falla.

Cuando se sustituye todo el documento, por ejemplo al importar un archivo, se descartan las disposiciones de Flow, el centrado en tablas, los pasos de `Previous table` y `Next table`, la vista de filas, el zoom y el desplazamiento, y la próxima vez que abras Flow empieza de nuevo como la primera vez: con el diagrama completo, o acotado si se abre al [centrarse en tablas](#focusing-on-tables).

### Flow nunca edita el documento {#flow-never-edits-the-document}

Flow solo lee el diagrama. El zoom, el desplazamiento de la vista, el movimiento de tarjetas, `Tidy Up`, la vista de filas, las fijaciones, el centrado en tablas y los pasos con `Previous table` y `Next table` no añaden nada al [historial de deshacer](./undo-redo.md#what-the-history-records).  
Tampoco cambian nada en el diagrama. Pulsar sobre una tarjeta sí trae su tabla al frente, igual que hacer clic en una tabla en la pestaña ERD, así que también queda delante allí, pero el orden de apilamiento no se guarda; consulta [Mover varias tablas](./table-related-functions.md#moving-multiple-tables). `Graph` deja el diagrama intacto de la misma manera.  
La lista `Name View` es una excepción, y solo mientras el [bloqueo](./settings.md#lock) `Name View` está desactivado: entonces una elección cambia la vista de nombres del diagrama, que se guarda y con la que cambian también los colaboradores. Mientras el bloqueo está activado, como lo está de forma predeterminada, una elección solo cambia tu propia pantalla. En cualquier caso, no añade nada al historial de deshacer.  
Pulsar sobre una tarjeta nunca añade una relación. Si saliste de la pestaña ERD mientras dibujabas una, una pulsación sobre una tarjeta elige su tabla como punto de partida cuando todavía no se ha elegido ninguna y, si no, pone fin al dibujo.  
El [botón de la tarjeta](#card-buttons) con el icono de enlace externo va más allá, porque te saca de Flow: cuando la pestaña ERD tiene que desplazarse hasta la tabla, ese desplazamiento se registra como cualquier otro cambio de la posición de la vista.

Las ediciones de los colaboradores siguen llegando al diagrama mientras estás en Flow, y las tarjetas reflejan las tablas y relaciones que añaden o eliminan; consulta [Cómo coloca Flow las tarjetas](#how-flow-is-placed).  
Sus marcos de selección y de foco se dibujan en las tarjetas, pero sus cursores y cuadros de arrastre no; consulta [Edición colaborativa](../../api/advanced/collaborative-editing.md).

Los dos modos, incluidos el centrado en tablas y los pasos, funcionan también en un editor [`readonly`](../../api/erd-editor-element.md#readonly), y también la lista `Name View`, que allí solo cambia tu propia pantalla.  
En la pestaña ERD de un editor de solo lectura, el menú de la tabla contiene solo `Table Properties` y una pulsación no selecciona ninguna tabla, así que centra la vista con `Alt + F` (Windows/Linux) o `⌥ + F` (Mac) sobre la tabla que seleccionó un salto desde el [explorador](./explorer.md#going-to-a-row) o la [búsqueda rápida](./quick-search.md).
