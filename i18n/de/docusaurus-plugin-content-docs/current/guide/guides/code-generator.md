---
sidebar_position: 13
description: Code für zweiundzwanzig Ziele aus dem Diagramm generieren, im Optionsbereich Sprache, Datenbank, Schreibweise und Begrenzer wählen, sehen, welche Ziele die Aktionen ON DELETE und ON UPDATE einer Beziehung schreiben, und das Ergebnis speichern oder kopieren.
---

# Codegenerator

Wechseln Sie in der Symbolleiste zur Registerkarte `Code Generator`. Die Registerkarte zeigt links den Code für das gesamte Dokument und rechts daneben einen Optionsbereich mit der Überschrift `Code Generator`, in dem Sie die Sprache, die Datenbank, die Schreibweisen und bei einigen Zielen den Begrenzer wählen.  
Der Bereich öffnet sich von selbst, sofern der Editor beim ersten Öffnen der Registerkarte nicht schmaler als 640 px ist. `Hide options` oben im Bereich klappt ihn ein, und `Show options` oben rechts am Code holt ihn zurück. Er bleibt über Wechsel der Registerkarte hinweg geöffnet oder eingeklappt, solange der Editor geöffnet ist, unabhängig vom Bereich der Registerkarte Schema SQL, und wird nie in der Datei gespeichert.

Klicken Sie mit der rechten Maustaste auf den Code, um sein Kontextmenü zu öffnen: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (nur für `Doctrine`, `JPA` und `SeaORM`), jeweils mit einem Untermenü, das den aktuellen Wert mit einem Häkchen markiert, dann `Options panel`, das den Bereich einklappt oder öffnet und mit einem Häkchen markiert ist, solange er angezeigt wird, sowie `Save file`.  
Solange diese Registerkarte geöffnet ist, bietet die [Schnellsuche](./quick-search.md) `Database`, `Bracket` (nur für `Doctrine`, `JPA` und `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` und `Code Generator: Options panel`, das den Bereich einklappt oder öffnet.

![Im Kontextmenü des Codes TypeScript und dann Rust wählen, im Optionsbereich die Spaltennamen auf Snake umstellen und den Code kopieren](/img/demo-code-generator.webp)

Dieselbe Codeansicht ist auch die Registerkarte `Code Generator` der [Tabelleneigenschaften](./table-related-functions.md#table-properties), wo sie Code für diese eine Tabelle statt für das gesamte Dokument generiert. Dort hat sie keinen Optionsbereich, und ihr Kontextmenü ändert dieselben Einstellungen, hat aber weder `Options panel` noch `Save file`.  
Wo der Code für das gesamte Dokument mit Importen oder einem Kopfteil beginnt, beginnt der Code der einzelnen Tabelle mit dem, was diese Tabelle davon benötigt, etwa `<?php` für `PHP`, `import Foundation` für `Swift` oder `$schema` für `JSON Schema`.

Der Code wird geschrieben, wenn sich die Registerkarte öffnet, und erneut, sobald sich die Sprache, die Datenbank, eine Schreibweise oder der Begrenzer ändert. Eine Änderung am Diagramm, die vorgenommen wird, während die Registerkarte geöffnet ist, etwa die eines Mitbearbeiters oder eines Coding-Agenten, erscheint, sobald Sie die Registerkarte verlassen und zurückkehren oder sobald sich eine dieser Einstellungen ändert.

## Optionsbereich {#options-panel}

Unter der Beschriftung `Saved in the document` listet der Bereich `Language`, `Database`, `Table Name Case` und `Column Name Case` auf, gefolgt von `Bracket`, solange `Doctrine`, `JPA` oder `SeaORM` die Sprache ist. Jede dieser Einstellungen ist eine Dropdown-Liste, und eine Änderung schreibt den Code sofort neu.  
Wenn die ausgewählte Sprache `Database` oder die Schreibweisen ignoriert, bleiben diese abgeblendet im Bereich, mit einem Hinweis wie `Not used by DBML` darunter, und lassen sich weiterhin ändern.  
`Save file` und `Copy` befinden sich am unteren Rand des Bereichs – siehe [Ergebnis speichern oder kopieren](#saving-or-copying-the-result).

Dies sind die eigenen Einstellungen des Diagramms, dieselben, die auch das Kontextmenü und die Schnellsuche ändern. `Database` wird wie jede Änderung in der Datei gespeichert.  
`Language`, `Table Name Case`, `Column Name Case` und `Bracket` werden nur so lange gespeichert, wie ihre Sperre auf der Registerkarte Einstellungen ausgeschaltet ist (`Bracket Type` für `Bracket`), und in einem neuen Diagramm sind alle Sperren eingeschaltet. Solange eine Sperre eingeschaltet ist, schreibt eine Änderung den Code auf Ihrem Bildschirm neu, aber die Datei behält den gesperrten Wert, und das Diagramm wird mit ihm wieder geöffnet. Der Bereich zeigt keine Sperre an; um eine Auswahl in der Datei zu behalten, schalten Sie ihre Sperre aus – siehe [Sperren](./settings.md#lock).  
In einem schreibgeschützten Editor lautet die Beschriftung stattdessen `This window only`, da eine Änderung dort nur dieses Fenster erreicht – siehe [Schreibgeschützte Editoren](#read-only-editors).

## Sprache {#language}

Unterstützt werden zweiundzwanzig Ziele, aufgeführt in drei Gruppen – Sprachen, ORMs, dann Schemas –, jede in alphabetischer Reihenfolge. Die Liste des Bereichs und das Kontextmenü ziehen eine Linie zwischen den Gruppen, benennen aber keine davon:

| Ziel | Gruppe | Beziehungen | Indizes | ON DELETE / ON UPDATE | Gespeichert als |
| --- | --- | --- | --- | --- | --- |
| `C#` | Sprache | — | — | — | `.cs` |
| `Go` | Sprache | — | — | — | `.go` |
| `Java` | Sprache | — | — | — | `.java` |
| `Kotlin` | Sprache | — | — | — | `.kt` |
| `PHP` | Sprache | — | — | — | `.php` |
| `Rust` | Sprache | — | — | — | `.rs` |
| `Scala` | Sprache | — | — | — | `.scala` |
| `Swift` | Sprache | — | — | — | `.swift` |
| `TypeScript` | Sprache | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | nur ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | nur eindeutige | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

Der Standardwert ist `GraphQL`. Jedes Ziel gibt Spalten aus; die Häkchen ✓ zeigen, was es außerdem ausgibt.  
Tabellen werden nach Namen sortiert ausgegeben statt in der Reihenfolge, in der sie auf der Zeichenfläche liegen, und als Indizes gelten die unter `Indexes` in den [Tabelleneigenschaften](./table-related-functions.md#indexes) aufgeführten, nicht die darüberliegenden Zeilen unter `Keys`. `SeaORM` schreibt nur die eindeutigen, und `Mermaid` markiert eine eindeutige Spalte mit `UK`, schreibt aber keinen Index.  
Jedes Ziel außer `Java`, `AML`, `DBML` und `Mermaid` schreibt eine Primärschlüsselspalte als NOT NULL, unabhängig davon, ob `Not Null` für sie gesetzt ist. `Java` kennzeichnet keine Spalte als NULL-fähig oder nicht, und `AML`, `DBML` und `Mermaid` übernehmen das Kennzeichen so, wie es im Diagramm gesetzt ist.

Was einige der Ziele schreiben:

- `PHP`: einfache Klassen aus typisierten öffentlichen Eigenschaften, beginnend mit `<?php` und `declare(strict_types=1);`.
- `Doctrine`: Entitäten für Doctrine ORM 3 mit Attributen, für DBAL 4.2 oder neuer, jede Spalte mit ihrem DBAL-Typ und ihren Optionen für die ausgewählte Datenbank.
- `Rust`: pro Tabelle ein `pub struct`, dessen Typen mit vollständigem Pfad geschrieben sind, etwa `chrono::NaiveDateTime` oder `rust_decimal::Decimal`, ohne eine Zeile mit `use`.
- `SeaORM`: Entitäten für SeaORM 2.0 im Dense-Format, jede Tabelle ein `pub mod`, sodass sich der gesamte Text als eine einzige Datei kompilieren lässt.
- `Swift`: pro Tabelle ein Struct, das `Codable`, `Hashable` und `Sendable` ist und Swift 6.1 oder neuer erfordert.
- `TypeScript`: pro Tabelle ein `export interface`, das die Zeile als JSON beschreibt, wie es das Schema von `Zod` tut – ein Datum oder eine Uhrzeit ist ein `string`, und eine NULL-fähige Spalte ist `T | null`.
- `Zod`: pro Tabelle ein Zeilenschema für Zod 4 und der Typ, den es ableitet, ohne Insert-Schema und ohne Beziehungen.
- `JSON Schema`: ein einziges Dokument nach JSON Schema Draft 2020-12, mit einem Zeilenschema pro Tabelle unter `$defs`.
- `Mermaid`: ein `erDiagram`, wie GitHub es darstellt, jede Tabelle eine Entität, die jede Spalte mit ihrem Typ und einer etwaigen Markierung `PK`, `FK` oder `UK` auflistet, und jede Beziehung eine Linie zwischen ihren beiden Tabellen.

`AML`, `DBML` und `GraphQL` sind Round-Trip-Formate: Jedes ist auch eine Importquelle. Siehe [Dateien importieren oder exportieren](./file-import-export.md). Die übrigen Schemas, `JSON Schema`, `Mermaid` und `Zod`, dienen nur der Ausgabe.  
`DBML` schreibt die Farbe jeder Tabelle als `headercolor` und im Code für das gesamte Dokument nach den Definitionen `Ref` einen Block `TableGroup` für jede [Tabellengruppe](./table-groups.md), die eine Tabelle enthält. `AML` schreibt die Farbe einer Tabelle als den nächstliegenden der Farbnamen von AML.

## ON DELETE und ON UPDATE {#on-delete-and-on-update}

Die Aktionen ON DELETE und ON UPDATE einer Beziehung werden in ihrem Kontextmenü festgelegt – siehe [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Die Ziele mit einem ✓ in der Spalte `ON DELETE / ON UPDATE` der Tabelle unter [Sprache](#language) schreiben die Aktionen, die eine Beziehung festlegt; für eine Aktion, die auf `Not set` belassen ist, wird nichts geschrieben.  
Welche Aktionen die ORM-Ziele behalten, hängt von der ausgewählten Datenbank ab, während `AML` und `DBML` alle behalten – siehe [Datenbank](#database).

- `Doctrine` schreibt nur ON DELETE, da Doctrine kein ON UPDATE kennt. Es fügt jedem `#[ORM\JoinColumn]` des `ManyToOne` oder `OneToOne` der besitzenden Seite `onDelete: 'CASCADE'` hinzu, etwa `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, und dem `OneToMany` oder `OneToOne` der inversen Seite nichts. Eine Beziehung zu einer eindeutigen Spalte, die nicht der Primärschlüssel ist, bleibt als einfache Spalten bestehen, die Doctrine ohne Assoziation abbildet, sodass es keine Aktion schreibt.
- `Drizzle` schreibt sie in Kleinbuchstaben. Bei `.references()` sind sie Optionen, etwa `{ onDelete: "cascade", onUpdate: "set null" }`; bei einem `foreignKey()`, das ein mehrspaltiger Schlüssel erhält, werden sie verkettet, etwa `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` schreibt sie an die Relation `belongs_to` der Kindtabelle, ON UPDATE zuerst, mit den SeaORM-Namen `NoAction`, `Cascade`, `SetNull`, `SetDefault` und `Restrict`, etwa `on_update = "Cascade", on_delete = "SetNull"`. Das `has_one` oder `has_many` der Elterntabelle erhält keine.
- `Sequelize` schreibt die Einträge `onDelete: "CASCADE"` und `onUpdate` in beide Assoziationsaufrufe: `hasMany` oder `hasOne` sowie `belongsTo`. Ein mehrspaltiger Schlüssel erhält keine Assoziationsaufrufe, daher schreibt `Sequelize` für ihn keine Aktionen.
- `SQLAlchemy` übergibt die Argumente `ondelete="CASCADE"` und `onupdate` bei einem einspaltigen Schlüssel an `ForeignKey()` und bei einem mehrspaltigen Schlüssel an `ForeignKeyConstraint()`.
- `TypeORM` schreibt die Optionen `onDelete: "CASCADE"` und `onUpdate` an das `@ManyToOne` oder `@OneToOne` der besitzenden Seite, nie an die inverse Seite. `SET DEFAULT` lässt es immer weg, weil TypeORM es als `DEFAULT` schreiben würde, was keine Datenbank akzeptiert.
- `DBML` fügt dem `Ref` Einstellungen hinzu, etwa `[delete: set null, update: no action]`.
- `AML` schreibt eine Beziehung, die eine Aktion hat, als eigenständige Anweisung `rel` mit Eigenschaften, etwa `{onDelete: cascade, onUpdate: "set null"}`, statt inline an ihre Spalte.

`JPA` schreibt keine: Reines JPA hat keine Option dafür, und der Codegenerator verwendet `@OnDelete` von Hibernate nicht. Auch `Mermaid` schreibt keine, da eine Linie in einem `erDiagram` keinen Platz dafür hat.  
Auf der Registerkarte `Code Generator` der Tabelleneigenschaften, die eine einzelne Tabelle zeigt, schreibt `DBML` kein `Ref` und `AML` keine Anweisung `rel`, sodass dort keines von beiden die Aktionen zeigt; `AML` belässt eine einspaltige Beziehung, die Aktionen hat, inline an ihrer Spalte, wie eine ohne Aktionen. `Mermaid` schreibt dort überhaupt keine Beziehungslinien. `Doctrine` und `SeaORM` schreiben dort dieselbe Entität wie im gesamten Dokument, einschließlich der Aktionen.

## Schreibweise der Namen {#name-case}

`Table Name Case` und `Column Name Case` unterstützen jeweils `Pascal`, `Camel`, `Snake` und `None`.  
Die Standardwerte sind `Pascal` für Tabellennamen und `Camel` für Spaltennamen. `None` gibt einen Namen so aus, wie er im Diagramm geschrieben ist.  
Bei jeder Schreibweise wird ein Name, den die Sprache des Ziels reserviert, maskiert, wo diese Sprache ihn maskieren kann, etwa `@class` in `C#` oder `r#type` in `Rust`, und umbenannt, wo sie es nicht kann, etwa `class_` in `Java`.

`AML`, `DBML` und `Mermaid` ignorieren beide Einstellungen und geben immer die Namen aus dem Diagramm aus.  
Auch `SeaORM` ignoriert sie: Es benennt Felder und Module in Snake Case, der Form, die SeaORM zurückliest, und gibt die gespeicherten Namen in `table_name` und, wo sie abweichen, in `column_name` an.  
Bei diesen vier Zielen blendet der Bereich beide Listen ab, mit dem Hinweis `Not used by` darunter.

Jedes Ziel schreibt die physischen Namen, unabhängig davon, was die [Namensansicht](./logical-names.md#name-view) zeigt.  
Keines schreibt einen logischen Namen, auch nicht in einen leeren Kommentar: Diese Registerkarte hat kein Gegenstück zur Option [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) der Registerkarte Schema SQL.  
Ebenso schreibt keines eine Domäne: Eine mit einer Domäne verknüpfte Spalte wird wie jede andere Spalte mit ihrem Datentyp geschrieben.

## Datenbank {#database}

Datentypen werden anhand der ausgewählten Datenbank aufgelöst – siehe [Datenbanken](./table-related-functions.md#databases).  
Wählen Sie sie auf dieser Registerkarte in der Liste `Database` des Bereichs, unter `Database` im Kontextmenü oder in der Schnellsuche, und der Code wird sofort neu geschrieben. Sie ist die einzige Datenbankeinstellung des Diagramms, dieselbe, die das Kontextmenü der Zeichenfläche und die Registerkarte [Schema SQL](./schema-sql.md) festlegen, sodass eine Änderung hier auch dort erscheint.  
`Drizzle` übernimmt seinen Dialekt aus derselben Einstellung: `pgTable` für PostgreSQL, `mysqlTable` für MySQL und MariaDB, `sqliteTable` für SQLite und `pgTable` für jede andere Datenbank.  
`SeaORM` schreibt ein `column_type`, wo SeaORM bei PostgreSQL, MySQL, MariaDB oder SQLite sonst einen anderen Spaltentyp erstellen würde, und keines bei MSSQL, Oracle, Snowflake oder Databricks, für die SeaORM kein Backend hat.

Die ausgewählte Datenbank entscheidet auch, welche Aktionen für ON DELETE und ON UPDATE die ORM-Ziele schreiben.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` und `TypeORM` lassen jede Aktion weg, die das Schema SQL dieser Datenbank weglässt, etwa `SET DEFAULT` bei MySQL und MariaDB, `RESTRICT` bei MSSQL oder jede Aktion außer `NO ACTION` bei Snowflake und Databricks, sodass das Standardverhalten der Datenbank gilt. Die vollständige Liste steht unter [ON DELETE und ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` richtet sich stattdessen nach dem Dialekt, den es schreibt: Code mit `mysqlTable` lässt `SET DEFAULT` weg, während Code mit `pgTable` und `sqliteTable` jede Aktion behält, auch der Code mit `pgTable`, den es für MSSQL, Oracle, Snowflake und Databricks schreibt.

`AML`, `DBML` und `Mermaid` sind die Ausnahme: Sie geben jeden Datentyp so aus, wie er im Diagramm geschrieben ist, sodass die Datenbankeinstellung ihre Ausgabe nicht ändert, und der Bereich blendet `Database` für sie ab. `AML` und `DBML` schreiben jede Aktion, die eine Beziehung festlegt, und `Mermaid` schreibt keine.

## Begrenzer {#bracket}

`Bracket` wird im Bereich, im Kontextmenü und in der Schnellsuche nur angeboten, solange `Doctrine`, `JPA` oder `SeaORM` die Sprache ist.  
Dies ist dieselbe Einstellung wie der Begrenzer der Registerkarte Schema SQL – siehe [Schema SQL](./schema-sql.md#database-and-bracket) –, sodass eine Änderung hier auch ändert, wie Schema SQL Namen in Anführungszeichen setzt. Sie bietet `SingleQuote`, `DoubleQuote`, `Backtick` und `None` und steht anfangs auf `None`.

- `Doctrine`: Bei jedem Begrenzer außer `None` wird jeder Tabellen-, Spalten- und Join-Spaltenname in Backticks gesetzt, womit Doctrine einen Namen kennzeichnet, der in Anführungszeichen zu setzen ist, etwa ``#[ORM\Table(name: '`order`')]``. Bei `None` geschieht das nur mit einem Namen, der es erfordert: einem Wort, das eine Datenbank reserviert, einem Namen, der kein einfacher ASCII-Bezeichner ist, oder einem in Anführungszeichen eingegebenen Namen.
- `JPA`: Bei jedem Begrenzer außer `None` wird ein Tabellenname, der ein reserviertes Wort ist, innerhalb von `@Table` in Anführungszeichen gesetzt, etwa `@Table(name = "\"user\"")`. Bei `None` bleibt er ohne Anführungszeichen, so wie ihn auch Schema SQL lässt.
- `SeaORM`: Bei `None` werden Namen so geschrieben, wie die Datenbank sie speichert: Ein Tabellenname mit Punkt wird in `schema_name` und `table_name` aufgeteilt, und bei PostgreSQL wird ein Name ohne Anführungszeichen in Kleinbuchstaben umgewandelt. Bei jedem anderen Begrenzer bleibt ein Name ungeteilt und so, wie er geschrieben ist.

## Ergebnis speichern oder kopieren {#saving-or-copying-the-result}

`Save file` am unteren Rand des Optionsbereichs oder im Kontextmenü speichert den angezeigten Code als Datei.  
Die Datei wird wie jeder Export benannt, `<database name>-<timestamp>`, gefolgt von der Endung aus der Tabelle unter [Sprache](#language), etwa `shop-2026-10-12T04_05_06.ts`, und landet dort, wo in Ihrem Host jeder Export landet – siehe [Exportieren](./file-import-export.md#exporting). `Java` und `JPA` legen alle Klassen in eine einzige Datei `.java`, so wie die Registerkarte sie zeigt.  
Das Menü Export hat keinen Eintrag für den Codegenerator, und die Registerkarte `Code Generator` der Tabelleneigenschaften kann keine Datei speichern.

Um den Code zu kopieren, klicken Sie am unteren Rand des Bereichs auf `Copy` oder zeigen Sie mit dem Zeiger auf den Code und klicken Sie oben rechts auf die Schaltfläche zum Kopieren, was in den Tabelleneigenschaften der einzige Weg ist.  
Eine Meldung `Copied!` mit einem Häkchen bestätigt das Kopieren zwei Sekunden lang. Verweigert der Browser oder Host den Zugriff auf die Zwischenablage, weist stattdessen fünf Sekunden lang eine Meldung `Couldn't copy to the clipboard` mit einem Warnsymbol darauf hin. Erneutes Kopieren ersetzt die Meldung, statt eine weitere hinzuzufügen.  
Der Text lässt sich auch auswählen, sodass Sie nur den Teil übernehmen können, den Sie benötigen.

## Schreibgeschützte Editoren {#read-only-editors}

In einem [`readonly`](../../api/erd-editor-element.md#readonly)-Editor ändern die Listen des Bereichs, das Kontextmenü und die Schnellsuche weiterhin `Language`, `Database`, `Table Name Case`, `Column Name Case` und `Bracket`, aber nur in diesem Fenster; deshalb beschriftet der Bereich sie mit `This window only` statt mit `Saved in the document`.  
Eine Änderung schreibt den Code auf diesem Bildschirm neu und wird weder in der Datei gespeichert noch mit Mitbearbeitern geteilt noch für Rückgängig aufgezeichnet, was auch immer die Sperren sagen, und die Änderung eines Mitbearbeiters an einer Einstellung, die Sie gewählt haben, lässt Ihre Wahl auf dem Bildschirm stehen. `Database` und `Bracket` sind auch Einstellungen der Registerkarte Schema SQL, sodass eine Wahl hier dort im selben Fenster zu sehen ist – siehe [Schreibgeschützte Editoren](./schema-sql.md#read-only-editors).  
Sobald der Editor wieder beschreibbar wird, kommen die Einstellungen des Dokuments zurück, und der Code wird für sie geschrieben.  
`Save file` und `Copy` speichern und kopieren den angezeigten Code.
