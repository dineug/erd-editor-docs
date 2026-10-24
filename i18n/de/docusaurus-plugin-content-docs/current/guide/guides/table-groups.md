---
sidebar_position: 6
description: Zusammengehörige Tabellen in einem benannten, farbigen Rahmen hinter ihnen sammeln; Gruppen erstellen, benennen, einfärben, verschieben, in der Größe ändern und entfernen, vom Explorer aus zu ihnen wechseln, ändern, welche Tabellen sie enthalten, sie ausblenden und sie im Automatischen Layout, in Schema SQL und in DBML beibehalten.
---

# Tabellengruppen

Eine Tabellengruppe ist ein benannter, farbiger Rahmen, der auf der ERD-Zeichenfläche hinter verwandten Tabellen gezeichnet wird, um zu zeigen, welche Tabellen zusammengehören.  
Eine Tabelle gehört zu höchstens einer Gruppe. Gruppen werden mit dem Diagramm gespeichert, zusammen mit der Angabe, in welcher Gruppe sich jede Tabelle befindet.

Der Rahmen hat an seiner Oberkante eine Titelleiste mit einem Gruppensymbol, dem Namen der Gruppe in Fettschrift und, solange sich der Zeiger über der Gruppe befindet, einem `x`, das sie entfernt – siehe [Gruppe entfernen](#removing-a-group). Eine Gruppe ohne Namen zeigt `unnamed`, und ein Name, der zu lang für die Leiste ist, wird mit `…` gekürzt.  
Der Rahmen umschließt immer seine Tabellen: Er behält die Größe, die er erhalten hat, dehnt sich aber, damit jede Tabelle mit `24px` Abstand ringsum und der Titelleiste darüber darin bleibt. Eine Tabelle, die wächst, dehnt den Rahmen mit, und ebenso eine Tabelle, die nahe an einem Rand abgelegt wird, während ihre Mitte noch im Rahmen liegt. Während Tabellen gezogen werden, wird der Rahmen weder größer noch kleiner. Die Dehnung wird nicht gespeichert: Der Rahmen kehrt zu seiner eigenen Größe zurück, sobald die Tabelle den Platz nicht mehr braucht.

Gruppen werden hinter allem anderen auf der Zeichenfläche gezeichnet: Tabellen, Notizen und Verbindungslinien.  
Wo sich Gruppen überlappen, wird die zuletzt gedrückte oder hinzugefügte vorn gezeichnet, und die Innenfläche einer Gruppe verdeckt nie die Titelleiste einer anderen Gruppe. Die Reihenfolge wird nicht gespeichert, daher stapelt ein erneut geöffnetes Diagramm seine Gruppen in der Reihenfolge, in der sie hinzugefügt wurden.  
Gruppen erscheinen auf der ERD-Zeichenfläche, in der Minimap und in einem exportierten Bild, und der [Explorer](./explorer.md) listet sie auf – siehe [Zu einer Gruppe wechseln](#going-to-a-group). Die Registerkarte [Visualisierung](./visualization.md) zeichnet in keinem der beiden Modi Gruppen oder Gruppenfarben.

Auch ein Coding-Agent kann Gruppen erstellen und ändern und die DDL ausgewählter Gruppen lesen – siehe [Tabellengruppen](../../mcp/tools.md#table-groups) bei den MCP-Tools.

![Mit ⌥ + G das Zeichnen einer Gruppe aktivieren, sie über orders und payments aufziehen, sie Billing nennen, order_items darin ablegen, dann die Gruppe verschieben und in der Größe ändern](/img/demo-table-group.webp)

## Gruppe erstellen {#creating-a-group}

Es gibt zwei Wege, eine Gruppe zu erstellen, jeweils mit einer Tastenkombination. Keiner davon wird angeboten, wenn der Editor schreibgeschützt ist oder Gruppen [ausgeblendet](#hiding-groups) sind, und ihre Tastenkombinationen bewirken dann nichts.  
Wie die anderen Tastenkombinationen der Zeichenfläche funktionieren sie nur auf der Registerkarte ERD und sind unterdrückt, solange eine Zelle, eine Notiz oder der Name einer Gruppe bearbeitet wird – siehe [Tastenkombinationen](./settings.md#shortcuts).

### Gruppe zeichnen {#drawing-a-group}

Klicken Sie auf die Schaltfläche `New Table Group` in der [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar), drücken Sie `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac) oder wählen Sie `New Table Group` im Kontextmenü der Zeichenfläche, wo der Eintrag auf `New Table` und `New Memo` folgt, oder in der [Schnellsuche](./quick-search.md) auf der Registerkarte ERD. Ziehen Sie dann einen Rahmen über die Zeichenfläche auf.  
Die Schaltfläche und die Tastenkombination schalten das Zeichnen ein und aus, daher beendet ein Druck auf eine der beiden das aktive Zeichnen, gleich wie es gestartet wurde; der Eintrag im Kontextmenü und die Schnellsuche starten es nur. Der Start schaltet das Hand-Werkzeug aus und bricht eine Beziehung ab, die gerade gezeichnet wird.  
Solange das Zeichnen aktiv ist, ist der Mauszeiger ein Fadenkreuz, und ein Druck beginnt den Rahmen an der Stelle, an der er erfolgt, auch über einer Tabelle, statt auszuwählen oder zu verschieben, was darunter liegt. Die Symbolleiste der Zeichenfläche markiert dann ihre Schaltfläche `New Table Group` und weder die Hand noch den Zeiger.

Beim Loslassen wird in diesem Rahmen eine Gruppe hinzugefügt, nie schmaler als `160px` und nie niedriger als `100px`, Titelleiste eingeschlossen, wie kurz das Ziehen auch war. Ein Klick ohne Ziehen fügt eine Gruppe mit `480px` Breite und `320px` Höhe hinzu, deren linke obere Ecke an der Stelle des Klicks liegt.  
Jede Tabelle ohne Gruppe, deren Mitte im neuen Rahmen liegt, wird in die Gruppe aufgenommen. Eine Tabelle, die bereits in einer anderen Gruppe ist, bleibt dort.

Die mittlere Maustaste verschiebt weiterhin die Ansicht der Zeichenfläche und lässt das Zeichnen aktiv. Folgendes beendet das Zeichnen, ohne eine Gruppe hinzuzufügen:

- `Escape` oder auch `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac), vor dem Drücken oder während des Ziehens. Vor dem Drücken lassen sie die Auswahl, wie sie ist; das Drücken, mit dem der Rahmen beginnt, hat sie bereits aufgehoben.
- Ein Rechtsklick, der die Auswahl aufhebt. Es öffnet sich kein Kontextmenü.
- Der Wechsel zum Hand-Werkzeug mit `Space` oder über die Symbolleiste der Zeichenfläche, ein Klick auf den Zeiger der Symbolleiste oder ihre Schaltfläche `New Table Group` oder das Beginnen einer Beziehung.
- Der Wechsel zu einer anderen Registerkarte, das Ausblenden der Gruppen oder wenn der Editor schreibgeschützt wird.

### Ausgewählte Tabellen gruppieren {#grouping-selected-tables}

Wählen Sie eine oder mehrere Tabellen aus und drücken Sie `T` und dann `G`, oder wählen Sie `Group selected tables` im Kontextmenü einer Tabelle oder `Group Selected Tables` in der Schnellsuche, die den Befehl aufführt, solange eine Tabelle ausgewählt ist.  
Die neue Gruppe wird um die ausgewählten Tabellen gezeichnet, mit `24px` Abstand auf jeder Seite und der Titelleiste darüber. Jede ausgewählte Tabelle wird in sie aufgenommen und verlässt dabei ihre bisherige Gruppe, und die verlassene Gruppe bleibt bestehen, auch wenn sie nun leer ist. Notizen in der Auswahl werden übergangen.

`T` und dann `G` sind zwei Tastendrücke ohne Zusatztaste, `G` innerhalb einer Sekunde nach `T`. Ohne ausgewählte Tabelle bewirkt die Kombination nichts, und in einem Textfeld, etwa dem Suchfeld des Explorers, gibt sie die beiden Buchstaben ein.

![categories und products mit T und dann G gruppieren, die Gruppe Catalog nennen, sie dann über ihr Menü violett einfärben, sodass beide Tabellenköpfe die Farbe annehmen](/img/demo-table-group-selected.webp)

In beiden Fällen hat die neue Gruppe weder Namen noch Farbe. Sie wird allein ausgewählt, und ihr Namensfeld öffnet sich über der Titelleiste, sodass Sie sofort einen Namen eingeben können – siehe [Gruppe benennen](#naming-a-group).  
Die Gruppe und die Tabellen, die sie aufnimmt, sind ein Rückgängig-Schritt, und der Name, den Sie eingeben, ist ein weiterer.

## Gruppe benennen {#naming-a-group}

Der Name einer Gruppe wird in einem Feld bearbeitet, das sich über ihrer Titelleiste öffnet. Es öffnet sich von selbst, sobald eine Gruppe erstellt wird, bei einem Doppelklick auf die Titelleiste und über `Rename` im Kontextmenü der Gruppe.  
`Enter` oder ein Klick an eine andere Stelle speichert den Namen. `Escape` schließt das Feld, ohne den Namen zu ändern, und lässt die Gruppe ausgewählt, und ein zweites `Escape` hebt die Auswahl auf.  
Ein geänderter Name ist ein Rückgängig-Schritt; wird der Name unverändert gespeichert, wird nichts aufgezeichnet. Ein leerer oder nur aus Leerzeichen bestehender Name wird als `unnamed` angezeigt.  
Solange das Feld geöffnet ist, sind die Tastenkombinationen der Zeichenfläche unterdrückt, und die Tastenkombinationen für die Schnellsuche und `Toggle Explorer` bewirken nichts, wie beim Bearbeiten einer Tabellenzelle.

[Suchen und Ersetzen](./find-and-replace.md#what-it-searches) durchsucht Gruppennamen unter `Table group names`, solange Gruppen eingeblendet sind, und seine Schaltflächen `Replace` und `Replace All` benennen Gruppen um – siehe [Ersetzen](./find-and-replace.md#replacing). Die [Schnellsuche](./quick-search.md#searching-the-diagram) durchsucht keine Gruppennamen.

## Gruppe einfärben {#coloring-a-group}

Wählen Sie `Color` im Kontextmenü der Gruppe, um die Farbauswahl mit der Farbe der Gruppe zu öffnen.  
Wie bei Tabellen und Notizen färbt die Farbauswahl jede ausgewählte Tabelle, Notiz und Gruppe ein, und `Remove color` im Menü oder `No color` in der Farbauswahl entfernt die Farbe von allen – siehe [Farben für Tabellen und Notizen festlegen](./table-related-functions.md#table-and-memo-color-specification). Die Farbe einer Gruppe wird auch unter `Document colors` in der Farbauswahl angeboten.

Eine eingefärbte Gruppe zeichnet ihre Titelleiste und ihren Umriss in der Farbe und ihre Innenfläche in einem blassen Ton dieser Farbe. Eine Gruppe ohne Farbe verwendet die neutralen Grautöne des Designs.  
Jede Tabelle in einer eingefärbten Gruppe trägt die Farbe der Gruppe über ihren ganzen Tabellenkopf und behält ihre eigene Farbe an ihrem linken Rand, sodass beide sichtbar sind.  
Text und Schaltflächen auf einem solchen Tabellenkopf werden weiß, oder schwarz auf einer hellen Farbe, auf der Schwarz deutlich besser lesbar ist, ebenso wie Name, Symbol und `x` auf der Titelleiste der Gruppe. Unter den vordefinierten Farbfeldern der Farbauswahl erhalten Orange, Amber, Yellow und Lime Schwarz und die übrigen Weiß.  
Eine Tabelle behält ihren eigenen Tabellenkopf, solange ihre Gruppe keine Farbe hat, solange Gruppen ausgeblendet sind, bei einer Zoomstufe von `70%` und darunter, wo Tabellen auf ihren Namen eingeklappt werden, und auf der Registerkarte Visualisierung.

Eine Farbänderung wird im [Verlauf](./undo-redo.md#one-gesture-one-step) aufgezeichnet, wie bei Tabellen und Notizen.

## Gruppen auswählen {#selecting-groups}

Klicken Sie auf die Titelleiste einer Gruppe, um nur diese Gruppe auszuwählen, oder verwenden Sie `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac), um sie zur Auswahl hinzuzufügen.  
Ein Druck auf die Titelleiste einer bereits ausgewählten Gruppe behält die gesamte Auswahl bei, sodass ein anschließendes Ziehen alles verschiebt.  
Ein Druck auf die Titelleiste oder ein Rechtsklick auf die Gruppe holt die Gruppe vor die anderen Gruppen und ihre Tabellen vor alle anderen Tabellen und Notizen.

Die Innenfläche, die Fläche unter der Titelleiste, verhält sich für die linke Maustaste wie die Zeichenfläche: Ziehen verschiebt die Ansicht, `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac) zieht einen Auswahlrahmen auf, und ein Klick hebt die Auswahl auf. Die Tabellen, Notizen und Verbindungslinien über der Innenfläche reagieren wie gewohnt auf den Zeiger.

Ein Auswahlrahmen erfasst eine Gruppe nur, wenn er den gesamten Rahmen der Gruppe umschließt, sodass ein innerhalb einer Gruppe aufgezogener Auswahlrahmen Tabellen ohne die Gruppe auswählt – siehe [Mehrfachauswahl](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) oder `⌘ + A` (Mac) wählt nie eine Gruppe aus.

`Select tables` im Kontextmenü der Gruppe ersetzt die Auswahl durch die Tabellen der Gruppe, ohne die Gruppe selbst, sodass der nächste Befehl nur die Tabellen erreicht.  
Verwenden Sie den Eintrag vor Befehlen, die nur auf Tabellen wirken, etwa das Kopieren oder das [Fokussieren auf Tabellen](./table-related-functions.md#focusing-on-tables), die eine ausgewählte Gruppe übergehen.

Der Umriss einer ausgewählten Gruppe nimmt die Auswahlfarbe an. In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) wird eine Gruppe, die ein anderer Teilnehmer auswählt, in der Farbe dieses Teilnehmers umrandet.

## Zu einer Gruppe wechseln {#going-to-a-group}

Der [Explorer](./explorer.md#the-tree) listet die Gruppen in seinem Ordner `Table Groups` nach Namen auf, jede mit ihren Tabellen darunter. Die Schnellsuche listet keine Gruppen auf.

Das Wählen einer Gruppenzeile im Explorer, eines Treffers von [Suchen und Ersetzen](./find-and-replace.md#going-to-a-match) im Namen einer Gruppe oder einer Gruppenzeile in der Liste der [Diff-Ansicht](./table-related-functions.md#the-change-tree) wechselt zu dieser Gruppe.  
Dabei wird der Rahmen der Gruppe in die Ansicht geholt, ausgerichtet an ihrer Titelleiste, wenn der Rahmen höher als die Zeichenfläche ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands). Anschließend wird nur die Gruppe ausgewählt und mit ihren Tabellen in den Vordergrund geholt, wie bei einem Druck auf ihre Titelleiste.  
Solange Gruppen [ausgeblendet](#hiding-groups) sind oder nachdem die Gruppe entfernt wurde, bewirkt der Wechsel zu ihr nichts.  
In der Diff-Ansicht wechselt jede Seite nur dann zur Gruppe, wenn ihr eigenes Dokument sie enthält und anzeigt – siehe [Zu einer Änderung wechseln](./table-related-functions.md#going-to-a-change).

## Gruppe verschieben und in der Größe ändern {#moving-and-resizing-a-group}

Ziehen Sie eine Gruppe an ihrer Titelleiste, um sie mit all ihren Tabellen zu verschieben.  
Ist die Gruppe Teil einer größeren Auswahl, bewegt sich die gesamte Auswahl mit, und eine Tabelle, die sowohl ausgewählt als auch in der Gruppe ist, wird nur einmal verschoben.  
Das Ziehen beginnt erst, wenn sich der Zeiger ein kurzes Stück bewegt hat, sodass ein Klick oder Doppelklick auf die Titelleiste ein Klick bleibt. `Alt + drag` auf einer Titelleiste verschiebt die Gruppe wie normales Ziehen; eine Gruppe wird nie dupliziert.  
Das Verschieben ist mit allen Tabellen, die es mitnimmt, ein Rückgängig-Schritt.

Das Ziehen einer einzelnen Tabelle verschiebt nur diese Tabelle und kann sie in eine Gruppe hinein- oder aus ihr herausbewegen – siehe [Tabellen hinzufügen und entfernen](#adding-and-removing-tables).

Jede Gruppe hat an ihren vier Rändern und vier Ecken Ziehpunkte zum Ändern der Größe, ob ausgewählt oder nicht, wie eine Notiz.  
Ziehen Sie einen davon mit der linken Maustaste: Der Rahmen folgt dem Zeiger, und die neue Größe wird gespeichert, wenn Sie loslassen, als ein Rückgängig-Schritt.  
Eine Gruppe kann nicht kleiner als `160px` mal `100px` gemacht werden und auch nicht kleiner als ihre Tabellen mit ihren `24px` Abstand und der Titelleiste. Der Rand bleibt dort stehen, wie weit der Zeiger auch geht.

## Tabellen hinzufügen und entfernen {#adding-and-removing-tables}

Wo Sie eine Tabelle ablegen, entscheidet, ob sie in eine Gruppe aufgenommen wird oder ihre Gruppe verlässt.  
Wenn Sie Tabellen ziehen und loslassen, wird jede gezogene Tabelle, die nicht von einer ausgewählten Gruppe mitgenommen wird, anhand ihrer Mitte beurteilt. Sie wird in die oberste Gruppe aufgenommen, deren Rahmen ihre Mitte enthält, oder verlässt ihre Gruppe, wenn ihre Mitte im Rahmen keiner Gruppe liegt. Die oberste Gruppe ist die, die vorn gezeichnet wird.  
Eine Gruppe, die beim Ziehen an ihrem Platz bleibt, behält den Rahmen, den sie zu Beginn des Ziehens hatte, sodass eine innerhalb ihrer eigenen Gruppe leicht verschobene Tabelle in ihr bleibt und so weit gezogen werden muss, bis ihre Mitte außerhalb dieses Rahmens liegt, um die Gruppe zu verlassen.  
Während Sie ziehen, wird jede Gruppe umrandet, in die das Ablegen eine Tabelle bringen würde.

Wenn Sie innerhalb von etwa `200ms` nach der letzten Bewegung loslassen, ist der Gruppenwechsel Teil des Rückgängig-Schritts des Ziehens, sodass ein einziges Rückgängigmachen die Tabellen wieder an ihren vorherigen Platz und in ihre vorherigen Gruppen bringt. Nach einer längeren Pause vor dem Loslassen ist der Gruppenwechsel ein eigener Schritt – siehe [Eine Geste, ein Schritt](./undo-redo.md#one-gesture-one-step).  
Ein Klick oder ein Ziehen um wenige Pixel ändert keine Gruppe, und solange Gruppen ausgeblendet sind, ändert sich keine Gruppenzugehörigkeit.

Die übrigen Wege, um zu ändern, welche Tabellen eine Gruppe enthält:

- `Remove from group` im Kontextmenü einer Tabelle nimmt jede ausgewählte Tabelle aus ihrer Gruppe. Der Eintrag erscheint, solange eine ausgewählte Tabelle in einer Gruppe ist, auch wenn Gruppen ausgeblendet sind, und ist ein Rückgängig-Schritt.
- `Group selected tables` nimmt die ausgewählten Tabellen in eine neue Gruppe auf – siehe [Ausgewählte Tabellen gruppieren](#grouping-selected-tables).
- Das Entfernen einer Gruppe lässt ihre Tabellen ohne Gruppe zurück.

Eine eingefügte oder mit `Alt` duplizierte Tabelle ist in keiner Gruppe, auch wenn sie im Rahmen einer Gruppe landet. Wird sie danach gezogen, gilt die Regel für das Ablegen.

## Gruppe entfernen {#removing-a-group}

Das Entfernen einer Gruppe entfernt nie ihre Tabellen: Sie bleiben, wo sie sind, ohne Gruppe.

- Das `x` am Ende der Titelleiste, das erscheint, solange sich der Zeiger über der Gruppe befindet, entfernt nur diese Gruppe.
- `Delete` im Kontextmenü der Gruppe entfernt die Gruppe. Ist die Gruppe eines von mehreren ausgewählten Elementen, lautet der Eintrag `Delete selected` und entfernt alles Ausgewählte: Tabellen, Notizen und Gruppen.
- Sind Gruppen ausgewählt, entfernt `Delete` oder `Backspace` die ausgewählten Gruppen zusammen mit allen ausgewählten Tabellen und Notizen, ebenso `Ctrl + Backspace` und `Ctrl + Delete` (Windows/Linux) oder `⌘ + Backspace` und `⌘ + Delete` (Mac) – siehe [Tabellen und Notizen löschen](./table-related-functions.md#table-and-memo-deletion).

Jedes Entfernen ist ein Rückgängig-Schritt, der die Gruppe mit ihren Tabellen darin wiederherstellt.

## Das Gruppenmenü {#the-group-menu}

Klicken Sie mit der rechten Maustaste auf die Titelleiste, die Innenfläche oder den Rand einer Gruppe, um ihr Menü zu öffnen. Auf einem Mac öffnet es auch `Ctrl + click`, ebenso ein langes Drücken auf einem Touchscreen.  
Der Rechtsklick wählt zuerst die Gruppe aus, und zwar allein, sofern sie nicht bereits Teil der Auswahl ist, sodass `Color` und `Delete selected` den Rest der Auswahl nur erreichen, wenn die Gruppe darin enthalten war.

- `Select tables`: wählt nur die Tabellen der Gruppe aus – siehe [Gruppen auswählen](#selecting-groups).
- `Rename`: öffnet das Namensfeld – siehe [Gruppe benennen](#naming-a-group).
- `Color`: öffnet die Farbauswahl – siehe [Gruppe einfärben](#coloring-a-group).
- `Remove color`: wird angezeigt, solange etwas Ausgewähltes eine Farbe hat.
- `Delete` oder `Delete selected`, wenn die Gruppe eines von mehreren ausgewählten Elementen ist, mit der rechts angezeigten Taste `Delete` – siehe [Gruppe entfernen](#removing-a-group).

Das Kontextmenü einer Tabelle ergänzt `Group selected tables` und `Remove from group` nach `Color` und `Remove color`, vor seinem Eintrag Delete, und das Kontextmenü der Zeichenfläche ergänzt `New Table Group`.  
`Group selected tables` zeigt rechts seine Tasten, `T` und dann `G`, und `New Table Group` zeigt `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac).

## Gruppen ausblenden {#hiding-groups}

`View Option` → `Table Groups` im Kontextmenü der Zeichenfläche blendet alle Gruppen ein oder aus. Die Option ist standardmäßig angehakt – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options).  
Ohne Haken verschwinden die Gruppenrahmen und die Gruppenfarben auf den Tabellenköpfen von der Zeichenfläche, aus der Minimap und aus exportierten Bildern, und die Scrollleisten und die Minimap halten keinen Platz mehr für die Gruppen frei. Nichts wird verschoben oder in der Größe geändert, und jede Tabelle bleibt in ihrer Gruppe.  
Das Ausblenden der Gruppen hebt ihre Auswahl auf, beendet ein Zeichnen mit `New Table Group` und schließt ein geöffnetes Namensfeld.

Solange Gruppen ausgeblendet sind:

- `New Table Group` und `Group selected tables` werden in den Menüs nicht angeboten, ebenso wenig `New Table Group` und `Group Selected Tables` in der Schnellsuche, und in der Symbolleiste der Zeichenfläche entfällt ihre Schaltfläche `New Table Group`. `Remove from group` wird weiterhin angeboten.
- `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac) sowie `T` und dann `G` bewirken nichts.
- Das Ziehen von Tabellen ändert keine Gruppe, und ein Auswahlrahmen erfasst keine Gruppe.
- Im Explorer entfällt der Ordner `Table Groups`, und Suchen und Ersetzen findet und ersetzt keine Gruppennamen, auch wenn `Table group names` eingeschaltet ist.
- [Automatisches Layout](#auto-layout) hält die Tabellen jeder Gruppe weiterhin zusammen, die Registerkarte Schema SQL bietet weiterhin die [Gruppen zur Auswahl](#schema-sql-by-group) an, DBML schreibt sie weiterhin, und [Importieren und hinzufügen](./file-import-export.md#import-and-add) legt seine Inhalte weiterhin unterhalb der ausgeblendeten Rahmen ab.

Die Einstellung wird im Dokument gespeichert und im [Verlauf](./undo-redo.md#what-the-history-records) aufgezeichnet, wie die anderen Schalter der Ansichtsoptionen.

## Automatisches Layout {#auto-layout}

Jedes [Automatische Layout](./table-related-functions.md#auto-layout) hält die Tabellen jeder Gruppe zusammen, ob Gruppen eingeblendet sind oder nicht.

- `Force` verschiebt jede Gruppe mit ihren Tabellen als einen einzigen Rahmen, wobei die Tabellen ihre Plätze darin behalten, und hält den Rahmen jeder Gruppe mindestens `100px` von anderen Gruppen und von Tabellen ohne Gruppe entfernt. Die Vorschau zeigt jede Gruppe dort, wohin sie kommt.
- `Flow`, `Tree - vertical` und `Tree - horizontal` ordnen die Tabellen jeder Gruppe innerhalb der Gruppe an und platzieren die Gruppen anhand der Beziehungen zwischen ihnen, wobei die Tabellen ohne Gruppe um sie herum angeordnet werden.

Danach wird jede Gruppe, die Tabellen enthält, an diese angepasst: Ihr Rahmen wird zum umschließenden Rechteck der Tabellen mit `24px` Abstand und der Titelleiste. Eine Gruppe ohne Tabellen behält Position und Größe.  
Tabellen und Gruppen werden in einem Rückgängig-Schritt platziert.

Ein DBML-Import passt jede Gruppe auf dieselbe Weise um ihre Tabellen an, wo auch immer sie platziert sind – siehe [DBML](./file-import-export.md#dbml).

## Schema SQL nach Gruppe {#schema-sql-by-group}

Die Registerkarte [Schema SQL](./schema-sql.md) kann nur die Tabellen ausgewählter Gruppen schreiben.  
Solange das Dokument eine Gruppe enthält, ob eingeblendet oder ausgeblendet, zeigt der Optionsbereich der Registerkarte unter `This window only` eine Zeile `Tables` mit einem Kontrollkästchen für `All`, einem für jede Gruppe und einem für `No group`, die Tabellen ohne Gruppe – siehe [Tabellen](./schema-sql.md#tables).  
Die Auswahl gehört zum Editorfenster und wird nicht im Dokument gespeichert.

## Import, Export und Kopieren {#import-export-and-copying}

- DBML überträgt Gruppen in beide Richtungen. Ein DBML-Import macht aus jedem Block `TableGroup` eine Gruppe – siehe [DBML](./file-import-export.md#dbml) –, und das Ziel `DBML` des Codegenerators schreibt einen Block `TableGroup` für jede Gruppe, die eine Tabelle enthält – siehe [Codegenerator](./code-generator.md#language).
- Eine JSON-Datei behält ihre Gruppen. Kein anderes Format überträgt sie: SQL-, GraphQL- und AML-Importe bringen keine mit, und Schema SQL und die anderen Ziele des Codegenerators schreiben keine.
- [Importieren und hinzufügen](./file-import-export.md#import-and-add) übernimmt die Gruppen einer Datei als neue Gruppen mit ihren Tabellen und wählt sie zusammen mit den neuen Tabellen aus, solange Gruppen eingeblendet sind, sodass beim Ziehen des hinzugefügten Blocks seine Gruppen mitgenommen werden.
- Ein [exportiertes Bild](./file-import-export.md#image) zeichnet die eingeblendeten Gruppen hinter die Tabellen, mit den Gruppenfarben auf deren Tabellenköpfen.
- Kopieren und Einfügen oder Duplizieren mit `Alt` kopiert nie eine Gruppe – siehe [Tabellen und Notizen kopieren/einfügen](./table-related-functions.md#copyingpasting-tables-and-memos) und [Tabellen hinzufügen und entfernen](#adding-and-removing-tables).

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit [`readonly`](../../api/erd-editor-element.md#readonly) werden Gruppen wie gewohnt gezeichnet und im Explorer aufgeführt und können ausgewählt und angesprungen, aber nicht geändert werden:

- Ein Druck auf eine Titelleiste wählt die Gruppe aus und verschiebt nichts. Es gibt keine Ziehpunkte zum Ändern der Größe und kein `x`.
- Ein Doppelklick auf die Titelleiste öffnet kein Namensfeld, und das Gruppenmenü enthält nur `Select tables`.
- Das Kontextmenü der Zeichenfläche enthält keinen Eintrag `New Table Group`, das Tabellenmenü weder `Group selected tables` noch `Remove from group`, und die Schnellsuche führt keinen der beiden Gruppenbefehle auf. Ein Zeichnen mit `New Table Group` endet, wenn der Editor schreibgeschützt wird.
- Die [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar) zeigt keine ihrer Schaltflächen zum Hinzufügen, `New Table Group` eingeschlossen, und `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac) sowie `T` und dann `G` bewirken nichts.
- Die Ansichtsoption `Table Groups` ändert nichts, wie bei allen Ansichtsoptionen.
- Die Auswahl `Tables` auf der Registerkarte Schema SQL funktioniert weiterhin.
