---
sidebar_position: 12
description: Lee el DDL del diagrama en la pestaña Esquema SQL, elige la base de datos, el entrecomillado, las sentencias, la cabecera, los nombres lógicos en los comentarios vacíos y las tablas en su panel de opciones, añade tus propios scripts antes y después de las tablas y guarda o copia el SQL.
---

# Esquema SQL

La pestaña `Schema SQL` muestra el DDL del diagrama para la base de datos seleccionada: el SQL que crea sus tablas con sus claves, índices y claves externas.  
Cambia a la pestaña `Schema SQL` en la barra de herramientas o, en la [búsqueda rápida](./quick-search.md), elige `Schema SQL` en `Tab`. Elegir `Schema SQL` en el submenú `Export` también la abre, lista para guardar; consulta [Guardar o copiar el SQL](#saving-or-copying-the-sql).

El SQL está a la izquierda y, a su derecha, un panel de opciones con el título `Schema SQL` reúne las opciones que le dan forma; consulta [Panel de opciones](#options-panel). También en un idioma de la interfaz de derecha a izquierda, el SQL sigue a la izquierda y se lee de izquierda a derecha.  
El panel se abre solo, salvo que el editor tenga menos de 640 px de ancho cuando la pestaña se abre por primera vez. `Hide options`, en el encabezado del panel, lo contrae, y `Show options`, arriba a la derecha del código, lo vuelve a mostrar. Después sigue abierto o contraído tal como lo dejaste, aunque cambies de pestaña, mientras el editor siga abierto. Se contrae y se abre con independencia del panel de la pestaña Generador de código, y nunca se guarda en el archivo.

![Abrir Export > Schema SQL, cambiar las sentencias a Drop & re-create y la cabecera a USE y, luego, añadir un script SET NAMES antes de las tablas](/img/demo-schema-sql-options.webp)

Haz clic con el botón derecho en el SQL para abrir su menú contextual:

- `Database` y `Bracket`, cada uno un submenú que marca el valor actual.
- `Statements` y `Header`, cada uno un submenú que marca la opción vigente. Una opción que la base de datos no tiene lleva una nota atenuada, como `not in Oracle`, y no hace nada.
- `Options panel`, marcada mientras el panel está visible, que lo contrae o lo abre.
- `Save file`

Mientras esta pestaña está abierta, la búsqueda rápida ofrece `Database` y `Bracket`; `Schema SQL: Statements` y `Schema SQL: Header`, que solo enumeran las opciones que tiene la base de datos; y `Schema SQL: Options panel`, que contrae o abre el panel.  
Ni el menú contextual ni la búsqueda rápida ofrecen `Write logical names into empty comments`, que solo está en el panel de opciones; consulta [Nombres lógicos como comentarios](#logical-names-as-comments).

El SQL se escribe al abrirse la pestaña y de nuevo cada vez que cambia una de las opciones del panel, el nombre de la base de datos o un script. Una edición de las tablas hecha mientras la pestaña está abierta, como la de un colaborador o la de un agente de programación, se muestra cuando sales de la pestaña y vuelves, o cuando cambia alguno de esos elementos.

El panel [Propiedades de la tabla](./table-related-functions.md#table-properties) tiene su propia pestaña `Schema SQL`, que muestra el DDL de una sola tabla. Siempre escribe sentencias `CREATE` simples, sin cabecera ni scripts, nunca escribe un nombre lógico en un comentario vacío, no tiene panel de opciones y su menú contextual solo ofrece `Database` y `Bracket`.

## Panel de opciones {#options-panel}

El panel reúne tres grupos, cada uno bajo un rótulo:

1. `Saved in the document`: `Database` y `Bracket`; consulta [Base de datos y delimitador](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` y, mientras el diagrama tenga un [grupo de tablas](./table-groups.md), `Tables`; consulta [Sentencias](#statements), [Cabecera](#header), [Nombres lógicos como comentarios](#logical-names-as-comments) y [Tablas](#tables).
3. `Saved in the document · written as is for every database`: los scripts `Before tables` y `After tables`; consulta [Scripts previos y posteriores](#before-and-after-scripts).

`Save file` y `Copy` están al pie del panel; consulta [Guardar o copiar el SQL](#saving-or-copying-the-sql).

Las opciones de `This window only` pertenecen a la ventana del editor en la que las eliges. No se guardan en el documento, no se comparten con los colaboradores ni se registran para deshacer, y se restablecen cuando el editor se cierra o se recarga; al cambiar de pestaña se conservan.  
`Statements` empieza en `If not exists`, `Header` en `CREATE + USE` y `Write logical names into empty comments`, desactivado. En cambio, el SQL que lee con [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) una página que integra el editor, y el SQL que [lee un agente de programación](../../mcp/tools.md#reading-a-document), empiezan en `Create` y sin cabecera, y no escriben nombres lógicos salvo que se les pida.

Una opción que la base de datos seleccionada no tiene sigue en el panel, atenuada, con la descripción emergente `Not in <database>`, como `Not in Oracle`, y pulsarla no hace nada.  
El SQL usa entonces la forma más cercana que tiene la base de datos, y el botón de esa forma aparece pulsado: `If not exists` recurre a `Create`; `CREATE + USE`, a `USE`, o a `None` si la base de datos tampoco tiene `USE`; y `USE`, a `None`. Tu elección se conserva, así que al cambiar a una base de datos que la tiene se recupera.

## Base de datos y delimitador {#database-and-bracket}

`Database` es la base de datos del diagrama, el mismo ajuste que `Database` en el menú contextual del lienzo y en el Generador de código; consulta [Bases de datos](./table-related-functions.md#databases). Enumera Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake y SQLite, empieza en MySQL y se guarda en el archivo como cualquier edición.

`Bracket` establece las comillas que rodean los nombres de tablas, columnas, restricciones e índices: `SingleQuote`, `DoubleQuote`, `Backtick` o `None`, sin ningún entrecomillado, que es el valor predeterminado. Es el mismo ajuste que el del Generador de código; consulta [Delimitador](./code-generator.md#bracket).  
Snowflake, que solo entrecomilla los nombres con comillas dobles, las usa con cualquier opción excepto `None`, y Databricks siempre entrecomilla los nombres con acentos graves.  
`Bracket` solo se guarda en el archivo mientras el bloqueo `Bracket Type` de la pestaña Configuración está desactivado, y un diagrama nuevo tiene todos los bloqueos activados. Mientras el bloqueo está activado, un cambio reescribe el SQL de tu pantalla, pero el archivo conserva el valor bloqueado y el diagrama se vuelve a abrir con él; consulta [Bloqueo](./settings.md#lock).

Mientras la base de datos es Oracle y el SQL contiene un nombre de más de 30 bytes, que Oracle 12.1 y anteriores rechazan, una nota bajo las dos listas indica cada uno de ellos: `Oracle 12.2+ for names over 30 bytes: <names>`. Comprueba los nombres de tablas, columnas, esquemas, claves, índices, secuencias y disparadores. El propio SQL no cambia.

## Sentencias {#statements}

`Statements` decide cómo se crean las tablas:

- `Create` escribe sentencias `CREATE` simples.
- `If not exists` omite las tablas y los índices que ya existen. MySQL, MariaDB, PostgreSQL, SQLite y Databricks la tienen; MSSQL, Oracle y Snowflake escriben `Create` en su lugar.
  - MySQL escribe cada tabla como `CREATE TABLE IF NOT EXISTS` con sus restricciones únicas, índices y claves externas dentro de ella, y pone todo el lote entre `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` y `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB pone `IF NOT EXISTS` en cada sentencia: el `CREATE TABLE`, cada restricción `UNIQUE` y `FOREIGN KEY` y cada `CREATE INDEX`.
  - PostgreSQL escribe `CREATE TABLE IF NOT EXISTS` y `CREATE INDEX IF NOT EXISTS`, y elimina cada clave externa con `DROP CONSTRAINT IF EXISTS` antes de volver a añadirla.
  - SQLite escribe `CREATE TABLE IF NOT EXISTS` y `CREATE INDEX IF NOT EXISTS`.
  - Databricks escribe `CREATE TABLE IF NOT EXISTS` y elimina cada clave externa con `DROP CONSTRAINT IF EXISTS` antes de volver a añadirla.
- `Drop & re-create` elimina todas las tablas que escribe antes de volver a crearlas, excepto en Snowflake. Todas las bases de datos la tienen:
  - MySQL y MariaDB escriben un `DROP TABLE IF EXISTS` por cada tabla, entre las mismas dos líneas que desactivan y vuelven a activar las comprobaciones de claves externas.
  - PostgreSQL escribe un único `DROP TABLE IF EXISTS` que nombra todas las tablas y que falla si una tabla que no está en la lista hace referencia a alguna de ellas. Con una cabecera `CREATE + USE`, una tabla cuyo nombre no indica ningún esquema se elimina de ese esquema, como `shop.member`.
  - MSSQL escribe una única transacción, que requiere SQL Server 2016 o posterior, como indica la descripción emergente del botón, `SQL Server 2016+`. Elimina las claves externas que tienen las tablas escritas, después las tablas con un único `DROP TABLE IF EXISTS`, y revierte los cambios si se produce un error. Una clave externa que tiene una tabla que no está en la lista sigue bloqueando la eliminación.
  - SQLite escribe `PRAGMA foreign_keys=OFF;`, que queda desactivado para esa conexión, y después un `DROP TABLE IF EXISTS` por cada tabla.
  - Oracle escribe `DROP TABLE … CASCADE CONSTRAINTS` por cada tabla y `DROP SEQUENCE` por cada secuencia de incremento automático, cada uno en un bloque PL/SQL que termina con una línea `/` y pasa por alto el error que genera una tabla o una secuencia inexistente.
  - Databricks escribe un `DROP TABLE IF EXISTS` por cada tabla.
  - Snowflake no elimina nada y escribe `CREATE OR REPLACE TABLE` en su lugar.

Mientras `Drop & re-create` está vigente, una advertencia en el panel nombra las tablas que elimina: `Drops <tables> before creating them. Their rows are lost.` o, en Snowflake, `Replaces <tables>. Their rows are lost.`  
Se nombran por completo hasta cinco tablas. Si son más de cinco, la advertencia nombra las cuatro primeras y cuenta las demás, como `a, b, c, d, and 3 more tables`.

## Cabecera {#header}

`Header` inicia el SQL con las sentencias que crean o seleccionan la base de datos, o el esquema, en que se ejecuta. El nombre es el nombre de la base de datos del diagrama, que se escribe en el campo `database name` de la barra de herramientas, y se entrecomilla con el carácter de `Bracket`.

- MySQL y MariaDB: `USE` escribe `USE shop;`, y `CREATE + USE` escribe `CREATE DATABASE IF NOT EXISTS shop;` delante.
- MSSQL: `USE` escribe `USE shop` y `GO`, y `CREATE + USE` escribe `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` y `GO` delante.
- PostgreSQL solo tiene `CREATE + USE`, que escribe `CREATE SCHEMA IF NOT EXISTS shop;` y `SET search_path TO shop, public;`.
- Oracle solo tiene `USE`, que escribe `ALTER SESSION SET CURRENT_SCHEMA = shop;`. `CREATE + USE` recurre a esta opción, así que esta es la línea que escribe Oracle con la cabecera predeterminada de la pestaña.
- Snowflake y Databricks: `USE` escribe `USE SCHEMA shop;`, y `CREATE + USE` escribe `CREATE SCHEMA IF NOT EXISTS shop;` delante.
- SQLite no tiene ninguna de las dos y no escribe ninguna cabecera.

Donde la base de datos tiene `USE` o `CREATE + USE`, la descripción emergente del botón indica lo que escribe en ella, como `CREATE SCHEMA + SET search_path` en PostgreSQL.

Solo se escribe una cabecera mientras el nombre de la base de datos es un identificador simple: una letra ASCII (`A`–`Z`, `a`–`z`) o `_`, seguida de letras ASCII, dígitos o `_`.  
Cualquier otro nombre, incluido uno vacío, no escribe ninguna cabecera, y el `DROP TABLE` de PostgreSQL no nombra entonces ningún esquema. Mientras está vigente una cabecera distinta de `None`, una nota bajo `Header` lo indica: `Database name "<name>" is not a valid identifier.`  
El nombre de la base de datos de un diagrama nuevo está vacío, así que, hasta que le des nombre, el panel muestra `Database name "" is not a valid identifier.`

## Nombres lógicos como comentarios {#logical-names-as-comments}

`Write logical names into empty comments`, un interruptor de `This window only`, escribe en el DDL el [nombre lógico](./logical-names.md) de una tabla o columna donde su comentario está vacío, en todas las bases de datos.

![Activar Write logical names into empty comments en el panel Schema SQL, lo que escribe el nombre lógico de cada columna de order_items en su COMMENT vacío mientras se mantienen los comentarios de members](/img/demo-schema-sql-logical-names.webp)

- Un comentario con texto siempre prevalece: el nombre lógico nunca lo reemplaza ni se le añade.
- Un comentario formado solo por espacios en blanco cuenta como vacío, así que el nombre lógico se escribe en su lugar. Un nombre lógico vacío o formado solo por espacios en blanco no escribe nada, y esa tabla o columna sigue sin recibir ningún comentario.
- El nombre lógico se escribe donde y como la base de datos escribe un comentario, con sus comillas escapadas del mismo modo; consulta [Comentarios](#comments).

En MySQL, por ejemplo, una columna `id` con el nombre lógico `Member ID` y sin comentario se escribe con `COMMENT 'Member ID'`, mientras que una columna `email` con el nombre lógico `Email` y el comentario `Sign-in address` conserva `COMMENT 'Sign-in address'`.

Como `Statements` y `Header`, el interruptor pertenece a la ventana y empieza desactivado; consulta [Panel de opciones](#options-panel).  
Una importación nunca vuelve a leer un comentario así como nombre lógico; consulta [Comentarios](./file-import-export.md#comments).

## Tablas {#tables}

Mientras el diagrama tiene al menos un [grupo de tablas](./table-groups.md), visible u oculto, `Tables` aparece en `This window only` con una casilla por cada opción:

- `All`, que marca o desmarca todas las casillas. Muestra un estado mixto mientras solo algunas están marcadas.
- Una casilla por cada grupo de tablas, en el orden de grupos del diagrama, con el nombre del grupo como etiqueta, o `unnamed` si el grupo no tiene nombre, precedido de un punto del color del grupo cuando tiene color.
- `No group`, para las tablas que no están en ningún grupo.

Con todas las casillas marcadas, la pestaña escribe el diagrama entero.  
Con solo algunas marcadas, escribe las tablas de las casillas marcadas con sus índices y las claves externas que tienen, incluida una que hace referencia a una tabla que queda fuera. Los scripts previos y posteriores se siguen escribiendo, y `Drop & re-create`, su advertencia y la nota de Oracle sobre los nombres largos solo abarcan esas tablas.  
Sin ninguna casilla marcada, la pestaña no escribe nada, y un texto de ayuda sobre el código indica `No tables chosen. Check some under Tables.` `Save file` guarda entonces un archivo vacío y `Copy` copia un texto vacío.

Como `Statements` y `Header`, la elección pertenece a la ventana; consulta [Panel de opciones](#options-panel).  
Un grupo añadido más tarde empieza marcado solo si todas las casillas estaban marcadas en ese momento. Al eliminar un grupo se quita su casilla, y al eliminar el último grupo se vuelve a marcar todo.  
La elección solo se aplica a esta pestaña. No afecta a la pestaña `Schema SQL` del panel Propiedades de la tabla ni a `getSchemaSQL()`.

## Scripts previos y posteriores {#before-and-after-scripts}

`Before tables` y `After tables` contienen tu propio SQL, como sentencias `CREATE EXTENSION` o `SET` antes de las tablas, o concesiones de permisos, vistas y datos iniciales después de ellas.  
Se guardan en el documento, un par para todo el diagrama sea cual sea la base de datos. Cada uno se escribe en el SQL tal como lo introdujiste, sin comprobarse nunca: el script previo, después de la cabecera y antes de las sentencias `DROP` y las tablas; el script posterior, al final del todo.

Los saltos de línea se escriben como LF, y se descartan las líneas en blanco antes de un script y los espacios en blanco después de él.  
En MSSQL, se añade una línea `GO` tras un script cuya última línea no es `GO` (o `GO` con un recuento), como indica la línea bajo los dos campos. En Oracle, termina tú mismo un bloque PL/SQL con su línea `/`.

Los campos resaltan el SQL y crecen con su texto.  
Una edición se aplica cuando sales del campo, al hacer clic en otro sitio o al cambiar de pestaña, y solo entonces cambian el SQL que tiene al lado y el documento. Un campo en el que solo has hecho clic no cambia nada.  
Una edición de un script cambia el diagrama como cualquier otra edición: se guarda en el archivo, los colaboradores la ven y cada edición aplicada es un paso del [historial de deshacer](./undo-redo.md), que deshaces desde la pestaña ERD.  
Mientras escribes en un campo, los atajos de teclado propios del editor se ceden al campo, así que `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) deshace lo que has escrito en él, y copiar, cortar y pegar actúan sobre el texto en lugar de sobre el diagrama.  
La búsqueda rápida y la [búsqueda del explorador](./find-and-replace.md) se siguen abriendo con sus atajos, `Ctrl + K` y `Ctrl + F` (Windows/Linux) o `⌘ + K` y `⌘ + F` (Mac). Como `Ctrl + F` o `⌘ + F` cambia a la pestaña ERD, aplica tu edición, como cualquier cambio de pestaña.  
Un campo sin el foco del teclado refleja un cambio que un colaborador o un [agente de programación](../../mcp/tools.md#settings) hace en su script. Un campo en el que estás muestra ese cambio cuando sales de él sin haber escrito. Si has escrito, tu texto se aplica al salir y reemplaza el suyo.

## Guardar o copiar el SQL {#saving-or-copying-the-sql}

`Save file`, al pie del panel o en el menú contextual, guarda exactamente el SQL que muestra la pestaña, con su base de datos, delimitador, sentencias, cabecera, comentarios con nombres lógicos, tablas y scripts actuales, como `<database name>-<timestamp>.sql`. Recibe su nombre y se guarda como cualquier otra exportación; consulta [Exportar](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL`, en el menú contextual del lienzo o en la búsqueda rápida, no guarda nada por sí solo.  
Cambia a esta pestaña, abre el panel de opciones aunque estuviera contraído y pone el foco del teclado en `Save file`, de modo que al pulsar `Enter` se guarda el archivo.

`Copy`, al pie del panel, o el botón de copiar que aparece arriba a la derecha del código al pasar el puntero por encima, copia el SQL.  
Una notificación `Copied!` con una marca de verificación lo confirma durante dos segundos. Si el navegador o el host deniega el acceso al portapapeles, una notificación `Couldn't copy to the clipboard` con un icono de advertencia lo indica en su lugar, durante cinco segundos. Volver a copiar reemplaza la notificación en lugar de añadir otra.  
El SQL también se puede seleccionar, así que puedes tomar solo una parte.

## Qué escribe el DDL {#what-the-ddl-writes}

Estas reglas se aplican dondequiera que el editor escriba Esquema SQL: en esta pestaña y en su archivo, y en el SQL que lee una página que integra el editor o un agente de programación.  
La pestaña `Schema SQL` del panel Propiedades de la tabla las sigue para la única tabla que muestra. No escribe secuencias ni disparadores de Oracle, ni claves externas, salvo las de SQLite, que están dentro de su `CREATE TABLE`. Tampoco escribe las sentencias de comentario que PostgreSQL, Oracle y MSSQL ponen después de una tabla, así que en esas tres no muestra ningún comentario.

Las partes aparecen en este orden, separadas por una línea en blanco: la cabecera, el script previo, las sentencias `DROP`, las tablas y el script posterior. Las tablas se escriben por orden de nombre.  
Un diagrama sin tablas ni scripts no escribe nada, aunque se haya elegido una cabecera.

Las tablas y las columnas se escriben con sus nombres físicos, sea lo que sea lo que muestre la [vista de nombres](./logical-names.md#name-view). Una columna vinculada a un dominio se escribe con su propio tipo de datos, que establece el dominio; consulta [Dominios y tipos de datos](./dictionary.md#domains-and-data-types).

### Incremento automático {#auto-increment}

Una columna marcada como `Auto Increment` se escribe como la escribe cada base de datos: `AUTO_INCREMENT` en MySQL y MariaDB, `IDENTITY(1,1)` en MSSQL, `AUTOINCREMENT` en Snowflake y `GENERATED ALWAYS AS IDENTITY` en PostgreSQL y Databricks.  
Oracle recibe una secuencia `SEQ_<table>` y un disparador `SEQ_TRG_<table>` que rellena la columna a partir de ella. El disparador termina con una línea `/`, para que SQL\*Plus y SQLcl lo ejecuten.

Cuando una base de datos no admite el incremento automático en el tipo de la columna, se omite la cláusula y una línea de comentario después de la tabla nombra la columna:

- PostgreSQL solo lo admite en `smallint`, `integer` o `bigint`, con cualquiera de sus nombres: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` o `INT8`. Una columna de otro tipo no recibe ni la cláusula ni un valor predeterminado, y el comentario indica, por ejemplo, `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks solo lo admite en `BIGINT` o `LONG`.
- SQLite solo admite `AUTOINCREMENT` en la columna que forma por sí sola la clave principal de una tabla y es de un tipo entero, como `INT`, `BIGINT` o `INT8`, con o sin ancho. Esa columna se escribe como `INTEGER`, y la clave como `PRIMARY KEY (id AUTOINCREMENT)`. Una clave de una sola columna de cualquier otro tipo se escribe sin él.

### Acciones referenciales {#referential-actions}

Las acciones ON DELETE y ON UPDATE que escribe cada base de datos se enumeran en [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Cuando Snowflake omite una acción, un comentario encima del `ALTER TABLE` de esa clave externa la nombra, como `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Nombres de tabla cualificados con esquema {#schema-qualified-table-names}

Con `Bracket` en `None`, un nombre de tabla con un punto, como `sales.users`, se interpreta como un esquema y una tabla, separados por su último punto fuera de corchetes o comillas dobles.

- MySQL, MariaDB, MSSQL, Oracle y PostgreSQL construyen los nombres automáticos que escriben solo a partir de la parte de la tabla: `FK_users_TO_orders` e `IDX_users` en las cinco; `UQ_users_email` en todas excepto PostgreSQL; y `PK_users` en MSSQL y Oracle, las dos que dan nombre a la clave principal. En esas dos, `[sales].[users]` y `"sales"."users"` también dan `PK_users`, y `[Order]` da `PK_Order`.
- SQLite no da nombre a ninguna restricción, así que el único nombre automático que construye es el del índice: `CREATE INDEX sales.IDX_users ON users`.
- Oracle crea los índices de la tabla, y la secuencia y el disparador de una columna de incremento automático, en el esquema de la tabla: `sales.IDX_users`, `sales.SEQ_users` y `sales.SEQ_TRG_users`.
- En Oracle y SQLite, un nombre de índice al que tú mismo diste un esquema lo conserva.
- Un nombre automático de clave externa o de índice que repite uno anterior, sin distinguir mayúsculas y minúsculas, recibe un número. Si `orders` hace referencia tanto a `sales.users` como a `hr.Users`, la segunda clave es `FK_Users_TO_orders1`.

Con cualquier otro `Bracket`, el nombre de tabla completo es un único identificador, como `"PK_sales.users"`. Snowflake y Databricks siempre conservan el nombre completo.  
Las filas `Keys` de la pestaña [Índices](./table-related-functions.md#indexes) muestran los mismos nombres.

### Valores predeterminados {#defaults}

El valor predeterminado de una columna se escribe tal como lo introdujiste, pero entre paréntesis cuando la base de datos solo lee esa expresión dentro de ellos. Un valor predeterminado que ya está entre paréntesis se deja como está.

- MySQL pone entre paréntesis todo lo que no sea un literal o la hora actual, como `(uuid())`. También pone entre paréntesis cualquier valor predeterminado distinto de `NULL` en una columna `BLOB`, `TEXT`, `JSON`, espacial o `LONG…`, y la hora actual en cualquier columna que no sea `TIMESTAMP` o `DATETIME`.
- MariaDB pone entre paréntesis todo lo que no sea un literal, la hora actual, una llamada a función o un nombre.
- SQLite pone entre paréntesis todo lo que no sea un literal o un nombre, como `(datetime('now'))`.
- PostgreSQL solo pone entre paréntesis una expresión con una palabra como `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` o `= ANY` fuera de paréntesis, como `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake y Databricks escriben todos los valores predeterminados tal como se introdujeron.

### Comentarios {#comments}

El comentario de una tabla o columna que no está en blanco, o el nombre lógico que [`Write logical names into empty comments`](#logical-names-as-comments) escribe en su lugar, se escribe como cada base de datos escribe los comentarios:

- MySQL y MariaDB lo escriben en línea: una columna termina con `COMMENT 'Member ID'`, y la tabla se cierra con `) COMMENT 'Members';`, también en el lote `If not exists` de MySQL.
- Snowflake escribe el de una columna en línea, `COMMENT 'Member ID'`, y el de la tabla en una línea propia después del paréntesis de cierre, `COMMENT = 'Members';`.
- Databricks escribe el de una columna en línea, y el de la tabla como `COMMENT 'Members';` después de `USING DELTA`.
- PostgreSQL escribe `COMMENT ON TABLE member IS 'Members';` y `COMMENT ON COLUMN member.id IS 'Member ID';` justo después del `CREATE TABLE` de la tabla. Oracle escribe las mismas sentencias después de la tabla, sus restricciones únicas y su secuencia y disparador de incremento automático.
- MSSQL escribe una llamada por tabla y por columna, después de la tabla y sus restricciones únicas, cada una seguida de `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, con `'column', 'id'` añadido en el caso de una columna.  
  El texto es un literal nacional, `N'…'`, así que SQL Server conserva el texto que queda fuera de la página de códigos de la base de datos, como el coreano, en lugar de guardar signos de interrogación.  
  Con `Bracket` en `None`, una tabla llamada `sales.users` da el esquema `sales` y la tabla `users`, igual que `[sales].[users]` y `"sales"."users"`, cuyos corchetes y comillas dobles se descartan. Un nombre sin esquema está en `dbo`. Una parte delante del esquema, como en `shop.sales.users`, ejecuta el procedimiento de esa base de datos, `shop.sys.sp_addextendedproperty`. Con cualquier otro `Bracket`, el nombre completo es la tabla, en `dbo`.
- SQLite no guarda comentarios, así que escribe cada uno como una línea `--` encima de lo que describe: `-- Members` encima de `CREATE TABLE member`, y `-- Member ID` encima de la columna.

Una comilla dentro de un comentario entrecomillado se duplica, como en `'it''s'` y `N'it''s'`, y también una en los nombres que pasan las llamadas de MSSQL. Databricks, en cambio, escapa una comilla y una barra invertida con una barra invertida, como en `'it\'s'`, la forma que leen todas las versiones de Spark. Las líneas `--` de SQLite no van entrecomilladas, así que conservan una comilla tal como se escribió: `-- it's`.  
Por lo demás, el texto se escribe tal como se introdujo, incluidos los saltos de línea, salvo en dos bases de datos:

- Oracle omite las líneas en blanco, y una línea formada solo por espacios o tabulaciones cuenta como en blanco, porque SQL\*Plus termina una sentencia en una línea en blanco y se salta el resto. Un comentario de tabla formado por `Members`, una línea en blanco y `Active only` se escribe como `COMMENT ON TABLE member IS 'Members`, con `Active only';` en la línea siguiente.
- SQLite escribe cada serie de saltos de línea como un solo espacio, porque un salto de línea terminaría la línea `--` y el resto se ejecutaría como SQL. El mismo comentario se escribe como `-- Members Active only`.

Cómo se vuelven a leer estos comentarios al importar se explica en [Comentarios](./file-import-export.md#comments).

## Editores de solo lectura {#read-only-editors}

En un editor `readonly`, la pestaña funciona como siempre: `Database` y `Bracket` siguen cambiando el SQL que se muestra, `Statements`, `Header`, `Write logical names into empty comments` y `Tables` siguen funcionando, y `Save file` y `Copy` siguen guardándolo y copiándolo.  
Solo los dos campos de script son de solo lectura.
