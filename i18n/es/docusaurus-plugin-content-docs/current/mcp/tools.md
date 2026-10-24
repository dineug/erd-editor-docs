---
sidebar_position: 4
description: "Todas las herramientas que ofrece el servidor MCP de erd-editor: leer un documento página a página, las comprobaciones del diccionario, las 67 herramientas de edición, erd_batch y el aspecto de un resultado y de un rechazo."
---

# Herramientas

El servidor ofrece 77 herramientas: cinco herramientas de sesión, cuatro de lectura, 67 de edición, una por cada operación de edición, y `erd_batch`, que ejecuta varias herramientas de edición como una sola edición.

Todas las herramientas salvo `erd_list_documents` reciben como primer argumento el `path` del documento, y las tablas siguientes lo omiten.
Un argumento marcado con `?` es opcional.

## Herramientas de sesión {#session-tools}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_list_documents` | | Enumera los documentos ERD con `path`, `open`, `active`, `dirty` y `readonly`: los del editor que sirve el directorio de trabajo, que en un IDE de JetBrains abarca todos los proyectos abiertos, y, si no lo hay, los archivos ERD que hay dentro del directorio de trabajo. |
| `erd_open_document` | `create?` | Abre un documento para editarlo, en el ERD Editor del editor que lo sirve, si lo hay. Con `create`, primero crea el archivo si no existe, y un nombre sin extensión recibe `.erd.json`. |
| `erd_save` | | Guarda un documento que un editor tiene. VS Code mantiene sin guardar las ediciones del agente hasta que se llama a esta herramienta; Obsidian y un IDE de JetBrains las guardan como guardan las tuyas, y esta las escribe de inmediato. En modo headless, cada edición ya está escrita, como indica el `saved: true` de su resultado, y esta herramienta no hace nada. |
| `erd_undo` | | Revierte la última edición que hizo este agente, nunca las tuyas. Las llamadas que no crearon ninguna entrada de deshacer se omiten y se indican. |
| `erd_redo` | | Vuelve a aplicar la última edición que revirtió `erd_undo`. |

Consulta [En vivo y headless](./live-and-headless.md) para ver qué hacen el guardado y el deshacer en cada modo.

## Leer un documento {#reading-a-document}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Los ajustes y los recuentos y, a continuación, una página de tablas con sus índices y relaciones, cada tabla con su id, su posición y tamaño en el lienzo, su número de columnas, su nombre lógico si tiene uno y su grupo de tablas si pertenece a uno. Salvo cuando busca, tras las tablas vienen los grupos de tablas, las notas y luego los dominios, los términos y las palabras. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Las entidades indicadas, completas: las tablas con sus columnas y su grupo de tablas, las relaciones con sus columnas y sus `onDelete` y `onUpdate`, los índices con sus columnas, las notas con su texto, los grupos de tablas con sus tablas y las palabras, los términos y los dominios con todos sus campos. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | El documento entero de una vez en uno de cuatro formatos, o el DDL solo de algunas tablas o grupos de tablas. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Lo que los diccionarios de palabras, términos y dominios detectan como incorrecto, tal como lo enumera la hoja `Checks` de la pestaña Diccionario del editor, página a página. No cambia nada; consulta [Comprobaciones del diccionario](#dictionary-checks). |

Un agente encuentra los ids con `erd_list`, lee las columnas, las filas de los diccionarios y otros detalles con `erd_get` y pasa esos ids a las herramientas de edición.
El tamaño de una tabla en `erd_list` es el recuadro que ocupa en el lienzo: la altura, exacta; el ancho, aproximado.
Un grupo de tablas se enumera por el rectángulo que guarda, con su nombre, su color y el número de tablas que contiene.
Cada relación aparece una sola vez, con una de sus dos tablas.
Una fila de diccionario se enumera por su id, su `name` y lo que aporta a un nombre físico o a una columna: el `dataType` de un dominio, el `physicalName` y el `domainId` de un término y la `abbreviation` de una palabra. Cada diccionario enumera sus filas en el orden en que las muestra su hoja.
Los ajustes que indican `erd_list` y `erd_read` son los que guarda el archivo; consulta [Ajustes](#settings).

En `erd_get` y en el formato `snapshot` de `erd_read`, cada tabla y columna lleva su `logicalName`, una cadena vacía si no tiene ninguno, y `nameDerived`, que es `true` mientras el nombre lo dieron los diccionarios, de modo que un nuevo nombre lógico lo vuelve a derivar; consulta [Diccionarios](#dictionaries).
Cada columna lleva su `domainId`, y también cada término: una cadena vacía si no tiene ninguno o si es un dominio que el documento ya no enumera.

`erd_read` admite uno de cuatro formatos:

| `format` | Qué responde |
| --- | --- |
| `snapshot` | JSON compacto con cada entidad y su id, grupos de tablas y filas de palabras, términos y dominios incluidos, y los ajustes con los scripts del Esquema SQL. Omite lo que varía según quién lo vea: los anchos medidos, el orden de apilamiento, la vista, la pestaña y la vista de nombres. Es grande en un esquema extenso. |
| `sql` | DDL para una de las ocho bases de datos: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` o `SQLite`. El valor predeterminado de `vendor` es la base de datos configurada en el documento. El DDL del documento entero incluye sus scripts previos y posteriores. Con `tableIds`, `tableNames` o `groupNames`, solo esas tablas, con las claves externas que contienen, y sin scripts. Las claves externas llevan sus acciones ON DELETE y ON UPDATE, salvo las que omite la base de datos de destino; consulta [ON DELETE y ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | El documento entero exactamente como se escribe en el archivo al guardar, incluidas las ediciones que el editor aún no ha guardado; consulta [Forma de almacenamiento y valor en tiempo de ejecución](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Solo los scripts previos y posteriores del documento, como `{"before":"…","after":"…"}`, cada uno vacío si no está definido, por grande que sea el esquema. |

Solo el formato `sql` admite `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` y `groupNames`, y cualquier otro formato los rechaza.

- `statements`: `create`, el valor predeterminado; `ifNotExists`, que escribe `CREATE TABLE IF NOT EXISTS` en MySQL, MariaDB, PostgreSQL, SQLite y Databricks y un `CREATE TABLE` simple en las demás; o `recreate`, que elimina las tablas antes de crearlas, en cuyo caso Snowflake escribe en su lugar `CREATE OR REPLACE TABLE`.
- `header`: `none`, el valor predeterminado; `use`, que selecciona la base de datos o el esquema que indica el nombre de la base de datos del documento; o `createAndUse`, que primero lo crea. Oracle solo tiene `use`, así que allí `createAndUse` escribe `use`, y PostgreSQL solo tiene `createAndUse`, así que allí `use` no escribe ninguna cabecera. SQLite no escribe ninguna, y ninguna base de datos la escribe mientras el nombre de la base de datos esté vacío o no sea un identificador simple.
- `logicalNameAsComment`: `true` escribe el nombre lógico de una tabla o de una columna como su comentario mientras el comentario está vacío o solo contiene espacios en blanco, donde y en la forma en que cada base de datos escribe un comentario, y conserva todo comentario que contiene texto; `false`, el valor predeterminado, no escribe ningún nombre lógico; consulta [Nombres lógicos como comentarios](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: las tablas de los grupos de tablas indicados, por su nombre sin distinguir mayúsculas y minúsculas, sumadas a las de `tableIds` y `tableNames`. Un nombre que no coincide con ningún grupo se rechaza con `notFound`. Un grupo sin tablas no añade ninguna, y una lectura que se queda sin ninguna tabla, como cuando todos los grupos indicados están vacíos y no se indica ninguna tabla, se rechaza con `invalidArgs`.

`statements`, `header` y `logicalNameAsComment` se aplican también al DDL de algunas tablas. Funcionan como las opciones `Statements` y `Header` y el interruptor `Write logical names into empty comments` de la pestaña [Esquema SQL](../guide/guides/schema-sql.md#options-panel) del editor, aunque la pestaña empieza en `If not exists` y `CREATE + USE`. El interruptor empieza desactivado, igual que `logicalNameAsComment`.
Los nombres se entrecomillan con el tipo de delimitador que guarda el archivo, el bloqueado mientras `Bracket Type` está bloqueado; consulta [Bloqueo](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

También funcionan los esquemas de cientos o miles de tablas.
Una lectura responde con 40 000 caracteres como máximo, por debajo del límite a partir del cual Claude Code guarda aparte en un archivo el resultado de una herramienta.

- `erd_list` responde de forma predeterminada con una página de 100, primero las tablas y luego los grupos de tablas, las notas, los dominios, los términos y las palabras, con un único desplazamiento que los recorre todos, e indica dónde empieza la página siguiente con `nextOffset` y una `note`. Pasa ese `nextOffset` como `offset`, con la misma `query`.
- `query` encuentra tablas por palabras del nombre, el nombre lógico o el comentario de una tabla o columna, sin distinguir mayúsculas y minúsculas. Las tablas cuyos nombres o nombres lógicos contienen más de esas palabras aparecen primero. Una búsqueda no enumera grupos de tablas, notas ni filas de diccionario.
- `namesOnly` enumera solo los nombres de las tablas, unos 2000 nombres cortos en una respuesta.
- `erd_get` y `erd_read` admiten `tableNames` además de ids, y `erd_read` admite `groupNames`, así que un agente al que se le pide una consulta SQL sobre un esquema grande lee el DDL solo de las tablas que necesita.
- Los diccionarios también llegan por partes: `erd_list` recorre sus filas página a página después de las tablas, y `erd_get` da las filas completas por `domainIds`, `termIds` y `wordIds`.
- `erd_get` enumera en `missing` los ids y nombres que no designan nada, y en `notReturned` los ids que no caben en una respuesta, para volver a pedirlos.
- `erd_list_checks` responde página a página de la misma forma; consulta [Comprobaciones del diccionario](#dictionary-checks).
- Una lectura demasiado grande para una respuesta se rechaza con `tooLarge`, con indicaciones sobre cómo acotarla.

### Comprobaciones del diccionario {#dictionary-checks}

`erd_list_checks` enumera las comprobaciones de la [hoja Comprobaciones](../guide/guides/dictionary.md#the-checks-sheet) del editor, en el mismo orden: primero las comprobaciones de las palabras, después las de los términos y las de los dominios, cada diccionario en el orden en que lo muestra su hoja, y luego cada tabla seguida de sus columnas.
Como en la hoja, una comprobación solo se ejecuta mientras el diccionario que lee contiene alguna fila. Un documento cuyos diccionarios no contienen ninguna palabra, término ni dominio no se comprueba en absoluto: `total` es `0`, y la `note` lo indica.

- `level`: `error` o `warning`, solo para ese nivel; los dos de forma predeterminada.
- `tableIds` y `tableNames`: solo las comprobaciones de esas tablas y de sus columnas, con los nombres sin distinguir mayúsculas y minúsculas, lo que deja fuera las filas de los propios diccionarios. Un id o un nombre que no designa ninguna tabla se rechaza con `notFound`.
- `offset` y `limit`: una página de 100 comprobaciones de forma predeterminada, que también se corta donde se llena una respuesta. Mientras quedan más, `nextOffset` y una `note` indican dónde empieza la página siguiente; pásalo como `offset` con los mismos filtros. Después de corregir algunas comprobaciones, vuelve a enumerarlas desde el desplazamiento `0`: una comprobación corregida sale de la lista, así que un desplazamiento posterior se saltaría comprobaciones aún sin corregir.

La respuesta contiene `total`, cuántas comprobaciones conservan los filtros; `counts`, cuántas de ellas tiene cada código, sin incluir los códigos que no tienen ninguna; y la página como `checks`.
Cada comprobación da su `level`, su `code` y el `kind` y el `id` de su elemento: `table`, `column`, `word`, `term` o `domain`. La comprobación de una columna añade su `tableId` y el nombre de su tabla como `table`.
`name` es el nombre del elemento, el nombre físico de una tabla o de una columna, con su `logicalName` cuando lo tiene. `field` es lo que lee la comprobación: `name`, `logicalName` o `domainId`. `text` es lo que encontró allí, y `suggestions`, donde los diccionarios ofrecen alguna, es lo que se debe usar en su lugar. Así, un agente puede corregir una comprobación sin un `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` en la hoja | Qué detecta |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Un nombre que comparten dos filas de un mismo diccionario. Se enumera cada una de las filas. |
| `unknownDomain` | `error` | `Unknown domain` | Una columna o un término vinculado a un dominio que el documento ya no enumera. `text` es el nombre de ese dominio, o su id cuando no se conoce ningún nombre. |
| `forbiddenWord` | `error` | `Forbidden word` | Una palabra que alguna palabra incluye como prohibida, en el nombre lógico de una tabla o de una columna o en el nombre de un término. `suggestions` son las palabras estándar. |
| `unregisteredWord` | `warning` | `Unregistered word` | Texto que no figura en ninguna palabra, en los mismos lugares. |
| `synonymWord` | `warning` | `Synonym` | Un sinónimo usado en lugar de una palabra estándar, en los mismos lugares. `suggestions` son las palabras estándar. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Un nombre físico de una tabla o de una columna distinto del que da el término de su nombre lógico. La sugerencia es el nombre físico del término, o el que componen sus palabras mientras el término no tiene ninguno. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Una columna cuyo tipo de datos no es el del dominio al que está vinculada. `text` es el tipo de la columna, y la sugerencia, el del dominio. |

Cómo lee un nombre cada comprobación se explica en [Qué detecta cada comprobación](../guide/guides/dictionary.md#what-each-check-finds).

## Herramientas de edición {#edit-tools}

Los ids proceden de `erd_list` y `erd_get`, o de los `createdIds` de la llamada que creó la entidad.
Un id nuevo tiene 25 letras minúsculas y dígitos, como `03h17be2plxpj5n59tqag7ogj`, mientras que un id que ya tiene el documento conserva su forma, así que no deduzcas nada de la forma de un id.
`x` e `y` son los bordes izquierdo y superior en el lienzo, en píxeles, y un color es un color hexadecimal CSS como `#3b82f6`, o una cadena vacía, que quita el color.

### Tablas {#tables}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_table` | | Añade una tabla vacía en un sitio libre y devuelve su id en `createdIds`. |
| `erd_remove_table` | `tableId` | Elimina una tabla con sus columnas, sus índices y todas las relaciones en las que participa. |
| `erd_change_table_name` | `tableId`, `value` | Cambia el nombre de una tabla. El nombre pasa entonces a estar escrito a mano, así que un nombre lógico posterior lo deja como está mientras no esté vacío; consulta [Diccionarios](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Establece el comentario de una tabla. Una cadena vacía lo borra. |
| `erd_set_table_logical_name` | `tableId`, `value` | Establece el nombre lógico de una tabla. Una cadena vacía lo borra y deja el nombre. Mientras el nombre de la tabla está vacío o se derivó, los diccionarios lo derivan del nombre lógico; consulta [Diccionarios](#dictionaries). Un término no da ningún dominio a una tabla. |
| `erd_change_table_color` | `tableId`, `color` | Establece el color de una tabla. |
| `erd_move_table` | `tableId`, `x`, `y` | Mueve una tabla a una posición del lienzo. |
| `erd_move_tables` | `positions` | Mueve varias tablas en una sola edición, que un solo `erd_undo` revierte. `positions` contiene un `{ tableId, x, y }` por tabla, cada tabla como máximo una vez. |
| `erd_sort_tables` | | Coloca todas las tablas en filas a lo largo del lienzo, primero las que tienen menos columnas, como las colocan `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` y `erd_import_aml`. Las tablas de un grupo de tablas permanecen juntas, y el recuadro de cada grupo se ajusta a su alrededor. |

### Columnas {#columns}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Añade una columna vacía a una tabla y devuelve su id en `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Elimina columnas de una tabla, con las relaciones y las entradas de índice que las usan. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Cambia el nombre de una columna. El nombre pasa entonces a estar escrito a mano, como el de una tabla. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Establece el tipo de datos, como `INT` o `VARCHAR(255)`. Mientras el ajuste [Sincronizar el tipo de datos en las relaciones](../guide/guides/settings.md#relationship-datatype-sync) está activado, el cambio sigue las relaciones en ambos sentidos, como en el editor: un tipo serial llega a las claves externas como el tipo entero que almacena, tal como lo copia `erd_add_relationship`, y una clave serial conserva su tipo cuando cambia una de sus claves externas, lo que detiene ahí el cambio. Activar o desactivar la sincronización le corresponde al usuario, y `erd_list` la indica como `relationshipDataTypeSync`. Una columna vinculada a un dominio se desvincula de él cuando se le da un tipo distinto del del dominio, y lo mismo ocurre con cada columna a la que llega la sincronización cuyo nuevo tipo difiere del de su propio dominio; consulta [Desvincular](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Establece el valor predeterminado, como texto SQL. Una cadena vacía lo borra. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Establece el comentario. Una cadena vacía lo borra. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Establece el nombre lógico de una columna. Una cadena vacía lo borra y deja el nombre. Mientras el nombre de la columna está vacío o se derivó, los diccionarios lo derivan, y la columna se vincula al dominio que da un término y toma el tipo de datos del dominio; consulta [Diccionarios](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Vincula una columna a un dominio, indicado por id o por nombre, uno de los dos. La columna toma el tipo de datos del dominio, que sigue las relaciones mientras el ajuste Sincronizar el tipo de datos en las relaciones está activado, con la misma desvinculación que `erd_change_column_data_type`. Un `domainId` igual a `null` o a una cadena vacía, o un `domainName` vacío, desvincula la columna y conserva su tipo. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` hace que la columna forme parte de la clave principal, y `false` la saca de ella. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Establece si la columna es única. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Establece si la columna es `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Establece si la columna tiene incremento automático. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Mueve una columna dentro de su tabla a la posición de otra columna. |

### Relaciones {#relationships}

`relationshipType` es la cardinalidad en el extremo de la tabla hija: `ZeroOne`, `ZeroN`, `OneOnly` o `OneN`.
La tabla inicial es la tabla padre, el lado referenciado que contiene la clave principal, y la tabla final es la hija.
`onDelete` y `onUpdate` son las acciones ON DELETE y ON UPDATE de la clave externa: `none`, `noAction`, `cascade`, `setNull`, `setDefault` o `restrict`.
`none` no escribe ninguna cláusula, así que se aplica la acción predeterminada de la base de datos; consulta [ON DELETE y ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Una acción que se omite en `erd_add_relationship` o `erd_link_columns` es `none`.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona dos tablas. Copia la clave principal de la tabla padre en la hija como columnas de clave externa, y antes crea una columna de clave principal si la tabla padre no tiene ninguna. Cada columna de clave externa recibe el nombre que le da el editor al dibujar una relación: la clave `id` de `users` da `users_id`, y una clave como `member_id` conserva su nombre; consulta [Nombres de las columnas de clave externa](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada una copia el tipo de datos de su clave, salvo que una clave serial da el tipo entero que almacena, como `integer` para `serial4`, y un `serial` a secas sigue siendo `serial` fuera de PostgreSQL, MySQL y MariaDB; consulta [Relaciones identificadoras](../guide/guides/relationship-editing.md#identifying-relationships). Cada una toma también el nombre lógico de su clave y se vincula al dominio al que está vinculada su clave, salvo que una clave serial le dé otro tipo. `createdIds` contiene esa nueva columna de clave si se creó, las columnas de clave externa y, en último lugar, el id de la relación. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Dibuja una relación entre columnas que ya existen y empareja por posición las columnas iniciales y finales. No cambia el nombre de ninguna columna ni ningún tipo de datos, ni copia ningún nombre lógico ni dominio. |
| `erd_remove_relationship` | `relationshipId` | Elimina la línea de una relación. Sus columnas de clave externa permanecen en la tabla. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Cambia la cardinalidad de una relación. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Establece la acción ON DELETE de una relación: qué les ocurre a las filas hijas al eliminar una fila padre. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Establece la acción ON UPDATE de una relación: qué les ocurre a las filas hijas al cambiar una clave padre. |

`erd_add_relationship` da nombre a las columnas de clave externa y copia los nombres lógicos de sus claves en el momento en que se ejecuta. Un cambio de nombre o un nombre lógico posteriores en la clave no les llegan, así que pon nombre antes a la tabla padre y a su clave principal, y da antes a la clave su nombre lógico.
Los nombres que da cuentan como escritos a mano, así que un nombre lógico posterior los deja como están, mientras que `erd_derive_physical_names` los devuelve a los diccionarios; consulta [Diccionarios](#dictionaries).

Ninguna herramienta cambia las columnas de una relación existente como lo hace [Asignar columnas](../guide/guides/relationship-editing.md#map-columns) en el editor.
Para asignar una relación a otras columnas, ejecuta `erd_remove_relationship`, que deja sus columnas de clave externa en la tabla, y `erd_link_columns` con las columnas deseadas, en un solo `erd_batch`, que un solo `erd_undo` revierte.

### Índices {#indexes}

El id de una columna de índice es una entrada de la lista de columnas del índice que da `erd_get`, no el id de la columna de la tabla.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Añade un índice vacío a una tabla y devuelve su id en `createdIds`. |
| `erd_remove_index` | `indexId` | Elimina un índice. |
| `erd_change_index_name` | `indexId`, `value` | Cambia el nombre de un índice. |
| `erd_set_index_unique` | `indexId`, `value` | Establece si el índice es único. |
| `erd_add_index_column` | `indexId`, `columnId` | Añade una columna de la tabla del índice y devuelve el id de la nueva columna de índice. Una columna que ya está en el índice se deja como está. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Quita una columna de un índice. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Mueve una columna dentro de un índice a la posición de otra de sus columnas. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Establece el orden de una columna de un índice, `ASC` o `DESC`. |

### Notas {#memos}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_memo` | | Añade una nota vacía en un sitio libre y devuelve su id en `createdIds`. |
| `erd_remove_memo` | `memoId` | Elimina una nota. |
| `erd_change_memo_value` | `memoId`, `value` | Sustituye el texto de una nota. |
| `erd_change_memo_color` | `memoId`, `color` | Establece el color de una nota. |
| `erd_move_memo` | `memoId`, `x`, `y` | Mueve una nota a una posición del lienzo. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Cambia el tamaño de una nota. El ancho debe ser de al menos unos `116` píxeles y la altura, de al menos `100`. No crea ninguna entrada de deshacer, ya que el editor solo registra un cambio de tamaño de una nota cuando procede de un arrastre. |

Mientras las notas están ocultas con [Opciones de vista](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` sigue añadiendo una, que permanece oculta hasta que vuelven a mostrarse las notas.
`erd_list` y `erd_get` también enumeran las notas ocultas.

### Grupos de tablas {#table-groups}

Un grupo de tablas es un recuadro con nombre que se dibuja detrás de sus tablas, y su color se ve en el recuadro y en los encabezados de sus tablas; consulta [Grupos de tablas](../guide/guides/table-groups.md).
Una tabla está como máximo en un grupo. `erd_move_table`, `erd_move_tables` y `erd_move_table_group` nunca cambian qué tablas contiene un grupo, dondequiera que coloquen una tabla, mientras que en el editor una tabla entra en un grupo o sale de él según dónde se suelte; consulta [Añadir y quitar tablas](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` y `erd_set_table_group` ponen tablas en un grupo, y `erd_remove_table_group` deja sus tablas sin grupo.
Un grupo guarda un rectángulo de al menos `160` píxeles de ancho y `100` de alto, barra de título incluida, y el editor dibuja el recuadro ampliado para que contenga cada una de sus tablas.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Añade un grupo y devuelve su id en `createdIds`. Pasa `tableIds` o un rectángulo, con `x`, `y`, `width` y `height` juntos. Con `tableIds`, cada tabla sale del grupo en el que estuviera, y el rectángulo se ajusta a su alrededor como lo ajusta [agrupar las tablas seleccionadas](../guide/guides/table-groups.md#grouping-selected-tables). Un rectángulo incorpora todas las tablas sin grupo cuyo centro queda dentro de él, como hace [dibujar un grupo](../guide/guides/table-groups.md#drawing-a-group). Un `name` vacío deja el grupo sin nombre. Un solo `erd_undo` elimina el grupo y devuelve cada tabla al grupo en el que estaba. |
| `erd_remove_table_group` | `groupId` | Elimina un grupo. Sus tablas se quedan donde están, sin grupo. |
| `erd_change_table_group_name` | `groupId`, `value` | Cambia el nombre de un grupo. Una cadena vacía lo deja sin nombre. |
| `erd_change_table_group_color` | `groupId`, `color` | Establece el color de un grupo. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Mueve un grupo para que su rectángulo empiece en ese punto, con sus tablas desplazadas en la misma medida, como al arrastrar su barra de título. Un movimiento de menos de 20 píxeles, sumando el desplazamiento horizontal y el vertical, no crea ninguna entrada de deshacer. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Establece el rectángulo de un grupo, y sus tablas se quedan donde están. Si se omiten `x` e `y`, se conserva su esquina. Un rectángulo que no contendría las tablas del grupo con su margen interior se rechaza, con un mensaje que indica el recuadro que debe contener. |
| `erd_set_table_group` | `tableIds`, `groupId` | Pone tablas en un grupo, y cada una sale del grupo en el que estuviera. Un `groupId` igual a `null` o a una cadena vacía las saca de todos los grupos. |

Mientras los grupos están ocultos con `View Option` → `Table Groups`, estas herramientas siguen añadiendo y cambiando grupos, que permanecen ocultos hasta que se muestran los grupos; consulta [Ocultar grupos](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` mantiene juntas las tablas de cada grupo, `erd_import_dbml` y `erd_import_json` traen grupos —consulta [Importación](#import)— y `erd_read` escribe el DDL de los grupos elegidos con `groupNames`.
Una versión de ERD Editor anterior a los grupos de tablas descarta los grupos de un archivo al guardarlo, como hacen la extensión de VS Code anterior a la `4.0.0` y los plugins de Obsidian y JetBrains anteriores a la `1.0.0`; consulta [Actualizar](./installation.md#updating).

### Diccionarios {#dictionaries}

Estas herramientas editan los tres diccionarios de la pestaña [Diccionario](../guide/guides/dictionary.md) del editor, a partir de los cuales el nombre lógico de una tabla o de una columna deriva su nombre físico:

- Una palabra es una palabra estándar de las que se componen los nombres lógicos, con la abreviatura que escribe en un nombre físico, como `Member` y `MBR`.
- Un término es un nombre lógico completo con el nombre físico que da y, para una columna, el dominio que vincula, como `Member Number` con `MBR_NO` e `Identifier`.
- Un dominio es un tipo de datos con nombre al que se vinculan las columnas, como `Identifier` para `INT`.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Añade una palabra al final del diccionario de palabras y devuelve su id en `createdIds`. `synonyms` y `forbiddenWords` van separados por comas: otras formas de escribir la palabra y palabras que no se deben usar en su lugar. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Cambia los campos que se pasan y deja el resto. |
| `erd_remove_word` | `wordId` | Elimina una palabra. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Añade un término al final del diccionario de términos y devuelve su id en `createdIds`. Sin un `physicalName`, las palabras componen uno si pueden, como `MBR_NO` para `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Cambia los campos que se pasan y deja el resto. Un `name` que se pasa mientras el término no tiene ningún nombre físico, o con un `physicalName` vacío, también escribe el nombre físico que componen sus palabras, si componen alguno. |
| `erd_remove_term` | `termId` | Elimina un término. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Añade un dominio al final del diccionario de dominios y devuelve su id en `createdIds`. `category` agrupa los dominios, como `Number` o `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Cambia los campos que se pasan y deja el resto. Un nuevo `dataType` llega a todas las columnas vinculadas al dominio y sigue las relaciones mientras el ajuste Sincronizar el tipo de datos en las relaciones está activado, con la misma desvinculación que `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Elimina un dominio. Las columnas vinculadas a él conservan su tipo de datos, y ni ellas ni los términos vinculados a él muestran ningún dominio: su `domainId` se lee como una cadena vacía. `erd_undo` restaura los vínculos, y un guardado los omite del archivo. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Vuelve a derivar los nombres físicos a partir de los nombres lógicos, como hace [Volver a derivar los nombres físicos](../guide/guides/dictionary.md#derive-physical-names-again) en el editor, para una columna, una tabla o el documento entero. |

- Un diccionario contiene cada nombre una sola vez, así que un nombre que ya tiene otra fila del mismo diccionario se rechaza con `invalidArgs`. Los nombres se comparan sin los espacios de los extremos y distinguiendo mayúsculas y minúsculas, así que `Member` y `member` son dos nombres.
- Una actualización indica la fila por su id y pasa al menos un campo. Los valores que la fila ya tiene no cambian nada ni crean ninguna entrada de deshacer; una adición o una eliminación siempre crea una.
- El dominio de un término se indica o bien con `domainId`, con `null` o una cadena vacía para ninguno, o bien con `domainName`, con una cadena vacía para ninguno. Un `domainName` toma el primer dominio con ese nombre en el orden del diccionario, comparado como se comparan los nombres. Se rechaza pasar los dos, o un `domainName` que no tiene ningún dominio. `erd_set_column_domain` recibe un dominio de la misma forma.
- Cambiar o eliminar una palabra o un término no cambia el nombre de nada ni desvincula nada: los nombres y dominios que dio se quedan como están. `erd_derive_physical_names` vuelve a derivar los nombres y vincula el dominio que da ahora un término, pero una columna con la que ahora no coincide ningún término, o cuyo término no da ningún dominio, conserva el dominio al que está vinculada. `erd_set_column_domain` con un `domainId` vacío la desvincula.
- Ninguna herramienta importa ni exporta un diccionario como CSV, ordena un diccionario ni inserta filas en una posición, como hace la pestaña Diccionario.

`erd_list` enumera las filas, `erd_get` da todos sus campos, el formato `snapshot` de `erd_read` las contiene todas y `erd_list_checks` enumera lo que los diccionarios detectan como incorrecto; consulta [Leer un documento](#reading-a-document).

`erd_set_table_logical_name` y `erd_set_column_logical_name` derivan un nombre físico como lo hace el editor cuando se escribe un nombre lógico; consulta [Derivar nombres físicos](../guide/guides/dictionary.md#deriving-physical-names):

- Un nombre solo se deriva mientras está vacío o es a su vez un nombre derivado, lo que las lecturas muestran como `nameDerived: true`. Un nombre que no está vacío y se escribió a mano se conserva, y solo se escribe el nombre lógico. `erd_change_table_name`, `erd_change_column_name`, las importaciones de SQL, GraphQL, DBML y AML y las columnas de clave externa a las que da nombre `erd_add_relationship` escriben todos los nombres a mano. Un nombre cambiado a una cadena vacía lo vuelve a derivar el siguiente nombre lógico.
- Primero va el término cuyo nombre es el nombre lógico, comparado como se comparan los nombres de los diccionarios. Da su nombre físico, o el que componen sus palabras mientras no tiene ninguno. Para una columna, también vincula el dominio del término, aunque no se derive ningún nombre, y la columna toma el tipo de datos del dominio, que sigue las relaciones mientras el ajuste Sincronizar el tipo de datos en las relaciones está activado.
- Si no hay ese término, las palabras componen el nombre, con sus abreviaturas unidas por guiones bajos: `Member Number` da `MBR_NO`. Es todo o nada: un sinónimo, una palabra prohibida, un texto que no figura en ninguna palabra o una palabra sin abreviatura no componen nada, y el nombre se queda como estaba. Las palabras no vinculan ningún dominio, ni tampoco un término sin dominio, así que una columna conserva el dominio al que está vinculada.
- Una columna cuyo nombre derivado ya tiene otra columna de su tabla, sin distinguir mayúsculas y minúsculas, conserva su nombre, su `nameDerived` y su dominio.
- Borrar un nombre lógico deja el nombre físico como está. Una llamada cuyo nombre lógico, y lo que deriva, ya están establecidos no cambia nada ni crea ninguna entrada de deshacer.

`erd_derive_physical_names` recibe un `scope`: `column`, con `tableId` y `columnId`, para esa columna; `table`, con `tableId`, para el nombre de la tabla y todas sus columnas; o `document`, sin ningún id, para todas las tablas y sus columnas. Se rechaza un ámbito al que le falta un id que necesita o que recibe uno que no admite.
Cada nombre abarcado que tiene un nombre lógico vuelve a los diccionarios, incluido un nombre escrito a mano, y toma lo que estos dan ahora: el nombre físico de un término y, para una columna, su dominio y su tipo, o si no, la composición de las palabras, que deja como está el dominio de la columna. Un nombre lógico que no deriva nada deja el nombre como está, con `nameDerived` ahora en `true`. Un nombre sin nombre lógico se queda como está, igual que una columna cuyo nuevo nombre tiene otra columna de su tabla, como una segunda clave externa a una misma tabla, que también conserva su `nameDerived`. Un solo `erd_undo` revierte toda la llamada.
Los nombres de un esquema importado están escritos a mano, así que, para darle nombres a partir de los diccionarios, establece los nombres lógicos y después llama a `erd_derive_physical_names`. Esa llamada da el nombre físico propio de un término, que un cambio en las palabras del término no vuelve a componer. Así que, después de cambiar las palabras de un término, actualiza antes el término: pasa su `name` con un `physicalName` vacío para que las palabras lo compongan de nuevo, o pasa el nuevo `physicalName`.

Una versión de ERD Editor anterior a la pestaña Diccionario descarta los nombres lógicos, los vínculos con dominios y las filas de los diccionarios de un archivo al guardarlo, como hacen la extensión de VS Code anterior a la `4.2.0` y los plugins de Obsidian y JetBrains anteriores a la `1.2.0`. De ellos, la extensión `4.0.0` o `4.1.0` y los plugins `1.0.0` o `1.1.0` siguen editando en vivo con el servidor, pero no muestran ni conservan los nombres lógicos, los vínculos con dominios ni las filas de los diccionarios que escribe un agente; consulta [Actualizar](./installation.md#updating).

### Ajustes {#settings}

Un agente establece los ajustes del propio esquema: la base de datos, su nombre y los scripts del [Esquema SQL](../guide/guides/schema-sql.md).
Cualquier otro ajuste que guarda el documento lo establece el usuario en el editor: la [vista de nombres](../guide/guides/logical-names.md#name-view), los interruptores de [Opciones de vista](../guide/guides/table-related-functions.md#table-view-options), las opciones de la pestaña [Configuración](../guide/guides/settings.md), el lenguaje y los estilos de nombres del Generador de código, el tipo de delimitador y los [bloqueos](../guide/guides/settings.md#lock).
Ninguna herramienta los cambia, salvo las importaciones en modo `replace`: `erd_import_json` trae los ajustes y bloqueos del documento que carga, y las otras cuatro devuelven la vista al inicio del lienzo; consulta [Importación](#import).
El servidor `1.0.0` eliminó las herramientas que los establecían: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` y `erd_set_show`.

`erd_list` y el formato `snapshot` de `erd_read` indican los ajustes tal como los guarda el archivo, con `lockSettings`, que contiene un indicador por bloqueo: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` y `unlockNameViewMode`.
El último se interpreta al revés: es `false` mientras el bloqueo `Name View` está activado, como lo está en un documento nuevo y en un archivo guardado antes de que existiera ese bloqueo, y `true` en cuanto el usuario desactiva el bloqueo.
Un lenguaje, un estilo de nombres o un tipo de delimitador bloqueado se indica con su valor bloqueado, el que guarda el archivo y con el que se abre cualquier editor, muestre lo que muestre la pantalla de un editor. La vista, la pestaña y la vista de nombres no se indican. Un agente lee y escribe nombres lógicos sea lo que sea lo que muestre la vista de nombres.

`erd_set_ddl_script` crea una entrada de deshacer. `erd_set_database` y `erd_set_database_name` no crean ninguna, así que `erd_undo` no puede revertirlas.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_set_database` | `value` | Establece la base de datos: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` o `Snowflake`. Determina los tipos de datos de la base de datos y el DDL que escribe `erd_read` cuando no se indica `vendor`. |
| `erd_set_database_name` | `value` | Establece el nombre de la base de datos, que nombran las cabeceras `use` y `createAndUse` de `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Establece uno de los dos scripts que se escriben alrededor de las tablas; consulta [Scripts previos y posteriores](../guide/guides/schema-sql.md#before-and-after-scripts). `position` es `before`, que se escribe antes de las tablas, como `CREATE EXTENSION` o `CREATE SCHEMA`, o `after`, que se escribe después de ellas, como `GRANT` o `CREATE VIEW`. `sql` sustituye el script entero, de 10 000 caracteres como máximo, y una cadena vacía lo elimina. Lee antes el actual con el formato `scripts` de `erd_read`. |

Un script se incluye tal cual en el DDL de cualquier base de datos, así que escríbelo para la base de datos del documento. En MSSQL, se añade una línea `GO` tras un script cuya última línea no sea `GO`.
Una versión de ERD Editor anterior a estos scripts descarta los scripts de un archivo al guardarlo, como hacen la extensión de VS Code anterior a la `4.0.0` y los plugins de Obsidian y JetBrains anteriores a la `1.0.0`; consulta [Actualizar](./installation.md#updating).

### Importación {#import}

Estas herramientas leen un esquema como lo hace el menú Importar del editor; consulta [Importar o exportar archivos](../guide/guides/file-import-export.md).
Cada una recibe el texto como `value`, y `mode`: `replace`, el valor predeterminado, o `append`.

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Carga DDL de SQL, sentencias `CREATE TABLE` y similares. |
| `erd_import_graphql` | `value`, `mode?` | Carga un GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Carga DBML. Cada `TableGroup` se convierte en un grupo de tablas con las tablas que nombra; consulta [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Carga AML. |
| `erd_import_json` | `value`, `mode?` | Carga un documento JSON de erd-editor, como otro archivo `.erd.json`. |

`replace` ocupa el lugar del documento, y `erd_undo` restaura el anterior:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` y `erd_import_aml` sustituyen todas las tablas, relaciones, índices, notas y grupos de tablas. Conservan los ajustes del documento, bloqueos incluidos, salvo la vista, que vuelve al inicio del lienzo al 100 %, y conservan sus diccionarios de palabras, términos y dominios. Las tablas que traen no tienen nombres lógicos ni están vinculadas a ningún dominio.
- `erd_import_json` sustituye el documento entero, ajustes y diccionarios incluidos: los ajustes, los bloqueos, las palabras, los términos y los dominios del JSON ocupan el lugar de los de este documento, y un JSON que no registra bloqueos activa todos los bloqueos y coloca la vista al inicio del lienzo. Cada persona que lo ve conserva su propia vista de nombres, salvo que el JSON tenga desactivado el bloqueo `Name View`, lo que trae su vista de nombres. Para conservar los ajustes de este documento, parte del texto que da el formato `json` de `erd_read`. Un texto vacío da un documento nuevo, como el que crea `erd_open_document` con `create`.

`append` añade la importación al documento, como hace [Importar y añadir](../guide/guides/file-import-export.md#import-and-add) en el editor, y un solo `erd_undo` retira toda la adición:

- Lo que contiene el texto entra como entidades nuevas con ids nuevos, en un bloque debajo de todo lo que contiene el documento, notas ocultas y grupos de tablas incluidos, alineado con su borde izquierdo. Todas las tablas y ajustes que ya había se mantienen, incluida una tabla con el mismo nombre: nada se fusiona por nombre.
- Las relaciones y los índices solo llegan entre las tablas que trae la importación, así que se descarta una clave externa a una tabla que el texto no declara.
- `erd_import_sql`, `erd_import_graphql` y `erd_import_aml` añaden tablas con sus relaciones e índices, y `erd_import_dbml`, también sus grupos de tablas. `erd_import_json` añade tablas, relaciones, índices, notas y grupos de tablas, nunca sus ajustes, y rechaza un texto vacío. Sus tablas y columnas traen sus nombres lógicos, pero ninguna columna queda vinculada a un dominio, y no entra ninguna de las palabras, los términos ni los dominios del JSON.

Un documento JSON conserva su propia disposición, grupos de tablas incluidos: donde coloca sus tablas con `replace`, y dentro del bloque añadido con `append`.
Las tablas de SQL, GraphQL, DBML y AML se disponen en filas, primero las que tienen menos columnas y con las tablas de cada grupo juntas, como las coloca `erd_sort_tables`, nunca con `Flow` como las dispone la importación del propio editor cuando puede. Esas cuatro herramientas rechazan un texto vacío en cualquiera de los dos modos.

## erd_batch {#erd_batch}

`erd_batch` ejecuta varias herramientas de edición en orden como una sola edición, todas o ninguna.

- `operations` contiene hasta 100 entradas, cada una `{ tool, as?, args? }`, donde `tool` es una herramienta de edición y `args` son los argumentos de la herramienta sin `path`. Una herramienta de lectura, como `erd_list_checks`, se rechaza.
- Las operaciones se prueban primero en una copia del documento. Se indica la operación rechazada, como `operations[1] erd_remove_table: …`, y no se aplica nada.
- Un solo `erd_undo` revierte el lote entero, salvo las operaciones que no puede revertir, que indica el `undoNote` del resultado: las de una herramienta que no crea ninguna entrada de deshacer, como `erd_set_database`, y las que cambiaron el documento sin crear ninguna, como un `erd_move_table_group` corto. `erd_undo` omite un lote que no creó ninguna entrada de deshacer. `historyEntries` en el resultado cuenta las entradas del historial del editor que hay dentro del lote, no las llamadas a `erd_undo`.
- En una sesión en vivo, el editor acepta el lote entero o nada de él.

Un agente no puede conocer los ids que crea un lote antes de la llamada, así que una operación nombrada con `as` permite que una posterior se refiera a ellos: `$name` o `$name.0` para su primer id creado, `$name.1` para el segundo y `$name.last` para el último.
Un nombre contiene letras ASCII, dígitos y guiones bajos, no empieza por un dígito y nombra una sola operación.
Una referencia solo se resuelve donde un argumento admite un id de entidad, incluidos `wordId`, `termId` y `domainId`, así que un nombre o comentario que diga `$x` sigue siendo texto.
Un `domainName` también es texto, pero se lee cuando se ejecuta su operación, así que puede nombrar un dominio que añadió una operación anterior del lote.

Una tabla con sus columnas y una relación, en una sola llamada:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

`users` y su clave `id` reciben nombre antes de la relación, así que la columna de clave externa que esta añade a `orders` es `users_id`.

Palabras, un dominio y un término, y después una tabla que recibe sus nombres a partir de ellos mediante sus nombres lógicos:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

El término compone `MBR_NO` a partir de sus palabras, y la tabla recibe el nombre `MBR`. La columna `Member Number` toma el `MBR_NO` del término y su dominio, así que queda vinculada a `Identifier` con el tipo `INT`, y `Member Name`, que no tiene ningún término, se compone como `MBR_NM`.

## Resultados {#results}

Una edición responde con una línea de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` o `headless`; consulta [En vivo y headless](./live-and-headless.md). |
| `saved` | `true` en el resultado de cada edición headless, de `erd_batch`, de `erd_undo` y de `erd_redo`: el archivo contiene el cambio cuando la llamada responde, así que no queda nada por guardar. Un resultado en vivo no lleva `saved`, ya que el cambio lo tiene el editor; consulta [Guardar](./live-and-headless.md#saving). |
| `createdIds` | Los ids de lo que creó la llamada, en orden. |
| `batches`, `historyEntries` | Cuántos lotes de cambios envió la llamada y cuántas entradas del historial del editor creó. |
| `undoable`, `undoNote` | `undoable` es `false` cuando `erd_undo` va a omitir la llamada, y `undoNote` explica por qué: la herramienta no crea ninguna entrada de deshacer, la llamada cambió el documento sin crear ninguna, como hace un `erd_move_table_group` de menos de 20 píxeles, o el documento ya tenía ese valor. El resultado de un `erd_batch` siempre lleva un `undoNote`. Cuando el lote creó una entrada de deshacer, la nota indica que un solo `erd_undo` revierte el lote e indica cualquier operación que deje sin revertir; cuando no creó ninguna, el resultado lleva `undoable: false` y la nota indica que `erd_undo` lo omite. |
| `mismatch` | Aparece cuando la llamada creó un número de lotes o de entradas del historial distinto del que declara la herramienta. |
| `notes` | Aparece cuando algo de la sesión cambió, como un editor que se cerró o dejó de servir el documento, o un archivo que cambió en disco. |

Un rechazo es un resultado de error que lleva un código y un mensaje que indica qué hacer:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Motivo |
| --- | --- |
| `notFound` | Un id no designa nada vigente, o el archivo no existe. |
| `invalidArgs` | Falta un argumento o tiene un valor incorrecto. |
| `invalidPath` | La ruta no es un documento ERD. En Windows, también una ruta con un nombre que Windows no almacena tal como está escrito, o una que lleva a un documento que un editor tiene con otra ruta, que el mensaje indica. |
| `invalidDocument` | El archivo no es un documento que el editor pueda leer. |
| `tooLarge` | Una lectura no cabe en una respuesta. |
| `blocked` | Un editor con el hub desactivado tiene el documento. El mensaje indica cómo activarlo: en VS Code, confía en el área de trabajo y activa `dineug.erd-editor.agentHub.enabled`, o recarga la ventana; en Obsidian, activa Coding agents, o recarga Obsidian; en un IDE de JetBrains, activa Coding agents, o reinicia el IDE si ya está activado. |
| `hubDisabled` | Un IDE de JetBrains tiene el documento solo en un proyecto en el que no confía. Las lecturas siguen funcionando; confía en el proyecto para que el agente pueda editar. |
| `conflict` | El archivo cambió en disco durante la llamada. No se escribió nada. |
| `hubAppeared`, `hubGone` | Un editor empezó a servir un documento que el agente estaba editando en disco, o el editor que lo servía sigue en ejecución pero su archivo de bloqueo y su conexión han desaparecido. No se escribió nada. |
| `notSaved` | `erd_save` no pudo guardar el documento del editor. |
| `readonly` | El editor tiene el documento en modo de solo lectura, como un archivo en el que no puede escribir o que no puede leer como diagrama. Sin editor, el propio archivo es de solo lectura, como un archivo de Perforce o TFVC que no se ha desprotegido. No se escribió nada. |
| `protocolMismatch` | La extensión o el plugin ERD Editor del editor y el servidor hablan versiones distintas del protocolo, como el servidor `1.0.0` o posterior con una extensión de VS Code `3.x`. También se rechazan las lecturas, y el mensaje indica qué lado hay que actualizar; consulta [Actualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | El hub de un editor no aceptó la conexión, no respondió en 30 segundos o cortó la conexión durante la llamada. En Windows, `hubUnreachable` también significa que Windows impidió al agente acceder al hub: el editor se ejecuta con más privilegios que el agente, como cuando se inició como administrador y el agente no, o el agente se ejecuta en un entorno aislado. |

Otros códigos son menos frecuentes, y todo rechazo lleva un mensaje que indica qué ocurrió.

Las herramientas de edición, `erd_batch` y las cuatro herramientas de lectura rechazan un argumento que no declaran, o uno de un tipo incorrecto, con un error JSON-RPC de parámetros no válidos (`-32602`) antes de tocar el documento, así que un argumento mal escrito nunca se descarta en silencio.
Las cinco herramientas de sesión ignoran los argumentos que no conocen.
