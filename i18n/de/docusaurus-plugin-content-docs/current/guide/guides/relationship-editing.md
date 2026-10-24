---
sidebar_position: 7
description: Eine Beziehung löschen, ihren Typ ändern, ihre Aktionen für ON DELETE und ON UPDATE festlegen, sie im Dialog „Spalten zuordnen“ vorhandenen Spalten zuordnen, die Notation der Verbindungslinien lesen, mit N:M- und identifizierenden Beziehungen arbeiten und sehen, was neue Fremdschlüsselspalten von ihrem Schlüssel übernehmen und wie sie benannt werden.
---

# Beziehungen bearbeiten

Beziehungen werden über das Kontextmenü der Zeichenfläche, die Symbolleiste der Zeichenfläche, die [Schnellsuche](./quick-search.md#what-the-palette-lists) oder mit einer Tastenkombination gezeichnet – siehe [Mit dem Bearbeiten beginnen](./editing-start.md).  
Diese Seite beschreibt, was Sie mit einer Beziehung tun können, sobald sie existiert, wie der Dialog [Spalten zuordnen](#map-columns) eine Beziehung auf Spalten enden lässt, die die Kindtabelle bereits hat, und wie die Fremdschlüsselspalten benannt werden, die sie hinzufügt.

## Löschen {#deletion}

Das Löschen ist über das Kontextmenü der Beziehung möglich.

![Die Beziehung von products zu reviews über ihr Kontextmenü löschen](/img/demo-relationship-remove.webp)

Dafür gibt es keine Tastenkombination, weil eine Beziehung nicht so ausgewählt wird wie eine Tabelle oder eine Notiz: Die Tasten `Delete` und `Backspace`, die das Ausgewählte löschen, entfernen nie eine Beziehung für sich allein – siehe [Tabellen und Notizen löschen](./table-related-functions.md#table-and-memo-deletion).  
Beziehungen werden außerdem zusammen mit dem entfernt, was sie verbinden: Das Löschen einer Tabelle entfernt jede mit ihr verbundene Beziehung, und das Löschen einer Spalte entfernt jede Beziehung, die sie verwendet.

## Typ ändern {#type-change}

Der Typ lässt sich über den Eintrag `Relationship Type` im Kontextmenü der Beziehung ändern.  
Es stehen vier Typen zur Auswahl, und der aktuelle ist mit einem Häkchen markiert:

- Zero One
- Zero N
- One Only
- One N

![Eine Beziehung in ihrem Kontextmenü von Zero N zu One Only und dann zu One N ändern](/img/demo-relationship-type.webp)

Es sind dieselben vier Typen, mit denen Sie eine Beziehung beginnen, jeder mit einer eigenen Tastenkombination – siehe [Mit dem Bearbeiten beginnen](./editing-start.md).

## ON DELETE und ON UPDATE {#on-delete-and-on-update}

Beide werden über die Einträge `On Delete` und `On Update` im Kontextmenü der Beziehung festgelegt, zwischen `Relationship Type` und `Map Columns`.  
Jeder bietet dieselben sechs Einträge, und der aktuelle ist mit einem Häkchen markiert:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

`Not set` schreibt keine Klausel, daher gilt das eigene Standardverhalten der Datenbank. Eine neue Beziehung, ob gezeichnet oder im Dialog [Spalten zuordnen](#map-columns) erstellt, beginnt mit `Not set` für beide, und die spätere Wahl von `Not set` hebt eine Aktion wieder auf.  
Die beiden sind voneinander unabhängig: Wenn Sie eine ändern, bleibt die andere unverändert.  
Die Verbindungslinie zeigt, was festgelegt ist – siehe [Verbindungslinien lesen](#reading-a-connector).  
Eine Beziehung, die zusammen mit ihren Tabellen kopiert und eingefügt oder dupliziert wird, behält beide Aktionen, und beim Import von Schema SQL, DBML oder AML werden die Aktionen übernommen, die die Datei deklariert – siehe [Dateien importieren oder exportieren](./file-import-export.md).

![ON DELETE CASCADE und ON UPDATE RESTRICT für die Beziehung von orders zu order_items über ihr Kontextmenü festlegen, wobei ihre Beschriftung D:C U:R lautet, dann mit dem Zeiger darauf zeigen, um beide abzulesen](/img/demo-referential-actions.webp)

Jede Aktion kann unabhängig von der Datenbank gewählt werden.  
Neben einer Aktion, die die ausgewählte [Datenbank](./table-related-functions.md#databases) in ihrem Schema SQL weglässt, steht ein abgeschwächt dargestellter Hinweis, etwa `not in MySQL`. `Not set` trägt nie einen, und ein Wechsel der Datenbank aktualisiert die Hinweise.  
Eine Aktion mit Hinweis wird trotzdem in der Beziehung gespeichert: Die Verbindungslinie zeigt sie, und JSON, DBML und AML behalten sie bei, aber das Schema SQL dieser Datenbank lässt die Klausel weg, sodass das Standardverhalten der Datenbank gilt.

[Schema SQL](./schema-sql.md) schreibt diese Aktionen und lässt die übrigen weg:

| Datenbank | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | keine |
| PostgreSQL | alle fünf | alle fünf |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | alle fünf | alle fünf |

Das Schema SQL für Snowflake schreibt außerdem einen Kommentar, der jede weggelassene Aktion nennt – siehe [Referenzielle Aktionen](./schema-sql.md#referential-actions).

Welche Aktionen die ORM-Ziele des Codegenerators schreiben, hängt sowohl vom Ziel als auch von der ausgewählten Datenbank ab – siehe [Codegenerator](./code-generator.md#on-delete-and-on-update).

## Spalten zuordnen {#map-columns}

Der Dialog „Spalten zuordnen“ ordnet den Schlüssel der Elterntabelle Spalten der Kindtabelle zu, eine Zeile pro Schlüsselspalte.  
Jede Zeile verwendet entweder eine Spalte, die die Kindtabelle bereits hat, oder fügt eine neue Fremdschlüsselspalte hinzu, sodass eine Beziehung auf bereits vorhandenen Spalten enden kann.

![Von members aus eine Beziehung vom Typ Zero N zu orders zeichnen, Map to existing columns wählen und id der vorhandenen Spalte member_id zuordnen](/img/demo-map-columns.webp)

Er lässt sich auf zwei Arten öffnen:

- Beim Zeichnen einer Beziehung über `Map to existing columns` neben der Kindtabelle – siehe [Beziehungen erstellen](./editing-start.md#relationship-creation). `Map` fügt dann eine Beziehung des gerade gezeichneten Typs hinzu.
- Über `Map Columns` im Kontextmenü der Beziehung, um die Spalten einer vorhandenen Beziehung zu ändern. `Save` schreibt dann die Änderung. In einem schreibgeschützten Editor entfällt dieser Eintrag.

Der Untertitel des Dialogs nennt die beiden Tabellen und den Beziehungstyp, etwa `users → posts · One N`. Der Typ wird hier angezeigt, aber nicht geändert – verwenden Sie dafür [Typ ändern](#type-change).

Im gesamten Dialog, einschließlich der Hinweise und Textzeilen unter den Zeilen und der Meldung, mit der er sich schließt, werden Tabellen und Spalten so benannt, wie die [Namensansicht](./logical-names.md#beyond-the-canvas) sie benennt.  
Drei Dinge bleiben physisch: jeder Datentyp, der der eigene der Spalte ist und nie der Name ihrer Domäne; der Eintrag `New column: <name>`, der den Namen zeigt, den die neue Spalte erhalten wird; und die Zeilen, die bei `Map` anfangs ausgefüllt sind und nach Name zugeordnet werden, nie nach logischem Namen.

In `References` wählen Sie den Schlüssel, auf den die Beziehung verweist: `Primary Key` mit seinen Spalten in Tabellenreihenfolge, dann `Unique: <column>` für jede als `Unique` markierte Spalte. Das Feld wird nur angezeigt, wenn es mehr als eine Auswahl gibt.  
Ein eindeutiger Index zählt hier nicht als Schlüssel, und eine Spalte mit `Unique`, die den gesamten Primärschlüssel bildet, wird nicht doppelt aufgeführt.  
Die Wahl eines anderen Schlüssels baut die Zeilen neu auf. Eine Zeile behält ihre Auswahl, solange die betreffende Spalte noch in der Kindtabelle ist.

Unter den Überschriften `Referenced column` und `Foreign key column` zeigt jede Zeile eine Spalte des Schlüssels mit ihrem Datentyp sowie eine Liste der Spalten der Kindtabelle, denen sie zugeordnet werden kann:

- `Pick a column` lässt die Zeile leer.
- `New column: <name>` fügt eine neue Fremdschlüsselspalte hinzu. Der angezeigte Name ist der, den sie erhalten wird, wie in [Namen der Fremdschlüsselspalten](#foreign-key-column-names) beschrieben, nummeriert unter Berücksichtigung der Spalten der Kindtabelle und der anderen Zeilen, die eine neue Spalte hinzufügen. Der Eintrag wird nicht angeboten, wenn der Name leer wäre, wie bei einem Schlüssel ohne Namen.
- Jede Spalte der Kindtabelle, als `<name> (<data type>)`. Eine Spalte, die eine andere Zeile ausgewählt hat, erscheint als `<name> (<data type>) · in use` und kann nicht ausgewählt werden, sodass sich keine zwei Zeilen eine Spalte teilen. Eine Spalte, die bereits eine andere Beziehung verwendet, kann trotzdem ausgewählt werden, sodass etwa eine gemeinsam genutzte Spalte `tenant_id` mehreren Beziehungen dienen kann.

Bei `Map` ist eine Zeile anfangs nur dann ausgefüllt, wenn genau eine Spalte der Kindtabelle, ohne Beachtung der Groß-/Kleinschreibung, den Namen trägt, den eine neue Fremdschlüsselspalte für sie vor einer etwaigen Nummerierung mit `_2` erhielte, etwa `users_id` für `id` in `users` und `member_id` für `member_id`. Solange [`Bracket`](./schema-sql.md#database-and-bracket) den Standardwert `None` hat, zählt auch der Name, der aus dem Tabellenteil eines schemaqualifizierten Tabellennamens gebildet wird, sodass `id` in `public.users` der Spalte `public.users_id` oder `users_id` zugeordnet wird. Bei einem Schlüssel vom Typ `Unique` zählt auch der eigene Name der Schlüsselspalte, sodass `vin` der Spalte `vin` zugeordnet wird. Jede andere Zeile beginnt mit `Pick a column`.  
Bei `Save` beginnt jede Zeile mit der Spalte, die die Beziehung derzeit verwendet. In beiden Fällen füllt die Wahl eines anderen Schlüssels in `References` die leeren Zeilen dieses Schlüssels anhand derselben Namen.

Wenn sich der Datentyp einer ausgewählten Spalte von dem unterscheidet, den die Elternspalte einem Fremdschlüssel gibt, weist ein Hinweis unter der Zeile darauf hin.  
Ist [Datentyp-Synchronisierung für Beziehungen](./settings.md#relationship-datatype-sync) eingeschaltet und hat die Elternspalte einen Datentyp, lautet er `<column> becomes <type>` und nennt den Typ, den die Zuordnung schreiben wird. Andernfalls lautet er `Types differ: <parent type> and <child type>`, und die Spalte behält ihren Typ.

Die Schaltfläche `Map` oder `Save` bleibt deaktiviert, solange etwas im Weg steht, und ein Text unter den Zeilen nennt den Grund:

- `Pick a foreign key column for every referenced column`: Eine Zeile ist noch leer.
- `At least one column must reference a different column`: eine selbstreferenzierende Beziehung, in der jede Zeile ihre eigene Elternspalte auswählt.
- `These columns are already linked by another relationship`: Eine andere Beziehung zwischen denselben beiden Tabellen verbindet genau diese Spalten.
- `<parent> has no key to reference`: Bei `Map` hat die Elterntabelle weder einen Primärschlüssel noch eine Spalte mit `Unique`.

`Save` bleibt außerdem deaktiviert, bis sich die Zuordnung von der aktuellen Zuordnung der Beziehung unterscheidet.  
Bei `Save` zeigt eine Zeile `(removed)`, wenn ihre Spalte nicht mehr in ihrer Tabelle ist. Wählen Sie eine andere Spalte der Kindtabelle oder, bei einer nicht mehr vorhandenen Elternspalte, einen Schlüssel in `References`. Bei `Map` springt eine Zeile, deren ausgewählte Spalte entfernt wird, auf `Pick a column` zurück.

Eine Beziehung, deren Elternspalten nicht genau einem der Schlüssel der Elterntabelle entsprechen, öffnet sich mit einer zusätzlichen Auswahl am Ende von `References`, `Current columns (not a key)`, die diese Spalten unverändert lässt. Hat die Elterntabelle überhaupt keinen Schlüssel, ist das die einzige Auswahl, und `References` wird nicht angezeigt.  
Dort ist der Text `The referenced columns are not a key of <parent>` oder, wenn die Elterntabelle überhaupt keinen Schlüssel hat, `<parent> has no key to reference` ein Hinweis und kein Fehler: `Save` funktioniert weiterhin, sodass Sie die Spalten der Kindtabelle ändern und die Referenz beibehalten können.  
Eine Beziehung, deren zwei Spaltenlisten sich nicht paarweise zuordnen lassen, zum Beispiel weil sie unterschiedlich lang sind, zeigt Zeilen mit `(invalid)` und hält `Save` deaktiviert, bis Sie einen Schlüssel in `References` wählen oder der Elterntabelle einen Primärschlüssel oder eine Spalte mit `Unique` hinzufügen, falls sie keinen Schlüssel hat.

Der Dialog folgt dem Diagramm, solange er geöffnet ist, einschließlich der Änderungen eines Mitbearbeiters oder eines Coding-Agenten, und behält Ihre Auswahl bei.  
Ändern sich in der Zwischenzeit die Spalten der Beziehung oder der Schlüssel, mit dem er geöffnet wurde, fügt er den Text `This relationship changed while the dialog was open` hinzu.

Was `Map` und `Save` schreiben:

- `Map` fügt die Beziehung mit `On Delete` und `On Update` auf `Not set` hinzu. `Save` ändert nur die Spalten der Beziehung, richtet ihre Seite an der Elterntabelle auf den in `References` gewählten Schlüssel aus und behält ihren Typ sowie ihr ON DELETE und ON UPDATE bei.
- Eine Zeile mit `New column` fügt am Ende der Kindtabelle eine Spalte hinzu, wie beim Zeichnen: `NOT NULL`, nach ihrem Schlüssel benannt, mit Datentyp, Standardwert, Kommentar, logischem Namen und Domäne des Schlüssels – siehe [Identifizierende Beziehungen](#identifying-relationships).
- Eine ausgewählte Spalte wird nie umbenannt oder mit der Domäne des Schlüssels verknüpft, und ihre Kennzeichen `Not Null`, Primärschlüssel und `Unique` sowie Standardwert, Kommentar und logischer Name bleiben unverändert. Ihr Datentyp ändert sich nur, solange `Relationship DataType Sync` eingeschaltet ist und die Elternspalte einen Datentyp hat: Die Spalte erhält den Typ, den die Elternspalte einem Fremdschlüssel gibt, bei einem Serial-Schlüssel wie bei einer neuen Spalte den Ganzzahltyp, und die Änderung setzt sich entlang der Beziehungen so fort, wie es die Synchronisierung tut. Bei jeder Spalte, deren Typ die Änderung neu setzt, ob ausgewählt oder entlang der Beziehungen erreicht, wird die Verknüpfung mit ihrer [Domäne](./dictionary.md#domains-and-data-types) aufgehoben, wenn sich ihr neuer Typ von dem der Domäne unterscheidet.
- Eine Spalte, die die Zuordnung nicht mehr verwendet, bleibt in der Kindtabelle und ist nicht mehr als Fremdschlüssel markiert, es sei denn, eine andere Beziehung endet noch auf ihr.
- Alles, was ein einzelnes `Map` oder `Save` schreibt – einschließlich neuer Spalten, Typänderungen und aufgehobener Domänenverknüpfungen –, ist ein Rückgängig-Schritt.

Ob die Beziehung identifizierend ist und wie ihr Ende an der Elterntabelle gezeichnet wird, ergibt sich wie bei jeder Beziehung aus den zugeordneten Spalten der Kindtabelle. Eine Zuordnung zu den Primärschlüsselspalten der Kindtabelle macht sie sofort identifizierend, und eine Zuordnung zu einer Spalte, die `NULL` erlaubt, setzt einen Kreis an das Ende an der Elterntabelle – siehe [Verbindungslinien lesen](#reading-a-connector).  
Der Fremdschlüssel in Schema SQL verweist auf den von Ihnen gewählten Schlüssel, etwa `REFERENCES vehicle (vin)` bei einem Schlüssel vom Typ `Unique`.

Enthält das Diagramm die Zuordnung bereits, wenn Sie `Map` oder `Save` drücken, weil ein Mitbearbeiter oder ein Coding-Agent schneller war, wird nichts geschrieben.  
Hat es sich so geändert, dass die Zuordnung nicht mehr passt, wird nichts geschrieben, und es erscheint die Meldung `Couldn't map columns: the diagram changed`.

`Cancel`, die Schaltfläche `x`, `Escape` oder ein Klick auf den abgedunkelten Bereich außerhalb des Dialogs schließt ihn, ohne etwas zu schreiben.  
Der abgedunkelte Bereich bedeckt den gesamten Editor einschließlich der Symbolleiste, und ein geöffneter [Explorer](./explorer.md#dialogs-beside-it) bleibt darunter geöffnet.  
Der Dialog schließt sich auch beim Öffnen der Schnellsuche, beim Verlassen der Registerkarte ERD oder wenn der Editor schreibgeschützt wird.  
`Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) schließt ihn ebenfalls und setzt den Textcursor in das Suchfeld der [Suche](./find-and-replace.md#opening-and-closing) des Explorers, wobei der Explorer geöffnet wird, falls er geschlossen ist. In einem Editor, der zu schmal ist, um den Explorer anzuzeigen, schließt die Tastenkombination den Dialog trotzdem, zeigt aber eine Meldung an, statt den Textcursor zu bewegen – siehe [Öffnen und Schließen](./explorer.md#opening-and-closing).  
Wird eine seiner Tabellen oder die Beziehung entfernt, während er geöffnet ist, schließt er sich mit einer Meldung wie `Map Columns closed: the relationship was removed`.  
Solange er geöffnet ist, bewirken die Tastenkombinationen der Zeichenfläche, Rückgängig und Wiederholen sowie Kopieren und Einfügen nichts.

Ein Coding-Agent hat kein Tool für „Spalten zuordnen“. Er ordnet eine Beziehung neu zu, indem er sie mit `erd_remove_relationship` entfernt, wobei ihre Fremdschlüsselspalten erhalten bleiben, und sie mit `erd_link_columns` auf vorhandenen Spalten neu zeichnet, beides innerhalb eines Aufrufs von `erd_batch` – siehe [Tools](../../mcp/tools.md#relationships).

## N:M-Beziehungen {#nm-relationships}

Da der Editor auf dem physischen Modell basiert, wird eine N:M-Beziehung wie unten gezeigt mit einer Zuordnungstabelle ausgedrückt.

![Mit ⌘ + ⌥ + 2 Beziehungen von products und dann von tags zur leeren Tabelle product_tags zeichnen, wobei product_id und dann tag_id hinzugefügt werden](/img/demo-relationship-n-m.webp)

Hat die Zuordnungstabelle ihre Schlüsselspalten bereits, etwa `product_id` und `tag_id` in `product_tags`, zeichnen Sie jede Beziehung mit `Map to existing columns` und wählen Sie diese Spalten aus, statt neue hinzuzufügen – siehe [Spalten zuordnen](#map-columns). Bilden sie den Primärschlüssel der Zuordnungstabelle, ist jede Beziehung sofort identifizierend.

Beim Import von GraphQL, DBML oder AML wird die Zuordnungstabelle für Sie erstellt.  
Eine N:M-Deklaration kommt als Tabelle namens `<left>_<right>` mit dem Kommentar `Junction table inferred from <left> <-> <right>` an, die mit beiden Seiten durch identifizierende Beziehungen verbunden ist.  
Siehe [Dateien importieren oder exportieren](./file-import-export.md).

## Identifizierende Beziehungen {#identifying-relationships}

Wenn Sie eine Beziehung durch Klicken auf die Kindtabelle oder mit `Create new columns` zeichnen, wird jeder Primärschlüssel der Elterntabelle als Fremdschlüsselspalte mit `NOT NULL` in die Kindtabelle kopiert, sodass eine neue Beziehung zunächst nicht identifizierend ist.  
Die Kopie übernimmt Datentyp, Standardwert, Kommentar und logischen Namen des Schlüssels, aber nicht `Unique` oder `Auto Increment`, und wird wie in [Namen der Fremdschlüsselspalten](#foreign-key-column-names) beschrieben benannt.  
Beim Datentyp bildet ein Serial-Schlüssel die Ausnahme: Seine Kopie erhält den Ganzzahltyp, den der Serial-Typ speichert. Bei jeder Datenbank ergeben `smallserial` und `serial2` den Typ `smallint`, `serial4` ergibt `integer`, und `bigserial` und `serial8` ergeben `bigint`. Ein bloßes `serial` ergibt unter PostgreSQL `integer` und unter MySQL und MariaDB `bigint unsigned` und bleibt bei jeder anderen Datenbank `serial`.  
Nur der vollständige Typname zählt, ohne Beachtung der Groß-/Kleinschreibung, daher wird `serial(4)` so kopiert, wie er geschrieben ist. Ein in Großbuchstaben geschriebener Typ ergibt Großbuchstaben: `SERIAL` ergibt unter PostgreSQL `INTEGER`. Eine Fremdschlüsselspalte, die in einem gespeicherten Diagramm bereits den Typ `serial` hat, behält diesen Typ.  
Die Kopie wird außerdem mit der [Domäne](./dictionary.md#domains-and-data-types) des Schlüssels verknüpft, sofern das Blatt `Domains` diese Domäne beim Erstellen der Kopie aufführt und die Kopie den Datentyp des Schlüssels behält. Die Kopie eines Serial-Schlüssels, die einen Ganzzahltyp erhält, verknüpft daher keine Domäne, während ein bloßes `serial`, das `serial` bleibt, sie verknüpft.  
Um die Beziehung identifizierend zu machen, legen Sie diese Fremdschlüsselspalten in der Kindtabelle als Primärschlüssel fest: Wählen Sie sie alle aus und drücken Sie einmal `Alt + K` (Windows/Linux) oder `⌥ + K` (Mac), oder wählen Sie im Kontextmenü der Tabelle den Eintrag `Primary Key`, der `Primary Key on selected columns` lautet, solange zwei oder mehr ausgewählt sind – siehe [Primärschlüssel für Spalten](./table-editing.md#column-primary-key).

![product_id mit Alt + K als Primärschlüssel ein- und ausschalten, wodurch die Verbindungslinie durchgezogen und dann gestrichelt wird](/img/demo-identifying-relationship.webp)

Der Editor hält dies von selbst synchron.  
Eine Beziehung ist identifizierend, solange jede Spalte auf ihrer Seite an der Kindtabelle ein Primärschlüssel ist, und wird nicht identifizierend, sobald eine davon keiner ist.

## Namen der Fremdschlüsselspalten {#foreign-key-column-names}

Beim Zeichnen einer Beziehung wird jede hinzugefügte Fremdschlüsselspalte nach dem Schlüssel der Elterntabelle benannt, den diese Spalte kopiert:

- Ein Schlüsselname aus einem Wort, etwa `id`, `ID` oder `uuid`, erhält den Namen der Elterntabelle und einen Unterstrich vorangestellt: `id` in `products` wird zu `products_id`.
- Ein Schlüsselname aus mehreren Wörtern, etwa `member_id`, `userId` oder `UserID`, bleibt unverändert.
- Ein Schlüsselname aus einem Wort, der ohne Beachtung der Groß-/Kleinschreibung dem Namen der Tabelle selbst entspricht, bleibt ebenfalls unverändert: `currency` in `currency` bleibt `currency`. Ein Schlüssel, der den Tabellennamen lediglich enthält, erhält trotzdem das Präfix: `username` in `user` wird zu `user_username`.

Ein Name ist ein Wort, wenn er nur Buchstaben und Ziffern enthält, ohne Wechsel der Groß-/Kleinschreibung.  
Jedes andere Zeichen teilt ihn, daher bestehen `_id`, `order no` und `order-no` aus mehreren Wörtern.  
Ebenso teilt ihn ein Wechsel der Groß-/Kleinschreibung, gelesen wie bei camelCase: ein Kleinbuchstabe gefolgt von einem Großbuchstaben (`userId`), zwei Großbuchstaben gefolgt von einem Kleinbuchstaben (`IDCard`, `IDs`) oder ein Buchstabe einer Schrift ohne Groß-/Kleinschreibung, etwa Hangul, Kana oder Han, neben einem Buchstaben mit Groß-/Kleinschreibung (`회원ID`).  
Ziffern teilen ein Wort nicht, daher sind `id2` und `SHA256` jeweils ein Wort. Eine durchgehend klein oder durchgehend groß geschriebene Zusammensetzung ist ebenfalls ein Wort: `memberid` in `members` wird zu `members_memberid`.

Der Tabellenname wird so verwendet, wie er geschrieben ist, abgesehen von umgebenden Leerzeichen: Groß-/Kleinschreibung, innere Leerzeichen und Punkte bleiben erhalten, er wird nicht in den Singular gesetzt, und die Optionen `Table Name Case` und `Column Name Case` des Codegenerators spielen keine Rolle. `Users` mit dem Schlüssel `ID` ergibt `Users_ID`.  
Jede Spalte eines zusammengesetzten Schlüssels wird einzeln benannt: `orders` mit dem Schlüssel (`tenant_id`, `id`) fügt `tenant_id` und `orders_id` hinzu.

Ein Name, den die Kindtabelle ohne Beachtung der Groß-/Kleinschreibung bereits hat, wird mit `_2`, `_3` usw. nummeriert, wobei die erste freie Nummer verwendet wird.  
Eine zweite Beziehung von `users` mit dem Schlüssel `id` zu derselben Tabelle fügt `users_id_2` hinzu, und eine Selbstreferenz auf `members` mit dem Schlüssel `member_id` fügt `member_id_2` hinzu.  
Die Spalten eines zusammengesetzten Schlüssels werden auf dieselbe Weise untereinander nummeriert, und ein unverändert übernommener Name belegt seinen Platz zuerst: `user` mit dem Schlüssel (`id`, `user_id`) fügt `user_id` für `user_id` und `user_id_2` für `id` hinzu.

Bei einer Elterntabelle ohne Namen bleibt der Schlüsselname unverändert und wird bei einer Kollision wie jeder andere nummeriert.  
Ein Schlüssel ohne Namen ergibt eine Fremdschlüsselspalte ohne Namen.  
Das gilt auch für den Primärschlüssel, den der Editor einer Elterntabelle ohne Primärschlüssel hinzufügt, es sei denn, Sie benennen ihn, bevor Sie auf die Kindtabelle klicken.

Die Namen werden beim Zeichnen der Beziehung festgelegt. Ein späteres Umbenennen der Elterntabelle oder ihres Schlüssels benennt sie nicht um.  
Die Zeilen mit `New column` im Dialog [Spalten zuordnen](#map-columns) werden nach denselben Regeln benannt, und die Liste zeigt jeden Namen, bevor Sie ihn wählen.  
Beziehungen, deren Spalten bereits vorhanden sind – aus einem Import, einem Einfügen, einem Duplikat oder aus „Spalten zuordnen“ mit vorhandenen Spalten –, behalten die Namen, die diese Spalten haben.  
Ein Coding-Agent, der mit `erd_add_relationship` eine Beziehung hinzufügt, erhält dieselben Namen, Datentypen, logischen Namen und Domänen – siehe [Tools](../../mcp/tools.md#relationships).

Eine Fremdschlüsselspalte wird nach ihrem Schlüssel benannt, nie nach dem logischen Namen, den sie übernimmt, und ihr Name gilt als eigener Name: Ein später in die Spalte geschriebener logischer Name lässt den Namen unverändert, es sei denn, der Name ist leer – siehe [Eigene Namen](./dictionary.md#names-of-your-own).  
Solange der übernommene logische Name einem Begriff entspricht, der einen anderen Namen vergibt, führt das Blatt `Checks` die Spalte daher unter [`Physical name mismatch`](./dictionary.md#what-each-check-finds) auf. Wird ihr physischer Name neu abgeleitet, benennen die Wörterbücher sie um, es sei denn, eine andere Spalte der Kindtabelle trägt bereits den Namen, den sie vergeben, ohne Beachtung der Groß-/Kleinschreibung – siehe [Physische Namen neu ableiten](./dictionary.md#derive-physical-names-again).

## Verbindungslinien lesen {#reading-a-connector}

- Eine identifizierende Beziehung wird als durchgezogene Linie gezeichnet, eine nicht identifizierende als gestrichelte Linie.
- Das Ende an der Kindtabelle trägt das Kardinalitätssymbol des Beziehungstyps: ein Kreis und ein Strich bei Zero One, ein Kreis und ein Krähenfuß bei Zero N, zwei Striche bei One Only und ein Strich und ein Krähenfuß bei One N.
- Das Ende an der Elterntabelle besteht aus einem Kreis und einem Strich wie bei Zero One, wenn mindestens eine der Fremdschlüsselspalten `NULL` erlaubt, und aus zwei Strichen wie bei One Only, wenn sie alle `NOT NULL` sind.
- Wenn Sie mit dem Zeiger auf eine Verbindungslinie zeigen, wird sie zusammen mit den Spalten hervorgehoben, die sie in beiden Tabellen verbindet.

![Nacheinander mit dem Zeiger auf drei Verbindungslinien zeigen, die jeweils zusammen mit den verbundenen Spalten hervorgehoben werden](/img/demo-relationship-hover.webp)

Eine Beziehung, die [ON DELETE oder ON UPDATE](#on-delete-and-on-update) festlegt, trägt neben ihrem Ende an der Kindtabelle eine Beschriftung, etwa `D:C U:R`: `D:` und die Aktion für ON DELETE, dann `U:` und die Aktion für ON UPDATE, jeweils nur, wenn sie festgelegt ist.  
Die Aktionen werden nach der Notation von erwin abgekürzt: `C` für CASCADE, `R` für RESTRICT, `SN` für SET NULL, `SD` für SET DEFAULT und `NA` für NO ACTION. Eine Beziehung, die keine der beiden festlegt, hat keine Beschriftung.  
Die Beschriftung sitzt auf der von der Kindtabelle abgewandten Seite, über der Linie, wenn die Verbindungslinie die Tabelle an ihrer linken oder rechten Seite verlässt, und rechts neben der Linie, wenn sie sie oben oder unten verlässt, mit Abstand zum Kardinalitätssymbol.  
Sie wird in der Farbe der Verbindungslinie auf einem kleinen Kasten in der Hintergrundfarbe der Zeichenfläche gezeichnet und zusammen mit ihrer Verbindungslinie hervorgehoben. Beschriftungen werden über jeder Verbindungslinie gezeichnet, sodass eine Linie, die eine Beschriftung kreuzt, darunter verläuft.  
Sie zeigt die in der Beziehung gespeicherte Aktion, unabhängig davon, was die ausgewählte Datenbank schreibt, sodass ON DELETE SET DEFAULT auch bei MySQL als `D:SD` erscheint.

Wenn Sie mit dem Zeiger auf eine Verbindungslinie zeigen, die eine der beiden Aktionen festlegt, erscheint außerdem ein Tooltip, der die Klauseln ausschreibt, eine pro Zeile, etwa `ON DELETE CASCADE` und `ON UPDATE RESTRICT`.  
Der Tooltip erscheint auch dann, wenn die Beschriftung ausgeblendet ist.

Ein Wechsel zu einer Beziehung hebt sie hervor: Wenn Sie im [Explorer](./explorer.md#going-to-a-row) eine Zeile unter dem Ordner `Foreign Keys` einer Tabelle oder in der [Diff-Ansicht](./table-related-functions.md#going-to-a-change) eine Fremdschlüsselzeile wählen, werden ihre Verbindungslinie und ihre Beschriftung in der Hover-Farbe gezeichnet. In der Diff-Ansicht wird die Verbindungslinie auf jeder Seite hervorgehoben, die die Beziehung enthält, sodass ein hinzugefügter Fremdschlüssel nur die aktuelle Seite und ein entfernter nur die gespeicherte Seite hervorhebt.  
Der Sprung wählt allein die Kindtabelle mit ihren Fremdschlüsselspalten aus, wobei die fokussierte Zelle auf der ersten davon liegt; die Beziehung selbst wird weiterhin nie ausgewählt. Zur Frage, wohin die Ansicht wechselt, siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands).  
Die Hervorhebung endet beim nächsten Drücken der linken oder rechten Maustaste auf der Zeichenfläche, ob auf einer leeren Stelle, einer Tabelle, einer Notiz, einer Tabellengruppe oder einer Verbindungslinie, selbst bei einem Drücken, das die Auswahl unverändert lässt. Auch ein Wechsel zu einer anderen Zeile oder einem anderen Suchtreffer im Explorer beendet sie, ebenso ein Wechsel zu einer anderen Zeile in der Diff-Ansicht, und zwar auf jeder Seite, zu der diese Zeile wechselt.  
Das Verschieben der Ansicht mit der mittleren Maustaste oder dem Hand-Werkzeug lässt sie bestehen, ebenso das Ein- oder Ausklappen einer Zeile im Explorer oder in der Diff-Ansicht, das Aufheben der Auswahl mit `Escape` und ein Sprung aus der [Schnellsuche](./quick-search.md) oder über die [Kartenschaltfläche](./visualization.md#card-buttons) für externe Links in Flow.  
Die Hervorhebung wird nicht gespeichert, erscheint nicht im Verlauf, und Mitbearbeiter sehen sie nicht.

Blenden Sie Verbindungslinien auf der ERD-Zeichenfläche mit der Ansichtsoption `Relationship` aus oder nur ihre Beschriftungen mit der Ansichtsoption `Referential Actions`, die standardmäßig eingeschaltet ist – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options).  
Bei `70%` und darunter, wo Tabellen auf ihren Namen eingeklappt werden, werden keine Beschriftungen gezeichnet.  
Ein [Bildexport](./file-import-export.md#image) wird immer mit 100 % gezeichnet, daher enthält er die Beschriftungen unabhängig vom Zoom der Zeichenfläche, sofern keine Ansichtsoption sie ausblendet. Ist `Background` ausgeschaltet, ist auch der Kasten hinter jeder Beschriftung transparent.  
Der [Flow-Modus](./visualization.md#flow-mode) auf der Registerkarte Visualisierung zeichnet Verbindungslinien auch dann, wenn die Option `Relationship` ausgeschaltet ist, jeweils als eine glatte, durchgezogene graue Kurve mit denselben Endmarkierungen, daher gelten die gestrichelte Linie, die Beschriftungen, der Tooltip, die Hervorhebung nach einem Sprung und die auf dieser Seite beschriebene orthogonale Linienführung nur für die ERD-Zeichenfläche. Eine Beziehung von einer Tabelle zu sich selbst verläuft auch in Flow als Kurve um die obere rechte Ecke – siehe [Verlauf der Verbindungslinien](#connector-routing).

## Verlauf der Verbindungslinien {#connector-routing}

Verbindungslinien verlaufen orthogonal.  
Eine Linie führt um die Tabellen herum, die zwischen ihren beiden Enden liegen, statt sie zu kreuzen, und ihre Ecken sind abgerundet.  
Jedes Ende verlässt seine Tabelle mit einem kurzen geraden Stück, bevor es abbiegt, sodass zwei nah beieinanderliegende Tabellen, deren Linienenden auf einer Höhe liegen, durch eine einzige gerade Linie statt durch einen Umweg verbunden werden.  
Linien, die dieselbe Seite einer Tabelle verlassen, werden auf getrennte Bahnen verteilt, damit sie nicht übereinander verlaufen.  
Nur Tabellen werden umgangen: Eine Verbindungslinie darf eine Notiz oder den Rahmen einer Tabellengruppe kreuzen und wird über Tabellengruppen sowie unter Tabellen und Notizen gezeichnet.

Eine Beziehung von einer Tabelle zu sich selbst wird als eine Kurve um die obere rechte Ecke der Tabelle gezeichnet, die am Ende an der Elterntabelle die obere Seite verlässt und am Ende an der Kindtabelle in die rechte Seite eintritt.  
Weitere Selbstreferenzen auf derselben Tabelle liegen verschachtelt außerhalb der ersten, sodass sich ihre Kurven weder gegenseitig noch die Tabelle kreuzen.

Es gibt nichts zu konfigurieren.  
Die Linienführung wird automatisch neu berechnet, sobald sich etwas auf der Zeichenfläche bewegt oder seine Größe ändert, sodass sie nie von Hand angepasst werden muss.

![Die Tabelle members nach unten und zurück ziehen, während die Verbindungslinie von orders zwischen einem Verlauf rechts an categories vorbei und einem links um die Tabelle herum wechselt, alle Ecken abgerundet](/img/demo-connector-routing.webp)
