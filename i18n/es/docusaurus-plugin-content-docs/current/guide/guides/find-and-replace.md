---
sidebar_position: 10
description: Busca nombres de tabla, columna, índice y grupo de tablas, nombres lógicos, comentarios y notas desde la parte superior del explorador, recorre las coincidencias en su árbol y en el lienzo, y reemplaza una coincidencia o todas.
---

# Buscar y reemplazar

Busca texto en todo el diagrama, te lleva a cada coincidencia en el lienzo ERD y reemplaza una coincidencia o todas.  
Busca en ocho tipos de texto: nombres de tabla, comentarios de tabla, nombres de columna, comentarios de columna, notas, nombres de índice, nombres de grupo de tablas y los [nombres lógicos](./logical-names.md) de tablas y columnas; consulta [Qué se busca](#what-it-searches).

Se encuentra en la parte superior del [explorador](./explorer.md), el panel acoplado a la izquierda del lienzo ERD, entre la barra de título del explorador y su árbol. No tiene título propio. De arriba abajo contiene:

- El campo Buscar, con las tres [opciones](#options) dentro de él, al final, y la flecha `Toggle Replace` delante de él.
- La fila `Replace`, contraída al principio; consulta [Reemplazar](#replacing).
- El recuento, seguido de las flechas arriba y abajo que recorren las coincidencias y del botón de tres puntos `Search In`.
- Los [tipos de texto](#what-it-searches), que `Search In` expande.

Mientras el campo Buscar contiene texto, el árbol del explorador muestra las coincidencias; consulta [Los resultados](#the-results).  
La búsqueda conserva toda su altura en un lienzo de poca altura, y el árbol que hay debajo ocupa el espacio restante y se desplaza.

![Abrir Buscar y reemplazar en el explorador con ⌘ + F, recorrer las seis coincidencias de member y luego, con Preserve Case activado, reemplazar las seis por user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Abrir y cerrar {#opening-and-closing}

Tanto `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) como `Toggle Explorer` en la [búsqueda rápida](./quick-search.md) o en el menú contextual del lienzo abren el explorador en su búsqueda. El cursor de texto va al campo Buscar con su texto seleccionado, y se vuelve a buscar la consulta sin ninguna coincidencia actual.  
El botón `Explorer` de la barra de herramientas solo abre o cierra el panel. No pone el cursor de texto en el campo Buscar y deja la consulta y la coincidencia actual como estaban.  
Cuando la tecla solo devuelve el cursor de texto a un explorador que ya se muestra, como ocurre mientras está abierta la búsqueda rápida o uno de los cinco cuadros de diálogo de [Cuadros de diálogo a su lado](./explorer.md#dialogs-beside-it), la coincidencia actual sigue siendo la actual.

Cómo se cierra el explorador, qué hacen la tecla y las dos opciones `Toggle Explorer` mientras está abierto y qué cuadros de diálogo cierran se explican en [Abrir y cerrar](./explorer.md#opening-and-closing), en la página del explorador.  
[Cuándo se aparta](./explorer.md#when-it-stands-aside) explica cómo lo ocultan otra pestaña y el modo zen, y cómo el visor de diferencias, el viaje en el tiempo y la vista previa de la disposición automática lo ocultan e impiden que se abra. [Junto al lienzo](./explorer.md#beside-the-canvas) trata el caso de un editor demasiado estrecho para él.

Al volver a abrirlo se conserva la última consulta, junto con el texto de reemplazo, las [opciones](#options), los [tipos de texto](#what-it-searches) que estaban activados y si la fila `Replace` y los tipos de texto estaban expandidos.  
Se conservan mientras el editor sigue abierto y no se guardan en el documento. Un editor recién abierto empieza con todas las opciones desactivadas, con la fila `Replace` y los tipos de texto contraídos y con solo los cuatro tipos de nombre y `Logical names` activados; consulta [Qué se busca](#what-it-searches).

## La barra de búsqueda del navegador {#the-browsers-find-bar}

Mientras el editor tiene el foco del teclado, `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) le pertenece en todas las pestañas, también en sus propios campos de texto, así que la barra de búsqueda del navegador no se abre.  
La tecla pasa al navegador o al host mientras está abierto el visor de diferencias, el viaje en el tiempo o la vista previa de la disposición automática, y mientras el foco está fuera del editor.

- Aplicación web y Google Drive: la barra de búsqueda del navegador solo se abre en esos dos casos.
- VS Code: la extensión deja desactivado el widget de búsqueda propio de VS Code en el ERD Editor, así que la tecla nunca abre uno allí.
- Obsidian: la tecla llega al editor siempre que la pestaña del diagrama está activa, en lugar del `Search current file` de Obsidian.
- IDE de JetBrains: si el mapa de teclas del IDE se reserva `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), abre la búsqueda desde `Toggle Explorer` en la búsqueda rápida o en el menú contextual del lienzo, o abre el explorador con el botón `Explorer` de la barra de herramientas y haz clic en el campo Buscar.

Una página que integra el editor puede reasignar o quitar la tecla; consulta [Cambiar el atajo](#changing-the-shortcut).

## Qué se busca {#what-it-searches}

Ocho botones eligen los tipos de texto en los que se busca, en este orden: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` y `Logical names`.  
Al principio están contraídos. El botón `Search In`, al final de la fila del recuento, los expande debajo de esa fila y los vuelve a contraer, y está resaltado mientras se muestran.  
Un botón de tipo resaltado está activado. Haz clic en uno para activarlo o desactivarlo, y la búsqueda se vuelve a ejecutar. Con los ocho desactivados, no se encuentra nada.

La búsqueda se abre al principio con los cuatro tipos de nombre, `Table names`, `Column names`, `Index names` y `Table group names`, y con `Logical names`, así que un cambio de nombre no llega a los comentarios ni a las notas a menos que los actives.  
`Logical names` es un solo tipo para los nombres lógicos tanto de las tablas como de las columnas.  
Los nombres de índice son los nombres de los índices de la pestaña `Indexes` del panel [Propiedades de la tabla](./table-related-functions.md#indexes), no las claves `PK_` y `UQ_` que aparecen encima de ellos.

No se busca nada más: ni los tipos de datos, ni el dominio de una columna, ni los valores predeterminados, ni las columnas de un índice, ni el nombre de la base de datos, ni el [Esquema SQL](./schema-sql.md) con sus scripts `Before tables` y `After tables`, ni el código generado, ni las hojas de la pestaña [Diccionario](./dictionary.md), que tienen su [propia búsqueda](./dictionary.md#searching).  
Los nombres lógicos se buscan sea lo que sea lo que dibuje la [vista de nombres](./logical-names.md#name-view), incluida `Physical Names`, en la que el lienzo no muestra ninguno. Un comentario oculto por una [opción de vista de tabla](./table-related-functions.md#table-view-options) también se sigue buscando. Las notas ocultas con Opciones de vista → `Memos` y los [grupos de tablas](./table-groups.md#hiding-groups) ocultos con Opciones de vista → `Table Groups` no se buscan, aunque su botón esté activado, así que `Replace All` nunca reescribe una nota ni cambia el nombre de un grupo que no puedes ver.

## Opciones {#options}

Tres interruptores dentro del campo Buscar, al final, cambian cómo coincide la consulta. Sus nombres aparecen en sus descripciones emergentes y están resaltados mientras están activados. Los tres empiezan desactivados, y al cambiar uno se vuelve a buscar.

- `Match Case`: si está desactivado, la coincidencia no distingue mayúsculas y minúsculas.
- `Match Whole Word`: una coincidencia solo cuenta donde no se prolonga dentro de una palabra por ninguno de los dos lados. Las letras, los dígitos y las marcas de cualquier escritura cuentan como caracteres de palabra, y también el guion bajo. Por tanto, `user` coincide en `user id` y `user.id`, pero no dentro de `users`, `user_id` ni `superuser`. Un extremo de la consulta que no es en sí un carácter de palabra, como el punto de `.id`, no necesita ningún límite en ese lado.
- `Use Regular Expression`: la consulta es una expresión regular de JavaScript, siempre en modo Unicode, así que `\p{L}` funciona. `^` y `$` coinciden al principio y al final de cada línea de un comentario o una nota de varias líneas, y `.` no cruza un salto de línea. Se aceptan los escapes que se suelen escribir en los nombres, como `\_` y `\-`.

Una expresión regular que no se puede analizar, como `user(`, no encuentra nada: el recuento indica `Invalid regular expression` en rojo y el campo Buscar aparece con un contorno rojo.  
`Match Case` y `Match Whole Word` también se aplican a una expresión regular. Una coincidencia de longitud cero, como `^` por sí solo, nunca aparece en la lista.

El texto literal se busca mientras escribes. Una expresión regular se busca cuando dejas de escribir un momento, o de inmediato cuando pulsas `Enter`, un botón de navegación, `Replace` o `Replace All`, o eliges una fila que contiene una coincidencia.  
La búsqueda no tiene límite de tiempo, así que una expresión regular con mucho retroceso puede dejar el editor sin respuesta hasta que termine.

Un cuarto interruptor, `Preserve Case`, está dentro del campo `Replace`, al final, así que solo se muestra mientras la fila `Replace` está expandida. Empieza desactivado. No cambia nada de lo que se encuentra, solo cómo escriben el reemplazo `Replace` y `Replace All`; consulta [Reemplazar](#replacing). Activarlo o desactivarlo no lanza ninguna búsqueda, y la coincidencia actual sigue siendo la actual.

## Los resultados {#the-results}

El recuento, al principio de la fila que hay bajo los campos, indica dónde estás. Está vacío mientras el campo Buscar está vacío.

| Recuento | Cuándo |
| --- | --- |
| `No results` | No hay ninguna coincidencia. |
| `12 matches` | Antes de ir a una de ellas; `1 match` si solo hay una. |
| `3 of 12` | La tercera coincidencia es la actual. |
| `Invalid regular expression` | La expresión regular no se puede analizar. |
| `Replaced 12 matches` | `Replace All` cambió ese número de coincidencias; `Replaced 1 match` si fue una sola. |
| `No changes` | `Replace All` no cambió nada. |
| `No more matches` | Una serie de `Replace` ha vuelto al punto donde empezó; consulta [Reemplazar](#replacing). |

`Replaced …`, `No changes` y `No more matches` dejan paso al recuento en la siguiente búsqueda o el siguiente movimiento, incluida la búsqueda que inicia una edición o un deshacer.

Mientras el campo Buscar contiene texto, el [árbol](./explorer.md#the-tree) del explorador muestra los resultados en lugar de todo el diagrama: solo las filas que contienen una coincidencia y las filas que están por encima de ellas. Cuando nada coincide, o la expresión regular no se puede analizar, está vacío. Al borrar la consulta vuelve el árbol completo, contraído como estaba antes.

- `Tables`, `Table Groups` y `Memos` solo se muestran cuando contienen una coincidencia, y el recuento de cada carpeta es el número de filas que tiene directamente debajo en los resultados.
- Bajo `Tables` aparecen las tablas que contienen una coincidencia, ordenadas por nombre, nunca por nombre lógico. Bajo cada tabla aparecen una fila por cada coincidencia de su comentario, después una carpeta `Columns` con las columnas que contienen una coincidencia, en orden de columnas, cada una con una fila por cada coincidencia de su comentario, y después una carpeta `Indexes` con los índices cuyo nombre coincide. No hay carpeta `Foreign Keys`.
- Bajo `Table Groups` aparecen los grupos cuyo nombre coincide, ordenados por nombre, sin sus tablas. Una tabla encontrada se muestra bajo `Tables`.
- Bajo `Memos` aparecen las notas que contienen una coincidencia, en el orden del documento, cada una representada por su primera línea y con una fila por cada coincidencia que contiene.

Una coincidencia en un nombre se resalta en la propia fila de ese nombre, así que un nombre que contiene la consulta dos veces es una sola fila con dos resaltados. Una coincidencia en el nombre lógico de una tabla o columna también va en la fila de esa tabla o columna, nunca en una fila propia.  
Esas filas nombran la tabla o la columna como la muestra la [vista de nombres](./logical-names.md#beyond-the-canvas), y cada uno de los dos nombres que puede mostrar una fila solo resalta sus propias coincidencias. Una fila encontrada solo en el nombre que su vista omite, el nombre lógico en `Physical Names` o el nombre en `Logical Names`, añade ese nombre después del que muestra, atenuado como en `Both Names`, con la coincidencia resaltada. Cuando el nombre que muestra también contiene una coincidencia, la fila muestra solo ese nombre, así que las coincidencias del nombre que su vista omite se cuentan y se recorren, pero no se resaltan.  
Una coincidencia en un comentario o una nota tiene su propia fila: un bocadillo para un comentario de tabla o de columna, o una nota adhesiva para una nota, y después un fragmento del texto con la coincidencia resaltada. Un texto largo se corta con `…` y los saltos de línea se muestran como espacios. Pasa el puntero por encima de la fila para ver el texto completo.  
Las demás filas se ven igual que fuera de una búsqueda: una columna muestra su tipo de datos, un índice muestra sus columnas y un nombre en blanco indica `unnamed`.

Toda fila que tiene filas debajo se muestra expandida cuando empieza una búsqueda. Una fila que contraes, o una que contrae `Collapse All`, sigue contraída hasta que una coincidencia que tiene debajo pase a ser la actual, o hasta que cambien la consulta, `Match Case`, `Match Whole Word`, `Use Regular Expression` o un tipo de texto, o se vuelva a abrir la búsqueda con la tecla o con una opción `Toggle Explorer`.  
La fila de la coincidencia actual se resalta y se desplaza hasta quedar a la vista. El árbol enumera todas las coincidencias, por muchas que haya.  
Las coincidencias se recorren en el orden del árbol: tabla por tabla, el nombre lógico, el nombre y el comentario de la tabla, luego el nombre lógico, el nombre y el comentario de cada una de sus columnas en orden de columnas, y luego los nombres de sus índices; después, los nombres de grupo de tablas; después, las notas.

Los resultados siguen al documento mientras se muestra el explorador. Cuando las ediciones se detienen un momento, cualquier cambio en los textos buscados vuelve a lanzar la búsqueda, y la coincidencia actual sigue siendo la actual si todavía existe. Eso incluye editar un nombre, un nombre lógico, un comentario o el texto de una nota; añadir o eliminar una tabla, una columna, un índice, una nota o un grupo de tablas; mover una columna, y ocultar o mostrar las notas o los grupos de tablas con Opciones de vista, lo que quita sus coincidencias del árbol o las devuelve. Cuentan una edición en el lienzo, un deshacer o un rehacer, una importación y una edición de un colaborador o de un agente de programación. Seleccionar, mover tablas, notas o grupos en el lienzo, desplazar la vista, hacer zoom y pasar el puntero por encima no cuentan.  
Tampoco cuenta cambiar la vista de nombres, que no cambia ningún texto que lea la búsqueda: se mantienen las mismas coincidencias, y las filas toman los nombres que muestra la nueva vista.  
Las ediciones hechas mientras el explorador está cerrado o fuera de la vista se buscan en cuanto vuelve a mostrarse.

## Ir a una coincidencia {#going-to-a-match}

`Enter` en el campo Buscar va a la coincidencia siguiente, y `Shift + Enter`, a la anterior. Los botones de flecha arriba y abajo que siguen al recuento hacen lo mismo; sus descripciones emergentes indican `Previous Match (Shift+Enter)` y `Next Match (Enter)`, y están deshabilitados mientras no hay ninguna coincidencia.  
El recorrido da la vuelta en ambos extremos. Ninguna coincidencia es la actual hasta que te muevas por primera vez, así que el primer `Enter` va a la primera coincidencia y el primer `Shift + Enter`, a la última.

Un clic en una fila de los resultados, o `Enter` o `Space` con el teclado en ella, hace una de estas cosas:

- Una fila cuyo propio nombre o nombre lógico contiene una coincidencia va a su primera coincidencia, la del nombre lógico antes que la del nombre.
- Una fila que muestra un fragmento de un comentario o una nota va a esa coincidencia.
- Cualquier otra fila, como una tabla cuyo nombre y nombre lógico no coinciden o la propia fila de una nota, va a lo que representa la fila y deja la coincidencia actual como está; consulta [Ir a una fila](./explorer.md#going-to-a-row).
- Una carpeta se contrae o se expande.

Siempre que una coincidencia pasa a ser la actual, el árbol expande las filas contraídas que haya por encima de ella y lleva allí la fila del teclado, así que las teclas de flecha del árbol continúan desde ella.

Ir a una coincidencia cierra el panel Propiedades de la tabla si está abierto y, a continuación:

- Para el nombre, el nombre lógico o el comentario de una tabla o columna, selecciona solo la tabla, la trae al frente y deja la celda con el foco en la celda que contiene la coincidencia. Una coincidencia en un comentario oculto por una [opción de vista de tabla](./table-related-functions.md#table-view-options) deja, en cambio, la celda con el foco en el nombre que tiene al lado. Donde la [vista de nombres](./logical-names.md#name-view) no dibuja ninguna celda para el nombre o el nombre lógico, la celda con el foco va a la que se dibuja en su lugar: el nombre en `Physical Names` y el nombre lógico en `Logical Names`.
- Para un nombre de índice, selecciona solo la tabla del índice y la trae al frente, con la celda con el foco en el nombre de la tabla, o en su nombre lógico en `Logical Names` y `Both Names`, salvo que ya esté en esa tabla. Los nombres de índice no se dibujan en el lienzo.
- Para un nombre de grupo de tablas, selecciona solo el grupo y lo trae al frente con sus tablas.
- Para una nota, selecciona solo la nota y la trae al frente.

El lienzo solo se desplaza cuando aquello a lo que va no se ve ya bien, y el zoom nunca cambia; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands).

Después de `Enter` en el campo Buscar, el cursor de texto se queda allí, y después de elegir una fila, el teclado se queda en el árbol, así que lo que escribas a continuación no llega a la tabla seleccionada.  
Ir a una coincidencia nunca inicia ni termina una relación que se esté dibujando.

## Reemplazar {#replacing}

La fila `Replace` está contraída al principio. La flecha que hay delante del campo Buscar, cuya descripción emergente indica `Toggle Replace`, la expande y la contrae. Al contraerla se conserva el texto de reemplazo.  
La fila contiene el campo `Replace`, con el interruptor `Preserve Case` dentro de él, al final, y dos botones, cuyas descripciones emergentes indican `Replace (Enter)` y `Replace All`. Ambos botones están deshabilitados mientras no hay ninguna coincidencia.

`Replace` se ejecuta con `Enter` en el campo Reemplazar, con o sin `Shift`, o con su botón:

- Sin ninguna coincidencia actual, la primera pulsación solo va a la coincidencia siguiente, así que ves lo que cambiaría antes de que cambie nada.
- Con una coincidencia actual, reemplaza esa única aparición, sin tocar las demás apariciones del mismo texto, y pasa a la siguiente coincidencia posterior al texto que ha escrito. Lo que ha escrito se omite aunque contenga la consulta: al reemplazar `user` por `super_user`, después no se detiene dentro de `super_user`.
- Una coincidencia que el reemplazo volvería a escribir exactamente igual que estaba se deja como está, y la pulsación solo pasa a la siguiente coincidencia.
- El reemplazo y el desplazamiento hasta la siguiente coincidencia forman un solo paso de deshacer.

Una serie de pulsaciones de `Replace` se detiene cuando da la vuelta hasta el punto donde empezó. El recuento indica `No more matches`, ninguna coincidencia es la actual y las pulsaciones posteriores no reemplazan nada.  
Por tanto, `Customer` reemplazado por `Big Customer` se reemplaza una sola vez, en lugar de crecer hasta `Big Big Customer`.  
Ir a una coincidencia, cambiar la consulta, `Match Case`, `Match Whole Word`, `Use Regular Expression` o un tipo de texto, abrir la búsqueda con la tecla o con una opción `Toggle Explorer`, o `Replace All` inicia una nueva serie, y lo mismo hacen un deshacer o cualquier otra edición que cambie el texto en el que empezó la serie. Cambiar el texto de reemplazo o `Preserve Case` no la inicia, y tampoco la tecla cuando solo devuelve el cursor de texto a un explorador que ya se muestra.  
Mientras dura una serie, una tabla o un grupo de tablas al que cambia el nombre conserva su lugar en el árbol y en el orden de las coincidencias, así que un cambio de nombre que lo ordenaría más adelante no se vuelve a encontrar. La siguiente serie vuelve a ordenar el árbol por nombre, y la fila renombrada pasa a su nuevo lugar.

`Replace All` se ejecuta con `Ctrl + Enter` (Windows/Linux) o `⌘ + Enter` (Mac) en el campo Reemplazar, o con su botón:

- Reemplaza todas las coincidencias de los tipos de texto activados y no toca los demás tipos, salvo los nombres físicos que deriva un nombre lógico reemplazado, que escribe aunque `Table names` y `Column names` estén desactivados; consulta más abajo. Con los tipos predeterminados, cambia el nombre de tablas, columnas, índices y grupos de tablas, y reescribe los nombres lógicos de tablas y columnas; los comentarios y las notas quedan intactos.
- Todo lo que cambia forma un solo paso de deshacer; consulta [Un gesto, un paso](./undo-redo.md#one-gesture-one-step).
- El recuento indica `Replaced N matches` y solo cuenta las apariciones cuyo texto ha cambiado realmente. Cuando no ha cambiado ninguna, indica `No changes` y no se registra nada en el historial, como al reemplazar la expresión regular `(user)` por `$1`.
- A continuación, los resultados se vuelven a buscar sin ninguna coincidencia actual, así que pueden incluir coincidencias que contiene el texto nuevo.

Ambos leen cada texto tal como está cuando pulsas, no como lo encontró la última búsqueda.

Cómo se usa el texto de reemplazo:

- Sin `Use Regular Expression`, `$` no tiene ningún significado especial y el texto de reemplazo se usa tal como se ha escrito, salvo por las mayúsculas y minúsculas que le da `Preserve Case`.
- Con `Use Regular Expression`, `$1` a `$99`, `$<name>`, `$&`, `` $` ``, `$'` y `$$` se expanden igual que en `String.prototype.replace` de JavaScript.
- Sin `Preserve Case`, no se trasladan las mayúsculas y minúsculas del texto encontrado: con `Match Case` desactivado, al reemplazar `user` por `member`, `Users` se convierte en `members`.
- Con `Preserve Case`, cada reemplazo toma las mayúsculas y minúsculas del texto que reemplaza, una vez expandidos `$1` y los demás, así que el mismo reemplazo convierte `Users` en `Members`:
  - Una coincidencia toda en mayúsculas recibe el reemplazo todo en mayúsculas, y una coincidencia toda en minúsculas lo recibe todo en minúsculas: `USER` con `account` da `ACCOUNT`, y `user` con `Account` da `account`.
  - Cualquier otra coincidencia da al primer carácter del reemplazo la mayúscula o minúscula del primer carácter de la coincidencia, y deja el resto tal como se ha escrito: `UserId` con `accountKey` da `AccountKey`, y `uSER` con `AccountKey` da `accountKey`. Cuando el primer carácter de la coincidencia no es ni mayúscula ni minúscula, el reemplazo se deja tal como se ha escrito: `_Ab` con `xyz` da `xyz`.
  - Cuando la coincidencia y el reemplazo contienen ambos `-`, o ambos `_`, y ese separador los divide en el mismo número de partes, cada parte toma las mayúsculas y minúsculas de la parte correspondiente: `USER_id` con `account_key` da `ACCOUNT_key`, y `User-Name` con `account-key` da `Account-Key`. Cuando tanto `-` como `_` los dividen así, las mayúsculas y minúsculas se aplican al conjunto como a una sola parte.
  - Una coincidencia sin letras que distingan mayúsculas y minúsculas, como `123`, deja el reemplazo tal como se ha escrito.
  - Una coincidencia que se vuelve a escribir tal como estaba no cuenta: con `Match Case` desactivado, al reemplazar `customer` por `Customer` se vuelven a escribir `customer`, `Customer` y `CUSTOMER` tal como estaban, y no se cuenta ninguna.
- Un campo Reemplazar vacío elimina la coincidencia.

Un reemplazo es una edición normal, igual que escribir tú mismo el nuevo nombre de tabla, nombre de columna, nombre lógico, comentario o texto de nota, cambiar el nombre del índice en el panel Propiedades de la tabla o cambiar el nombre del grupo de tablas.  
Se registra en el historial y llega a los colaboradores y a un agente de programación como cualquier otra edición.

Así, un nombre de tabla o columna que escribe un reemplazo pasa a ser un nombre escrito por ti, que un nombre lógico escrito después deja como está hasta que [Volver a derivar los nombres físicos](./dictionary.md#derive-physical-names-again) lo devuelve a los diccionarios. En cambio, un nombre que un reemplazo deja vacío vuelve a los diccionarios, como cualquier nombre borrado; consulta [Nombres escritos por ti](./dictionary.md#names-of-your-own).  
Mientras el nombre físico de una tabla o columna está vacío o fue a su vez derivado, un nombre lógico reemplazado lo deriva a partir de los diccionarios, como al cerrar la celda del nombre lógico con un nombre lógico nuevo; consulta [Derivar nombres físicos](./dictionary.md#deriving-physical-names). En ese caso, una columna cuyo nuevo nombre lógico es un término también toma el dominio del término y, con él, el tipo de datos del dominio. Lo que deriva forma parte del paso de deshacer del reemplazo y no se cuenta en `Replaced N matches`.  
Cuando un mismo `Replace All` reescribe tanto el nombre lógico como el nombre de la misma tabla o columna, el nombre que escribe prevalece sobre el que derivaría el nuevo nombre lógico.

## Teclas en los campos de búsqueda {#keys-in-the-search-fields}

- En el campo Buscar, `Enter` va a la coincidencia siguiente y `Shift + Enter`, a la anterior.
- En el campo Reemplazar, `Enter` reemplaza, con o sin `Shift`, y `Ctrl + Enter` (Windows/Linux) o `⌘ + Enter` (Mac) reemplaza todo.
- Mientras un método de entrada está componiendo texto en cualquiera de los dos campos, `Enter` pertenece a la composición y no navega ni reemplaza.

Lo que hacen en estos campos `Escape`, los atajos de teclado del editor que siguen funcionando y todas las demás teclas se explica en [Teclas en el explorador](./explorer.md#keys-in-the-explorer).

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly), la búsqueda solo encuentra. No hay flecha `Toggle Replace` ni fila `Replace`, así que tampoco hay campo Reemplazar, `Preserve Case`, `Replace` ni `Replace All`.  
El campo Buscar, sus tres opciones, los tipos de texto, el recuento, los resultados y el salto a una coincidencia funcionan todos. Ir a una coincidencia selecciona aquello a lo que llega, como en [Ir a una coincidencia](#going-to-a-match), y esa selección es la única que hace un editor de solo lectura: un clic en el lienzo sin movimiento la borra.  
Abre la búsqueda con la tecla o con `Toggle Explorer` en la búsqueda rápida, ya que el menú contextual del lienzo no tiene allí `Toggle Explorer`. El resto del explorador se explica en [Editores de solo lectura](./explorer.md#read-only-editors) en la página del explorador.

En VS Code, una revisión de un diagrama, como una revisión de Git o una entrada de Local History, se abre como texto JSON. Si se vuelve a abrir como diagrama con `Reopen Editor With...`, es de solo lectura y tiene esta búsqueda que solo encuentra.

## Cambiar el atajo {#changing-the-shortcut}

Una página que integra el editor puede reasignar `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), o quitarlo, con el nombre `findReplace` mediante [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Si se quita, la tecla queda en manos de la página en todas las pestañas. El botón `Explorer` de la barra de herramientas sigue abriendo y cerrando el explorador, y `Toggle Explorer` en la búsqueda rápida y en el menú contextual del lienzo sigue abriendo la búsqueda o cerrando el explorador, pero ninguno de ellos muestra un atajo, así que la descripción emergente del botón indica solo `Explorer`. La fila `Toggle Explorer` de la pestaña [Atajos de teclado](./settings.md#shortcuts) de Configuración tampoco muestra ninguna tecla. Si se reasigna, todos muestran la tecla nueva.
