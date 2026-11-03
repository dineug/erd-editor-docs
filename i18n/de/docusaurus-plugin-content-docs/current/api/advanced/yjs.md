---
sidebar_position: 2
description: Ein Element <erd-editor> oder einen Headless-Peer-Store mit @dineug/erd-editor-yjs über ein Yjs-Dokument synchron halten, einen Raum initialisieren, die Präsenz über Awareness anzeigen, offline weiterbearbeiten und den Verlauf des Raums mit einem Verdichter-Sidecar zusammenführen.
---

# Yjs

`@dineug/erd-editor-yjs` hält Diagramme über ein [Yjs](https://github.com/yjs/yjs)-Dokument synchron. Es ist ein eigenes Paket, das zusammen mit `@dineug/erd-editor` `5.1.0` erstmals als `0.1.0` erschienen ist.  
`bindErdEditor` bindet ein Element `<erd-editor>` und `bindPeerStore` einen Headless-Peer-Store aus `@dineug/erd-editor/peer.js` an ein `Y.Doc`.  
Der Provider, der das `Y.Doc` transportiert, transportiert auch das Diagramm: ein Websocket-Server, WebRTC, IndexedDB oder ein eigener. Der Provider und das `Y.Doc` bleiben bei Ihnen: Die Bindung verbindet, trennt oder zerstört sie nie.

Die Änderungen werden als die eigenen Aktionsstapel des Editors übertragen, die die Bindung so belässt, wie der Store sie gesendet hat.  
Die Kollaborationsregister des Editors gleichen zeitgleich vorgenommene Bearbeitungen also genauso ab wie in einer über `getSharedStore` angebundenen Sitzung, mit denselben Ausnahmen, etwa einer Farbänderung – siehe [Gleichzeitige Bearbeitungen](./collaborative-editing.md#concurrent-edits).  
Mauszeiger, Fokus, Auswahlen und Auswahlrahmen werden über die Awareness des Providers übertragen – siehe [Präsenz](#presence).  
Gegenüber dem Anbinden eines gemeinsamen Stores an einen eigenen Transport bietet die Bindung zusätzlich:

- Ein beitretender Client öffnet das Diagramm, das der Raum enthält, ohne dass ihm ein [runtimeValue](../erd-editor-element.md#runtimevalue) aus einem laufenden Editor übergeben wird.
- Ein getrennter Client bearbeitet weiter, und seine Änderungen kommen an, sobald er sich wieder verbindet – siehe [Offline-Bearbeitungen und Wiedereinstieg](#offline-edits-and-rejoins).
- Ein `Y.Doc`, das ein Persistenz-Provider zurückliefert, öffnet das Diagramm, das es enthält – siehe [Was der Raum enthält](#what-the-room-holds).
- Ein optionaler Node-Sidecar-Prozess führt den Verlauf des Raums in einem Snapshot zusammen – siehe [Einen Raum verdichten](#compacting-a-room).

Die Bindung benötigt die fünf Methoden, die `5.1.0` zum gemeinsamen Store und zum Peer-Store hinzugefügt hat – [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) und [reseed](./collaborative-editing.md#reseed) – und ruft sie bei Bedarf selbst auf.

## Installation {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` und `y-protocols` sind Peer-Abhängigkeiten, sodass eine Seite von jeder nur eine Kopie enthält: `@dineug/erd-editor` `5.1.0` oder neuer innerhalb von `5.x`, `yjs` `13.6` oder neuer innerhalb von `13.x` und `y-protocols` `1.0` oder neuer innerhalb von `1.x`.  
Das Paket übernimmt nur deren Typen und arbeitet auf dem `Y.Doc` und der `Awareness`, die Sie übergeben, sodass es keinen eigenen Yjs-, y-protocols- oder Editor-Code lädt.  
Zwei Kopien von Yjs auf einer Seite stören gegenseitig ihre Konstruktorprüfungen, und die zweite protokolliert `Yjs was already imported`. Wenn Ihr Code und ein Provider `yjs` aus zwei verschiedenen Quellen auflösen, deduplizieren Sie es im Bundler (Vite: `resolve.dedupe: ['yjs']`).

Das Paket ist ausschließlich ESM (`"type": "module"`), hat einen einzigen Einstiegspunkt, die Paketwurzel, und ist als frei von Nebeneffekten markiert, sodass ein Bundle, das nur `bindErdEditor` importiert, den Verdichter weglässt.  
`bindErdEditor` benötigt ein DOM, da es ein definiertes Element `<erd-editor>` bindet. `bindPeerStore` läuft auch in reinem Node, ab Node.js 22.12, wie es auch der [Verdichter-Sidecar](#compacting-a-room) tut.

## Verwendung {#usage}

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

`wss://yjs.example.com` und `my-diagram` stehen für Ihren eigenen Server und Raum.  
Binden und initialisieren Sie erst, wenn der Provider synchronisiert ist, wie Ihnen das Ereignis `sync` von y-websocket mit `true` anzeigt. Eine zu früh vorgenommene Initialisierung kann das Diagramm des Raums ersetzen – siehe [Einen Raum initialisieren](#seeding-a-room).

Enthält das `Y.Doc` beim Binden den Snapshot eines Raums, öffnet die Bindung ihn sofort im Element: Sie lädt den Snapshot mit seinen Registern und seiner Version, wie es [reseed](./collaborative-editing.md#reseed) tut, und wendet jede seitdem protokollierte Änderung an.  
Dieses Öffnen löscht und schließt, was ein Wiedereinstieg löscht und schließt – siehe [Offline-Bearbeitungen und Wiedereinstieg](#offline-edits-and-rejoins) –, und das Element öffnet sich dort, wo der Snapshot es hinstellt. Für dieses erste Öffnen wird kein `rejoin` ausgelöst.  
Enthält das `Y.Doc` keinen Snapshot, etwa in einem leeren Raum oder bevor der Provider synchronisiert ist, behält das Element sein Dokument, und die Bindung schreibt nichts in den Raum, bis ein Snapshot erscheint: ihre eigene [Initialisierung](#seed) oder die eines anderen Clients.

`bindErdEditor` nimmt mit [getSharedStore](../erd-editor-element.md#getsharedstore) einen gemeinsamen Store vom Element, und [destroy](#destroy) gibt ihn wieder frei.  
Das Element muss bereits ein `<erd-editor>` sein, sein Einstiegspunkt importiert oder `defineErdEditor()` aufgerufen – siehe [Die Elemente registrieren](../installation.md#registering-the-elements). Solange das Tag nicht definiert ist, ist ein `<erd-editor>` ein einfaches `HTMLElement`, das der Browser per Upgrade umwandelt, sobald das Tag definiert und das Element im Dokument ist. Bei einem Element ohne dieses Upgrade wirft `bindErdEditor` einen `TypeError`, statt `error` auszulösen.

Die Änderungen des Raums werden auf das Element angewendet und lösen [change](../erd-editor-element.md#change) aus, wie die eines Mitbearbeiters, darunter die Änderungen, die nach dem Öffnen eines Snapshots erneut abgespielt werden.  
Das Öffnen eines Snapshots, beim Binden oder bei einem Wiedereinstieg, erzeugt keinen Rückgängig-Eintrag, löst kein `change` aus und schreibt nichts in den Raum, abgesehen vom Ableiten aus einem logischen Namen, das [Offline-Bearbeitungen und Wiedereinstieg](#offline-edits-and-rejoins) beschreibt.  
Um ein anderes Dokument in einen initialisierten Raum zu laden, nehmen Sie eine Änderung vor, die jeder Client anwendet: Weisen Sie [value](../erd-editor-element.md#value) zu, rufen Sie [clear](../erd-editor-element.md#clear) auf oder importieren Sie eines.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) wird nie in den Raum geschrieben, da ein gemeinsamer Store es nicht sendet. Es ändert also nur dieses Element, während jeder andere Client das Diagramm des Raums behält. Initialisieren Sie einen leeren Raum stattdessen mit [seed](#seed).

Ein `Y.Doc` enthält ein Diagramm. Die Bindung legt es unter den mit `erd:` beginnenden Namen des `Y.Doc` ab, setzt das Feld `erd` des lokalen Awareness-Zustands und lässt jeden anderen Namen und jedes andere Feld unberührt.  
Geben Sie jedem gebundenen Element ein eigenes `Y.Doc` und eine eigene Awareness, wie sie jeder Client eines Raums hat: Zwei Bindungen, die sich eine Awareness teilen, überschreiben gegenseitig ihr Feld `erd`.

## Einen Raum initialisieren {#seeding-a-room}

Ein Raum enthält kein Diagramm, bis ein Client ihn [initialisiert](#seed).  
Was ein Editor in der Zwischenzeit enthält, fließt in seine eigene Initialisierung ein und weicht der Initialisierung eines anderen Clients, wenn diese zuerst eintrifft: Die Bindung öffnet ihn dann mit `rejoin('snapshot')` neu auf dieser, und das Dokument, das das Element enthielt, samt den seit dem Binden darin vorgenommenen Änderungen, ist weg.

Initialisieren zwei Clients gleichzeitig, gewinnt auf jedem Client dieselbe Initialisierung.  
Der andere Client, der initialisiert hat, wird mit `rejoin('seedLost')` neu auf ihr geöffnet und verliert, was er seit seiner Initialisierung bearbeitet hat, und ebenso ein Client, der der unterlegenen Initialisierung beigetreten war, mit `rejoin('snapshot')`. Ihre Änderungen in der unterlegenen Initialisierung erreichen niemanden.  
Eine Initialisierung vor der Synchronisierung des Providers gilt als im selben Moment vorgenommen wie die Initialisierung, aus der das Diagramm des Raums stammt, sodass sie sich gegen diese durchsetzen und das Diagramm des Raums ersetzen kann.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

Die `Awareness`, die Mauszeiger, Fokus, Auswahlen und Auswahlrahmen überträgt, etwa die des Providers.  
Mit ihr schaltet die Bindung die Maus- und Fokus-Tracker des Elements ein und zeigt die Präsenz der anderen Clients auf dem Element an – siehe [Präsenz](#presence).  
Ohne sie wird nur das Diagramm synchronisiert: Das Element sendet weder Mauszeiger noch Fokus noch Auswahl und zeigt die der anderen nicht an.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Der Name, den die anderen neben dem Mauszeiger dieses Editors sehen.  
Der gemeinsame Store des Elements liest ihn bei jedem Senden, wie bei [getSharedStore](./collaborative-editing.md#getnickname), und andere Benutzer sehen `user`, wenn er fehlt oder leer ist.

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

`on(event, listener)` gibt eine Funktion zurück, die den Listener entfernt.

### seed {#seed}

Schreibt den ersten Snapshot des Raums aus dem Dokument des Editors und gibt `true` zurück.  
Mit `value`, dem Text eines Dokuments in jeder Form, die [setInitialValue](../erd-editor-element.md#setinitialvalue) liest, wird dieses zuerst in den Editor geladen.  
Anschließend gibt sie die Ziehvorgänge, Größenänderungen und Farbänderungen, die der Editor noch zurückhält, nicht protokolliert frei, sodass keine davon nach dem Snapshot im Raum landet. Ohne `value` zeigt der Snapshot sie bereits, da er das Dokument des Editors übernimmt; mit `value` gehörten sie zu dem Dokument, das `value` ersetzt hat.  
Danach schreibt sie den Snapshot, den [Was der Raum enthält](#what-the-room-holds) beschreibt.  
Enthält der Raum bereits einen Snapshot, gibt sie `false` zurück und schreibt nichts, ohne `value` zu laden, sodass jeder Client sie nach dem Binden aufrufen kann. Sie gibt auch `false` zurück, sobald die Bindung zerstört oder gestoppt wurde, sowie bei einer Bindung, die beim Binden [abgelehnt](#onerror) wurde.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

Die Bindung hat den Editor neu auf dem Snapshot des Raums geöffnet, wie es [reseed](./collaborative-editing.md#reseed) tut; [Offline-Bearbeitungen und Wiedereinstieg](#offline-edits-and-rejoins) beschreibt, was sie behält und was sie verliert.  
`reason` nennt den Grund:

- `'snapshot'`: Der Snapshot enthält Änderungen, die die Bindung nicht angewendet hatte, weil sie abwesend war, während ein Verdichter sie zusammengeführt hat, oder weil ein Verdichter in einer eigenen Zusammenführung zurückgespielt hat, was er in einen Snapshot zusammengeführt hatte, den der Snapshot eines anderen Verdichters ersetzt hat (siehe [Ein Verdichter pro Raum](#one-compactor-per-room)). Dies ist auch der Grund, wenn der Snapshot der erste ist, der eine Bindung eines leeren Raums erreicht, und wenn er zu einer anderen Initialisierung gehört und diese Bindung einer Initialisierung beigetreten war, die sie nicht geschrieben hat.
- `'seedLost'`: Die Initialisierung eines anderen Clients hat sich gegen die Initialisierung durchgesetzt, die diese Bindung geschrieben hat.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

Die Bindung hat das Binden abgelehnt, hat gestoppt oder hat eine Option zurückgewiesen. Jede Meldung beginnt mit `erd-editor-yjs: `.

Beim Binden bindet sie nichts, wenn:

- der Editor oder Peer-Store bereits an dieses `Y.Doc` gebunden ist;
- sein `@dineug/erd-editor` vor `5.1.0` erstellt wurde; die Bindung zerstört den gemeinsamen Store, den sie von einem Element genommen hat;
- der Peer-Store vor dem Binden zerstört wurde;
- der Raum einen Snapshot in einem Layout enthält, das diese Version nicht liest (siehe [Was der Raum enthält](#what-the-room-holds)).

Eine solche Bindung löst `error` in einem Microtask aus, sodass ein Listener, der direkt nach dem Aufruf hinzugefügt wird, es hört, und auf ihr wird nie ein `rejoin` ausgelöst.

Später stoppt die Bindung, wenn:

- der Snapshot des Raums auf ein Layout wechselt, das diese Version nicht liest. Jede Bindung dieser Version stoppt, jeder Editor behält, was er angewendet hatte, und nichts, was danach bearbeitet wird, wird geschrieben;
- ihr Peer-Store unter ihr zerstört wurde, was beim nächsten Mal auffällt, wenn sich der Raum ändert oder `seed()` oder `compact()` aufgerufen wird.

Eine Bindung, die stoppt, gibt den gemeinsamen Store frei, den sie genommen hat, sowie ihren Store und das `Y.Doc` als Paar, wie es [destroy](#destroy) tut, und behält ihre Listener.

Nur bei `bindPeerStore` lösen diese Fälle `error` aus, und die Bindung läuft weiter:

- `compactAfter` ist keine positive ganze Zahl: Die Bindung führt nur auf Anforderung zusammen;
- `electionGraceMs` oder `retainMs` ist keine Zahl von 0 bis 2.147.483.647 ms: Der jeweilige Standardwert tritt an ihre Stelle, da ein Timer jenseits dieses Bereichs sofort ausgelöst wird;
- `synced` wird abgelehnt: Die Bindung führt nie zusammen und überlässt die Wahl den anderen Verdichtern (siehe [Ein Verdichter pro Raum](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Sendet die Ziehvorgänge, Größenänderungen und Farbänderungen, die der Editor noch zurückhält, in den Raum, setzt das Awareness-Feld `erd` der Bindung auf `null`, sodass die anderen ihren Mauszeiger, Fokus und ihre Auswahl sofort verwerfen, und beendet die Beobachtung des `Y.Doc` und der Awareness.  
Bei einem Element zerstört sie außerdem den gemeinsamen Store, den sie genommen hat, und lässt das Element und sein Dokument unverändert.  
Ein zweiter Aufruf bewirkt nichts. Danach erreicht niemanden, was der Editor bearbeitet.

Der Peer-Store, das `Y.Doc` und der Provider bleiben bei Ihnen und sind nach der Bindung zu zerstören: Ein zuerst zerstörter Peer-Store sendet die Ziehvorgänge, die er noch zurückhielt, nie.  
Die Methode [destroy](../erd-editor-element.md#destroy) des Elements selbst zerstört jeden gemeinsamen Store, den es herausgegeben hat, auch den der Bindung, und verwirft, was sie zurückhalten. Zerstören Sie die Bindung also zuerst.  
Zerstören Sie eine Bindung, bevor Sie denselben Editor oder Peer-Store erneut an dasselbe `Y.Doc` binden; eine Bindung, die mit `error` gestoppt hat, hat bereits alles freigegeben.

```js
binding.destroy();
editor.destroy();
```

## Präsenz {#presence}

Mit [awareness](#awareness) werden Mauszeiger, fokussierte Tabelle oder Zelle, Auswahl und Auswahlrahmen des Editors im Feld `erd` seines lokalen Awareness-Zustands übertragen, nie im `Y.Doc`, sodass sie nie in den Verlauf des Raums, seinen Snapshot oder ein persistiertes `Y.Doc` gelangen.  
Die anderen zeigen sie so an, wie sie die Präsenz eines Mitbearbeiters anzeigen – siehe [focusTracker](./collaborative-editing.md#focustracker) –, und ein beitretender Client zeigt die Präsenz an, die der Raum bereits zeigt.  
Das Element sendet Fokus und Auswahl alle 30 Sekunden und seinen Auswahlrahmen jede Sekunde erneut. Jede dieser erneuten Sendungen erreicht die anderen auch dann, wenn sie die letzte wiederholt, sodass nie verfällt, was ein Benutzer noch hält.

Ein Client, der geht, wird sofort vergessen.  
Verwirft Awareness den Zustand des Clients, wird dessen Feld `erd` zu `null`, wie es [destroy](#destroy) setzt, oder nennt es einen anderen Editor, entfernt die Bindung Mauszeiger, Fokus, Auswahl und Auswahlrahmen dieses Editors mit [forgetPeer](./collaborative-editing.md#forgetpeer) vom Element, statt auf ihren Ablauf zu warten.  
Sie behält sie, solange ein anderer Client noch denselben Editor zeigt, wie es ein erneut an ein anderes `Y.Doc` des Raums gebundenes Element tut.

## Offline-Bearbeitungen und Wiedereinstieg {#offline-edits-and-rejoins}

Ein vom Provider getrennter Client bearbeitet weiter. Seine Änderungen warten in seinem lokalen `Y.Doc`, nicht im gemeinsamen Store, und erreichen die anderen, wenn sich der Provider wieder verbindet und synchronisiert.

Hat ein Verdichter Änderungen zusammengeführt, die der Client während seiner Abwesenheit nie angewendet hat, enthält der Snapshot sie, sodass der Client beim erneuten Verbinden mit `rejoin('snapshot')` neu auf dem Snapshot geöffnet wird, nachdem er die Ziehvorgänge, Größenänderungen und Farbänderungen gesendet hat, die sein Editor noch zurückhielt. Eine Zusammenführung nur dessen, was der Client angewendet hatte, öffnet nichts neu.  
Ein Wiedereinstieg auf einen Snapshot der Initialisierung, der die Bindung beigetreten war, spielt jede Änderung erneut ab, die der Snapshot nicht enthält, darunter die eigenen, während der Abwesenheit vorgenommenen Änderungen dieses Clients, sodass keine verloren geht. Ein Wiedereinstieg auf eine andere Initialisierung behält nichts, wie [Einen Raum initialisieren](#seeding-a-room) beschreibt.

Jeder Wiedereinstieg löscht den Rückgängig-Verlauf, die Auswahl und den Fokus und schließt eine geöffnete Ansicht [Flow](../../guide/guides/visualization.md#flow-mode), ein [Ziehen einer Beziehung](../../guide/guides/editing-start.md#relationship-creation) und einen Editor für eine Notiz, einen Tabellengruppennamen oder eine Zelle, da sie benennen können, was der Snapshot nicht mehr enthält.  
Ein eingegebener, aber noch nicht bestätigter Tabellengruppenname wird verworfen. Eine Zelle des logischen Namens, die sich schließt, leitet den physischen Namen aus einem logischen Namen ab, den ihr Leser eingegeben hat, sofern das neu geöffnete Dokument ihn noch enthält, wie es jedes Schließen dieser Zelle tut. Diese Ableitung ist eine gewöhnliche Änderung: Der Raum protokolliert sie, sie erzeugt einen Rückgängig-Eintrag und löst `change` aus – siehe [reseed](./collaborative-editing.md#reseed).  
Eine Bindung, die dem Raum beigetreten war, behält, was ihr Leser sieht: die Scrollposition, die Zoomstufe und die Registerkarte sowie die Einstellungen, die ein schreibgeschützter Leser geändert hat.  
Sie behält auch die Namensansicht und die Code-Einstellungen (Sprache des Codegenerators, Schreibweisen und Begrenzertyp), die der Leser selbst eingestellt hatte, solange die [Sperre](../../guide/guides/settings.md#lock) der jeweiligen Einstellung vor dem Wiedereinstieg eingeschaltet war und danach beim selben gesperrten Wert noch eingeschaltet ist.  
Nichts davon, was sie behält, erreicht `value`, das die Einstellungen des neu geöffneten Dokuments meldet – siehe [reseed](./collaborative-editing.md#reseed) mit `keepScreen`.  
Die Scrollposition und die Zoomstufe eines Elements, das seit seinem letzten Laden nicht angezeigt wurde, sowie die gesamte Ansicht einer Bindung, die noch nicht beigetreten war, öffnen sich dort, wo der Snapshot sie hinstellt.  
Ein Peer-Store hat keine Ansicht, daher behält sein Wiedereinstieg keine.

## Schreibgeschützte Editoren {#read-only-editors}

Ein an einen Raum gebundenes [schreibgeschütztes](../erd-editor-element.md#readonly) Element schreibt nichts in den Verlauf des Raums: Sein gemeinsamer Store sendet keine Änderung, nur seine Tracker und den Register-Handshake, und der Raum [protokolliert keines von beiden](#what-the-room-holds).  
Es wendet weiterhin jede Änderung an, die der Raum trägt, und mit [awareness](#awareness) erreichen Mauszeiger, Fokus, Auswahl und Auswahlrahmen seines Lesers weiterhin die anderen.  
Die Einstellungen, die sein Leser ändert, bleiben auf seinem Bildschirm, wie bei jedem schreibgeschützten Editor.  
[seed](#seed) wird nicht abgelehnt: Ein schreibgeschütztes Element initialisiert einen leeren Raum mit dem Dokument, das es enthält, oder mit `value`, wenn angegeben.

## Was der Raum enthält {#what-the-room-holds}

Die Bindung hält das Diagramm in zwei Namen des `Y.Doc`: `erd:snapshot`, eine Map, die einen Snapshot des Dokuments enthält, und `erd:log`, ein Array der Aktionsstapel des Editors seit diesem Snapshot. Ein Persistenz-Provider speichert beide mit dem Rest des `Y.Doc`.

Der Snapshot enthält den [runtimeValue](../erd-editor-element.md#runtimevalue) des Dokuments, entfernte Entitäten eingeschlossen, seine Kollaborationsregister und seine Version sowie wie weit die Änderungen jedes Schreibers darin zusammengeführt sind. Eine Initialisierung schreibt ihn, und ebenso jede Zusammenführung eines Verdichters.  
Jeder Protokolleintrag ist ein Stapel, wie der Editor ihn gesendet hat, seine Metadaten eingeschlossen, die die Editor-ID und den Nicknamen des Senders tragen.  
Scrollen, Zoomen, Registerkartenwechsel, Präsenz und der Register-Handshake werden nie protokolliert. Jede andere Änderung, die der Editor sendet, wird protokolliert, darunter ein unter ihrer [Sperre](../../guide/guides/settings.md#lock) vorgenommener Wechsel der Namensansicht, den jeder andere Client verwirft.  
Eine unter ihrer Sperre geänderte Sprache des Codegenerators, Schreibweise oder ein geänderter Begrenzertyp wird nie gesendet, sodass sie auf dem Bildschirm dieses Editors bleibt und nie den Raum erreicht.

Ein `Y.Doc`, das ein Persistenz-Provider zurückliefert, öffnet das Diagramm, das es enthält, wie eine Bindung jedes `Y.Doc` öffnet, das einen Snapshot enthält – siehe [Verwendung](#usage).

Der Snapshot ist keine Datei: Sein Laufzeitwert enthält entfernte Entitäten, die eine Datei nicht enthalten darf.  
Um das Diagramm des Raums in einen Speicher zu schreiben, speichern Sie den [value](../erd-editor-element.md#value) eines gebundenen Elements, sooft sein Ereignis [change](../erd-editor-element.md#change) ausgelöst wird.  
Speichern Sie ihn auch einmal nach dem Binden, nach einem [seed](#seed) mit einem `value` und in einem Listener für [rejoin](#onrejoin), da keiner dieser Ladevorgänge `change` auslöst.  
Ein [schreibgeschütztes](../erd-editor-element.md#readonly) Element löst nie `change` aus, speichern Sie also von einem, das nicht schreibgeschützt ist, oder lesen Sie `value` von einem gebundenen Peer-Store, der die Änderungen des Raums anwendet, sobald sie eintreffen.  
Ein [replicationStore](./remote-storage.md) kann nicht gebunden werden, da ihm die Methoden fehlen, die eine Bindung benötigt, und einer, der vom gemeinsamen Store eines gebundenen Elements gespeist wird, verpasst die Änderungen des Raums – siehe [Einen laufenden Editor replizieren](./remote-storage.md#replicating-a-live-editor).

Das Layout ist privat und kann sich mit [ERD_YJS_FORMAT](#exports) ändern.  
Lesen Sie einen Raum nur über eine Bindung und überlassen Sie ihr die mit `erd:` beginnenden Namen und das Awareness-Feld `erd`.

## Einen Raum verdichten {#compacting-a-room}

Der Verlauf des Raums wächst mit jeder Änderung, und jeder beitretende Client spielt ihn ganz ab, bis ihn etwas zusammenführt.  
`bindPeerStore` bindet einen Headless-Peer-Store aus `@dineug/erd-editor/peer.js` und gibt einen `ErdYjsPeerBinding` zurück: dieselben [seed](#seed), [on](#erdyjsbinding) und [destroy](#destroy), mit [compact](#compact).  
Ein in einem Node-Prozess neben dem Server gebundener Peer-Store, ein Sidecar, führt den Verlauf in einem Snapshot seines eigenen Diagramms zusammen.  
Die Bindung eines Elements führt nie zusammen, und ein Peer-Store, der ohne `compactAfter` und ohne Aufruf von `compact()` gebunden wird, ist ein gewöhnlicher Headless-Peer.

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

Der Peer-Store bleibt bei Ihnen: Die Bindung zerstört ihn nie. Sein Nickname ist der, den `createPeerStore` erhalten hat, und `presence: false` hindert ihn daran, einen eigenen Fokus zu senden.

Eine Zusammenführung schreibt den Snapshot aus dem eigenen Laufzeitwert, den Registern und der Version des Peer-Stores und löscht die Protokolleinträge, die sie abdeckt, sowie jeden Eintrag einer anderen Initialisierung, alles in einer Transaktion.  
Clients, die alles angewendet haben, sehen die Einträge verschwinden; ein Client, der das nicht getan hat, wird neu auf dem Snapshot geöffnet (siehe [Offline-Bearbeitungen und Wiedereinstieg](#offline-edits-and-rejoins)).  
Jede Zusammenführung schreibt das ganze Diagramm in den Snapshot, sodass jede einzelne jedem Client ein Update in der ungefähren Größe des Laufzeit-JSON und der Register des Diagramms zusammen sendet, egal wie wenige Einträge sie aufnimmt. Setzen Sie `compactAfter` so hoch, dass die Einträge, die eine Zusammenführung aufnimmt, mehr wiegen als eine Kopie des Diagramms.

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

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `awareness` | Keiner | Zeigt den Peer-Store in der Awareness des Raums, wie [awareness](#awareness) es bei einem Element tut. Ein Verdichter, der von selbst zusammenführt, wird dort markiert, sodass Verdichter, die einander sehen, einen wählen, der zusammenführt, und einer, der keinen anderen Client sieht, von selbst nichts zusammenführt – siehe [Ein Verdichter pro Raum](#one-compactor-per-room). Ohne sie führt ein Verdichter von selbst zusammen, ohne Wahl und ohne Karenzzeit. |
| `compactAfter` | Keiner | Führt von selbst zusammen, sobald das Protokoll diese Anzahl an Einträgen enthält, die eine Zusammenführung aufnehmen würde. Ohne diese Option oder ohne `synced` führt nur `compact()` zusammen, ebenso die Zusammenführung, die zurückspielt (siehe [Ein Verdichter pro Raum](#one-compactor-per-room)). |
| `synced` | Keiner | Ein Promise, das aufgelöst wird, sobald der Provider synchronisiert ist. Davor führt nichts zusammen, `compact()` eingeschlossen. Ohne es führt nichts von selbst zusammen, und `compact()` führt sofort zusammen. |
| `electionGraceMs` | `3000` | Mit `awareness`: wie lange der Verdichter den Raum beobachtet, bevor er von selbst zusammenführt, nach `synced` und erneut, wenn andere Clients erscheinen, nachdem keine da waren. |
| `retainMs` | `600000` (zehn Minuten) | Wie lange die Einträge einer Zusammenführung zum Zurückspielen vorgehalten werden (siehe [Ein Verdichter pro Raum](#one-compactor-per-room)), gezählt ab dem ersten Update, das der Raum nach der Zusammenführung sendet. |

Eine ungültige Option oder ein `synced`, das abgelehnt wird, löst [error](#onerror) aus.

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Führt sofort zusammen, ohne Wahl, Karenzzeit oder Schwellenwert.  
Zuerst übernimmt sie den aktuellen Snapshot des Raums, einen Wiedereinstieg eingeschlossen, und sendet, was ihr Peer-Store noch zurückhält.  
Sie antwortet mit `{ compacted: true, generation }`, wobei `generation` die Zusammenführungen des Snapshots zählt: `0` für eine Initialisierung, je Zusammenführung eins mehr.  
Andernfalls antwortet sie mit `{ compacted: false, reason }`:

- `'destroyed'`, sobald die Bindung zerstört oder gestoppt wurde, sowie bei einer Bindung, die beim Binden [abgelehnt](#onerror) wurde, schon bevor `synced` aufgelöst wird;
- `'not-synced'`, bevor `synced` aufgelöst wird;
- `'no-snapshot'` in einem Raum, den kein Client initialisiert hat.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Ein Verdichter pro Raum {#one-compactor-per-room}

Betreiben Sie genau einen Verdichter pro Raum und starten Sie einen neuen erst, wenn der alte gestoppt ist. Nichts erzwingt dies.  
Unter Verdichtern, die einander in Awareness sehen, führt nur der mit der kleinsten Yjs-Client-ID von selbst zusammen, und wenn er geht oder sein `synced` abgelehnt wird, übernimmt der nächste sofort.  
Ein Verdichter, dessen Awareness keinen anderen Client zeigt, etwa wenn sein eigener Socket sich schließt und alle verwirft, führt von selbst nichts zusammen, bis wieder andere erscheinen und er den Raum `electionGraceMs` lang beobachtet hat.

Zwei voneinander getrennte Verdichter oder ein Neustart, dessen Vorgänger noch läuft, können dennoch beide zusammenführen.  
Der Raum behält dann einen der beiden Snapshots, und der Verdichter, dessen Snapshot unterlegen ist, spielt zurück, was er zusammengeführt hat und der Gewinner nicht enthält, solange er es hält: `retainMs`, und höchstens seine letzten 1.000 Einträge, wie groß jeder auch ist.  
Es geht also nichts verloren, wenn der Verdichter mit dem unterlegenen Snapshot der ist, der sich wieder verbindet, solange er während der Trennung nicht mehr als 1.000 Einträge zusammengeführt hat.  
Ist er der, der online geblieben ist, und ist sein Vorhalten abgelaufen, fehlt im Snapshot und im Verlauf des Raums, was er zusammengeführt hat, bis er erneut zusammenführt. Ein Client, der diese Änderungen verpasst hat, oder einer, der in der Zwischenzeit beitritt, hat sie nicht und hält die späteren Änderungen jedes Schreibers zurück, dessen Änderungen der Verdichter zusammengeführt hat. Die nächste Zusammenführung des Verdichters bringt sie alle zurück, es sei denn, der gewinnende Snapshot enthielt Änderungen, die ihm fehlten; das öffnet ihn neu auf diesem Snapshot und verliert, was er zusammengeführt hatte, endgültig.

Ein Verdichter spielt in einer eigenen Zusammenführung zurück, die er vornimmt, sobald er zum gewinnenden Snapshot aufgeschlossen hat, ohne Wahl, Karenzzeit oder Schwellenwert, und jeder Client wird mit `rejoin('snapshot')` neu auf dieser Zusammenführung geöffnet.  
Die zurückgespielten Änderungen erreichen keinen Client außerhalb dieser Zusammenführung, sodass ein durchgehend online gewesener Client mit den anderen und mit einem später beitretenden gleich endet, auch wenn eine spätere Änderung eines anderen Schreibers auf einer von ihnen aufbaut, etwa die Umbenennung einer Tabelle, die ein anderer Client hinzugefügt hat.  
Jedes Zurückspielen kostet jeden Client diesen Wiedereinstieg, mit [dem, was ein Wiedereinstieg verliert](#offline-edits-and-rejoins). Spielen zwei Verdichter gleichzeitig zurück, enden dennoch alle Clients gleich, obwohl eine Änderung vor der angewendet bleiben kann, auf der sie aufbaut.  
Eine Bindung, die zerstört oder gestoppt wird, bevor diese Zusammenführung läuft, etwa wenn ein `rejoin`-Listener sie zerstört, spielt die Änderungen stattdessen einzeln zurück. Keine geht verloren, aber dann kann ein durchgehend online gewesener Client eine nach der Änderung eines anderen Schreibers anwenden, die auf ihr aufbaut, und sich von einem später beitretenden unterscheiden.

## Grenzen {#limits}

- **Der Ansichtsbereich bleibt auf jedem Bildschirm.** Scrollen, Zoomen und Registerkartenwechsel werden [nie protokolliert](#what-the-room-holds), obwohl eine über `getSharedStore` angebundene Sitzung sie sendet (sie verschieben dort ebenfalls weder die Ansicht noch die Registerkarte eines anderen Benutzers). Jeder Leser behält seinen eigenen, und die Bindung zeigt ihn nur in ihrem Awareness-Zustand, den noch nichts liest. Bei ausgeschalteter [Sperre](../../guide/guides/settings.md#lock) `Viewport` oder `Canvas Type` speichert der `value` jedes Clients seinen eigenen; unter den Sperren, die ein neues Dokument eingeschaltet hat, speichert jeder Client den gesperrten.
- **Der Snapshot wächst um einen Eintrag pro Bindung.** Er hält für jede Bindung, die je in den Raum geschrieben hat, fest, wie weit ihre Änderungen zusammengeführt sind, und verwirft nie eine. Eine erneut erstellte Bindung oder eine, die zu einer anderen Initialisierung gewechselt ist, zählt neu, ebenso jede Zusammenführung, die zurückspielt. Ein Eintrag ist eine 32-stellige ID und eine Zahl, sodass zehntausend schreibende Sitzungen jedem Snapshot und jeder Zusammenführung einige hundert Kilobyte hinzufügen.
- **Ein Hub und ein Raum leiten nichts untereinander weiter.** Ein Element, das an einen Raum und an den [Hub](../../mcp/live-and-headless.md#live) eines Coding-Agenten oder über `getSharedStore()` an einen anderen Transport gebunden ist, wendet die Änderungen beider an, aber keiner hört die des anderen, da ein gemeinsamer Store nie weiterleitet, was er empfangen hat.
- **Zeitgleich hinzugefügte Elemente können unterschiedlich angeordnet sein.** Tabellen oder Notizen, die zwei Clients gleichzeitig hinzufügen, können im Diagramm jedes Clients in anderer Reihenfolge stehen, wie in einer über `getSharedStore` angebundenen Sitzung – siehe [Gleichzeitige Bearbeitungen](./collaborative-editing.md#concurrent-edits).
- **Zeitgleich vorgenommene Farb- und einige andere Änderungen können unterschiedlich enden.** Eine Farbänderung wird ohne Version protokolliert, und jeder Client versieht sie beim Anwenden mit seiner eigenen. Zwei zeitgleiche Neueinfärbungen derselben Tabelle, Notiz oder Tabellengruppe können daher Clients und einen Client, der später beitritt und das Protokoll abspielt, bei unterschiedlichen Farben enden lassen. Das gilt auch für die anderen Änderungen, die jeder Client in der Reihenfolge anwendet, in der er sie hört, etwa zwei Spaltenverschiebungen innerhalb einer Tabelle oder eines Index oder zwei Änderungen der Datenbank – siehe [Gleichzeitige Bearbeitungen](./collaborative-editing.md#concurrent-edits).
- **Ein gehender Mauszeiger wartet auf den Server.** Die Bindung entfernt den Mauszeiger eines Teilnehmers, sobald Awareness ihn verwirft. Ein Server, der beim Schließen eines Sockets nur die Awareness-Zustände entfernt, die dieser Socket zuerst hinzugefügt hat, lässt einen Client, der sich neu verbunden hatte, nach seinem Weggang auf den Bildschirmen der anderen stehen, bis Awareness ihn 30 Sekunden später ablaufen lässt. Einer, der jeden Zustand entfernt, den ein Socket zuletzt geschrieben hat, ein Update ebenso wie ein Hinzufügen, entfernt ihn sofort.

## Exporte {#exports}

| Export | Beschreibung |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Bindet ein Element `<erd-editor>` – siehe [Verwendung](#usage). Gibt einen [ErdYjsBinding](#erdyjsbinding) zurück. |
| `bindPeerStore(peer, doc, options?)` | Bindet einen Peer-Store aus `@dineug/erd-editor/peer.js` – siehe [Einen Raum verdichten](#compacting-a-room). Gibt dasselbe mit [compact](#compact) zurück (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | Das Layout des `Y.Doc`, das diese Version schreibt, `1`; eine Bindung lehnt einen in einem anderen Layout geschriebenen Raum ab. |

Typen: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
