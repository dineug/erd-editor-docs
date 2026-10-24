---
sidebar_position: 10
description: Căutați în numele tabelelor, coloanelor, indexurilor și grupurilor de tabele, în numele logice, în comentarii și în note din partea de sus a exploratorului, parcurgeți potrivirile în arborele său și pe pânză și înlocuiți o potrivire sau pe toate.
---

# Găsire și înlocuire

Găsește text în întreaga diagramă, vă duce la fiecare potrivire de pe pânza ERD și înlocuiește o potrivire sau pe toate.  
Caută în opt tipuri de text: nume de tabele, comentarii de tabele, nume de coloane, comentarii de coloane, note, nume de indexuri, nume de grupuri de tabele și [numele logice](./logical-names.md) ale tabelelor și coloanelor (consultați [Unde caută](#what-it-searches)).

Se află în partea de sus a [exploratorului](./explorer.md), panoul andocat în stânga pânzei ERD, între bara de titlu a exploratorului și arborele său. Nu are un titlu propriu. De sus în jos, conține:

- Câmpul Găsire, cu cele trei [opțiuni](#options) în interiorul lui, la capăt, și săgeata `Toggle Replace` înaintea lui.
- Rândul `Replace`, restrâns inițial (consultați [Înlocuirea](#replacing)).
- Contorul, apoi săgețile sus și jos care parcurg potrivirile și butonul cu trei puncte `Search In`.
- [Tipurile de text](#what-it-searches), pe care le extinde butonul `Search In`.

Cât timp câmpul Găsire conține text, arborele exploratorului afișează potrivirile (consultați [Rezultatele](#the-results)).  
Pe o pânză scundă, căutarea își păstrează întreaga înălțime, iar arborele de sub ea ocupă spațiul rămas și se derulează.

![Deschiderea funcției Găsire și înlocuire în explorator cu ⌘ + F, parcurgerea celor șase potriviri ale lui member, apoi, cu opțiunea Preserve Case activată, înlocuirea tuturor celor șase cu user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Deschiderea și închiderea {#opening-and-closing}

`Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac), precum și comanda `Toggle Explorer` din [căutarea rapidă](./quick-search.md) sau din meniul contextual al pânzei, deschid exploratorul cu focusul pe căutare. Cursorul de text ajunge în câmpul Găsire, cu textul selectat, iar căutarea se reia fără nicio potrivire curentă.  
Butonul `Explorer` din bara de instrumente doar deschide sau închide panoul. Nu pune cursorul de text în câmpul Găsire și lasă textul căutat și potrivirea curentă așa cum erau.  
Când tasta doar readuce cursorul de text într-un explorator deja afișat, cum se întâmplă cât timp căutarea rapidă sau una dintre cele cinci casete de dialog din [Casete de dialog alături de explorator](./explorer.md#dialogs-beside-it) este deschisă, potrivirea curentă rămâne curentă.

Închiderea exploratorului, ce fac tasta și cele două elemente `Toggle Explorer` cât timp acesta este deschis și casetele de dialog pe care le închid sunt descrise în [Deschiderea și închiderea](./explorer.md#opening-and-closing) din pagina Explorator.  
[Când se retrage](./explorer.md#when-it-stands-aside) descrie cum îl ascund o altă filă și modul Zen și cum îl ascund și îl împiedică să se deschidă vizualizatorul de diferențe, călătoria în timp și previzualizarea aranjării automate. [Alături de pânză](./explorer.md#beside-the-canvas) descrie cazul unui editor prea îngust pentru el.

La redeschidere se păstrează ultimul text căutat, împreună cu textul de înlocuire, [opțiunile](#options), [tipurile de text](#what-it-searches) care erau activate, precum și dacă rândul `Replace` și tipurile de text erau extinse.  
Acestea se păstrează cât timp editorul rămâne deschis și nu se salvează în document. Un editor nou deschis pornește cu toate opțiunile dezactivate, cu rândul `Replace` și tipurile de text restrânse și doar cu cele patru tipuri de nume și `Logical names` activate (consultați [Unde caută](#what-it-searches)).

## Bara de căutare a browserului {#the-browsers-find-bar}

Cât timp editorul are focusul tastaturii, `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) îi aparține în fiecare filă, inclusiv în propriile câmpuri de text, așa că bara de căutare a browserului nu se deschide.  
Tasta trece mai departe la browser sau la aplicația gazdă cât timp este deschis vizualizatorul de diferențe, călătoria în timp sau previzualizarea aranjării automate, precum și cât timp focusul este în afara editorului.

- Aplicația web și Google Drive: bara de căutare a browserului se deschide doar în aceste două cazuri.
- VS Code: extensia lasă dezactivat widgetul de căutare propriu al VS Code în ERD Editor, așa că tasta nu deschide niciodată unul acolo.
- Obsidian: tasta ajunge la editor ori de câte ori fila diagramei este activă, în locul comenzii `Search current file` din Obsidian.
- IDE JetBrains: dacă harta de taste a IDE-ului păstrează `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) pentru sine, deschideți căutarea cu comanda `Toggle Explorer` din căutarea rapidă sau din meniul contextual al pânzei ori deschideți exploratorul cu butonul `Explorer` din bara de instrumente și faceți clic în câmpul Găsire.

O pagină care încorporează editorul poate muta sau elimina tasta (consultați [Schimbarea comenzii rapide](#changing-the-shortcut)).

## Unde caută {#what-it-searches}

Opt butoane aleg tipurile de text în care se caută, în această ordine: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` și `Logical names`.  
Inițial sunt restrânse. Butonul `Search In` de la capătul rândului contorului le extinde sub acel rând și le restrânge din nou și este evidențiat cât timp sunt afișate.  
Un buton de tip de text evidențiat este activat. Faceți clic pe unul pentru a-l activa sau dezactiva, iar căutarea se reia. Cu toate cele opt dezactivate, nu se găsește nimic.

La prima deschidere, căutarea are activate cele patru tipuri de nume, `Table names`, `Column names`, `Index names` și `Table group names`, precum și `Logical names`, așa că o redenumire nu ajunge la comentarii și note decât dacă le activați.  
`Logical names` este un singur tip, atât pentru numele logice ale tabelelor, cât și pentru cele ale coloanelor.  
Numele de indexuri sunt numele indexurilor din fila `Indexes` a panoului [Proprietăți tabel](./table-related-functions.md#indexes), nu cheile `PK_` și `UQ_` listate deasupra lor.

Nu se caută nicăieri altundeva: nu în tipurile de date, domeniul unei coloane, valorile implicite, coloanele unui index, numele bazei de date, fila [Schemă SQL](./schema-sql.md) cu scripturile sale `Before tables` și `After tables`, codul generat sau foile din fila [Dicționar](./dictionary.md), care au o [căutare proprie](./dictionary.md#searching).  
Numele logice sunt căutate indiferent ce desenează [modul de afișare a numelor](./logical-names.md#name-view), inclusiv în modul `Physical Names`, în care pânza nu afișează niciunul. Un comentariu ascuns de o [opțiune de afișare a tabelelor](./table-related-functions.md#table-view-options) este, de asemenea, căutat. Notele ascunse cu View Option → `Memos` și [grupurile de tabele](./table-groups.md#hiding-groups) ascunse cu View Option → `Table Groups` nu sunt căutate, nici chiar cu butonul lor activat, așa că comanda `Replace All` nu rescrie niciodată o notă și nu redenumește niciodată un grup pe care nu îl vedeți.

## Opțiuni {#options}

Trei comutatoare din interiorul câmpului Găsire, de la capătul lui, schimbă modul în care se potrivește textul căutat. Sunt denumite în sfaturile ecran și evidențiate cât timp sunt activate. Toate trei pornesc dezactivate, iar schimbarea unuia reia căutarea.

- `Match Case`: dacă este dezactivată, potrivirea se face indiferent de majuscule.
- `Match Whole Word`: o potrivire contează doar acolo unde nu se continuă într-un cuvânt de nicio parte. Literele, cifrele și semnele diacritice din orice sistem de scriere contează drept caractere de cuvânt, la fel și caracterul de subliniere. Prin urmare, `user` se potrivește în `user id` și `user.id`, dar nu și în interiorul cuvintelor `users`, `user_id` sau `superuser`. Un capăt al textului căutat care nu este el însuși un caracter de cuvânt, de exemplu punctul din `.id`, nu are nevoie de o limită de cuvânt acolo.
- `Use Regular Expression`: textul căutat este o expresie regulată JavaScript, întotdeauna în modul Unicode, așa că `\p{L}` funcționează. `^` și `$` se potrivesc la începutul și la sfârșitul fiecărui rând dintr-un comentariu sau dintr-o notă pe mai multe rânduri, iar `.` nu trece peste o întrerupere de rând. Secvențele de escape tastate des în nume, de exemplu `\_` și `\-`, sunt acceptate.

O expresie regulată care nu poate fi analizată, de exemplu `user(`, nu găsește nimic: contorul afișează `Invalid regular expression` cu roșu, iar câmpul Găsire este conturat cu roșu.  
Opțiunile `Match Case` și `Match Whole Word` se aplică și unei expresii regulate. O potrivire de lungime zero, de exemplu `^` folosit singur, nu este listată niciodată.

Textul simplu este căutat pe măsură ce tastați. O expresie regulată este căutată după o pauză în tastare sau imediat când apăsați `Enter`, un buton de navigare, `Replace` sau `Replace All` ori când alegeți un rând care conține o potrivire.  
Căutarea nu are o limită de timp, așa că o expresie regulată care recurge intens la backtracking poate lăsa editorul fără răspuns până se termină.

Un al patrulea comutator, `Preserve Case`, se află în interiorul câmpului `Replace`, la capătul lui, așa că apare doar cât timp rândul `Replace` este extins. Pornește dezactivat. Nu schimbă nimic din ce se găsește, ci doar modul în care comenzile `Replace` și `Replace All` scriu înlocuirea (consultați [Înlocuirea](#replacing)). Activarea sau dezactivarea lui nu declanșează nicio căutare, iar potrivirea curentă rămâne curentă.

## Rezultatele {#the-results}

Contorul, de la începutul rândului de sub câmpuri, arată unde vă aflați. Este gol cât timp câmpul Găsire este gol.

| Contor | Când |
| --- | --- |
| `No results` | Nu se potrivește nimic. |
| `12 matches` | Înainte să treceți la una dintre ele; `1 match` pentru una singură. |
| `3 of 12` | A treia potrivire este cea curentă. |
| `Invalid regular expression` | Expresia regulată nu poate fi analizată. |
| `Replaced 12 matches` | Comanda `Replace All` a modificat atâtea potriviri; `Replaced 1 match` pentru una singură. |
| `No changes` | Comanda `Replace All` nu a modificat nimic. |
| `No more matches` | O serie de apăsări pe `Replace` a revenit de unde a început (consultați [Înlocuirea](#replacing)). |

Mesajele `Replaced …`, `No changes` și `No more matches` fac loc contorului la următoarea căutare sau deplasare, inclusiv la căutarea pornită de o editare sau de o anulare.

Cât timp câmpul Găsire conține text, [arborele](./explorer.md#the-tree) exploratorului afișează rezultatele în locul întregii diagrame: doar rândurile care conțin o potrivire și rândurile de deasupra lor. Când nu se potrivește nimic sau expresia regulată nu poate fi analizată, arborele este gol. Ștergerea textului căutat readuce întregul arbore, restrâns așa cum era înainte.

- Folderele `Tables`, `Table Groups` și `Memos` apar doar când conțin o potrivire, iar contorul fiecărui folder este numărul de rânduri aflate direct sub el în rezultate.
- Sub folderul `Tables` apar tabelele care conțin o potrivire, ordonate după nume, niciodată după numele logic. Sub fiecare tabel apar câte un rând pentru fiecare potrivire din comentariul său, apoi un folder `Columns` cu coloanele care conțin o potrivire, în ordinea coloanelor, fiecare cu câte un rând pentru fiecare potrivire din comentariul său, apoi un folder `Indexes` cu indexurile al căror nume se potrivește. Nu există un folder `Foreign Keys`.
- Sub folderul `Table Groups` apar grupurile al căror nume se potrivește, ordonate după nume, fără tabelele lor. Un tabel găsit apare sub folderul `Tables`.
- Sub folderul `Memos` apar notele care conțin o potrivire, în ordinea din document, fiecare afișată prin primul său rând și cu câte un rând pentru fiecare potrivire din ea.

O potrivire dintr-un nume este evidențiată chiar în rândul acelui nume, așa că un nume care conține de două ori textul căutat este un singur rând cu două evidențieri. O potrivire din numele logic al unui tabel sau al unei coloane apare tot pe rândul acelui tabel sau al acelei coloane, niciodată pe un rând propriu.  
Aceste rânduri numesc tabelul sau coloana așa cum le afișează [modul de afișare a numelor](./logical-names.md#beyond-the-canvas), iar fiecare dintre cele două nume pe care le poate afișa un rând își evidențiază doar propriile potriviri. Un rând găsit doar în numele pe care modul său de afișare îl omite, numele logic în modul `Physical Names` sau numele în modul `Logical Names`, adaugă acel nume după cel pe care îl afișează, atenuat ca în modul `Both Names`, cu potrivirea evidențiată. Când și numele pe care îl afișează conține o potrivire, rândul afișează doar acel nume, așa că potrivirile din numele omis de modul de afișare sunt numărate și parcurse, dar nu sunt evidențiate.  
O potrivire dintr-un comentariu sau dintr-o notă are un rând propriu: o bulă de dialog pentru un comentariu de tabel sau de coloană ori un bilețel adeziv pentru o notă, apoi un fragment din text cu potrivirea evidențiată. Un text lung este trunchiat cu `…`, iar întreruperile de rând apar ca spații. Treceți cu indicatorul peste rând pentru a vedea întregul text.  
Toate celelalte rânduri arată ca în afara unei căutări: o coloană își afișează tipul de date, un index își afișează coloanele, iar un nume gol apare ca `unnamed`.

Fiecare rând care are rânduri sub el apare extins la începutul unei căutări. Un rând pe care îl restrângeți sau pe care îl restrânge butonul `Collapse All` rămâne restrâns până când o potrivire de sub el devine curentă sau până când se schimbă textul căutat, opțiunea `Match Case`, `Match Whole Word` sau `Use Regular Expression` ori un tip de text sau până când căutarea este deschisă din nou cu tasta sau cu un element `Toggle Explorer`.  
Rândul potrivirii curente este evidențiat și derulat în zona vizibilă. Arborele listează toate potrivirile, oricât de multe ar fi.  
Potrivirile sunt parcurse în ordinea arborelui: tabel cu tabel, numele logic, numele și comentariul tabelului, apoi numele logic, numele și comentariul fiecărei coloane în ordinea coloanelor, apoi numele indexurilor sale; apoi numele grupurilor de tabele; apoi notele.

Rezultatele urmăresc documentul cât timp exploratorul este afișat. După o pauză în editări, orice modificare a textelor în care se caută reia căutarea, iar potrivirea curentă rămâne curentă dacă mai există. Aceasta include editarea unui nume, a unui nume logic, a unui comentariu sau a textului unei note, adăugarea sau eliminarea unui tabel, a unei coloane, a unui index, a unei note sau a unui grup de tabele, mutarea unei coloane, precum și ascunderea sau afișarea notelor ori a grupurilor de tabele cu View Option, care scoate potrivirile lor din arbore sau le readuce. O editare pe pânză, o anulare sau o refacere, un import și o editare făcută de un colaborator sau de un agent de programare contează toate. Selectarea, mutarea tabelelor, notelor sau grupurilor pe pânză, derularea, zoomul și trecerea indicatorului nu contează.  
Nu contează nici schimbarea modului de afișare a numelor, care nu modifică niciun text citit de căutare: rămân aceleași potriviri, iar rândurile preiau numele pe care le afișează noul mod de afișare.  
Editările făcute cât timp exploratorul este închis sau nu este vizibil sunt căutate imediat ce acesta este afișat din nou.

## Salt la o potrivire {#going-to-a-match}

În câmpul Găsire, `Enter` trece la potrivirea următoare, iar `Shift + Enter` la cea anterioară. Butoanele cu săgeți sus și jos de după contor fac același lucru; sfaturile ecran ale acestora sunt `Previous Match (Shift+Enter)` și `Next Match (Enter)`, iar ele sunt dezactivate cât timp nu există nicio potrivire.  
Deplasarea se reia de la capăt în ambele direcții. Nicio potrivire nu este curentă până la prima deplasare, așa că primul `Enter` duce la prima potrivire, iar primul `Shift + Enter` la ultima.

Un clic pe un rând din rezultate sau `Enter` ori `Space` cu focusul tastaturii pe el face unul dintre următoarele lucruri:

- Un rând al cărui nume propriu sau nume logic conține o potrivire duce la prima lui potrivire, cea din numele logic înaintea celei din nume.
- Un rând care afișează un fragment dintr-un comentariu sau dintr-o notă duce la acea potrivire.
- Orice alt rând, de exemplu un tabel al cărui nume și nume logic nu se potrivesc sau rândul propriu al unei note, duce la ceea ce reprezintă rândul și lasă potrivirea curentă așa cum este (consultați [Salt la un rând](./explorer.md#going-to-a-row)).
- Un folder se restrânge sau se extinde.

Ori de câte ori o potrivire devine curentă, arborele extinde rândurile restrânse de deasupra ei și mută acolo rândul cu focusul tastaturii, așa că tastele săgeți din arbore continuă de la ea.

Saltul la o potrivire închide panoul Proprietăți tabel dacă este deschis, apoi:

- Pentru numele, numele logic sau comentariul unui tabel ori al unei coloane, selectează doar tabelul, îl aduce în prim-plan și mută celula activă pe celula care conține potrivirea. O potrivire dintr-un comentariu ascuns de o [opțiune de afișare a tabelelor](./table-related-functions.md#table-view-options) mută în schimb celula activă pe numele de lângă el. Acolo unde [modul de afișare a numelor](./logical-names.md#name-view) nu desenează nicio celulă pentru nume sau pentru numele logic, celula activă ajunge pe cea desenată în locul ei: numele în modul `Physical Names`, numele logic în modul `Logical Names`.
- Pentru numele unui index, selectează doar tabelul indexului și îl aduce în prim-plan, cu celula activă pe numele tabelului sau, în modurile `Logical Names` și `Both Names`, pe numele lui logic, cu excepția cazului în care celula activă se află deja în acel tabel. Numele indexurilor nu sunt desenate pe pânză.
- Pentru numele unui grup de tabele, selectează doar grupul și îl aduce în prim-plan împreună cu tabelele sale.
- Pentru o notă, selectează doar nota și o aduce în prim-plan.

Pânza se derulează doar când ținta saltului nu este deja bine vizibilă, iar zoomul nu se schimbă niciodată (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)).

După `Enter` în câmpul Găsire, cursorul de text rămâne acolo, iar după alegerea unui rând, focusul tastaturii rămâne în arbore, așa că ce tastați în continuare nu ajunge la tabelul selectat.  
Saltul la o potrivire nu începe niciodată trasarea unei relații și nici nu finalizează o relație aflată în curs de trasare.

## Înlocuirea {#replacing}

Rândul `Replace` este restrâns inițial. Săgeata dinaintea câmpului Găsire, al cărei sfat ecran este `Toggle Replace`, îl extinde și îl restrânge. Restrângerea lui păstrează textul de înlocuire.  
Rândul conține câmpul `Replace`, cu comutatorul `Preserve Case` în interiorul lui, la capăt, și două butoane, ale căror sfaturi ecran sunt `Replace (Enter)` și `Replace All`. Ambele butoane sunt dezactivate cât timp nu există nicio potrivire.

Comanda `Replace` se execută cu `Enter` în câmpul Înlocuire, cu sau fără `Shift`, ori cu butonul său:

- Fără o potrivire curentă, prima apăsare doar trece la potrivirea următoare, așa că vedeți ce ar modifica înainte să se modifice ceva.
- Cu o potrivire curentă, înlocuiește doar acea apariție, lăsând neatinse celelalte apariții din același text, și trece la potrivirea următoare de după textul scris. Textul scris este sărit chiar dacă conține textul căutat: înlocuirea textului `user` cu `super_user` nu se mai oprește apoi în interiorul textului `super_user`.
- O potrivire pe care înlocuirea ar rescrie-o exact cum era rămâne neschimbată, iar apăsarea doar trece la potrivirea următoare.
- Înlocuirea și derularea la potrivirea următoare formează un singur pas de anulare.

O serie de apăsări pe `Replace` se oprește după ce revine de unde a început. Contorul afișează `No more matches`, nicio potrivire nu este curentă, iar apăsările următoare nu mai înlocuiesc nimic.  
Prin urmare, textul `Customer` înlocuit cu `Big Customer` este înlocuit o singură dată, în loc să devină `Big Big Customer`.  
Saltul la o potrivire, schimbarea textului căutat, a opțiunii `Match Case`, `Match Whole Word` sau `Use Regular Expression` ori a unui tip de text, deschiderea căutării cu tasta sau cu un element `Toggle Explorer` ori comanda `Replace All` pornesc o serie nouă, la fel ca o anulare sau orice altă editare care modifică textul în care a început seria. Schimbarea textului de înlocuire sau a opțiunii `Preserve Case` nu pornește o serie nouă, și nici tasta atunci când doar readuce cursorul de text într-un explorator deja afișat.  
Cât timp durează o serie, un tabel sau un grup de tabele pe care îl redenumește își păstrează locul în arbore și în ordinea potrivirilor, așa că o redenumire care l-ar plasa mai jos în ordine nu este întâlnită din nou. Seria următoare readuce arborele în ordinea numelor, iar rândul redenumit se mută la noul său loc.

Comanda `Replace All` se execută cu `Ctrl + Enter` (Windows/Linux) sau `⌘ + Enter` (Mac) în câmpul Înlocuire ori cu butonul său:

- Înlocuiește fiecare potrivire din tipurile de text activate și nu atinge celelalte tipuri, cu excepția numelor fizice pe care le derivă un nume logic înlocuit, pe care le scrie chiar și cât timp `Table names` și `Column names` sunt dezactivate (consultați mai jos). Cu tipurile implicite, redenumește tabele, coloane, indexuri și grupuri de tabele și rescrie numele logice ale tabelelor și coloanelor; comentariile și notele rămân neatinse.
- Tot ce modifică formează un singur pas de anulare (consultați [Un gest, un pas](./undo-redo.md#one-gesture-one-step)).
- Contorul afișează `Replaced N matches`, numărând doar aparițiile al căror text s-a schimbat efectiv. Când niciuna nu s-a schimbat, afișează `No changes` și nu se înregistrează nimic în istoric, ca la înlocuirea expresiei regulate `(user)` cu `$1`.
- Apoi căutarea se reia, fără nicio potrivire curentă, așa că rezultatele pot lista potriviri conținute în textul nou.

Ambele comenzi citesc fiecare text așa cum este în momentul apăsării, nu așa cum l-a găsit ultima căutare.

Cum se folosește textul de înlocuire:

- Fără opțiunea `Use Regular Expression`, caracterul `$` nu are niciun sens special, iar textul de înlocuire este folosit așa cum a fost tastat, cu excepția literelor mari și mici pe care i le dă opțiunea `Preserve Case`.
- Cu opțiunea `Use Regular Expression`, de la `$1` până la `$99`, `$<name>`, `$&`, `` $` ``, `$'` și `$$` se expandează ca în metoda `String.prototype.replace` din JavaScript.
- Fără opțiunea `Preserve Case`, nu se păstrează literele mari și mici ale textului găsit: cu opțiunea `Match Case` dezactivată, înlocuirea textului `user` cu `member` transformă `Users` în `members`.
- Cu opțiunea `Preserve Case`, fiecare înlocuire este scrisă cu litere mari sau mici după modelul textului pe care îl înlocuiește, după ce `$1` și celelalte secvențe sunt expandate, așa că aceeași înlocuire transformă `Users` în `Members`:
  - O potrivire scrisă integral cu majuscule primește înlocuirea integral cu majuscule, iar o potrivire scrisă integral cu minuscule o primește integral cu minuscule: `USER` cu `account` dă `ACCOUNT`, iar `user` cu `Account` dă `account`.
  - Orice altă potrivire face ca primul caracter al înlocuirii să fie majusculă sau minusculă după primul caracter al potrivirii și lasă restul așa cum a fost tastat: `UserId` cu `accountKey` dă `AccountKey`, iar `uSER` cu `AccountKey` dă `accountKey`. Când primul caracter al potrivirii nu face distincție între majuscule și minuscule, înlocuirea rămâne așa cum a fost tastată: `_Ab` cu `xyz` dă `xyz`.
  - Când potrivirea și înlocuirea conțin amândouă `-` sau amândouă `_`, iar acel separator le împarte în același număr de segmente, fiecare segment este scris după modelul segmentului corespunzător: `USER_id` cu `account_key` dă `ACCOUNT_key`, iar `User-Name` cu `account-key` dă `Account-Key`. Când atât `-`, cât și `_` le împart astfel, întregul este tratat ca un singur segment.
  - O potrivire fără litere care să facă distincție între majuscule și minuscule, de exemplu `123`, lasă înlocuirea așa cum a fost tastată.
  - O potrivire rescrisă așa cum era nu se numără: cu opțiunea `Match Case` dezactivată, înlocuirea textului `customer` cu `Customer` rescrie `customer`, `Customer` și `CUSTOMER` așa cum erau și niciuna dintre ele nu este numărată.
- Un câmp Înlocuire gol șterge potrivirea.

O înlocuire este o editare obișnuită, la fel ca atunci când tastați chiar dumneavoastră noul nume de tabel, numele de coloană, numele logic, comentariul sau textul notei, redenumiți indexul în panoul Proprietăți tabel sau redenumiți grupul de tabele.  
Se înregistrează în istoric și ajunge la colaboratori și la un agent de programare ca orice altă editare.

Astfel, un nume de tabel sau de coloană scris de o înlocuire devine un nume personalizat, pe care un nume logic scris ulterior îl lasă așa cum este până când comanda [Derivare din nou a numelor fizice](./dictionary.md#derive-physical-names-again) îl trece înapoi în gestiunea dicționarelor. În schimb, un nume pe care o înlocuire îl lasă gol trece înapoi în gestiunea dicționarelor, ca orice nume golit (consultați [Nume personalizate](./dictionary.md#names-of-your-own)).  
Cât timp numele fizic al unui tabel sau al unei coloane este gol sau a fost el însuși derivat, un nume logic înlocuit îl derivă din dicționare, la fel ca închiderea celulei numelui logic pe un nume logic nou (consultați [Derivarea numelor fizice](./dictionary.md#deriving-physical-names)). În acest caz, o coloană al cărei nume logic nou este un termen preia și domeniul termenului și, odată cu el, tipul de date al domeniului. Ce derivă face parte din pasul de anulare al înlocuirii și nu este numărat în `Replaced N matches`.  
Când o singură comandă `Replace All` rescrie atât numele logic, cât și numele aceluiași tabel sau aceleiași coloane, numele pe care îl scrie are prioritate față de cel pe care l-ar deriva noul nume logic.

## Taste în câmpurile de căutare {#keys-in-the-search-fields}

- În câmpul Găsire, `Enter` trece la potrivirea următoare, iar `Shift + Enter` la cea anterioară.
- În câmpul Înlocuire, `Enter` înlocuiește, cu sau fără `Shift`, iar `Ctrl + Enter` (Windows/Linux) sau `⌘ + Enter` (Mac) înlocuiește tot.
- Cât timp o metodă de introducere compune text în oricare dintre câmpuri, `Enter` aparține compunerii și nu trece la altă potrivire și nici nu înlocuiește.

Ce fac în aceste câmpuri tasta `Escape`, comenzile rapide ale editorului care funcționează în continuare și orice altă tastă este descris în [Taste în explorator](./explorer.md#keys-in-the-explorer).

## Editoare doar în citire {#read-only-editors}

Într-un editor cu atributul [`readonly`](../../api/erd-editor-element.md#readonly), căutarea doar găsește. Nu există săgeata `Toggle Replace` și nici rândul `Replace`, deci nici câmpul Înlocuire, `Preserve Case`, `Replace` sau `Replace All`.  
Câmpul Găsire, cele trei opțiuni ale sale, tipurile de text, contorul, rezultatele și saltul la o potrivire funcționează toate. Exploratorul din jurul căutării funcționează ca în orice alt editor (consultați [Editoare doar în citire](./explorer.md#read-only-editors)).

În VS Code, o revizie a unei diagrame, de exemplu o revizie Git sau o intrare din Local History, se deschide ca text JSON. Redeschisă ca diagramă cu `Reopen Editor With...`, este doar în citire și primește această căutare care doar găsește.

## Schimbarea comenzii rapide {#changing-the-shortcut}

O pagină care încorporează editorul poate reasocia combinația `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) ori o poate elimina, sub numele `findReplace`, cu metoda [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
După eliminarea combinației, tasta rămâne la dispoziția paginii în fiecare filă. Butonul `Explorer` din bara de instrumente deschide și închide în continuare exploratorul, iar comanda `Toggle Explorer` din căutarea rapidă și din meniul contextual al pânzei deschide în continuare căutarea sau închide exploratorul, dar niciunul dintre ele nu afișează o comandă rapidă, așa că sfatul ecran al butonului este doar `Explorer`. Nici rândul `Toggle Explorer` din fila [Comenzi rapide](./settings.md#shortcuts) a setărilor nu afișează vreo tastă. După reasociere, toate afișează noua tastă.
