---
sidebar_position: 2
description: Importa JSON, Esquema SQL, GraphQL, DBML o AML en lugar del diagrama o debajo de él, y exporta JSON, Esquema SQL o el diagrama como imagen PNG o SVG.
---

# Importar o exportar archivos

## Importar archivos externos {#importing-external-files}

Se pueden importar cinco formatos desde el submenú `Import` del menú contextual del lienzo:

- json
- Schema SQL
- GraphQL
- DBML
- AML

`Import and Add`, justo debajo de `Import`, añade el archivo al diagrama en lugar de sustituirlo; consulta [Importar y añadir](#import-and-add).  
La pantalla de bienvenida que muestra un diagrama vacío tiene una fila `Import` con los mismos cinco formatos; consulta [Pantalla de bienvenida](./editing-start.md#welcome-screen).

Las extensiones se reconocen sin distinguir mayúsculas y minúsculas. Al elegir un archivo cuya extensión no coincide con el formato seleccionado, se cancela la importación y aparece `Only <format> files can be imported`, con el formato escrito como `json`, `sql`, `graphql`, `dbml` o `aml`, como en `Only sql files can be imported`.

`Import` sustituye el documento actual en lugar de fusionarse con él, y deshacer una vez recupera el diagrama anterior.  
Un archivo JSON trae consigo sus propios ajustes, [bloqueos](./settings.md#lock) incluidos. Si el archivo bloquea la pestaña, el lenguaje del Generador de código, un estilo de nombres o el tipo de delimitador, sigues viendo lo que tenías, pero lo que se guarda es el valor bloqueado del archivo. La vista, bloqueada o no, queda donde la sitúa el archivo. Un archivo JSON guardado antes de que existieran los bloqueos se importa con todos los bloqueos activados y la vista al 100 %.  
Los demás formatos conservan los ajustes que ya tienes, bloqueos incluidos, salvo la vista, que empieza al 100 %.  
Los analizadores de GraphQL, DBML y AML nunca fallan: un archivo que no pueden leer produce un diagrama vacío en lugar de un error.

Un archivo JSON conserva las posiciones que tiene. Las tablas de un archivo de Esquema SQL, GraphQL, DBML o AML se colocan antes de que cambie el diagrama:

- Cuando el archivo tiene dos o más tablas y al menos una relación, se disponen con la [disposición automática](./table-related-functions.md#auto-layout) `Flow`, de izquierda a derecha siguiendo las relaciones, a partir de la esquina superior izquierda del lienzo. Una relación de una tabla consigo misma también cuenta.
- Si no, se colocan en filas desde la esquina superior izquierda, primero las tablas con menos columnas.
- Si la disposición tarda más de 6 segundos, aparece un aviso `Placing tables` con un botón `Cancel`. `Cancel`, o `Escape` mientras se muestra el aviso, abandona la disposición y, en su lugar, coloca las tablas en filas. También se usan filas, sin aviso, cuando la disposición falla, cuando no se obtiene ninguna disposición en 60 segundos o cuando el host no ejecuta ningún worker compartido; consulta [Web Workers](../../api/installation.md#web-workers).

Después, el diagrama se sustituye en un solo paso, así que no se ve ningún estado intermedio. Un ajuste que cambies mientras se colocan las tablas, como la pestaña, se conserva, y si importas otro archivo entretanto, prevalece la última importación iniciada.

Un editor de solo lectura no carga nada desde `Import` y no ofrece `Import and Add`.

### Importar y añadir {#import-and-add}

`Import and Add` conserva el diagrama y añade un archivo debajo de él. Está en el menú contextual del lienzo y en la [búsqueda rápida](./quick-search.md) de la pestaña ERD, y ofrece los mismos cinco formatos con la misma comprobación de extensión que `Import`.

![Añadir un archivo SQL desde Import and Add > Schema SQL, con sus tablas colocadas debajo del diagrama, dispuestas según sus relaciones y seleccionadas](/img/demo-import-and-add.webp)

El archivo se incorpora como al pegar: cada tabla, columna, relación, índice, nota y [grupo de tablas](./table-groups.md) que contiene se añade como elemento nuevo, las tablas que ya están en el diagrama no se mueven y ningún ajuste cambia, así que los ajustes de un archivo JSON se omiten.  
Una tabla cuyo nombre ya existe en el diagrama se añade como una segunda tabla con ese nombre, sin fusionarse con la existente. Las relaciones y los índices proceden solo del archivo, así que una clave externa hacia una tabla que el archivo no define no se vincula con una tabla que ya esté en el diagrama.

El bloque añadido se coloca justo debajo de todo lo que contiene el diagrama, alineado con su borde izquierdo, o en la esquina superior izquierda de un diagrama vacío. Las notas y los grupos de tablas ocultos con el menú [Opciones de vista](./table-related-functions.md#table-view-options) también cuentan, ya que siguen ahí.  
Dentro del bloque, un archivo JSON conserva su propia disposición, grupos de tablas incluidos. Los demás formatos se colocan como los coloca `Import`, con `Flow` o en filas según las mismas reglas, y el recuadro de cada grupo de tablas se ajusta a sus tablas. Las tablas y notas añadidas se apilan por encima de todo lo que ya había.

Una vez colocado el bloque, solo queda seleccionado lo añadido: las tablas nuevas, más las notas y los grupos de tablas nuevos mientras se muestran. Si entretanto has cambiado a otra pestaña, el editor vuelve a la pestaña ERD antes de colocar el bloque. Después, la vista se desplaza hasta el bloque con el zoom actual, salvo que ya se vea bien; consulta [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands). Deshacer una vez revierte toda la adición.  
Un archivo que el analizador no puede leer, o uno sin tablas ni notas, no añade nada.

Varios archivos de Esquema SQL, GraphQL, DBML o AML añadidos mientras uno aún se está colocando se colocan todos, en el orden en que se iniciaron. Un archivo JSON añadido entretanto se coloca en cuanto se lee, por delante de ellos. Un `Import`, o cargar otro documento, descarta los que aún se estén colocando.

Los agentes de programación añaden un archivo de la misma forma con el modo `append` de las herramientas de importación MCP, que conserva la disposición de un archivo JSON pero coloca en filas las tablas de los demás formatos, nunca con `Flow`; consulta [Importación](../../mcp/tools.md#import).

### JSON {#json}

Puedes importar archivos en el [formato de esquema definido en el editor](../../api/advanced/schema.md).
El nombre del archivo debe terminar en `.json`, así que un archivo exportado como `<database name>-<timestamp>.erd.json` se vuelve a importar tal cual; aquí no se acepta un archivo `.erd` o `.vuerd` a secas. También se leen los archivos guardados por versiones anteriores.

![Importar un archivo guardado desde Import > json, sustituyendo el documento borrador junto con sus ajustes](/img/demo-import-json.webp)

### Esquema SQL {#schema-sql}

También puedes importar archivos de esquema definidos en SQL.  
Aunque los analizadores se han hecho lo más flexibles posible con independencia del proveedor de base de datos, puede haber alguna sintaxis no admitida.  
El nombre del archivo debe terminar en `.sql`.  
[Aquí puedes consultar la sintaxis admitida.](https://github.com/dineug/erd-editor/tree/main/packages/schema-sql-parser)

![Importar un archivo SQL desde Import > Schema SQL, con sus tablas dispuestas según sus relaciones, y después alejar el zoom sobre ellas](/img/demo-import-sql.webp)

Las columnas proceden solo de `CREATE TABLE`. Una columna añadida con `ALTER TABLE ... ADD COLUMN` no se lee.  
Los elementos de un `CREATE TABLE` que no son columnas se omiten en lugar de leerse como columnas: un `CHECK (...)` sin nombre, `LIKE` y `EXCLUDE` de PostgreSQL, `FULLTEXT` y `SPATIAL` de MySQL escritos sin `INDEX` ni `KEY`, `PERIOD FOR` de T-SQL y `SUPPLEMENTAL LOG DATA` de Oracle.  
Una columna con el nombre de uno de ellos se importa igualmente cuando al nombre le sigue un tipo integrado, como en `exclude BOOLEAN`, o cuando el nombre está entrecomillado, como en `"check" int`. Un `like` sin comillas seguido de un tipo que no es integrado, como `like citext`, se lee como el `LIKE` de PostgreSQL y se omite.  
Las propias restricciones `CHECK` no se importan, ya que el editor no tiene dónde guardarlas.

#### Tipos de datos {#data-types}

El tipo de datos de una columna se conserva, lista de argumentos incluida, aunque no sea un tipo integrado de ninguna [base de datos compatible](./table-related-functions.md#databases).  
Eso incluye un enum o un tipo compuesto creado con `CREATE TYPE`, un dominio creado con `CREATE DOMAIN`, tipos de extensión como `hstore`, `citext` y `ltree`, nombres cualificados con esquema como `public.mood` y nombres entre comillas o corchetes como `"MyType"` y `[dbo].[Phone]`, que conservan sus comillas o corchetes. Las propias sentencias `CREATE TYPE`, `CREATE DOMAIN` y `CREATE EXTENSION` se omiten.  
Un tipo integrado pierde sus comillas o corchetes, así que `[int]` se importa como `int` y `[nvarchar](50)` como `nvarchar(50)`. `"char"` y `"bit"` de PostgreSQL conservan sus comillas, porque son tipos distintos de `char` y `bit`.  
Los sufijos de array se mantienen en cualquier tipo: `integer[]`, `text[3][3]`, `integer ARRAY`, `mood[]`. `UNSIGNED BIG INT` de SQLite se importa completo.  
`UNSIGNED` y `ZEROFILL` de MySQL y MariaDB, escritos justo después de un tipo y sus argumentos, siguen formando parte del tipo tal como están escritos: `INT UNSIGNED`, `SMALLINT(5) UNSIGNED ZEROFILL`, el `int unsigned` de mysqldump. `SIGNED`, que es lo predeterminado, se descarta, así que `TINYINT SIGNED` se importa como `TINYINT`. Un modificador escrito después de otra opción de columna, como en `INT NOT NULL UNSIGNED`, que MySQL rechaza, se descarta.  
Los valores de `ENUM(...)` y `SET(...)` conservan sus comillas, con la comilla interior de un valor duplicada, como en `ENUM('a','it''s')`. El `'it\'s'` de MySQL, escapado con barra invertida, se importa duplicado de la misma forma. En un tipo `STRUCT<...>` de Databricks, los nombres de campo entre comillas y el `COMMENT` de un campo conservan sus comillas.  
Una columna escrita sin tipo, como una columna de SQLite sin tipo o una columna calculada `AS`, se queda sin tipo: una palabra clave como `NOT`, `NULL`, `DEFAULT`, `PRIMARY` o `REFERENCES`, o una cadena entre comillas simples, no se lee como tipo.

#### Valores predeterminados {#defaults}

El `DEFAULT` de una columna conserva su expresión completa, como `now()`, `0.5`, `CURRENT_TIMESTAMP` o `ARRAY[]::text[]`, hasta la siguiente opción de columna, una coma o el paréntesis de cierre. Un `CASE ... END` se lee completo.  
Los paréntesis que rodean toda la expresión se quitan, así que `((0))` de SQL Server se importa como `0` y `(getdate())` como `getdate()`. También se quita la conversión de tipo de un literal, así que `'draft'::character varying` de pg_dump se importa como `'draft'` y `NULL::character varying` como `NULL`; las demás conversiones se mantienen, como en `ARRAY[]::text[]` y `lower('A'::text)`.  
`ON UPDATE CURRENT_TIMESTAMP` de MySQL se descarta, ya que una columna no tiene dónde guardarlo, y el valor predeterminado que lo precede se mantiene. `DEFAULT ON NULL 0` de Oracle, con o sin `FOR INSERT ONLY` o `FOR INSERT AND UPDATE`, se importa como `0`.  
Una cadena con prefijo, como `N'x'`, `E'x'`, `B'0'`, `X'ff'`, `U&'x'` o `_utf8mb4'x'`, se lee como una sola cadena, aunque contenga un paréntesis.

SQL Server Management Studio escribe en sus scripts los valores predeterminados después de las tablas, como `ALTER TABLE [dbo].[t] ADD CONSTRAINT [DF_x] DEFAULT ((1)) FOR [col]`. Una sentencia así establece el valor predeterminado de esa columna, aquí `1`, y su nombre de restricción se descarta.

Una exportación de Esquema SQL vuelve a poner los paréntesis allí donde una base de datos solo lee la expresión de un valor predeterminado dentro de ellos; consulta [Valores predeterminados](./schema-sql.md#defaults).

#### Incremento automático {#auto-increment}

`AUTO_INCREMENT`, `AUTOINCREMENT` y `IDENTITY` activan el `Auto Increment` de una columna, igual que `GENERATED ALWAYS AS IDENTITY` y `GENERATED BY DEFAULT AS IDENTITY`, que no dejan ningún valor predeterminado.  
También lo activa un valor predeterminado que consiste en una única llamada `nextval()` de PostgreSQL, el valor predeterminado que recibe una columna serial, escrito `nextval('s')` o, como lo escribe pg_dump, `nextval('s'::regclass)`. El nombre de la secuencia no se conserva. Un valor predeterminado que solo utiliza una secuencia, como `nextval('s') + 1` o `NEXT VALUE FOR s` de SQL Server, sigue siendo un valor predeterminado normal.  
pg_dump escribe ambos después de las tablas, como `ALTER TABLE [ONLY] t ALTER [COLUMN] c SET DEFAULT nextval('s'::regclass)` y `ALTER TABLE t ALTER [COLUMN] c ADD GENERATED ... AS IDENTITY`. Cualquiera de las dos sentencias activa el `Auto Increment` de esa columna y borra su valor predeterminado. `CREATE SEQUENCE`, `ALTER SEQUENCE` y cualquier otra acción de `ALTER COLUMN` se omiten.  
Una columna cuyo tipo se declara en línea como `serial`, `bigserial` o `smallserial` conserva ese tipo, con `Auto Increment` desactivado.

El editor solo conserva el indicador `Auto Increment`, y cada base de datos escribe su propia forma al exportar; consulta [Incremento automático](./schema-sql.md#auto-increment). Una exportación de PostgreSQL escribe `GENERATED ALWAYS AS IDENTITY` en una columna `smallint`, `integer` o `bigint`, sea cual sea la forma importada, y en cualquier otro tipo, como `INT UNSIGNED`, solo una línea de comentario después de la tabla. Las opciones de secuencia como `START WITH 100` se pierden.  
Una tabla con varias columnas serial o de identidad se importa con varias columnas de incremento automático, y MySQL, MariaDB y SQL Server rechazan una tabla así al ejecutar su exportación.

#### Claves principales {#primary-keys}

Una clave principal añadida después de su tabla, `ALTER TABLE t ADD [CONSTRAINT n] PRIMARY KEY (...)`, marca sus columnas como clave principal.  
`CLUSTERED` o `NONCLUSTERED` de SQL Server y `USING BTREE` de MySQL antes de la lista de columnas se pasan por alto, así que el `ALTER TABLE [dbo].[Users] ADD CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([Id] ASC) WITH (...) ON [PRIMARY]` que escribe SQL Server Management Studio en sus scripts toma `Id` como clave. El `PRIMARY KEY NONCLUSTERED HASH (...)` de una tabla optimizada para memoria no se lee, ni en `ALTER TABLE` ni en `CREATE TABLE`.

#### Claves únicas e índices {#unique-keys-and-indexes}

Un `UNIQUE` sobre dos o más columnas se convierte en un solo índice único, se escriba como se escriba: `UNIQUE (a, b)`, `UNIQUE KEY n (a, b)`, `UNIQUE INDEX n (a, b)`, `CONSTRAINT n UNIQUE (a, b)`, el `INDEX n UNIQUE (a, b)` en línea de SQL Server y `ALTER TABLE t ADD [CONSTRAINT n] UNIQUE (a, b)`.  
El índice toma el nombre de índice de la clave o, si no lo tiene, su nombre de `CONSTRAINT` o, si tampoco lo tiene, se queda sin nombre, y conserva el orden de cada columna. Un índice así es una [clave alternativa](./table-related-functions.md#alternate-keys).  
Un `UNIQUE` sobre una sola columna, en cualquiera de esas formas, marca en cambio esa columna como Único y no añade ningún índice, así que la restricción `UQ_<table name>_<column name>` que escribe la exportación vuelve como el indicador a partir del cual se escribió. Un `CREATE UNIQUE INDEX` sobre una columna sigue siendo un índice único.

Un `ALTER TABLE` que añade varias claves a la vez, como el `ADD PRIMARY KEY (id), ADD UNIQUE KEY uq_a (a, b), ADD UNIQUE KEY uq_c (c)` que escribe phpMyAdmin, conserva todas sus claves únicas: `uq_a` se importa como un índice único llamado `uq_a`, y `uq_c` como el indicador Único de `c`. Un nombre de `CONSTRAINT` solo da nombre a la clave de su propia cláusula. También se leen `ADD UNIQUE INDEX IF NOT EXISTS n (...)` de MariaDB y `ALTER TABLE t WITH CHECK ADD ...` y `WITH NOCHECK ADD ...` de SQL Server.  
`CREATE INDEX` y `CREATE UNIQUE INDEX` se leen con nombres cualificados como `public.t` y `[dbo].[t]`, con `CLUSTERED` y `NONCLUSTERED` de SQL Server, con `CONCURRENTLY`, `IF NOT EXISTS`, `ON ONLY` y `USING btree` de PostgreSQL, y también sin ningún nombre de índice. El grupo de archivos `ON [PRIMARY]` de SQL Server se ignora.  
Las opciones de clave como `NULLS NOT DISTINCT` o `USING BTREE` no se confunden con el nombre de la clave. En la lista de columnas de una clave, solo la primera palabra nombra la columna, así que `b DESC NULLS LAST`, `b text_pattern_ops` y `b COLLATE "C"` toman todas `b` como columna de la clave, con `DESC` conservado como su orden. Una longitud de prefijo como `email(191)` se pasa por alto, pero una clave con una parte de expresión, como `lower(email)`, se omite entera.

Un índice único parcial, `CREATE UNIQUE INDEX ... WHERE ...` o el `INDEX n UNIQUE (...) WHERE ...` en línea de SQL Server, se importa como un índice normal con el mismo nombre y las mismas columnas, porque una clave única en toda la tabla sería más estricta que la filtrada que declara el archivo. La excepción es un filtro formado solo por comprobaciones `IS NOT NULL` sobre las columnas de la clave unidas con `AND`, el filtro que SQL Server necesita para que una columna única admita más de un NULL: esa clave sigue siendo única.  
Una clave única que nombra una columna que la tabla no tiene, como una añadida con `ALTER TABLE ... ADD COLUMN`, se descarta entera en lugar de reducirse a las columnas que existen. Un índice normal conserva las columnas que existen.

SQL Developer y `DBMS_METADATA` de Oracle escriben el índice propio de una clave como un `CREATE UNIQUE INDEX` aparte, con el nombre de la clave o, para una clave sin nombre seguida de `USING INDEX`, con un nombre de sistema como `SYS_C0012345`. La importación lee ese índice, y el que nombra un `ADD CONSTRAINT ... USING INDEX`, como parte de su clave: una clave única compuesta se importa como un solo índice único, y una clave principal o una clave única de una columna, como los indicadores de columna sin ningún índice adicional. Así, al volver a exportar a Oracle, el índice se crea una sola vez.

Una exportación de Esquema SQL se vuelve a importar con los mismos indicadores Único e índices para MySQL, MariaDB, MSSQL, Oracle, PostgreSQL y SQLite.  
Snowflake no tiene índices secundarios, así que su exportación solo recupera las claves únicas: una compuesta como índice único y una de una columna como el indicador Único de la columna. Una exportación de Databricks no declara ninguna unicidad, así que no se recupera ninguna.

#### Claves externas {#foreign-keys}

Una clave externa se convierte en una relación en estas formas:

- Un `FOREIGN KEY (...) REFERENCES t (...)` a nivel de tabla, con o sin `CONSTRAINT name`.
- `ALTER TABLE ... ADD [CONSTRAINT name] FOREIGN KEY (...) REFERENCES t (...)`, incluidos los `ALTER TABLE t WITH CHECK ADD ...` y `WITH NOCHECK ADD ...` que escribe SQL Server Management Studio en sus scripts.
- El `REFERENCES t (col)` en línea de una columna, como en `user_id INT REFERENCES users (id)`, y el `FOREIGN KEY REFERENCES t (col)` que SQL Server y Snowflake admiten ahí. Una referencia en línea a más de una columna se omite.

Un `ALTER TABLE` da como máximo una relación, y solo cuando su primera cláusula añade una clave externa: una cláusula `FOREIGN KEY` después de una cláusula `ADD PRIMARY KEY` o `ADD UNIQUE` en la misma sentencia no se lee. Cuando una sentencia añade varias claves externas, como el `ADD CONSTRAINT fk1 FOREIGN KEY ..., ADD CONSTRAINT fk2 FOREIGN KEY ...` que escribe phpMyAdmin, solo se lee la última.

`REFERENCES t` sin lista de columnas apunta a la clave principal de `t` cuando esa clave es de una sola columna. Si esa clave principal es compuesta, la clave externa se omite.  
Una clave externa se omite, y ninguna de sus columnas se marca como clave externa, cuando no se encuentra ninguna de sus columnas referenciadas o cuando las columnas encontradas en las dos tablas no coinciden en número, como cuando falta una columna solo en una de ellas. Cuando a ambas tablas les falta el mismo número de sus columnas, las columnas encontradas se emparejan en el orden escrito y la relación solo contiene esas.  
Toda relación importada es `Zero N`, y es identificadora cuando cada una de sus columnas hijas es también clave principal.

Las cláusulas `ON DELETE` y `ON UPDATE` de cada clave externa pasan a ser el `On Delete` y el `On Update` de la relación: `NO ACTION`, `RESTRICT`, `CASCADE`, `SET NULL` o `SET DEFAULT`, en mayúsculas o minúsculas y en cualquier orden. Una clave externa sin ellas se importa como `Not set`. Consulta [Edición de relaciones](./relationship-editing.md#on-delete-and-on-update) para establecerlas en el editor.  
La lista de columnas de PostgreSQL después de `SET NULL` o `SET DEFAULT`, como en `ON DELETE SET NULL (a_id)`, se pasa por alto: la acción se aplica a toda la clave, y un `ON UPDATE` posterior a la lista se sigue leyendo. `MATCH FULL`, `MATCH PARTIAL` y `MATCH SIMPLE` se omiten, y el atributo de columna `ON UPDATE CURRENT_TIMESTAMP` de MySQL no se confunde con una acción.  
Una exportación de Esquema SQL se vuelve a importar con las acciones que escribe esa base de datos, así que una acción que omite, como `SET DEFAULT` en MySQL, cualquier `ON UPDATE` en Oracle o cualquier cosa distinta de `NO ACTION` en Snowflake, vuelve como `Not set`.

#### Comentarios {#comments}

Los comentarios de tabla y de columna se importan desde las tres sintaxis que lee el analizador: la opción de tabla y el atributo de columna `COMMENT` que usan MySQL, MariaDB, Snowflake y Databricks, las sentencias `COMMENT ON TABLE` y `COMMENT ON COLUMN` que usan PostgreSQL y Oracle, y la propiedad extendida `MS_Description` que SQL Server establece con `EXEC sp_addextendedproperty`.  
Un comentario que nombra una tabla o columna que el archivo no define se ignora.

Las llamadas de SQL Server se leen con argumentos con nombre, como SQL Server Management Studio escribe cada comentario en sus scripts (`@name=N'MS_Description', @value=N'...', ..., @level1type=N'TABLE', @level1name=N'Users'`), y con argumentos posicionales, como los escribe la exportación MSSQL del editor.  
Solo un `MS_Description` en una tabla, o en una de sus columnas en el nivel 2, da un comentario. Otra propiedad, una vista, un índice o una restricción no dan ninguno, y tampoco un comentario pasado en una variable o construido con `+`.

En un comentario, como en cualquier texto entre comillas, por ejemplo un valor `DEFAULT` o un nombre entrecomillado, una comilla duplicada equivale a una sola comilla, tal como la escriben mysqldump y pg_dump: `'it''s'` se lee como `it's`.  
Una barra invertida antes de una comilla, como en el `'it\'s'` que escriben MySQL y MariaDB, también escapa la comilla. Esa comilla sigue cerrando el texto cuando la sigue un espacio en blanco, `,`, `;`, `)`, `]`, `:`, `|`, `+` o el final del archivo, así que `'C:\'`, el `'C:\'::text` de pg_dump y el `'C:\'+name` de T-SQL conservan su barra invertida.  
Un valor `DEFAULT` conserva sus comillas, y una comilla dentro de él se vuelve a escribir duplicada, sea cual sea la forma en que la escapó el archivo: `'it''s'`.  
Cuando la base de datos del documento es Databricks en el momento de importar, el texto entre comillas simples sigue en cambio las reglas de Spark: cada barra invertida escapa el carácter que la sigue, así que `'C:\\dir'` se lee como `C:\dir`, las secuencias de escape como `\n`, `\t` y `\u0041` se decodifican, y un valor `DEFAULT` se conserva como `'it\'s'`.

El Esquema SQL exportado escapa una comilla dentro de un comentario de tabla o columna: `COMMENT 'it''s'` para MySQL, MariaDB y Snowflake, `COMMENT ON TABLE` y `COMMENT ON COLUMN ... IS 'it''s'` para PostgreSQL y Oracle, y la misma duplicación, nombres de tabla y columna incluidos, en las llamadas `sp_addextendedproperty` de MSSQL. Un comentario sin comillas se escribe tal cual.  
Databricks, en cambio, escapa una comilla y una barra invertida con una barra invertida, como en `COMMENT 'it\'s'`, así que su exportación solo se vuelve a leer con exactitud mientras Databricks es la base de datos seleccionada.  
MSSQL escribe cada comentario como `EXECUTE sys.sp_addextendedproperty 'MS_Description', '<comment>', 'schema', '<schema>', 'table', '<table>'`, seguido de `'column', '<column>'` para una columna. Con `Bracket` en `None`, una tabla llamada `sales.users` da el esquema `sales` y la tabla `users`, y un nombre sin esquema queda en `dbo`. Con cualquier otro `Bracket`, el nombre completo es la tabla, en `dbo`.

Los comentarios no sobreviven a una exportación e importación de ida y vuelta con SQLite: SQLite los escribe como simples líneas `--`, que el analizador no lee. Las llamadas `sp_addextendedproperty` de una exportación MSSQL se vuelven a importar como los mismos comentarios de tabla y columna.

### GraphQL {#graphql}

Puedes importar un documento GraphQL SDL.  
Las definiciones de tipos de objeto se convierten en tablas, un bloque `extend type` se fusiona con el tipo que extiende y los campos de una interfaz los heredan los tipos que la implementan.  
Un campo cuyo tipo es otra tabla se convierte en una relación en lugar de una columna, y una lista en ambos lados crea una tabla intermedia.  
Un campo singular como `buyer: User` se empareja primero con el único campo del otro tipo cuyo nombre termina en `By` seguido del nombre de ese campo, como `orderListByBuyer`, sin distinguir mayúsculas y minúsculas y sin tener en cuenta los guiones bajos; un campo numerado como `buyer2` se empareja de la misma forma sin su número. Así es como la salida GraphQL del Generador de código nombra los campos cuando dos tablas comparten más de una relación o una tabla se refiere a sí misma, de modo que esa salida se vuelve a importar con todas sus relaciones.  
Los tipos raíz (`Query`, `Mutation`, `Subscription`), los tipos de introspección y los envoltorios de Relay, federación y Hasura como `PageInfo`, `*Connection`, `*Edge` y `*_aggregate` se tratan como ruido y se omiten.  
Se respetan las directivas `@id`, `@primaryKey`, `@unique`, `@autoincrement`, `@default`, `@map`, `@relation`, `@column`, `@table`, `@index` y `@db.*`.  
El nombre del archivo debe terminar en `.graphql`, `.gql` o `.graphqls`. Un archivo `schema.prisma` de Prisma no es un documento GraphQL y no se puede importar aquí.

### DBML {#dbml}

Puedes importar un archivo DBML, el formato que usan dbdiagram.io y dbdocs.  
Se leen los bloques `Table`, `TablePartial`, `Ref`, `Enum` y `TableGroup`. Los bloques `Project` y los bloques `Note` independientes se omiten sin afectar a las tablas que los rodean.  
Se acepta cualquier forma de escribir una referencia: la forma con dos puntos `Ref:`, una referencia con nombre, la forma de bloque `Ref { }` y el ajuste de columna en línea `[ref: > table.column]`.  
Una referencia `<>` de muchos a muchos crea una tabla intermedia con el nombre de ambos lados.  
Los ajustes `delete` y `update` de una referencia independiente pasan a ser el `On Delete` y el `On Update` de la relación, como en `Ref: users.id < posts.user_id [delete: cascade, update: set null]`. Los valores son `cascade`, `restrict`, `set null`, `set default` y `no action`, en mayúsculas o minúsculas. Cualquier otro valor, o la ausencia de ajuste, se importa como `Not set`, y los demás ajustes, como `color`, se ignoran.  
El ajuste en línea `[ref: ...]` no lleva acciones, y los ajustes de una referencia `<>` no se trasladan a la tabla intermedia. Cuando la misma clave externa se declara tanto en línea como en una referencia independiente, se conserva la declarada en línea, sin acciones.  
El ajuste `headercolor` de una tabla, como en `Table users [headercolor: #3498DB]`, pasa a ser su color cuando el valor es un hexadecimal `#rgb` o `#rrggbb` escrito sin comillas. Cualquier otro valor se descarta, y el `headercolor` de un `TablePartial` no se transmite a las tablas que lo usan.  
Cada `TableGroup` se convierte en un [grupo de tablas](./table-groups.md) que contiene las tablas que enumera, una por línea, nombradas como las nombra un `Ref`. Su `[color: ...]` pasa a ser el color del grupo según la misma regla que `headercolor`, y su nota y los demás ajustes se descartan. Una tabla que enumeran dos grupos se queda en el primero. Un grupo que se queda sin tablas no se crea, tanto si no enumera ninguna que declare el archivo como si solo enumera tablas que ya tomó un grupo anterior. El recuadro del grupo se ajusta a sus tablas dondequiera que se coloquen, y cuando las tablas se colocan en filas, las tablas de un grupo permanecen juntas.  
El nombre del archivo debe terminar en `.dbml`.

### AML {#aml}

Puedes importar un archivo AML (Azimutt Markup Language). Se aceptan tanto la sintaxis actual como la sintaxis heredada v1.  
Las entidades se convierten en tablas, y los atributos anidados se aplanan en un nombre de columna con puntos como `settings.slug`.  
Los atributos son `NOT NULL` salvo que se marquen como `nullable`, y las construcciones para las que el editor no tiene sitio, como `check`, `type` y `tags`, se descartan en lugar de rechazarse. Una entidad marcada como vista se importa como una tabla normal.  
El `color` de una entidad, como en `users {color: red}`, pasa a ser el color de su tabla. Los nombres de color de AML, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose` y `gray`, se leen en mayúsculas o minúsculas, entre comillas o no, cada uno como el tono 500 del color de Tailwind de ese nombre, como `#ef4444` para `red`. Un hexadecimal entre comillas como `"#3498db"` se conserva tal como está escrito; un `#3498db` sin comillas no se puede leer, porque `#` inicia un comentario AML. Cualquier otro valor, y un `color` en un atributo o una relación, se descarta.  
Una sentencia `rel` independiente, o `fk` en la sintaxis heredada, conserva sus propiedades `onDelete` y `onUpdate` como el `On Delete` y el `On Update` de la relación, como en `rel posts(user_id) -> users(id) {onDelete: cascade, onUpdate: "set null"}`. Los valores son `cascade`, `restrict`, `set null`, `set default` y `no action`, entre comillas o no, en mayúsculas o minúsculas. Las demás propiedades se descartan.  
En una relación en línea como `user_id int -> users(id) {onDelete: cascade}`, las propiedades pertenecen al atributo, así que se descartan y la relación se importa como `Not set`.  
El nombre del archivo debe terminar en `.aml`.

GraphQL, DBML y AML son formatos de ida y vuelta: cada uno es también un destino del [Generador de código](./code-generator.md).  
DBML y AML transmiten el ON DELETE y el ON UPDATE de cada relación en ambos sentidos; consulta [Generador de código](./code-generator.md#on-delete-and-on-update). GraphQL no transmite ninguno de los dos, así que una importación GraphQL deja ambos en `Not set`.  
DBML también transmite en ambos sentidos los colores de las tablas, sin su transparencia, y cada grupo de tablas que contenga alguna tabla. Un grupo sin nombre vuelve como `group_1`, `group_2`, etc., y a un nombre de grupo repetido se le añade `_2`, `_3`, etc., al volver. AML solo transmite el color de una tabla como el más cercano de sus nombres de color, así que `#FF8800` se escribe como `orange` y vuelve como `#f97316`, y no transmite grupos. GraphQL no transmite ni colores ni grupos.

## Exportar {#exporting}

El submenú `Export` del menú contextual del lienzo tiene tres opciones:

- json: Guarda el diagrama tal como lo contiene su archivo, como `.erd.json`: las tablas con sus columnas e índices, las relaciones, las notas y los grupos de tablas, y los ajustes, cada [ajuste bloqueado](./settings.md#lock) con su valor bloqueado.
- Schema SQL: Abre la pestaña [Esquema SQL](./schema-sql.md#saving-or-copying-the-sql) con su panel de opciones abierto y el foco en su botón `Save file`, así que al pulsar `Enter` se guarda como `.sql` el SQL que muestra la pestaña. Hasta entonces no se guarda nada.
- Image: Abre el cuadro de diálogo `Export image`, que guarda el diagrama como `.png` o `.svg`, o lo copia al portapapeles como PNG; consulta [Imagen](#image).

Las tres funcionan en un editor de solo lectura.

El Esquema SQL escribe el ON DELETE y el ON UPDATE de cada relación después de su `REFERENCES`, primero ON DELETE. `Not set` no escribe nada, y una acción que la base de datos seleccionada no acepta se omite. Consulta [Edición de relaciones](./relationship-editing.md#on-delete-and-on-update) para saber qué base de datos acepta cada una.

Todo archivo exportado se llama `<database name>-<timestamp>` seguido de su extensión, con la marca de tiempo en hora local con el formato `yyyy-MM-dd'T'HH_mm_ss`; por ejemplo, `my-schema-2026-08-29T04_05_06.erd.json`. Si el nombre de la base de datos está vacío, se usa `unnamed`.  
El botón `Save file` de la pestaña Esquema SQL y el del [Generador de código](./code-generator.md) nombran sus archivos de la misma forma. Una imagen toma el nombre de la base de datos tal como era cuando se abrió el cuadro de diálogo.

`Import`, `Import and Add` y `Export` también están disponibles desde la [búsqueda rápida](./quick-search.md) en la pestaña ERD, con las mismas opciones que el menú contextual del lienzo.

En Obsidian no aparece ningún cuadro de diálogo de descarga ni de guardado: el archivo se escribe en la bóveda, donde Obsidian coloca los nuevos archivos adjuntos de ese diagrama, y un aviso indica su ruta.  
Los caracteres que Obsidian no permite en un nombre de archivo, `\ / : * ? " < > |`, se sustituyen por `-`.  
El explorador de archivos de Obsidian solo muestra un archivo `.erd.json` o `.sql` exportado mientras Settings → Files and links → Detect all file extensions está activado.

### Imagen {#image}

`Export` ▸ `Image`, desde el menú contextual del lienzo o desde la búsqueda rápida, abre el cuadro de diálogo `Export image`: una vista previa de la imagen junto a sus opciones. Un [explorador](./explorer.md#dialogs-beside-it) abierto sigue abierto bajo la zona atenuada.

![Abrir Export > Image, desactivar el modo oscuro y el fondo, elegir 3x y copiar la imagen al portapapeles](/img/demo-export.webp)

- `Background`: Activado de forma predeterminada. Si se desactiva, el lienzo queda transparente.
- `Dark mode`: Empieza coincidiendo con la apariencia del editor. Mientras coincide con la apariencia en pantalla, la imagen toma los colores propios del lienzo, cambios del [generador de temas](./language-and-theme.md) incluidos; la otra apariencia usa el tema predefinido con el mismo tono de gris y el mismo color de énfasis.
- `Scale`: `1x`, `2x` o `3x`, con `2x` seleccionado de forma predeterminada. Solo determina el tamaño del PNG y de la copia al portapapeles, y la línea que hay debajo indica ese tamaño, como `PNG <width> × <height> px`.

Las opciones elegidas se conservan hasta que se cierra el editor y nunca se guardan en el documento. La vista previa se dibuja igual que la imagen y se vuelve a dibujar cuando cambia `Background` o `Dark mode`.

La imagen contiene el diagrama tal como estaba cuando se abrió el cuadro de diálogo; cierra y vuelve a abrir el cuadro de diálogo para incluir los cambios posteriores. Contiene todo el diagrama, por lejos que se haya desplazado la vista, recortado a lo que dibuja el diagrama más un margen, y siempre se dibuja al 100 %, sea cual sea el zoom que muestre el editor, así que cada tabla se dibuja completa. Lo que oculta el menú [Opciones de vista](./table-related-functions.md#table-view-options) —relaciones, sus etiquetas ON DELETE y ON UPDATE, grupos de tablas o notas— ni se dibuja ni ocupa espacio, y los grupos de tablas se dibujan detrás de todo lo demás.

Tres botones escriben la imagen, y cada uno deja abierto el cuadro de diálogo:

- `PNG`: Guarda un `.png` del tamaño del diagrama al 100 % multiplicado por el valor de `Scale`. Un PNG demasiado grande para un canvas de navegador se escribe con una resolución reducida en lugar de fallar: el cuadro de diálogo lo advierte antes con `Reduced from <width> × <height> px, past what a browser canvas can hold`, y después lo indica un aviso con el texto `Exported at a reduced resolution`.
- `SVG`: Guarda un `.svg` del tamaño del diagrama al 100 %, sea cual sea el valor de `Scale`, y nunca reducido. Su texto sigue siendo texto y sus fuentes se nombran en lugar de incrustarse, así que un visor sin la fuente del editor dibuja otra. Las sombras se omiten.
- `Copy to clipboard`: Pone en el portapapeles un PNG con el valor de `Scale` elegido, reducido igual que un PNG guardado cuando un canvas de navegador no puede contenerlo. Lo confirma con `Copied the image to the clipboard`, o con `Copied at a reduced resolution` si la imagen se redujo. Si la copia falla, porque el navegador o el host deniegan el acceso al portapapeles o no se pudo dibujar la imagen, `Couldn't copy the image` sugiere guardar un PNG en su lugar.

La imagen se dibuja en un worker en segundo plano cuando el host ejecuta uno, así que el editor sigue siendo utilizable entretanto. Si tarda más de un momento, aparece un aviso que indica `Exporting PNG`, `Exporting SVG` o `Copying image`, y un fallo se notifica como `Couldn't export the PNG` o `Couldn't export the SVG`. Cerrar el cuadro de diálogo mientras un archivo aún se está dibujando no impide que ese archivo se guarde.

`PNG` tiene el foco cuando se abre el cuadro de diálogo, y `Tab` mueve el foco solo dentro del cuadro de diálogo. `Escape`, el botón `x` o un clic en la zona atenuada que lo rodea lo cierran.  
Mientras está abierto, los atajos de teclado del lienzo, deshacer y rehacer incluidos, y copiar y pegar no hacen nada. `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) lo cierra y abre la búsqueda rápida. `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac) lo cierra y pone el cursor de texto en el campo Buscar del [explorador](./explorer.md#opening-and-closing), y abre el explorador si está cerrado, pero nunca lo cierra. En un editor demasiado estrecho para mostrar el explorador, igualmente cierra el cuadro de diálogo, pero muestra una notificación en lugar de mover el cursor de texto.
