---
sidebar_position: 4
description: Tabellen und Spalten logische Namen geben, mit der Namensansicht physische Namen, logische Namen oder beide anzeigen, Begriffsnamen bei der Eingabe vervollständigen, Spalten mit Domänen verknüpfen und sehen, wo die Namen sonst noch der Ansicht folgen.
---

# Logische Namen

Eine Tabelle und jede ihrer Spalten können neben ihrem Namen einen logischen Namen haben. Der logische Name ist der, den Menschen lesen, etwa `Customer Name` für `CUST_NM`. Der Name selbst ist der physische Name, also der, den [Schema SQL](./schema-sql.md) und der [Codegenerator](./code-generator.md) schreiben.  
Die Namensansicht legt fest, welchen der beiden die ERD-Zeichenfläche zeigt: die Namen, die logischen Namen oder beide – siehe [Namensansicht](#name-view).  
Ein logischer Name kann seiner Tabelle oder Spalte auch einen physischen Namen geben, der aus den Wörtern und Begriffen auf der Registerkarte [Wörterbuch](./dictionary.md) abgeleitet wird – siehe [Physische Namen ableiten](./dictionary.md#deriving-physical-names).  
Eine Spalte kann mit einer Domäne verknüpft werden, einem benannten Datentyp wie `Name` für `VARCHAR(100)`, der auf dem Blatt `Domains` der Registerkarte Wörterbuch geführt wird, und hat dann den Datentyp der Domäne – siehe [Die Domänenzelle](#the-domain-cell).  
Schema SQL kann jeden logischen Namen in einen leeren Kommentar schreiben – siehe [Logische Namen als Kommentare](./schema-sql.md#logical-names-as-comments).

## Namensansicht {#name-view}

Es gibt drei Ansichten, und jede zeigt den Tabellenkopf und die Zeilen einer Tabelle auf ihre eigene Weise:

- Die Ansicht `Physical Names`, mit der ein neues Diagramm beginnt, zeigt keinen logischen Namen. Der Tabellenkopf zeigt den Namen der Tabelle und, solange View Option → `Table Comment` eingeschaltet ist, ihren Kommentar, und jede Zeile zeigt ihre Zellen in der [Spaltenreihenfolge](./settings.md#adjusting-column-order).
- Die Ansicht `Logical Names` zeigt den logischen Namen an der Stelle jedes Namens: im Tabellenkopf und in jeder Zeile dort, wo `Name` in der Spaltenreihenfolge steht. Die Typzelle einer Zeile kann für die Domäne der Spalte stehen, wie unten beschrieben.
- Die Ansicht `Both Names` zeigt den logischen Namen neben dem Namen. Der Tabellenkopf zeigt den logischen Namen, dann den Namen, dann den Kommentar, und jede Zeile erhält eine Zelle `Logical Name`, die die Spaltenreihenfolge standardmäßig direkt vor `Name` einordnet.

Ein leerer logischer Name, auch einer, der nur aus Leerzeichen besteht, zeigt einen abgeblendeten Ersatz. In der Ansicht `Logical Names` ist das der Name, der an seiner Stelle gezeigt wird, oder, wenn auch der Name leer ist, der Platzhalter `table` oder `column`. In der Ansicht `Both Names` ist es der Platzhalter `logical`.

In der Ansicht `Logical Names` zeigt eine Spalte, die mit einer benannten Domäne auf dem Blatt `Domains` der Registerkarte Wörterbuch verknüpft ist, in ihrer Typzelle den Namen dieser Domäne statt ihres Datentyps. Jede andere Spalte zeigt dort ihren Datentyp.  
Solange View Option → `Domain` eingeschaltet ist, hat die Domäne eine eigene Zelle, und die Typzelle behält den Datentyp, sodass keine Zeile die Domäne zweimal zeigt – siehe [Die Domänenzelle](#the-domain-cell).

Jede Tabelle ist so breit wie die Zellen, die sie in der Ansicht zeigt, sodass ein Wechsel die Größe der Tabellen ändert und ihre Verbindungslinien neu anordnet. Keine Tabelle wird verschoben.  
Bei `70%` und darunter wird eine Tabelle auf ihren Namen eingeklappt – siehe [Vergrößern/Verkleinern](./table-related-functions.md#zoom-inout). In der Ansicht `Logical Names` zeigt sie den logischen Namen oder, solange es keinen gibt, abgeblendet den Namen. In der Ansicht `Both Names` zeigt sie den logischen Namen mit dem Namen in einer Zeile darunter oder, solange es keinen logischen Namen gibt, nur den Namen.

Die Prüfungen des Wörterbuchs können einen logischen Namen oder einen Namen, den sie melden, rot oder bernsteinfarben darstellen – siehe [Markierungen auf der Zeichenfläche](./dictionary.md#marks-on-the-canvas).

## Ansicht wechseln {#switching-the-view}

An vier Stellen lässt sich die Ansicht wechseln, und jede listet `Physical Names`, `Logical Names` und `Both Names` auf, wobei die aktuelle Ansicht mit einem Häkchen markiert ist:

- Die Schaltfläche `Name View` auf der [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar), zwischen den vier Beziehungsnotationen und dem Zen-Modus. Sie nennt die aktuelle Ansicht, mit einem Pfeil nach unten, und ihr Tooltip lautet `Name View`. Ein Klick öffnet die Liste über der Symbolleiste, und eine Auswahl schließt sie.
- Der Eintrag `Name View` im Kontextmenü der Zeichenfläche, direkt nach `View Option`: ein Untermenü mit den drei Ansichten. Das Menü bleibt nach einer Auswahl geöffnet.
- Dieselbe Liste auf der Symbolleiste der Registerkarte Visualisierung im Modus `Flow`, nach dem Menü der Zeilenanzeige – siehe [Symbolleiste](./visualization.md#toolbar).
- Der Eintrag `Name View` in der [Schnellsuche](./quick-search.md#what-the-palette-lists), direkt nach `Tab` und nur auf der Registerkarte ERD aufgeführt. Sein Untermenü öffnet sich mit der Hervorhebung auf der aktuellen Ansicht.

![Die Namensansicht über die Symbolleiste der Zeichenfläche auf Logical Names umschalten, über das Menü der Zeichenfläche auf Both Names und zurück auf Physical Names, wobei die Spalte ordered_at ohne logischen Namen abgeblendet und dann als Platzhalter logical gezeigt wird](/img/demo-name-view.webp)

Alle vier stellen dieselbe Ansicht ein. Die obere Symbolleiste hat keine Schaltfläche dafür.

Ein Wechsel behält die Auswahl bei und wird nicht im [Verlauf](./undo-redo.md#what-the-history-records) aufgezeichnet.  
Liegt der Fokus auf einer Zelle, die die neue Ansicht nicht zeigt, wechselt er auf die Zelle, die an ihrer Stelle gezeigt wird: Der Name und der logische Name vertreten einander, ebenso der Typ und die Domäne. Ein auf dieser Zelle geöffneter Zelleneditor wird geschlossen. Das Ein- oder Ausschalten von View Option → `Domain` verschiebt den Fokus auf dieselbe Weise.  
Solange die Sperre `Name View` eingeschaltet ist, wie in einem neuen Diagramm, ändert ein Wechsel nur Ihren eigenen Bildschirm, und die Datei behält die Ansicht, bei der sie gesperrt wurde. Bei ausgeschalteter Sperre speichert die Datei die Ansicht, zu der Sie wechseln – siehe [Sperren](./settings.md#lock).

## Logischen Namen eingeben {#writing-a-logical-name}

Da die Ansicht `Physical Names` keinen logischen Namen zeigt, wechseln Sie zu `Logical Names` oder `Both Names`, um auf der Zeichenfläche einen einzugeben:

- In der Ansicht `Logical Names` enthalten die Namenszellen des Tabellenkopfs und der Zeilen die logischen Namen, sodass sich ein physischer Name in dieser Ansicht nicht auf der Zeichenfläche bearbeiten lässt.
- In der Ansicht `Both Names` enthalten die Zellen des logischen Namens die logischen Namen und die Namenszellen die physischen Namen.

Eine Zelle des logischen Namens wird wie jede andere Zelle bearbeitet: Beginnen Sie mit `Enter` oder einem Doppelklick – siehe [Tabellen bearbeiten](./table-editing.md). Wird der Editor auf einem leeren logischen Namen geöffnet, zeigt er als Platzhalter das, was die Zelle gezeigt hat: den Namen in der Ansicht `Logical Names`, `logical` in der Ansicht `Both Names`.  
Die Eingabe schreibt nur den logischen Namen. Der physische Name wird daraus abgeleitet, sobald sich der Editor bei einem geänderten logischen Namen schließt (`Enter`, `Tab`, `Escape` oder ein Klick an eine andere Stelle), als eigener Rückgängig-Schritt nach Ihrer Eingabe. Ein physischer Name, den Sie selbst geschrieben haben, bleibt unverändert – siehe [Physische Namen ableiten](./dictionary.md#deriving-physical-names).

`Tab` und `Shift + Tab` durchlaufen die Zellen, die die Ansicht zeigt, in ihrer Reihenfolge – siehe [Tab-Taste](./table-editing.md#tab-key):

- In der Ansicht `Logical Names` den logischen Namen des Tabellenkopfs, dann seinen Kommentar, dann die Zellen jeder Zeile in der Spaltenreihenfolge, mit dem logischen Namen an der Stelle des Namens.
- In der Ansicht `Both Names` den logischen Namen, den Namen und den Kommentar des Tabellenkopfs, dann die Zellen jeder Zeile in der Spaltenreihenfolge, standardmäßig beginnend mit ihrer Zelle `Logical Name`.

`Alt + Enter` (Windows/Linux) oder `⌥ + Enter` (Mac) fügt eine Spalte hinzu und fokussiert die erste Zelle, die ihre Zeile zeichnet. Bei der Standardspaltenreihenfolge ist das ihre Namenszelle, die in der Ansicht `Logical Names` ihr logischer Name ist und in `Both Names` ihre Zelle `Logical Name`, sodass Sie mit dem logischen Namen beginnen können – siehe [Spalten hinzufügen](./table-editing.md#adding-columns).

Eine Fremdschlüsselspalte, die eine Beziehung hinzufügt, übernimmt zusammen mit dem Typ den logischen Namen und die Domäne ihres Schlüssels – siehe [Identifizierende Beziehungen](./relationship-editing.md#identifying-relationships).  
Das Kopieren von Spalten in eine Tabellenkalkulation und das Einfügen von Spalten aus einer solchen verwenden die Zellen, die die Ansicht zeigt, einschließlich der Zellen des logischen Namens und der Domänenzellen – siehe [Spalten kopieren/einfügen](./table-editing.md#copyingpasting-columns).

## Begriffsnamen vervollständigen {#completing-term-names}

Während Sie in einer Zelle des logischen Namens tippen, ob im Tabellenkopf oder in einer Zeile, bietet eine Liste unter der Zelle die Begriffe an, deren Namen mit dem Text beginnen, wobei Groß-/Kleinschreibung und vorangestellte Leerzeichen nicht beachtet werden. Ein Begriff ist ein vollständiger logischer Name, der auf dem Blatt `Terms` der Registerkarte Wörterbuch geführt wird, zusammen mit dem physischen Namen und der Domäne, die er vergibt. Die Liste zeigt bis zu acht Begriffe, nach Name sortiert, wobei der eingegebene Text hervorgehoben ist. Solange kein Begriff so beginnt, gibt es keine Liste.

![In der Ansicht Both Names mit ⌥ + Enter eine Spalte hinzufügen, aus der Begriffsliste unter ihrem logischen Namen Order Amount wählen, um ORD_AMT, DECIMAL(10,2) und die Domäne Amount einzutragen, dann Order Date eingeben, dessen Namen ORD_DT die Wörter ergeben, als Enter den Editor schließt](/img/demo-logical-names.webp)

- Anfangs ist nichts hervorgehoben. `↑` und `↓` verschieben die Hervorhebung, die an beiden Enden zum jeweils anderen Ende springt, und der hervorgehobene Begriff zeigt die Taste `Enter`.
- `Enter` auf einem hervorgehobenen Begriff schreibt dessen Namen als logischen Namen und beendet die Bearbeitung. Sofern Sie den physischen Namen nicht selbst geschrieben haben, leitet derselbe Rückgängig-Schritt den physischen Namen sofort aus dem Begriff ab und gibt einer Spalte auch die Domäne des Begriffs. `Enter` ohne Hervorhebung beendet die Bearbeitung und behält Ihre Eingabe bei.
- Ein Klick auf einen Begriff schreibt ihn auf dieselbe Weise und lässt den Editor geöffnet.
- `Escape` schließt, solange die Liste angezeigt wird, nur die Liste, und das nächste `Escape` beendet die Bearbeitung.
- `Tab` wechselt mit dem eingegebenen Text weiter, und der physische Name wird beim Schließen des Editors daraus abgeleitet.
- Solange eine Eingabemethode Zeichen zusammensetzt, gehören die Pfeiltasten und `Enter` zum Zusammensetzen.

Was ein Begriff einer Tabelle oder einer Spalte gibt, wird in [Physische Namen ableiten](./dictionary.md#deriving-physical-names) beschrieben.

## Die Domänenzelle {#the-domain-cell}

View Option → `Domain`, standardmäßig ausgeschaltet, gibt jeder Zeile in jeder Ansicht eine Domänenzelle, und zwar dort, wo `Domain` in der Spaltenreihenfolge steht, standardmäßig direkt nach `DataType` – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options).  
Die Zelle zeigt den Namen der Domäne, mit der die Spalte verknüpft ist, oder, bei einer Spalte, die mit keiner auf dem Blatt `Domains` aufgeführten Domäne verknüpft ist, abgeblendet den Platzhalter `domain`.

![View Option → Domain einschalten, in der Domänenzelle von PAY_AMT Amount wählen, nachdem die Liste mit amo eingegrenzt wurde, auf der Registerkarte Wörterbuch den Datentyp von Amount auf DECIMAL(12,2) ändern und sehen, dass sich die Spalte mitgeändert hat, dann NUMERIC(12,2) in die Spalte eingeben, was die Verknüpfung aufhebt](/img/demo-domains.webp)

`Enter` oder ein Doppelklick öffnet über der Zelle eine Auswahl: ein leeres Feld mit dem Text der Zelle als Platzhalter und darunter `None`, dann jede benannte Domäne des Blatts `Domains` in der Reihenfolge des Blatts. Die Hervorhebung steht anfangs auf der verknüpften Domäne oder auf `None`.

- Eine Eingabe listet nur die Domänen auf, deren Namen den Text enthalten, ohne Beachtung der Groß-/Kleinschreibung, lässt `None` weg und hebt die erste hervor. `↑` und `↓` verschieben die Hervorhebung.
- `Enter` verknüpft die hervorgehobene Domäne, und ein Klick verknüpft die angeklickte. Beides gibt der Spalte in einem Rückgängig-Schritt den Datentyp der Domäne und beendet die Bearbeitung. `None` hebt die Verknüpfung der Spalte auf und behält ihren Datentyp bei.
- Ihre Eingabe wird nie in die Spalte geschrieben. Solange das Blatt `Domains` keine benannte Domäne enthält, gibt es keine Liste, und `Enter` beendet die Bearbeitung, ohne etwas zu schreiben.

In der Ansicht `Logical Names` öffnet, solange View Option → `Domain` ausgeschaltet ist, eine Typzelle, die den Namen einer Domäne zeigt, diese Auswahl, und eine, die einen Datentyp zeigt, den Editor für Datentypen – siehe [Autovervollständigung für Datentypen](./table-editing.md#datatype-autocomplete). Um eine Spalte ohne Domäne mit einer Domäne zu verknüpfen, schalten Sie die Domänenzelle ein.  
Eine verknüpfte Spalte hat den Datentyp ihrer Domäne und folgt ihm, wenn sich der Typ der Domäne ändert, und die Eingabe eines anderen Typs in ihre Zelle für den Datentyp hebt die Verknüpfung auf – siehe [Domänen und Datentypen](./dictionary.md#domains-and-data-types).

## Außerhalb der Zeichenfläche {#beyond-the-canvas}

Die meisten anderen Stellen, die eine Tabelle oder eine Spalte benennen, folgen ebenfalls der Namensansicht:

- Die Ansicht `Physical Names` zeigt den Namen.
- Die Ansicht `Logical Names` zeigt den logischen Namen oder, solange der logische Name leer ist, den Namen, abgeblendet, wo die Stelle ihn abblenden kann.
- Die Ansicht `Both Names` zeigt den logischen Namen mit dem Namen dahinter: abgeschwächt in einer Textzeile, in einer zweiten Zeile bei einer Beschriftung des Graphen und in Klammern, wo ein einziger Text beides enthalten muss, etwa `Member (member)`. Eine Tabelle oder Spalte ohne logischen Namen zeigt nur ihren Namen.

Eine nach Name sortierte Liste, etwa die Tabellen im Explorer oder die Zeilen von `#` in der Schnellsuche, bleibt in jeder Ansicht nach Name sortiert, nie nach logischem Namen.

Die Stellen, die der Ansicht folgen:

- Auf der Registerkarte Visualisierung die Flow-Karten – siehe [Namen auf den Karten](./visualization.md#names-on-the-cards) – sowie die Beschriftungen und die Hover-Vorschau des Graphen – siehe [Den Graphen lesen](./visualization.md#reading-the-graph) und [Hover-Vorschau](./visualization.md#hover-preview).
- [Tabelleneigenschaften](./table-related-functions.md#table-properties): die Chips und auf der Registerkarte `Indexes` die Zeilen unter `Columns` und die Liste `Index order` – siehe [Indizes](./table-related-functions.md#indexes).
- Die Tabellen- und Spaltenzeilen des [Explorers](./explorer.md#the-tree) und die Tabellen, die unter jeder Tabellengruppe aufgeführt sind.
- Die Zeilen von `#` in der Schnellsuche – siehe [Das Diagramm durchsuchen](./quick-search.md#searching-the-diagram).
- Der Änderungsbaum der [Diff-Ansicht](./table-related-functions.md#diff-viewer) und ihre beiden Seiten.
- Der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) und der Tooltip `<parent> has no primary key to copy`, den `Create new columns` beim Zeichnen einer Beziehung zeigen kann – siehe [Beziehungen erstellen](./editing-start.md#relationship-creation).
- Die Kopie der Zeilen, die beim Ziehen einer Spalte über leerer Zeichenfläche mitgeführt wird und die Namens- und Typzellen jeder Zeile so zeigt, wie die Zeile sie zeigt – siehe [Spalten neu anordnen und verschieben](./table-editing.md#rearranging-and-moving-columns).
- Die Spalte `Target` des Blatts `Checks` der Registerkarte Wörterbuch – siehe [Das Blatt Prüfungen](./dictionary.md#the-checks-sheet).
- Ein [exportiertes Bild](./file-import-export.md#image).

Einige Stellen behalten unabhängig von der Ansicht die Namen bei: die Index- und Fremdschlüsselzeilen des Explorers, die Gruppe `Keys` auf der Registerkarte `Indexes` der Tabelleneigenschaften, `New column: <name>` im Dialog „Spalten zuordnen“ und die Ortsangabe neben einer Zeile von `@` oder `:` in der Schnellsuche.

Die Diff-Ansicht, die [Zeitreise](./undo-redo.md#time-travel), die Vorschau `Force` des [Automatischen Layouts](./table-related-functions.md#auto-layout) und der Dialog `Export image` öffnen sich in der Namensansicht, die Sie gerade sehen, unabhängig davon, welche Ansicht die Datei speichert. Sie behalten diese Ansicht bei, solange sie geöffnet sind.  
Jedes automatische Layout und ein `Import` oder `Import and Add` von Schema SQL, GraphQL, DBML oder AML platzieren die Tabellen in den Breiten, die sie in Ihrer Ansicht haben.

## Nach logischen Namen suchen {#finding-by-logical-name}

Logische Namen werden in jeder Namensansicht gefunden, auch in der Ansicht `Physical Names`, in der die Zeichenfläche keine zeigt:

- [Suchen und Ersetzen](./find-and-replace.md#what-it-searches) durchsucht sie als eine Textart, `Logical names`, für Tabellen und Spalten gleichermaßen, und diese ist eingeschaltet, wenn sich die Suche zum ersten Mal öffnet. Das Ersetzen eines logischen Namens leitet daraus den physischen Namen ab, wie es auch das Eingeben eines logischen Namens tut.
- In der [Schnellsuche](./quick-search.md#searching-the-diagram) findet `#` eine Tabelle über ihren Namen oder ihren logischen Namen, und `@` findet eine Spalte über beides, wobei ein Treffer im logischen Namen `Logical name` daneben zeigt. Der Tabellenteil von `@` vor dem `.` passt ebenfalls auf den Namen oder den logischen Namen einer Tabelle.

Ein Wechsel der Namensansicht ändert, wie die Ergebnisse benannt werden, nie, was gefunden wird.

## Mitbearbeiter {#collaborators}

In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) erreichen logische Namen und Domänenverknüpfungen jeden Editor wie jede andere Änderung.  
Solange die Sperre `Name View` eingeschaltet ist, behält jeder Editor seine eigene Ansicht, und ein Wechsel ist nur in dem Editor zu sehen, in dem er vorgenommen wurde. Solange sie ausgeschaltet ist, schaltet ein Wechsel in einem beliebigen nicht schreibgeschützten Editor alle Editoren um – siehe [Sperren](./settings.md#lock), wo auch beschrieben wird, was das Ein- oder Ausschalten der Sperre mit der Ansicht jedes Editors macht.  
Ist die fokussierte Zelle eines Teilnehmers eine, die Ihre Ansicht nicht zeigt, erscheint seine Farbe auf der Zelle, die Ihre Ansicht an ihrer Stelle zeigt: Eine Namenszelle in der Ansicht `Physical Names` erscheint auf Ihrer Zelle des logischen Namens in der Ansicht `Logical Names` und umgekehrt, und eine Typzelle und die Domäne, die für sie steht, werden auf dieselbe Weise einander zugeordnet.

Ein Coding-Agent, der über den MCP-Server arbeitet, setzt logische Namen und verknüpft Domänen unabhängig davon, welche Ansicht Sie gerade sehen, und hat kein Tool, das die Namensansicht wechselt – siehe [Wörterbücher](../../mcp/tools.md#dictionaries) und [Einstellungen](../../mcp/tools.md#settings).

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit [`readonly`](../../api/erd-editor-element.md#readonly) funktioniert jede Auswahl der Namensansicht: die Schaltfläche `Name View` der Symbolleiste der Zeichenfläche, `Name View` im Kontextmenü der Zeichenfläche und in der Schnellsuche sowie die Liste in der Symbolleiste von Flow.  
Ein Wechsel dort ändert unabhängig von der Sperre nur diesen Bildschirm: Die Datei, Mitbearbeiter und der Verlauf behalten die Ansicht, wie sie war. Sobald der Editor wieder beschreibbar wird, bleibt die gewählte Ansicht auf diesem Bildschirm bis zum nächsten Wechsel dort oder, solange die Sperre ausgeschaltet ist, bis ein Mitbearbeiter sie wechselt oder das Dokument neu geladen wird.  
Logische Namen und Domänen lassen sich dort nicht bearbeiten, sodass sich weder ein Zelleneditor noch eine Begriffsliste oder Domänenauswahl öffnet und keiner der Einträge `Derive Physical Name Again` und `Derive Physical Names Again` angeboten wird.  
View Option → `Domain` blendet die Domänenzelle nur auf diesem Bildschirm ein oder aus, wie jede [Ansichtsoption](./table-related-functions.md#table-view-options) dort, und wenn der Editor wieder beschreibbar wird, kommen die Ansichtsoptionen zurück, die das Dokument enthält.
