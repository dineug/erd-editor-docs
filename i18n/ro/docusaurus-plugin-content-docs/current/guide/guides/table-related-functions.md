---
sidebar_position: 5
description: Selectați, mutați, copiați, duplicați și ștergeți tabele și note, setați culori și opțiuni de afișare, definiți indexuri și chei alternative, alegeți o bază de date, deplasați-vă pe pânza infinită și comparați documente.
---

# Funcții pentru tabele

Tot ce faceți cu tabelele și notele odată ce există – selectarea, mutarea, copierea, ștergerea, colorarea și alegerea a ceea ce afișează pânza – precum și controalele pânzei din jurul lor.  
Mai întâi vin comenzile pentru tabele și note; apoi proprietățile tabelului, focalizarea pe tabele, indexurile și cheile alternative, aranjarea automată și sistemul de baze de date; iar la final pânza însăși: bara de instrumente a pânzei, zoomul, deplasarea pânzei și locul unde ajunge un salt, precum și vizualizatorul de diferențe.  
Grupurile de tabele, chenarele care adună tabele, au o pagină proprie (consultați [Grupuri de tabele](./table-groups.md)).  
O pagină proprie au și numele logice și modul de afișare a numelor, care stabilește ce nume afișează tabelele (consultați [Nume logice](./logical-names.md)).

## Selecție multiplă {#multiple-selection}

Sunt acceptate trei metode:

- `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac)
- `Ctrl + A` sau `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` sau `⌘ + ⌥ + A` (Mac)

Notele se selectează la fel, iar oricare dintre cele două comenzi rapide de selectare totală preia deodată toate tabelele și notele. Notele ascunse cu View Option → `Memos` sunt excluse din selectarea totală și din caseta de selecție (consultați [Opțiuni de afișare a tabelelor](#table-view-options)).  
[Grupurile de tabele](./table-groups.md#selecting-groups) se adaugă la selecție cu `Ctrl + click` (Windows/Linux) sau `⌘ + click` (Mac) pe bara lor de titlu, dar selectarea totală nu include niciodată vreun grup.  
`Ctrl + A` cedează în fața cursorului de text, așa că selectează textul, nu diagrama, cât timp editați o celulă.  
Caseta de selecție marchează un tabel sau o notă când îi acoperă mijlocul, nu atunci când doar îi atinge o margine. Ea preia un grup de tabele numai când cuprinde întregul chenar al grupului, așa că o casetă trasată în interiorul unui grup selectează tabele fără grup.  
Un clic dreapta pe ceva deja selectat păstrează întreaga selecție, așa că elementele de meniu, de exemplu `Color`, `Group selected tables` și `Delete selected`, acționează asupra întregii selecții. Un clic dreapta pe orice alt tabel, notă sau grup de tabele selectează doar acel element, chiar și cu `Ctrl` sau `⌘` ținut apăsat, iar un clic dreapta pe o relație sau pe o zonă goală a pânzei deselectează tot.  
`Escape` deselectează tot. Cât timp este deschis editorul unei celule, al unei note sau al numelui unui grup de tabele ori se trasează o relație sau un grup cu `New Table Group`, prima apăsare pe `Escape` încheie acțiunea respectivă, iar o a doua apăsare deselectează tot.

![Selectarea tabelelor cu ⌘ + drag și ⌘ + click, apoi a tuturor tabelelor și notelor cu ⌘ + A](/img/demo-table-select.webp)

Într-o sesiune colaborativă, selecția, celula activă și caseta de selecție ale fiecărui participant sunt desenate pe pânză în culoarea acelui participant (consultați [Editare colaborativă](../../api/advanced/collaborative-editing.md)).  
Celula activă a unui participant care vede alt mod de afișare a numelor este desenată pe celula pe care modul dumneavoastră de afișare o desenează în locul ei, de exemplu celula numelui său, pe celula dumneavoastră a numelui logic (consultați [Colaboratori](./logical-names.md#collaborators)).

## Mutarea mai multor tabele {#moving-multiple-tables}

Glisați orice tabel sau notă care face deja parte din selecție, iar întreaga selecție se mută odată cu elementul respectiv – nu este nevoie de nicio tastă de modificare.  
Un tabel se glisează de antet sau de oricare dintre rândurile coloanelor sale, așa că o glisare care începe pe rândul unei coloane mută tabelul, nu coloana. Coloanele se mută în schimb de mânerul de glisare de lângă rândul activ (consultați [Reordonarea și mutarea coloanelor](./table-editing.md#rearranging-and-moving-columns)).  
Pe o celulă de antet sau pe rândul unei coloane, tabelul începe să se miște doar după ce indicatorul a parcurs o mică distanță, așa că un clic acolo activează în continuare celula, iar un dublu clic îi deschide în continuare editorul. O glisare nu pornește niciodată de pe marginea colorată a unui tabel, care deschide selectorul de culori, de pe butoanele `+` și `x` din antetul său sau de pe butonul `x` al rândului unei coloane.  
Glisarea unui element din afara selecției reduce selecția la acel element și îl mută doar pe el. `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac) păstrează selecția în ambele cazuri.  
Doar butonul stâng al mouse-ului mută tabelele și notele. Un clic dreapta alege elementele asupra cărora acționează meniul contextual și nu mută nimic, iar o glisare cu butonul din mijloc deplasează în schimb pânza (consultați [Deplasarea pe pânză](#getting-around-the-canvas)).

![Glisarea unuia dintre cele două tabele selectate le mută pe amândouă, iar relația le urmează](/img/demo-table-multiple-move.webp)

Un [grup de tabele](./table-groups.md) selectat se mută și el, împreună cu tabelele sale, iar un tabel care este atât selectat, cât și într-un grup în mișcare se mută o singură dată.  
Locul unde lăsați un tabel îl poate muta într-un grup sau în afara unuia (consultați [Adăugarea și eliminarea tabelelor](./table-groups.md#adding-and-removing-tables)).

Tabelele și notele au o ordine de suprapunere comună. O apăsare pe un tabel sau pe o notă, cu butonul stâng sau cu cel drept, aduce elementul în fața tuturor celorlalte tabele și note, iar o apăsare pe bara de titlu a unui grup de tabele sau un clic dreapta pe corpul grupului îi aduce tabelele în prim-plan.  
Ordinea nu se salvează: o diagramă redeschisă își suprapune tabelele în ordinea în care le listează fișierul, cu toate notele deasupra lor.

## Copierea/lipirea tabelelor și notelor {#copyingpasting-tables-and-memos}

Copiază tabelele și notele selectate și le lipește înapoi ca elemente noi.  
Comenzi rapide: `Ctrl + C` (Windows/Linux) sau `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) sau `⌘ + V` (Mac)

Un tabel copiat își păstrează numele, numele logic, comentariul, coloanele și culoarea; o notă copiată își păstrează textul, dimensiunea și culoarea.  
Fiecare coloană copiată își păstrează numele logic, iar fiecare nume de tabel și de coloană păstrează informația dacă a fost derivat din dicționare (consultați [Derivarea numelor fizice](./dictionary.md#deriving-physical-names)).  
O coloană lipită își păstrează legătura cu domeniul doar când sunt îndeplinite două condiții: diagrama în care ajunge listează exact acel domeniu, nu doar unul cu același nume, iar domeniul are încă tipul de date cu care a fost copiată coloana. Altfel, coloana ajunge fără domeniu și păstrează tipul cu care a fost copiată (consultați [Legarea unei coloane](./dictionary.md#linking-a-column)).  
Indexurile și relațiile sunt preluate și ele: un index se copiază integral pe tabelul copiat, iar o relație se copiază cu tipul ei și cu acțiunile ON DELETE și ON UPDATE atunci când ambele tabele pe care le leagă sunt în setul copiat. O relație inclusă doar pe jumătate este omisă, în loc să rămână îndreptată înapoi spre original.  
Copiile lipite devin noua selecție, iar lipirea repetată a aceleiași copii o decalează de fiecare dată cu încă un pas de `50px`, astfel încât lipirile repetate nu se suprapun.  
O copie nu își păstrează [grupul de tabele](./table-groups.md): tabelul lipit nu face parte din niciun grup, chiar dacă ajunge în interiorul chenarului unui grup, iar un grup selectat nu se copiază.  
Cât timp View Option → `Memos` ascunde notele, o lipire adaugă totuși notele pe care le conține, ascunse și neselectate, așa că doar tabelele lipite devin noua selecție.

![Copierea a două tabele înrudite și lipirea lor de două ori, inclusiv relația](/img/demo-table-copy-paste.webp)

Când sunt selectate coloane în interiorul unui tabel activ, aceeași comandă rapidă copiază în schimb acele coloane (consultați [Editarea tabelelor](./table-editing.md)).

## Duplicarea tabelelor și notelor {#duplicating-tables-and-memos}

Țineți apăsat `Alt` și glisați un tabel sau o notă cu butonul stâng al mouse-ului.  
Un tabel este apucat de antet sau de oricare rând de coloană, așa că `Alt + drag` pe rândul unei coloane duplică tabelul și lasă neschimbată ordinea coloanelor. Tasta `Alt` ținută apăsată pe mânerul de glisare al coloanei nu duplică nimic: coloana se mută la fel ca la o glisare simplă de mâner (consultați [Reordonarea și mutarea coloanelor](./table-editing.md#rearranging-and-moving-columns)).  
O previzualizare translucidă urmează indicatorul, iar la eliberarea butonului copia este plasată acolo unde se află previzualizarea.  
Dacă elementul apucat face deja parte dintr-o selecție, se duplică întreaga selecție. Altfel, selecția este înlocuită cu entitatea de sub indicator.  
`Alt + click` fără deplasare plasează copia la o distanță de `50px` în jos și spre dreapta, avansând mai departe ori de câte ori acel loc este deja ocupat.

Un duplicat preia aceleași lucruri ca o [lipire](#copyingpasting-tables-and-memos): nume și nume logice, comentarii, coloane, culori, dimensiunile notelor, precum și indexurile și relațiile care aparțin în întregime elementelor copiate. Deoarece rămâne în aceeași diagramă, păstrează neschimbată legătura cu domeniul a fiecărei coloane. La fel ca o lipire, nu ajunge în niciun grup de tabele.  
`Alt + drag` pe bara de titlu a unui grup de tabele mută grupul la fel ca o glisare obișnuită; un grup nu se duplică niciodată.

![Duplicarea unui tabel cu Alt + drag, apoi Alt + click pentru încă o copie în jos și spre dreapta](/img/demo-table-duplicate.webp)

## Ștergerea tabelelor și notelor {#table-and-memo-deletion}

Șterge tabelele, notele și [grupurile de tabele](./table-groups.md) selectate.  
Comenzi rapide:

- `Delete` sau `Backspace`. Acestea elimină întreaga selecție, cu excepția cazului în care singurul element selectat este un tabel cu unele dintre coloanele sale selectate, iar zoomul este de peste `70%`: atunci elimină în schimb acele coloane (consultați [Ștergerea coloanelor](./table-editing.md#column-deletion)).
- `Ctrl + Backspace` sau `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` sau `⌘ + Delete` (Mac). Acestea elimină întotdeauna tabelele, notele și grupurile de tabele selectate, chiar și când sunt selectate coloane.

![Ștergerea unui tabel și a relațiilor sale cu tasta Delete, apoi a unui tabel și a unei note împreună cu Delete selected din meniul notei](/img/demo-table-remove.webp)

Și meniurile contextuale șterg. Ultimul rând din meniul unui tabel sau al unei note afișează `Delete selected` cât timp acel tabel sau acea notă se numără printre două sau mai multe elemente selectate și elimină atunci întreaga selecție. Altfel, afișează `Delete` și elimină doar acel tabel sau acea notă. Pe rândul unei coloane selectate, meniul tabelului afișează în schimb `Delete column` sau `Delete columns`, ca în [Ștergerea coloanelor](./table-editing.md#column-deletion).

Eliminarea unui tabel elimină odată cu el relațiile și indexurile sale. Eliminarea unui grup de tabele păstrează tabelele acestuia, fără grup (consultați [Eliminarea unui grup](./table-groups.md#removing-a-group)).  
Nu se cere confirmare, fiecare eliminare este un singur pas de anulare, iar într-un editor `readonly` nu se elimină nimic.  
Ținute apăsat, tastele `Delete` și `Backspace` elimină o singură dată și nu elimină niciodată o relație (consultați [Editarea relațiilor](./relationship-editing.md#deletion)). Cât timp tastați într-o celulă, într-o notă sau în orice alt câmp de text, ele editează în schimb textul.  
Setările listează cele două taste sub numele `Delete Selection` (consultați [Comenzi rapide](./settings.md#shortcuts)).

## Setarea culorii tabelelor și notelor {#table-and-memo-color-specification}

Puteți atribui culori pentru a face distincția pe categorii.  
Un tabel își poartă culoarea de-a lungul marginii stângi, iar o notă de-a lungul marginii de sus. Faceți clic cu butonul stâng pe acea margine sau bandă ori alegeți `Color` din meniul contextual al tabelului sau al notei pentru a deschide selectorul de culori în dreptul indicatorului. Culoarea se aplică tuturor tabelelor, notelor și grupurilor de tabele selectate, nu doar elementului pe care ați făcut clic.  
Un grup de tabele se colorează din elementul `Color` al propriului meniu, iar un tabel dintr-un grup colorat poartă culoarea grupului pe antetul său, păstrându-și propria culoare pe marginea stângă (consultați [Colorarea unui grup](./table-groups.md#coloring-a-group)).

![Alegerea culorii predefinite Blue din banda de culoare a unei note pentru două tabele selectate și notă, apoi eliminarea culorii cu No color](/img/demo-table-color.webp)

Selectorul conține, de sus în jos:

- O zonă de saturație și luminozitate, apoi glisorul de nuanță, cu o previzualizare a culorii alături. Acolo unde browserul oferă o pipetă, un buton în formă de pipetă aflat înaintea glisorului, `Pick a color from the screen`, preia o culoare de oriunde de pe ecran.
- Câmpurile `Hex`, `R`, `G` și `B`. Câmpul `Hex` acceptă 3, 4, 6 sau 8 cifre hexazecimale, cu sau fără `#`, ori, prin lipire, o valoare `rgb()` sau `hsl()` ori un nume de culoare CSS. O valoare completă de 6 sau 8 cifre se aplică pe măsură ce tastați, iar orice altă valoare la apăsarea tastei `Enter` sau la părăsirea câmpului. Câmpurile `R`, `G` și `B` acceptă numere întregi, interpretând orice valoare peste `255` ca `255`, și se aplică la apăsarea tastei `Enter` sau la părăsirea câmpului. Textul pe care selectorul nu îl poate citi este ignorat.
- Șaisprezece mostre de culori predefinite, în două rânduri de câte opt: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown și Gray. Trecerea indicatorului peste o mostră de culoare îi afișează codul hexazecimal.
- `Document colors`: până la opt culori pe care tabelele, notele și grupurile de tabele ale documentului le folosesc deja, începând cu cele mai folosite. Rândul apare doar când există astfel de culori.
- `No color`.

O culoare este întotdeauna opacă: selectorul nu are niciun control pentru transparență și elimină orice transparență conținută de o valoare tastată sau lipită.  
Deschiderea selectorului nu modifică nimic, iar alegerea culorii pe care selecția o are deja nu adaugă niciun pas de anulare.

`No color` elimină culoarea tuturor tabelelor, notelor și grupurilor de tabele selectate într-un singur pas de anulare și închide selectorul. Elementul `Remove color`, aflat imediat sub `Color` în meniurile contextuale ale tabelelor, notelor și grupurilor de tabele cât timp vreun element selectat are o culoare, face același lucru fără a deschide selectorul.

Selectorul preia focusul tastaturii când se deschide, iar `Tab` și `Shift + Tab` parcurg ciclic controalele lui. Tastele săgeți mută zona și glisorul de nuanță cu 1 sau, dacă țineți apăsat `Shift`, cu 10 și trec de la o mostră de culoare la alta, aplicând-o pe fiecare pe parcurs.  
Cât timp selectorul are focusul tastaturii, anularea și refacerea, comenzile rapide de zoom, `Search` și `Toggle Explorer` ajung în continuare la editor, iar celelalte comenzi rapide ale editorului nu: comenzile rapide de [ștergere](#table-and-memo-deletion) nu elimină nimic, iar `Delete` și `Backspace` doar editează textul câmpurilor `Hex`, `R`, `G` și `B`.  
`Escape` închide selectorul, la fel ca o apăsare pe pânză în afara lui.  
O apăsare în [explorator](./explorer.md) nu este o apăsare pe pânză, așa că lasă selectorul deschis. Un rând ales acolo schimbă selecția, iar următoarea alegere colorează noua selecție.

## Opțiuni de afișare a tabelelor {#table-view-options}

Sunt disponibile următoarele opțiuni de afișare:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

Opțiunile `Domain`, `Unique`, `Alternate Key` și `Auto Increment` sunt dezactivate implicit, iar celelalte sunt activate.  
Numele afișate de tabele nu sunt o opțiune de afișare: elementul `Name View`, aflat imediat după `View Option` în meniul contextual al pânzei, alege nume fizice, nume logice sau ambele (consultați [Schimbarea modului de afișare](./logical-names.md#switching-the-view)).  
Opțiunea `Domain` dă fiecărei coloane o celulă, plasată conform [ordinii coloanelor](./settings.md#adjusting-column-order), cu numele domeniului de care este legată coloana. O coloană care nu este legată de niciun domeniu listat în foaia `Domains` afișează acolo textul substituent `domain`, estompat. Celula apare în orice mod de afișare. Cât timp opțiunea `Domain` este dezactivată, modul `Logical Names` afișează în schimb numele unui domeniu legat în celula tipului (consultați [Celula Domeniu](./logical-names.md#the-domain-cell)).  
Opțiunea `Alternate Key` marchează coloanele fiecărei chei alternative, de exemplu `AK1.1` (consultați [Chei alternative](#alternate-keys)).  
Opțiunea `Referential Actions` afișează etichetele `D:` și `U:` pe care acțiunile ON DELETE și ON UPDATE ale unei relații le plasează la capătul conectorului dinspre tabelul copil (consultați [Citirea unui conector](./relationship-editing.md#reading-a-connector)). Dezactivarea ei ascunde doar acele etichete și nu mută niciun tabel sau conector.  
Opțiunea `Table Groups` afișează [grupurile de tabele](./table-groups.md) și culorile grupurilor pe anteturile tabelelor lor. Dezactivarea ei le ascunde pe pânză, pe minihartă și în exporturile de imagini, nu mută niciun tabel și păstrează fiecare tabel în grupul său (consultați [Ascunderea grupurilor](./table-groups.md#hiding-groups)). De asemenea, elimină folderul `Table Groups` din [explorator](./explorer.md#the-tree) și butonul `New Table Group` de pe [bara de instrumente a pânzei](#canvas-toolbar), iar căutarea din explorator nu mai găsește numele grupurilor.  
Opțiunea `Memos` afișează notele. Dezactivarea ei ascunde toate notele pe pânză, pe minihartă și în exporturile de imagini și nu mută niciun tabel sau conector. Notele ascunse nu ocupă spațiu, așa că barele de derulare, miniharta și busola `Go to content` nu țin cont de ele.  
Ascunderea notelor le deselectează și închide editorul unei note, dacă este deschis. [Exploratorul](./explorer.md#the-tree) renunță la folderul `Memos`, iar funcția sa [Găsire și înlocuire](./find-and-replace.md) și prefixul `:` al căutării rapide nu caută în ele. Cât timp sunt ascunse, elementul `New Memo` dispare din meniul contextual, de pe [bara de instrumente a pânzei](#canvas-toolbar), din căutarea rapidă și de pe [ecranul de bun venit](./editing-start.md#welcome-screen), iar `Alt + M` nu adaugă nicio notă. O lipire sau o operație [Import și adăugare](./file-import-export.md#import-and-add) adaugă totuși notele pe care le conține, ascunse și neselectate.  
Într-un editor `readonly`, comutatoarele nu modifică nimic.

![Comutarea elementelor din View Option în timp ce tabelele se rearanjează, marcarea unui index unic compus cu AK1.1 și AK1.2 prin Alternate Key, apoi dezactivarea și reactivarea opțiunii Memos](/img/demo-view-options.webp)

Cardurile din modul `Flow` al filei Vizualizare nu respectă aceste opțiuni, inclusiv `Domain`: folosesc propria [afișare a rândurilor](./visualization.md#row-display) și își desenează conectorii chiar și cu opțiunea `Relationship` dezactivată. Celulele pe care le dispune un card depind doar de modul de afișare a numelor (consultați [Numele de pe carduri](./visualization.md#names-on-the-cards)).

## Proprietăți tabel {#table-properties}

Deschide panoul de proprietăți al unui tabel.  
Porniți de la elementul `Table Properties` din meniul contextual al tabelului, care îl deschide pentru tabelul pe care ați făcut clic dreapta, sau selectați un tabel și apăsați `Alt + Space`.  
Panoul se deschide în mijlocul pânzei, care devine estompată. Doar pânza este estompată, așa că un [explorator](./explorer.md#dialogs-beside-it) deschis rămâne deschis și utilizabil alături. Antetul panoului conține titlul `Table Properties`, ultimele cinci tabele deschise sub formă de etichete, cu cel curent evidențiat, și un buton de închidere. Fiecare etichetă își denumește tabelul așa cum o face [modul de afișare a numelor](./logical-names.md#beyond-the-canvas). Faceți clic pe o etichetă pentru a trece la acel tabel fără a redeschide panoul.  
Sub antet se află trei file: `Indexes`, `Schema SQL` și `Code Generator`. Panoul păstrează aceeași dimensiune pentru toate trei, așa că trecerea de la o filă la alta nu îl mută și nu îl redimensionează.  
Închideți-l cu butonul de închidere, cu `Escape` sau făcând clic pe pânză în afara lui.  
Alegerea în explorator a unui rând care nu este un folder sau saltul la o potrivire a căutării sale închide panoul Proprietăți tabel înainte de salt. La fel face `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac), care deschide căutarea exploratorului sau plasează cursorul de text în câmpul Găsire dacă exploratorul este deja deschis. Orice alt clic în explorator, inclusiv pe un rând de folder, sau pe butonul `Explorer` al barei de instrumente lasă panoul Proprietăți tabel deschis. O apăsare pe `Escape` cât timp focusul tastaturii este în explorator doar redă focusul pânzei, așa că este nevoie de o a doua apăsare pe `Escape` pentru a închide panoul Proprietăți tabel.

Fila `Indexes` este descrisă în [Indexuri](#indexes).  
Fila `Schema SQL` afișează codul DDL al tabelului pentru [baza de date](#databases) selectată: instrucțiunea `CREATE TABLE`, constrângerile separate pe care unele baze de date le scriu pentru coloanele sale unice și indexurile sale. Scrie întotdeauna instrucțiuni `CREATE` simple, fără antet, fără scripturi înainte sau după tabele și fără nume logice în comentariile goale, indiferent de setările filei [Schemă SQL](./schema-sql.md) din bara de instrumente (consultați [Nume logice drept comentarii](./schema-sql.md#logical-names-as-comments)). Nu are panou de opțiuni, iar meniul său contextual oferă doar `Database` și `Bracket`.  
Fila `Code Generator` generează cod doar pentru acest tabel (consultați [Generator de cod](./code-generator.md)).

Într-un editor `readonly`, panoul se deschide în continuare, cu insigna `Read only` lângă titlu, dar fila `Indexes` nu permite nicio modificare.

## Focalizarea pe tabele {#focusing-on-tables}

Deschide fila Vizualizare în modul `Flow`, restrânsă la tabelele alese și la toate tabelele aflate la o relație distanță de ele.  
Porniți din meniul contextual al tabelului cu elementul `Focus on this table` sau selectați unul sau mai multe tabele și apăsați `Alt + F`.  
Când tabelul pe care faceți clic dreapta este unul dintre mai multe tabele selectate, elementul devine `Focus on selected tables` și focalizează întreaga selecție. Un clic dreapta pe un tabel din afara selecției focalizează doar acel tabel.  
Comanda rapidă preia tabelele selectate, lasă deoparte notele și nu face nimic când niciun tabel nu este selectat.  
Un [grup de tabele](./table-groups.md) selectat nu contează aici, nici pentru comanda rapidă, nici pentru elementul de meniu: tabelele sale sunt preluate doar când sunt selectate ele însele, lucru pe care îl face elementul `Select tables` din meniul grupului.  
Ce afișează vizualizarea restrânsă și cum reveniți la întreaga diagramă sunt descrise în [Vizualizare](./visualization.md#focusing-on-tables), iar cum faceți pași înapoi și înainte prin ce a afișat anterior modul Flux, în [Tabelul anterior și tabelul următor](./visualization.md#previous-table-and-next-table).

## Indexuri {#indexes}

Indexurile se definesc în fila `Indexes` a panoului de proprietăți al tabelului și sunt incluse în codul Schemă SQL exportat.

Partea stângă listează cheile și indexurile tabelului în două secțiuni.  
Secțiunea `Keys`, afișată când tabelul are chei, listează cheile declarate de coloanele sale: `PK_<table name>` peste coloanele marcate PK, apoi `UQ_<table name>_<column name>` pentru fiecare coloană marcată ca unică, în ordinea coloanelor. Numele sunt cele fizice, scrise de codul Schemă SQL al bazei de date selectate, indiferent de modul de afișare a numelor, așa că, cu opțiunea `Bracket` setată la `None`, un tabel calificat cu schema, de exemplu `sales.users`, listează `PK_users` pentru toate bazele de date, cu excepția Databricks și Snowflake (consultați [Nume de tabele calificate cu schema](./schema-sql.md#schema-qualified-table-names)). Fiecare cheie are eticheta `PK` sau `UQ` și este marcată cu un lacăt. Aici cheile sunt doar în citire și se modifică numai prin indicatorii [PK](./table-editing.md#column-primary-key) și [unic](./table-editing.md#not-null-unique-auto-increment) ai coloanelor.  
Secțiunea `Indexes` listează indexurile tabelului în ordinea în care au fost adăugate. Fiecare index are un comutator `UQ` care îl face unic, un câmp pentru nume și un buton `x` care îl elimină. Un index care este o [cheie alternativă](#alternate-keys) își afișează și numărul, de exemplu `AK1`. Adăugați un index cu butonul `Add Index` din partea de jos a listei.

Partea dreaptă listează coloanele tabelului sub `Columns`, fiecare cu o casetă de selectare. Fiecare rând afișează aceleași celule ca rândul coloanei de pe pânză, urmând ordinea coloanelor, opțiunile de afișare și [modul de afișare a numelor](./logical-names.md#beyond-the-canvas). Nimic nu poate fi editat până când nu selectați un index în partea stângă.  
Bifați o coloană pentru a o adăuga la indexul selectat și debifați-o pentru a o elimina. Selectarea unei chei îi afișează coloanele bifate, dar casetele rămân dezactivate.  
Coloanele indexului selectat sunt listate mai jos, sub `Index order`, fiecare denumită așa cum o denumește modul de afișare a numelor, iar în modul `Both Names` cu numele între paranteze după numele logic, de exemplu `Member Number (member_no)`. Glisați-le de pictograma de prindere pentru a le reordona și faceți clic pe eticheta `ASC` sau `DESC` de pe un rând pentru a-i inversa ordinea de sortare. Într-o cheie alternativă, fiecare rând se termină cu marcajul său `AK<n>.<m>`. Lista afișează câte trei rânduri, iar restul se derulează.

Într-un editor `readonly`, selectarea unei chei sau a unui index îi afișează în continuare coloanele, dar nu există butonul `Add Index` și nici butonul `x`, iar nimic altceva din filă nu poate fi modificat.

[Exploratorul](./explorer.md#the-tree) listează indexurile fiecărui tabel în folderul `Indexes` al tabelului, iar alegerea unuia dintre ele acolo duce la tabelul său. Căutarea sa găsește și numele indexurilor și le poate redenumi (consultați [Unde caută](./find-and-replace.md#what-it-searches)).

![Deschiderea panoului Proprietăți tabel pentru orders, unde fila Indexes listează cheile PK și UQ deasupra indexurilor, apoi adăugarea unui index peste member_id și ordered_at DESC și verificarea lui în fila Schema SQL](/img/demo-table-properties.webp)

## Chei alternative {#alternate-keys}

O cheie alternativă este un index unic peste două sau mai multe coloane: un index din fila `Indexes` cu comutatorul `UQ` activat și cel puțin două dintre coloanele tabelului bifate.  
Un index unic peste o singură coloană nu spune mai mult decât indicatorul unic al acelei coloane, așa că nu este o cheie alternativă; nu sunt chei alternative nici un index simplu, nici cheia primară, nici o coloană marcată ca unică.

Cu opțiunea `Alternate Key` activată în [opțiunile de afișare](#table-view-options), diagrama marchează coloanele fiecărei chei alternative așa cum le scriu erwin și IDEF1X: `AK1.1`, `AK1.2` și așa mai departe. Opțiunea este dezactivată implicit.

Cheile sunt numerotate după poziția coloanelor lor în tabel, nu după ordinea în care au fost adăugate indexurile. Cheia a cărei primă coloană din lista `Index order` se află cel mai sus în tabel este `AK1`. La egalitate, decide următoarea coloană a fiecărei chei, iar o cheie care este partea inițială a uneia mai lungi o precedă pe aceasta.  
Mutarea unei coloane în cadrul tabelului sau reordonarea listei `Index order` a unei chei poate renumerota cheile. Anularea eliminării unei chei îi redă numărul, iar toți colaboratorii văd aceleași numere.

Fiecare coloană a unei chei este marcată `AK<n>.<m>`, unde `n` este numărul cheii, iar `m` locul coloanei în lista `Index order` a cheii. O coloană din mai multe chei poartă toate marcajele, unite prin virgulă.  
De exemplu, într-un tabel cu coloanele `a`, `b` și `c`, indexurile unice peste (`c`, `a`) și (`b`, `a`) devin `AK1` = (`b`, `a`) și `AK2` = (`c`, `a`), deoarece coloana `b` se află deasupra coloanei `c`. Astfel, `b` afișează `AK1.1`, `c` afișează `AK2.1`, iar `a` afișează `AK1.2,AK2.2`.

Marcajul este desenat ultimul pe rând, după celula pe care [ordinea coloanelor](./settings.md#adjusting-column-order) o pune ultima. Nu este o celulă, așa că nu primește niciodată focusul, nu se editează și nu se copiază (consultați [Editarea tabelelor](./table-editing.md)).  
Și o coloană cheie primară sau cheie străină poate purta un marcaj AK, deoarece marcajul nu înlocuiește nimic: pictograma cheii de la începutul rândului afișează în continuare PK și FK, iar celula Unic își păstrează propriul `UQ`.  
Un tabel care are o cheie alternativă păstrează spațiu după ultima celulă a fiecărui rând pentru cel mai lung marcaj al său; un tabel fără cheie alternativă își păstrează lățimea.  
Marcajele apar pe pânza ERD, unde un tabel restrâns la nume, la un zoom de `70%` sau mai mic, nu afișează niciunul, și într-un [export de imagine](./file-import-export.md#image), care desenează fiecare tabel complet, indiferent de zoom. Le afișează și [previzualizarea la trecerea indicatorului](./visualization.md#hover-preview) din modul `Graph` al filei Vizualizare; cardurile din modul `Flow` nu le afișează niciodată.

Fila `Indexes` afișează numerele indiferent dacă opțiunea este activată sau nu (consultați [Indexuri](#indexes)).

## Aranjare automată {#auto-layout}

Aranjează automat toate tabelele de pe pânză.  
Deschideți `Auto Layout` din meniul contextual al pânzei sau din căutarea rapidă și alegeți una dintre cele patru aranjări:

| Aranjare | Ce desenează |
| --- | --- |
| `Force` | O simulare: relațiile atrag tabelele unele spre altele, vecinii se resping reciproc, iar tabelele suprapuse se separă. |
| `Flow` | De la stânga la dreapta, de-a lungul relațiilor, fiecare conector primind propriul punct de contact pe un tabel. Încearcă să păstreze puține intersecții, dar poate lăsa unele pe care o altă aranjare le-ar evita. |
| `Tree - vertical` | Pe niveluri, de sus în jos: un tabel părinte se află deasupra tabelelor care au o cheie străină către el. |
| `Tree - horizontal` | Aceeași dispunere pe niveluri, de la stânga la dreapta. |

Aranjarea `Force` deschide o previzualizare cât timp aceasta se stabilizează, cu butoanele `Apply` și `Cancel` în mesajul pe care îl afișează.  
Previzualizarea este încadrată pe diagramă așa cum era aceasta la pornirea aranjării, așa că tabelele pot ieși din cadru pe măsură ce aranjarea se stabilizează. Este desenată la un zoom de `70%` sau mai mic, așa că tabelele sale apar restrânse la nume și la marginea colorată. Se deschide în modul de afișare a numelor pe care îl vedeți, indiferent de modul pe care îl păstrează fișierul (consultați [Dincolo de pânză](./logical-names.md#beyond-the-canvas)).  
`Apply` păstrează pozițiile așa cum sunt în acel moment, iar aranjarea se aplică de la sine odată ce se stabilizează. `Cancel` sau `Escape` lasă diagrama așa cum era.

Celelalte trei se calculează dintr-odată, în afara firului principal, așa că nu există nimic de urmărit: un mesaj apare cât timp se calculează aranjarea, iar aranjamentul final este centrat pe zona pe care o acoperă deja diagrama. `Cancel` sau `Escape` renunță la o aranjare pe care nu o mai așteptați, iar, într-o aplicație gazdă care nu rulează niciun worker partajat, aranjarea se încheie cu mesajul `Could not place tables` (consultați [Web Workers](../../api/installation.md#web-workers)). O aranjare care nu a returnat un rezultat în 60 de secunde se încheie la fel.

Indiferent de alegere, tabelele și grupurile de tabele sunt mutate, iar notele rămân unde sunt. Tabelele sunt plasate la lățimile pe care le au în modul de afișare a numelor pe care îl vedeți. O relație a unui tabel cu el însuși este ignorată, iar mai multe relații între aceleași două tabele contează o singură dată.  
Fiecare aranjare păstrează împreună tabelele fiecărui grup, indiferent dacă grupurile sunt afișate sau nu, și ajustează fiecare grup care conține tabele în jurul acestora (consultați [Grupuri de tabele](./table-groups.md#auto-layout)).  
Rezultatul este înregistrat ca o singură intrare în istoric, așa că o singură anulare readuce fiecare tabel și grup unde era.

![Ordonarea unei grămezi de tabele cu aranjarea automată Flow din meniul contextual al pânzei, care le aliniază de la stânga la dreapta de-a lungul relațiilor](/img/demo-automatic-table-placement.webp)

## Baze de date {#databases}

Bazele de date acceptate includ:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Alegeți una cu `Database` din meniul contextual al pânzei, din panoul de opțiuni sau din meniul contextual al filelor Schemă SQL și Generator de cod ori din căutarea rapidă. Toate modifică aceeași setare.

Aceste opțiuni determină sintaxa Schemă SQL pentru export, completarea automată a tipului de date și tipurile la care se rezolvă codul generat și schemele importate.  
Ele decid ce variante `Statements` și `Header` poate scrie fila [Schemă SQL](./schema-sql.md#options-panel). O variantă pe care baza de date nu o are rămâne în panoul de opțiuni, estompată, iar codul SQL revine la cea mai apropiată variantă disponibilă.  
De asemenea, decid ce acțiuni ON DELETE și ON UPDATE scriu fila Schemă SQL și țintele ORM ale generatorului de cod și pe care dintre ele meniurile relațiilor le marchează cu `not in <database>` (consultați [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update) și [Generator de cod](./code-generator.md#database)).  
Importul Schemă SQL păstrează tipul de date al unei coloane, inclusiv lista de argumente, indiferent dacă editorul îl listează sau nu, de exemplu `TIMESTAMP WITH TIME ZONE`, `public.mood` sau `integer[]` (consultați [Tipuri de date](./file-import-export.md#data-types)). Completarea automată a tipului de date sugerează doar tipurile listate de baza de date selectată.

![Schimbarea bazei de date la PostgreSQL, apoi alegerea unui tip PostgreSQL în completarea automată](/img/demo-database.webp)

![Completarea automată cu potrivire aproximativă a tipului de date, parcursă cu tastele săgeți și acceptată cu Right, Tab sau Enter](/img/demo-data-type-autocomplete.webp)

## Bara de instrumente a pânzei {#canvas-toolbar}

O bară de instrumente mică plutește deasupra mijlocului marginii de jos a pânzei și conține, de la stânga la dreapta, instrumentele care acționează asupra pânzei înseși și comenzile care adaugă elemente pe ea:

- Mâna și indicatorul. Indicatorul este instrumentul implicit; mâna transformă fiecare glisare într-o deplasare a pânzei, atât peste tabele, cât și pe spațiul gol. `Space` comută între ele. Cât timp trasarea unui grup cu [`New Table Group`](./table-groups.md#drawing-a-group) este activă, butonul `New Table Group` este marcat în locul oricăruia dintre ele, iar un clic pe oricare dintre ele, apăsarea tastei `Space` sau alegerea unei notații de relație încheie trasarea fără a adăuga un grup.
- `New Table`, `New Memo` și `New Table Group`. `New Table` adaugă un tabel la fel ca `Alt + N`, iar `New Memo` adaugă o notă la fel ca `Alt + M`. `New Table Group` activează [trasarea grupului](./table-groups.md#drawing-a-group) la fel ca `Alt + G` și dezactivează mâna; un al doilea clic, la fel ca o a doua apăsare pe `Alt + G`, încheie trasarea fără a adăuga un grup. `New Memo` lipsește cât timp View Option → `Memos` ascunde notele, iar `New Table Group` cât timp View Option → `Table Groups` ascunde grupurile. Un editor `readonly` nu afișează niciunul dintre cele trei butoane.
- Zoomul: `Zoom out`, zoomul curent ca procent și `Zoom in`. Cele două butoane modifică zoomul în pași, la fel ca comenzile rapide de zoom, iar un clic pe procent îl readuce la `100%`.
- Cele patru notații de relație, aceleași patru cu care începeți o relație (consultați [Începerea editării](./editing-start.md)). Alegerea uneia revine la indicator, deoarece o relație se trasează făcând clic pe două tabele.
- `Name View`, un buton cu o săgeată în jos care numește modul activ: `Physical Names`, `Logical Names` sau `Both Names`. Își păstrează lățimea indiferent de modul pe care îl numește, așa că o schimbare nu deplasează niciodată bara de instrumente. Un clic deschide deasupra barei de instrumente o listă cu cele trei, cu modul activ bifat. Alegerea unuia trece la acesta și închide lista; un al doilea clic pe buton, o apăsare oriunde altundeva sau `Escape` închide lista fără a schimba modul. Și un editor `readonly` îl afișează. Ce desenează fiecare mod este descris în [Afișare nume](./logical-names.md#name-view), iar dacă o schimbare se salvează, în [Schimbarea modului de afișare](./logical-names.md#switching-the-view).
- Modul Zen, `Alt + Z`, care ascunde totul în afară de pânză și de această bară de instrumente. O nouă apăsare pe `Alt + Z` sau un clic pe buton readuce restul. Un explorator deschis este ascuns împreună cu restul, fără a fi închis, și revine odată cu acesta. Exploratorul poate fi deschis și în modul Zen (consultați [Când se retrage](./explorer.md#when-it-stands-aside)).
- Busola `Go to content`, care apare la capătul barei de instrumente doar cât timp pe ecran nu se află niciun tabel, nicio notă afișată și niciun grup de tabele afișat (consultați [Deplasarea pe pânză](#getting-around-the-canvas)).

Fiecare buton care are o comandă rapidă o menționează în sfatul ecran, de exemplu `New Table (Alt + N)` (Windows/Linux) sau `New Table (⌥ + N)` (Mac).  
Bara de instrumente se retrage cât timp este deschisă previzualizarea aranjării automate `Force`, panoul Proprietăți tabel, călătoria în timp sau vizualizatorul de diferențe și revine după ce acestea se închid.

![Adăugarea unui tabel și a unei note din bara de instrumente, activarea și dezactivarea New Table Group, deplasarea pânzei cu mâna, modificarea zoomului în pași și comutarea modului Zen cu ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Mărire/micșorare {#zoom-inout}

Zoomul se face cu `Ctrl + Wheel` (Windows/Linux) sau `⌘ + Wheel` (Mac). Rotița mouse-ului singură deplasează pânza.  
Ciupirea pe trackpad aplică și ea zoom, în jurul punctului în care ciupiți, la fel ca două degete pe un ecran tactil, care deplasează totodată pânza pe măsură ce se mișcă.  
Comenzi rapide: `Ctrl + Plus` (Windows/Linux) sau `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) sau `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) sau `⌘ + 0` (Mac) revine direct la `100%`, păstrând mijlocul ecranului pe loc.

Butoanele `Zoom out` și `Zoom in` de pe [bara de instrumente a pânzei](#canvas-toolbar) modifică zoomul în pași, la fel ca comenzile rapide `Minus` și `Plus`: fiecare apăsare îl modifică cu 4 puncte procentuale, păstrând mijlocul ecranului pe loc. Procentul dintre ele afișează zoomul curent, iar un clic pe el revine direct la `100%`, la fel ca `Ctrl + 0` (Windows/Linux) sau `⌘ + 0` (Mac).

Zoomul variază între `10%` și `150%`.  
La un zoom de `70%` sau mai mic, tabelele se restrâng la nume și la marginea colorată, iar editarea celulelor, comenzile rapide pentru celule, copierea și lipirea nu mai funcționează până când nu măriți din nou. Numele afișat de un tabel restrâns urmează modul de afișare a numelor (consultați [Afișare nume](./logical-names.md#name-view)).

Aceleași trei comenzi rapide aplică zoom și în fila Vizualizare, atât în modul `Graph`, cât și în modul `Flow`, fiecare mod în propriul interval (consultați [Vizualizare](./visualization.md#toolbar)).

![Micșorarea cu ⌘ + Wheel până când tabelele se restrâng la nume, apoi revenirea în pași cu ⌘ + Plus, ⌘ + Minus și ⌘ + 0](/img/demo-zoom.webp)

## Deplasarea pe pânză {#getting-around-the-canvas}

Pânza nu are margini și nici o dimensiune de setat. Tabelele și notele stau oriunde le puneți, iar tot ce urmează descrie diagrama, nu o pagină fixă.

Glisați o zonă goală a pânzei pentru a deplasa pânza sau treceți la instrumentul mână cu `Space` și glisați oriunde, inclusiv peste un tabel. Și rotița mouse-ului deplasează pânza, iar `Shift + Wheel` o deplasează lateral.  
Corpul unui [grup de tabele](./table-groups.md#selecting-groups), zona de sub bara de titlu, contează ca pânză goală pentru butonul stâng: glisarea lui deplasează pânza, `Ctrl + drag` (Windows/Linux) sau `⌘ + drag` (Mac) trasează o casetă de selecție, iar un clic deselectează tot.  
Deplasarea nu are limite: rotița mouse-ului, o glisare și instrumentul mână duc vizualizarea cât de departe o mutați, dincolo de tabele, în orice parte.

Glisați cu butonul din mijloc al mouse-ului (apăsați rotița) pentru a deplasa pânza de oriunde de pe ea, atât cu indicatorul, cât și cu mâna. Funcționează chiar și când apăsarea cade pe un tabel, o notă, o celulă, o pictogramă sau o relație.  
O glisare cu butonul din mijloc nu selectează, nu mută și nu apasă nimic și păstrează selecția. Închide un meniu contextual deschis și selectorul de culori, iar derularea și lipirea proprii browserului la clic de mijloc nu pornesc.  
O apăsare cu butonul din mijloc pe barele de derulare, pe minihartă, pe bara de instrumente a pânzei sau pe un editor deschis de celulă sau de notă nu deplasează pânza.

Miniharta din colțul din dreapta sus reprezintă diagrama cu spațiu cât un ecran pe fiecare parte a ei, adică întinderea barelor de derulare, rotunjită spre exterior la o grilă grosieră, așa că, cu cât micșorați mai mult, cu atât diagrama apare mai mică în ea. Faceți clic pe ea pentru a muta vizualizarea în acel punct sau glisați dreptunghiul zonei de vizualizare pentru a deplasa vizualizarea. Pe măsură ce micșorați, dreptunghiul zonei de vizualizare crește pentru a acoperi o parte mai mare din hartă.  
Ea desenează fiecare tabel în culoarea tabelului și fiecare grup de tabele afișat ca un chenar în culoarea grupului, în spatele tabelelor sale.  
Barele de derulare de-a lungul marginilor din dreapta și de jos descriu aceeași cursă, care merge de la diagrama aflată chiar dincolo de o margine a ecranului până la diagrama aflată chiar dincolo de marginea opusă, așa că este cu cel puțin un ecran mai lungă decât diagrama desenată și și mai lungă cât timp vizualizarea se află dincolo de diagramă. În afara modului Zen, ambele bare de derulare apar ori de câte ori documentul conține un tabel, o notă afișată sau un grup de tabele afișat, chiar și când totul încape pe ecran. Un document fără niciunul dintre acestea, de exemplu unul ale cărui singure note sunt ascunse cu View Option → `Memos`, nu afișează nicio bară de derulare și nici minihartă.  
Glisarea cursorului unei bare de derulare sau a dreptunghiului zonei de vizualizare din minihartă este singura deplasare care se oprește: nu merge mai departe de tabelele aflate chiar în afara ecranului sau de punctul de pornire al glisării, dacă acesta era mai departe.

Dacă după o deplasare pe ecran nu mai rămâne niciun tabel, nicio notă afișată și niciun grup de tabele afișat, la capătul [barei de instrumente a pânzei](#canvas-toolbar) apare busola `Go to content`, cu o săgeată spre cel mai apropiat element și distanța până la el. Faceți clic pe ea pentru a centra acel element fără a modifica zoomul.

![Deplasarea pânzei prin glisarea pe pânza goală, cu rotița mouse-ului, prin glisarea cu butonul din mijloc peste un tabel și din minihartă, apoi Shift + wheel dincolo de conținut și revenirea urmând busola Go to content](/img/demo-canvas-navigation.webp)

### Unde ajunge un salt {#where-a-jump-lands}

Orice salt care vă duce la ceva de pe pânză mută vizualizarea după aceeași regulă: rezultatele prefixelor `#`, `@` și `:` din [căutarea rapidă](./quick-search.md#searching-the-diagram), rândurile [exploratorului](./explorer.md#going-to-a-row) și potrivirile funcției sale [Găsire și înlocuire](./find-and-replace.md#going-to-a-match), rândurile din lista [vizualizatorului de diferențe](#going-to-a-change), [butonul cardului](./visualization.md#card-buttons) cu link extern din modul Flux, o verificare care numește un tabel sau o coloană în [foaia Verificări](./dictionary.md#the-checks-sheet) din fila Dicționar și plasarea rezultatului unei operații [Import și adăugare](./file-import-export.md#import-and-add). Fiecare dintre acele secțiuni spune ce selectează saltul; aceasta spune unde ajunge vizualizarea.

Un salt nu modifică niciodată zoomul și face cel mult o derulare. Dintr-o altă filă, trece mai întâi la fila ERD.  
Saltul măsoară pânza așa cum apare: sub bara de instrumente de sus sau pe toată înălțimea în modul Zen și la dreapta unui explorator deschis, care îngustează pânza în loc să o acopere.

Orizontala și verticala sunt evaluate separat, iar o direcție în care ținta se vede deja bine rămâne exact cum este:

- O țintă care nu depășește jumătate din pânză în acea direcție rămâne pe loc cât timp mijlocul ei se află în jumătatea din mijloc a pânzei, între un sfert și trei sferturi din lățime, respectiv din înălțime. Altfel, mijlocul ei este adus în mijlocul pânzei.
- O țintă mai lungă care încă încape cu o rezervă de `40px` la fiecare capăt rămâne pe loc cât timp este vizibilă în întregime. Altfel, pe orizontală, este centrată; pe verticală, partea ei de sus este adusă la o distanță de `40px` sub marginea de sus a pânzei.
- O țintă mai lungă de atât rămâne pe loc cât timp este vizibilă în întregime sau, când este mai lungă decât pânza, cât timp este vizibilă partea ei esențială, listată mai jos. Altfel, este centrată dacă încape sau, în caz contrar, plasată cât mai aproape de mijloc, astfel încât ambele capete ale părții esențiale să rămână la o distanță de cel puțin `40px` în interiorul pânzei; la o parte esențială prea lungă pentru asta, începutul este păstrat la o distanță de `40px` în interior.

Astfel, un tabel mic aflat lângă marginea stângă a pânzei, la jumătatea înălțimii, se mută doar pe orizontală.

Ce aduce un salt în câmpul vizual și partea esențială care trebuie să fie vizibilă când întregul nu încape:

- Un tabel: tot tabelul; partea esențială este banda cu numele din partea de sus sau, pentru o potrivire în comentariul tabelului, celula de comentariu, cât timp View Option → `Table Comment` afișează comentariile. La un zoom de `70%` sau mai mic, unde tabelele se restrâng la nume, partea esențială este numele din mijlocul tabelului.
- O coloană: rândul ei; partea esențială este celula la care duce saltul: numele coloanei, numele ei logic pentru o potrivire în numele logic sau o verificare a numelui logic, celula Domeniu pentru o verificare a domeniului ei sau comentariul în care se află o potrivire, cât timp View Option → `Column Comment` afișează comentariile. Acolo unde rândul nu desenează o astfel de celulă, saltul duce la celula desenată în locul ei: numele logic pentru nume în modul `Logical Names`, numele pentru numele logic în modul `Physical Names` și celula tipului pentru celula Domeniu cât timp opțiunea View Option → `Domain` este dezactivată sau rândul ca întreg cât timp este dezactivată și opțiunea `DataType`. La un zoom de `70%` sau mai mic, o coloană aduce în câmpul vizual tabelul ei, după regula pentru tabele.
- O celulă prea lată pentru a fi afișată întreagă, de exemplu un comentariu lung: partea esențială este textul potrivit din ea. Un salt la celula desenată în locul celei în care se află potrivirea, de exemplu la nume pentru o potrivire în numele logic în modul `Physical Names`, nu se ghidează după text.
- O relație: dreptunghiul care cuprinde cele două tabele ale ei; partea esențială este tabelul copil.
- Un grup de tabele: chenarul lui; partea esențială este bara de titlu.
- O notă sau blocul plasat de o operație Import și adăugare: elementul în întregime.

Când nicio direcție nu s-ar modifica, nu are loc nicio derulare, așa că un salt repetat la același loc nu mută nimic a doua oară. Un salt care derulează pânza înregistrează derularea în [istoricul anulărilor](./undo-redo.md#what-the-history-records), ca orice altă schimbare a poziției vizualizării, iar unul care nu mută nimic nu lasă nimic de anulat. La o operație Import și adăugare, derularea face parte din același pas ca adăugarea. Un rând din lista vizualizatorului de diferențe mută numai părțile doar în citire ale vizualizatorului, așa că nu înregistrează nimic.  
Niciun salt nu începe și nu încheie trasarea unei relații. Busola `Go to content` nu este un salt: centrează elementul spre care arată.

## Vizualizator de diferențe {#diff-viewer}

Puteți compara documente salvate anterior cu documentul curent.  
Alegeți `Diff Viewer` din meniul contextual al pânzei și selectați un document `.json` exportat anterior.

Vizualizarea se deschide peste pânză: în stânga, ce s-a modificat, apoi documentul salvat și cel curent, unul lângă altul.  
Documentul curent este comparat așa cum este în momentul deschiderii vizualizării; modificările făcute după aceea, inclusiv cele ale unui colaborator, nu ajung în vizualizare. Ambele părți se deschid și rămân în modul de afișare a numelor pe care îl vedeți, indiferent de modul pe care îl păstrează fiecare fișier (consultați [Dincolo de pânză](./logical-names.md#beyond-the-canvas)). Un [explorator](./explorer.md#when-it-stands-aside) deschis este ascuns cât timp vizualizarea este deschisă, așa că vizualizarea ocupă toată lățimea editorului.  
Fiecare parte se deplasează cu rotița mouse-ului, prin glisarea unei zone goale sau a corpului unui grup de tabele ori prin glisarea cu butonul din mijloc oriunde pe ea și se mărește sau se micșorează cu `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) sau prin ciupire. La un zoom de `70%` sau mai mic, tabelele ei se restrâng la fel ca pe pânză (consultați [Marcaje pe cele două părți](#marks-on-the-two-sides)).  
Ambele părți sunt doar în citire, așa că nimic din documentul dumneavoastră nu se modifică. Fiecare își păstrează propria selecție, iar un clic pe un tabel de acolo îl selectează doar pe acea parte.  
Închideți vizualizarea cu butonul `Close` din mesajul `Diff Viewer` care apare la deschidere sau cu `Escape`.

![Deschiderea vizualizatorului de diferențe pe un fișier .json salvat, clicuri pe rândurile marcate A, M, D și R din arborele său, filtrarea după nume și închiderea lui](/img/demo-diff-viewer.webp)

### Ce se compară {#what-is-compared}

Se compară tabelele, coloanele, indexurile, cheile străine, notele și grupurile de tabele.  
Fiecare element este asociat mai întâi după ID, așa că, față de o versiune anterioară a aceluiași fișier, care păstrează ID-urile, un tabel, o coloană, un index sau un grup de tabele redenumit rămâne un singur element, listat ca redenumit.  
Elementele rămase se asociază unu la unu după ceea ce păstrează: un tabel sau un grup de tabele după nume, ținând cont de majuscule; o coloană sau un index după tabel și nume; o cheie străină după cele două tabele și perechile de coloane; iar o notă după text, apoi după poziție. Un index fără nume se asociază după coloane, ordinea și direcția acestora și după faptul că este sau nu unic, iar un grup de tabele fără nume după cel mai mare număr de tabele comune.  
Astfel, față de un fișier de altă proveniență, de exemplu o diagramă refăcută prin import SQL, un tabel redenumit apare ca un tabel eliminat și unul adăugat.

Ce contează ca modificare:

- Un tabel: numele, comentariul, grupul de tabele, poziția și culoarea.
- O coloană: numele, comentariul, tipul de date, valoarea implicită, autoincrementarea, cheia primară, indicatorii unic și non-NULL și locul în tabel. Doar coloanele din afara ordinii comune ambelor documente contează ca mutate, așa că adăugarea, eliminarea sau mutarea unei coloane nu le marchează pe celelalte.
- Un index: numele, UNIQUE și coloanele, cu ordinea și direcția lor.
- O cheie străină: perechile de coloane, tipul de relație și acțiunile ON DELETE și ON UPDATE.
- O notă: textul, poziția, dimensiunea și culoarea.
- Un grup de tabele: numele, tabelele pe care le conține, culoarea, poziția și dimensiunea.

Astfel, un tabel, o notă sau un grup care a fost doar mutat, redimensionat sau recolorat contează ca modificat. Pozițiile și dimensiunile se compară în pixeli întregi, iar ordinea de suprapunere și punctul în care un conector întâlnește un tabel nu contează niciodată.  
Numele logice, legăturile cu domeniile și cuvintele, termenii și domeniile din fila [Dicționar](./dictionary.md) nu se compară, așa că o modificare doar a acestora nu este nici listată, nici marcată. Un tip de date modificat de un domeniu contează totuși, ca modificare a tipului de date al coloanei.

### Arborele modificărilor {#the-change-tree}

Lista din stânga este desenată ca [arborele exploratorului](./explorer.md#the-tree) și conține doar ce s-a modificat: folderele `Tables`, `Table Groups` și `Memos`, fiecare afișat doar când conține un rând, iar sub un tabel, propriile foldere `Columns`, `Indexes` și `Foreign Keys`. O cheie străină este listată sub tabelul copil, iar un tabel adăugat sau eliminat nu listează nimic în interior.  
Fiecare folder afișează câte rânduri conține, iar fiecare folder și fiecare tabel pornesc extinse.  
Rândul unui tabel sau al unei coloane este denumit în modul de afișare a numelor în care s-au deschis părțile. În modul `Both Names`, afișează numele logic urmat de nume, atenuat, iar pe un rând eliminat numele atenuat este tăiat împreună cu restul. Tabelele și grupurile de tabele sunt listate după nume, indiferent de majuscule și de modul de afișare. Notele, precum și coloanele, indexurile și cheile străine ale unui tabel, păstrează ordinea din documentul curent, iar un element eliminat este repus unde se afla. Rândul unei note afișează prima linie a notei, iar rândul unei chei străine afișează coloanele copil, apoi `→` cu tabelul părinte și coloanele acestuia, de exemplu `user_id → users(id)`. Un nume gol apare ca `unnamed`, cu caractere cursive.

Fiecare rând se termină cu o literă, iar un rând marcat cu `A`, `D`, `M` sau `R` are numele în culoarea literei:

- `A`, adăugat, în verde: doar în documentul curent.
- `D`, eliminat, în roșu și tăiat: doar în documentul salvat.
- `M`, modificat, în chihlimbar: în ambele, modificat.
- `R`, redenumit, în albastru: în ambele, cu un nume nou. O redenumire are prioritate față de orice altă modificare, pe care sfatul ecran o listează totuși.
- `~`, în chihlimbar, încheie fiecare folder și fiecare tabel listat doar pentru modificările din interiorul lui; numele lor își păstrează culoarea obișnuită.

Treceți cu indicatorul peste numele unui rând pentru a-i vedea sfatul ecran: starea, `Added`, `Deleted`, `Modified`, `Renamed` sau `Changed inside`, apoi câte o linie pentru fiecare modificare, de exemplu `Name: users → members` sau `NN: ✗ → ✓`. Un text este citat prin prima sa linie, tăiată după 40 de caractere, iar o valoare goală apare ca `—`. Sfatul ecran al unui element adăugat sau eliminat conține doar starea.

Câmpul `Filter by name`, deasupra arborelui, păstrează rândurile al căror nume curent sau salvat ori nume logic curent sau salvat conține ce tastați, indiferent de majuscule, în orice mod de afișare a numelor. Un tabel al cărui nume se potrivește își păstrează toate rândurile, iar unul al cărui nume nu se potrivește rămâne doar cu rândurile care se potrivesc. Un filtru care nu se potrivește cu nimic lasă arborele gol.  
Când cele două documente nu diferă deloc, arborele afișează `No changes`.

Glisați marginea dreaptă a arborelui pentru a-l lărgi sau îngusta, la o lățime între `200px` și `480px`, și faceți dublu clic pe margine pentru a-l readuce la o lățime de `260px`. Fiecare comparație se deschide cu o lățime de `260px`, iar cele două părți împart în mod egal restul lățimii.  
Tastatura parcurge arborele la fel ca pe cel al exploratorului (consultați [Taste în explorator](./explorer.md#keys-in-the-explorer)), dar aici `Escape`, în arbore sau în câmpul `Filter by name`, închide vizualizarea.

### Salt la o modificare {#going-to-a-change}

Faceți clic pe un rând sau apăsați `Enter` ori `Space` cu focusul tastaturii pe el pentru a merge la elementul său pe fiecare parte care îl conține: un element adăugat doar pe partea curentă, unul eliminat doar pe partea salvată și orice element comun pe ambele părți. Un rând de folder doar restrânge sau extinde folderul, la fel ca săgeata de la începutul unui rând de tabel.

- Un rând de tabel, de coloană sau de index selectează doar tabelul.
- Un rând de cheie străină aduce în câmpul vizual cele două tabele ale sale sau tabelul copil, când cele două sunt prea depărtate pentru a fi afișate împreună, selectează tabelul copil cu coloanele sale cheie străină și evidențiază conectorul (consultați [Citirea unui conector](./relationship-editing.md#reading-a-connector)).
- Un rând de notă selectează nota, iar un rând de grup de tabele selectează grupul. O notă sau un grup pe care documentul unei părți îl ascunde nu duce nicăieri pe acea parte.

Fiecare parte se mută după regula din [Unde ajunge un salt](#where-a-jump-lands), măsurată pe acea parte, așa că un nou clic pe același rând nu mută nimic.

### Marcaje pe cele două părți {#marks-on-the-two-sides}

Cele două părți colorează textul, contururile și conectorii și nu umplu nimic. Ce s-a adăugat este verde și apare doar pe partea curentă, ce s-a eliminat este roșu și apare doar pe partea salvată, iar ce s-a modificat, în chihlimbar, și ce s-a redenumit, în albastru, apar pe ambele părți. Tot ce este nemodificat se desenează ca de obicei.

- Un tabel sau un grup de tabele adăugat ori eliminat este conturat în culoarea respectivă, iar numele lui preia culoarea. O notă adăugată sau eliminată este conturată.
- O coloană adăugată sau eliminată într-un tabel prezent în ambele documente își colorează întregul rând, iar o coloană care s-a mutat își colorează întregul rând în chihlimbar. Nimic din interiorul unui tabel adăugat sau eliminat nu este marcat separat.
- Textul unei celule modificate devine chihlimbar: comentariul unui tabel, comentariul, tipul de date, valoarea implicită sau indicatorii de autoincrementare, unic ori non-NULL ai unei coloane ori textul unei note. O modificare a cheii primare colorează în chihlimbar pictograma cheii coloanei.
- Un tabel, o coloană sau un grup de tabele redenumit are numele în albastru.
- Un tabel, o notă sau un grup de tabele cu o modificare care nu are o celulă proprie, de exemplu o mutare, o dimensiune sau o culoare nouă ori o schimbare de grup sau a tabelelor unui grup, este conturat în chihlimbar.
- O cheie străină adăugată, eliminată sau modificată își desenează conectorul în culoarea respectivă. Trecerea indicatorului peste el sau evidențierea declanșată de un rând îl desenează în schimb în culoarea obișnuită de evidențiere la trecerea indicatorului.
- O modificare de index nu marchează nimic pe niciuna dintre părți; apare doar în arbore.

Fiecare parte respectă opțiunile de afișare ale propriului document. O modificare într-o celulă pe care acea parte nu o desenează apare în schimb pe nume. O modificare de coloană într-o celulă pe care o opțiune de afișare o ascunde, de exemplu `Unique` sau `Auto Increment`, ambele dezactivate implicit, colorează numele coloanei în chihlimbar, la fel ca o modificare a cheii primare pe un rând care nu afișează pictograma cheii. O modificare a comentariului tabelului cât timp opțiunea `Table Comment` este dezactivată colorează numele tabelului în chihlimbar. Albastrul unei redenumiri are prioritate față de acest chihlimbar. O notă sau un grup de tabele pe care documentul său îl ascunde este listat în arbore, dar nu este desenat pe acea parte.

În modul `Logical Names`, care nu desenează nicio celulă de nume, albastrul unei redenumiri și chihlimbarul unei modificări într-o celulă pe care partea nu o desenează se aplică numelui logic desenat în locul numelui. O modificare a tipului de date colorează celula tipului în chihlimbar în orice mod de afișare, chiar și acolo unde celula afișează numele unui domeniu. Niciuna dintre părți nu desenează culorile pe care verificările dicționarelor le dau numelor pe pânză (consultați [Marcaje pe pânză](./dictionary.md#marks-on-the-canvas)).

La un zoom de `70%` sau mai mic, tabelele restrânse își păstrează conturul. Numele păstrează verdele sau roșul unui tabel adăugat ori eliminat sau albastrul unei redenumiri și, în rest, preia chihlimbarul unei modificări de comentariu. Modificările de coloane nu sunt desenate până când nu măriți din nou; arborele le listează în continuare.
