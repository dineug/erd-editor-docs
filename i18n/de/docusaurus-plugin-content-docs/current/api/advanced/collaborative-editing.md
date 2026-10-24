---
sidebar_position: 1
description: Änderungen des Editors mit getSharedStore zwischen Instanzen weiterleiten, einen beitretenden Editor aus runtimeValue initialisieren und Mauszeiger, Fokus, Auswahl und Auswahlrahmen jedes Mitbearbeiters anzeigen.
---

# Gemeinsame Bearbeitung

`getSharedStore()` macht einen Editor zu einem Knoten in einer gemeinsamen Sitzung.  
Der Editor gibt dann jede Änderung als Stream von Aktionen aus und wendet die Aktionen an, die andere Editoren zurücksenden – den Transport zwischen ihnen (WebSocket, WebRTC oder alles andere, was JSON übertragen kann) stellen Sie selbst bereit.  
`getSharedStore()` ist eine der Methoden von [ErdEditorElement](../erd-editor-element.md) und lässt sich mit [Remote-Speicherung](./remote-storage.md) kombinieren, wenn die weitergeleiteten Änderungen auch gespeichert werden müssen.

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

Eine Aktion ist ein einfaches serialisierbares Objekt, das eine Änderung am Dokument beschreibt, sodass sie `JSON.stringify` auf dem Weg zum Transport übersteht.  
Aktionen kommen in Stapeln an: `subscribe` übergibt Ihnen ein Array, und dieses Array ist eine Einheit – leiten Sie es als Ganzes weiter und übergeben Sie es auf der anderen Seite als Ganzes an `dispatch`.  
Behandeln Sie eine Aktion als Blackbox und reichen Sie sie unverändert durch, statt sie zu lesen oder umzuschreiben, denn die Verwaltungsdaten, die sie mitführt, halten die Editoren synchron.

Einiges von dem, was ein Editor tut, bleibt in diesem Editor.  
Wenn eine Tabelle, Notiz oder Tabellengruppe in den Vordergrund geholt wird, wie es beim Auswählen geschieht, wird das nicht gesendet.  
Auch die Auswahl bei `Statements`, `Header`, `Write logical names into empty comments` (seit `4.2.0`) und `Tables` auf der Registerkarte [Schema SQL](../../guide/guides/schema-sql.md) wird nicht gesendet, denn sie gehört zu dem Fenster, in dem sie getroffen wird.  
Seit `4.1.0` bleibt auch der [Explorer](../../guide/guides/explorer.md) in seinem Editor: Ob er geöffnet ist, seine Breite, seine eingeklappten Zeilen, die Zeile, auf der der Tastaturfokus liegt, wohin sein Baum gescrollt ist sowie seine Suche und Optionen werden nicht gesendet.  
Auch die [Hervorhebung](../../guide/guides/relationship-editing.md#reading-a-connector), die beim Wechseln zu einem Fremdschlüssel auf der Verbindungslinie seiner Beziehung erscheint, wird nicht gesendet.  
Seit `4.2.0` bleibt auch die Registerkarte [Wörterbuch](../../guide/guides/dictionary.md) in ihrem Editor: Welches Blatt angezeigt wird sowie Suche, Auswahl, Scrollposition und Spaltenbreiten jedes Blatts werden nicht gesendet. Ihre Änderungen, Sortierungen und CSV-Importe werden dagegen gesendet.  
Scrollen, Zoomen oder ein Wechsel der Registerkarte wird gesendet, verschiebt aber nie die Ansicht eines anderen Benutzers und wechselt nie dessen Registerkarte. Das gilt auch für das Scrollen bei einem Sprung aus dem Explorer, für den Wechsel zur Registerkarte ERD, wenn der Explorer von einer anderen Registerkarte aus geöffnet wird, und für den Wechsel der Registerkarte und das Scrollen bei einem Sprung vom Blatt [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) der Registerkarte Wörterbuch zu einer Tabelle oder Spalte. Ein Sprung von diesem Blatt zu einem Wort, einem Begriff oder einer Domäne bleibt auf der Registerkarte Wörterbuch, daher wird nichts davon gesendet.

Seit `4.2.0` wird auch ein Wechsel der [Namensansicht](../../guide/guides/logical-names.md#switching-the-view) gesendet, und ihre [Sperre](../../guide/guides/settings.md#lock) entscheidet, was die anderen Editoren damit tun. Die Sperre `Name View` ist in einem neuen Diagramm und in jedem Dokument aus einer Version vor `4.2.0` eingeschaltet.  
Solange die Sperre eingeschaltet ist, zeigt sich der Wechsel nur in dem Editor, der ihn vorgenommen hat: Er wird zwar weiterhin gesendet, aber jeder andere Editor und jedes Replikat verwirft ihn, sodass jeder Benutzer eine andere Ansicht betrachten kann, während `value` die gesperrte behält. Bei einer Änderung der Sprache, einer Schreibweise oder des Begrenzertyps ist das anders: Sie erreicht jeden Editor, unabhängig davon, ob ihre Sperre eingeschaltet ist.  
Solange die Sperre ausgeschaltet ist, ändert ein Wechsel in einem Editor, der bearbeiten kann, die Namensansicht in jedem Editor und jedem Replikat, wobei sich der letzte Wechsel durchsetzt, und jeder von ihnen speichert sie.  
Der eigene Wechsel eines schreibgeschützten Editors bleibt immer in diesem Editor, und der Editor folgt weiterhin den gemeinsamen Wechseln der anderen.

[Sperren](../../guide/guides/settings.md#lock) werden gemeinsam genutzt: Das letzte Sperren oder Entsperren einer Einstellung setzt sich in jedem Editor durch, und eine Sperre trägt die Werte des Editors mit, der sie eingeschaltet hat, sodass jeder Editor und jedes Replikat denselben Wert speichert.  
Eine Sperre `Viewport` speichert daher die Ansicht des Editors, der sie eingeschaltet hat, und eine Sperre `Canvas Type` die letzte Registerkarte, auf der dieser Editor vor der Registerkarte Einstellungen war, auf der Sperren eingeschaltet werden.  
Das Ausschalten der Sperre `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` oder seit `4.2.0` `Name View` setzt diese Einstellung außerdem in jedem Editor auf den Wert, den der Editor anzeigt, der sie ausgeschaltet hat, sodass alle weiterhin einen einzigen Wert speichern. Das Ausschalten von `Viewport` oder `Canvas Type` verändert bei niemandem die Ansicht oder die Registerkarte.

Eine Änderung am Skript `Before tables` oder `After tables` wird als Ganzes gesendet, wenn sein Feld den Fokus verliert. Die beiden Skripte werden getrennt abgeglichen, sodass die Änderung eines Mitbearbeiters am einen nie das andere überschreibt.

Nichts, was im [Flow-Modus](../../guide/guides/visualization.md#flow-never-edits-the-document) der Registerkarte Visualisierung getan wird, ist eine Änderung am Dokument, deshalb sendet ein Editor in Flow den anderen keine Änderungen, und die Änderungen, die sie senden, werden weiter angewendet, solange er dort ist.  
Es gibt zwei Ausnahmen. Der Wechsel von Flow zu einer anderen Registerkarte ist ein Wechsel der Registerkarte und wird wie jeder andere gesendet. Seit `4.2.0` ist eine Auswahl in der Liste der Namensansicht auf der Symbolleiste von Flow ein Wechsel der Namensansicht und wird wie ein auf der Zeichenfläche vorgenommener Wechsel gesendet und angewendet.  
`Previous table`, `Next table` sowie die Tasten für Rückgängig und Wiederholen, mit denen Sie in Flow die Ansichten [schrittweise durchlaufen](../../guide/guides/visualization.md#previous-table-and-next-table), werden nicht gesendet.  
Die Kartenschaltfläche für den externen Link, ein nach `#`, `@` oder `:` gewähltes Ergebnis der [Schnellsuche](../../guide/guides/quick-search.md#searching-the-diagram) und das Öffnen des [Explorers](../../guide/guides/explorer.md#opening-and-closing) wechseln alle von Flow zur Registerkarte ERD. Ein Scrollen, das die Kartenschaltfläche oder ein Ergebnis der Schnellsuche dort auslöst, wird ebenfalls gesendet.

## Zwei Editoren auf einer Seite {#two-editors-on-one-page}

Die Verdrahtung von subscribe zu dispatch steht hier für das Netzwerk, sodass Sie den Aufbau einer Sitzung sehen können, ohne dass ein Transport dazwischensteht.

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

Beide Editoren beginnen hier mit demselben neuen, leeren Dokument, sodass keiner von beiden initialisiert werden muss.  
Bei drei oder mehr Editoren senden Sie die Stapel jedes Editors an alle anderen: Ein Editor gibt nie weiter, was er empfangen hat.

## Einen Mitbearbeiter initialisieren {#seeding-a-collaborator}

Ein gemeinsamer Store leitet Änderungen weiter, sobald sie vorgenommen werden, und übergibt einem beitretenden Editor nie das Dokument in seinem aktuellen Zustand, sodass ein Editor, der einer bereits laufenden Sitzung beitritt, zuerst das Dokument erhalten muss.  
Seit `4.0.0` initialisieren Sie ihn mit [`runtimeValue`](../erd-editor-element.md#runtimevalue) eines Editors, der sich bereits in der Sitzung befindet, nicht mit `value` oder der gespeicherten Datei.

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
Seit `4.0.0` verwirft die Methode außerdem die Kollaborationsregister des Editors, die gleichzeitige Änderungen abgleichen. Hat der gemeinsame Store des Editors bereits einen Abonnenten gehabt, fragt der Store die anderen Editoren erneut nach deren Registern, wie bei seinem ersten [subscribe](#subscribe), sodass ein mitten in einer Sitzung erneut geladener Editor Änderungen so abgleicht wie die anderen.  
Eine Zuweisung an `value` behält die Register bei, wird aber anders als `setInitialValue` weitergeleitet: Sobald der Editor einen gemeinsamen Store hat, lädt jeder Editor in der Sitzung das zugewiesene Dokument. Initialisieren Sie einen beitretenden Editor daher nie auf diese Weise.

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

Ein Editor einer Version vor `4.0.0` ignoriert die neuen Aktionstypen: Er sieht nie eine Tabellengruppe oder welche Tabellen zu ihr gehören, obwohl das Ziehen einer Gruppe die Tabellen der Gruppe dort trotzdem verschiebt, da es auch für sie `table.move` sendet.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Abonniert Änderungen im Editor.  
Nichts verlässt den Editor, solange es nicht mindestens einen Abonnenten gibt, und vorher vorgenommene Änderungen werden gepuffert.  
Beim ersten Abonnieren werden außerdem die anderen Editoren nach ihren Kollaborationsregistern gefragt, die gleichzeitige Änderungen abgleichen, sodass ein später beitretender Editor sie auf dieselbe Weise abgleicht.  
Das Dokument wird dabei nicht übertragen. [Initialisieren](#seeding-a-collaborator) Sie einen später beitretenden Editor daher zuerst.  
Seit `4.0.0` fragt der Store jedes Mal erneut, wenn `setInitialValue` nach diesem ersten Abonnieren ein Dokument in seinen Editor lädt.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Sendet die Stream-Stapel, die dieser Store noch zurückhält, sofort statt nach ihrer Ruhephase.  
Seit `3.9.2` funktioniert die Methode bei einem Store aus `getSharedStore`; in `3.9.1` ist sie im Typ vorhanden, bewirkt aber nichts.  
Das Verschieben einer Tabelle, Notiz oder Tabellengruppe, das Ändern ihrer Farbe, das Ändern der Größe einer Notiz sowie das Scrollen oder Zoomen der Ansicht kommen jeweils als Stream kleiner Änderungen an. Bei der Größenänderung einer Tabellengruppe ist das nicht so: Sie wird einmal gesendet, wenn das Ziehen endet.  
Der Store sammelt jeden Stream in einem Stapel und hält ihn zurück, bis der Stream 200 ms lang ruhig war. Er tut dies in zwei Stufen, sodass der Stapel etwa 400 ms nach der letzten Änderung gesendet wird.  
Ein Aufruf beendet diese Wartezeit in beiden Stufen. Solange der Store verbunden ist, erhält ein Abonnent den Stapel, bevor der Aufruf zurückkehrt. Ein Aufruf, bei dem nichts zurückgehalten wird, sendet nichts.  
Die Methode `destroy`, ob die des Stores oder die des Editors, verwirft einen noch zurückgehaltenen Stapel. Rufen Sie daher zuerst diese Methode auf, wenn Sie einen Store aufgeben und die anderen die letzte Änderung behalten sollen, etwa wenn eine Registerkarte geschlossen wird.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Zerstört die sharedStore-Instanz vollständig.  
Der Editor selbst bleibt unberührt, sodass das Dokument nach dem Verlassen einer Sitzung bearbeitbar bleibt.  
Die Maus- und Fokus-Tracker werden beendet, sobald der letzte sharedStore, den der Editor ausgegeben hat, zerstört ist.  
Ein Stream-Stapel, den der Store noch zurückhält, wird mit ihm verworfen; rufen Sie zuerst [flushStreamBuffers](#flushstreambuffers) auf, um ihn zu senden.

```js
sharedStore.destroy();
```
