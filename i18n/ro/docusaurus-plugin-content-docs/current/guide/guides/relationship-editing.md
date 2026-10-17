---
sidebar_position: 6
description: Ștergeți o relație, schimbați-i tipul, setați-i acțiunile ON DELETE și ON UPDATE, mapați-o pe coloane existente cu caseta de dialog Mapare coloane, citiți notația conectorului, lucrați cu relații N:M și identificatoare și aflați cum se denumesc noile coloane cheie străină.
---

# Editarea relațiilor

Relațiile se trasează din meniul contextual al pânzei, din bara de instrumente a pânzei, din [căutarea rapidă](./quick-search.md#what-the-palette-lists) sau cu o comandă rapidă (consultați [Începerea editării](./editing-start.md)).  
Această pagină descrie ce puteți face cu o relație existentă, cum caseta de dialog [Mapare coloane](#map-columns) o face să se termine pe coloane pe care tabelul copil le are deja și cum se denumesc coloanele cheie străină pe care le adaugă relația.

## Ștergere {#deletion}

Se poate șterge din meniul contextual al relației.

![Ștergerea relației de la products la reviews din meniul ei contextual](/img/demo-relationship-remove.webp)

Nu există o comandă rapidă pentru aceasta, deoarece o relație nu se selectează așa cum se selectează un tabel sau o notă: tastele `Delete` și `Backspace`, care elimină ceea ce este selectat, nu elimină niciodată doar o relație (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)).  
Relațiile se elimină și odată cu ceea ce leagă: ștergerea unui tabel elimină toate relațiile conectate la el, iar ștergerea unei coloane elimină toate relațiile care o folosesc.

## Schimbarea tipului {#type-change}

Tipul se poate schimba prin elementul `Relationship Type` din meniul contextual al relației.  
Sunt oferite patru tipuri, iar cel curent este marcat cu o bifă:

- Zero One
- Zero N
- One Only
- One N

![Schimbarea unei relații din Zero N în One Only și apoi în One N din meniul ei contextual](/img/demo-relationship-type.webp)

Sunt aceleași patru tipuri cu care începeți o relație, fiecare cu propria comandă rapidă (consultați [Începerea editării](./editing-start.md)).

## ON DELETE și ON UPDATE {#on-delete-and-on-update}

Se setează prin elementele `On Delete` și `On Update` din meniul contextual al relației, între `Relationship Type` și `Map Columns`.  
Fiecare oferă aceleași șase elemente, iar cel curent este marcat cu o bifă:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

Opțiunea `Not set` nu scrie nicio clauză, astfel că se aplică comportamentul implicit al bazei de date. O relație nouă, trasată sau creată în caseta de dialog [Mapare coloane](#map-columns), pornește cu ambele acțiuni la `Not set`, iar alegerea ulterioară a opțiunii `Not set` elimină o acțiune.  
Cele două sunt independente: schimbarea uneia o lasă pe cealaltă neschimbată.  
Conectorul arată ce este setat (consultați [Citirea unui conector](#reading-a-connector)).  
O relație copiată și lipită sau duplicată împreună cu tabelele ei păstrează ambele acțiuni, iar importarea unui fișier Schemă SQL, DBML sau AML aduce acțiunile pe care le declară fișierul (consultați [Importarea sau exportarea fișierelor](./file-import-export.md)).

![Setarea ON DELETE CASCADE și ON UPDATE RESTRICT pe relația de la orders la order_items din meniul ei contextual, eticheta ei afișând D:C U:R, apoi trecerea indicatorului pentru a citi ambele acțiuni](/img/demo-referential-actions.webp)

Orice acțiune poate fi aleasă, indiferent de baza de date.  
O acțiune pe care [baza de date](./table-related-functions.md#databases) selectată o omite din codul Schemă SQL are alături o mențiune estompată, de exemplu `not in MySQL`. Opțiunea `Not set` nu are niciodată o astfel de mențiune, iar schimbarea bazei de date actualizează mențiunile.  
O acțiune cu mențiune rămâne totuși stocată în relație: conectorul o arată, iar formatele JSON, DBML și AML o păstrează, dar codul Schemă SQL al acelei baze de date omite clauza, astfel că se aplică comportamentul implicit al bazei de date.

Fila [Schemă SQL](./schema-sql.md) scrie aceste acțiuni și le omite pe celelalte:

| Bază de date | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | niciuna |
| PostgreSQL | toate cele cinci | toate cele cinci |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | toate cele cinci | toate cele cinci |

Pentru Snowflake, codul Schemă SQL scrie și un comentariu care numește fiecare acțiune omisă (consultați [Acțiuni referențiale](./schema-sql.md#referential-actions)).

Ce acțiuni scriu țintele ORM ale generatorului de cod depinde atât de țintă, cât și de baza de date selectată (consultați [Generator de cod](./code-generator.md#on-delete-and-on-update)).

## Mapare coloane {#map-columns}

Caseta de dialog Mapare coloane asociază cheia tabelului părinte cu coloane ale tabelului copil, câte un rând pentru fiecare coloană a cheii.  
Fiecare rând fie folosește o coloană pe care tabelul copil o are deja, fie adaugă o coloană cheie străină nouă, astfel încât o relație se poate termina pe coloane care există deja.

![Trasarea unei relații Zero N de la members la orders, alegerea Map to existing columns și maparea coloanei id pe coloana existentă member_id](/img/demo-map-columns.webp)

Se deschide în două moduri:

- În timpul trasării unei relații, din butonul `Map to existing columns` de lângă tabelul copil (consultați [Crearea relațiilor](./editing-start.md#relationship-creation)). Butonul `Map` adaugă apoi o relație de tipul care se trasează.
- Din elementul `Map Columns` al meniului contextual al relației, pentru a schimba coloanele unei relații existente. Butonul `Save` scrie apoi modificarea. Un editor doar în citire nu afișează acest element.

Subtitlul casetei de dialog numește cele două tabele și tipul relației, de exemplu `users → posts · One N`. Aici tipul este doar afișat, nu și schimbat (folosiți [Schimbarea tipului](#type-change)).

Selectorul `References` alege cheia spre care indică relația: `Primary Key`, cu coloanele ei în ordinea din tabel, apoi `Unique: <column>` pentru fiecare coloană marcată `Unique`. Selectorul apare doar când există mai mult de o opțiune.  
Un index unic nu contează aici drept cheie, iar o coloană marcată `Unique` care constituie întreaga cheie primară nu este listată de două ori.  
Alegerea altei chei reconstruiește rândurile. Un rând își păstrează coloana aleasă cât timp aceasta se află încă în tabelul copil.

Sub titlurile `Referenced column` și `Foreign key column`, fiecare rând arată o coloană a cheii cu tipul ei de date și o listă cu coloanele tabelului copil cu care poate fi asociată:

- Opțiunea `Pick a column` lasă rândul gol.
- Opțiunea `New column: <name>` adaugă o coloană cheie străină nouă. Numele afișat este cel pe care îl va primi coloana, conform descrierii din [Numele coloanelor cheie străină](#foreign-key-column-names), numerotat ținând cont de coloanele tabelului copil și de celelalte rânduri care adaugă o coloană nouă. Opțiunea nu este oferită când numele ar fi gol, ca în cazul unei chei fără nume.
- Fiecare coloană a tabelului copil, sub forma `<name> (<data type>)`. O coloană aleasă de alt rând apare ca `<name> (<data type>) · in use` și nu poate fi aleasă, astfel încât două rânduri nu folosesc niciodată aceeași coloană. O coloană pe care o folosește deja altă relație poate fi totuși aleasă, astfel încât o coloană partajată, de exemplu `tenant_id`, poate servi mai multe relații.

Cu butonul `Map`, un rând pornește completat doar când exact o coloană a tabelului copil, indiferent de majuscule, are numele pe care l-ar primi o coloană cheie străină nouă pentru el înainte de orice numerotare cu `_2`, de exemplu `users_id` pentru `id` din `users` și `member_id` pentru `member_id`. Cât timp opțiunea [`Bracket`](./schema-sql.md#database-and-bracket) este `None`, valoarea implicită, contează și numele construit din partea de tabel a unui nume de tabel calificat cu schema, astfel încât `id` din `public.users` este asociat cu `public.users_id` sau `users_id`. Pentru o cheie `Unique`, contează și numele propriu al coloanei cheii, astfel încât `vin` este asociat cu `vin`. Orice alt rând pornește de la `Pick a column`.  
Cu butonul `Save`, fiecare rând pornește de la coloana pe care o folosește acum relația. În ambele cazuri, alegerea altei chei în `References` completează rândurile goale ale acelei chei după aceleași nume.

Când tipul de date al unei coloane alese diferă de cel pe care coloana părinte îl dă unei chei străine, o mențiune sub rând semnalează acest lucru.  
Cu setarea [Sincronizare tip de date în relații](./settings.md#relationship-datatype-sync) activată și un tip de date pe coloana părinte, mențiunea afișează `<column> becomes <type>`, tipul pe care îl va scrie maparea. Altfel, mențiunea afișează `Types differ: <parent type> and <child type>`, iar coloana își păstrează tipul.

Butonul `Map` sau `Save` rămâne dezactivat cât timp ceva împiedică operația, iar un mesaj sub rânduri spune ce anume:

- `Pick a foreign key column for every referenced column`: un rând este încă gol.
- `At least one column must reference a different column`: o relație autoreferențială în care fiecare rând își alege propria coloană părinte.
- `These columns are already linked by another relationship`: o altă relație dintre aceleași două tabele leagă exact aceste coloane.
- `<parent> has no key to reference`: cu butonul `Map`, tabelul părinte nu are nici cheie primară, nici coloană marcată `Unique`.

Butonul `Save` rămâne dezactivat și până când maparea diferă de cea curentă a relației.  
Cu butonul `Save`, un rând afișează `(removed)` când coloana lui nu mai este în tabelul ei. Alegeți o altă coloană din tabelul copil sau, pentru o coloană părinte care nu mai există, alegeți o cheie în `References`. Cu butonul `Map`, un rând a cărui coloană aleasă este eliminată revine la `Pick a column`.

O relație ale cărei coloane părinte nu formează exact una dintre cheile tabelului părinte se deschide pe o opțiune suplimentară de la sfârșitul selectorului `References`, `Current columns (not a key)`, care păstrează acele coloane așa cum sunt. Când tabelul părinte nu are nicio cheie, aceasta este singura opțiune, iar selectorul `References` nu este afișat.  
În acest caz, mesajul `The referenced columns are not a key of <parent>`, sau `<parent> has no key to reference` când tabelul părinte nu are nicio cheie, este o informare, nu o eroare: butonul `Save` funcționează în continuare, astfel încât puteți schimba coloanele copil și păstra referința.  
O relație ale cărei două liste de coloane nu pot fi asociate, de exemplu pentru că au lungimi diferite, afișează rânduri `(invalid)` și păstrează butonul `Save` dezactivat până când alegeți o cheie în `References` sau adăugați tabelului părinte o cheie primară ori o coloană marcată `Unique`, dacă nu are niciuna.

Cât timp este deschisă, caseta de dialog urmărește diagrama, inclusiv editările unui colaborator sau ale unui agent de programare, și păstrează ce ați ales.  
Dacă între timp se schimbă coloanele relației sau cheia pe care s-a deschis, caseta adaugă mesajul `This relationship changed while the dialog was open`.

Ce scriu butoanele `Map` și `Save`:

- Butonul `Map` adaugă relația cu `On Delete` și `On Update` la `Not set`. Butonul `Save` schimbă doar coloanele relației, îndreptând partea ei părinte spre cheia aleasă în `References`, și îi păstrează tipul și acțiunile ON DELETE și ON UPDATE.
- Un rând `New column` adaugă o coloană la sfârșitul tabelului copil, la fel ca trasarea: `NOT NULL`, denumită după cheia ei, cu tipul de date, valoarea implicită și comentariul cheii (consultați [Relații identificatoare](#identifying-relationships)).
- O coloană aleasă nu este niciodată redenumită, iar indicatorii ei `Not Null`, cheie primară și `Unique`, valoarea implicită și comentariul rămân așa cum sunt. Tipul ei de date se schimbă doar cât timp setarea `Relationship DataType Sync` este activată și coloana părinte are un tip de date: preia tipul pe care coloana părinte îl dă unei chei străine, tipul întreg pentru o cheie de tip serial, ca la o coloană nouă, iar modificarea se propagă de-a lungul relațiilor așa cum o face sincronizarea.
- O coloană pe care maparea nu o mai folosește rămâne în tabelul copil și nu mai este marcată drept cheie străină, cu excepția cazului în care o altă relație se termină încă pe ea.
- Tot ce scrie o singură apăsare pe `Map` sau `Save`, inclusiv coloanele noi și schimbările de tip, reprezintă un singur pas de anulare.

Dacă relația este identificatoare și cum este desenat capătul ei părinte se deduc din coloanele copil mapate, ca la orice relație. Maparea pe coloanele cheii primare ale tabelului copil o face imediat identificatoare, iar maparea pe o coloană care permite `NULL` pune un cerc la capătul părinte (consultați [Citirea unui conector](#reading-a-connector)).  
Cheia străină din codul Schemă SQL referă cheia pe care ați ales-o, de exemplu `REFERENCES vehicle (vin)` pentru o cheie `Unique`.

Dacă diagrama conține deja maparea când apăsați `Map` sau `Save`, pentru că un colaborator sau un agent de programare a făcut-o primul, nu se scrie nimic.  
Dacă diagrama s-a modificat astfel încât maparea nu se mai potrivește, nu se scrie nimic, iar o notificare afișează `Couldn't map columns: the diagram changed`.

Butonul `Cancel`, butonul `x`, tasta `Escape` sau un clic pe zona estompată din afara casetei de dialog o închid fără să scrie nimic.  
Zona estompată acoperă întregul editor, inclusiv bara de instrumente, iar [exploratorul](./explorer.md#dialogs-beside-it), dacă este deschis, rămâne deschis sub ea.  
Deschiderea căutării rapide închide și ea caseta de dialog, la fel ca părăsirea filei ERD sau trecerea editorului în modul doar în citire.  
Și `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) o închide, punând cursorul de text în câmpul Găsire al [căutării](./find-and-replace.md#opening-and-closing) din explorator și deschizând exploratorul dacă este închis. Într-un editor prea îngust pentru a afișa exploratorul, combinația închide totuși caseta de dialog, dar afișează o notificare în loc să mute cursorul de text (consultați [Deschiderea și închiderea](./explorer.md#opening-and-closing)).  
Dacă relația sau unul dintre tabelele ei este eliminat cât timp caseta este deschisă, aceasta se închide cu o notificare, de exemplu `Map Columns closed: the relationship was removed`.  
Cât timp caseta este deschisă, comenzile rapide ale pânzei, anularea și refacerea, precum și copierea și lipirea nu au niciun efect.

Un agent de programare nu are un instrument Mapare coloane. El remapează o relație eliminând-o cu instrumentul `erd_remove_relationship`, care îi păstrează coloanele cheie străină, și trasând-o din nou pe coloane existente cu instrumentul `erd_link_columns`, ambele într-un singur apel `erd_batch` (consultați [Instrumente](../../mcp/tools.md#relationships)).

## Relații N:M {#nm-relationships}

Deoarece editorul se bazează pe modelul fizic, o relație N:M se exprimă printr-un tabel de legătură, după cum se arată mai jos.

![Trasarea relațiilor de la products și apoi de la tags spre tabelul gol product_tags cu ⌘ + ⌥ + 2, cu adăugarea coloanelor product_id și apoi tag_id](/img/demo-relationship-n-m.webp)

Când tabelul de legătură are deja coloanele cheie, de exemplu `product_id` și `tag_id` în `product_tags`, trasați fiecare relație cu `Map to existing columns` și alegeți acele coloane în loc să adăugați altele noi (consultați [Mapare coloane](#map-columns)). Dacă ele formează cheia primară a tabelului de legătură, fiecare relație este imediat identificatoare.

Importarea unui fișier GraphQL, DBML sau AML creează tabelul de legătură în locul dumneavoastră.  
O declarație mulți-la-mulți devine un tabel numit `<left>_<right>`, cu comentariul `Junction table inferred from <left> <-> <right>`, legat de ambele părți prin relații identificatoare.  
Consultați [Importarea sau exportarea fișierelor](./file-import-export.md).

## Relații identificatoare {#identifying-relationships}

Trasarea unei relații prin clic pe tabelul copil sau cu `Create new columns` copiază fiecare cheie primară a tabelului părinte în tabelul copil ca o coloană cheie străină `NOT NULL`, astfel încât o relație nouă pornește ca neidentificatoare.  
Copia preia tipul de date, valoarea implicită și comentariul cheii, dar nu și `Unique` sau `Auto Increment`, și este denumită conform descrierii din [Numele coloanelor cheie străină](#foreign-key-column-names).  
O cheie de tip serial este excepția în privința tipului de date: copia ei preia tipul întreg pe care îl stochează tipul serial. Indiferent de baza de date, `smallserial` și `serial2` dau `smallint`, `serial4` dă `integer`, iar `bigserial` și `serial8` dau `bigint`. Un `serial` simplu dă `integer` în PostgreSQL și `bigint unsigned` în MySQL și MariaDB și rămâne `serial` în orice altă bază de date.  
Contează doar numele întreg al tipului, indiferent de majuscule, astfel încât `serial(4)` este copiat așa cum este scris. Un tip scris cu majuscule dă majuscule: `SERIAL` dă `INTEGER` în PostgreSQL. O coloană cheie străină care are deja tipul `serial` într-o diagramă salvată își păstrează acest tip.  
Pentru a face relația identificatoare, setați acele coloane cheie străină din tabelul copil drept chei primare: selectați-le pe toate și apăsați o dată `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac) ori alegeți elementul `Primary Key` din meniul contextual al tabelului, care devine `Primary Key on selected columns` când sunt selectate două sau mai multe (consultați [Cheie primară pe coloană](./table-editing.md#column-primary-key)).

![Comutarea cheii primare pe product_id cu Alt + K, care face conectorul continuu, apoi întrerupt](/img/demo-identifying-relationship.webp)

Editorul menține singur această corespondență.  
O relație este identificatoare cât timp fiecare coloană de pe partea ei copil este cheie primară și devine neidentificatoare de îndată ce una dintre ele nu este.

## Numele coloanelor cheie străină {#foreign-key-column-names}

Trasarea unei relații denumește fiecare coloană cheie străină pe care o adaugă după cheia părinte pe care o copiază acea coloană:

- Un nume de cheie dintr-un singur cuvânt, de exemplu `id`, `ID` sau `uuid`, primește în față numele tabelului părinte și o liniuță de subliniere: `id` din `products` devine `products_id`.
- Un nume de cheie din mai multe cuvinte, de exemplu `member_id`, `userId` sau `UserID`, se păstrează așa cum este.
- Un nume de cheie dintr-un singur cuvânt care este chiar numele tabelului, indiferent de majuscule, se păstrează și el: `currency` din `currency` rămâne `currency`. O cheie care doar conține numele tabelului primește totuși prefixul: `username` din `user` devine `user_username`.

Un nume este un singur cuvânt când conține doar litere și cifre, fără nicio trecere între litere mici și majuscule.  
Orice alt caracter îl împarte, astfel încât `_id`, `order no` și `order-no` sunt mai multe cuvinte.  
La fel îl împarte și o trecere între litere mici și majuscule, interpretată ca în camelCase: o literă mică urmată de o majusculă (`userId`), două majuscule urmate de o literă mică (`IDCard`, `IDs`) sau o literă dintr-o scriere fără majuscule, de exemplu Hangul, kana sau Han, lângă o literă dintr-o scriere cu majuscule (`회원ID`).  
Cifrele nu împart un cuvânt, astfel încât `id2` și `SHA256` sunt un singur cuvânt. Un compus scris numai cu litere mici sau numai cu majuscule este și el un singur cuvânt: `memberid` din `members` devine `members_memberid`.

Numele tabelului este folosit așa cum este scris, cu excepția spațiilor de la capete: majusculele, spațiile interioare și punctele se păstrează, numele nu este trecut la singular, iar setările `Table Name Case` și `Column Name Case` ale generatorului de cod nu au niciun rol. `Users` cu cheia `ID` dă `Users_ID`.  
Fiecare coloană a unei chei compuse este denumită separat: `orders` cu cheia (`tenant_id`, `id`) adaugă `tenant_id` și `orders_id`.

Un nume pe care tabelul copil îl are deja, indiferent de majuscule, este numerotat cu `_2`, `_3` și așa mai departe, luând primul număr liber.  
O a doua relație de la `users`, cu cheia `id`, spre același tabel adaugă `users_id_2`, iar o relație autoreferențială pe `members`, cu cheia `member_id`, adaugă `member_id_2`.  
Coloanele aceleiași chei compuse sunt numerotate în același mod una față de cealaltă, iar un nume păstrat așa cum este are întâietate: `user` cu cheia (`id`, `user_id`) adaugă `user_id` pentru `user_id` și `user_id_2` pentru `id`.

Un tabel părinte fără nume lasă numele cheii așa cum este, numerotat ca oricare altul în caz de conflict.  
O cheie fără nume dă o coloană cheie străină fără nume.  
Acest lucru include cheia primară pe care editorul o adaugă unui tabel părinte care nu are niciuna, cu excepția cazului în care o denumiți înainte de a face clic pe tabelul copil.

Numele se stabilesc când este trasată relația. Redenumirea ulterioară a tabelului părinte sau a cheii lui nu le redenumește.  
Rândurile `New column` din caseta de dialog [Mapare coloane](#map-columns) sunt denumite după aceleași reguli, iar lista arată fiecare nume înainte să-l alegeți.  
Relațiile care sosesc cu coloanele deja existente – dintr-un import, o lipire, o duplicare sau din caseta de dialog Mapare coloane când asociază coloane existente – păstrează numele pe care le au acele coloane.  
Un agent de programare care adaugă o relație cu instrumentul `erd_add_relationship` obține aceleași nume și tipuri de date (consultați [Instrumente](../../mcp/tools.md#relationships)).

## Citirea unui conector {#reading-a-connector}

- O relație identificatoare este desenată ca linie continuă, iar una neidentificatoare ca linie întreruptă.
- Capătul copil poartă simbolul de cardinalitate al tipului de relație: un cerc și o bară pentru zero-unu, un cerc și un picior de cioară pentru zero-N, două bare pentru exact unu și o bară și un picior de cioară pentru unu-N.
- Capătul părinte este un cerc și o bară, ca la zero-unu, când oricare dintre coloanele cheie străină permite `NULL`, și două bare, ca la exact unu, când toate sunt `NOT NULL`.
- Trecerea indicatorului peste un conector îl evidențiază împreună cu coloanele pe care le leagă în ambele tabele.

![Trecerea indicatorului pe rând peste trei conectori, fiecare evidențiindu-se împreună cu coloanele pe care le leagă](/img/demo-relationship-hover.webp)

O relație care setează [ON DELETE sau ON UPDATE](#on-delete-and-on-update) are o etichetă lângă capătul copil, de exemplu `D:C U:R`: `D:` și acțiunea ON DELETE, apoi `U:` și acțiunea ON UPDATE, fiecare doar când este setată.  
Acțiunile sunt abreviate după notația erwin: `C` pentru CASCADE, `R` pentru RESTRICT, `SN` pentru SET NULL, `SD` pentru SET DEFAULT și `NA` pentru NO ACTION. O relație care nu setează niciuna dintre ele nu are etichetă.  
Eticheta se află de partea opusă tabelului copil, deasupra liniei când conectorul iese pe latura stângă sau dreaptă a acelui tabel și în dreapta liniei când iese pe latura de sus sau de jos, fără să se suprapună peste simbolul de cardinalitate.  
Este desenată în culoarea conectorului, pe un mic dreptunghi în culoarea fundalului pânzei, și se evidențiază împreună cu conectorul ei. Etichetele sunt desenate deasupra tuturor conectorilor, astfel încât o linie care traversează o etichetă trece pe sub ea.  
Eticheta arată acțiunea stocată în relație, indiferent de ce scrie baza de date selectată, astfel încât ON DELETE SET DEFAULT apare tot ca `D:SD` în MySQL.

Trecerea indicatorului peste un conector care setează oricare dintre acțiuni afișează și un sfat ecran cu clauzele scrise complet, câte una pe linie, de exemplu `ON DELETE CASCADE` și `ON UPDATE RESTRICT`.  
Sfatul ecran apare chiar și când eticheta este ascunsă.

Saltul la o relație o evidențiază: alegerea unui rând din folderul `Foreign Keys` al unui tabel în [explorator](./explorer.md#going-to-a-row) sau a unui rând de cheie străină în [vizualizatorul de diferențe](./table-related-functions.md#going-to-a-change) desenează conectorul și eticheta relației în culoarea de la trecerea indicatorului. În vizualizatorul de diferențe, saltul evidențiază conectorul pe fiecare parte care conține relația, astfel încât o cheie străină adăugată evidențiază doar partea curentă, iar una eliminată doar partea salvată.  
Saltul selectează doar tabelul copil, împreună cu coloanele lui cheie străină, cu celula activă pe prima dintre ele; relația însăși tot nu este niciodată selectată. Pentru locul în care ajunge vizualizarea, consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands).  
Evidențierea dispare la următoarea apăsare cu butonul stâng sau drept pe pânză, fie pe un loc gol, un tabel, o notă, un grup de tabele sau un conector, chiar și la o apăsare care lasă selecția neschimbată. Saltul la alt rând sau la altă potrivire a căutării în explorator o elimină și el, la fel ca saltul la alt rând în vizualizatorul de diferențe, pe fiecare parte la care duce acel rând.  
Deplasarea pânzei cu butonul din mijloc sau cu instrumentul mână o lasă activă, la fel ca restrângerea sau extinderea unui rând în explorator sau în vizualizatorul de diferențe, deselectarea totală cu `Escape` și un salt din [căutarea rapidă](./quick-search.md) sau din [butonul cardului](./visualization.md#card-buttons) cu link extern din Flux.  
Evidențierea nu se salvează și nu apare în istoricul anulărilor, iar colaboratorii nu o văd.

Ascundeți conectorii de pe pânza ERD cu opțiunea de afișare `Relationship` sau doar etichetele lor cu opțiunea de afișare `Referential Actions`, care este activată implicit (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options)).  
Etichetele nu sunt desenate la un zoom de `70%` sau mai mic, unde tabelele se restrâng la nume.  
Un [export de imagine](./file-import-export.md#image) este desenat întotdeauna la 100%, astfel încât desenează etichetele indiferent de zoomul pânzei, cu excepția cazului în care o opțiune de afișare le ascunde. Cu opțiunea `Background` dezactivată, și dreptunghiul din spatele fiecărei etichete este transparent.  
[Modul Flux](./visualization.md#flow-mode) din fila Vizualizare desenează conectorii chiar și cu opțiunea `Relationship` dezactivată, fiecare ca o singură curbă gri, continuă și netedă, cu aceleași marcaje la capete, astfel încât linia întreruptă, etichetele, sfatul ecran, evidențierea după un salt și rutarea ortogonală descrise în această pagină se aplică doar pânzei ERD. O relație de la un tabel la el însuși se curbează în jurul colțului din dreapta sus și în Flux (consultați [Rutarea conectorilor](#connector-routing)).

## Rutarea conectorilor {#connector-routing}

Conectorii sunt rutați ortogonal.  
Un traseu ocolește tabelele aflate între cele două capete ale sale în loc să le traverseze, iar colțurile lui sunt rotunjite.  
Fiecare capăt iese din tabelul său printr-un segment drept scurt înainte de a coti, astfel încât două tabele aflate la mică distanță, ale căror capete de conector sunt aliniate, sunt unite printr-o singură linie dreaptă, nu printr-un ocol.  
Traseele care ies pe aceeași latură a unui tabel sunt distribuite pe culoare separate, astfel încât să nu se suprapună.  
Sunt ocolite doar tabelele: un conector poate traversa o notă sau chenarul unui grup de tabele și este desenat deasupra grupurilor de tabele și sub tabele și note.

O relație de la un tabel la el însuși este desenată ca o singură curbă în jurul colțului din dreapta sus al tabelului, care pleacă din latura de sus la capătul părinte și intră în latura dreaptă la capătul copil.  
Celelalte relații autoreferențiale ale aceluiași tabel se așază în afara primei, astfel încât curbele lor nu se intersectează nici între ele, nici cu tabelul.

Nu există nimic de configurat.  
Traseele se recalculează automat ori de câte ori ceva de pe pânză se mută sau se redimensionează, astfel încât nu trebuie niciodată ajustate manual.

![Glisarea tabelului members în jos și înapoi, în timp ce conectorul de la orders alternează între trecerea pe la dreapta tabelului categories și ocolirea lui pe la stânga, cu toate colțurile rotunjite](/img/demo-connector-routing.webp)
