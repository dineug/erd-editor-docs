---
sidebar_position: 1
description: Retransmite los cambios del editor entre instancias con getSharedStore, inicializa un editor que se une a partir de runtimeValue y de los registros del almacén, resuelve las ediciones hechas en el mismo momento y muestra el cursor, el foco, la selección y el cuadro de arrastre de cada colaborador.
---

# Edición colaborativa

`getSharedStore()` convierte un editor en un nodo de una sesión colaborativa.  
Emite cada cambio como un flujo de acciones y aplica las acciones que le devuelven los demás editores; el transporte entre ellos lo proporcionas tú (WebSocket, WebRTC o cualquier otra cosa que pueda transportar JSON).  
Es uno de los métodos de [ErdEditorElement](../erd-editor-element.md) y se combina con el [almacenamiento remoto](./remote-storage.md) cuando los cambios retransmitidos también deben almacenarse.  
Desde la `5.1.0`, para compartir un diagrama mediante un documento de Yjs y cualquiera de sus proveedores en lugar de montar tú el transporte, vincula el editor con `@dineug/erd-editor-yjs`; consulta [Yjs](./yjs.md).

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` no exporta ninguno de estos tipos por su nombre. El código TypeScript llega a ellos a través de `ErdEditorElement`, como en `ReturnType<ErdEditorElement['getSharedStore']>`.

Una acción es un objeto serializable simple que describe un cambio en el documento, así que sobrevive a `JSON.stringify` en su camino hacia el transporte.  
Llegan en lotes: `subscribe` te entrega un array y ese array es una unidad; retransmítelo entero y despáchalo entero en el otro lado.  
Trata cada acción como opaca y pásala tal cual en lugar de leerla o reescribirla, ya que la información interna que lleva, como su [versión](#concurrent-edits), es lo que mantiene sincronizados los editores.

Parte de lo que hace un editor se queda en ese editor.  
Traer al frente una tabla, una nota o un grupo de tablas, como ocurre al seleccionar uno de ellos, no se envía.  
Tampoco se envían las opciones `Statements`, `Header`, `Write logical names into empty comments` (desde la `4.2.0`) y `Tables` de la pestaña [Esquema SQL](../../guide/guides/schema-sql.md), que pertenecen a la ventana en la que se eligen.  
Desde la `4.1.0`, el [explorador](../../guide/guides/explorer.md) también se queda en su editor: no se envían si está abierto o no, su anchura, sus filas contraídas, la fila en la que está el foco del teclado, la posición de desplazamiento de su árbol, su búsqueda ni sus opciones.  
Tampoco se envía la [iluminación](../../guide/guides/relationship-editing.md#reading-a-connector) que, al ir a una clave externa, recibe el conector de su relación.  
Desde la `4.2.0`, la pestaña [Diccionario](../../guide/guides/dictionary.md) también se queda en su editor: no se envían qué hoja se muestra ni la búsqueda, la selección, el desplazamiento ni los anchos de columna de cada hoja. Sus ediciones, ordenaciones e importaciones CSV, sí.  
Un desplazamiento, un zoom o un cambio de pestaña sí se envía, pero nunca mueve la vista ni la pestaña de otro usuario. Eso incluye el desplazamiento que provoca un salto desde el explorador, el cambio a la pestaña ERD cuando el explorador se abre desde otra pestaña, y el cambio de pestaña y el desplazamiento que provoca un salto desde la hoja [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) de la pestaña Diccionario a una tabla o columna. Un salto desde esa hoja a una palabra, un término o un dominio se queda en la pestaña Diccionario, así que no se envía nada de él.

Desde la `4.2.0`, también se envía un cambio de la [vista de nombres](../../guide/guides/logical-names.md#switching-the-view), y su [bloqueo](../../guide/guides/settings.md#lock) decide qué hacen con él los demás editores. El bloqueo `Name View` está activado en un diagrama nuevo y en cualquier documento anterior a la `4.2.0`.  
Mientras el bloqueo está activado, el cambio solo se ve en el editor que lo hizo: se sigue enviando, pero todos los demás editores y todas las réplicas lo descartan, así que cada usuario puede ver una vista distinta mientras `value` conserva la bloqueada.  
Mientras el bloqueo está desactivado, un cambio hecho en un editor que puede editar cambia la vista de nombres en todos los editores y réplicas —prevalece el último cambio— y todos ellos la guardan.  
El cambio propio de un editor de solo lectura siempre se queda en ese editor, y aun así ese editor sigue los cambios compartidos de los demás.

Desde la `5.1.0`, un cambio del lenguaje del [Generador de código](../../guide/guides/code-generator.md), del estilo de nombres de tabla, del estilo de nombres de columna o del tipo de delimitador sigue de la misma forma su propio bloqueo (`Language`, `Table Name Case`, `Column Name Case` o `Bracket Type`), con una diferencia: mientras el bloqueo está activado, el cambio no se envía en absoluto.  
Solo se ve en el editor que lo hizo, cuyas pestañas Generador de código y Esquema SQL lo siguen, y ningún otro editor ni réplica lo ve. `value` y `runtimeValue` conservan el valor bloqueado, así que un editor que se une inicializado desde cualquier editor tampoco lo ve, y cada usuario puede ver un lenguaje, un estilo de nombres o un tipo de delimitador distintos mientras el bloqueo está activado.  
Mientras el bloqueo está desactivado, un cambio hecho en un editor que puede editar se envía marcado como compartido (`shared: true` en su carga útil). Cambia el ajuste en todos los editores y réplicas —prevalece el último cambio— y todos ellos lo guardan. Un editor o una réplica `5.1.0` aplica un cambio marcado diga lo que diga su propio bloqueo, así que un cambio hecho justo después de un desbloqueo se aplica en todas partes, incluso donde llega antes que el desbloqueo.  
Antes de la `5.1.0`, un cambio así llegaba a todos los editores y réplicas estuviera o no activado su bloqueo, mientras que el archivo conservaba el valor bloqueado.

Desde la `5.0.0`, un editor de [solo lectura](../erd-editor-element.md#readonly) no envía ningún cambio. El desplazamiento, el zoom, la pestaña, la vista de nombres, la base de datos, el lenguaje del Generador de código, los estilos de nombres, el tipo de delimitador y las filas de `View Option` que cambia su lector se quedan en su pantalla, digan lo que digan sus bloqueos; antes de la `5.0.0`, sus desplazamientos, zooms, cambios de pestaña, base de datos y ajustes de código se enviaban como los de un editor editable.  
Su almacén sigue enviando lo que envían sus rastreadores del cursor, el foco, la selección y el cuadro de arrastre del lector, responde a los registros que pide un editor que se une y aplica todos los cambios que envían los demás. Un cambio de la base de datos, de un ajuste del Generador de código o de una fila de `View Option` llega a su documento, y también a su pantalla salvo que su lector haya cambiado ese ajuste allí, y un cambio compartido de la vista de nombres se ve en su pantalla en cualquier caso. Desde la `5.1.0`, recibe un ajuste del Generador de código solo cuando ese ajuste se cambió con su bloqueo desactivado o lo trae un desbloqueo.  
Cuando el editor pasa a solo lectura, primero envía lo que el almacén aún retiene de un arrastre o de un desplazamiento, como hace [flushStreamBuffers](#flushstreambuffers), para que los demás conserven lo último de él.

Los [bloqueos](../../guide/guides/settings.md#lock) se comparten: el último bloqueo o desbloqueo de un ajuste prevalece en todos los editores, y un bloqueo lleva los valores del editor que lo activó, así que todos los editores y réplicas guardan el mismo valor.  
Por tanto, un bloqueo de `Viewport` guarda la vista del editor que lo activó, y un bloqueo de `Canvas Type`, la última pestaña en la que estuvo ese editor antes de la pestaña Configuración, donde se activan los bloqueos.  
Desactivar el bloqueo de `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` o, desde la `4.2.0`, `Name View` también fija ese ajuste en todos los editores al valor que muestra el editor que lo desactivó, incluido su propio cambio hecho bajo el bloqueo, para que sigan guardando un único valor. Desactivar el bloqueo de `Viewport` o `Canvas Type` no mueve la vista ni la pestaña de nadie.

Una edición del script `Before tables` o `After tables` se envía entera cuando su campo pierde el foco. Los dos scripts se resuelven por separado, así que la edición de uno por parte de un colaborador nunca sobrescribe el otro.

Nada de lo que se hace en el [modo Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) de la pestaña Visualización es un cambio del documento, así que un editor en Flow no envía cambios a los demás, y los cambios que ellos envían se siguen aplicando mientras está allí.  
Hay dos excepciones. Salir de Flow hacia otra pestaña es un cambio de pestaña, que se envía como cualquier otro. Desde la `4.2.0`, elegir una opción en la lista de la vista de nombres de la barra de herramientas de Flow es un cambio de la vista de nombres, que se envía y se aplica como uno hecho en el lienzo.  
`Previous table`, `Next table` y las teclas de deshacer y rehacer, que [retroceden y avanzan por las vistas](../../guide/guides/visualization.md#previous-table-and-next-table) en Flow, no se envían.  
El botón de enlace externo de la tarjeta, un resultado de la [búsqueda rápida](../../guide/guides/quick-search.md#searching-the-diagram) elegido tras `#`, `@` o `:` y la apertura del [explorador](../../guide/guides/explorer.md#opening-and-closing) provocan todos la salida de Flow hacia la pestaña ERD. También se envía el desplazamiento que el botón de la tarjeta o un resultado de la búsqueda rápida produce allí.

## Dos editores en una página {#two-editors-on-one-page}

La conexión de subscribe a dispatch de este ejemplo sustituye a la red, para que veas la forma de una sesión sin un transporte de por medio.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Aquí ambos editores parten del mismo documento nuevo y vacío, así que ninguno tiene que inicializarse.  
Con tres o más editores, envía los lotes de cada uno a todos los demás: un editor nunca reenvía lo que ha recibido.

## Inicializar un colaborador {#seeding-a-collaborator}

Un almacén compartido retransmite los cambios a medida que se hacen y nunca entrega a quien se une el documento tal como está, así que a un editor que se une a una sesión ya en curso hay que darle primero el documento.  
Desde la `4.0.0`, inicialízalo con [`runtimeValue`](../erd-editor-element.md#runtimevalue) de un editor que ya esté en la sesión, no con `value` ni con el archivo guardado.  
Una sala vinculada con [`@dineug/erd-editor-yjs`](./yjs.md) contiene ella misma el documento una vez que un cliente la ha [inicializado](./yjs.md#seeding-a-room), así que todos los editores vinculados a ella abren ese documento sin que se les entregue ningún `runtimeValue`.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

El valor en tiempo de ejecución aún contiene lo que se ha eliminado desde que se abrió el documento, así que, cuando otro editor deshace más tarde una eliminación, el editor que se ha unido recupera la tabla con su nombre y sus columnas.  
[`value`](../erd-editor-element.md#value) es la forma que contiene un archivo, sin las entidades eliminadas, así que un editor inicializado a partir de él, o del archivo, recuperaría en su lugar una tabla vacía y sin nombre.  
Desde la `4.2.0`, lo mismo ocurre con una palabra, un término o un dominio eliminado de una hoja de la pestaña [Diccionario](../../guide/guides/dictionary.md): cuando otro editor deshace la eliminación, un editor que se une inicializado a partir de `runtimeValue` vuelve a listar la fila completa, y uno inicializado a partir de `value` lista una fila vacía, que luego su propio `value` deja fuera.  
Sigue escribiendo `value` en el almacenamiento: `runtimeValue` sirve solo para inicializar otro editor, una segunda vista o un [replicationStore](./remote-storage.md).  
Los editores de VS Code, Obsidian, un IDE de JetBrains y la aplicación web inicializan así una segunda vista de un documento abierto.

`setInitialValue` no se retransmite, así que inicializar el editor que se une no cambia nada en los demás.  
Desde la `4.0.0`, también descarta los registros de colaboración del editor, que resuelven las [ediciones simultáneas](#concurrent-edits). Si el almacén compartido del editor ya ha tenido un suscriptor, el almacén vuelve a pedir los suyos a los demás editores, como en su primer [subscribe](#subscribe), para que un editor cargado de nuevo en mitad de una sesión resuelva las ediciones igual que los demás.  
Asignar `value` conserva los registros, pero, a diferencia de `setInitialValue`, se retransmite: en cuanto el editor tiene un almacén compartido, todos los editores de la sesión cargan el documento asignado, así que nunca inicialices de esa forma un editor que se une.

Ni `value` ni `runtimeValue` contienen los registros ni la versión a la que ha llegado el reloj del editor, así que un editor que se une inicializado solo con `runtimeValue` los toma de la respuesta que los editores de la sesión envían a su primer subscribe.  
Hasta que llega esa respuesta, una edición del editor que se une puede llevar una versión inferior a la que tienen los demás, así que estos la rechazan mientras se queda en el editor que se une, y una escritura más antigua que sigue en camino se impone a la más reciente que contiene la inicialización. Donde ningún editor en marcha responde, como cuando un servidor o un almacén de documentos conserva el documento de la sesión, el editor que se une nunca los recibe.  
Desde la `5.1.0`, entrégalos junto con el valor. En un editor de la sesión, llama a [`flushStreamBuffers()`](#flushstreambuffers), para que salga primero un arrastre o un cambio de color que aún retiene; después lee en el mismo momento `runtimeValue` y los [`getLWW()`](#getlww) y [`getVersion()`](#getversion) de su almacén. El editor que se une carga el valor con `setInitialValue` y luego toma el resto con el [`mergeLWW`](#mergelww) de su propio almacén, en ese orden, porque cada `setInitialValue` descarta los registros. Así, su siguiente edición lleva una versión posterior a todas las que contiene la inicialización, y se aplica sin esperar ninguna respuesta. En un almacén que ya existe, [`reseed`](#reseed) hace ambas cosas en una sola llamada.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Una inicialización guardada así para abrir editores que se unan más tarde contiene los tres juntos. No es un archivo: `value` sigue siendo lo que se debe escribir en el almacenamiento.  
Un [replicationStore](./remote-storage.md#runtimevalue-getter) no entrega ningún registro, así que un editor que se une inicializado a partir de su `runtimeValue` sigue tomándolos de la respuesta de los editores.

## Ediciones simultáneas {#concurrent-edits}

Cada editor y cada réplica guarda, para cada nombre y para casi cualquier otro campo, la versión de la escritura que lo fijó: son sus registros de colaboración. Una escritura se aplica solo si su versión no es inferior a la que se tiene, así que los editores que oyen los mismos cambios en distinto orden terminan con el mismo documento.  
Desde la `5.1.0`, cada versión lleva, bajo su contador, una posición propia del editor que escribe, tomada de su id. Por eso las versiones crecen en pasos de 4 194 304 y superan un entero de 32 bits cuando el contador llega a 512. `JSON.stringify` y `JSON.parse` las transportan intactas, pero un retransmisor o un almacén que las analice en otro lenguaje debe conservarlas como números de 64 bits, nunca como enteros de 32 bits.

Desde la `5.1.0`, dos editores que cambian un mismo nombre o campo en el mismo momento, salvo las excepciones que siguen, terminan con el mismo valor en todos los editores y réplicas: al escribir con un mismo contador, asignan dos versiones distintas y la mayor prevalece en todas partes. Antes de la `5.1.0`, ambos podían asignar una misma versión y cada editor se quedaba con la que oyó en último lugar, así que podían terminar distintos. Dos editores comparten posición con una probabilidad de 1 entre 4 194 304 por cada par, y entonces empatan como antes.

Desde la `5.1.0`, la posición de una tabla, la posición y el tamaño de una nota o de un grupo de tablas, y el origen y el nivel de zoom de la vista se versionan de la misma forma, y lo que los mueve sale como el punto en el que terminan:

- un arrastre, como un `table.moveTo`, `memo.moveTo` o `tableGroup.moveTo` por cada entidad movida, en un mismo lote, de modo que el arrastre de un grupo lleva los puntos de sus tablas junto con el del grupo;
- el deshacer o rehacer de un arrastre, como el punto en el que deja cada entidad;
- un desplazamiento, como `settings.scrollTo`, y un zoom, como `settings.changeZoomLevel`;
- el cambio de tamaño de una nota o de un grupo de tablas, como su posición y su tamaño a la vez.

Así, dos usuarios que mueven, o mueven y cambian de tamaño, una misma tabla, nota o grupo de tablas en el mismo momento terminan con ella en un mismo punto y con un mismo tamaño en todos los editores y réplicas. El punto se lo queda la escritura de mayor versión, con ambos ejes a la vez. Un movimiento no escribe ningún tamaño, así que un cambio de tamaño conserva el suyo incluso donde un movimiento hecho a la vez se queda con el punto.  
Antes de la `5.1.0`, un arrastre salía como la distancia recorrida, así que dos arrastres de una misma tabla se sumaban, y un movimiento y un cambio de tamaño de una misma nota o grupo de tablas hechos a la vez podían terminar distintos.  
Un arrastre de menos de 20 px, que no deja ninguna entrada de deshacer, se envía como cualquier otro, así que, como punto, puede prevalecer sobre un arrastre de la misma entidad que otro usuario haya hecho en el mismo momento. Un lote de arrastre, desplazamiento o zoom que un transporte entrega dos veces no mueve nada dos veces.

Un cambio de color es una excepción. Sale sin versión, y cada editor y cada réplica le asigna la suya y se queda con el color que oyó en último lugar, así que dos usuarios que cambian el color de una misma tabla, nota o grupo de tablas en el mismo momento pueden terminar con colores distintos.  
Unos pocos cambios no llevan versión alguna, así que cada editor y cada réplica los aplica en el orden en que los oye, y dos hechos en el mismo momento también pueden terminar distintos: una columna movida dentro de su tabla o índice (`column.move`, `indexColumn.move`), y un cambio de la [base de datos](../../guide/guides/table-related-functions.md#databases), de una fila de [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) o de `Relationship DataType Sync`, `Maximum comment width` o `Column Order` de la pestaña [Configuración](../../guide/guides/settings.md).  
Las entidades que dos usuarios añaden en el mismo momento, como dos tablas o dos columnas de una misma tabla, también pueden quedar en distinto orden en cada editor y réplica, y el `value` de cada uno guarda su propio orden.

Todo esto vale entre editores y réplicas de la `5.1.0` o posterior; [Mezclar versiones](#mixing-releases) explica qué cambia con una más antigua.

## Mezclar versiones {#mixing-releases}

Un editor solo aplica los tipos de acción que conoce su propia versión, así que, en una sesión que mezcla versiones, los editores más antiguos se pierden todo lo que viaja en un tipo más reciente.

Desde la `3.10.0`, un cambio en el [ON DELETE u ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de una relación viaja como uno de dos nuevos tipos de acción, `relationship.changeOnDelete` y `relationship.changeOnUpdate`, y `relationship.add` puede llevar ambos. Un retransmisor que pasa las acciones tal cual no necesita nada nuevo para ellos.  
Un editor anterior a la `3.10.0` ignora esos tipos de acción y campos: nunca conoce el ON DELETE ni el ON UPDATE de una relación, y un documento guardado desde él no tiene ninguno de los dos. Una relación que añade un editor más antiguo llega sin ellos, así que ambos empiezan en `Not set`.

Todos los demás cambios que envía un editor `3.10.0` viajan en tipos de acción que los editores más antiguos ya conocen.  
El botón `Replace All` de [Buscar y reemplazar](../../guide/guides/find-and-replace.md#replacing) envía sus ediciones como un único lote de las mismas acciones de cambio de nombre, comentario y nota que envía una edición a mano. Las [opciones de vista](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` y `Referential Actions` viajan en la acción existente `settings.changeShow`.

Desde la `4.0.0`, estos cambios viajan en nuevos tipos de acción, y un retransmisor que pasa las acciones tal cual no necesita nada nuevo para ellos:

- un [grupo de tablas](../../guide/guides/table-groups.md) que se añade, se mueve, cambia de tamaño, de nombre o de color, o se elimina: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` y `tableGroup.remove`; una tabla que entra en un grupo o sale de él: `table.changeGroup`;
- una pulsación de `Save` en [Asignar columnas](../../guide/guides/relationship-editing.md#map-columns) sobre una relación existente, que fija a la vez sus dos listas de columnas: `relationship.changeColumns`;
- un [bloqueo](../../guide/guides/settings.md#lock) que se activa o se desactiva: `settings.changeLockSettings`;
- una edición del script `Before tables` o `After tables` de la pestaña [Esquema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Las opciones de vista `Table Groups` y `Memos` viajan en la acción existente `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, que enviaban los interruptores `Save Scroll Information` y `Save Zoom Information` antes de que los bloqueos los sustituyeran, ya no se envía, y `settings.changeRelationshipOptimization` ha desaparecido. Un editor `4.0.0` que recibe cualquiera de las dos no cambia nada.

Un editor anterior a la `4.0.0` ignora los nuevos tipos de acción: nunca ve un grupo de tablas ni qué tablas contiene, aunque el arrastre de un grupo sigue moviendo allí las tablas del grupo, ya que también envía un movimiento de cada una de esas tablas.  
Conserva las columnas antiguas de una relación tras una pulsación de `Save` en Asignar columnas, y, cuando en ese editor se elimina una columna de esa asignación antigua, la relación desaparece en todos los editores. No tiene bloqueos ni scripts.  
Un documento guardado desde uno de ellos no tiene nada de esto, y un editor `4.0.0` lo abre con todos los bloqueos activados.  
Mantén todos los editores de una sesión, y cualquier [replicationStore](./remote-storage.md#dispatch-dispatchsync) que almacene su documento, en la `4.0.0` o posterior.

Un editor `4.1.0` no envía ningún tipo de acción nuevo, así que los editores y réplicas `4.0.0` y `4.1.0` comparten una sesión sin perderse nada.  
En él, [Buscar y reemplazar](../../guide/guides/find-and-replace.md#replacing) también busca en los nombres de índices y de grupos de tablas, y `Replace` y `Replace All` les cambian el nombre con las acciones `index.changeName` y `tableGroup.changeName`, que un editor `4.0.0` ya aplica.

Desde la `4.2.0`, estos cambios viajan en nuevos tipos de acción, y un retransmisor que pasa las acciones tal cual no necesita nada nuevo para ellos:

- el [nombre lógico](../../guide/guides/logical-names.md) de una tabla o columna: `table.changeLogicalName` y `column.changeLogicalName`; si su nombre se [derivó de los diccionarios](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` y `column.changeNameDerived`;
- una columna que se vincula a un [dominio](../../guide/guides/dictionary.md#domains-and-data-types) o se desvincula: `column.changeDomain`;
- una palabra, un término o un dominio que se añade, se cambia (incluido su lugar en la hoja, tal como lo fija una ordenación) o se elimina en la pestaña [Diccionario](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` y `dictionary.remove`;
- un cambio de la [vista de nombres](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

El bloqueo `Name View` viaja en la acción existente `settings.changeLockSettings`, la opción de vista `Domain`, en `settings.changeShow`, y un movimiento de `Logical Name` o `Domain` en el [orden de columnas](../../guide/guides/settings.md#adjusting-column-order), en `settings.changeColumnOrder`.  
Las acciones `editor.clear` y `editor.loadJson` de una importación de Esquema SQL, GraphQL, DBML o AML desde `Import` llevan `keepDictionaries: true`, que conserva las palabras, los términos y los dominios en todos los editores. También lo llevan las de un [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` o `setSchemaAML` que sustituye el documento.  
Un nombre físico que derivan los diccionarios viaja en `table.changeName` o `column.changeName`, y el tipo de datos que un dominio da a sus columnas, en `column.changeDataType`, las mismas acciones que envía una edición a mano.

Un editor anterior a la `4.2.0` ignora los nuevos tipos de acción: no tiene nombres lógicos, vínculos con dominios, diccionarios ni vista de nombres. Un bloqueo o desbloqueo de `Name View` no cambia nada allí, como tampoco un movimiento de `Logical Name` o `Domain` en el orden de columnas ni uno sobre cualquiera de los dos. Tampoco lo hace un bloqueo de `Canvas Type` activado por un editor que llegó a la pestaña Configuración desde la pestaña Diccionario: el editor más antiguo no conoce esa pestaña, así que mantiene `Canvas Type` desbloqueado. Sigue mostrando los nombres físicos que derivan los diccionarios y los tipos de datos que dan los dominios.  
Sus propias ediciones no saben nada de nombres lógicos, dominios ni diccionarios, con estos efectos en los editores más recientes:

- Una tabla o columna a la que cambia el nombre a mano conserva su nombre marcado como derivado, así que un nombre lógico que se le escriba más tarde en un editor más reciente puede volver a derivar el nombre y sobrescribir el que escribió ese editor.
- Un tipo de datos que da a una columna vinculada a un dominio mantiene el vínculo, así que la hoja `Checks` lista `Domain type mismatch` y el siguiente cambio de tipo del dominio vuelve a dar a la columna el tipo del dominio.
- Las columnas de clave externa de una relación que añade no reciben de su clave ningún nombre lógico ni dominio.
- Una tabla que pega o duplica llega sin nombres lógicos ni vínculos con dominios.
- Una importación de Esquema SQL, GraphQL, DBML o AML en él no envía `keepDictionaries`, así que vacía las palabras, los términos y los dominios en todos los editores.
- Su deshacer de una carga, una importación o `clear()` carga su propia copia del documento en todos los editores, y esa copia no tiene nombres lógicos, vínculos con dominios ni diccionarios.
- Esa copia, y el documento que carga en él una importación de Esquema SQL, GraphQL, DBML o AML, también devuelven el bloqueo `Name View` de todos los editores al estado en que ese editor lo encontró. Entonces todos los editores guardan `Physical Names` como vista de nombres, y también la muestran si el bloqueo está desactivado.

Un documento guardado desde uno de ellos no tiene nombres lógicos, vínculos con dominios, diccionarios ni vista de nombres, así que un editor `4.2.0` lo abre en `Physical Names`. El editor más antiguo sí guarda el bloqueo `Name View` tal como lo encontró, así que un documento desbloqueado en un editor `4.2.0` sigue desbloqueado.  
Mantén todos los editores de una sesión, y cualquier [replicationStore](./remote-storage.md#dispatch-dispatchsync) que almacene su documento, en la `4.2.0` o posterior.

Un editor `5.1.0` no envía ningún tipo de acción nuevo, así que los editores y réplicas anteriores a la `5.1.0` siguen compartiendo una sesión con él, y un retransmisor que pasa las acciones tal cual no necesita nada nuevo. Sin embargo, lo que describe [Ediciones simultáneas](#concurrent-edits) vale solo entre editores y réplicas `5.1.0`:

- Los arrastres de un editor `5.1.0` viajan como puntos en `table.moveTo`, `memo.moveTo` y `tableGroup.moveTo`, que los editores más antiguos ya aplican, y sus desplazamientos y zooms, como puntos en `settings.scrollTo` y `settings.changeZoomLevel`, que, como todo desplazamiento y zoom, no aplica ningún otro editor y solo toman las réplicas. Un editor más antiguo aplica cada punto de un arrastre en el orden en que llega, fuera de cualquier registro, y una réplica más antigua hace lo mismo con cada punto de un arrastre, desplazamiento o zoom, así que dos puntos enviados a la vez para una misma entidad, o para la vista, pueden terminar distintos allí.
- El arrastre de un editor más antiguo sigue viajando como una distancia recorrida, que todos los editores y réplicas suman fuera de sus registros, y su desplazamiento o zoom también como una distancia, que todas las réplicas suman de la misma forma. Una distancia y un punto sobre una misma entidad hechos a la vez pueden terminar distintos en los editores y réplicas que los oyen en distinto orden, y una distancia que un transporte entrega dos veces se suma dos veces.
- Fuera de las excepciones que nombra [Ediciones simultáneas](#concurrent-edits), la escritura de un nombre o campo hecha por un editor `5.1.0` en el mismo momento que la de un editor más antiguo prevalece casi siempre, con la misma respuesta en todos los editores y réplicas. Dos editores más antiguos aún pueden terminar distintos por un mismo campo escrito a la vez.
- Un editor `5.1.0` envía un cambio de lenguaje, estilo de nombres o tipo de delimitador del Generador de código solo mientras su bloqueo está desactivado, con la marca `shared: true`, que un editor más antiguo ignora, aunque aplica el cambio como antes. Un editor más antiguo sigue enviando el que hace bajo el bloqueo, sin marca: un editor o una réplica `5.1.0` lo descarta mientras ese ajuste está bloqueado allí, y los editores más antiguos lo aplican. Así, bajo un bloqueo los editores más antiguos siguen las elecciones de los demás mientras los editores `5.1.0` mantienen las suyas, y el archivo conserva el valor bloqueado en ambos casos. Un desbloqueo hecho en cualquiera de las dos versiones lleva el valor de quien desbloquea a todos los editores y réplicas.
- Una carga que sustituye el documento, como un `value` asignado, `clear()` o una importación que sustituye, pone fin a una relación que se está dibujando en todos los editores `5.1.0`, tanto en el que la hizo como en cada uno que la recibe. Un editor más antiguo mantiene su dibujo preparado a pesar de ella.

Mantén todos los editores de una sesión, y cualquier [replicationStore](./remote-storage.md#dispatch-dispatchsync) que almacene su documento, en la `5.1.0` o posterior, para que las ediciones hechas en el mismo momento terminen igual en todas partes, salvo las excepciones que nombra [Ediciones simultáneas](#concurrent-edits); la `4.2.0` o posterior sigue siendo lo que conserva los nombres lógicos y los diccionarios. Un [servidor MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) anterior a la `1.2.0` cuenta aquí como un editor anterior a la `5.1.0`, y un editor anterior a la `5.1.0` no puede vincularse en absoluto a una sala de [Yjs](./yjs.md).

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Define el apodo que se muestra junto al cursor del ratón de este usuario en los demás editores.  
Los demás usuarios ven `user` cuando falta el apodo o está en blanco.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Transmite el cursor del ratón de este usuario a los demás editores. El valor predeterminado es `true`.  
Los cursores que envían otros usuarios siempre se muestran en el lienzo ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Transmite aquello en lo que está trabajando este usuario. El valor predeterminado es `true`.  
La tabla y la celda en las que tienes el foco, las tablas, notas y grupos de tablas que tienes seleccionados y el cuadro que arrastras en el lienzo se envían a los demás editores y se dibujan allí.  
Cada usuario recibe un color propio para que puedas distinguirlos: un contorno en la tabla con el foco, un subrayado en la celda con el foco, un marco alrededor de las tablas, notas y grupos de tablas seleccionados y un rectángulo discontinuo para el cuadro de arrastre.  
Desde la `4.2.0`, cada usuario puede estar viendo una [vista de nombres](../../guide/guides/logical-names.md#collaborators) distinta mientras su bloqueo está activado, o después del cambio propio de un editor de solo lectura. Una celda con el foco que tu vista no dibuja se subraya en la celda que tu vista dibuja en su lugar: el nombre y el nombre lógico ocupan el uno el lugar del otro, como el tipo de datos y el dominio.  
La presencia que llega de otros usuarios siempre se dibuja en tu lienzo, esté o no activada esta opción.  
En el modo Flow de la pestaña Visualización, el foco y la selección de los demás usuarios se dibujan en las tarjetas de las tablas, pero sus cuadros de arrastre no. Las tablas que seleccionas allí se siguen enviando; el cuadro que arrastras allí, no.

```js
editor.getSharedStore({ focusTracker: false });
```

Desactiva ambos rastreadores para usar el almacén compartido como un simple retransmisor que no publica presencia propia.  
La presencia que envían otros editores se sigue recibiendo y dibujando.  
Es lo que hacen los editores de VS Code, Obsidian, un IDE de JetBrains y Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

El cursor, el foco, la selección y el cuadro de arrastre viajan en el mismo flujo que los cambios del documento, pero son efímeros.  
Nunca entran en el documento, en el historial de deshacer ni en `editor.value`, así que un transporte puede descartarlos libremente y un replicationStore los ignora.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Estos métodos establecen el estado actual de la conexión.  
Mientras está desconectado, los cambios se almacenan internamente en un búfer.  
Los cambios almacenados en el búfer se emiten a los suscriptores en cuanto vuelve a ser posible la transmisión.  
El estado predeterminado es conectado (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica a la instancia actual del editor los cambios procedentes de otras instancias del editor.  
Cuando un lote contiene la petición de registros de otro editor, como la que envía el primer [subscribe](#subscribe) de un editor que se une, el almacén responde a través de sus suscriptores con sus registros y su versión, salvo que no tenga ningún registro.  
Desde la `5.1.0`, primero envía todos los lotes de flujo que aún retiene, como hace [flushStreamBuffers](#flushstreambuffers), para que cada versión que lleva su respuesta se apoye en una escritura que ya se ha enviado a los demás. Por tanto, la llegada de un editor que se une hace que todos los editores de la sesión envíen a la vez un arrastre, desplazamiento, zoom, cambio de color o cambio de tamaño de una nota que aún retienen.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Se suscribe a los cambios del editor.  
Nada sale del editor hasta que hay al menos un suscriptor, y los cambios hechos antes de eso se almacenan en un búfer.  
El primer subscribe también pide a los demás editores sus registros de colaboración, que resuelven las [ediciones simultáneas](#concurrent-edits), para que un editor que se une tarde las resuelva de la misma forma.  
No trae el documento, así que [inicializa](#seeding-a-collaborator) primero un editor que se une tarde; desde la `5.1.0`, la inicialización también puede llevar los registros.  
Desde la `4.0.0`, el almacén vuelve a pedirlos cada vez que `setInitialValue`, o desde la `5.1.0` [reseed](#reseed), carga un documento en su editor después de ese primer subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envía ya los lotes de flujo que este almacén aún retiene, en lugar de hacerlo tras su periodo de inactividad.  
Desde la `3.9.2`, funciona en un almacén obtenido de `getSharedStore`; en la `3.9.1`, el método está en el tipo, pero no hace nada.  
Mover una tabla, una nota o un grupo de tablas, cambiar su color, cambiar el tamaño de una nota y desplazar la vista o hacer zoom en ella se hacen cada uno como un flujo de pequeños cambios. Cambiar el tamaño de un grupo de tablas no: se envía una sola vez, cuando termina el arrastre.  
El almacén reúne cada flujo en un único lote y lo retiene hasta que el flujo lleva 200 ms inactivo, en dos etapas. Un cambio de color o de tamaño de una nota pasa por ambas, así que sale unos 400 ms después del último cambio, como todo flujo antes de la `5.1.0`. Desde la `5.1.0`, un arrastre, un desplazamiento o un zoom sale tras la primera etapa, unos 200 ms después de su último paso, como el punto en el que termina (consulta [Ediciones simultáneas](#concurrent-edits)).  
Una llamada pone fin a esa espera en ambas etapas. Mientras el almacén está conectado, un suscriptor recibe el lote antes de que la llamada devuelva el control. Una llamada sin nada retenido no envía nada.  
`destroy`, tanto el del propio almacén como el del editor, descarta un lote que aún está retenido, así que llama primero a este método cuando dejes de usar un almacén y los demás deban conservar el último cambio, como cuando se cierra una pestaña.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Desde la `5.1.0`, devuelve una copia de los registros de colaboración del editor (consulta [Ediciones simultáneas](#concurrent-edits)).  
La copia se hace a través de JSON, así que es un objeto simple listo para `JSON.stringify`, y un cambio en ella deja los registros del almacén como estaban.  
Entrégala tal cual al [mergeLWW](#mergelww) o al [reseed](#reseed) de otro almacén. Su forma es la propia del editor, así que no leas ningún campo de ella.  
Léela junto con [getVersion](#getversion) y el `runtimeValue` del editor en el mismo momento para [inicializar un editor que se une](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Desde la `5.1.0`, incorpora a los de este almacén los registros que otro almacén entregó con [getLWW](#getlww), conservando la mayor versión de cada uno, e incorpora `version` al reloj del editor, que conserva la mayor entre la suya y la dada.  
No cambia nada en el documento: ni un byte de `value` o `runtimeValue`, ni una entrada de deshacer, ni un evento `change`. Solo eleva las versiones que debe superar una escritura posterior, así que después se rechaza una escritura más antigua que los registros dados, y la siguiente edición del editor lleva una versión posterior a `version`.  
No envía nada ni responde a nada. Es lo que recibe el primer subscribe de un editor que se une con la respuesta de los demás, tomado directamente.  
Llámalo después de `setInitialValue`, nunca antes: cada `setInitialValue` y cada [reseed](#reseed) descarta los registros que se tienen, y con ellos lo que incorporó un `mergeLWW` anterior.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Desde la `5.1.0`, devuelve la versión más alta que ha incorporado el reloj del editor: la mayor de las versiones de los cambios que hizo o recibió, de las peticiones de registros y las respuestas que intercambia una incorporación, y de cada `version` dada a `mergeLWW` o `reseed`.  
Los cursores, el foco, las selecciones y los cuadros de arrastre, propios o de otro editor, no la mueven.  
Entrégala junto con [getLWW()](#getlww), leídos en el mismo momento, al [mergeLWW](#mergelww) o al [reseed](#reseed) de un editor que se une. Es una [versión](#concurrent-edits) como las que llevan sus acciones.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Desde la `5.1.0`, elimina al instante el cursor, el foco, la selección y el cuadro de arrastre que envió el editor con el id dado, y la caducidad que esperaba cada uno. Los de los demás editores se quedan.  
El id es el `meta.editorId` que lleva cada acción que envía el almacén compartido de ese editor. Un id del que este editor no tiene nada no cambia nada.  
Llámalo cuando tu transporte sepa que un par se ha ido. De lo contrario, lo que envió el par se queda dibujado hasta que caduca: su cursor, 30 segundos después del último recibido; su foco y su selección, 90 segundos después; y su cuadro de arrastre, 3 segundos después.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Desde la `5.1.0`, vuelve a abrir en el editor el documento de una sesión, como hace una reincorporación. La vinculación con [Yjs](./yjs.md) lo llama para abrir el documento de una sala cuando se vincula a una sala que ya se ha inicializado, y de nuevo en cada reincorporación, conservando la pantalla una vez que se había unido a la sala.  
Carga `value` como hace [setInitialValue](../erd-editor-element.md#setinitialvalue) y toma `lww` y `version` como hace [mergeLWW](#mergelww), así que el almacén pasa a tener exactamente los registros dados, y su reloj, la mayor entre su propia versión y `version`. También vacía el historial de deshacer y, a diferencia de `setInitialValue`, descarta la selección y el foco, ya que pueden nombrar algo que el valor ya no contiene.  
Aparte de la derivación del nombre lógico que se indica más abajo, no crea ninguna entrada de deshacer, no emite ningún evento `change` y no envía ningún cambio. Una vez que el almacén ha tenido un suscriptor, envía la petición de registros que envía toda carga así, que un transporte que ya entregó los registros puede descartar, y, con el [focusTracker](#focustracker) activado, la selección y el foco vaciados.  
Como `setInitialValue`, funciona mientras [readonly](../erd-editor-element.md#readonly) está activado, descarta una vista de Flow, pone fin a una relación que se está dibujando y cierra los editores de nota, de nombre de grupo de tablas y de celda, conservando o descartando lo escrito en ellos de la misma forma; un nombre que una celda de nombre lógico deriva al cerrarse a partir de lo que escribió su lector es una edición corriente: se envía, se puede deshacer y se emite como evento `change`.

Sin `keepScreen`, la pantalla muestra lo que contiene el valor, como tras `setInitialValue`. Con `keepScreen: true`, la pantalla del lector se vuelve a colocar sobre el documento cargado, solo en esa pantalla:

- la posición de desplazamiento y el nivel de zoom, una vez que el elemento los ha mostrado; en un elemento que nunca los ha mostrado, o que se cargó mientras estaba oculto y no se ha mostrado desde entonces, se abren donde los coloca el valor, como en un editor que se une tarde;
- la pestaña, cuando la carga la movió, y en la pestaña Configuración también la pestaña de la que venía el lector, que nombra un bloqueo de `Canvas Type` activado allí;
- la vista de nombres y cada ajuste del Generador de código que el lector mostraba por su cuenta bajo su bloqueo, pero solo cuando ese bloqueo estaba activado antes de la carga, sigue activado después y conserva el mismo valor bloqueado. Así, cuando un par desbloqueó, cambió y volvió a bloquear un ajuste con otro valor mientras tanto, el editor se abre con el nuevo valor bloqueado, y donde el bloqueo está desactivado antes o después de la carga, muestra el valor cargado;
- todos los ajustes que un lector de solo lectura cambió por su cuenta en su pantalla, digan lo que digan los bloqueos.

Nada de esto se envía, y `value` y `runtimeValue` siguen informando del documento cargado. El desbloqueo posterior de un par sustituye un ajuste de código conservado así, como cualquier desbloqueo.  
El siguiente desplazamiento o zoom del lector hecho mientras el editor puede editar vuelve a convertir en las del documento la posición de desplazamiento y el nivel de zoom conservados, y sale encabezado por el punto en el que está la pantalla, de modo que las réplicas también toman ese zoom.

Una reinicialización deja como está lo que retiene el almacén. Un arrastre, desplazamiento o zoom que aún se retiene sale después de ella, leído del documento reinicializado; un cambio de color o de tamaño de una nota sale tal como se hizo, aunque el editor ya no lo muestre; y lo que retenía `disconnect()` sale con `connection()`.  
Por eso, llama primero a [flushStreamBuffers](#flushstreambuffers), envía lo que emite y reinicializa con un valor que lo contenga. No reinicialices nunca mientras está desconectado.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Destruye por completo la instancia de sharedStore.  
El editor en sí no se toca, así que salir de una sesión mantiene el documento editable.  
Los rastreadores del ratón y del foco se detienen en cuanto se destruye el último sharedStore que entregó el editor.  
Un lote de flujo que el almacén aún retiene se descarta con él; llama primero a [flushStreamBuffers](#flushstreambuffers) para enviarlo.  
Los cursores, el foco, las selecciones y los cuadros de arrastre que enviaron otros editores se quedan dibujados hasta que caducan; desde la `5.1.0`, [forgetPeer](#forgetpeer) elimina de inmediato los de un editor.

```js
sharedStore.destroy();
```
