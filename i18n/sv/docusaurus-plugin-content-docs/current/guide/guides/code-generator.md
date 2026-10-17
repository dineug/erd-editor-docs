---
sidebar_position: 12
description: Generera kod för tjugotvå mål från diagrammet, välj språk, databas, skiftläge för namn och citattecken i alternativpanelen, se vilka mål som skriver en relations ON DELETE- och ON UPDATE-åtgärder och spara eller kopiera resultatet.
---

# Kodgenerator

Byt till fliken `Code Generator` i verktygsfältet. Fliken visar koden för hela dokumentet till vänster och, till höger om den, en alternativpanel med rubriken `Code Generator`, där du väljer språk, databas, skiftlägen för namn och, för vissa mål, citattecken.  
Panelen öppnas av sig själv om editorn inte är smalare än 640 px när fliken öppnas första gången. `Hide options` högst upp i panelen fäller ihop den, och `Show options` längst upp till höger i koden tar fram den igen. Den förblir öppen eller ihopfälld när du byter flik så länge editorn är öppen, oberoende av panelen på fliken Schema SQL, och sparas aldrig i filen.

Högerklicka på koden för att öppna dess snabbmeny: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (bara för `Doctrine`, `JPA` och `SeaORM`), var och en med en undermeny där det aktuella värdet är ikryssat, sedan `Options panel`, som fäller ihop eller öppnar panelen och är ikryssat medan den visas, och `Save file`.  
Medan den här fliken är öppen erbjuder [snabbsökningen](./quick-search.md) `Database`, `Bracket` (bara för `Doctrine`, `JPA` och `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` och `Code Generator: Options panel`, som fäller ihop eller öppnar panelen.

![TypeScript och sedan Rust väljs i kodens snabbmeny, kolumnnamnen byts till Snake i alternativpanelen och koden kopieras](/img/demo-code-generator.webp)

Samma kodvy är också fliken `Code Generator` i panelen [Tabellegenskaper](./table-related-functions.md#table-properties), där den genererar kod för just den tabellen i stället för hela dokumentet. Där har den ingen alternativpanel, och dess snabbmeny ändrar samma inställningar men har varken `Options panel` eller `Save file`.  
Där koden för hela dokumentet börjar med importsatser eller en inledning, börjar koden för den enskilda tabellen med dem som just den tabellen behöver, till exempel `<?php` för `PHP`, `import Foundation` för `Swift` eller `$schema` för `JSON Schema`.

Koden skrivs när fliken öppnas och igen varje gång språket, databasen, ett skiftläge eller typen av citattecken ändras. En ändring i diagrammet medan fliken är öppen, till exempel från en medarbetare eller en kodagent, visas när du lämnar fliken och kommer tillbaka, eller när någon av de inställningarna ändras.

## Alternativpanelen {#options-panel}

Under rubriken `Saved in the document` listar panelen `Language`, `Database`, `Table Name Case` och `Column Name Case`, följt av `Bracket` medan språket är `Doctrine`, `JPA` eller `SeaORM`. Var och en är en listruta, och en ändring skriver om koden direkt.  
När det valda språket ignorerar `Database` eller skiftlägena för namn står de kvar i panelen, nedtonade, med en notering som `Not used by DBML` under sig, och kan fortfarande ändras.  
`Save file` och `Copy` finns längst ned i panelen – se [Spara eller kopiera resultatet](#saving-or-copying-the-result).

Det här är diagrammets egna inställningar, samma som snabbmenyn och snabbsökningen också ändrar. `Database` sparas i filen som vilken ändring som helst.  
`Language`, `Table Name Case`, `Column Name Case` och `Bracket` sparas bara medan deras lås på fliken Inställningar är av (`Bracket Type` för `Bracket`), och i ett nytt diagram är alla lås på. Medan ett lås är på skriver en ändring om koden på din skärm, men filen behåller det låsta värdet och diagrammet öppnas igen med det. Panelen visar inget tecken på något lås; slå av låset för ett val om du vill behålla valet i filen – se [Lås](./settings.md#lock).

## Språk {#language}

Tjugotvå mål stöds, listade i tre grupper – språk, ORM:er och sedan scheman – var och en i alfabetisk ordning. Listan i panelen och snabbmenyn har en skiljelinje mellan grupperna men namnger ingen av dem:

| Mål | Grupp | Relationer | Index | ON DELETE / ON UPDATE | Sparas som |
| --- | --- | --- | --- | --- | --- |
| `C#` | Språk | — | — | — | `.cs` |
| `Go` | Språk | — | — | — | `.go` |
| `Java` | Språk | — | — | — | `.java` |
| `Kotlin` | Språk | — | — | — | `.kt` |
| `PHP` | Språk | — | — | — | `.php` |
| `Rust` | Språk | — | — | — | `.rs` |
| `Scala` | Språk | — | — | — | `.scala` |
| `Swift` | Språk | — | — | — | `.swift` |
| `TypeScript` | Språk | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Bara ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Bara unika | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schema | — | — | — | `.json` |
| `Mermaid` | Schema | ✓ | — | — | `.mmd` |
| `Zod` | Schema | — | — | — | `.ts` |

Standardvärdet är `GraphQL`. Alla mål genererar kolumner; ✓-märkena visar vad mer de genererar.  
Tabellerna genereras i namnordning i stället för i den ordning de ligger på arbetsytan, och indexen är de som listas under `Indexes` i panelen [Tabellegenskaper](./table-related-functions.md#indexes), inte raderna under `Keys` ovanför dem. `SeaORM` skriver bara de unika, och `Mermaid` märker en unik kolumn med `UK` men skriver inget index.  
Alla mål utom `Java`, `AML`, `DBML` och `Mermaid` skriver en primärnyckelkolumn som icke-nullbar oavsett om den har `Not Null` eller inte. `Java` märker ingen kolumn som vare sig nullbar eller icke-nullbar, och `AML`, `DBML` och `Mermaid` behåller flaggan så som diagrammet har den.

Vad några av målen skriver:

- `PHP`: vanliga klasser med typade publika egenskaper, som inleds med `<?php` och `declare(strict_types=1);`.
- `Doctrine`: entiteter för Doctrine ORM 3 med attribut, för DBAL 4.2 eller senare, där varje kolumn har sin DBAL-typ och sina alternativ för den valda databasen.
- `Rust`: en `pub struct` per tabell, med typerna skrivna med fullständig sökväg, som `chrono::NaiveDateTime` eller `rust_decimal::Decimal`, utan någon rad med `use`.
- `SeaORM`: entiteter för SeaORM 2.0 i dense-formatet, där varje tabell är en `pub mod`, så att hela texten kompileras som en enda fil.
- `Swift`: en struct per tabell som är `Codable`, `Hashable` och `Sendable` och som kräver Swift 6.1 eller senare.
- `TypeScript`: ett `export interface` per tabell som beskriver raden som JSON, precis som schemat från `Zod` gör – ett datum eller en tid är en `string`, och en nullbar kolumn är `T | null`.
- `Zod`: ett radschema för Zod 4 per tabell och den typ som det härleder, utan schema för infogning och utan relationer.
- `JSON Schema`: ett enda dokument i JSON Schema draft 2020-12, med ett radschema per tabell under `$defs`.
- `Mermaid`: ett `erDiagram`, den sort som GitHub renderar, där varje tabell är en entitet som listar varje kolumn med dess typ och ett eventuellt märke `PK`, `FK` eller `UK`, och varje relation är en linje mellan dess två tabeller.

`AML`, `DBML` och `GraphQL` är format som fungerar åt båda hållen: vart och ett är också en importkälla. Se [Importera eller exportera filer](./file-import-export.md). De övriga schemana, `JSON Schema`, `Mermaid` och `Zod`, kan bara genereras.  
`DBML` skriver varje tabells färg som `headercolor` och, i koden för hela dokumentet, ett block `TableGroup` efter satserna `Ref` för varje [tabellgrupp](./table-groups.md) som innehåller en tabell. `AML` skriver en tabells färg som det närmaste av färgnamnen i AML.

## ON DELETE och ON UPDATE {#on-delete-and-on-update}

En relations ON DELETE- och ON UPDATE-åtgärder anges i dess snabbmeny – se [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
De mål som har ✓ i kolumnen `ON DELETE / ON UPDATE` i tabellen under [Språk](#language) skriver de åtgärder som en relation anger; för en åtgärd som står kvar på `Not set` skrivs ingenting.  
Vilka åtgärder ORM-målen behåller beror på den valda databasen, medan `AML` och `DBML` behåller alla – se [Databas](#database).

- `Doctrine` skriver bara ON DELETE, eftersom Doctrine saknar ON UPDATE. Det lägger till `onDelete: 'CASCADE'` i varje `#[ORM\JoinColumn]` för `ManyToOne` eller `OneToOne` på ägarsidan, som `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, och ingenting på `OneToMany` eller `OneToOne` på den inversa sidan. En relation till en unik kolumn som inte är primärnyckeln förblir vanliga kolumner, som Doctrine mappar utan association, så ingen åtgärd skrivs för den.
- `Drizzle` skriver dem med gemener. På `.references()` är de alternativ, som `{ onDelete: "cascade", onUpdate: "set null" }`; på en `foreignKey()`, som en nyckel med flera kolumner får, kedjas de, som `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` skriver dem på barntabellens relation `belongs_to`, ON UPDATE först, med de namn som SeaORM använder, `NoAction`, `Cascade`, `SetNull`, `SetDefault` och `Restrict`, till exempel `on_update = "Cascade", on_delete = "SetNull"`. Föräldratabellens `has_one` eller `has_many` får inga.
- `Sequelize` skriver posterna `onDelete: "CASCADE"` och `onUpdate` i båda associationsanropen: `hasMany` eller `hasOne` samt `belongsTo`. En nyckel med flera kolumner får inga associationsanrop, så `Sequelize` skriver inga åtgärder för den.
- `SQLAlchemy` skickar argumenten `ondelete="CASCADE"` och `onupdate` till `ForeignKey()` för en nyckel med en kolumn och till `ForeignKeyConstraint()` för en nyckel med flera kolumner.
- `TypeORM` skriver alternativen `onDelete: "CASCADE"` och `onUpdate` på `@ManyToOne` eller `@OneToOne` på ägarsidan, aldrig på den inversa sidan. Det utelämnar alltid `SET DEFAULT`, eftersom TypeORM skulle skriva det som `DEFAULT`, vilket ingen databas accepterar.
- `DBML` lägger till inställningar i `Ref`, som `[delete: set null, update: no action]`.
- `AML` skriver en relation som har en åtgärd som en fristående sats med `rel` och egenskaper, till exempel `{onDelete: cascade, onUpdate: "set null"}`, i stället för direkt på dess kolumn.

`JPA` skriver inga: vanlig JPA har inget alternativ för dem, och generatorn använder inte `@OnDelete` från Hibernate. `Mermaid` skriver inte heller några, eftersom en linje i ett `erDiagram` saknar plats för dem.  
På fliken `Code Generator` i panelen Tabellegenskaper, som visar en enda tabell, skriver `DBML` ingen `Ref` och `AML` ingen sats med `rel`, så ingen av dem visar åtgärderna där; `AML` låter en relation över en kolumn stå direkt på kolumnen även när den har åtgärder, precis som en relation utan åtgärder. `Mermaid` skriver inga relationslinjer alls där. `Doctrine` och `SeaORM` skriver samma entitet där som i hela dokumentet, inklusive åtgärderna.

## Skiftläge för namn {#name-case}

`Table Name Case` och `Column Name Case` stöder båda `Pascal`, `Camel`, `Snake` och `None`.  
Standardvärdena är `Pascal` för tabellnamn och `Camel` för kolumnnamn. `None` genererar ett namn så som det är skrivet i diagrammet.  
Oavsett skiftläge maskeras ett namn som målets språk reserverar där språket kan maskera det, som `@class` i `C#` eller `r#type` i `Rust`, och döps om där det inte går, som `class_` i `Java`.

`AML`, `DBML` och `Mermaid` ignorerar båda inställningarna och genererar alltid namnen från diagrammet.  
`SeaORM` ignorerar dem också: det namnger fält och moduler i snake case, den form som SeaORM läser tillbaka, och anger de lagrade namnen i `table_name` och, där de skiljer sig, `column_name`.  
För de här fyra målen tonar panelen ned båda listorna, med noteringen `Not used by` under dem.

## Databas {#database}

Datatyperna bestäms utifrån den valda databasen – se [Databaser](./table-related-functions.md#databases).  
Välj den på den här fliken i listan `Database` i panelen, under `Database` i snabbmenyn eller i snabbsökningen, så skrivs koden om direkt. Det är diagrammets enda databasinställning, samma som arbetsytans snabbmeny och fliken [Schema SQL](./schema-sql.md) ändrar, så en ändring här syns även där.  
`Drizzle` tar sin dialekt från samma inställning: `pgTable` för PostgreSQL, `mysqlTable` för MySQL och MariaDB, `sqliteTable` för SQLite och `pgTable` för alla andra databaser.  
`SeaORM` skriver en `column_type` där SeaORM annars skulle skapa en annan kolumntyp i PostgreSQL, MySQL, MariaDB eller SQLite, och ingen i MSSQL, Oracle, Snowflake eller Databricks, som SeaORM inte har någon backend för.

Den valda databasen avgör också vilka ON DELETE- och ON UPDATE-åtgärder ORM-målen skriver.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` och `TypeORM` utelämnar varje åtgärd som Schema SQL för databasen utelämnar, som `SET DEFAULT` i MySQL och MariaDB, `RESTRICT` i MSSQL eller alla åtgärder utom `NO ACTION` i Snowflake och Databricks, så att databasens standardbeteende gäller. Hela listan finns i [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` följer i stället den dialekt som det skriver: kod med `mysqlTable` utelämnar `SET DEFAULT`, medan kod med `pgTable` och `sqliteTable` behåller alla åtgärder, även den kod med `pgTable` som det skriver för MSSQL, Oracle, Snowflake och Databricks.

`AML`, `DBML` och `Mermaid` är undantagen: de genererar varje datatyp så som den är skriven i diagrammet, så databasinställningen ändrar inte deras utdata, och panelen tonar ned `Database` för dem. `AML` och `DBML` skriver alla åtgärder som en relation anger, och `Mermaid` skriver inga.

## Citattecken {#bracket}

`Bracket` erbjuds i panelen, snabbmenyn och snabbsökningen bara medan språket är `Doctrine`, `JPA` eller `SeaORM`.  
Det är samma inställning som citattecknen på fliken Schema SQL – se [Schema SQL](./schema-sql.md#database-and-bracket) – så en ändring här ändrar också hur Schema SQL sätter namn inom citattecken. Den erbjuder `SingleQuote`, `DoubleQuote`, `Backtick` och `None` och är `None` från början.

- `Doctrine`: när citattecknen är något annat än `None` omges varje tabell-, kolumn- och join-kolumnnamn av grava accenter, så som Doctrine märker ett namn som ska sättas inom citattecken, till exempel ``#[ORM\Table(name: '`order`')]``. Med `None` omges bara ett namn som behöver det: ett ord som en databas reserverar, ett namn som inte är en vanlig ASCII-identifierare eller ett namn som skrivits inom citattecken.
- `JPA`: när citattecknen är något annat än `None` sätts ett tabellnamn som är ett reserverat ord inom citattecken i `@Table`, som `@Table(name = "\"user\"")`. Med `None` lämnas det utan citattecken, precis som Schema SQL lämnar det.
- `SeaORM`: med `None` skrivs namnen så som databasen lagrar dem: ett tabellnamn med punkt delas upp i `schema_name` och `table_name`, och i PostgreSQL görs ett namn utan citattecken om till gemener. Med någon annan typ av citattecken behålls ett namn odelat, så som det är skrivet.

## Spara eller kopiera resultatet {#saving-or-copying-the-result}

`Save file`, längst ned i alternativpanelen eller i snabbmenyn, sparar den kod som visas som en fil.  
Filen namnges som alla exporter, `<database name>-<timestamp>`, följt av filändelsen i tabellen under [Språk](#language), till exempel `shop-2026-10-12T04_05_06.ts`, och hamnar där alla exporter hamnar i ditt värdprogram – se [Exportera](./file-import-export.md#exporting). `Java` och `JPA` lägger alla klasser i en enda `.java`-fil, så som fliken visar dem.  
Menyn Export har inget alternativ för kodgeneratorn, och fliken `Code Generator` i panelen Tabellegenskaper kan inte spara någon fil.

Klicka på `Copy` längst ned i panelen för att kopiera koden, eller håll pekaren över koden och klicka på kopieringsknappen längst upp till höger i den, vilket är det enda sättet i panelen Tabellegenskaper.  
Meddelandet `Copied!` med en bock bekräftar kopieringen i två sekunder. Om webbläsaren eller värdprogrammet nekar åtkomst till Urklipp talar meddelandet `Couldn't copy to the clipboard` med en varningssymbol om det i stället. En ny kopiering ersätter meddelandet i stället för att lägga till ett till.  
Texten går också att markera, så du kan ta bara den del du behöver.
