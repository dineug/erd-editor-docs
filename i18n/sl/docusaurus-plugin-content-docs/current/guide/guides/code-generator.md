---
sidebar_position: 12
description: Ustvarjanje kode za dvaindvajset ciljev iz diagrama, izbira jezika, zbirke podatkov, zapisa imen in narekovajev na plošči z možnostmi, pregled ciljev, ki zapišejo dejanji ON DELETE in ON UPDATE relacije, ter shranjevanje ali kopiranje rezultata.
---

# Generator kode

V orodni vrstici preklopite na zavihek `Code Generator`. Zavihek na levi prikazuje kodo za celoten dokument, desno od nje pa ploščo z možnostmi z naslovom `Code Generator`, na kateri izberete jezik, zbirko podatkov, oba zapisa imen in pri nekaterih ciljih še narekovaje.  
Plošča se odpre samodejno, razen če je urejevalnik ob prvem odprtju zavihka ožji od 640 px. Gumb `Hide options` na vrhu plošče jo strne, gumb `Show options` v zgornjem desnem kotu kode pa jo znova prikaže. Ob preklapljanju zavihkov ostane odprta ali strnjena, dokler je urejevalnik odprt, in sicer neodvisno od plošče zavihka Shema SQL, njeno stanje pa se nikoli ne shrani v datoteko.

Kliknite kodo z desno tipko miške, da odprete njen priročni meni: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (samo za `Doctrine`, `JPA` in `SeaORM`), vsaka postavka s podmenijem, ki označi trenutno vrednost, nato `Options panel`, ki ploščo strne ali odpre in ima kljukico, dokler je plošča prikazana, ter `Save file`.  
Dokler je ta zavihek odprt, [hitro iskanje](./quick-search.md) ponuja `Database`, `Bracket` (samo za `Doctrine`, `JPA` in `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` in `Code Generator: Options panel`, ki ploščo strne ali odpre.

![Izbira jezika TypeScript in nato Rust v priročnem meniju kode, preklop imen stolpcev na Snake na plošči z možnostmi in kopiranje kode](/img/demo-code-generator.webp)

Isti pogled kode je tudi zavihek `Code Generator` v oknu [Lastnosti tabele](./table-related-functions.md#table-properties), kjer ustvari kodo samo za to eno tabelo namesto za celoten dokument. Tam nima plošče z možnostmi, njegov priročni meni pa spreminja iste nastavitve, vendar nima postavk `Options panel` in `Save file`.  
Kjer se koda za celoten dokument začne z uvoznimi stavki ali glavo, se koda ene tabele začne s tistimi, ki jih potrebuje ta tabela, kot so `<?php` za `PHP`, `import Foundation` za `Swift` ali `$schema` za `JSON Schema`.

Koda se ustvari ob odprtju zavihka in znova ob vsaki spremembi jezika, zbirke podatkov, enega od zapisov imen ali narekovajev. Sprememba diagrama, narejena med odprtim zavihkom, na primer sprememba sodelavca ali agenta za kodiranje, se prikaže, ko zavihek zapustite in se vrnete nanj, ali ko se spremeni katera od teh nastavitev.

## Plošča z možnostmi {#options-panel}

Pod napisom `Saved in the document` plošča navaja `Language`, `Database`, `Table Name Case` in `Column Name Case`, za njimi pa še `Bracket`, kadar je izbrani jezik `Doctrine`, `JPA` ali `SeaORM`. Vsak od njih je spustni seznam, sprememba pa kodo takoj prepiše.  
Kadar izbrani jezik ne upošteva nastavitve `Database` ali zapisov imen, ti ostanejo na plošči, vendar so zatemnjeni in imajo pod seboj opombo, kot je `Not used by DBML`, še vedno pa jih je mogoče spremeniti.  
Gumba `Save file` in `Copy` sta na dnu plošče – glejte razdelek [Shranjevanje ali kopiranje rezultata](#saving-or-copying-the-result).

To so nastavitve samega diagrama, iste, ki jih spreminjata tudi priročni meni in hitro iskanje. Nastavitev `Database` se shrani v datoteko kot vsaka druga sprememba.  
Nastavitve `Language`, `Table Name Case`, `Column Name Case` in `Bracket` se shranijo samo, dokler je njihov zaklep na zavihku Nastavitve izklopljen (za `Bracket` je to `Bracket Type`), nov diagram pa ima vklopljene vse zaklepe. Dokler je zaklep vklopljen, sprememba prepiše kodo na vašem zaslonu, datoteka pa obdrži zaklenjeno vrednost in diagram se znova odpre z njo. Plošča z ničimer ne nakazuje zaklepa; če želite izbiro ohraniti v datoteki, izklopite njen zaklep – glejte razdelek [Zaklepanje](./settings.md#lock).

## Jezik {#language}

Podprtih je dvaindvajset ciljev, navedenih v treh skupinah – jeziki, ogrodja ORM in nato sheme –, vsaka po abecednem vrstnem redu. Seznam na plošči in priročni meni med skupinami narišeta črto, vendar nobene od njih ne poimenujeta:

| Cilj | Skupina | Relacije | Indeksi | ON DELETE / ON UPDATE | Shranjeno kot |
| --- | --- | --- | --- | --- | --- |
| `C#` | Jezik | — | — | — | `.cs` |
| `Go` | Jezik | — | — | — | `.go` |
| `Java` | Jezik | — | — | — | `.java` |
| `Kotlin` | Jezik | — | — | — | `.kt` |
| `PHP` | Jezik | — | — | — | `.php` |
| `Rust` | Jezik | — | — | — | `.rs` |
| `Scala` | Jezik | — | — | — | `.scala` |
| `Swift` | Jezik | — | — | — | `.swift` |
| `TypeScript` | Jezik | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Samo ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Samo enolični | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Shema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Shema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Shema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Shema | — | — | — | `.json` |
| `Mermaid` | Shema | ✓ | — | — | `.mmd` |
| `Zod` | Shema | — | — | — | `.ts` |

Privzeti cilj je `GraphQL`. Vsak cilj zapiše stolpce; oznake ✓ kažejo, kaj še zapiše.  
Tabele se zapišejo razvrščene po imenih in ne v vrstnem redu, v katerem stojijo na platnu, indeksi pa so tisti, ki so navedeni pod `Indexes` v oknu [Lastnosti tabele](./table-related-functions.md#indexes), ne vrstice `Keys` nad njimi. `SeaORM` zapiše samo enolične, `Mermaid` pa enoličen stolpec označi z `UK`, vendar ne zapiše nobenega indeksa.  
Vsi cilji razen `Java`, `AML`, `DBML` in `Mermaid` zapišejo stolpec primarnega ključa kot NOT NULL, ne glede na to, ali ima nastavljeno zastavico `Not Null`. `Java` pri nobenem stolpcu ne označi, ali dovoljuje NULL ali ne, `AML`, `DBML` in `Mermaid` pa zastavico ohranijo takšno, kot je v diagramu.

Kaj zapišejo nekateri cilji:

- `PHP`: preprosti razredi s tipiziranimi javnimi lastnostmi, pred njimi pa sta `<?php` in `declare(strict_types=1);`.
- `Doctrine`: entitete Doctrine ORM 3 z atributi, za DBAL 4.2 ali novejši, vsak stolpec s svojim tipom DBAL in možnostmi za izbrano zbirko podatkov.
- `Rust`: ena struktura `pub struct` za vsako tabelo, s tipi, zapisanimi s polno potjo, kot sta `chrono::NaiveDateTime` ali `rust_decimal::Decimal`, brez vrstice `use`.
- `SeaORM`: entitete SeaORM 2.0 v zgoščeni obliki, vsaka tabela kot modul `pub mod`, tako da se celotno besedilo prevede kot ena datoteka.
- `Swift`: ena struktura `Codable`, `Hashable`, `Sendable` za vsako tabelo, ki zahteva Swift 6.1 ali novejši.
- `TypeScript`: en vmesnik `export interface` za vsako tabelo, ki vrstico opiše kot JSON, tako kot shema `Zod` – datum ali čas je `string`, stolpec, ki dovoljuje NULL, pa `T | null`.
- `Zod`: shema vrstice Zod 4 za vsako tabelo in tip, ki ga izpelje, brez sheme za vstavljanje in brez relacij.
- `JSON Schema`: en dokument JSON Schema draft 2020-12 s shemo vrstice za vsako tabelo pod `$defs`.
- `Mermaid`: diagram `erDiagram`, kakršnega izriše GitHub, v katerem je vsaka tabela entiteta, ki navaja vsak stolpec z njegovim tipom in morebitno oznako `PK`, `FK` ali `UK`, vsaka relacija pa črta med njenima tabelama.

`AML`, `DBML` in `GraphQL` so formati za prenos v obe smeri: vsak je tudi vir za uvoz. Glejte stran [Uvoz in izvoz datotek](./file-import-export.md). Druge sheme, `JSON Schema`, `Mermaid` in `Zod`, so samo izhodne.  
`DBML` zapiše barvo vsake tabele kot `headercolor`, v kodi za celoten dokument pa za definicijami `Ref` še blok `TableGroup` za vsako [skupino tabel](./table-groups.md), ki vsebuje tabelo. `AML` zapiše barvo tabele kot najbližje izmed imen barv, ki jih pozna AML.

## ON DELETE in ON UPDATE {#on-delete-and-on-update}

Dejanji ON DELETE in ON UPDATE relacije se nastavita v njenem priročnem meniju – glejte razdelek [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Cilji z oznako ✓ v stolpcu `ON DELETE / ON UPDATE` tabele v razdelku [Jezik](#language) zapišejo dejanja, ki jih nastavi relacija; za dejanje, ki je ostalo na `Not set`, se ne zapiše nič.  
Katera dejanja ohranijo cilji ORM, je odvisno od izbrane zbirke podatkov, `AML` in `DBML` pa ohranita vsa – glejte razdelek [Zbirka podatkov](#database).

- `Doctrine` zapiše samo ON DELETE, ker Doctrine nima ON UPDATE. Vsakemu atributu `#[ORM\JoinColumn]` pri `ManyToOne` ali `OneToOne` na lastniški strani doda `onDelete: 'CASCADE'`, na primer `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, pri `OneToMany` ali `OneToOne` na inverzni strani pa ničesar. Relacija na enoličen stolpec, ki ni primarni ključ, ostane v obliki navadnih stolpcev, ki jih Doctrine preslika brez asociacije, zato se zanjo ne zapiše nobeno dejanje.
- `Drizzle` jih zapiše z malimi črkami. Pri `.references()` so podana kot možnosti, na primer `{ onDelete: "cascade", onUpdate: "set null" }`; pri `foreignKey()`, ki ga dobi ključ z več stolpci, so zapisana kot verižni klici, na primer `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` jih zapiše pri relaciji `belongs_to` podrejene tabele, najprej ON UPDATE, z imeni `NoAction`, `Cascade`, `SetNull`, `SetDefault` in `Restrict`, ki jih uporablja SeaORM, na primer `on_update = "Cascade", on_delete = "SetNull"`. Relacija `has_one` ali `has_many` nadrejene tabele ne dobi nobenega.
- `Sequelize` zapiše vnosa `onDelete: "CASCADE"` in `onUpdate` v oba klica asociacije: `hasMany` ali `hasOne` ter `belongsTo`. Ključ z več stolpci ne dobi klicev asociacije, zato `Sequelize` zanj ne zapiše nobenih dejanj.
- `SQLAlchemy` poda argumenta `ondelete="CASCADE"` in `onupdate` klicu `ForeignKey()` za ključ z enim stolpcem in klicu `ForeignKeyConstraint()` za ključ z več stolpci.
- `TypeORM` zapiše možnosti `onDelete: "CASCADE"` in `onUpdate` pri `@ManyToOne` ali `@OneToOne` na lastniški strani, nikoli na inverzni strani. Dejanje `SET DEFAULT` vedno izpusti, ker bi ga TypeORM zapisal kot `DEFAULT`, česar ne sprejme nobena zbirka podatkov.
- `DBML` definiciji `Ref` doda nastavitve, na primer `[delete: set null, update: no action]`.
- `AML` relacijo, ki ima dejanje, zapiše kot samostojen stavek `rel` z lastnostmi, na primer `{onDelete: cascade, onUpdate: "set null"}`, namesto neposredno pri njenem stolpcu.

`JPA` ne zapiše nobenega: sam JPA zanje nima možnosti, generator pa ne uporablja anotacije `@OnDelete` ogrodja Hibernate. Tudi `Mermaid` ne zapiše nobenega, ker v vrstici `erDiagram` zanje ni prostora.  
Na zavihku `Code Generator` okna Lastnosti tabele, ki prikazuje eno tabelo, `DBML` ne zapiše definicije `Ref`, `AML` pa ne stavka `rel`, zato tam nobeden od njiju ne prikaže dejanj; `AML` relacijo z enim stolpcem, ki ima dejanja, ohrani zapisano neposredno pri njenem stolpcu, tako kot relacijo brez njih. `Mermaid` tam sploh ne zapiše črt relacij. `Doctrine` in `SeaORM` tam zapišeta isto entiteto kot v celotnem dokumentu, vključno z dejanji.

## Zapis imen {#name-case}

Obe nastavitvi, `Table Name Case` in `Column Name Case`, podpirata `Pascal`, `Camel`, `Snake` in `None`.  
Privzeti vrednosti sta `Pascal` za imena tabel in `Camel` za imena stolpcev. Vrednost `None` zapiše ime tako, kot je napisano v diagramu.  
Pri vsakem zapisu imen se ime, ki je v jeziku cilja rezervirano, zapiše v ubežni obliki, kjer ta jezik to omogoča, na primer `@class` v jeziku `C#` ali `r#type` v jeziku `Rust`, kjer tega ne omogoča, pa se preimenuje, na primer v `class_` v jeziku `Java`.

`AML`, `DBML` in `Mermaid` prezrejo obe nastavitvi in vedno zapišejo imena iz diagrama.  
Tudi `SeaORM` ju prezre: polja in module poimenuje v obliki snake case, ki jo SeaORM prebere nazaj, shranjena imena pa navede v `table_name` in, kjer se razlikujejo, v `column_name`.  
Pri teh štirih ciljih plošča zatemni oba seznama, pod njima pa je opomba `Not used by`.

## Zbirka podatkov {#database}

Podatkovni tipi se razrešijo glede na izbrano zbirko podatkov – glejte razdelek [Zbirke podatkov](./table-related-functions.md#databases).  
Na tem zavihku jo izberite na seznamu `Database` na plošči, v postavki `Database` priročnega menija ali v hitrem iskanju in koda se takoj prepiše. To je edina nastavitev zbirke podatkov v diagramu, ista, ki jo nastavljata priročni meni platna in zavihek [Shema SQL](./schema-sql.md), zato se sprememba tukaj pokaže tudi tam.  
`Drizzle` vzame svoj dialekt iz iste nastavitve: `pgTable` za PostgreSQL, `mysqlTable` za MySQL in MariaDB, `sqliteTable` za SQLite in `pgTable` za vse druge zbirke podatkov.  
`SeaORM` zapiše atribut `column_type` tam, kjer bi SeaORM sicer pri PostgreSQL, MySQL, MariaDB ali SQLite ustvaril drugačen tip stolpca, pri MSSQL, Oracle, Snowflake ali Databricks, za katere SeaORM nima zaledja, pa nobenega.

Izbrana zbirka podatkov določa tudi, katera dejanja ON DELETE in ON UPDATE zapišejo cilji ORM.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` in `TypeORM` izpustijo vsako dejanje, ki ga izpusti Shema SQL te zbirke podatkov, na primer `SET DEFAULT` pri MySQL in MariaDB, `RESTRICT` pri MSSQL ali vsa dejanja razen `NO ACTION` pri Snowflake in Databricks, tako da velja privzeto dejanje zbirke podatkov. Celoten seznam je v razdelku [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle` namesto tega sledi dialektu, ki ga zapiše: koda `mysqlTable` izpusti `SET DEFAULT`, koda `pgTable` in `sqliteTable` pa ohrani vsa dejanja, vključno s kodo `pgTable`, ki jo zapiše za MSSQL, Oracle, Snowflake in Databricks.

Izjema so `AML`, `DBML` in `Mermaid`: vsak podatkovni tip zapišejo tako, kot je napisan v diagramu, zato nastavitev zbirke podatkov ne spremeni njihovega izhoda, plošča pa zanje zatemni seznam `Database`. `AML` in `DBML` zapišeta vsako dejanje, ki ga nastavi relacija, `Mermaid` pa nobenega.

## Narekovaji {#bracket}

Nastavitev `Bracket` je na plošči, v priročnem meniju in v hitrem iskanju na voljo samo, kadar je izbrani jezik `Doctrine`, `JPA` ali `SeaORM`.  
Gre za isto nastavitev kot narekovaji na zavihku Shema SQL – glejte stran [Shema SQL](./schema-sql.md#database-and-bracket) –, zato sprememba tukaj spremeni tudi to, kako Shema SQL postavi imena v narekovaje. Ponuja `SingleQuote`, `DoubleQuote`, `Backtick` in `None`, začetna vrednost pa je `None`.

- `Doctrine`: pri kateri koli vrsti narekovajev razen `None` se vsako ime tabele, stolpca in stolpca za stik obda z obrnjenimi narekovaji, s čimer Doctrine označi ime, ki ga je treba postaviti v narekovaje, na primer ``#[ORM\Table(name: '`order`')]``. Pri `None` se obda samo ime, ki to potrebuje: beseda, ki jo rezervira zbirka podatkov, ime, ki ni preprost identifikator ASCII, ali ime, vneseno v narekovajih.
- `JPA`: pri kateri koli vrsti narekovajev razen `None` se ime tabele, ki je rezervirana beseda, znotraj `@Table` postavi v narekovaje, na primer `@Table(name = "\"user\"")`. Pri `None` ostane brez narekovajev, tako kot ga pusti Shema SQL.
- `SeaORM`: pri `None` se imena zapišejo tako, kot jih shrani zbirka podatkov: ime tabele s piko se razdeli na `schema_name` in `table_name`, pri PostgreSQL pa se ime brez narekovajev pretvori v male črke. Pri kateri koli drugi vrsti narekovajev se ime ohrani celo, tako kot je zapisano.

## Shranjevanje ali kopiranje rezultata {#saving-or-copying-the-result}

`Save file` na dnu plošče z možnostmi ali v priročnem meniju shrani prikazano kodo kot datoteko.  
Datoteka je poimenovana kot vsak izvoz, `<database name>-<timestamp>`, imenu pa sledi končnica iz tabele v razdelku [Jezik](#language), na primer `shop-2026-10-12T04_05_06.ts`, in se shrani tja, kamor gre vsak izvoz v vašem gostitelju – glejte razdelek [Izvoz](./file-import-export.md#exporting). `Java` in `JPA` vse razrede postavita v eno datoteko `.java`, tako kot jih prikazuje zavihek.  
Meni Izvozi nima postavke za generator kode, zavihek `Code Generator` v oknu Lastnosti tabele pa ne more shraniti datoteke.

Če želite kodo kopirati, kliknite `Copy` na dnu plošče ali pa premaknite kazalec nad kodo in kliknite gumb za kopiranje v njenem zgornjem desnem kotu, kar je v oknu Lastnosti tabele edini način.  
Pojavno obvestilo `Copied!` s kljukico to za dve sekundi potrdi. Če brskalnik ali gostitelj zavrne dostop do odložišča, to namesto tega sporoči pojavno obvestilo `Couldn't copy to the clipboard` z opozorilnim znakom. Ponovno kopiranje nadomesti pojavno obvestilo, namesto da bi dodalo novo.  
Besedilo je mogoče tudi izbrati, zato lahko vzamete samo del, ki ga potrebujete.
