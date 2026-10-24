---
sidebar_position: 15
description: Änderungen rückgängig machen und wiederholen, was der Verlauf aufzeichnet, die eigenen Verläufe der Wörterbuchblätter und den Verlauf des Diagramms mit der Zeitreise Schritt für Schritt durchgehen.
---

# Rückgängig und Wiederholen

Sie können zu einem früheren Bearbeitungsstand zurück- oder zu einem späteren vorwärtsgehen.  
Der Verlauf umfasst bis zu `2048` Änderungen.

- Rückgängig: `Ctrl + Z` (Windows/Linux) oder `⌘ + Z` (Mac)
- Wiederholen: `Ctrl + Shift + Z` (Windows/Linux) oder `⌘ + Shift + Z` (Mac)

Auf der Registerkarte ERD enthält die Symbolleiste dieselben beiden Befehle als Schaltflächen `Undo` und `Redo` neben `Time Travel`. Auf der Registerkarte Wörterbuch zeigt sie `Undo` und `Redo` ohne `Time Travel`, und keine andere Registerkarte zeigt sie.  
Sie werden nur hervorgehoben, wenn es etwas rückgängig zu machen oder zu wiederholen gibt. Ein Editor mit `readonly` blendet sie aus, und die Tastenkombinationen machen nichts rückgängig und wiederholen nichts.

Rückgängig und Wiederholen wirken nur auf der Registerkarte ERD auf den Verlauf des Diagramms.  
Die Tastenkombinationen sind dort inaktiv, solange die Schnellsuche, `Table Properties`, `Diff Viewer`, die Vorschau von `Auto Layout`, der Dialog [`Export image`](./file-import-export.md#image), der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) oder die Zeitreise geöffnet ist.  
Sie funktionieren weiterhin, solange der Tastaturfokus irgendwo im [Explorer](./explorer.md#keys-in-the-explorer) liegt, seinen Baum eingeschlossen, und solange die [Farbauswahl](./table-related-functions.md#table-and-memo-color-specification) geöffnet ist. Auch wenn der Textcursor in einem Feld des Explorers oder der Farbauswahl steht, etwa im Suchfeld, im Ersetzungsfeld oder im Feld `Hex`, machen sie Änderungen am Diagramm rückgängig und wiederholen sie, nicht Änderungen am Text im Feld.

Auf den anderen Registerkarten:

- Wörterbuch: Sie machen die Änderungen des angezeigten Blatts, `Domains`, `Words` oder `Terms`, aus dem eigenen Verlauf dieses Blatts rückgängig und wiederholen sie, nie die des Diagramms. Auf dem Blatt `Checks` bewirken sie nichts – siehe [Wörterbuchblätter](#dictionary-sheets).
- Visualisierung: In `Flow` gehen dieselben Tasten durch das, was Flow gezeigt hat, einen Schritt zurück und vor, wie `Previous table` und `Next table`, auch in einem Editor mit `readonly`. Dort machen sie nie Änderungen am Diagramm rückgängig oder wiederholen sie – siehe [Vorherige und nächste Tabelle](./visualization.md#previous-table-and-next-table). In `Graph` bewirken sie nichts.
- Schema SQL, Codegenerator und Einstellungen: Sie sind nicht verfügbar. In den Feldern `Before tables` und `After tables` der Registerkarte Schema SQL machen dieselben Tasten stattdessen Ihre Eingabe im Feld rückgängig und wiederholen sie.

Der Verlauf wird für die aktuelle Sitzung im Arbeitsspeicher gehalten. Er wird nicht im Dokument gespeichert, daher beginnt ein erneut geöffnetes Diagramm mit einem leeren Verlauf.

![Eine Tabelle verschieben und eine Spalte mit ⌥ + Backspace entfernen, dann beides mit ⌘ + Z rückgängig machen und mit ⌘ + Shift + Z wiederholen](/img/demo-undo-redo.webp)

## Was der Verlauf aufzeichnet {#what-the-history-records}

Aufgezeichnet werden:

- Tabellen und Notizen: Hinzufügen, Entfernen, Verschieben und Farbe; Name, logischer Name und Kommentar einer Tabelle; Text und Größe einer Notiz.
- Tabellengruppen: Hinzufügen, Entfernen, Verschieben, Größenänderung, Name, Farbe und welcher Gruppe jede Tabelle angehört – siehe [Tabellengruppen](./table-groups.md).
- Spalten: Hinzufügen, Entfernen, Neuanordnen, logischer Name, die Domäne, mit der jede verknüpft ist, und jede Spaltenoption.
- Die physischen Namen, die die Wörterbücher ableiten, und ob jeder Name ein eigener Name ist oder von den Wörterbüchern stammt: Ein einziges Rückgängigmachen stellt einen Namen und diesen Zustand zusammen wieder her – siehe [Eigene Namen](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` und `Derive Physical Names Again` – siehe [Physische Namen neu ableiten](./dictionary.md#derive-physical-names-again).
- Beziehungen: Hinzufügen, Entfernen, Typänderung, die im Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) festgelegten Spalten und jede Auswahl in `On Delete` oder `On Update` – siehe [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Das Rückgängigmachen eines Entfernens stellt eine Beziehung mit ihren Aktionen für ON DELETE und ON UPDATE wieder her.
- Indizes und ihre Spalten.
- Ansichtsposition, Zoomstufe und die Schalter in `View Option`.
- Die Skripte `Before tables` und `After tables` der Registerkarte Schema SQL, ein Schritt für jede Änderung, die Sie durch Verlassen des Felds übernehmen – siehe [Skripte vor und nach den Tabellen](./schema-sql.md#before-and-after-scripts).
- Das Importieren einer Datei und das Hinzufügen einer Datei mit [`Import and Add`](./file-import-export.md#import-and-add).

Nicht aufgezeichnet werden:

- Das Datenbanksystem und der Datenbankname.
- Die Sprache des Codegenerators, `Table Name Case` und `Column Name Case`.
- Der Begrenzertyp, ob er auf der Registerkarte Schema SQL oder auf der Registerkarte Codegenerator festgelegt wird.
- Die gewählten Optionen in `Statements`, `Header`, `Write logical names into empty comments` und `Tables` auf der Registerkarte Schema SQL, die zum Editorfenster gehören – siehe [Optionsbereich](./schema-sql.md#options-panel).
- Alles auf der Registerkarte Einstellungen, die Zeilen [`Lock`](./settings.md#lock) eingeschlossen.
- Das Wechseln der Namensansicht, gleich an welcher Stelle und ob ihre Sperre ein- oder ausgeschaltet ist – siehe [Ansicht wechseln](./logical-names.md#switching-the-view).
- Das Design und die Anzeigesprache – siehe [Sprache und Design](./language-and-theme.md).
- Welche Tabelle, Notiz oder Gruppe vor den anderen gezeichnet wird.
- Der [Explorer](./explorer.md): Öffnen, Schließen oder Ändern seiner Größe, Einklappen seines Baums sowie Suchtext und Suchoptionen. Was `Replace` und `Replace All` ändern, wird jedoch aufgezeichnet, ebenso das Scrollen durch einen Sprung – siehe [Eine Geste, ein Schritt](#one-gesture-one-step).
- Zoomen und Verschieben der Ansicht auf der Registerkarte Visualisierung in beiden Modi, das Verschieben von Graph-Knoten oder Flow-Karten, `Tidy Up`, die Zeilenanzeige, das Fokussieren auf Tabellen und das Zurück- und Vorgehen mit `Previous table` und `Next table` – siehe [Flow ändert das Dokument nie](./visualization.md#flow-never-edits-the-document).
- Das angezeigte Blatt der Registerkarte Wörterbuch sowie Suche, Auswahl, Scrollposition und Spaltenbreiten jedes Blatts – siehe [Registerkarte öffnen](./dictionary.md#opening-the-tab).

Änderungen an diesen Punkten lassen sich nicht rückgängig machen.

Änderungen auf der Registerkarte Wörterbuch lassen sich rückgängig machen, landen aber im Verlauf ihres eigenen Blatts statt in diesem, sodass Rückgängig auf der Registerkarte ERD nie eine davon zurücknimmt, nicht einmal den neuen `Data Type` einer Domäne und die Spaltentypen, die er ändert – siehe [Wörterbuchblätter](#dictionary-sheets).

Änderungen, die von einem anderen Editor eintreffen, werden ebenfalls nicht aufgezeichnet, daher nimmt Rückgängig nur Ihre eigenen zurück. In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) macht jeder Editor seine eigenen Änderungen rückgängig, und ein Coding-Agent, der über den [MCP-Server](../../mcp/live-and-headless.md#undo) bearbeitet, macht seine eigenen mit `erd_undo` rückgängig.

Das Rückgängigmachen eines Imports über `Import`, der das gesamte Diagramm ersetzt, stellt das frühere Diagramm so wieder her, wie der Editor es beim Importieren hatte: Jede [Sperre](./settings.md#lock) ist wie damals ein- oder ausgeschaltet, und jeder gesperrte Wert entspricht dem damaligen.  
War in diesem Diagramm `Viewport` gesperrt, kehren die Ansicht und der Zoom zur gesperrten Ansicht zurück, mit der sich das Diagramm öffnet, statt dorthin, wo Sie waren. War `Viewport` darin entsperrt, kehren sie dorthin zurück, wo Sie beim Importieren waren. Die anderen gesperrten Einstellungen, etwa die Registerkarte, auf der Sie sich befinden, die Sprache des Codegenerators oder die Namensansicht, bleiben so, wie sie auf Ihrem Bildschirm sind.  
Bei einem neuen Diagramm sind zu Beginn alle Sperren eingeschaltet. Entsperren Sie `Viewport` vor dem Importieren, um Ihre Ansicht bei einem solchen Rückgängigmachen zu behalten. Ein nachträgliches Entsperren oder der Import einer JSON-Datei, deren eigene Sperre `Viewport` ausgeschaltet ist, ändert nicht, wohin Sie das Rückgängigmachen bringt.

Das Rückgängigmachen des Imports einer JSON-Datei bringt auch die Wörter, Begriffe und Domänen zurück, die das frühere Diagramm hatte. Ein Import von Schema SQL, GraphQL, DBML oder AML behält die Wörterbücher bei, sodass sein Rückgängigmachen und Wiederholen sie so lassen, wie sie sind, einschließlich der Änderungen, die seitdem auf der Registerkarte Wörterbuch vorgenommen wurden.

Ein Rückgängigmachen oder Wiederholen auf der Registerkarte ERD, das eine Spalte wieder mit einer Domäne verknüpft oder eine mit einer Domäne verknüpfte Spalte zurückbringt, gibt der Spalte den Datentyp, den die Domäne jetzt hat. Eines, das bei einer verknüpften Spalte einen anderen Typ wiederherstellt, hebt ihre Verknüpfung auf – siehe [Domänen und Datentypen](./dictionary.md#domains-and-data-types).

## Eine Geste, ein Schritt {#one-gesture-one-step}

Alles, was eine einzelne Geste auslöst, wird zu einem Eintrag im Verlauf.  
Das gleichzeitige Einfügen mehrerer Tabellen und Notizen oder ihr Duplizieren mit `Alt + drag` wird in einem einzigen Schritt rückgängig gemacht.

Ein Druck auf `Delete` oder `Backspace` sowie `Delete selected` oder `Delete columns` in einem Kontextmenü ist jeweils ein Schritt, ganz gleich, wie viele Tabellen, Notizen, Tabellengruppen oder Spalten dabei entfernt werden.  
Das Ein- oder Ausschalten des Primärschlüssels für mehrere ausgewählte Spalten ist ein Schritt, ob mit `Alt + K` (Windows/Linux) oder `⌥ + K` (Mac) oder mit `Primary Key on selected columns` im Kontextmenü einer Tabelle.  
Das Festlegen der Farbe der Auswahl oder ihr Entfernen mit `No color` oder `Remove color` ist ein Schritt, ganz gleich, wie viele Tabellen, Notizen und Gruppen ausgewählt sind. Die Wahl einer Farbe, die alles Ausgewählte bereits hat, zeichnet keinen Schritt auf, und ebenso wenig `No color`, wenn nichts Ausgewähltes eine Farbe hat.  
`Map` oder `Save` im Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) ist ein Schritt, zusammen mit den Fremdschlüsselspalten, die dabei hinzugefügt, und den Datentypen, die dabei geändert werden.  
`Import and Add` ist ein Schritt, zusammen mit dem Scrollen, das den hinzugefügten Block bei Bedarf in die Ansicht bringt.

Die Wahl eines Begriffs aus der Liste unter einer Zelle des logischen Namens ist ein Schritt: der logische Name, der physische Name, den er ableitet, und bei einer Spalte die Domäne des Begriffs mit ihrem Datentyp – siehe [Begriffsnamen vervollständigen](./logical-names.md#completing-term-names).  
Die Wahl einer Domäne in der Domänenzelle einer Spalte ist ein Schritt, zusammen mit dem Datentyp, den sie der Spalte gibt, und dem, was die [Datentyp-Synchronisierung für Beziehungen](./settings.md#relationship-datatype-sync) entlang der Beziehungen weitergibt. Auch die Wahl von `None`, die die Verknüpfung der Spalte aufhebt, ist ein Schritt – siehe [Die Domänenzelle](./logical-names.md#the-domain-cell). Wird in eine verknüpfte Spalte ein anderer Datentyp als der ihrer Domäne eingegeben, hebt das die Verknüpfung der Spalte im Schritt dieser Eingabe auf.  
`Derive Physical Name Again` oder `Derive Physical Names Again` ist ein Schritt, ganz gleich, wie viele Namen, Domänenverknüpfungen und Datentypen dabei geändert werden. Es zeichnet nur dann keinen Schritt auf, wenn es nichts ändert. Einen eigenen Namen wieder den Wörterbüchern zu überlassen, ist eine Änderung, auch wenn der Name bereits das enthält, was sie ihm geben.

Das Erstellen einer [Tabellengruppe](./table-groups.md), durch Zeichnen oder durch Gruppieren der ausgewählten Tabellen mit `Group selected tables` oder `T` und dann `G`, ist zusammen mit jeder Tabelle, die sie aufnimmt, ein Schritt. Das Entfernen einer Gruppe ist ein Schritt, und sein Rückgängigmachen stellt die Gruppe mit ihren Tabellen darin wieder her.  
Das Ziehen einer Gruppe an ihrer Titelleiste verschiebt die Gruppe und alle ihre Tabellen in einem Schritt. Tabellen, die in eine Gruppe hinein oder aus ihr heraus abgelegt werden, wechseln die Gruppe im selben Schritt wie ihr Ziehen, wenn Sie innerhalb von etwa `200ms` nach der letzten Bewegung loslassen, sodass ein einziges Rückgängigmachen sie wieder an ihren vorherigen Platz und in ihre vorherigen Gruppen bringt. Nach einer längeren Pause vor dem Loslassen ist der Gruppenwechsel ein eigener Schritt, und das erste Rückgängigmachen nimmt nur ihn zurück.  
Das Ändern der Größe einer Gruppe an einem Rand oder einer Ecke wird einmal aufgezeichnet, wenn Sie loslassen.  
Das Anwenden des [Automatischen Layouts](./table-related-functions.md#auto-layout) ist ein Schritt, einschließlich der Gruppen, die es an ihre Tabellen anpasst.

Auch `Replace All` in [Suchen und Ersetzen](./find-and-replace.md#replacing) ist ein Schritt, ganz gleich, wie viele Tabellennamen, Spaltennamen, logische Namen, Indexnamen, Namen von Tabellengruppen, Kommentare und Notizen es ändert, einschließlich der physischen Namen und Domänenverknüpfungen, die die logischen Namen ableiten. Wenn es nichts ändert, etwa wenn `Preserve Case` jeden Treffer unverändert zurückschreibt, zeichnet es keinen Schritt auf.  
Ein einzelnes `Replace` ist ein Schritt, einschließlich dessen, was ein logischer Name ableitet, und des Scrollens zum nächsten Treffer, wenn dieser Treffer es erfordert. Wenn es seinen Treffer unverändert zurückschreibt, zeichnet es nur dieses Scrollen auf oder nichts, wenn es keines gibt.  
Der Wechsel zu einem Treffer scrollt die Zeichenfläche nur, wenn der Treffer nicht bereits gut sichtbar ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands). Dieses Scrollen wird wie jede andere Änderung der Ansichtsposition aufgezeichnet, daher nimmt Rückgängig nach dem Durchgehen von Treffern zuerst diese Scrollvorgänge zurück, einen pro Schritt.  
Die anderen Sprünge, die auf der Zeichenfläche landen, zeichnen ihr Scrollen auf dieselbe Weise auf: die Wahl einer Zeile im Explorer, eines Ergebnisses der Schnellsuche, einer Prüfung auf dem Blatt `Checks` der Registerkarte Wörterbuch, die eine Tabelle oder eine Spalte nennt, oder der [Kartenschaltfläche](./visualization.md#card-buttons) für externe Links in Flow. Ein Sprung, der die Ansicht lässt, wo sie ist, zeichnet nichts auf. Auch die Wahl einer Zeile in der Liste von `Diff Viewer` zeichnet nichts auf, da sie nur die eigenen schreibgeschützten Seiten der Diff-Ansicht bewegt.

Durchgehendes Ziehen, Verschieben der Ansicht, Zoomen, eine Pinch-Geste oder eine Farbänderung wird etwa `200ms` lang gepuffert und ergibt ebenfalls einen einzigen Eintrag.  
Ein Ziehen, das insgesamt weniger als `20px` bewegt, zeichnet keine Verschiebung auf. Aufgezeichnet wird nur ein dabei erfolgter Gruppenwechsel, falls es einen gibt.

Die Texteingabe in einer Zelle oder einer Notiz wird pro Eingabe statt pro Geste aufgezeichnet: Jedes getippte Zeichen, jedes Einfügen und jeder Schritt des Zusammensetzens mit einer Eingabemethode (IME) ist ein eigener Schritt.  
Eine Zelle des logischen Namens wird auf dieselbe Weise aufgezeichnet. Schließt sich ihr Editor mit einem anderen logischen Namen als dem, mit dem er geöffnet wurde, ist der physische Name, den die Wörterbücher daraus ableiten, ein weiterer Schritt nach der Eingabe. Das erste Rückgängigmachen nimmt nur diesen Namen zurück, samt der Domäne und dem Datentyp, die ein Begriff mitgebracht hat, und lässt den logischen Namen, den Sie eingegeben haben. Wird nichts abgeleitet, wird auch nichts weiter aufgezeichnet – siehe [Logischen Namen eingeben](./logical-names.md#writing-a-logical-name).  
Der Name einer Tabellengruppe wird einmal aufgezeichnet, wenn `Enter` oder das Verlassen des Felds ihn speichert, daher ist der Name, den Sie in eine gerade erstellte Gruppe eingeben, ein vom Erstellen getrennter Schritt. `Esc` oder ein unveränderter Name zeichnet nichts auf.

## Wörterbuchblätter {#dictionary-sheets}

Die Blätter `Domains`, `Words` und `Terms` der Registerkarte Wörterbuch führen jeweils einen eigenen Verlauf, getrennt von dem des Diagramms. Jede Änderung auf der Registerkarte landet im Verlauf des Blatts, dessen Zeilen sie schreibt. Wie der des Diagramms umfasst jeder Verlauf bis zu `2048` Schritte und wird für die Sitzung im Arbeitsspeicher gehalten.

- Liegt der Tastaturfokus in der Registerkarte, macht `Ctrl + Z` (Windows/Linux) oder `⌘ + Z` (Mac) die letzte Änderung des angezeigten Blatts rückgängig, und `Ctrl + Shift + Z` (Windows/Linux) oder `⌘ + Shift + Z` (Mac) wiederholt die zuletzt rückgängig gemachte.
- `Undo` und `Redo` der Symbolleiste tun dasselbe und werden nur hervorgehoben, wenn das angezeigte Blatt eine Änderung hat, die sich rückgängig machen oder wiederholen lässt. Ein Druck darauf lässt den Tastaturfokus, wo er war, im Raster oder im Suchfeld. Die Registerkarte hat kein `Time Travel`.
- Auf dem Blatt `Checks`, auf dem nichts bearbeitet wird, bleiben die Schaltflächen nicht hervorgehoben, und weder sie noch die Tasten bewirken etwas.
- Ist eine Zellbearbeitung geöffnet oder steht der Textcursor im Suchfeld der Registerkarte, machen die Tasten stattdessen Ihre Eingabe dort rückgängig und wiederholen sie.

Die Verläufe überschneiden sich nie. Rückgängig auf der Registerkarte ERD nimmt nie eine Änderung eines Blatts zurück, und Rückgängig in einem Blatt nimmt nie eine Änderung eines anderen Blatts oder des Diagramms zurück. Jedes Blatt behält seinen Verlauf, während Sie zwischen Blättern oder Registerkarten wechseln.

Jeder der folgenden Vorgänge ist ein Schritt seines Blatts:

- Eine Zellbearbeitung, die einmal aufgezeichnet wird, wenn sie geschrieben wird, statt pro getipptem Zeichen, und nur, wenn sie den Wert ändert – siehe [Zellen bearbeiten](./dictionary.md#editing-cells).
- Ein Einfügen, einschließlich der Zeilen, die es hinzufügt, und das Leeren der ausgewählten Zellen mit `Delete` oder `Backspace` – siehe [Kopieren und Einfügen](./dictionary.md#copying-and-pasting).
- `Add Row` und jedes Einfügen oder Löschen von Zeilen über die Leiste, das Rastermenü oder die Tasten, ganz gleich, wie viele Zeilen es umfasst – siehe [Zeilen hinzufügen und löschen](./dictionary.md#adding-and-deleting-rows).
- Die Domäne eines Begriffs, die aus seiner Liste gewählt wird, `None` eingeschlossen – siehe [Die Domäne eines Begriffs](./dictionary.md#a-terms-domain).
- Ein Sortieren – siehe [Sortieren](./dictionary.md#sorting).
- Eine mit `Import CSV` importierte CSV-Datei, ganz gleich, wie viele Zeilen sie hinzufügt oder aktualisiert. Sie ist ein Schritt des Blatts, das die Datei füllt und das die Registerkarte danach anzeigt, gleich von welchem Blatt aus Sie sie importiert haben – siehe [Importieren](./dictionary.md#importing).

Ein Schreibvorgang, der nichts ändert, etwa der erneute Import derselben Datei oder das Sortieren eines Blatts, das bereits in dieser Reihenfolge steht, zeichnet keinen Schritt auf, und ebenso wenig einer, der mit einer Meldung `Nothing saved: …` abgelehnt wird. Erhält ein Begriff ohne `Physical Name` einen Namen, ist der physische Name, den seine Wörter zusammensetzen, Teil des Schritts dieser Änderung.

Ein neuer `Data Type` einer Domäne ist ein Schritt des Blatts `Domains`, zusammen mit den Typen, die er den mit der Domäne verknüpften Spalten und den Spalten gibt, die die Datentyp-Synchronisierung für Beziehungen von diesen aus erreicht – siehe [Domänen und Datentypen](./dictionary.md#domains-and-data-types).  
Sein Rückgängigmachen oder Wiederholen ändert den Typ der Spalten, die in diesem Moment mit der Domäne verknüpft sind, sodass eine Spalte, die Sie seitdem mit einer anderen Domäne verknüpft oder deren Typ Sie geändert haben, ihren Typ behält. Eine Spalte, deren Verknüpfung der Schritt aufgehoben hat, etwa ein Fremdschlüssel, dessen Verknüpfung mit einer eigenen Domäne die Synchronisierung aufgehoben hat, wird nur wieder verknüpft, solange sie noch immer nicht verknüpft ist und noch den Typ hat, den der Schritt ihr gelassen hat.

Ein Editor mit `readonly` blendet die Schaltflächen aus, und die Tasten machen nichts rückgängig und wiederholen nichts.  
Änderungen von Mitbearbeitern und Coding-Agenten werden ebenfalls nicht im Verlauf eines Blatts aufgezeichnet.

Der Verlauf jedes Blatts wird geleert, wenn die Wörterbücher ersetzt werden: durch einen `Import` einer JSON-Datei, Ihren eigenen oder den eines Mitbearbeiters, durch dessen Rückgängigmachen oder Wiederholen und durch das Laden eines anderen Diagramms in den Editor. Ein `Import` von Schema SQL, GraphQL, DBML oder AML behält die Wörterbücher und mit ihnen den Verlauf jedes Blatts bei, auch über sein Rückgängigmachen und Wiederholen hinweg.

## Zeitreise {#time-travel}

Wird über die Schaltfläche `Time Travel` in der Symbolleiste neben Rückgängig und Wiederholen auf der Registerkarte ERD geöffnet.  
Die Schaltfläche bewirkt nichts, bis der Verlauf des Diagramms mindestens eine aufgezeichnete Änderung enthält.

Die Zeitreise öffnet eine separate, schreibgeschützte Kopie des Diagramms an der Scrollposition, mit der Zoomstufe und in der [Namensansicht](./logical-names.md#name-view), die die Zeichenfläche gerade zeigt, unabhängig davon, ob die Sperre `Viewport` oder `Name View` eingeschaltet ist.  
Sie geht nur durch den Verlauf des Diagramms, daher gehören die Änderungen der Wörterbuchblätter nicht zu ihren Punkten.  
Ziehen Sie den Schieberegler oder klicken Sie auf eine beliebige Stelle seiner Leiste, um sich durch den gesamten Bearbeitungsverlauf zu bewegen und jeden Punkt in der Vorschau anzuzeigen. Die äußerste linke Position des Schiebereglers ist der Zustand einen Schritt vor der ersten aufgezeichneten Änderung, und beim Öffnen steht sein Griff auf dem aktuellen Zustand.  
Die Vorschau ist nicht interaktiv: Sie zeichnet eine Minimap, lässt sich aber weder verschieben noch scrollen noch bearbeiten, und das eigentliche Dokument bleibt unberührt, bis Sie übernehmen.

Drücken Sie `Apply`, um den ausgewählten Punkt wiederherzustellen, oder `Cancel` oder `Esc`, um das Dokument unverändert zu lassen.

![Die Zeitreise öffnen, den Schieberegler durch die Sitzung zurückziehen und einen früheren Punkt anwenden](/img/demo-time-travel.webp)
