---
sidebar_position: 1
description: Retransmite los cambios del editor entre instancias con getSharedStore, inicializa un editor que se une a partir de runtimeValue y muestra el cursor, el foco, la selección y el cuadro de arrastre de cada colaborador.
---

# Edición colaborativa

`getSharedStore()` convierte un editor en un nodo de una sesión colaborativa.  
Emite cada cambio como un flujo de acciones y aplica las acciones que le devuelven los demás editores; el transporte entre ellos lo proporcionas tú (WebSocket, WebRTC o cualquier otra cosa que pueda transportar JSON).  
Es uno de los métodos de [ErdEditorElement](../erd-editor-element.md) y se combina con el [almacenamiento remoto](./remote-storage.md) cuando los cambios retransmitidos también deben almacenarse.

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
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Una acción es un objeto serializable simple que describe un cambio en el documento, así que sobrevive a `JSON.stringify` en su camino hacia el transporte.  
Llegan en lotes: `subscribe` te entrega un array y ese array es una unidad; retransmítelo entero y despáchalo entero en el otro lado.  
Trata cada acción como opaca y pásala tal cual en lugar de leerla o reescribirla, ya que la información interna que lleva es lo que mantiene sincronizados los editores.

Parte de lo que hace un editor se queda en ese editor.  
Traer al frente una tabla, una nota o un grupo de tablas, como ocurre al seleccionar uno de ellos, no se envía.  
Tampoco se envían las opciones `Statements`, `Header` y `Tables` de la pestaña [Esquema SQL](../../guide/guides/schema-sql.md), que pertenecen a la ventana en la que se eligen.  
Desde la `4.1.0`, el [explorador](../../guide/guides/explorer.md) también se queda en su editor: no se envían si está abierto o no, su anchura, sus filas contraídas, la fila en la que está el foco del teclado, la posición de desplazamiento de su árbol, su búsqueda ni sus opciones.  
Tampoco se envía la [iluminación](../../guide/guides/relationship-editing.md#reading-a-connector) que, al ir a una clave externa, recibe el conector de su relación.  
Un desplazamiento, un zoom o un cambio de pestaña sí se envía, pero nunca mueve la vista ni la pestaña de otro usuario. Eso incluye el desplazamiento que provoca un salto desde el explorador y el cambio a la pestaña ERD cuando el explorador se abre desde otra pestaña.

Los [bloqueos](../../guide/guides/settings.md#lock) se comparten: el último bloqueo o desbloqueo de un ajuste prevalece en todos los editores, y un bloqueo lleva los valores del editor que lo activó, así que todos los editores y réplicas guardan el mismo valor.  
Por tanto, un bloqueo de `Viewport` guarda la vista del editor que lo activó, y un bloqueo de `Canvas Type`, la última pestaña en la que estuvo ese editor antes de la pestaña Configuración, donde se activan los bloqueos.  
Desactivar el bloqueo de `Language`, `Table Name Case`, `Column Name Case` o `Bracket Type` también fija ese ajuste en todos los editores al valor que muestra el editor que lo desactivó, para que sigan guardando un único valor. Desactivar el bloqueo de `Viewport` o `Canvas Type` no mueve la vista ni la pestaña de nadie.

Una edición del script `Before tables` o `After tables` se envía entera cuando su campo pierde el foco. Los dos scripts se resuelven por separado, así que la edición de uno por parte de un colaborador nunca sobrescribe el otro.

Nada de lo que se hace en el [modo Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) de la pestaña Visualización es un cambio del documento, así que un editor en Flow no envía cambios a los demás, y los cambios que ellos envían se siguen aplicando mientras está allí.  
La única excepción es salir de Flow hacia otra pestaña: ese cambio de pestaña se envía como cualquier otro.  
El botón de enlace externo de la tarjeta, un resultado de la [búsqueda rápida](../../guide/guides/quick-search.md#searching-the-diagram) elegido tras `#`, `@` o `:` y la apertura del [explorador](../../guide/guides/explorer.md#opening-and-closing) provocan todos la salida de Flow hacia la pestaña ERD. También se envía el desplazamiento que el botón de la tarjeta o un resultado de la búsqueda rápida produce allí.

## Dos editores en una página {#two-editors-on-one-page}

La conexión de subscribe a dispatch de este ejemplo sustituye a la red, para que veas la forma de una sesión sin un transporte de por medio.

```js
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

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

El valor en tiempo de ejecución aún contiene lo que se ha eliminado desde que se abrió el documento, así que, cuando otro editor deshace más tarde una eliminación, el editor que se ha unido recupera la tabla con su nombre y sus columnas.  
[`value`](../erd-editor-element.md#value) es la forma que contiene un archivo, sin las entidades eliminadas, así que un editor inicializado a partir de él, o del archivo, recuperaría en su lugar una tabla vacía y sin nombre.  
Sigue escribiendo `value` en el almacenamiento: `runtimeValue` sirve solo para inicializar otro editor, una segunda vista o un [replicationStore](./remote-storage.md).  
Los editores de VS Code, Obsidian, un IDE de JetBrains y la aplicación web inicializan así una segunda vista de un documento abierto.

`setInitialValue` no se retransmite, así que inicializar el editor que se une no cambia nada en los demás.  
Desde la `4.0.0`, también descarta los registros de colaboración del editor, que resuelven las ediciones simultáneas. Si el almacén compartido del editor ya ha tenido un suscriptor, el almacén vuelve a pedir los suyos a los demás editores, como en su primer [subscribe](#subscribe), para que un editor cargado de nuevo en mitad de una sesión resuelva las ediciones igual que los demás.  
Asignar `value` conserva los registros, pero, a diferencia de `setInitialValue`, se retransmite: en cuanto el editor tiene un almacén compartido, todos los editores de la sesión cargan el documento asignado, así que nunca inicialices de esa forma un editor que se une.

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

Un editor anterior a la `4.0.0` ignora los nuevos tipos de acción: nunca ve un grupo de tablas ni qué tablas contiene, aunque el arrastre de un grupo sigue moviendo allí las tablas del grupo, ya que también envía su `table.move`.  
Conserva las columnas antiguas de una relación tras una pulsación de `Save` en Asignar columnas, y, cuando en ese editor se elimina una columna de esa asignación antigua, la relación desaparece en todos los editores. No tiene bloqueos ni scripts.  
Un documento guardado desde uno de ellos no tiene nada de esto, y un editor `4.0.0` lo abre con todos los bloqueos activados.  
Mantén todos los editores de una sesión, y cualquier [replicationStore](./remote-storage.md#dispatch-dispatchsync) que almacene su documento, en la `4.0.0` o posterior.

Un editor `4.1.0` no envía ningún tipo de acción nuevo, así que los editores y réplicas `4.0.0` y `4.1.0` comparten una sesión sin perderse nada.  
En él, [Buscar y reemplazar](../../guide/guides/find-and-replace.md#replacing) también busca en los nombres de índices y de grupos de tablas, y `Replace` y `Replace All` les cambian el nombre con las acciones `index.changeName` y `tableGroup.changeName`, que un editor `4.0.0` ya aplica.

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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Se suscribe a los cambios del editor.  
Nada sale del editor hasta que hay al menos un suscriptor, y los cambios hechos antes de eso se almacenan en un búfer.  
El primer subscribe también pide a los demás editores sus registros de colaboración, que resuelven las ediciones simultáneas, para que un editor que se une tarde las resuelva de la misma forma.  
No trae el documento, así que [inicializa](#seeding-a-collaborator) primero un editor que se une tarde.  
Desde la `4.0.0`, el almacén vuelve a pedirlos cada vez que `setInitialValue` carga un documento en su editor después de ese primer subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envía ya los lotes de flujo que este almacén aún retiene, en lugar de hacerlo tras su periodo de inactividad.  
Desde la `3.9.2`, funciona en un almacén obtenido de `getSharedStore`; en la `3.9.1`, el método está en el tipo, pero no hace nada.  
Mover una tabla, una nota o un grupo de tablas, cambiar su color, cambiar el tamaño de una nota y desplazar la vista o hacer zoom en ella llegan cada uno como un flujo de pequeños cambios. Cambiar el tamaño de un grupo de tablas no: se envía una sola vez, cuando termina el arrastre.  
El almacén reúne cada flujo en un único lote y lo retiene hasta que el flujo lleva 200 ms inactivo. Lo hace en dos etapas, así que el lote sale unos 400 ms después del último cambio.  
Una llamada pone fin a esa espera en ambas etapas. Mientras el almacén está conectado, un suscriptor recibe el lote antes de que la llamada devuelva el control. Una llamada sin nada retenido no envía nada.  
`destroy`, tanto el del propio almacén como el del editor, descarta un lote que aún está retenido, así que llama primero a este método cuando dejes de usar un almacén y los demás deban conservar el último cambio, como cuando se cierra una pestaña.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Destruye por completo la instancia de sharedStore.  
El editor en sí no se toca, así que salir de una sesión mantiene el documento editable.  
Los rastreadores del ratón y del foco se detienen en cuanto se destruye el último sharedStore que entregó el editor.  
Un lote de flujo que el almacén aún retiene se descarta con él; llama primero a [flushStreamBuffers](#flushstreambuffers) para enviarlo.

```js
sharedStore.destroy();
```
