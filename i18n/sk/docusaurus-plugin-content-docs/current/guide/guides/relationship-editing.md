---
sidebar_position: 7
description: Odstránenie vzťahu, zmena jeho typu, nastavenie jeho akcií ON DELETE a ON UPDATE, jeho namapovanie na existujúce stĺpce v dialógovom okne Mapovať stĺpce, čítanie notácie spojníc, práca so vzťahmi N:M a identifikujúcimi vzťahmi a prehľad toho, čo nové stĺpce cudzích kľúčov preberajú zo svojho kľúča a ako sa pomenúvajú.
---

# Úprava vzťahov

Vzťahy sa kreslia z kontextovej ponuky plátna, z panela nástrojov plátna, cez [rýchle vyhľadávanie](./quick-search.md#what-the-palette-lists) alebo klávesovou skratkou – pozrite si stránku [Začíname s úpravami](./editing-start.md).  
Táto stránka opisuje, čo môžete so vzťahom robiť, keď už existuje, ako ho dialógové okno [Mapovať stĺpce](#map-columns) ukončí na stĺpcoch, ktoré podradená tabuľka už má, a ako sa pomenúvajú stĺpce cudzích kľúčov, ktoré pridáva.

## Odstránenie {#deletion}

Vzťah môžete odstrániť z jeho kontextovej ponuky.

![Odstránenie vzťahu z products do reviews z jeho kontextovej ponuky](/img/demo-relationship-remove.webp)

Klávesová skratka na to neexistuje, pretože vzťah sa nevyberá tak ako tabuľka alebo poznámka: klávesy `Delete` a `Backspace`, ktoré odstraňujú vybraté objekty, nikdy neodstránia vzťah samostatne – pozrite si časť [Odstraňovanie tabuliek a poznámok](./table-related-functions.md#table-and-memo-deletion).  
Vzťahy sa odstraňujú aj spolu s tým, čo spájajú: odstránenie tabuľky odstráni všetky vzťahy, ktoré sa jej týkajú, a odstránenie stĺpca odstráni všetky vzťahy, ktoré ho používajú.

## Zmena typu {#type-change}

Typ zmeníte cez položku `Relationship Type` v kontextovej ponuke vzťahu.  
Ponúkajú sa štyri typy a aktuálny je označený začiarknutím:

- Zero One
- Zero N
- One Only
- One N

![Zmena vzťahu zo Zero N na One Only a potom na One N v jeho kontextovej ponuke](/img/demo-relationship-type.webp)

Sú to tie isté štyri typy, s ktorými začínate vytvárať vzťah, každý s vlastnou klávesovou skratkou – pozrite si stránku [Začíname s úpravami](./editing-start.md).

## ON DELETE a ON UPDATE {#on-delete-and-on-update}

Nastavujú sa cez položky `On Delete` a `On Update` v kontextovej ponuke vzťahu, medzi položkami `Relationship Type` a `Map Columns`.  
Každá ponúka tých istých šesť položiek a aktuálna je označená začiarknutím:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

Položka `Not set` nezapíše žiadnu klauzulu, takže platí predvolené nastavenie samotnej databázy. Nový vzťah, nakreslený alebo vytvorený v dialógovom okne [Mapovať stĺpce](#map-columns), má na začiatku obe akcie nastavené na `Not set` a neskorším výberom položky `Not set` sa akcia zruší.  
Obe akcie sú nezávislé: zmena jednej ponechá druhú tak, ako je.  
Spojnica zobrazuje, čo je nastavené – pozrite si časť [Čítanie spojnice](#reading-a-connector).  
Vzťah, ktorý sa skopíruje a prilepí alebo duplikuje spolu so svojimi tabuľkami, si ponechá obe akcie a import schémy SQL, DBML alebo AML prenesie akcie, ktoré súbor deklaruje – pozrite si stránku [Import a export súborov](./file-import-export.md).

![Nastavenie ON DELETE CASCADE a ON UPDATE RESTRICT na vzťahu z orders do order_items z jeho kontextovej ponuky, s menovkou D:C U:R, a potom podržanie ukazovateľa nad spojnicou na zobrazenie oboch akcií](/img/demo-referential-actions.webp)

Každú akciu môžete vybrať pri akejkoľvek databáze.  
Akcia, ktorú vybratá [databáza](./table-related-functions.md#databases) vynechá zo svojej schémy SQL, má vedľa seba tlmené upozornenie, napríklad `not in MySQL`. Položka `Not set` ho nemá nikdy a prepnutie databázy upozornenia aktualizuje.  
Akcia s upozornením zostáva vo vzťahu uložená: spojnica ju zobrazuje a JSON, DBML a AML ju zachovajú, ale schéma SQL pre túto databázu klauzulu vynechá, takže platí predvolené nastavenie databázy.

[Schéma SQL](./schema-sql.md) zapisuje tieto akcie a ostatné vynecháva:

| Databáza | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | žiadne |
| PostgreSQL | všetkých päť | všetkých päť |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | všetkých päť | všetkých päť |

Schéma SQL pre Snowflake navyše zapíše komentár s názvom každej akcie, ktorú vynechá – pozrite si časť [Referenčné akcie](./schema-sql.md#referential-actions).

Ktoré akcie zapisujú ciele typu ORM na karte Generátor kódu, závisí od cieľa aj od vybratej databázy – pozrite si stránku [Generátor kódu](./code-generator.md#on-delete-and-on-update).

## Mapovať stĺpce {#map-columns}

Dialógové okno Mapovať stĺpce priradí kľúču nadradenej tabuľky stĺpce podradenej tabuľky, jeden riadok pre každý stĺpec kľúča.  
Každý riadok buď použije stĺpec, ktorý podradená tabuľka už má, alebo pridá nový stĺpec cudzieho kľúča, takže vzťah môže končiť na stĺpcoch, ktoré už existujú.

![Kreslenie vzťahu Zero N z members do orders, výber Map to existing columns a mapovanie id na existujúci stĺpec member_id](/img/demo-map-columns.webp)

Otvára sa dvoma spôsobmi:

- Počas kreslenia vzťahu cez tlačidlo `Map to existing columns` vedľa podradenej tabuľky – pozrite si časť [Vytvorenie vzťahu](./editing-start.md#relationship-creation). Tlačidlo `Map` potom pridá vzťah kresleného typu.
- Cez položku `Map Columns` v kontextovej ponuke vzťahu, ak chcete zmeniť stĺpce existujúceho vzťahu. Tlačidlo `Save` potom zmenu zapíše. V editore iba na čítanie táto položka nie je k dispozícii.

Podnadpis dialógového okna uvádza obe tabuľky a typ vzťahu, napríklad `users → posts · One N`. Typ sa tu zobrazuje, ale nemení – typ zmeníte podľa časti [Zmena typu](#type-change).

V celom dialógovom okne vrátane upozornení a hlásení pod riadkami a oznámenia, ktorým sa okno zatvára, sa tabuľky a stĺpce pomenúvajú tak, ako ich pomenúva [Zobrazenie názvov](./logical-names.md#beyond-the-canvas).  
Tri veci zostávajú fyzické: každý typ údajov, ktorý je vlastným typom stĺpca a nikdy nie názvom jeho domény; položka `New column: <name>`, ktorá zobrazuje názov, aký dostane nový stĺpec; a riadky, ktoré tlačidlo `Map` na začiatku vyplní, pričom ich páruje podľa názvu, nikdy nie podľa logického názvu.

Pole `References` určuje kľúč, na ktorý vzťah odkazuje: `Primary Key` so stĺpcami v poradí tabuľky, potom `Unique: <column>` pre každý stĺpec označený príznakom `Unique`. Zobrazuje sa, len keď je na výber viac ako jedna možnosť.  
Jedinečný index sa tu za kľúč nepovažuje a stĺpec s príznakom `Unique`, ktorý tvorí celý primárny kľúč, sa neuvádza dvakrát.  
Výber iného kľúča riadky znova vytvorí. Riadok si ponechá svoj výber, kým je daný stĺpec stále v podradenej tabuľke.

Pod nadpismi `Referenced column` a `Foreign key column` zobrazuje každý riadok stĺpec kľúča s jeho typom údajov a zoznam stĺpcov podradenej tabuľky, s ktorými ho možno spárovať:

- Položka `Pick a column` ponechá riadok prázdny.
- Položka `New column: <name>` pridá nový stĺpec cudzieho kľúča. Zobrazený názov je ten, ktorý stĺpec dostane podľa časti [Názvy stĺpcov cudzích kľúčov](#foreign-key-column-names), očíslovaný s ohľadom na stĺpce podradenej tabuľky a ostatné riadky, ktoré pridávajú nový stĺpec. Neponúka sa, keď by bol názov prázdny, napríklad pri kľúči bez názvu.
- Každý stĺpec podradenej tabuľky v tvare `<name> (<data type>)`. Stĺpec, ktorý vybral iný riadok, sa zobrazuje ako `<name> (<data type>) · in use` a nedá sa vybrať, takže žiadne dva riadky nezdieľajú ten istý stĺpec. Stĺpec, ktorý už používa iný vzťah, sa vybrať stále dá, takže napríklad zdieľaný stĺpec `tenant_id` môže slúžiť viacerým vzťahom.

S tlačidlom `Map` je riadok na začiatku vyplnený, len keď práve jeden stĺpec podradenej tabuľky má bez ohľadu na veľkosť písmen názov, ktorý by preň dostal nový stĺpec cudzieho kľúča pred akýmkoľvek číslovaním `_2`, napríklad `users_id` pre `id` v tabuľke `users` a `member_id` pre `member_id`. Kým má nastavenie [`Bracket`](./schema-sql.md#database-and-bracket) hodnotu `None`, ktorá je predvolená, počíta sa aj názov zostavený z tabuľkovej časti názvu tabuľky so schémou, takže `id` v tabuľke `public.users` sa spáruje s `public.users_id` alebo `users_id`. Pri kľúči `Unique` sa počíta aj vlastný názov stĺpca kľúča, takže `vin` sa spáruje s `vin`. Všetky ostatné riadky začínajú na položke `Pick a column`.  
S tlačidlom `Save` začína každý riadok na stĺpci, ktorý vzťah používa teraz. V oboch prípadoch výber iného kľúča v poli `References` vyplní prázdne riadky tohto kľúča podľa rovnakých názvov.

Keď sa typ údajov vybratého stĺpca líši od typu, ktorý nadradený stĺpec dáva cudziemu kľúču, uvedie to upozornenie pod riadkom.  
Keď je zapnutá [Synchronizácia typu údajov vo vzťahoch](./settings.md#relationship-datatype-sync) a nadradený stĺpec má typ údajov, upozornenie znie `<column> becomes <type>`, teda typ, ktorý mapovanie zapíše. Inak znie `Types differ: <parent type> and <child type>` a stĺpec si ponechá svoj typ.

Tlačidlo `Map` alebo `Save` zostáva neaktívne, kým tomu niečo bráni, a hlásenie pod riadkami uvádza, čo to je:

- `Pick a foreign key column for every referenced column`: niektorý riadok je stále prázdny.
- `At least one column must reference a different column`: rekurzívny vzťah, v ktorom každý riadok vyberá svoj vlastný nadradený stĺpec.
- `These columns are already linked by another relationship`: iný vzťah medzi tými istými dvoma tabuľkami spája presne tieto stĺpce.
- `<parent> has no key to reference`: s tlačidlom `Map` nadradená tabuľka nemá ani primárny kľúč, ani stĺpec s príznakom `Unique`.

Tlačidlo `Save` zostáva neaktívne aj vtedy, keď sa mapovanie nelíši od aktuálneho mapovania vzťahu.  
S tlačidlom `Save` sa v riadku zobrazí `(removed)`, keď jeho stĺpec už nie je vo svojej tabuľke. Vyberte iný stĺpec podradenej tabuľky alebo, ak zmizol nadradený stĺpec, vyberte kľúč v poli `References`. S tlačidlom `Map` sa riadok, ktorého vybratý stĺpec bol odstránený, vráti na položku `Pick a column`.

Vzťah, ktorého nadradené stĺpce nie sú presne jedným z kľúčov nadradenej tabuľky, sa otvorí s vybratou dodatočnou možnosťou `Current columns (not a key)` na konci poľa `References`, ktorá tieto stĺpce ponechá tak, ako sú. Keď nadradená tabuľka nemá vôbec žiadny kľúč, je to jediná možnosť a pole `References` sa nezobrazí.  
Hlásenie `The referenced columns are not a key of <parent>` (alebo `<parent> has no key to reference`, keď nadradená tabuľka nemá vôbec žiadny kľúč) je vtedy upozornením, nie chybou: tlačidlo `Save` stále funguje, takže môžete zmeniť stĺpce podradenej tabuľky a odkaz ponechať.  
Vzťah, ktorého dva zoznamy stĺpcov sa nedajú spárovať, napríklad preto, že majú rôznu dĺžku, zobrazí riadky `(invalid)` a tlačidlo `Save` ponechá neaktívne, kým nevyberiete kľúč v poli `References` alebo, ak nadradená tabuľka žiadny nemá, nepridáte do nej primárny kľúč alebo stĺpec s príznakom `Unique`.

Kým je dialógové okno otvorené, sleduje diagram vrátane úprav spolupracovníka alebo programovacieho agenta a zachová, čo ste vybrali.  
Ak sa medzitým zmenia stĺpce vzťahu alebo kľúč, s ktorým sa okno otvorilo, pridá hlásenie `This relationship changed while the dialog was open`.

Čo tlačidlá `Map` a `Save` zapisujú:

- Tlačidlo `Map` pridá vzťah s položkami `On Delete` a `On Update` nastavenými na `Not set`. Tlačidlo `Save` zmení iba stĺpce vzťahu, pričom jeho stranu pri nadradenej tabuľke nasmeruje na kľúč vybratý v poli `References`, a ponechá jeho typ aj ON DELETE a ON UPDATE.
- Riadok `New column` pridá stĺpec na koniec podradenej tabuľky rovnako ako kreslenie: `NOT NULL`, pomenovaný podľa svojho kľúča, s typom údajov, predvolenou hodnotou, komentárom, logickým názvom a doménou kľúča – pozrite si časť [Identifikujúce vzťahy](#identifying-relationships).
- Vybratý stĺpec sa nikdy nepremenuje ani neprepojí s doménou kľúča a jeho príznak `Not Null`, primárny kľúč, príznak `Unique`, predvolená hodnota, komentár a logický názov zostanú tak, ako sú. Jeho typ údajov sa zmení, len keď je zapnuté nastavenie `Relationship DataType Sync` a nadradený stĺpec má typ údajov: prevezme typ, ktorý nadradený stĺpec dáva cudziemu kľúču, pri kľúči typu serial celočíselný typ rovnako ako nový stĺpec, a zmena sa šíri ďalej po vzťahoch tak, ako to robí synchronizácia. Každý stĺpec, ktorému zmena zmení typ, či už je vybratý, alebo bol zasiahnutý cez vzťahy, sa odpojí od svojej [domény](./dictionary.md#domains-and-data-types), keď sa jeho nový typ líši od typu domény.
- Stĺpec, ktorý mapovanie prestane používať, zostane v podradenej tabuľke a už nie je označený ako cudzí kľúč, pokiaľ na ňom stále nekončí iný vzťah.
- Všetko, čo jedno stlačenie tlačidla `Map` alebo `Save` zapíše – vrátane nových stĺpcov, zmien typu a odpojení od domén –, je jeden krok histórie zmien.

Či je vzťah identifikujúci a ako sa kreslí jeho koniec pri nadradenej tabuľke, sa určuje podľa namapovaných stĺpcov podradenej tabuľky rovnako ako pri každom vzťahu. Mapovanie na stĺpce primárneho kľúča podradenej tabuľky ho okamžite urobí identifikujúcim a mapovanie na stĺpec, ktorý povoľuje `NULL`, pridá krúžok na koniec pri nadradenej tabuľke – pozrite si časť [Čítanie spojnice](#reading-a-connector).  
Cudzí kľúč v schéme SQL odkazuje na kľúč, ktorý ste vybrali, napríklad `REFERENCES vehicle (vin)` pri kľúči `Unique`.

Ak diagram už obsahuje toto mapovanie, keď stlačíte tlačidlo `Map` alebo `Save`, pretože vás spolupracovník alebo programovací agent predbehol, nezapíše sa nič.  
Ak sa zmenil tak, že doň mapovanie už nezapadá, nezapíše sa nič a zobrazí sa oznámenie `Couldn't map columns: the diagram changed`.

Tlačidlo `Cancel`, tlačidlo `x`, kláves `Escape` alebo kliknutie na stmavenú oblasť mimo dialógového okna ho zatvorí bez toho, aby sa čokoľvek zapísalo.  
Stmavená oblasť pokrýva celý editor vrátane panela nástrojov a otvorený [prieskumník](./explorer.md#dialogs-beside-it) pod ňou zostane otvorený.  
Dialógové okno zatvorí aj otvorenie rýchleho vyhľadávania, ako aj opustenie karty ERD alebo prepnutie editora do režimu iba na čítanie.  
`Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) ho tiež zatvorí a umiestni textový kurzor do poľa hľadania v [hľadaní](./find-and-replace.md#opening-and-closing) v prieskumníkovi, pričom prieskumník otvorí, ak je zatvorený. V editore, ktorý je príliš úzky na zobrazenie prieskumníka, dialógové okno aj tak zatvorí, ale namiesto presunutia textového kurzora zobrazí oznámenie – pozrite si časť [Otvorenie a zatvorenie](./explorer.md#opening-and-closing).  
Ak sa niektorá z jeho tabuliek alebo vzťah odstráni, kým je otvorené, zatvorí sa s oznámením, napríklad `Map Columns closed: the relationship was removed`.  
Kým je dialógové okno otvorené, klávesové skratky plátna, vrátenie späť a opätovné vykonanie, ako aj kopírovanie a prilepenie nemajú žiadny účinok.

Programovací agent nemá nástroj Mapovať stĺpce. Vzťah premapuje tak, že ho odstráni nástrojom `erd_remove_relationship`, ktorý ponechá jeho stĺpce cudzích kľúčov, a znova ho nakreslí na existujúcich stĺpcoch nástrojom `erd_link_columns`, oboje v jednom volaní `erd_batch` – pozrite si stránku [Nástroje](../../mcp/tools.md#relationships).

## Vzťahy N:M {#nm-relationships}

Keďže editor vychádza z fyzického modelu, vzťah N:M sa vyjadruje pomocou väzobnej tabuľky, ako je znázornené nižšie.

![Kreslenie vzťahov z products a potom z tags do prázdnej tabuľky product_tags pomocou ⌘ + ⌥ + 2, pridanie product_id a potom tag_id](/img/demo-relationship-n-m.webp)

Keď väzobná tabuľka už má svoje kľúčové stĺpce, napríklad `product_id` a `tag_id` v tabuľke `product_tags`, nakreslite každý vzťah pomocou tlačidla `Map to existing columns` a namiesto pridania nových stĺpcov vyberte tieto – pozrite si časť [Mapovať stĺpce](#map-columns). Ak tvoria primárny kľúč väzobnej tabuľky, každý vzťah je okamžite identifikujúci.

Import GraphQL, DBML alebo AML vytvorí väzobnú tabuľku za vás.  
Deklarácia vzťahu mnoho k mnohým sa prenesie ako tabuľka s názvom `<left>_<right>` a komentárom `Junction table inferred from <left> <-> <right>`, pripojená k obom stranám identifikujúcimi vzťahmi.  
Pozrite si stránku [Import a export súborov](./file-import-export.md).

## Identifikujúce vzťahy {#identifying-relationships}

Kreslenie vzťahu kliknutím na podradenú tabuľku alebo tlačidlom `Create new columns` skopíruje každý primárny kľúč nadradenej tabuľky do podradenej tabuľky ako stĺpec cudzieho kľúča s `NOT NULL`, takže nový vzťah je na začiatku neidentifikujúci.  
Kópia prevezme typ údajov, predvolenú hodnotu, komentár a logický názov kľúča, ale nie príznaky `Unique` ani `Auto Increment`, a pomenuje sa podľa časti [Názvy stĺpcov cudzích kľúčov](#foreign-key-column-names).  
Pokiaľ ide o typ údajov, výnimkou je kľúč typu serial: jeho kópia prevezme celočíselný typ, ktorý serial ukladá. Pri akejkoľvek databáze dávajú `smallserial` a `serial2` typ `smallint`, `serial4` dáva `integer` a `bigserial` a `serial8` dávajú `bigint`. Samotný `serial` dáva `integer` pri PostgreSQL a `bigint unsigned` pri MySQL a MariaDB a pri akejkoľvek inej databáze zostáva `serial`.  
Počíta sa iba celý názov typu bez ohľadu na veľkosť písmen, takže `serial(4)` sa skopíruje tak, ako je napísaný. Typ napísaný veľkými písmenami dáva veľké písmená: `SERIAL` dáva pri PostgreSQL `INTEGER`. Stĺpec cudzieho kľúča, ktorý už má v uloženom diagrame typ `serial`, si tento typ ponechá.  
Kópia sa tiež prepojí s [doménou](./dictionary.md#domains-and-data-types) kľúča, ak hárok `Domains` túto doménu v čase vytvorenia kópie obsahuje a kópia si ponechá typ údajov kľúča. Kópia kľúča typu serial, ktorá prevezme celočíselný typ, sa teda neprepojí so žiadnou doménou, zatiaľ čo samotný `serial`, ktorý zostane `serial`, sa s ňou prepojí.  
Ak chcete, aby bol vzťah identifikujúci, nastavte tieto stĺpce cudzích kľúčov v podradenej tabuľke ako primárne kľúče: vyberte ich všetky a raz stlačte `Alt + K` (Windows/Linux) alebo `⌥ + K` (Mac), alebo vyberte položku `Primary Key` v kontextovej ponuke tabuľky, ktorá znie `Primary Key on selected columns`, keď sú vybraté dva alebo viac stĺpcov – pozrite si časť [Primárny kľúč stĺpca](./table-editing.md#column-primary-key).

![Prepínanie product_id ako primárneho kľúča pomocou Alt + K, pri ktorom sa jeho spojnica zmení na plnú a potom na prerušovanú](/img/demo-identifying-relationship.webp)

Editor to udržiava v súlade sám.  
Vzťah je identifikujúci, kým je každý stĺpec na jeho strane pri podradenej tabuľke primárnym kľúčom, a stane sa neidentifikujúcim, hneď ako niektorý z nich primárnym kľúčom nie je.

## Názvy stĺpcov cudzích kľúčov {#foreign-key-column-names}

Pri kreslení vzťahu sa každý pridaný stĺpec cudzieho kľúča pomenuje podľa kľúča nadradenej tabuľky, ktorý tento stĺpec kopíruje:

- Jednoslovný názov kľúča, napríklad `id`, `ID` alebo `uuid`, dostane na začiatok názov nadradenej tabuľky a podčiarkovník: `id` v tabuľke `products` sa zmení na `products_id`.
- Viacslovný názov kľúča, napríklad `member_id`, `userId` alebo `UserID`, sa ponechá tak, ako je.
- Jednoslovný názov kľúča, ktorý je bez ohľadu na veľkosť písmen zhodný s názvom samotnej tabuľky, sa tiež ponechá: `currency` v tabuľke `currency` zostane `currency`. Kľúč, ktorý názov tabuľky iba obsahuje, predponu aj tak dostane: `username` v tabuľke `user` sa zmení na `user_username`.

Názov je jedno slovo, keď obsahuje iba písmená a číslice bez zlomu vo veľkosti písmen.  
Akýkoľvek iný znak ho rozdelí, takže `_id`, `order no` a `order-no` pozostávajú z viacerých slov.  
Rovnako ho rozdelí zlom vo veľkosti písmen, chápaný tak ako v camelCase: malé písmeno, po ktorom nasleduje veľké (`userId`), dve veľké písmená, po ktorých nasleduje malé (`IDCard`, `IDs`), alebo písmeno z písma, ktoré nerozlišuje veľké a malé písmená, napríklad hangul, kana alebo čínske znaky, vedľa písmena, ktoré ich rozlišuje (`회원ID`).  
Číslice slovo nerozdeľujú, takže `id2` a `SHA256` sú jedno slovo. Zloženina napísaná v jednej veľkosti písmen je tiež jedno slovo: `memberid` v tabuľke `members` sa zmení na `members_memberid`.

Názov tabuľky sa použije tak, ako je napísaný, s výnimkou medzier na začiatku a na konci: jeho veľkosť písmen, vnútorné medzery a bodky sa zachovajú, neprevádza sa na jednotné číslo a nastavenia `Table Name Case` a `Column Name Case` na karte Generátor kódu nemajú žiadny vplyv. `Users` s kľúčom `ID` dáva `Users_ID`.  
Každý stĺpec zloženého kľúča sa pomenuje samostatne: `orders` s kľúčom (`tenant_id`, `id`) pridá `tenant_id` a `orders_id`.

Názov, ktorý podradená tabuľka už má, bez ohľadu na veľkosť písmen, sa očísluje pomocou `_2`, `_3` a tak ďalej, pričom sa použije prvé voľné číslo.  
Druhý vzťah z tabuľky `users` s kľúčom `id` do tej istej tabuľky pridá `users_id_2` a rekurzívny vzťah v tabuľke `members` s kľúčom `member_id` pridá `member_id_2`.  
Stĺpce jedného zloženého kľúča sa navzájom číslujú rovnakým spôsobom a názov ponechaný bez zmeny si svoje miesto nárokuje ako prvý: `user` s kľúčom (`id`, `user_id`) pridá `user_id` pre `user_id` a `user_id_2` pre `id`.

Nadradená tabuľka bez názvu ponechá názov kľúča tak, ako je, a pri kolízii sa očísluje ako akýkoľvek iný.  
Kľúč bez názvu dá stĺpec cudzieho kľúča bez názvu.  
Platí to aj pre primárny kľúč, ktorý editor pridá do nadradenej tabuľky, ktorá žiadny nemá, pokiaľ ho nepomenujete pred kliknutím na podradenú tabuľku.

Názvy sa určia pri kreslení vzťahu. Neskoršie premenovanie nadradenej tabuľky alebo jej kľúča ich nepremenuje.  
Riadky `New column` v dialógovom okne [Mapovať stĺpce](#map-columns) sa pomenúvajú podľa rovnakých pravidiel a zoznam zobrazí každý názov ešte predtým, ako ho vyberiete.  
Vzťahy, ktoré prídu s už existujúcimi stĺpcami, si ponechajú názvy, ktoré tieto stĺpce majú – ide o import, prilepenie, duplikovanie alebo párovanie existujúcich stĺpcov v dialógovom okne Mapovať stĺpce.  
Programovací agent, ktorý pridá vzťah nástrojom `erd_add_relationship`, dostane rovnaké názvy, typy údajov, logické názvy a domény – pozrite si stránku [Nástroje](../../mcp/tools.md#relationships).

Stĺpec cudzieho kľúča sa pomenúva podľa svojho kľúča, nikdy nie podľa logického názvu, ktorý skopíruje, a jeho názov sa považuje za vlastný: logický názov, ktorý do stĺpca zapíšete neskôr, ponechá názov nezmenený, pokiaľ názov nie je prázdny – pozrite si časť [Vlastné názvy](./dictionary.md#names-of-your-own).  
Kým skopírovaný logický názov zodpovedá termínu, ktorý dáva iný názov, hárok `Checks` preto uvádza stĺpec pod kontrolou [`Physical name mismatch`](./dictionary.md#what-each-check-finds). Opätovné odvodenie jeho fyzického názvu ho premenuje podľa slovníkov, pokiaľ iný stĺpec podradenej tabuľky už nemá názov, ktorý slovníky dávajú, bez ohľadu na veľkosť písmen – pozrite si časť [Znova odvodiť fyzické názvy](./dictionary.md#derive-physical-names-again).

## Čítanie spojnice {#reading-a-connector}

- Identifikujúci vzťah sa kreslí plnou čiarou, neidentifikujúci prerušovanou čiarou.
- Koniec pri podradenej tabuľke nesie symbol kardinality typu vzťahu: krúžok a čiarku pri Zero One, krúžok a vraní pazúr pri Zero N, dve čiarky pri One Only a čiarku a vraní pazúr pri One N.
- Koniec pri nadradenej tabuľke tvorí krúžok a čiarka ako pri Zero One, keď ktorýkoľvek zo stĺpcov cudzieho kľúča povoľuje `NULL`, a dve čiarky ako pri One Only, keď sú všetky `NOT NULL`.
- Podržanie ukazovateľa nad spojnicou ju zvýrazní spolu so stĺpcami, ktoré spája v oboch tabuľkách.

![Postupné podržanie ukazovateľa nad tromi spojnicami, pričom každá sa zvýrazní spolu so stĺpcami, ktoré spája](/img/demo-relationship-hover.webp)

Vzťah, ktorý má nastavené [ON DELETE alebo ON UPDATE](#on-delete-and-on-update), má vedľa konca pri podradenej tabuľke menovku, napríklad `D:C U:R`: `D:` a akciu ON DELETE, potom `U:` a akciu ON UPDATE, každú iba vtedy, keď je nastavená.  
Akcie sa skracujú podľa notácie nástroja erwin: `C` pre CASCADE, `R` pre RESTRICT, `SN` pre SET NULL, `SD` pre SET DEFAULT a `NA` pre NO ACTION. Vzťah, ktorý nemá nastavenú ani jednu, menovku nemá.  
Menovka leží na strane odvrátenej od podradenej tabuľky, nad čiarou, keď spojnica vychádza z ľavej alebo pravej strany tejto tabuľky, a vpravo od nej, keď vychádza z hornej alebo dolnej strany, tak, aby neprekrývala symbol kardinality.  
Kreslí sa farbou spojnice na malom obdĺžniku vo farbe pozadia plátna a zvýrazňuje sa spolu so svojou spojnicou. Menovky sa kreslia nad všetkými spojnicami, takže čiara, ktorá menovku pretína, vedie pod ňou.  
Zobrazuje akciu uloženú vo vzťahu bez ohľadu na to, čo vybratá databáza zapisuje, takže ON DELETE SET DEFAULT sa aj pri MySQL zobrazí ako `D:SD`.

Podržanie ukazovateľa nad spojnicou, ktorá má nastavenú niektorú z akcií, zobrazí aj bublinový popis s úplným znením klauzúl, po jednej na riadok, napríklad `ON DELETE CASCADE` a `ON UPDATE RESTRICT`.  
Bublinový popis sa zobrazí, aj keď je menovka skrytá.

Prechod na vzťah ho zvýrazní: výber riadka v priečinku `Foreign Keys` tabuľky v [prieskumníkovi](./explorer.md#going-to-a-row) alebo riadka cudzieho kľúča v [prehliadači rozdielov](./table-related-functions.md#going-to-a-change) vykreslí jeho spojnicu a menovku rovnakou farbou ako pri podržaní ukazovateľa. V prehliadači rozdielov zvýrazní spojnicu na každej strane, ktorá vzťah obsahuje, takže pridaný cudzí kľúč zvýrazní iba aktuálnu stranu a odstránený iba uloženú stranu.  
Skok vyberie iba podradenú tabuľku s jej stĺpcami cudzích kľúčov, s aktívnou bunkou na prvom z nich; samotný vzťah sa ani tak nikdy nevyberie. Informácie o tom, kam sa presunie zobrazenie, nájdete v časti [Kam vedie skok](./table-related-functions.md#where-a-jump-lands).  
Zvýraznenie zmizne pri ďalšom stlačení ľavého alebo pravého tlačidla na plátne, či už na prázdnom mieste, tabuľke, poznámke, skupine tabuliek alebo spojnici, a to aj pri stlačení, ktoré výber nezmení. Zmizne aj pri prechode na iný riadok alebo inú zhodu hľadania v prieskumníkovi a takisto pri prechode na iný riadok v prehliadači rozdielov, a to na každej strane, na ktorú tento riadok vedie.  
Posúvanie zobrazenia stredným tlačidlom myši alebo nástrojom Ruka zvýraznenie ponechá, rovnako ako zbalenie alebo rozbalenie riadka v prieskumníkovi alebo prehliadači rozdielov, zrušenie výberu klávesom `Escape` a skok z [rýchleho vyhľadávania](./quick-search.md) alebo cez [tlačidlo na kartičke](./visualization.md#card-buttons) pre externý odkaz v režime Flow.  
Zvýraznenie sa neukladá, nie je v histórii zmien a spolupracovníci ho nevidia.

Skryte spojnice na plátne ERD možnosťou zobrazenia `Relationship` alebo iba ich menovky možnosťou zobrazenia `Referential Actions`, ktorá je predvolene zapnutá – pozrite si časť [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options).  
Pri úrovni priblíženia `70%` a nižšej, pri ktorej sa tabuľky zbalia na svoj názov, sa menovky nekreslia.  
[Export obrázka](./file-import-export.md#image) sa vždy kreslí pri 100 %, takže menovky vykreslí bez ohľadu na priblíženie plátna, pokiaľ ich neskryje možnosť zobrazenia. Pri vypnutej možnosti `Background` je priehľadný aj obdĺžnik za každou menovkou.  
[Režim Flow](./visualization.md#flow-mode) na karte Vizualizácia kreslí spojnice aj pri vypnutej možnosti `Relationship`, každú ako jednu hladkú plnú sivú krivku s rovnakými značkami na koncoch, takže prerušovaná čiara, menovky, bublinový popis, zvýraznenie po skoku a ortogonálne vedenie opísané na tejto stránke platia iba pre plátno ERD. Vzťah z tabuľky na seba samu sa aj v režime Flow zakriví okolo pravého horného rohu – pozrite si časť [Vedenie spojníc](#connector-routing).

## Vedenie spojníc {#connector-routing}

Spojnice sa vedú ortogonálne.  
Trasa obchádza tabuľky, ktoré ležia medzi jej dvoma koncami, namiesto toho, aby ich pretínala, a jej rohy sú zaoblené.  
Každý koniec vychádza zo svojej tabuľky krátkym rovným úsekom, než sa zalomí, takže dve neďaleko od seba ležiace tabuľky, ktorých konce spojnice sú zarovnané, spája jedna rovná čiara namiesto obchádzky.  
Trasy vychádzajúce z tej istej strany tabuľky sa rozložia do samostatných koridorov, aby sa navzájom neprekrývali.  
Obchádzajú sa iba tabuľky: spojnica môže pretínať poznámku alebo rámec skupiny tabuliek a kreslí sa nad skupinami tabuliek a pod tabuľkami a poznámkami.

Vzťah z tabuľky na seba samu sa kreslí ako jedna krivka okolo pravého horného rohu tabuľky, ktorá vychádza z hornej strany na konci pri nadradenej tabuľke a vstupuje do pravej strany na konci pri podradenej tabuľke.  
Ďalšie rekurzívne vzťahy na tej istej tabuľke sa ukladajú zvonka okolo prvého, takže ich krivky nepretínajú jedna druhú ani tabuľku.

Nie je čo nastavovať.  
Trasy sa prepočítajú automaticky vždy, keď sa čokoľvek na plátne presunie alebo zmení veľkosť, takže ich nikdy netreba upravovať ručne.

![Presúvanie tabuľky members myšou nadol a späť, pričom spojnica z orders sa prepína medzi vedením vpravo od categories a okolo jej ľavej strany, každý roh zaoblený](/img/demo-connector-routing.webp)
