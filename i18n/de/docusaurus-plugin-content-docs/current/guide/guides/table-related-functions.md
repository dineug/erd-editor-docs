---
sidebar_position: 5
description: Tabellen und Notizen auswählen, verschieben, kopieren, duplizieren und löschen, Farben und Ansichtsoptionen festlegen, Indizes und Alternativschlüssel definieren, eine Datenbank wählen, sich auf der unendlichen Zeichenfläche bewegen und Dokumente vergleichen.
---

# Tabellenfunktionen

Alles, was Sie mit Tabellen und Notizen tun, sobald sie existieren – Auswählen, Verschieben, Kopieren, Löschen, Einfärben und Festlegen, was die Zeichenfläche anzeigt –, dazu die Bedienelemente der Zeichenfläche um sie herum.  
Zuerst kommen die Befehle für Tabellen und Notizen; dann die Tabelleneigenschaften, das Fokussieren auf Tabellen, Indizes und Alternativschlüssel, das Automatische Layout und das Datenbanksystem; und zuletzt die Zeichenfläche selbst: die Symbolleiste der Zeichenfläche, der Zoom, das Verschieben der Ansicht und wohin ein Sprung führt sowie die Diff-Ansicht; und zuletzt, was ein schreibgeschützter Editor von alldem behält.  
Tabellengruppen, die Rahmen, die Tabellen zusammenfassen, haben eine eigene Seite – siehe [Tabellengruppen](./table-groups.md).  
Ebenso haben logische Namen und die Namensansicht, die festlegt, welche Namen die Tabellen zeigen, eine eigene Seite – siehe [Logische Namen](./logical-names.md).

## Mehrfachauswahl {#multiple-selection}

Es gibt drei Möglichkeiten:

- `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac)
- `Ctrl + A` oder `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` oder `⌘ + ⌥ + A` (Mac)

Notizen werden auf die gleiche Weise ausgewählt, und beide Tastenkombinationen zum Auswählen aller Elemente erfassen jeweils alle Tabellen und Notizen auf einmal. Notizen, die mit View Option → `Memos` ausgeblendet sind, werden weder beim Auswählen aller Elemente noch von einem Auswahlrahmen erfasst – siehe [Ansichtsoptionen für Tabellen](#table-view-options).  
[Tabellengruppen](./table-groups.md#selecting-groups) werden mit `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac) auf ihre Titelleiste zur Auswahl hinzugefügt, beim Auswählen aller Elemente wird jedoch nie eine Gruppe erfasst.  
`Ctrl + A` lässt einem Textcursor den Vortritt und wählt daher, während Sie eine Zelle bearbeiten, den Text statt des Diagramms aus.  
Ein Auswahlrahmen markiert eine Tabelle oder Notiz, wenn er deren Mitte abdeckt, nicht schon, wenn er nur einen Rand berührt. Eine Tabellengruppe erfasst er nur, wenn er den ganzen Rahmen der Gruppe umschließt, sodass ein innerhalb einer Gruppe aufgezogener Auswahlrahmen Tabellen ohne die Gruppe auswählt.  
Ein Rechtsklick auf etwas bereits Ausgewähltes behält die gesamte Auswahl bei, sodass Menüeinträge wie `Color`, `Group selected tables` und `Delete selected` auf alle ausgewählten Elemente wirken. Ein Rechtsklick auf eine andere Tabelle, Notiz oder Tabellengruppe wählt nur diese aus, auch bei gedrückter Taste `Ctrl` oder `⌘`, und ein Rechtsklick auf eine Beziehung oder auf eine leere Stelle der Zeichenfläche hebt die Auswahl auf.  
`Escape` hebt die Auswahl auf. Solange der Editor einer Zelle, einer Notiz oder eines Tabellengruppennamens geöffnet ist oder gerade eine Beziehung oder mit `New Table Group` eine Gruppe gezeichnet wird, beendet das erste `Escape` diesen Vorgang, und ein zweites hebt die Auswahl auf.  
Ein schreibgeschützter Editor hat keine dieser Möglichkeiten zum Auswählen: Dort wählt nur ein Sprung aus – siehe [Schreibgeschützte Editoren](#read-only-editors).

![Tabellen mit ⌘ + drag und ⌘ + click auswählen, dann alle Tabellen und Notizen mit ⌘ + A](/img/demo-table-select.webp)

In einer gemeinsamen Sitzung werden die Auswahl, die fokussierte Zelle und der Auswahlrahmen jedes Teilnehmers in dessen Farbe auf der Zeichenfläche dargestellt – siehe [Gemeinsame Bearbeitung](../../api/advanced/collaborative-editing.md).  
Betrachtet ein Teilnehmer eine andere Namensansicht, wird seine fokussierte Zelle auf der Zelle gezeichnet, die Ihre Ansicht an ihrer Stelle zeigt, etwa seine Namenszelle auf Ihrer Zelle des logischen Namens – siehe [Mitbearbeiter](./logical-names.md#collaborators).

## Mehrere Tabellen verschieben {#moving-multiple-tables}

Ziehen Sie eine Tabelle oder Notiz, die bereits zur Auswahl gehört, und die gesamte Auswahl bewegt sich mit – ohne Zusatztaste.  
Eine Tabelle wird an ihrem Tabellenkopf oder an einer beliebigen ihrer Spaltenzeilen gezogen, sodass ein Ziehen, das auf einer Spaltenzeile beginnt, die Tabelle verschiebt, nicht die Spalte. Spalten werden stattdessen mit dem Ziehgriff neben der fokussierten Zeile verschoben – siehe [Spalten neu anordnen und verschieben](./table-editing.md#rearranging-and-moving-columns).  
Auf einer Zelle des Tabellenkopfs oder einer Spaltenzeile beginnt sich die Tabelle erst zu bewegen, wenn der Zeiger ein kurzes Stück zurückgelegt hat, sodass ein Klick dort weiterhin die Zelle fokussiert und ein Doppelklick weiterhin ihren Editor öffnet. Ein Ziehen beginnt nie am Farbrand einer Tabelle, der die Farbauswahl öffnet, an den Schaltflächen `+` und `x` in ihrem Tabellenkopf oder am `x` einer Spaltenzeile.  
Wenn Sie etwas außerhalb der Auswahl ziehen, wird die Auswahl auf dieses Element reduziert und nur dieses verschoben. `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac) behält die Auswahl in beiden Fällen bei.  
Nur die linke Maustaste verschiebt Tabellen und Notizen. Ein Rechtsklick legt fest, worauf das Kontextmenü wirkt, und verschiebt nichts, und Ziehen mit der mittleren Maustaste verschiebt stattdessen die Ansicht der Zeichenfläche – siehe [Auf der Zeichenfläche navigieren](#getting-around-the-canvas).

![Durch Ziehen einer von zwei ausgewählten Tabellen werden beide verschoben, und die Beziehung folgt](/img/demo-table-multiple-move.webp)

Eine ausgewählte [Tabellengruppe](./table-groups.md) bewegt sich ebenfalls und nimmt ihre Tabellen mit, und eine Tabelle, die sowohl ausgewählt ist als auch in einer bewegten Gruppe liegt, wird nur einmal verschoben.  
Je nachdem, wo Sie eine Tabelle ablegen, kann sie dadurch in eine Gruppe aufgenommen oder aus ihr entfernt werden – siehe [Tabellen hinzufügen und entfernen](./table-groups.md#adding-and-removing-tables).

Tabellen und Notizen teilen sich eine Stapelreihenfolge. Wenn Sie mit der linken oder der rechten Maustaste auf eine Tabelle oder Notiz drücken, wird sie vor alle anderen Tabellen und Notizen geholt, und das Drücken auf die Titelleiste einer Tabellengruppe oder ein Rechtsklick auf ihre Innenfläche holt ihre Tabellen in den Vordergrund.  
Die Reihenfolge wird nicht gespeichert: Ein erneut geöffnetes Diagramm stapelt seine Tabellen in der Reihenfolge, in der die Datei sie auflistet, mit allen Notizen darüber.

## Tabellen und Notizen kopieren/einfügen {#copyingpasting-tables-and-memos}

Kopiert die ausgewählten Tabellen und Notizen und fügt sie als neue wieder ein.  
Tastenkombinationen: `Ctrl + C` (Windows/Linux) oder `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) oder `⌘ + V` (Mac)

Eine kopierte Tabelle behält ihren Namen, logischen Namen, Kommentar, ihre Spalten und Farbe; eine kopierte Notiz behält ihren Text, ihre Größe und Farbe.  
Jede kopierte Spalte behält ihren logischen Namen, und jeder Tabellen- und Spaltenname behält bei, ob er aus den Wörterbüchern abgeleitet wurde – siehe [Physische Namen ableiten](./dictionary.md#deriving-physical-names).  
Eine eingefügte Spalte behält ihre Domänenverknüpfung nur, wenn zwei Bedingungen erfüllt sind: Das Diagramm, in dem sie landet, führt genau diese Domäne, nicht nur eine gleichnamige, und die Domäne hat noch den Datentyp, mit dem die Spalte kopiert wurde. Andernfalls landet die Spalte ohne Domäne und behält den Typ, mit dem sie kopiert wurde – siehe [Spalte verknüpfen](./dictionary.md#linking-a-column).  
Indizes und Beziehungen werden ebenfalls übernommen: Ein Index wird vollständig auf die kopierte Tabelle kopiert, und eine Beziehung wird mit ihrem Typ und ihren Aktionen für ON DELETE und ON UPDATE kopiert, wenn beide Tabellen, die sie verbindet, zu den kopierten gehören. Eine halbe Beziehung wird verworfen, statt weiter auf das Original zu verweisen.  
Die eingefügten Kopien werden zur neuen Auswahl, und wenn Sie dieselbe Kopie erneut einfügen, wird sie jedes Mal um weitere `50px` versetzt, sodass sich wiederholte Einfügungen nicht übereinanderstapeln.  
Eine Kopie behält ihre [Tabellengruppe](./table-groups.md) nicht: Die eingefügte Tabelle gehört zu keiner Gruppe, auch wenn sie innerhalb des Rahmens einer Gruppe landet, und eine ausgewählte Gruppe wird nicht kopiert.  
Solange View Option → `Memos` die Notizen ausblendet, werden beim Einfügen die enthaltenen Notizen trotzdem hinzugefügt, ausgeblendet und nicht ausgewählt, sodass nur die eingefügten Tabellen zur Auswahl werden.

![Zwei verbundene Tabellen kopieren und zweimal einfügen, samt Beziehung](/img/demo-table-copy-paste.webp)

Wenn innerhalb einer fokussierten Tabelle Spalten ausgewählt sind, kopiert dieselbe Tastenkombination stattdessen diese Spalten – siehe [Tabellen bearbeiten](./table-editing.md).

## Tabellen und Notizen duplizieren {#duplicating-tables-and-memos}

Halten Sie `Alt` gedrückt, und ziehen Sie eine Tabelle oder Notiz mit der linken Maustaste.  
Eine Tabelle wird an ihrem Tabellenkopf oder an einer beliebigen Spaltenzeile gegriffen, sodass `Alt + drag` auf einer Spaltenzeile die Tabelle dupliziert und die Spaltenreihenfolge unverändert lässt. Wird `Alt` am Ziehgriff der Spalte gehalten, wird nichts dupliziert: Die Spalte bewegt sich so, wie ein einfaches Ziehen am Griff sie bewegt – siehe [Spalten neu anordnen und verschieben](./table-editing.md#rearranging-and-moving-columns).  
Eine durchscheinende Vorschau folgt dem Zeiger, und beim Loslassen der Taste wird die Kopie dort abgelegt, wo die Vorschau steht.  
Wenn das, was Sie greifen, bereits zu einer Auswahl gehört, wird die gesamte Auswahl dupliziert. Andernfalls wird die Auswahl durch die Entität unter dem Zeiger ersetzt.  
`Alt + click` ohne Bewegung legt die Kopie `50px` nach rechts unten versetzt ab und rückt weiter, wann immer diese Stelle schon belegt ist.

Ein Duplikat enthält dasselbe wie eine [eingefügte Kopie](#copyingpasting-tables-and-memos): Namen und logische Namen, Kommentare, Spalten, Farben, Notizgrößen sowie die Indizes und Beziehungen, die vollständig zu dem gehören, was Sie kopiert haben. Da es im selben Diagramm bleibt, behält es die Domänenverknüpfung jeder Spalte unverändert bei. Wie eine eingefügte Kopie landet es in keiner Tabellengruppe.  
`Alt + drag` auf der Titelleiste einer Tabellengruppe verschiebt die Gruppe wie normales Ziehen; eine Gruppe wird nie dupliziert.

![Eine Tabelle mit Alt + drag duplizieren, dann mit Alt + click eine weitere Kopie nach rechts unten](/img/demo-table-duplicate.webp)

## Tabellen und Notizen löschen {#table-and-memo-deletion}

Löscht die ausgewählten Tabellen, Notizen und [Tabellengruppen](./table-groups.md).  
Tastenkombinationen:

- `Delete` oder `Backspace`. Diese entfernen die gesamte Auswahl, außer wenn nur eine einzige Tabelle ausgewählt ist, in der einige Spalten ausgewählt sind, und der Zoom über `70%` liegt: Dann entfernen sie stattdessen diese Spalten – siehe [Spalten löschen](./table-editing.md#column-deletion).
- `Ctrl + Backspace` oder `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` oder `⌘ + Delete` (Mac). Diese entfernen immer die ausgewählten Tabellen, Notizen und Tabellengruppen, auch wenn Spalten ausgewählt sind.

![Eine Tabelle samt ihren Beziehungen mit der Taste Delete löschen, dann eine Tabelle und eine Notiz zusammen mit Delete selected aus dem Menü der Notiz](/img/demo-table-remove.webp)

Auch die Kontextmenüs löschen. Der letzte Eintrag im Menü einer Tabelle oder Notiz lautet `Delete selected`, solange diese Tabelle oder Notiz eines von zwei oder mehr ausgewählten Elementen ist, und entfernt die gesamte Auswahl. Andernfalls lautet er `Delete` und entfernt nur diese Tabelle oder Notiz. Über der Zeile einer ausgewählten Spalte lautet der Eintrag im Tabellenmenü stattdessen `Delete column` oder `Delete columns`, wie unter [Spalten löschen](./table-editing.md#column-deletion).

Beim Entfernen einer Tabelle werden ihre Beziehungen und Indizes mit entfernt. Beim Entfernen einer Tabellengruppe bleiben ihre Tabellen erhalten, ohne Gruppe – siehe [Gruppe entfernen](./table-groups.md#removing-a-group).  
Es gibt keine Rückfrage, jedes Entfernen ist ein Rückgängig-Schritt, und in einem Editor mit `readonly` wird nichts entfernt.  
Gedrückt gehalten entfernen `Delete` und `Backspace` nur einmal, und sie entfernen nie eine Beziehung – siehe [Beziehungen bearbeiten](./relationship-editing.md#deletion). Während Sie in einer Zelle, einer Notiz oder einem anderen Textfeld tippen, bearbeiten sie stattdessen den Text.  
In den Einstellungen sind die beiden Tasten als `Delete Selection` aufgeführt – siehe [Tastenkombinationen](./settings.md#shortcuts).

## Farben für Tabellen und Notizen festlegen {#table-and-memo-color-specification}

Sie können Farben zuweisen, um nach Kategorien zu unterscheiden.  
Eine Tabelle trägt ihre Farbe an ihrem linken Rand, eine Notiz in einem Streifen an ihrer Oberkante. Klicken Sie mit der linken Maustaste auf diesen Rand oder Streifen, oder wählen Sie `Color` im Kontextmenü der Tabelle oder Notiz, um die Farbauswahl am Zeiger zu öffnen. Die Farbe wird auf alle ausgewählten Tabellen, Notizen und Tabellengruppen angewendet, nicht nur auf das angeklickte Element.  
Eine Tabellengruppe wird über `Color` in ihrem eigenen Menü eingefärbt, und eine Tabelle in einer eingefärbten Gruppe trägt die Farbe der Gruppe über ihren Tabellenkopf hinweg, behält aber ihre eigene Farbe an ihrem linken Rand – siehe [Gruppe einfärben](./table-groups.md#coloring-a-group).

![Über den Farbstreifen einer Notiz das vordefinierte Farbfeld Blue für zwei ausgewählte Tabellen und die Notiz wählen, dann die Farbe mit No color entfernen](/img/demo-table-color.webp)

Die Farbauswahl enthält von oben nach unten:

- Eine Fläche für Sättigung und Helligkeit, dann den Schieberegler für den Farbton mit einer Vorschau der Farbe daneben. Wo der Browser eine Pipette anbietet, nimmt eine Schaltfläche mit Pipette vor dem Schieberegler, `Pick a color from the screen`, eine Farbe von einer beliebigen Stelle des Bildschirms auf.
- Die Felder `Hex`, `R`, `G` und `B`. `Hex` akzeptiert 3, 4, 6 oder 8 Hexadezimalziffern mit oder ohne `#` oder einen eingefügten Ausdruck `rgb()` oder `hsl()` oder einen CSS-Farbnamen. Ein vollständiger 6- oder 8-stelliger Wert wird schon während der Eingabe angewendet, alles andere bei `Enter` oder wenn Sie das Feld verlassen. `R`, `G` und `B` akzeptieren ganze Zahlen, lesen alles über `255` als `255` und werden bei `Enter` oder beim Verlassen des Feldes angewendet. Text, den die Farbauswahl nicht lesen kann, wird verworfen.
- Sechzehn vordefinierte Farbfelder in zwei Reihen zu je acht: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown und Gray. Wenn Sie mit dem Zeiger auf ein Farbfeld zeigen, wird sein Hex-Code angezeigt.
- `Document colors`: bis zu acht Farben, die die Tabellen, Notizen und Tabellengruppen des Dokuments bereits verwenden, die häufigste zuerst. Die Reihe wird nur angezeigt, wenn es solche Farben gibt.
- `No color`.

Eine Farbe ist immer deckend: Die Farbauswahl hat keine Einstellung für Transparenz und verwirft jede Transparenz, die ein eingegebener oder eingefügter Wert enthält.  
Das Öffnen der Farbauswahl ändert nichts, und das Wählen der Farbe, die die Auswahl bereits hat, fügt keinen Rückgängig-Schritt hinzu.

`No color` entfernt die Farbe aller ausgewählten Tabellen, Notizen und Tabellengruppen in einem Rückgängig-Schritt und schließt die Farbauswahl. Der Eintrag `Remove color`, der in den Kontextmenüs von Tabellen, Notizen und Tabellengruppen direkt unter `Color` steht, solange ein ausgewähltes Element eine Farbe hat, bewirkt dasselbe, ohne die Farbauswahl zu öffnen.

Die Farbauswahl übernimmt beim Öffnen den Tastaturfokus, und `Tab` und `Shift + Tab` gehen reihum durch ihre Steuerelemente. Die Pfeiltasten bewegen die Fläche und den Schieberegler für den Farbton um 1, mit `Shift` um 10, und wechseln von Farbfeld zu Farbfeld, wobei sie jedes sofort anwenden.  
Solange die Farbauswahl den Tastaturfokus hat, erreichen Rückgängig und Wiederholen, die Tastenkombinationen für den Zoom, `Search` und `Toggle Explorer` weiterhin den Editor, die übrigen Tastenkombinationen des Editors jedoch nicht: Die Tastenkombinationen zum [Löschen](#table-and-memo-deletion) entfernen nichts, und `Delete` und `Backspace` bearbeiten nur den Text der Felder `Hex`, `R`, `G` und `B`.  
`Escape` schließt die Farbauswahl, ebenso das Drücken der Maustaste auf der Zeichenfläche außerhalb davon.  
Das Drücken der Maustaste im [Explorer](./explorer.md) gilt nicht als Drücken auf der Zeichenfläche und lässt die Farbauswahl daher geöffnet. Eine dort gewählte Zeile ändert die Auswahl, und die nächste Farbwahl färbt die neue Auswahl ein.

## Ansichtsoptionen für Tabellen {#table-view-options}

Bietet die folgenden Ansichtsoptionen:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Domain`, `Unique`, `Alternate Key` und `Auto Increment` sind standardmäßig ausgeschaltet, alle übrigen eingeschaltet.  
Welche Namen die Tabellen zeigen, ist keine Ansichtsoption: `Name View`, direkt nach `View Option` im Kontextmenü der Zeichenfläche, wählt physische Namen, logische Namen oder beide – siehe [Ansicht wechseln](./logical-names.md#switching-the-view).  
`Domain` gibt jeder Spalte eine Zelle mit dem Namen der Domäne, mit der die Spalte verknüpft ist, an dem Platz, den die [Spaltenreihenfolge](./settings.md#adjusting-column-order) bestimmt. Eine Spalte, die mit keiner Domäne verknüpft ist, die das Blatt `Domains` führt, zeigt dort abgeblendet den Platzhalter `domain`. Die Zelle erscheint in jeder Namensansicht. Solange `Domain` ausgeschaltet ist, zeigt die Ansicht `Logical Names` den Namen einer verknüpften Domäne stattdessen in der Typzelle – siehe [Die Domänenzelle](./logical-names.md#the-domain-cell).  
`Alternate Key` markiert die Spalten jedes Alternativschlüssels, etwa mit `AK1.1` – siehe [Alternativschlüssel](#alternate-keys).  
`Referential Actions` zeigt die Beschriftungen `D:` und `U:`, die die Aktionen für ON DELETE und ON UPDATE einer Beziehung am Ende ihrer Verbindungslinie an der Kindtabelle anbringen – siehe [Verbindungslinien lesen](./relationship-editing.md#reading-a-connector). Das Ausschalten blendet nur diese Beschriftungen aus und verschiebt weder Tabellen noch Verbindungslinien.  
`Table Groups` zeigt die [Tabellengruppen](./table-groups.md) und die Gruppenfarben auf den Tabellenköpfen ihrer Tabellen. Das Ausschalten blendet sie auf der Zeichenfläche, in der Minimap und in Bildexporten aus, verschiebt keine Tabelle und belässt jede Tabelle in ihrer Gruppe – siehe [Gruppen ausblenden](./table-groups.md#hiding-groups). Außerdem entfernt es den Ordner `Table Groups` aus dem [Explorer](./explorer.md#the-tree) und die Schaltfläche `New Table Group` aus der [Symbolleiste der Zeichenfläche](#canvas-toolbar), und die Suche des Explorers findet keine Gruppennamen mehr.  
`Memos` zeigt die Notizen. Das Ausschalten blendet alle Notizen auf der Zeichenfläche, in der Minimap und in Bildexporten aus und verschiebt weder Tabellen noch Verbindungslinien. Ausgeblendete Notizen nehmen keinen Platz ein, daher lassen die Scrollleisten, die Minimap und der Kompass `Go to content` sie außer Acht.  
Das Ausblenden der Notizen hebt ihre Auswahl auf und schließt einen geöffneten Notizeditor. Der [Explorer](./explorer.md#the-tree) lässt seinen Ordner `Memos` weg, und weder seine Suche mit [Suchen und Ersetzen](./find-and-replace.md) noch das Präfix `:` der Schnellsuche durchsuchen sie. Solange sie ausgeblendet sind, verschwindet `New Memo` aus dem Kontextmenü, der [Symbolleiste der Zeichenfläche](#canvas-toolbar), der Schnellsuche und dem [Willkommensbildschirm](./editing-start.md#welcome-screen), und `Alt + M` fügt keine Notiz hinzu. Einfügen oder [Importieren und hinzufügen](./file-import-export.md#import-and-add) fügt die enthaltenen Notizen dennoch hinzu, ausgeblendet und nicht ausgewählt.  
In einem schreibgeschützten Editor funktionieren die Schalter weiterhin, aber nur auf diesem Bildschirm: Sie werden nicht gespeichert, nicht im Verlauf aufgezeichnet und nicht geteilt, und sie kehren zu denen der Datei zurück, wenn der Editor wieder beschreibbar wird – siehe [Schreibgeschützte Editoren](./settings.md#read-only-editors) unter Einstellungen.

![Einträge der Ansichtsoptionen ein- und ausschalten, während sich die Tabellen neu anordnen, einen zusammengesetzten eindeutigen Index mit Alternate Key als AK1.1 und AK1.2 markieren, dann Memos aus- und wieder einschalten](/img/demo-view-options.webp)

Karten im Modus `Flow` der Registerkarte Visualisierung folgen diesen Optionen nicht, auch `Domain` nicht: Die Karten verwenden ihre eigene [Zeilenanzeige](./visualization.md#row-display) und zeichnen ihre Verbindungslinien auch bei ausgeschalteter Option `Relationship`. Welche Zellen eine Karte anordnet, hängt allein von der Namensansicht ab – siehe [Namen auf den Karten](./visualization.md#names-on-the-cards).

## Tabelleneigenschaften {#table-properties}

Öffnet die Tabelleneigenschaften einer Tabelle.  
Wählen Sie `Table Properties` im Kontextmenü der Tabelle, um sie für die Tabelle zu öffnen, auf die Sie mit der rechten Maustaste geklickt haben, oder wählen Sie eine Tabelle aus, und drücken Sie `Alt + Space`.  
Der Bereich öffnet sich in der Mitte der abgedunkelten Zeichenfläche. Nur die Zeichenfläche wird abgedunkelt, sodass ein geöffneter [Explorer](./explorer.md#dialogs-beside-it) daneben geöffnet und bedienbar bleibt. Die Kopfzeile des Bereichs enthält den Titel `Table Properties`, die fünf zuletzt geöffneten Tabellen als Chips, wobei die aktuelle hervorgehoben ist, und eine Schaltfläche zum Schließen. Jeder Chip benennt seine Tabelle so, wie es die [Namensansicht](./logical-names.md#beyond-the-canvas) tut. Klicken Sie auf einen Chip, um zu dieser Tabelle zu wechseln, ohne den Bereich erneut zu öffnen.  
Unter der Kopfzeile liegen drei Registerkarten: `Indexes`, `Schema SQL` und `Code Generator`. Der Bereich behält für alle drei dieselbe Größe, sodass ein Wechsel der Registerkarte ihn weder verschiebt noch seine Größe ändert.  
Schließen Sie ihn mit der Schaltfläche zum Schließen, mit `Escape` oder durch einen Klick außerhalb des Bereichs auf die Zeichenfläche.  
Wenn Sie im Explorer eine Zeile wählen, die kein Ordner ist, oder zu einem Treffer seiner Suche wechseln, werden die Tabelleneigenschaften vor dem Sprung geschlossen. Dasselbe gilt für `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac), das die Suche des Explorers öffnet oder den Textcursor in sein Suchfeld setzt, wenn der Explorer bereits geöffnet ist. Jeder andere Klick im Explorer, auch auf eine Ordnerzeile, oder auf die Schaltfläche `Explorer` der Symbolleiste lässt die Tabelleneigenschaften geöffnet. Ein `Escape`, das gedrückt wird, während der Tastaturfokus im Explorer liegt, gibt nur den Tastaturfokus an die Zeichenfläche zurück, sodass es ein zweites `Escape` braucht, um die Tabelleneigenschaften zu schließen.

Die Registerkarte `Indexes` wird in [Indizes](#indexes) beschrieben.  
Die Registerkarte `Schema SQL` zeigt die DDL der Tabelle für die ausgewählte [Datenbank](#databases): ihr `CREATE TABLE`, die separaten Constraints, die manche Datenbanken für ihre als Eindeutig markierten Spalten schreiben, und ihre Indizes. Sie schreibt immer einfache Anweisungen mit `CREATE`, ohne Vorspann, ohne Skript vor oder nach den Tabellen und ohne logische Namen in leeren Kommentaren, unabhängig davon, wie die Registerkarte [Schema SQL](./schema-sql.md) der Symbolleiste eingestellt ist – siehe [Logische Namen als Kommentare](./schema-sql.md#logical-names-as-comments). Sie hat keinen Optionsbereich, und ihr Kontextmenü bietet nur `Database` und `Bracket`.  
Die Registerkarte `Code Generator` generiert Code nur für diese Tabelle – siehe [Codegenerator](./code-generator.md).

In einem schreibgeschützten Editor öffnet sich der Bereich weiterhin, über `Table Properties`, den einzigen Eintrag im Kontextmenü einer Tabelle dort, oder mit `Alt + Space` auf der Tabelle, die ein Sprung ausgewählt hat. Er zeigt ein Badge `Read only` neben seinem Titel, und seine Registerkarte `Indexes` bietet keine Bearbeitung an.  
Ein Bereich, der geöffnet ist, wenn der Editor schreibgeschützt wird, bleibt geöffnet und wird mit ihm schreibgeschützt – siehe [Schreibgeschützte Editoren](#read-only-editors).

## Auf Tabellen fokussieren {#focusing-on-tables}

Öffnet die Registerkarte Visualisierung im Modus `Flow`, eingeschränkt auf die gewählten Tabellen und alle Tabellen, die direkt über eine Beziehung mit ihnen verbunden sind.  
Wählen Sie im Kontextmenü der Tabelle `Focus on this table`, oder wählen Sie eine oder mehrere Tabellen aus, und drücken Sie `Alt + F`.  
Wenn die Tabelle, auf die Sie mit der rechten Maustaste klicken, eine von mehreren ausgewählten Tabellen ist, lautet der Eintrag `Focus on selected tables` und fokussiert auf die gesamte Auswahl. Ein Rechtsklick auf eine Tabelle außerhalb der Auswahl fokussiert nur auf diese Tabelle.  
Die Tastenkombination verwendet die ausgewählten Tabellen, lässt Notizen außen vor und bewirkt nichts, wenn keine Tabelle ausgewählt ist. Das Tabellenmenü eines schreibgeschützten Editors hat kein `Focus on this table`, und die Tastenkombination verwendet dort die Tabelle, die ein Sprung ausgewählt hat – siehe [Schreibgeschützte Editoren](#read-only-editors).  
Eine ausgewählte [Tabellengruppe](./table-groups.md) zählt hier nicht, weder bei der Tastenkombination noch beim Menüeintrag: Ihre Tabellen werden nur übernommen, wenn sie selbst ausgewählt sind, was `Select tables` im Gruppenmenü erledigt.  
Was die eingeschränkte Ansicht zeigt und wie Sie zum ganzen Diagramm zurückkehren, wird in [Visualisierung](./visualization.md#focusing-on-tables) beschrieben, und wie Sie durch das, was Flow zuvor gezeigt hat, einen Schritt zurück- und vorgehen, in [Vorherige und nächste Tabelle](./visualization.md#previous-table-and-next-table).

## Indizes {#indexes}

Indizes werden auf der Registerkarte `Indexes` der Tabelleneigenschaften definiert und sind im exportierten Schema SQL enthalten.

Die linke Seite listet die Schlüssel und Indizes der Tabelle in zwei Gruppen auf.  
Die Gruppe `Keys`, die angezeigt wird, wenn die Tabelle Schlüssel hat, listet die Schlüssel auf, die ihre Spalten deklarieren: `PK_<table name>` über die als PK markierten Spalten, dann `UQ_<table name>_<column name>` für jede als Eindeutig markierte Spalte, in Spaltenreihenfolge. Die Namen sind die physischen, die das Schema SQL der ausgewählten Datenbank schreibt, gleich welche Namensansicht gilt, sodass, wenn `Bracket` auf `None` steht, für eine schemaqualifizierte Tabelle wie `sales.users` bei jeder Datenbank außer Databricks und Snowflake `PK_users` aufgeführt wird – siehe [Schemaqualifizierte Tabellennamen](./schema-sql.md#schema-qualified-table-names). Jeder Schlüssel ist mit `PK` oder `UQ` gekennzeichnet und mit einem Schloss markiert. Die Schlüssel sind hier schreibgeschützt und ändern sich nur mit den Kennzeichen [PK](./table-editing.md#column-primary-key) und [Eindeutig](./table-editing.md#not-null-unique-auto-increment) der Spalten.  
Die Gruppe `Indexes` listet die Indizes der Tabelle in der Reihenfolge auf, in der sie hinzugefügt wurden. Jeder Index hat einen Schalter `UQ`, der ihn eindeutig macht, ein Namensfeld und ein `x`, das ihn entfernt. Ein Index, der ein [Alternativschlüssel](#alternate-keys) ist, zeigt zusätzlich seine Nummer, etwa `AK1`. Fügen Sie mit `Add Index` am Ende der Liste einen Index hinzu.

Die rechte Seite listet unter `Columns` die Spalten der Tabelle auf, jede mit einem Kontrollkästchen. Jede Zeile zeigt dieselben Zellen wie die Zeile der Spalte auf der Zeichenfläche und folgt dabei der Spaltenreihenfolge, den Ansichtsoptionen und der [Namensansicht](./logical-names.md#beyond-the-canvas). Nichts ist bearbeitbar, bis links ein Index ausgewählt ist.  
Setzen Sie bei einer Spalte den Haken, um sie dem ausgewählten Index hinzuzufügen, und entfernen Sie den Haken, um sie aus ihm zu entfernen. Wenn Sie einen Schlüssel auswählen, werden seine Spalten mit Haken angezeigt, die Kontrollkästchen bleiben aber deaktiviert.  
Die Spalten des ausgewählten Index sind darunter unter `Index order` aufgeführt, jede so benannt, wie die Namensansicht sie benennt, in der Ansicht `Both Names` mit dem Namen in Klammern nach dem logischen Namen, etwa `Member Number (member_no)`. Ziehen Sie sie am Griff, um sie neu anzuordnen, und klicken Sie auf den Chip `ASC` oder `DESC` einer Zeile, um ihre Sortierrichtung umzukehren. In einem Alternativschlüssel endet jede Zeile mit ihrer Markierung `AK<n>.<m>`. Die Liste zeigt drei Zeilen auf einmal, die übrigen erreichen Sie durch Scrollen.

In einem schreibgeschützten Editor zeigt die Auswahl eines Schlüssels oder Index weiterhin seine Spalten, aber es gibt kein `Add Index` und kein `x`, und auch sonst lässt sich auf der Registerkarte nichts ändern: Die Namen nehmen keine Eingabe an, jedes Kontrollkästchen ist deaktiviert, und die Zeilen unter `Index order` lassen sich weder ziehen noch in ihrer Sortierreihenfolge umschalten.

Der [Explorer](./explorer.md#the-tree) listet die Indizes jeder Tabelle in deren Ordner `Indexes` auf, und wenn Sie dort einen wählen, wechseln Sie zu seiner Tabelle. Seine Suche findet auch Indexnamen und kann sie umbenennen – siehe [Was durchsucht wird](./find-and-replace.md#what-it-searches).

![Die Tabelleneigenschaften von orders öffnen, wo die Registerkarte Indizes die Schlüssel PK und UQ über den Indizes auflistet, dann einen Index über member_id und ordered_at DESC hinzufügen und ihn auf der Registerkarte Schema SQL nachlesen](/img/demo-table-properties.webp)

## Alternativschlüssel {#alternate-keys}

Ein Alternativschlüssel ist ein eindeutiger Index über zwei oder mehr Spalten: ein Index auf der Registerkarte `Indexes` mit eingeschaltetem Schalter `UQ` und mindestens zwei angehakten Spalten der Tabelle.  
Ein eindeutiger Index über eine einzige Spalte sagt nicht mehr aus als das Kennzeichen Eindeutig dieser Spalte und ist daher kein Alternativschlüssel, ebenso wenig wie ein einfacher Index, der Primärschlüssel oder eine als Eindeutig markierte Spalte.

Wenn `Alternate Key` in den [Ansichtsoptionen](#table-view-options) eingeschaltet ist, markiert das Diagramm die Spalten jedes Alternativschlüssels so, wie erwin und IDEF1X sie schreiben: `AK1.1`, `AK1.2` und so weiter. Die Option ist standardmäßig ausgeschaltet.

Die Schlüssel werden danach nummeriert, wo ihre Spalten in der Tabelle stehen, nicht nach der Reihenfolge, in der die Indizes hinzugefügt wurden. Der Schlüssel, dessen erste Spalte in seiner Liste `Index order` am weitesten oben in der Tabelle steht, ist `AK1`. Bei Gleichstand entscheidet die nächste Spalte jedes Schlüssels, und ein Schlüssel, der der vordere Teil eines längeren ist, kommt vor diesem.  
Das Verschieben einer Spalte innerhalb der Tabelle oder das Umsortieren der Liste `Index order` eines Schlüssels kann die Schlüssel neu nummerieren. Wenn Sie das Entfernen eines Schlüssels rückgängig machen, erhält er seine Nummer zurück, und alle Mitbearbeiter sehen dieselben Nummern.

Jede Spalte eines Schlüssels wird mit `AK<n>.<m>` markiert, wobei `n` die Nummer des Schlüssels ist und `m` die Position der Spalte in der Liste `Index order` des Schlüssels. Eine Spalte in mehreren Schlüsseln trägt alle Markierungen, durch ein Komma verbunden.  
Zum Beispiel werden in einer Tabelle mit den Spalten `a`, `b` und `c` eindeutige Indizes über (`c`, `a`) und (`b`, `a`) zu `AK1` = (`b`, `a`) und `AK2` = (`c`, `a`), weil `b` über `c` steht. Also zeigt `b` die Markierung `AK1.1`, `c` die Markierung `AK2.1` und `a` die Markierung `AK1.2,AK2.2`.

Die Markierung wird als Letztes in der Zeile gezeichnet, hinter der Zelle, die die [Spaltenreihenfolge](./settings.md#adjusting-column-order) an die letzte Stelle setzt. Sie ist keine Zelle und wird daher nie fokussiert, bearbeitet oder kopiert – siehe [Tabellen bearbeiten](./table-editing.md).  
Auch eine Primärschlüssel- oder Fremdschlüsselspalte kann eine AK-Markierung tragen, da die Markierung nichts ersetzt: Das Schlüsselsymbol am Anfang der Zeile zeigt weiterhin PK und FK, und die Zelle für Eindeutig behält ihr eigenes `UQ`.  
Eine Tabelle mit einem Alternativschlüssel hält hinter der letzten Zelle jeder Zeile Platz für ihre längste Markierung frei; eine Tabelle ohne Alternativschlüssel behält ihre Breite.  
Die Markierungen erscheinen auf der ERD-Zeichenfläche, wo eine bei `70%` und darunter auf ihren Namen eingeklappte Tabelle keine zeigt, und in einem [Bildexport](./file-import-export.md#image), der jede Tabelle unabhängig vom Zoom vollständig zeichnet. Die [Hover-Vorschau](./visualization.md#hover-preview) der Registerkarte Visualisierung im Modus `Graph` zeigt sie ebenfalls; Karten im Modus `Flow` zeigen sie nie.

Die Registerkarte `Indexes` zeigt die Nummern unabhängig davon, ob die Option eingeschaltet ist – siehe [Indizes](#indexes).

## Automatisches Layout {#auto-layout}

Ordnet alle Tabellen auf der Zeichenfläche für Sie an.  
Öffnen Sie `Auto Layout` über das Kontextmenü der Zeichenfläche oder über die Schnellsuche, und wählen Sie eines von vier Layouts:

| Layout | Was es zeichnet |
| --- | --- |
| `Force` | Eine Simulation: Beziehungen ziehen Tabellen zueinander, Nachbarn stoßen sich gegenseitig ab, und überlappende Tabellen lösen sich voneinander. |
| `Flow` | Von links nach rechts entlang der Beziehungen, wobei jede Verbindungslinie ihren eigenen Ansatzpunkt an einer Tabelle erhält. Es versucht, Kreuzungen gering zu halten, kann aber einige übrig lassen, die ein anderes Layout vermeiden würde. |
| `Tree - vertical` | In Ebenen nach unten: Eine Elterntabelle steht über den Tabellen, die einen Fremdschlüssel auf sie haben. |
| `Tree - horizontal` | Dieselbe Anordnung in Ebenen, von links nach rechts. |

`Force` öffnet eine Vorschau, während sich das Layout einpendelt, mit `Apply` und `Cancel` auf dem angezeigten Hinweis.  
Die Vorschau ist auf das Diagramm zugeschnitten, wie es beim Start des Layouts stand, sodass Tabellen beim Einpendeln aus dem Ausschnitt wandern können. Sie wird bei `70%` oder weniger gezeichnet, sodass ihre Tabellen auf ihren Namen und ihren Farbrand eingeklappt erscheinen. Sie öffnet sich in der Namensansicht, die Sie gerade betrachten, gleich welche Ansicht die Datei behält – siehe [Außerhalb der Zeichenfläche](./logical-names.md#beyond-the-canvas).  
`Apply` übernimmt die Positionen so, wie sie in diesem Moment stehen, und das Layout wird von selbst übernommen, sobald es zur Ruhe kommt. `Cancel` oder `Escape` lässt das Diagramm, wie es war.

Die anderen drei werden in einem Durchgang außerhalb des Hauptthreads berechnet, sodass es nichts zu beobachten gibt: Während das Layout berechnet wird, wird ein Hinweis angezeigt, und die fertige Anordnung wird auf die Fläche zentriert, die das Diagramm bereits einnimmt. `Cancel` oder `Escape` verwirft ein Layout, auf das Sie nicht mehr warten, und in einem Host, der keinen Shared Worker ausführt, endet es mit `Could not place tables` – siehe [Web Worker](../../api/installation.md#web-workers). Ein Layout, das nicht innerhalb von 60 Sekunden zurückkommt, endet ebenso.

Welches Layout Sie auch wählen, Tabellen und Tabellengruppen werden verschoben, und Notizen bleiben, wo sie sind. Die Tabellen werden mit den Breiten platziert, die sie in der Namensansicht haben, die Sie gerade betrachten. Eine Beziehung einer Tabelle zu sich selbst wird ignoriert, und mehrere Beziehungen zwischen denselben zwei Tabellen zählen nur einmal.  
Jedes Layout hält die Tabellen jeder Gruppe zusammen, ob die Gruppen angezeigt werden oder nicht, und passt jede Gruppe, die Tabellen enthält, um diese herum an – siehe [Tabellengruppen](./table-groups.md#auto-layout).  
Das Ergebnis landet als ein einziger Eintrag im Verlauf, sodass ein einziges Rückgängigmachen alle Tabellen und Gruppen an ihren vorherigen Platz zurücksetzt.  
Ein schreibgeschützter Editor bietet kein `Auto Layout` an. Eines, das noch läuft, wenn der Editor schreibgeschützt wird, endet dort: Die Vorschau `Force` schließt sich mit ihrem Hinweis und behält keine ihrer Positionen, und ein noch berechnetes Layout wird mit seinem Hinweis verworfen, sodass sich keine Tabelle bewegt, weder dann noch sobald der Editor wieder beschreibbar ist.

![Einen Haufen Tabellen mit dem Automatischen Layout Flow aus dem Kontextmenü der Zeichenfläche aufräumen, das sie von links nach rechts entlang ihrer Beziehungen aufreiht](/img/demo-automatic-table-placement.webp)

## Datenbanken {#databases}

Zu den unterstützten Datenbanken gehören:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Wählen Sie eine über `Database` im Kontextmenü der Zeichenfläche, im Optionsbereich oder Kontextmenü der Registerkarten Schema SQL und Codegenerator oder in der Schnellsuche. Alle ändern dieselbe Einstellung. Das Zeichenflächenmenü eines schreibgeschützten Editors hat kein `Database`, und eine Wahl in den anderen ändert nur diesen Bildschirm – siehe [Schreibgeschützte Editoren](#read-only-editors).

Diese Optionen bestimmen die Syntax von Schema SQL beim Exportieren, die Autovervollständigung für Datentypen und die Typen, zu denen generierter Code und importierte Schemas aufgelöst werden.  
Von ihnen hängt ab, welche Auswahlmöglichkeiten von `Statements` und `Header` die Registerkarte [Schema SQL](./schema-sql.md#options-panel) schreiben kann. Eine Auswahl, die die Datenbank nicht hat, bleibt abgeblendet im Optionsbereich, und das SQL greift auf die nächstliegende vorhandene zurück.  
Außerdem entscheiden sie, welche Aktionen für ON DELETE und ON UPDATE Schema SQL und die ORM-Ziele des Codegenerators schreiben und welche davon die Beziehungsmenüs mit `not in <database>` markieren – siehe [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update) und [Codegenerator](./code-generator.md#database).  
Der Import von Schema SQL behält den Datentyp einer Spalte samt Argumentliste bei, ob der Editor ihn auflistet oder nicht, etwa `TIMESTAMP WITH TIME ZONE`, `public.mood` oder `integer[]` – siehe [Datentypen](./file-import-export.md#data-types). Die Autovervollständigung für Datentypen schlägt nur die Typen vor, die die ausgewählte Datenbank auflistet.

![Die Datenbank auf PostgreSQL umstellen, dann in der Autovervollständigung einen PostgreSQL-Typ wählen](/img/demo-database.webp)

![Unscharfe Autovervollständigung für Datentypen, mit den Pfeiltasten gesteuert und mit Right, Tab oder Enter übernommen](/img/demo-data-type-autocomplete.webp)

## Symbolleiste der Zeichenfläche {#canvas-toolbar}

Eine kleine Symbolleiste schwebt über der Mitte des unteren Rands der Zeichenfläche und enthält von links nach rechts die Werkzeuge, die auf die Zeichenfläche selbst wirken, und die Befehle, die ihr etwas hinzufügen:

- Die Hand und den Zeiger. Der Zeiger ist die Standardeinstellung; die Hand macht jedes Ziehen zum Verschieben der Ansicht, über Tabellen ebenso wie über leeren Flächen. `Space` wechselt zwischen beiden. Solange das Zeichnen mit [`New Table Group`](./table-groups.md#drawing-a-group) aktiviert ist, ist statt eines der beiden die Schaltfläche `New Table Group` markiert, und ein Klick auf eines der beiden, das Drücken von `Space` oder die Wahl einer Beziehungsnotation beendet das Zeichnen, ohne eine Gruppe hinzuzufügen.
- `New Table`, `New Memo` und `New Table Group`. `New Table` fügt wie `Alt + N` eine Tabelle hinzu, und `New Memo` fügt wie `Alt + M` eine Notiz hinzu. `New Table Group` aktiviert wie `Alt + G` das [Zeichnen einer Gruppe](./table-groups.md#drawing-a-group) und schaltet die Hand aus; ein zweiter Klick beendet, wie ein zweites `Alt + G`, das Zeichnen, ohne eine Gruppe hinzuzufügen. `New Memo` entfällt, solange View Option → `Memos` die Notizen ausblendet, und `New Table Group`, solange View Option → `Table Groups` die Gruppen ausblendet.
- Den Zoom: `Zoom out`, die aktuelle Zoomstufe als Prozentwert und `Zoom in`. Die beiden Schaltflächen ändern den Zoom schrittweise wie die Tastenkombinationen für den Zoom, und ein Klick auf den Prozentwert setzt ihn auf `100%` zurück.
- Die vier Beziehungsnotationen, dieselben vier, mit denen Sie das Zeichnen einer Beziehung beginnen – siehe [Mit dem Bearbeiten beginnen](./editing-start.md). Die Wahl einer davon schaltet zurück auf den Zeiger, da eine Beziehung durch Klicken auf zwei Tabellen gezeichnet wird.
- `Name View`, eine Schaltfläche mit einem Pfeil nach unten, die die aktuelle Ansicht nennt: `Physical Names`, `Logical Names` oder `Both Names`. Sie behält ihre Breite, welche Ansicht sie auch nennt, sodass ein Wechsel die Symbolleiste nie verschiebt. Ein Klick öffnet oberhalb der Symbolleiste eine Liste der drei Ansichten, in der die aktuelle mit einem Häkchen markiert ist. Die Wahl einer Ansicht wechselt zu ihr und schließt die Liste; ein zweiter Klick auf die Schaltfläche, ein Drücken an einer beliebigen anderen Stelle oder `Escape` schließt die Liste ohne Wechsel. Was jede Ansicht zeigt, wird in [Namensansicht](./logical-names.md#name-view) beschrieben, und ob ein Wechsel gespeichert wird, in [Ansicht wechseln](./logical-names.md#switching-the-view).
- Den Zen-Modus, `Alt + Z`, der alles außer der Zeichenfläche und dieser Symbolleiste ausblendet. Ein erneutes `Alt + Z` oder die Schaltfläche holt den Rest zurück. Ein geöffneter Explorer wird mit dem Rest ausgeblendet, ohne geschlossen zu werden, und kehrt mit ihm zurück. Er lässt sich auch im Zen-Modus öffnen – siehe [Wann der Explorer ausgeblendet wird](./explorer.md#when-it-stands-aside).
- Den Kompass `Go to content`, der nur so lange am Ende der Symbolleiste erscheint, wie keine Tabelle, keine angezeigte Notiz und keine angezeigte Tabellengruppe auf dem Bildschirm zu sehen ist – siehe [Auf der Zeichenfläche navigieren](#getting-around-the-canvas).

Jede Schaltfläche mit einer Tastenkombination nennt diese in ihrem Tooltip, etwa `New Table (Alt + N)` (Windows/Linux) oder `New Table (⌥ + N)` (Mac).  
Die Symbolleiste wird ausgeblendet, solange die Vorschau des Automatischen Layouts `Force`, die Tabelleneigenschaften, die Zeitreise oder die Diff-Ansicht geöffnet ist, und erscheint wieder, sobald diese geschlossen wird.  
Die Symbolleiste eines schreibgeschützten Editors behält den Zoom, `Name View`, den Zen-Modus und den Kompass `Go to content`. Sie hat weder Hand noch Zeiger, weder `New Table`, `New Memo` noch `New Table Group` und keine Notationen und bekommt sie zurück, sobald der Editor wieder beschreibbar ist.

![Über die Symbolleiste eine Tabelle und eine Notiz hinzufügen, New Table Group aktivieren und deaktivieren, mit der Hand die Ansicht verschieben, den Zoom schrittweise ändern und den Zen-Modus mit ⌥ + Z ein- und ausschalten](/img/demo-canvas-toolbar.webp)

## Vergrößern/Verkleinern {#zoom-inout}

Zoomt mit `Ctrl + Wheel` (Windows/Linux) oder `⌘ + Wheel` (Mac). Das Mausrad allein verschiebt die Ansicht der Zeichenfläche.  
Auch eine Pinch-Geste auf dem Trackpad zoomt, und zwar um den Punkt, an dem Sie sie ausführen, ebenso zwei Finger auf einem Touchscreen, die beim Bewegen außerdem die Ansicht verschieben.  
Tastenkombinationen: `Ctrl + Plus` (Windows/Linux) oder `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) oder `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) oder `⌘ + 0` (Mac) springt direkt auf `100%` zurück, wobei die Bildschirmmitte an ihrer Stelle bleibt.

Die Schaltflächen `Zoom out` und `Zoom in` in der [Symbolleiste der Zeichenfläche](#canvas-toolbar) ändern den Zoom schrittweise wie die Tastenkombinationen mit `Minus` und `Plus`: Jeder Klick ändert ihn um 4 Prozentpunkte, wobei die Bildschirmmitte an ihrer Stelle bleibt. Der Prozentwert dazwischen zeigt die aktuelle Zoomstufe, und ein Klick darauf springt wie `Ctrl + 0` (Windows/Linux) oder `⌘ + 0` (Mac) direkt auf `100%` zurück.

Der Zoom reicht von `10%` bis `150%`.  
Bei `70%` und darunter werden Tabellen auf ihren Namen und ihren Farbrand eingeklappt, und das Bearbeiten von Zellen, die Tastenkombinationen für Zellen sowie Kopieren und Einfügen funktionieren erst wieder, wenn Sie wieder vergrößern. Welchen Namen eine eingeklappte Tabelle zeigt, folgt der Namensansicht – siehe [Namensansicht](./logical-names.md#name-view).

Dieselben drei Tastenkombinationen zoomen auch die Registerkarte Visualisierung, im Modus `Graph` ebenso wie im Modus `Flow`, jeder Modus innerhalb seines eigenen Wertebereichs – siehe [Visualisierung](./visualization.md#toolbar).

![Mit ⌘ + Wheel verkleinern, bis die Tabellen auf ihren Namen eingeklappt sind, dann schrittweise mit ⌘ + Plus, ⌘ + Minus und ⌘ + 0 zurück](/img/demo-zoom.webp)

## Auf der Zeichenfläche navigieren {#getting-around-the-canvas}

Die Zeichenfläche hat keine Ränder und keine einstellbare Größe. Tabellen und Notizen stehen dort, wo Sie sie platzieren, und alles Folgende beschreibt das Diagramm statt einer festen Seite.

Ziehen Sie auf einer leeren Stelle der Zeichenfläche, um die Ansicht zu verschieben, oder wechseln Sie mit `Space` zum Hand-Werkzeug, und ziehen Sie an beliebiger Stelle, auch über einer Tabelle. Auch das Mausrad verschiebt die Ansicht, und `Shift + Wheel` verschiebt sie seitwärts.  
Die Innenfläche einer [Tabellengruppe](./table-groups.md#selecting-groups), also die Fläche unter ihrer Titelleiste, gilt für die linke Maustaste als leere Zeichenfläche: Ziehen darauf verschiebt die Ansicht, `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac) zieht einen Auswahlrahmen auf, und ein Klick hebt die Auswahl auf.  
Das Verschieben der Ansicht hat keine Grenzen: Mausrad, Ziehen und Hand-Werkzeug bewegen die Ansicht so weit, wie Sie sie bewegen, auf jeder Seite über die Tabellen hinaus.

Ziehen Sie mit der mittleren Maustaste (Mausrad drücken), um die Ansicht von jeder Stelle der Zeichenfläche aus zu verschieben, mit dem Zeiger ebenso wie mit der Hand. Das funktioniert auch, wenn Sie die Taste über einer Tabelle, einer Notiz, einer Zelle, einem Symbol oder einer Beziehung drücken.  
Ziehen mit der mittleren Maustaste wählt nichts aus, verschiebt nichts, klickt nichts an und behält die Auswahl bei. Es schließt ein geöffnetes Kontextmenü und die Farbauswahl, und das browsereigene Scrollen und Einfügen per Mittelklick startet nicht.  
Das Drücken der mittleren Maustaste auf den Scrollleisten, der Minimap, der Symbolleiste der Zeichenfläche oder einem geöffneten Zellen- oder Notizeditor verschiebt die Ansicht nicht.

Die Minimap in der rechten oberen Ecke bildet das Diagramm mit einer Bildschirmgröße an Platz auf jeder Seite ab, also mit der Reichweite der Scrollleisten, nach außen auf ein grobes Raster gerundet, sodass das Diagramm darin umso kleiner erscheint, je weiter Sie verkleinern. Klicken Sie darauf, um die Ansicht an diese Stelle zu bewegen, oder ziehen Sie das Ansichtsrechteck, um die Ansicht zu verschieben. Beim Verkleinern wächst das Ansichtsrechteck und deckt mehr von der Karte ab.  
Sie zeichnet jede Tabelle in deren Farbe und jede angezeigte Tabellengruppe als Rahmen in der Farbe der Gruppe hinter ihren Tabellen.  
Die Scrollleisten am rechten und unteren Rand beschreiben denselben Weg, der von der Lage, in der das Diagramm knapp jenseits der einen Seite des Bildschirms liegt, bis knapp jenseits der anderen reicht, sodass er mindestens einen Bildschirm länger ist als das gezeichnete Diagramm und noch länger, solange die Ansicht darüber hinaus steht. Außerhalb des Zen-Modus werden beide Scrollleisten angezeigt, sobald das Dokument eine Tabelle, eine angezeigte Notiz oder eine angezeigte Tabellengruppe enthält, auch wenn alles auf den Bildschirm passt. Ein Dokument ohne all das, etwa eines, dessen einzige Notizen mit View Option → `Memos` ausgeblendet sind, zeigt keine der beiden und keine Minimap.  
Das Ziehen des Schiebers einer Scrollleiste oder des Ansichtsrechtecks der Minimap ist die einzige Verschiebung, die anhält: Sie geht nicht weiter als bis zu den Tabellen knapp außerhalb des Bildschirms oder bis zu der Stelle, an der das Ziehen begann, falls diese weiter außen lag.

Wenn nach dem Verschieben keine Tabelle, keine angezeigte Notiz und keine angezeigte Tabellengruppe mehr auf dem Bildschirm ist, erscheint am Ende der [Symbolleiste der Zeichenfläche](#canvas-toolbar) ein Kompass `Go to content` mit einem Pfeil auf das nächstgelegene Element und dessen Entfernung. Klicken Sie darauf, um dieses Element zu zentrieren, ohne den Zoom zu ändern.

![Die Ansicht durch Ziehen auf leerer Zeichenfläche, mit dem Mausrad, durch Ziehen mit der mittleren Maustaste über einer Tabelle und über die Minimap verschieben, dann mit Shift + wheel über den Inhalt hinaus scrollen und dem Kompass Go to content zurück folgen](/img/demo-canvas-navigation.webp)

### Wohin ein Sprung führt {#where-a-jump-lands}

Jeder Sprung, der Sie zu etwas auf der Zeichenfläche bringt, bewegt die Ansicht nach einer einzigen Regel: die Ergebnisse von `#`, `@` und `:` in der [Schnellsuche](./quick-search.md#searching-the-diagram), die Zeilen des [Explorers](./explorer.md#going-to-a-row) und die Treffer seiner Suche mit [Suchen und Ersetzen](./find-and-replace.md#going-to-a-match), die Zeilen der Liste der [Diff-Ansicht](#going-to-a-change), die [Kartenschaltfläche](./visualization.md#card-buttons) für externe Links in Flow, eine Prüfung, die auf dem [Blatt Prüfungen](./dictionary.md#the-checks-sheet) der Registerkarte Wörterbuch eine Tabelle oder eine Spalte nennt, und die Platzierung durch [Importieren und hinzufügen](./file-import-export.md#import-and-add). Jeder dieser Abschnitte sagt, was der Sprung auswählt; dieser sagt, wohin die Ansicht geht.

Ein Sprung ändert nie den Zoom und scrollt höchstens einmal. Von einer anderen Registerkarte aus wechselt er zuerst zur Registerkarte ERD.  
Er misst die Zeichenfläche so, wie sie angezeigt wird: unterhalb der oberen Symbolleiste, im Zen-Modus über die ganze Höhe, und rechts von einem geöffneten Explorer, der die Zeichenfläche verschmälert, statt sie zu verdecken.

Waagerecht und senkrecht werden getrennt beurteilt, und eine Richtung, in der das Ziel bereits gut sichtbar ist, bleibt genau so, wie sie ist:

- Ein Ziel, das in dieser Richtung nicht länger als die halbe Zeichenfläche ist, bleibt stehen, solange seine Mitte in der mittleren Hälfte der Zeichenfläche liegt, zwischen einem Viertel und drei Vierteln der Breite oder der Höhe. Andernfalls wird seine Mitte in die Mitte der Zeichenfläche gebracht.
- Ein längeres Ziel, das noch mit `40px` Abstand an jedem Ende hineinpasst, bleibt stehen, solange es vollständig sichtbar ist. Andernfalls wird es waagerecht zentriert; senkrecht wird seine Oberkante auf `40px` unterhalb der Oberkante der Zeichenfläche gebracht.
- Ein noch längeres Ziel bleibt stehen, solange es vollständig sichtbar ist, oder, wenn es länger als die Zeichenfläche ist, solange sein unten aufgeführter maßgeblicher Teil sichtbar ist. Andernfalls wird es zentriert, wenn es hineinpasst, oder sonst so nah an die Mitte gesetzt, dass beide Enden seines maßgeblichen Teils mindestens `40px` innerhalb der Zeichenfläche bleiben; bei einem maßgeblichen Teil, der dafür zu lang ist, wird sein Anfang `40px` innerhalb gehalten.

Eine kleine Tabelle nahe dem linken Rand der Zeichenfläche auf halber Höhe wird also nur waagerecht verschoben.

Was ein Sprung sichtbar macht und welcher maßgebliche Teil zu sehen sein muss, wenn das Ganze nicht hineinpasst:

- Eine Tabelle: die ganze Tabelle, anhand des Namensbands an ihrer Oberkante oder, bei einem Treffer im Tabellenkommentar, anhand ihrer Kommentarzelle, solange View Option → `Table Comment` die Kommentare anzeigt. Bei `70%` und darunter, wo Tabellen auf ihren Namen eingeklappt sind, anhand des Namens in der Mitte des Rahmens.
- Eine Spalte: ihre Zeile, anhand der Zelle, zu der der Sprung führt: ihr Name, ihr logischer Name bei einem Treffer im logischen Namen oder einer Prüfung des logischen Namens, ihre Domänenzelle bei einer Prüfung ihrer Domäne oder der Kommentar, in dem ein Treffer liegt, solange View Option → `Column Comment` die Kommentare anzeigt. Wo die Zeile keine solche Zelle zeigt, führt der Sprung zu der Zelle, die an ihrer Stelle gezeigt wird: zum logischen Namen anstelle des Namens in der Ansicht `Logical Names`, zum Namen anstelle des logischen Namens in der Ansicht `Physical Names` und zur Typzelle anstelle der Domänenzelle, solange View Option → `Domain` ausgeschaltet ist, oder zur Zeile als Ganzes, solange zusätzlich `DataType` ausgeschaltet ist. Bei `70%` und darunter macht eine Spalte ihre Tabelle nach der Regel für Tabellen sichtbar.
- Eine Zelle, die zu breit ist, um ganz angezeigt zu werden, etwa ein langer Kommentar: anhand des gefundenen Textes darin. Ein Sprung zu der Zelle, die anstelle derjenigen gezeigt wird, in der der Treffer liegt, etwa zum Namen bei einem Treffer im logischen Namen in der Ansicht `Physical Names`, richtet sich nicht nach dem Text.
- Eine Beziehung: der Rahmen, der ihre beiden Tabellen umspannt, anhand der Kindtabelle.
- Eine Tabellengruppe: ihr Rahmen, anhand ihrer Titelleiste.
- Eine Notiz oder der Block, den „Importieren und hinzufügen“ platziert: jeweils das Ganze.

Wenn sich in keiner der beiden Richtungen etwas bewegen würde, wird nicht gescrollt, sodass bei zwei Sprüngen direkt hintereinander zur selben Stelle der zweite nichts bewegt. Ein Sprung, der die Zeichenfläche scrollt, zeichnet das Scrollen wie jede andere Änderung der Ansichtsposition im [Verlauf](./undo-redo.md#what-the-history-records) auf, und einer, der nichts bewegt, hinterlässt nichts zum Rückgängigmachen. Bei „Importieren und hinzufügen“ gehört das Scrollen zum selben Schritt wie das Hinzufügen. Eine Zeile der Liste der Diff-Ansicht bewegt nur die schreibgeschützten Seiten der Ansicht und zeichnet daher nichts auf, und ein schreibgeschützter Editor zeichnet überhaupt keinen Sprung auf.  
Kein Sprung beginnt oder beendet das Zeichnen einer Beziehung. Der Kompass `Go to content` ist kein Sprung: Er zentriert, worauf er zeigt.

## Diff-Ansicht {#diff-viewer}

Sie können zuvor gespeicherte Dokumente mit dem aktuellen Dokument vergleichen.  
Wählen Sie `Diff Viewer` im Kontextmenü der Zeichenfläche, und wählen Sie ein Dokument `.json`, das Sie zuvor exportiert haben.

Die Ansicht öffnet sich über der Zeichenfläche: links, was sich geändert hat, dann das gespeicherte und das aktuelle Dokument nebeneinander.  
Das aktuelle Dokument wird in dem Stand verglichen, den es beim Öffnen der Ansicht hat; danach vorgenommene Änderungen, auch die eines Mitbearbeiters, erreichen die Ansicht nicht. Beide Seiten öffnen sich in der Namensansicht, die Sie gerade betrachten, und bleiben in ihr, gleich welche Ansicht eine der beiden Dateien behält – siehe [Außerhalb der Zeichenfläche](./logical-names.md#beyond-the-canvas). Ein geöffneter [Explorer](./explorer.md#when-it-stands-aside) wird ausgeblendet, solange die Ansicht geöffnet ist, sodass die Ansicht die ganze Breite des Editors einnimmt.  
Jede Seite lässt sich mit dem Mausrad, durch Ziehen auf einer leeren Stelle oder der Innenfläche einer Tabellengruppe oder durch Ziehen mit der mittleren Maustaste an beliebiger Stelle darüber verschieben und mit `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) oder einer Pinch-Geste zoomen. Bei `70%` und darunter werden ihre Tabellen wie auf der Zeichenfläche eingeklappt – siehe [Markierungen auf beiden Seiten](#marks-on-the-two-sides).  
Beide Seiten sind schreibgeschützt, sodass nichts in Ihrem Dokument verändert wird. Jede behält ihre eigene Auswahl, und ein Klick auf eine Tabelle dort wählt sie nur auf dieser Seite aus.  
Schließen Sie die Ansicht mit der Schaltfläche `Close` auf dem Hinweis `Diff Viewer`, mit dem sie sich öffnet, oder mit `Escape`.  
Ein schreibgeschützter Editor bietet ebenfalls `Diff Viewer` an, und die Ansicht funktioniert dort wie in jedem Editor, wobei ein Klick auf eine Tabelle einer Seite sie weiterhin auf dieser Seite auswählt. Eine Ansicht, die geöffnet ist, wenn der Editor schreibgeschützt wird, bleibt geöffnet.

![Die Diff-Ansicht mit einer gespeicherten .json-Datei öffnen, in ihrem Baum auf mit A, M, D und R markierte Zeilen klicken, nach Namen filtern und sie schließen](/img/demo-diff-viewer.webp)

### Was verglichen wird {#what-is-compared}

Tabellen, Spalten, Indizes, Fremdschlüssel, Notizen und Tabellengruppen werden alle verglichen.  
Jedes Element wird zuerst anhand seiner ID zugeordnet, sodass beim Vergleich mit einer früheren Version derselben Datei, die die IDs beibehält, eine umbenannte Tabelle, Spalte, ein umbenannter Index oder eine umbenannte Tabellengruppe weiterhin ein einziges Element ist, das als umbenannt aufgeführt wird.  
Was übrig bleibt, wird eins zu eins anhand dessen zugeordnet, was es beibehält: eine Tabelle oder Tabellengruppe anhand ihres Namens, einschließlich Groß-/Kleinschreibung; eine Spalte oder ein Index anhand der Tabelle und des Namens; ein Fremdschlüssel anhand seiner beiden Tabellen und seiner Spaltenpaare; und eine Notiz anhand ihres Textes, dann ihrer Position. Ein Index ohne Namen wird anhand seiner Spalten, deren Reihenfolge und Richtung sowie danach zugeordnet, ob er eindeutig ist, und eine Tabellengruppe ohne Namen anhand der größten Zahl gemeinsamer Tabellen.  
Beim Vergleich mit einer Datei anderer Herkunft, etwa einem per SQL-Import neu aufgebauten Diagramm, erscheint eine umbenannte Tabelle daher als eine entfernte und eine hinzugefügte.

Was als Änderung zählt:

- Eine Tabelle: ihr Name, Kommentar, ihre Tabellengruppe, Position und Farbe.
- Eine Spalte: ihr Name, Kommentar, Datentyp, Standardwert, Autoinkrement, Primärschlüssel, Eindeutig, Nicht NULL und ihre Position in der Tabelle. Nur die Spalten außerhalb der Reihenfolge, die beide Dokumente gemeinsam haben, gelten als verschoben, sodass das Hinzufügen, Entfernen oder Verschieben einer Spalte die anderen nicht markiert.
- Ein Index: sein Name, UNIQUE und seine Spalten mit ihrer Reihenfolge und Richtung.
- Ein Fremdschlüssel: seine Spaltenpaare, sein Beziehungstyp und seine Aktionen für ON DELETE und ON UPDATE.
- Eine Notiz: ihr Text, ihre Position, Größe und Farbe.
- Eine Tabellengruppe: ihr Name, die Tabellen, die sie enthält, ihre Farbe, Position und Größe.

Eine Tabelle, Notiz oder Gruppe, die nur verschoben, in der Größe geändert oder umgefärbt wurde, gilt also als geändert. Positionen und Größen werden in ganzen Pixeln verglichen, und die Stapelreihenfolge sowie die Stelle, an der eine Verbindungslinie auf eine Tabelle trifft, zählen nie.  
Logische Namen, Domänenverknüpfungen sowie die Wörter, Begriffe und Domänen der Registerkarte [Wörterbuch](./dictionary.md) werden nicht verglichen, sodass eine Änderung allein an ihnen weder aufgeführt noch markiert wird. Ein Datentyp, den eine Domäne geändert hat, zählt jedoch als Änderung des Datentyps der Spalte.

### Der Änderungsbaum {#the-change-tree}

Die Liste links wird wie der [Baum des Explorers](./explorer.md#the-tree) dargestellt und enthält nur, was sich geändert hat: `Tables`, `Table Groups` und `Memos`, jeder Ordner nur angezeigt, wenn er eine Zeile enthält, und unter einer Tabelle deren eigene `Columns`, `Indexes` und `Foreign Keys`. Ein Fremdschlüssel wird unter seiner Kindtabelle aufgeführt, und eine hinzugefügte oder entfernte Tabelle listet nichts darunter auf.  
Jeder Ordner zeigt, wie viele Zeilen er enthält, und alle Ordner und Tabellen sind anfangs ausgeklappt.  
Eine Tabellen- oder Spaltenzeile wird in der Namensansicht benannt, in der sich die Seiten geöffnet haben. In der Ansicht `Both Names` zeigt sie den logischen Namen mit dem Namen danach, abgeschwächt, und in einer entfernten Zeile ist der abgeschwächte Name mit dem Rest durchgestrichen. Tabellen und Tabellengruppen werden nach Namen geordnet aufgeführt, ohne Beachtung der Groß-/Kleinschreibung, gleich in welcher Ansicht. Notizen sowie die Spalten, Indizes und Fremdschlüssel einer Tabelle behalten die Reihenfolge des aktuellen Dokuments, wobei ein entferntes Element an seine frühere Stelle zurückgesetzt wird. Eine Notizzeile zeigt die erste Zeile der Notiz, und eine Fremdschlüsselzeile zeigt ihre Spalten in der Kindtabelle, dann `→` mit der Elterntabelle und deren Spalten, etwa `user_id → users(id)`. Ein leerer Name erscheint kursiv als `unnamed`.

Jede Zeile endet mit einem Buchstaben, und bei einer mit `A`, `D`, `M` oder `R` markierten Zeile erscheint der Name in der Farbe des Buchstabens:

- `A`, hinzugefügt, in Grün: nur im aktuellen Dokument.
- `D`, entfernt, in Rot und durchgestrichen: nur im gespeicherten Dokument.
- `M`, geändert, in Bernstein: in beiden vorhanden, verändert.
- `R`, umbenannt, in Blau: in beiden vorhanden, mit neuem Namen. Eine Umbenennung hat Vorrang vor jeder anderen Änderung, die der Tooltip trotzdem aufführt.
- `~`, in Bernstein, steht am Ende jedes Ordners und jeder Tabelle, die nur wegen Änderungen in ihrem Inneren aufgeführt ist; deren Namen behalten die übliche Farbe.

Zeigen Sie mit dem Zeiger auf den Namen einer Zeile, um ihren Tooltip zu sehen: den Status, `Added`, `Deleted`, `Modified`, `Renamed` oder `Changed inside`, dann eine Zeile pro Änderung, etwa `Name: users → members` oder `NN: ✗ → ✓`. Ein Text wird mit seiner ersten Zeile zitiert, nach 40 Zeichen abgeschnitten, und ein leerer Wert erscheint als `—`. Der Tooltip eines hinzugefügten oder entfernten Elements besteht nur aus seinem Status.

Das Feld `Filter by name` über dem Baum behält die Zeilen, deren aktueller oder gespeicherter Name oder deren aktueller oder gespeicherter logischer Name das Eingegebene enthält, ohne Beachtung der Groß-/Kleinschreibung, in jeder Namensansicht. Eine Tabelle, deren Name passt, behält alle ihre Zeilen, und eine, deren Name nicht passt, bleibt nur mit den passenden Zeilen stehen. Ein Filter ohne Treffer lässt den Baum leer.  
Wenn sich die beiden Dokumente überhaupt nicht unterscheiden, zeigt der Baum `No changes`.

Ziehen Sie den rechten Rand des Baums, um ihn breiter oder schmaler zu machen, von `200px` bis `480px`, und doppelklicken Sie auf den Rand, um ihn auf `260px` zurückzusetzen. Jeder Vergleich öffnet sich mit `260px`, und die beiden Seiten teilen sich die restliche Breite zu gleichen Teilen.  
Mit der Tastatur bewegen Sie sich durch den Baum wie durch den des Explorers – siehe [Tasten im Explorer](./explorer.md#keys-in-the-explorer) –, aber hier schließt `Escape` im Baum oder im Feld `Filter by name` die Ansicht.

### Zu einer Änderung wechseln {#going-to-a-change}

Klicken Sie auf eine Zeile, oder drücken Sie `Enter` oder `Space`, während der Tastaturfokus auf ihr liegt, um auf jeder Seite, die ihr Element enthält, zu diesem zu wechseln: bei einem hinzugefügten Element nur auf der aktuellen Seite, bei einem entfernten nur auf der gespeicherten Seite und bei allem, was beide enthalten, auf beiden Seiten. Eine Ordnerzeile klappt nur ein oder aus, ebenso der Pfeil am Anfang einer Tabellenzeile.

- Eine Tabellen-, Spalten- oder Indexzeile wählt nur die Tabelle aus.
- Eine Fremdschlüsselzeile macht ihre beiden Tabellen sichtbar, oder die Kindtabelle, wenn die beiden zu weit auseinanderliegen, um zusammen angezeigt zu werden, wählt die Kindtabelle mit ihren Fremdschlüsselspalten aus und hebt die Verbindungslinie hervor – siehe [Verbindungslinien lesen](./relationship-editing.md#reading-a-connector).
- Eine Notizzeile wählt die Notiz aus, und eine Tabellengruppenzeile wählt die Gruppe aus. Eine Notiz oder Gruppe, die im Dokument einer Seite ausgeblendet ist, führt auf dieser Seite nirgendwohin.

Jede Seite bewegt sich nach der Regel in [Wohin ein Sprung führt](#where-a-jump-lands), gemessen auf dieser Seite, sodass ein erneuter Klick auf dieselbe Zeile nichts bewegt.

### Markierungen auf beiden Seiten {#marks-on-the-two-sides}

Die beiden Seiten färben Text, Umrisse und Verbindungslinien ein und füllen nichts. Hinzugefügtes ist grün und erscheint nur auf der aktuellen Seite, Entferntes ist rot und erscheint nur auf der gespeicherten Seite, und Geändertes in Bernstein und Umbenanntes in Blau erscheinen auf beiden Seiten. Alles Unveränderte wird wie gewohnt gezeichnet.

- Eine hinzugefügte oder entfernte Tabelle oder Tabellengruppe wird in der jeweiligen Farbe umrandet, und ihr Name nimmt diese Farbe an. Eine hinzugefügte oder entfernte Notiz wird umrandet.
- Eine hinzugefügte oder entfernte Spalte in einer Tabelle, die beide Dokumente enthalten, färbt ihre ganze Zeile ein, und eine verschobene Spalte färbt ihre ganze Zeile bernsteinfarben. Innerhalb einer hinzugefügten oder entfernten Tabelle wird nichts eigens markiert.
- Der Text einer geänderten Zelle wird bernsteinfarben: der Kommentar einer Tabelle, Kommentar, Datentyp, Standardwert, Autoinkrement, Eindeutig oder Nicht NULL einer Spalte oder der Text einer Notiz. Eine Änderung des Primärschlüssels färbt das Schlüsselsymbol der Spalte bernsteinfarben.
- Bei einer umbenannten Tabelle, Spalte oder Tabellengruppe erscheint der Name in Blau.
- Eine Tabelle, Notiz oder Tabellengruppe mit einer Änderung ohne eigene Zelle, etwa einer Verschiebung, einer neuen Größe oder Farbe oder einem Wechsel der Gruppe oder der Tabellen einer Gruppe, wird bernsteinfarben umrandet.
- Ein hinzugefügter, entfernter oder geänderter Fremdschlüssel zeichnet seine Verbindungslinie in der jeweiligen Farbe. Wenn Sie mit dem Zeiger darauf zeigen oder eine Zeile sie hervorhebt, wird sie stattdessen in der üblichen Hover-Farbe gezeichnet.
- Eine Indexänderung markiert auf keiner der beiden Seiten etwas; sie erscheint nur im Baum.

Jede Seite folgt den Ansichtsoptionen ihres eigenen Dokuments. Eine Änderung in einer Zelle, die diese Seite nicht zeichnet, erscheint stattdessen am Namen. Eine Spaltenänderung in einer Zelle, die eine Ansichtsoption ausblendet, etwa `Unique` oder `Auto Increment`, die beide standardmäßig ausgeschaltet sind, färbt den Namen der Spalte bernsteinfarben, ebenso eine Änderung des Primärschlüssels in einer Zeile, die kein Schlüsselsymbol zeigt. Eine Änderung des Tabellenkommentars, während `Table Comment` ausgeschaltet ist, färbt den Namen der Tabelle bernsteinfarben. Das Blau einer Umbenennung hat Vorrang vor diesem Bernstein. Eine Notiz oder Tabellengruppe, die in ihrem Dokument ausgeblendet ist, wird im Baum aufgeführt, aber auf dieser Seite nicht gezeichnet.

In der Ansicht `Logical Names`, die keine Namenszelle zeigt, erscheinen das Blau einer Umbenennung und das Bernstein einer Änderung in einer Zelle, die die Seite nicht zeichnet, auf dem logischen Namen, der anstelle des Namens gezeigt wird. Eine Änderung des Datentyps färbt die Typzelle in jeder Namensansicht bernsteinfarben, auch wo die Zelle den Namen einer Domäne zeigt. Keine der beiden Seiten zeichnet die Farben, die die Prüfungen des Wörterbuchs Namen auf der Zeichenfläche geben – siehe [Markierungen auf der Zeichenfläche](./dictionary.md#marks-on-the-canvas).

Bei `70%` und darunter behalten eingeklappte Tabellen ihren Umriss. Der Name behält das Grün oder Rot einer hinzugefügten oder entfernten Tabelle oder das Blau einer Umbenennung und nimmt andernfalls das Bernstein einer Kommentaränderung an. Spaltenänderungen werden erst gezeichnet, wenn Sie wieder vergrößern; der Baum führt sie trotzdem auf.

## Schreibgeschützte Editoren {#read-only-editors}

Ein [`readonly`](../../api/erd-editor-element.md#readonly)-Editor, etwa eine in VS Code als Diagramm wieder geöffnete Git-Revision, ist ein Leser. Seine sechs Registerkarten, der [Explorer](./explorer.md#read-only-editors), die Minimap, die Scrollleisten sowie die Cursor und Auswahlen von Mitbearbeitern bleiben, und jedes Bedienelement, das das Diagramm ändern würde, ist weg, statt abgeblendet zu sein.

Auf der ERD-Zeichenfläche:

- Ein Ziehen verschiebt die Zeichenfläche, wo immer es beginnt: auf der leeren Zeichenfläche, auf einer Tabelle, einer Notiz oder einer Tabellengruppe gleichermaßen. Die mittlere Maustaste, das Mausrad, ein Pinch und die Zoom-Tasten funktionieren wie in jedem Editor.
- Ruht der Zeiger auf einer Tabelle, leuchten deren Beziehungen auf. Ein Klick ohne Bewegung bringt die Beziehungen der Tabelle, auf der er landet, oder die Beziehung, auf der er landet, zum Leuchten, und ein Klick an anderer Stelle löscht die Hervorhebung.
- Nichts wird durch einen Druck, einen Auswahlrahmen oder eine Taste zum Alles-Auswählen ausgewählt. Nur ein Sprung wählt aus: Eine Zeile des [Explorers](./explorer.md#going-to-a-row), ein Treffer seiner [Suche und Ersetzung](./find-and-replace.md#going-to-a-match) oder ein Ergebnis nach `#`, `@` oder `:` in der [Schnellsuche](./quick-search.md#searching-the-diagram) wählt aus, worauf er landet, umrandet wie jede Auswahl, mit der fokussierten Zelle dort, wo der Sprung sie hinsetzt. Ein Klick ohne Bewegung hebt diese Auswahl auf.
- Die Pfeiltasten bewegen die fokussierte Zelle. Kopieren, `Table Properties` und `Focus on this table` funktionieren mit ihren Tasten auf dem, was ein Sprung ausgewählt hat, und ein Einfügen fügt nichts hinzu. Die übrigen Tasten stehen unter [Tastenkombinationen](./settings.md#shortcuts).
- Kein Name einer Zelle, Notiz oder Tabellengruppe öffnet sich zur Bearbeitung. Es gibt keine Schaltflächen `+` oder `x` an Tabellen, Notizen und Gruppen, keine Ziehkanten an Notizen und Gruppen, keinen Ziehgriff für Spalten und keine Farbauswahl.

Das Kontextmenü der Zeichenfläche behält `View Option`, `Name View`, `Export` und `Diff Viewer`. Es hat kein `New Table`, `New Memo`, `New Table Group`, `Toggle Explorer`, `Relationship`, `Derive Physical Names Again`, `Database`, `Import`, `Import and Add` und `Auto Layout`.  
Das Menü einer Tabelle behält allein `Table Properties`, das den Bereich für diese Tabelle nur lesbar öffnet – siehe [Tabelleneigenschaften](#table-properties). Eine Notiz, eine Beziehung und eine Tabellengruppe öffnen kein Menü.  
Die [Symbolleiste der Zeichenfläche](#canvas-toolbar) behält den Zoom, `Name View`, den Zen-Modus und den Kompass `Go to content`. Die obere Symbolleiste zeigt den Namen der Datenbank als Text, der sich nicht bearbeiten lässt, und kein `Undo`, `Redo` oder `Time Travel`.  
[Export](./file-import-export.md#exporting) mit allen drei Einträgen und die [Diff-Ansicht](#diff-viewer) funktionieren wie in jedem Editor.

[`View Option`](#table-view-options), die `Name View`, die Datenbank, die Registerkarte, die Ansichtsposition und der Zoom lassen sich dort weiterhin ändern, aber nur auf diesem Bildschirm: Nichts davon wird gespeichert, aufgezeichnet oder geteilt – siehe [Schreibgeschützte Editoren](./settings.md#read-only-editors) unter Einstellungen.

Wird ein Editor schreibgeschützt, endet, was zur Bearbeitung offen stand: der Editor für den Namen einer Zelle, Notiz oder Tabellengruppe, eine Beziehung oder `New Table Group`, die gerade gezeichnet wird, die Auswahl und die fokussierte Zelle, das Hand-Werkzeug, die Farbauswahl, [Map Columns](./relationship-editing.md#map-columns) und [Time Travel](./undo-redo.md#time-travel). Die Ansicht, der Zoom, die Registerkarte und die Namensansicht bleiben, wie sie waren, und Table Properties, die Diff-Ansicht und der Dialog `Export image` bleiben geöffnet.  
Auch eine laufende Geste endet dort. Ein Ziehen von Tabellen oder Notizen bleibt stehen, wo es ist, ein `Alt + drag` legt keine Kopie ab, ein Ziehen einer Spalte endet, eine Größenänderung einer Notiz bleibt stehen, wo sie ist, die Größenänderung einer Tabellengruppe wird verworfen, und ein [Automatisches Layout](#auto-layout) wird mit seinem Hinweis verworfen, sodass sich keine Tabelle bewegt.  
Wird er wieder beschreibbar, gibt der Editor die obigen Bedienelemente zurück, und nichts, was der Wechsel geschlossen hat, öffnet sich wieder.
