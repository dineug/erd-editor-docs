---
sidebar_position: 10
description: Namen von Tabellen, Spalten, Indizes und Tabellengruppen, logische Namen, Kommentare und Notizen oben im Explorer durchsuchen, die Treffer im Baum und auf der Zeichenfläche nacheinander durchgehen und einen oder alle Treffer ersetzen.
---

# Suchen und Ersetzen

Sucht Text im gesamten Diagramm, führt Sie zu jedem Treffer auf der ERD-Zeichenfläche und ersetzt einen oder alle Treffer.  
Durchsucht werden acht Textarten: Tabellennamen, Tabellenkommentare, Spaltennamen, Spaltenkommentare, Notizen, Indexnamen, Tabellengruppennamen und die [logischen Namen](./logical-names.md) von Tabellen und Spalten – siehe [Was durchsucht wird](#what-it-searches).

Suchen und Ersetzen befindet sich oben im [Explorer](./explorer.md), dem links an die ERD-Zeichenfläche angedockten Bereich, zwischen der Titelleiste des Explorers und seinem Baum. Es hat keinen eigenen Titel. Von oben nach unten enthält es:

- Das Suchfeld, mit den drei [Optionen](#options) innen an seinem Ende, und davor den Pfeil `Toggle Replace`.
- Die Zeile `Replace`, anfangs eingeklappt – siehe [Ersetzen](#replacing).
- Den Zähler, dann die Pfeile nach oben und unten, mit denen Sie die Treffer nacheinander durchgehen, und die Schaltfläche `Search In` mit den drei Punkten.
- Die [Textarten](#what-it-searches), die `Search In` ausklappt.

Solange das Suchfeld Text enthält, zeigt der Baum des Explorers die Treffer – siehe [Die Ergebnisse](#the-results).  
Auf einer niedrigen Zeichenfläche behält die Suche ihre volle Höhe, und der Baum darunter nimmt den restlichen Platz ein und scrollt.

![Suchen und Ersetzen im Explorer mit ⌘ + F öffnen, die sechs Treffer für member nacheinander durchgehen und dann mit eingeschaltetem Preserve Case alle sechs durch user ersetzen (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Öffnen und Schließen {#opening-and-closing}

`Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) sowie `Toggle Explorer` in der [Schnellsuche](./quick-search.md) oder im Kontextmenü der Zeichenfläche öffnen den Explorer mit seiner Suche. Der Textcursor springt in das Suchfeld, dessen Text ausgewählt wird, und der Suchbegriff wird erneut gesucht, ohne dass ein Treffer aktuell ist.  
Die Schaltfläche `Explorer` in der Symbolleiste öffnet oder schließt nur den Bereich. Sie setzt den Textcursor nicht in das Suchfeld und lässt den Suchbegriff und den aktuellen Treffer unverändert.  
Wenn die Tastenkombination den Textcursor nur in einen bereits angezeigten Explorer zurückbringt, wie es geschieht, solange die Schnellsuche oder einer der fünf Dialoge aus [Dialoge neben dem Explorer](./explorer.md#dialogs-beside-it) geöffnet ist, bleibt der aktuelle Treffer aktuell.

Wie der Explorer geschlossen wird, was die Tastenkombination und die beiden Einträge `Toggle Explorer` bewirken, während er geöffnet ist, und welche Dialoge sie schließen, wird in [Öffnen und Schließen](./explorer.md#opening-and-closing) auf der Seite zum Explorer beschrieben.  
[Wann der Explorer ausgeblendet wird](./explorer.md#when-it-stands-aside) beschreibt, wie eine andere Registerkarte und der Zen-Modus ihn ausblenden und wie die Diff-Ansicht, die Zeitreise und die Vorschau des Automatischen Layouts ihn ausblenden und sein Öffnen verhindern. [Neben der Zeichenfläche](./explorer.md#beside-the-canvas) beschreibt einen Editor, der zu schmal für ihn ist.

Beim erneuten Öffnen bleibt der letzte Suchbegriff erhalten, ebenso der Ersetzungstext, die [Optionen](#options), die eingeschalteten [Textarten](#what-it-searches) und ob die Zeile `Replace` und die Textarten ausgeklappt waren.  
Sie bleiben erhalten, solange der Editor geöffnet bleibt, und werden nicht im Dokument gespeichert. In einem neu geöffneten Editor sind zu Beginn alle Optionen ausgeschaltet, die Zeile `Replace` und die Textarten eingeklappt und nur die vier Namensarten und `Logical names` eingeschaltet – siehe [Was durchsucht wird](#what-it-searches).

## Die Suchleiste des Browsers {#the-browsers-find-bar}

Solange der Editor den Tastaturfokus hat, gehört `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) auf jeder Registerkarte ihm, auch in seinen eigenen Textfeldern, sodass sich die Suchleiste des Browsers nicht öffnet.  
Die Tastenkombination wird an den Browser oder Host weitergegeben, solange die Diff-Ansicht, die Zeitreise oder die Vorschau des Automatischen Layouts geöffnet ist, sowie dann, wenn der Fokus außerhalb des Editors liegt.

- Web-App und Google Drive: Die Suchleiste des Browsers öffnet sich nur in diesen beiden Fällen.
- VS Code: Die Erweiterung lässt das eigene Such-Widget von VS Code im ERD Editor ausgeschaltet, sodass die Tastenkombination dort nie eines öffnet.
- Obsidian: Die Tastenkombination erreicht immer dann, wenn die Registerkarte des Diagramms aktiv ist, den Editor statt `Search current file` von Obsidian.
- JetBrains-IDE: Wenn die Tastaturbelegung der IDE `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) für sich behält, öffnen Sie die Suche über `Toggle Explorer` in der Schnellsuche oder im Kontextmenü der Zeichenfläche, oder öffnen Sie den Explorer mit der Schaltfläche `Explorer` in der Symbolleiste und klicken Sie in das Suchfeld.

Eine Seite, die den Editor einbettet, kann die Tastenkombination neu belegen oder entfernen – siehe [Tastenkombination ändern](#changing-the-shortcut).

## Was durchsucht wird {#what-it-searches}

Acht Schaltflächen wählen die durchsuchten Textarten aus, in dieser Reihenfolge: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` und `Logical names`.  
Sie sind anfangs eingeklappt. Die Schaltfläche `Search In` am Ende der Zeile mit dem Zähler klappt sie unterhalb dieser Zeile aus und wieder ein und ist hervorgehoben, solange sie angezeigt werden.  
Eine hervorgehobene Schaltfläche einer Textart ist eingeschaltet. Klicken Sie auf eine, um sie ein- oder auszuschalten, und die Suche wird erneut ausgeführt. Sind alle acht ausgeschaltet, wird nichts gefunden.

Die Suche öffnet sich zunächst mit den vier Namensarten `Table names`, `Column names`, `Index names` und `Table group names` sowie mit `Logical names`, sodass ein Umbenennen Kommentare und Notizen nicht erreicht, es sei denn, Sie schalten sie ein.  
`Logical names` ist eine einzige Textart für die logischen Namen von Tabellen und von Spalten gleichermaßen.  
Indexnamen sind die Namen der Indizes auf der Registerkarte `Indexes` der [Tabelleneigenschaften](./table-related-functions.md#indexes), nicht die darüber aufgeführten Schlüssel `PK_` und `UQ_`.

Sonst wird nichts durchsucht: weder Datentypen, die Domäne einer Spalte, Standardwerte, die Spalten eines Index, der Datenbankname, [Schema SQL](./schema-sql.md) mit seinen Skripten `Before tables` und `After tables`, generierter Code noch die Blätter der Registerkarte [Wörterbuch](./dictionary.md), die eine [eigene Suche](./dictionary.md#searching) haben.  
Logische Namen werden unabhängig davon durchsucht, was die [Namensansicht](./logical-names.md#name-view) zeigt, auch in der Ansicht `Physical Names`, in der die Zeichenfläche keine anzeigt. Auch ein Kommentar, der durch eine [Ansichtsoption für Tabellen](./table-related-functions.md#table-view-options) ausgeblendet ist, wird trotzdem durchsucht. Mit View Option → `Memos` ausgeblendete Notizen und mit View Option → `Table Groups` ausgeblendete [Tabellengruppen](./table-groups.md#hiding-groups) werden nicht durchsucht, auch wenn ihre Schaltfläche eingeschaltet ist, sodass `Replace All` nie eine Notiz umschreibt oder eine Gruppe umbenennt, die Sie nicht sehen können.

## Optionen {#options}

Drei Schalter innen am Ende des Suchfelds ändern, wie der Suchbegriff abgeglichen wird. Ihre Namen stehen in ihren Tooltips, und sie sind hervorgehoben, solange sie eingeschaltet sind. Alle drei sind anfangs ausgeschaltet, und das Umschalten eines davon löst eine erneute Suche aus.

- `Match Case`: Ist diese Option ausgeschaltet, erfolgt der Abgleich ohne Beachtung der Groß-/Kleinschreibung.
- `Match Whole Word`: Ein Treffer zählt nur dort, wo er auf keiner Seite in ein Wort übergeht. Buchstaben, Ziffern und kombinierende Zeichen jeder Schrift gelten als Wortzeichen, ebenso der Unterstrich. `user` wird daher in `user id` und `user.id` gefunden, aber nicht innerhalb von `users`, `user_id` oder `superuser`. Ein Ende des Suchbegriffs, das selbst kein Wortzeichen ist, etwa der Punkt in `.id`, braucht dort keine Wortgrenze.
- `Use Regular Expression`: Der Suchbegriff ist ein regulärer JavaScript-Ausdruck, immer im Unicode-Modus, sodass `\p{L}` funktioniert. `^` und `$` passen am Anfang und Ende jeder Zeile eines mehrzeiligen Kommentars oder einer mehrzeiligen Notiz, und `.` reicht nicht über einen Zeilenumbruch hinweg. Escape-Sequenzen, die oft in Namen eingegeben werden, etwa `\_` und `\-`, werden akzeptiert.

Ein regulärer Ausdruck, der sich nicht parsen lässt, etwa `user(`, findet nichts: Der Zähler zeigt `Invalid regular expression` in Rot, und das Suchfeld ist rot umrandet.  
`Match Case` und `Match Whole Word` gelten auch für einen regulären Ausdruck. Ein Treffer ohne Länge, etwa `^` allein, wird nie aufgeführt.

Einfacher Text wird während der Eingabe gesucht. Ein regulärer Ausdruck wird gesucht, sobald die Eingabe pausiert, oder sofort, wenn Sie `Enter`, eine Navigationsschaltfläche, `Replace` oder `Replace All` drücken oder eine Zeile wählen, die einen Treffer enthält.  
Die Suche hat kein Zeitlimit, sodass der Editor bei einem regulären Ausdruck mit starkem Backtracking nicht mehr reagieren kann, bis die Suche abgeschlossen ist.

Ein vierter Schalter, `Preserve Case`, sitzt innen am Ende des Felds `Replace`, sodass er nur angezeigt wird, solange die Zeile `Replace` ausgeklappt ist. Er ist anfangs ausgeschaltet. Er ändert nichts daran, was gefunden wird, nur daran, wie `Replace` und `Replace All` die Ersetzung schreiben – siehe [Ersetzen](#replacing). Ihn ein- oder auszuschalten löst keine Suche aus, und der aktuelle Treffer bleibt aktuell.

## Die Ergebnisse {#the-results}

Der Zähler am Anfang der Zeile unter den Feldern zeigt, wo Sie sich befinden. Er ist leer, solange das Suchfeld leer ist.

| Zähler | Wann |
| --- | --- |
| `No results` | Nichts passt. |
| `12 matches` | Bevor Sie zu einem davon wechseln; `1 match` bei einem einzigen. |
| `3 of 12` | Der dritte Treffer ist aktuell. |
| `Invalid regular expression` | Der reguläre Ausdruck lässt sich nicht parsen. |
| `Replaced 12 matches` | `Replace All` hat so viele Treffer geändert; `Replaced 1 match` bei einem einzigen. |
| `No changes` | `Replace All` hat nichts geändert. |
| `No more matches` | Ein Durchlauf von `Replace` ist wieder dort angekommen, wo er begann – siehe [Ersetzen](#replacing). |

`Replaced …`, `No changes` und `No more matches` weichen bei der nächsten Suche oder dem nächsten Sprung wieder dem Zähler, auch bei der Suche, die eine Änderung oder ein Rückgängigmachen auslöst.

Solange das Suchfeld Text enthält, zeigt der [Baum](./explorer.md#the-tree) des Explorers statt des ganzen Diagramms die Ergebnisse: nur die Zeilen, die einen Treffer enthalten, und die Zeilen darüber. Wenn nichts passt oder sich der reguläre Ausdruck nicht parsen lässt, ist er leer. Das Löschen des Suchbegriffs bringt den ganzen Baum zurück, so eingeklappt wie zuvor.

- `Tables`, `Table Groups` und `Memos` werden nur angezeigt, wenn sie einen Treffer enthalten, und die Zahl an jedem Ordner gibt an, wie viele Zeilen in den Ergebnissen direkt darunter stehen.
- Unter `Tables` stehen die Tabellen, die einen Treffer enthalten, nach Namen, nie nach logischem Namen. Unter jeder Tabelle stehen eine Zeile für jeden Treffer in ihrem Kommentar, dann ein Ordner `Columns` mit den Spalten, die einen Treffer enthalten, in Spaltenreihenfolge, jede mit einer Zeile für jeden Treffer in ihrem Kommentar, dann ein Ordner `Indexes` mit den Indizes, deren Name passt. Einen Ordner `Foreign Keys` gibt es nicht.
- Unter `Table Groups` stehen die Gruppen, deren Name passt, nach Namen, ohne ihre Tabellen. Eine gefundene Tabelle erscheint unter `Tables`.
- Unter `Memos` stehen die Notizen, die einen Treffer enthalten, in Dokumentreihenfolge, jede mit ihrer ersten Zeile dargestellt und mit einer Zeile für jeden Treffer darin.

Ein Treffer in einem Namen wird in der eigenen Zeile dieses Namens hervorgehoben, sodass ein Name, der den Suchbegriff zweimal enthält, eine Zeile mit zwei Hervorhebungen ist. Ein Treffer im logischen Namen einer Tabelle oder Spalte erscheint ebenfalls in der Zeile dieser Tabelle oder Spalte, nie in einer eigenen Zeile.  
Diese Zeilen benennen die Tabelle oder Spalte so, wie die [Namensansicht](./logical-names.md#beyond-the-canvas) sie zeigt, und jeder der beiden Namen, die eine Zeile zeigen kann, hebt nur seine eigenen Treffer hervor. Eine Zeile, die nur in dem Namen gefunden wurde, den ihre Ansicht auslässt, also im logischen Namen in der Ansicht `Physical Names` oder im Namen in der Ansicht `Logical Names`, fügt diesen Namen hinter dem gezeigten an, abgeschwächt wie in der Ansicht `Both Names` und mit hervorgehobenem Treffer. Enthält auch der gezeigte Name einen Treffer, zeigt die Zeile nur diesen Namen, sodass die Treffer in dem Namen, den ihre Ansicht auslässt, gezählt und durchlaufen, aber nicht hervorgehoben werden.  
Ein Treffer in einem Kommentar oder einer Notiz hat eine eigene Zeile: eine Sprechblase für einen Tabellen- oder Spaltenkommentar oder eine Haftnotiz für eine Notiz, dann ein Auszug des Texts mit hervorgehobenem Treffer. Ein langer Text wird mit `…` gekürzt, und Zeilenumbrüche erscheinen als Leerzeichen. Zeigen Sie mit dem Zeiger auf die Zeile, um den ganzen Text zu sehen.  
Jede andere Zeile sieht aus wie außerhalb einer Suche: Eine Spalte zeigt ihren Datentyp, ein Index seine Spalten, und ein leerer Name lautet `unnamed`.

Jede Zeile mit Zeilen darunter wird beim Start einer Suche ausgeklappt angezeigt. Eine Zeile, die Sie einklappen oder die `Collapse All` einklappt, bleibt eingeklappt, bis ein Treffer darunter aktuell wird, bis sich der Suchbegriff, `Match Case`, `Match Whole Word`, `Use Regular Expression` oder eine Textart ändert oder bis die Suche mit der Tastenkombination oder einem Eintrag `Toggle Explorer` erneut geöffnet wird.  
Die Zeile des aktuellen Treffers wird hervorgehoben und in den sichtbaren Bereich gescrollt. Der Baum listet jeden Treffer auf, egal wie viele es sind.  
Die Treffer werden in der Reihenfolge des Baums durchlaufen: Tabelle für Tabelle der logische Name, der Name und der Kommentar der Tabelle, dann logischer Name, Name und Kommentar jeder ihrer Spalten in Spaltenreihenfolge, dann ihre Indexnamen; dann die Tabellengruppennamen; dann die Notizen.

Die Ergebnisse folgen dem Dokument, solange der Explorer angezeigt wird. Sobald die Änderungen pausieren, löst jede Änderung an den durchsuchten Texten eine erneute Suche aus, und der aktuelle Treffer bleibt aktuell, wenn er noch vorhanden ist. Dazu gehören das Bearbeiten eines Namens, eines logischen Namens, eines Kommentars oder eines Notiztexts, das Hinzufügen oder Entfernen einer Tabelle, einer Spalte, eines Index, einer Notiz oder einer Tabellengruppe, das Verschieben einer Spalte sowie das Aus- oder Einblenden der Notizen oder Tabellengruppen mit Ansichtsoptionen, wodurch ihre Treffer aus dem Baum verschwinden oder zurückkehren. Eine Änderung auf der Zeichenfläche, Rückgängigmachen oder Wiederholen, ein Import und eine Änderung durch einen Mitbearbeiter oder einen Coding-Agenten zählen alle. Auswählen, das Verschieben von Tabellen, Notizen oder Gruppen auf der Zeichenfläche, Scrollen, Zoomen und das Zeigen mit dem Zeiger zählen nicht.  
Ebenso wenig zählt ein Wechsel der Namensansicht, der keinen Text ändert, den die Suche liest: Dieselben Treffer bleiben, und die Zeilen übernehmen die Namen, die die neue Ansicht zeigt.  
Änderungen, die vorgenommen werden, während der Explorer geschlossen oder nicht sichtbar ist, werden durchsucht, sobald er wieder angezeigt wird.

## Zu einem Treffer wechseln {#going-to-a-match}

`Enter` im Suchfeld wechselt zum nächsten Treffer und `Shift + Enter` zum vorherigen. Die Pfeilschaltflächen nach oben und unten hinter dem Zähler tun dasselbe; ihre Tooltips lauten `Previous Match (Shift+Enter)` und `Next Match (Enter)`, und sie sind deaktiviert, solange es keinen Treffer gibt.  
Die Navigation springt an beiden Enden zum jeweils anderen Ende um. Bis Sie zum ersten Mal wechseln, ist kein Treffer aktuell, sodass das erste `Enter` zum ersten Treffer wechselt und das erste `Shift + Enter` zum letzten.

Ein Klick auf eine Zeile der Ergebnisse oder `Enter` oder `Space`, wenn der Tastaturfokus auf ihr liegt, bewirkt eines der Folgenden:

- Eine Zeile, deren eigener Name oder logischer Name einen Treffer enthält, wechselt zu ihrem ersten Treffer, wobei der im logischen Namen vor dem im Namen kommt.
- Eine Zeile, die einen Auszug aus einem Kommentar oder einer Notiz zeigt, wechselt zu diesem Treffer.
- Jede andere Zeile, etwa eine Tabelle, deren Name und logischer Name nicht passen, oder die eigene Zeile einer Notiz, wechselt zu dem, wofür die Zeile steht, und lässt den aktuellen Treffer unverändert – siehe [Zu einer Zeile wechseln](./explorer.md#going-to-a-row).
- Ein Ordner wird ein- oder ausgeklappt.

Immer wenn ein Treffer aktuell wird, klappt der Baum alle eingeklappten Zeilen darüber aus und setzt den Tastaturfokus auf die Zeile des Treffers, sodass die Pfeiltasten im Baum von dort aus weitergehen.

Der Wechsel zu einem Treffer schließt die Tabelleneigenschaften, falls sie geöffnet sind, und dann gilt:

- Bei einem Namen, logischen Namen oder Kommentar einer Tabelle oder Spalte wählt er ausschließlich die Tabelle aus, holt sie in den Vordergrund und setzt die fokussierte Zelle auf die Zelle, die den Treffer enthält. Ein Treffer in einem Kommentar, der durch eine [Ansichtsoption für Tabellen](./table-related-functions.md#table-view-options) ausgeblendet ist, setzt die fokussierte Zelle stattdessen auf den Namen daneben. Wo die [Namensansicht](./logical-names.md#name-view) keine Zelle für den Namen oder den logischen Namen zeigt, kommt die fokussierte Zelle auf die Zelle, die an ihrer Stelle gezeigt wird: den Namen in der Ansicht `Physical Names`, den logischen Namen in der Ansicht `Logical Names`.
- Bei einem Indexnamen wählt er ausschließlich die Tabelle des Index aus, holt sie in den Vordergrund und setzt die fokussierte Zelle auf den Namen der Tabelle oder, in den Ansichten `Logical Names` und `Both Names`, auf ihren logischen Namen, sofern die fokussierte Zelle nicht bereits in dieser Tabelle liegt. Indexnamen werden auf der Zeichenfläche nicht dargestellt.
- Bei einem Tabellengruppennamen wählt er ausschließlich die Gruppe aus und holt sie mit ihren Tabellen in den Vordergrund.
- Bei einer Notiz wählt er ausschließlich die Notiz aus und holt sie in den Vordergrund.

Die Zeichenfläche scrollt nur, wenn das Ziel nicht bereits gut sichtbar ist, und der Zoom ändert sich nie – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands).

Nach `Enter` im Suchfeld bleibt der Textcursor dort, und nachdem eine Zeile gewählt wurde, bleibt der Tastaturfokus im Baum, sodass Ihre nächste Eingabe nicht die ausgewählte Tabelle erreicht.  
Der Wechsel zu einem Treffer beginnt oder beendet nie eine Beziehung, die gerade gezeichnet wird.

## Ersetzen {#replacing}

Die Zeile `Replace` ist anfangs eingeklappt. Der Pfeil vor dem Suchfeld, dessen Tooltip `Toggle Replace` lautet, klappt sie aus und ein. Beim Einklappen bleibt der Ersetzungstext erhalten.  
Die Zeile enthält das Feld `Replace` mit dem Schalter `Preserve Case` innen an seinem Ende sowie zwei Schaltflächen, deren Tooltips `Replace (Enter)` und `Replace All` lauten. Beide Schaltflächen sind deaktiviert, solange es keinen Treffer gibt.

`Replace` wird mit `Enter` im Ersetzungsfeld, mit oder ohne `Shift`, oder über seine Schaltfläche ausgeführt:

- Ist kein Treffer aktuell, wechselt der erste Druck nur zum nächsten Treffer, sodass Sie sehen, was sich ändern würde, bevor sich etwas ändert.
- Ist ein Treffer aktuell, wird genau dieses eine Vorkommen ersetzt, alle anderen Vorkommen im selben Text bleiben stehen, und es geht zum nächsten Treffer hinter dem geschriebenen Text weiter. Der geschriebene Text wird übersprungen, auch wenn er den Suchbegriff enthält: Beim Ersetzen von `user` durch `super_user` wird danach nicht innerhalb von `super_user` angehalten.
- Ein Treffer, den die Ersetzung genau so zurückschreiben würde, wie er war, bleibt unverändert, und der Druck geht nur zum nächsten Treffer weiter.
- Die Ersetzung und das Scrollen zum nächsten Treffer sind ein Rückgängig-Schritt.

Ein Durchlauf, in dem Sie wiederholt `Replace` drücken, endet, sobald er wieder dort ankommt, wo er begann. Der Zähler zeigt `No more matches`, kein Treffer ist aktuell, und weiteres Drücken ersetzt nichts.  
`Customer` wird beim Ersetzen durch `Big Customer` daher einmal ersetzt, statt zu `Big Big Customer` anzuwachsen.  
Der Wechsel zu einem Treffer, das Ändern des Suchbegriffs, von `Match Case`, `Match Whole Word`, `Use Regular Expression` oder einer Textart, das Öffnen der Suche mit der Tastenkombination oder einem Eintrag `Toggle Explorer` oder `Replace All` beginnt einen neuen Durchlauf, ebenso ein Rückgängigmachen oder jede andere Änderung, die den Text ändert, in dem der Durchlauf begann. Das Ändern des Ersetzungstexts oder von `Preserve Case` tut das nicht, ebenso wenig die Tastenkombination, wenn sie den Textcursor nur in einen bereits angezeigten Explorer zurückbringt.  
Solange ein Durchlauf andauert, behält eine Tabelle oder Tabellengruppe, die er umbenennt, ihren Platz im Baum und in der Reihenfolge der Treffer, sodass sie nach einer Umbenennung, durch die sie weiter hinten einsortiert würde, nicht erneut angetroffen wird. Der nächste Durchlauf bringt den Baum wieder in Namensreihenfolge, und die umbenannte Zeile rückt an ihren neuen Platz.

`Replace All` wird mit `Ctrl + Enter` (Windows/Linux) oder `⌘ + Enter` (Mac) im Ersetzungsfeld oder über seine Schaltfläche ausgeführt:

- Es ersetzt jeden Treffer in den eingeschalteten Textarten und lässt die übrigen Arten unberührt, abgesehen von den physischen Namen, die ein ersetzter logischer Name ableitet und die es auch dann schreibt, wenn `Table names` und `Column names` ausgeschaltet sind – siehe unten. Mit den voreingestellten Textarten benennt es Tabellen, Spalten, Indizes und Tabellengruppen um und schreibt die logischen Namen von Tabellen und Spalten um; Kommentare und Notizen bleiben unberührt.
- Alles, was es ändert, ist ein Rückgängig-Schritt – siehe [Eine Geste, ein Schritt](./undo-redo.md#one-gesture-one-step).
- Der Zähler zeigt `Replaced N matches` und zählt dabei nur die Vorkommen, deren Text sich tatsächlich geändert hat. Hat sich keines geändert, zeigt er `No changes`, und im Verlauf wird nichts aufgezeichnet, etwa beim Ersetzen des regulären Ausdrucks `(user)` durch `$1`.
- Danach wird erneut gesucht, ohne dass ein Treffer aktuell ist, sodass die Ergebnisse Treffer auflisten können, die der neue Text enthält.

Beide lesen jeden Text so, wie er beim Drücken ist, nicht so, wie ihn die letzte Suche vorgefunden hat.

So wird der Ersetzungstext verwendet:

- Ohne `Use Regular Expression` hat `$` keine besondere Bedeutung, und der Ersetzungstext wird so verwendet, wie er eingegeben wurde, abgesehen von der Groß-/Kleinschreibung, die `Preserve Case` ihm gibt.
- Mit `Use Regular Expression` werden `$1` bis `$99`, `$<name>`, `$&`, `` $` ``, `$'` und `$$` so expandiert wie in `String.prototype.replace` von JavaScript.
- Ohne `Preserve Case` wird die Groß-/Kleinschreibung des gefundenen Texts nicht übernommen: Bei ausgeschaltetem `Match Case` wird `Users` beim Ersetzen von `user` durch `member` zu `members`.
- Mit `Preserve Case` erhält jede Ersetzung, nachdem `$1` und die übrigen Platzhalter expandiert sind, die Groß-/Kleinschreibung des Texts, den sie ersetzt, sodass dieselbe Ersetzung `Users` zu `Members` macht:
  - Ein Treffer ganz in Großbuchstaben erhält die Ersetzung ganz in Großbuchstaben, und ein Treffer ganz in Kleinbuchstaben erhält sie ganz in Kleinbuchstaben: `USER` mit `account` ergibt `ACCOUNT`, und `user` mit `Account` ergibt `account`.
  - Jeder andere Treffer gibt dem ersten Zeichen der Ersetzung die Groß-/Kleinschreibung des ersten Zeichens des Treffers und lässt den Rest wie eingegeben: `UserId` mit `accountKey` ergibt `AccountKey`, und `uSER` mit `AccountKey` ergibt `accountKey`. Hat das erste Zeichen des Treffers keine Groß-/Kleinschreibung, bleibt die Ersetzung wie eingegeben: `_Ab` mit `xyz` ergibt `xyz`.
  - Wenn der Treffer und die Ersetzung beide `-` oder beide `_` enthalten und dieses Trennzeichen sie in gleich viele Teile zerlegt, erhält jeder Teil die Groß-/Kleinschreibung des entsprechenden Teils: `USER_id` mit `account_key` ergibt `ACCOUNT_key`, und `User-Name` mit `account-key` ergibt `Account-Key`. Wenn sowohl `-` als auch `_` sie auf diese Weise zerlegen, wird die Groß-/Kleinschreibung für das Ganze als Einheit übertragen.
  - Ein Treffer ohne Buchstaben mit Groß-/Kleinschreibung, etwa `123`, lässt die Ersetzung wie eingegeben.
  - Ein Treffer, der so zurückgeschrieben wird, wie er war, zählt nicht: Bei ausgeschaltetem `Match Case` schreibt das Ersetzen von `customer` durch `Customer` die Treffer `customer`, `Customer` und `CUSTOMER` unverändert zurück, und keiner davon wird gezählt.
- Ein leeres Ersetzungsfeld löscht den Treffer.

Eine Ersetzung ist eine gewöhnliche Änderung, genauso, als würden Sie den neuen Tabellennamen, Spaltennamen, logischen Namen, Kommentar oder Notiztext selbst eingeben, den Index in den Tabelleneigenschaften umbenennen oder die Tabellengruppe umbenennen.  
Sie wird im Verlauf aufgezeichnet und erreicht Mitbearbeiter und einen Coding-Agenten wie jede andere Änderung.

Ein Tabellen- oder Spaltenname, den eine Ersetzung schreibt, wird daher zu einem eigenen Namen, den ein später geschriebener logischer Name unverändert lässt, bis [Physische Namen neu ableiten](./dictionary.md#derive-physical-names-again) ihn wieder den Wörterbüchern überlässt. Ein Name, den eine Ersetzung leer lässt, fällt stattdessen an die Wörterbücher zurück, wie jeder geleerte Name – siehe [Eigene Namen](./dictionary.md#names-of-your-own).  
Solange der physische Name einer Tabelle oder Spalte leer ist oder selbst abgeleitet wurde, leitet ein ersetzter logischer Name ihn aus den Wörterbüchern ab, wie es das Schließen der Zelle des logischen Namens bei einem neuen logischen Namen tut – siehe [Physische Namen ableiten](./dictionary.md#deriving-physical-names). In diesem Fall erhält eine Spalte, deren neuer logischer Name ein Begriff ist, auch die Domäne des Begriffs und damit den Datentyp der Domäne. Was dabei abgeleitet wird, gehört zum Rückgängig-Schritt der Ersetzung und wird in `Replaced N matches` nicht mitgezählt.  
Schreibt ein einzelnes `Replace All` sowohl den logischen Namen als auch den Namen derselben Tabelle oder Spalte um, hat der Name, den es schreibt, Vorrang vor dem, den der neue logische Name ableiten würde.

## Tasten in den Suchfeldern {#keys-in-the-search-fields}

- Im Suchfeld wechselt `Enter` zum nächsten Treffer und `Shift + Enter` zum vorherigen.
- Im Ersetzungsfeld ersetzt `Enter`, mit oder ohne `Shift`, und `Ctrl + Enter` (Windows/Linux) oder `⌘ + Enter` (Mac) ersetzt alle.
- Während eine Eingabemethode in einem der beiden Felder Zeichen zusammensetzt, gehört `Enter` dem Zusammensetzen und bewirkt weder einen Wechsel noch eine Ersetzung.

Was `Escape`, die weiterhin funktionierenden Tastenkombinationen des Editors und jede andere Taste in diesen Feldern bewirken, wird in [Tasten im Explorer](./explorer.md#keys-in-the-explorer) beschrieben.

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit [`readonly`](../../api/erd-editor-element.md#readonly) findet die Suche nur. Es gibt keinen Pfeil `Toggle Replace` und keine Zeile `Replace`, also kein Ersetzungsfeld, kein `Preserve Case`, kein `Replace` und kein `Replace All`.  
Das Suchfeld, seine drei Optionen, die Textarten, der Zähler, die Ergebnisse und der Wechsel zu einem Treffer funktionieren alle. Der Explorer um die Suche herum funktioniert wie in jedem anderen Editor – siehe [Schreibgeschützte Editoren](./explorer.md#read-only-editors).

In VS Code wird eine Revision eines Diagramms, etwa eine Git-Revision oder ein Eintrag aus Local History, als JSON-Text geöffnet. Mit `Reopen Editor With...` als Diagramm erneut geöffnet, ist sie schreibgeschützt und erhält diese Suche ohne Ersetzen.

## Tastenkombination ändern {#changing-the-shortcut}

Eine Seite, die den Editor einbettet, kann `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) unter dem Namen `findReplace` mit [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) neu belegen oder entfernen.  
Ist die Tastenkombination entfernt, bleibt sie auf jeder Registerkarte der Seite überlassen. Die Schaltfläche `Explorer` in der Symbolleiste öffnet und schließt den Explorer weiterhin, und `Toggle Explorer` in der Schnellsuche und im Kontextmenü der Zeichenfläche öffnet weiterhin die Suche oder schließt den Explorer, aber keines davon zeigt eine Tastenkombination an, sodass der Tooltip der Schaltfläche nur `Explorer` lautet. Auch die Zeile `Toggle Explorer` auf der Registerkarte [Tastenkombinationen](./settings.md#shortcuts) der Einstellungen zeigt keine Tastenkombination an. Nach einer Neubelegung zeigen alle die neue Tastenkombination.
