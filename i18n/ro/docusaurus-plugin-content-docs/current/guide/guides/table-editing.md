---
sidebar_position: 3
description: Adăugați, selectați, reordonați și ștergeți coloane, activați sau dezactivați opțiunile coloanelor și copiați sau lipiți coloane.
---

# Editarea tabelelor

Editarea tabelelor oferă, în esență, o experiență de editare asemănătoare cu cea din Excel.  
[Modul de afișare a numelor](./logical-names.md#name-view) stabilește dacă un tabel desenează în antet și în rânduri numele, numele logice sau ambele.  
Modul de editare pornește cu `Enter` sau printr-un dublu clic pe o celulă.  
`Enter` sau `Escape` îl încheie. Ce tastați se aplică pe măsură ce tastați, așa că `Escape` păstrează textul în loc să-l readucă la forma anterioară. O [celulă Domeniu](./logical-names.md#the-domain-cell) face excepție: doar alege din lista sa și nu păstrează niciodată ce tastați. Închiderea unei [celule a numelui logic](./logical-names.md#writing-a-logical-name) pe un nume logic modificat poate completa și numele fizic.  
`Escape` lasă celula activă și tabelul selectat, iar o a doua apăsare pe `Escape` elimină atât focusul, cât și selecția. Cât timp o celulă a numelui logic își afișează [lista termenilor](./logical-names.md#completing-term-names), prima apăsare pe `Escape` închide doar lista.  
Cât timp metoda de introducere (IME) încă compune textul, `Escape` lasă modul de editare deschis.

![Adăugarea unui tabel cu Alt + N și completarea a două coloane](/img/demo-table-edit.webp)

## Adăugarea coloanelor {#adding-columns}

Se creează cu comanda rapidă `Alt + Enter` (Windows/Linux) sau `⌥ + Enter` (Mac), care adaugă o coloană în fiecare tabel selectat, sau cu butonul `+` din antetul unui tabel, care adaugă una în acel tabel.  
Prima celulă a noii coloane primește focusul, adică prima pe care o desenează rândul ei în [ordinea coloanelor](./settings.md#adjusting-column-order). În ordinea implicită, aceasta este numele ei, care în modul `Logical Names` este numele logic, iar în `Both Names` celula ei `Logical Name` (consultați [Afișare nume](./logical-names.md#name-view)).  
O coloană adăugată cu `Tab` din ultima celulă și cheia primară pe care o trasare de relație o adaugă unui tabel părinte care nu are una încep tot pe acea celulă.

## Tasta Tab {#tab-key}

Apăsați `Tab` pentru a trece direct în modul de editare al celulei următoare.  
Apăsarea tastei `Tab` în ultima celulă creează o coloană nouă și deschide prima ei celulă pentru editare (consultați [Adăugarea coloanelor](#adding-columns)).  
Folosiți `Shift + Tab` pentru a trece în modul de editare al celulei anterioare.  
`Tab` și `Shift + Tab` trec, în ordine, prin celulele pe care le desenează tabelul, așa că modul de afișare a numelor și opțiunea View Option → `Domain` stabilesc dacă printre ele se află celulele numelui logic și celulele Domeniu (consultați [Scrierea unui nume logic](./logical-names.md#writing-a-logical-name)).  
Marcajele de [cheie alternativă](./table-related-functions.md#alternate-keys) desenate după ultima celulă a unui rând nu sunt celule, așa că focusul tastaturii trece peste ele și nu se deschid niciodată pentru editare.

![Parcurgerea celulelor unui rând cu Tab, adăugarea unei coloane din ultima celulă și revenirea cu Shift + Tab](/img/demo-table-tab.webp)

## Completarea automată a tipului de date {#datatype-autocomplete}

Începeți să editați o celulă `DataType` și tastați. Sunt sugerate tipurile din baza de date selectată care se potrivesc, iar partea unei sugestii care conține literal ce ați tastat este evidențiată.  
Potrivirea în sine este aproximativă, așa că `vch` găsește și `VARCHAR`.

- `Arrow Up` sau `Arrow Down`: deplasarea prin sugestii
- `Arrow Right`, `Tab` sau `Enter`: acceptarea sugestiei evidențiate
- `Arrow Left`: revenirea la textul pe care l-ați tastat

De asemenea, puteți face clic pe o sugestie.  
Lista afișează cel mult zece sugestii odată, iar restul se derulează.  
Nimic nu este impus, așa că un tip care nu se află în listă poate fi tastat liber, inclusiv cu argumente, de exemplu `VARCHAR(255)`. Lista se închide de îndată ce textul tastat trece dincolo de un nume de tip complet, cum se întâmplă cu `VARCHAR(255)` sau `BIGINT UNSIGNED`.  
Sugestiile urmează baza de date selectată. Schimbarea bazei de date modifică ce se propune și lasă coloanele existente așa cum sunt.

Tastarea în celula `DataType` a unei coloane legate de un domeniu sau acceptarea unei sugestii acolo elimină legătura coloanei cu domeniul de îndată ce tipul ei diferă de cel al domeniului (consultați [Domenii și tipuri de date](./dictionary.md#domains-and-data-types)).  
În modul `Logical Names`, cât timp opțiunea View Option → `Domain` este dezactivată, celula tipului unei coloane legate de un domeniu cu nume afișează numele domeniului, iar editarea ei deschide [selectorul de domeniu](./logical-names.md#the-domain-cell) în locul acestor sugestii. O celulă a tipului care afișează un tip de date îl editează ca mai sus.

![Completarea celulelor DataType din sugestii aproximative cu tastele săgeți, Tab și Enter](/img/demo-data-type-autocomplete.webp)

## Non-NULL, Unic, Autoincrementare {#not-null-unique-auto-increment}

Aceste trei celule sunt comutatoare, nu text.  
Faceți dublu clic pe una dintre ele sau apăsați `Enter` cât timp are focusul, pentru a-i inversa valoarea.

Celula Non-NULL afișează `N-N` când indicatorul este activat și `NULL` când nu este.  
`UQ` și `AI` sunt estompate când sunt dezactivate și evidențiate când sunt activate.

![Comutarea indicatorului non-NULL cu un dublu clic și a indicatorilor unic și autoincrementare cu Enter](/img/demo-column-options.webp)

Celulele ascunse de [opțiunile de afișare a tabelelor](./table-related-functions.md) nu pot fi comutate.

## Selectarea mai multor coloane {#selecting-multiple-columns}

Sunt acceptate cinci metode:

- `Shift + Arrow Up/Down`: extinderea selecției câte un rând
- `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac): adăugarea unei singure coloane
- `Shift + click`: selectarea intervalului de la ultima coloană activă
- `Ctrl + Shift + click` (Windows/Linux) sau `⌘ + Shift + click` (Mac): adăugarea acelui interval la selecție
- `Alt + A` (Windows/Linux) sau `⌥ + A` (Mac): selectarea totală

![Selectarea coloanelor cu Shift + Arrow Down, Ctrl/⌘ + click, Shift + click și Alt + A](/img/demo-column-select.webp)

Pentru a muta împreună coloanele selectate, glisați mânerul de lângă coloana activă (consultați [Reordonarea și mutarea coloanelor](#rearranging-and-moving-columns)).

Un clic dreapta pe rândul unei coloane stabilește asupra căror coloane acționează meniul contextual al tabelului, indiferent ce tastă de modificare este ținută apăsată.  
Pe un rând deja selectat, selecția rămâne, iar focusul se mută pe acel rând. Pe orice alt rând, se selectează doar acel rând. Acest lucru este valabil oriunde pe rând, inclusiv pe pictograma cheii și pe un marcaj de [cheie alternativă](./table-related-functions.md#alternate-keys).  
Așadar, pentru a acționa din meniu asupra mai multor coloane, ca în [Cheie primară pe coloană](#column-primary-key) sau [Ștergerea coloanelor](#column-deletion), faceți clic dreapta pe unul dintre rândurile selectate.  
Pe Mac, `Ctrl + click` deschide și el meniul, dar contează ca un clic obișnuit, așa că pe o celulă selectează doar acel rând înainte să se deschidă meniul.

## Reordonarea și mutarea coloanelor {#rearranging-and-moving-columns}

O coloană se mută cu mânerul ei de glisare, un buton mic cu o pictogramă de prindere, aflat chiar în afara marginii din stânga a tabelului, lângă rândul activ.  
Puneți focusul pe orice celulă a coloanei, făcând clic pe ea sau cu tastele săgeți ori cu `Tab`, iar mânerul apare lângă rândul ei. Niciun rând nu are mâner cât timp focusul se află pe antetul tabelului.  
Mânerul este desenat estompat până când indicatorul ajunge pe el, iar atunci indicatorul se transformă într-o mână. O simplă apăsare nu face nimic: glisarea începe de îndată ce indicatorul se mișcă și poate duce coloana în alt loc din tabelul ei sau într-un alt tabel.  
Deasupra rândurilor unui tabel, rândurile glisate se mută în poziție, iar rândurile din jurul locului în care le lăsați se dau la o parte pentru a face loc. Deasupra unei zone goale a pânzei sau deasupra antetului unui tabel care are coloane, o copie translucidă a rândurilor urmează indicatorul și afișează celulele numelui și tipului fiecărui rând așa cum le desenează rândul în [modul de afișare a numelor](./logical-names.md#name-view) curent.  
Lăsați coloana chiar sub ultimul rând al unui tabel pentru a o muta la sfârșitul acelui tabel. Pe un tabel fără coloane, o puteți lăsa oriunde. Banda din imediata stângă a unui tabel, unde se află mânerul, contează și ea drept rândurile tabelului, așa că o glisare drept în jos de-a lungul mânerului reordonează coloanele fără ca indicatorul să intre în tabel.  
O coloană mutată într-un alt tabel își păstrează numele logic și domeniul.

![Mutarea focusului pe o coloană și glisarea mânerului de lângă rândul ei într-o poziție nouă, apoi glisarea mânerului altei coloane într-un alt tabel](/img/demo-column-move.webp)

Pentru a muta mai multe coloane deodată, [selectați-le](#selecting-multiple-columns) și glisați mânerul de lângă coloana activă. Cât timp coloana activă este una dintre două sau mai multe coloane selectate ale tabelului ei, mânerul le poartă pe toate; altfel, își poartă doar propria coloană.  
Nu este necesară nicio tastă de modificare. Ținerea apăsată a tastei `Alt` (Windows/Linux) sau `⌥` (Mac) pe mâner mută coloanele la fel ca o glisare obișnuită și nu duplică nimic.

![Selectarea a trei coloane, apoi glisarea mânerului de lângă coloana activă într-un alt tabel, celelalte coloane selectate mutându-se odată cu ea](/img/demo-column-multi-move.webp)

O glisare care începe pe rândul unei coloane, și nu pe mânerul ei, mută tabelul, la fel ca o glisare pe antetul acestuia (consultați [Mutarea mai multor tabele](./table-related-functions.md#moving-multiple-tables)). `Alt + drag` (Windows/Linux) sau `⌥ + drag` (Mac) pe un rând duplică tabelul (consultați [Duplicarea tabelelor și notelor](./table-related-functions.md#duplicating-tables-and-memos)).  
Niciun mâner nu este desenat la un zoom de `70%` sau mai mic, unde tabelele își afișează doar numele, și nici într-un editor doar în citire, așa că acolo coloanele nu pot fi reordonate.  
O tragere de coloană în curs în momentul în care editorul devine doar în citire se încheie imediat: copia care urmărea cursorul și mâna de prindere dispar, iar eliberarea nu mută nicio coloană. Rândurile pe care tragerea le mutase deja rămân unde le-a mutat.

## Ștergerea coloanelor {#column-deletion}

Șterge coloanele selectate ale tabelului activ. Un clic pe o celulă îi selectează coloana, așa că un clic pe o celulă urmat de apăsarea tastei `Delete` elimină acea singură coloană.  
Comenzi rapide:

- `Delete` sau `Backspace`. Acestea elimină coloanele selectate cât timp tabelul lor este singurul element selectat. Fără nicio coloană selectată (cu focusul pe numele, pe [numele logic](./logical-names.md#name-view) sau pe comentariul tabelului), când mai este selectat și altceva sau la un zoom de `70%` sau mai mic, unde tabelele își afișează doar numele, ele elimină în schimb întreaga selecție (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)).
- `Alt + Backspace` sau `Alt + Delete` (Windows/Linux), `⌥ + Backspace` sau `⌥ + Delete` (Mac). Acestea elimină coloanele selectate ale tabelului activ chiar și când sunt selectate și alte tabele sau note. Nu elimină nimic cât timp se editează o celulă sau la un zoom de `70%` sau mai mic.

![Ștergerea unei coloane, apoi a două coloane selectate, cu Alt + Backspace](/img/demo-column-remove.webp)

Meniul contextual al tabelului face același lucru. Cu tabelul ca singur element selectat, faceți clic dreapta pe rândul unei coloane: ultimul element al meniului afișează `Delete column` sau `Delete columns` când coloana acelui rând este una dintre două sau mai multe coloane selectate.

Cât timp se editează o celulă, `Delete` și `Backspace` doar șterg text. Ținute apăsat în afara editorului celulei, elimină o singură dată.  
După o eliminare, focusul se mută pe cea mai apropiată coloană rămasă deasupra celei active. Când deasupra ei nu a mai rămas niciuna, focusul se mută pe numele tabelului (în modul `Logical Names`, pe numele logic desenat în locul lui), chiar dacă dedesubt rămân coloane, așa că următoarea apăsare pe `Delete` sau `Backspace` elimină tabelul, nu o coloană.  
Relațiile și indexurile care folosesc o coloană eliminată sunt eliminate odată cu ea. Nu se cere nicio confirmare, iar întreaga eliminare este un singur pas de anulare.

## Copierea/lipirea coloanelor {#copyingpasting-columns}

Funcționează ca un clipboard bazat pe tabele.  
Comenzi rapide: `Ctrl + C` (Windows/Linux) sau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) sau `⌘ + V` (Mac)

Copierea într-o foaie de calcul, lipirea dintr-una și lipirea în tabelul în care este activă o celulă de coloană folosesc celulele pe care le afișează tabelele, în ordinea în care le afișează (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options), [Ajustarea ordinii coloanelor](./settings.md#adjusting-column-order) și [Afișare nume](./logical-names.md#name-view)). Modul de afișare a numelor schimbă ce conțin unele dintre aceste celule:

- În modul `Logical Names`, celula numelui conține numele logic sau nimic, cât timp acesta este necompletat. Cât timp opțiunea View Option → `Domain` este dezactivată, celula tipului conține numele domeniului coloanei acolo unde afișează unul și tipul de date în rest.
- În modul `Both Names`, celula `Logical Name` se copiază și se lipește acolo unde o plasează ordinea coloanelor.
- O celulă Domeniu afișată conține numele domeniului sau nimic, pentru o coloană care nu afișează niciun domeniu.

Coloanele copiate în editor și lipite cu antetul unui tabel selectat sau în celelalte tabele selectate preiau toate celulele coloanelor copiate, inclusiv pe cele ascunse, de exemplu Unic și Autoincrementare, precum și numele lor logice.  
Ele păstrează legătura cu domeniul doar cât timp această diagramă listează exact același domeniu, nu doar unul cu același nume, iar domeniul are în continuare tipul coloanei copiate. Altfel, ajung nelegate, cu tipul cu care au fost copiate. Numele lor sunt considerate scrise de dumneavoastră, cu excepția cazului în care un nume lipit este gol și numele logic derivă unul (consultați [Derivarea numelor fizice](./dictionary.md#deriving-physical-names)).  
Marcajele de [cheie alternativă](./table-related-functions.md#alternate-keys), de exemplu `AK1.1`, nu sunt celule, așa că copierea și lipirea le omit chiar și cât timp sunt afișate.

Puteți lipi din editor în Excel și din Excel înapoi în editor.  
Valorile celulelor se copiază exact cum au fost tastate, așa că o valoare, de exemplu `<label>` sau `a &amp; b`, ajunge neschimbată într-o foaie de calcul sau într-un document.  
Coloanele foii de calcul sunt asociate celulelor vizibile după poziție, nu după nume, așa că coloanele foii trebuie să le respecte ordinea.  
Pentru coloanele de mai jos, oricare dintre aceste valori este interpretată drept adevărată (indiferent de majuscule):

- Autoincrementare: `TRUE`, `1`, `YES`, `Y`
- Unic: `TRUE`, `1`, `YES`, `Y`
- Non-NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

La copierea în afara editorului, acesta scrie `TRUE` sau `FALSE` pentru indicatorii de autoincrementare și unic, iar `NOT NULL` sau `NULL` pentru indicatorul non-NULL.  
Celulele Unic și Autoincrementare sunt ascunse implicit, așa că `TRUE` și `FALSE` se scriu și se citesc doar după ce aceste celule sunt afișate.

![Lipirea a patru coloane într-o foaie de calcul, cu indicatorii scriși ca TRUE/FALSE și NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Lipirea a trei rânduri dintr-o foaie de calcul într-un tabel, ca coloane, cu YES, 1 și NOT NULL interpretate drept adevărate](/img/demo-copy-sheet-column.webp)

Locul în care ajunge o lipire depinde de focus:

- Cu antetul unui tabel selectat, rândurile lipite se adaugă drept coloane noi în fiecare tabel selectat.
- Cu o celulă de coloană activă, rândurile selectate ale acelui tabel, apoi rândurile de sub ultimul dintre ele, sunt suprascrise în ordine, atâtea câte au fost lipite. Rândurile aflate între selecții separate sunt sărite. Un rând suprascris preia valorile lipite în celulele sale vizibile și le păstrează pe cele ascunse, iar rândurile rămase se adaugă drept coloane noi. În fiecare dintre celelalte tabele selectate, rândurile lipite se adaugă drept coloane noi.

![Copierea a două coloane și lipirea lor simultan în două tabele selectate](/img/demo-copy-column-multi.webp)

Un rând lipit scrie numele logice și domeniile astfel:

- Un nume logic, dintr-o celulă `Logical Name` sau din celula numelui în modul `Logical Names`, este considerat tastat integral. Cât timp numele coloanei este gol sau încă derivat, [dicționarele](./dictionary.md#deriving-physical-names) derivă din el numele fizic și leagă domeniul pe care îl dă termenul său, cu excepția cazului în care propria celulă Domeniu a rândului leagă unul. Un nume lipit de același rând se păstrează și este considerat scris de dumneavoastră.
- O celulă Domeniu sau, în modul `Logical Names`, cât timp opțiunea View Option → `Domain` este dezactivată, celula tipului leagă domeniul numit de textul ei, dacă diagrama listează unul. Orice alt text sau o celulă goală nu leagă niciun domeniu și elimină legătura coloanei, chiar și cu un domeniu de tipul lipit. Textul din celula tipului care nu numește niciun domeniu este interpretat ca tip de date. Rândurile copiate în editor leagă în schimb domeniul cu care au fost copiate și doar cât timp această diagramă îl listează cu tipul copiat, la fel ca în cazul coloanelor noi.
- Un domeniu legat dă coloanei tipul său de date, cu excepția cazului în care rândul lipește un tip propriu. Atunci un domeniu de alt tip nu este legat, iar coloana preia tipul lipit.
- Într-un rând fără celulă Domeniu, un tip lipit elimină legătura coloanei cu un domeniu de alt tip, la fel ca tastarea lui.
- Nicio lipire nu propagă un tip prin [sincronizarea tipului de date în relații](./settings.md#relationship-datatype-sync).

## Copierea/lipirea tabelelor și notelor {#copyingpasting-tables-and-memos}

Când nu este selectată nicio coloană în interiorul unui tabel activ, aceleași comenzi rapide copiază chiar tabelele și notele selectate (consultați [Funcții pentru tabele](./table-related-functions.md)).

## Cheie primară pe coloană {#column-primary-key}

Activează sau dezactivează cheia primară pe coloana activă, adică pe coloana căreia îi aparține celula activă.  
Când coloana activă este una dintre două sau mai multe coloane selectate, comutarea se aplică tuturor coloanelor selectate: dacă oricare dintre ele nu este cheie, toate devin chei, iar dacă toate sunt deja chei, cheia este eliminată de pe toate. Coloanele din afara selecției rămân neschimbate.  
Folosiți meniul contextual al tabelului ori comanda rapidă `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac). Când comutarea cuprinde două sau mai multe coloane, elementul de meniu afișează `Primary Key on selected columns` în loc de `Primary Key`.  
Pictograma cheii de pe rând are doar rol de afișare, așa că un clic pe ea nu setează cheia.

Pentru a face din mai multe coloane o singură cheie compusă, [selectați-le](#selecting-multiple-columns), apoi apăsați `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac) ori faceți clic dreapta pe unul dintre rândurile selectate și alegeți `Primary Key on selected columns`. Fiecare comutare este un singur pas de anulare.

![Selectarea a două coloane cu Shift + Arrow Down, apoi transformarea ambelor în cheie primară cu ⌥ + K și eliminarea cheii de pe ambele cu o a doua apăsare](/img/demo-column-pk.webp)

## Editoare doar în citire {#read-only-editors}

Într-un editor [`readonly`](../../api/erd-editor-element.md#readonly), nicio celulă nu se deschide pentru editare și nicio coloană nu se schimbă.  
Un clic pe o celulă nu dă focus nimănui și șterge selecția lăsată de un salt. `Enter` și un dublu clic nu deschid niciun editor și nu comută nimic, `Tab` este lăsat paginii, iar comenzile rapide care adaugă, selectează toate sau șterg coloane, comutarea cheii primare și o lipire nu fac nimic.  
Saltul la o coloană din [Explorator](./explorer.md#going-to-a-row) sau din [Căutare rapidă](./quick-search.md) dă focus celulei ei. Tastele săgeți mută apoi focusul de la o celulă la alta, coloana la care ajung fiind selectată singură, deoarece `Shift` nu adaugă acolo nicio coloană.  
`Ctrl + C` (Windows/Linux) sau `⌘ + C` (Mac) copiază în continuare coloana selectată sau tabelul selectat de un salt (consultați [Copierea/lipirea coloanelor](#copyingpasting-columns)).
