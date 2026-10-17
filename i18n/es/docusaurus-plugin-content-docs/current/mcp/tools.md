---
sidebar_position: 4
description: "Todas las herramientas que ofrece el servidor MCP de erd-editor: leer un documento página a página, las 54 herramientas de edición, erd_batch y el aspecto de un resultado y de un rechazo."
---

# Herramientas

El servidor ofrece 63 herramientas: cinco herramientas de sesión, tres de lectura, 54 de edición, una por cada operación de edición, y `erd_batch`, que ejecuta varias herramientas de edición como una sola edición.

Todas las herramientas salvo `erd_list_documents` reciben como primer argumento el `path` del documento, y las tablas siguientes lo omiten.
Un argumento marcado con `?` es opcional.

## Herramientas de sesión {#session-tools}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_list_documents` | | Enumera los documentos ERD con `path`, `open`, `active`, `dirty` y `readonly`: los del editor que sirve el directorio de trabajo, que en un IDE de JetBrains abarca todos los proyectos abiertos, y, si no lo hay, los archivos ERD que hay dentro del directorio de trabajo. |
| `erd_open_document` | `create?` | Abre un documento para editarlo, en el ERD Editor del editor que lo sirve, si lo hay. Con `create`, primero crea el archivo si no existe, y un nombre sin extensión recibe `.erd.json`. |
| `erd_save` | | Guarda un documento que un editor tiene. VS Code mantiene sin guardar las ediciones del agente hasta que se llama a esta herramienta; Obsidian y un IDE de JetBrains las guardan como guardan las tuyas, y esta las escribe de inmediato. En modo headless, cada edición ya está escrita y esta herramienta no hace nada. |
| `erd_undo` | | Revierte la última edición que hizo este agente, nunca las tuyas. Las llamadas que no crearon ninguna entrada de deshacer se omiten y se indican. |
| `erd_redo` | | Vuelve a aplicar la última edición que revirtió `erd_undo`. |

Consulta [En vivo y headless](./live-and-headless.md) para ver qué hacen el guardado y el deshacer en cada modo.

## Leer un documento {#reading-a-document}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Los ajustes y los recuentos y, a continuación, una página de tablas con sus índices y relaciones, cada tabla con su id, su posición y tamaño en el lienzo, su número de columnas y su grupo de tablas si pertenece a uno. Salvo cuando busca, tras las tablas vienen los grupos de tablas y luego las notas. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Las entidades indicadas, completas: las tablas con sus columnas y su grupo de tablas, las relaciones con sus columnas y sus `onDelete` y `onUpdate`, los índices con sus columnas, las notas con su texto y los grupos de tablas con sus tablas. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | El documento entero de una vez en uno de cuatro formatos, o el DDL solo de algunas tablas o grupos de tablas. |

Un agente encuentra los ids con `erd_list`, lee las columnas y otros detalles con `erd_get` y pasa esos ids a las herramientas de edición.
El tamaño de una tabla en `erd_list` es el recuadro que ocupa en el lienzo: la altura, exacta; el ancho, aproximado.
Un grupo de tablas se enumera por el rectángulo que guarda, con su nombre, su color y el número de tablas que contiene.
Cada relación aparece una sola vez, con una de sus dos tablas.
Los ajustes que indican `erd_list` y `erd_read` son los que guarda el archivo; consulta [Ajustes](#settings).

`erd_read` admite uno de cuatro formatos:

| `format` | Qué responde |
| --- | --- |
| `snapshot` | JSON compacto con cada entidad y su id, grupos de tablas incluidos, y los ajustes con los scripts del Esquema SQL. Omite lo que varía según quién lo vea: los anchos medidos, el orden de apilamiento, la vista y la pestaña. Es grande en un esquema extenso. |
| `sql` | DDL para una de las ocho bases de datos: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` o `SQLite`. El valor predeterminado de `vendor` es la base de datos configurada en el documento. El DDL del documento entero incluye sus scripts previos y posteriores. Con `tableIds`, `tableNames` o `groupNames`, solo esas tablas, con las claves externas que contienen, y sin scripts. Las claves externas llevan sus acciones ON DELETE y ON UPDATE, salvo las que omite la base de datos de destino; consulta [ON DELETE y ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | El documento entero exactamente como se escribe en el archivo al guardar, incluidas las ediciones que el editor aún no ha guardado; consulta [Forma de almacenamiento y valor en tiempo de ejecución](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Solo los scripts previos y posteriores del documento, como `{"before":"…","after":"…"}`, cada uno vacío si no está definido, por grande que sea el esquema. |

Solo el formato `sql` admite `vendor`, `statements`, `header`, `tableIds`, `tableNames` y `groupNames`, y cualquier otro formato los rechaza.

- `statements`: `create`, el valor predeterminado; `ifNotExists`, que escribe `CREATE TABLE IF NOT EXISTS` en MySQL, MariaDB, PostgreSQL, SQLite y Databricks y un `CREATE TABLE` simple en las demás; o `recreate`, que elimina las tablas antes de crearlas, en cuyo caso Snowflake escribe en su lugar `CREATE OR REPLACE TABLE`.
- `header`: `none`, el valor predeterminado; `use`, que selecciona la base de datos o el esquema que indica el nombre de la base de datos del documento; o `createAndUse`, que primero lo crea. Oracle solo tiene `use`, así que allí `createAndUse` escribe `use`, y PostgreSQL solo tiene `createAndUse`, así que allí `use` no escribe ninguna cabecera. SQLite no escribe ninguna, y ninguna base de datos la escribe mientras el nombre de la base de datos esté vacío o no sea un identificador simple.
- `groupNames`: las tablas de los grupos de tablas indicados, por su nombre sin distinguir mayúsculas y minúsculas, sumadas a las de `tableIds` y `tableNames`. Un nombre que no coincide con ningún grupo se rechaza con `notFound`. Un grupo sin tablas no añade ninguna, y una lectura que se queda sin ninguna tabla, como cuando todos los grupos indicados están vacíos y no se indica ninguna tabla, se rechaza con `invalidArgs`.

`statements` y `header` se aplican también al DDL de algunas tablas. Funcionan como las opciones `Statements` y `Header` de la pestaña [Esquema SQL](../guide/guides/schema-sql.md#options-panel) del editor, aunque la pestaña empieza en `If not exists` y `CREATE + USE`.
Los nombres se entrecomillan con el tipo de delimitador que guarda el archivo, el bloqueado mientras `Bracket Type` está bloqueado; consulta [Bloqueo](../guide/guides/settings.md#lock).

### Esquemas grandes {#large-schemas}

También funcionan los esquemas de cientos o miles de tablas.
Una lectura responde con 40 000 caracteres como máximo, por debajo del límite a partir del cual Claude Code guarda aparte en un archivo el resultado de una herramienta.

- `erd_list` responde de forma predeterminada con una página de 100, primero las tablas, luego los grupos de tablas y luego las notas, e indica dónde empieza la página siguiente con `nextOffset` y una `note`. Pasa ese `nextOffset` como `offset`, con la misma `query`.
- `query` encuentra tablas por palabras del nombre o el comentario de una tabla o columna, sin distinguir mayúsculas y minúsculas. Las tablas cuyos nombres contienen más de esas palabras aparecen primero. Una búsqueda no enumera grupos de tablas ni notas.
- `namesOnly` enumera solo los nombres de las tablas, unos 2000 nombres cortos en una respuesta.
- `erd_get` y `erd_read` admiten `tableNames` además de ids, y `erd_read` admite `groupNames`, así que un agente al que se le pide una consulta SQL sobre un esquema grande lee el DDL solo de las tablas que necesita.
- `erd_get` enumera en `missing` los ids y nombres que no designan nada, y en `notReturned` los ids que no caben en una respuesta, para volver a pedirlos.
- Una lectura demasiado grande para una respuesta se rechaza con `tooLarge`, con indicaciones sobre cómo acotarla.

## Herramientas de edición {#edit-tools}

Los ids proceden de `erd_list` y `erd_get`, o de los `createdIds` de la llamada que creó la entidad.
Un id nuevo tiene 25 letras minúsculas y dígitos, como `03h17be2plxpj5n59tqag7ogj`, mientras que un id que ya tiene el documento conserva su forma, así que no deduzcas nada de la forma de un id.
`x` e `y` son los bordes izquierdo y superior en el lienzo, en píxeles, y un color es un color hexadecimal CSS como `#3b82f6`, o una cadena vacía, que quita el color.

### Tablas {#tables}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_table` | | Añade una tabla vacía en un sitio libre y devuelve su id en `createdIds`. |
| `erd_remove_table` | `tableId` | Elimina una tabla con sus columnas, sus índices y todas las relaciones en las que participa. |
| `erd_change_table_name` | `tableId`, `value` | Cambia el nombre de una tabla. |
| `erd_change_table_comment` | `tableId`, `value` | Establece el comentario de una tabla. Una cadena vacía lo borra. |
| `erd_change_table_color` | `tableId`, `color` | Establece el color de una tabla. |
| `erd_move_table` | `tableId`, `x`, `y` | Mueve una tabla a una posición del lienzo. |
| `erd_move_tables` | `positions` | Mueve varias tablas en una sola edición, que un solo `erd_undo` revierte. `positions` contiene un `{ tableId, x, y }` por tabla, cada tabla como máximo una vez. |
| `erd_sort_tables` | | Coloca todas las tablas en filas a lo largo del lienzo, primero las que tienen menos columnas, como las colocan `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` y `erd_import_aml`. Las tablas de un grupo de tablas permanecen juntas, y el recuadro de cada grupo se ajusta a su alrededor. |

### Columnas {#columns}

| Herramienta | Argumentos | Qué hace |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Añade una columna vacía a una tabla y devuelve su id en `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Elimina columnas de una tabla, con las relaciones y las entradas de índice que las usan. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Cambia el nombre de una columna. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Establece el tipo de datos, como `INT` o `VARCHAR(255)`. Mientras el ajuste [Sincronizar el tipo de datos en las relaciones](../guide/guides/settings.md#relationship-datatype-sync) está activado, el cambio sigue las relaciones en ambos sentidos, como en el editor: un tipo serial llega a las claves externas como el tipo entero que almacena, tal como lo copia `erd_add_relationship`, y una clave serial conserva su tipo cuando cambia una de sus claves externas, lo que detiene ahí el cambio. Activar o desactivar la sincronización le corresponde al usuario, y `erd_list` la indica como `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Establece el valor predeterminado, como texto SQL. Una cadena vacía lo borra. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Establece el comentario. Una cadena vacía lo borra. |
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
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Relaciona dos tablas. Copia la clave principal de la tabla padre en la hija como columnas de clave externa, y antes crea una columna de clave principal si la tabla padre no tiene ninguna. Cada columna de clave externa recibe el nombre que le da el editor al dibujar una relación: la clave `id` de `users` da `users_id`, y una clave como `member_id` conserva su nombre; consulta [Nombres de las columnas de clave externa](../guide/guides/relationship-editing.md#foreign-key-column-names). Cada una copia el tipo de datos de su clave, salvo que una clave serial da el tipo entero que almacena, como `integer` para `serial4`, y un `serial` a secas sigue siendo `serial` fuera de PostgreSQL, MySQL y MariaDB; consulta [Relaciones identificadoras](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` contiene esa nueva columna de clave si se creó, las columnas de clave externa y, en último lugar, el id de la relación. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Dibuja una relación entre columnas que ya existen y empareja por posición las columnas iniciales y finales. No cambia el nombre de ninguna columna ni ningún tipo de datos. |
| `erd_remove_relationship` | `relationshipId` | Elimina la línea de una relación. Sus columnas de clave externa permanecen en la tabla. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Cambia la cardinalidad de una relación. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Establece la acción ON DELETE de una relación: qué les ocurre a las filas hijas al eliminar una fila padre. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Establece la acción ON UPDATE de una relación: qué les ocurre a las filas hijas al cambiar una clave padre. |

`erd_add_relationship` da nombre a las columnas de clave externa en el momento en que se ejecuta, así que pon nombre antes a la tabla padre y a su clave principal.

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

### Ajustes {#settings}

Un agente establece los ajustes del propio esquema: la base de datos, su nombre y los scripts del [Esquema SQL](../guide/guides/schema-sql.md).
Cualquier otro ajuste que guarda el documento lo establece el usuario en el editor: los interruptores de [Opciones de vista](../guide/guides/table-related-functions.md#table-view-options), las opciones de la pestaña [Configuración](../guide/guides/settings.md), el lenguaje y los estilos de nombres del Generador de código, el tipo de delimitador y los [bloqueos](../guide/guides/settings.md#lock).
Ninguna herramienta los cambia, salvo las importaciones en modo `replace`: `erd_import_json` trae los ajustes y bloqueos del documento que carga, y las otras cuatro devuelven la vista al inicio del lienzo; consulta [Importación](#import).
El servidor `1.0.0` eliminó las herramientas que los establecían: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` y `erd_set_show`.

`erd_list` y el formato `snapshot` de `erd_read` indican los ajustes tal como los guarda el archivo, con `lockSettings`, que contiene un indicador por bloqueo: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` y `bracketType`.
Un lenguaje, un estilo de nombres o un tipo de delimitador bloqueado se indica con su valor bloqueado, el que guarda el archivo y con el que se abre cualquier editor, muestre lo que muestre la pantalla de un editor. La vista y la pestaña no se indican.

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

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` y `erd_import_aml` sustituyen todas las tablas, relaciones, índices, notas y grupos de tablas. Conservan los ajustes del documento, bloqueos incluidos, salvo la vista, que vuelve al inicio del lienzo al 100 %.
- `erd_import_json` sustituye el documento entero, ajustes incluidos: los ajustes y bloqueos del JSON ocupan el lugar de los de este documento, y un JSON que no registra bloqueos activa todos los bloqueos y coloca la vista al inicio del lienzo. Para conservar los ajustes de este documento, parte del texto que da el formato `json` de `erd_read`. Un texto vacío da un documento nuevo, como el que crea `erd_open_document` con `create`.

`append` añade la importación al documento, como hace [Importar y añadir](../guide/guides/file-import-export.md#import-and-add) en el editor, y un solo `erd_undo` retira toda la adición:

- Lo que contiene el texto entra como entidades nuevas con ids nuevos, en un bloque debajo de todo lo que contiene el documento, notas ocultas y grupos de tablas incluidos, alineado con su borde izquierdo. Todas las tablas y ajustes que ya había se mantienen, incluida una tabla con el mismo nombre: nada se fusiona por nombre.
- Las relaciones y los índices solo llegan entre las tablas que trae la importación, así que se descarta una clave externa a una tabla que el texto no declara.
- `erd_import_sql`, `erd_import_graphql` y `erd_import_aml` añaden tablas con sus relaciones e índices, y `erd_import_dbml`, también sus grupos de tablas. `erd_import_json` añade tablas, relaciones, índices, notas y grupos de tablas, nunca sus ajustes, y rechaza un texto vacío.

Un documento JSON conserva su propia disposición, grupos de tablas incluidos: donde coloca sus tablas con `replace`, y dentro del bloque añadido con `append`.
Las tablas de SQL, GraphQL, DBML y AML se disponen en filas, primero las que tienen menos columnas y con las tablas de cada grupo juntas, como las coloca `erd_sort_tables`, nunca con `Flow` como las dispone la importación del propio editor cuando puede. Esas cuatro herramientas rechazan un texto vacío en cualquiera de los dos modos.

## erd_batch {#erd_batch}

`erd_batch` ejecuta varias herramientas de edición en orden como una sola edición, todas o ninguna.

- `operations` contiene hasta 100 entradas, cada una `{ tool, as?, args? }`, donde `args` son los argumentos de la herramienta sin `path`.
- Las operaciones se prueban primero en una copia del documento. Se indica la operación rechazada, como `operations[1] erd_remove_table: …`, y no se aplica nada.
- Un solo `erd_undo` revierte el lote entero, salvo las operaciones que no puede revertir, que indica el `undoNote` del resultado: las de una herramienta que no crea ninguna entrada de deshacer, como `erd_set_database`, y las que cambiaron el documento sin crear ninguna, como un `erd_move_table_group` corto. `erd_undo` omite un lote que no creó ninguna entrada de deshacer. `historyEntries` en el resultado cuenta las entradas del historial del editor que hay dentro del lote, no las llamadas a `erd_undo`.
- En una sesión en vivo, el editor acepta el lote entero o nada de él.

Un agente no puede conocer los ids que crea un lote antes de la llamada, así que una operación nombrada con `as` permite que una posterior se refiera a ellos: `$name` o `$name.0` para su primer id creado, `$name.1` para el segundo y `$name.last` para el último.
Un nombre contiene letras ASCII, dígitos y guiones bajos, no empieza por un dígito y nombra una sola operación.
Una referencia solo se resuelve donde un argumento admite un id de entidad, así que un nombre o comentario que diga `$x` sigue siendo texto.

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

## Resultados {#results}

Una edición responde con una línea de JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Campo | Significado |
| --- | --- |
| `mode` | `live` o `headless`; consulta [En vivo y headless](./live-and-headless.md). |
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
| `protocolMismatch` | La extensión o el plugin ERD Editor del editor y el servidor hablan versiones distintas del protocolo, como el servidor `1.0.0` con una extensión de VS Code `3.x`. También se rechazan las lecturas, y el mensaje indica qué lado hay que actualizar; consulta [Actualizar](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | El hub de un editor no aceptó la conexión, no respondió en 30 segundos o cortó la conexión durante la llamada. En Windows, `hubUnreachable` también significa que Windows impidió al agente acceder al hub: el editor se ejecuta con más privilegios que el agente, como cuando se inició como administrador y el agente no, o el agente se ejecuta en un entorno aislado. |

Otros códigos son menos frecuentes, y todo rechazo lleva un mensaje que indica qué ocurrió.

Las herramientas de edición, `erd_batch` y las tres herramientas de lectura rechazan un argumento que no declaran, o uno de un tipo incorrecto, con un error JSON-RPC de parámetros no válidos (`-32602`) antes de tocar el documento, así que un argumento mal escrito nunca se descarta en silencio.
Las cinco herramientas de sesión ignoran los argumentos que no conocen.
