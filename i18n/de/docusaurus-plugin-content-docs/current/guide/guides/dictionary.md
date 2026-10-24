---
sidebar_position: 14
description: Die Domänen, Wörter und Begriffe des Diagramms auf der Registerkarte Wörterbuch pflegen, physische Namen aus logischen Namen ableiten, eine Domäne den Datentyp ihrer Spalten festlegen lassen, lesen, was das Blatt Prüfungen findet, die Blätter wie in einer Tabellenkalkulation bearbeiten und sortieren und sie als CSV-Dateien importieren und exportieren.
---

# Wörterbuch

Die Registerkarte Wörterbuch enthält den Namensstandard des Diagramms in drei Wörterbüchern, jedes auf einem Blatt, das Sie wie eine Tabellenkalkulation bearbeiten:

- `Domains`: benannte Datentypen, etwa `Name` für `VARCHAR(100)`. Eine mit einer Domäne verknüpfte Spalte hat deren Datentyp.
- `Words`: die Standardwörter, aus denen logische Namen bestehen, jedes mit der Abkürzung, die ein physischer Name dafür verwendet, etwa `Customer` und `CUST`.
- `Terms`: ganze logische Namen, jeder mit dem physischen Namen und der Domäne, die er vorgibt, etwa `Customer Name` mit `CUST_NM`.

Der [logische Name](./logical-names.md) einer Tabelle oder Spalte leitet ihren physischen Namen aus diesen Wörterbüchern ab, und der Begriff einer Spalte kann sie zudem mit einer Domäne verknüpfen – siehe [Physische Namen ableiten](#deriving-physical-names).  
Ein viertes Blatt, `Checks`, listet auf, was die Wörterbücher an den Namen und Typen des Diagramms und an den Wörterbüchern selbst beanstanden, etwa ein verbotenes Wort in einem logischen Namen – siehe [Das Blatt Prüfungen](#the-checks-sheet).

## Registerkarte öffnen {#opening-the-tab}

Wechseln Sie in der Symbolleiste zur Registerkarte `Dictionary`, der Schaltfläche mit einem Buchsymbol zwischen `Code Generator` und `Settings`, oder wählen Sie in der [Schnellsuche](./quick-search.md) unter `Tab` den Eintrag `Dictionary`.  
Das Diagramm kann sich auch mit dieser Registerkarte öffnen – siehe `Canvas Type` in [Sperren](./settings.md#lock).

Die Registerkarte öffnet sich mit dem Blatt `Domains`, bis Sie ein anderes wählen.  
Bei jedem Öffnen erscheint das Blatt wieder mit der Auswahl und der Scrollposition, die Sie zurückgelassen haben, oder beim ersten Besuch mit ausgewählter erster Zelle. Sein Raster erhält den Tastaturfokus, sodass Eingaben und die Pfeiltasten sofort wirken.

Das angezeigte Blatt sowie die Suche, die Auswahl, die Scrollposition und die Spaltenbreiten jedes Blatts gehören allein Ihnen.  
Nichts davon wird in der Datei gespeichert, im Verlauf aufgezeichnet oder mit Mitbearbeitern geteilt. Es bleibt erhalten, solange der Editor geöffnet bleibt, über Wechsel der Registerkarte hinweg und über Dokumente hinweg, die in denselben Editor geladen werden.

## Die Blätter {#the-sheets}

Die Leiste oben enthält die vier Blattschaltflächen `Domains`, `Words`, `Terms` und `Checks`, und die Schaltfläche des angezeigten Blatts erscheint gedrückt. Jede zeigt neben ihrem Namen eine Zahl: die Zeilen ihres Blatts, unabhängig davon, was die Suche zeigt, oder bei `Checks` die Anzahl der Prüfungen, gefärbt nach ihrer Stufe – siehe [Das Blatt Prüfungen](#the-checks-sheet).  
Danach folgt das Suchfeld – siehe [Suchen](#searching). Am Ende der Leiste stehen auf den Blättern `Domains`, `Words` und `Terms`, nicht aber in einem schreibgeschützten Editor, vier Werkzeuge: `Add Row`, `Delete Rows`, `Import CSV` und `Export CSV` – siehe [Zeilen hinzufügen und löschen](#adding-and-deleting-rows) und [CSV importieren und exportieren](#importing-and-exporting-csv).  
In einem schmalen Bereich oder bei einer Anzeigesprache mit langen Texten bricht die Leiste auf weitere Zeilen um, sodass jede Schaltfläche erreichbar bleibt.

Unter dem Raster zählt eine Statuszeile die Zeilen, die die Suche übrig lässt, etwa `4 rows`, und, solange die Auswahl Zeilen umfasst, wie viele sie umfasst, etwa `1 selected`. Eine Zeile, die zwei Bereiche gemeinsam haben, zählt einmal, sodass diese Zahl angibt, wie viele Zeilen `Delete Rows` entfernen würde.  
Die Zeilennummern am linken Rand zählen die Zeilen so, wie das Blatt sie zeigt, ab 1. Eine schreibgeschützte Zelle, also jede Zelle auf `Checks` und jede Zelle in einem schreibgeschützten Editor, erscheint auf grauem Hintergrund, außer wo eine Prüfung sie markiert.  
Ein leeres Blatt `Domains`, `Words` oder `Terms` zeigt `Import a CSV file or add a row`, außer in einem schreibgeschützten Editor.

Die Spalten jedes Blatts, in ihrer Reihenfolge:

| Blatt | Spalten |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Was die Zellen bewirken:

- Das Feld `Data Type` einer Domäne wird wie ein Spaltentyp geschrieben, etwa `VARCHAR(100)` oder `NUMERIC(15,2)`, und jede mit der Domäne verknüpfte Spalte hat diesen Typ – siehe [Domänen und Datentypen](#domains-and-data-types).
- Das Feld `Abbreviation` eines Worts enthält, was ein physischer Name für das Wort verwendet – siehe [Aus den Wörtern](#from-the-words).
- Die Felder `Synonyms` und `Forbidden Words` eines Worts führen andere Wörter für dieselbe Sache auf, durch Kommas getrennt. Bei jedem Eintrag werden Leerzeichen an den Enden entfernt, ein leerer Eintrag entfällt, und ein Eintrag, der dem Wort selbst entspricht, wird ignoriert. Aus einem logischen Namen, der einen solchen Eintrag verwendet, wird kein physischer Name zusammengesetzt, und das Blatt `Checks` meldet ihn und nennt das Wort, das stattdessen zu verwenden ist – siehe [Was jede Prüfung findet](#what-each-check-finds).
- Das Feld `Term` eines Begriffs ist ein ganzer logischer Name, und sein Feld `Physical Name` ist der Name, den dieser logische Name ergibt – siehe [Aus einem Begriff](#from-a-term).
- Das Feld `Domain` eines Begriffs zeigt den Namen der verknüpften Domäne und ist leer, solange der Begriff keine Domäne verknüpft oder eine inzwischen entfernte – siehe [Die Domäne eines Begriffs](#a-terms-domain).
- `Category`, `English Name`, jedes Feld `Description` und das Feld `Synonyms` eines Begriffs sind Anmerkungen. Diese Felder ändern nichts, und keine Prüfung liest sie.

In einer [Anzeigesprache mit Schreibrichtung von rechts nach links](./language-and-theme.md#right-to-left-languages) werden die Leiste, das Rastermenü und die Statuszeile gespiegelt, während die Blätter und die Domänenliste eines Begriffs von links nach rechts bleiben.

## Physische Namen ableiten {#deriving-physical-names}

Die Wörterbücher können einer Tabelle oder Spalte aus ihrem logischen Namen ihren physischen Namen geben, also den Namen, den Schema SQL und der Codegenerator schreiben. Zuerst wird ein Begriff gesucht, dessen Feld `Term` der logische Name ist; andernfalls wird der Name aus den Abkürzungen der Wörter zusammengesetzt.  
Zum Beispiel mit den Wörtern `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) und `Date` (`DT`) sowie dem Begriff `Customer Number` mit dem physischen Namen `CUST_NO` und der Domäne `Number`, deren Datentyp `INT` ist:

- Der logische Name `Customer Number` benennt eine Spalte `CUST_NO`, verknüpft sie mit `Number` und gibt ihr den Typ `INT`.
- Aus `Order Date` wird `ORD_DT` zusammengesetzt.
- Eine Tabelle mit dem logischen Namen `Customer` heißt `CUST`.

Sind das Blatt `Words` und das Blatt `Terms` leer, wird nichts abgeleitet.

### Wann ein Name abgeleitet wird {#when-a-name-is-derived}

Ein physischer Name wird abgeleitet, wenn ein logischer Name geschrieben wird:

- Auf der Zeichenfläche, wenn sich das Eingabefeld der Zelle des logischen Namens mit einem anderen logischen Namen als dem beim Öffnen schließt, durch `Enter`, `Tab`, `Escape` oder einen Klick an eine andere Stelle. Jeder Tastendruck beim Tippen schreibt nur den logischen Namen – siehe [Logischen Namen eingeben](./logical-names.md#writing-a-logical-name).
- Sofort, wenn Sie einen Begriff aus der Liste unter der Zelle wählen – siehe [Begriffsnamen vervollständigen](./logical-names.md#completing-term-names).
- Wenn ein Einfügen in eine Zelle des logischen Namens schreibt – siehe [Spalten kopieren/einfügen](./table-editing.md#copyingpasting-columns).
- Wenn [Suchen und Ersetzen](./find-and-replace.md#replacing) einen logischen Namen ersetzt, einen Treffer oder alle.
- Wenn ein Coding-Agent einen logischen Namen setzt.

Er wird nur abgeleitet, solange der physische Name leer ist oder selbst abgeleitet wurde – siehe [Eigene Namen](#names-of-your-own).  
Ein gewählter Begriff, ein Einfügen oder eine Ersetzung schreibt den logischen Namen und das daraus Abgeleitete als einen Rückgängig-Schritt. Auf der Zeichenfläche ist der beim Schließen des Eingabefelds abgeleitete Name ein eigener Schritt nach der Eingabe: Das erste Rückgängigmachen nimmt den abgeleiteten Namen zurück, samt der Domäne und dem Typ, die ein Begriff mitgebracht hat, und lässt den logischen Namen stehen, den Sie getippt haben.

Später wird nichts von selbst neu abgeleitet. Ein geändertes Feld `Abbreviation` eines Worts, ein geändertes Feld `Physical Name` oder `Domain` eines Begriffs sowie neue Wörter oder Begriffe lassen die bereits abgeleiteten Namen unverändert; verwenden Sie dafür [Physische Namen neu ableiten](#derive-physical-names-again). Das Feld `Data Type` einer Domäne ist die Ausnahme: Es wirkt sich sofort auf ihre Spalten aus.

### Aus einem Begriff {#from-a-term}

Zuerst wird das Blatt `Terms` nach einem Begriff durchsucht, dessen Feld `Term` dem logischen Namen entspricht. Leerzeichen an beiden Enden und die Unicode-Normalform werden ignoriert, die Groß-/Kleinschreibung wird jedoch beachtet, sodass `customer number` nicht zu `Customer Number` passt. Von zwei Begriffen mit demselben Namen zählt der erste auf dem Blatt.

- Der Begriff gibt sein Feld `Physical Name` vor oder, solange dieses leer ist, den Namen, der sich wie unten beschrieben aus seinen Wörtern zusammensetzt, sofern sich einer zusammensetzen lässt.
- Bei einer Spalte verknüpft der Begriff außerdem die Domäne aus seinem Feld `Domain`, solange das Blatt `Domains` sie enthält, wodurch die Spalte den Datentyp der Domäne erhält – siehe [Spalte verknüpfen](#linking-a-column). Das geschieht auch, wenn der Begriff keinen Namen vorgibt. Ein Begriff ohne Domäne hebt keine Verknüpfung auf.
- Eine Tabelle übernimmt nur den physischen Namen des Begriffs.

### Aus den Wörtern {#from-the-words}

Ohne passenden Begriff setzen die Wörter den Namen zusammen:

1. Der logische Name wird an Leerzeichen, `_`, `-`, `·` und `/` getrennt, und kein Wort reicht über eine Trennstelle hinweg.
2. Jeder Teil wird von links gelesen, wobei an jeder Stelle der längste Text genommen wird, den das Blatt `Words` als `Word`, als Synonym oder als verbotenes Wort enthält, ohne je zurückzugehen. Mit den Wörtern `가입`, `가입일` und `일자` wird `가입일자` als `가입일` und `자` gelesen, sodass `자` nicht registriert ist, während `가입 일자` als `가입` und `일자` gelesen wird. Die Groß-/Kleinschreibung wird beachtet: `member` ist nicht das Wort `Member`.
3. Der physische Name besteht aus dem Feld `Abbreviation` jedes Worts, so wie es eingegeben wurde, verbunden mit `_`, etwa `ORD_DT`. Von zwei Wörtern mit demselben Namen gibt das erste auf dem Blatt die Abkürzung vor. Es gilt keine Längenbegrenzung, und die Optionen `Table Name Case` und `Column Name Case` des Codegenerators spielen keine Rolle.

Es gilt alles oder nichts. Ist ein Abschnitt ein Synonym, ein verbotenes Wort oder ein Text, den kein Wort enthält, oder hat ein Wort ein leeres Feld `Abbreviation`, wird kein Name zusammengesetzt, und der physische Name bleibt unverändert.

### Eigene Namen {#names-of-your-own}

Die Wörterbücher füllen einen physischen Namen nur, solange er leer ist oder selbst von ihnen gefüllt wurde. Der Editor merkt sich das für jede Tabelle und Spalte, auch wenn nichts auf der Zeichenfläche es anzeigt.

- Ein Name, den Sie schreiben, wird zu Ihrem eigenen: durch Eingabe in eine Namenszelle, durch Ersetzen eines Tabellen- oder Spaltennamens mit Suchen und Ersetzen, durch Einfügen über die Namenszelle einer Spalte und durch eine Umbenennung durch einen Coding-Agenten. Ein später geschriebener logischer Name lässt ihn unverändert, schreibt nur den logischen Namen und verknüpft keine Domäne.
- Wenn Sie den Namen leeren, überlassen Sie ihn wieder den Wörterbüchern, da ein leerer Name immer abgeleitet wird.
- Ein logischer Name, aus dem sich nichts ableiten lässt, lässt den physischen Namen und seinen Zustand, wie sie waren: Ein leerer Name bleibt leer, und ein abgeleiteter Name bleibt unverändert und weiterhin von den Wörterbüchern abgeleitet.
- Eine neue Tabelle oder Spalte beginnt mit einem leeren Namen, sodass ihr erster logischer Name ihn ableitet. Eine von einer Beziehung hinzugefügte Fremdschlüsselspalte wird nach ihrem Schlüssel benannt, und dieser Name gilt als eigener Name – siehe [Namen der Fremdschlüsselspalten](./relationship-editing.md#foreign-key-column-names).
- Die Namen, die ein `Import` oder `Import and Add` von Schema SQL, GraphQL, DBML oder AML einbringt, und die Namen eines Diagramms, das eine Version vor Einführung der Registerkarte Wörterbuch erstellt hat, gelten als eigene Namen, sodass ein später darauf geschriebener logischer Name nichts ableitet.
- Eine [duplizierte Tabelle](./table-related-functions.md#duplicating-tables-and-memos), eine an ihrem Ziehgriff [in eine andere Tabelle verschobene](./table-editing.md#rearranging-and-moving-columns) Spalte, das Einfügen kopierter Tabellen und `Import and Add` einer JSON-Datei behalten den Zustand jedes Namens bei. Die Namen von Spalten, die als neue Spalten in ausgewählte Tabellen eingefügt werden, gelten als eigene Namen, es sei denn, der eingefügte Name ist leer und ihr logischer Name leitet einen ab.
- [Physische Namen neu ableiten](#derive-physical-names-again) überlässt einen eigenen Namen wieder den Wörterbüchern, auch einen importierten.

### Zwei Spalten, ein Name {#two-columns-one-name}

Eine Spalte leitet nichts ab, wenn eine andere Spalte ihrer Tabelle bereits den Namen hat, den sie ableiten würde. Sie behält ihren Namen, ihren Zustand und ihre Domänenverknüpfung, und nur ihr logischer Name wird geschrieben. Die Namen werden ohne Beachtung der Groß-/Kleinschreibung und der Leerzeichen an beiden Enden verglichen, wie bei den Namen von Fremdschlüsselspalten.  
Wenn eine einzige Änderung zwei Spalten denselben Namen geben würde, wie es `Replace All` oder `Derive Physical Names Again` für eine Tabelle tun kann, erhält ihn die erste in der Tabelle.  
Zum Beispiel fügt eine Selbstreferenz auf `members` mit dem Schlüssel `MBR_NO` die Spalte `MBR_NO_2` hinzu, die den logischen Namen `Member Number` übernimmt. `Derive Physical Names Again` würde sie `MBR_NO` nennen, den Namen, den der Schlüssel hat, daher behält sie `MBR_NO_2`.  
Für Tabellen gibt es keine solche Regel: Zwei Tabellen können denselben Namen ableiten.

## Physische Namen neu ableiten {#derive-physical-names-again}

Verwenden Sie `Derive Physical Names Again`, nachdem Sie das Feld `Abbreviation` eines Worts oder das Feld `Physical Name` oder `Domain` eines Begriffs geändert haben, da diese Änderungen von sich aus nichts umbenennen. Der Befehl überlässt die erfassten Namen wieder den Wörterbüchern und leitet sie nach den obigen Regeln neu ab, auch Namen, die Sie selbst geschrieben haben. Er wird nur auf der Registerkarte ERD angeboten und nicht in einem schreibgeschützten Editor:

- Das Kontextmenü der Tabelle, direkt nach `Focus on this table` oder `Focus on selected tables`. Solange die Tabelle eine von zwei oder mehr ausgewählten Tabellen ist, erfasst `Derive Physical Names Again` alle, wo auch immer Sie mit der rechten Maustaste auf die Tabelle klicken. Andernfalls bietet ein Rechtsklick auf die Zeile einer Spalte `Derive Physical Name Again` für diese Spalte allein, und ein Rechtsklick auf den Tabellenkopf bietet `Derive Physical Names Again` für den Namen der Tabelle und jede Spalte.
- Das Kontextmenü der Zeichenfläche, direkt nach `Name View`: `Derive Physical Names Again` für jede Tabelle und Spalte im Diagramm. Der Eintrag entfällt, solange das Diagramm keine Tabelle hat.
- Die [Schnellsuche](./quick-search.md#what-the-palette-lists), als Zeilen für die fokussierte Spalte, die fokussierte Tabelle, die ausgewählten Tabellen und das ganze Diagramm.

![Die Abkürzung von Number auf dem Blatt Words von NO in NUM ändern, wobei die physischen Namen im Diagramm MBR_NO und PAY_NO bleiben, dann mit Derive Physical Names Again im Menü der Zeichenfläche daraus MBR_NUM und PAY_NUM machen, während ORD_NO, das sein Begriff vorgibt, bleibt](/img/demo-derive-physical-names.webp)

Jede erfasste Tabelle und Spalte mit einem logischen Namen wird neu abgeleitet. Eine Spalte übernimmt außerdem die Domäne, die ihr Begriff vorgibt, und damit den Typ der Domäne, der sich entlang der Beziehungen ausbreitet, solange die [Datentyp-Synchronisierung für Beziehungen](./settings.md#relationship-datatype-sync) eingeschaltet ist.  
Unberührt bleiben eine Tabelle oder Spalte ohne logischen Namen und eine Spalte, deren neuen Namen eine andere Spalte ihrer Tabelle hat – siehe [Zwei Spalten, ein Name](#two-columns-one-name). Jede davon behält ihren Namen und dessen Zustand, eigen oder von den Wörterbüchern abgeleitet, und eine Spalte behält zudem ihre Domänenverknüpfung.  
Ein logischer Name, aus dem sich jetzt nichts ableiten lässt, lässt den physischen Namen unverändert, überlässt ihn aber wieder den Wörterbüchern, sodass der nächste logische Name, den Sie schreiben, ihn ableitet.  
Der Befehl ist ein Rückgängig-Schritt, wie viele Namen, Verknüpfungen und Typen er auch ändert. Er zeichnet nur dann keinen Schritt auf, wenn er nichts ändert, und einen eigenen Namen wieder den Wörterbüchern zu überlassen, gilt als Änderung, auch wenn der Name bereits enthält, was sie vorgeben.

Das eigene Feld `Physical Name` eines Begriffs wird aus geänderten Wörtern nicht neu zusammengesetzt, bearbeiten Sie daher den Begriff, bevor Sie neu ableiten.

## Domänen und Datentypen {#domains-and-data-types}

Eine mit einer Domäne verknüpfte Spalte hat den Datentyp aus dem Feld `Data Type` der Domäne. Das Verknüpfen einer Spalte gibt ihr diesen Typ sofort.  
Wenn sich das Feld `Data Type` einer Domäne ändert, ob auf dem Blatt `Domains` bearbeitet, eingefügt oder importiert oder von einem Mitbearbeiter oder einem Coding-Agenten geändert, übernimmt jede mit ihr verknüpfte Spalte den neuen Typ im selben Schritt. Solange die [Datentyp-Synchronisierung für Beziehungen](./settings.md#relationship-datatype-sync) eingeschaltet ist, setzt sich jede dieser Änderungen wie eine eingegebene Typänderung entlang der Beziehungen fort; solange sie ausgeschaltet ist, ändern sich nur die verknüpften Spalten.  
Das Umbenennen einer Domäne ändert nur den Namen, den die Domänenzellen der Spalten zeigen.

Eine auf dem Blatt `Domains` vorgenommene Typänderung wird dort rückgängig gemacht, zusammen mit den Spaltentypen, die sie vergeben hat – siehe [Wörterbuchblätter](./undo-redo.md#dictionary-sheets).  
Ein Rückgängigmachen oder Wiederholen auf der Registerkarte ERD, das eine Spalte wieder mit einer Domäne verknüpft oder eine mit einer Domäne verknüpfte Spalte zurückbringt, gibt der Spalte den aktuellen Typ der Domäne. Ein Rückgängigmachen oder Wiederholen, das einen anderen Typ wiederherstellt, hebt die Verknüpfung der Spalte auf.

### Spalte verknüpfen {#linking-a-column}

Eine Spalte wird mit einer Domäne verknüpft durch:

- Die Auswahl der Domäne in der Domänenzelle der Spalte, die View Option → `Domain` einblendet, oder in der Ansicht `Logical Names` in der Typzelle, die an ihrer Stelle steht – siehe [Die Domänenzelle](./logical-names.md#the-domain-cell).
- Einen logischen Namen, dessen Begriff eine Domäne vorgibt – siehe [Aus einem Begriff](#from-a-term). Das geschieht nur, solange der Name abgeleitet wird, also nicht bei einem eigenen Namen und nicht bei einer Spalte, deren abgeleiteten Namen eine andere Spalte hat.
- `Derive Physical Name Again` oder `Derive Physical Names Again`, die jeweils die Domäne des Begriffs jeder erfassten Spalte verknüpfen.
- Eine Beziehung: Eine Fremdschlüsselspalte übernimmt die Domäne ihres Schlüssels, zusammen mit seinem Typ und seinem logischen Namen – siehe [Identifizierende Beziehungen](./relationship-editing.md#identifying-relationships). Ein Schlüssel, dessen Kopie einen anderen Typ erhält, wie die eines Serial-Schlüssels, gibt keine Domäne weiter.
- Das Duplizieren ihrer Tabelle oder das Verschieben in eine andere Tabelle an ihrem Ziehgriff, die beide die Verknüpfung beibehalten. Das Einfügen kopierter Tabellen oder Spalten behält sie nur bei, solange dieses Diagramm die Domäne enthält und die Domäne noch den Typ der kopierten Spalte hat, sodass eine Kopie aus einem anderen Diagramm ohne Verknüpfung ankommt – siehe [Tabellen und Notizen kopieren/einfügen](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` verknüpft keine Spalte.
- Den in eine Domänenzelle eingefügten Namen einer Domäne – siehe [Spalten kopieren/einfügen](./table-editing.md#copyingpasting-columns).

### Verknüpfung aufheben {#unlinking}

- Die Eingabe eines Typs in die Zelle `DataType` einer verknüpften Spalte oder das Übernehmen eines Vorschlags hebt die Verknüpfung der Spalte auf, sobald sich ihr Typ von dem ihrer Domäne unterscheidet, und die Spalte behält den eingegebenen Typ – siehe [Autovervollständigung für Datentypen](./table-editing.md#datatype-autocomplete). Wenn Sie den Typ der Domäne wieder eingeben, wird sie nicht erneut verknüpft; wählen Sie stattdessen die Domäne in ihrer Domänenzelle. Ein Einfügen über die Zelle `DataType` und eine Typänderung durch einen Coding-Agenten heben die Verknüpfung auf dieselbe Weise auf.
- Solange die Datentyp-Synchronisierung für Beziehungen eingeschaltet ist, wird bei jeder Spalte, die eine Typänderung erreicht und deren neuer Typ sich von dem ihrer eigenen Domäne unterscheidet, die Verknüpfung im selben Schritt aufgehoben, etwa bei einem Fremdschlüssel, der mit einer eigenen Domäne verknüpft ist. Der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) hebt die Verknüpfung der Spalten, deren Typ er ändert, auf dieselbe Weise auf.
- `None` in der Domänenzelle hebt die Verknüpfung der Spalte auf und behält ihren Typ bei.
- Das Ändern oder Leeren des Felds `Domain` eines Begriffs oder das Entfernen eines Begriffs ändert keine Spalte.

### Domäne entfernen {#removing-a-domain}

Wenn Sie die Zeile einer Domäne entfernen, behalten ihre Spalten ihre Typen, und ihre Verknüpfungen bleiben bestehen. Die Spalten zeigen keine Domäne, und das Blatt `Checks` führt für jede von ihnen `Unknown domain` auf, solange das Blatt `Domains` noch eine Domäne enthält. Wird das Entfernen auf dem Blatt `Domains` rückgängig gemacht, erscheinen die Verknüpfungen wieder.  
Solange die Domäne fehlt, hebt die Eingabe eines vom Typ der Domäne abweichenden Typs in eine solche Spalte deren Verknüpfung endgültig auf, ebenso `None` in ihrer Domänenzelle.  
Beim Speichern lässt die Datei diese Verknüpfungen weg, sodass diese Spalten nach dem erneuten Öffnen des Diagramms nicht verknüpft sind.

Ein mit einer entfernten Domäne verknüpfter Begriff zeigt eine leere Zelle `Domain`, markiert als `Unknown domain`. `Delete` oder `Backspace` auf der Zelle hebt seine Verknüpfung auf – siehe [Die Domäne eines Begriffs](#a-terms-domain).

## Das Blatt Prüfungen {#the-checks-sheet}

Das Blatt `Checks` führt auf, was die Prüfungen der Wörterbücher in den Wörterbüchern und in den Tabellen und Spalten des Diagramms finden. Die Prüfungen lesen nur, sie ändern nichts.  
Jede Prüfung läuft nur, solange das Blatt, das sie liest, eine Zeile enthält, und die Wortprüfungen nur, solange das Blatt `Words` ein Wort mit einem Namen enthält, sodass ein Diagramm mit leeren Wörterbüchern nichts aufführt.

![Customer Num rot und Order Stat bernsteinfarben in der Ansicht Logical Names, das Blatt Checks mit ihren drei Prüfungen und einer roten Zahl, ein Doppelklick auf die Zeile Forbidden word, der zurück zu Customer Num im Diagramm führt, und die Neueingabe als Member Number, nach der eine Prüfung übrig bleibt](/img/demo-dictionary-checks.webp)

Seine drei Spalten sind schreibgeschützt:

- `Type` nennt die Prüfung – siehe [Was jede Prüfung findet](#what-each-check-finds).
- `Target` nennt ein Wort, einen Begriff oder eine Domäne beim Namen, eine Tabelle bei ihrem Namen und eine Spalte als `table.column`, wobei Tabelle und Spalte so benannt werden, wie die [Namensansicht](./logical-names.md#beyond-the-canvas) sie benennt, mit `unnamed`, wo die Ansicht keinen Namen zeigt.
- `Detail` zeigt, was die Prüfung gefunden hat, und nach `→`, was die Wörterbücher stattdessen anbieten, mehrere durch Kommas verbunden, etwa `멤버 → 회원`. Eine leere Seite lautet `—`, wie in `— → NUMERIC(15)`.

Zuerst kommen die Prüfungen der Wörter, dann die der Begriffe und der Domänen, dann Tabelle für Tabelle, jede Tabelle gefolgt von ihren Spalten.  
Die Liste folgt jeder Änderung, sobald sie eintrifft, auch der eines Mitbearbeiters oder eines Coding-Agenten, und jedem Wechsel der Namensansicht.  
Die Zahl der Schaltfläche `Checks` ist rot, solange eine Prüfung ein Fehler ist, bernsteinfarben, solange alle Warnungen sind, und abgeschwächt, wenn es keine gibt.

Die Zeilen lassen sich nicht bearbeiten, hinzufügen, löschen, sortieren, importieren oder exportieren: Die Leiste zeigt keine Werkzeuge, ein Rechtsklick öffnet kein Rastermenü, und Rückgängig und Wiederholen bewirken nichts. Suchen, Auswählen und Kopieren funktionieren wie auf den anderen Blättern.

`Enter` oder ein Doppelklick auf eine Zeile wechselt zu dem, was sie nennt:

- Ein Wort, ein Begriff oder eine Domäne: Die Registerkarte zeigt das zugehörige Blatt, wählt die Zelle aus, die die Prüfung liest, also den Namen oder das Feld `Domain` eines Begriffs, und zeigt die Zeile als erste im sichtbaren Bereich. Die Suche des Blatts wird geleert, wenn sie die Zeile ausblendet. Eine inzwischen entfernte Zeile führt nirgendwohin.
- Eine Tabelle oder Spalte: Die Registerkarte ERD erscheint, wobei nur die Tabelle ausgewählt und die Zelle fokussiert ist, die die Prüfung liest. Das ist der Name, der logische Name oder die Domänenzelle oder, wo die Zeile diese Zelle nicht zeigt, die an ihrer Stelle gezeigte Zelle. Die Zeichenfläche erhält den Tastaturfokus, und die Ansicht bewegt sich nach der Regel in [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands).

Ein Doppelklick auf einen Spaltenkopf, einen Spaltenrand, eine Scrollleiste oder unterhalb der Zeilen führt nirgendwohin.  
Ein Coding-Agent führt mit `erd_list_checks` dieselben Prüfungen in derselben Reihenfolge auf – siehe [Wörterbuchprüfungen](../../mcp/tools.md#dictionary-checks).

Die anderen drei Blätter markieren die Zellen, die die Prüfungen lesen, einen Namen oder das Feld `Domain` eines Begriffs, mit roter oder bernsteinfarbener Schrift auf getöntem Hintergrund:

- Rot: ein Name, den eine andere Zeile seines Blatts hat, das Feld `Domain` eines Begriffs, das eine entfernte Domäne verknüpft, und ein Feld `Term`, das ein verbotenes Wort verwendet.
- Bernsteinfarben: ein Feld `Term`, das ein Synonym oder ein nicht registriertes Wort verwendet.

Eine Zelle übernimmt die stärkere ihrer Stufen. Die Markierungen erscheinen auch in einem schreibgeschützten Editor, und das Blatt `Checks` selbst wird nicht eingefärbt. Zu den Markierungen auf der ERD-Zeichenfläche siehe [Markierungen auf der Zeichenfläche](#marks-on-the-canvas).

### Was jede Prüfung findet {#what-each-check-finds}

| `Type` | Stufe | Findet | `Detail`, zum Beispiel |
| --- | --- | --- | --- |
| `Duplicate name` | Fehler | Ein Wert in `Word`, `Term` oder `Domain`, den auch eine andere Zeile desselben Blatts hat. Jede dieser Zeilen wird aufgeführt. | `Member` |
| `Unknown domain` | Fehler | Eine Spalte oder ein Begriff, die noch mit einer entfernten Domäne verknüpft sind, solange das Blatt `Domains` eine Domäne enthält | Der Name der entfernten Domäne |
| `Forbidden word` | Fehler | Ein Abschnitt eines logischen Namens oder eines Felds `Term`, den ein Wort in seinem Feld `Forbidden Words` aufführt | `커스터머 → 고객` |
| `Unregistered word` | Warnung | Ein Abschnitt des logischen Namens einer Tabelle oder Spalte oder eines Felds `Term`, den kein Wort enthält | `자` |
| `Synonym` | Warnung | Ein Abschnitt, den ein Wort in seinem Feld `Synonyms` aufführt | `멤버 → 회원` |
| `Physical name mismatch` | Warnung | Eine Tabelle oder Spalte, deren logischer Name einem Begriff entspricht, deren physischer Name aber nicht der ist, den der Begriff vorgibt | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Warnung | Eine Spalte, deren `DataType` nicht dem Feld `Data Type` der verknüpften Domäne entspricht | `INT → NUMERIC(15)` |

- Namen werden ohne Leerzeichen an den Enden und unter Beachtung der Groß-/Kleinschreibung verglichen, sodass `Member` und `member` zwei Namen sind, und ein leerer Name ist nie ein Duplikat. Die Blätter lehnen eine Änderung ab, die zwei Zeilen denselben Namen geben würde, daher erscheint `Duplicate name` nur, wo sich zwei Änderungen überschnitten haben, etwa wenn zwei Mitbearbeiter gleichzeitig Zeilen benennen, oder in einer anderswo bearbeiteten Datei.
- Die Wortprüfungen lesen einen Namen wie unter [Aus den Wörtern](#from-the-words) beschrieben und führen jeden unterschiedlichen Abschnitt einmal pro Name auf. `Forbidden word` und `Synonym` bieten das Wort an, das den Abschnitt aufführt.
- `Physical name mismatch` vergleicht den Namen ohne Leerzeichen an den Enden mit dem Feld `Physical Name` des Begriffs oder, solange dieses leer ist, mit dem, was seine Wörter zusammensetzen, und meldet nichts, solange der Begriff keinen Namen vorgibt. Eine Fremdschlüsselspalte, die den logischen Namen ihres Schlüssels übernommen hat, zeigt diese Prüfung immer dann, wenn ihr eigener Name von dem des Begriffs abweicht, etwa `members_id → MBR_ID`. `Derive Physical Name Again` behebt das, es sei denn, eine andere Spalte hat diesen Namen.
- `Domain type mismatch` entsteht nie durch Änderungen in einem einzigen Editor, da eine verknüpfte Spalte am Ende immer den Typ ihrer Domäne hat. Diese Prüfung kann auftreten, wenn ein Mitbearbeiter eine Spalte verknüpft, während ein anderer den Typ dieser Domäne ändert, oder in einer anderswo geschriebenen Datei. Wenn Sie die Domäne in der Domänenzelle der Spalte erneut wählen, erhält die Spalte ihren Typ, und `None` hebt die Verknüpfung auf. Eine Verknüpfung mit einer entfernten Domäne erscheint nur als `Unknown domain`.

### Markierungen auf der Zeichenfläche {#marks-on-the-canvas}

Die ERD-Zeichenfläche zeigt einen Namen, den die Prüfungen melden, in der Farbe seiner Prüfung:

- Eine Zelle des logischen Namens, im Tabellenkopf oder in der Zeile einer Spalte, ist rot, solange ihr logischer Name ein verbotenes Wort verwendet, und sonst bernsteinfarben, solange er ein Synonym oder ein Wort verwendet, das auf dem Blatt `Words` fehlt.
- Eine Zelle des physischen Namens, im Tabellenkopf oder in einer Zeile, ist bernsteinfarben, solange der Begriff, dem ihr logischer Name entspricht, einen anderen physischen Namen vorgibt.

Nur diese beiden Zellarten werden markiert, nie die Domänenzelle oder die Zelle `DataType`, sodass `Unknown domain` und `Domain type mismatch` einer Spalte nur auf dem Blatt `Checks` erscheinen.  
Eine Zelle wird nur für das markiert, was sie zeigt: Die Ansicht `Physical Names` kann nur physische Namen markieren, `Logical Names` nur logische Namen und `Both Names` jede Zelle nach ihren eigenen Prüfungen – siehe [Namensansicht](./logical-names.md#name-view). Eine leere Zelle behält ihre Platzhalterfarbe, und leere Wörterbücher markieren nichts.  
Im Tabellenkopf einer Tabelle in einer eingefärbten [Tabellengruppe](./table-groups.md) behält eine Markierung ihre Farbe nur, solange sie auf der Farbe der Gruppe lesbar bleibt; andernfalls übernimmt der Name das eigene Schwarz oder Weiß des Tabellenkopfs.

Die Markierungen erscheinen auf der ERD-Zeichenfläche, in der [Zeitreise](./undo-redo.md#time-travel) und in der Vorschau des [Automatischen Layouts](./table-related-functions.md#auto-layout), auch in einem schreibgeschützten Editor. Die Registerkarte Visualisierung, die beiden Seiten der [Diff-Ansicht](./table-related-functions.md#diff-viewer) und ein exportiertes Bild zeigen keine.  
Die Markierungen folgen jeder Änderung, sobald sie geschieht, ob an einem Namen oder an einem Wort, einem Begriff oder einer Domäne.

## Suchen {#searching}

Das Suchfeld zeigt `Search` und erscheint auf allen vier Blättern, auch in einem schreibgeschützten Editor. Jedes Blatt hat seine eigene Suche.  
Eine Zeile ist ein Treffer, wenn eine der durchsuchten Zellen den Text enthält, ohne Beachtung der Groß-/Kleinschreibung, der Unicode-Normalform und der Leerzeichen um den Suchbegriff. Ein Treffer reicht nie über zwei Zellen. Die durchsuchten Zellen:

- `Domains`: `Domain`, `Data Type` und `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` und `Description`.
- `Terms`: `Term`, `Physical Name` und `Description`.
- `Checks`: alle drei, so wie sie in der Anzeigesprache lauten.

Eine neue Suche setzt die Auswahl auf die erste Zelle und scrollt nach oben.  
Solange das Feld Text enthält, leert eine Schaltfläche `x` mit dem Tooltip `Clear search` das Feld und lässt den Textcursor darin. `Escape` im Feld leert es ebenfalls.  
Im Feld macht `Ctrl + Z` (Windows/Linux) oder `⌘ + Z` (Mac) Ihre Eingabe rückgängig, nicht die Änderungen am Blatt, und die Zeilentasten aus [Zeilen hinzufügen und löschen](#adding-and-deleting-rows) wirken auf den Text.  
`Add Row` und das Einfügen von Zeilen leeren zuerst die Suche, da eine leere Zeile zu keiner Suche passt. Ein Import behält sie bei.

## Auswählen und Navigieren {#selecting-and-moving}

Die Auswahl im Raster funktioniert wie in einer Tabellenkalkulation:

- Ein Klick wählt eine Zelle aus, und Ziehen wählt einen Bereich aus, wobei am Rand des Blatts gescrollt wird. `Shift + click` erweitert die Auswahl von der aktiven Zelle aus, und `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac) fügt einen weiteren Bereich hinzu.
- Ein Spaltenkopf wählt seine Spalte aus, eine Zeilennummer ihre Zeile und die Ecke oben links jede Zelle, wie `Ctrl + A` (Windows/Linux) oder `⌘ + A` (Mac).
- Auf einem Mac ist `Ctrl + click` ein Rechtsklick – siehe [Das Rastermenü](#the-grids-menu).

Mit der Tastatur:

- Die Pfeiltasten bewegen die Auswahl um eine Zelle und mit gedrückter Taste `Ctrl` (Windows/Linux) oder `⌘` (Mac) in dieser Richtung bis zum Rand des Blatts.
- `Home` und `End` wechseln zur ersten und letzten Zelle der Zeile und mit gedrückter Taste `Ctrl` oder `⌘` zur ersten und letzten Zelle des Blatts.
- `Page Up` und `Page Down` bewegen die Auswahl um eine Bildschirmhöhe an Zeilen.
- Mit gedrückter Taste `Shift` erweitert jede der obigen Tasten stattdessen die Auswahl.
- `Tab` und `Shift + Tab` bewegen die Auswahl nach rechts und links, und `Shift + Enter` bewegt sie nach oben. `Enter` allein bearbeitet die Zelle – siehe [Zellen bearbeiten](#editing-cells).

Wenn Zeilen unter der Auswahl wegfallen, durch ein Rückgängigmachen oder weil ein Mitbearbeiter sie entfernt, wird die Auswahl in die verbleibenden Zeilen zurückgeholt.

Ziehen Sie den rechten Rand eines Spaltenkopfs, um die Breite der Spalte zu ändern, oder doppelklicken Sie auf den Rand, um die Spalte an den breitesten Text in den sichtbaren Zeilen anzupassen. Keine Taste ändert die Breite einer Spalte.

## Zellen bearbeiten {#editing-cells}

Eine Eingabe auf der ausgewählten Zelle ersetzt ihren Wert. `Enter`, `F2` oder ein Doppelklick bearbeitet den vorhandenen Wert, mit dem Textcursor an seinem Ende.  
Eine Zelle enthält eine einzige Zeile, daher wird ein in sie eingefügter Tabulator oder Zeilenumbruch zu einem Leerzeichen.

- `Enter` schreibt die Änderung und bewegt die Auswahl nach unten, und `Tab` schreibt sie und bewegt die Auswahl nach rechts. Mit `Shift` bewegen sie die Auswahl nach oben oder links.
- Ein Klick an eine andere Stelle oder ein Wechsel des Tastaturfokus aus dem Raster schreibt sie ebenfalls.
- `Escape` bricht sie ab.

![Das Blatt Words bearbeiten: NUM über eine Zelle tippen und Enter drücken, mit ⌥ + Enter eine Zeile einfügen und sie mit Tab füllen, im Rastermenü nach Word sortieren, dann nach ord suchen und die Suche mit Esc leeren](/img/demo-dictionary-editing.webp)

Eine Änderung, die den Wert unverändert lässt, schreibt nichts, und eine geschriebene Änderung ist ein Rückgängig-Schritt ihres Blatts, wie viel auch getippt wurde.  
`Delete` oder `Backspace` leert ohne geöffnete Bearbeitung jede ausgewählte Zelle, in einem Schritt.  
Solange eine Bearbeitung geöffnet ist, machen die Tasten für Rückgängig und Wiederholen Ihre Eingabe in der Zelle rückgängig und wiederholen sie, und die Zeilentasten wirken als Texteingabe – siehe [Tasten auf der Registerkarte](#keys-on-the-tab).  
Jede Zelle auf `Checks` und jede Zelle in einem schreibgeschützten Editor ist schreibgeschützt und öffnet keine Bearbeitung.

Wird eine Zeile einer Änderung, eines Einfügens oder eines Leerens abgelehnt, wird nichts davon gespeichert, und eine Fehlermeldung gibt den Grund an, zählt die Zeilen und nennt die ersten drei:

- Ein Name, den eine andere Zeile des Blatts hat oder den eine andere Zeile desselben Einfügens schreibt: `Nothing saved: 1 row shares a name with another row (Member)` oder `Nothing saved: 2 rows share a name with another row (…)`. Namen werden ohne Leerzeichen an den Enden und unter Beachtung der Groß-/Kleinschreibung verglichen, sodass sich `Member` und `member` unterscheiden. Ein leerer Name wird nie abgelehnt.
- Ein Feld `Domain` eines Begriffs mit einem Text, den keine Domäne auf dem Blatt `Domains` als Namen hat: `Nothing saved: 1 row names an unknown domain (…)`.
- Eine Zeile, die ein Mitbearbeiter entfernt hat, während Sie sie bearbeitet haben: `Nothing saved: the row was removed`.

Ein Schreibvorgang kann über seine Zelle hinausreichen:

- Ein Begriff, dessen Feld `Term` gefüllt wird, während sein Feld `Physical Name` leer ist, erhält den Namen, der sich aus seinen Wörtern zusammensetzt, sofern sich einer zusammensetzen lässt – siehe [Aus den Wörtern](#from-the-words). Das geschieht einmal: Der Name wird nicht neu zusammengesetzt, wenn sich die Wörter später ändern.
- Ein neuer Wert im Feld `Data Type` einer Domäne ändert den Typ jeder mit der Domäne verknüpften Spalte, im selben Rückgängig-Schritt – siehe [Domänen und Datentypen](#domains-and-data-types).

### Die Domäne eines Begriffs {#a-terms-domain}

`Enter`, `F2` oder ein Doppelklick auf die Zelle `Domain` eines Begriffs öffnet eine Liste unter der Zelle oder darüber, wo mehr Platz ist, mit einem Suchfeld, das `Domain` zeigt.  
Die Liste enthält `None` und dann jede benannte Domäne in der Reihenfolge des Blatts `Domains`, und die Hervorhebung beginnt auf der Domäne, die der Begriff verknüpft, oder auf `None`. Die Eingabe eines Zeichens auf der Zelle öffnet die Liste, bereits nach diesem Zeichen gefiltert.

- Eine Eingabe grenzt die Liste ohne Beachtung der Groß-/Kleinschreibung auf die Domänen ein, deren Namen den Text enthalten, entfernt `None` und hebt den ersten Treffer hervor.
- `↑` und `↓` verschieben die Hervorhebung, die an beiden Enden zum jeweils anderen Ende springt.
- `Enter` oder `Tab` wählt die hervorgehobene Zeile, ein Klick die angeklickte Zeile, als ein Rückgängig-Schritt. Der Begriff verknüpft genau die gewählte Domäne, auch eine von zwei Domänen mit demselben Namen, und `None` hebt seine Verknüpfung auf.
- `Escape` oder ein Klick außerhalb schließt die Liste, ohne Eingegebenes zu schreiben.

Gibt es auf dem Blatt `Domains` keine benannte Domäne, öffnet sich das Feld ohne Liste.  
Eingefügter Text verknüpft die erste aufgeführte Domäne mit diesem Namen, leerer Text hebt die Verknüpfung auf, und Text, der dem Inhalt der Zelle entspricht, lässt die Verknüpfung, wie sie ist. Jeder andere Name wird abgelehnt – siehe [Zellen bearbeiten](#editing-cells). `Delete` oder `Backspace` auf der Zelle hebt die Verknüpfung des Begriffs auf, auch die mit einer entfernten Domäne.

## Kopieren und Einfügen {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) oder `⌘ + C` (Mac) kopiert die Auswahl als tabulatorgetrennten Text, eine Textzeile pro Zeile, so wie Tabellenkalkulationen ihn schreiben, sodass er sich als Zellen in eine Tabellenkalkulation einfügen lässt. Ein Tabulator oder Zeilenumbruch innerhalb eines Werts wird zu einem Leerzeichen.  
Mehrere Bereiche werden nur dann zusammen kopiert, wenn sie dieselben Zeilen nebeneinander oder dieselben Spalten übereinander umfassen. Andernfalls wird nichts kopiert, und die Fehlermeldung `Nothing copied: the ranges share no rows or columns` erscheint.

`Ctrl + V` (Windows/Linux) oder `⌘ + V` (Mac) fügt tabulatorgetrennten Text, etwa aus einer Tabellenkalkulation kopierte Zellen, ab der aktiven Zelle nach unten und rechts ein:

- Anführungszeichen werden als Text eingefügt, sodass eine Zelle einer Tabellenkalkulation mit einem Zeilenumbruch nicht als eine Zelle eingefügt wird.
- Ein einzelner Wert füllt jeden ausgewählten Bereich.
- Zeilen nach der letzten Zeile werden der Reihe nach als neue Zeilen hinzugefügt, sodass ein Einfügen in ein leeres Blatt es füllt.
- Spalten nach der letzten Spalte entfallen, und sobald der Rest gespeichert ist, weist die Meldung `Columns past the last one weren't pasted` darauf hin.
- Ein Einfügen mehrerer Zellen wählt anschließend den geschriebenen Block aus.

Ein Einfügen ist ein Rückgängig-Schritt, einschließlich der hinzugefügten Zeilen, und wird bei einem doppelten Namen oder einer unbekannten Domäne als Ganzes abgelehnt – siehe [Zellen bearbeiten](#editing-cells).  
Ein Kopieren, Einfügen oder Leeren über mehr als eine Million Zellen bewirkt nichts, und die Fehlermeldung `Nothing done: the selection covers too many cells` erscheint.  
Ausschneiden, `Ctrl + X` (Windows/Linux) oder `⌘ + X` (Mac), bewirkt auf einem Blatt nichts. Kopieren und Einfügen auf dieser Registerkarte erreichen nie das Diagramm, und solange eine Zellbearbeitung geöffnet ist, wirken sie auf den Text in der Zelle.

## Zeilen hinzufügen und löschen {#adding-and-deleting-rows}

`Add Row` fügt am Ende des Blatts eine leere Zeile hinzu. Die Schaltfläche leert die Suche, wählt die erste Zelle der neuen Zeile aus und gibt dem Raster den Tastaturfokus, sodass eine Eingabe diese Zelle füllt.  
`Delete Rows` entfernt jede Zeile, die die Auswahl in einer beliebigen Spalte umfasst, und ein einziges Rückgängigmachen stellt sie alle an ihren Plätzen wieder her. Der Tooltip der Schaltfläche nennt die Taste, die dasselbe bewirkt.

Wenn das Raster den Tastaturfokus hat und keine Zelle bearbeitet wird:

- `Alt + Enter` (Windows/Linux) oder `⌥ + Enter` (Mac) fügt unterhalb der Auswahl so viele leere Zeilen ein, wie sie umfasst.
- `Alt + Shift + Enter` (Windows/Linux) oder `⌥ + Shift + Enter` (Mac) fügt sie oberhalb ein.
- `Alt + Backspace` oder `Alt + Delete` (Windows/Linux) bzw. `⌥ + Backspace` oder `⌥ + Delete` (Mac) löscht die Zeilen, die die Auswahl umfasst.

Die Tasten bewirken dasselbe wie die Einträge zum Einfügen und Löschen von Zeilen im Rastermenü – siehe [Das Rastermenü](#the-grids-menu). Ein Einfügen leert die Suche und setzt die neuen Zeilen direkt über die erste Zeile, die die Auswahl umfasst, oder direkt unter ihre letzte. Es wählt sie in der ersten Spalte aus, wobei die erste von ihnen aktiv ist, und ist ein Rückgängig-Schritt.

Diese Tasten sind die Belegungen `Add Column` und `Remove Column` der Registerkarte [Tastenkombinationen](./settings.md#shortcuts), sodass ein Host, der diese Belegungen mit [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) ändert, damit auch die Zeilentasten ändert. `Alt + Shift + Enter` ist die Taste von `Add Column` mit zusätzlichem `Shift` und hat dort keine eigene Zeile.  
In einer geöffneten Bearbeitung und im Suchfeld wirken sie auf den Text, sodass `⌥ + Backspace` auf einem Mac ein Wort löscht. Auf `Checks` und in einem schreibgeschützten Editor bewirken sie nichts. Auf dieser Registerkarte fügen sie einer Tabelle nie eine Spalte hinzu und entfernen auch keine.  
In Obsidian erreichen sie die Registerkarte auch dann, wenn ein Hotkey von Obsidian dieselbe Taste verwendet.

Eine nie ausgefüllte Zeile oder eine, deren Werte alle geleert wurden, erscheint auf ihrem Blatt und erreicht Mitbearbeiter, doch die Datei lässt sie weg, sodass sie fehlt, wenn das Diagramm erneut geöffnet wird.

## Das Rastermenü {#the-grids-menu}

Klicken Sie mit der rechten Maustaste auf eine Zelle der Blätter `Domains`, `Words` oder `Terms`, um das Rastermenü zu öffnen. Eine Zelle außerhalb der Auswahl wird zuerst zur Auswahl.  
Ein Rechtsklick unterhalb der letzten Zeile oder rechts der letzten Spalte öffnet es für die bestehende Auswahl, sodass es sich auf einem leeren Blatt überall unter den Spaltenköpfen öffnet. Die Menütaste oder `Shift + F10` öffnet es für die aktive Zelle.

- `Insert 1 row above`, `Insert 1 row below` und `Delete 1 row`, jeweils mit der Anzahl der Zeilen, die die Auswahl umfasst, etwa `Insert 3 rows above`, und mit der zugehörigen Taste rechts – siehe [Zeilen hinzufügen und löschen](#adding-and-deleting-rows).
- `Sort by <column>, ascending` und `Sort by <column>, descending`, die die Spalte nennen, auf die Sie mit der rechten Maustaste geklickt haben, etwa `Sort by Word, ascending` – siehe [Sortieren](#sorting). Rechts der letzten Spalte entfallen sie.
- `Import CSV` und `Export CSV`, die dasselbe bewirken wie die Schaltflächen der Leiste – siehe [CSV importieren und exportieren](#importing-and-exporting-csv).

Wenn keine Zeile angezeigt wird, auf einem leeren Blatt oder bei einer Suche ohne Treffer, erscheinen nur `Insert 1 row below`, `Import CSV` und `Export CSV`.  
`Checks` und ein schreibgeschützter Editor öffnen stattdessen das eigene Menü des Browsers, ebenso ein Rechtsklick auf einen Spaltenkopf oder eine Scrollleiste.  
Das Menü schließt sich bei der Wahl eines Eintrags, bei `Escape`, beim Drücken an einer anderen Stelle der Registerkarte, wenn sich die Auswahl oder das Blatt ändert und wenn sich die Zeilen des Blatts ändern, durch Ihre Änderung oder die eines Mitbearbeiters.

## Sortieren {#sorting}

`Sort by <column>, ascending` und `Sort by <column>, descending` ordnen die Zeilen des Blatts selbst neu an, nicht nur die Ansicht. Die neue Reihenfolge wird in der Datei gespeichert, ist für Mitbearbeiter sichtbar und wird von `Export CSV` übernommen, und ein einziges Rückgängigmachen stellt die alte Reihenfolge wieder her.  
Zeilen werden nach dem Text verglichen, den die Zelle zeigt, das Feld `Domain` eines Begriffs nach dem Namen der Domäne, in der alphabetischen Reihenfolge der Anzeigesprache, wobei Zahlen nach ihrem Wert verglichen werden, sodass `2` vor `10` kommt. Leere Zellen kommen in beiden Richtungen zuletzt, und gleichwertige Zeilen behalten ihre Reihenfolge. Das Sortieren eines Blatts, das bereits so geordnet ist, zeichnet nichts auf.  
Die Suche bleibt, wie sie war, ebenso die Auswahl, deren Zellen nun andere Zeilen enthalten.

## CSV importieren und exportieren {#importing-and-exporting-csv}

`Domains`, `Words` und `Terms` werden jeweils aus einer CSV-Datei importiert und in eine exportiert. Diese Dateien gehören allein der Registerkarte Wörterbuch: `Import` und `Export` im Kontextmenü der Zeichenfläche lesen und schreiben sie nicht – siehe [Dateien importieren oder exportieren](./file-import-export.md).

### Importieren {#importing}

`Import CSV` auf der Leiste oder im Rastermenü öffnet die eigene Dateiauswahl des Browsers für Dateien `.csv`, nicht den Importdialog des Hosts. Wenn Sie dieselbe Datei erneut wählen, wird sie erneut importiert.  
Die Datei gelangt in das Wörterbuch, das ihre Kopfzeile nennt, unabhängig davon, welches Blatt angezeigt wird, und die Registerkarte zeigt dann dieses Blatt und gibt seinem Raster den Tastaturfokus. Das Blatt behält seine Suche, Auswahl und Scrollposition, sodass Zeilen, die die Suche ausblendet, oder unterhalb des sichtbaren Bereichs hinzugefügte Zeilen nicht zu sehen sind.  
Die Datei wird als UTF-8 gelesen, mit oder ohne Byte Order Mark (BOM), oder als EUC-KR, wenn sie kein gültiges UTF-8 ist, wie es bei älteren Dateien des Standards für öffentliche Daten der Fall ist.

![Die Registerkarte Wörterbuch über die Symbolleiste öffnen, dann mit Import CSV Domänen, Wörter und Begriffe importieren, wobei jede Datei die Registerkarte auf ihr eigenes Blatt umschaltet und meldet, was sie hinzugefügt hat](/img/demo-dictionary-import.webp)

Wie die Zeilen übernommen werden:

- Jede Zeile mit einem Namen aktualisiert die Zeile des Blatts mit diesem Namen, und zwar in den Feldern, für die die Datei Spalten hat. Spalten, die in der Datei fehlen, lassen die entsprechenden Felder unverändert. Namen werden ohne Leerzeichen an den Enden und unter Beachtung der Groß-/Kleinschreibung verglichen.
- Namen, die auf dem Blatt fehlen, werden in der Reihenfolge der Datei nach seiner letzten Zeile hinzugefügt.
- Ein Import entfernt nie eine Zeile.
- Eine Zeile mit leerem Namen wird übersprungen. Enthält die Datei einen Namen zweimal, gewinnt die spätere Zeile, und die frühere gilt als übersprungen. Leerzeilen sind keine Zeilen.
- Die Domäne eines Begriffs wird über ihren Namen gefunden, als erste Domäne dieses Namens, und ein Name, den keine Domäne hat, lässt den Begriff ohne Verknüpfung, importieren Sie daher zuerst die Domänen.

Ein Import ist ein Rückgängig-Schritt dieses Blatts.  
Die Meldung lautet dann zum Beispiel `1 added · 1 updated · 2 skipped`. Eine Zeile, die der des Blatts gleicht, zählt weder als hinzugefügt noch als aktualisiert, sodass ein erneuter Import derselben Datei nichts ändert und keinen Schritt aufzeichnet.  
Nennen die Begriffe der Datei Domänen, die im Diagramm fehlen, nennt eine zweite Zeile die ersten drei, etwa `4 unknown domains: 연월일, 금액, 번호`.  
Eine Datei, deren Kopfzeile zu keinem Layout passt oder zu zweien, bringt nichts ein, und die Fehlermeldung `Couldn't read this file as words, terms or domains` erscheint.

### Dateilayouts {#file-layouts}

Jedes Wörterbuch liest zwei Layouts. Das erste ist das eigene Layout des Editors, das `Export CSV` schreibt, mit den Feldnamen als Kopfzeile:

| Wörterbuch | Kopfzeile | Eine Datei benötigt |
| --- | --- | --- |
| Words | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Terms | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domains | `name,category,dataType,description` | `name`, `dataType` |

Die Spalten können in beliebiger Reihenfolge stehen, die Spalte `domain` eines Begriffs enthält den Namen der Domäne, und jede andere Spalte wird ignoriert. In der Kopfzeile wird die Groß-/Kleinschreibung beachtet, und die Zellen werden genau so gelesen, wie sie geschrieben sind, Leerzeichen eingeschlossen.

Das zweite ist das Layout der Dateien des koreanischen Standards für öffentliche Daten (공통표준):

| Wörterbuch | Eine Datei benötigt | Ebenfalls gelesen |
| --- | --- | --- |
| Words | `공통표준단어명` | `공통표준단어영문약어명` (Abkürzung), `공통표준단어 영문명` (englischer Name), `공통표준단어 설명` (Beschreibung), `이음동의어 목록` (Synonyme), `금칙어 목록` (verbotene Wörter) |
| Terms | `공통표준용어명` | `공통표준용어영문약어명` (physischer Name), `공통표준도메인명` (Domäne, nach Name), `공통표준용어설명` (Beschreibung), `용어 이음동의어 목록` (Synonyme) |
| Domains | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (Kategorie), `공통표준도메인설명` (Beschreibung), `데이터길이`, `데이터소수점길이` |

Die Spalten `데이터타입`, `데이터길이` und `데이터소수점길이` einer Domäne werden zu einem Datentyp zusammengefügt: `NUMERIC(15,2)`, `CHAR(8)`, nur der Typ, wo es keine Länge gibt, etwa `DATE`, und 0 Nachkommastellen entfallen, wie in `NUMERIC(15)`.  
In diesen Dateien werden Leerzeichen an den Enden der Zellen entfernt, und andere Spalten, etwa die Änderungshistorie, werden ignoriert.  
In beiden Layouts spielen Leerzeichen in einem Spaltennamen der Kopfzeile keine Rolle.

### Exportieren {#exporting}

`Export CSV` auf der Leiste oder im Rastermenü speichert das angezeigte Blatt im eigenen Layout des Editors: jede Zeile in der Reihenfolge des Blatts, unabhängig davon, was die Suche zeigt, wobei die Domäne eines Begriffs mit ihrem Namen geschrieben oder bei einer entfernten Domäne leer gelassen wird.  
Die Datei ist UTF-8 mit Byte Order Mark und CRLF-Zeilenenden, und nur ein Feld, das ein Anführungszeichen, ein Komma oder einen Zeilenumbruch enthält, wird in Anführungszeichen gesetzt. Sie lässt sich in einer Tabellenkalkulation öffnen und ergibt beim erneuten Import dieselben Zeilen.  
Sie heißt `<database name>-<timestamp>-words.csv`, `-terms.csv` oder `-domains.csv` und wird so gespeichert wie die anderen Exporte des Editors – siehe [Exportieren](./file-import-export.md#exporting).

`Checks` hat keinen Export, und ein schreibgeschützter Editor bietet weder Import noch Export an.

## Rückgängig und Wiederholen {#undo-and-redo}

`Domains`, `Words` und `Terms` haben jeweils einen eigenen Verlauf, getrennt von dem des Diagramms. Auf dieser Registerkarte wirken `Ctrl + Z` und `Ctrl + Shift + Z` (Windows/Linux) oder `⌘ + Z` und `⌘ + Shift + Z` (Mac) sowie die Schaltflächen `Undo` und `Redo` der Symbolleiste auf das angezeigte Blatt, und die Symbolleiste zeigt keine Schaltfläche `Time Travel`. Auf `Checks` bewirken sie nichts.  
Rückgängig auf der Registerkarte ERD nimmt nie eine Änderung an einem Blatt zurück – siehe [Wörterbuchblätter](./undo-redo.md#dictionary-sheets).

## Tasten auf der Registerkarte {#keys-on-the-tab}

Solange die Registerkarte den Tastaturfokus hat, wirken diese Tastenkombinationen des Editors – siehe [Tastenkombinationen](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac), öffnet die [Schnellsuche](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac), wechselt zur Registerkarte ERD und öffnet den [Explorer](./explorer.md#opening-and-closing) mit seiner Suche.
- `Undo` und `Redo` wirken auf das angezeigte Blatt – siehe [Rückgängig und Wiederholen](#undo-and-redo).
- `Add Column` und `Remove Column` fügen Zeilen ein und löschen sie – siehe [Zeilen hinzufügen und löschen](#adding-and-deleting-rows).

Solange eine Zellbearbeitung geöffnet ist, einschließlich der Domänenliste eines Begriffs, bewirken `Search` und `Toggle Explorer` nichts, sodass der eingegebene Text nicht verloren geht.

Jede andere Tastenkombination des Editors bleibt in der Registerkarte und erreicht nie die Zeichenfläche: `Alt + N` (Windows/Linux) oder `⌥ + N` (Mac) fügt keine Tabelle hinzu, und `Delete` und `Backspace` löschen nichts auf der Zeichenfläche.  
Stattdessen wirken die eigenen Tasten des Rasters auf das Blatt: `Enter` bearbeitet die Zelle, `Delete` und `Backspace` leeren die ausgewählten Zellen, `Ctrl + A` (Windows/Linux) oder `⌘ + A` (Mac) wählt jede Zelle aus, und `Escape` bricht eine Bearbeitung ab, schließt das Rastermenü oder leert das Suchfeld. Kopieren, Ausschneiden und Einfügen bleiben ebenfalls auf der Registerkarte – siehe [Kopieren und Einfügen](#copying-and-pasting).

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit [`readonly`](../../api/erd-editor-element.md#readonly) öffnet sich die Registerkarte und zeigt jedes Blatt.  
Das Wechseln von Blättern, Suchen, Auswählen, Scrollen, Ändern von Spaltenbreiten und Kopieren funktionieren wie gewohnt, ebenso der Wechsel zu einer Prüfung von `Checks` aus mit `Enter` oder einem Doppelklick. Auch die Markierungen der Prüfungen erscheinen.

Keine Zelle lässt sich bearbeiten, durch Einfügen ändern oder leeren, und jede Zelle, die keine Prüfung markiert, erscheint auf dem grauen Hintergrund schreibgeschützter Zellen.  
`Add Row`, `Delete Rows`, `Import CSV` und `Export CSV` sind ausgeblendet, die Zeilentasten bewirken nichts, und ein Rechtsklick öffnet das Menü des Browsers. Ein leeres Blatt zeigt keinen Hinweis, und die Symbolleiste zeigt weder `Undo` noch `Redo`.

## Mitbearbeiter und die Datei {#collaborators-and-the-file}

Die Datei des Diagramms enthält die Wörter, Begriffe und Domänen in der Reihenfolge ihres Blatts, auch nach einer Sortierung, und lässt eine Zeile ohne Wert weg.  
Sie enthält außerdem den logischen Namen jeder Tabelle und Spalte, ob jeder physische Name von den Wörterbüchern stammt, und die Domänenverknüpfung jeder Spalte, solange die Domäne aufgeführt ist. Die Prüfungen und die Markierungen werden daraus ermittelt und nie gespeichert.

In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) sehen die Editoren die Wörterbuchänderungen der anderen, sobald sie eintreffen, einschließlich Sortierungen und eingefügter Zeilen. Jeder behält sein eigenes Blatt, seine Suche und seine Auswahl, und die Verläufe seiner Blätter enthalten nur seine eigenen Änderungen.  
Eine Änderung oder ein Einfügen in eine Zeile, die ein Mitbearbeiter inzwischen entfernt hat, speichert nichts, und die Meldung `Nothing saved: the row was removed` erscheint.  
Ein Editor einer Version vor Einführung der Registerkarte Wörterbuch speichert das Diagramm ohne seine logischen Namen, Domänenverknüpfungen und Wörterbücher – siehe [Gemischte Versionen](../../api/advanced/collaborative-editing.md#mixing-releases).

Ein `Import` von Schema SQL, GraphQL, DBML oder AML behält die Wörterbücher bei, ein `Import` von JSON ersetzt sie durch die der Datei, und `Import and Add` bringt keine ein – siehe [Externe Dateien importieren](./file-import-export.md#importing-external-files).  
Ein Coding-Agent bearbeitet über den MCP-Server die Wörter, Begriffe und Domänen, setzt logische Namen und Domänen, leitet physische Namen neu ab und führt die Prüfungen auf – siehe [Wörterbücher](../../mcp/tools.md#dictionaries) und [Wörterbuchprüfungen](../../mcp/tools.md#dictionary-checks). Für CSV-Dateien hat er kein Tool.
