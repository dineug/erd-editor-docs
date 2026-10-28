---
sidebar_position: 13
description: Genereer vanuit het diagram code voor tweeëntwintig doelen, kies in het optiepaneel de taal, de database, de naamnotatie en de aanhalingstekens, bekijk welke doelen de acties voor ON DELETE en ON UPDATE van een relatie schrijven en sla het resultaat op of kopieer het.
---

# Codegenerator

Schakel in de werkbalk over naar het tabblad `Code Generator`. Het tabblad toont links de code voor het hele document en rechts daarvan een optiepaneel met de titel `Code Generator`, waarin je de taal, de database, de naamnotaties en, voor sommige doelen, de aanhalingstekens kiest.  
Het paneel opent vanzelf, tenzij de editor smaller is dan 640 px wanneer het tabblad voor het eerst opent. `Hide options` bovenaan het paneel vouwt het samen, en `Show options` rechtsboven in de code haalt het terug. Het blijft bij het wisselen van tabblad open of samengevouwen zolang de editor open is, los van het paneel van het tabblad Schema SQL, en wordt nooit in het bestand opgeslagen.

Klik met de rechtermuisknop op de code om het contextmenu ervan te openen: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (alleen voor `Doctrine`, `JPA` en `SeaORM`), elk met een submenu waarin de huidige waarde is aangevinkt, daarna `Options panel`, dat het paneel samenvouwt of opent en is aangevinkt zolang het zichtbaar is, en `Save file`.  
Zolang dit tabblad open is, biedt [Snel zoeken](./quick-search.md) `Database`, `Bracket` (alleen voor `Doctrine`, `JPA` en `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` en `Code Generator: Options panel`, dat het paneel samenvouwt of opent.

![TypeScript en daarna Rust kiezen in het contextmenu van de code, kolomnamen in het optiepaneel op Snake zetten en de code kopiëren](/img/demo-code-generator.webp)

Dezelfde codeweergave is ook het tabblad `Code Generator` van [Tabeleigenschappen](./table-related-functions.md#table-properties), waar die code genereert voor die ene tabel in plaats van voor het hele document. Daar is er geen optiepaneel, en het contextmenu wijzigt dezelfde instellingen, maar heeft geen `Options panel` of `Save file`.  
Waar de code voor het hele document begint met imports of een kop, begint de code van de ene tabel met wat die tabel daarvan nodig heeft, zoals `<?php` voor `PHP`, `import Foundation` voor `Swift` of `$schema` voor `JSON Schema`.

De code wordt geschreven wanneer het tabblad opent, en opnieuw telkens wanneer de taal, de database, een naamnotatie of de aanhalingstekens veranderen. Een bewerking van het diagram terwijl het tabblad open is, zoals die van een medebewerker of een codeeragent, wordt zichtbaar zodra je het tabblad verlaat en terugkomt, of zodra een van die instellingen verandert.

## Optiepaneel {#options-panel}

Onder het opschrift `Saved in the document` toont het paneel `Language`, `Database`, `Table Name Case` en `Column Name Case`, gevolgd door `Bracket` zolang de taal `Doctrine`, `JPA` of `SeaORM` is. Elk ervan is een vervolgkeuzelijst, en een wijziging herschrijft de code meteen.  
Als de geselecteerde taal `Database` of de naamnotaties negeert, blijven die gedimd in het paneel staan, met een notitie zoals `Not used by DBML` eronder, en kunnen ze nog steeds worden gewijzigd.  
`Save file` en `Copy` staan onder aan het paneel — zie [Het resultaat opslaan of kopiëren](#saving-or-copying-the-result).

Dit zijn de eigen instellingen van het diagram, dezelfde die het contextmenu en Snel zoeken ook wijzigen. `Database` wordt net als elke bewerking in het bestand opgeslagen.  
`Language`, `Table Name Case`, `Column Name Case` en `Bracket` worden alleen opgeslagen zolang hun vergrendeling op het tabblad Instellingen uitstaat (`Bracket Type` voor `Bracket`), en in een nieuw diagram staan alle vergrendelingen aan. Zolang een vergrendeling aanstaat, herschrijft een wijziging de code op je scherm, maar het bestand behoudt de vergrendelde waarde en het diagram opent daarmee opnieuw. Het paneel geeft een vergrendeling op geen enkele manier aan; zet de vergrendeling van een keuze uit om die keuze in het bestand te bewaren — zie [Vergrendeling](./settings.md#lock).  
In een editor in alleen-lezenmodus staat in plaats daarvan het opschrift `This window only`, omdat een wijziging daar alleen dat venster bereikt — zie [Editors in alleen-lezenmodus](#read-only-editors).

## Taal {#language}

Er worden tweeëntwintig doelen ondersteund, in drie groepen — talen, ORM's en daarna schema's — elk in alfabetische volgorde. De lijst in het paneel en het contextmenu scheiden de groepen met een lijn, maar noemen ze niet bij naam:

| Doel | Groep | Relaties | Indexen | ON DELETE / ON UPDATE | Opgeslagen als |
| --- | --- | --- | --- | --- | --- |
| `C#` | Taal | — | — | — | `.cs` |
| `Go` | Taal | — | — | — | `.go` |
| `Java` | Taal | — | — | — | `.java` |
| `Kotlin` | Taal | — | — | — | `.kt` |
| `PHP` | Taal | — | — | — | `.php` |
| `Rust` | Taal | — | — | — | `.rs` |
| `Scala` | Taal | — | — | — | `.scala` |
| `Swift` | Taal | — | — | — | `.swift` |
| `TypeScript` | Taal | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Alleen ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Alleen unieke | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

De standaardwaarde is `GraphQL`. Elk doel schrijft kolommen; de markeringen ✓ tonen wat het daarnaast schrijft.  
Tabellen worden in volgorde van naam geschreven in plaats van in de volgorde waarin ze op het canvas staan, en de indexen zijn de indexen die onder `Indexes` in [Tabeleigenschappen](./table-related-functions.md#indexes) staan, niet de rijen `Keys` erboven. `SeaORM` schrijft alleen de unieke indexen, en `Mermaid` markeert een unieke kolom met `UK`, maar schrijft geen index.  
Elk doel behalve `Java`, `AML`, `DBML` en `Mermaid` schrijft een kolom van de primaire sleutel als NOT NULL, of `Not Null` er nu op is ingesteld of niet. `Java` geeft bij geen enkele kolom aan of die null mag zijn, en `AML`, `DBML` en `Mermaid` behouden de vlag zoals die in het diagram staat.

Wat sommige doelen schrijven:

- `PHP`: gewone klassen met getypeerde publieke eigenschappen, die beginnen met `<?php` en `declare(strict_types=1);`.
- `Doctrine`: Doctrine ORM 3-entiteiten met attributen, voor DBAL 4.2 of later, met voor elke kolom het DBAL-type en de opties voor de geselecteerde database.
- `Rust`: een `pub struct` per tabel, met de typen als volledig pad geschreven, zoals `chrono::NaiveDateTime` of `rust_decimal::Decimal`, zonder regel `use`.
- `SeaORM`: SeaORM 2.0-entiteiten in het dense-formaat, met elke tabel als `pub mod`, zodat de hele tekst als één bestand compileert.
- `Swift`: een `Codable`, `Hashable`, `Sendable` struct per tabel, waarvoor Swift 6.1 of later nodig is.
- `TypeScript`: een `export interface` per tabel die de rij als JSON beschrijft, net als het schema van `Zod` — een datum of een tijd is een `string`, en een kolom die null mag zijn, is `T | null`.
- `Zod`: een Zod 4-rijschema per tabel en het type dat het daaruit afleidt, zonder insert-schema en zonder relaties.
- `JSON Schema`: één document in JSON Schema draft 2020-12, met een rijschema per tabel onder `$defs`.
- `Mermaid`: een `erDiagram`, het soort dat GitHub weergeeft, met elke tabel als entiteit die elke kolom noemt met het type en een eventuele markering `PK`, `FK` of `UK`, en elke relatie als lijn tussen haar twee tabellen.

`AML`, `DBML` en `GraphQL` werken in twee richtingen: elk ervan is ook een importbron. Zie [Bestanden importeren of exporteren](./file-import-export.md). De andere schema's, `JSON Schema`, `Mermaid` en `Zod`, zijn alleen voor uitvoer.  
`DBML` schrijft de kleur van elke tabel als `headercolor` en, in de code voor het hele document, na de `Ref`s een blok `TableGroup` voor elke [tabelgroep](./table-groups.md) die een tabel bevat. `AML` schrijft de kleur van een tabel als de dichtstbijzijnde kleurnaam van AML.

## ON DELETE en ON UPDATE {#on-delete-and-on-update}

De acties voor ON DELETE en ON UPDATE van een relatie worden ingesteld via het contextmenu ervan — zie [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
De doelen met een ✓ in de kolom `ON DELETE / ON UPDATE` van de tabel onder [Taal](#language) schrijven de acties die een relatie instelt; een actie die op `Not set` blijft staan, schrijft niets.  
Welke acties de ORM-doelen behouden, hangt af van de geselecteerde database, terwijl `AML` en `DBML` ze allemaal behouden — zie [Database](#database).

- `Doctrine` schrijft alleen ON DELETE, omdat Doctrine geen ON UPDATE heeft. Het voegt `onDelete: 'CASCADE'` toe aan elke `#[ORM\JoinColumn]` van de `ManyToOne` of `OneToOne` aan de eigenaarskant, zoals `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, en niets aan de `OneToMany` of `OneToOne` aan de inverse kant. Een relatie naar een unieke kolom die niet de primaire sleutel is, blijft bestaan uit gewone kolommen, die Doctrine zonder associatie mapt, dus schrijft het geen actie.
- `Drizzle` schrijft ze in kleine letters. Bij `.references()` zijn het opties, zoals `{ onDelete: "cascade", onUpdate: "set null" }`; bij een `foreignKey()`, die voor een sleutel met meerdere kolommen wordt geschreven, worden ze geketend, zoals `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` schrijft ze bij de relatie `belongs_to` van de kindtabel, ON UPDATE eerst, met de SeaORM-namen `NoAction`, `Cascade`, `SetNull`, `SetDefault` en `Restrict`, zoals `on_update = "Cascade", on_delete = "SetNull"`. De `has_one` of `has_many` van de oudertabel krijgt er geen.
- `Sequelize` zet `onDelete: "CASCADE"` en `onUpdate` als items in beide associatieaanroepen: `hasMany` of `hasOne`, en `belongsTo`. Een sleutel met meerdere kolommen krijgt geen associatieaanroepen, dus schrijft `Sequelize` er geen acties voor.
- `SQLAlchemy` geeft de argumenten `ondelete="CASCADE"` en `onupdate` door aan `ForeignKey()` bij een sleutel met één kolom, en aan `ForeignKeyConstraint()` bij een sleutel met meerdere kolommen.
- `TypeORM` schrijft de opties `onDelete: "CASCADE"` en `onUpdate` bij de `@ManyToOne` of `@OneToOne` aan de eigenaarskant, nooit aan de inverse kant. Het laat `SET DEFAULT` altijd weg, omdat TypeORM die als `DEFAULT` zou schrijven, wat geen enkele database accepteert.
- `DBML` voegt instellingen toe aan de `Ref`, zoals `[delete: set null, update: no action]`.
- `AML` schrijft een relatie met een actie als een losse instructie `rel` met eigenschappen, zoals `{onDelete: cascade, onUpdate: "set null"}`, in plaats van inline bij de kolom ervan.

`JPA` schrijft er geen: gewone JPA heeft er geen optie voor, en de generator gebruikt `@OnDelete` van Hibernate niet. Ook `Mermaid` schrijft er geen, omdat een regel van een `erDiagram` er geen plaats voor heeft.  
Op het tabblad `Code Generator` van Tabeleigenschappen, dat één tabel toont, schrijft `DBML` geen `Ref` en `AML` geen instructie `rel`, dus toont geen van beide daar de acties; `AML` laat een relatie met één kolom die acties heeft inline bij de kolom ervan staan, net als een relatie zonder acties. `Mermaid` schrijft daar helemaal geen regels voor relaties. `Doctrine` en `SeaORM` schrijven daar dezelfde entiteit als in het hele document, inclusief de acties.

## Naamnotatie {#name-case}

`Table Name Case` en `Column Name Case` ondersteunen elk `Pascal`, `Camel`, `Snake` en `None`.  
De standaardwaarden zijn `Pascal` voor tabelnamen en `Camel` voor kolomnamen. `None` schrijft een naam zoals die in het diagram staat.  
Bij elke notatie krijgt een naam die in de taal van het doel gereserveerd is, een escape waar die taal dat toelaat, zoals `@class` in `C#` of `r#type` in `Rust`, en een andere naam waar dat niet kan, zoals `class_` in `Java`.

`AML`, `DBML` en `Mermaid` negeren beide instellingen en schrijven altijd de namen uit het diagram.  
Ook `SeaORM` negeert ze: het geeft velden en modules namen in snake case, de vorm die SeaORM terugleest, en vermeldt de opgeslagen namen in `table_name` en, waar die afwijken, in `column_name`.  
Voor deze vier doelen dimt het paneel beide lijsten, met de notitie `Not used by` eronder.

Elk doel schrijft de fysieke namen, wat de [naamweergave](./logical-names.md#name-view) ook toont.  
Geen enkel doel schrijft een logische naam, ook niet in een lege opmerking: dit tabblad heeft geen tegenhanger van [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) op het tabblad Schema SQL.  
Evenmin schrijft een doel een domein: een kolom die aan een domein is gekoppeld, wordt geschreven met haar gegevenstype, zoals elke andere kolom.

## Database {#database}

Gegevenstypen worden bepaald aan de hand van de geselecteerde database — zie [Databases](./table-related-functions.md#databases).  
Kies die op dit tabblad in de lijst `Database` van het paneel, via `Database` in het contextmenu of via Snel zoeken, en de code wordt meteen herschreven. Het is de enige database-instelling van het diagram, dezelfde die het contextmenu van het canvas en het tabblad [Schema SQL](./schema-sql.md) instellen, dus een wijziging hier is daar ook zichtbaar.  
`Drizzle` haalt zijn dialect uit dezelfde instelling: `pgTable` voor PostgreSQL, `mysqlTable` voor MySQL en MariaDB, `sqliteTable` voor SQLite en `pgTable` voor elke andere database.  
`SeaORM` schrijft een `column_type` waar SeaORM anders een ander kolomtype zou maken op PostgreSQL, MySQL, MariaDB of SQLite, en geen op MSSQL, Oracle, Snowflake of Databricks, waarvoor SeaORM geen backend heeft.

De geselecteerde database bepaalt ook welke acties voor ON DELETE en ON UPDATE de ORM-doelen schrijven.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` en `TypeORM` laten elke actie weg die de Schema SQL van die database weglaat, zoals `SET DEFAULT` op MySQL en MariaDB, `RESTRICT` op MSSQL of elke actie behalve `NO ACTION` op Snowflake en Databricks, zodat het standaardgedrag van de database geldt. De volledige lijst staat in [ON DELETE en ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` volgt in plaats daarvan het dialect dat het schrijft: code met `mysqlTable` laat `SET DEFAULT` weg, terwijl code met `pgTable` en `sqliteTable` elke actie behoudt, ook de code met `pgTable` die het voor MSSQL, Oracle, Snowflake en Databricks schrijft.

`AML`, `DBML` en `Mermaid` zijn de uitzondering: ze schrijven elk gegevenstype zoals het in het diagram staat, dus de database-instelling verandert hun uitvoer niet, en het paneel dimt `Database` voor deze doelen. `AML` en `DBML` schrijven elke actie die een relatie instelt, en `Mermaid` schrijft er geen.

## Aanhalingstekens {#bracket}

`Bracket` wordt alleen in het paneel, het contextmenu en Snel zoeken aangeboden zolang de taal `Doctrine`, `JPA` of `SeaORM` is.  
Het is dezelfde instelling als de aanhalingstekens van het tabblad Schema SQL — zie [Schema SQL](./schema-sql.md#database-and-bracket) — dus een wijziging hier verandert ook hoe Schema SQL namen tussen aanhalingstekens zet. De instelling biedt `SingleQuote`, `DoubleQuote`, `Backtick` en `None`, en begint bij `None`.

- `Doctrine`: bij elke keuze behalve `None` wordt elke tabelnaam, kolomnaam en naam van een join-kolom tussen backticks gezet, waarmee Doctrine aangeeft dat een naam tussen aanhalingstekens moet worden gezet, zoals ``#[ORM\Table(name: '`order`')]``. Bij `None` gebeurt dat alleen bij een naam die het nodig heeft: een woord dat een database reserveert, een naam die geen eenvoudige ASCII-identifier is of een naam die tussen aanhalingstekens is getypt.
- `JPA`: bij elke keuze behalve `None` wordt een tabelnaam die een gereserveerd woord is, binnen `@Table` tussen aanhalingstekens gezet, zoals `@Table(name = "\"user\"")`. Bij `None` blijft die zonder aanhalingstekens, net als in Schema SQL.
- `SeaORM`: bij `None` worden namen geschreven zoals de database ze opslaat: een tabelnaam met een punt wordt gesplitst in `schema_name` en `table_name`, en op PostgreSQL wordt een naam zonder aanhalingstekens omgezet naar kleine letters. Bij elke andere keuze blijft een naam heel, zoals die is geschreven.

## Het resultaat opslaan of kopiëren {#saving-or-copying-the-result}

`Save file`, onder aan het optiepaneel of in het contextmenu, slaat de getoonde code op als bestand.  
Het bestand krijgt een naam zoals elke export, `<database name>-<timestamp>`, gevolgd door de extensie uit de tabel onder [Taal](#language), zoals `shop-2026-10-12T04_05_06.ts`, en komt in je host terecht waar elke export terechtkomt — zie [Exporteren](./file-import-export.md#exporting). `Java` en `JPA` zetten alle klassen in één `.java`-bestand, zoals het tabblad ze toont.  
Het exportmenu heeft geen item voor de Codegenerator, en het tabblad `Code Generator` van Tabeleigenschappen kan geen bestand opslaan.

Om de code te kopiëren, klik je op `Copy` onder aan het paneel, of houd je de aanwijzer boven de code en klik je rechtsboven op de kopieerknop, de enige manier in Tabeleigenschappen.  
De melding `Copied!` met een vinkje bevestigt dit twee seconden lang. Als de browser of host het klembord weigert, verschijnt in plaats daarvan de melding `Couldn't copy to the clipboard` met een waarschuwingsteken, vijf seconden lang. Opnieuw kopiëren vervangt de melding in plaats van er nog een toe te voegen.  
De tekst is ook selecteerbaar, zodat je alleen het deel kunt overnemen dat je nodig hebt.

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) wijzigen de lijsten van het paneel, het contextmenu en Snel zoeken nog steeds `Language`, `Database`, `Table Name Case`, `Column Name Case` en `Bracket`, maar alleen in dat venster, dus het paneel duidt ze aan met `This window only` in plaats van `Saved in the document`.  
Een wijziging herschrijft de code op dat scherm en wordt niet in het bestand opgeslagen, niet met medebewerkers gedeeld en niet voor ongedaan maken vastgelegd, wat de vergrendelingen ook aangeven, en een wijziging van een medebewerker in een instelling die je koos, laat jouw keuze op het scherm staan. `Database` en `Bracket` zijn ook instellingen van het tabblad Schema SQL, dus een keuze hier verschijnt daar in hetzelfde venster — zie [Editors in alleen-lezenmodus](./schema-sql.md#read-only-editors).  
Zodra de editor weer bewerkbaar wordt, komen de instellingen van het document terug en wordt de code ervoor geschreven.  
`Save file` en `Copy` slaan de getoonde code op en kopiëren die.
