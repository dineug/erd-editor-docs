---
sidebar_position: 2
description: Einen laufenden Editor in einen Headless-Store außerhalb des Hauptthreads replizieren und das Dokument zur Speicherung serialisieren.
---

# Remote-Speicherung

Bei jeder Änderung den gesamten Zustand des Editors zu senden, ist ineffizient.  
Für diesen Fall stellt der Editor eine API zur Datenreplikation in Echtzeit bereit.

## Installation {#installation}

```sh
npm install @dineug/erd-editor
```

Der Replikations-Store liegt unter dem Unterpfad `@dineug/erd-editor/engine.js`, nicht im Paketstamm.  
Dieser Einstiegspunkt greift nicht auf das DOM zu, daher läuft er in einem Web Worker oder an jeder anderen Stelle außerhalb des Hauptthreads.  
Ein Import des Paketstamms registriert dagegen das Custom Element `<erd-editor>`, das ein Dokument benötigt.

## Verwendung {#usage}

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

## Einen laufenden Editor replizieren {#replicating-a-live-editor}

Die Aktionen stammen aus dem gemeinsamen Store eines laufenden Editors.  
Siehe [Gemeinsame Bearbeitung](./collaborative-editing.md).

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

Nur die Änderung überschreitet die Grenze, nie das ganze Dokument.  
Das Replikat wendet sie an und serialisiert das Ergebnis auf seiner eigenen Seite.  
Das Ereignis `change` übergibt Ihnen dieses Ergebnis als `value`, und `changed` zeigt Ihnen an, wann sich das Schreiben lohnt.

Seit `4.0.0` initialisieren Sie das Replikat wie oben mit dem `runtimeValue` des Editors, nicht mit der gespeicherten Datei oder dem `value` des Editors.  
In der Datei fehlen die seit dem Speichern vorgenommenen Änderungen, und in `value` fehlen die in der Sitzung entfernten Entitäten.  
Ein Replikat, das ohne eine entfernte Tabelle initialisiert wurde, stellt diese ohne Namen und Spalten wieder her, wenn ein Editor das Entfernen rückgängig macht, und speichert sie so.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Misst eine Zeichenkette in Pixeln.  
Der Store hat kein DOM, kann Text also nicht selbst messen und berechnet die Spaltenbreiten jedes Mal mit dieser Funktion neu, wenn sich ein Name, ein Datentyp, ein Standardwert oder ein Kommentar ändert.  
Außerdem misst er jede Tabelle und jede Spalte erneut, sobald [setInitialValue](#setinitialvalue) ein Dokument lädt.  
Seit `4.0.0` werden die Breiten nur in [runtimeValue](#runtimevalue-getter) gehalten, nie in `value`.  
Daher ergibt ein Dokument, das diese Version gespeichert hat, beim Laden Byte für Byte wieder denselben Wert von `value`, wo auch immer es gespeichert wurde und wie auch immer Text dort gemessen wurde.

Messen Sie so wie der Editor – `400 12px` im Font-Stack des Editors, gerundet, plus 2 px Innenabstand.  
Andernfalls weichen die Breiten in `runtimeValue` von denen auf dem Bildschirm ab.

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

`text.length * 10` dient als Fallback, wenn kein Canvas verfügbar ist.  
Er genügt für einen Store, dessen Dokument nur gespeichert und nie gerendert wird.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serialisiert den aktuellen Zustand des Editors.  
Gibt eine JSON-Zeichenkette zurück, die sich unverändert speichern lässt – kein geparstes Objekt.

```js
const data = replicationStore.value;
```

Seit `4.0.0` ist `value` die Speicherform: das Dokument so, wie eine Datei es enthält, derselbe Text, den die Eigenschaft [value](../erd-editor-element.md#value) des Elements zurückgibt.  
Die Speicherform enthält nur die nicht entfernten Entitäten in fester Reihenfolge, ohne die entfernten, ohne die Stapelreihenfolge und ohne alles, was ein Ladevorgang erneut ermittelt, etwa die Breiten, die [toWidth](#towidth) misst.  
Sie ist mit zwei Leerzeichen eingerückt und endet mit einem Zeilenumbruch, sodass dasselbe Dokument immer dieselben Bytes ergibt.  
Zu ihrem Inhalt siehe [Speicherform und Laufzeitwert](./schema.md#storage-form-and-runtime-value).

Jede Einstellung, deren [Sperre](../../guide/guides/settings.md#lock) eingeschaltet ist, wird mit dem Wert geschrieben, mit dem sie gesperrt wurde, jede andere Einstellung so, wie sie gerade steht.  
Die Sperre `Viewport` umfasst den Ursprung der Ansicht und die Zoomstufe gemeinsam, und die Registerkarte, die Sprache des Codegenerators, beide Schreibweisen und der Begrenzertyp haben jeweils eine eigene Sperre.  
Die Sperren ersetzen das Feld `ignoreSaveSettings` des Dokuments, das seit `4.0.0` weder gelesen noch geschrieben wird.  
Vor `4.0.0` war `value` das ganze Dokument, wie der Store es hielt, wobei die Scroll- und Zoom-Bits dieses Felds angewandt wurden.

### runtimeValue getter {#runtimevalue-getter}

Serialisiert seit `4.0.0` das Dokument so, wie das Replikat es hält, samt den entfernten Entitäten und allem, was ein Ladevorgang ermittelt.  
Auch hier wird jede gesperrte Einstellung mit ihrem gesperrten Wert geschrieben.

```js
const snapshot = replicationStore.runtimeValue;
```

Verwenden Sie diesen Wert, um einen Editor oder einen weiteren Store, der später beitritt, über dessen Methode `setInitialValue` zu initialisieren; siehe [Gemeinsame Bearbeitung](./collaborative-editing.md).  
Speichern Sie ihn nie als Datei: Er enthält die entfernten Entitäten, und das veröffentlichte [JSON Schema](./schema.md#json-schema) lehnt ihn ab.  
Gerade diese entfernten Entitäten ermöglichen es, dass ein später gesendetes Rückgängigmachen einer Entfernung die Entität in dem damit initialisierten Store vollständig wiederherstellt.  
Sie bleiben erhalten, bis das Dokument das nächste Mal aus seiner Datei geöffnet wird, deren Form sie nicht enthält.

### setInitialValue {#setinitialvalue}

Lädt den zuvor gespeicherten Zustand des Editors.

```js
replicationStore.setInitialValue('json...');
```

Die Methode akzeptiert die Speicherform, einen Laufzeitwert oder ein Dokument, das eine frühere Version gespeichert hat, auch ein v2-Dokument.  
Eine leere Zeichenkette oder alles, was keine Zeichenkette ist, lädt ein neues, leeres Dokument, statt einen Fehler auszulösen.  
Ein Store, dem nie ein Wert übergeben wurde, beginnt mit demselben neuen Dokument.  
Seit `4.0.0` sind in diesem Dokument alle [Sperren](../../guide/guides/settings.md#lock) eingeschaltet, sodass es in `value` die Ansicht, die Registerkarte, die Sprache des Codegenerators, die Schreibweisen und den Begrenzertyp behält, mit denen es begonnen hat, während die Editoren, die der Store repliziert, scrollen, zoomen, die Registerkarte wechseln oder diese Einstellungen ändern. In `3.10.0` speicherte es weder die Scrollposition noch den Zoom, und davor speicherte es beides.  
Ein gespeichertes Dokument behält die Sperren, die es angibt.  
Ein Dokument, das keine angibt, was auf jedes vor `4.0.0` gespeicherte Dokument zutrifft, auch auf ein v2-Dokument, wird mit allen eingeschalteten Sperren geladen: mit dem Ursprung der Ansicht bei `0, 0`, der Zoomstufe `1` und der Registerkarte ERD, gleich, was es gespeichert hat, sowie mit der Sprache des Codegenerators, den Schreibweisen und dem Begrenzertyp so, wie es sie gespeichert hat.  
Seit `4.0.0` verwirft `setInitialValue` außerdem die Kollaborationsregister, die für das vorherige Dokument gehalten wurden, wie es die Methode [setInitialValue](../erd-editor-element.md#setinitialvalue) des Elements tut.  
Auch Text, der kein JSON ist, etwa eine Datei mit zurückgebliebenen Merge-Konfliktmarkierungen, löst keinen Fehler aus: Der Parse-Fehler wird nur in der Konsole protokolliert, das Dokument wird geleert, und die Einstellungen bleiben, wie sie waren.

Seit `4.0.0` führt das Laden keine Garbage Collection aus, sodass entfernte Entitäten in [runtimeValue](#runtimevalue-getter) erhalten bleiben.  
Vorher verwarf es die Entitäten, die nicht mehr in `doc` vorkamen und seit vier oder mehr Tagen nicht geändert worden waren.

Die Neuberechnungen beim Laden sind abgeschlossen, bevor `setInitialValue` zurückkehrt: die Schlüsselmarkierungen der Spalten, abgeleitet aus den Optionen jeder Spalte und aus den Beziehungen; jede Tabellen- und Spaltenbreite, erneut mit `toWidth` gemessen; die Punkte, an denen jede Verbindungslinie auf ihre Tabellen trifft; und bei jeder Beziehung das Kennzeichen, ob sie identifizierend ist, sowie das Symbol an ihrem Ende an der Elterntabelle.  
Keine davon ist Teil von `value`, aber `replicationStore.runtimeValue` enthält sie bereits alle, wenn es direkt nach dem Aufruf gelesen wird.  
Eine Aktion, die direkt nach dem Laden eintrifft, etwa ein erneut abgespieltes Scrollen, wird mit dem geladenen Dokument verglichen, sodass das Laden selbst nie als [`changed`](#onchange) gemeldet wird.

Weder das Laden noch eine dieser Neuberechnungen löst das Ereignis `change` aus.  
Lesen Sie `replicationStore.value` selbst, sobald `setInitialValue` zurückkehrt, wenn Sie das geladene Dokument in der Speicherform zurückschreiben möchten.

### on@change {#onchange}

Abonniert Änderungen am Zustand des Editors.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

Das Ereignis `change` wird um 200 ms entprellt, sodass eine schnelle Folge von Aktionen als eine einzige Benachrichtigung ankommt.  
Es wird nur bei Aktionen ausgelöst, deren Art das Dokument ändern kann, sowie bei der Aktion `settings.changeIgnoreSaveSettings`, die ein älterer Editor möglicherweise noch sendet (siehe [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Eine weitergeleitete Präsenzaktion oder `editor.mergeLWW` weckt es nie.  
Rufen Sie die zurückgegebene Funktion auf, um das Abonnement zu beenden.

Seit `3.10.0` erhält der Listener einen Wert vom Typ `ReplicationChange`, den `@dineug/erd-editor/engine.js` neben `ReplicationStore` exportiert.  
Vor `3.10.0` erhielt er nichts, und ein Listener, der das Argument ignoriert, funktioniert weiterhin.  
`value` ist das serialisierte Dokument in der Speicherform, dieselbe Zeichenkette, die `replicationStore.value` in diesem Moment zurückgibt, sodass Sie es nicht erneut serialisieren müssen.  
`changed` ist `false`, wenn die Aktionen seit dem vorherigen Ereignis `change` oder seit dem Laden den Wert von `value` Byte für Byte unverändert gelassen haben.

Eine Änderung, die eine [Sperre](../../guide/guides/settings.md#lock) aus `value` heraushält, löst trotzdem das Ereignis `change` aus, wobei `changed` auf `false` gesetzt ist; schreiben Sie daher nur, wenn `changed` den Wert `true` hat.  
Das sind ein Scrollen oder Zoomen, während `Viewport` gesperrt ist, ein Wechsel der Registerkarte, während `Canvas Type` gesperrt ist, sowie eine Änderung der Sprache des Codegenerators, einer Schreibweise oder des Begrenzertyps, während die jeweils eigene Sperre eingeschaltet ist.  
Das Ereignis [change](../erd-editor-element.md#change) des Elements lässt eine solche Änderung aus, das Replikat meldet sie aber trotzdem.  
In einem neuen Dokument und in einem vor `4.0.0` gespeicherten ist jede Sperre eingeschaltet.  
Ist `Viewport` entsperrt, ändert ein Scrollen oder Zoomen den Wert von `value`, und ist `Canvas Type` entsperrt, gilt das auch für das Öffnen einer anderen Registerkarte des Editors.  
Auch das Ein- oder Ausschalten einer Sperre ändert `value`.

Seit `4.0.0` vergleicht `changed` die Speicherform, die weder die entfernten Entitäten noch die Stapelreihenfolge enthält.  
Daher führen eine Tabelle, die innerhalb eines einzigen Ereignisses `change` hinzugefügt und wieder entfernt wird, eine Änderung, die eine von einem anderen Mitbearbeiter entfernte Entität trifft, und ein weitergeleitetes Laden, das nur die Stapelreihenfolge ändert, ebenfalls alle zu `changed` mit dem Wert `false`.

`changed` vergleicht nie mit Ihrer gespeicherten Datei, die sich bereits von `value` unterscheiden kann, sobald sie geladen ist: Das gilt für eine Datei, die eine frühere Version gespeichert hat, auch für eine v2-Datei, ebenso für eine Datei, die mit einer Byte-Order-Mark beginnt, und für eine von Hand bearbeitete.  
Ein Byte-Vergleich mit einer solchen Datei würde sogar ein Scrollen, das eine Sperre heraushält, als Änderung zählen.  
Das erste Ereignis `change`, bei dem `changed` auf `true` gesetzt ist, liefert eine solche Datei in der Speicherform zurück, sodass sie beim Schreiben einmalig umgeschrieben wird.  
Eine Datei, die diese Version gespeichert hat, unterscheidet sich nicht, wo auch immer sie gespeichert wurde, wie unter [toWidth](#towidth) erklärt.  
Wird `setInitialValue` aufgerufen, während noch ein Ereignis `change` aussteht, und wird vor dessen Fälligkeit keine Aktion übergeben, trifft dieses Ereignis `change` trotzdem ein, mit dem geladenen `value` und mit `changed` auf `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Wendet Änderungen entfernter Editoren auf den replicationStore an.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` verschiebt die Anwendung in einen Microtask, und `dispatchSync` wendet den Stapel sofort an.

Sie können den Stream eines gemeinsamen Stores ungefiltert übergeben.  
Beide Methoden behalten nur die Aktionen, deren Art das Dokument ändern kann, sowie die beiden am Ende dieses Abschnitts beschriebenen, und verwerfen den Rest, sodass die Präsenz, die eine gemeinsame Sitzung überträgt – Mauszeiger, Fokus, Auswahl und Auswahlrahmen jedes Benutzers –, wirkungslos durchläuft.

Seit `3.10.0` gehören `relationship.changeOnDelete` und `relationship.changeOnUpdate` zu den behaltenen Aktionen, und `relationship.add` überträgt `onDelete` und `onUpdate`.  
Ein Store aus einer früheren Version verwirft diese Aktionen und ignoriert diese Felder, sodass ihm die Aktionen [ON DELETE und ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) einer Beziehung verloren gehen.

Seit `4.0.0` gehören außerdem `table.changeGroup`, sieben der acht Aktionen unter `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` und `tableGroup.changeColor`, alle außer der Änderung der Stapelreihenfolge `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` und `settings.changeDDLScript` zu den behaltenen Aktionen.  
`settings.changeRelationshipOptimization` existiert nicht mehr, daher verwerfen beide Methoden diese Aktion.  
Ein Store aus einer früheren Version verwirft die neuen Aktionen, sodass ihm [Tabellengruppen](../../guide/guides/table-groups.md), die [Sperren](../../guide/guides/settings.md#lock), die Skripte von [Schema SQL](../../guide/guides/schema-sql.md) und die Spalten verloren gehen, die der Dialog [Spalten zuordnen](../../guide/guides/relationship-editing.md#map-columns) einer bestehenden Beziehung zuweist.  
Betreiben Sie das Replikat mit derselben Version wie die Editoren oder einer neueren.

Version `4.1.0` fügt keinen Aktionstyp hinzu und lässt `@dineug/erd-editor/engine.js` unverändert, sodass ein Replikat der Version `4.0.0` jede Änderung behält, die ein Editor der Version `4.1.0` sendet, genau wie ein Replikat der Version `4.1.0`.  
Seit `4.1.0` benennen `Replace` und `Replace All` in [Suchen und Ersetzen](../../guide/guides/find-and-replace.md#replacing) auch Indizes und Tabellengruppen um, und zwar über die Aktionen `index.changeName` und `tableGroup.changeName`, die ein Replikat der Version `4.0.0` bereits behält.  
Der eigene Zustand des [Explorers](../../guide/guides/explorer.md) wird nie gesendet, und ein Registerkartenwechsel oder ein Scrollen, das er auslöst, kommt an wie jeder andere Registerkartenwechsel und jedes andere Scrollen; siehe [Gemeinsame Bearbeitung](./collaborative-editing.md).

Seit `4.0.0` wenden beide Methoden außerdem die Aktion `editor.mergeLWW` an, die die Kollaborationsregister überträgt, mit denen ein Editor antwortet, wenn ein anderer der Sitzung beitritt, sodass das Replikat gleichzeitige Änderungen so abgleicht wie die Editoren.  
Sie ändert kein Byte von `value` und löst kein Ereignis `change` aus.  
Die Aktion `settings.changeIgnoreSaveSettings`, die ein vor `4.0.0` veröffentlichter Editor möglicherweise noch sendet, wird behalten, ändert aber nichts: Sie löst das Ereignis `change` aus, wobei `changed` auf `false` gesetzt ist.

### destroy {#destroy}

Zerstört die replicationStore-Instanz vollständig.

```js
replicationStore.destroy();
```

Danach löst der Store kein Ereignis `change` mehr aus und ignoriert weitere Dispatch-Aufrufe.  
Das Dokument bleibt auf seinem letzten Wert stehen, statt einen Fehler auszulösen.  
Erstellen Sie einen neuen Store, um neu zu beginnen.
