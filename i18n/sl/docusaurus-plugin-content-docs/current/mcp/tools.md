---
sidebar_position: 4
description: Vsa orodja, ki jih ponuja strežnik MCP erd-editor – branje dokumenta po straneh, 54 orodij za urejanje, erd_batch ter videz rezultata in zavrnitve.
---

# Orodja

Strežnik ponuja 63 orodij: pet orodij seje, tri orodja za branje, 54 orodij za urejanje, po eno za vsako operacijo urejanja, in `erd_batch`, ki izvede več orodij za urejanje kot eno spremembo.

Vsako orodje razen `erd_list_documents` sprejme kot prvi argument `path`, pot do dokumenta, spodnje tabele pa ta argument izpuščajo.
Argument, označen z `?`, je neobvezen.

## Orodja seje {#session-tools}

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_list_documents` | | Navede dokumente ERD s polji `path`, `open`, `active`, `dirty` in `readonly`: dokumente urejevalnika, ki streže delovni imenik, kar v razvojnem okolju JetBrains zajema vse odprte projekte, sicer pa datoteke ERD v delovnem imeniku. |
| `erd_open_document` | `create?` | Odpre dokument za urejanje, in sicer v urejevalniku ERD Editor znotraj urejevalnika, ki ga streže, če tak urejevalnik obstaja. Z argumentom `create` najprej ustvari datoteko, če ta ne obstaja, ime brez končnice pa dobi končnico `.erd.json`. |
| `erd_save` | | Shrani dokument, ki ga ima urejevalnik. VS Code pusti spremembe agenta neshranjene, dokler se to orodje ne pokliče; aplikacija Obsidian in razvojno okolje JetBrains jih shranjujeta tako kot vaše, to orodje pa jih zapiše takoj. V načinu brez vmesnika je vsaka sprememba že zapisana in to orodje ne naredi ničesar. |
| `erd_undo` | | Razveljavi zadnjo spremembo, ki jo je naredil ta agent, nikoli vaše. Klici, ki niso ustvarili vnosa za razveljavitev, se preskočijo in navedejo. |
| `erd_redo` | | Znova uveljavi spremembo, ki jo je nazadnje razveljavilo orodje `erd_undo`. |

Za to, kaj v posameznem načinu naredita shranjevanje in razveljavitev, glejte stran [V živo in brez vmesnika](./live-and-headless.md).

## Branje dokumenta {#reading-a-document}

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Nastavitve in števila, nato stran tabel z njihovimi indeksi in relacijami, vsaka tabela z identifikatorjem, položajem in velikostjo na platnu, številom stolpcev in skupino tabel, če je v kateri. Razen pri iskanju tabelam sledijo skupine tabel in nato beležke. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Navedene entitete v celoti: tabele z njihovimi stolpci in skupino tabel, relacije z njihovimi stolpci ter vrednostma `onDelete` in `onUpdate`, indeksi z njihovimi stolpci, beležke z besedilom, skupine tabel z njihovimi tabelami. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Celoten dokument naenkrat v enem od štirih formatov ali DDL samo nekaterih tabel ali skupin tabel. |

Agent poišče identifikatorje z orodjem `erd_list`, stolpce in druge podrobnosti prebere z orodjem `erd_get`, te identifikatorje pa poda orodjem za urejanje.
Velikost tabele v orodju `erd_list` je okvir, ki ga tabela zaseda na platnu: višina je natančna, širina približna.
Skupina tabel se navede s pravokotnikom, ki ga hrani, z imenom, barvo in številom tabel, ki jih vsebuje.
Vsaka relacija se navede enkrat, pri eni od svojih dveh tabel.
Nastavitve, ki jih navajata orodji `erd_list` in `erd_read`, so tiste, ki se shranijo v datoteko – glejte razdelek [Nastavitve](#settings).

Orodje `erd_read` sprejme enega od štirih formatov:

| `format` | Kaj vrne |
| --- | --- |
| `snapshot` | Kompakten JSON z vsemi entitetami in njihovimi identifikatorji, vključno s skupinami tabel, ter nastavitve s skripti Sheme SQL. Izpusti, kar se razlikuje od enega gledalca do drugega: izmerjene širine, vrstni red prekrivanja, pogled in zavihek. Pri veliki shemi je obsežen. |
| `sql` | DDL za eno od osmih zbirk podatkov: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` ali `SQLite`. Privzeta vrednost argumenta `vendor` je zbirka podatkov, nastavljena v dokumentu. DDL celotnega dokumenta vključuje njegove skripte pred tabelami in za njimi. Z argumenti `tableIds`, `tableNames` ali `groupNames` samo te tabele s tujimi ključi, ki jih vsebujejo, in brez skriptov. Tuji ključi vključujejo svoja dejanja ON DELETE in ON UPDATE, razen tistih, ki jih ciljna zbirka podatkov izpusti – glejte razdelek [ON DELETE in ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Celoten dokument natanko tako, kot shranjevanje zapiše datoteko, vključno s spremembami, ki jih urejevalnik še ni shranil – glejte razdelek [Oblika za shranjevanje in vrednost med izvajanjem](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Samo skripta dokumenta pred tabelami in za njimi, v obliki `{"before":"…","after":"…"}`, vsak prazen, če ni nastavljen, ne glede na to, kako velika je shema. |

Argumente `vendor`, `statements`, `header`, `tableIds`, `tableNames` in `groupNames` sprejme samo format `sql`, vsak drug format pa jih zavrne.

- `statements`: `create`, privzeta vrednost; `ifNotExists`, ki v MySQL, MariaDB, PostgreSQL, SQLite in Databricks zapiše `CREATE TABLE IF NOT EXISTS`, v drugih pa navaden `CREATE TABLE`; ali `recreate`, ki tabele pred ustvarjanjem izbriše, pri čemer Snowflake namesto tega zapiše `CREATE OR REPLACE TABLE`.
- `header`: `none`, privzeta vrednost; `use`, ki izbere zbirko podatkov ali shemo, ki jo določa ime zbirke podatkov dokumenta; ali `createAndUse`, ki jo najprej ustvari. Oracle pozna samo `use`, zato `createAndUse` tam zapiše `use`, PostgreSQL pa pozna samo `createAndUse`, zato `use` tam ne zapiše glave. SQLite ne zapiše nobene, nobena zbirka podatkov pa je ne zapiše, dokler je ime zbirke podatkov prazno ali ni preprost identifikator.
- `groupNames`: tabele navedenih skupin tabel, po imenu ne glede na velikost črk, združene s tabelami iz `tableIds` in `tableNames`. Ime, ki se ne ujema z nobeno skupino, se zavrne s kodo `notFound`. Skupina brez tabel ne doda nobene, branje, ki ostane brez vsake tabele, na primer ko so vse navedene skupine prazne in ni navedena nobena tabela, pa se zavrne s kodo `invalidArgs`.

Argumenta `statements` in `header` veljata tudi za DDL nekaterih tabel. Delujeta kot možnosti `Statements` in `Header` na zavihku [Shema SQL](../guide/guides/schema-sql.md#options-panel) urejevalnika, le da ima zavihek na začetku nastavljeni možnosti `If not exists` in `CREATE + USE`.
Imena se obdajo z narekovaji vrste, ki jo shranjuje datoteka, dokler je nastavitev `Bracket Type` zaklenjena, pa z narekovaji zaklenjene vrste – glejte razdelek [Zaklepanje](../guide/guides/settings.md#lock).

### Velike sheme {#large-schemas}

Delujejo tudi sheme s stotinami ali tisoči tabel.
Branje vrne največ 40.000 znakov, kar je pod mejo, pri kateri Claude Code rezultat orodja odloži v datoteko.

- `erd_list` privzeto vrne stran s 100 elementi, najprej tabele, nato skupine tabel in nato beležke, z vrednostma `nextOffset` in `note` pa pove, kje se začne naslednja stran. To vrednost `nextOffset` podajte kot `offset`, z enakim argumentom `query`.
- `query` najde tabele po besedah v imenu ali komentarju tabele ali stolpca, ne glede na velikost črk. Tabele, katerih imena vsebujejo več teh besed, se navedejo najprej. Iskanje ne navaja skupin tabel ali beležk.
- `namesOnly` navede samo imena tabel, približno 2.000 kratkih imen v enem odgovoru.
- `erd_get` in `erd_read` poleg identifikatorjev sprejmeta tudi `tableNames`, `erd_read` pa sprejme še `groupNames`, zato agent, ki ga prosijo za poizvedbo SQL nad veliko shemo, prebere DDL samo tistih tabel, ki jih potrebuje.
- `erd_get` identifikatorje in imena, ki ne označujejo ničesar, navede pod `missing`, identifikatorje, za katere v enem odgovoru ni prostora, pa pod `notReturned`, da jih je mogoče zahtevati znova.
- Branje, ki je preveliko za en odgovor, se zavrne s kodo `tooLarge` in navodilom, kako ga zožiti.

## Orodja za urejanje {#edit-tools}

Identifikatorji prihajajo iz orodij `erd_list` in `erd_get` ali iz polja `createdIds` klica, ki je entiteto ustvaril.
Nov identifikator sestavlja 25 malih črk in števk, kot je `03h17be2plxpj5n59tqag7ogj`, identifikator, ki ga dokument že vsebuje, pa ohrani svojo obliko, zato iz oblike identifikatorja ne sklepajte ničesar.
`x` in `y` sta levi in zgornji rob na platnu v slikovnih pikah, barva pa je šestnajstiška barva CSS, kot je `#3b82f6`, ali prazen niz, ki barvo odstrani.

### Tabele {#tables}

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_table` | | Doda prazno tabelo na prosto mesto in vrne njen identifikator v `createdIds`. |
| `erd_remove_table` | `tableId` | Odstrani tabelo z njenimi stolpci, indeksi in vsemi relacijami, ki se je dotikajo. |
| `erd_change_table_name` | `tableId`, `value` | Preimenuje tabelo. |
| `erd_change_table_comment` | `tableId`, `value` | Nastavi komentar tabele. Prazen niz ga počisti. |
| `erd_change_table_color` | `tableId`, `color` | Nastavi barvo tabele. |
| `erd_move_table` | `tableId`, `x`, `y` | Premakne tabelo na položaj na platnu. |
| `erd_move_tables` | `positions` | Premakne več tabel v eni spremembi, ki jo razveljavi en klic `erd_undo`. `positions` vsebuje `{ tableId, x, y }` za vsako tabelo, vsako tabelo največ enkrat. |
| `erd_sort_tables` | | Razporedi vse tabele v vrstice po platnu, najprej tiste z najmanj stolpci, tako kot jih razporedijo `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` in `erd_import_aml`. Tabele skupine tabel ostanejo skupaj, okvir vsake skupine pa se prilagodi okoli njih. |

### Stolpci {#columns}

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Doda prazen stolpec v tabelo in vrne njegov identifikator v `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Odstrani stolpce iz ene tabele, skupaj z relacijami in vnosi v indeksih, ki jih uporabljajo. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Preimenuje stolpec. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Nastavi podatkovni tip, kot je `INT` ali `VARCHAR(255)`. Ko je [sinhronizacija tipa podatkov v relacijah](../guide/guides/settings.md#relationship-datatype-sync) vklopljena, sprememba sledi relacijam v obe smeri, tako kot v urejevalniku: tip serial pride do tujih ključev kot celoštevilski tip, ki ga hrani, tako kot ga kopira `erd_add_relationship`, ključ serial pa ohrani svoj tip, ko se spremeni eden od njegovih tujih ključev, kar spremembo tam ustavi. Sinhronizacijo vklopi ali izklopi uporabnik, `erd_list` pa jo navaja kot `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Nastavi privzeto vrednost kot besedilo SQL. Prazen niz jo počisti. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Nastavi komentar. Prazen niz ga počisti. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` stolpec vključi v primarni ključ, `false` ga iz njega odstrani. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Nastavi, ali je stolpec enoličen. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Nastavi, ali je stolpec `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Nastavi, ali se stolpec samodejno povečuje. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Premakne stolpec znotraj njegove tabele na položaj drugega stolpca. |

### Relacije {#relationships}

`relationshipType` je kardinalnost na koncu pri podrejeni tabeli: `ZeroOne`, `ZeroN`, `OneOnly` ali `OneN`.
Začetna tabela je nadrejena tabela, torej ciljna stran, ki vsebuje primarni ključ, končna tabela pa je podrejena.
`onDelete` in `onUpdate` sta dejanji ON DELETE in ON UPDATE tujega ključa: `none`, `noAction`, `cascade`, `setNull`, `setDefault` ali `restrict`.
`none` ne zapiše določila, zato velja privzeto dejanje zbirke podatkov – glejte razdelek [ON DELETE in ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Dejanje, ki je izpuščeno pri `erd_add_relationship` ali `erd_link_columns`, je `none`.

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Poveže dve tabeli z relacijo. Primarni ključ nadrejene tabele kopira v podrejeno kot stolpce tujega ključa, pri čemer najprej ustvari stolpec primarnega ključa, če ga nadrejena tabela nima. Vsak stolpec tujega ključa dobi ime tako, kot ga poimenuje risanje relacije v urejevalniku: ključ `id` tabele `users` da `users_id`, ključ, kot je `member_id`, pa ohrani svoje ime – glejte razdelek [Imena stolpcev tujega ključa](../guide/guides/relationship-editing.md#foreign-key-column-names). Vsak kopira podatkovni tip svojega ključa, le da ključ serial da celoštevilski tip, ki ga hrani, npr. `integer` za `serial4`, sam `serial` pa zunaj PostgreSQL, MySQL in MariaDB ostane `serial` – glejte razdelek [Identifikacijske relacije](../guide/guides/relationship-editing.md#identifying-relationships). `createdIds` vsebuje novi stolpec ključa, če je bil ustvarjen, stolpce tujega ključa in na koncu identifikator relacije. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Nariše relacijo med obstoječimi stolpci in začetne ter končne stolpce poveže v pare po položaju. Ne preimenuje nobenega stolpca in ne spremeni nobenega podatkovnega tipa. |
| `erd_remove_relationship` | `relationshipId` | Odstrani povezovalno črto relacije. Njeni stolpci tujega ključa ostanejo v tabeli. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Spremeni kardinalnost relacije. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Nastavi dejanje ON DELETE relacije: kaj brisanje nadrejene vrstice naredi z njenimi podrejenimi vrsticami. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Nastavi dejanje ON UPDATE relacije: kaj sprememba nadrejenega ključa naredi z njegovimi podrejenimi vrsticami. |

`erd_add_relationship` stolpce tujega ključa poimenuje ob izvedbi, zato najprej poimenujte nadrejeno tabelo in njen primarni ključ.

Nobeno orodje ne spremeni stolpcev obstoječe relacije tako kot okno [Preslikaj stolpce](../guide/guides/relationship-editing.md#map-columns) urejevalnika.
Za preslikavo relacije na druge stolpce izvedite `erd_remove_relationship`, ki njene stolpce tujega ključa pusti v tabeli, in `erd_link_columns` z želenimi stolpci, oboje v enem klicu `erd_batch`, ki ga razveljavi en klic `erd_undo`.

### Indeksi {#indexes}

Identifikator stolpca indeksa je vnos na seznamu stolpcev indeksa, ki ga vrne `erd_get`, in ne identifikator stolpca tabele.

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Doda prazen indeks v tabelo in vrne njegov identifikator v `createdIds`. |
| `erd_remove_index` | `indexId` | Odstrani indeks. |
| `erd_change_index_name` | `indexId`, `value` | Preimenuje indeks. |
| `erd_set_index_unique` | `indexId`, `value` | Nastavi, ali je indeks enoličen. |
| `erd_add_index_column` | `indexId`, `columnId` | Doda stolpec tabele indeksa in vrne identifikator novega stolpca indeksa. Stolpec, ki je že v indeksu, ostane nespremenjen. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Odstrani en stolpec iz indeksa. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Premakne stolpec znotraj indeksa na položaj drugega stolpca tega indeksa. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Nastavi vrstni red razvrščanja enega stolpca v indeksu, `ASC` ali `DESC`. |

### Beležke {#memos}

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_memo` | | Doda prazno beležko na prosto mesto in vrne njen identifikator v `createdIds`. |
| `erd_remove_memo` | `memoId` | Odstrani beležko. |
| `erd_change_memo_value` | `memoId`, `value` | Zamenja besedilo beležke. |
| `erd_change_memo_color` | `memoId`, `color` | Nastavi barvo beležke. |
| `erd_move_memo` | `memoId`, `x`, `y` | Premakne beležko na položaj na platnu. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Spremeni velikost beležke. Širina mora biti vsaj približno `116` slikovnih pik, višina pa vsaj `100`. Ne ustvari vnosa za razveljavitev, ker urejevalnik spremembo velikosti beležke zabeleži samo pri vlečenju. |

Dokler so beležke skrite z [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` beležko še vedno doda, ta pa ostane skrita, dokler se beležke znova ne prikažejo.
`erd_list` in `erd_get` navajata tudi skrite beležke.

### Skupine tabel {#table-groups}

Skupina tabel je poimenovan okvir, narisan za njenimi tabelami, njena barva pa je vidna na okviru in čez glave njenih tabel – glejte stran [Skupine tabel](../guide/guides/table-groups.md).
Tabela je v največ eni skupini. `erd_move_table`, `erd_move_tables` in `erd_move_table_group` nikoli ne spremenijo, katere tabele vsebuje skupina, ne glede na to, kam postavijo tabelo, medtem ko se v urejevalniku tabela pridruži skupini ali jo zapusti glede na to, kam jo spustite – glejte razdelek [Dodajanje in odstranjevanje tabel](../guide/guides/table-groups.md#adding-and-removing-tables). `erd_add_table_group` in `erd_set_table_group` dodata tabele v skupino, `erd_remove_table_group` pa njene tabele pusti brez skupine.
Skupina hrani pravokotnik, širok vsaj `160` slikovnih pik in visok vsaj `100`, vključno z naslovno vrstico, urejevalnik pa okvir nariše povečan tako, da zajame vsako od njenih tabel.

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Doda skupino in vrne njen identifikator v `createdIds`. Podajte bodisi `tableIds` bodisi pravokotnik: `x`, `y`, `width` in `height` skupaj. Z argumentom `tableIds` vsaka tabela zapusti skupino, v kateri je bila, pravokotnik pa se prilagodi okoli tabel tako, kot ga prilagodi [združevanje izbranih tabel v skupino](../guide/guides/table-groups.md#grouping-selected-tables). Pravokotnik zajame vse tabele brez skupine, katerih središče leži v njem, tako kot [risanje skupine](../guide/guides/table-groups.md#drawing-a-group). Prazen argument `name` pusti skupino brez imena. En klic `erd_undo` odstrani skupino in vsako tabelo vrne v skupino, v kateri je bila. |
| `erd_remove_table_group` | `groupId` | Odstrani skupino. Njene tabele ostanejo, kjer so, brez skupine. |
| `erd_change_table_group_name` | `groupId`, `value` | Preimenuje skupino. Prazen niz jo pusti brez imena. |
| `erd_change_table_group_color` | `groupId`, `color` | Nastavi barvo skupine. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Premakne skupino tako, da se njen pravokotnik začne v tej točki, njene tabele pa se premaknejo za enako razdaljo, tako kot pri vlečenju njene naslovne vrstice. Premik pod 20 slikovnih pik, vodoravno in navpično skupaj, ne ustvari vnosa za razveljavitev. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Nastavi pravokotnik skupine, njene tabele pa ostanejo, kjer so. Če sta `x` in `y` izpuščena, njen kot ostane nespremenjen. Pravokotnik, ki ne bi zajel tabel skupine z njihovim notranjim odmikom, se zavrne s sporočilom, ki navede okvir, ki ga mora zajeti. |
| `erd_set_table_group` | `tableIds`, `groupId` | Doda tabele v skupino, pri čemer vsaka zapusti skupino, v kateri je bila. `groupId` z vrednostjo `null` ali prazen niz jih odstrani iz vseh skupin. |

Dokler so skupine skrite z `View Option` → `Table Groups`, ta orodja še vedno dodajajo in spreminjajo skupine, ki ostanejo skrite, dokler se skupine ne prikažejo – glejte razdelek [Skrivanje skupin](../guide/guides/table-groups.md#hiding-groups).
`erd_sort_tables` ohrani tabele vsake skupine skupaj, `erd_import_dbml` in `erd_import_json` prineseta skupine – glejte razdelek [Uvoz](#import) – `erd_read` pa z argumentom `groupNames` zapiše DDL izbranih skupin.
Izdaja ERD Editor, ki še ne pozna skupin tabel, ob shranjevanju datoteke zavrže njene skupine, kot to storijo razširitev za VS Code pred različico `4.0.0` ter vtičnika za Obsidian in JetBrains pred različico `1.0.0` – glejte razdelek [Posodabljanje](./installation.md#updating).

### Nastavitve {#settings}

Agent nastavlja nastavitve same sheme: zbirko podatkov, njeno ime in skripte [Sheme SQL](../guide/guides/schema-sql.md).
Vse druge nastavitve, ki jih hrani dokument, nastavlja uporabnik v urejevalniku: stikala [možnosti pogleda](../guide/guides/table-related-functions.md#table-view-options), možnosti zavihka [Nastavitve](../guide/guides/settings.md), jezik in zapis imen generatorja kode, vrsto narekovajev in [zaklepe](../guide/guides/settings.md#lock).
Nobeno orodje jih ne spremeni, razen uvozov v načinu `replace`: `erd_import_json` prinese nastavitve in zaklepe dokumenta, ki ga naloži, preostali štirje pa pogled vrnejo na začetek platna – glejte razdelek [Uvoz](#import).
Strežnik različice `1.0.0` je odstranil orodja, ki so jih nastavljala: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` in `erd_set_show`.

`erd_list` in format `snapshot` orodja `erd_read` navajata nastavitve tako, kot jih shrani datoteka, pri čemer `lockSettings` vsebuje eno zastavico za vsak zaklep: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` in `bracketType`.
Zaklenjen jezik, zapis imen ali vrsta narekovajev se navede z zaklenjeno vrednostjo, tisto, ki jo hrani datoteka in s katero se odpre vsak urejevalnik, ne glede na to, kaj kaže zaslon urejevalnika. Pogled in zavihek se ne navajata.

`erd_set_ddl_script` ustvari vnos za razveljavitev. `erd_set_database` in `erd_set_database_name` ga ne ustvarita, zato ju `erd_undo` ne more razveljaviti.

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_set_database` | `value` | Nastavi zbirko podatkov: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` ali `Snowflake`. Določi podatkovne tipe zbirke podatkov in DDL, ki jo `erd_read` zapiše, ko argument `vendor` ni podan. |
| `erd_set_database_name` | `value` | Nastavi ime zbirke podatkov, ki ga navajata glavi `use` in `createAndUse` orodja `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Nastavi enega od dveh skriptov, zapisanih okoli tabel – glejte razdelek [Skripti pred tabelami in za njimi](../guide/guides/schema-sql.md#before-and-after-scripts). `position` je `before`, zapisan pred tabelami, npr. `CREATE EXTENSION` ali `CREATE SCHEMA`, ali `after`, zapisan za njimi, npr. `GRANT` ali `CREATE VIEW`. `sql` zamenja celoten skript, največ 10.000 znakov, prazen niz pa ga odstrani. Trenutnega najprej preberite s formatom `scripts` orodja `erd_read`. |

Skript gre v DDL vsake zbirke podatkov nespremenjen, zato ga napišite za zbirko podatkov dokumenta. Pri MSSQL se za skript, katerega zadnja vrstica ni `GO`, doda vrstica `GO`.
Izdaja ERD Editor, ki še ne pozna teh skriptov, ob shranjevanju datoteke zavrže njene skripte, kot to storijo razširitev za VS Code pred različico `4.0.0` ter vtičnika za Obsidian in JetBrains pred različico `1.0.0` – glejte razdelek [Posodabljanje](./installation.md#updating).

### Uvoz {#import}

Ta orodja preberejo shemo tako kot meni Uvozi v urejevalniku – glejte stran [Uvoz in izvoz datotek](../guide/guides/file-import-export.md).
Vsako sprejme besedilo kot `value` in `mode`: `replace`, privzeto vrednost, ali `append`.

| Orodje | Argumenti | Kaj naredi |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Naloži SQL DDL, stavke `CREATE TABLE` in podobno. |
| `erd_import_graphql` | `value`, `mode?` | Naloži GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Naloži DBML. Vsak `TableGroup` postane skupina tabel s tabelami, ki jih navaja – glejte razdelek [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Naloži AML. |
| `erd_import_json` | `value`, `mode?` | Naloži dokument JSON erd-editor, npr. drugo datoteko `.erd.json`. |

`replace` nadomesti dokument, `erd_undo` pa obnovi prejšnjega:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` in `erd_import_aml` zamenjajo vse tabele, relacije, indekse, beležke in skupine tabel. Ohranijo nastavitve dokumenta, vključno z zaklepi, razen pogleda, ki se vrne na začetek platna pri 100 %.
- `erd_import_json` zamenja celoten dokument, vključno z nastavitvami: nastavitve in zaklepi iz besedila JSON nadomestijo nastavitve in zaklepe tega dokumenta, besedilo JSON, ki ne beleži zaklepov, pa vklopi vse zaklepe in postavi pogled na začetek platna. Če želite ohraniti nastavitve tega dokumenta, začnite z besedilom, ki ga vrne format `json` orodja `erd_read`. Prazno besedilo da nov dokument, kakršnega ustvari `erd_open_document` z argumentom `create`.

`append` uvoz doda v dokument, tako kot ukaz [Uvozi in dodaj](../guide/guides/file-import-export.md#import-and-add) urejevalnika, en klic `erd_undo` pa odstrani celoten dodatek:

- Vsebina besedila pride v dokument kot nove entitete z novimi identifikatorji, v blok pod vsem, kar dokument vsebuje, vključno s skritimi beležkami in skupinami tabel, blok pa je poravnan z levim robom dokumenta. Vse obstoječe tabele in nastavitve ostanejo, vključno s tabelo z enakim imenom: nič se ne združi po imenu.
- Relacije in indeksi se ustvarijo samo med tabelami, ki jih prinese uvoz, zato se tuji ključ do tabele, ki je besedilo ne deklarira, zavrže.
- `erd_import_sql`, `erd_import_graphql` in `erd_import_aml` dodajo tabele z njihovimi relacijami in indeksi, `erd_import_dbml` pa tudi skupine tabel. `erd_import_json` doda tabele, relacije, indekse, beležke in skupine tabel, nikoli pa njegovih nastavitev, in zavrne prazno besedilo.

Dokument JSON ohrani svojo razporeditev, vključno s skupinami tabel: z `replace` tam, kamor postavi svoje tabele, z `append` pa znotraj dodanega bloka.
Tabele iz SQL, GraphQL, DBML in AML se razporedijo v vrstice, najprej tiste z najmanj stolpci in s tabelami vsake skupine skupaj, tako kot jih razporedi `erd_sort_tables`, nikoli s postavitvijo `Flow`, kot jih razporedi ukaz Uvozi v urejevalniku, kadar je to mogoče. Ta štiri orodja v obeh načinih zavrnejo prazno besedilo.

## erd_batch {#erd_batch}

`erd_batch` izvede več orodij za urejanje po vrsti kot eno spremembo, vse ali nič.

- `operations` vsebuje do 100 vnosov, vsak v obliki `{ tool, as?, args? }`, pri čemer so `args` argumenti orodja brez `path`.
- Operacije se najprej preizkusijo na kopiji dokumenta. Zavrnjena operacija se navede, na primer `operations[1] erd_remove_table: …`, in nobena operacija se ne izvede.
- En klic `erd_undo` razveljavi celoten paket, razen operacij, ki jih ne more razveljaviti in jih navede `undoNote` v rezultatu: operacij orodja, ki ne ustvari vnosa za razveljavitev, kot je `erd_set_database`, in operacij, ki so spremenile dokument, ne da bi ustvarile tak vnos, kot je kratek klic `erd_move_table_group`. Paket, ki ni ustvaril nobenega vnosa za razveljavitev, `erd_undo` preskoči. `historyEntries` v rezultatu šteje vnose v zgodovini urejevalnika znotraj paketa, ne klicev `erd_undo`.
- V seji v živo urejevalnik sprejme ves paket ali nič od njega.

Agent pred klicem ne more poznati identifikatorjev, ki jih bo paket ustvaril, zato operacija, poimenovana z `as`, omogoči poznejši operaciji, da se sklicuje nanje: `$name` ali `$name.0` za njen prvi ustvarjeni identifikator, `$name.1` za drugega in `$name.last` za zadnjega.
Ime vsebuje črke ASCII, števke in podčrtaje, se ne začne s števko in poimenuje samo eno operacijo.
Sklic se razreši samo tam, kjer argument sprejme identifikator entitete, zato ime ali komentar z besedilom `$x` ostane besedilo.

Tabela s stolpci in relacijo v enem klicu:

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

Tabela `users` in njen ključ `id` dobita imeni pred relacijo, zato je stolpec tujega ključa, ki ga relacija doda v tabelo `orders`, `users_id`.

## Rezultati {#results}

Urejanje vrne eno vrstico JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Polje | Pomen |
| --- | --- |
| `mode` | `live` ali `headless` – glejte stran [V živo in brez vmesnika](./live-and-headless.md). |
| `createdIds` | Identifikatorji tega, kar je klic ustvaril, po vrsti. |
| `batches`, `historyEntries` | Koliko paketov sprememb je klic poslal in koliko vnosov v zgodovini urejevalnika je ustvaril. |
| `undoable`, `undoNote` | `undoable` je `false`, ko bo `erd_undo` klic preskočil, `undoNote` pa pove, zakaj: orodje ne ustvari vnosa za razveljavitev, klic je spremenil dokument, ne da bi ustvaril tak vnos, kot to stori `erd_move_table_group` za manj kot 20 slikovnih pik, ali pa je dokument vrednost že vseboval. Rezultat `erd_batch` vedno vsebuje `undoNote`. Če je paket ustvaril vnos za razveljavitev, opomba pove, da en klic `erd_undo` razveljavi paket, in navede vsako operacijo, ki jo pusti nerazveljavljeno; če ga ni ustvaril, rezultat vsebuje `undoable: false`, opomba pa pove, da ga `erd_undo` preskoči. |
| `mismatch` | Prisotno, ko je klic ustvaril drugačno število paketov ali vnosov v zgodovini, kot ga orodje deklarira. |
| `notes` | Prisotno, ko se je pri seji kaj spremenilo, npr. urejevalnik, ki se je zaprl ali prenehal streči dokument, ali datoteka, ki se je spremenila na disku. |

Zavrnitev je rezultat napake s kodo in sporočilom, ki pove, kaj storiti:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Zakaj |
| --- | --- |
| `notFound` | Identifikator ne označuje ničesar, kar trenutno obstaja, ali pa datoteka ne obstaja. |
| `invalidArgs` | Argument manjka ali ima napačno vrednost. |
| `invalidPath` | Pot ni dokument ERD. V sistemu Windows tudi pot z imenom, ki ga Windows ne shrani tako, kot je zapisano, ali pot, ki pripelje do dokumenta, ki ga ima urejevalnik pod drugo potjo, sporočilo pa jo navede. |
| `invalidDocument` | Datoteka ni dokument, ki ga urejevalnik lahko prebere. |
| `tooLarge` | Branje ne gre v en odgovor. |
| `blocked` | Urejevalnik z izklopljenim središčem ima dokument. Sporočilo pove, kako ga vklopiti: v VS Code zaupajte delovnemu prostoru in vklopite `dineug.erd-editor.agentHub.enabled` ali znova naložite okno; v aplikaciji Obsidian vklopite Coding agents ali znova naložite aplikacijo Obsidian; v razvojnem okolju JetBrains vklopite Coding agents ali, če je ta nastavitev že vklopljena, znova zaženite razvojno okolje. |
| `hubDisabled` | Razvojno okolje JetBrains ima dokument samo v projektu, ki mu ne zaupa. Branje še vedno deluje; zaupajte projektu, da bo agent lahko urejal. |
| `conflict` | Datoteka se je med klicem spremenila na disku. Nič ni bilo zapisano. |
| `hubAppeared`, `hubGone` | Urejevalnik je začel streči dokument, ki ga je agent urejal na disku, ali pa urejevalnik, ki ga je stregel, še vedno teče, vendar njegove zaklepne datoteke in povezave ni več. Nič ni bilo zapisano. |
| `notSaved` | Orodje `erd_save` ni moglo shraniti dokumenta urejevalnika. |
| `readonly` | Urejevalnik ima dokument samo za branje, npr. datoteko, v katero ne more pisati ali je ne more prebrati kot diagram. Brez urejevalnika je samo za branje datoteka sama, npr. datoteka v sistemu Perforce ali TFVC, ki ni izvlečena za urejanje. Nič ni bilo zapisano. |
| `protocolMismatch` | Razširitev ali vtičnik ERD Editor v urejevalniku in strežnik uporabljata vsak svojo različico protokola, npr. strežnik različice `1.0.0` z razširitvijo za VS Code različice `3.x`. Zavrne se tudi branje, sporočilo pa navede stran, ki jo je treba posodobiti – glejte razdelek [Posodabljanje](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Središče urejevalnika ni sprejelo povezave, ni odgovorilo v 30 sekundah ali je med klicem prekinilo povezavo. V sistemu Windows `hubUnreachable` pomeni tudi, da je Windows agentu preprečil dostop do središča: urejevalnik teče z več pravicami kot agent, na primer ko je bil zagnan kot skrbnik, agent pa ne, ali pa agent teče v peskovniku. |

Druge kode so redkejše, vsaka zavrnitev pa vsebuje sporočilo, ki pove, kaj se je zgodilo.

Orodja za urejanje, `erd_batch` in tri orodja za branje zavrnejo argument, ki ga ne deklarirajo, ali argument napačnega tipa, z napako JSON-RPC zaradi neveljavnih parametrov (`-32602`), še preden se dotaknejo dokumenta, zato se napačno zapisan argument nikoli tiho ne izpusti.
Pet orodij seje prezre argumente, ki jih ne poznajo.
