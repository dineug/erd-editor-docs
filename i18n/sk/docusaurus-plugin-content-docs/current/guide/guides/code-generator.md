---
sidebar_position: 13
description: Generovanie kódu pre dvadsaťdva cieľov z diagramu, nastavenie jazyka, databázy, štýlu názvov a úvodzoviek v paneli možností, prehľad cieľov, ktoré zapisujú akcie ON DELETE a ON UPDATE vzťahu, a uloženie alebo kopírovanie výsledku.
---

# Generátor kódu

Prepnite na kartu `Code Generator` na paneli nástrojov. Karta zobrazuje vľavo kód celého dokumentu a napravo od neho panel možností s nadpisom `Code Generator`, v ktorom vyberiete jazyk, databázu, štýly názvov a pri niektorých cieľoch aj úvodzovky.  
Panel sa otvorí sám, ak editor pri prvom otvorení karty nie je užší ako 640 px. Tlačidlo `Hide options` v hornej časti panela ho zbalí a tlačidlo `Show options` v pravom hornom rohu kódu ho znova otvorí. Kým je editor otvorený, zostáva pri prepínaní kariet otvorený alebo zbalený nezávisle od panela na karte Schéma SQL a nikdy sa neukladá do súboru.

Kliknutím pravým tlačidlom na kód otvoríte jeho kontextovú ponuku: položky `Language`, `Database`, `Table Name Case`, `Column Name Case` a `Bracket` (iba pre `Doctrine`, `JPA` a `SeaORM`), každá s podponukou so začiarknutou aktuálnou hodnotou, potom položka `Options panel`, ktorá zbalí alebo otvorí panel a je začiarknutá, kým je panel zobrazený, a položka `Save file`.  
Kým je táto karta otvorená, [rýchle vyhľadávanie](./quick-search.md) ponúka položky `Database`, `Bracket` (iba pre `Doctrine`, `JPA` a `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` a položku `Code Generator: Options panel`, ktorá zbalí alebo otvorí panel.

![Nastavenie jazyka TypeScript a potom Rust v kontextovej ponuke kódu, prepnutie názvov stĺpcov na Snake v paneli možností a skopírovanie kódu](/img/demo-code-generator.webp)

Rovnaké zobrazenie kódu tvorí aj kartu `Code Generator` v paneli [Vlastnosti tabuľky](./table-related-functions.md#table-properties), kde sa generuje kód iba pre túto jednu tabuľku namiesto celého dokumentu. Panel možností tam nie je a jej kontextová ponuka mení tie isté nastavenia, ale neobsahuje položky `Options panel` ani `Save file`.  
Kde kód celého dokumentu začína importmi alebo hlavičkou, kód jednej tabuľky začína tými, ktoré táto tabuľka potrebuje, napríklad `<?php` pre `PHP`, `import Foundation` pre `Swift` alebo `$schema` pre `JSON Schema`.

Kód sa vygeneruje pri otvorení karty a znova vždy, keď sa zmení jazyk, databáza, niektorý zo štýlov názvov alebo nastavenie úvodzoviek. Úprava diagramu vykonaná, kým je karta otvorená, napríklad úprava od spolupracovníka alebo programovacieho agenta, sa zobrazí, až keď kartu opustíte a vrátite sa na ňu alebo keď sa zmení niektoré z týchto nastavení.

## Panel možností {#options-panel}

Pod nadpisom `Saved in the document` panel uvádza možnosti `Language`, `Database`, `Table Name Case` a `Column Name Case`, za ktorými nasleduje možnosť `Bracket`, kým je jazyk nastavený na `Doctrine`, `JPA` alebo `SeaORM`. Každá z nich je rozbaľovací zoznam a zmena okamžite prepíše kód.  
Keď vybratý jazyk ignoruje možnosť `Database` alebo štýly názvov, zostávajú v paneli stlmené s upozornením pod nimi, napríklad `Not used by DBML`, a dajú sa naďalej meniť.  
V dolnej časti panela sú tlačidlá `Save file` a `Copy` – pozrite si časť [Uloženie alebo kopírovanie výsledku](#saving-or-copying-the-result).

Sú to vlastné nastavenia diagramu, tie isté, ktoré menia aj kontextová ponuka a rýchle vyhľadávanie. Možnosť `Database` sa ukladá do súboru ako každá úprava.  
Možnosti `Language`, `Table Name Case`, `Column Name Case` a `Bracket` sa ukladajú iba vtedy, keď je ich zamknutie na karte Nastavenia vypnuté (pre `Bracket` je to zamknutie `Bracket Type`), a nový diagram má zapnuté všetky zamknutia. Kým je zamknutie zapnuté, zmena prepíše kód na obrazovke, no súbor si ponechá zamknutú hodnotu a diagram sa s ňou znova otvorí. Panel zamknutie nijako neoznačuje; ak chcete voľbu zachovať v súbore, vypnite jej zamknutie – pozrite si časť [Zamknutie](./settings.md#lock).

## Jazyk {#language}

Podporuje sa dvadsaťdva cieľov v troch skupinách – jazyky, ORM a potom schémy – a v každej skupine sú zoradené abecedne. Zoznam v paneli aj kontextová ponuka oddeľujú skupiny čiarou, ale žiadnu z nich nepomenúvajú:

| Cieľ | Skupina | Vzťahy | Indexy | ON DELETE / ON UPDATE | Ukladá sa ako |
| --- | --- | --- | --- | --- | --- |
| `C#` | Jazyk | — | — | — | `.cs` |
| `Go` | Jazyk | — | — | — | `.go` |
| `Java` | Jazyk | — | — | — | `.java` |
| `Kotlin` | Jazyk | — | — | — | `.kt` |
| `PHP` | Jazyk | — | — | — | `.php` |
| `Rust` | Jazyk | — | — | — | `.rs` |
| `Scala` | Jazyk | — | — | — | `.scala` |
| `Swift` | Jazyk | — | — | — | `.swift` |
| `TypeScript` | Jazyk | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Iba ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Iba jedinečné | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Schéma | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Schéma | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Schéma | ✓ | — | — | `.graphql` |
| `JSON Schema` | Schéma | — | — | — | `.json` |
| `Mermaid` | Schéma | ✓ | — | — | `.mmd` |
| `Zod` | Schéma | — | — | — | `.ts` |

Predvolená hodnota je `GraphQL`. Každý cieľ generuje stĺpce; značky ✓ ukazujú, čo ešte generuje.  
Tabuľky sa generujú v poradí podľa názvu, nie v poradí, v akom sú rozmiestnené na plátne, a indexy sú tie, ktoré sú uvedené v časti `Indexes` v paneli [Vlastnosti tabuľky](./table-related-functions.md#indexes), nie riadky `Keys` nad nimi. `SeaORM` zapisuje iba jedinečné indexy a `Mermaid` označí jedinečný stĺpec ako `UK`, ale nezapíše žiadny index.  
Každý cieľ okrem `Java`, `AML`, `DBML` a `Mermaid` zapíše stĺpec primárneho kľúča ako NOT NULL bez ohľadu na to, či má nastavený príznak `Not Null`. `Java` pri žiadnom stĺpci neoznačuje, či môže, alebo nemôže obsahovať NULL, a `AML`, `DBML` a `Mermaid` zachovávajú príznak tak, ako ho má diagram.

Čo zapisujú niektoré ciele:

- `PHP`: obyčajné triedy s typovanými verejnými vlastnosťami, pričom kód začína riadkami `<?php` a `declare(strict_types=1);`.
- `Doctrine`: entity Doctrine ORM 3 s atribútmi pre DBAL 4.2 alebo novší, každý stĺpec so svojím typom DBAL a možnosťami pre vybratú databázu.
- `Rust`: jedna štruktúra `pub struct` pre každú tabuľku s typmi zapísanými úplnou cestou, napríklad `chrono::NaiveDateTime` alebo `rust_decimal::Decimal`, bez riadka `use`.
- `SeaORM`: entity SeaORM 2.0 v kompaktnom formáte (dense format), každá tabuľka ako modul `pub mod`, takže celý text sa skompiluje ako jeden súbor.
- `Swift`: jedna štruktúra `Codable`, `Hashable`, `Sendable` pre každú tabuľku, čo vyžaduje Swift 6.1 alebo novší.
- `TypeScript`: jedno rozhranie `export interface` pre každú tabuľku, ktoré opisuje riadok ako JSON rovnako ako schéma `Zod` – dátum alebo čas je `string` a stĺpec, ktorý môže obsahovať NULL, je `T | null`.
- `Zod`: jedna schéma riadka v Zod 4 pre každú tabuľku a typ z nej odvodený, bez schémy na vkladanie a bez vzťahov.
- `JSON Schema`: jeden dokument JSON Schema draft 2020-12 so schémou riadka pre každú tabuľku pod kľúčom `$defs`.
- `Mermaid`: diagram `erDiagram`, aký vykresľuje GitHub: každá tabuľka je entita, ktorá uvádza každý stĺpec s jeho typom a prípadným označením `PK`, `FK` alebo `UK`, a každý vzťah je čiara medzi jeho dvoma tabuľkami.

`AML`, `DBML` a `GraphQL` sú obojsmerné formáty: každý z nich je aj zdrojom importu. Pozrite si stránku [Import a export súborov](./file-import-export.md). Ostatné schémy, `JSON Schema`, `Mermaid` a `Zod`, slúžia iba na výstup.  
`DBML` zapisuje farbu každej tabuľky ako `headercolor` a v kóde celého dokumentu za definíciami `Ref` aj blok `TableGroup` pre každú [skupinu tabuliek](./table-groups.md), ktorá obsahuje nejakú tabuľku. `AML` zapisuje farbu tabuľky ako najbližší z názvov farieb, ktoré pozná AML.

## ON DELETE a ON UPDATE {#on-delete-and-on-update}

Akcie ON DELETE a ON UPDATE vzťahu sa nastavujú v jeho kontextovej ponuke – pozrite si časť [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Ciele so značkou ✓ v stĺpci `ON DELETE / ON UPDATE` tabuľky v časti [Jazyk](#language) zapisujú akcie, ktoré vzťah nastavuje; akcia ponechaná na hodnote `Not set` nezapíše nič.  
Ktoré akcie zachovajú ciele ORM, závisí od vybratej databázy, zatiaľ čo `AML` a `DBML` zachovajú všetky – pozrite si časť [Databáza](#database).

- `Doctrine` zapisuje iba ON DELETE, pretože Doctrine nemá ON UPDATE. Pridá `onDelete: 'CASCADE'` ku každému atribútu `#[ORM\JoinColumn]` pri `ManyToOne` alebo `OneToOne` na vlastniacej strane, napríklad `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, a k `OneToMany` ani k `OneToOne` na inverznej strane nepridá nič. Vzťah k jedinečnému stĺpcu, ktorý nie je primárnym kľúčom, zostane v podobe obyčajných stĺpcov, ktoré Doctrine mapuje bez asociácie, takže sa preň nezapíše žiadna akcia.
- `Drizzle` ich zapisuje malými písmenami. Pri `.references()` sú to voľby, napríklad `{ onDelete: "cascade", onUpdate: "set null" }`; pri volaní `foreignKey()`, ktoré sa použije pre viacstĺpcový kľúč, sú zreťazené, napríklad `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` ich zapisuje do vzťahu `belongs_to` podradenej tabuľky, najprv ON UPDATE, s názvami z knižnice SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` a `Restrict`, napríklad `on_update = "Cascade", on_delete = "SetNull"`. Vzťah `has_one` alebo `has_many` nadradenej tabuľky nedostane žiadnu akciu.
- `Sequelize` zapisuje vlastnosti `onDelete: "CASCADE"` a `onUpdate` do oboch volaní asociácie: `hasMany` alebo `hasOne` a `belongsTo`. Viacstĺpcový kľúč nedostane žiadne volania asociácie, takže `Sequelize` preň nezapíše žiadne akcie.
- `SQLAlchemy` odovzdáva argumenty `ondelete="CASCADE"` a `onupdate` do volania `ForeignKey()` pri jednostĺpcovom kľúči a do volania `ForeignKeyConstraint()` pri viacstĺpcovom kľúči.
- `TypeORM` zapisuje voľby `onDelete: "CASCADE"` a `onUpdate` k dekorátoru `@ManyToOne` alebo `@OneToOne` na vlastniacej strane, nikdy nie na inverznej strane. Akciu `SET DEFAULT` vždy vynechá, pretože TypeORM by ju zapísal ako `DEFAULT`, čo žiadna databáza neprijme.
- `DBML` pridá k definícii `Ref` nastavenia, napríklad `[delete: set null, update: no action]`.
- `AML` zapíše vzťah, ktorý má nejakú akciu, ako samostatný príkaz `rel` s vlastnosťami, napríklad `{onDelete: cascade, onUpdate: "set null"}`, a nie priamo pri jeho stĺpci.

`JPA` nezapisuje žiadne akcie: samotné JPA na ne nemá žiadnu voľbu a generátor nepoužíva anotáciu `@OnDelete` z knižnice Hibernate. Ani `Mermaid` nezapisuje žiadne, pretože čiara v diagrame `erDiagram` pre ne nemá miesto.  
Na karte `Code Generator` v paneli Vlastnosti tabuľky, ktorá zobrazuje jednu tabuľku, `DBML` nezapíše žiadnu definíciu `Ref` a `AML` žiadny príkaz `rel`, takže ani jeden tam akcie nezobrazí; `AML` ponechá jednostĺpcový vzťah, ktorý má akcie, priamo pri jeho stĺpci, rovnako ako vzťah bez nich. `Mermaid` tam nezapíše vôbec žiadne čiary vzťahov. `Doctrine` a `SeaORM` tam zapíšu tú istú entitu ako v celom dokumente vrátane akcií.

## Štýl názvov {#name-case}

Možnosti `Table Name Case` aj `Column Name Case` podporujú hodnoty `Pascal`, `Camel`, `Snake` a `None`.  
Predvolené hodnoty sú `Pascal` pre názvy tabuliek a `Camel` pre názvy stĺpcov. Hodnota `None` vygeneruje názov tak, ako je napísaný v diagrame.  
Pri každom štýle názvov sa názov, ktorý je v jazyku cieľa rezervovaný, ošetrí escapovaním tam, kde to daný jazyk umožňuje, napríklad `@class` v jazyku `C#` alebo `r#type` v jazyku `Rust`, a premenuje sa tam, kde to neumožňuje, napríklad `class_` v jazyku `Java`.

`AML`, `DBML` a `Mermaid` obe nastavenia ignorujú a vždy generujú názvy z diagramu.  
Ignoruje ich aj `SeaORM`: polia a moduly pomenúva v štýle snake case, v tvare, ktorý SeaORM spätne načíta, a uložené názvy uvádza v atribúte `table_name` a tam, kde sa líšia, v atribúte `column_name`.  
Pri týchto štyroch cieľoch panel oba zoznamy stlmí a pod nimi zobrazí upozornenie `Not used by`.

Každý cieľ zapisuje fyzické názvy bez ohľadu na to, čo zobrazuje [Zobrazenie názvov](./logical-names.md#name-view).  
Žiadny cieľ nezapisuje logický názov, a to ani do prázdneho komentára: táto karta nemá obdobu prepínača [`Write logical names into empty comments`](./schema-sql.md#logical-names-as-comments) karty Schéma SQL.  
Žiadny cieľ nezapisuje ani doménu: stĺpec prepojený s doménou sa zapíše so svojím typom údajov rovnako ako každý iný stĺpec.

## Databáza {#database}

Typy údajov sa určujú podľa vybratej databázy – pozrite si časť [Databázy](./table-related-functions.md#databases).  
Na tejto karte ju vyberiete v zozname `Database` v paneli, v položke `Database` v kontextovej ponuke alebo v rýchlom vyhľadávaní a kód sa okamžite prepíše. Je to jediné nastavenie databázy v diagrame, to isté, ktoré nastavujú kontextová ponuka plátna a karta [Schéma SQL](./schema-sql.md), takže zmena vykonaná tu sa prejaví aj tam.  
`Drizzle` preberá svoj dialekt z toho istého nastavenia: `pgTable` pre PostgreSQL, `mysqlTable` pre MySQL a MariaDB, `sqliteTable` pre SQLite a `pgTable` pre každú inú databázu.  
`SeaORM` zapíše atribút `column_type` tam, kde by SeaORM inak pri PostgreSQL, MySQL, MariaDB alebo SQLite vytvoril iný typ stĺpca, a pri MSSQL, Oracle, Snowflake a Databricks, pre ktoré SeaORM nemá backend, nezapíše žiadny.

Vybratá databáza tiež určuje, ktoré akcie ON DELETE a ON UPDATE zapisujú ciele ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` a `TypeORM` vynechajú každú akciu, ktorú pre danú databázu vynecháva Schéma SQL, napríklad `SET DEFAULT` pri MySQL a MariaDB, `RESTRICT` pri MSSQL alebo každú akciu okrem `NO ACTION` pri Snowflake a Databricks, takže platí predvolené správanie databázy. Úplný zoznam nájdete v časti [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` sa namiesto toho riadi dialektom, ktorý zapisuje: kód s `mysqlTable` vynechá `SET DEFAULT`, zatiaľ čo kód s `pgTable` a `sqliteTable` zachová každú akciu, a to aj kód s `pgTable`, ktorý zapisuje pre MSSQL, Oracle, Snowflake a Databricks.

Výnimkou sú `AML`, `DBML` a `Mermaid`: každý typ údajov generujú tak, ako je napísaný v diagrame, takže nastavenie databázy ich výstup nemení, a panel pre ne možnosť `Database` stlmí. `AML` a `DBML` zapisujú každú akciu, ktorú vzťah nastavuje, a `Mermaid` nezapisuje žiadnu.

## Úvodzovky {#bracket}

Možnosť `Bracket` ponúkajú panel, kontextová ponuka a rýchle vyhľadávanie iba vtedy, keď je jazyk nastavený na `Doctrine`, `JPA` alebo `SeaORM`.  
Je to rovnaké nastavenie ako úvodzovky na karte Schéma SQL, takže zmena tu zmení aj to, ako Schéma SQL uzatvára názvy do úvodzoviek – pozrite si stránku [Schéma SQL](./schema-sql.md#database-and-bracket). Ponúka hodnoty `SingleQuote`, `DoubleQuote`, `Backtick` a `None` a na začiatku má hodnotu `None`.

- `Doctrine`: pri každej voľbe úvodzoviek okrem `None` sa každý názov tabuľky, stĺpca a spojovacieho stĺpca uzavrie do spätných apostrofov, čím Doctrine označuje názov, ktorý treba dať do úvodzoviek, napríklad ``#[ORM\Table(name: '`order`')]``. Pri `None` sa uzavrie iba názov, ktorý to potrebuje: slovo, ktoré je v niektorej databáze rezervované, názov, ktorý nie je obyčajným identifikátorom ASCII, alebo názov zadaný v úvodzovkách.
- `JPA`: pri každej voľbe úvodzoviek okrem `None` sa názov tabuľky, ktorý je rezervovaným slovom, v anotácii `@Table` uzavrie do úvodzoviek, napríklad `@Table(name = "\"user\"")`. Pri `None` zostane bez úvodzoviek, rovnako ako ho ponecháva Schéma SQL.
- `SeaORM`: pri `None` sa názvy zapisujú tak, ako ich databáza ukladá: názov tabuľky s bodkou sa rozdelí na `schema_name` a `table_name` a pri PostgreSQL sa názov bez úvodzoviek prevedie na malé písmená. Pri každej inej voľbe úvodzoviek sa názov zachová celý, tak ako je napísaný.

## Uloženie alebo kopírovanie výsledku {#saving-or-copying-the-result}

`Save file` v dolnej časti panela možností alebo v kontextovej ponuke uloží zobrazený kód ako súbor.  
Súbor sa pomenuje ako každý export, `<database name>-<timestamp>`, s príponou z tabuľky v časti [Jazyk](#language), napríklad `shop-2026-10-12T04_05_06.ts`, a uloží sa tam, kam sa v hostiteľskej aplikácii ukladá každý export – pozrite si časť [Export](./file-import-export.md#exporting). `Java` a `JPA` dajú všetky triedy do jedného súboru `.java` tak, ako ich zobrazuje karta.  
Ponuka Export nemá položku pre Generátor kódu a karta `Code Generator` v paneli Vlastnosti tabuľky nedokáže uložiť súbor.

Ak chcete kód skopírovať, kliknite na tlačidlo `Copy` v dolnej časti panela alebo podržte ukazovateľ nad kódom a kliknite na tlačidlo kopírovania v jeho pravom hornom rohu, čo je v paneli Vlastnosti tabuľky jediný spôsob.  
Na dve sekundy to potvrdí oznámenie `Copied!` so značkou začiarknutia. Ak prehliadač alebo hostiteľská aplikácia odmietne prístup do schránky, upozorní na to namiesto toho na päť sekúnd oznámenie `Couldn't copy to the clipboard` s výstražným symbolom. Opätovné kopírovanie oznámenie nahradí, namiesto aby pridalo ďalšie.  
Text sa dá aj vyberať, takže si môžete vziať iba tú časť, ktorú potrebujete.
