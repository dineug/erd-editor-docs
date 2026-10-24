---
sidebar_position: 14
description: Păstrați domeniile, cuvintele și termenii diagramei în fila Dicționar, derivați numele fizice din numele logice, lăsați un domeniu să stabilească tipul de date al coloanelor sale, citiți ce detectează foaia Verificări, editați și sortați foile ca într-o foaie de calcul și importați-le și exportați-le ca fișiere CSV.
---

# Dicționar

Fila Dicționar conține standardul de denumire al diagramei în trei dicționare, fiecare într-o foaie pe care o editați ca pe o foaie de calcul:

- `Domains`: tipuri de date cu nume, de exemplu `Name` pentru `VARCHAR(100)`. O coloană legată de un domeniu are tipul de date al acestuia.
- `Words`: cuvintele standard din care sunt formate numele logice, fiecare cu abrevierea pe care o folosește pentru el un nume fizic, de exemplu `Customer` și `CUST`.
- `Terms`: nume logice întregi, fiecare cu numele fizic și domeniul pe care le dă, de exemplu `Customer Name` cu `CUST_NM`.

[Numele logic](./logical-names.md) al unui tabel sau al unei coloane derivă numele fizic al acestuia din aceste dicționare, iar termenul unei coloane o poate lega și de un domeniu (consultați [Derivarea numelor fizice](#deriving-physical-names)).  
O a patra foaie, `Checks`, listează ce găsesc greșit dicționarele în numele și tipurile diagramei și în dicționarele înseși, de exemplu un cuvânt interzis într-un nume logic (consultați [Foaia Verificări](#the-checks-sheet)).

## Deschiderea filei {#opening-the-tab}

Treceți la fila `Dictionary` din bara de instrumente, butonul cu o pictogramă de carte dintre `Code Generator` și `Settings`, sau alegeți `Dictionary` sub `Tab` în [căutarea rapidă](./quick-search.md).  
Aceasta poate fi fila în care se deschide diagrama (consultați rândul `Canvas Type` din [Blocare](./settings.md#lock)).

Fila se deschide pe foaia `Domains` până când alegeți alta.  
De fiecare dată când se deschide, foaia revine cu selecția și derularea pe care le-ați lăsat sau, la prima vizită, cu prima ei celulă selectată. Grila ei preia focusul tastaturii, așa că tastarea sau tastele săgeți acționează imediat.

Foaia afișată, precum și căutarea, selecția, derularea și lățimile coloanelor fiecărei foi vă aparțin doar dumneavoastră.  
Nimic din acestea nu se salvează în fișier, nu se înregistrează în istoricul anulărilor și nu se partajează cu colaboratorii. Totul se păstrează cât timp editorul rămâne deschis, de la o schimbare de filă la alta și între documentele încărcate în același editor.

## Foile {#the-sheets}

Bara din partea de sus conține cele patru butoane ale foilor, `Domains`, `Words`, `Terms` și `Checks`, iar butonul foii afișate apare apăsat. Fiecare afișează un contor lângă nume: rândurile pe care le conține foaia sa, indiferent de ce afișează căutarea, ori, pe butonul `Checks`, numărul de verificări, colorat după nivelul acestora (consultați [Foaia Verificări](#the-checks-sheet)).  
Urmează câmpul de căutare (consultați [Căutarea](#searching)). La capătul barei, în foile `Domains`, `Words` și `Terms` și nu într-un editor doar în citire, apar patru instrumente: `Add Row`, `Delete Rows`, `Import CSV` și `Export CSV` (consultați [Adăugarea și ștergerea rândurilor](#adding-and-deleting-rows) și [Importarea și exportarea fișierelor CSV](#importing-and-exporting-csv)).  
Într-un panou îngust sau într-o limbă de afișare cu texte lungi, bara trece pe mai multe rânduri, astfel încât fiecare buton rămâne la îndemână.

Sub grilă, o linie de stare numără rândurile rămase după căutare, ca în `4 rows`, și, cât timp selecția cuprinde vreun rând, câte rânduri cuprinde aceasta, ca în `1 selected`. Un rând comun pentru două zone se numără o singură dată, așa că acest număr arată câte rânduri ar elimina comanda `Delete Rows`.  
Numerele rândurilor din stânga numără rândurile în ordinea în care le afișează foaia, începând de la 1. O celulă doar în citire, adică orice celulă din foaia `Checks` și orice celulă dintr-un editor doar în citire, este desenată pe un fundal gri, cu excepția cazului în care o verificare o marchează.  
O foaie `Domains`, `Words` sau `Terms` goală afișează `Import a CSV file or add a row`, cu excepția unui editor doar în citire.

Coloanele fiecărei foi, în ordine:

| Foaie | Coloane |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Ce fac celulele:

- Câmpul `Data Type` al unui domeniu se scrie ca tipul unei coloane, de exemplu `VARCHAR(100)` sau `NUMERIC(15,2)`, iar fiecare coloană legată de domeniu îl preia (consultați [Domenii și tipuri de date](#domains-and-data-types)).
- Câmpul `Abbreviation` al unui cuvânt este ceea ce folosește un nume fizic pentru cuvântul respectiv (consultați [Din cuvinte](#from-the-words)).
- Câmpurile `Synonyms` și `Forbidden Words` ale unui cuvânt listează alte cuvinte pentru același lucru, separate prin virgule. Fiecare element se curăță de spațiile de la capete, un element gol este eliminat, iar un element egal cu cuvântul însuși este ignorat. Un nume logic care folosește unul dintre ele nu compune niciun nume fizic, iar foaia `Checks` îl semnalează și numește cuvântul de folosit în loc (consultați [Ce detectează fiecare verificare](#what-each-check-finds)).
- Câmpul `Term` al unui termen este un nume logic întreg, iar câmpul `Physical Name` este numele pe care îl dă acel nume logic (consultați [Dintr-un termen](#from-a-term)).
- Câmpul `Domain` al unui termen afișează numele domeniului de care este legat termenul și este gol cât timp termenul nu este legat de niciun domeniu sau este legat de un domeniu eliminat între timp (consultați [Domeniul unui termen](#a-terms-domain)).
- Câmpurile `Category`, `English Name`, fiecare câmp `Description` și câmpul `Synonyms` al unui termen sunt adnotări. Nu schimbă nimic și nicio verificare nu le citește.

Într-o [limbă de afișare scrisă de la dreapta la stânga](./language-and-theme.md#right-to-left-languages), bara, meniul grilei și linia de stare sunt afișate în oglindă, în timp ce foile și lista domeniilor unui termen rămân de la stânga la dreapta.

## Derivarea numelor fizice {#deriving-physical-names}

Dicționarele pot da unui tabel sau unei coloane numele fizic, adică numele pe care îl scriu fila Schemă SQL și generatorul de cod, pornind de la numele logic. Mai întâi se caută un termen al cărui câmp `Term` este numele logic; altfel, numele se compune din abrevierile cuvintelor.  
De exemplu, cu cuvintele `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) și `Date` (`DT`) și cu termenul `Customer Number`, având numele fizic `CUST_NO` și domeniul `Number`, al cărui tip de date este `INT`:

- Numele logic `Customer Number` denumește o coloană `CUST_NO`, o leagă de domeniul `Number` și îi dă tipul `INT`.
- Numele `Order Date` compune `ORD_DT`.
- Un tabel cu numele logic `Customer` primește numele `CUST`.

Cu foaia `Words` și foaia `Terms` goale, nu se derivă nimic.

### Când se derivă un nume {#when-a-name-is-derived}

Un nume fizic se derivă atunci când se scrie un nume logic:

- Pe pânză, când editorul celulei numelui logic se închide cu un alt nume logic decât cel cu care s-a deschis, prin `Enter`, `Tab`, `Escape` sau un clic în altă parte. Fiecare tastă pe care o apăsați scrie doar numele logic (consultați [Scrierea unui nume logic](./logical-names.md#writing-a-logical-name)).
- Imediat, când alegeți un termen din lista de sub celulă (consultați [Completarea numelor de termeni](./logical-names.md#completing-term-names)).
- Când o lipire scrie într-o celulă a numelui logic (consultați [Copierea/lipirea coloanelor](./table-editing.md#copyingpasting-columns)).
- Când funcția [Găsire și înlocuire](./find-and-replace.md#replacing) înlocuiește un nume logic, o singură potrivire sau pe toate.
- Când un agent de programare setează un nume logic.

Numele se derivă doar cât timp numele fizic este gol sau a fost el însuși derivat (consultați [Nume personalizate](#names-of-your-own)).  
Alegerea unui termen, o lipire sau o înlocuire scrie numele logic și ce derivă acesta ca un singur pas de anulare. Pe pânză, numele derivat la închiderea editorului este un pas separat după tastare: prima anulare retrage numele derivat, împreună cu domeniul și tipul aduse de un termen, și lasă numele logic pe care l-ați tastat.

Ulterior, nimic nu se derivă din nou de la sine. O nouă valoare `Abbreviation` a unui cuvânt, o nouă valoare `Physical Name` sau `Domain` a unui termen și cuvintele sau termenii noi lasă neschimbate numele deja derivate; pentru aceasta, folosiți comanda [Derivare din nou a numelor fizice](#derive-physical-names-again). Câmpul `Data Type` al unui domeniu este excepția: ajunge imediat la coloanele domeniului.

### Dintr-un termen {#from-a-term}

Mai întâi se caută în foaia `Terms` un termen al cărui câmp `Term` este egal cu numele logic. Spațiile de la capete și compunerea Unicode sunt ignorate, dar se ține cont de majuscule, așa că `customer number` nu corespunde cu `Customer Number`. Dintre doi termeni cu același nume, contează primul din foaie.

- Termenul dă numele din câmpul său `Physical Name` sau, cât timp acesta este gol, numele pe care îl compun cuvintele sale, ca mai jos, dacă acestea compun unul.
- Pentru o coloană, termenul o leagă și de domeniul din câmpul său `Domain`, cât timp foaia `Domains` îl listează, ceea ce îi dă coloanei tipul de date al domeniului (consultați [Legarea unei coloane](#linking-a-column)). Face acest lucru chiar și atunci când termenul nu dă niciun nume. Un termen fără domeniu nu elimină nicio legătură.
- Un tabel preia doar numele fizic al termenului.

### Din cuvinte {#from-the-words}

Fără un termen corespunzător, cuvintele compun numele:

1. Numele logic se împarte la spații și la `_`, `-`, `·` și `/`, iar niciun cuvânt nu se întinde peste un punct de împărțire.
2. Fiecare bucată se citește de la stânga, luând în fiecare punct cel mai lung text pe care îl listează foaia `Words`, ca `Word`, ca sinonim sau ca cuvânt interzis, fără a reveni niciodată. Cu cuvintele `가입`, `가입일` și `일자`, `가입일자` se citește ca `가입일` și `자`, lăsând `자` neînregistrat, în timp ce `가입 일자` se citește ca `가입` și `일자`. Se ține cont de majuscule: `member` nu este cuvântul `Member`.
3. Numele fizic este format din valorile `Abbreviation` ale cuvintelor, așa cum au fost tastate, unite prin `_`, de exemplu `ORD_DT`. Dintre două cuvinte cu același nume, abrevierea o dă primul din foaie. Nu se aplică nicio limită de lungime, iar opțiunile `Table Name Case` și `Column Name Case` ale generatorului de cod nu au niciun rol.

Totul sau nimic. Dacă vreun segment este un sinonim, un cuvânt interzis sau un text pe care nu îl listează niciun cuvânt ori dacă un cuvânt are câmpul `Abbreviation` gol, nu se compune niciun nume, iar numele fizic rămâne așa cum este.

### Nume personalizate {#names-of-your-own}

Dicționarele completează un nume fizic doar cât timp acesta este gol sau a fost completat chiar de ele. Editorul reține acest lucru pentru fiecare tabel și coloană, deși nimic de pe pânză nu îl arată.

- Un nume pe care îl scrieți devine personalizat: tastarea într-o celulă a numelui, înlocuirea numelui unui tabel sau al unei coloane cu funcția Găsire și înlocuire, lipirea peste celula numelui unei coloane și redenumirea făcută de un agent de programare. Un nume logic scris ulterior îl lasă așa cum este, scrie doar numele logic și nu leagă niciun domeniu.
- Golirea numelui îl trece înapoi în gestiunea dicționarelor, deoarece un nume gol se derivă întotdeauna.
- Un nume logic din care nu se derivă nimic lasă numele fizic și starea acestuia așa cum erau: un nume gol rămâne gol, iar un nume derivat își păstrează valoarea și rămâne în gestiunea dicționarelor.
- Un tabel sau o coloană nouă pornește cu un nume gol, așa că primul nume logic primit derivă acel nume. O coloană cheie străină adăugată de o relație primește numele după cheia sa, iar numele ei este considerat personalizat (consultați [Numele coloanelor cheie străină](./relationship-editing.md#foreign-key-column-names)).
- Numele aduse de comanda `Import` sau `Import and Add` dintr-un fișier Schemă SQL, GraphQL, DBML sau AML, precum și numele unei diagrame create de o versiune anterioară filei Dicționar sunt considerate personalizate, așa că un nume logic scris ulterior pe acestea nu derivă nimic.
- Un [tabel duplicat](./table-related-functions.md#duplicating-tables-and-memos), o coloană [mutată în alt tabel](./table-editing.md#rearranging-and-moving-columns) cu mânerul de glisare, o lipire a unor tabele copiate și comanda `Import and Add` a unui fișier JSON păstrează starea fiecărui nume. Coloanele lipite drept coloane noi în tabelele selectate sunt considerate personalizate, cu excepția cazului în care numele lipit este gol și numele lor logic derivă unul.
- Comanda [Derivare din nou a numelor fizice](#derive-physical-names-again) trece un nume personalizat înapoi în gestiunea dicționarelor, inclusiv unul importat.

### Două coloane, un singur nume {#two-columns-one-name}

O coloană nu derivă nimic atunci când o altă coloană din tabelul ei are deja numele pe care l-ar deriva. Își păstrează numele, starea și legătura cu domeniul și se scrie doar numele ei logic. Numele se compară indiferent de majuscule și de spațiile de la capete, ca numele coloanelor cheie străină.  
Când o singură modificare ar atribui același nume a două coloane, așa cum pot face comenzile `Replace All` sau `Derive Physical Names Again` aplicate unui tabel, numele îl primește prima din tabel.  
De exemplu, o relație autoreferențială pe tabelul `members`, cu cheia `MBR_NO`, adaugă coloana `MBR_NO_2`, care copiază numele logic `Member Number`. Comanda `Derive Physical Names Again` i-ar da numele `MBR_NO`, pe care îl are cheia, așa că păstrează `MBR_NO_2`.  
Pentru tabele nu există o astfel de regulă: două tabele pot deriva același nume.

## Derivare din nou a numelor fizice {#derive-physical-names-again}

Folosiți comanda `Derive Physical Names Again` după ce modificați câmpul `Abbreviation` al unui cuvânt sau câmpul `Physical Name` ori `Domain` al unui termen, deoarece aceste modificări nu redenumesc nimic de la sine. Comanda trece numele pe care le cuprinde înapoi în gestiunea dicționarelor și le derivă din nou după regulile de mai sus, inclusiv numele scrise de dumneavoastră. Este oferită doar în fila ERD și nu într-un editor doar în citire:

- Meniul contextual al tabelului, imediat după `Focus on this table` sau `Focus on selected tables`. Cât timp tabelul este unul dintre două sau mai multe tabele selectate, elementul `Derive Physical Names Again` le cuprinde pe toate, oriunde ați face clic dreapta pe tabel. Altfel, un clic dreapta pe rândul unei coloane oferă elementul `Derive Physical Name Again`, doar pentru acea coloană, iar unul pe antet oferă elementul `Derive Physical Names Again`, pentru numele tabelului și pentru fiecare coloană.
- Meniul contextual al pânzei, imediat după `Name View`: `Derive Physical Names Again`, pentru fiecare tabel și fiecare coloană din diagramă. Elementul este omis cât timp diagrama nu are niciun tabel.
- [Căutarea rapidă](./quick-search.md#what-the-palette-lists), sub forma unor rânduri pentru coloana activă, tabelul activ, tabelele selectate și întreaga diagramă.

![Schimbarea abrevierii cuvântului Number din NO în NUM în foaia Words, numele fizice rămânând MBR_NO și PAY_NO în diagramă, apoi Derive Physical Names Again din meniul pânzei transformându-le în MBR_NUM și PAY_NUM, în timp ce ORD_NO, pe care îl dă termenul său, rămâne](/img/demo-derive-physical-names.webp)

Numele fiecărui tabel și al fiecărei coloane cuprinse care au un nume logic se derivă din nou. O coloană preia și domeniul pe care îl dă termenul ei și, odată cu el, tipul domeniului, care se propagă de-a lungul relațiilor cât timp [sincronizarea tipului de date în relații](./settings.md#relationship-datatype-sync) este activată.  
Comanda nu atinge un tabel sau o coloană fără nume logic și nici o coloană al cărei nume nou îl are deja o altă coloană din tabelul ei (consultați [Două coloane, un singur nume](#two-columns-one-name)). Fiecare dintre acestea își păstrează numele și starea lui, personalizat sau gestionat de dicționare, iar o coloană își păstrează și legătura cu domeniul.  
Un nume logic din care acum nu se derivă nimic lasă numele fizic așa cum este, dar îl trece înapoi în gestiunea dicționarelor, așa că următorul nume logic pe care îl scrieți îl derivă.  
Comanda reprezintă un singur pas de anulare, oricâte nume, legături și tipuri ar modifica. Nu înregistrează niciun pas doar când nu modifică nimic, iar trecerea unui nume personalizat înapoi în gestiunea dicționarelor contează ca o modificare, chiar și atunci când numele are deja valoarea pe care o dau acestea.

Câmpul `Physical Name` propriu al unui termen nu se compune din nou din cuvintele modificate, așa că editați termenul înainte de a deriva din nou.

## Domenii și tipuri de date {#domains-and-data-types}

O coloană legată de un domeniu are valoarea `Data Type` a domeniului. Legarea unei coloane îi dă imediat acel tip.  
Când câmpul `Data Type` al unui domeniu se modifică, fie că este editat, lipit sau importat în foaia `Domains`, fie că este modificat de un colaborator sau de un agent de programare, fiecare coloană legată de domeniu preia noul tip în același pas. Cât timp [sincronizarea tipului de date în relații](./settings.md#relationship-datatype-sync) este activată, fiecare dintre aceste modificări continuă de-a lungul relațiilor, așa cum o face o modificare tastată; cât timp este dezactivată, se modifică doar coloanele legate.  
Redenumirea unui domeniu modifică doar numele afișat în celulele Domeniu ale coloanelor.

O modificare de tip făcută în foaia `Domains` se anulează acolo, împreună cu tipurile de coloane pe care le-a dat (consultați [Foile din fila Dicționar](./undo-redo.md#dictionary-sheets)).  
O anulare sau o refacere în fila ERD care leagă din nou o coloană de un domeniu sau readuce o coloană legată de unul îi dă coloanei tipul domeniului așa cum este acum. Una care readuce un alt tip elimină legătura coloanei cu domeniul.

### Legarea unei coloane {#linking-a-column}

O coloană se leagă de un domeniu prin:

- Alegerea domeniului în celula Domeniu a coloanei, pe care o afișează View Option → `Domain`, sau, în modul `Logical Names`, în celula tipului care îi ține locul (consultați [Celula Domeniu](./logical-names.md#the-domain-cell)).
- Un nume logic al cărui termen dă un domeniu (consultați [Dintr-un termen](#from-a-term)). Acest lucru se întâmplă doar cât timp numele se derivă, deci nu pentru un nume personalizat și nici pentru o coloană al cărei nume derivat îl are o altă coloană.
- Comanda `Derive Physical Name Again` sau `Derive Physical Names Again`, care leagă fiecare coloană cuprinsă de domeniul termenului ei.
- O relație: o coloană cheie străină copiază domeniul cheii sale, împreună cu tipul și numele logic al acesteia (consultați [Relații identificatoare](./relationship-editing.md#identifying-relationships)). O cheie a cărei copie primește un alt tip, cum se întâmplă cu o cheie de tip serial, nu transmite niciun domeniu.
- Duplicarea tabelului ei sau mutarea ei în alt tabel cu mânerul de glisare, care păstrează amândouă legătura. O lipire a unor tabele sau coloane copiate o păstrează doar cât timp această diagramă listează domeniul și domeniul are încă tipul coloanei copiate, așa că o copie dintr-o altă diagramă ajunge nelegată de niciun domeniu (consultați [Copierea/lipirea tabelelor și notelor](./table-related-functions.md#copyingpasting-tables-and-memos)). Comanda `Import and Add` nu leagă nicio coloană.
- Numele unui domeniu lipit într-o celulă Domeniu (consultați [Copierea/lipirea coloanelor](./table-editing.md#copyingpasting-columns)).

### Eliminarea legăturii {#unlinking}

- Tastarea unui tip în celula `DataType` a unei coloane legate sau acceptarea unei sugestii elimină legătura coloanei cu domeniul imediat ce tipul ei diferă de cel al domeniului, iar coloana păstrează tipul tastat (consultați [Completarea automată a tipului de date](./table-editing.md#datatype-autocomplete)). Tastarea din nou a tipului domeniului nu o leagă din nou; alegeți în schimb domeniul în celula Domeniu a coloanei. O lipire peste celula `DataType` și o modificare de tip făcută de un agent de programare elimină legătura în același mod.
- Cât timp sincronizarea tipului de date în relații este activată, în același pas se elimină legătura cu domeniul pentru fiecare coloană la care ajunge o modificare de tip și al cărei tip nou diferă de cel al propriului domeniu, de exemplu o cheie străină legată de un domeniu propriu. Caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) elimină în același mod legătura coloanelor cărora le schimbă tipul.
- Opțiunea `None` din celula Domeniu elimină legătura coloanei cu domeniul și îi păstrează tipul.
- Modificarea sau golirea câmpului `Domain` al unui termen ori ștergerea unui termen nu modifică nicio coloană.

### Eliminarea unui domeniu {#removing-a-domain}

Ștergerea rândului unui domeniu lasă coloanele acestuia cu tipurile lor, iar legăturile rămân. Coloanele nu afișează niciun domeniu, iar foaia `Checks` listează `Unknown domain` pentru fiecare dintre ele cât timp foaia `Domains` mai conține un domeniu. Anularea ștergerii în foaia `Domains` afișează din nou legăturile.  
Cât timp domeniul lipsește, tastarea într-o astfel de coloană a unui alt tip decât cel al domeniului elimină definitiv legătura, la fel ca opțiunea `None` din celula Domeniu a coloanei.  
Fișierul omite aceste legături la salvare, așa că diagrama se redeschide cu acele coloane nelegate de niciun domeniu.

Un termen legat de un domeniu eliminat afișează o celulă `Domain` goală, marcată ca `Unknown domain`. `Delete` sau `Backspace` pe celulă elimină legătura (consultați [Domeniul unui termen](#a-terms-domain)).

## Foaia Verificări {#the-checks-sheet}

Foaia `Checks` listează ce detectează verificările dicționarelor în dicționare și în tabelele și coloanele diagramei. Verificările doar citesc: nu modifică nimic.  
Fiecare verificare rulează doar cât timp foaia pe care o citește conține un rând, iar verificările cuvintelor doar cât timp foaia `Words` conține un cuvânt cu nume, așa că o diagramă cu dicționarele goale nu listează nimic.

![Customer Num desenat cu roșu și Order Stat cu chihlimbariu în modul Logical Names, foaia Checks listând cele trei verificări ale lor cu un contor roșu, un dublu clic pe rândul Forbidden word revenind la Customer Num în diagramă și retastarea lui ca Member Number, care lasă o singură verificare](/img/demo-dictionary-checks.webp)

Cele trei coloane ale ei sunt doar în citire:

- Coloana `Type` numește verificarea (consultați [Ce detectează fiecare verificare](#what-each-check-finds)).
- Coloana `Target` numește un cuvânt, un termen sau un domeniu prin numele său, un tabel prin numele său, iar o coloană sub forma `table.column`, tabelul și coloana fiind numite așa cum le numește [modul de afișare a numelor](./logical-names.md#beyond-the-canvas), cu `unnamed` acolo unde modul de afișare nu arată niciun nume.
- Coloana `Detail` afișează ce a detectat verificarea și, după `→`, ce oferă dicționarele în loc, mai multe valori fiind unite prin virgule, de exemplu `멤버 → 회원`. O parte goală apare ca `—`, ca în `— → NUMERIC(15)`.

Verificările cuvintelor apar primele, apoi cele ale termenilor și ale domeniilor, apoi, tabel cu tabel, fiecare tabel urmat de coloanele sale.  
Lista urmează fiecare editare pe măsură ce aceasta ajunge, inclusiv pe cele ale unui colaborator și ale unui agent de programare, precum și fiecare schimbare a modului de afișare a numelor.  
Contorul butonului `Checks` este roșu cât timp vreo verificare este o eroare, chihlimbariu cât timp toate sunt avertismente și atenuat când nu există niciuna.

Rândurile nu pot fi editate, adăugate, șterse, sortate, importate sau exportate: bara nu afișează niciun instrument, un clic dreapta nu deschide meniul grilei, iar anularea și refacerea nu au niciun efect. Căutarea, selectarea și copierea funcționează ca în celelalte foi.

`Enter` sau un dublu clic pe un rând duce la ceea ce numește acesta:

- Un cuvânt, un termen sau un domeniu: fila afișează foaia acestuia cu celula citită de verificare selectată, adică numele sau câmpul `Domain` al unui termen, și cu rândul său primul vizibil. Căutarea foii se golește dacă ascunde rândul. Un rând șters între timp nu duce nicăieri.
- Un tabel sau o coloană: apare fila ERD, cu tabelul selectat singur și cu focusul pe celula citită de verificare. Aceasta este celula numelui, celula numelui logic sau celula Domeniu ori, acolo unde rândul nu desenează acea celulă, celula desenată în locul ei. Pânza preia focusul tastaturii, iar vizualizarea se mută după regula din [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands).

Un dublu clic pe un antet, pe marginea unei coloane, pe o bară de derulare sau sub rânduri nu duce nicăieri.  
Un agent de programare listează aceleași verificări, în aceeași ordine, cu instrumentul `erd_list_checks` (consultați [Verificările dicționarelor](../../mcp/tools.md#dictionary-checks)).

Celelalte trei foi marchează celulele citite de verificări, un nume sau câmpul `Domain` al unui termen, cu text roșu sau chihlimbariu pe un fundal colorat:

- Roșu: un nume pe care îl are un alt rând din foaia sa, câmpul `Domain` al unui termen legat de un domeniu eliminat și un câmp `Term` care folosește un cuvânt interzis.
- Chihlimbariu: un câmp `Term` care folosește un sinonim sau un cuvânt neînregistrat.

O celulă preia nivelul cel mai sever dintre ale sale. Marcajele apar și într-un editor doar în citire, iar foaia `Checks` însăși nu este colorată. Pentru marcajele de pe pânza ERD, consultați [Marcaje pe pânză](#marks-on-the-canvas).

### Ce detectează fiecare verificare {#what-each-check-finds}

| `Type` | Nivel | Ce detectează | `Detail`, de exemplu |
| --- | --- | --- | --- |
| `Duplicate name` | Eroare | O valoare `Word`, `Term` sau `Domain` pe care o are și un alt rând din aceeași foaie. Fiecare dintre aceste rânduri este listat. | `Member` |
| `Unknown domain` | Eroare | O coloană sau un termen încă legat de un domeniu eliminat, cât timp foaia `Domains` conține un domeniu | Numele domeniului eliminat |
| `Forbidden word` | Eroare | Un segment al unui nume logic sau al unui câmp `Term` pe care un cuvânt îl listează în câmpul său `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Avertisment | Un segment al numelui logic al unui tabel sau al unei coloane ori al unui câmp `Term` pe care nu îl listează niciun cuvânt | `자` |
| `Synonym` | Avertisment | Un segment pe care un cuvânt îl listează în câmpul său `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Avertisment | Un tabel sau o coloană al cărui nume logic corespunde unui termen, dar al cărui nume fizic nu este cel pe care îl dă termenul | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Avertisment | O coloană a cărei valoare `DataType` nu este valoarea `Data Type` a domeniului de care este legată | `INT → NUMERIC(15)` |

- Numele se compară fără spațiile de la capete, ținând cont de majuscule, așa că `Member` și `member` sunt două nume diferite, iar un nume gol nu este niciodată un duplicat. Foile refuză o editare care ar atribui același nume a două rânduri, așa că verificarea `Duplicate name` apare doar acolo unde două editări s-au intersectat, de exemplu când doi colaboratori denumesc rânduri în același timp, sau într-un fișier editat în altă parte.
- Verificările cuvintelor citesc un nume după regulile din [Din cuvinte](#from-the-words) și listează fiecare segment diferit o singură dată pentru fiecare nume. Verificările `Forbidden word` și `Synonym` oferă cuvântul care listează segmentul.
- Verificarea `Physical name mismatch` compară numele, fără spațiile de la capete, cu câmpul `Physical Name` al termenului sau, cât timp acesta lipsește, cu ce compun cuvintele termenului și nu semnalează nimic cât timp termenul nu dă niciun nume. O coloană cheie străină care a copiat numele logic al cheii sale este semnalată de această verificare ori de câte ori propriul ei nume diferă de cel al termenului, de exemplu `members_id → MBR_ID`. Comanda `Derive Physical Name Again` rezolvă problema, cu excepția cazului în care o altă coloană are acel nume.
- Verificarea `Domain type mismatch` nu rezultă niciodată din editările dintr-un singur editor, deoarece o coloană legată ajunge întotdeauna la tipul domeniului ei. Poate apărea când un colaborator leagă o coloană în timp ce altul modifică tipul acelui domeniu sau într-un fișier scris în altă parte. Alegerea din nou a domeniului în celula Domeniu a coloanei îi dă coloanei tipul acestuia, iar opțiunea `None` elimină legătura. O legătură cu un domeniu eliminat apare doar ca `Unknown domain`.

### Marcaje pe pânză {#marks-on-the-canvas}

Pânza ERD scrie un nume semnalat de verificări în culoarea verificării respective:

- O celulă a numelui logic, în antetul tabelului sau pe rândul unei coloane, este roșie cât timp numele ei logic folosește un cuvânt interzis și, altfel, chihlimbarie cât timp folosește un sinonim sau un cuvânt care lipsește din foaia `Words`.
- O celulă a numelui fizic, în antet sau pe un rând, este chihlimbarie cât timp termenul căruia îi corespunde numele ei logic dă un alt nume fizic.

Doar aceste două tipuri de celule sunt marcate, niciodată celula Domeniu sau celula `DataType`, așa că verificările `Unknown domain` și `Domain type mismatch` ale unei coloane apar doar în foaia `Checks`.  
O celulă este marcată doar pentru ce desenează: modul `Physical Names` poate marca doar nume fizice, modul `Logical Names` doar nume logice, iar modul `Both Names` fiecare celulă după propriile ei verificări (consultați [Afișare nume](./logical-names.md#name-view)). O celulă necompletată își păstrează culoarea textului substituent, iar dicționarele goale nu marchează nimic.  
Pe antetul unui tabel dintr-un [grup de tabele](./table-groups.md) colorat, un marcaj își păstrează culoarea doar cât timp rămâne lizibil pe culoarea grupului; altfel, numele preia negrul sau albul propriu al antetului.

Marcajele apar pe pânza ERD, în [călătoria în timp](./undo-redo.md#time-travel) și în previzualizarea [aranjării automate](./table-related-functions.md#auto-layout), inclusiv într-un editor doar în citire. Fila Vizualizare, cele două părți ale [vizualizatorului de diferențe](./table-related-functions.md#diff-viewer) și o imagine exportată nu desenează niciunul.  
Ele urmează fiecare modificare pe măsură ce se produce, fie a unui nume, fie a unui cuvânt, termen sau domeniu.

## Căutarea {#searching}

Câmpul de căutare afișează `Search` și apare în toate cele patru foi, inclusiv într-un editor doar în citire. Fiecare foaie are propria căutare.  
Un rând corespunde când una dintre celulele în care se caută conține textul, indiferent de majuscule, de compunerea Unicode și de spațiile din jurul textului căutat. O potrivire nu se întinde niciodată peste două celule. Celulele în care se caută:

- `Domains`: `Domain`, `Data Type` și `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` și `Description`.
- `Terms`: `Term`, `Physical Name` și `Description`.
- `Checks`: toate trei, așa cum apar în limba de afișare.

O căutare nouă mută selecția pe prima celulă și derulează până sus.  
Cât timp câmpul conține text, un buton `x` cu sfatul ecran `Clear search` îl golește și lasă cursorul de text în câmp. `Escape` în câmp îl golește de asemenea.  
În câmp, `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac) anulează tastarea, nu foaia, iar tastele pentru rânduri din [Adăugarea și ștergerea rândurilor](#adding-and-deleting-rows) sunt taste de text.  
Comanda `Add Row` și inserările golesc mai întâi căutarea, deoarece un rând gol nu corespunde niciunei căutări. Un import o păstrează.

## Selectarea și deplasarea {#selecting-and-moving}

Grila selectează așa cum face o foaie de calcul:

- Un clic selectează o celulă, iar o glisare selectează o zonă, derulând la marginea foii. `Shift + click` extinde selecția de la celula activă, iar `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac) adaugă o altă zonă.
- Antetul unei coloane selectează coloana, numărul unui rând selectează rândul, iar colțul din stânga sus selectează toate celulele, așa cum face `Ctrl + A` (Windows/Linux) sau `⌘ + A` (Mac).
- Pe Mac, `Ctrl + click` este un clic dreapta (consultați [Meniul grilei](#the-grids-menu)).

Cu tastatura:

- Tastele săgeți mută selecția cu o celulă, iar cu `Ctrl` (Windows/Linux) sau `⌘` (Mac) ținut apăsat o duc până la marginea foii în acea direcție.
- `Home` și `End` merg la prima și la ultima celulă a rândului, iar cu `Ctrl` sau `⌘` ținut apăsat, la prima și la ultima celulă a foii.
- `Page Up` și `Page Down` mută selecția cu un ecran de rânduri.
- Cu `Shift` ținut apăsat, oricare dintre tastele de mai sus extinde în schimb selecția.
- `Tab` și `Shift + Tab` mută selecția la dreapta și la stânga, iar `Shift + Enter` o mută în sus. `Enter` singur editează celula (consultați [Editarea celulelor](#editing-cells)).

Când dispar rânduri de sub selecție, printr-o anulare sau printr-o ștergere făcută de un colaborator, selecția este readusă în interiorul rândurilor rămase.

Glisați marginea din dreapta a antetului unei coloane pentru a redimensiona coloana sau faceți dublu clic pe margine pentru a potrivi coloana la cel mai lat text din rândurile vizibile. Nicio tastă nu redimensionează o coloană.

## Editarea celulelor {#editing-cells}

Tastarea pe celula selectată îi înlocuiește valoarea. `Enter`, `F2` sau un dublu clic editează valoarea așa cum este, cu cursorul de text la sfârșitul ei.  
O celulă conține o singură linie, așa că un tabulator sau un sfârșit de linie lipit în ea devine un spațiu.

- `Enter` scrie editarea și mută selecția în jos, iar `Tab` o scrie și mută selecția la dreapta. Cu `Shift`, acestea mută selecția în sus sau la stânga.
- Un clic în altă parte sau ieșirea focusului tastaturii din grilă o scrie de asemenea.
- `Escape` o anulează.

![Editarea foii Words: tastarea NUM peste o celulă și apăsarea Enter, inserarea unui rând cu ⌥ + Enter și completarea lui cu Tab, sortarea după Word din meniul grilei, apoi căutarea după ord și golirea căutării cu Esc](/img/demo-dictionary-editing.webp)

O editare care lasă valoarea așa cum era nu scrie nimic, iar o editare scrisă este un singur pas de anulare al foii sale, oricât text ar fi tastat.  
`Delete` sau `Backspace`, fără nicio editare deschisă, golește fiecare celulă selectată, ca un singur pas.  
Cât timp o editare este deschisă, tastele de anulare și de refacere anulează și refac tastarea din celulă, iar tastele pentru rânduri introduc text (consultați [Taste în filă](#keys-on-the-tab)).  
Orice celulă din foaia `Checks` și orice celulă dintr-un editor doar în citire este doar în citire și nu deschide nicio editare.

Când oricare rând al unei editări, al unei lipiri sau al unei goliri este refuzat, nu se salvează nimic din aceasta, iar o notificare de eroare explică motivul, numărând rândurile și numindu-le pe primele trei:

- Un nume pe care îl are un alt rând al foii sau pe care îl scrie un alt rând al aceleiași lipiri: `Nothing saved: 1 row shares a name with another row (Member)` sau `Nothing saved: 2 rows share a name with another row (…)`. Numele se compară fără spațiile de la capete, ținând cont de majuscule, așa că `Member` și `member` diferă. Un nume gol nu este niciodată refuzat.
- Câmpul `Domain` al unui termen dat ca text pe care nu îl are niciun domeniu din foaia `Domains`: `Nothing saved: 1 row names an unknown domain (…)`.
- Un rând pe care un colaborator l-a șters în timp ce îl editați: `Nothing saved: the row was removed`.

O scriere poate avea efect dincolo de celula ei:

- Un termen care primește o valoare `Term` cât timp câmpul său `Physical Name` este gol primește numele pe care îl compun cuvintele sale, atunci când acestea compun unul (consultați [Din cuvinte](#from-the-words)). Acest lucru se întâmplă o singură dată: numele nu se compune din nou când cuvintele se modifică ulterior.
- O nouă valoare `Data Type` a unui domeniu schimbă tipul fiecărei coloane legate de domeniu, în același pas de anulare (consultați [Domenii și tipuri de date](#domains-and-data-types)).

### Domeniul unui termen {#a-terms-domain}

`Enter`, `F2` sau un dublu clic pe celula `Domain` a unui termen deschide o listă sub celulă sau deasupra ei, acolo unde este mai mult loc, cu un câmp de căutare care afișează `Domain`.  
Lista conține `None`, apoi fiecare domeniu cu nume, în ordinea din foaia `Domains`, iar evidențierea pornește de la domeniul de care este legat termenul sau de la `None`. Tastarea unui caracter pe celulă deschide lista deja filtrată după acel caracter.

- Tastarea restrânge lista la domeniile ale căror nume conțin textul, indiferent de majuscule, elimină `None` și evidențiază prima potrivire.
- `↑` și `↓` mută evidențierea, reluând de la capăt la ambele extremități.
- `Enter` sau `Tab` alege rândul evidențiat, iar un clic, rândul pe care s-a făcut clic, ca un singur pas de anulare. Termenul se leagă exact de domeniul ales, chiar și de unul dintre două domenii cu același nume, iar opțiunea `None` elimină legătura.
- `Escape` sau un clic în afara listei o închide fără a scrie nimic din ce s-a tastat.

Fără niciun domeniu cu nume în foaia `Domains`, câmpul se deschide fără listă.  
Un text lipit leagă termenul de primul domeniu listat cu acel nume, un text gol elimină legătura, iar un text egal cu ce afișează celula păstrează legătura așa cum este. Orice alt nume este refuzat (consultați [Editarea celulelor](#editing-cells)). `Delete` sau `Backspace` pe celulă elimină legătura termenului, chiar și cu un domeniu eliminat.

## Copierea și lipirea {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) sau `⌘ + C` (Mac) copiază selecția ca text separat prin tabulatori, câte o linie pentru fiecare rând, așa cum îl scriu foile de calcul, astfel încât se lipește într-o foaie de calcul sub formă de celule. Un tabulator sau un sfârșit de linie din interiorul unei valori devine un spațiu.  
Mai multe zone se copiază împreună doar când cuprind aceleași rânduri, una lângă alta, sau aceleași coloane, una deasupra alteia. Altfel nu se copiază nimic și apare notificarea de eroare `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) sau `⌘ + V` (Mac) lipește text separat prin tabulatori, de exemplu celule copiate dintr-o foaie de calcul, de la celula activă în jos și spre dreapta:

- Ghilimelele se lipesc ca text, așa că o celulă dintr-o foaie de calcul care conține un sfârșit de linie nu se lipește ca o singură celulă.
- O singură valoare umple fiecare zonă selectată.
- Rândurile de după ultimul rând se adaugă ca rânduri noi, în ordine, așa că o lipire într-o foaie goală o umple.
- Coloanele de după ultima coloană sunt omise, iar după ce restul se salvează, notificarea `Columns past the last one weren't pasted` anunță acest lucru.
- O lipire a mai multor celule selectează apoi blocul pe care l-a scris.

O lipire este un singur pas de anulare, inclusiv rândurile pe care le adaugă, și este refuzată în întregime în cazul unui nume duplicat sau al unui domeniu necunoscut (consultați [Editarea celulelor](#editing-cells)).  
O copiere, o lipire sau o golire peste mai mult de un milion de celule nu face nimic și apare notificarea de eroare `Nothing done: the selection covers too many cells`.  
Decuparea, `Ctrl + X` (Windows/Linux) sau `⌘ + X` (Mac), nu face nimic într-o foaie. Copierea și lipirea din această filă nu ajung niciodată la diagramă, iar cât timp este deschisă editarea unei celule, acționează asupra textului din celulă.

## Adăugarea și ștergerea rândurilor {#adding-and-deleting-rows}

Comanda `Add Row` adaugă un rând gol la sfârșitul foii. Golește căutarea, selectează prima celulă a rândului nou și dă grilei focusul tastaturii, așa că tastarea completează acea celulă.  
Comanda `Delete Rows` șterge fiecare rând pe care îl cuprinde selecția, în orice coloană, iar o singură anulare le readuce pe toate la locurile lor. Sfatul ecran al acesteia numește tasta care face același lucru.

Cu focusul tastaturii în grilă și nicio celulă în curs de editare:

- `Alt + Enter` (Windows/Linux) sau `⌥ + Enter` (Mac) inserează sub selecție atâtea rânduri goale câte cuprinde aceasta.
- `Alt + Shift + Enter` (Windows/Linux) sau `⌥ + Shift + Enter` (Mac) le inserează deasupra.
- `Alt + Backspace` sau `Alt + Delete` (Windows/Linux) ori `⌥ + Backspace` sau `⌥ + Delete` (Mac) șterge rândurile pe care le cuprinde selecția.

Acestea fac ce fac elementele de inserare și de ștergere a rândurilor din meniul grilei (consultați [Meniul grilei](#the-grids-menu)). O inserare golește căutarea și pune rândurile noi imediat deasupra primului rând cuprins de selecție sau imediat sub ultimul. Le selectează în prima coloană, cu primul dintre ele activ, și este un singur pas de anulare.

Aceste taste sunt combinațiile `Add Column` și `Remove Column` din fila [Comenzi rapide](./settings.md#shortcuts), așa că o aplicație gazdă care le reasociază cu metoda [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) le mută și pe acestea. `Alt + Shift + Enter` este combinația `Add Column` cu `Shift` adăugat și nu are un rând propriu acolo.  
Într-o editare deschisă și în câmpul de căutare, acestea sunt taste de text, așa că pe Mac `⌥ + Backspace` șterge un cuvânt. În foaia `Checks` și într-un editor doar în citire nu au niciun efect. În această filă nu adaugă și nu elimină niciodată coloana unui tabel.  
În Obsidian, acestea ajung la filă chiar și acolo unde o comandă rapidă din Obsidian folosește aceeași tastă.

Un rând necompletat niciodată sau unul golit de toate valorile apare în foaia sa și ajunge la colaboratori, dar fișierul îl omite, așa că dispare la redeschiderea diagramei.

## Meniul grilei {#the-grids-menu}

Faceți clic dreapta pe o celulă din foile `Domains`, `Words` sau `Terms` pentru a deschide meniul grilei. O celulă din afara selecției devine mai întâi selecția.  
Un clic dreapta sub ultimul rând sau la dreapta ultimei coloane îl deschide pentru selecția așa cum este, așa că o foaie goală îl deschide oriunde sub antete. Tasta de meniu sau `Shift + F10` îl deschide pentru celula activă.

- `Insert 1 row above`, `Insert 1 row below` și `Delete 1 row`, fiecare numărând rândurile cuprinse de selecție, ca în `Insert 3 rows above`, cu tasta sa în dreapta (consultați [Adăugarea și ștergerea rândurilor](#adding-and-deleting-rows)).
- `Sort by <column>, ascending` și `Sort by <column>, descending`, care numesc coloana pe care ați făcut clic dreapta, ca în `Sort by Word, ascending` (consultați [Sortarea](#sorting)). Acestea sunt omise la dreapta ultimei coloane.
- `Import CSV` și `Export CSV`, care fac ce fac butoanele barei (consultați [Importarea și exportarea fișierelor CSV](#importing-and-exporting-csv)).

Când nu se afișează niciun rând, într-o foaie goală sau sub o căutare care nu găsește nimic, apar doar elementele `Insert 1 row below`, `Import CSV` și `Export CSV`.  
Foaia `Checks` și un editor doar în citire deschid în schimb meniul propriu al browserului, la fel ca un clic dreapta pe un antet sau pe o bară de derulare.  
Meniul se închide la o alegere, la `Escape`, la o apăsare în altă parte a filei, când se schimbă selecția sau foaia și când se schimbă rândurile foii, printr-o editare a dumneavoastră sau a unui colaborator.

## Sortarea {#sorting}

Elementele `Sort by <column>, ascending` și `Sort by <column>, descending` reordonează chiar rândurile foii, nu doar afișarea lor. Noua ordine se salvează în fișier, este văzută de colaboratori și respectată de comanda `Export CSV`, iar o singură anulare readuce vechea ordine.  
Rândurile se compară după textul afișat în celulă, câmpul `Domain` al unui termen după numele domeniului, în ordinea alfabetică a limbii de afișare, cu numerele comparate după valoare, așa că `2` vine înainte de `10`. Celulele goale ajung ultimele în ambele sensuri, iar rândurile egale la comparare își păstrează ordinea. Sortarea unei foi aflate deja în acea ordine nu înregistrează nimic.  
Căutarea rămâne așa cum era, la fel și selecția, ale cărei celule conțin acum alte rânduri.

## Importarea și exportarea fișierelor CSV {#importing-and-exporting-csv}

Fiecare dintre foile `Domains`, `Words` și `Terms` se importă dintr-un fișier CSV și se exportă într-unul. Aceste fișiere sunt proprii filei Dicționar: elementele `Import` și `Export` din meniul contextual al pânzei nici nu le citesc, nici nu le scriu (consultați [Importarea sau exportarea fișierelor](./file-import-export.md)).

### Importarea {#importing}

Comanda `Import CSV`, din bară sau din meniul grilei, deschide selectorul de fișiere propriu al browserului pentru fișiere `.csv`, nu caseta de dialog de import a aplicației gazdă. Alegerea din nou a aceluiași fișier îl importă din nou.  
Fișierul intră în dicționarul pe care îl numește antetul său, oricare ar fi foaia afișată, iar fila afișează apoi acea foaie și dă grilei ei focusul tastaturii. Foaia își păstrează căutarea, selecția și derularea, așa că rândurile ascunse de căutare sau rândurile adăugate sub zona vizibilă rămân ascunse.  
Fișierul se citește ca UTF-8, cu sau fără marcaj de ordine a octeților, ori ca EUC-KR când nu este UTF-8 valid, cum sunt fișierele mai vechi ale standardului pentru date publice.

![Deschiderea filei Dicționar din bara de instrumente, apoi importarea domeniilor, cuvintelor și termenilor cu Import CSV, fiecare fișier trecând fila la propria foaie și raportând ce a adăugat](/img/demo-dictionary-import.webp)

Cum ajung rândurile:

- Fiecare rând cu nume actualizează rândul foii cu acel nume, în câmpurile pentru care fișierul are coloane. Coloanele care lipsesc din fișier lasă acele câmpuri așa cum sunt. Numele se compară fără spațiile de la capete, ținând cont de majuscule.
- Numele care lipsesc din foaie se adaugă după ultimul ei rând, în ordinea din fișier.
- Un import nu șterge niciodată un rând.
- Un rând cu numele gol este omis. Când fișierul conține un nume de două ori, câștigă rândul ulterior, iar cel anterior este considerat omis. Liniile goale nu sunt rânduri.
- Domeniul unui termen se găsește după nume, fiind primul domeniu cu acel nume, iar un nume pe care nu îl are niciun domeniu lasă termenul nelegat de niciun domeniu, așa că importați mai întâi domeniile.

Un import este un singur pas de anulare al acelei foi.  
Notificarea afișează apoi, de exemplu, `1 added · 1 updated · 2 skipped`. Un rând identic cu cel din foaie nu este considerat nici adăugat, nici actualizat, așa că importarea din nou a aceluiași fișier nu modifică nimic și nu înregistrează niciun pas.  
Cât timp termenii din fișier numesc domenii care lipsesc din diagramă, o a doua linie le numește pe primele trei, ca în `4 unknown domains: 연월일, 금액, 번호`.  
Un fișier al cărui antet nu corespunde niciunei structuri sau corespunde la două deodată nu aduce nimic și apare notificarea de eroare `Couldn't read this file as words, terms or domains`.

### Structura fișierelor {#file-layouts}

Fiecare dicționar citește două structuri. Prima este structura proprie editorului, pe care o scrie comanda `Export CSV`, cu numele câmpurilor drept antet:

| Dicționar | Antet | Un fișier necesită |
| --- | --- | --- |
| Cuvinte | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Termeni | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domenii | `name,category,dataType,description` | `name`, `dataType` |

Coloanele pot apărea în orice ordine, coloana `domain` a unui termen conține numele domeniului, iar orice altă coloană este ignorată. În antet se ține cont de majuscule, iar celulele se citesc exact cum sunt scrise, inclusiv spațiile.

A doua este structura fișierelor standardului coreean pentru date publice (공통표준):

| Dicționar | Un fișier necesită | Se citesc și |
| --- | --- | --- |
| Cuvinte | `공통표준단어명` | `공통표준단어영문약어명` (abreviere), `공통표준단어 영문명` (nume în engleză), `공통표준단어 설명` (descriere), `이음동의어 목록` (sinonime), `금칙어 목록` (cuvinte interzise) |
| Termeni | `공통표준용어명` | `공통표준용어영문약어명` (nume fizic), `공통표준도메인명` (domeniu, după nume), `공통표준용어설명` (descriere), `용어 이음동의어 목록` (sinonime) |
| Domenii | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categorie), `공통표준도메인설명` (descriere), `데이터길이`, `데이터소수점길이` |

Coloanele `데이터타입`, `데이터길이` și `데이터소수점길이` ale unui domeniu se unesc într-un singur tip de date: `NUMERIC(15,2)`, `CHAR(8)`, doar tipul acolo unde nu există lungime, de exemplu `DATE`, iar o scală de 0 este omisă, ca în `NUMERIC(15)`.  
În aceste fișiere, celulele se curăță de spațiile de la capete, iar celelalte coloane, de exemplu istoricul reviziilor, sunt ignorate.  
În ambele structuri, spațiile dintr-un nume din antet nu contează.

### Exportarea {#exporting}

Comanda `Export CSV`, din bară sau din meniul grilei, salvează foaia afișată în structura proprie editorului: fiecare rând, în ordinea din foaie, indiferent de ce afișează căutarea, cu domeniul unui termen scris prin numele său sau lăsat gol pentru un domeniu eliminat.  
Fișierul este UTF-8 cu marcaj de ordine a octeților și sfârșituri de linie CRLF, iar doar un câmp care conține ghilimele, o virgulă sau un sfârșit de linie este pus între ghilimele. Se deschide într-o foaie de calcul și se importă înapoi în aceleași rânduri.  
Se numește `<database name>-<timestamp>-words.csv`, `-terms.csv` sau `-domains.csv` și se salvează la fel ca celelalte exporturi ale editorului (consultați [Exportarea](./file-import-export.md#exporting)).

Foaia `Checks` nu are export, iar un editor doar în citire nu oferă nici import, nici export.

## Anulare și refacere {#undo-and-redo}

Foile `Domains`, `Words` și `Terms` își păstrează fiecare propriul istoric al anulărilor, separat de cel al diagramei. În această filă, `Ctrl + Z` și `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Z` și `⌘ + Shift + Z` (Mac), precum și butoanele `Undo` și `Redo` din bara de instrumente acționează asupra foii afișate, iar bara de instrumente nu afișează butonul `Time Travel`. În foaia `Checks` nu au niciun efect.  
Anularea din fila ERD nu retrage niciodată editarea unei foi (consultați [Foile din fila Dicționar](./undo-redo.md#dictionary-sheets)).

## Taste în filă {#keys-on-the-tab}

Cât timp focusul tastaturii este în filă, acționează aceste comenzi rapide ale editorului (consultați [Comenzi rapide](./settings.md#shortcuts)):

- `Search`, `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac), deschide [căutarea rapidă](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac), trece la fila ERD și deschide [exploratorul](./explorer.md#opening-and-closing) cu focusul în câmpul său de căutare.
- `Undo` și `Redo` acționează asupra foii afișate (consultați [Anulare și refacere](#undo-and-redo)).
- `Add Column` și `Remove Column` inserează și șterg rânduri (consultați [Adăugarea și ștergerea rândurilor](#adding-and-deleting-rows)).

Cât timp este deschisă editarea unei celule, inclusiv lista domeniilor unui termen, `Search` și `Toggle Explorer` nu au niciun efect, astfel încât textul tastat nu se pierde.

Orice altă comandă rapidă a editorului rămâne în filă și nu ajunge niciodată la pânză: `Alt + N` (Windows/Linux) sau `⌥ + N` (Mac) nu adaugă niciun tabel, iar `Delete` și `Backspace` nu șterg nimic de pe pânză.  
În schimb, tastele proprii ale grilei acționează asupra foii: `Enter` editează celula, `Delete` și `Backspace` golesc celulele selectate, `Ctrl + A` (Windows/Linux) sau `⌘ + A` (Mac) selectează toate celulele, iar `Escape` anulează o editare, închide meniul grilei sau golește câmpul de căutare. Copierea, decuparea și lipirea rămân de asemenea în filă (consultați [Copierea și lipirea](#copying-and-pasting)).

## Editoare doar în citire {#read-only-editors}

Într-un editor cu atributul [`readonly`](../../api/erd-editor-element.md#readonly), fila se deschide și afișează toate foile.  
Schimbarea foilor, căutarea, selectarea, derularea, redimensionarea coloanelor și copierea funcționează ca de obicei, la fel ca saltul la o verificare din foaia `Checks` cu `Enter` sau cu un dublu clic. Apar și marcajele verificărilor.

Nicio celulă nu acceptă o editare, o lipire sau o golire, iar fiecare celulă pe care nu o marchează nicio verificare este desenată pe fundalul gri al celulelor doar în citire.  
Comenzile `Add Row`, `Delete Rows`, `Import CSV` și `Export CSV` sunt ascunse, tastele pentru rânduri nu au niciun efect, iar un clic dreapta deschide meniul browserului. O foaie goală nu afișează niciun indiciu, iar bara de instrumente nu afișează butoanele `Undo` și `Redo`.

## Colaboratorii și fișierul {#collaborators-and-the-file}

Fișierul diagramei conține cuvintele, termenii și domeniile în ordinea din foi, inclusiv cea dată de o sortare, și omite un rând care nu conține nicio valoare.  
Conține de asemenea numele logic al fiecărui tabel și al fiecărei coloane, dacă fiecare nume fizic este gestionat de dicționare și legătura fiecărei coloane cu domeniul, cât timp domeniul este listat. Verificările și marcajele se calculează din acestea și nu se salvează niciodată.

Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), editoarele văd reciproc editările din dicționare pe măsură ce ajung, inclusiv sortările și inserările. Fiecare își păstrează propria foaie, căutare și selecție, iar istoricele foilor sale conțin doar propriile editări.  
O editare sau o lipire pe un rând pe care un colaborator l-a șters între timp nu salvează nimic și apare notificarea `Nothing saved: the row was removed`.  
Un editor dintr-o versiune anterioară filei Dicționar salvează diagrama fără numele logice, legăturile cu domeniile și dicționarele ei (consultați [Combinarea versiunilor](../../api/advanced/collaborative-editing.md#mixing-releases)).

Comanda `Import` dintr-un fișier Schemă SQL, GraphQL, DBML sau AML păstrează dicționarele, comanda `Import` dintr-un fișier JSON le înlocuiește cu cele din fișier, iar `Import and Add` nu aduce niciunul (consultați [Importarea fișierelor externe](./file-import-export.md#importing-external-files)).  
Un agent de programare editează cuvintele, termenii și domeniile, setează nume logice și domenii, derivă din nou numele fizice și listează verificările prin serverul MCP (consultați [Dicționare](../../mcp/tools.md#dictionaries) și [Verificările dicționarelor](../../mcp/tools.md#dictionary-checks)). Nu are niciun instrument pentru fișiere CSV.
