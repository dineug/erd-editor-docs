---
sidebar_position: 2
description: Replica un editor en vivo en un almacén headless fuera del hilo principal y serializa el documento para guardarlo.
---

# Almacenamiento remoto

Enviar todo el estado del editor con cada cambio es ineficiente.  
Para ese caso, el editor ofrece una API de replicación de datos en tiempo real.

## Instalación {#installation}

```sh
npm install @dineug/erd-editor
```

El almacén de replicación se encuentra en la subruta `@dineug/erd-editor/engine.js`, no en la raíz del paquete.  
Ese punto de entrada no toca el DOM, así que se ejecuta en un Web Worker o en cualquier otro lugar fuera del hilo principal.  
Importar la raíz del paquete, en cambio, registra el elemento personalizado `<erd-editor>`, que necesita un documento.

## Uso {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Replicar un editor en vivo {#replicating-a-live-editor}

Las acciones proceden del almacén compartido de un editor en vivo.  
Consulta [Edición colaborativa](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Solo el cambio cruza la frontera, nunca el documento entero.  
La réplica lo aplica y serializa el resultado en su propio lado.  
`change` te entrega ese resultado como `value`, y `changed` te indica cuándo merece la pena escribirlo.

Desde la `4.0.0`, inicializa la réplica a partir del `runtimeValue` del editor, como arriba, en lugar de a partir del archivo guardado o del `value` del editor.  
Al archivo le faltan las ediciones hechas desde que se guardó, y a `value`, las entidades eliminadas en la sesión.  
Una réplica inicializada sin una tabla eliminada la recupera sin su nombre ni sus columnas cuando un editor deshace la eliminación, y la guarda así.  
Desde la `4.2.0`, lo mismo ocurre con una palabra, un término o un dominio eliminado de una hoja de la pestaña [Diccionario](../../guide/guides/dictionary.md).  
Cuando un editor deshace la eliminación, una réplica inicializada sin la fila la vuelve a listar vacía y, como `value` deja fuera una fila vacía, la réplica guarda el documento sin ella.  
En el caso de un dominio, las columnas y los términos que lo vinculaban también siguen desvinculados en esa réplica, ya que nunca tuvo los vínculos y el deshacer no los envía.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mide una cadena en píxeles.  
El almacén no tiene DOM, así que no puede medir el texto por sí mismo, y recalcula el ancho de las columnas con esta función cada vez que cambia un nombre, un tipo de datos, un valor predeterminado o un comentario.  
Desde la `4.2.0`, eso incluye el [nombre lógico](../../guide/guides/logical-names.md) de una tabla o columna.  
Mide la celda Dominio de una columna, que muestra el nombre del dominio que vincula la columna, cada vez que la columna se vincula a un dominio o se desvincula y cada vez que ese dominio se añade, cambia de nombre o se elimina.  
También vuelve a medir todas las tablas y columnas cada vez que [setInitialValue](#setinitialvalue) carga un documento.  
Desde la `4.0.0`, los anchos se conservan solo en [runtimeValue](#runtimevalue-getter), nunca en `value`.  
Así, un documento guardado con esta versión vuelve a dar el mismo `value` byte a byte al leerse, independientemente de dónde se guardara y de cómo se midiera allí el texto.

Mide como lo hace el editor: `400 12px` en la pila de fuentes del editor, redondeando y sumando 2 px de relleno.  
De lo contrario, los anchos de `runtimeValue` se alejan de los que aparecen en pantalla.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` es el cálculo de reserva cuando no hay ningún canvas disponible.  
Basta para un almacén cuyo documento solo se guarda y nunca se renderiza.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializa el estado actual del editor.  
Devuelve una cadena JSON lista para guardarse tal cual, no un objeto ya analizado.

```js
const data = replicationStore.value;
```

Desde la `4.0.0`, `value` es la forma de almacenamiento: el documento tal como lo contiene un archivo, el mismo texto que devuelve el [value](../erd-editor-element.md#value) del elemento.  
Contiene solo las entidades activas, en un orden fijo, sin las eliminadas, sin el orden de apilamiento y sin nada que una carga vuelva a calcular, como los anchos que mide [toWidth](#towidth).  
Desde la `4.2.0`, también contiene los nombres lógicos, si cada nombre se derivó de los diccionarios, los vínculos con dominios y las palabras, los términos y los dominios de la pestaña [Diccionario](../../guide/guides/dictionary.md).  
Desde la `4.2.0`, también deja fuera cada campo de texto vacío de una entidad, cada lista de `doc` y cada colección que no contiene nada, y el propio objeto `collections` cuando todas las colecciones están vacías.  
Tiene una sangría de dos espacios, con cada fila de los diccionarios en una línea propia, y termina con un salto de línea, así que el mismo documento siempre da los mismos bytes.  
Consulta [Forma de almacenamiento y valor en tiempo de ejecución](./schema.md#storage-form-and-runtime-value) para ver lo que contiene.

Cada ajuste cuyo [bloqueo](../../guide/guides/settings.md#lock) está activado se escribe con el valor en que se bloqueó, y cualquier otro ajuste, tal como está.  
El bloqueo `Viewport` abarca a la vez el origen de la vista y el nivel de zoom, y la pestaña, el lenguaje del Generador de código, los dos estilos de nombres y el tipo de delimitador tienen cada uno su propio bloqueo.  
Desde la `4.2.0`, también lo tiene la [vista de nombres](../../guide/guides/logical-names.md#name-view), cuyo bloqueo `Name View` está activado en un documento nuevo.  
Los bloqueos sustituyen al `ignoreSaveSettings` del documento, que desde la `4.0.0` ni se lee ni se escribe.  
Antes de la `4.0.0`, `value` era el documento entero tal como lo tenía el almacén, con los bits de desplazamiento y de zoom de ese campo aplicados.

### runtimeValue getter {#runtimevalue-getter}

Desde la `4.0.0`, serializa el documento tal como lo tiene la réplica, incluidas las entidades eliminadas y todo lo que calcula una carga.  
Aquí también cada ajuste bloqueado se escribe con su valor bloqueado.

```js
const snapshot = replicationStore.runtimeValue;
```

Úsalo para inicializar un editor u otro almacén que se una más tarde, mediante su `setInitialValue`; consulta [Edición colaborativa](./collaborative-editing.md).  
Nunca lo guardes como el archivo: lleva las entidades eliminadas y el [JSON Schema](./schema.md#json-schema) publicado lo rechaza.  
Esas entidades eliminadas son las que permiten que la acción de deshacer una eliminación, enviada más tarde, devuelva la entidad completa al almacén inicializado a partir de él.  
Se conservan hasta la próxima vez que el documento se abra desde su archivo, cuya forma las deja fuera.

### setInitialValue {#setinitialvalue}

Carga el estado del editor guardado previamente.

```js
replicationStore.setInitialValue('json...');
```

Acepta la forma de almacenamiento, un valor en tiempo de ejecución o un documento guardado por una versión anterior, incluido un documento v2.  
Una cadena en blanco, o cualquier cosa que no sea una cadena, carga un documento nuevo y vacío en lugar de lanzar un error.  
Un almacén al que nunca se le ha dado un valor empieza como ese mismo documento nuevo.  
Desde la `4.0.0`, ese documento tiene todos los [bloqueos](../../guide/guides/settings.md#lock) activados, así que su `value` conserva la vista, la pestaña, el lenguaje del Generador de código, los estilos de nombres y el tipo de delimitador con los que empezó mientras los editores que replica desplazan la vista, hacen zoom, cambian de pestaña o modifican esos ajustes. En la `3.10.0`, no guardaba ni el desplazamiento ni el zoom, y antes guardaba ambos.  
Desde la `4.2.0`, también conserva su vista de nombres, `Physical Names`, mientras los editores cambian la suya.  
Un documento guardado conserva los bloqueos que indica.  
Uno que no indica ninguno, es decir, cualquier documento guardado antes de la `4.0.0`, incluido un documento v2, se carga con todos los bloqueos activados: el origen de la vista en `0, 0`, el nivel de zoom en `1` y la pestaña en ERD, independientemente de lo que guardara, y el lenguaje del Generador de código, los estilos de nombres y el tipo de delimitador tal como los guardó.  
Un documento guardado antes de la `4.2.0` no indica ningún bloqueo `Name View`, así que se carga con ese bloqueo activado y en `Physical Names`, incluso uno guardado con todos los demás bloqueos desactivados.  
Desde la `4.0.0`, `setInitialValue` también descarta los registros de colaboración que se tenían para el documento anterior, como hace el [setInitialValue](../erd-editor-element.md#setinitialvalue) del elemento.  
Un texto que no es JSON, como un archivo que ha quedado con marcadores de conflicto de fusión, tampoco lanza un error: el error de análisis solo se registra en la consola, el documento se vacía y los ajustes se quedan como estaban.

Desde la `4.0.0`, la carga no ejecuta ninguna recolección de elementos no utilizados, así que las entidades eliminadas se quedan en [runtimeValue](#runtimevalue-getter).  
Antes, descartaba las entidades que ya no aparecían en `doc` y que llevaban cuatro días o más sin modificarse.

Las reescrituras de la carga terminan antes de que `setInitialValue` devuelva el control: las marcas de clave de las columnas, leídas de las opciones de cada columna y de las relaciones; todos los anchos de tablas y columnas, medidos de nuevo con `toWidth`; los puntos donde cada conector se une a sus tablas; y el indicador de relación identificadora de cada relación y el símbolo en su extremo de la tabla padre.  
Ninguna forma parte de `value`, pero `replicationStore.runtimeValue`, leído justo después de la llamada, ya las contiene todas.  
Una acción que llega justo después de la carga, como un desplazamiento que se vuelve a reproducir, se mide respecto al documento cargado, así que la propia carga nunca se notifica como [`changed`](#onchange).

Ni la carga ni ninguna de estas reescrituras emite `change`.  
Lee tú mismo `replicationStore.value` en cuanto `setInitialValue` devuelva el control si quieres volver a escribir el documento cargado en la forma de almacenamiento.

### on@change {#onchange}

Se suscribe a los cambios en el estado del editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` se emite con un debounce de 200 ms, así que una ráfaga de acciones llega como una sola notificación.  
Solo se dispara con acciones de un tipo que puede cambiar el documento, además del `settings.changeIgnoreSaveSettings` que aún puede enviar un editor más antiguo (consulta [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Ni una acción de presencia retransmitida ni `editor.mergeLWW` lo activan nunca.  
Llama a la función devuelta para cancelar la suscripción.

Desde la `3.10.0`, el listener recibe un `ReplicationChange`, un tipo que `@dineug/erd-editor/engine.js` exporta junto a `ReplicationStore`.  
Antes de la `3.10.0`, no recibía nada, y un listener que ignora el argumento sigue funcionando.  
`value` es el documento serializado en la forma de almacenamiento, la misma cadena que devuelve `replicationStore.value` en ese momento, así que no hace falta volver a serializarlo.  
`changed` es `false` cuando las acciones desde el `change` anterior, o desde la carga, han dejado `value` byte a byte como estaba.

Un cambio que un [bloqueo](../../guide/guides/settings.md#lock) deja fuera de `value` sigue disparando `change`, con `changed` en `false`, así que escribe solo cuando `changed` sea `true`.  
Es decir, un desplazamiento o un zoom mientras `Viewport` está bloqueado, un cambio de pestaña mientras `Canvas Type` está bloqueado y un cambio del lenguaje del Generador de código, de un estilo de nombres o del tipo de delimitador mientras su propio bloqueo está activado.  
Desde la `4.2.0`, también lo es un cambio de la vista de nombres mientras `Name View` está bloqueado: el editor lo sigue enviando, pero la réplica lo descarta, como hacen los demás editores.  
Un cambio de la vista de nombres hecho en un editor de solo lectura se descarta del mismo modo, sea cual sea su bloqueo.  
El evento [change](../erd-editor-element.md#change) del elemento deja fuera un cambio así, pero la réplica lo sigue notificando.  
Todos los bloqueos están activados en un documento nuevo y en uno guardado antes de la `4.0.0`, y `Name View` está bloqueado en cualquier documento guardado antes de la `4.2.0`.  
Con `Viewport` desbloqueado, un desplazamiento o un zoom cambia `value`; con `Canvas Type` desbloqueado, también lo cambia abrir otra de las pestañas del editor, y con `Name View` desbloqueado, también lo hace un cambio de la vista de nombres desde un editor que no es de solo lectura.  
Activar o desactivar un bloqueo también cambia `value`.

Desde la `4.0.0`, `changed` compara la forma de almacenamiento, que no contiene ni las entidades eliminadas ni el orden de apilamiento.  
Así, una tabla añadida y eliminada de nuevo dentro de un mismo `change`, una edición que recae en una entidad que otro colaborador eliminó y una carga retransmitida que solo cambia el orden de apilamiento dan también `changed` en `false`.  
Desde la `4.2.0`, lo mismo ocurre con una fila que se añade a una hoja de la pestaña Diccionario y se deja vacía, porque la forma de almacenamiento deja fuera una fila que no contiene nada.

`changed` nunca compara con tu archivo guardado, que ya puede diferir de `value` en cuanto se carga: es el caso de un archivo guardado por una versión anterior, incluido un archivo v2, y también de un archivo que empieza con una marca de orden de bytes y de uno editado a mano.  
Desde la `4.2.0`, eso incluye un archivo que guardó la `4.0.0` o la `4.1.0`, porque `value` deja fuera los campos de texto vacíos de sus entidades y las listas de `doc` y las colecciones vacías que contiene un archivo así.  
Comparar bytes con un archivo así contaría como edición incluso un desplazamiento que un bloqueo deja fuera.  
El primer `change` con `changed` en `true` devuelve un archivo así en la forma de almacenamiento, por lo que escribirlo reescribe el archivo una sola vez.  
Un archivo guardado con esta versión no difiere, dondequiera que se guardara, como explica [toWidth](#towidth).  
Si `setInitialValue` llega mientras aún hay un `change` pendiente, y no se despacha nada antes de que deba emitirse, ese `change` llega igualmente, con el `value` cargado y `changed` en `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica al replicationStore los cambios de los editores remotos.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` aplaza el lote a una microtarea, y `dispatchSync` lo aplica de inmediato.

Puedes pasarle el flujo de un almacén compartido sin filtrar.  
Ambos métodos conservan solo las acciones de un tipo que puede cambiar el documento, además de las dos que se describen al final de esta sección, y descartan el resto, así que la presencia que transmite una sesión colaborativa —el cursor del ratón, el foco, la selección y el cuadro de arrastre de cada usuario— pasa sin ningún efecto.

Desde la `3.10.0`, las acciones conservadas incluyen `relationship.changeOnDelete` y `relationship.changeOnUpdate`, y `relationship.add` lleva `onDelete` y `onUpdate`.  
Un almacén de una versión anterior descarta esas acciones e ignora esos campos, así que pierde las acciones [ON DELETE y ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de una relación.

Desde la `4.0.0`, las acciones conservadas incluyen además `table.changeGroup`, siete de las ocho acciones de `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` y `tableGroup.changeColor`, todas salvo el cambio de apilamiento `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` y `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` ya no existe, así que ambos métodos la descartan.  
Un almacén de una versión anterior descarta las acciones nuevas, así que pierde los [grupos de tablas](../../guide/guides/table-groups.md), los [bloqueos](../../guide/guides/settings.md#lock), los scripts de [Esquema SQL](../../guide/guides/schema-sql.md) y las columnas que [Asignar columnas](../../guide/guides/relationship-editing.md#map-columns) da a una relación existente.  
Ejecuta la réplica en la misma versión que los editores o en una más reciente.

La `4.1.0` no añade ningún tipo de acción y deja `@dineug/erd-editor/engine.js` como estaba, así que una réplica `4.0.0` conserva todos los cambios que envía un editor `4.1.0`, igual que una réplica `4.1.0`.  
Desde la `4.1.0`, `Replace` y `Replace All` de [Buscar y reemplazar](../../guide/guides/find-and-replace.md#replacing) también cambian el nombre de índices y grupos de tablas, mediante las acciones `index.changeName` y `tableGroup.changeName`, que una réplica `4.0.0` ya conserva.  
El estado propio del [explorador](../../guide/guides/explorer.md) nunca se envía, y un cambio de pestaña o un desplazamiento que este provoque llega como cualquier otro cambio de pestaña o desplazamiento; consulta [Edición colaborativa](./collaborative-editing.md).

Desde la `4.2.0`, las acciones conservadas incluyen además `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode`, así como `dictionary.add`, `dictionary.update` y `dictionary.remove`, que llevan cada edición, ordenación e importación CSV en las hojas de la pestaña [Diccionario](../../guide/guides/dictionary.md).  
De los cambios de la vista de nombres, una réplica aplica solo los que hace un editor que no es de solo lectura mientras `Name View` está desbloqueado, y descarta el resto (consulta [on@change](#onchange)).  
Un almacén de una versión anterior descarta todas estas acciones, así que pierde los [nombres lógicos](../../guide/guides/logical-names.md), los vínculos con dominios, si cada nombre procede de los diccionarios, las palabras, los términos y los dominios, y la vista de nombres.  
Un editor anterior a la `4.2.0` en la sesión aún puede quitarle parte de esto a una réplica `4.2.0`.  
Un `Import` de Esquema SQL, GraphQL, DBML o AML en ese editor, aunque no un `Import and Add`, vacía las palabras, los términos y los dominios de la réplica.  
Su deshacer de una carga, un `Import` o `clear()` carga su propia copia del documento en la réplica, sin nombres lógicos, vínculos con dominios ni diccionarios; consulta [Mezclar versiones](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` exporta los mismos `createReplicationStore`, `ReplicationStore` y `ReplicationChange` que antes, y `createReplicationStore` admite el mismo contexto.

Desde la `4.0.0`, ambos métodos aplican también `editor.mergeLWW`, que lleva los registros de colaboración con los que responde un editor cuando otro se une a la sesión, así que la réplica resuelve las ediciones simultáneas igual que los editores.  
No cambia ningún byte de `value` ni dispara ningún `change`.  
`settings.changeIgnoreSaveSettings`, que aún puede enviar un editor publicado antes de la `4.0.0`, se conserva pero no cambia nada: dispara `change` con `changed` en `false`.

### destroy {#destroy}

Destruye por completo la instancia de replicationStore.

```js
replicationStore.destroy();
```

Después, el almacén deja de emitir `change` e ignora los despachos posteriores.  
El documento se queda congelado en su último valor en lugar de lanzar un error.  
Crea un almacén nuevo para volver a empezar.
