---
sidebar_position: 14
description: Guarda los dominios, las palabras y los términos del diagrama en la pestaña Diccionario, deriva nombres físicos a partir de nombres lógicos, deja que un dominio fije el tipo de datos de sus columnas, consulta lo que detecta la hoja Comprobaciones, edita y ordena las hojas como en una hoja de cálculo, e impórtalas y expórtalas como archivos CSV.
---

# Diccionario

La pestaña Diccionario guarda el estándar de nomenclatura del diagrama en tres diccionarios, cada uno en una hoja que editas como una hoja de cálculo:

- `Domains`: tipos de datos con nombre, como `Name` para `VARCHAR(100)`. Una columna vinculada a un dominio tiene el tipo de datos de este.
- `Words`: las palabras estándar de las que se componen los nombres lógicos, cada una con la abreviatura que usa para ella un nombre físico, como `Customer` y `CUST`.
- `Terms`: nombres lógicos completos, cada uno con el nombre físico y el dominio que da, como `Customer Name` con `CUST_NM`.

El [nombre lógico](./logical-names.md) de una tabla o de una columna deriva su nombre físico de estos diccionarios, y el término de una columna también puede vincularla a un dominio; consulta [Derivar nombres físicos](#deriving-physical-names).  
Una cuarta hoja, `Checks`, enumera lo que los diccionarios detectan como incorrecto en los nombres y tipos del diagrama y en los propios diccionarios, como una palabra prohibida en un nombre lógico; consulta [La hoja Comprobaciones](#the-checks-sheet).

## Abrir la pestaña {#opening-the-tab}

Cambia a la pestaña `Dictionary` en la barra de herramientas, el botón con el icono de un libro entre `Code Generator` y `Settings`, o, en la [búsqueda rápida](./quick-search.md), elige `Dictionary` en `Tab`.  
Puede ser la pestaña con la que se abre el diagrama; consulta `Canvas Type` en [Bloqueo](./settings.md#lock).

La pestaña se abre en la hoja `Domains` hasta que eliges otra.  
Cada vez que se abre, la hoja vuelve con la selección y el desplazamiento que dejaste, o con su primera celda seleccionada en la primera visita. Su cuadrícula recibe el foco del teclado, así que lo que escribes y las teclas de flecha actúan de inmediato.

La hoja que se muestra y la búsqueda, la selección, el desplazamiento y el ancho de las columnas de cada hoja son solo tuyos.  
Nada de ello se guarda en el archivo, se registra en el historial de deshacer ni se comparte con los colaboradores. Se conserva mientras el editor sigue abierto, aunque cambies de pestaña o cargues otros documentos en el mismo editor.

## Las hojas {#the-sheets}

La barra de la parte superior contiene los cuatro botones de hoja, `Domains`, `Words`, `Terms` y `Checks`, y el botón de la hoja que se muestra aparece pulsado. Cada uno muestra un recuento junto a su nombre: las filas que contiene su hoja, muestre lo que muestre la búsqueda, o, en `Checks`, el número de comprobaciones, con el color de su nivel; consulta [La hoja Comprobaciones](#the-checks-sheet).  
A continuación viene el campo de búsqueda; consulta [Buscar](#searching). Al final de la barra, en `Domains`, `Words` y `Terms` y no en un editor de solo lectura, hay cuatro herramientas: `Add Row`, `Delete Rows`, `Import CSV` y `Export CSV`; consulta [Añadir y eliminar filas](#adding-and-deleting-rows) e [Importar y exportar CSV](#importing-and-exporting-csv).  
En un panel estrecho o con un idioma de la interfaz de textos largos, la barra ocupa más líneas, de modo que todos los botones siguen a mano.

Bajo la cuadrícula, una línea de estado cuenta las filas que deja la búsqueda, como en `4 rows`, y, mientras la selección abarca alguna fila, cuántas abarca, como en `1 selected`. Una fila que comparten dos rangos cuenta una vez, así que ese número es el de filas que eliminaría `Delete Rows`.  
Los números de fila de la izquierda cuentan las filas tal como las muestra la hoja, desde 1. Una celda de solo lectura, como lo son todas las celdas de `Checks` y todas las de un editor de solo lectura, se dibuja sobre un fondo gris, salvo donde la marca una comprobación.  
Una hoja `Domains`, `Words` o `Terms` vacía indica `Import a CSV file or add a row`, salvo en un editor de solo lectura.

Las columnas de cada hoja, en orden:

| Hoja | Columnas |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Qué hacen las celdas:

- El `Data Type` de un dominio se escribe como un tipo de columna, por ejemplo `VARCHAR(100)` o `NUMERIC(15,2)`, y toda columna vinculada al dominio lo tiene; consulta [Dominios y tipos de datos](#domains-and-data-types).
- La `Abbreviation` de una palabra es lo que usa un nombre físico para esa palabra; consulta [A partir de las palabras](#from-the-words).
- Los `Synonyms` y las `Forbidden Words` de una palabra enumeran otras palabras para lo mismo, separadas por comas. A cada elemento se le quitan los espacios de los extremos, un elemento vacío se descarta y un elemento igual a la propia palabra se ignora. Un nombre lógico que usa uno de ellos no compone ningún nombre físico, y la hoja `Checks` lo señala e indica la palabra que se debe usar en su lugar; consulta [Qué detecta cada comprobación](#what-each-check-finds).
- El `Term` de un término es un nombre lógico completo, y su `Physical Name` es el nombre que da ese nombre lógico; consulta [A partir de un término](#from-a-term).
- El `Domain` de un término muestra el nombre del dominio que vincula, y está vacío mientras no vincula ninguno o vincula un dominio eliminado desde entonces; consulta [El dominio de un término](#a-terms-domain).
- `Category`, `English Name`, cada `Description` y los `Synonyms` de un término son anotaciones. No cambian nada y ninguna comprobación los lee.

En un [idioma de la interfaz de derecha a izquierda](./language-and-theme.md#right-to-left-languages), la barra, el menú de la cuadrícula y la línea de estado se reflejan, mientras que las hojas y la lista de dominios de un término siguen de izquierda a derecha.

## Derivar nombres físicos {#deriving-physical-names}

Los diccionarios pueden dar a una tabla o a una columna su nombre físico, el nombre que escriben el Esquema SQL y el Generador de código, a partir de su nombre lógico. Primero se busca un término cuyo `Term` sea el nombre lógico; si no lo hay, el nombre se compone a partir de las abreviaturas de las palabras.  
Por ejemplo, con las palabras `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) y `Date` (`DT`), y el término `Customer Number` con el nombre físico `CUST_NO` y el dominio `Number`, cuyo tipo de datos es `INT`:

- El nombre lógico `Customer Number` da a una columna el nombre `CUST_NO`, la vincula a `Number` y le da el tipo `INT`.
- `Order Date` compone `ORD_DT`.
- Una tabla con el nombre lógico `Customer` recibe el nombre `CUST`.

Con una hoja `Words` vacía y una hoja `Terms` vacía, no se deriva nada.

### Cuándo se deriva un nombre {#when-a-name-is-derived}

Un nombre físico se deriva cuando se escribe un nombre lógico:

- En el lienzo, cuando el editor de la celda del nombre lógico se cierra con un nombre lógico distinto del que tenía al abrirse, con `Enter`, `Tab`, `Escape` o un clic en otro lugar. Cada tecla que pulsas solo escribe el nombre lógico; consulta [Escribir un nombre lógico](./logical-names.md#writing-a-logical-name).
- De inmediato, cuando eliges un término de la lista que hay bajo la celda; consulta [Completar nombres de términos](./logical-names.md#completing-term-names).
- Cuando un pegado escribe en una celda del nombre lógico; consulta [Copiar y pegar columnas](./table-editing.md#copyingpasting-columns).
- Cuando [Buscar y reemplazar](./find-and-replace.md#replacing) reemplaza un nombre lógico, una coincidencia o todas.
- Cuando un agente de programación establece un nombre lógico.

Solo se deriva mientras el nombre físico está vacío o es a su vez un nombre derivado; consulta [Nombres escritos por ti](#names-of-your-own).  
Al elegir un término, al pegar o al reemplazar, el nombre lógico y lo que deriva se escriben como un solo paso de deshacer. En el lienzo, el nombre que se deriva al cerrarse el editor es un paso propio, posterior a lo que escribiste: el primer deshacer retira el nombre derivado, junto con el dominio y el tipo que aportó un término, y deja el nombre lógico que escribiste.

Después, nada se vuelve a derivar por sí solo. Una nueva `Abbreviation` de una palabra, un nuevo `Physical Name` o `Domain` de un término y las palabras o los términos nuevos dejan como están los nombres ya derivados; para eso, usa [Volver a derivar los nombres físicos](#derive-physical-names-again). El `Data Type` de un dominio es la excepción: llega a sus columnas de inmediato.

### A partir de un término {#from-a-term}

Primero se busca en la hoja `Terms` un término cuyo `Term` sea igual al nombre lógico. Se ignoran los espacios de los extremos y la composición Unicode, pero se distinguen mayúsculas y minúsculas, así que `customer number` no coincide con `Customer Number`. De dos términos con un mismo nombre, cuenta el primero de la hoja.

- El término da su `Physical Name` o, mientras este está vacío, el nombre que componen sus palabras, como se explica más abajo, si componen alguno.
- Para una columna, el término también vincula su `Domain` mientras la hoja `Domains` lo contiene, lo que da a la columna el tipo de datos del dominio; consulta [Vincular una columna](#linking-a-column). Lo hace incluso cuando el término no da ningún nombre. Un término sin dominio no desvincula nada.
- Una tabla solo toma el nombre físico del término.

### A partir de las palabras {#from-the-words}

Si no hay ningún término que coincida, las palabras componen el nombre:

1. El nombre lógico se corta en los espacios, `_`, `-`, `·` y `/`, y ninguna palabra cruza un corte.
2. Cada parte se lee desde la izquierda, tomando en cada punto el texto más largo que figura en la hoja `Words`, como `Word`, sinónimo o palabra prohibida, y sin retroceder nunca. Con las palabras `가입`, `가입일` y `일자`, `가입일자` se lee como `가입일` y `자`, lo que deja `자` sin registrar, mientras que `가입 일자` se lee como `가입` y `일자`. Se distinguen mayúsculas y minúsculas: `member` no es la palabra `Member`.
3. El nombre físico une con `_` la `Abbreviation` de cada palabra tal como está escrita, por ejemplo `ORD_DT`. De dos palabras con un mismo nombre, la primera de la hoja da la abreviatura. No se aplica ningún límite de longitud, y `Table Name Case` y `Column Name Case` del Generador de código no intervienen.

Es todo o nada. Si algún segmento es un sinónimo, una palabra prohibida o un texto que no figura en ninguna palabra, o si una palabra tiene la `Abbreviation` vacía, no se compone ningún nombre y el nombre físico se queda como está.

### Nombres escritos por ti {#names-of-your-own}

Los diccionarios solo rellenan un nombre físico mientras está vacío o lo rellenaron ellos mismos. El editor lo recuerda para cada tabla y columna, aunque nada en el lienzo lo muestra.

- Un nombre que escribes pasa a ser tuyo: escribir en una celda del nombre, reemplazar un nombre de tabla o columna con Buscar y reemplazar, pegar sobre la celda del nombre de una columna y el cambio de nombre de un agente de programación. Un nombre lógico escrito después lo deja como está, solo escribe el nombre lógico y no vincula ningún dominio.
- Vaciar el nombre lo devuelve a los diccionarios, ya que un nombre vacío siempre se deriva.
- Un nombre lógico que no deriva nada deja el nombre físico y su estado como estaban: un nombre vacío sigue vacío, y un nombre derivado se conserva y sigue siendo de los diccionarios.
- Una tabla o columna nueva empieza con un nombre vacío, así que su primer nombre lógico lo deriva. Una columna de clave externa que añade una relación recibe un nombre basado en su clave, que cuenta como tuyo; consulta [Nombres de las columnas de clave externa](./relationship-editing.md#foreign-key-column-names).
- Los nombres que trae un `Import` o `Import and Add` de Esquema SQL, GraphQL, DBML o AML, y los nombres de un diagrama creado con una versión anterior a la pestaña Diccionario, cuentan como tuyos, así que un nombre lógico escrito sobre ellos después no deriva nada.
- Una [tabla duplicada](./table-related-functions.md#duplicating-tables-and-memos), una columna [movida a otra tabla](./table-editing.md#rearranging-and-moving-columns) con su asa de arrastre, el pegado de tablas copiadas y el `Import and Add` de un archivo JSON conservan el estado de cada nombre. Las columnas pegadas en las tablas seleccionadas como columnas nuevas cuentan como tuyas, salvo que el nombre pegado esté vacío y su nombre lógico derive uno.
- [Volver a derivar los nombres físicos](#derive-physical-names-again) devuelve a los diccionarios un nombre escrito por ti, incluido uno importado.

### Dos columnas, un mismo nombre {#two-columns-one-name}

Una columna no deriva nada cuando otra columna de su tabla ya tiene el nombre que derivaría. Conserva su nombre, su estado y su vínculo con el dominio, y solo se escribe su nombre lógico. Los nombres se comparan sin distinguir mayúsculas y minúsculas y sin los espacios de los extremos, igual que los nombres de las columnas de clave externa.  
Cuando un mismo cambio daría a dos columnas el mismo nombre, como puede ocurrir con `Replace All` o `Derive Physical Names Again` sobre una tabla, lo toma la primera de la tabla.  
Por ejemplo, una autorreferencia en `members` con la clave `MBR_NO` añade `MBR_NO_2`, que copia el nombre lógico `Member Number`. `Derive Physical Names Again` la llamaría `MBR_NO`, que ya tiene la clave, así que conserva `MBR_NO_2`.  
Las tablas no tienen esa regla: dos tablas pueden derivar el mismo nombre.

## Volver a derivar los nombres físicos {#derive-physical-names-again}

Usa `Derive Physical Names Again` después de cambiar la `Abbreviation` de una palabra o el `Physical Name` o el `Domain` de un término, ya que esos cambios no renombran nada por sí solos. Devuelve a los diccionarios los nombres que abarca y los vuelve a derivar con las reglas anteriores, incluidos los nombres que escribiste tú. Solo se ofrece en la pestaña ERD, y no en un editor de solo lectura:

- El menú contextual de la tabla, justo después de `Focus on this table` o `Focus on selected tables`. Mientras la tabla es una de dos o más tablas seleccionadas, `Derive Physical Names Again` las abarca todas, sea cual sea el punto de la tabla en el que hagas clic con el botón derecho. Si no, un clic derecho en la fila de una columna ofrece `Derive Physical Name Again`, solo para esa columna, y uno en el encabezado ofrece `Derive Physical Names Again`, para el nombre de la tabla y todas sus columnas.
- El menú contextual del lienzo, justo después de `Name View`: `Derive Physical Names Again`, para todas las tablas y columnas del diagrama. No aparece mientras el diagrama no tiene ninguna tabla.
- La [búsqueda rápida](./quick-search.md#what-the-palette-lists), como entradas para la columna con el foco, la tabla con el foco, las tablas seleccionadas y todo el diagrama.

![Cambiar la abreviatura de Number de NO a NUM en la hoja Words, con los nombres físicos del diagrama que siguen siendo MBR_NO y PAY_NO, y luego Derive Physical Names Again desde el menú del lienzo, que los convierte en MBR_NUM y PAY_NUM mientras ORD_NO, que da su término, se mantiene](/img/demo-derive-physical-names.webp)

Se vuelve a derivar cada tabla y columna abarcada que tiene un nombre lógico. Una columna también toma el dominio que da su término y, con él, el tipo del dominio, que se propaga por las relaciones mientras [Sincronizar el tipo de datos en las relaciones](./settings.md#relationship-datatype-sync) está activado.  
Deja sin tocar una tabla o columna sin nombre lógico, y una columna cuyo nuevo nombre tiene otra columna de su tabla; consulta [Dos columnas, un mismo nombre](#two-columns-one-name). Cada una de ellas conserva su nombre y su estado, tuyo o de los diccionarios, y una columna también conserva su vínculo con el dominio.  
Un nombre lógico que ahora no deriva nada deja el nombre físico como está, pero lo devuelve a los diccionarios, así que el siguiente nombre lógico que escribas lo deriva.  
Es un solo paso de deshacer, cambie los nombres, vínculos y tipos que cambie. No registra ningún paso únicamente cuando no cambia nada, y devolver un nombre escrito por ti a los diccionarios cuenta como un cambio, aunque el nombre ya tenga lo que estos dan.

El `Physical Name` propio de un término no se vuelve a componer a partir de las palabras cambiadas, así que edita el término antes de volver a derivar.

## Dominios y tipos de datos {#domains-and-data-types}

Una columna vinculada a un dominio tiene el `Data Type` del dominio. Vincular una columna le da ese tipo de inmediato.  
Cuando cambia el `Data Type` de un dominio, ya sea porque se edita, se pega o se importa en la hoja `Domains` o porque lo cambia un colaborador o un agente de programación, todas las columnas vinculadas a él toman el nuevo tipo en el mismo paso. Mientras [Sincronizar el tipo de datos en las relaciones](./settings.md#relationship-datatype-sync) está activado, cada uno de esos cambios continúa por las relaciones igual que un cambio escrito a mano; mientras está desactivado, solo cambian las columnas vinculadas.  
Cambiar el nombre de un dominio solo cambia el nombre que muestran las celdas Dominio de las columnas.

Un cambio de tipo hecho en la hoja `Domains` se deshace allí, junto con los tipos de columna que dio; consulta [Hojas del diccionario](./undo-redo.md#dictionary-sheets).  
Un deshacer o un rehacer en la pestaña ERD que vuelve a vincular una columna a un dominio, o que recupera una columna vinculada a uno, da a la columna el tipo del dominio tal como está ahora. Uno que restituye otro tipo desvincula la columna.

### Vincular una columna {#linking-a-column}

Lo siguiente vincula una columna a un dominio:

- Elegir el dominio en la celda Dominio de la columna, que se muestra con Opciones de vista → `Domain`, o, en `Logical Names`, en la celda del tipo que ocupa su lugar; consulta [La celda Dominio](./logical-names.md#the-domain-cell).
- Un nombre lógico cuyo término da un dominio; consulta [A partir de un término](#from-a-term). Esto solo ocurre mientras el nombre se deriva, así que no con un nombre escrito por ti ni con una columna cuyo nombre derivado tiene otra columna.
- `Derive Physical Name Again` o `Derive Physical Names Again`, que vincula el dominio del término de cada columna abarcada.
- Una relación: una columna de clave externa copia el dominio de su clave, junto con su tipo y su nombre lógico; consulta [Relaciones identificadoras](./relationship-editing.md#identifying-relationships). Una clave cuya copia recibe otro tipo, como ocurre con la de una clave serial, no transmite ningún dominio.
- Duplicar su tabla o moverla a otra tabla con su asa de arrastre, dos acciones que conservan el vínculo. El pegado de tablas o columnas copiadas solo lo conserva mientras este diagrama contiene el dominio y el dominio sigue teniendo el tipo de la columna copiada, así que una copia de otro diagrama llega sin vincular; consulta [Copiar y pegar tablas y notas](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` no vincula ninguna columna.
- El nombre de un dominio pegado en una celda Dominio; consulta [Copiar y pegar columnas](./table-editing.md#copyingpasting-columns).

### Desvincular {#unlinking}

- Escribir un tipo en la celda `DataType` de una columna vinculada, o aceptar una sugerencia, desvincula la columna en cuanto su tipo difiere del de su dominio, y la columna conserva el tipo que escribiste; consulta [Autocompletado del tipo de datos](./table-editing.md#datatype-autocomplete). Volver a escribir el tipo del dominio no la vuelve a vincular; en su lugar, elige el dominio en su celda Dominio. Pegar sobre la celda `DataType` y el cambio de tipo de un agente de programación desvinculan de la misma forma.
- Mientras Sincronizar el tipo de datos en las relaciones está activado, toda columna a la que llega un cambio de tipo y cuyo nuevo tipo difiere del de su propio dominio se desvincula en el mismo paso, como una clave externa vinculada a un dominio propio. [Asignar columnas](./relationship-editing.md#map-columns) desvincula de la misma forma las columnas a las que cambia el tipo.
- `None` en la celda Dominio desvincula la columna y conserva su tipo.
- Cambiar o vaciar el `Domain` de un término, o eliminar un término, no cambia ninguna columna.

### Eliminar un dominio {#removing-a-domain}

Eliminar la fila de un dominio deja sus columnas con sus tipos, y sus vínculos se mantienen. Las columnas no muestran ningún dominio, y la hoja `Checks` muestra `Unknown domain` para cada una de ellas mientras la hoja `Domains` sigue conteniendo algún dominio. Al deshacer la eliminación en la hoja `Domains`, los vínculos vuelven a mostrarse.  
Mientras el dominio no existe, escribir en una de esas columnas un tipo que no sea el del dominio la desvincula definitivamente, y lo mismo hace `None` en su celda Dominio.  
El archivo omite esos vínculos al guardarse, así que el diagrama se vuelve a abrir con esas columnas sin vincular.

Un término vinculado a un dominio eliminado muestra vacía la celda `Domain`, marcada como `Unknown domain`. `Delete` o `Backspace` en la celda lo desvincula; consulta [El dominio de un término](#a-terms-domain).

## La hoja Comprobaciones {#the-checks-sheet}

La hoja `Checks` enumera lo que las comprobaciones de los diccionarios detectan en los diccionarios y en las tablas y columnas del diagrama. Las comprobaciones solo leen: no cambian nada.  
Cada comprobación solo se ejecuta mientras la hoja que lee contiene alguna fila, y las comprobaciones de palabras, solo mientras la hoja `Words` contiene una palabra con nombre, así que un diagrama con los diccionarios vacíos no muestra nada.

![Customer Num en rojo y Order Stat en ámbar en Logical Names, la hoja Checks con sus tres comprobaciones y un recuento en rojo, un doble clic en la fila Forbidden word que vuelve a Customer Num en el diagrama, y escribirlo de nuevo como Member Number, lo que deja una sola comprobación](/img/demo-dictionary-checks.webp)

Sus tres columnas son de solo lectura:

- `Type` indica la comprobación; consulta [Qué detecta cada comprobación](#what-each-check-finds).
- `Target` indica una palabra, un término o un dominio por su nombre, una tabla por su nombre y una columna como `table.column`, con la tabla y la columna nombradas como las nombra la [vista de nombres](./logical-names.md#beyond-the-canvas), y `unnamed` donde la vista no muestra ningún nombre.
- `Detail` muestra lo que encontró la comprobación y, después de `→`, lo que ofrecen los diccionarios en su lugar, varios unidos por comas, como `멤버 → 회원`. Un lado vacío indica `—`, como en `— → NUMERIC(15)`.

Primero van las comprobaciones de las palabras, después las de los términos y las de los dominios, y luego tabla por tabla, cada tabla seguida de sus columnas.  
La lista sigue cada edición en cuanto se produce, incluidas las de un colaborador y las de un agente de programación, y cada cambio de la vista de nombres.  
El recuento del botón `Checks` está en rojo mientras alguna comprobación es un error, en ámbar mientras todas son advertencias y atenuado cuando no hay ninguna.

Las filas no se pueden editar, añadir, eliminar, ordenar, importar ni exportar: la barra no muestra herramientas, un clic derecho no abre el menú de la cuadrícula, y deshacer y rehacer no hacen nada. Buscar, seleccionar y copiar funcionan como en las otras hojas.

`Enter` o un doble clic en una fila lleva a lo que indica:

- Una palabra, un término o un dominio: la pestaña muestra su hoja con seleccionada la celda que lee la comprobación, el nombre o el `Domain` de un término, y con su fila como la primera visible. La búsqueda de la hoja se borra si oculta la fila. Una fila eliminada desde entonces no lleva a ninguna parte.
- Una tabla o una columna: se abre la pestaña ERD con solo esa tabla seleccionada y con el foco en la celda que lee la comprobación. Es el nombre, el nombre lógico o la celda Dominio o, donde la fila no dibuja esa celda, la que se dibuja en su lugar. El lienzo recibe el foco del teclado, y la vista se mueve según la regla de [Dónde termina un salto](./table-related-functions.md#where-a-jump-lands).

Un doble clic en un encabezado, en el borde de una columna, en una barra de desplazamiento o bajo las filas no lleva a ninguna parte.  
Un agente de programación enumera las mismas comprobaciones, en el mismo orden, con `erd_list_checks`; consulta [Comprobaciones del diccionario](../../mcp/tools.md#dictionary-checks).

Las otras tres hojas marcan las celdas que leen las comprobaciones, un nombre o el `Domain` de un término, con texto rojo o ámbar sobre un fondo tintado:

- Rojo: un nombre que tiene otra fila de su hoja, el `Domain` de un término que vincula un dominio eliminado y un `Term` que usa una palabra prohibida.
- Ámbar: un `Term` que usa un sinónimo o una palabra no registrada.

Una celda toma el más grave de sus niveles. Las marcas también se muestran en un editor de solo lectura, y la propia hoja `Checks` no lleva color. Para las marcas del lienzo ERD, consulta [Marcas en el lienzo](#marks-on-the-canvas).

### Qué detecta cada comprobación {#what-each-check-finds}

| `Type` | Nivel | Detecta | `Detail`, por ejemplo |
| --- | --- | --- | --- |
| `Duplicate name` | Error | Un `Word`, `Term` o `Domain` que también tiene otra fila de la misma hoja. Se muestra cada una de las filas. | `Member` |
| `Unknown domain` | Error | Una columna o un término todavía vinculado a un dominio eliminado, mientras la hoja `Domains` contiene algún dominio | El nombre del dominio eliminado |
| `Forbidden word` | Error | Un segmento de un nombre lógico o de un `Term` que una palabra incluye en sus `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Advertencia | Un segmento del nombre lógico de una tabla o de una columna, o de un `Term`, que no figura en ninguna palabra | `자` |
| `Synonym` | Advertencia | Un segmento que una palabra incluye en sus `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Advertencia | Una tabla o una columna cuyo nombre lógico coincide con un término pero cuyo nombre físico no es el que da el término | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Advertencia | Una columna cuyo `DataType` no es el `Data Type` del dominio que vincula | `INT → NUMERIC(15)` |

- Los nombres se comparan sin los espacios de los extremos y distinguiendo mayúsculas y minúsculas, así que `Member` y `member` son dos nombres, y un nombre vacío nunca es un duplicado. Las hojas rechazan una edición que daría a dos filas un mismo nombre, así que `Duplicate name` solo aparece donde se cruzaron dos ediciones, como cuando dos colaboradores dan nombre a filas a la vez, o en un archivo editado en otro lugar.
- Las comprobaciones de palabras leen un nombre como se explica en [A partir de las palabras](#from-the-words), y muestran cada segmento distinto una vez por nombre. `Forbidden word` y `Synonym` ofrecen la palabra que incluye el segmento.
- `Physical name mismatch` compara el nombre, sin los espacios de los extremos, con el `Physical Name` del término, o con lo que componen sus palabras mientras no tiene ninguno, y no indica nada mientras el término no da ningún nombre. Una columna de clave externa que copió el nombre lógico de su clave presenta esta discrepancia siempre que su propio nombre no coincide con el del término, como `members_id → MBR_ID`. `Derive Physical Name Again` la corrige, salvo que otra columna tenga ese nombre.
- `Domain type mismatch` nunca surge de ediciones en un solo editor, ya que una columna vinculada siempre termina con el tipo de su dominio. Puede aparecer cuando un colaborador vincula una columna mientras otro cambia el tipo de ese dominio, o en un archivo escrito en otro lugar. Elegir de nuevo el dominio en la celda Dominio de la columna le da su tipo, y `None` la desvincula. Un vínculo con un dominio eliminado solo se muestra como `Unknown domain`.

### Marcas en el lienzo {#marks-on-the-canvas}

El lienzo ERD escribe con el color de su comprobación cada nombre que señalan las comprobaciones:

- Una celda del nombre lógico, en el encabezado de la tabla o en la fila de una columna, está en rojo mientras su nombre lógico usa una palabra prohibida y, si no, en ámbar mientras usa un sinónimo o una palabra que no tiene la hoja `Words`.
- Una celda del nombre físico, en el encabezado o en una fila, está en ámbar mientras el término con el que coincide su nombre lógico da otro nombre físico.

Solo se marcan esos dos tipos de celda, nunca la celda Dominio ni la celda `DataType`, así que `Unknown domain` y `Domain type mismatch` de una columna solo se muestran en la hoja `Checks`.  
Una celda solo se marca por lo que dibuja: `Physical Names` solo puede marcar nombres físicos, `Logical Names` solo nombres lógicos y `Both Names` cada celda por sus propias comprobaciones; consulta [Vista de nombres](./logical-names.md#name-view). Una celda en blanco conserva el color de su marcador de posición, y unos diccionarios vacíos no marcan nada.  
En el encabezado de una tabla de un [grupo de tablas](./table-groups.md) con color, una marca solo conserva su color mientras sigue siendo legible sobre el color del grupo; si no, el nombre toma el negro o el blanco propio del encabezado.

Las marcas se muestran en el lienzo ERD, en el [viaje en el tiempo](./undo-redo.md#time-travel) y en la vista previa de la [disposición automática](./table-related-functions.md#auto-layout), también en un editor de solo lectura. La pestaña Visualización, los dos lados del [visor de diferencias](./table-related-functions.md#diff-viewer) y una imagen exportada no dibujan ninguna.  
Siguen cada cambio en cuanto se produce, ya sea de un nombre o de una palabra, un término o un dominio.

## Buscar {#searching}

El campo de búsqueda indica `Search` y aparece en las cuatro hojas, también en un editor de solo lectura. Cada hoja tiene su propia búsqueda.  
Una fila coincide cuando una de las celdas en las que se busca contiene el texto, sin distinguir mayúsculas y minúsculas ni la composición Unicode y sin tener en cuenta los espacios que rodean la búsqueda. Una coincidencia nunca abarca dos celdas. Las celdas en las que se busca:

- `Domains`: `Domain`, `Data Type` y `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` y `Description`.
- `Terms`: `Term`, `Physical Name` y `Description`.
- `Checks`: las tres, tal como se leen en el idioma de la interfaz.

Una búsqueda nueva pone la selección en la primera celda y se desplaza hasta arriba.  
Mientras el campo contiene texto, un botón `x` con la descripción emergente `Clear search` lo vacía y deja el cursor de texto en el campo. `Escape` en el campo también lo vacía.  
En el campo, `Ctrl + Z` (Windows/Linux) o `⌘ + Z` (Mac) deshace lo que escribes, no la hoja, y las teclas de filas de [Añadir y eliminar filas](#adding-and-deleting-rows) son teclas de texto.  
`Add Row` y las inserciones borran primero la búsqueda, ya que una fila vacía no coincide con ninguna búsqueda. Una importación la conserva.

## Seleccionar y moverse {#selecting-and-moving}

La cuadrícula selecciona como lo hace una hoja de cálculo:

- Un clic selecciona una celda y un arrastre selecciona un rango, y la hoja se desplaza al llegar a su borde. `Shift + click` amplía la selección desde la celda activa, y `Ctrl + click` (Windows/Linux) o `⌘ + click` (Mac) añade otro rango.
- Un encabezado de columna selecciona su columna, un número de fila su fila y la esquina superior izquierda todas las celdas, como hace `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac).
- En un Mac, `Ctrl + click` es un clic derecho; consulta [El menú de la cuadrícula](#the-grids-menu).

Con el teclado:

- Las teclas de flecha mueven una celda y, manteniendo pulsada `Ctrl` (Windows/Linux) o `⌘` (Mac), van hasta el borde de la hoja en esa dirección.
- `Home` y `End` van a la primera y la última celda de la fila y, manteniendo pulsada `Ctrl` o `⌘`, a la primera y la última celda de la hoja.
- `Page Up` y `Page Down` mueven una pantalla de filas.
- Mantener pulsada `Shift` con cualquiera de las teclas anteriores amplía la selección en su lugar.
- `Tab` y `Shift + Tab` mueven a la derecha y a la izquierda, y `Shift + Enter` mueve hacia arriba. `Enter` por sí sola edita la celda; consulta [Editar celdas](#editing-cells).

Cuando desaparecen filas bajo la selección, por un deshacer o porque un colaborador las elimina, la selección se recoloca dentro de las filas restantes.

Arrastra el borde derecho de un encabezado de columna para cambiar el tamaño de la columna, o haz doble clic en el borde para ajustar la columna al texto más ancho de las filas visibles. Ninguna tecla cambia el tamaño de una columna.

## Editar celdas {#editing-cells}

Escribir sobre la celda seleccionada reemplaza su valor. `Enter`, `F2` o un doble clic edita el valor tal como está, con el cursor de texto al final.  
Una celda contiene una sola línea, así que un tabulador o un salto de línea pegados en ella se convierten en un espacio.

- `Enter` escribe la edición y baja, y `Tab` la escribe y se mueve a la derecha. Con `Shift`, suben o se mueven a la izquierda.
- Un clic en otro lugar, o que el foco del teclado salga de la cuadrícula, también la escribe.
- `Escape` la cancela.

![Editar la hoja Words: escribir NUM sobre una celda y pulsar Enter, insertar una fila con ⌥ + Enter y rellenarla con Tab, ordenar por Word desde el menú de la cuadrícula, y luego buscar ord y vaciar la búsqueda con Esc](/img/demo-dictionary-editing.webp)

Una edición que deja el valor como estaba no escribe nada, y una edición escrita es un solo paso de deshacer de su hoja, por mucho que se haya escrito.  
`Delete` o `Backspace`, sin ninguna edición abierta, vacía todas las celdas seleccionadas, como un solo paso.  
Mientras hay una edición abierta, las teclas de deshacer y rehacer deshacen y rehacen lo que escribes en la celda, y las teclas de filas escriben como texto; consulta [Teclas en la pestaña](#keys-on-the-tab).  
Todas las celdas de `Checks`, y todas las de un editor de solo lectura, son de solo lectura y no abren ninguna edición.

Cuando se rechaza alguna fila de una edición, un pegado o un borrado, no se guarda nada de ello, y una notificación de error explica el motivo, con el número de filas y el nombre de las tres primeras:

- Un nombre que tiene otra fila de la hoja, o que escribe otra fila del mismo pegado: `Nothing saved: 1 row shares a name with another row (Member)` o `Nothing saved: 2 rows share a name with another row (…)`. Los nombres se comparan sin los espacios de los extremos y distinguiendo mayúsculas y minúsculas, así que `Member` y `member` son distintos. Un nombre vacío nunca se rechaza.
- El `Domain` de un término indicado como un texto que no tiene ningún dominio de la hoja `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Una fila que un colaborador eliminó mientras la editabas: `Nothing saved: the row was removed`.

Una escritura puede llegar más allá de su celda:

- Un término al que se da un `Term` mientras su `Physical Name` está vacío recibe el nombre que componen sus palabras, cuando componen uno; consulta [A partir de las palabras](#from-the-words). Esto ocurre una sola vez: el nombre no se vuelve a componer cuando las palabras cambian después.
- Un nuevo `Data Type` de un dominio cambia el tipo de todas las columnas vinculadas al dominio, en el mismo paso de deshacer; consulta [Dominios y tipos de datos](#domains-and-data-types).

### El dominio de un término {#a-terms-domain}

`Enter`, `F2` o un doble clic en la celda `Domain` de un término abre una lista bajo la celda, o encima de ella donde hay más espacio, con un campo de búsqueda que indica `Domain`.  
La lista contiene `None` y luego todos los dominios con nombre en el orden de la hoja `Domains`, y el resaltado empieza en el dominio que vincula el término, o en `None`. Escribir un carácter en la celda abre la lista ya filtrada por ese carácter.

- Al escribir, la lista se reduce a los dominios cuyo nombre contiene el texto, sin distinguir mayúsculas y minúsculas, se quita `None` y se resalta la primera coincidencia.
- `↑` y `↓` mueven el resaltado y dan la vuelta en ambos extremos.
- `Enter` o `Tab` elige la fila resaltada, y un clic, la fila en la que se hace clic, como un solo paso de deshacer. El término se vincula exactamente al dominio elegido, incluso a uno de dos dominios con un mismo nombre, y `None` lo desvincula.
- `Escape` o un clic fuera cierra la lista sin escribir nada de lo tecleado.

Si no hay ningún dominio con nombre en la hoja `Domains`, el campo se abre sin lista.  
El texto pegado vincula el primer dominio que figura con ese nombre, un texto vacío desvincula y un texto igual a lo que muestra la celda deja el vínculo como está. Cualquier otro nombre se rechaza; consulta [Editar celdas](#editing-cells). `Delete` o `Backspace` en la celda desvincula el término, incluso de un dominio eliminado.

## Copiar y pegar {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) o `⌘ + C` (Mac) copia la selección como texto separado por tabuladores, una línea por fila, como lo escriben las hojas de cálculo, así que se pega en una hoja de cálculo como celdas. Un tabulador o un salto de línea dentro de un valor se convierte en un espacio.  
Varios rangos solo se copian juntos cuando abarcan las mismas filas, uno al lado del otro, o las mismas columnas, uno encima del otro. Si no, no se copia nada y aparece la notificación de error `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) o `⌘ + V` (Mac) pega texto separado por tabuladores, como celdas copiadas de una hoja de cálculo, desde la celda activa hacia abajo y hacia la derecha:

- Las comillas se pegan como texto, así que una celda de hoja de cálculo que contiene un salto de línea no se pega como una sola celda.
- Un único valor rellena todos los rangos seleccionados.
- Las filas que pasan de la última fila se añaden como filas nuevas, en orden, así que al pegar en una hoja vacía esta se rellena.
- Las columnas que pasan de la última columna se omiten y, una vez guardado el resto, la notificación `Columns past the last one weren't pasted` lo indica.
- Un pegado de varias celdas selecciona después el bloque que escribió.

Un pegado es un solo paso de deshacer, incluidas las filas que añade, y se rechaza por completo ante un nombre duplicado o un dominio desconocido; consulta [Editar celdas](#editing-cells).  
Una copia, un pegado o un borrado de más de un millón de celdas no hace nada, y aparece la notificación de error `Nothing done: the selection covers too many cells`.  
Cortar, con `Ctrl + X` (Windows/Linux) o `⌘ + X` (Mac), no hace nada en una hoja. Copiar y pegar en esta pestaña nunca llegan al diagrama y, mientras hay una edición de celda abierta, actúan sobre el texto de la celda.

## Añadir y eliminar filas {#adding-and-deleting-rows}

`Add Row` añade una fila vacía al final de la hoja. Borra la búsqueda, selecciona la primera celda de la nueva fila y da el foco del teclado a la cuadrícula, así que lo que escribes rellena esa celda.  
`Delete Rows` elimina todas las filas que abarca la selección, en cualquier columna, y un deshacer las devuelve todas a su sitio. Su descripción emergente indica la tecla que hace lo mismo.

Con el foco del teclado en la cuadrícula y sin ninguna celda en edición:

- `Alt + Enter` (Windows/Linux) o `⌥ + Enter` (Mac) inserta bajo la selección tantas filas vacías como filas abarca.
- `Alt + Shift + Enter` (Windows/Linux) o `⌥ + Shift + Enter` (Mac) las inserta encima.
- `Alt + Backspace` o `Alt + Delete` (Windows/Linux), o `⌥ + Backspace` o `⌥ + Delete` (Mac), elimina las filas que abarca la selección.

Hacen lo mismo que las opciones de insertar y eliminar filas del menú de la cuadrícula; consulta [El menú de la cuadrícula](#the-grids-menu). Una inserción borra la búsqueda y coloca las filas nuevas justo encima de la primera fila que abarca la selección, o justo debajo de la última. Las selecciona en la primera columna, con la primera de ellas activa, y es un solo paso de deshacer.

Estas teclas son las asignaciones `Add Column` y `Remove Column` de la pestaña [Atajos de teclado](./settings.md#shortcuts), así que, si un host las reasigna con [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), estas teclas cambian también. `Alt + Shift + Enter` es la tecla de `Add Column` con `Shift` añadida y no tiene fila propia allí.  
En una edición abierta y en el campo de búsqueda son teclas de texto, así que en un Mac `⌥ + Backspace` borra una palabra. En `Checks` y en un editor de solo lectura no hacen nada. En esta pestaña nunca añaden ni eliminan una columna de una tabla.  
En Obsidian llegan a la pestaña incluso donde un atajo de teclado de Obsidian usa la misma tecla.

Una fila que nunca se rellenó, o a la que se le quitaron todos los valores, se muestra en su hoja y llega a los colaboradores, pero el archivo la omite, así que desaparece cuando se vuelve a abrir el diagrama.

## El menú de la cuadrícula {#the-grids-menu}

Haz clic con el botón derecho en una celda de `Domains`, `Words` o `Terms` para abrir el menú de la cuadrícula. Una celda que está fuera de la selección pasa antes a ser la selección.  
Un clic derecho bajo la última fila o a la derecha de la última columna lo abre sobre la selección tal como está, así que en una hoja vacía se abre en cualquier lugar bajo los encabezados. La tecla de menú o `Shift + F10` lo abre para la celda activa.

- `Insert 1 row above`, `Insert 1 row below` y `Delete 1 row`, cada una con el número de filas que abarca la selección, como en `Insert 3 rows above`, y con su tecla a la derecha; consulta [Añadir y eliminar filas](#adding-and-deleting-rows).
- `Sort by <column>, ascending` y `Sort by <column>, descending`, con el nombre de la columna en la que hiciste clic con el botón derecho, como en `Sort by Word, ascending`; consulta [Ordenar](#sorting). No aparecen a la derecha de la última columna.
- `Import CSV` y `Export CSV`, que hacen lo mismo que los botones de la barra; consulta [Importar y exportar CSV](#importing-and-exporting-csv).

Cuando no se muestra ninguna fila, en una hoja vacía o con una búsqueda que no coincide con nada, solo aparecen `Insert 1 row below`, `Import CSV` y `Export CSV`.  
`Checks` y un editor de solo lectura abren en su lugar el menú propio del navegador, y lo mismo ocurre con un clic derecho en un encabezado o en una barra de desplazamiento.  
El menú se cierra al elegir una opción, con `Escape`, con una pulsación en otro lugar de la pestaña, cuando cambia la selección o la hoja, y cuando cambian las filas de la hoja, por una edición tuya o de un colaborador.

## Ordenar {#sorting}

`Sort by <column>, ascending` y `Sort by <column>, descending` reordenan las propias filas de la hoja, no solo la vista. El nuevo orden se guarda en el archivo, lo ven los colaboradores y lo sigue `Export CSV`, y un deshacer recupera el orden anterior.  
Las filas se comparan por el texto que muestra la celda, el `Domain` de un término por el nombre del dominio, en el orden alfabético del idioma de la interfaz, y los números se comparan por su valor, así que `2` va antes que `10`. Las celdas vacías van al final en ambos casos, y las filas que resultan iguales conservan su orden. Ordenar una hoja que ya está en ese orden no registra nada.  
La búsqueda se queda como estaba, y también la selección, cuyas celdas contienen ahora otras filas.

## Importar y exportar CSV {#importing-and-exporting-csv}

Cada una de las hojas `Domains`, `Words` y `Terms` se importa desde un archivo CSV y se exporta a uno. Estos archivos son propios de la pestaña Diccionario: `Import` y `Export` del menú contextual del lienzo no los leen ni los escriben; consulta [Importar o exportar archivos](./file-import-export.md).

### Importar {#importing}

`Import CSV`, en la barra o en el menú de la cuadrícula, abre el selector de archivos propio del navegador para archivos `.csv`, no el cuadro de diálogo de importación del host. Si eliges de nuevo el mismo archivo, se vuelve a importar.  
El archivo va al diccionario que indica su encabezado, sea cual sea la hoja que se muestra, y la pestaña muestra después esa hoja y da el foco del teclado a su cuadrícula. La hoja conserva su búsqueda, su selección y su desplazamiento, así que las filas que oculta la búsqueda, o las filas añadidas por debajo de la vista, siguen sin verse.  
El archivo se lee como UTF-8, con o sin marca de orden de bytes, o como EUC-KR cuando no es UTF-8 válido, como ocurre con los archivos más antiguos del estándar de datos públicos.

![Abrir la pestaña Dictionary desde la barra de herramientas y luego importar dominios, palabras y términos con Import CSV, de modo que cada archivo cambia la pestaña a su propia hoja e informa de lo que ha añadido](/img/demo-dictionary-import.webp)

Cómo se incorporan las filas:

- Cada fila con nombre actualiza la fila de la hoja con ese nombre, en los campos para los que el archivo tiene columnas. Las columnas que le faltan al archivo dejan esos campos como están. Los nombres se comparan sin los espacios de los extremos y distinguiendo mayúsculas y minúsculas.
- Los nombres que no tiene la hoja se añaden después de su última fila, en el orden del archivo.
- Una importación nunca elimina una fila.
- Una fila con el nombre vacío se omite. Cuando el archivo contiene un nombre dos veces, prevalece la fila posterior y la anterior cuenta como omitida. Las líneas en blanco no son filas.
- El dominio de un término se busca por su nombre, el primer dominio con ese nombre, y un nombre que no tiene ningún dominio deja el término sin vincular, así que importa primero los dominios.

Una importación es un solo paso de deshacer de esa hoja.  
Después, la notificación indica, por ejemplo, `1 added · 1 updated · 2 skipped`. Una fila igual a la de la hoja no cuenta como añadida ni como actualizada, así que importar de nuevo el mismo archivo no cambia nada y no registra ningún paso.  
Cuando los términos del archivo indican dominios que el diagrama no tiene, una segunda línea nombra los tres primeros, como en `4 unknown domains: 연월일, 금액, 번호`.  
Un archivo cuyo encabezado no coincide con ninguna estructura, o coincide con dos, no importa nada, y aparece la notificación de error `Couldn't read this file as words, terms or domains`.

### Estructuras de archivo {#file-layouts}

Cada diccionario lee dos estructuras. La primera es la propia del editor, la que escribe `Export CSV`, con los nombres de los campos como encabezado:

| Diccionario | Encabezado | Un archivo necesita |
| --- | --- | --- |
| Palabras | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Términos | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Dominios | `name,category,dataType,description` | `name`, `dataType` |

Las columnas pueden ir en cualquier orden, el `domain` de un término contiene el nombre del dominio y cualquier otra columna se ignora. En el encabezado se distinguen mayúsculas y minúsculas, y las celdas se leen exactamente como están escritas, espacios incluidos.

La segunda es la estructura de los archivos del estándar de datos públicos de Corea (공통표준):

| Diccionario | Un archivo necesita | También se lee |
| --- | --- | --- |
| Palabras | `공통표준단어명` | `공통표준단어영문약어명` (abreviatura), `공통표준단어 영문명` (nombre en inglés), `공통표준단어 설명` (descripción), `이음동의어 목록` (sinónimos), `금칙어 목록` (palabras prohibidas) |
| Términos | `공통표준용어명` | `공통표준용어영문약어명` (nombre físico), `공통표준도메인명` (dominio, por nombre), `공통표준용어설명` (descripción), `용어 이음동의어 목록` (sinónimos) |
| Dominios | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categoría), `공통표준도메인설명` (descripción), `데이터길이`, `데이터소수점길이` |

Los campos `데이터타입`, `데이터길이` y `데이터소수점길이` de un dominio se unen en un solo tipo de datos: `NUMERIC(15,2)`, `CHAR(8)`, solo el tipo cuando no hay longitud, como `DATE`, y se omite una escala de 0, como en `NUMERIC(15)`.  
En estos archivos, a las celdas se les quitan los espacios de los extremos, y las demás columnas, como el historial de revisiones, se ignoran.  
En ambas estructuras, los espacios en un nombre del encabezado no importan.

### Exportar {#exporting}

`Export CSV`, en la barra o en el menú de la cuadrícula, guarda la hoja que se muestra en la estructura propia del editor: todas las filas en el orden de la hoja, muestre lo que muestre la búsqueda, con el dominio de un término escrito por su nombre, o vacío si el dominio se ha eliminado.  
El archivo está en UTF-8 con marca de orden de bytes y finales de línea CRLF, y solo se entrecomilla un campo que contiene una comilla, una coma o un salto de línea. Se abre en una hoja de cálculo y se vuelve a importar con las mismas filas.  
Se llama `<database name>-<timestamp>-words.csv`, `-terms.csv` o `-domains.csv`, y se guarda igual que las demás exportaciones del editor; consulta [Exportar](./file-import-export.md#exporting).

`Checks` no tiene exportación, y un editor de solo lectura no ofrece importación ni exportación.

## Deshacer y rehacer {#undo-and-redo}

`Domains`, `Words` y `Terms` tienen cada una su propio historial de deshacer, aparte del historial del diagrama. En esta pestaña, `Ctrl + Z` y `Ctrl + Shift + Z` (Windows/Linux) o `⌘ + Z` y `⌘ + Shift + Z` (Mac), así como `Undo` y `Redo` de la barra de herramientas, actúan sobre la hoja que se muestra, y la barra de herramientas no muestra `Time Travel`. En `Checks` no hacen nada.  
Deshacer en la pestaña ERD nunca revierte una edición de una hoja; consulta [Hojas del diccionario](./undo-redo.md#dictionary-sheets).

## Teclas en la pestaña {#keys-on-the-tab}

Mientras el foco del teclado está en la pestaña, actúan estos atajos de teclado del editor; consulta [Atajos de teclado](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac), abre la [búsqueda rápida](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) o `⌘ + F` (Mac), cambia a la pestaña ERD y abre el [explorador](./explorer.md#opening-and-closing) en su búsqueda.
- `Undo` y `Redo` actúan sobre la hoja que se muestra; consulta [Deshacer y rehacer](#undo-and-redo).
- `Add Column` y `Remove Column` insertan y eliminan filas; consulta [Añadir y eliminar filas](#adding-and-deleting-rows).

Mientras hay una edición de celda abierta, incluida la lista de dominios de un término, `Search` y `Toggle Explorer` no hacen nada, para que no se pierda el texto escrito.

Todos los demás atajos del editor se quedan en la pestaña y nunca llegan al lienzo: `Alt + N` (Windows/Linux) o `⌥ + N` (Mac) no añade ninguna tabla, y `Delete` y `Backspace` no eliminan nada en el lienzo.  
En su lugar, las teclas propias de la cuadrícula actúan sobre la hoja: `Enter` edita la celda, `Delete` y `Backspace` vacían las celdas seleccionadas, `Ctrl + A` (Windows/Linux) o `⌘ + A` (Mac) selecciona todas las celdas, y `Escape` cancela una edición, cierra el menú de la cuadrícula o vacía el campo de búsqueda. Copiar, cortar y pegar también se quedan en la pestaña; consulta [Copiar y pegar](#copying-and-pasting).

## Editores de solo lectura {#read-only-editors}

En un editor [`readonly`](../../api/erd-editor-element.md#readonly), la pestaña se abre y muestra todas las hojas.  
Cambiar de hoja, buscar, seleccionar, desplazarse, cambiar el tamaño de las columnas y copiar funcionan como siempre, igual que ir a una comprobación desde `Checks` con `Enter` o un doble clic. Las marcas de las comprobaciones también se muestran.

Ninguna celda admite una edición, un pegado ni un borrado, y toda celda que no marca ninguna comprobación se dibuja sobre el fondo de solo lectura.  
`Add Row`, `Delete Rows`, `Import CSV` y `Export CSV` están ocultos, las teclas de filas no hacen nada y un clic derecho abre el menú del navegador. Una hoja vacía no muestra ninguna indicación, y la barra de herramientas no muestra `Undo` ni `Redo`.

## Los colaboradores y el archivo {#collaborators-and-the-file}

El archivo del diagrama contiene las palabras, los términos y los dominios en el orden de sus hojas, incluido el que deja una ordenación, y omite una fila que no contiene ningún valor.  
También contiene el nombre lógico de cada tabla y columna, si cada nombre físico es de los diccionarios y el vínculo de cada columna con su dominio mientras el dominio sigue en la lista. Las comprobaciones y las marcas se calculan a partir de esto y nunca se guardan.

En una [sesión colaborativa](../../api/advanced/collaborative-editing.md), los editores ven las ediciones del diccionario de los demás en cuanto se producen, incluidas las ordenaciones y las inserciones. Cada uno conserva su propia hoja, búsqueda y selección, y sus historiales de hoja solo contienen sus propias ediciones.  
Una edición o un pegado sobre una fila que un colaborador ha eliminado entretanto no guarda nada, y aparece la notificación `Nothing saved: the row was removed`.  
Un editor de una versión anterior a la pestaña Diccionario guarda el diagrama sin sus nombres lógicos, vínculos con dominios ni diccionarios; consulta [Mezclar versiones](../../api/advanced/collaborative-editing.md#mixing-releases).

Un `Import` de Esquema SQL, GraphQL, DBML o AML conserva los diccionarios, un `Import` de JSON los reemplaza por los del archivo e `Import and Add` no trae ninguno; consulta [Importar archivos externos](./file-import-export.md#importing-external-files).  
Un agente de programación edita las palabras, los términos y los dominios, establece nombres lógicos y dominios, vuelve a derivar nombres físicos y enumera las comprobaciones mediante el servidor MCP; consulta [Diccionarios](../../mcp/tools.md#dictionaries) y [Comprobaciones del diccionario](../../mcp/tools.md#dictionary-checks). No tiene ninguna herramienta para archivos CSV.
