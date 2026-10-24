---
sidebar_position: 4
description: Všetky nástroje servera MCP erd-editor – čítanie dokumentu po stránkach, kontroly slovníkov, 67 nástrojov na úpravy, erd_batch a podoba výsledku a odmietnutia.
---

# Nástroje

Server ponúka 77 nástrojov: päť nástrojov relácie, štyri nástroje na čítanie, 67 nástrojov na úpravy, jeden pre každú operáciu úprav, a nástroj `erd_batch`, ktorý spustí niekoľko nástrojov na úpravy ako jednu úpravu.

Každý nástroj okrem `erd_list_documents` prijíma ako prvý argument `path` dokumentu a tabuľky nižšie ho vynechávajú.
Argument označený `?` je voliteľný.

## Nástroje relácie {#session-tools}

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_list_documents` | | Vypíše dokumenty ERD s poľami `path`, `open`, `active`, `dirty` a `readonly`: dokumenty editora, ktorý obsluhuje pracovný adresár a ktorý v IDE od JetBrains pokrýva každý otvorený projekt, inak súbory ERD v pracovnom adresári. |
| `erd_open_document` | `create?` | Otvorí dokument na úpravy v rozšírení alebo doplnku ERD Editor toho editora, ktorý ho obsluhuje, ak taký editor existuje. S argumentom `create` najprv vytvorí súbor, ak chýba, a názov bez prípony dostane príponu `.erd.json`. |
| `erd_save` | | Uloží dokument, ktorý spravuje editor. VS Code ponechá úpravy agenta neuložené, kým sa tento nástroj nezavolá; aplikácia Obsidian a IDE od JetBrains ich ukladajú rovnako ako vaše a tento nástroj ich zapíše okamžite. V režime Headless je každá úprava už zapísaná, ako uvádza `saved: true` v jej výsledku, a tento nástroj nemá žiadny účinok. |
| `erd_undo` | | Vráti späť poslednú úpravu, ktorú urobil tento agent, nikdy nie vašu. Volania, ktoré nevytvorili žiadny záznam v histórii zmien, sa preskočia a vymenujú sa. |
| `erd_redo` | | Znova vykoná úpravu, ktorú naposledy vrátil späť nástroj `erd_undo`. |

Informácie o tom, čo v jednotlivých režimoch robí ukladanie a vrátenie späť, nájdete na stránke [Live a Headless](./live-and-headless.md).

## Čítanie dokumentu {#reading-a-document}

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Nastavenia a počty, potom stránka tabuliek s ich indexmi a vzťahmi, každá tabuľka s identifikátorom, polohou a veľkosťou na plátne, počtom stĺpcov, logickým názvom, ak ho má, a skupinou tabuliek, ak do nejakej patrí. Ak nevyhľadáva, za tabuľkami nasledujú skupiny tabuliek, poznámky a potom domény, termíny a slová. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?`, `wordIds?`, `termIds?`, `domainIds?` | Uvedené entity v plnom rozsahu: tabuľky s ich stĺpcami a skupinou tabuliek, vzťahy s ich stĺpcami a hodnotami `onDelete` a `onUpdate`, indexy s ich stĺpcami, poznámky s ich textom, skupiny tabuliek s ich tabuľkami a slová, termíny a domény so všetkými poľami. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `logicalNameAsComment?`, `tableIds?`, `tableNames?`, `groupNames?` | Celý dokument naraz v jednom zo štyroch formátov alebo kód DDL iba niektorých tabuliek alebo skupín tabuliek. |
| `erd_list_checks` | `level?`, `tableIds?`, `tableNames?`, `offset?`, `limit?` | Problémy, ktoré nachádzajú slovníky slov, termínov a domén, tak ako ich uvádza hárok `Checks` na karte Slovník editora, po stránkach. Nič nemení – pozrite si časť [Kontroly slovníkov](#dictionary-checks). |

Agent nájde identifikátory pomocou `erd_list`, stĺpce, riadky slovníkov a ďalšie podrobnosti prečíta pomocou `erd_get` a tieto identifikátory odovzdá nástrojom na úpravy.
Veľkosť tabuľky v `erd_list` je plocha, ktorú tabuľka zaberá na plátne: výška je presná, šírka približná.
Skupina tabuliek sa uvádza obdĺžnikom, ktorý ukladá, s názvom, farbou a počtom tabuliek, ktoré obsahuje.
Každý vzťah sa uvádza raz, pri jednej z jeho dvoch tabuliek.
Riadok slovníka sa uvádza svojím identifikátorom, hodnotou `name` a tým, čo dáva fyzickému názvu alebo stĺpcu: hodnotou `dataType` pri doméne, hodnotami `physicalName` a `domainId` pri termíne a hodnotou `abbreviation` pri slove. Každý slovník uvádza svoje riadky v poradí, v akom ich zobrazuje jeho hárok.
Nastavenia, ktoré hlásia `erd_list` a `erd_read`, sú tie, ktoré sa ukladajú do súboru – pozrite si časť [Nastavenia](#settings).

V `erd_get` a vo formáte `snapshot` nástroja `erd_read` má každá tabuľka a každý stĺpec pole `logicalName`, prázdny reťazec, ak logický názov nemá, a pole `nameDerived`, ktoré je `true`, kým názov dali slovníky, takže nový logický názov ho znova odvodí – pozrite si časť [Slovníky](#dictionaries).
Každý stĺpec má pole `domainId` a rovnako aj každý termín: prázdny reťazec, ak doménu nemá alebo ak ide o doménu, ktorú dokument už neuvádza.

Nástroj `erd_read` prijíma jeden zo štyroch formátov:

| `format` | Čo vráti |
| --- | --- |
| `snapshot` | Kompaktný JSON so všetkými entitami a ich identifikátormi vrátane skupín tabuliek a riadkov slov, termínov a domén a s nastaveniami vrátane skriptov karty Schéma SQL. Vynecháva to, čo sa líši podľa toho, kto dokument zobrazuje: namerané šírky, poradie prekrývania, zobrazenie, kartu a Zobrazenie názvov. Pri veľkej schéme je rozsiahly. |
| `sql` | Kód DDL pre jednu z ôsmich databáz: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` alebo `SQLite`. Predvolená hodnota argumentu `vendor` je databáza, na ktorú je dokument nastavený. Kód DDL celého dokumentu obsahuje jeho skripty pred tabuľkami a za tabuľkami. S argumentmi `tableIds`, `tableNames` alebo `groupNames` iba tieto tabuľky s cudzími kľúčmi, ktoré obsahujú, a bez skriptov. Cudzie kľúče nesú svoje akcie ON DELETE a ON UPDATE okrem tých, ktoré cieľová databáza vynecháva – pozrite si časť [ON DELETE a ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update). |
| `json` | Celý dokument presne tak, ako ho uloženie zapíše do súboru, vrátane úprav, ktoré editor ešte neuložil – pozrite si časť [Úložná forma a hodnota za behu](../api/advanced/schema.md#storage-form-and-runtime-value). |
| `scripts` | Iba skripty dokumentu pred tabuľkami a za tabuľkami v tvare `{"before":"…","after":"…"}`, každý prázdny, ak nie je nastavený, bez ohľadu na veľkosť schémy. |

Argumenty `vendor`, `statements`, `header`, `logicalNameAsComment`, `tableIds`, `tableNames` a `groupNames` prijíma iba formát `sql` a iný formát ich odmietne.

- `statements`: `create`, predvolená hodnota; `ifNotExists`, ktorá v MySQL, MariaDB, PostgreSQL, SQLite a Databricks zapíše `CREATE TABLE IF NOT EXISTS` a v ostatných obyčajné `CREATE TABLE`; alebo `recreate`, ktorá tabuľky pred vytvorením odstráni, pričom Snowflake namiesto toho zapíše `CREATE OR REPLACE TABLE`.
- `header`: `none`, predvolená hodnota; `use`, ktorá vyberie databázu alebo schému podľa názvu databázy dokumentu; alebo `createAndUse`, ktorá ju najprv vytvorí. Oracle má iba `use`, takže `createAndUse` tam zapíše `use`, a PostgreSQL má iba `createAndUse`, takže `use` tam nezapíše žiadnu hlavičku. SQLite nezapisuje žiadnu a žiadna databáza ju nezapíše, kým je názov databázy prázdny alebo nie je jednoduchým identifikátorom.
- `logicalNameAsComment`: `true` zapíše logický názov tabuľky alebo stĺpca ako komentár, kým je komentár prázdny alebo obsahuje iba prázdne znaky, a to tam a v takom tvare, kde a ako každá databáza zapisuje komentáre, a zachová každý komentár, ktorý obsahuje text; `false`, predvolená hodnota, nezapíše žiadny logický názov – pozrite si časť [Logické názvy ako komentáre](../guide/guides/schema-sql.md#logical-names-as-comments).
- `groupNames`: tabuľky zadaných skupín tabuliek, podľa názvu bez ohľadu na veľkosť písmen, spojené s `tableIds` a `tableNames`. Názov, ktorý nezodpovedá žiadnej skupine, sa odmietne s kódom `notFound`. Skupina, ktorá neobsahuje žiadnu tabuľku, nepridá žiadnu, a čítanie, ktorému nezostane vôbec žiadna tabuľka, napríklad keď je každá zadaná skupina prázdna a nie je zadaná žiadna tabuľka, sa odmietne s kódom `invalidArgs`.

Argumenty `statements`, `header` a `logicalNameAsComment` platia aj pre kód DDL niektorých tabuliek. Fungujú ako možnosti `Statements` a `Header` a prepínač `Write logical names into empty comments` na karte [Schéma SQL](../guide/guides/schema-sql.md#options-panel) editora, hoci karta je na začiatku nastavená na `If not exists` a `CREATE + USE`. Prepínač je na začiatku vypnutý, rovnako ako `logicalNameAsComment`.
Názvy sa uzatvárajú do úvodzoviek podľa typu uloženého v súbore, pri zamknutom nastavení `Bracket Type` podľa zamknutého typu – pozrite si časť [Zamknutie](../guide/guides/settings.md#lock).

### Veľké schémy {#large-schemas}

Fungujú aj schémy so stovkami alebo tisíckami tabuliek.
Čítanie vráti najviac 40 000 znakov, teda menej, ako je hranica, od ktorej Claude Code odloží výsledok nástroja do súboru.

- `erd_list` predvolene vráti stránku so 100 položkami, najprv tabuľky, potom skupiny tabuliek, poznámky, domény, termíny a slová, s jedným spoločným posunom pre všetky, a pomocou polí `nextOffset` a `note` uvedie, kde začína ďalšia stránka. Túto hodnotu `nextOffset` odovzdajte ako `offset` s rovnakým argumentom `query`.
- `query` nájde tabuľky podľa slov v názve, logickom názve alebo komentári tabuľky či stĺpca bez ohľadu na veľkosť písmen. Tabuľky, ktorých názvy alebo logické názvy obsahujú viac z týchto slov, sú na začiatku. Vyhľadávanie neuvádza žiadne skupiny tabuliek, poznámky ani riadky slovníkov.
- `namesOnly` vypíše iba názvy tabuliek, približne 2 000 krátkych názvov v jednej odpovedi.
- `erd_get` a `erd_read` prijímajú okrem identifikátorov aj `tableNames` a `erd_read` prijíma `groupNames`, takže agent požiadaný o dotaz SQL nad veľkou schémou prečíta kód DDL iba tých tabuliek, ktoré potrebuje.
- Aj slovníky prichádzajú po častiach: `erd_list` stránkuje ich riadky za tabuľkami a `erd_get` vráti riadky v plnom rozsahu podľa `domainIds`, `termIds` a `wordIds`.
- `erd_get` uvedie identifikátory a názvy, ktoré neoznačujú nič, v poli `missing` a identifikátory, ktoré sa do jednej odpovede nezmestili, v poli `notReturned` na opätovné vyžiadanie.
- `erd_list_checks` odpovedá po stránkach rovnakým spôsobom – pozrite si časť [Kontroly slovníkov](#dictionary-checks).
- Čítanie, ktoré je pre jednu odpoveď príliš veľké, sa odmietne s kódom `tooLarge` a s návodom, ako ho zúžiť.

### Kontroly slovníkov {#dictionary-checks}

`erd_list_checks` vypíše kontroly z [hárka Kontroly](../guide/guides/dictionary.md#the-checks-sheet) editora v rovnakom poradí: najprv kontroly slov, potom kontroly termínov a domén, každý slovník v poradí, v akom ho zobrazuje jeho hárok, a potom každú tabuľku, za ktorou nasledujú jej stĺpce.
Rovnako ako v hárku sa kontrola vykoná iba vtedy, keď slovník, ktorý číta, obsahuje nejaký riadok. Dokument, ktorého slovníky neobsahujú žiadne slovo, termín ani doménu, sa vôbec nekontroluje: `total` je `0` a uvádza to pole `note`.

- `level`: `error` alebo `warning` iba pre danú úroveň; predvolene obe.
- `tableIds` a `tableNames`: iba kontroly týchto tabuliek a ich stĺpcov, názvy bez ohľadu na veľkosť písmen, čím sa vynechajú vlastné riadky slovníkov. Identifikátor alebo názov, ktorý neoznačuje žiadnu tabuľku, sa odmietne s kódom `notFound`.
- `offset` a `limit`: predvolene stránka so 100 kontrolami, ktorá sa skončí aj tam, kde je jedna odpoveď plná. Kým nasledujú ďalšie, `nextOffset` a `note` uvedú, kde začína ďalšia stránka; odovzdajte túto hodnotu ako `offset` s rovnakými filtrami. Po oprave niektorých kontrol vypíšte zoznam znova od posunu `0`: opravená kontrola zo zoznamu zmizne, takže neskorší posun by preskočil kontroly, ktoré ešte nie sú opravené.

Odpoveď obsahuje `total`, počet kontrol, ktoré filtre ponechajú; `counts`, koľko z nich má každý kód, pričom kód bez kontrol sa vynechá; a stránku ako `checks`.
Každá kontrola uvádza svoje polia `level` a `code` a polia `kind` a `id` svojho objektu: `table`, `column`, `word`, `term` alebo `domain`. Kontrola stĺpca pridáva jeho `tableId` a názov jeho tabuľky ako `table`.
`name` je názov objektu, fyzický názov tabuľky alebo stĺpca, spolu s jeho poľom `logicalName`, ak ho má. `field` je to, čo kontrola číta: `name`, `logicalName` alebo `domainId`. `text` je to, čo tam našla, a `suggestions`, ak slovníky nejaké ponúkajú, je to, čo použiť namiesto toho. Agent tak môže opraviť kontrolu bez volania `erd_get`:

```json
{"level":"warning","code":"physicalNameMismatch","kind":"column","id":"8e1z0q4xk2m7cwd5tfb9h3ynp","tableId":"03h17be2plxpj5n59tqag7ogj","table":"users","name":"id","logicalName":"Member Number","field":"name","text":"id","suggestions":["MBR_NO"]}
```

| `code` | `level` | `Type` v hárku | Čo zisťuje |
| --- | --- | --- | --- |
| `duplicateName` | `error` | `Duplicate name` | Názov, ktorý zdieľajú dva riadky jedného slovníka. Uvedie sa každý z týchto riadkov. |
| `unknownDomain` | `error` | `Unknown domain` | Stĺpec alebo termín prepojený s doménou, ktorú dokument už neuvádza. `text` je názov tejto domény alebo jej identifikátor, ak názov nie je známy. |
| `forbiddenWord` | `error` | `Forbidden word` | Slovo, ktoré niektoré slovo uvádza ako zakázané, v logickom názve tabuľky alebo stĺpca alebo v názve termínu. `suggestions` sú štandardné slová. |
| `unregisteredWord` | `warning` | `Unregistered word` | Text, ktorý neuvádza žiadne slovo, na tých istých miestach. |
| `synonymWord` | `warning` | `Synonym` | Synonymum použité namiesto štandardného slova, na tých istých miestach. `suggestions` sú štandardné slová. |
| `physicalNameMismatch` | `warning` | `Physical name mismatch` | Fyzický názov tabuľky alebo stĺpca, ktorý sa líši od názvu, ktorý dáva termín zodpovedajúci logickému názvu. Návrhom je fyzický názov termínu alebo názov, ktorý zložia jeho slová, ak termín žiadny nemá. |
| `domainTypeMismatch` | `warning` | `Domain type mismatch` | Stĺpec, ktorého typ údajov nie je typom domény, s ktorou je prepojený. `text` je typ stĺpca a návrhom je typ domény. |

Ako jednotlivé kontroly čítajú názov, opisuje časť [Čo zisťujú jednotlivé kontroly](../guide/guides/dictionary.md#what-each-check-finds).

## Nástroje na úpravy {#edit-tools}

Identifikátory pochádzajú z `erd_list` a `erd_get` alebo z poľa `createdIds` volania, ktoré entitu vytvorilo.
Nový identifikátor tvorí 25 malých písmen a číslic, napríklad `03h17be2plxpj5n59tqag7ogj`, zatiaľ čo identifikátor, ktorý dokument už obsahuje, si zachová svoj tvar, preto z tvaru identifikátora nič nevyvodzujte.
Hodnoty `x` a `y` sú ľavý a horný okraj na plátne v pixeloch a farba je hexadecimálna farba CSS, napríklad `#3b82f6`, alebo prázdny reťazec, ktorý farbu odstráni.

### Tabuľky {#tables}

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_table` | | Pridá prázdnu tabuľku na voľné miesto a vráti jej identifikátor v poli `createdIds`. |
| `erd_remove_table` | `tableId` | Odstráni tabuľku spolu s jej stĺpcami, indexmi a každým vzťahom, ktorý sa jej týka. |
| `erd_change_table_name` | `tableId`, `value` | Premenuje tabuľku. Názov sa potom považuje za zapísaný ručne, takže neskorší logický názov ho ponechá tak, ako je, kým nie je prázdny – pozrite si časť [Slovníky](#dictionaries). |
| `erd_change_table_comment` | `tableId`, `value` | Nastaví komentár tabuľky. Prázdny reťazec ho vymaže. |
| `erd_set_table_logical_name` | `tableId`, `value` | Nastaví logický názov tabuľky. Prázdny reťazec ho vymaže a fyzický názov ponechá. Kým je názov tabuľky prázdny alebo bol odvodený, slovníky ho odvodia z logického názvu – pozrite si časť [Slovníky](#dictionaries). Termín tabuľke nedáva žiadnu doménu. |
| `erd_change_table_color` | `tableId`, `color` | Nastaví farbu tabuľky. |
| `erd_move_table` | `tableId`, `x`, `y` | Presunie tabuľku na danú polohu na plátne. |
| `erd_move_tables` | `positions` | Presunie niekoľko tabuliek v jednej úprave, ktorú vráti späť jedno volanie `erd_undo`. Pole `positions` obsahuje `{ tableId, x, y }` pre každú tabuľku, každú tabuľku najviac raz. |
| `erd_sort_tables` | | Rozmiestni všetky tabuľky v riadkoch po plátne, najprv tie s najmenším počtom stĺpcov, rovnako ako ich rozmiestňujú `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` a `erd_import_aml`. Tabuľky skupiny tabuliek zostanú pohromade a rámec každej skupiny sa prispôsobí okolo nich. |

### Stĺpce {#columns}

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Pridá do tabuľky prázdny stĺpec a vráti jeho identifikátor v poli `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Odstráni stĺpce z jednej tabuľky spolu so vzťahmi a položkami indexov, ktoré ich používajú. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Premenuje stĺpec. Názov sa potom považuje za zapísaný ručne, rovnako ako pri tabuľke. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Nastaví typ údajov, napríklad `INT` alebo `VARCHAR(255)`. Kým je zapnuté nastavenie [Synchronizácia typu údajov vo vzťahoch](../guide/guides/settings.md#relationship-datatype-sync), zmena sa šíri po vzťahoch oboma smermi rovnako ako v editore: typ serial sa do cudzích kľúčov dostane ako celočíselný typ, ktorý ukladá, rovnako ako ho kopíruje `erd_add_relationship`, a kľúč typu serial si pri zmene niektorého zo svojich cudzích kľúčov zachová svoj typ, čím sa zmena na ňom zastaví. Zapnutie a vypnutie synchronizácie je na používateľovi a `erd_list` ju hlási ako `relationshipDataTypeSync`. Stĺpec prepojený s doménou sa od nej odpojí, keď sa nastaví na iný typ, ako má doména, a rovnako aj každý stĺpec, ku ktorému sa synchronizácia dostane a ktorého nový typ sa líši od typu jeho vlastnej domény – pozrite si časť [Odpojenie](../guide/guides/dictionary.md#unlinking). |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Nastaví predvolenú hodnotu ako text SQL. Prázdny reťazec ju vymaže. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Nastaví komentár. Prázdny reťazec ho vymaže. |
| `erd_set_column_logical_name` | `tableId`, `columnId`, `value` | Nastaví logický názov stĺpca. Prázdny reťazec ho vymaže a fyzický názov ponechá. Kým je názov stĺpca prázdny alebo bol odvodený, slovníky ho odvodia a stĺpec sa prepojí s doménou termínu a dostane jej typ údajov – pozrite si časť [Slovníky](#dictionaries). |
| `erd_set_column_domain` | `tableId`, `columnId`, `domainId?`, `domainName?` | Prepojí stĺpec s doménou zadanou identifikátorom alebo názvom, jedným z týchto dvoch. Stĺpec prevezme typ údajov domény, ktorý sa šíri po vzťahoch, kým je zapnuté nastavenie Synchronizácia typu údajov vo vzťahoch, s rovnakým odpájaním ako pri `erd_change_column_data_type`. Argument `domainId` s hodnotou `null` alebo prázdny reťazec, prípadne prázdny argument `domainName`, stĺpec od domény odpojí a jeho typ zachová. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | Hodnota `true` zaradí stĺpec do primárneho kľúča, `false` ho z neho vyradí. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Nastaví, či je stĺpec jedinečný. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Nastaví, či je stĺpec `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Nastaví, či má stĺpec automatický prírastok. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Presunie stĺpec v rámci jeho tabuľky na miesto iného stĺpca. |

### Vzťahy {#relationships}

Argument `relationshipType` je kardinalita na konci pri podradenej tabuľke: `ZeroOne`, `ZeroN`, `OneOnly` alebo `OneN`.
Počiatočná tabuľka je nadradená, teda odkazovaná strana, ktorá obsahuje primárny kľúč, a koncová tabuľka je podradená.
Argumenty `onDelete` a `onUpdate` sú akcie ON DELETE a ON UPDATE cudzieho kľúča: `none`, `noAction`, `cascade`, `setNull`, `setDefault` alebo `restrict`.
Hodnota `none` nezapíše žiadnu klauzulu, takže platí predvolené správanie databázy – pozrite si časť [ON DELETE a ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).
Akcia vynechaná v `erd_add_relationship` alebo `erd_link_columns` je `none`.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Prepojí dve tabuľky vzťahom. Skopíruje primárny kľúč nadradenej tabuľky do podradenej ako stĺpce cudzieho kľúča, pričom ak nadradená tabuľka primárny kľúč nemá, najprv vytvorí stĺpec primárneho kľúča. Každý stĺpec cudzieho kľúča dostane názov rovnako, ako ho pomenuje nakreslenie vzťahu v editore: kľúč `id` tabuľky `users` dá `users_id` a kľúč ako `member_id` si zachová svoj názov – pozrite si časť [Názvy stĺpcov cudzích kľúčov](../guide/guides/relationship-editing.md#foreign-key-column-names). Každý skopíruje typ údajov svojho kľúča s výnimkou kľúča typu serial, z ktorého vznikne celočíselný typ, ktorý ukladá, napríklad `integer` pre `serial4`, pričom samotný `serial` mimo PostgreSQL, MySQL a MariaDB zostane `serial` – pozrite si časť [Identifikujúce vzťahy](../guide/guides/relationship-editing.md#identifying-relationships). Každý tiež prevezme logický názov svojho kľúča a prepojí sa s doménou, s ktorou je prepojený jeho kľúč, pokiaľ mu kľúč typu serial nedá iný typ. Pole `createdIds` obsahuje nový stĺpec kľúča, ak sa vytvoril, stĺpce cudzieho kľúča a na konci identifikátor vzťahu. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Nakreslí vzťah medzi už existujúcimi stĺpcami a počiatočné a koncové stĺpce spáruje podľa poradia. Nepremenuje žiadny stĺpec, nezmení žiadny typ údajov a neskopíruje žiadny logický názov ani doménu. |
| `erd_remove_relationship` | `relationshipId` | Odstráni spojnicu vzťahu. Stĺpce cudzieho kľúča vzťahu zostanú v tabuľke. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Zmení kardinalitu vzťahu. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Nastaví akciu ON DELETE vzťahu: čo odstránenie nadradeného riadka urobí s jeho podradenými riadkami. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Nastaví akciu ON UPDATE vzťahu: čo zmena nadradeného kľúča urobí s jeho podradenými riadkami. |

Nástroj `erd_add_relationship` pomenuje stĺpce cudzieho kľúča a skopíruje logické názvy ich kľúčov pri svojom spustení. Neskoršie premenovanie kľúča ani jeho neskorší logický názov sa k nim nedostane, preto najprv pomenujte nadradenú tabuľku a jej primárny kľúč a dajte kľúču jeho logický názov.
Názvy, ktoré dá, sa považujú za zapísané ručne, takže neskorší logický názov ich ponechá tak, ako sú, zatiaľ čo `erd_derive_physical_names` ich vráti slovníkom – pozrite si časť [Slovníky](#dictionaries).

Žiadny nástroj nemení stĺpce existujúceho vzťahu tak, ako to robí dialógové okno [Mapovať stĺpce](../guide/guides/relationship-editing.md#map-columns) editora.
Ak chcete vzťah namapovať na iné stĺpce, spustite nástroj `erd_remove_relationship`, ktorý ponechá jeho stĺpce cudzieho kľúča v tabuľke, a nástroj `erd_link_columns` s požadovanými stĺpcami, a to v jednom volaní `erd_batch`, ktoré vráti späť jedno volanie `erd_undo`.

### Indexy {#indexes}

Identifikátor stĺpca indexu je položka zoznamu stĺpcov indexu, ktorý vráti `erd_get`, nie identifikátor stĺpca tabuľky.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Pridá do tabuľky prázdny index a vráti jeho identifikátor v poli `createdIds`. |
| `erd_remove_index` | `indexId` | Odstráni index. |
| `erd_change_index_name` | `indexId`, `value` | Premenuje index. |
| `erd_set_index_unique` | `indexId`, `value` | Nastaví, či je index jedinečný. |
| `erd_add_index_column` | `indexId`, `columnId` | Pridá do indexu stĺpec jeho tabuľky a vráti identifikátor nového stĺpca indexu. Stĺpec, ktorý už v indexe je, zostane bez zmeny. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Odstráni jeden stĺpec z indexu. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Presunie stĺpec v rámci indexu na miesto iného z jeho stĺpcov. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Nastaví smer zoradenia jedného stĺpca v indexe, `ASC` alebo `DESC`. |

### Poznámky {#memos}

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_memo` | | Pridá prázdnu poznámku na voľné miesto a vráti jej identifikátor v poli `createdIds`. |
| `erd_remove_memo` | `memoId` | Odstráni poznámku. |
| `erd_change_memo_value` | `memoId`, `value` | Nahradí text poznámky. |
| `erd_change_memo_color` | `memoId`, `color` | Nastaví farbu poznámky. |
| `erd_move_memo` | `memoId`, `x`, `y` | Presunie poznámku na danú polohu na plátne. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Zmení veľkosť poznámky. Šírka musí byť aspoň približne `116` pixelov a výška aspoň `100`. Nevytvára záznam v histórii zmien, pretože editor zaznamenáva zmenu veľkosti poznámky iba pri ťahaní. |

Kým sú poznámky skryté cez [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, nástroj `erd_add_memo` poznámku napriek tomu pridá a tá zostane skrytá, kým sa poznámky znova nezobrazia.
Nástroje `erd_list` a `erd_get` uvádzajú aj skryté poznámky.

### Skupiny tabuliek {#table-groups}

Skupina tabuliek je pomenovaný rámec nakreslený za jej tabuľkami a jej farba sa zobrazuje na rámci a na hlavičkách jej tabuliek – pozrite si stránku [Skupiny tabuliek](../guide/guides/table-groups.md).
Tabuľka patrí najviac do jednej skupiny. Nástroje `erd_move_table`, `erd_move_tables` a `erd_move_table_group` nikdy nezmenia, ktoré tabuľky skupina obsahuje, nech tabuľku umiestnia kamkoľvek, zatiaľ čo v editore sa tabuľka pripojí k skupine alebo ju opustí podľa toho, kde sa pustí – pozrite si časť [Pridávanie a odstraňovanie tabuliek](../guide/guides/table-groups.md#adding-and-removing-tables). Nástroje `erd_add_table_group` a `erd_set_table_group` vkladajú tabuľky do skupiny a `erd_remove_table_group` ponechá jej tabuľky mimo akejkoľvek skupiny.
Skupina ukladá obdĺžnik so šírkou aspoň `160` pixelov a výškou aspoň `100` vrátane záhlavia a editor nakreslí rámec zväčšený tak, aby obsiahol každú z jej tabuliek.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Pridá skupinu a vráti jej identifikátor v poli `createdIds`. Zadajte buď `tableIds`, alebo obdĺžnik, teda `x`, `y`, `width` a `height` spolu. S argumentom `tableIds` každá tabuľka opustí skupinu, v ktorej bola, a obdĺžnik sa okolo nich prispôsobí rovnako ako pri [zoskupení vybratých tabuliek](../guide/guides/table-groups.md#grouping-selected-tables). Obdĺžnik zahrnie každú tabuľku, ktorá nepatrí do žiadnej skupiny a ktorej stred leží v ňom, rovnako ako [nakreslenie skupiny](../guide/guides/table-groups.md#drawing-a-group). Prázdny argument `name` ponechá skupinu bez názvu. Jedno volanie `erd_undo` skupinu odstráni a každú tabuľku vráti do skupiny, v ktorej bola. |
| `erd_remove_table_group` | `groupId` | Odstráni skupinu. Jej tabuľky zostanú na svojom mieste, bez skupiny. |
| `erd_change_table_group_name` | `groupId`, `value` | Premenuje skupinu. Prázdny reťazec ju ponechá bez názvu. |
| `erd_change_table_group_color` | `groupId`, `color` | Nastaví farbu skupiny. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Presunie skupinu tak, aby jej obdĺžnik začínal v danom bode, a jej tabuľky o rovnakú vzdialenosť, rovnako ako presunutie myšou za jej záhlavie. Presun, pri ktorom je súčet vodorovného a zvislého posunu menší ako 20 pixelov, nevytvorí záznam v histórii zmien. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Nastaví obdĺžnik skupiny, pričom jej tabuľky zostanú na svojom mieste. Ak sa `x` a `y` vynechajú, roh skupiny sa zachová. Obdĺžnik, ktorý by neobsiahol tabuľky skupiny aj s ich odsadením, sa odmietne so správou, ktorá uvedie oblasť, ktorú musí obsiahnuť. |
| `erd_set_table_group` | `tableIds`, `groupId` | Vloží tabuľky do skupiny, pričom každá opustí skupinu, v ktorej bola. Argument `groupId` s hodnotou `null` alebo prázdny reťazec ich vyradí zo všetkých skupín. |

Kým sú skupiny skryté cez `View Option` → `Table Groups`, tieto nástroje skupiny napriek tomu pridávajú a menia a tie zostanú skryté, kým sa skupiny nezobrazia – pozrite si časť [Skrytie skupín](../guide/guides/table-groups.md#hiding-groups).
Nástroj `erd_sort_tables` drží tabuľky každej skupiny pohromade, `erd_import_dbml` a `erd_import_json` prinášajú skupiny – pozrite si časť [Import](#import) – a `erd_read` zapíše pomocou `groupNames` kód DDL vybraných skupín.
Verzia ERD Editor, ktorá vznikla pred zavedením skupín tabuliek, pri uložení súboru zahodí jeho skupiny, ako to robia rozšírenie pre VS Code pred verziou `4.0.0` a doplnky pre Obsidian a IDE od JetBrains pred verziou `1.0.0` – pozrite si časť [Aktualizácia](./installation.md#updating).

### Slovníky {#dictionaries}

Tieto nástroje upravujú tri slovníky karty [Slovník](../guide/guides/dictionary.md) editora, pomocou ktorých sa z logického názvu tabuľky alebo stĺpca odvodzuje fyzický názov:

- Slovo je štandardné slovo, z ktorého sa skladajú logické názvy, so skratkou, ktorú zapisuje do fyzického názvu, napríklad `Member` a `MBR`.
- Termín je celý logický názov s fyzickým názvom, ktorý dáva, a pri stĺpci s doménou, s ktorou ho prepojí, napríklad `Member Number` s `MBR_NO` a `Identifier`.
- Doména je pomenovaný typ údajov, s ktorým sa prepájajú stĺpce, napríklad `Identifier` pre `INT`.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_add_word` | `name`, `abbreviation`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Pridá slovo na koniec slovníka slov a vráti jeho identifikátor v poli `createdIds`. `synonyms` a `forbiddenWords` sú oddelené čiarkami: iné podoby slova a slová, ktoré sa nesmú použiť namiesto neho. |
| `erd_update_word` | `wordId`, `name?`, `abbreviation?`, `englishName?`, `description?`, `synonyms?`, `forbiddenWords?` | Zmení odovzdané polia a ostatné ponechá. |
| `erd_remove_word` | `wordId` | Odstráni slovo. |
| `erd_add_term` | `name`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Pridá termín na koniec slovníka termínov a vráti jeho identifikátor v poli `createdIds`. Bez argumentu `physicalName` ho zložia slová, ak to dokážu, napríklad `MBR_NO` pre `Member Number`. |
| `erd_update_term` | `termId`, `name?`, `physicalName?`, `domainId?`, `domainName?`, `description?`, `synonyms?` | Zmení odovzdané polia a ostatné ponechá. Argument `name` odovzdaný v čase, keď termín nemá fyzický názov, alebo spolu s prázdnym argumentom `physicalName` zapíše aj fyzický názov, ktorý zložia jeho slová, ak nejaký zložia. |
| `erd_remove_term` | `termId` | Odstráni termín. |
| `erd_add_domain` | `name`, `category?`, `dataType`, `description?` | Pridá doménu na koniec slovníka domén a vráti jej identifikátor v poli `createdIds`. `category` zoskupuje domény, napríklad `Number` alebo `Text`. |
| `erd_update_domain` | `domainId`, `name?`, `category?`, `dataType?`, `description?` | Zmení odovzdané polia a ostatné ponechá. Nová hodnota `dataType` sa dostane ku každému stĺpcu prepojenému s doménou a šíri sa po vzťahoch, kým je zapnuté nastavenie Synchronizácia typu údajov vo vzťahoch, s rovnakým odpájaním ako pri `erd_change_column_data_type`. |
| `erd_remove_domain` | `domainId` | Odstráni doménu. Stĺpce prepojené s ňou si zachovajú svoj typ údajov a tieto stĺpce ani termíny prepojené s ňou nezobrazujú žiadnu doménu: ich `domainId` sa číta ako prázdny reťazec. `erd_undo` prepojenia obnoví a uloženie ich do súboru nezapíše. |
| `erd_derive_physical_names` | `scope`, `tableId?`, `columnId?` | Znova odvodí fyzické názvy z logických názvov, ako to robí príkaz [Znova odvodiť fyzické názvy](../guide/guides/dictionary.md#derive-physical-names-again) v editore, pre jeden stĺpec, jednu tabuľku alebo celý dokument. |

- Slovník obsahuje každý názov iba raz, takže názov, ktorý už má iný riadok toho istého slovníka, sa odmietne s kódom `invalidArgs`. Názvy sa porovnávajú bez medzier na začiatku a na konci a s rozlišovaním veľkosti písmen, takže `Member` a `member` sú dva názvy.
- Aktualizácia označuje riadok jeho identifikátorom a odovzdáva aspoň jedno pole. Hodnoty, ktoré riadok už obsahuje, nič nezmenia a nevytvoria záznam v histórii zmien; pridanie alebo odstránenie ho vytvorí vždy.
- Doména termínu sa zadáva buď argumentom `domainId`, s hodnotou `null` alebo prázdnym reťazcom pre žiadnu doménu, alebo argumentom `domainName`, s prázdnym reťazcom pre žiadnu doménu. Argument `domainName` vyberie prvú doménu s týmto názvom v poradí slovníka, pričom sa porovnáva rovnako ako názvy. Odovzdanie oboch argumentov alebo argumentu `domainName` s názvom, ktorý nemá žiadna doména, sa odmietne. `erd_set_column_domain` prijíma doménu rovnakým spôsobom.
- Zmena alebo odstránenie slova či termínu nič nepremenuje a nič neodpojí: názvy a domény, ktoré dali, zostanú tak, ako sú. `erd_derive_physical_names` názvy znova odvodí a prepojí doménu, ktorú termín dáva teraz, ale stĺpec, ktorému teraz nezodpovedá žiadny termín alebo ktorého termín nedáva žiadnu doménu, si ponechá doménu, s ktorou je prepojený. `erd_set_column_domain` s prázdnym argumentom `domainId` ho od nej odpojí.
- Žiadny nástroj neimportuje ani neexportuje slovník ako súbor CSV, nezoraďuje slovník ani nevkladá riadky na určené miesto, ako to robí karta Slovník.

`erd_list` vypíše riadky, `erd_get` vráti všetky polia, formát `snapshot` nástroja `erd_read` ich obsahuje všetky a `erd_list_checks` vypíše problémy, ktoré nachádzajú slovníky – pozrite si časť [Čítanie dokumentu](#reading-a-document).

`erd_set_table_logical_name` a `erd_set_column_logical_name` odvodzujú fyzický názov rovnako ako editor pri zápise logického názvu – pozrite si časť [Odvodzovanie fyzických názvov](../guide/guides/dictionary.md#deriving-physical-names):

- Názov sa odvodí iba vtedy, keď je prázdny alebo bol sám odvodený, čo čítanie ukazuje ako `nameDerived: true`. Názov, ktorý nie je prázdny a bol zapísaný ručne, zostane a zapíše sa iba logický názov. `erd_change_table_name`, `erd_change_column_name`, importy SQL, GraphQL, DBML a AML a stĺpce cudzieho kľúča, ktoré pomenuje `erd_add_relationship`, zapisujú názvy ako ručne zapísané. Názov premenovaný na prázdny reťazec sa nasledujúcim logickým názvom znova odvodí.
- Prednosť má termín, ktorého názov je logickým názvom, pričom sa porovnáva rovnako ako názvy v slovníkoch. Dá svoj fyzický názov alebo názov, ktorý zložia jeho slová, ak žiadny nemá. Pri stĺpci ho navyše prepojí s doménou termínu, aj keď sa žiadny názov neodvodí, a stĺpec prevezme typ údajov domény, ktorý sa šíri po vzťahoch, kým je zapnuté nastavenie Synchronizácia typu údajov vo vzťahoch.
- Ak taký termín neexistuje, názov zložia slová, pričom ich skratky sa spoja podčiarkovníkmi: `Member Number` dá `MBR_NO`. Platí všetko alebo nič: synonymum, zakázané slovo, text, ktorý neuvádza žiadne slovo, alebo slovo bez skratky nezloží nič a názov zostane taký, aký bol. Slová stĺpec neprepoja so žiadnou doménou a nerobí to ani termín bez domény, takže stĺpec si ponechá doménu, s ktorou je prepojený.
- Stĺpec, ktorého odvodený názov už má iný stĺpec jeho tabuľky, bez ohľadu na veľkosť písmen, si ponechá svoj názov, hodnotu `nameDerived` aj doménu.
- Vymazanie logického názvu ponechá fyzický názov tak, ako je. Volanie, ktorého logický názov a to, čo sa z neho odvodí, už sú na mieste, nič nezmení a nevytvorí záznam v histórii zmien.

`erd_derive_physical_names` prijíma argument `scope`: `column` s `tableId` a `columnId` pre daný stĺpec; `table` s `tableId` pre názov tabuľky a každý jej stĺpec; alebo `document` bez identifikátora pre každú tabuľku a jej stĺpce. Rozsah, ktorému chýba potrebný identifikátor alebo ktorý dostane identifikátor, ktorý neprijíma, sa odmietne.
Každý zahrnutý názov, ktorý má logický názov, sa vráti slovníkom vrátane názvu zapísaného ručne a prevezme to, čo dávajú teraz: fyzický názov termínu a pri stĺpci jeho doménu a typ, alebo inak názov zložený zo slov, ktorý doménu stĺpca ponechá tak, ako je. Logický názov, z ktorého sa nič neodvodí, ponechá názov tak, ako je, pričom hodnota `nameDerived` je teraz `true`. Názov bez logického názvu zostane tak, ako je, a rovnako aj stĺpec, ktorého nový názov má iný stĺpec jeho tabuľky, napríklad druhý cudzí kľúč na tú istú tabuľku, ktorý si ponechá aj svoju hodnotu `nameDerived`. Jedno volanie `erd_undo` vráti späť celé volanie.
Názvy importovanej schémy sú zapísané ručne, preto ju pomenujte podľa slovníkov tak, že nastavíte logické názvy a potom zavoláte `erd_derive_physical_names`. Toto volanie dá vlastný fyzický názov termínu, ktorý zmena slov termínu znova nezloží. Po zmene slov termínu preto najprv aktualizujte termín: odovzdajte jeho argument `name` s prázdnym argumentom `physicalName`, aby ho slová zložili nanovo, alebo odovzdajte novú hodnotu `physicalName`.

Verzia ERD Editor spred zavedenia karty Slovník pri uložení súboru zahodí jeho logické názvy, prepojenia s doménami a riadky slovníkov, ako to robia rozšírenie pre VS Code pred verziou `4.2.0` a doplnky pre Obsidian a IDE od JetBrains pred verziou `1.2.0`. Z nich rozšírenie vo verzii `4.0.0` alebo `4.1.0` a doplnky vo verzii `1.0.0` alebo `1.1.0` stále upravujú naživo so serverom, ale logické názvy, prepojenia s doménami a riadky slovníkov, ktoré zapíše agent, nezobrazujú ani neuchovávajú – pozrite si časť [Aktualizácia](./installation.md#updating).

### Nastavenia {#settings}

Agent mení nastavenia samotnej schémy: databázu, jej názov a skripty karty [Schéma SQL](../guide/guides/schema-sql.md).
Každé ďalšie nastavenie, ktoré dokument ukladá, nastavuje používateľ v editore: [Zobrazenie názvov](../guide/guides/logical-names.md#name-view), prepínače ponuky [Možnosti zobrazenia](../guide/guides/table-related-functions.md#table-view-options), možnosti karty [Nastavenia](../guide/guides/settings.md), jazyk a štýly názvov na karte Generátor kódu, typ úvodzoviek a [zamknutia](../guide/guides/settings.md#lock).
Žiadny nástroj ich nemení okrem importov v režime `replace`: `erd_import_json` prinesie nastavenia a zamknutia dokumentu, ktorý načíta, a ostatné štyri vrátia zobrazenie na začiatok plátna – pozrite si časť [Import](#import).
Server vo verzii `1.0.0` odstránil nástroje, ktoré ich nastavovali: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` a `erd_set_show`.

Nástroj `erd_list` a formát `snapshot` nástroja `erd_read` hlásia nastavenia tak, ako ich ukladá súbor, pričom pole `lockSettings` obsahuje jeden príznak pre každé zamknutie: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase`, `bracketType` a `unlockNameViewMode`.
Posledný z nich sa číta opačne: je `false`, kým je zamknutie `Name View` zapnuté, ako je to v novom dokumente a v súbore uloženom predtým, ako toto zamknutie existovalo, a `true`, keď používateľ zamknutie vypne.
Zamknutý jazyk, štýl názvov alebo typ úvodzoviek sa hlási so zamknutou hodnotou, teda tou, ktorú súbor uchováva a s ktorou sa otvorí každý editor, bez ohľadu na to, čo zobrazuje obrazovka niektorého editora. Zobrazenie, karta ani Zobrazenie názvov sa nehlásia. Agent číta a zapisuje logické názvy bez ohľadu na Zobrazenie názvov.

Nástroj `erd_set_ddl_script` vytvára záznam v histórii zmien. Nástroje `erd_set_database` a `erd_set_database_name` ho nevytvárajú, takže ich `erd_undo` nedokáže vrátiť späť.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_set_database` | `value` | Nastaví databázu: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` alebo `Snowflake`. Určuje typy údajov databázy a kód DDL, ktorý `erd_read` zapíše, keď nie je zadaný argument `vendor`. |
| `erd_set_database_name` | `value` | Nastaví názov databázy, ktorý uvádzajú hlavičky `use` a `createAndUse` nástroja `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Nastaví jeden z dvoch skriptov zapisovaných okolo tabuliek – pozrite si časť [Skripty pred tabuľkami a za nimi](../guide/guides/schema-sql.md#before-and-after-scripts). Argument `position` má hodnotu `before` pre skript zapisovaný pred tabuľky, napríklad `CREATE EXTENSION` alebo `CREATE SCHEMA`, alebo `after` pre skript zapisovaný za ne, napríklad `GRANT` alebo `CREATE VIEW`. Argument `sql` nahradí celý skript, najviac 10 000 znakov, a prázdny reťazec skript odstráni. Aktuálny skript si najprv prečítajte pomocou formátu `scripts` nástroja `erd_read`. |

Skript sa do kódu DDL každej databázy dostane bez zmeny, preto ho píšte pre databázu dokumentu. V MSSQL sa za skript, ktorého posledný riadok nie je `GO`, pridá riadok `GO`.
Verzia ERD Editor, ktorá vznikla pred zavedením týchto skriptov, pri uložení súboru zahodí jeho skripty, ako to robia rozšírenie pre VS Code pred verziou `4.0.0` a doplnky pre Obsidian a IDE od JetBrains pred verziou `1.0.0` – pozrite si časť [Aktualizácia](./installation.md#updating).

### Import {#import}

Tieto nástroje načítajú schému rovnako ako ponuka Importovať v editore – pozrite si stránku [Import a export súborov](../guide/guides/file-import-export.md).
Každý prijíma text ako `value` a režim `mode`: predvolený `replace` alebo `append`.

| Nástroj | Argumenty | Čo robí |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Načíta kód DDL v SQL, teda príkazy `CREATE TABLE` a podobné. |
| `erd_import_graphql` | `value`, `mode?` | Načíta GraphQL SDL. |
| `erd_import_dbml` | `value`, `mode?` | Načíta DBML. Každý blok `TableGroup` sa zmení na skupinu tabuliek, ktoré uvádza – pozrite si časť [DBML](../guide/guides/file-import-export.md#dbml). |
| `erd_import_aml` | `value`, `mode?` | Načíta AML. |
| `erd_import_json` | `value`, `mode?` | Načíta dokument JSON pre erd-editor, napríklad iný súbor `.erd.json`. |

Režim `replace` nahradí dokument a `erd_undo` obnoví predchádzajúci:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` a `erd_import_aml` nahradia všetky tabuľky, vzťahy, indexy, poznámky a skupiny tabuliek. Zachovajú nastavenia dokumentu vrátane zamknutí okrem zobrazenia, ktoré sa vráti na začiatok plátna s priblížením 100 %, a zachovajú aj jeho slovníky slov, termínov a domén. Tabuľky, ktoré prinesú, nemajú logické názvy a nie sú prepojené so žiadnou doménou.
- `erd_import_json` nahradí celý dokument vrátane jeho nastavení a slovníkov: nastavenia, zamknutia, slová, termíny a domény z JSON nahradia tie z tohto dokumentu a JSON, ktorý nezaznamenáva žiadne zamknutia, zapne všetky zamknutia a nastaví zobrazenie na začiatok plátna. Každý, kto dokument zobrazuje, si ponechá vlastné Zobrazenie názvov, pokiaľ JSON nemá vypnuté zamknutie `Name View`, čím prinesie svoje Zobrazenie názvov. Ak chcete zachovať nastavenia tohto dokumentu, vychádzajte z textu, ktorý vráti formát `json` nástroja `erd_read`. Prázdny text vytvorí nový dokument, ako ten, ktorý vytvorí `erd_open_document` s argumentom `create`.

Režim `append` pridá import do dokumentu rovnako ako položka [Importovať a pridať](../guide/guides/file-import-export.md#import-and-add) v editore a jedno volanie `erd_undo` celé pridanie odstráni:

- Obsah textu pribudne ako nové entity s novými identifikátormi v bloku pod všetkým, čo dokument obsahuje, vrátane skrytých poznámok a skupín tabuliek, zarovnanom s jeho ľavým okrajom. Každá tabuľka a nastavenie, ktoré už v dokumente sú, zostanú vrátane tabuľky s rovnakým názvom: nič sa nezlučuje podľa názvu.
- Vzťahy a indexy pribudnú iba v rámci tabuliek, ktoré prinesie import, takže cudzí kľúč na tabuľku, ktorú text nedeklaruje, sa zahodí.
- `erd_import_sql`, `erd_import_graphql` a `erd_import_aml` pridajú tabuľky s ich vzťahmi a indexmi a `erd_import_dbml` navyše aj skupiny tabuliek. `erd_import_json` pridá tabuľky, vzťahy, indexy, poznámky a skupiny tabuliek, nikdy však nie svoje nastavenia, a prázdny text odmietne. Jeho tabuľky a stĺpce prinesú svoje logické názvy, žiadny stĺpec však nie je prepojený s doménou a z JSON sa neprenesie žiadne slovo, termín ani doména.

Dokument JSON si zachová vlastné rozmiestnenie vrátane skupín tabuliek: s režimom `replace` tam, kde svoje tabuľky umiestňuje, a s režimom `append` vo vnútri pridaného bloku.
Tabuľky zo SQL, GraphQL, DBML a AML sa rozmiestnia v riadkoch, najprv tie s najmenším počtom stĺpcov a tabuľky každej skupiny pohromade, rovnako ako ich rozmiestňuje `erd_sort_tables`, nikdy nie rozložením `Flow`, ktorým ich rozloží import priamo v editore, keď je to možné. Tieto štyri nástroje odmietnu prázdny text v oboch režimoch.

## erd_batch {#erd_batch}

Nástroj `erd_batch` spustí niekoľko nástrojov na úpravy postupne ako jednu úpravu, buď všetky, alebo žiadny.

- Pole `operations` obsahuje až 100 položiek, každú v tvare `{ tool, as?, args? }`, kde `tool` je nástroj na úpravy a `args` sú argumenty nástroja bez `path`. Nástroj na čítanie, napríklad `erd_list_checks`, sa odmietne.
- Operácie sa najprv vyskúšajú na kópii dokumentu. Odmietnutá operácia sa uvedie, napríklad `operations[1] erd_remove_table: …`, a nepoužije sa nič.
- Jedno volanie `erd_undo` vráti späť celú dávku okrem operácií, ktoré vrátiť späť nedokáže a ktoré uvádza pole `undoNote` vo výsledku: operácie nástroja, ktorý nevytvára záznam v histórii zmien, napríklad `erd_set_database`, a operácie, ktoré zmenili dokument bez vytvorenia záznamu, napríklad krátky presun pomocou `erd_move_table_group`. Dávku, ktorá nevytvorila vôbec žiadny záznam v histórii zmien, `erd_undo` preskočí. Pole `historyEntries` vo výsledku počíta záznamy histórie editora v rámci dávky, nie volania `erd_undo`.
- V relácii naživo editor prijme buď celú dávku, alebo nič z nej.

Agent pred volaním nemôže poznať identifikátory, ktoré dávka vytvorí, preto operácia pomenovaná pomocou `as` umožní neskoršej operácii odkazovať na ne: `$name` alebo `$name.0` na jej prvý vytvorený identifikátor, `$name.1` na druhý a `$name.last` na posledný.
Názov obsahuje písmená ASCII, číslice a podčiarkovníky, nezačína číslicou a označuje iba jednu operáciu.
Odkaz sa vyhodnotí iba tam, kde argument prijíma identifikátor entity, vrátane `wordId`, `termId` a `domainId`, takže názov alebo komentár so znením `$x` zostane textom.
Aj `domainName` je text, číta sa však až pri spustení svojej operácie, takže môže označovať doménu, ktorú pridala skoršia operácia dávky.

Tabuľka so stĺpcami a vzťahom v jednom volaní:

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

Tabuľka `users` a jej kľúč `id` sa pomenujú pred vytvorením vzťahu, takže stĺpec cudzieho kľúča, ktorý vzťah pridá do tabuľky `orders`, je `users_id`.

Slová, doména a termín a potom tabuľka pomenovaná na ich základe podľa svojich logických názvov:

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

Termín zloží zo svojich slov `MBR_NO` a tabuľka dostane názov `MBR`. Stĺpec `Member Number` prevezme z termínu `MBR_NO` a jeho doménu, takže je prepojený s doménou `Identifier` a má typ `INT`, a stĺpec `Member Name`, ktorému nezodpovedá žiadny termín, sa zloží ako `MBR_NM`.

## Výsledky {#results}

Úprava vráti jeden riadok JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Pole | Význam |
| --- | --- |
| `mode` | `live` alebo `headless` – pozrite si stránku [Live a Headless](./live-and-headless.md). |
| `saved` | `true` vo výsledku každej úpravy a každého volania `erd_batch`, `erd_undo` a `erd_redo` v režime Headless: súbor obsahuje zmenu už v čase, keď volanie odpovie, takže nie je čo ukladať. Výsledok v režime Live pole `saved` nemá, pretože zmenu uchováva editor – pozrite si časť [Ukladanie](./live-and-headless.md#saving). |
| `createdIds` | Identifikátory toho, čo volanie vytvorilo, v poradí. |
| `batches`, `historyEntries` | Koľko dávok zmien volanie odoslalo a koľko záznamov histórie editora vytvorilo. |
| `undoable`, `undoNote` | Pole `undoable` je `false`, keď `erd_undo` volanie preskočí, a `undoNote` uvádza dôvod: nástroj nevytvára záznam v histórii zmien, volanie zmenilo dokument bez vytvorenia záznamu, ako to robí `erd_move_table_group` o menej ako 20 pixelov, alebo dokument už danú hodnotu obsahoval. Výsledok `erd_batch` vždy obsahuje `undoNote`. Keď dávka vytvorila záznam v histórii zmien, `undoNote` uvádza, že jedno volanie `erd_undo` vráti dávku späť, a vymenuje každú operáciu, ktorú ponechá bez zmeny; keď žiadny nevytvorila, výsledok obsahuje `undoable: false` a `undoNote` uvádza, že `erd_undo` ju preskočí. |
| `mismatch` | Uvádza sa, keď volanie vytvorilo iný počet dávok alebo záznamov histórie, ako deklaruje nástroj. |
| `notes` | Uvádza sa, keď sa v relácii niečo zmenilo, napríklad editor skončil alebo prestal obsluhovať dokument, alebo sa zmenil súbor na disku. |

Odmietnutie je chybový výsledok s kódom a správou, ktorá hovorí, čo treba urobiť:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Dôvod |
| --- | --- |
| `notFound` | Identifikátor neoznačuje nič existujúce alebo súbor neexistuje. |
| `invalidArgs` | Argument chýba alebo má nesprávnu hodnotu. |
| `invalidPath` | Cesta neoznačuje dokument ERD. V systéme Windows aj cesta s názvom, ktorý Windows neuloží tak, ako je napísaný, alebo cesta, ktorá vedie k dokumentu, ktorý editor spravuje pod inou cestou, ktorú uvádza správa. |
| `invalidDocument` | Súbor nie je dokument, ktorý editor dokáže prečítať. |
| `tooLarge` | Čítanie sa nezmestí do jednej odpovede. |
| `blocked` | Dokument spravuje editor s vypnutým hubom. Správa uvádza, ako ho zapnúť: vo VS Code dôverujte pracovnému priestoru a zapnite nastavenie `dineug.erd-editor.agentHub.enabled` alebo znova načítajte okno; v aplikácii Obsidian zapnite možnosť Coding agents alebo aplikáciu Obsidian znova načítajte; v IDE od JetBrains zapnite možnosť Coding agents alebo reštartujte IDE, ak je už zapnutá. |
| `hubDisabled` | IDE od JetBrains spravuje dokument iba v rámci projektu, ktorému nedôveruje. Čítanie stále funguje; aby mohol agent upravovať, dôverujte projektu. |
| `conflict` | Súbor sa počas volania zmenil na disku. Nič sa nezapísalo. |
| `hubAppeared`, `hubGone` | Editor začal obsluhovať dokument, ktorý agent upravoval na disku, alebo editor, ktorý ho obsluhoval, stále beží, ale jeho súbor zámku a pripojenie zmizli. Nič sa nezapísalo. |
| `notSaved` | Nástroj `erd_save` nedokázal uložiť dokument editora. |
| `readonly` | Editor spravuje dokument v režime iba na čítanie, napríklad súbor, do ktorého nemôže zapisovať alebo ktorý nedokáže prečítať ako diagram. Bez editora je iba na čítanie samotný súbor, napríklad súbor Perforce alebo TFVC, ktorý nie je otvorený na úpravy (check-out). Nič sa nezapísalo. |
| `protocolMismatch` | Rozšírenie alebo doplnok ERD Editor v editore a server používajú rôzne verzie protokolu, napríklad server vo verzii `1.0.0` alebo novšej s rozšírením pre VS Code vo verzii `3.x`. Odmietne sa aj čítanie a správa uvedie stranu, ktorú treba aktualizovať – pozrite si časť [Aktualizácia](./installation.md#updating). |
| `hubUnreachable`, `timeout`, `disconnected` | Hub editora neprijal pripojenie, neodpovedal do 30 sekúnd alebo počas volania ukončil spojenie. V systéme Windows kód `hubUnreachable` znamená aj to, že Windows nepustil agenta k hubu: editor beží s vyššími právami ako agent, napríklad keď bol spustený ako správca a agent nie, alebo agent beží v izolovanom prostredí (sandbox). |

Ostatné kódy sú zriedkavejšie a každé odmietnutie obsahuje správu, ktorá hovorí, čo sa stalo.

Nástroje na úpravy, `erd_batch` a štyri nástroje na čítanie odmietnu argument, ktorý nedeklarujú, alebo argument nesprávneho typu chybou JSON-RPC invalid params (`-32602`) ešte predtým, ako sa dotknú dokumentu, takže nesprávne napísaný argument sa nikdy potichu nezahodí.
Päť nástrojov relácie ignoruje argumenty, ktoré nepoznajú.
