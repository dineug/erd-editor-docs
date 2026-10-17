---
sidebar_position: 6
description: Elimina una relación, cambia su tipo, define sus acciones ON DELETE y ON UPDATE, asígnala a columnas existentes con Asignar columnas, interpreta la notación de los conectores, trabaja con relaciones N:M e identificadoras y consulta cómo se nombran las nuevas columnas de clave externa.
---

# Edición de relaciones

Las relaciones se dibujan desde el menú contextual del lienzo, la barra de herramientas del lienzo, la [búsqueda rápida](./quick-search.md#what-the-palette-lists) o con un atajo de teclado; consulta [Empezar a editar](./editing-start.md).  
Esta página explica qué puedes hacer con una relación una vez creada, cómo [Asignar columnas](#map-columns) hace que termine en columnas que la tabla hija ya tiene y cómo se nombran las columnas de clave externa que añade.

## Eliminación {#deletion}

Se puede eliminar desde el menú contextual de la relación.

![Eliminar la relación de products a reviews desde su menú contextual](/img/demo-relationship-remove.webp)

No hay ningún atajo para ello, porque una relación no se selecciona como una tabla o una nota: `Delete` y `Backspace`, que eliminan lo seleccionado, nunca eliminan una relación por sí sola; consulta [Eliminación de tablas y notas](./table-related-functions.md#table-and-memo-deletion).  
Las relaciones también se eliminan junto con lo que conectan: al eliminar una tabla se eliminan todas las relaciones conectadas a ella y al eliminar una columna se eliminan todas las relaciones que la usan.

## Cambio de tipo {#type-change}

Se puede cambiar con la opción `Relationship Type` del menú contextual de la relación.  
Se ofrecen cuatro tipos y el actual lleva una marca de verificación:

- Zero One
- Zero N
- One Only
- One N

![Cambiar una relación de Zero N a One Only y luego a One N en su menú contextual](/img/demo-relationship-type.webp)

Son los mismos cuatro tipos con los que empiezas una relación, cada uno con su propio atajo; consulta [Empezar a editar](./editing-start.md).

## ON DELETE y ON UPDATE {#on-delete-and-on-update}

Se definen con `On Delete` y `On Update` en el menú contextual de la relación, entre `Relationship Type` y `Map Columns`.  
Cada uno ofrece las mismas seis opciones y la actual lleva una marca de verificación:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` no escribe ninguna cláusula, así que se aplica la acción predeterminada de la propia base de datos. Una relación nueva, dibujada o creada en [Asignar columnas](#map-columns), empieza con las dos acciones en `Not set`, y si más adelante eliges `Not set`, la acción se borra.  
Las dos son independientes: cambiar una deja la otra como está.  
El conector muestra lo que está definido; consulta [Cómo leer un conector](#reading-a-connector).  
Una relación copiada y pegada, o duplicada, junto con sus tablas conserva ambas acciones, y al importar Esquema SQL, DBML o AML se incorporan las acciones que declara el archivo; consulta [Importar o exportar archivos](./file-import-export.md).

![Definir ON DELETE CASCADE y ON UPDATE RESTRICT en la relación de orders a order_items desde su menú contextual, con su etiqueta que indica D:C U:R, y luego pasar el puntero por encima para volver a leer ambas](/img/demo-referential-actions.webp)

Todas las acciones se pueden elegir sea cual sea la base de datos.  
Una acción que la [base de datos](./table-related-functions.md#databases) seleccionada omite en su Esquema SQL lleva al lado una nota atenuada, como `not in MySQL`. `Not set` nunca lleva ninguna, y al cambiar la base de datos se actualizan las notas.  
Una acción con nota se sigue guardando en la relación: el conector la muestra y JSON, DBML y AML la conservan, pero el Esquema SQL de esa base de datos omite la cláusula, así que se aplica la acción predeterminada de la base de datos.

El [Esquema SQL](./schema-sql.md) escribe estas acciones y omite el resto:

| Base de datos | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | ninguna |
| PostgreSQL | las cinco | las cinco |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | las cinco | las cinco |

El Esquema SQL de Snowflake también escribe un comentario que nombra cada acción que omite; consulta [Acciones referenciales](./schema-sql.md#referential-actions).

Qué acciones escriben los destinos ORM del Generador de código depende tanto del destino como de la base de datos seleccionada; consulta [Generador de código](./code-generator.md#on-delete-and-on-update).

## Asignar columnas {#map-columns}

El cuadro de diálogo Asignar columnas empareja la clave de la tabla padre con columnas de la tabla hija, con una fila por cada columna de la clave.  
Cada fila usa una columna que la tabla hija ya tiene o añade una nueva columna de clave externa, de modo que una relación puede terminar en columnas que ya existen.

![Dibujar una relación Zero N de members a orders, elegir Map to existing columns y asignar id a la columna member_id existente](/img/demo-map-columns.webp)

Se abre de dos maneras:

- Al dibujar una relación, desde `Map to existing columns` junto a la tabla hija; consulta [Creación de relaciones](./editing-start.md#relationship-creation). Después, `Map` añade una relación del tipo que se está dibujando.
- Desde `Map Columns` en el menú contextual de la relación, para cambiar las columnas de una relación que ya existe. Después, `Save` escribe el cambio. Un editor de solo lectura no muestra esta opción.

El subtítulo del cuadro de diálogo indica las dos tablas y el tipo de relación, como `users → posts · One N`. Aquí el tipo se muestra, pero no se cambia; recurre a [Cambio de tipo](#type-change).

`References` elige la clave a la que apunta la relación: `Primary Key`, con sus columnas en el orden de la tabla, y luego `Unique: <column>` por cada columna marcada como `Unique`. Solo aparece cuando hay más de una opción.  
Aquí un índice único no cuenta como clave, y una columna `Unique` que constituye toda la clave principal no aparece dos veces.  
Al elegir otra clave se reconstruyen las filas. Una fila conserva su elección mientras esa columna siga en la tabla hija.

Bajo los encabezados `Referenced column` y `Foreign key column`, cada fila muestra una columna de la clave con su tipo de datos y una lista de las columnas de la tabla hija con las que emparejarla:

- `Pick a column` deja la fila vacía.
- `New column: <name>` añade una nueva columna de clave externa. El nombre que se muestra es el que recibirá, según se describe en [Nombres de las columnas de clave externa](#foreign-key-column-names), numerado teniendo en cuenta las columnas de la tabla hija y las demás filas que añaden una columna nueva. No se ofrece cuando el nombre quedaría vacío, como en el caso de una clave sin nombre.
- Cada columna de la tabla hija, en la forma `<name> (<data type>)`. Una columna que ya ha elegido otra fila indica `<name> (<data type>) · in use` y no se puede elegir, de modo que dos filas nunca comparten una. Una columna que ya usa otra relación sí se puede elegir, así que una columna como un `tenant_id` compartido puede servir a varias relaciones.

Con `Map`, una fila solo aparece ya rellenada cuando exactamente una columna de la tabla hija, sin distinguir mayúsculas y minúsculas, tiene el nombre que recibiría una nueva columna de clave externa para ella antes de cualquier numeración `_2`, como `users_id` para `id` en `users` y `member_id` para `member_id`. Mientras [`Bracket`](./schema-sql.md#database-and-bracket) sea `None`, el valor predeterminado, también cuenta el nombre formado a partir de la parte de tabla de un nombre de tabla cualificado con esquema, así que `id` en `public.users` se empareja con `public.users_id` o `users_id`. Para una clave `Unique`, también cuenta el propio nombre de la columna de la clave, así que `vin` se empareja con `vin`. Todas las demás filas empiezan en `Pick a column`.  
Con `Save`, cada fila empieza en la columna que la relación usa ahora. Con cualquiera de los dos, al elegir otra clave en `References` se rellenan las filas vacías de esa clave según los mismos nombres.

Cuando el tipo de datos de una columna elegida difiere del que la columna padre da a una clave externa, una nota bajo la fila lo indica.  
Con el ajuste [Sincronizar el tipo de datos en las relaciones](./settings.md#relationship-datatype-sync) activado y un tipo de datos en la columna padre, indica `<column> becomes <type>`, el tipo que escribirá la asignación. En caso contrario, indica `Types differ: <parent type> and <child type>` y la columna conserva su tipo.

El botón `Map` o `Save` permanece deshabilitado mientras haya algún impedimento, y una línea bajo las filas indica cuál:

- `Pick a foreign key column for every referenced column`: una fila sigue vacía.
- `At least one column must reference a different column`: una relación autorreferencial en la que cada fila elige su propia columna padre.
- `These columns are already linked by another relationship`: otra relación entre las mismas dos tablas vincula exactamente estas columnas.
- `<parent> has no key to reference`: con `Map`, la tabla padre no tiene ni clave principal ni columna `Unique`.

`Save` también permanece deshabilitado hasta que la asignación difiera de la actual de la relación.  
Con `Save`, una fila indica `(removed)` cuando su columna ya no está en su tabla. Elige otra columna de la tabla hija o, si lo que ha desaparecido es una columna padre, elige una clave en `References`. Con `Map`, una fila cuya columna elegida se elimina vuelve a `Pick a column`.

Si las columnas padre de una relación no son exactamente una de las claves de la tabla padre, el cuadro de diálogo se abre con una opción adicional seleccionada al final de `References`, `Current columns (not a key)`, que conserva esas columnas tal como están. Cuando la tabla padre no tiene ninguna clave, esa es la única opción y `References` no se muestra.  
En ese caso, la línea `The referenced columns are not a key of <parent>`, o `<parent> has no key to reference` cuando la tabla padre no tiene ninguna clave, es un aviso, no un error: `Save` sigue funcionando, así que puedes cambiar las columnas de la tabla hija y conservar la referencia.  
Una relación cuyas dos listas de columnas no se pueden emparejar, por ejemplo porque tienen distinta longitud, muestra filas `(invalid)` y mantiene `Save` deshabilitado hasta que elijas una clave en `References` o, si la tabla padre no tiene ninguna, le añadas una clave principal o una columna `Unique`.

Mientras está abierto, el cuadro de diálogo sigue el diagrama, incluidas las ediciones de un colaborador o de un agente de programación, y conserva lo que has elegido.  
Si mientras tanto cambian las columnas de la relación o la clave con la que se abrió, añade la línea `This relationship changed while the dialog was open`.

Qué escriben `Map` y `Save`:

- `Map` añade la relación con `On Delete` y `On Update` en `Not set`. `Save` cambia solo las columnas de la relación, apunta su lado padre a la clave elegida en `References` y conserva su tipo y sus acciones ON DELETE y ON UPDATE.
- Una fila `New column` añade una columna al final de la tabla hija, igual que al dibujar: `NOT NULL`, con un nombre basado en su clave y con el tipo de datos, el valor predeterminado y el comentario de la clave; consulta [Relaciones identificadoras](#identifying-relationships).
- A una columna elegida nunca se le cambia el nombre, y su `Not Null`, su clave principal, su `Unique`, su valor predeterminado y su comentario se quedan como están. Su tipo de datos solo cambia mientras el ajuste `Relationship DataType Sync` esté activado y la columna padre tenga un tipo de datos: toma el tipo que la columna padre da a una clave externa —el tipo entero para una clave serial, igual que en una columna nueva—, y el cambio se propaga por las relaciones igual que en la sincronización.
- Una columna que la asignación deja de usar permanece en la tabla hija y deja de estar marcada como clave externa, salvo que otra relación siga terminando en ella.
- Todo lo que escribe un `Map` o un `Save`, incluidas las columnas nuevas y los cambios de tipo, es un solo paso de deshacer.

Si la relación es identificadora y cómo se dibuja su extremo padre se deducen de las columnas asignadas de la tabla hija, como en cualquier relación. Asignarla a las columnas de clave principal de la tabla hija la hace identificadora de inmediato, y asignarla a una columna que admite `NULL` pone un círculo en el extremo padre; consulta [Cómo leer un conector](#reading-a-connector).  
La clave externa del Esquema SQL hace referencia a la clave que has elegido, como `REFERENCES vehicle (vin)` para una clave `Unique`.

Si el diagrama ya contiene la asignación cuando pulsas `Map` o `Save`, porque un colaborador o un agente de programación se ha adelantado, no se escribe nada.  
Si ha cambiado de forma que la asignación ya no encaja, no se escribe nada y una notificación indica `Couldn't map columns: the diagram changed`.

`Cancel`, el botón `x`, `Escape` o un clic en la zona atenuada fuera del cuadro de diálogo lo cierran sin escribir nada.  
La zona atenuada cubre todo el editor, incluida la barra de herramientas, y un [explorador](./explorer.md#dialogs-beside-it) abierto sigue abierto debajo.  
Abrir la búsqueda rápida también cierra el cuadro de diálogo, al igual que salir de la pestaña ERD o que el editor pase a ser de solo lectura.  
`Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) también lo cierra y pone el cursor de texto en el campo Buscar de la [búsqueda](./find-and-replace.md#opening-and-closing) del explorador, y abre el explorador si está cerrado. En un editor demasiado estrecho para mostrar el explorador, sigue cerrando el cuadro de diálogo, pero muestra una notificación en lugar de mover el cursor de texto; consulta [Abrir y cerrar](./explorer.md#opening-and-closing).  
Si una de sus tablas o la relación se eliminan mientras está abierto, se cierra con una notificación como `Map Columns closed: the relationship was removed`.  
Mientras está abierto, no funcionan ni los atajos del lienzo, ni deshacer y rehacer, ni copiar y pegar.

Un agente de programación no tiene ninguna herramienta equivalente a Asignar columnas. Para volver a asignar una relación, la elimina con `erd_remove_relationship`, que conserva sus columnas de clave externa, y la vuelve a dibujar sobre columnas existentes con `erd_link_columns`, ambas cosas en un solo `erd_batch`; consulta [Herramientas](../../mcp/tools.md#relationships).

## Relaciones N:M {#nm-relationships}

Como el editor se basa en el modelo físico, una relación N:M se expresa con una tabla intermedia, como se muestra a continuación.

![Dibujar relaciones desde products y luego desde tags hacia la tabla vacía product_tags con ⌘ + ⌥ + 2, que añaden product_id y luego tag_id](/img/demo-relationship-n-m.webp)

Cuando la tabla intermedia ya tiene sus columnas de clave, como `product_id` y `tag_id` en `product_tags`, dibuja cada relación con `Map to existing columns` y elige esas columnas en lugar de añadir otras nuevas; consulta [Asignar columnas](#map-columns). Si forman la clave principal de la tabla intermedia, cada relación es identificadora de inmediato.

Importar GraphQL, DBML o AML crea la tabla intermedia por ti.  
Una declaración de muchos a muchos llega como una tabla llamada `<left>_<right>`, con el comentario `Junction table inferred from <left> <-> <right>`, unida a ambos lados mediante relaciones identificadoras.  
Consulta [Importar o exportar archivos](./file-import-export.md).

## Relaciones identificadoras {#identifying-relationships}

Al dibujar una relación haciendo clic en la tabla hija, o con `Create new columns`, cada clave principal de la tabla padre se copia en la tabla hija como una columna de clave externa `NOT NULL`, así que una relación nueva empieza siendo no identificadora.  
La copia toma el tipo de datos, el valor predeterminado y el comentario de la clave, pero no `Unique` ni `Auto Increment`, y recibe el nombre que se describe en [Nombres de las columnas de clave externa](#foreign-key-column-names).  
Una clave serial es la excepción en cuanto al tipo de datos: su copia toma el tipo entero que almacena el serial. Con cualquier base de datos, `smallserial` y `serial2` dan `smallint`, `serial4` da `integer`, y `bigserial` y `serial8` dan `bigint`. Un `serial` a secas da `integer` con PostgreSQL y `bigint unsigned` con MySQL y MariaDB, y se queda en `serial` con cualquier otra base de datos.  
Solo cuenta el nombre de tipo completo, sin distinguir mayúsculas y minúsculas, así que `serial(4)` se copia tal como está escrito. Un tipo escrito en mayúsculas da mayúsculas: `SERIAL` da `INTEGER` con PostgreSQL. Una columna de clave externa que ya tiene el tipo `serial` en un diagrama guardado conserva ese tipo.  
Para que la relación sea identificadora, define esas columnas de clave externa de la tabla hija como claves principales: selecciónalas todas y pulsa `Alt + K` (Windows/Linux) o `⌥ + K` (Mac) una vez, o elige `Primary Key` en el menú contextual de la tabla, que indica `Primary Key on selected columns` mientras hay dos o más seleccionadas; consulta [Clave principal de columna](./table-editing.md#column-primary-key).

![Activar y desactivar product_id como clave principal con Alt + K, con lo que su conector pasa a línea continua y luego a discontinua](/img/demo-identifying-relationship.webp)

El editor mantiene esto sincronizado por sí solo.  
Una relación es identificadora mientras todas las columnas de su lado hijo son clave principal, y pasa a ser no identificadora en cuanto una de ellas no lo es.

## Nombres de las columnas de clave externa {#foreign-key-column-names}

Al dibujar una relación, cada columna de clave externa que se añade recibe un nombre basado en la clave padre que esa columna copia:

- Un nombre de clave de una sola palabra, como `id`, `ID` o `uuid`, recibe delante el nombre de la tabla padre y un guion bajo: `id` en `products` pasa a ser `products_id`.
- Un nombre de clave de varias palabras, como `member_id`, `userId` o `UserID`, se mantiene tal cual.
- Un nombre de clave de una sola palabra que coincide con el propio nombre de la tabla, sin distinguir mayúsculas y minúsculas, también se mantiene: `currency` en `currency` sigue siendo `currency`. Una clave que simplemente contiene el nombre de la tabla sí recibe el prefijo: `username` en `user` pasa a ser `user_username`.

Un nombre es una sola palabra cuando solo contiene letras y dígitos, sin ningún cambio de mayúsculas y minúsculas.  
Cualquier otro carácter lo divide, así que `_id`, `order no` y `order-no` son varias palabras.  
También lo divide un cambio de mayúsculas y minúsculas, interpretado como en camelCase: una minúscula seguida de una mayúscula (`userId`), dos mayúsculas seguidas de una minúscula (`IDCard`, `IDs`) o una letra de una escritura sin mayúsculas ni minúsculas, como el hangul, el kana o los caracteres han, junto a una letra que sí las tiene (`회원ID`).  
Los dígitos no dividen una palabra, así que `id2` y `SHA256` son una sola palabra. Un compuesto escrito todo en minúsculas o todo en mayúsculas también es una sola palabra: `memberid` en `members` pasa a ser `members_memberid`.

El nombre de la tabla se usa tal como está escrito, salvo los espacios del principio y del final: se conservan sus mayúsculas y minúsculas, sus espacios interiores y sus puntos, no se pasa a singular, y `Table Name Case` y `Column Name Case` del Generador de código no intervienen. `Users` con la clave `ID` da `Users_ID`.  
Cada columna de una clave compuesta se nombra por separado: `orders` con la clave (`tenant_id`, `id`) añade `tenant_id` y `orders_id`.

Un nombre que la tabla hija ya tiene, sin distinguir mayúsculas y minúsculas, se numera con `_2`, `_3`, etc., y toma el primer número que esté libre.  
Una segunda relación desde `users`, con la clave `id`, hacia la misma tabla añade `users_id_2`, y una autorreferencia en `members`, con la clave `member_id`, añade `member_id_2`.  
Las columnas de una misma clave compuesta se numeran entre sí de la misma manera, y un nombre que se mantiene tal cual ocupa su lugar primero: `user` con la clave (`id`, `user_id`) añade `user_id` para `user_id` y `user_id_2` para `id`.

Una tabla padre sin nombre deja el nombre de la clave tal cual, numerado como cualquier otro en caso de coincidencia.  
Una clave sin nombre da una columna de clave externa sin nombre.  
Eso incluye la clave principal que el editor añade a una tabla padre que no tiene ninguna, salvo que le des un nombre antes de hacer clic en la tabla hija.

Los nombres se fijan al dibujar la relación. Cambiar después el nombre de la tabla padre o de su clave no les cambia el nombre.  
Las filas `New column` de [Asignar columnas](#map-columns) se nombran con las mismas reglas, y la lista muestra cada nombre antes de que lo elijas.  
Las relaciones que llegan con sus columnas ya creadas —desde una importación, un pegado, un duplicado o Asignar columnas al emparejar columnas existentes— conservan los nombres que tienen esas columnas.  
Un agente de programación que añade una relación con `erd_add_relationship` obtiene los mismos nombres y tipos de datos; consulta [Herramientas](../../mcp/tools.md#relationships).

## Cómo leer un conector {#reading-a-connector}

- Una relación identificadora se dibuja con una línea continua; una no identificadora, con una línea discontinua.
- El extremo hijo lleva el símbolo de cardinalidad del tipo de relación: un círculo y una barra para Zero One, un círculo y una pata de gallo para Zero N, dos barras para One Only y una barra y una pata de gallo para One N.
- El extremo padre es un círculo y una barra, como Zero One, cuando alguna de las columnas de clave externa admite `NULL`, y dos barras, como One Only, cuando todas son `NOT NULL`.
- Al pasar el puntero por encima de un conector, este se resalta junto con las columnas que vincula en ambas tablas.

![Pasar el puntero por encima de tres conectores, uno tras otro, que se iluminan junto con las columnas que vinculan](/img/demo-relationship-hover.webp)

Una relación que define [ON DELETE u ON UPDATE](#on-delete-and-on-update) lleva una etiqueta junto a su extremo hijo, como `D:C U:R`: `D:` y la acción ON DELETE, y luego `U:` y la acción ON UPDATE, cada una solo cuando está definida.  
Las acciones se abrevian según la notación de erwin: `C` para CASCADE, `R` para RESTRICT, `SN` para SET NULL, `SD` para SET DEFAULT y `NA` para NO ACTION. Una relación que no define ninguna de las dos no tiene etiqueta.  
La etiqueta se sitúa en el lado opuesto a la tabla hija, por encima de la línea cuando el conector sale por el lado izquierdo o derecho de esa tabla y a su derecha cuando sale por arriba o por abajo, sin tapar el símbolo de cardinalidad.  
Se dibuja con el color del conector sobre un pequeño recuadro del color de fondo del lienzo, y se ilumina junto con su conector. Las etiquetas se dibujan encima de todos los conectores, así que una línea que cruza una pasa por debajo de ella.  
Muestra la acción guardada en la relación, independientemente de lo que escriba la base de datos seleccionada, así que ON DELETE SET DEFAULT sigue indicando `D:SD` en MySQL.

Al pasar el puntero por encima de un conector que define alguna de las dos acciones, también aparece una descripción emergente que muestra las cláusulas completas, una por línea, como `ON DELETE CASCADE` y `ON UPDATE RESTRICT`.  
La descripción emergente aparece incluso mientras la etiqueta está oculta.

Ir a una relación la ilumina: al elegir una fila bajo la carpeta `Foreign Keys` de una tabla en el [explorador](./explorer.md#going-to-a-row), o una fila de clave externa en el [visor de diferencias](./table-related-functions.md#going-to-a-change), su conector y su etiqueta se dibujan con el mismo color que al pasar el puntero por encima. En el visor de diferencias se ilumina el conector en cada lado que contiene la relación, así que una clave externa añadida ilumina solo el lado actual y una eliminada, solo el lado guardado.  
El salto selecciona solo la tabla hija con sus columnas de clave externa, con la celda con el foco en la primera de ellas; la relación en sí sigue sin seleccionarse nunca. Para saber adónde va la vista, consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands).  
La iluminación se apaga con la siguiente pulsación del botón izquierdo o derecho en el lienzo, ya sea en un espacio vacío, una tabla, una nota, un grupo de tablas o un conector, incluso con una pulsación que deja la selección como estaba. También se apaga al ir a otra fila o a otra coincidencia de búsqueda en el explorador, y al ir a otra fila en el visor de diferencias, en cada lado al que va esa fila.  
Desplazar la vista con el botón central o con la herramienta Mano la deja iluminada, y lo mismo ocurre al contraer o expandir una fila en el explorador o en el visor de diferencias, al anular la selección con `Escape` y con un salto desde la [búsqueda rápida](./quick-search.md) o desde el [botón de la tarjeta](./visualization.md#card-buttons) de Flow con el icono de enlace externo.  
La iluminación no se guarda ni figura en el historial de deshacer, y los colaboradores no la ven.

Oculta los conectores en el lienzo ERD con la opción de vista `Relationship`, o solo sus etiquetas con la opción de vista `Referential Actions`, que está activada de forma predeterminada; consulta [Opciones de vista de tabla](./table-related-functions.md#table-view-options).  
Las etiquetas no se dibujan al `70%` ni por debajo, donde las tablas se reducen a su nombre.  
Una [exportación de imagen](./file-import-export.md#image) siempre se dibuja al 100 %, así que dibuja las etiquetas sea cual sea el zoom del lienzo, salvo que una opción de vista las oculte. Con `Background` desactivado, el recuadro que hay detrás de cada etiqueta también es transparente.  
El [modo Flow](./visualization.md#flow-mode) de la pestaña Visualización dibuja los conectores incluso con `Relationship` desactivado, cada uno como una única curva suave, continua y gris con las mismas marcas en los extremos, así que la línea discontinua, las etiquetas, la descripción emergente, la iluminación tras un salto y el trazado en ángulo recto descritos en esta página solo se aplican al lienzo ERD. Una relación de una tabla consigo misma también se curva alrededor de la esquina superior derecha en Flow; consulta [Trazado de los conectores](#connector-routing).

## Trazado de los conectores {#connector-routing}

Los conectores se trazan en ángulo recto.  
Un trazado rodea las tablas que hay entre sus dos extremos en lugar de cruzarlas, y sus esquinas son redondeadas.  
Cada extremo sale de su tabla con un breve tramo recto antes de girar, así que dos tablas a poca distancia cuyos extremos de conector están alineados se unen con una sola línea recta en lugar de con un rodeo.  
Los trazados que salen por el mismo lado de una tabla se reparten en pasillos separados para que no discurran unos sobre otros.  
Solo se evitan las tablas: un conector puede cruzar una nota o el recuadro de un grupo de tablas, y se dibuja por encima de los grupos de tablas y por debajo de las tablas y las notas.

Una relación de una tabla consigo misma se dibuja como una única curva alrededor de la esquina superior derecha de la tabla, que sale por el lado superior en el extremo padre y entra por el lado derecho en el extremo hijo.  
Las demás autorreferencias de la misma tabla se anidan por fuera de la primera, así que sus curvas no se cruzan entre sí ni con la tabla.

No hay nada que configurar.  
Los trazados se recalculan automáticamente cada vez que algo del lienzo se mueve o cambia de tamaño, así que nunca hace falta retocarlos a mano.

![Arrastrar la tabla members hacia abajo y de vuelta mientras el conector desde orders alterna entre pasar a la derecha de categories y rodearla por la izquierda, con todas las esquinas redondeadas](/img/demo-connector-routing.webp)
