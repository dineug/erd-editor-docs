---
sidebar_position: 4
description: "Toate instrumentele oferite de serverul MCP erd-editor: citirea unui document câte o pagină, cele 54 de instrumente de editare, erd_batch și cum arată un rezultat și un refuz."
---

# Instrumente

Serverul oferă 63 de instrumente: cinci instrumente de sesiune, trei instrumente de citire, 54 de instrumente de editare, câte unul pentru fiecare operație de editare, și `erd_batch`, care rulează mai multe instrumente de editare ca o singură editare.

Toate instrumentele, cu excepția instrumentului `erd_list_documents`, primesc ca prim argument calea documentului, `path`, iar tabelele de mai jos o omit.
Un argument marcat cu `?` este opțional.

## Instrumente de sesiune {#session-tools}

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_list_documents` | | Listează documentele ERD cu `path`, `open`, `active`, `dirty` și `readonly`: pe cele ale editorului care deservește directorul de lucru și care, într-un IDE JetBrains, cuprinde toate proiectele deschise, altfel fișierele ERD din directorul de lucru. |
| `erd_open_document` | `create?` | Deschide un document pentru editare, în ERD Editor din editorul care îl deservește, dacă există unul. Cu `create`, creează mai întâi fișierul dacă acesta lipsește, iar un nume fără extensie primește `.erd.json`. |
| `erd_save` | | Salvează un document deținut de un editor. VS Code păstrează editările agentului nesalvate până la apelarea acestui instrument; Obsidian și un IDE JetBrains le salvează așa cum le salvează pe ale dumneavoastră, iar acest instrument le scrie imediat. În modul fără interfață, fiecare editare este deja scrisă, iar acest instrument nu face nimic. |
| `erd_undo` | | Anulează ultima editare făcută de acest agent, niciodată pe ale dumneavoastră. Apelurile care nu au creat niciun pas de anulare sunt omise și menționate. |
| `erd_redo` | | Aplică din nou editarea anulată ultima dată de instrumentul `erd_undo`. |

Pentru ce fac salvarea și anularea în fiecare mod, consultați [În direct și fără interfață](./live-and-headless.md).

## Citirea unui document {#reading-a-document}

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_list` | `query?`, `offset?`, `limit?`, `namesOnly?` | Setările și contoarele, apoi o pagină de tabele cu indexurile și relațiile lor, fiecare tabel cu ID-ul, poziția și dimensiunea sa pe pânză, numărul de coloane și grupul de tabele, dacă face parte dintr-unul. În afara unei căutări, după tabele urmează grupurile de tabele, apoi notele. |
| `erd_get` | `tableIds?`, `tableNames?`, `relationshipIds?`, `indexIds?`, `memoIds?`, `tableGroupIds?` | Entitățile indicate, în întregime: tabelele cu coloanele și grupul lor de tabele, relațiile cu coloanele lor și cu `onDelete` și `onUpdate`, indexurile cu coloanele lor, notele cu textul lor, grupurile de tabele cu tabelele lor. |
| `erd_read` | `format`, `vendor?`, `statements?`, `header?`, `tableIds?`, `tableNames?`, `groupNames?` | Întregul document dintr-odată, într-unul dintre cele patru formate, sau doar codul DDL al unor tabele sau grupuri de tabele. |

Un agent găsește ID-urile cu `erd_list`, citește coloanele și alte detalii cu `erd_get` și transmite acele ID-uri instrumentelor de editare.
Dimensiunea unui tabel în `erd_list` este chenarul pe care îl ocupă pe pânză: înălțimea exactă, lățimea aproximativă.
Un grup de tabele este listat prin dreptunghiul pe care îl stochează, cu numele, culoarea și numărul de tabele pe care le conține.
Fiecare relație este listată o singură dată, la unul dintre cele două tabele ale sale.
Setările raportate de `erd_list` și `erd_read` sunt cele salvate în fișier (consultați [Setări](#settings)).

Instrumentul `erd_read` acceptă unul dintre cele patru formate:

| `format` | Ce returnează |
| --- | --- |
| `snapshot` | JSON compact cu fiecare entitate și ID-ul ei, inclusiv grupurile de tabele, și setările cu scripturile filei Schemă SQL. Omite ceea ce diferă de la un utilizator la altul: lățimile măsurate, ordinea de suprapunere, vizualizarea și fila. Voluminos pentru o schemă mare. |
| `sql` | Cod DDL pentru unul dintre cele opt sisteme de baze de date: `Databricks`, `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `Snowflake` sau `SQLite`. Argumentul `vendor` are ca valoare implicită baza de date setată pentru document. Codul DDL al întregului document include scripturile înainte și după tabele. Cu `tableIds`, `tableNames` sau `groupNames`, doar acele tabele, cu cheile străine pe care le conțin, și fără scripturi. Cheile străine includ acțiunile lor ON DELETE și ON UPDATE, cu excepția celor pe care baza de date țintă le omite (consultați [ON DELETE și ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)). |
| `json` | Întregul document exact așa cum o salvare scrie fișierul, inclusiv editările pe care editorul nu le-a salvat încă (consultați [Forma de stocare și valoarea de execuție](../api/advanced/schema.md#storage-form-and-runtime-value)). |
| `scripts` | Doar scripturile înainte și după tabele ale documentului, sub forma `{"before":"…","after":"…"}`, fiecare gol când nu este setat, oricât de mare ar fi schema. |

Doar formatul `sql` acceptă argumentele `vendor`, `statements`, `header`, `tableIds`, `tableNames` și `groupNames`, iar un alt format le refuză.

- `statements`: `create`, valoarea implicită; `ifNotExists`, care scrie `CREATE TABLE IF NOT EXISTS` pentru MySQL, MariaDB, PostgreSQL, SQLite și Databricks și un simplu `CREATE TABLE` pentru celelalte; sau `recreate`, care elimină tabelele înainte de a le crea, caz în care Snowflake scrie în schimb `CREATE OR REPLACE TABLE`.
- `header`: `none`, valoarea implicită; `use`, care selectează baza de date sau schema indicată de numele bazei de date din document; sau `createAndUse`, care o creează mai întâi. Oracle are doar `use`, așa că acolo `createAndUse` scrie `use`, iar PostgreSQL are doar `createAndUse`, așa că acolo `use` nu scrie niciun antet. SQLite nu scrie niciunul, iar nicio bază de date nu scrie unul cât timp numele bazei de date este gol sau nu este un identificator simplu.
- `groupNames`: tabelele grupurilor de tabele indicate, după nume, indiferent de majuscule, reunite cu `tableIds` și `tableNames`. Un nume care nu corespunde niciunui grup este refuzat cu codul `notFound`. Un grup care nu conține niciun tabel nu adaugă niciunul, iar o citire rămasă fără niciun tabel, ca atunci când fiecare grup indicat este gol și nu este indicat niciun tabel, este refuzată cu codul `invalidArgs`.

Argumentele `statements` și `header` se aplică și atunci când codul DDL cuprinde doar unele tabele. Ele funcționează ca opțiunile `Statements` și `Header` ale filei [Schemă SQL](../guide/guides/schema-sql.md#options-panel) din editor, deși fila pornește cu valorile `If not exists` și `CREATE + USE`.
Numele sunt delimitate cu tipul de delimitator salvat în fișier, cel blocat cât timp setarea `Bracket Type` este blocată (consultați [Blocare](../guide/guides/settings.md#lock)).

### Scheme mari {#large-schemas}

Funcționează și schemele cu sute sau mii de tabele.
O citire returnează cel mult 40.000 de caractere, sub pragul de la care Claude Code salvează rezultatul unui instrument separat, într-un fișier.

- `erd_list` returnează implicit o pagină de 100 de intrări, întâi tabelele, apoi grupurile de tabele, apoi notele, și indică unde începe pagina următoare prin `nextOffset` și un câmp `note`. Transmiteți acel `nextOffset` ca `offset`, cu același `query`.
- `query` găsește tabele după cuvintele din numele sau comentariul unui tabel ori al unei coloane, indiferent de majuscule. Tabelele ale căror nume conțin mai multe dintre cuvinte apar primele. O căutare nu listează grupuri de tabele sau note.
- `namesOnly` listează doar numele tabelelor, aproximativ 2.000 de nume scurte într-un singur răspuns.
- `erd_get` și `erd_read` acceptă `tableNames` pe lângă ID-uri, iar `erd_read` acceptă `groupNames`, astfel încât un agent căruia i se cere o interogare SQL pe o schemă mare citește codul DDL doar al tabelelor de care are nevoie.
- `erd_get` listează în `missing` ID-urile și numele care nu desemnează nimic, iar în `notReturned` ID-urile pentru care nu mai este loc într-un răspuns, pentru a fi cerute din nou.
- O citire prea mare pentru un singur răspuns este refuzată cu codul `tooLarge`, cu indicații despre cum poate fi restrânsă.

## Instrumente de editare {#edit-tools}

ID-urile provin din `erd_list` și `erd_get` sau din câmpul `createdIds` al apelului care a creat entitatea.
Un ID nou are 25 de litere mici și cifre, de exemplu `03h17be2plxpj5n59tqag7ogj`, în timp ce un ID pe care documentul îl conține deja își păstrează forma, așa că nu deduceți nimic din forma unui ID.
`x` și `y` sunt marginile din stânga și de sus pe pânză, în pixeli, iar o culoare este o culoare CSS hexazecimală, de exemplu `#3b82f6`, sau un șir de caractere gol, care elimină culoarea.

### Tabele {#tables}

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_table` | | Adaugă un tabel gol într-un loc liber și returnează ID-ul acestuia în `createdIds`. |
| `erd_remove_table` | `tableId` | Elimină un tabel împreună cu coloanele, indexurile și toate relațiile care îl implică. |
| `erd_change_table_name` | `tableId`, `value` | Redenumește un tabel. |
| `erd_change_table_comment` | `tableId`, `value` | Setează comentariul unui tabel. Un șir de caractere gol îl șterge. |
| `erd_change_table_color` | `tableId`, `color` | Setează culoarea unui tabel. |
| `erd_move_table` | `tableId`, `x`, `y` | Mută un tabel într-o poziție de pe pânză. |
| `erd_move_tables` | `positions` | Mută mai multe tabele într-o singură editare, pe care o anulează un singur apel `erd_undo`. `positions` conține `{ tableId, x, y }` pentru fiecare tabel, fiecare tabel cel mult o dată. |
| `erd_sort_tables` | | Plasează toate tabelele pe pânză, pe rânduri, începând cu cele cu cele mai puține coloane, așa cum le plasează `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` și `erd_import_aml`. Tabelele unui grup de tabele rămân împreună, iar chenarul fiecărui grup este ajustat în jurul lor. |

### Coloane {#columns}

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_column` | `tableId` | Adaugă o coloană goală într-un tabel și returnează ID-ul acesteia în `createdIds`. |
| `erd_remove_columns` | `tableId`, `columnIds` | Elimină coloane dintr-un singur tabel, împreună cu relațiile și intrările de index care le folosesc. |
| `erd_change_column_name` | `tableId`, `columnId`, `value` | Redenumește o coloană. |
| `erd_change_column_data_type` | `tableId`, `columnId`, `value` | Setează tipul de date, de exemplu `INT` sau `VARCHAR(255)`. Cât timp [sincronizarea tipului de date în relații](../guide/guides/settings.md#relationship-datatype-sync) este activată, modificarea urmează relațiile în ambele sensuri, ca în editor: un tip serial ajunge la cheile străine ca tipul întreg pe care îl stochează, așa cum îl copiază `erd_add_relationship`, iar o cheie de tip serial își păstrează tipul când una dintre cheile ei străine se modifică, ceea ce oprește modificarea acolo. Activarea sau dezactivarea sincronizării îi revine utilizatorului, iar `erd_list` o raportează ca `relationshipDataTypeSync`. |
| `erd_change_column_default` | `tableId`, `columnId`, `value` | Setează valoarea implicită, ca text SQL. Un șir de caractere gol o șterge. |
| `erd_change_column_comment` | `tableId`, `columnId`, `value` | Setează comentariul. Un șir de caractere gol îl șterge. |
| `erd_set_column_primary_key` | `tableId`, `columnId`, `value` | `true` include coloana în cheia primară, `false` o scoate din ea. |
| `erd_set_column_unique` | `tableId`, `columnId`, `value` | Setează dacă coloana este unică. |
| `erd_set_column_not_null` | `tableId`, `columnId`, `value` | Setează dacă coloana este `NOT NULL`. |
| `erd_set_column_auto_increment` | `tableId`, `columnId`, `value` | Setează dacă coloana are autoincrementare. |
| `erd_move_column` | `tableId`, `columnId`, `targetColumnId` | Mută o coloană în cadrul tabelului său, în poziția altei coloane. |

### Relații {#relationships}

`relationshipType` este cardinalitatea la capătul tabelului copil: `ZeroOne`, `ZeroN`, `OneOnly` sau `OneN`.
Tabelul de început este părintele, partea referită care conține cheia primară, iar tabelul de sfârșit este copilul.
`onDelete` și `onUpdate` sunt acțiunile ON DELETE și ON UPDATE ale cheii străine: `none`, `noAction`, `cascade`, `setNull`, `setDefault` sau `restrict`.
`none` nu scrie nicio clauză, așa că se aplică acțiunea implicită a bazei de date (consultați [ON DELETE și ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update)).
O acțiune omisă în `erd_add_relationship` sau `erd_link_columns` este `none`.

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_relationship` | `startTableId`, `endTableId`, `relationshipType`, `onDelete?`, `onUpdate?` | Leagă două tabele. Copiază cheia primară a părintelui în copil sub formă de coloane cheie străină, creând mai întâi o coloană cheie primară dacă părintele nu are niciuna. Fiecare coloană cheie străină este denumită așa cum o denumește trasarea unei relații în editor: cheia `id` a tabelului `users` dă `users_id`, iar o cheie precum `member_id` își păstrează numele (consultați [Numele coloanelor cheie străină](../guide/guides/relationship-editing.md#foreign-key-column-names)). Fiecare copiază tipul de date al cheii sale, cu excepția faptului că o cheie de tip serial dă tipul întreg pe care îl stochează, de exemplu `integer` pentru `serial4`, iar un simplu `serial` rămâne `serial` pe alte baze de date decât PostgreSQL, MySQL și MariaDB (consultați [Relații identificatoare](../guide/guides/relationship-editing.md#identifying-relationships)). `createdIds` conține noua coloană cheie, dacă a fost creată una, coloanele cheie străină și, la final, ID-ul relației. |
| `erd_link_columns` | `startTableId`, `startColumnIds`, `endTableId`, `endColumnIds`, `relationshipType`, `onDelete?`, `onUpdate?` | Trasează o relație între coloane care există deja, împerechind coloanele de început și de sfârșit după poziție. Nu redenumește nicio coloană și nu modifică niciun tip de date. |
| `erd_remove_relationship` | `relationshipId` | Elimină linia unei relații. Coloanele sale cheie străină rămân în tabel. |
| `erd_change_relationship_type` | `relationshipId`, `relationshipType` | Modifică cardinalitatea unei relații. |
| `erd_change_relationship_on_delete` | `relationshipId`, `onDelete` | Setează acțiunea ON DELETE a unei relații: ce face ștergerea unui rând părinte cu rândurile copil ale acestuia. |
| `erd_change_relationship_on_update` | `relationshipId`, `onUpdate` | Setează acțiunea ON UPDATE a unei relații: ce face modificarea unei chei părinte cu rândurile copil ale acesteia. |

`erd_add_relationship` denumește coloanele cheie străină în momentul rulării, așa că denumiți mai întâi tabelul părinte și cheia sa primară.

Niciun instrument nu modifică coloanele unei relații existente așa cum o face caseta de dialog [Mapare coloane](../guide/guides/relationship-editing.md#map-columns) din editor.
Pentru a mapa o relație pe alte coloane, rulați `erd_remove_relationship`, care lasă coloanele cheie străină ale acesteia în tabel, și `erd_link_columns` cu coloanele dorite, într-un singur `erd_batch`, pe care îl anulează un singur apel `erd_undo`.

### Indexuri {#indexes}

ID-ul unei coloane de index este o intrare din lista de coloane a indexului pe care o returnează `erd_get`, nu ID-ul coloanei din tabel.

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_index` | `tableId` | Adaugă un index gol într-un tabel și returnează ID-ul acestuia în `createdIds`. |
| `erd_remove_index` | `indexId` | Elimină un index. |
| `erd_change_index_name` | `indexId`, `value` | Redenumește un index. |
| `erd_set_index_unique` | `indexId`, `value` | Setează dacă indexul este unic. |
| `erd_add_index_column` | `indexId`, `columnId` | Adaugă o coloană a tabelului indexului și returnează ID-ul noii coloane de index. O coloană aflată deja în index rămâne neschimbată. |
| `erd_remove_index_column` | `indexId`, `indexColumnId` | Elimină o coloană dintr-un index. |
| `erd_move_index_column` | `indexId`, `indexColumnId`, `targetIndexColumnId` | Mută o coloană în cadrul unui index, în poziția altei coloane a acestuia. |
| `erd_set_index_column_order` | `indexId`, `indexColumnId`, `orderType` | Setează ordinea de sortare a unei coloane dintr-un index, `ASC` sau `DESC`. |

### Note {#memos}

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_memo` | | Adaugă o notă goală într-un loc liber și returnează ID-ul acesteia în `createdIds`. |
| `erd_remove_memo` | `memoId` | Elimină o notă. |
| `erd_change_memo_value` | `memoId`, `value` | Înlocuiește textul unei note. |
| `erd_change_memo_color` | `memoId`, `color` | Setează culoarea unei note. |
| `erd_move_memo` | `memoId`, `x`, `y` | Mută o notă într-o poziție de pe pânză. |
| `erd_resize_memo` | `memoId`, `width`, `height` | Redimensionează o notă. Lățimea trebuie să fie de cel puțin aproximativ `116` pixeli, iar înălțimea de cel puțin `100`. Nu creează niciun pas de anulare, deoarece editorul înregistrează redimensionarea unei note doar în urma unei glisări. |

Cât timp notele sunt ascunse cu [View Option](../guide/guides/table-related-functions.md#table-view-options) → `Memos`, `erd_add_memo` adaugă totuși una, iar aceasta rămâne ascunsă până când notele sunt afișate din nou.
`erd_list` și `erd_get` listează și notele ascunse.

### Grupuri de tabele {#table-groups}

Un grup de tabele este un chenar cu nume, afișat în spatele tabelelor sale, iar culoarea lui apare pe chenar și pe antetele tabelelor sale (consultați [Grupuri de tabele](../guide/guides/table-groups.md)).
Un tabel face parte din cel mult un grup. `erd_move_table`, `erd_move_tables` și `erd_move_table_group` nu schimbă niciodată ce tabele conține un grup, oriunde ar plasa un tabel, în timp ce în editor un tabel intră într-un grup sau iese din el acolo unde este lăsat (consultați [Adăugarea și eliminarea tabelelor](../guide/guides/table-groups.md#adding-and-removing-tables)). `erd_add_table_group` și `erd_set_table_group` pun tabele într-un grup, iar `erd_remove_table_group` lasă tabelele grupului în afara oricărui grup.
Un grup stochează un dreptunghi cu o lățime de cel puțin `160` de pixeli și o înălțime de cel puțin `100`, inclusiv bara de titlu, iar editorul afișează chenarul mărit astfel încât să cuprindă fiecare dintre tabelele sale.

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_add_table_group` | `name`, `color?`, `x?`, `y?`, `width?`, `height?`, `tableIds?` | Adaugă un grup și returnează ID-ul acestuia în `createdIds`. Transmiteți fie `tableIds`, fie un dreptunghi: `x`, `y`, `width` și `height` împreună. Cu `tableIds`, fiecare tabel iese din grupul în care se afla, iar dreptunghiul este ajustat în jurul lor, așa cum îl ajustează [gruparea tabelelor selectate](../guide/guides/table-groups.md#grouping-selected-tables). Un dreptunghi preia fiecare tabel care nu face parte din niciun grup și al cărui centru se află în interiorul lui, așa cum face [trasarea unui grup](../guide/guides/table-groups.md#drawing-a-group). Un argument `name` gol lasă grupul fără nume. Un singur apel `erd_undo` elimină grupul și readuce fiecare tabel în grupul în care se afla. |
| `erd_remove_table_group` | `groupId` | Elimină un grup. Tabelele sale rămân unde sunt, în afara oricărui grup. |
| `erd_change_table_group_name` | `groupId`, `value` | Redenumește un grup. Un șir de caractere gol îl lasă fără nume. |
| `erd_change_table_group_color` | `groupId`, `color` | Setează culoarea unui grup. |
| `erd_move_table_group` | `groupId`, `x`, `y` | Mută un grup astfel încât dreptunghiul său să înceapă în acel punct, împreună cu tabelele sale, deplasate cu aceeași distanță, așa cum face glisarea barei sale de titlu. O mutare de sub 20 de pixeli, adunând deplasarea pe orizontală și pe verticală, nu creează niciun pas de anulare. |
| `erd_resize_table_group` | `groupId`, `x?`, `y?`, `width`, `height` | Setează dreptunghiul unui grup, tabelele sale rămânând unde sunt. Dacă `x` și `y` sunt omise, colțul său se păstrează. Un dreptunghi care nu ar cuprinde tabelele grupului cu spațiul lor de margine este refuzat, cu un mesaj care indică chenarul pe care trebuie să-l cuprindă. |
| `erd_set_table_group` | `tableIds`, `groupId` | Pune tabele într-un grup, fiecare ieșind din grupul în care se afla. Un argument `groupId` egal cu `null` sau cu un șir de caractere gol le scoate din orice grup. |

Cât timp grupurile sunt ascunse cu `View Option` → `Table Groups`, aceste instrumente adaugă și modifică totuși grupuri, care rămân ascunse până când grupurile sunt afișate (consultați [Ascunderea grupurilor](../guide/guides/table-groups.md#hiding-groups)).
`erd_sort_tables` păstrează împreună tabelele fiecărui grup, `erd_import_dbml` și `erd_import_json` aduc grupuri (consultați [Import](#import)), iar `erd_read` scrie codul DDL al grupurilor alese cu `groupNames`.
O versiune de ERD Editor anterioară grupurilor de tabele elimină grupurile unui fișier atunci când salvează fișierul, așa cum fac extensia pentru VS Code anterioară versiunii `4.0.0` și pluginurile pentru Obsidian și JetBrains anterioare versiunii `1.0.0` (consultați [Actualizarea](./installation.md#updating)).

### Setări {#settings}

Un agent stabilește setările care țin de schema propriu-zisă: baza de date, numele acesteia și scripturile filei [Schemă SQL](../guide/guides/schema-sql.md).
Orice altă setare stocată de document îi revine utilizatorului, care o stabilește în editor: comutatoarele din [View Option](../guide/guides/table-related-functions.md#table-view-options), opțiunile filei [Setări](../guide/guides/settings.md), limbajul și stilurile de denumire ale generatorului de cod, tipul de delimitator și [blocările](../guide/guides/settings.md#lock).
Niciun instrument nu le modifică, cu excepția importurilor în modul `replace`: `erd_import_json` aduce setările și blocările documentului pe care îl încarcă, iar celelalte patru readuc vizualizarea la începutul pânzei (consultați [Import](#import)).
Versiunea `1.0.0` a serverului a eliminat instrumentele care le setau: `erd_set_language`, `erd_set_table_name_case`, `erd_set_column_name_case`, `erd_set_bracket_type`, `erd_set_relationship_data_type_sync`, `erd_set_relationship_optimization`, `erd_set_column_order`, `erd_set_max_width_comment`, `erd_set_ignore_save_settings` și `erd_set_show`.

`erd_list` și formatul `snapshot` al instrumentului `erd_read` raportează setările așa cum le salvează fișierul, iar câmpul `lockSettings` conține câte un indicator pentru fiecare blocare: `viewport`, `canvasType`, `language`, `tableNameCase`, `columnNameCase` și `bracketType`.
Un limbaj, un stil de denumire sau un tip de delimitator blocat este raportat cu valoarea sa blocată, cea pe care o păstrează fișierul și cu care se deschide orice editor, indiferent de ce afișează ecranul unui editor. Vizualizarea și fila nu sunt raportate.

`erd_set_ddl_script` creează un pas de anulare. `erd_set_database` și `erd_set_database_name` nu creează niciunul, așa că `erd_undo` nu le poate anula.

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_set_database` | `value` | Setează baza de date: `MariaDB`, `MSSQL`, `MySQL`, `Oracle`, `PostgreSQL`, `SQLite`, `Databricks` sau `Snowflake`. Alegerea determină tipurile de date ale bazei de date și codul DDL pe care îl scrie `erd_read` când nu se dă niciun argument `vendor`. |
| `erd_set_database_name` | `value` | Setează numele bazei de date, pe care îl indică antetele `use` și `createAndUse` ale instrumentului `erd_read`. |
| `erd_set_ddl_script` | `position`, `sql` | Setează unul dintre cele două scripturi scrise în jurul tabelelor (consultați [Scripturi înainte și după tabele](../guide/guides/schema-sql.md#before-and-after-scripts)). `position` este `before`, scris înaintea tabelelor, de exemplu `CREATE EXTENSION` sau `CREATE SCHEMA`, sau `after`, scris după ele, de exemplu `GRANT` sau `CREATE VIEW`. `sql` înlocuiește întregul script, de cel mult 10.000 de caractere, iar un șir de caractere gol îl elimină. Citiți mai întâi scriptul curent cu formatul `scripts` al instrumentului `erd_read`. |

Un script intră ca atare în codul DDL al fiecărei baze de date, așa că scrieți-l pentru baza de date a documentului. Pentru MSSQL, se adaugă o linie `GO` după un script a cărui ultimă linie nu este `GO`.
O versiune de ERD Editor anterioară acestor scripturi elimină scripturile unui fișier atunci când salvează fișierul, așa cum fac extensia pentru VS Code anterioară versiunii `4.0.0` și pluginurile pentru Obsidian și JetBrains anterioare versiunii `1.0.0` (consultați [Actualizarea](./installation.md#updating)).

### Import {#import}

Aceste instrumente citesc o schemă așa cum o face meniul Import al editorului (consultați [Importarea sau exportarea fișierelor](../guide/guides/file-import-export.md)).
Fiecare primește textul în argumentul `value`, precum și argumentul `mode`: `replace`, valoarea implicită, sau `append`.

| Instrument | Argumente | Ce face |
| --- | --- | --- |
| `erd_import_sql` | `value`, `mode?` | Încarcă cod DDL SQL, instrucțiuni `CREATE TABLE` și altele asemenea. |
| `erd_import_graphql` | `value`, `mode?` | Încarcă un SDL GraphQL. |
| `erd_import_dbml` | `value`, `mode?` | Încarcă DBML. Fiecare `TableGroup` devine un grup de tabele cu tabelele pe care le enumeră (consultați [DBML](../guide/guides/file-import-export.md#dbml)). |
| `erd_import_aml` | `value`, `mode?` | Încarcă AML. |
| `erd_import_json` | `value`, `mode?` | Încarcă un document JSON erd-editor, de exemplu un alt fișier `.erd.json`. |

Modul `replace` înlocuiește documentul, iar `erd_undo` îl restaurează pe cel de dinainte:

- `erd_import_sql`, `erd_import_graphql`, `erd_import_dbml` și `erd_import_aml` înlocuiesc toate tabelele, relațiile, indexurile, notele și grupurile de tabele. Ele păstrează setările documentului, inclusiv blocările, cu excepția vizualizării, care revine la începutul pânzei, la 100%.
- `erd_import_json` înlocuiește întregul document, inclusiv setările: setările și blocările din JSON le iau locul celor ale acestui document, iar un document JSON care nu înregistrează nicio blocare activează toate blocările și aduce vizualizarea la începutul pânzei. Pentru a păstra setările acestui document, porniți de la textul returnat de formatul `json` al instrumentului `erd_read`. Un text gol dă un document nou, ca cel pe care îl creează `erd_open_document` cu `create`.

Modul `append` adaugă importul la document, așa cum o face funcția [Import și adăugare](../guide/guides/file-import-export.md#import-and-add) a editorului, iar un singur apel `erd_undo` anulează întreaga adăugare:

- Conținutul textului intră ca entități noi, cu ID-uri noi, într-un bloc aflat sub tot ce conține documentul, inclusiv notele ascunse și grupurile de tabele, aliniat la marginea din stânga a acestuia. Fiecare tabel și fiecare setare existente rămân, inclusiv un tabel cu același nume: nimic nu este combinat după nume.
- Relațiile și indexurile sunt preluate doar între tabelele pe care le aduce importul, așa că o cheie străină către un tabel pe care textul nu îl declară este eliminată.
- `erd_import_sql`, `erd_import_graphql` și `erd_import_aml` adaugă tabele cu relațiile și indexurile lor, iar `erd_import_dbml` adaugă în plus grupurile sale de tabele. `erd_import_json` adaugă tabele, relații, indexuri, note și grupuri de tabele, niciodată setările sale, și refuză un text gol.

Un document JSON își păstrează propria aranjare, inclusiv grupurile de tabele: cu `replace`, acolo unde își plasează tabelele, iar cu `append`, în interiorul blocului adăugat.
Tabelele din SQL, GraphQL, DBML și AML sunt dispuse pe rânduri, începând cu cele cu cele mai puține coloane și cu tabelele fiecărui grup împreună, așa cum le plasează `erd_sort_tables`, niciodată prin `Flow`, cum le aranjează, atunci când poate, importul propriu al editorului. Aceste patru instrumente refuză un text gol în oricare dintre moduri.

## erd_batch {#erd_batch}

`erd_batch` rulează mai multe instrumente de editare, în ordine, ca o singură editare: toate sau niciunul.

- `operations` conține până la 100 de intrări, fiecare de forma `{ tool, as?, args? }`, unde `args` sunt argumentele instrumentului fără `path`.
- Operațiile sunt încercate mai întâi pe o copie a documentului. O operație refuzată este indicată, de exemplu `operations[1] erd_remove_table: …`, și nu se aplică nimic.
- Un singur apel `erd_undo` anulează întregul lot, cu excepția operațiilor pe care nu le poate anula, indicate de câmpul `undoNote` al rezultatului: cele ale unui instrument care nu creează niciun pas de anulare, de exemplu `erd_set_database`, și cele care au modificat documentul fără să creeze unul, de exemplu un `erd_move_table_group` scurt. Un lot care nu a creat niciun pas de anulare este omis de `erd_undo`. `historyEntries` din rezultat numără intrările din istoricul editorului din cadrul lotului, nu apelurile `erd_undo`.
- Într-o sesiune în direct, editorul preia fie întregul lot, fie nimic din el.

Un agent nu poate cunoaște ID-urile pe care le creează un lot înainte de apel, așa că o operație denumită cu `as` permite unei operații ulterioare să facă referire la ele: `$name` sau `$name.0` pentru primul ID creat, `$name.1` pentru al doilea și `$name.last` pentru ultimul.
Un nume conține litere ASCII, cifre și caractere de subliniere, nu începe cu o cifră și denumește o singură operație.
O referință este rezolvată doar acolo unde un argument primește ID-ul unei entități, așa că un nume sau un comentariu cu textul `$x` rămâne text.

Un tabel cu coloanele sale și o relație, într-un singur apel:

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

Tabelul `users` și cheia sa `id` sunt denumite înaintea relației, așa că coloana cheie străină pe care aceasta o adaugă în `orders` este `users_id`.

## Rezultate {#results}

O editare răspunde cu o singură linie JSON:

```json
{"tool":"erd_add_table","mode":"live","createdIds":["03h17be2plxpj5n59tqag7ogj"],"batches":1,"historyEntries":1}
```

| Câmp | Semnificație |
| --- | --- |
| `mode` | `live` sau `headless` (consultați [În direct și fără interfață](./live-and-headless.md)). |
| `createdIds` | ID-urile a ceea ce a creat apelul, în ordine. |
| `batches`, `historyEntries` | Câte loturi de modificări a trimis apelul și câte intrări în istoricul editorului a creat. |
| `undoable`, `undoNote` | `undoable` este `false` când `erd_undo` va omite apelul, iar `undoNote` spune de ce: instrumentul nu creează niciun pas de anulare, apelul a modificat documentul fără să creeze unul, cum face un `erd_move_table_group` sub 20 de pixeli, sau documentul conținea deja valoarea. Un rezultat al instrumentului `erd_batch` conține întotdeauna câmpul `undoNote`. Când lotul a creat un pas de anulare, nota spune că un singur apel `erd_undo` anulează lotul și indică orice operație pe care acesta nu o anulează; când nu a creat niciunul, rezultatul conține `undoable: false`, iar nota spune că `erd_undo` îl omite. |
| `mismatch` | Prezent când apelul a creat un număr de loturi sau de intrări în istoric diferit de cel declarat de instrument. |
| `notes` | Prezent când s-a schimbat ceva în sesiune, de exemplu un editor care s-a închis sau a încetat să deservească documentul, ori un fișier care s-a modificat pe disc. |

Un refuz este un rezultat de eroare care conține un cod și un mesaj care spune ce trebuie făcut:

```json
{"error":{"code":"notFound","message":"tableId nope names no live table; read the document for current ids"}}
```

| `code` | Motiv |
| --- | --- |
| `notFound` | Un ID nu desemnează nimic existent sau fișierul nu există. |
| `invalidArgs` | Un argument lipsește sau are o valoare greșită. |
| `invalidPath` | Calea nu este un document ERD. Pe Windows, și o cale cu un nume pe care Windows nu îl stochează așa cum este scris, sau una care ajunge la un document deținut de un editor sub o altă cale, pe care o indică mesajul. |
| `invalidDocument` | Fișierul nu este un document pe care editorul îl poate citi. |
| `tooLarge` | O citire nu încape într-un singur răspuns. |
| `blocked` | Documentul este deținut de un editor cu hubul dezactivat. Mesajul spune cum îl activați: în VS Code, marcați spațiul de lucru drept de încredere și activați setarea `dineug.erd-editor.agentHub.enabled` sau reîncărcați fereastra; în Obsidian, activați opțiunea Coding agents sau reîncărcați Obsidian; într-un IDE JetBrains, activați opțiunea Coding agents sau reporniți IDE-ul dacă opțiunea este activată. |
| `hubDisabled` | Un IDE JetBrains deține documentul doar într-un proiect pe care nu îl consideră de încredere. Citirile funcționează în continuare; marcați proiectul drept de încredere pentru a permite agentului să editeze. |
| `conflict` | Fișierul s-a modificat pe disc în timpul apelului. Nu s-a scris nimic. |
| `hubAppeared`, `hubGone` | Un editor a început să deservească un document pe care agentul îl edita pe disc, sau editorul care îl deservea încă rulează, dar fișierul său de blocare și conexiunea au dispărut. Nu s-a scris nimic. |
| `notSaved` | `erd_save` nu a putut salva documentul editorului. |
| `readonly` | Editorul deține documentul doar în citire, de exemplu un fișier în care nu poate scrie sau pe care nu îl poate citi ca diagramă. Fără editor, fișierul însuși este doar în citire, de exemplu un fișier Perforce sau TFVC pentru care nu s-a făcut check-out. Nu s-a scris nimic. |
| `protocolMismatch` | Extensia sau pluginul ERD Editor al editorului și serverul folosesc versiuni de protocol diferite, de exemplu versiunea `1.0.0` a serverului cu o extensie pentru VS Code `3.x`. Și citirile sunt refuzate, iar mesajul indică partea care trebuie actualizată (consultați [Actualizarea](./installation.md#updating)). |
| `hubUnreachable`, `timeout`, `disconnected` | Hubul unui editor nu a acceptat conexiunea, nu a răspuns în 30 de secunde sau a închis conexiunea în timpul apelului. Pe Windows, `hubUnreachable` înseamnă și că Windows a împiedicat accesul agentului la hub: editorul rulează cu mai multe drepturi decât agentul, ca atunci când a fost pornit ca administrator, iar agentul nu, sau agentul rulează într-un mediu izolat (sandbox). |

Alte coduri sunt mai rare, iar fiecare refuz conține un mesaj care spune ce s-a întâmplat.

Instrumentele de editare, `erd_batch` și cele trei instrumente de citire refuză un argument pe care nu îl declară, sau unul de tip greșit, cu o eroare JSON-RPC de tip invalid params (`-32602`) înainte de a atinge documentul, așa că un argument scris greșit nu este niciodată ignorat în tăcere.
Cele cinci instrumente de sesiune ignoră argumentele pe care nu le cunosc.
