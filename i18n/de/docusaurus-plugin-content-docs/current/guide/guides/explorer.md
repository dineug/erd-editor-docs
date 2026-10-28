---
sidebar_position: 9
description: Die Tabellen des Diagramms mit ihren Spalten, Indizes und Fremdschlüsseln, seine Tabellengruppen und seine Notizen in einem neben der ERD-Zeichenfläche angedockten Baum durchsehen und mit einem Klick zu jedem davon wechseln.
---

# Explorer

Der Explorer ist ein Bereich, der am linken Rand der ERD-Zeichenfläche angedockt ist und das Diagramm als Baum auflistet: seine Tabellen, jede mit ihren Spalten, Indizes und Fremdschlüsseln, dann seine [Tabellengruppen](./table-groups.md), dann seine Notizen. Klicken Sie auf eine Zeile, um zu dem zu wechseln, wofür sie auf der Zeichenfläche steht.  
Der Explorer macht die Zeichenfläche schmaler, statt sie zu verdecken. Er ist Teil des Diagrammeditors, nicht die Explorer-Ansicht von VS Code oder der Datei-Explorer von Obsidian.

![Den Explorer über die Symbolleiste öffnen, zu products wechseln, dann zur Spalte status und zum Fremdschlüssel member_id von orders, mit Collapse All einklappen, den Bereich verbreitern und ihn schließen](/img/demo-explorer.webp)

[Suchen und Ersetzen](./find-and-replace.md) befindet sich an seinem oberen Rand, zwischen seiner Titelleiste und dem Baum. Solange das Suchfeld Text enthält, zeigt der Baum nur, was dem Suchbegriff entspricht – siehe [Die Ergebnisse](./find-and-replace.md#the-results).  
Der Baum selbst ändert das Diagramm nie: Er bietet weder Umbenennen noch Ziehen, Löschen oder Ein- und Ausblenden. Eine Ersetzung ist die einzige Änderung, die der Bereich vornimmt.

Der eigene Zustand des Explorers gehört allein Ihnen: ob er geöffnet ist, seine Breite, welche Zeilen eingeklappt sind, die Zeile, auf der der Tastaturfokus liegt, wohin er gescrollt ist, und die Suche.  
Nichts davon wird in der Datei gespeichert, im Verlauf aufgezeichnet, mit Mitbearbeitern geteilt oder im Browser abgelegt. Der Zustand bleibt erhalten, solange der Editor geöffnet bleibt, auch beim Wechsel der Registerkarte und über Dokumente hinweg, die in denselben Editor geladen werden. Ein neu geöffneter Editor startet mit geschlossenem Explorer.

## Öffnen und Schließen {#opening-and-closing}

Öffnen Sie ihn auf eine dieser Arten:

- Die Schaltfläche `Explorer` in der Symbolleiste, direkt nach `Search`, mit einem Baumsymbol. Ihr Tooltip lautet `Explorer (Ctrl + F)` (Windows/Linux) oder `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac), auf der Registerkarte [Tastenkombinationen](./settings.md#shortcuts) der Einstellungen als `Toggle Explorer` bezeichnet.
- `Toggle Explorer` in der [Schnellsuche](./quick-search.md), auf jeder Registerkarte aufgeführt. Wenn Sie `find`, `replace`, `rename`, `tree`, `outline` oder `objects` eingeben, erscheint der Eintrag.
- `Toggle Explorer` im Kontextmenü der Zeichenfläche: Klicken Sie mit der rechten Maustaste auf eine leere Stelle der ERD-Zeichenfläche außerhalb jeder [Tabellengruppe](./table-groups.md). Der Eintrag steht nach `New Table`, `New Memo` und `New Table Group` und vor `Relationship`. Das Zeichenflächenmenü eines schreibgeschützten Editors hat keinen solchen Eintrag – siehe [Schreibgeschützte Editoren](#read-only-editors).

Die beiden Einträge `Toggle Explorer` zeigen rechts die Tastenkombination an.  
Die Schaltfläche in der Symbolleiste, die Tastenkombination und der Eintrag in der Schnellsuche funktionieren auf jeder Registerkarte. Auf der Registerkarte Visualisierung, Schema SQL, Codegenerator, Wörterbuch oder Einstellungen wechseln sie zuerst zur Registerkarte ERD, da der Explorer nur dort angezeigt wird.

Die Schaltfläche in der Symbolleiste öffnet und schließt nur den Bereich. Sie setzt den Textcursor nicht in das Suchfeld und lässt die Tabelleneigenschaften, die Designauswahl und die Sprachauswahl `Display Language` geöffnet.  
Die Tastenkombination und die beiden Einträge `Toggle Explorer` öffnen den Explorer direkt in seiner Suche: Der Textcursor springt in das Suchfeld, dessen Text ausgewählt wird, und jeder der fünf Dialoge aus [Dialoge neben dem Explorer](#dialogs-beside-it) wird geschlossen. Was die Suche von einem Öffnen zum nächsten behält, steht unter [Öffnen und Schließen](./find-and-replace.md#opening-and-closing) in Suchen und Ersetzen.  
Die Tastenkombination bewirkt nichts, solange eine Tabellenzelle, eine Notiz oder der Name einer Tabellengruppe bearbeitet wird oder solange auf der Registerkarte [Wörterbuch](./dictionary.md#keys-on-the-tab) eine Zellbearbeitung geöffnet ist, einschließlich der Domänenliste eines Begriffs.

Die Schaltfläche in der Symbolleiste erscheint gedrückt, solange der Explorer auf der Registerkarte ERD geöffnet und nicht durch den [Zen-Modus](#when-it-stands-aside) ausgeblendet ist. Solange das der Fall ist, schließen die Schaltfläche, die Tastenkombination und jeder der beiden Einträge `Toggle Explorer` den Explorer, und lag der Tastaturfokus im Bereich, geht er an den Editor zurück.  
Solange die Schnellsuche oder einer der fünf Dialoge geöffnet ist, schließt die Tastenkombination den Explorer nie. Stattdessen schließt sie die Palette oder den Dialog und bringt den Tastaturfokus in das Suchfeld, wobei dessen Text ausgewählt wird und, falls der Explorer bereits angezeigt wurde, der aktuelle Treffer erhalten bleibt. Der Eintrag `Toggle Explorer` in der Schnellsuche macht keine solche Ausnahme: Wird er ausgeführt, schließt er die Palette und danach einen geöffneten Explorer.

Die Schaltfläche `x` in der Titelleiste, deren Tooltip `Close` lautet, schließt den Explorer ebenfalls und gibt den Tastaturfokus an die Zeichenfläche. `Escape` schließt ihn nicht – siehe [Tasten im Explorer](#keys-in-the-explorer).  
Beim erneuten Öffnen erscheint der Explorer in derselben Breite, mit dem Baum so eingeklappt und gescrollt wie zuvor und mit demselben Suchbegriff. Wird er über die Tastenkombination oder einen Eintrag `Toggle Explorer` geöffnet, sucht er erneut nach diesem Suchbegriff und klappt dabei jedes Ergebnis aus – siehe [Die Ergebnisse](./find-and-replace.md#the-results).

Wenn die Tastenkombination oder ein Eintrag `Toggle Explorer` den Explorer in einem Editor öffnet, der dafür zu schmal ist, erscheint die Meldung `Widen the window to show the Explorer`, und der Tastaturfokus bleibt, wo er war – siehe [Neben der Zeichenfläche](#beside-the-canvas).  
Der Explorer ist trotzdem geöffnet, mit gedrückter Schaltfläche in der Symbolleiste, und erscheint mit bereits ausgeführter Suche, sobald der Editor breit genug ist, ohne den Tastaturfokus zu übernehmen. Wird er über die Schaltfläche in der Symbolleiste geöffnet, erscheint keine Meldung.

## Neben der Zeichenfläche {#beside-the-canvas}

Der Explorer verläuft am linken Rand der Registerkarte ERD unterhalb der Symbolleiste über die volle Höhe der Zeichenfläche.  
Die Zeichenfläche wird schmaler, um Platz für ihn zu schaffen, sodass kein Teil des Diagramms unter dem Bereich liegt, und die [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar), die Minimap und der [Willkommensbildschirm](./editing-start.md#welcome-screen) liegen alle in der Zeichenfläche neben ihm.  
Das Öffnen, Schließen oder Ändern der Größe des Explorers scrollt das Diagramm nicht und zeichnet nichts im [Verlauf](./undo-redo.md#what-the-history-records) auf.

In einem neu geöffneten Editor ist er anfangs `260px` breit. Ziehen Sie seinen rechten Rand, um ihn auf einen beliebigen Wert von `200px` bis `480px` zu setzen, oder doppelklicken Sie auf den Rand, um zu `260px` zurückzukehren.

Die Zeichenfläche behält neben dem Explorer immer mindestens `320px`:

- In einem Editor, der schmaler ist als die Breite des Explorers plus `320px`, wird der Explorer schmaler gezeichnet, damit er passt, bis hinunter auf `200px`.
- In einem Editor, der schmaler als `520px` ist, zieht er sich zurück. Er wird nicht gezeichnet, bleibt aber geöffnet, daher erscheint die Schaltfläche in der Symbolleiste weiterhin gedrückt, und ein Druck darauf schließt ihn. Sobald der Editor breit genug ist, kehrt er in seiner eigenen Breite zurück.

Maßgeblich ist die Breite des Editors selbst, nicht die des Browserfensters, auch wenn die Meldung aus [Öffnen und Schließen](#opening-and-closing) vom Fenster spricht.

In einer [Anzeigesprache mit Schreibrichtung von rechts nach links](./language-and-theme.md#right-to-left-languages) bleibt der Explorer links von der Zeichenfläche, da die Zeichenfläche nie gespiegelt wird.  
Sein Inhalt verläuft von rechts nach links: Die Titelleiste, die Suche und die Zeilen werden gespiegelt, und Zeilen werden von rechts eingerückt. Der Rand, den Sie ziehen, bleibt auf seiner rechten Seite, an der Zeichenfläche. Datentypen, Indexspalten und Fremdschlüsseltext behalten ihre Reihenfolge von links nach rechts.

## Wann der Explorer ausgeblendet wird {#when-it-stands-aside}

Der Explorer wird nur auf der Registerkarte ERD angezeigt.  
Der Wechsel zu einer anderen Registerkarte blendet ihn aus, und die Schaltfläche in der Symbolleiste erscheint nicht mehr gedrückt. Zurück auf der Registerkarte ERD wird er wieder so angezeigt, wie Sie ihn verlassen haben, genauso eingeklappt und gescrollt.

Solange die [Diff-Ansicht](./table-related-functions.md#diff-viewer), die [Zeitreise](./undo-redo.md#time-travel) oder die Vorschau des [Automatischen Layouts](./table-related-functions.md#auto-layout) geöffnet ist, kann nichts den Explorer öffnen oder schließen:

- Ein geöffneter Explorer wird ausgeblendet und erscheint wieder, sobald sie geschlossen werden.
- Die Schaltfläche in der Symbolleiste ist abgeblendet und bewirkt nichts.
- Die Schnellsuche bietet `Toggle Explorer` nicht an.
- Die Tastenkombination wird dem Browser oder Host überlassen – siehe [Die Suchleiste des Browsers](./find-and-replace.md#the-browsers-find-bar).

Die Diff-Ansicht listet ihre Änderungen in einem Baum derselben Art auf – siehe [Diff-Ansicht](./table-related-functions.md#diff-viewer).

Das Einschalten des [Zen-Modus](./table-related-functions.md#canvas-toolbar) mit `Alt + Z` (Windows/Linux) oder `⌥ + Z` (Mac) blendet einen geöffneten Explorer aus, ohne ihn zu schließen, und das Ausschalten des Zen-Modus bringt den Explorer zurück.  
Im Zen-Modus öffnen die Tastenkombination und die beiden Einträge `Toggle Explorer` den Explorer weiterhin direkt in seiner Suche, und der Zen-Modus bleibt eingeschaltet. Der Explorer verläuft dann über die volle Höhe des Editors, da die obere Symbolleiste fehlt, und bleibt eingeblendet, wenn der Zen-Modus ausgeschaltet wird. Erneutes Einschalten des Zen-Modus blendet ihn wieder aus.

Immer wenn der Bereich verschwindet, während der Tastaturfokus darin liegt, ob geschlossen, ausgeblendet oder zurückgezogen, kehrt der Tastaturfokus zum Editor zurück.

## Der Baum {#the-tree}

In der Titelleiste steht `Explorer`, und sie enthält zwei Schaltflächen: `Collapse All` und das `x`, das den Explorer schließt. Darunter liegt die Suche – siehe [Suchen und Ersetzen](./find-and-replace.md) – und darunter der Baum.

Die oberste Ebene enthält drei Ordner in dieser Reihenfolge: `Tables`, `Table Groups` und `Memos`. Unter jeder Tabelle liegen ihre eigenen Ordner `Columns`, `Indexes` und `Foreign Keys`.  
Ein Ordner ohne Inhalt wird nicht angezeigt, daher zeigt ein leeres Diagramm überhaupt keine Zeilen. `Table Groups` entfällt außerdem, solange [View Option](./table-related-functions.md#table-view-options) → `Table Groups` die Gruppen ausblendet, und `Memos`, solange View Option → `Memos` die Notizen ausblendet.  
Eine Ordnerzeile zeigt ein Ordnersymbol, ihren Namen und ganz am Ende die Anzahl der Zeilen direkt darunter, sodass die Zahl neben `Tables` die Anzahl der Tabellen im Diagramm ist. Die Zahl gruppiert ihre Tausender so, wie es die Anzeigesprache tut, immer mit den Ziffern 0 bis 9, etwa `1,234` auf Englisch und `1.234` auf Deutsch.

Tabellen werden nach Namen sortiert aufgelistet, ohne Beachtung der Groß-/Kleinschreibung, und Tabellen mit demselben Namen behalten die Reihenfolge des Dokuments. Tabellengruppen werden ebenso aufgelistet, und ebenso die Tabellen unter jeder Gruppe. Die Spalten einer Tabelle behalten die eigene Reihenfolge der Tabelle, und ihre Indizes, ihre Fremdschlüssel und die Notizen behalten die des Dokuments.  
Der Baum folgt dem Diagramm, während es sich ändert, sei es durch eine Änderung auf der Zeichenfläche, ein Rückgängigmachen oder Wiederholen, einen Import oder durch einen Mitbearbeiter oder einen Coding-Agenten, daher verschiebt das Umbenennen einer Tabelle ihre Zeile.  
Die Reihenfolge richtet sich in jeder [Namensansicht](./logical-names.md#name-view) nach dem Namen, nie nach dem logischen Namen. Ein Wechsel der Ansicht beschriftet die Tabellen- und Spaltenzeilen neu, ohne eine davon zu verschieben, ebenso wie das Vergeben eines logischen Namens an eine Tabelle oder Spalte in der Ansicht `Logical Names` oder `Both Names`. Ein physischer Name, der aus einem neuen logischen Namen [abgeleitet](./dictionary.md#deriving-physical-names) wird, ist jedoch eine Umbenennung wie jede andere und kann daher die Zeile einer Tabelle verschieben.

Jede Art von Zeile zeigt:

- Eine Tabelle: ein Tabellensymbol und ihren Namen.
- Eine Spalte: ein Schlüsselsymbol für eine Primärschlüssel- oder Fremdschlüsselspalte, in der Farbe, in der die eigene Schlüsselzelle der Tabelle einen Primärschlüssel, einen Fremdschlüssel oder beides darstellt, und ein Listensymbol für jede andere Spalte. Dann ihren Namen und, abgeschwächt, ihren Datentyp, gefolgt von `PK`, `FK` oder beidem, etwa `id` `BIGINT PK` oder `user_id` `BIGINT FK`. Der angezeigte Typ ist unabhängig von der Namensansicht immer der Datentyp der Spalte, nie ihre [Domäne](./logical-names.md#the-domain-cell).
- Ein Index: ein Indexsymbol und seinen Namen. Dann, abgeschwächt, `UNIQUE` für einen eindeutigen Index und seine Spalten in Klammern in Indexreihenfolge, mit `DESC` nach einer absteigenden Spalte, etwa `orders_user_idx` `UNIQUE (user_id DESC, total)` oder nur `(total)`.
- Ein Fremdschlüssel: nur unter der Kindtabelle aufgeführt, derjenigen, die die Fremdschlüsselspalten enthält, und nur, solange die Elterntabelle im Diagramm ist. Sein Schlüsselsymbol übernimmt die Farbe der Verbindungslinie: die Farbe für Primär- und Fremdschlüssel bei einer [identifizierenden Beziehung](./relationship-editing.md#identifying-relationships), sonst die Fremdschlüsselfarbe. Er zeigt die Schlüsselspalten der Kindtabelle, durch Kommas getrennt, dann, abgeschwächt, `→` mit der Elterntabelle und ihren Spalten, etwa `user_id` `→ users(id)`.
- Eine Tabellengruppe: einen Punkt in der Farbe der Gruppe, grau bei einer Gruppe ohne Farbe, und ihren Namen. Ihre Tabellen werden darunter nach Namen aufgelistet, und jeder dieser Einträge wechselt zu seiner Tabelle. Eine Gruppe ohne Tabellen hat nichts zum Ausklappen.
- Eine Notiz: ein Haftnotizsymbol und die erste Zeile der Notiz.

Tabellenzeilen, die unter einer Gruppe aufgeführten Tabellen und Spaltenzeilen folgen der Namensansicht – siehe [Außerhalb der Zeichenfläche](./logical-names.md#beyond-the-canvas). In der Ansicht `Both Names` lautet eine Spaltenzeile zum Beispiel `Total Amount` `total` `NUMERIC`: der logische Name, dann der Name und der Datentyp, beide abgeschwächt.  
In jeder Ansicht zeigen Index- und Fremdschlüsselzeilen ihre Spalten mit deren Namen, und eine Fremdschlüsselzeile zeigt auch ihre Elterntabelle mit deren Namen.  
Solange das Suchfeld Text enthält, zeigt eine Zeile, die nur in dem Namen gefunden wurde, den ihre Ansicht auslässt, auch diesen Namen, abgeschwächt – siehe [Die Ergebnisse](./find-and-replace.md#the-results).

Ein leerer Name oder eine Notiz, deren erste Zeile leer ist, erscheint kursiv als `unnamed`. In den Ansichten `Logical Names` und `Both Names` erscheint eine Tabelle oder Spalte nur dann als `unnamed`, wenn auch ihr logischer Name leer ist.  
In einem schmalen Bereich wird zuerst der abgeschwächte Text mit `…` gekürzt und erst dann der Name, mit dem die Zeile beginnt. Zeigen Sie mit dem Zeiger auf einen Namen oder seinen abgeschwächten Text, um ihn vollständig zu sehen.

Anfangs ist nur `Tables` ausgeklappt. Klicken Sie auf eine Ordnerzeile oder drücken Sie darauf `Enter` oder `Space`, um sie ein- oder auszuklappen.  
Der Pfeil am Anfang einer Zeile klappt diese Zeile ein oder aus, ohne irgendwohin zu wechseln. Jede Tabellenzeile hat einen, auch eine Tabelle ohne Inhalt darunter. `→` und `←` klappen ebenfalls ein und aus – siehe [Tasten im Explorer](#keys-in-the-explorer).  
`Collapse All` klappt bei jedem Druck eine Ebene ein: die tiefste Ebene sichtbarer ausgeklappter Zeilen, sodass wiederholtes Drücken von unten nach oben einklappt. Der Druck, der die oberste Ebene erreicht, klappt jede Zeile ein, auch die unter einer bereits eingeklappten Zeile, und lässt nur die Ordner der obersten Ebene übrig.  
Änderungen, Rückgängigmachen und Wiederholen sowie Änderungen durch Mitbearbeiter oder einen Coding-Agenten lassen ein- und ausgeklappte Zeilen, wie sie sind.

## Zu einer Zeile wechseln {#going-to-a-row}

Klicken Sie auf eine Zeile oder drücken Sie `Enter` oder `Space`, während der Tastaturfokus darauf liegt, um zu dem zu wechseln, wofür sie auf der ERD-Zeichenfläche steht. Eine Ordnerzeile klappt nur ein oder aus, und die Pfeiltasten bewegen sich nur innerhalb des Baums.

- Eine Tabellenzeile oder eine unter einer Gruppe aufgeführte Tabelle wählt allein diese Tabelle aus und holt sie in den Vordergrund. Sofern die fokussierte Zelle nicht bereits in dieser Tabelle liegt, wechselt sie zur ersten Zelle des Tabellenkopfs: zum Namen oder, in den Ansichten `Logical Names` und `Both Names`, zum logischen Namen.
- Eine Spaltenzeile wählt allein ihre Tabelle aus und setzt die fokussierte Zelle auf den Namen der Spalte oder, in der Ansicht `Logical Names`, auf den logischen Namen, der an seiner Stelle gezeigt wird.
- Eine Indexzeile wählt ihre Tabelle aus, wie eine Tabellenzeile. Der Index selbst wird nicht eigens markiert; Indizes werden in den [Tabelleneigenschaften](./table-related-functions.md#indexes) bearbeitet.
- Eine Fremdschlüsselzeile holt beide Tabellen der Beziehung gemeinsam in den sichtbaren Bereich oder, wenn die beiden zu weit auseinanderliegen, um zusammen angezeigt zu werden, die Kindtabelle. Sie wählt allein die Kindtabelle mit ihren Fremdschlüsselspalten aus, setzt die fokussierte Zelle auf die erste davon und hebt die Verbindungslinie der Beziehung hervor – siehe [Verbindungslinien lesen](./relationship-editing.md#reading-a-connector).
- Eine Tabellengruppenzeile holt den Rahmen der Gruppe, ausgerichtet an seiner Titelleiste, in den sichtbaren Bereich, wählt allein die Gruppe aus und holt sie mit ihren Tabellen in den Vordergrund.
- Eine Notizzeile wählt allein die Notiz aus und holt sie in den Vordergrund.

Die Ansicht bewegt sich nach der Regel, die für jeden Sprung gilt: Der Zoom ändert sich nie, und die Zeichenfläche scrollt nur, wenn das, wozu Sie wechseln, nicht bereits gut zu sehen ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands).  
Das Wechseln zu einer Zeile schließt zuerst die Tabelleneigenschaften, falls sie geöffnet sind, und startet oder beendet nie eine Beziehung, die gerade gezeichnet wird.  
Solange das Suchfeld Text enthält, wechselt eine Zeile, deren Name oder logischer Name einen Treffer enthält, oder eine, die einen Auszug aus einem Kommentar oder einer Notiz zeigt, stattdessen zu ihrem ersten Treffer – siehe [Zu einem Treffer wechseln](./find-and-replace.md#going-to-a-match).

Nach einem Klick bleibt der Tastaturfokus im Baum, daher erreichen `Delete`, `Backspace` und die anderen Bearbeitungstasten die neue Auswahl erst, wenn Sie `Escape` drücken oder auf die Zeichenfläche klicken – siehe [Tasten im Explorer](#keys-in-the-explorer).

## Tasten im Explorer {#keys-in-the-explorer}

Der Baum ist für die Taste `Tab` ein einziger Haltepunkt und wird übersprungen, solange er keine Zeilen hat.  
Wenn Sie mit der Tabulatortaste hineinwechseln, landen Sie auf der Zeile, auf der zuletzt der Tastaturfokus lag, andernfalls auf der Zeile des aktuellen Treffers oder auf der ersten vollständig sichtbaren Zeile, und diese Zeile wird in den sichtbaren Bereich gescrollt. Die Zeile mit dem Tastaturfokus wird wie eine Zeile unter dem Zeiger dargestellt.

Im Baum:

- `↑` und `↓` bewegen den Fokus um eine Zeile und bleiben an der ersten und der letzten Zeile stehen, statt zum anderen Ende zu springen. `Home` und `End` wechseln zur ersten und zur letzten Zeile.
- `→` klappt eine eingeklappte Zeile aus oder wechselt zur ersten untergeordneten Zeile einer ausgeklappten Zeile. `←` klappt eine ausgeklappte Zeile ein oder wechselt hinaus zu ihrer übergeordneten Zeile. In einer Anzeigesprache mit Schreibrichtung von rechts nach links tauschen die beiden ihre Rollen.
- `Enter` und `Space` wirken wie ein Klick: Sie wechseln zur Zeile oder klappen einen Ordner ein oder aus – siehe [Zu einer Zeile wechseln](#going-to-a-row).
- Die Eingabe eines Buchstabens springt zu keiner Zeile.

Ein Druck auf `Escape` an einer beliebigen Stelle im Explorer (im Baum, im Such- oder Ersetzungsfeld oder auf einer seiner Schaltflächen) gibt den Tastaturfokus an die Zeichenfläche zurück. Der Explorer bleibt geöffnet, und die Auswahl bleibt, wie sie ist.  
Ein `Escape`, das das Zusammensetzen einer Eingabemethode beendet, beendet nur das Zusammensetzen. `Escape` schließt den Explorer nie, ob die Taste im Explorer oder auf der Zeichenfläche gedrückt wird.

Einige Tastenkombinationen des Editors funktionieren weiterhin, während der Tastaturfokus im Explorer liegt – siehe [Tastenkombinationen](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) funktioniert wie auf der Zeichenfläche: Die Kombination schließt den Explorer oder schließt, solange die Tabelleneigenschaften daneben geöffnet sind, die Tabelleneigenschaften und setzt den Textcursor in das Suchfeld – siehe [Öffnen und Schließen](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac) öffnet oder schließt die Schnellsuche.
- `Undo` und `Redo` machen Schritte im Diagramm rückgängig oder wiederholen sie, nicht im Text eines Felds.
- `Zoom In`, `Zoom Out` und `Zoom Reset` ändern den Zoom der Zeichenfläche.

Jede andere Tastenkombination des Editors bleibt im Explorer, ebenso die Pfeiltasten, `Tab`, `Enter`, `Space`, `Home`, `End` und jede Taste, die gedrückt wird, während eine Eingabemethode Zeichen zusammensetzt.  
Keine davon erreicht die Zeichenfläche: `Delete` und `Backspace` löschen nie die Auswahl, `Alt + N` (Windows/Linux) oder `⌥ + N` (Mac) fügt keine Tabelle hinzu, und `T` und dann `G` gruppiert nichts. In einem Feld wirken sie wie gewöhnliche Texttasten: `Ctrl + A` (Windows/Linux) oder `⌘ + A` (Mac) wählt den Text des Felds aus, `Delete` und `Backspace` löschen Text, und `Space` gibt ein Leerzeichen ein. `Tab` wechselt zwischen den Schaltflächen, den Feldern und dem Baum des Explorers.  
Die Tasten des Such- und des Ersetzungsfelds selbst werden in [Tasten in den Suchfeldern](./find-and-replace.md#keys-in-the-search-fields) beschrieben.  
Tasten, die der Editor nicht belegt, etwa das Speichern oder die Befehlspalette des Hosts, erreichen den Host wie gewohnt.

## Dialoge neben dem Explorer {#dialogs-beside-it}

Die [Tabelleneigenschaften](./table-related-functions.md#table-properties), die [Designauswahl](./language-and-theme.md#theme), die Sprachauswahl [`Display Language`](./language-and-theme.md#picking-a-language), der Dialog [`Export image`](./file-import-export.md#image) und der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) lassen den Explorer geöffnet, wenn sie sich öffnen.

- Die Tabelleneigenschaften öffnen sich in der Mitte der Zeichenfläche neben dem Explorer und dunkeln nur die Zeichenfläche ab. Der Explorer bleibt benutzbar: Das Wählen einer Zeile schließt die Tabelleneigenschaften und wechselt dann zur Zeile.
- Die Dialoge `Export image` und „Spalten zuordnen“ dunkeln den gesamten Editor ab, einschließlich der Symbolleiste und des Explorers. Der Explorer bleibt unter dem abgedunkelten Bereich geöffnet, und ein Klick dort schließt den Dialog, wie ein Klick an einer beliebigen Stelle des abgedunkelten Bereichs; der Dialog „Spalten zuordnen“ wird dann geschlossen, ohne etwas zuzuordnen.
- In einer Anzeigesprache mit Schreibrichtung von links nach rechts öffnen sich die Designauswahl und die Sprachauswahl `Display Language` direkt neben dem Explorer statt darüber und rücken mit, wenn er sich öffnet oder schließt, während sie angezeigt werden. In einer Sprache mit Schreibrichtung von rechts nach links behalten sie ihren Platz rechts. Ein Druck in den Explorer schließt sie, wie es jeder Druck außerhalb von ihnen tut, mit Ausnahme eines Drucks auf die Symbolleiste.

Das Öffnen der Suche über die Tastenkombination oder einen Eintrag `Toggle Explorer` schließt alle fünf, wobei der Dialog „Spalten zuordnen“ nichts zuordnet.  
Die [Schnellsuche](./quick-search.md) lässt den Explorer ebenfalls geöffnet, und `Escape` schließt dann nur die Palette.

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit [`readonly`](../../api/erd-editor-element.md#readonly) funktioniert der Explorer wie in jedem anderen: die Schaltfläche in der Symbolleiste mit demselben Tooltip, die Tastenkombination, der Eintrag `Toggle Explorer` in der Schnellsuche, der Baum, das Ein- und Ausklappen und `Collapse All`. Auch dort lautet sein Titel `Explorer`. Das Kontextmenü der Zeichenfläche hat dort kein `Toggle Explorer`, da es nur die Einträge behält, die lesen – siehe [Schreibgeschützte Editoren](./table-related-functions.md#read-only-editors).

Das Wechseln zu einer Zeile funktioniert wie unter [Zu einer Zeile wechseln](#going-to-a-row): Die Ansicht bewegt sich nach derselben Regel, und die Tabelle, Tabellengruppe oder Notiz der Zeile wird ausgewählt, auf der Zeichenfläche umrandet, mit der fokussierten Zelle dort, wo die Zeile sie hinsetzt.  
Das ist der einzige Weg, auf dem ein schreibgeschützter Editor etwas auswählt. Ein Druck auf die Zeichenfläche wählt nichts aus, und ein Klick ohne Bewegung hebt die Auswahl auf, die eine Zeile hinterlassen hat. Eine ausgewählte Tabelle öffnet sich mit `Alt + Space` (Windows/Linux) oder `⌥ + Space` (Mac) in den [Tabelleneigenschaften](./table-related-functions.md#table-properties), nur lesbar, und `Ctrl + C` (Windows/Linux) oder `⌘ + C` (Mac) kopiert wie in jedem Editor, was sie ausgewählt hat.  
Seine Suche dient nur dem Finden – siehe [Schreibgeschützte Editoren](./find-and-replace.md#read-only-editors) in Suchen und Ersetzen.
