---
sidebar_position: 6
description: Grupați tabelele înrudite într-un chenar denumit și colorat, așezat în spatele lor; creați, denumiți, colorați, mutați, redimensionați și eliminați grupuri, mergeți la ele din explorator, schimbați tabelele pe care le conțin, ascundeți-le și păstrați-le în aranjarea automată, în fila Schemă SQL și în DBML.
---

# Grupuri de tabele

Un grup de tabele este un chenar denumit și colorat, desenat în spatele unor tabele înrudite pe pânza ERD, pentru a arăta ce tabele merg împreună.  
Un tabel face parte din cel mult un grup. Grupurile se salvează odată cu diagrama, împreună cu grupul din care face parte fiecare tabel.

Chenarul are de-a lungul marginii de sus o bară de titlu, care conține o pictogramă de grup, numele grupului cu caractere aldine și, cât timp indicatorul se află deasupra grupului, un buton `x` care îl elimină (consultați [Eliminarea unui grup](#removing-a-group)). Un grup fără nume afișează `unnamed`, iar un nume prea lung pentru bară este trunchiat cu `…`.  
Chenarul își cuprinde mereu tabelele: își păstrează dimensiunea care i-a fost dată, dar se extinde pentru a păstra fiecare tabel înăuntru, cu un spațiu de `24px` în jurul lui și bara de titlu deasupra. Un tabel care crește extinde chenarul odată cu el, la fel ca un tabel lăsat lângă o margine cu centrul încă în interiorul chenarului. Cât timp tabelele sunt glisate, chenarul nici nu crește, nici nu se micșorează. Extinderea nu se salvează: chenarul revine la propria dimensiune de îndată ce tabelul nu mai are nevoie de spațiu.

Grupurile sunt desenate în spatele tuturor celorlalte elemente de pe pânză: tabelele, notele și liniile relațiilor.  
Acolo unde grupurile se suprapun, cel apăsat sau adăugat ultimul este desenat în față, iar corpul niciunui grup nu acoperă vreodată bara de titlu a altui grup. Ordinea nu se salvează, astfel că o diagramă redeschisă își suprapune grupurile în ordinea în care au fost adăugate.  
Grupurile apar pe pânza ERD, în minihartă și într-o imagine exportată, iar [exploratorul](./explorer.md) le listează (consultați [Salt la un grup](#going-to-a-group)). Fila [Vizualizare](./visualization.md) nu desenează nici grupuri, nici culori de grup, în niciunul dintre moduri.

Și un agent de programare poate crea și modifica grupuri, precum și citi codul DDL al grupurilor alese (consultați [Grupuri de tabele](../../mcp/tools.md#table-groups) din instrumentele MCP).

![Activarea trasării unui grup cu ⌥ + G, trasarea lui peste orders și payments, denumirea lui Billing, lăsarea lui order_items în el, apoi mutarea și redimensionarea grupului](/img/demo-table-group.webp)

## Crearea unui grup {#creating-a-group}

Există două moduri de a crea un grup, fiecare cu o comandă rapidă. Niciunul nu este disponibil într-un editor doar în citire sau cât timp grupurile sunt [ascunse](#hiding-groups), iar comenzile lor rapide nu au atunci niciun efect.  
Ca celelalte comenzi rapide ale pânzei, funcționează doar în fila ERD și sunt suspendate cât timp se editează o celulă, o notă sau numele unui grup (consultați [Comenzi rapide](./settings.md#shortcuts)).

### Trasarea unui grup {#drawing-a-group}

Faceți clic pe butonul `New Table Group` din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar), apăsați `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac) ori alegeți `New Table Group` din meniul contextual al pânzei, unde urmează după `New Table` și `New Memo`, sau din [căutarea rapidă](./quick-search.md) în fila ERD. Apoi trasați un chenar pe pânză prin glisare.  
Butonul și comanda rapidă activează și dezactivează trasarea, astfel că apăsarea oricăruia dintre ele cât timp trasarea este activă o încheie, indiferent cum a fost pornită; elementul din meniul contextual și căutarea rapidă doar o pornesc. Pornirea ei dezactivează instrumentul mână și anulează o relație în curs de trasare.  
Cât timp trasarea este activă, se afișează cursorul în cruce, iar o apăsare începe chenarul acolo unde are loc, chiar și deasupra unui tabel, în loc să selecteze sau să mute ce se află sub ea. Bara de instrumente a pânzei marchează atunci butonul `New Table Group`, nu mâna sau indicatorul.

La eliberarea butonului se adaugă un grup în acel chenar, cu o lățime de cel puțin `160px` și o înălțime de cel puțin `100px`, inclusiv bara de titlu, oricât de scurtă ar fi glisarea. Un clic fără glisare adaugă un grup cu o lățime de `480px` și o înălțime de `320px`, cu colțul din stânga sus în punctul clicului.  
Fiecare tabel care nu face parte din niciun grup și al cărui centru se află în noul chenar intră în grup. Un tabel aflat deja în alt grup rămâne acolo.

Butonul din mijloc al mouse-ului deplasează în continuare pânza și lasă trasarea activă. Următoarele încheie trasarea fără a adăuga un grup:

- `Escape` ori `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac), înainte de apăsare sau în timpul glisării. Înainte de apăsare, acestea lasă selecția neschimbată; apăsarea care începe chenarul a deselectat deja tot.
- Un clic dreapta, care deselectează tot. Nu se deschide niciun meniu contextual.
- Trecerea la instrumentul mână cu `Space` sau din bara de instrumente a pânzei, un clic pe indicatorul din bara de instrumente sau pe butonul `New Table Group` ori începerea unei relații.
- Trecerea la altă filă, ascunderea grupurilor sau trecerea editorului în modul doar în citire.

### Gruparea tabelelor selectate {#grouping-selected-tables}

Selectați unul sau mai multe tabele și apăsați `T` apoi `G` ori alegeți `Group selected tables` din meniul contextual al unui tabel sau `Group Selected Tables` din căutarea rapidă, care afișează această comandă cât timp este selectat un tabel.  
Noul grup este trasat în jurul tabelelor selectate, cu un spațiu de `24px` pe fiecare latură și bara de titlu deasupra. Fiecare tabel selectat intră în el, părăsind grupul din care făcea parte, iar grupul părăsit rămâne, chiar dacă acum este gol. Notele din selecție sunt ignorate.

`T` apoi `G` înseamnă două apăsări fără tastă de modificare, `G` la cel mult o secundă după `T`. Fără niciun tabel selectat nu are niciun efect, iar într-un câmp de text, de exemplu câmpul Găsire al exploratorului, tastează cele două litere.

![Gruparea tabelelor categories și products cu T apoi G, denumirea grupului Catalog, apoi colorarea lui în violet din meniul său, astfel încât ambele antete să preia culoarea](/img/demo-table-group-selected.webp)

În ambele cazuri, noul grup nu are nume și nici culoare. Este selectat singur, iar editorul numelui se deschide peste bara de titlu, ca să puteți tasta imediat un nume (consultați [Denumirea unui grup](#naming-a-group)).  
Grupul și tabelele pe care le preia formează un singur pas de anulare, iar numele tastat formează altul.

## Denumirea unui grup {#naming-a-group}

Numele unui grup se editează într-un câmp care se deschide peste bara sa de titlu. Câmpul se deschide automat după crearea unui grup, la un dublu clic pe bara de titlu și din elementul `Rename` al meniului contextual al grupului.  
`Enter` sau un clic în altă parte salvează numele. `Escape` închide câmpul fără a modifica numele și lasă grupul selectat, iar o a doua apăsare pe `Escape` deselectează tot.  
Un nume modificat reprezintă un singur pas de anulare; salvarea numelui nemodificat nu înregistrează nimic. Un nume gol sau format doar din spații apare ca `unnamed`.  
Cât timp câmpul este deschis, comenzile rapide ale pânzei sunt suspendate, iar comenzile rapide pentru căutarea rapidă și pentru `Toggle Explorer` nu au niciun efect, ca în timpul editării unei celule de tabel.

Funcția [Găsire și înlocuire](./find-and-replace.md#what-it-searches) caută în numele grupurilor prin butonul `Table group names` cât timp grupurile sunt afișate, iar butoanele sale `Replace` și `Replace All` redenumesc grupuri (consultați [Înlocuirea](./find-and-replace.md#replacing)). [Căutarea rapidă](./quick-search.md#searching-the-diagram) nu caută în numele grupurilor.

## Colorarea unui grup {#coloring-a-group}

Alegeți `Color` din meniul contextual al grupului pentru a deschide selectorul de culori pe culoarea grupului.  
Ca la tabele și note, selectorul colorează fiecare tabel, notă și grup selectat, iar elementul `Remove color` din meniu sau opțiunea `No color` a selectorului elimină culoarea de pe toate (consultați [Setarea culorii tabelelor și notelor](./table-related-functions.md#table-and-memo-color-specification)). Culoarea unui grup este oferită și în secțiunea `Document colors` a selectorului.

Un grup colorat își desenează bara de titlu și conturul în acea culoare, iar corpul într-o tentă pală a acesteia. Un grup fără culoare folosește tonurile de gri neutre ale temei.  
Fiecare tabel dintr-un grup colorat poartă culoarea grupului pe tot antetul și își păstrează propria culoare pe marginea stângă, astfel încât se văd amândouă.  
Textul și butoanele unui astfel de antet devin albe, sau negre pe o culoare deschisă pe care negrul se citește mult mai bine, la fel ca numele, pictograma și butonul `x` de pe bara de titlu a grupului. Dintre culorile predefinite ale selectorului, Portocaliu, Chihlimbar, Galben și Verde crud primesc negru, iar celelalte primesc alb.  
Un tabel își păstrează propriul antet cât timp grupul său nu are culoare, cât timp grupurile sunt ascunse, la un zoom de `70%` sau mai mic, unde tabelele se restrâng la nume, și în fila Vizualizare.

O schimbare de culoare se înregistrează în [istoricul anulărilor](./undo-redo.md#one-gesture-one-step) la fel ca pentru tabele și note.

## Selectarea grupurilor {#selecting-groups}

Faceți clic pe bara de titlu a unui grup pentru a-l selecta singur ori faceți `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac) pe ea pentru a-l adăuga la selecție.  
O apăsare pe bara de titlu a unui grup deja selectat păstrează întreaga selecție, astfel că o glisare o mută apoi în întregime.  
O apăsare pe bara de titlu sau un clic dreapta pe grup aduce grupul în fața celorlalte grupuri și tabelele sale în fața tuturor celorlalte tabele și note.

Pentru butonul stâng al mouse-ului, corpul, adică zona de sub bara de titlu, este pânză: glisarea pe el deplasează pânza, `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac) trasează o casetă de selecție, iar un clic deselectează tot. Tabelele, notele și liniile relațiilor de deasupra corpului răspund la indicator ca de obicei.

O casetă de selecție cuprinde un grup doar când înconjoară întregul chenar al grupului, astfel că o casetă trasată în interiorul unui grup selectează tabele, nu și grupul (consultați [Selecție multiplă](./table-related-functions.md#multiple-selection)).  
`Ctrl + A` (Windows/Linux) sau `⌘ + A` (Mac) nu selectează niciodată un grup.

Elementul `Select tables` din meniul contextual al grupului înlocuiește selecția cu tabelele grupului, fără grupul însuși, astfel încât următoarea comandă ajunge doar la tabele.  
Folosiți-l înaintea comenzilor care acționează doar asupra tabelelor, de exemplu copierea sau [focalizarea pe tabele](./table-related-functions.md#focusing-on-tables), care ignoră un grup selectat.

Conturul unui grup selectat ia culoarea selecției. Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), un grup selectat de alt participant este conturat cu culoarea acelui participant.

## Salt la un grup {#going-to-a-group}

[Exploratorul](./explorer.md#the-tree) listează grupurile în folderul său `Table Groups`, după nume, fiecare cu tabelele sale dedesubt. Căutarea rapidă nu listează niciun grup.

Alegerea unui rând de grup în explorator, a unei potriviri din [Găsire și înlocuire](./find-and-replace.md#going-to-a-match) în numele unui grup sau a unui rând de grup în lista [vizualizatorului de diferențe](./table-related-functions.md#the-change-tree) duce la acel grup.  
Saltul aduce chenarul grupului în câmpul vizual, orientându-se după bara de titlu atunci când chenarul este mai înalt decât pânza (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)). Apoi selectează doar grupul și îl aduce în prim-plan împreună cu tabelele sale, ca o apăsare pe bara sa de titlu.  
Cât timp grupurile sunt [ascunse](#hiding-groups) sau după ce grupul a fost eliminat, saltul la el nu are niciun efect.  
În vizualizatorul de diferențe, fiecare parte face saltul la grup doar dacă propriul său document îl conține și îl afișează (consultați [Salt la o modificare](./table-related-functions.md#going-to-a-change)).

## Mutarea și redimensionarea unui grup {#moving-and-resizing-a-group}

Glisați un grup de bara de titlu pentru a-l muta cu toate tabelele sale.  
Dacă grupul face parte dintr-o selecție mai mare, întreaga selecție se mută odată cu el, iar un tabel care este atât selectat, cât și în grup se mută o singură dată.  
Glisarea începe doar după ce indicatorul s-a deplasat puțin, astfel că un clic sau un dublu clic pe bara de titlu rămâne un clic. `Alt + drag` pe o bară de titlu mută grupul ca o glisare obișnuită; un grup nu este niciodată duplicat.  
Mutarea, cu toate tabelele pe care le antrenează, reprezintă un singur pas de anulare.

Glisarea unui tabel singur mută doar acel tabel și îl poate muta într-un grup sau în afara lui (consultați [Adăugarea și eliminarea tabelelor](#adding-and-removing-tables)).

Fiecare grup are mânere de redimensionare pe cele patru margini și în cele patru colțuri, selectat sau nu, ca o notă.  
Glisați unul cu butonul stâng al mouse-ului: chenarul urmează indicatorul, iar noua dimensiune se salvează când eliberați butonul, ca un singur pas de anulare.  
Un grup nu poate fi făcut mai mic de `160px` pe `100px` și nici mai mic decât tabelele sale cu spațiul lor de `24px` și bara de titlu. Marginea se oprește acolo, oricât de departe ar merge indicatorul.

## Adăugarea și eliminarea tabelelor {#adding-and-removing-tables}

Un tabel intră într-un grup sau îl părăsește în funcție de locul în care îl lăsați.  
Când glisați tabele și eliberați butonul, fiecare tabel glisat care nu este antrenat de un grup selectat este evaluat după centrul său. Intră în grupul cel mai de sus al cărui chenar îi conține centrul sau își părăsește grupul dacă centrul nu se află în chenarul niciunui grup. Grupul cel mai de sus este cel desenat în față.  
Un grup pe care glisarea îl lasă pe loc își păstrează chenarul pe care îl avea la începutul glisării, astfel că un tabel deplasat puțin în propriul grup rămâne în el și, ca să-l părăsească, trebuie glisat până când centrul său iese din acel chenar.  
În timpul glisării, fiecare grup în care lăsarea ar pune un tabel este conturat.

Când eliberați butonul în aproximativ `200ms` de la ultima mișcare, schimbarea grupului face parte din pasul de anulare al glisării, astfel că o singură anulare readuce tabelele unde erau și în grupurile în care se aflau. După o pauză mai lungă înainte de eliberare, schimbarea grupului este un pas separat (consultați [Un gest, un pas](./undo-redo.md#one-gesture-one-step)).  
Un clic sau o glisare de câțiva pixeli nu schimbă niciun grup, iar cât timp grupurile sunt ascunse nimic nu își schimbă grupul.

Celelalte moduri de a schimba tabelele pe care le conține un grup:

- Elementul `Remove from group` din meniul contextual al unui tabel scoate fiecare tabel selectat din grupul său. Apare cât timp un tabel selectat face parte dintr-un grup, chiar și când grupurile sunt ascunse, și reprezintă un singur pas de anulare.
- Elementul `Group selected tables` mută tabelele selectate într-un grup nou (consultați [Gruparea tabelelor selectate](#grouping-selected-tables)).
- Eliminarea unui grup lasă tabelele sale în afara oricărui grup.

Un tabel lipit sau duplicat cu `Alt` nu face parte din niciun grup, chiar dacă ajunge în chenarul unui grup. Glisarea lui ulterioară aplică regula lăsării.

## Eliminarea unui grup {#removing-a-group}

Eliminarea unui grup nu elimină niciodată tabelele sale: acestea rămân unde sunt, în afara oricărui grup.

- Butonul `x` de la capătul barei de titlu, care apare cât timp indicatorul se află deasupra grupului, elimină doar acel grup.
- Elementul `Delete` din meniul contextual al grupului elimină grupul. Când grupul este unul dintre mai multe elemente selectate, rândul afișează `Delete selected` și elimină tot ce este selectat: tabele, note și grupuri.
- Cu grupuri selectate, `Delete` sau `Backspace` elimină grupurile selectate împreună cu tabelele și notele selectate, la fel ca `Ctrl + Backspace` și `Ctrl + Delete` (Windows/Linux) sau `⌘ + Backspace` și `⌘ + Delete` (Mac) (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)).

Fiecare eliminare reprezintă un singur pas de anulare, care readuce grupul cu tabelele sale în el.

## Meniul grupului {#the-group-menu}

Faceți clic dreapta pe bara de titlu, pe corpul sau pe marginea unui grup pentru a-i deschide meniul. Pe Mac, îl deschide și `Ctrl + click`, la fel ca o apăsare lungă pe un ecran tactil.  
Clicul dreapta selectează mai întâi grupul, doar pe el, cu excepția cazului în care face deja parte din selecție, astfel că elementele `Color` și `Delete selected` ajung la restul selecției doar dacă grupul era în ea.

- `Select tables`: selectează doar tabelele grupului (consultați [Selectarea grupurilor](#selecting-groups)).
- `Rename`: deschide editorul numelui (consultați [Denumirea unui grup](#naming-a-group)).
- `Color`: deschide selectorul de culori (consultați [Colorarea unui grup](#coloring-a-group)).
- `Remove color`: apare cât timp ceva din selecție are o culoare.
- `Delete` sau, când grupul este unul dintre mai multe elemente selectate, `Delete selected`, cu tasta `Delete` afișată în dreapta (consultați [Eliminarea unui grup](#removing-a-group)).

Meniul contextual al unui tabel adaugă `Group selected tables` și `Remove from group` după `Color` și `Remove color`, înaintea rândului de ștergere, iar meniul contextual al pânzei adaugă `New Table Group`.  
Elementul `Group selected tables` își afișează tastele, `T` apoi `G`, în dreapta, iar `New Table Group` afișează `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac).

## Ascunderea grupurilor {#hiding-groups}

Elementul `View Option` → `Table Groups` din meniul contextual al pânzei afișează sau ascunde toate grupurile. Opțiunea este bifată implicit (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options)).  
Când este debifată, chenarele grupurilor și culorile de grup de pe antetele tabelelor dispar de pe pânză, din minihartă și din imaginile exportate, iar barele de derulare și miniharta nu mai lasă loc pentru grupuri. Nimic nu se mută și nu se redimensionează, iar fiecare tabel rămâne în grupul său.  
Ascunderea grupurilor le deselectează, încheie o trasare pornită cu `New Table Group` și închide un editor de nume deschis.

Cât timp grupurile sunt ascunse:

- Elementele `New Table Group` și `Group selected tables` nu apar în meniuri, nici comenzile `New Table Group` și `Group Selected Tables` în căutarea rapidă, iar bara de instrumente a pânzei nu afișează butonul `New Table Group`. Elementul `Remove from group` rămâne disponibil.
- `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac) și `T` apoi `G` nu au niciun efect.
- Glisarea tabelelor nu schimbă niciun grup, iar o casetă de selecție nu cuprinde niciun grup.
- Exploratorul omite folderul `Table Groups`, iar funcția Găsire și înlocuire nici nu găsește, nici nu înlocuiește numele grupurilor, chiar dacă butonul `Table group names` este activat.
- [Aranjarea automată](#auto-layout) păstrează în continuare împreună tabelele fiecărui grup, fila Schemă SQL oferă în continuare [grupurile din care puteți alege](#schema-sql-by-group), DBML le include în continuare, iar [Import și adăugare](./file-import-export.md#import-and-add) plasează în continuare conținutul adăugat sub chenarele ascunse.

Alegerea se salvează în document și se înregistrează în [istoricul anulărilor](./undo-redo.md#what-the-history-records), la fel ca celelalte opțiuni de afișare. Într-un editor doar în citire rămâne în schimb pe acel ecran (consultați [Editoare doar în citire](#read-only-editors)).

## Aranjare automată {#auto-layout}

Orice [aranjare automată](./table-related-functions.md#auto-layout) păstrează împreună tabelele fiecărui grup, fie că grupurile sunt afișate, fie că nu.

- `Force` mută fiecare grup împreună cu tabelele sale ca pe un singur chenar, tabelele păstrându-și locurile în interiorul lui, și menține chenarul fiecărui grup la cel puțin `100px` de celelalte grupuri și de tabelele care nu fac parte din niciun grup. Previzualizarea arată fiecare grup acolo unde urmează să ajungă.
- `Flow`, `Tree - vertical` și `Tree - horizontal` aranjează tabelele fiecărui grup în interiorul grupului și plasează grupurile după relațiile dintre ele, iar tabelele care nu fac parte din niciun grup sunt aranjate în jurul lor.

Apoi fiecare grup care conține tabele este ajustat la ele: chenarul său devine dreptunghiul care le încadrează, cu un spațiu de `24px` și bara de titlu. Un grup fără tabele își păstrează locul și dimensiunea.  
Tabelele și grupurile se așază ca un singur pas de anulare.

Un import DBML ajustează la fel fiecare grup în jurul tabelelor sale, oriunde ar fi plasate acestea (consultați [DBML](./file-import-export.md#dbml)).

## Schemă SQL pe grupuri {#schema-sql-by-group}

Fila [Schemă SQL](./schema-sql.md) poate scrie doar tabelele grupurilor alese.  
Cât timp documentul conține un grup, afișat sau ascuns, panoul ei de opțiuni afișează un rând `Tables` sub `This window only`, cu o casetă de selectare pentru `All`, câte una pentru fiecare grup și una pentru `No group`, adică tabelele care nu fac parte din niciun grup (consultați [Tabele](./schema-sql.md#tables)).  
Alegerea aparține ferestrei editorului și nu se salvează în document.

## Import, export și copiere {#import-export-and-copying}

- DBML păstrează grupurile în ambele sensuri. Un import DBML transformă fiecare bloc `TableGroup` într-un grup (consultați [DBML](./file-import-export.md#dbml)), iar ținta `DBML` a generatorului de cod scrie un bloc `TableGroup` pentru fiecare grup care conține un tabel (consultați [Generator de cod](./code-generator.md#language)).
- Un fișier JSON își păstrează grupurile. Niciun alt format nu le păstrează: importurile SQL, GraphQL și AML nu aduc niciun grup, iar fila Schemă SQL și celelalte ținte ale generatorului de cod nu scriu niciunul.
- [Import și adăugare](./file-import-export.md#import-and-add) aduce grupurile unui fișier ca grupuri noi care își conțin tabelele și le selectează împreună cu noile tabele cât timp grupurile sunt afișate, astfel că glisarea blocului adăugat îi antrenează și grupurile.
- O [imagine exportată](./file-import-export.md#image) desenează grupurile afișate în spatele tabelelor, cu culorile grupurilor pe antetele acestora.
- Copierea și lipirea sau duplicarea cu `Alt` nu copiază niciodată un grup (consultați [Copierea/lipirea tabelelor și notelor](./table-related-functions.md#copyingpasting-tables-and-memos) și [Adăugarea și eliminarea tabelelor](#adding-and-removing-tables)).

## Editoare doar în citire {#read-only-editors}

Într-un editor cu atributul [`readonly`](../../api/erd-editor-element.md#readonly), grupurile sunt desenate și listate în explorator ca de obicei și se poate face salt la ele, dar nu pot fi modificate:

- [Saltul la un grup](#going-to-a-group) îl selectează, iar acesta este singurul mod în care un grup este selectat acolo. O apăsare pe o bară de titlu nu selectează nimic și nu mută nimic: trasă, deplasează pânza, iar un clic fără mișcare șterge selecția lăsată de un salt.
- Nu există mânere de redimensionare și nici buton `x`, iar un dublu clic pe bara de titlu nu deschide editorul numelui.
- Un clic dreapta pe un grup nu deschide niciun meniu, iar meniul tabelului conține doar `Table Properties`.
- Meniul pânzei nu are `New Table Group`, iar căutarea rapidă nu listează niciuna dintre comenzile de grup. O trasare pornită cu `New Table Group` se încheie când editorul trece în modul doar în citire.
- [Bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar) păstrează doar controalele de vizualizare, așa că nu are butonul `New Table Group`, iar `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac) și `T` apoi `G` nu au niciun efect.
- O tragere de tabele sau de grup în curs în momentul în care editorul devine doar în citire se oprește unde se află și nu schimbă niciun grup, iar o redimensionare de grup în curs se încheie fără să schimbe dimensiunea.
- `View Option` → `Table Groups` afișează sau ascunde grupurile doar pe acel ecran, ca orice View Option de acolo: documentul, colaboratorii și istoricul anulărilor păstrează alegerea așa cum era, iar când editorul devine din nou editabil, revine alegerea documentului.
- Alegerea `Tables` din fila Schemă SQL funcționează în continuare.
