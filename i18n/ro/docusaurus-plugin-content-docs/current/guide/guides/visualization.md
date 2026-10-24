---
sidebar_position: 11
description: "Explorați schema ca graf bazat pe forțe sau ca flux de carduri de tabele: aplicați zoom și deplasați vizualizarea, evidențiați tabelele înrudite ale unui tabel, focalizați-vă pe câte câteva tabele și reveniți pas cu pas la focalizările anterioare."
---

# Vizualizare

Afișează întregul document dintr-o privire, în unul dintre cele două moduri:

- `Graph`, un graf bazat pe forțe cu toate tabelele, coloanele lor și relațiile dintre ele (consultați [Modul Graf](#graph-mode)).
- `Flow`, fiecare tabel desenat ca un card și aranjat de-a lungul relațiilor sale (consultați [Modul Flux](#flow-mode)).

Deschideți-o din fila `Visualization` din bara de instrumente de sus sau din [căutarea rapidă](./quick-search.md), sub comanda `Tab`.  
Din fila ERD, `Alt + F` (Windows/Linux) sau `⌥ + F` (Mac) și elementul `Focus on this table` din meniul contextual al tabelului o deschid direct în `Flow`, restrânsă la tabelele pe care le-ați ales și la tabelele aflate la o relație distanță (consultați [Focalizarea pe tabele](#focusing-on-tables)).

Comutați între moduri cu butoanele `Graph` și `Flow` din capătul din stânga al [barei de instrumente](#toolbar).  
Un editor deschis recent pornește în `Graph`. Modul pe care îl alegeți se păstrează cât timp editorul este deschis, chiar dacă vizitați alte file, dar nu se salvează în document.

## Bara de instrumente {#toolbar}

O bară de instrumente plutește deasupra mijlocului marginii de jos a filei. De la stânga la dreapta:

- `Graph` și `Flow`, cu modul curent evidențiat.
- `Previous table` și `Next table`, doar în `Flow`: o săgeată spre stânga și o săgeată spre dreapta care fac un pas înapoi și un pas înainte prin tabelele la care a fost restrâns modul Flux (consultați [Tabelul anterior și tabelul următor](#previous-table-and-next-table)). Fiecare este estompată cât timp nu există niciun pas de făcut în acea direcție.
- `Zoom out`, nivelul de zoom curent ca procent, de exemplu `100%`, și `Zoom in`. Fiecare apăsare modifică zoomul cu 4 puncte procentuale, păstrând mijlocul ecranului pe loc. Procentul arată zoomul modului în care vă aflați, iar un clic pe el readuce acel zoom la `100%`.
- `Fit`, care aduce în zona de vizualizare tot ce afișează modul: toate nodurile în `Graph`, toate cardurile în `Flow`.
- `Tidy Up`, doar în `Flow`, care aranjează din nou cardurile (consultați [Cum se plasează cardurile în Flux](#how-flow-is-placed)).
- Meniul de afișare a rândurilor, doar în `Flow`, etichetat cu opțiunea curentă (consultați [Afișare rânduri](#row-display)).
- Lista `Name View`, doar în `Flow`, etichetată cu modul activ (consultați [Numele de pe carduri](#names-on-the-cards)).
- `Show all`, doar în `Flow` și doar cât timp vizualizarea este restrânsă, care revine la întreaga diagramă (consultați [Focalizarea pe tabele](#focusing-on-tables)).
- Busola `Go to content`, care se adaugă la capătul barei de instrumente doar cât timp niciun nod sau card nu se află pe ecran. Afișează o săgeată îndreptată spre cel mai apropiat nod sau card și distanța până la acesta, de exemplu `1.2k`. Faceți clic pe ea pentru a centra acel nod sau card fără a schimba zoomul.

Butoanele de zoom și cele două săgeți își indică comenzile rapide în sfaturile ecran, de exemplu `Zoom in (Ctrl + Plus)` (Windows/Linux) sau `Zoom in (⌘ + Plus)` (Mac), precum și `Previous table (Ctrl + Z)` (Windows/Linux) sau `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` și `Ctrl + Minus` (Windows/Linux) sau `⌘ + Plus` și `⌘ + Minus` (Mac) modifică zoomul în trepte, ca butoanele, în oricare dintre moduri, iar `Ctrl + 0` (Windows/Linux) sau `⌘ + 0` (Mac) revine direct la `100%`. În modul `Flow`, `Ctrl + Z` și `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Z` și `⌘ + Shift + Z` (Mac) fac pași la fel ca cele două săgeți.  
Un clic pe procent are același efect ca `Ctrl + 0` (Windows/Linux) sau `⌘ + 0` (Mac), combinație pe care o indică în sfatul ecran. Comenzile rapide nu au niciun efect cât timp căutarea rapidă este deschisă.

## Modul Graf {#graph-mode}

Desenează întregul document ca un graf bazat pe forțe, astfel încât puteți vedea dintr-o privire cum se leagă tabelele între ele și care dintre ele se află în centrul unui domeniu.

![Deschiderea modului Graf, trecerea indicatorului peste un tabel pentru previzualizare, glisarea unui nod, apoi micșorarea și mărirea la loc](/img/demo-visualization.webp)

### Citirea grafului {#reading-the-graph}

Fiecare tabel și fiecare coloană este un nod, iar cele două tipuri sunt desenate în culori diferite. Notele și [grupurile de tabele](./table-groups.md) nu sunt desenate.  
Fiecare nod de coloană este legat de tabelul căruia îi aparține, iar două tabele unite printr-o relație sunt legate între ele.  
Tabelele unite prin mai multe relații în aceeași direcție sunt legate o singură dată, iar o relație care pornește și se termină în același tabel nu desenează nicio legătură.

Numele tabelelor apar pe graf pe măsură ce măriți, devenind treptat vizibile între `50%` și `100%`, iar un nume mai lung de 15 caractere este trunchiat. Nodurile de coloană nu au etichetă la niciun nivel de zoom.  
Etichetele urmează modul de afișare a numelor (consultați [Dincolo de pânză](./logical-names.md#beyond-the-canvas)). În modul `Both Names`, o etichetă pune numele logic pe o linie și numele pe linia de sub ea, iar fiecare linie este trunchiată separat.

### Deplasarea în graf {#getting-around-the-graph}

Rotița mouse-ului aplică zoom în jurul punctului aflat sub indicator, de la `10%` la `400%`.  
Ciupirea pe trackpad aplică zoom în același mod, iar două degete pe un ecran tactil aplică zoom în jurul punctului dintre ele și deplasează vizualizarea pe măsură ce se mișcă.  
Glisați fundalul pentru a deplasa vizualizarea sau glisați cu butonul din mijloc al mouse-ului de oriunde, inclusiv de pe un nod, ca pe [pânza ERD](./table-related-functions.md#getting-around-the-canvas). O glisare cu butonul din mijloc doar deplasează vizualizarea: nu trage niciodată un nod.

În schimb, butoanele de zoom din [bara de instrumente](#toolbar) și comenzile rapide de zoom mențin mijlocul ecranului pe loc, în același interval, iar `Fit` aduce toate nodurile în zona de vizualizare.

### Previzualizare la trecerea indicatorului {#hover-preview}

Treceți cu indicatorul peste un nod de tabel pentru a previzualiza acel tabel, lângă cursor.  
Trecerea indicatorului peste un nod de coloană doar desenează un inel în jurul lui; nu se deschide nicio previzualizare.

Previzualizarea afișează aceleași coloane și celule ca pânza ERD, în aceeași ordine, și le denumește așa cum o face pânza în modul de afișare a numelor în care vă aflați (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options), [Ajustarea ordinii coloanelor](./settings.md#adjusting-column-order) și [Afișare nume](./logical-names.md#name-view)).  
Cu opțiunea de afișare `Alternate Key` activată, fiecare coloană a unei [chei alternative](./table-related-functions.md#alternate-keys) își poartă marcajul, de exemplu `AK1.1`, la capătul rândului, iar previzualizarea se lățește pentru acesta, așa cum se lățește tabelul de pe pânza ERD.  
Spre deosebire de un tabel de pe pânza ERD, antetul previzualizării nu preia niciodată culoarea [grupului](./table-groups.md#coloring-a-group) tabelului, iar numele din previzualizare nu poartă niciodată [marcajele](./dictionary.md#marks-on-the-canvas) pe care verificările dicționarelor le pun pe pânză.  
Are doar rol de afișare și este ascunsă cât timp glisați un nod sau deplasați vizualizarea.

### Evidențierea unei vecinătăți {#highlighting-a-neighbourhood}

Trecerea indicatorului peste un tabel îi evidențiază și vecinătatea: tabelul însuși, propriile coloane, tabelele cu care îl unesc relațiile sale în oricare direcție și legăturile dintre ele.  
Toate celelalte elemente din graf se estompează, astfel încât ceea ce atinge tabelul iese în evidență.

### Mutarea nodurilor {#moving-nodes}

Glisați un nod cu butonul stâng al mouse-ului pentru a-l trage, împreună cu tot ce este legat de el, într-o nouă poziție.  
Nodul rămâne fixat sub indicator cât timp îl țineți, iar aranjarea se pune din nou în mișcare în jurul lui.  
Se stabilizează din nou când eliberați butonul: nimic nu rămâne fixat acolo unde l-ați lăsat.  
O apăsare sau o glisare cu butonul drept pe un nod nici nu îl trage, nici nu deplasează vizualizarea.

### Graful este un instantaneu {#the-graph-is-a-snapshot}

Graful este construit din document așa cum este în momentul în care deschideți această filă și este reconstruit de la zero de fiecare dată când reveniți la ea.  
Trecerea din `Flow` la `Graph` îl reconstruiește de asemenea, iar fiecare reconstruire pornește din nou de la `100%`.

## Modul Flux {#flow-mode}

Desenează fiecare tabel ca un card și aranjează cardurile de-a lungul relațiilor lor. Notele și [grupurile de tabele](./table-groups.md) nu sunt desenate.  
Nu este aranjarea `Flow` a funcției [Aranjare automată](./table-related-functions.md#auto-layout), care mută chiar tabelele din fila ERD.

Fiecare card este desenat ca un tabel din fila ERD: culoarea tabelului de-a lungul marginii din stânga, o bandă de antet cu o pictogramă de tabel și numele tabelului, așa cum le afișează [modul de afișare a numelor](#names-on-the-cards), apoi rândurile cerute de [afișarea rândurilor](#row-display). Spre deosebire de un tabel din fila ERD, un card desenează și o linie între rânduri, iar antetul său nu preia niciodată culoarea [grupului](./table-groups.md#coloring-a-group) tabelului. Cardurile își păstrează acest aspect la orice nivel de zoom și nu se reduc niciodată la nume, așa cum se întâmplă cu tabelele din fila ERD la un zoom de `70%` sau mai mic. Nimic de pe un card nu poate fi editat.

Un conector este o singură curbă lină de la un tabel la altul, desenată sub carduri, astfel încât poate trece prin spatele unui card. O relație a unui tabel cu el însuși se curbează în jurul colțului din dreapta sus al cardului, ca în fila ERD (consultați [Rutarea conectorilor](./relationship-editing.md#connector-routing)). Fiecare conector este desenat ca aceeași linie gri continuă, fie că relația este identificatoare sau nu, cu aceleași marcaje la capete ca în fila ERD (consultați [Citirea unui conector](./relationship-editing.md#reading-a-connector)). Modul Flux desenează conectorii chiar și atunci când [opțiunea de afișare](./table-related-functions.md#table-view-options) `Relationship` este dezactivată. Nu desenează niciodată etichetele `D:` și `U:` ale acțiunilor ON DELETE și ON UPDATE ale unei relații și nici nu afișează sfatul ecran care le explică, indiferent de starea opțiunii de afișare `Referential Actions`.

Pe întreaga diagramă, tabelele pe care nicio relație nu le unește cu alt tabel sunt adunate într-un singur bloc, în loc să fie împrăștiate printre celelalte.

![Comutarea la modul Flux, trecerea indicatorului peste orders pentru a-l evidenția împreună cu vecinii săi, fixarea evidențierii, alegerea Keys only, apoi mărirea cu ⌘ + Wheel și apăsarea pe Fit](/img/demo-visualization-flow.webp)

### Afișare rânduri {#row-display}

Meniul de afișare a rândurilor din [bara de instrumente](#toolbar) stabilește cât din fiecare card este desenat. Eticheta sa este opțiunea curentă, iar sfatul ecran arată, de exemplu, `Row display: Name only`.  
Meniul se deschide deasupra barei de instrumente, cu o bifă lângă opțiunea curentă. Se închide când alegeți o opțiune, faceți din nou clic pe etichetă, faceți clic oriunde altundeva în editor, apăsați `Escape` sau treceți la `Graph`.

| Afișare rânduri | Ce afișează fiecare card |
| --- | --- |
| `Name only` | Doar antetul. |
| `Keys only` | Coloanele cheie primară și cheie străină, plus orice altă coloană la care se termină o relație. |
| `All fields` | Toate coloanele. |

Rândurile sunt listate în ordinea coloanelor tabelului. Fiecare rând afișează numele coloanei, precedat de pictograma cheii când coloana este cheie primară, cheie străină sau ambele, iar în dreapta tipul de date, indiferent dacă cardul este [evidențiat](#lighting-related-tables) sau nu. [Modul de afișare a numelor](#names-on-the-cards) stabilește ce nume afișează un rând și dacă acesta afișează domeniul coloanei.  
Nu se desenează nicio altă celulă și niciun marcaj de cheie alternativă, iar nici [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options), nici [Ajustarea ordinii coloanelor](./settings.md#adjusting-column-order), care ordonează celulele dintr-un rând, nu se aplică cardurilor.

Când modul Flux se deschide prima dată, pornește cu `Name only` sau cu `Keys only` dacă a fost deschis prin [focalizarea pe tabele](#focusing-on-tables). După aceea, afișarea rândurilor se schimbă doar când alegeți alta, iar restrângerea sau lărgirea vizualizării o păstrează.  
Schimbarea afișării rândurilor redimensionează cardurile, așa că modul Flux le aranjează din nou și le încadrează în ecran.

### Numele de pe carduri {#names-on-the-cards}

Un card își denumește tabelul și coloanele în modul de afișare a numelor, același în care desenează fila ERD (consultați [Afișare nume](./logical-names.md#name-view)).  
Schimbați-l aici cu lista `Name View` din [bara de instrumente](#toolbar). Butonul ei afișează modul activ, `Physical Names`, `Logical Names` sau `Both Names`, iar sfatul ei ecran este `Name View`. Lista se deschide deasupra barei de instrumente, cu o bifă lângă modul activ, și se închide la fel ca meniul de [afișare a rândurilor](#row-display). O alegere schimbă modul de afișare în întregul editor, inclusiv în fila ERD, la fel ca o schimbare făcută în orice alt loc (consultați [Schimbarea modului de afișare](./logical-names.md#switching-the-view)).

Cardurile își dispun celulele doar după modul de afișare a numelor. Nicio [opțiune de afișare](./table-related-functions.md#table-view-options) nu le schimbă, inclusiv `Domain`:

| Mod de afișare | Antet | Fiecare rând |
| --- | --- | --- |
| `Physical Names` | Numele tabelului. | Numele coloanei, apoi tipul de date. |
| `Logical Names` | Numele logic al tabelului. | Numele logic al coloanei, apoi numele [domeniului](./dictionary.md#domains-and-data-types) ei sau tipul ei de date, cât timp nu are niciun domeniu. |
| `Both Names` | Numele logic, apoi numele tabelului, atenuat. | Numele logic, numele, domeniul și tipul de date. |

Cât timp un nume logic este necompletat, modul `Logical Names` afișează în locul lui numele, estompat, sau textul substituent `table` ori `column` când și numele este necompletat, iar modul `Both Names` afișează textul substituent `logical`, estompat. În modul `Both Names`, o coloană fără domeniu afișează textul substituent `domain`, estompat.  
Un card nu poartă niciodată [marcajele](./dictionary.md#marks-on-the-canvas) pe care verificările dicționarelor le pun pe nume în fila ERD.  
Schimbarea modului de afișare a numelor redimensionează cardurile, așa că modul Flux le aranjează din nou (consultați [Cum se plasează cardurile în Flux](#how-flow-is-placed)).

### Deplasarea în Flux {#getting-around-the-flow}

Rotița mouse-ului deplasează vizualizarea, iar `Shift + Wheel` o deplasează lateral. `Ctrl + Wheel` (Windows/Linux) sau `⌘ + Wheel` (Mac) aplică zoom, păstrând mijlocul ecranului pe loc.  
Ciupirea pe trackpad aplică zoom în jurul punctului în care ciupiți, iar două degete pe un ecran tactil aplică zoom în jurul punctului dintre ele și deplasează vizualizarea pe măsură ce se mișcă.  
Glisați fundalul pentru a deplasa vizualizarea sau glisați cu butonul din mijloc al mouse-ului de oriunde, inclusiv de pe un card. O glisare cu butonul din mijloc doar deplasează vizualizarea și lasă selecția neschimbată. Deplasarea nu are limite, ca pe [pânza ERD](./table-related-functions.md#getting-around-the-canvas).  
Zoomul variază de la `10%` la `150%`. Modul Flux are propriul zoom și propria poziție a vizualizării, separate de cele ale filei ERD, și niciunul dintre ele nu se salvează în document.

O apăsare pe fundal deselectează tot, iar `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac) pe fundal trasează o casetă de selecție.  
Modul Flux nu are minihartă și nici bare de derulare. Când, după o deplasare, niciun card nu mai este pe ecran, folosiți busola `Go to content` din [bara de instrumente](#toolbar).

### Evidențierea tabelelor înrudite {#lighting-related-tables}

Treceți cu indicatorul peste un card pentru a evidenția cardul, tabelele aflate la o relație distanță de el și conectorii care îl unesc cu acele tabele. Un conector între două dintre acele tabele rămâne neevidențiat.  
Un card evidențiat primește o bordură și o strălucire în culoarea de accent, iar rândurile sale la care se termină o relație sunt nuanțate. Un conector evidențiat capătă culoarea de accent.  
Nimic altceva nu se estompează, spre deosebire de [modul Graf](#highlighting-a-neighbourhood), și nimic nu este evidențiat cât timp indicatorul nu se află peste niciun card și niciun card nu este fixat.

Faceți clic pe un card pentru a-i fixa evidențierea, astfel încât rămâne evidențiat când indicatorul se mută mai departe. Faceți din nou clic pe același card sau faceți clic pe fundal pentru a-l elibera; un clic pe alt card mută fixarea pe acesta. Cardul de sub indicator și cardul fixat sunt evidențiate împreună.  
Glisarea, `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac), deplasarea vizualizării și [butoanele cardurilor](#card-buttons) nici nu fixează, nici nu eliberează un card.

Particulele circulă de-a lungul fiecărui conector evidențiat, de la capătul tabelului părinte, unde se află cheia primară, la capătul tabelului copil. Când sunt evidențiați simultan peste 60 de conectori, particulele se opresc, iar evidențierea rămâne.

### Butoanele cardurilor {#card-buttons}

Cât timp indicatorul se află peste un card, la capătul din dreapta al antetului său apar două butoane cu pictograme, niciunul cu sfat ecran:

- Pictograma cu puncte de traseu, aceeași pe care o afișează butonul `Flow`, restrânge modul Flux la acel tabel și la tabelele aflate la o relație distanță (consultați [Focalizarea pe tabele](#focusing-on-tables)). Ce afișa modul Flux înainte se poate readuce cu o singură apăsare pe `Previous table` (consultați [Tabelul anterior și tabelul următor](#previous-table-and-next-table)).
- Pictograma de link extern trece la fila ERD, selectează doar acel tabel, îl aduce în prim-plan și mută celula activă pe numele lui, sau pe numele lui logic în modurile `Logical Names` și `Both Names`, cu excepția cazului în care o celulă a acelui tabel este deja activă. Pânza derulează până la tabel doar dacă acesta nu este deja bine vizibil (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)). Nu începe și nu finalizează niciodată o relație în curs de trasare.

O apăsare pe oricare dintre butoane este preluată doar de buton: spre deosebire de o apăsare în altă parte a cardului, nu selectează cardul și nu îl aduce în prim-plan. Prin urmare, butonul cu puncte de traseu păstrează selecția pe care o aveați; butonul de link extern selectează tabelul doar ca parte a trecerii la fila ERD. Oricare dintre butoane se acționează doar cu un clic stânga.

### Mutarea cardurilor {#moving-cards}

Glisați un card cu butonul stâng al mouse-ului, apucându-l de orice parte în afară de cele două butoane ale cardului; o glisare cu butonul drept nu mută nimic.  
O apăsare pe un card îl selectează, `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac) îl adaugă la selecție, iar glisarea unui card selectat mută toate cardurile selectate. Selecția este aceeași cu cea din fila ERD, așa că ceea ce selectați aici rămâne selectat când reveniți.

Un card se mută doar în Flux: tabelul său rămâne pe loc în fila ERD.  
Un card mutat rămâne pe loc la deplasarea vizualizării, la zoom și la `Fit`. Revine acolo unde l-a plasat aranjarea atunci când părăsiți fila sau treceți la `Graph` și reveniți, precum și atunci când `Show all` sau un [pas](#previous-table-and-next-table) revine la o aranjare pe care modul Flux o are deja. O aranjare nouă îl plasează din nou, ținând cont de locul în care l-ați lăsat (consultați [Cum se plasează cardurile în Flux](#how-flow-is-placed)).

### Focalizarea pe tabele {#focusing-on-tables}

În fila ERD, selectați unul sau mai multe tabele și apăsați `Alt + F` (Windows/Linux) sau `⌥ + F` (Mac) ori faceți clic dreapta pe un tabel și alegeți `Focus on this table`.  
Fila Vizualizare se deschide în `Flow`, restrânsă la acele tabele și la toate tabelele aflate la o relație distanță de oricare dintre ele, în oricare direcție. Sunt desenați doar conectorii dintre tabelele afișate.

Când tabelul pe care faceți clic dreapta este unul dintre mai multe tabele selectate, elementul se numește `Focus on selected tables` și focalizează întreaga selecție. Un clic dreapta pe un tabel din afara selecției focalizează doar acel tabel.  
`Alt + F` preia tabelele selectate și lasă deoparte notele și [grupurile de tabele](./table-groups.md). Fără niciun tabel selectat nu are niciun efect, chiar dacă un grup este selectat: alegeți mai întâi `Select tables` din meniul contextual al grupului (consultați [Selectarea grupurilor](./table-groups.md#selecting-groups)).  
Combinația este ignorată cât timp se editează o celulă, o notă sau numele unui grup, cât timp focusul tastaturii este în [explorator](./explorer.md#keys-in-the-explorer) ori cât timp este deschisă căutarea rapidă, panoul Proprietăți tabel, vizualizatorul de diferențe, previzualizarea aranjării automate, călătoria în timp, caseta de dialog [`Export image`](./file-import-export.md#image) sau [`Map Columns`](./relationship-editing.md#map-columns).

În Flux, [butonul cardului](#card-buttons) cu puncte de traseu restrânge vizualizarea în același mod, la acel singur tabel. `Show all` din [bara de instrumente](#toolbar) revine la întreaga diagramă. Butoanele `Previous table` și `Next table` din bara de instrumente sau tastele lor fac un pas înapoi și un pas înainte prin vizualizările la care a fost restrâns modul Flux (consultați [Tabelul anterior și tabelul următor](#previous-table-and-next-table)).  
O vizualizare restrânsă este aranjată separat și încadrată în ecran. Rămâne restrânsă când părăsiți fila sau treceți la `Graph` și reveniți, iar `Escape` nu o lărgește.

![Focalizarea pe orders cu ⌥ + F, restrângerea la members cu butonul cu puncte de traseu al cardului său, apoi Show all](/img/demo-visualization-focus.webp)

### Tabelul anterior și tabelul următor {#previous-table-and-next-table}

Modul Flux reține la ce a fost restrâns, ca istoricul unui browser. De fiecare dată când vizualizarea trece la alte tabele – prin [focalizarea pe tabele](#focusing-on-tables) din fila ERD, cu [butonul cardului](#card-buttons) cu puncte de traseu sau cu `Show all` –, ce afișa înainte se păstrează ca un pas înapoi, fie că erau câteva tabele, fie întreaga diagramă.

![Restrângerea modului Flux la orders cu ⌥ + F și apoi la members, revenirea cu Previous table, avansarea cu ⌘ + Shift + Z și revenirea cu ⌘ + Z, apoi Show all](/img/demo-visualization-steps.webp)

- Butonul `Previous table` din [bara de instrumente](#toolbar) face un pas înapoi, iar `Next table` avansează din nou la ce a părăsit `Previous table`.
- În modul `Flow`, `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac) face un pas înapoi ca `Previous table`, iar `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Shift + Z` (Mac) face un pas înainte ca `Next table`. Acolo nu anulează și nu refac niciodată o editare a diagramei. În modul `Graph` și cât timp este deschisă căutarea rapidă, nu au niciun efect.
- Restrângerea vizualizării sau apăsarea pe `Show all` după un pas înapoi elimină pașii înainte. O nouă focalizare exact pe tabelele la care este deja restrâns modul Flux nu adaugă și nu elimină niciun pas.
- Se păstrează ultimii 100 de pași înapoi, iar cel mai vechi este eliminat primul.

Un pas afișează acele tabele ale sale care se află încă în diagramă, împreună cu toate tabelele aflate la o relație distanță, ca la focalizare. Un pas ale cărui tabele au fost toate eliminate este omis și eliminat, la fel ca unul care ar lăsa modul Flux acolo unde se află: chiar pe tabelele la care este restrâns acum sau pe întreaga diagramă cât timp modul Flux o afișează deja.  
Un buton este estompat și nu are niciun efect cât timp nu mai rămâne niciun pas în acea direcție. Ambele sunt estompate când modul Flux se deschide prima dată, fie pe întreaga diagramă, fie pe tabelele cu care l-a deschis o focalizare. După ce modul Flux s-a deschis, o focalizare ulterioară din fila ERD păstrează ca pas înapoi ce afișa modul Flux când l-ați părăsit.  
Un pas este aranjat și încadrat în ecran la fel ca o focalizare (consultați [Cum se plasează cardurile în Flux](#how-flow-is-placed)), iar afișarea rândurilor rămâne neschimbată.

Pașii aparțin doar modului Flux. Se păstrează cât timp editorul este deschis, inclusiv când vizitați alte file și modul `Graph`, dar nu se salvează în document, nu se trimit colaboratorilor și nu adaugă nimic în istoricul anulărilor. Înlocuirea întregului document îi elimină împreună cu restul datelor modului Flux.

Într-o limbă de afișare scrisă de la dreapta la stânga, bara de instrumente își păstrează ordinea, iar cele două săgeți își inversează acțiunile, așa că `Previous table` este săgeata îndreptată spre dreapta. Tastele rămân aceleași (consultați [Limbi scrise de la dreapta la stânga](./language-and-theme.md#right-to-left-languages)).

### Cum se plasează cardurile în Flux {#how-flow-is-placed}

Prima dată când este afișat modul `Flow`, tabelele pe care le afișează sunt aranjate în afara firului principal, iar rezultatul este încadrat în ecran.  
Aranjarea se păstrează cât timp editorul este deschis. Dacă părăsiți fila sau treceți la `Graph` și reveniți, modul Flux o refolosește, cu zoomul și poziția vizualizării așa cum le-ați lăsat.  
Modul Flux păstrează o aranjare pentru întreaga diagramă și una pentru tabelele la care a fost restrâns ultima dată, așa că `Show all` revine la aranjarea întregii diagrame și o încadrează în ecran fără a o recalcula, atâta timp cât nu s-a schimbat nimic din ceea ce a stat la baza acelei aranjări. Un [pas](#previous-table-and-next-table) la întreaga diagramă sau la tabelele la care modul Flux a fost restrâns ultima dată refolosește acea aranjare în același mod.

Modul Flux aranjează din nou cardurile când:

- Apăsați `Tidy Up`. Rezultatul este încadrat în ecran.
- Schimbați afișarea rândurilor, restrângeți vizualizarea la alte tabele sau faceți un pas la alte tabele cu `Previous table` ori `Next table`. Rezultatul este încadrat în ecran.
- Alegeți alt mod de afișare în lista `Name View`. Rezultatul este încadrat în ecran.
- Se adaugă sau se elimină tabele ori relații sau se schimbă modul de afișare a numelor: cât timp sunteți în afara modului Flux, caz în care modificările sunt preluate la revenire, sau de către un colaborator cât timp sunteți în Flux. Zoomul și poziția vizualizării rămân neschimbate.

Fiecare aranjare ține cont de pozițiile curente ale cardurilor, așa că `Tidy Up` nu restabilește neapărat o dispunere anterioară.  
O modificare care doar redimensionează un card, de exemplu redenumirea unui tabel, scrierea unui nume logic sau adăugarea unei coloane, nu aranjează din nou cardurile. Apăsați `Tidy Up` dacă unele carduri ajung să se suprapună.

O aranjare care durează mai mult de 6 secunde afișează mesajul `Placing tables`, cu un indicator de încărcare și butonul `Cancel`.  
`Cancel` sau apăsarea tastei `Escape` în orice moment cât timp rulează aranjarea o abandonează; `Tidy Up` sau revenirea la `Flow` o solicită din nou.  
Dacă o aranjare eșuează – gazda nu rulează niciun worker partajat, workerul nu pornește sau nicio aranjare nu este returnată în 60 de secunde –, modul Flux afișează mesajul `Could not place tables` cu un semn de avertizare, iar `Tidy Up` încearcă din nou. Consultați [Web Workers](../../api/installation.md#web-workers).  
Modul Flux desenează doar tabelele plasate de ultima sa aranjare, atât pe întreaga diagramă, cât și într-o vizualizare restrânsă, așa că prima dată când este afișat este posibil să nu existe niciun card până când o aranjare reușește.  
Ori de câte ori modul Flux aranjează din nou cardurile, de exemplu când restrângeți vizualizarea la alte tabele, dispunerea anterioară rămâne pe ecran până la sosirea noii aranjări și rămâne acolo dacă acea aranjare este anulată sau eșuează.

Când întregul document este înlocuit, de exemplu prin importarea unui fișier, aranjările, focalizarea, pașii `Previous table` și `Next table`, afișarea rândurilor, zoomul și poziția vizualizării din modul Flux sunt eliminate, iar data viitoare când deschideți modul Flux, acesta pornește de la zero, ca prima dată: pe întreaga diagramă sau restrâns, dacă îl deschideți prin [focalizarea pe tabele](#focusing-on-tables).

### Modul Flux nu modifică niciodată documentul {#flow-never-edits-the-document}

Modul Flux doar citește diagrama. Zoomul, deplasarea vizualizării, mutarea cardurilor, `Tidy Up`, afișarea rândurilor, fixările, focalizarea și pașii făcuți cu `Previous table` și `Next table` nu adaugă nimic în [istoricul anulărilor](./undo-redo.md#what-the-history-records).  
Nici în diagramă nu modifică nimic. O apăsare pe un card aduce totuși tabelul său în prim-plan, la fel ca un clic pe un tabel din fila ERD, așa că acesta este în prim-plan și acolo, dar ordinea de suprapunere nu se salvează (consultați [Mutarea mai multor tabele](./table-related-functions.md#moving-multiple-tables)). La fel, modul `Graph` lasă diagrama neatinsă.  
Lista `Name View` este o excepție, și doar cât timp [blocarea](./settings.md#lock) `Name View` este dezactivată: o alegere schimbă atunci modul de afișare a numelor al diagramei, care se salvează și se schimbă și în editoarele colaboratorilor. Cât timp blocarea este activată, cum este implicit, o alegere schimbă doar ecranul dumneavoastră. În ambele cazuri, nu adaugă nimic în istoricul anulărilor.  
O apăsare pe un card nu adaugă niciodată o relație. Dacă ați părăsit fila ERD în timp ce trasați una, o apăsare pe un card alege tabelul acestuia ca punct de pornire dacă încă nu a fost ales niciunul și, în caz contrar, încheie trasarea.  
[Butonul cardului](#card-buttons) cu link extern merge mai departe, deoarece vă scoate din Flux: când fila ERD trebuie să deruleze până la tabel, această derulare este înregistrată ca orice altă schimbare a poziției vizualizării.

Editările colaboratorilor ajung în continuare în diagramă cât timp sunteți în Flux, iar cardurile urmează tabelele și relațiile pe care aceștia le adaugă sau le elimină (consultați [Cum se plasează cardurile în Flux](#how-flow-is-placed)).  
Inelele lor de selecție și de focus sunt desenate pe carduri, dar cursoarele și casetele lor de selecție nu (consultați [Editare colaborativă](../../api/advanced/collaborative-editing.md)).

Ambele moduri, inclusiv focalizarea și pașii, funcționează și într-un editor cu atributul `readonly`, la fel ca lista `Name View`, care acolo schimbă doar ecranul dumneavoastră.
