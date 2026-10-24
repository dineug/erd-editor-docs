---
sidebar_position: 12
description: Die DDL des Diagramms auf der Registerkarte Schema SQL lesen, im Optionsbereich Datenbank, Begrenzer, Anweisungen, Vorspann, logische Namen in leeren Kommentaren und Tabellen wählen, eigene Skripte vor und nach den Tabellen hinzufügen und das SQL speichern oder kopieren.
---

# Schema SQL

Die Registerkarte `Schema SQL` zeigt die DDL des Diagramms für die ausgewählte Datenbank: das SQL, das seine Tabellen mit ihren Schlüsseln, Indizes und Fremdschlüsseln erstellt.  
Wechseln Sie in der Symbolleiste zur Registerkarte `Schema SQL` oder wählen Sie in der [Schnellsuche](./quick-search.md) unter `Tab` den Eintrag `Schema SQL`. Wenn Sie im Untermenü `Export` den Eintrag `Schema SQL` wählen, öffnet sich die Registerkarte ebenfalls, bereit zum Speichern – siehe [SQL speichern oder kopieren](#saving-or-copying-the-sql).

Das SQL steht links, und rechts daneben enthält ein Optionsbereich mit der Überschrift `Schema SQL` die Optionen, die es bestimmen – siehe [Optionsbereich](#options-panel). Auch in einer Anzeigesprache mit Schreibrichtung von rechts nach links bleibt das SQL links und wird von links nach rechts gelesen.  
Der Bereich öffnet sich von selbst, sofern der Editor beim ersten Öffnen der Registerkarte nicht schmaler als 640 px ist. `Hide options` in der Kopfzeile des Bereichs klappt ihn ein, und `Show options` oben rechts am Code holt ihn zurück. Danach bleibt er so geöffnet oder eingeklappt, wie Sie ihn hinterlassen haben, auch über Wechsel der Registerkarte hinweg, solange der Editor geöffnet ist. Er wird unabhängig vom Bereich der Registerkarte Codegenerator eingeklappt und geöffnet und nie in der Datei gespeichert.

![Export > Schema SQL öffnen, die Anweisungen auf Drop & re-create und den Vorspann auf USE umstellen, dann ein SET-NAMES-Skript vor den Tabellen hinzufügen](/img/demo-schema-sql-options.webp)

Klicken Sie mit der rechten Maustaste auf das SQL, um sein Kontextmenü zu öffnen:

- `Database` und `Bracket`, jeweils ein Untermenü, das den aktuellen Wert mit einem Häkchen markiert.
- `Statements` und `Header`, jeweils ein Untermenü, das die wirksame Option mit einem Häkchen markiert. Eine Option, die die Datenbank nicht hat, trägt einen abgeschwächt dargestellten Hinweis, etwa `not in Oracle`, und bewirkt nichts.
- `Options panel`, das den Bereich einklappt oder öffnet und mit einem Häkchen markiert ist, solange er angezeigt wird.
- `Save file`

Solange diese Registerkarte geöffnet ist, bietet die Schnellsuche `Database` und `Bracket`, dazu `Schema SQL: Statements` und `Schema SQL: Header`, die nur die Optionen auflisten, die die Datenbank hat, sowie `Schema SQL: Options panel`, das den Bereich einklappt oder öffnet.  
Weder das Kontextmenü noch die Schnellsuche bietet die Option `Write logical names into empty comments`, die es nur im Optionsbereich gibt – siehe [Logische Namen als Kommentare](#logical-names-as-comments).

Das SQL wird geschrieben, wenn sich die Registerkarte öffnet, und erneut, sobald sich eine der Optionen des Bereichs, der Datenbankname oder ein Skript ändert. Eine Änderung an den Tabellen, die vorgenommen wird, während die Registerkarte geöffnet ist, etwa die eines Mitbearbeiters oder eines Coding-Agenten, erscheint, sobald Sie die Registerkarte verlassen und zurückkehren oder sobald sich eines davon ändert.

Die [Tabelleneigenschaften](./table-related-functions.md#table-properties) haben eine eigene Registerkarte `Schema SQL`, die die DDL einer einzelnen Tabelle zeigt. Sie schreibt immer einfache Anweisungen mit `CREATE` ohne Vorspann und Skripte, schreibt nie einen logischen Namen in einen leeren Kommentar, hat keinen Optionsbereich und ihr Kontextmenü bietet nur `Database` und `Bracket`.

## Optionsbereich {#options-panel}

Der Bereich enthält drei Gruppen, jede unter einer Beschriftung:

1. `Saved in the document`: `Database` und `Bracket` – siehe [Datenbank und Begrenzer](#database-and-bracket).
2. `This window only`: `Statements`, `Header`, `Write logical names into empty comments` und, solange das Diagramm eine [Tabellengruppe](./table-groups.md) hat, `Tables` – siehe [Anweisungen](#statements), [Vorspann](#header), [Logische Namen als Kommentare](#logical-names-as-comments) und [Tabellen](#tables).
3. `Saved in the document · written as is for every database`: die Skripte `Before tables` und `After tables` – siehe [Skripte vor und nach den Tabellen](#before-and-after-scripts).

`Save file` und `Copy` befinden sich am unteren Rand des Bereichs – siehe [SQL speichern oder kopieren](#saving-or-copying-the-sql).

Die Optionen unter `This window only` gehören zu dem Editorfenster, in dem Sie sie wählen. Sie werden weder im Dokument gespeichert noch mit Mitbearbeitern geteilt noch für das Rückgängigmachen aufgezeichnet, und sie werden zurückgesetzt, wenn der Editor geschlossen oder neu geladen wird; beim Wechsel der Registerkarte bleiben sie erhalten.  
`Statements` steht anfangs auf `If not exists` und `Header` auf `CREATE + USE`, und `Write logical names into empty comments` ist ausgeschaltet. Für das SQL, das eine Seite mit eingebettetem Editor über [`getSchemaSQL()`](../../api/erd-editor-element.md#getschemasql) liest, und für das SQL, das ein [Coding-Agent liest](../../mcp/tools.md#reading-a-document), gilt dagegen anfangs `Create` ohne Vorspann, und es werden keine logischen Namen geschrieben, sofern dies nicht verlangt wird.

Eine Option, die die ausgewählte Datenbank nicht hat, bleibt abgeblendet im Bereich, mit dem Tooltip `Not in <database>`, etwa `Not in Oracle`, und wenn Sie sie drücken, bewirkt das nichts.  
Das SQL verwendet dann die nächstliegende Form, die die Datenbank hat, und die Schaltfläche dieser Form wird gedrückt angezeigt: `If not exists` fällt auf `Create` zurück, `CREATE + USE` auf `USE` oder, wo die Datenbank auch kein `USE` hat, auf `None`, und `USE` auf `None`. Ihre Auswahl bleibt erhalten, sodass sie bei einem Wechsel zu einer Datenbank, die sie hat, wieder gilt.

## Datenbank und Begrenzer {#database-and-bracket}

`Database` ist die Datenbank des Diagramms, dieselbe Einstellung wie `Database` im Kontextmenü der Zeichenfläche und die Datenbank des Codegenerators – siehe [Datenbanken](./table-related-functions.md#databases). Sie listet Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake und SQLite auf, steht anfangs auf MySQL und wird wie jede Änderung in der Datei gespeichert.

`Bracket` legt das Anführungszeichen fest, das Tabellen-, Spalten-, Constraint- und Indexnamen umschließt: `SingleQuote`, `DoubleQuote`, `Backtick` oder `None` für gar keine Anführungszeichen, was der Standardwert ist. Das ist dieselbe Einstellung wie im Codegenerator – siehe [Begrenzer](./code-generator.md#bracket).  
Snowflake, das Namen nur in doppelte Anführungszeichen setzt, verwendet diese bei jeder Option außer `None`, und Databricks setzt Namen immer in Backticks.  
`Bracket` wird nur so lange in der Datei gespeichert, wie die Sperre `Bracket Type` auf der Registerkarte Einstellungen ausgeschaltet ist, und in einem neuen Diagramm sind alle Sperren eingeschaltet. Solange die Sperre eingeschaltet ist, schreibt eine Änderung das SQL auf Ihrem Bildschirm neu, aber die Datei behält den gesperrten Wert, und das Diagramm wird mit ihm wieder geöffnet – siehe [Sperren](./settings.md#lock).

Solange die Datenbank Oracle ist und das SQL einen Namen mit mehr als 30 Byte enthält, den Oracle 12.1 und älter ablehnen, nennt ein Hinweis unter den beiden Listen jeden solchen Namen: `Oracle 12.2+ for names over 30 bytes: <names>`. Er prüft Tabellen-, Spalten-, Schema-, Schlüssel-, Index-, Sequenz- und Triggernamen. Das SQL selbst ändert sich nicht.

## Anweisungen {#statements}

`Statements` legt fest, wie die Tabellen erstellt werden:

- `Create` schreibt einfache Anweisungen mit `CREATE`.
- `If not exists` überspringt die Tabellen und Indizes, die bereits existieren. MySQL, MariaDB, PostgreSQL, SQLite und Databricks haben diese Option; MSSQL, Oracle und Snowflake schreiben stattdessen `Create`.
  - MySQL schreibt jede Tabelle als `CREATE TABLE IF NOT EXISTS` mit ihren Unique-Constraints, Indizes und Fremdschlüsseln darin und setzt den gesamten Block zwischen `SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;` und `SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;`.
  - MariaDB fügt `IF NOT EXISTS` jeder Anweisung hinzu: dem `CREATE TABLE`, jedem Constraint `UNIQUE` und `FOREIGN KEY` und jedem `CREATE INDEX`.
  - PostgreSQL schreibt `CREATE TABLE IF NOT EXISTS` und `CREATE INDEX IF NOT EXISTS` und löscht jeden Fremdschlüssel mit `DROP CONSTRAINT IF EXISTS`, bevor es ihn erneut hinzufügt.
  - SQLite schreibt `CREATE TABLE IF NOT EXISTS` und `CREATE INDEX IF NOT EXISTS`.
  - Databricks schreibt `CREATE TABLE IF NOT EXISTS` und löscht jeden Fremdschlüssel mit `DROP CONSTRAINT IF EXISTS`, bevor es ihn erneut hinzufügt.
- `Drop & re-create` löscht jede Tabelle, die es schreibt, bevor es sie erneut erstellt, außer bei Snowflake. Jede Datenbank hat diese Option:
  - MySQL und MariaDB schreiben für jede Tabelle ein `DROP TABLE IF EXISTS`, zwischen denselben beiden Zeilen, die die Fremdschlüsselprüfungen aus- und wieder einschalten.
  - PostgreSQL schreibt ein einziges `DROP TABLE IF EXISTS`, das alle Tabellen nennt und fehlschlägt, wenn eine Tabelle außerhalb der Liste auf eine von ihnen verweist. Unter einem Vorspann `CREATE + USE` wird eine Tabelle, deren Name kein Schema angibt, aus diesem Schema gelöscht, etwa `shop.member`.
  - MSSQL schreibt eine einzige Transaktion, die SQL Server 2016 oder neuer erfordert, wie der Tooltip `SQL Server 2016+` der Schaltfläche angibt. Sie löscht die Fremdschlüssel, die die geschriebenen Tabellen enthalten, dann die Tabellen mit einem einzigen `DROP TABLE IF EXISTS` und führt bei einem Fehler ein Rollback aus. Ein Fremdschlüssel einer Tabelle außerhalb der Liste blockiert das Löschen weiterhin.
  - SQLite schreibt `PRAGMA foreign_keys=OFF;`, das die Fremdschlüsselprüfung für diese Verbindung ausgeschaltet lässt, dann für jede Tabelle ein `DROP TABLE IF EXISTS`.
  - Oracle schreibt für jede Tabelle `DROP TABLE … CASCADE CONSTRAINTS` und für jede Autoinkrement-Sequenz `DROP SEQUENCE`, jeweils in einem PL/SQL-Block, der mit einer Zeile `/` endet und den Fehler übergeht, den eine fehlende Tabelle oder Sequenz auslöst.
  - Databricks schreibt für jede Tabelle ein `DROP TABLE IF EXISTS`.
  - Snowflake löscht nichts und schreibt stattdessen `CREATE OR REPLACE TABLE`.

Solange `Drop & re-create` wirksam ist, nennt eine Warnung im Bereich die Tabellen, die es löscht: `Drops <tables> before creating them. Their rows are lost.` oder bei Snowflake `Replaces <tables>. Their rows are lost.`  
Bis zu fünf Tabellen werden vollständig genannt. Bei mehr als fünf nennt die Warnung die ersten vier und zählt den Rest, etwa `a, b, c, d, and 3 more tables`.

## Vorspann {#header}

`Header` stellt dem SQL die Anweisungen voran, die die Datenbank oder das Schema erstellen oder auswählen, in dem es ausgeführt wird. Der Name ist der Datenbankname des Diagramms, eingegeben im Feld `database name` der Symbolleiste, und wird mit dem Begrenzerzeichen aus `Bracket` umschlossen.

- MySQL und MariaDB: `USE` schreibt `USE shop;`, und `CREATE + USE` schreibt davor `CREATE DATABASE IF NOT EXISTS shop;`.
- MSSQL: `USE` schreibt `USE shop` und `GO`, und `CREATE + USE` schreibt davor `IF DB_ID(N'shop') IS NULL CREATE DATABASE shop` und `GO`.
- PostgreSQL hat nur `CREATE + USE`, das `CREATE SCHEMA IF NOT EXISTS shop;` und `SET search_path TO shop, public;` schreibt.
- Oracle hat nur `USE`, das `ALTER SESSION SET CURRENT_SCHEMA = shop;` schreibt. `CREATE + USE` fällt darauf zurück, daher ist dies die Zeile, die Oracle beim Standardvorspann der Registerkarte schreibt.
- Snowflake und Databricks: `USE` schreibt `USE SCHEMA shop;`, und `CREATE + USE` schreibt davor `CREATE SCHEMA IF NOT EXISTS shop;`.
- SQLite hat keines von beiden und schreibt keinen Vorspann.

Wo die Datenbank `USE` oder `CREATE + USE` hat, nennt der Tooltip der Schaltfläche, was sie dort schreibt, etwa `CREATE SCHEMA + SET search_path` bei PostgreSQL.

Ein Vorspann wird nur geschrieben, solange der Datenbankname ein einfacher Bezeichner ist: ein ASCII-Buchstabe (`A`–`Z`, `a`–`z`) oder `_`, gefolgt von ASCII-Buchstaben, Ziffern oder `_`.  
Bei jedem anderen Namen, auch einem leeren, wird kein Vorspann geschrieben, und das `DROP TABLE` von PostgreSQL nennt dann kein Schema. Solange ein anderer Vorspann als `None` wirksam ist, weist ein Hinweis unter `Header` darauf hin: `Database name "<name>" is not a valid identifier.`  
Der Datenbankname eines neuen Diagramms ist leer, daher zeigt der Bereich, bis Sie die Datenbank benennen, `Database name "" is not a valid identifier.`

## Logische Namen als Kommentare {#logical-names-as-comments}

Der Schalter `Write logical names into empty comments` unter `This window only` schreibt bei jeder Datenbank den [logischen Namen](./logical-names.md) einer Tabelle oder Spalte in die DDL, wo ihr Kommentar leer ist.

![Im Bereich Schema SQL die Option Write logical names into empty comments einschalten, wodurch der logische Name jeder Spalte von order_items in ihr leeres COMMENT geschrieben wird, während die Kommentare von members erhalten bleiben](/img/demo-schema-sql-logical-names.webp)

- Ein Kommentar mit Text hat immer Vorrang: Der logische Name ersetzt ihn nie und wird ihm nie hinzugefügt.
- Ein Kommentar, der nur aus Leerraum besteht, gilt als leer, sodass an seiner Stelle der logische Name geschrieben wird. Ein logischer Name, der leer ist oder nur aus Leerraum besteht, schreibt nichts, und diese Tabelle oder Spalte erhält weiterhin keinen Kommentar.
- Der logische Name wird dort und in der Form geschrieben, in der die Datenbank einen Kommentar schreibt, und seine Anführungszeichen werden auf dieselbe Weise maskiert – siehe [Kommentare](#comments).

Bei MySQL wird zum Beispiel eine Spalte `id` mit dem logischen Namen `Member ID` und ohne Kommentar mit `COMMENT 'Member ID'` geschrieben, während eine Spalte `email` mit dem logischen Namen `Email` und dem Kommentar `Sign-in address` ihr `COMMENT 'Sign-in address'` behält.

Wie `Statements` und `Header` gehört der Schalter zum Fenster und ist anfangs ausgeschaltet – siehe [Optionsbereich](#options-panel).  
Ein Import liest einen solchen Kommentar nie als logischen Namen zurück – siehe [Kommentare](./file-import-export.md#comments).

## Tabellen {#tables}

Solange das Diagramm mindestens eine [Tabellengruppe](./table-groups.md) hat, ob eingeblendet oder ausgeblendet, erscheint `Tables` unter `This window only` mit einem Kontrollkästchen für jede Option:

- `All`, das alle Kästchen aktiviert oder deaktiviert. Es zeigt einen gemischten Zustand, solange nur einige aktiviert sind.
- Ein Kästchen pro Tabellengruppe, in der Gruppenreihenfolge des Diagramms, beschriftet mit dem Namen der Gruppe oder mit `unnamed` bei einer Gruppe ohne Namen, nach einem Punkt in der Farbe der Gruppe, wenn sie eine Farbe hat.
- `No group` für die Tabellen, die in keiner Gruppe sind.

Sind alle Kästchen aktiviert, schreibt die Registerkarte das gesamte Diagramm.  
Sind nur einige aktiviert, schreibt sie die Tabellen der aktivierten Kästchen mit ihren Indizes und den Fremdschlüsseln, die sie enthalten, einschließlich eines Fremdschlüssels, der auf eine ausgelassene Tabelle verweist. Die Skripte vor und nach den Tabellen werden weiterhin geschrieben, und `Drop & re-create`, seine Warnung und der Oracle-Hinweis zu langen Namen betreffen nur diese Tabellen.  
Ist kein Kästchen aktiviert, schreibt die Registerkarte nichts, und ein Hinweis über dem Code lautet `No tables chosen. Check some under Tables.` `Save file` speichert dann eine leere Datei, und `Copy` kopiert leeren Text.

Wie bei `Statements` und `Header` gehört die Auswahl zum Fenster – siehe [Optionsbereich](#options-panel).  
Eine später hinzugefügte Gruppe ist nur dann von Anfang an aktiviert, wenn in diesem Moment alle Kästchen aktiviert waren. Wird eine Gruppe entfernt, entfällt ihr Kästchen, und wird die letzte Gruppe entfernt, ist wieder alles aktiviert.  
Die Auswahl gilt nur für diese Registerkarte. Die Registerkarte `Schema SQL` der Tabelleneigenschaften und `getSchemaSQL()` sind davon nicht betroffen.

## Skripte vor und nach den Tabellen {#before-and-after-scripts}

`Before tables` und `After tables` enthalten Ihr eigenes SQL, etwa Anweisungen `CREATE EXTENSION` oder `SET` vor den Tabellen oder Berechtigungen, Views und Startdaten nach ihnen.  
Sie werden im Dokument gespeichert, ein Paar für das gesamte Diagramm, unabhängig von der Datenbank. Jedes wird ungeprüft so in das SQL geschrieben, wie Sie es eingegeben haben: das Skript vor den Tabellen nach dem Vorspann und vor den Anweisungen `DROP` und den Tabellen, das Skript nach den Tabellen ganz am Ende.

Zeilenumbrüche werden als LF geschrieben, und Leerzeilen vor einem Skript sowie Leerraum nach ihm werden entfernt.  
Bei MSSQL wird nach einem Skript, dessen letzte Zeile nicht `GO` (oder `GO` mit einer Anzahl) ist, eine Zeile `GO` angefügt, wie die Zeile unter den beiden Feldern angibt. Bei Oracle beenden Sie einen PL/SQL-Block selbst mit seiner Zeile `/`.

Die Felder bieten Syntaxhervorhebung für SQL und wachsen mit ihrem Text.  
Eine Änderung wird übernommen, wenn Sie das Feld verlassen, indem Sie woanders klicken oder die Registerkarte wechseln, und erst dann ändern sich das SQL daneben und das Dokument. Ein Feld, in das Sie nur geklickt haben, ändert nichts.  
Eine Skriptänderung ändert das Diagramm wie jede andere Änderung: Sie wird in der Datei gespeichert, Mitbearbeiter sehen sie, und jede übernommene Änderung ist ein Schritt im [Verlauf](./undo-redo.md), den Sie auf der Registerkarte ERD rückgängig machen.  
Während Sie in einem Feld tippen, überlässt der Editor dem Feld seine eigenen Tastenkombinationen, sodass `Ctrl + Z` (Windows/Linux) oder `⌘ + Z` (Mac) Ihre Eingabe dort rückgängig macht und Kopieren, Ausschneiden und Einfügen auf den Text statt auf das Diagramm wirken.  
Die Schnellsuche und die [Suche des Explorers](./find-and-replace.md) öffnen sich weiterhin über ihre Tastenkombinationen, `Ctrl + K` und `Ctrl + F` (Windows/Linux) oder `⌘ + K` und `⌘ + F` (Mac). Da `Ctrl + F` oder `⌘ + F` zur Registerkarte ERD wechselt, wird Ihre Änderung dabei übernommen, wie bei jedem Wechsel der Registerkarte.  
Ein Feld ohne Tastaturfokus folgt einer Änderung, die ein Mitbearbeiter oder ein [Coding-Agent](../../mcp/tools.md#settings) an seinem Skript vornimmt. Ein Feld, in dem Sie sich befinden, zeigt diese Änderung, wenn Sie es verlassen, ohne getippt zu haben. Haben Sie getippt, wird Ihr Text beim Verlassen übernommen und ersetzt deren Text.

## SQL speichern oder kopieren {#saving-or-copying-the-sql}

`Save file` am unteren Rand des Bereichs oder im Kontextmenü speichert genau das SQL, das die Registerkarte zeigt, mit der aktuellen Datenbank, dem Begrenzer, den Anweisungen, dem Vorspann, den Kommentaren mit logischen Namen, den Tabellen und den Skripten, als `<database name>-<timestamp>.sql`. Die Datei wird wie jeder andere Export benannt und gespeichert – siehe [Exportieren](./file-import-export.md#exporting).

`Export` ▸ `Schema SQL` im Kontextmenü der Zeichenfläche oder in der Schnellsuche speichert von sich aus nichts.  
Es wechselt zu dieser Registerkarte, öffnet den Optionsbereich, auch wenn er eingeklappt war, und setzt den Tastaturfokus auf `Save file`, sodass Sie die Datei mit `Enter` speichern.

`Copy` am unteren Rand des Bereichs oder die Kopierschaltfläche, die oben rechts am Code erscheint, während Sie mit dem Zeiger darauf zeigen, kopiert das SQL.  
Eine Meldung `Copied!` mit einem Häkchen bestätigt dies zwei Sekunden lang. Verweigert der Browser oder Host den Zugriff auf die Zwischenablage, weist stattdessen fünf Sekunden lang eine Meldung `Couldn't copy to the clipboard` mit einem Warnsymbol darauf hin. Erneutes Kopieren ersetzt die Meldung, statt eine weitere hinzuzufügen.  
Das SQL lässt sich auch auswählen, sodass Sie nur einen Teil davon übernehmen können.

## Was die DDL schreibt {#what-the-ddl-writes}

Diese Regeln gelten überall, wo der Editor Schema SQL schreibt: auf dieser Registerkarte und in ihrer Datei sowie in dem SQL, das eine Seite mit eingebettetem Editor oder ein Coding-Agent liest.  
Die Registerkarte `Schema SQL` der Tabelleneigenschaften folgt ihnen für die eine Tabelle, die sie zeigt. Sie schreibt für Oracle weder Sequenz noch Trigger und keine Fremdschlüssel außer denen von SQLite, die innerhalb ihres `CREATE TABLE` stehen. Auch die Kommentaranweisungen, die PostgreSQL, Oracle und MSSQL nach einer Tabelle setzen, schreibt sie nicht, sodass sie bei diesen dreien keine Kommentare zeigt.

Die Teile folgen in dieser Reihenfolge, jeweils durch eine Leerzeile getrennt: der Vorspann, das Skript vor den Tabellen, die Anweisungen `DROP`, die Tabellen und das Skript nach den Tabellen. Tabellen werden nach Namen sortiert geschrieben.  
Ein Diagramm ohne Tabellen und ohne Skripte schreibt nichts, auch wenn ein Vorspann gewählt ist.

Tabellen und Spalten werden mit ihren physischen Namen geschrieben, unabhängig davon, was die [Namensansicht](./logical-names.md#name-view) zeigt. Eine mit einer Domäne verknüpfte Spalte wird mit ihrem eigenen Datentyp geschrieben, den die Domäne festlegt – siehe [Domänen und Datentypen](./dictionary.md#domains-and-data-types).

### Autoinkrement {#auto-increment}

Eine mit `Auto Increment` gekennzeichnete Spalte wird in der Form geschrieben, die die jeweilige Datenbank verwendet: `AUTO_INCREMENT` bei MySQL und MariaDB, `IDENTITY(1,1)` bei MSSQL, `AUTOINCREMENT` bei Snowflake und `GENERATED ALWAYS AS IDENTITY` bei PostgreSQL und Databricks.  
Oracle erhält eine Sequenz `SEQ_<table>` und einen Trigger `SEQ_TRG_<table>`, der die Spalte aus ihr befüllt. Der Trigger endet mit einer Zeile `/`, sodass SQL\*Plus und SQLcl ihn ausführen.

Wo eine Datenbank Autoinkrement für den Typ der Spalte nicht zulässt, entfällt die Klausel, und eine Kommentarzeile nach der Tabelle nennt die Spalte:

- PostgreSQL lässt es nur bei `smallint`, `integer` oder `bigint` zu, unter jedem ihrer Namen: `INT`, `INTEGER`, `BIGINT`, `SMALLINT`, `INT2`, `INT4` oder `INT8`. Eine Spalte eines anderen Typs erhält weder die Klausel noch einen Standardwert, und der Kommentar lautet zum Beispiel `-- PostgreSQL takes IDENTITY only on smallint, integer or bigint, so member.id is written without it.`
- Databricks lässt es nur bei `BIGINT` oder `LONG` zu.
- SQLite lässt `AUTOINCREMENT` nur bei der einzigen Primärschlüsselspalte einer Tabelle zu, wenn sie einen Ganzzahltyp hat, etwa `INT`, `BIGINT` oder `INT8`, mit oder ohne Breite. Diese Spalte wird als `INTEGER` geschrieben und der Schlüssel als `PRIMARY KEY (id AUTOINCREMENT)`. Ein einzelner Schlüssel eines anderen Typs wird ohne diese Angabe geschrieben.

### Referenzielle Aktionen {#referential-actions}

Welche Aktionen für ON DELETE und ON UPDATE jede Datenbank schreibt, ist unter [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update) aufgeführt.  
Wo Snowflake eine Aktion auslässt, nennt sie ein Kommentar über dem `ALTER TABLE` dieses Fremdschlüssels, etwa `-- Snowflake creates no foreign key with a referential action other than NO ACTION, so ON DELETE CASCADE is left out.`

### Schemaqualifizierte Tabellennamen {#schema-qualified-table-names}

Steht `Bracket` auf `None`, wird ein Tabellenname mit einem Punkt, etwa `sales.users`, als Schema und Tabelle gelesen, getrennt am letzten Punkt außerhalb von eckigen Klammern oder doppelten Anführungszeichen.

- MySQL, MariaDB, MSSQL, Oracle und PostgreSQL bilden die automatischen Namen, die sie schreiben, nur aus dem Tabellenteil: `FK_users_TO_orders` und `IDX_users` bei allen fünf, `UQ_users_email` bei allen außer PostgreSQL und `PK_users` bei MSSQL und Oracle, den beiden unter ihnen, die den Primärschlüssel benennen. Bei diesen beiden ergeben auch `[sales].[users]` und `"sales"."users"` den Namen `PK_users`, und `[Order]` ergibt `PK_Order`.
- SQLite benennt keine Constraints, daher ist der einzige automatische Name, den es bildet, der des Index: `CREATE INDEX sales.IDX_users ON users`.
- Oracle erstellt die Indizes der Tabelle sowie Sequenz und Trigger einer Autoinkrement-Spalte im Schema der Tabelle: `sales.IDX_users`, `sales.SEQ_users` und `sales.SEQ_TRG_users`.
- Bei Oracle und SQLite behält ein Indexname, dem Sie selbst ein Schema vorangestellt haben, dieses Schema.
- Ein automatischer Fremdschlüssel- oder Indexname, der ohne Beachtung der Groß-/Kleinschreibung einen früheren wiederholt, erhält eine Nummer. Werden `sales.users` und `hr.Users` beide von `orders` referenziert, heißt der zweite Schlüssel `FK_Users_TO_orders1`.

Bei jedem anderen Wert von `Bracket` ist der gesamte Tabellenname ein einziger Bezeichner, etwa `"PK_sales.users"`. Snowflake und Databricks behalten immer den gesamten Namen.  
Die Zeilen `Keys` der Registerkarte [Indizes](./table-related-functions.md#indexes) zeigen dieselben Namen.

### Standardwerte {#defaults}

Der Standardwert einer Spalte wird so geschrieben, wie Sie ihn eingegeben haben, aber in Klammern, wo die Datenbank diesen Ausdruck nur in Klammern liest. Ein Standardwert, der bereits in Klammern steht, bleibt unverändert.

- MySQL klammert alles außer einem Literal oder der aktuellen Zeit ein, etwa `(uuid())`. Außerdem klammert es jeden Standardwert außer `NULL` bei einer Spalte vom Typ `BLOB`, `TEXT`, `JSON`, einem räumlichen Typ oder `LONG…` ein sowie die aktuelle Zeit bei jeder Spalte außer einer vom Typ `TIMESTAMP` oder `DATETIME`.
- MariaDB klammert alles außer einem Literal, der aktuellen Zeit, einem Funktionsaufruf oder einem Namen ein.
- SQLite klammert alles außer einem Literal oder einem Namen ein, etwa `(datetime('now'))`.
- PostgreSQL klammert nur einen Ausdruck ein, der außerhalb von Klammern ein Wort wie `AT TIME ZONE`, `AND`, `OR`, `IS`, `IN`, `LIKE`, `COLLATE` oder `= ANY` enthält, etwa `(now() AT TIME ZONE 'utc')`.
- MSSQL, Oracle, Snowflake und Databricks schreiben jeden Standardwert so, wie er eingegeben wurde.

### Kommentare {#comments}

Der Kommentar einer Tabelle oder Spalte, der nicht leer ist, oder der logische Name, den [`Write logical names into empty comments`](#logical-names-as-comments) an seiner Stelle schreibt, wird so geschrieben, wie die jeweilige Datenbank Kommentare schreibt:

- MySQL und MariaDB schreiben ihn inline: Eine Spalte endet mit `COMMENT 'Member ID'`, und die Tabelle schließt mit `) COMMENT 'Members';`, auch im Block für `If not exists` von MySQL.
- Snowflake schreibt den Kommentar einer Spalte inline, `COMMENT 'Member ID'`, und den der Tabelle in einer eigenen Zeile nach der schließenden Klammer, `COMMENT = 'Members';`.
- Databricks schreibt den Kommentar einer Spalte inline und den der Tabelle als `COMMENT 'Members';` nach `USING DELTA`.
- PostgreSQL schreibt `COMMENT ON TABLE member IS 'Members';` und `COMMENT ON COLUMN member.id IS 'Member ID';` direkt nach dem `CREATE TABLE` der Tabelle. Oracle schreibt dieselben Anweisungen nach der Tabelle, ihren Unique-Constraints sowie ihrer Autoinkrement-Sequenz und ihrem Trigger.
- MSSQL schreibt einen Aufruf pro Tabelle und pro Spalte, nach der Tabelle und ihren Unique-Constraints, jeweils gefolgt von `GO`: `EXECUTE sys.sp_addextendedproperty 'MS_Description', N'Members', 'schema', 'dbo', 'table', 'member'`, bei einer Spalte ergänzt um `'column', 'id'`.  
  Der Text ist ein National-Literal, `N'…'`, sodass SQL Server Text außerhalb der Codepage der Datenbank, etwa Koreanisch, beibehält, statt Fragezeichen zu speichern.  
  Steht `Bracket` auf `None`, ergibt eine Tabelle namens `sales.users` das Schema `sales` und die Tabelle `users`, ebenso `[sales].[users]` und `"sales"."users"`, deren eckige Klammern und doppelte Anführungszeichen entfallen. Ein Name ohne Schema liegt in `dbo`. Ein Teil vor dem Schema, wie in `shop.sales.users`, führt die Prozedur dieser Datenbank aus, `shop.sys.sp_addextendedproperty`. Bei jedem anderen Wert von `Bracket` ist der gesamte Name die Tabelle, in `dbo`.
- SQLite speichert keine Kommentare, daher schreibt es jeden als Zeile mit `--` über das, was er beschreibt: `-- Members` über `CREATE TABLE member` und `-- Member ID` über die Spalte.

Ein Anführungszeichen in einem in Anführungszeichen gesetzten Kommentar wird verdoppelt, wie in `'it''s'` und `N'it''s'`, ebenso eines in den Namen, die die Aufrufe von MSSQL übergeben. Databricks maskiert ein Anführungszeichen und einen Backslash stattdessen mit einem Backslash, wie in `'it\'s'`, der Form, die jede Version von Spark liest. Die Zeilen mit `--` von SQLite stehen nicht in Anführungszeichen, daher behalten sie ein Anführungszeichen so, wie es eingegeben wurde: `-- it's`.  
Ansonsten wird der Text so geschrieben, wie er eingegeben wurde, einschließlich der Zeilenumbrüche, außer bei zwei Datenbanken:

- Oracle lässt Leerzeilen weg, wobei eine Zeile nur aus Leerzeichen oder Tabulatoren als leer gilt, weil SQL\*Plus eine Anweisung an einer Leerzeile beendet und den Rest überspringt. Ein Tabellenkommentar aus `Members`, einer Leerzeile und `Active only` wird als `COMMENT ON TABLE member IS 'Members` mit `Active only';` in der nächsten Zeile geschrieben.
- SQLite schreibt jede Folge von Zeilenumbrüchen als ein einziges Leerzeichen, weil ein Zeilenumbruch die Zeile mit `--` beenden und den Rest als SQL ausführen würde. Derselbe Kommentar wird als `-- Members Active only` geschrieben.

Wie diese Kommentare beim Import zurückgelesen werden, wird in [Kommentare](./file-import-export.md#comments) beschrieben.

## Schreibgeschützte Editoren {#read-only-editors}

In einem Editor mit `readonly` funktioniert die Registerkarte wie gewohnt: `Database` und `Bracket` ändern weiterhin das angezeigte SQL, `Statements`, `Header`, `Write logical names into empty comments` und `Tables` funktionieren weiterhin, und `Save file` und `Copy` speichern und kopieren es weiterhin.  
Nur die beiden Skriptfelder sind schreibgeschützt.
