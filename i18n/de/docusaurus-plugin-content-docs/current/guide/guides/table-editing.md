---
sidebar_position: 3
description: Spalten hinzufügen, auswählen, neu anordnen und löschen, Spaltenoptionen ein- und ausschalten sowie Spalten kopieren und einfügen.
---

# Tabellen bearbeiten

Das Bearbeiten von Tabellen bietet im Grunde eine ähnliche Bedienung wie Excel.  
Der Bearbeitungsmodus beginnt mit `Enter` oder mit einem Doppelklick auf eine Zelle.  
`Enter` oder `Escape` beendet ihn. Ihre Eingabe wird schon während des Tippens übernommen, sodass `Escape` den Text beibehält, statt ihn zurückzusetzen.  
Nach `Escape` bleibt die Zelle fokussiert und die Tabelle ausgewählt, und ein zweites `Escape` hebt beides auf.  
Solange eine Eingabemethode noch Zeichen zusammensetzt, lässt `Escape` den Bearbeitungsmodus geöffnet.

![Mit Alt + N eine Tabelle hinzufügen und zwei Spalten ausfüllen](/img/demo-table-edit.webp)

## Spalten hinzufügen {#adding-columns}

Spalten werden mit der Tastenkombination `Alt + Enter` (Windows/Linux) oder `⌥ + Enter` (Mac) erstellt.  
Jeder ausgewählten Tabelle wird eine Spalte hinzugefügt.

## Tab-Taste {#tab-key}

Drücken Sie `Tab`, um direkt in den Bearbeitungsmodus der nächsten Zelle zu wechseln.  
Wenn Sie in der letzten Zelle `Tab` drücken, wird eine neue Spalte erstellt.  
Mit `Shift + Tab` wechseln Sie in den Bearbeitungsmodus der vorherigen Zelle.  
Die Markierungen für [Alternativschlüssel](./table-related-functions.md#alternate-keys), die hinter der letzten Zelle einer Zeile gezeichnet werden, sind keine Zellen, sodass der Tastaturfokus sie überspringt und sie nie zur Bearbeitung geöffnet werden.

![Mit Tab durch die Zellen einer Zeile wechseln, aus der letzten Zelle eine Spalte hinzufügen und mit Shift + Tab zurückgehen](/img/demo-table-tab.webp)

## Autovervollständigung für Datentypen {#datatype-autocomplete}

Beginnen Sie mit der Bearbeitung einer Zelle `DataType`, und geben Sie etwas ein. Passende Typen der ausgewählten Datenbank werden vorgeschlagen, und der Teil eines Vorschlags, der Ihre Eingabe wörtlich enthält, wird hervorgehoben.  
Die Suche selbst ist unscharf, sodass `vch` auch `VARCHAR` findet.

- `Arrow Up` oder `Arrow Down`: zwischen den Vorschlägen wechseln
- `Arrow Right`, `Tab` oder `Enter`: den hervorgehobenen Vorschlag übernehmen
- `Arrow Left`: zum eingegebenen Text zurückkehren

Sie können auch auf einen Vorschlag klicken.  
Die Liste zeigt bis zu zehn Vorschläge auf einmal, und die übrigen erreichen Sie durch Scrollen.  
Nichts wird erzwungen, sodass Sie einen Typ, der nicht in der Liste steht, frei eingeben können, auch mit Argumenten, etwa `VARCHAR(255)`. Die Liste schließt sich, sobald Ihre Eingabe über einen vollständigen Typnamen hinausgeht, wie es bei `VARCHAR(255)` oder `BIGINT UNSIGNED` der Fall ist.  
Die Vorschläge richten sich nach der ausgewählten Datenbank. Ein Wechsel der Datenbank ändert, was angeboten wird, und lässt vorhandene Spalten unverändert.

![Zellen für den Datentyp mit den Pfeiltasten, Tab und Enter aus unscharfen Vorschlägen ausfüllen](/img/demo-data-type-autocomplete.webp)

## Nicht NULL, Eindeutig, Autoinkrement {#not-null-unique-auto-increment}

Diese drei Zellen sind keine Textzellen, sondern Schalter.  
Doppelklicken Sie auf eine davon, oder drücken Sie `Enter`, während sie fokussiert ist, um sie umzuschalten.

Die Zelle für Nicht NULL zeigt `N-N`, wenn das Kennzeichen gesetzt ist, und `NULL`, wenn nicht.  
`UQ` und `AI` sind abgeblendet, wenn sie ausgeschaltet sind, und hervorgehoben, wenn sie eingeschaltet sind.

![Nicht NULL per Doppelklick umschalten, Eindeutig und Autoinkrement mit Enter](/img/demo-column-options.webp)

Zellen, die durch die [Ansichtsoptionen für Tabellen](./table-related-functions.md) ausgeblendet sind, lassen sich nicht umschalten.

## Mehrere Spalten auswählen {#selecting-multiple-columns}

Es gibt fünf Möglichkeiten:

- `Shift + Arrow Up/Down`: die Auswahl zeilenweise erweitern
- `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac): eine einzelne Spalte hinzufügen
- `Shift + click`: den Bereich ab der zuletzt fokussierten Spalte auswählen
- `Ctrl + Shift + click` (Windows/Linux) oder `⌘ + Shift + click` (Mac): diesen Bereich zur Auswahl hinzufügen
- `Alt + A` (Windows/Linux) oder `⌥ + A` (Mac): Alle auswählen

![Spalten mit Shift + Arrow Down, Ctrl/⌘ + click, Shift + click und Alt + A auswählen](/img/demo-column-select.webp)

Ein Rechtsklick auf die Zeile einer Spalte legt fest, auf welche Spalten das Kontextmenü der Tabelle wirkt, unabhängig davon, welche Zusatztaste gedrückt gehalten wird.  
Bei einer bereits ausgewählten Zeile bleibt die Auswahl erhalten, und der Fokus wechselt auf diese Zeile. Bei jeder anderen Zeile wird nur diese Zeile ausgewählt. Das gilt überall auf der Zeile, auch auf dem Schlüsselsymbol und auf einer Markierung für einen [Alternativschlüssel](./table-related-functions.md#alternate-keys).  
Um also über das Menü auf mehrere Spalten zu wirken, etwa bei [Primärschlüssel für Spalten](#column-primary-key) oder [Spalten löschen](#column-deletion), klicken Sie mit der rechten Maustaste auf eine der ausgewählten Zeilen.  
Auf einem Mac öffnet auch `Ctrl + click` das Menü, zählt aber als einfacher Klick, sodass es auf einer Zelle nur deren Zeile auswählt, bevor sich das Menü öffnet.

## Spalten neu anordnen und verschieben {#rearranging-and-moving-columns}

Funktioniert per `dragging` und ermöglicht das Verschieben in andere Tabellen.  
Die gezogenen Zeilen folgen dem Zeiger, und die Zeilen um die Ablagestelle rücken beiseite, um Platz zu machen.  
Legen Sie die Spalte direkt unter der letzten Zeile einer Tabelle ab, um sie ans Ende dieser Tabelle zu verschieben. Auf einer Tabelle ohne Spalten können Sie an jeder beliebigen Stelle ablegen.

![Eine Spalte an eine neue Position ziehen, dann in eine andere Tabelle](/img/demo-column-move.webp)

Mit `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac) lassen sich mehrere Spalten verschieben.

![Drei Spalten auswählen und mit Ctrl/⌘ + drag in eine andere Tabelle verschieben](/img/demo-column-multi-move.webp)

## Spalten löschen {#column-deletion}

Löscht die ausgewählten Spalten der fokussierten Tabelle. Ein Klick auf eine Zelle wählt deren Spalte aus, sodass Sie mit einem Klick auf eine Zelle und `Delete` genau diese eine Spalte entfernen.  
Tastenkombinationen:

- `Delete` oder `Backspace` (`⌫` auf einem Mac). Diese entfernen die ausgewählten Spalten, solange ihre Tabelle das einzige ausgewählte Element ist. Wenn keine Spalte ausgewählt ist (der Fokus liegt auf dem Namen oder Kommentar der Tabelle), wenn außerdem etwas anderes ausgewählt ist oder bei einer Zoomstufe von `70%` und darunter, wo Tabellen nur ihre Namen zeigen, entfernen sie stattdessen die gesamte Auswahl – siehe [Tabellen und Notizen löschen](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` oder `Alt + Delete` (Windows/Linux), `⌥ + ⌫` oder `⌥ + Delete` (Mac). Diese entfernen die ausgewählten Spalten der fokussierten Tabelle, auch wenn zusätzlich andere Tabellen oder Notizen ausgewählt sind. Sie entfernen nichts, solange eine Zelle bearbeitet wird, und auch nicht bei einer Zoomstufe von `70%` und darunter.

![Mit Alt + Backspace eine Spalte löschen, dann zwei ausgewählte Spalten](/img/demo-column-remove.webp)

Das Kontextmenü der Tabelle bewirkt dasselbe. Wenn die Tabelle das einzige ausgewählte Element ist, klicken Sie mit der rechten Maustaste auf die Zeile einer Spalte: Der letzte Eintrag des Menüs lautet `Delete column` oder, wenn diese Zeile eine von zwei oder mehr ausgewählten Spalten ist, `Delete columns`.

Während eine Zelle bearbeitet wird, löschen `Delete` und `Backspace` nur Text. Wenn Sie sie außerhalb des Zelleneditors gedrückt halten, entfernen sie nur ein einziges Mal etwas.  
Nach dem Entfernen wechselt der Fokus auf die nächstgelegene verbleibende Spalte oberhalb der fokussierten. Wenn darüber keine mehr übrig ist, wechselt der Fokus auf den Tabellennamen, auch wenn darunter noch Spalten verbleiben, sodass das nächste `Delete` oder `Backspace` die Tabelle statt einer Spalte entfernt.  
Beziehungen und Indizes, die eine entfernte Spalte verwenden, werden mit ihr entfernt. Es gibt keine Rückfrage, und das gesamte Entfernen ist ein Rückgängig-Schritt.

## Spalten kopieren/einfügen {#copyingpasting-columns}

Funktioniert wie eine tabellenbasierte Zwischenablage.  
Tastenkombinationen: `Ctrl + C` (Windows/Linux) oder `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) oder `⌘ + V` (Mac)

Das Kopieren in eine Tabellenkalkulation, das Einfügen aus einer solchen und das Einfügen in die Tabelle, deren Spaltenzelle fokussiert ist, verwenden die Zellen, die die Tabellen anzeigen, in der Reihenfolge, in der sie sie anzeigen – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options) und [Spaltenreihenfolge anpassen](./settings.md#adjusting-column-order).  
Spalten, die im Editor kopiert und bei ausgewähltem Tabellenkopf oder in die anderen ausgewählten Tabellen eingefügt werden, übernehmen jede Zelle der kopierten Spalten, auch ausgeblendete, etwa Eindeutig und Autoinkrement.  
Die Markierungen für [Alternativschlüssel](./table-related-functions.md#alternate-keys), etwa `AK1.1`, sind keine Zellen, sodass Kopieren und Einfügen sie auslassen, auch wenn sie angezeigt werden.

Sie können aus dem Editor in Excel und aus Excel zurück in den Editor einfügen.  
Zellwerte werden genau so ausgegeben, wie sie eingegeben wurden, sodass ein Wert wie `<label>` oder `a &amp; b` unverändert in einer Tabellenkalkulation oder einem Dokument ankommt.  
Die Spalten einer Tabellenkalkulation werden den sichtbaren Zellen nach Position und nicht nach Name zugeordnet, sodass die Spalten des Tabellenblatts der Reihenfolge dieser Zellen folgen müssen.  
Für die folgenden Spalten wird jeder dieser Werte als wahr gelesen (ohne Beachtung der Groß-/Kleinschreibung):

- Autoinkrement: `TRUE`, `1`, `YES`, `Y`
- Eindeutig: `TRUE`, `1`, `YES`, `Y`
- Nicht NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Beim Herauskopieren schreibt der Editor `TRUE` oder `FALSE` für Autoinkrement und Eindeutig sowie `NOT NULL` oder `NULL` für Nicht NULL.  
Eindeutig und Autoinkrement sind standardmäßig ausgeblendet, sodass `TRUE` und `FALSE` erst geschrieben und gelesen werden, wenn diese Zellen eingeblendet sind.

![Vier Spalten in eine Tabellenkalkulation einfügen, wobei die Kennzeichen als TRUE/FALSE und NOT NULL/NULL geschrieben werden](/img/demo-copy-column-to-sheet.webp)

![Drei Zeilen einer Tabellenkalkulation als Spalten in eine Tabelle einfügen, wobei YES, 1 und NOT NULL als wahr gelesen werden](/img/demo-copy-sheet-column.webp)

Wo eingefügte Inhalte landen, hängt vom Fokus ab:

- Bei ausgewähltem Tabellenkopf werden die eingefügten Zeilen jeder ausgewählten Tabelle als neue Spalten hinzugefügt.
- Bei fokussierter Spaltenzelle werden die ausgewählten Zeilen dieser Tabelle und danach die Zeilen unterhalb der letzten von ihnen der Reihe nach überschrieben, so viele, wie eingefügt wurden. Zeilen zwischen getrennten Auswahlen werden übersprungen. Eine überschriebene Zeile übernimmt die eingefügten Werte in ihren sichtbaren Zellen und behält ihre ausgeblendeten, und die überzähligen Zeilen werden als neue Spalten hinzugefügt. Jeder anderen ausgewählten Tabelle werden die eingefügten Zeilen als neue Spalten hinzugefügt.

![Zwei Spalten kopieren und gleichzeitig in zwei ausgewählte Tabellen einfügen](/img/demo-copy-column-multi.webp)

## Tabellen und Notizen kopieren/einfügen {#copyingpasting-tables-and-memos}

Wenn innerhalb einer fokussierten Tabelle keine Spalte ausgewählt ist, kopieren dieselben Tastenkombinationen die ausgewählten Tabellen und Notizen selbst – siehe [Tabellenfunktionen](./table-related-functions.md).

## Primärschlüssel für Spalten {#column-primary-key}

Schaltet den Primärschlüssel der fokussierten Spalte ein oder aus, also der Spalte, zu der die fokussierte Zelle gehört.  
Wenn die fokussierte Spalte eine von zwei oder mehr ausgewählten Spalten ist, gilt das Umschalten für alle ausgewählten Spalten: Ist eine von ihnen kein Schlüssel, werden alle zu Schlüsseln, und sind bereits alle Schlüssel, wird der Schlüssel bei allen entfernt. Spalten außerhalb der Auswahl bleiben unverändert.  
Verwenden Sie das Kontextmenü der Tabelle oder die Tastenkombination `Alt + K` (Windows/Linux) oder `⌥ + K` (Mac). Wenn das Umschalten zwei oder mehr Spalten betrifft, lautet der Menüeintrag `Primary Key on selected columns` statt `Primary Key`.  
Das Schlüsselsymbol in der Zeile dient nur der Anzeige, sodass ein Klick darauf den Schlüssel nicht setzt.

Um mehrere Spalten zu einem zusammengesetzten Schlüssel zu machen, [wählen Sie sie aus](#selecting-multiple-columns), und drücken Sie dann `Alt + K` (Windows/Linux) oder `⌥ + K` (Mac), oder klicken Sie mit der rechten Maustaste auf eine der ausgewählten Zeilen und wählen Sie `Primary Key on selected columns`. Jedes Umschalten ist ein Rückgängig-Schritt.

![Zwei Spalten mit Shift + Arrow Down auswählen, dann beide mit ⌥ + K zum Primärschlüssel machen und mit einem zweiten Tastendruck bei beiden wieder aufheben](/img/demo-column-pk.webp)
