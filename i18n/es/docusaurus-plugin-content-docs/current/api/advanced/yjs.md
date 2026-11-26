---
sidebar_position: 2
description: Mantén sincronizado un elemento <erd-editor> o un almacén par headless mediante un documento de Yjs con @dineug/erd-editor-yjs, inicializa una sala, muestra la presencia con Awareness, sigue editando sin conexión y pliega el historial de la sala con un sidecar de compactación.
---

# Yjs

`@dineug/erd-editor-yjs` mantiene sincronizados los diagramas mediante un documento de [Yjs](https://github.com/yjs/yjs). Es un paquete independiente, publicado por primera vez como `0.1.0` junto a `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` vincula un elemento `<erd-editor>`, y `bindPeerStore` un almacén par headless de `@dineug/erd-editor/peer.js`, a un `Y.Doc`.  
El proveedor que transporte el `Y.Doc` transporta el diagrama: un servidor websocket, WebRTC, IndexedDB o uno propio. El proveedor y el `Y.Doc` siguen siendo tuyos: la vinculación nunca los conecta, los desconecta ni los destruye.

Las ediciones viajan como los lotes de acciones del propio editor, que la vinculación conserva tal como los envió el almacén.  
Así, los registros de colaboración del editor resuelven las ediciones hechas en el mismo momento igual que en una sesión conectada mediante `getSharedStore`, con las mismas excepciones, como un cambio de color; consulta [Ediciones simultáneas](./collaborative-editing.md#concurrent-edits).  
Los cursores, el foco, las selecciones y los cuadros de arrastre viajan por el Awareness del proveedor; consulta [Presencia](#presence).  
En comparación con conectar tú mismo un almacén compartido a un transporte, la vinculación añade:

- Un cliente que se une abre el diagrama que contiene la sala, sin que un editor en ejecución le entregue un [runtimeValue](../erd-editor-element.md#runtimevalue).
- Un cliente desconectado sigue editando y sus ediciones llegan cuando se reconecta; consulta [Ediciones sin conexión y reincorporaciones](#offline-edits-and-rejoins).
- Un `Y.Doc` que devuelve un proveedor de persistencia abre el diagrama que contiene; consulta [Qué contiene la sala](#what-the-room-holds).
- Un sidecar de Node opcional pliega el historial de la sala en una única instantánea; consulta [Compactar una sala](#compacting-a-room).

La vinculación necesita los cinco métodos que la `5.1.0` añadió al almacén compartido y al almacén par ([getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) y [reseed](./collaborative-editing.md#reseed)) y hace ella misma todas las llamadas que necesita hacerles.

## Instalación {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` y `y-protocols` son dependencias entre pares, de modo que una página contiene una sola copia de cada una: `@dineug/erd-editor` `5.1.0` o posterior dentro de la `5.x`, `yjs` `13.6` o posterior dentro de la `13.x` y `y-protocols` `1.0` o posterior dentro de la `1.x`.  
El paquete solo toma sus tipos y trabaja con el `Y.Doc` y el `Awareness` que le pases, así que no carga código propio de Yjs, de y-protocols ni del editor.  
Dos copias de Yjs en una página se rompen mutuamente las comprobaciones de constructor, y la segunda registra `Yjs was already imported`. Cuando tu código y un proveedor resuelvan `yjs` desde dos lugares distintos, desduplícalo en el bundler (Vite: `resolve.dedupe: ['yjs']`).

El paquete es solo ESM (`"type": "module"`), con una única entrada, la raíz del paquete, y está marcado como libre de efectos secundarios, de modo que un bundle que importe solo `bindErdEditor` deja fuera el compactador.  
`bindErdEditor` necesita un DOM, ya que vincula un elemento `<erd-editor>` definido. `bindPeerStore` también funciona en Node puro, con Node.js 22.12 o posterior, como lo hace el [sidecar de compactación](#compacting-a-room).

## Uso {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` y `my-diagram` representan tu propio servidor y tu propia sala.  
Vincula, e inicializa, solo cuando el proveedor se haya sincronizado, como te indica el evento `sync` de y-websocket con `true`. Una inicialización hecha antes puede reemplazar el diagrama de la sala; consulta [Inicializar una sala](#seeding-a-room).

Cuando el `Y.Doc` contiene una instantánea de la sala en el momento de vincular, la vinculación la abre en el elemento de inmediato: carga la instantánea con sus registros y su versión, como hace [reseed](./collaborative-editing.md#reseed), y aplica todas las ediciones registradas desde entonces.  
Esa apertura borra y cierra lo mismo que una reincorporación (consulta [Ediciones sin conexión y reincorporaciones](#offline-edits-and-rejoins)), y el elemento se abre donde la instantánea lo sitúa. Esta primera apertura no dispara ningún `rejoin`.  
Cuando el `Y.Doc` no contiene ninguna instantánea, como en una sala vacía o antes de que el proveedor se haya sincronizado, el elemento conserva su documento y la vinculación no escribe nada en la sala hasta que aparezca una instantánea, la de su propio [seed](#seed) o la de otro cliente.

`bindErdEditor` toma un almacén compartido del elemento con [getSharedStore](../erd-editor-element.md#getsharedstore), y [destroy](#destroy) lo libera.  
El elemento ya debe ser un `<erd-editor>`, con su entrada importada o con `defineErdEditor()` llamado; consulta [Registro de los elementos](../installation.md#registering-the-elements). Mientras la etiqueta no esté definida, un `<erd-editor>` es un `HTMLElement` simple, que el navegador actualiza cuando la etiqueta se define y el elemento está en el documento. Para un elemento que aún no se ha actualizado, `bindErdEditor` lanza un `TypeError` en lugar de emitir `error`.

Las ediciones de la sala se aplican al elemento, y emiten [change](../erd-editor-element.md#change), como las de un colaborador, entre ellas las ediciones que se reproducen después de abrirse una instantánea.  
Abrir una instantánea, al vincular o en una reincorporación, no crea ninguna entrada de deshacer, no emite `change` y no escribe nada en la sala, salvo la derivación del nombre lógico que describe [Ediciones sin conexión y reincorporaciones](#offline-edits-and-rejoins).  
Para cargar otro documento en una sala ya inicializada, haz un cambio que apliquen todos los clientes: asigna [value](../erd-editor-element.md#value), llama a [clear](../erd-editor-element.md#clear) o importa uno.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) nunca se escribe en la sala, ya que un almacén compartido no lo envía, así que solo cambia ese elemento mientras todos los demás clientes conservan el diagrama de la sala. Para inicializar una sala vacía, usa [seed](#seed).

Un `Y.Doc` contiene un solo diagrama. La vinculación lo guarda bajo los nombres `erd:` del `Y.Doc` y establece el campo `erd` del estado local de Awareness, y deja intactos los demás nombres y campos.  
Dale a cada elemento vinculado un `Y.Doc` y un Awareness propios, como tiene cada cliente de una sala: dos vinculaciones que comparten un Awareness se sobrescriben mutuamente el campo `erd`.

## Inicializar una sala {#seeding-a-room}

Una sala no contiene ningún diagrama hasta que un cliente la [inicializa](#seed).  
Lo que contenga mientras tanto un editor pasa a su propia inicialización, y cede ante la de otro cliente cuando esta llega antes: la vinculación se reabre sobre ella con `rejoin('snapshot')`, y el documento que contenía el elemento, con lo que se editó en él desde la vinculación, se pierde.

Cuando dos clientes inicializan a la vez, una inicialización gana en todos los clientes.  
El otro cliente que inicializó se reabre sobre ella con `rejoin('seedLost')` y pierde lo que editó desde su inicialización, y lo mismo le ocurre, con `rejoin('snapshot')`, a un cliente que se había unido a la inicialización perdedora. Sus ediciones en la inicialización perdedora no llegan a nadie.  
Una inicialización hecha antes de que el proveedor se haya sincronizado cuenta como hecha en el mismo momento que la inicialización de la que procede el diagrama de la sala, así que puede imponerse a ella y reemplazar el diagrama de la sala.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

El `Awareness` que transporta los cursores, el foco, las selecciones y los cuadros de arrastre, como el del proveedor.  
Con él, la vinculación activa los rastreadores del ratón y del foco del elemento y dibuja en el elemento la presencia de los demás clientes; consulta [Presencia](#presence).  
Sin él solo se sincroniza el diagrama: el elemento no envía cursor, foco ni selección y no dibuja los de nadie más.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

El nombre que ven los demás junto al cursor de este editor.  
El almacén compartido del elemento lo lee cada vez que envía, como con [getSharedStore](./collaborative-editing.md#getnickname), y los demás usuarios ven `user` cuando falta o está en blanco.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` devuelve una función que quita el listener.

### seed {#seed}

Escribe la primera instantánea de la sala a partir del documento del editor y devuelve `true`.  
Si se le da `value`, el texto de un documento en cualquier forma que lea [setInitialValue](../erd-editor-element.md#setinitialvalue), lo carga primero en el editor.  
Después suelta, sin registrarlos, los arrastres, los cambios de tamaño y los cambios de color que el editor aún retiene, de modo que ninguno llegue a la sala después de la instantánea. Sin `value`, la instantánea ya los refleja, porque toma el documento del editor; con `value`, pertenecían al documento que `value` reemplazó.  
Luego escribe la instantánea que describe [Qué contiene la sala](#what-the-room-holds).  
Una vez que la sala contiene una instantánea, devuelve `false` y no escribe nada, sin cargar `value`, de modo que todos los clientes pueden llamarlo después de vincular. También devuelve `false` cuando la vinculación se destruyó o se detuvo, y en una vinculación [rechazada](#onerror) en el momento de vincular.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

La vinculación reabrió el editor sobre la instantánea de la sala, como hace [reseed](./collaborative-editing.md#reseed); [Ediciones sin conexión y reincorporaciones](#offline-edits-and-rejoins) explica qué conserva y qué pierde.  
`reason` indica el motivo:

- `'snapshot'`: la instantánea contiene ediciones que la vinculación no había aplicado, porque estuvo ausente mientras un compactador las plegaba, o porque un compactador repuso, en un plegado propio, lo que había plegado en una instantánea que la de otro compactador reemplazó (consulta [Un compactador por sala](#one-compactor-per-room)). También es el motivo cuando la instantánea es la primera que llega a una vinculación de una sala vacía, y cuando es la de otra inicialización y esta vinculación se había unido a una inicialización que no escribió.
- `'seedLost'`: la inicialización de otro cliente se impuso a la inicialización que escribió esta vinculación.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

La vinculación se negó a vincular, se detuvo o rechazó una opción. Cada mensaje empieza por `erd-editor-yjs: `.

En el momento de vincular no vincula nada cuando:

- el editor o el almacén par ya está vinculado a este `Y.Doc`;
- su `@dineug/erd-editor` se compiló antes de la `5.1.0`; la vinculación destruye el almacén compartido que tomó de un elemento;
- el almacén par se destruyó antes de vincularse;
- la sala contiene una instantánea con una estructura que esta versión no lee (consulta [Qué contiene la sala](#what-the-room-holds)).

Una vinculación así emite `error` en una microtarea, de modo que un listener añadido justo después de la llamada lo oye, y nunca se dispara ningún `rejoin` en ella.

Más tarde, la vinculación se detiene cuando:

- la instantánea de la sala pasa a una estructura que esta versión no lee. Todas las vinculaciones de esta versión se detienen, cada editor conserva lo que había aplicado y no se escribe nada de lo que se edite después;
- su almacén par se destruyó por debajo, algo que se detecta la siguiente vez que cambia la sala o que se llama a `seed()` o `compact()`.

Una vinculación que se detiene libera el almacén compartido que tomó, y su almacén y su `Y.Doc` como pareja, como hace [destroy](#destroy), y conserva sus listeners.

Solo para `bindPeerStore`, estos casos emiten `error` y la vinculación continúa:

- `compactAfter` no es un entero positivo: la vinculación pliega solo cuando se le pide;
- `electionGraceMs` o `retainMs` no es un número de 0 a 2 147 483 647 ms: se usa su valor predeterminado, ya que un temporizador que supera ese intervalo se dispara de inmediato;
- `synced` se rechaza: la vinculación nunca pliega y deja la elección a los demás compactadores (consulta [Un compactador por sala](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Envía a la sala los arrastres, los cambios de tamaño y los cambios de color que el editor aún retiene, establece el campo `erd` de Awareness de la vinculación en `null`, para que los demás descarten al instante su cursor, su foco y su selección, y deja de observar el `Y.Doc` y el Awareness.  
En un elemento, además destruye el almacén compartido que tomó, y deja el elemento y su documento como están.  
Una segunda llamada no hace nada. Después, lo que edite el editor no llega a nadie.

El almacén par, el `Y.Doc` y el proveedor siguen siendo tuyos, para destruirlos después de la vinculación: un almacén par destruido antes nunca envía los arrastres que aún retenía.  
El [destroy](../erd-editor-element.md#destroy) del propio elemento destruye todos los almacenes compartidos que entregó, el de la vinculación incluido, y descarta lo que retienen, así que destruye primero la vinculación.  
Destruye una vinculación antes de volver a vincular el mismo editor o almacén par al mismo `Y.Doc`; una que se detuvo con `error` ya los ha liberado.

```js
binding.destroy();
editor.destroy();
```

## Presencia {#presence}

Con [awareness](#awareness), el cursor del editor, la tabla o celda con el foco, la selección y el cuadro de arrastre viajan en el campo `erd` de su estado local de Awareness, nunca en el `Y.Doc`, de modo que nunca entran en el historial de la sala, en su instantánea ni en un `Y.Doc` persistido.  
Los demás los dibujan como dibujan la presencia de un colaborador (consulta [focusTracker](./collaborative-editing.md#focustracker)), y un cliente que se une dibuja la presencia que la sala ya muestra.  
El elemento vuelve a enviar su foco y su selección cada 30 segundos, y su cuadro de arrastre cada segundo. Cada uno de esos reenvíos llega a los demás aunque repita el último, de modo que lo que un usuario aún mantiene nunca caduca.

Un cliente que se va queda olvidado al instante.  
Cuando Awareness descarta su estado, o su campo `erd` pasa a `null`, como lo establece [destroy](#destroy), o nombra a otro editor, la vinculación quita del elemento el cursor, el foco, la selección y el cuadro de arrastre de ese editor con [forgetPeer](./collaborative-editing.md#forgetpeer), en lugar de esperar a que caduquen.  
Los conserva mientras otro cliente siga mostrando el mismo editor, como hace un elemento vinculado de nuevo a otro `Y.Doc` de la sala.

## Ediciones sin conexión y reincorporaciones {#offline-edits-and-rejoins}

Un cliente desconectado del proveedor sigue editando. Sus ediciones esperan en su `Y.Doc` local, no en el almacén compartido, y llegan a los demás cuando el proveedor se reconecta y se sincroniza.

Cuando un compactador plegó ediciones que el cliente nunca aplicó mientras estaba ausente, la instantánea las contiene, así que al reconectarse el cliente se reabre sobre la instantánea con `rejoin('snapshot')`, después de enviar los arrastres, los cambios de tamaño y los cambios de color que su editor aún retenía. Un plegado de solo lo que el cliente había aplicado no reabre nada.  
Una reincorporación sobre una instantánea de la inicialización a la que se unió la vinculación reproduce todas las ediciones que la instantánea no contiene, entre ellas las propias de este cliente hechas mientras estaba ausente, de modo que no se pierde ninguna. Una reincorporación sobre otra inicialización no conserva nada, como describe [Inicializar una sala](#seeding-a-room).

Toda reincorporación borra el historial de deshacer, la selección y el foco, y cierra una vista de [Flow](../../guide/guides/visualization.md#flow-mode) abierta, un [dibujo de relación](../../guide/guides/editing-start.md#relationship-creation) y un editor de nota, de nombre de grupo de tablas o de celda, ya que pueden nombrar algo que la instantánea ya no contiene.  
Se descarta un nombre de grupo de tablas escrito y aún no confirmado. Una celda de nombre lógico que se cierra deriva el nombre físico de un nombre lógico que su lector escribió, donde el documento reabierto aún lo contiene, como lo hace cualquier cierre de esa celda. Esa derivación es una edición normal: la sala la registra, crea una entrada de deshacer y emite `change`; consulta [reseed](./collaborative-editing.md#reseed).  
Una vinculación que se había unido a la sala conserva lo que ve su lector: la posición de desplazamiento, el nivel de zoom y la pestaña, y los ajustes que cambió un lector de solo lectura.  
También conserva la vista de nombres y los ajustes de código (lenguaje del Generador de código, estilos de nombres y tipo de delimitador) que el lector mostraba por su cuenta, siempre que el [bloqueo](../../guide/guides/settings.md#lock) de cada uno estuviera activado antes de la reincorporación y siga activado después con el mismo valor bloqueado.  
Nada de lo que conserva llega a `value`, que informa de los ajustes del documento reabierto; consulta [reseed](./collaborative-editing.md#reseed) con `keepScreen`.  
La posición de desplazamiento y el nivel de zoom de un elemento que no se ha mostrado desde su última carga, y toda la pantalla de una vinculación que aún no se había unido, se abren donde la instantánea los sitúa.  
Un almacén par no tiene pantalla, así que su reincorporación no conserva ninguna.

## Editores de solo lectura {#read-only-editors}

Un elemento de [solo lectura](../erd-editor-element.md#readonly) vinculado a una sala no escribe nada en el historial de la sala: su almacén compartido no envía ningún cambio, solo sus rastreadores y el protocolo de intercambio de los registros, y la sala [no registra ninguno de los dos](#what-the-room-holds).  
Aun así aplica todas las ediciones que lleva la sala y, con [awareness](#awareness), el cursor, el foco, la selección y el cuadro de arrastre de su lector siguen llegando a los demás.  
Los ajustes que cambia su lector se quedan en su pantalla, como en cualquier editor de solo lectura.  
[seed](#seed) no se rechaza: un elemento de solo lectura inicializa una sala vacía con el documento que contiene, o con `value` si se le da.

## Qué contiene la sala {#what-the-room-holds}

La vinculación guarda el diagrama en dos nombres del `Y.Doc`: `erd:snapshot`, un mapa que contiene una instantánea del documento, y `erd:log`, un array con los lotes de acciones del editor posteriores a ella. Un proveedor de persistencia guarda ambos junto con el resto del `Y.Doc`.

La instantánea contiene el [runtimeValue](../erd-editor-element.md#runtimevalue) del documento, con las entidades eliminadas incluidas, sus registros de colaboración y su versión, y hasta dónde están plegadas en ella las ediciones de cada escritor. La escribe una inicialización, y también cada plegado de un compactador.  
Una inicialización o un plegado hechos con un `@dineug/erd-editor` anterior a la `5.1.1` escriben una instantánea sin ninguna nota en ningún grupo de tablas; consulta [Mezclar versiones](./collaborative-editing.md#mixing-releases).  
Cada entrada del registro de lotes es un lote tal como lo envió el editor, con su metainformación incluida, que lleva el id de editor y el apodo del remitente.  
Los desplazamientos, los zooms, los cambios de pestaña, la presencia y el protocolo de intercambio de los registros nunca se registran. Todos los demás cambios que envía el editor sí, entre ellos un cambio de vista de nombres hecho bajo su [bloqueo](../../guide/guides/settings.md#lock), que todos los demás clientes descartan.  
Un lenguaje del Generador de código, un estilo de nombres o un tipo de delimitador cambiado bajo su bloqueo nunca se envía, así que se queda en la pantalla de ese editor y nunca llega a la sala.

Un `Y.Doc` que devuelve un proveedor de persistencia abre el diagrama que contiene, como una vinculación abre cualquier `Y.Doc` que contenga una instantánea; consulta [Uso](#usage).

La instantánea no es un archivo: su valor en tiempo de ejecución contiene entidades eliminadas, que un archivo no debe contener.  
Para escribir el diagrama de la sala en el almacenamiento, guarda el [value](../erd-editor-element.md#value) de un elemento vinculado cada vez que se dispare su evento [change](../erd-editor-element.md#change).  
Guárdalo también una vez después de vincular, después de un [seed](#seed) con un `value` y en un listener de [rejoin](#onrejoin), ya que ninguna de esas cargas emite `change`.  
Un elemento de [solo lectura](../erd-editor-element.md#readonly) nunca emite `change`, así que guarda desde uno que no sea de solo lectura, o lee `value` de un almacén par vinculado, que aplica las ediciones de la sala a medida que llegan.  
Un [replicationStore](./remote-storage.md) no se puede vincular, ya que carece de los métodos que necesita una vinculación, y uno alimentado desde el almacén compartido de un elemento vinculado no recibe las ediciones de la sala; consulta [Replicar un editor en vivo](./remote-storage.md#replicating-a-live-editor).

La estructura es privada y puede cambiar con [ERD_YJS_FORMAT](#exports).  
Lee una sala solo mediante una vinculación y deja los nombres `erd:` y el campo de Awareness `erd` a su cargo.

## Compactar una sala {#compacting-a-room}

El historial de la sala crece con cada edición, y cada cliente que se une lo reproduce entero, hasta que algo lo pliega.  
`bindPeerStore` vincula un almacén par headless de `@dineug/erd-editor/peer.js` y devuelve un `ErdYjsPeerBinding`: los mismos [seed](#seed), [on](#erdyjsbinding) y [destroy](#destroy), con [compact](#compact).  
Un almacén par vinculado en un proceso de Node junto al servidor, un sidecar, pliega el historial en una instantánea de su propio diagrama.  
La vinculación de un elemento nunca pliega, y un almacén par vinculado sin `compactAfter` y sin llamar a `compact()` es un par headless normal.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

El almacén par sigue siendo tuyo: la vinculación nunca lo destruye. Su apodo es el que se le dio a `createPeerStore`, y `presence: false` evita que envíe un foco propio.

Un plegado escribe la instantánea a partir del valor en tiempo de ejecución, los registros y la versión del propio almacén par, y elimina las entradas del registro de lotes que cubre y todas las entradas de otra inicialización, todo en una transacción.  
Los clientes que aplicaron todo ven desaparecer las entradas; uno que no lo hizo se reabre sobre la instantánea (consulta [Ediciones sin conexión y reincorporaciones](#offline-edits-and-rejoins)).  
Cada plegado reescribe todo el diagrama en la instantánea, así que cada uno envía a todos los clientes una actualización del tamaño aproximado del JSON en tiempo de ejecución del diagrama y de sus registros juntos, por pocas entradas que tome. Define `compactAfter` lo bastante alto como para que las entradas que toma un plegado pesen más que una copia del diagrama.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Opción | Valor predeterminado | Descripción |
| --- | --- | --- |
| `awareness` | Ninguno | Muestra el almacén par en el Awareness de la sala, como hace [awareness](#awareness) con un elemento. Un compactador que pliega por su cuenta queda marcado ahí, de modo que los compactadores que se ven entre sí eligen a uno para plegar, y uno que no ve a ningún otro cliente no pliega nada por su cuenta; consulta [Un compactador por sala](#one-compactor-per-room). Sin él, un compactador pliega por su cuenta sin elección ni periodo de gracia. |
| `compactAfter` | Ninguno | Pliega por su cuenta en cuanto el registro contiene este número de entradas que tomaría un plegado. Sin él, o sin `synced`, solo pliega `compact()`, y el plegado que repone (consulta [Un compactador por sala](#one-compactor-per-room)). |
| `synced` | Ninguno | Una promesa que se resuelve cuando el proveedor se ha sincronizado. Ningún plegado se hace antes, `compact()` incluido. Sin ella, nada pliega por su cuenta y `compact()` pliega de inmediato. |
| `electionGraceMs` | `3000` | Con `awareness`, cuánto tiempo observa el compactador la sala antes de plegar por su cuenta, después de `synced` y de nuevo cada vez que aparecen otros clientes tras no haber ninguno. |
| `retainMs` | `600000` (diez minutos) | Cuánto tiempo se mantienen retenidas las entradas de un plegado para reponerlas (consulta [Un compactador por sala](#one-compactor-per-room)), contado desde la primera actualización que envía la sala después del plegado. |

Una opción no válida, o un `synced` que se rechaza, emite [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Pliega de inmediato, sin elección, periodo de gracia ni umbral.  
Primero incorpora la instantánea actual de la sala, una reincorporación incluida, y envía lo que su almacén par aún retiene.  
Responde `{ compacted: true, generation }`, donde `generation` cuenta los plegados de la instantánea: `0` para una inicialización, uno más por cada plegado.  
En caso contrario responde `{ compacted: false, reason }`:

- `'destroyed'` cuando la vinculación se destruyó o se detuvo, y en una vinculación [rechazada](#onerror) en el momento de vincular, incluso antes de que `synced` se resuelva;
- `'not-synced'` antes de que `synced` se resuelva;
- `'no-snapshot'` en una sala que ningún cliente ha inicializado.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Un compactador por sala {#one-compactor-per-room}

Ejecuta exactamente un compactador por sala, y arranca uno nuevo solo cuando el anterior se haya detenido. Nada lo impone.  
Entre los compactadores que se ven en Awareness, solo el que tiene el id de cliente de Yjs más pequeño pliega por su cuenta, y cuando se va, o su `synced` se rechaza, el siguiente toma el relevo de inmediato.  
Un compactador cuyo Awareness no muestra a ningún otro cliente, como cuando su propio socket se cierra y los descarta a todos, no pliega nada por su cuenta hasta que otros vuelven a aparecer y ha observado la sala durante `electionGraceMs`.

Dos compactadores desconectados entre sí, o un reinicio cuyo predecesor sigue en ejecución, pueden plegar cada uno por su lado.  
La sala conserva entonces una de las dos instantáneas, y el compactador cuya instantánea perdió repone lo que plegó y el ganador no contiene, mientras lo retenga: `retainMs`, y como máximo sus últimas 1000 entradas, por grande que sea cada una.  
Así que no se pierde nada cuando el compactador cuya instantánea pierde es el que se reconecta, siempre que no haya plegado más de 1000 entradas mientras estaban separados.  
Cuando es el que siguió en línea y su retención ha expirado, la instantánea y el historial de la sala carecen de lo que plegó hasta que vuelva a plegar. Un cliente que no recibió esas ediciones, o uno que se une entretanto, carece de ellas, y retiene las ediciones posteriores de cada escritor cuyas ediciones plegó el compactador. El siguiente plegado del compactador las devuelve todas, salvo que la instantánea ganadora contuviera ediciones que a él le faltaban, lo que lo reabre sobre esa instantánea y pierde para siempre lo que plegó.

Un compactador repone en un plegado propio, hecho una vez que se ha puesto al día con la instantánea ganadora, sin elección, periodo de gracia ni umbral, y todos los clientes se reabren sobre ese plegado con `rejoin('snapshot')`.  
Las ediciones que repone no llegan a ningún cliente aparte de ese plegado, así que un cliente en línea todo el tiempo termina igual que los demás y que uno que se une más tarde, incluso cuando una edición posterior de otro escritor se apoya en una de ellas, como el cambio de nombre de una tabla que añadió otro cliente.  
Cada reposición cuesta a todos los clientes esa reincorporación, con [lo que pierde una reincorporación](#offline-edits-and-rejoins). Cuando dos compactadores reponen a la vez, todos los clientes siguen terminando igual, aunque una edición puede quedar aplicada antes de aquella en la que se apoya.  
Una vinculación destruida o detenida antes de que ese plegado se ejecute, como cuando un listener de `rejoin` la destruye, repone, en cambio, las ediciones por sí solas. No se pierde ninguna, pero entonces un cliente en línea todo el tiempo puede aplicar una después de una edición de otro escritor que se apoya en ella, y terminar distinto de uno que se une más tarde.

## Límites {#limits}

- **El área visible se queda en cada pantalla.** Los desplazamientos, los zooms y los cambios de pestaña [nunca se registran](#what-the-room-holds), aunque una sesión conectada mediante `getSharedStore` los envía (allí tampoco mueven la vista ni la pestaña de ningún otro usuario). Cada lector conserva la suya, y la vinculación solo la muestra en su estado de Awareness, que por ahora nada lee. Con el [bloqueo](../../guide/guides/settings.md#lock) de `Viewport` o de `Canvas Type` desactivado, el `value` de cada cliente guarda la suya; con los bloqueos activados, que es como empieza un documento nuevo, todos los clientes guardan la bloqueada.
- **La instantánea crece una entrada por vinculación.** Guarda, para cada vinculación que haya escrito alguna vez en la sala, hasta dónde están plegadas sus ediciones, y nunca descarta ninguna. Una vinculación hecha de nuevo, o una que pasó a otra inicialización, cuenta como nueva, y también cada plegado que repone. Una entrada es un id de 32 caracteres y un número, así que diez mil sesiones de escritura añaden unos cientos de kilobytes a cada instantánea y a cada plegado.
- **Un hub y una sala no se retransmiten nada entre sí.** Un elemento vinculado a una sala y al [hub](../../mcp/live-and-headless.md#live) de un agente de programación, o a cualquier otro transporte mediante `getSharedStore()`, aplica las ediciones de ambos, pero ninguno oye las del otro, ya que un almacén compartido nunca reenvía lo que recibió.
- **Las altas hechas a la vez pueden quedar ordenadas de forma distinta.** Las tablas o las notas que dos clientes añaden a la vez pueden quedar en otro orden en el diagrama de cada cliente, como en una sesión conectada mediante `getSharedStore`; consulta [Ediciones simultáneas](./collaborative-editing.md#concurrent-edits).
- **Los colores y algunos otros cambios hechos a la vez pueden terminar distintos.** Un cambio de color se registra sin versión, y cada cliente le asigna la suya al aplicarlo. Por tanto, dos cambios de color de una misma tabla, nota o grupo de tablas hechos a la vez pueden dejar a los clientes, y a un cliente que se une más tarde y reproduce el registro, con colores distintos. Lo mismo ocurre con los demás cambios que cada cliente aplica en el orden en que los oye, como dos movimientos de columna dentro de una misma tabla o índice, o dos cambios de la base de datos; consulta [Ediciones simultáneas](./collaborative-editing.md#concurrent-edits).
- **Un cursor que se va espera al servidor.** La vinculación borra el cursor de un par en cuanto Awareness lo descarta. Un servidor que, cuando se cierra un socket, quita solo los estados de Awareness que ese socket añadió primero mantiene en las pantallas de los demás a un cliente que se había reconectado después de que se vaya, hasta que Awareness lo da por caducado, 30 segundos más tarde. Uno que quita todos los estados que escribió por última vez un socket, tanto una actualización como un alta, lo borra al instante.

## Exportaciones {#exports}

| Exportación | Descripción |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Vincula un elemento `<erd-editor>`; consulta [Uso](#usage). Devuelve un [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Vincula un almacén par de `@dineug/erd-editor/peer.js`; consulta [Compactar una sala](#compacting-a-room). Devuelve lo mismo con [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | La estructura del `Y.Doc` que escribe esta versión, `1`; una vinculación rechaza una sala escrita en otra. |

Tipos: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
