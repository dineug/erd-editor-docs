---
sidebar_position: 8
description: Parcurgeți tabelele diagramei, cu coloanele, indexurile și cheile lor străine, grupurile de tabele și notele ei într-un arbore andocat alături de pânza ERD și mergeți la oricare dintre ele cu un clic.
---

# Explorator

Exploratorul este un panou andocat la marginea din stânga a pânzei ERD, care listează diagrama sub formă de arbore: tabelele ei, fiecare cu coloanele, indexurile și cheile sale străine, apoi [grupurile de tabele](./table-groups.md), apoi notele. Faceți clic pe un rând pentru a merge la elementul pe care îl reprezintă pe pânză.  
Exploratorul îngustează pânza în loc să o acopere. Face parte din editorul de diagrame și nu este vizualizarea Explorer din VS Code sau exploratorul de fișiere din Obsidian.

![Deschiderea exploratorului din bara de instrumente, saltul la products, apoi la coloana status și la cheia străină member_id din orders, restrângerea cu Collapse All, lărgirea panoului și închiderea lui](/img/demo-explorer.webp)

Funcția [Găsire și înlocuire](./find-and-replace.md) se află în partea de sus a panoului, între bara de titlu și arbore. Cât timp câmpul Găsire conține text, arborele afișează doar ce se potrivește (consultați [Rezultatele](./find-and-replace.md#the-results)).  
Arborele însuși nu modifică niciodată diagrama: nu oferă redenumire, glisare, ștergere, afișare sau ascundere. O înlocuire este singura modificare pe care o face panoul.

Starea proprie a exploratorului vă aparține doar dumneavoastră: dacă este deschis, lățimea, rândurile restrânse, rândul pe care se află focusul tastaturii, poziția de derulare și căutarea.  
Nimic din aceasta nu se salvează în fișier, nu se înregistrează în istoricul anulărilor, nu se partajează cu colaboratorii și nu se stochează în browser. Se păstrează cât timp editorul rămâne deschis, la comutarea între file și între documentele încărcate în același editor. Un editor nou deschis pornește cu exploratorul închis.

## Deschiderea și închiderea {#opening-and-closing}

Deschideți exploratorul în oricare dintre aceste moduri:

- Butonul `Explorer` din bara de instrumente, imediat după `Search`, cu o pictogramă de arbore. Sfatul ecran al acestuia afișează `Explorer (Ctrl + F)` (Windows/Linux) sau `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac), comanda rapidă numită `Toggle Explorer` în fila [Comenzi rapide](./settings.md#shortcuts) din setări.
- Comanda `Toggle Explorer` din [căutarea rapidă](./quick-search.md), listată în fiecare filă. Tastarea cuvintelor `find`, `replace`, `rename`, `tree`, `outline` sau `objects` o afișează.
- Elementul `Toggle Explorer` din meniul contextual al pânzei: faceți clic dreapta pe un loc liber al pânzei ERD, în afara oricărui [grup de tabele](./table-groups.md). Se află după `New Table`, `New Memo` și `New Table Group`, înainte de `Relationship`.

Cele două elemente `Toggle Explorer` afișează comanda rapidă în dreapta.  
Butonul din bara de instrumente, comanda rapidă și elementul din căutarea rapidă funcționează din orice filă. Din fila Vizualizare, Schemă SQL, Generator de cod sau Setări, acestea trec mai întâi la fila ERD, deoarece exploratorul apare doar acolo.

Butonul din bara de instrumente doar deschide și închide panoul. Nu pune cursorul de text în câmpul Găsire și lasă deschise panoul Proprietăți tabel, configuratorul de teme și selectorul `Display Language`.  
Comanda rapidă și cele două elemente `Toggle Explorer` deschid exploratorul cu focusul pe căutare: cursorul de text ajunge în câmpul Găsire, cu textul acestuia selectat, iar oricare dintre cele cinci casete de dialog din [Casete de dialog alături de explorator](#dialogs-beside-it) se închide. Ce păstrează căutarea între deschideri este descris în [Deschiderea și închiderea](./find-and-replace.md#opening-and-closing) din Găsire și înlocuire.  
Comanda rapidă nu are niciun efect cât timp se editează o celulă de tabel, o notă sau numele unui grup de tabele.

Butonul din bara de instrumente apare apăsat cât timp exploratorul este deschis în fila ERD și nu este ascuns de [modul Zen](#when-it-stands-aside). Cât timp butonul apare apăsat, butonul, comanda rapidă și oricare dintre elementele `Toggle Explorer` închid exploratorul, iar focusul tastaturii, dacă se afla în panou, revine în editor.  
Comanda rapidă nu îl închide niciodată cât timp este deschisă căutarea rapidă sau una dintre cele cinci casete de dialog. În schimb, închide paleta sau caseta de dialog și mută focusul tastaturii în câmpul Găsire, cu textul acestuia selectat și, dacă exploratorul era deja afișat, cu potrivirea curentă păstrată. Elementul `Toggle Explorer` din căutarea rapidă nu face o astfel de excepție: rularea lui închide paleta, apoi exploratorul, dacă este deschis.

Butonul `x` din bara de titlu, al cărui sfat ecran afișează `Close`, închide și el exploratorul și mută focusul tastaturii pe pânză. Tasta `Escape` nu îl închide (consultați [Taste în explorator](#keys-in-the-explorer)).  
Redeschis, exploratorul revine la aceeași lățime, cu arborele restrâns și derulat ca înainte și cu același text căutat. Deschis cu comanda rapidă sau cu un element `Toggle Explorer`, caută din nou acel text, cu toate rezultatele extinse (consultați [Rezultatele](./find-and-replace.md#the-results)).

Când comanda rapidă sau un element `Toggle Explorer` deschide exploratorul într-un editor prea îngust pentru el, o notificare afișează `Widen the window to show the Explorer`, iar focusul tastaturii rămâne unde era (consultați [Alături de pânză](#beside-the-canvas)).  
Exploratorul este totuși deschis, cu butonul din bara de instrumente apăsat, și apare, cu căutarea deja efectuată, de îndată ce editorul este suficient de lat, fără a prelua focusul tastaturii. Deschiderea lui cu butonul din bara de instrumente nu afișează nicio notificare.

## Alături de pânză {#beside-the-canvas}

Exploratorul se întinde de-a lungul marginii din stânga a filei ERD, sub bara de instrumente, pe toată înălțimea pânzei.  
Pânza se îngustează pentru a-i face loc, astfel încât nicio parte a diagramei nu se află sub panou, iar [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar), miniharta și [ecranul de bun venit](./editing-start.md#welcome-screen) se află toate în pânză, alături de el.  
Deschiderea, închiderea sau redimensionarea exploratorului nu derulează diagrama și nu înregistrează nimic în [istoricul anulărilor](./undo-redo.md#what-the-history-records).

Într-un editor nou deschis, are inițial o lățime de `260px`. Glisați marginea sa din dreapta pentru a-i seta orice lățime între `200px` și `480px` sau faceți dublu clic pe margine pentru a reveni la `260px`.

Pânza păstrează întotdeauna o lățime de cel puțin `320px` alături de explorator:

- Într-un editor mai îngust decât lățimea exploratorului plus `320px`, exploratorul este desenat mai îngust pentru a încăpea, până la `200px`.
- Într-un editor mai îngust de `520px`, exploratorul se retrage. Nu este desenat, dar rămâne deschis, astfel că butonul din bara de instrumente apare în continuare apăsat, iar o apăsare pe el îl închide. De îndată ce editorul este suficient de lat, revine la propria lățime.

Contează lățimea editorului însuși, nu a ferestrei browserului, chiar dacă notificarea din [Deschiderea și închiderea](#opening-and-closing) vorbește despre fereastră.

Într-o [limbă de afișare scrisă de la dreapta la stânga](./language-and-theme.md#right-to-left-languages), exploratorul rămâne în stânga pânzei, deoarece pânza nu este niciodată afișată în oglindă.  
Conținutul său se citește de la dreapta la stânga: bara de titlu, căutarea și rândurile sunt în oglindă, iar rândurile se indentează din dreapta. Marginea pe care o glisați rămâne în partea sa dreaptă, lângă pânză. Tipurile de date, coloanele de index și textul cheilor străine își păstrează ordinea de la stânga la dreapta.

## Când se retrage {#when-it-stands-aside}

Exploratorul apare doar în fila ERD.  
Trecerea la altă filă îl ascunde, iar butonul din bara de instrumente nu mai apare apăsat. La revenirea în fila ERD, apare din nou așa cum l-ați lăsat, restrâns și derulat la fel.

Cât timp este deschis [vizualizatorul de diferențe](./table-related-functions.md#diff-viewer), [călătoria în timp](./undo-redo.md#time-travel) sau previzualizarea [aranjării automate](./table-related-functions.md#auto-layout), nimic nu deschide și nu închide exploratorul:

- Un explorator deschis este ascuns și apare din nou după ce acestea se închid.
- Butonul din bara de instrumente este estompat și nu are niciun efect.
- Căutarea rapidă nu mai listează comanda `Toggle Explorer`.
- Comanda rapidă este lăsată browserului sau aplicației gazdă (consultați [Bara de căutare a browserului](./find-and-replace.md#the-browsers-find-bar)).

Vizualizatorul de diferențe își listează modificările într-un arbore de același tip (consultați [Vizualizator de diferențe](./table-related-functions.md#diff-viewer)).

Activarea [modului Zen](./table-related-functions.md#canvas-toolbar) cu `Alt + Z` (Windows/Linux) sau `⌥ + Z` (Mac) ascunde un explorator deschis fără a-l închide, iar dezactivarea modului Zen readuce exploratorul.  
În modul Zen, comanda rapidă și cele două elemente `Toggle Explorer` deschid în continuare exploratorul cu focusul pe căutare, iar modul Zen rămâne activat. Exploratorul se întinde atunci pe toată înălțimea editorului, deoarece bara de instrumente de sus lipsește, și rămâne afișat când modul Zen este dezactivat. Reactivarea modului Zen îl ascunde din nou.

Ori de câte ori panoul dispare cât timp focusul tastaturii se află în el, fie că este închis, ascuns sau retras, focusul tastaturii revine în editor.

## Arborele {#the-tree}

Bara de titlu afișează `Explorer` și conține două butoane: `Collapse All` și butonul `x`, care închide exploratorul. Sub ea se află căutarea (consultați [Găsire și înlocuire](./find-and-replace.md)), iar sub aceasta, arborele.

Nivelul superior conține trei foldere, în această ordine: `Tables`, `Table Groups` și `Memos`. Sub fiecare tabel se află propriile sale foldere `Columns`, `Indexes` și `Foreign Keys`.  
Un folder gol nu este afișat, astfel că o diagramă goală nu afișează niciun rând. Folderul `Table Groups` este omis și cât timp [View Option](./table-related-functions.md#table-view-options) → `Table Groups` ascunde grupurile, iar folderul `Memos`, cât timp View Option → `Memos` ascunde notele.  
Un rând de folder afișează o pictogramă de folder, numele folderului și, la capătul opus, un contor al rândurilor aflate direct sub el, astfel că contorul de lângă `Tables` indică numărul de tabele din diagramă.

Tabelele sunt listate după nume, indiferent de majuscule, iar tabelele cu același nume păstrează ordinea din document. Grupurile de tabele sunt listate la fel, ca și tabelele din fiecare grup. Coloanele unui tabel păstrează ordinea proprie a tabelului, iar indexurile, cheile străine și notele păstrează ordinea din document.  
Arborele urmează diagrama pe măsură ce aceasta se modifică, fie printr-o editare pe pânză, o anulare sau o refacere ori un import, fie prin acțiunea unui colaborator sau a unui agent de programare, astfel că redenumirea unui tabel îi mută rândul.

Fiecare tip de rând afișează:

- Un tabel: o pictogramă de tabel și numele tabelului.
- O coloană: o pictogramă de cheie pentru o coloană cheie primară sau cheie străină, colorată așa cum celula de cheie a tabelului colorează o cheie primară, o cheie străină sau ambele, și o pictogramă de listă pentru orice altă coloană. Apoi numele coloanei și, cu text estompat, tipul de date urmat de `PK`, `FK` sau ambele, de exemplu `id` `BIGINT PK` sau `user_id` `BIGINT FK`.
- Un index: o pictogramă de index și numele indexului. Apoi, cu text estompat, `UNIQUE` pentru un index unic și coloanele sale între paranteze, în ordinea din index, cu `DESC` după o coloană descendentă, de exemplu `orders_user_idx` `UNIQUE (user_id DESC, total)` sau doar `(total)`.
- O cheie străină: listată doar sub tabelul copil, cel care conține coloanele cheie străină, și doar cât timp tabelul părinte se află în diagramă. Pictograma sa de cheie preia culoarea conectorului: culoarea cheii primare și a cheii străine pentru o [relație identificatoare](./relationship-editing.md#identifying-relationships), altfel culoarea cheii străine. Afișează coloanele cheie ale tabelului copil, separate prin virgulă, apoi, cu text estompat, `→` cu tabelul părinte și coloanele acestuia, de exemplu `user_id` `→ users(id)`.
- Un grup de tabele: un punct în culoarea grupului, gri pentru un grup fără culoare, și numele grupului. Tabelele sale sunt listate sub el după nume și fiecare duce la tabelul său. Un grup fără tabele nu are nimic de extins.
- O notă: o pictogramă de notă adezivă și prima linie a notei.

Un nume gol sau o notă a cărei primă linie este goală apare ca `unnamed`, cu caractere cursive.  
Într-un panou îngust, textul estompat este trunchiat cu `…` înainte ca numele să fie trunchiat. Treceți cu indicatorul peste un nume sau peste textul său estompat pentru a-l vedea complet.

Inițial, doar folderul `Tables` este extins. Faceți clic pe un rând de folder sau apăsați `Enter` ori `Space` pe el pentru a-l restrânge sau a-l extinde.  
Săgeata de la începutul unui rând restrânge sau extinde acel rând fără a face niciun salt. Fiecare rând de tabel are una, chiar și cel al unui tabel fără nimic sub el. Și tastele `→` și `←` restrâng și extind (consultați [Taste în explorator](#keys-in-the-explorer)).  
Butonul `Collapse All` restrânge câte un nivel la fiecare apăsare: cel mai adânc nivel de rânduri extinse aflate la vedere, astfel că apăsările restrâng de jos în sus. Apăsarea care ajunge la nivelul superior restrânge toate rândurile, inclusiv pe cele aflate sub un rând deja restrâns, lăsând doar folderele de pe nivelul superior.  
Editările, anularea și refacerea, precum și modificările făcute de colaboratori sau de un agent de programare lasă rândurile restrânse și extinse neschimbate.

## Salt la un rând {#going-to-a-row}

Faceți clic pe un rând sau apăsați `Enter` ori `Space` cu focusul tastaturii pe el pentru a merge la elementul pe care îl reprezintă pe pânza ERD. Un rând de folder doar se restrânge sau se extinde, iar tastele săgeți doar mută focusul în arbore.

- Un rând de tabel sau un tabel listat sub un grup selectează doar acel tabel și îl aduce în prim-plan. Celula activă trece pe numele tabelului, cu excepția cazului în care se află deja în acel tabel.
- Un rând de coloană selectează doar tabelul coloanei și pune celula activă pe numele coloanei.
- Un rând de index selectează tabelul indexului, ca un rând de tabel. Indexul însuși nu este selectat separat; indexurile se editează în panoul [Proprietăți tabel](./table-related-functions.md#indexes).
- Un rând de cheie străină aduce în câmpul vizual ambele tabele ale relației deodată sau tabelul copil atunci când cele două sunt prea departe unul de altul pentru a fi afișate împreună. Selectează doar tabelul copil, împreună cu coloanele lui cheie străină, cu celula activă pe prima dintre ele, și evidențiază conectorul relației (consultați [Citirea unui conector](./relationship-editing.md#reading-a-connector)).
- Un rând de grup de tabele aduce în câmpul vizual chenarul grupului, orientându-se după bara de titlu, selectează doar grupul și îl aduce în prim-plan împreună cu tabelele sale.
- Un rând de notă selectează doar nota și o aduce în prim-plan.

Vizualizarea se mută după regula comună tuturor salturilor: nivelul de zoom nu se schimbă niciodată, iar pânza se derulează doar atunci când elementul la care mergeți nu este deja bine vizibil (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)).  
Saltul la un rând închide mai întâi panoul Proprietăți tabel, dacă este deschis, și nu începe și nu încheie niciodată o relație în curs de trasare.  
Cât timp câmpul Găsire conține text, un rând al cărui nume conține o potrivire sau unul care afișează un fragment dintr-un comentariu sau dintr-o notă duce în schimb la acea potrivire (consultați [Salt la o potrivire](./find-and-replace.md#going-to-a-match)).

După un clic, focusul tastaturii rămâne în arbore, astfel că tastele `Delete`, `Backspace` și celelalte taste de editare nu ajung la noua selecție până când nu apăsați `Escape` sau nu faceți clic pe pânză (consultați [Taste în explorator](#keys-in-the-explorer)).

## Taste în explorator {#keys-in-the-explorer}

Arborele reprezintă o singură oprire pentru tasta `Tab` și este omis cât timp nu are niciun rând.  
Intrarea în arbore cu tasta `Tab` ajunge pe rândul pe care s-a aflat ultima dată focusul tastaturii, iar în lipsa acestuia pe rândul potrivirii curente sau pe primul rând vizibil în întregime, și derulează arborele până când acel rând devine vizibil. Rândul pe care se află focusul tastaturii este desenat ca un rând aflat sub indicator.

În arbore:

- `↑` și `↓` mută focusul cu un rând, oprindu-se la primul și la ultimul rând în loc să reia de la capăt. `Home` și `End` merg la primul și la ultimul rând.
- `→` extinde un rând restrâns sau trece la primul copil al unui rând extins. `←` restrânge un rând extins sau trece la părintele său. Într-o limbă de afișare scrisă de la dreapta la stânga, cele două își inversează rolurile.
- `Enter` și `Space` acționează ca un clic: merg la rând sau restrâng ori extind un folder (consultați [Salt la un rând](#going-to-a-row)).
- Tastarea unei litere nu face salt la un rând.

Tasta `Escape`, apăsată oriunde în explorator, în arbore, în câmpul Găsire sau Înlocuire ori pe unul dintre butoanele sale, readuce focusul tastaturii pe pânză. Exploratorul rămâne deschis, iar selecția rămâne neschimbată.  
O apăsare pe `Escape` care încheie o compunere cu metoda de introducere doar încheie compunerea. Tasta `Escape` nu închide niciodată exploratorul, fie că este apăsată în el, fie pe pânză.

Câteva comenzi rapide ale editorului funcționează în continuare cât timp focusul tastaturii este în explorator (consultați [Comenzi rapide](./settings.md#shortcuts)):

- `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac) funcționează ca pe pânză: închide exploratorul sau, cât timp panoul Proprietăți tabel este deschis alături de el, închide panoul Proprietăți tabel și pune cursorul de text în câmpul Găsire (consultați [Deschiderea și închiderea](#opening-and-closing)).
- `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac) comută căutarea rapidă.
- `Undo` și `Redo` anulează și refac modificările diagramei, nu pe cele ale textului dintr-un câmp.
- `Zoom In`, `Zoom Out` și `Zoom Reset` modifică nivelul de zoom al pânzei.

Toate celelalte comenzi rapide ale editorului rămân în explorator, la fel ca tastele săgeți, `Tab`, `Enter`, `Space`, `Home`, `End` și orice tastă apăsată cât timp o metodă de introducere compune text.  
Niciuna dintre ele nu ajunge la pânză: `Delete` și `Backspace` nu șterg niciodată selecția, `Alt + N` (Windows/Linux) sau `⌥ + N` (Mac) nu adaugă niciun tabel, iar `T` apoi `G` nu grupează nimic. Într-un câmp, acestea acționează ca taste obișnuite de text: `Ctrl + A` (Windows/Linux) sau `⌘ + A` (Mac) selectează textul câmpului, `Delete` și `Backspace` șterg text, iar `Space` tastează un spațiu. Tasta `Tab` mută focusul între butoanele, câmpurile și arborele exploratorului.  
Tastele câmpurilor Găsire și Înlocuire propriu-zise sunt descrise în [Taste în câmpurile de căutare](./find-and-replace.md#keys-in-the-search-fields).  
Tastele pe care editorul nu le asociază, de exemplu cele pentru salvarea sau paleta de comenzi proprii aplicației gazdă, ajung ca de obicei la aplicația gazdă.

## Casete de dialog alături de explorator {#dialogs-beside-it}

Panoul [Proprietăți tabel](./table-related-functions.md#table-properties), [configuratorul de teme](./language-and-theme.md#theme), selectorul [`Display Language`](./language-and-theme.md#picking-a-language), caseta de dialog [`Export image`](./file-import-export.md#image) și caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) lasă exploratorul deschis atunci când se deschid.

- Panoul Proprietăți tabel se deschide în mijlocul pânzei, alături de explorator, și estompează doar pânza. Exploratorul rămâne utilizabil: alegerea unui rând închide panoul Proprietăți tabel, apoi face saltul la rând.
- Casetele de dialog `Export image` și Mapare coloane estompează întregul editor, inclusiv bara de instrumente și exploratorul. Exploratorul rămâne deschis sub zona estompată, iar un clic acolo închide caseta de dialog, ca un clic oriunde pe zona estompată; caseta de dialog Mapare coloane se închide atunci fără a mapa nimic.
- Într-o limbă de afișare scrisă de la stânga la dreapta, configuratorul de teme și selectorul `Display Language` se deschid imediat după explorator, nu peste el, și se deplasează corespunzător dacă acesta se deschide sau se închide cât timp ele sunt afișate. Într-o limbă scrisă de la dreapta la stânga, își păstrează locul în dreapta. O apăsare în explorator le închide, ca orice apăsare în afara lor, cu excepția uneia pe bara de instrumente.

Deschiderea căutării cu comanda rapidă sau cu un element `Toggle Explorer` le închide pe toate cinci, caseta de dialog Mapare coloane fără a mapa nimic.  
Și [căutarea rapidă](./quick-search.md) lasă exploratorul deschis, iar tasta `Escape` închide atunci doar paleta.

## Editoare doar în citire {#read-only-editors}

Într-un editor cu atributul [`readonly`](../../api/erd-editor-element.md#readonly), exploratorul funcționează ca în oricare altul: butonul din bara de instrumente, cu același sfat ecran, comanda rapidă, ambele elemente `Toggle Explorer`, arborele, restrângerea rândurilor, butonul `Collapse All` și saltul la un rând, care selectează ca de obicei elementul la care duce. Și acolo titlul său afișează `Explorer`.  
Căutarea sa doar găsește (consultați [Editoare doar în citire](./find-and-replace.md#read-only-editors) din Găsire și înlocuire).
