---
sidebar_position: 1
description: Änderungen des Editors mit getSharedStore zwischen Instanzen weiterleiten, einen beitretenden Editor aus runtimeValue und den Registern des Stores initialisieren, zeitgleich vorgenommene Bearbeitungen abgleichen und Mauszeiger, Fokus, Auswahl und Auswahlrahmen jedes Mitbearbeiters anzeigen.
---

# Gemeinsame Bearbeitung

`getSharedStore()` macht einen Editor zu einem Knoten in einer gemeinsamen Sitzung.  
Der Editor gibt dann jede Änderung als Stream von Aktionen aus und wendet die Aktionen an, die andere Editoren zurücksenden – den Transport zwischen ihnen (WebSocket, WebRTC oder alles andere, was JSON übertragen kann) stellen Sie selbst bereit.  
`getSharedStore()` ist eine der Methoden von [ErdEditorElement](../erd-editor-element.md) und lässt sich mit [Remote-Speicherung](./remote-storage.md) kombinieren, wenn die weitergeleiteten Änderungen auch gespeichert werden müssen.  
Seit `5.1.0` binden Sie den Editor mit `@dineug/erd-editor-yjs`, wenn Sie ein Diagramm über ein Yjs-Dokument und einen beliebigen seiner Provider teilen wollen, statt den Transport selbst zu verdrahten; siehe [Yjs](./yjs.md).

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

`@dineug/erd-editor` exportiert keinen dieser Typen unter seinem Namen. TypeScript-Code erreicht sie über `ErdEditorElement`, etwa mit `ReturnType<ErdEditorElement['getSharedStore']>`.

Eine Aktion ist ein einfaches serialisierbares Objekt, das eine Änderung am Dokument beschreibt, sodass sie `JSON.stringify` auf dem Weg zum Transport übersteht.  
Aktionen kommen in Stapeln an: `subscribe` übergibt Ihnen ein Array, und dieses Array ist eine Einheit – leiten Sie es als Ganzes weiter und übergeben Sie es auf der anderen Seite als Ganzes an `dispatch`.  
Behandeln Sie eine Aktion als Blackbox und reichen Sie sie unverändert durch, statt sie zu lesen oder umzuschreiben, denn die Verwaltungsdaten, die sie mitführt, etwa ihre [Version](#concurrent-edits), halten die Editoren synchron.

Einiges von dem, was ein Editor tut, bleibt in diesem Editor.  
Wenn eine Tabelle, Notiz oder Tabellengruppe in den Vordergrund geholt wird, wie es beim Auswählen geschieht, wird das nicht gesendet.  
Auch die Auswahl bei `Statements`, `Header`, `Write logical names into empty comments` (seit `4.2.0`) und `Tables` auf der Registerkarte [Schema SQL](../../guide/guides/schema-sql.md) wird nicht gesendet, denn sie gehört zu dem Fenster, in dem sie getroffen wird.  
Seit `4.1.0` bleibt auch der [Explorer](../../guide/guides/explorer.md) in seinem Editor: Ob er geöffnet ist, seine Breite, seine eingeklappten Zeilen, die Zeile, auf der der Tastaturfokus liegt, wohin sein Baum gescrollt ist sowie seine Suche und Optionen werden nicht gesendet.  
Auch die [Hervorhebung](../../guide/guides/relationship-editing.md#reading-a-connector), die beim Wechseln zu einem Fremdschlüssel auf der Verbindungslinie seiner Beziehung erscheint, wird nicht gesendet.  
Seit `4.2.0` bleibt auch die Registerkarte [Wörterbuch](../../guide/guides/dictionary.md) in ihrem Editor: Welches Blatt angezeigt wird sowie Suche, Auswahl, Scrollposition und Spaltenbreiten jedes Blatts werden nicht gesendet. Ihre Änderungen, Sortierungen und CSV-Importe werden dagegen gesendet.  
Scrollen, Zoomen oder ein Wechsel der Registerkarte wird gesendet, verschiebt aber nie die Ansicht eines anderen Benutzers und wechselt nie dessen Registerkarte. Das gilt auch für das Scrollen bei einem Sprung aus dem Explorer, für den Wechsel zur Registerkarte ERD, wenn der Explorer von einer anderen Registerkarte aus geöffnet wird, und für den Wechsel der Registerkarte und das Scrollen bei einem Sprung vom Blatt [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) der Registerkarte Wörterbuch zu einer Tabelle oder Spalte. Ein Sprung von diesem Blatt zu einem Wort, einem Begriff oder einer Domäne bleibt auf der Registerkarte Wörterbuch, daher wird nichts davon gesendet.

Seit `4.2.0` wird auch ein Wechsel der [Namensansicht](../../guide/guides/logical-names.md#switching-the-view) gesendet, und ihre [Sperre](../../guide/guides/settings.md#lock) entscheidet, was die anderen Editoren damit tun. Die Sperre `Name View` ist in einem neuen Diagramm und in jedem Dokument aus einer Version vor `4.2.0` eingeschaltet.  
Solange die Sperre eingeschaltet ist, zeigt sich der Wechsel nur in dem Editor, der ihn vorgenommen hat: Er wird zwar weiterhin gesendet, aber jeder andere Editor und jedes Replikat verwirft ihn, sodass jeder Benutzer eine andere Ansicht betrachten kann, während `value` die gesperrte behält.  
Solange die Sperre ausgeschaltet ist, ändert ein Wechsel in einem Editor, der bearbeiten kann, die Namensansicht in jedem Editor und jedem Replikat, wobei sich der letzte Wechsel durchsetzt, und jeder von ihnen speichert sie.  
Der eigene Wechsel eines schreibgeschützten Editors bleibt immer in diesem Editor, und der Editor folgt weiterhin den gemeinsamen Wechseln der anderen.

Seit `5.1.0` folgt eine Änderung der Sprache des [Codegenerators](../../guide/guides/code-generator.md), der Schreibweise der Tabellennamen, der Schreibweise der Spaltennamen oder des Begrenzertyps genauso ihrer eigenen Sperre (`Language`, `Table Name Case`, `Column Name Case` oder `Bracket Type`), mit einem Unterschied: Solange die Sperre eingeschaltet ist, wird die Änderung gar nicht gesendet.  
Sie zeigt sich nur in dem Editor, der sie vorgenommen hat, dessen Registerkarten Codegenerator und Schema SQL ihr folgen, und kein anderer Editor und kein Replikat sieht sie. `value` und `runtimeValue` behalten den gesperrten Wert, sodass auch ein beitretender Editor, der aus einem beliebigen Editor initialisiert wurde, sie nicht sieht und jeder Benutzer bei eingeschalteter Sperre eine andere Sprache, Schreibweise oder einen anderen Begrenzertyp vor sich haben kann.  
Solange die Sperre ausgeschaltet ist, wird eine Änderung, die in einem Editor vorgenommen wird, der bearbeiten kann, als gemeinsam markiert gesendet (`shared: true` in ihrer Payload). Sie ändert die Einstellung in jedem Editor und jedem Replikat, wobei sich die letzte Änderung durchsetzt, und jeder von ihnen speichert sie. Ein Editor oder Replikat der Version `5.1.0` wendet eine markierte Änderung an, was auch immer seine eigene Sperre sagt, sodass eine Änderung unmittelbar nach einem Entsperren überall übernommen wird, auch dort, wo sie vor dem Entsperren eintrifft.  
Vor `5.1.0` erreichte eine solche Änderung jeden Editor und jedes Replikat, unabhängig davon, ob ihre Sperre eingeschaltet war, während die Datei den gesperrten Wert behielt.

Seit `5.0.0` sendet ein [schreibgeschützter](../erd-editor-element.md#readonly) Editor überhaupt keine Änderung mehr. Die Zeilen für Scrollen, Zoom, Registerkarte, Namensansicht, Datenbank, Sprache des Code-Generators, Schreibweisen, Begrenzertyp und `View Option`, die sein Leser ändert, bleiben auf seinem Bildschirm, was auch immer ihre Sperren sagen; vor `5.0.0` wurden seine Scrollvorgänge, Zoomänderungen, Registerkartenwechsel, die Datenbank und die Code-Einstellungen wie die eines bearbeitbaren Editors gesendet.  
Sein Store sendet weiterhin, was seine Tracker vom Mauszeiger, Fokus, der Auswahl und dem Auswahlrahmen des Lesers senden, beantwortet die Register, die ein beitretender Editor anfordert, und wendet jede Änderung an, die die anderen senden. Eine Änderung der Datenbank, einer Einstellung des Codegenerators oder einer Zeile von `View Option` erreicht sein Dokument und auch seinen Bildschirm, es sei denn, sein Leser hat diese Einstellung dort geändert; ein gemeinsamer Wechsel der Namensansicht ist in jedem Fall auf seinem Bildschirm zu sehen. Seit `5.1.0` erhält er eine Einstellung des Codegenerators nur, wenn sie bei ausgeschalteter Sperre geändert wurde oder ein Entsperren sie mitbringt.  
Wenn der Editor schreibgeschützt wird, sendet er zuerst, was der Store von einem Ziehen oder Scrollen noch zurückhält, so wie es [flushStreamBuffers](#flushstreambuffers) tut, damit die anderen das Letzte davon behalten.

[Sperren](../../guide/guides/settings.md#lock) werden gemeinsam genutzt: Das letzte Sperren oder Entsperren einer Einstellung setzt sich in jedem Editor durch, und eine Sperre trägt die Werte des Editors mit, der sie eingeschaltet hat, sodass jeder Editor und jedes Replikat denselben Wert speichert.  
Eine Sperre `Viewport` speichert daher die Ansicht des Editors, der sie eingeschaltet hat, und eine Sperre `Canvas Type` die letzte Registerkarte, auf der dieser Editor vor der Registerkarte Einstellungen war, auf der Sperren eingeschaltet werden.  
Das Ausschalten der Sperre `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` oder seit `4.2.0` `Name View` setzt diese Einstellung außerdem in jedem Editor auf den Wert, den der Editor anzeigt, der sie ausgeschaltet hat, einschließlich seiner eigenen Änderung unter der Sperre, sodass alle weiterhin einen einzigen Wert speichern. Das Ausschalten von `Viewport` oder `Canvas Type` verändert bei niemandem die Ansicht oder die Registerkarte.

Eine Änderung am Skript `Before tables` oder `After tables` wird als Ganzes gesendet, wenn sein Feld den Fokus verliert. Die beiden Skripte werden getrennt abgeglichen, sodass die Änderung eines Mitbearbeiters am einen nie das andere überschreibt.

Nichts, was im [Flow-Modus](../../guide/guides/visualization.md#flow-never-edits-the-document) der Registerkarte Visualisierung getan wird, ist eine Änderung am Dokument, deshalb sendet ein Editor in Flow den anderen keine Änderungen, und die Änderungen, die sie senden, werden weiter angewendet, solange er dort ist.  
Es gibt zwei Ausnahmen. Der Wechsel von Flow zu einer anderen Registerkarte ist ein Wechsel der Registerkarte und wird wie jeder andere gesendet. Seit `4.2.0` ist eine Auswahl in der Liste der Namensansicht auf der Symbolleiste von Flow ein Wechsel der Namensansicht und wird wie ein auf der Zeichenfläche vorgenommener Wechsel gesendet und angewendet.  
`Previous table`, `Next table` sowie die Tasten für Rückgängig und Wiederholen, mit denen Sie in Flow die Ansichten [schrittweise durchlaufen](../../guide/guides/visualization.md#previous-table-and-next-table), werden nicht gesendet.  
Die Kartenschaltfläche für den externen Link, ein nach `#`, `@` oder `:` gewähltes Ergebnis der [Schnellsuche](../../guide/guides/quick-search.md#searching-the-diagram) und das Öffnen des [Explorers](../../guide/guides/explorer.md#opening-and-closing) wechseln alle von Flow zur Registerkarte ERD. Ein Scrollen, das die Kartenschaltfläche oder ein Ergebnis der Schnellsuche dort auslöst, wird ebenfalls gesendet.

## Zwei Editoren auf einer Seite {#two-editors-on-one-page}

Die Verdrahtung von subscribe zu dispatch steht hier für das Netzwerk, sodass Sie den Aufbau einer Sitzung sehen können, ohne dass ein Transport dazwischensteht.

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

Beide Editoren beginnen hier mit demselben neuen, leeren Dokument, sodass keiner von beiden initialisiert werden muss.  
Bei drei oder mehr Editoren senden Sie die Stapel jedes Editors an alle anderen: Ein Editor gibt nie weiter, was er empfangen hat.

## Einen Mitbearbeiter initialisieren {#seeding-a-collaborator}

Ein gemeinsamer Store leitet Änderungen weiter, sobald sie vorgenommen werden, und übergibt einem beitretenden Editor nie das Dokument in seinem aktuellen Zustand, sodass ein Editor, der einer bereits laufenden Sitzung beitritt, zuerst das Dokument erhalten muss.  
Seit `4.0.0` initialisieren Sie ihn mit [`runtimeValue`](../erd-editor-element.md#runtimevalue) eines Editors, der sich bereits in der Sitzung befindet, nicht mit `value` oder der gespeicherten Datei.  
Ein Raum, der mit [`@dineug/erd-editor-yjs`](./yjs.md) gebunden ist, enthält das Dokument selbst, sobald ein Client ihn [initialisiert](./yjs.md#seeding-a-room) hat, sodass jeder an ihn gebundene Editor dieses Dokument öffnet, ohne dass ein `runtimeValue` übergeben wird.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Der Laufzeitwert enthält noch, was seit dem Öffnen des Dokuments entfernt wurde, sodass der beitretende Editor, wenn ein anderer Editor später ein Entfernen rückgängig macht, die Tabelle mit ihrem Namen und ihren Spalten zurückholt.  
[`value`](../erd-editor-element.md#value) ist die Form, die eine Datei enthält, ohne entfernte Entitäten, sodass ein beitretender Editor, der daraus oder aus der Datei initialisiert wurde, stattdessen eine leere, namenlose Tabelle zurückholen würde.  
Seit `4.2.0` gilt dasselbe für ein Wort, einen Begriff oder eine Domäne, die von einem Blatt der Registerkarte [Wörterbuch](../../guide/guides/dictionary.md) entfernt wurden: Macht ein anderer Editor das Entfernen rückgängig, listet ein aus `runtimeValue` initialisierter beitretender Editor die Zeile wieder vollständig auf, und einer, der aus `value` initialisiert wurde, listet eine leere Zeile auf, die sein eigener Wert `value` dann weglässt.  
Schreiben Sie weiterhin `value` in den Speicher: `runtimeValue` dient nur dazu, einen anderen Editor, eine zweite Ansicht oder einen [replicationStore](./remote-storage.md) zu initialisieren.  
Die Editoren in VS Code, Obsidian, einer JetBrains-IDE und der Web-App initialisieren auf diese Weise eine zweite Ansicht eines geöffneten Dokuments.

`setInitialValue` wird nicht weitergeleitet, sodass das Initialisieren des beitretenden Editors bei den anderen nichts ändert.  
Seit `4.0.0` verwirft die Methode außerdem die Kollaborationsregister des Editors, die [gleichzeitige Bearbeitungen](#concurrent-edits) abgleichen. Hat der gemeinsame Store des Editors bereits einen Abonnenten gehabt, fragt der Store die anderen Editoren erneut nach deren Registern, wie bei seinem ersten [subscribe](#subscribe), sodass ein mitten in einer Sitzung erneut geladener Editor Bearbeitungen so abgleicht wie die anderen.  
Eine Zuweisung an `value` behält die Register bei, wird aber anders als `setInitialValue` weitergeleitet: Sobald der Editor einen gemeinsamen Store hat, lädt jeder Editor in der Sitzung das zugewiesene Dokument. Initialisieren Sie einen beitretenden Editor daher nie auf diese Weise.

Weder `value` noch `runtimeValue` enthält die Register oder die Version, die die Uhr des Editors erreicht hat, sodass ein Editor, der allein aus `runtimeValue` initialisiert wurde, sie der Antwort entnimmt, die die Editoren in der Sitzung auf sein erstes Abonnieren senden.  
Bis diese Antwort eintrifft, kann eine Bearbeitung des beitretenden Editors eine niedrigere Version tragen als die der anderen, sodass diese sie ablehnen, während sie auf dem beitretenden Editor bleibt, und ein älterer Schreibvorgang, der noch unterwegs ist, überschreibt den neueren, den die Initialisierung enthält. Antwortet kein laufender Editor, etwa weil ein Server oder ein Dokumentspeicher das Dokument der Sitzung hält, erhält der beitretende Editor sie nie.  
Seit `5.1.0` übergeben Sie sie zusammen mit dem Wert. Rufen Sie in einem Editor der Sitzung [`flushStreamBuffers()`](#flushstreambuffers) auf, damit ein Ziehen oder eine Farbänderung, die er noch zurückhält, zuerst hinausgeht, und lesen Sie dann im selben Moment `runtimeValue` sowie [`getLWW()`](#getlww) und [`getVersion()`](#getversion) seines Stores. Der beitretende Editor lädt den Wert mit `setInitialValue` und übernimmt den Rest dann mit [`mergeLWW`](#mergelww) seines eigenen Stores, in dieser Reihenfolge, da jedes `setInitialValue` die Register verwirft. Seine nächste Bearbeitung trägt dann eine Version, die über allen der Initialisierung liegt, sodass sie übernommen wird, ohne auf eine Antwort warten zu müssen. Bei einem Store, den es schon gibt, erledigt [`reseed`](#reseed) beides in einem Aufruf.

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

Eine so aufbewahrte Initialisierung, mit der später beitretende Editoren geöffnet werden, hält alle drei zusammen. Sie ist keine Datei: In den Speicher schreiben Sie weiterhin `value`.  
Ein [replicationStore](./remote-storage.md#runtimevalue-getter) übergibt keine Register, sodass ein aus seinem `runtimeValue` initialisierter beitretender Editor sie weiterhin der Antwort der Editoren entnimmt.

## Gleichzeitige Bearbeitungen {#concurrent-edits}

Jeder Editor und jedes Replikat hält für jeden Namen und nahezu jedes andere Feld die Version des Schreibvorgangs, der es gesetzt hat: Das sind seine Kollaborationsregister. Ein Schreibvorgang wird nur übernommen, wenn seine Version nicht unter der gehaltenen liegt, sodass Editoren, die dieselben Änderungen in unterschiedlicher Reihenfolge hören, mit demselben Dokument enden.  
Seit `5.1.0` trägt jede Version unter ihrem Zähler einen Platz des schreibenden Editors, der aus dessen ID stammt. Versionen wachsen daher in Schritten von 4.194.304 und übersteigen eine 32-Bit-Ganzzahl, sobald der Zähler 512 erreicht. `JSON.stringify` und `JSON.parse` übertragen sie unverändert, aber eine Weiterleitung oder ein Speicher, der sie in einer anderen Sprache parst, muss sie als 64-Bit-Zahlen halten, nie als 32-Bit-Ganzzahlen.

Seit `5.1.0` enden zwei Editoren, die im selben Moment denselben Namen oder dasselbe Feld ändern, abgesehen von den unten genannten Ausnahmen, mit demselben Wert in jedem Editor und jedem Replikat: Sie schreiben mit demselben Zähler, stempeln aber zwei verschiedene Versionen, und die größere gewinnt überall. Vor `5.1.0` konnten beide dieselbe Version stempeln, und jeder Editor behielt die, die er zuletzt hörte, sodass sie auseinanderlaufen konnten. Zwei Editoren teilen sich einen Platz mit einer Wahrscheinlichkeit von 1 zu 4.194.304 je Paar, und dann herrscht wie zuvor Gleichstand.

Seit `5.1.0` werden die Position einer Tabelle, die Position und Größe einer Notiz oder Tabellengruppe sowie der Ursprung und die Zoomstufe der Ansicht auf dieselbe Weise mit Versionen versehen, und was sie bewegt, wird als das Ziel gesendet, an dem sie enden:

- ein Ziehen als ein `table.moveTo`, `memo.moveTo` oder `tableGroup.moveTo` je bewegter Entität in einem Stapel, sodass ein Ziehen einer Gruppe die Punkte ihrer Tabellen und seit `5.1.1` ihrer Notizen mit dem der Gruppe mitführt;
- das Rückgängigmachen oder Wiederholen eines Ziehens als der Punkt, an den es jede Entität setzt;
- ein Verschieben der Ansicht als `settings.scrollTo` und ein Zoomen als `settings.changeZoomLevel`;
- eine Größenänderung einer Notiz oder Tabellengruppe als ihre Position und Größe zusammen.

Zwei Benutzer, die im selben Moment eine Tabelle, Notiz oder Tabellengruppe verschieben oder verschieben und in der Größe ändern, enden daher mit ihr an einem Punkt und in einer Größe in jedem Editor und jedem Replikat. Der Punkt geht an den Schreibvorgang mit der größeren Version, beide Achsen zusammen. Ein Verschieben schreibt keine Größe, sodass eine Größenänderung ihre Größe behält, auch wenn ein gleichzeitig vorgenommenes Verschieben den Punkt übernimmt.  
Vor `5.1.0` wurde ein Ziehen als zurückgelegte Entfernung gesendet, sodass sich zwei Ziehvorgänge derselben Tabelle addierten und ein gleichzeitiges Verschieben und Ändern der Größe derselben Notiz oder Tabellengruppe auseinanderlaufen konnte.  
Ein Ziehen unter 20 px, das keinen Rückgängig-Eintrag hinterlässt, wird wie jedes andere gesendet, sodass es als Punkt ein Ziehen derselben Entität überschreiben kann, das ein anderer Benutzer im selben Moment vorgenommen hat. Ein Stapel eines Ziehens, Verschiebens der Ansicht oder Zoomens, den ein Transport doppelt zustellt, bewegt nichts doppelt.

Eine Farbänderung ist eine Ausnahme. Sie geht ohne Version hinaus, und jeder Editor und jedes Replikat stempelt sie mit seiner eigenen Version und behält die Farbe, die er zuletzt hörte, sodass zwei Benutzer, die im selben Moment dieselbe Tabelle, Notiz oder Tabellengruppe umfärben, mit verschiedenen Farben enden können.  
Für einige Änderungen wird überhaupt keine Version geführt, sodass jeder Editor und jedes Replikat sie in der Reihenfolge anwendet, in der er sie hört, und zwei im selben Moment vorgenommene ebenfalls auseinanderlaufen können: eine Spalte, die innerhalb ihrer Tabelle oder ihres Index verschoben wird (`column.move`, `indexColumn.move`), und eine Änderung der [Datenbank](../../guide/guides/table-related-functions.md#databases), einer Zeile von [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) oder von `Relationship DataType Sync`, `Maximum comment width` oder `Column Order` auf der Registerkarte [Einstellungen](../../guide/guides/settings.md).  
Entitäten, die zwei Benutzer im selben Moment hinzufügen, etwa zwei Tabellen oder zwei Spalten einer Tabelle, können außerdem in jedem Editor und jedem Replikat in einer anderen Reihenfolge stehen, und jeder speichert in seinem `value` seine eigene Reihenfolge.

All das gilt unter Editoren und Replikaten der Version `5.1.0` oder neuer; [Gemischte Versionen](#mixing-releases) beschreibt, was ein älterer daran ändert.

## Gemischte Versionen {#mixing-releases}

Ein Editor wendet nur die Aktionstypen an, die seine eigene Version kennt, sodass in einer Sitzung mit gemischten Versionen den älteren Editoren alles entgeht, was über einen neueren Typ übertragen wird.

Seit `3.10.0` wird eine Änderung an [ON DELETE oder ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) einer Beziehung über einen von zwei neuen Aktionstypen übertragen, `relationship.changeOnDelete` und `relationship.changeOnUpdate`, und `relationship.add` kann beide mitführen. Eine Weiterleitung, die Aktionen unverändert durchreicht, braucht dafür nichts Neues.  
Ein Editor einer Version vor `3.10.0` ignoriert diese Aktionstypen und Felder: Er erfährt nie ON DELETE oder ON UPDATE einer Beziehung, und ein mit ihm gespeichertes Dokument enthält keines von beiden. Eine Beziehung, die ein älterer Editor hinzufügt, kommt ohne sie an, sodass beide mit `Not set` beginnen.

Jede andere Änderung, die ein Editor der Version `3.10.0` sendet, wird über Aktionstypen übertragen, die ältere Editoren bereits kennen.  
`Replace All` in [Suchen und Ersetzen](../../guide/guides/find-and-replace.md#replacing) sendet die Änderungen als einen einzigen Stapel derselben Umbenennungs-, Kommentar- und Notizaktionen, die auch eine Änderung von Hand sendet. Die [Ansichtsoptionen](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` und `Referential Actions` werden über die bestehende Aktion `settings.changeShow` übertragen.

Seit `4.0.0` werden diese Änderungen über neue Aktionstypen übertragen, und eine Weiterleitung, die Aktionen unverändert durchreicht, braucht dafür nichts Neues:

- eine [Tabellengruppe](../../guide/guides/table-groups.md), die hinzugefügt, verschoben, in der Größe geändert, umbenannt, neu eingefärbt oder entfernt wird: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` und `tableGroup.remove`; eine Tabelle, die einer Gruppe beitritt oder sie verlässt: `table.changeGroup`;
- das Speichern mit `Save` im Dialog [Spalten zuordnen](../../guide/guides/relationship-editing.md#map-columns) für eine bestehende Beziehung, das beide ihrer Spaltenlisten auf einmal setzt: `relationship.changeColumns`;
- eine [Sperre](../../guide/guides/settings.md#lock), die ein- oder ausgeschaltet wird: `settings.changeLockSettings`;
- eine Änderung am Skript `Before tables` oder `After tables` auf der Registerkarte [Schema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Die Ansichtsoptionen `Table Groups` und `Memos` werden über die bestehende Aktion `settings.changeShow` übertragen.  
Die Aktion `settings.changeIgnoreSaveSettings`, die die Schalter `Save Scroll Information` und `Save Zoom Information` sendeten, bevor die Sperren sie ersetzten, wird nicht mehr gesendet, und `settings.changeRelationshipOptimization` gibt es nicht mehr. Ein Editor der Version `4.0.0`, der eine der beiden empfängt, ändert nichts.

Ein Editor einer Version vor `4.0.0` ignoriert die neuen Aktionstypen: Er sieht nie eine Tabellengruppe oder welche Tabellen zu ihr gehören, obwohl das Ziehen einer Gruppe die Tabellen der Gruppe dort trotzdem verschiebt, da es auch für jede dieser Tabellen eine Verschiebung sendet.  
Er behält nach dem Speichern mit `Save` im Dialog „Spalten zuordnen“ die alten Spalten einer Beziehung, und wenn in ihm eine Spalte dieser alten Zuordnung entfernt wird, verschwindet die Beziehung in jedem Editor. Er hat keine Sperren und keine Skripte.  
Ein mit einem solchen Editor gespeichertes Dokument enthält nichts davon, und ein Editor der Version `4.0.0` öffnet es mit allen Sperren im eingeschalteten Zustand.  
Halten Sie jeden Editor einer Sitzung und jeden [replicationStore](./remote-storage.md#dispatch-dispatchsync), der ihr Dokument speichert, auf `4.0.0` oder neuer.

Ein Editor der Version `4.1.0` sendet keinen neuen Aktionstyp, sodass Editoren und Replikate der Versionen `4.0.0` und `4.1.0` eine Sitzung teilen, ohne dass etwas verloren geht.  
In ihm durchsucht [Suchen und Ersetzen](../../guide/guides/find-and-replace.md#replacing) auch Indexnamen und Tabellengruppennamen, und `Replace` und `Replace All` benennen sie über die Aktionen `index.changeName` und `tableGroup.changeName` um, die ein Editor der Version `4.0.0` bereits anwendet.

Seit `4.2.0` werden diese Änderungen über neue Aktionstypen übertragen, und eine Weiterleitung, die Aktionen unverändert durchreicht, braucht dafür nichts Neues:

- der [logische Name](../../guide/guides/logical-names.md) einer Tabelle oder Spalte: `table.changeLogicalName` und `column.changeLogicalName`; ob ihr Name [aus den Wörterbüchern abgeleitet](../../guide/guides/dictionary.md#deriving-physical-names) wurde: `table.changeNameDerived` und `column.changeNameDerived`;
- eine Spalte, die mit einer [Domäne](../../guide/guides/dictionary.md#domains-and-data-types) verknüpft wird oder deren Verknüpfung aufgehoben wird: `column.changeDomain`;
- das Hinzufügen, Ändern (einschließlich der Position im Blatt, wie eine Sortierung sie setzt) oder Entfernen eines Worts, eines Begriffs oder einer Domäne auf der Registerkarte [Wörterbuch](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` und `dictionary.remove`;
- ein Wechsel der [Namensansicht](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Die Sperre `Name View` wird über die bestehende Aktion `settings.changeLockSettings` übertragen, die Ansichtsoption `Domain` über `settings.changeShow` und das Verschieben von `Logical Name` oder `Domain` in der [Spaltenreihenfolge](../../guide/guides/settings.md#adjusting-column-order) über `settings.changeColumnOrder`.  
Die Aktionen `editor.clear` und `editor.loadJson` eines Imports von Schema SQL, GraphQL, DBML oder AML über `Import` führen `keepDictionaries: true` mit, wodurch die Wörter, Begriffe und Domänen in jedem Editor erhalten bleiben. Dasselbe gilt für die eines ersetzenden Aufrufs von [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` oder `setSchemaAML`.  
Ein physischer Name, den die Wörterbücher ableiten, wird über `table.changeName` oder `column.changeName` übertragen und der Datentyp, den eine Domäne ihren Spalten gibt, über `column.changeDataType`, also über dieselben Aktionen, die auch eine Änderung von Hand sendet.

Ein Editor einer Version vor `4.2.0` ignoriert die neuen Aktionstypen: Er hat keine logischen Namen, keine Domänenverknüpfungen, keine Wörterbücher und keine Namensansicht. Das Sperren oder Entsperren von `Name View` ändert dort nichts, ebenso wenig das Verschieben von `Logical Name` oder `Domain` in der Spaltenreihenfolge oder das Verschieben einer anderen Zeile auf eine der beiden. Auch eine Sperre `Canvas Type`, die ein Editor einschaltet, der von der Registerkarte Wörterbuch zur Registerkarte Einstellungen gekommen ist, ändert dort nichts: Der ältere Editor kennt diese Registerkarte nicht, daher lässt er `Canvas Type` entsperrt. Er zeigt weiterhin die physischen Namen, die die Wörterbücher ableiten, und die Datentypen, die Domänen vergeben.  
Seine eigenen Änderungen wissen nichts von logischen Namen, Domänen oder den Wörterbüchern, was sich so auf die neueren Editoren auswirkt:

- Bei einer Tabelle oder Spalte, die er von Hand umbenennt, bleibt der Name als abgeleitet markiert, sodass ein logischer Name, der später in einem neueren Editor für sie eingegeben wird, den Namen erneut ableiten und dabei den von ihm eingetippten überschreiben kann.
- Ein Datentyp, den er einer mit einer Domäne verknüpften Spalte gibt, lässt die Verknüpfung bestehen, sodass das Blatt `Checks` die Prüfung `Domain type mismatch` auflistet und die nächste Typänderung der Domäne der Spalte wieder den Typ der Domäne gibt.
- Die Fremdschlüsselspalten einer Beziehung, die er hinzufügt, erhalten von ihrem Schlüssel keinen logischen Namen und keine Domäne.
- Eine Tabelle, die er einfügt oder dupliziert, kommt ohne logische Namen und ohne Domänenverknüpfungen an.
- Ein Import von Schema SQL, GraphQL, DBML oder AML in ihm sendet kein `keepDictionaries` und leert daher die Wörter, Begriffe und Domänen in jedem Editor.
- Macht er ein Laden, einen Import oder `clear()` rückgängig, lädt er seine eigene Kopie des Dokuments in jeden Editor, und diese Kopie hat keine logischen Namen, keine Domänenverknüpfungen und keine Wörterbücher.
- Diese Kopie und das Dokument, das ein Import von Schema SQL, GraphQL, DBML oder AML in ihm lädt, setzen außerdem die Sperre `Name View` in jedem Editor auf den Zustand zurück, in dem der ältere Editor sie vorgefunden hat. Jeder Editor speichert dann `Physical Names` als Namensansicht und zeigt sie auch an, wenn die Sperre ausgeschaltet ist.

Ein mit einem solchen Editor gespeichertes Dokument hat keine logischen Namen, keine Domänenverknüpfungen, keine Wörterbücher und keine Namensansicht, daher öffnet ein Editor der Version `4.2.0` es in der Ansicht `Physical Names`. Die Sperre `Name View` speichert der ältere Editor dagegen so, wie er sie vorgefunden hat, sodass ein in einem Editor der Version `4.2.0` entsperrtes Dokument entsperrt bleibt.  
Halten Sie jeden Editor einer Sitzung und jeden [replicationStore](./remote-storage.md#dispatch-dispatchsync), der ihr Dokument speichert, auf `4.2.0` oder neuer.

Ein Editor der Version `5.1.0` sendet keinen neuen Aktionstyp, sodass Editoren und Replikate vor `5.1.0` weiterhin eine Sitzung mit ihm teilen und eine Weiterleitung, die Aktionen unverändert durchreicht, nichts Neues braucht. Was [Gleichzeitige Bearbeitungen](#concurrent-edits) beschreibt, gilt jedoch nur unter Editoren und Replikaten der Version `5.1.0`:

- Das Ziehen eines Editors der Version `5.1.0` wird als Punkte über `table.moveTo`, `memo.moveTo` und `tableGroup.moveTo` übertragen, die ältere Editoren bereits anwenden, sein Verschieben der Ansicht und Zoomen als Punkte über `settings.scrollTo` und `settings.changeZoomLevel`, die, wie jedes Verschieben der Ansicht und Zoomen, kein anderer Editor anwendet und nur Replikate übernehmen. Ein älterer Editor wendet jeden Punkt eines Ziehens in der Reihenfolge an, in der er eintrifft, außerhalb jedes Registers, und ein älteres Replikat tut dasselbe mit jedem Punkt eines Ziehens, Verschiebens der Ansicht oder Zoomens, sodass zwei Punkte, die im selben Moment für eine Entität oder für die Ansicht gesendet werden, dort auseinanderlaufen können.
- Das Ziehen eines älteren Editors wird weiterhin als zurückgelegte Entfernung übertragen, die jeder Editor und jedes Replikat außerhalb seiner Register addiert, sein Verschieben der Ansicht oder Zoomen ebenfalls als Entfernung, die jedes Replikat auf dieselbe Weise addiert. Eine Entfernung und ein Punkt, die im selben Moment für eine Entität entstehen, können in Editoren und Replikaten, die sie in unterschiedlicher Reihenfolge hören, auseinanderlaufen, und eine Entfernung, die ein Transport doppelt zustellt, wird doppelt addiert.
- Außerhalb der Ausnahmen, die [Gleichzeitige Bearbeitungen](#concurrent-edits) nennt, setzt sich der Schreibvorgang eines Editors der Version `5.1.0` für einen Namen oder ein Feld, der im selben Moment wie der eines älteren Editors erfolgt, fast immer durch, mit demselben Ergebnis in jedem Editor und jedem Replikat. Zwei ältere Editoren können über ein im selben Moment geschriebenes Feld weiterhin auseinanderlaufen.
- Ein Editor der Version `5.1.0` sendet eine Änderung der Sprache des Codegenerators, der Schreibweise oder des Begrenzertyps nur, solange ihre Sperre ausgeschaltet ist, mit der Markierung `shared: true`, die ein älterer Editor ignoriert, indem er die Änderung wie bisher anwendet. Ein älterer Editor sendet eine, die er unter der Sperre vornimmt, weiterhin unmarkiert: Ein Editor oder Replikat der Version `5.1.0` verwirft sie, solange diese Einstellung dort gesperrt ist, und ältere Editoren wenden sie an. Unter einer Sperre folgen die älteren Editoren daher den Auswahlen der jeweils anderen, während die Editoren der Version `5.1.0` ihre eigenen behalten, und die Datei behält in beiden Fällen den gesperrten Wert. Ein Entsperren in einer der beiden Versionen bringt den Wert des Entsperrenden in jeden Editor und jedes Replikat.
- Ein Laden, das das Dokument ersetzt, etwa ein zugewiesenes `value`, `clear()` oder ein ersetzender Import, beendet in jedem Editor der Version `5.1.0` das Ziehen einer Beziehung, sowohl in dem, der es vorgenommen hat, als auch in jedem, der es empfängt. Ein älterer Editor hält sein Ziehen dabei aktiv.

Halten Sie jeden Editor einer Sitzung und jeden [replicationStore](./remote-storage.md#dispatch-dispatchsync), der ihr Dokument speichert, auf `5.1.0` oder neuer, damit im selben Moment vorgenommene Bearbeitungen überall gleich enden, abgesehen von den Ausnahmen, die [Gleichzeitige Bearbeitungen](#concurrent-edits) nennt; `4.2.0` oder neuer erhält weiterhin die logischen Namen und Wörterbücher. Ein [MCP-Server](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) vor `1.2.0` zählt hier als Editor vor `5.1.0`, und ein Editor vor `5.1.0` lässt sich überhaupt nicht an einen [Yjs](./yjs.md)-Raum binden.

Seit `5.1.1` wird es über einen neuen Aktionstyp, `memo.changeGroup`, übertragen, wenn eine Notiz in eine [Tabellengruppe](../../guide/guides/table-groups.md) aufgenommen wird oder sie verlässt, und ein Relay, das Aktionen unverändert weiterleitet, braucht dafür nichts Neues. Er wird gesendet für eine Notiz, die beim Ablegen in eine Gruppe hinein- oder aus ihr herausbewegt wird, für eine neue Gruppe, die um eingeblendete Notizen ohne Gruppe gezeichnet wird, für `Group selected tables`, wenn neben den Tabellen auch Notizen ausgewählt sind, für `Remove from group`, wenn die Auswahl Notizen enthält, für jede Notiz einer entfernten Gruppe, für die Aufrufe eines Coding-Agenten zu Notizgruppen über den [MCP-Server](../../mcp/tools.md#table-groups) und für das Rückgängigmachen und Wiederholen von jedem davon. Auch ein Anhängen per `Import and Add` oder `setSchemaJSON`, dessen Gruppen Notizen enthalten, sendet ihn, ebenso dessen Wiederholen, während sein Rückgängigmachen nur diese Notizen entfernt.

Ein Editor oder Replikat vor `5.1.1` ignoriert `memo.changeGroup`, und sein Parsen verwirft das Feld `groupId` jeder Notiz, sodass er nie eine Notiz in einer Gruppe sieht, auch wenn das Ziehen einer Gruppe in einem Editor der Version `5.1.1` die Notizen der Gruppe dort weiterhin mitbewegt, da dieser für jede von ihnen zusätzlich ein `memo.moveTo` sendet. Seine eigenen Bearbeitungen wissen nichts von den Gruppen der Notizen, mit diesen Folgen für die neueren Editoren:

- Eine Notiz, die er in den Rahmen einer Gruppe zieht, bleibt außerhalb der Gruppe, und eine Notiz der Gruppe, die er aus dem Rahmen herauszieht, bleibt in ihr, wobei sich der Rahmen dehnt, um sie zu halten.
- Sein Ziehen einer Gruppe bewegt, wie sein `Auto Layout`, die Gruppe und ihre Tabellen, lässt die Notizen der Gruppe aber dort stehen, wo sie sind, und der Rahmen dehnt sich, um die eingeblendeten dort zu halten.
- Ein `Import and Add` in ihm nimmt keine Notiz in die Gruppen auf, die dabei hinzukommen.
- Eine Gruppe, die er entfernt, lässt das Feld `groupId` jeder ihrer Notizen weiter auf sie zeigen: Die Notizen gelten als in keiner Gruppe, und sein Rückgängigmachen des Entfernens nimmt sie wieder in die Gruppe auf.
- Sein Rückgängigmachen eines Ladens, eines Imports oder von `clear()` lädt seine eigene Kopie des Dokuments in jeden Editor, und diese Kopie hat keine Notiz in einer Gruppe.

Ein in einem solchen Editor gespeichertes Dokument hat keine Notiz in einer Gruppe, auch wenn ein Editor ab `4.0.0` die Gruppen der Tabellen beibehält.  
Halten Sie jeden Editor einer Sitzung und jeden [replicationStore](./remote-storage.md#dispatch-dispatchsync), der ihr Dokument speichert, auf `5.1.1` oder neuer, damit Notizen in ihren Tabellengruppen bleiben; `5.1.0` oder neuer gleicht weiterhin zeitgleich vorgenommene Bearbeitungen ab. Auch ein [MCP-Server](../../mcp/installation.md#updating) vor `1.2.1` sieht nicht, in welcher Tabellengruppe eine Notiz ist, und behält es auch nicht.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Legt den Nickname fest, der in den anderen Editoren neben dem Mauszeiger dieses Benutzers angezeigt wird.  
Andere Benutzer sehen `user`, wenn der Nickname fehlt oder leer ist.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Überträgt den Mauszeiger dieses Benutzers an die anderen Editoren. Der Standardwert ist `true`.  
Von anderen Benutzern gesendete Mauszeiger werden auf der ERD-Zeichenfläche immer angezeigt.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Überträgt, woran dieser Benutzer gerade arbeitet. Der Standardwert ist `true`.  
Die Tabelle und die Zelle, die Sie fokussiert haben, die Tabellen, Notizen und Tabellengruppen, die Sie ausgewählt haben, und der Auswahlrahmen, den Sie auf der Zeichenfläche aufziehen, werden an die anderen Editoren gesendet und dort gezeichnet.  
Jeder Benutzer erhält eine eigene Farbe, sodass Sie die Benutzer unterscheiden können: ein Umriss um die fokussierte Tabelle, eine Unterstreichung der fokussierten Zelle, ein Ring um die ausgewählten Tabellen, Notizen und Tabellengruppen und ein gestricheltes Rechteck für den Auswahlrahmen.  
Seit `4.2.0` kann jeder Benutzer eine andere [Namensansicht](../../guide/guides/logical-names.md#collaborators) vor sich haben, solange ihre Sperre eingeschaltet ist oder nachdem ein schreibgeschützter Editor selbst gewechselt hat. Eine fokussierte Zelle, die Ihre Ansicht nicht zeigt, wird an der Zelle unterstrichen, die die Ansicht an ihrer Stelle zeigt: Der Name und der logische Name vertreten einander, ebenso der Datentyp und die Domäne.  
Präsenzinformationen, die von anderen Benutzern eintreffen, werden immer auf Ihrer Zeichenfläche gezeichnet, unabhängig davon, ob diese Option eingeschaltet ist.  
Im Flow-Modus der Registerkarte Visualisierung werden Fokus und Auswahl anderer Benutzer auf den Tabellenkarten gezeichnet, ihre Auswahlrahmen jedoch nicht. Die Tabellen, die Sie dort auswählen, werden weiterhin gesendet; der Auswahlrahmen, den Sie dort aufziehen, nicht.

```js
editor.getSharedStore({ focusTracker: false });
```

Schalten Sie beide Tracker aus, um den gemeinsamen Store als reine Weiterleitung zu nutzen, die keine eigenen Präsenzinformationen veröffentlicht.  
Präsenzinformationen, die andere Editoren senden, werden weiterhin empfangen und gezeichnet.  
So machen es die Editoren in VS Code, Obsidian, einer JetBrains-IDE und Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Mauszeiger, Fokus, Auswahl und Auswahlrahmen werden im selben Stream wie die Änderungen am Dokument übertragen, sind aber flüchtig.  
Sie gelangen nie in das Dokument, den Verlauf oder `editor.value`, sodass ein Transport sie verwerfen darf und ein replicationStore sie ignoriert.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Diese Methoden legen den aktuellen Verbindungsstatus fest.  
Solange die Verbindung getrennt ist, werden Änderungen intern gepuffert.  
Die gepufferten Änderungen werden an die Abonnenten ausgegeben, sobald die Übertragung wieder möglich ist.  
Der Standardzustand ist verbunden (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Wendet Änderungen anderer Editorinstanzen auf die aktuelle Editorinstanz an.  
Enthält ein Stapel die Anforderung der Register durch einen anderen Editor, wie sie das erste [subscribe](#subscribe) eines beitretenden Editors sendet, antwortet der Store über seine Abonnenten mit seinen Registern und seiner Version, es sei denn, er hält keine Register.  
Seit `5.1.0` sendet er dabei zuerst jeden Stream-Stapel, den er noch zurückhält, so wie es [flushStreamBuffers](#flushstreambuffers) tut, sodass jede Version, die seine Antwort trägt, auf einem Schreibvorgang beruht, der den anderen gesendet wurde. Das Eintreffen eines beitretenden Editors lässt daher jeden Editor der Sitzung sofort ein Ziehen, Verschieben der Ansicht, Zoomen, eine Farbänderung oder Größenänderung einer Notiz senden, die er noch zurückhält.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Abonniert Änderungen im Editor.  
Nichts verlässt den Editor, solange es nicht mindestens einen Abonnenten gibt, und vorher vorgenommene Änderungen werden gepuffert.  
Beim ersten Abonnieren werden außerdem die anderen Editoren nach ihren Kollaborationsregistern gefragt, die [gleichzeitige Bearbeitungen](#concurrent-edits) abgleichen, sodass ein später beitretender Editor sie auf dieselbe Weise abgleicht.  
Das Dokument wird dabei nicht übertragen. [Initialisieren](#seeding-a-collaborator) Sie einen später beitretenden Editor daher zuerst; seit `5.1.0` kann die Initialisierung auch die Register mitführen.  
Seit `4.0.0` fragt der Store jedes Mal erneut, wenn `setInitialValue`, seit `5.1.0` auch [reseed](#reseed), nach diesem ersten Abonnieren ein Dokument in seinen Editor lädt.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Sendet die Stream-Stapel, die dieser Store noch zurückhält, sofort statt nach ihrer Ruhephase.  
Seit `3.9.2` funktioniert die Methode bei einem Store aus `getSharedStore`; in `3.9.1` ist sie im Typ vorhanden, bewirkt aber nichts.  
Das Verschieben einer Tabelle, Notiz oder Tabellengruppe, das Ändern ihrer Farbe, das Ändern der Größe einer Notiz sowie das Scrollen oder Zoomen der Ansicht entstehen jeweils als Stream kleiner Änderungen. Bei der Größenänderung einer Tabellengruppe ist das nicht so: Sie wird einmal gesendet, wenn das Ziehen endet.  
Der Store sammelt jeden Stream in einem Stapel und hält ihn zurück, bis der Stream 200 ms lang ruhig war, in zwei Stufen. Eine Farbänderung oder Größenänderung einer Notiz durchläuft beide und wird daher etwa 400 ms nach der letzten Änderung gesendet, so wie es vor `5.1.0` bei jedem Stream war. Seit `5.1.0` geht ein Ziehen, ein Verschieben der Ansicht oder ein Zoomen nach der ersten Stufe hinaus, etwa 200 ms nach seinem letzten Schritt, als das Ziel, an dem es endet (siehe [Gleichzeitige Bearbeitungen](#concurrent-edits)).  
Ein Aufruf beendet diese Wartezeit in beiden Stufen. Solange der Store verbunden ist, erhält ein Abonnent den Stapel, bevor der Aufruf zurückkehrt. Ein Aufruf, bei dem nichts zurückgehalten wird, sendet nichts.  
Die Methode `destroy`, ob die des Stores oder die des Editors, verwirft einen noch zurückgehaltenen Stapel. Rufen Sie daher zuerst diese Methode auf, wenn Sie einen Store aufgeben und die anderen die letzte Änderung behalten sollen, etwa wenn eine Registerkarte geschlossen wird.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Seit `5.1.0` gibt die Methode eine Kopie der Kollaborationsregister des Editors zurück (siehe [Gleichzeitige Bearbeitungen](#concurrent-edits)).  
Die Kopie wird über JSON erstellt, ist also ein einfaches Objekt, das für `JSON.stringify` bereit ist, und eine Änderung daran lässt die Register des Stores, wie sie waren.  
Übergeben Sie sie unverändert an [mergeLWW](#mergelww) oder [reseed](#reseed) eines anderen Stores. Ihre Form bestimmt allein der Editor, lesen Sie daher kein Feld daraus.  
Lesen Sie sie im selben Moment mit [getVersion](#getversion) und dem `runtimeValue` des Editors, um [einen beitretenden Editor zu initialisieren](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Seit `5.1.0` übernimmt die Methode Register, die ein anderer Store mit [getLWW](#getlww) herausgegeben hat, in die Register dieses Stores und behält dabei von jedem die größere Version, und sie übernimmt `version` in die Uhr des Editors, die die größere aus ihrer eigenen und der übergebenen behält.  
Sie ändert nichts am Dokument: kein Byte von `value` oder `runtimeValue`, keinen Rückgängig-Eintrag und kein Ereignis `change`. Sie hebt nur die Versionen an, die ein späterer Schreibvorgang übertreffen muss, sodass ein Schreibvorgang, der älter ist als die übergebenen Register, danach abgelehnt wird und die nächste Bearbeitung des Editors eine Version über `version` trägt.  
Sie sendet nichts und beantwortet nichts. Sie nimmt direkt auf, was ein beitretender Editor bei seinem ersten Abonnieren aus der Antwort der anderen erhält.  
Rufen Sie sie nach `setInitialValue` auf, nie davor: Jedes `setInitialValue` und jedes [reseed](#reseed) verwirft die gehaltenen Register und mit ihnen, was ein `mergeLWW` davor aufgenommen hat.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Seit `5.1.0` gibt die Methode die höchste Version zurück, die die Uhr des Editors zusammengeführt hat: die größte aus den Versionen der Änderungen, die er vorgenommen oder aufgenommen hat, der Anforderungen von Registern und der Antworten, die ein Beitritt austauscht, sowie jeder `version`, die an `mergeLWW` oder `reseed` übergeben wurde.  
Mauszeiger, Fokus, Auswahlen und Auswahlrahmen, seine eigenen oder die eines anderen Editors, verändern sie nicht.  
Übergeben Sie sie zusammen mit [getLWW()](#getlww), im selben Moment gelesen, an [mergeLWW](#mergelww) oder [reseed](#reseed) eines beitretenden Editors. Sie ist eine [Version](#concurrent-edits) wie die, die die Aktionen des Stores tragen.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Seit `5.1.0` entfernt die Methode sofort den Mauszeiger, den Fokus, die Auswahl und den Auswahlrahmen, die der Editor mit der angegebenen ID gesendet hat, sowie den Ablauf, auf den jedes davon wartete. Die aller anderen Editoren bleiben.  
Die ID ist die `meta.editorId`, die jede Aktion trägt, die der gemeinsame Store dieses Editors sendet. Eine ID, von der dieser Editor nichts hält, ändert nichts.  
Rufen Sie sie auf, wenn Ihr Transport erfährt, dass ein Teilnehmer gegangen ist. Andernfalls bleibt angezeigt, was der Teilnehmer gesendet hat, bis es abläuft: sein Mauszeiger 30 Sekunden nach dem zuletzt empfangenen, sein Fokus und seine Auswahl 90 Sekunden danach und sein Auswahlrahmen 3 Sekunden danach.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Seit `5.1.0` öffnet die Methode das Dokument einer Sitzung im Editor erneut, wie es ein Wiedereinstieg tut. Die [Yjs](./yjs.md)-Bindung ruft sie auf, um das Dokument eines Raums zu öffnen, wenn sie sich an einen Raum bindet, der initialisiert wurde, und bei jedem Wiedereinstieg wieder, wobei sie die Ansicht behält, sobald der Editor dem Raum beigetreten war.  
Sie lädt `value` wie [setInitialValue](../erd-editor-element.md#setinitialvalue) und übernimmt `lww` und `version` wie [mergeLWW](#mergelww), sodass der Store danach genau die übergebenen Register hält und seine Uhr die größere aus ihrer eigenen Version und `version`. Sie leert außerdem den Rückgängig-Verlauf und verwirft anders als `setInitialValue` die Auswahl und den Fokus, da sie benennen könnten, was der Wert nicht mehr enthält.  
Abgesehen vom unten genannten Ableiten aus einem logischen Namen erzeugt sie keinen Rückgängig-Eintrag, löst kein Ereignis `change` aus und sendet keine Änderung. Sobald der Store einen Abonnenten hatte, sendet sie die Anforderung der Register, die jedes solche Laden sendet und die ein Transport, der die Register schon übergeben hat, verwerfen darf, und, bei eingeschaltetem [focusTracker](#focustracker), die geleerte Auswahl und den geleerten Fokus.  
Wie `setInitialValue` funktioniert sie, solange [readonly](../erd-editor-element.md#readonly) gesetzt ist, verwirft eine Flow-Ansicht, beendet das Ziehen einer Beziehung und schließt die Editoren für Notizen, Tabellengruppennamen und Zellen, wobei sie das Eingetippte auf dieselbe Weise behält oder verwirft; ein Name, den eine sich schließende Zelle des logischen Namens aus dem ableitet, was ihr Leser eingetippt hat, ist eine gewöhnliche Bearbeitung: gesendet, rückgängig zu machen und als Ereignis `change` ausgelöst.

Ohne `keepScreen` zeigt der Bildschirm, was der Wert enthält, wie nach `setInitialValue`. Mit `keepScreen: true` wird der Bildschirm des Lesers wieder über das geladene Dokument gelegt, und zwar nur auf diesem Bildschirm:

- die Scrollposition und die Zoomstufe, sobald das Element sie gezeigt hat; eine, die nie gezeigt wurde, oder eine, die verborgen geladen und seither nicht gezeigt wurde, öffnet sich dort, wo der Wert sie hinsetzt, wie bei einem später beitretenden Editor;
- die Registerkarte, wenn das Laden sie verschoben hat, und auf der Registerkarte Einstellungen auch die Registerkarte, von der der Leser kam, die eine dort eingeschaltete Sperre `Canvas Type` nennt;
- die Namensansicht und jede Einstellung des Codegenerators, die der Leser unter ihrer Sperre für sich selbst zeigte, aber nur, wenn diese Sperre vor dem Laden eingeschaltet war, nach ihm weiterhin eingeschaltet ist und denselben gesperrten Wert hält. Hat also ein Teilnehmer inzwischen eine Einstellung entsperrt, geändert und mit einem anderen Wert wieder gesperrt, öffnet sich der Editor mit dem neuen gesperrten Wert, und wo die Sperre vor oder nach dem Laden ausgeschaltet ist, zeigt er den geladenen Wert;
- jede Einstellung, die ein schreibgeschützter Leser auf seinem eigenen Bildschirm geändert hat, was auch immer die Sperren sagen.

Nichts davon wird gesendet, und `value` und `runtimeValue` melden weiterhin das geladene Dokument. Ein späteres Entsperren durch einen Teilnehmer ersetzt eine so behaltene Einstellung des Codegenerators, wie es jedes Entsperren tut.  
Das nächste Scrollen oder Zoomen des Lesers, während der Editor bearbeiten kann, macht die behaltene Scrollposition und Zoomstufe wieder zu denen des Dokuments und geht hinaus, angeführt vom aktuellen Stand des Bildschirms, sodass Replikate diese Zoomstufe ebenfalls übernehmen.

Das Neuinitialisieren lässt, was der Store zurückhält, unverändert. Ein noch zurückgehaltenes Ziehen, Verschieben der Ansicht oder Zoomen geht danach hinaus, aus dem neu initialisierten Dokument gelesen; eine Farbänderung oder Größenänderung einer Notiz geht so hinaus, wie sie vorgenommen wurde, obwohl der Editor sie nicht mehr zeigt; und was `disconnect()` zurückhielt, geht bei `connection()` hinaus.  
Rufen Sie daher zuerst [flushStreamBuffers](#flushstreambuffers) auf, senden Sie, was dabei ausgegeben wird, und initialisieren Sie neu mit einem Wert, der es enthält. Initialisieren Sie nie neu, solange die Verbindung getrennt ist.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Zerstört die sharedStore-Instanz vollständig.  
Der Editor selbst bleibt unberührt, sodass das Dokument nach dem Verlassen einer Sitzung bearbeitbar bleibt.  
Die Maus- und Fokus-Tracker werden beendet, sobald der letzte sharedStore, den der Editor ausgegeben hat, zerstört ist.  
Ein Stream-Stapel, den der Store noch zurückhält, wird mit ihm verworfen; rufen Sie zuerst [flushStreamBuffers](#flushstreambuffers) auf, um ihn zu senden.  
Die Mauszeiger, der Fokus, die Auswahlen und die Auswahlrahmen, die andere Editoren gesendet haben, bleiben angezeigt, bis sie ablaufen; seit `5.1.0` entfernt [forgetPeer](#forgetpeer) die eines Editors sofort.

```js
sharedStore.destroy();
```
