---
sidebar_position: 13
description: Genera código para veintidós destinos a partir del diagrama, elige el lenguaje, la base de datos, el estilo de nombres y el delimitador en el panel de opciones, consulta qué destinos escriben las acciones ON DELETE y ON UPDATE de una relación y guarda o copia el resultado.
---

# Generador de código

Cambia a la pestaña `Code Generator` en la barra de herramientas. La pestaña muestra el código de todo el documento a la izquierda y, a su derecha, un panel de opciones con el título `Code Generator`, donde eliges el lenguaje, la base de datos, los estilos de nombres y, para algunos destinos, el delimitador.  
El panel se abre solo, salvo que el editor tenga menos de 640 px de ancho cuando la pestaña se abre por primera vez. `Hide options`, en la parte superior del panel, lo contrae, y `Show options`, arriba a la derecha del código, lo vuelve a mostrar. Sigue abierto o contraído aunque cambies de pestaña mientras el editor siga abierto, con independencia del panel de la pestaña Esquema SQL, y nunca se guarda en el archivo.

Haz clic con el botón derecho en el código para abrir su menú contextual: `Language`, `Database`, `Table Name Case`, `Column Name Case` y `Bracket` (solo para `Doctrine`, `JPA` y `SeaORM`), cada uno con un submenú que marca el valor actual; luego, `Options panel`, que contrae o abre el panel y aparece marcada mientras este se muestra, y `Save file`.  
Mientras esta pestaña está abierta, la [búsqueda rápida](./quick-search.md) ofrece `Database`, `Bracket` (solo para `Doctrine`, `JPA` y `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` y `Code Generator: Options panel`, que contrae o abre el panel.

![Elegir TypeScript y luego Rust en el menú contextual del código, cambiar los nombres de columna a Snake en el panel de opciones y copiar el código](/img/demo-code-generator.webp)

La misma vista de código es también la pestaña `Code Generator` del panel [Propiedades de la tabla](./table-related-functions.md#table-properties), donde genera el código de esa sola tabla en lugar del de todo el documento. Allí no tiene panel de opciones, y su menú contextual cambia los mismos ajustes, pero no tiene `Options panel` ni `Save file`.  
Cuando el código de todo el documento empieza con importaciones o una cabecera, el de una sola tabla empieza con las que necesita esa tabla, como `<?php` para `PHP`, `import Foundation` para `Swift` o `$schema` para `JSON Schema`.

El código se escribe al abrirse la pestaña y de nuevo cada vez que cambia el lenguaje, la base de datos, un estilo de nombres o el delimitador. Una edición del diagrama hecha mientras la pestaña está abierta, como la de un colaborador o la de un agente de programación, se muestra cuando sales de la pestaña y vuelves, o cuando cambia uno de esos ajustes.

## Panel de opciones {#options-panel}

Bajo el rótulo `Saved in the document`, el panel enumera `Language`, `Database`, `Table Name Case` y `Column Name Case`, seguidos de `Bracket` mientras el lenguaje es `Doctrine`, `JPA` o `SeaORM`. Cada uno es una lista desplegable, y un cambio reescribe el código al instante.  
Cuando el lenguaje seleccionado ignora `Database` o los estilos de nombres, estos siguen en el panel, atenuados, con una nota como `Not used by DBML` debajo, y se pueden seguir cambiando.  
`Save file` y `Copy` están al pie del panel; consulta [Guardar o copiar el resultado](#saving-or-copying-the-result).

Son los ajustes propios del diagrama, los mismos que cambian también el menú contextual y la búsqueda rápida. `Database` se guarda en el archivo como cualquier edición.  
`Language`, `Table Name Case`, `Column Name Case` y `Bracket` solo se guardan mientras su bloqueo de la pestaña Configuración está desactivado (`Bracket Type` para `Bracket`), y un diagrama nuevo tiene todos los bloqueos activados. Mientras un bloqueo está activado, un cambio reescribe el código de tu pantalla, pero el archivo conserva el valor bloqueado y el diagrama se vuelve a abrir con él. El panel no muestra ninguna señal de bloqueo: para conservar una elección en el archivo, desactiva su bloqueo; consulta [Bloqueo](./settings.md#lock).

## Lenguaje {#language}

Se admiten veintidós destinos, enumerados en tres grupos —lenguajes, ORM y luego esquemas—, cada uno en orden alfabético. La lista del panel y el menú contextual trazan una línea entre los grupos, pero no nombran ninguno:

| Destino | Grupo | Relaciones | Índices | ON DELETE / ON UPDATE | Se guarda como |
| --- | --- | --- | --- | --- | --- |
| `C#` | Lenguaje | — | — | — | `.cs` |
| `Go` | Lenguaje | — | — | — | `.go` |
| `Java` | Lenguaje | — | — | — | `.java` |
| `Kotlin` | Lenguaje | — | — | — | `.kt` |
| `PHP` | Lenguaje | — | — | — | `.php` |
| `Rust` | Lenguaje | — | — | — | `.rs` |
| `Scala` | Lenguaje | — | — | — | `.scala` |
| `Swift` | Lenguaje | — | — | — | `.swift` |
| `TypeScript` | Lenguaje | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Solo ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Solo únicos | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Esquema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Esquema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Esquema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Esquema | — | — | — | `.json` |
| `Mermaid` | Esquema | ✓ | — | — | `.mmd` |
| `Zod` | Esquema | — | — | — | `.ts` |

El valor predeterminado es `GraphQL`. Todos los destinos generan columnas; las marcas ✓ indican qué más genera cada uno.  
Las tablas se generan por orden de nombre y no en el orden en que están en el lienzo, y los índices son los que aparecen bajo `Indexes` en el panel [Propiedades de la tabla](./table-related-functions.md#indexes), no las filas `Keys` que hay encima. `SeaORM` solo escribe los únicos, y `Mermaid` marca una columna única con `UK`, pero no escribe ningún índice.  
Todos los destinos salvo `Java`, `AML`, `DBML` y `Mermaid` escriben una columna de clave principal como no nula, tenga o no activado `Not Null`. `Java` no indica en ninguna columna si admite valores nulos o no, y `AML`, `DBML` y `Mermaid` conservan el indicador tal como lo tiene el diagrama.

Lo que escriben algunos de los destinos:

- `PHP`: clases simples con propiedades públicas tipadas, que empiezan con `<?php` y `declare(strict_types=1);`.
- `Doctrine`: entidades de Doctrine ORM 3 con atributos, para DBAL 4.2 o posterior, cada columna con su tipo DBAL y sus opciones para la base de datos seleccionada.
- `Rust`: un `pub struct` por tabla, con sus tipos escritos con la ruta completa, como `chrono::NaiveDateTime` o `rust_decimal::Decimal`, sin ninguna línea `use`.
- `SeaORM`: entidades de SeaORM 2.0 en el formato denso, cada tabla un `pub mod`, de modo que todo el texto compila como un solo archivo.
- `Swift`: una estructura `Codable`, `Hashable`, `Sendable` por tabla, que requiere Swift 6.1 o posterior.
- `TypeScript`: una `export interface` por tabla que describe la fila como JSON, igual que el esquema de `Zod`: una fecha o una hora es un `string`, y una columna que admite valores nulos es `T | null`.
- `Zod`: un esquema de fila de Zod 4 por tabla y el tipo que infiere, sin esquema de inserción ni relaciones.
- `JSON Schema`: un único documento de JSON Schema draft 2020-12, con un esquema de fila por tabla bajo `$defs`.
- `Mermaid`: un `erDiagram`, del tipo que renderiza GitHub, en el que cada tabla es una entidad que enumera todas sus columnas con su tipo y su marca `PK`, `FK` o `UK`, si la tiene, y cada relación es una línea entre sus dos tablas.

`AML`, `DBML` y `GraphQL` son formatos de ida y vuelta: cada uno también se puede importar. Consulta [Importar o exportar archivos](./file-import-export.md). Los demás esquemas, `JSON Schema`, `Mermaid` y `Zod`, son solo de salida.  
`DBML` escribe el color de cada tabla como `headercolor` y, en el código de todo el documento, un bloque `TableGroup` después de los `Ref` por cada [grupo de tablas](./table-groups.md) que contiene alguna tabla. `AML` escribe el color de una tabla como el más cercano de los nombres de color de AML.

## ON DELETE y ON UPDATE {#on-delete-and-on-update}

Las acciones ON DELETE y ON UPDATE de una relación se establecen desde su menú contextual; consulta [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Los destinos con ✓ en la columna `ON DELETE / ON UPDATE` de la tabla de [Lenguaje](#language) escriben las acciones que establece una relación; una acción que se deja en `Not set` no escribe nada.  
Las acciones que conservan los destinos ORM dependen de la base de datos seleccionada, mientras que `AML` y `DBML` las conservan todas; consulta [Base de datos](#database).

- `Doctrine` solo escribe ON DELETE, ya que Doctrine no tiene ON UPDATE. Añade `onDelete: 'CASCADE'` a cada `#[ORM\JoinColumn]` del `ManyToOne` o `OneToOne` del lado propietario, como `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, y nada en el `OneToMany` o `OneToOne` del lado inverso. Una relación con una columna única que no es la clave principal se queda en columnas simples, que Doctrine mapea sin asociación, así que no escribe ninguna acción.
- `Drizzle` las escribe en minúsculas. En `.references()` son opciones, como `{ onDelete: "cascade", onUpdate: "set null" }`; en un `foreignKey()`, que es lo que recibe una clave de varias columnas, se encadenan, como `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` las escribe en la relación `belongs_to` de la tabla hija, ON UPDATE primero, con los nombres de SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` y `Restrict`, como `on_update = "Cascade", on_delete = "SetNull"`. El `has_one` o `has_many` de la tabla padre no recibe ninguna.
- `Sequelize` escribe entradas `onDelete: "CASCADE"` y `onUpdate` en las dos llamadas de asociación: `hasMany` o `hasOne`, y `belongsTo`. Una clave de varias columnas no recibe llamadas de asociación, así que `Sequelize` no escribe acciones para ella.
- `SQLAlchemy` pasa los argumentos `ondelete="CASCADE"` y `onupdate` a `ForeignKey()` para una clave de una sola columna, y a `ForeignKeyConstraint()` para una clave de varias columnas.
- `TypeORM` escribe las opciones `onDelete: "CASCADE"` y `onUpdate` en el `@ManyToOne` o `@OneToOne` del lado propietario, nunca en el lado inverso. Siempre omite `SET DEFAULT`, porque TypeORM lo escribiría como `DEFAULT`, que ninguna base de datos acepta.
- `DBML` añade ajustes al `Ref`, como `[delete: set null, update: no action]`.
- `AML` escribe una relación que tiene alguna acción como una sentencia `rel` independiente con propiedades, como `{onDelete: cascade, onUpdate: "set null"}`, en lugar de en línea en su columna.

`JPA` no escribe ninguna: JPA estándar no tiene ninguna opción para ellas, y el generador no usa el `@OnDelete` de Hibernate. `Mermaid` tampoco escribe ninguna, ya que una línea de `erDiagram` no tiene sitio para ellas.  
En la pestaña `Code Generator` del panel Propiedades de la tabla, que muestra una sola tabla, `DBML` no escribe ningún `Ref` ni `AML` ninguna sentencia `rel`, así que ninguno de los dos muestra allí las acciones; `AML` mantiene en línea en su columna una relación de una sola columna que tiene acciones, igual que hace con una que no las tiene. `Mermaid` no escribe allí ninguna línea de relación en absoluto. `Doctrine` y `SeaORM` escriben allí la misma entidad que en todo el documento, acciones incluidas.

## Estilo de nombres {#name-case}

`Table Name Case` y `Column Name Case` admiten cada uno `Pascal`, `Camel`, `Snake` y `None`.  
Los valores predeterminados son `Pascal` para los nombres de tabla y `Camel` para los nombres de columna. `None` genera un nombre tal como está escrito en el diagrama.  
Con cualquier estilo, un nombre que el lenguaje del destino reserva se escapa cuando ese lenguaje permite escaparlo, como `@class` en `C#` o `r#type` en `Rust`, y se renombra cuando no lo permite, como `class_` en `Java`.

`AML`, `DBML` y `Mermaid` ignoran ambos ajustes y siempre generan los nombres del diagrama.  
`SeaORM` también los ignora: nombra los campos y los módulos en snake case, la forma que SeaORM vuelve a leer, e indica los nombres almacenados en `table_name` y, cuando difieren, en `column_name`.  
Para estos cuatro destinos, el panel atenúa ambas listas, con la nota `Not used by` debajo.

Todos los destinos escriben los nombres físicos, sea lo que sea lo que muestre la [vista de nombres](./logical-names.md#name-view).  
Ninguno escribe un nombre lógico, ni siquiera en un comentario vacío: esta pestaña no tiene nada equivalente a la opción [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) de la pestaña Esquema SQL.  
Tampoco escribe ninguno un dominio: una columna vinculada a uno se escribe con su tipo de datos, como cualquier otra columna.

## Base de datos {#database}

Los tipos de datos se resuelven según la base de datos seleccionada; consulta [Bases de datos](./table-related-functions.md#databases).  
En esta pestaña, elígela en la lista `Database` del panel, en el submenú `Database` del menú contextual o en la búsqueda rápida, y el código se reescribe al instante. Es el único ajuste de base de datos del diagrama, el mismo que establecen el menú contextual del lienzo y la pestaña [Esquema SQL](./schema-sql.md), así que un cambio aquí también se ve allí.  
`Drizzle` toma su dialecto del mismo ajuste: `pgTable` para PostgreSQL, `mysqlTable` para MySQL y MariaDB, `sqliteTable` para SQLite y `pgTable` para cualquier otra base de datos.  
`SeaORM` escribe un `column_type` donde, de lo contrario, SeaORM crearía un tipo de columna distinto en PostgreSQL, MySQL, MariaDB o SQLite, y ninguno en MSSQL, Oracle, Snowflake o Databricks, para las que SeaORM no tiene backend.

La base de datos seleccionada también decide qué acciones ON DELETE y ON UPDATE escriben los destinos ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` y `TypeORM` omiten cualquier acción que omita el Esquema SQL de esa base de datos, como `SET DEFAULT` en MySQL y MariaDB, `RESTRICT` en MSSQL o todas las acciones salvo `NO ACTION` en Snowflake y Databricks, de modo que se aplica el valor predeterminado de la base de datos. La lista completa está en [ON DELETE y ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle`, en cambio, sigue el dialecto que escribe: el código `mysqlTable` omite `SET DEFAULT`, mientras que el código `pgTable` y `sqliteTable` conserva todas las acciones, incluido el código `pgTable` que escribe para MSSQL, Oracle, Snowflake y Databricks.

`AML`, `DBML` y `Mermaid` son la excepción: generan cada tipo de datos tal como está escrito en el diagrama, así que el ajuste de base de datos no cambia su salida, y el panel atenúa `Database` para ellos. `AML` y `DBML` escriben todas las acciones que establece una relación, y `Mermaid` no escribe ninguna.

## Delimitador {#bracket}

`Bracket` solo se ofrece en el panel, el menú contextual y la búsqueda rápida mientras el lenguaje es `Doctrine`, `JPA` o `SeaORM`.  
Es el mismo ajuste que el delimitador de la pestaña Esquema SQL —consulta [Esquema SQL](./schema-sql.md#database-and-bracket)—, así que un cambio aquí también cambia cómo entrecomilla los nombres el Esquema SQL. Ofrece `SingleQuote`, `DoubleQuote`, `Backtick` y `None`, y empieza en `None`.

- `Doctrine`: con cualquier delimitador salvo `None`, todos los nombres de tabla, de columna y de columna de unión se rodean de acentos graves, que es como Doctrine marca un nombre que hay que entrecomillar, como ``#[ORM\Table(name: '`order`')]``. Con `None`, solo se rodea el nombre que lo necesita: una palabra que una base de datos reserva, un nombre que no es un identificador ASCII simple o un nombre escrito entre comillas.
- `JPA`: con cualquier delimitador salvo `None`, un nombre de tabla que es una palabra reservada se entrecomilla dentro de `@Table`, como `@Table(name = "\"user\"")`. Con `None` se deja sin comillas, como lo deja el Esquema SQL.
- `SeaORM`: con `None`, los nombres se escriben como los almacena la base de datos: un nombre de tabla con punto se divide en `schema_name` y `table_name`, y en PostgreSQL un nombre sin comillas se pasa a minúsculas. Con cualquier otro delimitador, un nombre se mantiene entero, tal como está escrito.

## Guardar o copiar el resultado {#saving-or-copying-the-result}

`Save file`, al pie del panel de opciones o en el menú contextual, guarda como archivo el código que se muestra.  
Se nombra como cualquier exportación, `<database name>-<timestamp>`, seguido de la extensión de la tabla de [Lenguaje](#language), como `shop-2026-10-12T04_05_06.ts`, y va adonde va cualquier exportación en tu host; consulta [Exportar](./file-import-export.md#exporting). `Java` y `JPA` ponen todas las clases en un solo archivo `.java`, tal como las muestra la pestaña.  
El menú Exportar no tiene ninguna opción para el Generador de código, y la pestaña `Code Generator` del panel Propiedades de la tabla no puede guardar archivos.

Para copiar el código, haz clic en `Copy` al pie del panel, o pasa el puntero por encima del código y haz clic en el botón de copiar de su esquina superior derecha, que es la única forma en el panel Propiedades de la tabla.  
Una notificación `Copied!` con una marca de verificación lo confirma durante dos segundos. Si el navegador o el host deniega el acceso al portapapeles, una notificación `Couldn't copy to the clipboard` con un icono de advertencia lo indica en su lugar, durante cinco segundos. Volver a copiar reemplaza la notificación en lugar de añadir otra.  
El texto también se puede seleccionar, así que puedes tomar solo la parte que necesitas.
