---
sidebar_position: 3
description: Adăugați, selectați, reordonați și ștergeți coloane, activați sau dezactivați opțiunile coloanelor și copiați sau lipiți coloane.
---

# Editarea tabelelor

Editarea tabelelor oferă, în esență, o experiență de editare asemănătoare cu cea din Excel.  
Modul de editare pornește cu `Enter` sau printr-un dublu clic pe o celulă.  
`Enter` sau `Escape` îl încheie. Ce tastați se aplică pe măsură ce tastați, așa că `Escape` păstrează textul în loc să-l readucă la forma anterioară.  
`Escape` lasă celula activă și tabelul selectat, iar o a doua apăsare pe `Escape` elimină atât focusul, cât și selecția.  
Cât timp metoda de introducere (IME) încă compune textul, `Escape` lasă modul de editare deschis.

![Adăugarea unui tabel cu Alt + N și completarea a două coloane](/img/demo-table-edit.webp)

## Adăugarea coloanelor {#adding-columns}

Se creează cu comanda rapidă `Alt + Enter` (Windows/Linux) sau `⌥ + Enter` (Mac).  
Se adaugă câte o coloană în fiecare tabel selectat.

## Tasta Tab {#tab-key}

Apăsați `Tab` pentru a trece direct în modul de editare al celulei următoare.  
Apăsarea tastei `Tab` în ultima celulă creează o coloană nouă.  
Folosiți `Shift + Tab` pentru a trece în modul de editare al celulei anterioare.  
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

Un clic dreapta pe rândul unei coloane stabilește asupra căror coloane acționează meniul contextual al tabelului, indiferent ce tastă de modificare este ținută apăsată.  
Pe un rând deja selectat, selecția rămâne, iar focusul se mută pe acel rând. Pe orice alt rând, se selectează doar acel rând. Acest lucru este valabil oriunde pe rând, inclusiv pe pictograma cheii și pe un marcaj de [cheie alternativă](./table-related-functions.md#alternate-keys).  
Așadar, pentru a acționa din meniu asupra mai multor coloane, ca în [Cheie primară pe coloană](#column-primary-key) sau [Ștergerea coloanelor](#column-deletion), faceți clic dreapta pe unul dintre rândurile selectate.  
Pe Mac, `Ctrl + click` deschide și el meniul, dar contează ca un clic obișnuit, așa că pe o celulă selectează doar acel rând înainte să se deschidă meniul.

## Reordonarea și mutarea coloanelor {#rearranging-and-moving-columns}

Funcționează prin `dragging` și permite mutarea în alte tabele.  
Rândurile glisate urmează indicatorul, iar rândurile din jurul locului în care le lăsați se dau la o parte pentru a face loc.  
Lăsați coloana chiar sub ultimul rând al unui tabel pentru a o muta la sfârșitul acelui tabel. Pe un tabel fără coloane, o puteți lăsa oriunde.

![Glisarea unei coloane într-o poziție nouă, apoi într-un alt tabel](/img/demo-column-move.webp)

Permite mutarea mai multor coloane cu `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac).

![Selectarea a trei coloane și mutarea lor într-un alt tabel cu Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Ștergerea coloanelor {#column-deletion}

Șterge coloanele selectate ale tabelului activ. Un clic pe o celulă îi selectează coloana, așa că un clic pe o celulă urmat de apăsarea tastei `Delete` elimină acea singură coloană.  
Comenzi rapide:

- `Delete` sau `Backspace` (`⌫` pe Mac). Acestea elimină coloanele selectate cât timp tabelul lor este singurul element selectat. Fără nicio coloană selectată (cu focusul pe numele sau pe comentariul tabelului), când mai este selectat și altceva sau la un zoom de `70%` sau mai mic, unde tabelele își afișează doar numele, ele elimină în schimb întreaga selecție (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)).
- `Alt + Backspace` sau `Alt + Delete` (Windows/Linux), `⌥ + ⌫` sau `⌥ + Delete` (Mac). Acestea elimină coloanele selectate ale tabelului activ chiar și când sunt selectate și alte tabele sau note. Nu elimină nimic cât timp se editează o celulă sau la un zoom de `70%` sau mai mic.

![Ștergerea unei coloane, apoi a două coloane selectate, cu Alt + Backspace](/img/demo-column-remove.webp)

Meniul contextual al tabelului face același lucru. Cu tabelul ca singur element selectat, faceți clic dreapta pe rândul unei coloane: ultimul element al meniului afișează `Delete column` sau `Delete columns` când coloana acelui rând este una dintre două sau mai multe coloane selectate.

Cât timp se editează o celulă, `Delete` și `Backspace` doar șterg text. Ținute apăsat în afara editorului celulei, elimină o singură dată.  
După o eliminare, focusul se mută pe cea mai apropiată coloană rămasă deasupra celei active. Când deasupra ei nu a mai rămas niciuna, focusul se mută pe numele tabelului, chiar dacă dedesubt rămân coloane, așa că următoarea apăsare pe `Delete` sau `Backspace` elimină tabelul, nu o coloană.  
Relațiile și indexurile care folosesc o coloană eliminată sunt eliminate odată cu ea. Nu se cere nicio confirmare, iar întreaga eliminare este un singur pas de anulare.

## Copierea/lipirea coloanelor {#copyingpasting-columns}

Funcționează ca un clipboard bazat pe tabele.  
Comenzi rapide: `Ctrl + C` (Windows/Linux) sau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) sau `⌘ + V` (Mac)

Copierea într-o foaie de calcul, lipirea dintr-una și lipirea în tabelul în care este activă o celulă de coloană folosesc celulele pe care le afișează tabelele, în ordinea în care le afișează (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options) și [Ajustarea ordinii coloanelor](./settings.md#adjusting-column-order)).  
Coloanele copiate în editor și lipite cu antetul unui tabel selectat sau în celelalte tabele selectate preiau toate celulele coloanelor copiate, inclusiv pe cele ascunse, de exemplu Unic și Autoincrementare.  
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

## Copierea/lipirea tabelelor și notelor {#copyingpasting-tables-and-memos}

Când nu este selectată nicio coloană în interiorul unui tabel activ, aceleași comenzi rapide copiază chiar tabelele și notele selectate (consultați [Funcții pentru tabele](./table-related-functions.md)).

## Cheie primară pe coloană {#column-primary-key}

Activează sau dezactivează cheia primară pe coloana activă, adică pe coloana căreia îi aparține celula activă.  
Când coloana activă este una dintre două sau mai multe coloane selectate, comutarea se aplică tuturor coloanelor selectate: dacă oricare dintre ele nu este cheie, toate devin chei, iar dacă toate sunt deja chei, cheia este eliminată de pe toate. Coloanele din afara selecției rămân neschimbate.  
Folosiți meniul contextual al tabelului ori comanda rapidă `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac). Când comutarea cuprinde două sau mai multe coloane, elementul de meniu afișează `Primary Key on selected columns` în loc de `Primary Key`.  
Pictograma cheii de pe rând are doar rol de afișare, așa că un clic pe ea nu setează cheia.

Pentru a face din mai multe coloane o singură cheie compusă, [selectați-le](#selecting-multiple-columns), apoi apăsați `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac) ori faceți clic dreapta pe unul dintre rândurile selectate și alegeți `Primary Key on selected columns`. Fiecare comutare este un singur pas de anulare.

![Selectarea a două coloane cu Shift + Arrow Down, apoi transformarea ambelor în cheie primară cu ⌥ + K și eliminarea cheii de pe ambele cu o a doua apăsare](/img/demo-column-pk.webp)
