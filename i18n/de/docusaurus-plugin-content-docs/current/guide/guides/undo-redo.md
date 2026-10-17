---
sidebar_position: 13
description: Änderungen rückgängig machen und wiederholen, was der Verlauf aufzeichnet, und ihn mit der Zeitreise Schritt für Schritt durchgehen.
---

# Rückgängig und Wiederholen

Sie können zu einem früheren Bearbeitungsstand zurück- oder zu einem späteren vorwärtsgehen.  
Der Verlauf umfasst bis zu `2048` Änderungen.

- Rückgängig: `Ctrl + Z` (Windows/Linux) oder `⌘ + Z` (Mac)
- Wiederholen: `Ctrl + Shift + Z` (Windows/Linux) oder `⌘ + Shift + Z` (Mac)

Die Symbolleiste enthält dieselben beiden Befehle als Schaltflächen `Undo` und `Redo` neben `Time Travel`.  
Sie werden nur hervorgehoben, wenn es etwas rückgängig zu machen oder zu wiederholen gibt. Ein Editor mit `readonly` blendet alle drei aus, und die Tastenkombinationen bewirken nichts.

Rückgängig und Wiederholen funktionieren nur auf der Registerkarte ERD. Auf den Registerkarten Visualisierung, Schema SQL, Codegenerator und Einstellungen sind sie nicht verfügbar. In den Feldern `Before tables` und `After tables` der Registerkarte Schema SQL machen dieselben Tasten stattdessen Ihre Eingabe im Feld rückgängig und wiederholen sie.  
Die Tastenkombinationen sind außerdem inaktiv, solange die Schnellsuche, `Table Properties`, `Diff Viewer`, die Vorschau von `Auto Layout`, der Dialog [`Export image`](./file-import-export.md#image), der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) oder die Zeitreise geöffnet ist.  
Sie funktionieren weiterhin, solange der Tastaturfokus irgendwo im [Explorer](./explorer.md#keys-in-the-explorer) liegt, seinen Baum eingeschlossen, und solange die [Farbauswahl](./table-related-functions.md#table-and-memo-color-specification) geöffnet ist. Auch wenn der Textcursor in einem Feld des Explorers oder der Farbauswahl steht, etwa im Suchfeld, im Ersetzungsfeld oder im Feld `Hex`, machen sie Änderungen am Diagramm rückgängig und wiederholen sie, nicht Änderungen am Text im Feld.

Der Verlauf wird für die aktuelle Sitzung im Arbeitsspeicher gehalten. Er wird nicht im Dokument gespeichert, daher beginnt ein erneut geöffnetes Diagramm mit einem leeren Verlauf.

![Eine Tabelle verschieben und eine Spalte mit ⌥ + Backspace entfernen, dann beides mit ⌘ + Z rückgängig machen und mit ⌘ + Shift + Z wiederholen](/img/demo-undo-redo.webp)

## Was der Verlauf aufzeichnet {#what-the-history-records}

Aufgezeichnet werden:

- Tabellen und Notizen: Hinzufügen, Entfernen, Verschieben, Farbe, Name und Kommentar, Notiztext und Notizgröße.
- Tabellengruppen: Hinzufügen, Entfernen, Verschieben, Größenänderung, Name, Farbe und welcher Gruppe jede Tabelle angehört – siehe [Tabellengruppen](./table-groups.md).
- Spalten: Hinzufügen, Entfernen, Neuanordnen und jede Spaltenoption.
- Beziehungen: Hinzufügen, Entfernen, Typänderung, die im Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) festgelegten Spalten und jede Auswahl in `On Delete` oder `On Update` – siehe [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Das Rückgängigmachen eines Entfernens stellt eine Beziehung mit ihren Aktionen für ON DELETE und ON UPDATE wieder her.
- Indizes und ihre Spalten.
- Ansichtsposition, Zoomstufe und die Schalter in `View Option`.
- Die Skripte `Before tables` und `After tables` der Registerkarte Schema SQL, ein Schritt für jede Änderung, die Sie durch Verlassen des Felds übernehmen – siehe [Skripte vor und nach den Tabellen](./schema-sql.md#before-and-after-scripts).
- Das Importieren einer Datei und das Hinzufügen einer Datei mit [`Import and Add`](./file-import-export.md#import-and-add).

Nicht aufgezeichnet werden:

- Das Datenbanksystem und der Datenbankname.
- Die Sprache des Codegenerators, `Table Name Case` und `Column Name Case`.
- Der Begrenzertyp, ob er auf der Registerkarte Schema SQL oder auf der Registerkarte Codegenerator festgelegt wird.
- Die gewählten Optionen in `Statements`, `Header` und `Tables` auf der Registerkarte Schema SQL, die zum Editorfenster gehören – siehe [Optionsbereich](./schema-sql.md#options-panel).
- Alles auf der Registerkarte Einstellungen, die Zeilen [`Lock`](./settings.md#lock) eingeschlossen.
- Das Design und die Anzeigesprache – siehe [Sprache und Design](./language-and-theme.md).
- Welche Tabelle, Notiz oder Gruppe vor den anderen gezeichnet wird.
- Der [Explorer](./explorer.md): Öffnen, Schließen oder Ändern seiner Größe, Einklappen seines Baums sowie Suchtext und Suchoptionen. Was `Replace` und `Replace All` ändern, wird jedoch aufgezeichnet, ebenso das Scrollen durch einen Sprung – siehe [Eine Geste, ein Schritt](#one-gesture-one-step).
- Zoomen und Verschieben der Ansicht auf der Registerkarte Visualisierung in beiden Modi, das Verschieben von Graph-Knoten oder Flow-Karten, `Tidy Up`, die Zeilenanzeige und das Fokussieren auf Tabellen – siehe [Flow ändert das Dokument nie](./visualization.md#flow-never-edits-the-document).

Änderungen an diesen Punkten lassen sich nicht rückgängig machen.

Änderungen, die von einem anderen Editor eintreffen, werden ebenfalls nicht aufgezeichnet, daher nimmt Rückgängig nur Ihre eigenen zurück. In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) macht jeder Editor seine eigenen Änderungen rückgängig, und ein Coding-Agent, der über den [MCP-Server](../../mcp/live-and-headless.md#undo) bearbeitet, macht seine eigenen mit `erd_undo` rückgängig.

Das Rückgängigmachen eines Imports über `Import`, der das gesamte Diagramm ersetzt, stellt das frühere Diagramm so wieder her, wie der Editor es beim Importieren hatte: Jede [Sperre](./settings.md#lock) ist wie damals ein- oder ausgeschaltet, und jeder gesperrte Wert entspricht dem damaligen.  
War in diesem Diagramm `Viewport` gesperrt, kehren die Ansicht und der Zoom zur gesperrten Ansicht zurück, mit der sich das Diagramm öffnet, statt dorthin, wo Sie waren. War `Viewport` darin entsperrt, kehren sie dorthin zurück, wo Sie beim Importieren waren. Die anderen gesperrten Einstellungen, etwa die Registerkarte, auf der Sie sich befinden, oder die Sprache des Codegenerators, bleiben so, wie sie auf Ihrem Bildschirm sind.  
Bei einem neuen Diagramm sind zu Beginn alle Sperren eingeschaltet. Entsperren Sie `Viewport` vor dem Importieren, um Ihre Ansicht bei einem solchen Rückgängigmachen zu behalten. Ein nachträgliches Entsperren oder der Import einer JSON-Datei, deren eigene Sperre `Viewport` ausgeschaltet ist, ändert nicht, wohin Sie das Rückgängigmachen bringt.

## Eine Geste, ein Schritt {#one-gesture-one-step}

Alles, was eine einzelne Geste auslöst, wird zu einem Eintrag im Verlauf.  
Das gleichzeitige Einfügen mehrerer Tabellen und Notizen oder ihr Duplizieren mit `Alt + drag` wird in einem einzigen Schritt rückgängig gemacht.

Ein Druck auf `Delete` oder `Backspace` sowie `Delete selected` oder `Delete columns` in einem Kontextmenü ist jeweils ein Schritt, ganz gleich, wie viele Tabellen, Notizen, Tabellengruppen oder Spalten dabei entfernt werden.  
Das Ein- oder Ausschalten des Primärschlüssels für mehrere ausgewählte Spalten ist ein Schritt, ob mit `Alt + K` (Windows/Linux) oder `⌥ + K` (Mac) oder mit `Primary Key on selected columns` im Kontextmenü einer Tabelle.  
Das Festlegen der Farbe der Auswahl oder ihr Entfernen mit `No color` oder `Remove color` ist ein Schritt, ganz gleich, wie viele Tabellen, Notizen und Gruppen ausgewählt sind. Die Wahl einer Farbe, die alles Ausgewählte bereits hat, zeichnet keinen Schritt auf, und ebenso wenig `No color`, wenn nichts Ausgewähltes eine Farbe hat.  
`Map` oder `Save` im Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) ist ein Schritt, zusammen mit den Fremdschlüsselspalten, die dabei hinzugefügt, und den Datentypen, die dabei geändert werden.  
`Import and Add` ist ein Schritt, zusammen mit dem Scrollen, das den hinzugefügten Block bei Bedarf in die Ansicht bringt.

Das Erstellen einer [Tabellengruppe](./table-groups.md), durch Zeichnen oder durch Gruppieren der ausgewählten Tabellen mit `Group selected tables` oder `T` und dann `G`, ist zusammen mit jeder Tabelle, die sie aufnimmt, ein Schritt. Das Entfernen einer Gruppe ist ein Schritt, und sein Rückgängigmachen stellt die Gruppe mit ihren Tabellen darin wieder her.  
Das Ziehen einer Gruppe an ihrer Titelleiste verschiebt die Gruppe und alle ihre Tabellen in einem Schritt. Tabellen, die in eine Gruppe hinein oder aus ihr heraus abgelegt werden, wechseln die Gruppe im selben Schritt wie ihr Ziehen, wenn Sie innerhalb von etwa `200ms` nach der letzten Bewegung loslassen, sodass ein einziges Rückgängigmachen sie wieder an ihren vorherigen Platz und in ihre vorherigen Gruppen bringt. Nach einer längeren Pause vor dem Loslassen ist der Gruppenwechsel ein eigener Schritt, und das erste Rückgängigmachen nimmt nur ihn zurück.  
Das Ändern der Größe einer Gruppe an einem Rand oder einer Ecke wird einmal aufgezeichnet, wenn Sie loslassen.  
Das Anwenden des [Automatischen Layouts](./table-related-functions.md#auto-layout) ist ein Schritt, einschließlich der Gruppen, die es an ihre Tabellen anpasst.

Auch `Replace All` in [Suchen und Ersetzen](./find-and-replace.md#replacing) ist ein Schritt, ganz gleich, wie viele Tabellennamen, Spaltennamen, Indexnamen, Namen von Tabellengruppen, Kommentare und Notizen es ändert. Wenn es nichts ändert, etwa wenn `Preserve Case` jeden Treffer unverändert zurückschreibt, zeichnet es keinen Schritt auf.  
Ein einzelnes `Replace` ist ein Schritt, einschließlich des Scrollens zum nächsten Treffer, wenn dieser Treffer es erfordert. Wenn es seinen Treffer unverändert zurückschreibt, zeichnet es nur dieses Scrollen auf oder nichts, wenn es keines gibt.  
Der Wechsel zu einem Treffer scrollt die Zeichenfläche nur, wenn der Treffer nicht bereits gut sichtbar ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands). Dieses Scrollen wird wie jede andere Änderung der Ansichtsposition aufgezeichnet, daher nimmt Rückgängig nach dem Durchgehen von Treffern zuerst diese Scrollvorgänge zurück, einen pro Schritt.  
Die anderen Sprünge, die auf der Zeichenfläche landen, zeichnen ihr Scrollen auf dieselbe Weise auf: die Wahl einer Zeile im Explorer, eines Ergebnisses der Schnellsuche oder der [Kartenschaltfläche](./visualization.md#card-buttons) für externe Links in Flow. Ein Sprung, der die Ansicht lässt, wo sie ist, zeichnet nichts auf. Auch die Wahl einer Zeile in der Liste von `Diff Viewer` zeichnet nichts auf, da sie nur die eigenen schreibgeschützten Seiten der Diff-Ansicht bewegt.

Durchgehendes Ziehen, Verschieben der Ansicht, Zoomen, eine Pinch-Geste oder eine Farbänderung wird etwa `200ms` lang gepuffert und ergibt ebenfalls einen einzigen Eintrag.  
Ein Ziehen, das insgesamt weniger als `20px` bewegt, zeichnet keine Verschiebung auf. Aufgezeichnet wird nur ein dabei erfolgter Gruppenwechsel, falls es einen gibt.

Die Texteingabe in einer Zelle oder einer Notiz wird pro Eingabe statt pro Geste aufgezeichnet: Jedes getippte Zeichen, jedes Einfügen und jeder Schritt des Zusammensetzens mit einer Eingabemethode (IME) ist ein eigener Schritt.  
Der Name einer Tabellengruppe wird einmal aufgezeichnet, wenn `Enter` oder das Verlassen des Felds ihn speichert, daher ist der Name, den Sie in eine gerade erstellte Gruppe eingeben, ein vom Erstellen getrennter Schritt. `Esc` oder ein unveränderter Name zeichnet nichts auf.

## Zeitreise {#time-travel}

Wird über die Schaltfläche `Time Travel` in der Symbolleiste neben Rückgängig und Wiederholen geöffnet.  
Die Schaltfläche bewirkt nichts, bis die Sitzung mindestens eine aufgezeichnete Änderung enthält.

Die Zeitreise öffnet eine separate, schreibgeschützte Kopie des Diagramms an der Scrollposition und mit der Zoomstufe, die die Zeichenfläche gerade zeigt, unabhängig davon, ob die Sperre `Viewport` eingeschaltet ist.  
Ziehen Sie den Schieberegler oder klicken Sie auf eine beliebige Stelle seiner Leiste, um sich durch den gesamten Bearbeitungsverlauf zu bewegen und jeden Punkt in der Vorschau anzuzeigen. Die äußerste linke Position des Schiebereglers ist der Zustand einen Schritt vor der ersten aufgezeichneten Änderung, und beim Öffnen steht sein Griff auf dem aktuellen Zustand.  
Die Vorschau ist nicht interaktiv: Sie zeichnet eine Minimap, lässt sich aber weder verschieben noch scrollen noch bearbeiten, und das eigentliche Dokument bleibt unberührt, bis Sie übernehmen.

Drücken Sie `Apply`, um den ausgewählten Punkt wiederherzustellen, oder `Cancel` oder `Esc`, um das Dokument unverändert zu lassen.

![Die Zeitreise öffnen, den Schieberegler durch die Sitzung zurückziehen und einen früheren Punkt anwenden](/img/demo-time-travel.webp)
