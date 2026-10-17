---
sidebar_position: 14
description: Sincronizarea tipului de date în relații, lățimea maximă a comentariilor, recalcularea lățimii tabelelor, blocarea setărilor (vizualizare, filă și setări de cod), ordinea de afișare a coloanelor și lista comenzilor rapide.
---

# Setări

Deschideți fila Setări cu butonul `Settings` din bara de instrumente sau din [căutarea rapidă](./quick-search.md), sub comanda `Tab`.
Ecranul Setări are două file: `Preferences` și `Shortcuts`. Fila `Preferences` se deschide prima, cu excepția rândului `Shortcuts` din [ecranul de bun venit](./editing-start.md#welcome-screen), care deschide fila `Shortcuts`.

Tema și limba de afișare nu se află pe acest ecran. Ele se deschid cu butoanele `Theme` și `Display Language` din bara de instrumente (consultați [Limbă și temă](./language-and-theme.md)).

## Sincronizare tip de date în relații {#relationship-datatype-sync}

Determină dacă tipurile de date se sincronizează. Setarea este activată implicit.
Modificarea tipului de date al unei coloane îl aplică atunci fiecărei coloane legate de ea printr-o relație, urmând lanțul de la ambele capete, astfel încât o cheie străină nu ajunge niciodată să difere de cheia la care face referire.
De la o cheie la cheile ei străine, un tip serial ajunge ca tipul întreg pe care îl stochează, la fel ca la trasarea unei relații (consultați [Relații identificatoare](./relationship-editing.md#identifying-relationships)). Astfel, schimbarea unei chei în `serial` dă cheilor ei străine tipul `integer` în PostgreSQL, iar modificarea continuă de acolo în josul lanțului.
De la o cheie străină înapoi la cheia ei, tipul ajunge așa cum este scris, cu excepția faptului că o cheie de tip serial își păstrează tipul, iar modificarea se oprește acolo.
Și caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) urmează această setare: cât timp setarea este activată, fiecare coloană existentă pe care o mapează primește tipul pe care cheia ei părinte îl dă unei chei străine, iar modificarea continuă de-a lungul relațiilor ca mai sus. Cât timp setarea este dezactivată sau când cheia nu are tip de date, coloana își păstrează propriul tip.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Setarea de sincronizare a tipului de date în relații" loading="lazy" />

![Schimbarea coloanei members.id în BIGINT UNSIGNED, care actualizează fiecare member_id legat de ea](/img/demo-relationship-data-type-sync.webp)

## Lățime maximă comentarii {#maximum-comment-width}

Specifică lățimea maximă a coloanei de comentarii, în pixeli (`60` ~ `200`).
Dezactivarea comutatorului elimină limita, iar cât timp comutatorul este dezactivat, câmpul de introducere este și el dezactivat.
La activare, valoarea pornește de la `60px`. O valoare tastată în afara intervalului este adusă la cea mai apropiată limită.

![Activarea opțiunii Maximum comment width, introducerea valorii 120 și fila ERD cu comentariile trunchiate la această lățime](/img/demo-settings-comment-width.webp)

## Recalculare lățime tabele {#recalculation-table-width}

Apăsați butonul `Sync` pentru a recalcula lățimea fiecărui tabel și a fiecărei celule de coloană după textul său actual și pentru a redesena conectorii relațiilor în jurul noilor dimensiuni.
Notificarea `Recalculated table width` confirmă acest lucru.
Lățimile se recalculează automat de fiecare dată când se încarcă un document, așa că acest pas este necesar doar când o schimbare de font sau de redare le-a lăsat neactualizate.
Lățimile nu se salvează în fișier, așa că butonul `Sync` nu îl modifică niciodată.

## Blocare {#lock}

Lista `Lock` conține șase setări. Cât timp blocarea unei setări este activată, fișierul păstrează valoarea pe care setarea o avea în momentul blocării, așa că modificarea ei pe ecran lasă fișierul neschimbat.

| Rând | Ce păstrează fișierul | Într-o diagramă nouă |
| --- | --- | --- |
| `Viewport` | Nivelul de zoom și poziția vizualizării pe pânza ERD, ca o singură blocare | `100% · 0, 0` |
| `Canvas Type` | Fila în care se deschide diagrama: `ERD`, `Visualization`, `Schema SQL` sau `Code Generator` | `ERD` |
| `Language` | Limbajul [generatorului de cod](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | [Stilul de denumire a tabelelor](./code-generator.md#name-case) din generatorul de cod | `Pascal` |
| `Column Name Case` | [Stilul de denumire a coloanelor](./code-generator.md#name-case) din generatorul de cod | `Camel` |
| `Bracket Type` | Opțiunea `Bracket` din fila [Schemă SQL](./schema-sql.md#database-and-bracket) și din țintele [generatorului de cod](./code-generator.md#bracket) care o oferă | `None` |

Fiecare rând afișează o valoare și un buton de blocare, iar un clic pe buton activează sau dezactivează doar acea blocare.
Cât timp o blocare este activată, butonul afișează un lacăt închis cu sfatul ecran `Unlock Viewport` (și așa mai departe pentru fiecare rând), iar valoarea, cu sfatul ecran `Locked value`, este cea pe care o păstrează fișierul.
Cât timp blocarea este dezactivată, butonul afișează un lacăt deschis cu sfatul ecran `Lock Viewport`, iar valoarea, estompată, cu sfatul ecran `Current value`, este setarea așa cum este în acest moment.
Rândul `Viewport` afișează zoomul și apoi poziția vizualizării, de exemplu `75% · -40, 91`. Poziția vizualizării este punctul de pe ecran, în pixeli, în care se află punctul `0, 0` al diagramei, iar o coordonată de o mie sau mai mult este prescurtată, ca în `1.2k` sau `-24k`.

Blocarea preia setarea așa cum este în acel moment.
Cât timp o blocare este activată, setarea funcționează în continuare pe ecran: puteți derula și modifica zoomul, comuta filele și alege alt limbaj, alt stil de denumire sau alt delimitator din meniuri, din panourile de opțiuni sau din căutarea rapidă.
Fișierul păstrează însă valoarea blocată, iar rândul continuă să o afișeze, așa că diagrama se redeschide la vizualizarea blocată, în fila blocată, cu limbajul, stilurile de denumire și delimitatorul blocate. Și un export JSON scrie valorile blocate.
Pentru a salva ce arată ecranul, dezactivați blocarea, iar de atunci înainte fișierul urmează setarea: cu rândul `Viewport` deblocat, diagrama se deschide acolo unde ați lăsat-o. Pentru a bloca în schimb o valoare nouă, de exemplu o nouă vizualizare de pornire, dezactivați blocarea și activați-o din nou.
Dacă vizualizarea blocată nu arată nicio parte a diagramei la deschiderea fișierului, ecranul se mută totuși pe diagramă, iar valoarea blocată rămâne neschimbată.
Rândul `Canvas Type` nu păstrează niciodată fila Setări. Blocarea lui reține ultima filă, alta decât Setări, în care v-ați aflat, iar cât timp este deblocat, rândul afișează numele acelei file.

![Deblocarea rândului Viewport, derularea diagramei și modificarea zoomului, apoi blocarea lui din nou la noua vizualizare afișată de rând](/img/demo-settings-locks.webp)

Activarea sau dezactivarea unei blocări modifică fișierul, deoarece fișierul stochează ce blocări sunt activate, dar, ca restul filei Setări, nu se înregistrează în [istoricul anulărilor](./undo-redo.md#what-the-history-records). Într-un editor doar în citire, butoanele de blocare nu au niciun efect.
Orice altă setare se salvează așa cum este: baza de date, comutatoarele din [`View Option`](./table-related-functions.md#table-view-options) și restul filei `Preferences`.

Toate blocările sunt activate într-o diagramă nouă, una pornită de la zero: un fișier gol deschis în VS Code, Obsidian sau un IDE JetBrains (în Obsidian, `ERD Editor: Create new diagram` și `New ERD` creează un astfel de fișier), o schemă nouă în aplicația web, un fișier creat din meniul New din Google Drive sau un element `<erd-editor>` căruia nu i s-a dat nicio valoare.
O schemă sau un fișier Google Drive pe care aplicația web îl creează importând un fișier SQL, DBML, AML sau GraphQL pornește, de asemenea, cu toate blocările activate. Cele create dintr-un fișier JSON păstrează blocările înregistrate în acel fișier.
Un fișier pe care îl deschideți păstrează blocările cu care a fost salvat, fiecare la valoarea sa blocată.
Un fișier care nu înregistrează nicio blocare, de exemplu unul salvat de o versiune anterioară blocărilor sau scris de mână, se deschide cu toate blocările activate: vizualizarea la `100% · 0, 0` și fila `ERD`, indiferent de vizualizarea și fila pe care le-a salvat, iar limbajul, stilurile de denumire și tipul de delimitator, blocate așa cum le-a salvat.
Un import prin elementul `Import`, care înlocuiește diagrama, setează și el blocările: un fișier JSON aduce blocările pe care le înregistrează și valorile pe care acestea le rețin, iar un fișier SQL, DBML, AML sau GraphQL vă păstrează blocările, dar readuce vizualizarea la `100% · 0, 0`, blocată sau nu (consultați [Importarea fișierelor externe](./file-import-export.md#importing-external-files)). Anularea importului readuce blocările și valorile blocate pe care le-a înlocuit.

O modificare pe care o blocare o ține în afara fișierului nu este considerată o modificare. VS Code nu marchează fila ca modificată, iar Obsidian și un IDE JetBrains lasă fișierul neschimbat, atât când salvează automat, cât și când fila se închide.
Astfel, cu toate blocările activate, explorarea unei diagrame, comutarea filelor și încercarea altui limbaj, a altui stil de denumire sau a altui delimitator nu apar niciodată în `git diff`.
Cu rândul `Viewport` deblocat, derularea și zoomul modifică fișierul, iar cu rândul `Canvas Type` deblocat, la fel face și comutarea filelor, inclusiv trecerea la fila Setări.
Fișierul gol al unei diagrame noi rămâne gol până la prima modificare pe care o păstrează fișierul: o editare, o modificare a unei setări pe care nu o reține nicio blocare sau o blocare activată ori dezactivată.
Deschiderea unei diagrame și închiderea ei fără o astfel de modificare lasă fișierul neschimbat, indiferent de versiunea sau de computerul care l-a scris. Fișierul conține doar ceea ce este diagrama, într-o ordine fixă, iar un fișier salvat într-o formă mai veche este rescris o singură dată în această formă, la prima sa modificare de acest fel (consultați [Forma de stocare și valoarea de execuție](../../api/advanced/schema.md#storage-form-and-runtime-value)).
În VS Code, o revizie redeschisă ca diagramă cu `Reopen Editor With...`, de exemplu o revizie Git sau o intrare din Local History, este doar în citire și nu este marcată niciodată ca modificată.
În Google Drive, o derulare, un zoom sau trecerea la altă filă nu se salvează niciodată de sine stătător, indiferent dacă setările sunt blocate sau nu. Cu rândul `Viewport` deblocat, vizualizarea se scrie doar împreună cu o altă modificare, așa că un fișier Drive se deschide acolo unde era vizualizarea la ultima salvare, iar același lucru este valabil pentru filă, cu rândul `Canvas Type` deblocat.

Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), activarea sau dezactivarea unei blocări ajunge la toate editoarele, iar o blocare păstrează valoarea editorului care a activat-o.
Deblocarea rândului `Language`, a unui stil de denumire sau a rândului `Bracket Type` dă fiecărui editor valoarea afișată în editorul care a făcut deblocarea, astfel încât toate salvează aceeași valoare. Deblocarea rândului `Viewport` sau `Canvas Type` nu mută nici vizualizarea, nici fila nimănui.
Un agent de programare care lucrează prin serverul MCP nu are niciun instrument pentru blocări sau pentru setările pe care acestea le rețin și citește un limbaj, un stil de denumire sau un tip de delimitator blocat la valoarea păstrată de fișier. Doar importurile sale în modul `replace` ajung la ele, la fel ca elementul `Import` (consultați [Setări](../../mcp/tools.md#settings) și [Import](../../mcp/tools.md#import)).

## Ajustarea ordinii coloanelor {#adjusting-column-order}

Stabilește ordinea de afișare a coloanelor în tabele.
Glisați un rând pentru a-l muta: întregul rând poate fi glisat, iar pictograma de prindere îl marchează. Cele șapte rânduri, în ordinea lor implicită, sunt `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` și `Comment`.
O celulă ascunsă de o [opțiune de afișare a tabelelor](./table-related-functions.md#table-view-options) își păstrează locul în listă, așa că ordinea se aplică celulelor afișate, oricare ar fi acestea.
Marcajul de [cheie alternativă](./table-related-functions.md#alternate-keys) (`AK1.1` și așa mai departe) nu este unul dintre aceste rânduri. Se află mereu ultimul într-un rând, după celula pe care această ordine o pune ultima, oricare ar fi ea.

![Derularea în jos până la Column Order și glisarea rândului Comment în sus, sub Name, ceea ce pune fiecare comentariu imediat după numele coloanei sale](/img/demo-settings-column-order.webp)

## Comenzi rapide {#shortcuts}

Fila `Shortcuts` este un tabel doar în citire cu coloanele `Command` și `Keybinding`, care listează combinațiile de taste pentru platforma pe care o folosiți.

| Comandă | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` apoi `G` | `T` apoi `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Majoritatea acestora funcționează doar în fila ERD și sunt suspendate cât timp este deschisă căutarea rapidă, panoul Proprietăți tabel, vizualizatorul de diferențe, previzualizarea aranjării automate, călătoria în timp, caseta de dialog [`Export image`](./file-import-export.md#image) sau caseta de dialog [`Map Columns`](./relationship-editing.md#map-columns).
Comenzile `Search`, `Toggle Explorer` și `Stop` sunt excepțiile: `Search` comută căutarea rapidă din orice filă, `Toggle Explorer` deschide [exploratorul](./explorer.md#opening-and-closing) la câmpul său de căutare din orice filă și afișează fila ERD, iar `Stop` este cea care închide căutarea rapidă, panoul Proprietăți tabel, vizualizatorul de diferențe, previzualizarea aranjării automate, călătoria în timp, caseta de dialog `Export image`, caseta de dialog `Map Columns`, configuratorul de teme, selectorul `Display Language`, selectorul de culori și un meniu contextual deschis.
Comanda `Toggle Explorer` închide din nou exploratorul cât timp acesta este deschis în fila ERD și nu este ascuns de modul Zen, la fel ca butonul `Explorer` din bara de instrumente. Cu căutarea rapidă, panoul Proprietăți tabel, configuratorul de teme, selectorul `Display Language`, caseta de dialog `Export image` sau caseta de dialog `Map Columns` deschise, închide în schimb ce este deschis și mută focusul tastaturii în câmpul de căutare al exploratorului.
Comanda `Toggle Explorer` nu are niciun efect cât timp se editează o celulă, o notă sau numele unui grup de tabele. Cât timp este deschis vizualizatorul de diferențe, previzualizarea aranjării automate sau călătoria în timp, comanda își lasă tasta browserului sau aplicației gazdă (consultați [Bara de căutare a browserului](./find-and-replace.md#the-browsers-find-bar)).
În fila ERD, comanda `Stop` încheie editarea în curs a unei celule sau a unei note, închide editorul de nume al unui [grup de tabele](./table-groups.md) fără a redenumi grupul sau anulează o relație ori un grup `New Table Group` aflat în curs de trasare și lasă selecția neschimbată. Dacă niciuna dintre acestea nu este deschisă, deselectează tot, scoate focusul de pe celula activă și, la aceeași apăsare, închide un selector de culori deschis. Un configurator de teme sau un selector `Display Language` deschis se închide la aceeași apăsare în ambele cazuri.
Un explorator, un configurator de teme sau un selector `Display Language` deschis nu suspendă niciuna dintre comenzile rapide de pe pânză. Comanda `Stop` nu închide niciodată exploratorul. Pentru ce fac `Stop` și celelalte taste în explorator, consultați [Taste în explorator](./explorer.md#keys-in-the-explorer), iar pentru selector, consultați [Alegerea unei limbi](./language-and-theme.md#picking-a-language).
Comanda `Delete Selection` elimină fiecare tabel, notă și grup de tabele selectat sau, când este selectat un singur tabel împreună cu unele dintre coloanele sale și zoomul depășește `70%`, acele coloane (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)). Comanda `Remove Table, Memo` elimină și grupurile de tabele selectate.
Comanda `Add Table Group` pornește trasarea unui grup [`New Table Group`](./table-groups.md#drawing-a-group), la fel ca butonul `New Table Group` din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar), iar o a doua apăsare anulează trasarea. Comanda `Group Selected Tables` constă în două apăsări fără tastă de modificare, `T` apoi `G`, la cel mult o secundă după `T`. Ea pune tabelele selectate într-un grup nou și îi deschide editorul de nume, la fel ca elementul `Group selected tables` din meniul contextual al unui tabel, și nu are niciun efect când nu este selectat niciun tabel (consultați [Gruparea tabelelor selectate](./table-groups.md#grouping-selected-tables)). Niciuna dintre ele nu are vreun efect într-un editor doar în citire sau cât timp grupurile sunt [ascunse](./table-groups.md#hiding-groups).
Comenzile `Zoom In`, `Zoom Out` și `Zoom Reset` modifică zoomul și în fila [Vizualizare](./visualization.md#toolbar), atât în modul `Graph`, cât și în `Flow`, cu excepția cazului în care este deschisă căutarea rapidă.
În fila Vizualizare, comanda `Stop` închide și meniul de [afișare a rândurilor](./visualization.md#row-display) și anulează o [aranjare în modul Flux](./visualization.md#how-flow-is-placed) care încă rulează; nu lărgește o vizualizare restrânsă cu `Focus on this table`.
Comanda `Focus on this table` deschide fila Vizualizare în modul `Flow`, restrânsă la tabelele selectate și la fiecare tabel aflat la o relație distanță, și nu are niciun efect când nu este selectat niciun tabel (consultați [Focalizarea pe tabele](./visualization.md#focusing-on-tables)).
Comenzile `Select All Table, Memo`, `Hand Tool`, `Delete Selection` și `Group Selected Tables` lasă loc cursorului de text: cât timp editați o celulă sau o notă ori tastați într-un câmp de text, de exemplu câmpul Găsire al exploratorului, `Ctrl + A` (Windows/Linux) sau `⌘ + A` (Mac) selectează textul, `Space` tastează un spațiu, `Delete` și `Backspace` șterg text, iar `T` apoi `G` tastează cele două litere.
Copierea și lipirea folosesc combinațiile proprii ale browserului, `Ctrl + C` și `Ctrl + V` (Windows/Linux) sau `⌘ + C` și `⌘ + V` (Mac), așa că nu apar în această listă (consultați [Editarea tabelelor](./table-editing.md)).

Combinațiile de taste nu pot fi modificate din această filă.
O aplicație gazdă care încorporează editorul le reasociază cu [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), cu excepția comenzilor `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` și `Zoom Reset`, care sunt fixe.
Fila `Shortcuts` listează atunci combinațiile aplicației gazdă: o comandă pe care gazda nu o reasociază își păstrează combinația implicită, iar una pe care gazda nu o asociază niciunei taste nu afișează niciuna.

În Obsidian, aceste taste ajung la editor de fiecare dată când fila Obsidian a diagramei este activă, chiar și acolo unde o comandă rapidă din Obsidian folosește aceeași tastă, de exemplu `Alt + Enter`, `Ctrl + K` și `Ctrl + F` (Windows/Linux) sau `⌥ + Enter`, `⌘ + K` și `⌘ + F` (Mac). Toate celelalte comenzi rapide din Obsidian funcționează în continuare acolo. Pentru `Ctrl + F` sau `⌘ + F`, consultați [Bara de căutare a browserului](./find-and-replace.md#the-browsers-find-bar).
