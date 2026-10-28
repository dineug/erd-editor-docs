---
sidebar_position: 1
description: Vom Willkommensbildschirm aus beginnen und Tabellen, Notizen, Tabellengruppen und Beziehungen über das Kontextmenü der Zeichenfläche, die Symbolleiste der Zeichenfläche oder eine Tastenkombination erstellen.
---

# Mit dem Bearbeiten beginnen

Das Bearbeiten beginnt über das Kontextmenü, das Sie mit einem Rechtsklick öffnen.

![Mit der rechten Maustaste auf die Zeichenfläche klicken, das Untermenü Relationship öffnen, eine Tabelle hinzufügen und dann ihr eigenes Menü öffnen](/img/demo-context-menu.webp)

Ein Rechtsklick auf eine Tabelle, eine Notiz, eine Tabellengruppe oder eine Beziehung öffnet stattdessen das eigene Menü dieses Elements.  
Ein Rechtsklick auf eine bereits ausgewählte Tabelle, Notiz oder Tabellengruppe behält die gesamte Auswahl bei, sodass Einträge wie `Color` und `Delete selected` auf die ganze Auswahl wirken – siehe [Mehrfachauswahl](./table-related-functions.md#multiple-selection).  
Ein schreibgeschützter Editor erstellt nichts, daher wird dort nichts von dem angeboten, was diese Seite beschreibt: Das Zeichenflächenmenü behält nur `View Option`, `Name View`, `Export` und `Diff Viewer`, das Menü einer Tabelle nur `Table Properties`, und eine Notiz, eine Tabellengruppe oder eine Beziehung öffnet kein Menü – siehe [Schreibgeschützte Editoren](./table-related-functions.md#read-only-editors).

## Willkommensbildschirm {#welcome-screen}

In der Web-App, in Google Drive, VS Code, Obsidian und einer JetBrains-IDE öffnet sich ein leeres Diagramm mit einem Willkommensbildschirm über der ERD-Zeichenfläche. Ein Element `<erd-editor>` auf Ihrer eigenen Seite zeigt ihn nur, wenn die Seite ihn mit [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen) einschaltet.  
Ein Diagramm gilt als leer, solange es keine Tabelle, keine eingeblendete Notiz und keine eingeblendete Tabellengruppe enthält, daher zählen Notizen und Gruppen, die mit den Ansichtsoptionen ausgeblendet sind, nicht. Der Bildschirm verschwindet, sobald das Diagramm eines davon enthält, und kehrt zurück, wann immer das Diagramm wieder leer ist, zum Beispiel nachdem Sie die letzte Tabelle gelöscht oder das Hinzufügen der ersten rückgängig gemacht haben.  
Er wird weder in einem schreibgeschützten Editor noch im Zen-Modus angezeigt, auch nicht, solange die Tabelleneigenschaften geöffnet sind oder solange die Diff-Ansicht, die Vorschau des Automatischen Layouts oder die Zeitreise die Zeichenfläche übernimmt.

![Der Willkommensbildschirm auf einem leeren Diagramm: die Formate von Import öffnen, mit Esc zurückgehen, mit New Table eine Tabelle hinzufügen und dann den Bildschirm mit ⌘ + Z zurückholen](/img/demo-welcome-screen.webp)

Unter der Überschrift `Right-click the canvas for every action.` befindet sich ein Menü:

- `New Table` fügt eine Tabelle hinzu, wie `Alt + N`.
- `New Memo` fügt eine Notiz hinzu, wie `Alt + M`. Der Eintrag entfällt, solange Notizen ausgeblendet sind.
- `Import` ersetzt das Menü durch `Back` und die Formate `json`, `Schema SQL`, `GraphQL`, `DBML` und `AML`. Nach der Wahl eines Formats wird eine Datei dieses Formats abgefragt und anstelle des leeren Diagramms geladen – siehe [Dateien importieren oder exportieren](./file-import-export.md). `Back` oder `Escape` führt zum ersten Menü zurück.
- `Command Palette` öffnet die [Schnellsuche](./quick-search.md), wie `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac).
- `Shortcuts` öffnet die Einstellungen auf ihrer Registerkarte [`Shortcuts`](./settings.md#shortcuts).

Wo die Zeichenfläche breit genug ist, zeigen `New Table`, `New Memo` und `Command Palette` die Taste, die ihrem Befehl derzeit zugewiesen ist, auch wenn ein Host sie neu belegt hat.  
Sobald ein Eintrag den Tastaturfokus hat, wechseln `↑` und `↓` zwischen den Einträgen und springen dabei vom letzten zum ersten und umgekehrt, `Home` und `End` springen zum ersten und zum letzten Eintrag, und `Enter` oder `Space` betätigt den fokussierten Eintrag. Alle anderen Tastenkombinationen funktionieren weiterhin, sodass `Alt + N` auch von dort aus eine Tabelle hinzufügt.  
Nur das Menü nimmt Klicks an: Ein Drücken der Maustaste an einer anderen Stelle des Bildschirms erreicht die Zeichenfläche, und ein Rechtsklick auf die Zeichenfläche öffnet wie gewohnt das Kontextmenü.

Wo die Zeichenfläche Platz bietet, zeigen handgezeichnete Pfeile auf:

- die Schaltfläche `Search` der Symbolleiste: `Search commands and tables`
- die Schaltflächen `Theme` und `Display Language`: `Pick a theme and a language` oder, wenn die Symbolleiste nur eine von beiden zeigt, `Pick a theme` oder `Pick a language` – siehe [Sprache und Design](./language-and-theme.md)
- die [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar) am unteren Rand: `Pan, zoom and draw relationships`

Solange der [Explorer](./explorer.md) eingeblendet ist, bedeckt der Willkommensbildschirm nur die Zeichenfläche daneben.  
Ein Pfeil, dessen Schaltfläche in der Symbolleiste über dem Explorer steht, entfällt. Der Pfeil für `Theme` und `Display Language` entfällt erst, wenn seine beiden Schaltflächen über dem Explorer stehen; bis dahin zeigt er auf diejenige, die noch über der Zeichenfläche steht.  
Eine Beschriftung, die neben ihrem Pfeil keinen Platz hat, hängt stattdessen unter dem Pfeil.

## Tabellen erstellen {#table-creation}

Erstellen Sie eine Tabelle über das Kontextmenü, mit der Schaltfläche `New Table` in der [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar) oder mit der Tastenkombination `Alt + N`.

## Notizen erstellen {#memo-creation}

Erstellen Sie eine Notiz über das Kontextmenü, mit der Schaltfläche `New Memo` in der Symbolleiste der Zeichenfläche oder mit der Tastenkombination `Alt + M`.  
Solange View Option → `Memos` ausgeschaltet ist, sind Notizen ausgeblendet, nirgends wird `New Memo` angeboten, und `Alt + M` fügt keine hinzu – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options).

Eine Notiz ist ein Freitext auf der Zeichenfläche. Klicken Sie in ihren Textbereich und schreiben Sie; der Text wird mit dem Dokument gespeichert.  
`Escape` beendet den Bearbeitungsmodus der Notiz, behält Ihre Eingabe bei und lässt die Notiz ausgewählt, und ein zweites `Escape` hebt die Auswahl auf.  
Ziehen Sie ihren Rand, um ihre Größe zu ändern. Das `x` in ihrer Kopfzeile, das angezeigt wird, solange sich der Zeiger über der Notiz befindet, löscht sie.  
Ein Rechtsklick auf eine Notiz öffnet ihr Menü, nicht den Bearbeitungsmodus: `Color`, `Remove color`, solange ein ausgewähltes Element eine Farbe hat, und `Delete`, angezeigt als `Delete selected`, solange die Notiz eines von zwei oder mehr ausgewählten Elementen ist. Eine ausgewählte Notiz wird auch mit den Tasten gelöscht, die Tabellen löschen – siehe [Tabellen und Notizen löschen](./table-related-functions.md#table-and-memo-deletion).

![Mit Alt + M eine Notiz hinzufügen, Text eingeben und ihren Rand ziehen, um ihre Größe zu ändern](/img/demo-memo.webp)

## Tabellengruppen erstellen {#table-group-creation}

Eine Tabellengruppe ist ein Rahmen, der Tabellen enthält, und Sie können ihr einen Namen und eine Farbe geben. Erstellen Sie eine Tabellengruppe auf einem von zwei Wegen:

- Wählen Sie `New Table Group` im Kontextmenü oder in der Schnellsuche, klicken Sie auf die Schaltfläche `New Table Group` in der [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar) oder drücken Sie `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac), und ziehen Sie dann einen Rahmen über die Zeichenfläche auf. Jede Tabelle, deren Mitte im Rahmen liegt, wird in die neue Gruppe aufgenommen, sofern sie nicht bereits in einer anderen Gruppe ist – siehe [Gruppe zeichnen](./table-groups.md#drawing-a-group).
- Wählen Sie Tabellen aus und rufen Sie `Group selected tables` im Kontextmenü einer Tabelle oder `Group Selected Tables` in der Schnellsuche auf oder drücken Sie `T` und dann `G` – siehe [Ausgewählte Tabellen gruppieren](./table-groups.md#grouping-selected-tables).

Das Benennen, Einfärben, Verschieben, Ändern der Größe und alles Weitere wird in [Tabellengruppen](./table-groups.md) beschrieben.

## Beziehungen erstellen {#relationship-creation}

Beginnen Sie das Zeichnen einer Beziehung über das Kontextmenü, über die [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar) am unteren Rand der Zeichenfläche oder mit einer Tastenkombination. Jeder Beziehungstyp hat seine eigene:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) oder `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) oder `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) oder `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) oder `⌘ + ⌥ + 4` (Mac)

Sobald ein Typ aktiviert ist, ändert sich der Mauszeiger. Klicken Sie zuerst auf die Elterntabelle und dann auf die Kindtabelle.  
Die Elterntabelle erhält einen Primärschlüssel, falls sie keinen hat, und für jede Primärschlüsselspalte der Elterntabelle erhält die Kindtabelle eine Fremdschlüsselspalte mit `Not Null` und demselben Datentyp, Standardwert, Kommentar, [logischen Namen](./logical-names.md) und derselben [Domäne](./dictionary.md#domains-and-data-types).  
Ein Serial-Schlüssel bildet die Ausnahme: Sein Fremdschlüssel erhält den Ganzzahltyp, den der Serial-Typ speichert, etwa `integer` für `serial4`, und verknüpft dann keine Domäne – siehe [Identifizierende Beziehungen](./relationship-editing.md#identifying-relationships).  
Jede Fremdschlüsselspalte wird nach ihrem Schlüssel benannt: Einem Namen aus einem Wort wie `id` wird der Name der Elterntabelle vorangestellt (`user_id`), ein Name aus mehreren Wörtern wie `member_id` bleibt erhalten, und ein Name, den die Kindtabelle bereits hat, wird nummeriert (`user_id_2`) – siehe [Namen der Fremdschlüsselspalten](./relationship-editing.md#foreign-key-column-names).  
Wenn Sie zweimal auf dieselbe Tabelle klicken, wird eine selbstreferenzierende Beziehung gezeichnet.  
Bei einer neuen Beziehung stehen `On Delete` und `On Update` beide auf `Not set`; ändern Sie sie über das Kontextmenü der Beziehung – siehe [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Drücken Sie `Escape` oder erneut dieselbe Tastenkombination, um abzubrechen. Der Abbruch lässt die Auswahl, wie sie ist, und das nächste `Escape` hebt sie auf.

Sobald die Elterntabelle gewählt ist und Sie mit dem Zeiger auf eine Tabelle zeigen, an der die Beziehung enden kann, wird diese Tabelle umrandet, und daneben erscheinen zwei Schaltflächen:

- `Create new columns` (`+`) zeichnet die Beziehung mit neuen Fremdschlüsselspalten, wie ein Klick auf die Tabelle.
- `Map to existing columns` (ein Link-Symbol) beendet das Zeichnen und öffnet den Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) für die beiden Tabellen, sodass die Beziehung Spalten verwenden kann, die die Kindtabelle bereits hat. Nichts wird geschrieben, bevor Sie `Map` drücken.

Auch die Elterntabelle zeigt die Schaltflächen, sobald sich der Zeiger ein kleines Stück von der Stelle entfernt hat, an der Sie sie angeklickt haben, sodass auch eine selbstreferenzierende Beziehung bestehenden Spalten zugeordnet werden kann.  
Ein Finger hat keinen Hover-Zustand, daher erscheinen die Schaltflächen nie, wenn Sie mit einem Finger zeichnen, und ein Tippen auf die Kindtabelle zeichnet die Beziehung sofort; ein Stift zeigt sie wie eine Maus an.  
Hat die Elterntabelle ihren Primärschlüssel bis zum Erreichen der Kindtabelle verloren, zum Beispiel durch ein Rückgängigmachen oder die Änderung eines Mitbearbeiters, ist die Schaltfläche `Create new columns` mit dem Tooltip `<parent> has no primary key to copy` abgeblendet, und ein Klick auf die Kindtabelle beendet das Zeichnen, ohne etwas zu zeichnen.  
Der Tooltip benennt die Elterntabelle gemäß der [Namensansicht](./logical-names.md#beyond-the-canvas).

![Mit ⌘ + ⌥ + 4 eine Beziehung vom Typ One N zeichnen, dann eine vom Typ Zero N über die Symbolleiste der Zeichenfläche, wobei die Kindtabelle mit ihren Schaltflächen Map to existing columns und Create new columns umrandet ist](/img/demo-relationship.webp)

## Tabellen und Notizen duplizieren {#duplicating-tables-and-memos}

Vorhandene Tabellen und Notizen lassen sich kopieren, einfügen und mit gedrückter Taste `Alt` ziehen, um sie zu duplizieren – siehe [Tabellenfunktionen](./table-related-functions.md#copyingpasting-tables-and-memos).
