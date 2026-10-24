---
sidebar_position: 4
description: Alle Tools, die der MCP-Server von erd-editor bietet – ein Dokument seitenweise lesen, die Wörterbuchprüfungen, die 67 Bearbeitungs-Tools, erd_batch und wie ein Ergebnis und eine Ablehnung aussehen.
---

# Tools

Der Server bietet 77 Tools: fünf Sitzungs-Tools, vier Lese-Tools, 67 Bearbeitungs-Tools, je eines pro Bearbeitungsvorgang, und `erd_batch`, das mehrere Bearbeitungs-Tools als eine Änderung ausführt.

Jedes Tool außer `erd_list_documents` erhält als erstes Argument den `path` des Dokuments, und die Tabellen unten führen ihn nicht auf.
Ein mit `?` gekennzeichnetes Argument ist optional.

## Sitzungs-Tools {#session-tools}

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_list_documents` | | Listet ERD-Dokumente mit `path`, `open`, `active`, `dirty` und `readonly` auf: die des Editors, der das Arbeitsverzeichnis bedient, was in einer JetBrains-IDE jedes geöffnete Projekt umfasst, andernfalls die ERD-Dateien unter dem Arbeitsverzeichnis. |
| `erd_open_document` | `create?` | Öffnet ein Dokument zum Bearbeiten, und zwar im ERD Editor des Editors, der es bedient, falls es einen solchen gibt. Mit `create` legt es die Datei zuerst an, wenn sie fehlt, und ein Name ohne Endung erhält `.erd.json`. |
| `erd_save` | | Speichert ein Dokument, das ein Editor hält. VS Code lässt die Änderungen des Agenten ungespeichert, bis dieses Tool aufgerufen wird; Obsidian und eine JetBrains-IDE speichern sie so, wie sie Ihre speichern, und dieses Tool schreibt sie sofort. Im Headless-Modus ist jede Änderung bereits geschrieben, wie `saved: true` in ihrem Ergebnis besagt, und dieses Tool bewirkt nichts. |
| `erd_undo` | | Macht die letzte Änderung dieses Agenten rückgängig, nie Ihre. Aufrufe, die keinen Rückgängig-Eintrag erzeugt haben, werden übersprungen und genannt. |
| `erd_redo` | | Wendet die Änderung erneut an, die `erd_undo` zuletzt rückgängig gemacht hat. |

Was Speichern und Rückgängigmachen im jeweiligen Modus bewirken, wird in [Live und Headless](./live-and-headless.md) beschrieben.

## Dokument lesen {#reading-a-document}

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Die Einstellungen und Anzahlen, dann eine Seite mit Tabellen samt ihren Indizes und Beziehungen, jede Tabelle mit ihrer ID, Position und Größe auf der Zeichenfläche, Spaltenanzahl, ihrem logischen Namen, falls sie einen hat, und Tabellengruppe, falls sie in einer ist. Sofern es nicht sucht, folgen auf die Tabellen die Tabellengruppen, die Notizen und dann die Domänen, Begriffe und Wörter. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Die genannten Entitäten vollständig: Tabellen mit ihren Spalten und ihrer Tabellengruppe, Beziehungen mit ihren Spalten sowie `onDelete` und `onUpdate`, Indizes mit ihren Spalten, Notizen mit ihrem Text, Tabellengruppen mit ihren Tabellen sowie Wörter, Begriffe und Domänen mit jedem Feld. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Das ganze Dokument auf einmal in einem von vier Formaten oder die DDL nur einiger Tabellen oder Tabellengruppen. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Was die Wörterbücher der Wörter, Begriffe und Domänen als fehlerhaft finden, so wie das Blatt `Checks` der Registerkarte Wörterbuch des Editors es auflistet, seitenweise. Es ändert nichts – siehe [Wörterbuchprüfungen](#dictionary-checks). |

Ein Agent findet IDs mit `erd_list`, liest Spalten, Wörterbuchzeilen und weitere Details mit `erd_get` und übergibt diese IDs an die Bearbeitungs-Tools.
Die Größe einer Tabelle in `erd_list` ist der Rahmen, den sie auf der Zeichenfläche einnimmt: die Höhe exakt, die Breite ungefähr.
Eine Tabellengruppe wird mit dem Rechteck aufgeführt, das sie speichert, sowie mit ihrem Namen, ihrer Farbe und der Zahl der Tabellen, die sie enthält.
Jede Beziehung wird einmal aufgeführt, bei einer ihrer beiden Tabellen.
Eine Wörterbuchzeile wird mit ihrer ID, ihrem `name` und dem aufgeführt, was sie einem physischen Namen oder einer Spalte gibt: dem `dataType` einer Domäne, dem `physicalName` und der `domainId` eines Begriffs und der `abbreviation` eines Worts. Jedes Wörterbuch listet seine Zeilen in der Reihenfolge auf, die sein Blatt zeigt.
Die Einstellungen, die `erd_list` und `erd_read` melden, sind die, die die Datei speichert – siehe [Einstellungen](#settings).

In `erd_get` und im Format `snapshot` von `erd_read` trägt jede Tabelle und jede Spalte ihren `logicalName`, eine leere Zeichenkette, wenn sie keinen hat, und `nameDerived`, das `true` ist, solange der Name von den Wörterbüchern stammt, sodass ein neuer logischer Name ihn erneut ableitet – siehe [Wörterbücher](#dictionaries).
Jede Spalte trägt ihre `domainId`, ebenso jeder Begriff: eine leere Zeichenkette für keine Domäne oder für eine Domäne, die das Dokument nicht mehr aufführt.

`erd_read` akzeptiert eines von vier Formaten:

| `format` | Was es liefert |
| --- | --- |
| `snapshot` | Kompaktes JSON mit jeder Entität und ihrer ID, Tabellengruppen und die Zeilen der Wörter, Begriffe und Domänen eingeschlossen, und den Einstellungen mit den Skripten von Schema SQL. Es lässt weg, was sich von Betrachter zu Betrachter unterscheidet: gemessene Breiten, die Stapelreihenfolge, die Ansicht, die Registerkarte und die Namensansicht. Bei einem großen Schema umfangreich. |
| `sql` | DDL für eine der acht Datenbanken `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` oder `SQLite`. `vendor` ist standardmäßig die Datenbank, auf die das Dokument eingestellt ist. Die DDL des ganzen Dokuments enthält seine Skripte vor und nach den Tabellen. Mit `tableIds`, `tableNames` oder `groupNames` nur diese Tabellen, mit den Fremdschlüsseln, die sie enthalten, und ohne Skripte. Fremdschlüssel enthalten ihre Aktionen für ON DELETE und ON UPDATE, außer denen, die die Zieldatenbank weglässt – siehe [ON DELETE und ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Das ganze Dokument genau so, wie ein Speichern die Datei schreibt, einschließlich aller Änderungen, die der Editor noch nicht gespeichert hat – siehe [Speicherform und Laufzeitwert](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Nur die Skripte vor und nach den Tabellen des Dokuments, als `{"before":"…","after":"…"}`, jedes leer, wenn es nicht gesetzt ist, wie groß das Schema auch sein mag. |

Nur das Format `sql` akzeptiert `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` und `groupNames`, und jedes andere Format lehnt sie ab.

- `statements`: `create`, der Standardwert; `ifNotExists`, das bei MySQL, MariaDB, PostgreSQL, SQLite und Databricks `CREATE TABLE IF NOT EXISTS` und bei den anderen ein einfaches `CREATE TABLE` schreibt; oder `recreate`, das die Tabellen vor dem Erstellen löscht, wobei Snowflake stattdessen `CREATE OR REPLACE TABLE` schreibt.
- `header`: `none`, der Standardwert; `use`, das die Datenbank oder das Schema auswählt, das der Datenbankname des Dokuments nennt; oder `createAndUse`, das diese zuerst erstellt. Oracle kennt nur `use`, daher schreibt `createAndUse` dort `use`, und PostgreSQL kennt nur `createAndUse`, daher schreibt `use` dort keinen Vorspann. SQLite schreibt keinen, und keine Datenbank schreibt einen, solange der Datenbankname leer oder kein einfacher Bezeichner ist.
- `logicalNameAsComment`: `true` schreibt den logischen Namen einer Tabelle oder Spalte als ihren Kommentar, solange der Kommentar leer ist oder nur aus Leerraum besteht, dort und in der Form, in der jede Datenbank einen Kommentar schreibt, und behält jeden Kommentar bei, der Text enthält; `false`, der Standardwert, schreibt keinen logischen Namen – siehe [Logische Namen als Kommentare](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: die Tabellen der genannten Tabellengruppen, nach Namen ohne Beachtung der Groß-/Kleinschreibung, zusammengeführt mit `tableIds` und `tableNames`. Ein Name, der zu keiner Gruppe passt, wird mit `notFound` abgelehnt. Eine Gruppe ohne Tabelle fügt keine hinzu, und ein Lesevorgang, dem gar keine Tabelle bleibt, etwa wenn jede genannte Gruppe leer ist und keine Tabelle genannt wird, wird mit `invalidArgs` abgelehnt.

`statements`, `header` und `logicalNameAsComment` gelten auch für die DDL einzelner Tabellen. Sie funktionieren wie die Optionen `Statements` und `Header` und der Schalter `Write logical names into empty comments` der Registerkarte [Schema SQL](../guide/guides/schema-sql.md#options-panel) des Editors, allerdings steht die Registerkarte anfangs auf `If not exists` und `CREATE + USE`. Der Schalter ist anfangs ausgeschaltet, wie `logicalNameAsComment`.
Namen werden mit dem Begrenzertyp eingefasst, den die Datei speichert, also mit dem gesperrten, solange `Bracket Type` gesperrt ist – siehe [Sperren](../guide/guides/settings.md#lock).

### Große Schemas {#large-schemas}

Auch Schemas mit Hunderten oder Tausenden von Tabellen funktionieren.
Ein Lesevorgang liefert höchstens 40.000 Zeichen, unterhalb der Grenze, ab der Claude Code ein Tool-Ergebnis in eine Datei auslagert.

- `erd_list` liefert standardmäßig eine Seite mit 100 Einträgen, zuerst die Tabellen, dann die Tabellengruppen, die Notizen, die Domänen, die Begriffe und die Wörter, mit einem einzigen Offset, der durch alle hindurchläuft, und gibt mit `nextOffset` und einem Hinweis `note` an, wo die nächste Seite beginnt. Übergeben Sie diesen Wert von `nextOffset` als `offset`, mit demselben Wert für `query`.
- `query` findet Tabellen anhand von Wörtern in einem Tabellen- oder Spaltennamen, einem logischen Namen oder einem Kommentar, ohne Beachtung der Groß-/Kleinschreibung. Tabellen, deren Namen oder logische Namen mehr dieser Wörter enthalten, kommen zuerst. Eine Suche listet keine Tabellengruppen, Notizen oder Wörterbuchzeilen auf.
- `namesOnly` listet nur die Tabellennamen auf, etwa 2.000 kurze Namen in einer Antwort.
- `erd_get` und `erd_read` akzeptieren neben IDs auch `tableNames`, und `erd_read` akzeptiert `groupNames`, sodass ein Agent, der um eine SQL-Abfrage auf einem großen Schema gebeten wird, nur die DDL der Tabellen liest, die er braucht.
- Auch die Wörterbücher kommen in Teilen: `erd_list` blättert nach den Tabellen durch ihre Zeilen, und `erd_get` liefert Zeilen vollständig über `domainIds`, `termIds` und `wordIds`.
- `erd_get` führt IDs und Namen, die nichts bezeichnen, unter `missing` auf und die IDs, für die in einer Antwort kein Platz ist, unter `notReturned`, damit sie erneut angefragt werden können.
- `erd_list_checks` liefert auf dieselbe Weise jeweils eine Seite – siehe [Wörterbuchprüfungen](#dictionary-checks).
- Ein Lesevorgang, der für eine Antwort zu groß ist, wird mit `tooLarge` abgelehnt, zusammen mit einem Hinweis, wie er sich eingrenzen lässt.

### Wörterbuchprüfungen {#dictionary-checks}

`erd_list_checks` listet die Prüfungen des [Blatts Prüfungen](../guide/guides/dictionary.md#the-checks-sheet) des Editors in derselben Reihenfolge auf: zuerst die Prüfungen der Wörter, dann die der Begriffe und der Domänen, jedes Wörterbuch in der Reihenfolge, die sein Blatt zeigt, dann jede Tabelle, gefolgt von ihren Spalten.
Wie auf dem Blatt läuft eine Prüfung nur, solange das Wörterbuch, das sie liest, eine Zeile enthält. Ein Dokument, dessen Wörterbücher kein Wort, keinen Begriff und keine Domäne enthalten, wird gar nicht geprüft: `total` ist `0`, und der Hinweis `note` sagt das.

- `level`: `error` oder `warning` nur für diese Stufe; standardmäßig beide.
- `tableIds` und `tableNames`: nur die Prüfungen dieser Tabellen und ihrer Spalten, Namen ohne Beachtung der Groß-/Kleinschreibung, was die eigenen Zeilen der Wörterbücher ausschließt. Eine ID oder ein Name, der keine Tabelle bezeichnet, wird mit `notFound` abgelehnt.
- `offset` und `limit`: standardmäßig eine Seite mit 100 Prüfungen, die auch dort endet, wo eine Antwort voll ist. Solange weitere folgen, geben `nextOffset` und ein Hinweis `note` an, wo die nächste Seite beginnt; übergeben Sie diesen Wert als `offset` mit denselben Filtern. Nachdem Sie einige Prüfungen behoben haben, listen Sie erneut ab Offset `0` auf: Eine behobene Prüfung verlässt die Liste, sodass ein späterer Offset noch nicht behobene Prüfungen überspringen würde.

Die Antwort enthält `total`, wie viele Prüfungen die Filter übrig lassen; `counts`, wie viele davon auf jeden Code entfallen, wobei ein Code ohne Prüfung fehlt; und die Seite als `checks`.
Jede Prüfung nennt `level`, `code` sowie `kind` und `id` ihres Objekts: `table`, `column`, `word`, `term` oder `domain`. Die Prüfung einer Spalte fügt deren `tableId` und den Namen ihrer Tabelle als `table` hinzu.
`name` ist der Name des Objekts, bei einer Tabelle oder Spalte der physische Name, mit ihrem `logicalName`, wenn sie einen hat. `field` ist das, was die Prüfung liest: `name`, `logicalName` oder `domainId`. `text` ist das, was sie dort gefunden hat, und `suggestions`, wo die Wörterbücher etwas anbieten, ist das, was stattdessen zu verwenden ist. So kann ein Agent eine Prüfung ohne `erd_get` beheben:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` auf dem Blatt | Was sie findet |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Ein Name, den zwei Zeilen eines Wörterbuchs teilen. Jede der Zeilen wird aufgeführt. |
| `unknownDomain` | `error` | `Unknown domain` | Eine Spalte oder ein Begriff, die mit einer Domäne verknüpft sind, die das Dokument nicht mehr aufführt. `text` ist der Name dieser Domäne oder ihre ID, wenn kein Name bekannt ist. |
| `forbiddenWord` | `error` | `Forbidden word` | Ein Wort, das bei einem Wort unter den verbotenen Wörtern steht, im logischen Namen einer Tabelle oder Spalte oder im Namen eines Begriffs. `suggestions` sind die Standardwörter. |
| `unregisteredWord` | `warning` | `Unregistered word` | Text, den kein Wort aufführt, an denselben Stellen. |
| `synonymWord` | `warning` | `Synonym` | Ein Synonym, das für ein Standardwort verwendet wird, an denselben Stellen. `suggestions` sind die Standardwörter. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Ein physischer Name einer Tabelle oder Spalte, der von dem abweicht, den der Begriff ihres logischen Namens ergibt. Der Vorschlag ist der physische Name des Begriffs oder, solange der Begriff keinen enthält, der, den seine Wörter zusammensetzen. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Eine Spalte, deren Datentyp nicht der der Domäne ist, mit der sie verknüpft ist. `text` ist der Typ der Spalte und der Vorschlag der Typ der Domäne. |

Wie jede Prüfung einen Namen liest, steht in [Was jede Prüfung findet](../guide/guides/dictionary.md#what-each-check-finds).

## Bearbeitungs-Tools {#edit-tools}

IDs stammen aus `erd_list` und `erd_get` oder aus den `createdIds` des Aufrufs, der die Entität erstellt hat.
Eine neue ID besteht aus 25 Kleinbuchstaben und Ziffern, etwa `03h17be2plxpj5n59tqag7ogj`, während eine ID, die das Dokument bereits enthält, ihre Form behält, leiten Sie daher aus der Form einer ID nichts ab.
`x` und `y` sind die linke und die obere Kante auf der Zeichenfläche in Pixeln, und eine Farbe ist eine CSS-Hexfarbe, etwa `#3b82f6`, oder eine leere Zeichenkette, die die Farbe entfernt.

### Tabellen {#tables}

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_table` | | Fügt an einer freien Stelle eine leere Tabelle hinzu und gibt ihre ID in `createdIds` zurück. |
| `erd_remove_table` | `tableId` | Entfernt eine Tabelle samt ihren Spalten, Indizes und jeder Beziehung, die sie berührt. |
| `erd_change_table_name` | `tableId`, `value` | Benennt eine Tabelle um. Der Name gilt dann als von Hand geschrieben, sodass ein späterer logischer Name ihn unverändert lässt, solange er nicht leer ist – siehe [Wörterbücher](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Legt den Kommentar einer Tabelle fest. Eine leere Zeichenkette löscht ihn. |
| `erd_set_table_logical_name` | `tableId`, `value` | Legt den logischen Namen einer Tabelle fest. Eine leere Zeichenkette löscht ihn und lässt den Namen unverändert. Solange der Name der Tabelle leer ist oder abgeleitet wurde, leiten die Wörterbücher ihn aus dem logischen Namen ab – siehe [Wörterbücher](#dictionaries). Ein Begriff gibt einer Tabelle keine Domäne. |
| `erd_change_table_color` | `tableId`, `color` | Legt die Farbe einer Tabelle fest. |
| `erd_move_table` | `tableId`, `x`, `y` | Verschiebt eine Tabelle an eine Position auf der Zeichenfläche. |
| `erd_move_tables` | `positions` | Verschiebt mehrere Tabellen in einer Änderung, die ein einziges `erd_undo` rückgängig macht. `positions` enthält `{ tableId, x, y }` pro Tabelle, jede Tabelle höchstens einmal. |
| `erd_sort_tables` | | Ordnet alle Tabellen in Zeilen über die Zeichenfläche an, die mit den wenigsten Spalten zuerst, so wie `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` und `erd_import_aml` sie anordnen. Die Tabellen einer Tabellengruppe bleiben zusammen, und der Rahmen jeder Gruppe wird um sie herum angepasst. |

### Spalten {#columns}

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Fügt einer Tabelle eine leere Spalte hinzu und gibt ihre ID in `createdIds` zurück. |
| `erd_remove_columns` | `tableId`, `columnIds` | Entfernt Spalten aus einer Tabelle, samt den Beziehungen und Indexeinträgen, die sie verwenden. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Benennt eine Spalte um. Der Name gilt dann als von Hand geschrieben, wie bei einer Tabelle. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Legt den Datentyp fest, etwa `INT` oder `VARCHAR(255)`. Solange [Datentyp-Synchronisierung für Beziehungen](../guide/guides/settings.md#relationship-datatype-sync) eingeschaltet ist, folgt die Änderung den Beziehungen in beide Richtungen, wie im Editor: Ein Serial-Typ erreicht die Fremdschlüssel als der Ganzzahltyp, den er speichert, so wie `erd_add_relationship` ihn kopiert, und ein Serial-Schlüssel behält seinen Typ, wenn sich einer seiner Fremdschlüssel ändert, womit die Änderung dort endet. Die Synchronisierung ein- oder auszuschalten ist Sache des Benutzers, und `erd_list` meldet sie als `relationshipDataTypeSync`. Bei einer mit einer Domäne verknüpften Spalte wird die Verknüpfung aufgehoben, wenn sie auf einen anderen Typ als den der Domäne gesetzt wird, ebenso bei jeder Spalte, die die Synchronisierung erreicht und deren neuer Typ von dem ihrer eigenen Domäne abweicht – siehe [Verknüpfung aufheben](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Legt den Standardwert als SQL-Text fest. Eine leere Zeichenkette löscht ihn. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Legt den Kommentar fest. Eine leere Zeichenkette löscht ihn. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Legt den logischen Namen einer Spalte fest. Eine leere Zeichenkette löscht ihn und lässt den Namen unverändert. Solange der Name der Spalte leer ist oder abgeleitet wurde, leiten die Wörterbücher ihn ab, und die Domäne eines Begriffs verknüpft die Spalte und gibt ihr den Datentyp der Domäne – siehe [Wörterbücher](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Verknüpft eine Spalte mit einer Domäne, angegeben per ID oder per Name, eines von beiden. Die Spalte übernimmt den Datentyp der Domäne, der den Beziehungen folgt, solange die Datentyp-Synchronisierung für Beziehungen eingeschaltet ist, wobei Verknüpfungen auf dieselbe Weise aufgehoben werden wie bei `erd_change_column_data_type`. Der Wert `null` oder eine leere Zeichenkette für `domainId` oder ein leerer Wert von `domainName` hebt die Verknüpfung der Spalte auf und behält ihren Typ bei. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` macht die Spalte zum Teil des Primärschlüssels, `false` nimmt sie heraus. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Legt fest, ob die Spalte eindeutig ist. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Legt fest, ob die Spalte `NOT NULL` ist. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Legt fest, ob die Spalte automatisch inkrementiert wird. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Verschiebt eine Spalte innerhalb ihrer Tabelle an die Position einer anderen Spalte. |

### Beziehungen {#relationships}

`relationshipType` ist die Kardinalität am Ende an der Kindtabelle: `ZeroOne`, `ZeroN`, `OneOnly` oder `OneN`.
Die Starttabelle ist die Elterntabelle, die referenzierte Seite, die den Primärschlüssel enthält, und die Endtabelle ist die Kindtabelle.
`onDelete` und `onUpdate` sind die Aktionen des Fremdschlüssels für ON DELETE und ON UPDATE: `none`, `noAction`, `cascade`, `setNull`, `setDefault` oder `restrict`.
`none` schreibt keine Klausel, sodass das Standardverhalten der Datenbank gilt – siehe [ON DELETE und ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Eine bei `erd_add_relationship` oder `erd_link_columns` weggelassene Aktion ist `none`.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Setzt zwei Tabellen in Beziehung. Es kopiert den Primärschlüssel der Elterntabelle als Fremdschlüsselspalten in die Kindtabelle und erstellt zuerst eine Primärschlüsselspalte, wenn die Elterntabelle keine hat. Jede Fremdschlüsselspalte wird so benannt, wie das Zeichnen einer Beziehung im Editor sie benennt: Der Schlüssel `id` von `users` ergibt `users_id`, und ein Schlüssel wie `member_id` behält seinen Namen – siehe [Namen der Fremdschlüsselspalten](../guide/guides/relationship-editing.md#foreign-key-column-names). Jede übernimmt den Datentyp ihres Schlüssels, außer dass ein Serial-Schlüssel den Ganzzahltyp ergibt, den er speichert, etwa `integer` für `serial4`, und ein bloßes `serial` außerhalb von PostgreSQL, MySQL und MariaDB `serial` bleibt – siehe [Identifizierende Beziehungen](../guide/guides/relationship-editing.md#identifying-relationships). Jede übernimmt außerdem den logischen Namen ihres Schlüssels und wird mit der Domäne verknüpft, mit der ihr Schlüssel verknüpft ist, sofern ein Serial-Schlüssel ihr nicht einen anderen Typ gibt. `createdIds` enthält die neue Schlüsselspalte, falls eine erstellt wurde, die Fremdschlüsselspalten und zuletzt die ID der Beziehung. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Zeichnet eine Beziehung zwischen bereits vorhandenen Spalten und paart Start- und Endspalten nach ihrer Position. Es benennt keine Spalte um, ändert keinen Datentyp und kopiert weder einen logischen Namen noch eine Domäne. |
| `erd_remove_relationship` | `relationshipId` | Entfernt eine Verbindungslinie. Ihre Fremdschlüsselspalten bleiben in der Tabelle. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Ändert die Kardinalität einer Beziehung. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Legt die Aktion für ON DELETE einer Beziehung fest: was das Löschen einer Elternzeile mit ihren Kindzeilen macht. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Legt die Aktion für ON UPDATE einer Beziehung fest: was das Ändern eines Elternschlüssels mit dessen Kindzeilen macht. |

`erd_add_relationship` benennt beim Ausführen die Fremdschlüsselspalten und kopiert die logischen Namen ihrer Schlüssel. Eine spätere Umbenennung oder ein späterer logischer Name am Schlüssel erreicht sie nicht, benennen Sie daher zuerst die Elterntabelle und ihren Primärschlüssel und geben Sie dem Schlüssel seinen logischen Namen.
Die Namen, die es vergibt, gelten als von Hand geschrieben, sodass ein späterer logischer Name sie unverändert lässt, während `erd_derive_physical_names` sie wieder den Wörterbüchern überlässt – siehe [Wörterbücher](#dictionaries).

Kein Tool ändert die Spalten einer bestehenden Beziehung so, wie es der Dialog [Spalten zuordnen](../guide/guides/relationship-editing.md#map-columns) des Editors tut.
Um eine Beziehung anderen Spalten zuzuordnen, führen Sie `erd_remove_relationship`, das ihre Fremdschlüsselspalten in der Tabelle lässt, und `erd_link_columns` mit den gewünschten Spalten in einem `erd_batch` aus, das ein einziges `erd_undo` rückgängig macht.

### Indizes {#indexes}

Die ID einer Indexspalte ist ein Eintrag der Spaltenliste des Index, die `erd_get` liefert, nicht die ID der Tabellenspalte.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Fügt einer Tabelle einen leeren Index hinzu und gibt seine ID in `createdIds` zurück. |
| `erd_remove_index` | `indexId` | Entfernt einen Index. |
| `erd_change_index_name` | `indexId`, `value` | Benennt einen Index um. |
| `erd_set_index_unique` | `indexId`, `value` | Legt fest, ob der Index eindeutig ist. |
| `erd_add_index_column` | `indexId`, `columnId` | Fügt dem Index eine Spalte seiner Tabelle hinzu und gibt die ID der neuen Indexspalte zurück. Eine Spalte, die bereits im Index ist, bleibt unverändert. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Entfernt eine Spalte aus einem Index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Verschiebt eine Spalte innerhalb eines Index an die Position einer anderen seiner Spalten. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Legt die Sortierreihenfolge einer Spalte in einem Index fest, `ASC` oder `DESC`. |

### Notizen {#memos}

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_memo` | | Fügt an einer freien Stelle eine leere Notiz hinzu und gibt ihre ID in `createdIds` zurück. |
| `erd_remove_memo` | `memoId` | Entfernt eine Notiz. |
| `erd_change_memo_value` | `memoId`, `value` | Ersetzt den Text einer Notiz. |
| `erd_change_memo_color` | `memoId`, `color` | Legt die Farbe einer Notiz fest. |
| `erd_move_memo` | `memoId`, `x`, `y` | Verschiebt eine Notiz an eine Position auf der Zeichenfläche. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Ändert die Größe einer Notiz. Die Breite muss mindestens etwa `116` Pixel und die Höhe mindestens `100` betragen. Es erzeugt keinen Rückgängig-Eintrag, da der Editor eine Größenänderung einer Notiz nur beim Ziehen aufzeichnet. |

Solange Notizen über [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos` ausgeblendet sind, fügt `erd_add_memo` trotzdem eine hinzu, und sie bleibt ausgeblendet, bis Notizen wieder eingeblendet werden.
`erd_list` und `erd_get` listen auch ausgeblendete Notizen auf.

### Tabellengruppen {#table-groups}

Eine Tabellengruppe ist ein benannter Rahmen, der hinter ihren Tabellen gezeichnet wird, und ihre Farbe erscheint auf dem Rahmen und quer über die Tabellenköpfe ihrer Tabellen – siehe [Tabellengruppen](../guide/guides/table-groups.md).
Eine Tabelle gehört höchstens zu einer Gruppe. `erd_move_table`, `erd_move_tables` und `erd_move_table_group` ändern nie, welche Tabellen eine Gruppe enthält, wohin sie eine Tabelle auch setzen, während im Editor eine Tabelle dort, wo sie abgelegt wird, einer Gruppe beitritt oder sie verlässt – siehe [Tabellen hinzufügen und entfernen](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` und `erd_set_table_group` fügen Tabellen einer Gruppe hinzu, und `erd_remove_table_group` lässt ihre Tabellen ohne Gruppe zurück.
Eine Gruppe speichert ein Rechteck, mindestens `160` Pixel breit und `100` hoch, die Titelleiste eingeschlossen, und der Editor zeichnet den Rahmen so vergrößert, dass er jede ihrer Tabellen aufnimmt.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Fügt eine Gruppe hinzu und gibt ihre ID in `createdIds` zurück. Übergeben Sie entweder `tableIds` oder ein Rechteck, also `x`, `y`, `width` und `height` zusammen. Mit `tableIds` verlässt jede Tabelle eine etwaige bisherige Gruppe, und das Rechteck wird so um sie herum angepasst, wie es beim [Gruppieren ausgewählter Tabellen](../guide/guides/table-groups.md#grouping-selected-tables) geschieht. Ein Rechteck nimmt jede Tabelle ohne Gruppe auf, deren Mittelpunkt darin liegt, wie beim [Zeichnen einer Gruppe](../guide/guides/table-groups.md#drawing-a-group). Ein leerer Wert von `name` lässt die Gruppe unbenannt. Ein einziges `erd_undo` entfernt die Gruppe und setzt jede Tabelle in die Gruppe zurück, in der sie war. |
| `erd_remove_table_group` | `groupId` | Entfernt eine Gruppe. Ihre Tabellen bleiben, wo sie sind, ohne Gruppe. |
| `erd_change_table_group_name` | `groupId`, `value` | Benennt eine Gruppe um. Eine leere Zeichenkette lässt sie unbenannt. |
| `erd_change_table_group_color` | `groupId`, `color` | Legt die Farbe einer Gruppe fest. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Verschiebt eine Gruppe so, dass ihr Rechteck an diesem Punkt beginnt, und ihre Tabellen um denselben Versatz mit, wie beim Ziehen ihrer Titelleiste. Eine Verschiebung um weniger als 20 Pixel, waagerecht und senkrecht zusammengerechnet, erzeugt keinen Rückgängig-Eintrag. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Legt das Rechteck einer Gruppe fest, wobei ihre Tabellen bleiben, wo sie sind. Ohne `x` und `y` bleibt ihre Ecke erhalten. Ein Rechteck, das die Tabellen der Gruppe samt ihrem Innenabstand nicht aufnehmen würde, wird abgelehnt, mit einer Meldung, die den Rahmen nennt, den es aufnehmen muss. |
| `erd_set_table_group` | `tableIds`, `groupId` | Fügt Tabellen einer Gruppe hinzu, wobei jede eine etwaige bisherige Gruppe verlässt. Der Wert `null` oder eine leere Zeichenkette für `groupId` nimmt sie aus jeder Gruppe heraus. |

Solange Gruppen über `View Option` → `Table Groups` ausgeblendet sind, fügen diese Tools trotzdem Gruppen hinzu und ändern sie, und diese bleiben ausgeblendet, bis Gruppen eingeblendet werden – siehe [Gruppen ausblenden](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` hält die Tabellen jeder Gruppe zusammen, `erd_import_dbml` und `erd_import_json` bringen Gruppen mit – siehe [Import](#import) – und `erd_read` schreibt mit `groupNames` die DDL ausgewählter Gruppen.
Eine Version von ERD Editor, die noch keine Tabellengruppen kennt, verwirft beim Speichern einer Datei deren Gruppen, wie es die Erweiterung für VS Code vor `4.0.0` und die Plugins für Obsidian und JetBrains vor `1.0.0` tun – siehe [Aktualisieren](./installation.md#updating).

### Wörterbücher {#dictionaries}

Diese Tools bearbeiten die drei Wörterbücher der Registerkarte [Wörterbuch](../guide/guides/dictionary.md) des Editors, aus denen der logische Name einer Tabelle oder Spalte ihren physischen Namen ableitet:

- Ein Wort ist ein Standardwort, aus dem logische Namen bestehen, mit der Abkürzung, die es in einen physischen Namen schreibt, etwa `Member` und `MBR`.
- Ein Begriff ist ein ganzer logischer Name mit dem physischen Namen, den er ergibt, und bei einer Spalte der Domäne, die er verknüpft, etwa `Member Number` mit `MBR_NO` und `Identifier`.
- Eine Domäne ist ein benannter Datentyp, mit dem Spalten verknüpft werden, etwa `Identifier` für `INT`.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Fügt am Ende des Wörterbuchs der Wörter ein Wort hinzu und gibt seine ID in `createdIds` zurück. `synonyms` und `forbiddenWords` sind durch Kommas getrennt: andere Schreibweisen des Worts und Wörter, die nicht an seiner Stelle verwendet werden dürfen. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Ändert die übergebenen Felder und lässt die übrigen unverändert. |
| `erd_remove_word` | `wordId` | Entfernt ein Wort. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Fügt am Ende des Wörterbuchs der Begriffe einen Begriff hinzu und gibt seine ID in `createdIds` zurück. Ohne `physicalName` setzen die Wörter einen zusammen, wenn sie es können, etwa `MBR_NO` für `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Ändert die übergebenen Felder und lässt die übrigen unverändert. Ein `name`, der übergeben wird, während der Begriff keinen physischen Namen enthält, oder zusammen mit einem leeren `physicalName`, schreibt außerdem den physischen Namen, den seine Wörter zusammensetzen, falls sie einen zusammensetzen. |
| `erd_remove_term` | `termId` | Entfernt einen Begriff. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Fügt am Ende des Wörterbuchs der Domänen eine Domäne hinzu und gibt ihre ID in `createdIds` zurück. `category` gruppiert Domänen, etwa `Number` oder `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Ändert die übergebenen Felder und lässt die übrigen unverändert. Ein neuer `dataType` erreicht jede mit der Domäne verknüpfte Spalte und folgt den Beziehungen, solange die Datentyp-Synchronisierung für Beziehungen eingeschaltet ist, wobei Verknüpfungen auf dieselbe Weise aufgehoben werden wie bei `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Entfernt eine Domäne. Die mit ihr verknüpften Spalten behalten ihren Datentyp, und sie und die mit ihr verknüpften Begriffe zeigen keine Domäne: Ihre `domainId` wird als leere Zeichenkette gelesen. `erd_undo` stellt die Verknüpfungen wieder her, und ein Speichern lässt sie in der Datei weg. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Leitet physische Namen neu aus den logischen Namen ab, wie es [Physische Namen neu ableiten](../guide/guides/dictionary.md#derive-physical-names-again) im Editor tut, für eine Spalte, eine Tabelle oder das ganze Dokument. |

- Ein Wörterbuch enthält jeden Namen nur einmal, daher wird ein Name, den eine andere Zeile desselben Wörterbuchs enthält, mit `invalidArgs` abgelehnt. Namen werden ohne Leerraum am Anfang und Ende verglichen, wobei die Groß-/Kleinschreibung zählt, sodass `Member` und `member` zwei Namen sind.
- Eine Aktualisierung nennt die Zeile über ihre ID und übergibt mindestens ein Feld. Werte, die die Zeile bereits enthält, ändern nichts und erzeugen keinen Rückgängig-Eintrag; ein Hinzufügen oder Entfernen erzeugt immer einen.
- Die Domäne eines Begriffs wird entweder über `domainId` angegeben, mit `null` oder einer leeren Zeichenkette für keine, oder über `domainName`, mit einer leeren Zeichenkette für keine. Ein `domainName` nimmt die erste Domäne dieses Namens in der Reihenfolge des Wörterbuchs, so verglichen wie Namen. Beides zu übergeben oder einen `domainName`, den keine Domäne trägt, wird abgelehnt. `erd_set_column_domain` nimmt eine Domäne auf dieselbe Weise an.
- Das Ändern oder Entfernen eines Worts oder Begriffs benennt nichts um und hebt keine Verknüpfung auf: Die Namen und Domänen, die das Wort oder der Begriff vergeben hat, bleiben, wie sie sind. `erd_derive_physical_names` leitet die Namen neu ab und verknüpft die Domäne, die ein Begriff jetzt ergibt, aber eine Spalte, zu der jetzt kein Begriff passt oder deren Begriff keine Domäne ergibt, behält die Domäne, mit der sie verknüpft ist. `erd_set_column_domain` mit einer leeren `domainId` hebt die Verknüpfung auf.
- Kein Tool importiert oder exportiert ein Wörterbuch als CSV, sortiert ein Wörterbuch oder fügt Zeilen an einer bestimmten Position ein, wie es die Registerkarte Wörterbuch tut.

`erd_list` listet die Zeilen auf, `erd_get` liefert jedes Feld, das Format `snapshot` von `erd_read` enthält sie alle, und `erd_list_checks` listet auf, was die Wörterbücher als fehlerhaft finden – siehe [Dokument lesen](#reading-a-document).

`erd_set_table_logical_name` und `erd_set_column_logical_name` leiten einen physischen Namen so ab, wie es der Editor tut, wenn ein logischer Name geschrieben wird – siehe [Physische Namen ableiten](../guide/guides/dictionary.md#deriving-physical-names):

- Ein Name wird nur abgeleitet, solange er leer ist oder selbst abgeleitet wurde, was die Lesevorgänge als `nameDerived: true` zeigen. Ein Name, der nicht leer ist und von Hand geschrieben wurde, bleibt, und nur der logische Name wird geschrieben. `erd_change_table_name`, `erd_change_column_name`, die Importe von SQL, GraphQL, DBML und AML sowie die Fremdschlüsselspalten, die `erd_add_relationship` benennt, schreiben alle Namen von Hand. Ein Name, der in eine leere Zeichenkette umbenannt wurde, wird vom nächsten logischen Namen erneut abgeleitet.
- Der Begriff, dessen Name der logische Name ist, hat Vorrang, verglichen wie Wörterbuchnamen. Er ergibt seinen physischen Namen oder, solange er keinen enthält, den, den seine Wörter zusammensetzen. Bei einer Spalte verknüpft er außerdem die Domäne des Begriffs, auch wenn kein Name abgeleitet wird, und die Spalte übernimmt den Datentyp der Domäne, der den Beziehungen folgt, solange die Datentyp-Synchronisierung für Beziehungen eingeschaltet ist.
- Ohne einen solchen Begriff setzen die Wörter den Namen zusammen, ihre Abkürzungen mit Unterstrichen verbunden: `Member Number` ergibt `MBR_NO`. Es gilt alles oder nichts: Ein Synonym, ein verbotenes Wort, Text, den kein Wort aufführt, oder ein Wort ohne Abkürzung setzt nichts zusammen, und der Name bleibt, wie er war. Die Wörter verknüpfen keine Domäne, ebenso wenig ein Begriff ohne Domäne, sodass eine Spalte die Domäne behält, mit der sie verknüpft ist.
- Eine Spalte, deren abgeleiteten Namen bereits eine andere Spalte ihrer Tabelle trägt, ohne Beachtung der Groß-/Kleinschreibung, behält ihren Namen, ihr `nameDerived` und ihre Domäne.
- Das Löschen eines logischen Namens lässt den physischen Namen unverändert. Ein Aufruf, dessen logischer Name und das, was er ableitet, bereits vorhanden sind, ändert nichts und erzeugt keinen Rückgängig-Eintrag.

`erd_derive_physical_names` erhält einen `scope`: `column` mit `tableId` und `columnId` für diese Spalte; `table` mit `tableId` für den Namen der Tabelle und jede ihrer Spalten; oder `document` ohne ID für jede Tabelle und ihre Spalten. Ein `scope`, dem eine benötigte ID fehlt oder der eine ID erhält, die er nicht annimmt, wird abgelehnt.
Jeder erfasste Name, der einen logischen Namen hat, wird wieder den Wörterbüchern überlassen, auch ein von Hand geschriebener, und übernimmt, was sie jetzt ergeben: den physischen Namen eines Begriffs und bei einer Spalte dessen Domäne und Typ oder andernfalls die Zusammensetzung aus den Wörtern, die die Domäne der Spalte unverändert lässt. Ein logischer Name, der nichts ableitet, lässt den Namen unverändert, wobei `nameDerived` nun `true` ist. Ein Name ohne logischen Namen bleibt, wie er ist, und ebenso eine Spalte, deren neuen Namen eine andere Spalte ihrer Tabelle trägt, etwa ein zweiter Fremdschlüssel auf dieselbe Tabelle; diese Spalte behält auch ihr `nameDerived`. Ein einziges `erd_undo` macht den ganzen Aufruf rückgängig.
Die Namen eines importierten Schemas sind von Hand geschrieben, benennen Sie es daher aus den Wörterbüchern, indem Sie die logischen Namen festlegen und dann `erd_derive_physical_names` aufrufen. Dieser Aufruf ergibt den eigenen physischen Namen eines Begriffs, den eine Änderung an den Wörtern des Begriffs nicht neu zusammensetzt. Aktualisieren Sie daher nach einer Änderung der Wörter eines Begriffs zuerst den Begriff: Übergeben Sie seinen `name` mit einem leeren `physicalName`, damit die Wörter ihn neu zusammensetzen, oder übergeben Sie den neuen `physicalName`.

Eine Version von ERD Editor, die die Registerkarte Wörterbuch noch nicht kennt, verwirft beim Speichern einer Datei deren logische Namen, Domänenverknüpfungen und Wörterbuchzeilen, wie es die Erweiterung für VS Code vor `4.2.0` und die Plugins für Obsidian und JetBrains vor `1.2.0` tun. Von diesen bearbeiten die Erweiterung in Version `4.0.0` oder `4.1.0` und die Plugins in Version `1.0.0` oder `1.1.0` weiterhin live mit dem Server, aber sie zeigen die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die ein Agent schreibt, weder an, noch behalten sie sie – siehe [Aktualisieren](./installation.md#updating).

### Einstellungen {#settings}

Ein Agent legt die Einstellungen des Schemas selbst fest: die Datenbank, ihren Namen und die Skripte von [Schema SQL](../guide/guides/schema-sql.md).
Jede andere Einstellung, die das Dokument speichert, legt der Benutzer im Editor fest: die [Namensansicht](../guide/guides/logical-names.md#name-view), die Schalter der [Ansichtsoptionen](../guide/guides/table-related-functions.md#table-view-options), die Optionen der Registerkarte [Einstellungen](../guide/guides/settings.md), Sprache und Schreibweisen des Codegenerators, den Begrenzertyp und die [Sperren](../guide/guides/settings.md#lock).
Kein Tool ändert sie, mit Ausnahme der Importe im Modus `replace`: `erd_import_json` übernimmt die Einstellungen und Sperren des Dokuments, das es lädt, und die anderen vier setzen die Ansicht an den Anfang der Zeichenfläche zurück – siehe [Import](#import).
Der Server `1.0.0` hat die Tools entfernt, die sie festlegten: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` und `erd_set_show`.

`erd_list` und das Format `snapshot` von `erd_read` melden die Einstellungen so, wie die Datei sie speichert, wobei `lockSettings` ein Kennzeichen pro Sperre enthält: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` und `unlockNameViewMode`.
Das letzte wird umgekehrt gelesen: Es ist `false`, solange die Sperre `Name View` eingeschaltet ist, wie in einem neuen Dokument und in einer Datei, die gespeichert wurde, bevor es diese Sperre gab, und `true`, sobald der Benutzer die Sperre ausschaltet.
Eine gesperrte Sprache, Schreibweise oder ein gesperrter Begrenzertyp wird mit dem gesperrten Wert gemeldet, dem Wert, den die Datei behält und mit dem jeder Editor öffnet, unabhängig davon, was der Bildschirm eines Editors zeigt. Die Ansicht, die Registerkarte und die Namensansicht werden nicht gemeldet. Ein Agent liest und schreibt logische Namen unabhängig davon, was die Namensansicht zeigt.

`erd_set_ddl_script` erzeugt einen Rückgängig-Eintrag. `erd_set_database` und `erd_set_database_name` erzeugen keinen, daher kann `erd_undo` sie nicht rückgängig machen.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_set_database` | `value` | Legt die Datenbank fest: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` oder `Snowflake`. Damit werden die Datentypen der Datenbank gewählt sowie die DDL, die `erd_read` schreibt, wenn kein Wert für `vendor` angegeben ist. |
| `erd_set_database_name` | `value` | Legt den Datenbanknamen fest, den die Vorspanne `use` und `createAndUse` von `erd_read` nennen. |
| `erd_set_ddl_script` | `position`, `sql` | Legt eines der beiden Skripte fest, die um die Tabellen herum geschrieben werden – siehe [Skripte vor und nach den Tabellen](../guide/guides/schema-sql.md#before-and-after-scripts). `position` ist `before` für ein Skript vor den Tabellen, etwa `CREATE EXTENSION` oder `CREATE SCHEMA`, oder `after` für eines nach ihnen, etwa `GRANT` oder `CREATE VIEW`. `sql` ersetzt das ganze Skript, höchstens 10.000 Zeichen, und eine leere Zeichenkette entfernt es. Lesen Sie das aktuelle Skript zuerst mit dem Format `scripts` von `erd_read`. |

Ein Skript geht unverändert in die DDL jeder Datenbank ein, schreiben Sie es daher für die Datenbank des Dokuments. Bei MSSQL wird nach einem Skript, dessen letzte Zeile nicht `GO` ist, eine Zeile `GO` angefügt.
Eine Version von ERD Editor, die diese Skripte noch nicht kennt, verwirft beim Speichern einer Datei deren Skripte, wie es die Erweiterung für VS Code vor `4.0.0` und die Plugins für Obsidian und JetBrains vor `1.0.0` tun – siehe [Aktualisieren](./installation.md#updating).

### Import {#import}

Diese Tools lesen ein Schema so ein, wie es das Import-Menü des Editors tut – siehe [Dateien importieren oder exportieren](../guide/guides/file-import-export.md).
Jedes erhält den Text als `value` sowie `mode`: `replace`, der Standardwert, oder `append`.

| Tool | Argumente | Was es tut |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Lädt SQL-DDL, Anweisungen wie `CREATE TABLE` und Ähnliches. |
| `erd_import_graphql` | `value`, `mode?` | Lädt eine GraphQL-SDL. |
| `erd_import_dbml` | `value`, `mode?` | Lädt DBML. Jede `TableGroup` wird zu einer Tabellengruppe aus den Tabellen, die sie nennt – siehe [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Lädt AML. |
| `erd_import_json` | `value`, `mode?` | Lädt ein JSON-Dokument von erd-editor, etwa eine andere Datei `.erd.json`. |

`replace` ersetzt das Dokument, und `erd_undo` stellt das vorherige wieder her:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` und `erd_import_aml` ersetzen alle Tabellen, Beziehungen, Indizes, Notizen und Tabellengruppen. Sie behalten die Einstellungen des Dokuments bei, seine Sperren eingeschlossen, abgesehen von der Ansicht, die bei 100 % an den Anfang der Zeichenfläche zurückkehrt, und sie behalten seine Wörterbücher der Wörter, Begriffe und Domänen. Die Tabellen, die sie mitbringen, haben keine logischen Namen und sind mit keiner Domäne verknüpft.
- `erd_import_json` ersetzt das ganze Dokument, seine Einstellungen und Wörterbücher eingeschlossen: Die Einstellungen, Sperren, Wörter, Begriffe und Domänen des JSON treten an die Stelle derer dieses Dokuments, und ein JSON, das keine Sperren enthält, schaltet jede Sperre ein und setzt die Ansicht an den Anfang der Zeichenfläche. Jeder Betrachter behält seine eigene Namensansicht, es sei denn, im JSON ist die Sperre `Name View` ausgeschaltet, dann bringt es seine Namensansicht mit. Um die Einstellungen dieses Dokuments zu behalten, gehen Sie von dem Text aus, den das Format `json` von `erd_read` liefert. Ein leerer Text ergibt ein neues Dokument wie jenes, das `erd_open_document` mit `create` erstellt.

`append` fügt den Import dem Dokument hinzu, wie [Importieren und hinzufügen](../guide/guides/file-import-export.md#import-and-add) im Editor, und ein einziges `erd_undo` nimmt die ganze Ergänzung zurück:

- Was der Text enthält, kommt als neue Entitäten mit neuen IDs hinzu, in einem Block unterhalb von allem, was das Dokument enthält, ausgeblendete Notizen und Tabellengruppen eingeschlossen, an dessen linker Kante ausgerichtet. Jede bereits vorhandene Tabelle und Einstellung bleibt, auch eine Tabelle mit demselben Namen: Nichts wird nach Namen zusammengeführt.
- Beziehungen und Indizes kommen nur zwischen den Tabellen hinzu, die der Import mitbringt, daher wird ein Fremdschlüssel auf eine Tabelle, die der Text nicht deklariert, verworfen.
- `erd_import_sql`, `erd_import_graphql` und `erd_import_aml` fügen Tabellen mit ihren Beziehungen und Indizes hinzu, und `erd_import_dbml` auch seine Tabellengruppen. `erd_import_json` fügt Tabellen, Beziehungen, Indizes, Notizen und Tabellengruppen hinzu, nie seine Einstellungen, und lehnt einen leeren Text ab. Seine Tabellen und Spalten bringen ihre logischen Namen mit, aber keine Spalte ist mit einer Domäne verknüpft, und von den Wörtern, Begriffen und Domänen des JSON kommt nichts hinzu.

Ein JSON-Dokument behält seine eigene Anordnung, seine Tabellengruppen eingeschlossen: mit `replace` dort, wo es seine Tabellen platziert, und mit `append` innerhalb des hinzugefügten Blocks.
Die Tabellen aus SQL, GraphQL, DBML und AML werden in Zeilen angeordnet, die mit den wenigsten Spalten zuerst und die Tabellen jeder Gruppe zusammen, so wie `erd_sort_tables` sie platziert, nie per `Flow`, wie sie der Import des Editors selbst nach Möglichkeit anordnet. Diese vier Tools lehnen in beiden Modi einen leeren Text ab.

## erd_batch {#erd_batch}

`erd_batch` führt mehrere Bearbeitungs-Tools der Reihe nach als eine Änderung aus, alle oder keines.

- `operations` enthält bis zu 100 Einträge, jeder `{ tool, as?, args? }`, wobei `tool` ein Bearbeitungs-Tool ist und `args` die Argumente des Tools ohne `path` sind. Ein Lese-Tool wie `erd_list_checks` wird abgelehnt.
- Die Operationen werden zuerst an einer Kopie des Dokuments erprobt. Eine abgelehnte wird genannt, etwa `operations[1] erd_remove_table: …`, und nichts wird angewendet.
- Ein einziges `erd_undo` macht den ganzen Stapel rückgängig, abgesehen von den Operationen, die es nicht rückgängig machen kann und die `undoNote` im Ergebnis nennt: die eines Tools, das keinen Rückgängig-Eintrag erzeugt, etwa `erd_set_database`, und die, die das Dokument geändert haben, ohne einen zu erzeugen, etwa ein kurzes `erd_move_table_group`. Einen Stapel, der überhaupt keinen Rückgängig-Eintrag erzeugt hat, überspringt `erd_undo`. `historyEntries` im Ergebnis zählt die Verlaufseinträge des Editors darin, nicht Aufrufe von `erd_undo`.
- In einer Live-Sitzung übernimmt der Editor den ganzen Stapel oder nichts davon.

Ein Agent kann die IDs, die ein Stapel erstellt, vor dem Aufruf nicht kennen, daher lässt eine mit `as` benannte Operation eine spätere darauf verweisen: `$name` oder `$name.0` für ihre erste erstellte ID, `$name.1` für ihre zweite und `$name.last` für ihre letzte.
Ein Name besteht aus ASCII-Buchstaben, Ziffern und Unterstrichen, beginnt nicht mit einer Ziffer und benennt nur eine einzige Operation.
Ein Verweis wird nur dort aufgelöst, wo ein Argument eine Entitäts-ID erwartet, `wordId`, `termId` und `domainId` eingeschlossen, daher bleibt ein Name oder Kommentar, der `$x` lautet, Text.
Ein `domainName` ist ebenfalls Text, wird aber gelesen, wenn seine Operation ausgeführt wird, sodass er eine Domäne nennen kann, die eine frühere Operation des Stapels hinzugefügt hat.

Eine Tabelle mit ihren Spalten und einer Beziehung in einem Aufruf:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_table", "as": "users" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$users", "value": "users" } },
    { "tool": "erd_add_column", "as": "uid", "args": { "tableId": "$users" } },
    { "tool": "erd_change_column_name", "args": { "tableId": "$users", "columnId": "$uid", "value": "id" } },
    { "tool": "erd_change_column_data_type", "args": { "tableId": "$users", "columnId": "$uid", "value": "BIGINT" } },
    { "tool": "erd_set_column_primary_key", "args": { "tableId": "$users", "columnId": "$uid", "value": true } },
    { "tool": "erd_add_table", "as": "orders" },
    { "tool": "erd_change_table_name", "args": { "tableId": "$orders", "value": "orders" } },
    { "tool": "erd_add_relationship", "args": { "startTableId": "$users", "endTableId": "$orders", "relationshipType": "ZeroN", "onDelete": "cascade" } }
  ]
}
```

Die Tabelle `users` und ihr Schlüssel `id` werden vor der Beziehung benannt, daher heißt die Fremdschlüsselspalte, die die Beziehung `orders` hinzufügt, `users_id`.

Wörter, eine Domäne und ein Begriff, dann eine Tabelle, die über ihre logischen Namen aus ihnen benannt wird:

```json
{
  "path": "shop.erd.json",
  "operations": [
    { "tool": "erd_add_word", "args": { "name": "Member", "abbreviation": "MBR" } },
    { "tool": "erd_add_word", "args": { "name": "Number", "abbreviation": "NO" } },
    { "tool": "erd_add_word", "args": { "name": "Name", "abbreviation": "NM" } },
    { "tool": "erd_add_domain", "as": "identifier", "args": { "name": "Identifier", "dataType": "INT" } },
    { "tool": "erd_add_term", "args": { "name": "Member Number", "domainId": "$identifier" } },
    { "tool": "erd_add_table", "as": "members" },
    { "tool": "erd_set_table_logical_name", "args": { "tableId": "$members", "value": "Member" } },
    { "tool": "erd_add_column", "as": "no", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$no", "value": "Member Number" } },
    { "tool": "erd_add_column", "as": "nm", "args": { "tableId": "$members" } },
    { "tool": "erd_set_column_logical_name", "args": { "tableId": "$members", "columnId": "$nm", "value": "Member Name" } }
  ]
}
```

Der Begriff setzt `MBR_NO` aus seinen Wörtern zusammen, und die Tabelle heißt `MBR`. Die Spalte `Member Number` übernimmt `MBR_NO` des Begriffs und seine Domäne, sodass sie mit `Identifier` verknüpft ist und den Typ `INT` hat, und für `Member Name`, das kein Begriff enthält, wird `MBR_NM` zusammengesetzt.

## Ergebnisse {#results}

Eine Änderung liefert als Antwort eine Zeile JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Feld | Bedeutung |
| --- | --- |
| `mode` | `live` oder `headless` – siehe [Live und Headless](./live-and-headless.md). |
| `saved` | `true` im Ergebnis jeder Änderung, jedes `erd_batch`, `erd_undo` und `erd_redo` im Headless-Modus: Die Datei enthält die Änderung, sobald der Aufruf antwortet, sodass nichts mehr zu speichern bleibt. Ein Live-Ergebnis hat kein `saved`, da der Editor die Änderung hält – siehe [Speichern](./live-and-headless.md#saving). |
| `createdIds` | Die IDs dessen, was der Aufruf erstellt hat, der Reihe nach. |
| `batches`, `historyEntries` | Wie viele Änderungsstapel der Aufruf gesendet und wie viele Verlaufseinträge im Editor er erzeugt hat. |
| `undoable`, `undoNote` | `undoable` ist `false`, wenn `erd_undo` den Aufruf überspringen wird, und `undoNote` sagt, warum: Das Tool erzeugt keinen Rückgängig-Eintrag, der Aufruf hat das Dokument geändert, ohne einen zu erzeugen, wie es ein `erd_move_table_group` um weniger als 20 Pixel tut, oder das Dokument hatte den Wert bereits. Ein Ergebnis von `erd_batch` enthält immer einen Hinweis `undoNote`. Hat der Stapel einen Rückgängig-Eintrag erzeugt, besagt der Hinweis, dass ein einziges `erd_undo` den Stapel rückgängig macht, und nennt jede Operation, die es bestehen lässt; hat er keinen erzeugt, enthält das Ergebnis `undoable: false`, und der Hinweis besagt, dass `erd_undo` den Stapel überspringt. |
| `mismatch` | Vorhanden, wenn der Aufruf eine andere Anzahl von Stapeln oder Verlaufseinträgen erzeugt hat, als das Tool angibt. |
| `notes` | Vorhanden, wenn sich an der Sitzung etwas geändert hat, etwa ein Editor, der beendet wurde oder das Dokument nicht mehr bedient, oder eine Datei, die sich auf dem Datenträger geändert hat. |

Eine Ablehnung ist ein Fehlerergebnis mit einem Code und einer Meldung, die sagt, was zu tun ist:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Grund |
| --- | --- |
| `notFound` | Eine ID bezeichnet nichts Vorhandenes, oder die Datei existiert nicht. |
| `invalidArgs` | Ein Argument fehlt oder hat den falschen Wert. |
| `invalidPath` | Der Pfad ist kein ERD-Dokument. Unter Windows auch ein Pfad mit einem Namen, den Windows nicht so speichert, wie er geschrieben ist, oder einer, der ein Dokument erreicht, das ein Editor unter einem anderen Pfad hält, den die Meldung nennt. |
| `invalidDocument` | Die Datei ist kein Dokument, das der Editor lesen kann. |
| `tooLarge` | Ein Lesevorgang passt nicht in eine Antwort. |
| `blocked` | Ein Editor mit ausgeschaltetem Hub hält das Dokument. Die Meldung sagt, wie der Hub eingeschaltet wird: Vertrauen Sie in VS Code dem Arbeitsbereich und schalten Sie `dineug.erd-editor.agentHub.enabled` ein, oder laden Sie das Fenster neu; schalten Sie in Obsidian Coding agents ein, oder laden Sie Obsidian neu; schalten Sie in einer JetBrains-IDE Coding agents ein, oder starten Sie die IDE neu, wenn Coding agents eingeschaltet ist. |
| `hubDisabled` | Eine JetBrains-IDE hält das Dokument nur in einem Projekt, dem sie nicht vertraut. Lesevorgänge funktionieren weiterhin; vertrauen Sie dem Projekt, damit der Agent Änderungen vornehmen kann. |
| `conflict` | Die Datei hat sich während des Aufrufs auf dem Datenträger geändert. Es wurde nichts geschrieben. |
| `hubAppeared`, `hubGone` | Ein Editor hat begonnen, ein Dokument zu bedienen, das der Agent auf dem Datenträger bearbeitete, oder der Editor, der es bediente, läuft noch, aber seine Sperrdatei und Verbindung sind verschwunden. Es wurde nichts geschrieben. |
| `notSaved` | `erd_save` konnte das Dokument des Editors nicht speichern. |
| `readonly` | Der Editor hält das Dokument schreibgeschützt, etwa eine Datei, die er nicht schreiben oder nicht als Diagramm lesen kann. Ohne Editor ist die Datei selbst schreibgeschützt, etwa eine nicht ausgecheckte Datei in Perforce oder TFVC. Es wurde nichts geschrieben. |
| `protocolMismatch` | Die Erweiterung oder das Plugin ERD Editor des Editors und der Server sprechen unterschiedliche Protokollversionen, etwa Server `1.0.0` oder neuer mit einer Erweiterung für VS Code in Version `3.x`. Auch Lesevorgänge werden abgelehnt, und die Meldung nennt die Seite, die aktualisiert werden muss – siehe [Aktualisieren](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Der Hub eines Editors hat die Verbindung nicht angenommen, nicht innerhalb von 30 Sekunden geantwortet oder sie während des Aufrufs getrennt. Unter Windows bedeutet `hubUnreachable` auch, dass Windows den Agenten vom Hub ferngehalten hat: Der Editor läuft mit mehr Rechten als der Agent, etwa wenn er als Administrator gestartet wurde und der Agent nicht, oder der Agent läuft in einer Sandbox. |

Andere Codes sind seltener, und jede Ablehnung enthält eine Meldung, die sagt, was passiert ist.

Die Bearbeitungs-Tools, `erd_batch` und die vier Lese-Tools lehnen ein Argument, das sie nicht deklarieren, oder eines mit falschem Typ mit einem JSON-RPC-Fehler für ungültige Parameter (`-32602`) ab, bevor sie das Dokument berühren, sodass ein falsch geschriebenes Argument nie stillschweigend verworfen wird.
Die fünf Sitzungs-Tools ignorieren Argumente, die sie nicht kennen.
